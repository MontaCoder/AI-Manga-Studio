import React from 'react';
import { SparklesIcon, UserGroupIcon, RectangleStackIcon, ArrowDownTrayIcon, LanguageIcon, VideoCameraIcon } from '@/components/icons/icons';
import { useLocalization } from '@/hooks/useLocalization';
import { useInView } from '@/hooks/useInView';

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
        <div className="section-header section-header--split">
          <div>
            <span className="heading-eyebrow">{t('featuresTitle') || 'Features'}</span>
            <h2 className="heading-xl">{t('featuresHeading')}</h2>
          </div>
          <p className="text-lead">{t('featuresDescription')}</p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <article key={feature.title} className={`feature-card surface-card animate-fade-up ${index === 0 ? 'feature-card--spotlight' : ''}`}>
              <div className="feature-card__top">
                <span className="feature-card__index">{String(index + 1).padStart(2, '0')}</span>
                <div className="feature-card__icon">{feature.icon}</div>
              </div>

              <div className="feature-card__content">
                <h3 className="feature-card__title">{feature.title}</h3>
                <p className="feature-card__description">{feature.desc}</p>
              </div>

              <div className="feature-card__footer">
                <span className="text-caption">{t('AIMangaStudio')}</span>
                <span className="feature-card__footer-mark">/{String(index + 1).padStart(2, '0')}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
