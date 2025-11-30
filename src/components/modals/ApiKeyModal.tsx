import React, { useState } from 'react';
import { useLocalization } from '@/hooks/useLocalization';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (apiKey: string) => void;
}

export function ApiKeyModal({ isOpen, onClose, onSave }: ApiKeyModalProps): React.ReactElement | null {
  const { t } = useLocalization();
  const [apiKey, setApiKey] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!apiKey.trim()) return;
    
    setIsSaving(true);
    try {
      onSave(apiKey.trim());
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    }
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{
        background: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        animation: 'modalBackdropIn 0.2s ease-out'
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div 
        className="bg-white rounded-2xl p-8 w-full max-w-md mx-4"
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1) inset',
          animation: 'modalSlideIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
        }}
      >
        <h2 className="text-xl font-bold mb-5" style={{ color: 'var(--text)', letterSpacing: '-0.02em' }}>
          {t('apiKeyRequired')}
        </h2>
        
        <div className="mb-6">
          <p className="text-sm mb-2" style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
            {t('apiKeyDescription')}
          </p>
          <p className="text-xs mb-5" style={{ color: 'var(--text-soft)', lineHeight: 1.5 }}>
            {t('apiKeyStorageWarning')}
          </p>
          
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('apiKeyPlaceholder')}
            autoFocus
            style={{
              width: '100%',
              padding: '0.875rem 1rem',
              border: '1.5px solid var(--border)',
              borderRadius: '0.75rem',
              fontSize: '0.875rem',
              transition: 'all 0.2s ease',
              outline: 'none'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--accent)';
              e.target.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--border)';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="button-secondary"
          >
            {t('cancel')}
          </button>
          <button
            onClick={handleSave}
            disabled={!apiKey.trim() || isSaving}
            className="button-primary"
          >
            {isSaving ? t('saving') : t('save')}
          </button>
        </div>
      </div>
      <style>{`
        @keyframes modalBackdropIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalSlideIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}