import type {
  LegalActionDescriptor,
  LegalActionsContext,
  LegalActionList,
  SystemLegalActionsProvider,
} from '../../registry/types';
import type { CharacterDocument } from '../../types/core/document';
import type { DaggerheartClass, DaggerheartWeapon } from '../../types/daggerheart';
import {
  loadDaggerheartClassesForSystem,
  loadDaggerheartWeaponsForSystem,
} from '../../utils/dataLoader';
import { stripDiacritics } from '../../utils/unicode';
import type { DaggerheartDataModel } from './data-model';

/**
 * Daggerheart legal-actions provider.
 *
 * Daggerheart has NO d20-style per-turn action economy. A turn is a spotlight:
 * you make ONE Action Roll (move + act), and can spend Hope on universal moves.
 * So the enumerated actions spend Daggerheart's own resources — `spotlight`,
 * `hope`, `stress` — never abstract "actions". The provider derives everything
 * from the loader-backed SRD catalog plus the document:
 *
 * - Weapon strikes for the equipped primary/secondary weapon (resolved from the
 *   weapon catalog for range/trait/damage). A strike IS the spotlight Action
 *   Roll; its mechanics are fully specified, so `manualBoundary` is false.
 * - Universal moves: Help an Ally (spend 1 Hope, add a d6 — mechanical, not a
 *   manual boundary) and Utilize an Experience (spend 1 Hope; whether the
 *   Experience applies is a GM call, so `manualBoundary` is true).
 * - The class's Hope Feature (spend 3 Hope) — its effect is described text, GM-
 *   adjudicated, so `manualBoundary` is true. Gated on the current Hope pool.
 * - Non-passive loadout domain cards (abilities/spells). Their activation cost
 *   and effect live in card text, not structured data, so they are enumerated
 *   as `manualBoundary` actions with no modeled cost. Passive cards
 *   (`automationMode: 'passive'`) are always-on bonuses, NOT actions, and are
 *   deliberately excluded.
 *
 * Never fabricates automation: anything the seam cannot resolve deterministically
 * is marked `manualBoundary` for the AI/GM layer to adjudicate.
 */

const HOPE_HELP_COST = 1;
const HOPE_EXPERIENCE_COST = 1;
const HOPE_FEATURE_COST = 3;

type NamedEntry = { id: string; name: string };

/** Same key normalization the sheet/validator use, so a slot storing a display
 * name ('Broadsword') resolves the same as one storing the id. */
function normalizeLookupKey(value: string): string {
  return stripDiacritics(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function buildLookup<T extends NamedEntry>(entries: T[]): Map<string, T> {
  const lookup = new Map<string, T>();
  entries.forEach((entry) => {
    lookup.set(normalizeLookupKey(entry.id), entry);
    lookup.set(normalizeLookupKey(entry.name), entry);
  });
  return lookup;
}

function resolveNamedEntry<T extends NamedEntry>(
  value: string | undefined,
  lookup: Map<string, T>
): T | undefined {
  if (!value) {
    return undefined;
  }
  return lookup.get(normalizeLookupKey(value));
}

export function createDaggerheartLegalActions(): SystemLegalActionsProvider<DaggerheartDataModel> {
  return {
    legalActions: (document, context) => enumerateDaggerheartActions(document, context),
  };
}

async function enumerateDaggerheartActions(
  document: CharacterDocument<DaggerheartDataModel>,
  context: LegalActionsContext
): Promise<LegalActionList> {
  const [classes, weapons] = await Promise.all([
    loadDaggerheartClassesForSystem('daggerheart'),
    loadDaggerheartWeaponsForSystem('daggerheart'),
  ]);
  const classLookup = buildLookup(classes);
  const weaponLookup = buildLookup(weapons);

  const system = document.system;
  const actions: LegalActionDescriptor[] = [];

  addWeaponStrikes(actions, system, weaponLookup);
  addUniversalMoves(actions, system);
  addHopeFeature(actions, system, classLookup);
  addDomainCardActions(actions, system);

  return { systemId: context.systemId, actions };
}

function addWeaponStrikes(
  actions: LegalActionDescriptor[],
  system: DaggerheartDataModel,
  weaponLookup: Map<string, DaggerheartWeapon>
): void {
  const weapons = system.weapons ?? { primaryId: '', secondaryId: '', inventoryIds: [] };

  (['primary', 'secondary'] as const).forEach((slot) => {
    const weaponId = slot === 'primary' ? weapons.primaryId : weapons.secondaryId;
    const weapon = resolveNamedEntry(weaponId, weaponLookup);
    if (!weapon) {
      return;
    }

    actions.push({
      id: `daggerheart:strike:${slot}:${weapon.id}`,
      kind: 'action-roll',
      label: `Attack with ${weapon.name}`,
      eligibility: 'available',
      // The spotlight Action Roll — the character's core turn. Spends the
      // narrative spotlight, not a per-turn action slot.
      costs: [{ resource: 'spotlight', amount: 1 }],
      targets: [{ kind: 'creature', range: weapon.range, count: 1 }],
      manualBoundary: false,
      source: weapon.id,
      details: {
        slot,
        trait: weapon.trait,
        damage: weapon.damage,
        damageType: weapon.damageType,
        burden: weapon.burden,
      },
    });
  });
}

function addUniversalMoves(actions: LegalActionDescriptor[], system: DaggerheartDataModel): void {
  const hope = Number.isFinite(system.hope) ? system.hope : 0;

  // Help an Ally — spend a Hope to add a d6 to an ally's roll (SRD 1.0: Hope).
  actions.push({
    id: 'daggerheart:help-an-ally',
    kind: 'action',
    label: 'Help an Ally',
    eligibility: hope >= HOPE_HELP_COST ? 'available' : 'unavailable',
    eligibilityReason:
      hope >= HOPE_HELP_COST ? undefined : `Requires ${HOPE_HELP_COST} Hope (current: ${hope}).`,
    costs: [{ resource: 'hope', amount: HOPE_HELP_COST }],
    targets: [{ kind: 'ally', count: 1 }],
    manualBoundary: false,
    details: { advantageDie: 'd6' },
  });

  // Utilize an Experience — spend a Hope to add the Experience modifier. Whether
  // the Experience is relevant to the roll is a GM call, so this stays manual.
  const experiences = Array.isArray(system.experiences) ? system.experiences : [];
  experiences.forEach((experience, index) => {
    if (!experience) {
      return;
    }
    actions.push({
      id: `daggerheart:utilize-experience:${index}`,
      kind: 'action',
      label: `Utilize Experience: ${experience}`,
      eligibility: hope >= HOPE_EXPERIENCE_COST ? 'available' : 'unavailable',
      eligibilityReason:
        hope >= HOPE_EXPERIENCE_COST
          ? 'The GM decides whether this Experience applies to the roll.'
          : `Requires ${HOPE_EXPERIENCE_COST} Hope (current: ${hope}).`,
      costs: [{ resource: 'hope', amount: HOPE_EXPERIENCE_COST }],
      targets: [{ kind: 'self' }],
      manualBoundary: true,
      details: { experience },
    });
  });
}

function addHopeFeature(
  actions: LegalActionDescriptor[],
  system: DaggerheartDataModel,
  classLookup: Map<string, DaggerheartClass>
): void {
  const selectedClass = resolveNamedEntry(system.class, classLookup);
  if (!selectedClass) {
    return;
  }
  const hope = Number.isFinite(system.hope) ? system.hope : 0;
  const feature = selectedClass.hopeFeature;

  actions.push({
    id: `daggerheart:hope-feature:${feature.id}`,
    kind: 'hope-feature',
    label: feature.name,
    eligibility: hope >= HOPE_FEATURE_COST ? 'available' : 'unavailable',
    eligibilityReason:
      hope >= HOPE_FEATURE_COST
        ? // The feature's effect is described prose, resolved at the table.
          'Effect is described text, adjudicated at the table.'
        : `Requires ${HOPE_FEATURE_COST} Hope (current: ${hope}).`,
    costs: [{ resource: 'hope', amount: HOPE_FEATURE_COST }],
    targets: [{ kind: 'self' }],
    manualBoundary: true,
    source: selectedClass.id,
    details: { description: feature.description },
  });
}

function addDomainCardActions(
  actions: LegalActionDescriptor[],
  system: DaggerheartDataModel
): void {
  const domainCards = Array.isArray(system.domainCards) ? system.domainCards : [];

  domainCards.forEach((entry, index) => {
    // Only cards in the active loadout are playable; vaulted cards are inert.
    // (Passive card bonuses — `automationMode: 'passive'` in the catalog — are
    // always-on and handled by the derivation layer; the document loadout does
    // not carry that flag, so every loadout card is treated as playable here.)
    if (entry.location === 'vault') {
      return;
    }

    const label = entry.name || entry.cardId || entry.id;
    actions.push({
      id: `daggerheart:domain-card:${index}:${entry.cardId || entry.id}`,
      kind: 'domain-card',
      label: `Play: ${label}`,
      eligibility: 'available',
      // Activation cost (Hope/Stress) and effect live in the card's text, not in
      // structured data, so the seam cannot resolve it — GM/player adjudicated.
      eligibilityReason: 'Activation cost and effect are on the card, adjudicated at the table.',
      costs: [],
      targets: [],
      manualBoundary: true,
      source: entry.cardId || entry.id,
      details: {
        domain: entry.domain,
        cardType: entry.type,
        recallCost: entry.recallCost,
      },
    });
  });
}
