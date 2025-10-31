import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { LandingPage } from './components/LandingPage';
import { Studio } from './components/Studio';

export default function App(): React.ReactElement {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/studio" element={<Studio />} />
    </Routes>
  );
}
