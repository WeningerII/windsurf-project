import { Subclass } from '../../../../../types/character-options/classes';

export const draconicBloodlineSubclass: Subclass = {
  id: 'draconic-bloodline',
  name: 'Draconic Sorcery',
  parentClassId: 'sorcerer',

  features: [
    {
      level: 3,
      features: [
        {
          id: 'draconic-resilience',
          name: 'Draconic Resilience',
          source: 'Draconic Sorcery 3',
          description:
            "Magic flows through your body, and physical traits of your dragon ancestors emerge. Your Hit Point maximum increases by 3, and it increases by 1 again whenever you gain a Sorcerer level. Additionally, parts of your skin are covered by a thin sheen of dragon-like scales. When you aren't wearing armor, your AC equals 13 + your Dexterity modifier.",
        },
        {
          id: 'dragon-speech',
          name: 'Dragon Speech',
          source: 'Draconic Sorcery 3',
          description:
            'You can speak, read, and write Draconic. In addition, when you make a Charisma check to interact with Dragons, you have Advantage on the check.',
        },
        {
          id: 'draconic-spells',
          name: 'Draconic Spells',
          source: 'Draconic Sorcery 3',
          description:
            "You learn the following spells. They are Sorcerer spells for you, but they don't count against your number of Sorcerer spells known. If you later replace a spell, you must replace it with a spell from the Sorcerer spell list that deals the same damage type as the one you are replacing.\n\nLevel 1: Chromatic Orb, Command\nLevel 3: Dragon's Breath, Hold Person\nLevel 5: Fear, Fly\nLevel 7: Charm Monster\nLevel 9: Dominate Person, Legend Lore",
        },
      ],
    },
    {
      level: 6,
      features: [
        {
          id: 'elemental-affinity',
          name: 'Elemental Affinity',
          source: 'Draconic Sorcery 6',
          description:
            'When you cast a spell that deals damage of the type associated with your Draconic Ancestry, you can add your Charisma modifier to one damage roll of that spell. At the same time, you can spend 1 Sorcery Point to gain Resistance to that damage type for 1 hour.',
        },
      ],
    },
    {
      level: 14,
      features: [
        {
          id: 'draconic-wings',
          name: 'Draconic Wings',
          source: 'Draconic Sorcery 14',
          description:
            "You can use a Bonus Action to sprout a pair of dragon wings from your back. While the wings are present, you have a Fly Speed of 60 feet. You can dismiss the wings as a Bonus Action. You can't manifest your wings while wearing armor unless the armor is made to accommodate them, and clothing not made to accommodate your wings might be destroyed when you manifest them.",
        },
      ],
    },
    {
      level: 18,
      features: [
        {
          id: 'draconic-presence',
          name: 'Draconic Presence',
          source: 'Draconic Sorcery 18',
          description:
            'You can channel the dread presence of your dragon ancestor to cause those around you to become Awestruck or Frightened. As a Bonus Action, you can spend 5 Sorcery Points to draw on this power and exude an aura of awe or fear (your choice) to a distance of 60 feet. For 1 minute or until you lose your Concentration (as if you were casting a Concentration spell), each hostile creature that starts its turn in this aura must succeed on a Wisdom saving throw or have the Charmed condition (if you chose awe) or Frightened condition (if you chose fear) until the aura ends. A creature that succeeds on this saving throw is immune to your aura for 24 hours.',
        },
      ],
    },
  ],

  spellListExpansion: [
    'chromatic-orb',
    'command',
    'dragons-breath',
    'hold-person',
    'fear',
    'fly',
    'charm-monster',
    'dominate-person',
    'legend-lore',
  ],

  description:
    'Your innate magic comes from draconic magic that was mingled with your blood or that of your ancestors. Most often, sorcerers with this origin trace their descent back to a mighty sorcerer of ancient times who made a bargain with a dragon or who might even have claimed a dragon parent.',
};
