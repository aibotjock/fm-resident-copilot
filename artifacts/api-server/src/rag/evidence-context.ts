import type { SearchResult } from "./store";

export function formatReference(c:SearchResult,index:number):string {
  const evidence=c.evidence_records ?? [];
  return `[REF ${index+1}] ${c.source} — ${c.guideline_title} (${c.guideline_year})\n`+
    `Domain: ${c.abfm_domain} | Section: ${c.section}\n`+
    `Review: ${c.review}; legacy citation is NOT proof of current verification.\n`+
    `Unresolved: ${c.limitations}\n`+
    (c.url ? `Original citation (not fully reverified): ${c.url}\n` : "")+
    `Retained teaching content; only [EVID id] changes below are individually checked:\n${c.content}\n`+
    evidence.map(e=>`[EVID ${e.id}] Checked scope: ${e.claim}\nOfficial source: ${e.organization}; ${e.title}; publication/revision ${e.publicationDate ?? "not established"}; accessed ${e.accessDate}; ${e.locator}; ${e.url}`).join("\n");
}
export function citationMetadata(chunks:SearchResult[]) {
  const checked=[...new Map(chunks.flatMap(c=>c.evidence_records ?? []).map(e=>[e.id,e])).values()];
  return {
    domain:chunks[0]?.abfm_domain ?? "Unclassified", weight:"",
    citations:checked.map(e=>({source:e.organization,year:e.publicationDate?.slice(0,4) ?? "",
      guideline:e.title,confidence:"peripheral",note:`Checked scope: ${e.claim}`,url:e.url,
      accessed:e.accessDate,reviewStatus:"Checked claim; whole topic review incomplete"})),
    limitation:"Preview review is incomplete. Only explicitly identified claims have been checked. Retained historical content is not certified current; consult the linked original sources. Citations list available evidence, not independent validation of every generated sentence.",
    referenceVersion:chunks[0]?.version_id ?? null,
  };
}
// Hide model-generated footer metadata. The server supplies the evidence catalog.
// Keep only the possible partial marker, so ordinary prose streams immediately.
export class CitationFilter {
  private tail="";
  private hidden=false;
  push(text:string):string {
    if(this.hidden) return "";
    this.tail+=text;
    const marker="%%FM_CITE%%";
    const i=this.tail.indexOf(marker);
    if(i>=0) {const output=this.tail.slice(0,i);this.tail="";this.hidden=true;return output;}
    let held=0;
    for(let n=1;n<marker.length;n++) if(this.tail.endsWith(marker.slice(0,n))) held=n;
    const output=this.tail.slice(0,this.tail.length-held);
    this.tail=this.tail.slice(this.tail.length-held);
    return output;
  }
  finish():string {const output=this.tail;this.tail="";return this.hidden ? "" : output;}
}
