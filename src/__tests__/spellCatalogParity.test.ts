import { describe, expect, it } from 'vitest';
import * as dnd5e2014SpellsModule from '../data/dnd/5e-2014/spells';
import * as dnd5e2024SpellsModule from '../data/dnd/5e-2024/spells';
import * as dnd35eSpellsModule from '../data/dnd/3.5e/spells';
import * as pf1eSpellsModule from '../data/pathfinder/1e/spells';
import * as pf2eSpellsModule from '../data/pathfinder/2e/spells';

const spellModules = [
  dnd5e2014SpellsModule,
  dnd5e2024SpellsModule,
  dnd35eSpellsModule,
  pf1eSpellsModule,
  pf2eSpellsModule,
];

describe('Spell Catalog Parity', () => {
  spellModules.forEach((spellModule) => {
    describe(spellModule.allSpells[0]?.system ?? 'unknown', () => {
      it('exports the shared helper surface', () => {
        expect(Array.isArray(spellModule.allSpells)).toBe(true);
        expect(typeof spellModule.spellsByLevel).toBe('object');
        expect(typeof spellModule.spellsById).toBe('object');
        expect(typeof spellModule.spellsByClass).toBe('object');
        expect(typeof spellModule.spellsBySchool).toBe('object');
        expect(typeof spellModule.spellStats).toBe('object');
        expect(typeof spellModule.spellIdAliases).toBe('object');
        expect(typeof spellModule.getSpell).toBe('function');
        expect('spellsByClassAndLevel' in spellModule).toBe(true);
      });

      it('keeps stats aligned with the canonical spell list', () => {
        expect(spellModule.spellStats.total).toBe(spellModule.allSpells.length);
        expect(
          Object.values(spellModule.spellsByLevel).reduce((sum, spells) => sum + spells.length, 0)
        ).toBe(spellModule.allSpells.length);
      });
    });
  });
});
