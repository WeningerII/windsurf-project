import { describe, expect, it } from 'vitest';
import { DOCK_TABS, type DockTabDescriptor, type DockTabKind } from '../dockRegistry';

describe('dockRegistry', () => {
  it('describes exactly the five typed dock tabs in order', () => {
    const kinds: DockTabKind[] = DOCK_TABS.map((tab: DockTabDescriptor) => tab.kind);
    expect(kinds).toEqual(['party', 'monster', 'spell', 'feat', 'equipment']);
  });

  it('marks party + monster as browse-only and spell/feat/equipment as click-add', () => {
    const addVerbByKind = Object.fromEntries(
      DOCK_TABS.map((tab) => [tab.kind, tab.addVerb])
    ) as Record<DockTabKind, boolean>;

    expect(addVerbByKind.party).toBe(false);
    expect(addVerbByKind.monster).toBe(false);
    expect(addVerbByKind.spell).toBe(true);
    expect(addVerbByKind.feat).toBe(true);
    expect(addVerbByKind.equipment).toBe(true);
  });

  it('gives each tab a stable id equal to its kind, a label, and an icon', () => {
    for (const tab of DOCK_TABS) {
      expect(tab.id).toBe(tab.kind);
      expect(tab.label.length).toBeGreaterThan(0);
      expect(tab.icon).toBeTypeOf('object');
    }
  });
});
