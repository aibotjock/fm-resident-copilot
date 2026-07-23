import React, { useEffect, useState } from "react";
import { X, KeyRound, Server, Eye, EyeOff, Check, Settings as SettingsIcon } from "lucide-react";
import { getSettings, saveSettings } from "../lib/settings";

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

export default function SettingsModal({ open, onClose }: SettingsModalProps) {
  const [apiKey, setApiKey] = useState("");
  const [serverUrl, setServerUrl] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);

  // Load stored values whenever the modal opens
  useEffect(() => {
    if (open) {
      const s = getSettings();
      setApiKey(s.apiKey);
      setServerUrl(s.serverUrl);
      setSaved(false);
      setShowKey(false);
    }
  }, [open]);

  if (!open) return null;

  const handleSave = () => {
    saveSettings({ apiKey, serverUrl });
    setSaved(true);
    setTimeout(() => onClose(), 700);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg mx-auto sm:mx-4 bg-navy-900 border border-white/10 rounded-t-2xl sm:rounded-2xl p-5 space-y-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 flex items-center justify-center">
              <SettingsIcon size={16} className="text-teal-400" />
            </div>
            <h2 className="text-base font-bold text-white">Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition"
            aria-label="Close settings"
          >
            <X size={18} />
          </button>
        </div>

        {/* API key */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-medium text-gray-300">
            <KeyRound size={13} className="text-teal-400" />
            Cloud AI API Key
          </label>
          <div className="relative">
            <input
              type={showKey ? "text" : "password"}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              autoComplete="off"
              spellCheck={false}
              className="w-full bg-navy-800/50 border border-white/10 rounded-xl px-4 py-3 pr-11 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-teal-500/50"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-300 transition"
              aria-label={showKey ? "Hide API key" : "Show API key"}
            >
              {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <p className="text-[11px] text-gray-500 leading-snug">
            Your OpenAI API key. Stored only on this device and sent to your
            backend with each request. Leave blank to use the server's own key.
          </p>
        </div>

        {/* Server URL */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-medium text-gray-300">
            <Server size={13} className="text-teal-400" />
            Backend Server URL <span className="text-gray-600 font-normal">(optional)</span>
          </label>
          <input
            type="url"
            value={serverUrl}
            onChange={(e) => setServerUrl(e.target.value)}
            placeholder="https://your-server.example.com"
            autoComplete="off"
            spellCheck={false}
            inputMode="url"
            className="w-full bg-navy-800/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-teal-500/50"
          />
          <p className="text-[11px] text-gray-500 leading-snug">
            Where the FM Copilot backend is running, e.g.{" "}
            <span className="text-gray-400">http://192.168.1.10:3001</span>.
            Leave blank to use the default.
          </p>
        </div>

        {/* Save */}
        <button
          onClick={handleSave}
          className={`w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition ${
            saved
              ? "bg-green-500/20 text-green-400 border border-green-500/30"
              : "bg-teal-500 text-white hover:bg-teal-600"
          }`}
        >
          {saved ? (
            <>
              <Check size={16} /> Saved
            </>
          ) : (
            "Save Settings"
          )}
        </button>
      </div>
    </div>
  );
}
