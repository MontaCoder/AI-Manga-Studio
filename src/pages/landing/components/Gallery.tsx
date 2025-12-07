import React, { useState, useEffect } from 'react';
import { useLocalization } from '@/hooks/useLocalization';
import { useInView } from '@/hooks/useInView';

const IMAGES = [
  '/images/demo/1761919076.webp',
  '/images/demo/1761921812.webp',
  '/images/demo/1761921963.webp',
  '/images/demo/1761922116.webp',
];

export function Gallery(): React.ReactElement {
  const { t } = useLocalization();
  const [sectionRef] = useInView({ threshold: 0.1 });
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIdx(i => (i + 1) % IMAGES.length), 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="gallery" ref={sectionRef} className="section section--muted">
      <div className="container">
        <div className="section-header">
          <h2 className="heading-xl">{t('galleryTitle')}</h2>
        </div>
        <div dir="ltr" style={{ 
          maxWidth: '600px', 
          margin: '0 auto', 
          overflow: 'hidden', 
          borderRadius: '1rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
          border: '1px solid var(--border)'
        }}>
          <div style={{ 
            display: 'flex', 
            transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)', 
            transform: `translateX(-${idx * 100}%)` 
          }}>
            {IMAGES.map((src, i) => (
              <img 
                key={i} 
                src={src} 
                alt={`Demo ${i + 1}`} 
                loading="lazy" 
                style={{ 
                  minWidth: '100%', 
                  aspectRatio: '4/5', 
                  objectFit: 'cover',
                  transition: 'transform 0.4s ease',
                  transform: idx === i ? 'scale(1)' : 'scale(0.98)'
                }} 
              />
            ))}
          </div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '0.75rem', 
            marginTop: '1.5rem' 
          }}>
            {IMAGES.map((_, i) => (
              <button 
                key={i} 
                onClick={() => setIdx(i)} 
                aria-label={`Go to slide ${i + 1}`}
                style={{ 
                  width: idx === i ? 24 : 10, 
                  height: 10, 
                  borderRadius: '5px', 
                  border: 'none', 
                  background: idx === i ? 'var(--accent)' : 'var(--border)', 
                  cursor: 'pointer', 
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: idx === i ? '0 0 12px rgba(59, 130, 246, 0.4)' : 'none'
                }} 
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

