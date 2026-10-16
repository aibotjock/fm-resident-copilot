# Live candidate review: acceptance failures remain

This is an isolated research candidate, not an approved clinical release. Main and production were not changed. All raw outputs below are unverified generated material and must not be used as clinical guidance.

## What was actually run

- The direct OpenAI gpt-4o model used by the restored app, with an authorized new key in ignored `.env.local`.
- Temporary local PGlite PostgreSQL schema and the actual Express/retrieval routes; no production database connection.
- Twelve initial answer samples before prompt/retrieval corrections, twelve after, and two separate practice-question requests. Files distinguish the initial and later outputs. The later unknown-topic case performs no model request.
- Six baseline-linked conditions cover all five modes. Six further scenarios cover renal dosing, infection follow-up, electrolytes, pregnancy, screening conflicts and missing evidence. Pediatric generated-answer testing is still missing.
- All 12 later answer transports completed and both practice requests returned structured JSON. This does not mean the clinical answers or MCQs passed medical review.

The saved baseline file did not retain complete original user queries. The harness reconstructs them. Answer lengths are triage signals, not controlled comparisons, quality scores or evidence of completeness. Generated outputs are nondeterministic and these samples do not establish future reliability.

## Later answer findings

| Scenario | Seconds | Length vs baseline | Review finding |
|---|---:|---:|---|
| baseline-point_of_care-Hypertension | 7.64 | 1.599× | Unsupported presentation details and monitoring intervals; omits some checked treatment-initiation detail. Review-status caveats are not consistently carried into each section. |
| baseline-point_of_care-Type 2 Diabetes | 5.19 | 1.117× | Additional symptoms/mechanisms and cross-society convergence claims are not established by the supplied checked corrections. |
| baseline-board_prep-Community-Acquired Pneumonia | 6.92 | 1.251× | Repeats legacy fixed-duration and PSI/CURB-65 issues already identified in the backlog; full 2025 ATS source reconciliation is unfinished. Generated vignette requires medical review. |
| baseline-ddx-Headache | 5.68 | 1.08× | Adds a six-hour CT rule, treatment-response diagnostic suggestions and differential detail beyond the supplied checked evidence; not accepted as verified. |
| baseline-documentation-Urinary Tract Infection | 8.92 | 1.225× | Useful detail retained; full culture thresholds, specific regimens and current-source status remain unverified. Not accepted as a completed guideline review. |
| baseline-flashcards-Asthma | 4.16 | 1.136× | Card format retained; current GINA recommendations and reuse rights remain unresolved, so cards are not medically certified. |
| renal-dose | 5.65 | — | The tested CrCl 11–30 adjustment appears in the answer, but other statements exceed the checked scope. This is not a whole-answer pass. |
| infection-followup | 2.71 | — | Requested site-specific regimens and follow-up are present, but the heading incorrectly substitutes cefazolin for the broader allergy context. Not accepted as a clean medical answer. |
| electrolyte-emergency | 4.3 | — | Retains core checked pathway; other thresholds, explanations and source scope still require claim review. |
| pregnancy | 3.75 | — | Generated screening detail remains broader than the checked GBS timing claim; prenatal source and population rules need review. |
| guideline-conflict | 5.49 | — | Retains the checked stopping threshold, but adds unsupported risk rationales and exam-history assertions. Question quality requires review. |
| missing-evidence | 0.01 | — | Pass: no unrelated reference matches after fallback fix; deterministic limitation returned without a model request. |

## Practice questions

- **Hypertension: failed.** The explanation asserts a universal requirement to maximize one drug before adding a class, despite the checked stage-2 combination guidance. More than one offered treatment is defensible from the limited case. JSON validity is not question validity.
- **C. difficile: not accepted as fully verified.** The selected preference matches the scoped checked correction, but the item needs stronger resource/availability assumptions to make the preferred option unambiguous; all distractor claims and explanations need their own evidence review.

## Engineering progress

The fallback previously matched unrelated references through the generic word “reference” in the artificial unknown-topic slug. It now excludes generic request words and numeric-only tokens. The regression checks the unknown topic and ensures a known influenza query still retrieves. No new missing condition matches were found among the 96 listed conditions; this is a retrieval-count check, not a semantic-quality check.

Mode instructions no longer demand undocumented board-tested thresholds or actual exam patterns. They also distinguish generic topics from supplied patient cases and warn against unsupported source agreement. The later live answers demonstrate that prompt edits alone have not solved evidence fidelity. No guarantee or automatic medical approval is claimed.

The inherited shared-package typecheck failures were repaired. React development types were aligned with the existing Expo React 19.1 version; the lockfile's peer graph was regenerated. Batch tests exercise immediate abort and real retry behavior without making API calls. Missing image payloads now raise errors instead of becoming silent empty buffers. These shared helper paths are not clinical verification.

## Browser limitation

An isolated loopback preview server was started. Local Playwright could not launch because Chromium was absent. Installing Chromium failed during download. No tabs, local storage interactions, voice, visual layout or browser-end-to-end behavior are reported as tested. No candidate Railway environment was created.

## Newly investigated official-source access

- ATS's official November 11, 2025 announcement reproduces scoped recommendations, including shorter courses for selected stable outpatients: https://site.thoracic.org/press-releases/treatment-with-antibiotics-and-steroids-in-adults-with-pneumonia-addressed-in-latest-clinical-practice-guideline
- Attempts to open the original 2019/2025 ATS journal PDF links redirected to a journal homepage rather than the full guideline. Search snippets were not accepted as a full-guideline read.
- The original IDSA CAP clinical pathway PDF was accessible: https://www.idsociety.org/globalassets/idsa/practice-guidelines/community-acquired-pneumonia-in-adults/cap-clinical-pathway-final-online.pdf. Relevant tables were read, but full reconciliation into both CAP entries remains pending.

## Release decision

**Do not merge or activate this candidate.** Full claim review, contradiction repair, supported generated explanations, reliable single-answer MCQs, commercial reuse review, browser tests and a hosted preview remain unfinished. Preserve the approved production baseline while resolving these items on this branch.
