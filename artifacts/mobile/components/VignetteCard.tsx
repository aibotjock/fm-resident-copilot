import React, { useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";

export interface VignetteQuestion {
  question: string;
  options: { a: string; b: string; c: string; d: string };
  answer: "a" | "b" | "c" | "d";
  explanation: string;
  domain: string;
  source: string;
}

interface Props {
  vignette: VignetteQuestion | null;
  loading: boolean;
  error: string;
  sessionScore: { correct: number; total: number };
  onNext: () => void;
  onAnswer?: (correct: boolean) => void;
}

const OPTION_LABELS = ["A", "B", "C", "D"] as const;
const OPTION_KEYS = ["a", "b", "c", "d"] as const;

export function VignetteCard({ vignette, loading, error, sessionScore, onNext, onAnswer }: Props) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? Colors.dark : Colors.light;

  const [selected, setSelected] = useState<"a" | "b" | "c" | "d" | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleSelect = (key: "a" | "b" | "c" | "d") => {
    if (selected !== null || !vignette) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelected(key);
    setShowExplanation(true);
    onAnswer?.(key === vignette.answer);
  };

  const handleNext = () => {
    setSelected(null);
    setShowExplanation(false);
    onNext();
  };

  const getOptionStyle = (key: "a" | "b" | "c" | "d") => {
    if (selected === null) {
      return {
        backgroundColor: theme.surface,
        borderColor: theme.border,
      };
    }
    if (key === vignette?.answer) {
      return {
        backgroundColor: isDark ? "#064E3B" : "#D1FAE5",
        borderColor: "#10B981",
      };
    }
    if (key === selected && key !== vignette?.answer) {
      return {
        backgroundColor: isDark ? "#450A0A" : "#FEE2E2",
        borderColor: "#EF4444",
      };
    }
    return {
      backgroundColor: theme.surface,
      borderColor: isDark ? "#374151" : "#E5E7EB",
      opacity: 0.6,
    };
  };

  const getOptionIcon = (key: "a" | "b" | "c" | "d") => {
    if (selected === null) return null;
    if (key === vignette?.answer) {
      return <Ionicons name="checkmark-circle" size={18} color="#10B981" />;
    }
    if (key === selected) {
      return <Ionicons name="close-circle" size={18} color="#EF4444" />;
    }
    return null;
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={Colors.boardPrep} />
        <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
          Generating board question...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: theme.background }]}>
        <Ionicons name="alert-circle-outline" size={40} color="#EF4444" />
        <Text style={[styles.errorText, { color: theme.text }]}>{error}</Text>
        <Pressable
          onPress={handleNext}
          style={[styles.nextBtn, { backgroundColor: Colors.boardPrep }]}
        >
          <Text style={styles.nextBtnText}>Try Another</Text>
        </Pressable>
      </View>
    );
  }

  if (!vignette) return null;

  const isCorrect = selected === vignette.answer;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.scoreRow}>
        <View style={[styles.domainBadge, { backgroundColor: `${Colors.boardPrep}15`, borderColor: `${Colors.boardPrep}30` }]}>
          <Text style={[styles.domainText, { color: Colors.boardPrep }]}>{vignette.domain}</Text>
        </View>
        <View style={[styles.scoreBadge, { backgroundColor: theme.surfaceSecondary }]}>
          <Text style={[styles.scoreText, { color: theme.textSecondary }]}>
            {sessionScore.correct}/{sessionScore.total} correct
          </Text>
        </View>
      </View>

      <View style={[styles.questionCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <View style={styles.questionHeader}>
          <Ionicons name="help-circle-outline" size={18} color={Colors.boardPrep} />
          <Text style={[styles.questionLabel, { color: Colors.boardPrep }]}>ABFM BOARD VIGNETTE</Text>
        </View>
        <Text style={[styles.questionText, { color: theme.text }]}>{vignette.question}</Text>
        <Text style={[styles.sourceNote, { color: theme.textTertiary }]}>Source: {vignette.source}</Text>
      </View>

      <View style={styles.optionsContainer}>
        {OPTION_KEYS.map((key, idx) => (
          <Pressable
            key={key}
            onPress={() => handleSelect(key)}
            disabled={selected !== null}
            style={({ pressed }) => [
              styles.optionBtn,
              getOptionStyle(key),
              { opacity: pressed && selected === null ? 0.8 : (getOptionStyle(key) as any).opacity ?? 1 },
            ]}
          >
            <View style={[styles.optionLabel, { backgroundColor: selected === null ? `${Colors.boardPrep}20` : "transparent" }]}>
              <Text style={[styles.optionLabelText, {
                color: selected === null ? Colors.boardPrep :
                  key === vignette.answer ? "#10B981" :
                  key === selected ? "#EF4444" : theme.textTertiary,
              }]}>
                {OPTION_LABELS[idx]}
              </Text>
            </View>
            <Text style={[styles.optionText, { color: theme.text, flex: 1 }]}>
              {vignette.options[key]}
            </Text>
            {getOptionIcon(key)}
          </Pressable>
        ))}
      </View>

      {showExplanation && (
        <View style={[
          styles.explanationCard,
          {
            backgroundColor: isCorrect ? (isDark ? "#064E3B" : "#ECFDF5") : (isDark ? "#450A0A" : "#FFF1F2"),
            borderColor: isCorrect ? "#10B981" : "#F43F5E",
          },
        ]}>
          <View style={styles.explanationHeader}>
            <Ionicons
              name={isCorrect ? "checkmark-circle" : "close-circle"}
              size={20}
              color={isCorrect ? "#10B981" : "#F43F5E"}
            />
            <Text style={[styles.explanationTitle, { color: isCorrect ? "#10B981" : "#F43F5E" }]}>
              {isCorrect ? "Correct!" : `Incorrect — Answer: ${vignette.answer.toUpperCase()}`}
            </Text>
          </View>
          <Text style={[styles.explanationText, { color: theme.text }]}>
            {vignette.explanation}
          </Text>
        </View>
      )}

      {selected !== null && (
        <Pressable
          onPress={handleNext}
          style={({ pressed }) => [
            styles.nextBtn,
            { backgroundColor: Colors.boardPrep, opacity: pressed ? 0.85 : 1 },
          ]}
        >
          <Text style={styles.nextBtnText}>Next Question</Text>
          <Ionicons name="arrow-forward" size={16} color="#fff" />
        </Pressable>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, paddingVertical: 16, gap: 14, paddingBottom: 60 },
  loadingContainer: { flex: 1, alignItems: "center", justifyContent: "center", gap: 16 },
  loadingText: { fontSize: 15, fontFamily: "Inter_400Regular" },
  errorContainer: { flex: 1, alignItems: "center", justifyContent: "center", gap: 16, padding: 40 },
  errorText: { fontSize: 15, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 22 },
  scoreRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  domainBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
  },
  domainText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  scoreBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  scoreText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  questionCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  questionHeader: { flexDirection: "row", alignItems: "center", gap: 6 },
  questionLabel: { fontSize: 11, fontFamily: "Inter_600SemiBold", letterSpacing: 0.5 },
  questionText: { fontSize: 15, fontFamily: "Inter_400Regular", lineHeight: 24 },
  sourceNote: { fontSize: 11, fontFamily: "Inter_400Regular" },
  optionsContainer: { gap: 10 },
  optionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  optionLabel: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  optionLabelText: { fontSize: 14, fontFamily: "Inter_700Bold" },
  optionText: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 20 },
  explanationCard: {
    borderRadius: 14,
    borderWidth: 1.5,
    padding: 16,
    gap: 10,
  },
  explanationHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
  explanationTitle: { fontSize: 14, fontFamily: "Inter_700Bold" },
  explanationText: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 22 },
  nextBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
  },
  nextBtnText: { color: "#fff", fontSize: 16, fontFamily: "Inter_600SemiBold" },
});
