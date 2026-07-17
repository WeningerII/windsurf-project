# Graph Report - windsurf-project  (2026-07-17)

## Corpus Check
- 705 files · ~491,754 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 4460 nodes · 12584 edges · 202 communities (185 shown, 17 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 102 edges (avg confidence: 0.71)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0291a0a5`
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
- resourcePool.ts
- 5e Movement Rules
- usePwaInstallPrompt.ts
- MAM Power Modifier Browser
- capabilityScenarios.test.tsx
- PF2e Backgrounds Data
- Host Size Budget Test
- Vitest Type Defs
- MAM Complications Data
- MAM Power Modifiers Data
- Vitest Coverage Config
- generate-srd-manifests.ts
- featTemplate.test.ts
- MamPowerBrowserTab.tsx
- loadEquipmentForSystem
- docDriftRules.test.ts
- loadEquipmentForSystem
- EncounterPanelProps
- eslint-plugin-react
- fake-indexeddb
- knip
- postcss
- rollup-plugin-visualizer
- Dnd5eRiderTogglesSection.tsx
- boundaryValidation.test.ts
- @types/react
- @types/react-dom
- eslint
- @vitest/coverage-v8
- eslint-plugin-react-refresh
- tailwindcss
- @testing-library/user-event
- vite-plugin-compression
- @vitest/ui

## God Nodes (most connected - your core abstractions)
1. `CharacterDocument` - 230 edges
2. `react` - 162 edges
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

## Communities (202 total, 17 thin omitted)

### Community 0 - "Sheet Resource Loading Hooks"
Cohesion: 0.08
Nodes (57): useDaggerheartSheetResources(), loadValidationData(), toIdSet(), finalizeLoadedItems(), loadBackgroundsForSystem(), loadClassesForSystem(), loadDaggerheartAdversariesForSystem(), loadDaggerheartAncestries() (+49 more)

### Community 1 - "Dnd5e Sheets & E2E Tests"
Cohesion: 0.16
Nodes (27): footprintCells(), footprintWithinGrid(), isOracleAnswer(), isOracleOdds(), ApplySceneIntentsResult, assertNever(), checkIntentIssues(), CreateSceneDocumentParams (+19 more)

### Community 2 - "Dnd5e Equipment & Features UI"
Cohesion: 0.08
Nodes (60): EquippedItemsSection(), Props, SLOT_LABELS, SLOT_ORDER, NormalizedSheet, Dnd5e2024DataModel, Dnd5e2024TemplateState, Dnd5eCondition (+52 more)

### Community 3 - "Dnd5e Background Templates"
Cohesion: 0.10
Nodes (41): ABILITY_NAME_TO_ID, ABILITY_OPTIONS, abilityAutomationFromSelections(), aggregateFeatAutomation(), applyFeatSkillSources(), buildAutomatedFeat(), ChoiceCategory, choiceRequirementFromGrant() (+33 more)

### Community 4 - "Dnd5e2024 Engine & Hit Dice"
Cohesion: 0.13
Nodes (12): HIT_DICE, hitDieSize(), hitDieString(), DND5E_CONDITION_NAMES, hasDnd5eCondition(), normalizeConditionId(), normalizeDnd5eConditions(), Dnd5eEngineBase (+4 more)

### Community 5 - "Daggerheart Engine"
Cohesion: 0.09
Nodes (42): applyDnd5eSubclassTemplate(), assertMulticlassRequirements(), ATTRIBUTE_NAME_TO_ID, buildChoiceSlots(), buildDerivedProficiencies(), buildSpellcastingState(), canSelectSubclass(), classFeaturesAtLevel() (+34 more)

### Community 6 - "3.5e Monster Data Encoder"
Cohesion: 0.09
Nodes (35): ALIGNMENTS, DICE_PROGRESSIONS, main(), mapAlignment(), mod(), MONSTER_SIZE, normalizeName(), OLIMOT_FILES (+27 more)

### Community 7 - "Tabs UI Component"
Cohesion: 0.07
Nodes (46): CurrencyEditor(), CurrencyEntry, DND_CURRENCIES, Props, Tabs, TabsContent, TabsContentProps, TabsContext (+38 more)

### Community 8 - "Node Runtime Bootstrap"
Cohesion: 0.09
Nodes (48): main(), runBootstrapNodeInstall(), getPinnedCommandArgs(), main(), runPinnedNpmCommand(), formatRuntimeDoctorReport(), main(), readWorkflowPinSource() (+40 more)

### Community 9 - "Scene Combat Resolution"
Cohesion: 0.09
Nodes (32): appendSceneEvent(), applySceneIntents(), createSceneDocument(), foldSceneEvents(), resolveSceneAction(), SceneActionOptions, makeScene(), NOW (+24 more)

### Community 10 - "Dnd5e Class Templates"
Cohesion: 0.05
Nodes (74): ABILITIES, DEFENSES, MamAbilitiesTab(), Props, MamAdvantageBrowserTab(), Props, MamConditionsTab(), Props (+66 more)

### Community 11 - "System Compute Registers"
Cohesion: 0.17
Nodes (15): daggerheartComputeRegister, dnd35eComputeRegister, dnd5e2014ComputeRegister, dnd5e2024ComputeRegister, COMPUTE_REGISTERS, registerForSystem(), mam3eComputeRegister, pf1eComputeRegister (+7 more)

### Community 12 - "Scene Check Panel"
Cohesion: 0.50
Nodes (3): ConfirmDialog(), Props, baseProps

### Community 13 - "Dnd5e Activity Definitions"
Cohesion: 0.07
Nodes (41): Dnd5eTemplateState, buildDefenseStyleActivity(), buildDivineSmiteActivities(), buildDivineSmiteActivity(), buildDnd5eActivityDefinitions(), buildUnsupportedDivineSmiteActivity(), divineSmiteSlotLevel(), Dnd5eActivityCost (+33 more)

### Community 14 - "Monster & NPC Generator"
Cohesion: 0.20
Nodes (13): Dnd5eFeatureOptionsSection(), Dnd5eFeatureOptionsSectionComponent, FeatureOptionBrowser, FeatureOptionBrowserProps, featureOptionSelectionKey(), Props, FeatureOptionBrowser(), FeatureOptionBrowserProps (+5 more)

### Community 15 - "Dnd5e Feat Templates"
Cohesion: 0.22
Nodes (8): InventoryItem, InventoryManager(), InventoryManagerProps, Currency, D20InventoryTab(), InventoryItem, Props, existingItems

### Community 16 - "App Shell & Layout"
Cohesion: 0.22
Nodes (15): mockedGetQueuedCampaignsSnapshot, mockedGetQueuedDeletedCampaignIds, mockedGetQueuedDeletedDocumentIds, mockedGetQueuedSyncSnapshot, getQueuedDeletedDocumentIds(), getQueuedSyncSnapshot(), combineSyncStates(), formatDateAndTime() (+7 more)

### Community 17 - "D20 Combat Controls"
Cohesion: 0.17
Nodes (19): ABILITY_TOKEN_MAP, collectAlwaysPreparedByLevelSources(), collectAlwaysPreparedGrantSources(), evaluatePreparedCasterFormula(), getDnd5eAlwaysPreparedSpellIds(), getDnd5eAlwaysPreparedSpellSources(), getDnd5ePreparedCasterSummaries(), getDnd5eSpellcastingClassSummaries() (+11 more)

### Community 18 - "Game System Selector"
Cohesion: 0.09
Nodes (37): categoryIcons, GameSystemSelector(), GameSystemSelectorProps, systemAccents, supportBadgeLabels, supportBadgeStyles, buildInitialSummaryStates(), categoryDisplay (+29 more)

### Community 19 - "Combat & Recap Panels"
Cohesion: 0.11
Nodes (31): SceneManager(), buildSceneCombatants(), critModelForScene(), degreeModelForScene(), factionForToken(), ResolveCombatStats, resolveSceneAreaEffect(), resolveSceneAttack() (+23 more)

### Community 20 - "D20 Legacy System Engines"
Cohesion: 0.09
Nodes (27): Dnd35eClassLevel, dnd35eAbilityIncreases(), dnd35eConcentrationDCDamage(), dnd35eConcentrationDCDefensive(), dnd35eFeatsFromLevel(), dnd35eHpState, dnd35eTriggersMassiveDamage(), dnd35eXpForLevel() (+19 more)

### Community 21 - "Dnd35e Saves & Data Model"
Cohesion: 0.06
Nodes (47): SystemEngine, Props, D20Save, D20SaveId, Props, SAVE_IDS, setD20LegacyPreparedSpell(), createDefaultDnd35eData() (+39 more)

### Community 22 - "Daggerheart Data Model"
Cohesion: 0.13
Nodes (12): createDefaultDaggerheartData(), DaggerheartDataModel, DaggerheartEngine, Props, UseDaggerheartMutationHandlersProps, UseDaggerheartSheetControllerProps, TEST_DATE, dhDoc() (+4 more)

### Community 23 - "System Registry & Renderer"
Cohesion: 0.05
Nodes (39): LegalNotices, SceneManager, STORAGE_WARNING_THRESHOLD, CharacterListView(), CharacterSortOption, SystemSheetRenderer(), SystemRegistry, SheetProps (+31 more)

### Community 24 - "Game Rules & Proficiencies"
Cohesion: 0.08
Nodes (35): ArmorProficiency, ArmorProficiencyType, ArtisanToolProficiency, GamingSetProficiency, isValidArmorProficiency(), isValidSkillProficiency(), isValidToolProficiency(), isValidWeaponProficiency() (+27 more)

### Community 25 - "Campaign Sync Hooks"
Cohesion: 0.12
Nodes (25): BuildEncounterEventsResult, buildEncounterSceneEvents(), buildInitiativeEntries(), buildOccupiedCells(), clampInteger(), compareTokenIds(), EncounterBuilderIssue, EncounterPartyMember (+17 more)

### Community 26 - "Daggerheart Inventory"
Cohesion: 0.09
Nodes (39): getDaggerheartAncestryAdjustments(), ancestryLookup, armorLookup, buildLookup(), classLookup, communityLookup, DEFAULTS, domainCardByName (+31 more)

### Community 27 - "Pf2e Character Templates"
Cohesion: 0.10
Nodes (42): abilityBoostValue(), ancestryFeatures(), applyAbilityAdjustments(), applyPf2eAncestryTemplate(), applyPf2eArchetypeTemplate(), applyPf2eBackgroundTemplate(), applyPf2eClassTemplate(), archetypeSource() (+34 more)

### Community 28 - "Roadmap Metrics Generator"
Cohesion: 0.09
Nodes (38): applyRepoResidentOverrides(), buildComputeCompletion(), buildContentCompletion(), buildMarkdownReport(), ComputeCompletionRow, computeMetrics(), ContentCompletionRow, createEmptyCategoryCounts() (+30 more)

### Community 29 - "Dnd5e Feature List Sections"
Cohesion: 0.11
Nodes (31): DiceRollButton(), DiceRollButtonProps, RollResult, ABILITIES, D20AbilitiesTab(), Props, Dnd5eSavesTab(), Props (+23 more)

### Community 30 - "Encounter & Initiative Panels"
Cohesion: 0.13
Nodes (32): getBackgroundFixedToolProficiencies(), getBackgroundLanguageOptions(), getBackgroundToolChoiceSlots(), getDnd5eTemplateChoiceState(), applyDnd5eSpeciesTemplate(), buildAbilityChoiceSlots(), buildSpeciesFeatures(), choiceAbilityBonuses() (+24 more)

### Community 31 - "Class Enhancement & Headers"
Cohesion: 0.16
Nodes (17): NewCharacterDialog(), Props, UseDaggerheartSheetResourcesProps, Dnd5eEquipmentTab, Dnd5eFeatBrowserTab, Dnd5eFeaturesTab, Dnd5eMonsterBrowserTab, Dnd5eSpellsTab (+9 more)

### Community 32 - "Pf2e Sheet Tabs"
Cohesion: 0.17
Nodes (19): Pf2eArchetypesTab(), Props, Pf2eClassLevel, Pf2eFeat, Pf2eProficiencyTier, RFC-003, getPf2eSheetChoiceState(), Pf2eChoiceSlot (+11 more)

### Community 33 - "AI Encounter Drafting"
Cohesion: 0.11
Nodes (31): identifyCreatureWithAi(), isMonsterSystemId(), RFC-006, useSceneEncounter(), EncounterMonsterSelection, summarizeEncounterPlan(), DIFFICULTY_COLUMN, draftEncounter() (+23 more)

### Community 34 - "Quest & Session Log UI"
Cohesion: 0.10
Nodes (38): Props, QuestList(), STATUS_BADGE, STATUS_OPTIONS, DATE_FORMAT, Props, SessionLog(), CampaignManager() (+30 more)

### Community 35 - "Currency & Inventory Editors"
Cohesion: 0.11
Nodes (34): CharacterEffectInputs, ResolvedCharacterEffects, compileEquipmentEffects(), equipStackPolicy(), isMeaningful(), MagicBonusItem, TYPED_STACK_SYSTEMS, compileModifierEffects() (+26 more)

### Community 36 - "Document Sync Engine"
Cohesion: 0.10
Nodes (37): SceneAreaEffectOutcome, SceneAttackOutcome, SceneRoundOutcome, isRoundConclusive(), RoundCombatant, RoundResult, RoundTurnRecord, runCombatRound() (+29 more)

### Community 37 - "Sheet Header & Stat Cards"
Cohesion: 0.06
Nodes (44): CharacterCardProps, CharacterListViewProps, Props, availableD20LegacyToggles(), BuildEncounterEventsParams, D20CombatSection(), Props, Props (+36 more)

### Community 38 - "Check & Oracle Resolution"
Cohesion: 0.10
Nodes (16): Dnd5e2024SystemDef, createDefaultDnd5eData(), Dnd5eSystemDef, Dnd5eEngine, makeDoc(), createRegistry(), TEST_DATE, makeDoc() (+8 more)

### Community 39 - "Mam3e Data Model & Engine"
Cohesion: 0.29
Nodes (9): Props, SLOT_LEVELS, SlotKey, SpellSlotTracker(), Props, emptySlots, sampleSlots, PactMagicSlots (+1 more)

### Community 40 - "Doc Drift Rules"
Cohesion: 0.13
Nodes (29): DocDriftRuleType, capitalizeSupportLevel(), DaggerheartSystemDef, Mam3eSystemDef, buildDocDriftTruth(), collectManifestCoverageTargets(), DATA_LOCAL_READMES, DocDriftIssue (+21 more)

### Community 41 - "NPM Build Scripts"
Cohesion: 0.05
Nodes (43): scripts, bootstrap:node, build, check:bundle-size, check:compute-register, check:compute-register:mutate, check:compute-register:write, check:dead-code (+35 more)

### Community 42 - "Condition Effects by System"
Cohesion: 0.08
Nodes (41): IllustrateSceneResult, NarrateSceneResult, EncounterPanel(), EncounterPanelProps, formatAverageLevel(), ILLUSTRATION_STYLES, IllustrationPanel(), IllustrationPanelProps (+33 more)

### Community 43 - "Equipped Armor Section"
Cohesion: 0.12
Nodes (22): EquipArmorInput, EquipEntry, EquippedArmorSection(), EquipShieldInput, Props, fullPlate, leather, steelShield (+14 more)

### Community 44 - "Spell Browser UI"
Cohesion: 0.12
Nodes (26): DEFAULT_LABELS, SpellBrowser(), SpellBrowserLabels, SpellBrowserProps, SpellBrowserSpell, D20SpellBrowserPanelComponent, SpellBrowser, toSpellBrowserSpell() (+18 more)

### Community 45 - "Scene Combat Area Effects"
Cohesion: 0.07
Nodes (25): CR_XP_TABLE, formatChallengeRating(), MonsterBrowser(), MonsterBrowserProps, MonsterStatBlockProps, DraftEncounterParams, Dnd5eMonsterBrowserTabComponent, MonsterBrowser (+17 more)

### Community 46 - "Error Boundary & Auth Context"
Cohesion: 0.11
Nodes (20): AuthContext, AuthContextValue, clearLocalDataForAccountChange(), getLastSyncedUserId(), setLastSyncedUserId(), AuthProvider(), AuthCallback, mockedGetSupabaseClient (+12 more)

### Community 47 - "Encounter Builder Logic"
Cohesion: 0.11
Nodes (35): applyAbilityAdjustments(), applyD20LegacyClassTemplate(), applyD20LegacyRaceTemplate(), buildClassSkills(), classFeaturesUpToLevel(), classSkillOptions(), collectClassFeatureSignatures(), create35eClassLevel() (+27 more)

### Community 48 - "Scene Management Hooks"
Cohesion: 0.13
Nodes (27): Props, UseSceneEncounterParams, Props, useScenes(), encounterMonsterFixtures, makeScene(), now, SceneHarness() (+19 more)

### Community 49 - "Monster Combatant Builder"
Cohesion: 0.16
Nodes (15): resolveCharacterEffects(), d20LegacyCheckPenalty(), DND35E_CLASS_CATALOG, NOTE: 3.5e class files currently lack full `spellcasting.spellSlots` tables., SKILL_ABILITIES, RFC-003, baseSave(), classBAB() (+7 more)

### Community 50 - "D20 Legacy Templates"
Cohesion: 0.16
Nodes (28): RFC-005, createDaggerheartInventoryEntry(), D20LegacySpellSlots, getIterativeAttackBonuses(), recoverD20LegacySpellSlot(), resetD20LegacySpellSlots(), setD20LegacySpellSlotTotal(), slotPool() (+20 more)

### Community 51 - "Campaign Storage & Hooks"
Cohesion: 0.16
Nodes (19): useCampaigns(), DebouncedPersistence, IMPORTANT: a begun generation must end in either `persist` or, useDebouncedPersistence(), hostileStorage, CAMPAIGNS_STORAGE_KEY, clearCampaignStorage(), importCampaigns() (+11 more)

### Community 52 - "Spell Preparation Logic"
Cohesion: 0.08
Nodes (21): createDefaultDnd5e2024Data(), Dnd5e2024Engine, hasAlertFeat(), totalCharacterLevel(), makeDoc(), makeDoc(), makeDoc(), make2024Doc() (+13 more)

### Community 53 - "Dev Dependencies"
Cohesion: 0.05
Nodes (41): autoprefixer, eslint-config-prettier, eslint-plugin-react, eslint-plugin-react-hooks, happy-dom, devDependencies, autoprefixer, eslint-config-prettier (+33 more)

### Community 54 - "Character Combatant Builder"
Cohesion: 0.09
Nodes (34): TargetMapping, D20_LEGACY_CONDITION_EFFECTS, D20LegacySystemId, hasD20LegacyConditionEffects(), LegacyConditionTemplate, collectD20LegacyRiderEffects(), D20LegacyRiderInputs, pf1ePowerAttackTrade() (+26 more)

### Community 55 - "D20 Class Spellcasting"
Cohesion: 0.11
Nodes (23): AttackResolution, AttackResolutionInput, resolveAttack(), rollD20(), AreaEffectInput, AreaEffectOutcome, AreaEffectResult, AttackTarget (+15 more)

### Community 56 - "SRD Manifest Generator"
Cohesion: 0.08
Nodes (32): Props, MamArchetypeBrowser(), MamArchetypeBrowserProps, MamArchetypeBrowser, MamArchetypesTab, MamArchetypesTabComponent, Props, MamComplicationBrowser (+24 more)

### Community 57 - "Daggerheart Combatant Builders"
Cohesion: 0.13
Nodes (22): availablePf2eToggles(), ABILITY_NAMES, formatPf2eOptionLabel(), Pf2eAbilitiesTab(), Props, PF2E_CONDITIONS, PF2E_VALUED_CONDITIONS, Pf2eFeatsConditionsTab() (+14 more)

### Community 58 - "AI Gateway Adapters"
Cohesion: 0.13
Nodes (18): createGeminiAdapter(), IMAGE_TASKS, TASK_SCHEMAS, AI_GATEWAY_SCHEMA_VERSION, aiFailure, AiTask, AiProviderAdapter, GatewayContext (+10 more)

### Community 59 - "AI Gateway Contracts"
Cohesion: 0.14
Nodes (26): AI_GATEWAY_TASKS, AiFailureCode, AiParse, AiSuccess, AiUsage, EncounterDraftRequest, IdentifyCreatureRequest, IllustrateSceneRequest (+18 more)

### Community 60 - "System Definitions & Types"
Cohesion: 0.13
Nodes (26): appendInventoryFromBackground(), applyDnd5eBackgroundTemplate(), BackgroundChoiceSlot, BackgroundChoiceValue, backgroundDerivedState(), COMMON_LANGUAGE_OPTIONS, Dnd5eBackgroundTemplateSelections, Dnd5eLikeDataModel (+18 more)

### Community 61 - "D20 Legacy Spell Slots"
Cohesion: 0.17
Nodes (12): Dnd5eAbilitiesTab(), Props, Dnd5eNotesTab(), Dnd5ePersonality, Props, Dnd5eTabsNavigation(), Dnd5eWeaponMasteriesTab(), Props (+4 more)

### Community 62 - "SRD Coverage Script"
Cohesion: 0.11
Nodes (25): cats5e2014, cats5e2024, CoverageTarget, csvRows(), extractJsArray(), extractNameValues(), fetchCsvNames(), fetchJsArrayNames() (+17 more)

### Community 63 - "ESLint Config"
Cohesion: 0.05
Nodes (39): jsx, env, browser, es2021, node, extends, ignorePatterns, overrides (+31 more)

### Community 64 - "Spells Tab Components"
Cohesion: 0.21
Nodes (15): compareSpells(), D20SpellsTab(), formatSpellLevel(), Props, titleCase(), D20_ARCANE_SCHOOLS, buildSpellPreparationConcepts(), compareSpellEntries() (+7 more)

### Community 65 - "Browser Compat & Error Logging"
Cohesion: 0.05
Nodes (47): ErrorBoundary, Props, State, LegalNotices(), LegalNoticesProps, licenseTexts, MonsterStatBlock(), Card (+39 more)

### Community 66 - "AI Gateway Client"
Cohesion: 0.12
Nodes (24): D20ClassesSection(), D20LegacyClassLevel, Props, renderClassOptions(), d20BonusSpells(), buildD20LegacySpellSlotTotals(), countAdvancementLevels(), D20_DOMAIN_CLASS_IDS (+16 more)

### Community 67 - "2024 Monster Data Encoder"
Cohesion: 0.16
Nodes (23): ABILITIES, ALIGNMENTS, bucketFor(), classifyImmunityList(), cleanProse(), CR_FRACTIONS, CREATURE_TYPES, DAMAGE_TYPES (+15 more)

### Community 68 - "Character Effects Compilation"
Cohesion: 0.11
Nodes (20): DOC_DRIFT_MANIFEST, DocDriftSurface, DocDriftSurfaceKind, CAPABILITY_PHRASE_RULES, CapabilityPhraseRule, COMMAND_RUNTIME_RULES, COUNT_RULES, DocDriftTruth (+12 more)

### Community 69 - "TypeScript Config"
Cohesion: 0.07
Nodes (28): ES2020, ./src/*, compilerOptions, allowImportingTsExtensions, baseUrl, forceConsistentCasingInFileNames, isolatedModules, jsx (+20 more)

### Community 70 - "Mam Character Sheet Tabs"
Cohesion: 0.12
Nodes (23): MUTATION_ANCHORS, MutationAnchor, applyDemotion(), DO_MUTATE, DO_WRITE, escapeRe(), evaluateMutation(), evaluateTierA() (+15 more)

### Community 71 - "Monster Stat Block & Status"
Cohesion: 0.16
Nodes (18): profTotal(), tierBonus(), CREATURE_XP_BY_LEVEL_DIFF, pf2eAttackModifier(), pf2eCreatureXP(), Pf2eDegree, pf2eDyingAfterRecovery(), pf2eEncounterBudget() (+10 more)

### Community 72 - "Dice Panel & Mam3e Resolution"
Cohesion: 0.08
Nodes (31): buildCharacterCombatant(), BuildCharacterCombatantResult, normalizeSheet(), readArmorClass(), toMagicBonusItems(), toModifierSources(), AttackEconomy, bestAttackAbility() (+23 more)

### Community 73 - "System Validation Logic"
Cohesion: 0.23
Nodes (21): ABILITY_SCORE_IDS, addIssue(), createDnd5eValidator(), Dnd5eValidationData, Dnd5eValidationDataModel, featureOptionKey(), isIntegerInRange(), SPELL_SLOT_LEVELS (+13 more)

### Community 74 - "Spell Catalog Consistency Tests"
Cohesion: 0.15
Nodes (17): Props, Props, ExpectedSpellIdentity, iconicSpellExpectations, SystemKey, systems, Spell, dedupeById() (+9 more)

### Community 75 - "Dnd5e Resource Loading Hooks"
Cohesion: 0.11
Nodes (31): clampDaggerheartInventoryQuantity(), daggerheartInventoryDefinitions, findDaggerheartInventoryDefinitionByName(), getDaggerheartInventoryDefinition(), inventoryDefinitionById, inventoryDefinitionByName, normalizeDaggerheartCurrency(), normalizeInteger() (+23 more)

### Community 76 - "Mam Powers & Cost Ledger"
Cohesion: 0.18
Nodes (13): SAVE_ABILITIES, SKILL_ABILITIES, getPf2eStatusPenalty(), inferPf2eCastingType(), inferPf2eTradition(), parseFixedPositiveInt(), Pf2eSpellcastingData, RFC-003 (+5 more)

### Community 77 - "Sync Engine Tests"
Cohesion: 0.19
Nodes (18): EntitySyncAdapter, useEntitySync(), UseEntitySyncOptions, Doc, UseSyncOptions, NOW, RemoteFetchResult, getSyncTombstonedIds() (+10 more)

### Community 78 - "Dnd5e Feature Options"
Cohesion: 0.17
Nodes (21): appendBulletList(), applyDnd5eFeatureOptionSelection(), ClassLevelLike, DND5E_FEATURE_OPTION_GROUP_LABELS, DND5E_FEATURE_OPTION_SOURCE_LABELS, DOMAIN_SUBCLASS_IDS, featureIdForOption(), FeatureOptionState (+13 more)

### Community 79 - "Document Migrations & Storage"
Cohesion: 0.07
Nodes (49): cloneDocumentsSnapshot(), documentsChanged(), prepareDocumentsWithEngines(), prepareDocumentWithEngine(), useDocuments(), makeStoredDocument(), setStoredDocuments(), FeatureOptionRoundtripCase (+41 more)

### Community 80 - "App Header & Auth UI"
Cohesion: 0.07
Nodes (37): react, AppHeader(), AppHeaderProps, Mode, SignIn(), SignInProps, ThemeToggle(), UserMenu() (+29 more)

### Community 81 - "Combat Toggles & Conditions"
Cohesion: 0.09
Nodes (16): baseAuthValue, mockedClearQueuedDeletedDocumentIds, mockedClearQueuedSyncSnapshot, mockedDeleteRemoteDocument, mockedFetchRemoteDocuments, mockedGetQueuedDeletedDocumentIds, mockedGetQueuedSyncSnapshot, mockedGetSyncTombstonedIds (+8 more)

### Community 82 - "HP & Spell Slot Trackers"
Cohesion: 0.21
Nodes (9): EncounterDraftData, EncounterDraftSelection, DraftEncounterParams, DraftEncounterResult, draftEncounterWithAi(), GatewayCall, SelectionValidator, RFC-002 (+1 more)

### Community 83 - "Scene Grid View"
Cohesion: 0.18
Nodes (14): daggerheartManifest, dnd35eManifest, dnd5e2014Manifest, dnd5e2024Manifest, manifestForSystem(), SRD_MANIFESTS, mam3eManifest, pf1eManifest (+6 more)

### Community 84 - "Boundary Validation Tests"
Cohesion: 0.38
Nodes (14): coerceDate(), coerceObjectives(), coerceQuests(), coerceSessionLog(), coerceStringArray(), isNonEmptyString(), isRecord(), issue() (+6 more)

### Community 85 - "capabilityScenarios.test.tsx"
Cohesion: 0.10
Nodes (19): CurrencyEditor, CurrencyEditorProps, Dnd5eEquipmentTabComponent, EquipmentBrowser, EquipmentBrowserItem, EquipmentBrowserProps, EquippedItemsSection, EquippedItemsSectionProps (+11 more)

### Community 86 - "Equipment & Feature Browsers"
Cohesion: 0.15
Nodes (15): D20EquipmentBrowserTab, D20EquipmentBrowserTabComponent, EquipmentBrowser, Props, D20FeatBrowserTab, D20FeatsTab(), countTrainedSkills(), D20InventoryCurrency (+7 more)

### Community 87 - "Pf2e Engine & Constants"
Cohesion: 0.09
Nodes (20): GapLedgerItem, LedgerPhase, LedgerStatus, LedgerTag, LedgerTrack, MASTER_GAP_LEDGER, RFC-003, byPhase (+12 more)

### Community 88 - "Documents Hook & Persistence"
Cohesion: 0.20
Nodes (18): actionReachCells(), ATTACK_COUNT_WORDS, averageDie(), buildMonsterCombatant(), dieFaces(), isMinusSign(), monsterAttackEffects(), monsterAttacksPerRound() (+10 more)

### Community 89 - "Daggerheart Contribution Ledger"
Cohesion: 0.08
Nodes (52): ANCESTRY_ADJUSTMENTS_BY_ID, ancestryByName, classByName, DAGGERHEART_TRAITS, DaggerheartAncestryAdjustments, DaggerheartRange, DEFAULT_DAGGERHEART_ANCESTRY_ADJUSTMENTS, doesDaggerheartPassiveConditionApply() (+44 more)

### Community 90 - "Dnd35e/Pf1e Derived Math"
Cohesion: 0.16
Nodes (14): D20FeatBrowserTabComponent, FeatBrowser, Props, FeatBrowser, Pf2eFeatBrowserTabComponent, Props, automatedFeat, featDefinitionsById (+6 more)

### Community 91 - "Mam Browser Tabs"
Cohesion: 0.12
Nodes (15): focusPulseSpell, PF2E_DERIVED_TRAITS, PF2E_SCHOOL_TRAITS, PF2E_TRADITIONS, AbilityScores, AreaOfEffect, Duration, Range (+7 more)

### Community 92 - "Pf2e Derived Math"
Cohesion: 0.18
Nodes (12): engine, SHIELD, TEST_DATE, CasterType, casterTypeForClass(), compute5eSpellSlots(), Compute5eSpellSlotsOptions, computePactMagicSlots() (+4 more)

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
Cohesion: 0.08
Nodes (37): DEFAULT_QUICK_ROLLS, DicePanel(), DicePanelProps, formatBreakdown(), QUICK_ROLLS_BY_SYSTEM, DISPOSITION_BADGE, DISPOSITION_LABEL, ReactionHistoryEntry (+29 more)

### Community 97 - "Mam3e Derived Math"
Cohesion: 0.38
Nodes (10): CharacterCard(), asNumber(), asRecord(), asString(), getClassLabel(), getDocumentLevelValue(), getHitPointLabel(), getLevelLabel() (+2 more)

### Community 98 - "Doc Drift Tests"
Cohesion: 0.18
Nodes (4): OUTCOME_DIR, RunFn, SystemOutcome, SYSTEMS

### Community 99 - "Spell Catalog Parity Tests"
Cohesion: 0.11
Nodes (5): DND35E_SOURCE_BLOCKED_SPELL_IDS, fieldCoverageBaselines, PF1E_SOURCE_ROWS_WITHOUT_SAVING_THROW, SpellModule, spellModules

### Community 100 - "Pf2e Spell Types & Traits"
Cohesion: 0.36
Nodes (8): computeBackoffMs(), isRetryableError(), NON_RETRYABLE_FRAGMENTS, PROD_DEFAULTS, RetryOptions, retryWithBackoff(), sleep(), TEST_DEFAULTS

### Community 101 - "Document Storage (IndexedDB)"
Cohesion: 0.20
Nodes (7): CombatStatCard(), Props, Props, SheetHeader(), Dnd5eHeaderSection(), HeaderOption, Props

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
Nodes (30): useCampaignSync(), UseCampaignSyncOptions, baseAuthValue, mockedClearQueuedCampaignsSnapshot, mockedClearQueuedDeletedCampaignIds, mockedDeleteRemoteCampaign, mockedFetchRemoteCampaigns, mockedGetQueuedCampaignsSnapshot (+22 more)

### Community 106 - "Character Card Presenter"
Cohesion: 0.18
Nodes (17): AbilityScoreGrid(), buildPointBuyDraft(), buildStandardArrayDraft(), clampPointBuyScore(), emptyPointBuyDraft(), emptyStandardArrayDraft(), isStandardArrayComplete(), isValidPointBuyDraft() (+9 more)

### Community 107 - "Oracle Panel & Logic"
Cohesion: 0.07
Nodes (36): CheckPanel(), CheckPanelProps, DEFAULT_SUGGESTIONS, DND5E_SKILLS, OUTCOME_BADGE, OUTCOME_LABEL, SKILL_SUGGESTIONS_BY_SYSTEM, CombatPanel() (+28 more)

### Community 108 - "5e Equipment Tab"
Cohesion: 0.23
Nodes (8): GAME_RULES, sanitizeInput(), validateAttributeScore(), validateCharacter(), validateCharacterName(), validateHitPoints(), validateLevel(), ValidationError

### Community 109 - "Scene Reaction Panel"
Cohesion: 0.15
Nodes (13): ToastContext, ToastContextValue, ToastItem, ToastProvider(), VARIANT_ICONS, VARIANT_STYLES, getEditableTarget(), KeyboardShortcut (+5 more)

### Community 110 - "Document Signature Hashing"
Cohesion: 0.11
Nodes (21): SceneGridViewProps, SceneCombatStats, CharacterCombatant, buildDaggerheartAdversaryCombatant(), BuildDaggerheartAdversaryResult, DaggerheartAdversaryCombatant, RANGE_CELLS, buildDaggerheartCombatant() (+13 more)

### Community 111 - "Resource Pool Tracking"
Cohesion: 0.11
Nodes (19): AI_GATEWAY_ENDPOINT, AiRequest, AiResponse, GeneratedImageData, SceneNarrationData, TaskGatewayCall, callAiGateway(), isAiEnabled() (+11 more)

### Community 112 - "Bundle Size Check"
Cohesion: 0.10
Nodes (15): appChunk, appChunks, assetsDir, budgets, chunks, dataChunks, distDir, eagerChunkNames (+7 more)

### Community 113 - "AI Prompt Builders"
Cohesion: 0.29
Nodes (12): EncounterDraftPayload, IdentifyCreaturePayload, IllustrateScenePayload, SceneNarrationPayload, buildEncounterDraftPrompt(), buildIdentifyCreaturePrompt(), buildIllustrateScenePrompt(), buildPromptForTask() (+4 more)

### Community 114 - "5e Feat Browser"
Cohesion: 0.19
Nodes (11): BrowserFeat, Dnd5eFeatBrowserTabComponent, FeatBrowser, FeatBrowserProps, Props, ProficienciesGranted, FeatAutomationState, DND5E_FEAT_COPY (+3 more)

### Community 115 - "Project Dependencies"
Cohesion: 0.09
Nodes (23): ai, @ai-sdk/google, class-variance-authority, clsx, lucide-react, dependencies, ai, @ai-sdk/google (+15 more)

### Community 116 - "3.5e Spell Encoder"
Cohesion: 0.27
Nodes (8): SYSTEM_IDS, getSystemAssetPrefetchStateForTests(), prefetchedSystemAssets, prefetchedSystemRuntimeData, prefetchedSystemSheets, prefetchSystemAssetsForIds(), resetSystemAssetPrefetchStateForTests(), systemAssetPrefetchers

### Community 117 - "AI Encounter Draft Flow"
Cohesion: 0.18
Nodes (10): AiImageInput, EncounterDraftCandidate, IdentifyCreatureData, IdentifyCreatureParams, IdentifyCreatureResult, IdentifyGatewayCall, RFC-002, fileToAiImageInput() (+2 more)

### Community 118 - "Campaign File Transfer"
Cohesion: 0.18
Nodes (18): D20SkillsTab(), Props, buildArmorClassEntries(), d20SkillCheckPenalty(), daggerheartDamageDiceCount(), DND35E_SYNERGY_SOURCES, dnd35eMaxSkillRanks(), dnd35eSkillSynergyTotal() (+10 more)

### Community 119 - "MAM Archetype Browser"
Cohesion: 0.27
Nodes (11): CLASS_TOKENS, d20srdUrl(), FILES, main(), mapCastingTime(), mapDuration(), mapRange(), normalizeName() (+3 more)

### Community 120 - "PF1e Spell Encoder"
Cohesion: 0.27
Nodes (11): CLASS_COLUMNS, main(), mapCastingTime(), mapDuration(), mapRange(), RFC-4180, normalizeName(), parseCsv() (+3 more)

### Community 122 - "PF2e Archetypes Tab"
Cohesion: 0.12
Nodes (23): DND5E_SCENE_CONDITIONS, SCENE_CONDITIONS_BY_SYSTEM, sceneConditionOptions(), collectD20LegacyConditionEffects(), D20_LEGACY_CONDITION_IDS, collectDnd5eConditionEffects(), collectPf2eConditionEffects(), ConditionScope (+15 more)

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
Cohesion: 0.31
Nodes (7): collectTerrainEffectsAt(), isTerrainOperation(), markerCoversCell(), markerToEffects(), normalizeStackPolicy(), TERRAIN_OPERATIONS, RFC-003

### Community 129 - "Daggerheart Sheet Automation"
Cohesion: 0.17
Nodes (12): resolveCheck(), resolveOracle(), applyHitPointDelta(), applySceneEvent(), buildEventFromIntent(), cloneMarker(), cloneSceneState(), cloneToken() (+4 more)

### Community 130 - "d20LegacySpellcasting.ts"
Cohesion: 0.15
Nodes (12): casterTypes, classResourcesNeeded, classTags, AlwaysPreparedSpellGrant, ClassDisplayMetadata, ClassFeatureProgression, ClassResource, ClassTag (+4 more)

### Community 131 - "Retry With Backoff"
Cohesion: 0.17
Nodes (25): useSync(), mockedGetSupabaseClient, getSupabaseClient(), deleteRemoteDocument(), extractTombstone(), fetchRemoteDocuments(), fromRemote(), getCurrentUserId() (+17 more)

### Community 132 - "2024 Spell Encoder"
Cohesion: 0.39
Nodes (8): main(), mapCastingTime(), mapDuration(), mapRange(), normalizeName(), SCHOOLS, slug(), ts()

### Community 133 - "MAM Power Browser"
Cohesion: 0.07
Nodes (24): CombatTogglesSection(), Props, FeaturesSection(), Props, ALLEGIANCE_LABEL, ALLEGIANCE_TOKEN_CLASS, buildTokenLabel(), buildTokensByCell() (+16 more)

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
Cohesion: 0.24
Nodes (9): ProficiencyListSection(), Props, ChoiceSlot, Dnd5eFeaturesTabComponent, Props, Dnd5eSelectedFeatsSection(), Props, Dnd5eFeatChoiceRequirement (+1 more)

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
Cohesion: 0.19
Nodes (12): Props, ChoiceSlot, Props, GetDnd5eTemplateChoiceStateProps, GetPf2eSheetChoiceStateProps, MulticlassProficiencies, AbilityScoreIncrease, LanguageChoice (+4 more)

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
Cohesion: 0.39
Nodes (4): ServiceWorkerUpdateBanner(), isServiceWorkerSupported(), ServiceWorkerUpdateState, useServiceWorkerUpdate()

### Community 154 - "resourcePool.ts"
Cohesion: 0.22
Nodes (8): DamageHealControl(), DamageHealControlProps, HitDiceTracker(), Props, Dnd5eOverviewSection(), HitPoints, spellSlotCount(), sampleHitDice

### Community 155 - "5e Movement Rules"
Cohesion: 0.60
Nodes (4): dnd5eCarryingCapacity(), dnd5eHighJump(), dnd5eLongJump(), dnd5ePushDragLift()

### Community 156 - "usePwaInstallPrompt.ts"
Cohesion: 0.13
Nodes (16): AppContent(), cloneSystemData(), LibraryScenesView(), useToast(), DeferredInstallPromptEvent, isStandaloneMode(), readDismissedState(), usePwaInstallPrompt() (+8 more)

### Community 157 - "MAM Power Modifier Browser"
Cohesion: 0.60
Nodes (3): clampExhaustion(), Props, RestControls()

### Community 160 - "capabilityScenarios.test.tsx"
Cohesion: 0.14
Nodes (21): useLazyResource(), useSystemOptions(), useD20LegacySheetResources(), UseD20LegacySheetResourcesProps, Pf2eEquipmentBrowserTab, Pf2eFeatBrowserTab, Pf2eSpellsTab, usePf2eSheetResources() (+13 more)

### Community 161 - "PF2e Backgrounds Data"
Cohesion: 0.50
Nodes (3): Pf2eBackgroundChoice, Pf2eBackgroundDefinition, Pf2eBackgroundFeatGrant

### Community 177 - "generate-srd-manifests.ts"
Cohesion: 0.24
Nodes (10): ManifestCategory, buildSystem(), CATEGORY_LOADERS, CategoryLoader, escape(), isRecord(), Loaded, main() (+2 more)

### Community 179 - "featTemplate.test.ts"
Cohesion: 0.27
Nodes (6): D20Roll, DualityRoll, rollD20(), rollDuality(), createLiveRng(), Rng

### Community 180 - "MamPowerBrowserTab.tsx"
Cohesion: 0.31
Nodes (8): formatMamPowerAction(), formatMamPowerDuration(), formatMamPowerRange(), humanizeMamToken(), MamPowerBrowserTabComponent, MamPowerModifierBrowser, Props, SpellBrowser

### Community 181 - "loadEquipmentForSystem"
Cohesion: 0.24
Nodes (10): DaggerheartDomainCardAutomation(), DaggerheartDomainCardAutomationProps, DaggerheartFeatureListProps, DaggerheartSubclassFeatureGroup(), DaggerheartSubclassFeatureGroupProps, DOMAIN_CARD_AUTOMATION_LABELS, DOMAIN_CARD_AUTOMATION_VARIANTS, humanizeEffectTag() (+2 more)

### Community 182 - "docDriftRules.test.ts"
Cohesion: 0.24
Nodes (7): tempDirs, BUILTIN_NPM_COMMANDS, extractDocumentedNpmCommands(), extractRepoCodePaths(), validateDocumentedNpmCommands(), validateHistoricalHeader(), validateRepoCodePaths()

### Community 183 - "loadEquipmentForSystem"
Cohesion: 0.50
Nodes (3): Answer, Outcome, Q: where are pending debounced document saves flushed to localStorage on page hide or unload (persistence flush)

### Community 184 - "EncounterPanelProps"
Cohesion: 0.33
Nodes (5): Condition, ConditionPicker(), Props, available, valued

### Community 186 - "eslint-plugin-react"
Cohesion: 0.40
Nodes (4): Feat, FeatBrowser(), FeatBrowserProps, feats

### Community 189 - "postcss"
Cohesion: 0.40
Nodes (3): charDoc(), doc(), RFC-003

### Community 190 - "rollup-plugin-visualizer"
Cohesion: 0.50
Nodes (4): clampTrack(), DeathSaves, DeathSavesTracker(), Props

### Community 191 - "Dnd5eRiderTogglesSection.tsx"
Cohesion: 0.50
Nodes (3): Dnd5eRiderTogglesSection(), Props, TOGGLE_LABELS

### Community 192 - "boundaryValidation.test.ts"
Cohesion: 0.50
Nodes (3): NOW, parseImg(), validDocInput()

## Knowledge Gaps
- **1132 isolated node(s):** `browser`, `es2021`, `node`, `eslint:recommended`, `plugin:@typescript-eslint/recommended` (+1127 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **17 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `App Header & Auth UI` to `Sheet Resource Loading Hooks`, `Dnd5e Equipment & Features UI`, `MAM Power Browser`, `Tabs UI Component`, `Dnd5e Class Templates`, `Scene Check Panel`, `pf2eSpellTraits.test.ts`, `Monster & NPC Generator`, `Dnd5e Feat Templates`, `Game System Selector`, `Dnd35e Saves & Data Model`, `System Registry & Renderer`, `Equipment Browser Component`, `ServiceWorkerUpdateBanner.tsx`, `resourcePool.ts`, `Daggerheart Inventory`, `usePwaInstallPrompt.ts`, `Dnd5e Feature List Sections`, `MAM Power Modifier Browser`, `Class Enhancement & Headers`, `capabilityScenarios.test.tsx`, `AI Encounter Drafting`, `Quest & Session Log UI`, `Pf2e Sheet Tabs`, `Pf2e Character Templates`, `Sheet Header & Stat Cards`, `Mam3e Data Model & Engine`, `Condition Effects by System`, `Equipped Armor Section`, `Spell Browser UI`, `Scene Combat Area Effects`, `Error Boundary & Auth Context`, `Scene Management Hooks`, `D20 Legacy Templates`, `Campaign Storage & Hooks`, `MamPowerBrowserTab.tsx`, `EncounterPanelProps`, `SRD Manifest Generator`, `eslint-plugin-react`, `Daggerheart Combatant Builders`, `rollup-plugin-visualizer`, `ESLint Config`, `Spells Tab Components`, `Browser Compat & Error Logging`, `AI Gateway Client`, `Dnd5eRiderTogglesSection.tsx`, `Sync Engine Tests`, `Document Migrations & Storage`, `Combat Toggles & Conditions`, `capabilityScenarios.test.tsx`, `Equipment & Feature Browsers`, `Dnd35e/Pf1e Derived Math`, `Skills Tab & Combat Math`, `Document Storage (IndexedDB)`, `AI Creature Identification`, `Character Card Presenter`, `Oracle Panel & Logic`, `Scene Reaction Panel`, `5e Feat Browser`, `Campaign File Transfer`?**
  _High betweenness centrality (0.149) - this node is a cross-community bridge._
- **Why does `CharacterDocument` connect `Sheet Header & Stat Cards` to `Dnd5e Equipment & Features UI`, `Dnd5e Background Templates`, `Dnd5e2024 Engine & Hit Dice`, `Daggerheart Engine`, `Retry With Backoff`, `Tabs UI Component`, `Dnd5e Class Templates`, `pf2eConditions.ts`, `Dnd5e Activity Definitions`, `D20 Legacy System Engines`, `Dnd35e Saves & Data Model`, `Daggerheart Data Model`, `System Registry & Renderer`, `Campaign Sync Hooks`, `Daggerheart Inventory`, `Pf2e Character Templates`, `Dnd5e Feature List Sections`, `Encounter & Initiative Panels`, `Pf2e Sheet Tabs`, `AI Encounter Drafting`, `Quest & Session Log UI`, `Check & Oracle Resolution`, `Condition Effects by System`, `Scene Combat Area Effects`, `Encounter Builder Logic`, `Scene Management Hooks`, `Monster Combatant Builder`, `Spell Preparation Logic`, `Daggerheart Combatant Builders`, `System Definitions & Types`, `D20 Legacy Spell Slots`, `postcss`, `boundaryValidation.test.ts`, `Monster Stat Block & Status`, `Dice Panel & Mam3e Resolution`, `System Validation Logic`, `Mam Powers & Cost Ledger`, `Sync Engine Tests`, `Document Migrations & Storage`, `App Header & Auth UI`, `Combat Toggles & Conditions`, `Boundary Validation Tests`, `Equipment & Feature Browsers`, `Documents Hook & Persistence`, `Daggerheart Contribution Ledger`, `Pf2e Derived Math`, `Mam3e Derived Math`, `Document Signature Hashing`, `Campaign File Transfer`?**
  _High betweenness centrality (0.106) - this node is a cross-community bridge._
- **Why does `GameSystemId` connect `Class Enhancement & Headers` to `Sheet Resource Loading Hooks`, `Dnd5e Equipment & Features UI`, `Dnd5e2024 Engine & Hit Dice`, `Tabs UI Component`, `Dnd5e Class Templates`, `Game System Selector`, `Dnd35e Saves & Data Model`, `System Registry & Renderer`, `Roadmap Metrics Generator`, `capabilityScenarios.test.tsx`, `AI Encounter Drafting`, `Pf2e Sheet Tabs`, `Currency & Inventory Editors`, `Sheet Header & Stat Cards`, `Doc Drift Rules`, `Encounter Builder Logic`, `generate-srd-manifests.ts`, `Character Combatant Builder`, `SRD Manifest Generator`, `postcss`, `SRD Coverage Script`, `AI Gateway Client`, `Character Effects Compilation`, `Dice Panel & Mam3e Resolution`, `Equipment & Feature Browsers`, `Dnd35e/Pf1e Derived Math`, `3.5e Spell Encoder`?**
  _High betweenness centrality (0.057) - this node is a cross-community bridge._
- **What connects `browser`, `es2021`, `node` to the rest of the system?**
  _1132 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Sheet Resource Loading Hooks` be split into smaller, more focused modules?**
  _Cohesion score 0.07985193019566367 - nodes in this community are weakly interconnected._
- **Should `Dnd5e Equipment & Features UI` be split into smaller, more focused modules?**
  _Cohesion score 0.07928913192071087 - nodes in this community are weakly interconnected._
- **Should `Dnd5e Background Templates` be split into smaller, more focused modules?**
  _Cohesion score 0.0975609756097561 - nodes in this community are weakly interconnected._