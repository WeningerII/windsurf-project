import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { Dock } from '../Dock';
import * as dataLoader from '../../utils/dataLoader';
import type { CharacterDocument } from '../../types/core/document';
import type { Item } from '../../types/equipment/items';

// The four SRD tabs are browse-only in this structural test (party is the
// default active tab), but useDockResources still fires the loaders — stub them
// so the panel mounts without touching real SRD data chunks.
vi.mock('../../utils/dataLoader', () => ({
  loadSpellsForSystem: vi.fn(() => Promise.resolve([])),
  loadFeatsForSystem: vi.fn(() => Promise.resolve([])),
  loadEquipmentForSystem: vi.fn(() => Promise.resolve([])),
  loadMonstersForSystem: vi.fn(() => Promise.resolve([])),
}));

function makeDoc(id: string, name: string): CharacterDocument {
  return {
    id,
    name,
    systemId: 'dnd-5e-2014',
    system: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as unknown as CharacterDocument;
}

describe('Dock', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // clearAllMocks keeps implementations, so per-test mockResolvedValue calls
    // would leak into later tests without this reset to the empty default.
    vi.mocked(dataLoader.loadSpellsForSystem).mockResolvedValue([]);
    vi.mocked(dataLoader.loadFeatsForSystem).mockResolvedValue([]);
    vi.mocked(dataLoader.loadEquipmentForSystem).mockResolvedValue([]);
    vi.mocked(dataLoader.loadMonstersForSystem).mockResolvedValue([]);
  });

  it('is collapsed to a summon control by default, with no dock tabs shown', () => {
    render(<Dock documents={[]} />);
    expect(screen.getByRole('button', { name: /toggle toolkit dock/i })).toBeInTheDocument();
    expect(screen.queryByRole('tab')).not.toBeInTheDocument();
  });

  it('summons a panel with exactly the five typed tabs', async () => {
    const user = userEvent.setup();
    render(<Dock documents={[makeDoc('a', 'Aragorn')]} />);

    await user.click(screen.getByRole('button', { name: /toggle toolkit dock/i }));

    expect(screen.getByRole('tab', { name: /party/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /bestiary/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /spells/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /feats/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /equipment/i })).toBeInTheDocument();
    expect(screen.getAllByRole('tab')).toHaveLength(5);
  });

  it('shows the party roster (default tab) and an explicit system selector', async () => {
    const user = userEvent.setup();
    render(<Dock documents={[makeDoc('a', 'Aragorn')]} />);

    await user.click(screen.getByRole('button', { name: /toggle toolkit dock/i }));

    expect(screen.getByText('Aragorn')).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /select game system/i })).toBeInTheDocument();
  });

  it('can be dismissed again via the close control', async () => {
    const user = userEvent.setup();
    render(<Dock documents={[]} />);

    await user.click(screen.getByRole('button', { name: /toggle toolkit dock/i }));
    expect(screen.getByRole('tab', { name: /party/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /close toolkit dock/i }));
    expect(screen.queryByRole('tab')).not.toBeInTheDocument();
  });

  // The dock is a summonable overlay rendered at the shell ROOT, reachable from
  // Library, Sheet and Scene alike. That placement is what makes its focus
  // handling load-bearing: without it a keyboard user summons a panel their
  // focus is not in, and dismissing it drops focus to <body>, at the top of the
  // whole document.
  describe('keyboard operability', () => {
    it('links the trigger to the panel it controls, only while it exists', async () => {
      const user = userEvent.setup();
      render(<Dock documents={[]} />);

      const trigger = screen.getByRole('button', { name: /toggle toolkit dock/i });
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
      // No dangling reference while the panel is unmounted.
      expect(trigger).not.toHaveAttribute('aria-controls');

      await user.click(trigger);

      const panel = screen.getByRole('complementary', { name: /toolkit dock/i });
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
      expect(trigger).toHaveAttribute('aria-controls', panel.id);
      expect(panel.id).not.toBe('');
    });

    it('moves focus into the panel when summoned', async () => {
      const user = userEvent.setup();
      render(<Dock documents={[]} />);

      await user.click(screen.getByRole('button', { name: /toggle toolkit dock/i }));

      expect(screen.getByRole('complementary', { name: /toolkit dock/i })).toHaveFocus();
    });

    it('closes on Escape and returns focus to the summon control', async () => {
      const user = userEvent.setup();
      render(<Dock documents={[]} />);
      const trigger = screen.getByRole('button', { name: /toggle toolkit dock/i });

      await user.click(trigger);
      expect(screen.getByRole('tab', { name: /party/i })).toBeInTheDocument();

      await user.keyboard('{Escape}');

      expect(screen.queryByRole('tab')).not.toBeInTheDocument();
      expect(trigger).toHaveFocus();
    });

    it('returns focus to the summon control when closed via the close button', async () => {
      const user = userEvent.setup();
      render(<Dock documents={[]} />);
      const trigger = screen.getByRole('button', { name: /toggle toolkit dock/i });

      await user.click(trigger);
      await user.click(screen.getByRole('button', { name: /close toolkit dock/i }));

      // Would catch focus being stranded on <body> when the panel unmounts.
      expect(trigger).toHaveFocus();
    });

    it('keeps Escape scoped to the dock instead of leaking to the shell', async () => {
      const user = userEvent.setup();
      const shellEscape = vi.fn();
      // App registers a bubble-phase window Escape that leaves the sheet
      // surface; dismissing the dock must not also navigate the user away.
      window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') shellEscape();
      });

      render(<Dock documents={[]} />);
      await user.click(screen.getByRole('button', { name: /toggle toolkit dock/i }));
      await user.keyboard('{Escape}');

      expect(screen.queryByRole('tab')).not.toBeInTheDocument();
      expect(shellEscape).not.toHaveBeenCalled();
    });
  });

  // With the in-sheet browsers evicted (Phase 5) the Dock is the ONLY catalog
  // route, so these three behaviours stopped being cosmetic: a Dock pinned to
  // the wrong system would click-add foreign content into the open sheet, and
  // the per-system price/weight shapes the deleted wrappers each normalised
  // locally now have to be handled once, here.
  describe('single-catalog-home obligations', () => {
    it('follows the open sheet system rather than pinning to the boot value', async () => {
      const user = userEvent.setup();
      // Boot with no sheet open: the Dock falls back to the first known system.
      const { rerender } = render(<Dock documents={[]} />);
      await user.click(screen.getByRole('button', { name: /toggle toolkit dock/i }));

      const selector = screen.getByRole('combobox', { name: /select game system/i });
      expect((selector as HTMLSelectElement).value).not.toBe('pf2e');

      // Opening a PF2e sheet must re-key the catalogs. Before this, the Dock
      // stayed on the boot system and its click-add would have pushed a 5e
      // spell id into the PF2e sheet.
      rerender(<Dock documents={[]} activeSystemId="pf2e" />);
      await waitFor(() => {
        expect((selector as HTMLSelectElement).value).toBe('pf2e');
      });
      await waitFor(() => {
        expect(dataLoader.loadSpellsForSystem).toHaveBeenCalledWith('pf2e');
      });
    });

    it('prints M&M Equipment-Point prices and hides their absent weight', async () => {
      const user = userEvent.setup();
      vi.mocked(dataLoader.loadEquipmentForSystem).mockResolvedValue([
        // M&M gear carries a bare EP number and no weight at all; a template
        // over the declared {amount, currency} shape printed "undefined undefined".
        {
          id: 'utility-belt',
          name: 'Utility Belt',
          type: 'gear',
          cost: 1,
          description: 'Pouches.',
        },
      ] as unknown as Item[]);

      render(<Dock documents={[]} activeSystemId="mam3e" />);
      await user.click(screen.getByRole('button', { name: /toggle toolkit dock/i }));
      await user.click(screen.getByRole('tab', { name: /equipment/i }));

      expect(await screen.findByText('Utility Belt')).toBeInTheDocument();
      expect(screen.getByText('1 ep')).toBeInTheDocument();
      expect(screen.queryByText(/undefined/)).not.toBeInTheDocument();
      expect(screen.queryByText(/lbs/)).not.toBeInTheDocument();
    });

    it('captions PF2e item weight as Bulk, not pounds', async () => {
      const user = userEvent.setup();
      vi.mocked(dataLoader.loadEquipmentForSystem).mockResolvedValue([
        {
          id: 'explorers-clothing',
          name: "Explorer's Clothing",
          type: 'armor',
          rarity: 'common',
          cost: { amount: 1, currency: 'gp' },
          weight: 1,
          description: 'Travel clothes.',
        },
      ] as unknown as Item[]);

      render(<Dock documents={[]} activeSystemId="pf2e" />);
      await user.click(screen.getByRole('button', { name: /toggle toolkit dock/i }));
      await user.click(screen.getByRole('tab', { name: /equipment/i }));

      expect(await screen.findByText("Explorer's Clothing")).toBeInTheDocument();
      expect(screen.getByText(/1 Bulk/)).toBeInTheDocument();
      expect(screen.queryByText(/lbs/)).not.toBeInTheDocument();
    });
  });
});
