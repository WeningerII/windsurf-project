#!/usr/bin/env tsx
// Script to generate a new spell file

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface SpellGeneratorOptions {
  system: string;
  edition: string;
  level: number;
  school: string;
  name: string;
  id?: string;
  source?: string;
  castingTime?: string;
  range?: string;
  components?: string;
  duration?: string;
  concentration?: boolean;
  ritual?: boolean;
  description?: string;
  classes?: string;
  damage?: string;
  savingThrow?: string;
  attackRoll?: boolean;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function generateSpellTemplate(options: SpellGeneratorOptions): string {
  const { name, id, level, school, system, edition } = options;
  const spellId = id || slugify(name);

  // Parse casting time
  const castingTime = parseCastingTime(options.castingTime || 'action');

  // Parse range
  const range = parseRange(options.range || (level === 0 ? '60' : '120'));

  // Parse components
  const components = parseComponents(options.components || 'V,S');

  // Parse duration
  const duration = parseDuration(options.duration || 'instant');

  // Parse classes
  const classes = options.classes
    ? options.classes
        .split(',')
        .map((c) => `'${c.trim()}'`)
        .join(', ')
    : '';

  // Build damage/effects section
  let effectsSection = '';
  if (options.damage) {
    const damageInfo = parseDamage(options.damage);
    effectsSection += `\n  damage: ${damageInfo},`;
  }
  if (options.savingThrow) {
    effectsSection += `\n  savingThrow: { attribute: '${options.savingThrow}', success: 'half' },`;
  }
  if (options.attackRoll) {
    effectsSection += `\n  attackRoll: true,`;
  }

  const description =
    options.description ||
    `A ${level === 0 ? 'cantrip' : `level ${level} spell`} from the school of ${school}.`;

  return `import { Spell } from '../../../../../../types/magic/spells';

export const ${spellId.replace(/-/g, '')}Spell: Spell = {
  id: '${spellId}',
  name: '${name}',
  system: '${system}${edition}',
  source: '${options.source || 'PHB'}',
  level: ${level},
  school: '${school}',
  
  castingTime: ${castingTime},
  range: ${range},
  components: ${components},
  duration: ${duration},
  
  concentration: ${options.concentration || false},
  ritual: ${options.ritual || false},
  
  description: '${description}',${effectsSection}
  
  classes: [${classes}],
};
`;
}

function parseAmount(value: string, fallback = 1): number {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
}

function parseCastingTime(time: string): string {
  if (time === 'action') return "{ type: 'action', amount: 1 }";
  if (time === 'bonus') return "{ type: 'bonus_action', amount: 1 }";
  if (time === 'reaction') return "{ type: 'reaction', amount: 1 }";
  if (time.includes('minute')) {
    const amount = parseAmount(time, 1);
    return `{ type: 'minutes', amount: ${amount} }`;
  }
  if (time.includes('hour')) {
    const amount = parseAmount(time, 1);
    return `{ type: 'hours', amount: ${amount} }`;
  }
  return "{ type: 'action', amount: 1 }";
}

function parseRange(range: string): string {
  if (range === 'self') return "{ type: 'self' }";
  if (range === 'touch') return "{ type: 'touch' }";
  if (range === 'sight') return "{ type: 'sight' }";
  if (range === 'unlimited') return "{ type: 'unlimited' }";
  const feet = parseInt(range);
  if (!isNaN(feet)) {
    return `{ type: 'ranged', feet: ${feet} }`;
  }
  return "{ type: 'ranged', feet: 60 }";
}

function parseComponents(components: string): string {
  const parts = components
    .toUpperCase()
    .split(',')
    .map((c) => c.trim());
  const verbal = parts.includes('V');
  const somatic = parts.includes('S');
  const hasMaterial = parts.includes('M');

  if (hasMaterial && components.includes('(')) {
    const materialMatch = components.match(/M\s*\(([^)]+)\)/);
    const material = materialMatch ? materialMatch[1] : '';
    return `{\n    verbal: ${verbal},\n    somatic: ${somatic},\n    material: true,\n    materialDescription: '${material}',\n  }`;
  }

  return `{\n    verbal: ${verbal},\n    somatic: ${somatic},\n    material: ${hasMaterial},\n  }`;
}

function parseDuration(duration: string): string {
  if (duration === 'instant' || duration === 'instantaneous') return "{ type: 'instant' }";
  if (duration.includes('round')) {
    const amount = parseAmount(duration, 1);
    return `{ type: 'rounds', amount: ${amount} }`;
  }
  if (duration.includes('minute')) {
    const amount = parseAmount(duration, 1);
    return `{ type: 'minutes', amount: ${amount} }`;
  }
  if (duration.includes('hour')) {
    const amount = parseAmount(duration, 1);
    return `{ type: 'hours', amount: ${amount} }`;
  }
  if (duration.includes('day')) {
    const amount = parseAmount(duration, 1);
    return `{ type: 'days', amount: ${amount} }`;
  }
  if (duration === 'permanent') return "{ type: 'permanent' }";
  if (duration === 'until-dispelled') return "{ type: 'until_dispelled' }";
  return "{ type: 'instant' }";
}

function parseDamage(damage: string): string {
  // Format: "3d6 fire" or "1d8+5 radiant"
  const match = damage.match(/(\d+)d(\d+)(?:\+(\d+))?\s+(\w+)/);
  if (match) {
    const [, count, die, bonus, type] = match;
    const notation = bonus ? `${count}d${die}+${bonus}` : `${count}d${die}`;
    return `{ base: { count: ${count}, die: 'd${die}', notation: '${notation}' }, type: '${type}' }`;
  }
  return `{ base: { count: 1, die: 'd8', notation: '1d8' }, type: 'force' }`;
}

function generateSpell(options: SpellGeneratorOptions): void {
  const { system, edition, level, school, name } = options;
  const spellId = options.id || slugify(name);

  // Construct paths
  const levelFolder = level === 0 ? 'cantrips' : `level-${level}`;
  const spellDir = path.join(
    __dirname,
    '../../data',
    system,
    edition,
    'spells',
    levelFolder,
    school
  );

  const spellFilePath = path.join(spellDir, `${spellId}.ts`);
  const indexPath = path.join(spellDir, 'index.ts');

  // Check if spell already exists
  if (fs.existsSync(spellFilePath)) {
    console.error(`Error: Spell file already exists: ${spellFilePath}`);
    process.exit(1);
  }

  // Ensure directory exists
  fs.mkdirSync(spellDir, { recursive: true });

  // Generate spell file
  const spellContent = generateSpellTemplate(options);
  fs.writeFileSync(spellFilePath, spellContent);
  console.log(`✓ Created spell file: ${spellFilePath}`);

  // Update index.ts
  if (fs.existsSync(indexPath)) {
    const indexContent = fs.readFileSync(indexPath, 'utf-8');
    const importStatement = `import { ${spellId.replace(/-/g, '')}Spell } from './${spellId}';`;
    const exportName = `${spellId.replace(/-/g, '')}Spell`;

    // Add import
    const lines = indexContent.split('\n');
    const importLineIndex = lines.findIndex((line) => line.startsWith('import'));
    if (importLineIndex >= 0) {
      lines.splice(importLineIndex + 1, 0, importStatement);
    } else {
      lines.unshift(importStatement);
    }

    // Add to array
    const arrayLineIndex = lines.findIndex((line) => line.includes('Spell[] = ['));
    if (arrayLineIndex >= 0) {
      lines[arrayLineIndex] = lines[arrayLineIndex].replace('[', `[\n  ${exportName},`);
    }

    fs.writeFileSync(indexPath, lines.join('\n'));
    console.log(`✓ Updated index: ${indexPath}`);
  }

  console.log(`\n✓ Spell "${name}" created successfully!`);
  console.log(`\nNext steps:`);
  console.log(`1. Edit ${spellFilePath}`);
  console.log(`2. Fill in spell details (description, effects, classes, etc.)`);
  console.log(`3. Test the spell in your application`);
}

// CLI handling
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help')) {
    console.log(`
Usage: npm run generate:spell -- --system dnd --edition 5e --level 1 --school evocation --name "Magic Missile"

Required Options:
  --system         Game system (dnd, pathfinder, etc.)
  --edition        Edition (5e-2014, 5e-2024, 3.5e, 1e, 2e, etc.)
  --level          Spell level (0-9)
  --school         Magic school (abjuration, conjuration, divination, enchantment,
                   evocation, illusion, necromancy, transmutation)
  --name           Spell name

Optional:
  --id             Custom ID (auto-generated from name if not provided)
  --source         Source book (default: PHB)
  --castingTime    Casting time: action, bonus, reaction, "1 minute", "1 hour"
  --range          Range: self, touch, sight, unlimited, or number in feet (e.g., 120)
  --components     Components: V, S, M, or combination like "V,S" or "V,S,M (a gem)"
  --duration       Duration: instant, permanent, "1 minute", "1 hour", "10 rounds"
  --concentration  true/false (default: false)
  --ritual         true/false (default: false)
  --description    Spell description text
  --classes        Comma-separated class list (e.g., "wizard,sorcerer")
  --damage         Damage dice and type (e.g., "3d6 fire" or "1d8+5 radiant")
  --savingThrow    Saving throw attribute (str, dex, con, int, wis, cha)
  --attackRoll     true/false for attack roll spells

Examples:
  npm run generate:spell -- --system dnd --edition 5e-2014 --level 1 --school evocation \\
    --name "Magic Missile" --range 120 --components V,S --classes wizard,sorcerer \\
    --damage "1d4+1 force" --description "You create three darts of force"

  npm run generate:spell -- --system dnd --edition 5e-2014 --level 3 --school evocation \\
    --name "Fireball" --range 150 --duration instant --damage "8d6 fire" \\
    --savingThrow dex --classes wizard,sorcerer
    `);
    process.exit(0);
  }

  const options: Partial<SpellGeneratorOptions> = {};

  for (let i = 0; i < args.length; i += 2) {
    const key = args[i].replace('--', '') as keyof SpellGeneratorOptions;
    const value = args[i + 1];

    if (key === 'level') {
      options.level = parseInt(value);
    } else if (key === 'concentration' || key === 'ritual' || key === 'attackRoll') {
      options[key] = value.toLowerCase() === 'true';
    } else {
      options[key] = value as never;
    }
  }

  if (
    !options.system ||
    !options.edition ||
    options.level === undefined ||
    !options.school ||
    !options.name
  ) {
    console.error('Error: Missing required arguments');
    console.error('Run with --help for usage information');
    process.exit(1);
  }

  generateSpell(options as SpellGeneratorOptions);
}

export { generateSpell };
