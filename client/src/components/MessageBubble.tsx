import React from "react";
import { User, Bot, BookOpen } from "lucide-react";

export interface Source {
  source: string;
  title: string;
  section: string;
  domain: string;
  url: string | null;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
  isStreaming?: boolean;
}

function SourceCard({ source }: { source: Source }) {
  return (
    <div className="flex items-start gap-2 p-2 bg-navy-900/60 rounded-lg text-xs">
      <BookOpen size={12} className="text-teal-400 mt-0.5 shrink-0" />
      <div>
        <span className="text-teal-400 font-medium">{source.source}</span>
        <span className="text-gray-400"> — {source.title}</span>
        <span className="text-gray-500"> ({source.section})</span>
        {source.url && (
          <a href={source.url} target="_blank" rel="noreferrer" className="block text-blue-400 hover:underline mt-0.5 truncate">
            {source.url}
          </a>
        )}
      </div>
    </div>
  );
}

export default function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";
  
  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
        isUser ? "bg-purple-500/20" : "bg-teal-500/20"
      }`}>
        {isUser ? <User size={16} className="text-purple-400" /> : <Bot size={16} className="text-teal-400" />}
      </div>
      <div className={`max-w-[85%] ${isUser ? "items-end" : "items-start"}`}>
        <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? "bg-purple-500/20 text-white rounded-br-md"
            : "glass-card text-gray-100 rounded-bl-md"
        }`}>
          {message.content}
          {message.isStreaming && (
            <span className="inline-block w-2 h-4 bg-teal-400 ml-1 animate-pulse rounded-sm" />
          )}
        </div>
        {message.sources && message.sources.length > 0 && (
          <div className="mt-2 space-y-1.5">
            <p className="text-xs text-gray-500 font-medium px-1">Sources</p>
            {message.sources.map((s, i) => (
              <SourceCard key={i} source={s} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
