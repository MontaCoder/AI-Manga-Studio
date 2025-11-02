import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalization } from '@/hooks/useLocalization';
import { useInView } from '@/hooks/useInView';

export function FinalCTA(): React.ReactElement {
  const { t } = useLocalization();
  const navigate = useNavigate();
  const [sectionRef] = useInView({ threshold: 0.1 });

  return (
    <section
      ref={sectionRef}
      className="section section--gradient"
      style={{
        position: 'relative',
        overflow: 'hidden',
        padding: 'clamp(5rem, 12vw, 10rem) clamp(1.5rem, 5vw, 3rem)',
      }}
    >
      <div className="hero__pattern" />
      <div className="container">
        <div
          className="section-header"
          style={{
            maxWidth: '900px',
            margin: '0 auto',
            textAlign: 'center',
            position: 'relative',
            zIndex: 1,
          }}
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
      </div>
    </section>
  );
}

