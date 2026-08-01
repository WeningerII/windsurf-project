import type { DamageType } from '../../types/core/common';
import type {
  SceneActionIntent,
  SceneIssue,
  SceneState,
  SceneTokenDamage,
} from '../../types/core/scene';
import { splitDamageAcrossChannels, type DamageChannelAmount } from './damageChannelSplit';
import { mitigateDamage, type DamageMitigation } from './damageMitigation';
import { damageEntriesForChannels } from './sceneCombat';

/**
 * Manual (ad-hoc) typed damage — the L8 INPUT SURFACE.
 *
 * WHY THIS EXISTS. The L8 transform (`damageMitigation.ts`) and the 394 shipped
 * resistance declarations were joined to real combat by the resolver bridge, but
 * only for damage that came out of a resolved attack. Every other way damage
 * reaches a scene — a GM applying a trap, a falling rock, a spell the engine
 * doesn't model, "the dragon breathes, take 22" — had to hand-build a
 * `{ tokenId, amount }` entry, and untyped damage is never mitigated. So a fire
 * elemental still took full fire damage from every source a human typed in. The
 * data was read by nothing on that path because there was no way to say "fire".
 *
 * WHAT THIS MODULE IS. Everything between a human's input and a
 * `SceneActionIntent`, and nothing beyond it:
 *
 *   text  ──parseManualDamage──▶  channels  ──buildManualDamageIntent──▶  intent
 *                                     │
 *                                     └──previewManualDamage──▶  advisory display
 *
 * The intent then goes through `resolveSceneAction` exactly like a resolved
 * attack's does.
 *
 * IT DOES NOT MITIGATE, AND THAT IS THE POINT. There is exactly one place typed
 * mitigation is applied — `mitigateSceneDamage`, called from
 * `buildEventFromIntent` in `src/scene/runtime.ts`, beside the RNG draw at event
 * BUILD time. RFC 006's byte-identical replay depends on mitigation never
 * happening in the fold, and "both paths agree" is only structurally true if
 * there is one implementation to agree with. This module therefore emits the
 * same `apply-damage` intent shape the resolver bridge emits (via the shared
 * `damageEntriesForChannels`) and lets the runtime do the arithmetic. A manual
 * "10 fire" and a resolved 10-fire attack produce the identical event payload.
 *
 * THE ONE SAFETY RULE OF THE PARSER: an unrecognized type token is an ERROR, it
 * never falls back to untyped. Untyped damage is silently unmitigated, so a
 * typo'd "10 frost" that quietly became untyped 10 would bypass a target's cold
 * resistance with no visible sign that anything went wrong — the exact failure
 * this whole thread exists to close. The vocabulary is closed and the parser
 * says so out loud.
 *
 * NO FUZZY MATCHING, NO ALIASES, DELIBERATELY. `lightning` (5e) and
 * `electricity` (3.5e) are distinct members of `DamageType` and a statblock
 * declares one or the other. An alias table mapping "electric" onto either one
 * would silently fail to match the resistances of every monster written for the
 * other system. Matching is exact (case- and whitespace-insensitive); the UI is
 * expected to offer `DAMAGE_TYPES` as a picker rather than ask a human to spell
 * it. See the note on that list for the narrowing question this leaves open.
 */

/**
 * Every damage type, as data.
 *
 * Declared as a `Record<DamageType, true>` rather than a hand-kept array so the
 * COMPILER enforces completeness: adding a member to the `DamageType` union
 * without adding it here is a type error, not a silently unpickable type that a
 * GM can never enter. `Object.keys` on string keys preserves insertion order per
 * spec, so `DAMAGE_TYPES` is stable — it can be rendered as a picker without the
 * order shifting between engines.
 */
const DAMAGE_TYPE_TABLE: Record<DamageType, true> = {
  acid: true,
  bludgeoning: true,
  cold: true,
  fire: true,
  force: true,
  lightning: true,
  necrotic: true,
  piercing: true,
  poison: true,
  psychic: true,
  radiant: true,
  slashing: true,
  thunder: true,
  electricity: true,
  sonic: true,
};

/**
 * The closed vocabulary, in a stable order, for a picker.
 *
 * NOT narrowed per system, and that is a known open question rather than an
 * oversight: `lightning`/`thunder` are the 5e names and `electricity`/`sonic`
 * the 3.5e ones, so a 3.5e scene ideally would not offer `lightning` at all
 * (picking it would match no 3.5e statblock's declarations). Which types each
 * system uses is a rules claim that needs its own SRD grounding, so it is not
 * invented here — the full list ships and the narrowing is reported as
 * follow-up work.
 */
export const DAMAGE_TYPES: readonly DamageType[] = Object.keys(
  DAMAGE_TYPE_TABLE
) as readonly DamageType[];

/**
 * Whether a value is a recognized damage type.
 *
 * `hasOwnProperty` rather than `in` or a truthiness check so inherited object
 * keys (`constructor`, `toString`) can't be smuggled in as damage types from a
 * free-text field.
 */
export function isDamageType(value: unknown): value is DamageType {
  return (
    typeof value === 'string' && Object.prototype.hasOwnProperty.call(DAMAGE_TYPE_TABLE, value)
  );
}

/**
 * Normalize one human-entered type token, or `undefined` when it is not a
 * damage type. Case- and whitespace-insensitive; nothing else. Callers must
 * treat `undefined` as an error, never as "untyped" — see the module note.
 */
export function parseDamageType(raw: string): DamageType | undefined {
  if (typeof raw !== 'string') return undefined;
  const normalized = raw.trim().toLowerCase();
  return isDamageType(normalized) ? normalized : undefined;
}

/** One channel of a manual entry: a whole-number amount and an optional type. */
export interface ManualDamageChannelInput {
  amount: number;
  /** Absent means untyped, which is never mitigated. */
  type?: DamageType;
}

/** What a text entry parsed to. `channels` is empty whenever `issues` is not. */
export interface ManualDamageParse {
  channels: ManualDamageChannelInput[];
  issues: SceneIssue[];
}

/** A manual damage application, before it becomes an intent. */
export interface ManualDamageInput {
  /** Targets. Duplicates are collapsed so a double-selected token isn't hit twice. */
  tokenIds: readonly string[];
  channels: readonly ManualDamageChannelInput[];
  /**
   * When set, `channels[].amount` are read as WEIGHTS and this is the figure
   * actually dealt, apportioned across them by the same largest-remainder rule
   * the resolver uses (`splitDamageAcrossChannels`). This is the "22 damage,
   * two parts fire to one part cold" case; leave it unset when the human
   * already knows each channel's number.
   */
  total?: number;
  actorId?: string;
  cause?: string;
}

/** The built intent plus what it resolved to. No intent is returned when `issues` has errors. */
export interface ManualDamageResult {
  intent?: SceneActionIntent;
  issues: SceneIssue[];
  /**
   * The channels actually applied to each target, post-split and PRE-mitigation
   * (mitigation is per-target and happens at event build). Returned so a UI can
   * echo "6 slashing + 4 fire" back before committing.
   */
  channels: DamageChannelAmount[];
}

function issue(code: string, message: string, path?: string): SceneIssue {
  return { code, message, path, severity: 'error' };
}

/**
 * Grammar, deliberately tiny:
 *
 *   input := term (('+' | ',') term)*
 *   term  := integer [type] ['damage' | 'dmg']
 *
 * "10", "10 fire", "6 slashing + 4 fire", "4 fire, 6 cold", "-5" (healing),
 * "10 fire damage". Dice notation is NOT accepted: rolling here would put an RNG
 * draw outside `buildEventFromIntent`, which is where every other roll in the
 * scene runtime lives, so the human enters the rolled number.
 */
const TERM_PATTERN = /^([+-]?\d+)\s*([a-zA-Z]+)?$/;
const TRAILING_NOISE = /\s+(?:damage|dmg)\s*$/i;

/**
 * Parse a human's damage entry into channels.
 *
 * Every issue is reported (not just the first) so a UI can show all of them at
 * once, and `channels` is returned EMPTY whenever anything failed — a partially
 * parsed entry must never be applied, because the part that dropped out would be
 * damage the GM asked for and did not get.
 */
export function parseManualDamage(text: string): ManualDamageParse {
  const issues: SceneIssue[] = [];
  const source = typeof text === 'string' ? text.trim() : '';
  if (!source) {
    return {
      channels: [],
      issues: [
        issue(
          'scene-manual-damage-empty',
          'Enter an amount, e.g. "10", "10 fire", or "6 slashing + 4 fire".',
          'damage'
        ),
      ],
    };
  }

  // A leading sign is part of the first amount, not a separator.
  const terms = source.replace(/^\+/, '').split(/[+,]/);
  const channels: ManualDamageChannelInput[] = [];

  terms.forEach((term, index) => {
    const path = `damage.${index}`;
    const cleaned = term.replace(TRAILING_NOISE, '').trim();
    if (!cleaned) {
      issues.push(
        issue('scene-manual-damage-term-empty', 'An amount is missing between separators.', path)
      );
      return;
    }

    const match = TERM_PATTERN.exec(cleaned);
    if (!match) {
      issues.push(
        issue(
          'scene-manual-damage-term-invalid',
          `Could not read "${term.trim()}". Expected an amount and an optional type, e.g. "10 fire".`,
          path
        )
      );
      return;
    }

    const amount = Number(match[1]);
    if (!Number.isSafeInteger(amount)) {
      issues.push(
        issue('scene-manual-damage-amount-invalid', 'Damage amounts must be whole numbers.', path)
      );
      return;
    }

    const typeToken = match[2];
    if (typeToken === undefined) {
      channels.push({ amount });
      return;
    }

    const type = parseDamageType(typeToken);
    if (!type) {
      // NEVER silently untyped: see the module note. Untyped damage is
      // unmitigated, so a typo that degraded to untyped would bypass the
      // target's resistance invisibly.
      issues.push(
        issue(
          'scene-manual-damage-type-unknown',
          `"${typeToken}" is not a damage type. Use one of: ${DAMAGE_TYPES.join(', ')}.`,
          path
        )
      );
      return;
    }

    channels.push({ amount, type });
  });

  return { channels: issues.length > 0 ? [] : channels, issues };
}

/**
 * Merge channels that share a type, keeping first-seen order.
 *
 * Mirrors `collectDamageChannels`, so "3 fire + 4 fire" behaves exactly as a
 * source declaring two 'fire' effects does — one 7-point fire channel, not two
 * that each round independently.
 */
function mergeChannels(channels: readonly ManualDamageChannelInput[]): ManualDamageChannelInput[] {
  const merged: ManualDamageChannelInput[] = [];
  const indexByType = new Map<string, number>();
  for (const channel of channels) {
    const key = channel.type ?? '';
    const existing = indexByType.get(key);
    if (existing === undefined) {
      indexByType.set(key, merged.length);
      merged.push(channel.type === undefined ? { amount: channel.amount } : { ...channel });
    } else {
      merged[existing].amount += channel.amount;
    }
  }
  return merged;
}

/** First occurrence wins, so the caller's target order is preserved. */
function dedupe(ids: readonly string[]): string[] {
  return [...new Set(ids)];
}

/**
 * Turn a manual damage application into an `apply-damage` intent.
 *
 * One `SceneTokenDamage` entry per (target, channel) — the same shape the
 * resolver bridge emits for a multi-channel attack, built by the same helper, so
 * the runtime mitigates each channel independently against each target's
 * SNAPSHOTTED profile. Nothing here reads `src/data/**` and nothing here
 * computes mitigation.
 *
 * Returns `intent: undefined` with populated `issues` for anything a human can
 * plausibly type wrong; it does not throw. The only exception is arithmetic that
 * would be a bug rather than bad input, which `splitDamageAcrossChannels` still
 * asserts loudly.
 */
export function buildManualDamageIntent(input: ManualDamageInput): ManualDamageResult {
  const issues: SceneIssue[] = [];

  const tokenIds = dedupe(
    (input.tokenIds ?? []).filter((id) => typeof id === 'string' && id.trim().length > 0)
  );
  if (tokenIds.length === 0) {
    issues.push(
      issue(
        'scene-manual-damage-target-required',
        'Manual damage needs at least one target token.',
        'tokenIds'
      )
    );
  }

  const declared = input.channels ?? [];
  if (declared.length === 0) {
    issues.push(
      issue('scene-manual-damage-empty', 'Manual damage needs at least one amount.', 'channels')
    );
  }

  declared.forEach((channel, index) => {
    if (!Number.isSafeInteger(channel.amount)) {
      issues.push(
        issue(
          'scene-manual-damage-amount-invalid',
          'Damage amounts must be whole numbers.',
          `channels.${index}.amount`
        )
      );
    }
    if (channel.type !== undefined && !isDamageType(channel.type)) {
      issues.push(
        issue(
          'scene-manual-damage-type-unknown',
          `"${String(channel.type)}" is not a damage type.`,
          `channels.${index}.type`
        )
      );
    }
  });

  if (input.total !== undefined && !Number.isSafeInteger(input.total)) {
    issues.push(
      issue('scene-manual-damage-amount-invalid', 'The total must be a whole number.', 'total')
    );
  }

  // Everything below does arithmetic on the inputs, so bail while they are still
  // untrustworthy rather than reporting a second round of derived nonsense.
  if (issues.length > 0) {
    return { intent: undefined, issues, channels: [] };
  }

  const merged = mergeChannels(declared);
  let resolved: DamageChannelAmount[];

  if (input.total === undefined) {
    // Explicit per-channel amounts.
    const hasPositive = merged.some((channel) => channel.amount > 0);
    const hasNegative = merged.some((channel) => channel.amount < 0);
    if (hasPositive && hasNegative) {
      // One event that both damages and heals the same token is almost certainly
      // a typo, and the log would be unreadable. Two entries, two events.
      issues.push(
        issue(
          'scene-manual-damage-mixed-sign',
          'Damage and healing cannot be combined in one entry — apply them separately.',
          'channels'
        )
      );
    }
    if (merged.some((channel) => channel.amount < 0 && channel.type !== undefined)) {
      issues.push(
        issue(
          'scene-manual-damage-healing-typed',
          'Healing has no damage type — a fire-immune creature is not immune to being healed.',
          'channels'
        )
      );
    }
    if (issues.length > 0) {
      return { intent: undefined, issues, channels: [] };
    }
    resolved = merged.map((channel) => ({ type: channel.type, amount: channel.amount }));
  } else {
    // Weights + a total: apportioned by the resolver's own rule, so a manual
    // split and a resolved multi-channel attack can never round differently.
    if (merged.some((channel) => channel.amount < 0)) {
      issues.push(
        issue(
          'scene-manual-damage-weight-invalid',
          'Channel weights cannot be negative when a total is given.',
          'channels'
        )
      );
    }
    if (input.total < 0 && merged.some((channel) => channel.type !== undefined)) {
      issues.push(
        issue(
          'scene-manual-damage-healing-typed',
          'Healing has no damage type — a fire-immune creature is not immune to being healed.',
          'channels'
        )
      );
    }
    if (issues.length > 0) {
      return { intent: undefined, issues, channels: [] };
    }
    resolved = splitDamageAcrossChannels(
      input.total,
      merged.map((channel) => ({ type: channel.type, weight: channel.amount }))
    );
  }

  const applied = resolved.filter((channel) => channel.amount !== 0);
  if (applied.length === 0) {
    return {
      intent: undefined,
      issues: [
        issue(
          'scene-manual-damage-amount-required',
          'Nothing to apply: every channel resolved to 0.',
          'channels'
        ),
      ],
      channels: [],
    };
  }

  const damages: SceneTokenDamage[] = tokenIds.flatMap((tokenId) =>
    damageEntriesForChannels(tokenId, applied)
  );

  return {
    intent: {
      type: 'apply-damage',
      actorId: input.actorId,
      cause: input.cause,
      damages,
    },
    issues,
    channels: applied,
  };
}

/**
 * Parse a text entry and build the intent in one call — the whole GM path from
 * "6 slashing + 4 fire" to something `resolveSceneAction` accepts.
 *
 * Passing `total` alongside text reads the text amounts as weights, so
 * `("2 fire + 1 cold", { total: 22 })` is "22 damage, two parts fire to one
 * part cold".
 */
export function manualDamageFromText(
  text: string,
  target: Omit<ManualDamageInput, 'channels'>
): ManualDamageResult {
  const parsed = parseManualDamage(text);
  if (parsed.issues.length > 0) {
    return { intent: undefined, issues: parsed.issues, channels: [] };
  }
  return buildManualDamageIntent({ ...target, channels: parsed.channels });
}

/** One channel of a preview, with the branch that explains its number. */
export interface ManualDamagePreviewChannel {
  type?: DamageType;
  /** Pre-mitigation. */
  raw: number;
  /** Post-mitigation — what the event will record. */
  amount: number;
  mitigation: DamageMitigation;
}

/** What one target is projected to take. */
export interface ManualDamagePreviewTarget {
  tokenId: string;
  tokenName?: string;
  channels: ManualDamagePreviewChannel[];
  /** Sum of the mitigated channel amounts. */
  total: number;
}

/**
 * Project what `channels` will do to each target, for display BEFORE the GM
 * commits — "10 fire → 5 (resistant)".
 *
 * ADVISORY ONLY. Feeding this output back into `buildManualDamageIntent` would
 * mitigate twice; the intent is always built from the PRE-mitigation channels
 * and the runtime does the arithmetic once, at event build. This is safe to show
 * because it calls the very same `mitigateDamage` that `mitigateSceneDamage`
 * calls against the very same snapshotted `token.damageProfile` — a preview that
 * re-implemented the rule could drift from the event, which is the defect this
 * whole thread is closing, so it does not re-implement it.
 */
export function previewManualDamage(
  state: SceneState,
  tokenIds: readonly string[],
  channels: readonly DamageChannelAmount[]
): ManualDamagePreviewTarget[] {
  return dedupe(tokenIds.filter((id) => typeof id === 'string' && id.length > 0)).map((tokenId) => {
    const token = state.tokens[tokenId];
    const previewed = channels
      .filter((channel) => channel.amount !== 0)
      .map((channel) => {
        const { amount, mitigation } = mitigateDamage(
          channel.amount,
          token?.damageProfile,
          channel.type
        );
        return { type: channel.type, raw: channel.amount, amount, mitigation };
      });
    return {
      tokenId,
      tokenName: token?.name,
      channels: previewed,
      total: previewed.reduce((sum, channel) => sum + channel.amount, 0),
    };
  });
}
