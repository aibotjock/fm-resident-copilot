import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
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
import type { Bookmark } from "@/types";

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
  const { bookmarks, removeBookmark, updateBookmark } = useApp();

  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [noteModal, setNoteModal] = useState<{ id: string; current: string } | null>(null);
  const [noteText, setNoteText] = useState("");

  const filtered = bookmarks.filter((b) => {
    if (!search.trim()) return true;
    const lower = search.toLowerCase();
    return (
      b.query.toLowerCase().includes(lower) ||
      b.condition?.toLowerCase().includes(lower) ||
      b.mode.toLowerCase().includes(lower) ||
      b.note?.toLowerCase().includes(lower)
    );
  });

  const handleDelete = (id: string, query: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      "Remove Bookmark",
      `Remove "${query.length > 60 ? query.slice(0, 60) + "…" : query}"?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Remove", style: "destructive", onPress: () => removeBookmark(id) },
      ]
    );
  };

  const openNoteModal = (b: Bookmark) => {
    setNoteText(b.note ?? "");
    setNoteModal({ id: b.id, current: b.note ?? "" });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const saveNote = async () => {
    if (!noteModal) return;
    await updateBookmark(noteModal.id, noteText.trim());
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setNoteModal(null);
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
            paddingTop: Platform.OS === "web" ? insets.top + 67 : insets.top + 16,
            borderBottomColor: theme.border,
          },
        ]}
      >
        <View style={styles.heroSection}>
          <View
            style={[
              styles.modeIndicator,
              { backgroundColor: `${Colors.flashcards}15`, borderColor: `${Colors.flashcards}30` },
            ]}
          >
            <Ionicons name="bookmark" size={13} color={Colors.flashcards} />
            <Text style={[styles.modeLabel, { color: Colors.flashcards, fontFamily: "Inter_600SemiBold" }]}>
              Saved Responses
            </Text>
          </View>
          <Text style={[styles.heroTitle, { color: theme.text, fontFamily: "Inter_700Bold" }]}>
            Bookmarks
          </Text>
          <Text style={[styles.heroSubtitle, { color: theme.textSecondary, fontFamily: "Inter_400Regular" }]}>
            {bookmarks.length === 0
              ? "Star any response to save it here"
              : `${bookmarks.length} saved response${bookmarks.length !== 1 ? "s" : ""}`}
          </Text>
        </View>

        {bookmarks.length > 0 && (
          <View style={[styles.searchRow, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Ionicons name="search" size={16} color={theme.textTertiary} />
            <TextInput
              style={[styles.searchInput, { color: theme.text, fontFamily: "Inter_400Regular" }]}
              placeholder="Search saved responses..."
              placeholderTextColor={theme.textTertiary}
              value={search}
              onChangeText={setSearch}
            />
            {search.length > 0 && (
              <Pressable onPress={() => setSearch("")}>
                <Ionicons name="close-circle" size={16} color={theme.textTertiary} />
              </Pressable>
            )}
          </View>
        )}
      </View>

      {bookmarks.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={[styles.emptyIconBg, { backgroundColor: `${Colors.flashcards}12` }]}>
            <Ionicons name="bookmark-outline" size={36} color={Colors.flashcards} />
          </View>
          <Text style={[styles.emptyTitle, { color: theme.text, fontFamily: "Inter_600SemiBold" }]}>
            No bookmarks yet
          </Text>
          <Text style={[styles.emptySubtitle, { color: theme.textSecondary, fontFamily: "Inter_400Regular" }]}>
            Tap the bookmark icon on any response to save it here for quick access during rounds or study sessions
          </Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.list, { paddingBottom: Platform.OS === "web" ? 160 : 140 }]}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.flashcards} />}
        >
          {filtered.length === 0 ? (
            <View style={styles.noResults}>
              <Text style={[styles.noResultsText, { color: theme.textTertiary }]}>
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
                      params: { query: b.query, mode: b.mode, condition: b.condition, system: b.system },
                    });
                  }}
                  style={({ pressed }) => [
                    styles.bookmarkCard,
                    { backgroundColor: theme.surface, borderColor: theme.border, opacity: pressed ? 0.85 : 1 },
                  ]}
                >
                  <View style={[styles.bookmarkIcon, { backgroundColor: `${modeColor}15` }]}>
                    <Ionicons name={icon as any} size={18} color={modeColor} />
                  </View>

                  <View style={styles.bookmarkContent}>
                    <View style={styles.bookmarkMeta}>
                      <Text style={[styles.bookmarkMode, { color: modeColor, fontFamily: "Inter_500Medium" }]}>
                        {MODE_LABELS[b.mode]}
                      </Text>
                      {b.condition && (
                        <>
                          <Text style={[styles.metaDot, { color: theme.textTertiary }]}>·</Text>
                          <Text style={[styles.bookmarkCondition, { color: theme.textSecondary }]}>
                            {b.condition}
                          </Text>
                        </>
                      )}
                    </View>
                    <Text
                      style={[styles.bookmarkQuery, { color: theme.text, fontFamily: "Inter_500Medium" }]}
                      numberOfLines={2}
                    >
                      {b.query}
                    </Text>
                    {b.note ? (
                      <Pressable
                        onPress={(e) => { e.stopPropagation(); openNoteModal(b); }}
                        style={[styles.noteRow, { backgroundColor: `${Colors.flashcards}10`, borderColor: `${Colors.flashcards}25` }]}
                      >
                        <Ionicons name="create-outline" size={12} color={Colors.flashcards} />
                        <Text style={[styles.noteText, { color: theme.textSecondary }]} numberOfLines={2}>
                          {b.note}
                        </Text>
                      </Pressable>
                    ) : null}
                    <View style={styles.bookmarkFooter}>
                      <Text style={[styles.bookmarkDate, { color: theme.textTertiary, fontFamily: "Inter_400Regular" }]}>
                        {new Date(b.timestamp).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: new Date(b.timestamp).getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
                        })}
                      </Text>
                      <Pressable
                        onPress={(e) => { e.stopPropagation(); openNoteModal(b); }}
                        style={({ pressed }) => [styles.noteBtn, { opacity: pressed ? 0.6 : 0.8 }]}
                        hitSlop={{ top: 6, right: 6, bottom: 6, left: 6 }}
                      >
                        <Ionicons name={b.note ? "create" : "create-outline"} size={13} color={Colors.flashcards} />
                        <Text style={[styles.noteBtnText, { color: Colors.flashcards }]}>
                          {b.note ? "Edit note" : "Add note"}
                        </Text>
                      </Pressable>
                    </View>
                  </View>

                  <Pressable
                    onPress={(e) => { e.stopPropagation(); handleDelete(b.id, b.query); }}
                    style={({ pressed }) => [styles.deleteBtn, { opacity: pressed ? 0.6 : 0.4 }]}
                    hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
                  >
                    <Ionicons name="trash-outline" size={16} color={theme.textTertiary} />
                  </Pressable>
                </Pressable>
              );
            })
          )}
        </ScrollView>
      )}

      <Modal
        visible={noteModal !== null}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setNoteModal(null)}
      >
        <KeyboardAvoidingView
          style={[styles.modalContainer, { backgroundColor: theme.background }]}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={[styles.modalHeader, { borderBottomColor: theme.border }]}>
            <Pressable onPress={() => setNoteModal(null)} style={styles.modalCancel}>
              <Text style={[styles.modalCancelText, { color: theme.textSecondary }]}>Cancel</Text>
            </Pressable>
            <Text style={[styles.modalTitle, { color: theme.text, fontFamily: "Inter_600SemiBold" }]}>
              Personal Note
            </Text>
            <Pressable onPress={saveNote} style={[styles.modalSaveBtn, { backgroundColor: Colors.flashcards }]}>
              <Text style={styles.modalSaveBtnText}>Save</Text>
            </Pressable>
          </View>
          <View style={styles.modalBody}>
            <Text style={[styles.modalHint, { color: theme.textSecondary, fontFamily: "Inter_400Regular" }]}>
              Add a personal annotation — a clinical pearl, remembered pitfall, or study note.
            </Text>
            <TextInput
              style={[
                styles.noteInput,
                { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text, fontFamily: "Inter_400Regular" },
              ]}
              placeholder="e.g. Remember: this applies to adults only per IDSA 2021..."
              placeholderTextColor={theme.textTertiary}
              value={noteText}
              onChangeText={setNoteText}
              multiline
              autoFocus
              maxLength={500}
            />
            <Text style={[styles.charCount, { color: theme.textTertiary }]}>
              {noteText.length}/500
            </Text>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 12, borderBottomWidth: 1, gap: 12 },
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
  list: { paddingHorizontal: 16, paddingTop: 12, gap: 10 },
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
  bookmarkContent: { flex: 1, gap: 4 },
  bookmarkMeta: { flexDirection: "row", alignItems: "center", gap: 4 },
  bookmarkMode: { fontSize: 11, letterSpacing: 0.2 },
  metaDot: { fontSize: 11 },
  bookmarkCondition: { fontSize: 11, fontFamily: "Inter_400Regular" },
  bookmarkQuery: { fontSize: 14, lineHeight: 20 },
  noteRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    marginTop: 2,
  },
  noteText: { flex: 1, fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 17 },
  bookmarkFooter: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 2 },
  bookmarkDate: { fontSize: 11 },
  noteBtn: { flexDirection: "row", alignItems: "center", gap: 4 },
  noteBtnText: { fontSize: 11, fontFamily: "Inter_500Medium" },
  deleteBtn: { paddingTop: 2 },
  emptyState: { flex: 1, alignItems: "center", justifyContent: "center", padding: 40, gap: 16 },
  emptyIconBg: { width: 72, height: 72, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  emptyTitle: { fontSize: 20 },
  emptySubtitle: { fontSize: 15, lineHeight: 22, textAlign: "center" },
  noResults: { padding: 40, alignItems: "center" },
  noResultsText: { fontSize: 14, fontFamily: "Inter_400Regular" },
  modalContainer: { flex: 1 },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    paddingTop: 56,
  },
  modalCancel: { paddingVertical: 4, paddingHorizontal: 4 },
  modalCancelText: { fontSize: 16, fontFamily: "Inter_400Regular" },
  modalTitle: { fontSize: 17 },
  modalSaveBtn: { paddingHorizontal: 16, paddingVertical: 7, borderRadius: 10 },
  modalSaveBtnText: { color: "#fff", fontSize: 15, fontFamily: "Inter_600SemiBold" },
  modalBody: { padding: 20, gap: 12, flex: 1 },
  modalHint: { fontSize: 14, lineHeight: 20 },
  noteInput: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    fontSize: 15,
    lineHeight: 22,
    minHeight: 140,
    textAlignVertical: "top",
  },
  charCount: { fontSize: 11, fontFamily: "Inter_400Regular", textAlign: "right" },
});
