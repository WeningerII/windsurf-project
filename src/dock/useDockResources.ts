import { useEffect, useRef, useState } from 'react';
import type { FeatDefinition } from '../types/character-options/feats';
import type { Monster } from '../types/creatures/monsters';
import type { Item } from '../types/equipment/items';
import type { GameSystemId } from '../types/game-systems';
import type { Spell } from '../types/magic/spells';
import type { Advantage } from '../types/mam/advantages';
import type { PowerModifier } from '../types/mam/powerModifiers';
import {
  loadAdvantagesForSystem,
  loadEquipmentForSystem,
  loadFeatsForSystem,
  loadMonstersForSystem,
  loadPowerModifiersForSystem,
  loadSpellsForSystem,
} from '../utils/dataLoader';

/**
 * Shared loader for the Dock's SRD catalogs (Phase 3), keyed by an
 * EXPLICIT active-system selector passed in — NOT read from any sheet
 * controller (the Dock is shared-layer and must not import `src/systems/**`).
 * It calls only the shared `dataLoader` loaders. The party tab is sourced from
 * the App `documents` prop and bypasses this loader entirely.
 *
 * A stale/slow response for a previously-selected system can never overwrite
 * the current one (ref-guarded, mirroring LibraryBestiaryView), and a loader
 * failure surfaces as an empty catalog rather than a crash.
 */
export interface DockResources {
  spells: Spell[];
  feats: FeatDefinition[];
  equipment: Item[];
  monsters: Monster[];
  /** Empty for every system but M&M — its tab hides rather than showing 0. */
  advantages: Advantage[];
  /** Likewise: M&M's power extras + flaws, empty elsewhere. */
  powerModifiers: PowerModifier[];
  loading: boolean;
}

const EMPTY: DockResources = {
  spells: [],
  feats: [],
  equipment: [],
  monsters: [],
  advantages: [],
  powerModifiers: [],
  loading: true,
};

export function useDockResources(systemId: GameSystemId): DockResources {
  const [state, setState] = useState<DockResources>(EMPTY);
  const activeSystemRef = useRef<GameSystemId>(systemId);

  useEffect(() => {
    let cancelled = false;
    const requestSystemId = systemId;
    activeSystemRef.current = requestSystemId;
    setState((prev) => ({ ...prev, loading: true }));

    void Promise.all([
      loadSpellsForSystem(requestSystemId),
      loadFeatsForSystem(requestSystemId),
      loadEquipmentForSystem(requestSystemId),
      loadMonstersForSystem(requestSystemId),
      loadAdvantagesForSystem(requestSystemId),
      loadPowerModifiersForSystem(requestSystemId),
    ])
      .then(([spells, feats, equipment, monsters, advantages, powerModifiers]) => {
        if (cancelled || activeSystemRef.current !== requestSystemId) {
          return;
        }
        setState({
          spells,
          feats,
          equipment,
          monsters,
          advantages,
          powerModifiers,
          loading: false,
        });
      })
      .catch(() => {
        if (cancelled || activeSystemRef.current !== requestSystemId) {
          return;
        }
        setState({
          spells: [],
          feats: [],
          equipment: [],
          monsters: [],
          advantages: [],
          powerModifiers: [],
          loading: false,
        });
      });

    return () => {
      cancelled = true;
    };
  }, [systemId]);

  return state;
}
