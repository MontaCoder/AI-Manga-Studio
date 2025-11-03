import React, { useState, useEffect } from 'react';
import { useLocalization } from '@/hooks/useLocalization';
import { useInView } from '@/hooks/useInView';

const galleryImages = [
  { src: '/images/demo/1761919076.webp', alt: 'AI Generated Manga Art 1' },
  { src: '/images/demo/1761921812.webp', alt: 'AI Generated Manga Art 2' },
  { src: '/images/demo/1761921963.webp', alt: 'AI Generated Manga Art 3' },
  { src: '/images/demo/1761922116.webp', alt: 'AI Generated Manga Art 4' },
];

export function Gallery(): React.ReactElement {
  const { t } = useLocalization();
  const [sectionRef] = useInView({ threshold: 0.1 });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Auto-advance carousel every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % galleryImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="gallery"
      ref={sectionRef}
      className="section section--muted"
    >
      <div className="container">
        <div
          className="section-header"
          style={{
            textAlign: 'center',
            marginBottom: 'clamp(3rem, 6vw, 5rem)',
          }}
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
            position: 'relative',
            maxWidth: '600px',
            margin: '0 auto',
            overflow: 'hidden',
            borderRadius: 'var(--radius-lg)',
          }}
        >
          {/* Carousel Container */}
          <div
            style={{
              display: 'flex',
              transition: 'transform 0.5s ease-in-out',
              transform: `translateX(-${currentIndex * 100}%)`,
            }}
          >
            {galleryImages.map((image, index) => (
              <div
                key={index}
                style={{
                  minWidth: '100%',
                  aspectRatio: '4/5',
                  position: 'relative',
                  overflow: 'hidden',
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
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
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
            ))}
          </div>

          {/* Navigation Indicators */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '0.5rem',
              marginTop: '1.5rem',
            }}
          >
            {galleryImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  border: 'none',
                  background: currentIndex === index ? 'var(--color-primary)' : 'var(--border-subtle)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

