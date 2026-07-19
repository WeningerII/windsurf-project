# Graph Report - windsurf-project  (2026-07-19)

## Corpus Check
- 712 files · ~497,011 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 4498 nodes · 12739 edges · 191 communities (172 shown, 19 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 102 edges (avg confidence: 0.71)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0494b769`
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
- loadEquipmentForSystem
- eslint-plugin-react
- fake-indexeddb
- knip
- MamComplicationBrowser.tsx
- @types/react
- @types/react-dom
- @vitest/coverage-v8

## God Nodes (most connected - your core abstractions)
1. `CharacterDocument` - 233 edges
2. `react` - 165 edges
3. `SystemDataModel` - 126 edges
4. `GameSystemId` - 79 edges
5. `EffectInstance` - 63 edges
6. `abilityMod()` - 55 edges
7. `makeEffectId()` - 54 edges
8. `Dnd5eDataModel` - 49 edges
9. `SystemRegistry` - 46 edges
10. `Feature` - 44 edges

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

## Communities (191 total, 19 thin omitted)

### Community 0 - "Sheet Resource Loading Hooks"
Cohesion: 0.11
Nodes (41): useDaggerheartSheetResources(), finalizeLoadedItems(), loadClassesForSystem(), loadDaggerheartAncestries(), loadDaggerheartAncestriesForSystem(), loadDaggerheartArmor(), loadDaggerheartArmorForSystem(), loadDaggerheartClasses() (+33 more)

### Community 1 - "Dnd5e Sheets & E2E Tests"
Cohesion: 0.15
Nodes (21): registryMeta, SupportMeta, {
  systemRegistryGetMock,
  loadAdvantagesForSystemMock,
  loadArchetypesForSystemMock,
  loadBackgroundsForSystemMock,
  loadClassesForSystemMock,
  loadComplicationsForSystemMock,
  loadDaggerheartAncestriesForSystemMock,
  loadDaggerheartClassesForSystemMock,
  loadDaggerheartCommunitiesForSystemMock,
  loadDaggerheartConsumablesForSystemMock,
  loadDaggerheartDomainCardsForSystemMock,
  loadDaggerheartDomainsForSystemMock,
  loadDaggerheartArmorForSystemMock,
  loadDaggerheartLootForSystemMock,
  loadDaggerheartWeaponsForSystemMock,
  loadEquipmentForSystemMock,
  loadFeatsForSystemMock,
  loadFeatureOptionsForSystemMock,
  loadMam3eArchetypesForSystemMock,
  loadMonstersForSystemMock,
  loadPf2eBackgroundsForSystemMock,
  loadPowerModifiersForSystemMock,
  loadSpeciesForSystemMock,
  loadSpellsForSystemMock,
  loadTraitsForSystemMock,
}, clearSystemCatalogSummaryCache(), loadAllSystemCatalogSummaries(), loadSystemCatalogDataLoaders(), loadSystemCatalogSummary(), systemCatalogSummaryCache (+13 more)

### Community 2 - "Dnd5e Equipment & Features UI"
Cohesion: 0.10
Nodes (40): EquippedItemsSection(), Props, SLOT_LABELS, SLOT_ORDER, NormalizedSheet, createDefaultDnd5e2024Data(), Dnd5e2024DataModel, Dnd5e2024TemplateState (+32 more)

### Community 3 - "Dnd5e Background Templates"
Cohesion: 0.06
Nodes (67): countSelections(), optionDisabledForRequirement(), resolveEquipmentSlot(), resolveFeatSelections(), toEquippedItem(), toWeaponDamage(), ABILITY_NAME_TO_ID, ABILITY_OPTIONS (+59 more)

### Community 4 - "Dnd5e2024 Engine & Hit Dice"
Cohesion: 0.07
Nodes (28): HIT_DICE, hitDieSize(), hitDieString(), Dnd5e2024Engine, hasAlertFeat(), totalCharacterLevel(), DND5E_CONDITION_NAMES, hasDnd5eCondition() (+20 more)

### Community 5 - "Daggerheart Engine"
Cohesion: 0.09
Nodes (46): applyDnd5eClassTemplate(), applyDnd5eSubclassTemplate(), assertMulticlassRequirements(), ATTRIBUTE_NAME_TO_ID, buildChoiceSlots(), buildDerivedProficiencies(), buildSpellcastingState(), canSelectSubclass() (+38 more)

### Community 6 - "3.5e Monster Data Encoder"
Cohesion: 0.16
Nodes (18): ALIGNMENTS, DICE_PROGRESSIONS, main(), mapAlignment(), mod(), MONSTER_SIZE, normalizeName(), OLIMOT_FILES (+10 more)

### Community 7 - "Tabs UI Component"
Cohesion: 0.08
Nodes (41): Tabs, TabsContent, TabsContentProps, TabsContext, TabsContextValue, TabsList, TabsProps, TabsTrigger (+33 more)

### Community 8 - "Node Runtime Bootstrap"
Cohesion: 0.09
Nodes (48): main(), runBootstrapNodeInstall(), getPinnedCommandArgs(), main(), runPinnedNpmCommand(), formatRuntimeDoctorReport(), main(), readWorkflowPinSource() (+40 more)

### Community 9 - "Scene Combat Resolution"
Cohesion: 0.05
Nodes (52): Props, SceneCreateFormProps, BuildEncounterEventsParams, appendSceneEvent(), createSceneDocument(), foldSceneEvents(), resolveSceneAction(), encounterMonsterFixtures (+44 more)

### Community 10 - "Dnd5e Class Templates"
Cohesion: 0.17
Nodes (21): MamPowersTab(), ModifierColumn(), ModifierColumnProps, buildMam3eContributionLedger(), buildMam3ePowerCostLedgerEntries(), createPowerCostEntry(), ledgerId(), calculateMam3eFinalPowerCost() (+13 more)

### Community 11 - "System Compute Registers"
Cohesion: 0.17
Nodes (15): daggerheartComputeRegister, dnd35eComputeRegister, dnd5e2014ComputeRegister, dnd5e2024ComputeRegister, COMPUTE_REGISTERS, registerForSystem(), mam3eComputeRegister, pf1eComputeRegister (+7 more)

### Community 12 - "Scene Check Panel"
Cohesion: 0.16
Nodes (12): BrowserCapabilities, checkBrowserCapabilities(), initBrowserCompat(), isBrowserSupported(), showCompatibilityWarning(), ErrorCategory, ErrorLog, ErrorLogger (+4 more)

### Community 13 - "Dnd5e Activity Definitions"
Cohesion: 0.11
Nodes (27): buildDefenseStyleActivity(), buildDivineSmiteActivities(), buildDivineSmiteActivity(), buildDnd5eActivityDefinitions(), buildUnsupportedDivineSmiteActivity(), divineSmiteSlotLevel(), Dnd5eActivityCost, Dnd5eActivityCostKind (+19 more)

### Community 14 - "Monster & NPC Generator"
Cohesion: 0.12
Nodes (25): ManifestCategory, buildSystem(), CATEGORY_LOADERS, CategoryLoader, escape(), isRecord(), Loaded, main() (+17 more)

### Community 15 - "Dnd5e Feat Templates"
Cohesion: 0.10
Nodes (22): InventoryItem, InventoryManager(), InventoryManagerProps, D20EquipmentBrowserTab, D20FeatBrowserTab, Currency, D20InventoryTab(), InventoryItem (+14 more)

### Community 16 - "App Shell & Layout"
Cohesion: 0.27
Nodes (10): mockedGetQueuedCampaignsSnapshot, mockedGetQueuedDeletedCampaignIds, mockedGetQueuedDeletedDocumentIds, mockedGetQueuedSyncSnapshot, formatDateAndTime(), formatLastSyncedAt(), formatTimeOfDay(), isPreviousLocalDay() (+2 more)

### Community 17 - "D20 Combat Controls"
Cohesion: 0.14
Nodes (24): getEligibleDnd5eFeatureOptions(), featureOptionSelectionKey(), ABILITY_TOKEN_MAP, collectAlwaysPreparedByLevelSources(), collectAlwaysPreparedGrantSources(), evaluatePreparedCasterFormula(), getDnd5eAlwaysPreparedSpellIds(), getDnd5eAlwaysPreparedSpellSources() (+16 more)

### Community 18 - "Game System Selector"
Cohesion: 0.12
Nodes (13): createDefaultDnd5eData(), Dnd5eEngine, makeDoc(), TEST_DATE, makeDoc(), makeDoc(), RFC-003, envoy (+5 more)

### Community 19 - "Combat & Recap Panels"
Cohesion: 0.18
Nodes (15): AppHeader(), assertNever(), INITIAL_NAV_STATE, LIBRARY_SEGMENTS, librarySegmentLabel(), NavAction, navReducer(), Overlay (+7 more)

### Community 20 - "D20 Legacy System Engines"
Cohesion: 0.10
Nodes (26): dnd35eAbilityIncreases(), dnd35eConcentrationDCDamage(), dnd35eConcentrationDCDefensive(), dnd35eFeatsFromLevel(), dnd35eHpState, dnd35eLevelForXp(), dnd35eTriggersMassiveDamage(), dnd35eXpForLevel() (+18 more)

### Community 21 - "Dnd35e Saves & Data Model"
Cohesion: 0.05
Nodes (63): availableD20LegacyToggles(), Props, D20Save, D20SaveId, Props, SAVE_IDS, D20LegacyData, D20LegacySpellSlots (+55 more)

### Community 22 - "Daggerheart Data Model"
Cohesion: 0.09
Nodes (33): SystemEngine, resolveCharacterEffects(), d20LegacyCheckPenalty(), rollD20(), DND35E_CLASS_CATALOG, NOTE: 3.5e class files currently lack full `spellcasting.spellSlots` tables., SKILL_ABILITIES, RFC-003 (+25 more)

### Community 23 - "System Registry & Renderer"
Cohesion: 0.05
Nodes (56): Props, CharacterCard(), CharacterCardProps, CharacterListView(), CharacterListViewProps, UseSceneEncounterParams, Props, Props (+48 more)

### Community 24 - "Game Rules & Proficiencies"
Cohesion: 0.07
Nodes (33): GAME_RULES, ArmorProficiency, ArmorProficiencyType, ArtisanToolProficiency, isValidArmorProficiency(), isValidSkillProficiency(), isValidToolProficiency(), isValidWeaponProficiency() (+25 more)

### Community 25 - "Campaign Sync Hooks"
Cohesion: 0.17
Nodes (15): categoryIcons, GameSystemSelector(), systemAccents, supportBadgeLabels, supportBadgeStyles, buildInitialSummaryStates(), categoryDisplay, SummaryState (+7 more)

### Community 26 - "Daggerheart Inventory"
Cohesion: 0.12
Nodes (27): findDaggerheartInventoryDefinitionByName(), ancestryLookup, armorLookup, buildLookup(), classLookup, communityLookup, DEFAULTS, domainCardByName (+19 more)

### Community 27 - "Pf2e Character Templates"
Cohesion: 0.11
Nodes (40): Pf2eFeat, abilityBoostValue(), ancestryFeatures(), applyAbilityAdjustments(), applyPf2eAncestryTemplate(), applyPf2eArchetypeTemplate(), applyPf2eBackgroundTemplate(), applyPf2eClassTemplate() (+32 more)

### Community 28 - "Roadmap Metrics Generator"
Cohesion: 0.09
Nodes (38): applyRepoResidentOverrides(), buildComputeCompletion(), buildContentCompletion(), buildMarkdownReport(), ComputeCompletionRow, computeMetrics(), ContentCompletionRow, createEmptyCategoryCounts() (+30 more)

### Community 29 - "Dnd5e Feature List Sections"
Cohesion: 0.05
Nodes (55): react, CurrencyEditor(), CurrencyEntry, DND_CURRENCIES, Props, DamageHealControl(), DamageHealControlProps, DiceRollButton() (+47 more)

### Community 30 - "Encounter & Initiative Panels"
Cohesion: 0.09
Nodes (36): GamingSetProficiency, MusicalInstrumentProficiency, appendInventoryFromBackground(), applyDnd5eBackgroundTemplate(), BackgroundChoiceSlot, BackgroundChoiceValue, backgroundDerivedState(), COMMON_LANGUAGE_OPTIONS (+28 more)

### Community 31 - "Class Enhancement & Headers"
Cohesion: 0.12
Nodes (22): Dnd5eEquipmentTab, Dnd5eFeatBrowserTab, Dnd5eFeaturesTab, Dnd5eMonsterBrowserTab, Dnd5eSpellsTab, useDnd5eDeferredResource(), useDnd5eSheetResources(), defaultOptions (+14 more)

### Community 32 - "Pf2e Sheet Tabs"
Cohesion: 0.15
Nodes (10): AttackEconomy, bestAttackAbility(), D20_PROFILES, D20SystemProfile, dnd5eProfile, extraAttackCount(), featureAttackEconomy(), legacyD20Profile() (+2 more)

### Community 33 - "AI Encounter Drafting"
Cohesion: 0.04
Nodes (80): draftEncounterWithAi(), identifyCreatureWithAi(), fileToAiImageInput(), readAsDataUrl(), CR_XP_TABLE, formatChallengeRating(), MonsterBrowser(), MonsterBrowserProps (+72 more)

### Community 34 - "Quest & Session Log UI"
Cohesion: 0.15
Nodes (25): QuestList(), STATUS_BADGE, STATUS_OPTIONS, DATE_FORMAT, SessionLog(), T0, T1, CampaignObjective (+17 more)

### Community 35 - "Currency & Inventory Editors"
Cohesion: 0.17
Nodes (11): SheetProps, SystemCreatorComponent, SystemCreatorProps, SystemSheetComponent, SystemValidator, ValidationReason, ValidationSeverity, makeD20LegacySheet() (+3 more)

### Community 36 - "Document Sync Engine"
Cohesion: 0.05
Nodes (105): critModelForScene(), degreeModelForScene(), resolveSceneAreaEffect(), resolveSceneAttack(), SceneAreaEffectOutcome, SceneAttackOutcome, SceneCombatStats, SceneRoundOutcome (+97 more)

### Community 37 - "Sheet Header & Stat Cards"
Cohesion: 0.15
Nodes (21): D20ClassesSection(), D20LegacyClassLevel, renderClassOptions(), d20BonusSpells(), buildD20LegacySpellSlotTotals(), countAdvancementLevels(), D20_DOMAIN_CLASS_IDS, D20_FALLBACK_CASTING_ABILITIES (+13 more)

### Community 38 - "Check & Oracle Resolution"
Cohesion: 0.15
Nodes (20): Mam3eCreator(), buildMam3eCreatorData(), DERIVATION_EPOCH, deriveMam3eCreatorTotals(), Mam3eAbilities, Mam3eAbilityKey, Mam3eCreatorTotals, Mam3ePlViolations (+12 more)

### Community 39 - "Mam3e Data Model & Engine"
Cohesion: 0.13
Nodes (18): clampTrack(), DeathSaves, DeathSavesTracker(), Props, HitDiceTracker(), Props, Props, SLOT_LEVELS (+10 more)

### Community 40 - "Doc Drift Rules"
Cohesion: 0.06
Nodes (54): DOC_DRIFT_MANIFEST, DocDriftRuleType, DocDriftSurface, DocDriftSurfaceKind, CAPABILITY_PHRASE_RULES, CapabilityPhraseRule, capitalizeSupportLevel(), COMMAND_RUNTIME_RULES (+46 more)

### Community 41 - "NPM Build Scripts"
Cohesion: 0.05
Nodes (43): scripts, bootstrap:node, build, check:bundle-size, check:compute-register, check:compute-register:mutate, check:compute-register:write, check:dead-code (+35 more)

### Community 42 - "Condition Effects by System"
Cohesion: 0.09
Nodes (27): AppContent(), buildNewCharacterDocument(), cloneSystemData(), LegalNotices, SceneManager, STORAGE_WARNING_THRESHOLD, CharacterSortOption, GuidedCreatorDialog() (+19 more)

### Community 43 - "Equipped Armor Section"
Cohesion: 0.11
Nodes (21): EquipArmorInput, EquipEntry, EquippedArmorSection(), EquipShieldInput, Props, fullPlate, leather, steelShield (+13 more)

### Community 44 - "Spell Browser UI"
Cohesion: 0.12
Nodes (26): DEFAULT_LABELS, SpellBrowser(), SpellBrowserLabels, SpellBrowserProps, SpellBrowserSpell, D20SpellBrowserPanelComponent, SpellBrowser, toSpellBrowserSpell() (+18 more)

### Community 45 - "Scene Combat Area Effects"
Cohesion: 0.17
Nodes (15): buildNotice(), FetchTarget, fetchValidated(), HTML_ENTITIES, looksLikeHtml(), main(), normalize(), noticePath (+7 more)

### Community 46 - "Error Boundary & Auth Context"
Cohesion: 0.12
Nodes (19): Mode, SignIn(), SignInProps, UserMenu(), AuthContext, clearLocalDataForAccountChange(), getLastSyncedUserId(), setLastSyncedUserId() (+11 more)

### Community 47 - "Encounter Builder Logic"
Cohesion: 0.13
Nodes (33): applyAbilityAdjustments(), applyD20LegacyClassTemplate(), applyD20LegacyRaceTemplate(), buildClassSkills(), classFeaturesUpToLevel(), classSkillOptions(), collectClassFeatureSignatures(), create35eClassLevel() (+25 more)

### Community 48 - "Scene Management Hooks"
Cohesion: 0.28
Nodes (16): useScenes(), NOW, clearSceneStorage(), collectValidScenes(), deleteScene(), hydrateScene(), hydrateSceneEvent(), importScenes() (+8 more)

### Community 49 - "Monster Combatant Builder"
Cohesion: 0.04
Nodes (89): NarrateSceneResult, CheckPanel(), CheckPanelProps, DEFAULT_SUGGESTIONS, DND5E_SKILLS, OUTCOME_BADGE, OUTCOME_LABEL, SKILL_SUGGESTIONS_BY_SYSTEM (+81 more)

### Community 50 - "D20 Legacy Templates"
Cohesion: 0.22
Nodes (23): RFC-005, getDaggerheartShortRestRecovery(), createDaggerheartInventoryEntry(), clearAllStress(), clearStress(), prepareGainHope(), repairAllArmor(), repairArmor() (+15 more)

### Community 51 - "Campaign Storage & Hooks"
Cohesion: 0.13
Nodes (25): Props, Props, CampaignManager(), useCampaigns(), UseCampaignSyncOptions, useDebouncedPersistence(), makeDoc(), hostileStorage (+17 more)

### Community 53 - "Dev Dependencies"
Cohesion: 0.05
Nodes (41): autoprefixer, eslint, eslint-config-prettier, eslint-plugin-react-hooks, eslint-plugin-react-refresh, happy-dom, devDependencies, autoprefixer (+33 more)

### Community 54 - "Character Combatant Builder"
Cohesion: 0.08
Nodes (40): buildCharacterCombatant(), BuildCharacterCombatantResult, normalizeSheet(), readArmorClass(), toMagicBonusItems(), toModifierSources(), num(), pf2eWeaponProficiency() (+32 more)

### Community 55 - "D20 Class Spellcasting"
Cohesion: 0.21
Nodes (9): MamHeader(), Props, Props, ABILITIES, Mam3eCreatorProps, Mam3eDataModel, Mam3eEngine, normalizeConditionTrack() (+1 more)

### Community 56 - "SRD Manifest Generator"
Cohesion: 0.13
Nodes (32): getBackgroundFixedToolProficiencies(), getBackgroundLanguageOptions(), getBackgroundToolChoiceSlots(), getDnd5eTemplateChoiceState(), applyDnd5eSpeciesTemplate(), buildAbilityChoiceSlots(), buildSpeciesFeatures(), choiceAbilityBonuses() (+24 more)

### Community 57 - "Daggerheart Combatant Builders"
Cohesion: 0.50
Nodes (4): ChoiceSlot, Dnd5eSpeciesSection(), Props, formatDnd5eSpeciesToolLabel()

### Community 58 - "AI Gateway Adapters"
Cohesion: 0.12
Nodes (20): createGeminiAdapter(), IMAGE_TASKS, TASK_SCHEMAS, AI_GATEWAY_SCHEMA_VERSION, aiFailure, AiResponse, AiTask, AiProviderAdapter (+12 more)

### Community 59 - "AI Gateway Contracts"
Cohesion: 0.14
Nodes (26): AI_GATEWAY_TASKS, AiFailureCode, AiParse, AiSuccess, AiUsage, EncounterDraftRequest, IdentifyCreatureRequest, IllustrateSceneRequest (+18 more)

### Community 60 - "System Definitions & Types"
Cohesion: 0.31
Nodes (5): SceneNarrationData, NarrateSceneParams, narrateSceneWithAi(), NarrationGatewayCall, RFC-002

### Community 61 - "D20 Legacy Spell Slots"
Cohesion: 0.11
Nodes (16): availableDnd5eToggles(), Dnd5e2024Sheet(), Props, Dnd5eOverviewSection(), Dnd5eWeaponMasteriesTab(), Props, Dnd5eSheetBase(), Props (+8 more)

### Community 62 - "SRD Coverage Script"
Cohesion: 0.11
Nodes (25): cats5e2014, cats5e2024, CoverageTarget, csvRows(), extractJsArray(), extractNameValues(), fetchCsvNames(), fetchJsArrayNames() (+17 more)

### Community 63 - "ESLint Config"
Cohesion: 0.05
Nodes (39): jsx, env, browser, es2021, node, extends, ignorePatterns, overrides (+31 more)

### Community 64 - "Spells Tab Components"
Cohesion: 0.13
Nodes (18): Props, Props, focusPulseSpell, PF2E_DERIVED_TRAITS, PF2E_SCHOOL_TRAITS, PF2E_TRADITIONS, AbilityScores, AreaOfEffect (+10 more)

### Community 65 - "Browser Compat & Error Logging"
Cohesion: 0.13
Nodes (19): Props, State, LegalNotices(), LegalNoticesProps, licenseTexts, MonsterStatBlock(), MonsterStatBlockProps, Card (+11 more)

### Community 66 - "AI Gateway Client"
Cohesion: 0.18
Nodes (17): AbilityScoreGrid(), buildPointBuyDraft(), buildStandardArrayDraft(), clampPointBuyScore(), emptyPointBuyDraft(), emptyStandardArrayDraft(), isStandardArrayComplete(), isValidPointBuyDraft() (+9 more)

### Community 67 - "2024 Monster Data Encoder"
Cohesion: 0.16
Nodes (23): ABILITIES, ALIGNMENTS, bucketFor(), classifyImmunityList(), cleanProse(), CR_FRACTIONS, CREATURE_TYPES, DAMAGE_TYPES (+15 more)

### Community 68 - "Character Effects Compilation"
Cohesion: 0.06
Nodes (58): Badge(), BadgeProps, badgeVariants, availablePf2eToggles(), ABILITY_NAMES, formatPf2eOptionLabel(), Pf2eAbilitiesTab(), Props (+50 more)

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
Cohesion: 0.18
Nodes (17): ability(), ALIGNMENT_ABBREV, bucketFor(), CR_FRACTIONS, CREATURE_TYPES, creatureDir, DAMAGE_TYPES, main() (+9 more)

### Community 73 - "System Validation Logic"
Cohesion: 0.20
Nodes (24): ABILITY_SCORE_IDS, addIssue(), createDnd5eValidator(), Dnd5eValidationData, Dnd5eValidationDataModel, Dnd5eValidationSystemId, featureOptionKey(), isIntegerInRange() (+16 more)

### Community 74 - "Spell Catalog Consistency Tests"
Cohesion: 0.15
Nodes (15): e(), ExpectedSpellIdentity, iconicSpellExpectations, SystemKey, systems, dedupeById(), Identified, indexById() (+7 more)

### Community 75 - "Dnd5e Resource Loading Hooks"
Cohesion: 0.10
Nodes (39): getDaggerheartAncestryAdjustments(), getDaggerheartInventoryDefinition(), ATTRIBUTES, EMPTY_WEAPON_LOADOUT, applyDaggerheartAncestryTemplate(), applyDaggerheartClassTemplate(), applyDaggerheartCommunityTemplate(), classTemplateItems() (+31 more)

### Community 76 - "Mam Powers & Cost Ledger"
Cohesion: 0.13
Nodes (14): MamAdvantageBrowserTab(), Props, MamArchetypeBrowser, MamArchetypesTabComponent, Props, MamComplicationBrowser, MamComplicationsTabComponent, Props (+6 more)

### Community 77 - "Sync Engine Tests"
Cohesion: 0.15
Nodes (13): ABILITIES, DEFENSES, MamAbilitiesTab(), Props, MamConditionsTab(), Props, MamNotesTab(), Props (+5 more)

### Community 78 - "Dnd5e Feature Options"
Cohesion: 0.13
Nodes (24): appendBulletList(), applyDnd5eFeatureOptionSelection(), ClassLevelLike, DND5E_FEATURE_OPTION_GROUP_LABELS, DND5E_FEATURE_OPTION_SOURCE_LABELS, DOMAIN_SUBCLASS_IDS, featureIdForOption(), FeatureOptionState (+16 more)

### Community 79 - "Document Migrations & Storage"
Cohesion: 0.10
Nodes (37): cloneDocumentsSnapshot(), documentsChanged(), prepareDocumentsWithEngines(), prepareDocumentWithEngine(), useDocuments(), makeStoredDocument(), setStoredDocuments(), StubTransaction (+29 more)

### Community 80 - "App Header & Auth UI"
Cohesion: 0.23
Nodes (11): AppHeaderProps, ThemeToggle(), UserMenuProps, LibrarySegment, SyncState, applyTheme(), getSystemTheme(), isTheme() (+3 more)

### Community 81 - "Combat Toggles & Conditions"
Cohesion: 0.08
Nodes (28): baseAuthValue, mockedClearQueuedDeletedDocumentIds, mockedClearQueuedSyncSnapshot, mockedDeleteRemoteDocument, mockedFetchRemoteDocuments, mockedGetQueuedDeletedDocumentIds, mockedGetQueuedSyncSnapshot, mockedGetSyncTombstonedIds (+20 more)

### Community 82 - "HP & Spell Slot Trackers"
Cohesion: 0.21
Nodes (9): EncounterDraftCandidate, EncounterDraftData, EncounterDraftSelection, DraftEncounterParams, DraftEncounterResult, GatewayCall, SelectionValidator, RFC-002 (+1 more)

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
Cohesion: 0.08
Nodes (33): GameSystemSelectorProps, useLazyResource(), useSystemOptions(), useD20LegacySheetResources(), UseD20LegacySheetResourcesProps, UseDaggerheartSheetResourcesProps, UseDnd5eDeferredResourceOptions, UseDnd5eSheetResourcesOptions (+25 more)

### Community 87 - "Pf2e Engine & Constants"
Cohesion: 0.09
Nodes (20): GapLedgerItem, LedgerPhase, LedgerStatus, LedgerTag, LedgerTrack, MASTER_GAP_LEDGER, RFC-003, byPhase (+12 more)

### Community 88 - "Documents Hook & Persistence"
Cohesion: 0.27
Nodes (15): actionReachCells(), ATTACK_COUNT_WORDS, averageDie(), buildMonsterCombatant(), dieFaces(), isMinusSign(), monsterAttackEffects(), monsterAttacksPerRound() (+7 more)

### Community 89 - "Daggerheart Contribution Ledger"
Cohesion: 0.06
Nodes (62): buildDaggerheartCombatant(), BuildDaggerheartCombatantResult, RANGE_CELLS, ANCESTRY_ADJUSTMENTS_BY_ID, ancestryByName, classByName, DAGGERHEART_TRAITS, DaggerheartAncestryAdjustments (+54 more)

### Community 90 - "Dnd35e/Pf1e Derived Math"
Cohesion: 0.11
Nodes (25): D20FeatBrowserTabComponent, FeatBrowser, Props, BrowserFeat, Dnd5eFeatBrowserTabComponent, FeatBrowser, FeatBrowserProps, Props (+17 more)

### Community 91 - "Mam Browser Tabs"
Cohesion: 0.23
Nodes (14): mam3eAfflictionDC(), mam3eAttackDC(), mam3eAttackHits(), mam3eCriticalDC(), mam3eDamageResistanceDC(), mam3eDegreesOfFailure(), mam3eDegreesOfSuccess(), mam3eEquipmentPoints() (+6 more)

### Community 92 - "Pf2e Derived Math"
Cohesion: 0.25
Nodes (9): clampDaggerheartInventoryQuantity(), daggerheartInventoryDefinitions, inventoryDefinitionById, inventoryDefinitionByName, isDaggerheartConsumableDefinition(), normalizeDaggerheartCurrency(), normalizeInteger(), DaggerheartInventorySection() (+1 more)

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
Cohesion: 0.21
Nodes (12): DEFAULT_QUICK_ROLLS, DicePanel(), DicePanelProps, formatBreakdown(), QUICK_ROLLS_BY_SYSTEM, applyKeep(), DiceRollResult, DiceTerm (+4 more)

### Community 97 - "Mam3e Derived Math"
Cohesion: 0.11
Nodes (16): ServiceWorkerUpdateBanner(), Button, ButtonProps, buttonVariants, ConfirmDialog(), Props, InputProps, OverflowMenu() (+8 more)

### Community 98 - "Doc Drift Tests"
Cohesion: 0.18
Nodes (4): OUTCOME_DIR, RunFn, SystemOutcome, SYSTEMS

### Community 99 - "Spell Catalog Parity Tests"
Cohesion: 0.11
Nodes (5): DND35E_SOURCE_BLOCKED_SPELL_IDS, fieldCoverageBaselines, PF1E_SOURCE_ROWS_WITHOUT_SAVING_THROW, SpellModule, spellModules

### Community 100 - "Pf2e Spell Types & Traits"
Cohesion: 0.20
Nodes (6): CombatStatCard(), Props, Props, SheetHeader(), Dnd5eAbilitiesTab(), Props

### Community 101 - "Document Storage (IndexedDB)"
Cohesion: 0.49
Nodes (8): applyDnd5eLongRest(), applyDnd5eShortRest(), recoverAllSpellSlots(), recoverFeatures(), recoverLongRestHitDice(), recoverPactMagicSlots(), slotPool(), reset()

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

### Community 107 - "Oracle Panel & Logic"
Cohesion: 0.28
Nodes (7): SYSTEM_IDS, getSystemAssetPrefetchStateForTests(), prefetchedSystemAssets, prefetchedSystemRuntimeData, prefetchedSystemSheets, resetSystemAssetPrefetchStateForTests(), systemAssetPrefetchers

### Community 108 - "5e Equipment Tab"
Cohesion: 0.43
Nodes (5): getEditableTarget(), KeyboardShortcut, useKeyboardNavigation(), Harness(), HarnessProps

### Community 109 - "Scene Reaction Panel"
Cohesion: 0.20
Nodes (16): compareSpells(), D20SpellsTab(), formatSpellLevel(), Props, titleCase(), D20_ARCANE_SCHOOLS, D20_LEGACY_MANUAL_NOTES, buildSpellPreparationConcepts() (+8 more)

### Community 110 - "Document Signature Hashing"
Cohesion: 0.05
Nodes (48): IllustrateSceneResult, ILLUSTRATION_STYLES, IllustrationPanel(), IllustrationPanelProps, InitiativeTracker(), InitiativeTrackerProps, terrainEffectsForPreset(), sceneConditionOptions() (+40 more)

### Community 111 - "Resource Pool Tracking"
Cohesion: 0.18
Nodes (11): AI_GATEWAY_ENDPOINT, AiRequest, GeneratedImageData, callAiGateway(), isAiEnabled(), IllustrateGatewayCall, IllustrateSceneParams, illustrateSceneWithAi() (+3 more)

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
Nodes (29): DISPOSITION_BADGE, DISPOSITION_LABEL, ReactionHistoryEntry, ReactionPanel(), ReactionPanelProps, D20Roll, DualityRoll, rollDuality() (+21 more)

### Community 117 - "AI Encounter Draft Flow"
Cohesion: 0.23
Nodes (8): AiImageInput, IdentifyCreatureData, TaskGatewayCall, IdentifyCreatureParams, IdentifyCreatureResult, IdentifyGatewayCall, RFC-002, params

### Community 118 - "Campaign File Transfer"
Cohesion: 0.11
Nodes (30): D20SkillsTab(), Props, Dnd5eTemplateState, AddEntryInput, buildAlwaysPreparedSpellEntries(), buildArmorClassEntries(), buildDnd5eContributionLedger(), buildFeatAutomationEntries() (+22 more)

### Community 119 - "MAM Archetype Browser"
Cohesion: 0.27
Nodes (11): CLASS_TOKENS, d20srdUrl(), FILES, main(), mapCastingTime(), mapDuration(), mapRange(), normalizeName() (+3 more)

### Community 120 - "PF1e Spell Encoder"
Cohesion: 0.27
Nodes (11): CLASS_COLUMNS, main(), mapCastingTime(), mapDuration(), mapRange(), RFC-4180, normalizeName(), parseCsv() (+3 more)

### Community 122 - "PF2e Archetypes Tab"
Cohesion: 0.05
Nodes (52): DND5E_SCENE_CONDITIONS, SCENE_CONDITIONS_BY_SYSTEM, collectD20LegacyConditionEffects(), D20_LEGACY_CONDITION_EFFECTS, D20_LEGACY_CONDITION_IDS, D20LegacySystemId, hasD20LegacyConditionEffects(), LegacyConditionTemplate (+44 more)

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

### Community 130 - "d20LegacySpellcasting.ts"
Cohesion: 0.09
Nodes (27): casterTypes, classResourcesNeeded, classTags, Props, AlwaysPreparedSpellGrant, CharacterClass, ClassDisplayMetadata, ClassFeatureProgression (+19 more)

### Community 131 - "Retry With Backoff"
Cohesion: 0.11
Nodes (42): Doc, useSync(), UseSyncOptions, mockedGetSupabaseClient, computeBackoffMs(), isRetryableError(), NON_RETRYABLE_FRAGMENTS, PROD_DEFAULTS (+34 more)

### Community 132 - "2024 Spell Encoder"
Cohesion: 0.39
Nodes (8): main(), mapCastingTime(), mapDuration(), mapRange(), normalizeName(), SCHOOLS, slug(), ts()

### Community 133 - "MAM Power Browser"
Cohesion: 0.06
Nodes (37): CombatTogglesSection(), Props, Condition, ConditionPicker(), Props, FeaturesSection(), Props, ProficiencyListSection() (+29 more)

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
Nodes (27): D20EquipmentBrowserTabComponent, EquipmentBrowser, Props, CurrencyEditor, CurrencyEditorProps, Dnd5eEquipmentTabComponent, EquipmentBrowser, EquipmentBrowserItem (+19 more)

### Community 155 - "5e Movement Rules"
Cohesion: 0.60
Nodes (4): dnd5eCarryingCapacity(), dnd5eHighJump(), dnd5eLongJump(), dnd5ePushDragLift()

### Community 156 - "usePwaInstallPrompt.ts"
Cohesion: 0.15
Nodes (17): MARKER_EFFECT_OPTIONS, markerEffectHelp(), MarkerEffectOption, MarkerEffectPreset, MarkerPanel(), MarkerPanelProps, terrainBadgeIcon(), collectTerrainEffectsAt() (+9 more)

### Community 157 - "daggerheartSheetShared.tsx"
Cohesion: 0.27
Nodes (9): DaggerheartDomainCardAutomation(), DaggerheartDomainCardAutomationProps, DaggerheartFeatureListProps, DaggerheartSubclassFeatureGroupProps, DOMAIN_CARD_AUTOMATION_LABELS, DOMAIN_CARD_AUTOMATION_VARIANTS, humanizeEffectTag(), DaggerheartAutomationMode (+1 more)

### Community 160 - "MamArchetypesTab.tsx"
Cohesion: 0.21
Nodes (11): MamArchetypeBrowser(), MamArchetypeBrowserProps, applyMam3eToughnessFailure(), getMam3eSheetState(), GetMam3eSheetStateProps, uniqueNonEmptyStrings(), createEmptyMam3eConditionTrack(), createEmptyMam3ePower() (+3 more)

### Community 161 - "PF2e Backgrounds Data"
Cohesion: 0.50
Nodes (3): Pf2eBackgroundChoice, Pf2eBackgroundDefinition, Pf2eBackgroundFeatGrant

### Community 177 - "gatewayClient.ts"
Cohesion: 0.33
Nodes (3): makeScene(), now, pickTextFileMock

### Community 179 - "featTemplate.test.ts"
Cohesion: 0.27
Nodes (7): DebouncedPersistence, IMPORTANT: a begun generation must end in either `persist` or, EntitySyncAdapter, UseEntitySyncOptions, debounce(), RemoteFetchResult, SyncTombstone

### Community 180 - "MamPowerBrowserTab.tsx"
Cohesion: 0.31
Nodes (8): formatMamPowerAction(), formatMamPowerDuration(), formatMamPowerRange(), humanizeMamToken(), MamPowerBrowserTabComponent, MamPowerModifierBrowser, Props, SpellBrowser

### Community 183 - "loadEquipmentForSystem"
Cohesion: 0.50
Nodes (3): Answer, Outcome, Q: where are pending debounced document saves flushed to localStorage on page hide or unload (persistence flush)

### Community 186 - "eslint-plugin-react"
Cohesion: 0.40
Nodes (4): Feat, FeatBrowser(), FeatBrowserProps, feats

## Knowledge Gaps
- **1141 isolated node(s):** `browser`, `es2021`, `node`, `eslint:recommended`, `plugin:@typescript-eslint/recommended` (+1136 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **19 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `CharacterDocument` connect `System Registry & Renderer` to `Dnd5e Equipment & Features UI`, `Retry With Backoff`, `Dnd5e2024 Engine & Hit Dice`, `Daggerheart Engine`, `Dnd5e Background Templates`, `Tabs UI Component`, `Scene Combat Resolution`, `Dnd5e Class Templates`, `pf2eConditions.ts`, `Dnd5e Activity Definitions`, `Dnd5e Feat Templates`, `D20 Combat Controls`, `Game System Selector`, `D20 Legacy System Engines`, `Dnd35e Saves & Data Model`, `Daggerheart Data Model`, `Daggerheart Inventory`, `Pf2e Character Templates`, `Dnd5e Feature List Sections`, `Encounter & Initiative Panels`, `MamArchetypesTab.tsx`, `AI Encounter Drafting`, `Currency & Inventory Editors`, `Document Sync Engine`, `Check & Oracle Resolution`, `Condition Effects by System`, `Encounter Builder Logic`, `Campaign Storage & Hooks`, `Character Combatant Builder`, `D20 Class Spellcasting`, `SRD Manifest Generator`, `D20 Legacy Spell Slots`, `Character Effects Compilation`, `Monster Stat Block & Status`, `System Validation Logic`, `Dnd5e Resource Loading Hooks`, `Sync Engine Tests`, `Dnd5e Feature Options`, `Document Migrations & Storage`, `App Header & Auth UI`, `Combat Toggles & Conditions`, `Boundary Validation Tests`, `Daggerheart Contribution Ledger`, `Mam Browser Tabs`, `Pf2e Derived Math`, `Document Signature Hashing`, `Campaign File Transfer`?**
  _High betweenness centrality (0.127) - this node is a cross-community bridge._
- **Why does `react` connect `Dnd5e Feature List Sections` to `Sheet Resource Loading Hooks`, `Dnd5e Equipment & Features UI`, `Retry With Backoff`, `Dnd5e Background Templates`, `MAM Power Browser`, `Tabs UI Component`, `Scene Combat Resolution`, `Dnd5e Class Templates`, `Monster & NPC Generator`, `Dnd5e Feat Templates`, `D20 Combat Controls`, `Combat & Recap Panels`, `Dnd35e Saves & Data Model`, `System Registry & Renderer`, `Equipment Browser Component`, `Campaign Sync Hooks`, `ServiceWorkerUpdateBanner.tsx`, `Dnd5eEquipmentTab.tsx`, `Pf2e Character Templates`, `Class Enhancement & Headers`, `MamArchetypesTab.tsx`, `AI Encounter Drafting`, `Quest & Session Log UI`, `Currency & Inventory Editors`, `Sheet Header & Stat Cards`, `Check & Oracle Resolution`, `Mam3e Data Model & Engine`, `Condition Effects by System`, `Equipped Armor Section`, `Spell Browser UI`, `Error Boundary & Auth Context`, `Scene Management Hooks`, `Monster Combatant Builder`, `D20 Legacy Templates`, `Campaign Storage & Hooks`, `featTemplate.test.ts`, `MamPowerBrowserTab.tsx`, `D20 Class Spellcasting`, `eslint-plugin-react`, `D20 Legacy Spell Slots`, `MamComplicationBrowser.tsx`, `ESLint Config`, `Browser Compat & Error Logging`, `AI Gateway Client`, `Character Effects Compilation`, `Dnd5e Resource Loading Hooks`, `Mam Powers & Cost Ledger`, `Sync Engine Tests`, `Document Migrations & Storage`, `App Header & Auth UI`, `Combat Toggles & Conditions`, `capabilityScenarios.test.tsx`, `Equipment & Feature Browsers`, `Dnd35e/Pf1e Derived Math`, `Skills Tab & Combat Math`, `Mam3e Derived Math`, `Pf2e Spell Types & Traits`, `AI Creature Identification`, `5e Equipment Tab`, `Scene Reaction Panel`, `Document Signature Hashing`, `3.5e Spell Encoder`, `Campaign File Transfer`?**
  _High betweenness centrality (0.126) - this node is a cross-community bridge._
- **Why does `GameSystemId` connect `Equipment & Feature Browsers` to `Sheet Resource Loading Hooks`, `Dnd5e Sheets & E2E Tests`, `d20LegacySpellcasting.ts`, `Dnd5e Equipment & Features UI`, `Dnd5e2024 Engine & Hit Dice`, `Tabs UI Component`, `Scene Combat Resolution`, `Monster & NPC Generator`, `Dnd5e Feat Templates`, `D20 Combat Controls`, `Dnd35e Saves & Data Model`, `System Registry & Renderer`, `Campaign Sync Hooks`, `Roadmap Metrics Generator`, `Dnd5e Feature List Sections`, `Class Enhancement & Headers`, `Pf2e Sheet Tabs`, `AI Encounter Drafting`, `Document Sync Engine`, `Sheet Header & Stat Cards`, `Doc Drift Rules`, `Condition Effects by System`, `Encounter Builder Logic`, `Character Combatant Builder`, `SRD Coverage Script`, `Character Effects Compilation`, `Dnd35e/Pf1e Derived Math`, `Oracle Panel & Logic`, `Document Signature Hashing`?**
  _High betweenness centrality (0.077) - this node is a cross-community bridge._
- **What connects `browser`, `es2021`, `node` to the rest of the system?**
  _1141 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Sheet Resource Loading Hooks` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._
- **Should `Dnd5e Sheets & E2E Tests` be split into smaller, more focused modules?**
  _Cohesion score 0.14532019704433496 - nodes in this community are weakly interconnected._
- **Should `Dnd5e Equipment & Features UI` be split into smaller, more focused modules?**
  _Cohesion score 0.10454545454545454 - nodes in this community are weakly interconnected._