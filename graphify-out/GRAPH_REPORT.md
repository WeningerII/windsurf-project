# Graph Report - windsurf-project  (2026-07-20)

## Corpus Check
- 788 files · ~547,503 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 4909 nodes · 13943 edges · 197 communities (178 shown, 19 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 115 edges (avg confidence: 0.71)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `35b00e7a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Sheet Resource Loading Hooks
- Dnd5e Sheets & E2E Tests
- Dnd5e Equipment & Features UI
- Dnd5e Background Templates
- Dnd5e2024 Engine & Hit Dice
- Daggerheart Engine
- 3.5e Monster Data Encoder
- Tabs UI Component
- Node Runtime Bootstrap
- Scene Combat Resolution
- Dnd5e Class Templates
- System Compute Registers
- Scene Check Panel
- Dnd5e Activity Definitions
- Monster & NPC Generator
- Dnd5e Feat Templates
- App Shell & Layout
- D20 Combat Controls
- Game System Selector
- Combat & Recap Panels
- D20 Legacy System Engines
- Dnd35e Saves & Data Model
- Daggerheart Data Model
- System Registry & Renderer
- Game Rules & Proficiencies
- Campaign Sync Hooks
- Daggerheart Inventory
- Pf2e Character Templates
- Roadmap Metrics Generator
- Dnd5e Feature List Sections
- Encounter & Initiative Panels
- Class Enhancement & Headers
- Pf2e Sheet Tabs
- AI Encounter Drafting
- Quest & Session Log UI
- Currency & Inventory Editors
- Document Sync Engine
- Sheet Header & Stat Cards
- Check & Oracle Resolution
- Mam3e Data Model & Engine
- Doc Drift Rules
- NPM Build Scripts
- Condition Effects by System
- Equipped Armor Section
- Spell Browser UI
- Scene Combat Area Effects
- Error Boundary & Auth Context
- Encounter Builder Logic
- Scene Management Hooks
- Monster Combatant Builder
- D20 Legacy Templates
- Campaign Storage & Hooks
- Spell Preparation Logic
- Dev Dependencies
- Character Combatant Builder
- D20 Class Spellcasting
- SRD Manifest Generator
- Daggerheart Combatant Builders
- AI Gateway Adapters
- AI Gateway Contracts
- System Definitions & Types
- D20 Legacy Spell Slots
- SRD Coverage Script
- ESLint Config
- Spells Tab Components
- Browser Compat & Error Logging
- AI Gateway Client
- 2024 Monster Data Encoder
- Character Effects Compilation
- TypeScript Config
- Mam Character Sheet Tabs
- Monster Stat Block & Status
- Dice Panel & Mam3e Resolution
- System Validation Logic
- Spell Catalog Consistency Tests
- Dnd5e Resource Loading Hooks
- Mam Powers & Cost Ledger
- Sync Engine Tests
- Dnd5e Feature Options
- Document Migrations & Storage
- App Header & Auth UI
- Combat Toggles & Conditions
- HP & Spell Slot Trackers
- Scene Grid View
- Boundary Validation Tests
- capabilityScenarios.test.tsx
- Equipment & Feature Browsers
- Pf2e Engine & Constants
- Documents Hook & Persistence
- Daggerheart Contribution Ledger
- Dnd35e/Pf1e Derived Math
- Mam Browser Tabs
- Pf2e Derived Math
- TypeDoc Config
- Pf2e Spell Data Encoder
- Sync Tombstones
- Skills Tab & Combat Math
- Mam3e Derived Math
- Doc Drift Tests
- Spell Catalog Parity Tests
- Pf2e Spell Types & Traits
- Document Storage (IndexedDB)
- 5e Monster Encoder
- Knip Lint Config
- PF2e Monster Encoder
- AI Creature Identification
- Character Card Presenter
- Oracle Panel & Logic
- 5e Equipment Tab
- Scene Reaction Panel
- Document Signature Hashing
- Resource Pool Tracking
- Bundle Size Check
- AI Prompt Builders
- 5e Feat Browser
- Project Dependencies
- 3.5e Spell Encoder
- AI Encounter Draft Flow
- Campaign File Transfer
- MAM Archetype Browser
- PF1e Spell Encoder
- validation.ts
- PF2e Archetypes Tab
- 3.5e Gear & Weapons
- 5e Equipment Encoder
- 5e Spell Encoder
- Daggerheart Adversary Encoder
- Service Worker Update Banner
- Toast Notifications
- Daggerheart Sheet Automation
- d20LegacySpellcasting.ts
- Retry With Backoff
- 2024 Spell Encoder
- MAM Power Browser
- Spell Validation Checks
- TS Node Config
- TS Test Config
- System Smoke Tests
- Prettier Config
- pf2eConditions.ts
- pf2eSpellTraits.test.ts
- TS Base Config
- MAM Equipment Types
- Package Manifest
- Verification Baseline Script
- Scene Illustration Panel
- TS Netlify Config
- Generated Docs Check
- Playwright Browser Check
- Repo Hygiene Check
- Equipment Browser Component
- ServiceWorkerUpdateBanner.tsx
- Dnd5eEquipmentTab.tsx
- 5e Movement Rules
- MamArchetypesTab.tsx
- PF2e Backgrounds Data
- Host Size Budget Test
- Vitest Type Defs
- MAM Complications Data
- MAM Power Modifiers Data
- Vitest Coverage Config
- useEntitySync.ts
- syncTombstones.ts
- loadEquipmentForSystem
- MamArchetypesTab.tsx
- eslint-plugin-react
- fake-indexeddb
- MamComplicationBrowser.tsx
- index.ts
- retryWithBackoff
- daggerheart-engine.test.ts
- @types/react
- @types/react-dom
- imageInput.ts
- @vitest/coverage-v8
- @playwright/test
- @testing-library/user-event
- @typescript-eslint/eslint-plugin
- @typescript-eslint/parser
- @vitest/ui

## God Nodes (most connected - your core abstractions)
1. `CharacterDocument` - 242 edges
2. `react` - 167 edges
3. `SystemDataModel` - 126 edges
4. `GameSystemId` - 79 edges
5. `EffectInstance` - 66 edges
6. `abilityMod()` - 61 edges
7. `makeEffectId()` - 59 edges
8. `Dnd5eDataModel` - 52 edges
9. `SystemRegistry` - 48 edges
10. `Pf2eDataModel` - 48 edges

## Surprising Connections (you probably didn't know these)
- `AbilityScoreGrid()` --indirect_call--> `mod()`  [INFERRED]
  src/components/sheet/AbilityScoreGrid.tsx → scripts/encode-35e-monsters.mjs
- `D20AbilitiesTab()` --indirect_call--> `mod()`  [INFERRED]
  src/systems/d20-legacy/components/D20AbilitiesTab.tsx → scripts/encode-35e-monsters.mjs
- `Pf2eAbilitiesTab()` --indirect_call--> `mod()`  [INFERRED]
  src/systems/pf2e/components/Pf2eAbilitiesTab.tsx → scripts/encode-35e-monsters.mjs
- `Dnd5eNotesTab()` --indirect_call--> `field()`  [INFERRED]
  src/systems/dnd5e/shared/components/Dnd5eNotesTab.tsx → scripts/encode-daggerheart-adversaries.mjs
- `inferAbilityChoiceRequirement()` --indirect_call--> `ability()`  [INFERRED]
  src/systems/dnd5e/shared/featTemplate.ts → scripts/encode-pf1e-monsters.mjs

## Import Cycles
- None detected.

## Communities (197 total, 19 thin omitted)

### Community 0 - "Sheet Resource Loading Hooks"
Cohesion: 0.06
Nodes (81): ManifestCategory, useLazyResource(), useSystemOptions(), CATEGORY_LOADERS, CategoryLoader, Loaded, SystemConfig, SYSTEMS (+73 more)

### Community 1 - "Dnd5e Sheets & E2E Tests"
Cohesion: 0.09
Nodes (37): categoryIcons, GameSystemSelector(), systemAccents, supportBadgeLabels, supportBadgeStyles, buildInitialSummaryStates(), categoryDisplay, SummaryState (+29 more)

### Community 2 - "Dnd5e Equipment & Features UI"
Cohesion: 0.12
Nodes (21): clampTrack(), DeathSaves, DeathSavesTracker(), Props, HitDiceTracker(), Props, Props, SLOT_LEVELS (+13 more)

### Community 3 - "Dnd5e Background Templates"
Cohesion: 0.06
Nodes (58): resolveFeatSelections(), ABILITY_NAME_TO_ID, ABILITY_OPTIONS, abilityAutomationFromSelections(), aggregateFeatAutomation(), applyDnd5eFeatTemplate(), applyFeatSkillSources(), buildAutomatedFeat() (+50 more)

### Community 4 - "Dnd5e2024 Engine & Hit Dice"
Cohesion: 0.07
Nodes (28): HIT_DICE, hitDieSize(), hitDieString(), Dnd5e2024Engine, hasAlertFeat(), totalCharacterLevel(), DND5E_CONDITION_NAMES, hasDnd5eCondition() (+20 more)

### Community 5 - "Daggerheart Engine"
Cohesion: 0.09
Nodes (43): applyDnd5eClassTemplate(), applyDnd5eSubclassTemplate(), assertMulticlassRequirements(), ATTRIBUTE_NAME_TO_ID, buildDerivedProficiencies(), buildSpellcastingState(), canSelectSubclass(), classFeaturesAtLevel() (+35 more)

### Community 6 - "3.5e Monster Data Encoder"
Cohesion: 0.06
Nodes (57): ALIGNMENTS, DICE_PROGRESSIONS, main(), mapAlignment(), mod(), MONSTER_SIZE, normalizeName(), OLIMOT_FILES (+49 more)

### Community 7 - "Tabs UI Component"
Cohesion: 0.07
Nodes (47): Badge(), BadgeProps, badgeVariants, Tabs, TabsContent, TabsContentProps, TabsContext, TabsContextValue (+39 more)

### Community 8 - "Node Runtime Bootstrap"
Cohesion: 0.09
Nodes (49): main(), runBootstrapNodeInstall(), getPinnedCommandArgs(), main(), runPinnedNpmCommand(), formatRuntimeDoctorReport(), main(), readWorkflowPinSource() (+41 more)

### Community 9 - "Scene Combat Resolution"
Cohesion: 0.05
Nodes (61): terrainEffectsForPreset(), UseSceneEncounterParams, PlacementMode, Props, SceneManager(), buildSceneCombatants(), factionForToken(), appendSceneEvent() (+53 more)

### Community 10 - "Dnd5e Class Templates"
Cohesion: 0.16
Nodes (21): MamPowersTab(), ModifierColumn(), ModifierColumnProps, buildMam3eContributionLedger(), buildMam3ePowerCostLedgerEntries(), createPowerCostEntry(), ledgerId(), calculateMam3eFinalPowerCost() (+13 more)

### Community 11 - "System Compute Registers"
Cohesion: 0.17
Nodes (15): daggerheartComputeRegister, dnd35eComputeRegister, dnd5e2014ComputeRegister, dnd5e2024ComputeRegister, COMPUTE_REGISTERS, registerForSystem(), mam3eComputeRegister, pf1eComputeRegister (+7 more)

### Community 12 - "Scene Check Panel"
Cohesion: 0.15
Nodes (15): e(), spySink(), spySink(), BrowserCapabilities, checkBrowserCapabilities(), initBrowserCompat(), isBrowserSupported(), showCompatibilityWarning() (+7 more)

### Community 13 - "Dnd5e Activity Definitions"
Cohesion: 0.09
Nodes (27): buildDefenseStyleActivity(), buildDivineSmiteActivities(), buildDivineSmiteActivity(), buildDnd5eActivityDefinitions(), buildUnsupportedDivineSmiteActivity(), divineSmiteSlotLevel(), Dnd5eActivityCost, Dnd5eActivityCostKind (+19 more)

### Community 14 - "Monster & NPC Generator"
Cohesion: 0.07
Nodes (40): FEATURE_FLAGS, FeatureFlag, FeatureFlagDefinition, isFeatureEnabled(), RingBuffer, ALLOWED_ENUM_VALUES, SanitizedProps, TelemetryEnumValue (+32 more)

### Community 15 - "Dnd5e Feat Templates"
Cohesion: 0.10
Nodes (31): Props, D20SkillsTab(), Props, AddEntryInput, buildBaseAttackBonusEntries(), buildD20LegacyContributionLedger(), buildSaveEntries(), buildSkillSynergyEntries() (+23 more)

### Community 16 - "App Shell & Layout"
Cohesion: 0.11
Nodes (21): formatBackgroundToolLabel(), ChoiceSlot, Dnd5eBackgroundSection(), Props, ChoiceSlot, Dnd5eSpeciesSection(), Props, GetDnd5eTemplateChoiceStateProps (+13 more)

### Community 17 - "D20 Combat Controls"
Cohesion: 0.10
Nodes (29): casterTypes, classResourcesNeeded, classTags, getEligibleDnd5eFeatureOptions(), featureOptionSelectionKey(), ABILITY_TOKEN_MAP, collectAlwaysPreparedByLevelSources(), collectAlwaysPreparedGrantSources() (+21 more)

### Community 18 - "Game System Selector"
Cohesion: 0.10
Nodes (16): conditionImposesDisadvantage(), createDefaultDnd5eData(), Dnd5eEngine, makeDoc(), makeDoc(), doc(), engine2014, engine2024 (+8 more)

### Community 19 - "Combat & Recap Panels"
Cohesion: 0.12
Nodes (24): AppHeader(), AppHeaderProps, Mode, SignIn(), SignInProps, UserMenu(), UserMenuProps, assertNever() (+16 more)

### Community 20 - "D20 Legacy System Engines"
Cohesion: 0.17
Nodes (15): mam3eAfflictionDC(), mam3eAttackDC(), mam3eAttackHits(), mam3eCriticalDC(), mam3eDamageResistanceDC(), mam3eDegreesOfFailure(), mam3eDegreesOfSuccess(), mam3eEquipmentPoints() (+7 more)

### Community 21 - "Dnd35e Saves & Data Model"
Cohesion: 0.05
Nodes (70): resolveCharacterEffects(), computeD20LegacyAC(), D20_SIZE_MOD, d20LegacyCheckPenalty(), applyDerivedQuantities(), rollD20(), Props, D20Save (+62 more)

### Community 22 - "Daggerheart Data Model"
Cohesion: 0.05
Nodes (59): ABILITY_KEYS, TIER_BONUS, validatePf2eBuild(), Props, Props, Pf2eNotesTab(), Props, createDefaultPf2eData() (+51 more)

### Community 23 - "System Registry & Renderer"
Cohesion: 0.07
Nodes (35): Props, CharacterCardProps, CharacterListViewProps, TokenPanelProps, Props, SystemSheetRenderer(), SystemEngine, D20LegacySheet() (+27 more)

### Community 24 - "Game Rules & Proficiencies"
Cohesion: 0.07
Nodes (33): GAME_RULES, ArmorProficiency, ArmorProficiencyType, ArtisanToolProficiency, isValidArmorProficiency(), isValidSkillProficiency(), isValidToolProficiency(), isValidWeaponProficiency() (+25 more)

### Community 25 - "Campaign Sync Hooks"
Cohesion: 0.11
Nodes (39): cellKey(), footprintCells(), footprintWithinGrid(), isOracleAnswer(), isOracleOdds(), resolveOracle(), applyHitPointDelta(), applySceneEvent() (+31 more)

### Community 26 - "Daggerheart Inventory"
Cohesion: 0.12
Nodes (27): findDaggerheartInventoryDefinitionByName(), ancestryLookup, armorLookup, buildLookup(), classLookup, communityLookup, DEFAULTS, domainCardByName (+19 more)

### Community 27 - "Pf2e Character Templates"
Cohesion: 0.11
Nodes (44): abilityBoostValue(), ancestryFeatures(), applyAbilityAdjustments(), applyPf2eAncestryTemplate(), applyPf2eArchetypeTemplate(), applyPf2eBackgroundTemplate(), applyPf2eClassTemplate(), archetypeSource() (+36 more)

### Community 28 - "Roadmap Metrics Generator"
Cohesion: 0.09
Nodes (38): applyRepoResidentOverrides(), buildComputeCompletion(), buildContentCompletion(), buildMarkdownReport(), ComputeCompletionRow, computeMetrics(), ContentCompletionRow, createEmptyCategoryCounts() (+30 more)

### Community 29 - "Dnd5e Feature List Sections"
Cohesion: 0.08
Nodes (42): DamageHealControl(), DamageHealControlProps, DiceRollButton(), DiceRollButtonProps, clampExhaustion(), Props, RestControls(), RollResult (+34 more)

### Community 30 - "Encounter & Initiative Panels"
Cohesion: 0.17
Nodes (22): appendInventoryFromBackground(), applyDnd5eBackgroundTemplate(), BackgroundChoiceSlot, BackgroundChoiceValue, backgroundDerivedState(), COMMON_LANGUAGE_OPTIONS, Dnd5eBackgroundTemplateSelections, Dnd5eLikeDataModel (+14 more)

### Community 31 - "Class Enhancement & Headers"
Cohesion: 0.11
Nodes (26): GameSystemSelectorProps, Props, UseD20LegacySheetResourcesProps, UseDaggerheartSheetResourcesProps, Dnd5eEquipmentTab, Dnd5eFeatBrowserTab, Dnd5eFeaturesTab, Dnd5eMonsterBrowserTab (+18 more)

### Community 32 - "Pf2e Sheet Tabs"
Cohesion: 0.12
Nodes (20): availableDnd5eToggles(), collectDnd5eRiderEffects(), DND5E_TOGGLE_IDS, Dnd5eRiderInputs, RAGE_DAMAGE_BREAKPOINTS, rageDamageBonus(), sneakAttackDice(), availablePf2eToggles() (+12 more)

### Community 33 - "AI Encounter Drafting"
Cohesion: 0.21
Nodes (12): DEFAULT_QUICK_ROLLS, DicePanel(), DicePanelProps, formatBreakdown(), QUICK_ROLLS_BY_SYSTEM, applyKeep(), DiceRollResult, DiceTerm (+4 more)

### Community 34 - "Quest & Session Log UI"
Cohesion: 0.09
Nodes (36): Props, QuestList(), STATUS_BADGE, STATUS_OPTIONS, DATE_FORMAT, Props, SessionLog(), Props (+28 more)

### Community 35 - "Currency & Inventory Editors"
Cohesion: 0.50
Nodes (4): buildSystem(), escape(), isRecord(), main()

### Community 36 - "Document Sync Engine"
Cohesion: 0.06
Nodes (91): critModelForScene(), degreeModelForScene(), resolveSceneAreaEffect(), resolveSceneAttack(), runSceneRound(), SceneAreaEffectOutcome, SceneAttackOutcome, SceneRoundOutcome (+83 more)

### Community 37 - "Sheet Header & Stat Cards"
Cohesion: 0.10
Nodes (32): buildCharacterCombatant(), BuildCharacterCombatantResult, CharacterCombatant, normalizeSheet(), readArmorClass(), toMagicBonusItems(), toModifierSources(), D20_PROFILES (+24 more)

### Community 38 - "Check & Oracle Resolution"
Cohesion: 0.11
Nodes (17): getDaggerheartHpMarked(), getDaggerheartHpMarkedAfterArmor(), clampDaggerheartInventoryQuantity(), daggerheartInventoryDefinitions, inventoryDefinitionById, inventoryDefinitionByName, isDaggerheartConsumableDefinition(), normalizeDaggerheartCurrency() (+9 more)

### Community 39 - "Mam3e Data Model & Engine"
Cohesion: 0.10
Nodes (29): D20LegacyHeader(), Props, dnd35eAbilityIncreases(), dnd35eConcentrationDCDamage(), dnd35eConcentrationDCDefensive(), dnd35eFeatsFromLevel(), dnd35eHpState, dnd35eLevelForXp() (+21 more)

### Community 40 - "Doc Drift Rules"
Cohesion: 0.06
Nodes (58): DOC_DRIFT_MANIFEST, DocDriftRuleType, DocDriftSurface, DocDriftSurfaceKind, CAPABILITY_PHRASE_RULES, CapabilityPhraseRule, capitalizeSupportLevel(), COMMAND_RUNTIME_RULES (+50 more)

### Community 41 - "NPM Build Scripts"
Cohesion: 0.04
Nodes (45): scripts, bootstrap:node, build, check:bundle-size, check:compute-register, check:compute-register:mutate, check:compute-register:write, check:dead-code (+37 more)

### Community 42 - "Condition Effects by System"
Cohesion: 0.08
Nodes (48): EquippedItemsSection(), Props, SLOT_LABELS, SLOT_ORDER, AttackEconomy, D20SystemProfile, dnd5eProfile, extraAttackCount() (+40 more)

### Community 43 - "Equipped Armor Section"
Cohesion: 0.10
Nodes (26): EquipArmorInput, EquipEntry, EquippedArmorSection(), EquipShieldInput, Props, EquipmentBrowser, Pf2eEquipmentBrowserTabComponent, Props (+18 more)

### Community 44 - "Spell Browser UI"
Cohesion: 0.12
Nodes (26): DEFAULT_LABELS, SpellBrowser(), SpellBrowserLabels, SpellBrowserProps, SpellBrowserSpell, D20SpellBrowserPanelComponent, SpellBrowser, toSpellBrowserSpell() (+18 more)

### Community 45 - "Scene Combat Area Effects"
Cohesion: 0.12
Nodes (20): LegalNotices(), LegalAttributions, LegalLicenseRef, ProvenanceStatus, SystemAttribution, buildNotice(), FetchTarget, fetchValidated() (+12 more)

### Community 46 - "Error Boundary & Auth Context"
Cohesion: 0.13
Nodes (16): AuthContext, AuthContextValue, clearLocalDataForAccountChange(), getLastSyncedUserId(), setLastSyncedUserId(), AuthProvider(), AuthCallback, mockedGetSupabaseClient (+8 more)

### Community 47 - "Encounter Builder Logic"
Cohesion: 0.14
Nodes (30): applyAbilityAdjustments(), applyD20LegacyClassTemplate(), applyD20LegacyRaceTemplate(), buildClassSkills(), classFeaturesUpToLevel(), classSkillOptions(), collectClassFeatureSignatures(), create35eClassLevel() (+22 more)

### Community 48 - "Scene Management Hooks"
Cohesion: 0.25
Nodes (17): useScenes(), NOW, clearSceneStorage(), collectValidScenes(), deleteScene(), hydrateScene(), hydrateSceneEvent(), importScenes() (+9 more)

### Community 49 - "Monster Combatant Builder"
Cohesion: 0.06
Nodes (40): NarrateSceneResult, CheckPanel(), CheckPanelProps, DEFAULT_SUGGESTIONS, DND5E_SKILLS, OUTCOME_BADGE, OUTCOME_LABEL, SKILL_SUGGESTIONS_BY_SYSTEM (+32 more)

### Community 50 - "D20 Legacy Templates"
Cohesion: 0.22
Nodes (25): getDaggerheartShortRestRecovery(), createDaggerheartInventoryEntry(), createLiveRng(), clearAllStress(), clearStress(), prepareGainHope(), repairAllArmor(), repairArmor() (+17 more)

### Community 51 - "Campaign Storage & Hooks"
Cohesion: 0.10
Nodes (28): useCampaigns(), DebouncedPersistence, IMPORTANT: a begun generation must end in either `persist` or, useDebouncedPersistence(), makeScene(), hostileStorage, CAMPAIGNS_STORAGE_KEY, clearCampaignStorage() (+20 more)

### Community 52 - "Spell Preparation Logic"
Cohesion: 0.17
Nodes (14): GamingSetProficiency, MusicalInstrumentProficiency, buildChoiceSlots(), formatDnd5eClassToolChoiceLabel(), getDnd5eClassSkillChoiceSlots(), getDnd5eClassToolChoiceSlots(), canSelectSubclass(), Dnd5eClassesSection() (+6 more)

### Community 53 - "Dev Dependencies"
Cohesion: 0.05
Nodes (41): autoprefixer, eslint, eslint-config-prettier, eslint-plugin-react, eslint-plugin-react-refresh, happy-dom, devDependencies, autoprefixer (+33 more)

### Community 54 - "Character Combatant Builder"
Cohesion: 0.20
Nodes (15): Pf2eProficiencyTier, getPf2eSheetChoiceState(), countTrainedPf2eSkills(), longRestPf2eSpellcasting(), nextPf2eTier(), PF2E_TIER_ORDER, Pf2eBulkState, setPf2eFocusMax() (+7 more)

### Community 55 - "D20 Class Spellcasting"
Cohesion: 0.11
Nodes (26): ABILITIES, DEFENSES, Mam3eCreator(), Mam3eCreatorProps, SKILLS, buildMam3eCreatorData(), createDefaultMam3eDefenseRanks(), DERIVATION_EPOCH (+18 more)

### Community 56 - "SRD Manifest Generator"
Cohesion: 0.15
Nodes (25): applyDnd5eSpeciesTemplate(), buildAbilityChoiceSlots(), buildSpeciesFeatures(), choiceAbilityBonuses(), COMMON_LANGUAGE_OPTIONS, Dnd5eLikeDataModel, Dnd5eSpeciesChoiceSlot, Dnd5eSpeciesTemplateSelections (+17 more)

### Community 57 - "Daggerheart Combatant Builders"
Cohesion: 0.12
Nodes (23): D20ClassesSection(), D20LegacyClassLevel, Props, renderClassOptions(), d20BonusSpells(), buildD20LegacySpellSlotTotals(), countAdvancementLevels(), D20_DOMAIN_CLASS_IDS (+15 more)

### Community 58 - "AI Gateway Adapters"
Cohesion: 0.12
Nodes (26): AI_GATEWAY_SCHEMA_VERSION, aiFailure, AiFailureCode, AiResponse, AiTask, GatewayContext, GatewayTimeoutError, handleAiRequest() (+18 more)

### Community 59 - "AI Gateway Contracts"
Cohesion: 0.15
Nodes (25): AI_GATEWAY_TASKS, AiParse, AiSuccess, AiUsage, EncounterDraftRequest, IdentifyCreatureRequest, IllustrateSceneRequest, isAiResponse() (+17 more)

### Community 60 - "System Definitions & Types"
Cohesion: 0.11
Nodes (16): AI_GATEWAY_ENDPOINT, AiRequest, GeneratedImageData, SceneNarrationData, callAiGateway(), isAiEnabled(), IllustrateGatewayCall, IllustrateSceneParams (+8 more)

### Community 61 - "D20 Legacy Spell Slots"
Cohesion: 0.12
Nodes (21): ABILITIES, DEFENSES, MamAbilitiesTab(), Props, MamHeader(), Props, Props, MAM3E_SKILLS (+13 more)

### Community 62 - "SRD Coverage Script"
Cohesion: 0.10
Nodes (34): cats5e2014, cats5e2024, CoverageTarget, csvRows(), extractJsArray(), extractNameValues(), fetchCsvNames(), fetchJsArrayNames() (+26 more)

### Community 63 - "ESLint Config"
Cohesion: 0.05
Nodes (39): jsx, env, browser, es2021, node, extends, ignorePatterns, overrides (+31 more)

### Community 64 - "Spells Tab Components"
Cohesion: 0.10
Nodes (22): Props, Props, Pf2eSpellsTabComponent, Props, Pf2eSpellcasting, focusPulseSpell, PF2E_DERIVED_TRAITS, PF2E_SCHOOL_TRAITS (+14 more)

### Community 65 - "Browser Compat & Error Logging"
Cohesion: 0.09
Nodes (23): RFC-004, ErrorBoundary, Props, State, LegalNoticesProps, licenseTexts, LibraryBestiaryView(), LoadState (+15 more)

### Community 66 - "AI Gateway Client"
Cohesion: 0.18
Nodes (17): AbilityScoreGrid(), buildPointBuyDraft(), buildStandardArrayDraft(), clampPointBuyScore(), emptyPointBuyDraft(), emptyStandardArrayDraft(), isStandardArrayComplete(), isValidPointBuyDraft() (+9 more)

### Community 67 - "2024 Monster Data Encoder"
Cohesion: 0.16
Nodes (23): ABILITIES, ALIGNMENTS, bucketFor(), classifyImmunityList(), cleanProse(), CR_FRACTIONS, CREATURE_TYPES, DAMAGE_TYPES (+15 more)

### Community 68 - "Character Effects Compilation"
Cohesion: 0.08
Nodes (31): getDaggerheartAncestryAdjustments(), applyDaggerheartAncestryTemplate(), applyDaggerheartClassTemplate(), applyDaggerheartCommunityTemplate(), classTemplateItems(), communityTemplateItems(), DaggerheartInventoryEntry, DEFAULTS (+23 more)

### Community 69 - "TypeScript Config"
Cohesion: 0.07
Nodes (28): ES2020, ./src/*, compilerOptions, allowImportingTsExtensions, baseUrl, forceConsistentCasingInFileNames, isolatedModules, jsx (+20 more)

### Community 70 - "Mam Character Sheet Tabs"
Cohesion: 0.12
Nodes (23): MUTATION_ANCHORS, MutationAnchor, applyDemotion(), DO_MUTATE, DO_WRITE, escapeRe(), evaluateMutation(), evaluateTierA() (+15 more)

### Community 71 - "Monster Stat Block & Status"
Cohesion: 0.21
Nodes (11): DaggerheartDomainCardAutomation(), DaggerheartDomainCardAutomationProps, DaggerheartFeatureList(), DaggerheartFeatureListProps, DaggerheartSubclassFeatureGroup(), DaggerheartSubclassFeatureGroupProps, DOMAIN_CARD_AUTOMATION_LABELS, DOMAIN_CARD_AUTOMATION_VARIANTS (+3 more)

### Community 72 - "Dice Panel & Mam3e Resolution"
Cohesion: 0.09
Nodes (22): rateLimiterFromEnv(), googleAdapter, ProviderRegistryDeps, resolveProviderAdapter(), Clock, createDurableRateLimitStore(), createInMemoryRateLimitStore(), rateLimiterFromStore() (+14 more)

### Community 73 - "System Validation Logic"
Cohesion: 0.25
Nodes (20): ABILITY_SCORE_IDS, addIssue(), Dnd5eValidationData, Dnd5eValidationDataModel, featureOptionKey(), isIntegerInRange(), SPELL_SLOT_LEVELS, validateAbilityScores() (+12 more)

### Community 74 - "Spell Catalog Consistency Tests"
Cohesion: 0.16
Nodes (14): ExpectedSpellIdentity, iconicSpellExpectations, SystemKey, systems, dedupeById(), Identified, indexById(), warnDuplicateId() (+6 more)

### Community 75 - "Dnd5e Resource Loading Hooks"
Cohesion: 0.23
Nodes (19): GetDaggerheartSheetStateProps, UseDaggerheartTemplateHandlersProps, DaggerheartAdversaryRole, DaggerheartAncestry, DaggerheartArmor, DaggerheartClass, DaggerheartCommunity, DaggerheartConsumable (+11 more)

### Community 76 - "Mam Powers & Cost Ledger"
Cohesion: 0.07
Nodes (40): SystemSheetComponent, makeD20LegacySheet(), MamAdvantageBrowserTab(), Props, MamArchetypeBrowser, MamArchetypesTab, MamArchetypesTabComponent, Props (+32 more)

### Community 77 - "Sync Engine Tests"
Cohesion: 0.16
Nodes (14): D20EquipmentBrowserTab, D20EquipmentBrowserTabComponent, EquipmentBrowser, Props, D20FeatBrowserTab, countTrainedSkills(), D20InventoryCurrency, D20InventoryItem (+6 more)

### Community 78 - "Dnd5e Feature Options"
Cohesion: 0.10
Nodes (35): Dnd5eFeatureOptionsSection(), Dnd5eFeatureOptionsSectionComponent, FeatureOptionBrowser, FeatureOptionBrowserProps, featureOptionSelectionKey(), Props, FeatureOptionBrowser(), FeatureOptionBrowserProps (+27 more)

### Community 79 - "Document Migrations & Storage"
Cohesion: 0.06
Nodes (52): cloneDocumentsSnapshot(), documentsChanged(), prepareDocumentsWithEngines(), prepareDocumentWithEngine(), useDocuments(), makeStoredDocument(), setStoredDocuments(), FeatureOptionRoundtripCase (+44 more)

### Community 80 - "App Header & Auth UI"
Cohesion: 0.36
Nodes (7): ThemeToggle(), applyTheme(), getSystemTheme(), isTheme(), Theme, useTheme(), VALID_THEMES

### Community 81 - "Combat Toggles & Conditions"
Cohesion: 0.22
Nodes (8): InventoryItem, InventoryManager(), InventoryManagerProps, Currency, D20InventoryTab(), InventoryItem, Props, existingItems

### Community 82 - "HP & Spell Slot Trackers"
Cohesion: 0.11
Nodes (17): AiImageInput, EncounterDraftCandidate, EncounterDraftData, EncounterDraftSelection, IdentifyCreatureData, TaskGatewayCall, DraftEncounterParams, DraftEncounterResult (+9 more)

### Community 83 - "Scene Grid View"
Cohesion: 0.18
Nodes (14): daggerheartManifest, dnd35eManifest, dnd5e2014Manifest, dnd5e2024Manifest, manifestForSystem(), SRD_MANIFESTS, mam3eManifest, pf1eManifest (+6 more)

### Community 84 - "Boundary Validation Tests"
Cohesion: 0.24
Nodes (18): NOW, parseImg(), validDocInput(), coerceDate(), coerceObjectives(), coerceQuests(), coerceSessionLog(), coerceStringArray() (+10 more)

### Community 85 - "capabilityScenarios.test.tsx"
Cohesion: 0.60
Nodes (3): formatModifierCost(), MamPowerModifierBrowser(), MamPowerModifierBrowserProps

### Community 86 - "Equipment & Feature Browsers"
Cohesion: 0.33
Nodes (9): MARKER_EFFECT_OPTIONS, markerEffectHelp(), MarkerEffectOption, MarkerEffectPreset, MarkerPanel(), MarkerPanelProps, terrainBadgeIcon(), SceneMarkerKind (+1 more)

### Community 87 - "Pf2e Engine & Constants"
Cohesion: 0.09
Nodes (20): GapLedgerItem, LedgerPhase, LedgerStatus, LedgerTag, LedgerTrack, MASTER_GAP_LEDGER, RFC-003, byPhase (+12 more)

### Community 88 - "Documents Hook & Persistence"
Cohesion: 0.25
Nodes (16): actionReachCells(), ATTACK_COUNT_WORDS, averageDie(), buildMonsterCombatant(), dieFaces(), isMinusSign(), monsterAttackEffects(), monsterAttacksPerRound() (+8 more)

### Community 89 - "Daggerheart Contribution Ledger"
Cohesion: 0.08
Nodes (50): ANCESTRY_ADJUSTMENTS_BY_ID, ancestryByName, classByName, DAGGERHEART_TIER_BREAKPOINTS, DAGGERHEART_TRAITS, DaggerheartAncestryAdjustments, DaggerheartRange, DEFAULT_DAGGERHEART_ANCESTRY_ADJUSTMENTS (+42 more)

### Community 90 - "Dnd35e/Pf1e Derived Math"
Cohesion: 0.08
Nodes (33): ProficiencyListSection(), Props, D20FeatBrowserTabComponent, FeatBrowser, Props, BrowserFeat, Dnd5eFeatBrowserTabComponent, FeatBrowser (+25 more)

### Community 91 - "Mam Browser Tabs"
Cohesion: 0.04
Nodes (84): draftEncounterWithAi(), identifyCreatureWithAi(), fileToAiImageInput(), readAsDataUrl(), CR_XP_TABLE, formatChallengeRating(), MonsterBrowser(), MonsterBrowserProps (+76 more)

### Community 92 - "Pf2e Derived Math"
Cohesion: 0.19
Nodes (14): considerFile(), findings, isExampleEnv(), record(), root, rootConfigExt, rules, scanDirs (+6 more)

### Community 93 - "TypeDoc Config"
Cohesion: 0.07
Nodes (29): alphabetical, Class, Function, Interface, kind, ./src/types/core/character.ts, ./src/types/magic/spells.ts, ./src/types/mam/powers.ts (+21 more)

### Community 94 - "Pf2e Spell Data Encoder"
Cohesion: 0.20
Nodes (17): BLOODLINE_TRADITIONS, CLASS_TRADITIONS, CLASS_TRAITS, detag(), flattenEntries(), main(), mapCast(), mapDuration() (+9 more)

### Community 95 - "Sync Tombstones"
Cohesion: 0.13
Nodes (12): app, ccBy, checks, component, dpcgl, failures, license, notice (+4 more)

### Community 96 - "Skills Tab & Combat Math"
Cohesion: 0.11
Nodes (16): BUILT_IN_PROVIDERS, DEFAULT_PROVIDER_REGISTRY, GEMINI_REGISTRATION, MOCK_REGISTRATION, ProviderBuild, ProviderRegistration, ProviderRegistryEnv, AiProviderAdapter (+8 more)

### Community 97 - "Mam3e Derived Math"
Cohesion: 0.09
Nodes (30): react, IllustrateSceneResult, CombatPanelProps, EncounterPanel(), EncounterPanelProps, formatAverageLevel(), ILLUSTRATION_STYLES, IllustrationPanel() (+22 more)

### Community 98 - "Doc Drift Tests"
Cohesion: 0.18
Nodes (4): OUTCOME_DIR, RunFn, SystemOutcome, SYSTEMS

### Community 99 - "Spell Catalog Parity Tests"
Cohesion: 0.11
Nodes (5): DND35E_SOURCE_BLOCKED_SPELL_IDS, fieldCoverageBaselines, PF1E_SOURCE_ROWS_WITHOUT_SAVING_THROW, SpellModule, spellModules

### Community 100 - "Pf2e Spell Types & Traits"
Cohesion: 0.10
Nodes (25): CombatStatCard(), Props, Props, PresentedDerivedQuantity, ComputeLayer, DerivedDisplay, DerivedQuantityCase, DerivedQuantitySpec (+17 more)

### Community 101 - "Document Storage (IndexedDB)"
Cohesion: 0.23
Nodes (18): availableD20LegacyToggles(), D20LegacyData, D20LegacySpellSlots, getIterativeAttackBonuses(), recoverD20LegacySpellSlot(), resetD20LegacySpellSlots(), setD20LegacyPreparedSpell(), setD20LegacySpellSlotTotal() (+10 more)

### Community 102 - "5e Monster Encoder"
Cohesion: 0.22
Nodes (15): ABILITY_BY_INDEX, ALIGNMENTS, bucketFor(), CREATURE_TYPES, DAMAGE_TYPES, main(), mapAction(), mapAlignment() (+7 more)

### Community 103 - "Knip Lint Config"
Cohesion: 0.08
Nodes (26): entry, ignore, ignoreBinaries, ignoreDependencies, netlify/functions/*.mts, project, rules, classMembers (+18 more)

### Community 104 - "PF2e Monster Encoder"
Cohesion: 0.23
Nodes (14): ALIGNMENT_ABBREV, bucketFor(), CREATURE_TYPES, DAMAGE_TYPES, main(), mapAttack(), normalizeName(), parseDamage() (+6 more)

### Community 105 - "AI Creature Identification"
Cohesion: 0.09
Nodes (31): useCampaignSync(), useEntitySync(), baseAuthValue, mockedClearQueuedCampaignsSnapshot, mockedClearQueuedDeletedCampaignIds, mockedDeleteRemoteCampaign, mockedFetchRemoteCampaigns, mockedGetQueuedCampaignsSnapshot (+23 more)

### Community 106 - "Character Card Presenter"
Cohesion: 0.10
Nodes (19): SheetHeader(), Dnd5eAbilitiesTab(), Props, Dnd5eHeaderSection(), HeaderOption, Props, Dnd5eMonsterBrowserTabComponent, MonsterBrowser (+11 more)

### Community 107 - "Oracle Panel & Logic"
Cohesion: 0.38
Nodes (10): CharacterCard(), asNumber(), asRecord(), asString(), getClassLabel(), getDocumentLevelValue(), getHitPointLabel(), getLevelLabel() (+2 more)

### Community 108 - "5e Equipment Tab"
Cohesion: 0.43
Nodes (5): getEditableTarget(), KeyboardShortcut, useKeyboardNavigation(), Harness(), HarnessProps

### Community 109 - "Scene Reaction Panel"
Cohesion: 0.21
Nodes (15): compareSpells(), D20SpellsTab(), formatSpellLevel(), Props, titleCase(), D20_ARCANE_SCHOOLS, buildSpellPreparationConcepts(), compareSpellEntries() (+7 more)

### Community 110 - "Document Signature Hashing"
Cohesion: 0.49
Nodes (8): applyDnd5eLongRest(), applyDnd5eShortRest(), recoverAllSpellSlots(), recoverFeatures(), recoverLongRestHitDice(), recoverPactMagicSlots(), slotPool(), reset()

### Community 111 - "Resource Pool Tracking"
Cohesion: 0.46
Nodes (7): getBackgroundFixedToolProficiencies(), getBackgroundLanguageOptions(), getBackgroundToolChoiceSlots(), getDnd5eTemplateChoiceState(), getDnd5eSpeciesAbilityChoiceSlots(), getDnd5eSpeciesSkillChoiceSlots(), getDnd5eSpeciesToolChoiceSlots()

### Community 112 - "Bundle Size Check"
Cohesion: 0.10
Nodes (15): appChunk, appChunks, assetsDir, budgets, chunks, dataChunks, distDir, eagerChunkNames (+7 more)

### Community 113 - "AI Prompt Builders"
Cohesion: 0.19
Nodes (15): createGeminiAdapter(), IMAGE_TASKS, TASK_SCHEMAS, EncounterDraftPayload, IdentifyCreaturePayload, IllustrateScenePayload, SceneNarrationPayload, buildEncounterDraftPrompt() (+7 more)

### Community 115 - "Project Dependencies"
Cohesion: 0.09
Nodes (23): ai, @ai-sdk/google, class-variance-authority, clsx, lucide-react, dependencies, ai, @ai-sdk/google (+15 more)

### Community 116 - "3.5e Spell Encoder"
Cohesion: 0.11
Nodes (26): DISPOSITION_BADGE, DISPOSITION_LABEL, ReactionHistoryEntry, ReactionPanel(), ReactionPanelProps, AttackResolutionInput, GeneratedNpc, generateNpc() (+18 more)

### Community 117 - "AI Encounter Draft Flow"
Cohesion: 0.24
Nodes (8): CurrencyEditor(), CurrencyEntry, DND_CURRENCIES, Props, Pf2eInventoryTab(), Props, getPf2eBulkState(), sampleCurrency

### Community 118 - "Campaign File Transfer"
Cohesion: 0.10
Nodes (29): compute5eAC(), dnd5eArmorDexContribution(), Dnd5eTemplateState, AddEntryInput, buildAlwaysPreparedSpellEntries(), buildArmorClassEntries(), buildDnd5eContributionLedger(), buildFeatAutomationEntries() (+21 more)

### Community 119 - "MAM Archetype Browser"
Cohesion: 0.27
Nodes (11): CLASS_TOKENS, d20srdUrl(), FILES, main(), mapCastingTime(), mapDuration(), mapRange(), normalizeName() (+3 more)

### Community 120 - "PF1e Spell Encoder"
Cohesion: 0.27
Nodes (11): CLASS_COLUMNS, main(), mapCastingTime(), mapDuration(), mapRange(), RFC-4180, normalizeName(), parseCsv() (+3 more)

### Community 122 - "PF2e Archetypes Tab"
Cohesion: 0.05
Nodes (58): DND5E_SCENE_CONDITIONS, SCENE_CONDITIONS_BY_SYSTEM, sceneConditionOptions(), bestAttackAbility(), legacyD20Profile(), ArmorEquipItem, compileBaseArmorClassEffects(), computePf2eAC() (+50 more)

### Community 123 - "3.5e Gear & Weapons"
Cohesion: 0.25
Nodes (7): ArmorItem, DnD35eArmor, DnD35eShield, DnD35eGear, GearItem, DnD35eWeapon, WeaponItem

### Community 124 - "5e Equipment Encoder"
Cohesion: 0.36
Nodes (9): common(), DAMAGE_TYPES, main(), mapCost(), normalizeName(), parseDice(), RARITIES, ts() (+1 more)

### Community 125 - "5e Spell Encoder"
Cohesion: 0.33
Nodes (9): DAMAGE_TYPES, main(), mapCastingTime(), mapDuration(), mapRange(), normalizeName(), parseDice(), SCHOOLS (+1 more)

### Community 126 - "Daggerheart Adversary Encoder"
Cohesion: 0.36
Nodes (9): field(), main(), parseAdversary(), parseFeats(), RANGES, ROLES, slug(), srcFlag (+1 more)

### Community 127 - "Service Worker Update Banner"
Cohesion: 0.50
Nodes (3): MANUAL_EXCLUSIONS, ManualExclusion, ManifestSystemId

### Community 128 - "Toast Notifications"
Cohesion: 0.15
Nodes (16): DND5E_DERIVED_QUANTITIES, dnd5eCarryingCapacity(), dnd5eHighJump(), dnd5eLongJump(), dnd5ePushDragLift(), countSelections(), Dnd5eLikeDataModel, Dnd5eSheetMutators (+8 more)

### Community 130 - "d20LegacySpellcasting.ts"
Cohesion: 0.06
Nodes (32): ALLEGIANCE_LABEL, ALLEGIANCE_TOKEN_CLASS, buildTokenLabel(), buildTokensByCell(), SceneGridView, SceneGridViewProps, SceneCombatStats, buildDaggerheartAdversaryCombatant() (+24 more)

### Community 131 - "Retry With Backoff"
Cohesion: 0.08
Nodes (47): Doc, useSync(), UseSyncOptions, baseAuthValue, mockedClearQueuedDeletedDocumentIds, mockedClearQueuedSyncSnapshot, mockedDeleteRemoteDocument, mockedFetchRemoteDocuments (+39 more)

### Community 132 - "2024 Spell Encoder"
Cohesion: 0.39
Nodes (8): main(), mapCastingTime(), mapDuration(), mapRange(), normalizeName(), SCHOOLS, slug(), ts()

### Community 133 - "MAM Power Browser"
Cohesion: 0.10
Nodes (17): CombatTogglesSection(), Props, Condition, ConditionPicker(), Props, FeaturesSection(), Props, D20_LEGACY_CONDITION_NAMES (+9 more)

### Community 134 - "Spell Validation Checks"
Cohesion: 0.28
Nodes (7): collectRawSpells(), getRawSpellById(), getVariantFingerprint(), SpellModule, spellModules, stableFingerprintValue(), VALID_SCHOOLS

### Community 136 - "TS Node Config"
Cohesion: 0.20
Nodes (9): vite.config.ts, compilerOptions, allowSyntheticDefaultImports, composite, forceConsistentCasingInFileNames, module, moduleResolution, skipLibCheck (+1 more)

### Community 137 - "TS Test Config"
Cohesion: 0.10
Nodes (20): e2e/**/*, playwright.config.ts, vitest.config.ts, compilerOptions, lib, noEmit, types, exclude (+12 more)

### Community 138 - "System Smoke Tests"
Cohesion: 0.28
Nodes (3): createCharacterForSystem(), getCharacterNameInput(), renameCharacter()

### Community 139 - "Prettier Config"
Cohesion: 0.25
Nodes (7): arrowParens, endOfLine, printWidth, semi, singleQuote, tabWidth, trailingComma

### Community 140 - "pf2eConditions.ts"
Cohesion: 0.43
Nodes (6): DeferredInstallPromptEvent, isStandaloneMode(), readDismissedState(), usePwaInstallPrompt(), UsePwaInstallPromptOptions, writeDismissedState()

### Community 141 - "pf2eSpellTraits.test.ts"
Cohesion: 0.17
Nodes (11): validateDnd35eBuild(), ABILITY_KEYS, validateDnd5eBuild(), validatePf1eBuild(), BuildLegalityResult, BuildViolation, Dnd35eClassLevel, doc() (+3 more)

### Community 142 - "TS Base Config"
Cohesion: 0.10
Nodes (19): ./components/GameSystemSelector.test.tsx, ./components/SystemStatusDashboard.test.tsx, ./setup.ts, ../vite-env.d.ts, ../vitest.d.ts, compilerOptions, lib, noEmit (+11 more)

### Community 143 - "MAM Equipment Types"
Cohesion: 0.36
Nodes (7): Device, Headquarters, HeadquartersSize, MaMEquipment, MaMEquipmentType, Vehicle, VehicleSize

### Community 144 - "Package Manifest"
Cohesion: 0.29
Nodes (6): engines, node, name, private, type, version

### Community 145 - "Verification Baseline Script"
Cohesion: 0.29
Nodes (4): args, baselinePath, currentBaseline, nextBaseline

### Community 148 - "TS Netlify Config"
Cohesion: 0.20
Nodes (9): compilerOptions, allowImportingTsExtensions, noEmit, types, extends, include, netlify/functions/**/*.mts, node (+1 more)

### Community 149 - "Generated Docs Check"
Cohesion: 0.33
Nodes (4): beforeState, changedFiles, generatedFiles, projectRoot

### Community 150 - "Playwright Browser Check"
Cohesion: 0.53
Nodes (5): assertPlaywrightBrowsersInstalled(), formatMissingPlaywrightBrowsersMessage(), getPlaywrightExecutableReport(), main(), REQUIRED_PLAYWRIGHT_EXECUTABLES

### Community 151 - "Repo Hygiene Check"
Cohesion: 0.33
Nodes (5): filesToScan, placeholderHits, projectRoot, trackedArtifactHits, trackedArtifacts

### Community 152 - "Equipment Browser Component"
Cohesion: 0.40
Nodes (4): Equipment, EquipmentBrowser(), EquipmentBrowserProps, equipment

### Community 153 - "ServiceWorkerUpdateBanner.tsx"
Cohesion: 0.09
Nodes (29): AppContent(), buildNewCharacterDocument(), cloneSystemData(), LegalNotices, SceneManager, STORAGE_WARNING_THRESHOLD, CampaignManager(), CharacterSortOption (+21 more)

### Community 154 - "Dnd5eEquipmentTab.tsx"
Cohesion: 0.14
Nodes (13): CurrencyEditor, CurrencyEditorProps, Dnd5eEquipmentTabComponent, EquipmentBrowser, EquipmentBrowserItem, EquipmentBrowserProps, EquippedItemsSection, EquippedItemsSectionProps (+5 more)

### Community 155 - "5e Movement Rules"
Cohesion: 0.22
Nodes (15): EntitySyncAdapter, UseEntitySyncOptions, NOW, RemoteFetchResult, getSyncTombstonedIds(), getSyncTombstones(), pruneExpired(), readStored() (+7 more)

### Community 160 - "MamArchetypesTab.tsx"
Cohesion: 0.14
Nodes (17): MamArchetypeBrowser(), MamArchetypeBrowserProps, MamConditionsTab(), Props, Mam3eConditionTrack, applyMam3eToughnessFailure(), getMam3eSheetState(), GetMam3eSheetStateProps (+9 more)

### Community 161 - "PF2e Backgrounds Data"
Cohesion: 0.50
Nodes (3): Pf2eBackgroundChoice, Pf2eBackgroundDefinition, Pf2eBackgroundFeatGrant

### Community 181 - "useEntitySync.ts"
Cohesion: 0.18
Nodes (14): MockBeforeInstallPromptEvent, mockedGetQueuedCampaignsSnapshot, mockedGetQueuedDeletedCampaignIds, mockedGetQueuedDeletedDocumentIds, mockedGetQueuedSyncSnapshot, combineSyncStates(), formatDateAndTime(), formatLastSyncedAt() (+6 more)

### Community 182 - "syncTombstones.ts"
Cohesion: 0.10
Nodes (27): effectToLedgerEntry(), toContributionLedger(), toLedgerOperation(), toLedgerValue(), ActionDescriptor, ConditionDescriptor, EffectOperation, EffectSource (+19 more)

### Community 183 - "loadEquipmentForSystem"
Cohesion: 0.50
Nodes (3): Answer, Outcome, Q: where are pending debounced document saves flushed to localStorage on page hide or unload (persistence flush)

### Community 184 - "MamArchetypesTab.tsx"
Cohesion: 0.28
Nodes (7): SYSTEM_IDS, getSystemAssetPrefetchStateForTests(), prefetchedSystemAssets, prefetchedSystemRuntimeData, prefetchedSystemSheets, resetSystemAssetPrefetchStateForTests(), systemAssetPrefetchers

### Community 186 - "eslint-plugin-react"
Cohesion: 0.40
Nodes (4): Feat, FeatBrowser(), FeatBrowserProps, feats

### Community 190 - "index.ts"
Cohesion: 0.36
Nodes (5): BLOCKING_IMPACTS, createCharacterForSystem(), expectNoBlockingViolations(), getCharacterNameInput(), KNOWN_A11Y_DEBT

### Community 191 - "retryWithBackoff"
Cohesion: 0.36
Nodes (8): computeBackoffMs(), isRetryableError(), NON_RETRYABLE_FRAGMENTS, PROD_DEFAULTS, RetryOptions, retryWithBackoff(), sleep(), TEST_DEFAULTS

### Community 192 - "daggerheart-engine.test.ts"
Cohesion: 0.39
Nodes (4): ServiceWorkerUpdateBanner(), isServiceWorkerSupported(), ServiceWorkerUpdateState, useServiceWorkerUpdate()

### Community 194 - "@types/react-dom"
Cohesion: 0.06
Nodes (27): CharacterListView(), SystemRegistry, SheetProps, SystemCreatorComponent, SystemCreatorProps, SystemDefinition, SystemValidator, ValidationContext (+19 more)

## Knowledge Gaps
- **1245 isolated node(s):** `browser`, `es2021`, `node`, `eslint:recommended`, `plugin:@typescript-eslint/recommended` (+1240 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **19 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `CharacterDocument` connect `System Registry & Renderer` to `Toast Notifications`, `d20LegacySpellcasting.ts`, `Retry With Backoff`, `Dnd5e2024 Engine & Hit Dice`, `Daggerheart Engine`, `Dnd5e Background Templates`, `Tabs UI Component`, `Scene Combat Resolution`, `Dnd5e Class Templates`, `Dnd5e Activity Definitions`, `pf2eSpellTraits.test.ts`, `Dnd5e Feat Templates`, `App Shell & Layout`, `D20 Combat Controls`, `Game System Selector`, `Combat & Recap Panels`, `D20 Legacy System Engines`, `Dnd35e Saves & Data Model`, `Daggerheart Data Model`, `ServiceWorkerUpdateBanner.tsx`, `Daggerheart Inventory`, `Pf2e Character Templates`, `Dnd5e Feature List Sections`, `Encounter & Initiative Panels`, `Class Enhancement & Headers`, `MamArchetypesTab.tsx`, `Pf2e Sheet Tabs`, `Quest & Session Log UI`, `Document Sync Engine`, `Sheet Header & Stat Cards`, `Check & Oracle Resolution`, `Mam3e Data Model & Engine`, `Condition Effects by System`, `Encounter Builder Logic`, `Campaign Storage & Hooks`, `Character Combatant Builder`, `D20 Class Spellcasting`, `SRD Manifest Generator`, `D20 Legacy Spell Slots`, `@types/react-dom`, `Character Effects Compilation`, `System Validation Logic`, `Dnd5e Resource Loading Hooks`, `Mam Powers & Cost Ledger`, `Sync Engine Tests`, `Document Migrations & Storage`, `Boundary Validation Tests`, `Daggerheart Contribution Ledger`, `Mam Browser Tabs`, `Mam3e Derived Math`, `Document Storage (IndexedDB)`, `Character Card Presenter`, `Oracle Panel & Logic`, `AI Encounter Draft Flow`, `Campaign File Transfer`, `PF2e Archetypes Tab`?**
  _High betweenness centrality (0.138) - this node is a cross-community bridge._
- **Why does `react` connect `Mam3e Derived Math` to `Sheet Resource Loading Hooks`, `Dnd5e Sheets & E2E Tests`, `Dnd5e Equipment & Features UI`, `d20LegacySpellcasting.ts`, `Retry With Backoff`, `MAM Power Browser`, `Toast Notifications`, `Tabs UI Component`, `Daggerheart Engine`, `Scene Combat Resolution`, `Dnd5e Class Templates`, `pf2eConditions.ts`, `Monster & NPC Generator`, `Dnd5e Feat Templates`, `D20 Combat Controls`, `Combat & Recap Panels`, `Dnd35e Saves & Data Model`, `Daggerheart Data Model`, `System Registry & Renderer`, `Equipment Browser Component`, `ServiceWorkerUpdateBanner.tsx`, `Dnd5eEquipmentTab.tsx`, `5e Movement Rules`, `Pf2e Character Templates`, `Dnd5e Feature List Sections`, `Class Enhancement & Headers`, `MamArchetypesTab.tsx`, `AI Encounter Drafting`, `Quest & Session Log UI`, `Pf2e Sheet Tabs`, `Mam3e Data Model & Engine`, `Condition Effects by System`, `Equipped Armor Section`, `Spell Browser UI`, `Error Boundary & Auth Context`, `Encounter Builder Logic`, `Monster Combatant Builder`, `D20 Legacy Templates`, `Campaign Storage & Hooks`, `Character Combatant Builder`, `D20 Class Spellcasting`, `Daggerheart Combatant Builders`, `eslint-plugin-react`, `D20 Legacy Spell Slots`, `MamComplicationBrowser.tsx`, `ESLint Config`, `daggerheart-engine.test.ts`, `Browser Compat & Error Logging`, `AI Gateway Client`, `@types/react-dom`, `Character Effects Compilation`, `Spells Tab Components`, `Dnd5e Resource Loading Hooks`, `Mam Powers & Cost Ledger`, `Sync Engine Tests`, `Dnd5e Feature Options`, `Document Migrations & Storage`, `App Header & Auth UI`, `Combat Toggles & Conditions`, `capabilityScenarios.test.tsx`, `Dnd35e/Pf1e Derived Math`, `Mam Browser Tabs`, `Pf2e Spell Types & Traits`, `Document Storage (IndexedDB)`, `AI Creature Identification`, `Character Card Presenter`, `5e Equipment Tab`, `Scene Reaction Panel`, `3.5e Spell Encoder`, `AI Encounter Draft Flow`?**
  _High betweenness centrality (0.125) - this node is a cross-community bridge._
- **Why does `GameSystemId` connect `Class Enhancement & Headers` to `Sheet Resource Loading Hooks`, `Dnd5e Sheets & E2E Tests`, `Dnd5e2024 Engine & Hit Dice`, `Tabs UI Component`, `Scene Combat Resolution`, `Dnd5e Feat Templates`, `D20 Combat Controls`, `Game System Selector`, `System Registry & Renderer`, `ServiceWorkerUpdateBanner.tsx`, `Roadmap Metrics Generator`, `MamArchetypesTab.tsx`, `Sheet Header & Stat Cards`, `Doc Drift Rules`, `Condition Effects by System`, `Encounter Builder Logic`, `syncTombstones.ts`, `Character Combatant Builder`, `MamArchetypesTab.tsx`, `Daggerheart Combatant Builders`, `SRD Coverage Script`, `Browser Compat & Error Logging`, `Dnd5e Resource Loading Hooks`, `Mam Powers & Cost Ledger`, `Sync Engine Tests`, `Dnd35e/Pf1e Derived Math`, `Mam Browser Tabs`, `Mam3e Derived Math`, `Document Storage (IndexedDB)`, `PF2e Archetypes Tab`?**
  _High betweenness centrality (0.054) - this node is a cross-community bridge._
- **What connects `browser`, `es2021`, `node` to the rest of the system?**
  _1245 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Sheet Resource Loading Hooks` be split into smaller, more focused modules?**
  _Cohesion score 0.0599250936329588 - nodes in this community are weakly interconnected._
- **Should `Dnd5e Sheets & E2E Tests` be split into smaller, more focused modules?**
  _Cohesion score 0.09351432880844646 - nodes in this community are weakly interconnected._
- **Should `Dnd5e Equipment & Features UI` be split into smaller, more focused modules?**
  _Cohesion score 0.11965811965811966 - nodes in this community are weakly interconnected._