import React from 'react';
import { ComparisonViewer } from './ComparisonViewer';
import { PanelEditor } from '@/features/panel-editor/PanelEditor';
import { useLocalization } from '@/hooks/useLocalization';
import type { Character, Page } from '@/types';

interface StudioCanvasPaneProps {
    workspaceCanvasRef: React.RefObject<HTMLElement | null>;
    panelEditorRef: React.RefObject<{ getLayoutAsImage: (includeCharacters: boolean, characters: Character[]) => Promise<string> } | null>;
    currentPage: Page;
    viewMode: 'editor' | 'result';
    characters: Character[];
    isDraggingCharacter: boolean;
    isColoring: boolean;
    isMonochromeResult: boolean;
    isFullscreen: boolean;
    onToggleViewMode: () => void;
    onColorize: () => void;
    onShapesChange: (shapes: Page['shapes'], recordHistory?: boolean) => void;
    onViewTransformChange: (viewTransform: Page['viewTransform']) => void;
    onUndo: () => void;
    onRedo: () => void;
    onProposalSettingsChange: (updates: { proposalOpacity?: number; isProposalVisible?: boolean }) => void;
    onApplyLayout: () => void;
    onToggleFullscreen: () => void;
}

export function StudioCanvasPane({
    workspaceCanvasRef,
    panelEditorRef,
    currentPage,
    viewMode,
    characters,
    isDraggingCharacter,
    isColoring,
    isMonochromeResult,
    isFullscreen,
    onToggleViewMode,
    onColorize,
    onShapesChange,
    onViewTransformChange,
    onUndo,
    onRedo,
    onProposalSettingsChange,
    onApplyLayout,
    onToggleFullscreen,
}: StudioCanvasPaneProps): React.ReactElement {
    const { t } = useLocalization();

    return (
        <section ref={workspaceCanvasRef} className="workspace-canvas">
            <div className="workspace-pane__header">
                <span className="floating-pill">{currentPage.name}</span>
                {currentPage.generatedImage && (
                    <button
                        className="button-ghost"
                        onClick={onToggleViewMode}
                        aria-label={viewMode === 'result' ? t('backToEditor') : t('viewResult')}
                    >
                        {viewMode === 'result' ? t('backToEditor') : t('viewResult')}
                    </button>
                )}
            </div>
            <div className="workspace-canvas__scroll">
                <div className={`canvas-stage ${viewMode === 'result' ? 'canvas-stage--result' : 'canvas-stage--editor'}`}>
                    {viewMode === 'result' && currentPage.generatedImage && currentPage.panelLayoutImage ? (
                        <ComparisonViewer
                            beforeImage={currentPage.panelLayoutImage}
                            afterImage={currentPage.generatedImage}
                            isMonochromeResult={isMonochromeResult}
                            onColorize={onColorize}
                            isColoring={isColoring}
                        />
                    ) : (
                        <PanelEditor
                            ref={panelEditorRef}
                            key={currentPage.id}
                            shapes={currentPage.shapes}
                            onShapesChange={onShapesChange}
                            characters={characters}
                            aspectRatio={currentPage.aspectRatio}
                            viewTransform={currentPage.viewTransform}
                            onViewTransformChange={onViewTransformChange}
                            isDraggingCharacter={isDraggingCharacter}
                            onUndo={onUndo}
                            onRedo={onRedo}
                            canUndo={currentPage.shapesHistoryIndex > 0}
                            canRedo={currentPage.shapesHistoryIndex < currentPage.shapesHistory.length - 1}
                            proposalImage={currentPage.assistantProposalImage}
                            proposalOpacity={currentPage.proposalOpacity}
                            isProposalVisible={currentPage.isProposalVisible}
                            onProposalSettingsChange={onProposalSettingsChange}
                            onApplyLayout={onApplyLayout}
                            isFullscreen={isFullscreen}
                            onToggleFullscreen={onToggleFullscreen}
                        />
                    )}
                </div>
            </div>
        </section>
    );
}
