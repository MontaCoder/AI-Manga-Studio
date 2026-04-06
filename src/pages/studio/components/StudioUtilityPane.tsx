import React from 'react';
import { GenerationControls } from './GenerationControls';
import { ResultDisplay } from './ResultDisplay';
import { useLocalization } from '@/hooks/useLocalization';
import type { AnalysisResult, Character, Page } from '@/types';

interface AssistantModeState {
    isActive: boolean;
    totalPages: number;
    currentPageNumber: number;
    statusMessage: string;
    hasError?: boolean;
    failedPageNumber?: number;
}

interface StudioUtilityPaneProps {
    currentPage: Page;
    viewMode: 'editor' | 'result';
    error: string | null;
    isLoading: boolean;
    isColoring: boolean;
    isAnalyzing: boolean;
    isSuggestingLayout: boolean;
    isSuggestingStory: boolean;
    anyLoading: boolean;
    isMonochromeResult: boolean;
    analysisResult: AnalysisResult | null;
    assistantModeState: AssistantModeState | null;
    colorMode: 'color' | 'monochrome';
    generateEmptyBubbles: boolean;
    characters: Character[];
    currentMask: string | null;
    onColorize: () => void;
    onGenerateImage: () => void;
    onEditImage: (prompt: string, editReferenceImages: string[] | null) => void;
    onStartMasking: () => void;
    onClearMask: () => void;
    onReturnToEditor: () => void;
    onAnalyze: () => void;
    onApplyCorrection: () => void;
    onClearAnalysis: () => void;
    onStopAutoGeneration: () => void;
    onRetryAutoGeneration: (totalPages: number, failedPageNumber?: number) => void;
    onSceneDescriptionChange: (sceneDescription: string) => void;
    onSuggestLayout: () => void;
    onSuggestStory: () => void;
    onSetColorMode: (mode: 'color' | 'monochrome') => void;
    onSetGenerateEmptyBubbles: (value: boolean) => void;
    onViewResult: () => void;
}

export function StudioUtilityPane({
    currentPage,
    viewMode,
    error,
    isLoading,
    isColoring,
    isAnalyzing,
    isSuggestingLayout,
    isSuggestingStory,
    anyLoading,
    isMonochromeResult,
    analysisResult,
    assistantModeState,
    colorMode,
    generateEmptyBubbles,
    characters,
    currentMask,
    onColorize,
    onGenerateImage,
    onEditImage,
    onStartMasking,
    onClearMask,
    onReturnToEditor,
    onAnalyze,
    onApplyCorrection,
    onClearAnalysis,
    onStopAutoGeneration,
    onRetryAutoGeneration,
    onSceneDescriptionChange,
    onSuggestLayout,
    onSuggestStory,
    onSetColorMode,
    onSetGenerateEmptyBubbles,
    onViewResult,
}: StudioUtilityPaneProps): React.ReactElement {
    const { t } = useLocalization();

    return (
        <aside className="utility-pane">
            {viewMode === 'result' && currentPage.generatedImage && !error ? (
                <ResultDisplay
                    isLoading={isLoading}
                    isColoring={isColoring}
                    generatedContent={{ image: currentPage.generatedImage, text: null }}
                    error={error}
                    isMonochromeResult={isMonochromeResult}
                    onColorize={onColorize}
                    onRegenerate={onGenerateImage}
                    onEdit={onEditImage}
                    onStartMasking={onStartMasking}
                    mask={currentMask}
                    onClearMask={onClearMask}
                    onReturnToEditor={onReturnToEditor}
                    isAnalyzing={isAnalyzing}
                    analysisResult={analysisResult}
                    onAnalyze={onAnalyze}
                    onApplyCorrection={onApplyCorrection}
                    onClearAnalysis={onClearAnalysis}
                    characters={characters}
                />
            ) : (
                <div className="result-shell">
                    {!anyLoading && <h2 className="utility-pane__group-title">{t('generateYourManga')}</h2>}
                    {anyLoading ? (
                        <div className="status-card">
                            {assistantModeState?.hasError ? (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-10 w-10 text-red-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                    <p className="status-card__title">{assistantModeState.statusMessage}</p>
                                    <button onClick={() => onRetryAutoGeneration(assistantModeState.totalPages, assistantModeState.failedPageNumber)} className="button-primary justify-center text-sm">{t('retryGeneration')}</button>
                                </>
                            ) : (
                                <>
                                    <div className="loader-ring" aria-hidden />
                                    <p className="status-card__body">{assistantModeState?.isActive ? assistantModeState.statusMessage : isAnalyzing ? t('analyzing') : isSuggestingStory ? t('storySuggesting') : isSuggestingLayout ? t('layoutSuggesting') : isColoring ? t('coloringPage') : t('generating')}</p>
                                    {assistantModeState?.isActive && !assistantModeState?.hasError && <button onClick={onStopAutoGeneration} className="button-secondary justify-center text-sm">{t('stopGeneration')}</button>}
                                </>
                            )}
                        </div>
                    ) : (
                        <GenerationControls
                            onGenerateImage={onGenerateImage}
                            isLoading={isLoading}
                            colorMode={colorMode}
                            setColorMode={onSetColorMode}
                            isReadyToGenerate={!!currentPage.sceneDescription}
                            sceneDescription={currentPage.sceneDescription}
                            onSceneDescriptionChange={onSceneDescriptionChange}
                            onSuggestLayout={onSuggestLayout}
                            isSuggestingLayout={isSuggestingLayout}
                            onSuggestStory={onSuggestStory}
                            hasGeneratedResult={!!currentPage.generatedImage}
                            onViewResult={onViewResult}
                            generateEmptyBubbles={generateEmptyBubbles}
                            setGenerateEmptyBubbles={onSetGenerateEmptyBubbles}
                        />
                    )}
                    {error && <div className="status-card status-card--error">{error}</div>}
                </div>
            )}
        </aside>
    );
}
