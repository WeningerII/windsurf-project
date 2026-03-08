import { describe, expect, it, vi } from 'vitest';
import { CharacterDocument } from '../../types/core/document';
import { DaggerheartDataModel, createDefaultDaggerheartData } from '../../systems/daggerheart/data-model';
import { DaggerheartEngine } from '../../systems/daggerheart/engine';

function makeDoc(
  overrides: Partial<DaggerheartDataModel> = {}
): CharacterDocument<DaggerheartDataModel> {
  return {
    id: 'daggerheart-test',
    name: 'Hopebound',
    systemId: 'daggerheart',
    system: { ...createDefaultDaggerheartData(), ...overrides },
    createdAt: new Date('2026-03-07T00:00:00.000Z'),
    updatedAt: new Date('2026-03-07T00:00:00.000Z'),
  };
}

describe('DaggerheartEngine', () => {
  const engine = new DaggerheartEngine();

  describe('prepareData', () => {
    it('returns a new document reference from prepareData without mutating the original system', () => {
      const doc = makeDoc({
        level: 4,
        attributes: {
          ...createDefaultDaggerheartData().attributes,
          agility: 2,
          strength: 3,
          presence: 1,
        },
        hitPoints: { current: 6, max: 6 },
        stress: { current: 0, max: 6 },
      });
      const originalSystem = doc.system;
      const originalHitPoints = { ...doc.system.hitPoints };

      const result = engine.prepareData(doc);

      expect(result).not.toBe(doc);
      expect(result.system).not.toBe(originalSystem);
      expect(result.system.hitPoints).not.toBe(originalSystem.hitPoints);
      expect(doc.system.hitPoints).toEqual(originalHitPoints);
      expect(doc.system.evasion).toBe(0);
    });

    it('derives evasion, max hp, and max stress from level and attributes', () => {
      const doc = makeDoc({
        level: 4,
        attributes: {
          agility: 2,
          strength: 3,
          finesse: 0,
          instinct: 0,
          presence: 1,
          knowledge: 0,
        },
        hitPoints: { current: 6, max: 6 },
        stress: { current: 0, max: 6 },
      });

      const result = engine.prepareData(doc);

      expect(result.system.evasion).toBe(12);
      expect(result.system.hitPoints.max).toBe(15);
      expect(result.system.stress.max).toBe(7);
    });
  });

  describe('rollCheck', () => {
    it('returns a with Hope result when the hope die beats the fear die', async () => {
      const randomSpy = vi.spyOn(Math, 'random').mockReturnValueOnce(0.75).mockReturnValueOnce(0.25);
      const doc = makeDoc({
        attributes: {
          ...createDefaultDaggerheartData().attributes,
          agility: 2,
        },
      });

      const result = await engine.rollCheck(doc, 'agility');

      expect(result.total).toBe(16);
      expect(result.formula).toBe('2d12 + 2 (agility)');
      expect(result.terms).toEqual([10, 4]);
      expect(result.isCritical).toBe(false);
      expect(result.isFumble).toBe(false);
      expect(result.flavor).toContain('with Hope');

      randomSpy.mockRestore();
    });

    it('flags critical success and fumble results for matching high and low dice', async () => {
      const highSpy = vi.spyOn(Math, 'random').mockReturnValueOnce(0.75).mockReturnValueOnce(0.75);
      const critSuccess = await engine.rollCheck(makeDoc(), 'presence');
      expect(critSuccess.isCritical).toBe(true);
      expect(critSuccess.flavor).toContain('Critical');
      highSpy.mockRestore();

      const lowSpy = vi.spyOn(Math, 'random').mockReturnValueOnce(0).mockReturnValueOnce(0);
      const critFail = await engine.rollCheck(makeDoc(), 'presence');
      expect(critFail.isFumble).toBe(true);
      expect(critFail.flavor).toContain('Critical');
      lowSpy.mockRestore();
    });
  });

  describe('applyDamage', () => {
    it('lets armor absorb normal damage before hit points', () => {
      const result = engine.applyDamage(
        makeDoc({
          armor: { current: 3, max: 3 },
          hitPoints: { current: 10, max: 10 },
        }),
        5,
        'physical'
      );

      expect(result.system.armor.current).toBe(0);
      expect(result.system.hitPoints.current).toBe(8);
    });

    it('tracks stress separately from normal damage and caps healing at max hp', () => {
      const stressed = engine.applyDamage(
        makeDoc({
          armor: { current: 2, max: 2 },
          stress: { current: 1, max: 6 },
          hitPoints: { current: 4, max: 6 },
        }),
        3,
        'stress'
      );
      expect(stressed.system.armor.current).toBe(2);
      expect(stressed.system.hitPoints.current).toBe(4);
      expect(stressed.system.stress.current).toBe(4);

      const healed = engine.applyDamage(stressed, 5, 'heal');
      expect(healed.system.hitPoints.current).toBe(6);
    });
  });
});
