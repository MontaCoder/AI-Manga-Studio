import { GoogleGenAI } from "@google/genai";

/**
 * Resolve API key at runtime. Priority:
 * 1. Browser localStorage key `gemini_api_key`
 * 2. Environment variables (process.env.GEMINI_API_KEY or process.env.API_KEY)
 */
export function getApiKey(): string | null {
    try {
        if (typeof window !== 'undefined' && window.localStorage) {
            const stored = localStorage.getItem('gemini_api_key');
            if (stored && stored.trim()) return stored;
        }
    } catch (e) {
        // ignore localStorage access errors (e.g., SSR)
    }

    if (typeof process !== 'undefined' && process.env) {
        const envKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
        if (envKey && envKey !== '""' && envKey !== 'undefined') return envKey as string;
    }

    return null;
}

export function getAiClient(): GoogleGenAI {
    const key = getApiKey();
    if (!key) {
        throw new Error("No Gemini API key found. Please set it in the app (localStorage key 'gemini_api_key') or provide GEMINI_API_KEY / API_KEY in the environment.");
    }
    return new GoogleGenAI({ apiKey: key });
}

export function base64ToGeminiPart(base64: string, mimeType: string) {
  return {
    inlineData: {
      data: base64.split(',')[1],
      mimeType,
    },
  };
}
