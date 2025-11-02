import React from 'react';
import { Header } from '@/components/layout/Header';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { HowItWorks } from './components/HowItWorks';
import { Gallery } from './components/Gallery';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';
import { useLocalization } from '@/hooks/useLocalization';

export function LandingPage(): React.ReactElement {
  const { language, setLanguage } = useLocalization();

  return (
    <div className="landing-page">
      <Header
        variant="marketing"
        isTransparentOnTop={true}
        language={language}
        setLanguage={setLanguage}
      />
      <Hero />
      <Features />
      <HowItWorks />
      <Gallery />
      <FinalCTA />
      <Footer />
    </div>
  );
}

