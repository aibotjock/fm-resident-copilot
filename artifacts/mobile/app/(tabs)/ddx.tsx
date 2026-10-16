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

const MODE = "ddx" as const;
const MODE_COLOR = Colors.ddx;
const MODE_LABEL = "Differential Dx";
const PLACEHOLDER = "Describe the presentation, e.g. 45F with 3 weeks of progressive dyspnea and bilateral lower extremity edema...";

const QUICK_PRESENTATIONS = [
  "55M with acute onset chest pain radiating to jaw, diaphoresis",
  "28F with 6 weeks of fatigue, weight gain, constipation, cold intolerance",
  "40M with fever, headache, neck stiffness, photophobia",
  "65F with new confusion, urinary incontinence, gait instability",
  "30F with episodic palpitations, sweating, and anxiety attacks",
  "50M with progressive dyspnea on exertion and bilateral ankle edema",
  "22M with RLQ pain, anorexia, fever, rebound tenderness",
  "45F with joint pain and stiffness worse in the morning, symmetric",
];

export default function DDxScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const { history } = useApp();

  const [query, setQuery] = useState("");
  const [showConditions, setShowConditions] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const recentForMode = history.filter((h) => h.mode === MODE).slice(0, 3);

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
      const ddxQuery = `I have a patient with a presentation that could be ${condition}. Help me work through the differential diagnosis.`;
      router.push({
        pathname: "/response",
        params: { query: ddxQuery, mode: MODE, condition, system },
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
              paddingBottom: Platform.OS === "web" ? 160 : 140,
            },
          ]}
        >
          <View style={styles.heroSection}>
            <View
              style={[
                styles.modeIndicator,
                {
                  backgroundColor: `${MODE_COLOR}15`,
                  borderColor: `${MODE_COLOR}30`,
                },
              ]}
            >
              <View
                style={[styles.modeDot, { backgroundColor: MODE_COLOR }]}
              />
              <Text
                style={[
                  styles.modeLabel,
                  { color: MODE_COLOR, fontFamily: "Inter_600SemiBold" },
                ]}
              >
                {MODE_LABEL}
              </Text>
            </View>
            <Text
              style={[
                styles.heroTitle,
                { color: theme.text, fontFamily: "Inter_700Bold" },
              ]}
            >
              What's the Diagnosis?
            </Text>
            <Text
              style={[
                styles.heroSubtitle,
                { color: theme.textSecondary, fontFamily: "Inter_400Regular" },
              ]}
            >
              Describe the presentation — get a ranked differential with must-not-miss
              diagnoses and a workup plan
            </Text>
          </View>

          <View
            style={[
              styles.frameworkCard,
              {
                backgroundColor: isDark ? "#071E26" : Colors.ddxLight,
                borderColor: isDark ? Colors.ddxDark : `${MODE_COLOR}40`,
              },
            ]}
          >
            <View style={styles.frameworkRow}>
              <Ionicons name="warning-outline" size={16} color={MODE_COLOR} />
              <Text style={[styles.frameworkLabel, { color: MODE_COLOR }]}>
                MUST NOT MISS
              </Text>
            </View>
            <View style={styles.frameworkRow}>
              <Ionicons name="list-outline" size={16} color={MODE_COLOR} />
              <Text
                style={[
                  styles.frameworkDesc,
                  { color: isDark ? "#67E8F9" : Colors.ddxDark },
                ]}
              >
                Ranked differential · Key features · Distinguishing test
              </Text>
            </View>
            <View style={styles.frameworkRow}>
              <Ionicons name="git-branch-outline" size={16} color={MODE_COLOR} />
              <Text
                style={[
                  styles.frameworkDesc,
                  { color: isDark ? "#67E8F9" : Colors.ddxDark },
                ]}
              >
                Decision branch · First workup orders
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.inputCard,
              {
                backgroundColor: theme.surface,
                borderColor: theme.border,
                shadowColor: isDark ? "#000" : "#0891B2",
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
              onSubmitEditing={handleSubmit}
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
                    backgroundColor: `${MODE_COLOR}12`,
                    borderColor: `${MODE_COLOR}30`,
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
              >
                <Ionicons name="list-outline" size={15} color={MODE_COLOR} />
                <Text
                  style={[styles.conditionsBtnText, { color: MODE_COLOR }]}
                >
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
              EXAMPLE PRESENTATIONS
            </Text>
            <View style={styles.topicsGrid}>
              {QUICK_PRESENTATIONS.map((pres, i) => (
                <Pressable
                  key={i}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    router.push({
                      pathname: "/response",
                      params: { query: pres, mode: MODE },
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
                  <Ionicons
                    name="person-outline"
                    size={13}
                    color={MODE_COLOR}
                  />
                  <Text
                    style={[
                      styles.topicText,
                      {
                        color: theme.text,
                        fontFamily: "Inter_400Regular",
                      },
                    ]}
                  >
                    {pres}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {recentForMode.length > 0 && (
            <View style={styles.recentSection}>
              <Text
                style={[styles.sectionTitle, { color: theme.textTertiary }]}
              >
                RECENT WORKUPS
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
                    <Ionicons
                      name="git-branch"
                      size={16}
                      color={MODE_COLOR}
                    />
                  </View>
                  <View style={styles.recentContent}>
                    {h.condition && (
                      <Text
                        style={[
                          styles.recentCondition,
                          { color: MODE_COLOR },
                        ]}
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

      <Modal
        visible={showConditions}
        animationType="slide"
        presentationStyle="pageSheet"
      >
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
  heroSubtitle: { fontSize: 15, lineHeight: 22 },
  frameworkCard: {
    borderRadius: 14,
    borderWidth: 1.5,
    padding: 14,
    gap: 8,
  },
  frameworkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  frameworkLabel: {
    fontSize: 11,
    fontFamily: "Inter_700Bold",
    letterSpacing: 0.8,
  },
  frameworkDesc: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
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
    minHeight: 100,
    maxHeight: 180,
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
    alignItems: "flex-start",
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
