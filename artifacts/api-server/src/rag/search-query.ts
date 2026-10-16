/**
 * Search labels only: these aliases connect exact app topic names to abbreviations
 * or wording already present in checked excerpts. They add no clinical content.
 * Never expand a free-form question or drop its population/qualifying details.
 */
const TOPIC_ALIASES: Readonly<Record<string, string>> = {
  hypertension: 'hypertension OR "blood pressure"',
  "heart failure": '"heart failure" OR HFrEF OR HFpEF',
  "atrial fibrillation": '"atrial fibrillation" OR AF',
  "peripheral arterial disease": '"peripheral arterial disease" OR PAD',
  "major depressive disorder":
    '"major depressive disorder" OR "major depression" OR MDD',
};

export function expandExactTopicAlias(query: string): string {
  const topic = query.trim().toLowerCase().replace(/\s+/g, " ");
  return TOPIC_ALIASES[topic] ?? query;
}
