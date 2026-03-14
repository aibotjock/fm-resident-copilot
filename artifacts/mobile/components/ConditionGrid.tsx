import React, { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useColorScheme,
} from "react-native";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";
import { CONDITIONS, SYSTEMS, getModePrompt } from "@/types";
import type { ClinicalMode } from "@/types";

interface ConditionGridProps {
  mode: ClinicalMode;
  onSelect: (condition: string, query: string, system: string) => void;
  onClose: () => void;
}

export function ConditionGrid({ mode, onSelect, onClose }: ConditionGridProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? Colors.dark : Colors.light;
  const [search, setSearch] = useState("");
  const [selectedSystem, setSelectedSystem] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return CONDITIONS.filter((c) => {
      const matchesSearch =
        !search || c.name.toLowerCase().includes(search.toLowerCase());
      const matchesSystem = !selectedSystem || c.system === selectedSystem;
      return matchesSearch && matchesSystem;
    });
  }, [search, selectedSystem]);

  const grouped = useMemo(() => {
    const map: Record<string, typeof CONDITIONS> = {};
    for (const c of filtered) {
      if (!map[c.system]) map[c.system] = [];
      map[c.system].push(c);
    }
    return map;
  }, [filtered]);

  const handleSelect = (conditionName: string, system: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const query = getModePrompt(mode, conditionName);
    onSelect(conditionName, query, system);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <Text style={[styles.title, { color: theme.text }]}>
          Select Condition
        </Text>
        <Pressable onPress={onClose} style={styles.closeBtn}>
          <Ionicons name="close" size={24} color={theme.textSecondary} />
        </Pressable>
      </View>

      <View
        style={[
          styles.searchContainer,
          { backgroundColor: theme.inputBackground, borderColor: theme.border },
        ]}
      >
        <Ionicons name="search" size={16} color={theme.textTertiary} />
        <TextInput
          style={[styles.searchInput, { color: theme.text }]}
          placeholder="Search conditions..."
          placeholderTextColor={theme.textTertiary}
          value={search}
          onChangeText={setSearch}
          returnKeyType="search"
        />
        {search.length > 0 && (
          <Pressable onPress={() => setSearch("")}>
            <Ionicons name="close-circle" size={16} color={theme.textTertiary} />
          </Pressable>
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.systemScroll}
        contentContainerStyle={styles.systemScrollContent}
      >
        <Pressable
          onPress={() => setSelectedSystem(null)}
          style={[
            styles.systemChip,
            {
              backgroundColor: !selectedSystem
                ? Colors.pointOfCare
                : theme.surfaceSecondary,
              borderColor: !selectedSystem ? Colors.pointOfCare : theme.border,
            },
          ]}
        >
          <Text
            style={[
              styles.systemChipText,
              { color: !selectedSystem ? "#fff" : theme.textSecondary },
            ]}
          >
            All
          </Text>
        </Pressable>
        {SYSTEMS.map((sys) => (
          <Pressable
            key={sys}
            onPress={() =>
              setSelectedSystem(selectedSystem === sys ? null : sys)
            }
            style={[
              styles.systemChip,
              {
                backgroundColor:
                  selectedSystem === sys
                    ? Colors.pointOfCare
                    : theme.surfaceSecondary,
                borderColor:
                  selectedSystem === sys ? Colors.pointOfCare : theme.border,
              },
            ]}
          >
            <Text
              style={[
                styles.systemChipText,
                {
                  color:
                    selectedSystem === sys ? "#fff" : theme.textSecondary,
                },
              ]}
            >
              {sys}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
        {Object.entries(grouped).map(([system, conditions]) => (
          <View key={system} style={styles.systemSection}>
            <Text style={[styles.systemLabel, { color: theme.textTertiary }]}>
              {system.toUpperCase()}
            </Text>
            <View style={styles.conditionGrid}>
              {conditions.map((c) => (
                <Pressable
                  key={c.name}
                  onPress={() => handleSelect(c.name, c.system)}
                  style={({ pressed }) => [
                    styles.conditionTile,
                    {
                      backgroundColor: pressed
                        ? theme.surfaceSecondary
                        : theme.surface,
                      borderColor: theme.border,
                      opacity: pressed ? 0.8 : 1,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.conditionName,
                      { color: theme.text, fontFamily: "Inter_500Medium" },
                    ]}
                    numberOfLines={2}
                  >
                    {c.name}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        ))}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
  },
  closeBtn: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    margin: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
  },
  systemScroll: {
    maxHeight: 44,
    marginBottom: 8,
  },
  systemScrollContent: {
    paddingHorizontal: 16,
    gap: 8,
    alignItems: "center",
  },
  systemChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  systemChipText: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  systemSection: {
    marginBottom: 20,
  },
  systemLabel: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  conditionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  conditionTile: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    maxWidth: "47%",
  },
  conditionName: {
    fontSize: 13,
  },
});
