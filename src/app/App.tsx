import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { LandingPage } from '@/pages/landing/LandingPage';
import { Studio } from '@/pages/studio/Studio';

export default function App(): React.ReactElement {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/studio" element={<Studio />} />
    </Routes>
  );
}
