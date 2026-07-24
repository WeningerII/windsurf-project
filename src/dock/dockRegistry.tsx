import { Backpack, BookOpen, Skull, Sparkles, Users, type LucideIcon } from 'lucide-react';

/**
 * The five typed Dock tabs (Phase 3). `party` and `monster` are BROWSE-ONLY in
 * Phase 3 (`addVerb: false`) — you do not add a character to a character, and
 * the monster drag-to-scene verb is deferred to Phase 4. `spell` / `feat` /
 * `equipment` carry the click-add verb (`addVerb: true`), dispatched into the
 * active sheet via SheetDispatchContext.
 */
export type DockTabKind = 'party' | 'monster' | 'spell' | 'feat' | 'equipment';

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
];
