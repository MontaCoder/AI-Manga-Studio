import React, { useEffect } from 'react';
import { Hero } from './landing/Hero';
import { Features } from './landing/Features';
import { HowItWorks } from './landing/HowItWorks';
import { Gallery } from './landing/Gallery';
import { FinalCTA } from './landing/FinalCTA';
import { Footer } from './landing/Footer';

export function LandingPage(): React.ReactElement {
  useEffect(() => {
    // Add animation classes when elements come into view
    const animationObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    // Observe all elements with animation classes
    const elementsToAnimate = document.querySelectorAll(
      '.features-header, .how-it-works-header, .gallery-header, .gallery-item, .final-cta-content'
    );

    elementsToAnimate.forEach((el) => {
      animationObserver.observe(el);
    });

    return () => {
      elementsToAnimate.forEach((el) => {
        animationObserver.unobserve(el);
      });
    };
  }, []);

  return (
    <div className="landing-page">
      <Hero />
      <Features />
      <HowItWorks />
      <Gallery />
      <FinalCTA />
      <Footer />
    </div>
  );
}

