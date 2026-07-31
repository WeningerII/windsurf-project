/**
 * Bridge: deterministic resolution → scene actions.
 *
 * See `docs/rfc/003-rules-ir-and-effects.md` (Accepted), "Participant-aware
 * resolution" + the resolution/narration split.
 *
 * The resolver produces an outcome artifact; this turns that artifact into the
 * scene runtime's typed `apply-damage` intent so combat lands on the grid
 * through the normal event-sourced path (validated, replayable). It is a pure
 * translation — no RNG, no mutation — keeping the mechanics → event boundary
 * clean and the LLM out of the resolution hot path.
 */

import type { SceneActionIntent, SceneTokenDamage } from '../../types/core/scene';
import type { AttackResolution } from './attackResolution';
import type { DamageChannelAmount } from './damageChannelSplit';
import type { AreaEffectResult, MultiTargetAttackResult } from './participantResolution';

/**
 * Turn one target's resolved damage into scene damage entries — one entry PER
 * TYPED CHANNEL.
 *
 * `SceneTokenDamage` already allows several entries for the same token (the fold
 * applies each delta in turn, and HP arithmetic is associative: temp HP absorbs
 * the same points and the floor at 0 lands in the same place either way). So a
 * multi-channel hit needs no new event shape — it emits "6 slashing" and "4 fire"
 * against the same token, and the runtime mitigates each entry independently
 * against the target's snapshotted profile. That is the whole join: resistance
 * halves the fire and leaves the slashing alone, which a single summed entry
 * could never express.
 *
 * A single-channel resolution takes the ORIGINAL one-entry shape verbatim, so
 * every event this bridge produced before multi-channel splitting existed is
 * still produced byte-for-byte.
 *
 * The single-channel branch takes its type from the CHANNEL, not from
 * `resolution.damageType`. The two can disagree, because they are set by
 * different predicates: `damageType` requires `contributingTypes.size === 1 AND
 * untypedTotal === 0`, while `collectDamageChannels` keeps only channels with a
 * non-zero total. A hit of `damage.fire +10` and `damage -3` resolves to 7 with
 * one surviving channel (fire) but NO `damageType`, because the untyped channel
 * was non-zero — so the old code emitted an untyped 7 that flatly contradicted
 * `resolution.damageChannels`, and a fire-immune target took 7 instead of 0.
 * Reading the channel keeps the event and the resolution consistent, which is
 * the property this whole bridge exists to guarantee.
 */
function damageEntriesFor(tokenId: string, resolution: AttackResolution): SceneTokenDamage[] {
  const channels: DamageChannelAmount[] | undefined = resolution.damageChannels;
  if (!channels || channels.length === 0) {
    return [{ tokenId, amount: resolution.damage, type: resolution.damageType }];
  }
  if (channels.length === 1) {
    return [{ tokenId, amount: resolution.damage, type: channels[0].type }];
  }
  return damageEntriesForChannels(tokenId, channels);
}

/**
 * Turn resolved channels into scene damage entries against one token.
 *
 * THE SINGLE PLACE a typed damage entry is shaped. The resolved-attack bridge,
 * the area-effect bridge and the manual/ad-hoc path (`manualDamage.ts`) all come
 * through here, so no caller can invent a subtly different entry that the
 * runtime then mitigates differently — the failure mode this whole thread is
 * closing is two paths that can disagree.
 *
 * Channels that resolved to zero are dropped: they would fold to a no-op delta
 * and only add noise to the log. The remaining amounts still sum to the whole,
 * because dropping zeros cannot change a sum.
 *
 * `type` is OMITTED rather than set to `undefined` for an untyped channel, so an
 * untyped entry serializes exactly like the `{ tokenId, amount }` entries every
 * historical event contains.
 */
export function damageEntriesForChannels(
  tokenId: string,
  channels: readonly DamageChannelAmount[]
): SceneTokenDamage[] {
  return channels
    .filter((channel) => channel.amount !== 0)
    .map((channel) => ({
      tokenId,
      amount: channel.amount,
      ...(channel.type === undefined ? {} : { type: channel.type }),
    }));
}

/** Build an apply-damage intent from a single resolved attack against a target. */
export function attackToDamageIntent(
  actorId: string,
  targetId: string,
  resolution: AttackResolution,
  cause?: string
): SceneActionIntent | undefined {
  if (!resolution.isHit || resolution.damage <= 0) {
    return undefined; // a miss (or zero damage) produces no damage event
  }
  return {
    type: 'apply-damage',
    actorId,
    cause,
    // Carry the resolved damage type(s) through. This is the join that makes the
    // scene's typed-damage mitigation reachable from real combat: the type is
    // parsed from the statblock into a `damage.<type>` effect channel, and until
    // this line it was summed away and dropped here, so a fire elemental took
    // full fire damage on the grid. A multi-channel hit (flame tongue: slashing
    // plus fire) emits one entry per channel; untyped damage stays untyped and
    // therefore unmitigated, identical to the previous behaviour.
    damages: damageEntriesFor(targetId, resolution),
  };
}

/**
 * Build a single apply-damage intent covering every target a multi-target attack
 * hit. Targets that were missed contribute nothing. Returns undefined when no
 * target took damage (so the caller emits no event).
 */
export function multiTargetAttackToDamageIntent(
  result: MultiTargetAttackResult,
  cause?: string
): SceneActionIntent | undefined {
  // Each entry carries a full AttackResolution, so the damage type was sitting
  // right there and used to be dropped on the floor here — a cleave through three
  // fire-immune targets dealt full damage to all of them.
  const damages: SceneTokenDamage[] = result.perTarget
    .filter((entry) => entry.resolution.isHit && entry.resolution.damage > 0)
    .flatMap((entry) => damageEntriesFor(entry.targetId, entry.resolution));

  if (damages.length === 0) {
    return undefined;
  }
  return { type: 'apply-damage', actorId: result.actorId, cause, damages };
}

/**
 * Build a single apply-damage intent from an area effect: one delta per
 * participant who took damage (full or half), all in one event so the AoE is a
 * single auditable step.
 */
export function areaEffectToDamageIntent(
  result: AreaEffectResult,
  cause?: string
): SceneActionIntent | undefined {
  // Per-participant channels, because the save already halved the total this
  // participant is taking — the split runs on that halved figure, keeping the
  // SRD's order (save first, then resistance) and the sum honest.
  const damages: SceneTokenDamage[] = result.perTarget
    .filter((outcome) => outcome.damageTaken > 0)
    .flatMap((outcome) => {
      const channels = outcome.damageChannels;
      if (!channels || channels.length === 0) {
        return [{ tokenId: outcome.targetId, amount: outcome.damageTaken }];
      }
      return damageEntriesForChannels(outcome.targetId, channels);
    });

  if (damages.length === 0) {
    return undefined;
  }
  return { type: 'apply-damage', actorId: result.sourceId, cause, damages };
}
