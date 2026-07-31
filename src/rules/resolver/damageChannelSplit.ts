import type { DamageType } from '../../types/core/common';

/**
 * Multi-channel damage split — the remainder rule §3.2 was blocked on.
 *
 * WHY THIS EXISTS. Damage effects are namespaced by channel (`damage.fire`,
 * `damage.slashing`, or the bare untyped `damage`), but `AttackResolution.damage`
 * is a single scalar summed across every channel — and crit math then multiplies
 * that scalar as a whole. So by the time damage reaches the scene, the per-channel
 * breakdown has been collapsed. Before this module the resolver's response was to
 * decline to type multi-channel attacks at all (`damageType` stayed undefined and
 * untyped damage is never mitigated), which meant a flame tongue against a
 * fire-immune creature dealt full damage — precisely the case the 394 shipped
 * resistance declarations exist for.
 *
 * THE RULE (WORK_PLAN 3.2, decision B1). Largest-remainder distribution over the
 * channel proportions, with the biggest channel absorbing the remainder:
 *
 *   1. Each channel's exact share is `total * weight / sum(weights)`.
 *   2. Floor every share. Floors always sum to at most the total, leaving fewer
 *      leftover units than there are channels.
 *   3. Hand the leftover units out one at a time to the channels with the largest
 *      fractional remainders.
 *
 * This is the same apportionment rule used for seats-per-vote (Hamilton's
 * method). It is chosen over "round each and fix up the last channel" because it
 * is symmetric — no channel is privileged by its position — and over "give the
 * fraction to the largest channel" because that biases hard on small totals.
 *
 * TIE-BREAKING IS PART OF THE RULE, NOT AN IMPLEMENTATION DETAIL. Equal
 * remainders break toward the LARGER WEIGHT (the biggest channel absorbs the
 * remainder); equal weights break toward the EARLIER DECLARED CHANNEL. Both keys
 * are stable properties of the input array, never of object iteration order,
 * because this sits on the replay path: RFC 006 promises byte-identical replay,
 * and a split that depended on key enumeration would make the same event log
 * resolve to different numbers under a different engine or a re-ordered object.
 * `resolveEffects` already groups channels in first-seen effect order, so
 * "declared order" is the order the source's damage effects were written in.
 *
 * THE POST-CONDITION IS ASSERTED, NOT ASSUMED. The parts sum EXACTLY to the whole
 * for every input, and `splitDamageAcrossChannels` throws if they ever do not.
 * Damage that leaks or multiplies in the split would be a silent, unfalsifiable
 * corruption of every downstream HP number, so it fails loudly at the seam
 * instead.
 *
 * WHAT THIS MODULE DOES NOT DO. It does not mitigate. Splitting produces typed
 * parts; each part is then mitigated independently by the existing L8 transform
 * (`damageMitigation.ts`) at event-build time. Resistance still halves, immunity
 * still zeroes, vulnerability still doubles — this module invents no new
 * semantics, it only decides how many points each channel is holding.
 */

/**
 * One typed damage channel and its relative size.
 *
 * `type` is absent for the bare untyped `damage` channel. An untyped channel is a
 * first-class participant in the split precisely so it can be kept SEPARATE from
 * the typed ones: an attack dealing 7 slashing + 3 untyped must not have the
 * untyped 3 swept into the slashing bucket, because untyped damage is never
 * mitigated and folding it in would let resistance eat points it has no claim to.
 *
 * `weight` is normally the channel's own pre-crit resolved total. Weights need
 * not sum to the total being split — crit multipliers scale the scalar after the
 * channels are known, and proportional distribution is what carries that scaling
 * back onto the channels.
 */
export interface DamageChannel {
  type?: DamageType;
  weight: number;
}

/** A channel's share of the total, in whole hit points. */
export interface DamageChannelAmount {
  type?: DamageType;
  amount: number;
}

/**
 * Read the channel weights out of a resolved damage fold.
 *
 * `resolveEffects` emits `byTarget` in FIRST-SEEN EFFECT ORDER, so the array this
 * returns is in the source's declaration order — which is exactly the stable
 * tie-break key `splitDamageAcrossChannels` needs. Both damage resolvers go
 * through here rather than each walking `byTarget` themselves, so a single-attack
 * and an area effect can never disagree about what the channels are.
 *
 * Two judgements are encoded:
 *
 *  - Only channels with a POSITIVE total take part. A typed channel that rolled 0
 *    has no claim on the damage, and admitting it would let a channel that dealt
 *    nothing collect a rounding unit off a channel that did.
 *  - Every non-`damage.<type>` target merges into ONE untyped channel. Untyped
 *    damage is never mitigated, so keeping it whole and separate is what stops
 *    resistance from eating points it has no claim to — and stops the split from
 *    scattering those points across several indistinguishable buckets.
 */
export function collectDamageChannels(
  byTarget: Readonly<Record<string, { total: number }>>
): DamageChannel[] {
  const channels: DamageChannel[] = [];
  const indexByType = new Map<string, number>();

  for (const [target, resolved] of Object.entries(byTarget)) {
    if (!(resolved.total > 0)) continue;
    const type = target.startsWith('damage.')
      ? (target.slice('damage.'.length) as DamageType)
      : undefined;
    const key = type ?? '';
    const existing = indexByType.get(key);
    if (existing === undefined) {
      indexByType.set(key, channels.length);
      channels.push({ type, weight: resolved.total });
    } else {
      channels[existing].weight += resolved.total;
    }
  }

  return channels;
}

/** Non-finite or negative weights are meaningless here; clamp rather than throw. */
function sanitizeWeight(weight: number): number {
  return Number.isFinite(weight) && weight > 0 ? weight : 0;
}

/**
 * Distribute `total` across `channels` by largest remainder.
 *
 * Returns one entry per input channel, in input order, whose amounts sum exactly
 * to `total`.
 *
 * Negative totals (healing, which shares the signed `amount` field) are split on
 * their magnitude and re-signed, so the sum is preserved there too rather than
 * `Math.floor` quietly rounding away from zero. Mitigation ignores healing
 * anyway; this just keeps the transform total-preserving for every input, as the
 * post-condition claims.
 *
 * @throws if `total` is not a finite integer, if there are no channels to split a
 *   non-zero total across, or — as a self-check — if the parts ever fail to sum
 *   to the whole.
 */
export function splitDamageAcrossChannels(
  total: number,
  channels: readonly DamageChannel[]
): DamageChannelAmount[] {
  // Order matters. This check used to sit BEFORE the integer check and before the
  // post-condition, so `splitDamageAcrossChannels(5, [])` returned `[]` — sum 0
  // against a total of 5 — silently destroying damage while the docstring claimed
  // a universal total-preserving guarantee. Every call site happens to guard on
  // `channels.length > 0`, so nothing leaked in practice, but the guarantee lived
  // in the callers rather than in the transform that advertised it.
  //
  // An empty split of a ZERO total is genuinely nothing to do, and is preserved:
  // sum 0 === total 0.
  if (channels.length === 0) {
    if (total !== 0) {
      throw new Error(
        `splitDamageAcrossChannels: cannot split a total of ${String(total)} across zero channels ` +
          'without destroying damage.'
      );
    }
    return [];
  }
  if (!Number.isInteger(total)) {
    throw new Error(
      `splitDamageAcrossChannels: total must be a finite integer, received ${String(total)}`
    );
  }
  // One channel owns everything, with no arithmetic to get wrong.
  if (channels.length === 1) {
    return [{ type: channels[0].type, amount: total }];
  }

  const sign = total < 0 ? -1 : 1;
  const magnitude = Math.abs(total);

  let weights = channels.map((channel) => sanitizeWeight(channel.weight));
  let weightSum = weights.reduce((sum, weight) => sum + weight, 0);
  // Degenerate input (every channel zero-weight): fall back to an even split
  // rather than dividing by zero. Still deterministic, still total-preserving.
  if (weightSum <= 0) {
    weights = channels.map(() => 1);
    weightSum = channels.length;
  }

  // Floor each exact share. `magnitude * weight` is kept as the numerator so the
  // remainder comparison below is exact integer arithmetic for integer weights
  // (which is what damage totals always are) rather than a float subtraction.
  const amounts = weights.map((weight) => Math.floor((magnitude * weight) / weightSum));
  const remainders = weights.map(
    (weight, index) => magnitude * weight - amounts[index] * weightSum
  );

  const assigned = amounts.reduce((sum, amount) => sum + amount, 0);
  const leftover = magnitude - assigned;

  // Rank by remainder desc, then weight desc (the biggest channel absorbs the
  // remainder), then declaration order — a total order over the input array, so
  // the result never depends on how the caller's channels were enumerated.
  const ranked = channels
    .map((_, index) => index)
    .sort((a, b) => {
      if (remainders[a] !== remainders[b]) return remainders[b] - remainders[a];
      if (weights[a] !== weights[b]) return weights[b] - weights[a];
      return a - b;
    });

  for (let i = 0; i < leftover; i += 1) {
    amounts[ranked[i]] += 1;
  }

  const parts = channels.map((channel, index) => ({
    type: channel.type,
    amount: sign * amounts[index],
  }));

  // POST-CONDITION: the parts sum exactly to the whole, for every input.
  const partSum = parts.reduce((sum, part) => sum + part.amount, 0);
  if (partSum !== total) {
    throw new Error(
      `splitDamageAcrossChannels: parts summed to ${partSum}, expected ${total}. ` +
        'Damage was created or destroyed by the split.'
    );
  }

  return parts;
}
