import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalization } from '../../hooks/useLocalization';

export function Hero(): React.ReactElement {
  const { t } = useLocalization();
  const navigate = useNavigate();
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => {
      if (heroRef.current) {
        observer.unobserve(heroRef.current);
      }
    };
  }, []);

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features');
    featuresSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      ref={heroRef}
      className="landing-hero"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        className="landing-hero__background"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'var(--gradient-app)',
          zIndex: 0,
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.03,
            backgroundImage: `radial-gradient(circle at 2px 2px, var(--color-primary) 1px, transparent 0)`,
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      <div
        className="landing-hero__content"
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '1200px',
          margin: '0 auto',
          padding: 'clamp(2rem, 5vw, 4rem)',
          textAlign: 'center',
        }}
      >
        <h1
          className="landing-hero__title"
          style={{
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            color: 'var(--color-text)',
            marginBottom: '1.5rem',
            background: 'linear-gradient(135deg, var(--color-primary-strong), var(--color-primary), var(--color-accent))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {t('landingHero')}
        </h1>

        <p
          className="landing-hero__subtitle"
          style={{
            fontSize: 'clamp(1.125rem, 2vw, 1.5rem)',
            lineHeight: 1.6,
            color: 'var(--color-text-muted)',
            maxWidth: '800px',
            margin: '0 auto 3rem',
            fontWeight: 500,
          }}
        >
          {t('landingSubtitle')}
        </p>

        <div
          className="landing-hero__actions"
          style={{
            display: 'flex',
            gap: '1.25rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <button
            onClick={() => navigate('/studio')}
            className="button-primary"
            style={{
              fontSize: '1.125rem',
              padding: '1rem 2.5rem',
              boxShadow: 'var(--shadow-md)',
              transition: 'all var(--transition-soft)',
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
            }}
          >
            {t('learnMore')}
          </button>
        </div>

        <div
          className="landing-hero__visual"
          style={{
            marginTop: '4rem',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              maxWidth: '900px',
              width: '100%',
              aspectRatio: '16/9',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid var(--color-border)',
              background: 'var(--surface-primary)',
            }}
          >
            <img
              src="/og.webp"
              alt="AI Manga Studio Preview"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

