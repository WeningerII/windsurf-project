// purpose: Bestiary library segment — a read-only, browsable monster catalog
// (RFC-004). Owns a system selector across every monster-bearing system and
// renders the shared MonsterBrowser over whatever the loader returns. It never
// mutates, builds, or licenses content: the loader applies the open-content
// policy at load time, so this view renders exactly what it receives — and an
// empty array is the correct, expected result for a system whose monster data
// has not shipped yet.
import { Suspense, useEffect, useMemo, useRef, useState, type ComponentType } from 'react';
import { Skull } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { systemRegistry } from '../registry';
import { KNOWN_SYSTEM_IDS } from '../utils/systemCatalogMetadata';
import { loadMonstersForSystem } from '../utils/dataLoader';
import { lazyWithPreload } from '../utils/lazyWithPreload';
import type { GameSystemId } from '../types/game-systems';
import type { Monster } from '../types/creatures/monsters';

type MonsterBrowserProps = {
  monsters: Monster[];
  onSelectMonster?: (monster: Monster) => void;
};

// Lazy-load the (comparatively heavy) browser body the same way the 5e sheet
// tab does, so the Bestiary route only pulls it in when actually opened.
const MonsterBrowser = lazyWithPreload<MonsterBrowserProps>(async () => {
  const module = await import('./MonsterBrowser');
  return {
    default: module.MonsterBrowser as ComponentType<MonsterBrowserProps>,
  };
});

type LoadState = { status: 'loading' } | { status: 'ready'; monsters: Monster[] };

/**
 * Human label for a system id. The registry is the source of truth once the app
 * has bootstrapped; the raw id is a safe fallback so the selector still renders
 * agnostically even before/without registration (e.g. isolated tests).
 */
function systemLabel(systemId: GameSystemId): string {
  return systemRegistry.get(systemId)?.label ?? systemId;
}

export function LibraryBestiaryView() {
  // Every monster-bearing system is a peer — the selector list is derived from
  // the canonical GameSystemId set, with no system privileged as "primary".
  const systemIds = useMemo(() => KNOWN_SYSTEM_IDS, []);
  const [selectedSystem, setSelectedSystem] = useState<GameSystemId>(() => systemIds[0]);
  const [state, setState] = useState<LoadState>({ status: 'loading' });

  // Mirrors the sheet-resource loaders: a ref tracks the in-flight request so a
  // stale/slow response for a previously-selected system can never overwrite the
  // current one, and a teardown flag guards against setState-after-unmount.
  const activeSystemRef = useRef<GameSystemId>(selectedSystem);

  useEffect(() => {
    let cancelled = false;
    const requestSystemId = selectedSystem;
    activeSystemRef.current = requestSystemId;
    setState({ status: 'loading' });

    void loadMonstersForSystem(requestSystemId)
      .then((loaded) => {
        if (cancelled || activeSystemRef.current !== requestSystemId) {
          return;
        }
        setState({ status: 'ready', monsters: loaded });
      })
      .catch(() => {
        if (cancelled || activeSystemRef.current !== requestSystemId) {
          return;
        }
        // A loader failure is surfaced as an empty catalog rather than a crash,
        // matching loadMonstersForSystem's own contract for absent data.
        setState({ status: 'ready', monsters: [] });
      });

    return () => {
      cancelled = true;
    };
  }, [selectedSystem]);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle className="text-xl flex items-center gap-2">
            <Skull className="w-5 h-5" />
            Bestiary
          </CardTitle>
          <div className="flex items-center gap-2">
            <label htmlFor="bestiary-system" className="text-sm text-muted-foreground">
              System
            </label>
            <select
              id="bestiary-system"
              value={selectedSystem}
              onChange={(e) => setSelectedSystem(e.target.value as GameSystemId)}
              className="px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Select game system"
            >
              {systemIds.map((systemId) => (
                <option key={systemId} value={systemId}>
                  {systemLabel(systemId)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {state.status === 'loading' ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            Loading monster catalog...
          </div>
        ) : state.monsters.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            <Skull className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No monster dataset is currently available for {systemLabel(selectedSystem)}.</p>
          </div>
        ) : (
          <Suspense
            fallback={
              <div className="py-8 text-center text-sm text-muted-foreground">
                Loading monster browser...
              </div>
            }
          >
            <MonsterBrowser monsters={state.monsters} />
          </Suspense>
        )}
      </CardContent>
    </Card>
  );
}
