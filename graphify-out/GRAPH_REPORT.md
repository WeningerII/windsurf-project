# Graph Report - windsurf-project  (2026-07-20)

## Corpus Check
- 760 files · ~520,119 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 4708 nodes · 13384 edges · 197 communities (177 shown, 20 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 112 edges (avg confidence: 0.72)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `fa29ae20`
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

## God Nodes (most connected - your core abstractions)
1. `CharacterDocument` - 233 edges
2. `react` - 167 edges
3. `SystemDataModel` - 126 edges
4. `GameSystemId` - 78 edges
5. `EffectInstance` - 63 edges
6. `abilityMod()` - 58 edges
7. `makeEffectId()` - 54 edges
8. `Dnd5eDataModel` - 50 edges
9. `SystemRegistry` - 48 edges
10. `Pf2eDataModel` - 45 edges

## Surprising Connections (you probably didn't know these)
- `AbilityScoreGrid()` --indirect_call--> `mod()`  [INFERRED]
  src/components/sheet/AbilityScoreGrid.tsx → scripts/encode-35e-monsters.mjs
- `Pf2eAbilitiesTab()` --indirect_call--> `mod()`  [INFERRED]
  src/systems/pf2e/components/Pf2eAbilitiesTab.tsx → scripts/encode-35e-monsters.mjs
- `inferAbilityChoiceRequirement()` --indirect_call--> `ability()`  [INFERRED]
  src/systems/dnd5e/shared/featTemplate.ts → scripts/encode-pf1e-monsters.mjs
- `getDnd5eSpellcastingClassSummaries()` --indirect_call--> `ability()`  [INFERRED]
  src/systems/dnd5e/shared/spellPreparation.ts → scripts/encode-pf1e-monsters.mjs
- `useMam3eSheetController()` --indirect_call--> `ability()`  [INFERRED]
  src/systems/mam3e/useMam3eSheetController.ts → scripts/encode-pf1e-monsters.mjs

## Import Cycles
- None detected.

## Communities (197 total, 20 thin omitted)

### Community 0 - "Sheet Resource Loading Hooks"
Cohesion: 0.06
Nodes (80): ManifestCategory, buildSystem(), CATEGORY_LOADERS, CategoryLoader, escape(), isRecord(), Loaded, main() (+72 more)

### Community 1 - "Dnd5e Sheets & E2E Tests"
Cohesion: 0.09
Nodes (37): categoryIcons, GameSystemSelector(), GameSystemSelectorProps, systemAccents, supportBadgeLabels, supportBadgeStyles, buildInitialSummaryStates(), categoryDisplay (+29 more)

### Community 2 - "Dnd5e Equipment & Features UI"
Cohesion: 0.06
Nodes (45): clampTrack(), DeathSaves, DeathSavesTracker(), Props, EquippedItemsSection(), Props, SLOT_LABELS, SLOT_ORDER (+37 more)

### Community 3 - "Dnd5e Background Templates"
Cohesion: 0.09
Nodes (44): resolveFeatSelections(), ABILITY_NAME_TO_ID, ABILITY_OPTIONS, abilityAutomationFromSelections(), aggregateFeatAutomation(), applyFeatSkillSources(), buildAutomatedFeat(), ChoiceCategory (+36 more)

### Community 4 - "Dnd5e2024 Engine & Hit Dice"
Cohesion: 0.10
Nodes (15): Dnd5eEngineBase, normalizeDeathSaves(), engine, SHIELD, TEST_DATE, CasterType, casterTypeForClass(), compute5eSpellSlots() (+7 more)

### Community 5 - "Daggerheart Engine"
Cohesion: 0.09
Nodes (44): assertMulticlassRequirements(), ATTRIBUTE_NAME_TO_ID, buildChoiceSlots(), buildDerivedProficiencies(), buildSpellcastingState(), canSelectSubclass(), classFeaturesAtLevel(), collectClassAndSubclassFeatureSignatures() (+36 more)

### Community 6 - "3.5e Monster Data Encoder"
Cohesion: 0.09
Nodes (34): ALIGNMENTS, DICE_PROGRESSIONS, main(), mapAlignment(), MONSTER_SIZE, normalizeName(), OLIMOT_FILES, resolveSizeRoll() (+26 more)

### Community 7 - "Tabs UI Component"
Cohesion: 0.12
Nodes (25): DaggerheartCharacterBasicsSection(), Props, DaggerheartDomainCardsSection(), Props, DaggerheartDowntimeControls(), Props, DaggerheartNotesSection(), Props (+17 more)

### Community 8 - "Node Runtime Bootstrap"
Cohesion: 0.09
Nodes (49): main(), runBootstrapNodeInstall(), getPinnedCommandArgs(), main(), runPinnedNpmCommand(), formatRuntimeDoctorReport(), main(), readWorkflowPinSource() (+41 more)

### Community 9 - "Scene Combat Resolution"
Cohesion: 0.06
Nodes (43): SceneManager(), buildSceneCombatants(), factionForToken(), ResolveCombatStats, appendSceneEvent(), applySceneIntents(), createSceneDocument(), foldSceneEvents() (+35 more)

### Community 10 - "Dnd5e Class Templates"
Cohesion: 0.16
Nodes (22): MamPowersTab(), ModifierColumn(), ModifierColumnProps, Props, buildMam3eContributionLedger(), buildMam3ePowerCostLedgerEntries(), createPowerCostEntry(), ledgerId() (+14 more)

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
Nodes (39): RingBuffer, ALLOWED_ENUM_VALUES, SanitizedProps, TelemetryEnumValue, TelemetryEvent, TelemetryEventName, TelemetryEventPayloads, TelemetrySink (+31 more)

### Community 15 - "Dnd5e Feat Templates"
Cohesion: 0.22
Nodes (11): D20EquipmentBrowserTab, D20FeatBrowserTab, countTrainedSkills(), D20InventoryCurrency, D20InventoryItem, D20LegacyData, D20LegacyTabs(), D20NotesTab() (+3 more)

### Community 16 - "App Shell & Layout"
Cohesion: 0.17
Nodes (20): UserMenu(), UserMenuProps, SyncState, Doc, UseSyncOptions, mockedGetQueuedCampaignsSnapshot, mockedGetQueuedDeletedCampaignIds, mockedGetQueuedDeletedDocumentIds (+12 more)

### Community 17 - "D20 Combat Controls"
Cohesion: 0.08
Nodes (32): HIT_DICE, hitDieSize(), hitDieString(), DND5E_CONDITION_NAMES, hasDnd5eCondition(), normalizeConditionId(), normalizeDnd5eConditions(), dnd5eCarryingCapacity() (+24 more)

### Community 18 - "Game System Selector"
Cohesion: 0.07
Nodes (26): Dnd5eSheet(), Dnd5eCondition, createDefaultDnd5eData(), Dnd5eDataModel, Dnd5eEngine, Props, Dnd5eDocument, makeDnd5eDocument() (+18 more)

### Community 19 - "Combat & Recap Panels"
Cohesion: 0.18
Nodes (14): assertNever(), INITIAL_NAV_STATE, LIBRARY_SEGMENTS, LibrarySegment, NavAction, navReducer(), Overlay, ShellNavState (+6 more)

### Community 20 - "D20 Legacy System Engines"
Cohesion: 0.09
Nodes (32): dnd35eAbilityIncreases(), dnd35eConcentrationDCDamage(), dnd35eConcentrationDCDefensive(), dnd35eFeatsFromLevel(), dnd35eHpState, dnd35eTriggersMassiveDamage(), dnd35eXpForLevel(), DND35E_DERIVED_QUANTITIES (+24 more)

### Community 21 - "Dnd35e Saves & Data Model"
Cohesion: 0.07
Nodes (52): availableD20LegacyToggles(), D20LegacyData, D20LegacySpellSlots, getIterativeAttackBonuses(), recoverD20LegacySpellSlot(), resetD20LegacySpellSlots(), setD20LegacyPreparedSpell(), setD20LegacySpellSlotTotal() (+44 more)

### Community 22 - "Daggerheart Data Model"
Cohesion: 0.07
Nodes (40): DiceRollButtonProps, RollResult, SystemEngine, resolveCharacterEffects(), d20LegacyCheckPenalty(), rollD20(), DEGREE_ORDER, pf2eDegreeOfSuccess (+32 more)

### Community 23 - "System Registry & Renderer"
Cohesion: 0.04
Nodes (58): AppHeaderProps, Props, CharacterCardProps, CharacterListView(), CharacterListViewProps, UseSceneEncounterParams, Props, Props (+50 more)

### Community 24 - "Game Rules & Proficiencies"
Cohesion: 0.08
Nodes (33): ArmorProficiency, ArmorProficiencyType, ArtisanToolProficiency, GamingSetProficiency, isValidArmorProficiency(), isValidSkillProficiency(), isValidToolProficiency(), isValidWeaponProficiency() (+25 more)

### Community 25 - "Campaign Sync Hooks"
Cohesion: 0.09
Nodes (43): resolveCheck(), BuildEncounterEventsResult, cellKey(), footprintCells(), footprintWithinGrid(), isOracleAnswer(), isOracleOdds(), resolveOracle() (+35 more)

### Community 26 - "Daggerheart Inventory"
Cohesion: 0.10
Nodes (36): getDaggerheartAncestryAdjustments(), ancestryLookup, armorLookup, buildLookup(), classLookup, communityLookup, DEFAULTS, domainCardByName (+28 more)

### Community 27 - "Pf2e Character Templates"
Cohesion: 0.11
Nodes (40): Pf2eFeat, abilityBoostValue(), ancestryFeatures(), applyAbilityAdjustments(), applyPf2eAncestryTemplate(), applyPf2eArchetypeTemplate(), applyPf2eBackgroundTemplate(), applyPf2eClassTemplate() (+32 more)

### Community 28 - "Roadmap Metrics Generator"
Cohesion: 0.09
Nodes (38): applyRepoResidentOverrides(), buildComputeCompletion(), buildContentCompletion(), buildMarkdownReport(), ComputeCompletionRow, computeMetrics(), ContentCompletionRow, createEmptyCategoryCounts() (+30 more)

### Community 29 - "Dnd5e Feature List Sections"
Cohesion: 0.05
Nodes (56): DamageHealControl(), DamageHealControlProps, DiceRollButton(), clampExhaustion(), Props, RestControls(), availablePf2eToggles(), D20CombatSection() (+48 more)

### Community 30 - "Encounter & Initiative Panels"
Cohesion: 0.13
Nodes (27): appendInventoryFromBackground(), applyDnd5eBackgroundTemplate(), BackgroundChoiceSlot, BackgroundChoiceValue, backgroundDerivedState(), COMMON_LANGUAGE_OPTIONS, Dnd5eBackgroundTemplateSelections, Dnd5eLikeDataModel (+19 more)

### Community 31 - "Class Enhancement & Headers"
Cohesion: 0.10
Nodes (28): Props, UseDaggerheartSheetResourcesProps, Dnd5eEquipmentTab, Dnd5eFeatBrowserTab, Dnd5eFeaturesTab, Dnd5eMonsterBrowserTab, Dnd5eSpellsTab, useDnd5eDeferredResource() (+20 more)

### Community 32 - "Pf2e Sheet Tabs"
Cohesion: 0.07
Nodes (37): buildCharacterCombatant(), BuildCharacterCombatantResult, CharacterCombatant, normalizeSheet(), readArmorClass(), toMagicBonusItems(), toModifierSources(), AttackEconomy (+29 more)

### Community 33 - "AI Encounter Drafting"
Cohesion: 0.11
Nodes (35): draftEncounterWithAi(), identifyCreatureWithAi(), isMonsterSystemId(), RFC-006, useSceneEncounter(), EncounterMonsterSelection, summarizeEncounterPlan(), DIFFICULTY_COLUMN (+27 more)

### Community 34 - "Quest & Session Log UI"
Cohesion: 0.08
Nodes (37): AI_GATEWAY_TASKS, Props, QuestList(), STATUS_BADGE, STATUS_OPTIONS, DATE_FORMAT, Props, SessionLog() (+29 more)

### Community 35 - "Currency & Inventory Editors"
Cohesion: 0.09
Nodes (38): SceneAreaEffectOutcome, SceneAttackOutcome, SceneRoundOutcome, isRoundConclusive(), RoundCombatant, RoundResult, RoundTurnRecord, runCombatRound() (+30 more)

### Community 36 - "Document Sync Engine"
Cohesion: 0.08
Nodes (58): DND5E_SCENE_CONDITIONS, SCENE_CONDITIONS_BY_SYSTEM, sceneConditionOptions(), critModelForScene(), degreeModelForScene(), resolveSceneAreaEffect(), resolveSceneAttack(), runSceneRound() (+50 more)

### Community 37 - "Sheet Header & Stat Cards"
Cohesion: 0.12
Nodes (24): D20ClassesSection(), D20LegacyClassLevel, Props, renderClassOptions(), d20BonusSpells(), buildD20LegacySpellSlotTotals(), countAdvancementLevels(), D20_ARCANE_SCHOOLS (+16 more)

### Community 38 - "Check & Oracle Resolution"
Cohesion: 0.18
Nodes (21): buildMam3eCreatorData(), createDefaultMam3eDefenseRanks(), DERIVATION_EPOCH, deriveMam3eCreatorTotals(), Mam3eAbilities, Mam3eAbilityKey, Mam3eDefenseRanks, Mam3ePlViolations (+13 more)

### Community 39 - "Mam3e Data Model & Engine"
Cohesion: 0.11
Nodes (27): EncounterPanelProps, buildEncounterSceneEvents(), buildInitiativeEntries(), buildOccupiedCells(), clampInteger(), compareTokenIds(), EncounterBuilderIssue, EncounterPartyMember (+19 more)

### Community 40 - "Doc Drift Rules"
Cohesion: 0.05
Nodes (62): DOC_DRIFT_MANIFEST, DocDriftRuleType, DocDriftSurface, DocDriftSurfaceKind, CAPABILITY_PHRASE_RULES, CapabilityPhraseRule, capitalizeSupportLevel(), COMMAND_RUNTIME_RULES (+54 more)

### Community 41 - "NPM Build Scripts"
Cohesion: 0.05
Nodes (43): scripts, bootstrap:node, build, check:bundle-size, check:compute-register, check:compute-register:mutate, check:compute-register:write, check:dead-code (+35 more)

### Community 42 - "Condition Effects by System"
Cohesion: 0.15
Nodes (20): applyDnd5eClassTemplate(), applyDnd5eSubclassTemplate(), get5eClassCatalog(), removeDnd5eClassTemplate(), getEligibleDnd5eFeatureOptions(), countSelections(), Dnd5eLikeDataModel, Dnd5eSheetMutators (+12 more)

### Community 43 - "Equipped Armor Section"
Cohesion: 0.11
Nodes (21): EquipArmorInput, EquipEntry, EquippedArmorSection(), EquipShieldInput, Props, fullPlate, leather, steelShield (+13 more)

### Community 44 - "Spell Browser UI"
Cohesion: 0.12
Nodes (27): DEFAULT_LABELS, SpellBrowser(), SpellBrowserLabels, SpellBrowserProps, SpellBrowserSpell, D20SpellBrowserPanelComponent, SpellBrowser, toSpellBrowserSpell() (+19 more)

### Community 45 - "Scene Combat Area Effects"
Cohesion: 0.17
Nodes (15): buildNotice(), FetchTarget, fetchValidated(), HTML_ENTITIES, looksLikeHtml(), main(), normalize(), noticePath (+7 more)

### Community 46 - "Error Boundary & Auth Context"
Cohesion: 0.10
Nodes (24): Mode, SignIn(), SignInProps, AuthContext, AuthContextValue, clearLocalDataForAccountChange(), getLastSyncedUserId(), setLastSyncedUserId() (+16 more)

### Community 47 - "Encounter Builder Logic"
Cohesion: 0.14
Nodes (30): applyAbilityAdjustments(), applyD20LegacyClassTemplate(), applyD20LegacyRaceTemplate(), buildClassSkills(), classFeaturesUpToLevel(), classSkillOptions(), collectClassFeatureSignatures(), create35eClassLevel() (+22 more)

### Community 48 - "Scene Management Hooks"
Cohesion: 0.17
Nodes (23): Props, SceneCreateFormProps, useScenes(), makeScene(), NOW, NOW, SceneDocument, clearSceneStorage() (+15 more)

### Community 49 - "Monster Combatant Builder"
Cohesion: 0.04
Nodes (72): NarrateSceneResult, CheckPanel(), CheckPanelProps, DEFAULT_SUGGESTIONS, DND5E_SKILLS, OUTCOME_BADGE, OUTCOME_LABEL, SKILL_SUGGESTIONS_BY_SYSTEM (+64 more)

### Community 50 - "D20 Legacy Templates"
Cohesion: 0.15
Nodes (35): RFC-005, getDaggerheartShortRestRecovery(), createDaggerheartInventoryEntry(), clearAllStress(), clearStress(), prepareGainHope(), repairAllArmor(), repairArmor() (+27 more)

### Community 51 - "Campaign Storage & Hooks"
Cohesion: 0.15
Nodes (20): useCampaigns(), DebouncedPersistence, IMPORTANT: a begun generation must end in either `persist` or, useDebouncedPersistence(), hostileStorage, CAMPAIGNS_STORAGE_KEY, clearCampaignStorage(), exportCampaigns() (+12 more)

### Community 52 - "Spell Preparation Logic"
Cohesion: 0.09
Nodes (16): createDefaultDnd5e2024Data(), makeDoc(), makeDoc(), make2024Doc(), boonOfSkill, crafter, fixtureBenefits, keen_mind (+8 more)

### Community 53 - "Dev Dependencies"
Cohesion: 0.05
Nodes (41): autoprefixer, eslint, eslint-config-prettier, eslint-plugin-react-hooks, eslint-plugin-react-refresh, happy-dom, devDependencies, autoprefixer (+33 more)

### Community 54 - "Character Combatant Builder"
Cohesion: 0.10
Nodes (32): CharacterEffectInputs, ResolvedCharacterEffects, compileEquipmentEffects(), equipStackPolicy(), isMeaningful(), MagicBonusItem, TYPED_STACK_SYSTEMS, compileModifierEffects() (+24 more)

### Community 55 - "D20 Class Spellcasting"
Cohesion: 0.17
Nodes (12): ABILITIES, DEFENSES, Mam3eCreator(), Mam3eCreatorProps, SKILLS, Mam3eCreatorTotals, Mam3eDefenseKey, Mam3eDataModel (+4 more)

### Community 56 - "SRD Manifest Generator"
Cohesion: 0.13
Nodes (32): getBackgroundFixedToolProficiencies(), getBackgroundLanguageOptions(), getBackgroundToolChoiceSlots(), getDnd5eTemplateChoiceState(), applyDnd5eSpeciesTemplate(), buildAbilityChoiceSlots(), buildSpeciesFeatures(), choiceAbilityBonuses() (+24 more)

### Community 57 - "Daggerheart Combatant Builders"
Cohesion: 0.13
Nodes (19): Tabs, TabsContent, TabsContentProps, TabsContext, TabsContextValue, TabsList, TabsProps, TabsTrigger (+11 more)

### Community 58 - "AI Gateway Adapters"
Cohesion: 0.13
Nodes (23): aiFailure, AiFailureCode, AiResponse, GatewayContext, GatewayTimeoutError, handleAiRequest(), repairCountOf(), RFC-002 (+15 more)

### Community 59 - "AI Gateway Contracts"
Cohesion: 0.15
Nodes (24): AI_GATEWAY_SCHEMA_VERSION, AiParse, AiSuccess, AiUsage, EncounterDraftRequest, IdentifyCreatureRequest, IllustrateSceneRequest, isAiTask() (+16 more)

### Community 60 - "System Definitions & Types"
Cohesion: 0.17
Nodes (11): AI_GATEWAY_ENDPOINT, AiRequest, isAiResponse(), SceneNarrationData, callAiGateway(), isAiEnabled(), NarrateSceneParams, narrateSceneWithAi() (+3 more)

### Community 61 - "D20 Legacy Spell Slots"
Cohesion: 0.14
Nodes (13): availableDnd5eToggles(), presentDerivedQuantities(), Dnd5e2024Sheet(), DND5E_DERIVED_QUANTITIES, Dnd5eSheetBase(), DND5E_ABILITY_NAMES, DND5E_SKILL_NAMES, DND5E_SKILLS (+5 more)

### Community 62 - "SRD Coverage Script"
Cohesion: 0.10
Nodes (34): cats5e2014, cats5e2024, CoverageTarget, csvRows(), extractJsArray(), extractNameValues(), fetchCsvNames(), fetchJsArrayNames() (+26 more)

### Community 63 - "ESLint Config"
Cohesion: 0.05
Nodes (39): jsx, env, browser, es2021, node, extends, ignorePatterns, overrides (+31 more)

### Community 64 - "Spells Tab Components"
Cohesion: 0.11
Nodes (20): Props, Pf2eSpellsTab, Pf2eSpellsTabComponent, Props, Pf2eSpellcasting, focusPulseSpell, PF2E_DERIVED_TRAITS, PF2E_SCHOOL_TRAITS (+12 more)

### Community 65 - "Browser Compat & Error Logging"
Cohesion: 0.11
Nodes (24): RFC-004, Props, State, LegalNotices(), LegalNoticesProps, licenseTexts, LibraryBestiaryView(), LoadState (+16 more)

### Community 66 - "AI Gateway Client"
Cohesion: 0.18
Nodes (17): AbilityScoreGrid(), buildPointBuyDraft(), buildStandardArrayDraft(), clampPointBuyScore(), emptyPointBuyDraft(), emptyStandardArrayDraft(), isStandardArrayComplete(), isValidPointBuyDraft() (+9 more)

### Community 67 - "2024 Monster Data Encoder"
Cohesion: 0.16
Nodes (23): ABILITIES, ALIGNMENTS, bucketFor(), classifyImmunityList(), cleanProse(), CR_FRACTIONS, CREATURE_TYPES, DAMAGE_TYPES (+15 more)

### Community 68 - "Character Effects Compilation"
Cohesion: 0.17
Nodes (10): createDefaultDaggerheartData(), DaggerheartDataModel, DaggerheartEngine, TEST_DATE, baseV2Document, NOTE: localStorage spies survive vi.restoreAllMocks in jsdom — restore manually., NOTE: localStorage spies survive vi.restoreAllMocks in jsdom — restore manually., makeDoc() (+2 more)

### Community 69 - "TypeScript Config"
Cohesion: 0.07
Nodes (28): ES2020, ./src/*, compilerOptions, allowImportingTsExtensions, baseUrl, forceConsistentCasingInFileNames, isolatedModules, jsx (+20 more)

### Community 70 - "Mam Character Sheet Tabs"
Cohesion: 0.12
Nodes (23): MUTATION_ANCHORS, MutationAnchor, applyDemotion(), DO_MUTATE, DO_WRITE, escapeRe(), evaluateMutation(), evaluateTierA() (+15 more)

### Community 71 - "Monster Stat Block & Status"
Cohesion: 0.16
Nodes (17): tierBonus(), CREATURE_XP_BY_LEVEL_DIFF, pf2eAttackModifier(), pf2eCreatureXP(), Pf2eDegree, pf2eDyingAfterRecovery(), pf2eEncounterBudget(), pf2eInitialDying() (+9 more)

### Community 72 - "Dice Panel & Mam3e Resolution"
Cohesion: 0.13
Nodes (11): rateLimiterFromEnv(), createGeminiAdapter(), IMAGE_TASKS, TASK_SCHEMAS, createConsoleLogSink(), createRateLimiter(), RateLimiter, RateLimiterOptions (+3 more)

### Community 73 - "System Validation Logic"
Cohesion: 0.21
Nodes (23): ABILITY_SCORE_IDS, addIssue(), createDnd5eValidator(), Dnd5eValidationData, Dnd5eValidationDataModel, featureOptionKey(), isIntegerInRange(), loadValidationData() (+15 more)

### Community 74 - "Spell Catalog Consistency Tests"
Cohesion: 0.16
Nodes (14): ExpectedSpellIdentity, iconicSpellExpectations, SystemKey, systems, dedupeById(), Identified, indexById(), warnDuplicateId() (+6 more)

### Community 75 - "Dnd5e Resource Loading Hooks"
Cohesion: 0.11
Nodes (25): EMPTY_WEAPON_LOADOUT, GetDaggerheartSheetStateProps, matchesQuery(), UseDaggerheartMutationHandlersProps, UseDaggerheartTemplateHandlersProps, DaggerheartAdversaryRole, DaggerheartAncestry, DaggerheartArmor (+17 more)

### Community 76 - "Mam Powers & Cost Ledger"
Cohesion: 0.19
Nodes (10): MamAdvantageBrowserTab(), Props, MamComplicationBrowser, MamComplicationsTabComponent, Props, MamResourceLoadError(), Props, Advantage (+2 more)

### Community 77 - "Sync Engine Tests"
Cohesion: 0.13
Nodes (14): ABILITIES, DEFENSES, MamAbilitiesTab(), Props, MamHeader(), Props, MamNotesTab(), Props (+6 more)

### Community 78 - "Dnd5e Feature Options"
Cohesion: 0.08
Nodes (42): Dnd5eFeatureOptionsSection(), Dnd5eFeatureOptionsSectionComponent, FeatureOptionBrowser, FeatureOptionBrowserProps, featureOptionSelectionKey(), Props, FeatureOptionBrowser(), FeatureOptionBrowserProps (+34 more)

### Community 79 - "Document Migrations & Storage"
Cohesion: 0.07
Nodes (50): ToastContext, ToastContextValue, ToastItem, ToastProvider(), VARIANT_ICONS, VARIANT_STYLES, cloneDocumentsSnapshot(), documentsChanged() (+42 more)

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
Nodes (24): useLazyResource(), useSystemOptions(), useD20LegacySheetResources(), UseD20LegacySheetResourcesProps, Pf2eArchetypesTab(), Props, Pf2eEquipmentBrowserTab, Pf2eFeatBrowserTab (+16 more)

### Community 87 - "Pf2e Engine & Constants"
Cohesion: 0.09
Nodes (20): GapLedgerItem, LedgerPhase, LedgerStatus, LedgerTag, LedgerTrack, MASTER_GAP_LEDGER, RFC-003, byPhase (+12 more)

### Community 88 - "Documents Hook & Persistence"
Cohesion: 0.16
Nodes (22): SceneCombatStats, buildDaggerheartAdversaryCombatant(), buildMam3eCombatant(), actionReachCells(), ATTACK_COUNT_WORDS, averageDie(), buildMonsterCombatant(), dieFaces() (+14 more)

### Community 89 - "Daggerheart Contribution Ledger"
Cohesion: 0.07
Nodes (55): buildDaggerheartCombatant(), BuildDaggerheartCombatantResult, DaggerheartCombatant, RANGE_CELLS, ANCESTRY_ADJUSTMENTS_BY_ID, ancestryByName, classByName, DAGGERHEART_TIER_BREAKPOINTS (+47 more)

### Community 90 - "Dnd35e/Pf1e Derived Math"
Cohesion: 0.09
Nodes (32): ProficiencyListSection(), Props, D20FeatBrowserTabComponent, FeatBrowser, Props, BrowserFeat, Dnd5eFeatBrowserTabComponent, FeatBrowser (+24 more)

### Community 91 - "Mam Browser Tabs"
Cohesion: 0.16
Nodes (15): mam3eAfflictionDC(), mam3eAttackDC(), mam3eAttackHits(), mam3eCriticalDC(), mam3eDamageResistanceDC(), mam3eDegreesOfFailure(), mam3eDegreesOfSuccess(), mam3eEquipmentPoints() (+7 more)

### Community 92 - "Pf2e Derived Math"
Cohesion: 0.31
Nodes (9): clampDaggerheartInventoryQuantity(), daggerheartInventoryDefinitions, findDaggerheartInventoryDefinitionByName(), getDaggerheartInventoryDefinition(), inventoryDefinitionById, inventoryDefinitionByName, normalizeDaggerheartCurrency(), normalizeInteger() (+1 more)

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
Cohesion: 0.18
Nodes (10): AiTask, AiProviderAdapter, createMockAdapter(), RFC-002, AiProviderId, ProviderFactoryDeps, ProviderFactoryEnv, selectAiProvider() (+2 more)

### Community 97 - "Mam3e Derived Math"
Cohesion: 0.05
Nodes (54): react, IllustrateSceneResult, AppContent(), buildNewCharacterDocument(), cloneSystemData(), LegalNotices, SceneManager, STORAGE_WARNING_THRESHOLD (+46 more)

### Community 98 - "Doc Drift Tests"
Cohesion: 0.18
Nodes (4): OUTCOME_DIR, RunFn, SystemOutcome, SYSTEMS

### Community 99 - "Spell Catalog Parity Tests"
Cohesion: 0.11
Nodes (5): DND35E_SOURCE_BLOCKED_SPELL_IDS, fieldCoverageBaselines, PF1E_SOURCE_ROWS_WITHOUT_SAVING_THROW, SpellModule, spellModules

### Community 100 - "Pf2e Spell Types & Traits"
Cohesion: 0.11
Nodes (21): CombatStatCard(), Props, Props, SheetHeader(), PresentedDerivedQuantity, D20DerivedStats(), DERIVED_ICON_BY_NAME, derivedIcon() (+13 more)

### Community 101 - "Document Storage (IndexedDB)"
Cohesion: 0.50
Nodes (7): applyDnd5eLongRest(), applyDnd5eShortRest(), recoverAllSpellSlots(), recoverFeatures(), recoverLongRestHitDice(), recoverPactMagicSlots(), slotPool()

### Community 102 - "5e Monster Encoder"
Cohesion: 0.22
Nodes (15): ABILITY_BY_INDEX, ALIGNMENTS, bucketFor(), CREATURE_TYPES, DAMAGE_TYPES, main(), mapAction(), mapAlignment() (+7 more)

### Community 103 - "Knip Lint Config"
Cohesion: 0.08
Nodes (26): entry, ignore, ignoreBinaries, ignoreDependencies, netlify/functions/*.mts, project, rules, classMembers (+18 more)

### Community 104 - "PF2e Monster Encoder"
Cohesion: 0.08
Nodes (41): ALIGNMENT_ABBREV, bucketFor(), CREATURE_TYPES, DAMAGE_TYPES, main(), mapAttack(), normalizeName(), parseDamage() (+33 more)

### Community 105 - "AI Creature Identification"
Cohesion: 0.09
Nodes (29): useCampaignSync(), useEntitySync(), baseAuthValue, mockedClearQueuedCampaignsSnapshot, mockedClearQueuedDeletedCampaignIds, mockedDeleteRemoteCampaign, mockedFetchRemoteCampaigns, mockedGetQueuedCampaignsSnapshot (+21 more)

### Community 107 - "Oracle Panel & Logic"
Cohesion: 0.27
Nodes (13): CharacterCard(), makeDoc(), now, renderCard(), asNumber(), asRecord(), asString(), getClassLabel() (+5 more)

### Community 108 - "5e Equipment Tab"
Cohesion: 0.43
Nodes (5): getEditableTarget(), KeyboardShortcut, useKeyboardNavigation(), Harness(), HarnessProps

### Community 109 - "Scene Reaction Panel"
Cohesion: 0.23
Nodes (14): compareSpells(), D20SpellsTab(), formatSpellLevel(), Props, titleCase(), buildSpellPreparationConcepts(), compareSpellEntries(), dedupeSpellIds() (+6 more)

### Community 110 - "Document Signature Hashing"
Cohesion: 0.07
Nodes (29): CR_XP_TABLE, formatChallengeRating(), MonsterBrowser(), MonsterBrowserProps, MonsterStatBlockProps, DraftEncounterParams, GeneratedNpc, generateNpc() (+21 more)

### Community 111 - "Resource Pool Tracking"
Cohesion: 0.31
Nodes (6): GeneratedImageData, IllustrateGatewayCall, IllustrateSceneParams, illustrateSceneWithAi(), RFC-002, image

### Community 112 - "Bundle Size Check"
Cohesion: 0.10
Nodes (15): appChunk, appChunks, assetsDir, budgets, chunks, dataChunks, distDir, eagerChunkNames (+7 more)

### Community 113 - "AI Prompt Builders"
Cohesion: 0.29
Nodes (12): EncounterDraftPayload, IdentifyCreaturePayload, IllustrateScenePayload, SceneNarrationPayload, buildEncounterDraftPrompt(), buildIdentifyCreaturePrompt(), buildIllustrateScenePrompt(), buildPromptForTask() (+4 more)

### Community 115 - "Project Dependencies"
Cohesion: 0.09
Nodes (23): ai, @ai-sdk/google, class-variance-authority, clsx, lucide-react, dependencies, ai, @ai-sdk/google (+15 more)

### Community 116 - "3.5e Spell Encoder"
Cohesion: 0.08
Nodes (32): DEFAULT_QUICK_ROLLS, DicePanel(), DicePanelProps, formatBreakdown(), QUICK_ROLLS_BY_SYSTEM, DISPOSITION_BADGE, DISPOSITION_LABEL, ReactionHistoryEntry (+24 more)

### Community 117 - "AI Encounter Draft Flow"
Cohesion: 0.14
Nodes (13): CurrencyEditor(), CurrencyEntry, DND_CURRENCIES, Props, InventoryItem, InventoryManager(), InventoryManagerProps, Currency (+5 more)

### Community 118 - "Campaign File Transfer"
Cohesion: 0.19
Nodes (19): D20SkillsTab(), Props, buildArmorClassEntries(), d20SkillCheckPenalty(), Skill, daggerheartDamageDiceCount(), DND35E_SYNERGY_SOURCES, dnd35eMaxSkillRanks() (+11 more)

### Community 119 - "MAM Archetype Browser"
Cohesion: 0.27
Nodes (11): CLASS_TOKENS, d20srdUrl(), FILES, main(), mapCastingTime(), mapDuration(), mapRange(), normalizeName() (+3 more)

### Community 120 - "PF1e Spell Encoder"
Cohesion: 0.27
Nodes (11): CLASS_COLUMNS, main(), mapCastingTime(), mapDuration(), mapRange(), RFC-4180, normalizeName(), parseCsv() (+3 more)

### Community 122 - "PF2e Archetypes Tab"
Cohesion: 0.08
Nodes (41): BuildDaggerheartAdversaryResult, DaggerheartAdversaryCombatant, RANGE_CELLS, MonsterCombatant, collectD20LegacyConditionEffects(), D20_LEGACY_CONDITION_EFFECTS, D20_LEGACY_CONDITION_NAMES, D20LegacySystemId (+33 more)

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
Cohesion: 0.22
Nodes (12): field(), main(), parseAdversary(), parseFeats(), RANGES, ROLES, slug(), srcFlag (+4 more)

### Community 127 - "Service Worker Update Banner"
Cohesion: 0.50
Nodes (3): MANUAL_EXCLUSIONS, ManualExclusion, ManifestSystemId

### Community 130 - "d20LegacySpellcasting.ts"
Cohesion: 0.08
Nodes (31): casterTypes, classResourcesNeeded, classTags, ChoiceSlot, Dnd5eSpeciesSection(), Props, GetDnd5eTemplateChoiceStateProps, formatDnd5eSpeciesToolLabel() (+23 more)

### Community 131 - "Retry With Backoff"
Cohesion: 0.17
Nodes (24): useSync(), mockedGetSupabaseClient, getSupabaseClient(), deleteRemoteDocument(), extractTombstone(), fetchRemoteDocuments(), fromRemote(), getCurrentUserId() (+16 more)

### Community 132 - "2024 Spell Encoder"
Cohesion: 0.39
Nodes (8): main(), mapCastingTime(), mapDuration(), mapRange(), normalizeName(), SCHOOLS, slug(), ts()

### Community 133 - "MAM Power Browser"
Cohesion: 0.09
Nodes (23): CombatTogglesSection(), Props, Condition, ConditionPicker(), Props, FeaturesSection(), Props, NormalizedSheet (+15 more)

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
Cohesion: 0.43
Nodes (6): DeferredInstallPromptEvent, isStandaloneMode(), readDismissedState(), usePwaInstallPrompt(), UsePwaInstallPromptOptions, writeDismissedState()

### Community 154 - "Dnd5eEquipmentTab.tsx"
Cohesion: 0.08
Nodes (26): D20EquipmentBrowserTabComponent, EquipmentBrowser, Props, CurrencyEditor, CurrencyEditorProps, Dnd5eEquipmentTabComponent, EquipmentBrowser, EquipmentBrowserItem (+18 more)

### Community 155 - "5e Movement Rules"
Cohesion: 0.21
Nodes (9): GAME_RULES, Character, sanitizeInput(), validateAttributeScore(), validateCharacter(), validateCharacterName(), validateHitPoints(), validateLevel() (+1 more)

### Community 156 - "usePwaInstallPrompt.ts"
Cohesion: 0.27
Nodes (8): EffectOperation, collectTerrainEffectsAt(), isTerrainOperation(), markerCoversCell(), markerToEffects(), normalizeStackPolicy(), TERRAIN_OPERATIONS, RFC-003

### Community 157 - "daggerheartSheetShared.tsx"
Cohesion: 0.15
Nodes (15): Badge(), BadgeProps, badgeVariants, DaggerheartDomainCardAutomation(), DaggerheartDomainCardAutomationProps, DaggerheartFeatureList(), DaggerheartFeatureListProps, DaggerheartSubclassFeatureGroup() (+7 more)

### Community 160 - "MamArchetypesTab.tsx"
Cohesion: 0.18
Nodes (14): MamConditionsTab(), Props, Mam3eConditionTrack, applyMam3eToughnessFailure(), getMam3eSheetState(), uniqueNonEmptyStrings(), createEmptyMam3eConditionTrack(), createEmptyMam3ePower() (+6 more)

### Community 161 - "PF2e Backgrounds Data"
Cohesion: 0.50
Nodes (3): Pf2eBackgroundChoice, Pf2eBackgroundDefinition, Pf2eBackgroundFeatGrant

### Community 177 - "gatewayClient.ts"
Cohesion: 0.19
Nodes (11): mod(), ABILITIES, D20AbilitiesTab(), Props, D20LegacyHeader(), Props, dnd35eLevelForXp(), Dnd5eHeaderSection() (+3 more)

### Community 179 - "featTemplate.test.ts"
Cohesion: 0.70
Nodes (4): EntitySyncAdapter, UseEntitySyncOptions, RemoteFetchResult, SyncTombstone

### Community 180 - "MamPowerBrowserTab.tsx"
Cohesion: 0.31
Nodes (8): formatMamPowerAction(), formatMamPowerDuration(), formatMamPowerRange(), humanizeMamToken(), MamPowerBrowserTabComponent, MamPowerModifierBrowser, Props, SpellBrowser

### Community 182 - "syncTombstones.ts"
Cohesion: 0.31
Nodes (11): NOW, getSyncTombstonedIds(), getSyncTombstones(), pruneExpired(), readStored(), recordSyncTombstones(), removeSyncTombstones(), STORAGE_KEYS (+3 more)

### Community 183 - "loadEquipmentForSystem"
Cohesion: 0.50
Nodes (3): Answer, Outcome, Q: where are pending debounced document saves flushed to localStorage on page hide or unload (persistence flush)

### Community 184 - "MamArchetypesTab.tsx"
Cohesion: 0.27
Nodes (7): MamArchetypeBrowser(), MamArchetypeBrowserProps, MamArchetypeBrowser, MamArchetypesTabComponent, Props, GetMam3eSheetStateProps, Mam3eArchetype

### Community 186 - "eslint-plugin-react"
Cohesion: 0.40
Nodes (4): Feat, FeatBrowser(), FeatBrowserProps, feats

### Community 190 - "index.ts"
Cohesion: 0.40
Nodes (6): applyDerivedQuantities(), ComputeLayer, DerivedDisplay, DerivedQuantityCase, DerivedQuantitySpec, RFC-003

### Community 191 - "retryWithBackoff"
Cohesion: 0.36
Nodes (8): computeBackoffMs(), isRetryableError(), NON_RETRYABLE_FRAGMENTS, PROD_DEFAULTS, RetryOptions, retryWithBackoff(), sleep(), TEST_DEFAULTS

### Community 192 - "daggerheart-engine.test.ts"
Cohesion: 0.29
Nodes (6): DaggerheartDomainCardEntry, daggerheartPassiveAuditAttributes, makeDoc(), makeDomainCardEntry(), makePassiveAuditSystem(), passiveAuditSignature()

## Knowledge Gaps
- **1178 isolated node(s):** `browser`, `es2021`, `node`, `eslint:recommended`, `plugin:@typescript-eslint/recommended` (+1173 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **20 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `Mam3e Derived Math` to `Sheet Resource Loading Hooks`, `Dnd5e Sheets & E2E Tests`, `Dnd5e Equipment & Features UI`, `MAM Power Browser`, `Tabs UI Component`, `Scene Combat Resolution`, `Dnd5e Class Templates`, `Monster & NPC Generator`, `Dnd5e Feat Templates`, `App Shell & Layout`, `Game System Selector`, `Combat & Recap Panels`, `Dnd35e Saves & Data Model`, `System Registry & Renderer`, `Equipment Browser Component`, `ServiceWorkerUpdateBanner.tsx`, `Dnd5eEquipmentTab.tsx`, `Daggerheart Inventory`, `Pf2e Character Templates`, `Dnd5e Feature List Sections`, `daggerheartSheetShared.tsx`, `Class Enhancement & Headers`, `MamArchetypesTab.tsx`, `AI Encounter Drafting`, `Quest & Session Log UI`, `Sheet Header & Stat Cards`, `Check & Oracle Resolution`, `Doc Drift Rules`, `Condition Effects by System`, `Equipped Armor Section`, `Spell Browser UI`, `Error Boundary & Auth Context`, `Encounter Builder Logic`, `Scene Management Hooks`, `Monster Combatant Builder`, `gatewayClient.ts`, `Campaign Storage & Hooks`, `featTemplate.test.ts`, `D20 Legacy Templates`, `MamPowerBrowserTab.tsx`, `D20 Class Spellcasting`, `MamArchetypesTab.tsx`, `Daggerheart Combatant Builders`, `eslint-plugin-react`, `Spell Preparation Logic`, `MamComplicationBrowser.tsx`, `ESLint Config`, `Spells Tab Components`, `Browser Compat & Error Logging`, `AI Gateway Client`, `Mam Powers & Cost Ledger`, `Sync Engine Tests`, `Dnd5e Feature Options`, `Document Migrations & Storage`, `App Header & Auth UI`, `Combat Toggles & Conditions`, `capabilityScenarios.test.tsx`, `Equipment & Feature Browsers`, `Dnd35e/Pf1e Derived Math`, `Pf2e Spell Types & Traits`, `AI Creature Identification`, `5e Equipment Tab`, `Scene Reaction Panel`, `Document Signature Hashing`, `3.5e Spell Encoder`, `AI Encounter Draft Flow`, `Campaign File Transfer`?**
  _High betweenness centrality (0.156) - this node is a cross-community bridge._
- **Why does `CharacterDocument` connect `System Registry & Renderer` to `Dnd5e Equipment & Features UI`, `Dnd5e Background Templates`, `Dnd5e2024 Engine & Hit Dice`, `MAM Power Browser`, `Daggerheart Engine`, `Tabs UI Component`, `d20LegacySpellcasting.ts`, `Scene Combat Resolution`, `Dnd5e Class Templates`, `Retry With Backoff`, `pf2eConditions.ts`, `Dnd5e Activity Definitions`, `Dnd5e Feat Templates`, `App Shell & Layout`, `D20 Combat Controls`, `Game System Selector`, `D20 Legacy System Engines`, `Dnd35e Saves & Data Model`, `Daggerheart Data Model`, `Daggerheart Inventory`, `Pf2e Character Templates`, `Dnd5e Feature List Sections`, `Encounter & Initiative Panels`, `Pf2e Sheet Tabs`, `AI Encounter Drafting`, `MamArchetypesTab.tsx`, `Quest & Session Log UI`, `Document Sync Engine`, `Check & Oracle Resolution`, `Mam3e Data Model & Engine`, `Doc Drift Rules`, `Condition Effects by System`, `Encounter Builder Logic`, `Monster Combatant Builder`, `Spell Preparation Logic`, `D20 Class Spellcasting`, `SRD Manifest Generator`, `D20 Legacy Spell Slots`, `daggerheart-engine.test.ts`, `Character Effects Compilation`, `Monster Stat Block & Status`, `System Validation Logic`, `Dnd5e Resource Loading Hooks`, `Sync Engine Tests`, `Dnd5e Feature Options`, `Document Migrations & Storage`, `Combat Toggles & Conditions`, `Boundary Validation Tests`, `Documents Hook & Persistence`, `Daggerheart Contribution Ledger`, `Mam Browser Tabs`, `Mam3e Derived Math`, `PF2e Monster Encoder`, `Oracle Panel & Logic`, `Document Signature Hashing`?**
  _High betweenness centrality (0.108) - this node is a cross-community bridge._
- **Why does `GameSystemId` connect `Class Enhancement & Headers` to `Sheet Resource Loading Hooks`, `Dnd5e Sheets & E2E Tests`, `Dnd5e Equipment & Features UI`, `MAM Power Browser`, `Tabs UI Component`, `Scene Combat Resolution`, `Dnd5e Feat Templates`, `D20 Combat Controls`, `Game System Selector`, `Dnd35e Saves & Data Model`, `System Registry & Renderer`, `5e Movement Rules`, `Roadmap Metrics Generator`, `Pf2e Sheet Tabs`, `AI Encounter Drafting`, `MamArchetypesTab.tsx`, `Quest & Session Log UI`, `Sheet Header & Stat Cards`, `Doc Drift Rules`, `Condition Effects by System`, `Encounter Builder Logic`, `Character Combatant Builder`, `SRD Coverage Script`, `Browser Compat & Error Logging`, `Equipment & Feature Browsers`, `Dnd35e/Pf1e Derived Math`, `Mam3e Derived Math`, `PF2e Archetypes Tab`?**
  _High betweenness centrality (0.057) - this node is a cross-community bridge._
- **What connects `browser`, `es2021`, `node` to the rest of the system?**
  _1178 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Sheet Resource Loading Hooks` be split into smaller, more focused modules?**
  _Cohesion score 0.05929989550679206 - nodes in this community are weakly interconnected._
- **Should `Dnd5e Sheets & E2E Tests` be split into smaller, more focused modules?**
  _Cohesion score 0.09200603318250378 - nodes in this community are weakly interconnected._
- **Should `Dnd5e Equipment & Features UI` be split into smaller, more focused modules?**
  _Cohesion score 0.06196291270918137 - nodes in this community are weakly interconnected._