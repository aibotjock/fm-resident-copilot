// Persistent app settings stored in localStorage.
// - apiKey:    the user's cloud AI (OpenAI) API key, sent to the backend
//              via the `x-api-key` header on every request.
// - serverUrl: the backend server origin (e.g. "https://api.example.com" or
//              "http://192.168.1.10:3001"). Overrides the build-time
//              VITE_API_BASE_URL. Empty = relative "/api" (web builds).

const API_KEY_STORAGE_KEY = "fmcopilot.apiKey";
const SERVER_URL_STORAGE_KEY = "fmcopilot.serverUrl";

export interface AppSettings {
  apiKey: string;
  serverUrl: string;
}

function safeGet(key: string): string {
  try {
    return localStorage.getItem(key) ?? "";
  } catch {
    return "";
  }
}

export function getSettings(): AppSettings {
  return {
    apiKey: safeGet(API_KEY_STORAGE_KEY),
    serverUrl: safeGet(SERVER_URL_STORAGE_KEY),
  };
}

export function saveSettings(settings: AppSettings): void {
  try {
    if (settings.apiKey.trim()) {
      localStorage.setItem(API_KEY_STORAGE_KEY, settings.apiKey.trim());
    } else {
      localStorage.removeItem(API_KEY_STORAGE_KEY);
    }
    const url = settings.serverUrl.trim().replace(/\/+$/, "");
    if (url) {
      localStorage.setItem(SERVER_URL_STORAGE_KEY, url);
    } else {
      localStorage.removeItem(SERVER_URL_STORAGE_KEY);
    }
  } catch {
    // localStorage unavailable (private mode etc.) — settings won't persist
  }
}

/** Backend origin: user setting > build-time VITE_API_BASE_URL > "" (relative). */
export function getApiOrigin(): string {
  const stored = safeGet(SERVER_URL_STORAGE_KEY).replace(/\/+$/, "");
  if (stored) return stored;
  return (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/+$/, "") ?? "";
}

/** Full URL for an API path, e.g. apiUrl("/voice/chat") -> "<origin>/api/voice/chat". */
export function apiUrl(path: string): string {
  return `${getApiOrigin()}/api${path.startsWith("/") ? path : `/${path}`}`;
}

/** Headers to attach to every API request (includes x-api-key when set). */
export function getAuthHeaders(): Record<string, string> {
  const apiKey = safeGet(API_KEY_STORAGE_KEY);
  return apiKey ? { "x-api-key": apiKey } : {};
}
