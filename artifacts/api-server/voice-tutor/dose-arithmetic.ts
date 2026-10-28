import type { MedicationRecord } from "./evidence";
/** Arithmetic only, for a previously passage-supported regimen and confirmed applicability. */
export function calculateWeightDose(m: MedicationRecord, weightKg: number) {
  if (!Number.isFinite(weightKg) || weightKg < 0.2 || weightKg > 400)
    throw Error("Enter a plausible weight in kilograms, from 0.2 to 400 kg");
  if (
    !m.dose ||
    !/^\d+(?:\.\d+)?$/.test(m.dose.trim()) ||
    !m.unit ||
    !/^mg\s*\/\s*kg(?:\s*\/\s*(?:day|dose))?$/i.test(m.unit.trim())
  )
    throw Error("This passage does not establish one numerical mg/kg regimen");
  if (m.dose_basis === "not_established")
    throw Error("The source must distinguish per-day from per-dose dosing");
  const frequency = (m.frequency || "").toLowerCase().trim();
  const names: Record<string, number> = {
    "once daily": 1,
    "once a day": 1,
    daily: 1,
    "twice daily": 2,
    "twice a day": 2,
    "three times daily": 3,
    "four times daily": 4,
    "every 24 hours": 1,
    "every 12 hours": 2,
    "every 8 hours": 3,
    "every 6 hours": 4,
    q24h: 1,
    q12h: 2,
    q8h: 3,
    q6h: 4,
  };
  const administrations = names[frequency];
  if (!administrations)
    throw Error(
      "An unambiguous supported administration frequency is required",
    );
  if (!m.maximum)
    throw Error(
      "A scoped maximum is not established; this calculator will not assume one",
    );
  const cap = m.maximum.match(
    /^(\d+(?:\.\d+)?)\s*mg\s*(?:per|\/)\s*(dose|day)\b/i,
  );
  if (!cap)
    throw Error(
      "The maximum must explicitly distinguish mg per dose from mg per day",
    );
  const rate = Number(m.dose),
    uncapped =
      m.dose_basis === "per_day"
        ? (rate * weightKg) / administrations
        : rate * weightKg;
  const maximumPerDose =
    Number(cap[1]) / (cap[2]!.toLowerCase() === "day" ? administrations : 1);
  if (!Number.isFinite(rate) || rate <= 0 || maximumPerDose <= 0)
    throw Error("The regimen contains invalid numerical values");
  const doseMg = Math.min(uncapped, maximumPerDose),
    round = (n: number) => Math.round(n * 1000) / 1000;
  return {
    drug: m.drug,
    weightKg,
    doseBasis: m.dose_basis,
    doseMg: round(doseMg),
    dailyTotalMg: round(doseMg * administrations),
    administrationsPerDay: administrations,
    capped: uncapped > maximumPerDose,
    calculation: `${rate} mg/kg ${m.dose_basis === "per_day" ? "per day" : "per dose"} × ${weightKg} kg${m.dose_basis === "per_day" ? ` ÷ ${administrations} administrations/day` : ""}; maximum ${m.maximum}.`,
    limitation:
      "Arithmetic from the selected source-supported regimen. Population, formulation, rounding and organ-function applicability require separate assessment. No liquid-volume conversion was inferred.",
  };
}
