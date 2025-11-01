import React from 'react';
import { Header } from './Header';
import { Hero } from './landing/Hero';
import { Features } from './landing/Features';
import { HowItWorks } from './landing/HowItWorks';
import { Gallery } from './landing/Gallery';
import { FinalCTA } from './landing/FinalCTA';
import { Footer } from './landing/Footer';
import { useLocalization } from '../hooks/useLocalization';

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

