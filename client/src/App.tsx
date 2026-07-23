import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  Stethoscope, GraduationCap, Layers, Clock,
  Send, ChevronDown, Trophy, BookOpen, Loader2, Settings as SettingsIcon
} from "lucide-react";
import ModeSelector from "./components/ModeSelector";
import MessageBubble, { type Message, type Source } from "./components/MessageBubble";
import VoiceButton from "./components/VoiceButton";
import VignetteCard from "./components/VignetteCard";
import SettingsModal from "./components/SettingsModal";
import { useVoiceRecorder } from "./hooks/useVoiceRecorder";
import { useVoiceStream } from "./hooks/useVoiceStream";
import { streamClinicalQuery, fetchVignette, type ClinicalMode, type Vignette } from "./api/client";
import { apiUrl } from "./lib/settings";

type Tab = "clinical" | "board" | "flashcards" | "history";

const DOMAINS = [
  "Random", "Cardiovascular", "Endocrine", "Respiratory", "Infectious Disease",
  "Maternity Care", "Women's Health", "Pediatrics", "Renal", "Behavioral Health",
  "Preventive Medicine", "Musculoskeletal", "Neurology",
  "Gastroenterology", "Dermatology", "Geriatrics", "Male Reproductive",
  "Hematology/Oncology", "ENT/Ophthalmology", "Emergent/Urgent Care",
  "Population & Practice",
];

export default function App() {
  const [tab, setTab] = useState<Tab>("clinical");
  const [mode, setMode] = useState<ClinicalMode>("point_of_care");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Board prep state
  const [vignette, setVignette] = useState<Vignette | null>(null);
  const [vignetteLoading, setVignetteLoading] = useState(false);
  const [boardDomain, setBoardDomain] = useState("Random");
  const [boardScore, setBoardScore] = useState({ correct: 0, total: 0 });
  const [showDomainPicker, setShowDomainPicker] = useState(false);

  // Voice
  const recorder = useVoiceRecorder();
  const voiceStream = useVoiceStream({
    onUserTranscript: (text) => {
      addMessage({ id: Date.now().toString(), role: "user", content: text });
    },
    onTranscript: (_, full) => {
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant" && last.isStreaming) {
          return [...prev.slice(0, -1), { ...last, content: full }];
        }
        return [...prev, { id: Date.now().toString(), role: "assistant", content: full, isStreaming: true }];
      });
    },
    onComplete: () => {
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.isStreaming) return [...prev.slice(0, -1), { ...last, isStreaming: false }];
        return prev;
      });
      setIsProcessingVoice(false);
    },
    onError: () => setIsProcessingVoice(false),
  });

  const addMessage = (msg: Message) => setMessages((prev) => [...prev, msg]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  // Text query
  const handleSend = useCallback(async () => {
    if (!input.trim() || isStreaming) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: input.trim() };
    addMessage(userMsg);
    setInput("");
    setIsStreaming(true);

    const assistantId = (Date.now() + 1).toString();
    addMessage({ id: assistantId, role: "assistant", content: "", isStreaming: true });

    let fullContent = "";
    let sources: Source[] = [];

    try {
      for await (const event of streamClinicalQuery(userMsg.content, mode)) {
        if ("done" in event) break;
        if (event.type === "transcript") {
          fullContent += event.data as string;
          setMessages((prev) =>
            prev.map((m) => m.id === assistantId ? { ...m, content: fullContent } : m)
          );
        } else if (event.type === "sources") {
          sources = event.data as Source[];
        }
      }
    } catch (err) {
      fullContent = fullContent || "Sorry, an error occurred. Please try again.";
    }

    setMessages((prev) =>
      prev.map((m) =>
        m.id === assistantId ? { ...m, content: fullContent, isStreaming: false, sources } : m
      )
    );
    setIsStreaming(false);
  }, [input, isStreaming, mode]);

  // Voice toggle
  const handleVoiceToggle = useCallback(async () => {
    if (recorder.state === "recording") {
      const blob = await recorder.stopRecording();
      if (blob.size > 0) {
        setIsProcessingVoice(true);
        await voiceStream.streamVoiceResponse(apiUrl("/voice/chat"), blob);
      }
    } else {
      await recorder.startRecording();
    }
  }, [recorder, voiceStream]);

  // Load vignette
  const loadVignette = useCallback(async () => {
    setVignetteLoading(true);
    try {
      const v = await fetchVignette(boardDomain === "Random" ? undefined : boardDomain);
      setVignette(v);
    } catch {
      // retry silently
    }
    setVignetteLoading(false);
  }, [boardDomain]);

  useEffect(() => {
    if (tab === "board" && !vignette && !vignetteLoading) loadVignette();
  }, [tab]);

  const handleVignetteNext = () => {
    setBoardScore((prev) => ({ ...prev, total: prev.total + 1 }));
    loadVignette();
  };

  // ─── Render ─────────────────────────────────
  return (
    <div className="flex flex-col h-screen max-w-lg mx-auto">
      {/* Header */}
      <header className="px-4 pt-4 pb-2">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-9 h-9 rounded-xl bg-teal-500/20 flex items-center justify-center">
            <Stethoscope size={20} className="text-teal-400" />
          </div>
          <div className="flex-1">
            <h1 className="text-base font-bold text-white">FM Resident Copilot</h1>
            <p className="text-[10px] text-gray-500">Evidence-based clinical support</p>
          </div>
          <button
            onClick={() => setShowSettings(true)}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:text-teal-400 hover:bg-white/5 transition"
            aria-label="Settings"
          >
            <SettingsIcon size={20} />
          </button>
        </div>
        {tab === "clinical" && <ModeSelector mode={mode} onModeChange={setMode} />}
      </header>

      {/* Content */}
      <main ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-2 space-y-4">
        {tab === "clinical" && (
          <>
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-3 opacity-60">
                <Stethoscope size={48} className="text-teal-400/40" />
                <p className="text-sm text-gray-400">Ask a clinical question or use voice input</p>
                <p className="text-xs text-gray-600">Answers are grounded in Tier 1 & 2 guidelines</p>
              </div>
            )}
            {messages.map((m) => (
              <MessageBubble key={m.id} message={m} />
            ))}
          </>
        )}

        {tab === "board" && (
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">Board Prep</span>
              </div>
              <h2 className="text-xl font-bold">Vignette Practice</h2>
            </div>

            {/* Domain picker */}
            <div className="relative">
              <button
                onClick={() => setShowDomainPicker(!showDomainPicker)}
                className="w-full flex items-center justify-between px-4 py-3 glass-card text-sm"
              >
                <span className="flex items-center gap-2">
                  <Trophy size={16} className="text-teal-400" />
                  {boardDomain}
                </span>
                <ChevronDown size={16} className={`text-gray-400 transition ${showDomainPicker ? "rotate-180" : ""}`} />
              </button>
              {showDomainPicker && (
                <div className="absolute z-10 w-full mt-1 glass-card max-h-60 overflow-y-auto">
                  {DOMAINS.map((d) => (
                    <button
                      key={d}
                      onClick={() => { setBoardDomain(d); setShowDomainPicker(false); }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-navy-700/50 ${d === boardDomain ? "text-teal-400" : "text-gray-300"}`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {vignetteLoading && (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="animate-spin text-teal-400" size={32} />
              </div>
            )}
            {vignette && !vignetteLoading && (
              <VignetteCard vignette={vignette} onNext={handleVignetteNext} score={boardScore} />
            )}
          </div>
        )}

        {tab === "flashcards" && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-3 opacity-60">
            <Layers size={48} className="text-amber-400/40" />
            <p className="text-sm text-gray-400">Flashcard mode</p>
            <p className="text-xs text-gray-600">Ask a question using the text input below with Flashcards mode</p>
          </div>
        )}

        {tab === "history" && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-3 opacity-60">
            <Clock size={48} className="text-gray-500/40" />
            <p className="text-sm text-gray-400">Conversation history</p>
            <p className="text-xs text-gray-600">Your conversations will appear here</p>
          </div>
        )}
      </main>

      {/* Input bar (clinical + flashcards) */}
      {(tab === "clinical" || tab === "flashcards") && (
        <div className="px-4 py-3 border-t border-white/5">
          <div className="flex items-end gap-2">
            <VoiceButton
              isRecording={recorder.state === "recording"}
              isPlaying={voiceStream.playbackState === "playing"}
              isProcessing={isProcessingVoice}
              onToggle={handleVoiceToggle}
            />
            <div className="flex-1 flex items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder="Ask a clinical question..."
                rows={1}
                className="flex-1 resize-none bg-navy-800/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-teal-500/50 max-h-32"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isStreaming}
                className="w-10 h-10 rounded-xl bg-teal-500 text-white flex items-center justify-center hover:bg-teal-600 transition disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
              >
                {isStreaming ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings modal */}
      <SettingsModal open={showSettings} onClose={() => setShowSettings(false)} />

      {/* Bottom nav */}
      <nav className="flex items-center justify-around px-2 py-2 border-t border-white/5 bg-navy-900/95">
        {([
          { key: "clinical" as Tab, icon: <Stethoscope size={20} />, label: "Clinical" },
          { key: "board" as Tab, icon: <GraduationCap size={20} />, label: "Board Prep" },
          { key: "flashcards" as Tab, icon: <Layers size={20} />, label: "Flashcards" },
          { key: "history" as Tab, icon: <Clock size={20} />, label: "History" },
        ]).map((item) => (
          <button
            key={item.key}
            onClick={() => setTab(item.key)}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition ${
              tab === item.key ? "text-teal-400" : "text-gray-500 hover:text-gray-300"
            }`}
          >
            {tab === item.key && <div className="w-6 h-0.5 bg-teal-400 rounded-full mb-0.5" />}
            {item.icon}
            <span className="text-[10px]">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
