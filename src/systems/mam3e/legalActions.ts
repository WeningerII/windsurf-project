import type {
  LegalActionCost,
  LegalActionDescriptor,
  LegalActionsContext,
  LegalActionList,
  SystemLegalActionsProvider,
} from '../../registry/types';
import type { CharacterDocument } from '../../types/core/document';
import type { ActionType, Power } from '../../types/mam/powers';
import { loadSpellsForSystem } from '../../utils/dataLoader';
import { stripDiacritics } from '../../utils/unicode';
import type { Mam3eDataModel } from './data-model';

/**
 * Mutants & Masterminds 3e legal-actions provider.
 *
 * M&M does NOT use the d20 action economy (a fixed action + bonus action +
 * reaction) nor PF2e's three-action budget. A turn spends M&M's OWN vocabulary:
 * one STANDARD action, one MOVE action, and as many FREE actions as reasonable,
 * plus reactions (Hero's Handbook, Action & Adventure — Action Types). So every
 * enumerated action's cost is expressed in that vocabulary — `standard` / `move`
 * / `free` / `reaction` — never an abstract "action".
 *
 * The "actions" a hero can take ARE their powers/effects (attack with a Damage
 * effect, activate a Move power, …) plus the universal basic actions. The
 * provider derives them from:
 *
 * - The character's powers (`document.system.powers`), each resolved against the
 *   loader-backed M&M power/effect catalog (`loadSpellsForSystem('mam3e')`) so a
 *   sparse document power inherits the catalog effect's canonical action/range.
 *   The power's activation cost comes from its `action` type. ATTACK powers have
 *   a modeled resolution (attack check vs active defense, resistance DC from
 *   effect rank — `resolveMam3eAttack`), so they are `manualBoundary: false`.
 *   Every other power's effect is free-form descriptor prose adjudicated at the
 *   table, so it is `manualBoundary: true`. Continuous/permanent powers (action
 *   `'none'`) are always-on, NOT activatable actions, and are excluded — the M&M
 *   analog of Daggerheart's passive-card exclusion.
 * - The universal basic actions every hero always has (unarmed Attack, Move,
 *   Ready, and a representative free action), costed in the same vocabulary.
 *
 * Pure: reads the document + loader and returns descriptors; never mutates or
 * persists. Honest: anything the seam cannot resolve deterministically is marked
 * `manualBoundary` for the AI/GM layer to adjudicate — never faked automation.
 */

const STANDARD: LegalActionCost = { resource: 'standard', amount: 1 };
const MOVE: LegalActionCost = { resource: 'move', amount: 1 };
const FREE: LegalActionCost = { resource: 'free', amount: 1 };
const REACTION: LegalActionCost = { resource: 'reaction', amount: 1 };

/** M&M activation-type → the resource cost it spends from the turn's economy. */
function costForAction(action: ActionType): LegalActionCost[] {
  switch (action) {
    case 'standard':
      return [STANDARD];
    case 'move':
      return [MOVE];
    case 'free':
      return [FREE];
    case 'reaction':
      return [REACTION];
    case 'none':
    default:
      // Continuous/permanent effects require no action to sustain.
      return [];
  }
}

/** Normalize an id or display name to a stable lookup key. */
function normalizeLookupKey(value: string): string {
  return stripDiacritics(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function buildCatalogLookup(catalog: Power[]): Map<string, Power> {
  const lookup = new Map<string, Power>();
  catalog.forEach((entry) => {
    if (entry?.id) lookup.set(normalizeLookupKey(entry.id), entry);
    if (entry?.name) lookup.set(normalizeLookupKey(entry.name), entry);
  });
  return lookup;
}

export function createMam3eLegalActions(): SystemLegalActionsProvider<Mam3eDataModel> {
  return {
    legalActions: (document, context) => enumerateMam3eActions(document, context),
  };
}

async function enumerateMam3eActions(
  document: CharacterDocument<Mam3eDataModel>,
  context: LegalActionsContext
): Promise<LegalActionList> {
  // The M&M power/effect catalog is the loader-backed source the document powers
  // are drawn from; loading it lets a sparse document power inherit the canonical
  // effect's action/range/type (the Daggerheart resolve-against-catalog pattern).
  // `loadSpellsForSystem('mam3e')` returns the M&M powers, typed as the shared
  // Spell alias but structurally `Power`.
  const catalog = (await loadSpellsForSystem('mam3e')) as unknown as Power[];
  const catalogLookup = buildCatalogLookup(catalog);

  const actions: LegalActionDescriptor[] = [];
  addBasicActions(actions);
  addPowerActions(actions, document.system, catalogLookup);

  return { systemId: context.systemId, actions };
}

/**
 * The universal M&M basic actions — the turn economy every hero always has,
 * independent of powers. They showcase all three action resources.
 */
function addBasicActions(actions: LegalActionDescriptor[]): void {
  // Unarmed attack: a close attack check vs the target's active defense, Damage
  // rank = Strength. Its resolution is modeled (resolveMam3eAttack), so it is not
  // a manual boundary — mirroring the always-available PF2e unarmed strike.
  actions.push({
    id: 'mam3e:basic:unarmed-attack',
    kind: 'attack',
    label: 'Unarmed Attack',
    eligibility: 'available',
    costs: [STANDARD],
    targets: [{ kind: 'creature', range: 'close', count: 1 }],
    manualBoundary: false,
    details: {
      damage: 'Strength rank',
      resolution: 'Attack check vs active defense; resistance DC 15 + damage rank',
    },
  });

  actions.push({
    id: 'mam3e:basic:move',
    kind: 'move',
    label: 'Move',
    eligibility: 'available',
    costs: [MOVE],
    targets: [{ kind: 'none' }],
    manualBoundary: false,
    details: { note: 'Move up to your speed distance rank.' },
  });

  // Ready is a real standard action, but its trigger is declared by the player
  // and adjudicated by the GM, so its resolution is a manual boundary.
  actions.push({
    id: 'mam3e:basic:ready',
    kind: 'basic-action',
    label: 'Ready an Action',
    eligibility: 'available',
    eligibilityReason: 'The readied action and its trigger are declared and GM-adjudicated.',
    costs: [STANDARD],
    targets: [{ kind: 'self' }],
    manualBoundary: true,
  });

  // A representative free action, proving the 'free' resource is part of the
  // economy alongside 'standard' and 'move'.
  actions.push({
    id: 'mam3e:basic:drop-prone',
    kind: 'basic-action',
    label: 'Drop Prone',
    eligibility: 'available',
    costs: [FREE],
    targets: [{ kind: 'self' }],
    manualBoundary: false,
  });
}

/**
 * Enumerate the character's powers as actions. Each power resolves against the
 * loader catalog for its canonical action/range/type; activatable powers become
 * descriptors costed by their action type, continuous/permanent powers are
 * excluded as passive.
 */
function addPowerActions(
  actions: LegalActionDescriptor[],
  system: Mam3eDataModel,
  catalogLookup: Map<string, Power>
): void {
  const powers = Array.isArray(system.powers) ? system.powers : [];

  powers.forEach((power, index) => {
    const canonical =
      catalogLookup.get(normalizeLookupKey(power.id)) ??
      catalogLookup.get(normalizeLookupKey(power.name));

    const action: ActionType = power.action ?? canonical?.action ?? 'standard';
    // Continuous/permanent effects (action 'none') are always-on, not actions.
    if (action === 'none') {
      return;
    }

    const powerType = power.type ?? canonical?.type ?? 'general';
    const range = power.range ?? canonical?.range;
    const isAttack = powerType === 'attack';

    actions.push({
      id: `mam3e:power:${index}:${power.id}`,
      kind: isAttack ? 'attack' : 'power',
      label: isAttack ? `Attack with ${power.name}` : `Activate ${power.name}`,
      eligibility: 'available',
      // Attack powers have a modeled attack check + resistance DC; every other
      // power's effect lives in free-form descriptor prose, GM-adjudicated.
      eligibilityReason: isAttack
        ? undefined
        : "Effect is described in the power's descriptors, adjudicated at the table.",
      costs: costForAction(action),
      targets: isAttack ? [{ kind: 'creature', range, count: 1 }] : [{ kind: 'self' }],
      manualBoundary: !isAttack,
      source: canonical?.id ?? power.id,
      details: {
        powerType,
        action,
        range,
        descriptors: power.descriptors,
        resolvedFromCatalog: canonical !== undefined,
      },
    });
  });
}
