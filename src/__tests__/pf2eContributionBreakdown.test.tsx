import '@testing-library/jest-dom';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Pf2eCharacterSheet } from '../systems/pf2e/sheet';
import { Pf2eEngine } from '../systems/pf2e/engine';
import { createDefaultPf2eData, type Pf2eDataModel } from '../systems/pf2e/data-model';
import { registerAllSystems } from '../systems';
import { systemRegistry } from '../registry';
import type { CharacterDocument } from '../types/core/document';

/**
 * Surfaced contribution ledger (chosen parity direction): the PF2e sheet now
 * shows an Armor Class breakdown built from the same ledger primitive 5e uses,
 * folding base + armor + Dex + proficiency to the AC the sheet displays.
 */
describe('PF2e Armor Class contribution breakdown (sheet)', () => {
  beforeAll(() => {
    if (!systemRegistry.get('pf2e')) {
      registerAllSystems();
    }
  });

  it('reveals the armor and proficiency behind AC', async () => {
    const user = userEvent.setup();
    const prepared = new Pf2eEngine().prepareData({
      id: 'c',
      name: 'Hero',
      systemId: 'pf2e',
      system: {
        ...createDefaultPf2eData(),
        level: 3,
        baseAttributes: { str: 10, dex: 14, con: 10, int: 10, wis: 10, cha: 10 },
        armorProficiencies: {
          unarmored: { tier: 'trained', total: 0 },
          light: { tier: 'trained', total: 0 },
          medium: { tier: 'trained', total: 0 },
          heavy: { tier: 'untrained', total: 0 },
        },
        equipment: [
          {
            itemId: 'leather',
            name: 'Leather Armor',
            bulk: 1,
            equipped: true,
            armorClass: 1,
            armorType: 'light',
            dexBonusMax: 4,
          },
        ],
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    } as CharacterDocument<Pf2eDataModel>);

    render(<Pf2eCharacterSheet document={prepared} onUpdate={vi.fn()} />);

    const toggle = await screen.findByRole('button', { name: /armor class/i });
    expect(toggle).toHaveTextContent(`(${prepared.system.armorClass})`);

    await user.click(toggle);
    const list = await screen.findByRole('list', { name: /armor class contributions/i });
    expect(within(list).getByText('Leather Armor')).toBeInTheDocument();
    expect(within(list).getByText('Light proficiency')).toBeInTheDocument();
  });
});
