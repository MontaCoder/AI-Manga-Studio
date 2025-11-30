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
            <div key={i} className="surface-card animate-fade-up" style={{ textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
              <div style={{ 
                position: 'absolute',
                top: '-20px',
                right: '-20px',
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(139, 92, 246, 0.05))',
                pointerEvents: 'none'
              }} />
              <div style={{ 
                width: '4.5rem', 
                height: '4.5rem', 
                borderRadius: '50%', 
                background: 'linear-gradient(135deg, var(--accent), #6366F1)', 
                color: '#fff', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: '1.75rem', 
                fontWeight: 700, 
                margin: '0 auto 1.75rem', 
                boxShadow: '0 8px 24px rgba(59, 130, 246, 0.35), inset 0 1px 0 rgba(255,255,255,0.2)',
                position: 'relative',
                transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
              }}>
                {i + 1}
              </div>
              <h3 className="heading-md" style={{ marginBottom: '0.875rem', position: 'relative' }}>{step.title}</h3>
              <p className="text-lead" style={{ position: 'relative', lineHeight: 1.7 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

