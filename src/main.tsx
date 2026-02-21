import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { ErrorBoundary } from './components/ErrorBoundary'
import { reportWebVitals } from './utils/performanceMonitoring'
import { registerAllSystems } from './systems'
import './index.css'

// Initialize Game Systems
registerAllSystems();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)

reportWebVitals()
