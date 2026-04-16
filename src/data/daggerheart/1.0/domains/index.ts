import type { DaggerheartDomain } from '../../../../types/daggerheart';

const source = 'Daggerheart SRD 1.0';
const sourceBook = {
  name: 'System Reference Document 1.0',
  url: 'https://www.daggerheart.com/srd/',
};
const lastUpdated = '2026-03-08';

export const daggerheartDomains: DaggerheartDomain[] = [
  {
    id: 'arcana',
    name: 'Arcana',
    system: 'daggerheart',
    source,
    version: '1.0',
    lastUpdated,
    sourceBook,
    description:
      'Arcana is the domain of innate and instinctual magic. Those who choose this path tap into the raw, enigmatic forces of the realms to manipulate both their own energy and the elements. Arcana offers wielders a volatile power, but it is incredibly potent when correctly channeled.',
    classIds: ['daggerheart-druid', 'daggerheart-sorcerer'],
  },
  {
    id: 'blade',
    name: 'Blade',
    system: 'daggerheart',
    source,
    version: '1.0',
    lastUpdated,
    sourceBook,
    description:
      'Blade is the domain of weapon mastery. Whether by steel, bow, or perhaps a more specialized arm, those who follow this path have the skill to cut short the lives of others. Wielders of Blade dedicate themselves to achieving inexorable power over death.',
    classIds: ['daggerheart-guardian', 'daggerheart-warrior'],
  },
  {
    id: 'bone',
    name: 'Bone',
    system: 'daggerheart',
    source,
    version: '1.0',
    lastUpdated,
    sourceBook,
    description:
      'Bone is the domain of tactics and the body. Practitioners of this domain have an uncanny control over their own physical abilities and an eye for predicting the behaviors of others in combat. Adherents to Bone gain an unparalleled understanding of bodies and their movements.',
    classIds: ['daggerheart-ranger', 'daggerheart-warrior'],
  },
  {
    id: 'codex',
    name: 'Codex',
    system: 'daggerheart',
    source,
    version: '1.0',
    lastUpdated,
    sourceBook,
    description:
      'Codex is the domain of intensive magical study. Those who seek magical knowledge turn to the equations of power recorded in books, written on scrolls, etched into walls, or tattooed on bodies. Codex offers a commanding and versatile understanding of magic to devotees who pursue knowledge beyond the boundaries of common wisdom.',
    classIds: ['daggerheart-bard', 'daggerheart-wizard'],
  },
  {
    id: 'grace',
    name: 'Grace',
    system: 'daggerheart',
    source,
    version: '1.0',
    lastUpdated,
    sourceBook,
    description:
      'Grace is the domain of charisma. Through rapturous storytelling, charming spells, or a shroud of lies, those who channel this power define the realities of their adversaries, bending perception to their will. Grace offers its wielders raw magnetism and mastery over language.',
    classIds: ['daggerheart-bard', 'daggerheart-rogue'],
  },
  {
    id: 'midnight',
    name: 'Midnight',
    system: 'daggerheart',
    source,
    version: '1.0',
    lastUpdated,
    sourceBook,
    description:
      'Midnight is the domain of shadows and secrecy. Whether by clever tricks, deft magic, or the cloak of night, those who channel these forces practice the art of obscurity and can uncover sequestered treasures. Midnight offers practitioners the power to control and create enigmas.',
    classIds: ['daggerheart-rogue', 'daggerheart-sorcerer'],
  },
  {
    id: 'sage',
    name: 'Sage',
    system: 'daggerheart',
    source,
    version: '1.0',
    lastUpdated,
    sourceBook,
    description:
      'Sage is the domain of the natural world. Those who walk this path tap into the unfettered power of the earth and its creatures to unleash raw magic. Sage grants its adherents the vitality of a blooming flower and the ferocity of a ravenous predator.',
    classIds: ['daggerheart-druid', 'daggerheart-ranger'],
  },
  {
    id: 'splendor',
    name: 'Splendor',
    system: 'daggerheart',
    source,
    version: '1.0',
    lastUpdated,
    sourceBook,
    description:
      'Splendor is the domain of life. Through this magic, followers gain the ability to heal and, to an extent, control death. Splendor offers its disciples the magnificent ability to both give and end life.',
    classIds: ['daggerheart-seraph', 'daggerheart-wizard'],
  },
  {
    id: 'valor',
    name: 'Valor',
    system: 'daggerheart',
    source,
    version: '1.0',
    lastUpdated,
    sourceBook,
    description:
      'Valor is the domain of protection. Whether through attack or defense, those who choose this discipline channel formidable strength to protect their allies in battle. Valor offers great power to those who raise their shields in defense of others.',
    classIds: ['daggerheart-guardian', 'daggerheart-seraph'],
  },
];

export const daggerheartDomainsById = Object.fromEntries(
  daggerheartDomains.map((domain) => [domain.id, domain])
) as Record<string, DaggerheartDomain>;

export function getDaggerheartDomain(id: string): DaggerheartDomain | undefined {
  return daggerheartDomainsById[id];
}
