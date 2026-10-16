import json,html
from pathlib import Path
root=Path('docs/guideline-refresh');src=Path('artifacts/api-server/src/rag/sources')
validation=json.loads((root/'validation.json').read_text()); inv=validation['inventory']
changes=json.loads((src/'corrections.json').read_text()); evidence=json.loads((src/'evidence.json').read_text()); base=json.loads((root/'baseline-library.json').read_text());candidate=json.loads((root/'candidate-library.json').read_text());coverage=json.loads((root/'retrieval-coverage.json').read_text())
(root/'README.md').write_text(f'''# Guideline refresh: review checkpoint

Status: **incomplete clinical review; do not merge or deploy to production**.

Branch: `content/guideline-refresh-2026-10-15`.
Baseline: `e3e494eb158907355b873aa0f8c8d412bd8cfb4c` (exact application tree from `5a4db479257788a7cc1b886ae309ecaffca721a5`).
Review access date: October 15, 2026, America/New_York. Individual publications retain their actual dates.

## What is preserved

- {inv['baseline']} baseline reference entries and {inv['candidate']} candidate entries, with every section identity retained.
- {inv['domains']} distinct legacy reference-domain strings. The interface historically uses 16 organ-system study categories; these are not the five official ABFM exam domains.
- {coverage['conditionCount']} actual condition-browser entries, with no missing retrieval matches before or after. Matching does not prove clinical relevance.
- Original navigation, five response modes, practice questions, flashcards, read-aloud controls and local study-data storage.
- Baseline text {inv['baselineCharacters']:,} characters; candidate text {inv['candidateCharacters']:,}. Length preservation is not an accuracy measure.

## What changed

{inv['corrections']} targeted reference edits across {inv['changedEntries']} entries; {inv['evidenceRecords']} official-source evidence records. None of the {inv['candidate']} complete entries is certified fully verified. The original seed file remains untouched. Corrections apply as anchored changes rather than replacement topic summaries.

Engineering changes: corrected fallback retrieval for unknown topics, removal of unsupported exam-content demands from mode prompts, repaired shared-package typechecking, immutable reference versions, additive historical snapshot, atomic activation/rollback, failure-safe staging, preview schema isolation, server-controlled evidence footer, clickable source links, accurate ABFM weight labels, and required clinical-response sections. The candidate no longer calls unverified USPSTF endpoints or describes them as a working live feed.

## Review files

- [Architecture](ARCHITECTURE.md)
- [Before/after reference changes](changes.md)
- [Interactive reference comparison](review.html) (download/open locally; no server or external scripts)
- [Evidence records](../../artifacts/api-server/src/rag/sources/evidence.json)
- [All-entry issue inventory](../../artifacts/api-server/src/rag/sources/review-backlog.json)
- [Six actual production-baseline responses](baseline-responses.json)
- [Actual candidate responses](candidate-responses.json), [initial failed samples](candidate-responses-initial.json), and [practice questions](candidate-vignettes.json)
- [Live review findings and release failures](LIVE-REVIEW.md)
- [Engineering check results](engineering-checks.json)
- [Retrieval comparison](retrieval-coverage.json)
- [Database and streaming checks](validation.json)
- [API transport checks](api-smoke.json)
- [Validation limits and remaining work](VALIDATION.md)
- [Activation/rollback procedure](OPERATIONS.md)
- [Reusable subject-neutral blueprint](STUDY_APP_BLUEPRINT.md)

## Approval status

Not requesting production approval. Full claim-level verification, publisher access/reuse questions, full generated-answer remediation, and end-to-end browser tests remain incomplete. There is no deployed candidate app preview. The review HTML is a reference comparison, not an AI app or a medical certification.

The existing Railway app remains on the approved restored version. No production database, environment variables, service configuration or deployment was changed by this branch work.
''')
(root/'ARCHITECTURE.md').write_text('''# Implementation verified against the restored source

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
''')
(root/'VALIDATION.md').write_text('''# Validation and unresolved work

## Observed passes

- Production-style API build plus Expo web export (`pnpm run build:railway`).
- Mobile TypeScript (`pnpm --filter @workspace/mobile exec tsc --noEmit`).
- Actual PostgreSQL SQL through local PGlite: legacy snapshot, 156-entry preservation, immutable IDs, duplicate/empty rejection, idempotent staging, failed-write rollback, production activation rejection, isolated preview activation, rollback and version-filtered full-text search.
- Streaming-footer filter across every split boundary, ordinary-prose preservation, and server evidence-metadata scope.
- Actual Express routes with a deterministic OpenAI test fixture: five SSE modes, practice-MCQ JSON, reference status, and denied unauthenticated administration. These are transport tests, not AI-content tests.
- Baseline and candidate retrieval matched all 96 named browser conditions; no new missing matches. Semantic relevance and full topic completeness were not established by that check.
- Six real baseline AI responses captured before edits, with no reported errors.

## Checks that do not pass or have not been performed

The root typecheck now passes across shared packages, API, mobile, mockup sandbox and scripts. Repairs explicitly export the request schema/interface, declare development types, align React types with the Expo React 19.1 dependency, use the installed p-retry named AbortError/context API, and reject missing image bytes. No production model or credential was changed. The production-style build also passed.

Twelve real isolated candidate answer scenarios and two practice-question requests completed using the approved direct-API model, gpt-4o. An explicitly authorized new key was saved to ignored .env.local and is not part of this review package. No key was copied from Railway. Saved baseline requests lacked their original query text, so comparisons use reconstructed queries and are not controlled prompt-identical experiments. See LIVE-REVIEW.md for failed medical acceptance cases; successful transport does not establish medical correctness.

No full browser regression, audio test, device-to-device storage test, or cloud PostgreSQL concurrency test has been completed. A local isolated preview server ran, but Chromium was absent and its download failed. No browser pass is claimed. Storage keys remain unchanged. No candidate Railway service was provisioned or deployed.

## Medical release blockers

All 156 complete reference entries still contain unverified retained claims, even where an individual correction is verified. Read the per-entry issue inventory. Publication metadata, numeric thresholds, drug labeling, pediatric/pregnancy pathways and contraindications require continued claim-level review. Explicitly tagged corrections do not certify the rest of a topic.

Some ADA journal pages returned 403; NIH PMC pages presented browser verification. A legitimate jointly published Diabetologia consensus was accessible for DKA, but that does not establish full ADA 2026 coverage. Do not claim to have read blocked material.

GINA explicitly requires approval for commercial use of its reports; no permission was obtained or implied. Other society source/reuse requirements and historically attributed summaries need review. The original corpus remains historical research material in this isolated branch, not a commercially cleared current guideline corpus.

Full 2026 GOLD treatment algorithms, newer ACOG guidance, current labels for all drugs, complete diagnoses/differentials, and exact first/second/third-line pathways are not certified. No blanket treatment ladder should be invented to fill gaps.

## Next work in order

1. Continue claim review from the per-entry inventory, prioritizing unresolved unsafe doses, withdrawn products and obsolete acute-care rules.
2. Obtain legitimate full-source access/permissions where needed, or independently support the specific facts from other applicable official guidance.
3. Reconcile duplicate-topic recommendations and source metadata after verification.
4. Remediate the saved live-model failures, then expand real candidate testing to pediatrics, exact dosing, conflicts and repeated question-quality checks.
5. Review the answers against their exact supporting claims; inspect all eight tabs and exercise local save/review/read-aloud functions.
6. Resolve required typecheck failures, finish a reviewed activation manifest and database migration rehearsal, then prepare an isolated app preview.
7. Request production approval only after release blockers are resolved.
''')
(root/'OPERATIONS.md').write_text('''# Candidate activation and rollback

Production has not been modified. Do not merge this checkpoint as a release.

## Local checks

Additional continuation checks:

```
pnpm run typecheck
# From artifacts/api-server (uses node loader, avoiding tsx CLI IPC):
node --import tsx ../../scripts/guideline-refresh/batch-check.ts
# From repository root; billable, requires an authorized local key:
FM_TEST_PGLITE_MODULE=/absolute/path/to/pglite node scripts/guideline-refresh/live-answers.cjs
FM_LIVE_VIGNETTES=1 FM_TEST_PGLITE_MODULE=/absolute/path/to/pglite node scripts/guideline-refresh/live-answers.cjs
```

The live harness uses disposable local PGlite, not DATABASE_URL. Its outputs are unverified generated material for review. It records reconstructed baseline prompts as a limitation. Set FM_LOCAL_PREVIEW=1 and FM_LOCAL_PORT=8766 to serve an isolated local app without executing the sample batch; bind is loopback only. This is not a hosted preview link.

Use the repository's existing pnpm workspace. The SQL regression harness requires `@electric-sql/pglite` as a test-only dependency, installed outside the app or provided through `FM_TEST_PGLITE_MODULE`. This dependency is not added to the deployed app.

```
FM_TEST_PGLITE_MODULE=/absolute/path/to/pglite node scripts/guideline-refresh/test.cjs
FM_TEST_PGLITE_MODULE=/absolute/path/to/pglite node scripts/guideline-refresh/coverage.cjs
FM_TEST_PGLITE_MODULE=/absolute/path/to/pglite node scripts/guideline-refresh/api-smoke.cjs
pnpm --filter @workspace/mobile exec tsc --noEmit
pnpm run build:railway
```

Run scripts from the repository root. Test database data is local and temporary. Fixture transport tests make no OpenAI request.

## Isolated app preview when credentials and infrastructure are available

Use this branch and a preview-only PostgreSQL schema, e.g. `fm_guideline_preview_20261015`. Set `FM_REFERENCE_SCHEMA` to that value and `FM_REFERENCE_PREVIEW=1`. Supply an authorized existing `DATABASE_URL` and OpenAI credential through the hosting service's secure variable system. Do not put credentials in browser-visible variables or files. Do not point preview writes at the production schema.

Build with `pnpm run build:railway`; start with `pnpm run start:railway`; health route `/api/healthz`. Initialization stages the baseline and candidate and activates the candidate only in that isolated schema. For a same-origin web deployment leave `EXPO_PUBLIC_DOMAIN` unset.

Production schema migration is additive: original `guideline_chunks` and `rag_metadata` are retained. Before any actual production migration, take a provider-supported database backup and verify restoration. No production backup was taken here because no production database writes were performed.

`GET /api/admin/rag/status` exposes active/candidate version IDs and honest review status. Mutating routes are disabled unless `FM_REFERENCE_ADMIN_TOKEN` is configured and the bearer token matches.

The reindex route stages immutable bundled content. It never truncates active references. The activation route rejects a new unapproved candidate; it permits restoration of the immediately prior active version. Preview activation is isolated and explicit. Every activation records its reason and old/new version IDs.

A reviewed release manifest and production approval are still pending. No ready flag should be manually flipped to bypass this review.

## Rollback rehearsal

The SQL harness activates an isolated candidate, verifies the prior version pointer, restores that previous snapshot, and verifies the restored active ID and entry count. It also injects an insertion failure and confirms no partial version or active-pointer change survives. This is tested PostgreSQL behavior in PGlite, not a production restoration rehearsal.

For a future approved deployment, code rollback must use the recorded prior Git commit, and content rollback must restore the recorded prior reference version. Keep both IDs in the deployment record. Do not discard old snapshots or user data.

## Future review cadence (proposal only)

Review official-source change notices monthly, prioritize FDA withdrawals/safety alerts as soon as detected, and perform broader topic reviews on a documented schedule. Build a candidate, produce a claim/coverage diff, validate, review, then activate. No schedule or automation was created.
''')
(root/'STUDY_APP_BLUEPRINT.md').write_text('''# Reusable evidence-based study-app blueprint

Build a study app for **[SUBJECT]**, serving **[LEARNER/AUDIENCE]**, with the approved reference interface **[BASELINE COMMIT/DESIGN]**. Use the simplest architecture that satisfies the learning goals. Preserve working features and useful explanations during every update.

## Configuration

Define subject taxonomy, learner level, jurisdiction, exam/curriculum framework where applicable, official source organizations, permitted reuse, learning modes and the date of review. Do not invent exam weights or assume a source's authority covers every claim.

Keep subject-specific content separate from interface and study-progress storage. Recommended modes: reference explanation, diagnostic/problem-solving reasoning, worked examples or documentation, practice questions, flashcards and progress review. Use only modes appropriate to the subject.

## Evidence model

Represent each substantive claim with a stable ID, faithful summary, source title/issuer/URL, actual publication/revision date, access date, exact locator, audience/population, scope, exceptions, confidence/strength when stated, replacement history and reuse status. Mark inaccessible or unresolved evidence explicitly.

Model-written citations do not establish truth. Tie displayed claims to stored supporting records. Verify quantitative values and explain disagreements in source context. Preserve supported teaching while identifying exact gaps. Never fill missing evidence with invented facts.

## Architecture

Use a responsive reusable interface, a small server API and a durable reference store when necessary. Keep secrets server-side. Retrieve by specific subject and section, provide adequate source context to generation, and preserve clear mode-specific explanations. Use generation only where it improves learning; ordinary retrieval and deterministic scheduling do not require model calls.

Store progress, saved items, notes and review schedules explicitly. State whether they are device-local or synchronized. Keep storage keys and migrations stable across updates.

## Content shape

For clinical subjects, support presentation, differential, diagnosis, next best test/step, initial workup, treatment choices and escalation, verified dosing, precautions, monitoring, follow-up and special populations. Only describe treatment lines when the source actually defines a sequence.

For other subjects, substitute the corresponding learning structure: problem recognition, competing explanations, governing principles, next investigation, solution methods, constraints, worked examples, errors and transfer to new situations.

## Update contract

Record an approved baseline and inventory. Make updates on a branch. Build immutable candidate references separately, preserve the previous version, validate claims and coverage, and activate atomically only after review. A failed update leaves the active version intact. Keep both code and content rollback IDs.

Do not replace a broad useful corpus with a narrow verified subset while implying coverage is preserved. Do not retain incorrect facts as active guidance to preserve length. Make supported corrections and identify unresolved portions precisely.

## Evaluation

Test representative normal, difficult, missing-evidence and conflicting-source cases. Compare learning usefulness and factual support before and after. Test answer rendering, practice-question validity, flashcard usefulness, saved data, accessibility, ingestion failure and rollback. Separate build/transport checks from subject-matter validation.

## Delivery

Provide the branch/commit, architecture, source/evidence inventory, change log, coverage comparison, representative outputs, test results, unresolved limitations, preview when available, and activation/rollback instructions. Do not change the approved live version until authorized.

Be truthful throughout. Distinguish observed facts, inference, proposals and unknowns. Never claim a source was read, a fact verified, a test passed or a deployment completed without evidence.
''')
lines=['# Before/after reference changes','', 'These are stored-reference edits, not candidate AI-generated responses. Whole-topic verification remains incomplete.','']
for n,c in enumerate(changes,1):
 ids=', '.join(c['evidence']);lines += [f"## {n}. Entry {c['index']}: {base[c['index']]['section']}",'',f"Reason: {c['reason']}",'', '**Before**','',c['old'] or '(New scoped source update added; existing topic retained.)','', '**After**','',c['new'],'',f'Evidence IDs: {ids}','']
(root/'changes.md').write_text('\n'.join(lines))
esc=html.escape
cards=[]
for c in changes:
 refs=[e for e in evidence if e['id'] in c['evidence']]
 links=' '.join(f'<a href="{esc(e["url"])}" target="_blank" rel="noopener noreferrer">{esc(e["id"])}</a>' for e in refs)
 cards.append(f'<article><h2>{esc(base[c["index"]]["section"])}</h2><p>{esc(c["reason"])}</p><div class="columns"><section><h3>Historical statement</h3><pre>{esc(c["old"] or "Scoped update added")}</pre></section><section><h3>Candidate correction</h3><pre>{esc(c["new"])}</pre></section></div><p>{links}</p></article>')
(root/'review.html').write_text(f'''<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>FM Copilot reference review</title><style>body{{font:16px/1.55 system-ui;margin:auto;padding:28px;max-width:1150px;color:#142036;background:#f5f7fb}}h1{{line-height:1.15}}article,.summary{{background:white;border:1px solid #dce3ee;border-radius:12px;padding:22px;margin:20px 0}}.columns{{display:grid;grid-template-columns:1fr 1fr;gap:24px}}pre{{font:14px/1.6 system-ui;white-space:pre-wrap}}a{{color:#2054ad}}.notice{{border-left:4px solid #b36a14;padding-left:16px}}input{{font:inherit;padding:12px;width:min(90%,650px);border:1px solid #c2ccdd;border-radius:8px}}@media(max-width:700px){{.columns{{grid-template-columns:1fr}}body{{padding:15px}}}}</style><h1>FM Resident Copilot<br>Reference-update review</h1><p class="notice">Engineering checkpoint. Full clinical review is incomplete. This is a reference comparison, not an app preview or verified medical guidance. Production is unchanged.</p><div class="summary"><strong>{inv['candidate']} entries preserved · {len(changes)} targeted edits · {len(evidence)} evidence records</strong><p>All {coverage['conditionCount']} listed conditions still retrieve matches. No complete entry is certified fully checked. Source dates and precise checked scopes are recorded in evidence.json.</p></div><label for="search">Filter corrections</label><p><input id="search" type="search" placeholder="Condition, recommendation or evidence ID"></p><main>{''.join(cards)}</main><script>document.querySelector('#search').addEventListener('input',e=>{{const q=e.target.value.toLowerCase();document.querySelectorAll('article').forEach(a=>a.hidden=!a.textContent.toLowerCase().includes(q))}})</script></html>''')
print('Review package generated:',inv)
