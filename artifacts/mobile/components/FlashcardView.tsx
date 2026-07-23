import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  PanResponder,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";
import type { SRSRating } from "@/types";

interface FlashcardData {
  id?: string;
  front: string;
  back: string;
  condition?: string;
  topic?: string;
}

interface FlashcardViewProps {
  cards: FlashcardData[];
  onRate?: (id: string, rating: SRSRating) => Promise<void>;
  onSessionComplete?: () => void;
}

const RATING_CONFIG = [
  {
    rating: 0 as SRSRating,
    label: "Again",
    desc: "< 1 day",
    icon: "refresh-outline",
    color: "#EF4444",
    bg: "#FEF2F2",
    darkBg: "#2D1515",
  },
  {
    rating: 1 as SRSRating,
    label: "Hard",
    desc: "< 3 days",
    icon: "arrow-up-outline",
    color: "#F59E0B",
    bg: "#FFFBEB",
    darkBg: "#2D2410",
  },
  {
    rating: 3 as SRSRating,
    label: "Good",
    desc: "6+ days",
    icon: "checkmark-outline",
    color: "#10B981",
    bg: "#ECFDF5",
    darkBg: "#0D2419",
  },
  {
    rating: 4 as SRSRating,
    label: "Easy",
    desc: "2+ weeks",
    icon: "flash-outline",
    color: "#3B82F6",
    bg: "#EFF6FF",
    darkBg: "#0D1A2D",
  },
];

const SWIPE_THRESHOLD = 80;

export function FlashcardView({
  cards,
  onRate,
  onSessionComplete,
}: FlashcardViewProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? Colors.dark : Colors.light;
  const isSRSMode = !!onRate;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [isRating, setIsRating] = useState(false);

  const flipAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const swipeAnim = useRef(new Animated.Value(0)).current;
  const useNative = Platform.OS !== "web";

  const remainingCards = isSRSMode
    ? cards.filter((c) => !completedIds.has(c.id ?? ""))
    : cards;

  const card = remainingCards[currentIndex] ?? null;
  const totalRemaining = remainingCards.length;

  useEffect(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
    flipAnim.setValue(0);
    scaleAnim.setValue(1);
    swipeAnim.setValue(0);
  }, [cards]);

  useEffect(() => {
    if (
      isSRSMode &&
      totalRemaining === 0 &&
      cards.length > 0 &&
      completedIds.size > 0
    ) {
      setTimeout(() => {
        onSessionComplete?.();
      }, 600);
    }
  }, [totalRemaining, completedIds.size, isSRSMode]);

  const doFlip = useCallback(
    (toFlipped: boolean) => {
      const toValue = toFlipped ? 180 : 0;
      Animated.parallel([
        Animated.spring(flipAnim, {
          toValue,
          friction: 8,
          tension: 10,
          useNativeDriver: useNative,
        }),
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 0.96,
            duration: 100,
            useNativeDriver: useNative,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 100,
            useNativeDriver: useNative,
          }),
        ]),
      ]).start();
      setIsFlipped(toFlipped);
    },
    [flipAnim, scaleAnim, useNative]
  );

  const handleFlip = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    doFlip(!isFlipped);
  }, [isFlipped, doFlip]);

  const goToCard = useCallback(
    (index: number, flip: boolean = false) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      flipAnim.setValue(0);
      scaleAnim.setValue(1);
      swipeAnim.setValue(0);
      setIsFlipped(flip);
      setCurrentIndex(index);
    },
    [flipAnim, scaleAnim, swipeAnim]
  );

  const handleRate = useCallback(
    async (rating: SRSRating) => {
      if (!card || !card.id || isRating) return;
      setIsRating(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      Animated.timing(swipeAnim, {
        toValue: rating >= 3 ? 300 : -300,
        duration: 220,
        useNativeDriver: useNative,
      }).start(async () => {
        await onRate!(card.id!, rating);
        setCompletedIds((prev) => new Set([...prev, card.id!]));
        const newRemaining = remainingCards.filter((c) => c.id !== card.id);
        const nextIdx = Math.min(currentIndex, newRemaining.length - 1);
        swipeAnim.setValue(0);
        flipAnim.setValue(0);
        setIsFlipped(false);
        setCurrentIndex(Math.max(0, nextIdx));
        setIsRating(false);
      });
    },
    [card, isRating, onRate, remainingCards, currentIndex, swipeAnim, flipAnim, useNative]
  );

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dx) > 10 && Math.abs(gestureState.dy) < 30,
      onPanResponderMove: (_, gestureState) => {
        swipeAnim.setValue(gestureState.dx);
      },
      onPanResponderRelease: (_, gestureState) => {
        const { dx } = gestureState;
        if (!isSRSMode) {
          if (dx < -SWIPE_THRESHOLD) {
            const idx = Math.min(currentIndex + 1, remainingCards.length - 1);
            if (idx !== currentIndex) goToCard(idx);
            else {
              Animated.spring(swipeAnim, {
                toValue: 0,
                useNativeDriver: useNative,
              }).start();
            }
          } else if (dx > SWIPE_THRESHOLD) {
            const idx = Math.max(currentIndex - 1, 0);
            if (idx !== currentIndex) goToCard(idx);
            else {
              Animated.spring(swipeAnim, {
                toValue: 0,
                useNativeDriver: useNative,
              }).start();
            }
          } else {
            Animated.spring(swipeAnim, {
              toValue: 0,
              useNativeDriver: useNative,
            }).start();
          }
        } else {
          Animated.spring(swipeAnim, {
            toValue: 0,
            useNativeDriver: useNative,
          }).start();
        }
      },
    })
  ).current;

  if (!cards.length || !card) return null;

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ["0deg", "180deg"],
  });
  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ["180deg", "360deg"],
  });

  const cardRotation = swipeAnim.interpolate({
    inputRange: [-200, 0, 200],
    outputRange: ["-6deg", "0deg", "6deg"],
    extrapolate: "clamp",
  });

  return (
    <View style={styles.container}>
      {isSRSMode ? (
        <View style={styles.srsHeader}>
          <Text style={[styles.counter, { color: theme.textTertiary }]}>
            {totalRemaining} remaining
          </Text>
          <View style={[styles.progressBar, { backgroundColor: theme.border }]}>
            <View
              style={[
                styles.progressFill,
                {
                  backgroundColor: Colors.flashcards,
                  width: `${((cards.length - totalRemaining) / cards.length) * 100}%`,
                },
              ]}
            />
          </View>
        </View>
      ) : (
        <View style={styles.simpleHeader}>
          <Text style={[styles.counter, { color: theme.textTertiary }]}>
            {currentIndex + 1} / {cards.length}
          </Text>
          <View style={styles.progressRow}>
            {cards.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.progressDot,
                  {
                    backgroundColor:
                      i === currentIndex
                        ? Colors.flashcards
                        : i < currentIndex
                        ? `${Colors.flashcards}60`
                        : theme.border,
                    width: i === currentIndex ? 20 : 6,
                  },
                ]}
              />
            ))}
          </View>
        </View>
      )}

      {card.condition && (
        <Text
          style={[
            styles.cardConditionLabel,
            { color: Colors.flashcards, fontFamily: "Inter_500Medium" },
          ]}
        >
          {card.condition}
        </Text>
      )}

      <Pressable
        onPress={handleFlip}
        style={styles.cardContainer}
        {...panResponder.panHandlers}
      >
        <Animated.View
          style={[
            styles.cardFace,
            styles.cardFront,
            {
              backgroundColor: isDark ? "#1A1F35" : "#EDE9FE",
              borderColor: isDark ? Colors.flashcardsDark : Colors.flashcards,
              transform: [
                { scale: scaleAnim },
                { translateX: swipeAnim },
                { rotate: cardRotation },
                { rotateY: frontInterpolate },
              ],
            },
          ]}
        >
          <View style={styles.cardLabel}>
            <Ionicons name="help-circle" size={16} color={Colors.flashcards} />
            <Text
              style={[
                styles.cardLabelText,
                { color: Colors.flashcards, fontFamily: "Inter_600SemiBold" },
              ]}
            >
              FRONT
            </Text>
          </View>
          <Text
            style={[
              styles.cardText,
              styles.frontText,
              {
                color: isDark ? "#C4B5FD" : Colors.flashcardsDark,
                fontFamily: "Inter_600SemiBold",
              },
            ]}
          >
            {card.front}
          </Text>
          <Text style={[styles.tapHint, { color: Colors.flashcards }]}>
            Tap to reveal · swipe to navigate
          </Text>
        </Animated.View>

        <Animated.View
          style={[
            styles.cardFace,
            styles.cardBack,
            {
              backgroundColor: isDark ? "#0F2A1F" : "#D1FAE5",
              borderColor: isDark ? Colors.boardPrepDark : Colors.boardPrep,
              transform: [
                { scale: scaleAnim },
                { translateX: swipeAnim },
                { rotate: cardRotation },
                { rotateY: backInterpolate },
              ],
            },
          ]}
        >
          <View style={styles.cardLabel}>
            <Ionicons
              name="checkmark-circle"
              size={16}
              color={Colors.boardPrep}
            />
            <Text
              style={[
                styles.cardLabelText,
                { color: Colors.boardPrep, fontFamily: "Inter_600SemiBold" },
              ]}
            >
              BACK
            </Text>
          </View>
          <Text
            style={[
              styles.cardText,
              {
                color: isDark ? "#6EE7B7" : Colors.boardPrepDark,
                fontFamily: "Inter_400Regular",
              },
            ]}
          >
            {card.back}
          </Text>
          <Text style={[styles.tapHint, { color: Colors.boardPrep }]}>
            {isSRSMode ? "Rate your recall below" : "Tap to flip back"}
          </Text>
        </Animated.View>
      </Pressable>

      {isSRSMode ? (
        <View style={styles.ratingSection}>
          {!isFlipped ? (
            <Pressable
              onPress={handleFlip}
              style={[styles.showAnswerBtn, { backgroundColor: Colors.flashcards }]}
            >
              <Text
                style={[styles.showAnswerText, { fontFamily: "Inter_600SemiBold" }]}
              >
                Show Answer
              </Text>
            </Pressable>
          ) : (
            <>
              <Text
                style={[
                  styles.ratingLabel,
                  { color: theme.textTertiary, fontFamily: "Inter_500Medium" },
                ]}
              >
                How well did you recall this?
              </Text>
              <View style={styles.ratingBtns}>
                {RATING_CONFIG.map((r) => (
                  <Pressable
                    key={r.rating}
                    onPress={() => handleRate(r.rating)}
                    disabled={isRating}
                    style={({ pressed }) => [
                      styles.ratingBtn,
                      {
                        backgroundColor: isDark ? r.darkBg : r.bg,
                        borderColor: `${r.color}40`,
                        opacity: pressed || isRating ? 0.7 : 1,
                      },
                    ]}
                  >
                    <Ionicons name={r.icon as any} size={16} color={r.color} />
                    <Text
                      style={[
                        styles.ratingBtnLabel,
                        { color: r.color, fontFamily: "Inter_600SemiBold" },
                      ]}
                    >
                      {r.label}
                    </Text>
                    <Text
                      style={[
                        styles.ratingBtnDesc,
                        { color: r.color, fontFamily: "Inter_400Regular" },
                      ]}
                    >
                      {r.desc}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </>
          )}
        </View>
      ) : (
        <View style={styles.navigation}>
          <Pressable
            onPress={() => currentIndex > 0 && goToCard(currentIndex - 1)}
            disabled={currentIndex === 0}
            style={({ pressed }) => [
              styles.navBtn,
              {
                backgroundColor: theme.surface,
                borderColor: theme.border,
                opacity: currentIndex === 0 ? 0.3 : pressed ? 0.7 : 1,
              },
            ]}
          >
            <Ionicons name="chevron-back" size={22} color={theme.text} />
          </Pressable>

          <Pressable
            onPress={handleFlip}
            style={({ pressed }) => [
              styles.flipBtn,
              {
                backgroundColor: Colors.flashcards,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <Ionicons name="sync-outline" size={18} color="#fff" />
            <Text style={[styles.flipBtnText, { fontFamily: "Inter_600SemiBold" }]}>
              Flip
            </Text>
          </Pressable>

          <Pressable
            onPress={() =>
              currentIndex < cards.length - 1 &&
              goToCard(currentIndex + 1)
            }
            disabled={currentIndex === cards.length - 1}
            style={({ pressed }) => [
              styles.navBtn,
              {
                backgroundColor: theme.surface,
                borderColor: theme.border,
                opacity:
                  currentIndex === cards.length - 1
                    ? 0.3
                    : pressed
                    ? 0.7
                    : 1,
              },
            ]}
          >
            <Ionicons name="chevron-forward" size={22} color={theme.text} />
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    gap: 12,
  },
  srsHeader: {
    width: "100%",
    gap: 8,
    alignItems: "center",
  },
  simpleHeader: {
    alignItems: "center",
    gap: 8,
  },
  counter: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  progressBar: {
    width: "100%",
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  progressRow: {
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
    height: 6,
  },
  progressDot: {
    height: 6,
    borderRadius: 3,
  },
  cardConditionLabel: {
    fontSize: 12,
    letterSpacing: 0.3,
    alignSelf: "flex-start",
  },
  cardContainer: {
    width: "100%",
    height: 280,
    marginTop: 4,
  },
  cardFace: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 20,
    borderWidth: 2,
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    backfaceVisibility: "hidden",
  },
  cardFront: {},
  cardBack: {},
  cardLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    position: "absolute",
    top: 16,
    left: 20,
  },
  cardLabelText: {
    fontSize: 11,
    letterSpacing: 1,
  },
  cardText: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
  frontText: {
    fontSize: 18,
    lineHeight: 28,
  },
  tapHint: {
    position: "absolute",
    bottom: 14,
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    opacity: 0.7,
  },
  ratingSection: {
    width: "100%",
    gap: 10,
    marginTop: 4,
  },
  showAnswerBtn: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  showAnswerText: {
    color: "#fff",
    fontSize: 16,
  },
  ratingLabel: {
    textAlign: "center",
    fontSize: 12,
    letterSpacing: 0.3,
  },
  ratingBtns: {
    flexDirection: "row",
    gap: 8,
  },
  ratingBtn: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderRadius: 12,
    borderWidth: 1,
    gap: 3,
  },
  ratingBtnLabel: {
    fontSize: 13,
  },
  ratingBtnDesc: {
    fontSize: 10,
  },
  navigation: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 8,
  },
  navBtn: {
    width: 52,
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  flipBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 24,
    height: 52,
    borderRadius: 16,
  },
  flipBtnText: {
    color: "#fff",
    fontSize: 15,
  },
});
