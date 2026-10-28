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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import * as Clipboard from "expo-clipboard";
import * as Speech from "expo-speech";
import { Ionicons } from "@expo/vector-icons";
import { Colors, getModeColor } from "@/constants/colors";
import { SourceCitation } from "@/components/SourceCitation";
import { cleanClinicalText, speechText } from "@/utils/clinical-text";
import type { ClinicalMode, CitationMetadata } from "@/types";

interface ResponseViewProps {
  response: string;
  mode: ClinicalMode;
  isStreaming: boolean;
  citationMetadata?: CitationMetadata | null;
  bookmarked?: boolean;
  onBookmark?: () => void;
  onGeneratePearls?: () => void;
  onGenerateFlashcards?: () => void;
  onGenerateVignette?: () => void;
  onSaveToDeck?: () => void;
  deckSaved?: boolean;
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

function renderTableBlock(
  rows: string[],
  key: number,
  modeColor: string,
  theme: typeof Colors.light,
  isDark: boolean
): React.ReactNode {
  const parsed = rows
    .filter((row) => row.replace(/\|/g, "").replace(/-/g, "").replace(/:/g, "").replace(/\s/g, "").length > 0)
    .map((row) =>
      row
        .split("|")
        .map((cell) => cell.trim())
        .filter((_, i, arr) => i > 0 && i < arr.length - 1)
    )
    .filter((row) => row.length > 0);

  if (parsed.length === 0) return null;

  const [header, ...body] = parsed;

  return (
    <View
      key={key}
      style={[
        styles.table,
        { borderColor: `${modeColor}30` },
      ]}
    >
      <View
        style={[
          styles.tableHeader,
          { backgroundColor: `${modeColor}12` },
        ]}
      >
        {header.map((cell, ci) => (
          <Text
            key={ci}
            style={[
              styles.tableHeaderCell,
              {
                color: modeColor,
                fontFamily: "Inter_600SemiBold",
                flex: ci === 0 ? 1.2 : 1,
              },
            ]}
          >
            {cell}
          </Text>
        ))}
      </View>
      {body.map((row, ri) => (
        <View
          key={ri}
          style={[
            styles.tableRow,
            {
              backgroundColor:
                ri % 2 === 0
                  ? isDark
                    ? "#1A2030"
                    : "#FAFBFC"
                  : "transparent",
              borderTopColor: theme.border,
            },
          ]}
        >
          {row.map((cell, ci) => (
            <Text
              key={ci}
              style={[
                styles.tableCell,
                {
                  color: theme.text,
                  fontFamily: ci === 0 ? "Inter_500Medium" : "Inter_400Regular",
                  flex: ci === 0 ? 1.2 : 1,
                },
              ]}
            >
              {parseBoldInline(cell, theme)}
            </Text>
          ))}
        </View>
      ))}
    </View>
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
  let tableBuffer: string[] = [];

  const flushTable = () => {
    if (tableBuffer.length > 0) {
      const el = renderTableBlock(
        tableBuffer,
        keyCounter++,
        modeColor,
        theme,
        isDark
      );
      if (el) elements.push(el);
      tableBuffer = [];
    }
  };

  for (const line of lines) {
    const isTableRow = line.trim().startsWith("|");
    const isSeparator = /^[\s|:-]+$/.test(line) && line.includes("|");

    if (isTableRow) {
      if (!isSeparator) {
        tableBuffer.push(line);
      }
      continue;
    }

    if (tableBuffer.length > 0) {
      flushTable();
    }

    const key = keyCounter++;

    if (line.startsWith("## ")) {
      elements.push(
        <View key={key} style={styles.sectionHeader}>
          <View style={[styles.sectionIndicator, { backgroundColor: modeColor }]} />
          <Text
            style={[styles.h2, { color: modeColor, fontFamily: "Inter_700Bold" }]}
          >
            {line.slice(3)}
          </Text>
        </View>
      );
    } else if (line.startsWith("# ")) {
      elements.push(
        <Text
          key={key}
          style={[styles.h1, { color: theme.text, fontFamily: "Inter_700Bold" }]}
        >
          {line.slice(2)}
        </Text>
      );
    } else if (line.startsWith("**") && line.endsWith("**") && line.length > 4) {
      elements.push(
        <Text
          key={key}
          style={[styles.bold, { color: theme.text, fontFamily: "Inter_600SemiBold" }]}
        >
          {line.slice(2, -2)}
        </Text>
      );
    } else if (line.startsWith("- ") || line.startsWith("• ")) {
      elements.push(
        <View key={key} style={styles.bulletRow}>
          <View style={[styles.bullet, { backgroundColor: theme.textTertiary }]} />
          <Text
            style={[
              styles.bulletText,
              { color: theme.text, fontFamily: "Inter_400Regular" },
            ]}
          >
            {parseBoldInline(line.slice(2), theme)}
          </Text>
        </View>
      );
    } else if (/^\d+\.\s/.test(line)) {
      const match = line.match(/^(\d+)\.\s(.+)/);
      if (match) {
        elements.push(
          <View key={key} style={styles.bulletRow}>
            <Text
              style={[
                styles.numeral,
                { color: modeColor, fontFamily: "Inter_600SemiBold" },
              ]}
            >
              {match[1]}.
            </Text>
            <Text
              style={[
                styles.bulletText,
                { color: theme.text, fontFamily: "Inter_400Regular" },
              ]}
            >
              {parseBoldInline(match[2], theme)}
            </Text>
          </View>
        );
      }
    } else if (
      line.startsWith("SOURCES:") ||
      line.startsWith("Sources:")
    ) {
      elements.push(
        <View
          key={key}
          style={[
            styles.sourcesBox,
            {
              backgroundColor: `${modeColor}08`,
              borderColor: `${modeColor}25`,
            },
          ]}
        >
          <Text
            style={[
              styles.sourcesLabel,
              { color: modeColor, fontFamily: "Inter_600SemiBold" },
            ]}
          >
            SOURCES
          </Text>
          <Text
            style={[
              styles.sourcesText,
              {
                color: theme.textSecondary,
                fontFamily: "Inter_400Regular",
              },
            ]}
          >
            {line.replace(/^SOURCES:\s*|^Sources:\s*/, "")}
          </Text>
        </View>
      );
    } else if (line.trim() === "") {
      elements.push(<View key={key} style={styles.spacer} />);
    } else {
      elements.push(
        <Text
          key={key}
          style={[
            styles.body,
            { color: theme.text, fontFamily: "Inter_400Regular" },
          ]}
        >
          {parseBoldInline(line, theme)}
        </Text>
      );
    }
  }

  flushTable();
  return elements;
}

export function ResponseView({
  response,
  mode,
  isStreaming,
  citationMetadata,
  bookmarked,
  onBookmark,
  onGeneratePearls,
  onGenerateFlashcards,
  onGenerateVignette,
  onSaveToDeck,
  deckSaved,
}: ResponseViewProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? Colors.dark : Colors.light;
  const modeColor = getModeColor(mode, isDark);
  const insets = useSafeAreaInsets();

  const [copied, setCopied] = useState(false);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [isSpeaking, setIsSpeaking] = useState(false);

  const stripMarkdown = useCallback((text: string): string => {
    return speechText(text);
  }, []);

  const handleSpeak = useCallback(() => {
    const text = stripMarkdown(response);
    if (!text) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsSpeaking(true);
    const native=(globalThis as any).FMAndroid;
    if(native?.speak){native.speak(text);setIsSpeaking(false);return;}
    Speech.speak(text, {
      rate: 0.92,
      pitch: 1.0,
      onDone: () => setIsSpeaking(false),
      onStopped: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  }, [response, stripMarkdown]);

  const handleStopSpeech = useCallback(() => {
    Speech.stop();
    (globalThis as any).FMAndroid?.stop();
    setIsSpeaking(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

  useEffect(() => {
    if (isStreaming && isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
    }
  }, [isStreaming, isSpeaking]);

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

  const isStudyMode = mode === "board_prep" || mode === "flashcards";

  return (
    <View style={styles.container}>
      <View style={[styles.toolbar, { borderBottomColor: theme.border }]}>
        <Text style={[styles.toolbarLabel, { color: theme.textTertiary }]}>
          {isStreaming ? "Generating..." : "Response"}
        </Text>
        <View style={styles.toolbarRight}>
          {onBookmark && !isStreaming && response.length > 0 && (
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onBookmark();
              }}
              style={({ pressed }) => [
                styles.toolbarBtn,
                {
                  backgroundColor: bookmarked
                    ? `${Colors.flashcards}15`
                    : "transparent",
                  opacity: pressed ? 0.6 : 1,
                },
              ]}
            >
              <Ionicons
                name={bookmarked ? "bookmark" : "bookmark-outline"}
                size={18}
                color={bookmarked ? Colors.flashcards : theme.textSecondary}
              />
            </Pressable>
          )}
          {!isStreaming && response.length > 0 && (
            <Pressable
              onPress={isSpeaking ? handleStopSpeech : handleSpeak}
              style={({ pressed }) => [
                styles.toolbarBtn,
                {
                  backgroundColor: isSpeaking
                    ? `${modeColor}18`
                    : "transparent",
                  opacity: pressed ? 0.6 : 1,
                },
              ]}
            >
              <Ionicons
                name={isSpeaking ? "stop-circle-outline" : "volume-medium-outline"}
                size={18}
                color={isSpeaking ? modeColor : theme.textSecondary}
              />
            </Pressable>
          )}
          <Pressable
            onPress={handleCopy}
            disabled={isStreaming || response.length === 0}
            style={({ pressed }) => [
              styles.copyBtn,
              {
                backgroundColor: copied
                  ? `${modeColor}15`
                  : "transparent",
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
                {
                  color: copied ? modeColor : theme.textSecondary,
                  fontFamily: "Inter_500Medium",
                },
              ]}
            >
              {copied ? "Copied!" : "Copy"}
            </Text>
          </Pressable>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {parseMarkdown(cleanClinicalText(response), isDark, modeColor, theme)}

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
            {onSaveToDeck && mode === "flashcards" && (
              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  onSaveToDeck();
                }}
                disabled={deckSaved}
                style={({ pressed }) => [
                  styles.saveDeckBtn,
                  {
                    backgroundColor: deckSaved
                      ? `${Colors.boardPrep}15`
                      : Colors.flashcards,
                    borderColor: deckSaved
                      ? `${Colors.boardPrep}40`
                      : "transparent",
                    borderWidth: deckSaved ? 1 : 0,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <Ionicons
                  name={deckSaved ? "checkmark-circle" : "layers-outline"}
                  size={18}
                  color={deckSaved ? Colors.boardPrep : "#fff"}
                />
                <Text
                  style={[
                    styles.saveDeckText,
                    {
                      color: deckSaved ? Colors.boardPrep : "#fff",
                      fontFamily: "Inter_600SemiBold",
                    },
                  ]}
                >
                  {deckSaved ? "Added to Study Deck" : "Save to Study Deck"}
                </Text>
              </Pressable>
            )}

            {!isStudyMode && (onGeneratePearls || onGenerateFlashcards || onGenerateVignette) && (
              <View style={styles.addOnsInner}>
                <Text style={[styles.addOnsLabel, { color: theme.textTertiary }]}>
                  GENERATE ADD-ONS
                </Text>
                <View style={styles.addOnButtons}>
                  {onGenerateFlashcards && (
                    <Pressable
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        onGenerateFlashcards();
                      }}
                      style={({ pressed }) => [
                        styles.studyThisBtn,
                        {
                          backgroundColor: Colors.flashcards,
                          opacity: pressed ? 0.8 : 1,
                        },
                      ]}
                    >
                      <Ionicons
                        name="layers-outline"
                        size={15}
                        color="#fff"
                      />
                      <Text
                        style={[
                          styles.studyThisText,
                          { fontFamily: "Inter_600SemiBold" },
                        ]}
                      >
                        Study This
                      </Text>
                    </Pressable>
                  )}
                  {onGeneratePearls && (
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
                      <Ionicons
                        name="trophy-outline"
                        size={15}
                        color={Colors.boardPrep}
                      />
                      <Text style={[styles.addOnText, { color: theme.text }]}>
                        Board Pearls
                      </Text>
                    </Pressable>
                  )}
                  {onGenerateVignette && (
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
                      <Ionicons
                        name="school-outline"
                        size={15}
                        color={Colors.boardPrep}
                      />
                      <Text style={[styles.addOnText, { color: theme.text }]}>
                        Board Vignette
                      </Text>
                    </Pressable>
                  )}
                </View>
              </View>
            )}
          </View>
        )}

        {!isStreaming && citationMetadata && (
          <SourceCitation metadata={citationMetadata} />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
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
  toolbarRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  toolbarBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  copyBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  copyLabel: { fontSize: 13 },
  scrollView: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 20,
    marginBottom: 6,
  },
  sectionIndicator: { width: 3, height: 16, borderRadius: 2 },
  h1: {
    fontSize: 20,
    marginTop: 4,
    marginBottom: 8,
    lineHeight: 28,
  },
  h2: { fontSize: 13, letterSpacing: 0.5 },
  bold: { fontSize: 14, lineHeight: 22, marginTop: 2 },
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
  bulletText: { flex: 1, fontSize: 14, lineHeight: 22 },
  body: { fontSize: 14, lineHeight: 22 },
  spacer: { height: 4 },
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
  sourcesLabel: { fontSize: 10, letterSpacing: 0.8 },
  sourcesText: { fontSize: 12, lineHeight: 18 },
  table: {
    marginTop: 12,
    marginBottom: 4,
    borderRadius: 10,
    borderWidth: 1,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  tableHeaderCell: {
    fontSize: 11,
    letterSpacing: 0.3,
    paddingHorizontal: 4,
  },
  tableRow: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
  },
  tableCell: {
    fontSize: 13,
    lineHeight: 19,
    paddingHorizontal: 4,
  },
  addOns: {
    marginTop: 28,
    gap: 12,
  },
  saveDeckBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
  },
  saveDeckText: {
    color: "#fff",
    fontSize: 15,
  },
  addOnsInner: { gap: 10 },
  addOnsLabel: {
    fontSize: 10,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.8,
  },
  addOnButtons: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  studyThisBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 10,
  },
  studyThisText: {
    color: "#fff",
    fontSize: 13,
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
  addOnText: { fontSize: 13, fontFamily: "Inter_500Medium" },
});
