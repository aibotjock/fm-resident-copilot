import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";
import { Colors, getModeColor } from "@/constants/colors";
import { ResponseView } from "@/components/ResponseView";
import { FlashcardView } from "@/components/FlashcardView";
import { useApp } from "@/context/AppContext";
import { streamClinicalQuery, parseFlashcards } from "@/utils/streaming";
import type { ClinicalMode, CitationMetadata } from "@/types";
import { MODE_LABELS } from "@/types";

export default function ResponseScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const {
    addToHistory,
    bookmarks,
    addBookmark,
    removeBookmark,
    addSRSCards,
    setAppMode,
    recordDomainQuery,
  } = useApp();

  const params = useLocalSearchParams<{
    query: string;
    mode: string;
    condition?: string;
    system?: string;
  }>();

  const mode = (params.mode || "point_of_care") as ClinicalMode;
  const query = params.query || "";
  const condition = params.condition;
  const system = params.system;

  const [response, setResponse] = useState("");
  const [isStreaming, setIsStreaming] = useState(true);
  const [error, setError] = useState("");
  const [flashcards, setFlashcards] = useState<Array<{ front: string; back: string }>>([]);
  const [showFlashcards, setShowFlashcards] = useState(false);
  const [deckSaved, setDeckSaved] = useState(false);
  const [citationMetadata, setCitationMetadata] = useState<CitationMetadata | null>(null);

  const responseRef = useRef("");
  const abortRef = useRef<AbortController | null>(null);
  const savedRef = useRef(false);

  const modeColor = getModeColor(mode, isDark);

  const existingBookmark = useMemo(
    () => bookmarks.find((b) => b.query === query && b.mode === mode),
    [bookmarks, query, mode]
  );
  const bookmarkedNow = !!existingBookmark;

  const startStream = useCallback(
    async (q: string, m: ClinicalMode, cond?: string) => {
      responseRef.current = "";
      setResponse("");
      setIsStreaming(true);
      setError("");
      setShowFlashcards(false);
      setDeckSaved(false);
      setCitationMetadata(null);
      savedRef.current = false;

      abortRef.current = new AbortController();
      let capturedDomain = "";

      await streamClinicalQuery(
        q,
        m,
        cond,
        {
          onChunk: (chunk) => {
            responseRef.current += chunk;
            setResponse(responseRef.current);
          },
          onCitation: (meta) => {
            setCitationMetadata(meta);
            if (meta.domain) {
              capturedDomain = meta.domain;
              recordDomainQuery(meta.domain);
            }
          },
          onDone: () => {
            setIsStreaming(false);
            if (!savedRef.current) {
              savedRef.current = true;
              addToHistory({
                query: q,
                mode: m,
                condition: cond,
                response: responseRef.current,
                system,
                abfmDomain: capturedDomain || undefined,
              });
            }
            if (m === "flashcards") {
              const cards = parseFlashcards(responseRef.current);
              setFlashcards(cards);
              setShowFlashcards(cards.length > 0);
            }
          },
          onError: (err) => {
            setError(err);
            setIsStreaming(false);
          },
        },
        abortRef.current.signal
      );
    },
    [addToHistory, system]
  );

  useEffect(() => {
    if (query) {
      startStream(query, mode, condition);
    }
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const handleToggleBookmark = useCallback(async () => {
    if (existingBookmark) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      await removeBookmark(existingBookmark.id);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await addBookmark({
        query,
        mode,
        condition,
        system,
        response: responseRef.current,
      });
    }
  }, [existingBookmark, query, mode, condition, system, addBookmark, removeBookmark]);

  const handleSaveToDeck = useCallback(async () => {
    if (deckSaved || flashcards.length === 0) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const topic = condition || query.slice(0, 40);
    const abfmDomain = citationMetadata?.domain || undefined;
    await addSRSCards(
      flashcards.map((c) => ({
        front: c.front,
        back: c.back,
        condition,
        topic,
        abfmDomain,
      }))
    );
    setDeckSaved(true);
    await setAppMode("study");
  }, [flashcards, deckSaved, condition, query, citationMetadata, addSRSCards, setAppMode]);

  const handleGeneratePearls = useCallback(() => {
    const pearlQuery = `Give me high-yield ABFM board pearls and common exam traps for ${condition || "this condition"}.`;
    router.push({
      pathname: "/response",
      params: { query: pearlQuery, mode: "board_prep", condition, system },
    });
  }, [condition, system]);

  const handleGenerateFlashcards = useCallback(() => {
    const flashQuery = `Generate 6 Anki-style flashcards for ${condition || query}.`;
    router.push({
      pathname: "/response",
      params: { query: flashQuery, mode: "flashcards", condition, system },
    });
  }, [condition, query, system]);

  const handleGenerateVignette = useCallback(() => {
    const vigQuery = `Write an ABFM-style board exam vignette (4-option multiple choice) for ${condition || "this clinical topic"}.`;
    router.push({
      pathname: "/response",
      params: { query: vigQuery, mode: "board_prep", condition, system },
    });
  }, [condition, system]);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.background, paddingTop: insets.top },
      ]}
    >
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            abortRef.current?.abort();
            router.back();
          }}
          style={({ pressed }) => [
            styles.backBtn,
            { opacity: pressed ? 0.6 : 1 },
          ]}
        >
          <Ionicons name="chevron-back" size={24} color={theme.text} />
        </Pressable>

        <View style={styles.headerCenter}>
          <View
            style={[
              styles.modeBadge,
              {
                backgroundColor: `${modeColor}20`,
                borderColor: `${modeColor}40`,
              },
            ]}
          >
            <Text
              style={[
                styles.modeBadgeText,
                { color: modeColor, fontFamily: "Inter_600SemiBold" },
              ]}
            >
              {MODE_LABELS[mode]}
            </Text>
          </View>
          {condition && (
            <Text
              style={[
                styles.conditionTitle,
                { color: theme.text, fontFamily: "Inter_600SemiBold" },
              ]}
              numberOfLines={1}
            >
              {condition}
            </Text>
          )}
        </View>

        <View style={{ width: 36 }} />
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={40} color="#EF4444" />
          <Text style={[styles.errorText, { color: theme.text }]}>{error}</Text>
          <Pressable
            onPress={() => startStream(query, mode, condition)}
            style={[styles.retryBtn, { backgroundColor: modeColor }]}
          >
            <Text style={styles.retryBtnText}>Retry</Text>
          </Pressable>
        </View>
      ) : showFlashcards && flashcards.length > 0 ? (
        <View style={{ flex: 1 }}>
          <View style={styles.flashcardHeaderRow}>
            <Pressable
              onPress={() => setShowFlashcards(false)}
              style={({ pressed }) => [
                styles.viewToggle,
                {
                  backgroundColor: theme.surfaceSecondary,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <Ionicons
                name="list-outline"
                size={16}
                color={theme.textSecondary}
              />
              <Text
                style={[
                  styles.viewToggleText,
                  { color: theme.textSecondary },
                ]}
              >
                View Text
              </Text>
            </Pressable>

            {!deckSaved ? (
              <Pressable
                onPress={handleSaveToDeck}
                style={({ pressed }) => [
                  styles.saveBtn,
                  {
                    backgroundColor: Colors.flashcards,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <Ionicons name="layers-outline" size={15} color="#fff" />
                <Text
                  style={[
                    styles.saveBtnText,
                    { fontFamily: "Inter_600SemiBold" },
                  ]}
                >
                  Save to Deck
                </Text>
              </Pressable>
            ) : (
              <View
                style={[
                  styles.savedBadge,
                  {
                    backgroundColor: `${Colors.boardPrep}15`,
                    borderColor: `${Colors.boardPrep}40`,
                  },
                ]}
              >
                <Ionicons
                  name="checkmark-circle"
                  size={14}
                  color={Colors.boardPrep}
                />
                <Text
                  style={[
                    styles.savedBadgeText,
                    {
                      color: Colors.boardPrep,
                      fontFamily: "Inter_500Medium",
                    },
                  ]}
                >
                  Saved to Deck
                </Text>
              </View>
            )}
          </View>
          <FlashcardView cards={flashcards} />
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          {mode === "flashcards" && flashcards.length > 0 && !showFlashcards && (
            <View style={styles.flashcardHeaderRow}>
              <Pressable
                onPress={() => setShowFlashcards(true)}
                style={({ pressed }) => [
                  styles.viewToggle,
                  {
                    backgroundColor: `${Colors.flashcards}20`,
                    borderColor: `${Colors.flashcards}40`,
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
              >
                <Ionicons
                  name="layers-outline"
                  size={16}
                  color={Colors.flashcards}
                />
                <Text
                  style={[
                    styles.viewToggleText,
                    { color: Colors.flashcards },
                  ]}
                >
                  Flashcard View
                </Text>
              </Pressable>
            </View>
          )}
          <ResponseView
            response={response}
            mode={mode}
            isStreaming={isStreaming}
            citationMetadata={citationMetadata}
            bookmarked={bookmarkedNow}
            onBookmark={handleToggleBookmark}
            onGeneratePearls={handleGeneratePearls}
            onGenerateFlashcards={handleGenerateFlashcards}
            onGenerateVignette={handleGenerateVignette}
            onSaveToDeck={mode === "flashcards" ? handleSaveToDeck : undefined}
            deckSaved={deckSaved}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 8,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  headerCenter: { flex: 1, alignItems: "center", gap: 4 },
  modeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
    borderWidth: 1,
  },
  modeBadgeText: { fontSize: 11, letterSpacing: 0.3 },
  conditionTitle: { fontSize: 15 },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    padding: 40,
  },
  errorText: {
    fontSize: 15,
    textAlign: "center",
    fontFamily: "Inter_400Regular",
    lineHeight: 22,
  },
  retryBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryBtnText: { color: "#fff", fontSize: 15, fontFamily: "Inter_600SemiBold" },
  flashcardHeaderRow: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  viewToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "transparent",
  },
  viewToggleText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 10,
  },
  saveBtnText: { color: "#fff", fontSize: 13 },
  savedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
  },
  savedBadgeText: { fontSize: 12 },
});
