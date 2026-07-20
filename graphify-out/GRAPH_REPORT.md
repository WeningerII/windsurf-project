# Graph Report - windsurf-project  (2026-07-20)

## Corpus Check
- 786 files · ~538,931 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 4885 nodes · 13887 edges · 204 communities (185 shown, 19 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 115 edges (avg confidence: 0.71)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `bcacdf3a`
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
- usePwaInstallPrompt.ts
- daggerheartSheetShared.tsx
- MamArchetypesTab.tsx
- PF2e Backgrounds Data
- Host Size Budget Test
- Vitest Type Defs
- MAM Complications Data
- MAM Power Modifiers Data
- Vitest Coverage Config
- gatewayClient.ts
- featTemplate.test.ts
- MamPowerBrowserTab.tsx
- useEntitySync.ts
- syncTombstones.ts
- loadEquipmentForSystem
- MamArchetypesTab.tsx
- eslint-plugin-react
- fake-indexeddb
- knip
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
- @types/react-dom

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

## Communities (204 total, 19 thin omitted)

### Community 0 - "Sheet Resource Loading Hooks"
Cohesion: 0.11
Nodes (44): useDaggerheartSheetResources(), finalizeLoadedItems(), loadClassesForSystem(), loadDaggerheartAdversariesForSystem(), loadDaggerheartAncestries(), loadDaggerheartAncestriesForSystem(), loadDaggerheartArmor(), loadDaggerheartArmorForSystem() (+36 more)

### Community 1 - "Dnd5e Sheets & E2E Tests"
Cohesion: 0.08
Nodes (39): categoryIcons, GameSystemSelector(), GameSystemSelectorProps, systemAccents, NewCharacterDialog(), Props, supportBadgeLabels, supportBadgeStyles (+31 more)

### Community 2 - "Dnd5e Equipment & Features UI"
Cohesion: 0.12
Nodes (19): clampTrack(), DeathSaves, DeathSavesTracker(), Props, HitDiceTracker(), Props, Props, SLOT_LEVELS (+11 more)

### Community 3 - "Dnd5e Background Templates"
Cohesion: 0.10
Nodes (37): ABILITY_NAME_TO_ID, ABILITY_OPTIONS, abilityAutomationFromSelections(), aggregateFeatAutomation(), applyDnd5eFeatTemplate(), applyFeatSkillSources(), buildAutomatedFeat(), ChoiceCategory (+29 more)

### Community 4 - "Dnd5e2024 Engine & Hit Dice"
Cohesion: 0.07
Nodes (30): HIT_DICE, hitDieSize(), hitDieString(), D20Roll, Dnd5e2024Engine, hasAlertFeat(), totalCharacterLevel(), DND5E_CONDITION_NAMES (+22 more)

### Community 5 - "Daggerheart Engine"
Cohesion: 0.08
Nodes (50): applyDnd5eClassTemplate(), applyDnd5eSubclassTemplate(), assertMulticlassRequirements(), ATTRIBUTE_NAME_TO_ID, buildChoiceSlots(), buildDerivedProficiencies(), buildSpellcastingState(), canSelectSubclass() (+42 more)

### Community 6 - "3.5e Monster Data Encoder"
Cohesion: 0.09
Nodes (35): ALIGNMENTS, DICE_PROGRESSIONS, main(), mapAlignment(), mod(), MONSTER_SIZE, normalizeName(), OLIMOT_FILES (+27 more)

### Community 7 - "Tabs UI Component"
Cohesion: 0.06
Nodes (55): Badge(), BadgeProps, badgeVariants, Tabs, TabsContent, TabsContentProps, TabsContext, TabsContextValue (+47 more)

### Community 8 - "Node Runtime Bootstrap"
Cohesion: 0.09
Nodes (49): main(), runBootstrapNodeInstall(), getPinnedCommandArgs(), main(), runPinnedNpmCommand(), formatRuntimeDoctorReport(), main(), readWorkflowPinSource() (+41 more)

### Community 9 - "Scene Combat Resolution"
Cohesion: 0.06
Nodes (45): ResolveCombatStats, SceneCombatStats, appendSceneEvent(), applySceneIntents(), createSceneDocument(), foldSceneEvents(), resolveSceneAction(), SceneActionOptions (+37 more)

### Community 10 - "Dnd5e Class Templates"
Cohesion: 0.09
Nodes (37): MamPowersTab(), ModifierColumn(), ModifierColumnProps, Props, buildMam3eContributionLedger(), buildMam3ePowerCostLedgerEntries(), createPowerCostEntry(), ledgerId() (+29 more)

### Community 11 - "System Compute Registers"
Cohesion: 0.17
Nodes (15): daggerheartComputeRegister, dnd35eComputeRegister, dnd5e2014ComputeRegister, dnd5e2024ComputeRegister, COMPUTE_REGISTERS, registerForSystem(), mam3eComputeRegister, pf1eComputeRegister (+7 more)

### Community 12 - "Scene Check Panel"
Cohesion: 0.18
Nodes (12): BrowserCapabilities, checkBrowserCapabilities(), initBrowserCompat(), isBrowserSupported(), showCompatibilityWarning(), ErrorCategory, ErrorLog, ErrorLogger (+4 more)

### Community 13 - "Dnd5e Activity Definitions"
Cohesion: 0.09
Nodes (27): buildDefenseStyleActivity(), buildDivineSmiteActivities(), buildDivineSmiteActivity(), buildDnd5eActivityDefinitions(), buildUnsupportedDivineSmiteActivity(), divineSmiteSlotLevel(), Dnd5eActivityCost, Dnd5eActivityCostKind (+19 more)

### Community 14 - "Monster & NPC Generator"
Cohesion: 0.07
Nodes (43): FEATURE_FLAGS, FeatureFlag, FeatureFlagDefinition, isFeatureEnabled(), RingBuffer, ALLOWED_ENUM_VALUES, SanitizedProps, TelemetryEnumValue (+35 more)

### Community 15 - "Dnd5e Feat Templates"
Cohesion: 0.18
Nodes (15): AddEntryInput, buildBaseAttackBonusEntries(), buildD20LegacyContributionLedger(), buildSaveEntries(), buildSkillSynergyEntries(), createEntry(), D20LegacyClassLevelView, D20LegacySystemId (+7 more)

### Community 16 - "App Shell & Layout"
Cohesion: 0.25
Nodes (11): Mode, SignIn(), SignInProps, UserMenu(), UserMenuProps, useAuth(), EntitySyncAdapter, SyncState (+3 more)

### Community 17 - "D20 Combat Controls"
Cohesion: 0.10
Nodes (30): casterTypes, classResourcesNeeded, classTags, getEligibleDnd5eFeatureOptions(), featureOptionSelectionKey(), ABILITY_TOKEN_MAP, collectAlwaysPreparedByLevelSources(), collectAlwaysPreparedGrantSources() (+22 more)

### Community 18 - "Game System Selector"
Cohesion: 0.08
Nodes (19): validateDnd5eBuild(), createDefaultDnd5eData(), Dnd5eEngine, Dnd5eDocument, makeDnd5eDocument(), makeDoc(), makeDoc(), doc() (+11 more)

### Community 19 - "Combat & Recap Panels"
Cohesion: 0.17
Nodes (17): AppHeader(), AppHeaderProps, assertNever(), INITIAL_NAV_STATE, LIBRARY_SEGMENTS, LibrarySegment, librarySegmentLabel(), NavAction (+9 more)

### Community 20 - "D20 Legacy System Engines"
Cohesion: 0.14
Nodes (19): ProficiencyListSection(), Props, Dnd5eFeatureOptionsSection(), Dnd5eFeatureOptionsSectionComponent, FeatureOptionBrowser, FeatureOptionBrowserProps, featureOptionSelectionKey(), Props (+11 more)

### Community 21 - "Dnd35e Saves & Data Model"
Cohesion: 0.07
Nodes (25): validatePf1eBuild(), Dnd35eEngine, createDefaultPf1eData(), Pf1eClassLevel, Pf1eFeat, Pf1eManualSpellcastingExtras, Pf1eSaves, RFC-003 (+17 more)

### Community 22 - "Daggerheart Data Model"
Cohesion: 0.07
Nodes (35): computePf2eAC(), getPf2eConditionStatusPenalty(), validatePf2eBuild(), Props, SAVE_ABILITIES, SKILL_ABILITIES, createDefaultPf2eData(), PF2E_ARCHETYPE_DEDICATION_GRANTS (+27 more)

### Community 23 - "System Registry & Renderer"
Cohesion: 0.06
Nodes (43): Props, CharacterCardProps, CharacterListViewProps, UseSceneEncounterParams, Props, Props, SystemSheetRenderer(), SystemEngine (+35 more)

### Community 24 - "Game Rules & Proficiencies"
Cohesion: 0.07
Nodes (33): GAME_RULES, ArmorProficiency, ArmorProficiencyType, GamingSetProficiency, isValidArmorProficiency(), isValidSkillProficiency(), isValidToolProficiency(), isValidWeaponProficiency() (+25 more)

### Community 25 - "Campaign Sync Hooks"
Cohesion: 0.10
Nodes (42): resolveCheck(), BuildEncounterEventsResult, cellKey(), footprintCells(), footprintWithinGrid(), isOracleAnswer(), isOracleOdds(), resolveOracle() (+34 more)

### Community 26 - "Daggerheart Inventory"
Cohesion: 0.08
Nodes (38): clampDaggerheartInventoryQuantity(), daggerheartInventoryDefinitions, findDaggerheartInventoryDefinitionByName(), getDaggerheartInventoryDefinition(), inventoryDefinitionById, inventoryDefinitionByName, isDaggerheartConsumableDefinition(), normalizeDaggerheartCurrency() (+30 more)

### Community 27 - "Pf2e Character Templates"
Cohesion: 0.12
Nodes (39): abilityBoostValue(), ancestryFeatures(), applyAbilityAdjustments(), applyPf2eAncestryTemplate(), applyPf2eArchetypeTemplate(), applyPf2eBackgroundTemplate(), applyPf2eClassTemplate(), archetypeSource() (+31 more)

### Community 28 - "Roadmap Metrics Generator"
Cohesion: 0.09
Nodes (38): applyRepoResidentOverrides(), buildComputeCompletion(), buildContentCompletion(), buildMarkdownReport(), ComputeCompletionRow, computeMetrics(), ContentCompletionRow, createEmptyCategoryCounts() (+30 more)

### Community 29 - "Dnd5e Feature List Sections"
Cohesion: 0.08
Nodes (42): react, DamageHealControl(), DamageHealControlProps, DiceRollButton(), DiceRollButtonProps, RollResult, SheetProps, SystemCreatorComponent (+34 more)

### Community 30 - "Encounter & Initiative Panels"
Cohesion: 0.08
Nodes (39): ArtisanToolProficiency, MusicalInstrumentProficiency, appendInventoryFromBackground(), applyDnd5eBackgroundTemplate(), BackgroundChoiceSlot, BackgroundChoiceValue, backgroundDerivedState(), COMMON_LANGUAGE_OPTIONS (+31 more)

### Community 31 - "Class Enhancement & Headers"
Cohesion: 0.13
Nodes (21): UseD20LegacySheetResourcesProps, UseDaggerheartSheetResourcesProps, Dnd5eEquipmentTab, Dnd5eFeaturesTab, Dnd5eMonsterBrowserTab, Dnd5eSpellsTab, useDnd5eDeferredResource(), UseDnd5eDeferredResourceOptions (+13 more)

### Community 32 - "Pf2e Sheet Tabs"
Cohesion: 0.08
Nodes (34): buildCharacterCombatant(), BuildCharacterCombatantResult, normalizeSheet(), readArmorClass(), toMagicBonusItems(), toModifierSources(), AttackEconomy, bestAttackAbility() (+26 more)

### Community 33 - "AI Encounter Drafting"
Cohesion: 0.15
Nodes (19): DIFFICULTY_COLUMN, DND35E_EL_VALUE, dnd35eCreatureValue(), dnd35eEncounterBudget(), draftEncounter(), ENCOUNTER_BUDGET_SYSTEMS, EncounterBudgetSystem, encounterPartyBudget() (+11 more)

### Community 34 - "Quest & Session Log UI"
Cohesion: 0.12
Nodes (32): Props, QuestList(), STATUS_BADGE, STATUS_OPTIONS, DATE_FORMAT, Props, SessionLog(), Props (+24 more)

### Community 35 - "Currency & Inventory Editors"
Cohesion: 0.24
Nodes (10): ManifestCategory, buildSystem(), CATEGORY_LOADERS, CategoryLoader, escape(), isRecord(), Loaded, main() (+2 more)

### Community 36 - "Document Sync Engine"
Cohesion: 0.05
Nodes (94): critModelForScene(), degreeModelForScene(), resolveSceneAreaEffect(), resolveSceneAttack(), SceneAreaEffectOutcome, SceneAttackOutcome, SceneRoundOutcome, RFC-003 (+86 more)

### Community 37 - "Sheet Header & Stat Cards"
Cohesion: 0.07
Nodes (43): CharacterEffectInputs, ResolvedCharacterEffects, ArmorEquipItem, compileBaseArmorClassEffects(), compute5eAC(), dnd5eArmorDexContribution(), compileEquipmentEffects(), equipStackPolicy() (+35 more)

### Community 38 - "Check & Oracle Resolution"
Cohesion: 0.11
Nodes (23): resolveCharacterEffects(), computeD20LegacyAC(), D20_SIZE_MOD, d20LegacyCheckPenalty(), applyDerivedQuantities(), DualityRoll, rollD20(), createLiveRng() (+15 more)

### Community 39 - "Mam3e Data Model & Engine"
Cohesion: 0.09
Nodes (29): dnd35eAbilityIncreases(), dnd35eConcentrationDCDamage(), dnd35eConcentrationDCDefensive(), dnd35eFeatsFromLevel(), dnd35eHpState, dnd35eLevelForXp(), dnd35eTriggersMassiveDamage(), dnd35eXpForLevel() (+21 more)

### Community 40 - "Doc Drift Rules"
Cohesion: 0.06
Nodes (58): DOC_DRIFT_MANIFEST, DocDriftRuleType, DocDriftSurface, DocDriftSurfaceKind, CAPABILITY_PHRASE_RULES, CapabilityPhraseRule, capitalizeSupportLevel(), COMMAND_RUNTIME_RULES (+50 more)

### Community 41 - "NPM Build Scripts"
Cohesion: 0.04
Nodes (45): scripts, bootstrap:node, build, check:bundle-size, check:compute-register, check:compute-register:mutate, check:compute-register:write, check:dead-code (+37 more)

### Community 42 - "Condition Effects by System"
Cohesion: 0.10
Nodes (43): EquippedItemsSection(), Props, SLOT_LABELS, SLOT_ORDER, FeaturesSection(), Props, NormalizedSheet, createDefaultDnd5e2024Data() (+35 more)

### Community 43 - "Equipped Armor Section"
Cohesion: 0.08
Nodes (34): EquipArmorInput, EquipEntry, EquippedArmorSection(), EquipShieldInput, Props, D20EquipmentBrowserTabComponent, EquipmentBrowser, Props (+26 more)

### Community 44 - "Spell Browser UI"
Cohesion: 0.33
Nodes (11): SpellBrowserSpell, D20SpellBrowserPanelComponent, SpellBrowser, toSpellBrowserSpell(), Pf2eSpellBrowserPanelComponent, SpellBrowser, toSpellBrowserSpell(), formatAreaOfEffect() (+3 more)

### Community 45 - "Scene Combat Area Effects"
Cohesion: 0.17
Nodes (15): buildNotice(), FetchTarget, fetchValidated(), HTML_ENTITIES, looksLikeHtml(), main(), normalize(), noticePath (+7 more)

### Community 46 - "Error Boundary & Auth Context"
Cohesion: 0.13
Nodes (13): AuthContext, getLastSyncedUserId(), setLastSyncedUserId(), AuthProvider(), AuthCallback, mockedGetSupabaseClient, mockedIsSupabaseConfigured, Probe() (+5 more)

### Community 47 - "Encounter Builder Logic"
Cohesion: 0.14
Nodes (30): applyAbilityAdjustments(), applyD20LegacyClassTemplate(), applyD20LegacyRaceTemplate(), buildClassSkills(), classFeaturesUpToLevel(), classSkillOptions(), collectClassFeatureSignatures(), create35eClassLevel() (+22 more)

### Community 48 - "Scene Management Hooks"
Cohesion: 0.24
Nodes (18): useScenes(), NOW, clearSceneStorage(), collectValidScenes(), deleteScene(), hydrateScene(), hydrateSceneEvent(), importScenes() (+10 more)

### Community 49 - "Monster Combatant Builder"
Cohesion: 0.04
Nodes (89): NarrateSceneResult, CheckPanel(), CheckPanelProps, DEFAULT_SUGGESTIONS, DND5E_SKILLS, OUTCOME_BADGE, OUTCOME_LABEL, SKILL_SUGGESTIONS_BY_SYSTEM (+81 more)

### Community 50 - "D20 Legacy Templates"
Cohesion: 0.12
Nodes (44): getDaggerheartShortRestRecovery(), createDaggerheartInventoryEntry(), clearAllStress(), clearStress(), prepareGainHope(), repairAllArmor(), repairArmor(), tendToAllWounds() (+36 more)

### Community 51 - "Campaign Storage & Hooks"
Cohesion: 0.16
Nodes (19): useCampaigns(), DebouncedPersistence, IMPORTANT: a begun generation must end in either `persist` or, useDebouncedPersistence(), hostileStorage, CAMPAIGNS_STORAGE_KEY, clearCampaignStorage(), importCampaigns() (+11 more)

### Community 52 - "Spell Preparation Logic"
Cohesion: 0.17
Nodes (11): boonOfSkill, crafter, fixtureBenefits, keen_mind, linguist, makeDoc(), moderately_armored, musician (+3 more)

### Community 53 - "Dev Dependencies"
Cohesion: 0.05
Nodes (41): autoprefixer, @axe-core/playwright, eslint, eslint-config-prettier, eslint-plugin-react, eslint-plugin-react-refresh, happy-dom, devDependencies (+33 more)

### Community 54 - "Character Combatant Builder"
Cohesion: 0.11
Nodes (26): UseDnd5eTemplateHandlersProps, Props, Pf2eArchetypesTab(), Props, Pf2eHeader(), Props, Pf2eNotesTab(), Props (+18 more)

### Community 55 - "D20 Class Spellcasting"
Cohesion: 0.08
Nodes (42): mam3eToughnessPenalty(), MamComplicationBrowser, MamComplicationsTabComponent, Props, ABILITIES, DEFENSES, Mam3eCreator(), Mam3eCreatorProps (+34 more)

### Community 56 - "SRD Manifest Generator"
Cohesion: 0.09
Nodes (42): getBackgroundFixedToolProficiencies(), getBackgroundLanguageOptions(), getBackgroundToolChoiceSlots(), ChoiceSlot, Dnd5eSpeciesSection(), Props, getDnd5eTemplateChoiceState(), applyDnd5eSpeciesTemplate() (+34 more)

### Community 57 - "Daggerheart Combatant Builders"
Cohesion: 0.10
Nodes (28): D20ClassesSection(), D20LegacyClassLevel, Props, renderClassOptions(), d20BonusSpells(), buildD20LegacySpellSlotTotals(), countAdvancementLevels(), D20_DOMAIN_CLASS_IDS (+20 more)

### Community 58 - "AI Gateway Adapters"
Cohesion: 0.17
Nodes (21): aiFailure, AiFailureCode, AiResponse, AiTask, GatewayContext, GatewayTimeoutError, handleAiRequest(), repairCountOf() (+13 more)

### Community 59 - "AI Gateway Contracts"
Cohesion: 0.13
Nodes (27): AI_GATEWAY_SCHEMA_VERSION, AiParse, AiSuccess, AiUsage, EncounterDraftRequest, IdentifyCreatureRequest, IllustrateSceneRequest, isAiResponse() (+19 more)

### Community 60 - "System Definitions & Types"
Cohesion: 0.11
Nodes (16): AI_GATEWAY_ENDPOINT, AiRequest, GeneratedImageData, SceneNarrationData, callAiGateway(), isAiEnabled(), IllustrateGatewayCall, IllustrateSceneParams (+8 more)

### Community 61 - "D20 Legacy Spell Slots"
Cohesion: 0.12
Nodes (16): presentDerivedQuantities(), ABILITIES, DEFENSES, MamAbilitiesTab(), Props, MamConditionsTab(), Props, MamHeader() (+8 more)

### Community 62 - "SRD Coverage Script"
Cohesion: 0.10
Nodes (34): cats5e2014, cats5e2024, CoverageTarget, csvRows(), extractJsArray(), extractNameValues(), fetchCsvNames(), fetchJsArrayNames() (+26 more)

### Community 63 - "ESLint Config"
Cohesion: 0.05
Nodes (39): jsx, env, browser, es2021, node, extends, ignorePatterns, overrides (+31 more)

### Community 64 - "Spells Tab Components"
Cohesion: 0.12
Nodes (18): Props, Props, Props, focusPulseSpell, PF2E_DERIVED_TRAITS, PF2E_SCHOOL_TRAITS, PF2E_TRADITIONS, AreaOfEffect (+10 more)

### Community 65 - "Browser Compat & Error Logging"
Cohesion: 0.10
Nodes (23): RFC-004, ErrorBoundary, Props, State, LegalNotices(), LegalNoticesProps, licenseTexts, LibraryBestiaryView() (+15 more)

### Community 66 - "AI Gateway Client"
Cohesion: 0.18
Nodes (17): AbilityScoreGrid(), buildPointBuyDraft(), buildStandardArrayDraft(), clampPointBuyScore(), emptyPointBuyDraft(), emptyStandardArrayDraft(), isStandardArrayComplete(), isValidPointBuyDraft() (+9 more)

### Community 67 - "2024 Monster Data Encoder"
Cohesion: 0.16
Nodes (23): ABILITIES, ALIGNMENTS, bucketFor(), classifyImmunityList(), cleanProse(), CR_FRACTIONS, CREATURE_TYPES, DAMAGE_TYPES (+15 more)

### Community 68 - "Character Effects Compilation"
Cohesion: 0.11
Nodes (23): getDaggerheartAncestryAdjustments(), applyDaggerheartAncestryTemplate(), applyDaggerheartClassTemplate(), applyDaggerheartCommunityTemplate(), classTemplateItems(), communityTemplateItems(), DaggerheartInventoryEntry, DEFAULTS (+15 more)

### Community 69 - "TypeScript Config"
Cohesion: 0.07
Nodes (28): ES2020, ./src/*, compilerOptions, allowImportingTsExtensions, baseUrl, forceConsistentCasingInFileNames, isolatedModules, jsx (+20 more)

### Community 70 - "Mam Character Sheet Tabs"
Cohesion: 0.12
Nodes (23): MUTATION_ANCHORS, MutationAnchor, applyDemotion(), DO_MUTATE, DO_WRITE, escapeRe(), evaluateMutation(), evaluateTierA() (+15 more)

### Community 71 - "Monster Stat Block & Status"
Cohesion: 0.19
Nodes (15): CREATURE_XP_BY_LEVEL_DIFF, pf2eAttackModifier(), pf2eCreatureXP(), Pf2eDegree, pf2eDyingAfterRecovery(), pf2eEncounterBudget(), pf2eInitialDying(), pf2eIsDead() (+7 more)

### Community 72 - "Dice Panel & Mam3e Resolution"
Cohesion: 0.09
Nodes (21): rateLimiterFromEnv(), googleAdapter, resolveProviderAdapter(), Clock, createDurableRateLimitStore(), createInMemoryRateLimitStore(), rateLimiterFromStore(), RateLimitRecord (+13 more)

### Community 73 - "System Validation Logic"
Cohesion: 0.20
Nodes (24): ABILITY_SCORE_IDS, addIssue(), createDnd5eValidator(), Dnd5eValidationData, Dnd5eValidationDataModel, Dnd5eValidationSystemId, featureOptionKey(), isIntegerInRange() (+16 more)

### Community 74 - "Spell Catalog Consistency Tests"
Cohesion: 0.16
Nodes (14): ExpectedSpellIdentity, iconicSpellExpectations, SystemKey, systems, dedupeById(), Identified, indexById(), warnDuplicateId() (+6 more)

### Community 75 - "Dnd5e Resource Loading Hooks"
Cohesion: 0.10
Nodes (32): EMPTY_WEAPON_LOADOUT, DaggerheartDomainCardAutomation(), DaggerheartDomainCardAutomationProps, DaggerheartFeatureListProps, DaggerheartSubclassFeatureGroup(), DaggerheartSubclassFeatureGroupProps, DOMAIN_CARD_AUTOMATION_LABELS, DOMAIN_CARD_AUTOMATION_VARIANTS (+24 more)

### Community 76 - "Mam Powers & Cost Ledger"
Cohesion: 0.10
Nodes (28): MamAdvantageBrowserTab(), Props, MamArchetypeBrowser(), MamArchetypeBrowserProps, MamArchetypeBrowser, MamArchetypesTab, MamArchetypesTabComponent, Props (+20 more)

### Community 77 - "Sync Engine Tests"
Cohesion: 0.10
Nodes (25): D20_LEGACY_CONDITION_NAMES, D20_LEGACY_TOGGLE_LABELS, D20EquipmentBrowserTab, D20FeatBrowserTab, D20FeatsTab(), FeatEntry, Props, countTrainedSkills() (+17 more)

### Community 78 - "Dnd5e Feature Options"
Cohesion: 0.16
Nodes (21): appendBulletList(), applyDnd5eFeatureOptionSelection(), ClassLevelLike, DND5E_FEATURE_OPTION_GROUP_LABELS, DND5E_FEATURE_OPTION_SOURCE_LABELS, DOMAIN_SUBCLASS_IDS, featureIdForOption(), FeatureOptionState (+13 more)

### Community 79 - "Document Migrations & Storage"
Cohesion: 0.06
Nodes (52): clearLocalDataForAccountChange(), cloneDocumentsSnapshot(), documentsChanged(), prepareDocumentsWithEngines(), prepareDocumentWithEngine(), useDocuments(), makeStoredDocument(), setStoredDocuments() (+44 more)

### Community 80 - "App Header & Auth UI"
Cohesion: 0.36
Nodes (7): ThemeToggle(), applyTheme(), getSystemTheme(), isTheme(), Theme, useTheme(), VALID_THEMES

### Community 81 - "Combat Toggles & Conditions"
Cohesion: 0.09
Nodes (16): baseAuthValue, mockedClearQueuedDeletedDocumentIds, mockedClearQueuedSyncSnapshot, mockedDeleteRemoteDocument, mockedFetchRemoteDocuments, mockedGetQueuedDeletedDocumentIds, mockedGetQueuedSyncSnapshot, mockedGetSyncTombstonedIds (+8 more)

### Community 82 - "HP & Spell Slot Trackers"
Cohesion: 0.11
Nodes (17): AiImageInput, EncounterDraftCandidate, EncounterDraftData, EncounterDraftSelection, IdentifyCreatureData, TaskGatewayCall, DraftEncounterParams, DraftEncounterResult (+9 more)

### Community 83 - "Scene Grid View"
Cohesion: 0.18
Nodes (14): daggerheartManifest, dnd35eManifest, dnd5e2014Manifest, dnd5e2024Manifest, manifestForSystem(), SRD_MANIFESTS, mam3eManifest, pf1eManifest (+6 more)

### Community 84 - "Boundary Validation Tests"
Cohesion: 0.24
Nodes (18): ValidationIssue, NOW, parseImg(), validDocInput(), coerceDate(), coerceObjectives(), coerceQuests(), coerceSessionLog() (+10 more)

### Community 85 - "capabilityScenarios.test.tsx"
Cohesion: 0.60
Nodes (3): formatModifierCost(), MamPowerModifierBrowser(), MamPowerModifierBrowserProps

### Community 86 - "Equipment & Feature Browsers"
Cohesion: 0.11
Nodes (27): useLazyResource(), useSystemOptions(), useD20LegacySheetResources(), Pf2eEquipmentBrowserTab, Pf2eFeatBrowserTab, Pf2eSpellsTab, usePf2eSheetResources(), loadArchetypesForSystem() (+19 more)

### Community 87 - "Pf2e Engine & Constants"
Cohesion: 0.09
Nodes (20): GapLedgerItem, LedgerPhase, LedgerStatus, LedgerTag, LedgerTrack, MASTER_GAP_LEDGER, RFC-003, byPhase (+12 more)

### Community 88 - "Documents Hook & Persistence"
Cohesion: 0.25
Nodes (16): actionReachCells(), ATTACK_COUNT_WORDS, averageDie(), buildMonsterCombatant(), dieFaces(), isMinusSign(), monsterAttackEffects(), monsterAttacksPerRound() (+8 more)

### Community 89 - "Daggerheart Contribution Ledger"
Cohesion: 0.07
Nodes (59): ANCESTRY_ADJUSTMENTS_BY_ID, ancestryByName, classByName, DAGGERHEART_TIER_BREAKPOINTS, DAGGERHEART_TRAITS, DaggerheartAncestryAdjustments, DaggerheartRange, DEFAULT_DAGGERHEART_ANCESTRY_ADJUSTMENTS (+51 more)

### Community 90 - "Dnd35e/Pf1e Derived Math"
Cohesion: 0.11
Nodes (26): D20FeatBrowserTabComponent, FeatBrowser, Props, BrowserFeat, Dnd5eFeatBrowserTab, Dnd5eFeatBrowserTabComponent, FeatBrowser, FeatBrowserProps (+18 more)

### Community 91 - "Mam Browser Tabs"
Cohesion: 0.12
Nodes (23): buildEncounterSceneEvents(), buildInitiativeEntries(), buildOccupiedCells(), clampInteger(), compareTokenIds(), EncounterBuilderIssue, EncounterPartyMember, EncounterPlanEntry (+15 more)

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
Cohesion: 0.09
Nodes (19): BUILT_IN_PROVIDERS, DEFAULT_PROVIDER_REGISTRY, GEMINI_REGISTRATION, MOCK_REGISTRATION, ProviderBuild, ProviderRegistration, ProviderRegistryDeps, ProviderRegistryEnv (+11 more)

### Community 97 - "Mam3e Derived Math"
Cohesion: 0.10
Nodes (18): IllustrateSceneResult, ILLUSTRATION_STYLES, IllustrationPanel(), IllustrationPanelProps, SceneCreateForm(), SceneCreateFormProps, ButtonProps, buttonVariants (+10 more)

### Community 98 - "Doc Drift Tests"
Cohesion: 0.18
Nodes (4): OUTCOME_DIR, RunFn, SystemOutcome, SYSTEMS

### Community 99 - "Spell Catalog Parity Tests"
Cohesion: 0.11
Nodes (5): DND35E_SOURCE_BLOCKED_SPELL_IDS, fieldCoverageBaselines, PF1E_SOURCE_ROWS_WITHOUT_SAVING_THROW, SpellModule, spellModules

### Community 100 - "Pf2e Spell Types & Traits"
Cohesion: 0.10
Nodes (26): CombatStatCard(), Props, Props, SheetHeader(), PresentedDerivedQuantity, ComputeLayer, DerivedDisplay, DerivedQuantityCase (+18 more)

### Community 101 - "Document Storage (IndexedDB)"
Cohesion: 0.25
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
Cohesion: 0.08
Nodes (31): AuthContextValue, useCampaignSync(), useEntitySync(), baseAuthValue, mockedClearQueuedCampaignsSnapshot, mockedClearQueuedDeletedCampaignIds, mockedDeleteRemoteCampaign, mockedFetchRemoteCampaigns (+23 more)

### Community 106 - "Character Card Presenter"
Cohesion: 0.13
Nodes (13): SystemSheetComponent, makeD20LegacySheet(), Dnd35eSystemDef, Dnd5e2024SystemDef, Dnd5eSystemDef, Dnd5eMonsterBrowserTabComponent, MonsterBrowser, MonsterBrowserProps (+5 more)

### Community 107 - "Oracle Panel & Logic"
Cohesion: 0.38
Nodes (10): CharacterCard(), asNumber(), asRecord(), asString(), getClassLabel(), getDocumentLevelValue(), getHitPointLabel(), getLevelLabel() (+2 more)

### Community 108 - "5e Equipment Tab"
Cohesion: 0.43
Nodes (5): getEditableTarget(), KeyboardShortcut, useKeyboardNavigation(), Harness(), HarnessProps

### Community 109 - "Scene Reaction Panel"
Cohesion: 0.33
Nodes (9): buildSpellPreparationConcepts(), compareSpellEntries(), dedupeSpellIds(), humanizeSpellId(), resolveSpellPreparationEntries(), resolveSpellPreparationEntry(), SpellLookup, SpellPreparationConcepts (+1 more)

### Community 110 - "Document Signature Hashing"
Cohesion: 0.22
Nodes (4): AI_GATEWAY_TASKS, BRUTE, NOW, VICTIM

### Community 111 - "Resource Pool Tracking"
Cohesion: 0.19
Nodes (17): D20SkillsTab(), buildArmorClassEntries(), d20SkillCheckPenalty(), daggerheartDamageDiceCount(), DND35E_SYNERGY_SOURCES, dnd35eMaxSkillRanks(), dnd35eSkillSynergyTotal(), dnd35eSynergyBonus() (+9 more)

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
Cohesion: 0.08
Nodes (37): DEFAULT_QUICK_ROLLS, DicePanel(), DicePanelProps, formatBreakdown(), QUICK_ROLLS_BY_SYSTEM, DISPOSITION_BADGE, DISPOSITION_LABEL, ReactionHistoryEntry (+29 more)

### Community 117 - "AI Encounter Draft Flow"
Cohesion: 0.13
Nodes (16): CurrencyEditor(), CurrencyEntry, DND_CURRENCIES, Props, InventoryItem, InventoryManager(), InventoryManagerProps, Currency (+8 more)

### Community 118 - "Campaign File Transfer"
Cohesion: 0.09
Nodes (28): Dnd5eTemplateState, AddEntryInput, buildAlwaysPreparedSpellEntries(), buildDnd5eContributionLedger(), buildFeatAutomationEntries(), buildListEntry(), buildSpellcastingEntries(), buildTemplateProficiencyEntries() (+20 more)

### Community 119 - "MAM Archetype Browser"
Cohesion: 0.27
Nodes (11): CLASS_TOKENS, d20srdUrl(), FILES, main(), mapCastingTime(), mapDuration(), mapRange(), normalizeName() (+3 more)

### Community 120 - "PF1e Spell Encoder"
Cohesion: 0.27
Nodes (11): CLASS_COLUMNS, main(), mapCastingTime(), mapDuration(), mapRange(), RFC-4180, normalizeName(), parseCsv() (+3 more)

### Community 122 - "PF2e Archetypes Tab"
Cohesion: 0.06
Nodes (48): DND5E_SCENE_CONDITIONS, SCENE_CONDITIONS_BY_SYSTEM, BuildDaggerheartCombatantResult, DaggerheartCombatant, RANGE_CELLS, collectD20LegacyConditionEffects(), D20_LEGACY_CONDITION_EFFECTS, D20_LEGACY_CONDITION_IDS (+40 more)

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
Cohesion: 0.19
Nodes (18): countSelections(), optionDisabledForRequirement(), resolveEquipmentSlot(), resolveFeatSelections(), toEquippedItem(), toWeaponDamage(), choiceRequirementFromGrant(), createDefaultDnd5eFeatSelections() (+10 more)

### Community 130 - "d20LegacySpellcasting.ts"
Cohesion: 0.07
Nodes (26): CR_XP_TABLE, formatChallengeRating(), MonsterBrowser(), MonsterBrowserProps, MonsterStatBlock(), MonsterStatBlockProps, DraftEncounterParams, GeneratedNpc (+18 more)

### Community 131 - "Retry With Backoff"
Cohesion: 0.14
Nodes (34): Doc, useSync(), UseSyncOptions, mockedGetSupabaseClient, getSupabaseClient(), clearQueuedDeletedDocumentIds(), clearQueuedIds(), clearQueuedSyncSnapshot() (+26 more)

### Community 132 - "2024 Spell Encoder"
Cohesion: 0.39
Nodes (8): main(), mapCastingTime(), mapDuration(), mapRange(), normalizeName(), SCHOOLS, slug(), ts()

### Community 133 - "MAM Power Browser"
Cohesion: 0.12
Nodes (16): CombatTogglesSection(), Props, Condition, ConditionPicker(), Props, availablePf2eToggles(), PF2E_TOGGLE_LABELS, Dnd5eRiderTogglesSection() (+8 more)

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
Cohesion: 0.27
Nodes (9): makeScene(), campaignSignatureFor(), sameCampaignSignatures(), sameDocumentSignatures(), sameSceneSignatures(), sameSignatureMultisets(), sceneSignatureFor(), signatureFor() (+1 more)

### Community 141 - "pf2eSpellTraits.test.ts"
Cohesion: 0.08
Nodes (30): validateDnd35eBuild(), ABILITY_KEYS, ABILITY_KEYS, TIER_BONUS, BuildLegalityResult, BuildViolation, Props, Props (+22 more)

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

### Community 146 - "Scene Illustration Panel"
Cohesion: 0.20
Nodes (14): EncounterPanel(), EncounterPanelProps, formatAverageLevel(), EncounterMonsterSelection, EncounterPartySummary, EncounterPlanSummary, DraftEncounterResult, EncounterDifficulty (+6 more)

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
Cohesion: 0.10
Nodes (29): AppContent(), buildNewCharacterDocument(), cloneSystemData(), LegalNotices, SceneManager, STORAGE_WARNING_THRESHOLD, CampaignManager(), CharacterSortOption (+21 more)

### Community 154 - "Dnd5eEquipmentTab.tsx"
Cohesion: 0.14
Nodes (13): CurrencyEditor, CurrencyEditorProps, Dnd5eEquipmentTabComponent, EquipmentBrowser, EquipmentBrowserItem, EquipmentBrowserProps, EquippedItemsSection, EquippedItemsSectionProps (+5 more)

### Community 155 - "5e Movement Rules"
Cohesion: 0.29
Nodes (12): NOW, clearSyncTombstones(), getSyncTombstonedIds(), getSyncTombstones(), pruneExpired(), readStored(), recordSyncTombstones(), removeSyncTombstones() (+4 more)

### Community 156 - "usePwaInstallPrompt.ts"
Cohesion: 0.27
Nodes (8): ToastContext, ToastContextValue, ToastItem, ToastProvider(), VARIANT_ICONS, VARIANT_STYLES, registerToastHandler(), ToastVariant

### Community 157 - "daggerheartSheetShared.tsx"
Cohesion: 0.29
Nodes (10): draftEncounterWithAi(), identifyCreatureWithAi(), fileToAiImageInput(), readAsDataUrl(), isMonsterSystemId(), RFC-006, useSceneEncounter(), summarizeEncounterPlan() (+2 more)

### Community 160 - "MamArchetypesTab.tsx"
Cohesion: 0.25
Nodes (10): applyMam3eToughnessFailure(), getMam3eSheetState(), GetMam3eSheetStateProps, uniqueNonEmptyStrings(), createEmptyMam3eConditionTrack(), createEmptyMam3ePower(), useMam3eMutationHandlers(), useMam3eSheetController() (+2 more)

### Community 161 - "PF2e Backgrounds Data"
Cohesion: 0.50
Nodes (3): Pf2eBackgroundChoice, Pf2eBackgroundDefinition, Pf2eBackgroundFeatGrant

### Community 177 - "gatewayClient.ts"
Cohesion: 0.21
Nodes (9): clampExhaustion(), Props, RestControls(), D20LegacyHeader(), Props, Dnd5eHeaderSection(), HeaderOption, Props (+1 more)

### Community 179 - "featTemplate.test.ts"
Cohesion: 0.21
Nodes (10): Dnd5eSpellsTabComponent, Props, SpellBrowser, SpellBrowserProps, Dnd5eAlwaysPreparedSpellSource, Dnd5ePreparedCasterSummary, Dnd5eSpellcastingClassSummary, Pf2eSpellBrowserPanel (+2 more)

### Community 180 - "MamPowerBrowserTab.tsx"
Cohesion: 0.31
Nodes (8): formatMamPowerAction(), formatMamPowerDuration(), formatMamPowerRange(), humanizeMamToken(), MamPowerBrowserTabComponent, MamPowerModifierBrowser, Props, SpellBrowser

### Community 181 - "useEntitySync.ts"
Cohesion: 0.27
Nodes (10): mockedGetQueuedCampaignsSnapshot, mockedGetQueuedDeletedCampaignIds, mockedGetQueuedDeletedDocumentIds, mockedGetQueuedSyncSnapshot, formatDateAndTime(), formatLastSyncedAt(), formatTimeOfDay(), isPreviousLocalDay() (+2 more)

### Community 182 - "syncTombstones.ts"
Cohesion: 0.31
Nodes (7): collectTerrainEffectsAt(), isTerrainOperation(), markerCoversCell(), markerToEffects(), normalizeStackPolicy(), TERRAIN_OPERATIONS, RFC-003

### Community 183 - "loadEquipmentForSystem"
Cohesion: 0.50
Nodes (3): Answer, Outcome, Q: where are pending debounced document saves flushed to localStorage on page hide or unload (persistence flush)

### Community 184 - "MamArchetypesTab.tsx"
Cohesion: 0.27
Nodes (8): SYSTEM_IDS, getSystemAssetPrefetchStateForTests(), prefetchedSystemAssets, prefetchedSystemRuntimeData, prefetchedSystemSheets, prefetchSystemAssetsForIds(), resetSystemAssetPrefetchStateForTests(), systemAssetPrefetchers

### Community 186 - "eslint-plugin-react"
Cohesion: 0.40
Nodes (4): Feat, FeatBrowser(), FeatBrowserProps, feats

### Community 188 - "knip"
Cohesion: 0.33
Nodes (5): DEFAULT_LABELS, SpellBrowser(), SpellBrowserLabels, SpellBrowserProps, mockSpells

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
Nodes (23): CharacterListView(), SystemRegistry, SystemDefinition, ValidationContext, ValidationResult, registerAllSystems(), Mam3eSystemDef, MockBeforeInstallPromptEvent (+15 more)

## Knowledge Gaps
- **1242 isolated node(s):** `browser`, `es2021`, `node`, `eslint:recommended`, `plugin:@typescript-eslint/recommended` (+1237 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **19 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `Dnd5e Feature List Sections` to `Sheet Resource Loading Hooks`, `Dnd5e Sheets & E2E Tests`, `Dnd5e Equipment & Features UI`, `d20LegacySpellcasting.ts`, `Retry With Backoff`, `MAM Power Browser`, `Toast Notifications`, `Tabs UI Component`, `Daggerheart Engine`, `Scene Combat Resolution`, `Dnd5e Class Templates`, `Monster & NPC Generator`, `App Shell & Layout`, `D20 Combat Controls`, `Scene Illustration Panel`, `Combat & Recap Panels`, `D20 Legacy System Engines`, `System Registry & Renderer`, `Equipment Browser Component`, `ServiceWorkerUpdateBanner.tsx`, `Dnd5eEquipmentTab.tsx`, `usePwaInstallPrompt.ts`, `daggerheartSheetShared.tsx`, `Class Enhancement & Headers`, `MamArchetypesTab.tsx`, `Quest & Session Log UI`, `Condition Effects by System`, `Equipped Armor Section`, `Spell Browser UI`, `Error Boundary & Auth Context`, `Encounter Builder Logic`, `Scene Management Hooks`, `gatewayClient.ts`, `Monster Combatant Builder`, `Campaign Storage & Hooks`, `D20 Legacy Templates`, `featTemplate.test.ts`, `MamPowerBrowserTab.tsx`, `D20 Class Spellcasting`, `Character Combatant Builder`, `Daggerheart Combatant Builders`, `eslint-plugin-react`, `knip`, `D20 Legacy Spell Slots`, `MamComplicationBrowser.tsx`, `ESLint Config`, `daggerheart-engine.test.ts`, `Browser Compat & Error Logging`, `AI Gateway Client`, `@types/react-dom`, `Character Effects Compilation`, `Mam Powers & Cost Ledger`, `Sync Engine Tests`, `Document Migrations & Storage`, `App Header & Auth UI`, `Combat Toggles & Conditions`, `capabilityScenarios.test.tsx`, `Equipment & Feature Browsers`, `Dnd35e/Pf1e Derived Math`, `Mam3e Derived Math`, `Pf2e Spell Types & Traits`, `Document Storage (IndexedDB)`, `AI Creature Identification`, `Character Card Presenter`, `5e Equipment Tab`, `Resource Pool Tracking`, `3.5e Spell Encoder`, `AI Encounter Draft Flow`?**
  _High betweenness centrality (0.127) - this node is a cross-community bridge._
- **Why does `CharacterDocument` connect `System Registry & Renderer` to `Toast Notifications`, `d20LegacySpellcasting.ts`, `Retry With Backoff`, `Dnd5e2024 Engine & Hit Dice`, `Daggerheart Engine`, `Dnd5e Background Templates`, `Tabs UI Component`, `MAM Power Browser`, `Scene Combat Resolution`, `Dnd5e Class Templates`, `pf2eConditions.ts`, `pf2eSpellTraits.test.ts`, `Dnd5e Activity Definitions`, `Dnd5e Feat Templates`, `D20 Combat Controls`, `Game System Selector`, `Combat & Recap Panels`, `Dnd35e Saves & Data Model`, `Daggerheart Data Model`, `ServiceWorkerUpdateBanner.tsx`, `Daggerheart Inventory`, `Pf2e Character Templates`, `Dnd5e Feature List Sections`, `daggerheartSheetShared.tsx`, `Encounter & Initiative Panels`, `Pf2e Sheet Tabs`, `MamArchetypesTab.tsx`, `Document Sync Engine`, `Check & Oracle Resolution`, `Mam3e Data Model & Engine`, `Condition Effects by System`, `Encounter Builder Logic`, `Monster Combatant Builder`, `gatewayClient.ts`, `D20 Legacy Templates`, `Spell Preparation Logic`, `Character Combatant Builder`, `D20 Class Spellcasting`, `SRD Manifest Generator`, `D20 Legacy Spell Slots`, `@types/react-dom`, `Character Effects Compilation`, `Monster Stat Block & Status`, `System Validation Logic`, `Dnd5e Resource Loading Hooks`, `Sync Engine Tests`, `Document Migrations & Storage`, `Combat Toggles & Conditions`, `Boundary Validation Tests`, `Daggerheart Contribution Ledger`, `Mam Browser Tabs`, `Document Storage (IndexedDB)`, `Character Card Presenter`, `Oracle Panel & Logic`, `Document Signature Hashing`, `Resource Pool Tracking`, `AI Encounter Draft Flow`, `Campaign File Transfer`, `PF2e Archetypes Tab`?**
  _High betweenness centrality (0.112) - this node is a cross-community bridge._
- **Why does `GameSystemId` connect `Class Enhancement & Headers` to `Sheet Resource Loading Hooks`, `Dnd5e Sheets & E2E Tests`, `Dnd5e2024 Engine & Hit Dice`, `Tabs UI Component`, `Scene Combat Resolution`, `D20 Combat Controls`, `Game System Selector`, `System Registry & Renderer`, `ServiceWorkerUpdateBanner.tsx`, `Roadmap Metrics Generator`, `daggerheartSheetShared.tsx`, `Pf2e Sheet Tabs`, `MamArchetypesTab.tsx`, `Currency & Inventory Editors`, `Sheet Header & Stat Cards`, `Doc Drift Rules`, `Condition Effects by System`, `Encounter Builder Logic`, `Character Combatant Builder`, `MamArchetypesTab.tsx`, `Daggerheart Combatant Builders`, `SRD Coverage Script`, `Browser Compat & Error Logging`, `Mam Powers & Cost Ledger`, `Sync Engine Tests`, `Equipment & Feature Browsers`, `Dnd35e/Pf1e Derived Math`, `Document Storage (IndexedDB)`, `Document Signature Hashing`, `PF2e Archetypes Tab`?**
  _High betweenness centrality (0.054) - this node is a cross-community bridge._
- **What connects `browser`, `es2021`, `node` to the rest of the system?**
  _1242 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Sheet Resource Loading Hooks` be split into smaller, more focused modules?**
  _Cohesion score 0.10549645390070922 - nodes in this community are weakly interconnected._
- **Should `Dnd5e Sheets & E2E Tests` be split into smaller, more focused modules?**
  _Cohesion score 0.08484848484848485 - nodes in this community are weakly interconnected._
- **Should `Dnd5e Equipment & Features UI` be split into smaller, more focused modules?**
  _Cohesion score 0.11666666666666667 - nodes in this community are weakly interconnected._