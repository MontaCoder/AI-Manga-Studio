import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@/components/icons/icons';
import { useLocalization } from '@/hooks/useLocalization';

interface ComparisonViewerProps {
  beforeImage: string;
  afterImage: string;
  isMonochromeResult: boolean;
  onColorize: () => void;
  isColoring: boolean;
}

export function ComparisonViewer({ beforeImage, afterImage, isMonochromeResult, onColorize, isColoring }: ComparisonViewerProps): React.ReactElement {
  const { t } = useLocalization();
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setSliderPosition(percent);
  }, []);
  
  const handleMouseDown = useCallback(() => { isDragging.current = true; }, []);
  const handleMouseUp = useCallback(() => { isDragging.current = false; }, []);
  
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging.current) handleMove(e.clientX);
  }, [handleMove]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (isDragging.current) handleMove(e.touches[0].clientX);
  }, [handleMove]);
  
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp, handleTouchMove]);

  return (
    <div className="comparison-viewer">
        <div className="comparison-viewer__header">
            <h2 className="heading-md">{t('compareResult')}</h2>
            {isMonochromeResult && (
                <button
                    onClick={onColorize}
                    disabled={isColoring}
                    className="button-primary"
                    type="button"
                >
                    {isColoring ? t('colorizing') : t('colorizePage')}
                </button>
            )}
        </div>
        <div className="comparison-viewer__stage">
            <div 
                ref={containerRef}
                className="comparison-viewer__frame"
            >
                <img src={beforeImage} alt="Before - Panel Layout" className="block w-full h-auto object-contain pointer-events-none" draggable={false}/>
                <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none" style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`}}>
                    <img src={afterImage} alt="After - Generated Manga" className="absolute inset-0 w-full h-full object-contain" draggable={false}/>
                </div>
                <div
                    className="comparison-viewer__slider" style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
                    onMouseDown={handleMouseDown} onTouchStart={handleMouseDown}
                >
                    <div className="comparison-viewer__handle">
                        <div className="comparison-viewer__handle-icons">
                            <ChevronLeftIcon className="w-5 h-5" />
                            <ChevronRightIcon className="w-5 h-5" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
