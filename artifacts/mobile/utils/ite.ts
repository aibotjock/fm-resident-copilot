// Keep report metrics distinct. No raw-to-scaled or percentile conversion is inferred.
export const ITE_ACTIVITY_DOMAINS = [
  "Acute Care and Diagnosis",
  "Chronic Care Management",
  "Emergent and Urgent Care",
  "Preventive Care",
  "Foundations of Care",
] as const;
export type ScoreMetric = "scaled" | "percentile" | "percent_correct";
export type ITEFormat = "activity_2025" | "legacy";
export interface ITEBenchmark {
  examYear: number;
  pgy: number;
  metric: ScoreMetric;
  domain: string;
  mean: number;
  sd?: number;
  sourceUrl: string;
  sourceLabel: string;
}
export function reportValue(
  text: string,
  metric: ScoreMetric,
): number | undefined {
  if (!text.trim()) return undefined;
  if (!/^\d+(\.\d+)?$/.test(text.trim()))
    throw Error("Enter a complete nonnegative numeric score.");
  const n = Number(text);
  if (!Number.isFinite(n) || (metric !== "scaled" && n > 100))
    throw Error(
      "Percentiles and percent correct must be 0–100; scaled scores are separate.",
    );
  return n;
}
export function compareITE(
  score: number,
  report: {
    examYear: number;
    pgy: number;
    metric: ScoreMetric;
    domain: string;
  },
  benchmark: ITEBenchmark,
  allowOtherPGY = false,
) {
  if (
    report.examYear !== benchmark.examYear ||
    (!allowOtherPGY && report.pgy !== benchmark.pgy) ||
    report.metric !== benchmark.metric ||
    report.domain !== benchmark.domain
  )
    throw Error("Comparison needs the same exam year, PGY, metric and domain.");
  const url = new URL(benchmark.sourceUrl);
  if (
    url.protocol !== "https:" ||
    !(url.hostname === "theabfm.org" || url.hostname.endsWith(".theabfm.org"))
  )
    throw Error("Use an official ABFM source URL for the comparison data.");
  if (
    !benchmark.sourceLabel.trim() ||
    !Number.isFinite(score) ||
    !Number.isFinite(benchmark.mean) ||
    score < 0 ||
    benchmark.mean < 0 ||
    (report.metric !== "scaled" && (score > 100 || benchmark.mean > 100))
  )
    throw Error("Invalid report or comparison value.");
  if (
    benchmark.sd !== undefined &&
    (!Number.isFinite(benchmark.sd) || benchmark.sd <= 0)
  )
    throw Error("Standard deviation must be positive.");
  return {
    cohort: `PGY-${benchmark.pgy}`,
    sameLevel: report.pgy === benchmark.pgy,
    difference: score - benchmark.mean,
    z:
      benchmark.sd === undefined
        ? null
        : (score - benchmark.mean) / benchmark.sd,
    notice:
      "Comparison uses values you transcribed from the named official source. Not independently verified. A z-score is not an exact percentile or pass probability.",
  };
}

export default { ITE_ACTIVITY_DOMAINS, reportValue, compareITE };
