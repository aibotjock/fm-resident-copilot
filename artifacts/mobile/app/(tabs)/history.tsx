import React, { useState } from "react";
import {
  Alert,
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
import { Colors, getModeColor } from "@/constants/colors";
import { useApp } from "@/context/AppContext";
import { MODE_LABELS } from "@/types";
import type { ClinicalMode } from "@/types";

const MODE_ICONS: Record<ClinicalMode, keyof typeof Ionicons.glyphMap> = {
  point_of_care: "pulse-outline",
  documentation: "document-text-outline",
  board_prep: "school-outline",
  flashcards: "layers-outline",
};

export default function HistoryScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const { history, deleteFromHistory, clearHistory, searchHistory } = useApp();

  const [searchQuery, setSearchQuery] = useState("");

  const filtered = searchHistory(searchQuery);

  const handleClearAll = () => {
    Alert.alert(
      "Clear History",
      "Delete all query history? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear All",
          style: "destructive",
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            clearHistory();
          },
        },
      ]
    );
  };

  const handleDelete = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    deleteFromHistory(id);
  };

  const formatDate = (ts: number) => {
    const d = new Date(ts);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) {
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } else if (days === 1) {
      return "Yesterday";
    } else if (days < 7) {
      return `${days}d ago`;
    } else {
      return d.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View
        style={[
          styles.headerSection,
          {
            paddingTop: Platform.OS === "web" ? insets.top + 67 : insets.top + 16,
            borderBottomColor: theme.border,
          },
        ]}
      >
        <View style={styles.headerRow}>
          <Text
            style={[styles.title, { color: theme.text, fontFamily: "Inter_700Bold" }]}
          >
            History
          </Text>
          {history.length > 0 && (
            <Pressable
              onPress={handleClearAll}
              style={({ pressed }) => [
                styles.clearBtn,
                { opacity: pressed ? 0.6 : 1 },
              ]}
            >
              <Text style={[styles.clearBtnText, { color: "#EF4444" }]}>
                Clear All
              </Text>
            </Pressable>
          )}
        </View>

        <View
          style={[
            styles.searchContainer,
            {
              backgroundColor: theme.inputBackground,
              borderColor: theme.border,
            },
          ]}
        >
          <Ionicons name="search" size={16} color={theme.textTertiary} />
          <TextInput
            style={[styles.searchInput, { color: theme.text, fontFamily: "Inter_400Regular" }]}
            placeholder="Search by keyword, condition, mode..."
            placeholderTextColor={theme.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery("")}>
              <Ionicons
                name="close-circle"
                size={16}
                color={theme.textTertiary}
              />
            </Pressable>
          )}
        </View>
      </View>

      {filtered.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons
            name="time-outline"
            size={48}
            color={theme.textTertiary}
          />
          <Text
            style={[styles.emptyTitle, { color: theme.text, fontFamily: "Inter_600SemiBold" }]}
          >
            {history.length === 0 ? "No history yet" : "No results found"}
          </Text>
          <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
            {history.length === 0
              ? "Your queries will appear here after you search"
              : "Try a different search term"}
          </Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: Platform.OS === "web" ? 120 : 100 },
          ]}
        >
          <Text style={[styles.resultCount, { color: theme.textTertiary }]}>
            {filtered.length} {filtered.length === 1 ? "entry" : "entries"}
          </Text>

          {filtered.map((item) => {
            const modeColor = getModeColor(item.mode, isDark);
            return (
              <Pressable
                key={item.id}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.push({
                    pathname: "/response",
                    params: {
                      query: item.query,
                      mode: item.mode,
                      condition: item.condition,
                      system: item.system,
                    },
                  });
                }}
                style={({ pressed }) => [
                  styles.historyItem,
                  {
                    backgroundColor: theme.surface,
                    borderColor: theme.border,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <View style={styles.itemHeader}>
                  <View
                    style={[
                      styles.modeBadge,
                      { backgroundColor: `${modeColor}20` },
                    ]}
                  >
                    <Ionicons
                      name={MODE_ICONS[item.mode]}
                      size={12}
                      color={modeColor}
                    />
                    <Text
                      style={[
                        styles.modeBadgeText,
                        { color: modeColor, fontFamily: "Inter_500Medium" },
                      ]}
                    >
                      {MODE_LABELS[item.mode]}
                    </Text>
                  </View>
                  <Text style={[styles.timestamp, { color: theme.textTertiary }]}>
                    {formatDate(item.timestamp)}
                  </Text>
                  <Pressable
                    onPress={(e) => {
                      e.stopPropagation();
                      handleDelete(item.id);
                    }}
                    style={({ pressed }) => [
                      styles.deleteBtn,
                      { opacity: pressed ? 0.5 : 1 },
                    ]}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Ionicons
                      name="trash-outline"
                      size={14}
                      color={theme.textTertiary}
                    />
                  </Pressable>
                </View>

                {item.condition && (
                  <Text
                    style={[
                      styles.conditionLabel,
                      { color: modeColor, fontFamily: "Inter_600SemiBold" },
                    ]}
                  >
                    {item.condition}
                  </Text>
                )}

                <Text
                  style={[styles.queryText, { color: theme.text }]}
                  numberOfLines={3}
                >
                  {item.query}
                </Text>

                {item.system && (
                  <Text style={[styles.systemLabel, { color: theme.textTertiary }]}>
                    {item.system}
                  </Text>
                )}
              </Pressable>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerSection: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    gap: 12,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: { fontSize: 28 },
  clearBtn: { padding: 4 },
  clearBtnText: { fontSize: 14, fontFamily: "Inter_500Medium" },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  searchInput: { flex: 1, fontSize: 15 },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    padding: 40,
  },
  emptyTitle: { fontSize: 18 },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 20,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 10,
  },
  resultCount: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    marginBottom: 2,
  },
  historyItem: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 6,
  },
  itemHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  modeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  modeBadgeText: { fontSize: 11 },
  timestamp: {
    flex: 1,
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    textAlign: "right",
  },
  deleteBtn: { padding: 2 },
  conditionLabel: { fontSize: 13 },
  queryText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    lineHeight: 20,
  },
  systemLabel: { fontSize: 11, fontFamily: "Inter_400Regular" },
});
