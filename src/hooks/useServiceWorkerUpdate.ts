import { useCallback, useEffect, useRef, useState } from 'react';

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
  // Tracks whether the user has clicked "Refresh" in the update banner.
  //
  // `controllerchange` fires in TWO distinct scenarios:
  //   (a) first-ever SW install on this origin — the SW activates and
  //       calls `clients.claim()`, which promotes our page from "no
  //       controller" to "controlled".
  //   (b) user-consented update — we post SKIP_WAITING, the waiting SW
  //       activates, and takes over from the previous controller.
  //
  // Only (b) should reload the page.  Reloading on (a) aborts whatever
  // navigation the user (or a test) just initiated and yields
  // `net::ERR_ABORTED` the first time the app is ever visited.  Gate the
  // reload behind this ref, which is flipped only by `applyUpdate`.
  const userInitiatedUpdateRef = useRef(false);

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
      // Only reload on user-consented updates.  First-install
      // controllerchange (clients.claim promoting the page) is ignored
      // because reloading there would abort the current navigation for
      // zero user benefit — the page was just loaded.
      if (!userInitiatedUpdateRef.current) {
        return;
      }
      userInitiatedUpdateRef.current = false;
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
    // Mark the upcoming controllerchange as user-initiated so the
    // listener actually reloads.  SKIP_WAITING promotes the waiting SW
    // to active, which fires controllerchange.
    userInitiatedUpdateRef.current = true;
    waitingWorker.postMessage({ type: 'SKIP_WAITING' });
  }, [waitingWorker]);

  return {
    updateAvailable: waitingWorker !== null,
    applyUpdate,
  };
}
