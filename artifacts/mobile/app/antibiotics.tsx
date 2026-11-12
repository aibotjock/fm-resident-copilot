import { GuidelineDeck } from "@/components/GuidelineDeck";
import { ANTIBIOTIC_CARDS, ANTIBIOTIC_TOPICS } from "@/content/antibiotics";

export default function AntibioticsScreen() {
  return (
    <GuidelineDeck
      title="Antibiotic flashcards"
      description={`${ANTIBIOTIC_CARDS.length} guideline-linked cards for Family Medicine board study.`}
      topics={ANTIBIOTIC_TOPICS}
      entries={ANTIBIOTIC_CARDS}
    />
  );
}
