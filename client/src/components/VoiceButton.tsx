import React from "react";
import { Mic, MicOff, Volume2 } from "lucide-react";

interface Props {
  isRecording: boolean;
  isPlaying: boolean;
  isProcessing: boolean;
  onToggle: () => void;
}

export default function VoiceButton({ isRecording, isPlaying, isProcessing, onToggle }: Props) {
  const getState = () => {
    if (isProcessing) return { icon: <Volume2 size={24} />, color: "bg-amber-500", label: "Processing..." };
    if (isPlaying) return { icon: <Volume2 size={24} />, color: "bg-teal-500", label: "Playing" };
    if (isRecording) return { icon: <MicOff size={24} />, color: "bg-red-500", label: "Stop" };
    return { icon: <Mic size={24} />, color: "bg-purple-500", label: "Voice" };
  };

  const { icon, color, label } = getState();

  return (
    <div className="flex flex-col items-center gap-1">
      <button
        onClick={onToggle}
        disabled={isProcessing || isPlaying}
        className={`relative w-14 h-14 rounded-full ${color} text-white flex items-center justify-center shadow-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed`}
      >
        {isRecording && (
          <span className="absolute inset-0 rounded-full bg-red-500 pulse-ring" />
        )}
        {icon}
      </button>
      <span className="text-[10px] text-gray-400">{label}</span>
    </div>
  );
}
