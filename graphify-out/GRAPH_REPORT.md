# Graph Report - windsurf-project  (2026-07-17)

## Corpus Check
- 702 files · ~490,692 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 4450 nodes · 12541 edges · 192 communities (175 shown, 17 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 102 edges (avg confidence: 0.71)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ca135486`
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
- featTemplate.test.ts
- MamPowerBrowserTab.tsx
- loadEquipmentForSystem
- loadEquipmentForSystem
- EncounterPanelProps
- eslint-plugin-react
- fake-indexeddb
- knip
- postcss
- rollup-plugin-visualizer
- @types/react
- @types/react-dom
- @vitest/coverage-v8

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

## Communities (192 total, 17 thin omitted)

### Community 0 - "Sheet Resource Loading Hooks"
Cohesion: 0.10
Nodes (45): useDaggerheartSheetResources(), finalizeLoadedItems(), loadBackgroundsForSystem(), loadClassesForSystem(), loadDaggerheartAdversariesForSystem(), loadDaggerheartAncestries(), loadDaggerheartAncestriesForSystem(), loadDaggerheartArmor() (+37 more)

### Community 1 - "Dnd5e Sheets & E2E Tests"
Cohesion: 0.08
Nodes (43): resolveCheck(), BuildEncounterEventsResult, cellKey(), footprintCells(), footprintWithinGrid(), isOracleAnswer(), isOracleOdds(), resolveOracle() (+35 more)

### Community 2 - "Dnd5e Equipment & Features UI"
Cohesion: 0.12
Nodes (38): EquippedItemsSection(), Props, SLOT_LABELS, SLOT_ORDER, FeaturesSection(), Props, NormalizedSheet, CharacterEffectInputs (+30 more)

### Community 3 - "Dnd5e Background Templates"
Cohesion: 0.05
Nodes (70): countSelections(), Dnd5eLikeDataModel, Dnd5eSheetMutators, optionDisabledForRequirement(), resolveEquipmentSlot(), resolveFeatSelections(), toEquippedItem(), toWeaponDamage() (+62 more)

### Community 4 - "Dnd5e2024 Engine & Hit Dice"
Cohesion: 0.07
Nodes (29): HIT_DICE, hitDieSize(), hitDieString(), Dnd5e2024Engine, hasAlertFeat(), totalCharacterLevel(), hasDnd5eCondition(), normalizeConditionId() (+21 more)

### Community 5 - "Daggerheart Engine"
Cohesion: 0.08
Nodes (49): applyDnd5eClassTemplate(), applyDnd5eSubclassTemplate(), assertMulticlassRequirements(), ATTRIBUTE_NAME_TO_ID, buildChoiceSlots(), buildDerivedProficiencies(), buildSpellcastingState(), canSelectSubclass() (+41 more)

### Community 6 - "3.5e Monster Data Encoder"
Cohesion: 0.16
Nodes (17): ALIGNMENTS, DICE_PROGRESSIONS, main(), mapAlignment(), MONSTER_SIZE, normalizeName(), OLIMOT_FILES, resolveSizeRoll() (+9 more)

### Community 7 - "Tabs UI Component"
Cohesion: 0.08
Nodes (45): Badge(), BadgeProps, badgeVariants, isDaggerheartConsumableDefinition(), D20LegacyHeader(), Props, DaggerheartCharacterBasicsSection(), Props (+37 more)

### Community 8 - "Node Runtime Bootstrap"
Cohesion: 0.09
Nodes (48): main(), runBootstrapNodeInstall(), getPinnedCommandArgs(), main(), runPinnedNpmCommand(), formatRuntimeDoctorReport(), main(), readWorkflowPinSource() (+40 more)

### Community 9 - "Scene Combat Resolution"
Cohesion: 0.08
Nodes (37): ResolveCombatStats, appendSceneEvent(), applySceneIntents(), createSceneDocument(), foldSceneEvents(), resolveSceneAction(), SceneActionOptions, makeScene() (+29 more)

### Community 10 - "Dnd5e Class Templates"
Cohesion: 0.16
Nodes (21): MamPowersTab(), ModifierColumn(), ModifierColumnProps, buildMam3eContributionLedger(), buildMam3ePowerCostLedgerEntries(), createPowerCostEntry(), ledgerId(), calculateMam3eFinalPowerCost() (+13 more)

### Community 11 - "System Compute Registers"
Cohesion: 0.17
Nodes (15): daggerheartComputeRegister, dnd35eComputeRegister, dnd5e2014ComputeRegister, dnd5e2024ComputeRegister, COMPUTE_REGISTERS, registerForSystem(), mam3eComputeRegister, pf1eComputeRegister (+7 more)

### Community 12 - "Scene Check Panel"
Cohesion: 0.09
Nodes (24): react, Props, State, LegalNotices(), LegalNoticesProps, licenseTexts, Card, CardContent (+16 more)

### Community 13 - "Dnd5e Activity Definitions"
Cohesion: 0.09
Nodes (27): buildDefenseStyleActivity(), buildDivineSmiteActivities(), buildDivineSmiteActivity(), buildDnd5eActivityDefinitions(), buildUnsupportedDivineSmiteActivity(), divineSmiteSlotLevel(), Dnd5eActivityCost, Dnd5eActivityCostKind (+19 more)

### Community 14 - "Monster & NPC Generator"
Cohesion: 0.11
Nodes (24): ProficiencyListSection(), Props, DND5E_CONDITION_NAMES, formatBackgroundToolLabel(), ChoiceSlot, Dnd5eBackgroundSection(), Props, Dnd5eFeatureOptionsSection() (+16 more)

### Community 15 - "Dnd5e Feat Templates"
Cohesion: 0.14
Nodes (12): InventoryItem, InventoryManager(), InventoryManagerProps, SceneCreateForm(), Currency, D20InventoryTab(), InventoryItem, Props (+4 more)

### Community 16 - "App Shell & Layout"
Cohesion: 0.20
Nodes (17): mockedGetQueuedCampaignsSnapshot, mockedGetQueuedDeletedCampaignIds, mockedGetQueuedDeletedDocumentIds, mockedGetQueuedSyncSnapshot, getQueuedCampaignsSnapshot(), getQueuedDeletedCampaignIds(), getQueuedDeletedDocumentIds(), getQueuedSyncSnapshot() (+9 more)

### Community 17 - "D20 Combat Controls"
Cohesion: 0.16
Nodes (22): getEligibleDnd5eFeatureOptions(), applyDnd5eLongRest(), applyDnd5eShortRest(), recoverAllSpellSlots(), recoverFeatures(), recoverLongRestHitDice(), recoverPactMagicSlots(), featureOptionSelectionKey() (+14 more)

### Community 18 - "Game System Selector"
Cohesion: 0.09
Nodes (36): categoryIcons, GameSystemSelector(), systemAccents, supportBadgeLabels, supportBadgeStyles, buildInitialSummaryStates(), categoryDisplay, SummaryState (+28 more)

### Community 19 - "Combat & Recap Panels"
Cohesion: 0.13
Nodes (25): SceneManager(), buildSceneCombatants(), critModelForScene(), degreeModelForScene(), factionForToken(), resolveSceneAreaEffect(), resolveSceneAttack(), runSceneRound() (+17 more)

### Community 20 - "D20 Legacy System Engines"
Cohesion: 0.06
Nodes (45): D20ClassesSection(), D20LegacyClassLevel, Props, renderClassOptions(), dnd35eAbilityIncreases(), dnd35eConcentrationDCDamage(), dnd35eConcentrationDCDefensive(), dnd35eFeatsFromLevel() (+37 more)

### Community 21 - "Dnd35e Saves & Data Model"
Cohesion: 0.05
Nodes (67): Props, Props, applyAbilityAdjustments(), applyD20LegacyClassTemplate(), applyD20LegacyRaceTemplate(), buildClassSkills(), classFeaturesUpToLevel(), classSkillOptions() (+59 more)

### Community 22 - "Daggerheart Data Model"
Cohesion: 0.18
Nodes (11): clampDaggerheartInventoryQuantity(), createDaggerheartInventoryEntry(), daggerheartInventoryDefinitions, inventoryDefinitionById, inventoryDefinitionByName, normalizeDaggerheartCurrency(), normalizeInteger(), DomainCardEntry (+3 more)

### Community 23 - "System Registry & Renderer"
Cohesion: 0.04
Nodes (40): LegalNotices, SceneManager, STORAGE_WARNING_THRESHOLD, CharacterListView(), CharacterSortOption, NewCharacterDialog(), Props, SystemSheetRenderer() (+32 more)

### Community 24 - "Game Rules & Proficiencies"
Cohesion: 0.07
Nodes (33): GAME_RULES, ArmorProficiency, ArmorProficiencyType, GamingSetProficiency, isValidArmorProficiency(), isValidSkillProficiency(), isValidToolProficiency(), isValidWeaponProficiency() (+25 more)

### Community 25 - "Campaign Sync Hooks"
Cohesion: 0.13
Nodes (23): buildEncounterSceneEvents(), buildInitiativeEntries(), buildOccupiedCells(), clampInteger(), compareTokenIds(), EncounterBuilderIssue, EncounterPartyMember, EncounterPlanEntry (+15 more)

### Community 26 - "Daggerheart Inventory"
Cohesion: 0.12
Nodes (27): findDaggerheartInventoryDefinitionByName(), ancestryLookup, armorLookup, buildLookup(), classLookup, communityLookup, DEFAULTS, domainCardByName (+19 more)

### Community 27 - "Pf2e Character Templates"
Cohesion: 0.11
Nodes (40): abilityBoostValue(), ancestryFeatures(), applyAbilityAdjustments(), applyPf2eAncestryTemplate(), applyPf2eArchetypeTemplate(), applyPf2eBackgroundTemplate(), applyPf2eClassTemplate(), archetypeSource() (+32 more)

### Community 28 - "Roadmap Metrics Generator"
Cohesion: 0.09
Nodes (38): applyRepoResidentOverrides(), buildComputeCompletion(), buildContentCompletion(), buildMarkdownReport(), ComputeCompletionRow, computeMetrics(), ContentCompletionRow, createEmptyCategoryCounts() (+30 more)

### Community 29 - "Dnd5e Feature List Sections"
Cohesion: 0.06
Nodes (58): CurrencyEditor(), CurrencyEntry, DND_CURRENCIES, Props, DamageHealControl(), DamageHealControlProps, DiceRollButton(), DiceRollButtonProps (+50 more)

### Community 30 - "Encounter & Initiative Panels"
Cohesion: 0.06
Nodes (62): ArtisanToolProficiency, MusicalInstrumentProficiency, appendInventoryFromBackground(), applyDnd5eBackgroundTemplate(), BackgroundChoiceSlot, BackgroundChoiceValue, backgroundDerivedState(), COMMON_LANGUAGE_OPTIONS (+54 more)

### Community 31 - "Class Enhancement & Headers"
Cohesion: 0.12
Nodes (23): GameSystemSelectorProps, UseD20LegacyTemplateHandlersProps, UseDaggerheartSheetResourcesProps, Dnd5eEquipmentTab, Dnd5eFeatBrowserTab, Dnd5eFeaturesTab, Dnd5eMonsterBrowserTab, Dnd5eSpellsTab (+15 more)

### Community 32 - "Pf2e Sheet Tabs"
Cohesion: 0.07
Nodes (46): Pf2eArchetypesTab(), Props, createDefaultPf2eData(), Pf2eClassLevel, Pf2eFeat, Pf2eProficiencyTier, Pf2eSpellcasting, profTotal() (+38 more)

### Community 33 - "AI Encounter Drafting"
Cohesion: 0.14
Nodes (17): DIFFICULTY_COLUMN, draftEncounter(), DraftEncounterParams, ENCOUNTER_BUDGET_SYSTEMS, EncounterBudgetSystem, encounterPartyBudget(), partyXpBudget(), PF1E_XP_BY_CR (+9 more)

### Community 34 - "Quest & Session Log UI"
Cohesion: 0.13
Nodes (30): Props, QuestList(), STATUS_BADGE, STATUS_OPTIONS, DATE_FORMAT, Props, SessionLog(), T0 (+22 more)

### Community 35 - "Currency & Inventory Editors"
Cohesion: 0.07
Nodes (67): BuildDaggerheartAdversaryResult, DaggerheartAdversaryCombatant, RANGE_CELLS, ResolvedCharacterEffects, D20_LEGACY_CONDITION_EFFECTS, D20LegacySystemId, hasD20LegacyConditionEffects(), LegacyConditionTemplate (+59 more)

### Community 36 - "Document Sync Engine"
Cohesion: 0.09
Nodes (38): SceneAreaEffectOutcome, SceneAttackOutcome, SceneRoundOutcome, attackToDamageIntent(), RoundCombatant, RoundResult, RoundTurnRecord, runCombatRound() (+30 more)

### Community 37 - "Sheet Header & Stat Cards"
Cohesion: 0.10
Nodes (11): Dnd5e2024Sheet(), Dnd5eSheet(), Dnd5eSheetBase(), Mam3eCharacterSheet(), outlawBackground, resilient, Shared5eDoc, Dnd5eDocument (+3 more)

### Community 38 - "Check & Oracle Resolution"
Cohesion: 0.14
Nodes (11): createDefaultDnd5eData(), Dnd5eEngine, makeDoc(), makeDoc(), makeDoc(), envoy, makeDoc(), outlaw (+3 more)

### Community 39 - "Mam3e Data Model & Engine"
Cohesion: 0.13
Nodes (19): clampTrack(), DeathSaves, DeathSavesTracker(), Props, HitDiceTracker(), Props, Props, SLOT_LEVELS (+11 more)

### Community 40 - "Doc Drift Rules"
Cohesion: 0.05
Nodes (63): DOC_DRIFT_MANIFEST, DocDriftRuleType, DocDriftSurface, DocDriftSurfaceKind, CAPABILITY_PHRASE_RULES, CapabilityPhraseRule, capitalizeSupportLevel(), COMMAND_RUNTIME_RULES (+55 more)

### Community 41 - "NPM Build Scripts"
Cohesion: 0.05
Nodes (43): scripts, bootstrap:node, build, check:bundle-size, check:compute-register, check:compute-register:mutate, check:compute-register:write, check:dead-code (+35 more)

### Community 42 - "Condition Effects by System"
Cohesion: 0.06
Nodes (46): IllustrateSceneResult, NarrateSceneResult, CheckPanelProps, DEFAULT_SUGGESTIONS, DND5E_SKILLS, OUTCOME_BADGE, OUTCOME_LABEL, SKILL_SUGGESTIONS_BY_SYSTEM (+38 more)

### Community 43 - "Equipped Armor Section"
Cohesion: 0.10
Nodes (25): EquipArmorInput, EquipEntry, EquippedArmorSection(), EquipShieldInput, Props, D20EquipmentBrowserTabComponent, EquipmentBrowser, Props (+17 more)

### Community 44 - "Spell Browser UI"
Cohesion: 0.14
Nodes (23): DEFAULT_LABELS, SpellBrowser(), SpellBrowserLabels, SpellBrowserProps, SpellBrowserSpell, D20SpellBrowserPanelComponent, SpellBrowser, toSpellBrowserSpell() (+15 more)

### Community 45 - "Scene Combat Area Effects"
Cohesion: 0.10
Nodes (16): CR_XP_TABLE, formatChallengeRating(), MonsterBrowser(), MonsterBrowserProps, MonsterStatBlock(), monsters, fullMonster, simpleMonster (+8 more)

### Community 46 - "Error Boundary & Auth Context"
Cohesion: 0.12
Nodes (20): AuthContext, clearLocalDataForAccountChange(), getLastSyncedUserId(), setLastSyncedUserId(), AuthProvider(), AuthCallback, mockedGetSupabaseClient, mockedIsSupabaseConfigured (+12 more)

### Community 47 - "Encounter Builder Logic"
Cohesion: 0.17
Nodes (15): buildNotice(), FetchTarget, fetchValidated(), HTML_ENTITIES, looksLikeHtml(), main(), normalize(), noticePath (+7 more)

### Community 48 - "Scene Management Hooks"
Cohesion: 0.10
Nodes (33): AppContent(), cloneSystemData(), LibraryScenesView(), Props, SceneCreateFormProps, useToast(), useScenes(), now (+25 more)

### Community 49 - "Monster Combatant Builder"
Cohesion: 0.06
Nodes (45): SystemEngine, resolveCharacterEffects(), d20LegacyCheckPenalty(), D20Roll, DualityRoll, rollD20(), Rng, DND35E_CLASS_CATALOG (+37 more)

### Community 50 - "D20 Legacy Templates"
Cohesion: 0.12
Nodes (34): availableD20LegacyToggles(), D20LegacyData, D20LegacySpellSlots, getIterativeAttackBonuses(), recoverD20LegacySpellSlot(), resetD20LegacySpellSlots(), setD20LegacyPreparedSpell(), setD20LegacySpellSlotTotal() (+26 more)

### Community 51 - "Campaign Storage & Hooks"
Cohesion: 0.14
Nodes (21): CampaignManager(), useCampaigns(), DebouncedPersistence, IMPORTANT: a begun generation must end in either `persist` or, useDebouncedPersistence(), hostileStorage, CAMPAIGNS_STORAGE_KEY, clearCampaignStorage() (+13 more)

### Community 53 - "Dev Dependencies"
Cohesion: 0.05
Nodes (41): autoprefixer, eslint, eslint-config-prettier, eslint-plugin-react-hooks, eslint-plugin-react-refresh, happy-dom, devDependencies, autoprefixer (+33 more)

### Community 54 - "Character Combatant Builder"
Cohesion: 0.13
Nodes (20): compileModifierSource(), formatSigned(), isNamedBonusType(), modifierStackPolicy(), targetForModifierType(), TargetMapping, effectToLedgerEntry(), toLedgerOperation() (+12 more)

### Community 55 - "D20 Class Spellcasting"
Cohesion: 0.18
Nodes (17): ability(), ALIGNMENT_ABBREV, bucketFor(), CR_FRACTIONS, CREATURE_TYPES, creatureDir, DAMAGE_TYPES, main() (+9 more)

### Community 56 - "SRD Manifest Generator"
Cohesion: 0.12
Nodes (25): ManifestCategory, buildSystem(), CATEGORY_LOADERS, CategoryLoader, escape(), isRecord(), Loaded, main() (+17 more)

### Community 57 - "Daggerheart Combatant Builders"
Cohesion: 0.10
Nodes (27): Props, CharacterCardProps, CharacterListViewProps, UseSceneEncounterParams, Props, Props, SystemValidator, BuildEncounterEventsParams (+19 more)

### Community 58 - "AI Gateway Adapters"
Cohesion: 0.12
Nodes (20): createGeminiAdapter(), IMAGE_TASKS, TASK_SCHEMAS, AI_GATEWAY_SCHEMA_VERSION, aiFailure, AiResponse, AiTask, AiProviderAdapter (+12 more)

### Community 59 - "AI Gateway Contracts"
Cohesion: 0.14
Nodes (26): AI_GATEWAY_TASKS, AiFailureCode, AiParse, AiSuccess, AiUsage, EncounterDraftRequest, IdentifyCreatureRequest, IllustrateSceneRequest (+18 more)

### Community 60 - "System Definitions & Types"
Cohesion: 0.16
Nodes (10): createDnd5eValidator(), EquipmentBrowser, MamEquipmentBrowserTabComponent, Props, EquipmentBrowser, Pf2eEquipmentBrowserTabComponent, Props, lazyWithPreload() (+2 more)

### Community 61 - "D20 Legacy Spell Slots"
Cohesion: 0.07
Nodes (37): Tabs, TabsContent, TabsContentProps, TabsContext, TabsContextValue, TabsList, TabsProps, TabsTrigger (+29 more)

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
Cohesion: 0.13
Nodes (14): ErrorBoundary, e(), BrowserCapabilities, checkBrowserCapabilities(), initBrowserCompat(), isBrowserSupported(), showCompatibilityWarning(), ErrorCategory (+6 more)

### Community 66 - "AI Gateway Client"
Cohesion: 0.15
Nodes (12): MonsterStatBlockProps, GeneratedNpc, generateNpc(), generateNpcName(), NAME_ENDS, NAME_MIDS, NAME_STARTS, BRUTE (+4 more)

### Community 67 - "2024 Monster Data Encoder"
Cohesion: 0.16
Nodes (23): ABILITIES, ALIGNMENTS, bucketFor(), classifyImmunityList(), cleanProse(), CR_FRACTIONS, CREATURE_TYPES, DAMAGE_TYPES (+15 more)

### Community 68 - "Character Effects Compilation"
Cohesion: 0.20
Nodes (16): mam3eAfflictionDC(), mam3eAttackDC(), mam3eAttackHits(), mam3eCriticalDC(), mam3eDamageResistanceDC(), mam3eDegreesOfFailure(), mam3eDegreesOfSuccess(), mam3eEquipmentPoints() (+8 more)

### Community 69 - "TypeScript Config"
Cohesion: 0.07
Nodes (28): ES2020, ./src/*, compilerOptions, allowImportingTsExtensions, baseUrl, forceConsistentCasingInFileNames, isolatedModules, jsx (+20 more)

### Community 70 - "Mam Character Sheet Tabs"
Cohesion: 0.12
Nodes (23): MUTATION_ANCHORS, MutationAnchor, applyDemotion(), DO_MUTATE, DO_WRITE, escapeRe(), evaluateMutation(), evaluateTierA() (+15 more)

### Community 71 - "Monster Stat Block & Status"
Cohesion: 0.21
Nodes (14): toContributionLedger(), Dnd5eTemplateState, AddEntryInput, buildAlwaysPreparedSpellEntries(), buildDnd5eContributionLedger(), buildFeatAutomationEntries(), buildListEntry(), buildTemplateProficiencyEntries() (+6 more)

### Community 72 - "Dice Panel & Mam3e Resolution"
Cohesion: 0.09
Nodes (27): buildCharacterCombatant(), BuildCharacterCombatantResult, normalizeSheet(), readArmorClass(), toMagicBonusItems(), toModifierSources(), AttackEconomy, bestAttackAbility() (+19 more)

### Community 73 - "System Validation Logic"
Cohesion: 0.21
Nodes (23): ABILITY_SCORE_IDS, addIssue(), Dnd5eValidationData, Dnd5eValidationDataModel, Dnd5eValidationSystemId, featureOptionKey(), isIntegerInRange(), loadValidationData() (+15 more)

### Community 74 - "Spell Catalog Consistency Tests"
Cohesion: 0.16
Nodes (14): ExpectedSpellIdentity, iconicSpellExpectations, SystemKey, systems, dedupeById(), Identified, indexById(), warnDuplicateId() (+6 more)

### Community 75 - "Dnd5e Resource Loading Hooks"
Cohesion: 0.12
Nodes (33): getDaggerheartAncestryAdjustments(), applyDaggerheartAncestryTemplate(), applyDaggerheartClassTemplate(), applyDaggerheartCommunityTemplate(), classTemplateItems(), communityTemplateItems(), DaggerheartInventoryEntry, DEFAULTS (+25 more)

### Community 76 - "Mam Powers & Cost Ledger"
Cohesion: 0.17
Nodes (15): MamArchetypeBrowser(), MamArchetypeBrowserProps, MamConditionsTab(), Props, Mam3eConditionTrack, applyMam3eToughnessFailure(), getMam3eSheetState(), GetMam3eSheetStateProps (+7 more)

### Community 77 - "Sync Engine Tests"
Cohesion: 0.22
Nodes (15): EntitySyncAdapter, UseEntitySyncOptions, NOW, RemoteFetchResult, getSyncTombstonedIds(), getSyncTombstones(), pruneExpired(), readStored() (+7 more)

### Community 78 - "Dnd5e Feature Options"
Cohesion: 0.13
Nodes (24): appendBulletList(), applyDnd5eFeatureOptionSelection(), ClassLevelLike, DND5E_FEATURE_OPTION_GROUP_LABELS, DND5E_FEATURE_OPTION_SOURCE_LABELS, DOMAIN_SUBCLASS_IDS, featureIdForOption(), FeatureOptionState (+16 more)

### Community 79 - "Document Migrations & Storage"
Cohesion: 0.08
Nodes (46): ToastContext, ToastContextValue, ToastItem, ToastProvider(), VARIANT_ICONS, VARIANT_STYLES, cloneDocumentsSnapshot(), documentsChanged() (+38 more)

### Community 80 - "App Header & Auth UI"
Cohesion: 0.11
Nodes (26): AppHeader(), AppHeaderProps, ThemeToggle(), UserMenuProps, assertNever(), INITIAL_NAV_STATE, LIBRARY_SEGMENTS, LibrarySegment (+18 more)

### Community 81 - "Combat Toggles & Conditions"
Cohesion: 0.09
Nodes (16): baseAuthValue, mockedClearQueuedDeletedDocumentIds, mockedClearQueuedSyncSnapshot, mockedDeleteRemoteDocument, mockedFetchRemoteDocuments, mockedGetQueuedDeletedDocumentIds, mockedGetQueuedSyncSnapshot, mockedGetSyncTombstonedIds (+8 more)

### Community 82 - "HP & Spell Slot Trackers"
Cohesion: 0.19
Nodes (9): EncounterDraftData, EncounterDraftSelection, TaskGatewayCall, DraftEncounterParams, DraftEncounterResult, GatewayCall, SelectionValidator, RFC-002 (+1 more)

### Community 83 - "Scene Grid View"
Cohesion: 0.18
Nodes (14): daggerheartManifest, dnd35eManifest, dnd5e2014Manifest, dnd5e2024Manifest, manifestForSystem(), SRD_MANIFESTS, mam3eManifest, pf1eManifest (+6 more)

### Community 84 - "Boundary Validation Tests"
Cohesion: 0.24
Nodes (18): ValidationIssue, NOW, parseImg(), validDocInput(), coerceDate(), coerceObjectives(), coerceQuests(), coerceSessionLog() (+10 more)

### Community 85 - "capabilityScenarios.test.tsx"
Cohesion: 0.14
Nodes (13): CurrencyEditor, CurrencyEditorProps, Dnd5eEquipmentTabComponent, EquipmentBrowser, EquipmentBrowserItem, EquipmentBrowserProps, EquippedItemsSection, EquippedItemsSectionProps (+5 more)

### Community 86 - "Equipment & Feature Browsers"
Cohesion: 0.24
Nodes (9): createDefaultDaggerheartData(), dhDoc(), DaggerheartDomainCardEntry, daggerheartPassiveAuditAttributes, makeDoc(), makeDomainCardEntry(), makePassiveAuditSystem(), passiveAuditSignature() (+1 more)

### Community 87 - "Pf2e Engine & Constants"
Cohesion: 0.09
Nodes (20): GapLedgerItem, LedgerPhase, LedgerStatus, LedgerTag, LedgerTrack, MASTER_GAP_LEDGER, RFC-003, byPhase (+12 more)

### Community 88 - "Documents Hook & Persistence"
Cohesion: 0.16
Nodes (19): actionReachCells(), ATTACK_COUNT_WORDS, averageDie(), buildMonsterCombatant(), dieFaces(), isMinusSign(), monsterAttackEffects(), monsterAttacksPerRound() (+11 more)

### Community 89 - "Daggerheart Contribution Ledger"
Cohesion: 0.07
Nodes (54): ANCESTRY_ADJUSTMENTS_BY_ID, ancestryByName, classByName, DAGGERHEART_TRAITS, DaggerheartAncestryAdjustments, DaggerheartRange, DEFAULT_DAGGERHEART_ANCESTRY_ADJUSTMENTS, doesDaggerheartPassiveConditionApply() (+46 more)

### Community 90 - "Dnd35e/Pf1e Derived Math"
Cohesion: 0.24
Nodes (8): createDefaultMam3eData(), Mam3eEngine, normalizeConditionTrack(), SKILL_ABILITY_MAP, makeDoc(), makeDoc(), doc(), makeDoc()

### Community 91 - "Mam Browser Tabs"
Cohesion: 0.09
Nodes (22): Props, Pf2eSpellBrowserPanel, Props, Pf2eSpellsTabComponent, Props, focusPulseSpell, stinkingCloudSpell, teleportSpell (+14 more)

### Community 92 - "Pf2e Derived Math"
Cohesion: 0.19
Nodes (12): EncounterPanelProps, EncounterMonsterSelection, EncounterPartySummary, EncounterPlanSummary, DraftEncounterResult, EncounterDifficulty, supportsEncounterBudget(), EncounterSpec (+4 more)

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
Cohesion: 0.15
Nodes (18): DISPOSITION_BADGE, DISPOSITION_LABEL, ReactionHistoryEntry, ReactionPanel(), ReactionPanelProps, dispositionForTotal(), resolveReaction(), rollReaction() (+10 more)

### Community 97 - "Mam3e Derived Math"
Cohesion: 0.23
Nodes (13): CharacterCard(), OverflowMenu(), OverflowMenuItem, OverflowMenuProps, asNumber(), asRecord(), asString(), getClassLabel() (+5 more)

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
Cohesion: 0.08
Nodes (30): AuthContextValue, useCampaignSync(), UseCampaignSyncOptions, useEntitySync(), baseAuthValue, mockedClearQueuedCampaignsSnapshot, mockedClearQueuedDeletedCampaignIds, mockedDeleteRemoteCampaign (+22 more)

### Community 106 - "Character Card Presenter"
Cohesion: 0.17
Nodes (18): mod(), AbilityScoreGrid(), buildPointBuyDraft(), buildStandardArrayDraft(), clampPointBuyScore(), emptyPointBuyDraft(), emptyStandardArrayDraft(), isStandardArrayComplete() (+10 more)

### Community 107 - "Oracle Panel & Logic"
Cohesion: 0.06
Nodes (41): CheckPanel(), ANSWER_BADGE, OraclePanel(), OraclePanelProps, ALLEGIANCE_LABEL, ALLEGIANCE_TOKEN_CLASS, buildTokenLabel(), buildTokensByCell() (+33 more)

### Community 108 - "5e Equipment Tab"
Cohesion: 0.22
Nodes (8): TokenPanelProps, getSceneTokenSize(), buildPlacedToken(), PlaceTokenInput, now, position, SceneAllegiance, SceneTokenKind

### Community 109 - "Scene Reaction Panel"
Cohesion: 0.43
Nodes (5): getEditableTarget(), KeyboardShortcut, useKeyboardNavigation(), Harness(), HarnessProps

### Community 110 - "Document Signature Hashing"
Cohesion: 0.24
Nodes (10): SceneCombatStats, buildDaggerheartAdversaryCombatant(), buildDaggerheartCombatant(), buildMam3eCombatant(), CombatStatsSources, resolveSceneCombatStats(), heroDoc, sources (+2 more)

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
Cohesion: 0.11
Nodes (25): D20FeatBrowserTabComponent, FeatBrowser, Props, Props, BrowserFeat, Dnd5eFeatBrowserTabComponent, FeatBrowser, FeatBrowserProps (+17 more)

### Community 115 - "Project Dependencies"
Cohesion: 0.09
Nodes (23): ai, @ai-sdk/google, class-variance-authority, clsx, lucide-react, dependencies, ai, @ai-sdk/google (+15 more)

### Community 116 - "3.5e Spell Encoder"
Cohesion: 0.27
Nodes (8): SYSTEM_IDS, getSystemAssetPrefetchStateForTests(), prefetchedSystemAssets, prefetchedSystemRuntimeData, prefetchedSystemSheets, prefetchSystemAssetsForIds(), resetSystemAssetPrefetchStateForTests(), systemAssetPrefetchers

### Community 117 - "AI Encounter Draft Flow"
Cohesion: 0.23
Nodes (9): AiImageInput, EncounterDraftCandidate, IdentifyCreatureData, IdentifyCreatureParams, IdentifyCreatureResult, identifyCreatureWithAi(), IdentifyGatewayCall, RFC-002 (+1 more)

### Community 118 - "Campaign File Transfer"
Cohesion: 0.19
Nodes (18): D20SkillsTab(), Props, buildArmorClassEntries(), Skill, daggerheartDamageDiceCount(), DND35E_SYNERGY_SOURCES, dnd35eMaxSkillRanks(), dnd35eSkillSynergyTotal() (+10 more)

### Community 119 - "MAM Archetype Browser"
Cohesion: 0.27
Nodes (11): CLASS_TOKENS, d20srdUrl(), FILES, main(), mapCastingTime(), mapDuration(), mapRange(), normalizeName() (+3 more)

### Community 120 - "PF1e Spell Encoder"
Cohesion: 0.27
Nodes (11): CLASS_COLUMNS, main(), mapCastingTime(), mapDuration(), mapRange(), RFC-4180, normalizeName(), parseCsv() (+3 more)

### Community 122 - "PF2e Archetypes Tab"
Cohesion: 0.07
Nodes (37): DND5E_SCENE_CONDITIONS, SCENE_CONDITIONS_BY_SYSTEM, sceneConditionOptions(), collectD20LegacyConditionEffects(), D20_LEGACY_CONDITION_IDS, collectDnd5eConditionEffects(), availableDnd5eToggles(), collectDnd5eRiderEffects() (+29 more)

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
Cohesion: 0.26
Nodes (9): collectTerrainEffectsAt(), isTerrainOperation(), markerCoversCell(), markerToEffects(), normalizeStackPolicy(), TERRAIN_OPERATIONS, stateWithMarkers(), RFC-003 (+1 more)

### Community 129 - "Daggerheart Sheet Automation"
Cohesion: 0.32
Nodes (9): draftEncounterWithAi(), fileToAiImageInput(), readAsDataUrl(), isMonsterSystemId(), RFC-006, useSceneEncounter(), summarizeEncounterPlan(), monsterEncounterCost() (+1 more)

### Community 130 - "d20LegacySpellcasting.ts"
Cohesion: 0.07
Nodes (37): casterTypes, classResourcesNeeded, classTags, ChoiceSlot, Dnd5eSpeciesSection(), Props, GetDnd5eTemplateChoiceStateProps, formatDnd5eSpeciesToolLabel() (+29 more)

### Community 131 - "Retry With Backoff"
Cohesion: 0.18
Nodes (24): Doc, useSync(), UseSyncOptions, mockedGetSupabaseClient, getSupabaseClient(), deleteRemoteDocument(), fetchRemoteDocuments(), fromRemote() (+16 more)

### Community 132 - "2024 Spell Encoder"
Cohesion: 0.39
Nodes (8): main(), mapCastingTime(), mapDuration(), mapRange(), normalizeName(), SCHOOLS, slug(), ts()

### Community 133 - "MAM Power Browser"
Cohesion: 0.12
Nodes (15): CombatTogglesSection(), Props, Condition, ConditionPicker(), Props, D20_LEGACY_CONDITION_NAMES, D20_LEGACY_TOGGLE_LABELS, D20FeatsTab() (+7 more)

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
Cohesion: 0.47
Nodes (8): campaignSignatureFor(), sameCampaignSignatures(), sameDocumentSignatures(), sameSceneSignatures(), sameSignatureMultisets(), sceneSignatureFor(), signatureFor(), toTime()

### Community 141 - "pf2eSpellTraits.test.ts"
Cohesion: 0.39
Nodes (5): AI_GATEWAY_ENDPOINT, AiRequest, callAiGateway(), isAiEnabled(), payload

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
Cohesion: 0.10
Nodes (20): Equipment, EquipmentBrowser(), EquipmentBrowserProps, Feat, FeatBrowser(), FeatBrowserProps, DEFAULT_QUICK_ROLLS, DicePanel() (+12 more)

### Community 153 - "ServiceWorkerUpdateBanner.tsx"
Cohesion: 0.39
Nodes (4): ServiceWorkerUpdateBanner(), isServiceWorkerSupported(), ServiceWorkerUpdateState, useServiceWorkerUpdate()

### Community 154 - "resourcePool.ts"
Cohesion: 0.10
Nodes (24): ABILITIES, DEFENSES, MamAbilitiesTab(), Props, MamAdvantageBrowserTab(), Props, MamComplicationBrowser, MamComplicationsTabComponent (+16 more)

### Community 155 - "5e Movement Rules"
Cohesion: 0.60
Nodes (4): dnd5eCarryingCapacity(), dnd5eHighJump(), dnd5eLongJump(), dnd5ePushDragLift()

### Community 156 - "usePwaInstallPrompt.ts"
Cohesion: 0.43
Nodes (6): DeferredInstallPromptEvent, isStandaloneMode(), readDismissedState(), usePwaInstallPrompt(), UsePwaInstallPromptOptions, writeDismissedState()

### Community 157 - "MAM Power Modifier Browser"
Cohesion: 0.60
Nodes (3): clampExhaustion(), Props, RestControls()

### Community 160 - "capabilityScenarios.test.tsx"
Cohesion: 0.10
Nodes (28): useLazyResource(), useSystemOptions(), useD20LegacySheetResources(), UseD20LegacySheetResourcesProps, Pf2eEquipmentBrowserTab, Pf2eFeatBrowserTab, Pf2eSpellsTab, usePf2eSheetResources() (+20 more)

### Community 161 - "PF2e Backgrounds Data"
Cohesion: 0.50
Nodes (3): Pf2eBackgroundChoice, Pf2eBackgroundDefinition, Pf2eBackgroundFeatGrant

### Community 180 - "MamPowerBrowserTab.tsx"
Cohesion: 0.31
Nodes (8): formatMamPowerAction(), formatMamPowerDuration(), formatMamPowerRange(), humanizeMamToken(), MamPowerBrowserTabComponent, MamPowerModifierBrowser, Props, SpellBrowser

### Community 183 - "loadEquipmentForSystem"
Cohesion: 0.50
Nodes (3): Answer, Outcome, Q: where are pending debounced document saves flushed to localStorage on page hide or unload (persistence flush)

## Knowledge Gaps
- **1130 isolated node(s):** `browser`, `es2021`, `node`, `eslint:recommended`, `plugin:@typescript-eslint/recommended` (+1125 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **17 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `Scene Check Panel` to `Sheet Resource Loading Hooks`, `Daggerheart Sheet Automation`, `Dnd5e Equipment & Features UI`, `d20LegacySpellcasting.ts`, `Retry With Backoff`, `MAM Power Browser`, `Dnd5e Background Templates`, `Tabs UI Component`, `Daggerheart Engine`, `Dnd5e Class Templates`, `Monster & NPC Generator`, `Dnd5e Feat Templates`, `D20 Combat Controls`, `Game System Selector`, `D20 Legacy System Engines`, `Dnd35e Saves & Data Model`, `Daggerheart Data Model`, `System Registry & Renderer`, `Equipment Browser Component`, `ServiceWorkerUpdateBanner.tsx`, `resourcePool.ts`, `Pf2e Character Templates`, `usePwaInstallPrompt.ts`, `MAM Power Modifier Browser`, `Dnd5e Feature List Sections`, `Class Enhancement & Headers`, `capabilityScenarios.test.tsx`, `Pf2e Sheet Tabs`, `Quest & Session Log UI`, `Sheet Header & Stat Cards`, `Mam3e Data Model & Engine`, `Doc Drift Rules`, `Condition Effects by System`, `Equipped Armor Section`, `Spell Browser UI`, `Scene Combat Area Effects`, `Error Boundary & Auth Context`, `Scene Management Hooks`, `D20 Legacy Templates`, `Campaign Storage & Hooks`, `MamPowerBrowserTab.tsx`, `SRD Manifest Generator`, `Daggerheart Combatant Builders`, `System Definitions & Types`, `D20 Legacy Spell Slots`, `ESLint Config`, `Spells Tab Components`, `Dnd5e Resource Loading Hooks`, `Mam Powers & Cost Ledger`, `Sync Engine Tests`, `Document Migrations & Storage`, `App Header & Auth UI`, `Combat Toggles & Conditions`, `capabilityScenarios.test.tsx`, `Mam Browser Tabs`, `Skills Tab & Combat Math`, `Mam3e Derived Math`, `Document Storage (IndexedDB)`, `AI Creature Identification`, `Character Card Presenter`, `Oracle Panel & Logic`, `Scene Reaction Panel`, `5e Feat Browser`, `Campaign File Transfer`?**
  _High betweenness centrality (0.148) - this node is a cross-community bridge._
- **Why does `CharacterDocument` connect `Daggerheart Combatant Builders` to `Daggerheart Sheet Automation`, `d20LegacySpellcasting.ts`, `Retry With Backoff`, `Dnd5e2024 Engine & Hit Dice`, `Daggerheart Engine`, `Dnd5e Background Templates`, `Tabs UI Component`, `Dnd5e Sheets & E2E Tests`, `Dnd5e Equipment & Features UI`, `Dnd5e Class Templates`, `pf2eConditions.ts`, `Dnd5e Activity Definitions`, `D20 Combat Controls`, `Combat & Recap Panels`, `D20 Legacy System Engines`, `Dnd35e Saves & Data Model`, `Daggerheart Data Model`, `System Registry & Renderer`, `Campaign Sync Hooks`, `Daggerheart Inventory`, `resourcePool.ts`, `Pf2e Character Templates`, `Dnd5e Feature List Sections`, `Encounter & Initiative Panels`, `Class Enhancement & Headers`, `Pf2e Sheet Tabs`, `Currency & Inventory Editors`, `Sheet Header & Stat Cards`, `Check & Oracle Resolution`, `Condition Effects by System`, `Monster Combatant Builder`, `D20 Legacy Templates`, `Campaign Storage & Hooks`, `D20 Legacy Spell Slots`, `AI Gateway Client`, `Character Effects Compilation`, `Monster Stat Block & Status`, `Dice Panel & Mam3e Resolution`, `System Validation Logic`, `Dnd5e Resource Loading Hooks`, `Mam Powers & Cost Ledger`, `Dnd5e Feature Options`, `Document Migrations & Storage`, `App Header & Auth UI`, `Combat Toggles & Conditions`, `Boundary Validation Tests`, `Equipment & Feature Browsers`, `Documents Hook & Persistence`, `Daggerheart Contribution Ledger`, `Dnd35e/Pf1e Derived Math`, `Mam3e Derived Math`, `Oracle Panel & Logic`, `5e Equipment Tab`, `Document Signature Hashing`, `5e Feat Browser`?**
  _High betweenness centrality (0.114) - this node is a cross-community bridge._
- **Why does `GameSystemId` connect `Class Enhancement & Headers` to `Sheet Resource Loading Hooks`, `Daggerheart Sheet Automation`, `d20LegacySpellcasting.ts`, `Dnd5e Equipment & Features UI`, `Tabs UI Component`, `D20 Combat Controls`, `Game System Selector`, `D20 Legacy System Engines`, `Dnd35e Saves & Data Model`, `System Registry & Renderer`, `Roadmap Metrics Generator`, `capabilityScenarios.test.tsx`, `Pf2e Sheet Tabs`, `Currency & Inventory Editors`, `Doc Drift Rules`, `Monster Combatant Builder`, `D20 Legacy Templates`, `Character Combatant Builder`, `SRD Manifest Generator`, `Daggerheart Combatant Builders`, `D20 Legacy Spell Slots`, `SRD Coverage Script`, `AI Gateway Client`, `Dice Panel & Mam3e Resolution`, `Mam Powers & Cost Ledger`, `Documents Hook & Persistence`, `5e Feat Browser`, `3.5e Spell Encoder`?**
  _High betweenness centrality (0.057) - this node is a cross-community bridge._
- **What connects `browser`, `es2021`, `node` to the rest of the system?**
  _1130 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Sheet Resource Loading Hooks` be split into smaller, more focused modules?**
  _Cohesion score 0.10122448979591837 - nodes in this community are weakly interconnected._
- **Should `Dnd5e Sheets & E2E Tests` be split into smaller, more focused modules?**
  _Cohesion score 0.08446455505279035 - nodes in this community are weakly interconnected._
- **Should `Dnd5e Equipment & Features UI` be split into smaller, more focused modules?**
  _Cohesion score 0.12244897959183673 - nodes in this community are weakly interconnected._