/** Bounded private-preview smoke checks. No credentials or user conversations are logged. */
export const releaseSmoke: {
  status: string;
  checks: any[];
  startedAt?: string;
  finishedAt?: string;
} = { status: "not_run", checks: [] };
export async function runReleaseSmoke(port: number) {
  if (
    process.env.FM_PREVIEW_RELEASE_SMOKE !== "1" ||
    !process.env.FM_TUTOR_ACCESS_TOKEN
  )
    return;
  releaseSmoke.status = "running";
  releaseSmoke.startedAt = new Date().toISOString();
  const base = `http://127.0.0.1:${port}`;
  try {
    const login = await fetch(base + "/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: process.env.FM_TUTOR_ACCESS_TOKEN }),
    });
    const cookie = login.headers.get("set-cookie")?.split(";")[0];
    if (!login.ok || !cookie) throw Error("Private preview login failed");
    for (const [name, query] of [
      [
        "official_source_fallback",
        "Explain how USPSTF screening recommendations differ from diagnostic evaluation of symptoms. Check official sources.",
      ],
      [
        "adult_medication_fields",
        "For general education, what amoxicillin regimen does CDC recommend for confirmed group A streptococcal pharyngitis in an adult? Include units, route, frequency and duration; identify missing adjustments.",
      ],
    ]) {
      const started = Date.now();
      try {
        const r = await fetch(base + "/api/conversation", {
          method: "POST",
          headers: { "Content-Type": "application/json", Cookie: cookie },
          body: JSON.stringify({ query, mode: "quick", forceLookup: true }),
          signal: AbortSignal.timeout(180000),
        });
        const answer: any = await r.json();
        releaseSmoke.checks.push({
          name,
          httpStatus: r.status,
          elapsedMs: Date.now() - started,
          lookup: answer.lookup,
          support: answer.support,
          sourceCount: answer.sources?.length || 0,
          claimCount: answer.claims?.length || 0,
          medicationCount: answer.medications?.length || 0,
          passageCount: answer.passages?.length || 0,
          clinicalReview: answer.clinicalReview,
          visibleCodes: /\[(?:EVID|REF|MED)\s/.test(answer.text || ""),
          sourceTitles: answer.sources?.map((s: any) => ({
            organization: s.organization,
            title: s.title,
            url: s.url,
            access: s.access,
          })),
          gaps: answer.gaps,
        });
      } catch {
        releaseSmoke.checks.push({
          name,
          elapsedMs: Date.now() - started,
          status: "request_failed",
        });
      }
    }
    releaseSmoke.status = releaseSmoke.checks.every(
      (c) =>
        c.httpStatus === 200 &&
        c.claimCount > 0 &&
        c.sourceCount > 0 &&
        !c.visibleCodes,
    )
      ? "transport_and_passage_checks_passed"
      : "needs_attention";
  } catch {
    releaseSmoke.status = "failed";
  } finally {
    releaseSmoke.finishedAt = new Date().toISOString();
    console.log("Preview release smoke:", JSON.stringify(releaseSmoke));
  }
}
