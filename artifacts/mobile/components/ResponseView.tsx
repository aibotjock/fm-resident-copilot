import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import * as Haptics from "expo-haptics";
import * as Clipboard from "expo-clipboard";
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

function parseBoldInline(
  text: string,
  theme: typeof Colors.light
): React.ReactNode {
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

function parseMarkdown(
  text: string,
  isDark: boolean,
  modeColor: string,
  theme: typeof Colors.light
) {
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
    } else if (/^\d+\.\s/.test(line)) {
      const match = line.match(/^(\d+)\.\s(.+)/);
      if (match) {
        elements.push(
          <View key={key} style={styles.bulletRow}>
            <Text style={[styles.numeral, { color: modeColor, fontFamily: "Inter_600SemiBold" }]}>
              {match[1]}.
            </Text>
            <Text style={[styles.bulletText, { color: theme.text, fontFamily: "Inter_400Regular" }]}>
              {parseBoldInline(match[2], theme)}
            </Text>
          </View>
        );
      }
    } else if (line.startsWith("SOURCES:") || line.startsWith("Sources:")) {
      elements.push(
        <View
          key={key}
          style={[
            styles.sourcesBox,
            { backgroundColor: `${modeColor}08`, borderColor: `${modeColor}25` },
          ]}
        >
          <Text style={[styles.sourcesLabel, { color: modeColor, fontFamily: "Inter_600SemiBold" }]}>
            SOURCES
          </Text>
          <Text style={[styles.sourcesText, { color: theme.textSecondary, fontFamily: "Inter_400Regular" }]}>
            {line.replace(/^SOURCES:\s*|^Sources:\s*/, "")}
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

  const [copied, setCopied] = useState(false);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cursorOpacity = useRef(new Animated.Value(1)).current;
  const blinkAnimation = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    if (isStreaming) {
      const nativeDriver = Platform.OS !== "web";
      blinkAnimation.current = Animated.loop(
        Animated.sequence([
          Animated.timing(cursorOpacity, {
            toValue: 0,
            duration: 500,
            useNativeDriver: nativeDriver,
          }),
          Animated.timing(cursorOpacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: nativeDriver,
          }),
        ])
      );
      blinkAnimation.current.start();
    } else {
      blinkAnimation.current?.stop();
      cursorOpacity.setValue(0);
    }
    return () => {
      blinkAnimation.current?.stop();
    };
  }, [isStreaming, cursorOpacity]);

  const handleCopy = useCallback(async () => {
    if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    try {
      await Clipboard.setStringAsync(response);
    } catch {
      try {
        if (typeof navigator !== "undefined" && navigator.clipboard) {
          await navigator.clipboard.writeText(response);
        }
      } catch {}
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setCopied(true);
    copyTimeoutRef.current = setTimeout(() => setCopied(false), 2000);
  }, [response]);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={[styles.toolbar, { borderBottomColor: theme.border }]}>
        <Text style={[styles.toolbarLabel, { color: theme.textTertiary }]}>
          {isStreaming ? "Generating..." : "Response"}
        </Text>
        <Pressable
          onPress={handleCopy}
          disabled={isStreaming || response.length === 0}
          style={({ pressed }) => [
            styles.copyBtn,
            {
              backgroundColor: copied ? `${modeColor}15` : "transparent",
              opacity: pressed ? 0.6 : isStreaming ? 0.4 : 1,
            },
          ]}
        >
          <Ionicons
            name={copied ? "checkmark" : "copy-outline"}
            size={18}
            color={copied ? modeColor : theme.textSecondary}
          />
          <Text
            style={[
              styles.copyLabel,
              { color: copied ? modeColor : theme.textSecondary, fontFamily: "Inter_500Medium" },
            ]}
          >
            {copied ? "Copied!" : "Copy"}
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
          <Animated.View
            style={[
              styles.cursor,
              { backgroundColor: modeColor, opacity: cursorOpacity },
            ]}
          />
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
                  <Ionicons name="trophy-outline" size={15} color={Colors.boardPrep} />
                  <Text style={[styles.addOnText, { color: theme.text }]}>
                    Board Pearls
                  </Text>
                </Pressable>
              )}
              {onGenerateFlashcards && (
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
                  <Ionicons name="layers-outline" size={15} color={Colors.flashcards} />
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
                  <Ionicons name="school-outline" size={15} color={Colors.boardPrep} />
                  <Text style={[styles.addOnText, { color: theme.text }]}>
                    Board Vignette
                  </Text>
                </Pressable>
              )}
            </View>
          </View>
        )}
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
    letterSpacing: 0.3,
  },
  copyBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  copyLabel: {
    fontSize: 13,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 20,
    marginBottom: 6,
  },
  sectionIndicator: {
    width: 3,
    height: 16,
    borderRadius: 2,
  },
  h1: {
    fontSize: 20,
    marginTop: 4,
    marginBottom: 8,
    lineHeight: 28,
  },
  h2: {
    fontSize: 13,
    letterSpacing: 0.5,
  },
  bold: {
    fontSize: 14,
    lineHeight: 22,
    marginTop: 2,
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginTop: 4,
    paddingLeft: 4,
  },
  bullet: {
    width: 5,
    height: 5,
    borderRadius: 3,
    marginTop: 9,
    flexShrink: 0,
  },
  numeral: {
    fontSize: 13,
    marginTop: 3,
    flexShrink: 0,
    minWidth: 20,
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 22,
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
    height: 18,
    borderRadius: 1,
    marginTop: 6,
  },
  sourcesBox: {
    marginTop: 20,
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
    marginTop: 28,
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
