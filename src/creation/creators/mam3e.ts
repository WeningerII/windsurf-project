import { powerById } from '../../data/mutants-and-masterminds/3e/powers/aggregations';
import { mam3eAdvantagesById } from '../../data/mutants-and-masterminds/3e/advantages';
import { createDefaultMam3eData, type Mam3eDataModel } from '../../systems/mam3e/data-model';
import type { CreationDraft, CreationIntent, SystemCreator } from '../types';

/**
 * Mutants & Masterminds 3e creator. M&M has no levels — the axis is Power Level,
 * which sets both the trait caps (2 × PL) and the build budget (15 × PL). The
 * creator reads a PL from the prompt (or defaults to the standard starting PL
 * 10) and lays down a melee bruiser scaled to it: traits, defenses, a close
 * Damage power, a couple of combat advantages, and skills — all kept comfortably
 * inside every PL cap and well under the point budget so the build is legal.
 */

const DEFAULT_PL = 10;
const MIN_PL = 1;
const MAX_PL = 20;
const STANDARD_PP_PER_PL = 15;
/** Signature combat advantages for a bruiser; filtered against the catalog. */
const PREFERRED_ADVANTAGE_IDS = ['all-out-attack', 'power-attack', 'improved-initiative'];

export const mam3eCreator: SystemCreator<Mam3eDataModel> = {
  systemId: 'mam3e',
  build(intent: CreationIntent): CreationDraft<Mam3eDataModel> {
    const pl = resolvePowerLevel(intent);
    // Half-PL anchors the build: traits/defenses sit at ~PL/2 so combined caps
    // (2 × PL) are met with margin, and the point total stays well under 15 × PL.
    const half = Math.floor(pl / 2);
    const attackRank = Math.max(1, half);

    const system = createDefaultMam3eData();
    system.powerLevel = pl;
    system.powerPoints.total = pl * STANDARD_PP_PER_PL;

    system.abilities = {
      str: half,
      sta: half,
      agi: 2,
      dex: 0,
      fgt: half,
      int: 0,
      awe: 2,
      pre: 0,
    };

    system.defenses = {
      dodge: { rank: half, total: 0 },
      parry: { rank: half, total: 0 },
      fortitude: { rank: half, total: 0 },
      toughness: { rank: 0, total: 0 }, // Toughness comes from Stamina, charged there.
      will: { rank: half, total: 0 },
    };

    const damage = powerById['damage'];
    if (damage) {
      system.powers = [{ ...damage, rank: attackRank }];
    }

    system.advantages = startingAdvantages();

    system.skills = {
      perception: { rank: 2, total: 0 },
      intimidation: { rank: half, total: 0 },
    };

    const name = intent.name ?? 'New Hero';
    return { name, system };
  },
};

/** Resolve the preferred advantage ids against the catalog (unranked, 1 PP each). */
function startingAdvantages(): Mam3eDataModel['advantages'] {
  return PREFERRED_ADVANTAGE_IDS.map((id) => mam3eAdvantagesById[id])
    .filter((advantage): advantage is NonNullable<typeof advantage> => Boolean(advantage))
    .map((advantage) => ({ id: advantage.id, name: advantage.name }));
}

function resolvePowerLevel(intent: CreationIntent): number {
  const explicit = intent.prompt.toLowerCase().match(/\b(?:pl|power\s*level)\s*(\d{1,2})\b/);
  if (explicit) {
    return clampPowerLevel(Number.parseInt(explicit[1], 10));
  }
  // "level N" in the prompt maps to PL; otherwise use the standard starting PL.
  if (intent.level > 1) {
    return clampPowerLevel(intent.level);
  }
  return DEFAULT_PL;
}

function clampPowerLevel(value: number): number {
  if (!Number.isFinite(value)) return DEFAULT_PL;
  return Math.min(MAX_PL, Math.max(MIN_PL, Math.floor(value)));
}
