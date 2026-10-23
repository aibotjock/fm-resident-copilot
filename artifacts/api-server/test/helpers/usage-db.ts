export class Database {
  rows = new Map<string, any>(); leases = new Map<string, any>(); clock = 1_800_000_000_000; adminLock = false;
  private tail: Promise<void> = Promise.resolve();
  async connect() {
    let snapshot: any; let releaseTransaction: (() => void) | undefined; let heldAdmin = false;
    const query = async (sql: string, args: any[] = []): Promise<{ rows: any[] }> => {
      const q = sql.replace(/\s+/g, " ").trim();
      if (q.startsWith("CREATE TABLE") || q.includes("advisory_lock(1984632, 4)") || q.includes("advisory_unlock(1984632, 4)")) return { rows: [] };
      if (q === "BEGIN") return { rows: [] };
      if (q.includes("advisory_xact_lock")) {
        const previous = this.tail; this.tail = new Promise<void>(resolve => { releaseTransaction = resolve; }); await previous;
        snapshot = { rows: structuredClone(this.rows), leases: structuredClone(this.leases) }; return { rows: [] };
      }
      if (q === "ROLLBACK") { if (snapshot) { this.rows = snapshot.rows; this.leases = snapshot.leases; } releaseTransaction?.(); releaseTransaction = undefined; return { rows: [] }; }
      if (q === "COMMIT") { releaseTransaction?.(); releaseTransaction = undefined; return { rows: [] }; }
      if (q.startsWith("DELETE FROM clinical_usage_leases WHERE expires")) { for (const [id, lease] of this.leases) if (lease.expires <= this.clock) this.leases.delete(id); return { rows: [] }; }
      if (q.startsWith("SELECT COUNT")) return { rows: [{ total: this.leases.size, own: [...this.leases.values()].filter(l => l.principal === args[0]).length }] };
      if (q.startsWith("INSERT INTO clinical_usage_limits")) { const scope = args[0] ?? "admin"; if (!this.rows.has(scope)) this.rows.set(scope, { requests: 0, tokens: 0, lifetime_tokens: 0, minute_requests: 0, day: Math.floor(this.clock / 86400000), minute: Math.floor(this.clock / 60000) }); return { rows: [] }; }
      if (q.startsWith("UPDATE clinical_usage_limits SET requests=CASE")) { const row = this.rows.get(args[0]); const day = Math.floor(this.clock / 86400000), minute = Math.floor(this.clock / 60000); if (row.day !== day) { row.requests = 0; row.tokens = 0; row.day = day; } if (row.minute !== minute) { row.minute_requests = 0; row.minute = minute; } return { rows: [] }; }
      if (q.startsWith("SELECT * FROM clinical_usage_limits")) return { rows: [{ ...this.rows.get(args[0]) }] };
      if (q.startsWith("UPDATE clinical_usage_limits SET minute_requests=minute_requests+1")) { const row = this.rows.get(args[0]); row.requests++; row.minute_requests++; row.tokens += args[1]; row.lifetime_tokens += args[1]; return { rows: [] }; }
      if (q.startsWith("INSERT INTO clinical_usage_leases")) { this.leases.set(args[0], { principal: args[1], expires: this.clock + args[2] }); return { rows: [] }; }
      if (q.startsWith("DELETE FROM clinical_usage_leases WHERE id")) { this.leases.delete(args[0]); return { rows: [] }; }
      if (q.includes("pg_try_advisory_lock(1984632, 2)")) { heldAdmin = !this.adminLock; if (heldAdmin) this.adminLock = true; return { rows: [{ locked: heldAdmin }] }; }
      if (q.includes("pg_advisory_unlock(1984632, 2)")) { if (heldAdmin) this.adminLock = false; heldAdmin = false; return { rows: [] }; }
      if (q.startsWith("UPDATE clinical_usage_limits SET admin_started_at")) { const row = this.rows.get("admin"); if (row.admin_started_at !== undefined && row.admin_started_at >= this.clock - 3600000) return { rows: [] }; row.admin_started_at = this.clock; return { rows: [{ scope: "admin" }] }; }
      throw new Error(`Unexpected test SQL: ${q}`);
    };
    return { query, release: () => { if (heldAdmin) this.adminLock = false; releaseTransaction?.(); } };
  }
  async query(sql: string, args?: unknown[]) { const client = await this.connect(); try { return await client.query(sql, args); } finally { client.release(); } }
}
