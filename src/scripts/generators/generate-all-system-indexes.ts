#!/usr/bin/env tsx
// Script to generate ALL index files for ALL game systems

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const baseDir = path.join(__dirname, '../../data');

// D&D 5e-2014 structure (already done, but for completeness)
const dnd5eConfig = {
  path: path.join(baseDir, 'dnd/5e-2014/spells'),
  levels: [
    'cantrips',
    'level-1',
    'level-2',
    'level-3',
    'level-4',
    'level-5',
    'level-6',
    'level-7',
    'level-8',
    'level-9',
  ],
  schools: [
    'abjuration',
    'conjuration',
    'divination',
    'enchantment',
    'evocation',
    'illusion',
    'necromancy',
    'transmutation',
  ],
  type: 'school',
};
void dnd5eConfig;

// Pathfinder 2e structure
const pf2eConfig = {
  path: path.join(baseDir, 'pathfinder/2e/spells'),
  levels: [
    'cantrips',
    'level-1',
    'level-2',
    'level-3',
    'level-4',
    'level-5',
    'level-6',
    'level-7',
    'level-8',
    'level-9',
    'level-10',
  ],
  traditions: ['arcane', 'divine', 'occult', 'primal'],
  type: 'tradition',
};

// Pathfinder 1e structure
const pf1eConfig = {
  path: path.join(baseDir, 'pathfinder/1e/spells'),
  levels: [
    'level-0',
    'level-1',
    'level-2',
    'level-3',
    'level-4',
    'level-5',
    'level-6',
    'level-7',
    'level-8',
    'level-9',
  ],
  schools: [
    'abjuration',
    'conjuration',
    'divination',
    'enchantment',
    'evocation',
    'illusion',
    'necromancy',
    'transmutation',
  ],
  type: 'school',
};

// D&D 3.5e spells now use flat per-level files (5e-2014 style).
// This generator intentionally skips 3.5e to avoid recreating legacy folders.

// M&M 3e structure (powers instead of spells)
const mm3eConfig = {
  path: path.join(baseDir, 'mutants-and-masterminds/3e/powers'),
  types: ['attack', 'defense', 'movement', 'sensory', 'general'],
};

function createDirectory(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created ${dirPath}`);
  }
}

function createLevelIndexForSchools(
  level: string,
  schools: string[],
  systemPath: string,
  systemName: string
): void {
  const levelDir = path.join(systemPath, level);
  const indexPath = path.join(levelDir, 'index.ts');

  createDirectory(levelDir);

  // Create index that exports all schools
  const indexContent = `// ${systemName} ${level.charAt(0).toUpperCase() + level.slice(1)} Spells\n\n${schools.map((school) => `export * from './${school}';`).join('\n')}\n`;
  fs.writeFileSync(indexPath, indexContent);
  console.log(`Created ${indexPath}`);

  // Create each school folder with index and README
  schools.forEach((school) => {
    const schoolDir = path.join(levelDir, school);
    const schoolIndexPath = path.join(schoolDir, 'index.ts');
    const schoolReadmePath = path.join(schoolDir, 'README.md');

    createDirectory(schoolDir);

    // School index - use unique export name per level
    const levelName = level.replace(/-/g, ''); // e.g., "level1" or "cantrips"
    const schoolIndexContent = `// ${school.charAt(0).toUpperCase() + school.slice(1)} spells for ${level} (${systemName})
import { Spell } from '../../../../../../types/magic/spells';

export const ${school}${levelName.charAt(0).toUpperCase() + levelName.slice(1)}Spells: Spell[] = [];
`;
    fs.writeFileSync(schoolIndexPath, schoolIndexContent);

    // School README
    const readmeContent = `# ${school.charAt(0).toUpperCase() + school.slice(1)} Spells - ${level}

Add ${school} spells for ${level} here.

## File Naming Convention
\`spell-name.ts\` (e.g., \`shield.ts\`, \`magic-missile.ts\`)

## Template
\`\`\`typescript
import { Spell } from '../../../../../../types/magic/spells';

export const spellName: Spell = {
  id: '${systemName.toLowerCase().replace(/\\s+/g, '-')}-spell-name',
  name: 'Spell Name',
  level: ${level === 'cantrips' || level === 'level-0' ? 0 : parseInt(level.split('-')[1])},
  school: '${school}',
  // ... rest of spell properties
};
\`\`\`

## Adding to Index
After creating a spell, import and add it to the array in \`index.ts\`:
\`\`\`typescript
import { spellName } from './spell-name';
const levelName = '${level}'.replace(/-/g, '');
export const ${school}${levelName.charAt(0).toUpperCase() + levelName.slice(1)}Spells: Spell[] = [spellName];
\`\`\`
`;
    fs.writeFileSync(schoolReadmePath, readmeContent);
  });
}

function createLevelIndexForTraditions(
  level: string,
  traditions: string[],
  systemPath: string,
  systemName: string
): void {
  const levelDir = path.join(systemPath, level);
  const indexPath = path.join(levelDir, 'index.ts');

  createDirectory(levelDir);

  // Create index that exports all traditions
  const indexContent = `// ${systemName} ${level.charAt(0).toUpperCase() + level.slice(1)} Spells\n\n${traditions.map((tradition) => `export * from './${tradition}';`).join('\n')}\n`;
  fs.writeFileSync(indexPath, indexContent);
  console.log(`Created ${indexPath}`);

  // Create each tradition folder with index and README
  traditions.forEach((tradition) => {
    const traditionDir = path.join(levelDir, tradition);
    const traditionIndexPath = path.join(traditionDir, 'index.ts');
    const traditionReadmePath = path.join(traditionDir, 'README.md');

    createDirectory(traditionDir);

    // Tradition index - use unique export name per level
    const levelName = level.replace(/-/g, ''); // e.g., "level1" or "cantrips"
    const traditionIndexContent = `// ${tradition.charAt(0).toUpperCase() + tradition.slice(1)} spells for ${level} (${systemName})
import { Spell } from '../../../../../../types/magic/spells';

export const ${tradition}${levelName.charAt(0).toUpperCase() + levelName.slice(1)}Spells: Spell[] = [];
`;
    fs.writeFileSync(traditionIndexPath, traditionIndexContent);

    // Tradition README
    const readmeContent = `# ${tradition.charAt(0).toUpperCase() + tradition.slice(1)} Spells - ${level}

Add ${tradition} tradition spells for ${level} here.

## File Naming Convention
\`spell-name.ts\` (e.g., \`magic-missile.ts\`)

## Template
\`\`\`typescript
import { Spell } from '../../../../../../types/magic/spells';

export const spellName: Spell = {
  id: 'pf2e-spell-name',
  name: 'Spell Name',
  level: ${level === 'cantrips' ? 0 : parseInt(level.split('-')[1])},
  tradition: '${tradition}',
  // ... rest of spell properties
};
\`\`\`
`;
    fs.writeFileSync(traditionReadmePath, readmeContent);
  });
}

function createPowerTypeIndex(type: string, systemPath: string): void {
  const typeDir = path.join(systemPath, type);
  const indexPath = path.join(typeDir, 'index.ts');
  const readmePath = path.join(typeDir, 'README.md');

  createDirectory(typeDir);

  // Type index
  const indexContent = `// ${type.charAt(0).toUpperCase() + type.slice(1)} Powers (M&M 3e)
// Powers used primarily for ${type} capabilities

export const ${type}Powers = [];
`;
  fs.writeFileSync(indexPath, indexContent);
  console.log(`Created ${indexPath}`);

  // README
  const readmeContent = `# ${type.charAt(0).toUpperCase() + type.slice(1)} Powers

Add ${type} powers here.

## File Naming Convention
\`power-name.ts\` (e.g., \`blast.ts\`, \`flight.ts\`)

## Template
\`\`\`typescript
export const powerName = {
  id: 'mm3e-power-name',
  name: 'Power Name',
  type: '${type}',
  cost: 1, // Points per rank
  // ... rest of power properties
};
\`\`\`
`;
  fs.writeFileSync(readmePath, readmeContent);
}

// Main execution
console.log('🚀 Generating indexes for all game systems...\n');

// Pathfinder 2e
console.log('📘 Pathfinder 2e...');
pf2eConfig.levels.forEach((level) => {
  createLevelIndexForTraditions(level, pf2eConfig.traditions, pf2eConfig.path, 'Pathfinder 2e');
});

// Pathfinder 1e
console.log('\n📕 Pathfinder 1e...');
pf1eConfig.levels.forEach((level) => {
  createLevelIndexForSchools(level, pf1eConfig.schools, pf1eConfig.path, 'Pathfinder 1e');
});

// M&M 3e
console.log('\n📙 Mutants & Masterminds 3e...');
mm3eConfig.types.forEach((type) => {
  createPowerTypeIndex(type, mm3eConfig.path);
});

console.log('\n✅ Done! All system indexes generated.');
console.log('\n📊 Summary:');
console.log(
  `   Pathfinder 2e: ${pf2eConfig.levels.length} levels × ${pf2eConfig.traditions.length} traditions = ${pf2eConfig.levels.length * pf2eConfig.traditions.length} folders`
);
console.log(
  `   Pathfinder 1e: ${pf1eConfig.levels.length} levels × ${pf1eConfig.schools.length} schools = ${pf1eConfig.levels.length * pf1eConfig.schools.length} folders`
);
console.log(`   M&M 3e: ${mm3eConfig.types.length} power types`);
console.log(
  `\n   Total new folders: ${pf2eConfig.levels.length * pf2eConfig.traditions.length + pf1eConfig.levels.length * pf1eConfig.schools.length + mm3eConfig.types.length}`
);
