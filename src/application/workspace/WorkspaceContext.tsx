"use client";

import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import type { Page, PageId } from "@/domain/entities/page";

type WorkspaceState =
  | { mode: "home" }
  | { mode: "page"; page: Page }
  | { mode: "search"; previous: WorkspaceState }
  | { mode: "create" }
  | { mode: "trash" }
  | { mode: "settings" };

type UserSettings = {
  darkMode: boolean;
  autoSave: boolean;
  fontSize: number;
  defaultView: "home" | "lastOpened";
};

type WorkspaceContextValue = {
  state: WorkspaceState;
  pages: Page[];
  trashedPages: Page[];
  settings: UserSettings;

  openPage: (pageId: PageId) => void;
  goHome: () => void;

  openCreate: () => void;
  createPage: () => void;
  createChildPage: (parentId: PageId) => void;

  updatePageTitle: (pageId: PageId, title: string) => void;
  updatePageContent: (pageId: PageId, content: string) => void;

  deletePage: (pageId: PageId) => void;
  restorePage: (pageId: PageId) => void;
  permanentlyDeletePage: (pageId: PageId) => void;
  emptyTrash: () => void;

  favoritePageIds: Set<PageId>;
  toggleFavorite: (pageId: PageId) => void;

  openSearch: () => void;
  closeSearch: () => void;

  openTrash: () => void;
  closeTrash: () => void;

  openSettings: () => void;
  closeSettings: () => void;

  updateSettings: (settings: Partial<UserSettings>) => void;

  // New features
  duplicatePage: (pageId: PageId) => void;
  searchPages: (query: string) => Page[];
  getRecentPages: (limit?: number) => Page[];
  
  // Undo/Redo
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
};

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

const STORAGE_KEYS = {
  PAGES: "quietly-pages",
  TRASHED: "quietly-trashed",
  FAVORITES: "quietly-favorites",
  SETTINGS: "quietly-settings",
  LAST_PAGE: "quietly-last-page",
  RECENT_PAGES: "quietly-recent-pages",
} as const;

const DEFAULT_SETTINGS: UserSettings = {
  darkMode: true,
  autoSave: true,
  fontSize: 16,
  defaultView: "home",
};

function generatePageId(): PageId {
  return `page-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// History management for undo/redo
type HistoryState = {
  pages: Page[];
  trashedPages: Page[];
  favoritePageIds: PageId[];
};

const MAX_HISTORY = 50;

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [pages, setPages] = useState<Page[]>([]);
  const [trashedPages, setTrashedPages] = useState<Page[]>([]);
  const [state, setState] = useState<WorkspaceState>({ mode: "home" });
  const [favoritePageIds, setFavoritePageIds] = useState<Set<PageId>>(new Set());
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [recentPageIds, setRecentPageIds] = useState<PageId[]>([]);

  // History for undo/redo
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const isUndoRedoAction = useRef(false);

  // Auto-save timer - FIXED TYPE
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedPages = localStorage.getItem(STORAGE_KEYS.PAGES);
      const savedTrashed = localStorage.getItem(STORAGE_KEYS.TRASHED);
      const savedFavorites = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      const savedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      const savedRecent = localStorage.getItem(STORAGE_KEYS.RECENT_PAGES);

      if (savedPages) {
        const parsedPages = JSON.parse(savedPages);
        setPages(parsedPages);
      } else {
        // Initialize with default pages
        const defaultPages = [
          { id: generatePageId(), title: "Welcome to Quietly", content: "# Welcome!\n\nStart writing your notes here.", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
          { id: generatePageId(), title: "Getting Started", content: "## Tips\n\n- Use Cmd/Ctrl + K to search\n- Organize pages with sub-pages\n- Favorite important pages", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        ];
        setPages(defaultPages);
      }

      if (savedTrashed) setTrashedPages(JSON.parse(savedTrashed));
      if (savedFavorites) setFavoritePageIds(new Set(JSON.parse(savedFavorites)));
      if (savedSettings) setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(savedSettings) });
      if (savedRecent) setRecentPageIds(JSON.parse(savedRecent));

      setIsLoaded(true);
    } catch (error) {
      console.error("Failed to load workspace data:", error);
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage with debounce
  const saveToStorage = useCallback(() => {
    if (!isLoaded) return;

    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }

    saveTimerRef.current = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEYS.PAGES, JSON.stringify(pages));
        localStorage.setItem(STORAGE_KEYS.TRASHED, JSON.stringify(trashedPages));
        localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify([...favoritePageIds]));
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
        localStorage.setItem(STORAGE_KEYS.RECENT_PAGES, JSON.stringify(recentPageIds));
      } catch (error) {
        console.error("Failed to save workspace data:", error);
      }
    }, settings.autoSave ? 500 : 2000);
  }, [isLoaded, pages, trashedPages, favoritePageIds, settings, recentPageIds]);

  useEffect(() => {
    saveToStorage();
  }, [saveToStorage]);

  // Add to history for undo/redo
  const addToHistory = useCallback(() => {
    if (isUndoRedoAction.current) return;

    const newState: HistoryState = {
      pages: JSON.parse(JSON.stringify(pages)),
      trashedPages: JSON.parse(JSON.stringify(trashedPages)),
      favoritePageIds: [...favoritePageIds],
    };

    setHistory((prev) => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(newState);
      if (newHistory.length > MAX_HISTORY) {
        newHistory.shift();
        return newHistory;
      }
      return newHistory;
    });

    setHistoryIndex((prev) => Math.min(prev + 1, MAX_HISTORY - 1));
  }, [pages, trashedPages, favoritePageIds, historyIndex]);

  // Track changes for history
  useEffect(() => {
    if (isLoaded && !isUndoRedoAction.current) {
      addToHistory();
    }
  }, [pages.length, trashedPages.length]); // Only track structural changes

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      isUndoRedoAction.current = true;
      const prevState = history[historyIndex - 1];
      setPages(JSON.parse(JSON.stringify(prevState.pages)));
      setTrashedPages(JSON.parse(JSON.stringify(prevState.trashedPages)));
      setFavoritePageIds(new Set(prevState.favoritePageIds));
      setHistoryIndex((prev) => prev - 1);
      setTimeout(() => {
        isUndoRedoAction.current = false;
      }, 100);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      isUndoRedoAction.current = true;
      const nextState = history[historyIndex + 1];
      setPages(JSON.parse(JSON.stringify(nextState.pages)));
      setTrashedPages(JSON.parse(JSON.stringify(nextState.trashedPages)));
      setFavoritePageIds(new Set(nextState.favoritePageIds));
      setHistoryIndex((prev) => prev + 1);
      setTimeout(() => {
        isUndoRedoAction.current = false;
      }, 100);
    }
  }, [history, historyIndex]);

  // Track recent pages
  const addToRecent = useCallback((pageId: PageId) => {
    setRecentPageIds((prev) => {
      const filtered = prev.filter((id) => id !== pageId);
      return [pageId, ...filtered].slice(0, 10);
    });
  }, []);

  const openPage = useCallback((pageId: PageId) => {
    const page = pages.find((p) => p.id === pageId);
    if (!page) return;
    setState({ mode: "page", page });
    addToRecent(pageId);
    localStorage.setItem(STORAGE_KEYS.LAST_PAGE, pageId);
  }, [pages, addToRecent]);

  const goHome = useCallback(() => {
    setState({ mode: "home" });
  }, []);

  const openCreate = useCallback(() => {
    setState({ mode: "create" });
  }, []);

  const createPage = useCallback(() => {
    const baseTitle = "Untitled";
    const count = pages.filter(
      (p) => p.title === baseTitle || p.title.startsWith(`${baseTitle} `)
    ).length;

    const title = count === 0 ? baseTitle : `${baseTitle} ${count + 1}`;

    const newPage: Page = {
      id: generatePageId(),
      title,
      content: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setPages((prev) => [...prev, newPage]);
    setState({ mode: "page", page: newPage });
    addToRecent(newPage.id);
  }, [pages, addToRecent]);

  const createChildPage = useCallback((parentId: PageId) => {
    const baseTitle = "Untitled";
    const siblings = pages.filter((p) => p.parentId === parentId);

    const count = siblings.filter(
      (p) => p.title === baseTitle || p.title.startsWith(`${baseTitle} `)
    ).length;

    const title = count === 0 ? baseTitle : `${baseTitle} ${count + 1}`;

    const newPage: Page = {
      id: generatePageId(),
      title,
      content: "",
      parentId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setPages((prev) => [...prev, newPage]);
    setState({ mode: "page", page: newPage });
    addToRecent(newPage.id);
  }, [pages, addToRecent]);

  const updatePageTitle = useCallback((pageId: PageId, title: string) => {
    setPages((prev) =>
      prev.map((p) =>
        p.id === pageId
          ? { ...p, title, updatedAt: new Date().toISOString() }
          : p
      )
    );

    setState((prev) =>
      prev.mode === "page" && prev.page.id === pageId
        ? { mode: "page", page: { ...prev.page, title, updatedAt: new Date().toISOString() } }
        : prev
    );
  }, []);

  const updatePageContent = useCallback((pageId: PageId, content: string) => {
    setPages((prev) =>
      prev.map((p) =>
        p.id === pageId
          ? { ...p, content, updatedAt: new Date().toISOString() }
          : p
      )
    );

    setState((prev) =>
      prev.mode === "page" && prev.page.id === pageId
        ? { mode: "page", page: { ...prev.page, content, updatedAt: new Date().toISOString() } }
        : prev
    );
  }, []);

  const toggleFavorite = useCallback((pageId: PageId) => {
    setFavoritePageIds((prev) => {
      const next = new Set(prev);
      next.has(pageId) ? next.delete(pageId) : next.add(pageId);
      return next;
    });
  }, []);

  const openSearch = useCallback(() => {
    setState((prev) =>
      prev.mode === "search" ? prev : { mode: "search", previous: prev }
    );
  }, []);

  const closeSearch = useCallback(() => {
    setState((prev) => (prev.mode === "search" ? prev.previous : prev));
  }, []);

  const deletePage = useCallback((pageId: PageId) => {
    const page = pages.find((p) => p.id === pageId);
    if (!page) return;

    const childIds = new Set<PageId>();
    const collectChildren = (id: PageId) => {
      pages.forEach((p) => {
        if (p.parentId === id) {
          childIds.add(p.id);
          collectChildren(p.id);
        }
      });
    };
    collectChildren(pageId);

    const pagesToTrash = [page, ...pages.filter((p) => childIds.has(p.id))];
    
    setPages((prev) => prev.filter((p) => p.id !== pageId && !childIds.has(p.id)));
    setTrashedPages((prev) => [...prev, ...pagesToTrash]);

    setFavoritePageIds((prev) => {
      const next = new Set(prev);
      next.delete(pageId);
      childIds.forEach((id) => next.delete(id));
      return next;
    });

    if (state.mode === "page" && state.page.id === pageId) {
      goHome();
    }
  }, [pages, state, goHome]);

  const restorePage = useCallback((pageId: PageId) => {
    const page = trashedPages.find((p) => p.id === pageId);
    if (!page) return;

    const childIds = new Set<PageId>();
    const collectChildren = (id: PageId) => {
      trashedPages.forEach((p) => {
        if (p.parentId === id) {
          childIds.add(p.id);
          collectChildren(p.id);
        }
      });
    };
    collectChildren(pageId);

    const pagesToRestore = [page, ...trashedPages.filter((p) => childIds.has(p.id))];

    setTrashedPages((prev) => prev.filter((p) => p.id !== pageId && !childIds.has(p.id)));
    setPages((prev) => [...prev, ...pagesToRestore]);
  }, [trashedPages]);

  const permanentlyDeletePage = useCallback((pageId: PageId) => {
    const childIds = new Set<PageId>();
    const collectChildren = (id: PageId) => {
      trashedPages.forEach((p) => {
        if (p.parentId === id) {
          childIds.add(p.id);
          collectChildren(p.id);
        }
      });
    };
    collectChildren(pageId);

    setTrashedPages((prev) => prev.filter((p) => p.id !== pageId && !childIds.has(p.id)));
  }, [trashedPages]);

  const emptyTrash = useCallback(() => {
    setTrashedPages([]);
  }, []);

  const duplicatePage = useCallback((pageId: PageId) => {
    const page = pages.find((p) => p.id === pageId);
    if (!page) return;

    const newPage: Page = {
      ...page,
      id: generatePageId(),
      title: `${page.title} (Copy)`,
      parentId: page.parentId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setPages((prev) => [...prev, newPage]);
    setState({ mode: "page", page: newPage });
    addToRecent(newPage.id);
  }, [pages, addToRecent]);

  const searchPages = useCallback((query: string): Page[] => {
    if (!query.trim()) return [];

    const lowerQuery = query.toLowerCase();
    return pages.filter(
      (p) =>
        p.title.toLowerCase().includes(lowerQuery) ||
        p.content.toLowerCase().includes(lowerQuery)
    );
  }, [pages]);

  const getRecentPages = useCallback((limit = 5): Page[] => {
    return recentPageIds
      .map((id) => pages.find((p) => p.id === id))
      .filter((p): p is Page => p !== undefined)
      .slice(0, limit);
  }, [pages, recentPageIds]);

  const openTrash = useCallback(() => {
    setState({ mode: "trash" });
  }, []);

  const closeTrash = useCallback(() => {
    setState({ mode: "home" });
  }, []);

  const openSettings = useCallback(() => {
    setState({ mode: "settings" });
  }, []);

  const closeSettings = useCallback(() => {
    setState({ mode: "home" });
  }, []);

  const updateSettings = useCallback((newSettings: Partial<UserSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  // Apply dark mode
  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [settings.darkMode]);

  // Apply font size
  useEffect(() => {
    document.documentElement.style.setProperty('--font-size', `${settings.fontSize}px`);
  }, [settings.fontSize]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K for search
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        openSearch();
      }
      // Cmd/Ctrl + Z for undo
      if ((e.metaKey || e.ctrlKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      // Cmd/Ctrl + Shift + Z for redo
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "z") {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener("keydown", handleKeyboard);
    return () => window.removeEventListener("keydown", handleKeyboard);
  }, [openSearch, undo, redo]);

  if (!isLoaded) {
    return null; // or a loading spinner
  }

  return (
    <WorkspaceContext.Provider
      value={{
        state,
        pages,
        trashedPages,
        settings,

        openPage,
        goHome,

        openCreate,
        createPage,
        createChildPage,

        updatePageTitle,
        updatePageContent,

        deletePage,
        restorePage,
        permanentlyDeletePage,
        emptyTrash,

        favoritePageIds,
        toggleFavorite,

        openSearch,
        closeSearch,

        openTrash,
        closeTrash,

        openSettings,
        closeSettings,

        updateSettings,

        duplicatePage,
        searchPages,
        getRecentPages,

        canUndo: historyIndex > 0,
        canRedo: historyIndex < history.length - 1,
        undo,
        redo,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) {
    throw new Error("useWorkspace must be used within WorkspaceProvider");
  }
  return ctx;
}