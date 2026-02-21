import { SystemEngine, RollResult } from '../../registry/types';
import { CharacterDocument } from '../../types/core/document';
import { Mam3eDataModel } from './data-model';

/**
 * M&M 3e Logic Engine
 * Handles Point Buy calculations and PL limits.
 */
export class Mam3eEngine implements SystemEngine<Mam3eDataModel> {
  
  prepareData(document: CharacterDocument<Mam3eDataModel>): CharacterDocument<Mam3eDataModel> {
    const data = document.system;
    
    // 1. Calculate Ability Costs (2 PP per rank)
    let abilityCost = 0;
    Object.values(data.abilities).forEach(rank => {
      abilityCost += rank * 2;
    });
    data.powerPoints.spent.abilities = abilityCost;

    // 2. Calculate Defense Totals & Costs
    // Defense Base = Ability + Purchased Rank
    // Dodge (Agi), Parry (Fgt), Fort (Sta), Will (Awe), Toughness (Sta + Powers)
    
    // Note: This is a simplified calculation for the pilot.
    // In a full implementation, we'd loop through powers to find "Enhanced Trait" effects.
    data.defenses.dodge.total = data.abilities.agi + data.defenses.dodge.rank;
    data.defenses.parry.total = data.abilities.fgt + data.defenses.parry.rank;
    data.defenses.fortitude.total = data.abilities.sta + data.defenses.fortitude.rank;
    data.defenses.will.total = data.abilities.awe + data.defenses.will.rank;
    data.defenses.toughness.total = data.abilities.sta + data.defenses.toughness.rank; // + Protection power
    
    const defenseRankCost = 
      data.defenses.dodge.rank + 
      data.defenses.parry.rank + 
      data.defenses.fortitude.rank + 
      data.defenses.will.rank; // Toughness rank is usually from Powers (Protection) or Advantages (Defensive Roll)
      
    data.powerPoints.spent.defenses = defenseRankCost;

    // 3. Power Costs
    // Base Cost * Rank + Flat Extras - Flat Flaws
    let powerCost = 0;
    data.powers.forEach(power => {
      // Basic flat cost estimation for now
      // In reality: (Base * Rank) + Extras - Flaws
      // For the pilot, we assume baseCost is the total calculated cost stored on the item
      powerCost += power.baseCost || 0; 
    });
    data.powerPoints.spent.powers = powerCost;

    return document;
  }

  async rollCheck(document: CharacterDocument<Mam3eDataModel>, checkId: string): Promise<RollResult> {
    // M&M uses d20 + Mod
    const d20 = Math.floor(Math.random() * 20) + 1;
    let mod = 0;

    // Simple mapping for pilot
    if (checkId in document.system.abilities) {
      mod = document.system.abilities[checkId as keyof typeof document.system.abilities];
    }

    return {
      total: d20 + mod,
      formula: `1d20 + ${mod}`,
      terms: [d20, mod]
    };
  }

  applyDamage(document: CharacterDocument<Mam3eDataModel>, _amount: number, _type: string): CharacterDocument<Mam3eDataModel> {
    // M&M doesn't have HP! It uses Toughness saves vs Damage Rank.
    // This method is less relevant for M&M, usually we'd add a 'condition' (Bruised, Staggered).
    console.warn("M&M 3e uses Damage Saves, not HP damage.");
    return document;
  }
}
