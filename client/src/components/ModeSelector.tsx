import React from "react";
import { Stethoscope, FileText, GraduationCap, Layers } from "lucide-react";
import type { ClinicalMode } from "../api/client";

interface Props {
  mode: ClinicalMode;
  onModeChange: (mode: ClinicalMode) => void;
}

const modes: { key: ClinicalMode; label: string; icon: React.ReactNode; color: string }[] = [
  { key: "point_of_care", label: "Point of Care", icon: <Stethoscope size={16} />, color: "text-teal-400" },
  { key: "documentation", label: "Documentation", icon: <FileText size={16} />, color: "text-blue-400" },
  { key: "board_prep", label: "Board Prep", icon: <GraduationCap size={16} />, color: "text-purple-400" },
  { key: "flashcards", label: "Flashcards", icon: <Layers size={16} />, color: "text-amber-400" },
];

export default function ModeSelector({ mode, onModeChange }: Props) {
  return (
    <div className="flex gap-1 p-1 bg-navy-800/50 rounded-xl overflow-x-auto">
      {modes.map((m) => (
        <button
          key={m.key}
          onClick={() => onModeChange(m.key)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
            mode === m.key
              ? `bg-navy-700 ${m.color} shadow-lg`
              : "text-gray-400 hover:text-white hover:bg-navy-700/50"
          }`}
        >
          {m.icon}
          <span className="hidden sm:inline">{m.label}</span>
        </button>
      ))}
    </div>
  );
}
