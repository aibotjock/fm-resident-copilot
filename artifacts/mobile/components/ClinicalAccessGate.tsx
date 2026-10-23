import React, { useEffect, useState, type ReactNode } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { fetch } from "expo/fetch";
import { onClinicalAccessRequired, setClinicalToken } from "@/utils/clinicalAccess";

export function ClinicalAccessGate({ children }: { children: ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => onClinicalAccessRequired(() => setAuthenticated(false)), []);
  const unlock = async () => {
    setBusy(true); setError("");
    try {
      const domain = process.env.EXPO_PUBLIC_DOMAIN;
      const response = await fetch(`${domain ? `https://${domain}` : ""}/api/clinical/access`, {
        headers: { Authorization: `Bearer ${value.trim()}` },
      });
      if (!response.ok) throw new Error(response.status === 401 ? "The access token was not accepted." : "Clinical access is unavailable. Contact the app operator.");
      setClinicalToken(value.trim()); setValue(""); setAuthenticated(true);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to verify access."); }
    finally { setBusy(false); }
  };
  if (authenticated) return <View style={{ flex: 1 }}>
    <Pressable accessibilityRole="button" accessibilityLabel="Lock clinical access" onPress={() => { setClinicalToken(""); setAuthenticated(false); }} style={{ padding: 10, alignSelf: "flex-end" }}><Text>Lock access</Text></Pressable>
    {children}
  </View>;
  return <View style={{ flex: 1, justifyContent: "center", padding: 24, backgroundColor: "#f8fafc" }}>
    <Text style={{ fontSize: 24, fontWeight: "700", color: "#0f172a", marginBottom: 12 }}>Clinical access</Text>
    <Text style={{ color: "#334155", marginBottom: 20 }}>Enter the access token provided by your app operator. It stays in memory until you lock or close the app.</Text>
    <TextInput accessibilityLabel="Clinical access token" placeholder="Access token" secureTextEntry autoCapitalize="none" autoCorrect={false} value={value} onChangeText={setValue} editable={!busy} style={{ backgroundColor: "white", padding: 14, borderWidth: 1, borderColor: "#94a3b8", borderRadius: 8, color: "#0f172a" }} />
    {!!error && <Text accessibilityRole="alert" style={{ color: "#b91c1c", marginTop: 12 }}>{error}</Text>}
    <Pressable accessibilityRole="button" disabled={busy || !value.trim()} onPress={unlock} style={{ marginTop: 16, padding: 14, backgroundColor: "#0f766e", borderRadius: 8 }}><Text style={{ color: "white", textAlign: "center" }}>{busy ? "Checking access…" : "Continue"}</Text></Pressable>
  </View>;
}
