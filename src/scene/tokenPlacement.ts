/**
 * Pure construction of a scene token from a grid-placement click. Lifted out of
 * SceneManager's handleCellActivate so the (non-trivial) rules — name fallback,
 * sheet-vs-statblock HP/size/ref resolution, and the player-controlled vs
 * allegiance distinction — are independently unit-testable rather than reachable
 * only through the component's integration tests.
 */
import type { CharacterDocument, SystemDataModel } from '../types/core/document';
import type { Monster } from '../types/creatures/monsters';
import type { SceneAllegiance, SceneToken, SceneTokenKind } from '../types/core/scene';
import { buildCharacterCombatant, monsterAverageHitPoints } from '../rules';
import { getSceneTokenSize } from './encounterBuilder';

export interface PlaceTokenInput {
  position: { x: number; y: number };
  /** A linked character sheet, when placing a sheet-backed token. */
  linkedDoc?: CharacterDocument<SystemDataModel>;
  /** A creature statblock, when placing a statblock-backed NPC. */
  statblock?: Monster;
  /** Raw name field; falls back to the linked sheet's / statblock's name. */
  nameInput: string;
  /** The kind the user selected (drives manual + sheet-as-NPC cases). */
  tokenKind: SceneTokenKind;
  /** The side an NPC fights on (applied only when the resolved kind is 'npc'). */
  tokenAllegiance: SceneAllegiance;
  idFactory: () => string;
}

/**
 * Build the token to place, or null when it has no usable name. A linked sheet
 * is placed as your character or as a sheet-backed NPC (both carry combat HP);
 * a statblock-backed NPC takes the creature's average HP and size; manual tokens
 * use the chosen kind as-is. Characters are player-controlled (Run Round skips
 * them); NPCs carry an explicit allegiance.
 */
export function buildPlacedToken(input: PlaceTokenInput): SceneToken | null {
  const { position, linkedDoc, statblock, nameInput, tokenKind, tokenAllegiance, idFactory } =
    input;

  const name = nameInput.trim() || linkedDoc?.name.trim() || statblock?.name.trim();
  if (!name) return null;

  const kind: SceneTokenKind = linkedDoc ? (tokenKind === 'npc' ? 'npc' : 'character') : tokenKind;

  let hp: SceneToken['hp'];
  let size = 1;
  let refId: string | undefined;
  if (linkedDoc) {
    const built = buildCharacterCombatant(linkedDoc, { tokenId: linkedDoc.id, position });
    hp = built.supported ? built.combatant.token.hp : undefined;
    refId = linkedDoc.id;
  } else if (statblock) {
    const max = monsterAverageHitPoints(statblock);
    hp = { current: max, max, temp: 0 };
    size = getSceneTokenSize(statblock.size);
    refId = statblock.id;
  }

  return {
    id: idFactory(),
    name,
    kind,
    position,
    size,
    ...(refId ? { refId } : {}),
    ...(hp ? { hp } : {}),
    ...(kind === 'character' ? { playerControlled: true } : {}),
    ...(kind === 'npc' ? { allegiance: tokenAllegiance } : {}),
  };
}
