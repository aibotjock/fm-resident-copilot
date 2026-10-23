import { AccessError, type Limits, type UsageStore } from "./access-policy";

type Client = { query: (sql: string, args?: unknown[]) => Promise<{ rows: any[] }>; release: (error?: boolean) => void };
type Pool = { connect: () => Promise<Client>; query: Client["query"] };
// Transactions serialize admission across replicas; counters survive restarts.
export class PostgresUsageStore implements UsageStore {
  private ready?: Promise<void>;
  private pool: Pool;
  constructor(pool: Pool) { this.pool = pool; }
  private async initialize() {
    if (!this.ready) this.ready = (async () => {
      const client = await this.pool.connect();
      try {
      await client.query("SELECT pg_advisory_lock(1984632, 4)");
      await client.query(`CREATE TABLE IF NOT EXISTS clinical_usage_limits (
        scope text PRIMARY KEY, day date NOT NULL DEFAULT CURRENT_DATE,
        minute bigint NOT NULL DEFAULT 0, minute_requests bigint NOT NULL DEFAULT 0,
        requests bigint NOT NULL DEFAULT 0, tokens bigint NOT NULL DEFAULT 0,
        lifetime_tokens bigint NOT NULL DEFAULT 0, admin_started_at timestamptz)`);
      await client.query(`CREATE TABLE IF NOT EXISTS clinical_usage_leases (
        id uuid PRIMARY KEY, principal text NOT NULL, expires_at timestamptz NOT NULL)`);
      } finally { await client.query("SELECT pg_advisory_unlock(1984632, 4)").catch(() => {}); client.release(true); }
    })().catch(error => { this.ready = undefined; throw error; });
    await this.ready;
  }
  async reserve(id: string, principal: string, limits: Limits, tokens: number) {
    await this.initialize(); const client = await this.pool.connect();
    try {
      await client.query("BEGIN");
      await client.query("SELECT pg_advisory_xact_lock(1984632, 1)");
      await client.query("DELETE FROM clinical_usage_leases WHERE expires_at <= NOW()");
      const active = await client.query("SELECT COUNT(*) AS total, COUNT(*) FILTER (WHERE principal=$1) AS own FROM clinical_usage_leases", [principal]);
      if (Number(active.rows[0].total) >= limits.globalConcurrency || Number(active.rows[0].own) >= limits.principalConcurrency) throw new AccessError(429, "Clinical concurrency limit reached");
      for (const [scope, rate, requests, dailyTokens, lifetime] of [
        ["global", limits.globalMinute, limits.globalRequests, limits.globalTokens, limits.globalLifetime],
        [`principal:${principal}`, limits.principalMinute, limits.principalRequests, limits.principalTokens, limits.principalLifetime],
      ] as const) {
        await client.query("INSERT INTO clinical_usage_limits(scope) VALUES($1) ON CONFLICT DO NOTHING", [scope]);
        // Use database UTC time, not client clocks, for window boundaries.
        await client.query(`UPDATE clinical_usage_limits SET
          requests=CASE WHEN day=(NOW() AT TIME ZONE 'UTC')::date THEN requests ELSE 0 END,
          tokens=CASE WHEN day=(NOW() AT TIME ZONE 'UTC')::date THEN tokens ELSE 0 END,
          day=(NOW() AT TIME ZONE 'UTC')::date,
          minute_requests=CASE WHEN minute=FLOOR(EXTRACT(EPOCH FROM NOW())/60)::bigint THEN minute_requests ELSE 0 END,
          minute=FLOOR(EXTRACT(EPOCH FROM NOW())/60)::bigint WHERE scope=$1`, [scope]);
        const { rows } = await client.query("SELECT * FROM clinical_usage_limits WHERE scope=$1 FOR UPDATE", [scope]);
        const u = rows[0];
        if (Number(u.minute_requests) + 1 > rate || Number(u.requests) + 1 > requests || Number(u.tokens) + tokens > dailyTokens || Number(u.lifetime_tokens) + tokens > lifetime) throw new AccessError(429, "Clinical usage budget reached");
        await client.query("UPDATE clinical_usage_limits SET minute_requests=minute_requests+1, requests=requests+1, tokens=tokens+$2, lifetime_tokens=lifetime_tokens+$2 WHERE scope=$1", [scope, tokens]);
      }
      // Provider timeout is shorter than this crash-recovery lease. No refund:
      // failed, aborted and retried HTTP requests still consume their reservation.
      await client.query("INSERT INTO clinical_usage_leases(id,principal,expires_at) VALUES($1,$2,NOW()+($3::bigint * INTERVAL '1 millisecond'))", [id, principal, limits.durationMs + 30_000]);
      await client.query("COMMIT");
    } catch (error) { await client.query("ROLLBACK"); throw error; }
    finally { client.release(); }
  }
  async release(id: string) { await this.pool.query("DELETE FROM clinical_usage_leases WHERE id=$1", [id]); }
  async admin() {
    await this.initialize(); const client = await this.pool.connect(); let locked = false;
    try {
      const result = await client.query("SELECT pg_try_advisory_lock(1984632, 2) AS locked");
      locked = result.rows[0].locked;
      if (!locked) throw new AccessError(429, "A reference administration task is already running");
      await client.query("INSERT INTO clinical_usage_limits(scope) VALUES('admin') ON CONFLICT DO NOTHING");
      const resultRate = await client.query(`UPDATE clinical_usage_limits SET admin_started_at=NOW()
        WHERE scope='admin' AND (admin_started_at IS NULL OR admin_started_at < NOW()-INTERVAL '1 hour') RETURNING scope`);
      if (!resultRate.rows.length) throw new AccessError(429, "Reference administration is limited to one task per hour");
      return async () => { try { await client.query("SELECT pg_advisory_unlock(1984632, 2)"); } finally { client.release(true); } };
    } catch (error) {
      if (locked) await client.query("SELECT pg_advisory_unlock(1984632, 2)").catch(() => {});
      client.release(true); throw error;
    }
  }
}
