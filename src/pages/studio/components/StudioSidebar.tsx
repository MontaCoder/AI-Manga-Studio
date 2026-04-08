import React from 'react';
import { AddUserIcon, LinkIcon, TrashIcon, XIcon } from '@/components/icons/icons';
import { ASPECT_RATIOS, type AspectRatioKey } from '@/constants/aspectRatios';
import { useLocalization } from '@/hooks/useLocalization';
import type { Character, Page } from '@/types';
import type { LocaleKeys } from '@/i18n/locales';

interface StudioSidebarProps {
    sidebarRef: React.RefObject<HTMLElement | null>;
    sidebarCloseButtonRef: React.RefObject<HTMLButtonElement | null>;
    isSidebarOpen: boolean;
    currentPage: Page;
    pages: Page[];
    currentPageId: string;
    assistantModeState: { isActive: boolean } | null;
    isAspectRatioOpen: boolean;
    characters: Character[];
    onCloseSidebar: () => void;
    onToggleAspectRatio: () => void;
    onSelectAspectRatio: (aspectRatio: AspectRatioKey) => void;
    onResetWorkspace: () => void;
    onSelectPage: (pageId: string) => void;
    onToggleReferencePrevious: (pageId: string) => void;
    onDeletePage: (pageId: string) => void;
    onAddPage: () => void;
    onDeleteCharacter: (characterId: string) => void;
    onOpenCharacterModal: () => void;
    onCharacterDragStart: (event: React.DragEvent<HTMLDivElement>, characterId: string) => void;
    onCharacterDragEnd: () => void;
}

export function StudioSidebar({
    sidebarRef,
    sidebarCloseButtonRef,
    isSidebarOpen,
    currentPage,
    pages,
    currentPageId,
    assistantModeState,
    isAspectRatioOpen,
    characters,
    onCloseSidebar,
    onToggleAspectRatio,
    onSelectAspectRatio,
    onResetWorkspace,
    onSelectPage,
    onToggleReferencePrevious,
    onDeletePage,
    onAddPage,
    onDeleteCharacter,
    onOpenCharacterModal,
    onCharacterDragStart,
    onCharacterDragEnd,
}: StudioSidebarProps): React.ReactElement {
    const { t } = useLocalization();

    return (
        <aside
            ref={sidebarRef}
            className={`sidebar-pane ${isSidebarOpen ? 'is-visible' : 'is-hidden'}`}
            aria-label={t('pages')}
        >
            <div className="sidebar-pane__overview surface-card">
                <span className="text-caption">{t('AIMangaStudio')}</span>
                <strong className="sidebar-pane__overview-title">{currentPage.name}</strong>
                <div className="sidebar-pane__overview-stats">
                    <span>{pages.length} {t('pages')}</span>
                    <span>{characters.length} {t('characters')}</span>
                </div>
            </div>

            <section className="sidebar-pane__section">
                <div className="sidebar-pane__section-header">
                    <div className="sidebar-pane__section-meta">
                        <span className="heading-eyebrow">{t('pages')}</span>
                        <span className="badge-inline">{pages.length} {t('pages')}</span>
                    </div>
                    <button
                        type="button"
                        className="icon-button sidebar-pane__close"
                        aria-label="Toggle sidebar"
                        ref={sidebarCloseButtonRef}
                        onClick={onCloseSidebar}
                    >
                        <XIcon className="w-4 h-4" />
                    </button>
                </div>
                <div className="stagger-grid">
                    <div className="relative">
                        <label htmlFor="aspect-ratio-select" className="input-help">{t('aspectRatio')}</label>
                        <button onClick={onToggleAspectRatio} className="button-secondary w-full justify-between">
                            <span>{t(ASPECT_RATIOS[currentPage.aspectRatio].name as LocaleKeys)} ({ASPECT_RATIOS[currentPage.aspectRatio].value})</span>
                            <svg className={`w-4 h-4 transition-transform ${isAspectRatioOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                        </button>
                        {isAspectRatioOpen && (
                        <div className="language-menu__list mt-3">
                                {Object.entries(ASPECT_RATIOS).map(([key, { name, value }]) => (
                                    <button key={key} onClick={() => onSelectAspectRatio(key as AspectRatioKey)} className="language-menu__item text-left">
                                        {t(name as LocaleKeys)} ({value})
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <button type="button" onClick={onResetWorkspace} className="button-ghost w-full text-xs justify-center">
                        Reset workspace
                    </button>
                    {assistantModeState?.isActive ? (
                        <div className="card-thumbnail-list sidebar-thumbnail-list max-h-96 overflow-y-auto">
                            {pages.filter(p => p.assistantProposalImage).map(page => (
                                <div key={`thumb-${page.id}`} onClick={() => onSelectPage(page.id)} className={`surface-card sidebar-thumbnail-card cursor-pointer overflow-hidden ${currentPageId === page.id ? 'is-active' : ''}`}>
                                    <img src={page.assistantProposalImage!} alt={page.name} className="sidebar-thumbnail-card__image" />
                                    <div className="sidebar-thumbnail-card__label">{page.name}</div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="sidebar-pane__cards">
                            {pages.map((page, index) => (
                                <div key={page.id} className={`page-card ${currentPageId === page.id ? 'is-active' : ''}`}>
                                    <button type="button" onClick={() => onSelectPage(page.id)} className="page-card__name cursor-pointer">
                                        <span className="page-card__index">{String(index + 1).padStart(2, '0')}</span>
                                        <span>{page.name}</span>
                                    </button>
                                    <div className="page-card__actions">
                                        {index > 0 && <button onClick={() => onToggleReferencePrevious(page.id)} className={`icon-button ${page.shouldReferencePrevious ? 'is-active' : ''}`} title={t('referencePreviousPage')}><LinkIcon className="w-4 h-4" /></button>}
                                        <button onClick={() => onDeletePage(page.id)} className="icon-button is-critical" title={t('delete')} disabled={pages.length <= 1}><TrashIcon className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            ))}
                            <button onClick={onAddPage} className="button-secondary justify-center text-sm"><AddUserIcon className="w-4 h-4" />{t('addPage')}</button>
                        </div>
                    )}
                </div>
            </section>

            <section className="sidebar-pane__section">
                <div className="sidebar-pane__section-header">
                    <span className="heading-eyebrow">{t('characters')}</span>
                    {characters.length > 0 && <span className="badge-inline">{characters.length}</span>}
                </div>
                <div className="sidebar-pane__cards">
                    {characters.length === 0 && <p className="empty-state__description">{t('createCharacterPrompt')}</p>}
                    {characters.map(char => (
                        <div key={char.id} className="character-card group">
                            <div
                                className="character-card__meta cursor-grab"
                                draggable
                                onDragStart={(event) => onCharacterDragStart(event, char.id)}
                                onDragEnd={onCharacterDragEnd}
                            >
                                <img src={char.sheetImage} alt={char.name} className="w-12 h-12 rounded-md object-cover" />
                                <span>{char.name}</span>
                            </div>
                            <button onClick={() => onDeleteCharacter(char.id)} className="icon-button is-critical opacity-0 group-hover:opacity-100" title={t('delete')}><TrashIcon className="w-4 h-4" /></button>
                        </div>
                    ))}
                </div>
                <button onClick={onOpenCharacterModal} className="button-secondary justify-center"><AddUserIcon className="w-4 h-4" />{t('addCharacter')}</button>
            </section>
        </aside>
    );
}
