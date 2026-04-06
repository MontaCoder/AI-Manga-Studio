import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowIcon, PlayIcon } from '@/components/icons/icons';
import { useLocalization } from '@/hooks/useLocalization';

const SHOWCASE_IMAGES = [
  '/images/demo/1761919076.webp',
  '/images/demo/1761921812.webp',
  '/images/demo/1761921963.webp',
];

export function Hero(): React.ReactElement {
  const { t } = useLocalization();
  const navigate = useNavigate();
  const highlights = [t('featureScriptTitle'), t('featurePanelTitle'), t('featureExportTitle')];

  return (
    <section className="hero">
      <video className="hero__video" autoPlay muted loop playsInline preload="metadata">
        <source src="/video/Website_Hero_Background_Video_Generation.webm" type="video/webm" />
      </video>
      <div className="hero__pattern" />
      <div className="hero__overlay" />

      <div className="hero__content">
        <div className="hero__copy">
          <span className="hero__eyebrow">{t('AIMangaStudio')}</span>
          <h1 className="hero__title">{t('landingHero')}</h1>
          <p className="hero__subtitle">{t('landingSubtitle')}</p>

          <div className="hero__actions">
            <button onClick={() => navigate('/studio')} className="button-primary button-lg">
              <span>{t('getStarted')}</span>
              <ArrowIcon className="w-5 h-5" />
            </button>
            <button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} className="button-secondary button-lg hero__secondary-action">
              <PlayIcon className="w-5 h-5" />
              <span>{t('learnMore')}</span>
            </button>
          </div>

          <div className="hero__pill-row">
            {highlights.map((label) => (
              <span key={label} className="hero__pill">{label}</span>
            ))}
          </div>
        </div>

        <div className="hero__visual" aria-hidden="true">
          <div className="hero__panel">
            <div className="hero__panel-head">
              <span>{t('galleryTitle')}</span>
              <span>01</span>
            </div>

            <figure className="hero__panel-shot">
              <img src={SHOWCASE_IMAGES[0]} alt="" />
            </figure>

            <div className="hero__panel-meta">
              {highlights.map((label) => (
                <span key={label} className="hero__panel-tag">{label}</span>
              ))}
            </div>
          </div>

          <figure className="hero__floating-frame hero__floating-frame--top">
            <img src={SHOWCASE_IMAGES[1]} alt="" />
          </figure>
          <figure className="hero__floating-frame hero__floating-frame--bottom">
            <img src={SHOWCASE_IMAGES[2]} alt="" />
          </figure>

          <div className="hero__stamp">{t('howItWorksTitle')}</div>
        </div>
      </div>
    </section>
  );
}
