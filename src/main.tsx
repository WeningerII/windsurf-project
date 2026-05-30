import React from 'react';
import ReactDOM from 'react-dom/client';
import * as Sentry from '@sentry/browser';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AuthProvider } from './contexts/AuthContext';
import { registerAllSystems } from './systems';
import './index.css';

// Initialize Sentry (production error monitoring)
const sentryDsn = import.meta.env.VITE_SENTRY_DSN;
if (sentryDsn) {
  Sentry.init({
    dsn: sentryDsn,
    environment: import.meta.env.MODE,
    enabled: import.meta.env.PROD,
    // Keep IP addresses and other SDK-default PII out of events; the error
    // logger forwards only non-identifying metadata (see utils/errorLogger.ts).
    sendDefaultPii: false,
  });
}

// Initialize Game Systems
registerAllSystems();

// Service-worker registration is owned by `useServiceWorkerUpdate` so the
// client stays in sync with the app's update banner component.  See
// src/hooks/useServiceWorkerUpdate.ts.

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
