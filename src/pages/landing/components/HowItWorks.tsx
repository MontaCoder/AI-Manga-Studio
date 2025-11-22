import React from 'react';
import { useLocalization } from '@/hooks/useLocalization';
import { useInView } from '@/hooks/useInView';

interface StepCardProps {
  number: number;
  title: string;
  description: string;
  index: number;
}

function StepCard({ number, title, description, index }: StepCardProps): React.ReactElement {
  const [cardRef] = useInView({ threshold: 0.1 });

  const getAnimationClass = () => {
    switch (index % 2) {
      case 0:
        return 'animate-slide-left';
      case 1:
        return 'animate-slide-right';
      default:
        return 'animate-fade-up';
    }
  };

  return (
    <div
      ref={cardRef}
      className={`step-card surface-card ${getAnimationClass()}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2rem',
        position: 'relative',
        padding: 'clamp(2rem, 4vw, 3rem)',
        textAlign: 'center',
        animationDelay: `${index * 0.2}s`,
      }}
    >
      <div
        className="step-number"
        style={{
          width: '6rem',
          height: '6rem',
          borderRadius: '50%',
          background: 'var(--gradient-primary)',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2.5rem',
          fontWeight: 800,
          boxShadow: 'var(--shadow-lg), var(--shadow-glow)',
          position: 'relative',
          zIndex: 2,
          transition: 'all var(--transition-smooth)',
        }}
      >
        {number}
      </div>
      <div
        style={{
          maxWidth: '320px',
        }}
      >
        <h3
          className="heading-md"
          style={{
            marginBottom: '1rem',
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
      className="section"
      style={{
        background: 'var(--gradient-app)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background decorations */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: '250px',
          height: '250px',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(50px)',
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '20%',
          right: '10%',
          width: '350px',
          height: '350px',
          background: 'radial-gradient(circle, rgba(236, 72, 153, 0.06) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(70px)',
          zIndex: 0,
        }}
      />
      
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div
          className="section-header"
          style={{
            textAlign: 'center',
            marginBottom: 'clamp(4rem, 8vw, 6rem)',
          }}
        >
          <span className="heading-eyebrow animate-scale-in">
            Process
          </span>
          <h2
            className="heading-xl animate-fade-up"
            style={{
              marginBottom: '1.5rem',
              color: 'var(--color-text)',
            }}
          >
            {t('howItWorksTitle')}
          </h2>
          <p className="text-lead animate-fade-up-delayed" style={{ maxWidth: '600px', margin: '0 auto' }}>
            Create stunning manga in four simple steps with our AI-powered workflow
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
            gap: 'clamp(3rem, 6vw, 4rem)',
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
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}

