# Clinical access and usage limits

The paid clinical routes require an operator-issued bearer access token. No clinical credential is bundled in the client or stored in browser/device persistence. The app asks for the token, verifies it with the server, and holds it in memory until locked or closed. Provider API keys stay on the server and are not valid clinical access tokens.

Configure `CLINICAL_ACCESS_TOKENS_SHA256` on the server as a JSON object mapping a stable operator/principal ID to the lowercase SHA-256 digest of that principal's high-entropy access token. Each token must have at least 32 URL-safe characters. Limit IDs to letters, digits, underscore and hyphen. Empty, malformed or absent configuration disables clinical access. Changing/removing the digest revokes the token. Keep stable principal IDs when rotating credentials so rotation does not reset usage counters. Never put tokens or this mapping in `EXPO_PUBLIC_*` variables.

Existing `FM_REFERENCE_ADMIN_TOKEN` remains a separate administrator credential and must contain at least 32 characters. It is never sent by the clinical client. Admin status and indexing require this credential; indexing is limited to one task per hour, persisted in PostgreSQL, and serialized across replicas. All ingestion paths, including startup, also share a database advisory lock. Reindexing returns only after completion.

The existing application PostgreSQL database stores `clinical_usage_limits` and `clinical_usage_leases`, created lazily at authenticated admission. Its service role must be able to create these tables, or an operator must create them before enabling the service. Database/admission failure denies the request before any provider call. Do not clear these tables as routine maintenance: lifetime counters are deliberate spending ceilings.

Default limits (positive integer server overrides):

| Setting | Default |
| --- | ---: |
| `CLINICAL_PRINCIPAL_REQUESTS_PER_MINUTE` | 5 |
| `CLINICAL_GLOBAL_REQUESTS_PER_MINUTE` | 20 |
| `CLINICAL_PRINCIPAL_REQUESTS_PER_DAY` | 100 |
| `CLINICAL_GLOBAL_REQUESTS_PER_DAY` | 300 |
| `CLINICAL_PRINCIPAL_TOKENS_PER_DAY` | 1000000 |
| `CLINICAL_GLOBAL_TOKENS_PER_DAY` | 5000000 |
| `CLINICAL_PRINCIPAL_LIFETIME_TOKENS` | 10000000 |
| `CLINICAL_GLOBAL_LIFETIME_TOKENS` | 50000000 |
| `CLINICAL_PRINCIPAL_CONCURRENCY` | 1 |
| `CLINICAL_GLOBAL_CONCURRENCY` | 4 |
| `CLINICAL_MAX_DURATION_MS` | 90000 (maximum 120000) |

Budgets reserve 74240 tokens before retrieval/provider work: at most 64000 UTF-8 prompt bytes, 8192 output tokens, and a 2048-token framing allowance. UTF-8 bytes conservatively bound ordinary text tokenization. Provider messages are checked against the byte bound; output caps are fixed at 2048 for vignettes and 8192 for query responses. SDK retries are disabled. Aborted, failed or empty-result requests retain the reservation to avoid refund/race abuse. Therefore the token ceiling will normally stop usage before the request-count ceiling. These are conservative token-usage budgets, not provider dollar/account limits; configure provider-side spending controls too.

Minute windows and daily resets use database UTC time. Lifetime usage never resets automatically. Global/principal counters and concurrency admission are atomic across replicas. A disconnected or timed-out request aborts upstream work; its local lease is released when the handler settles. Crash leases expire after the request deadline plus 30 seconds. Provider-side cancellation and final billing are controlled by the provider; the full token reservation is retained regardless.

Tests use synthetic local credentials, a provider stub and a transactional usage-store stub. No provider request or production database is needed. Run with the workspace's TypeScript runner: `node --import tsx --test artifacts/api-server/test/*.test.ts`.
