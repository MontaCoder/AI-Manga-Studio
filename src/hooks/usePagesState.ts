import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Page, CanvasShape, ViewTransform } from '../types';

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
  aspectRatio: 'A4',
  viewTransform: { scale: 1, x: 0, y: 0 },
  shouldReferencePrevious: false,
  assistantProposalImage: null,
  proposalOpacity: 0.5,
  isProposalVisible: true,
  proposedShapes: null,
};

export const createPage = (name: string, aspectRatio: Page['aspectRatio'] = 'A4'): Page => ({
  ...basePageState,
  id: Date.now().toString(),
  name,
  aspectRatio,
});

interface UsePagesStateParams {
  createPageName: (index: number) => string;
  initialAspectRatio?: Page['aspectRatio'];
  initialState?: {
    pages: Page[];
    currentPageId?: string;
  };
}

export function usePagesState({ createPageName, initialAspectRatio = 'A4', initialState }: UsePagesStateParams) {
  const initialPageRef = useRef<Page>();
  if (!initialPageRef.current) {
    initialPageRef.current = createPage(createPageName(1), initialAspectRatio);
  }

  const [pages, setPages] = useState<Page[]>(() => {
    if (initialState?.pages?.length) {
      return initialState.pages;
    }
    return [initialPageRef.current!];
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

  const handleUpdateCurrentPage = useCallback((updates: Partial<Page>) => {
    setPages(prev => prev.map(p => (p.id === currentPageId ? { ...p, ...updates } : p)));
  }, [currentPageId]);

  const handleViewTransformChange = useCallback((viewTransform: ViewTransform) => {
    handleUpdateCurrentPage({ viewTransform });
  }, [handleUpdateCurrentPage]);

  const handleShapesChange = useCallback((newShapes: CanvasShape[], recordHistory: boolean = true) => {
    setPages(prevPages => prevPages.map(p => {
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
    }));
  }, [currentPageId]);

  const handleUndo = useCallback(() => {
    setPages(prevPages => prevPages.map(p => {
      if (p.id !== currentPageId || p.shapesHistoryIndex <= 0) return p;
      const newIndex = p.shapesHistoryIndex - 1;
      return {
        ...p,
        shapes: p.shapesHistory[newIndex],
        shapesHistoryIndex: newIndex,
      };
    }));
  }, [currentPageId]);

  const handleRedo = useCallback(() => {
    setPages(prevPages => prevPages.map(p => {
      if (p.id !== currentPageId || p.shapesHistoryIndex >= p.shapesHistory.length - 1) return p;
      const newIndex = p.shapesHistoryIndex + 1;
      return {
        ...p,
        shapes: p.shapesHistory[newIndex],
        shapesHistoryIndex: newIndex,
      };
    }));
  }, [currentPageId]);

  const handleAddPage = useCallback((switchToNewPage: boolean = true, aspectRatio: Page['aspectRatio'] | undefined = undefined) => {
    let newPageId: string | null = null;
    setPages(prev => {
      const nextPage = createPage(createPageName(prev.length + 1), aspectRatio ?? currentPage.aspectRatio);
      newPageId = nextPage.id;
      return [...prev, nextPage];
    });
    if (switchToNewPage && newPageId) {
      setCurrentPageId(newPageId);
    }
  }, [createPageName, currentPage.aspectRatio]);

  const handleDeletePage = useCallback((idToDelete: string) => {
    setPages(prev => {
      if (prev.length <= 1) return prev;
      const filtered = prev.filter(p => p.id !== idToDelete);
      if (filtered.length === prev.length) return prev;
      if (idToDelete === currentPageId && filtered.length > 0) {
        setCurrentPageId(filtered[0].id);
      }
      return filtered;
    });
  }, [currentPageId]);

  const handleToggleReferencePrevious = useCallback((pageId: string) => {
    setPages(prev => prev.map(p => p.id === pageId ? { ...p, shouldReferencePrevious: !p.shouldReferencePrevious } : p));
  }, []);

  const canUndo = currentPage.shapesHistoryIndex > 0;
  const canRedo = currentPage.shapesHistoryIndex < currentPage.shapesHistory.length - 1;

  // Auto-save to localStorage with debounce
  useEffect(() => {
    const timeout = setTimeout(() => {
      try {
        const dataToSave = {
          pages,
          currentPageId,
          savedAt: Date.now(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
      } catch (error) {
        console.warn('Failed to save pages to localStorage:', error);
      }
    }, SAVE_DEBOUNCE_MS);

    return () => clearTimeout(timeout);
  }, [pages, currentPageId]);

  // Function to clear saved draft
  const clearSavedDraft = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to clear saved draft:', error);
    }
  }, []);

  return {
    pages,
    setPages,
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

// Helper function to load saved draft from localStorage
export function loadSavedDraft(): { pages: Page[]; currentPageId: string; savedAt: number } | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
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
