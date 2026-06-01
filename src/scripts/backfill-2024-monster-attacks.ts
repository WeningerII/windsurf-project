/**
 * Codemod: backfill structured attack fields into D&D 5e-2024 monster data.
 *
 * Many 5e-2024 statblocks carry attack/damage ONLY in the action description
 * prose (no structured attackBonus/damage[] fields). At runtime the combat
 * adapter parses that prose (monsterCombatant.normalizeAttack), but depending on
 * a regex at runtime is fragile. This script makes the derivation durable: it
 * runs the SAME parser over every 2024 action and writes the structured fields
 * back into the source, so the data is the source of truth and the parser stays
 * a safety net.
 *
 * It edits action objects in place by locating each `{ name, description }`
 * block and inserting the derived fields after the description. Actions that do
 * not normalize to an attack (Multiattack, non-attack abilities) are left
 * untouched, and an action that ALREADY has structured fields is skipped.
 *
 * Usage:
 *   tsx src/scripts/backfill-2024-monster-attacks.ts            # dry run (report only)
 *   tsx src/scripts/backfill-2024-monster-attacks.ts --write    # apply edits
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { join } from 'node:path';
import { dnd5e2024Monsters } from '../data/dnd/5e-2024/monsters';
import { parseAttackFromDescription } from '../rules/combatants/monsterCombatant';
import type { Action, Monster } from '../types/creatures/monsters';

const WRITE = process.argv.includes('--write');
const MONSTERS_DIR = join(process.cwd(), 'src/data/dnd/5e-2024/monsters');

interface PlannedEdit {
  monsterId: string;
  actionName: string;
  attackBonus: number;
  reachFeet: number;
  damage: Array<{ count: number; faces: number; modifier: number; type: string }>;
}

/** Build the structured-field source snippet to inject for one parsed action. */
function fieldsSnippet(edit: PlannedEdit, indent: string): string {
  const dmg = edit.damage
    .map((d) => {
      const notation = `${d.count}d${d.faces}${d.modifier ? (d.modifier > 0 ? `+${d.modifier}` : d.modifier) : ''}`;
      const mod = d.modifier ? `, modifier: ${d.modifier}` : '';
      return `${indent}    { dice: { count: ${d.count}, die: 'd${d.faces}'${mod}, notation: '${notation}' }, type: '${d.type}' },`;
    })
    .join('\n');
  const lines = [
    `${indent}  attackBonus: ${edit.attackBonus},`,
    `${indent}  reach: ${edit.reachFeet},`,
  ];
  if (edit.damage.length > 0) {
    lines.push(`${indent}  damage: [`, dmg, `${indent}  ],`);
  }
  return lines.join('\n');
}

/** Does this action already carry structured fields? */
function hasStructured(action: Action): boolean {
  return action.attackBonus != null && (action.damage?.length ?? 0) > 0;
}

function reachFeetFor(description: string): number {
  const reach = /reach (\d+)\s*ft/i.exec(description);
  const range = /range (\d+)\s*\/\s*\d+\s*ft/i.exec(description);
  return reach ? Number(reach[1]) : range ? Number(range[1]) : 5;
}

// Group monsters by their source file so we can edit each file once.
const byFile = new Map<string, Monster[]>();
for (const monster of dnd5e2024Monsters) {
  const file = sourceFileFor(monster);
  if (!file) continue;
  byFile.set(file, [...(byFile.get(file) ?? []), monster]);
}

let totalEdits = 0;
let skippedStructured = 0;
let skippedNoAttack = 0;
const fileSummaries: string[] = [];

for (const [file, monsters] of byFile) {
  let content = readFileSync(file, 'utf8');
  let fileEdits = 0;

  for (const monster of monsters) {
    for (const action of monster.actions ?? []) {
      if (hasStructured(action)) {
        skippedStructured += 1;
        continue;
      }
      const parsed = parseAttackFromDescription(action.description);
      if (!parsed) {
        skippedNoAttack += 1;
        continue;
      }
      const edit: PlannedEdit = {
        monsterId: monster.id,
        actionName: action.name,
        attackBonus: parsed.attackBonus,
        reachFeet: reachFeetFor(action.description),
        damage: parsed.damage,
      };

      // Locate the action's description string in the file and insert fields
      // after the line that closes it. We match on the exact description text so
      // the insertion is anchored unambiguously.
      const result = injectAfterDescription(content, action.description, edit);
      if (result.changed) {
        content = result.content;
        fileEdits += 1;
        totalEdits += 1;
      } else {
        console.warn(`  ! could not anchor ${monster.id} / ${action.name}`);
      }
    }
  }

  if (fileEdits > 0) {
    fileSummaries.push(`${file.replace(process.cwd() + '/', '')}: ${fileEdits} action(s)`);
    if (WRITE) writeFileSync(file, content, 'utf8');
  }
}

console.log('\n=== backfill 2024 monster attacks ===');
console.log(`mode             : ${WRITE ? 'WRITE' : 'DRY RUN (use --write to apply)'}`);
console.log(`actions edited   : ${totalEdits}`);
console.log(`skipped (already): ${skippedStructured}`);
console.log(`skipped (no atk) : ${skippedNoAttack}`);
console.log(`files touched    : ${fileSummaries.length}`);
fileSummaries.slice(0, 40).forEach((s) => console.log(`  ${s}`));

/**
 * Insert structured fields after a description string within an action object.
 * The description may be split across lines in the source, so we match the
 * description's literal text with flexible whitespace and find the end of the
 * string literal that contains it.
 */
function injectAfterDescription(
  content: string,
  description: string,
  edit: PlannedEdit
): { content: string; changed: boolean } {
  // Descriptions are quoted strings in source — single OR double quoted (double
  // is used when the text contains an apostrophe, e.g. "can't"). Escape regex
  // specials, collapse whitespace to flexible runs, and allow either quote
  // delimiter so both styles anchor.
  const escaped = description.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+');
  // Global so we can iterate EVERY occurrence — several monsters can share the
  // exact same action prose (e.g. a generic "Ram"). We insert at the first
  // occurrence that is not ALREADY followed by the structured fields, making the
  // codemod idempotent and correct for duplicated descriptions.
  const descRe = new RegExp(`description:\\s*\\n?\\s*['"]${escaped}['"],`, 'gm');
  let match: RegExpExecArray | null;
  while ((match = descRe.exec(content)) !== null) {
    const insertAt = match.index + match[0].length;
    // Skip if this action object already has the fields injected.
    const trailing = content.slice(insertAt, insertAt + 80);
    if (/^\s*attackBonus:/.test(trailing)) continue;

    const lineStart = content.lastIndexOf('\n', match.index) + 1;
    const indentMatch = /^(\s*)/.exec(content.slice(lineStart));
    const indent = indentMatch ? indentMatch[1] : '      ';

    const snippet = '\n' + fieldsSnippet(edit, indent);
    return {
      content: content.slice(0, insertAt) + snippet + content.slice(insertAt),
      changed: true,
    };
  }
  return { content, changed: false };
}

/** Best-effort: locate the source file that defines a monster by id grep. */
function sourceFileFor(monster: Monster): string | undefined {
  // The monster id appears as `id: '<id>'` in exactly one file. We glob the
  // monsters dir recursively for it.
  try {
    const out = execSync(`grep -rl "id: '${monster.id}'" ${MONSTERS_DIR}`, { encoding: 'utf8' });
    return out.split('\n').find(Boolean);
  } catch {
    return undefined;
  }
}
