import { useEffect, useState, type ReactNode } from 'react';
import { useAppNav } from '../hooks/useAppNav';
import type { Surface } from '../contexts/shell-context';

/**
 * Keepalive stage for the three shell surfaces (Phase 2, build-specs task 8).
 *
 * Generalizes Phase 1's SceneManager first-visit mechanism to Library, Sheet
 * and Scene: each surface mounts the first time it becomes active and is then
 * KEPT in the layout tree, hidden via visibility:hidden + an off-screen
 * transform — never display:none and never content-visibility:auto
 * (ui-shell-redesign final plan, Findings 7+14). The hidden subtree keeps its
 * layout so re-showing does not re-lay-out (the Scene grid especially), while
 * visibility:hidden drops it from the a11y tree and tab order; `absolute` +
 * the off-screen translate take it out of flow so surfaces never stack.
 *
 * The stage reads the active surface from ShellContext via useAppNav, so it
 * must render under a <ShellProvider>. Slots stay owner-rendered (App builds
 * the subtrees and threads its own state/handlers); the stage owns ONLY
 * mount-once bookkeeping and the hide mechanism.
 */

interface SurfaceStageProps {
  /** Library subtree — the boot landing, mounted from the first render. */
  library: ReactNode;
  /**
   * Sheet subtree, or null while no document is open. A null slot is
   * unmounted entirely (closeSheet/delete drop the sheet, matching the
   * Phase-1 conditional render); a non-null slot is a keepalive peer that
   * survives surface switches until the open document is cleared.
   */
  sheet: ReactNode | null;
  /** Scene subtree — lazy-mounts on first Scene visit, then keepalives. */
  scene: ReactNode;
}

/**
 * The Phase-1 hide mechanism, verbatim (was inline in App.tsx):
 * visibility:hidden + absolute + off-screen translate + pointer-events-none.
 */
const HIDDEN_SURFACE_CLASSES =
  'invisible absolute inset-x-0 top-0 -translate-x-[200vw] pointer-events-none';

const SURFACES: readonly Surface[] = ['library', 'sheet', 'scene'];

export function SurfaceStage({ library, sheet, scene }: SurfaceStageProps) {
  const { nav } = useAppNav();

  // A sheet surface with no open document renders the Library instead — the
  // same fallback the Phase-1 `isSheet && currentDoc` conditional produced.
  const activeSurface: Surface =
    nav.surface === 'sheet' && sheet === null ? 'library' : nav.surface;

  // First-visit bookkeeping: a surface joins the keepalive set the first time
  // it becomes active and never leaves it (the Sheet slot's null-ness, not
  // this set, decides whether an unmounted sheet can render).
  const [visited, setVisited] = useState<Record<Surface, boolean>>({
    library: true,
    sheet: false,
    scene: false,
  });
  useEffect(() => {
    setVisited((prev) => (prev[activeSurface] ? prev : { ...prev, [activeSurface]: true }));
  }, [activeSurface]);

  const slots: Record<Surface, ReactNode | null> = { library, sheet, scene };

  return (
    <div className="relative">
      {SURFACES.map((surface) => {
        const slot = slots[surface];
        // The active surface mounts synchronously (no one-frame gap on a
        // first visit); previously-visited surfaces stay mounted hidden.
        if (slot === null || (surface !== activeSurface && !visited[surface])) {
          return null;
        }
        const isActive = surface === activeSurface;
        return (
          <div
            key={surface}
            data-surface={surface}
            aria-hidden={!isActive}
            className={isActive ? undefined : HIDDEN_SURFACE_CLASSES}
          >
            {slot}
          </div>
        );
      })}
    </div>
  );
}
