import {
  Backpack,
  BookOpen,
  Medal,
  Skull,
  Sparkles,
  SlidersHorizontal,
  Users,
  type LucideIcon,
} from 'lucide-react';

/**
 * The typed Dock tabs (Phase 3). `party` and `monster` are BROWSE-ONLY
 * (`addVerb: false`) — you do not add a character to a character, and the
 * monster drag-to-scene verb is deferred to Phase 4. The rest carry the
 * click-add verb (`addVerb: true`), dispatched into the active sheet via
 * SheetDispatchContext.
 *
 * `advantage` and `powerModifier` landed with §4.3, and they are the reason the
 * last four in-sheet browser wrappers could be deleted rather than ratified.
 * They are not duplicates of `feat`: `loadFeatsForSystem('mam3e')` returns `[]`,
 * so before these tabs existed the Dock had NO surface an M&M add verb could
 * route through, and the power-modifier catalog had no Dock tab at all. A tab
 * whose catalog is empty for the active system hides itself, so no other
 * system grows two dead tabs for M&M's sake.
 */
export type DockTabKind =
  | 'party'
  | 'monster'
  | 'spell'
  | 'feat'
  | 'equipment'
  | 'advantage'
  | 'powerModifier';

export interface DockTabDescriptor {
  kind: DockTabKind;
  id: DockTabKind;
  label: string;
  icon: LucideIcon;
  /** Whether the tab click-adds into the current sheet (false = browse-only). */
  addVerb: boolean;
}

export const DOCK_TABS: readonly DockTabDescriptor[] = [
  { kind: 'party', id: 'party', label: 'Party', icon: Users, addVerb: false },
  { kind: 'monster', id: 'monster', label: 'Bestiary', icon: Skull, addVerb: false },
  { kind: 'spell', id: 'spell', label: 'Spells', icon: BookOpen, addVerb: true },
  { kind: 'feat', id: 'feat', label: 'Feats', icon: Sparkles, addVerb: true },
  { kind: 'equipment', id: 'equipment', label: 'Equipment', icon: Backpack, addVerb: true },
  { kind: 'advantage', id: 'advantage', label: 'Advantages', icon: Medal, addVerb: true },
  {
    kind: 'powerModifier',
    id: 'powerModifier',
    label: 'Modifiers',
    icon: SlidersHorizontal,
    // Browse-only, like `party` and `monster`: no sheet in any system has a
    // handler that adds a power modifier to a character, and the wrapper this
    // replaces was browse-only for modifiers too.
    addVerb: false,
  },
];
