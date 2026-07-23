import { pgTable, serial, text, timestamp, integer, varchar, index, customType } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// ----- Conversations & Messages -----

export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id")
    .notNull()
    .references(() => conversations.id, { onDelete: "cascade" }),
  role: text("role").notNull(),           // "user" | "assistant"
  content: text("content").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ----- RAG Guideline Chunks -----

export const guidelineChunks = pgTable("guideline_chunks", {
  id: serial("id").primaryKey(),
  source: text("source").notNull(),
  tier: integer("tier").notNull().default(1),
  guidelineTitle: text("guideline_title").notNull(),
  guidelineYear: integer("guideline_year"),
  abfmDomain: text("abfm_domain").notNull(),
  section: text("section").notNull(),
  content: text("content").notNull(),
  url: text("url"),
}, (table) => [
  index("guideline_chunks_source_idx").on(table.source),
  index("guideline_chunks_domain_idx").on(table.abfmDomain),
]);

export const ragMetadata = pgTable("rag_metadata", {
  key: varchar("key", { length: 255 }).primaryKey(),
  value: text("value").notNull(),
});
