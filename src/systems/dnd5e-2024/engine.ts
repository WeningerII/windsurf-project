import { Dnd5eEngineBase, profBonus } from '../dnd5e/shared/engine';
import { CharacterDocument } from '../../types/core/document';
import { Dnd5e2024DataModel } from './data-model';
import type { Dnd5eRulesEdition } from '../../utils/spellSlots';

function hasAlertFeat(data: Dnd5e2024DataModel): boolean {
  return Boolean(
    data.feats?.some((feat) => {
      const id = feat.id?.toLowerCase();
      const name = feat.name?.toLowerCase();
      return id === 'alert' || name === 'alert';
    })
  );
}

function totalCharacterLevel(data: Dnd5e2024DataModel): number {
  return data.classLevels.length > 0
    ? data.classLevels.reduce((sum, cl) => sum + cl.level, 0)
    : data.level;
}

export class Dnd5e2024Engine extends Dnd5eEngineBase {
  protected getRulesEdition(): Dnd5eRulesEdition {
    return '2024';
  }

  protected applySubsystemRules(doc: CharacterDocument<Dnd5e2024DataModel>, dexMod: number): void {
    super.applySubsystemRules(doc, dexMod);
    const data = doc.system;

    // SRD 5.2 Alert feat — "Initiative Proficiency: Add your Proficiency
    // Bonus to Initiative rolls." (No Dex/Int swap; that was a homebrew
    // misreading.) data.level already holds the total character level here.
    data.initiative = dexMod + (hasAlertFeat(data) ? profBonus(totalCharacterLevel(data)) : 0);
  }

  protected applyInitiativeModifiers(
    doc: CharacterDocument<Dnd5e2024DataModel>,
    modifier: number
  ): number {
    const data = doc.system;

    // Shared applyInitiativeModifiers receives the already-computed Dex mod;
    // SRD 5.2 Alert adds the Proficiency Bonus on top.
    return modifier + (hasAlertFeat(data) ? profBonus(totalCharacterLevel(data)) : 0);
  }

  protected getExhaustionD20Penalty(exhaustion: number): number {
    // 2024 exhaustion (SRD 5.2): each level imposes a -2 penalty on all d20 Tests.
    return -2 * exhaustion;
  }

  protected isExhaustionLethal(exhaustion: number): boolean {
    return exhaustion >= 6; // Still lethal at 6
  }
}
