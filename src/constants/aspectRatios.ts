export type AspectRatioKey = 'A4' | 'portrait34' | 'square' | 'landscape169';

export interface AspectRatioConfig {
  w: number;
  h: number;
  name: string;
  value: string;
}

export const DEFAULT_ASPECT_RATIO: AspectRatioKey = 'A4';

export const ASPECT_RATIOS: Record<AspectRatioKey, AspectRatioConfig> = {
  A4: { w: 595, h: 842, name: 'a4', value: '210:297' },
  portrait34: { w: 600, h: 800, name: 'portrait34', value: '3:4' },
  square: { w: 800, h: 800, name: 'square', value: '1:1' },
  landscape169: { w: 1280, h: 720, name: 'landscape169', value: '16:9' },
};

export const getAspectRatioConfig = (aspectRatio?: string): AspectRatioConfig =>
  ASPECT_RATIOS[(aspectRatio as AspectRatioKey) ?? DEFAULT_ASPECT_RATIO] ?? ASPECT_RATIOS[DEFAULT_ASPECT_RATIO];
