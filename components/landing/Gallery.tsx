import React, { useEffect, useRef, useState } from 'react';
import { useLocalization } from '../../hooks/useLocalization';

const galleryImages = [
  { src: '/1761919076.webp', alt: 'AI Generated Manga Art 1' },
  { src: '/1761921812.webp', alt: 'AI Generated Manga Art 2' },
  { src: '/1761921963.webp', alt: 'AI Generated Manga Art 3' },
  { src: '/1761922116.webp', alt: 'AI Generated Manga Art 4' },
];

export function Gallery(): React.ReactElement {
  const { t } = useLocalization();
  const sectionRef = useRef<HTMLElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

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
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
            gap: 'clamp(1.5rem, 3vw, 2rem)',
            alignItems: 'start',
          }}
        >
          {galleryImages.map((image, index) => (
            <div
              key={index}
              className="gallery-item surface-card"
              style={{
                padding: 0,
                overflow: 'hidden',
                opacity: 0,
                transform: 'scale(0.95) translateY(10px)',
                transition: 'all 0.6s cubic-bezier(0.25, 0.1, 0.25, 1)',
                transitionDelay: `${index * 0.1}s`,
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-subtle)',
                background: 'var(--surface-primary)',
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div
                style={{
                  width: '100%',
                  aspectRatio: '4/5',
                  position: 'relative',
                  overflow: 'hidden',
                  background: 'var(--surface-secondary)',
                }}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.4s ease-out',
                    transform: hoveredIndex === index ? 'scale(1.05)' : 'scale(1)',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to bottom, transparent 60%, rgba(44, 62, 80, 0.1) 100%)',
                    opacity: hoveredIndex === index ? 1 : 0,
                    transition: 'opacity 0.3s ease-out',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

