import { Species } from '../../../../types/character-options/species';

export const gnome: Species = {
  id: 'gnome',
  name: 'Gnome',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',

  abilityScoreIncrease: [
    {
      type: 'fixed',
      attributes: { int: 2 },
    },
  ],

  size: 'small',
  speed: 25,

  languages: {
    automatic: ['Common', 'Gnomish'],
  },

  traits: [
    {
      id: 'darkvision-gnome',
      name: 'Darkvision',
      source: 'Gnome',
      description:
        "Accustomed to life underground, you have superior vision in dark and dim conditions. You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light. You can't discern color in darkness, only shades of gray.",
    },
    {
      id: 'gnome-cunning',
      name: 'Gnome Cunning',
      source: 'Gnome',
      description:
        'You have advantage on all Intelligence, Wisdom, and Charisma saving throws against magic.',
    },
  ],

  subraces: [
    {
      id: 'forest-gnome',
      name: 'Forest Gnome',
      parentSpeciesId: 'gnome',

      abilityScoreIncrease: [
        {
          type: 'fixed',
          attributes: { dex: 1 },
        },
      ],

      traits: [
        {
          id: 'natural-illusionist',
          name: 'Natural Illusionist',
          source: 'Forest Gnome',
          description:
            'You know the minor illusion cantrip. Intelligence is your spellcasting ability for it.',
        },
        {
          id: 'speak-with-small-beasts',
          name: 'Speak with Small Beasts',
          source: 'Forest Gnome',
          description:
            'Through sounds and gestures, you can communicate simple ideas with Small or smaller beasts. Forest gnomes love animals and often keep squirrels, badgers, rabbits, moles, woodpeckers, and other creatures as beloved pets.',
        },
      ],

      description:
        'As a forest gnome, you have a natural knack for illusion and inherent quickness and stealth.',
    },
    {
      id: 'rock-gnome',
      name: 'Rock Gnome',
      parentSpeciesId: 'gnome',

      abilityScoreIncrease: [
        {
          type: 'fixed',
          attributes: { con: 1 },
        },
      ],

      traits: [
        {
          id: 'artificers-lore',
          name: "Artificer's Lore",
          source: 'Rock Gnome',
          description:
            'Whenever you make an Intelligence (History) check related to magic items, alchemical objects, or technological devices, you can add twice your proficiency bonus, instead of any proficiency bonus you normally apply.',
        },
        {
          id: 'tinker',
          name: 'Tinker',
          source: 'Rock Gnome',
          description:
            "You have proficiency with artisan's tools (tinker's tools). Using those tools, you can spend 1 hour and 10 gp worth of materials to construct a Tiny clockwork device (AC 5, 1 hp). The device ceases to function after 24 hours (unless you spend 1 hour repairing it to keep the device functioning), or when you use your action to dismantle it; at that time, you can reclaim the materials used to create it. You can have up to three such devices active at a time. When you create a device, choose one of the following options:\n\nClockwork Toy: This toy is a clockwork animal, monster, or person, such as a frog, mouse, bird, dragon, or soldier. When placed on the ground, the toy moves 5 feet across the ground on each of your turns in a random direction. It makes noises as appropriate to the creature it represents.\n\nFire Starter: The device produces a miniature flame, which you can use to light a candle, torch, or campfire. Using the device requires your action.\n\nMusic Box: When opened, this music box plays a single song at a moderate volume. The box stops playing when it reaches the song's end or when it is closed.",
        },
      ],

      description:
        'As a rock gnome, you have a natural inventiveness and hardiness beyond that of other gnomes.',
    },
  ],

  description:
    "A gnome's energy and enthusiasm for living shines through every inch of his or her tiny body.",

  ageInfo:
    'Gnomes mature at the same rate humans do, and most are expected to settle down into an adult life by around age 40. They can live 350 to almost 500 years.',

  alignmentTendency:
    'Gnomes are most often good. Those who tend toward law are sages, engineers, researchers, scholars, investigators, or inventors. Those who tend toward chaos are minstrels, tricksters, wanderers, or fanciful jewelers.',

  sizeDescription:
    'Gnomes are between 3 and 4 feet tall and average about 40 pounds. Your size is Small.',
};
