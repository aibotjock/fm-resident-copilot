import {
  cleanClinicalText,
  affectedStudyItems,
  type Scenario,
} from "./presentation";
import type { EvidenceAnswer } from "./evidence";

type Saved = {
  id: string;
  question: string;
  answer: string;
  evidence: { url: string; version: string }[];
  needsReview?: boolean;
  due: number;
  interval: number;
  history: { at: string; rating: string }[];
  sourcePassages?: { url: string; quote: string }[];
  previousVersions?: {
    answer: string;
    evidence: { url: string; version: string }[];
    at: string;
  }[];
};
type Options = {
  api: (path: string, body?: unknown) => Promise<any>;
  log: (role: string, text: string) => void;
  topic: () => string;
  data: () => any;
  persist: () => void;
  startVoice: () => void;
  stopVoice: () => void;
  interrupt: () => void;
};
let options: Options,
  latest: EvidenceAnswer | undefined,
  audio: HTMLAudioElement | undefined,
  controller: AbortController | undefined;
let epoch = 0,
  mode = "quick",
  voice = false,
  scenario: Scenario = { confirmed: {}, hypothetical: {}, revision: 0 };
let latestQuestion = "";
let pendingTranscript = "";
export async function handleTranscript(text: string) {
  if (
    pendingTranscript &&
    /^(?:yes|confirm|correct|that'?s right|yes that'?s right)[.!]?$/i.test(
      text.trim(),
    )
  ) {
    const query = input("recognizedQuestion").value || pendingTranscript;
    pendingTranscript = "";
    input("recognizedQuestion").value = "";
    await submit(query);
    return;
  }
  if (/^(?:no|cancel|stop)[.!]?$/i.test(text.trim())) {
    pendingTranscript = "";
    input("recognizedQuestion").value = "";
    await cancel();
    return;
  }
  if (
    pendingTranscript ||
    /\b(?:dose|dosing|mg|mcg|milligrams?|micrograms?|units?|antibiotic|prescrib\w*|insulin)\b/i.test(
      text,
    )
  ) {
    pendingTranscript = text;
    input("recognizedQuestion").value = text;
    status(
      "Check the recognized medication question. Say confirm, or correct the wording and confirm below.",
    );
    readLocal(
      "I heard: " +
        text +
        ". Say confirm if that is correct, or correct the question.",
    );
    return;
  }
  await submit(text);
}
const $ = (id: string) => document.getElementById(id)!;
const input = (id: string) => $(id) as HTMLInputElement;
const button = (label: string, run: () => void) => {
  const b = document.createElement("button");
  b.textContent = label;
  b.type = "button";
  b.onclick = run;
  return b;
};
function status(text: string) {
  $("evidenceState").textContent = text;
}
export function currentMode() {
  return mode;
}
export function evidenceVoice() {
  return voice;
}
export function voiceStopped() {
  voice = false;
  const b = document.getElementById("evidenceVoice");
  if (b) b.textContent = "Start evidence voice";
}
export function interruptForSpeech() {
  epoch++;
  controller?.abort();
  stopPlayback();
}
export function setMode(value: string) {
  if (!["quick", "teach", "quiz"].includes(value))
    throw Error("Choose quick, teach or quiz");
  mode = value;
  (input("answerMode") as unknown as HTMLSelectElement).value = mode;
}
export function stopPlayback() {
  audio?.pause();
  audio = undefined;
  window.speechSynthesis?.cancel();
  (window as any).FMAndroid?.stop();
  options?.interrupt();
}
export async function cancel() {
  epoch++;
  controller?.abort();
  stopPlayback();
  try {
    await options.api("conversation/cancel", {});
  } catch {}
  status("Stopped. You can correct the question or ask another.");
}
function renderScenario() {
  $("caseFacts").textContent = Object.keys(scenario.confirmed).length
    ? Object.entries(scenario.confirmed)
        .map(([k, v]) => `${k.replaceAll("_", " ")}: ${v}`)
        .join(" · ")
    : "No confirmed case facts. Missing details remain unknown.";
  $("caseVariation").textContent = Object.keys(scenario.hypothetical).length
    ? "Hypothetical variation: " +
      Object.entries(scenario.hypothetical)
        .map(([k, v]) => `${k.replaceAll("_", " ")}: ${v}`)
        .join(" · ")
    : "Original scenario active.";
}
export async function changeScenario(
  action: string,
  values: Record<string, string> = {},
) {
  await cancel();
  scenario = await options.api("conversation/scenario", { action, values });
  renderScenario();
  return scenario;
}
export function showAnswer(answer: EvidenceAnswer, question = "") {
  latestQuestion = question;
  if ((answer as any).scenario) {
    scenario = (answer as any).scenario;
    renderScenario();
  }
  latest = answer;
  $("evidenceAnswer").textContent = cleanClinicalText(answer.text);
  $("evidenceAnswer").dataset.question=question;
  $("evidenceSources").replaceChildren();
  $("doseChoices").replaceChildren();
  answer.medications.forEach((m, i) => {
    const option = document.createElement("option");
    option.value = String(i);
    option.textContent = m.drug;
    $("doseChoices").append(option);
  });
  $("doseCalculation").textContent = "";
  const label =
    answer.support === "passage_linked"
      ? "Supporting passages linked"
      : answer.support === "partial"
        ? "Partial evidence coverage"
        : "Evidence gap";
  status(`${label} · independent clinical review pending`);
  for (const source of answer.sources) {
    const detail = document.createElement("details"),
      summary = document.createElement("summary"),
      a = document.createElement("a"),
      meta = document.createElement("p");
    summary.textContent = `${source.organization} — ${source.title}`;
    detail.append(summary);
    a.href = source.url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.textContent = "Open original source";
    meta.textContent = `${source.access === "stored_scope" ? "Stored scoped summary" : "Official document read"} · Published: ${source.publicationDate || "not established"} · Updated: ${source.updateDate || "not established"} · Retrieved: ${source.retrievedAt} · ${source.jurisdiction}. ${source.section}`;
    detail.append(meta, a);
    for (const p of answer.passages.filter((p) => p.source_id === source.id)) {
      const quote = document.createElement("blockquote");
      quote.textContent = p.quote;
      detail.append(quote);
    }
    $("evidenceSources").append(detail);
  }
  if (answer.lookup.attempted) {
    const d = document.createElement("details"),
      s = document.createElement("summary"),
      p = document.createElement("p");
    s.textContent = "Lookup details";
    p.textContent = `${answer.lookup.read} readable official documents. ${answer.lookup.status.replaceAll("_", " ")}. ${answer.lookup.failures.join(" ")}`;
    d.append(s, p);
    $("evidenceSources").append(d);
  }
  const versions = Object.fromEntries(
    answer.sources.map((s) => [s.url, s.version]),
  );
  const data = options.data();
  data.evidenceSaved = affectedStudyItems<Saved>(
    data.evidenceSaved || [],
    versions,
  );
  options.persist();
  renderSaved();
}
export async function submit(query: string, forceLookup = false) {
  query = query.trim();
  if (!query) return;
  const lower = query.toLowerCase().replace(/[.!?]+$/g, "");
  if (/\bquiz me\b/i.test(query)) setMode("quiz");
  else if (/\bteach me\b|explain .*in detail/i.test(query)) setMode("teach");
  else if (/\bquick (?:clinical )?answer\b|^shorter$/i.test(query))
    setMode("quick");
  if (["stop", "pause", "stop speaking"].includes(lower)) {
    await cancel();
    return;
  }
  if (lower === "show the source" || lower === "show sources") {
    $("evidenceSources").scrollIntoView({ behavior: "smooth" });
    return;
  }
  if (
    lower === "return to original case" ||
    lower === "restore original case"
  ) {
    await changeScenario("restore");
    return;
  }
  if (lower === "new case") {
    await newCase();
    return;
  }
  if (
    ["quick answer", "quick clinical answer", "teach me", "quiz me"].includes(
      lower,
    )
  ) {
    setMode(
      lower === "teach me" ? "teach" : lower === "quiz me" ? "quiz" : "quick",
    );
    query = `${lower} about ${options.topic()}`;
  }
  if (lower === "repeat only the dose" && latest) {
    const text = latest.medications
      .map(
        (m) =>
          `${m.drug}: ${m.dose || "dose not established"} ${m.unit || ""}; ${m.dose_basis.replaceAll("_", " ")}; ${m.route || "route not established"}; ${m.frequency || "frequency not established"}; ${m.duration || "duration not established"}; ${m.adjustments || "adjustments not established"}.`,
      )
      .join("\n");
    $("evidenceAnswer").textContent =
      text ||
      "No supported medication dose was established in the last answer.";
    readLocal(text);
    return;
  }
  stopPlayback();
  controller?.abort();
  controller = new AbortController();
  const revision = ++epoch;
  options.log("user", query);
  status(
    forceLookup
      ? "Checking current official sources…"
      : "Finding relevant evidence…",
  );
  try {
    const focus =
      input("conversationFocus").value.trim() ||
      (input("useLibraryFocus").checked ? options.topic() : "");
    const r = await fetch("/api/conversation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, mode, topic: focus, forceLookup }),
      signal: controller.signal,
    });
    const result = await r.json();
    if (!r.ok) throw Error(result.error || "Evidence request failed");
    if (revision !== epoch) return;
    showAnswer(result, query);
    options.log("assistant", result.text);
    if (input("speakAnswers").checked || voice) await readLatest(revision);
  } catch (e) {
    if (revision === epoch && (e as Error).name !== "AbortError")
      status((e as Error).message);
  }
}
function readLocal(text: string) {
  if (!text) return;
  stopPlayback();
  if ((window as any).FMAndroid?.speak) {
    (window as any).FMAndroid.speak(text);
  } else if (window.speechSynthesis) {
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.96;
    window.speechSynthesis.speak(u);
  } else
    status(
      "On-device speech is unavailable; use Read answer for server audio.",
    );
}
export async function readLatest(revision = epoch) {
  if (!latest) return;
  stopPlayback();
  status("Preparing speech from the displayed answer…");
  try {
    const r = await fetch("/api/conversation/speech", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{}",
    });
    if (!r.ok)
      throw Error(
        "Server audio unavailable; using device speech if supported.",
      );
    const blob = await r.blob();
    if (revision !== epoch) return;
    const url = URL.createObjectURL(blob);
    audio = new Audio(url);
    audio.onended = () => {
      URL.revokeObjectURL(url);
      status(voice ? "Listening…" : "Ready");
    };
    audio.onerror = () => {
      URL.revokeObjectURL(url);
      status("Audio playback failed; the written answer is available.");
    };
    await audio.play();
    status("Speaking · interrupt or press Stop");
  } catch (e) {
    if (revision === epoch) {
      status((e as Error).message);
      readLocal(latest.speech);
    }
  }
}
async function newCase() {
  await cancel();
  await options.api("conversation/reset", {});
  scenario = { confirmed: {}, hypothetical: {}, revision: 0 };
  latest = undefined;
  $("evidenceAnswer").textContent = "";
  $("evidenceSources").replaceChildren();
  renderScenario();
  status("New case. Prior case details are no longer active.");
}
function renderSaved() {
  $("savedEvidence").replaceChildren();
  const items: Saved[] = options.data().evidenceSaved || [];
  for (const item of items.slice().reverse()) {
    const d = document.createElement("details"),
      s = document.createElement("summary"),
      p = document.createElement("p");
    s.textContent = `${item.needsReview ? "Update review needed · " : item.due <= Date.now() ? "Due · " : "Saved · "}${item.question}`;
    p.textContent = item.answer;
    d.append(s, p);
    if (item.needsReview) {
      const n = document.createElement("p");
      n.textContent =
        "Supporting evidence changed. This item is excluded from active review until you check it.";
      d.append(
        n,
        button("Recheck sources", () => {
          void submit(item.question, true);
        }),
      );
      if (latest && latestQuestion === item.question) {
        const comparison = document.createElement("details"),
          title = document.createElement("summary"),
          before = document.createElement("p"),
          after = document.createElement("p");
        title.textContent = "Compare previous and newly retrieved support";
        before.textContent =
          "Previous supporting passages: " +
          (item.sourcePassages?.map((p) => p.quote).join(" ") ||
            "Not recorded for this older item.");
        after.textContent =
          "New supporting passages: " +
          (latest.passages.map((p) => p.quote).join(" ") ||
            "No replacement supporting passage was established.");
        comparison.append(title, before, after);
        d.append(comparison);
        if (latest.claims.length || latest.medications.length)
          d.append(
            button("Replace my study copy after review", () => {
              if (
                !latest ||
                latestQuestion !== item.question ||
                !confirm(
                  "Replace this study copy with the displayed answer? The previous version and review history will be retained. This does not establish independent clinical validation.",
                )
              )
                return;
              item.previousVersions ||= [];
              item.previousVersions.push({
                answer: item.answer,
                evidence: item.evidence,
                at: new Date().toISOString(),
              });
              item.answer = latest.text;
              item.evidence = latest.sources.map((s) => ({
                url: s.url,
                version: s.version,
              }));
              item.sourcePassages = latest.passages.map((p) => ({
                url:
                  latest!.sources.find((s) => s.id === p.source_id)?.url || "",
                quote: p.quote,
              }));
              item.needsReview = false;
              item.due = Date.now() + 86400000;
              options.persist();
              renderSaved();
            }),
          );
      }
    } else
      for (const [label, days] of [
        ["Again", 1],
        ["Hard", 3],
        ["Good", 7],
        ["Easy", 14],
      ] as const)
        d.append(
          button(label, () => {
            item.interval = days;
            item.due = Date.now() + days * 86400000;
            item.history.push({ at: new Date().toISOString(), rating: label });
            options.persist();
            renderSaved();
          }),
        );
    d.append(
      button("Delete saved item", () => {
        options.data().evidenceSaved = items.filter((i) => i.id !== item.id);
        options.persist();
        renderSaved();
      }),
    );
    $("savedEvidence").append(d);
  }
}
export function init(o: Options) {
  options = o;
  const anchor = $("typed");
  const panel = document.createElement("section");
  panel.className = "card";
  panel.id = "evidenceConversation";
  panel.innerHTML = `<h2>Ask, understand, apply</h2><p>Text works without a microphone. Voice uses the same evidence answer. <a href="/">Open clinical &amp; study app</a></p>
  <label for="answerMode">Conversation style</label><select id="answerMode"><option value="quick">Quick clinical answer</option><option value="teach">Teach me</option><option value="quiz">Quiz me — one question at a time</option></select>
  <label for="conversationFocus">Topic or condition (optional)</label><input id="conversationFocus" placeholder="Ask freely, or name a topic"><label><input type="checkbox" id="useLibraryFocus"> Use the selected library topic as context</label>
  <div class="row"><button type="button" id="evidenceVoice">Start evidence voice</button><button type="button" id="interruptAnswer">Stop answer</button><button type="button" id="newClinicalCase">New case</button></div>
  <label><input type="checkbox" id="speakAnswers"> Read typed answers aloud</label>
  <label for="recognizedQuestion">Recognized medication question — check names, numbers and units</label><input id="recognizedQuestion" placeholder="Spoken medication questions wait here for confirmation"><button id="confirmRecognized" type="button">Confirm or send corrected wording</button>
  <details><summary>Case facts &amp; hypothetical variations</summary><p id="caseFacts"></p><p id="caseVariation"></p><label for="factName">Clinical detail</label><select id="factName"><option value="pregnancy">Pregnancy</option><option value="renal_function">Renal function</option><option value="hepatic_function">Hepatic function</option><option value="allergy">Allergy and reaction</option><option value="age">Age</option><option value="weight">Weight with units</option><option value="severity">Severity</option><option value="setting">Care setting</option></select><input id="factValue" placeholder="No names or patient identifiers"><div class="row"><button id="confirmFact" type="button">Set confirmed fact</button><button id="varyFact" type="button">Try hypothetical change</button><button id="restoreCase" type="button">Restore original case</button></div></details>
  <p id="evidenceState" role="status">Ready</p><div id="evidenceAnswer" style="white-space:pre-wrap"></div><div class="row"><button id="readEvidence" type="button">Read answer</button><button id="refreshEvidence" type="button">Check latest guidance</button><button id="saveEvidence" type="button">Save answer for review</button></div><div id="evidenceSources"></div>
  <details><summary>Weight-based dose arithmetic</summary><p>Requires a supported mg/kg regimen, explicit frequency and scoped maximum. No regimen or liquid concentration is assumed.</p><select id="doseChoices" aria-label="Supported regimen"></select><label for="doseWeight">Weight in kilograms</label><input id="doseWeight" type="number" step="0.1"><label><input type="checkbox" id="doseApplicability"> I have checked the population, formulation and organ-function applicability</label><button id="calculateDose" type="button">Calculate from this regimen</button><p id="doseCalculation"></p></details>
  <details><summary>Saved answers &amp; spaced review</summary><p>Self-assessed review is separate from scored practice. Changed-source items are paused until reassessed.</p><div id="savedEvidence"></div></details>
  <label><input type="checkbox" id="rememberConversation"> Remember conversation and case checkpoints on this device</label><p><small>Study progress is saved separately. Case conversation stays temporary by default. Save only educational material without patient identifiers.</small></p>`;
  const main = document.querySelector("#workspace .grid > section");
  if (main) main.prepend(panel);
  else anchor.before(panel);
  panel.insertBefore(anchor, $("evidenceState"));
  $("answerMode").onchange = () => setMode(input("answerMode").value);
  $("confirmRecognized").onclick = () => {
    const query = input("recognizedQuestion").value.trim();
    if (query) {
      pendingTranscript = "";
      input("recognizedQuestion").value = "";
      void submit(query);
    }
  };
  $("interruptAnswer").onclick = () => {
    void cancel();
  };
  $("newClinicalCase").onclick = () => {
    void newCase();
  };
  $("readEvidence").onclick = () => {
    void readLatest();
  };
  $("evidenceVoice").onclick = () => {
    if (!voice) {
      options.stopVoice();
      voice = true;
      $("evidenceVoice").textContent = "End evidence voice";
      options.startVoice();
    } else {
      voice = false;
      $("evidenceVoice").textContent = "Start evidence voice";
      options.stopVoice();
      stopPlayback();
    }
  };
  const change = (action: string) => {
    const value = input("factValue").value.trim();
    if (!value) return;
    void changeScenario(action, { [input("factName").value]: value }).catch(
      (e) => status(e.message),
    );
  };
  $("confirmFact").onclick = () => change("set");
  $("varyFact").onclick = () => change("vary");
  $("restoreCase").onclick = () => {
    void changeScenario("restore");
  };
  $("refreshEvidence").onclick = () => {
    const q =
      (options.data().history || [])
        .filter((t: any) => t.role === "user")
        .at(-1)?.content || options.topic();
    void submit(q, true);
  };
  $("calculateDose").onclick = async () => {
    try {
      const result = await options.api("conversation/calculate", {
        medication_index: Number(input("doseChoices").value),
        weight_kg: Number(input("doseWeight").value),
        population_confirmed: input("doseApplicability").checked,
        adjustments_confirmed: input("doseApplicability").checked,
      });
      $("doseCalculation").textContent =
        `${result.doseMg} mg per administration; ${result.dailyTotalMg} mg total per day. ${result.calculation} ${result.limitation}`;
    } catch (e) {
      $("doseCalculation").textContent = (e as Error).message;
    }
  };
  $("saveEvidence").onclick = () => {
    if (!latest) return;
    const data = options.data();
    const question = latestQuestion || options.topic();
    data.evidenceSaved ||= [];
    data.evidenceSaved.push({
      id: crypto.randomUUID(),
      question,
      answer: latest.text,
      evidence: latest.sources.map((s) => ({ url: s.url, version: s.version })),
      sourcePassages: latest.passages.map((p) => ({
        url: latest!.sources.find((s) => s.id === p.source_id)?.url || "",
        quote: p.quote,
      })),
      needsReview: false,
      due: Date.now() + 86400000,
      interval: 1,
      history: [],
    });
    options.persist();
    renderSaved();
    status(
      "Saved for self-assessed review. Refresh and save a new version to replace an outdated item.",
    );
  };
  input("rememberConversation").checked =
    options.data().rememberConversation === true;
  $("rememberConversation").onchange = () => {
    options.data().rememberConversation = input("rememberConversation").checked;
    options.persist();
  };
  // Keep prior records recoverable before applying the new retention preference.
  try {
    const previous = localStorage.getItem("fm-tutor-progress-v1");
    if (
      previous &&
      !localStorage.getItem("fm-tutor-progress-before-evidence-v1")
    )
      localStorage.setItem("fm-tutor-progress-before-evidence-v1", previous);
  } catch {}
  renderScenario();
  renderSaved();
  void options
    .api("evidence/status")
    .then((result) => {
      const data = options.data();
      data.evidenceSaved = affectedStudyItems<Saved>(
        data.evidenceSaved || [],
        result.versions,
      );
      options.persist();
      renderSaved();
    })
    .catch(() => {});
  void options
    .api("conversation/state")
    .then((result) => {
      scenario = result.scenario;
      renderScenario();
      if (result.latestAnswer) showAnswer(result.latestAnswer,result.question||"");
    })
    .catch(() => {});
}
