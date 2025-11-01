import React, { useState } from 'react';
import { useLocalization } from '../../hooks/useLocalization';
import { useInView } from '../../hooks/useInView';

const galleryImages = [
  { src: '/1761919076.webp', alt: 'AI Generated Manga Art 1' },
  { src: '/1761921812.webp', alt: 'AI Generated Manga Art 2' },
  { src: '/1761921963.webp', alt: 'AI Generated Manga Art 3' },
  { src: '/1761922116.webp', alt: 'AI Generated Manga Art 4' },
];

export function Gallery(): React.ReactElement {
  const { t } = useLocalization();
  const [sectionRef] = useInView({ threshold: 0.1 });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

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
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
            gap: 'clamp(1.5rem, 3vw, 2rem)',
            alignItems: 'start',
          }}
        >
          {galleryImages.map((image, index) => (
            <GalleryItem
              key={index}
              image={image}
              index={index}
              hoveredIndex={hoveredIndex}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function GalleryItem({ image, index, hoveredIndex, onMouseEnter, onMouseLeave }: {
  image: { src: string; alt: string };
  index: number;
  hoveredIndex: number | null;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}): React.ReactElement {
  const [itemRef] = useInView({ threshold: 0.1 });

  return (
    <div
      ref={itemRef}
      className="gallery-item surface-card animate-scale-in"
      style={{
        padding: 0,
        overflow: 'hidden',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
        background: 'var(--surface-primary)',
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
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
  );
}

