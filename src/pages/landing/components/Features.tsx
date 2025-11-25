import React from 'react';
import { useLocalization } from '@/hooks/useLocalization';
import { useInView } from '@/hooks/useInView';
import { SparklesIcon, UserGroupIcon, RectangleStackIcon, ArrowDownTrayIcon, LanguageIcon, VideoCameraIcon } from '@/components/icons/icons';

export function Features(): React.ReactElement {
  const { t } = useLocalization();
  const [sectionRef] = useInView({ threshold: 0.1 });

  const features = [
    { icon: <SparklesIcon className="w-8 h-8" />, title: t('featureScriptTitle'), desc: t('featureScriptDesc') },
    { icon: <UserGroupIcon className="w-8 h-8" />, title: t('featureCharacterTitle'), desc: t('featureCharacterDesc') },
    { icon: <RectangleStackIcon className="w-8 h-8" />, title: t('featurePanelTitle'), desc: t('featurePanelDesc') },
    { icon: <ArrowDownTrayIcon className="w-8 h-8" />, title: t('featureExportTitle'), desc: t('featureExportDesc') },
    { icon: <LanguageIcon className="w-8 h-8" />, title: t('featureLanguageTitle'), desc: t('featureLanguageDesc') },
    { icon: <VideoCameraIcon className="w-8 h-8" />, title: t('featureVideoTitle'), desc: t('featureVideoDesc') },
  ];

  return (
    <section id="features" ref={sectionRef} className="section section--muted">
      <div className="container">
        <div className="section-header">
          <span className="heading-eyebrow">{t('featuresTitle') || 'Features'}</span>
          <h2 className="heading-xl">{t('featuresHeading')}</h2>
          <p className="text-lead" style={{ maxWidth: '600px', margin: '0 auto' }}>{t('featuresDescription')}</p>
        </div>
        <div className="features-grid">
          {features.map((f, i) => (
            <div key={i} className="feature-card surface-card animate-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="feature-card__icon">{f.icon}</div>
              <div className="feature-card__content">
                <h3 className="feature-card__title">{f.title}</h3>
                <p className="feature-card__description">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

