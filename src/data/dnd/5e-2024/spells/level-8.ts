import { Spell } from '../../../../types/magic/spells';

// D&D 5e (2024) Level 8 Spells - SRD 5.2
export const level8Spells: Spell[] = [
  {
    "id": "animal-shapes",
    "name": "Animal Shapes",
    "system": "dnd-5e-2024",
    "source": "SRD 5.2",
    "level": 8,
    "school": "transmutation",
    "castingTime": {
      "type": "action",
      "amount": 1
    },
    "range": {
      "type": "ranged",
      "feet": 30
    },
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false
    },
    "duration": {
      "type": "concentration",
      "maxDuration": "24 hours"
    },
    "concentration": true,
    "ritual": false,
    "description": "Your magic turns others into beasts. Choose any number of willing creatures that you can see within range. You transform each target into the form of a Large or smaller Beast with a Challenge Rating of 4 or lower.",
    "classes": [
      "druid"
    ]
  },
  {
    "id": "antimagic-field",
    "name": "Antimagic Field",
    "system": "dnd-5e-2024",
    "source": "SRD 5.2",
    "level": 8,
    "school": "abjuration",
    "castingTime": {
      "type": "action",
      "amount": 1
    },
    "range": {
      "type": "self"
    },
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "iron filings"
    },
    "duration": {
      "type": "concentration",
      "maxDuration": "1 hour"
    },
    "areaOfEffect": {
      "type": "sphere",
      "radius": 10
    },
    "concentration": true,
    "ritual": false,
    "description": "A 10-foot-radius Sphere of antimagic surrounds you. This area is divorced from the magical energy that suffuses the multiverse. Within the sphere, spells can't be cast, summoned creatures disappear, and even magic items become mundane.",
    "classes": [
      "cleric",
      "wizard"
    ]
  },
  {
    "id": "antipathy-sympathy",
    "name": "Antipathy/Sympathy",
    "system": "dnd-5e-2024",
    "source": "SRD 5.2",
    "level": 8,
    "school": "enchantment",
    "castingTime": {
      "type": "hour",
      "amount": 1
    },
    "range": {
      "type": "ranged",
      "feet": 60
    },
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "a lump of alum soaked in vinegar or honey"
    },
    "duration": {
      "type": "special",
      "description": "10 days"
    },
    "savingThrow": {
      "attribute": "wis",
      "success": "none"
    },
    "concentration": false,
    "ritual": false,
    "description": "This spell attracts or repels creatures of your choice. You target something within range, either a Huge or smaller object or creature or an area no larger than a 200-foot Cube.",
    "classes": [
      "bard",
      "druid",
      "wizard"
    ]
  },
  {
    "id": "clone",
    "name": "Clone",
    "system": "dnd-5e-2024",
    "source": "SRD 5.2",
    "level": 8,
    "school": "necromancy",
    "castingTime": {
      "type": "hour",
      "amount": 1
    },
    "range": {
      "type": "touch"
    },
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "a diamond worth 1,000 gp and flesh from the creature",
      "materialCost": 1000,
      "materialConsumed": true
    },
    "duration": {
      "type": "instant"
    },
    "concentration": false,
    "ritual": false,
    "description": "This spell grows an inert duplicate of a living creature as a safeguard against death. The clone forms over 120 days and can be placed in a vessel. After the clone matures, if the original creature dies, its soul transfers to the clone.",
    "classes": [
      "wizard"
    ]
  },
  {
    "id": "control-weather",
    "name": "Control Weather",
    "system": "dnd-5e-2024",
    "source": "SRD 5.2",
    "level": 8,
    "school": "transmutation",
    "castingTime": {
      "type": "minute",
      "amount": 10
    },
    "range": {
      "type": "self"
    },
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "burning incense"
    },
    "duration": {
      "type": "concentration",
      "maxDuration": "8 hours"
    },
    "concentration": true,
    "ritual": false,
    "description": "You take control of the weather within 5 miles of you for the duration. You must be outdoors to cast this spell. When you cast the spell, you change the current weather conditions.",
    "classes": [
      "cleric",
      "druid",
      "wizard"
    ]
  },
  {
    "id": "demiplane",
    "name": "Demiplane",
    "system": "dnd-5e-2024",
    "source": "SRD 5.2",
    "level": 8,
    "school": "conjuration",
    "castingTime": {
      "type": "action",
      "amount": 1
    },
    "range": {
      "type": "ranged",
      "feet": 60
    },
    "components": {
      "verbal": false,
      "somatic": true,
      "material": false
    },
    "duration": {
      "type": "hours",
      "hours": 1
    },
    "concentration": false,
    "ritual": false,
    "description": "You create a shadowy door on a flat solid surface that you can see within range. The door is large enough to allow Medium creatures to pass through unhindered. When opened, the door leads to a demiplane that appears to be an empty room 30 feet in each dimension.",
    "classes": [
      "sorcerer",
      "warlock",
      "wizard"
    ]
  },
  {
    "id": "dominate-monster",
    "name": "Dominate Monster",
    "system": "dnd-5e-2024",
    "source": "SRD 5.2",
    "level": 8,
    "school": "enchantment",
    "castingTime": {
      "type": "action",
      "amount": 1
    },
    "range": {
      "type": "ranged",
      "feet": 60
    },
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false
    },
    "duration": {
      "type": "concentration",
      "maxDuration": "1 hour"
    },
    "savingThrow": {
      "attribute": "wis",
      "success": "none"
    },
    "concentration": true,
    "ritual": false,
    "description": "You attempt to beguile a creature that you can see within range. It must succeed on a Wisdom saving throw or have the Charmed condition for the duration. While it has the Charmed condition, you have a telepathic link with it.",
    "atHigherLevels": "When you cast this spell with a level 9 slot, the duration is up to 8 hours.",
    "classes": [
      "bard",
      "sorcerer",
      "warlock",
      "wizard"
    ]
  },
  {
    "id": "earthquake",
    "name": "Earthquake",
    "system": "dnd-5e-2024",
    "source": "SRD 5.2",
    "level": 8,
    "school": "transmutation",
    "castingTime": {
      "type": "action",
      "amount": 1
    },
    "range": {
      "type": "ranged",
      "feet": 500
    },
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "a pinch of dirt and a piece of rock"
    },
    "duration": {
      "type": "concentration",
      "maxDuration": "1 minute"
    },
    "areaOfEffect": {
      "type": "sphere",
      "radius": 100
    },
    "savingThrow": {
      "attribute": "dex",
      "success": "none"
    },
    "concentration": true,
    "ritual": false,
    "description": "You create a seismic disturbance at a point on the ground that you can see within range. For the duration, an intense tremor rips through the ground in a 100-foot-radius circle centered on that point.",
    "classes": [
      "cleric",
      "druid",
      "sorcerer"
    ]
  },
  {
    "id": "feeblemind",
    "name": "Feeblemind",
    "system": "dnd-5e-2024",
    "source": "SRD 5.2",
    "level": 8,
    "school": "enchantment",
    "castingTime": {
      "type": "action",
      "amount": 1
    },
    "range": {
      "type": "ranged",
      "feet": 150
    },
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "a handful of clay, crystal, glass, or mineral spheres"
    },
    "duration": {
      "type": "instant"
    },
    "savingThrow": {
      "attribute": "int",
      "success": "none"
    },
    "damage": {
      "base": {
        "count": 4,
        "die": "d6",
        "notation": "4d6"
      },
      "type": "psychic"
    },
    "concentration": false,
    "ritual": false,
    "description": "You blast the mind of a creature that you can see within range. The target makes an Intelligence saving throw. On a failed save, the target takes 4d6 Psychic damage and can't cast spells, activate magic items, understand language, or communicate intelligibly.",
    "classes": [
      "bard",
      "druid",
      "warlock",
      "wizard"
    ]
  },
  {
    "id": "glibness",
    "name": "Glibness",
    "system": "dnd-5e-2024",
    "source": "SRD 5.2",
    "level": 8,
    "school": "enchantment",
    "castingTime": {
      "type": "action",
      "amount": 1
    },
    "range": {
      "type": "self"
    },
    "components": {
      "verbal": true,
      "somatic": false,
      "material": false
    },
    "duration": {
      "type": "hours",
      "hours": 1
    },
    "concentration": false,
    "ritual": false,
    "description": "Until the spell ends, when you make a Charisma check, you can replace the number you roll with a 15. Additionally, no matter what you say, magic that would determine if you are telling the truth indicates that you are being truthful.",
    "classes": [
      "bard",
      "warlock"
    ]
  },
  {
    "id": "holy-aura",
    "name": "Holy Aura",
    "system": "dnd-5e-2024",
    "source": "SRD 5.2",
    "level": 8,
    "school": "abjuration",
    "castingTime": {
      "type": "action",
      "amount": 1
    },
    "range": {
      "type": "self"
    },
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "a reliquary worth 1,000 gp",
      "materialCost": 1000
    },
    "duration": {
      "type": "concentration",
      "maxDuration": "1 minute"
    },
    "areaOfEffect": {
      "type": "sphere",
      "radius": 30
    },
    "concentration": true,
    "ritual": false,
    "description": "Divine light washes out from you and coalesces in a soft radiance in a 30-foot radius around you. Creatures of your choice in that radius when you cast this spell shed Dim Light in a 5-foot radius and have Advantage on all saving throws.",
    "classes": [
      "cleric"
    ]
  },
  {
    "id": "incendiary-cloud",
    "name": "Incendiary Cloud",
    "system": "dnd-5e-2024",
    "source": "SRD 5.2",
    "level": 8,
    "school": "conjuration",
    "castingTime": {
      "type": "action",
      "amount": 1
    },
    "range": {
      "type": "ranged",
      "feet": 150
    },
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false
    },
    "duration": {
      "type": "concentration",
      "maxDuration": "1 minute"
    },
    "areaOfEffect": {
      "type": "sphere",
      "radius": 20
    },
    "savingThrow": {
      "attribute": "dex",
      "success": "half"
    },
    "damage": {
      "base": {
        "count": 10,
        "die": "d8",
        "notation": "10d8"
      },
      "type": "fire"
    },
    "concentration": true,
    "ritual": false,
    "description": "A swirling cloud of smoke shot through with white-hot embers appears in a 20-foot-radius Sphere centered on a point within range. The cloud spreads around corners and is Heavily Obscured.",
    "classes": [
      "druid",
      "sorcerer",
      "wizard"
    ]
  },
  {
    "id": "maze",
    "name": "Maze",
    "system": "dnd-5e-2024",
    "source": "SRD 5.2",
    "level": 8,
    "school": "conjuration",
    "castingTime": {
      "type": "action",
      "amount": 1
    },
    "range": {
      "type": "ranged",
      "feet": 60
    },
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false
    },
    "duration": {
      "type": "concentration",
      "maxDuration": "10 minutes"
    },
    "concentration": true,
    "ritual": false,
    "description": "You banish a creature that you can see within range into a labyrinthine demiplane. The target remains there for the duration or until it escapes the maze.",
    "classes": [
      "wizard"
    ]
  },
  {
    "id": "mind-blank",
    "name": "Mind Blank",
    "system": "dnd-5e-2024",
    "source": "SRD 5.2",
    "level": 8,
    "school": "abjuration",
    "castingTime": {
      "type": "action",
      "amount": 1
    },
    "range": {
      "type": "touch"
    },
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false
    },
    "duration": {
      "type": "hours",
      "hours": 24
    },
    "concentration": false,
    "ritual": false,
    "description": "Until the spell ends, one willing creature you touch is immune to Psychic damage, any effect that would sense its emotions or read its thoughts, Divination spells, and the Charmed condition.",
    "classes": [
      "bard",
      "wizard"
    ]
  },
  {
    "id": "power-word-stun",
    "name": "Power Word Stun",
    "system": "dnd-5e-2024",
    "source": "SRD 5.2",
    "level": 8,
    "school": "enchantment",
    "castingTime": {
      "type": "action",
      "amount": 1
    },
    "range": {
      "type": "ranged",
      "feet": 60
    },
    "components": {
      "verbal": true,
      "somatic": false,
      "material": false
    },
    "duration": {
      "type": "instant"
    },
    "concentration": false,
    "ritual": false,
    "description": "You speak a word of power that can overwhelm the mind of one creature you can see within range, leaving it dumbfounded. If the target has 150 Hit Points or fewer, it has the Stunned condition.",
    "classes": [
      "bard",
      "sorcerer",
      "warlock",
      "wizard"
    ]
  },
  {
    "id": "sunburst",
    "name": "Sunburst",
    "system": "dnd-5e-2024",
    "source": "SRD 5.2",
    "level": 8,
    "school": "evocation",
    "castingTime": {
      "type": "action",
      "amount": 1
    },
    "range": {
      "type": "ranged",
      "feet": 150
    },
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "fire and a piece of sunstone"
    },
    "duration": {
      "type": "instant"
    },
    "areaOfEffect": {
      "type": "sphere",
      "radius": 60
    },
    "savingThrow": {
      "attribute": "con",
      "success": "half"
    },
    "damage": {
      "base": {
        "count": 12,
        "die": "d6",
        "notation": "12d6"
      },
      "type": "radiant"
    },
    "concentration": false,
    "ritual": false,
    "description": "Brilliant sunlight flashes in a 60-foot-radius Sphere centered on a point you choose within range. Each creature in that light must make a Constitution saving throw, taking 12d6 Radiant damage on a failed save and has the Blinded condition for 1 minute.",
    "classes": [
      "cleric",
      "druid",
      "sorcerer",
      "wizard"
    ]
  }
];
