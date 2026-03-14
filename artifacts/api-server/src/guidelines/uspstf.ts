interface USPSTFRecommendation {
  id: string;
  title: string;
  grade: string;
  topic: string;
  status: string;
  releaseDate?: string;
  url: string;
}

interface USPSTFCache {
  data: USPSTFRecommendation[];
  fetchedAt: number;
}

const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const USPSTF_API = "https://www.uspreventiveservicestaskforce.org/uspstf/api/json/all";

let cache: USPSTFCache | null = null;

export async function fetchUSPSTFRecommendations(): Promise<USPSTFRecommendation[]> {
  if (cache && Date.now() - cache.fetchedAt < CACHE_TTL_MS) {
    return cache.data;
  }

  try {
    const res = await fetch(USPSTF_API, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      console.error(`USPSTF API error: ${res.status}`);
      return cache?.data ?? [];
    }

    const raw = await res.json() as any[];
    const recommendations: USPSTFRecommendation[] = raw
      .filter((r: any) => r.status === "Final" || r.status === "Active")
      .map((r: any) => ({
        id: String(r.id ?? ""),
        title: String(r.title ?? r.name ?? ""),
        grade: String(r.grade ?? r.gradeCode ?? ""),
        topic: String(r.topicName ?? r.title ?? ""),
        status: String(r.status ?? ""),
        releaseDate: r.releaseDate ?? r.lastUpdated ?? undefined,
        url: `https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/${r.alias ?? r.id ?? ""}`,
      }));

    cache = { data: recommendations, fetchedAt: Date.now() };
    return recommendations;
  } catch (err) {
    console.error("Failed to fetch USPSTF data:", err);
    return cache?.data ?? [];
  }
}

export async function getUSPSTFContext(query: string): Promise<string> {
  const recs = await fetchUSPSTFRecommendations();
  if (recs.length === 0) return "";

  const lower = query.toLowerCase();

  const keywords = lower
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3 && !STOP_WORDS.has(w));

  const scored = recs
    .map((r) => {
      const haystack = (r.title + " " + r.topic).toLowerCase();
      const score = keywords.reduce(
        (acc, kw) => acc + (haystack.includes(kw) ? 1 : 0),
        0
      );
      return { r, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  if (scored.length === 0) return "";

  const lines = scored.map(
    ({ r }) =>
      `- ${r.title} | Grade: ${r.grade || "N/A"}${r.releaseDate ? ` | Updated: ${r.releaseDate}` : ""} | ${r.url}`
  );

  return `\nLIVE USPSTF RECOMMENDATIONS (fetched from USPSTF.org):\n${lines.join("\n")}\nUse these current grades and recommendations. The grade and date above are authoritative.`;
}

const STOP_WORDS = new Set([
  "what", "when", "how", "does", "should", "the", "for", "and",
  "with", "from", "this", "that", "give", "tell", "about", "best",
  "patient", "treat", "therapy", "treatment", "management", "clinical",
]);
