# FM Copilot independent Socratic voice tutor

Experimental branch: `experiment/socratic-voice-tutor-2026-10-16`.
Baseline: main `68506810181f2b6d945b07bd698bda34f8691a10`.

This is an independent server and web interface. It adds no route to the existing
app, imports no database client at runtime, runs no ingestion, and cannot activate
or refresh reference versions. The existing app, approved source files, database,
and production deployment remain unchanged. Do not merge this experiment into main
or repoint either existing service without separate user authorization.

## Behavior

- Family medicine/ABFM preparation and clinical reasoning for education only.
- Original, concise ABFM-style single-best-answer cases with age, sex, neutrally
  described race, relevant social context, and 4-5 plausible answer choices. Race
  is not a proxy for biology. No repeated announcement that cases are fictional.
- High-yield decisions and weak-area review; brief feedback followed immediately
  by the next supported question. Wrong answers get one hint/retry unless the
  learner requests the answer or rapid review. Pause and detail requests take priority.
  Random topic quizzes require a request or Quiz button.
- Presentation, differential, testing, diagnostic criteria, treatment and supported
  escalation, doses, follow-up, monitoring, complications and referral.
- Never invent a three-line treatment ladder or missing dosing components.
- Realtime WebRTC voice, natural interruption, mute/unmute, end, typed input,
  listening/thinking/speaking states, browser noise suppression and echo cancellation.
- Topic selection across all 156 retained entries; random topic and weak-topic selection.
- Evidence-bound assessment tools; local progress, per-skill records, weak-area
  emphasis, checkpoints, resumable lesson plans, progress export/import/clear.
- Device-local persistence, not account sync. AI assessments are not validated scores.
- No personalized speaker identification or voice enrollment. No enrollment samples
  are collected; this capability must not be advertised as implemented.
- Each official-page lookup requires a distinct explicit approval. Only exact
  evidence URLs listed for the selected topic can be fetched. Redirects are not
  followed; large or non-text pages fail closed. Returned text is untrusted source
  data and is not a canonical update or verified medical summary. Broad internet
  search is not implemented. No model-callable browsing tool exists.
- No scheduled refreshes. Any future refresh needs the owner's approval and a
  separately reviewed official-source update; this experiment cannot perform one.

## Content truthfulness

The user approved preserving the existing app's content. That is not independent
verification of every statement. The baseline includes 156 retained entries with
42 official-source evidence records and known review limitations. The tutor imports
that exact corrected snapshot; no medical research or source refresh was performed.
The source panel retains publication/access dates and unresolved issues. Only tagged
claims have scoped checks. This is not an ABFM-approved product; the existing official
ABFM blueprint is supplied for scope alignment. USPSTF quiz currency is limited to
stored records, not a live feed. Dose or screening-rule gaps must remain explicit.

Grounding and Socratic behavior are model instructions, not a mathematical guarantee.
The assessment API validates topic/evidence identities, not entailment or medical truth.
Real generated conversations still require review, including unsupported-dose refusal,
historical-guidance labeling, hint/retry behavior and accurate USPSTF applicability.

## Run as a separate service

From repository root, install the frozen lockfile, then:

```sh
pnpm install --frozen-lockfile
pnpm build:tutor
pnpm start:tutor
```

Configuration:

| Variable | Value/purpose |
|---|---|
| `OPENAI_API_KEY` | Reuse the existing deployed key as authorized; server only |
| `FM_TUTOR_ACCESS_TOKEN` | Private access code, at least 16 characters; never commit |
| `NODE_ENV` | `production` on the hosted service (secure cookies) |
| `PORT` | Service port, default 8080 |
| `FM_TUTOR_REALTIME_MODEL` | Optional override; default `gpt-realtime-2.1` |

For Railway, create a **separate service**, source this experimental branch, build
`pnpm build:tutor`, start `pnpm start:tutor`, health check `/api/healthz`. Use a
Railway reference variable to the existing service's `OPENAI_API_KEY`; do not copy
it into chat, the repository or the browser. No `DATABASE_URL` is needed. Provide
a separate private tutor access code through service variables. The baseline tutor
was deployed separately; the learning-loop update below is not yet deployed.

The server exchanges SDP with OpenAI; it never sends the permanent key to the
browser. Access uses an HttpOnly, SameSite=Strict, one-hour cookie. The private
code is shared access, not a multi-user identity system. Sessions expire on restart.
Per-session request limits and a 20-minute client voice limit are basic bounds,
not a provider-enforced spending cap. Audio is sent to OpenAI during a session;
this app stores no recordings. Use synthetic educational cases, no patient identifiers.

## Validation

```sh
pnpm test:tutor
pnpm build:tutor
```

Tests cover corpus identity, grounding instructions, topic/evidence validation,
private access, input rejection, approval boundaries, a mocked Realtime handshake,
and safe official-page extraction. They do not make live OpenAI calls. Tests use
in-process HTTP objects so they can run where listening sockets are unavailable.

Live account/model access, actual microphones, interruption timing, noisy-room
performance, mobile audio autoplay and clinical correctness are not verified by
these tests. A production-grade speaker verification feature is not implemented.

## Official implementation reference

OpenAI WebRTC documentation consulted October 16, 2026:
https://developers.openai.com/api/docs/guides/voice-webrtc?voice-api=realtime

No changes to existing app start/build commands: the tutor uses separate commands.
Rollback is stopping/deleting only the independent experimental service, if deployed.

## Learning-loop update — 2026-10-16

- The reviewed practice path contains 26 original items, with immutable server-side
  answer keys, scoped stored evidence IDs, rationales and clinical transfer prompts.
  "Snapshot claim checked" means checked against that specific retained correction;
  it does **not** mean new independent guideline verification, clinical validation,
  commercial rights clearance or ABFM endorsement. No source snapshot was refreshed.
- Teaching offers a single retry; assistance is recorded before a hint. Assessment
  has a configurable block length/time limit and releases answer feedback only at
  completion or explicit end. New assessment blocks exclude previously answered
  item IDs in supplied device history. The bank is small and can be exhausted.
- Unreviewed questions remain available as explicitly unscored practice, per the
  owner's instruction. Missing review alone does not block teaching. Missing source
  content is still disclosed; the tutor cannot invent a supported clinical answer.
- Review intervals are implementation defaults (1, 3, 7, 14, 30 days), not a validated
  individualized algorithm. Only delayed, unassisted success on a different item
  for the same concept counts toward the delayed-retrieval indicator. No clinical
  competence, exam percentile or pass probability is inferred from these signals.
- Mixed practice uses deficit scheduling against the official five-domain targets;
  weak/due concepts receive priority within the selected domain. The current bank
  covers four domains; Foundations of Care has no reviewed items. That missing 5%
  is displayed rather than claimed as covered or silently replaced with other topics.
- Optional confidence and self-reported error categories distinguish knowledge gaps,
  misreading, next-step errors, missed contraindications and reasoning difficulties.
  Unknown causes/confidence remain unknown. Clinical transfer exercises are unscored.
- The mobile ITE form now distinguishes exam calendar year from PGY and accepts
  scaled scores, percentiles, percent-correct values, optional separately labeled
  domain percentages, and additional category names copied exactly from the report.
  Existing legacy records are retained with their original interpretation.
- ITE comparisons use the same exam year, metric and domain. Your own PGY is the
  primary comparison; other PGYs are explicitly contextual. No raw/scale conversion,
  normal-distribution percentile inference or practice-to-ITE conversion is made.
- National means must be transcribed from an attributed official ABFM source.
  No 2025 national means were verified or seeded in this change. The official 2025
  score-handbook URL was not retrievable, so the form is flexible entry rather than
  a claim to reproduce that report exactly. Source URLs and report values are
  user-entered, not independently authenticated. The native report form and tutor
  store data separately on the local device; account sync is not implemented.

Official exam-format and domain references checked 2026-10-16:
- https://www.theabfm.org/become-certified/in-training-exam/
- https://www.theabfm.org/family-medicine-exam-blueprint/
- https://www.theabfm.org/app/uploads/2024/07/2024-07_ITE-Content-Outline.pdf

These references describe the exam/blueprint; they do not supply verified 2025
national cohort means. Publicly inaccessible score-handbook data were not invented.

Validation: 16 focused tests cover scoring, delayed feedback, timeouts, fresh-item
exclusion, spacing, confidence/error signals, year/PGY/metric comparisons, interface
handlers and persistence, private access, source approval and simulated voice handshake.
Tutor and mobile TypeScript checks pass; the tutor bundle and Expo web export build.
A real browser rendering test was attempted but Chromium could not be installed in
this environment. DOM-handler tests use a simulated document, not real rendering.
Real microphone use, timing and clinical review of generated conversations remain pending.

All changes are on the experimental branch. The full mobile ITE correction requires
an app build from this branch; deploying only the standalone tutor does not change
the main app's ITE form. No merge or main-service deployment is part of this update.

Five original, self-contained Foundations statistics exercises are available as
unreviewed, unscored practice even without voice. Each stem supplies its own
definition and numbers; feedback follows that arithmetic only. No clinical source
was added, and these do not count as reviewed Foundations coverage. Ethics and
policy teaching still requires support in approved source material.
