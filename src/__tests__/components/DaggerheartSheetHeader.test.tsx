import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { DaggerheartSheetHeader } from '../../systems/daggerheart/components/DaggerheartSheetHeader';
import type { DaggerheartSheetController } from '../../systems/daggerheart/useDaggerheartSheetController';

// Minimal controller — the header only reads the fields wired below.
function makeController(level: number, update = vi.fn()): DaggerheartSheetController {
  return {
    document: { name: 'Test Hero' },
    data: {
      level,
      class: '',
      subclass: '',
      heritage: '',
      community: '',
      hitPoints: { current: 5, max: 10 },
      stress: { current: 0, max: 6 },
      armor: { current: 0, max: 3 },
      hope: 2,
    },
    canUpdate: true,
    loadingOptions: false,
    optionsState: 'ready',
    derivedStats: { armorMax: 3 },
    classValueMissing: false,
    subclassValueMissing: false,
    ancestryValueMissing: false,
    communityValueMissing: false,
    classOptions: [],
    subclassOptions: [],
    ancestryOptions: [],
    communityOptions: [],
    selectedClass: undefined,
    update,
    onNameChange: vi.fn(),
    handleClassChange: vi.fn(),
    handleAncestryChange: vi.fn(),
    handleCommunityChange: vi.fn(),
    restTendToAllWounds: vi.fn(),
    restClearAllStress: vi.fn(),
    restRepairAllArmor: vi.fn(),
    restPrepare: vi.fn(),
  } as unknown as DaggerheartSheetController;
}

function renderHeader(level: number, update = vi.fn()) {
  render(<DaggerheartSheetHeader controller={makeController(level, update)} />);
  return update;
}

describe('DaggerheartSheetHeader milestone level controls', () => {
  it('steps the level up by 1 through the existing update handler', async () => {
    const user = userEvent.setup();
    const update = renderHeader(5);

    await user.click(screen.getByTitle('Milestone level up (+1)'));
    expect(update).toHaveBeenCalledWith({ level: 6 });
  });

  it('steps the level down by 1 through the existing update handler', async () => {
    const user = userEvent.setup();
    const update = renderHeader(5);

    await user.click(screen.getByTitle('Milestone level down (−1)'));
    expect(update).toHaveBeenCalledWith({ level: 4 });
  });

  it('clamps at the upper bound of 10', async () => {
    const user = userEvent.setup();
    const update = renderHeader(10);

    await user.click(screen.getByTitle('Milestone level up (+1)'));
    expect(update).toHaveBeenCalledWith({ level: 10 });
  });

  it('clamps at the lower bound of 1', async () => {
    const user = userEvent.setup();
    const update = renderHeader(1);

    await user.click(screen.getByTitle('Milestone level down (−1)'));
    expect(update).toHaveBeenCalledWith({ level: 1 });
  });
});
