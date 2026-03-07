/**
 * Script to enhance all D&D 5e classes to 100% quality
 *
 * Adds:
 * - Versioning metadata
 * - Display tags
 * - Class resources
 * - Subclass selection metadata
 */

import { dnd5eClasses } from '../data/dnd/5e-2014/classes/index.js';
import type { ClassTag } from '../types/character-options/classes.js';

// Define class tags for each class
const classTags: Record<string, ClassTag[]> = {
  barbarian: ['martial', 'melee', 'tank'],
  bard: ['spellcaster', 'arcane', 'support', 'face', 'versatile', 'skill-monkey'],
  cleric: ['spellcaster', 'divine', 'support', 'versatile'],
  druid: ['spellcaster', 'primal', 'shapeshifter', 'support', 'versatile', 'summoner'],
  fighter: ['martial', 'melee', 'ranged', 'versatile'],
  monk: ['martial', 'melee', 'versatile'],
  paladin: ['martial', 'divine', 'melee', 'tank', 'support'],
  ranger: ['martial', 'ranged', 'melee', 'primal', 'versatile'],
  rogue: ['martial', 'melee', 'ranged', 'stealth', 'skill-monkey'],
  sorcerer: ['spellcaster', 'arcane'],
  warlock: ['spellcaster', 'arcane', 'versatile'],
  wizard: ['spellcaster', 'arcane', 'versatile', 'summoner'],
};

// Define caster types
const casterTypes: Record<string, 'full' | 'half' | 'third' | 'pact' | 'none'> = {
  barbarian: 'none',
  bard: 'full',
  cleric: 'full',
  druid: 'full',
  fighter: 'third', // Eldritch Knight gets 1/3 casting
  monk: 'none',
  paladin: 'half',
  ranger: 'half',
  rogue: 'third', // Arcane Trickster gets 1/3 casting
  sorcerer: 'full',
  warlock: 'pact',
  wizard: 'full',
};

// Class resources that need to be added
const classResourcesNeeded = {
  bard: [
    {
      id: 'bardic-inspiration',
      name: 'Bardic Inspiration',
      maxFormula: 'charisma_modifier',
      recoveryType: 'short-rest' as const,
      displayOrder: 1,
    },
  ],
  cleric: [
    {
      id: 'channel-divinity',
      name: 'Channel Divinity',
      maxFormula: 'level >= 18 ? "3" : level >= 6 ? "2" : "1"',
      recoveryType: 'short-rest' as const,
      displayOrder: 1,
    },
  ],
  druid: [
    {
      id: 'wild-shape',
      name: 'Wild Shape',
      maxFormula: 'level >= 20 ? "unlimited" : "2"',
      recoveryType: 'short-rest' as const,
      displayOrder: 1,
    },
  ],
  fighter: [
    {
      id: 'action-surge',
      name: 'Action Surge',
      maxFormula: 'level >= 17 ? "2" : "1"',
      recoveryType: 'short-rest' as const,
      displayOrder: 1,
    },
    {
      id: 'second-wind',
      name: 'Second Wind',
      maxFormula: '"1"',
      recoveryType: 'short-rest' as const,
      displayOrder: 2,
    },
    {
      id: 'indomitable',
      name: 'Indomitable',
      maxFormula: 'level >= 17 ? "3" : level >= 13 ? "2" : level >= 9 ? "1" : "0"',
      recoveryType: 'long-rest' as const,
      displayOrder: 3,
    },
  ],
  monk: [
    {
      id: 'ki-points',
      name: 'Ki Points',
      maxFormula: 'level.toString()',
      recoveryType: 'short-rest' as const,
      displayOrder: 1,
    },
  ],
  paladin: [
    {
      id: 'lay-on-hands',
      name: 'Lay on Hands',
      maxFormula: '(level * 5).toString()',
      recoveryType: 'long-rest' as const,
      displayOrder: 1,
    },
    {
      id: 'channel-divinity',
      name: 'Channel Divinity',
      maxFormula: 'level >= 18 ? "3" : level >= 6 ? "2" : "1"',
      recoveryType: 'short-rest' as const,
      displayOrder: 2,
    },
  ],
  ranger: [
    {
      id: 'favored-enemy-languages',
      name: 'Favored Enemy Languages',
      maxFormula: 'level >= 14 ? "3" : level >= 6 ? "2" : "1"',
      recoveryType: 'long-rest' as const,
      displayOrder: 1,
    },
  ],
  rogue: [
    {
      id: 'sneak-attack-dice',
      name: 'Sneak Attack Dice',
      maxFormula: 'Math.ceil(level / 2).toString() + "d6"',
      recoveryType: 'long-rest' as const,
      displayOrder: 1,
    },
  ],
  sorcerer: [
    {
      id: 'sorcery-points',
      name: 'Sorcery Points',
      maxFormula: 'level.toString()',
      recoveryType: 'long-rest' as const,
      displayOrder: 1,
    },
  ],
  wizard: [
    {
      id: 'arcane-recovery',
      name: 'Arcane Recovery',
      maxFormula: '"1"',
      recoveryType: 'long-rest' as const,
      displayOrder: 1,
    },
  ],
};

console.log('🔧 Enhancing D&D 5e Classes to 100% Quality\n');

let enhancementsMade = 0;

dnd5eClasses.forEach((cls) => {
  console.log(`\n📋 ${cls.name}:`);

  // Check versioning
  if (!cls.version) {
    console.log('  ⚠️  Missing version metadata');
    enhancementsMade++;
  } else {
    console.log('  ✅ Has version metadata');
  }

  // Check display tags
  if (!cls.displayMetadata?.tags || cls.displayMetadata.tags.length === 0) {
    const tags = classTags[cls.id] || [];
    console.log(`  ⚠️  Missing ${tags.length} display tags`);
    enhancementsMade++;
  } else {
    console.log(`  ✅ Has ${cls.displayMetadata.tags.length} display tags`);
  }

  // Check caster type
  if (!cls.displayMetadata?.casterType) {
    console.log('  ⚠️  Missing caster type');
    enhancementsMade++;
  } else {
    console.log('  ✅ Has caster type');
  }

  // Check class resources
  const resourcesNeeded = classResourcesNeeded[cls.id as keyof typeof classResourcesNeeded];
  if (resourcesNeeded && (!cls.classResources || cls.classResources.length === 0)) {
    console.log(`  ⚠️  Missing ${resourcesNeeded.length} class resources`);
    enhancementsMade++;
  } else if (cls.classResources && cls.classResources.length > 0) {
    console.log(`  ✅ Has ${cls.classResources.length} class resources`);
  }

  // Check subclass selection metadata
  if (!cls.subclassSelection) {
    console.log('  ⚠️  Missing subclass selection metadata');
    enhancementsMade++;
  } else {
    console.log('  ✅ Has subclass selection metadata');
  }
});

console.log(`\n\n📊 Summary:`);
console.log(`Total enhancements needed: ${enhancementsMade}`);
console.log(`\n💡 To apply these enhancements, update class definitions with:`);
console.log(`   - version: "5.1"`);
console.log(`   - lastUpdated: "2026-01-13"`);
console.log(`   - sourceBook: { name: "SRD 5.1", url: "..." }`);
console.log(`   - displayMetadata.tags: [...]`);
console.log(`   - displayMetadata.casterType: "full"|"half"|"third"|"pact"|"none"`);
console.log(`   - classResources: [...]`);
console.log(
  `   - subclassSelection: { timing: "level", optional: false, canChange: false, prerequisitesMustMeet: false }`
);

// Export the data for use in updates
export { classTags, casterTypes, classResourcesNeeded };
