import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalization } from '@/hooks/useLocalization';
import { GlobeIcon } from '@/components/icons/icons';

export function Footer(): React.ReactElement {
  const { t, language, setLanguage } = useLocalization();
  const navigate = useNavigate();

  return (
    <footer
      className="landing-footer"
      style={{
        background: 'var(--color-primary-strong)',
        color: 'rgba(255, 255, 255, 0.9)',
        padding: 'clamp(3rem, 6vw, 5rem) clamp(1.5rem, 5vw, 3rem) clamp(2rem, 4vw, 3rem)',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))',
            gap: 'clamp(2rem, 4vw, 3rem)',
            marginBottom: '3rem',
          }}
        >
          <div>
            <h3
              style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                marginBottom: '1rem',
                color: '#fff',
              }}
            >
              AI Manga Studio
            </h3>
            <p
              style={{
                fontSize: '0.875rem',
                lineHeight: 1.7,
                color: 'rgba(255, 255, 255, 0.75)',
                marginBottom: '1.5rem',
              }}
            >
              {t('landingSubtitle')}
            </p>
            <button
              onClick={() => navigate('/studio')}
              className="button-accent"
              style={{
                marginTop: '0.5rem',
              }}
            >
              {t('startCreating')}
            </button>
          </div>

          <div>
            <h4
              style={{
                fontSize: '1rem',
                fontWeight: 600,
                marginBottom: '1rem',
                color: '#fff',
              }}
            >
              {t('language')}
            </h4>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}
            >
              <button
                onClick={() => setLanguage('en')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: language === 'en' ? 'var(--color-accent)' : 'rgba(255, 255, 255, 0.75)',
                  cursor: 'pointer',
                  padding: '0.25rem 0',
                  textAlign: 'left',
                  fontSize: '0.875rem',
                  transition: 'color var(--transition-snappy)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-accent)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = language === 'en' ? 'var(--color-accent)' : 'rgba(255, 255, 255, 0.75)')}
              >
                English
              </button>
              <button
                onClick={() => setLanguage('zh')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: language === 'zh' ? 'var(--color-accent)' : 'rgba(255, 255, 255, 0.75)',
                  cursor: 'pointer',
                  padding: '0.25rem 0',
                  textAlign: 'left',
                  fontSize: '0.875rem',
                  transition: 'color var(--transition-snappy)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-accent)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = language === 'zh' ? 'var(--color-accent)' : 'rgba(255, 255, 255, 0.75)')}
              >
                中文
              </button>
              <button
                onClick={() => setLanguage('ja')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: language === 'ja' ? 'var(--color-accent)' : 'rgba(255, 255, 255, 0.75)',
                  cursor: 'pointer',
                  padding: '0.25rem 0',
                  textAlign: 'left',
                  fontSize: '0.875rem',
                  transition: 'color var(--transition-snappy)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-accent)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = language === 'ja' ? 'var(--color-accent)' : 'rgba(255, 255, 255, 0.75)')}
              >
                日本語
              </button>
            </div>
          </div>

          <div>
            <h4
              style={{
                fontSize: '1rem',
                fontWeight: 600,
                marginBottom: '1rem',
                color: '#fff',
              }}
            >
              {t('footerDocs')}
            </h4>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}
            >
              <a
                href="https://github.com/MontaCoder/AI-Manga-Studio"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: 'rgba(255, 255, 255, 0.75)',
                  fontSize: '0.875rem',
                  transition: 'color var(--transition-snappy)',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-accent)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.75)')}
              >
                {t('footerGithub')}
              </a>
            </div>
          </div>
        </div>

        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.15)',
            paddingTop: '2rem',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <p
            style={{
              fontSize: '0.875rem',
              color: 'rgba(255, 255, 255, 0.65)',
            }}
          >
            {t('footerMadeWith')} ❤️ {t('footerMadeBy')} Montassar Hajri
          </p>
          <p
            style={{
              fontSize: '0.875rem',
              color: 'rgba(255, 255, 255, 0.65)',
            }}
          >
            {t('footerLicense')} © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
}

