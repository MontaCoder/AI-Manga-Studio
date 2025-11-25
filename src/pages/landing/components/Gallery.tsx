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
        <div style={{ maxWidth: '600px', margin: '0 auto', overflow: 'hidden', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ display: 'flex', transition: 'transform 0.5s ease', transform: `translateX(-${idx * 100}%)` }}>
            {IMAGES.map((src, i) => (
              <img key={i} src={src} alt={`Demo ${i + 1}`} loading="lazy" style={{ minWidth: '100%', aspectRatio: '4/5', objectFit: 'cover' }} />
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem' }}>
            {IMAGES.map((_, i) => (
              <button key={i} onClick={() => setIdx(i)} style={{ width: 10, height: 10, borderRadius: '50%', border: 'none', background: idx === i ? 'var(--accent)' : 'var(--border)', cursor: 'pointer', transition: 'background 0.2s' }} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

