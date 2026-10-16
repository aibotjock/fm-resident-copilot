export const Colors = {
  pointOfCare: "#3B82F6",
  pointOfCareLight: "#DBEAFE",
  pointOfCareDark: "#1D4ED8",

  documentation: "#F59E0B",
  documentationLight: "#FEF3C7",
  documentationDark: "#D97706",

  ddx: "#0891B2",
  ddxLight: "#CFFAFE",
  ddxDark: "#0E7490",

  boardPrep: "#10B981",
  boardPrepLight: "#D1FAE5",
  boardPrepDark: "#059669",

  flashcards: "#8B5CF6",
  flashcardsLight: "#EDE9FE",
  flashcardsDark: "#7C3AED",

  clinical: "#3B82F6",
  clinicalDark: "#60A5FA",
  study: "#8B5CF6",
  studyDark: "#A78BFA",

  light: {
    background: "#F8FAFC",
    surface: "#FFFFFF",
    surfaceSecondary: "#F1F5F9",
    border: "#E2E8F0",
    borderLight: "#F1F5F9",
    text: "#0F172A",
    textSecondary: "#475569",
    textTertiary: "#94A3B8",
    tint: "#3B82F6",
    tabIconDefault: "#64748B",
    tabIconSelected: "#3B82F6",
    card: "#FFFFFF",
    separator: "#E2E8F0",
    inputBackground: "#F8FAFC",
  },

  dark: {
    background: "#0A0F1E",
    surface: "#111827",
    surfaceSecondary: "#1E293B",
    border: "#1E293B",
    borderLight: "#243044",
    text: "#F8FAFC",
    textSecondary: "#94A3B8",
    textTertiary: "#475569",
    tint: "#60A5FA",
    tabIconDefault: "#94A3B8",
    tabIconSelected: "#60A5FA",
    card: "#111827",
    separator: "#1E293B",
    inputBackground: "#1E293B",
  },
};

export type ColorScheme = "light" | "dark";

export function getModeColor(mode: string, isDark: boolean): string {
  const colors: Record<string, string> = {
    point_of_care: isDark ? "#60A5FA" : Colors.pointOfCare,
    documentation: isDark ? "#FCD34D" : Colors.documentation,
    ddx: isDark ? "#22D3EE" : Colors.ddx,
    board_prep: isDark ? "#34D399" : Colors.boardPrep,
    flashcards: isDark ? "#A78BFA" : Colors.flashcards,
  };
  return colors[mode] || Colors.pointOfCare;
}

export function getModeLightColor(mode: string): string {
  const colors: Record<string, string> = {
    point_of_care: Colors.pointOfCareLight,
    documentation: Colors.documentationLight,
    ddx: Colors.ddxLight,
    board_prep: Colors.boardPrepLight,
    flashcards: Colors.flashcardsLight,
  };
  return colors[mode] || Colors.pointOfCareLight;
}

export default Colors;
