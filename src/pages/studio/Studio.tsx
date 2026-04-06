import React, { Suspense, lazy, useState, useCallback, useRef, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { ApiKeyModal } from '@/components/modals/ApiKeyModal';
import { generateMangaPage, colorizeMangaPage, editMangaPage, generateDetailedStorySuggestion, generateLayoutProposal, analyzeAndSuggestCorrections } from '@/services/geminiService';
import type { Character, Page, StorySuggestion, ImageShape, AnalysisResult } from '@/types';
import { StudioSidebar } from './components/StudioSidebar';
import { StudioCanvasPane } from './components/StudioCanvasPane';
import { StudioUtilityPane } from './components/StudioUtilityPane';

import { useLocalization } from '@/hooks/useLocalization';
import { useApiKey } from '@/hooks/useApiKey';
import { usePagesState, createPage } from '@/hooks/usePagesState';
import { ASPECT_RATIOS, type AspectRatioKey } from '@/constants/aspectRatios';

const STUDIO_STORAGE_KEY = 'aims_studio_state_v1';

const CharacterGenerationModal = lazy(() => import('@/features/character-management/components/CharacterGenerationModal').then(module => ({ default: module.CharacterGenerationModal })));
const ExportModal = lazy(() => import('@/components/modals/ExportModal').then(module => ({ default: module.ExportModal })));
const MangaViewerModal = lazy(() => import('@/features/story-generation/components/MangaViewerModal').then(module => ({ default: module.MangaViewerModal })));
const MaskingModal = lazy(() => import('@/components/modals/MaskingModal').then(module => ({ default: module.MaskingModal })));
const StorySuggestionModal = lazy(() => import('@/features/story-generation/components/StorySuggestionModal').then(module => ({ default: module.StorySuggestionModal })));
const VideoProducer = lazy(() => import('@/features/video-producer/VideoProducer').then(module => ({ default: module.VideoProducer })));
const WorldviewModal = lazy(() => import('@/features/story-generation/components/WorldviewModal').then(module => ({ default: module.WorldviewModal })));

interface PersistedStudioState {
  pagesState?: {
    pages: Page[];
    currentPageId?: string;
  };
  characters?: Character[];
  colorMode?: 'color' | 'monochrome';
  viewMode?: 'editor' | 'result';
  generateEmptyBubbles?: boolean;
  worldview?: string;
  currentView?: 'manga-editor' | 'video-producer';
  isSidebarOpen?: boolean;
}

export function Studio(): React.ReactElement {
  const { t, language, setLanguage } = useLocalization();
  const { isApiKeyModalOpen, setIsApiKeyModalOpen, saveApiKey, hasApiKey } = useApiKey();

  const createPageName = useCallback((index: number) => `${t('pages')} ${index}`, [t]);

  const [persistedState] = useState<PersistedStudioState | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const raw = window.localStorage.getItem(STUDIO_STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as PersistedStudioState;
      if (parsed?.pagesState?.pages?.length) {
        return parsed;
      }
      return null;
    } catch (error) {
      console.warn('Failed to parse stored studio state', error);
      return null;
    }
  });

  const {
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
    handleAddPage,
    handleDeletePage,
    handleToggleReferencePrevious,
    clearSavedDraft,
  } = usePagesState({ createPageName, initialState: persistedState?.pagesState, persistKey: null });
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(() => persistedState?.isSidebarOpen ?? true);
  const [characters, setCharacters] = useState<Character[]>(() => persistedState?.characters ?? []);
  const [showCharacterModal, setShowCharacterModal] = useState<boolean>(false);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [colorMode, setColorMode] = useState<'color' | 'monochrome'>(() => persistedState?.colorMode ?? 'monochrome');
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isColoring, setIsColoring] = useState<boolean>(false);
  const [isSuggestingStory, setIsSuggestingStory] = useState<boolean>(false);
  const [isSuggestingLayout, setIsSuggestingLayout] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [isAspectRatioOpen, setIsAspectRatioOpen] = useState(false);
  const [isDraggingCharacter, setIsDraggingCharacter] = useState(false);
  const [showMangaViewer, setShowMangaViewer] = useState(false);
  const [isMasking, setIsMasking] = useState(false);
  const [currentMask, setCurrentMask] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'editor' | 'result'>(() => persistedState?.viewMode ?? 'editor');
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const [worldview, setWorldview] = useState<string>(() => persistedState?.worldview ?? '');
  const [showWorldviewModal, setShowWorldviewModal] = useState<boolean>(false);
  const [showStorySuggestionModal, setShowStorySuggestionModal] = useState<boolean>(false);
  const [storySuggestion, setStorySuggestion] = useState<StorySuggestion | null>(null);
  const [generateEmptyBubbles, setGenerateEmptyBubbles] = useState<boolean>(() => persistedState?.generateEmptyBubbles ?? false);

  const [assistantModeState, setAssistantModeState] = useState<{
    isActive: boolean;
    totalPages: number;
    currentPageNumber: number;
    statusMessage: string;
    hasError?: boolean;
    failedPageNumber?: number;
  } | null>(null);
  const [persistError, setPersistError] = useState<string | null>(null);

  const workspaceCanvasRef = useRef<HTMLElement | null>(null);
  const sidebarRef = useRef<HTMLElement>(null);
  const sidebarCloseButtonRef = useRef<HTMLButtonElement>(null);
  const stopAutoGenerationRef = useRef(false);
  const currentPageIdRef = useRef(currentPageId);

  const [currentView, setCurrentView] = useState<'manga-editor' | 'video-producer'>(() => persistedState?.currentView ?? 'manga-editor');

  const ensureApiKey = useCallback(() => {
    if (hasApiKey) return true;
    setError(t('apiKeyRequired'));
    setIsApiKeyModalOpen(true);
    return false;
  }, [hasApiKey, setIsApiKeyModalOpen, t]);

  const handleResetWorkspace = useCallback(() => {
    clearSavedDraft();
    if (typeof window !== 'undefined') {
        window.localStorage.removeItem(STUDIO_STORAGE_KEY);
    }
    const freshPage = createPage(createPageName(1));
    setPages([freshPage]);
    setCurrentPageId(freshPage.id);
    setCharacters([]);
    setWorldview('');
    setColorMode('monochrome');
    setViewMode('editor');
    setCurrentMask(null);
    setAnalysisResult(null);
    setAssistantModeState(null);
    setError(null);
  }, [clearSavedDraft, createPageName, setPages, setCurrentPageId, setCharacters, setWorldview, setColorMode, setViewMode, setCurrentMask, setAnalysisResult, setAssistantModeState, setError]);

  const toggleFullscreen = useCallback(() => {
    const elem = workspaceCanvasRef.current;
    if (!elem) return;

    if (document.fullscreenElement === elem) {
      document.exitFullscreen();
      return;
    }

    elem.requestFullscreen().catch(err => {
      setError(`Failed to toggle fullscreen: ${err.message} (${err.name})`);
    });
  }, []);

  useEffect(() => {
      const onFullscreenChange = () => setIsFullscreen(document.fullscreenElement === workspaceCanvasRef.current);
      document.addEventListener('fullscreenchange', onFullscreenChange);
      return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  useEffect(() => {
    if (!isSidebarOpen) return;
    const mediaQuery = window.matchMedia('(max-width: 1024px)');
    if (mediaQuery.matches) {
      sidebarCloseButtonRef.current?.focus({ preventScroll: true });
    }
  }, [isSidebarOpen]);

  useEffect(() => {
    if (!isSidebarOpen) return;
    const mediaQuery = window.matchMedia('(max-width: 1024px)');

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsSidebarOpen(false);
        return;
      }

      if (!mediaQuery.matches || event.key !== 'Tab' || !sidebarRef.current) return;

      const focusable = sidebarRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;

      const firstElement = focusable[0];
      const lastElement = focusable[focusable.length - 1];

      if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      } else if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isSidebarOpen]);
  const panelEditorRef = useRef<{ getLayoutAsImage: (includeCharacters: boolean, characters: Character[]) => Promise<string> } | null>(null);

  useEffect(() => {
    setViewMode(currentPage.generatedImage ? 'result' : 'editor');
    setAnalysisResult(null);
  }, [currentPage.id, currentPage.generatedImage]);

  useEffect(() => {
    currentPageIdRef.current = currentPageId;
  }, [currentPageId]);

  useEffect(() => {
    setPages(prev => [...prev]);
  }, [createPageName, setPages]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stateToPersist: PersistedStudioState = {
        pagesState: { pages, currentPageId },
        characters,
        colorMode,
        viewMode,
        generateEmptyBubbles,
        worldview,
        currentView,
        isSidebarOpen,
      };
      window.localStorage.setItem(STUDIO_STORAGE_KEY, JSON.stringify(stateToPersist));
      setPersistError(null);
    } catch (error) {
      console.warn('Failed to persist studio state', error);
      setPersistError('Unable to save draft locally. Changes may not persist.');
    }
  }, [pages, currentPageId, characters, colorMode, viewMode, generateEmptyBubbles, worldview, currentView, isSidebarOpen]);

  const handleGenerateImage = useCallback(async () => {
    if (!ensureApiKey()) return;
    const targetPageId = currentPageId;
    setIsLoading(true);
    setError(null);
    try {
        let panelLayoutImage = currentPage.panelLayoutImage;
        const pageUpdates: Partial<Page> = {};

        if (!panelLayoutImage || viewMode === 'editor') {
            if (!panelEditorRef.current) {
                setError("Editor is not ready.");
                setIsLoading(false);
                return;
            }
            panelLayoutImage = await panelEditorRef.current.getLayoutAsImage(true, characters);
            pageUpdates.panelLayoutImage = panelLayoutImage;
        }
        if (!panelLayoutImage) {
            setError("Failed to capture panel layout.");
            setIsLoading(false);
            return;
        }
        
        const characterIdsInScene = new Set(currentPage.shapes.filter(s => s.type === 'image').map(s => (s as ImageShape).characterId));
        const relevantCharacters = characters.filter(c => characterIdsInScene.has(c.id));
        
        let previousPageData: Pick<Page, 'generatedImage' | 'sceneDescription'> | undefined = undefined;
        if (currentPage.shouldReferencePrevious) {
            const currentPageIndex = pages.findIndex(p => p.id === currentPageId);
            if (currentPageIndex > 0) {
                const prevPage = pages[currentPageIndex - 1];
                if (prevPage.generatedImage) {
                    previousPageData = {
                        generatedImage: prevPage.generatedImage,
                        sceneDescription: prevPage.sceneDescription
                    };
                }
            }
        }
        
        const result = await generateMangaPage(relevantCharacters, panelLayoutImage, currentPage.sceneDescription, colorMode, previousPageData, generateEmptyBubbles);
        if (currentPageIdRef.current !== targetPageId) return;
        pageUpdates.generatedImage = result.image;
        pageUpdates.generatedColorMode = colorMode;

        handleUpdateCurrentPage(pageUpdates);
        setCurrentMask(null);
        setAnalysisResult(null);
        setViewMode('result');
    } catch (e: unknown) {
        setError(e instanceof Error ? `Generation failed: ${e.message}` : "An unknown error occurred.");
    } finally {
        setIsLoading(false);
    }
  }, [currentPage, pages, currentPageId, characters, colorMode, handleUpdateCurrentPage, viewMode, generateEmptyBubbles, ensureApiKey]);

  const handleColorize = useCallback(async () => {
      if (!ensureApiKey()) return;
      const targetPageId = currentPageId;
      if (!currentPage.generatedImage) {
          setError("No generated image to colorize.");
          return;
      }
      setIsColoring(true);
      setError(null);
      try {
          const characterIdsInScene = new Set(currentPage.shapes.filter(s => s.type === 'image').map(s => (s as ImageShape).characterId));
          const relevantCharacters = characters.filter(c => characterIdsInScene.has(c.id));
          
          const coloredImage = await colorizeMangaPage(currentPage.generatedImage, relevantCharacters);
          if (currentPageIdRef.current !== targetPageId) return;
          handleUpdateCurrentPage({ generatedImage: coloredImage, generatedColorMode: 'color' });
          setAnalysisResult(null);
      } catch (e: unknown) {
          setError(e instanceof Error ? `Colorization failed: ${e.message}` : "An unknown error occurred.");
      } finally {
          setIsColoring(false);
      }
  }, [currentPage, characters, handleUpdateCurrentPage, ensureApiKey, currentPageId]);

 const handleEditImage = useCallback(async (editPrompt: string, editReferenceImages: string[] | null) => {
    if (!ensureApiKey()) return;
    const targetPageId = currentPageId;
    if (!currentPage.generatedImage) {
        setError("No generated image to edit.");
        return;
    }
    setIsLoading(true);
    setError(null);
    try {
        const editedImage = await editMangaPage(currentPage.generatedImage, editPrompt, currentMask || undefined, editReferenceImages || undefined);
        if (currentPageIdRef.current !== targetPageId) return;
        handleUpdateCurrentPage({ generatedImage: editedImage });
        setCurrentMask(null);
        setAnalysisResult(null);
    } catch (e: unknown) {
        setError(e instanceof Error ? `Editing failed: ${e.message}` : "An unknown error occurred during editing.");
    } finally {
        setIsLoading(false);
    }
  }, [currentPage.generatedImage, currentMask, handleUpdateCurrentPage, ensureApiKey, currentPageId]);

  const handleGenerateDetailedStory = async (premise: string, shouldContinue: boolean) => {
      if (!ensureApiKey()) return;
      setIsSuggestingStory(true);
      setError(null);
      setStorySuggestion(null);
      try {
          let previousPagesContext: Pick<Page, 'generatedImage' | 'sceneDescription'>[] | undefined = undefined;
          if (shouldContinue) {
              const currentPageIndex = pages.findIndex(p => p.id === currentPageId);
              if (currentPageIndex >= 0) {
                  const start = Math.max(0, currentPageIndex - 1);
                  previousPagesContext = pages.slice(start, currentPageIndex + 1)
                      .filter(p => p.generatedImage && p.sceneDescription)
                      .map(p => ({ generatedImage: p.generatedImage!, sceneDescription: p.sceneDescription }));
              }
          }
          const suggestion = await generateDetailedStorySuggestion(premise, worldview, characters, previousPagesContext);
          setStorySuggestion(suggestion);
      } catch (e) {
          setError(e instanceof Error ? `Story suggestion failed: ${e.message}` : "An unknown error occurred.");
      } finally {
          setIsSuggestingStory(false);
      }
  };

    const handleGenerateLayoutProposal = async () => {
        if (!ensureApiKey()) return;
        const targetPageId = currentPageId;
        setIsSuggestingLayout(true);
        setError(null);
        handleUpdateCurrentPage({ assistantProposalImage: null });

        let canvasImageForProposal: string;
        const hasShapes = currentPage.shapes.length > 0;

        if (hasShapes) {
            if (!panelEditorRef.current) {
                setError("Editor is not ready to capture the canvas.");
                setIsSuggestingLayout(false);
                return;
            }
            canvasImageForProposal = await panelEditorRef.current.getLayoutAsImage(true, characters);
        } else {
            const config = ASPECT_RATIOS[currentPage.aspectRatio];
            const canvas = document.createElement('canvas');
            canvas.width = config.w;
            canvas.height = config.h;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
            canvasImageForProposal = canvas.toDataURL('image/png');
        }

        const currentPageIndex = pages.findIndex(p => p.id === currentPageId);
        let previousPageLayout: { proposalImage: string, sceneDescription: string } | undefined = undefined;
        if (currentPageIndex > 0) {
            const prevPage = pages[currentPageIndex - 1];
            if (prevPage.assistantProposalImage && prevPage.sceneDescription) {
                previousPageLayout = {
                    proposalImage: prevPage.assistantProposalImage,
                    sceneDescription: prevPage.sceneDescription
                };
            }
        }

        try {
            const { proposalImage } = await generateLayoutProposal(
                currentPage.sceneDescription,
                characters,
                currentPage.aspectRatio,
                previousPageLayout,
                canvasImageForProposal
            );
            if (currentPageIdRef.current !== targetPageId) return;
            handleUpdateCurrentPage({ assistantProposalImage: proposalImage });
        } catch (e) {
            setError(e instanceof Error ? `Layout proposal failed: ${e.message}` : "An unknown error occurred.");
        } finally {
            setIsSuggestingLayout(false);
        }
    };
  
  const handleStartAutoGeneration = async (numPages: number, startFromPage: number = 1) => {
      setShowWorldviewModal(false);
      setError(null);
      if (!ensureApiKey()) return;
      if (characters.length === 0 && worldview === '') {
          setError(t('autoGenCharacterWarning'));
          return;
      }
      
      stopAutoGenerationRef.current = false;
      setAssistantModeState({ isActive: true, totalPages: numPages, currentPageNumber: startFromPage, statusMessage: t('autoGenStarting'), hasError: false });

      let currentLocalPages = [...pages];
      let localCurrentPageId: string;
      
      if (startFromPage > 1) {
        const retryPageIndex = startFromPage - 1;
        localCurrentPageId = currentLocalPages[retryPageIndex]?.id || currentLocalPages[currentLocalPages.length - 1].id;
      } else {
          const lastPage = currentLocalPages[currentLocalPages.length - 1];
          if (lastPage.assistantProposalImage || lastPage.shapes.length > 0 || lastPage.sceneDescription) {
              const newPage = createPage(createPageName(currentLocalPages.length + 1), lastPage.aspectRatio);
              currentLocalPages = [...currentLocalPages, newPage];
              localCurrentPageId = newPage.id;
          } else {
              localCurrentPageId = lastPage.id;
          }
      }
      
      setPages(currentLocalPages);
      setCurrentPageId(localCurrentPageId);
      
      let previousPageLayout: { proposalImage: string, sceneDescription: string } | undefined = undefined;
      const startIndex = startFromPage - 1;
      if (startIndex > 0 && currentLocalPages[startIndex - 1]) {
          const prevPage = currentLocalPages[startIndex - 1];
          if (prevPage.assistantProposalImage && prevPage.sceneDescription) {
              previousPageLayout = {
                  proposalImage: prevPage.assistantProposalImage,
                  sceneDescription: prevPage.sceneDescription
              };
          }
      }

      try {
        for (let i = startFromPage; i <= numPages; i++) {
          if (stopAutoGenerationRef.current) {
            setAssistantModeState(prevState => ({ ...prevState!, statusMessage: t('stopping') }));
            break;
          }
          const pageIndex = currentLocalPages.findIndex(p => p.id === localCurrentPageId);
          let pageObject = currentLocalPages[pageIndex];

          setAssistantModeState({ isActive: true, totalPages: numPages, currentPageNumber: i, statusMessage: t('autoGenStory', { current: i, total: numPages }) });
          
          let prevPageContext: Pick<Page, 'generatedImage' | 'sceneDescription'> | undefined;
          if (pageIndex > 0) {
              const prevPage = currentLocalPages[pageIndex - 1];
              if (prevPage.generatedImage && prevPage.sceneDescription) {
                  prevPageContext = { generatedImage: prevPage.generatedImage, sceneDescription: prevPage.sceneDescription };
              }
          }

          const storyPremise = `Generate the next part of the story for page ${i}.`;
          const story = await generateDetailedStorySuggestion(storyPremise, worldview, characters, prevPageContext ? [prevPageContext] : undefined);
          const sceneDescription = story.panels.map(p => `Panel ${p.panel}: ${p.description}${p.dialogue ? `\n${p.dialogue}` : ''}`).join('\n\n');
          
          pageObject = { ...pageObject, sceneDescription };

          if (!stopAutoGenerationRef.current) {
            setAssistantModeState({ isActive: true, totalPages: numPages, currentPageNumber: i, statusMessage: t('autoGenLayout', { current: i, total: numPages }) });
            const { proposalImage } = await generateLayoutProposal(sceneDescription, characters, pageObject.aspectRatio, previousPageLayout);

            previousPageLayout = { proposalImage, sceneDescription };
            pageObject = {
              ...pageObject,
              assistantProposalImage: proposalImage,
            };
          }

          currentLocalPages[pageIndex] = pageObject;
          
          if (i < numPages) {
              const newPage = createPage(createPageName(currentLocalPages.length + 1), pageObject.aspectRatio);
              currentLocalPages.push(newPage);
              localCurrentPageId = newPage.id;
              setCurrentPageId(localCurrentPageId);
          }

          setPages([...currentLocalPages]);
        }
      } catch (e: any) {
          const failedPageNumber = assistantModeState?.currentPageNumber || startFromPage;
          setAssistantModeState(prevState => ({
              ...(prevState!),
              isActive: true, 
              statusMessage: `Error on page ${failedPageNumber}: ${e.message}`,
              hasError: true,
              failedPageNumber: failedPageNumber,
          }));
          return;
      }
      
      setAssistantModeState(prevState => prevState ? {...prevState, statusMessage: t('autoGenComplete') || 'Generation Complete!', isActive: false} : null);
      setTimeout(() => setAssistantModeState(null), 2000);
      stopAutoGenerationRef.current = false;
      
  };

  const handleStopAutoGeneration = () => {
    stopAutoGenerationRef.current = true;
    setAssistantModeState(prevState => ({
        ...prevState!,
        statusMessage: t('stopping'),
    }));
  };

  const handleCharacterSave = (newCharacter: Omit<Character, 'id'>) => {
    setCharacters(prev => [...prev, { ...newCharacter, id: Date.now().toString() }]);
  };
  
  const handleDeleteCharacter = (idToDelete: string) => {
    setCharacters(prev => prev.filter(c => c.id !== idToDelete));
    setPages(prevPages => prevPages.map(page => ({
        ...page,
        shapes: page.shapes.filter(s => s.type !== 'image' || s.characterId !== idToDelete),
    })));
  };

  const handleAnalyzeResult = useCallback(async () => {
    if (!ensureApiKey()) return;
    if (!currentPage.panelLayoutImage || !currentPage.generatedImage) {
        setError(t('analysisError'));
        return;
    }
    setIsAnalyzing(true);
    setAnalysisResult(null);
    setError(null);
    try {
        const characterIdsInScene = new Set(currentPage.shapes.filter(s => s.type === 'image').map(s => (s as ImageShape).characterId));
        const relevantCharacters = characters.filter(c => characterIdsInScene.has(c.id));
        
        const result = await analyzeAndSuggestCorrections(
            currentPage.panelLayoutImage,
            currentPage.generatedImage,
            currentPage.sceneDescription,
            relevantCharacters
        );
        if (currentPageIdRef.current !== currentPageId) return;
        setAnalysisResult(result);
    } catch (e) {
        setError(e instanceof Error ? `Analysis failed: ${e.message}` : "An unknown error occurred during analysis.");
    } finally {
        setIsAnalyzing(false);
    }
  }, [currentPage, characters, ensureApiKey, currentPageId]);

  const handleApplyCorrection = useCallback(async () => {
    if (!analysisResult || !analysisResult.has_discrepancies || !analysisResult.correction_prompt) return;
    await handleEditImage(analysisResult.correction_prompt, null);
    setAnalysisResult(null);
  }, [analysisResult, handleEditImage]);
  
  const handleApplyLayout = useCallback(() => {
    if (!currentPage.assistantProposalImage) return;
    handleUpdateCurrentPage({
        generatedImage: currentPage.assistantProposalImage,
        panelLayoutImage: currentPage.assistantProposalImage,
        generatedColorMode: 'monochrome',
        shapes: [],
    });
    setViewMode('result');
  }, [currentPage.assistantProposalImage, handleUpdateCurrentPage]);

  const handleOpenExport = useCallback(() => {
    setShowExportModal(true);
  }, []);
  const isMonochromeResult = currentPage.generatedImage !== null && currentPage.generatedColorMode === 'monochrome';
  const anyLoading = isLoading || isColoring || isSuggestingLayout || isSuggestingStory || assistantModeState?.isActive || isAnalyzing;

  return (
    <div className="layout-shell studio-page">
      <a className="skip-link" href="#main-content">{t('skipToContent') || 'Skip to main content'}</a>
      <Header 
        isSidebarOpen={isSidebarOpen} 
        onToggleSidebar={() => setIsSidebarOpen(p => !p)}
        language={language}
        setLanguage={setLanguage}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        hasApiKey={hasApiKey}
        onShowMangaViewer={() => setShowMangaViewer(true)}
        onShowWorldview={() => setShowWorldviewModal(true)}
        currentView={currentView}
        onSetView={(view) => {
          if (view === 'video-producer' && !hasApiKey) {
            setIsApiKeyModalOpen(true);
            return;
          }
          setCurrentView(view);
        }}
        onExport={handleOpenExport}
      />
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onSave={(key) => saveApiKey(key)}
      />
      {persistError && <div className="status-card status-card--error mx-4 my-3" role="alert">{persistError}</div>}
      <Suspense fallback={null}>
        {showCharacterModal && <CharacterGenerationModal onClose={() => setShowCharacterModal(false)} onSave={handleCharacterSave} characters={characters} />}
        {showWorldviewModal && <WorldviewModal initialWorldview={worldview} onSave={(v) => { setWorldview(v); setShowWorldviewModal(false); }} onClose={() => setShowWorldviewModal(false)} onAutoGenerate={handleStartAutoGeneration} isGenerating={!!assistantModeState?.isActive} characters={characters} />}
        {showStorySuggestionModal && <StorySuggestionModal onClose={() => { setShowStorySuggestionModal(false); setStorySuggestion(null); setError(null); }} onGenerate={handleGenerateDetailedStory} isLoading={isSuggestingStory} suggestion={storySuggestion} onApply={(script) => { handleUpdateCurrentPage({ sceneDescription: script }); setShowStorySuggestionModal(false); setStorySuggestion(null); }} />}
        {showMangaViewer && <MangaViewerModal pages={pages} onClose={() => setShowMangaViewer(false)} />}
        {showExportModal && <ExportModal isOpen={showExportModal} onClose={() => setShowExportModal(false)} pages={pages} />}
        {isMasking && currentPage.generatedImage && <MaskingModal baseImage={currentPage.generatedImage} onClose={() => setIsMasking(false)} onSave={(maskDataUrl) => { setCurrentMask(maskDataUrl); setIsMasking(false); }} />}
      </Suspense>
      <div className="layout-main" id="main-content" tabIndex={-1}>
        {currentView === 'video-producer' ? (
          <div className="shell-scroll">
            <Suspense fallback={<div className="status-card">Loading...</div>}>
              <VideoProducer characters={characters} pages={pages} />
            </Suspense>
          </div>
        ) : (
          <>
          <div className="workspace-pane">
            <StudioSidebar
              sidebarRef={sidebarRef}
              sidebarCloseButtonRef={sidebarCloseButtonRef}
              isSidebarOpen={isSidebarOpen}
              currentPage={currentPage}
              pages={pages}
              currentPageId={currentPageId}
              assistantModeState={assistantModeState}
              isAspectRatioOpen={isAspectRatioOpen}
              characters={characters}
              onCloseSidebar={() => setIsSidebarOpen(false)}
              onToggleAspectRatio={() => setIsAspectRatioOpen(prev => !prev)}
              onSelectAspectRatio={(aspectRatio: AspectRatioKey) => {
                handleUpdateCurrentPage({ aspectRatio });
                setIsAspectRatioOpen(false);
              }}
              onResetWorkspace={handleResetWorkspace}
              onSelectPage={setCurrentPageId}
              onToggleReferencePrevious={handleToggleReferencePrevious}
              onDeletePage={handleDeletePage}
              onAddPage={handleAddPage}
              onDeleteCharacter={handleDeleteCharacter}
              onOpenCharacterModal={() => setShowCharacterModal(true)}
              onCharacterDragStart={(event, characterId) => {
                event.dataTransfer.setData('characterId', characterId);
                setIsDraggingCharacter(true);
              }}
              onCharacterDragEnd={() => setIsDraggingCharacter(false)}
            />

            <div className="workspace-pane__body">
              <StudioCanvasPane
                workspaceCanvasRef={workspaceCanvasRef}
                panelEditorRef={panelEditorRef}
                currentPage={currentPage}
                viewMode={viewMode}
                characters={characters}
                isDraggingCharacter={isDraggingCharacter}
                isColoring={isColoring}
                isMonochromeResult={isMonochromeResult}
                isFullscreen={isFullscreen}
                onToggleViewMode={() => setViewMode(prev => prev === 'result' ? 'editor' : 'result')}
                onColorize={handleColorize}
                onShapesChange={handleShapesChange}
                onViewTransformChange={handleViewTransformChange}
                onUndo={handleUndo}
                onRedo={handleRedo}
                onProposalSettingsChange={handleUpdateCurrentPage}
                onApplyLayout={handleApplyLayout}
                onToggleFullscreen={toggleFullscreen}
              />

              <StudioUtilityPane
                currentPage={currentPage}
                viewMode={viewMode}
                error={error}
                isLoading={isLoading}
                isColoring={isColoring}
                isAnalyzing={isAnalyzing}
                isSuggestingLayout={isSuggestingLayout}
                isSuggestingStory={isSuggestingStory}
                anyLoading={anyLoading}
                isMonochromeResult={isMonochromeResult}
                analysisResult={analysisResult}
                assistantModeState={assistantModeState}
                colorMode={colorMode}
                generateEmptyBubbles={generateEmptyBubbles}
                characters={characters}
                currentMask={currentMask}
                onColorize={handleColorize}
                onGenerateImage={handleGenerateImage}
                onEditImage={handleEditImage}
                onStartMasking={() => setIsMasking(true)}
                onClearMask={() => setCurrentMask(null)}
                onReturnToEditor={() => setViewMode('editor')}
                onAnalyze={handleAnalyzeResult}
                onApplyCorrection={handleApplyCorrection}
                onClearAnalysis={() => setAnalysisResult(null)}
                onStopAutoGeneration={handleStopAutoGeneration}
                onRetryAutoGeneration={handleStartAutoGeneration}
                onSceneDescriptionChange={(sceneDescription) => handleUpdateCurrentPage({ sceneDescription })}
                onSuggestLayout={handleGenerateLayoutProposal}
                onSuggestStory={() => setShowStorySuggestionModal(true)}
                onSetColorMode={setColorMode}
                onSetGenerateEmptyBubbles={setGenerateEmptyBubbles}
                onViewResult={() => setViewMode('result')}
              />
            </div>
          </div>
          {isSidebarOpen && <button type="button" className="sidebar-backdrop" aria-label="Toggle sidebar" onClick={() => setIsSidebarOpen(false)} />}
          </>
        )}
      </div>
    </div>
  );
}

