import { RefreshCw } from 'lucide-react';
import { Button } from './ui/Button';
import { useServiceWorkerUpdate } from '../hooks/useServiceWorkerUpdate';

/**
 * Fixed banner rendered when the service worker has a new version waiting.
 * Clicking "Reload" posts SKIP_WAITING to the waiting worker and the app
 * reloads as soon as it takes control.
 *
 * Renders nothing until the hook reports `updateAvailable`, so the banner
 * is invisible in dev and on first-ever installs.
 */
export function ServiceWorkerUpdateBanner() {
  const { updateAvailable, applyUpdate } = useServiceWorkerUpdate();

  if (!updateAvailable) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-700 bg-slate-900/95 p-4 text-sm text-slate-100 shadow-lg backdrop-blur"
    >
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <RefreshCw className="h-5 w-5 text-sky-400" aria-hidden="true" />
          <span>
            <strong className="font-semibold">A new version is available.</strong>{' '}
            Reload to pick up the latest changes.
          </span>
        </div>
        <Button size="sm" onClick={applyUpdate}>
          Reload
        </Button>
      </div>
    </div>
  );
}
