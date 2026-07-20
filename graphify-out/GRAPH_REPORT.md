# Graph Report - windsurf-project  (2026-07-20)

## Corpus Check
- 783 files · ~535,937 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 4852 nodes · 13825 edges · 202 communities (181 shown, 21 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 115 edges (avg confidence: 0.71)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `94a591c4`
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

## Communities (202 total, 21 thin omitted)

### Community 0 - "Sheet Resource Loading Hooks"
Cohesion: 0.11
Nodes (43): useDaggerheartSheetResources(), finalizeLoadedItems(), loadClassesForSystem(), loadDaggerheartAncestries(), loadDaggerheartAncestriesForSystem(), loadDaggerheartArmor(), loadDaggerheartArmorForSystem(), loadDaggerheartClasses() (+35 more)

### Community 1 - "Dnd5e Sheets & E2E Tests"
Cohesion: 0.13
Nodes (25): registryMeta, SupportMeta, {
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
}, SystemContentCategoryId, SystemContentReachability, SystemContentSummary, SystemSupportLevel, clearSystemCatalogSummaryCache() (+17 more)

### Community 2 - "Dnd5e Equipment & Features UI"
Cohesion: 0.12
Nodes (21): clampTrack(), DeathSaves, DeathSavesTracker(), Props, HitDiceTracker(), Props, Props, SLOT_LEVELS (+13 more)

### Community 3 - "Dnd5e Background Templates"
Cohesion: 0.10
Nodes (42): ABILITY_NAME_TO_ID, ABILITY_OPTIONS, abilityAutomationFromSelections(), aggregateFeatAutomation(), applyFeatSkillSources(), buildAutomatedFeat(), ChoiceCategory, choiceRequirementFromGrant() (+34 more)

### Community 4 - "Dnd5e2024 Engine & Hit Dice"
Cohesion: 0.06
Nodes (34): HIT_DICE, hitDieSize(), hitDieString(), D20Roll, Dnd5e2024Engine, hasAlertFeat(), totalCharacterLevel(), DND5E_CONDITION_NAMES (+26 more)

### Community 5 - "Daggerheart Engine"
Cohesion: 0.08
Nodes (50): applyDnd5eClassTemplate(), applyDnd5eSubclassTemplate(), assertMulticlassRequirements(), ATTRIBUTE_NAME_TO_ID, buildChoiceSlots(), buildDerivedProficiencies(), buildSpellcastingState(), canSelectSubclass() (+42 more)

### Community 6 - "3.5e Monster Data Encoder"
Cohesion: 0.16
Nodes (19): ability(), ALIGNMENT_ABBREV, bucketFor(), CR_FRACTIONS, CREATURE_TYPES, creatureDir, DAMAGE_TYPES, main() (+11 more)

### Community 7 - "Tabs UI Component"
Cohesion: 0.07
Nodes (47): Tabs, TabsContent, TabsContentProps, TabsContext, TabsContextValue, TabsList, TabsProps, TabsTrigger (+39 more)

### Community 8 - "Node Runtime Bootstrap"
Cohesion: 0.09
Nodes (49): main(), runBootstrapNodeInstall(), getPinnedCommandArgs(), main(), runPinnedNpmCommand(), formatRuntimeDoctorReport(), main(), readWorkflowPinSource() (+41 more)

### Community 9 - "Scene Combat Resolution"
Cohesion: 0.04
Nodes (69): Props, SceneCreateFormProps, buildEncounterSceneEvents(), buildInitiativeEntries(), buildOccupiedCells(), clampInteger(), compareTokenIds(), EncounterBuilderIssue (+61 more)

### Community 10 - "Dnd5e Class Templates"
Cohesion: 0.16
Nodes (21): MamPowersTab(), ModifierColumn(), ModifierColumnProps, buildMam3eContributionLedger(), buildMam3ePowerCostLedgerEntries(), createPowerCostEntry(), ledgerId(), calculateMam3eFinalPowerCost() (+13 more)

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
Cohesion: 0.11
Nodes (27): effectToLedgerEntry(), toContributionLedger(), toLedgerOperation(), toLedgerValue(), AddEntryInput, buildBaseAttackBonusEntries(), buildD20LegacyContributionLedger(), buildSaveEntries() (+19 more)

### Community 16 - "App Shell & Layout"
Cohesion: 0.10
Nodes (26): Mode, SignIn(), SignInProps, UserMenu(), UserMenuProps, useAuth(), EntitySyncAdapter, SyncState (+18 more)

### Community 17 - "D20 Combat Controls"
Cohesion: 0.21
Nodes (16): getEligibleDnd5eFeatureOptions(), featureOptionSelectionKey(), ABILITY_TOKEN_MAP, collectAlwaysPreparedByLevelSources(), collectAlwaysPreparedGrantSources(), evaluatePreparedCasterFormula(), getDnd5eAlwaysPreparedSpellIds(), getDnd5eAlwaysPreparedSpellSources() (+8 more)

### Community 18 - "Game System Selector"
Cohesion: 0.06
Nodes (29): validateDnd5eBuild(), DaggerheartSystemDef, Dnd35eSystemDef, Dnd5e2024SystemDef, createDefaultDnd5eData(), Dnd5eSystemDef, Dnd5eEngine, createDnd5eValidator() (+21 more)

### Community 19 - "Combat & Recap Panels"
Cohesion: 0.17
Nodes (15): AppHeader(), assertNever(), INITIAL_NAV_STATE, LIBRARY_SEGMENTS, LibrarySegment, librarySegmentLabel(), NavAction, navReducer() (+7 more)

### Community 20 - "D20 Legacy System Engines"
Cohesion: 0.14
Nodes (19): ProficiencyListSection(), Props, Dnd5eFeatureOptionsSection(), Dnd5eFeatureOptionsSectionComponent, FeatureOptionBrowser, FeatureOptionBrowserProps, featureOptionSelectionKey(), Props (+11 more)

### Community 21 - "Dnd35e Saves & Data Model"
Cohesion: 0.03
Nodes (106): resolveCharacterEffects(), computeD20LegacyAC(), d20LegacyCheckPenalty(), applyDerivedQuantities(), rollD20(), validateDnd35eBuild(), validatePf1eBuild(), Props (+98 more)

### Community 22 - "Daggerheart Data Model"
Cohesion: 0.08
Nodes (27): computePf2eAC(), createDefaultPf2eData(), profTotal(), tierBonus(), armorClass(), PF2E_DERIVED_QUANTITIES, strMod(), RFC-003 (+19 more)

### Community 23 - "System Registry & Renderer"
Cohesion: 0.04
Nodes (72): AppHeaderProps, Props, CharacterCardProps, CharacterListViewProps, UseSceneEncounterParams, Props, Props, SystemSheetRenderer() (+64 more)

### Community 24 - "Game Rules & Proficiencies"
Cohesion: 0.08
Nodes (33): ArmorProficiency, ArmorProficiencyType, ArtisanToolProficiency, GamingSetProficiency, isValidArmorProficiency(), isValidSkillProficiency(), isValidToolProficiency(), isValidWeaponProficiency() (+25 more)

### Community 25 - "Campaign Sync Hooks"
Cohesion: 0.11
Nodes (39): resolveCheck(), BuildEncounterEventsResult, footprintCells(), footprintWithinGrid(), isOracleAnswer(), applyHitPointDelta(), applySceneEvent(), ApplySceneIntentsResult (+31 more)

### Community 26 - "Daggerheart Inventory"
Cohesion: 0.09
Nodes (34): clampDaggerheartInventoryQuantity(), daggerheartInventoryDefinitions, findDaggerheartInventoryDefinitionByName(), inventoryDefinitionById, inventoryDefinitionByName, normalizeDaggerheartCurrency(), normalizeInteger(), ancestryLookup (+26 more)

### Community 27 - "Pf2e Character Templates"
Cohesion: 0.11
Nodes (41): Pf2eDedicationProficiencyGrant, Pf2eFeat, abilityBoostValue(), ancestryFeatures(), applyAbilityAdjustments(), applyPf2eAncestryTemplate(), applyPf2eArchetypeTemplate(), applyPf2eBackgroundTemplate() (+33 more)

### Community 28 - "Roadmap Metrics Generator"
Cohesion: 0.12
Nodes (27): applyRepoResidentOverrides(), buildComputeCompletion(), buildContentCompletion(), buildMarkdownReport(), ComputeCompletionRow, computeMetrics(), ContentCompletionRow, createEmptyCategoryCounts() (+19 more)

### Community 29 - "Dnd5e Feature List Sections"
Cohesion: 0.04
Nodes (90): react, DamageHealControl(), DamageHealControlProps, DiceRollButton(), DiceRollButtonProps, Badge(), BadgeProps, badgeVariants (+82 more)

### Community 30 - "Encounter & Initiative Panels"
Cohesion: 0.17
Nodes (22): appendInventoryFromBackground(), applyDnd5eBackgroundTemplate(), BackgroundChoiceSlot, BackgroundChoiceValue, backgroundDerivedState(), COMMON_LANGUAGE_OPTIONS, Dnd5eBackgroundTemplateSelections, Dnd5eLikeDataModel (+14 more)

### Community 31 - "Class Enhancement & Headers"
Cohesion: 0.12
Nodes (23): GameSystemSelectorProps, UseD20LegacySheetResourcesProps, UseDaggerheartSheetResourcesProps, Dnd5eEquipmentTab, Dnd5eFeatBrowserTab, Dnd5eFeaturesTab, Dnd5eMonsterBrowserTab, Dnd5eSpellsTab (+15 more)

### Community 32 - "Pf2e Sheet Tabs"
Cohesion: 0.07
Nodes (41): buildCharacterCombatant(), BuildCharacterCombatantResult, normalizeSheet(), readArmorClass(), toMagicBonusItems(), toModifierSources(), AttackEconomy, bestAttackAbility() (+33 more)

### Community 33 - "AI Encounter Drafting"
Cohesion: 0.06
Nodes (58): draftEncounterWithAi(), identifyCreatureWithAi(), fileToAiImageInput(), readAsDataUrl(), CR_XP_TABLE, formatChallengeRating(), MonsterBrowser(), MonsterBrowserProps (+50 more)

### Community 34 - "Quest & Session Log UI"
Cohesion: 0.12
Nodes (28): Props, QuestList(), STATUS_BADGE, STATUS_OPTIONS, DATE_FORMAT, Props, UseCampaignSyncOptions, now (+20 more)

### Community 35 - "Currency & Inventory Editors"
Cohesion: 0.14
Nodes (21): ManifestCategory, buildSystem(), CATEGORY_LOADERS, CategoryLoader, escape(), isRecord(), Loaded, main() (+13 more)

### Community 36 - "Document Sync Engine"
Cohesion: 0.05
Nodes (100): critModelForScene(), degreeModelForScene(), resolveSceneAreaEffect(), resolveSceneAttack(), SceneAreaEffectOutcome, SceneAttackOutcome, SceneCombatStats, SceneRoundOutcome (+92 more)

### Community 37 - "Sheet Header & Stat Cards"
Cohesion: 0.11
Nodes (19): formatBackgroundToolLabel(), ChoiceSlot, Dnd5eBackgroundSection(), Props, ChoiceSlot, Dnd5eSpeciesSection(), Props, GetDnd5eTemplateChoiceStateProps (+11 more)

### Community 38 - "Check & Oracle Resolution"
Cohesion: 0.16
Nodes (20): buildMam3eCreatorData(), createDefaultMam3eDefenseRanks(), DERIVATION_EPOCH, deriveMam3eCreatorTotals(), Mam3eAbilities, Mam3eAbilityKey, Mam3eCreatorTotals, Mam3eDefenseRanks (+12 more)

### Community 39 - "Mam3e Data Model & Engine"
Cohesion: 0.17
Nodes (13): categoryIcons, GameSystemSelector(), systemAccents, NewCharacterDialog(), Props, supportBadgeLabels, supportBadgeStyles, buildInitialSummaryStates() (+5 more)

### Community 40 - "Doc Drift Rules"
Cohesion: 0.06
Nodes (59): DOC_DRIFT_MANIFEST, DocDriftRuleType, DocDriftSurface, DocDriftSurfaceKind, CAPABILITY_PHRASE_RULES, CapabilityPhraseRule, capitalizeSupportLevel(), COMMAND_RUNTIME_RULES (+51 more)

### Community 41 - "NPM Build Scripts"
Cohesion: 0.04
Nodes (45): scripts, bootstrap:node, build, check:bundle-size, check:compute-register, check:compute-register:mutate, check:compute-register:write, check:dead-code (+37 more)

### Community 42 - "Condition Effects by System"
Cohesion: 0.16
Nodes (32): EquippedItemsSection(), Props, SLOT_LABELS, SLOT_ORDER, NormalizedSheet, Dnd5e2024DataModel, Dnd5e2024TemplateState, Dnd5eCondition (+24 more)

### Community 43 - "Equipped Armor Section"
Cohesion: 0.10
Nodes (25): EquipArmorInput, EquipEntry, EquipShieldInput, Props, EquipmentBrowser, Pf2eEquipmentBrowserTabComponent, Props, fullPlate (+17 more)

### Community 44 - "Spell Browser UI"
Cohesion: 0.12
Nodes (26): DEFAULT_LABELS, SpellBrowser(), SpellBrowserLabels, SpellBrowserProps, SpellBrowserSpell, D20SpellBrowserPanelComponent, SpellBrowser, toSpellBrowserSpell() (+18 more)

### Community 45 - "Scene Combat Area Effects"
Cohesion: 0.12
Nodes (20): LegalNotices(), LegalAttributions, LegalLicenseRef, ProvenanceStatus, SystemAttribution, buildNotice(), FetchTarget, fetchValidated() (+12 more)

### Community 46 - "Error Boundary & Auth Context"
Cohesion: 0.14
Nodes (17): AuthContext, AuthContextValue, clearLocalDataForAccountChange(), getLastSyncedUserId(), setLastSyncedUserId(), AuthProvider(), AuthCallback, mockedGetSupabaseClient (+9 more)

### Community 47 - "Encounter Builder Logic"
Cohesion: 0.06
Nodes (62): clampExhaustion(), Props, RestControls(), availableD20LegacyToggles(), D20ClassesSection(), D20LegacyClassLevel, Props, renderClassOptions() (+54 more)

### Community 48 - "Scene Management Hooks"
Cohesion: 0.18
Nodes (21): DebouncedPersistence, IMPORTANT: a begun generation must end in either `persist` or, useDebouncedPersistence(), useScenes(), makeScene(), NOW, NOW, clearSceneStorage() (+13 more)

### Community 49 - "Monster Combatant Builder"
Cohesion: 0.05
Nodes (46): CheckPanel(), CheckPanelProps, DEFAULT_SUGGESTIONS, DND5E_SKILLS, OUTCOME_BADGE, OUTCOME_LABEL, SKILL_SUGGESTIONS_BY_SYSTEM, CombatPanel() (+38 more)

### Community 50 - "D20 Legacy Templates"
Cohesion: 0.10
Nodes (51): getDaggerheartShortRestRecovery(), createDaggerheartInventoryEntry(), D20LegacySpellSlots, getIterativeAttackBonuses(), recoverD20LegacySpellSlot(), resetD20LegacySpellSlots(), setD20LegacyPreparedSpell(), setD20LegacySpellSlotTotal() (+43 more)

### Community 51 - "Campaign Storage & Hooks"
Cohesion: 0.19
Nodes (18): useCampaigns(), hostileStorage, CAMPAIGNS_STORAGE_KEY, CampaignStorageData, clearCampaignStorage(), exportCampaigns(), importCampaigns(), ImportCampaignsResult (+10 more)

### Community 52 - "Spell Preparation Logic"
Cohesion: 0.09
Nodes (17): createDefaultDnd5e2024Data(), makeDoc(), makeDoc(), makeDoc(), make2024Doc(), boonOfSkill, crafter, fixtureBenefits (+9 more)

### Community 53 - "Dev Dependencies"
Cohesion: 0.05
Nodes (41): autoprefixer, @axe-core/playwright, eslint, eslint-config-prettier, eslint-plugin-react, eslint-plugin-react-refresh, happy-dom, devDependencies (+33 more)

### Community 54 - "Character Combatant Builder"
Cohesion: 0.17
Nodes (14): collectDnd5eRiderEffects(), DND5E_TOGGLE_IDS, Dnd5eRiderInputs, RAGE_DAMAGE_BREAKPOINTS, rageDamageBonus(), sneakAttackDice(), collectPf2eRiderEffects(), PF2E_SNEAK_ATTACK_BREAKPOINTS (+6 more)

### Community 55 - "D20 Class Spellcasting"
Cohesion: 0.14
Nodes (19): mam3eToughnessPenalty(), MamComplicationBrowser, MamComplicationsTabComponent, Props, Props, createDefaultMam3eData(), Mam3eDataModel, MAM3E_DERIVED_QUANTITIES (+11 more)

### Community 56 - "SRD Manifest Generator"
Cohesion: 0.12
Nodes (34): buildClassSkills(), classSkillOptions(), getBackgroundFixedToolProficiencies(), getBackgroundLanguageOptions(), getBackgroundToolChoiceSlots(), getDnd5eTemplateChoiceState(), applyDnd5eSpeciesTemplate(), buildAbilityChoiceSlots() (+26 more)

### Community 57 - "Daggerheart Combatant Builders"
Cohesion: 0.18
Nodes (16): ALIGNMENTS, DICE_PROGRESSIONS, main(), mapAlignment(), mod(), MONSTER_SIZE, normalizeName(), OLIMOT_FILES (+8 more)

### Community 58 - "AI Gateway Adapters"
Cohesion: 0.14
Nodes (20): AI_GATEWAY_SCHEMA_VERSION, aiFailure, AiResponse, GatewayContext, GatewayTimeoutError, handleAiRequest(), repairCountOf(), RFC-002 (+12 more)

### Community 59 - "AI Gateway Contracts"
Cohesion: 0.15
Nodes (25): AI_GATEWAY_TASKS, AiParse, AiSuccess, AiUsage, EncounterDraftRequest, IdentifyCreatureRequest, IllustrateSceneRequest, isAiResponse() (+17 more)

### Community 60 - "System Definitions & Types"
Cohesion: 0.13
Nodes (14): AI_GATEWAY_ENDPOINT, AiRequest, SceneNarrationData, callAiGateway(), isAiEnabled(), NarrateSceneParams, narrateSceneWithAi(), NarrationGatewayCall (+6 more)

### Community 61 - "D20 Legacy Spell Slots"
Cohesion: 0.16
Nodes (15): availableDnd5eToggles(), presentDerivedQuantities(), ComputeLayer, DerivedDisplay, DerivedQuantityCase, DerivedQuantitySpec, RFC-003, Dnd5eHeaderSection() (+7 more)

### Community 62 - "SRD Coverage Script"
Cohesion: 0.10
Nodes (34): cats5e2014, cats5e2024, CoverageTarget, csvRows(), extractJsArray(), extractNameValues(), fetchCsvNames(), fetchJsArrayNames() (+26 more)

### Community 63 - "ESLint Config"
Cohesion: 0.05
Nodes (39): jsx, env, browser, es2021, node, extends, ignorePatterns, overrides (+31 more)

### Community 64 - "Spells Tab Components"
Cohesion: 0.14
Nodes (17): Props, Props, PF2E_DERIVED_TRAITS, PF2E_SCHOOL_TRAITS, PF2E_TRADITIONS, AbilityScores, AreaOfEffect, Duration (+9 more)

### Community 65 - "Browser Compat & Error Logging"
Cohesion: 0.12
Nodes (22): RFC-004, Props, State, LegalNoticesProps, licenseTexts, LibraryBestiaryView(), LoadState, MonsterBrowser (+14 more)

### Community 66 - "AI Gateway Client"
Cohesion: 0.18
Nodes (17): AbilityScoreGrid(), buildPointBuyDraft(), buildStandardArrayDraft(), clampPointBuyScore(), emptyPointBuyDraft(), emptyStandardArrayDraft(), isStandardArrayComplete(), isValidPointBuyDraft() (+9 more)

### Community 67 - "2024 Monster Data Encoder"
Cohesion: 0.16
Nodes (23): ABILITIES, ALIGNMENTS, bucketFor(), classifyImmunityList(), cleanProse(), CR_FRACTIONS, CREATURE_TYPES, DAMAGE_TYPES (+15 more)

### Community 68 - "Character Effects Compilation"
Cohesion: 0.11
Nodes (19): createDefaultDaggerheartData(), DaggerheartDataModel, DAGGERHEART_DERIVED_QUANTITIES, dhDoc(), DaggerheartDomainCardEntry, daggerheartPassiveAuditAttributes, makeDoc(), makeDomainCardEntry() (+11 more)

### Community 69 - "TypeScript Config"
Cohesion: 0.07
Nodes (28): ES2020, ./src/*, compilerOptions, allowImportingTsExtensions, baseUrl, forceConsistentCasingInFileNames, isolatedModules, jsx (+20 more)

### Community 70 - "Mam Character Sheet Tabs"
Cohesion: 0.12
Nodes (23): MUTATION_ANCHORS, MutationAnchor, applyDemotion(), DO_MUTATE, DO_WRITE, escapeRe(), evaluateMutation(), evaluateTierA() (+15 more)

### Community 71 - "Monster Stat Block & Status"
Cohesion: 0.18
Nodes (16): CREATURE_XP_BY_LEVEL_DIFF, pf2eAttackModifier(), pf2eCreatureXP(), Pf2eDegree, pf2eDyingAfterRecovery(), pf2eEncounterBudget(), pf2eInitialDying(), pf2eIsDead() (+8 more)

### Community 72 - "Dice Panel & Mam3e Resolution"
Cohesion: 0.15
Nodes (10): rateLimiterFromEnv(), createGeminiAdapter(), IMAGE_TASKS, TASK_SCHEMAS, createConsoleLogSink(), createRateLimiter(), RateLimiterOptions, RateLimitResult (+2 more)

### Community 73 - "System Validation Logic"
Cohesion: 0.21
Nodes (23): ABILITY_SCORE_IDS, addIssue(), Dnd5eValidationData, Dnd5eValidationDataModel, Dnd5eValidationSystemId, featureOptionKey(), isIntegerInRange(), loadValidationData() (+15 more)

### Community 74 - "Spell Catalog Consistency Tests"
Cohesion: 0.16
Nodes (14): ExpectedSpellIdentity, iconicSpellExpectations, SystemKey, systems, dedupeById(), Identified, indexById(), warnDuplicateId() (+6 more)

### Community 75 - "Dnd5e Resource Loading Hooks"
Cohesion: 0.11
Nodes (35): getDaggerheartAncestryAdjustments(), EMPTY_WEAPON_LOADOUT, applyDaggerheartAncestryTemplate(), applyDaggerheartClassTemplate(), applyDaggerheartCommunityTemplate(), classTemplateItems(), communityTemplateItems(), DaggerheartInventoryEntry (+27 more)

### Community 76 - "Mam Powers & Cost Ledger"
Cohesion: 0.15
Nodes (19): Props, MamArchetypesTab, MamComplicationsTab, MamEquipmentBrowserTab, MamPowerBrowserTab, useLazyResource(), useMam3eSheetResources(), SYSTEM_ID (+11 more)

### Community 77 - "Sync Engine Tests"
Cohesion: 0.21
Nodes (12): DEFAULT_QUICK_ROLLS, DicePanel(), DicePanelProps, formatBreakdown(), QUICK_ROLLS_BY_SYSTEM, applyKeep(), DiceRollResult, DiceTerm (+4 more)

### Community 78 - "Dnd5e Feature Options"
Cohesion: 0.12
Nodes (23): appendBulletList(), applyDnd5eFeatureOptionSelection(), ClassLevelLike, DND5E_FEATURE_OPTION_GROUP_LABELS, DND5E_FEATURE_OPTION_SOURCE_LABELS, DOMAIN_SUBCLASS_IDS, featureIdForOption(), FeatureOptionState (+15 more)

### Community 79 - "Document Migrations & Storage"
Cohesion: 0.07
Nodes (48): cloneDocumentsSnapshot(), documentsChanged(), prepareDocumentsWithEngines(), prepareDocumentWithEngine(), useDocuments(), makeStoredDocument(), setStoredDocuments(), FeatureOptionRoundtripCase (+40 more)

### Community 80 - "App Header & Auth UI"
Cohesion: 0.36
Nodes (7): ThemeToggle(), applyTheme(), getSystemTheme(), isTheme(), Theme, useTheme(), VALID_THEMES

### Community 81 - "Combat Toggles & Conditions"
Cohesion: 0.08
Nodes (27): baseAuthValue, mockedClearQueuedDeletedDocumentIds, mockedClearQueuedSyncSnapshot, mockedDeleteRemoteDocument, mockedFetchRemoteDocuments, mockedGetQueuedDeletedDocumentIds, mockedGetQueuedSyncSnapshot, mockedGetSyncTombstonedIds (+19 more)

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
Cohesion: 0.16
Nodes (18): useLazyResource(), useSystemOptions(), useD20LegacySheetResources(), Pf2eEquipmentBrowserTab, Pf2eFeatBrowserTab, usePf2eSheetResources(), loadArchetypesForSystem(), loadDnd35eFeats() (+10 more)

### Community 87 - "Pf2e Engine & Constants"
Cohesion: 0.09
Nodes (20): GapLedgerItem, LedgerPhase, LedgerStatus, LedgerTag, LedgerTrack, MASTER_GAP_LEDGER, RFC-003, byPhase (+12 more)

### Community 88 - "Documents Hook & Persistence"
Cohesion: 0.25
Nodes (16): actionReachCells(), ATTACK_COUNT_WORDS, averageDie(), buildMonsterCombatant(), dieFaces(), isMinusSign(), monsterAttackEffects(), monsterAttacksPerRound() (+8 more)

### Community 89 - "Daggerheart Contribution Ledger"
Cohesion: 0.07
Nodes (55): buildDaggerheartCombatant(), BuildDaggerheartCombatantResult, RANGE_CELLS, ANCESTRY_ADJUSTMENTS_BY_ID, ancestryByName, classByName, DAGGERHEART_TIER_BREAKPOINTS, DAGGERHEART_TRAITS (+47 more)

### Community 90 - "Dnd35e/Pf1e Derived Math"
Cohesion: 0.10
Nodes (28): D20FeatBrowserTabComponent, FeatBrowser, Props, BrowserFeat, Dnd5eFeatBrowserTabComponent, FeatBrowser, FeatBrowserProps, Props (+20 more)

### Community 91 - "Mam Browser Tabs"
Cohesion: 0.23
Nodes (14): mam3eAfflictionDC(), mam3eAttackDC(), mam3eAttackHits(), mam3eCriticalDC(), mam3eDamageResistanceDC(), mam3eDegreesOfFailure(), mam3eDegreesOfSuccess(), mam3eEquipmentPoints() (+6 more)

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
Cohesion: 0.13
Nodes (15): AiFailureCode, AiTask, AiProviderAdapter, BuildGatewayLogRecordInput, GatewayLogRecord, RFC-002, createMockAdapter(), RFC-002 (+7 more)

### Community 97 - "Mam3e Derived Math"
Cohesion: 0.10
Nodes (25): IllustrateSceneResult, NarrateSceneResult, CombatPanelProps, EncounterPanel(), formatAverageLevel(), ILLUSTRATION_STYLES, IllustrationPanel(), IllustrationPanelProps (+17 more)

### Community 98 - "Doc Drift Tests"
Cohesion: 0.18
Nodes (4): OUTCOME_DIR, RunFn, SystemOutcome, SYSTEMS

### Community 99 - "Spell Catalog Parity Tests"
Cohesion: 0.11
Nodes (5): DND35E_SOURCE_BLOCKED_SPELL_IDS, fieldCoverageBaselines, PF1E_SOURCE_ROWS_WITHOUT_SAVING_THROW, SpellModule, spellModules

### Community 100 - "Pf2e Spell Types & Traits"
Cohesion: 0.12
Nodes (19): CombatStatCard(), Props, PresentedDerivedQuantity, D20DerivedStats(), DERIVED_ICON_BY_NAME, derivedIcon(), Props, DaggerheartDerivedStats() (+11 more)

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
Cohesion: 0.23
Nodes (14): ALIGNMENT_ABBREV, bucketFor(), CREATURE_TYPES, DAMAGE_TYPES, main(), mapAttack(), normalizeName(), parseDamage() (+6 more)

### Community 105 - "AI Creature Identification"
Cohesion: 0.09
Nodes (30): useCampaignSync(), useEntitySync(), baseAuthValue, mockedClearQueuedCampaignsSnapshot, mockedClearQueuedDeletedCampaignIds, mockedDeleteRemoteCampaign, mockedFetchRemoteCampaigns, mockedGetQueuedCampaignsSnapshot (+22 more)

### Community 106 - "Character Card Presenter"
Cohesion: 0.26
Nodes (10): DISPOSITION_BADGE, DISPOSITION_LABEL, ReactionHistoryEntry, ReactionPanel(), ReactionPanelProps, dispositionForTotal(), resolveReaction(), rollReaction() (+2 more)

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
Cohesion: 0.05
Nodes (44): InitiativeTracker(), terrainEffectsForPreset(), TokenPanel(), TokenPanelProps, ALLEGIANCE_LABEL, ALLEGIANCE_TOKEN_CLASS, buildTokenLabel(), buildTokensByCell() (+36 more)

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
Cohesion: 0.10
Nodes (22): DualityRoll, rollDuality(), GeneratedNpc, generateNpc(), generateNpcName(), NAME_ENDS, NAME_MIDS, NAME_STARTS (+14 more)

### Community 117 - "AI Encounter Draft Flow"
Cohesion: 0.06
Nodes (42): CurrencyEditor(), CurrencyEntry, DND_CURRENCIES, Props, EquippedArmorSection(), InventoryItem, InventoryManager(), InventoryManagerProps (+34 more)

### Community 118 - "Campaign File Transfer"
Cohesion: 0.19
Nodes (17): compute5eAC(), dnd5eArmorDexContribution(), Dnd5eTemplateState, AddEntryInput, buildAlwaysPreparedSpellEntries(), buildArmorClassEntries(), buildDnd5eContributionLedger(), buildFeatAutomationEntries() (+9 more)

### Community 119 - "MAM Archetype Browser"
Cohesion: 0.27
Nodes (11): CLASS_TOKENS, d20srdUrl(), FILES, main(), mapCastingTime(), mapDuration(), mapRange(), normalizeName() (+3 more)

### Community 120 - "PF1e Spell Encoder"
Cohesion: 0.27
Nodes (11): CLASS_COLUMNS, main(), mapCastingTime(), mapDuration(), mapRange(), RFC-4180, normalizeName(), parseCsv() (+3 more)

### Community 122 - "PF2e Archetypes Tab"
Cohesion: 0.06
Nodes (52): DND5E_SCENE_CONDITIONS, SCENE_CONDITIONS_BY_SYSTEM, sceneConditionOptions(), ArmorEquipItem, compileBaseArmorClassEffects(), D20_SIZE_MOD, collectD20LegacyConditionEffects(), D20_LEGACY_CONDITION_EFFECTS (+44 more)

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
Cohesion: 0.33
Nodes (9): MARKER_EFFECT_OPTIONS, markerEffectHelp(), MarkerEffectOption, MarkerEffectPreset, MarkerPanel(), MarkerPanelProps, terrainBadgeIcon(), SceneMarkerKind (+1 more)

### Community 130 - "d20LegacySpellcasting.ts"
Cohesion: 0.10
Nodes (19): casterTypes, classResourcesNeeded, classTags, AlwaysPreparedSpellGrant, ClassDisplayMetadata, ClassFeatureProgression, ClassResource, ClassTag (+11 more)

### Community 131 - "Retry With Backoff"
Cohesion: 0.15
Nodes (32): Doc, useSync(), UseSyncOptions, mockedGetSupabaseClient, retryWithBackoff(), getSupabaseClient(), clearQueuedSyncSnapshot(), deleteRemoteDocument() (+24 more)

### Community 132 - "2024 Spell Encoder"
Cohesion: 0.39
Nodes (8): main(), mapCastingTime(), mapDuration(), mapRange(), normalizeName(), SCHOOLS, slug(), ts()

### Community 133 - "MAM Power Browser"
Cohesion: 0.10
Nodes (18): CombatTogglesSection(), Props, Condition, ConditionPicker(), Props, FeaturesSection(), Props, D20_LEGACY_CONDITION_NAMES (+10 more)

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
Cohesion: 0.33
Nodes (6): ABILITY_KEYS, ABILITY_KEYS, TIER_BONUS, validatePf2eBuild(), BuildLegalityResult, BuildViolation

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
Nodes (9): d20LegacySpellSaveDC(), DND5E_CANTRIP_SCALE_BREAKPOINTS, dnd5eCantripScaleTier(), dnd5eConcentrationDC(), dnd5ePassivePerception(), Dnd5eSkillProficiency, dnd5eSpellAttackBonus(), dnd5eSpellSaveDC() (+1 more)

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
Nodes (31): AppContent(), buildNewCharacterDocument(), cloneSystemData(), LegalNotices, SceneManager, STORAGE_WARNING_THRESHOLD, SessionLog(), CampaignManager() (+23 more)

### Community 154 - "Dnd5eEquipmentTab.tsx"
Cohesion: 0.08
Nodes (24): D20EquipmentBrowserTab, D20EquipmentBrowserTabComponent, EquipmentBrowser, Props, CurrencyEditor, CurrencyEditorProps, Dnd5eEquipmentTabComponent, EquipmentBrowser (+16 more)

### Community 155 - "5e Movement Rules"
Cohesion: 0.23
Nodes (8): GAME_RULES, sanitizeInput(), validateAttributeScore(), validateCharacter(), validateCharacterName(), validateHitPoints(), validateLevel(), ValidationError

### Community 156 - "usePwaInstallPrompt.ts"
Cohesion: 0.27
Nodes (8): ToastContext, ToastContextValue, ToastItem, ToastProvider(), VARIANT_ICONS, VARIANT_STYLES, registerToastHandler(), ToastVariant

### Community 157 - "daggerheartSheetShared.tsx"
Cohesion: 0.24
Nodes (10): DaggerheartDomainCardAutomation(), DaggerheartDomainCardAutomationProps, DaggerheartFeatureListProps, DaggerheartSubclassFeatureGroup(), DaggerheartSubclassFeatureGroupProps, DOMAIN_CARD_AUTOMATION_LABELS, DOMAIN_CARD_AUTOMATION_VARIANTS, humanizeEffectTag() (+2 more)

### Community 160 - "MamArchetypesTab.tsx"
Cohesion: 0.16
Nodes (15): MamArchetypeBrowser(), MamArchetypeBrowserProps, MamConditionsTab(), Props, Mam3eConditionTrack, getMam3eSheetState(), GetMam3eSheetStateProps, uniqueNonEmptyStrings() (+7 more)

### Community 161 - "PF2e Backgrounds Data"
Cohesion: 0.50
Nodes (3): Pf2eBackgroundChoice, Pf2eBackgroundDefinition, Pf2eBackgroundFeatGrant

### Community 177 - "gatewayClient.ts"
Cohesion: 0.33
Nodes (4): Props, SheetHeader(), HeaderOption, Props

### Community 179 - "featTemplate.test.ts"
Cohesion: 0.25
Nodes (6): ABILITIES, DEFENSES, Mam3eCreator(), Mam3eCreatorProps, SKILLS, Mam3eDefenseKey

### Community 180 - "MamPowerBrowserTab.tsx"
Cohesion: 0.15
Nodes (13): EquipmentBrowser, MamEquipmentBrowserTabComponent, Props, formatMamPowerAction(), formatMamPowerDuration(), formatMamPowerRange(), humanizeMamToken(), MamPowerBrowserTabComponent (+5 more)

### Community 182 - "syncTombstones.ts"
Cohesion: 0.25
Nodes (8): loadDnd35eEquipment(), loadDnd5e2014Equipment(), loadDnd5e2024Equipment(), loadEquipmentForSystem(), loadMam3eEquipment(), loadPf1eEquipment(), loadPf2eEquipment(), normalizeLegacyEquipment()

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
Cohesion: 0.31
Nodes (7): computeBackoffMs(), isRetryableError(), NON_RETRYABLE_FRAGMENTS, PROD_DEFAULTS, RetryOptions, sleep(), TEST_DEFAULTS

### Community 192 - "daggerheart-engine.test.ts"
Cohesion: 0.39
Nodes (4): ServiceWorkerUpdateBanner(), isServiceWorkerSupported(), ServiceWorkerUpdateState, useServiceWorkerUpdate()

## Knowledge Gaps
- **1232 isolated node(s):** `browser`, `es2021`, `node`, `eslint:recommended`, `plugin:@typescript-eslint/recommended` (+1227 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **21 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `Dnd5e Feature List Sections` to `Sheet Resource Loading Hooks`, `Dnd5e Equipment & Features UI`, `Retry With Backoff`, `MAM Power Browser`, `Tabs UI Component`, `Scene Combat Resolution`, `Dnd5e Class Templates`, `Monster & NPC Generator`, `App Shell & Layout`, `D20 Combat Controls`, `Combat & Recap Panels`, `D20 Legacy System Engines`, `Dnd35e Saves & Data Model`, `System Registry & Renderer`, `Equipment Browser Component`, `ServiceWorkerUpdateBanner.tsx`, `Dnd5eEquipmentTab.tsx`, `usePwaInstallPrompt.ts`, `Class Enhancement & Headers`, `MamArchetypesTab.tsx`, `AI Encounter Drafting`, `Quest & Session Log UI`, `Check & Oracle Resolution`, `Mam3e Data Model & Engine`, `Doc Drift Rules`, `Condition Effects by System`, `Equipped Armor Section`, `Spell Browser UI`, `Error Boundary & Auth Context`, `Encounter Builder Logic`, `Scene Management Hooks`, `Monster Combatant Builder`, `gatewayClient.ts`, `Campaign Storage & Hooks`, `D20 Legacy Templates`, `MamPowerBrowserTab.tsx`, `featTemplate.test.ts`, `D20 Class Spellcasting`, `eslint-plugin-react`, `MamComplicationBrowser.tsx`, `ESLint Config`, `daggerheart-engine.test.ts`, `Browser Compat & Error Logging`, `AI Gateway Client`, `Dnd5e Resource Loading Hooks`, `Mam Powers & Cost Ledger`, `Sync Engine Tests`, `Document Migrations & Storage`, `App Header & Auth UI`, `Combat Toggles & Conditions`, `capabilityScenarios.test.tsx`, `Equipment & Feature Browsers`, `Dnd35e/Pf1e Derived Math`, `Mam3e Derived Math`, `Pf2e Spell Types & Traits`, `AI Creature Identification`, `Character Card Presenter`, `5e Equipment Tab`, `Scene Reaction Panel`, `Document Signature Hashing`, `AI Encounter Draft Flow`?**
  _High betweenness centrality (0.153) - this node is a cross-community bridge._
- **Why does `CharacterDocument` connect `System Registry & Renderer` to `Retry With Backoff`, `Dnd5e2024 Engine & Hit Dice`, `Daggerheart Engine`, `Dnd5e Background Templates`, `Tabs UI Component`, `Scene Combat Resolution`, `Dnd5e Class Templates`, `pf2eConditions.ts`, `Dnd5e Activity Definitions`, `Dnd5e Feat Templates`, `D20 Combat Controls`, `Game System Selector`, `Dnd35e Saves & Data Model`, `Daggerheart Data Model`, `ServiceWorkerUpdateBanner.tsx`, `Daggerheart Inventory`, `Pf2e Character Templates`, `Dnd5e Feature List Sections`, `Encounter & Initiative Panels`, `Pf2e Sheet Tabs`, `AI Encounter Drafting`, `MamArchetypesTab.tsx`, `Document Sync Engine`, `Sheet Header & Stat Cards`, `Check & Oracle Resolution`, `Condition Effects by System`, `Encounter Builder Logic`, `D20 Legacy Templates`, `featTemplate.test.ts`, `Spell Preparation Logic`, `D20 Class Spellcasting`, `SRD Manifest Generator`, `D20 Legacy Spell Slots`, `Character Effects Compilation`, `Monster Stat Block & Status`, `System Validation Logic`, `Dnd5e Resource Loading Hooks`, `Dnd5e Feature Options`, `Document Migrations & Storage`, `Combat Toggles & Conditions`, `Boundary Validation Tests`, `Daggerheart Contribution Ledger`, `Dnd35e/Pf1e Derived Math`, `Mam Browser Tabs`, `Mam3e Derived Math`, `Oracle Panel & Logic`, `Document Signature Hashing`, `AI Encounter Draft Flow`, `Campaign File Transfer`, `PF2e Archetypes Tab`?**
  _High betweenness centrality (0.110) - this node is a cross-community bridge._
- **Why does `GameSystemId` connect `Class Enhancement & Headers` to `Sheet Resource Loading Hooks`, `Dnd5e Sheets & E2E Tests`, `Dnd5e2024 Engine & Hit Dice`, `Tabs UI Component`, `Scene Combat Resolution`, `D20 Combat Controls`, `Dnd35e Saves & Data Model`, `System Registry & Renderer`, `ServiceWorkerUpdateBanner.tsx`, `Roadmap Metrics Generator`, `Dnd5e Feature List Sections`, `Pf2e Sheet Tabs`, `AI Encounter Drafting`, `Currency & Inventory Editors`, `Document Sync Engine`, `Mam3e Data Model & Engine`, `Doc Drift Rules`, `Condition Effects by System`, `Encounter Builder Logic`, `MamArchetypesTab.tsx`, `SRD Coverage Script`, `Browser Compat & Error Logging`, `Mam Powers & Cost Ledger`, `Equipment & Feature Browsers`, `Dnd35e/Pf1e Derived Math`, `Mam3e Derived Math`, `Document Signature Hashing`, `AI Encounter Draft Flow`, `PF2e Archetypes Tab`?**
  _High betweenness centrality (0.061) - this node is a cross-community bridge._
- **What connects `browser`, `es2021`, `node` to the rest of the system?**
  _1232 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Sheet Resource Loading Hooks` be split into smaller, more focused modules?**
  _Cohesion score 0.10823311748381129 - nodes in this community are weakly interconnected._
- **Should `Dnd5e Sheets & E2E Tests` be split into smaller, more focused modules?**
  _Cohesion score 0.12834224598930483 - nodes in this community are weakly interconnected._
- **Should `Dnd5e Equipment & Features UI` be split into smaller, more focused modules?**
  _Cohesion score 0.11965811965811966 - nodes in this community are weakly interconnected._