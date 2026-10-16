import React, { useCallback, useRef, useState } from "react";
import {
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
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";
import { ConditionGrid } from "@/components/ConditionGrid";
import { ReferenceStatus } from "@/components/ReferenceStatus";
import { useApp } from "@/context/AppContext";

const MODE = "point_of_care" as const;
const MODE_COLOR = Colors.pointOfCare;
const MODE_LABEL = "Point of Care";
const PLACEHOLDER = "e.g. Management of heart failure with reduced EF...";

export default function PointOfCareScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const { history } = useApp();

  const [query, setQuery] = useState("");
  const [showConditions, setShowConditions] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const recentForMode = history
    .filter((h) => h.mode === MODE)
    .slice(0, 5);

  const handleSubmit = useCallback(() => {
    if (!query.trim()) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push({
      pathname: "/response",
      params: { query: query.trim(), mode: MODE },
    });
    setQuery("");
  }, [query]);

  const handleConditionSelect = useCallback(
    (condition: string, prefillQuery: string, system: string) => {
      setShowConditions(false);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      router.push({
        pathname: "/response",
        params: { query: prefillQuery, mode: MODE, condition, system },
      });
    },
    []
  );

  return (
    <>
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: theme.background }]}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingTop:
                Platform.OS === "web" ? insets.top + 67 : insets.top + 16,
              paddingBottom: Platform.OS === "web" ? 120 : 100,
            },
          ]}
        >
          <View style={styles.heroSection}>
            <View
              style={[
                styles.modeIndicator,
                { backgroundColor: `${MODE_COLOR}15`, borderColor: `${MODE_COLOR}30` },
              ]}
            >
              <View style={[styles.modeDot, { backgroundColor: MODE_COLOR }]} />
              <Text
                style={[
                  styles.modeLabel,
                  { color: MODE_COLOR, fontFamily: "Inter_600SemiBold" },
                ]}
              >
                {MODE_LABEL}
              </Text>
            </View>
            <Text style={[styles.heroTitle, { color: theme.text, fontFamily: "Inter_700Bold" }]}>
              Clinical Reference
            </Text>
            <Text style={[styles.heroSubtitle, { color: theme.textSecondary }]}>
              Evidence-based answers at the point of care
            </Text>
          </View>

          <View
            style={[
              styles.inputCard,
              {
                backgroundColor: theme.surface,
                borderColor: theme.border,
                shadowColor: isDark ? "#000" : "#94A3B8",
              },
            ]}
          >
            <TextInput
              ref={inputRef}
              accessibilityLabel="Clinical question"
              style={[
                styles.input,
                { color: theme.text, fontFamily: "Inter_400Regular" },
              ]}
              placeholder={PLACEHOLDER}
              placeholderTextColor={theme.textTertiary}
              value={query}
              onChangeText={setQuery}
              multiline
              returnKeyType="send"
              onSubmitEditing={handleSubmit}
            />
            <View style={styles.inputActions}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Browse conditions"
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setShowConditions(true);
                }}
                style={({ pressed }) => [
                  styles.conditionsBtn,
                  {
                    backgroundColor: `${MODE_COLOR}15`,
                    borderColor: `${MODE_COLOR}30`,
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
              >
                <Ionicons name="list-outline" size={16} color={MODE_COLOR} />
                <Text style={[styles.conditionsBtnText, { color: MODE_COLOR }]}>
                  Browse 100 Conditions
                </Text>
              </Pressable>
              <Pressable
                onPress={handleSubmit}
                accessibilityRole="button"
                accessibilityLabel="Send clinical question"
                accessibilityState={{ disabled: !query.trim() }}
                disabled={!query.trim()}
                style={({ pressed }) => [
                  styles.sendBtn,
                  {
                    backgroundColor: query.trim() ? MODE_COLOR : theme.border,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <Ionicons name="arrow-up" size={18} color="#fff" />
              </Pressable>
            </View>
          </View>

          <ReferenceStatus />

          {recentForMode.length > 0 && (
            <View style={styles.recentSection}>
              <Text style={[styles.sectionTitle, { color: theme.textTertiary }]}>
                RECENT QUERIES
              </Text>
              {recentForMode.map((h) => (
                <Pressable
                  key={h.id}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    router.push({
                      pathname: "/response",
                      params: {
                        query: h.query,
                        mode: MODE,
                        condition: h.condition,
                        system: h.system,
                      },
                    });
                  }}
                  style={({ pressed }) => [
                    styles.recentItem,
                    {
                      backgroundColor: theme.surface,
                      borderColor: theme.border,
                      opacity: pressed ? 0.7 : 1,
                    },
                  ]}
                >
                  <View style={styles.recentItemContent}>
                    {h.condition && (
                      <Text
                        style={[
                          styles.recentCondition,
                          { color: MODE_COLOR, fontFamily: "Inter_500Medium" },
                        ]}
                      >
                        {h.condition}
                      </Text>
                    )}
                    <Text
                      style={[
                        styles.recentQuery,
                        { color: theme.text },
                      ]}
                      numberOfLines={2}
                    >
                      {h.query}
                    </Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={16}
                    color={theme.textTertiary}
                  />
                </Pressable>
              ))}
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal visible={showConditions} animationType="slide" presentationStyle="pageSheet">
        <ConditionGrid
          mode={MODE}
          onSelect={handleConditionSelect}
          onClose={() => setShowConditions(false)}
        />
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 16,
  },
  heroSection: {
    gap: 6,
    marginBottom: 4,
  },
  modeIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
  },
  modeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  modeLabel: {
    fontSize: 12,
    letterSpacing: 0.3,
  },
  heroTitle: {
    fontSize: 28,
  },
  heroSubtitle: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    lineHeight: 22,
  },
  inputCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  input: {
    minHeight: 80,
    maxHeight: 160,
    padding: 16,
    fontSize: 15,
    lineHeight: 22,
    textAlignVertical: "top",
  },
  inputActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingBottom: 12,
    paddingTop: 4,
    gap: 8,
  },
  conditionsBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
  },
  conditionsBtnText: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  recentSection: {
    gap: 8,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.8,
  },
  recentItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  recentItemContent: {
    flex: 1,
    gap: 2,
  },
  recentCondition: {
    fontSize: 12,
  },
  recentQuery: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    lineHeight: 20,
  },
});
