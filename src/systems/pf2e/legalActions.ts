import type {
  LegalActionDescriptor,
  LegalActionsContext,
  LegalActionList,
  SystemLegalActionsProvider,
} from '../../registry/types';
import type { CharacterDocument } from '../../types/core/document';
import type { Pf2eDataModel } from './data-model';

/**
 * PF2e legal-actions provider.
 *
 * PF2e's action model is the classic three-action economy: a turn has 3 actions
 * plus 1 reaction, and activities cost 1, 2, or 3 of those actions. The
 * enumerated actions therefore spend PF2e's OWN resources — `action` (of 3) and
 * `reaction` (of 1) — with `amount` counting how many of the three are spent.
 * This is a deliberately DIFFERENT shape from Daggerheart's spotlight/Hope
 * model; the seam contract privileges neither.
 *
 * Everything is derived from the document (equipment, speed, spellcasting):
 *
 * - Strikes: an unarmed strike (always) plus one per equipped melee weapon
 *   (equipment entries flagged `slot: 'mainHand'` / carrying `weaponDamage`).
 *   Each costs 1 action; dice come from the item, so `manualBoundary` is false.
 *   The multiple-attack penalty is reported in `details`, not auto-applied.
 * - Basic movement: Stride and Step, 1 action each, mechanically defined.
 * - Raise a Shield (1 action): conditional on an equipped shield. Shield Block
 *   (1 reaction): conditional on that shield being raised.
 * - Ready (2 actions): a real two-action basic action — but the readied trigger
 *   is player-declared and GM-adjudicated, so `manualBoundary` is true.
 * - Cast a Spell: one per known spell. A spell's action cost, components, and
 *   targets are spell-specific and NOT in the data model, so these are
 *   enumerated with no modeled cost and `manualBoundary: true` — the seam names
 *   the option honestly without pretending to resolve it.
 */

type Pf2eEquipmentEntry = Pf2eDataModel['equipment'][number];

const MULTIPLE_ATTACK_PENALTY = '0 / -5 / -10';

function isEquippedWeapon(entry: Pf2eEquipmentEntry): boolean {
  return entry.equipped && (entry.slot === 'mainHand' || entry.weaponDamage !== undefined);
}

function isEquippedShield(entry: Pf2eEquipmentEntry): boolean {
  return entry.equipped && entry.shieldBonus !== undefined;
}

export function createPf2eLegalActions(): SystemLegalActionsProvider<Pf2eDataModel> {
  return {
    legalActions: (document, context) => enumeratePf2eActions(document, context),
  };
}

function enumeratePf2eActions(
  document: CharacterDocument<Pf2eDataModel>,
  context: LegalActionsContext
): LegalActionList {
  const system = document.system;
  const actions: LegalActionDescriptor[] = [];

  addStrikes(actions, system);
  addMovement(actions, system);
  addShieldActions(actions, system);
  addReady(actions);
  addSpellcasting(actions, system);

  return { systemId: context.systemId, actions };
}

function addStrikes(actions: LegalActionDescriptor[], system: Pf2eDataModel): void {
  // Unarmed strike is always available (CRB: everyone is trained in unarmed).
  actions.push({
    id: 'pf2e:strike:unarmed',
    kind: 'strike',
    label: 'Strike (unarmed)',
    eligibility: 'available',
    costs: [{ resource: 'action', amount: 1 }],
    targets: [{ kind: 'creature', range: 'reach', count: 1 }],
    manualBoundary: false,
    details: { weaponDamage: { count: 1, die: 4 }, multipleAttackPenalty: MULTIPLE_ATTACK_PENALTY },
  });

  const equipment = Array.isArray(system.equipment) ? system.equipment : [];
  equipment.filter(isEquippedWeapon).forEach((weapon) => {
    actions.push({
      id: `pf2e:strike:${weapon.itemId}`,
      kind: 'strike',
      label: `Strike (${weapon.name})`,
      eligibility: 'available',
      costs: [{ resource: 'action', amount: 1 }],
      targets: [{ kind: 'creature', range: 'melee', count: 1 }],
      manualBoundary: false,
      source: weapon.itemId,
      details: {
        weaponDamage: weapon.weaponDamage,
        multipleAttackPenalty: MULTIPLE_ATTACK_PENALTY,
      },
    });
  });
}

function addMovement(actions: LegalActionDescriptor[], system: Pf2eDataModel): void {
  const speed = Number.isFinite(system.speed) ? system.speed : 0;

  actions.push({
    id: 'pf2e:stride',
    kind: 'move',
    label: 'Stride',
    eligibility: 'available',
    costs: [{ resource: 'action', amount: 1 }],
    targets: [{ kind: 'none' }],
    manualBoundary: false,
    details: { speed },
  });

  actions.push({
    id: 'pf2e:step',
    kind: 'move',
    label: 'Step',
    eligibility: 'available',
    costs: [{ resource: 'action', amount: 1 }],
    targets: [{ kind: 'none' }],
    manualBoundary: false,
    details: { distance: 5 },
  });
}

function addShieldActions(actions: LegalActionDescriptor[], system: Pf2eDataModel): void {
  const equipment = Array.isArray(system.equipment) ? system.equipment : [];
  const shield = equipment.find(isEquippedShield);

  actions.push({
    id: 'pf2e:raise-a-shield',
    kind: 'action',
    label: 'Raise a Shield',
    eligibility: shield ? 'available' : 'unavailable',
    eligibilityReason: shield ? undefined : 'No shield is equipped.',
    costs: [{ resource: 'action', amount: 1 }],
    targets: [{ kind: 'self' }],
    manualBoundary: false,
    source: shield?.itemId,
    details: { shieldBonus: shield?.shieldBonus },
  });

  // Shield Block is a reaction, spent from the separate reaction pool, and only
  // while the shield is raised — a distinct resource from the 3-action budget.
  actions.push({
    id: 'pf2e:shield-block',
    kind: 'reaction',
    label: 'Shield Block',
    eligibility: shield?.raised ? 'available' : 'conditional',
    eligibilityReason: shield?.raised
      ? 'Triggers when you take damage from a physical attack.'
      : 'Requires a raised shield.',
    costs: [{ resource: 'reaction', amount: 1 }],
    targets: [{ kind: 'self' }],
    manualBoundary: false,
    source: shield?.itemId,
  });
}

function addReady(actions: LegalActionDescriptor[]): void {
  // Ready is a genuine two-action basic action — proof the economy models
  // multi-action costs — but the readied trigger is declared by the player and
  // adjudicated by the GM, so its resolution is a manual boundary.
  actions.push({
    id: 'pf2e:ready',
    kind: 'action',
    label: 'Ready',
    eligibility: 'available',
    eligibilityReason: 'The readied action and its trigger are declared and GM-adjudicated.',
    costs: [{ resource: 'action', amount: 2 }],
    targets: [{ kind: 'self' }],
    manualBoundary: true,
  });
}

function addSpellcasting(actions: LegalActionDescriptor[], system: Pf2eDataModel): void {
  const spellcasting = system.spellcasting;
  if (!spellcasting) {
    return;
  }
  const known = Array.isArray(spellcasting.spellsKnown) ? spellcasting.spellsKnown : [];

  known.forEach((spellId) => {
    actions.push({
      id: `pf2e:cast-a-spell:${spellId}`,
      kind: 'cast-a-spell',
      label: `Cast a Spell: ${spellId}`,
      eligibility: 'available',
      // Action cost (1-3 or a reaction), components, and targets are spell-
      // specific and not in the data model — enumerated, never auto-resolved.
      eligibilityReason: 'Action cost, components, and targets are spell-specific.',
      costs: [],
      targets: [],
      manualBoundary: true,
      source: spellId,
      details: { tradition: spellcasting.tradition, castingType: spellcasting.type },
    });
  });
}
