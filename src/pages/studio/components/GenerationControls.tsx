import React from 'react';
import { useLocalization } from '@/hooks/useLocalization';
import { WandIcon, LightbulbIcon } from '@/components/icons/icons';
import type { Character } from '@/types';

interface GenerationControlsProps {
  onGenerateImage: () => void;
  isLoading: boolean;
  colorMode: 'color' | 'monochrome';
  setColorMode: (mode: 'color' | 'monochrome') => void;
  isReadyToGenerate: boolean;
  sceneDescription: string;
  onSceneDescriptionChange: (desc: string) => void;
  onSuggestLayout: () => void;
  isSuggestingLayout: boolean;
  onSuggestStory: () => void;
  characters: Character[];
  hasGeneratedResult: boolean;
  onViewResult: () => void;
  generateEmptyBubbles: boolean;
  setGenerateEmptyBubbles: (value: boolean) => void;
  assistantModeState: {
    isActive: boolean;
    totalPages: number;
    currentPageNumber: number;
    statusMessage: string;
  } | null;
}

export function GenerationControls({ 
    onGenerateImage,
    isLoading, 
    colorMode, 
    setColorMode, 
    isReadyToGenerate,
    sceneDescription,
    onSceneDescriptionChange,
    onSuggestLayout,
    isSuggestingLayout,
    onSuggestStory,
    characters,
    hasGeneratedResult,
    onViewResult,
    generateEmptyBubbles,
    setGenerateEmptyBubbles,
    assistantModeState
}: GenerationControlsProps): React.ReactElement {
  const { t } = useLocalization();
  
  const canSuggestLayout = !!sceneDescription;

  return (
    <div className="surface-card generation-panel">
       <div className="generation-panel__header">
         <h2 className="heading-sm">{t('generateYourManga')}</h2>
         {hasGeneratedResult && (
            <button onClick={onViewResult} className="button-ghost" type="button">
                {t('viewResult')}
            </button>
         )}
       </div>
        
        <div className="generation-panel__field">
            <div className="generation-panel__header">
                <h3 className="heading-sm">{t('sceneScript')}</h3>
                 <button
                    onClick={onSuggestStory}
                    className="button-accent"
                    type="button"
                >
                    <LightbulbIcon className="w-4 h-4" />
                    {t('getAiSuggestions')}
                </button>
            </div>
            <textarea
                value={sceneDescription}
                onChange={(e) => onSceneDescriptionChange(e.target.value)}
                placeholder={t('sceneScriptPlaceholder')}
                className="textarea-base"
                aria-label="Editable scene script"
            />
        </div>

        <div className="generation-panel__actions">
            <button
                onClick={onSuggestLayout}
                disabled={!canSuggestLayout || isSuggestingLayout}
                className="button-primary is-full-width"
                type="button"
            >
                <WandIcon className="w-5 h-5" />
                {isSuggestingLayout ? t('layoutSuggesting') : t('suggestLayout')}
            </button>
            <div className="generation-panel__meta">
                <div className="segmented-control">
                    <button
                        onClick={() => setColorMode('monochrome')}
                        className={colorMode === 'monochrome' ? 'is-active' : ''}
                        type="button"
                    >
                        {t('monochrome')}
                    </button>
                    <button
                        onClick={() => setColorMode('color')}
                        className={colorMode === 'color' ? 'is-active' : ''}
                        type="button"
                    >
                        {t('color')}
                    </button>
                </div>
                <label htmlFor="empty-bubbles" className="checkbox-inline">
                    <input
                        id="empty-bubbles"
                        type="checkbox"
                        checked={generateEmptyBubbles}
                        onChange={(e) => setGenerateEmptyBubbles(e.target.checked)}
                    />
                    {t('generateEmptyBubbles')}
                </label>
            </div>
            <button
                onClick={onGenerateImage}
                disabled={isLoading || !isReadyToGenerate}
                className="button-primary is-full-width"
                type="button"
            >
                {isLoading ? `${t('generating')}...` : t('generateFinalPage')}
            </button>
            
            {!isReadyToGenerate && <p className="text-subtle text-center">{t('writeScriptPrompt')}</p>}
        </div>
    </div>
  );
}