import { ClinicalAccessGate } from "@/components/ClinicalAccessGate";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { Modal, Platform, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AppProvider } from "@/context/AppContext";
import { OnboardingModal } from "@/components/OnboardingModal";

const ONBOARDED_KEY = "@fm_copilot_onboarded";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: "Back" }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="response"
        options={{
          headerShown: false,
          presentation: "card",
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingChecked, setOnboardingChecked] = useState(false);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    let mounted = true;
    AsyncStorage.getItem(ONBOARDED_KEY)
      .then((val) => { if (mounted) setShowOnboarding(!val); })
      .catch(() => { if (mounted) setShowOnboarding(true); })
      .finally(() => { if (mounted) setOnboardingChecked(true); });
    return () => { mounted = false; };
  }, []);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    // Storage may be unavailable; dismissing the introduction must still work.
    AsyncStorage.setItem(ONBOARDED_KEY, "1").catch(() => {});
  };

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <AppProvider>
            <GestureHandlerRootView style={{ flex: 1, width: "100%", maxWidth: Platform.OS === "web" ? 960 : undefined, alignSelf: "center" }}>
              <KeyboardProvider>
                {process.env.EXPO_PUBLIC_REFERENCE_PREVIEW === "1" && (
                  <View accessibilityRole="alert" style={{ backgroundColor: "#FFF3CD", paddingHorizontal: 16, paddingVertical: 10 }}>
                    <Text style={{ color: "#664D03", fontSize: 13, textAlign: "center" }}>
                      Guideline preview · Medical review incomplete · Study testing only
                    </Text>
                  </View>
                )}
                <ClinicalAccessGate><RootLayoutNav /></ClinicalAccessGate>
                {onboardingChecked && (
                  <Modal
                    visible={showOnboarding}
                    onRequestClose={handleOnboardingComplete}
                    animationType="slide"
                    presentationStyle="fullScreen"
                  >
                    <OnboardingModal onComplete={handleOnboardingComplete} />
                  </Modal>
                )}
              </KeyboardProvider>
            </GestureHandlerRootView>
          </AppProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
