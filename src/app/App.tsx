import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

const LandingPage = lazy(() => import('@/pages/landing/LandingPage').then(module => ({ default: module.LandingPage })));
const Studio = lazy(() => import('@/pages/studio/Studio').then(module => ({ default: module.Studio })));

export default function App(): React.ReactElement {
  return (
    <Suspense fallback={<div className="layout-shell" aria-busy="true" />}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/studio" element={<Studio />} />
      </Routes>
    </Suspense>
  );
}
