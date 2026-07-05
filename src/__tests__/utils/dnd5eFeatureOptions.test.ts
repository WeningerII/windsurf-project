import { describe, expect, it } from 'vitest';
import {
  applyDnd5eFeatureOptionSelection,
  getEligibleDnd5eFeatureOptions,
  isDnd5eFeatureOptionFeatureId,
  loadDnd5e2014FeatureOptions,
  removeDnd5eFeatureOptionSelection,
  synchronizeDnd5eFeatureOptionSelections,
} from '../../systems/dnd5e/shared/dnd5eFeatureOptions';
import type { Feature } from '../../types/core/character';

describe('dnd5eFeatureOptions', () => {
  it('loads the normalized 5e-2014 feature-option catalog', async () => {
    const options = await loadDnd5e2014FeatureOptions();

    expect(options).toHaveLength(106);
    expect(options[0]).toMatchObject({
      system: 'dnd-5e-2014',
    });
    expect(options.some((option) => option.group === 'invocations')).toBe(true);
    expect(options.some((option) => option.group === 'channel-divinity')).toBe(true);
    expect(options.some((option) => option.group === 'wild-shapes')).toBe(true);
  });

  it('filters options by current class, subclass, and level when metadata allows it', async () => {
    const options = await loadDnd5e2014FeatureOptions();

    const eligible = getEligibleDnd5eFeatureOptions(options, [
      { classId: 'warlock', level: 3, subclassId: 'fiend' },
      { classId: 'cleric', level: 2, subclassId: 'life-domain' },
    ]);

    expect(eligible.some((option) => option.id === 'agonizing-blast')).toBe(true);
    expect(eligible.some((option) => option.id === 'preserve-life')).toBe(true);
    expect(eligible.some((option) => option.id === 'giant-eagle')).toBe(false);
  });

  it('adds selected options and mirrors them into feature entries with provenance', async () => {
    const options = await loadDnd5e2014FeatureOptions();
    const agonizingBlast = options.find((option) => option.id === 'agonizing-blast');

    expect(agonizingBlast).toBeDefined();

    const nextState = applyDnd5eFeatureOptionSelection(
      // `features` is typed explicitly so the generic does not infer never[]
      // from the empty literal (the assertions below read features[0].id).
      { features: [] as Feature[], featureOptionSelections: [] },
      agonizingBlast!
    );

    expect(nextState.featureOptionSelections).toEqual([
      { id: 'agonizing-blast', group: 'invocations' },
    ]);
    expect(nextState.features).toEqual([
      expect.objectContaining({
        id: 'feature-option:invocations:agonizing-blast',
        name: 'Agonizing Blast',
        source: 'Selected Invocation',
      }),
    ]);
    expect(isDnd5eFeatureOptionFeatureId(nextState.features[0].id)).toBe(true);
  });

  it('removes selected options and their mirrored feature entries', () => {
    const state = {
      featureOptionSelections: [{ id: 'agonizing-blast', group: 'invocations' as const }],
      features: [
        {
          id: 'feature-option:invocations:agonizing-blast',
          name: 'Agonizing Blast',
          source: 'Selected Invocation',
          description: 'Add CHA modifier to eldritch blast damage.',
        },
        {
          id: 'spellcasting-warlock',
          name: 'Spellcasting',
          source: 'Warlock 1',
          description: 'Keep this feature.',
        },
      ],
    };

    const nextState = removeDnd5eFeatureOptionSelection(state, {
      id: 'agonizing-blast',
      group: 'invocations',
    });

    expect(nextState.featureOptionSelections).toEqual([]);
    expect(nextState.features).toEqual([
      expect.objectContaining({
        id: 'spellcasting-warlock',
      }),
    ]);
  });

  it('synchronizes persisted selections against the current catalog', async () => {
    const options = await loadDnd5e2014FeatureOptions();
    const preservedOption = options.find((option) => option.id === 'archery');

    expect(preservedOption).toBeDefined();

    const nextState = synchronizeDnd5eFeatureOptionSelections(
      {
        featureOptionSelections: [
          { id: 'archery', group: 'fighting-styles' as const },
          { id: 'missing-option', group: 'invocations' as const },
        ],
        features: [
          {
            id: 'feature-option:invocations:missing-option',
            name: 'Missing Option',
            source: 'Selected Invocation',
            description: 'Should be removed.',
          },
          {
            id: 'manual-feature',
            name: 'Manual Feature',
            source: 'Manual',
            description: 'Should stay.',
          },
        ],
      },
      options
    );

    expect(nextState.featureOptionSelections).toEqual([
      { id: 'archery', group: 'fighting-styles' },
    ]);
    expect(nextState.features).toEqual([
      expect.objectContaining({
        id: 'manual-feature',
      }),
      expect.objectContaining({
        id: 'feature-option:fighting-styles:archery',
        name: 'Archery',
      }),
    ]);
  });
});
