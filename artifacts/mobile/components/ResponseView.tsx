import React from "react";
import {
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";
import { Colors, getModeColor } from "@/constants/colors";
import type { ClinicalMode } from "@/types";

interface ResponseViewProps {
  response: string;
  mode: ClinicalMode;
  isStreaming: boolean;
  onGeneratePearls?: () => void;
  onGenerateFlashcards?: () => void;
  onGenerateVignette?: () => void;
}

function parseMarkdown(text: string, isDark: boolean, modeColor: string, theme: typeof Colors.light) {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let keyCounter = 0;

  for (const line of lines) {
    const key = keyCounter++;

    if (line.startsWith("## ")) {
      elements.push(
        <View key={key} style={styles.sectionHeader}>
          <View style={[styles.sectionIndicator, { backgroundColor: modeColor }]} />
          <Text style={[styles.h2, { color: modeColor, fontFamily: "Inter_700Bold" }]}>
            {line.slice(3)}
          </Text>
        </View>
      );
    } else if (line.startsWith("# ")) {
      elements.push(
        <Text key={key} style={[styles.h1, { color: theme.text, fontFamily: "Inter_700Bold" }]}>
          {line.slice(2)}
        </Text>
      );
    } else if (line.startsWith("**") && line.endsWith("**")) {
      elements.push(
        <Text key={key} style={[styles.bold, { color: theme.text, fontFamily: "Inter_600SemiBold" }]}>
          {line.slice(2, -2)}
        </Text>
      );
    } else if (line.startsWith("- ") || line.startsWith("• ")) {
      elements.push(
        <View key={key} style={styles.bulletRow}>
          <View style={[styles.bullet, { backgroundColor: theme.textTertiary }]} />
          <Text style={[styles.bulletText, { color: theme.text, fontFamily: "Inter_400Regular" }]}>
            {parseBoldInline(line.slice(2), theme)}
          </Text>
        </View>
      );
    } else if (line.match(/^\*\*[A-D]\)/)) {
      const isAnswer = false;
      elements.push(
        <Text key={key} style={[styles.option, { color: theme.text, fontFamily: "Inter_400Regular" }]}>
          {parseBoldInlineText(line)}
        </Text>
      );
    } else if (line.startsWith("SOURCES:")) {
      elements.push(
        <View key={key} style={[styles.sourcesBox, { backgroundColor: isDark ? "#1E293B" : "#F1F5F9", borderColor: theme.border }]}>
          <Text style={[styles.sourcesLabel, { color: theme.textTertiary, fontFamily: "Inter_600SemiBold" }]}>
            SOURCES
          </Text>
          <Text style={[styles.sourcesText, { color: theme.textSecondary, fontFamily: "Inter_400Regular" }]}>
            {line.slice(8).trim()}
          </Text>
        </View>
      );
    } else if (line.trim() === "") {
      elements.push(<View key={key} style={styles.spacer} />);
    } else {
      elements.push(
        <Text key={key} style={[styles.body, { color: theme.text, fontFamily: "Inter_400Regular" }]}>
          {parseBoldInline(line, theme)}
        </Text>
      );
    }
  }

  return elements;
}

function parseBoldInlineText(text: string): string {
  return text.replace(/\*\*(.+?)\*\*/g, "$1");
}

function parseBoldInline(text: string, theme: typeof Colors.light): React.ReactNode {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  if (parts.length === 1) return text;
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <Text key={i} style={{ fontFamily: "Inter_600SemiBold", color: theme.text }}>
        {part}
      </Text>
    ) : (
      part
    )
  );
}

export function ResponseView({
  response,
  mode,
  isStreaming,
  onGeneratePearls,
  onGenerateFlashcards,
  onGenerateVignette,
}: ResponseViewProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? Colors.dark : Colors.light;
  const modeColor = getModeColor(mode, isDark);

  const handleCopy = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await Share.share({ message: response });
  };

  return (
    <View style={styles.container}>
      <View style={[styles.toolbar, { borderBottomColor: theme.border }]}>
        <Text style={[styles.toolbarLabel, { color: theme.textTertiary }]}>
          {isStreaming ? "Generating..." : "Response"}
        </Text>
        <Pressable
          onPress={handleCopy}
          style={({ pressed }) => [
            styles.copyBtn,
            { opacity: pressed ? 0.6 : 1 },
          ]}
        >
          <Ionicons name="copy-outline" size={18} color={theme.textSecondary} />
          <Text style={[styles.copyLabel, { color: theme.textSecondary }]}>
            Copy
          </Text>
        </Pressable>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {parseMarkdown(response, isDark, modeColor, theme)}

        {isStreaming && (
          <View style={[styles.cursor, { backgroundColor: modeColor }]} />
        )}

        {!isStreaming && response.length > 0 && (
          <View style={styles.addOns}>
            <Text style={[styles.addOnsLabel, { color: theme.textTertiary }]}>
              GENERATE ADD-ONS
            </Text>
            <View style={styles.addOnButtons}>
              {onGeneratePearls && mode !== "board_prep" && (
                <Pressable
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    onGeneratePearls();
                  }}
                  style={({ pressed }) => [
                    styles.addOnBtn,
                    {
                      backgroundColor: isDark ? "#1E293B" : "#F1F5F9",
                      borderColor: theme.border,
                      opacity: pressed ? 0.7 : 1,
                    },
                  ]}
                >
                  <Ionicons name="school-outline" size={14} color={Colors.boardPrep} />
                  <Text style={[styles.addOnText, { color: theme.text }]}>
                    Board Pearls
                  </Text>
                </Pressable>
              )}
              {onGenerateFlashcards && mode !== "flashcards" && (
                <Pressable
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    onGenerateFlashcards();
                  }}
                  style={({ pressed }) => [
                    styles.addOnBtn,
                    {
                      backgroundColor: isDark ? "#1E293B" : "#F1F5F9",
                      borderColor: theme.border,
                      opacity: pressed ? 0.7 : 1,
                    },
                  ]}
                >
                  <Ionicons name="layers-outline" size={14} color={Colors.flashcards} />
                  <Text style={[styles.addOnText, { color: theme.text }]}>
                    Flashcards
                  </Text>
                </Pressable>
              )}
              {onGenerateVignette && mode !== "board_prep" && (
                <Pressable
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    onGenerateVignette();
                  }}
                  style={({ pressed }) => [
                    styles.addOnBtn,
                    {
                      backgroundColor: isDark ? "#1E293B" : "#F1F5F9",
                      borderColor: theme.border,
                      opacity: pressed ? 0.7 : 1,
                    },
                  ]}
                >
                  <Ionicons name="help-circle-outline" size={14} color={Colors.documentation} />
                  <Text style={[styles.addOnText, { color: theme.text }]}>
                    Board Vignette
                  </Text>
                </Pressable>
              )}
            </View>
          </View>
        )}
        <View style={{ height: 60 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  toolbarLabel: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    letterSpacing: 0.5,
  },
  copyBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  copyLabel: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 16,
    marginBottom: 6,
  },
  sectionIndicator: {
    width: 3,
    height: 16,
    borderRadius: 2,
  },
  h1: {
    fontSize: 18,
    marginBottom: 4,
  },
  h2: {
    fontSize: 13,
    letterSpacing: 0.5,
  },
  bold: {
    fontSize: 14,
    marginVertical: 2,
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    paddingVertical: 2,
  },
  bullet: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 7,
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  option: {
    fontSize: 14,
    lineHeight: 22,
    paddingVertical: 2,
    paddingLeft: 8,
  },
  body: {
    fontSize: 14,
    lineHeight: 22,
  },
  spacer: {
    height: 4,
  },
  cursor: {
    width: 2,
    height: 16,
    borderRadius: 1,
    marginTop: 4,
  },
  sourcesBox: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 4,
  },
  sourcesLabel: {
    fontSize: 10,
    letterSpacing: 0.8,
  },
  sourcesText: {
    fontSize: 12,
    lineHeight: 18,
  },
  addOns: {
    marginTop: 24,
    gap: 10,
  },
  addOnsLabel: {
    fontSize: 10,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.8,
  },
  addOnButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  addOnBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  addOnText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
});
