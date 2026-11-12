# Family Medicine study content

The app supports learning and board preparation only. Keep the existing tabs and navigation. Use the [ABFM exam blueprint](https://www.theabfm.org/family-medicine-exam-blueprint/) to organize learning activities and use the issuing agency or specialty society to substantiate clinical claims. Deck categories are navigation labels. Use the official blueprint for exam weights.

## Publish static study material

- Keep a single versioned record for each card. The flashcards and reading views share the same records for [antibiotics](../artifacts/mobile/content/antibiotics.ts) and [screening](../artifacts/mobile/content/screening.ts). Each record includes a stable ID, topic, prompt, answer, source link, source section, and the date checked.
- Paraphrase recommendations. Include population and setting, and retain any exception that changes the answer. When a card teaches a dose, verify indication, population, drug, route, dose, interval, and duration against the primary source. Leave out unsupported details. Keep source check dates specific to the reviewed claims.
- Promote legacy topics to static pages in batches, starting with common board topics or a verified safety correction. Check each claim against current sources. Keep unreviewed historical material clearly labeled until the checks are complete.
- Bookmarks and history show local snapshots with their original date and evidence notes. A learner can explicitly request a fresh answer, which goes through the existing AI route.

## Weekly updates

1. Check official agency and society publication pages, safety notices, labels, corrections, and guideline updates since the last successful check, with seven days of overlap. Identify changes by source, effective date, and recommendation. Skip unchanged pages and summaries of older guidance.
2. Open the primary recommendation for each candidate change. Record its exact section, population, setting, exceptions, what changed, and the affected card or reference IDs. Flag conflicting guidance and incomplete source access. Prioritize safety corrections and common exam topics.
3. Batch proposed changes into one review report or pull request. Each entry needs old and new wording, an authoritative link, the reason for the change, and its urgency. If sources disagree, attribute each recommendation and explain the difference. Keep the earlier text and dates in version history.
4. Review the exact claims and run the app typecheck, Expo web build, and a browser smoke test. Confirm source links, card navigation, and that opening static or saved material sends no clinical request. Publish approved changes through the existing release path, then check the live pages and retain the previous revision for rollback.
