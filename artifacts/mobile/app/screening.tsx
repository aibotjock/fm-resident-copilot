import { GuidelineDeck } from "@/components/GuidelineDeck";
import { SCREENING_CARDS, SCREENING_TOPICS } from "@/content/screening";

export default function ScreeningScreen() {
  return (
    <GuidelineDeck
      title="Screening guidelines"
      description="Final USPSTF recommendations for Preventive Care study."
      topics={SCREENING_TOPICS}
      entries={SCREENING_CARDS}
    />
  );
}
