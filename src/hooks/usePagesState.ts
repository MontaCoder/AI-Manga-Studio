import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ASPECT_RATIOS, DEFAULT_ASPECT_RATIO, type AspectRatioKey } from '@/constants/aspectRatios';
import type { Page, CanvasShape, ViewTransform } from '@/types';

const STORAGE_KEY = 'manga_pages_draft';
const SAVE_DEBOUNCE_MS = 1000;

const basePageState: Omit<Page, 'id' | 'name'> = {
  shapes: [],
  shapesHistory: [[]],
  shapesHistoryIndex: 0,
  panelLayoutImage: null,
  sceneDescription: '',
  panelCharacterMap: {},
  generatedImage: null,
  generatedText: null,
  generatedColorMode: null,
  aspectRatio: DEFAULT_ASPECT_RATIO,
  viewTransform: { scale: 1, x: 0, y: 0 },
  shouldReferencePrevious: false,
  assistantProposalImage: null,
  proposalOpacity: 0.5,
  isProposalVisible: true,
  proposedShapes: null,
};

export const createPage = (name: string, aspectRatio: AspectRatioKey = DEFAULT_ASPECT_RATIO): Page => ({
  ...basePageState,
  id: Date.now().toString(),
  name,
  aspectRatio,
});

interface UsePagesStateParams {
  createPageName: (index: number) => string;
  initialAspectRatio?: AspectRatioKey;
  initialState?: {
    pages: Page[];
    currentPageId?: string;
  };
  persistKey?: string | null;
  persistDebounceMs?: number;
}

const normalizeAspectRatio = (aspectRatio: string | undefined): AspectRatioKey =>
  (ASPECT_RATIOS[aspectRatio as AspectRatioKey] ? (aspectRatio as AspectRatioKey) : DEFAULT_ASPECT_RATIO);

const reindexPages = (pages: Page[], createPageName: (index: number) => string) =>
  pages.map((page, index) => ({
    ...page,
    name: createPageName(index + 1),
    aspectRatio: normalizeAspectRatio(page.aspectRatio),
  }));

export function usePagesState({
  createPageName,
  initialAspectRatio = DEFAULT_ASPECT_RATIO,
  initialState,
  persistKey = STORAGE_KEY,
  persistDebounceMs = SAVE_DEBOUNCE_MS,
}: UsePagesStateParams) {
  const initialPageRef = useRef<Page>();
  if (!initialPageRef.current) {
    initialPageRef.current = createPage(createPageName(1), initialAspectRatio);
  }

  const [pages, setPages] = useState<Page[]>(() => {
    if (initialState?.pages?.length) {
      return reindexPages(initialState.pages, createPageName);
    }
    return reindexPages([initialPageRef.current!], createPageName);
  });
  const [currentPageId, setCurrentPageId] = useState<string>(() => {
    if (initialState?.currentPageId) {
      return initialState.currentPageId;
    }
    if (initialState?.pages?.length) {
      return initialState.pages[0].id;
    }
    return initialPageRef.current!.id;
  });

  const currentPage = useMemo(() => pages.find(p => p.id === currentPageId) || pages[0], [pages, currentPageId]);

  const applyPages = useCallback(
    (updater: Page[] | ((prev: Page[]) => Page[])) =>
      setPages(prev => {
        const next = typeof updater === 'function' ? (updater as (pages: Page[]) => Page[])(prev) : updater;
        return reindexPages(next, createPageName);
      }),
    [createPageName],
  );

  const handleUpdateCurrentPage = useCallback(
    (updates: Partial<Page>) => {
      applyPages(prev => prev.map(p => (p.id === currentPageId ? { ...p, ...updates } : p)));
    },
    [applyPages, currentPageId],
  );

  const handleViewTransformChange = useCallback(
    (viewTransform: ViewTransform) => {
      handleUpdateCurrentPage({ viewTransform });
    },
    [handleUpdateCurrentPage],
  );

  const handleShapesChange = useCallback(
    (newShapes: CanvasShape[], recordHistory: boolean = true) => {
      applyPages(prevPages =>
        prevPages.map(p => {
          if (p.id !== currentPageId) return p;

          let updatedSceneDescription = p.sceneDescription;
          const newPanelCount = newShapes.filter(s => s.type === 'panel').length;
          const oldPanelCount = p.shapes.filter(s => s.type === 'panel').length;

          if (newPanelCount !== oldPanelCount) {
            const existingPanels: Record<string, string> = {};
            const panelRegex = /Panel (\d+):([\s\S]*?)(?=\n\nPanel \d+:|$)/g;
            let match;
            while ((match = panelRegex.exec(p.sceneDescription)) !== null) {
              existingPanels[match[1]] = match[2].trim();
            }

            if (newPanelCount > 0) {
              let newDesc = '';
              for (let i = 1; i <= newPanelCount; i++) {
                newDesc += `Panel ${i}: ${existingPanels[i] || ''}\n\n`;
              }
              updatedSceneDescription = newDesc.trim();
            } else {
              updatedSceneDescription = '';
            }
          }

          if (recordHistory) {
            const newHistory = p.shapesHistory.slice(0, p.shapesHistoryIndex + 1);
            newHistory.push(newShapes);
            return {
              ...p,
              shapes: newShapes,
              shapesHistory: newHistory,
              shapesHistoryIndex: newHistory.length - 1,
              sceneDescription: updatedSceneDescription,
            };
          }

          const newHistory = [...p.shapesHistory];
          newHistory[p.shapesHistoryIndex] = newShapes;
          return {
            ...p,
            shapes: newShapes,
            shapesHistory: newHistory,
            sceneDescription: updatedSceneDescription,
          };
        }),
      );
    },
    [applyPages, currentPageId],
  );

  const handleUndo = useCallback(() => {
    applyPages(prevPages =>
      prevPages.map(p => {
        if (p.id !== currentPageId || p.shapesHistoryIndex <= 0) return p;
        const newIndex = p.shapesHistoryIndex - 1;
        return {
          ...p,
          shapes: p.shapesHistory[newIndex],
          shapesHistoryIndex: newIndex,
        };
      }),
    );
  }, [applyPages, currentPageId]);

  const handleRedo = useCallback(() => {
    applyPages(prevPages =>
      prevPages.map(p => {
        if (p.id !== currentPageId || p.shapesHistoryIndex >= p.shapesHistory.length - 1) return p;
        const newIndex = p.shapesHistoryIndex + 1;
        return {
          ...p,
          shapes: p.shapesHistory[newIndex],
          shapesHistoryIndex: newIndex,
        };
      }),
    );
  }, [applyPages, currentPageId]);

  const handleAddPage = useCallback(
    (switchToNewPage: boolean = true, aspectRatio: AspectRatioKey | undefined = undefined) => {
      let newPageId: string | null = null;
      applyPages(prev => {
        const nextPage = createPage(createPageName(prev.length + 1), aspectRatio ?? currentPage.aspectRatio);
        newPageId = nextPage.id;
        return [...prev, nextPage];
      });
      if (switchToNewPage && newPageId) {
        setCurrentPageId(newPageId);
      }
    },
    [applyPages, createPageName, currentPage.aspectRatio],
  );

  const handleDeletePage = useCallback(
    (idToDelete: string) => {
      applyPages(prev => {
        if (prev.length <= 1) return prev;
        const filtered = prev.filter(p => p.id !== idToDelete);
        if (filtered.length === prev.length) return prev;
        if (idToDelete === currentPageId && filtered.length > 0) {
          setCurrentPageId(filtered[0].id);
        }
        return filtered;
      });
    },
    [applyPages, currentPageId],
  );

  const handleToggleReferencePrevious = useCallback(
    (pageId: string) => {
      applyPages(prev => prev.map(p => (p.id === pageId ? { ...p, shouldReferencePrevious: !p.shouldReferencePrevious } : p)));
    },
    [applyPages],
  );

  const canUndo = currentPage.shapesHistoryIndex > 0;
  const canRedo = currentPage.shapesHistoryIndex < currentPage.shapesHistory.length - 1;

  useEffect(() => {
    if (pages.length === 0) return;
    if (!pages.some(p => p.id === currentPageId)) {
      setCurrentPageId(pages[0].id);
    }
  }, [pages, currentPageId]);

  useEffect(() => {
    if (!persistKey || typeof window === 'undefined') return;
    const timeout = window.setTimeout(() => {
      try {
        const dataToSave = {
          pages,
          currentPageId,
          savedAt: Date.now(),
        };
        window.localStorage.setItem(persistKey, JSON.stringify(dataToSave));
      } catch (error) {
        console.warn('Failed to save pages to localStorage:', error);
      }
    }, persistDebounceMs);

    return () => window.clearTimeout(timeout);
  }, [pages, currentPageId, persistDebounceMs, persistKey]);

  const clearSavedDraft = useCallback(() => {
    if (!persistKey || typeof window === 'undefined') return;
    try {
      window.localStorage.removeItem(persistKey);
    } catch (error) {
      console.warn('Failed to clear saved draft:', error);
    }
  }, [persistKey]);

  return {
    pages,
    setPages: applyPages,
    currentPageId,
    setCurrentPageId,
    currentPage,
    handleUpdateCurrentPage,
    handleViewTransformChange,
    handleShapesChange,
    handleUndo,
    handleRedo,
    canUndo,
    canRedo,
    handleAddPage,
    handleDeletePage,
    handleToggleReferencePrevious,
    clearSavedDraft,
  };
}

export function loadSavedDraft(storageKey: string = STORAGE_KEY): { pages: Page[]; currentPageId: string; savedAt: number } | null {
  try {
    const saved = typeof window !== 'undefined' ? window.localStorage.getItem(storageKey) : null;
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.pages && Array.isArray(parsed.pages) && parsed.pages.length > 0) {
        return parsed;
      }
    }
  } catch (error) {
    console.warn('Failed to load saved draft:', error);
  }
  return null;
}
