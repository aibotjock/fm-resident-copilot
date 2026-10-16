import { SEED_CHUNKS } from "./seed-data";
import correctionData from "./corrections.json";
import evidenceData from "./evidence.json";
import backlogData from "./review-backlog.json";
import { entryKey, type ReferenceEntry, validateEntries, versionDigest } from "../versions";

export const EVIDENCE = evidenceData;
export const CORRECTIONS = correctionData;
export const CANDIDATE_ENTRIES: ReferenceEntry[] = SEED_CHUNKS.map((original,index) => {
  const changes=CORRECTIONS.filter(c=>c.index===index);
  let content=original.content;
  for(const change of changes) {
    const tagged=`${change.new} [EVID ${change.evidence.join(", ")}]`;
    if(change.old) {
      if(!content.includes(change.old)) throw new Error(`Correction no longer matches baseline entry ${index}`);
      content=content.replace(change.old,tagged);
    } else content+=tagged;
  }
  return {...original, content, key:entryKey(original),
    review:changes.length ? "partially_corrected" : "unresolved",
    evidence:[...new Set(changes.flatMap(c=>c.evidence))],
    evidence_records:EVIDENCE.filter(e=>changes.some(c=>c.evidence.includes(e.id))),
    limitations:"Original review findings (tagged corrections below take precedence): " + backlogData[index].issue + " Full retained-entry verification, detailed dosing review, and reuse rights remain pending. A correction verifies only its explicitly tagged claim, not the rest of this entry.",
  };
});
validateEntries(CANDIDATE_ENTRIES);
export const CANDIDATE_VERSION=`refresh-2026-10-15-${versionDigest(CANDIDATE_ENTRIES).slice(0,12)}`;
