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
        background: 'var(--gradient-app)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.02,
          backgroundImage: `radial-gradient(circle at 2px 2px, var(--color-primary) 1px, transparent 0)`,
          backgroundSize: '48px 48px',
        }}
      />

      <div
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
          style={{
            fontSize: 'clamp(3rem, 7vw, 5rem)',
            fontWeight: 900,
            lineHeight: 1.05,
            letterSpacing: '-0.04em',
            marginBottom: '1.5rem',
            background: 'linear-gradient(135deg, var(--color-primary-strong) 0%, var(--color-primary) 50%, var(--color-accent) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            opacity: 0,
            transform: 'translateY(30px)',
            transition: 'all 1s ease-out 0.5s',
          }}
          className="animate-in"
        >
          {t('landingHero')}
        </h1>

        <p
          style={{
            fontSize: 'clamp(1.25rem, 2.2vw, 1.625rem)',
            lineHeight: 1.5,
            color: 'var(--color-text-muted)',
            maxWidth: '700px',
            margin: '0 auto 3rem',
            fontWeight: 500,
            opacity: 0,
            transform: 'translateY(20px)',
            transition: 'all 1s ease-out 0.7s',
          }}
          className="animate-in"
        >
          {t('landingSubtitle')}
        </p>

        <div
          style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
            opacity: 0,
            transform: 'translateY(20px)',
            transition: 'all 1s ease-out 0.9s',
          }}
          className="animate-in"
        >
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

        <div
          style={{
            marginTop: '4rem',
            maxWidth: '1000px',
            margin: '4rem auto 0',
            aspectRatio: '21/9',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid var(--color-border)',
            opacity: 0,
            transform: 'translateY(40px) scale(0.95)',
            transition: 'all 1.2s ease-out 1.1s',
          }}
          className="animate-in"
        >
          <img
            src="/og.webp"
            alt="AI Manga Studio Preview"
            loading="lazy"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </div>
      </div>
    </section>
  );
}

