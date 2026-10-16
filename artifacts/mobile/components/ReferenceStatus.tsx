import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, useColorScheme } from "react-native";
import { fetch } from "expo/fetch";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";

interface ContentStatus {
  status: "partial_review" | "reviewed";
  asOf: string;
  checkedExcerpts: number;
  pendingEntries: number;
  liveUpdates: boolean;
}

function isContentStatus(value: unknown): value is ContentStatus {
  if (!value || typeof value !== "object") return false;
  const status = value as Partial<ContentStatus>;
  return (
    (status.status === "partial_review" || status.status === "reviewed") &&
    typeof status.asOf === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(status.asOf) &&
    Number.isInteger(status.checkedExcerpts) &&
    Number(status.checkedExcerpts) >= 0 &&
    Number.isInteger(status.pendingEntries) &&
    Number(status.pendingEntries) >= 0 &&
    typeof status.liveUpdates === "boolean"
  );
}

export function ReferenceStatus() {
  const isDark = useColorScheme() === "dark";
  const theme = isDark ? Colors.dark : Colors.light;
  const [status, setStatus] = useState<ContentStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    let active = true;
    const domain = process.env.EXPO_PUBLIC_DOMAIN;
    const baseUrl = domain ? `https://${domain}` : "";

    async function loadStatus() {
      try {
        const response = await fetch(`${baseUrl}/api/content/status`, {
          signal: controller.signal,
          headers: { Accept: "application/json" },
        });
        if (!response.ok) return;
        const data: unknown = await response.json();
        if (active && isContentStatus(data)) setStatus(data);
      } catch {
        // The notice stays explicit when the server cannot confirm review status.
      } finally {
        clearTimeout(timeout);
        if (active) setLoading(false);
      }
    }

    void loadStatus();
    return () => {
      active = false;
      clearTimeout(timeout);
      controller.abort();
    };
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.surfaceSecondary, borderColor: theme.border }]}>
      <Ionicons name="information-circle-outline" size={16} color={isDark ? "#FCD34D" : "#92400E"} />
      <View style={styles.content}>
        <Text style={[styles.summary, { color: theme.textSecondary }]} accessibilityLiveRegion="polite">
          {status
            ? `Guideline review: ${status.checkedExcerpts} checked excerpts · ${status.pendingEntries} entries pending.`
            : loading
              ? "Guideline review: checking status…"
              : "Guideline review status unavailable."}
        </Text>
        <Text style={[styles.detail, { color: theme.textSecondary }]}>
          {status
            ? `Sources checked ${status.asOf}; live updates ${status.liveUpdates ? "enabled" : "unavailable"}.`
            : "Verify source dates and recommendations before use."}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  content: { flex: 1, minWidth: 0, gap: 3 },
  summary: { fontSize: 12, lineHeight: 18, fontFamily: "Inter_600SemiBold" },
  detail: { fontSize: 12, lineHeight: 18, fontFamily: "Inter_400Regular" },
});
