import React, { useState, useCallback, useRef } from 'react';
import type { GeneratedContent, AnalysisResult, Character } from '../types';
import { useLocalization } from '../hooks/useLocalization';
import { RedoAltIcon, SparklesIcon, UploadIcon, XIcon, BrushIcon, ReturnIcon, WandIcon, CheckCircleIcon } from './icons';

interface ResultDisplayProps {
  isLoading: boolean;
  isColoring: boolean;
  generatedContent: GeneratedContent | null;
  error: string | null;
  isMonochromeResult: boolean;
  onColorize: () => void;
  onRegenerate: () => void;
  onEdit: (prompt: string, refImages: string[] | null) => void;
  onStartMasking: () => void;
  mask: string | null;
  onClearMask: () => void;
  onReturnToEditor: () => void;
  isAnalyzing: boolean;
  analysisResult: AnalysisResult | null;
  onAnalyze: () => void;
  onApplyCorrection: () => void;
  onClearAnalysis: () => void;
  characters: Character[];
}

const LoadingMessage = () => {
    const { t } = useLocalization();
    const messages = [
        t('loadingSketching'),
        t('loadingInking'),
        t('loadingBubbles'),
        t('loadingScreentones'),
        t('loadingFinalizing'),
    ];
    const [message, setMessage] = React.useState(messages[0]);

    React.useEffect(() => {
        let index = 0;
        const intervalId = setInterval(() => {
            index = (index + 1) % messages.length;
            setMessage(messages[index]);
        }, 2500);

        return () => clearInterval(intervalId);
    }, [messages]);

    return <p className="text-gray-500 mt-4">{message}</p>
};

export function ResultDisplay({ 
    isLoading, 
    isColoring, 
    generatedContent, 
    error, 
    isMonochromeResult, 
    onColorize,
    onRegenerate,
    onEdit,
    onStartMasking,
    mask,
    onClearMask,
    onReturnToEditor,
    isAnalyzing,
    analysisResult,
    onAnalyze,
    onApplyCorrection,
    onClearAnalysis,
    characters
}: ResultDisplayProps): React.ReactElement {
  const { t } = useLocalization();
  const [editPrompt, setEditPrompt] = useState('');
  const [editRefImages, setEditRefImages] = useState<string[]>([]);
  const [editRefCharacterIds, setEditRefCharacterIds] = useState<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleApplyEdits = () => {
    if (editPrompt) {
        const selectedCharSheets = characters
            .filter(c => editRefCharacterIds.has(c.id))
            .map(c => c.sheetImage);

        const allRefImages = [...editRefImages, ...selectedCharSheets];

        onEdit(editPrompt, allRefImages.length > 0 ? allRefImages : null);
        setEditPrompt('');
        setEditRefImages([]);
        setEditRefCharacterIds(new Set());
    }
  };

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const remainingSlots = 8 - editRefImages.length;
      if (remainingSlots <= 0) return;

      let processed = 0;
      for (const file of files) {
        if (processed >= remainingSlots) break;
        processed += 1;
        const reader = new FileReader();
        reader.onloadend = () => {
            setEditRefImages(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      }
    }
  }, [editRefImages]);
  
  const handleRemoveRefImage = (index: number) => {
      setEditRefImages(prev => prev.filter((_, i) => i !== index));
  }

  const toggleRefChar = (charId: string) => {
    setEditRefCharacterIds(prev => {
        const newSet = new Set(prev);
        if (newSet.has(charId)) {
            newSet.delete(charId);
        } else {
            newSet.add(charId);
        }
        return newSet;
    });
  };

  if (isLoading || isColoring || isAnalyzing) {
    return (
        <div className="surface-card result-panel h-full items-center justify-center text-center">
            <div className="loader-ring" aria-hidden />
            <p className="heading-sm mt-4">{isAnalyzing ? t('analyzing') : (isColoring ? t('coloringPage') : t('processing'))}</p>
            {!isAnalyzing && !isColoring && <LoadingMessage />}
        </div>
    );
  }

  return (
    <div className="surface-card result-panel">
      <div className="result-panel__header">
        <h2 className="heading-md">{t('result')}</h2>
        <button 
          onClick={onReturnToEditor}
          className="button-ghost"
          type="button"
        >
          <ReturnIcon className="w-5 h-5" />
          {t('returnToEditor')}
        </button>
      </div>

      <div className="result-panel__content">
        {error ? (
            <div className="status-card status-card--error">{error}</div>
        ) : generatedContent?.image ? (
            <>
                <figure className="result-shell__media">
                     <img src={generatedContent.image} alt="Generated manga page" className="w-full object-contain rounded-md shadow-sm border border-[rgba(148,163,184,0.24)]" />
                     {mask && (
                        <div className="floating-status">
                            <BrushIcon className="w-4 h-4" />
                            {t('maskActive')}
                        </div>
                     )}
                </figure>

                <div className="result-panel__actions">
                    {isMonochromeResult && (
                        <button onClick={onColorize} disabled={isColoring} className="button-primary is-full-width" type="button">
                            {t('colorizePage')}
                        </button>
                    )}
                    <div className="grid grid-cols-2 gap-2">
                        <button onClick={onRegenerate} className="button-secondary" type="button">
                            <RedoAltIcon className="w-4 h-4" /> {t('regenerate')}
                        </button>
                        <button onClick={onStartMasking} className="button-secondary" type="button">
                           <BrushIcon className="w-4 h-4" /> {t('editWithMask')}
                        </button>
                    </div>
                    <button 
                        onClick={onAnalyze} 
                        className="button-primary"
                        type="button"
                    >
                        <WandIcon className="w-4 h-4" /> {t('analyzeResult')}
                    </button>

                    {analysisResult && (
                        <div className="surface-card">
                            <div className="generation-panel__header">
                                <h3 className="heading-sm">{t('analysisReport')}</h3>
                                <button onClick={onClearAnalysis} className="icon-button" type="button"><XIcon className="w-4 h-4" /></button>
                            </div>
                            <p className="text-body">{analysisResult.analysis}</p>
                            {analysisResult.has_discrepancies ? (
                                <button
                                    onClick={onApplyCorrection}
                                    className="button-primary is-full-width"
                                    type="button"
                                >
                                    <SparklesIcon className="w-5 h-5" /> {t('applyCorrection')}
                                </button>
                            ) : (
                                <div className="floating-status pill-success">
                                    <CheckCircleIcon className="w-5 h-5" />
                                    <span>{t('noCorrectionsNeeded')}</span>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="surface-card">
                        <h3 className="heading-sm">{t('editResult')}</h3>
                        {mask && (
                            <div className="floating-status pill-warning">
                                <BrushIcon className="w-4 h-4" />
                                <span>{t('maskActive')}</span>
                                <button onClick={onClearMask} className="button-ghost" type="button">{t('clearMask')}</button>
                            </div>
                        )}
                        <textarea
                            value={editPrompt}
                            onChange={(e) => setEditPrompt(e.target.value)}
                            placeholder={t('editPromptPlaceholder')}
                            className="textarea-base"
                        />
                         <div className="result-shell__media">
                             <div className="generation-panel__header">
                                <span className="text-caption">{t('uploadReference')}</span>
                                <span className="text-subtle">{editRefImages.length}/8</span>
                             </div>
                            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" id="edit-ref-upload" multiple />
                            <div className="grid grid-cols-4 gap-2">
                                {editRefImages.map((img, index) => (
                                    <div key={index} className="relative group aspect-square">
                                        <img src={img} alt={`Ref ${index + 1}`} className="w-full h-full object-cover rounded-md border border-[rgba(148,163,184,0.24)]" />
                                        <button onClick={() => handleRemoveRefImage(index)} className="icon-button" type="button"><XIcon className="w-3 h-3" /></button>
                                    </div>
                                ))}
                                {editRefImages.length < 8 && (
                                    <label htmlFor="edit-ref-upload" className="surface-card cursor-pointer aspect-square flex flex-col items-center justify-center text-subtle">
                                        <UploadIcon className="w-5 h-5" />
                                        <span className="text-caption">{t('uploadReference')}</span>
                                    </label>
                                )}
                            </div>
                         </div>
                         <div className="result-shell__media">
                            <span className="text-caption">{t('characters')}</span>
                            {characters.length > 0 ? (
                                <div className="grid grid-cols-4 gap-2">
                                    {characters.map(char => (
                                        <button key={char.id} onClick={() => toggleRefChar(char.id)} className="relative aspect-square surface-card" type="button">
                                            <img src={char.sheetImage} alt={char.name} className={`w-full h-full object-cover rounded-md ${editRefCharacterIds.has(char.id) ? 'ring-2 ring-[var(--color-primary)]' : ''}`} />
                                             {editRefCharacterIds.has(char.id) && (
                                                <div className="floating-status pill-success absolute inset-0 flex items-center justify-center">
                                                    <CheckCircleIcon className="w-6 h-6" />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-subtle text-center">{t('createCharacterPrompt')}</p>
                            )}
                         </div>

                        <button
                            onClick={handleApplyEdits}
                            disabled={!editPrompt}
                            className="button-primary is-full-width"
                            type="button"
                        >
                            <SparklesIcon className="w-5 h-5" /> {t('applyEdits')}
                        </button>
                    </div>
                </div>
            </>
        ) : null}
      </div>
    </div>
  );
}