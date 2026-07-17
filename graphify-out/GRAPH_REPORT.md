# Graph Report - windsurf-project  (2026-07-17)

## Corpus Check
- 707 files · ~492,950 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 4469 nodes · 12636 edges · 185 communities (164 shown, 21 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 102 edges (avg confidence: 0.71)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `2ec3572b`
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
- 5e Movement Rules
- usePwaInstallPrompt.ts
- PF2e Backgrounds Data
- Host Size Budget Test
- Vitest Type Defs
- MAM Complications Data
- MAM Power Modifiers Data
- Vitest Coverage Config
- featTemplate.test.ts
- MamPowerBrowserTab.tsx
- loadEquipmentForSystem
- eslint-plugin-react
- fake-indexeddb
- knip
- @types/react
- @types/react-dom
- @vitest/coverage-v8

## God Nodes (most connected - your core abstractions)
1. `CharacterDocument` - 231 edges
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

## Communities (185 total, 21 thin omitted)

### Community 0 - "Sheet Resource Loading Hooks"
Cohesion: 0.06
Nodes (62): useLazyResource(), useSystemOptions(), useD20LegacySheetResources(), UseD20LegacySheetResourcesProps, Pf2eEquipmentBrowserTab, Pf2eFeatBrowserTab, Pf2eSpellsTab, usePf2eSheetResources() (+54 more)

### Community 1 - "Dnd5e Sheets & E2E Tests"
Cohesion: 0.13
Nodes (21): categoryIcons, GameSystemSelector(), GameSystemSelectorProps, systemAccents, NewCharacterDialog(), Props, supportBadgeLabels, supportBadgeStyles (+13 more)

### Community 2 - "Dnd5e Equipment & Features UI"
Cohesion: 0.07
Nodes (62): EquippedItemsSection(), Props, SLOT_LABELS, SLOT_ORDER, BuildCharacterCombatantResult, normalizeSheet(), readArmorClass(), toMagicBonusItems() (+54 more)

### Community 3 - "Dnd5e Background Templates"
Cohesion: 0.07
Nodes (56): countSelections(), optionDisabledForRequirement(), resolveEquipmentSlot(), resolveFeatSelections(), toEquippedItem(), toWeaponDamage(), ABILITY_NAME_TO_ID, ABILITY_OPTIONS (+48 more)

### Community 4 - "Dnd5e2024 Engine & Hit Dice"
Cohesion: 0.05
Nodes (36): HIT_DICE, hitDieSize(), hitDieString(), Dnd5e2024Engine, hasAlertFeat(), totalCharacterLevel(), createDefaultDnd5eData(), Dnd5eEngine (+28 more)

### Community 5 - "Daggerheart Engine"
Cohesion: 0.09
Nodes (46): applyDnd5eClassTemplate(), applyDnd5eSubclassTemplate(), assertMulticlassRequirements(), ATTRIBUTE_NAME_TO_ID, buildChoiceSlots(), buildDerivedProficiencies(), buildSpellcastingState(), canSelectSubclass() (+38 more)

### Community 6 - "3.5e Monster Data Encoder"
Cohesion: 0.06
Nodes (52): ALIGNMENTS, DICE_PROGRESSIONS, main(), mapAlignment(), mod(), MONSTER_SIZE, normalizeName(), OLIMOT_FILES (+44 more)

### Community 7 - "Tabs UI Component"
Cohesion: 0.08
Nodes (42): Badge(), BadgeProps, badgeVariants, DaggerheartCharacterBasicsSection(), Props, DaggerheartDomainCardsSection(), Props, DaggerheartDowntimeControls() (+34 more)

### Community 8 - "Node Runtime Bootstrap"
Cohesion: 0.09
Nodes (48): main(), runBootstrapNodeInstall(), getPinnedCommandArgs(), main(), runPinnedNpmCommand(), formatRuntimeDoctorReport(), main(), readWorkflowPinSource() (+40 more)

### Community 9 - "Scene Combat Resolution"
Cohesion: 0.05
Nodes (78): UseSceneEncounterParams, Props, BuildEncounterEventsParams, BuildEncounterEventsResult, isOracleAnswer(), appendSceneEvent(), applyHitPointDelta(), applySceneEvent() (+70 more)

### Community 10 - "Dnd5e Class Templates"
Cohesion: 0.06
Nodes (57): MamArchetypeBrowser(), MamArchetypeBrowserProps, MamArchetypeBrowser, MamArchetypesTabComponent, Props, MamConditionsTab(), Props, MamPowersTab() (+49 more)

### Community 11 - "System Compute Registers"
Cohesion: 0.17
Nodes (15): daggerheartComputeRegister, dnd35eComputeRegister, dnd5e2014ComputeRegister, dnd5e2024ComputeRegister, COMPUTE_REGISTERS, registerForSystem(), mam3eComputeRegister, pf1eComputeRegister (+7 more)

### Community 12 - "Scene Check Panel"
Cohesion: 0.16
Nodes (13): defaultOptions, BrowserCapabilities, checkBrowserCapabilities(), initBrowserCompat(), isBrowserSupported(), showCompatibilityWarning(), ErrorCategory, ErrorLog (+5 more)

### Community 13 - "Dnd5e Activity Definitions"
Cohesion: 0.10
Nodes (27): buildDefenseStyleActivity(), buildDivineSmiteActivities(), buildDivineSmiteActivity(), buildDnd5eActivityDefinitions(), buildUnsupportedDivineSmiteActivity(), divineSmiteSlotLevel(), Dnd5eActivityCost, Dnd5eActivityCostKind (+19 more)

### Community 14 - "Monster & NPC Generator"
Cohesion: 0.16
Nodes (19): getDaggerheartAncestryAdjustments(), applyDaggerheartAncestryTemplate(), applyDaggerheartClassTemplate(), applyDaggerheartCommunityTemplate(), classTemplateItems(), communityTemplateItems(), DaggerheartInventoryEntry, DEFAULTS (+11 more)

### Community 15 - "Dnd5e Feat Templates"
Cohesion: 0.22
Nodes (8): InventoryItem, InventoryManager(), InventoryManagerProps, Currency, D20InventoryTab(), InventoryItem, Props, existingItems

### Community 16 - "App Shell & Layout"
Cohesion: 0.16
Nodes (18): MockBeforeInstallPromptEvent, mockedGetQueuedCampaignsSnapshot, mockedGetQueuedDeletedCampaignIds, mockedGetQueuedDeletedDocumentIds, mockedGetQueuedSyncSnapshot, getQueuedDeletedCampaignIds(), getQueuedDeletedDocumentIds(), queueIds() (+10 more)

### Community 17 - "D20 Combat Controls"
Cohesion: 0.13
Nodes (25): getEligibleDnd5eFeatureOptions(), Dnd5eLikeDataModel, featureOptionSelectionKey(), ABILITY_TOKEN_MAP, collectAlwaysPreparedByLevelSources(), collectAlwaysPreparedGrantSources(), evaluatePreparedCasterFormula(), getDnd5eAlwaysPreparedSpellIds() (+17 more)

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
Cohesion: 0.19
Nodes (14): assertNever(), INITIAL_NAV_STATE, LIBRARY_SEGMENTS, librarySegmentLabel(), NavAction, navReducer(), Overlay, ShellNavState (+6 more)

### Community 20 - "D20 Legacy System Engines"
Cohesion: 0.04
Nodes (76): clampExhaustion(), Props, RestControls(), resolveCharacterEffects(), d20LegacyCheckPenalty(), D20Roll, DualityRoll, rollD20() (+68 more)

### Community 21 - "Dnd35e Saves & Data Model"
Cohesion: 0.07
Nodes (56): availableD20LegacyToggles(), Props, Props, D20LegacyData, D20LegacySpellSlots, getIterativeAttackBonuses(), recoverD20LegacySpellSlot(), resetD20LegacySpellSlots() (+48 more)

### Community 22 - "Daggerheart Data Model"
Cohesion: 0.21
Nodes (13): RFC-005, createDaggerheartInventoryEntry(), clearAllStress(), prepareGainHope(), repairAllArmor(), tendToAllWounds(), DaggerheartDataModel, DomainCardEntry (+5 more)

### Community 23 - "System Registry & Renderer"
Cohesion: 0.06
Nodes (32): SystemRegistry, SheetProps, SystemDefinition, SystemSheetComponent, SystemValidator, ValidationContext, ValidationReason, ValidationResult (+24 more)

### Community 24 - "Game Rules & Proficiencies"
Cohesion: 0.08
Nodes (33): ArmorProficiency, ArmorProficiencyType, ArtisanToolProficiency, GamingSetProficiency, isValidArmorProficiency(), isValidSkillProficiency(), isValidToolProficiency(), isValidWeaponProficiency() (+25 more)

### Community 25 - "Campaign Sync Hooks"
Cohesion: 0.08
Nodes (38): DISPOSITION_BADGE, DISPOSITION_LABEL, ReactionHistoryEntry, ReactionPanel(), ReactionPanelProps, buildEncounterSceneEvents(), buildInitiativeEntries(), buildOccupiedCells() (+30 more)

### Community 26 - "Daggerheart Inventory"
Cohesion: 0.12
Nodes (25): ancestryLookup, armorLookup, buildLookup(), classLookup, communityLookup, DEFAULTS, domainCardByName, domainCardByNameAndDomain (+17 more)

### Community 27 - "Pf2e Character Templates"
Cohesion: 0.08
Nodes (46): Pf2eArchetypesTab(), Props, Pf2eFeat, abilityBoostValue(), ancestryFeatures(), applyAbilityAdjustments(), applyPf2eAncestryTemplate(), applyPf2eArchetypeTemplate() (+38 more)

### Community 28 - "Roadmap Metrics Generator"
Cohesion: 0.09
Nodes (38): applyRepoResidentOverrides(), buildComputeCompletion(), buildContentCompletion(), buildMarkdownReport(), ComputeCompletionRow, computeMetrics(), ContentCompletionRow, createEmptyCategoryCounts() (+30 more)

### Community 29 - "Dnd5e Feature List Sections"
Cohesion: 0.05
Nodes (77): CurrencyEditor(), CurrencyEntry, DND_CURRENCIES, Props, DamageHealControl(), DamageHealControlProps, DiceRollButton(), DiceRollButtonProps (+69 more)

### Community 30 - "Encounter & Initiative Panels"
Cohesion: 0.06
Nodes (62): appendInventoryFromBackground(), applyDnd5eBackgroundTemplate(), BackgroundChoiceSlot, BackgroundChoiceValue, backgroundDerivedState(), COMMON_LANGUAGE_OPTIONS, Dnd5eBackgroundTemplateSelections, Dnd5eLikeDataModel (+54 more)

### Community 31 - "Class Enhancement & Headers"
Cohesion: 0.22
Nodes (14): Dnd5eEquipmentTab, Dnd5eFeatBrowserTab, Dnd5eFeaturesTab, Dnd5eMonsterBrowserTab, Dnd5eSpellsTab, useDnd5eDeferredResource(), useDnd5eSheetResources(), loadBackgroundsForSystem() (+6 more)

### Community 32 - "Pf2e Sheet Tabs"
Cohesion: 0.20
Nodes (16): getDaggerheartEffectiveAttribute(), clampDaggerheartInventoryQuantity(), daggerheartInventoryDefinitions, findDaggerheartInventoryDefinitionByName(), getDaggerheartInventoryDefinition(), inventoryDefinitionById, inventoryDefinitionByName, isDaggerheartConsumableDefinition() (+8 more)

### Community 33 - "AI Encounter Drafting"
Cohesion: 0.05
Nodes (70): draftEncounterWithAi(), narrateSceneWithAi(), CR_XP_TABLE, formatChallengeRating(), MonsterBrowser(), MonsterBrowserProps, terrainEffectsForPreset(), isMonsterSystemId() (+62 more)

### Community 34 - "Quest & Session Log UI"
Cohesion: 0.16
Nodes (21): QuestList(), STATUS_BADGE, STATUS_OPTIONS, T0, T1, CampaignObjective, CampaignQuest, CampaignQuestStatus (+13 more)

### Community 35 - "Currency & Inventory Editors"
Cohesion: 0.20
Nodes (15): getDaggerheartProficiency(), getDaggerheartTier(), getEquippedDaggerheartArmor(), getEquippedDaggerheartWeapon(), buildDaggerheartContributionLedger(), buildPassiveBonusEntries(), buildPassiveDerivedBonusEntries(), createEntry() (+7 more)

### Community 36 - "Document Sync Engine"
Cohesion: 0.05
Nodes (110): critModelForScene(), degreeModelForScene(), resolveSceneAreaEffect(), resolveSceneAttack(), runSceneRound(), SceneAreaEffectOutcome, SceneAttackOutcome, SceneCombatStats (+102 more)

### Community 37 - "Sheet Header & Stat Cards"
Cohesion: 0.05
Nodes (52): CharacterCardProps, CharacterListViewProps, Props, SystemSheetRenderer(), SystemEngine, Props, UseD20LegacySheetControllerProps, Props (+44 more)

### Community 38 - "Check & Oracle Resolution"
Cohesion: 0.18
Nodes (15): Dnd5eTemplateState, AddEntryInput, buildAlwaysPreparedSpellEntries(), buildDnd5eContributionLedger(), buildFeatAutomationEntries(), buildListEntry(), buildTemplateProficiencyEntries(), createEntry() (+7 more)

### Community 39 - "Mam3e Data Model & Engine"
Cohesion: 0.13
Nodes (19): clampTrack(), DeathSaves, DeathSavesTracker(), Props, HitDiceTracker(), Props, Props, SLOT_LEVELS (+11 more)

### Community 40 - "Doc Drift Rules"
Cohesion: 0.06
Nodes (54): DOC_DRIFT_MANIFEST, DocDriftRuleType, DocDriftSurface, DocDriftSurfaceKind, CAPABILITY_PHRASE_RULES, CapabilityPhraseRule, capitalizeSupportLevel(), COMMAND_RUNTIME_RULES (+46 more)

### Community 41 - "NPM Build Scripts"
Cohesion: 0.05
Nodes (43): scripts, bootstrap:node, build, check:bundle-size, check:compute-register, check:compute-register:mutate, check:compute-register:write, check:dead-code (+35 more)

### Community 42 - "Condition Effects by System"
Cohesion: 0.09
Nodes (35): AppContent(), cloneSystemData(), LegalNotices, SceneManager, STORAGE_WARNING_THRESHOLD, DATE_FORMAT, SessionLog(), CampaignManager() (+27 more)

### Community 43 - "Equipped Armor Section"
Cohesion: 0.06
Nodes (42): EquipArmorInput, EquipEntry, EquippedArmorSection(), EquipShieldInput, Props, D20EquipmentBrowserTabComponent, EquipmentBrowser, Props (+34 more)

### Community 44 - "Spell Browser UI"
Cohesion: 0.14
Nodes (23): DEFAULT_LABELS, SpellBrowser(), SpellBrowserLabels, SpellBrowserProps, SpellBrowserSpell, D20SpellBrowserPanelComponent, SpellBrowser, toSpellBrowserSpell() (+15 more)

### Community 45 - "Scene Combat Area Effects"
Cohesion: 0.17
Nodes (15): buildNotice(), FetchTarget, fetchValidated(), HTML_ENTITIES, looksLikeHtml(), main(), normalize(), noticePath (+7 more)

### Community 46 - "Error Boundary & Auth Context"
Cohesion: 0.12
Nodes (20): AuthContext, clearLocalDataForAccountChange(), getLastSyncedUserId(), setLastSyncedUserId(), AuthProvider(), AuthCallback, mockedGetSupabaseClient, mockedIsSupabaseConfigured (+12 more)

### Community 47 - "Encounter Builder Logic"
Cohesion: 0.13
Nodes (32): applyAbilityAdjustments(), applyD20LegacyClassTemplate(), applyD20LegacyRaceTemplate(), buildClassSkills(), classFeaturesUpToLevel(), classSkillOptions(), collectClassFeatureSignatures(), create35eClassLevel() (+24 more)

### Community 48 - "Scene Management Hooks"
Cohesion: 0.16
Nodes (22): DebouncedPersistence, IMPORTANT: a begun generation must end in either `persist` or, useDebouncedPersistence(), useScenes(), NOW, debounce(), clearSceneStorage(), collectValidScenes() (+14 more)

### Community 50 - "D20 Legacy Templates"
Cohesion: 0.18
Nodes (25): applyDnd5eLongRest(), applyDnd5eShortRest(), recoverAllSpellSlots(), recoverFeatures(), recoverLongRestHitDice(), recoverPactMagicSlots(), slotPool(), longRestPf2eSpellcasting() (+17 more)

### Community 51 - "Campaign Storage & Hooks"
Cohesion: 0.14
Nodes (24): Props, Props, Props, Props, SceneCreateFormProps, useCampaigns(), hostileStorage, Campaign (+16 more)

### Community 52 - "Spell Preparation Logic"
Cohesion: 0.09
Nodes (17): createDefaultDnd5e2024Data(), makeDoc(), makeDoc(), makeDoc(), make2024Doc(), boonOfSkill, crafter, fixtureBenefits (+9 more)

### Community 53 - "Dev Dependencies"
Cohesion: 0.05
Nodes (41): autoprefixer, eslint, eslint-config-prettier, eslint-plugin-react-hooks, eslint-plugin-react-refresh, happy-dom, devDependencies, autoprefixer (+33 more)

### Community 54 - "Character Combatant Builder"
Cohesion: 0.24
Nodes (11): effectToLedgerEntry(), toContributionLedger(), toLedgerOperation(), toLedgerValue(), ContributionLedgerEntry, ContributionLedgerResult, ContributionManualBoundaryKind, ContributionOperation (+3 more)

### Community 55 - "D20 Class Spellcasting"
Cohesion: 0.18
Nodes (5): makeScene(), now, pickTextFileMock, now, systemOptions

### Community 56 - "SRD Manifest Generator"
Cohesion: 0.12
Nodes (33): ManifestCategory, buildSystem(), CATEGORY_LOADERS, CategoryLoader, escape(), isRecord(), Loaded, main() (+25 more)

### Community 57 - "Daggerheart Combatant Builders"
Cohesion: 0.15
Nodes (16): Props, Props, UseD20LegacyTemplateHandlersProps, Dnd5eSheetMutators, UseDnd5eTemplateHandlersProps, Pf2eHeader(), Props, GetPf2eSheetChoiceStateProps (+8 more)

### Community 58 - "AI Gateway Adapters"
Cohesion: 0.12
Nodes (20): createGeminiAdapter(), IMAGE_TASKS, TASK_SCHEMAS, AI_GATEWAY_SCHEMA_VERSION, aiFailure, AiResponse, AiTask, AiProviderAdapter (+12 more)

### Community 59 - "AI Gateway Contracts"
Cohesion: 0.14
Nodes (26): AI_GATEWAY_TASKS, AiFailureCode, AiParse, AiSuccess, AiUsage, EncounterDraftRequest, IdentifyCreatureRequest, IllustrateSceneRequest (+18 more)

### Community 60 - "System Definitions & Types"
Cohesion: 0.28
Nodes (5): SceneNarrationData, TaskGatewayCall, NarrateSceneParams, NarrationGatewayCall, RFC-002

### Community 61 - "D20 Legacy Spell Slots"
Cohesion: 0.07
Nodes (35): Tabs, TabsContent, TabsContentProps, TabsContext, TabsContextValue, TabsList, TabsProps, TabsTrigger (+27 more)

### Community 62 - "SRD Coverage Script"
Cohesion: 0.11
Nodes (25): cats5e2014, cats5e2024, CoverageTarget, csvRows(), extractJsArray(), extractNameValues(), fetchCsvNames(), fetchJsArrayNames() (+17 more)

### Community 63 - "ESLint Config"
Cohesion: 0.05
Nodes (39): jsx, env, browser, es2021, node, extends, ignorePatterns, overrides (+31 more)

### Community 64 - "Spells Tab Components"
Cohesion: 0.08
Nodes (35): Props, compareSpells(), D20SpellsTab(), formatSpellLevel(), Props, titleCase(), Props, Pf2eSpellsTabComponent (+27 more)

### Community 65 - "Browser Compat & Error Logging"
Cohesion: 0.10
Nodes (20): ErrorBoundary, Props, State, LegalNotices(), LegalNoticesProps, licenseTexts, MonsterStatBlock(), MonsterStatBlockProps (+12 more)

### Community 66 - "AI Gateway Client"
Cohesion: 0.43
Nodes (6): MARKER_EFFECT_OPTIONS, markerEffectHelp(), MarkerEffectOption, MarkerPanel(), terrainBadgeIcon(), SceneTerrainEffect

### Community 67 - "2024 Monster Data Encoder"
Cohesion: 0.16
Nodes (23): ABILITIES, ALIGNMENTS, bucketFor(), classifyImmunityList(), cleanProse(), CR_FRACTIONS, CREATURE_TYPES, DAMAGE_TYPES (+15 more)

### Community 68 - "Character Effects Compilation"
Cohesion: 0.38
Nodes (5): IllustrateSceneResult, ILLUSTRATION_STYLES, IllustrationPanel(), IllustrationPanelProps, image

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
Cohesion: 0.48
Nodes (6): EncounterPanel(), EncounterPanelProps, formatAverageLevel(), EncounterPartySummary, EncounterPlanSummary, EncounterSpecValidation

### Community 73 - "System Validation Logic"
Cohesion: 0.21
Nodes (23): ABILITY_SCORE_IDS, addIssue(), createDnd5eValidator(), Dnd5eValidationData, Dnd5eValidationDataModel, featureOptionKey(), isIntegerInRange(), loadValidationData() (+15 more)

### Community 74 - "Spell Catalog Consistency Tests"
Cohesion: 0.15
Nodes (15): e(), ExpectedSpellIdentity, iconicSpellExpectations, SystemKey, systems, dedupeById(), Identified, indexById() (+7 more)

### Community 75 - "Dnd5e Resource Loading Hooks"
Cohesion: 0.20
Nodes (19): GetDaggerheartSheetStateProps, UseDaggerheartTemplateHandlersProps, DaggerheartAdversaryRole, DaggerheartAncestry, DaggerheartArmor, DaggerheartClass, DaggerheartCommunity, DaggerheartConsumable (+11 more)

### Community 76 - "Mam Powers & Cost Ledger"
Cohesion: 0.40
Nodes (4): Props, Advantage, AdvantagePrerequisite, AdvantageType

### Community 77 - "Sync Engine Tests"
Cohesion: 0.16
Nodes (23): useCampaignSync(), UseCampaignSyncOptions, EntitySyncAdapter, useEntitySync(), UseEntitySyncOptions, NOW, getQueuedCampaignsSnapshot(), mergeCampaigns() (+15 more)

### Community 78 - "Dnd5e Feature Options"
Cohesion: 0.07
Nodes (46): ProficiencyListSection(), Props, DND5E_CONDITION_NAMES, hasDnd5eCondition(), normalizeConditionId(), normalizeDnd5eConditions(), Dnd5eFeatureOptionsSection(), Dnd5eFeatureOptionsSectionComponent (+38 more)

### Community 79 - "Document Migrations & Storage"
Cohesion: 0.06
Nodes (52): ToastContext, ToastContextValue, ToastItem, ToastProvider(), VARIANT_ICONS, VARIANT_STYLES, cloneDocumentsSnapshot(), documentsChanged() (+44 more)

### Community 80 - "App Header & Auth UI"
Cohesion: 0.10
Nodes (23): react, AppHeader(), AppHeaderProps, Mode, SignIn(), SignInProps, OverflowMenu(), OverflowMenuItem (+15 more)

### Community 81 - "Combat Toggles & Conditions"
Cohesion: 0.09
Nodes (24): Doc, useSync(), UseSyncOptions, baseAuthValue, mockedClearQueuedDeletedDocumentIds, mockedClearQueuedSyncSnapshot, mockedDeleteRemoteDocument, mockedFetchRemoteDocuments (+16 more)

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
Cohesion: 0.22
Nodes (11): D20EquipmentBrowserTab, D20FeatBrowserTab, countTrainedSkills(), D20InventoryCurrency, D20InventoryItem, D20LegacyData, D20LegacyTabs(), D20NotesTab() (+3 more)

### Community 87 - "Pf2e Engine & Constants"
Cohesion: 0.09
Nodes (20): GapLedgerItem, LedgerPhase, LedgerStatus, LedgerTag, LedgerTrack, MASTER_GAP_LEDGER, RFC-003, byPhase (+12 more)

### Community 88 - "Documents Hook & Persistence"
Cohesion: 0.25
Nodes (16): actionReachCells(), ATTACK_COUNT_WORDS, averageDie(), buildMonsterCombatant(), dieFaces(), isMinusSign(), monsterAttackEffects(), monsterAttacksPerRound() (+8 more)

### Community 89 - "Daggerheart Contribution Ledger"
Cohesion: 0.09
Nodes (37): ANCESTRY_ADJUSTMENTS_BY_ID, ancestryByName, classByName, DAGGERHEART_TRAITS, DaggerheartAncestryAdjustments, DaggerheartRange, DEFAULT_DAGGERHEART_ANCESTRY_ADJUSTMENTS, doesDaggerheartPassiveConditionApply() (+29 more)

### Community 90 - "Dnd35e/Pf1e Derived Math"
Cohesion: 0.10
Nodes (28): D20FeatBrowserTabComponent, FeatBrowser, Props, BrowserFeat, Dnd5eFeatBrowserTabComponent, FeatBrowser, FeatBrowserProps, Props (+20 more)

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
Cohesion: 0.38
Nodes (10): CharacterCard(), asNumber(), asRecord(), asString(), getClassLabel(), getDocumentLevelValue(), getHitPointLabel(), getLevelLabel() (+2 more)

### Community 98 - "Doc Drift Tests"
Cohesion: 0.18
Nodes (4): OUTCOME_DIR, RunFn, SystemOutcome, SYSTEMS

### Community 99 - "Spell Catalog Parity Tests"
Cohesion: 0.11
Nodes (5): DND35E_SOURCE_BLOCKED_SPELL_IDS, fieldCoverageBaselines, PF1E_SOURCE_ROWS_WITHOUT_SAVING_THROW, SpellModule, spellModules

### Community 100 - "Pf2e Spell Types & Traits"
Cohesion: 0.31
Nodes (7): computeBackoffMs(), isRetryableError(), NON_RETRYABLE_FRAGMENTS, PROD_DEFAULTS, RetryOptions, sleep(), TEST_DEFAULTS

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
Nodes (16): AuthContextValue, baseAuthValue, mockedClearQueuedCampaignsSnapshot, mockedClearQueuedDeletedCampaignIds, mockedDeleteRemoteCampaign, mockedFetchRemoteCampaigns, mockedGetQueuedCampaignsSnapshot, mockedGetQueuedDeletedCampaignIds (+8 more)

### Community 107 - "Oracle Panel & Logic"
Cohesion: 0.05
Nodes (54): NarrateSceneResult, CheckPanel(), CheckPanelProps, DEFAULT_SUGGESTIONS, DND5E_SKILLS, OUTCOME_BADGE, OUTCOME_LABEL, SKILL_SUGGESTIONS_BY_SYSTEM (+46 more)

### Community 108 - "5e Equipment Tab"
Cohesion: 0.23
Nodes (8): GAME_RULES, sanitizeInput(), validateAttributeScore(), validateCharacter(), validateCharacterName(), validateHitPoints(), validateLevel(), ValidationError

### Community 109 - "Scene Reaction Panel"
Cohesion: 0.43
Nodes (5): getEditableTarget(), KeyboardShortcut, useKeyboardNavigation(), Harness(), HarnessProps

### Community 110 - "Document Signature Hashing"
Cohesion: 0.06
Nodes (35): TokenPanel(), TokenPanelProps, ALLEGIANCE_LABEL, ALLEGIANCE_TOKEN_CLASS, buildTokenLabel(), buildTokensByCell(), SceneGridView, buildCharacterCombatant() (+27 more)

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
Cohesion: 0.27
Nodes (8): SYSTEM_IDS, getSystemAssetPrefetchStateForTests(), prefetchedSystemAssets, prefetchedSystemRuntimeData, prefetchedSystemSheets, prefetchSystemAssetsForIds(), resetSystemAssetPrefetchStateForTests(), systemAssetPrefetchers

### Community 117 - "AI Encounter Draft Flow"
Cohesion: 0.18
Nodes (10): AiImageInput, IdentifyCreatureData, IdentifyCreatureParams, IdentifyCreatureResult, identifyCreatureWithAi(), IdentifyGatewayCall, RFC-002, fileToAiImageInput() (+2 more)

### Community 118 - "Campaign File Transfer"
Cohesion: 0.18
Nodes (19): D20SkillsTab(), Props, Skill, daggerheartDamageDiceCount(), DND35E_SYNERGY_SOURCES, dnd35eMaxSkillRanks(), dnd35eSkillSynergyTotal(), dnd35eSynergyBonus() (+11 more)

### Community 119 - "MAM Archetype Browser"
Cohesion: 0.27
Nodes (11): CLASS_TOKENS, d20srdUrl(), FILES, main(), mapCastingTime(), mapDuration(), mapRange(), normalizeName() (+3 more)

### Community 120 - "PF1e Spell Encoder"
Cohesion: 0.27
Nodes (11): CLASS_COLUMNS, main(), mapCastingTime(), mapDuration(), mapRange(), RFC-4180, normalizeName(), parseCsv() (+3 more)

### Community 122 - "PF2e Archetypes Tab"
Cohesion: 0.05
Nodes (57): DND5E_SCENE_CONDITIONS, SCENE_CONDITIONS_BY_SYSTEM, sceneConditionOptions(), compileEquipmentEffects(), equipStackPolicy(), isMeaningful(), TYPED_STACK_SYSTEMS, collectD20LegacyConditionEffects() (+49 more)

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
Nodes (23): casterTypes, classResourcesNeeded, classTags, AlwaysPreparedSpellGrant, ClassDisplayMetadata, ClassFeatureProgression, ClassResource, ClassTag (+15 more)

### Community 131 - "Retry With Backoff"
Cohesion: 0.15
Nodes (25): mockedGetSupabaseClient, mockedGetSupabaseClient, retryWithBackoff(), getSupabaseClient(), deleteRemoteCampaign(), deleteRemoteDocument(), extractTombstone(), fetchRemoteCampaigns() (+17 more)

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
Cohesion: 0.39
Nodes (4): ServiceWorkerUpdateBanner(), isServiceWorkerSupported(), ServiceWorkerUpdateState, useServiceWorkerUpdate()

### Community 155 - "5e Movement Rules"
Cohesion: 0.60
Nodes (4): dnd5eCarryingCapacity(), dnd5eHighJump(), dnd5eLongJump(), dnd5ePushDragLift()

### Community 156 - "usePwaInstallPrompt.ts"
Cohesion: 0.43
Nodes (6): DeferredInstallPromptEvent, isStandaloneMode(), readDismissedState(), usePwaInstallPrompt(), UsePwaInstallPromptOptions, writeDismissedState()

### Community 161 - "PF2e Backgrounds Data"
Cohesion: 0.50
Nodes (3): Pf2eBackgroundChoice, Pf2eBackgroundDefinition, Pf2eBackgroundFeatGrant

### Community 180 - "MamPowerBrowserTab.tsx"
Cohesion: 0.09
Nodes (22): MamAbilitiesTab(), MamAdvantageBrowserTab(), MamComplicationBrowser, MamComplicationsTabComponent, Props, EquipmentBrowser, MamEquipmentBrowserTabComponent, Props (+14 more)

### Community 183 - "loadEquipmentForSystem"
Cohesion: 0.50
Nodes (3): Answer, Outcome, Q: where are pending debounced document saves flushed to localStorage on page hide or unload (persistence flush)

### Community 186 - "eslint-plugin-react"
Cohesion: 0.40
Nodes (4): Feat, FeatBrowser(), FeatBrowserProps, feats

## Knowledge Gaps
- **1132 isolated node(s):** `browser`, `es2021`, `node`, `eslint:recommended`, `plugin:@typescript-eslint/recommended` (+1127 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **21 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `App Header & Auth UI` to `Sheet Resource Loading Hooks`, `Dnd5e Sheets & E2E Tests`, `Dnd5e Equipment & Features UI`, `Dnd5e Background Templates`, `MAM Power Browser`, `3.5e Monster Data Encoder`, `Tabs UI Component`, `Scene Combat Resolution`, `Dnd5e Class Templates`, `Monster & NPC Generator`, `Dnd5e Feat Templates`, `D20 Combat Controls`, `Combat & Recap Panels`, `D20 Legacy System Engines`, `Dnd35e Saves & Data Model`, `Daggerheart Data Model`, `System Registry & Renderer`, `Equipment Browser Component`, `Campaign Sync Hooks`, `ServiceWorkerUpdateBanner.tsx`, `Pf2e Character Templates`, `usePwaInstallPrompt.ts`, `Dnd5e Feature List Sections`, `Class Enhancement & Headers`, `AI Encounter Drafting`, `Quest & Session Log UI`, `Sheet Header & Stat Cards`, `Mam3e Data Model & Engine`, `Condition Effects by System`, `Equipped Armor Section`, `Spell Browser UI`, `Error Boundary & Auth Context`, `Encounter Builder Logic`, `Scene Management Hooks`, `Campaign Storage & Hooks`, `MamPowerBrowserTab.tsx`, `SRD Manifest Generator`, `Daggerheart Combatant Builders`, `eslint-plugin-react`, `D20 Legacy Spell Slots`, `ESLint Config`, `Spells Tab Components`, `Browser Compat & Error Logging`, `Character Effects Compilation`, `Dice Panel & Mam3e Resolution`, `Dnd5e Resource Loading Hooks`, `Sync Engine Tests`, `Dnd5e Feature Options`, `Document Migrations & Storage`, `Combat Toggles & Conditions`, `capabilityScenarios.test.tsx`, `Equipment & Feature Browsers`, `Dnd35e/Pf1e Derived Math`, `Skills Tab & Combat Math`, `Document Storage (IndexedDB)`, `AI Creature Identification`, `Oracle Panel & Logic`, `Scene Reaction Panel`, `Document Signature Hashing`, `Campaign File Transfer`?**
  _High betweenness centrality (0.165) - this node is a cross-community bridge._
- **Why does `CharacterDocument` connect `Sheet Header & Stat Cards` to `Dnd5e Equipment & Features UI`, `Dnd5e Background Templates`, `Dnd5e2024 Engine & Hit Dice`, `Daggerheart Engine`, `Retry With Backoff`, `Tabs UI Component`, `Scene Combat Resolution`, `Dnd5e Class Templates`, `pf2eConditions.ts`, `Dnd5e Activity Definitions`, `Monster & NPC Generator`, `D20 Combat Controls`, `D20 Legacy System Engines`, `Dnd35e Saves & Data Model`, `System Registry & Renderer`, `Campaign Sync Hooks`, `Daggerheart Inventory`, `Pf2e Character Templates`, `Dnd5e Feature List Sections`, `Encounter & Initiative Panels`, `AI Encounter Drafting`, `Currency & Inventory Editors`, `Document Sync Engine`, `Check & Oracle Resolution`, `Condition Effects by System`, `Equipped Armor Section`, `Encounter Builder Logic`, `Campaign Storage & Hooks`, `MamPowerBrowserTab.tsx`, `Spell Preparation Logic`, `Daggerheart Combatant Builders`, `D20 Legacy Spell Slots`, `Monster Stat Block & Status`, `System Validation Logic`, `Dnd5e Resource Loading Hooks`, `Document Migrations & Storage`, `App Header & Auth UI`, `Combat Toggles & Conditions`, `Boundary Validation Tests`, `Equipment & Feature Browsers`, `Daggerheart Contribution Ledger`, `Mam Browser Tabs`, `Pf2e Derived Math`, `Mam3e Derived Math`, `Document Signature Hashing`?**
  _High betweenness centrality (0.100) - this node is a cross-community bridge._
- **Why does `GameSystemId` connect `Dnd5e Sheets & E2E Tests` to `Sheet Resource Loading Hooks`, `Dnd5e Equipment & Features UI`, `Dnd5e2024 Engine & Hit Dice`, `Tabs UI Component`, `Scene Combat Resolution`, `Scene Check Panel`, `D20 Combat Controls`, `Game System Selector`, `D20 Legacy System Engines`, `Dnd35e Saves & Data Model`, `Roadmap Metrics Generator`, `Dnd5e Feature List Sections`, `Class Enhancement & Headers`, `AI Encounter Drafting`, `Document Sync Engine`, `Sheet Header & Stat Cards`, `Doc Drift Rules`, `Condition Effects by System`, `Equipped Armor Section`, `Encounter Builder Logic`, `SRD Manifest Generator`, `Daggerheart Combatant Builders`, `SRD Coverage Script`, `Dnd5e Resource Loading Hooks`, `Equipment & Feature Browsers`, `Dnd35e/Pf1e Derived Math`, `3.5e Spell Encoder`, `PF2e Archetypes Tab`?**
  _High betweenness centrality (0.063) - this node is a cross-community bridge._
- **What connects `browser`, `es2021`, `node` to the rest of the system?**
  _1132 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Sheet Resource Loading Hooks` be split into smaller, more focused modules?**
  _Cohesion score 0.05970149253731343 - nodes in this community are weakly interconnected._
- **Should `Dnd5e Sheets & E2E Tests` be split into smaller, more focused modules?**
  _Cohesion score 0.12643678160919541 - nodes in this community are weakly interconnected._
- **Should `Dnd5e Equipment & Features UI` be split into smaller, more focused modules?**
  _Cohesion score 0.06815968841285297 - nodes in this community are weakly interconnected._