# Graph Report - windsurf-project  (2026-07-16)

## Corpus Check
- 700 files · ~486,703 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 4432 nodes · 12494 edges · 198 communities (179 shown, 19 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 102 edges (avg confidence: 0.71)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `245876a1`
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
- Feat Browser Component
- resourcePool.ts
- 5e Movement Rules
- contributionLedger.ts
- MAM Power Modifier Browser
- capabilityScenarios.test.tsx
- PF2e Backgrounds Data
- Host Size Budget Test
- Vitest Type Defs
- MAM Complications Data
- MAM Power Modifiers Data
- Vitest Coverage Config
- sceneTerrain.ts
- featTemplate.test.ts
- MamPowerBrowserTab.tsx
- loadEquipmentForSystem
- gatewayClient.ts
- loadEquipmentForSystem
- EncounterPanelProps
- eslint-plugin-react
- fake-indexeddb
- knip
- postcss
- rollup-plugin-visualizer
- @testing-library/jest-dom
- tsx
- @types/react
- @types/react-dom
- vitest
- @vitest/coverage-v8
- @vitest/ui

## God Nodes (most connected - your core abstractions)
1. `CharacterDocument` - 230 edges
2. `react` - 162 edges
3. `SystemDataModel` - 126 edges
4. `GameSystemId` - 79 edges
5. `EffectInstance` - 61 edges
6. `abilityMod()` - 55 edges
7. `makeEffectId()` - 54 edges
8. `Dnd5eDataModel` - 49 edges
9. `SystemRegistry` - 46 edges
10. `Feature` - 44 edges

## Surprising Connections (you probably didn't know these)
- `D20AbilitiesTab()` --indirect_call--> `mod()`  [INFERRED]
  src/systems/d20-legacy/components/D20AbilitiesTab.tsx → scripts/encode-35e-monsters.mjs
- `Pf2eAbilitiesTab()` --indirect_call--> `mod()`  [INFERRED]
  src/systems/pf2e/components/Pf2eAbilitiesTab.tsx → scripts/encode-35e-monsters.mjs
- `Dnd5eNotesTab()` --indirect_call--> `field()`  [INFERRED]
  src/systems/dnd5e/shared/components/Dnd5eNotesTab.tsx → scripts/encode-daggerheart-adversaries.mjs
- `inferAbilityChoiceRequirement()` --indirect_call--> `ability()`  [INFERRED]
  src/systems/dnd5e/shared/featTemplate.ts → scripts/encode-pf1e-monsters.mjs
- `getDnd5eSpellcastingClassSummaries()` --indirect_call--> `ability()`  [INFERRED]
  src/systems/dnd5e/shared/spellPreparation.ts → scripts/encode-pf1e-monsters.mjs

## Import Cycles
- None detected.

## Communities (198 total, 19 thin omitted)

### Community 0 - "Sheet Resource Loading Hooks"
Cohesion: 0.11
Nodes (41): useDaggerheartSheetResources(), finalizeLoadedItems(), loadClassesForSystem(), loadDaggerheartAdversariesForSystem(), loadDaggerheartAncestries(), loadDaggerheartAncestriesForSystem(), loadDaggerheartArmor(), loadDaggerheartArmorForSystem() (+33 more)

### Community 1 - "Dnd5e Sheets & E2E Tests"
Cohesion: 0.23
Nodes (9): createDefaultPf2eData(), Pf2eClassLevel, Pf2eFeat, RFC-003, makeDoc(), makeSystem(), makeDoc(), doc() (+1 more)

### Community 2 - "Dnd5e Equipment & Features UI"
Cohesion: 0.09
Nodes (39): EquippedItemsSection(), Props, SLOT_LABELS, SLOT_ORDER, createDefaultDnd5e2024Data(), Dnd5e2024DataModel, Dnd5e2024TemplateState, Dnd5e2024SystemDef (+31 more)

### Community 3 - "Dnd5e Background Templates"
Cohesion: 0.06
Nodes (61): resolveFeatSelections(), ABILITY_NAME_TO_ID, ABILITY_OPTIONS, abilityAutomationFromSelections(), aggregateFeatAutomation(), applyDnd5eFeatTemplate(), applyFeatSkillSources(), buildAutomatedFeat() (+53 more)

### Community 4 - "Dnd5e2024 Engine & Hit Dice"
Cohesion: 0.06
Nodes (38): HIT_DICE, hitDieSize(), hitDieString(), D20Roll, DualityRoll, rollD20(), rollDuality(), createLiveRng() (+30 more)

### Community 5 - "Daggerheart Engine"
Cohesion: 0.08
Nodes (47): applyDnd5eClassTemplate(), applyDnd5eSubclassTemplate(), assertMulticlassRequirements(), ATTRIBUTE_NAME_TO_ID, buildChoiceSlots(), buildDerivedProficiencies(), buildSpellcastingState(), canSelectSubclass() (+39 more)

### Community 6 - "3.5e Monster Data Encoder"
Cohesion: 0.16
Nodes (17): ALIGNMENTS, DICE_PROGRESSIONS, main(), mapAlignment(), MONSTER_SIZE, normalizeName(), OLIMOT_FILES, resolveSizeRoll() (+9 more)

### Community 7 - "Tabs UI Component"
Cohesion: 0.07
Nodes (48): Tabs, TabsContent, TabsContentProps, TabsContext, TabsContextValue, TabsList, TabsProps, TabsTrigger (+40 more)

### Community 8 - "Node Runtime Bootstrap"
Cohesion: 0.09
Nodes (48): main(), runBootstrapNodeInstall(), getPinnedCommandArgs(), main(), runPinnedNpmCommand(), formatRuntimeDoctorReport(), main(), readWorkflowPinSource() (+40 more)

### Community 9 - "Scene Combat Resolution"
Cohesion: 0.05
Nodes (77): UseSceneEncounterParams, Props, ResolveCombatStats, footprintCells(), footprintWithinGrid(), isOracleAnswer(), appendSceneEvent(), applyHitPointDelta() (+69 more)

### Community 10 - "Dnd5e Class Templates"
Cohesion: 0.13
Nodes (32): applyAbilityAdjustments(), applyD20LegacyClassTemplate(), applyD20LegacyRaceTemplate(), buildClassSkills(), classFeaturesUpToLevel(), classSkillOptions(), collectClassFeatureSignatures(), create35eClassLevel() (+24 more)

### Community 11 - "System Compute Registers"
Cohesion: 0.17
Nodes (15): daggerheartComputeRegister, dnd35eComputeRegister, dnd5e2014ComputeRegister, dnd5e2024ComputeRegister, COMPUTE_REGISTERS, registerForSystem(), mam3eComputeRegister, pf1eComputeRegister (+7 more)

### Community 12 - "Scene Check Panel"
Cohesion: 0.11
Nodes (19): ErrorBoundary, Props, State, LegalNotices(), LegalNoticesProps, licenseTexts, buildInitialSummaryStates(), categoryDisplay (+11 more)

### Community 13 - "Dnd5e Activity Definitions"
Cohesion: 0.11
Nodes (26): buildDefenseStyleActivity(), buildDivineSmiteActivities(), buildDivineSmiteActivity(), buildDnd5eActivityDefinitions(), buildUnsupportedDivineSmiteActivity(), divineSmiteSlotLevel(), Dnd5eActivityCost, Dnd5eActivityCostKind (+18 more)

### Community 14 - "Monster & NPC Generator"
Cohesion: 0.07
Nodes (41): FeaturesSection(), Props, NormalizedSheet, casterTypes, classResourcesNeeded, classTags, formatBackgroundToolLabel(), ChoiceSlot (+33 more)

### Community 15 - "Dnd5e Feat Templates"
Cohesion: 0.12
Nodes (20): D20_LEGACY_CONDITION_NAMES, D20EquipmentBrowserTab, D20EquipmentBrowserTabComponent, EquipmentBrowser, Props, D20FeatBrowserTab, D20FeatsTab(), FeatEntry (+12 more)

### Community 16 - "App Shell & Layout"
Cohesion: 0.22
Nodes (16): mockedGetQueuedCampaignsSnapshot, mockedGetQueuedDeletedCampaignIds, mockedGetQueuedDeletedDocumentIds, mockedGetQueuedSyncSnapshot, getQueuedCampaignsSnapshot(), getQueuedDeletedCampaignIds(), getQueuedDeletedDocumentIds(), getQueuedSyncSnapshot() (+8 more)

### Community 17 - "D20 Combat Controls"
Cohesion: 0.09
Nodes (16): availableDnd5eToggles(), D20LegacySheet(), Dnd5e2024Sheet(), Dnd5eSheet(), Dnd5eSheetBase(), DND5E_ABILITY_NAMES, DND5E_SKILL_NAMES, DND5E_SKILLS (+8 more)

### Community 18 - "Game System Selector"
Cohesion: 0.10
Nodes (34): categoryIcons, GameSystemSelector(), GameSystemSelectorProps, systemAccents, supportBadgeLabels, supportBadgeStyles, SummaryState, registryMeta (+26 more)

### Community 19 - "Combat & Recap Panels"
Cohesion: 0.10
Nodes (38): MamPowersTab(), ModifierColumn(), ModifierColumnProps, Props, buildMam3eContributionLedger(), buildMam3ePowerCostLedgerEntries(), createPowerCostEntry(), ledgerId() (+30 more)

### Community 20 - "D20 Legacy System Engines"
Cohesion: 0.10
Nodes (25): dnd35eAbilityIncreases(), dnd35eConcentrationDCDamage(), dnd35eConcentrationDCDefensive(), dnd35eFeatsFromLevel(), dnd35eHpState, dnd35eTriggersMassiveDamage(), dnd35eXpForLevel(), pf1eConcentrationDCDamage() (+17 more)

### Community 21 - "Dnd35e Saves & Data Model"
Cohesion: 0.06
Nodes (41): Props, D20Save, D20SaveId, Props, SAVE_IDS, makeD20LegacySheet(), createDefaultDnd35eData(), Dnd35eClassLevel (+33 more)

### Community 22 - "Daggerheart Data Model"
Cohesion: 0.16
Nodes (22): ATTRIBUTES, getDaggerheartSheetState(), GetDaggerheartSheetStateProps, matchesQuery(), UseDaggerheartTemplateHandlersProps, DaggerheartAdversaryRole, DaggerheartAncestry, DaggerheartArmor (+14 more)

### Community 23 - "System Registry & Renderer"
Cohesion: 0.07
Nodes (24): SystemRegistry, SystemDefinition, ValidationContext, ValidationResult, registerAllSystems(), Mam3eSystemDef, MockBeforeInstallPromptEvent, CreationOptions (+16 more)

### Community 24 - "Game Rules & Proficiencies"
Cohesion: 0.07
Nodes (33): GAME_RULES, ArmorProficiency, ArmorProficiencyType, GamingSetProficiency, isValidArmorProficiency(), isValidSkillProficiency(), isValidToolProficiency(), isValidWeaponProficiency() (+25 more)

### Community 25 - "Campaign Sync Hooks"
Cohesion: 0.22
Nodes (10): Pf2eProficiencyBadge(), Props, TIER_COLORS, TIER_LABELS, formatPf2eOptionLabel(), Pf2eSkillsTab(), Props, SKILL_ABILITIES (+2 more)

### Community 26 - "Daggerheart Inventory"
Cohesion: 0.12
Nodes (27): findDaggerheartInventoryDefinitionByName(), ancestryLookup, armorLookup, buildLookup(), classLookup, communityLookup, DEFAULTS, domainCardByName (+19 more)

### Community 27 - "Pf2e Character Templates"
Cohesion: 0.11
Nodes (39): abilityBoostValue(), ancestryFeatures(), applyAbilityAdjustments(), applyPf2eAncestryTemplate(), applyPf2eArchetypeTemplate(), applyPf2eBackgroundTemplate(), applyPf2eClassTemplate(), archetypeSource() (+31 more)

### Community 28 - "Roadmap Metrics Generator"
Cohesion: 0.09
Nodes (38): applyRepoResidentOverrides(), buildComputeCompletion(), buildContentCompletion(), buildMarkdownReport(), ComputeCompletionRow, computeMetrics(), ContentCompletionRow, createEmptyCategoryCounts() (+30 more)

### Community 29 - "Dnd5e Feature List Sections"
Cohesion: 0.08
Nodes (33): DamageHealControl(), DamageHealControlProps, DiceRollButton(), DiceRollButtonProps, clampExhaustion(), Props, RestControls(), RollResult (+25 more)

### Community 30 - "Encounter & Initiative Panels"
Cohesion: 0.06
Nodes (62): ArtisanToolProficiency, MusicalInstrumentProficiency, appendInventoryFromBackground(), applyDnd5eBackgroundTemplate(), BackgroundChoiceSlot, BackgroundChoiceValue, backgroundDerivedState(), COMMON_LANGUAGE_OPTIONS (+54 more)

### Community 31 - "Class Enhancement & Headers"
Cohesion: 0.14
Nodes (25): getEligibleDnd5eFeatureOptions(), applyDnd5eLongRest(), applyDnd5eShortRest(), recoverAllSpellSlots(), recoverFeatures(), recoverLongRestHitDice(), recoverPactMagicSlots(), featureOptionSelectionKey() (+17 more)

### Community 32 - "Pf2e Sheet Tabs"
Cohesion: 0.20
Nodes (16): getPf2eSheetChoiceState(), GetPf2eSheetChoiceStateProps, Pf2eChoiceSlot, countTrainedPf2eSkills(), longRestPf2eSpellcasting(), nextPf2eTier(), PF2E_TIER_ORDER, Pf2eBulkState (+8 more)

### Community 33 - "AI Encounter Drafting"
Cohesion: 0.13
Nodes (24): EncounterMonsterSelection, DIFFICULTY_COLUMN, DraftEncounterParams, DraftEncounterResult, ENCOUNTER_BUDGET_SYSTEMS, EncounterBudgetSystem, EncounterDifficulty, encounterPartyBudget() (+16 more)

### Community 34 - "Quest & Session Log UI"
Cohesion: 0.14
Nodes (25): Props, QuestList(), STATUS_BADGE, STATUS_OPTIONS, DATE_FORMAT, Props, SessionLog(), T0 (+17 more)

### Community 35 - "Currency & Inventory Editors"
Cohesion: 0.32
Nodes (5): CombatTogglesSection(), Props, Dnd5eRiderTogglesSection(), Props, TOGGLE_LABELS

### Community 36 - "Document Sync Engine"
Cohesion: 0.33
Nodes (3): makeScene(), now, pickTextFileMock

### Community 37 - "Sheet Header & Stat Cards"
Cohesion: 0.38
Nodes (4): DebouncedPersistence, IMPORTANT: a begun generation must end in either `persist` or, useDebouncedPersistence(), debounce()

### Community 38 - "Check & Oracle Resolution"
Cohesion: 0.08
Nodes (24): createDefaultDnd5eData(), Dnd5eTemplateState, Dnd5eEngine, AddEntryInput, buildAlwaysPreparedSpellEntries(), buildDnd5eContributionLedger(), buildFeatAutomationEntries(), buildListEntry() (+16 more)

### Community 39 - "Mam3e Data Model & Engine"
Cohesion: 0.14
Nodes (17): clampTrack(), DeathSaves, DeathSavesTracker(), Props, HitDiceTracker(), Props, Props, SLOT_LEVELS (+9 more)

### Community 40 - "Doc Drift Rules"
Cohesion: 0.05
Nodes (62): DOC_DRIFT_MANIFEST, DocDriftRuleType, DocDriftSurface, DocDriftSurfaceKind, CAPABILITY_PHRASE_RULES, CapabilityPhraseRule, capitalizeSupportLevel(), COMMAND_RUNTIME_RULES (+54 more)

### Community 41 - "NPM Build Scripts"
Cohesion: 0.05
Nodes (43): scripts, bootstrap:node, build, check:bundle-size, check:compute-register, check:compute-register:mutate, check:compute-register:write, check:dead-code (+35 more)

### Community 42 - "Condition Effects by System"
Cohesion: 0.06
Nodes (39): AppContent(), cloneSystemData(), LegalNotices, SceneManager, STORAGE_WARNING_THRESHOLD, CampaignManager(), CharacterListView(), CharacterSortOption (+31 more)

### Community 43 - "Equipped Armor Section"
Cohesion: 0.10
Nodes (25): EquipArmorInput, EquipEntry, EquippedArmorSection(), EquipShieldInput, Props, EquipmentBrowser, Pf2eEquipmentBrowserTabComponent, Props (+17 more)

### Community 44 - "Spell Browser UI"
Cohesion: 0.13
Nodes (24): SpellBrowser(), SpellBrowserProps, SpellBrowserSpell, D20SpellBrowserPanelComponent, SpellBrowser, toSpellBrowserSpell(), Dnd5eSpellsTabComponent, Props (+16 more)

### Community 45 - "Scene Combat Area Effects"
Cohesion: 0.10
Nodes (35): SceneAreaEffectOutcome, SceneAttackOutcome, SceneRoundOutcome, isRoundConclusive(), RoundCombatant, RoundResult, RoundTurnRecord, runCombatRound() (+27 more)

### Community 46 - "Error Boundary & Auth Context"
Cohesion: 0.12
Nodes (18): AuthContext, AuthContextValue, clearLocalDataForAccountChange(), getLastSyncedUserId(), setLastSyncedUserId(), AuthProvider(), AuthCallback, mockedGetSupabaseClient (+10 more)

### Community 47 - "Encounter Builder Logic"
Cohesion: 0.17
Nodes (15): buildNotice(), FetchTarget, fetchValidated(), HTML_ENTITIES, looksLikeHtml(), main(), normalize(), noticePath (+7 more)

### Community 48 - "Scene Management Hooks"
Cohesion: 0.23
Nodes (19): useScenes(), NOW, clearSceneStorage(), collectValidScenes(), deleteScene(), exportScenes(), hydrateScene(), hydrateSceneEvent() (+11 more)

### Community 49 - "Monster Combatant Builder"
Cohesion: 0.11
Nodes (14): MonsterStatBlock(), fullMonster, simpleMonster, VALID_DAMAGE_TYPES, SpellcastingProgression, AbilityScore, AbilityScores, Action (+6 more)

### Community 50 - "D20 Legacy Templates"
Cohesion: 0.15
Nodes (29): availableD20LegacyToggles(), Props, D20LegacyData, D20LegacySpellSlots, getIterativeAttackBonuses(), recoverD20LegacySpellSlot(), resetD20LegacySpellSlots(), setD20LegacyPreparedSpell() (+21 more)

### Community 51 - "Campaign Storage & Hooks"
Cohesion: 0.15
Nodes (22): Props, SceneCreateFormProps, useCampaigns(), makeDoc(), hostileStorage, Campaign, CAMPAIGNS_STORAGE_KEY, CampaignStorageData (+14 more)

### Community 52 - "Spell Preparation Logic"
Cohesion: 0.12
Nodes (25): ManifestCategory, buildSystem(), CATEGORY_LOADERS, CategoryLoader, escape(), isRecord(), Loaded, main() (+17 more)

### Community 53 - "Dev Dependencies"
Cohesion: 0.05
Nodes (41): autoprefixer, eslint-config-prettier, eslint-plugin-react, eslint-plugin-react-hooks, happy-dom, devDependencies, autoprefixer, eslint-config-prettier (+33 more)

### Community 54 - "Character Combatant Builder"
Cohesion: 0.08
Nodes (39): CharacterEffectInputs, ResolvedCharacterEffects, compileEquipmentEffects(), equipStackPolicy(), isMeaningful(), MagicBonusItem, TYPED_STACK_SYSTEMS, compileModifierEffects() (+31 more)

### Community 55 - "D20 Class Spellcasting"
Cohesion: 0.10
Nodes (30): react, IllustrateSceneResult, OUTCOME_BADGE, OUTCOME_LABEL, SKILL_SUGGESTIONS, EncounterPanel(), formatAverageLevel(), ILLUSTRATION_STYLES (+22 more)

### Community 56 - "SRD Manifest Generator"
Cohesion: 0.16
Nodes (15): SceneGridViewProps, SceneCombatStats, CharacterCombatant, buildDaggerheartAdversaryCombatant(), BuildDaggerheartAdversaryResult, DaggerheartAdversaryCombatant, RANGE_CELLS, DaggerheartCombatant (+7 more)

### Community 57 - "Daggerheart Combatant Builders"
Cohesion: 0.09
Nodes (30): Props, CharacterCardProps, CharacterListViewProps, Props, SystemSheetRenderer(), SystemValidator, CombatStatsSources, BuildEncounterEventsParams (+22 more)

### Community 58 - "AI Gateway Adapters"
Cohesion: 0.12
Nodes (20): createGeminiAdapter(), IMAGE_TASKS, TASK_SCHEMAS, AI_GATEWAY_SCHEMA_VERSION, aiFailure, AiResponse, AiTask, AiProviderAdapter (+12 more)

### Community 59 - "AI Gateway Contracts"
Cohesion: 0.14
Nodes (26): AI_GATEWAY_TASKS, AiFailureCode, AiParse, AiSuccess, AiUsage, EncounterDraftRequest, IdentifyCreatureRequest, IllustrateSceneRequest (+18 more)

### Community 60 - "System Definitions & Types"
Cohesion: 0.08
Nodes (22): D20FeatBrowserTabComponent, FeatBrowser, Props, CurrencyEditor, CurrencyEditorProps, Dnd5eEquipmentTabComponent, EquipmentBrowser, EquipmentBrowserItem (+14 more)

### Community 61 - "D20 Legacy Spell Slots"
Cohesion: 0.12
Nodes (27): BuildEncounterEventsResult, buildEncounterSceneEvents(), buildInitiativeEntries(), buildOccupiedCells(), clampInteger(), compareTokenIds(), EncounterBuilderIssue, EncounterPartyMember (+19 more)

### Community 62 - "SRD Coverage Script"
Cohesion: 0.11
Nodes (25): cats5e2014, cats5e2024, CoverageTarget, csvRows(), extractJsArray(), extractNameValues(), fetchCsvNames(), fetchJsArrayNames() (+17 more)

### Community 63 - "ESLint Config"
Cohesion: 0.05
Nodes (39): jsx, env, browser, es2021, node, extends, ignorePatterns, overrides (+31 more)

### Community 64 - "Spells Tab Components"
Cohesion: 0.23
Nodes (14): compareSpells(), D20SpellsTab(), formatSpellLevel(), titleCase(), D20_ARCANE_SCHOOLS, buildSpellPreparationConcepts(), compareSpellEntries(), dedupeSpellIds() (+6 more)

### Community 65 - "Browser Compat & Error Logging"
Cohesion: 0.17
Nodes (13): e(), BrowserCapabilities, checkBrowserCapabilities(), initBrowserCompat(), isBrowserSupported(), showCompatibilityWarning(), ErrorCategory, ErrorLog (+5 more)

### Community 66 - "AI Gateway Client"
Cohesion: 0.18
Nodes (12): clampDaggerheartInventoryQuantity(), createDaggerheartInventoryEntry(), daggerheartInventoryDefinitions, inventoryDefinitionById, inventoryDefinitionByName, normalizeDaggerheartCurrency(), normalizeInteger(), DomainCardEntry (+4 more)

### Community 67 - "2024 Monster Data Encoder"
Cohesion: 0.16
Nodes (23): ABILITIES, ALIGNMENTS, bucketFor(), classifyImmunityList(), cleanProse(), CR_FRACTIONS, CREATURE_TYPES, DAMAGE_TYPES (+15 more)

### Community 68 - "Character Effects Compilation"
Cohesion: 0.08
Nodes (30): buildCharacterCombatant(), BuildCharacterCombatantResult, normalizeSheet(), readArmorClass(), toMagicBonusItems(), toModifierSources(), AttackEconomy, bestAttackAbility() (+22 more)

### Community 69 - "TypeScript Config"
Cohesion: 0.07
Nodes (28): ES2020, ./src/*, compilerOptions, allowImportingTsExtensions, baseUrl, forceConsistentCasingInFileNames, isolatedModules, jsx (+20 more)

### Community 70 - "Mam Character Sheet Tabs"
Cohesion: 0.12
Nodes (23): MUTATION_ANCHORS, MutationAnchor, applyDemotion(), DO_MUTATE, DO_WRITE, escapeRe(), evaluateMutation(), evaluateTierA() (+15 more)

### Community 71 - "Monster Stat Block & Status"
Cohesion: 0.20
Nodes (7): CombatStatCard(), Props, Props, SheetHeader(), Dnd5eHeaderSection(), HeaderOption, Props

### Community 72 - "Dice Panel & Mam3e Resolution"
Cohesion: 0.10
Nodes (44): EffectInstance, AttackResolution, AttackResolutionInput, resolveAttack(), rollD20(), DaggerheartAttackInput, DaggerheartAttackResult, DaggerheartThresholds (+36 more)

### Community 73 - "System Validation Logic"
Cohesion: 0.20
Nodes (24): ABILITY_SCORE_IDS, addIssue(), createDnd5eValidator(), Dnd5eValidationData, Dnd5eValidationDataModel, Dnd5eValidationSystemId, featureOptionKey(), isIntegerInRange() (+16 more)

### Community 74 - "Spell Catalog Consistency Tests"
Cohesion: 0.16
Nodes (14): ExpectedSpellIdentity, iconicSpellExpectations, SystemKey, systems, dedupeById(), Identified, indexById(), warnDuplicateId() (+6 more)

### Community 75 - "Dnd5e Resource Loading Hooks"
Cohesion: 0.19
Nodes (15): Dnd5eEquipmentTab, Dnd5eFeatBrowserTab, Dnd5eFeaturesTab, Dnd5eMonsterBrowserTab, Dnd5eSpellsTab, useDnd5eDeferredResource(), useDnd5eSheetResources(), defaultOptions (+7 more)

### Community 76 - "Mam Powers & Cost Ledger"
Cohesion: 0.14
Nodes (23): MamArchetypeBrowser(), MamArchetypeBrowserProps, createDefaultMam3eData(), Mam3eConditionTrack, Mam3eDataModel, applyMam3eToughnessFailure(), Mam3eEngine, normalizeConditionTrack() (+15 more)

### Community 77 - "Sync Engine Tests"
Cohesion: 0.10
Nodes (31): SystemEngine, resolveCharacterEffects(), d20LegacyCheckPenalty(), DND35E_CLASS_CATALOG, NOTE: 3.5e class files currently lack full `spellcasting.spellSlots` tables., SKILL_ABILITIES, RFC-003, Pf1eEngine (+23 more)

### Community 78 - "Dnd5e Feature Options"
Cohesion: 0.14
Nodes (23): appendBulletList(), applyDnd5eFeatureOptionSelection(), ClassLevelLike, DND5E_FEATURE_OPTION_GROUP_LABELS, DND5E_FEATURE_OPTION_SOURCE_LABELS, DOMAIN_SUBCLASS_IDS, featureIdForOption(), FeatureOptionState (+15 more)

### Community 79 - "Document Migrations & Storage"
Cohesion: 0.07
Nodes (49): cloneDocumentsSnapshot(), documentsChanged(), prepareDocumentsWithEngines(), prepareDocumentWithEngine(), useDocuments(), makeStoredDocument(), setStoredDocuments(), reloadSingleDocument() (+41 more)

### Community 80 - "App Header & Auth UI"
Cohesion: 0.12
Nodes (24): AppHeader(), AppHeaderProps, Mode, SignIn(), SignInProps, UserMenu(), UserMenuProps, assertNever() (+16 more)

### Community 81 - "Combat Toggles & Conditions"
Cohesion: 0.06
Nodes (45): EntitySyncAdapter, useEntitySync(), UseEntitySyncOptions, Doc, useSync(), UseSyncOptions, baseAuthValue, mockedClearQueuedDeletedDocumentIds (+37 more)

### Community 82 - "HP & Spell Slot Trackers"
Cohesion: 0.19
Nodes (9): EncounterDraftData, EncounterDraftSelection, TaskGatewayCall, DraftEncounterParams, DraftEncounterResult, GatewayCall, SelectionValidator, RFC-002 (+1 more)

### Community 83 - "Scene Grid View"
Cohesion: 0.18
Nodes (14): daggerheartManifest, dnd35eManifest, dnd5e2014Manifest, dnd5e2024Manifest, manifestForSystem(), SRD_MANIFESTS, mam3eManifest, pf1eManifest (+6 more)

### Community 84 - "Boundary Validation Tests"
Cohesion: 0.21
Nodes (20): ValidationIssue, NOW, parseImg(), validDocInput(), CampaignObjective, CampaignSessionEntry, coerceDate(), coerceObjectives() (+12 more)

### Community 85 - "capabilityScenarios.test.tsx"
Cohesion: 0.27
Nodes (9): DaggerheartDomainCardAutomation(), DaggerheartDomainCardAutomationProps, DaggerheartFeatureListProps, DaggerheartSubclassFeatureGroupProps, DOMAIN_CARD_AUTOMATION_LABELS, DOMAIN_CARD_AUTOMATION_VARIANTS, humanizeEffectTag(), DaggerheartAutomationMode (+1 more)

### Community 86 - "Equipment & Feature Browsers"
Cohesion: 0.12
Nodes (25): getDaggerheartAncestryAdjustments(), applyDaggerheartAncestryTemplate(), applyDaggerheartClassTemplate(), applyDaggerheartCommunityTemplate(), classTemplateItems(), communityTemplateItems(), DaggerheartInventoryEntry, DEFAULTS (+17 more)

### Community 87 - "Pf2e Engine & Constants"
Cohesion: 0.09
Nodes (20): GapLedgerItem, LedgerPhase, LedgerStatus, LedgerTag, LedgerTrack, MASTER_GAP_LEDGER, RFC-003, byPhase (+12 more)

### Community 88 - "Documents Hook & Persistence"
Cohesion: 0.06
Nodes (42): CheckPanel(), CheckPanelProps, InitiativeTracker(), MARKER_EFFECT_OPTIONS, MarkerEffectOption, MarkerEffectPreset, terrainEffectsForPreset(), MarkerPanel() (+34 more)

### Community 89 - "Daggerheart Contribution Ledger"
Cohesion: 0.08
Nodes (52): buildDaggerheartCombatant(), BuildDaggerheartCombatantResult, RANGE_CELLS, ANCESTRY_ADJUSTMENTS_BY_ID, ancestryByName, classByName, DAGGERHEART_TRAITS, DaggerheartAncestryAdjustments (+44 more)

### Community 90 - "Dnd35e/Pf1e Derived Math"
Cohesion: 0.36
Nodes (7): ThemeToggle(), applyTheme(), getSystemTheme(), isTheme(), Theme, useTheme(), VALID_THEMES

### Community 91 - "Mam Browser Tabs"
Cohesion: 0.10
Nodes (21): Props, Props, Pf2eSpellsTabComponent, Props, Pf2eSpellcasting, focusPulseSpell, PF2E_DERIVED_TRAITS, PF2E_SCHOOL_TRAITS (+13 more)

### Community 92 - "Pf2e Derived Math"
Cohesion: 0.17
Nodes (17): profTotal(), tierBonus(), CREATURE_XP_BY_LEVEL_DIFF, pf2eAttackModifier(), pf2eCreatureXP(), Pf2eDegree, pf2eDyingAfterRecovery(), pf2eEncounterBudget() (+9 more)

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
Cohesion: 0.14
Nodes (18): DicePanel(), DicePanelProps, formatBreakdown(), QUICK_ROLLS, applyKeep(), DiceRollResult, DiceTerm, DiceTermResult (+10 more)

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
Cohesion: 0.13
Nodes (18): CR_XP_TABLE, formatChallengeRating(), MonsterBrowser(), MonsterBrowserProps, MonsterStatBlockProps, GeneratedNpc, generateNpc(), generateNpcName() (+10 more)

### Community 101 - "Document Storage (IndexedDB)"
Cohesion: 0.13
Nodes (16): CurrencyEditor(), CurrencyEntry, DND_CURRENCIES, Props, InventoryItem, InventoryManager(), InventoryManagerProps, Currency (+8 more)

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
Nodes (43): useCampaignSync(), UseCampaignSyncOptions, baseAuthValue, mockedClearQueuedCampaignsSnapshot, mockedClearQueuedDeletedCampaignIds, mockedDeleteRemoteCampaign, mockedFetchRemoteCampaigns, mockedGetQueuedCampaignsSnapshot (+35 more)

### Community 106 - "Character Card Presenter"
Cohesion: 0.17
Nodes (18): mod(), AbilityScoreGrid(), buildPointBuyDraft(), buildStandardArrayDraft(), clampPointBuyScore(), emptyPointBuyDraft(), emptyStandardArrayDraft(), isStandardArrayComplete() (+10 more)

### Community 107 - "Oracle Panel & Logic"
Cohesion: 0.09
Nodes (23): NarrateSceneResult, CombatPanel(), CombatPanelProps, ANSWER_BADGE, OraclePanel(), OraclePanelProps, NARRATION_TONES, RecapPanel() (+15 more)

### Community 108 - "5e Equipment Tab"
Cohesion: 0.18
Nodes (17): ability(), ALIGNMENT_ABBREV, bucketFor(), CR_FRACTIONS, CREATURE_TYPES, creatureDir, DAMAGE_TYPES, main() (+9 more)

### Community 109 - "Scene Reaction Panel"
Cohesion: 0.39
Nodes (4): ServiceWorkerUpdateBanner(), isServiceWorkerSupported(), ServiceWorkerUpdateState, useServiceWorkerUpdate()

### Community 110 - "Document Signature Hashing"
Cohesion: 0.27
Nodes (9): makeScene(), campaignSignatureFor(), sameCampaignSignatures(), sameDocumentSignatures(), sameSceneSignatures(), sameSignatureMultisets(), sceneSignatureFor(), signatureFor() (+1 more)

### Community 111 - "Resource Pool Tracking"
Cohesion: 0.31
Nodes (5): SceneNarrationData, NarrateSceneParams, narrateSceneWithAi(), NarrationGatewayCall, RFC-002

### Community 112 - "Bundle Size Check"
Cohesion: 0.10
Nodes (15): appChunk, appChunks, assetsDir, budgets, chunks, dataChunks, distDir, eagerChunkNames (+7 more)

### Community 113 - "AI Prompt Builders"
Cohesion: 0.29
Nodes (12): EncounterDraftPayload, IdentifyCreaturePayload, IllustrateScenePayload, SceneNarrationPayload, buildEncounterDraftPrompt(), buildIdentifyCreaturePrompt(), buildIllustrateScenePrompt(), buildPromptForTask() (+4 more)

### Community 114 - "5e Feat Browser"
Cohesion: 0.07
Nodes (47): ProficiencyListSection(), Props, BrowserFeat, Dnd5eFeatBrowserTabComponent, FeatBrowser, FeatBrowserProps, Props, Dnd5eFeatureOptionsSection() (+39 more)

### Community 115 - "Project Dependencies"
Cohesion: 0.09
Nodes (23): ai, @ai-sdk/google, class-variance-authority, clsx, lucide-react, dependencies, ai, @ai-sdk/google (+15 more)

### Community 116 - "3.5e Spell Encoder"
Cohesion: 0.13
Nodes (28): SceneManager(), buildSceneCombatants(), critModelForScene(), degreeModelForScene(), factionForToken(), resolveSceneAreaEffect(), resolveSceneAttack(), runSceneRound() (+20 more)

### Community 117 - "AI Encounter Draft Flow"
Cohesion: 0.23
Nodes (9): AiImageInput, EncounterDraftCandidate, IdentifyCreatureData, IdentifyCreatureParams, IdentifyCreatureResult, identifyCreatureWithAi(), IdentifyGatewayCall, RFC-002 (+1 more)

### Community 118 - "Campaign File Transfer"
Cohesion: 0.17
Nodes (19): D20SkillsTab(), Props, buildArmorClassEntries(), d20SkillCheckPenalty(), Skill, daggerheartDamageDiceCount(), DND35E_SYNERGY_SOURCES, dnd35eMaxSkillRanks() (+11 more)

### Community 119 - "MAM Archetype Browser"
Cohesion: 0.27
Nodes (11): CLASS_TOKENS, d20srdUrl(), FILES, main(), mapCastingTime(), mapDuration(), mapRange(), normalizeName() (+3 more)

### Community 120 - "PF1e Spell Encoder"
Cohesion: 0.27
Nodes (11): CLASS_COLUMNS, main(), mapCastingTime(), mapDuration(), mapRange(), RFC-4180, normalizeName(), parseCsv() (+3 more)

### Community 122 - "PF2e Archetypes Tab"
Cohesion: 0.10
Nodes (31): collectD20LegacyConditionEffects(), D20_LEGACY_CONDITION_EFFECTS, D20LegacySystemId, hasD20LegacyConditionEffects(), LegacyConditionTemplate, collectD20LegacyRiderEffects(), D20_LEGACY_TOGGLE_LABELS, D20LegacyRiderInputs (+23 more)

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
Cohesion: 0.08
Nodes (25): ABILITIES, DEFENSES, MamAbilitiesTab(), Props, MamAdvantageBrowserTab(), Props, MamComplicationBrowser, MamComplicationsTabComponent (+17 more)

### Community 129 - "Daggerheart Sheet Automation"
Cohesion: 0.33
Nodes (5): Condition, ConditionPicker(), Props, available, valued

### Community 130 - "d20LegacySpellcasting.ts"
Cohesion: 0.12
Nodes (23): D20ClassesSection(), D20LegacyClassLevel, Props, renderClassOptions(), d20BonusSpells(), buildD20LegacySpellSlotTotals(), countAdvancementLevels(), D20_DOMAIN_CLASS_IDS (+15 more)

### Community 131 - "Retry With Backoff"
Cohesion: 0.36
Nodes (8): computeBackoffMs(), isRetryableError(), NON_RETRYABLE_FRAGMENTS, PROD_DEFAULTS, RetryOptions, retryWithBackoff(), sleep(), TEST_DEFAULTS

### Community 132 - "2024 Spell Encoder"
Cohesion: 0.39
Nodes (8): main(), mapCastingTime(), mapDuration(), mapRange(), normalizeName(), SCHOOLS, slug(), ts()

### Community 133 - "MAM Power Browser"
Cohesion: 0.14
Nodes (17): availablePf2eToggles(), ABILITY_NAMES, formatPf2eOptionLabel(), Pf2eAbilitiesTab(), Props, Pf2eArchetypesTab(), Props, PF2E_CONDITIONS (+9 more)

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
Cohesion: 0.26
Nodes (10): DISPOSITION_BADGE, DISPOSITION_LABEL, ReactionHistoryEntry, ReactionPanel(), ReactionPanelProps, dispositionForTotal(), resolveReaction(), rollReaction() (+2 more)

### Community 141 - "pf2eSpellTraits.test.ts"
Cohesion: 0.25
Nodes (16): actionReachCells(), ATTACK_COUNT_WORDS, averageDie(), buildMonsterCombatant(), dieFaces(), isMinusSign(), monsterAttackEffects(), monsterAttacksPerRound() (+8 more)

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
Cohesion: 0.31
Nodes (6): GeneratedImageData, IllustrateGatewayCall, IllustrateSceneParams, illustrateSceneWithAi(), RFC-002, image

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

### Community 153 - "Feat Browser Component"
Cohesion: 0.40
Nodes (4): Feat, FeatBrowser(), FeatBrowserProps, feats

### Community 154 - "resourcePool.ts"
Cohesion: 0.21
Nodes (6): draftEncounter(), partyXpBudget(), xpBudgetPerCharacter(), BRUTE, NOW, VICTIM

### Community 155 - "5e Movement Rules"
Cohesion: 0.60
Nodes (4): dnd5eCarryingCapacity(), dnd5eHighJump(), dnd5eLongJump(), dnd5ePushDragLift()

### Community 157 - "MAM Power Modifier Browser"
Cohesion: 0.60
Nodes (3): formatModifierCost(), MamPowerModifierBrowser(), MamPowerModifierBrowserProps

### Community 160 - "capabilityScenarios.test.tsx"
Cohesion: 0.10
Nodes (30): useLazyResource(), useSystemOptions(), useD20LegacySheetResources(), UseD20LegacySheetResourcesProps, UseDaggerheartSheetResourcesProps, UseDnd5eDeferredResourceOptions, UseDnd5eSheetResourcesOptions, UseMam3eSheetResourcesProps (+22 more)

### Community 161 - "PF2e Backgrounds Data"
Cohesion: 0.50
Nodes (3): Pf2eBackgroundChoice, Pf2eBackgroundDefinition, Pf2eBackgroundFeatGrant

### Community 177 - "sceneTerrain.ts"
Cohesion: 0.31
Nodes (7): collectTerrainEffectsAt(), isTerrainOperation(), markerCoversCell(), markerToEffects(), normalizeStackPolicy(), TERRAIN_OPERATIONS, RFC-003

### Community 179 - "featTemplate.test.ts"
Cohesion: 0.39
Nodes (6): draftEncounterWithAi(), fileToAiImageInput(), readAsDataUrl(), isMonsterSystemId(), RFC-006, useSceneEncounter()

### Community 180 - "MamPowerBrowserTab.tsx"
Cohesion: 0.31
Nodes (8): formatMamPowerAction(), formatMamPowerDuration(), formatMamPowerRange(), humanizeMamToken(), MamPowerBrowserTabComponent, MamPowerModifierBrowser, Props, SpellBrowser

### Community 181 - "loadEquipmentForSystem"
Cohesion: 0.25
Nodes (8): loadDnd35eEquipment(), loadDnd5e2014Equipment(), loadDnd5e2024Equipment(), loadEquipmentForSystem(), loadMam3eEquipment(), loadPf1eEquipment(), loadPf2eEquipment(), normalizeLegacyEquipment()

### Community 182 - "gatewayClient.ts"
Cohesion: 0.39
Nodes (5): AI_GATEWAY_ENDPOINT, AiRequest, callAiGateway(), isAiEnabled(), payload

### Community 183 - "loadEquipmentForSystem"
Cohesion: 0.50
Nodes (3): Answer, Outcome, Q: where are pending debounced document saves flushed to localStorage on page hide or unload (persistence flush)

### Community 184 - "EncounterPanelProps"
Cohesion: 0.50
Nodes (4): EncounterPanelProps, EncounterPartySummary, EncounterPlanSummary, EncounterSpecValidation

## Knowledge Gaps
- **1122 isolated node(s):** `browser`, `es2021`, `node`, `eslint:recommended`, `plugin:@typescript-eslint/recommended` (+1117 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **19 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `D20 Class Spellcasting` to `Sheet Resource Loading Hooks`, `Daggerheart Sheet Automation`, `Dnd5e Equipment & Features UI`, `d20LegacySpellcasting.ts`, `Dnd5e Background Templates`, `Toast Notifications`, `MAM Power Browser`, `Tabs UI Component`, `Scene Combat Resolution`, `Dnd5e Class Templates`, `Scene Check Panel`, `pf2eConditions.ts`, `Monster & NPC Generator`, `Dnd5e Feat Templates`, `D20 Combat Controls`, `Game System Selector`, `Combat & Recap Panels`, `Dnd35e Saves & Data Model`, `System Registry & Renderer`, `Equipment Browser Component`, `Feat Browser Component`, `Campaign Sync Hooks`, `Pf2e Character Templates`, `contributionLedger.ts`, `Dnd5e Feature List Sections`, `MAM Power Modifier Browser`, `Class Enhancement & Headers`, `capabilityScenarios.test.tsx`, `Pf2e Sheet Tabs`, `Quest & Session Log UI`, `Currency & Inventory Editors`, `Sheet Header & Stat Cards`, `Mam3e Data Model & Engine`, `Doc Drift Rules`, `Condition Effects by System`, `Equipped Armor Section`, `Spell Browser UI`, `Error Boundary & Auth Context`, `Scene Management Hooks`, `D20 Legacy Templates`, `featTemplate.test.ts`, `Campaign Storage & Hooks`, `MamPowerBrowserTab.tsx`, `Spell Preparation Logic`, `Daggerheart Combatant Builders`, `System Definitions & Types`, `ESLint Config`, `Spells Tab Components`, `AI Gateway Client`, `Monster Stat Block & Status`, `Dnd5e Resource Loading Hooks`, `Mam Powers & Cost Ledger`, `Document Migrations & Storage`, `App Header & Auth UI`, `Combat Toggles & Conditions`, `Equipment & Feature Browsers`, `Documents Hook & Persistence`, `Dnd35e/Pf1e Derived Math`, `Mam Browser Tabs`, `Skills Tab & Combat Math`, `Pf2e Spell Types & Traits`, `Document Storage (IndexedDB)`, `AI Creature Identification`, `Character Card Presenter`, `Oracle Panel & Logic`, `Scene Reaction Panel`, `5e Feat Browser`, `Campaign File Transfer`?**
  _High betweenness centrality (0.127) - this node is a cross-community bridge._
- **Why does `CharacterDocument` connect `Daggerheart Combatant Builders` to `Toast Notifications`, `Dnd5e Sheets & E2E Tests`, `Dnd5e Equipment & Features UI`, `Dnd5e Background Templates`, `Dnd5e2024 Engine & Hit Dice`, `Daggerheart Engine`, `MAM Power Browser`, `Tabs UI Component`, `Scene Combat Resolution`, `Dnd5e Class Templates`, `Dnd5e Activity Definitions`, `Monster & NPC Generator`, `Dnd5e Feat Templates`, `D20 Combat Controls`, `Combat & Recap Panels`, `D20 Legacy System Engines`, `Dnd35e Saves & Data Model`, `Daggerheart Data Model`, `System Registry & Renderer`, `Campaign Sync Hooks`, `Daggerheart Inventory`, `Pf2e Character Templates`, `resourcePool.ts`, `Dnd5e Feature List Sections`, `Encounter & Initiative Panels`, `Class Enhancement & Headers`, `Pf2e Sheet Tabs`, `capabilityScenarios.test.tsx`, `Check & Oracle Resolution`, `Condition Effects by System`, `D20 Legacy Templates`, `featTemplate.test.ts`, `Campaign Storage & Hooks`, `D20 Class Spellcasting`, `SRD Manifest Generator`, `D20 Legacy Spell Slots`, `AI Gateway Client`, `Character Effects Compilation`, `System Validation Logic`, `Mam Powers & Cost Ledger`, `Sync Engine Tests`, `Dnd5e Feature Options`, `Document Migrations & Storage`, `App Header & Auth UI`, `Combat Toggles & Conditions`, `Boundary Validation Tests`, `Equipment & Feature Browsers`, `Documents Hook & Persistence`, `Daggerheart Contribution Ledger`, `Pf2e Derived Math`, `Mam3e Derived Math`, `Document Storage (IndexedDB)`, `AI Creature Identification`, `Document Signature Hashing`, `5e Feat Browser`, `Campaign File Transfer`?**
  _High betweenness centrality (0.119) - this node is a cross-community bridge._
- **Why does `GameSystemId` connect `capabilityScenarios.test.tsx` to `Sheet Resource Loading Hooks`, `d20LegacySpellcasting.ts`, `Dnd5e Equipment & Features UI`, `Dnd5e2024 Engine & Hit Dice`, `Tabs UI Component`, `Scene Combat Resolution`, `Dnd5e Class Templates`, `Scene Check Panel`, `Dnd5e Feat Templates`, `Game System Selector`, `Dnd35e Saves & Data Model`, `System Registry & Renderer`, `resourcePool.ts`, `Roadmap Metrics Generator`, `Class Enhancement & Headers`, `Pf2e Sheet Tabs`, `Doc Drift Rules`, `Condition Effects by System`, `D20 Legacy Templates`, `featTemplate.test.ts`, `Spell Preparation Logic`, `Character Combatant Builder`, `D20 Class Spellcasting`, `Daggerheart Combatant Builders`, `System Definitions & Types`, `SRD Coverage Script`, `Character Effects Compilation`, `Dice Panel & Mam3e Resolution`, `Dnd5e Resource Loading Hooks`, `Mam Powers & Cost Ledger`?**
  _High betweenness centrality (0.054) - this node is a cross-community bridge._
- **What connects `browser`, `es2021`, `node` to the rest of the system?**
  _1122 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Sheet Resource Loading Hooks` be split into smaller, more focused modules?**
  _Cohesion score 0.11313131313131314 - nodes in this community are weakly interconnected._
- **Should `Dnd5e Equipment & Features UI` be split into smaller, more focused modules?**
  _Cohesion score 0.08700564971751412 - nodes in this community are weakly interconnected._
- **Should `Dnd5e Background Templates` be split into smaller, more focused modules?**
  _Cohesion score 0.06153846153846154 - nodes in this community are weakly interconnected._