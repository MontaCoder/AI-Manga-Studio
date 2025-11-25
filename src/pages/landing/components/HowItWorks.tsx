import React from 'react';
import { useLocalization } from '@/hooks/useLocalization';
import { useInView } from '@/hooks/useInView';

export function HowItWorks(): React.ReactElement {
  const { t } = useLocalization();
  const [sectionRef] = useInView({ threshold: 0.1 });

  const steps = [
    { title: t('stepDefineTitle'), desc: t('stepDefineDesc') },
    { title: t('stepGenerateTitle'), desc: t('stepGenerateDesc') },
    { title: t('stepRefineTitle'), desc: t('stepRefineDesc') },
    { title: t('stepExportTitle'), desc: t('stepExportDesc') },
  ];

  return (
    <section id="how-it-works" ref={sectionRef} className="section">
      <div className="container">
        <div className="section-header">
          <span className="heading-eyebrow">Process</span>
          <h2 className="heading-xl">{t('howItWorksTitle')}</h2>
          <p className="text-lead" style={{ maxWidth: '600px', margin: '0 auto' }}>
            Create stunning manga in four simple steps
          </p>
        </div>
        <div className="features-grid">
          {steps.map((step, i) => (
            <div key={i} className="surface-card animate-fade-up" style={{ textAlign: 'center', animationDelay: `${i * 0.1}s` }}>
              <div style={{ width: '4rem', height: '4rem', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), var(--accent-hover))', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', fontWeight: 700, margin: '0 auto 1.5rem', boxShadow: 'var(--shadow-lg)' }}>
                {i + 1}
              </div>
              <h3 className="heading-md" style={{ marginBottom: '0.75rem' }}>{step.title}</h3>
              <p className="text-lead">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

