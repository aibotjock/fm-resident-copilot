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
a separate private tutor access code through service variables. This branch has
not been deployed and no existing Railway configuration was changed.

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
