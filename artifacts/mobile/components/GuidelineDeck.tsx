import React, { useState } from "react";
import { Link } from "expo-router";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "@/constants/colors";
export interface GuidelineCard {
  id: string;
  topic: string;
  title: string;
  front: string;
  back: string;
  source: { organization: string; url: string };
  locator: string;
  checkedOn: string;
}

interface GuidelineDeckProps {
  title: string;
  description: string;
  topics: readonly string[];
  entries: readonly GuidelineCard[];
}

const ALL_TOPICS = "All topics";

function CardSource({ card }: { card: GuidelineCard }) {
  const dark = useColorScheme() === "dark";
  const theme = dark ? Colors.dark : Colors.light;
  return (
    <View style={styles.source}>
      <Link
        href={card.source.url as `https://${string}`}
        target="_blank"
        style={[styles.sourceLink, { color: dark ? "#C4B5FD" : Colors.flashcardsDark }]}
        accessibilityLabel={`Source for ${card.title}: ${card.source.organization}, ${card.locator}`}
      >
        {card.source.organization} · {card.locator}
      </Link>
      <Text style={[styles.secondary, { color: theme.textSecondary }]}>
        Source checked {card.checkedOn}
      </Text>
    </View>
  );
}

export function GuidelineDeck({ title, description, topics, entries }: GuidelineDeckProps) {
  const dark = useColorScheme() === "dark";
  const theme = dark ? Colors.dark : Colors.light;
  const accent = dark ? "#C4B5FD" : Colors.flashcardsDark;
  const insets = useSafeAreaInsets();
  const [topic, setTopic] = useState(ALL_TOPICS);
  const [view, setView] = useState<"cards" | "reference">("cards");
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const cards = topic === ALL_TOPICS
    ? entries
    : entries.filter((card) => card.topic === topic);
  const card = cards[index];

  function goToCard(next: number) {
    setRevealed(false);
    setIndex(next);
  }

  function selectView(next: typeof view) {
    if (next !== view) setRevealed(false);
    setView(next);
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.background }}
      contentContainerStyle={[styles.page, { paddingBottom: Math.max(insets.bottom, 24) }]}
    >
      <Text accessibilityRole="header" style={[styles.title, { color: theme.text }]}>
        {title}
      </Text>
      <Text style={[styles.body, { color: theme.textSecondary }]}>
        {description}
      </Text>
      <View style={styles.filters}>
        {(["cards", "reference"] as const).map((item) => (
          <Pressable
            key={item}
            accessibilityRole="button"
            accessibilityState={{ selected: view === item }}
            onPress={() => selectView(item)}
            style={[styles.filter, {
              borderColor: view === item ? accent : theme.border,
              backgroundColor: view === item ? `${accent}18` : theme.surface,
            }]}
          >
            <Text style={[styles.buttonText, { color: view === item ? accent : theme.text }]}>
              {item === "cards" ? "Flashcards" : "Read reference"}
            </Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.filters}>
        {[ALL_TOPICS, ...topics].map((item) => (
          <Pressable
            key={item}
            accessibilityRole="button"
            accessibilityState={{ selected: topic === item }}
            onPress={() => { setTopic(item); goToCard(0); }}
            style={[styles.filter, {
              borderColor: topic === item ? accent : theme.border,
              backgroundColor: topic === item ? `${accent}18` : theme.surface,
            }]}
          >
            <Text style={[styles.buttonText, { color: topic === item ? accent : theme.text }]}>
              {item}
            </Text>
          </Pressable>
        ))}
      </View>
      {view === "cards" && card ? (
        <>
          <Text accessibilityLiveRegion="polite" style={[styles.secondary, { color: theme.textSecondary }]}>
            {card.topic} · Card {index + 1} of {cards.length}
          </Text>
          <View style={[styles.card, { borderColor: theme.border, backgroundColor: theme.surface }]}>
            <Text style={[styles.heading, { color: theme.text }]}>{card.front}</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ expanded: revealed }}
              onPress={() => setRevealed(!revealed)}
              style={[styles.filter, styles.action, { borderColor: accent }]}
            >
              <Text style={[styles.buttonText, { color: accent }]}>{revealed ? "Hide answer" : "Show answer"}</Text>
            </Pressable>
            {revealed && (
              <View accessibilityLiveRegion="polite" style={styles.answer}>
                <Text style={[styles.body, { color: theme.text }]}>{card.back}</Text>
                <CardSource card={card} />
              </View>
            )}
          </View>
          <View style={styles.navigation}>
            <Pressable
              accessibilityRole="button"
              disabled={index === 0}
              onPress={() => goToCard(index - 1)}
              style={[styles.filter, { borderColor: theme.border, opacity: index === 0 ? 0.5 : 1 }]}
            >
              <Text style={[styles.buttonText, { color: theme.text }]}>Previous</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={() => goToCard(index === cards.length - 1 ? 0 : index + 1)}
              style={[styles.filter, { borderColor: accent }]}
            >
              <Text style={[styles.buttonText, { color: accent }]}>
                {index === cards.length - 1 ? "Restart" : "Next"}
              </Text>
            </Pressable>
          </View>
        </>
      ) : (
        cards.map((item) => (
          <View key={item.id} style={[styles.card, { borderColor: theme.border, backgroundColor: theme.surface }]}>
            <Text accessibilityRole="header" style={[styles.heading, { color: theme.text }]}>{item.title}</Text>
            <Text style={[styles.body, { color: theme.text }]}>{item.back}</Text>
            <CardSource card={item} />
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { paddingHorizontal: 20, paddingTop: 20, gap: 14 },
  title: { fontSize: 26, fontFamily: "Inter_700Bold" },
  heading: { fontSize: 17, lineHeight: 25, fontFamily: "Inter_600SemiBold" },
  body: { fontSize: 15, lineHeight: 23, fontFamily: "Inter_400Regular" },
  secondary: { fontSize: 12, lineHeight: 18, fontFamily: "Inter_400Regular" },
  filters: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  filter: { minHeight: 44, justifyContent: "center", borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8 },
  action: { alignSelf: "flex-start" },
  buttonText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  card: { borderWidth: 1, borderRadius: 14, padding: 16, gap: 12 },
  answer: { gap: 12 },
  navigation: { flexDirection: "row", justifyContent: "space-between" },
  source: { gap: 3 },
  sourceLink: { fontSize: 13, lineHeight: 20, textDecorationLine: "underline", fontFamily: "Inter_600SemiBold" },
});
