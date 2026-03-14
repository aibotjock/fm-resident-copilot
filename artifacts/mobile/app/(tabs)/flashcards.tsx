import React, { useCallback, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useColorScheme,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";
import { ConditionGrid } from "@/components/ConditionGrid";
import { useApp } from "@/context/AppContext";

const MODE = "flashcards" as const;
const MODE_COLOR = Colors.flashcards;
const MODE_LABEL = "Flashcards";
const PLACEHOLDER = "e.g. Flashcards for heart failure management...";

const QUICK_TOPICS = [
  "Diabetes medications mechanism and indications",
  "Heart failure pharmacotherapy",
  "Antibiotic coverage for common infections",
  "Screening guidelines by age group",
  "Common EKG findings and diagnoses",
  "Vaccinations schedule for adults",
];

export default function FlashcardsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const { history } = useApp();

  const [query, setQuery] = useState("");
  const [showConditions, setShowConditions] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const recentForMode = history
    .filter((h) => h.mode === MODE)
    .slice(0, 3);

  const handleSubmit = useCallback(() => {
    if (!query.trim()) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push({
      pathname: "/response",
      params: { query: query.trim(), mode: MODE },
    });
    setQuery("");
  }, [query]);

  const handleConditionSelect = useCallback(
    (condition: string, prefillQuery: string, system: string) => {
      setShowConditions(false);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      router.push({
        pathname: "/response",
        params: { query: prefillQuery, mode: MODE, condition, system },
      });
    },
    []
  );

  return (
    <>
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: theme.background }]}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingTop:
                Platform.OS === "web" ? insets.top + 67 : insets.top + 16,
              paddingBottom: Platform.OS === "web" ? 120 : 100,
            },
          ]}
        >
          <View style={styles.heroSection}>
            <View
              style={[
                styles.modeIndicator,
                { backgroundColor: `${MODE_COLOR}15`, borderColor: `${MODE_COLOR}30` },
              ]}
            >
              <View style={[styles.modeDot, { backgroundColor: MODE_COLOR }]} />
              <Text
                style={[
                  styles.modeLabel,
                  { color: MODE_COLOR, fontFamily: "Inter_600SemiBold" },
                ]}
              >
                {MODE_LABEL}
              </Text>
            </View>
            <Text style={[styles.heroTitle, { color: theme.text, fontFamily: "Inter_700Bold" }]}>
              Spaced Review
            </Text>
            <Text style={[styles.heroSubtitle, { color: theme.textSecondary }]}>
              Anki-style flip cards generated from indexed guidelines
            </Text>
          </View>

          <View
            style={[
              styles.previewCard,
              {
                backgroundColor: isDark ? "#1A1F35" : "#EDE9FE",
                borderColor: isDark ? Colors.flashcardsDark : Colors.flashcards,
              },
            ]}
          >
            <View style={styles.previewCardInner}>
              <Ionicons name="help-circle" size={20} color={MODE_COLOR} />
              <Text style={[styles.previewText, { color: isDark ? "#C4B5FD" : Colors.flashcardsDark }]}>
                What is the first-line agent for stage 1 hypertension in a non-Black patient without CKD?
              </Text>
            </View>
            <View style={[styles.previewDivider, { borderColor: `${MODE_COLOR}30` }]} />
            <View style={styles.previewCardInner}>
              <Ionicons name="checkmark-circle" size={20} color={Colors.boardPrep} />
              <Text style={[styles.previewAnswer, { color: isDark ? "#6EE7B7" : Colors.boardPrepDark }]}>
                Thiazide diuretic (e.g. chlorthalidone) or ACE inhibitor/ARB or long-acting CCB — per ACC/AHA 2017
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.inputCard,
              {
                backgroundColor: theme.surface,
                borderColor: theme.border,
                shadowColor: isDark ? "#000" : "#94A3B8",
              },
            ]}
          >
            <TextInput
              ref={inputRef}
              style={[
                styles.input,
                { color: theme.text, fontFamily: "Inter_400Regular" },
              ]}
              placeholder={PLACEHOLDER}
              placeholderTextColor={theme.textTertiary}
              value={query}
              onChangeText={setQuery}
              multiline
            />
            <View style={styles.inputActions}>
              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setShowConditions(true);
                }}
                style={({ pressed }) => [
                  styles.conditionsBtn,
                  {
                    backgroundColor: `${MODE_COLOR}15`,
                    borderColor: `${MODE_COLOR}30`,
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
              >
                <Ionicons name="list-outline" size={16} color={MODE_COLOR} />
                <Text style={[styles.conditionsBtnText, { color: MODE_COLOR }]}>
                  Browse Conditions
                </Text>
              </Pressable>
              <Pressable
                onPress={handleSubmit}
                disabled={!query.trim()}
                style={({ pressed }) => [
                  styles.sendBtn,
                  {
                    backgroundColor: query.trim() ? MODE_COLOR : theme.border,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <Ionicons name="arrow-up" size={18} color="#fff" />
              </Pressable>
            </View>
          </View>

          <View style={styles.topicsSection}>
            <Text style={[styles.sectionTitle, { color: theme.textTertiary }]}>
              SUGGESTED TOPICS
            </Text>
            <View style={styles.topicsGrid}>
              {QUICK_TOPICS.map((topic, i) => (
                <Pressable
                  key={i}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    const q = `Generate 5 Anki-style flashcards for: ${topic}`;
                    router.push({
                      pathname: "/response",
                      params: { query: q, mode: MODE },
                    });
                  }}
                  style={({ pressed }) => [
                    styles.topicChip,
                    {
                      backgroundColor: theme.surface,
                      borderColor: theme.border,
                      opacity: pressed ? 0.7 : 1,
                    },
                  ]}
                >
                  <Ionicons name="layers-outline" size={13} color={MODE_COLOR} />
                  <Text
                    style={[
                      styles.topicText,
                      { color: theme.text, fontFamily: "Inter_400Regular" },
                    ]}
                  >
                    {topic}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {recentForMode.length > 0 && (
            <View style={styles.recentSection}>
              <Text style={[styles.sectionTitle, { color: theme.textTertiary }]}>
                RECENT DECKS
              </Text>
              {recentForMode.map((h) => (
                <Pressable
                  key={h.id}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    router.push({
                      pathname: "/response",
                      params: {
                        query: h.query,
                        mode: MODE,
                        condition: h.condition,
                        system: h.system,
                      },
                    });
                  }}
                  style={({ pressed }) => [
                    styles.recentItem,
                    {
                      backgroundColor: theme.surface,
                      borderColor: theme.border,
                      opacity: pressed ? 0.7 : 1,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.recentIcon,
                      { backgroundColor: `${MODE_COLOR}15` },
                    ]}
                  >
                    <Ionicons name="layers" size={16} color={MODE_COLOR} />
                  </View>
                  <View style={styles.recentContent}>
                    {h.condition && (
                      <Text
                        style={[styles.recentCondition, { color: MODE_COLOR }]}
                      >
                        {h.condition}
                      </Text>
                    )}
                    <Text
                      style={[styles.recentQuery, { color: theme.text }]}
                      numberOfLines={1}
                    >
                      {h.query}
                    </Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={16}
                    color={theme.textTertiary}
                  />
                </Pressable>
              ))}
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal visible={showConditions} animationType="slide" presentationStyle="pageSheet">
        <ConditionGrid
          mode={MODE}
          onSelect={handleConditionSelect}
          onClose={() => setShowConditions(false)}
        />
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, gap: 16 },
  heroSection: { gap: 6, marginBottom: 4 },
  modeIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
  },
  modeDot: { width: 6, height: 6, borderRadius: 3 },
  modeLabel: { fontSize: 12, letterSpacing: 0.3 },
  heroTitle: { fontSize: 28 },
  heroSubtitle: { fontSize: 15, fontFamily: "Inter_400Regular", lineHeight: 22 },
  previewCard: {
    borderRadius: 16,
    borderWidth: 2,
    overflow: "hidden",
  },
  previewCardInner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    padding: 16,
  },
  previewDivider: { borderTopWidth: 1 },
  previewText: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    lineHeight: 20,
  },
  previewAnswer: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 20,
  },
  inputCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  input: {
    minHeight: 80,
    maxHeight: 160,
    padding: 16,
    fontSize: 15,
    lineHeight: 22,
    textAlignVertical: "top",
  },
  inputActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingBottom: 12,
    paddingTop: 4,
    gap: 8,
  },
  conditionsBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
  },
  conditionsBtnText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  topicsSection: { gap: 10 },
  topicsGrid: { gap: 8 },
  topicChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  topicText: { flex: 1, fontSize: 13, lineHeight: 18 },
  recentSection: { gap: 8, marginTop: 4 },
  sectionTitle: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.8,
  },
  recentItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 10,
  },
  recentIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  recentContent: { flex: 1, gap: 2 },
  recentCondition: { fontSize: 12, fontFamily: "Inter_500Medium" },
  recentQuery: { fontSize: 13, fontFamily: "Inter_400Regular" },
});
