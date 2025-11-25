import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalization } from '@/hooks/useLocalization';

export function FinalCTA(): React.ReactElement {
  const { t } = useLocalization();
  const navigate = useNavigate();

  return (
    <section className="section" style={{ padding: 'clamp(4rem, 10vw, 8rem) 0' }}>
      <div className="container" style={{ textAlign: 'center', maxWidth: '800px' }}>
        <h2 className="heading-xl" style={{ marginBottom: '1rem' }}>{t('finalCtaTitle')}</h2>
        <p className="text-lead" style={{ marginBottom: '2rem' }}>{t('finalCtaSubtitle')}</p>
        <button onClick={() => navigate('/studio')} className="button-primary button-lg">{t('startCreating')}</button>
      </div>
    </section>
  );
}

