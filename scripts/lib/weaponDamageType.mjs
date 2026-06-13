/**
 * Canonical physical damage type by attack NAME, used by the d20-legacy monster
 * encoders (pf1e / 3.5e) ONLY as a fallback when the source omits a parseable
 * damage type. A longsword IS slashing and a bite IS piercing by the rules —
 * this is a rules-defined derivation from the weapon's identity, not a guess.
 *
 * An unrecognized name returns null; the caller then leaves the damage type
 * UNASSERTED (ActionDamage.type is optional) rather than fabricating one. This
 * replaces the prior `?? 'bludgeoning'` default, which silently mislabeled
 * hundreds of slashing/piercing attacks. Non-physical attacks (Touch, Ray,
 * Incorporeal Touch, breath) legitimately return null and stay untyped.
 *
 * Patterns are evaluated in order; specific names precede generic substrings so
 * that e.g. 'short sword' (piercing) is matched before any 'sword' rule. Each
 * group tolerates a regular plural (`(?:e?s)?` → Claws, Bites, Axes); irregular
 * plurals (Hooves) are listed explicitly.
 */

const RULES = [
  // ── manufactured: PIERCING (must precede the slashing 'sword' rule) ──
  [
    /\b(?:short\s?sword|rapier|dagger|punching\s?dagger|spear|long\s?spear|short\s?spear|javelin|pike|lance|trident|stiletto|estoc|sai|kukri|arrow|bolt|dart|needle|harpoon|ranseur|kama|cross\s?bow|long\s?bow|short\s?bow|composite\s?bow|bow|heavy\s?pick|light\s?pick|pick)(?:e?s)?\b/i,
    'piercing',
  ],
  // ── manufactured: SLASHING ──
  [
    /\b(?:long\s?sword|bastard\s?sword|great\s?sword|two-bladed\s?sword|scimitar|falchion|battle\s?axe|great\s?axe|hand\s?axe|throwing\s?axe|war\s?axe|axe|halberd|glaive|guisarme|scythe|sickle|whip|machete|katana|wakizashi|cutlass|sword)(?:e?s)?\b/i,
    'slashing',
  ],
  // ── manufactured: BLUDGEONING ──
  [
    /\b(?:mace|club|greatclub|great\s?club|war\s?hammer|warhammer|hammer|maul|morning\s?star|morningstar|flail|quarterstaff|staff|sling|nunchaku|sap|cudgel|gauntlet|rock)(?:e?s)?\b/i,
    'bludgeoning',
  ],
  // ── natural: PIERCING ──
  [
    /\b(?:bite|fang|sting|stinger|gore|tusk|horn|beak|proboscis|quill|spine|spike)(?:e?s)?\b/i,
    'piercing',
  ],
  // ── natural: SLASHING ──
  [/\b(?:claw|talon|rake|rend)(?:e?s)?\b/i, 'slashing'],
  // ── natural: BLUDGEONING (hoof/hooves irregular) ──
  [
    /\b(?:slam|tail|wing|hoof|hooves|stomp|trample|tentacle|tendril|constrict|pseudopod|pincer|tongue|chain)(?:e?s)?\b/i,
    'bludgeoning',
  ],
];

/** The weapon's canonical physical damage type, or null if undetermined. */
export function weaponDamageTypeByName(name) {
  const text = String(name ?? '');
  for (const [pattern, type] of RULES) {
    if (pattern.test(text)) return type;
  }
  return null;
}
