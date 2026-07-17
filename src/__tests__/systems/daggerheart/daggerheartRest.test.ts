import { describe, expect, it } from 'vitest';

import { createDefaultDaggerheartData } from '../../../systems/daggerheart/data-model';
import {
  clearAllStress,
  prepareGainHope,
  repairAllArmor,
  tendToAllWounds,
} from '../../../systems/daggerheart/daggerheartRest';
import { DAGGERHEART_MAX_HOPE } from '../../../rules/daggerheartDerived';

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
