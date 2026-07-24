import type {
  LegalActionDescriptor,
  LegalActionsContext,
  LegalActionList,
  SystemLegalActionsProvider,
} from '../../../registry/types';
import type { CharacterDocument } from '../../../types/core/document';
import type { EquippedItem, SpellcastingInfo } from '../../../types/core/character';
import type { GameSystemId } from '../../../types/game-systems';
import type { Dnd5eLikeDataModel } from './dnd5eSheetShared';

/**
 * D&D 5e legal-actions provider (2014 + 2024 share the engine, so they share
 * this enumeration — see `createDnd5eValidator`, wired the same way).
 *
 * 5e uses the classic d20 action economy: on your turn you have ONE action, ONE
 * bonus action, your movement, one free object interaction, and (between turns)
 * ONE reaction. So the enumerated costs spend 5e's OWN vocabulary — `action`,
 * `bonus-action`, `reaction`, `free`, `movement` — never PF2e's action-count or
 * Daggerheart's spotlight/Hope. The seam privileges no economy.
 *
 * Everything derives from the document; nothing is invented:
 *
 * - Weapon attacks: an unarmed strike (always) plus one Attack per equipped
 *   weapon. Damage dice come from the equipped item's loader-populated
 *   `weaponDamage` (set at equip time from the weapon catalog by `toEquippedItem`),
 *   so `manualBoundary` is false — the dice are real, not adjudicated. A two-
 *   weapon-fighting off-hand attack (bonus action) is enumerated when a second
 *   Light melee weapon is equipped.
 * - The standard actions: Dash / Disengage / Dodge are mechanically self-
 *   contained (false); Help / Hide / Search / Ready carry GM-adjudicated riders
 *   (an ally in reach, available cover, a hidden target, a declared trigger), so
 *   they are honest `manualBoundary` actions.
 * - Move (spends `movement` up to speed) and Interact with an Object (one `free`
 *   interaction) round out the economy.
 * - Opportunity Attack: the archetypal `reaction`; its trigger (a creature
 *   leaving your reach) is positional and GM-adjudicated, so `manualBoundary`.
 * - Cast a Spell: one per prepared/known spell. The generic casting time is an
 *   action, but the spell's actual effect, components, and rider adjudication are
 *   NOT deterministically modeled, so each is `manualBoundary: true` — the seam
 *   names the option honestly without pretending to resolve it.
 */

const UNARMED_STRIKE_DAMAGE = { count: 1, die: 1 } as const;

/** A weapon is anything equipped in a hand slot or carrying loader weapon dice. */
function isEquippedWeapon(item: EquippedItem): boolean {
  return item.slot === 'mainHand' || item.slot === 'offHand' || item.weaponDamage !== undefined;
}

function isLightWeapon(item: EquippedItem): boolean {
  return Array.isArray(item.weaponProperties) && item.weaponProperties.includes('light');
}

function weaponLabel(item: EquippedItem): string {
  return item.customName ?? item.itemId;
}

export function createDnd5eLegalActions<T extends Dnd5eLikeDataModel>(
  systemId: GameSystemId
): SystemLegalActionsProvider<T> {
  return {
    legalActions: (document, context) => enumerateDnd5eActions<T>(document, context, systemId),
  };
}

function enumerateDnd5eActions<T extends Dnd5eLikeDataModel>(
  document: CharacterDocument<T>,
  context: LegalActionsContext,
  systemId: GameSystemId
): LegalActionList {
  const system = document.system;
  const actions: LegalActionDescriptor[] = [];

  addWeaponAttacks(actions, system, systemId);
  addStandardActions(actions, systemId);
  addMovement(actions, system, systemId);
  addReaction(actions, systemId);
  addSpellcasting(actions, system, systemId);

  return { systemId: context.systemId, actions };
}

function addWeaponAttacks(
  actions: LegalActionDescriptor[],
  system: Dnd5eLikeDataModel,
  systemId: GameSystemId
): void {
  // Unarmed strike is always available (PHB: 1 + STR bludgeoning).
  actions.push({
    id: `${systemId}:attack:unarmed`,
    kind: 'attack',
    label: 'Unarmed Strike',
    eligibility: 'available',
    costs: [{ resource: 'action', amount: 1 }],
    targets: [{ kind: 'creature', range: 'Melee', count: 1 }],
    manualBoundary: false,
    details: { weaponDamage: UNARMED_STRIKE_DAMAGE },
  });

  const equipment = Array.isArray(system.equipment) ? system.equipment : [];
  const weapons = equipment.filter(isEquippedWeapon);

  weapons.forEach((weapon) => {
    actions.push({
      id: `${systemId}:attack:${weapon.itemId}`,
      kind: 'attack',
      label: `Attack with ${weaponLabel(weapon)}`,
      eligibility: 'available',
      costs: [{ resource: 'action', amount: 1 }],
      targets: [{ kind: 'creature', range: 'Melee', count: 1 }],
      manualBoundary: false,
      source: weapon.itemId,
      details: {
        weaponDamage: weapon.weaponDamage,
        versatileDie: weapon.weaponVersatileDie,
        attackBonus: weapon.attackBonus,
        damageBonus: weapon.damageBonus,
        properties: weapon.weaponProperties,
      },
    });
  });

  // Two-Weapon Fighting: with a second Light melee weapon, the off-hand attack
  // is a BONUS action (PHB). Its dice are real (false); the ability-mod-to-damage
  // rider requires the Two-Weapon Fighting style, noted in details.
  const lightWeapons = weapons.filter(isLightWeapon);
  if (lightWeapons.length >= 2) {
    const offHand = lightWeapons[1];
    actions.push({
      id: `${systemId}:bonus-attack:${offHand.itemId}`,
      kind: 'attack',
      label: `Off-hand Attack with ${weaponLabel(offHand)}`,
      eligibility: 'available',
      costs: [{ resource: 'bonus-action', amount: 1 }],
      targets: [{ kind: 'creature', range: 'Melee', count: 1 }],
      manualBoundary: false,
      source: offHand.itemId,
      details: {
        weaponDamage: offHand.weaponDamage,
        twoWeaponFighting: true,
        note: 'Add ability modifier to damage only with the Two-Weapon Fighting style.',
      },
    });
  }
}

/**
 * The action-economy basics. Dash/Disengage/Dodge resolve deterministically;
 * Help/Hide/Search/Ready carry GM-adjudicated riders and are honest boundaries.
 */
function addStandardActions(actions: LegalActionDescriptor[], systemId: GameSystemId): void {
  const deterministic: Array<{
    id: string;
    label: string;
    targets: LegalActionDescriptor['targets'];
  }> = [
    { id: 'dash', label: 'Dash', targets: [{ kind: 'self' }] },
    { id: 'disengage', label: 'Disengage', targets: [{ kind: 'self' }] },
    { id: 'dodge', label: 'Dodge', targets: [{ kind: 'self' }] },
  ];
  deterministic.forEach(({ id, label, targets }) => {
    actions.push({
      id: `${systemId}:${id}`,
      kind: 'action',
      label,
      eligibility: 'available',
      costs: [{ resource: 'action', amount: 1 }],
      targets,
      manualBoundary: false,
    });
  });

  const adjudicated: Array<{
    id: string;
    label: string;
    targets: LegalActionDescriptor['targets'];
    reason: string;
  }> = [
    {
      id: 'help',
      label: 'Help',
      targets: [{ kind: 'ally', count: 1 }],
      reason: 'The aided ally must be within reach / the task feasible — a GM call.',
    },
    {
      id: 'hide',
      label: 'Hide',
      targets: [{ kind: 'self' }],
      reason: 'Requires available cover or obscurement, adjudicated by the GM.',
    },
    {
      id: 'search',
      label: 'Search',
      targets: [{ kind: 'self' }],
      reason: 'Perception vs. a hidden target / clue is GM-adjudicated.',
    },
    {
      id: 'ready',
      label: 'Ready',
      targets: [{ kind: 'self' }],
      reason: 'The readied action and its trigger are declared and GM-adjudicated.',
    },
  ];
  adjudicated.forEach(({ id, label, targets, reason }) => {
    actions.push({
      id: `${systemId}:${id}`,
      kind: 'action',
      label,
      eligibility: 'available',
      eligibilityReason: reason,
      costs: [{ resource: 'action', amount: 1 }],
      targets,
      manualBoundary: true,
    });
  });
}

function addMovement(
  actions: LegalActionDescriptor[],
  system: Dnd5eLikeDataModel,
  systemId: GameSystemId
): void {
  const speed = Number.isFinite(system.speed) ? system.speed : 0;

  actions.push({
    id: `${systemId}:move`,
    kind: 'movement',
    label: 'Move',
    eligibility: 'available',
    costs: [{ resource: 'movement', amount: speed }],
    targets: [{ kind: 'self' }],
    manualBoundary: false,
    details: { speed },
  });

  // 5e grants ONE free object interaction per turn (PHB: Other Activity on Your
  // Turn); anything beyond it costs an action, adjudicated at the table.
  actions.push({
    id: `${systemId}:interact-object`,
    kind: 'free',
    label: 'Interact with an Object',
    eligibility: 'available',
    costs: [{ resource: 'free', amount: 1 }],
    targets: [{ kind: 'object', count: 1 }],
    manualBoundary: false,
  });
}

function addReaction(actions: LegalActionDescriptor[], systemId: GameSystemId): void {
  // Opportunity Attack — the archetypal reaction. Its trigger (a hostile
  // creature leaving your reach) is positional, so resolution is a manual
  // boundary even though the strike itself is a normal weapon attack.
  actions.push({
    id: `${systemId}:opportunity-attack`,
    kind: 'reaction',
    label: 'Opportunity Attack',
    eligibility: 'conditional',
    eligibilityReason: 'Triggers when a creature you can see leaves your reach.',
    costs: [{ resource: 'reaction', amount: 1 }],
    targets: [{ kind: 'creature', range: 'Melee', count: 1 }],
    manualBoundary: true,
  });
}

function addSpellcasting(
  actions: LegalActionDescriptor[],
  system: Dnd5eLikeDataModel,
  systemId: GameSystemId
): void {
  const spellcasting: SpellcastingInfo | undefined = system.spellcasting;
  if (!spellcasting) {
    return;
  }

  // A spell is castable if it is prepared, always-prepared, or known (known
  // casters do not maintain a prepared list). Dedup across the three lists.
  const castable = new Set<string>([
    ...(Array.isArray(spellcasting.spellsPrepared) ? spellcasting.spellsPrepared : []),
    ...(Array.isArray(spellcasting.alwaysPreparedSpellIds)
      ? spellcasting.alwaysPreparedSpellIds
      : []),
    ...(Array.isArray(spellcasting.spellsKnown) ? spellcasting.spellsKnown : []),
  ]);

  castable.forEach((spellId) => {
    actions.push({
      id: `${systemId}:cast-a-spell:${spellId}`,
      kind: 'cast-a-spell',
      label: `Cast a Spell: ${spellId}`,
      eligibility: 'available',
      // Generic casting time is an action; the spell's actual effect, components,
      // and rider adjudication are not deterministically modeled here.
      eligibilityReason:
        'Effect, components, and non-action casting times are spell-specific and adjudicated at the table.',
      costs: [{ resource: 'action', amount: 1 }],
      targets: [],
      manualBoundary: true,
      source: spellId,
    });
  });
}
