import React from "react";
import { Platform, Pressable, Text, View } from "react-native";

/** Explicit device backup: no cookies, access codes or API credentials. Existing keys stay intact. */
export function DeviceDataControls() {
  if (Platform.OS !== "web") return null;
  const exportData = () => {
    const storage: Record<string, string> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)!;
      if (key.startsWith("@fm_copilot_") || key.startsWith("fm-tutor-progress"))
        storage[key] = localStorage.getItem(key)!;
    }
    const blob = new Blob(
      [
        JSON.stringify(
          { format: "fm-copilot-device-backup-v1", storage },
          null,
          2,
        ),
      ],
      { type: "application/json" },
    );
    const url = URL.createObjectURL(blob),
      a = document.createElement("a");
    a.href = url;
    a.download = "fm-copilot-device-backup.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const importData = () => {
    const picker = document.createElement("input");
    picker.type = "file";
    picker.accept = "application/json";
    picker.onchange = async () => {
      try {
        const file = picker.files?.[0];
        if (!file || file.size > 3000000)
          throw Error("Choose a backup smaller than 3 MB");
        const data = JSON.parse(await file.text());
        if (
          data.format !== "fm-copilot-device-backup-v1" ||
          !data.storage ||
          typeof data.storage !== "object" ||
          Array.isArray(data.storage)
        )
          throw Error("Choose an FM Copilot device backup");
        const entries = Object.entries(data.storage);
        if (
          entries.some(
            ([k, v]) =>
              !(
                k.startsWith("@fm_copilot_") ||
                k.startsWith("fm-tutor-progress")
              ) || typeof v !== "string",
          )
        )
          throw Error("Backup contains an unsupported record");
        if (
          !confirm(
            "Import these saved study records? Existing matching records will be replaced. A copy of the current records will be retained.",
          )
        )
          return;
        const original = Object.fromEntries(
          entries.map(([k]) => [k, localStorage.getItem(k)]),
        );
        localStorage.setItem(
          "fm-device-before-import-v1",
          JSON.stringify(original),
        );
        for (const [k, v] of entries) localStorage.setItem(k, v as string);
        location.reload();
      } catch (e) {
        alert((e as Error).message);
      }
    };
    picker.click();
  };
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "#0F172A",
        paddingHorizontal: 12,
        paddingVertical: 8,
        gap: 8,
      }}
    >
      <Pressable
        accessibilityRole="link"
        onPress={() => {
          location.href = "/tutor";
        }}
      >
        <Text style={{ color: "#8DE0D3", fontSize: 13 }}>Talk to Copilot</Text>
      </Pressable>
      <Pressable accessibilityRole="button" onPress={exportData}>
        <Text style={{ color: "#CBD5E1", fontSize: 13 }}>Export data</Text>
      </Pressable>
      <Pressable accessibilityRole="button" onPress={importData}>
        <Text style={{ color: "#CBD5E1", fontSize: 13 }}>Import data</Text>
      </Pressable>
    </View>
  );
}
