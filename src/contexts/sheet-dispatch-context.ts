import { createContext, useContext, useEffect } from 'react';
import type { FeatDefinition } from '../types/character-options/feats';
import type { Item } from '../types/equipment/items';
import type { Spell } from '../types/magic/spells';
import type { Advantage } from '../types/mam/advantages';

/**
 * Inverted-control registry for the shared Dock (Phase 3).
 *
 * The shared Dock (a shared-layer component) must be able to click-add a
 * spell / feat / equipment item into the CURRENTLY OPEN character sheet — but
 * the shared layer must never value-import from `src/systems/**` (the
 * lint-enforced layer boundary). So control is inverted: the active per-system
 * sheet PUBLISHES its existing add-handlers UP into this registry (via
 * `useSheetDispatchRegister`) together with the resolved active-document id,
 * and the Dock READS them DOWN (via `useSheetDispatch`). The Dock depends only
 * on shared domain types (`Spell` / `FeatDefinition` / `Item`), never on any
 * system module.
 *
 * Dispatch is hard-gated on a RESOLVED active-document id: with no sheet open
 * (or a sheet that published no handler) `canAdd*` is false and the add verb
 * is a no-op, so the Dock can never silently target a stale/last-mounted
 * controller.
 *
 * ## Two split contexts (Phase 5)
 * The registry is split into a STABLE half and a CHANGING half so a registering
 * sheet never re-renders as a side effect of its own registration:
 *   - `SheetDispatchRegistryContext` holds `{register, unregister}` — a
 *     referentially-stable object that NEVER changes identity. A sheet consumes
 *     only this (via `useSheetDispatchRegister`), so a `register()` call —
 *     which setStates the provider — does not re-render the sheet. This makes
 *     the register → setState → re-render → register loop structurally
 *     impossible, independent of whether a sheet perfectly memoizes its
 *     handlers (Phase 5 wired five systems, and not every controller-derived
 *     handler dependency is guaranteed stable — one unstable dep must not hang
 *     the app).
 *   - `SheetDispatchStateContext` holds `{activeDocId, handlers}` — the volatile
 *     half. Only the Dock consumes it (via `useSheetDispatch`), so registry
 *     churn re-renders the (cheap) Dock, never the sheets.
 *
 * No JSX lives in this file (the provider component is in
 * `SheetDispatchContext.tsx`) so the react-refresh only-export-components lint
 * stays green — mirroring the `auth-context.ts` / `AuthContext.tsx` split.
 */

/** The add-handlers a sheet publishes up. Each is optional (a read-only or
 * non-editable sheet may publish none). Payload types are shared domain types
 * — the same ones the per-system controller handlers already accept.
 *
 * `addAdvantage` was added when the four kept in-sheet browser wrappers were
 * retired (`WORK_PLAN` §4.3). It is M&M-shaped in practice but not in TYPE:
 * `Advantage` lives in `src/types/mam/**`, the shared type layer, so the Dock
 * still imports no system module. A system with no such concept publishes none.
 *
 * There is deliberately NO `addPowerModifier`. The Dock has a Modifiers tab, but
 * no sheet in any system has a handler that adds a power modifier to a
 * character — the retired `MamPowerBrowserTab` was browse-only for modifiers
 * too. Declaring the channel anyway would put a door on this registry that
 * nothing walks through, which is the same defect as a dead allowlist string. */
export interface SheetAddHandlers {
  addSpell?: (spell: Spell) => void;
  addFeat?: (feat: FeatDefinition) => void;
  addEquipment?: (item: Item) => void;
  addAdvantage?: (advantage: Advantage) => void;
}

/**
 * A catalog narrowing the ACTIVE SHEET publishes for the Dock to apply
 * (`WORK_PLAN` §4.3).
 *
 * This exists because the Dock's spell tab showed the whole system catalog and
 * could not do otherwise: it is shared-layer, so it cannot see the open
 * character's class list, and a PF2e or d20 caster browsing every spell in the
 * game was the one capability the in-sheet `Pf2eSpellBrowserPanel` /
 * `D20SpellBrowserPanel` wrappers still had over it.
 *
 * The narrowing is a PREDICATE, not a descriptor, and that is deliberate. A
 * predicate is a runtime value the sheet hands over — no static import crosses
 * the layer boundary, and the Dock never has to learn what a "tradition" or a
 * "spell list" is in order to honour one. `label` is what the Dock shows so the
 * user can see the list is filtered and turn it off.
 */
export interface SheetCatalogFilter {
  /** Shown on the Dock's filter chip, e.g. "Wizard spells". */
  label: string;
  spell?: (spell: Spell) => boolean;
  feat?: (feat: FeatDefinition) => boolean;
  equipment?: (item: Item) => boolean;
}

/** The volatile half: which sheet currently publishes, and its handlers. */
export interface SheetDispatchState {
  /** The resolved id of the sheet currently publishing handlers, or null. */
  activeDocId: string | null;
  handlers: SheetAddHandlers;
  /** The active sheet's catalog narrowing, when it published one. */
  catalogFilter?: SheetCatalogFilter;
}

/** The stable half: publish/clear entry points. Its identity never changes, so
 * a component that consumes only this (a registering sheet) never re-renders
 * when the volatile state changes. */
export interface SheetDispatchRegistry {
  register: (
    docId: string | null,
    handlers: SheetAddHandlers,
    catalogFilter?: SheetCatalogFilter
  ) => void;
  unregister: (docId: string) => void;
}

/** Both null outside a provider so a sheet mounted standalone (unit tests, the
 * Library card previews) registers into a harmless no-op rather than throwing. */
export const SheetDispatchStateContext = createContext<SheetDispatchState | null>(null);
export const SheetDispatchRegistryContext = createContext<SheetDispatchRegistry | null>(null);

/**
 * Publish the active sheet's add-handlers + resolved doc id UP into the
 * registry. Pass `docId: null` to publish nothing (e.g. a read-only sheet with
 * no `onUpdate`). Re-registers whenever the id or any handler identity changes,
 * and clears its own entry on unmount. A no-op when rendered without a provider.
 *
 * Consumes only the STABLE registry context, so this hook never causes its host
 * sheet to re-render in response to registry state changes.
 */
export function useSheetDispatchRegister(
  docId: string | null,
  handlers: SheetAddHandlers,
  catalogFilter?: SheetCatalogFilter
): void {
  const registry = useContext(SheetDispatchRegistryContext);
  const register = registry?.register;
  const unregister = registry?.unregister;
  const { addSpell, addFeat, addEquipment, addAdvantage } = handlers;

  useEffect(() => {
    if (!register || !unregister) {
      return;
    }
    register(docId, { addSpell, addFeat, addEquipment, addAdvantage }, catalogFilter);
    return () => {
      if (docId) {
        unregister(docId);
      }
    };
  }, [register, unregister, docId, addSpell, addFeat, addEquipment, addAdvantage, catalogFilter]);
}

interface SheetDispatch {
  activeDocId: string | null;
  canAddSpell: boolean;
  canAddFeat: boolean;
  canAddEquipment: boolean;
  canAddAdvantage: boolean;
  addSpell: (spell: Spell) => void;
  addFeat: (feat: FeatDefinition) => void;
  addEquipment: (item: Item) => void;
  addAdvantage: (advantage: Advantage) => void;
  /**
   * The active sheet's catalog narrowing, gated on a resolved doc id exactly as
   * the add verbs are — a filter left behind by a closed sheet must never keep
   * narrowing the Dock's catalog for whatever opens next.
   */
  catalogFilter?: SheetCatalogFilter;
}

/**
 * Read the published handlers DOWN, each gated on a resolved active-document
 * id. `canAdd*` is the Dock's disabled/enabled signal; the `add*` verbs are
 * no-ops whenever their gate is false, so the Dock never targets a stale
 * controller.
 */
export function useSheetDispatch(): SheetDispatch {
  const state = useContext(SheetDispatchStateContext);
  const activeDocId = state?.activeDocId ?? null;
  const handlers = state?.handlers ?? {};
  const canAddSpell = Boolean(activeDocId && handlers.addSpell);
  const canAddFeat = Boolean(activeDocId && handlers.addFeat);
  const canAddEquipment = Boolean(activeDocId && handlers.addEquipment);
  const canAddAdvantage = Boolean(activeDocId && handlers.addAdvantage);

  return {
    activeDocId,
    canAddSpell,
    canAddFeat,
    canAddEquipment,
    canAddAdvantage,
    addSpell: (spell) => {
      if (canAddSpell) {
        handlers.addSpell?.(spell);
      }
    },
    addFeat: (feat) => {
      if (canAddFeat) {
        handlers.addFeat?.(feat);
      }
    },
    addEquipment: (item) => {
      if (canAddEquipment) {
        handlers.addEquipment?.(item);
      }
    },
    addAdvantage: (advantage) => {
      if (canAddAdvantage) {
        handlers.addAdvantage?.(advantage);
      }
    },
    ...(activeDocId && state?.catalogFilter ? { catalogFilter: state.catalogFilter } : {}),
  };
}
