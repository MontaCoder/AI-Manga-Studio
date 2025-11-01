import React from 'react';
import { useLocalization } from '../../hooks/useLocalization';
import { useInView } from '../../hooks/useInView';

interface StepCardProps {
  number: number;
  title: string;
  description: string;
  index: number;
}

function StepCard({ number, title, description, index }: StepCardProps): React.ReactElement {
  const [cardRef] = useInView({ threshold: 0.1 });

  return (
    <div
      ref={cardRef}
      className="step-card animate-slide-up"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.5rem',
        position: 'relative',
      }}
    >
      <div
        style={{
          width: '5rem',
          height: '5rem',
          borderRadius: '50%',
          background: 'var(--gradient-primary)',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2rem',
          fontWeight: 800,
          boxShadow: 'var(--shadow-md)',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {number}
      </div>
      <div
        style={{
          textAlign: 'center',
          maxWidth: '300px',
        }}
      >
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

export function HowItWorks(): React.ReactElement {
  const { t } = useLocalization();
  const [sectionRef] = useInView({ threshold: 0.1 });

  const steps = [
    {
      title: t('stepDefineTitle'),
      description: t('stepDefineDesc'),
    },
    {
      title: t('stepGenerateTitle'),
      description: t('stepGenerateDesc'),
    },
    {
      title: t('stepRefineTitle'),
      description: t('stepRefineDesc'),
    },
    {
      title: t('stepExportTitle'),
      description: t('stepExportDesc'),
    },
  ];

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="section section--gradient"
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
            {t('howItWorksTitle')}
          </h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))',
            gap: 'clamp(2.5rem, 5vw, 4rem)',
            position: 'relative',
          }}
        >
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              <StepCard
                number={index + 1}
                title={step.title}
                description={step.description}
                index={index}
              />
              {index < steps.length - 1 && (
                <div
                  style={{
                    position: 'absolute',
                    top: '2.5rem',
                    left: `calc(${(index + 1) * 25}% - 2rem)`,
                    width: 'calc(25% - 4rem)',
                    height: '2px',
                    background: 'var(--color-border)',
                    display: window.innerWidth < 768 ? 'none' : 'block',
                  }}
                  className="step-connector"
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}

