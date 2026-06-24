import { describe, expect, it } from 'vitest';
import { getDnd5eTemplateChoiceState } from '../systems/dnd5e/shared/getDnd5eTemplateChoiceState';
import { createDefaultDnd5eData, type Dnd5eDataModel } from '../systems/dnd5e/data-model';
import { halfElf } from '../data/dnd/5e-2014/species/half-elf';
import { dwarf } from '../data/dnd/5e-2014/species/dwarf';
import { acolyte } from '../data/dnd/5e-2014/backgrounds/acolyte';
import { criminal } from '../data/dnd/5e-2024/backgrounds/criminal';

/**
 * getDnd5eTemplateChoiceState is the pure projection that turns a character's
 * stored selections + the selected species/background into the dropdown slot
 * models the sheet renders. These tests anchor each slot type to the real
 * loader data (Half-Elf ability/language/skill choices, Dwarf tool choice,
 * Acolyte background languages) and exercise the "retained proficiency"
 * filtering that hides options the character already has from another source.
 */

describe('getDnd5eTemplateChoiceState', () => {
  it('returns empty slot arrays when no species or background is selected', () => {
    const state = getDnd5eTemplateChoiceState({ system: createDefaultDnd5eData() });

    expect(state.speciesAbilitySlots).toEqual([]);
    expect(state.speciesLanguageSlots).toEqual([]);
    expect(state.speciesSkillSlots).toEqual([]);
    expect(state.speciesToolSlots).toEqual([]);
    expect(state.backgroundFixedTools).toEqual([]);
    expect(state.backgroundToolSlots).toEqual([]);
    expect(state.backgroundLanguageSlots).toEqual([]);
  });

  it('builds Half-Elf ability/language/skill slots and blocks duplicate ability picks', () => {
    const system: Dnd5eDataModel = {
      ...createDefaultDnd5eData(),
      speciesId: 'half-elf',
      // Two ability picks: str already chosen in slot 0.
      speciesAbilitySelections: ['str', ''],
      speciesLanguageSelections: ['Draconic'],
      speciesSkillSelections: ['arcana', ''],
    };

    const state = getDnd5eTemplateChoiceState({ system, selectedSpecies: halfElf });

    // Half-Elf grants two free ability bumps.
    expect(state.speciesAbilitySlots).toHaveLength(2);
    expect(state.speciesAbilitySlots[0]).toMatchObject({ slotIndex: 0, value: 'str' });
    // The second slot must not offer 'str' again (blocked by the slot-0 pick).
    expect(state.speciesAbilitySlots[1].options).not.toContain('str');
    expect(state.speciesAbilitySlots[1].options).toContain('dex');

    // One additional-language slot; its current value is preserved.
    expect(state.speciesLanguageSlots).toHaveLength(1);
    expect(state.speciesLanguageSlots[0].value).toBe('Draconic');

    // Skill Versatility -> two skill slots.
    expect(state.speciesSkillSlots).toHaveLength(2);
    expect(state.speciesSkillSlots[0].value).toBe('arcana');
    // Slot 1 must not re-offer the slot-0 skill.
    expect(state.speciesSkillSlots[1].options).not.toContain('arcana');
  });

  it('hides species languages/skills already retained from other sources', () => {
    const system: Dnd5eDataModel = {
      ...createDefaultDnd5eData(),
      speciesId: 'half-elf',
      // "Elvish" is a Half-Elf automatic language -> excluded from the choice;
      // "Goblin" is retained from elsewhere (not a species selection) -> hidden.
      languageProficiencies: ['Elvish', 'Goblin'],
      speciesLanguageSelections: [''],
      // A skill proficiency whose source is NOT the species is "retained" and
      // therefore filtered out of the species skill options (covers line 109).
      skillProficiencies: {
        stealth: { level: 'proficient', source: ['Background'] },
      },
      speciesSkillSelections: ['', ''],
    };

    const state = getDnd5eTemplateChoiceState({ system, selectedSpecies: halfElf });

    // Goblin is retained -> must not appear as a selectable language option.
    expect(state.speciesLanguageSlots[0].options).not.toContain('Goblin');
    // Stealth came from another source -> excluded from species skill options.
    expect(state.speciesSkillSlots[0].options).not.toContain('stealth');
    expect(state.speciesSkillSlots[0].options).toContain('acrobatics');
  });

  it('builds a Dwarf tool slot and excludes tools the character already retains', () => {
    const system: Dnd5eDataModel = {
      ...createDefaultDnd5eData(),
      speciesId: 'dwarf',
      // "masons-tools" is retained (not a species selection) -> filtered out of
      // the tool options (covers the species tool-slot block, lines 113-132).
      toolProficiencies: ['masons-tools'],
      speciesToolSelections: ['smiths-tools'],
    };

    const state = getDnd5eTemplateChoiceState({ system, selectedSpecies: dwarf });

    expect(state.speciesToolSlots).toHaveLength(1);
    expect(state.speciesToolSlots[0].value).toBe('smiths-tools');
    // The retained masons-tools is hidden; the current value stays available.
    expect(state.speciesToolSlots[0].options).not.toContain('masons-tools');
    expect(state.speciesToolSlots[0].options).toContain('smiths-tools');
  });

  it('builds Acolyte background language slots, numbering multiple slots', () => {
    const system: Dnd5eDataModel = {
      ...createDefaultDnd5eData(),
      backgroundId: 'acolyte',
      backgroundLanguageSelections: ['Draconic', ''],
    };

    const state = getDnd5eTemplateChoiceState({ system, selectedBackground: acolyte });

    // Acolyte grants two "any" language choices.
    expect(state.backgroundLanguageSlots).toHaveLength(2);
    expect(state.backgroundLanguageSlots[0]).toMatchObject({ slotIndex: 0, value: 'Draconic' });
    // Multi-slot labels are numbered.
    expect(state.backgroundLanguageSlots[0].label).toMatch(/ 1$/);
    expect(state.backgroundLanguageSlots[1].label).toMatch(/ 2$/);
    // Slot 1 must not re-offer the slot-0 selection.
    expect(state.backgroundLanguageSlots[1].options).not.toContain('Draconic');
    // Acolyte has no tool choices -> the tool slot list is empty.
    expect(state.backgroundToolSlots).toEqual([]);
  });

  it('builds background tool slots and hides tools the character already retains', () => {
    // Criminal (2024) grants thieves' tools (fixed) + one gaming set (a choice).
    const system: Dnd5eDataModel = {
      ...createDefaultDnd5eData(),
      backgroundId: 'criminal-2024',
      backgroundToolSelections: ['dice-set'],
      // A gaming-set tool retained from elsewhere is hidden from the options,
      // while a fixed background tool stays in the "known" set too.
      toolProficiencies: ['playing-card-set'],
      templateState: {
        ...createDefaultDnd5eData().templateState!,
        backgroundDerived: { tools: [], languages: [] },
      },
    };

    const state = getDnd5eTemplateChoiceState({ system, selectedBackground: criminal });

    expect(state.backgroundFixedTools).toContain('thieves-tools');
    expect(state.backgroundToolSlots.length).toBeGreaterThan(0);
    const gamingSlot = state.backgroundToolSlots[0];
    expect(gamingSlot.value).toBe('dice-set');
    // The retained gaming-set tool is filtered out of the selectable options.
    expect(gamingSlot.options).not.toContain('playing-card-set');
    // The currently-selected value is always retained as an option.
    expect(gamingSlot.options).toContain('dice-set');
  });
});
