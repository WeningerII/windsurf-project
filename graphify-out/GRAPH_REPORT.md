# Graph Report - windsurf-project  (2026-07-10)

## Corpus Check
- 684 files · ~476,570 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 4249 nodes · 12042 edges · 186 communities (177 shown, 9 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 101 edges (avg confidence: 0.71)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `9f0dd2fa`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Sheet Resource Loading Hooks
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
- templateShared.ts

## God Nodes (most connected - your core abstractions)
1. `CharacterDocument` - 229 edges
2. `SystemDataModel` - 125 edges
3. `GameSystemId` - 79 edges
4. `EffectInstance` - 61 edges
5. `makeEffectId()` - 54 edges
6. `abilityMod()` - 54 edges
7. `Dnd5eDataModel` - 49 edges
8. `Feature` - 44 edges
9. `scripts` - 43 edges
10. `SystemRegistry` - 42 edges

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

## Communities (186 total, 9 thin omitted)

### Community 0 - "Sheet Resource Loading Hooks"
Cohesion: 0.11
Nodes (41): useDaggerheartSheetResources(), finalizeLoadedItems(), loadClassesForSystem(), loadDaggerheartAdversariesForSystem(), loadDaggerheartAncestries(), loadDaggerheartAncestriesForSystem(), loadDaggerheartArmor(), loadDaggerheartArmorForSystem() (+33 more)

### Community 2 - "Dnd5e Equipment & Features UI"
Cohesion: 0.09
Nodes (42): EquippedItemsSection(), Props, SLOT_LABELS, SLOT_ORDER, NormalizedSheet, createDefaultDnd5e2024Data(), Dnd5e2024DataModel, Dnd5e2024TemplateState (+34 more)

### Community 3 - "Dnd5e Background Templates"
Cohesion: 0.05
Nodes (77): Dnd5eSelectedFeatsSection(), Props, getEligibleDnd5eFeatureOptions(), countSelections(), Dnd5eLikeDataModel, Dnd5eSheetMutators, featureOptionSelectionKey(), optionDisabledForRequirement() (+69 more)

### Community 4 - "Dnd5e2024 Engine & Hit Dice"
Cohesion: 0.07
Nodes (32): HIT_DICE, hitDieSize(), hitDieString(), DND5E_CONDITION_NAMES, hasDnd5eCondition(), normalizeConditionId(), normalizeDnd5eConditions(), Dnd5eEngineBase (+24 more)

### Community 5 - "Daggerheart Engine"
Cohesion: 0.09
Nodes (42): applyDnd5eSubclassTemplate(), assertMulticlassRequirements(), ATTRIBUTE_NAME_TO_ID, buildChoiceSlots(), buildDerivedProficiencies(), buildSpellcastingState(), canSelectSubclass(), classFeaturesAtLevel() (+34 more)

### Community 6 - "3.5e Monster Data Encoder"
Cohesion: 0.09
Nodes (35): ALIGNMENTS, DICE_PROGRESSIONS, main(), mapAlignment(), mod(), MONSTER_SIZE, normalizeName(), OLIMOT_FILES (+27 more)

### Community 7 - "Tabs UI Component"
Cohesion: 0.15
Nodes (21): DaggerheartCharacterBasicsSection(), Props, DaggerheartDomainCardsSection(), Props, DaggerheartNotesSection(), Props, DaggerheartReferenceLibrarySection(), Props (+13 more)

### Community 8 - "Node Runtime Bootstrap"
Cohesion: 0.09
Nodes (48): main(), runBootstrapNodeInstall(), getPinnedCommandArgs(), main(), runPinnedNpmCommand(), formatRuntimeDoctorReport(), main(), readWorkflowPinSource() (+40 more)

### Community 9 - "Scene Combat Resolution"
Cohesion: 0.07
Nodes (40): illustrateSceneWithAi(), SceneManager(), appendSceneEvent(), applySceneIntents(), createSceneDocument(), foldSceneEvents(), resolveSceneAction(), SceneActionOptions (+32 more)

### Community 10 - "Dnd5e Class Templates"
Cohesion: 0.14
Nodes (30): applyAbilityAdjustments(), applyD20LegacyClassTemplate(), applyD20LegacyRaceTemplate(), buildClassSkills(), classFeaturesUpToLevel(), classSkillOptions(), collectClassFeatureSignatures(), create35eClassLevel() (+22 more)

### Community 11 - "System Compute Registers"
Cohesion: 0.17
Nodes (15): daggerheartComputeRegister, dnd35eComputeRegister, dnd5e2014ComputeRegister, dnd5e2024ComputeRegister, COMPUTE_REGISTERS, registerForSystem(), mam3eComputeRegister, pf1eComputeRegister (+7 more)

### Community 12 - "Scene Check Panel"
Cohesion: 0.14
Nodes (19): Props, State, LegalNotices(), LegalNoticesProps, licenseTexts, MonsterStatBlock(), Button, Card (+11 more)

### Community 13 - "Dnd5e Activity Definitions"
Cohesion: 0.09
Nodes (27): buildDefenseStyleActivity(), buildDivineSmiteActivities(), buildDivineSmiteActivity(), buildDnd5eActivityDefinitions(), buildUnsupportedDivineSmiteActivity(), divineSmiteSlotLevel(), Dnd5eActivityCost, Dnd5eActivityCostKind (+19 more)

### Community 14 - "Monster & NPC Generator"
Cohesion: 0.10
Nodes (32): FeaturesSection(), Props, formatBackgroundToolLabel(), applyDnd5eClassTemplate(), removeDnd5eClassTemplate(), ChoiceSlot, Dnd5eBackgroundSection(), Props (+24 more)

### Community 15 - "Dnd5e Feat Templates"
Cohesion: 0.08
Nodes (22): Dnd5eSheet(), createDefaultDnd5eData(), Dnd5eEngine, applyDnd5eLongRest(), applyDnd5eShortRest(), recoverAllSpellSlots(), recoverFeatures(), recoverLongRestHitDice() (+14 more)

### Community 16 - "App Shell & Layout"
Cohesion: 0.20
Nodes (17): mockedGetQueuedCampaignsSnapshot, mockedGetQueuedDeletedCampaignIds, mockedGetQueuedDeletedDocumentIds, mockedGetQueuedSyncSnapshot, getQueuedCampaignsSnapshot(), getQueuedDeletedCampaignIds(), getQueuedDeletedDocumentIds(), getQueuedSyncSnapshot() (+9 more)

### Community 17 - "D20 Combat Controls"
Cohesion: 0.08
Nodes (25): DamageHealControl(), DamageHealControlProps, clampExhaustion(), Props, RestControls(), CombatStatCard(), Props, Props (+17 more)

### Community 18 - "Game System Selector"
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

### Community 19 - "Combat & Recap Panels"
Cohesion: 0.43
Nodes (5): getEditableTarget(), KeyboardShortcut, useKeyboardNavigation(), Harness(), HarnessProps

### Community 20 - "D20 Legacy System Engines"
Cohesion: 0.11
Nodes (24): dnd35eAbilityIncreases(), dnd35eConcentrationDCDamage(), dnd35eConcentrationDCDefensive(), dnd35eFeatsFromLevel(), dnd35eHpState, dnd35eTriggersMassiveDamage(), dnd35eXpForLevel(), pf1eConcentrationDCDamage() (+16 more)

### Community 21 - "Dnd35e Saves & Data Model"
Cohesion: 0.08
Nodes (32): Props, Props, createDefaultDnd35eData(), Dnd35eClassLevel, Dnd35eDataModel, Dnd35eFeat, Dnd35eManualSpellcastingExtras, Dnd35eSaves (+24 more)

### Community 22 - "Daggerheart Data Model"
Cohesion: 0.16
Nodes (22): EMPTY_WEAPON_LOADOUT, GetDaggerheartSheetStateProps, UseDaggerheartTemplateHandlersProps, DaggerheartAdversaryRole, DaggerheartAncestry, DaggerheartArmor, DaggerheartClass, DaggerheartCommunity (+14 more)

### Community 23 - "System Registry & Renderer"
Cohesion: 0.06
Nodes (25): SystemRegistry, SheetProps, SystemDefinition, ValidationContext, ValidationReason, ValidationResult, ValidationSeverity, Dnd5e2024SystemDef (+17 more)

### Community 24 - "Game Rules & Proficiencies"
Cohesion: 0.07
Nodes (33): GAME_RULES, ArmorProficiency, ArmorProficiencyType, GamingSetProficiency, isValidArmorProficiency(), isValidSkillProficiency(), isValidToolProficiency(), isValidWeaponProficiency() (+25 more)

### Community 25 - "Campaign Sync Hooks"
Cohesion: 0.19
Nodes (23): useCampaignSync(), mockedGetSupabaseClient, getSupabaseClient(), clearQueuedCampaignsSnapshot(), deleteRemoteCampaign(), fetchRemoteCampaigns(), fromRemoteCampaign(), getCurrentUserId() (+15 more)

### Community 26 - "Daggerheart Inventory"
Cohesion: 0.12
Nodes (25): ancestryLookup, armorLookup, buildLookup(), classLookup, communityLookup, DEFAULTS, domainCardByName, domainCardByNameAndDomain (+17 more)

### Community 27 - "Pf2e Character Templates"
Cohesion: 0.11
Nodes (40): abilityBoostValue(), ancestryFeatures(), applyAbilityAdjustments(), applyPf2eAncestryTemplate(), applyPf2eArchetypeTemplate(), applyPf2eBackgroundTemplate(), applyPf2eClassTemplate(), archetypeSource() (+32 more)

### Community 28 - "Roadmap Metrics Generator"
Cohesion: 0.12
Nodes (27): applyRepoResidentOverrides(), buildComputeCompletion(), buildContentCompletion(), buildMarkdownReport(), ComputeCompletionRow, computeMetrics(), ContentCompletionRow, createEmptyCategoryCounts() (+19 more)

### Community 29 - "Dnd5e Feature List Sections"
Cohesion: 0.12
Nodes (27): DiceRollButton(), DiceRollButtonProps, RollResult, Dnd5eSavesTab(), Props, Dnd5eSkillsTab(), Props, SkillDefinition (+19 more)

### Community 30 - "Encounter & Initiative Panels"
Cohesion: 0.11
Nodes (30): ArtisanToolProficiency, MusicalInstrumentProficiency, appendInventoryFromBackground(), applyDnd5eBackgroundTemplate(), BackgroundChoiceSlot, BackgroundChoiceValue, backgroundDerivedState(), COMMON_LANGUAGE_OPTIONS (+22 more)

### Community 31 - "Class Enhancement & Headers"
Cohesion: 0.09
Nodes (27): casterTypes, classResourcesNeeded, classTags, ABILITY_TOKEN_MAP, collectAlwaysPreparedByLevelSources(), collectAlwaysPreparedGrantSources(), evaluatePreparedCasterFormula(), getDnd5eAlwaysPreparedSpellIds() (+19 more)

### Community 32 - "Pf2e Sheet Tabs"
Cohesion: 0.10
Nodes (36): ABILITY_NAMES, formatPf2eOptionLabel(), Pf2eAbilitiesTab(), Props, Pf2eArchetypesTab(), Props, Pf2eInventoryTab(), Props (+28 more)

### Community 33 - "AI Encounter Drafting"
Cohesion: 0.13
Nodes (23): EncounterMonsterSelection, DIFFICULTY_COLUMN, DraftEncounterParams, DraftEncounterResult, ENCOUNTER_BUDGET_SYSTEMS, EncounterBudgetSystem, encounterPartyBudget(), monsterEncounterCost() (+15 more)

### Community 34 - "Quest & Session Log UI"
Cohesion: 0.12
Nodes (32): Props, QuestList(), STATUS_BADGE, STATUS_OPTIONS, DATE_FORMAT, Props, SessionLog(), UseCampaignSyncOptions (+24 more)

### Community 35 - "Currency & Inventory Editors"
Cohesion: 0.10
Nodes (20): CombatTogglesSection(), Props, Condition, ConditionPicker(), Props, availablePf2eToggles(), collectPf2eRiderEffects(), PF2E_TOGGLE_IDS (+12 more)

### Community 36 - "Document Sync Engine"
Cohesion: 0.20
Nodes (13): Dnd5eFeatureOptionsSection(), Dnd5eFeatureOptionsSectionComponent, FeatureOptionBrowser, FeatureOptionBrowserProps, featureOptionSelectionKey(), Props, FeatureOptionBrowser(), FeatureOptionBrowserProps (+5 more)

### Community 37 - "Sheet Header & Stat Cards"
Cohesion: 0.11
Nodes (22): Tabs, TabsContent, TabsContentProps, TabsContext, TabsContextValue, TabsList, TabsProps, TabsTrigger (+14 more)

### Community 38 - "Check & Oracle Resolution"
Cohesion: 0.09
Nodes (43): resolveCheck(), BuildEncounterEventsResult, footprintWithinGrid(), isOracleAnswer(), isOracleOdds(), ODDS_TARGET, ORACLE_ODDS, ORACLE_ODDS_LABEL (+35 more)

### Community 39 - "Mam3e Data Model & Engine"
Cohesion: 0.13
Nodes (19): clampTrack(), DeathSaves, DeathSavesTracker(), Props, HitDiceTracker(), Props, Props, SLOT_LEVELS (+11 more)

### Community 40 - "Doc Drift Rules"
Cohesion: 0.07
Nodes (51): DOC_DRIFT_MANIFEST, DocDriftRuleType, DocDriftSurface, DocDriftSurfaceKind, CAPABILITY_PHRASE_RULES, CapabilityPhraseRule, capitalizeSupportLevel(), COMMAND_RUNTIME_RULES (+43 more)

### Community 41 - "NPM Build Scripts"
Cohesion: 0.05
Nodes (43): scripts, bootstrap:node, build, check:bundle-size, check:compute-register, check:compute-register:mutate, check:compute-register:write, check:dead-code (+35 more)

### Community 42 - "Condition Effects by System"
Cohesion: 0.11
Nodes (21): AppContent(), cloneSystemData(), LegalNotices, SceneManager, STORAGE_WARNING_THRESHOLD, CampaignManager(), CharacterListView(), CharacterSortOption (+13 more)

### Community 43 - "Equipped Armor Section"
Cohesion: 0.10
Nodes (28): EquipArmorInput, EquipEntry, EquippedArmorSection(), EquipShieldInput, Props, D20EquipmentBrowserTabComponent, EquipmentBrowser, Props (+20 more)

### Community 44 - "Spell Browser UI"
Cohesion: 0.08
Nodes (41): SpellBrowser(), SpellBrowserProps, SpellBrowserSpell, D20SpellBrowserPanelComponent, Props, SpellBrowser, toSpellBrowserSpell(), Dnd5eSpellsTabComponent (+33 more)

### Community 45 - "Scene Combat Area Effects"
Cohesion: 0.08
Nodes (57): resolveSceneAreaEffect(), SceneAreaEffectOutcome, SceneAttackOutcome, SceneRoundOutcome, AreaShape, cellInArea(), cellOnLine(), gridDistance() (+49 more)

### Community 46 - "Error Boundary & Auth Context"
Cohesion: 0.13
Nodes (17): AuthContextValue, clearLocalDataForAccountChange(), getLastSyncedUserId(), setLastSyncedUserId(), AuthProvider(), AuthCallback, mockedGetSupabaseClient, mockedIsSupabaseConfigured (+9 more)

### Community 47 - "Encounter Builder Logic"
Cohesion: 0.17
Nodes (15): buildNotice(), FetchTarget, fetchValidated(), HTML_ENTITIES, looksLikeHtml(), main(), normalize(), noticePath (+7 more)

### Community 48 - "Scene Management Hooks"
Cohesion: 0.25
Nodes (16): NOW, collectValidScenes(), deleteScene(), exportScenes(), hydrateScene(), hydrateSceneEvent(), importScenes(), ImportScenesResult (+8 more)

### Community 49 - "Monster Combatant Builder"
Cohesion: 0.10
Nodes (20): CR_XP_TABLE, formatChallengeRating(), MonsterBrowser(), MonsterBrowserProps, MonsterStatBlockProps, GeneratedNpc, Dnd5eMonsterBrowserTabComponent, MonsterBrowser (+12 more)

### Community 50 - "D20 Legacy Templates"
Cohesion: 0.24
Nodes (17): availableD20LegacyToggles(), Props, D20LegacyData, D20LegacySpellSlots, getIterativeAttackBonuses(), recoverD20LegacySpellSlot(), resetD20LegacySpellSlots(), setD20LegacyPreparedSpell() (+9 more)

### Community 51 - "Campaign Storage & Hooks"
Cohesion: 0.19
Nodes (17): useCampaigns(), DebouncedPersistence, IMPORTANT: a begun generation must end in either `persist` or, hostileStorage, CAMPAIGNS_STORAGE_KEY, clearCampaignStorage(), importCampaigns(), importCampaignsWithReport() (+9 more)

### Community 52 - "Spell Preparation Logic"
Cohesion: 0.17
Nodes (15): categoryIcons, GameSystemSelector(), systemAccents, supportBadgeLabels, supportBadgeStyles, buildInitialSummaryStates(), categoryDisplay, SummaryState (+7 more)

### Community 53 - "Dev Dependencies"
Cohesion: 0.07
Nodes (30): devDependencies, autoprefixer, eslint, eslint-config-prettier, eslint-plugin-react, eslint-plugin-react-hooks, eslint-plugin-react-refresh, fake-indexeddb (+22 more)

### Community 54 - "Character Combatant Builder"
Cohesion: 0.07
Nodes (48): CharacterEffectInputs, ResolvedCharacterEffects, compileEquipmentEffects(), equipStackPolicy(), isMeaningful(), MagicBonusItem, TYPED_STACK_SYSTEMS, compileModifierEffects() (+40 more)

### Community 55 - "D20 Class Spellcasting"
Cohesion: 0.16
Nodes (15): Mode, SignIn(), SignInProps, UserMenu(), UserMenuProps, AuthContext, useAuth(), EntitySyncAdapter (+7 more)

### Community 56 - "SRD Manifest Generator"
Cohesion: 0.14
Nodes (18): D20_LEGACY_CONDITION_NAMES, D20_LEGACY_TOGGLE_LABELS, D20EquipmentBrowserTab, D20FeatBrowserTab, D20FeatsTab(), FeatEntry, Props, countTrainedSkills() (+10 more)

### Community 57 - "Daggerheart Combatant Builders"
Cohesion: 0.06
Nodes (53): Props, CharacterCard(), CharacterCardProps, CharacterListViewProps, UseSceneEncounterParams, Props, Props, SystemSheetRenderer() (+45 more)

### Community 58 - "AI Gateway Adapters"
Cohesion: 0.12
Nodes (20): createGeminiAdapter(), IMAGE_TASKS, TASK_SCHEMAS, AI_GATEWAY_SCHEMA_VERSION, aiFailure, AiResponse, AiTask, AiProviderAdapter (+12 more)

### Community 59 - "AI Gateway Contracts"
Cohesion: 0.14
Nodes (26): AI_GATEWAY_TASKS, AiFailureCode, AiParse, AiSuccess, AiUsage, EncounterDraftRequest, IdentifyCreatureRequest, IllustrateSceneRequest (+18 more)

### Community 60 - "System Definitions & Types"
Cohesion: 0.16
Nodes (17): getDaggerheartAncestryAdjustments(), applyDaggerheartAncestryTemplate(), applyDaggerheartClassTemplate(), applyDaggerheartCommunityTemplate(), classTemplateItems(), communityTemplateItems(), DaggerheartInventoryEntry, DEFAULTS (+9 more)

### Community 61 - "D20 Legacy Spell Slots"
Cohesion: 0.17
Nodes (20): buildEncounterSceneEvents(), buildInitiativeEntries(), buildOccupiedCells(), clampInteger(), compareTokenIds(), EncounterBuilderIssue, EncounterPartyMember, EncounterPlanEntry (+12 more)

### Community 62 - "SRD Coverage Script"
Cohesion: 0.11
Nodes (25): cats5e2014, cats5e2024, CoverageTarget, csvRows(), extractJsArray(), extractNameValues(), fetchCsvNames(), fetchJsArrayNames() (+17 more)

### Community 63 - "ESLint Config"
Cohesion: 0.08
Nodes (25): jsx, env, browser, es2021, node, extends, ignorePatterns, overrides (+17 more)

### Community 64 - "Spells Tab Components"
Cohesion: 0.21
Nodes (15): compareSpells(), D20SpellsTab(), formatSpellLevel(), titleCase(), D20_ARCANE_SCHOOLS, D20_LEGACY_MANUAL_NOTES, buildSpellPreparationConcepts(), compareSpellEntries() (+7 more)

### Community 65 - "Browser Compat & Error Logging"
Cohesion: 0.16
Nodes (13): defaultOptions, BrowserCapabilities, checkBrowserCapabilities(), initBrowserCompat(), isBrowserSupported(), showCompatibilityWarning(), ErrorCategory, ErrorLog (+5 more)

### Community 66 - "AI Gateway Client"
Cohesion: 0.39
Nodes (5): AI_GATEWAY_ENDPOINT, AiRequest, callAiGateway(), isAiEnabled(), payload

### Community 67 - "2024 Monster Data Encoder"
Cohesion: 0.16
Nodes (23): ABILITIES, ALIGNMENTS, bucketFor(), classifyImmunityList(), cleanProse(), CR_FRACTIONS, CREATURE_TYPES, DAMAGE_TYPES (+15 more)

### Community 68 - "Character Effects Compilation"
Cohesion: 0.10
Nodes (26): buildCharacterCombatant(), BuildCharacterCombatantResult, CharacterCombatant, normalizeSheet(), readArmorClass(), toMagicBonusItems(), toModifierSources(), AttackEconomy (+18 more)

### Community 69 - "TypeScript Config"
Cohesion: 0.08
Nodes (23): compilerOptions, allowImportingTsExtensions, baseUrl, forceConsistentCasingInFileNames, isolatedModules, jsx, lib, module (+15 more)

### Community 70 - "Mam Character Sheet Tabs"
Cohesion: 0.12
Nodes (23): MUTATION_ANCHORS, MutationAnchor, applyDemotion(), DO_MUTATE, DO_WRITE, escapeRe(), evaluateMutation(), evaluateTierA() (+15 more)

### Community 71 - "Monster Stat Block & Status"
Cohesion: 0.08
Nodes (36): GameSystemSelectorProps, useLazyResource(), useSystemOptions(), D20FeatBrowserTabComponent, FeatBrowser, Props, useD20LegacySheetResources(), UseD20LegacySheetResourcesProps (+28 more)

### Community 72 - "Dice Panel & Mam3e Resolution"
Cohesion: 0.06
Nodes (45): DicePanel(), DicePanelProps, formatBreakdown(), QUICK_ROLLS, DISPOSITION_BADGE, DISPOSITION_LABEL, ReactionHistoryEntry, ReactionPanel() (+37 more)

### Community 73 - "System Validation Logic"
Cohesion: 0.20
Nodes (24): ABILITY_SCORE_IDS, addIssue(), createDnd5eValidator(), Dnd5eValidationData, Dnd5eValidationDataModel, Dnd5eValidationSystemId, featureOptionKey(), isIntegerInRange() (+16 more)

### Community 74 - "Spell Catalog Consistency Tests"
Cohesion: 0.15
Nodes (15): e(), ExpectedSpellIdentity, iconicSpellExpectations, SystemKey, systems, dedupeById(), Identified, indexById() (+7 more)

### Community 75 - "Dnd5e Resource Loading Hooks"
Cohesion: 0.22
Nodes (14): Dnd5eEquipmentTab, Dnd5eFeatBrowserTab, Dnd5eFeaturesTab, Dnd5eMonsterBrowserTab, Dnd5eSpellsTab, useDnd5eDeferredResource(), useDnd5eSheetResources(), loadBackgroundsForSystem() (+6 more)

### Community 76 - "Mam Powers & Cost Ledger"
Cohesion: 0.05
Nodes (74): ABILITIES, DEFENSES, MamAbilitiesTab(), Props, MamArchetypeBrowser(), MamArchetypeBrowserProps, MamComplicationBrowser, MamComplicationsTabComponent (+66 more)

### Community 77 - "Sync Engine Tests"
Cohesion: 0.15
Nodes (19): resolveCharacterEffects(), d20LegacyCheckPenalty(), rollD20(), DND35E_CLASS_CATALOG, NOTE: 3.5e class files currently lack full `spellcasting.spellSlots` tables., SKILL_ABILITIES, RFC-003, Pf1eDataModel (+11 more)

### Community 78 - "Dnd5e Feature Options"
Cohesion: 0.14
Nodes (23): appendBulletList(), applyDnd5eFeatureOptionSelection(), ClassLevelLike, DND5E_FEATURE_OPTION_GROUP_LABELS, DND5E_FEATURE_OPTION_SOURCE_LABELS, DOMAIN_SUBCLASS_IDS, featureIdForOption(), FeatureOptionState (+15 more)

### Community 79 - "Document Migrations & Storage"
Cohesion: 0.07
Nodes (50): ToastContext, ToastContextValue, ToastItem, ToastProvider(), VARIANT_ICONS, VARIANT_STYLES, cloneDocumentsSnapshot(), documentsChanged() (+42 more)

### Community 80 - "App Header & Auth UI"
Cohesion: 0.14
Nodes (21): AppHeader(), AppHeaderProps, ThemeToggle(), assertNever(), INITIAL_NAV_STATE, LIBRARY_SEGMENTS, LibrarySegment, librarySegmentLabel() (+13 more)

### Community 81 - "Combat Toggles & Conditions"
Cohesion: 0.07
Nodes (31): useEntitySync(), Doc, useSync(), UseSyncOptions, baseAuthValue, mockedClearQueuedDeletedDocumentIds, mockedClearQueuedSyncSnapshot, mockedDeleteRemoteDocument (+23 more)

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
Cohesion: 0.14
Nodes (21): ManifestCategory, buildSystem(), CATEGORY_LOADERS, CategoryLoader, escape(), isRecord(), Loaded, main() (+13 more)

### Community 86 - "Equipment & Feature Browsers"
Cohesion: 0.18
Nodes (17): clampDaggerheartInventoryQuantity(), createDaggerheartInventoryEntry(), daggerheartInventoryDefinitions, findDaggerheartInventoryDefinitionByName(), getDaggerheartInventoryDefinition(), inventoryDefinitionById, inventoryDefinitionByName, normalizeDaggerheartCurrency() (+9 more)

### Community 87 - "Pf2e Engine & Constants"
Cohesion: 0.09
Nodes (20): GapLedgerItem, LedgerPhase, LedgerStatus, LedgerTag, LedgerTrack, MASTER_GAP_LEDGER, RFC-003, byPhase (+12 more)

### Community 88 - "Documents Hook & Persistence"
Cohesion: 0.14
Nodes (15): Badge(), BadgeProps, badgeVariants, Dnd5eWeaponMasteriesTab(), Props, MamAdvantageBrowserTab(), Props, MamNotesTab() (+7 more)

### Community 89 - "Daggerheart Contribution Ledger"
Cohesion: 0.10
Nodes (33): ANCESTRY_ADJUSTMENTS_BY_ID, ancestryByName, classByName, DAGGERHEART_TRAITS, DaggerheartAncestryAdjustments, DaggerheartRange, DEFAULT_DAGGERHEART_ANCESTRY_ADJUSTMENTS, doesDaggerheartPassiveConditionApply() (+25 more)

### Community 91 - "Mam Browser Tabs"
Cohesion: 0.39
Nodes (4): ServiceWorkerUpdateBanner(), isServiceWorkerSupported(), ServiceWorkerUpdateState, useServiceWorkerUpdate()

### Community 92 - "Pf2e Derived Math"
Cohesion: 0.19
Nodes (15): CREATURE_XP_BY_LEVEL_DIFF, pf2eAttackModifier(), pf2eCreatureXP(), Pf2eDegree, pf2eDyingAfterRecovery(), pf2eEncounterBudget(), pf2eInitialDying(), pf2eIsDead() (+7 more)

### Community 93 - "TypeDoc Config"
Cohesion: 0.11
Nodes (17): typedoc, categorizeByGroup, entryPoints, entryPointStrategy, excludeExternals, excludePrivate, excludeProtected, includeVersion (+9 more)

### Community 94 - "Pf2e Spell Data Encoder"
Cohesion: 0.20
Nodes (17): BLOODLINE_TRADITIONS, CLASS_TRADITIONS, CLASS_TRAITS, detag(), flattenEntries(), main(), mapCast(), mapDuration() (+9 more)

### Community 95 - "Sync Tombstones"
Cohesion: 0.13
Nodes (12): app, ccBy, checks, component, dpcgl, failures, license, notice (+4 more)

### Community 96 - "Skills Tab & Combat Math"
Cohesion: 0.17
Nodes (18): Dnd5eTemplateState, AddEntryInput, buildAlwaysPreparedSpellEntries(), buildArmorClassEntries(), buildDnd5eContributionLedger(), buildFeatAutomationEntries(), buildListEntry(), buildTemplateProficiencyEntries() (+10 more)

### Community 97 - "Mam3e Derived Math"
Cohesion: 0.22
Nodes (8): createDefaultPf2eData(), makeDoc(), archetypeIds, makeSystem(), reloadSingleDocument(), makeDoc(), doc(), makeDoc()

### Community 98 - "Doc Drift Tests"
Cohesion: 0.18
Nodes (4): OUTCOME_DIR, RunFn, SystemOutcome, SYSTEMS

### Community 99 - "Spell Catalog Parity Tests"
Cohesion: 0.11
Nodes (5): DND35E_SOURCE_BLOCKED_SPELL_IDS, fieldCoverageBaselines, PF1E_SOURCE_ROWS_WITHOUT_SAVING_THROW, SpellModule, spellModules

### Community 100 - "Pf2e Spell Types & Traits"
Cohesion: 0.17
Nodes (10): Pf2eProficiencyBadge(), Props, TIER_COLORS, TIER_LABELS, Pf2eSpellsTab, Pf2eSpellsTabComponent, Props, Pf2eProficiency (+2 more)

### Community 101 - "Document Storage (IndexedDB)"
Cohesion: 0.14
Nodes (13): CurrencyEditor(), CurrencyEntry, DND_CURRENCIES, Props, InventoryItem, InventoryManager(), InventoryManagerProps, Currency (+5 more)

### Community 102 - "5e Monster Encoder"
Cohesion: 0.22
Nodes (15): ABILITY_BY_INDEX, ALIGNMENTS, bucketFor(), CREATURE_TYPES, DAMAGE_TYPES, main(), mapAction(), mapAlignment() (+7 more)

### Community 103 - "Knip Lint Config"
Cohesion: 0.12
Nodes (15): entry, ignore, ignoreBinaries, ignoreDependencies, project, rules, classMembers, duplicates (+7 more)

### Community 104 - "PF2e Monster Encoder"
Cohesion: 0.23
Nodes (14): ALIGNMENT_ABBREV, bucketFor(), CREATURE_TYPES, DAMAGE_TYPES, main(), mapAttack(), normalizeName(), parseDamage() (+6 more)

### Community 105 - "AI Creature Identification"
Cohesion: 0.10
Nodes (15): baseAuthValue, mockedClearQueuedCampaignsSnapshot, mockedClearQueuedDeletedCampaignIds, mockedDeleteRemoteCampaign, mockedFetchRemoteCampaigns, mockedGetQueuedCampaignsSnapshot, mockedGetQueuedDeletedCampaignIds, mockedGetSyncTombstonedIds (+7 more)

### Community 106 - "Character Card Presenter"
Cohesion: 0.18
Nodes (17): AbilityScoreGrid(), buildPointBuyDraft(), buildStandardArrayDraft(), clampPointBuyScore(), emptyPointBuyDraft(), emptyStandardArrayDraft(), isStandardArrayComplete(), isValidPointBuyDraft() (+9 more)

### Community 107 - "Oracle Panel & Logic"
Cohesion: 0.04
Nodes (71): NarrateSceneResult, CheckPanel(), CheckPanelProps, OUTCOME_BADGE, OUTCOME_LABEL, SKILL_SUGGESTIONS, CombatPanel(), CombatPanelProps (+63 more)

### Community 108 - "5e Equipment Tab"
Cohesion: 0.10
Nodes (22): SystemSheetComponent, makeD20LegacySheet(), DaggerheartSystemDef, Dnd35eSystemDef, BrowserFeat, Dnd5eFeatBrowserTabComponent, FeatBrowser, FeatBrowserProps (+14 more)

### Community 109 - "Scene Reaction Panel"
Cohesion: 0.13
Nodes (32): getBackgroundFixedToolProficiencies(), getBackgroundLanguageOptions(), getBackgroundToolChoiceSlots(), getDnd5eTemplateChoiceState(), applyDnd5eSpeciesTemplate(), buildAbilityChoiceSlots(), buildSpeciesFeatures(), choiceAbilityBonuses() (+24 more)

### Community 110 - "Document Signature Hashing"
Cohesion: 0.16
Nodes (15): useDebouncedPersistence(), useScenes(), makeScene(), NOW, makeScene(), campaignSignatureFor(), sameCampaignSignatures(), sameDocumentSignatures() (+7 more)

### Community 111 - "Resource Pool Tracking"
Cohesion: 0.31
Nodes (5): SceneNarrationData, NarrateSceneParams, narrateSceneWithAi(), NarrationGatewayCall, RFC-002

### Community 112 - "Bundle Size Check"
Cohesion: 0.15
Nodes (10): appChunk, appChunks, assetsDir, budgets, chunks, dataChunks, jsFiles, largestDataChunk (+2 more)

### Community 113 - "AI Prompt Builders"
Cohesion: 0.29
Nodes (12): EncounterDraftPayload, IdentifyCreaturePayload, IllustrateScenePayload, SceneNarrationPayload, buildEncounterDraftPrompt(), buildIdentifyCreaturePrompt(), buildIllustrateScenePrompt(), buildPromptForTask() (+4 more)

### Community 115 - "Project Dependencies"
Cohesion: 0.17
Nodes (12): dependencies, ai, @ai-sdk/google, class-variance-authority, clsx, lucide-react, react, react-dom (+4 more)

### Community 116 - "3.5e Spell Encoder"
Cohesion: 0.43
Nodes (6): DeferredInstallPromptEvent, isStandaloneMode(), readDismissedState(), usePwaInstallPrompt(), UsePwaInstallPromptOptions, writeDismissedState()

### Community 117 - "AI Encounter Draft Flow"
Cohesion: 0.23
Nodes (8): AiImageInput, IdentifyCreatureData, TaskGatewayCall, IdentifyCreatureParams, IdentifyCreatureResult, IdentifyGatewayCall, RFC-002, params

### Community 118 - "Campaign File Transfer"
Cohesion: 0.25
Nodes (14): D20SkillsTab(), Props, daggerheartDamageDiceCount(), DND35E_SYNERGY_SOURCES, dnd35eMaxSkillRanks(), dnd35eSkillSynergyTotal(), dnd35eSynergyBonus(), iterativeAttackBonuses() (+6 more)

### Community 119 - "MAM Archetype Browser"
Cohesion: 0.27
Nodes (11): CLASS_TOKENS, d20srdUrl(), FILES, main(), mapCastingTime(), mapDuration(), mapRange(), normalizeName() (+3 more)

### Community 120 - "PF1e Spell Encoder"
Cohesion: 0.27
Nodes (11): CLASS_COLUMNS, main(), mapCastingTime(), mapDuration(), mapRange(), RFC-4180, normalizeName(), parseCsv() (+3 more)

### Community 122 - "PF2e Archetypes Tab"
Cohesion: 0.05
Nodes (67): InitiativeTrackerProps, buildSceneCombatants(), critModelForScene(), degreeModelForScene(), factionForToken(), ResolveCombatStats, resolveSceneAttack(), runSceneRound() (+59 more)

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
Cohesion: 0.21
Nodes (15): MamArchetypesTab, MamComplicationsTab, MamEquipmentBrowserTab, MamPowerBrowserTab, useLazyResource(), useMam3eSheetResources(), SYSTEM_ID, loadAdvantagesForSystem() (+7 more)

### Community 129 - "Daggerheart Sheet Automation"
Cohesion: 0.24
Nodes (10): DaggerheartDomainCardAutomation(), DaggerheartDomainCardAutomationProps, DaggerheartFeatureListProps, DaggerheartSubclassFeatureGroup(), DaggerheartSubclassFeatureGroupProps, DOMAIN_CARD_AUTOMATION_LABELS, DOMAIN_CARD_AUTOMATION_VARIANTS, humanizeEffectTag() (+2 more)

### Community 130 - "d20LegacySpellcasting.ts"
Cohesion: 0.11
Nodes (25): D20ClassesSection(), D20LegacyClassLevel, Props, renderClassOptions(), d20BonusSpells(), buildD20LegacySpellSlotTotals(), countAdvancementLevels(), D20_DOMAIN_CLASS_IDS (+17 more)

### Community 131 - "Retry With Backoff"
Cohesion: 0.36
Nodes (8): computeBackoffMs(), isRetryableError(), NON_RETRYABLE_FRAGMENTS, PROD_DEFAULTS, RetryOptions, retryWithBackoff(), sleep(), TEST_DEFAULTS

### Community 132 - "2024 Spell Encoder"
Cohesion: 0.39
Nodes (8): main(), mapCastingTime(), mapDuration(), mapRange(), normalizeName(), SCHOOLS, slug(), ts()

### Community 133 - "MAM Power Browser"
Cohesion: 0.15
Nodes (13): EquipmentBrowser, MamEquipmentBrowserTabComponent, Props, formatMamPowerAction(), formatMamPowerDuration(), formatMamPowerRange(), humanizeMamToken(), MamPowerBrowserTabComponent (+5 more)

### Community 134 - "Spell Validation Checks"
Cohesion: 0.28
Nodes (7): collectRawSpells(), getRawSpellById(), getVariantFingerprint(), SpellModule, spellModules, stableFingerprintValue(), VALID_SCHOOLS

### Community 136 - "TS Node Config"
Cohesion: 0.22
Nodes (8): compilerOptions, allowSyntheticDefaultImports, composite, forceConsistentCasingInFileNames, module, moduleResolution, skipLibCheck, include

### Community 137 - "TS Test Config"
Cohesion: 0.22
Nodes (8): compilerOptions, lib, noEmit, types, exclude, extends, include, references

### Community 138 - "System Smoke Tests"
Cohesion: 0.28
Nodes (3): createCharacterForSystem(), getCharacterNameInput(), renameCharacter()

### Community 139 - "Prettier Config"
Cohesion: 0.25
Nodes (7): arrowParens, endOfLine, printWidth, semi, singleQuote, tabWidth, trailingComma

### Community 140 - "pf2eConditions.ts"
Cohesion: 0.26
Nodes (9): collectPf2eConditionEffects(), ConditionScope, getPf2eConditionStatusPenalty(), highestValue(), magnitude(), PF2E_STATUS_CONDITIONS, Pf2eConditionLike, scopeAppliesToAbility() (+1 more)

### Community 141 - "pf2eSpellTraits.test.ts"
Cohesion: 0.27
Nodes (15): actionReachCells(), ATTACK_COUNT_WORDS, averageDie(), buildMonsterCombatant(), dieFaces(), isMinusSign(), monsterAttackEffects(), monsterAttacksPerRound() (+7 more)

### Community 142 - "TS Base Config"
Cohesion: 0.25
Nodes (7): compilerOptions, lib, noEmit, types, exclude, extends, include

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
Nodes (10): GeneratedImageData, IllustrateGatewayCall, IllustrateSceneParams, IllustrateSceneResult, RFC-002, ILLUSTRATION_STYLES, IllustrationPanel(), IllustrationPanelProps (+2 more)

### Community 147 - "Dnd5eEquipmentTab.tsx"
Cohesion: 0.14
Nodes (13): CurrencyEditor, CurrencyEditorProps, Dnd5eEquipmentTabComponent, EquipmentBrowser, EquipmentBrowserItem, EquipmentBrowserProps, EquippedItemsSection, EquippedItemsSectionProps (+5 more)

### Community 148 - "TS Netlify Config"
Cohesion: 0.29
Nodes (6): compilerOptions, allowImportingTsExtensions, noEmit, types, extends, include

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
Cohesion: 0.31
Nodes (12): getDaggerheartProficiency(), getDaggerheartTier(), getEquippedDaggerheartArmor(), getEquippedDaggerheartWeapon(), buildDaggerheartContributionLedger(), buildPassiveBonusEntries(), buildPassiveDerivedBonusEntries(), createEntry() (+4 more)

### Community 157 - "MAM Power Modifier Browser"
Cohesion: 0.60
Nodes (3): formatModifierCost(), MamPowerModifierBrowser(), MamPowerModifierBrowserProps

### Community 159 - "characterCombatant.test.ts"
Cohesion: 0.19
Nodes (9): isRoundConclusive(), RoundCombatant, charDoc(), doc(), RFC-003, atk(), combatant(), dmg() (+1 more)

### Community 160 - "capabilityScenarios.test.tsx"
Cohesion: 0.21
Nodes (6): draftEncounter(), partyXpBudget(), xpBudgetPerCharacter(), BRUTE, NOW, VICTIM

### Community 161 - "PF2e Backgrounds Data"
Cohesion: 0.50
Nodes (3): Pf2eBackgroundChoice, Pf2eBackgroundDefinition, Pf2eBackgroundFeatGrant

### Community 175 - "syncTombstones.ts"
Cohesion: 0.31
Nodes (11): NOW, getSyncTombstonedIds(), getSyncTombstones(), pruneExpired(), readStored(), recordSyncTombstones(), removeSyncTombstones(), STORAGE_KEYS (+3 more)

### Community 177 - "useSceneEncounter.ts"
Cohesion: 0.30
Nodes (9): draftEncounterWithAi(), identifyCreatureWithAi(), fileToAiImageInput(), readAsDataUrl(), isMonsterSystemId(), RFC-006, useSceneEncounter(), summarizeEncounterParty() (+1 more)

### Community 179 - "featTemplate.test.ts"
Cohesion: 0.17
Nodes (11): boonOfSkill, crafter, fixtureBenefits, keen_mind, linguist, makeDoc(), moderately_armored, musician (+3 more)

### Community 180 - "daggerheart-engine.test.ts"
Cohesion: 0.22
Nodes (9): getDaggerheartDerivedStats(), getSelectedDaggerheartAncestry(), getSelectedDaggerheartClass(), DaggerheartDomainCardEntry, daggerheartPassiveAuditAttributes, makeDoc(), makeDomainCardEntry(), makePassiveAuditSystem() (+1 more)

### Community 181 - "sceneTerrain.ts"
Cohesion: 0.31
Nodes (7): collectTerrainEffectsAt(), isTerrainOperation(), markerCoversCell(), markerToEffects(), normalizeStackPolicy(), TERRAIN_OPERATIONS, RFC-003

### Community 182 - "tokenPlacement.ts"
Cohesion: 0.28
Nodes (4): getSceneTokenSize(), buildPlacedToken(), now, position

### Community 183 - "loadEquipmentForSystem"
Cohesion: 0.25
Nodes (8): loadDnd35eEquipment(), loadDnd5e2014Equipment(), loadDnd5e2024Equipment(), loadEquipmentForSystem(), loadMam3eEquipment(), loadPf1eEquipment(), loadPf2eEquipment(), normalizeLegacyEquipment()

### Community 184 - "EncounterPanel.tsx"
Cohesion: 0.43
Nodes (7): EncounterPanel(), EncounterPanelProps, formatAverageLevel(), EncounterPartySummary, EncounterPlanSummary, EncounterDifficulty, EncounterSpecValidation

### Community 185 - "templateShared.ts"
Cohesion: 0.70
Nodes (4): createClassLevel(), averageHitDieRoll(), hitDieFaces(), seedHitDieRolls()

## Knowledge Gaps
- **1065 isolated node(s):** `browser`, `es2021`, `node`, `extends`, `parser` (+1060 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `CharacterDocument` connect `Daggerheart Combatant Builders` to `Dnd5e Equipment & Features UI`, `Dnd5e Background Templates`, `Dnd5e2024 Engine & Hit Dice`, `Daggerheart Engine`, `Tabs UI Component`, `Scene Combat Resolution`, `Dnd5e Class Templates`, `Dnd5e Activity Definitions`, `Monster & NPC Generator`, `Dnd5e Feat Templates`, `D20 Combat Controls`, `D20 Legacy System Engines`, `Dnd35e Saves & Data Model`, `Daggerheart Data Model`, `System Registry & Renderer`, `Campaign Sync Hooks`, `Daggerheart Inventory`, `Pf2e Character Templates`, `contributionLedger.ts`, `Dnd5e Feature List Sections`, `Encounter & Initiative Panels`, `characterCombatant.test.ts`, `Pf2e Sheet Tabs`, `capabilityScenarios.test.tsx`, `Currency & Inventory Editors`, `Condition Effects by System`, `useSceneEncounter.ts`, `D20 Legacy Templates`, `featTemplate.test.ts`, `daggerheart-engine.test.ts`, `tokenPlacement.ts`, `SRD Manifest Generator`, `templateShared.ts`, `System Definitions & Types`, `D20 Legacy Spell Slots`, `Character Effects Compilation`, `System Validation Logic`, `Mam Powers & Cost Ledger`, `Sync Engine Tests`, `Dnd5e Feature Options`, `Document Migrations & Storage`, `App Header & Auth UI`, `Combat Toggles & Conditions`, `Boundary Validation Tests`, `Equipment & Feature Browsers`, `Documents Hook & Persistence`, `Daggerheart Contribution Ledger`, `Pf2e Derived Math`, `Skills Tab & Combat Math`, `Mam3e Derived Math`, `Oracle Panel & Logic`, `5e Equipment Tab`, `Scene Reaction Panel`, `Document Signature Hashing`, `PF2e Archetypes Tab`?**
  _High betweenness centrality (0.127) - this node is a cross-community bridge._
- **Why does `GameSystemId` connect `Monster Stat Block & Status` to `Sheet Resource Loading Hooks`, `Toast Notifications`, `d20LegacySpellcasting.ts`, `Dnd5e Background Templates`, `Dnd5e2024 Engine & Hit Dice`, `Dnd5e Equipment & Features UI`, `Tabs UI Component`, `Dnd5e Class Templates`, `Game System Selector`, `System Registry & Renderer`, `Roadmap Metrics Generator`, `characterCombatant.test.ts`, `Pf2e Sheet Tabs`, `capabilityScenarios.test.tsx`, `Doc Drift Rules`, `Condition Effects by System`, `useSceneEncounter.ts`, `D20 Legacy Templates`, `Spell Preparation Logic`, `Character Combatant Builder`, `SRD Manifest Generator`, `Daggerheart Combatant Builders`, `SRD Coverage Script`, `Browser Compat & Error Logging`, `Character Effects Compilation`, `Dnd5e Resource Loading Hooks`, `Mam Powers & Cost Ledger`, `capabilityScenarios.test.tsx`, `PF2e Archetypes Tab`?**
  _High betweenness centrality (0.081) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `Dev Dependencies` to `Package Manifest`, `TypeDoc Config`, `Knip Lint Config`?**
  _High betweenness centrality (0.041) - this node is a cross-community bridge._
- **What connects `browser`, `es2021`, `node` to the rest of the system?**
  _1069 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Sheet Resource Loading Hooks` be split into smaller, more focused modules?**
  _Cohesion score 0.11313131313131314 - nodes in this community are weakly interconnected._
- **Should `Dnd5e Equipment & Features UI` be split into smaller, more focused modules?**
  _Cohesion score 0.08701923076923077 - nodes in this community are weakly interconnected._
- **Should `Dnd5e Background Templates` be split into smaller, more focused modules?**
  _Cohesion score 0.05088919288645691 - nodes in this community are weakly interconnected._