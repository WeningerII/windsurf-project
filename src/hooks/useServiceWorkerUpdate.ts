import { useCallback, useEffect, useState } from 'react';

/**
 * Owns the production service-worker lifecycle and surfaces a user-consent
 * driven update flow.
 *
 * Flow:
 *   1. On mount (PROD + window + SW-supported), register /service-worker.js.
 *   2. Watch for a new worker entering the `installed` state while an
 *      existing controller already controls the page — that pair of
 *      conditions is the canonical "update ready" signal.
 *   3. Expose `updateAvailable` so a banner can render, and `applyUpdate`
 *      which posts SKIP_WAITING to the waiting worker and reloads once it
 *      activates.
 *
 * In dev mode (or environments without SW support) the hook is a safe no-op:
 * `updateAvailable` stays `false` forever and `applyUpdate` does nothing.
 */
export interface ServiceWorkerUpdateState {
  updateAvailable: boolean;
  applyUpdate: () => void;
}

function isServiceWorkerSupported(): boolean {
  return typeof window !== 'undefined' && 'serviceWorker' in navigator;
}

export function useServiceWorkerUpdate(): ServiceWorkerUpdateState {
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    if (!import.meta.env.PROD || !isServiceWorkerSupported()) {
      return undefined;
    }

    let cancelled = false;

    const trackInstallingWorker = (sw: ServiceWorker) => {
      const handleStateChange = () => {
        if (sw.state === 'installed' && navigator.serviceWorker.controller) {
          // A controller already exists, so this is an update (not the
          // first-ever install).  Hold the waiting worker for the banner.
          if (!cancelled) {
            setWaitingWorker(sw);
          }
        }
      };
      sw.addEventListener('statechange', handleStateChange);
    };

    const handleRegistered = (reg: ServiceWorkerRegistration) => {
      if (cancelled) return;

      // A worker may already be waiting from a prior page load.
      if (reg.waiting && navigator.serviceWorker.controller) {
        setWaitingWorker(reg.waiting);
      }

      if (reg.installing) {
        trackInstallingWorker(reg.installing);
      }

      reg.addEventListener('updatefound', () => {
        if (reg.installing) {
          trackInstallingWorker(reg.installing);
        }
      });
    };

    const handleControllerChange = () => {
      // Fires once the waiting SW takes over.  Reload so the active page
      // runs against the fresh asset manifest.
      window.location.reload();
    };

    const register = () => {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then(handleRegistered)
        .catch(() => {
          // Registration failure is non-fatal; offline support is degraded
          // but the app still runs.
        });
    };

    navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);

    if (document.readyState === 'complete') {
      register();
    } else {
      window.addEventListener('load', register, { once: true });
    }

    return () => {
      cancelled = true;
      navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
    };
  }, []);

  const applyUpdate = useCallback(() => {
    if (!waitingWorker) return;
    // The `controllerchange` listener above handles the reload.  Sending
    // SKIP_WAITING promotes the waiting SW to active.
    waitingWorker.postMessage({ type: 'SKIP_WAITING' });
  }, [waitingWorker]);

  return {
    updateAvailable: waitingWorker !== null,
    applyUpdate,
  };
}
