# Graph Report - windsurf-project  (2026-07-14)

## Corpus Check
- 688 files · ~478,977 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 4379 nodes · 12371 edges · 197 communities (177 shown, 20 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 101 edges (avg confidence: 0.71)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5e499a48`
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
- Dnd5eEquipmentTab.tsx
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
- MAM Complication Browser
- characterCombatant.test.ts
- capabilityScenarios.test.tsx
- PF2e Backgrounds Data
- Host Size Budget Test
- Vitest Type Defs
- MAM Complications Data
- MAM Power Modifiers Data
- Vitest Coverage Config
- syncTombstones.ts
- useSceneEncounter.ts
- featTemplate.test.ts
- daggerheart-engine.test.ts
- sceneTerrain.ts
- tokenPlacement.ts
- loadEquipmentForSystem
- EncounterPanel.tsx
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

## God Nodes (most connected - your core abstractions)
1. `CharacterDocument` - 229 edges
2. `react` - 159 edges
3. `SystemDataModel` - 125 edges
4. `GameSystemId` - 79 edges
5. `EffectInstance` - 61 edges
6. `makeEffectId()` - 54 edges
7. `abilityMod()` - 54 edges
8. `Dnd5eDataModel` - 49 edges
9. `SystemRegistry` - 44 edges
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

## Communities (197 total, 20 thin omitted)

### Community 0 - "Sheet Resource Loading Hooks"
Cohesion: 0.08
Nodes (45): useLazyResource(), useSystemOptions(), useD20LegacySheetResources(), UseD20LegacySheetResourcesProps, loadClassesForSystem(), loadDaggerheartAdversariesForSystem(), loadDaggerheartArmor(), loadDaggerheartClasses() (+37 more)

### Community 1 - "Dnd5e Sheets & E2E Tests"
Cohesion: 0.10
Nodes (8): createDefaultDnd5e2024Data(), makeStoredDocument(), setStoredDocuments(), makeDoc(), makeDoc(), makeDoc(), make2024Doc(), make2024Doc()

### Community 2 - "Dnd5e Equipment & Features UI"
Cohesion: 0.15
Nodes (34): EquippedItemsSection(), Props, SLOT_LABELS, SLOT_ORDER, FeaturesSection(), Props, NormalizedSheet, Dnd5e2024DataModel (+26 more)

### Community 3 - "Dnd5e Background Templates"
Cohesion: 0.07
Nodes (56): resolveFeatSelections(), ABILITY_NAME_TO_ID, ABILITY_OPTIONS, abilityAutomationFromSelections(), aggregateFeatAutomation(), applyDnd5eFeatTemplate(), applyFeatSkillSources(), buildAutomatedFeat() (+48 more)

### Community 4 - "Dnd5e2024 Engine & Hit Dice"
Cohesion: 0.18
Nodes (12): engine, SHIELD, TEST_DATE, CasterType, casterTypeForClass(), compute5eSpellSlots(), Compute5eSpellSlotsOptions, computePactMagicSlots() (+4 more)

### Community 5 - "Daggerheart Engine"
Cohesion: 0.08
Nodes (49): applyDnd5eClassTemplate(), applyDnd5eSubclassTemplate(), assertMulticlassRequirements(), ATTRIBUTE_NAME_TO_ID, buildChoiceSlots(), buildDerivedProficiencies(), buildSpellcastingState(), canSelectSubclass() (+41 more)

### Community 6 - "3.5e Monster Data Encoder"
Cohesion: 0.09
Nodes (35): ALIGNMENTS, DICE_PROGRESSIONS, main(), mapAlignment(), mod(), MONSTER_SIZE, normalizeName(), OLIMOT_FILES (+27 more)

### Community 7 - "Tabs UI Component"
Cohesion: 0.07
Nodes (42): Tabs, TabsContentProps, TabsContext, TabsContextValue, TabsList, TabsProps, TabsTrigger, TabsTriggerProps (+34 more)

### Community 8 - "Node Runtime Bootstrap"
Cohesion: 0.09
Nodes (48): main(), runBootstrapNodeInstall(), getPinnedCommandArgs(), main(), runPinnedNpmCommand(), formatRuntimeDoctorReport(), main(), readWorkflowPinSource() (+40 more)

### Community 9 - "Scene Combat Resolution"
Cohesion: 0.06
Nodes (44): SceneManager(), buildSceneCombatants(), factionForToken(), ResolveCombatStats, appendSceneEvent(), applySceneIntents(), createSceneDocument(), foldSceneEvents() (+36 more)

### Community 10 - "Dnd5e Class Templates"
Cohesion: 0.14
Nodes (30): applyAbilityAdjustments(), applyD20LegacyClassTemplate(), applyD20LegacyRaceTemplate(), buildClassSkills(), classFeaturesUpToLevel(), classSkillOptions(), collectClassFeatureSignatures(), create35eClassLevel() (+22 more)

### Community 11 - "System Compute Registers"
Cohesion: 0.17
Nodes (15): daggerheartComputeRegister, dnd35eComputeRegister, dnd5e2014ComputeRegister, dnd5e2024ComputeRegister, COMPUTE_REGISTERS, registerForSystem(), mam3eComputeRegister, pf1eComputeRegister (+7 more)

### Community 12 - "Scene Check Panel"
Cohesion: 0.13
Nodes (19): Props, State, LegalNotices(), LegalNoticesProps, licenseTexts, MonsterStatBlock(), MonsterStatBlockProps, Card (+11 more)

### Community 13 - "Dnd5e Activity Definitions"
Cohesion: 0.07
Nodes (41): Dnd5eTemplateState, buildDefenseStyleActivity(), buildDivineSmiteActivities(), buildDivineSmiteActivity(), buildDnd5eActivityDefinitions(), buildUnsupportedDivineSmiteActivity(), divineSmiteSlotLevel(), Dnd5eActivityCost (+33 more)

### Community 14 - "Monster & NPC Generator"
Cohesion: 0.18
Nodes (13): Props, ChoiceSlot, Dnd5eSpeciesSection(), Props, GetDnd5eTemplateChoiceStateProps, formatDnd5eSpeciesToolLabel(), MulticlassProficiencies, AbilityScoreIncrease (+5 more)

### Community 15 - "Dnd5e Feat Templates"
Cohesion: 0.18
Nodes (9): createDefaultDnd5eData(), Dnd5eEngine, makeDoc(), makeDoc(), makeDoc(), RFC-003, makeDoc(), makeDoc() (+1 more)

### Community 16 - "App Shell & Layout"
Cohesion: 0.19
Nodes (17): mockedGetQueuedCampaignsSnapshot, mockedGetQueuedDeletedCampaignIds, mockedGetQueuedDeletedDocumentIds, mockedGetQueuedSyncSnapshot, getQueuedDeletedCampaignIds(), getQueuedDeletedDocumentIds(), queueIds(), readQueuedIds() (+9 more)

### Community 17 - "D20 Combat Controls"
Cohesion: 0.10
Nodes (20): CombatStatCard(), Props, Props, SheetHeader(), TabsContent, Dnd5eAbilitiesTab(), Props, Dnd5eHeaderSection() (+12 more)

### Community 18 - "Game System Selector"
Cohesion: 0.14
Nodes (22): registryMeta, SupportMeta, {
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
}, SystemContentSummary, clearSystemCatalogSummaryCache(), loadAllSystemCatalogSummaries(), loadSystemCatalogDataLoaders(), loadSystemCatalogSummary() (+14 more)

### Community 19 - "Combat & Recap Panels"
Cohesion: 0.10
Nodes (37): MamPowersTab(), ModifierColumn(), ModifierColumnProps, buildMam3eContributionLedger(), buildMam3ePowerCostLedgerEntries(), createPowerCostEntry(), ledgerId(), mam3eAfflictionDC() (+29 more)

### Community 20 - "D20 Legacy System Engines"
Cohesion: 0.13
Nodes (19): dnd35eAbilityIncreases(), dnd35eConcentrationDCDamage(), dnd35eConcentrationDCDefensive(), dnd35eFeatsFromLevel(), dnd35eHpState, dnd35eTriggersMassiveDamage(), dnd35eXpForLevel(), pf1eConcentrationDCDamage() (+11 more)

### Community 21 - "Dnd35e Saves & Data Model"
Cohesion: 0.06
Nodes (41): Props, Props, createDefaultDnd35eData(), Dnd35eClassLevel, Dnd35eDataModel, Dnd35eFeat, Dnd35eManualSpellcastingExtras, Dnd35eSaves (+33 more)

### Community 22 - "Daggerheart Data Model"
Cohesion: 0.15
Nodes (19): EMPTY_WEAPON_LOADOUT, GetDaggerheartSheetStateProps, matchesQuery(), DaggerheartAdversaryRole, DaggerheartArmor, DaggerheartConsumable, DaggerheartDamageType, DaggerheartDomain (+11 more)

### Community 23 - "System Registry & Renderer"
Cohesion: 0.08
Nodes (13): SystemRegistry, SystemDefinition, SystemValidator, ValidationContext, ValidationResult, registerAllSystems(), MockBeforeInstallPromptEvent, CreationOptions (+5 more)

### Community 24 - "Game Rules & Proficiencies"
Cohesion: 0.07
Nodes (33): GAME_RULES, ArmorProficiency, ArmorProficiencyType, ArtisanToolProficiency, isValidArmorProficiency(), isValidSkillProficiency(), isValidToolProficiency(), isValidWeaponProficiency() (+25 more)

### Community 25 - "Campaign Sync Hooks"
Cohesion: 0.16
Nodes (31): Doc, useSync(), UseSyncOptions, mockedGetSupabaseClient, retryWithBackoff(), getSupabaseClient(), deleteRemoteCampaign(), deleteRemoteDocument() (+23 more)

### Community 26 - "Daggerheart Inventory"
Cohesion: 0.12
Nodes (25): ancestryLookup, armorLookup, buildLookup(), classLookup, communityLookup, DEFAULTS, domainCardByName, domainCardByNameAndDomain (+17 more)

### Community 27 - "Pf2e Character Templates"
Cohesion: 0.11
Nodes (37): abilityBoostValue(), ancestryFeatures(), applyAbilityAdjustments(), applyPf2eAncestryTemplate(), applyPf2eBackgroundTemplate(), applyPf2eClassTemplate(), archetypeSource(), archetypeTemplateFeatures() (+29 more)

### Community 28 - "Roadmap Metrics Generator"
Cohesion: 0.09
Nodes (38): applyRepoResidentOverrides(), buildComputeCompletion(), buildContentCompletion(), buildMarkdownReport(), ComputeCompletionRow, computeMetrics(), ContentCompletionRow, createEmptyCategoryCounts() (+30 more)

### Community 29 - "Dnd5e Feature List Sections"
Cohesion: 0.09
Nodes (35): DamageHealControl(), DamageHealControlProps, DiceRollButton(), DiceRollButtonProps, RollResult, ABILITIES, D20AbilitiesTab(), Props (+27 more)

### Community 30 - "Encounter & Initiative Panels"
Cohesion: 0.08
Nodes (39): GamingSetProficiency, MusicalInstrumentProficiency, appendInventoryFromBackground(), applyDnd5eBackgroundTemplate(), BackgroundChoiceSlot, BackgroundChoiceValue, backgroundDerivedState(), COMMON_LANGUAGE_OPTIONS (+31 more)

### Community 31 - "Class Enhancement & Headers"
Cohesion: 0.07
Nodes (45): casterTypes, classResourcesNeeded, classTags, Props, getBackgroundFixedToolProficiencies(), getBackgroundToolChoiceSlots(), getEligibleDnd5eFeatureOptions(), applyDnd5eLongRest() (+37 more)

### Community 32 - "Pf2e Sheet Tabs"
Cohesion: 0.11
Nodes (27): Pf2eArchetypesTab(), Props, Props, Pf2eProficiencyTier, Pf2eSpellcasting, getPf2eSheetChoiceState(), GetPf2eSheetChoiceStateProps, Pf2eChoiceSlot (+19 more)

### Community 33 - "AI Encounter Drafting"
Cohesion: 0.14
Nodes (20): DIFFICULTY_COLUMN, draftEncounter(), DraftEncounterParams, ENCOUNTER_BUDGET_SYSTEMS, EncounterBudgetSystem, encounterPartyBudget(), monsterEncounterCost(), partyXpBudget() (+12 more)

### Community 34 - "Quest & Session Log UI"
Cohesion: 0.10
Nodes (33): Props, QuestList(), STATUS_BADGE, STATUS_OPTIONS, DATE_FORMAT, Props, SessionLog(), BRUTE (+25 more)

### Community 35 - "Currency & Inventory Editors"
Cohesion: 0.08
Nodes (26): CombatTogglesSection(), Props, Condition, ConditionPicker(), Props, D20_LEGACY_CONDITION_NAMES, availablePf2eToggles(), collectPf2eRiderEffects() (+18 more)

### Community 36 - "Document Sync Engine"
Cohesion: 0.10
Nodes (27): IllustrateSceneResult, CharacterListView(), CharacterSortOption, EncounterPanel(), formatAverageLevel(), ILLUSTRATION_STYLES, IllustrationPanel(), IllustrationPanelProps (+19 more)

### Community 37 - "Sheet Header & Stat Cards"
Cohesion: 0.15
Nodes (15): useCampaignSync(), UseCampaignSyncOptions, EntitySyncAdapter, useEntitySync(), UseEntitySyncOptions, mockedGetSupabaseClient, debounce(), getQueuedCampaignsSnapshot() (+7 more)

### Community 38 - "Check & Oracle Resolution"
Cohesion: 0.10
Nodes (40): resolveCheck(), BuildEncounterEventsResult, footprintCells(), footprintWithinGrid(), isOracleOdds(), resolveOracle(), applyHitPointDelta(), applySceneEvent() (+32 more)

### Community 39 - "Mam3e Data Model & Engine"
Cohesion: 0.13
Nodes (18): clampTrack(), DeathSaves, DeathSavesTracker(), Props, HitDiceTracker(), Props, Props, SLOT_LEVELS (+10 more)

### Community 40 - "Doc Drift Rules"
Cohesion: 0.07
Nodes (50): DOC_DRIFT_MANIFEST, DocDriftRuleType, DocDriftSurface, DocDriftSurfaceKind, CAPABILITY_PHRASE_RULES, CapabilityPhraseRule, capitalizeSupportLevel(), COMMAND_RUNTIME_RULES (+42 more)

### Community 41 - "NPM Build Scripts"
Cohesion: 0.05
Nodes (43): scripts, bootstrap:node, build, check:bundle-size, check:compute-register, check:compute-register:mutate, check:compute-register:write, check:dead-code (+35 more)

### Community 42 - "Condition Effects by System"
Cohesion: 0.07
Nodes (36): AppContent(), cloneSystemData(), LegalNotices, SceneManager, STORAGE_WARNING_THRESHOLD, CampaignManager(), LibraryScenesView(), NewCharacterDialog() (+28 more)

### Community 43 - "Equipped Armor Section"
Cohesion: 0.13
Nodes (19): EquipArmorInput, EquipEntry, EquippedArmorSection(), EquipShieldInput, Props, Props, EquipmentBrowser, Pf2eEquipmentBrowserTabComponent (+11 more)

### Community 44 - "Spell Browser UI"
Cohesion: 0.14
Nodes (23): SpellBrowser(), SpellBrowserProps, SpellBrowserSpell, D20SpellBrowserPanelComponent, SpellBrowser, toSpellBrowserSpell(), Dnd5eSpellsTabComponent, Props (+15 more)

### Community 45 - "Scene Combat Area Effects"
Cohesion: 0.08
Nodes (43): SceneGridViewProps, critModelForScene(), degreeModelForScene(), runSceneRound(), SceneAreaEffectOutcome, SceneAttackOutcome, SceneRoundOutcome, AreaEffectResult (+35 more)

### Community 46 - "Error Boundary & Auth Context"
Cohesion: 0.12
Nodes (20): AuthContext, clearLocalDataForAccountChange(), getLastSyncedUserId(), setLastSyncedUserId(), AuthProvider(), AuthCallback, mockedGetSupabaseClient, mockedIsSupabaseConfigured (+12 more)

### Community 47 - "Encounter Builder Logic"
Cohesion: 0.17
Nodes (15): buildNotice(), FetchTarget, fetchValidated(), HTML_ENTITIES, looksLikeHtml(), main(), normalize(), noticePath (+7 more)

### Community 48 - "Scene Management Hooks"
Cohesion: 0.13
Nodes (27): Props, SceneCreateFormProps, useScenes(), makeScene(), now, pickTextFileMock, makeScene(), NOW (+19 more)

### Community 49 - "Monster Combatant Builder"
Cohesion: 0.10
Nodes (21): CR_XP_TABLE, formatChallengeRating(), MonsterBrowser(), MonsterBrowserProps, Dnd5eMonsterBrowserTabComponent, MonsterBrowser, MonsterBrowserProps, Props (+13 more)

### Community 50 - "D20 Legacy Templates"
Cohesion: 0.26
Nodes (16): availableD20LegacyToggles(), D20LegacyData, D20LegacySpellSlots, getIterativeAttackBonuses(), recoverD20LegacySpellSlot(), resetD20LegacySpellSlots(), setD20LegacyPreparedSpell(), setD20LegacySpellSlotTotal() (+8 more)

### Community 51 - "Campaign Storage & Hooks"
Cohesion: 0.19
Nodes (17): useCampaigns(), DebouncedPersistence, IMPORTANT: a begun generation must end in either `persist` or, hostileStorage, CAMPAIGNS_STORAGE_KEY, clearCampaignStorage(), importCampaigns(), importCampaignsWithReport() (+9 more)

### Community 52 - "Spell Preparation Logic"
Cohesion: 0.17
Nodes (15): categoryIcons, GameSystemSelector(), GameSystemSelectorProps, systemAccents, supportBadgeLabels, supportBadgeStyles, buildInitialSummaryStates(), categoryDisplay (+7 more)

### Community 53 - "Dev Dependencies"
Cohesion: 0.05
Nodes (41): autoprefixer, eslint, eslint-config-prettier, eslint-plugin-react-hooks, eslint-plugin-react-refresh, happy-dom, devDependencies, autoprefixer (+33 more)

### Community 54 - "Character Combatant Builder"
Cohesion: 0.09
Nodes (36): TargetMapping, D20_LEGACY_CONDITION_EFFECTS, hasD20LegacyConditionEffects(), LegacyConditionTemplate, ConditionEffectTemplate, conditionImposesDisadvantage(), DND5E_CONDITION_EFFECTS, hasDnd5eConditionEffects() (+28 more)

### Community 55 - "D20 Class Spellcasting"
Cohesion: 0.11
Nodes (20): react, ServiceWorkerUpdateBanner(), Mode, SignIn(), SignInProps, Button, ButtonProps, buttonVariants (+12 more)

### Community 56 - "SRD Manifest Generator"
Cohesion: 0.17
Nodes (18): CharacterEffectInputs, ResolvedCharacterEffects, compileEquipmentEffects(), equipStackPolicy(), isMeaningful(), MagicBonusItem, TYPED_STACK_SYSTEMS, compileModifierEffects() (+10 more)

### Community 57 - "Daggerheart Combatant Builders"
Cohesion: 0.07
Nodes (41): AppHeaderProps, Props, CharacterCardProps, CharacterListViewProps, UseSceneEncounterParams, Props, Props, SystemSheetRenderer() (+33 more)

### Community 58 - "AI Gateway Adapters"
Cohesion: 0.12
Nodes (20): createGeminiAdapter(), IMAGE_TASKS, TASK_SCHEMAS, AI_GATEWAY_SCHEMA_VERSION, aiFailure, AiResponse, AiTask, AiProviderAdapter (+12 more)

### Community 59 - "AI Gateway Contracts"
Cohesion: 0.14
Nodes (26): AI_GATEWAY_TASKS, AiFailureCode, AiParse, AiSuccess, AiUsage, EncounterDraftRequest, IdentifyCreatureRequest, IllustrateSceneRequest (+18 more)

### Community 60 - "System Definitions & Types"
Cohesion: 0.27
Nodes (14): getDaggerheartAncestryAdjustments(), applyDaggerheartAncestryTemplate(), applyDaggerheartClassTemplate(), applyDaggerheartCommunityTemplate(), classTemplateItems(), communityTemplateItems(), DaggerheartInventoryEntry, DEFAULTS (+6 more)

### Community 61 - "D20 Legacy Spell Slots"
Cohesion: 0.16
Nodes (22): buildEncounterSceneEvents(), buildInitiativeEntries(), buildOccupiedCells(), clampInteger(), compareTokenIds(), EncounterBuilderIssue, EncounterPartyMember, EncounterPlanEntry (+14 more)

### Community 62 - "SRD Coverage Script"
Cohesion: 0.11
Nodes (25): cats5e2014, cats5e2024, CoverageTarget, csvRows(), extractJsArray(), extractNameValues(), fetchCsvNames(), fetchJsArrayNames() (+17 more)

### Community 63 - "ESLint Config"
Cohesion: 0.05
Nodes (39): jsx, env, browser, es2021, node, extends, ignorePatterns, overrides (+31 more)

### Community 64 - "Spells Tab Components"
Cohesion: 0.17
Nodes (16): compareSpells(), D20SpellsTab(), formatSpellLevel(), Props, titleCase(), D20_ARCANE_SCHOOLS, D20_LEGACY_MANUAL_NOTES, buildSpellPreparationConcepts() (+8 more)

### Community 65 - "Browser Compat & Error Logging"
Cohesion: 0.18
Nodes (12): BrowserCapabilities, checkBrowserCapabilities(), initBrowserCompat(), isBrowserSupported(), showCompatibilityWarning(), ErrorCategory, ErrorLog, ErrorLogger (+4 more)

### Community 66 - "AI Gateway Client"
Cohesion: 0.39
Nodes (5): AI_GATEWAY_ENDPOINT, AiRequest, callAiGateway(), isAiEnabled(), payload

### Community 67 - "2024 Monster Data Encoder"
Cohesion: 0.16
Nodes (23): ABILITIES, ALIGNMENTS, bucketFor(), classifyImmunityList(), cleanProse(), CR_FRACTIONS, CREATURE_TYPES, DAMAGE_TYPES (+15 more)

### Community 68 - "Character Effects Compilation"
Cohesion: 0.08
Nodes (31): buildCharacterCombatant(), BuildCharacterCombatantResult, normalizeSheet(), readArmorClass(), toMagicBonusItems(), toModifierSources(), AttackEconomy, bestAttackAbility() (+23 more)

### Community 69 - "TypeScript Config"
Cohesion: 0.07
Nodes (28): ES2020, ./src/*, compilerOptions, allowImportingTsExtensions, baseUrl, forceConsistentCasingInFileNames, isolatedModules, jsx (+20 more)

### Community 70 - "Mam Character Sheet Tabs"
Cohesion: 0.12
Nodes (23): MUTATION_ANCHORS, MutationAnchor, applyDemotion(), DO_MUTATE, DO_WRITE, escapeRe(), evaluateMutation(), evaluateTierA() (+15 more)

### Community 71 - "Monster Stat Block & Status"
Cohesion: 0.18
Nodes (14): Props, UseDaggerheartSheetResourcesProps, UseDnd5eDeferredResourceOptions, UseDnd5eSheetResourcesOptions, Pf2eEquipmentBrowserTab, FeatBrowser, Pf2eFeatBrowserTab, Pf2eFeatBrowserTabComponent (+6 more)

### Community 72 - "Dice Panel & Mam3e Resolution"
Cohesion: 0.06
Nodes (54): D20Roll, DualityRoll, rollDuality(), AttackResolution, AttackResolutionInput, resolveAttack(), rollD20(), DaggerheartAttackInput (+46 more)

### Community 73 - "System Validation Logic"
Cohesion: 0.20
Nodes (24): ABILITY_SCORE_IDS, addIssue(), createDnd5eValidator(), Dnd5eValidationData, Dnd5eValidationDataModel, Dnd5eValidationSystemId, featureOptionKey(), isIntegerInRange() (+16 more)

### Community 74 - "Spell Catalog Consistency Tests"
Cohesion: 0.10
Nodes (22): Props, Props, focusPulseSpell, PF2E_DERIVED_TRAITS, PF2E_SCHOOL_TRAITS, PF2E_TRADITIONS, e(), ExpectedSpellIdentity (+14 more)

### Community 75 - "Dnd5e Resource Loading Hooks"
Cohesion: 0.19
Nodes (15): Dnd5eEquipmentTab, Dnd5eFeatBrowserTab, Dnd5eFeaturesTab, Dnd5eMonsterBrowserTab, Dnd5eSpellsTab, useDnd5eDeferredResource(), useDnd5eSheetResources(), defaultOptions (+7 more)

### Community 76 - "Mam Powers & Cost Ledger"
Cohesion: 0.09
Nodes (34): ABILITIES, DEFENSES, MamAbilitiesTab(), Props, MamConditionsTab(), Props, MamHeader(), Props (+26 more)

### Community 77 - "Sync Engine Tests"
Cohesion: 0.11
Nodes (26): SystemEngine, resolveCharacterEffects(), d20LegacyCheckPenalty(), rollD20(), DND35E_CLASS_CATALOG, NOTE: 3.5e class files currently lack full `spellcasting.spellSlots` tables., SKILL_ABILITIES, RFC-003 (+18 more)

### Community 78 - "Dnd5e Feature Options"
Cohesion: 0.07
Nodes (46): Dnd5eFeatureOptionsSection(), Dnd5eFeatureOptionsSectionComponent, FeatureOptionBrowser, FeatureOptionBrowserProps, featureOptionSelectionKey(), Props, FeatureOptionBrowser(), FeatureOptionBrowserProps (+38 more)

### Community 79 - "Document Migrations & Storage"
Cohesion: 0.09
Nodes (42): useDebouncedPersistence(), cloneDocumentsSnapshot(), documentsChanged(), prepareDocumentsWithEngines(), prepareDocumentWithEngine(), useDocuments(), FeatureOptionRoundtripCase, makeSystem() (+34 more)

### Community 80 - "App Header & Auth UI"
Cohesion: 0.14
Nodes (20): AppHeader(), ThemeToggle(), assertNever(), INITIAL_NAV_STATE, LIBRARY_SEGMENTS, LibrarySegment, librarySegmentLabel(), NavAction (+12 more)

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
Cohesion: 0.11
Nodes (34): ManifestCategory, buildSystem(), CATEGORY_LOADERS, CategoryLoader, escape(), isRecord(), Loaded, main() (+26 more)

### Community 86 - "Equipment & Feature Browsers"
Cohesion: 0.11
Nodes (26): clampDaggerheartInventoryQuantity(), createDaggerheartInventoryEntry(), daggerheartInventoryDefinitions, findDaggerheartInventoryDefinitionByName(), getDaggerheartInventoryDefinition(), inventoryDefinitionById, inventoryDefinitionByName, isDaggerheartConsumableDefinition() (+18 more)

### Community 87 - "Pf2e Engine & Constants"
Cohesion: 0.09
Nodes (20): GapLedgerItem, LedgerPhase, LedgerStatus, LedgerTag, LedgerTrack, MASTER_GAP_LEDGER, RFC-003, byPhase (+12 more)

### Community 88 - "Documents Hook & Persistence"
Cohesion: 0.13
Nodes (13): ALLEGIANCE_LABEL, ALLEGIANCE_TOKEN_CLASS, buildTokenLabel(), buildTokensByCell(), SceneGridView, TokenHpBar(), Badge(), BadgeProps (+5 more)

### Community 89 - "Daggerheart Contribution Ledger"
Cohesion: 0.10
Nodes (36): ANCESTRY_ADJUSTMENTS_BY_ID, ancestryByName, classByName, DAGGERHEART_TRAITS, DaggerheartAncestryAdjustments, DaggerheartRange, DEFAULT_DAGGERHEART_ANCESTRY_ADJUSTMENTS, doesDaggerheartPassiveConditionApply() (+28 more)

### Community 91 - "Mam Browser Tabs"
Cohesion: 0.15
Nodes (19): AbilityScores, AreaOfEffect, DamageType, DiceRoll, Duration, Range, ActionDamage, Weapon (+11 more)

### Community 92 - "Pf2e Derived Math"
Cohesion: 0.08
Nodes (39): Props, Pf2eHeader(), Props, Pf2eNotesTab(), Props, createDefaultPf2eData(), Pf2eClassLevel, Pf2eDataModel (+31 more)

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
Cohesion: 0.23
Nodes (11): DicePanel(), DicePanelProps, formatBreakdown(), QUICK_ROLLS, applyKeep(), DiceRollResult, DiceTerm, DiceTermResult (+3 more)

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
Cohesion: 0.26
Nodes (10): DISPOSITION_BADGE, DISPOSITION_LABEL, ReactionHistoryEntry, ReactionPanel(), ReactionPanelProps, dispositionForTotal(), resolveReaction(), rollReaction() (+2 more)

### Community 101 - "Document Storage (IndexedDB)"
Cohesion: 0.07
Nodes (31): CurrencyEditor(), CurrencyEntry, DND_CURRENCIES, Props, InventoryItem, InventoryManager(), InventoryManagerProps, D20EquipmentBrowserTab (+23 more)

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
Nodes (16): AuthContextValue, baseAuthValue, mockedClearQueuedCampaignsSnapshot, mockedClearQueuedDeletedCampaignIds, mockedDeleteRemoteCampaign, mockedFetchRemoteCampaigns, mockedGetQueuedCampaignsSnapshot, mockedGetQueuedDeletedCampaignIds (+8 more)

### Community 106 - "Character Card Presenter"
Cohesion: 0.18
Nodes (17): AbilityScoreGrid(), buildPointBuyDraft(), buildStandardArrayDraft(), clampPointBuyScore(), emptyPointBuyDraft(), emptyStandardArrayDraft(), isStandardArrayComplete(), isValidPointBuyDraft() (+9 more)

### Community 107 - "Oracle Panel & Logic"
Cohesion: 0.06
Nodes (41): NarrateSceneResult, CheckPanel(), CheckPanelProps, OUTCOME_BADGE, OUTCOME_LABEL, SKILL_SUGGESTIONS, CombatPanel(), CombatPanelProps (+33 more)

### Community 108 - "5e Equipment Tab"
Cohesion: 0.12
Nodes (20): SheetProps, SystemSheetComponent, ValidationReason, ValidationSeverity, D20EquipmentBrowserTabComponent, EquipmentBrowser, D20FeatBrowserTabComponent, FeatBrowser (+12 more)

### Community 109 - "Scene Reaction Panel"
Cohesion: 0.15
Nodes (25): applyDnd5eSpeciesTemplate(), buildAbilityChoiceSlots(), buildSpeciesFeatures(), choiceAbilityBonuses(), COMMON_LANGUAGE_OPTIONS, Dnd5eLikeDataModel, Dnd5eSpeciesChoiceSlot, Dnd5eSpeciesTemplateSelections (+17 more)

### Community 110 - "Document Signature Hashing"
Cohesion: 0.27
Nodes (9): makeScene(), campaignSignatureFor(), sameCampaignSignatures(), sameDocumentSignatures(), sameSceneSignatures(), sameSignatureMultisets(), sceneSignatureFor(), signatureFor() (+1 more)

### Community 111 - "Resource Pool Tracking"
Cohesion: 0.31
Nodes (5): SceneNarrationData, NarrateSceneParams, narrateSceneWithAi(), NarrationGatewayCall, RFC-002

### Community 112 - "Bundle Size Check"
Cohesion: 0.15
Nodes (10): appChunk, appChunks, assetsDir, budgets, chunks, dataChunks, jsFiles, largestDataChunk (+2 more)

### Community 113 - "AI Prompt Builders"
Cohesion: 0.29
Nodes (12): EncounterDraftPayload, IdentifyCreaturePayload, IllustrateScenePayload, SceneNarrationPayload, buildEncounterDraftPrompt(), buildIdentifyCreaturePrompt(), buildIllustrateScenePrompt(), buildPromptForTask() (+4 more)

### Community 114 - "5e Feat Browser"
Cohesion: 0.10
Nodes (27): ProficiencyListSection(), Props, BrowserFeat, Dnd5eFeatBrowserTabComponent, FeatBrowser, FeatBrowserProps, Props, ChoiceSlot (+19 more)

### Community 115 - "Project Dependencies"
Cohesion: 0.09
Nodes (23): ai, @ai-sdk/google, class-variance-authority, clsx, lucide-react, dependencies, ai, @ai-sdk/google (+15 more)

### Community 116 - "3.5e Spell Encoder"
Cohesion: 0.23
Nodes (11): resolveSceneAreaEffect(), AreaShape, cellInArea(), cellOnLine(), gridDistance(), tokensInArea(), attackEffect(), fireballDamage() (+3 more)

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
Cohesion: 0.11
Nodes (28): resolveSceneAttack(), collectD20LegacyConditionEffects(), collectDnd5eConditionEffects(), collectPf2eConditionEffects(), ConditionScope, getPf2eConditionStatusPenalty(), highestValue(), magnitude() (+20 more)

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
Nodes (32): MamAdvantageBrowserTab(), Props, MamArchetypeBrowser(), MamArchetypeBrowserProps, MamArchetypeBrowser, MamArchetypesTab, MamArchetypesTabComponent, Props (+24 more)

### Community 130 - "d20LegacySpellcasting.ts"
Cohesion: 0.11
Nodes (26): D20ClassesSection(), D20LegacyClassLevel, renderClassOptions(), d20BonusSpells(), buildD20LegacySpellSlotTotals(), countAdvancementLevels(), D20_DOMAIN_CLASS_IDS, D20_FALLBACK_CASTING_ABILITIES (+18 more)

### Community 131 - "Retry With Backoff"
Cohesion: 0.31
Nodes (7): computeBackoffMs(), isRetryableError(), NON_RETRYABLE_FRAGMENTS, PROD_DEFAULTS, RetryOptions, sleep(), TEST_DEFAULTS

### Community 132 - "2024 Spell Encoder"
Cohesion: 0.39
Nodes (8): main(), mapCastingTime(), mapDuration(), mapRange(), normalizeName(), SCHOOLS, slug(), ts()

### Community 133 - "MAM Power Browser"
Cohesion: 0.31
Nodes (8): formatMamPowerAction(), formatMamPowerDuration(), formatMamPowerRange(), humanizeMamToken(), MamPowerBrowserTabComponent, MamPowerModifierBrowser, Props, SpellBrowser

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
Nodes (9): HIT_DICE, hitDieSize(), hitDieString(), DND5E_CONDITION_NAMES, hasDnd5eCondition(), normalizeConditionId(), normalizeDnd5eConditions(), SKILL_ABILITIES (+1 more)

### Community 141 - "pf2eSpellTraits.test.ts"
Cohesion: 0.12
Nodes (34): SceneCombatStats, CharacterCombatant, buildDaggerheartAdversaryCombatant(), BuildDaggerheartAdversaryResult, DaggerheartAdversaryCombatant, RANGE_CELLS, buildDaggerheartCombatant(), BuildDaggerheartCombatantResult (+26 more)

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

### Community 147 - "Dnd5eEquipmentTab.tsx"
Cohesion: 0.14
Nodes (13): CurrencyEditor, CurrencyEditorProps, Dnd5eEquipmentTabComponent, EquipmentBrowser, EquipmentBrowserItem, EquipmentBrowserProps, EquippedItemsSection, EquippedItemsSectionProps (+5 more)

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
Cohesion: 0.33
Nodes (12): clampCount(), createPool(), isExhausted(), isFull(), poolFromRemaining(), remainingOf(), remainingShape(), reset() (+4 more)

### Community 155 - "5e Movement Rules"
Cohesion: 0.60
Nodes (4): dnd5eCarryingCapacity(), dnd5eHighJump(), dnd5eLongJump(), dnd5ePushDragLift()

### Community 156 - "contributionLedger.ts"
Cohesion: 0.23
Nodes (13): getDaggerheartProficiency(), getDaggerheartTier(), getEquippedDaggerheartArmor(), getEquippedDaggerheartWeapon(), buildDaggerheartContributionLedger(), buildPassiveBonusEntries(), buildPassiveDerivedBonusEntries(), createEntry() (+5 more)

### Community 157 - "MAM Power Modifier Browser"
Cohesion: 0.60
Nodes (3): formatModifierCost(), MamPowerModifierBrowser(), MamPowerModifierBrowserProps

### Community 158 - "MAM Complication Browser"
Cohesion: 0.27
Nodes (5): Dnd5e2024Engine, hasAlertFeat(), totalCharacterLevel(), profBonus(), Dnd5eRulesEdition

### Community 159 - "characterCombatant.test.ts"
Cohesion: 0.36
Nodes (8): d20LegacySpellSaveDC(), dnd5eCantripScaleTier(), dnd5eConcentrationDC(), dnd5ePassivePerception(), Dnd5eSkillProficiency, dnd5eSpellAttackBonus(), dnd5eSpellSaveDC(), pf2eClassOrSpellDC()

### Community 160 - "capabilityScenarios.test.tsx"
Cohesion: 0.27
Nodes (8): SYSTEM_IDS, getSystemAssetPrefetchStateForTests(), prefetchedSystemAssets, prefetchedSystemRuntimeData, prefetchedSystemSheets, prefetchSystemAssetsForIds(), resetSystemAssetPrefetchStateForTests(), systemAssetPrefetchers

### Community 161 - "PF2e Backgrounds Data"
Cohesion: 0.50
Nodes (3): Pf2eBackgroundChoice, Pf2eBackgroundDefinition, Pf2eBackgroundFeatGrant

### Community 175 - "syncTombstones.ts"
Cohesion: 0.31
Nodes (11): NOW, getSyncTombstonedIds(), getSyncTombstones(), pruneExpired(), readStored(), recordSyncTombstones(), removeSyncTombstones(), STORAGE_KEYS (+3 more)

### Community 177 - "useSceneEncounter.ts"
Cohesion: 0.36
Nodes (7): draftEncounterWithAi(), fileToAiImageInput(), readAsDataUrl(), isMonsterSystemId(), RFC-006, useSceneEncounter(), summarizeEncounterPlan()

### Community 179 - "featTemplate.test.ts"
Cohesion: 0.36
Nodes (5): clampExhaustion(), Props, RestControls(), D20LegacyHeader(), D20LegacySheet()

### Community 180 - "daggerheart-engine.test.ts"
Cohesion: 0.24
Nodes (9): createDefaultDaggerheartData(), dhDoc(), DaggerheartDomainCardEntry, daggerheartPassiveAuditAttributes, makeDoc(), makeDomainCardEntry(), makePassiveAuditSystem(), passiveAuditSignature() (+1 more)

### Community 181 - "sceneTerrain.ts"
Cohesion: 0.25
Nodes (4): Dnd5e2024SystemDef, Dnd5eSystemDef, createRegistry(), TEST_DATE

### Community 183 - "loadEquipmentForSystem"
Cohesion: 0.50
Nodes (3): Answer, Outcome, Q: where are pending debounced document saves flushed to localStorage on page hide or unload (persistence flush)

### Community 184 - "EncounterPanel.tsx"
Cohesion: 0.21
Nodes (11): EncounterPanelProps, EncounterMonsterSelection, EncounterPartySummary, EncounterPlanSummary, DraftEncounterResult, EncounterDifficulty, EncounterSpec, EncounterSpecIssue (+3 more)

## Knowledge Gaps
- **1112 isolated node(s):** `browser`, `es2021`, `node`, `eslint:recommended`, `plugin:@typescript-eslint/recommended` (+1107 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **20 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `CharacterDocument` connect `Daggerheart Combatant Builders` to `Daggerheart Sheet Automation`, `Dnd5e Equipment & Features UI`, `Dnd5e Background Templates`, `Dnd5e2024 Engine & Hit Dice`, `Daggerheart Engine`, `Dnd5e Sheets & E2E Tests`, `Scene Combat Resolution`, `Dnd5e Class Templates`, `pf2eConditions.ts`, `pf2eSpellTraits.test.ts`, `Dnd5e Activity Definitions`, `Dnd5e Feat Templates`, `D20 Combat Controls`, `Combat & Recap Panels`, `D20 Legacy System Engines`, `Dnd35e Saves & Data Model`, `System Registry & Renderer`, `Campaign Sync Hooks`, `Daggerheart Inventory`, `Pf2e Character Templates`, `contributionLedger.ts`, `Dnd5e Feature List Sections`, `MAM Complication Browser`, `Encounter & Initiative Panels`, `Class Enhancement & Headers`, `Pf2e Sheet Tabs`, `Quest & Session Log UI`, `Currency & Inventory Editors`, `Document Sync Engine`, `Condition Effects by System`, `useSceneEncounter.ts`, `D20 Legacy Templates`, `featTemplate.test.ts`, `daggerheart-engine.test.ts`, `sceneTerrain.ts`, `tokenPlacement.ts`, `System Definitions & Types`, `D20 Legacy Spell Slots`, `Spells Tab Components`, `Character Effects Compilation`, `Monster Stat Block & Status`, `System Validation Logic`, `Mam Powers & Cost Ledger`, `Sync Engine Tests`, `Dnd5e Feature Options`, `Document Migrations & Storage`, `App Header & Auth UI`, `Combat Toggles & Conditions`, `Boundary Validation Tests`, `Equipment & Feature Browsers`, `Daggerheart Contribution Ledger`, `Pf2e Derived Math`, `Mam3e Derived Math`, `Document Storage (IndexedDB)`, `5e Equipment Tab`, `Scene Reaction Panel`, `Document Signature Hashing`?**
  _High betweenness centrality (0.126) - this node is a cross-community bridge._
- **Why does `react` connect `D20 Class Spellcasting` to `Sheet Resource Loading Hooks`, `Toast Notifications`, `Dnd5e Equipment & Features UI`, `d20LegacySpellcasting.ts`, `Dnd5e Sheets & E2E Tests`, `Daggerheart Engine`, `MAM Power Browser`, `Tabs UI Component`, `Scene Combat Resolution`, `Dnd5e Class Templates`, `Scene Check Panel`, `Monster & NPC Generator`, `D20 Combat Controls`, `Dnd5eEquipmentTab.tsx`, `Combat & Recap Panels`, `Equipment Browser Component`, `Feat Browser Component`, `Campaign Sync Hooks`, `Dnd5e Feature List Sections`, `MAM Power Modifier Browser`, `Class Enhancement & Headers`, `Pf2e Sheet Tabs`, `Quest & Session Log UI`, `Currency & Inventory Editors`, `Document Sync Engine`, `Sheet Header & Stat Cards`, `Mam3e Data Model & Engine`, `Condition Effects by System`, `Equipped Armor Section`, `Spell Browser UI`, `Error Boundary & Auth Context`, `Scene Management Hooks`, `Monster Combatant Builder`, `useSceneEncounter.ts`, `featTemplate.test.ts`, `Spell Preparation Logic`, `Campaign Storage & Hooks`, `D20 Legacy Templates`, `Daggerheart Combatant Builders`, `System Definitions & Types`, `ESLint Config`, `Spells Tab Components`, `Monster Stat Block & Status`, `Dnd5e Resource Loading Hooks`, `Mam Powers & Cost Ledger`, `Dnd5e Feature Options`, `Document Migrations & Storage`, `App Header & Auth UI`, `Combat Toggles & Conditions`, `capabilityScenarios.test.tsx`, `Equipment & Feature Browsers`, `Documents Hook & Persistence`, `Pf2e Derived Math`, `Skills Tab & Combat Math`, `Pf2e Spell Types & Traits`, `Document Storage (IndexedDB)`, `AI Creature Identification`, `Character Card Presenter`, `Oracle Panel & Logic`, `5e Equipment Tab`, `5e Feat Browser`, `Campaign File Transfer`?**
  _High betweenness centrality (0.109) - this node is a cross-community bridge._
- **Why does `GameSystemId` connect `Monster Stat Block & Status` to `Sheet Resource Loading Hooks`, `Toast Notifications`, `d20LegacySpellcasting.ts`, `Dnd5e Equipment & Features UI`, `Scene Combat Resolution`, `Dnd5e Class Templates`, `pf2eConditions.ts`, `Game System Selector`, `Dnd35e Saves & Data Model`, `Roadmap Metrics Generator`, `Class Enhancement & Headers`, `Pf2e Sheet Tabs`, `capabilityScenarios.test.tsx`, `Quest & Session Log UI`, `Currency & Inventory Editors`, `Document Sync Engine`, `Doc Drift Rules`, `Condition Effects by System`, `useSceneEncounter.ts`, `D20 Legacy Templates`, `Spell Preparation Logic`, `Character Combatant Builder`, `SRD Manifest Generator`, `Daggerheart Combatant Builders`, `SRD Coverage Script`, `Character Effects Compilation`, `Dnd5e Resource Loading Hooks`, `Mam Powers & Cost Ledger`, `capabilityScenarios.test.tsx`, `Equipment & Feature Browsers`, `Document Storage (IndexedDB)`, `5e Equipment Tab`?**
  _High betweenness centrality (0.067) - this node is a cross-community bridge._
- **What connects `browser`, `es2021`, `node` to the rest of the system?**
  _1112 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Sheet Resource Loading Hooks` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._
- **Should `Dnd5e Sheets & E2E Tests` be split into smaller, more focused modules?**
  _Cohesion score 0.09782608695652174 - nodes in this community are weakly interconnected._
- **Should `Dnd5e Equipment & Features UI` be split into smaller, more focused modules?**
  _Cohesion score 0.14587737843551796 - nodes in this community are weakly interconnected._