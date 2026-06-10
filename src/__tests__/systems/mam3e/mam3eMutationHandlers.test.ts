import { renderHook, act } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { CharacterDocument, SystemDataModel } from '../../../types/core/document';
import type { Mam3eDataModel } from '../../../systems/mam3e/data-model';
import { createDefaultMam3eData } from '../../../systems/mam3e/data-model';
import { createEmptyMam3eConditionTrack } from '../../../systems/mam3e/mam3eSheetShared';
import { useMam3eMutationHandlers } from '../../../systems/mam3e/useMam3eMutationHandlers';

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
  onUpdate: ReturnType<typeof makeOnUpdate>,
  conditionTrack = document.system.conditionTrack ?? createEmptyMam3eConditionTrack()
) {
  return renderHook(() =>
    useMam3eMutationHandlers({
      document,
      onUpdate,
      conditionTrack,
      pinnedArchetypeIds: [],
      insertedComplicationIds: [],
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
});
