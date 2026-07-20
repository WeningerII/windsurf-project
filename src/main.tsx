import React from 'react';
import ReactDOM from 'react-dom/client';
import * as Sentry from '@sentry/browser';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AuthProvider } from './contexts/AuthContext';
import { registerAllSystems } from './systems';
import { init as initTelemetry, isTelemetryEnabled, track } from './telemetry';
import { initPerformanceMonitoring } from './utils/performanceMonitoring';
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

// Telemetry (Phase-5): privacy-respecting, OPT-IN, no-PII. Disabled by default —
// isTelemetryEnabled() is false until the user explicitly opts in, so this whole
// block is a no-op on a fresh install and NO events are collected. The default
// sink is a no-op and there is NO network sink yet (infra-blocked, see the seam
// in src/telemetry/sinks.ts), so even when enabled nothing leaves the browser.
// Swap in createConsoleSink() from './telemetry' for local debugging.
if (isTelemetryEnabled()) {
  initTelemetry();
  initPerformanceMonitoring();
  track('app.init', { devMode: import.meta.env.DEV });
}

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
