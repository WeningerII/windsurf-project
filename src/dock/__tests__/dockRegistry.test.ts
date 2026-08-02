import { describe, expect, it } from 'vitest';
import { DOCK_TABS, type DockTabDescriptor, type DockTabKind } from '../dockRegistry';

describe('dockRegistry', () => {
  it('describes exactly the seven typed dock tabs in order', () => {
    const kinds: DockTabKind[] = DOCK_TABS.map((tab: DockTabDescriptor) => tab.kind);
    expect(kinds).toEqual([
      'party',
      'monster',
      'spell',
      'feat',
      'equipment',
      'advantage',
      'powerModifier',
    ]);
  });

  it('marks browse-only tabs as browse-only and the rest as click-add', () => {
    const addVerbByKind = Object.fromEntries(
      DOCK_TABS.map((tab) => [tab.kind, tab.addVerb])
    ) as Record<DockTabKind, boolean>;

    expect(addVerbByKind.party).toBe(false);
    expect(addVerbByKind.monster).toBe(false);
    expect(addVerbByKind.spell).toBe(true);
    expect(addVerbByKind.feat).toBe(true);
    expect(addVerbByKind.equipment).toBe(true);
    expect(addVerbByKind.advantage).toBe(true);
    // Browse-only: no sheet in any system has an add-power-modifier handler,
    // and the wrapper this tab replaced was browse-only for modifiers too.
    expect(addVerbByKind.powerModifier).toBe(false);
  });

  it('gives each tab a stable id equal to its kind, a label, and an icon', () => {
    for (const tab of DOCK_TABS) {
      expect(tab.id).toBe(tab.kind);
      expect(tab.label.length).toBeGreaterThan(0);
      expect(tab.icon).toBeTypeOf('object');
    }
  });
});
