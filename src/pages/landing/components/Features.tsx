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

  const getAnimationClass = () => {
    switch (index % 3) {
      case 0:
        return 'animate-slide-left';
      case 1:
        return 'animate-fade-up';
      case 2:
        return 'animate-slide-right';
      default:
        return 'animate-fade-up';
    }
  };

  return (
    <div
      ref={cardRef}
      className={`feature-card surface-card ${getAnimationClass()}`}
      style={{
        animationDelay: `${index * 0.15}s`,
      }}
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
      icon: <SparklesIcon className="w-10 h-10" />,
      title: t('featureScriptTitle'),
      description: t('featureScriptDesc'),
    },
    {
      icon: <UserGroupIcon className="w-10 h-10" />,
      title: t('featureCharacterTitle'),
      description: t('featureCharacterDesc'),
    },
    {
      icon: <RectangleStackIcon className="w-10 h-10" />,
      title: t('featurePanelTitle'),
      description: t('featurePanelDesc'),
    },
    {
      icon: <ArrowDownTrayIcon className="w-10 h-10" />,
      title: t('featureExportTitle'),
      description: t('featureExportDesc'),
    },
    {
      icon: <LanguageIcon className="w-10 h-10" />,
      title: t('featureLanguageTitle'),
      description: t('featureLanguageDesc'),
    },
    {
      icon: <VideoCameraIcon className="w-10 h-10" />,
      title: t('featureVideoTitle'),
      description: t('featureVideoDesc'),
    },
  ];

  return (
    <section
      id="features"
      ref={sectionRef}
      className="section section--muted"
      style={{
        background: 'var(--gradient-surface)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background decoration */}
      <div
        style={{
          position: 'absolute',
          top: '10%',
          left: '5%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(40px)',
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '10%',
          right: '5%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(147, 51, 234, 0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          zIndex: 0,
        }}
      />
      
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div className="section-header">
          <span className="heading-eyebrow animate-scale-in">
            {t('featuresTitle') || 'Features'}
          </span>
          <h2 className="heading-xl animate-fade-up">
            {t('featuresHeadingTitle')}
          </h2>
          <p className="text-lead animate-fade-up-delayed" style={{ maxWidth: '600px', margin: '0 auto' }}>
            {t('featuresHeadingSubtitle')}
          </p>
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

