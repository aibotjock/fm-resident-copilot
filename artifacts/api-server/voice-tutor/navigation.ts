// Search-only vocabulary. These aliases do not add medical evidence or regimens.
export function normalizeNavigation(value: string) {
  return value
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/\bimpatient\s+pneumonia\b/g, "inpatient pneumonia")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

export function navigationTerms(value: string) {
  return normalizeNavigation(
    value
      .replace(/\bCAP\b/gi, "CAP community acquired pneumonia")
      .replace(/\bUTI\b/gi, "UTI urinary tract infection")
      .replace(/\bhospitalized\b/gi, "hospitalized inpatient")
      .replace(
        /\bpyelonephritis\b/gi,
        "pyelonephritis kidney infection upper UTI",
      ),
  );
}

export function matchesNavigation(value: string, query: string) {
  const text = navigationTerms(value);
  return normalizeNavigation(query)
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => text.includes(word));
}
