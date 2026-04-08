import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalization } from '@/hooks/useLocalization';
import type { Language, LocaleKeys } from '@/i18n/locales';

const LANGS: { key: Language; labelKey: LocaleKeys }[] = [
  { key: 'en', labelKey: 'english' },
  { key: 'zh', labelKey: 'chinese' },
  { key: 'ja', labelKey: 'japanese' },
  { key: 'ar', labelKey: 'arabic' },
];

export function Footer(): React.ReactElement {
  const { t, language, setLanguage } = useLocalization();
  const navigate = useNavigate();

  return (
    <footer className="landing-footer">
      <div className="container">
        <div className="landing-footer__panel">
          <div className="landing-footer__main">
            <div className="landing-footer__brand">
              <span className="heading-eyebrow">{t('AIMangaStudio')}</span>
              <h3>{t('AIMangaStudio')}</h3>
              <p>{t('landingSubtitle')}</p>
              <button onClick={() => navigate('/studio')} className="button-primary">{t('startCreating')}</button>
            </div>

            <div>
              <h4 className="landing-footer__title">{t('language')}</h4>
              <div className="landing-footer__list">
                {LANGS.map((langOption) => (
                  <button
                    key={langOption.key}
                    type="button"
                    onClick={() => setLanguage(langOption.key)}
                    className={`landing-footer__language ${language === langOption.key ? 'is-active' : ''}`}
                  >
                    {t(langOption.labelKey)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="landing-footer__title">{t('footerDocs')}</h4>
              <div className="landing-footer__list">
                <a href="#features" className="landing-footer__link">{t('featuresTitle')}</a>
                <a href="#gallery" className="landing-footer__link">{t('galleryTitle')}</a>
                <a href="https://github.com/MontaCoder/AI-Manga-Studio" target="_blank" rel="noopener noreferrer" className="landing-footer__link">{t('footerGithub')}</a>
              </div>
            </div>
          </div>

          <div className="landing-footer__bottom">
            <span>{t('footerMadeWith')} {t('footerMadeBy')} Montassar Hajri</span>
            <span>{t('footerLicense')} (c) {new Date().getFullYear()}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
