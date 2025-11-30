import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { LocalizationProvider } from '@/contexts/LocalizationContext';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <LocalizationProvider>
          <App />
        </LocalizationProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);
