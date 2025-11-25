import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MenuIcon, XIcon, BookOpenIcon, GlobeIcon, VideoIcon, ArrowLeftIcon, KeyIcon } from '@/components/icons/icons';
import { useLocalization } from '@/hooks/useLocalization';
import { Language } from '@/i18n/locales';

interface HeaderProps {
    variant?: 'app' | 'marketing';
    isTransparentOnTop?: boolean;
    isSidebarOpen?: boolean;
    onToggleSidebar?: () => void;
    language: Language;
    setLanguage: (language: Language) => void;
    onOpenApiKeyModal?: () => void;
    hasApiKey?: boolean;
    onShowMangaViewer?: () => void;
    onShowWorldview?: () => void;
    currentView?: 'manga-editor' | 'video-producer';
    onSetView?: (view: 'manga-editor' | 'video-producer') => void;
    onExport?: () => void;
}

const LANGUAGES: { key: Language; label: string }[] = [
  { key: 'zh', label: '中文' },
  { key: 'en', label: 'English' },
  { key: 'ja', label: '日本語' },
  { key: 'ar', label: 'العربية' },
];

export function Header({ variant = 'app', isTransparentOnTop, isSidebarOpen, onToggleSidebar, language, setLanguage, onOpenApiKeyModal, hasApiKey, onShowMangaViewer, onShowWorldview, currentView, onSetView, onExport }: HeaderProps): React.ReactElement {
  const { t } = useLocalization();
  const navigate = useNavigate();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isApp = variant === 'app';

  useEffect(() => {
    if (!isTransparentOnTop) return;
    const onScroll = () => setIsScrolled(window.scrollY > 100);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [isTransparentOnTop]);

  const selectLanguage = useCallback((lang: Language) => { setLanguage(lang); setIsLangOpen(false); }, [setLanguage]);

  return (
    <header className={`header-bar ${isTransparentOnTop && !isScrolled ? 'landing-header--transparent' : ''} ${isTransparentOnTop && isScrolled ? 'landing-header--transparent scrolled' : ''}`}>
      <div className="header-bar__inner">
        <div className="header-brand">
          {isApp && currentView === 'video-producer' ? (
            <button onClick={() => onSetView?.('manga-editor')} className="button-ghost" title={t('backToEditor')}>
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
          ) : isApp && onToggleSidebar ? (
            <button onClick={onToggleSidebar} className="button-ghost">
              {isSidebarOpen ? <XIcon className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>
          ) : null}
          <button onClick={() => navigate('/')} className="header-brand__logo">
            {isApp && currentView === 'video-producer' ? <VideoIcon className="w-7 h-7 text-indigo-500" /> : <img src="/logo.svg" alt="Logo" className="w-8 h-8" />}
          </button>
          <span className="header-title__primary">{isApp && currentView === 'video-producer' ? t('aiVideoProducer') : t('AIMangaStudio')}</span>
        </div>

        <div className="header-actions">
          {isApp && currentView === 'manga-editor' && (
            <>
              {onSetView && <button onClick={() => onSetView('video-producer')} className="button-ghost" title={t('aiVideoProducer')}><VideoIcon className="w-5 h-5" /></button>}
              {onShowMangaViewer && <button onClick={onShowMangaViewer} className="button-ghost" title={t('viewCollection')}><BookOpenIcon className="w-5 h-5" /></button>}
              {onShowWorldview && <button onClick={onShowWorldview} className="button-ghost" title={t('worldviewSettings')}><GlobeIcon className="w-5 h-5" /></button>}
            </>
          )}

          <div className="language-menu">
            <button onClick={() => setIsLangOpen(p => !p)} className="button-ghost" title={t('language')}>
              <GlobeIcon className="w-5 h-5" />
              <span>{LANGUAGES.find(l => l.key === language)?.label}</span>
            </button>
            {isLangOpen && (
              <div className="language-menu__list">
                {LANGUAGES.map(({ key, label }) => (
                  <button key={key} onClick={() => selectLanguage(key)} className={`language-menu__item ${language === key ? 'is-active' : ''}`}>{label}</button>
                ))}
              </div>
            )}
          </div>

          {isApp && onOpenApiKeyModal && (
            <button onClick={onOpenApiKeyModal} className="button-ghost relative" title={t('apiKeySettings')}>
              <KeyIcon className="w-5 h-5" />
              {hasApiKey && <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-500 ring-2 ring-white" />}
            </button>
          )}

          <button onClick={isApp ? onExport : () => navigate('/studio')} className="button-primary">
            {isApp ? t('export') : t('getStarted')}
          </button>
        </div>
      </div>
    </header>
  );
}
