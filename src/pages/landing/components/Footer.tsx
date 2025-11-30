import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalization } from '@/hooks/useLocalization';

const LANGS = [
  { key: 'en' as const, label: 'English' },
  { key: 'zh' as const, label: '中文' },
  { key: 'ja' as const, label: '日本語' },
];

export function Footer(): React.ReactElement {
  const { t, language, setLanguage } = useLocalization();
  const navigate = useNavigate();

  const linkStyle = (active?: boolean): React.CSSProperties => ({
    background: 'none',
    border: 'none',
    color: active ? 'var(--accent)' : 'rgba(255,255,255,0.7)',
    cursor: 'pointer',
    padding: '0.25rem 0',
    textAlign: 'left',
    fontSize: '0.875rem',
    textDecoration: 'none',
  });

  return (
    <footer style={{ 
      background: 'linear-gradient(180deg, #0F172A 0%, #020617 100%)', 
      color: 'rgba(255,255,255,0.9)', 
      padding: 'clamp(4rem, 8vw, 6rem) 0 2rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.3), transparent)'
      }} />
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2.5rem', marginBottom: '2.5rem' }}>
          <div>
            <h3 style={{ 
              fontSize: '1.375rem', 
              fontWeight: 700, 
              marginBottom: '1rem', 
              color: '#fff',
              letterSpacing: '-0.02em'
            }}>AI Manga Studio</h3>
            <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.65)', marginBottom: '1.5rem', lineHeight: 1.7 }}>{t('landingSubtitle')}</p>
            <button onClick={() => navigate('/studio')} className="button-accent" style={{ padding: '0.75rem 1.5rem' }}>{t('startCreating')}</button>
          </div>
          <div>
            <h4 style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '1rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{t('language')}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              {LANGS.map(l => (
                <button key={l.key} onClick={() => setLanguage(l.key)} style={{
                  ...linkStyle(language === l.key),
                  padding: '0.375rem 0',
                  transition: 'all 0.2s ease'
                }}>{l.label}</button>
              ))}
            </div>
          </div>
          <div>
            <h4 style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '1rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{t('footerDocs')}</h4>
            <a 
              href="https://github.com/MontaCoder/AI-Manga-Studio" 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{
                ...linkStyle(),
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s ease'
              }}
            >{t('footerGithub')}</a>
          </div>
        </div>
        <div style={{ 
          borderTop: '1px solid rgba(255,255,255,0.1)', 
          paddingTop: '2rem', 
          display: 'flex', 
          flexWrap: 'wrap', 
          justifyContent: 'space-between', 
          gap: '1rem', 
          fontSize: '0.8rem', 
          color: 'rgba(255,255,255,0.5)' 
        }}>
          <span>{t('footerMadeWith')} <span style={{ color: '#EF4444' }}>❤️</span> {t('footerMadeBy')} Montassar Hajri</span>
          <span>{t('footerLicense')} © {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}

