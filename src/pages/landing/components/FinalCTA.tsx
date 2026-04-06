import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowIcon } from '@/components/icons/icons';
import { useLocalization } from '@/hooks/useLocalization';

export function FinalCTA(): React.ReactElement {
  const { t } = useLocalization();
  const navigate = useNavigate();

  return (
    <section className="section final-cta">
      <div className="container">
        <div className="final-cta__panel">
          <div className="final-cta__copy">
            <span className="heading-eyebrow">{t('AIMangaStudio')}</span>
            <h2 className="heading-xl">{t('finalCtaTitle')}</h2>
            <p className="text-lead">{t('finalCtaSubtitle')}</p>
          </div>

          <div className="final-cta__actions">
            <button onClick={() => navigate('/studio')} className="button-primary button-lg">
              <span>{t('startCreating')}</span>
              <ArrowIcon className="w-5 h-5" />
            </button>
            <button onClick={() => document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' })} className="button-secondary button-lg">
              {t('galleryTitle')}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
