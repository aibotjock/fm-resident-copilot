import React, { useRef, useState } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";

interface FlashcardViewProps {
  cards: Array<{ front: string; back: string }>;
}

export function FlashcardView({ cards }: FlashcardViewProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? Colors.dark : Colors.light;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const flipAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ["0deg", "180deg"],
  });

  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ["180deg", "360deg"],
  });

  const handleFlip = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const toValue = isFlipped ? 0 : 180;

    Animated.parallel([
      Animated.spring(flipAnim, {
        toValue,
        friction: 8,
        tension: 10,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    setIsFlipped(!isFlipped);
  };

  const goNext = () => {
    if (currentIndex < cards.length - 1) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setIsFlipped(false);
      flipAnim.setValue(0);
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setIsFlipped(false);
      flipAnim.setValue(0);
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (!cards.length) return null;

  const card = cards[currentIndex];

  return (
    <View style={styles.container}>
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

      <Pressable onPress={handleFlip} style={styles.cardContainer}>
        <Animated.View
          style={[
            styles.cardFace,
            styles.cardFront,
            {
              backgroundColor: isDark ? "#1A1F35" : "#EDE9FE",
              borderColor: isDark ? Colors.flashcardsDark : Colors.flashcards,
              transform: [
                { scale: scaleAnim },
                { rotateY: frontInterpolate },
              ],
            },
          ]}
        >
          <View style={styles.cardLabel}>
            <Ionicons name="help-circle" size={16} color={Colors.flashcards} />
            <Text style={[styles.cardLabelText, { color: Colors.flashcards }]}>
              FRONT
            </Text>
          </View>
          <Text
            style={[
              styles.cardText,
              styles.frontText,
              { color: isDark ? "#C4B5FD" : Colors.flashcardsDark, fontFamily: "Inter_600SemiBold" },
            ]}
          >
            {card.front}
          </Text>
          <Text style={[styles.tapHint, { color: Colors.flashcards }]}>
            Tap to reveal answer
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
                { rotateY: backInterpolate },
              ],
            },
          ]}
        >
          <View style={styles.cardLabel}>
            <Ionicons name="checkmark-circle" size={16} color={Colors.boardPrep} />
            <Text style={[styles.cardLabelText, { color: Colors.boardPrep }]}>
              BACK
            </Text>
          </View>
          <Text
            style={[
              styles.cardText,
              { color: isDark ? "#6EE7B7" : Colors.boardPrepDark, fontFamily: "Inter_400Regular" },
            ]}
          >
            {card.back}
          </Text>
          <Text style={[styles.tapHint, { color: Colors.boardPrep }]}>
            Tap to flip back
          </Text>
        </Animated.View>
      </Pressable>

      <View style={styles.navigation}>
        <Pressable
          onPress={goPrev}
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
          <Text style={styles.flipBtnText}>Flip</Text>
        </Pressable>

        <Pressable
          onPress={goNext}
          disabled={currentIndex === cards.length - 1}
          style={({ pressed }) => [
            styles.navBtn,
            {
              backgroundColor: theme.surface,
              borderColor: theme.border,
              opacity:
                currentIndex === cards.length - 1 ? 0.3 : pressed ? 0.7 : 1,
            },
          ]}
        >
          <Ionicons name="chevron-forward" size={22} color={theme.text} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    gap: 16,
  },
  counter: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
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
  cardContainer: {
    width: "100%",
    height: 320,
    marginTop: 8,
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
    fontFamily: "Inter_600SemiBold",
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
    bottom: 16,
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    opacity: 0.7,
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
    fontFamily: "Inter_600SemiBold",
  },
});
