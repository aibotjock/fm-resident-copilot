import React, { useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  RefreshControl,
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

const MODE_ICONS: Record<string, string> = {
  point_of_care: "pulse",
  documentation: "document-text",
  ddx: "git-branch",
  board_prep: "school",
  flashcards: "layers",
};

export default function BookmarksScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const { bookmarks, removeBookmark } = useApp();

  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const filtered = bookmarks.filter((b) => {
    if (!search.trim()) return true;
    const lower = search.toLowerCase();
    return (
      b.query.toLowerCase().includes(lower) ||
      b.condition?.toLowerCase().includes(lower) ||
      b.mode.toLowerCase().includes(lower)
    );
  });

  const handleDelete = (id: string, query: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert("Remove Bookmark", `Remove "${query.slice(0, 60)}..."?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => removeBookmark(id),
      },
    ]);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 500);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View
        style={[
          styles.header,
          {
            paddingTop:
              Platform.OS === "web" ? insets.top + 67 : insets.top + 16,
            borderBottomColor: theme.border,
          },
        ]}
      >
        <View style={styles.heroSection}>
          <View
            style={[
              styles.modeIndicator,
              {
                backgroundColor: `${Colors.flashcards}15`,
                borderColor: `${Colors.flashcards}30`,
              },
            ]}
          >
            <Ionicons name="bookmark" size={13} color={Colors.flashcards} />
            <Text
              style={[
                styles.modeLabel,
                {
                  color: Colors.flashcards,
                  fontFamily: "Inter_600SemiBold",
                },
              ]}
            >
              Saved Responses
            </Text>
          </View>
          <Text
            style={[
              styles.heroTitle,
              { color: theme.text, fontFamily: "Inter_700Bold" },
            ]}
          >
            Bookmarks
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
            {bookmarks.length === 0
              ? "Star any response to save it here"
              : `${bookmarks.length} saved response${bookmarks.length !== 1 ? "s" : ""}`}
          </Text>
        </View>

        {bookmarks.length > 0 && (
          <View
            style={[
              styles.searchRow,
              { backgroundColor: theme.surface, borderColor: theme.border },
            ]}
          >
            <Ionicons name="search" size={16} color={theme.textTertiary} />
            <TextInput
              style={[
                styles.searchInput,
                { color: theme.text, fontFamily: "Inter_400Regular" },
              ]}
              placeholder="Search saved responses..."
              placeholderTextColor={theme.textTertiary}
              value={search}
              onChangeText={setSearch}
            />
            {search.length > 0 && (
              <Pressable onPress={() => setSearch("")}>
                <Ionicons
                  name="close-circle"
                  size={16}
                  color={theme.textTertiary}
                />
              </Pressable>
            )}
          </View>
        )}
      </View>

      {bookmarks.length === 0 ? (
        <View style={styles.emptyState}>
          <View
            style={[
              styles.emptyIconBg,
              { backgroundColor: `${Colors.flashcards}12` },
            ]}
          >
            <Ionicons
              name="bookmark-outline"
              size={36}
              color={Colors.flashcards}
            />
          </View>
          <Text
            style={[
              styles.emptyTitle,
              { color: theme.text, fontFamily: "Inter_600SemiBold" },
            ]}
          >
            No bookmarks yet
          </Text>
          <Text
            style={[
              styles.emptySubtitle,
              { color: theme.textSecondary, fontFamily: "Inter_400Regular" },
            ]}
          >
            Tap the bookmark icon on any response to save it here for quick
            access during rounds or study sessions
          </Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.list,
            {
              paddingBottom:
                Platform.OS === "web" ? 160 : 140,
            },
          ]}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={Colors.flashcards}
            />
          }
        >
          {filtered.length === 0 ? (
            <View style={styles.noResults}>
              <Text
                style={[
                  styles.noResultsText,
                  { color: theme.textTertiary },
                ]}
              >
                No bookmarks match "{search}"
              </Text>
            </View>
          ) : (
            filtered.map((b) => {
              const modeColor = getModeColor(b.mode, isDark);
              const icon = MODE_ICONS[b.mode] || "document-outline";
              return (
                <Pressable
                  key={b.id}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    router.push({
                      pathname: "/response",
                      params: {
                        query: b.query,
                        mode: b.mode,
                        condition: b.condition,
                        system: b.system,
                      },
                    });
                  }}
                  style={({ pressed }) => [
                    styles.bookmarkCard,
                    {
                      backgroundColor: theme.surface,
                      borderColor: theme.border,
                      opacity: pressed ? 0.85 : 1,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.bookmarkIcon,
                      { backgroundColor: `${modeColor}15` },
                    ]}
                  >
                    <Ionicons
                      name={icon as any}
                      size={18}
                      color={modeColor}
                    />
                  </View>

                  <View style={styles.bookmarkContent}>
                    <View style={styles.bookmarkMeta}>
                      <Text
                        style={[
                          styles.bookmarkMode,
                          {
                            color: modeColor,
                            fontFamily: "Inter_500Medium",
                          },
                        ]}
                      >
                        {MODE_LABELS[b.mode]}
                      </Text>
                      {b.condition && (
                        <>
                          <Text
                            style={[
                              styles.metaDot,
                              { color: theme.textTertiary },
                            ]}
                          >
                            ·
                          </Text>
                          <Text
                            style={[
                              styles.bookmarkCondition,
                              { color: theme.textSecondary },
                            ]}
                          >
                            {b.condition}
                          </Text>
                        </>
                      )}
                    </View>
                    <Text
                      style={[
                        styles.bookmarkQuery,
                        { color: theme.text, fontFamily: "Inter_500Medium" },
                      ]}
                      numberOfLines={2}
                    >
                      {b.query}
                    </Text>
                    <Text
                      style={[
                        styles.bookmarkDate,
                        {
                          color: theme.textTertiary,
                          fontFamily: "Inter_400Regular",
                        },
                      ]}
                    >
                      {new Date(b.timestamp).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year:
                          new Date(b.timestamp).getFullYear() !==
                          new Date().getFullYear()
                            ? "numeric"
                            : undefined,
                      })}
                    </Text>
                  </View>

                  <Pressable
                    onPress={(e) => {
                      e.stopPropagation();
                      handleDelete(b.id, b.query);
                    }}
                    style={({ pressed }) => [
                      styles.deleteBtn,
                      { opacity: pressed ? 0.6 : 0.4 },
                    ]}
                    hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
                  >
                    <Ionicons
                      name="trash-outline"
                      size={16}
                      color={theme.textTertiary}
                    />
                  </Pressable>
                </Pressable>
              );
            })
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
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
    marginBottom: 2,
  },
  modeLabel: { fontSize: 12, letterSpacing: 0.3 },
  heroTitle: { fontSize: 28 },
  heroSubtitle: { fontSize: 15, lineHeight: 22 },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchInput: { flex: 1, fontSize: 14, padding: 0 },
  list: {
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 10,
  },
  bookmarkCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    gap: 12,
  },
  bookmarkIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  bookmarkContent: { flex: 1, gap: 3 },
  bookmarkMeta: { flexDirection: "row", alignItems: "center", gap: 4 },
  bookmarkMode: { fontSize: 11, letterSpacing: 0.2 },
  metaDot: { fontSize: 11 },
  bookmarkCondition: { fontSize: 11, fontFamily: "Inter_400Regular" },
  bookmarkQuery: { fontSize: 14, lineHeight: 20 },
  bookmarkDate: { fontSize: 11, marginTop: 2 },
  deleteBtn: {
    paddingTop: 2,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    gap: 16,
  },
  emptyIconBg: {
    width: 72,
    height: 72,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: { fontSize: 20 },
  emptySubtitle: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
  },
  noResults: { padding: 40, alignItems: "center" },
  noResultsText: { fontSize: 14, fontFamily: "Inter_400Regular" },
});
