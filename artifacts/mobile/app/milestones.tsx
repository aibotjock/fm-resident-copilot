import { useState } from "react";
import { Link } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View, useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "@/constants/colors";
import { ACGME_FAMILY_MEDICINE, FAMILY_MEDICINE_MILESTONES } from "@/content/family-medicine-milestones";

export default function MilestonesScreen() {
  const isDark = useColorScheme() === "dark";
  const theme = isDark ? Colors.dark : Colors.light;
  const accent = isDark ? "#6EE7B7" : Colors.boardPrepDark;
  const insets = useSafeAreaInsets();
  const [domain, setDomain] = useState(FAMILY_MEDICINE_MILESTONES[0]);
  const count = FAMILY_MEDICINE_MILESTONES.reduce((total, item) => total + item.items.length, 0);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.background }}
      contentContainerStyle={[styles.page, { paddingBottom: Math.max(insets.bottom, 24) }]}
    >
      <Text accessibilityRole="header" style={[styles.title, { color: theme.text }]}>
        ACGME Family Medicine Milestones
      </Text>
      <Text style={[styles.body, { color: theme.textSecondary }]}>
        {FAMILY_MEDICINE_MILESTONES.length} residency competency domains · {count} subcompetencies
      </Text>

      <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Text accessibilityRole="header" style={[styles.heading, { color: theme.text }]}>How levels work</Text>
        <Text style={[styles.body, { color: theme.text }]}>
          Levels 1–5 describe development within each subcompetency, independent of PGY or ABFM exam scores. Level 4 is a graduation goal. Level 5 describes performance beyond the expected level.
        </Text>
        <Text style={[styles.body, { color: theme.text }]}>
          Your program's Clinical Competency Committee reviews observations and selects reported levels. The program director determines graduation readiness. Use these summaries and practice prompts to prepare for feedback and set learning goals.
        </Text>
        <Link href={ACGME_FAMILY_MEDICINE.milestones} target="_blank" style={[styles.link, { color: accent }]}>
          Official ACGME Milestones
        </Link>
        <Link href={ACGME_FAMILY_MEDICINE.supplementalGuide} target="_blank" style={[styles.link, { color: accent }]}>
          Official ACGME Supplemental Guide
        </Link>
        <Text style={[styles.secondary, { color: theme.textSecondary }]}>
          {ACGME_FAMILY_MEDICINE.revision} revision · Worksheet {ACGME_FAMILY_MEDICINE.worksheetVersion} · Checked {ACGME_FAMILY_MEDICINE.checkedOn}
        </Text>
      </View>

      <Text accessibilityRole="header" style={[styles.heading, { color: theme.text }]}>Browse by competency</Text>
      <View style={styles.filters}>
        {FAMILY_MEDICINE_MILESTONES.map((item) => {
          const selected = domain.code === item.code;
          return (
            <Pressable
              key={item.code}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() => setDomain(item)}
              style={[styles.filter, { borderColor: selected ? accent : theme.border, backgroundColor: theme.surface }]}
            >
              <Text style={[styles.filterText, { color: selected ? accent : theme.text }]}>{item.name}</Text>
            </Pressable>
          );
        })}
      </View>

      <Text accessibilityRole="header" accessibilityLiveRegion="polite" style={[styles.heading, { color: theme.text }]}>
        {domain.name}
      </Text>
      {domain.items.map((item) => (
        <View key={item.code} style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text accessibilityRole="header" style={[styles.heading, { color: theme.text }]}>
            <Text style={{ color: accent }}>{item.code}</Text> · {item.title}
          </Text>
          <Text style={[styles.body, { color: theme.text }]}>{item.summary}</Text>
          <Text style={[styles.body, { color: theme.textSecondary }]}>
            <Text style={styles.promptLabel}>Practice reflection </Text>{item.prompt}
          </Text>
          <View style={styles.sourceLinks}>
            <Link
              href={`${ACGME_FAMILY_MEDICINE.milestones}#page=${item.pdfPage}`}
              target="_blank"
              accessibilityLabel={`ACGME level descriptors for ${item.code}`}
              style={[styles.link, { color: accent }]}
            >
              Level descriptors
            </Link>
            <Link
              href={`${ACGME_FAMILY_MEDICINE.supplementalGuide}#page=${item.guidePage}`}
              target="_blank"
              accessibilityLabel={`ACGME examples for ${item.code}`}
              style={[styles.link, { color: accent }]}
            >
              ACGME examples
            </Link>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { paddingHorizontal: 20, paddingTop: 20, gap: 14 },
  title: { fontSize: 25, fontFamily: "Inter_700Bold" },
  heading: { fontSize: 16, lineHeight: 23, fontFamily: "Inter_600SemiBold" },
  body: { fontSize: 15, lineHeight: 22, fontFamily: "Inter_400Regular" },
  secondary: { fontSize: 12, lineHeight: 18, fontFamily: "Inter_400Regular" },
  card: { borderWidth: 1, borderRadius: 14, padding: 16, gap: 9 },
  filters: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  filter: { minHeight: 44, justifyContent: "center", borderWidth: 1, borderRadius: 10, paddingHorizontal: 12 },
  filterText: { fontSize: 13, fontFamily: "Inter_600SemiBold", paddingVertical: 8 },
  promptLabel: { fontFamily: "Inter_600SemiBold" },
  sourceLinks: { flexDirection: "row", flexWrap: "wrap", columnGap: 16, rowGap: 4 },
  link: { fontSize: 13, lineHeight: 20, textDecorationLine: "underline", fontFamily: "Inter_600SemiBold" },
});
