/**
 * D&D 5e (2014) - Cleric Channel Divinity Options
 *
 * This content is derived from the System Reference Document and is
 * released under the Open Gaming License v1.0a.
 *
 * Source: SRD 5.1
 * License: OGL v1.0a
 */

export interface ChannelDivinityOption {
  id: string;
  name: string;
  description: string;
  system: 'dnd-5e-2014';
  source: { book: string; page: number };
  domain?: 'knowledge' | 'life' | 'light' | 'nature' | 'tempest' | 'trickery' | 'war';
  actionType: 'action' | 'reaction' | 'bonus';
  minLevel: number;
  version: string;
}

export const channelDivinityOptions: ChannelDivinityOption[] = [
  {
    id: 'turn-undead',
    name: 'Turn Undead',
    description:
      "As an action, you present your holy symbol and speak a prayer censuring the undead. Each undead that can see or hear you within 30 feet of you must make a Wisdom saving throw. If the creature fails its saving throw, it is turned for 1 minute or until it takes any damage. A turned creature must spend its turns trying to move as far away from you as it can, and it can't willingly move to a space within 30 feet of you. It also can't take reactions. For its action, it can use only the Dash action or try to escape from an effect that prevents it from moving. If there's nowhere to move, the creature can use the Dodge action.",
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 17 },
    actionType: 'action',
    minLevel: 2,
    version: '1.0.0',
  },
  {
    id: 'knowledge-of-the-ages',
    name: 'Knowledge of the Ages',
    description:
      'You can use your Channel Divinity to tap into a divine well of knowledge. As an action, you choose one skill or tool. For 10 minutes, you have proficiency with the chosen skill or tool.',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 18 },
    domain: 'knowledge',
    actionType: 'action',
    minLevel: 2,
    version: '1.0.0',
  },
  {
    id: 'read-thoughts',
    name: 'Read Thoughts',
    description:
      "You can use your Channel Divinity to read a creature's thoughts. You can then use your access to the creature's mind to command it. As an action, choose one creature that you can see within 60 feet of you. That creature must make a Wisdom saving throw. If the creature succeeds on the saving throw, you can't use this feature on it again until you finish a long rest. If the creature fails its save, you can read its surface thoughts (those foremost in its mind, reflecting its current emotions and what it is actively thinking about) when it is within 60 feet of you. This effect lasts for 1 minute. During that time, you can use your action to end this effect and cast the suggestion spell on the creature without expending a spell slot. The target automatically fails its saving throw against the spell.",
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 18 },
    domain: 'knowledge',
    actionType: 'action',
    minLevel: 6,
    version: '1.0.0',
  },
  {
    id: 'preserve-life',
    name: 'Preserve Life',
    description:
      "You can use your Channel Divinity to heal the badly injured. As an action, you present your holy symbol and evoke healing energy that can restore a number of hit points equal to five times your cleric level. Choose any creatures within 30 feet of you, and divide those hit points among them. This feature can restore a creature to no more than half of its hit point maximum. You can't use this feature on an undead or a construct.",
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 19 },
    domain: 'life',
    actionType: 'action',
    minLevel: 2,
    version: '1.0.0',
  },
  {
    id: 'radiance-of-the-dawn',
    name: 'Radiance of the Dawn',
    description:
      'You can use your Channel Divinity to harness sunlight, banishing darkness and dealing radiant damage to your foes. As an action, you present your holy symbol, and any magical darkness within 30 feet of you is dispelled. Additionally, each hostile creature within 30 feet of you must make a Constitution saving throw. A creature takes radiant damage equal to 2d10 + your cleric level on a failed saving throw, and half as much damage on a successful one. A creature that has total cover from you is not affected.',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 20 },
    domain: 'light',
    actionType: 'action',
    minLevel: 2,
    version: '1.0.0',
  },
  {
    id: 'charm-animals-and-plants',
    name: 'Charm Animals and Plants',
    description:
      'You can use your Channel Divinity to charm animals and plants. As an action, you present your holy symbol and invoke the name of your deity. Each beast or plant creature that can see you within 30 feet of you must make a Wisdom saving throw. If the creature fails its saving throw, it is charmed by you for 1 minute or until it takes damage. While it is charmed by you, it is friendly to you and other creatures you designate.',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 20 },
    domain: 'nature',
    actionType: 'action',
    minLevel: 2,
    version: '1.0.0',
  },
  {
    id: 'dampen-elements',
    name: 'Dampen Elements',
    description:
      'You can use your Channel Divinity to grant yourself or nearby allies resistance to elemental damage. When you or a creature within 30 feet of you takes acid, cold, fire, lightning, or thunder damage, you can use your reaction to grant resistance to the creature against that instance of the damage.',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 20 },
    domain: 'nature',
    actionType: 'reaction',
    minLevel: 6,
    version: '1.0.0',
  },
  {
    id: 'destructive-wrath',
    name: 'Destructive Wrath',
    description:
      'You can use your Channel Divinity to wield the power of the storm with unchecked ferocity. When you roll lightning or thunder damage, you can use your Channel Divinity to deal maximum damage, instead of rolling.',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 21 },
    domain: 'tempest',
    actionType: 'action',
    minLevel: 2,
    version: '1.0.0',
  },
  {
    id: 'invoke-duplicity',
    name: 'Invoke Duplicity',
    description:
      "You can use your Channel Divinity to create an illusory duplicate of yourself. As an action, you create a perfect illusion of yourself that lasts for 1 minute, or until you lose your concentration (as if you were concentrating on a spell). The illusion appears in an unoccupied space that you can see within 30 feet of you. As a bonus action on your turn, you can move the illusion up to 30 feet to a space you can see, but it must remain within 120 feet of you. For the duration, you can cast spells as though you were in the illusion's space, but you must use your own senses. Additionally, when both you and your illusion are within 5 feet of a creature that can see the illusion, you have advantage on attack rolls against that creature, given how distracting the illusion is to the target.",
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 21 },
    domain: 'trickery',
    actionType: 'action',
    minLevel: 2,
    version: '1.0.0',
  },
  {
    id: 'cloak-of-shadows',
    name: 'Cloak of Shadows',
    description:
      'You can use your Channel Divinity to vanish. As an action, you become invisible until the end of your next turn. You become visible if you attack or cast a spell.',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 21 },
    domain: 'trickery',
    actionType: 'action',
    minLevel: 6,
    version: '1.0.0',
  },
  {
    id: 'guided-strike',
    name: 'Guided Strike',
    description:
      'You can use your Channel Divinity to strike with supernatural accuracy. When you make an attack roll, you can use your Channel Divinity to gain a +10 bonus to the roll. You make this choice after you see the roll, but before the DM says whether the attack hits or misses.',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 22 },
    domain: 'war',
    actionType: 'action',
    minLevel: 2,
    version: '1.0.0',
  },
  {
    id: 'war-gods-blessing',
    name: "War God's Blessing",
    description:
      'When a creature within 30 feet of you makes an attack roll, you can use your reaction to grant that creature a +10 bonus to the roll, using your Channel Divinity. You make this choice after you see the roll, but before the DM says whether the attack hits or misses.',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 22 },
    domain: 'war',
    actionType: 'reaction',
    minLevel: 6,
    version: '1.0.0',
  },
];
