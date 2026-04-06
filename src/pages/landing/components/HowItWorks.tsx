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
        <div className="section-header section-header--split">
          <div>
            <span className="heading-eyebrow">{t('howItWorksTitle')}</span>
            <h2 className="heading-xl">{t('howItWorksTitle')}</h2>
          </div>
          <p className="text-lead">{t('landingSubtitle')}</p>
        </div>

        <div className="process-grid">
          {steps.map((step, index) => (
            <article key={step.title} className="process-card surface-card animate-fade-up">
              <span className="process-card__number">{String(index + 1).padStart(2, '0')}</span>
              <h3 className="process-card__title">{step.title}</h3>
              <p className="process-card__description">{step.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
