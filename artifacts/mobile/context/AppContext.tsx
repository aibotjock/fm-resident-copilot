import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type {
  AppMode,
  Bookmark,
  ClinicalMode,
  QueryHistory,
  SRSCard,
  SRSRating,
} from "@/types";

const HISTORY_KEY = "@fm_copilot_history";
const BOOKMARKS_KEY = "@fm_copilot_bookmarks";
const SRS_KEY = "@fm_copilot_srs_cards";
const APP_MODE_KEY = "@fm_copilot_app_mode";
const MAX_HISTORY = 200;
const MAX_BOOKMARKS = 200;

function applyRating(card: SRSCard, rating: SRSRating): SRSCard {
  let { easeFactor, interval, repetitions } = card;

  if (rating >= 3) {
    if (repetitions === 0) interval = 1;
    else if (repetitions === 1) interval = 6;
    else interval = Math.round(interval * easeFactor);
    repetitions++;
    easeFactor = Math.max(
      1.3,
      easeFactor + 0.1 - (4 - rating) * (0.08 + (4 - rating) * 0.02)
    );
  } else if (rating === 1) {
    interval = Math.max(1, Math.round(interval * 0.5));
  } else {
    interval = 1;
    repetitions = 0;
  }

  const dueDate = Date.now() + interval * 24 * 60 * 60 * 1000;
  return { ...card, easeFactor, interval, repetitions, dueDate, lastReviewed: Date.now() };
}

interface AppContextValue {
  history: QueryHistory[];
  activeMode: ClinicalMode;
  setActiveMode: (mode: ClinicalMode) => void;
  addToHistory: (entry: Omit<QueryHistory, "id" | "timestamp">) => Promise<void>;
  deleteFromHistory: (id: string) => Promise<void>;
  clearHistory: () => Promise<void>;
  searchHistory: (keyword: string) => QueryHistory[];
  reloadHistory: () => Promise<void>;
  isLoading: boolean;

  appMode: AppMode;
  setAppMode: (mode: AppMode) => Promise<void>;

  bookmarks: Bookmark[];
  addBookmark: (entry: Omit<Bookmark, "id" | "timestamp">) => Promise<void>;
  removeBookmark: (id: string) => Promise<void>;
  isBookmarked: (query: string, mode: ClinicalMode) => boolean;

  srsCards: SRSCard[];
  addSRSCards: (
    cards: Array<{
      front: string;
      back: string;
      condition?: string;
      topic: string;
    }>
  ) => Promise<number>;
  updateSRSCard: (id: string, rating: SRSRating) => Promise<void>;
  deleteSRSCard: (id: string) => Promise<void>;
  clearSRSDeck: () => Promise<void>;
  getDueCards: () => SRSCard[];
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [history, setHistory] = useState<QueryHistory[]>([]);
  const [activeMode, setActiveMode] = useState<ClinicalMode>("point_of_care");
  const [isLoading, setIsLoading] = useState(true);
  const [appMode, setAppModeState] = useState<AppMode>("clinical");
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [srsCards, setSrsCards] = useState<SRSCard[]>([]);

  const loadAll = useCallback(async () => {
    try {
      const [rawHistory, rawBookmarks, rawSRS, rawMode] = await Promise.all([
        AsyncStorage.getItem(HISTORY_KEY),
        AsyncStorage.getItem(BOOKMARKS_KEY),
        AsyncStorage.getItem(SRS_KEY),
        AsyncStorage.getItem(APP_MODE_KEY),
      ]);
      if (rawHistory) setHistory(JSON.parse(rawHistory));
      if (rawBookmarks) setBookmarks(JSON.parse(rawBookmarks));
      if (rawSRS) setSrsCards(JSON.parse(rawSRS));
      if (rawMode) setAppModeState(JSON.parse(rawMode) as AppMode);
    } catch (e) {
      console.error("Failed to load app data:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const saveHistory = useCallback(async (entries: QueryHistory[]) => {
    try {
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(entries));
    } catch (e) {
      console.error("Failed to save history:", e);
    }
  }, []);

  const saveBookmarks = useCallback(async (entries: Bookmark[]) => {
    try {
      await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(entries));
    } catch (e) {
      console.error("Failed to save bookmarks:", e);
    }
  }, []);

  const saveSRS = useCallback(async (cards: SRSCard[]) => {
    try {
      await AsyncStorage.setItem(SRS_KEY, JSON.stringify(cards));
    } catch (e) {
      console.error("Failed to save SRS cards:", e);
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

  const setAppMode = useCallback(
    async (mode: AppMode) => {
      setAppModeState(mode);
      try {
        await AsyncStorage.setItem(APP_MODE_KEY, JSON.stringify(mode));
      } catch {}
    },
    []
  );

  const addBookmark = useCallback(
    async (entry: Omit<Bookmark, "id" | "timestamp">) => {
      const newBookmark: Bookmark = {
        ...entry,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
      };
      setBookmarks((prev) => {
        const updated = [newBookmark, ...prev].slice(0, MAX_BOOKMARKS);
        saveBookmarks(updated);
        return updated;
      });
    },
    [saveBookmarks]
  );

  const removeBookmark = useCallback(
    async (id: string) => {
      setBookmarks((prev) => {
        const updated = prev.filter((b) => b.id !== id);
        saveBookmarks(updated);
        return updated;
      });
    },
    [saveBookmarks]
  );

  const isBookmarked = useCallback(
    (query: string, mode: ClinicalMode) => {
      return bookmarks.some((b) => b.query === query && b.mode === mode);
    },
    [bookmarks]
  );

  const addSRSCards = useCallback(
    async (
      cards: Array<{
        front: string;
        back: string;
        condition?: string;
        topic: string;
      }>
    ) => {
      const now = Date.now();
      const newCards: SRSCard[] = cards.map((c) => ({
        id: now.toString() + Math.random().toString(36).substr(2, 9),
        front: c.front,
        back: c.back,
        condition: c.condition,
        topic: c.topic,
        easeFactor: 2.5,
        interval: 1,
        repetitions: 0,
        dueDate: now,
        createdAt: now,
      }));
      setSrsCards((prev) => {
        const updated = [...newCards, ...prev];
        saveSRS(updated);
        return updated;
      });
      return newCards.length;
    },
    [saveSRS]
  );

  const updateSRSCard = useCallback(
    async (id: string, rating: SRSRating) => {
      setSrsCards((prev) => {
        const updated = prev.map((c) =>
          c.id === id ? applyRating(c, rating) : c
        );
        saveSRS(updated);
        return updated;
      });
    },
    [saveSRS]
  );

  const deleteSRSCard = useCallback(
    async (id: string) => {
      setSrsCards((prev) => {
        const updated = prev.filter((c) => c.id !== id);
        saveSRS(updated);
        return updated;
      });
    },
    [saveSRS]
  );

  const clearSRSDeck = useCallback(async () => {
    setSrsCards([]);
    await AsyncStorage.removeItem(SRS_KEY);
  }, []);

  const getDueCards = useCallback(() => {
    const now = Date.now();
    return srsCards.filter((c) => c.dueDate <= now);
  }, [srsCards]);

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
        reloadHistory: loadAll,
        isLoading,
        appMode,
        setAppMode,
        bookmarks,
        addBookmark,
        removeBookmark,
        isBookmarked,
        srsCards,
        addSRSCards,
        updateSRSCard,
        deleteSRSCard,
        clearSRSDeck,
        getDueCards,
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
