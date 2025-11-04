import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MenuIcon, XIcon, BookOpenIcon, GlobeIcon, VideoIcon, ArrowLeftIcon, KeyIcon } from '@/components/icons/icons';
import { useLocalization } from '@/hooks/useLocalization';
import { Language } from '@/i18n/locales';

export type HeaderVariant = 'app' | 'marketing';

interface HeaderProps {
    variant?: HeaderVariant;
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

export function Header({
    variant = 'app',
    isTransparentOnTop = false,
    isSidebarOpen,
    onToggleSidebar,
    language,
    setLanguage,
    onOpenApiKeyModal,
    hasApiKey,
    onShowMangaViewer,
    onShowWorldview,
    currentView,
    onSetView,
    onExport
}: HeaderProps): React.ReactElement {
  const { t } = useLocalization();
  const navigate = useNavigate();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isApp = variant === 'app';

  const handleLogoClick = useCallback(() => {
    navigate('/');
  }, [navigate]);

  const handleLanguageChange = useCallback((lang: Language) => {
    setLanguage(lang);
    setIsLangOpen(false);
  }, [setLanguage]);

  useEffect(() => {
    if (!isTransparentOnTop) return;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isTransparentOnTop]);

  const languages = [
      { key: 'zh' as Language, name: t('chinese') },
      { key: 'en' as Language, name: t('english') },
      { key: 'ja' as Language, name: t('japanese') },
  ];

  const headerClassName = `header-bar ${isTransparentOnTop && !isScrolled ? 'landing-header--transparent' : ''} ${isTransparentOnTop && isScrolled ? 'landing-header--transparent scrolled' : ''}`;

  return (
    <header className={headerClassName}>
      <div className="header-bar__inner">
        <div className="header-brand">
            {isApp && currentView === 'video-producer' ? (
                <button onClick={() => onSetView?.('manga-editor')} className="button-ghost" title={t('backToEditor')}>
                    <ArrowLeftIcon className="w-5 h-5" />
                    <span className="hidden md:inline">{t('backToEditor')}</span>
                </button>
            ) : isApp && onToggleSidebar ? (
                <button onClick={onToggleSidebar} className="button-ghost" aria-label={t('toggleSidebar')}>
                    {isSidebarOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
                </button>
            ) : null}

            <button
                type="button"
                onClick={handleLogoClick}
                className="header-brand__logo"
                aria-label={t('AIMangaStudio')}
            >
                {isApp && currentView === 'video-producer' ? (
                    <VideoIcon className="w-8 h-8 text-indigo-500" />
                ) : (
                    <img src="/logo.svg" alt="Logo" className="w-9 h-9" />
                )}
            </button>
            <div className="header-title">
                <span className="header-title__primary">
                    {isApp && currentView === 'video-producer' ? t('aiVideoProducer') : t('AIMangaStudio')}
                </span>
            </div>
        </div>
        <div className="header-actions">
            {isApp && currentView === 'manga-editor' && (
                <>
                    {onSetView && (
                        <button onClick={() => onSetView('video-producer')} className="button-ghost" title={t('aiVideoProducer')}>
                            <VideoIcon className="h-5 w-5" />
                        </button>
                    )}
                    {onShowMangaViewer && (
                        <button onClick={onShowMangaViewer} className="button-ghost" title={t('viewCollection')}>
                            <BookOpenIcon className="h-5 w-5" />
                        </button>
                    )}
                    {onShowWorldview && (
                        <button onClick={onShowWorldview} className="button-ghost" title={t('worldviewSettings')}>
                            <GlobeIcon className="h-5 w-5" />
                        </button>
                    )}
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
                                onClick={() => handleLanguageChange(key)}
                                className={`language-menu__item ${language === key ? 'is-active' : ''}`}
                            >
                                {name}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {isApp && typeof onOpenApiKeyModal === 'function' && (
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

            {isApp ? (
                <button onClick={onExport} className="button-primary">
                    {t('export')}
                </button>
            ) : (
                <button onClick={() => navigate('/studio')} className="button-primary">
                    {t('getStarted')}
                </button>
            )}
        </div>
      </div>
    </header>
  );
}
