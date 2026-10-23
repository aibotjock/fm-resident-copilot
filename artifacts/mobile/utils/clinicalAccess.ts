import { fetch as expoFetch } from "expo/fetch";
// Credentials are intentionally kept only in memory, never bundled or persisted.
let token = "";
const listeners = new Set<() => void>();
export function setClinicalToken(value: string) { token = value; }
export function onClinicalAccessRequired(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener); }; }
export async function clinicalFetch(input: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  const response = await expoFetch(input, { ...init, headers });
  if (response.status === 401) { token = ""; for (const listener of listeners) listener(); }
  return response;
}
