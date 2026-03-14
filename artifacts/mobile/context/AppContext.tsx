import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { ClinicalMode, QueryHistory } from "@/types";

const HISTORY_KEY = "@fm_copilot_history";
const MAX_HISTORY = 200;

interface AppContextValue {
  history: QueryHistory[];
  activeMode: ClinicalMode;
  setActiveMode: (mode: ClinicalMode) => void;
  addToHistory: (entry: Omit<QueryHistory, "id" | "timestamp">) => Promise<void>;
  deleteFromHistory: (id: string) => Promise<void>;
  clearHistory: () => Promise<void>;
  searchHistory: (keyword: string) => QueryHistory[];
  isLoading: boolean;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [history, setHistory] = useState<QueryHistory[]>([]);
  const [activeMode, setActiveMode] = useState<ClinicalMode>("point_of_care");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const raw = await AsyncStorage.getItem(HISTORY_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as QueryHistory[];
        setHistory(parsed);
      }
    } catch (e) {
      console.error("Failed to load history:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const saveHistory = useCallback(async (entries: QueryHistory[]) => {
    try {
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(entries));
    } catch (e) {
      console.error("Failed to save history:", e);
    }
  }, []);

  const addToHistory = useCallback(
    async (entry: Omit<QueryHistory, "id" | "timestamp">) => {
      const newEntry: QueryHistory = {
        ...entry,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
      };
      setHistory((prev) => {
        const updated = [newEntry, ...prev].slice(0, MAX_HISTORY);
        saveHistory(updated);
        return updated;
      });
    },
    [saveHistory]
  );

  const deleteFromHistory = useCallback(
    async (id: string) => {
      setHistory((prev) => {
        const updated = prev.filter((h) => h.id !== id);
        saveHistory(updated);
        return updated;
      });
    },
    [saveHistory]
  );

  const clearHistory = useCallback(async () => {
    setHistory([]);
    await AsyncStorage.removeItem(HISTORY_KEY);
  }, []);

  const searchHistory = useCallback(
    (keyword: string) => {
      if (!keyword.trim()) return history;
      const lower = keyword.toLowerCase();
      return history.filter(
        (h) =>
          h.query.toLowerCase().includes(lower) ||
          h.condition?.toLowerCase().includes(lower) ||
          h.system?.toLowerCase().includes(lower) ||
          h.mode.toLowerCase().includes(lower)
      );
    },
    [history]
  );

  return (
    <AppContext.Provider
      value={{
        history,
        activeMode,
        setActiveMode,
        addToHistory,
        deleteFromHistory,
        clearHistory,
        searchHistory,
        isLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
