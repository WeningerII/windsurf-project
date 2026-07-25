# M&M 3e equipment — provenance repair, item by item

Companion record for the change that replaced the hand-written mam3e equipment
modules with an encoder (`scripts/encode-mam-equipment.mjs`) plus a segregated
non-SRD module. This file exists so every reclassification is reviewable
individually rather than as a bulk assertion.

## The finding

`src/data/mutants-and-masterminds/3e/equipment/*.ts` shipped **150 hand-written
entries, every one tagged `source: "Hero's Handbook"`.** Diffed by name against
the Hero SRD `EQUIPMENT_LIST` (frnprt/mm3e-character-creator `js/data.js` — the
same upstream `src/scripts/srd-coverage.ts` already cites for the mam3e
powers/advantages/equipment/skills denominators):

| | |
|---|---|
| Hero SRD equipment entries | 113 |
| Shipped entries | 150 |
| Shipped names present in the Hero SRD | 45 |
| Shipped names absent from the Hero SRD | 104 |
| Hero SRD entries absent from the product | 68 |

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
- **Nothing was deleted.** The 104 non-SRD entries split into two groups below.
- Group **(a)** — 25 entries that are demonstrably the SRD's own item under a
  different name — are **reconciled**: the SRD name, cost and type win, and the
  hand-written duplicate is gone from the hand-written surface. The item still
  ships; it ships under its real name with its real stats.
- Group **(b)** — 79 entries with no SRD counterpart at all — are **kept**, moved
  to `equipment/original-not-srd.ts`, and relabelled
  `source: 'Original Content (not SRD)'`. They keep every stat field they had.

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

## Group (b) — kept, relabelled `Original Content (not SRD)` (79)

These have no Hero SRD counterpart. They live in
`src/data/mutants-and-masterminds/3e/equipment/original-not-srd.ts` and keep
every field they had; only `source` changed.

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

## The source label, and why the policy needed a new channel

`Original Content (not SRD)` is admitted through a **new**
`originalContentSources` field on `SystemOpenContentPolicy`
(`src/utils/openContentPolicy.ts`), not through `allowedSources`.

Adding it to `allowedSources` would have made the whitelist mean two different
things at once — "transcribed from an open document" and "we wrote this" — which
is how the original defect became invisible in the first place. `check-legal-notices`
does not inspect data sources at all (it gates the NOTICE / license texts /
in-app reachability), so it neither blesses nor blocks the label; what actually
governs whether an entry ships is `isOpenContentCompliant`, and that now accepts
either channel while keeping them distinguishable. `NOTICE` and
`src/legal/attributions.ts` disclose the split explicitly, so the M&M attribution
no longer implies that every shipped M&M row is Open Game Content.

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
- **`original-not-srd.ts` stays hand-written and stays unaudited.** There is no
  upstream to encode it from and nothing to check its stat blocks against. The
  gate only proves it does not *claim* the SRD.
- **Entry ids changed** where the SRD name differs from the old name (e.g.
  `gps` → `gps-receiver`, `flash-bang` → `grenade-flash-bang`). `Mam3eDataModel`
  has no equipment field, so no saved character references these ids.
