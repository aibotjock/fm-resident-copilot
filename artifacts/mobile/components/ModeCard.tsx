import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";
import { Colors, getModeColor, getModeLightColor } from "@/constants/colors";
import type { ClinicalMode } from "@/types";
import { MODE_DESCRIPTIONS, MODE_LABELS } from "@/types";

interface ModeCardProps {
  mode: ClinicalMode;
  isSelected: boolean;
  onPress: () => void;
}

const MODE_ICONS: Record<ClinicalMode, keyof typeof Ionicons.glyphMap> = {
  point_of_care: "pulse-outline",
  documentation: "document-text-outline",
  board_prep: "school-outline",
  flashcards: "layers-outline",
};

const MODE_ICONS_FILLED: Record<ClinicalMode, keyof typeof Ionicons.glyphMap> = {
  point_of_care: "pulse",
  documentation: "document-text",
  board_prep: "school",
  flashcards: "layers",
};

export function ModeCard({ mode, isSelected, onPress }: ModeCardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? Colors.dark : Colors.light;
  const modeColor = getModeColor(mode, isDark);
  const modeLightColor = getModeLightColor(mode);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: isSelected
            ? isDark
              ? `${modeColor}25`
              : modeLightColor
            : theme.surface,
          borderColor: isSelected ? modeColor : theme.border,
          opacity: pressed ? 0.8 : 1,
          transform: [{ scale: pressed ? 0.97 : 1 }],
        },
      ]}
    >
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: isSelected
              ? `${modeColor}20`
              : isDark
              ? theme.surfaceSecondary
              : "#F1F5F9",
          },
        ]}
      >
        <Ionicons
          name={isSelected ? MODE_ICONS_FILLED[mode] : MODE_ICONS[mode]}
          size={20}
          color={isSelected ? modeColor : theme.textTertiary}
        />
      </View>
      <Text
        style={[
          styles.label,
          {
            color: isSelected ? modeColor : theme.text,
            fontFamily: isSelected ? "Inter_600SemiBold" : "Inter_500Medium",
          },
        ]}
        numberOfLines={1}
      >
        {MODE_LABELS[mode]}
      </Text>
      <Text
        style={[
          styles.description,
          {
            color: isSelected ? modeColor : theme.textTertiary,
          },
        ]}
        numberOfLines={1}
      >
        {MODE_DESCRIPTIONS[mode]}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    gap: 6,
    minWidth: 0,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 13,
  },
  description: {
    fontSize: 10,
  },
});
