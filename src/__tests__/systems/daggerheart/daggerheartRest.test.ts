import { describe, expect, it } from 'vitest';

import { createDefaultDaggerheartData } from '../../../systems/daggerheart/data-model';
import {
  clearAllStress,
  clearStress,
  prepareGainHope,
  repairAllArmor,
  repairArmor,
  tendToAllWounds,
  tendToWounds,
} from '../../../systems/daggerheart/daggerheartRest';
import {
  DAGGERHEART_MAX_HOPE,
  getDaggerheartShortRestRecovery,
} from '../../../rules/daggerheartDerived';

describe('daggerheart long-rest downtime moves', () => {
  it('Tend to All Wounds heals marked Hit Points to full', () => {
    const data = { ...createDefaultDaggerheartData(), hitPoints: { current: 2, max: 6 } };
    expect(tendToAllWounds(data)).toEqual({ hitPoints: { current: 6, max: 6 } });
  });

  it('Tend to All Wounds is a no-op at full Hit Points', () => {
    const data = { ...createDefaultDaggerheartData(), hitPoints: { current: 6, max: 6 } };
    expect(tendToAllWounds(data)).toEqual({ hitPoints: { current: 6, max: 6 } });
  });

  it('Clear All Stress resets marked Stress to zero', () => {
    const data = { ...createDefaultDaggerheartData(), stress: { current: 4, max: 6 } };
    expect(clearAllStress(data)).toEqual({ stress: { current: 0, max: 6 } });
  });

  it('Repair All Armor resets marked Armor Slots to zero', () => {
    const data = { ...createDefaultDaggerheartData(), armor: { current: 3, max: 4 } };
    expect(repairAllArmor(data)).toEqual({ armor: { current: 0, max: 4 } });
  });

  it('Prepare gains one Hope, clamped to the maximum', () => {
    expect(prepareGainHope({ ...createDefaultDaggerheartData(), hope: 2 })).toEqual({ hope: 3 });
    // At the cap, Prepare cannot push Hope past DAGGERHEART_MAX_HOPE.
    expect(
      prepareGainHope({ ...createDefaultDaggerheartData(), hope: DAGGERHEART_MAX_HOPE })
    ).toEqual({ hope: DAGGERHEART_MAX_HOPE });
  });

  it('each move touches only its own pool (moves are independent)', () => {
    const data = {
      ...createDefaultDaggerheartData(),
      hitPoints: { current: 1, max: 6 },
      stress: { current: 5, max: 6 },
      armor: { current: 2, max: 3 },
      hope: 0,
    };
    expect(Object.keys(tendToAllWounds(data))).toEqual(['hitPoints']);
    expect(Object.keys(clearAllStress(data))).toEqual(['stress']);
    expect(Object.keys(repairAllArmor(data))).toEqual(['armor']);
    expect(Object.keys(prepareGainHope(data))).toEqual(['hope']);
  });
});

describe('daggerheart short-rest downtime moves (clear 1d4 + tier)', () => {
  it('Tend to Wounds heals exactly the rolled recovery in Hit Points', () => {
    const data = { ...createDefaultDaggerheartData(), hitPoints: { current: 2, max: 8 } };
    expect(tendToWounds(data, 3)).toEqual({ hitPoints: { current: 5, max: 8 } });
  });

  it('Tend to Wounds clamps healing at full Hit Points', () => {
    const data = { ...createDefaultDaggerheartData(), hitPoints: { current: 5, max: 6 } };
    // Recovery larger than the missing HP tops out at max, never above.
    expect(tendToWounds(data, 10)).toEqual({ hitPoints: { current: 6, max: 6 } });
  });

  it('Clear Stress reduces marked Stress by exactly the rolled recovery', () => {
    const data = { ...createDefaultDaggerheartData(), stress: { current: 5, max: 6 } };
    expect(clearStress(data, 2)).toEqual({ stress: { current: 3, max: 6 } });
  });

  it('Clear Stress clamps marked Stress at zero', () => {
    const data = { ...createDefaultDaggerheartData(), stress: { current: 2, max: 6 } };
    expect(clearStress(data, 10)).toEqual({ stress: { current: 0, max: 6 } });
  });

  it('Repair Armor reduces marked Armor Slots by exactly the rolled recovery', () => {
    const data = { ...createDefaultDaggerheartData(), armor: { current: 4, max: 5 } };
    expect(repairArmor(data, 3)).toEqual({ armor: { current: 1, max: 5 } });
  });

  it('Repair Armor clamps marked Armor Slots at zero', () => {
    const data = { ...createDefaultDaggerheartData(), armor: { current: 1, max: 4 } };
    expect(repairArmor(data, 10)).toEqual({ armor: { current: 0, max: 4 } });
  });

  it('a recovery of 0 is a no-op for every short-rest move', () => {
    const data = {
      ...createDefaultDaggerheartData(),
      hitPoints: { current: 2, max: 6 },
      stress: { current: 4, max: 6 },
      armor: { current: 3, max: 5 },
    };
    expect(tendToWounds(data, 0)).toEqual({ hitPoints: { current: 2, max: 6 } });
    expect(clearStress(data, 0)).toEqual({ stress: { current: 4, max: 6 } });
    expect(repairArmor(data, 0)).toEqual({ armor: { current: 3, max: 5 } });
  });

  it('getDaggerheartShortRestRecovery sums the d4 roll and tier (d4=3, tier=2 => 5)', () => {
    expect(getDaggerheartShortRestRecovery(3, 2)).toBe(5);
  });
});
