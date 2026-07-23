export interface GuidelineChunk {
  source: string;
  tier: number;
  guidelineTitle: string;
  guidelineYear: number | null;
  abfmDomain: string;
  section: string;
  content: string;
  url: string | null;
}

/** Compact chunk factory to keep domain files readable. */
/**
 * Alternate compact factory: mkc(domain, section, sourceLabel, content).
 * Parses a trailing 4-digit year out of the source label when present.
 */
export function mkc(
  abfmDomain: string,
  section: string,
  sourceLabel: string,
  content: string,
): GuidelineChunk {
  const yearMatch = sourceLabel.match(/(19|20)\d{2}/);
  const guidelineYear = yearMatch ? parseInt(yearMatch[0], 10) : null;
  const source = sourceLabel.replace(/\s*(19|20)\d{2}\s*/g, " ").replace(/\s+/g, " ").trim().replace(/[\/,-]\s*$/, "").trim() || sourceLabel;
  return { source, tier: 1, guidelineTitle: section, guidelineYear, abfmDomain, section, content, url: null };
}

export function mk(
  source: string,
  guidelineYear: number | null,
  guidelineTitle: string,
  abfmDomain: string,
  section: string,
  content: string,
): GuidelineChunk {
  return { source, tier: 1, guidelineTitle, guidelineYear, abfmDomain, section, content, url: null };
}
