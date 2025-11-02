import React from 'react';
import { useLocalization } from '../../hooks/useLocalization';
import { useInView } from '../../hooks/useInView';
import {
  SparklesIcon,
  UserGroupIcon,
  RectangleStackIcon,
  ArrowDownTrayIcon,
  LanguageIcon,
  VideoCameraIcon,
} from '../icons';

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
      style={{
        padding: 'clamp(1.5rem, 3vw, 2rem)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
      }}
    >
      <div
        style={{
          width: '3.5rem',
          height: '3.5rem',
          borderRadius: 'var(--radius-md)',
          background: 'var(--accent-12)',
          border: '1px solid var(--accent-20)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-accent-strong)',
        }}
      >
        {icon}
      </div>
      <div>
        <h3
          className="heading-md"
          style={{
            marginBottom: '0.75rem',
            color: 'var(--color-text)',
          }}
        >
          {title}
        </h3>
        <p
          className="text-subtle"
          style={{
            lineHeight: 1.7,
          }}
        >
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
            {t('featuresTitle')}
          </h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
            gap: 'clamp(1.5rem, 3vw, 2.5rem)',
          }}
        >
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

