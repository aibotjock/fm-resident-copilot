/** Shared browser/server cleanup: never strip clinically meaningful digits or tables. */
export function cleanClinicalText(text: string): string {
  return String(text || "")
    .replace(/%%FM_CITE%%[\s\S]*?(?:%%\/FM_CITE%%|$)/g, "")
    .replace(/\[(?:EVID|REF|MED|SOURCE)\s+[^\]]*\]/gi, "")
    .replace(/\uE200[\s\S]*?\uE201/g, "")
    .replace(/\uE200[^\n]*$/g, "")
    .replace(/\[([^\]]+)\]\(https?:\/\/[^)]+\)/g, "$1")
    .replace(/https?:\/\/[^\s)]+/g, "")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/ +([,.;:])/g, "$1")
    .trim();
}
export function speechText(text: string): string {
  return cleanClinicalText(text)
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/^\s*\|?\s*:?-{3,}.*$/gm, "")
    .replace(/\|/g, "; ")
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
export function speechChunks(text: string, limit = 3500): string[] {
  const chunks: string[] = [];
  let remaining = text.trim();
  while (remaining.length > limit) {
    let boundary = remaining.lastIndexOf(" ", limit);
    if (boundary < limit / 2) boundary = limit;
    chunks.push(remaining.slice(0, boundary));
    remaining = remaining.slice(boundary).trimStart();
  }
  if (remaining) chunks.push(remaining);
  return chunks;
}

export type Scenario = {
  confirmed: Record<string, string>;
  hypothetical: Record<string, string>;
  revision: number;
};
export function updateScenario(
  old: Scenario,
  action: "set" | "vary" | "restore" | "reset",
  values: Record<string, string> = {},
): Scenario {
  const safe = Object.fromEntries(
    Object.entries(values).filter(
      ([key, value]) =>
        /^[a-z_]{1,40}$/.test(key) &&
        typeof value === "string" &&
        value.length <= 300,
    ),
  );
  if (
    Object.keys(safe).length !== Object.keys(values).length ||
    Object.keys(safe).length > 20
  )
    throw Error("Use short scenario fields without identifiers");
  return action === "reset"
    ? { confirmed: {}, hypothetical: {}, revision: old.revision + 1 }
    : action === "restore"
      ? { ...old, hypothetical: {}, revision: old.revision + 1 }
      : action === "vary"
        ? {
            ...old,
            hypothetical: { ...old.hypothetical, ...safe },
            revision: old.revision + 1,
          }
        : {
            confirmed: { ...old.confirmed, ...safe },
            hypothetical: {},
            revision: old.revision + 1,
          };
}
/** Recognize only explicitly stated clinical modifiers, never infer patient facts. */
export function scenarioFromUtterance(old: Scenario, text: string): Scenario {
  if (/^\s*(?:start (?:a )?)?new case[.!]?\s*$/i.test(text))
    return updateScenario(old, "reset");
  if (
    /\b(?:return|restore|back) to (?:the )?original (?:case|scenario)\b/i.test(
      text,
    )
  )
    return updateScenario(old, "restore");
  const hypothetical =
    /\b(?:what if|suppose|hypothetical|make (?:her|him|them|the patient)|instead|now (?:she|he|they))\b/i.test(
      text,
    );
  const supplied =
    hypothetical ||
    /\b(?:the patient|this patient|she is|he is|they are|actually|correction)\b/i.test(
      text,
    );
  if (!supplied) return old;
  const values: Record<string, string> = {};
  if (/\bnot pregnant|nonpregnant\b/i.test(text))
    values.pregnancy = "not pregnant";
  else if (/\bpregnant|pregnancy\b/i.test(text))
    values.pregnancy = "pregnant; trimester not established unless supplied";
  const renal = text.match(
    /\b(?:eGFR|CrCl|creatinine clearance|GFR)\s*(?:is|=|of|:)?\s*\d+(?:\.\d+)?(?:\s*mL\/min(?:\/1\.73\s*m[²2])?)?/i,
  );
  if (renal) values.renal_function = renal[0];
  else if (
    /\b(?:impaired renal|renal impairment|kidney impairment|kidney disease)\b/i.test(
      text,
    )
  )
    values.renal_function = "impaired; measure and severity not established";
  if (/\b(?:hepatic impairment|liver impairment|liver disease)\b/i.test(text))
    values.hepatic_function = "impaired; severity not established";
  const age = text.match(
    /\b\d+(?:\.\d+)?\s*(?:years? old|year-old|months? old|month-old|weeks? old|week-old)\b/i,
  );
  if (age) values.age = age[0];
  const weight = text.match(
    /\b(?:weighs?|weight\s*(?:is|of|:)?)\s*(\d+(?:\.\d+)?\s*(?:kg|kilograms?|lb|pounds?))\b/i,
  );
  if (weight) values.weight = weight[1]!;
  const allergy = text.match(
    /\b(?:penicillin|amoxicillin|cephalosporin|sulfa|sulfonamide)\s+allerg(?:y|ic)\b/i,
  );
  if (allergy)
    values.allergy =
      allergy[0] +
      (/\banaphylaxis\b/i.test(text)
        ? "; anaphylaxis"
        : /\brash\b/i.test(text)
          ? "; rash"
          : "; reaction not established");
  return Object.keys(values).length
    ? updateScenario(old, hypothetical ? "vary" : "set", values)
    : old;
}

export function affectedStudyItems<
  T extends {
    evidence?: { url: string; version: string }[];
    needsReview?: boolean;
  },
>(items: T[], versions: Record<string, string>): T[] {
  return items.map((item) => ({
    ...item,
    needsReview:
      item.needsReview ||
      !!item.evidence?.some(
        (e) => versions[e.url] !== undefined && versions[e.url] !== e.version,
      ),
  }));
}
