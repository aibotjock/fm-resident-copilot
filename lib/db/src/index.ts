import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  options: "-c search_path=fm_copilot_restored,public",
});
export const db = drizzle(pool, { schema });

export * from "./schema";

// Separate tables preserve the current app's reference index during restoration.
export async function initializeRestoredDatabase(): Promise<void> {
  await pool.query(`
    CREATE SCHEMA IF NOT EXISTS fm_copilot_restored;
    CREATE TABLE IF NOT EXISTS fm_copilot_restored.guideline_chunks (
      id serial PRIMARY KEY,
      source text NOT NULL,
      tier integer NOT NULL DEFAULT 1,
      guideline_title text NOT NULL,
      guideline_year text,
      abfm_domain text NOT NULL,
      section text NOT NULL,
      content text NOT NULL,
      url text,
      content_tsv tsvector GENERATED ALWAYS AS
        (to_tsvector('english', coalesce(guideline_title, '') || ' ' || coalesce(content, ''))) STORED
    );
    ALTER TABLE fm_copilot_restored.guideline_chunks
      ADD COLUMN IF NOT EXISTS review_status text NOT NULL DEFAULT 'unreviewed',
      ADD COLUMN IF NOT EXISTS reviewed_at date,
      ADD COLUMN IF NOT EXISTS publication_date text,
      ADD COLUMN IF NOT EXISTS review_note text,
      ADD COLUMN IF NOT EXISTS reviewed_tsv tsvector GENERATED ALWAYS AS
        (to_tsvector('english', coalesce(guideline_title, '') || ' ' || coalesce(section, '') || ' ' || coalesce(content, ''))) STORED;
    CREATE INDEX IF NOT EXISTS restored_guideline_fts_idx
      ON fm_copilot_restored.guideline_chunks USING gin(content_tsv);
    CREATE INDEX IF NOT EXISTS restored_reviewed_fts_idx
      ON fm_copilot_restored.guideline_chunks USING gin(reviewed_tsv);
    CREATE TABLE IF NOT EXISTS fm_copilot_restored.rag_metadata (
      key text PRIMARY KEY,
      value text NOT NULL,
      updated_at timestamptz NOT NULL DEFAULT now()
    );
  `);
}
