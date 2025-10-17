import React, { useState, useMemo } from 'react';
import { MenuIcon, XIcon, BookOpenIcon, GlobeIcon, VideoIcon, ArrowLeftIcon, KeyIcon } from './icons';
import { useLocalization } from '../hooks/useLocalization';
import { Language } from '../i18n/locales';

interface HeaderProps {
    isSidebarOpen: boolean;
    onToggleSidebar: () => void;
    language: Language;
    setLanguage: (language: Language) => void;
    // Optional callback to open API Key modal/settings
    onOpenApiKeyModal?: () => void;
    hasApiKey?: boolean;
    onShowMangaViewer: () => void;
    onShowWorldview: () => void;
    currentView: 'manga-editor' | 'video-producer';
    onSetView: (view: 'manga-editor' | 'video-producer') => void;
}

export function Header({ isSidebarOpen, onToggleSidebar, language, setLanguage, onOpenApiKeyModal, hasApiKey, onShowMangaViewer, onShowWorldview, currentView, onSetView }: HeaderProps): React.ReactElement {
  const { t } = useLocalization();
  const [isLangOpen, setIsLangOpen] = useState(false);

  const languages = useMemo(() => ([
      { key: 'zh' as Language, name: t('chinese') },
      { key: 'en' as Language, name: t('english') },
      { key: 'ja' as Language, name: t('japanese') },
  ]), [t]);

  return (
    <header className="header-bar">
      <div className="header-bar__inner">
        <div className="header-brand">
            {currentView === 'video-producer' ? (
                <button onClick={() => onSetView('manga-editor')} className="button-ghost" title={t('backToEditor')}>
                    <ArrowLeftIcon className="w-5 h-5" />
                    <span className="hidden md:inline">{t('backToEditor')}</span>
                </button>
            ) : (
                <button onClick={onToggleSidebar} className="button-ghost" aria-label={t('toggleSidebar')}>
                    {isSidebarOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
                </button>
            )}

            <div className="header-brand__logo">
                {currentView === 'video-producer' 
                    ? <VideoIcon className="w-8 h-8 text-indigo-500" /> 
                    : <img src="/logo.svg" alt="Logo" className="w-9 h-9" />
                }
            </div>
            <div className="header-title">
                <span className="header-title__primary">
                    {currentView === 'video-producer' ? t('aiVideoProducer') : t('AIMangaStudio')}
                </span>
            </div>
        </div>
        <div className="header-actions">
            {currentView === 'manga-editor' && (
                <>
                    <button onClick={() => onSetView('video-producer')} className="button-ghost" title={t('aiVideoProducer')}>
                        <VideoIcon className="h-5 w-5" />
                    </button>
                     <button onClick={onShowMangaViewer} className="button-ghost" title={t('viewCollection')}>
                        <BookOpenIcon className="h-5 w-5" />
                    </button>
                    <button onClick={onShowWorldview} className="button-ghost" title={t('worldviewSettings')}>
                        <GlobeIcon className="h-5 w-5" />
                    </button>
                </>
            )}

            <div className="language-menu">
                 <button
                    onClick={() => setIsLangOpen(prev => !prev)}
                    className="button-ghost"
                    title={t('language')}
                    aria-label={t('language')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7 2a1 1 0 011.707-.707l3.586 3.586a1 1 0 010 1.414l-3.586 3.586A1 1 0 017 9V5a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h2a1 1 0 001-1v-4a1 1 0 011-1h2.586l3.707 3.707a1 1 0 01-1.414 1.414L10 14.414V18a1 1 0 01-1 1H7a1 1 0 01-1-1v-2a1 1 0 00-1-1H4a1 1 0 00-1 1v2a3 3 0 003 3h4a1 1 0 00.707-1.707L10 18.586V14.5a1 1 0 011-1h1.293l4.293 4.293a1 1 0 001.414-1.414L14.414 13H16a3 3 0 003-3V7a3 3 0 00-3-3h-4a1 1 0 00-1 1v2.586L9.707 2.293A1 1 0 009 2H7z" clipRule="evenodd" /></svg>
                    <span>{languages.find(l => l.key === language)?.name}</span>
                </button>
                {isLangOpen && (
                    <div className="language-menu__list">
                        {languages.map(({ key, name }) => (
                            <button
                                key={key}
                                onClick={() => { setLanguage(key); setIsLangOpen(false); }}
                                className={`language-menu__item ${language === key ? 'is-active' : ''}`}
                            >
                                {name}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {typeof onOpenApiKeyModal === 'function' && (
                <button
                    onClick={onOpenApiKeyModal}
                    className="button-ghost relative"
                    title={t('apiKeySettings')}
                    aria-label={t('apiKeySettings')}
                >
                    <KeyIcon className="h-5 w-5" />
                    {hasApiKey && (
                        <span className="absolute -top-1 -right-1 inline-flex items-center justify-center h-3 w-3 rounded-full bg-green-500 ring-2 ring-white" aria-hidden="true"></span>
                    )}
                </button>
            )}

            <button className="button-primary">
              {t('export')}
            </button>
        </div>
      </div>
    </header>
  );
}
