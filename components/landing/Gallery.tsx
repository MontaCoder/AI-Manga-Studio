import React, { useEffect, useRef } from 'react';
import { useLocalization } from '../../hooks/useLocalization';

export function Gallery(): React.ReactElement {
  const { t } = useLocalization();
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
      id="gallery"
      ref={sectionRef}
      className="landing-gallery"
      style={{
        padding: 'clamp(4rem, 10vw, 8rem) clamp(1.5rem, 5vw, 3rem)',
        background: 'var(--surface-muted)',
      }}
    >
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
        }}
      >
        <div
          style={{
            textAlign: 'center',
            marginBottom: 'clamp(3rem, 6vw, 5rem)',
            opacity: 0,
            transform: 'translateY(20px)',
            transition: 'all 0.8s ease-out',
          }}
          className="gallery-header"
        >
          <h2
            className="heading-xl"
            style={{
              marginBottom: '1rem',
              color: 'var(--color-text)',
            }}
          >
            {t('galleryTitle')}
          </h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 350px), 1fr))',
            gap: 'clamp(1.5rem, 3vw, 2.5rem)',
          }}
        >
          <div
            className="gallery-item surface-card"
            style={{
              padding: 0,
              overflow: 'hidden',
              opacity: 0,
              transform: 'scale(0.95)',
              transition: 'all 0.6s ease-out',
            }}
          >
            <div
              style={{
                width: '100%',
                aspectRatio: '3/4',
                background: 'var(--slate-04)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <img
                src="/og.webp"
                alt="Manga Example 1"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </div>
          </div>

          <div
            className="gallery-item surface-card"
            style={{
              padding: 0,
              overflow: 'hidden',
              opacity: 0,
              transform: 'scale(0.95)',
              transition: 'all 0.6s ease-out',
              transitionDelay: '0.1s',
            }}
          >
            <div
              style={{
                width: '100%',
                aspectRatio: '3/4',
                background: 'var(--slate-04)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <img
                src="/og.webp"
                alt="Manga Example 2"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </div>
          </div>

          <div
            className="gallery-item surface-card"
            style={{
              padding: 0,
              overflow: 'hidden',
              opacity: 0,
              transform: 'scale(0.95)',
              transition: 'all 0.6s ease-out',
              transitionDelay: '0.2s',
            }}
          >
            <div
              style={{
                width: '100%',
                aspectRatio: '3/4',
                background: 'var(--slate-04)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <img
                src="/og.webp"
                alt="Manga Example 3"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

