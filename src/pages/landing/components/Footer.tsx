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
    <footer style={{ background: 'var(--primary)', color: 'rgba(255,255,255,0.9)', padding: 'clamp(3rem, 6vw, 5rem) 0 2rem' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem', color: '#fff' }}>AI Manga Studio</h3>
            <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)', marginBottom: '1rem', lineHeight: 1.6 }}>{t('landingSubtitle')}</p>
            <button onClick={() => navigate('/studio')} className="button-accent">{t('startCreating')}</button>
          </div>
          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.75rem', color: '#fff' }}>{t('language')}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {LANGS.map(l => (
                <button key={l.key} onClick={() => setLanguage(l.key)} style={linkStyle(language === l.key)}>{l.label}</button>
              ))}
            </div>
          </div>
          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.75rem', color: '#fff' }}>{t('footerDocs')}</h4>
            <a href="https://github.com/MontaCoder/AI-Manga-Studio" target="_blank" rel="noopener noreferrer" style={linkStyle()}>{t('footerGithub')}</a>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '1.5rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '1rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>
          <span>{t('footerMadeWith')} ❤️ {t('footerMadeBy')} Montassar Hajri</span>
          <span>{t('footerLicense')} © {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}

