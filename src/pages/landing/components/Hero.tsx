import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowIcon, PlayIcon } from '@/components/icons/icons';
import { useLocalization } from '@/hooks/useLocalization';

const SHOWCASE_IMAGES = [
  '/images/demo/1761919076.webp',
  '/images/demo/1761921812.webp',
  '/images/demo/1761921963.webp',
];

export function Hero(): React.ReactElement {
  const { t } = useLocalization();
  const navigate = useNavigate();
  const highlights = [t('featureScriptTitle'), t('featurePanelTitle'), t('featureExportTitle')];
  const [pointer, setPointer] = React.useState({ x: 50, y: 50 });

  const visualStyle = {
    '--pointer-x': `${pointer.x}`,
    '--pointer-y': `${pointer.y}`,
  } as React.CSSProperties;

  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;
    setPointer({ x, y });
  };

  const spotlightSteps = [
    { value: '01', label: t('stepDefineTitle') },
    { value: '02', label: t('stepGenerateTitle') },
    { value: '03', label: t('stepRefineTitle') },
  ];

  return (
    <section className="hero" onPointerMove={handlePointerMove} onPointerLeave={() => setPointer({ x: 50, y: 50 })}>
      <video className="hero__video" autoPlay muted loop playsInline preload="metadata">
        <source src="/video/Website_Hero_Background_Video_Generation.webm" type="video/webm" />
      </video>
      <div className="hero__pattern" />
      <div className="hero__overlay" />

      <div className="hero__content">
        <div className="hero__copy">
          <span className="hero__eyebrow">{t('AIMangaStudio')}</span>
          <h1 className="hero__title">{t('landingHero')}</h1>
          <p className="hero__subtitle">{t('landingSubtitle')}</p>

          <div className="hero__actions">
            <button onClick={() => navigate('/studio')} className="button-primary button-lg">
              <span>{t('getStarted')}</span>
              <ArrowIcon className="w-5 h-5" />
            </button>
            <button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} className="button-secondary button-lg hero__secondary-action">
              <PlayIcon className="w-5 h-5" />
              <span>{t('learnMore')}</span>
            </button>
          </div>

          <div className="hero__pill-row">
            {highlights.map((label) => (
              <span key={label} className="hero__pill">{label}</span>
            ))}
          </div>

          <div className="hero__stat-strip">
            {spotlightSteps.map((item) => (
              <article key={item.value} className="hero__stat-card">
                <span className="hero__stat-value">{item.value}</span>
                <span className="hero__stat-label">{item.label}</span>
              </article>
            ))}
          </div>
        </div>

        <div className="hero__visual" aria-hidden="true" style={visualStyle}>
          <div className="hero__visual-glow" />
          <div className="hero__panel">
            <div className="hero__panel-head">
              <span>{t('galleryTitle')}</span>
              <span>01</span>
            </div>

            <figure className="hero__panel-shot">
              <img src={SHOWCASE_IMAGES[0]} alt="" />
            </figure>

            <div className="hero__panel-meta">
              {highlights.map((label) => (
                <span key={label} className="hero__panel-tag">{label}</span>
              ))}
            </div>
          </div>

          <figure className="hero__floating-frame hero__floating-frame--top">
            <img src={SHOWCASE_IMAGES[1]} alt="" />
          </figure>
          <figure className="hero__floating-frame hero__floating-frame--bottom">
            <img src={SHOWCASE_IMAGES[2]} alt="" />
          </figure>

          <div className="hero__caption-card">
            <span className="hero__caption-eyebrow">{t('howItWorksTitle')}</span>
            <strong>{t('featurePanelTitle')}</strong>
            <p>{t('featurePanelDesc')}</p>
          </div>

          <div className="hero__stamp">{t('howItWorksTitle')}</div>
        </div>
      </div>
    </section>
  );
}
