import inventory from "./medication-inventory.json";
import {
  lessons,
  medicationSafetyProfiles,
  antibioticRelevance,
} from "./curriculum";
// Derive navigation from actual lessons so newly taught drugs cannot disappear from search.
const names = [
  ...new Set([
    ...inventory.map((m) => m.name),
    ...medicationSafetyProfiles.map((p) => p.drug),
  ]),
];
const extraAliases: Record<string, string[]> = {
  "ampicillin IV": ["IV ampicillin", "intravenous ampicillin"],
  "atovaquone suspension": ["atovaquone", "Mepron"],
  "dapsone oral": ["oral dapsone", "dapsone tablet"],
  "metronidazole vaginal gel": ["vaginal metronidazole", "metronidazole gel 0.75%"],
  "amoxicillin-clavulanate XR": ["Augmentin XR", "extended release amoxicillin clavulanate"],
  "ofloxacin otic": ["ofloxacin ear drops"],
  "vancomycin IV": ["IV vancomycin", "intravenous vancomycin"],
  "clindamycin IV": ["IV clindamycin", "intravenous clindamycin"],
  "metronidazole IV": ["IV metronidazole", "intravenous metronidazole"],
  "ciprofloxacin-dexamethasone otic": [
    "Ciprodex",
    "ciprofloxacin dexamethasone ear drops",
  ],
  "omeprazole-amoxicillin-rifabutin": ["Talicia", "rifabutin triple therapy"],
  "clindamycin-benzoyl peroxide topical": [
    "Acanya",
    "clindamycin benzoyl peroxide",
  ],
  "penicillin G aqueous": [
    "aqueous crystalline penicillin G",
    "penicillin G IV",
  ],
};
export const medicationInventory = names.map((name) => {
  const original = inventory.find((m) => m.name === name);
  const linked = lessons.filter(
    (l) => l.regimen && l.medication_names?.includes(name),
  );
  const topicIds = [
    ...new Set([
      ...(original?.topics.map((t) => t.topic_id) || []),
      ...linked.flatMap((l) => l.topic_ids || []),
    ]),
  ];
  return {
    name,
    id:
      original?.id ||
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, ""),
    aliases: [
      ...new Set([
        name,
        ...(original?.aliases || []),
        ...(extraAliases[name] || []),
      ]),
    ],
    topics: topicIds.map((topic_id) => ({
      topic_id,
      title:
        antibioticRelevance.find((r) => r.topic_id === topic_id)?.title ||
        original?.topics.find((t) => t.topic_id === topic_id)?.title ||
        topic_id,
      matched_names: [name],
    })),
    status: medicationSafetyProfiles.some((p) => p.drug === name)
      ? "scoped_safety_profile"
      : "reference_required",
    notice:
      original?.notice ||
      "Scoped formulation-specific teaching; not complete prescribing evidence or a current-availability claim.",
    regimen_lesson_ids: linked.map((l) => l.id),
  };
});
export function medicationSearch(query: unknown, topic?: unknown) {
  if (typeof query !== "string" || query.length > 200)
    throw Error("Use a medication name of at most 200 characters");
  const words = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  return medicationInventory.filter(
    (m) =>
      (!topic || m.topics.some((t) => t.topic_id === topic)) &&
      words.every((w) =>
        [m.name, ...m.aliases].join(" ").toLowerCase().includes(w),
      ),
  );
}
export type LabelChoice = {
  setid: string;
  title: string;
  published_date: string;
  spl_version: string;
  category: string;
  drug_id: string;
};
const guid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const categories = ["C73594", "C73584", "C73585"]; // FDA: NDA, ANDA, BLA.
async function boundedFetch(url: string, max = 2000000) {
  const r = await fetch(url, {
    redirect: "error",
    signal: AbortSignal.timeout(15000),
    headers: { Accept: "application/json,application/xml,text/xml" },
  });
  if (!r.ok || !r.body)
    throw Error(
      "Official label service unavailable; no fallback medical facts were generated",
    );
  const reader = r.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.length;
    if (size > max) {
      await reader.cancel();
      throw Error("Official response too large; open the original source");
    }
    chunks.push(value);
  }
  return Buffer.concat(chunks).toString("utf8");
}
export async function searchOfficialLabels(id: unknown) {
  const drug = medicationInventory.find((m) => m.id === id);
  if (!drug) throw Error("Choose a medication from the inventory");
  const groups = await Promise.all(
    categories.map(async (category) => {
      const url = new URL(
        "https://dailymed.nlm.nih.gov/dailymed/services/v2/spls.json",
      );
      url.searchParams.set("drug_name", drug.name);
      url.searchParams.set("marketing_category_code", category);
      url.searchParams.set("pagesize", "100");
      const data = JSON.parse(await boundedFetch(url.href));
      if (!Array.isArray(data.data))
        throw Error("Unexpected official label response");
      return data.data
        .filter(
          (x: any) => guid.test(x.setid || "") && typeof x.title === "string",
        )
        .map(
          (x: any): LabelChoice => ({
            setid: x.setid,
            title: x.title,
            published_date: String(x.published_date || ""),
            spl_version: String(x.spl_version || ""),
            category,
            drug_id: drug.id,
          }),
        );
    }),
  );
  const choices = [
    ...new Map(groups.flat().map((x) => [x.setid, x])).values(),
  ].sort(
    (a, b) =>
      (Date.parse(b.published_date) || 0) - (Date.parse(a.published_date) || 0),
  );
  return {
    choices,
    notice:
      "Product choices from up to the first 100 results per NDA/ANDA/BLA category, ordered by reported publication date. Not a complete product list or guarantee of newest labeling. Choose the exact ingredient(s), route, formulation and strength. Listing alone does not verify current marketing status or an FDA approval claim.",
  };
}
function plain(xml: string) {
  return xml
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<\/(?:tr|paragraph|list|item)>/gi, "\n")
    .replace(/<\/(?:td|th)>/gi, " | ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&#(x[0-9a-f]+|\d+);/gi, (_, n) => {
      const v =
        n[0].toLowerCase() === "x" ? parseInt(n.slice(1), 16) : parseInt(n, 10);
      return v <= 0x10ffff ? String.fromCodePoint(v) : "";
    })
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s*\n/g, "\n")
    .trim();
}
export function extractLabelSections(xml: string) {
  if (/<!DOCTYPE|<!ENTITY/i.test(xml))
    throw Error("Unsupported XML declarations");
  if (!/displayName="HUMAN (?:PRESCRIPTION|OTC) DRUG LABEL"/i.test(xml))
    throw Error("Only human drug labels can be loaded");
  const starts: number[] = [];
  const sections: { title: string; text: string }[] = [];
  const omitted: string[] = [];
  const tags = /<section\b[^>]*>|<\/section>/gi;
  let token: RegExpExecArray | null;
  let total = 0;
  while ((token = tags.exec(xml))) {
    if (!token[0].startsWith("</")) {
      starts.push(tags.lastIndex);
      continue;
    }
    const start = starts.pop();
    if (start === undefined) throw Error("Malformed label sections");
    const block = xml.slice(start, token.index);
    const title = plain(
      block.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "",
    );
    if (
      !/^\d+(?:\.|\s)|dosage|administration|contraindication|warning|precaution|interaction|renal|hepatic|specific populations|boxed/i.test(
        title,
      )
    )
      continue;
    const firstText = block.search(/<text\b/i);
    const firstChild = block.search(/<section\b/i);
    if (firstChild >= 0 && (firstText < 0 || firstChild < firstText)) continue;
    const body = block.match(/<text\b[^>]*>([\s\S]*?)<\/text>/i)?.[1];
    if (!body) continue;
    const text = plain(body);
    if (text.length > 20000 || total + text.length > 70000) {
      omitted.push(title);
      continue;
    }
    if (!text || sections.some((s) => s.title === title && s.text === text))
      continue;
    sections.push({ title, text });
    total += text.length;
  }
  if (starts.length) throw Error("Incomplete label XML");
  if (!sections.length)
    throw Error(
      "No complete relevant label sections could be read; open the official source",
    );
  return { sections, omitted };
}
export async function readOfficialLabel(choice: LabelChoice) {
  if (!guid.test(choice.setid)) throw Error("Invalid label identifier");
  const url = `https://dailymed.nlm.nih.gov/dailymed/services/v2/spls/${choice.setid}.xml`;
  const xml = await boundedFetch(url);
  const content = extractLabelSections(xml);
  const documentVersion = xml.match(
    /<versionNumber\b[^>]*value="([^"]+)"/i,
  )?.[1];
  const effectiveDate = xml.match(/<effectiveTime\b[^>]*value="([^"]+)"/i)?.[1];
  return {
    ...choice,
    spl_version: documentVersion || choice.spl_version,
    label_effective_date: effectiveDate || null,
    ...content,
    url: `https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=${choice.setid}`,
    xml_url: url,
    accessed: new Date().toISOString(),
    notice:
      "Current official-page lookup for this selected product, not independently checked clinical teaching. Keep table headers/units and population limits together. Missing or omitted sections are evidence gaps. Do not generate a dose from incomplete tables. Disease-specific guidance may differ from labeling. No commercial monograph is connected.",
  };
}
