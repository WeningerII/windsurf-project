import type {
  LegalActionDescriptor,
  LegalActionsContext,
  LegalActionList,
  SystemLegalActionsProvider,
} from '../../registry/types';
import type { CharacterDocument, SystemDataModel } from '../../types/core/document';
import { iterativeAttackBonuses } from '../../utils/derivedCombatMath';

/**
 * Shared D&D 3.5e / Pathfinder 1e legal-actions provider.
 *
 * The two systems run the SAME OGL action economy — a turn is one standard plus
 * one move action, OR a single full-round action, with swift/immediate actions
 * (one each per round), free actions, and attacks of opportunity as reactions.
 * The core combat actions (Attack, Full Attack, Charge, Total Defense, Withdraw,
 * Move) are byte-for-byte identical between the editions, so one enumerator
 * serves both, stamped with the caller's `systemId` (mirroring the shared
 * d20-legacy sheet/host). Only the id prefix and provenance differ.
 *
 * Costs are expressed in the systems' OWN vocabulary — `standard` / `move` /
 * `full-round` / `swift` / `immediate` / `free`, plus `attack-of-opportunity`
 * for the reaction — NOT the seam-agnostic resource shape of any other system.
 *
 * Honesty (RFC-003): the seam NAMES and COSTS actions; it never resolves them.
 * - Weapon attacks are enumerated per equipped weapon (plus unarmed). A single
 *   Attack is a standard action at full BAB; the Full Attack is a full-round
 *   action whose iterative bonuses come from `iterativeAttackBonuses` (extra
 *   attacks at BAB +6/+11/+16). Dice/BAB are modeled, so `manualBoundary` is
 *   false; the ability/size/resolver modifiers layer on at resolution.
 * - Charge and Withdraw depend on the map (line of charge, threatened squares),
 *   so their RESOLUTION is GM-adjudicated: `manualBoundary` true.
 * - Total Defense grants +4 dodge AC that this seam does NOT auto-apply to the
 *   sheet, so it is flagged `manualBoundary` true.
 * - Attack of Opportunity is a reaction whose TRIGGER is situational, so it is
 *   enumerated honestly (reaction cost) with `manualBoundary` true.
 * - Cast a Spell is enumerated per known/prepared spell. A spell's action type
 *   (standard/swift/full-round/immediate), components, and targets are
 *   spell-specific and NOT in the data model, so these carry no modeled cost and
 *   `manualBoundary` true — named without pretending to resolve.
 */

export type D20LegacySystemId = 'dnd-3.5e' | 'pf1e';

interface D20LegacyWeaponEntry {
  itemId: string;
  name: string;
  equipped: boolean;
  slot?: string;
  weaponDamage?: { count: number; die: number };
}

interface D20LegacyActionData {
  baseAttackBonus?: number;
  speed?: number;
  equipment?: readonly D20LegacyWeaponEntry[];
  spellsKnown?: readonly string[];
  preparedSpellsByLevel?: Record<number, readonly string[]>;
}

function isEquippedWeapon(entry: D20LegacyWeaponEntry): boolean {
  return entry.equipped && (entry.slot === 'mainHand' || entry.weaponDamage !== undefined);
}

export function createD20LegacyLegalActions<T extends SystemDataModel>(
  systemId: D20LegacySystemId
): SystemLegalActionsProvider<T> {
  return {
    legalActions: (document, context) => enumerateD20LegacyActions(systemId, document, context),
  };
}

function enumerateD20LegacyActions<T extends SystemDataModel>(
  systemId: D20LegacySystemId,
  document: CharacterDocument<T>,
  context: LegalActionsContext
): LegalActionList {
  const system = document.system as unknown as D20LegacyActionData;
  const actions: LegalActionDescriptor[] = [];

  addAttacks(systemId, actions, system);
  addFullAttack(systemId, actions, system);
  addCombatActions(systemId, actions, system);
  addAttackOfOpportunity(systemId, actions);
  addSpellcasting(systemId, actions, system);

  return { systemId: context.systemId, actions };
}

/** Equipped weapons (plus the always-available unarmed strike) as single
 *  standard-action Attacks at full BAB. */
function addAttacks(
  systemId: D20LegacySystemId,
  actions: LegalActionDescriptor[],
  system: D20LegacyActionData
): void {
  const bab = Number.isFinite(system.baseAttackBonus) ? (system.baseAttackBonus as number) : 0;

  actions.push({
    id: `${systemId}:attack:unarmed`,
    kind: 'attack',
    label: 'Attack (unarmed strike)',
    eligibility: 'available',
    costs: [{ resource: 'standard', amount: 1 }],
    targets: [{ kind: 'creature', range: 'melee', count: 1 }],
    manualBoundary: false,
    details: { baseAttackBonus: bab, weaponDamage: { count: 1, die: 3 } },
  });

  const equipment = Array.isArray(system.equipment) ? system.equipment : [];
  equipment.filter(isEquippedWeapon).forEach((weapon) => {
    actions.push({
      id: `${systemId}:attack:${weapon.itemId}`,
      kind: 'attack',
      label: `Attack (${weapon.name})`,
      eligibility: 'available',
      costs: [{ resource: 'standard', amount: 1 }],
      targets: [{ kind: 'creature', range: 'melee', count: 1 }],
      manualBoundary: false,
      source: weapon.itemId,
      details: { baseAttackBonus: bab, weaponDamage: weapon.weaponDamage },
    });
  });
}

/** The full-round Full Attack: every iterative attack the BAB grants. */
function addFullAttack(
  systemId: D20LegacySystemId,
  actions: LegalActionDescriptor[],
  system: D20LegacyActionData
): void {
  const bab = Number.isFinite(system.baseAttackBonus) ? (system.baseAttackBonus as number) : 0;
  const iterativeBonuses = iterativeAttackBonuses(bab);
  const equipment = Array.isArray(system.equipment) ? system.equipment : [];
  const mainWeapon = equipment.find(isEquippedWeapon);

  actions.push({
    id: `${systemId}:full-attack`,
    kind: 'full-attack',
    label: mainWeapon ? `Full Attack (${mainWeapon.name})` : 'Full Attack (unarmed strike)',
    eligibility: 'available',
    // A full attack consumes the whole turn: it is a full-round action, not a
    // standard action, and grants the iterative attacks below.
    costs: [{ resource: 'full-round', amount: 1 }],
    targets: [{ kind: 'creature', range: 'melee', count: iterativeBonuses.length }],
    manualBoundary: false,
    source: mainWeapon?.itemId,
    details: {
      baseAttackBonus: bab,
      // e.g. BAB 11 -> [11, 6, 1]; the ability/size/resolver mods layer on per
      // attack at resolution.
      iterativeBonuses,
      attackCount: iterativeBonuses.length,
      weaponDamage: mainWeapon?.weaponDamage ?? { count: 1, die: 3 },
    },
  });
}

/** Build-independent standard/move/full-round combat actions. */
function addCombatActions(
  systemId: D20LegacySystemId,
  actions: LegalActionDescriptor[],
  system: D20LegacyActionData
): void {
  const speed = Number.isFinite(system.speed) ? (system.speed as number) : 30;

  actions.push({
    id: `${systemId}:move`,
    kind: 'move',
    label: 'Move',
    eligibility: 'available',
    costs: [{ resource: 'move', amount: 1 }],
    targets: [{ kind: 'none' }],
    manualBoundary: false,
    details: { speed },
  });

  // The 5-foot step is a special reposition that costs NO action (and can't
  // combine with other movement that round) — modeled honestly with empty costs.
  actions.push({
    id: `${systemId}:five-foot-step`,
    kind: 'move',
    label: '5-foot step',
    eligibility: 'available',
    eligibilityReason: 'Costs no action, but only if you take no other movement this round.',
    costs: [],
    targets: [{ kind: 'none' }],
    manualBoundary: false,
    details: { distance: 5 },
  });

  actions.push({
    id: `${systemId}:charge`,
    kind: 'full-attack',
    label: 'Charge',
    eligibility: 'available',
    // Charge grants +2 to the attack but a -2 penalty to AC and requires a clear
    // line to the target — the movement path and line of charge are on the map,
    // so resolution stays GM-adjudicated.
    eligibilityReason: 'The line of charge and movement path are GM-adjudicated.',
    costs: [{ resource: 'full-round', amount: 1 }],
    targets: [{ kind: 'creature', range: 'melee', count: 1 }],
    manualBoundary: true,
    details: { attackBonus: 2, acPenalty: -2 },
  });

  actions.push({
    id: `${systemId}:total-defense`,
    kind: 'defense',
    label: 'Total Defense',
    eligibility: 'available',
    // +4 dodge AC and no attacks this round; the seam does not auto-apply the AC.
    eligibilityReason: 'The +4 dodge bonus to AC is not auto-applied to the sheet.',
    costs: [{ resource: 'standard', amount: 1 }],
    targets: [{ kind: 'self' }],
    manualBoundary: true,
    details: { acBonus: 4 },
  });

  actions.push({
    id: `${systemId}:withdraw`,
    kind: 'move',
    label: 'Withdraw',
    eligibility: 'available',
    // Moving away from your starting square without provoking depends on which
    // squares are threatened — a map decision, so resolution is GM-adjudicated.
    eligibilityReason: 'Which squares are threatened (provoking) is GM-adjudicated.',
    costs: [{ resource: 'full-round', amount: 1 }],
    targets: [{ kind: 'none' }],
    manualBoundary: true,
    details: { speed },
  });
}

/** Attack of Opportunity: a reaction whose trigger is situational. */
function addAttackOfOpportunity(
  systemId: D20LegacySystemId,
  actions: LegalActionDescriptor[]
): void {
  actions.push({
    id: `${systemId}:attack-of-opportunity`,
    kind: 'attack-of-opportunity',
    label: 'Attack of Opportunity',
    eligibility: 'conditional',
    eligibilityReason:
      'Triggers when a threatened creature provokes (moving out of a threatened square, some actions).',
    costs: [{ resource: 'attack-of-opportunity', amount: 1 }],
    targets: [{ kind: 'creature', range: 'melee', count: 1 }],
    manualBoundary: true,
  });
}

/** One Cast a Spell per known/prepared spell — cost/components spell-specific. */
function addSpellcasting(
  systemId: D20LegacySystemId,
  actions: LegalActionDescriptor[],
  system: D20LegacyActionData
): void {
  const known = Array.isArray(system.spellsKnown) ? system.spellsKnown : [];
  const prepared = system.preparedSpellsByLevel
    ? Object.values(system.preparedSpellsByLevel).flat()
    : [];
  // Spontaneous casters carry spellsKnown; prepared casters carry
  // preparedSpellsByLevel. Union + dedup so either casting model enumerates.
  const spellIds = Array.from(new Set([...known, ...prepared]));

  spellIds.forEach((spellId) => {
    actions.push({
      id: `${systemId}:cast-a-spell:${spellId}`,
      kind: 'cast-a-spell',
      label: `Cast a Spell: ${spellId}`,
      eligibility: 'available',
      // A spell's action type (standard/swift/full-round/immediate), components,
      // and targets are spell-specific and not in the data model — enumerated,
      // never auto-resolved.
      eligibilityReason: 'Casting time, components, and targets are spell-specific.',
      costs: [],
      targets: [],
      manualBoundary: true,
      source: spellId,
    });
  });
}
