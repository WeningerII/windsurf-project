import type {
  DaggerheartAutomationMode,
  DaggerheartDomainCard,
} from '../../../../types/daggerheart';

type DomainCardAutomationOverride = Pick<
  DaggerheartDomainCard,
  | 'automationMode'
  | 'passiveBonuses'
  | 'passiveDerivedBonuses'
  | 'passiveCondition'
  | 'effectTags'
  | 'automationNote'
>;

const DOMAIN_CARD_AUTOMATION_OVERRIDES: Record<string, DomainCardAutomationOverride> = {
  'arcana-telekinesis': {
    automationMode: 'passive',
    passiveBonuses: { spellcast: 1 },
    passiveCondition: {
      kind: 'loadout-domain-count-at-least',
      domain: 'arcana',
      count: 4,
    },
    effectTags: ['loadout-synergy', 'spellcast', 'mobility', 'offense'],
    automationNote:
      'Auto-applies +1 Spellcast while 4 or more Arcana cards remain in your loadout. Movement, thrown-target attacks, and the spell text remain manual.',
  },
  'arcana-arcana-touched': {
    automationMode: 'passive',
    passiveBonuses: { spellcast: 1 },
    passiveCondition: {
      kind: 'loadout-domain-count-at-least',
      domain: 'arcana',
      count: 4,
    },
    effectTags: ['loadout-synergy', 'spellcast'],
    automationNote:
      'Auto-applies +1 Spellcast while 4 or more Arcana cards remain in your loadout. The Hope/Fear die swap remains manual.',
  },
  'blade-blade-touched': {
    automationMode: 'passive',
    passiveBonuses: { severeThreshold: 4 },
    passiveCondition: {
      kind: 'loadout-domain-count-at-least',
      domain: 'blade',
      count: 4,
    },
    effectTags: ['loadout-synergy', 'thresholds'],
    automationNote:
      'Auto-applies +4 Severe threshold while 4 or more Blade cards remain in your loadout. Attack-roll bonuses remain manual.',
  },
  'blade-fortified-armor': {
    automationMode: 'passive',
    passiveBonuses: { majorThreshold: 2, severeThreshold: 2 },
    passiveCondition: { kind: 'while-armored' },
    effectTags: ['armor', 'thresholds'],
    automationNote: 'Auto-applies +2 damage thresholds while armor is equipped.',
  },
  'bone-bone-touched': {
    automationMode: 'passive',
    passiveBonuses: { attributes: { agility: 1 } },
    passiveCondition: {
      kind: 'loadout-domain-count-at-least',
      domain: 'bone',
      count: 4,
    },
    effectTags: ['attributes', 'loadout-synergy'],
    automationNote:
      'Auto-applies +1 Agility while 4 or more Bone cards remain in your loadout. The once-per-rest defensive rider remains manual.',
  },
  'bone-i-see-it-coming': {
    automationMode: 'passive',
    passiveDerivedBonuses: [{ kind: 'evasion-half-trait', trait: 'agility' }],
    effectTags: ['defense', 'evasion'],
    automationNote: 'Auto-applies an Evasion bonus equal to half your current Agility.',
  },
  'bone-untouchable': {
    automationMode: 'passive',
    passiveDerivedBonuses: [{ kind: 'evasion-half-trait', trait: 'agility' }],
    effectTags: ['defense', 'evasion'],
    automationNote:
      'Auto-applies an Evasion bonus equal to half your current Agility. Other triggered defensive effects remain manual.',
  },
  'grace-notorious': {
    automationMode: 'reference-only',
    effectTags: ['narrative', 'social'],
    automationNote:
      'Reference-only card. Apply narrative discounts and the pre-roll +10 option manually at the table.',
  },
  'splendor-splendor-touched': {
    automationMode: 'passive',
    passiveBonuses: { severeThreshold: 3 },
    passiveCondition: {
      kind: 'loadout-domain-count-at-least',
      domain: 'splendor',
      count: 4,
    },
    effectTags: ['loadout-synergy', 'thresholds'],
    automationNote:
      'Auto-applies +3 Severe threshold while 4 or more Splendor cards remain in your loadout. The once-per-long-rest damage swap remains manual.',
  },
  'valor-armorer': {
    automationMode: 'passive',
    passiveBonuses: { armorScore: 1 },
    passiveCondition: { kind: 'while-armored' },
    effectTags: ['armor', 'defense'],
    automationNote:
      'Auto-applies +1 Armor Score while armor is equipped. The rest-time repair rider remains manual.',
  },
  'valor-bare-bones': {
    automationMode: 'passive',
    passiveDerivedBonuses: [
      {
        kind: 'unarmored-defense-by-tier',
        armorScoreBase: 3,
        trait: 'strength',
        thresholdsByTier: {
          1: { major: 9, severe: 19 },
          2: { major: 11, severe: 24 },
          3: { major: 13, severe: 31 },
          4: { major: 15, severe: 38 },
        },
      },
    ],
    passiveCondition: { kind: 'while-unarmored' },
    effectTags: ['defense', 'thresholds', 'unarmored'],
    automationNote:
      'Auto-applies the unarmored Armor Score and threshold bases from Bare Bones while no armor is equipped.',
  },
  'valor-rise-up': {
    automationMode: 'passive',
    passiveDerivedBonuses: [{ kind: 'severe-threshold-proficiency' }],
    effectTags: ['thresholds'],
    automationNote:
      'Auto-applies a Severe threshold bonus equal to your current Proficiency. The stress-clearing rider remains manual.',
  },
  'valor-valor-touched': {
    automationMode: 'passive',
    passiveBonuses: { armorScore: 1 },
    passiveCondition: {
      kind: 'loadout-domain-count-at-least',
      domain: 'valor',
      count: 4,
    },
    effectTags: ['defense', 'loadout-synergy'],
    automationNote:
      'Auto-applies +1 Armor Score while 4 or more Valor cards remain in your loadout. The armor-recovery rider remains manual.',
  },
};

function getDefaultAutomationMode(_card: DaggerheartDomainCard): DaggerheartAutomationMode {
  return 'triggered-manual';
}

function getDefaultAutomationNote(
  card: DaggerheartDomainCard,
  automationMode: DaggerheartAutomationMode
) {
  if (automationMode === 'reference-only') {
    return 'Reference-only card. Resolve its narrative or GM-facing effects manually.';
  }

  if (card.type === 'spell' || card.type === 'grimoire') {
    return 'Spell and triggered text remains manual.';
  }

  return 'Triggered, choice-based, or rest-based effects remain manual.';
}

function getSpecificEffectTags(card: DaggerheartDomainCard) {
  const tags: string[] = [];
  const description = card.description;

  if (/4 or more of the domain cards in your loadout/i.test(description)) {
    tags.push('loadout-synergy');
  }

  if (/\bArmor Score\b/i.test(description)) {
    tags.push('armor', 'defense');
  }

  if (/\bEvasion\b/i.test(description)) {
    tags.push('defense', 'evasion');
  }

  if (/\bthresholds?\b/i.test(description)) {
    tags.push('thresholds');
  }

  if (/\bwhile unarmored\b/i.test(description) || /choose not to equip armor/i.test(description)) {
    tags.push('unarmored');
  }

  if (
    /\bbonus to (?:your )?Spellcast Rolls?\b/i.test(description) ||
    /\badd your Proficiency to a Spellcast Roll\b/i.test(description) ||
    /\bequal to your Spellcast trait\b/i.test(description)
  ) {
    tags.push('spellcast');
  }

  if (
    /\bbonus to all of your character traits\b/i.test(description) ||
    /\bbonus to your (?:Agility|Strength|Finesse|Instinct|Presence|Knowledge)\b/i.test(
      description
    ) ||
    /\bmake your (?:Agility|Strength|Finesse|Instinct|Presence|Knowledge) equal to\b/i.test(
      description
    ) ||
    /\bdouble your (?:Agility|Strength|Finesse|Instinct|Presence|Knowledge)(?: or (?:Agility|Strength|Finesse|Instinct|Presence|Knowledge))?\b/i.test(
      description
    )
  ) {
    tags.push('attributes');
  }

  return dedupeTags(tags);
}

function getFallbackEffectTags(card: DaggerheartDomainCard) {
  const tags: string[] = [];
  const description = card.description;

  if (
    /\bclear (?:a|an|\d+)? ?(?:Hit Point|Hit Points|Stress)\b/i.test(description) ||
    /\bheal\b/i.test(description) ||
    /\brestore\b/i.test(description) ||
    /\breduce incoming damage\b/i.test(description) ||
    /\bally\b/i.test(description) ||
    /\bgain(?:s)? a Hope\b/i.test(description)
  ) {
    tags.push('support');
  }

  if (
    /\bdeal [^.!?]* damage\b/i.test(description) ||
    /\bdamage roll\b/i.test(description) ||
    /\bmake an attack\b/i.test(description) ||
    /\battack against\b/i.test(description) ||
    /\btargets you succeed against take\b/i.test(description)
  ) {
    tags.push('offense');
  }

  if (
    /\bRestrain(?:ed)?\b/i.test(description) ||
    /\bStun(?:ned)?\b/i.test(description) ||
    /\bVulnerable\b/i.test(description) ||
    /\bHidden\b/i.test(description) ||
    /\bInvisible\b/i.test(description) ||
    /\bSilenced?\b/i.test(description) ||
    /\bEnraptured\b/i.test(description) ||
    /\bAsleep\b/i.test(description) ||
    /\bOn Fire\b/i.test(description) ||
    /\bCorroded\b/i.test(description) ||
    /\bbanish(?:ed)?\b/i.test(description) ||
    /\bcan(?:not|'t) use reactions\b/i.test(description) ||
    /\bdifficult to move through\b/i.test(description)
  ) {
    tags.push('control');
  }

  if (
    /\bteleport\b/i.test(description) ||
    /\bflight\b/i.test(description) ||
    /\bflying\b/i.test(description) ||
    /\bclimb on walls\b/i.test(description) ||
    /\bmove anywhere\b/i.test(description) ||
    /\bmove out of Melee range\b/i.test(description) ||
    /\bportal\b/i.test(description) ||
    /\bpass through\b/i.test(description) ||
    /\blevitation\b/i.test(description) ||
    /\blift a target\b/i.test(description)
  ) {
    tags.push('mobility');
  }

  if (
    /\bsummon\b/i.test(description) ||
    /\bconjure\b/i.test(description) ||
    /\bconstruct\b/i.test(description) ||
    /\bfamiliar\b/i.test(description) ||
    /\bspirit\b/i.test(description) ||
    /\bsprites\b/i.test(description) ||
    /\bbeetles\b/i.test(description) ||
    /\bmagical hand\b/i.test(description)
  ) {
    tags.push('summoning');
  }

  if (
    /\bask the GM\b/i.test(description) ||
    /\bquestion\b/i.test(description) ||
    /\bquestions\b/i.test(description) ||
    /\bspeak\b/i.test(description) ||
    /\btelepathy\b/i.test(description) ||
    /\billusion\b/i.test(description) ||
    /\bdisguise\b/i.test(description) ||
    /\breveal\b/i.test(description) ||
    /\btracking\b/i.test(description) ||
    /\btrack(?:ing)?\b/i.test(description) ||
    /\bsee through\b/i.test(description) ||
    /\blook through\b/i.test(description) ||
    /\bcommunicat/i.test(description) ||
    /\bmemory\b/i.test(description) ||
    /\bvision\b/i.test(description) ||
    /\bfuture\b/i.test(description) ||
    /\bcorpse answers\b/i.test(description)
  ) {
    tags.push('utility');
  }

  return dedupeTags(tags.length > 0 ? tags : ['utility']);
}

function getDefaultEffectTags(card: DaggerheartDomainCard) {
  const specificTags = getSpecificEffectTags(card);
  if (specificTags.length > 0) {
    return specificTags;
  }

  return getFallbackEffectTags(card);
}

function dedupeTags(tags: string[]) {
  return Array.from(new Set(tags.filter((tag) => tag.trim().length > 0)));
}

export function normalizeDaggerheartDomainCardAutomation(
  card: DaggerheartDomainCard
): DaggerheartDomainCard {
  const override = DOMAIN_CARD_AUTOMATION_OVERRIDES[card.id];
  const automationMode = override?.automationMode ?? getDefaultAutomationMode(card);

  return {
    ...card,
    automationMode,
    passiveBonuses: override?.passiveBonuses,
    passiveDerivedBonuses: override?.passiveDerivedBonuses,
    passiveCondition: override?.passiveCondition,
    effectTags: dedupeTags([...getDefaultEffectTags(card), ...(override?.effectTags ?? [])]),
    automationNote: override?.automationNote ?? getDefaultAutomationNote(card, automationMode),
  };
}
