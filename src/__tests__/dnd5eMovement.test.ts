/**
 * Engine-math verification for D&D 5e movement and carrying capacity (SRD 5.1 /
 * SRD 5.2, identical). Pins the L6 entries of docs/compute-register/dnd5e-2024.ts.
 */
import {
  dnd5eCarryingCapacity,
  dnd5ePushDragLift,
  dnd5eLongJump,
  dnd5eHighJump,
} from '../systems/dnd5e/shared/dnd5eMovement';

describe('5e carrying capacity and push/drag/lift', () => {
  it('carrying capacity is Strength score × 15', () => {
    expect(dnd5eCarryingCapacity(15)).toBe(225);
    expect(dnd5eCarryingCapacity(20)).toBe(300);
  });
  it('push/drag/lift is Strength score × 30 (twice carrying capacity)', () => {
    expect(dnd5ePushDragLift(15)).toBe(450);
    expect(dnd5ePushDragLift(20)).toBe(600);
  });
});

describe('5e jumping', () => {
  it('long jump = Strength score feet with a running start, half standing', () => {
    expect(dnd5eLongJump(15)).toBe(15);
    expect(dnd5eLongJump(15, false)).toBe(7); // floor(15 / 2)
  });
  it('high jump = 3 + Strength mod feet with a running start, half standing', () => {
    expect(dnd5eHighJump(3)).toBe(6); // 3 + 3
    expect(dnd5eHighJump(3, false)).toBe(3); // floor(6 / 2)
    expect(dnd5eHighJump(-5)).toBe(0); // clamped at 0
  });
});
