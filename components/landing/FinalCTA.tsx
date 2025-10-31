import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalization } from '../../hooks/useLocalization';

export function FinalCTA(): React.ReactElement {
  const { t } = useLocalization();
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLElement>(null);

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

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="landing-final-cta"
      style={{
        padding: 'clamp(5rem, 12vw, 10rem) clamp(1.5rem, 5vw, 3rem)',
        background: 'var(--gradient-app)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.05,
          backgroundImage: `radial-gradient(circle at 2px 2px, var(--color-primary) 1px, transparent 0)`,
          backgroundSize: '48px 48px',
        }}
      />

      <div
        style={{
          maxWidth: '900px',
          margin: '0 auto',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1,
          opacity: 0,
          transform: 'translateY(30px)',
          transition: 'all 0.8s ease-out',
        }}
        className="final-cta-content"
      >
        <h2
          className="heading-xl"
          style={{
            marginBottom: '1.5rem',
            color: 'var(--color-text)',
          }}
        >
          {t('finalCtaTitle')}
        </h2>

        <p
          style={{
            fontSize: 'clamp(1.125rem, 2vw, 1.375rem)',
            lineHeight: 1.6,
            color: 'var(--color-text-muted)',
            marginBottom: '3rem',
            fontWeight: 500,
          }}
        >
          {t('finalCtaSubtitle')}
        </p>

        <button
          onClick={() => navigate('/studio')}
          className="button-primary"
          style={{
            fontSize: '1.25rem',
            padding: '1.125rem 3rem',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          {t('startCreating')}
        </button>
      </div>
    </section>
  );
}

