import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalization } from '@/hooks/useLocalization';

export function FinalCTA(): React.ReactElement {
  const { t } = useLocalization();
  const navigate = useNavigate();

  return (
    <section className="section" style={{ 
      padding: 'clamp(5rem, 12vw, 10rem) 0',
      background: 'linear-gradient(180deg, var(--bg) 0%, var(--bg-muted) 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />
      <div className="container" style={{ textAlign: 'center', maxWidth: '800px', position: 'relative' }}>
        <h2 className="heading-xl" style={{ marginBottom: '1.25rem' }}>{t('finalCtaTitle')}</h2>
        <p className="text-lead" style={{ marginBottom: '2.5rem', maxWidth: '600px', margin: '0 auto 2.5rem' }}>{t('finalCtaSubtitle')}</p>
        <button 
          onClick={() => navigate('/studio')} 
          className="button-primary button-lg"
          style={{
            padding: '1.125rem 2.5rem',
            fontSize: '1.0625rem',
            boxShadow: '0 8px 30px rgba(59, 130, 246, 0.35)'
          }}
        >
          {t('startCreating')}
        </button>
      </div>
    </section>
  );
}

