/**
 * Eager, minimal drag boundary (Phase 4). When the flag is OFF (the production
 * default) it renders its children verbatim and the DragProvider chunk is never
 * imported — the index chunk is unchanged and the shell renders byte-identically
 * (selectors/aria stable). When ON it lazy-loads the real provider, wrapping the
 * whole shell so the Dock (drag source) and the SurfaceStage-hosted Scene grid
 * (drop target) share one drag context.
 */
import { Suspense, lazy, type ReactNode } from 'react';
import { isSceneDragEnabled } from './sceneDragFlag';

const DragProvider = lazy(() => import('./DragProvider'));

export function DragRoot({ children }: { children: ReactNode }) {
  if (!isSceneDragEnabled()) {
    return <>{children}</>;
  }
  return (
    <Suspense fallback={<>{children}</>}>
      <DragProvider>{children}</DragProvider>
    </Suspense>
  );
}
