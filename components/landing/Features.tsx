import React, { useEffect, useRef } from 'react';
import { useLocalization } from '../../hooks/useLocalization';
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

function FeatureCard({ icon, title, description, index }: FeatureCardProps): React.ReactElement {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('animate-in');
            }, index * 100);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, [index]);

  return (
    <div
      ref={cardRef}
      className="feature-card surface-card"
      style={{
        padding: 'clamp(1.5rem, 3vw, 2rem)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        opacity: 0,
        transform: 'translateY(30px)',
        transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
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
}

export function Features(): React.ReactElement {
  const { t } = useLocalization();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

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
      className="landing-features"
      style={{
        padding: 'clamp(4rem, 10vw, 8rem) clamp(1.5rem, 5vw, 3rem)',
        background: 'var(--surface-muted)',
      }}
    >
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
        }}
      >
        <div
          style={{
            textAlign: 'center',
            marginBottom: 'clamp(3rem, 6vw, 5rem)',
            opacity: 0,
            transform: 'translateY(20px)',
            transition: 'all 0.8s ease-out',
          }}
          className="features-header"
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
            <React.Fragment key={`feature-${index}`}>
              <FeatureCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                index={index}
              />
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}

