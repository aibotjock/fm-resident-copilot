import React, { useMemo, useState } from "react";
import {
  Alert,
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
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";
import { FlashcardView } from "@/components/FlashcardView";
import { useApp } from "@/context/AppContext";
import type { SRSCard, SRSRating } from "@/types";

type ViewState = "overview" | "reviewing";

export default function ProgressScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const { srsCards, getDueCards, updateSRSCard, clearSRSDeck } = useApp();
  const [viewState, setViewState] = useState<ViewState>("overview");
  const [dueSnapshot, setDueSnapshot] = useState<SRSCard[]>([]);

  const dueCards = getDueCards();
  const totalCards = srsCards.length;
  const masteredCards = srsCards.filter((c) => c.repetitions >= 3 && c.interval >= 14).length;

  const reviewedThisWeek = srsCards.filter((c) => {
    if (!c.lastReviewed) return false;
    return Date.now() - c.lastReviewed < 7 * 24 * 60 * 60 * 1000;
  }).length;

  const topicGroups = useMemo(() => {
    const groups: Record<string, { count: number; dueCount: number; lastReviewed?: number }> = {};
    const now = Date.now();
    for (const card of srsCards) {
      const topic = card.topic || "General";
      if (!groups[topic]) groups[topic] = { count: 0, dueCount: 0 };
      groups[topic].count++;
      if (card.dueDate <= now) groups[topic].dueCount++;
      if (card.lastReviewed) {
        if (!groups[topic].lastReviewed || card.lastReviewed > groups[topic].lastReviewed!) {
          groups[topic].lastReviewed = card.lastReviewed;
        }
      }
    }
    return Object.entries(groups).sort((a, b) => b[1].dueCount - a[1].dueCount || b[1].count - a[1].count);
  }, [srsCards]);

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

  const formatRelativeTime = (ts?: number) => {
    if (!ts) return "Never";
    const diff = Date.now() - ts;
    if (diff < 60000) return "Just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
  };

  const padTop =
    Platform.OS === "web" ? insets.top + 67 : insets.top + 16;
  const padBottom = Platform.OS === "web" ? 160 : 140;

  if (viewState === "reviewing") {
    if (dueSnapshot.length === 0) {
      return (
        <View style={[styles.container, { backgroundColor: theme.background, paddingTop: padTop }]}>
          <View style={[styles.reviewHeader, { borderBottomColor: theme.border }]}>
            <Pressable
              onPress={() => setViewState("overview")}
              style={({ pressed }) => [styles.backBtn, { opacity: pressed ? 0.6 : 1 }]}
            >
              <Ionicons name="chevron-back" size={22} color={theme.text} />
            </Pressable>
            <Text style={[styles.reviewHeaderTitle, { color: theme.text, fontFamily: "Inter_600SemiBold" }]}>
              Review Session
            </Text>
            <View style={{ width: 36 }} />
          </View>
          <View style={styles.completeState}>
            <View style={[styles.completeIcon, { backgroundColor: `${Colors.boardPrep}15` }]}>
              <Ionicons name="checkmark-circle" size={44} color={Colors.boardPrep} />
            </View>
            <Text style={[styles.completeTitle, { color: theme.text, fontFamily: "Inter_700Bold" }]}>
              All done!
            </Text>
            <Text style={[styles.completeSubtitle, { color: theme.textSecondary, fontFamily: "Inter_400Regular" }]}>
              No more cards due right now. Come back later to continue your review.
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
      <View style={[styles.container, { backgroundColor: theme.background, paddingTop: padTop }]}>
        <View style={[styles.reviewHeader, { borderBottomColor: theme.border }]}>
          <Pressable
            onPress={() => setViewState("overview")}
            style={({ pressed }) => [styles.backBtn, { opacity: pressed ? 0.6 : 1 }]}
          >
            <Ionicons name="chevron-back" size={22} color={theme.text} />
          </Pressable>
          <Text style={[styles.reviewHeaderTitle, { color: theme.text, fontFamily: "Inter_600SemiBold" }]}>
            Review · {dueSnapshot.length} card{dueSnapshot.length !== 1 ? "s" : ""}
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
              { color: Colors.boardPrep, fontFamily: "Inter_600SemiBold" },
            ]}
          >
            SRS Progress
          </Text>
        </View>
        <Text style={[styles.heroTitle, { color: theme.text, fontFamily: "Inter_700Bold" }]}>
          Study Deck
        </Text>
        <Text style={[styles.heroSubtitle, { color: theme.textSecondary, fontFamily: "Inter_400Regular" }]}>
          Spaced repetition — cards resurface when you're about to forget them
        </Text>
      </View>

      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.statNum, { color: theme.text, fontFamily: "Inter_700Bold" }]}>
            {totalCards}
          </Text>
          <Text style={[styles.statLabel, { color: theme.textTertiary }]}>Total Cards</Text>
        </View>
        <View
          style={[
            styles.statCard,
            {
              backgroundColor: dueCards.length > 0 ? `${Colors.flashcards}12` : theme.surface,
              borderColor: dueCards.length > 0 ? `${Colors.flashcards}40` : theme.border,
            },
          ]}
        >
          <Text
            style={[
              styles.statNum,
              {
                color: dueCards.length > 0 ? Colors.flashcards : theme.text,
                fontFamily: "Inter_700Bold",
              },
            ]}
          >
            {dueCards.length}
          </Text>
          <Text style={[styles.statLabel, { color: theme.textTertiary }]}>Due Now</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.statNum, { color: Colors.boardPrep, fontFamily: "Inter_700Bold" }]}>
            {masteredCards}
          </Text>
          <Text style={[styles.statLabel, { color: theme.textTertiary }]}>Mastered</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.statNum, { color: theme.text, fontFamily: "Inter_700Bold" }]}>
            {reviewedThisWeek}
          </Text>
          <Text style={[styles.statLabel, { color: theme.textTertiary }]}>This Week</Text>
        </View>
      </View>

      {totalCards === 0 ? (
        <View style={[styles.emptyState, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Ionicons name="layers-outline" size={32} color={theme.textTertiary} />
          <Text style={[styles.emptyTitle, { color: theme.text, fontFamily: "Inter_600SemiBold" }]}>
            Your deck is empty
          </Text>
          <Text style={[styles.emptySubtitle, { color: theme.textSecondary, fontFamily: "Inter_400Regular" }]}>
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
                { backgroundColor: Colors.flashcards, opacity: pressed ? 0.9 : 1 },
              ]}
            >
              <View style={styles.reviewCTALeft}>
                <Ionicons name="play-circle" size={24} color="#fff" />
                <View>
                  <Text style={[styles.reviewCTATitle, { fontFamily: "Inter_700Bold" }]}>
                    Start Review
                  </Text>
                  <Text style={[styles.reviewCTASubtitle, { fontFamily: "Inter_400Regular" }]}>
                    {dueCards.length} card{dueCards.length !== 1 ? "s" : ""} due now
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.7)" />
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
              <Ionicons name="checkmark-circle" size={20} color={Colors.boardPrep} />
              <Text style={[styles.allCaughtUpText, { color: Colors.boardPrep, fontFamily: "Inter_500Medium" }]}>
                All caught up! Check back later for more reviews.
              </Text>
            </View>
          )}

          {topicGroups.length > 0 && (
            <View style={styles.topicsSection}>
              <Text style={[styles.sectionTitle, { color: theme.textTertiary }]}>
                TOPICS IN DECK
              </Text>
              {topicGroups.map(([topic, info]) => (
                <View
                  key={topic}
                  style={[
                    styles.topicRow,
                    { backgroundColor: theme.surface, borderColor: theme.border },
                  ]}
                >
                  <View
                    style={[
                      styles.topicIcon,
                      { backgroundColor: `${Colors.flashcards}12` },
                    ]}
                  >
                    <Ionicons name="layers-outline" size={16} color={Colors.flashcards} />
                  </View>
                  <View style={styles.topicInfo}>
                    <Text style={[styles.topicName, { color: theme.text, fontFamily: "Inter_500Medium" }]}>
                      {topic}
                    </Text>
                    <Text style={[styles.topicMeta, { color: theme.textTertiary }]}>
                      {info.count} card{info.count !== 1 ? "s" : ""} · Last reviewed {formatRelativeTime(info.lastReviewed)}
                    </Text>
                  </View>
                  {info.dueCount > 0 && (
                    <View style={[styles.dueBadge, { backgroundColor: Colors.flashcards }]}>
                      <Text style={styles.dueBadgeText}>{info.dueCount} due</Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}

          <Pressable
            onPress={handleClearDeck}
            style={({ pressed }) => [
              styles.clearBtn,
              { borderColor: theme.border, opacity: pressed ? 0.6 : 0.5 },
            ]}
          >
            <Ionicons name="trash-outline" size={14} color={theme.textTertiary} />
            <Text style={[styles.clearBtnText, { color: theme.textTertiary }]}>
              Clear Entire Deck
            </Text>
          </Pressable>
        </>
      )}
    </ScrollView>
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
  heroSubtitle: { fontSize: 15, lineHeight: 22 },
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
  statLabel: { fontSize: 10, fontFamily: "Inter_400Regular", textAlign: "center" },
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
  reviewCTASubtitle: { color: "rgba(255,255,255,0.8)", fontSize: 13, marginTop: 1 },
  allCaughtUp: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
  },
  allCaughtUpText: { fontSize: 14 },
  topicsSection: { gap: 8 },
  sectionTitle: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.8,
  },
  topicRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    gap: 10,
  },
  topicIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  topicInfo: { flex: 1, gap: 2 },
  topicName: { fontSize: 14 },
  topicMeta: { fontSize: 11, fontFamily: "Inter_400Regular" },
  dueBadge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  dueBadgeText: {
    color: "#fff",
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
  },
  clearBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 8,
  },
  clearBtnText: { fontSize: 13, fontFamily: "Inter_400Regular" },
  reviewHeader: {
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
  reviewHeaderTitle: { flex: 1, fontSize: 16, textAlign: "center" },
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
  doneBtnText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
  },
});
