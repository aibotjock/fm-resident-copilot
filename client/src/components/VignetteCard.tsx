import React, { useState } from "react";
import { HelpCircle, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import type { Vignette } from "../api/client";

interface Props {
  vignette: Vignette;
  onNext: () => void;
  score: { correct: number; total: number };
}

export default function VignetteCard({ vignette, onNext, score }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);

  const handleSelect = (key: string) => {
    if (revealed) return;
    setSelected(key);
    setRevealed(true);
  };

  const isCorrect = selected === vignette.answer;
  const options = Object.entries(vignette.options) as [string, string][];

  return (
    <div className="glass-card p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-teal-400 bg-teal-400/10 px-2 py-1 rounded-full">
          {vignette.domain}
        </span>
        <span className="text-xs text-gray-400">
          {score.correct}/{score.total} correct
        </span>
      </div>

      {/* Question */}
      <div className="flex gap-2">
        <HelpCircle size={18} className="text-teal-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-xs text-teal-400 font-semibold tracking-wide mb-2">ABFM BOARD VIGNETTE</p>
          <p className="text-sm text-gray-100 leading-relaxed">{vignette.question}</p>
        </div>
      </div>

      {/* Source */}
      {vignette.source && (
        <p className="text-[11px] text-gray-500 pl-6">Source: {vignette.source}</p>
      )}

      {/* Options */}
      <div className="space-y-2">
        {options.map(([key, text]) => {
          let style = "border-white/10 hover:border-white/20";
          if (revealed) {
            if (key === vignette.answer) style = "border-green-500 bg-green-500/10";
            else if (key === selected) style = "border-red-500 bg-red-500/10";
            else style = "border-white/5 opacity-50";
          }
          return (
            <button
              key={key}
              onClick={() => handleSelect(key)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${style}`}
            >
              <span className="w-7 h-7 rounded-full bg-teal-400/20 text-teal-400 flex items-center justify-center text-xs font-bold uppercase shrink-0">
                {key}
              </span>
              <span className="text-sm text-gray-200">{text}</span>
              {revealed && key === vignette.answer && <CheckCircle size={16} className="text-green-400 ml-auto shrink-0" />}
              {revealed && key === selected && key !== vignette.answer && <XCircle size={16} className="text-red-400 ml-auto shrink-0" />}
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {revealed && (
        <div className="space-y-3">
          <div className={`p-3 rounded-xl text-sm ${isCorrect ? "bg-green-500/10 border border-green-500/30" : "bg-red-500/10 border border-red-500/30"}`}>
            <p className={`font-medium mb-1 ${isCorrect ? "text-green-400" : "text-red-400"}`}>
              {isCorrect ? "✓ Correct!" : "✗ Incorrect"}
            </p>
            <p className="text-gray-300 leading-relaxed">{vignette.explanation}</p>
          </div>
          <button
            onClick={() => { setSelected(null); setRevealed(false); onNext(); }}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-purple-500/20 text-purple-300 font-medium hover:bg-purple-500/30 transition"
          >
            <RefreshCw size={16} />
            Next Question
          </button>
        </div>
      )}
    </div>
  );
}
