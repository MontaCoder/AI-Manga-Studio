import React from 'react';
import { useLocalization } from '@/hooks/useLocalization';
import { useInView } from '@/hooks/useInView';
import {
  SparklesIcon,
  UserGroupIcon,
  RectangleStackIcon,
  ArrowDownTrayIcon,
  LanguageIcon,
  VideoCameraIcon,
} from '@/components/icons/icons';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, index }) => {
  const [cardRef] = useInView({ threshold: 0.1 });

  return (
    <div
      ref={cardRef}
      className="feature-card surface-card animate-slide-up"
    >
      <div className="feature-card__icon">
        {icon}
      </div>
      <div className="feature-card__content">
        <h3 className="feature-card__title">
          {title}
        </h3>
        <p className="feature-card__description">
          {description}
        </p>
      </div>
    </div>
  );
};

export function Features(): React.ReactElement {
  const { t } = useLocalization();
  const [sectionRef] = useInView({ threshold: 0.1 });

  const features = [
    {
      icon: <SparklesIcon className="w-8 h-8" />,
      title: t('featureScriptTitle'),
      description: t('featureScriptDesc'),
    },
    {
      icon: <UserGroupIcon className="w-8 h-8" />,
      title: t('featureCharacterTitle'),
      description: t('featureCharacterDesc'),
    },
    {
      icon: <RectangleStackIcon className="w-8 h-8" />,
      title: t('featurePanelTitle'),
      description: t('featurePanelDesc'),
    },
    {
      icon: <ArrowDownTrayIcon className="w-8 h-8" />,
      title: t('featureExportTitle'),
      description: t('featureExportDesc'),
    },
    {
      icon: <LanguageIcon className="w-8 h-8" />,
      title: t('featureLanguageTitle'),
      description: t('featureLanguageDesc'),
    },
    {
      icon: <VideoCameraIcon className="w-8 h-8" />,
      title: t('featureVideoTitle'),
      description: t('featureVideoDesc'),
    },
  ];

  return (
    <section
      id="features"
      ref={sectionRef}
      className="section section--muted"
    >
      <div className="container">
        <div className="section-header">
          <h2 className="heading-xl">
            {t('featuresTitle')}
          </h2>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <FeatureCard
              key={`feature-${index}`}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

