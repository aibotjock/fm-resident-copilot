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
import { ReferenceStatus } from "@/components/ReferenceStatus";
import { VignetteCard } from "@/components/VignetteCard";
import type { VignetteQuestion } from "@/components/VignetteCard";
import { useApp } from "@/context/AppContext";

const MODE = "board_prep" as const;
const MODE_COLOR = Colors.boardPrep;
const MODE_LABEL = "Board Prep";

const QUICK_PROMPTS = [
  { label: "Screening Guidelines", prompt: "What are USPSTF screening recommendations I must know for ABFM boards?" },
  { label: "Common Traps", prompt: "What are the most commonly tested clinical traps on the ABFM exam?" },
  { label: "HTN Management", prompt: "Current guideline-based hypertension management: presentation, diagnosis, next test, treatment sequence, and supported doses with checked sources." },
  { label: "Preventive Care", prompt: "High-yield preventive medicine pearls for ABFM boards including vaccine schedules and cancer screening" },
  { label: "DM Type 2", prompt: "ABFM board pearls: diabetes management, A1C targets, SGLT2/GLP-1 indications, and microvascular complications" },
  { label: "CV Risk", prompt: "Board pearls: ACC/AHA cardiovascular risk reduction — statins, aspirin indications, and ASCVD calculator" },
];

const ABFM_DOMAINS = [
  "Cardiovascular",
  "Musculoskeletal",
  "Psychiatry & Behavioral Health",
  "Endocrine & Metabolic",
  "Preventive Medicine & Health Maintenance",
  "Women's Health & Reproductive Medicine",
  "Gastrointestinal",
  "Pulmonary & Allergy",
  "Infectious Disease",
  "Neurology",
  "Dermatology",
  "Renal & Urology",
  "Pediatrics",
  "Hematology & Oncology",
  "Geriatrics",
  "Multisystem & Other",
];

type TabMode = "study" | "practice";

const API_BASE = process.env.EXPO_PUBLIC_DOMAIN
  ? `https://${process.env.EXPO_PUBLIC_DOMAIN}`
  : "";

export default function BoardPrepScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const { history, recordVignetteAnswer, addSRSCards } = useApp();

  const [tabMode, setTabMode] = useState<TabMode>("study");
  const [query, setQuery] = useState("");
  const [showConditions, setShowConditions] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const [vignette, setVignette] = useState<VignetteQuestion | null>(null);
  const [vignetteLoading, setVignetteLoading] = useState(false);
  const [vignetteError, setVignetteError] = useState("");
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [showDomainPicker, setShowDomainPicker] = useState(false);
  const [sessionScore, setSessionScore] = useState({ correct: 0, total: 0 });

  const recentForMode = history.filter((h) => h.mode === MODE).slice(0, 4);

  const handleSubmit = useCallback(() => {
    if (!query.trim()) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push({ pathname: "/response", params: { query: query.trim(), mode: MODE } });
    setQuery("");
  }, [query]);

  const handleConditionSelect = useCallback(
    (condition: string, prefillQuery: string, system: string) => {
      setShowConditions(false);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      router.push({ pathname: "/response", params: { query: prefillQuery, mode: MODE, condition, system } });
    },
    []
  );

  const fetchVignette = useCallback(async (domain?: string) => {
    setVignetteLoading(true);
    setVignetteError("");
    setVignette(null);
    try {
      const resp = await fetch(`${API_BASE}/api/clinical/vignette`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: domain ?? selectedDomain ?? undefined }),
      });
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error((err as any).error || "Server error");
      }
      const data = await resp.json();
      setVignette(data as VignetteQuestion);
    } catch (e: any) {
      setVignetteError(e.message || "Failed to generate question. Please try again.");
    } finally {
      setVignetteLoading(false);
    }
  }, [selectedDomain]);

  const handleSwitchToPractice = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setTabMode("practice");
    if (!vignette && !vignetteLoading) {
      fetchVignette();
    }
  };

  const handleNextVignette = useCallback(() => {
    fetchVignette();
  }, [fetchVignette]);

  const handleAnswer = useCallback((domain: string, correct: boolean) => {
    setSessionScore((prev) => ({
      correct: prev.correct + (correct ? 1 : 0),
      total: prev.total + 1,
    }));
    recordVignetteAnswer(domain, correct);
  }, [recordVignetteAnswer]);

  const handleSaveToFlashcard = useCallback(
    (card: { front: string; back: string; topic: string; abfmDomain: string }) => {
      addSRSCards([card]);
    },
    [addSRSCards]
  );

  const handleDomainSelect = (domain: string | null) => {
    setSelectedDomain(domain);
    setShowDomainPicker(false);
    setSessionScore({ correct: 0, total: 0 });
    fetchVignette(domain ?? undefined);
  };

  const handleResetSession = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSessionScore({ correct: 0, total: 0 });
    fetchVignette();
  };

  return (
    <>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View
          style={[
            styles.screenHeader,
            {
              paddingTop: Platform.OS === "web" ? insets.top + 67 : insets.top + 16,
              borderBottomColor: theme.border,
              backgroundColor: theme.background,
            },
          ]}
        >
          <View style={styles.heroSection}>
            <View style={[styles.modeIndicator, { backgroundColor: `${MODE_COLOR}15`, borderColor: `${MODE_COLOR}30` }]}>
              <View style={[styles.modeDot, { backgroundColor: MODE_COLOR }]} />
              <Text style={[styles.modeLabel, { color: MODE_COLOR, fontFamily: "Inter_600SemiBold" }]}>
                {MODE_LABEL}
              </Text>
            </View>
            <Text style={[styles.heroTitle, { color: theme.text, fontFamily: "Inter_700Bold" }]}>
              {tabMode === "study" ? "Pass the Boards" : "Vignette Practice"}
            </Text>
          </View>

          <ReferenceStatus />

          <View style={[styles.tabToggle, { backgroundColor: theme.surfaceSecondary }]}>
            <Pressable
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setTabMode("study"); }}
              style={[
                styles.tabBtn,
                tabMode === "study" && { backgroundColor: theme.surface, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
              ]}
            >
              <Ionicons name="school-outline" size={14} color={tabMode === "study" ? MODE_COLOR : theme.textTertiary} />
              <Text style={[styles.tabBtnText, { color: tabMode === "study" ? MODE_COLOR : theme.textTertiary, fontFamily: tabMode === "study" ? "Inter_600SemiBold" : "Inter_400Regular" }]}>
                Study
              </Text>
            </Pressable>
            <Pressable
              onPress={handleSwitchToPractice}
              style={[
                styles.tabBtn,
                tabMode === "practice" && { backgroundColor: theme.surface, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
              ]}
            >
              <Ionicons name="trophy-outline" size={14} color={tabMode === "practice" ? MODE_COLOR : theme.textTertiary} />
              <Text style={[styles.tabBtnText, { color: tabMode === "practice" ? MODE_COLOR : theme.textTertiary, fontFamily: tabMode === "practice" ? "Inter_600SemiBold" : "Inter_400Regular" }]}>
                Practice MCQs
              </Text>
            </Pressable>
          </View>

          {tabMode === "practice" && (
            <View style={styles.practiceControls}>
              <Pressable
                onPress={() => setShowDomainPicker(true)}
                style={[styles.domainSelector, { backgroundColor: theme.surface, borderColor: theme.border }]}
              >
                <Ionicons name="filter-outline" size={14} color={MODE_COLOR} />
                <Text style={[styles.domainSelectorText, { color: theme.text }]} numberOfLines={1}>
                  {selectedDomain ?? "Random Domain"}
                </Text>
                <Ionicons name="chevron-down" size={14} color={theme.textTertiary} />
              </Pressable>
              {sessionScore.total > 0 && (
                <Pressable
                  onPress={handleResetSession}
                  style={[styles.resetBtn, { backgroundColor: `${MODE_COLOR}15`, borderColor: `${MODE_COLOR}30` }]}
                >
                  <Ionicons name="refresh-outline" size={14} color={MODE_COLOR} />
                  <Text style={[styles.resetBtnText, { color: MODE_COLOR }]}>Reset</Text>
                </Pressable>
              )}
            </View>
          )}
        </View>

        {tabMode === "study" ? (
          <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={[styles.scrollContent, { paddingBottom: Platform.OS === "web" ? 120 : 100 }]}
            >
              <Text style={[styles.heroSubtitle, { color: theme.textSecondary, fontFamily: "Inter_400Regular" }]}>
                ABFM-style vignettes, key pearls, and exam traps — grounded in indexed guidelines
              </Text>

              <View style={[styles.inputCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <TextInput
                  ref={inputRef}
                  style={[styles.input, { color: theme.text, fontFamily: "Inter_400Regular" }]}
                  placeholder="e.g. High-yield pearls for diabetes management on ABFM boards..."
                  placeholderTextColor={theme.textTertiary}
                  value={query}
                  onChangeText={setQuery}
                  multiline
                />
                <View style={styles.inputActions}>
                  <Pressable
                    onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setShowConditions(true); }}
                    style={({ pressed }) => [
                      styles.conditionsBtn,
                      { backgroundColor: `${MODE_COLOR}15`, borderColor: `${MODE_COLOR}30`, opacity: pressed ? 0.7 : 1 },
                    ]}
                  >
                    <Ionicons name="list-outline" size={16} color={MODE_COLOR} />
                    <Text style={[styles.conditionsBtnText, { color: MODE_COLOR }]}>Browse Conditions</Text>
                  </Pressable>
                  <Pressable
                    onPress={handleSubmit}
                    disabled={!query.trim()}
                    style={({ pressed }) => [
                      styles.sendBtn,
                      { backgroundColor: query.trim() ? MODE_COLOR : theme.border, opacity: pressed ? 0.8 : 1 },
                    ]}
                  >
                    <Ionicons name="arrow-up" size={18} color="#fff" />
                  </Pressable>
                </View>
              </View>

              <View style={styles.quickSection}>
                <Text style={[styles.sectionTitle, { color: theme.textTertiary }]}>STUDY TOPICS</Text>
                <View style={styles.quickGrid}>
                  {QUICK_PROMPTS.map((item, i) => (
                    <Pressable
                      key={i}
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        router.push({ pathname: "/response", params: { query: item.prompt, mode: MODE } });
                      }}
                      style={({ pressed }) => [
                        styles.quickItem,
                        { backgroundColor: theme.surface, borderColor: theme.border, opacity: pressed ? 0.7 : 1 },
                      ]}
                    >
                      <View style={[styles.quickIcon, { backgroundColor: `${MODE_COLOR}15` }]}>
                        <Ionicons name="school-outline" size={14} color={MODE_COLOR} />
                      </View>
                      <View style={styles.quickContent}>
                        <Text style={[styles.quickLabel, { color: MODE_COLOR, fontFamily: "Inter_600SemiBold" }]}>
                          {item.label}
                        </Text>
                        <Text style={[styles.quickText, { color: theme.textSecondary, fontFamily: "Inter_400Regular" }]} numberOfLines={2}>
                          {item.prompt}
                        </Text>
                      </View>
                      <Ionicons name="chevron-forward" size={16} color={theme.textTertiary} />
                    </Pressable>
                  ))}
                </View>
              </View>

              {recentForMode.length > 0 && (
                <View style={styles.recentSection}>
                  <Text style={[styles.sectionTitle, { color: theme.textTertiary }]}>RECENT</Text>
                  {recentForMode.map((h) => (
                    <Pressable
                      key={h.id}
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        router.push({ pathname: "/response", params: { query: h.query, mode: MODE, condition: h.condition, system: h.system } });
                      }}
                      style={({ pressed }) => [
                        styles.recentItem,
                        { backgroundColor: theme.surface, borderColor: theme.border, opacity: pressed ? 0.7 : 1 },
                      ]}
                    >
                      <View style={styles.recentContent}>
                        {h.condition && <Text style={[styles.recentCondition, { color: MODE_COLOR }]}>{h.condition}</Text>}
                        <Text style={[styles.recentQuery, { color: theme.text }]} numberOfLines={2}>{h.query}</Text>
                      </View>
                      <Ionicons name="chevron-forward" size={16} color={theme.textTertiary} />
                    </Pressable>
                  ))}
                </View>
              )}

              <Pressable
                onPress={handleSwitchToPractice}
                style={[styles.practicePromoBanner, { backgroundColor: `${MODE_COLOR}10`, borderColor: `${MODE_COLOR}30` }]}
              >
                <View style={[styles.practicePromoIcon, { backgroundColor: `${MODE_COLOR}15` }]}>
                  <Ionicons name="trophy" size={20} color={MODE_COLOR} />
                </View>
                <View style={styles.practicePromoContent}>
                  <Text style={[styles.practicePromoTitle, { color: MODE_COLOR, fontFamily: "Inter_600SemiBold" }]}>
                    Practice MCQ Mode
                  </Text>
                  <Text style={[styles.practicePromoText, { color: theme.textSecondary, fontFamily: "Inter_400Regular" }]}>
                    Interactive ABFM-style vignettes with instant feedback and explanation
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={MODE_COLOR} />
              </Pressable>
            </ScrollView>
          </KeyboardAvoidingView>
        ) : (
          <VignetteCard
            vignette={vignette}
            loading={vignetteLoading}
            error={vignetteError}
            sessionScore={sessionScore}
            onNext={handleNextVignette}
            onAnswer={handleAnswer}
            onSaveToFlashcard={handleSaveToFlashcard}
          />
        )}
      </View>

      <Modal visible={showConditions} animationType="slide" presentationStyle="pageSheet">
        <ConditionGrid mode={MODE} onSelect={handleConditionSelect} onClose={() => setShowConditions(false)} />
      </Modal>

      <Modal
        visible={showDomainPicker}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowDomainPicker(false)}
      >
        <View style={[styles.domainPickerContainer, { backgroundColor: theme.background }]}>
          <View style={[styles.domainPickerHeader, { borderBottomColor: theme.border }]}>
            <Text style={[styles.domainPickerTitle, { color: theme.text, fontFamily: "Inter_700Bold" }]}>
              Select Domain
            </Text>
            <Pressable onPress={() => setShowDomainPicker(false)} style={styles.domainPickerClose}>
              <Ionicons name="close" size={22} color={theme.textSecondary} />
            </Pressable>
          </View>
          <ScrollView contentContainerStyle={styles.domainPickerList}>
            <Pressable
              onPress={() => handleDomainSelect(null)}
              style={[
                styles.domainPickerItem,
                { backgroundColor: theme.surface, borderColor: selectedDomain === null ? MODE_COLOR : theme.border },
              ]}
            >
              <Ionicons name="shuffle-outline" size={18} color={selectedDomain === null ? MODE_COLOR : theme.textSecondary} />
              <View style={styles.domainPickerItemContent}>
                <Text style={[styles.domainPickerItemTitle, { color: selectedDomain === null ? MODE_COLOR : theme.text, fontFamily: selectedDomain === null ? "Inter_600SemiBold" : "Inter_400Regular" }]}>
                  Random (Weighted by ABFM Blueprint)
                </Text>
              </View>
              {selectedDomain === null && <Ionicons name="checkmark" size={16} color={MODE_COLOR} />}
            </Pressable>
            {ABFM_DOMAINS.map((domain) => (
              <Pressable
                key={domain}
                onPress={() => handleDomainSelect(domain)}
                style={[
                  styles.domainPickerItem,
                  { backgroundColor: theme.surface, borderColor: selectedDomain === domain ? MODE_COLOR : theme.border },
                ]}
              >
                <View style={styles.domainPickerItemContent}>
                  <Text style={[styles.domainPickerItemTitle, { color: selectedDomain === domain ? MODE_COLOR : theme.text, fontFamily: selectedDomain === domain ? "Inter_600SemiBold" : "Inter_400Regular" }]}>
                    {domain}
                  </Text>
                </View>
                {selectedDomain === domain && <Ionicons name="checkmark" size={16} color={MODE_COLOR} />}
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  screenHeader: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    gap: 12,
  },
  heroSection: { gap: 4 },
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
  tabToggle: {
    flexDirection: "row",
    borderRadius: 12,
    padding: 3,
    gap: 2,
  },
  tabBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 8,
    borderRadius: 10,
  },
  tabBtnText: { fontSize: 13 },
  practiceControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  domainSelector: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  domainSelectorText: { flex: 1, fontSize: 13, fontFamily: "Inter_400Regular" },
  resetBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  resetBtnText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  scrollContent: { paddingHorizontal: 20, paddingTop: 16, gap: 16 },
  inputCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  input: { minHeight: 80, maxHeight: 160, padding: 16, fontSize: 15, lineHeight: 22, textAlignVertical: "top" },
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
  sendBtn: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  quickSection: { gap: 10 },
  sectionTitle: { fontSize: 11, fontFamily: "Inter_600SemiBold", letterSpacing: 0.8 },
  quickGrid: { gap: 8 },
  quickItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  quickIcon: { width: 32, height: 32, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  quickContent: { flex: 1, gap: 2 },
  quickLabel: { fontSize: 13 },
  quickText: { fontSize: 12, lineHeight: 16 },
  recentSection: { gap: 8, marginTop: 4 },
  recentItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  recentContent: { flex: 1, gap: 2 },
  recentCondition: { fontSize: 12, fontFamily: "Inter_500Medium" },
  recentQuery: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 20 },
  practicePromoBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 4,
  },
  practicePromoIcon: { width: 40, height: 40, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  practicePromoContent: { flex: 1, gap: 2 },
  practicePromoTitle: { fontSize: 14 },
  practicePromoText: { fontSize: 12, lineHeight: 17 },
  domainPickerContainer: { flex: 1 },
  domainPickerHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    paddingTop: 56,
  },
  domainPickerTitle: { fontSize: 20 },
  domainPickerClose: { padding: 4 },
  domainPickerList: { paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
  domainPickerItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  domainPickerItemContent: { flex: 1 },
  domainPickerItemTitle: { fontSize: 14, lineHeight: 20 },
});
