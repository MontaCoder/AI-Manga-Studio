import { useCallback, useMemo, useRef } from 'react';
import type { RefObject, WheelEvent } from 'react';
import type { ViewTransform } from '@/types';

const ASPECT_RATIO_CONFIG: Record<string, { w: number; h: number }> = {
  A4: { w: 595, h: 842 },
  portrait34: { w: 600, h: 800 },
  square: { w: 800, h: 800 },
  landscape169: { w: 1280, h: 720 },
  '竖版': { w: 600, h: 800 },
  '正方形': { w: 800, h: 800 },
  '横版': { w: 1280, h: 720 },
};

interface UsePanelCanvasParams {
  aspectRatio: string;
  viewTransform: ViewTransform;
  onViewTransformChange: (viewTransform: ViewTransform) => void;
}

interface UsePanelCanvasResult {
  svgRef: RefObject<SVGSVGElement>;
  canvasConfig: { w: number; h: number };
  fitAndCenterCanvas: () => void;
  handleWheel: (event: WheelEvent<SVGSVGElement>) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  clientToCanvasPoint: (clientX: number, clientY: number) => { x: number; y: number };
}

export function usePanelCanvas({
  aspectRatio,
  viewTransform,
  onViewTransformChange,
}: UsePanelCanvasParams): UsePanelCanvasResult {
  const svgRef = useRef<SVGSVGElement>(null);

  const canvasConfig = useMemo(() => {
    return ASPECT_RATIO_CONFIG[aspectRatio] || ASPECT_RATIO_CONFIG.A4;
  }, [aspectRatio]);

  const clientToCanvasPoint = useCallback(
    (clientX: number, clientY: number) => {
      const svg = svgRef.current;
      if (!svg) return { x: 0, y: 0 };
      const CTM = svg.getScreenCTM();
      if (!CTM) return { x: 0, y: 0 };

      const point = svg.createSVGPoint();
      point.x = clientX;
      point.y = clientY;
      const transformed = point.matrixTransform(CTM.inverse());

      return {
        x: (transformed.x - viewTransform.x) / viewTransform.scale,
        y: (transformed.y - viewTransform.y) / viewTransform.scale,
      };
    },
    [viewTransform.x, viewTransform.y, viewTransform.scale],
  );

  const fitAndCenterCanvas = useCallback(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const { width: viewWidth, height: viewHeight } = svg.getBoundingClientRect();
    if (viewWidth === 0 || viewHeight === 0) return;

    const { w: pageWidth, h: pageHeight } = canvasConfig;
    const scaleX = viewWidth / pageWidth;
    const scaleY = viewHeight / pageHeight;
    const scale = Math.min(scaleX, scaleY) * 0.9;
    const x = (viewWidth - pageWidth * scale) / 2;
    const y = (viewHeight - pageHeight * scale) / 2;

    onViewTransformChange({ scale, x, y });
  }, [canvasConfig, onViewTransformChange]);

  const handleWheel = useCallback(
    (event: WheelEvent<SVGSVGElement>) => {
      event.preventDefault();
      const svg = svgRef.current;
      if (!svg) return;

      const rect = svg.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      const scaleFactor = 1.1;
      const newScale = event.deltaY < 0 ? viewTransform.scale * scaleFactor : viewTransform.scale / scaleFactor;
      const clampedScale = Math.max(0.1, Math.min(newScale, 10));

      const newX = mouseX - (mouseX - viewTransform.x) * (clampedScale / viewTransform.scale);
      const newY = mouseY - (mouseY - viewTransform.y) * (clampedScale / viewTransform.scale);

      onViewTransformChange({ scale: clampedScale, x: newX, y: newY });
    },
    [viewTransform.scale, viewTransform.x, viewTransform.y, onViewTransformChange],
  );

  const zoom = useCallback(
    (direction: 'in' | 'out') => {
      const svg = svgRef.current;
      if (!svg) return;
      const { width: viewWidth, height: viewHeight } = svg.getBoundingClientRect();
      const centerX = viewWidth / 2;
      const centerY = viewHeight / 2;

      const scaleFactor = 1.25;
      const newScale = direction === 'in' ? viewTransform.scale * scaleFactor : viewTransform.scale / scaleFactor;
      const clampedScale = Math.max(0.1, Math.min(newScale, 10));

      const newX = centerX - (centerX - viewTransform.x) * (clampedScale / viewTransform.scale);
      const newY = centerY - (centerY - viewTransform.y) * (clampedScale / viewTransform.scale);
      onViewTransformChange({ scale: clampedScale, x: newX, y: newY });
    },
    [viewTransform.scale, viewTransform.x, viewTransform.y, onViewTransformChange],
  );

  const zoomIn = useCallback(() => zoom('in'), [zoom]);
  const zoomOut = useCallback(() => zoom('out'), [zoom]);

  return {
    svgRef,
    canvasConfig,
    fitAndCenterCanvas,
    handleWheel,
    zoomIn,
    zoomOut,
    clientToCanvasPoint,
  };
}
