import type { DaggerheartLoot } from '../../../../types/daggerheart';
import { stripDiacritics } from '../../../../utils/unicode';

const source = 'Daggerheart SRD 1.0';
const sourceBook = {
  name: 'System Reference Document 1.0',
  url: 'https://www.daggerheart.com/srd/',
};
const lastUpdated = '2026-03-09';

function slugify(value: string): string {
  return stripDiacritics(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function loot(
  name: string,
  description: string,
  options: Pick<DaggerheartLoot, 'tags' | 'passiveBonuses'> = {}
): DaggerheartLoot {
  return {
    id: `daggerheart-loot-${slugify(name)}`,
    name,
    system: 'daggerheart',
    source,
    version: '1.0',
    lastUpdated,
    sourceBook,
    category: 'loot',
    description,
    ...options,
  };
}

export const daggerheartLoot: DaggerheartLoot[] = [
  loot('Premium Bedroll', 'During downtime, you automatically clear a Stress.', {
    tags: ['rest'],
  }),
  loot(
    'Piper Whistle',
    'This handcrafted whistle carries for miles when blown, making it easy to signal allies or draw attention.',
    { tags: ['utility', 'signal'] }
  ),
  loot(
    'Charging Quiver',
    'When you succeed on an attack with an arrow stored in this quiver, gain a bonus to the damage roll equal to your current tier.',
    { tags: ['weapon-upgrade', 'ranged'] }
  ),
  loot(
    "Alistair's Torch",
    'You can light this magic torch at will, and its flame fills a much larger space than it should.',
    { tags: ['light', 'utility'] }
  ),
  loot(
    'Speaking Orbs',
    'Any creatures holding this paired set of orbs can communicate with each other across any distance.',
    { tags: ['communication'] }
  ),
  loot('Manacles', 'This pair of locking cuffs comes with a key.', {
    tags: ['utility', 'restraint'],
  }),
  loot(
    'Arcane Cloak',
    'A creature with a Spellcast trait wearing this cloak can adjust its color, texture, and size at will.',
    { tags: ['spellcast', 'disguise'] }
  ),
  loot(
    'Woven Net',
    'You can make a Finesse Roll using this net to trap a small creature until it breaks free.',
    { tags: ['utility', 'control'] }
  ),
  loot(
    'Fire Jar',
    'You can pour out the strange liquid in this jar to instantly produce fire, and the contents regenerate after a long rest.',
    { tags: ['utility', 'fire'] }
  ),
  loot(
    'Suspended Rod',
    'When activated, this rune-inscribed rod stays fixed in place, ignores gravity, and cannot move until deactivated.',
    { tags: ['utility'] }
  ),
  loot(
    'Glamour Stone',
    'Activate this pebble-sized stone to memorize a creature’s appearance, then spend Hope to recreate that guise on yourself as an illusion.',
    { tags: ['illusion', 'disguise'] }
  ),
  loot(
    'Empty Chest',
    'This magical chest appears empty until you speak its trigger word or action and open it to reveal the stored contents.',
    { tags: ['storage', 'utility'] }
  ),
  loot(
    'Companion Case',
    'A small animal companion inside this case is protected from damage and harmful effects until released.',
    { tags: ['companion', 'storage'] }
  ),
  loot(
    'Piercing Arrows',
    'Three times per rest when you hit with one of these arrows, you can add your Proficiency to the damage roll.',
    { tags: ['weapon-upgrade', 'ranged'] }
  ),
  loot(
    'Valorstone',
    'Attach this stone to armor without a feature to grant it a resilience rider that can reduce the severity of your last armor mark.',
    { tags: ['armor-upgrade'] }
  ),
  loot(
    'Skeleton Key',
    'When you use this key to open a locked door, you gain advantage on the Finesse Roll.',
    { tags: ['utility', 'lockpicking'] }
  ),
  loot(
    'Arcane Prism',
    'Place and activate this prism so allies within Close range gain +1 to Spellcast Rolls until it is deactivated.',
    { tags: ['spellcast', 'support'], passiveBonuses: { spellcast: 1 } }
  ),
  loot(
    'Minor Stamina Potion Recipe',
    'As a downtime move, you can use the bone of a creature to craft a Minor Stamina Potion.',
    { tags: ['recipe'] }
  ),
  loot(
    'Minor Health Potion Recipe',
    'As a downtime move, you can use a vial of blood to craft a Minor Health Potion.',
    { tags: ['recipe'] }
  ),
  loot(
    'Homing Compasses',
    'These two compasses always point toward each other, no matter how far apart they are.',
    { tags: ['navigation'] }
  ),
  loot(
    'Corrector Sprite',
    'This tiny sprite whispers helpful advice in combat; once per short rest, you can gain advantage on an attack roll.',
    { tags: ['combat', 'support'] }
  ),
  loot('Gecko Gloves', 'You can climb up vertical surfaces and across ceilings.', {
    tags: ['mobility'],
  }),
  loot(
    'Lorekeeper',
    'Store the names and details of up to three hostile creatures inside this book to gain a bonus on rolls against them.',
    { tags: ['lore', 'tactics'] }
  ),
  loot(
    'Vial of Darksmoke Recipe',
    'As a downtime move, you can mark a Stress to craft a Vial of Darksmoke.',
    { tags: ['recipe'] }
  ),
  loot(
    'Bloodstone',
    'Attach this stone to a weapon without a feature to give it a brutal rider when you roll maximum damage.',
    { tags: ['weapon-upgrade'] }
  ),
  loot(
    'Greatstone',
    'Attach this stone to a weapon without a feature to roll an additional damage die and discard the lowest result on a successful hit.',
    { tags: ['weapon-upgrade'] }
  ),
  loot(
    'Glider',
    'While falling, you can mark a Stress to deploy this small parachute and glide safely to the ground.',
    { tags: ['mobility'] }
  ),
  loot(
    'Ring of Silence',
    'Spend a Hope to activate this ring and make your footsteps silent until your next rest.',
    { tags: ['stealth'] }
  ),
  loot(
    'Calming Pendant',
    'When you would mark your last Stress, this pendant gives you a chance to avoid taking that last mark.',
    { tags: ['defense', 'stress'] }
  ),
  loot(
    'Dual Flask',
    'This flask can hold two different liquids, and a small switch lets you swap between them.',
    { tags: ['utility', 'container'] }
  ),
  loot(
    'Bag of Ficklesand',
    'You can convince this sand to be much heavier or lighter, and a clever toss can briefly leave a target Vulnerable.',
    { tags: ['utility', 'control'] }
  ),
  loot(
    'Ring of Resistance',
    'Once per long rest, you can activate this ring after a successful attack against you to halve the damage.',
    { tags: ['defense'] }
  ),
  loot(
    'Phoenix Feather',
    'If you have at least one Phoenix Feather on you when you fall unconscious, you gain +1 on the roll to determine whether you gain a scar.',
    { tags: ['survival'] }
  ),
  loot(
    'Box of Many Goods',
    'Once per long rest, this box can produce one or two random common consumables.',
    { tags: ['consumable', 'utility'] }
  ),
  loot(
    'Airblade Charm',
    'Attach this charm to a melee weapon to make a limited number of Close-range attacks with it each rest.',
    { tags: ['weapon-upgrade', 'range'] }
  ),
  loot(
    'Portal Seed',
    'Plant this seed to grow a portal after a day, then travel between places where you have planted matching portal seeds.',
    { tags: ['travel', 'utility'] }
  ),
  loot(
    "Paragon's Chain",
    'Meditate on an ideal during downtime, then once per long rest spend a Hope to roll a d20 as your Hope Die on a roll aligned with that principle.',
    { tags: ['hope'] }
  ),
  loot(
    'Elusive Amulet',
    'Once per long rest, activate this amulet to become Hidden until you move.',
    { tags: ['stealth', 'defense'] }
  ),
  loot(
    'Hopekeeper Locket',
    'During a long rest, you can imbue this locket with stored resolve and cash it in later to immediately gain a Hope.',
    { tags: ['hope'] }
  ),
  loot(
    'Infinite Bag',
    'Items stored in this bag rest in a pocket dimension that never runs out of space.',
    { tags: ['storage'] }
  ),
  loot('Stride Relic', 'You gain a +1 bonus to your Agility. You can only carry one relic.', {
    tags: ['relic'],
    passiveBonuses: { attributes: { agility: 1 } },
  }),
  loot('Bolster Relic', 'You gain a +1 bonus to your Strength. You can only carry one relic.', {
    tags: ['relic'],
    passiveBonuses: { attributes: { strength: 1 } },
  }),
  loot('Control Relic', 'You gain a +1 bonus to your Finesse. You can only carry one relic.', {
    tags: ['relic'],
    passiveBonuses: { attributes: { finesse: 1 } },
  }),
  loot('Attune Relic', 'You gain a +1 bonus to your Instinct. You can only carry one relic.', {
    tags: ['relic'],
    passiveBonuses: { attributes: { instinct: 1 } },
  }),
  loot('Charm Relic', 'You gain a +1 bonus to your Presence. You can only carry one relic.', {
    tags: ['relic'],
    passiveBonuses: { attributes: { presence: 1 } },
  }),
  loot('Enlighten Relic', 'You gain a +1 bonus to your Knowledge. You can only carry one relic.', {
    tags: ['relic'],
    passiveBonuses: { attributes: { knowledge: 1 } },
  }),
  loot(
    'Honing Relic',
    'You gain a +1 bonus to an Experience of your choice. You can only carry one relic.',
    { tags: ['relic', 'experience'] }
  ),
  loot(
    'Flickerfly Pendant',
    'While you carry this pendant, physical melee weapons you wield can reach targets within Very Close range.',
    { tags: ['range', 'weapon-upgrade'] }
  ),
  loot('Lakestrider Boots', 'You can walk on the surface of water as if it were soft ground.', {
    tags: ['mobility'],
  }),
  loot(
    'Clay Companion',
    'Shape this ball of clay into a clay animal companion that retains memory and identity across forms.',
    { tags: ['companion'] }
  ),
  loot(
    'Mythic Dust Recipe',
    'As a downtime move, you can use fine gold dust to craft Mythic Dust.',
    { tags: ['recipe'] }
  ),
  loot(
    'Shard of Memory',
    'Once per long rest, spend Hope to recall a domain card from your vault instead of paying its Recall Cost.',
    { tags: ['domain-card', 'vault'] }
  ),
  loot(
    'Gem of Alacrity',
    'Attach this gem to a weapon to use your Agility when making attacks with that weapon.',
    { tags: ['weapon-upgrade'] }
  ),
  loot(
    'Gem of Might',
    'Attach this gem to a weapon to use your Strength when making attacks with that weapon.',
    { tags: ['weapon-upgrade'] }
  ),
  loot(
    'Gem of Precision',
    'Attach this gem to a weapon to use your Finesse when making attacks with that weapon.',
    { tags: ['weapon-upgrade'] }
  ),
  loot(
    'Gem of Insight',
    'Attach this gem to a weapon to use your Instinct when making attacks with that weapon.',
    { tags: ['weapon-upgrade'] }
  ),
  loot(
    'Gem of Audacity',
    'Attach this gem to a weapon to use your Presence when making attacks with that weapon.',
    { tags: ['weapon-upgrade'] }
  ),
  loot(
    'Gem of Sagacity',
    'Attach this gem to a weapon to use your Knowledge when making attacks with that weapon.',
    { tags: ['weapon-upgrade'] }
  ),
  loot(
    'Ring of Unbreakable Resolve',
    'Once per session, when the GM spends a Fear, you can spend Hope to cancel the effects of that spent Fear.',
    { tags: ['fear', 'hope'] }
  ),
  loot(
    'Belt of Unity',
    'Once per session, you can spend Hope to lead a Tag Team Roll with three PCs instead of two.',
    { tags: ['teamwork'] }
  ),
  loot(
    'Morphing Clay',
    'Spend a Hope to use this clay to alter your face enough to make yourself unrecognizable until your next rest.',
    { tags: ['disguise'] }
  ),
];

export const daggerheartLootById = Object.fromEntries(
  daggerheartLoot.map((entry) => [entry.id, entry])
) as Record<string, DaggerheartLoot>;

export function getDaggerheartLoot(id: string): DaggerheartLoot | undefined {
  return daggerheartLootById[id];
}
