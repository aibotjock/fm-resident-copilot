import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.fmresident.copilot",
  appName: "FM Resident Copilot",
  webDir: "dist",
  server: {
    // Allow cleartext (http://) requests so the app can reach a LAN backend
    // during development. Remove for production/https-only backends.
    cleartext: true,
  },
  android: {
    allowMixedContent: true,
  },
};

export default config;
