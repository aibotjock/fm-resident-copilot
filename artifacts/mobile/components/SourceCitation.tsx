import React, { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";
import type { CitationMetadata, CitationEntry } from "@/types";

interface SourceCitationProps {
  metadata: CitationMetadata;
}

const CONFIDENCE_CONFIG = {
  direct: {
    label: "Directly addressed",
    color: "#10B981",
    bg: "#D1FAE5",
    darkBg: "#052E16",
    icon: "checkmark-circle" as const,
    description: "This guideline has a specific recommendation for this clinical question.",
  },
  peripheral: {
    label: "Peripherally addressed",
    color: "#F59E0B",
    bg: "#FEF3C7",
    darkBg: "#1C1400",
    icon: "information-circle" as const,
    description: "This guideline addresses the broader topic but not this specific question directly.",
  },
  outside: {
    label: "Outside indexed sources",
    color: "#EF4444",
    bg: "#FEE2E2",
    darkBg: "#1A0000",
    icon: "alert-circle" as const,
    description: "This specific question is not addressed in the indexed guideline sources.",
  },
};

function ConfidenceBadge({
  entry,
  isDark,
}: {
  entry: CitationEntry;
  isDark: boolean;
}) {
  const cfg = CONFIDENCE_CONFIG[entry.confidence];
  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: isDark ? cfg.darkBg : cfg.bg,
          borderColor: `${cfg.color}40`,
        },
      ]}
    >
      <Ionicons name={cfg.icon} size={12} color={cfg.color} />
      <Text style={[styles.badgeLabel, { color: cfg.color, fontFamily: "Inter_600SemiBold" }]}>
        {cfg.label}
      </Text>
    </View>
  );
}

function CitationRow({
  entry,
  isDark,
  theme,
}: {
  entry: CitationEntry;
  isDark: boolean;
  theme: typeof Colors.light;
}) {
  const cfg = CONFIDENCE_CONFIG[entry.confidence];
  return (
    <View style={[styles.citationRow, { borderColor: theme.border }]}>
      <View
        style={[
          styles.sourceIcon,
          { backgroundColor: `${cfg.color}15` },
        ]}
      >
        <Ionicons name="library-outline" size={14} color={cfg.color} />
      </View>
      <View style={styles.citationContent}>
        <View style={styles.citationHeader}>
          <Text style={[styles.sourceName, { color: theme.text, fontFamily: "Inter_600SemiBold" }]}>
            {entry.source}
          </Text>
          {entry.year && (
            <Text style={[styles.sourceYear, { color: theme.textTertiary }]}>
              {entry.year}
            </Text>
          )}
          <ConfidenceBadge entry={entry} isDark={isDark} />
        </View>
        {entry.guideline && (
          <Text
            style={[styles.guidelineTitle, { color: theme.textSecondary, fontFamily: "Inter_400Regular" }]}
            numberOfLines={2}
          >
            {entry.guideline}
          </Text>
        )}
        {entry.note && (
          <Text style={[styles.citationNote, { color: theme.textTertiary }]}>
            {entry.note}
          </Text>
        )}
      </View>
    </View>
  );
}

export function SourceCitation({ metadata }: SourceCitationProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? Colors.dark : Colors.light;
  const [expanded, setExpanded] = useState(false);

  const hasLimitation = !!metadata.limitation;
  const hasOutside = metadata.citations.some((c) => c.confidence === "outside");
  const allDirect = metadata.citations.every((c) => c.confidence === "direct");

  const overallColor = hasOutside || hasLimitation
    ? "#EF4444"
    : allDirect
    ? "#10B981"
    : "#F59E0B";

  const overallLabel = hasOutside || hasLimitation
    ? "Partial coverage — see limitation"
    : allDirect
    ? "Fully addressed by indexed sources"
    : "Addressed — see source details";

  const overallIcon = hasOutside || hasLimitation
    ? ("alert-circle" as const)
    : allDirect
    ? ("checkmark-circle" as const)
    : ("information-circle" as const);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDark ? "#0D1B2A" : "#F0F7FF",
          borderColor: `${overallColor}30`,
        },
      ]}
    >
      <Pressable
        onPress={() => setExpanded(!expanded)}
        style={styles.header}
      >
        <View style={styles.headerLeft}>
          <View
            style={[
              styles.domainPill,
              {
                backgroundColor: `${overallColor}15`,
                borderColor: `${overallColor}30`,
              },
            ]}
          >
            <Ionicons name="book-outline" size={11} color={overallColor} />
            <Text
              style={[
                styles.domainText,
                { color: overallColor, fontFamily: "Inter_600SemiBold" },
              ]}
            >
              ABFM · {metadata.domain}
            </Text>
            {metadata.weight && (
              <Text style={[styles.weightText, { color: overallColor }]}>
                {metadata.weight} of exam
              </Text>
            )}
          </View>
        </View>
        <View style={styles.headerRight}>
          <Ionicons name={overallIcon} size={14} color={overallColor} />
          <Text style={[styles.overallLabel, { color: overallColor, fontFamily: "Inter_500Medium" }]}>
            {overallLabel}
          </Text>
          <Ionicons
            name={expanded ? "chevron-up" : "chevron-down"}
            size={14}
            color={theme.textTertiary}
          />
        </View>
      </Pressable>

      {expanded && (
        <View style={styles.body}>
          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          {hasLimitation && (
            <View
              style={[
                styles.limitationBox,
                {
                  backgroundColor: isDark ? "#1A0000" : "#FEF2F2",
                  borderColor: "#EF444430",
                },
              ]}
            >
              <Ionicons name="alert-circle" size={14} color="#EF4444" />
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.limitationTitle,
                    { color: "#EF4444", fontFamily: "Inter_600SemiBold" },
                  ]}
                >
                  SOURCE LIMITATION
                </Text>
                <Text style={[styles.limitationText, { color: isDark ? "#FCA5A5" : "#991B1B" }]}>
                  {metadata.limitation}
                </Text>
              </View>
            </View>
          )}

          <Text
            style={[
              styles.sourcesLabel,
              { color: theme.textTertiary, fontFamily: "Inter_600SemiBold" },
            ]}
          >
            INDEXED SOURCES CONSULTED
          </Text>

          <View style={styles.citationsList}>
            {metadata.citations.map((entry, i) => (
              <CitationRow
                key={i}
                entry={entry}
                isDark={isDark}
                theme={theme}
              />
            ))}
          </View>

          <Text style={[styles.disclaimer, { color: theme.textTertiary }]}>
            Responses are limited to indexed guideline sources only. If not addressed, the limitation is stated. This tool does not replace clinical judgment or direct consultation of source guidelines.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
    marginTop: 20,
  },
  header: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 8,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    flexWrap: "wrap",
  },
  domainPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    borderWidth: 1,
  },
  domainText: {
    fontSize: 10,
    letterSpacing: 0.3,
  },
  weightText: {
    fontSize: 10,
    fontFamily: "Inter_400Regular",
    opacity: 0.75,
  },
  overallLabel: {
    fontSize: 11,
  },
  body: {
    paddingHorizontal: 14,
    paddingBottom: 12,
    gap: 10,
  },
  divider: {
    height: 1,
    marginBottom: 4,
  },
  limitationBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  limitationTitle: {
    fontSize: 9,
    letterSpacing: 0.6,
    marginBottom: 2,
  },
  limitationText: {
    fontSize: 12,
    lineHeight: 18,
    fontFamily: "Inter_400Regular",
  },
  sourcesLabel: {
    fontSize: 9,
    letterSpacing: 0.8,
    marginTop: 2,
  },
  citationsList: { gap: 8 },
  citationRow: {
    flexDirection: "row",
    gap: 10,
    paddingVertical: 6,
    borderBottomWidth: 1,
  },
  sourceIcon: {
    width: 28,
    height: 28,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  citationContent: { flex: 1, gap: 3 },
  citationHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexWrap: "wrap",
  },
  sourceName: { fontSize: 13 },
  sourceYear: { fontSize: 11, fontFamily: "Inter_400Regular" },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
  },
  badgeLabel: { fontSize: 9, letterSpacing: 0.3 },
  guidelineTitle: {
    fontSize: 11,
    lineHeight: 16,
    fontStyle: "italic",
  },
  citationNote: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    lineHeight: 15,
  },
  disclaimer: {
    fontSize: 10,
    lineHeight: 15,
    fontFamily: "Inter_400Regular",
    marginTop: 4,
    opacity: 0.8,
  },
});
