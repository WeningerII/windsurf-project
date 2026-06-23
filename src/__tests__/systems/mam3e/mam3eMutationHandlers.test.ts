import { renderHook, act } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { CharacterDocument, SystemDataModel } from '../../../types/core/document';
import type { Mam3eDataModel } from '../../../systems/mam3e/data-model';
import { createDefaultMam3eData } from '../../../systems/mam3e/data-model';
import {
  createEmptyMam3eConditionTrack,
  createEmptyMam3ePower,
} from '../../../systems/mam3e/mam3eSheetShared';
import { useMam3eMutationHandlers } from '../../../systems/mam3e/useMam3eMutationHandlers';
import type { Power } from '../../../types/mam/powers';
import type { Advantage } from '../../../types/mam/advantages';
import type { Mam3eArchetype } from '../../../types/mam/archetypes';
import type { Complication } from '../../../data/mutants-and-masterminds/3e/complications';

/** A power with controllable modifier state for the modifier-mutation tests. */
function powerWith(overrides: Partial<Power> = {}): Power {
  return { ...createEmptyMam3ePower('p1'), ...overrides };
}

/** The single updated document from the most recent onUpdate call. */
function latest(onUpdate: ReturnType<typeof makeOnUpdate>): CharacterDocument<Mam3eDataModel> {
  return onUpdate.mock.calls.at(-1)![0] as CharacterDocument<Mam3eDataModel>;
}

function makeDoc(overrides: Partial<Mam3eDataModel> = {}): CharacterDocument<Mam3eDataModel> {
  return {
    id: 'mam3e-mutation-test',
    name: 'Mutation Test Hero',
    systemId: 'mam3e',
    system: { ...createDefaultMam3eData(), ...overrides },
    createdAt: new Date('2026-05-01T00:00:00.000Z'),
    updatedAt: new Date('2026-05-01T00:00:00.000Z'),
  };
}

// Typed to match the hook's onUpdate prop so the mock is assignable without
// widening; bare vi.fn() infers Mock<Procedure | Constructable> in Vitest 4,
// which no longer satisfies a concrete handler signature.
function makeOnUpdate() {
  return vi.fn<(document: CharacterDocument<SystemDataModel>) => void>();
}

function renderHandlers(
  document: CharacterDocument<Mam3eDataModel>,
  onUpdate: ReturnType<typeof makeOnUpdate> | undefined,
  conditionTrack = document.system.conditionTrack ?? createEmptyMam3eConditionTrack(),
  options: { pinnedArchetypeIds?: string[]; insertedComplicationIds?: string[] } = {}
) {
  return renderHook(() =>
    useMam3eMutationHandlers({
      document,
      onUpdate,
      conditionTrack,
      pinnedArchetypeIds: options.pinnedArchetypeIds ?? [],
      insertedComplicationIds: options.insertedComplicationIds ?? [],
    })
  );
}

describe('useMam3eMutationHandlers', () => {
  it('generates distinct power ids for rapid double-adds (no Date.now collisions)', () => {
    const onUpdate = makeOnUpdate();
    const { result } = renderHandlers(makeDoc(), onUpdate);

    act(() => {
      result.current.addPower();
      result.current.addPower();
    });

    const [firstCall, secondCall] = onUpdate.mock.calls.map(
      ([doc]) => doc as CharacterDocument<Mam3eDataModel>
    );
    const firstId = firstCall.system.powers[0].id;
    const secondId = secondCall.system.powers[0].id;

    expect(firstId).toMatch(/^power-/);
    expect(secondId).toMatch(/^power-/);
    expect(firstId).not.toBe(secondId);
  });

  it('clamps negative defense ranks to 0 in updateDefenseRank', () => {
    const onUpdate = makeOnUpdate();
    const { result } = renderHandlers(makeDoc(), onUpdate);

    act(() => {
      result.current.updateDefenseRank('dodge', -8);
    });

    const updated = onUpdate.mock.calls[0][0] as CharacterDocument<Mam3eDataModel>;
    expect(updated.system.defenses.dodge.rank).toBe(0);
  });

  it('escalates a second Staggered to Incapacitated via the shared engine banding', () => {
    const onUpdate = makeOnUpdate();
    const conditionTrack = {
      bruised: 1,
      dazed: false,
      staggered: true,
      incapacitated: false,
    };
    const { result } = renderHandlers(makeDoc({ conditionTrack }), onUpdate, conditionTrack);

    act(() => {
      result.current.applyToughnessFailure(12);
    });

    const updated = onUpdate.mock.calls[0][0] as CharacterDocument<Mam3eDataModel>;
    expect(updated.system.conditionTrack).toEqual({
      bruised: 2,
      dazed: false,
      staggered: true,
      incapacitated: true,
    });
  });

  it('does not emit an update for non-positive failure margins', () => {
    const onUpdate = makeOnUpdate();
    const { result } = renderHandlers(makeDoc(), onUpdate);

    act(() => {
      result.current.applyToughnessFailure(0);
      result.current.applyToughnessFailure(-3);
    });

    expect(onUpdate).not.toHaveBeenCalled();
  });

  it('is a no-op (no throw, no update) in read-only mode without onUpdate', () => {
    const { result } = renderHandlers(makeDoc({ powers: [powerWith()] }), undefined);

    expect(() =>
      act(() => {
        result.current.addPower();
        result.current.updatePowerRank('p1', 4);
        result.current.onNameChange('Ignored');
      })
    ).not.toThrow();
  });

  it('renames the character through onNameChange', () => {
    const onUpdate = makeOnUpdate();
    const { result } = renderHandlers(makeDoc(), onUpdate);

    act(() => result.current.onNameChange('Captain Test'));

    expect(latest(onUpdate).name).toBe('Captain Test');
  });

  // Each handler call derives from the document the hook was rendered with, so
  // dependent steps use a fresh render seeded with the prior step's state.
  it('adds an extra seeded at rank 1', () => {
    const onUpdate = makeOnUpdate();
    const { result } = renderHandlers(makeDoc({ powers: [powerWith()] }), onUpdate);

    act(() => result.current.addPowerModifier('p1', 'extra', 'area'));

    expect(latest(onUpdate).system.powers[0]).toMatchObject({
      extras: ['area'],
      modifierRanks: { area: 1 },
    });
  });

  it('adds a flaw alongside an existing extra, seeded at rank 1', () => {
    const onUpdate = makeOnUpdate();
    const { result } = renderHandlers(
      makeDoc({ powers: [powerWith({ extras: ['area'], modifierRanks: { area: 1 } })] }),
      onUpdate
    );

    act(() => result.current.addPowerModifier('p1', 'flaw', 'limited'));

    expect(latest(onUpdate).system.powers[0]).toMatchObject({
      flaws: ['limited'],
      modifierRanks: { area: 1, limited: 1 },
    });
  });

  it('ignores an empty modifier id and de-dupes an already-present modifier', () => {
    const onUpdate = makeOnUpdate();
    const { result } = renderHandlers(
      makeDoc({ powers: [powerWith({ extras: ['area'], modifierRanks: { area: 3 } })] }),
      onUpdate
    );

    act(() => result.current.addPowerModifier('p1', 'extra', ''));
    expect(onUpdate).not.toHaveBeenCalled();

    act(() => result.current.addPowerModifier('p1', 'extra', 'area'));
    // The de-dupe guard keeps a single entry and preserves the existing rank.
    expect(latest(onUpdate).system.powers[0]).toMatchObject({
      extras: ['area'],
      modifierRanks: { area: 3 },
    });
  });

  it('removes one modifier and keeps the remaining ranks', () => {
    const onUpdate = makeOnUpdate();
    const { result } = renderHandlers(
      makeDoc({
        powers: [powerWith({ extras: ['area', 'ranged'], modifierRanks: { area: 2, ranged: 1 } })],
      }),
      onUpdate
    );

    act(() => result.current.removePowerModifier('p1', 'extra', 'area'));

    expect(latest(onUpdate).system.powers[0]).toMatchObject({
      extras: ['ranged'],
      modifierRanks: { ranged: 1 },
    });
  });

  it('clears modifierRanks entirely once the last modifier is removed', () => {
    const onUpdate = makeOnUpdate();
    const { result } = renderHandlers(
      makeDoc({ powers: [powerWith({ extras: ['ranged'], modifierRanks: { ranged: 1 } })] }),
      onUpdate
    );

    act(() => result.current.removePowerModifier('p1', 'extra', 'ranged'));

    const cleared = latest(onUpdate).system.powers[0];
    expect(cleared.extras).toEqual([]);
    expect(cleared.modifierRanks).toBeUndefined();
  });

  it('changes a modifier rank by a delta and clamps it to a minimum of 1', () => {
    const onUpdate = makeOnUpdate();
    const { result } = renderHandlers(
      makeDoc({ powers: [powerWith({ extras: ['area'], modifierRanks: { area: 2 } })] }),
      onUpdate
    );

    act(() => result.current.changeModifierRank('p1', 'area', 1));
    expect(latest(onUpdate).system.powers[0].modifierRanks).toEqual({ area: 3 });

    act(() => result.current.changeModifierRank('p1', 'area', -10));
    expect(latest(onUpdate).system.powers[0].modifierRanks).toEqual({ area: 1 });
  });

  it('floors and clamps an edited power rank to a minimum of 1', () => {
    const onUpdate = makeOnUpdate();
    const { result } = renderHandlers(makeDoc({ powers: [powerWith()] }), onUpdate);

    act(() => result.current.updatePowerRank('p1', 5.9));
    expect(latest(onUpdate).system.powers[0].rank).toBe(5);

    act(() => result.current.updatePowerRank('p1', -4));
    expect(latest(onUpdate).system.powers[0].rank).toBe(1);
  });

  it('removes a power by id and leaves the others', () => {
    const onUpdate = makeOnUpdate();
    const { result } = renderHandlers(
      makeDoc({ powers: [powerWith({ id: 'p1' }), powerWith({ id: 'p2' })] }),
      onUpdate
    );

    act(() => result.current.removePower('p1'));

    expect(latest(onUpdate).system.powers.map((power) => power.id)).toEqual(['p2']);
  });

  it('sets an ability rank and merges a condition-track patch', () => {
    const onUpdate = makeOnUpdate();
    const { result } = renderHandlers(makeDoc(), onUpdate);

    act(() => result.current.updateAbility('str', 4));
    expect(latest(onUpdate).system.abilities.str).toBe(4);

    act(() => result.current.updateConditionTrack({ dazed: true }));
    expect(latest(onUpdate).system.conditionTrack).toMatchObject({ dazed: true, bruised: 0 });
  });

  it('resets the condition track to empty', () => {
    const onUpdate = makeOnUpdate();
    const conditionTrack = { bruised: 2, dazed: true, staggered: true, incapacitated: false };
    const { result } = renderHandlers(makeDoc({ conditionTrack }), onUpdate, conditionTrack);

    act(() => result.current.resetConditionTrack());

    expect(latest(onUpdate).system.conditionTrack).toEqual(createEmptyMam3eConditionTrack());
  });

  it('pins an archetype, then unpins it on a second toggle', () => {
    const onUpdate = makeOnUpdate();
    const archetype = { id: 'mam3e-battlesuit', name: 'Battlesuit' } as Mam3eArchetype;

    const pinned = renderHandlers(makeDoc(), onUpdate);
    act(() => pinned.result.current.togglePinnedArchetype(archetype));
    expect(latest(onUpdate).system.selectedArchetypeIds).toEqual(['mam3e-battlesuit']);

    const unpinned = renderHandlers(makeDoc(), onUpdate, undefined, {
      pinnedArchetypeIds: ['mam3e-battlesuit'],
    });
    act(() => unpinned.result.current.togglePinnedArchetype(archetype));
    expect(latest(onUpdate).system.selectedArchetypeIds).toEqual([]);
  });

  it('adds catalog advantages (ranked gets rank 1) and de-dupes by name', () => {
    const onUpdate = makeOnUpdate();
    const { result } = renderHandlers(makeDoc(), onUpdate);

    act(() =>
      result.current.addAdvantageFromCatalog({ id: 'assessment', name: 'Assessment' } as Advantage)
    );
    const unranked = latest(onUpdate).system.advantages.at(-1)!;
    expect(unranked).toMatchObject({ name: 'Assessment' });
    expect(unranked).not.toHaveProperty('rank');

    act(() =>
      result.current.addAdvantageFromCatalog({
        id: 'ranged-attack',
        name: 'Ranged Attack',
        ranked: true,
      } as Advantage)
    );
    expect(latest(onUpdate).system.advantages.at(-1)).toMatchObject({
      name: 'Ranged Attack',
      rank: 1,
    });

    onUpdate.mockClear();
    const dupeDoc = makeDoc({ advantages: [{ id: 'a1', name: 'Assessment' }] });
    const { result: dupe } = renderHandlers(dupeDoc, onUpdate);
    act(() =>
      dupe.current.addAdvantageFromCatalog({ id: 'assessment', name: 'Assessment' } as Advantage)
    );
    expect(onUpdate).not.toHaveBeenCalled();
  });

  it('inserts an SRD complication and skips ones already inserted', () => {
    const onUpdate = makeOnUpdate();
    // Only id/name/description/source/category are read by insertComplication;
    // cast through unknown so the fixture needn't carry the full catalog shape.
    const complication = {
      id: 'accident',
      name: 'Accident',
      description: 'Bad things happen.',
      source: "Hero's Handbook",
      category: 'complication',
    } as unknown as Complication;

    const { result } = renderHandlers(makeDoc(), onUpdate);
    act(() => result.current.insertComplication(complication));
    expect(latest(onUpdate).system.complications.at(-1)).toMatchObject({
      id: 'accident',
      name: 'Accident',
    });

    onUpdate.mockClear();
    const { result: already } = renderHandlers(makeDoc(), onUpdate, undefined, {
      insertedComplicationIds: ['accident'],
    });
    act(() => already.current.insertComplication(complication));
    expect(onUpdate).not.toHaveBeenCalled();
  });
});
