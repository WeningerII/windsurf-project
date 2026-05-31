import { Dnd5eEngineBase } from '../dnd5e/shared/engine';
import { CharacterDocument } from '../../types/core/document';
import { Dnd5e2024DataModel } from './data-model';
import { abilityMod } from '../../utils/math';

export class Dnd5e2024Engine extends Dnd5eEngineBase {
  protected applySubsystemRules(doc: CharacterDocument<Dnd5e2024DataModel>, dexMod: number): void {
    super.applySubsystemRules(doc, dexMod);
    const data = doc.system;

    // In 2024, the Alert feat allows swapping DEX for INT on initiative
    const intMod = abilityMod(data.baseAttributes.int ?? 10);
    const hasAlertFeat = data.feats?.some((feat) => {
      const id = feat.id?.toLowerCase();
      const name = feat.name?.toLowerCase();
      return id === 'alert' || name === 'alert';
    });
    data.initiative = hasAlertFeat ? Math.max(dexMod, intMod) : dexMod;
  }

  protected applyInitiativeModifiers(
    doc: CharacterDocument<Dnd5e2024DataModel>,
    modifier: number
  ): number {
    const data = doc.system;
    const intMod = abilityMod(data.baseAttributes.int ?? 10);

    const hasAlertFeat = data.feats?.some((feat) => {
      const id = feat.id?.toLowerCase();
      const name = feat.name?.toLowerCase();
      return id === 'alert' || name === 'alert';
    });

    // Our shared applyInitiativeModifiers receives the already-computed 'modifier' (which is dexMod)
    return hasAlertFeat ? Math.max(modifier, intMod) : modifier;
  }

  protected getExhaustionD20Penalty(exhaustion: number): number {
    // 2024 exhaustion linearly subtracts its level from d20 rolls (levels 1-5)
    return -exhaustion;
  }

  protected isExhaustionLethal(exhaustion: number): boolean {
    return exhaustion >= 6; // Still lethal at 6
  }
}
