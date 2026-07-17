import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Pf2eHeader } from '../../systems/pf2e/components/Pf2eHeader';
import type { CharacterDocument } from '../../types/core/document';
import type { Pf2eDataModel } from '../../systems/pf2e/data-model';

// Minimal document — Pf2eHeader only reads name and a handful of system fields.
function makeDocument(level: number): CharacterDocument<Pf2eDataModel> {
  return {
    name: 'Test Hero',
    system: {
      level,
      classId: '',
      ancestryId: '',
      heritageId: '',
      backgroundId: '',
      experiencePoints: 0,
      heroPoints: 1,
    },
  } as unknown as CharacterDocument<Pf2eDataModel>;
}

function renderHeader(level: number, onLevelChange = vi.fn()) {
  render(
    <Pf2eHeader
      document={makeDocument(level)}
      canUpdate
      classes={[]}
      ancestries={[]}
      heritages={[]}
      backgrounds={[]}
      backgroundsLoaded
      onNameChange={vi.fn()}
      onLevelChange={onLevelChange}
      onClassChange={vi.fn()}
      onAncestryChange={vi.fn()}
      onHeritageChange={vi.fn()}
      onBackgroundChange={vi.fn()}
      onExperiencePointsChange={vi.fn()}
      onHeroPointsChange={vi.fn()}
      onLoadOptions={vi.fn()}
      onLoadBackgrounds={vi.fn()}
    />
  );
  return onLevelChange;
}

describe('Pf2eHeader milestone level controls', () => {
  it('steps the level up by 1 through the existing level-change handler', async () => {
    const user = userEvent.setup();
    const onLevelChange = renderHeader(5);

    await user.click(screen.getByTitle('Milestone level up (+1)'));
    expect(onLevelChange).toHaveBeenCalledWith('6');
  });

  it('steps the level down by 1 through the existing level-change handler', async () => {
    const user = userEvent.setup();
    const onLevelChange = renderHeader(5);

    await user.click(screen.getByTitle('Milestone level down (−1)'));
    expect(onLevelChange).toHaveBeenCalledWith('4');
  });

  it('clamps at the upper bound of 20', async () => {
    const user = userEvent.setup();
    const onLevelChange = renderHeader(20);

    await user.click(screen.getByTitle('Milestone level up (+1)'));
    expect(onLevelChange).toHaveBeenCalledWith('20');
  });

  it('clamps at the lower bound of 1', async () => {
    const user = userEvent.setup();
    const onLevelChange = renderHeader(1);

    await user.click(screen.getByTitle('Milestone level down (−1)'));
    expect(onLevelChange).toHaveBeenCalledWith('1');
  });
});
