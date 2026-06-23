import '@testing-library/jest-dom';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { D20LegacySheet } from '../systems/d20-legacy/sheet';
import { Dnd35eEngine } from '../systems/dnd35e/engine';
import { createDefaultDnd35eData, type Dnd35eDataModel } from '../systems/dnd35e/data-model';
import { registerAllSystems } from '../systems';
import { systemRegistry } from '../registry';
import type { CharacterDocument, SystemDataModel } from '../types/core/document';

/**
 * Surfaced contribution ledger (chosen parity direction): the d20-legacy sheet
 * (3.5e/PF1e) now shows a total Armor Class breakdown built from the same ledger
 * primitive 5e uses, folding base + armor + shield + Dex + size to the AC the
 * sheet displays.
 */
describe('d20-legacy Armor Class contribution breakdown (sheet)', () => {
  beforeAll(() => {
    if (!systemRegistry.get('dnd-3.5e')) {
      registerAllSystems();
    }
  });

  it('reveals the armor, shield, and size terms behind total AC', async () => {
    const user = userEvent.setup();
    const prepared = new Dnd35eEngine().prepareData({
      id: 'c',
      name: 'Hero',
      systemId: 'dnd-3.5e',
      system: {
        ...createDefaultDnd35eData(),
        sizeCategory: 'small',
        baseAttributes: { str: 10, dex: 18, con: 10, int: 10, wis: 10, cha: 10 },
        equipment: [
          {
            itemId: 'breastplate',
            name: 'Breastplate',
            equipped: true,
            armorClass: 6,
            armorType: 'medium',
            dexBonusMax: 1,
          },
          { itemId: 'heavy-shield', name: 'Heavy Shield', equipped: true, shieldBonus: 2 },
        ],
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    } as CharacterDocument<Dnd35eDataModel>);

    render(
      <D20LegacySheet
        document={prepared as CharacterDocument<SystemDataModel>}
        onUpdate={vi.fn()}
      />
    );

    const toggle = await screen.findByRole('button', { name: /armor class/i });
    expect(toggle).toHaveTextContent(`(${prepared.system.armorClass.total})`);

    await user.click(toggle);
    const list = await screen.findByRole('list', { name: /armor class contributions/i });
    expect(within(list).getByText('Breastplate')).toBeInTheDocument();
    expect(within(list).getByText('Heavy Shield')).toBeInTheDocument();
    expect(within(list).getByText('Size modifier')).toBeInTheDocument();
  });
});
