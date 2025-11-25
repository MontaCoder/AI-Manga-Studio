import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalization } from '@/hooks/useLocalization';

export function Hero(): React.ReactElement {
  const { t } = useLocalization();
  const navigate = useNavigate();

  return (
    <section className="hero">
      <video className="hero__video" autoPlay muted loop playsInline preload="auto">
        <source src="/video/Website_Hero_Background_Video_Generation.webm" type="video/webm" />
        <source src="/video/Website_Hero_Background_Video_Generation.mp4" type="video/mp4" />
      </video>
      <div className="hero__pattern" />
      <div className="hero__overlay" />
      <div className="hero__content">
        <h1 className="hero__title">{t('landingHero')}</h1>
        <p className="hero__subtitle">{t('landingSubtitle')}</p>
        <div className="hero__actions">
          <button onClick={() => navigate('/studio')} className="button-primary button-lg">
            {t('getStarted')}
          </button>
          <button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} className="button-secondary button-lg">
            {t('learnMore')}
          </button>
        </div>
      </div>
    </section>
  );
}

