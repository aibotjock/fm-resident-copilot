# Implementation verified against the restored source

The application began as a Replit pnpm/TypeScript workspace in March 2026. Git history records an Express clinical-query endpoint, expanded response prompts and study modes, PostgreSQL retrieval on March 14, and reference expansion to baseline v10 on March 15. April changes added question-performance tracking, read-aloud and saving MCQs as cards. A July standalone React/Vite implementation replaced the fuller interface; October restoration recovered the Expo interface and adapted its web build for Railway. Git history does not establish clinical verification of the original summaries.

## Runtime

`artifacts/mobile` is Expo/React Native with Expo Router and web export. Express in `artifacts/api-server` serves the web assets and `/api` from one origin. `lib/db` supplies PostgreSQL connectivity. The deployed restored client uses the existing direct OpenAI connection; source code chooses gpt-4o for a direct key and gpt-5.2 for the older integration route. No production model or credential was changed; an authorized new ignored local key was used for isolated candidate tests.

Clinical queries retrieve up to ten full-text matches, using PostgreSQL `websearch_to_tsquery` ranking and an OR-search fallback that excludes generic request words and numeric-only tokens. The unknown-topic regression exposed and corrected unrelated matches on the word reference. Embedding helper code exists, but the current retrieval path does not use embeddings. The condition name is preferred over generic mode prompt text as the search key.

The baseline reference file contains 156 written summaries, not complete copies of every listed society's guidelines. It contains 21 distinct domain strings; UI categories and internal study weights are a different, older 16-topic scheme. The condition browser has 96 entries despite its old hard-coded 100 label.

Five generation prompts define point-of-care, documentation, differential diagnosis, board study and flashcards. A separate endpoint generates practice MCQ JSON. Answers stream through SSE; the app renders prose, cards and citation metadata. The original prompt could supplement retrieved excerpts with model knowledge. The candidate explicitly distinguishes checked corrections from retained historical material and prohibits inventing missing details or repeating identified errors. This is an instruction, not a mathematical guarantee of factual accuracy.

The candidate filters the model's citation footer and supplies source metadata from its checked evidence catalog. That prevents invented footer titles/URLs but does not independently verify each generated sentence. Inline evidence tags and scoped source descriptions expose what has actually been checked.

`AppContext.tsx` uses AsyncStorage for history, bookmarks, annotations, cards, review intervals, query coverage, practice performance and ITE/topic scores. These remain local to a browser/device. No storage keys or saved-score mappings were migrated. Spaced review uses an SM-2-style rating algorithm.

## Updates

The baseline update routine truncated the reference table and rebuilt it when the ingest version changed. The candidate instead snapshots legacy data into immutable reference versions and leaves the original table untouched. Each candidate has stable section keys, a content digest and review metadata. A single state row points to the active version and the previous version; transactions make pointer changes atomic. Staging errors roll back and preserve the active library.

A candidate is never automatically activated in the production schema. Incomplete candidates can be selected only with preview mode and a separately named schema. Administration requires a configured bearer token. All new versions start unapproved; a complete reviewed release/approval workflow is still required before production promotion.

The historical USPSTF API paths failed during restoration. Candidate ingestion intentionally uses the bundled library rather than presenting an unverified endpoint as a live source. Official-feed discovery/repair remains a backlog item.

## Necessary wording changes

ABFM's official blueprint has five activity domains: Acute Care and Diagnosis 35%, Chronic Care Management 25%, Emergent and Urgent Care 20%, Preventive Care 15%, Foundations of Care 5%. Source: https://www.theabfm.org/family-medicine-exam-blueprint/ (accessed October 15, 2026). Retained organ-topic weights are labeled internal study weights. Historical ITE input fields are retained with a warning against mapping incompatible current scores into them.
