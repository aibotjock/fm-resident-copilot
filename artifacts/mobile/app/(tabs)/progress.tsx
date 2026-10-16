import React, { useMemo, useState } from "react";
import {
  Alert,
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
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";
import { FlashcardView } from "@/components/FlashcardView";
import { useApp } from "@/context/AppContext";
import { ABFM_DOMAIN_WEIGHTS, ABFM_ITE_SECTIONS } from "@/types";
import type { SRSCard, SRSRating } from "@/types";

type ViewState = "overview" | "reviewing";
type ProgressTab = "coverage" | "ite" | "deck";

const DOMAIN_ORDER = [
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

const COVERAGE_GOAL = 5;

function coverageColor(count: number, isDark: boolean): string {
  if (count === 0) return isDark ? "#374151" : "#E5E7EB";
  if (count < 2) return isDark ? "#78350F" : "#FCD34D";
  if (count < COVERAGE_GOAL) return isDark ? "#065F46" : "#6EE7B7";
  return isDark ? "#059669" : "#10B981";
}

function coverageLabel(count: number): string {
  if (count === 0) return "Not started";
  if (count < 2) return "Introduced";
  if (count < COVERAGE_GOAL) return "In progress";
  return "Covered";
}

function iteColor(pct: number, isDark: boolean): string {
  if (pct < 33) return "#EF4444";
  if (pct < 50) return "#F59E0B";
  if (pct < 67) return "#3B82F6";
  return "#10B981";
}

export default function ProgressScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const {
    srsCards,
    getDueCards,
    updateSRSCard,
    clearSRSDeck,
    domainCoverage,
    vignettePerf,
    iteScores,
    saveITEScore,
    deleteITEScore,
  } = useApp();

  const [viewState, setViewState] = useState<ViewState>("overview");
  const [activeTab, setActiveTab] = useState<ProgressTab>("coverage");
  const [dueSnapshot, setDueSnapshot] = useState<SRSCard[]>([]);
  const [showITEModal, setShowITEModal] = useState(false);
  const [iteYear, setIteYear] = useState<1 | 2 | 3>(1);
  const [iteDateTaken, setIteDateTaken] = useState("");
  const [iteInputs, setIteInputs] = useState<Record<string, string>>({});

  const dueCards = getDueCards();
  const totalCards = srsCards.length;
  const masteredCards = srsCards.filter(
    (c) => c.repetitions >= 3 && c.interval >= 14
  ).length;
  const reviewedThisWeek = srsCards.filter((c) => {
    if (!c.lastReviewed) return false;
    return Date.now() - c.lastReviewed < 7 * 24 * 60 * 60 * 1000;
  }).length;

  const domainStats = useMemo(() => {
    return DOMAIN_ORDER.map((domain) => ({
      domain,
      weight: ABFM_DOMAIN_WEIGHTS[domain] ?? 0,
      queries: domainCoverage[domain] ?? 0,
      cards: srsCards.filter((c) => c.abfmDomain === domain).length,
      mastered: srsCards.filter(
        (c) =>
          c.abfmDomain === domain &&
          c.repetitions >= 3 &&
          c.interval >= 14
      ).length,
      mcqCorrect: vignettePerf[domain]?.correct ?? 0,
      mcqTotal: vignettePerf[domain]?.total ?? 0,
    }));
  }, [domainCoverage, srsCards, vignettePerf]);

  const coveredDomains = domainStats.filter((d) => d.queries >= COVERAGE_GOAL).length;
  const overallCoverage = Math.round((coveredDomains / DOMAIN_ORDER.length) * 100);

  const latestITE = useMemo(() => {
    if (iteScores.length === 0) return null;
    return [...iteScores].sort((a, b) => b.createdAt - a.createdAt)[0];
  }, [iteScores]);

  const priorityDomains = useMemo(() => {
    if (!latestITE) return domainStats.slice(0, 3).map((d) => d.domain);
    return ABFM_ITE_SECTIONS.filter((section) => {
      const score = latestITE.scores[section];
      return typeof score === "number" && score < 50;
    })
      .sort((a, b) => (latestITE.scores[a] ?? 100) - (latestITE.scores[b] ?? 100))
      .slice(0, 5);
  }, [latestITE, domainStats]);

  const handleStartReview = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setDueSnapshot(dueCards);
    setViewState("reviewing");
  };

  const handleRate = async (id: string, rating: SRSRating) => {
    await updateSRSCard(id, rating);
  };

  const handleClearDeck = () => {
    Alert.alert(
      "Clear Entire Deck",
      `This will permanently delete all ${totalCards} cards. This cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear Deck",
          style: "destructive",
          onPress: () => {
            clearSRSDeck();
            setViewState("overview");
          },
        },
      ]
    );
  };

  const handleSaveITE = async () => {
    const scores: Record<string, number> = {};
    let hasAny = false;
    for (const section of ABFM_ITE_SECTIONS) {
      const val = parseInt(iteInputs[section] ?? "", 10);
      if (!isNaN(val) && val >= 0 && val <= 99) {
        scores[section] = val;
        hasAny = true;
      }
    }
    if (!hasAny) {
      Alert.alert("No scores entered", "Please enter at least one section score.");
      return;
    }
    await saveITEScore({
      year: iteYear,
      takenDate: iteDateTaken || new Date().getFullYear().toString(),
      scores,
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setShowITEModal(false);
    setIteInputs({});
    setIteDateTaken("");
  };

  const handleDeleteITE = (id: string) => {
    Alert.alert("Delete ITE Score", "Remove this ITE score entry?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteITEScore(id),
      },
    ]);
  };

  const padTop = Platform.OS === "web" ? insets.top + 67 : insets.top + 16;
  const padBottom = Platform.OS === "web" ? 160 : 140;

  if (viewState === "reviewing") {
    if (dueSnapshot.length === 0) {
      return (
        <View
          style={[
            styles.container,
            { backgroundColor: theme.background, paddingTop: padTop },
          ]}
        >
          <View style={[styles.subHeader, { borderBottomColor: theme.border }]}>
            <Pressable
              onPress={() => setViewState("overview")}
              style={({ pressed }) => [
                styles.backBtn,
                { opacity: pressed ? 0.6 : 1 },
              ]}
            >
              <Ionicons name="chevron-back" size={22} color={theme.text} />
            </Pressable>
            <Text
              style={[
                styles.subHeaderTitle,
                { color: theme.text, fontFamily: "Inter_600SemiBold" },
              ]}
            >
              Review Session
            </Text>
            <View style={{ width: 36 }} />
          </View>
          <View style={styles.completeState}>
            <View
              style={[
                styles.completeIcon,
                { backgroundColor: `${Colors.boardPrep}15` },
              ]}
            >
              <Ionicons
                name="checkmark-circle"
                size={44}
                color={Colors.boardPrep}
              />
            </View>
            <Text
              style={[
                styles.completeTitle,
                { color: theme.text, fontFamily: "Inter_700Bold" },
              ]}
            >
              All done!
            </Text>
            <Text
              style={[
                styles.completeSubtitle,
                {
                  color: theme.textSecondary,
                  fontFamily: "Inter_400Regular",
                },
              ]}
            >
              No more cards due right now. Come back later to continue.
            </Text>
            <Pressable
              onPress={() => setViewState("overview")}
              style={[styles.doneBtn, { backgroundColor: Colors.boardPrep }]}
            >
              <Text style={styles.doneBtnText}>Back to Progress</Text>
            </Pressable>
          </View>
        </View>
      );
    }

    return (
      <View
        style={[
          styles.container,
          { backgroundColor: theme.background, paddingTop: padTop },
        ]}
      >
        <View style={[styles.subHeader, { borderBottomColor: theme.border }]}>
          <Pressable
            onPress={() => setViewState("overview")}
            style={({ pressed }) => [
              styles.backBtn,
              { opacity: pressed ? 0.6 : 1 },
            ]}
          >
            <Ionicons name="chevron-back" size={22} color={theme.text} />
          </Pressable>
          <Text
            style={[
              styles.subHeaderTitle,
              { color: theme.text, fontFamily: "Inter_600SemiBold" },
            ]}
          >
            Review · {dueSnapshot.length} card
            {dueSnapshot.length !== 1 ? "s" : ""}
          </Text>
          <View style={{ width: 36 }} />
        </View>
        <FlashcardView
          cards={dueSnapshot.map((c) => ({
            id: c.id,
            front: c.front,
            back: c.back,
            condition: c.condition,
            topic: c.topic,
          }))}
          onRate={handleRate}
          onSessionComplete={() => setViewState("overview")}
        />
      </View>
    );
  }

  return (
    <>
      <ScrollView
        style={[styles.container, { backgroundColor: theme.background }]}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: padTop, paddingBottom: padBottom },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroSection}>
          <View
            style={[
              styles.modeIndicator,
              {
                backgroundColor: `${Colors.boardPrep}15`,
                borderColor: `${Colors.boardPrep}30`,
              },
            ]}
          >
            <Ionicons name="stats-chart" size={13} color={Colors.boardPrep} />
            <Text
              style={[
                styles.modeLabel,
                {
                  color: Colors.boardPrep,
                  fontFamily: "Inter_600SemiBold",
                },
              ]}
            >
              Board Readiness
            </Text>
          </View>
          <Text
            style={[
              styles.heroTitle,
              { color: theme.text, fontFamily: "Inter_700Bold" },
            ]}
          >
            Study Progress
          </Text>
          <Text
            style={[
              styles.heroSubtitle,
              {
                color: theme.textSecondary,
                fontFamily: "Inter_400Regular",
              },
            ]}
          >
            ABFM blueprint coverage · ITE scores · Spaced repetition deck
          </Text>
        </View>

        {priorityDomains.length > 0 && (
          <View
            style={[
              styles.priorityCard,
              {
                backgroundColor: isDark ? "#1C0A00" : "#FFFBEB",
                borderColor: "#F59E0B30",
              },
            ]}
          >
            <View style={styles.priorityHeader}>
              <Ionicons name="flame" size={14} color="#F59E0B" />
              <Text
                style={[
                  styles.priorityTitle,
                  { color: "#F59E0B", fontFamily: "Inter_600SemiBold" },
                ]}
              >
                {latestITE
                  ? "PRIORITY — LOWEST ITE DOMAINS"
                  : "HIGHEST WEIGHT — START HERE"}
              </Text>
            </View>
            <View style={styles.priorityTags}>
              {priorityDomains.map((d) => (
                <View
                  key={d}
                  style={[
                    styles.priorityTag,
                    {
                      backgroundColor: isDark ? "#451A03" : "#FEF3C7",
                      borderColor: "#F59E0B40",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.priorityTagText,
                      { color: "#92400E", fontFamily: "Inter_500Medium" },
                    ]}
                  >
                    {d}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.tabRow}>
          {(["coverage", "ite", "deck"] as ProgressTab[]).map((tab) => (
            <Pressable
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={({ pressed }) => [
                styles.tab,
                {
                  backgroundColor:
                    activeTab === tab
                      ? Colors.boardPrep
                      : theme.surfaceSecondary,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  {
                    color:
                      activeTab === tab ? "#fff" : theme.textSecondary,
                    fontFamily:
                      activeTab === tab
                        ? "Inter_600SemiBold"
                        : "Inter_400Regular",
                  },
                ]}
              >
                {tab === "coverage"
                  ? "Blueprint"
                  : tab === "ite"
                  ? "ITE Scores"
                  : "SRS Deck"}
              </Text>
            </Pressable>
          ))}
        </View>

        {activeTab === "coverage" && (
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text
                style={[
                  styles.sectionTitle,
                  { color: theme.textTertiary },
                ]}
              >
                ABFM CONTENT BLUEPRINT COVERAGE
              </Text>
              <View
                style={[
                  styles.overallBadge,
                  { backgroundColor: `${Colors.boardPrep}15` },
                ]}
              >
                <Text
                  style={[
                    styles.overallPct,
                    {
                      color: Colors.boardPrep,
                      fontFamily: "Inter_700Bold",
                    },
                  ]}
                >
                  {overallCoverage}%
                </Text>
                <Text
                  style={[
                    styles.overallLabel,
                    {
                      color: Colors.boardPrep,
                      fontFamily: "Inter_400Regular",
                    },
                  ]}
                >
                  covered
                </Text>
              </View>
            </View>
            <Text
              style={[
                styles.coverageNote,
                { color: theme.textTertiary },
              ]}
            >
              A domain is "covered" after {COVERAGE_GOAL} queries. Categories and weights here are legacy study organization, not the current official ABFM exam blueprint.
            </Text>

            {domainStats.map((stat) => {
              const pct = Math.min(1, stat.queries / COVERAGE_GOAL);
              const barColor = coverageColor(stat.queries, isDark);
              return (
                <View
                  key={stat.domain}
                  style={[
                    styles.domainRow,
                    {
                      backgroundColor: theme.surface,
                      borderColor: theme.border,
                    },
                  ]}
                >
                  <View style={styles.domainMeta}>
                    <Text
                      style={[
                        styles.domainName,
                        {
                          color: theme.text,
                          fontFamily: "Inter_500Medium",
                        },
                      ]}
                    >
                      {stat.domain}
                    </Text>
                    <View style={styles.domainRight}>
                      <Text
                        style={[
                          styles.domainWeight,
                          { color: theme.textTertiary },
                        ]}
                      >
                        ~{stat.weight}%
                      </Text>
                      <Text
                        style={[
                          styles.domainStatus,
                          { color: barColor === "#E5E7EB" || barColor === "#374151" ? theme.textTertiary : barColor },
                        ]}
                      >
                        {coverageLabel(stat.queries)}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={[
                      styles.barTrack,
                      {
                        backgroundColor: isDark ? "#1E293B" : "#F1F5F9",
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.barFill,
                        {
                          width: `${Math.round(pct * 100)}%` as any,
                          backgroundColor:
                            pct >= 1
                              ? Colors.boardPrep
                              : pct > 0
                              ? "#F59E0B"
                              : "transparent",
                        },
                      ]}
                    />
                  </View>
                  {(stat.cards > 0 || stat.mcqTotal > 0) && (
                    <View style={styles.domainFooter}>
                      {stat.cards > 0 && (
                        <Text style={[styles.domainCardCount, { color: Colors.flashcards }]}>
                          {stat.cards} card{stat.cards !== 1 ? "s" : ""}
                          {stat.mastered > 0 ? ` · ${stat.mastered} mastered` : ""}
                        </Text>
                      )}
                      {stat.mcqTotal > 0 && (
                        <Text style={[styles.domainMCQScore, {
                          color: stat.mcqTotal > 0 && (stat.mcqCorrect / stat.mcqTotal) >= 0.67
                            ? "#10B981"
                            : stat.mcqTotal > 0 && (stat.mcqCorrect / stat.mcqTotal) >= 0.5
                            ? "#F59E0B"
                            : "#EF4444",
                        }]}>
                          MCQ {stat.mcqCorrect}/{stat.mcqTotal} ({Math.round((stat.mcqCorrect / stat.mcqTotal) * 100)}%)
                        </Text>
                      )}
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        )}

        {activeTab === "ite" && (
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text
                style={[styles.sectionTitle, { color: theme.textTertiary }]}
              >
                ITE SCORE HISTORY
              </Text>
              <Pressable
                onPress={() => setShowITEModal(true)}
                style={({ pressed }) => [
                  styles.addITEBtn,
                  {
                    backgroundColor: Colors.boardPrep,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <Ionicons name="add" size={16} color="#fff" />
                <Text
                  style={[
                    styles.addITEText,
                    { fontFamily: "Inter_600SemiBold" },
                  ]}
                >
                  Add ITE Scores
                </Text>
              </Pressable>
            </View>

            <Text
              style={[styles.coverageNote, { color: theme.textTertiary }]}
            >
              Enter your ABFM ITE section percentile scores exactly as reported on your official score report. Scores are stored locally only.
            </Text>

            {iteScores.length === 0 ? (
              <View
                style={[
                  styles.emptyState,
                  {
                    backgroundColor: theme.surface,
                    borderColor: theme.border,
                  },
                ]}
              >
                <Ionicons
                  name="clipboard-outline"
                  size={32}
                  color={theme.textTertiary}
                />
                <Text
                  style={[
                    styles.emptyTitle,
                    {
                      color: theme.text,
                      fontFamily: "Inter_600SemiBold",
                    },
                  ]}
                >
                  No ITE scores entered
                </Text>
                <Text
                  style={[
                    styles.emptySubtitle,
                    {
                      color: theme.textSecondary,
                      fontFamily: "Inter_400Regular",
                    },
                  ]}
                >
                  Enter your official ABFM ITE section percentile scores to receive a prioritized study plan based on your weakest domains.
                </Text>
              </View>
            ) : (
              [...iteScores]
                .sort((a, b) => b.createdAt - a.createdAt)
                .map((ite) => (
                  <View
                    key={ite.id}
                    style={[
                      styles.iteCard,
                      {
                        backgroundColor: theme.surface,
                        borderColor: theme.border,
                      },
                    ]}
                  >
                    <View style={styles.iteCardHeader}>
                      <View>
                        <Text
                          style={[
                            styles.iteCardTitle,
                            {
                              color: theme.text,
                              fontFamily: "Inter_700Bold",
                            },
                          ]}
                        >
                          ITE Year {ite.year}
                        </Text>
                        <Text
                          style={[
                            styles.iteCardDate,
                            {
                              color: theme.textTertiary,
                              fontFamily: "Inter_400Regular",
                            },
                          ]}
                        >
                          {ite.takenDate}
                        </Text>
                      </View>
                      <Pressable
                        onPress={() => handleDeleteITE(ite.id)}
                        style={({ pressed }) => ({
                          opacity: pressed ? 0.5 : 0.7,
                        })}
                      >
                        <Ionicons
                          name="trash-outline"
                          size={16}
                          color={theme.textTertiary}
                        />
                      </Pressable>
                    </View>
                    {ABFM_ITE_SECTIONS.filter(
                      (s) => typeof ite.scores[s] === "number"
                    ).map((section) => {
                      const pct = ite.scores[section];
                      const color = iteColor(pct, isDark);
                      return (
                        <View key={section} style={styles.iteScoreRow}>
                          <Text
                            style={[
                              styles.iteSectionName,
                              {
                                color: theme.text,
                                fontFamily: "Inter_400Regular",
                              },
                            ]}
                            numberOfLines={1}
                          >
                            {section}
                          </Text>
                          <View style={styles.iteScoreRight}>
                            <View
                              style={[
                                styles.iteBarTrack,
                                {
                                  backgroundColor: isDark
                                    ? "#1E293B"
                                    : "#F1F5F9",
                                },
                              ]}
                            >
                              <View
                                style={[
                                  styles.iteBarFill,
                                  {
                                    width: `${pct}%` as any,
                                    backgroundColor: color,
                                  },
                                ]}
                              />
                            </View>
                            <Text
                              style={[
                                styles.iteScoreNum,
                                {
                                  color,
                                  fontFamily: "Inter_600SemiBold",
                                },
                              ]}
                            >
                              {pct}th
                            </Text>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                ))
            )}
          </View>
        )}

        {activeTab === "deck" && (
          <View style={styles.section}>
            <View style={styles.statsRow}>
              {[
                {
                  num: totalCards,
                  label: "Total Cards",
                  color: theme.text,
                  bg: theme.surface,
                  border: theme.border,
                },
                {
                  num: dueCards.length,
                  label: "Due Now",
                  color:
                    dueCards.length > 0 ? Colors.flashcards : theme.text,
                  bg:
                    dueCards.length > 0
                      ? `${Colors.flashcards}12`
                      : theme.surface,
                  border:
                    dueCards.length > 0
                      ? `${Colors.flashcards}40`
                      : theme.border,
                },
                {
                  num: masteredCards,
                  label: "Mastered",
                  color: Colors.boardPrep,
                  bg: theme.surface,
                  border: theme.border,
                },
                {
                  num: reviewedThisWeek,
                  label: "This Week",
                  color: theme.text,
                  bg: theme.surface,
                  border: theme.border,
                },
              ].map((s) => (
                <View
                  key={s.label}
                  style={[
                    styles.statCard,
                    {
                      backgroundColor: s.bg,
                      borderColor: s.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.statNum,
                      {
                        color: s.color,
                        fontFamily: "Inter_700Bold",
                      },
                    ]}
                  >
                    {s.num}
                  </Text>
                  <Text
                    style={[
                      styles.statLabel,
                      { color: theme.textTertiary },
                    ]}
                  >
                    {s.label}
                  </Text>
                </View>
              ))}
            </View>

            {totalCards === 0 ? (
              <View
                style={[
                  styles.emptyState,
                  {
                    backgroundColor: theme.surface,
                    borderColor: theme.border,
                  },
                ]}
              >
                <Ionicons
                  name="layers-outline"
                  size={32}
                  color={theme.textTertiary}
                />
                <Text
                  style={[
                    styles.emptyTitle,
                    {
                      color: theme.text,
                      fontFamily: "Inter_600SemiBold",
                    },
                  ]}
                >
                  Your deck is empty
                </Text>
                <Text
                  style={[
                    styles.emptySubtitle,
                    {
                      color: theme.textSecondary,
                      fontFamily: "Inter_400Regular",
                    },
                  ]}
                >
                  Generate flashcards in Clinical mode, then tap "Save to Deck" to add them here for spaced repetition review.
                </Text>
              </View>
            ) : (
              <>
                {dueCards.length > 0 && (
                  <Pressable
                    onPress={handleStartReview}
                    style={({ pressed }) => [
                      styles.reviewCTA,
                      {
                        backgroundColor: Colors.flashcards,
                        opacity: pressed ? 0.9 : 1,
                      },
                    ]}
                  >
                    <View style={styles.reviewCTALeft}>
                      <Ionicons name="play-circle" size={24} color="#fff" />
                      <View>
                        <Text
                          style={[
                            styles.reviewCTATitle,
                            { fontFamily: "Inter_700Bold" },
                          ]}
                        >
                          Start Review
                        </Text>
                        <Text
                          style={[
                            styles.reviewCTASubtitle,
                            { fontFamily: "Inter_400Regular" },
                          ]}
                        >
                          {dueCards.length} card
                          {dueCards.length !== 1 ? "s" : ""} due now
                        </Text>
                      </View>
                    </View>
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color="rgba(255,255,255,0.7)"
                    />
                  </Pressable>
                )}

                {dueCards.length === 0 && totalCards > 0 && (
                  <View
                    style={[
                      styles.allCaughtUp,
                      {
                        backgroundColor: `${Colors.boardPrep}10`,
                        borderColor: `${Colors.boardPrep}30`,
                      },
                    ]}
                  >
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color={Colors.boardPrep}
                    />
                    <Text
                      style={[
                        styles.allCaughtUpText,
                        {
                          color: Colors.boardPrep,
                          fontFamily: "Inter_500Medium",
                        },
                      ]}
                    >
                      All caught up! Check back later.
                    </Text>
                  </View>
                )}

                <Pressable
                  onPress={handleClearDeck}
                  style={({ pressed }) => [
                    styles.clearBtn,
                    {
                      borderColor: theme.border,
                      opacity: pressed ? 0.6 : 0.5,
                    },
                  ]}
                >
                  <Ionicons
                    name="trash-outline"
                    size={14}
                    color={theme.textTertiary}
                  />
                  <Text
                    style={[
                      styles.clearBtnText,
                      { color: theme.textTertiary },
                    ]}
                  >
                    Clear Entire Deck
                  </Text>
                </Pressable>
              </>
            )}
          </View>
        )}
      </ScrollView>

      <Modal
        visible={showITEModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowITEModal(false)}
      >
        <KeyboardAvoidingView
          style={[
            styles.modalContainer,
            { backgroundColor: theme.background },
          ]}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View
            style={[
              styles.modalHeader,
              { borderBottomColor: theme.border },
            ]}
          >
            <Pressable
              onPress={() => setShowITEModal(false)}
              style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
            >
              <Text
                style={[
                  styles.modalCancel,
                  { color: theme.textSecondary },
                ]}
              >
                Cancel
              </Text>
            </Pressable>
            <Text
              style={[
                styles.modalTitle,
                { color: theme.text, fontFamily: "Inter_700Bold" },
              ]}
            >
              Enter ITE Scores
            </Text>
            <Pressable
              onPress={handleSaveITE}
              style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
            >
              <Text
                style={[
                  styles.modalSave,
                  {
                    color: Colors.boardPrep,
                    fontFamily: "Inter_600SemiBold",
                  },
                ]}
              >
                Save
              </Text>
            </Pressable>
          </View>

          <ScrollView
            contentContainerStyle={styles.modalScroll}
            showsVerticalScrollIndicator={false}
          >
            <Text
              style={[
                styles.modalInstruction,
                {
                  color: theme.textSecondary,
                  fontFamily: "Inter_400Regular",
                },
              ]}
            >
              Enter section percentile scores exactly as reported on your official ABFM ITE score report (0–99th percentile).
            </Text>

            <View style={styles.modalField}>
              <Text
                style={[
                  styles.modalLabel,
                  { color: theme.textTertiary },
                ]}
              >
                ITE YEAR
              </Text>
              <View style={styles.yearRow}>
                {([1, 2, 3] as const).map((y) => (
                  <Pressable
                    key={y}
                    onPress={() => setIteYear(y)}
                    style={[
                      styles.yearBtn,
                      {
                        backgroundColor:
                          iteYear === y
                            ? Colors.boardPrep
                            : theme.surfaceSecondary,
                        borderColor:
                          iteYear === y
                            ? Colors.boardPrep
                            : theme.border,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.yearBtnText,
                        {
                          color: iteYear === y ? "#fff" : theme.text,
                          fontFamily:
                            iteYear === y
                              ? "Inter_600SemiBold"
                              : "Inter_400Regular",
                        },
                      ]}
                    >
                      Year {y}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.modalField}>
              <Text
                style={[
                  styles.modalLabel,
                  { color: theme.textTertiary },
                ]}
              >
                YEAR TAKEN (e.g. 2024)
              </Text>
              <TextInput
                style={[
                  styles.modalInput,
                  {
                    backgroundColor: theme.surfaceSecondary,
                    color: theme.text,
                    borderColor: theme.border,
                  },
                ]}
                placeholder="e.g. 2024"
                placeholderTextColor={theme.textTertiary}
                value={iteDateTaken}
                onChangeText={setIteDateTaken}
                keyboardType="numeric"
                maxLength={4}
              />
            </View>

            <Text
              style={[styles.modalLabel, { color: theme.textTertiary }]}
            >
              SECTION PERCENTILE SCORES (0–99)
            </Text>

            {ABFM_ITE_SECTIONS.map((section) => (
              <View key={section} style={styles.scoreField}>
                <Text
                  style={[
                    styles.scoreSectionName,
                    { color: theme.text, fontFamily: "Inter_400Regular" },
                  ]}
                  numberOfLines={2}
                >
                  {section}
                </Text>
                <TextInput
                  style={[
                    styles.scoreInput,
                    {
                      backgroundColor: theme.surfaceSecondary,
                      color: theme.text,
                      borderColor: theme.border,
                    },
                  ]}
                  placeholder="—"
                  placeholderTextColor={theme.textTertiary}
                  value={iteInputs[section] ?? ""}
                  onChangeText={(val) =>
                    setIteInputs((prev) => ({ ...prev, [section]: val }))
                  }
                  keyboardType="numeric"
                  maxLength={2}
                />
              </View>
            ))}
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, gap: 16 },
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
    marginBottom: 2,
  },
  modeLabel: { fontSize: 12, letterSpacing: 0.3 },
  heroTitle: { fontSize: 28 },
  heroSubtitle: { fontSize: 14, lineHeight: 20 },
  priorityCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    gap: 8,
  },
  priorityHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  priorityTitle: { fontSize: 10, letterSpacing: 0.6 },
  priorityTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  priorityTag: {
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  priorityTagText: { fontSize: 12 },
  tabRow: {
    flexDirection: "row",
    gap: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: "center",
  },
  tabText: { fontSize: 13 },
  section: { gap: 10 },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.8,
  },
  overallBadge: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 3,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  overallPct: { fontSize: 16 },
  overallLabel: { fontSize: 11 },
  coverageNote: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    lineHeight: 16,
  },
  domainRow: {
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 6,
  },
  domainMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  domainName: { fontSize: 13, flex: 1 },
  domainRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  domainWeight: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
  },
  domainStatus: { fontSize: 10, fontFamily: "Inter_500Medium" },
  barTrack: {
    height: 5,
    borderRadius: 3,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 3,
    minWidth: 3,
  },
  domainCardCount: {
    fontSize: 10,
    fontFamily: "Inter_400Regular",
  },
  domainFooter: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    alignItems: "center",
  },
  domainMCQScore: {
    fontSize: 10,
    fontFamily: "Inter_600SemiBold",
  },
  statsRow: { flexDirection: "row", gap: 8 },
  statCard: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    alignItems: "center",
    gap: 2,
  },
  statNum: { fontSize: 22 },
  statLabel: {
    fontSize: 10,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
  emptyState: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 28,
    alignItems: "center",
    gap: 12,
  },
  emptyTitle: { fontSize: 18 },
  emptySubtitle: { fontSize: 14, lineHeight: 21, textAlign: "center" },
  reviewCTA: {
    borderRadius: 16,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  reviewCTALeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  reviewCTATitle: { color: "#fff", fontSize: 17 },
  reviewCTASubtitle: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 13,
    marginTop: 1,
  },
  allCaughtUp: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
  },
  allCaughtUpText: { fontSize: 14 },
  clearBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 4,
  },
  clearBtnText: { fontSize: 13, fontFamily: "Inter_400Regular" },
  addITEBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  addITEText: { color: "#fff", fontSize: 13 },
  iteCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    gap: 8,
  },
  iteCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  iteCardTitle: { fontSize: 16 },
  iteCardDate: { fontSize: 12, marginTop: 1 },
  iteScoreRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iteSectionName: { fontSize: 12, flex: 1 },
  iteScoreRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    width: 120,
  },
  iteBarTrack: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  iteBarFill: {
    height: "100%",
    borderRadius: 2,
    minWidth: 2,
  },
  iteScoreNum: { fontSize: 11, minWidth: 28, textAlign: "right" },
  subHeader: {
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
  subHeaderTitle: { flex: 1, fontSize: 16, textAlign: "center" },
  completeState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    gap: 16,
  },
  completeIcon: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  completeTitle: { fontSize: 26 },
  completeSubtitle: { fontSize: 15, lineHeight: 22, textAlign: "center" },
  doneBtn: {
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 8,
  },
  doneBtnText: { color: "#fff", fontSize: 16, fontFamily: "Inter_600SemiBold" },
  modalContainer: { flex: 1 },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  modalTitle: { fontSize: 17 },
  modalCancel: { fontSize: 16, fontFamily: "Inter_400Regular" },
  modalSave: { fontSize: 16 },
  modalScroll: { padding: 20, gap: 14 },
  modalInstruction: { fontSize: 13, lineHeight: 19 },
  modalField: { gap: 6 },
  modalLabel: {
    fontSize: 10,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.8,
  },
  modalInput: {
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
  },
  yearRow: { flexDirection: "row", gap: 8 },
  yearBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
  },
  yearBtnText: { fontSize: 14 },
  scoreField: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 4,
  },
  scoreSectionName: { flex: 1, fontSize: 13, lineHeight: 18 },
  scoreInput: {
    width: 56,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
});
