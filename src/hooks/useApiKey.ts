import { useEffect, useState } from 'react';
import { getApiKey, saveApiKey as saveStoredApiKey } from '@/services/geminiClient';

export const useApiKey = () => {
  const [hasApiKey, setHasApiKey] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);

  useEffect(() => {
    try {
      setHasApiKey(!!getApiKey());
    } catch (error) {
      console.error('Error loading API key:', error);
      setHasApiKey(false);
    }
  }, []);

  const saveApiKey = (key: string) => {
    saveStoredApiKey(key);
    setHasApiKey(true);
    setIsApiKeyModalOpen(false);
  };

  return {
    hasApiKey,
    isApiKeyModalOpen,
    setIsApiKeyModalOpen,
    saveApiKey,
  };
};
