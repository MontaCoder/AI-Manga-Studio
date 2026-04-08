import React, { useEffect, useState } from 'react';
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
  const [isPaused, setIsPaused] = useState(false);

  const galleryItems = [
    { src: IMAGES[0], title: t('featureScriptTitle'), desc: t('featureScriptDesc') },
    { src: IMAGES[1], title: t('featureCharacterTitle'), desc: t('featureCharacterDesc') },
    { src: IMAGES[2], title: t('featurePanelTitle'), desc: t('featurePanelDesc') },
    { src: IMAGES[3], title: t('featureVideoTitle'), desc: t('featureVideoDesc') },
  ];

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => setIdx((i) => (i + 1) % galleryItems.length), 3200);
    return () => clearInterval(timer);
  }, [galleryItems.length, isPaused]);

  return (
    <section id="gallery" ref={sectionRef} className="section section--muted">
      <div className="container">
        <div className="section-header section-header--split">
          <div>
            <span className="heading-eyebrow">{t('galleryTitle')}</span>
            <h2 className="heading-xl">{t('galleryTitle')}</h2>
          </div>
          <p className="text-lead">{galleryItems[idx].desc}</p>
        </div>

        <div className="gallery-shell" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
          <div className="gallery-copy surface-card animate-fade-up">
            <div className="gallery-copy__eyebrow">
              <span className="badge-inline">{String(idx + 1).padStart(2, '0')}</span>
              <span>{isPaused ? t('viewCollection') : t('galleryTitle')}</span>
            </div>
            <h3 className="gallery-copy__title">{galleryItems[idx].title}</h3>
            <p className="gallery-copy__description">{galleryItems[idx].desc}</p>

            <div className="gallery-progress" role="tablist" aria-label={t('galleryTitle')}>
              {galleryItems.map((item, itemIdx) => (
                <button
                  key={`${item.src}-progress`}
                  type="button"
                  onClick={() => setIdx(itemIdx)}
                  className={`gallery-progress__step ${idx === itemIdx ? 'is-active' : ''}`}
                  aria-label={`Show ${item.title}`}
                  aria-pressed={idx === itemIdx}
                >
                  <span />
                </button>
              ))}
            </div>

            <div className="gallery-thumbs">
              {galleryItems.map((item, itemIdx) => (
                <button
                  key={item.src}
                  type="button"
                  onClick={() => setIdx(itemIdx)}
                  className={`gallery-thumb ${idx === itemIdx ? 'is-active' : ''}`}
                  aria-label={`Show ${item.title}`}
                >
                  <img src={item.src} alt="" />
                  <span>
                    <strong>{item.title}</strong>
                    <small>{item.desc}</small>
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="gallery-stage animate-scale-in">
            <div className="gallery-stage__frame" key={galleryItems[idx].src}>
              <img src={galleryItems[idx].src} alt={galleryItems[idx].title} loading="lazy" />
            </div>
            <div className="gallery-stage__hud">
              <span className="gallery-stage__counter">{String(idx + 1).padStart(2, '0')} / {String(galleryItems.length).padStart(2, '0')}</span>
              <div className="gallery-stage__caption">{galleryItems[idx].title}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
