import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalization } from '@/hooks/useLocalization';
import { useInView } from '@/hooks/useInView';

export function Hero(): React.ReactElement {
  const { t } = useLocalization();
  const navigate = useNavigate();
  const [heroRef] = useInView({ threshold: 0.1 });

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features');
    featuresSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section ref={heroRef} className="hero">
      <video
        className="hero__video"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        <source src="/video/Website_Hero_Background_Video_Generation.webm" type="video/webm" />
        <source src="/video/Website_Hero_Background_Video_Generation.mp4" type="video/mp4" />
      </video>
      
      <div className="hero__pattern" />
      <div className="hero__overlay" />
        
      <div className="hero__content">
        <h1 className="hero__title animate-fade-up">
          {t('landingHero')}
        </h1>

        <p className="hero__subtitle animate-fade-up-delayed">
          {t('landingSubtitle')}
        </p>

        <div className="hero__actions animate-fade-up-delayed-more">
          <button
            onClick={() => navigate('/studio')}
            className="button-primary button-lg"
            aria-label={t('getStarted')}
          >
            {t('getStarted')}
          </button>
          <button
            onClick={scrollToFeatures}
            className="button-secondary button-lg"
            aria-label={t('learnMore')}
          >
            {t('learnMore')}
          </button>
        </div>
      </div>
    </section>
  );
}

