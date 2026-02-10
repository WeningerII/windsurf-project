import { Spell } from '../../../../types/magic/spells';

// D&D 5e (2024) Level 9 Spells - SRD 5.2
export const level9Spells: Spell[] = [
  {
    "id": "astral-projection",
    "name": "Astral Projection",
    "system": "dnd-5e-2024",
    "source": "SRD 5.2",
    "level": 9,
    "school": "necromancy",
    "castingTime": {
      "type": "hour",
      "amount": 1
    },
    "range": {
      "type": "ranged",
      "feet": 10
    },
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "jacinth worth 1,000 gp and silver bar worth 100 gp per creature",
      "materialCost": 1100
    },
    "duration": {
      "type": "special",
      "description": "Until dispelled"
    },
    "concentration": false,
    "ritual": false,
    "description": "You and up to eight willing creatures project your astral bodies into the Astral Plane.",
    "classes": [
      "cleric",
      "warlock",
      "wizard"
    ]
  },
  {
    "id": "foresight",
    "name": "Foresight",
    "system": "dnd-5e-2024",
    "source": "SRD 5.2",
    "level": 9,
    "school": "divination",
    "castingTime": {
      "type": "minute",
      "amount": 1
    },
    "range": {
      "type": "touch"
    },
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "a hummingbird feather"
    },
    "duration": {
      "type": "hours",
      "hours": 8
    },
    "concentration": false,
    "ritual": false,
    "description": "You touch a willing creature and bestow a limited ability to see into the immediate future. The target has Advantage on attack rolls, ability checks, and saving throws. Other creatures have Disadvantage on attack rolls against it.",
    "classes": [
      "bard",
      "druid",
      "warlock",
      "wizard"
    ]
  },
  {
    "id": "gate",
    "name": "Gate",
    "system": "dnd-5e-2024",
    "source": "SRD 5.2",
    "level": 9,
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
      "material": true,
      "materialDescription": "a diamond worth 5,000 gp",
      "materialCost": 5000
    },
    "duration": {
      "type": "concentration",
      "maxDuration": "1 minute"
    },
    "concentration": true,
    "ritual": false,
    "description": "You conjure a portal linking an unoccupied space you can see within range to a precise location on a different plane of existence.",
    "classes": [
      "cleric",
      "sorcerer",
      "warlock",
      "wizard"
    ]
  },
  {
    "id": "imprisonment",
    "name": "Imprisonment",
    "system": "dnd-5e-2024",
    "source": "SRD 5.2",
    "level": 9,
    "school": "abjuration",
    "castingTime": {
      "type": "minute",
      "amount": 1
    },
    "range": {
      "type": "ranged",
      "feet": 30
    },
    "components": {
      "verbal": true,
      "somatic": true,
      "material": true,
      "materialDescription": "component worth 500 gp per HD of target",
      "materialCost": 500
    },
    "duration": {
      "type": "permanent"
    },
    "savingThrow": {
      "attribute": "wis",
      "success": "none"
    },
    "concentration": false,
    "ritual": false,
    "description": "You create a magical restraint to hold a creature that you can see within range. The target must succeed on a Wisdom saving throw or be bound by the spell.",
    "classes": [
      "warlock",
      "wizard"
    ]
  },
  {
    "id": "mass-heal",
    "name": "Mass Heal",
    "system": "dnd-5e-2024",
    "source": "SRD 5.2",
    "level": 9,
    "school": "abjuration",
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
      "type": "instant"
    },
    "concentration": false,
    "ritual": false,
    "description": "A flood of healing energy flows from you into injured creatures around you. You restore up to 700 Hit Points, divided as you choose among any number of creatures that you can see within range.",
    "classes": [
      "cleric"
    ]
  },
  {
    "id": "meteor-swarm",
    "name": "Meteor Swarm",
    "system": "dnd-5e-2024",
    "source": "SRD 5.2",
    "level": 9,
    "school": "evocation",
    "castingTime": {
      "type": "action",
      "amount": 1
    },
    "range": {
      "type": "ranged",
      "feet": 5280
    },
    "components": {
      "verbal": true,
      "somatic": true,
      "material": false
    },
    "duration": {
      "type": "instant"
    },
    "areaOfEffect": {
      "type": "sphere",
      "radius": 40
    },
    "savingThrow": {
      "attribute": "dex",
      "success": "half"
    },
    "damage": {
      "base": {
        "count": 20,
        "die": "d6",
        "notation": "20d6"
      },
      "type": "fire"
    },
    "concentration": false,
    "ritual": false,
    "description": "Blazing orbs of fire plummet to the ground at four different points you can see within range. Each creature in a 40-foot-radius Sphere takes 20d6 Fire damage and 20d6 Bludgeoning damage.",
    "classes": [
      "sorcerer",
      "wizard"
    ]
  },
  {
    "id": "power-word-heal",
    "name": "Power Word Heal",
    "system": "dnd-5e-2024",
    "source": "SRD 5.2",
    "level": 9,
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
      "type": "instant"
    },
    "concentration": false,
    "ritual": false,
    "description": "A wave of healing energy washes over one creature you can see within range. The target regains all its Hit Points. If the creature has the Charmed, Frightened, Paralyzed, Poisoned, or Stunned condition, the condition ends.",
    "classes": [
      "bard",
      "cleric"
    ]
  },
  {
    "id": "power-word-kill",
    "name": "Power Word Kill",
    "system": "dnd-5e-2024",
    "source": "SRD 5.2",
    "level": 9,
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
    "description": "You utter a word of power that can compel one creature you can see within range to die instantly. If the creature you choose has 100 Hit Points or fewer, it dies. Otherwise, the spell has no effect.",
    "classes": [
      "bard",
      "sorcerer",
      "warlock",
      "wizard"
    ]
  },
  {
    "id": "prismatic-wall",
    "name": "Prismatic Wall",
    "system": "dnd-5e-2024",
    "source": "SRD 5.2",
    "level": 9,
    "school": "abjuration",
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
      "type": "minutes",
      "minutes": 10
    },
    "concentration": false,
    "ritual": false,
    "description": "A shimmering, multicolored plane of light forms a vertical opaque wall—up to 90 feet long, 30 feet high, and 1 inch thick—centered on a point you can see within range.",
    "classes": [
      "bard",
      "wizard"
    ]
  },
  {
    "id": "shapechange",
    "name": "Shapechange",
    "system": "dnd-5e-2024",
    "source": "SRD 5.2",
    "level": 9,
    "school": "transmutation",
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
      "materialDescription": "a jade circlet worth 1,500 gp",
      "materialCost": 1500
    },
    "duration": {
      "type": "concentration",
      "maxDuration": "1 hour"
    },
    "concentration": true,
    "ritual": false,
    "description": "You assume the form of a different creature for the duration. The new form can be of any creature with a Challenge Rating equal to or less than your level.",
    "classes": [
      "druid",
      "wizard"
    ]
  },
  {
    "id": "storm-of-vengeance",
    "name": "Storm of Vengeance",
    "system": "dnd-5e-2024",
    "source": "SRD 5.2",
    "level": 9,
    "school": "conjuration",
    "castingTime": {
      "type": "action",
      "amount": 1
    },
    "range": {
      "type": "sight"
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
      "radius": 360
    },
    "savingThrow": {
      "attribute": "con",
      "success": "none"
    },
    "concentration": true,
    "ritual": false,
    "description": "A churning storm cloud forms, centered on a point you can see and spreading to a radius of 360 feet. Lightning flashes, thunder booms, and strong winds roar.",
    "classes": [
      "druid"
    ]
  },
  {
    "id": "time-stop",
    "name": "Time Stop",
    "system": "dnd-5e-2024",
    "source": "SRD 5.2",
    "level": 9,
    "school": "transmutation",
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
      "type": "instant"
    },
    "concentration": false,
    "ritual": false,
    "description": "You briefly stop the flow of time for everyone but yourself. No time passes for other creatures, while you take 1d4 + 1 turns in a row, during which you can use actions and move as normal.",
    "classes": [
      "sorcerer",
      "wizard"
    ]
  },
  {
    "id": "true-polymorph",
    "name": "True Polymorph",
    "system": "dnd-5e-2024",
    "source": "SRD 5.2",
    "level": 9,
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
      "material": true,
      "materialDescription": "a drop of mercury and a dollop of gum arabic"
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
    "description": "Choose one creature or nonmagical object that you can see within range. You transform the creature into a different creature, the creature into a nonmagical object, or the object into a creature.",
    "classes": [
      "bard",
      "warlock",
      "wizard"
    ]
  },
  {
    "id": "true-resurrection",
    "name": "True Resurrection",
    "system": "dnd-5e-2024",
    "source": "SRD 5.2",
    "level": 9,
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
      "materialDescription": "diamonds worth 25,000 gp",
      "materialCost": 25000,
      "materialConsumed": true
    },
    "duration": {
      "type": "instant"
    },
    "concentration": false,
    "ritual": false,
    "description": "You touch a creature that has been dead for no longer than 200 years and that died for any reason except old age. The creature is restored to life with all its Hit Points.",
    "classes": [
      "cleric",
      "druid"
    ]
  },
  {
    "id": "weird",
    "name": "Weird",
    "system": "dnd-5e-2024",
    "source": "SRD 5.2",
    "level": 9,
    "school": "illusion",
    "castingTime": {
      "type": "action",
      "amount": 1
    },
    "range": {
      "type": "ranged",
      "feet": 120
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
      "radius": 30
    },
    "savingThrow": {
      "attribute": "wis",
      "success": "none"
    },
    "damage": {
      "base": {
        "count": 4,
        "die": "d10",
        "notation": "4d10"
      },
      "type": "psychic"
    },
    "concentration": true,
    "ritual": false,
    "description": "Drawing on the deepest fears of a group of creatures, you create illusory creatures in their minds. Each creature in a 30-foot-radius Sphere must make a Wisdom saving throw.",
    "classes": [
      "warlock",
      "wizard"
    ]
  },
  {
    "id": "wish",
    "name": "Wish",
    "system": "dnd-5e-2024",
    "source": "SRD 5.2",
    "level": 9,
    "school": "conjuration",
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
      "type": "instant"
    },
    "concentration": false,
    "ritual": false,
    "description": "Wish is the mightiest spell a mortal creature can cast. By simply speaking aloud, you can alter the very foundations of reality in accord with your desires.",
    "classes": [
      "sorcerer",
      "wizard"
    ]
  }
];
