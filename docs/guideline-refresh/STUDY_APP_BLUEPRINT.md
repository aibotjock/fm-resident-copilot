# Reusable evidence-based study-app blueprint

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
