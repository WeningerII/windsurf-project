import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import type { ReactElement } from 'react';
import type { CharacterDocument, SystemDataModel } from '../../types/core/document';
import type { Spell } from '../../types/magic/spells';
import type { Item } from '../../types/equipment/items';
import { registerAllSystems } from '../../systems';
import { systemRegistry } from '../../registry';
import { SheetDispatchProvider } from '../../contexts/SheetDispatchContext';
import { useSheetDispatch } from '../../contexts/sheet-dispatch-context';
import { Dnd5eSheet } from '../../systems/dnd5e/components/Dnd5eSheet';
import { createDefaultDnd5eData } from '../../systems/dnd5e/data-model';
import { Dnd5e2024Sheet } from '../../systems/dnd5e-2024/components/Dnd5e2024Sheet';
import { createDefaultDnd5e2024Data } from '../../systems/dnd5e-2024/data-model';
import { D20LegacySheet } from '../../systems/d20-legacy/sheet';
import { createDefaultDnd35eData } from '../../systems/dnd35e/data-model';
import { createDefaultPf1eData } from '../../systems/pf1e/data-model';
import { Pf2eCharacterSheet } from '../../systems/pf2e/sheet';
import { createDefaultPf2eData } from '../../systems/pf2e/data-model';
import { Mam3eCharacterSheet } from '../../systems/mam3e/sheet';
import { createDefaultMam3eData } from '../../systems/mam3e/data-model';
import { DaggerheartSheet } from '../../systems/daggerheart/sheet';
import { createDefaultDaggerheartData } from '../../systems/daggerheart/data-model';

// Phase-5 parity: every per-system sheet must PUBLISH its existing add-handlers
// up into the shared Dock's dispatch registry (or, for a system with no
// dock-addable concept, publish nothing so the Dock's verb correctly disables).
// This test mounts each system's real sheet next to a dispatch probe and
// asserts the resolved capability matrix, then proves the wired systems mutate
// their document when the Dock dispatches into them.

const SPELL = { id: 'test-spell', name: 'Test Spell', level: 1 } as unknown as Spell;
const ITEM = { id: 'test-item', name: 'Test Item', weight: 1 } as unknown as Item;

function DispatchProbe() {
  const dispatch = useSheetDispatch();
  return (
    <div>
      <span data-testid="canSpell">{String(dispatch.canAddSpell)}</span>
      <span data-testid="canFeat">{String(dispatch.canAddFeat)}</span>
      <span data-testid="canEquip">{String(dispatch.canAddEquipment)}</span>
      <span data-testid="activeDoc">{dispatch.activeDocId ?? 'none'}</span>
      <button type="button" onClick={() => dispatch.addSpell(SPELL)}>
        add-spell
      </button>
      <button type="button" onClick={() => dispatch.addEquipment(ITEM)}>
        add-equip
      </button>
    </div>
  );
}

function makeDoc(systemId: string, system: SystemDataModel): CharacterDocument<SystemDataModel> {
  return {
    id: `${systemId}-doc`,
    name: 'Parity Hero',
    systemId,
    system,
    createdAt: new Date('2026-02-24T00:00:00.000Z'),
    updatedAt: new Date('2026-02-24T00:00:00.000Z'),
  };
}

// A minimal PF2e spellcaster so PF2e's `addSpell` (gated on `spellcasting`) is
// publishable — mirrors the seed shape used in SystemSheets.test.
const pf2eCasterData = () => ({
  ...createDefaultPf2eData(),
  classId: 'wizard',
  spellcasting: {
    tradition: 'arcane' as const,
    type: 'prepared' as const,
    proficiency: { tier: 'trained' as const, total: 3 },
    spellSlots: { 1: { max: 2, used: 0 } },
    spellsKnown: [],
    preparedSpellsByRank: {},
    focusPoints: { current: 1, max: 1 },
  },
});

interface ParityCase {
  name: string;
  systemId: string;
  data: SystemDataModel;
  render: (doc: CharacterDocument<SystemDataModel>, onUpdate: () => void) => ReactElement;
  canSpell: boolean;
  canFeat: boolean;
  canEquip: boolean;
}

const CASES: ParityCase[] = [
  {
    name: 'dnd5e',
    systemId: 'dnd-5e-2014',
    data: createDefaultDnd5eData() as unknown as SystemDataModel,
    render: (doc, onUpdate) => <Dnd5eSheet document={doc as never} onUpdate={onUpdate} />,
    // 5e publishes addSpell/addFeat/addEquipment unconditionally (gated only on
    // onUpdate — the spell-learn handler exists regardless of the current doc's
    // spellcasting block), so all three verbs are enabled.
    canSpell: true,
    canFeat: true,
    canEquip: true,
  },
  {
    name: 'dnd5e-2024',
    systemId: 'dnd-5e-2024',
    data: createDefaultDnd5e2024Data() as unknown as SystemDataModel,
    render: (doc, onUpdate) => <Dnd5e2024Sheet document={doc as never} onUpdate={onUpdate} />,
    canSpell: true,
    canFeat: true,
    canEquip: true,
  },
  {
    name: 'dnd35e',
    systemId: 'dnd-3.5e',
    data: createDefaultDnd35eData() as unknown as SystemDataModel,
    render: (doc, onUpdate) => <D20LegacySheet document={doc} onUpdate={onUpdate} />,
    canSpell: true,
    canFeat: false, // no add-feat-by-definition handler in the d20-legacy family
    canEquip: true,
  },
  {
    name: 'pf1e',
    systemId: 'pf1e',
    data: createDefaultPf1eData() as unknown as SystemDataModel,
    render: (doc, onUpdate) => <D20LegacySheet document={doc} onUpdate={onUpdate} />,
    canSpell: true,
    canFeat: false,
    canEquip: true,
  },
  {
    name: 'pf2e',
    systemId: 'pf2e',
    data: pf2eCasterData() as unknown as SystemDataModel,
    render: (doc, onUpdate) => <Pf2eCharacterSheet document={doc as never} onUpdate={onUpdate} />,
    canSpell: true,
    canFeat: false, // pf2e feats are template/class-granted, no add-by-definition handler
    canEquip: true,
  },
  {
    name: 'mam3e',
    systemId: 'mam3e',
    data: createDefaultMam3eData() as unknown as SystemDataModel,
    render: (doc, onUpdate) => <Mam3eCharacterSheet document={doc as never} onUpdate={onUpdate} />,
    // Superhero system: powers/advantages, not spells/feats; its equipment
    // browser is browse-only with no add handler. Nothing publishable.
    canSpell: false,
    canFeat: false,
    canEquip: false,
  },
  {
    name: 'daggerheart',
    systemId: 'daggerheart',
    data: createDefaultDaggerheartData() as unknown as SystemDataModel,
    render: (doc, onUpdate) => <DaggerheartSheet document={doc as never} onUpdate={onUpdate} />,
    // Bespoke domain-card / weapon / inventory-definition model — no shared
    // Spell/Feat/Item add handler to publish.
    canSpell: false,
    canFeat: false,
    canEquip: false,
  },
];

describe('Dock <-> sheet dispatch parity (Phase 5)', () => {
  beforeAll(() => {
    if (!systemRegistry.get('dnd-5e-2024')) {
      registerAllSystems();
    }
  });

  it.each(CASES)(
    '$name publishes exactly its available add-handlers to the Dock',
    async ({ systemId, data, render: renderSheet, canSpell, canFeat, canEquip }) => {
      const doc = makeDoc(systemId, data);
      render(
        <SheetDispatchProvider>
          {renderSheet(doc, vi.fn())}
          <DispatchProbe />
        </SheetDispatchProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('canSpell').textContent).toBe(String(canSpell));
      });
      expect(screen.getByTestId('canFeat').textContent).toBe(String(canFeat));
      expect(screen.getByTestId('canEquip').textContent).toBe(String(canEquip));

      const publishesAnything = canSpell || canFeat || canEquip;
      expect(screen.getByTestId('activeDoc').textContent).toBe(publishesAnything ? doc.id : 'none');
    }
  );

  it.each(CASES.filter((entry) => entry.canEquip))(
    '$name adds a Dock-dispatched equipment item to the open sheet',
    async ({ systemId, data, render: renderSheet }) => {
      const user = userEvent.setup();
      const onUpdate = vi.fn();
      const doc = makeDoc(systemId, data);
      render(
        <SheetDispatchProvider>
          {renderSheet(doc, onUpdate)}
          <DispatchProbe />
        </SheetDispatchProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('canEquip').textContent).toBe('true');
      });

      await user.click(screen.getByRole('button', { name: 'add-equip' }));

      await waitFor(() => {
        expect(onUpdate).toHaveBeenCalled();
      });
      const updated = onUpdate.mock.calls.at(-1)?.[0] as CharacterDocument<
        SystemDataModel & { inventory: Array<{ itemId: string }> }
      >;
      expect(updated.system.inventory.some((entry) => entry.itemId === ITEM.id)).toBe(true);
    }
  );

  it('learns a Dock-dispatched spell into a PF2e spellcaster (spellsKnown)', async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn();
    const doc = makeDoc('pf2e', pf2eCasterData() as unknown as SystemDataModel);
    render(
      <SheetDispatchProvider>
        <Pf2eCharacterSheet document={doc as never} onUpdate={onUpdate} />
        <DispatchProbe />
      </SheetDispatchProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('canSpell').textContent).toBe('true');
    });

    await user.click(screen.getByRole('button', { name: 'add-spell' }));

    await waitFor(() => {
      expect(onUpdate).toHaveBeenCalled();
    });
    const updated = onUpdate.mock.calls.at(-1)?.[0] as CharacterDocument<
      ReturnType<typeof createDefaultPf2eData>
    >;
    expect(updated.system.spellcasting?.spellsKnown).toEqual([SPELL.id]);
  });

  it('learns a Dock-dispatched spell into a 3.5e sheet (spellsKnown)', async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn();
    const doc = makeDoc('dnd-3.5e', createDefaultDnd35eData() as unknown as SystemDataModel);
    render(
      <SheetDispatchProvider>
        <D20LegacySheet document={doc} onUpdate={onUpdate} />
        <DispatchProbe />
      </SheetDispatchProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('canSpell').textContent).toBe('true');
    });

    await user.click(screen.getByRole('button', { name: 'add-spell' }));

    await waitFor(() => {
      expect(onUpdate).toHaveBeenCalled();
    });
    const updated = onUpdate.mock.calls.at(-1)?.[0] as CharacterDocument<
      { spellsKnown: string[] } & SystemDataModel
    >;
    expect(updated.system.spellsKnown).toContain(SPELL.id);
  });
});
