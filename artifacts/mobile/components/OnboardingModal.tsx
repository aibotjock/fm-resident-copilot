import React, { useState } from "react";
import {
  ScrollView,
  Pressable,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";

interface OnboardingPanel {
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  title: string;
  subtitle: string;
  bullets: string[];
}

const PANELS: OnboardingPanel[] = [
  {
    icon: "shield-checkmark",
    color: Colors.pointOfCare,
    title: "Guideline Reference Library",
    subtitle: "Check the evidence behind each answer",
    bullets: [
      "The reference library is being checked against reputable guideline publishers. The home screen shows checked excerpts and entries still pending review.",
      "Answers use checked reference excerpts with source links. Verify important details and the latest guidance directly with the publisher.",
      "Review source dates and stated limitations. A cited guideline may not address every part of your question.",
    ],
  },
  {
    icon: "pulse",
    color: Colors.ddx,
    title: "Five Study Modes",
    subtitle: "Reference review with clear limitations",
    bullets: [
      "Point of Care — checked excerpts about presentation, diagnosis, testing, treatment, and dosing where available; missing information is stated.",
      "Documentation — source-supported reference material for study. Output is not a completed clinical note or billing recommendation.",
      "Differential Dx — diagnostic information supported by checked excerpts; a complete ranked differential may be unavailable.",
      "Board Prep — source-excerpt study. Practice MCQs are paused while questions and explanations undergo content review.",
      "Flashcards — source-excerpt cards with spaced review. Previously saved cards may require rechecking.",
    ],
  },
  {
    icon: "warning",
    color: "#F59E0B",
    title: "Important Disclaimer",
    subtitle: "Please read before using",
    bullets: [
      "This tool is for educational and decision-support purposes only. It is not a substitute for clinical judgment, real-time clinical decision support systems, or direct patient care protocols.",
      "Do not use this tool as the sole basis for clinical decisions. Verify all answers against your institution's resources and current guidelines.",
      "Live guideline updates are currently unavailable. Check the displayed review status and verify the latest guidance directly with the source publisher.",
    ],
  },
];

interface Props {
  onComplete: () => void;
}

export function OnboardingModal({ onComplete }: Props) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(0);

  const isLast = currentIndex === PANELS.length - 1;

  const goNext = () => {
    if (isLast) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onComplete();
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const next = currentIndex + 1;
      setCurrentIndex(next);
    }
  };

  const renderPanel = (item: OnboardingPanel) => (
    <View style={styles.panel}>
      <View style={[styles.iconContainer, { backgroundColor: `${item.color}15`, borderColor: `${item.color}30` }]}>
        <Ionicons name={item.icon} size={40} color={item.color} />
      </View>
      <Text style={[styles.panelTitle, { color: theme.text, fontFamily: "Inter_700Bold" }]}>
        {item.title}
      </Text>
      <Text style={[styles.panelSubtitle, { color: theme.textSecondary, fontFamily: "Inter_400Regular" }]}>
        {item.subtitle}
      </Text>
      <View style={[styles.bulletContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        {item.bullets.map((bullet, i) => (
          <View key={i} style={styles.bulletRow}>
            <View style={[styles.bulletDot, { backgroundColor: item.color }]} />
            <Text style={[styles.bulletText, { color: theme.text, fontFamily: "Inter_400Regular" }]}>
              {bullet}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }]}>
      <View style={styles.headerRow}>
        <View style={[styles.appBadge, { backgroundColor: `${Colors.pointOfCare}15`, borderColor: `${Colors.pointOfCare}30` }]}>
          <Ionicons name="medical" size={14} color={Colors.pointOfCare} />
          <Text style={[styles.appBadgeText, { color: Colors.pointOfCare }]}>FM Resident Copilot</Text>
        </View>
        <Pressable
          onPress={onComplete}
          accessibilityRole="button"
          accessibilityLabel="Skip introduction"
          style={({ pressed }) => [styles.skipBtn, { opacity: pressed ? 0.6 : 1 }]}
        >
          <Text style={[styles.skipText, { color: theme.textTertiary }]}>Skip</Text>
        </Pressable>
      </View>

      <ScrollView
        key={currentIndex}
        style={styles.flatList}
        contentContainerStyle={styles.panelScroll}
        showsVerticalScrollIndicator
      >
        {renderPanel(PANELS[currentIndex])}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.dotsRow}>
          {PANELS.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                {
                  backgroundColor: i === currentIndex ? Colors.pointOfCare : theme.border,
                  width: i === currentIndex ? 20 : 8,
                },
              ]}
            />
          ))}
        </View>

        <Pressable
          onPress={goNext}
          accessibilityRole="button"
          accessibilityLabel={isLast ? "Get started" : "Next introduction page"}
          style={({ pressed }) => [
            styles.nextBtn,
            { backgroundColor: isLast ? "#10B981" : Colors.pointOfCare, opacity: pressed ? 0.85 : 1 },
          ]}
        >
          <Text style={styles.nextBtnText}>
            {isLast ? "Get Started" : "Next"}
          </Text>
          <Ionicons
            name={isLast ? "checkmark" : "arrow-forward"}
            size={18}
            color="#fff"
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  appBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  appBadgeText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  skipBtn: { padding: 8, minWidth: 44, minHeight: 44, justifyContent: "center", alignItems: "center" },
  skipText: { fontSize: 14, fontFamily: "Inter_400Regular" },
  flatList: { flex: 1 },
  panelScroll: { flexGrow: 1, justifyContent: "center", paddingVertical: 16 },
  panel: {
    width: "100%",
    maxWidth: 680,
    alignSelf: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    gap: 16,
    justifyContent: "center",
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  panelTitle: { fontSize: 26, textAlign: "center" },
  panelSubtitle: { fontSize: 15, textAlign: "center", lineHeight: 22 },
  bulletContainer: {
    width: "100%",
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  bulletRow: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  bulletDot: { width: 6, height: 6, borderRadius: 3, marginTop: 7, flexShrink: 0 },
  bulletText: { flex: 1, fontSize: 14, lineHeight: 21 },
  footer: {
    width: "100%",
    maxWidth: 680,
    alignSelf: "center",
    paddingTop: 12,
    paddingHorizontal: 24,
    gap: 20,
  },
  dotsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  dot: { height: 8, borderRadius: 4 },
  nextBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 16,
  },
  nextBtnText: { color: "#fff", fontSize: 17, fontFamily: "Inter_600SemiBold" },
});
