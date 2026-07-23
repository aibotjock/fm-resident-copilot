import React, { useCallback } from "react";
import {
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
type BottomTabBarProps = {
  state: {
    index: number;
    routes: Array<{ key: string; name: string }>;
  };
  navigation: {
    emit: (event: { type: string; target?: string; canPreventDefault?: boolean }) => { defaultPrevented?: boolean };
    navigate: (name: string) => void;
  };
  insets: { bottom: number; top: number; left: number; right: number };
};
import { Colors } from "@/constants/colors";
import { useApp } from "@/context/AppContext";
import type { AppMode } from "@/types";

type TabConfig = {
  name: string;
  label: string;
  icon: string;
  activeIcon: string;
  mode: AppMode | "both";
  accent: string;
};

const TAB_CONFIG: TabConfig[] = [
  {
    name: "index",
    label: "Point of Care",
    icon: "pulse-outline",
    activeIcon: "pulse",
    mode: "clinical",
    accent: Colors.pointOfCare,
  },
  {
    name: "documentation",
    label: "Docs",
    icon: "document-text-outline",
    activeIcon: "document-text",
    mode: "clinical",
    accent: Colors.documentation,
  },
  {
    name: "ddx",
    label: "DDx",
    icon: "git-branch-outline",
    activeIcon: "git-branch",
    mode: "clinical",
    accent: Colors.ddx,
  },
  {
    name: "bookmarks",
    label: "Saved",
    icon: "bookmark-outline",
    activeIcon: "bookmark",
    mode: "clinical",
    accent: Colors.flashcards,
  },
  {
    name: "board",
    label: "Board Prep",
    icon: "school-outline",
    activeIcon: "school",
    mode: "study",
    accent: Colors.boardPrep,
  },
  {
    name: "flashcards",
    label: "Flashcards",
    icon: "layers-outline",
    activeIcon: "layers",
    mode: "study",
    accent: Colors.flashcards,
  },
  {
    name: "progress",
    label: "Progress",
    icon: "stats-chart-outline",
    activeIcon: "stats-chart",
    mode: "study",
    accent: Colors.boardPrep,
  },
  {
    name: "history",
    label: "History",
    icon: "time-outline",
    activeIcon: "time",
    mode: "both",
    accent: Colors.pointOfCare,
  },
];

export function AppTabBar({ state, navigation, insets }: BottomTabBarProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? Colors.dark : Colors.light;
  const { appMode, setAppMode, getDueCards } = useApp();

  const dueCount = getDueCards().length;
  const isIOS = Platform.OS === "ios";
  const isWeb = Platform.OS === "web";

  const visibleTabs = TAB_CONFIG.filter(
    (t) => t.mode === appMode || t.mode === "both"
  );

  const currentRouteName = state.routes[state.index]?.name;

  const switchMode = useCallback(
    async (newMode: AppMode) => {
      await setAppMode(newMode);
      if (newMode === "clinical") {
        navigation.navigate("index" as never);
      } else {
        navigation.navigate("board" as never);
      }
    },
    [navigation, setAppMode]
  );

  const handleTabPress = useCallback(
    (tabName: string, routeKey: string) => {
      const event = navigation.emit({
        type: "tabPress",
        target: routeKey,
        canPreventDefault: true,
      });
      if (!event.defaultPrevented) {
        navigation.navigate(tabName as never);
      }
    },
    [navigation]
  );

  const bg = isIOS ? "transparent" : theme.surface;
  const bottomPad = insets.bottom > 0 ? insets.bottom : isWeb ? 0 : 8;

  return (
    <View
      style={[
        styles.wrapper,
        {
          borderTopColor: theme.border,
          paddingBottom: bottomPad,
        },
      ]}
    >
      {isIOS ? (
        <BlurView
          intensity={100}
          tint={isDark ? "dark" : "light"}
          style={StyleSheet.absoluteFill}
        />
      ) : (
        <View
          style={[StyleSheet.absoluteFill, { backgroundColor: theme.surface }]}
        />
      )}

      <View style={styles.modeSwitcher}>
        <Pressable
          onPress={() => appMode !== "clinical" && switchMode("clinical")}
          style={({ pressed }) => [
            styles.modeBtn,
            appMode === "clinical" && [
              styles.modeBtnActive,
              { backgroundColor: Colors.clinical },
            ],
            { opacity: pressed ? 0.8 : 1 },
          ]}
        >
          <Ionicons
            name="medkit-outline"
            size={13}
            color={appMode === "clinical" ? "#fff" : theme.textSecondary}
          />
          <Text
            style={[
              styles.modeBtnText,
              {
                color: appMode === "clinical" ? "#fff" : theme.textSecondary,
                fontFamily:
                  appMode === "clinical"
                    ? "Inter_600SemiBold"
                    : "Inter_400Regular",
              },
            ]}
          >
            Clinical
          </Text>
        </Pressable>

        <Pressable
          onPress={() => appMode !== "study" && switchMode("study")}
          style={({ pressed }) => [
            styles.modeBtn,
            appMode === "study" && [
              styles.modeBtnActive,
              { backgroundColor: Colors.study },
            ],
            { opacity: pressed ? 0.8 : 1 },
          ]}
        >
          <Ionicons
            name="school-outline"
            size={13}
            color={appMode === "study" ? "#fff" : theme.textSecondary}
          />
          <Text
            style={[
              styles.modeBtnText,
              {
                color: appMode === "study" ? "#fff" : theme.textSecondary,
                fontFamily:
                  appMode === "study"
                    ? "Inter_600SemiBold"
                    : "Inter_400Regular",
              },
            ]}
          >
            Study
          </Text>
          {appMode !== "study" && dueCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {dueCount > 99 ? "99+" : dueCount}
              </Text>
            </View>
          )}
        </Pressable>
      </View>

      <View style={styles.tabRow}>
        {visibleTabs.map((tab) => {
          const isActive = currentRouteName === tab.name;
          const iconColor = isActive ? tab.accent : theme.tabIconDefault;

          return (
            <Pressable
              key={tab.name}
              onPress={() => {
                const route = state.routes.find((r) => r.name === tab.name);
                if (route) handleTabPress(tab.name, route.key);
              }}
              style={({ pressed }) => [
                styles.tabBtn,
                { opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <View style={styles.tabBtnInner}>
                {isActive && (
                  <View
                    style={[
                      styles.activeIndicator,
                      { backgroundColor: tab.accent },
                    ]}
                  />
                )}
                <Ionicons
                  name={(isActive ? tab.activeIcon : tab.icon) as any}
                  size={22}
                  color={iconColor}
                />
                <Text
                  style={[
                    styles.tabLabel,
                    {
                      color: iconColor,
                      fontFamily: isActive
                        ? "Inter_600SemiBold"
                        : "Inter_400Regular",
                    },
                  ]}
                  numberOfLines={1}
                >
                  {tab.label}
                </Text>
                {tab.name === "progress" && dueCount > 0 && (
                  <View
                    style={[
                      styles.tabBadge,
                      { backgroundColor: Colors.flashcards },
                    ]}
                  >
                    <Text style={styles.tabBadgeText}>
                      {dueCount > 9 ? "9+" : dueCount}
                    </Text>
                  </View>
                )}
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    overflow: "hidden",
  },
  modeSwitcher: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingTop: 10,
    paddingBottom: 6,
    paddingHorizontal: 16,
  },
  modeBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    flex: 1,
    justifyContent: "center",
  },
  modeBtnActive: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  modeBtnText: {
    fontSize: 13,
  },
  badge: {
    backgroundColor: Colors.flashcards,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: "#fff",
    fontSize: 9,
    fontFamily: "Inter_700Bold",
  },
  tabRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 4,
    paddingBottom: 2,
  },
  tabBtn: {
    flex: 1,
    alignItems: "center",
  },
  tabBtnInner: {
    alignItems: "center",
    gap: 2,
    paddingVertical: 6,
    paddingHorizontal: 2,
    position: "relative",
  },
  activeIndicator: {
    position: "absolute",
    top: -2,
    width: 24,
    height: 3,
    borderRadius: 2,
  },
  tabLabel: {
    fontSize: 9,
    letterSpacing: 0.2,
  },
  tabBadge: {
    position: "absolute",
    top: 4,
    right: -2,
    borderRadius: 6,
    minWidth: 12,
    height: 12,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  tabBadgeText: {
    color: "#fff",
    fontSize: 8,
    fontFamily: "Inter_700Bold",
  },
});
