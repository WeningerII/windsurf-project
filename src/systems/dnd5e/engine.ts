import { Dnd5eEngineBase } from './shared/engine';

export class Dnd5eEngine extends Dnd5eEngineBase {
  protected applyExhaustionMaxHP(exhaustion: number, maxHP: number): number {
    if (exhaustion >= 4) {
      // 2014 exhaustion level 4: hit point maximum is halved.
      return Math.max(1, Math.floor(maxHP / 2));
    }
    return maxHP;
  }

  protected isExhaustionLethal(exhaustion: number): boolean {
    return exhaustion >= 6; // 2014 exhaustion level 6: death.
  }

  protected getExhaustionSkillPenalty(exhaustion: number): boolean {
    return exhaustion >= 1; // 2014 level 1: Disadvantage on ability checks
  }

  protected getExhaustionSavePenalty(exhaustion: number): boolean {
    return exhaustion >= 3; // 2014 level 3: Disadvantage on saving throws
  }
}
