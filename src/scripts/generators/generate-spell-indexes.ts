#!/usr/bin/env tsx
// Script to generate all spell index files for D&D 5e-2014

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const schools = [
  'abjuration',
  'conjuration',
  'divination',
  'enchantment',
  'evocation',
  'illusion',
  'necromancy',
  'transmutation',
];
const levels = [
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
];

const baseDir = path.join(__dirname, '../../data/dnd/5e-2014/spells');

function createLevelIndex(level: string) {
  const levelDir = path.join(baseDir, level);
  const indexPath = path.join(levelDir, 'index.ts');

  const content = `// D&D 5e ${level.charAt(0).toUpperCase() + level.slice(1)} Spells

export * from './abjuration';
export * from './conjuration';
export * from './divination';
export * from './enchantment';
export * from './evocation';
export * from './illusion';
export * from './necromancy';
export * from './transmutation';
`;

  fs.writeFileSync(indexPath, content);
  console.log(`Created ${indexPath}`);
}

function createSchoolIndex(level: string, school: string) {
  const schoolDir = path.join(baseDir, level, school);
  const indexPath = path.join(schoolDir, 'index.ts');

  if (fs.existsSync(indexPath)) {
    console.log(`Skipping ${indexPath} (already exists)`);
    return;
  }

  const content = `// ${school.charAt(0).toUpperCase() + school.slice(1)} ${level === 'cantrips' ? 'Cantrips' : level.toUpperCase()}
import { Spell } from '../../../../../../types/magic/spells';

export const ${school}${level === 'cantrips' ? 'Cantrips' : level.replace('level-', 'Level')}Spells: Spell[] = [];
`;

  fs.writeFileSync(indexPath, content);
  console.log(`Created ${indexPath}`);
}

function createREADME(level: string, school: string) {
  const schoolDir = path.join(baseDir, level, school);
  const readmePath = path.join(schoolDir, 'README.md');

  const content = `# ${school.charAt(0).toUpperCase() + school.slice(1)} ${level === 'cantrips' ? 'Cantrips' : level.toUpperCase()} Spells

## How to Add a Spell

1. Create a new file: \`spell-name.ts\`
2. Export a Spell object following the type definition
3. Import it in \`index.ts\`
4. Add it to the exported array

Example:
\`\`\`typescript
// magic-missile.ts
import { Spell } from '../../../../../../types/magic/spells';

export const magicMissile: Spell = {
  id: 'magic-missile',
  name: 'Magic Missile',
  system: 'dnd-5e-2014',
  source: 'PHB',
  level: 1,
  school: 'evocation',
  // ... rest of spell data
};
\`\`\`

Then in \`index.ts\`:
\`\`\`typescript
import { magicMissile } from './magic-missile';

export const evocationLevel1Spells: Spell[] = [
  magicMissile,
];
\`\`\`
`;

  fs.writeFileSync(readmePath, content);
  console.log(`Created ${readmePath}`);
}

// Generate all files
console.log('Generating spell index files...\n');

for (const level of levels) {
  createLevelIndex(level);

  for (const school of schools) {
    createSchoolIndex(level, school);
    createREADME(level, school);
  }
}

console.log('\nDone! All spell index files generated.');
