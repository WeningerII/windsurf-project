# M&M 3e equipment — provenance repair, item by item

> **SUPERSEDED IN PART, 2026-07-30.** The repair below segregated 79 non-SRD
> entries into `equipment/original-not-srd.ts` rather than deleting them, on the
> stated ground that removing shipped content was the owner's call. The owner
> made that call: **all 79 are deleted**, the module is gone, and the
> `originalContentSources` policy channel that admitted them is gone with it.
> This app transcribes open documents; it does not author game content.
> What still ships is the generated Hero SRD tier, 113/113. The group (b) table
> below is now a record of what was removed, not of what is segregated — read it
> that way. Everything about group (a), the fidelity findings and the duplicate
> findings is unaffected.

Companion record for the change that replaced the hand-written mam3e equipment
modules with an encoder (`scripts/encode-mam-equipment.mjs`) plus a segregated
non-SRD module. This file exists so every reclassification is reviewable
individually rather than as a bulk assertion.

The tables below are a **record of the repair**, fixed at the time it landed. The
live invariant — that the generated tier still matches the pinned Hero SRD
manifest on name, cost and type — is enforced by `npm run check:mam-equipment`
inside `npm run verify`, and the shipped totals are reported by
`docs/generated/roadmap-metrics.md`. If this file and the gate disagree, the gate
is right.

## The finding

`src/data/mutants-and-masterminds/3e/equipment/*.ts` shipped **150 hand-written
entries, every one tagged `source: "Hero's Handbook"`.** Diffed by name against
the Hero SRD `EQUIPMENT_LIST` (frnprt/mm3e-character-creator `js/data.js` — the
same upstream `src/scripts/srd-coverage.ts` already cites for the mam3e
powers/advantages/equipment/skills denominators):

Counted two ways, because entries and names are not the same population — `Plate
Armor` and `Chain Mail` each shipped twice, so 150 entries carry only 148 distinct
names. Both bases are given explicitly; an earlier revision of this table mixed
them and did not add up.

| | |
|---|---|
| Hero SRD equipment entries | 113 |
| Shipped entries | 150 |
| Distinct shipped names | 148 |
| Distinct shipped names present in the Hero SRD | 45 |
| Distinct shipped names absent from the Hero SRD | 103 |
| Shipped **entries** with no Hero SRD name match | 104 |
| Hero SRD entries absent from the product | 68 |

Matching is by normalized name (case and punctuation folded), which is why
`Chain Mail` counts as present against the SRD's `Chain-mail` while `Plate Armor`
does not against `Plate-mail`.

The 45 that matched by name were not faithful either — the SRD prints Club 2
(shipped 1), Knife 2 (1), Sword 4 (3), Spear 4 (2), Whip 5 (2), Shuriken 3 (1),
Bow 6 (3), Crossbow 7 (3), Submachine Gun 12 (10), Assault Rifle 15 (12), Shotgun
10 (9), Sniper Rifle 11 (12), Battleaxe 3 (4), Rocket Launcher 27 (19). The
generated tier now carries the SRD's own numbers.

Two entries also shipped **twice under different ids**, which id-based dedupe
could not see: `Plate Armor` (`medieval-plate-armor`, `plate-armor`) and
`Chain Mail` (`medieval-chain-mail`, `chain-mail`). Both collapse into the
generated SRD rows (`Plate-mail`, `Chain-mail`). The gate now fails on duplicate
names as well as duplicate ids.

## What changed

- **113/113 Hero SRD entries are generated and cited** (`M&M 3e Hero SRD`) into
  `equipment/srd-{weapons,armor,vehicles,gear,headquarters}.ts`. Re-running the
  encoder on unchanged input produces a byte-identical tree.
- **Nothing was deleted *by this repair*.** The 104 non-SRD entries split into
  the two groups below; group (b) was deleted later, on 2026-07-30, by the
  decision recorded in the banner at the top of this file.
- Group **(a)** — 25 entries that are demonstrably the SRD's own item under a
  different name — are **reconciled**: the SRD name, cost and type win, and the
  hand-written duplicate is gone from the hand-written surface. The item still
  ships; it ships under its real name with its real stats.
- Group **(b)** — 79 entries with no SRD counterpart at all — were **kept**,
  moved to `equipment/original-not-srd.ts`, and relabelled
  `source: 'Original Content (not SRD)'`, keeping every stat field they had.
  **They were deleted on 2026-07-30** (see the banner); the list below is the
  record of what went.

The data model has no alias/`aka` field, so no group (a) entry carries its old
name forward; inventing a field for that was out of scope. The pre-change names
are recorded in the tables below, which is the reviewable record.

### Reconciliation rule

An entry is group (a) only when the shipped name and the SRD name denote the same
object by direct lexical correspondence — a parenthetical (`Sedan` /
`Car (Sedan)`), a word reordering (`Fighter Jet` / `Jet Fighter`), a synonym
substitution on a shared head noun (`Plate Armor` / `Plate-mail`), or a shipped
description that literally names the SRD entry (`Zip Ties` → "Plastic
restraints."). Everything else is group (b).

The rule is deliberately asymmetric. Misfiling a real rename as (b) costs a
near-duplicate row; misfiling a distinct item as (a) destroys it. Where the
descriptions assert incompatible mechanics the answer is (b) even when the names
are close — `Tracking Device` ("GPS tracker and receiver") is **not** the SRD's
`Mini-Tracer` ("adhesive radio transmitter"), so it stays.

## Group (a) — reconciled to the SRD entry (25)

| Was (hand-written) | Now (generated SRD entry) | Why |
|---|---|---|
| Undercover Vest (cost 2, prot 2) | Undercover Shirt (cost 2, Protection 2) | shared distinctive modifier; exact cost + protection |
| Plate Armor `medieval-plate-armor` (6) | Plate-mail (5) | armor/mail synonym on shared head |
| Plate Armor `plate-armor` (6) | Plate-mail (5) | second copy of the same item |
| Chain Mail `medieval-chain-mail` (4) | Chain-mail (3) | name match; the SRD cost wins |
| Chain Mail `chain-mail` (4) | Chain-mail (3) | second copy of the same item |
| Shield (2) | Small Shield (2) | name is a prefix of the SRD name; exact cost |
| Laser Pistol (9, Damage 5) | Blaster Pistol (10, Ranged Damage 5) | laser/blaster substitution on shared head; damage matches |
| Laser Rifle (14, Damage 8) | Blaster Rifle (16, Ranged Damage 8) | as above |
| Grenade (8, Damage 5, Burst Area) | Grenade (Fragmentation) (15, Ranged Burst Area Damage 5) | SRD parenthetical; damage + area match |
| Throwing Stars (2, Multiattack) | Shuriken (3, Ranged Multiattack Damage 1) | direct synonym; the shipped `Shuriken` entry's own description read "Small throwing stars" |
| Smoke Grenade (2) | Grenade (Smoke) (12) | SRD parenthetical |
| Flash-Bang Grenade (3) | Grenade (Flash-bang) (16) | SRD parenthetical |
| Tear Gas (3) | Grenade (Tear Gas) (16) | SRD parenthetical |
| Tear Gas Grenade (2) | Grenade (Tear Gas) (16) | second copy of the same item |
| Diving Gear (2, "SCUBA equipment") | SCUBA Gear (2) | shared head noun; exact cost; description names it |
| Zip Ties (1, "Plastic restraints. Toughness 3.") | Restraints (Plastic) (1) | description names the SRD entry |
| Medkit (1, "+2 Treatment") | First Aid Kit (1, "+2 Treatment checks") | synonym; exact cost and effect; `first-aid-kit` already shipped separately |
| Forensic Kit (gear, 2, "+2 Investigation") | Toolkit (Forensic) (2) | kit/toolkit synonym on shared "Forensic"; exact cost |
| Forensics Kit (device, 1) | Toolkit (Forensic) (2) | second copy of the same item |
| Grappling Gun (3) | Grapple Gun (1) | direct paraphrase; `grapple-gun` already shipped separately |
| Sedan (10) | Car (Sedan) (10) | SRD parenthetical; exact cost |
| SUV (11) | SUV/Truck (12) | shipped name is a component of the SRD name |
| Fighter Jet (40) | Jet Fighter (38) | word reordering |
| House (3) | HQ: Size – Small (house) (1) | SRD parenthetical |
| Mansion (6) | HQ: Size – Large (mansion) (3) | SRD parenthetical |
| Warehouse (4) | HQ: Size – Medium (warehouse) (2) | SRD parenthetical |
| Skyscraper (15) | HQ: Size – Huge (skyscraper) (4) | SRD parenthetical |

(29 rows, 25 distinct shipped entries plus the 4 duplicate copies.)

## Group (b) — no Hero SRD counterpart; DELETED 2026-07-30 (79)

These had no Hero SRD counterpart. The repair relabelled them
`source: 'Original Content (not SRD)'` and moved them to
`equipment/original-not-srd.ts`, keeping every field. That module and all 79
entries were deleted on 2026-07-30. The list is kept as the record of what the
product stopped shipping.

**Weapons (10)** — Unarmed, Great Sword, Axe, Staff, Throwing Knife, Machine Gun,
Combat Staff, Net, Stun Baton, Compound Bow.
Notes: the SRD's melee list has Battleaxe but no generic "Axe"; `Net` is not the
SRD's `Bolos` (Snare 4 vs Snare 3, thrown net vs bolas); `Stun Baton` is not the
SRD's `Stun Gun` (Affliction 3 close baton vs Affliction 5 gun); `Compound Bow`
is a modern variant alongside the SRD's `Bow`.

**Armor (14)** — Leather Jacket, Light Body Armor, Tactical Vest, Heavy Body
Armor, Riot Armor, Bomb Suit, Riot Shield, Helmet, Motorcycle Helmet, Combat
Helmet, Light Power Armor, Heavy Power Armor, Tactical Body Armor, Energy Shield
Bracelet.
Notes: `Leather Jacket` is not the SRD's archaic `Leather Armor` despite matching
stats; `Riot Shield` is not a size band in the SRD's Small/Medium/Large shield
row; the modern-armor ladder (Light/Tactical/Heavy/Tactical Body) has no
counterpart in the SRD's two modern entries (Undercover Shirt, Bulletproof Vest),
so only the exact match was reconciled.

**Vehicles (17)** — Bicycle, Compact Car, Pickup Truck, Bus, Semi Truck, Tank,
Yacht, Submarine, Light Aircraft, Commercial Jet, Attack Helicopter, Jet Pack,
Space Shuttle, Armored Truck, Armored Speedboat, Hovercraft, Stealth Jet.
Note: `Pickup Truck` also maps loosely onto `SUV/Truck`, but that row is already
claimed by `SUV`; collapsing two shipped vehicles into one SRD row would lose an
entry, so it stays.

**Devices (11)** — Holographic Projector, Utility Belt, Power Ring, Mystic
Amulet, Powered Armor, Web Shooters, Magic Wand, Force Field Belt, Telepathic
Headband, Gravity Boots, Dimensional Anchor.

**Gear (16)** — Backpack, Climbing Gear, Duct Tape, Electronic Toolkit, Evidence
Collection Kit, Fire Starter, Food & Water, Portable Computer, Radio, Rope,
Survival Kit, Spy Glasses, Tracking Device, Bug Detector, Portable Medkit,
Emergency Beacon.
Notes: `Electronic Toolkit` is not the SRD's generic `Toolkit (Basic)`;
`Evidence Collection Kit` (collection/preservation) is not `Toolkit (Forensic)`
(analysis); `Portable Medkit` (cost 2) is not `First Aid Kit` (cost 1);
`Portable Computer` and `Radio` sit alongside, not on top of, the SRD's
`Computer` and `Commlink`.

**Headquarters (11)** — Small Apartment, Large Apartment, Office Building,
Underground Bunker, Secret Lair, Island Fortress, Space Station, Pocket
Dimension, Mobile Base, Underwater Base, Castle.
Note: the SRD models HQs as a size row plus separately-bought feature rows; these
eleven are pre-built bases, which the SRD does not print.

## The source label, and why the channel is gone

`Original Content (not SRD)` was admitted through an `originalContentSources`
field on `SystemOpenContentPolicy` (`src/utils/openContentPolicy.ts`), separate
from `allowedSources`. That separation was right as far as it went: folding the
label into `allowedSources` would have made the whitelist mean two things at once
— "transcribed from an open document" and "we wrote this" — which is how the
original defect became invisible in the first place.

What it got wrong was staying in the product at all. A second admission channel
made shipping self-authored content a one-line addition, and 106 entries across
six systems took it. Both the content and the channel were removed on 2026-07-30.
`isOpenContentCompliant` now admits `allowedSources` and nothing else, so an
entry this project wrote has nowhere to be admitted from and fails the gate.
`NOTICE` and `src/legal/attributions.ts` no longer disclose a split, because
there is none: every M&M row that ships is Open Game Content.

## Residual — stated, not implied

- **Only name, cost and type are gated.** `scripts/check-mam-equipment-provenance.mjs`
  ratchets those three fields against the pinned manifest. The SRD `details`
  string is transcribed verbatim into `description`, but its *content* is not
  field-compared — prose fidelity is unaudited, exactly as it is everywhere else
  in the repo.
- **The generated tier carries no structured stat fields.** `protection`,
  `damage`, `damageType`, `toughness`, `size`, `speed` and friends are printed
  inside the SRD details prose; parsing them back out would be derivation rather
  than transcription, so the generated entries carry only the `MaMEquipment`
  surface. Nothing in the product reads those fields today (`loadMam3eEquipment`
  flattens to `Item[]`; only `metadata.ts` counts lengths), so this is a data-model
  narrowing, not a functional regression — but it *is* a narrowing.
- **17 entries changed type from `device` to `gear`.** Binoculars, Camera, Cell
  Phone, Computer, Flashlight, Gas Mask, GPS Receiver, Lock Picks, Multi-tool,
  Night Vision Goggles, Parachute, Rebreather, Video Camera, Commlink, Fire
  Extinguisher, First Aid Kit and Grapple Gun are printed by the SRD under
  "General Equipment". `device` in M&M means a power-bearing Device, which these
  are not, so the previous typing was part of the same hand-authored drift.
- ~~**`original-not-srd.ts` stays hand-written and stays unaudited.**~~
  **RESOLVED 2026-07-30** by deletion. The residual existed because there was no
  upstream to encode that module from and nothing to check its stat blocks
  against — which is the same reason it should not have shipped. The gate now
  fails any entry that does not come from a generated Hero SRD module.
- **Entry ids changed** where the SRD name differs from the old name (e.g.
  `gps` → `gps-receiver`, `flash-bang` → `grenade-flash-bang`). `Mam3eDataModel`
  has no equipment field, so no saved character references these ids.
