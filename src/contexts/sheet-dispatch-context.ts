import { createContext, useContext, useEffect } from 'react';
import type { FeatDefinition } from '../types/character-options/feats';
import type { Item } from '../types/equipment/items';
import type { Spell } from '../types/magic/spells';

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
 * — the same ones the per-system controller handlers already accept. */
export interface SheetAddHandlers {
  addSpell?: (spell: Spell) => void;
  addFeat?: (feat: FeatDefinition) => void;
  addEquipment?: (item: Item) => void;
}

/** The volatile half: which sheet currently publishes, and its handlers. */
export interface SheetDispatchState {
  /** The resolved id of the sheet currently publishing handlers, or null. */
  activeDocId: string | null;
  handlers: SheetAddHandlers;
}

/** The stable half: publish/clear entry points. Its identity never changes, so
 * a component that consumes only this (a registering sheet) never re-renders
 * when the volatile state changes. */
export interface SheetDispatchRegistry {
  register: (docId: string | null, handlers: SheetAddHandlers) => void;
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
export function useSheetDispatchRegister(docId: string | null, handlers: SheetAddHandlers): void {
  const registry = useContext(SheetDispatchRegistryContext);
  const register = registry?.register;
  const unregister = registry?.unregister;
  const { addSpell, addFeat, addEquipment } = handlers;

  useEffect(() => {
    if (!register || !unregister) {
      return;
    }
    register(docId, { addSpell, addFeat, addEquipment });
    return () => {
      if (docId) {
        unregister(docId);
      }
    };
  }, [register, unregister, docId, addSpell, addFeat, addEquipment]);
}

interface SheetDispatch {
  activeDocId: string | null;
  canAddSpell: boolean;
  canAddFeat: boolean;
  canAddEquipment: boolean;
  addSpell: (spell: Spell) => void;
  addFeat: (feat: FeatDefinition) => void;
  addEquipment: (item: Item) => void;
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

  return {
    activeDocId,
    canAddSpell,
    canAddFeat,
    canAddEquipment,
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
  };
}
