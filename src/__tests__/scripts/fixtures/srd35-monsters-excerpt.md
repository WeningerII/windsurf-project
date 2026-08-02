<!--
VERBATIM EXCERPT from olimot/srd-v3.5-md monster chapters (OGL 1.0a open
content), fetched 2026-08-02 from
https://raw.githubusercontent.com/olimot/srd-v3.5-md/main/monsters/.

Every line below is copied unmodified from the upstream chapters; only whole
lines were dropped to keep the fixture small. Sections were chosen to cover
every SHAPE the real document actually has, because the fixtures this file
replaces described a document that does not exist (flat sibling `## Astral
Deva` / `## Djinni` / `## Young Black Dragon` headings the SRD has never had):

  ## Aboleth                  standalone `##` stat block (its table also has a
                              second NPC column, "Aboleth Mage")
  ## Angel                    prose container; members are `###` children
    ### Combat                prose child, no stat table (~200 of these exist)
    ### Angel, Astral Deva    `###` stat block  (`<th>Hit Dice:</th>`)
    ### Angel, Planetar       `###` stat block
  ## Barghest                 `##` stat block (combined Barghest/Greater column)
    ### Greater Barghest      PROSE child whose text says "9 Hit Dice" — proves
                              the discriminator must be a table cell
  ## Dragon, True             chapter preamble prose — not a creature
  ## Chromatic Dragons        prose container
    ### Black Dragon          by-age table (`<th>Hit Dice (hp)</th>`)
  ## Formian                  `##` owning a combined 5-caste table; its `###`
                              children own none (was wrongly on the old
                              hand-maintained container list)
  ## Ghost                    template section, no stat table anywhere
    ### Creating a Ghost      prose child, no stat table
  ## Half-Celestial           template header — not a creature
  ## Inevitable               prose container
    ### Kolyarut              `###` stat block with `<td>Hit Dice:</td>` cells
    ### Marut                 `###` stat block with `<th>Hit Dice:</th>` cells
  ## Salamander               `##` owning one combined 3-variant table
  ## Skeleton                 prose container, owns NO table itself
    ### Creating a Skeleton   OWNS a `<th>Hit Dice:</th>` sample-skeleton table
                              yet is NOT a creature (template worked example) —
                              the parent must survive the exclusion
  ## Zombie                   prose container, owns NO table itself
    ### Creating a Zombie     same shape: real stat table, not a creature
  ## Horse                    prose container
    ### Combat                stat table under a prose heading name

All three `SRD_35E_NON_CREATURE_STAT_SECTIONS` are present WITH the stat tables
they really own. An earlier draft of this fixture copied only the natural-armor
size table into `Creating a Skeleton` and omitted `Zombie` altogether, so both
sections had no stat table — the exclusion could never fire and two thirds of
that constant went untested. That is the same "fixture describes a shape the
document does not have" defect this file exists to prevent.
-->

# MONSTERS (verbatim excerpt fixture)

## Aboleth

<table data-debug="no-caption" class="full-width-table"><tbody><tr><td></td><th>Aboleth</th><th>Aboleth Mage, 10th-Level Wizard</th></tr><tr><td></td><td>Huge Aberration (Aquatic)</td><td>Huge Aberration (Aquatic)</td></tr><tr><th>Hit Dice:</th><td>8d8+40 (76 hp)</td><td>8d8+56 plus 10d4+70 (177 hp)</td></tr><tr><th>Initiative:</th><td>+1</td><td>+7</td></tr><tr><th>Speed:</th><td>10 ft. (2 squares), swim 60 ft.</td><td>10 ft. (2 squares), swim 60 ft.</td></tr><tr><th>Armor Class:</th><td>16 (–2 size, +1 Dex, +7 natural), touch 9, flat-footed 15</td><td>18 (–2 size, +3 Dex, +7 natural), touch 11, flat-footed 15</td></tr><tr><th>Base Attack/Grapple:</th><td>+6/+22</td><td>+11/+28</td></tr><tr><th>Attack:</th><td>Tentacle +12 melee (1d6+8 plus slime)</td><td>Tentacle +18 melee (1d6+9 plus slime)</td></tr><tr><th>Full Attack:</th><td>4 tentacles +12 melee (1d6+8 plus slime)</td><td>4 tentacles +18 melee (1d6+9 plus slime)</td></tr><tr><th>Space/Reach:</th><td>15 ft./10 ft.</td><td>15 ft./10 ft.</td></tr><tr><th>Special Attacks:</th><td>Enslave, psionics, slime</td><td>Enslave, psionics, slime, spells</td></tr><tr><th>Special Qualities:</th><td>Aquatic subtype, darkvision 60 ft., mucus cloud</td><td>Aquatic subtype, darkvision 60 ft., mucus cloud, summon familiar</td></tr><tr><th>Saves:</th><td>Fort +7, Ref +3, Will +11</td><td>Fort +15, Ref +10, Will +15</td></tr><tr><th>Abilities:</th><td>Str 26, Dex 12, Con 20, Int 15, Wis 17, Cha 17</td><td>Str 28, Dex 16, Con 24, Int 20, Wis 16, Cha 14</td></tr><tr><th>Skills:</th><td>Concentration +16, Knowledge (any one) +13, Listen +16, Spot +16, Swim +8</td><td>Bluff +13, Concentration +25, Decipher Script +15, Diplomacy +6, Disguise +2 (+4 acting), Intimidate +4, Knowledge (arcana) +15, Knowledge (dungeoneering) +25, Knowledge (history) +15, Knowledge (the planes) +15, Listen +15, Search +10, Sense Motive +15, Spellcraft +20, Spot +17, Survival +3 (+5 following tracks, on other planes, and underground), Swim +8</td></tr><tr><th>Feats:</th><td>Alertness, Combat Casting, Iron Will</td><td>Combat Casting, Empower Spell, Eschew Materials, Great Fortitude, Improved Initiative, Lightning Reflexes, Scribe Scroll, Spell Focus (illusion), Spell Focus (enchantment), Spell Penetration</td></tr><tr><th>Environment</th><td>Underground</td><td>Underground</td></tr><tr><th>Organization:</th><td>Solitary, brood (2–4),or slaver brood (1d3+1 plus 7–12 skum)</td><td>Solitary</td></tr><tr><th>Challenge Rating:</th><td>7</td><td>17</td></tr><tr><th>Treasure:</th><td>Double standard</td><td>Double standard</td></tr><tr><th>Alignment:</th><td>Usually lawful evil</td><td>Usually lawful evil</td></tr><tr><th>Advancement:</th><td>9–16 HD (Huge); 17–24 HD (Gargantuan)</td><td>By character class</td></tr><tr><th>Level Adjustment:</th><td>—</td><td>—</td></tr></tbody></table>

The aboleth is a revolting fishlike amphibian found primarily in subterranean lakes and rivers. An aboleth has a pink belly. Four pulsating blueblack orifices line the bottom of its body and secrete gray slime that smells like rancid grease. It uses its tail for propulsion in the water and drags itself along with its tentacles on land. An aboleth weighs about 6,500 pounds.

Aboleths speak their own language, as well as Undercommon and Aquan.

## Angel

Angels are a race of celestials, beings who live on the good-aligned Outer Planes.

Angels can be of any good alignment. Regardless of their alignment, angels never lie, cheat, or steal. They are impeccably honorable in all their dealings and often prove the most trustworthy and diplomatic of all the celestials.

### Combat

In combat, most angels make full use of their mobility and their ability to attack at a distance.

**Angel Traits:** An angel possesses the following traits (unless otherwise noted in a creature’s entry).

### Angel, Astral Deva

<table data-debug="no-caption" class="full-width-table"><tbody><tr><td></td><td>Medium Outsider (Angel, Extraplanar, Good)</td></tr><tr><th>Hit Dice:</th><td>12d8+48 (102 hp)</td></tr><tr><th>Initiative:</th><td>+8</td></tr><tr><th>Speed:</th><td>50 ft. (10 squares), fly 100 ft. (good)</td></tr><tr><th>Armor Class:</th><td>29 (+4 Dex, +15 natural), touch 14, flat-footed 25</td></tr><tr><th>Base Attack/Grapple:</th><td>+12/+18</td></tr><tr><th>Attack:</th><td><i>+3 heavy mace of disruption</i> +21 melee (1d8+12 plus stun) or slam +18 melee (1d8+9)</td></tr><tr><th>Full Attack:</th><td><i>+3 heavy mace of disruption</i> +21/+16/+11 melee (1d8+12 plus stun) or slam +18 melee (1d8+9)</td></tr><tr><th>Space/Reach:</th><td>5 ft./5 ft.</td></tr><tr><th>Special Attacks:</th><td>Spell-like abilities, stun</td></tr><tr><th>Special Qualities:</th><td>Damage reduction 10/evil, darkvision 60 ft., low-light vision, immunity to acid, cold, and petrification, protective aura, resistance to electricity 10 and fire 10, spell resistance 30, tongues, uncanny dodge</td></tr><tr><th>Saves:</th><td>Fort +14 (+18 against poison), Ref +12, Will +12</td></tr><tr><th>Abilities:</th><td>Str 22, Dex 18, Con 18, Int 18, Wis 18, Cha 20</td></tr><tr><th>Skills:</th><td>Concentration +19, Craft or Knowledge (any three) +19, Diplomacy +22, Escape Artist +19, Hide +19, Intimidate +20, Listen +23, Move Silently +19, Sense Motive +19, Spot +23, Use Rope +4 (+6 with bindings)</td></tr><tr><th>Feats:</th><td>Alertness, Cleave, Great Fortitude, Improved Initiative, Power Attack</td></tr><tr><th>Environment:</th><td>Any good-aligned plane</td></tr><tr><th>Organization:</th><td>Solitary, pair, or squad (3–5)</td></tr><tr><th>Challenge Rating:</th><td>14</td></tr><tr><th>Treasure:</th><td>No coins; double goods; standard items</td></tr><tr><th>Alignment:</th><td>Always good (any)</td></tr><tr><th>Advancement:</th><td>13–18 HD (Medium); 19–36 HD (Large)</td></tr><tr><th>Level Adjustment:</th><td>+8</td></tr></tbody></table>

An astral deva is about 7-1/2 feet tall and weighs about 250 pounds.

### Angel, Planetar

<table data-debug="no-caption" class="full-width-table"><tbody><tr><td></td><td>Large Outsider (Angel, Extraplanar, Good)</td></tr><tr><th>Hit Dice:</th><td>14d8+70 (133 hp)</td></tr><tr><th>Initiative:</th><td>+8</td></tr><tr><th>Speed:</th><td>30 ft. (6 squares), fly 90 ft. (good)</td></tr><tr><th>Armor Class:</th><td>32 (–1 size, +4 Dex, +19 natural), touch 13, flat-footed 28</td></tr><tr><th>Base Attack/Grapple:</th><td>+14/+25</td></tr><tr><th>Attack:</th><td><i>+3 greatsword</i> +23 melee (3d6+13/19–20) or slam +20 melee (2d8+10)</td></tr><tr><th>Full Attack:</th><td><i>+3 greatsword</i> +23/+18/+13 melee (3d6+13/19–20) or slam +20 melee (2d8+10)</td></tr><tr><th>Space/Reach:</th><td>10 ft./10 ft.</td></tr><tr><th>Special Attacks:</th><td>Spell-like abilities, spells</td></tr><tr><th>Special Qualities:</th><td>Damage reduction 10/evil, darkvision 60 ft., low-light vision, immunity to acid, cold, and petrification, protective aura, regeneration 10, resistance to electricity 10 and fire 10, spell resistance 30, tongues</td></tr><tr><th>Saves:</th><td>Fort +14 (+18 against poison), Ref +13, Will +15</td></tr><tr><th>Abilities:</th><td>Str 25, Dex 19, Con 20, Int 22, Wis 23, Cha 22</td></tr><tr><th>Skills:</th><td>Concentration +22, Craft or Knowledge (any four) +23, Diplomacy +25, Escape Artist +21, Hide +17, Intimidate +23, Listen +23, Move Silently +21, Sense Motive +23, Search +23, Spot +23, Use Rope +4 (+6 with bindings)</td></tr><tr><th>Feats:</th><td>Blind-Fight, Cleave, Improved Initiative, Improved Sunder, Power Attack</td></tr><tr><th>Environment:</th><td>Any good-aligned plane</td></tr><tr><th>Organization:</th><td>Solitary or pair</td></tr><tr><th>Challenge Rating:</th><td>16</td></tr><tr><th>Treasure:</th><td>No coins; double goods; standard items</td></tr><tr><th>Alignment:</th><td>Always good (any)</td></tr><tr><th>Advancement:</th><td>15–21 HD (Large); 22–42 HD (Huge)</td></tr><tr><th>Level Adjustment:</th><td>—</td></tr></tbody></table>

A planetar is nearly 9 feet tall and weighs about 500 pounds.

## Barghest

<table data-debug="no-caption" class="half-width-table"><tbody><tr><td></td><th>Barghest</th><th>Greater Barghest</th></tr><tr><td></td><td>Medium Outsider (Evil, Extraplanar, Lawful, Shapechanger)</td><td>Large Outsider (Evil, Extraplanar, Lawful, Shapechanger)</td></tr><tr><th>Hit Dice:</th><td>6d8+6 (33 hp)</td><td>9d8+27 (67 hp)</td></tr><tr><th>Initiative:</th><td>+6</td><td>+6</td></tr><tr><th>Speed:</th><td>30 ft. (6 squares)</td><td>40 ft. (8 squares)</td></tr><tr><th>Armor Class:</th><td>18 (+2 Dex, +6 natural), touch 12, flat-footed 16</td><td>20 (–1 size, +2 Dex, +9 natural), touch 11, flat-footed 18</td></tr><tr><th>Base Attack/Grapple:</th><td>+6/+9</td><td>+9/+18</td></tr><tr><th>Attack:</th><td>Bite +9 melee (1d6+3))</td><td>Bite +13 melee (1d8+5</td></tr><tr><th>Full Attack:</th><td>Bite +9 melee (1d6+3) and 2 claws +4 melee (1d4+1)</td><td>Bite +13 melee (1d8+5) and 2 claws +8 melee (1d6+2)</td></tr><tr><th>Space/Reach:</th><td>5 ft./5 ft.</td><td>10 ft./5 ft.</td></tr><tr><th>Special Attacks:</th><td>Spell-like abilities, feed</td><td>Spell-like abilities, feed</td></tr><tr><th>Special Qualities:</th><td>Change shape, damage reduction 5/magic, darkvision 60 ft., scent</td><td>Change shape, damage reduction 10/magic, darkvision 60 ft., scent</td></tr><tr><th>Saves:</th><td>Fort +6, Ref +7, Will +7</td><td>Fort +9, Ref +8, Will +10</td></tr><tr><th>Abilities:</th><td>Str 17, Dex 15, Con 13, Int 14, Wis 14, Cha 14</td><td>Str 20, Dex 15, Con 16, Int 18, Wis 18, Cha 18</td></tr><tr><th>Skills:</th><td>Bluff +11, Diplomacy +6, Disguise +2 (+4 acting), Hide +11*, Intimidate +13, Jump +12, Listen +11, Move Silently +10, Search +11, Sense Motive +11, Spot +11, Survival +11 (+13 following tracks)</td><td>Bluff +16, Climb +17, Concentration +15, Diplomacy +8, Disguise +4 (+6 acting), Hide +10*, Intimidate +18, Jump +21, Listen +16, Move Silently +14, Sense Motive +16, Spot +16 Survival +16 (+18 following tracks), Tumble +16</td></tr><tr><th>Feats:</th><td>Combat Reflexes, Improved Initiative, Track</td><td>Combat Casting, Combat Reflexes, Improved Initiative, Track</td></tr><tr><th>Environment</th><td>An evil-aligned plane</td><td>An evil-aligned plane</td></tr><tr><th>Organization:</th><td>Solitary or pack (3–6)</td><td>Solitary or pack (3–6)</td></tr><tr><th>Challenge Rating:</th><td>4</td><td>5</td></tr><tr><th>Treasure:</th><td>Double standard</td><td>Double standard</td></tr><tr><th>Alignment:</th><td>Always lawful evil</td><td>Always lawful evil</td></tr><tr><th>Advancement:</th><td>Special (see below)</td><td>Special (see below)</td></tr><tr><th>Level Adjustment:</th><td>—</td><td>—</td></tr></tbody></table>

A barghest is a lupine fiend that can take the shape of a wolf or a goblin. In its natural form, it resembles a goblin–wolf hybrid with terrible jaws and sharp claws. As whelps, barghests are nearly indistinguishable from wolves, except for their size and claws. As they grow larger and stronger, their skin darkens to bluishred and eventually becomes blue altogether.

A full-grown barghest is about 6 feet long and weighs 180 pounds. A barghest’s eyes glow orange when the creature becomes excited.

### Greater Barghest

A barghest that reaches 9 Hit Dice through feeding becomes a greater barghest. These creatures can change shape into a goblinlike creature of Large size (about 8 feet tall and 400 pounds) or a dire wolf. In goblin form, a greater barghest cannot use its natural weapons but can wield weapons and wear armor. In dire wolf form, a greater barghest loses its claw attacks but retains its bite attack.

A greater barghest can reach a maximum of 18 Hit Dice through feeding.

## Dragon, True

The known varieties of true dragons (as opposed to other creatures that have the dragon type) fall into two broad categories: chromatic and metallic. The chromatic dragons are black, blue, green, red, and white; they are all evil and extremely fierce. The metallic dragons are brass, bronze, copper, gold, and silver; they are all good, usually noble, and highly respected by the wise.

All true dragons gain more abilities and greater power as they age. (Other creatures that have the dragon type do not.) They range in length from several feet upon hatching to more than 100 feet after attaining the status of great wyrm. The size of a particular dragon varies according to age and variety.

## Chromatic Dragons

Chromatic dragons form the evil branch of dragonkind. They are aggressive, greedy, vain, and nasty.

### Black Dragon

**Dragon (Water)**

**Environment:** Warm marshes

<table data-debug="no-caption" class="full-width-table"><tbody><tr><th colspan="16">Black Dragons by Age</th></tr><tr><th>Age</th><th>Size</th><th>Hit Dice (hp)</th><th>Str</th><th>Dex</th><th>Con</th><th>Int</th><th>Wis</th><th>Cha</th><th>Base Attack/<br>Grapple</th><th>Attack</th><th>Fort Save</th><th>Ref Save</th><th>Will Save</th><th>Breath Weapon (DC)</th><th>Frightful Presence DC</th></tr><tr><td>Wyrmling</td><td>T</td><td>4d12+4 (30)</td><td>11</td><td>10</td><td>13</td><td>8</td><td>11</td><td>8</td><td>+4/–4</td><td>+6</td><td>+5</td><td>+4</td><td>+4</td><td>2d4 (13)</td><td>—</td></tr><tr><td>Very young</td><td>S</td><td>7d12+7 (52)</td><td>13</td><td>10</td><td>13</td><td>8</td><td>11</td><td>8</td><td>+7/+4</td><td>+9</td><td>+6</td><td>+5</td><td>+5</td><td>4d4 (14)</td><td>—</td></tr><tr><td>Young</td><td>M</td><td>10d12+20 (85)</td><td>15</td><td>10</td><td>15</td><td>10</td><td>11</td><td>10</td><td>+10/+12</td><td>+12</td><td>+9</td><td>+7</td><td>+7</td><td>6d4 (17)</td><td>—</td></tr><tr><td>Juvenile</td><td>M</td><td>13d12+26 (110)</td><td>17</td><td>10</td><td>15</td><td>10</td><td>11</td><td>10</td><td>+13/+16</td><td>+16</td><td>+10</td><td>+8</td><td>+8</td><td>8d4 (18)</td><td>—</td></tr><tr><td>Young adult</td><td>L</td><td>16d12+48 (152)</td><td>19</td><td>10</td><td>17</td><td>12</td><td>13</td><td>12</td><td>+16/+24</td><td>+19</td><td>+13</td><td>+10</td><td>+11</td><td>10d4 (21)</td><td>19</td></tr><tr><td>Adult</td><td>L</td><td>19d12+76 (199)</td><td>23</td><td>10</td><td>19</td><td>12</td><td>13</td><td>12</td><td>+19/+29</td><td>+24</td><td>+15</td><td>+11</td><td>+12</td><td>12d4 (23)</td><td>20</td></tr><tr><td>Mature adult</td><td>H</td><td>22d12+110 (253)</td><td>27</td><td>10</td><td>21</td><td>14</td><td>15</td><td>14</td><td>+22/+38</td><td>+28</td><td>+18</td><td>+13</td><td>+15</td><td>14d4 (26)</td><td>23</td></tr><tr><td>Old</td><td>H</td><td>25d12+125 (287)</td><td>29</td><td>10</td><td>21</td><td>14</td><td>15</td><td>14</td><td>+25/+42</td><td>+32</td><td>+19</td><td>+14</td><td>+16</td><td>16d4 (27)</td><td>24</td></tr><tr><td>Very old</td><td>H</td><td>28d12+168 (350)</td><td>31</td><td>10</td><td>23</td><td>16</td><td>17</td><td>16</td><td>+28/+46</td><td>+36</td><td>+22</td><td>+16</td><td>+19</td><td>18d4 (30)</td><td>27</td></tr><tr><td>Ancient</td><td>H</td><td>31d12+186 (387)</td><td>33</td><td>10</td><td>23</td><td>16</td><td>17</td><td>16</td><td>+31/+50</td><td>+40</td><td>+23</td><td>+17</td><td>+20</td><td>20d4 (31)</td><td>28</td></tr><tr><td>Wyrm</td><td>G</td><td>34d12+238 (459)</td><td>35</td><td>10</td><td>25</td><td>18</td><td>19</td><td>18</td><td>+34/+58</td><td>+42</td><td>+26</td><td>+19</td><td>+23</td><td>22d4 (34)</td><td>31</td></tr><tr><td>Great wyrm</td><td>G</td><td>37d12+296 (536)</td><td>37</td><td>10</td><td>27</td><td>20</td><td>21</td><td>20</td><td>+37/+62</td><td>+46</td><td>+28</td><td>+20</td><td>+25</td><td>24d4 (36)</td><td>33</td></tr></tbody></table>

## Formian

<table data-debug="no-caption" class="full-width-table"><tbody><tr><td></td><th>Formian Worker</th><th>Formian Warrior</th><th>Formian Taskmaster</th></tr><tr><td></td><td>Small Outsider <small>(Lawful, Extraplanar)</small></td><td>Medium Outsider <small>(Lawful, Extraplanar)</small></td><td>Medium Outsider <small>(Lawful, Extraplanar)</small></td></tr><tr><th>Hit Dice:</th><td>1d8+1 (5 hp)</td><td>4d8+8 (26 hp)</td><td>6d8+12 (39 hp)</td></tr><tr><th>Initiative:</th><td>+2</td><td>+3</td><td>+7</td></tr><tr><th>Speed:</th><td>40 ft. (8 squares)</td><td>40 ft. (8 squares)</td><td>40 ft. (8 squares)</td></tr><tr><th>Armor Class:</th><td>17 (+1 size, +2 Dex, +4 natural), touch 13, flat-footed 15</td><td>18 (+3 Dex, +5 natural), touch 13, flat-footed 15</td><td>19 (+3 Dex, +6 natural), touch 13, flat-footed 16</td></tr><tr><th>Base Attack/Grapple:</th><td>+1/–2</td><td>+4/+7</td><td>+6/+10</td></tr><tr><th>Attack:</th><td>Bite +3 melee (1d4+1)</td><td>Sting +7 melee (2d4+3 plus poison)</td><td>Sting +10 melee (2d4+4 plus poison)</td></tr><tr><th>Full Attack:</th><td>Bite +3 melee (1d4+1)</td><td>Sting +7 melee (2d4+3 plus poison) and 2 claws +5 melee (1d6+1) and bite +5 melee (1d4+1)</td><td>Sting +10 melee (2d4+4 plus poison) and 2 claws +8 melee (1d6+2)</td></tr><tr><th>Space/Reach:</th><td>5 ft./5 ft.</td><td>5 ft./5 ft.</td><td>5 ft./5 ft.</td></tr><tr><th>Special Attacks:</th><td>—</td><td>Poison</td><td>Dominate monster, dominated creature, poison</td></tr><tr><th>Special Qualities:</th><td><i>Cure serious wounds,</i> hive mind, immunity to poison, petrification, and cold, <i>make whole,</i> resistance to electricity 10, fire 10, and sonic 10</td><td>Hive mind, immunity to poison, petrification, and cold, resistance to electricity 10, fire 10, and sonic 10, spell resistance 18</td><td>Hive mind, immunity to poison, petrification, and cold, resistance to electricity 10, fire 10, and sonic 10, spell resistance 21, telepathy 100 ft.</td></tr><tr><th>Saves:</th><td>Fort +3, Ref +4, Will +2</td><td>Fort +6, Ref +7, Will +5</td><td>Fort +7, Ref +8, Will +8</td></tr><tr><th>Abilities:</th><td>Str 13, Dex 14, Con 13, Int 6, Wis 10, Cha 9</td><td>Str 17, Dex 16, Con 14, Int 10, Wis 12, Cha 11</td><td>Str 18, Dex 16, Con 14, Int 11, Wis 16, Cha 19</td></tr><tr><th>Skills:</th><td>Climb +10, Craft (any one) +5, Hide +6, Listen +4, Search +2, Spot +4</td><td>Climb +10, Hide +10, Jump +14, Listen +8, Move Silently +10, (+3 following tracks), Tumble +12</td><td>Climb +13, Diplomacy +6, Hide +12, Intimidate +13, Listen +12, Search +7, Spot +8, Survival +1 Move Silently +12, Search +9, Sense Motive +12, Spot +12, Survival +3 (+5 following tracks)</td></tr><tr><th>Feats:</th><td>Skill Focus (Craft [selected skill])</td><td>Dodge, Multiattack</td><td>Dodge, Improved Initiative, Multiattack</td></tr><tr><th>Environment:</th><td>A lawful-aligned plane</td><td>A lawful-aligned plane</td><td>A lawful-aligned plane</td></tr><tr><th>Organization:</th><td>Team (2–4) or crew (7–18)</td><td>Solitary, team (2–4), or troop (6–11)</td><td>Solitary (1 plus 1 dominated creature) or conscription team (2–4 plus 1 dominated creature per team member)</td></tr><tr><th>Challenge Rating:</th><td>1/2</td><td>3</td><td>7</td></tr><tr><th>Treasure:</th><td>None</td><td>None</td><td>Standard</td></tr><tr><th>Alignment:</th><td>Always lawful neutral</td><td>Always lawful neutral</td><td>Always lawful neutral</td></tr><tr><th>Advancement:</th><td>2–3 HD (Medium)</td><td>5–8 HD (Medium); 9–12 HD (Large)</td><td>7–9 HD (Medium); 10–12 HD (Large)</td></tr><tr><th>Level Adjustment:</th><td>—</td><td>—</td><td>—</td></tr></tbody></table>

A formian resembles a cross between an ant and a centaur. All formians are covered in a brownish-red carapace; size and appearance differs for each variety.

## Ghost

Ghosts are the spectral remnants of intelligent beings who, for one reason or another, cannot rest easily in their graves.

A ghost greatly resembles its corporeal form in life, but in some cases the spiritual form is somewhat altered.

### Creating a Ghost

“Ghost” is an acquired template that can be added to any aberration, animal, dragon, giant, humanoid, magical beast, monstrous humanoid, or plant. The creature (referred to hereafter as the base creature) must have a Charisma score of at least 6.

A ghost uses all the base creature’s statistics and special abilities except as noted here.

## Half-Celestial

No matter the form, half-celestials are always comely and delightful to the senses, having golden skin, sparkling eyes, angelic wings, or some other sign of their higher nature.

## Inevitable

Inevitables are constructs whose sole aim is to enforce the natural laws of the universe.

Each type of inevitable is designed to find and punish a particular kind of transgression, hunting down a person or group that has violated a fundamental principle. When an inevitable is created, it receives its first mission, then finds the transgressors and metes out appropriate punishment. The sentence is usually death, although some inevitables insist on compensation to the wronged party instead, using _geas_ and _mark of justice_ to ensure compliance. From its first step, an inevitable focuses totally on its target. It continues its efforts no matter how cold the trail or hopeless the task. Inevitables are single-minded in pursuit of their quarry, but they are under orders to leave innocents alone. Accomplices to their prey are fair game, however, which sometimes creates conflicts within their programming.

### Kolyarut

<table data-debug="no-caption" class="full-width-table"><tbody><tr><td></td><td>Medium Construct (Extraplanar, Lawful)</td></tr><tr><td>Hit Dice:</td><td>13d10+20 (91 hp)</td></tr><tr><td>Initiative:</td><td>+1</td></tr><tr><td>Speed:</td><td>20 ft. in banded mail (4 squares); base speed 30 ft.</td></tr><tr><td>Armor Class:</td><td>27 (+1 Dex, +10 natural, +6 banded mail) touch 11, flat-footed 26</td></tr><tr><td>Base Attack/Grapple:</td><td>+9/+11</td></tr><tr><td>Attack:</td><td>Vampiric touch +11 melee touch (5d6) or enervation ray +10 ranged touch (as spell) or <i>+2 longsword</i> +13 melee (1d8+5/19–20) or slam +11 melee (1d6+3)</td></tr><tr><td>Full Attack:</td><td>Vampiric touch +11/+6 melee touch (5d6) or enervation ray +10 ranged touch (as spell) or <i>+2 longsword</i> +13/+8 melee (1d8+5/19–20) or slam +11/+6 melee (1d6+3)</td></tr><tr><td>Space/Reach:</td><td>5 ft./5 ft.</td></tr><tr><td>Special Attacks:</td><td>Enervation ray, spell-like abilities, vampiric touch</td></tr><tr><td>Special Qualities:</td><td>Construct traits, damage reduction 10/chaotic, darkvision 60 ft., fast healing 5, low-light vision, spell resistance 22</td></tr><tr><td>Saves:</td><td>Fort +6, Ref +7, Will +7</td></tr><tr><td>Abilities:</td><td>Str 14, Dex 13, Con —, Int 10, Wis 17, Cha 16</td></tr><tr><td>Skills:</td><td>Diplomacy +5, Disguise +12, Gather Information +12, Listen +11, Search +5, Sense Motive +12, Spot +11, Survival +3 (+5 following tracks)</td></tr><tr><td>Feats:</td><td>Alertness, Combat Casting, Great Fortitude, Lightning Reflexes, Quickened Spell-Like Ability (<i>suggestion</i>)</td></tr><tr><td>Environment:</td><td>A lawful-aligned plane</td></tr><tr><td>Organization:</td><td>Solitary</td></tr><tr><td>Challenge Rating:</td><td>12</td></tr><tr><td>Treasure:</td><td>None</td></tr><tr><td>Alignment:</td><td>Always lawful neutral</td></tr><tr><td>Advancement:</td><td>14–22 HD (Medium); 23–39 HD (Large)</td></tr><tr><td>Level Adjustment:</td><td>—</td></tr></tbody></table>

Kolyaruts mete out punishment to those who break bargains and oaths.

Before beginning a mission against a deal-breaker, a kolyarut learns as much about the contract or oath as possible. It’s not interested in those who break deals accidentally or against their will— only those who willingly break contracts violate the principle that kolyaruts are created to uphold. If a written contract was broken, the kolyarut typically carries a copy of the contract with it.

### Marut

<table data-debug="no-caption" class="full-width-table"><tbody><tr><td></td><td>Large Construct (Extraplanar, Lawful)</td></tr><tr><th>Hit Dice:</th><td>15d10+30 (112 hp)</td></tr><tr><th>Initiative:</th><td>+1</td></tr><tr><th>Speed:</th><td>30 ft. in full plate armor (6 squares); base speed 40 ft.</td></tr><tr><th>Armor Class:</th><td>34 (–1 size, +1 Dex, +16 natural, +8 full plate armor), touch 10, flat-footed 33</td></tr><tr><th>Base Attack/Grapple:</th><td>+11/+27</td></tr><tr><th>Attack:</th><td>Slam +22 melee (2d6+12 plus 3d6 sonic or 3d6 electricity)</td></tr><tr><th>Full Attack:</th><td>2 slams +22 melee (2d6+12 plus 3d6 sonic or 3d6 electricity)</td></tr><tr><th>Space/Reach:</th><td>10 ft./10 ft.</td></tr><tr><th>Special Attacks:</th><td>Fists of thunder and lightning, spell-like abilities</td></tr><tr><th>Special Qualities:</th><td>Construct traits, damage reduction 15/chaotic, darkvision 60 ft., fast healing 10, low-light vision, spell resistance 25</td></tr><tr><th>Saves:</th><td>Fort +7, Ref +6, Will +8</td></tr><tr><th>Abilities:</th><td>Str 35, Dex 13, Con —, Int 12, Wis 17, Cha 18</td></tr><tr><th>Skills:</th><td>Concentration +13, Diplomacy +6, Knowledge (religion) +10, Listen +16, Search +10, Sense Motive +12, Spot +16, Survival +3 (+5 following tracks)</td></tr><tr><th>Feats:</th><td>Ability Focus (fists), Awesome Blow, Combat Casting, Great Fortitude, Improved Bull Rush, Power Attack</td></tr><tr><th>Environment:</th><td>A lawful-aligned plane</td></tr><tr><th>Organization:</th><td>Solitary</td></tr><tr><th>Challenge Rating:</th><td>15</td></tr><tr><th>Treasure:</th><td>None</td></tr><tr><th>Alignment:</th><td>Always lawful neutral</td></tr><tr><th>Advancement:</th><td>16–28 HD (Large); 29–45 HD (Huge)</td></tr><tr><th>Level Adjustment:</th><td>—</td></tr></tbody></table>

Maruts confront those who would try to deny the grave itself.

Any who use unnatural means to extend their life span could be targeted by a marut. Those who take extraordinary measures to cheat death in some other way might be labeled transgressors as well. Those who use magic to reverse death aren’t worthy of a marut’s attention unless they do so repeatedly or on a massive scale.

## Salamander

<table data-debug="no-caption" class="full-width-table"><tbody><tr><td></td><th>Flamebrother Salamander</th><th>Average Salamander</th><th>Noble Salamander</th></tr><tr><td></td><td>Small Outsider (Extraplanar, Fire)</td><td>Medium Outsider (Extraplanar, Fire)</td><td>Large Outsider (Extraplanar, Fire)</td></tr><tr><th>Hit Dice:</th><td>4d8+8 (26 hp)</td><td>9d8+18 (58 hp)</td><td>15d8+45 (112 hp)</td></tr><tr><th>Initiative:</th><td>+1</td><td>+1</td><td>+1</td></tr><tr><th>Speed:</th><td>20 ft. (4 squares)</td><td>20 ft. (4 squares)</td><td>20 ft. (4 squares)</td></tr><tr><th>Armor Class:</th><td>19 (+1 size, +1 Dex, +7 natural), touch 12, flat-footed 18</td><td>18 (+1 Dex, +7 natural), touch 11, flat-footed 17</td><td>18 (–1 size, +1 Dex, +8 natural), touch 10, flat-footed 17</td></tr><tr><th>Base Attack/Grapple:</th><td>+4/+1</td><td>+9/+11</td><td>+15/+25</td></tr><tr><th>Attack:</th><td>Spear +6 melee (1d6+1/x3 plus 1d6 fire)</td><td>Spear +11 melee (1d8+3/x3 plus 1d6 fire)</td><td><i>+3 longspear</i> +23 melee (1d8+9/x3 plus 1d8 fire)</td></tr><tr><th>Full Attack:</th><td>Spear +6 melee (1d6+1/x3 plus 1d6 fire) and tail slap +4 melee (1d4 plus 1d6 fire)</td><td>Spear +11/+6 melee (1d8+3/x3 plus 1d6 fire) and tail slap +9 melee (2d6+1 plus 1d6 fire)</td><td><i>+3 longspear</i> +23/+18/+13 melee (1d8+9/x3 plus 1d8 fire) and tail slap +18 melee (2d8+3 plus 1d8 fire)</td></tr><tr><th>Space/Reach:</th><td>5 ft./5 ft.</td><td>5 ft./5 ft. (10 ft. with tail)</td><td>10 ft./10 ft. (20 ft. with tail or longspear)</td></tr><tr><th>Special Attacks:</th><td>Constrict 1d4 plus 1d6 fire, heat, improved grab</td><td>Constrict 2d6+1 plus 1d6 fire, heat, improved grab</td><td>Constrict 2d8+3 plus 1d8 fire, heat, improved grab, spell-like abilities</td></tr><tr><th>Special Qualities:</th><td>Darkvision 60 ft., immunity to fire, vulnerability to cold</td><td>Damage reduction 10/magic, darkvision 60 ft., immunity to fire, vulnerability to cold</td><td>Damage reduction 15/magic, darkvision 60 ft., immunity to fire, vulnerability to cold</td></tr><tr><th>Saves:</th><td>Fort +6, Ref +5, Will +6</td><td>Fort +8, Ref +7, Will +8</td><td>Fort +12, Ref +10, Will +11</td></tr><tr><th>Abilities:</th><td>Str 12, Dex 13, Con 14, Int 14, Wis 15, Cha 13</td><td>Str 14, Dex 13, Con 14, Int 14, Wis 15, Cha 13</td><td>Str 22, Dex 13, Con 16, Int 16, Wis 15, Cha 15</td></tr><tr><th>Skills:</th><td>Craft (blacksmithing) +8, Hide +12, Listen +11, Move Silently +6, Spot +11</td><td>Bluff +11, Craft (blacksmithing) +19, Diplomacy +3, Disguise +1 (+3 acting), Hide +11, Intimidate +3, Listen +8, Move Silently +11,Search +12, Spot +8</td><td>Bluff +19, Craft (blacksmithing) +25, Diplomacy +4, Hide +15, Intimidate +4, Listen +13, Move Silently +17, Spot +13</td></tr><tr><th>Feats:</th><td>Alertness, Multiattack</td><td>Alertness, Multiattack, Power Attack</td><td>Alertness, Cleave, Great Cleave, Multiattack, Power Attack, Skill Focus (Craft [blacksmithing])</td></tr><tr><th>Environment:</th><td>Elemental Plane of Fire</td><td>Elemental Plane of Fire</td><td>Elemental Plane of Fire</td></tr><tr><th>Organization:</th><td>Solitary, pair, or cluster (3–5)</td><td>Solitary, pair, or cluster (3–5)</td><td>Solitary, pair, or noble party (9–14)</td></tr><tr><th>Challenge Rating:</th><td>3</td><td>6</td><td>10</td></tr><tr><th>Treasure:</th><td>Standard (nonflammables only)</td><td>Standard (nonflammables only)</td><td>Double standard (nonflammables only) and <i>+3 longspear</i></td></tr><tr><th>Alignment:</th><td>Usually evil (any)</td><td>Usually evil (any)</td><td>Usually evil (any)</td></tr><tr><th>Advancement:</th><td>4–6 HD (Small)</td><td>8–14 HD (Medium)</td><td>16–21 HD (Large); 22–45 HD (Huge)</td></tr><tr><th>Level Adjustment:</th><td>+4</td><td>+5</td><td>—</td></tr></tbody></table>

Salamanders speak Ignan. Some average salamanders and all nobles also speak Common.

## Skeleton

Skeletons are the animated bones of the dead, mindless automatons that obey the orders of their evil masters.

A skeleton is seldom garbed in anything more than the rotting remnants of any clothing or armor it was wearing when slain. A skeleton does only what it is ordered to do. It can draw no conclusions of its own and takes no initiative. Because of this limitation, its instructions must always be simple. A skeleton attacks until destroyed.

### Creating a Skeleton

“Skeleton” is an acquired template that can be added to any corporeal creature (other than an undead) that has a skeletal system (referred to hereafter as the base creature).

**Size and Type:** The creature’s type changes to undead. It retains any subtype except for alignment subtypes (such as good) and subtypes that indicate kind. It does not gain the augmented subtype. It uses all the base creature’s statistics and special abilities except as noted here.

<table data-debug="no-caption" class="half-width-table"><tbody><tr><td>Tiny or smaller</td><td>+0</td></tr><tr><td>Small</td><td>+1</td></tr><tr><td>Medium or Large</td><td>+2</td></tr><tr><td>Huge</td><td>+3</td></tr><tr><td>Gargantuan</td><td>+6</td></tr><tr><td>Colossal</td><td>+10</td></tr></tbody></table>
<table data-debug="no-caption" class="full-width-table"><tbody><tr><td></td><th>Human Warrior Skeleton</th><th>Wolf Skeleton</th><th>Owlbear Skeleton</th></tr><tr><td></td><td>Medium Undead</td><td>Medium Undead</td><td>Large Undead</td></tr><tr><th>Hit Dice:</th><td>1d12 (6 hp)</td><td>2d12 (13 hp)</td><td>5d12 (32 hp)</td></tr><tr><th>Initiative:</th><td>+5</td><td>+7</td><td>+6</td></tr><tr><th>Speed:</th><td>30 ft. (6 squares)</td><td>50 ft. (10 squares)</td><td>30 ft. (6 squares)</td></tr><tr><th>Armor Class:</th><td>15 (+1 Dex, +2 natural, +2 heavy steel shield), touch 11, flat-footed 14</td><td>15 (+3 Dex, +2 natural), touch 13, flat-footed 12</td><td>13 (–1 size, +2 Dex, +2 natural), touch 11, flat-footed 11</td></tr><tr><th>Base Attack/Grapple:</th><td>+0/+1</td><td>+1/+2</td><td>+2/+11</td></tr><tr><th>Attack:</th><td>Scimitar +1 melee (1d6+1/18–20) or claw +1 melee (1d4+1)</td><td>Bite +2 melee (1d6+1)</td><td>Claw +6 melee (1d6+5)</td></tr><tr><th>Full Attack:</th><td>Scimitar +1 melee (1d6+1/18–20) or 2 claws +1 melee (1d4+1)</td><td>Bite +2 melee (1d6+1)</td><td>2 claws +6 melee (1d6+5) and bite +1 melee (1d8+2)</td></tr><tr><th>Space/Reach:</th><td>5 ft./5 ft.</td><td>5 ft./5 ft.</td><td>10 ft./5 ft.</td></tr><tr><th>Special Attacks: —</th><td>—</td><td>—</td><td></td></tr><tr><th>Special Qualities:</th><td>Damage reduction 5/bludgeoning, darkvision 60 ft., immunity to cold, undead traits</td><td>Damage reduction 5/bludgeoning, darkvision 60 ft., immunity to cold, undead traits</td><td>Damage reduction 5/bludgeoning, darkvision 60 ft., immunity to cold, undead traits</td></tr><tr><th>Saves:</th><td>Fort +0, Ref +1, Will +2</td><td>Fort +0, Ref +3, Will +3</td><td>Fort +1, Ref +3, Will +4</td></tr><tr><th>Abilities: Str 13, Dex 13, Con —, Int —, Wis 10, Cha 1</th><td>Str 13, Dex 17, Con —, Int —, Wis 10, Cha 1</td><td>Str 21, Dex 14, Con —, Int —, Wis 10, Cha 1</td><td></td></tr><tr><th>Feats:</th><td>Improved Initiative</td><td>Improved Initiative</td><td>Improved Initiative</td></tr><tr><th>Environment:</th><td>Temperate plains</td><td>Temperate forests</td><td>Temperate forests</td></tr><tr><th>Organization:</th><td>Any</td><td>Any</td><td>Any</td></tr><tr><th>Challenge Rating:</th><td>1/3</td><td>1</td><td>2</td></tr><tr><th>Treasure:</th><td>None</td><td>None</td><td>None</td></tr><tr><th>Alignment:</th><td>Always neutral evil</td><td>Always neutral evil</td><td>Always neutral evil</td></tr><tr><th>Advancement:</th><td>—</td><td>3 HD (Medium); 4–6 HD (Large)</td><td>6–8 HD (Large); 9–15 HD (Huge)</td></tr><tr><th>Level Adjustment:</th><td>—</td><td>—</td><td>—</td></tr></tbody></table>


## Zombie

Zombies are corpses reanimated through dark and sinister magic.

### Creating a Zombie

“Zombie” is an acquired template that can be added to any corporeal creature (other than an undead) that has a skeletal system (referred to hereafter as the base creature).

**Armor Class:** Natural armor bonus increases by a number based on the zombie’s size:

<table data-debug="no-caption" class="half-width-table"><tbody><tr><td>Tiny or smaller</td><td>+0</td></tr><tr><td>Small</td><td>+1</td></tr><tr><td>Medium</td><td>+2</td></tr><tr><td>Large</td><td>+3</td></tr><tr><td>Huge</td><td>+4</td></tr><tr><td>Gargantuan</td><td>+7</td></tr><tr><td>Colossal</td><td>+11</td></tr></tbody></table>

<table data-debug="no-caption" class="full-width-table"><tbody><tr><td></td><th>Wyvern Zombie</th><th>Gray Render Zombie</th></tr><tr><td></td><td>Large Undead</td><td>Large Undead</td></tr><tr><th>Hit Dice:</th><td>14d12+3 (94 hp)</td><td>20d8+3 (133 hp)</td></tr><tr><th>Initiative:</th><td>+0</td><td>–1</td></tr><tr><th>Speed:</th><td>20 ft. (4 squares; can’t run), fly 60 ft. (poor)</td><td>30 ft. (6 squares; can’t run)</td></tr><tr><th>Armor Class:</th><td>20 (–2 size, +12 natural), touch 8, flat-footed 20</td><td>16 (–1 size, –1 Dex, +8 natural) touch 8, flat-footed 16</td></tr><tr><th>Base Attack/Grapple:</th><td>+7/+16</td><td>+10/+21</td></tr><tr><th>Attack:</th><td>Slam +11 melee (2d6+7) or talons +11 melee (2d6+5)</td><td>Bite +16 melee (2d6+7) or slam +16 melee (1d8+10)</td></tr><tr><th>Full Attack:</th><td>Slam +11 melee (2d6+7) or talons +11 melee (2d6+5)</td><td>Bite +16 melee (2d6+7) or slam +16 melee (1d8+10)</td></tr><tr><th>Special Attacks:</th><td>—</td><td>—</td></tr><tr><th>Special Qualities:</th><td>Single actions only, damage reduction 5/slashing, darkvision 60 ft., undead traits</td><td>Single actions only, damage reduction 5/slashing, darkvision 60 ft., undead traits</td></tr><tr><th>Saves:</th><td>Fort +4, Ref +4, Will +9</td><td>Fort +6, Ref +5, Will +12</td></tr><tr><th>Abilities:</th><td>Str 21, Dex 10, Con —, Int —, Wis 10, Cha 1</td><td>Str 25, Dex 8, Con —, Int —, Wis 10, Cha 1</td></tr><tr><th>Skills:</th><td>—</td><td>—</td></tr><tr><th>Feats:</th><td>Toughness</td><td>Toughness</td></tr><tr><th>Environment:</th><td>Warm hills</td><td>Temperate marshes</td></tr><tr><th>Organization:</th><td>Any</td><td>Any</td></tr><tr><th>Challenge Rating:</th><td>4</td><td>6</td></tr><tr><th>Treasure:</th><td>None</td><td>None</td></tr><tr><th>Alignment:</th><td>Always neutral evil</td><td>Always neutral evil</td></tr><tr><th>Advancement:</th><td>16–20 HD (Huge)</td><td>None</td></tr><tr><th>Level Adjustment:</th><td>—</td><td>—</td></tr></tbody></table>

## Horse

Horses are widely domesticated for riding and as beasts of burden.

### Combat

A horse not trained for war does not normally use its hooves to attack. Its hoof attack is treated as a secondary attack and adds only half the horse’s Strength bonus to damage. (These secondary attacks are noted with an asterisk in the Attack and Full Attack entries for the heavy horse and the light horse.)

<table data-debug="no-caption" class="half-width-table"><tbody><tr><td></td><td>Horse, Heavy</td></tr><tr><td></td><td>Large Animal</td></tr><tr><th>Hit Dice:</th><td>3d8+6 (19 hp)</td></tr><tr><th>Initiative:</th><td>+1</td></tr><tr><th>Speed:</th><td>50 ft. (10 squares)</td></tr><tr><th>Armor Class:</th><td>13 (–1 size, +1 Dex, +3 natural), touch 10, flat-footed 12</td></tr><tr><th>Base Attack/Grapple:</th><td>+2/+9</td></tr><tr><th>Attack:</th><td>Hoof –1 melee (1d6+1*)</td></tr><tr><th>Full Attack:</th><td>2 hooves –1 melee (1d6+1*)</td></tr><tr><th>Space/Reach:</th><td>10 ft./5 ft.</td></tr><tr><th>Special Attacks:</th><td>—</td></tr><tr><th>Special Qualities:</th><td>Low-light vision, scent</td></tr><tr><th>Saves:</th><td>Fort +5, Ref +4, Will +2</td></tr><tr><th>Abilities:</th><td>Str 16, Dex 13, Con 15, Int 2, Wis 12, Cha 6</td></tr><tr><th>Skills:</th><td>Listen +4, Spot +4</td></tr><tr><th>Feats:</th><td>Endurance, Run</td></tr><tr><th>Environment:</th><td>Temperate plains</td></tr><tr><th>Organization:</th><td>Domesticated</td></tr><tr><th>Challenge Rating:</th><td>1</td></tr><tr><th>Advancement:</th><td>—</td></tr><tr><th>Level Adjustment:</th><td>—</td></tr></tbody></table>

The statistics presented here describe large breeds of working horses such as Clydesdales. These animals are usually ready for heavy work by age three. A heavy horse cannot fight while carrying a rider.


