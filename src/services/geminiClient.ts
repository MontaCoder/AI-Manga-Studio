import { GoogleGenAI } from "@google/genai";

const API_KEY_STORAGE_KEY = 'gemini_api_key';
const DATA_URL_PREFIX_SEPARATOR = ',';

type GeminiResponsePart = {
    inlineData?: {
        data?: string | null;
        mimeType?: string | null;
    } | null;
    text?: string | null;
};

type GeminiResponseLike = {
    text?: string | null;
    candidates?: Array<{
        content?: {
            parts?: Array<GeminiResponsePart | null> | null;
        } | null;
    } | null>;
};

let cachedApiKey: string | null = null;
let cachedClient: GoogleGenAI | null = null;

/**
 * Resolve API key at runtime. Priority:
 * 1. Browser localStorage key `gemini_api_key`
 * 2. Environment variables (process.env.GEMINI_API_KEY or process.env.API_KEY)
 */
export function getApiKey(): string | null {
    try {
        if (typeof window !== 'undefined' && window.localStorage) {
            const stored = window.localStorage.getItem(API_KEY_STORAGE_KEY);
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

export function saveApiKey(apiKey: string): void {
    if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(API_KEY_STORAGE_KEY, apiKey.trim());
    }
    cachedApiKey = null;
    cachedClient = null;
}

export function getAiClient(): GoogleGenAI {
    const key = getApiKey();
    if (!key) {
        throw new Error("No Gemini API key found. Please set it in the app (localStorage key 'gemini_api_key') or provide GEMINI_API_KEY / API_KEY in the environment.");
    }

    if (cachedClient && cachedApiKey === key) {
        return cachedClient;
    }

    cachedApiKey = key;
    cachedClient = new GoogleGenAI({ apiKey: key });
    return cachedClient;
}

export function getDataUrlMimeType(dataUrl: string, fallback: string = 'image/png'): string {
    return dataUrl.match(/data:(image\/.*?);/)?.[1] || fallback;
}

export function getDataUrlBase64(dataUrl: string): string {
    const separatorIndex = dataUrl.indexOf(DATA_URL_PREFIX_SEPARATOR);
    return separatorIndex === -1 ? dataUrl : dataUrl.slice(separatorIndex + 1);
}

export function base64ToGeminiPart(base64: string, mimeType: string) {
  return {
    inlineData: {
      data: getDataUrlBase64(base64),
      mimeType,
    },
  };
}

export function dataUrlToGeminiPart(dataUrl: string, fallbackMimeType: string = 'image/png') {
    return base64ToGeminiPart(dataUrl, getDataUrlMimeType(dataUrl, fallbackMimeType));
}

function getResponseParts(response: GeminiResponseLike): GeminiResponsePart[] {
    return (response.candidates?.[0]?.content?.parts ?? []).filter((part): part is GeminiResponsePart => Boolean(part));
}

export function extractImageFromResponse(
    response: GeminiResponseLike,
    errorMessage: string,
): string {
    const parts = getResponseParts(response);
    const imagePart = parts.find(part => part.inlineData?.data && part.inlineData?.mimeType);
    if (imagePart?.inlineData?.data && imagePart.inlineData.mimeType) {
        return `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
    }

    const textPart = parts.find(part => part.text);
    if (textPart?.text) {
        throw new Error(`The AI did not return an image. Response: "${textPart.text}"`);
    }

    throw new Error(errorMessage);
}

export function extractTextAndImage(response: GeminiResponseLike): { image: string | null; text: string | null } {
    let image: string | null = null;
    let text: string | null = null;

    for (const part of getResponseParts(response)) {
        if (part.inlineData?.data && part.inlineData?.mimeType) {
            image = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        } else if (part.text) {
            text = part.text;
        }
    }

    return { image, text };
}

export function parseJsonResponse<T>(
    response: GeminiResponseLike,
    errorMessage: string,
    isValid?: (value: unknown) => value is T,
): T {
    try {
        const parsed = JSON.parse((response.text || '').trim()) as unknown;
        if (isValid && !isValid(parsed)) {
            throw new Error('Parsed JSON did not match the expected structure.');
        }
        return parsed as T;
    } catch (error) {
        console.error(errorMessage, error);
        throw new Error(errorMessage);
    }
}
