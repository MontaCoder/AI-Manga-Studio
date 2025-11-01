import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalization } from '../../hooks/useLocalization';
import { useInView } from '../../hooks/useInView';

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
      <div className="hero__pattern" />
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
            className="button-primary"
            style={{
              fontSize: '1.125rem',
              padding: '1rem 2.5rem',
              boxShadow: 'var(--shadow-lg)',
              transition: 'all var(--transition-bounce)',
            }}
          >
            {t('getStarted')}
          </button>
          <button
            onClick={scrollToFeatures}
            className="button-secondary"
            style={{
              fontSize: '1.125rem',
              padding: '0.9375rem 2.5rem',
              transition: 'all var(--transition-soft)',
            }}
          >
            {t('learnMore')}
          </button>
        </div>

        <div className="hero__preview animate-scale-up">
          <img
            src="/og.webp"
            alt="AI Manga Studio Preview"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}

