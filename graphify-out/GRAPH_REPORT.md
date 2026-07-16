# Graph Report - windsurf-project  (2026-07-16)

## Corpus Check
- 700 files · ~488,826 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 4439 nodes · 12519 edges · 190 communities (171 shown, 19 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 102 edges (avg confidence: 0.71)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `2e8f35bd`
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
- resourcePool.ts
- 5e Movement Rules
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

## Communities (190 total, 19 thin omitted)

### Community 0 - "Sheet Resource Loading Hooks"
Cohesion: 0.07
Nodes (46): loadValidationData(), loadBackgroundsForSystem(), loadClassesForSystem(), loadDaggerheartAncestries(), loadDaggerheartArmor(), loadDaggerheartCommunities(), loadDaggerheartConsumables(), loadDaggerheartDomainCards() (+38 more)

### Community 1 - "Dnd5e Sheets & E2E Tests"
Cohesion: 0.11
Nodes (38): resolveCheck(), footprintCells(), footprintWithinGrid(), isOracleAnswer(), isOracleOdds(), resolveOracle(), applyHitPointDelta(), applySceneEvent() (+30 more)

### Community 2 - "Dnd5e Equipment & Features UI"
Cohesion: 0.17
Nodes (28): EquippedItemsSection(), Props, SLOT_LABELS, SLOT_ORDER, Dnd5e2024DataModel, Dnd5e2024TemplateState, Dnd5eCondition, Dnd5eDataModel (+20 more)

### Community 3 - "Dnd5e Background Templates"
Cohesion: 0.07
Nodes (57): countSelections(), Dnd5eLikeDataModel, optionDisabledForRequirement(), resolveEquipmentSlot(), resolveFeatSelections(), toEquippedItem(), toWeaponDamage(), ABILITY_NAME_TO_ID (+49 more)

### Community 4 - "Dnd5e2024 Engine & Hit Dice"
Cohesion: 0.07
Nodes (28): HIT_DICE, hitDieSize(), hitDieString(), Dnd5e2024Engine, hasAlertFeat(), totalCharacterLevel(), DND5E_CONDITION_NAMES, hasDnd5eCondition() (+20 more)

### Community 5 - "Daggerheart Engine"
Cohesion: 0.10
Nodes (39): applyDnd5eClassTemplate(), applyDnd5eSubclassTemplate(), assertMulticlassRequirements(), ATTRIBUTE_NAME_TO_ID, buildDerivedProficiencies(), buildSpellcastingState(), canSelectSubclass(), classFeaturesAtLevel() (+31 more)

### Community 6 - "3.5e Monster Data Encoder"
Cohesion: 0.16
Nodes (18): ALIGNMENTS, DICE_PROGRESSIONS, main(), mapAlignment(), mod(), MONSTER_SIZE, normalizeName(), OLIMOT_FILES (+10 more)

### Community 7 - "Tabs UI Component"
Cohesion: 0.08
Nodes (44): Badge(), BadgeProps, badgeVariants, Tabs, TabsContent, TabsContentProps, TabsContext, TabsContextValue (+36 more)

### Community 8 - "Node Runtime Bootstrap"
Cohesion: 0.09
Nodes (48): main(), runBootstrapNodeInstall(), getPinnedCommandArgs(), main(), runPinnedNpmCommand(), formatRuntimeDoctorReport(), main(), readWorkflowPinSource() (+40 more)

### Community 9 - "Scene Combat Resolution"
Cohesion: 0.07
Nodes (40): appendSceneEvent(), applySceneIntents(), createSceneDocument(), foldSceneEvents(), resolveSceneAction(), SceneActionOptions, encounterMonsterFixtures, makeScene() (+32 more)

### Community 10 - "Dnd5e Class Templates"
Cohesion: 0.14
Nodes (30): applyAbilityAdjustments(), applyD20LegacyClassTemplate(), applyD20LegacyRaceTemplate(), buildClassSkills(), classFeaturesUpToLevel(), classSkillOptions(), collectClassFeatureSignatures(), create35eClassLevel() (+22 more)

### Community 11 - "System Compute Registers"
Cohesion: 0.17
Nodes (15): daggerheartComputeRegister, dnd35eComputeRegister, dnd5e2014ComputeRegister, dnd5e2024ComputeRegister, COMPUTE_REGISTERS, registerForSystem(), mam3eComputeRegister, pf1eComputeRegister (+7 more)

### Community 12 - "Scene Check Panel"
Cohesion: 0.14
Nodes (18): Props, State, LegalNotices(), LegalNoticesProps, licenseTexts, MonsterStatBlock(), Card, CardContent (+10 more)

### Community 13 - "Dnd5e Activity Definitions"
Cohesion: 0.09
Nodes (27): buildDefenseStyleActivity(), buildDivineSmiteActivities(), buildDivineSmiteActivity(), buildDnd5eActivityDefinitions(), buildUnsupportedDivineSmiteActivity(), divineSmiteSlotLevel(), Dnd5eActivityCost, Dnd5eActivityCostKind (+19 more)

### Community 14 - "Monster & NPC Generator"
Cohesion: 0.24
Nodes (10): formatBackgroundToolLabel(), removeDnd5eClassTemplate(), ChoiceSlot, Dnd5eBackgroundSection(), Props, Dnd5eSheetMutators, GetDnd5eTemplateChoiceStateProps, useDnd5eTemplateHandlers() (+2 more)

### Community 15 - "Dnd5e Feat Templates"
Cohesion: 0.14
Nodes (13): CurrencyEditor(), CurrencyEntry, DND_CURRENCIES, Props, InventoryItem, InventoryManager(), InventoryManagerProps, Currency (+5 more)

### Community 16 - "App Shell & Layout"
Cohesion: 0.18
Nodes (19): UserMenu(), UserMenuProps, SyncState, mockedGetQueuedCampaignsSnapshot, mockedGetQueuedDeletedCampaignIds, mockedGetQueuedDeletedDocumentIds, mockedGetQueuedSyncSnapshot, getQueuedCampaignsSnapshot() (+11 more)

### Community 17 - "D20 Combat Controls"
Cohesion: 0.11
Nodes (31): getEligibleDnd5eFeatureOptions(), applyDnd5eLongRest(), applyDnd5eShortRest(), recoverAllSpellSlots(), recoverFeatures(), recoverLongRestHitDice(), recoverPactMagicSlots(), featureOptionSelectionKey() (+23 more)

### Community 18 - "Game System Selector"
Cohesion: 0.13
Nodes (26): registryMeta, SupportMeta, {
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
}, SystemCatalogSummary, SystemContentCategoryId, SystemContentReachability, SystemContentSummary, SystemSupportLevel (+18 more)

### Community 19 - "Combat & Recap Panels"
Cohesion: 0.09
Nodes (28): buildSceneCombatants(), critModelForScene(), degreeModelForScene(), factionForToken(), ResolveCombatStats, resolveSceneAreaEffect(), runSceneRound(), SceneAreaEffectOutcome (+20 more)

### Community 20 - "D20 Legacy System Engines"
Cohesion: 0.07
Nodes (40): resolveCharacterEffects(), d20LegacyCheckPenalty(), rollD20(), dnd35eAbilityIncreases(), dnd35eConcentrationDCDamage(), dnd35eConcentrationDCDefensive(), dnd35eFeatsFromLevel(), dnd35eHpState (+32 more)

### Community 21 - "Dnd35e Saves & Data Model"
Cohesion: 0.07
Nodes (33): createDefaultDnd35eData(), Dnd35eClassLevel, Dnd35eFeat, Dnd35eManualSpellcastingExtras, Dnd35eSaves, RFC-003, Dnd35eEngine, createDefaultPf1eData() (+25 more)

### Community 22 - "Daggerheart Data Model"
Cohesion: 0.10
Nodes (30): clampDaggerheartInventoryQuantity(), createDaggerheartInventoryEntry(), daggerheartInventoryDefinitions, inventoryDefinitionById, inventoryDefinitionByName, isDaggerheartConsumableDefinition(), normalizeDaggerheartCurrency(), normalizeInteger() (+22 more)

### Community 23 - "System Registry & Renderer"
Cohesion: 0.06
Nodes (29): CharacterListView(), SystemSheetRenderer(), SystemRegistry, SheetProps, SystemDefinition, SystemSheetComponent, ValidationContext, ValidationReason (+21 more)

### Community 24 - "Game Rules & Proficiencies"
Cohesion: 0.07
Nodes (33): GAME_RULES, ArmorProficiency, ArmorProficiencyType, ArtisanToolProficiency, isValidArmorProficiency(), isValidSkillProficiency(), isValidToolProficiency(), isValidWeaponProficiency() (+25 more)

### Community 25 - "Campaign Sync Hooks"
Cohesion: 0.15
Nodes (24): appendInventoryFromBackground(), applyDnd5eBackgroundTemplate(), BackgroundChoiceSlot, BackgroundChoiceValue, backgroundDerivedState(), COMMON_LANGUAGE_OPTIONS, Dnd5eBackgroundTemplateSelections, Dnd5eLikeDataModel (+16 more)

### Community 26 - "Daggerheart Inventory"
Cohesion: 0.12
Nodes (27): findDaggerheartInventoryDefinitionByName(), ancestryLookup, armorLookup, buildLookup(), classLookup, communityLookup, DEFAULTS, domainCardByName (+19 more)

### Community 27 - "Pf2e Character Templates"
Cohesion: 0.09
Nodes (45): createDefaultPf2eData(), abilityBoostValue(), ancestryFeatures(), applyAbilityAdjustments(), applyPf2eAncestryTemplate(), applyPf2eArchetypeTemplate(), applyPf2eBackgroundTemplate(), applyPf2eClassTemplate() (+37 more)

### Community 28 - "Roadmap Metrics Generator"
Cohesion: 0.09
Nodes (38): applyRepoResidentOverrides(), buildComputeCompletion(), buildContentCompletion(), buildMarkdownReport(), ComputeCompletionRow, computeMetrics(), ContentCompletionRow, createEmptyCategoryCounts() (+30 more)

### Community 29 - "Dnd5e Feature List Sections"
Cohesion: 0.09
Nodes (38): react, DamageHealControl(), DamageHealControlProps, DiceRollButton(), DiceRollButtonProps, RollResult, ABILITIES, D20AbilitiesTab() (+30 more)

### Community 30 - "Encounter & Initiative Panels"
Cohesion: 0.14
Nodes (29): getDnd5eTemplateChoiceState(), applyDnd5eSpeciesTemplate(), buildAbilityChoiceSlots(), buildSpeciesFeatures(), choiceAbilityBonuses(), COMMON_LANGUAGE_OPTIONS, Dnd5eLikeDataModel, Dnd5eSpeciesChoiceSlot (+21 more)

### Community 31 - "Class Enhancement & Headers"
Cohesion: 0.12
Nodes (20): Dnd5eEquipmentTab, BrowserFeat, Dnd5eFeatBrowserTab, Dnd5eFeatBrowserTabComponent, FeatBrowser, FeatBrowserProps, Props, Dnd5eFeaturesTab (+12 more)

### Community 32 - "Pf2e Sheet Tabs"
Cohesion: 0.12
Nodes (29): Props, Pf2eArchetypesTab(), Props, Pf2eInventoryTab(), Props, Pf2eNotesTab(), Props, Pf2eClassLevel (+21 more)

### Community 33 - "AI Encounter Drafting"
Cohesion: 0.03
Nodes (95): draftEncounterWithAi(), CR_XP_TABLE, formatChallengeRating(), MonsterBrowser(), MonsterBrowserProps, MonsterStatBlockProps, EncounterPanel(), EncounterPanelProps (+87 more)

### Community 34 - "Quest & Session Log UI"
Cohesion: 0.15
Nodes (25): QuestList(), STATUS_BADGE, STATUS_OPTIONS, DATE_FORMAT, SessionLog(), T0, T1, CampaignObjective (+17 more)

### Community 35 - "Currency & Inventory Editors"
Cohesion: 0.10
Nodes (29): AttackResolution, AttackResolutionInput, resolveAttack(), rollD20(), AreaEffectInput, AreaEffectOutcome, AreaEffectResult, AttackTarget (+21 more)

### Community 36 - "Document Sync Engine"
Cohesion: 0.14
Nodes (27): isRoundConclusive(), RoundCombatant, RoundTurnRecord, runCombatRound(), RunRoundInput, toActor(), toTarget(), RFC-003 (+19 more)

### Community 37 - "Sheet Header & Stat Cards"
Cohesion: 0.16
Nodes (13): categoryIcons, GameSystemSelector(), GameSystemSelectorProps, systemAccents, NewCharacterDialog(), Props, supportBadgeLabels, supportBadgeStyles (+5 more)

### Community 38 - "Check & Oracle Resolution"
Cohesion: 0.09
Nodes (16): Dnd5e2024SystemDef, createDefaultDnd5eData(), Dnd5eSystemDef, Dnd5eEngine, createDnd5eValidator(), makeDoc(), createRegistry(), TEST_DATE (+8 more)

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
Cohesion: 0.05
Nodes (48): IllustrateSceneResult, AppContent(), cloneSystemData(), LegalNotices, SceneManager, STORAGE_WARNING_THRESHOLD, CampaignManager(), CharacterSortOption (+40 more)

### Community 43 - "Equipped Armor Section"
Cohesion: 0.11
Nodes (21): EquipArmorInput, EquipEntry, EquippedArmorSection(), EquipShieldInput, Props, fullPlate, leather, steelShield (+13 more)

### Community 44 - "Spell Browser UI"
Cohesion: 0.13
Nodes (24): SpellBrowser(), SpellBrowserProps, SpellBrowserSpell, D20SpellBrowserPanelComponent, SpellBrowser, toSpellBrowserSpell(), Dnd5eSpellsTabComponent, Props (+16 more)

### Community 45 - "Scene Combat Area Effects"
Cohesion: 0.15
Nodes (26): ManifestCategory, buildSystem(), CATEGORY_LOADERS, CategoryLoader, escape(), isRecord(), Loaded, main() (+18 more)

### Community 46 - "Error Boundary & Auth Context"
Cohesion: 0.11
Nodes (17): Mode, SignIn(), SignInProps, AuthContext, getLastSyncedUserId(), setLastSyncedUserId(), AuthProvider(), useAuth() (+9 more)

### Community 47 - "Encounter Builder Logic"
Cohesion: 0.17
Nodes (15): buildNotice(), FetchTarget, fetchValidated(), HTML_ENTITIES, looksLikeHtml(), main(), normalize(), noticePath (+7 more)

### Community 48 - "Scene Management Hooks"
Cohesion: 0.09
Nodes (35): Props, SceneCreateFormProps, UseSceneEncounterParams, Props, DebouncedPersistence, IMPORTANT: a begun generation must end in either `persist` or, useDebouncedPersistence(), useScenes() (+27 more)

### Community 49 - "Monster Combatant Builder"
Cohesion: 0.12
Nodes (19): SAVE_ABILITIES, SKILL_ABILITIES, Pf2eSystemDef, getPf2eStatusPenalty(), inferPf2eCastingType(), inferPf2eTradition(), parseFixedPositiveInt(), Pf2eEngine (+11 more)

### Community 50 - "D20 Legacy Templates"
Cohesion: 0.09
Nodes (42): availableD20LegacyToggles(), D20CombatSection(), Props, D20EquipmentBrowserTab, D20FeatBrowserTab, D20LegacyHeader(), countTrainedSkills(), D20InventoryCurrency (+34 more)

### Community 51 - "Campaign Storage & Hooks"
Cohesion: 0.11
Nodes (30): Props, Props, useCampaigns(), makeScene(), hostileStorage, Campaign, CAMPAIGNS_STORAGE_KEY, CampaignStorageData (+22 more)

### Community 52 - "Spell Preparation Logic"
Cohesion: 0.09
Nodes (16): createDefaultDnd5e2024Data(), makeDoc(), makeDoc(), make2024Doc(), boonOfSkill, crafter, fixtureBenefits, keen_mind (+8 more)

### Community 53 - "Dev Dependencies"
Cohesion: 0.05
Nodes (41): autoprefixer, eslint, eslint-config-prettier, eslint-plugin-react-hooks, eslint-plugin-react-refresh, happy-dom, devDependencies, autoprefixer (+33 more)

### Community 54 - "Character Combatant Builder"
Cohesion: 0.12
Nodes (24): effectToLedgerEntry(), toContributionLedger(), toLedgerOperation(), toLedgerValue(), ActionDescriptor, ConditionDescriptor, EffectOperation, EffectSource (+16 more)

### Community 55 - "D20 Class Spellcasting"
Cohesion: 0.18
Nodes (17): ability(), ALIGNMENT_ABBREV, bucketFor(), CR_FRACTIONS, CREATURE_TYPES, creatureDir, DAMAGE_TYPES, main() (+9 more)

### Community 56 - "SRD Manifest Generator"
Cohesion: 0.19
Nodes (16): MamArchetypesTab, MamComplicationsTab, MamEquipmentBrowserTab, MamPowerBrowserTab, useLazyResource(), useMam3eSheetResources(), UseMam3eSheetResourcesProps, SYSTEM_ID (+8 more)

### Community 57 - "Daggerheart Combatant Builders"
Cohesion: 0.05
Nodes (40): AppHeaderProps, Props, CharacterCardProps, CharacterListViewProps, Props, LibrarySegment, SystemEngine, SystemValidator (+32 more)

### Community 58 - "AI Gateway Adapters"
Cohesion: 0.12
Nodes (20): createGeminiAdapter(), IMAGE_TASKS, TASK_SCHEMAS, AI_GATEWAY_SCHEMA_VERSION, aiFailure, AiResponse, AiTask, AiProviderAdapter (+12 more)

### Community 59 - "AI Gateway Contracts"
Cohesion: 0.14
Nodes (26): AI_GATEWAY_TASKS, AiFailureCode, AiParse, AiSuccess, AiUsage, EncounterDraftRequest, IdentifyCreatureRequest, IllustrateSceneRequest (+18 more)

### Community 60 - "System Definitions & Types"
Cohesion: 0.08
Nodes (26): D20EquipmentBrowserTabComponent, EquipmentBrowser, Props, CurrencyEditor, CurrencyEditorProps, Dnd5eEquipmentTabComponent, EquipmentBrowser, EquipmentBrowserItem (+18 more)

### Community 61 - "D20 Legacy Spell Slots"
Cohesion: 0.19
Nodes (11): Dnd5eAbilitiesTab(), Props, Dnd5eNotesTab(), Dnd5ePersonality, Props, Dnd5eTabsNavigation(), Dnd5eWeaponMasteriesTab(), DND5E_ABILITY_NAMES (+3 more)

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
Cohesion: 0.17
Nodes (13): e(), BrowserCapabilities, checkBrowserCapabilities(), initBrowserCompat(), isBrowserSupported(), showCompatibilityWarning(), ErrorCategory, ErrorLog (+5 more)

### Community 66 - "AI Gateway Client"
Cohesion: 0.27
Nodes (8): ToastContext, ToastContextValue, ToastItem, ToastProvider(), VARIANT_ICONS, VARIANT_STYLES, registerToastHandler(), ToastVariant

### Community 67 - "2024 Monster Data Encoder"
Cohesion: 0.16
Nodes (23): ABILITIES, ALIGNMENTS, bucketFor(), classifyImmunityList(), cleanProse(), CR_FRACTIONS, CREATURE_TYPES, DAMAGE_TYPES (+15 more)

### Community 68 - "Character Effects Compilation"
Cohesion: 0.08
Nodes (32): AttackEconomy, bestAttackAbility(), D20_PROFILES, D20SystemProfile, dnd5eProfile, extraAttackCount(), featureAttackEconomy(), legacyD20Profile() (+24 more)

### Community 69 - "TypeScript Config"
Cohesion: 0.07
Nodes (28): ES2020, ./src/*, compilerOptions, allowImportingTsExtensions, baseUrl, forceConsistentCasingInFileNames, isolatedModules, jsx (+20 more)

### Community 70 - "Mam Character Sheet Tabs"
Cohesion: 0.12
Nodes (23): MUTATION_ANCHORS, MutationAnchor, applyDemotion(), DO_MUTATE, DO_WRITE, escapeRe(), evaluateMutation(), evaluateTierA() (+15 more)

### Community 71 - "Monster Stat Block & Status"
Cohesion: 0.33
Nodes (12): clampCount(), createPool(), isExhausted(), isFull(), poolFromRemaining(), remainingOf(), remainingShape(), reset() (+4 more)

### Community 72 - "Dice Panel & Mam3e Resolution"
Cohesion: 0.09
Nodes (40): buildCharacterCombatant(), BuildCharacterCombatantResult, normalizeSheet(), readArmorClass(), toMagicBonusItems(), toModifierSources(), num(), pf2eWeaponProficiency() (+32 more)

### Community 73 - "System Validation Logic"
Cohesion: 0.11
Nodes (35): Dnd5eTemplateState, AddEntryInput, buildAlwaysPreparedSpellEntries(), buildDnd5eContributionLedger(), buildFeatAutomationEntries(), buildListEntry(), buildTemplateProficiencyEntries(), createEntry() (+27 more)

### Community 74 - "Spell Catalog Consistency Tests"
Cohesion: 0.16
Nodes (14): ExpectedSpellIdentity, iconicSpellExpectations, SystemKey, systems, dedupeById(), Identified, indexById(), warnDuplicateId() (+6 more)

### Community 75 - "Dnd5e Resource Loading Hooks"
Cohesion: 0.25
Nodes (16): getDaggerheartAncestryAdjustments(), applyDaggerheartAncestryTemplate(), applyDaggerheartClassTemplate(), applyDaggerheartCommunityTemplate(), classTemplateItems(), communityTemplateItems(), DaggerheartInventoryEntry, DEFAULTS (+8 more)

### Community 76 - "Mam Powers & Cost Ledger"
Cohesion: 0.05
Nodes (70): ABILITIES, DEFENSES, MamAbilitiesTab(), Props, MamArchetypeBrowser(), MamArchetypeBrowserProps, MamConditionsTab(), Props (+62 more)

### Community 77 - "Sync Engine Tests"
Cohesion: 0.29
Nodes (12): NOW, clearSyncTombstones(), getSyncTombstonedIds(), getSyncTombstones(), pruneExpired(), readStored(), recordSyncTombstones(), removeSyncTombstones() (+4 more)

### Community 78 - "Dnd5e Feature Options"
Cohesion: 0.11
Nodes (33): Dnd5eFeatureOptionsSection(), Dnd5eFeatureOptionsSectionComponent, FeatureOptionBrowser, FeatureOptionBrowserProps, featureOptionSelectionKey(), Props, FeatureOptionBrowser(), FeatureOptionBrowserProps (+25 more)

### Community 79 - "Document Migrations & Storage"
Cohesion: 0.07
Nodes (49): clearLocalDataForAccountChange(), cloneDocumentsSnapshot(), documentsChanged(), prepareDocumentsWithEngines(), prepareDocumentWithEngine(), useDocuments(), makeStoredDocument(), setStoredDocuments() (+41 more)

### Community 80 - "App Header & Auth UI"
Cohesion: 0.18
Nodes (15): AppHeader(), assertNever(), INITIAL_NAV_STATE, LIBRARY_SEGMENTS, librarySegmentLabel(), NavAction, navReducer(), Overlay (+7 more)

### Community 81 - "Combat Toggles & Conditions"
Cohesion: 0.08
Nodes (33): useEntitySync(), Doc, useSync(), UseSyncOptions, baseAuthValue, mockedClearQueuedDeletedDocumentIds, mockedClearQueuedSyncSnapshot, mockedDeleteRemoteDocument (+25 more)

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
Cohesion: 0.27
Nodes (9): DaggerheartDomainCardAutomation(), DaggerheartDomainCardAutomationProps, DaggerheartFeatureListProps, DaggerheartSubclassFeatureGroupProps, DOMAIN_CARD_AUTOMATION_LABELS, DOMAIN_CARD_AUTOMATION_VARIANTS, humanizeEffectTag(), DaggerheartAutomationMode (+1 more)

### Community 86 - "Equipment & Feature Browsers"
Cohesion: 0.17
Nodes (14): getDaggerheartHpMarked(), getDaggerheartHpMarkedAfterArmor(), createDefaultDaggerheartData(), DaggerheartDataModel, DaggerheartEngine, TEST_DATE, DaggerheartDomainCardEntry, daggerheartPassiveAuditAttributes (+6 more)

### Community 87 - "Pf2e Engine & Constants"
Cohesion: 0.09
Nodes (20): GapLedgerItem, LedgerPhase, LedgerStatus, LedgerTag, LedgerTrack, MASTER_GAP_LEDGER, RFC-003, byPhase (+12 more)

### Community 88 - "Documents Hook & Persistence"
Cohesion: 0.08
Nodes (44): InitiativeTrackerProps, SceneGridViewProps, SceneCombatStats, CharacterCombatant, buildDaggerheartAdversaryCombatant(), BuildDaggerheartAdversaryResult, DaggerheartAdversaryCombatant, RANGE_CELLS (+36 more)

### Community 89 - "Daggerheart Contribution Ledger"
Cohesion: 0.09
Nodes (49): ANCESTRY_ADJUSTMENTS_BY_ID, ancestryByName, classByName, DAGGERHEART_TRAITS, DaggerheartAncestryAdjustments, DaggerheartRange, DEFAULT_DAGGERHEART_ANCESTRY_ADJUSTMENTS, doesDaggerheartPassiveConditionApply() (+41 more)

### Community 90 - "Dnd35e/Pf1e Derived Math"
Cohesion: 0.36
Nodes (7): ThemeToggle(), applyTheme(), getSystemTheme(), isTheme(), Theme, useTheme(), VALID_THEMES

### Community 91 - "Mam Browser Tabs"
Cohesion: 0.12
Nodes (19): Props, Props, Props, focusPulseSpell, PF2E_DERIVED_TRAITS, PF2E_SCHOOL_TRAITS, PF2E_TRADITIONS, AbilityScores (+11 more)

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
Cohesion: 0.08
Nodes (33): DicePanel(), DicePanelProps, formatBreakdown(), QUICK_ROLLS, DISPOSITION_BADGE, DISPOSITION_LABEL, ReactionHistoryEntry, ReactionPanel() (+25 more)

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
Nodes (16): AuthContextValue, baseAuthValue, mockedClearQueuedCampaignsSnapshot, mockedClearQueuedDeletedCampaignIds, mockedDeleteRemoteCampaign, mockedFetchRemoteCampaigns, mockedGetQueuedCampaignsSnapshot, mockedGetQueuedDeletedCampaignIds (+8 more)

### Community 106 - "Character Card Presenter"
Cohesion: 0.18
Nodes (17): AbilityScoreGrid(), buildPointBuyDraft(), buildStandardArrayDraft(), clampPointBuyScore(), emptyPointBuyDraft(), emptyStandardArrayDraft(), isStandardArrayComplete(), isValidPointBuyDraft() (+9 more)

### Community 107 - "Oracle Panel & Logic"
Cohesion: 0.04
Nodes (70): illustrateSceneWithAi(), NarrateSceneResult, CheckPanel(), CheckPanelProps, OUTCOME_BADGE, OUTCOME_LABEL, SKILL_SUGGESTIONS, CombatPanel() (+62 more)

### Community 108 - "5e Equipment Tab"
Cohesion: 0.17
Nodes (14): GamingSetProficiency, MusicalInstrumentProficiency, buildChoiceSlots(), formatDnd5eClassToolChoiceLabel(), getDnd5eClassSkillChoiceSlots(), getDnd5eClassToolChoiceSlots(), canSelectSubclass(), Dnd5eClassesSection() (+6 more)

### Community 109 - "Scene Reaction Panel"
Cohesion: 0.43
Nodes (5): getEditableTarget(), KeyboardShortcut, useKeyboardNavigation(), Harness(), HarnessProps

### Community 111 - "Resource Pool Tracking"
Cohesion: 0.18
Nodes (10): AI_GATEWAY_ENDPOINT, AiRequest, SceneNarrationData, callAiGateway(), isAiEnabled(), NarrateSceneParams, narrateSceneWithAi(), NarrationGatewayCall (+2 more)

### Community 112 - "Bundle Size Check"
Cohesion: 0.10
Nodes (15): appChunk, appChunks, assetsDir, budgets, chunks, dataChunks, distDir, eagerChunkNames (+7 more)

### Community 113 - "AI Prompt Builders"
Cohesion: 0.29
Nodes (12): EncounterDraftPayload, IdentifyCreaturePayload, IllustrateScenePayload, SceneNarrationPayload, buildEncounterDraftPrompt(), buildIdentifyCreaturePrompt(), buildIllustrateScenePrompt(), buildPromptForTask() (+4 more)

### Community 114 - "5e Feat Browser"
Cohesion: 0.07
Nodes (35): Condition, ConditionPicker(), Props, FeaturesSection(), Props, ProficiencyListSection(), Props, NormalizedSheet (+27 more)

### Community 115 - "Project Dependencies"
Cohesion: 0.09
Nodes (23): ai, @ai-sdk/google, class-variance-authority, clsx, lucide-react, dependencies, ai, @ai-sdk/google (+15 more)

### Community 116 - "3.5e Spell Encoder"
Cohesion: 0.28
Nodes (7): SYSTEM_IDS, getSystemAssetPrefetchStateForTests(), prefetchedSystemAssets, prefetchedSystemRuntimeData, prefetchedSystemSheets, resetSystemAssetPrefetchStateForTests(), systemAssetPrefetchers

### Community 117 - "AI Encounter Draft Flow"
Cohesion: 0.18
Nodes (10): AiImageInput, IdentifyCreatureData, IdentifyCreatureParams, IdentifyCreatureResult, identifyCreatureWithAi(), IdentifyGatewayCall, RFC-002, fileToAiImageInput() (+2 more)

### Community 118 - "Campaign File Transfer"
Cohesion: 0.20
Nodes (17): D20SkillsTab(), Props, buildArmorClassEntries(), daggerheartDamageDiceCount(), DND35E_SYNERGY_SOURCES, dnd35eMaxSkillRanks(), dnd35eSkillSynergyTotal(), dnd35eSynergyBonus() (+9 more)

### Community 119 - "MAM Archetype Browser"
Cohesion: 0.27
Nodes (11): CLASS_TOKENS, d20srdUrl(), FILES, main(), mapCastingTime(), mapDuration(), mapRange(), normalizeName() (+3 more)

### Community 120 - "PF1e Spell Encoder"
Cohesion: 0.27
Nodes (11): CLASS_COLUMNS, main(), mapCastingTime(), mapDuration(), mapRange(), RFC-4180, normalizeName(), parseCsv() (+3 more)

### Community 122 - "PF2e Archetypes Tab"
Cohesion: 0.09
Nodes (30): resolveSceneAttack(), collectD20LegacyConditionEffects(), collectDnd5eConditionEffects(), conditionImposesDisadvantage(), collectPf2eConditionEffects(), ConditionScope, getPf2eConditionStatusPenalty(), highestValue() (+22 more)

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
Cohesion: 0.60
Nodes (3): formatModifierCost(), MamPowerModifierBrowser(), MamPowerModifierBrowserProps

### Community 130 - "d20LegacySpellcasting.ts"
Cohesion: 0.05
Nodes (52): casterTypes, classResourcesNeeded, classTags, D20ClassesSection(), D20LegacyClassLevel, Props, renderClassOptions(), Props (+44 more)

### Community 131 - "Retry With Backoff"
Cohesion: 0.16
Nodes (27): useCampaignSync(), UseCampaignSyncOptions, mockedGetSupabaseClient, getSupabaseClient(), clearQueuedCampaignsSnapshot(), clearQueuedDeletedCampaignIds(), clearQueuedIds(), deleteRemoteCampaign() (+19 more)

### Community 132 - "2024 Spell Encoder"
Cohesion: 0.39
Nodes (8): main(), mapCastingTime(), mapDuration(), mapRange(), normalizeName(), SCHOOLS, slug(), ts()

### Community 133 - "MAM Power Browser"
Cohesion: 0.17
Nodes (11): CombatTogglesSection(), Props, availablePf2eToggles(), PF2E_TOGGLE_LABELS, Dnd5eRiderTogglesSection(), Props, TOGGLE_LABELS, PF2E_CONDITIONS (+3 more)

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
Cohesion: 0.70
Nodes (4): EntitySyncAdapter, UseEntitySyncOptions, RemoteFetchResult, SyncTombstone

### Community 141 - "pf2eSpellTraits.test.ts"
Cohesion: 1.00
Nodes (3): averageHitDieRoll(), hitDieFaces(), seedHitDieRolls()

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
Cohesion: 0.28
Nodes (6): GeneratedImageData, TaskGatewayCall, IllustrateGatewayCall, IllustrateSceneParams, RFC-002, image

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
Cohesion: 0.18
Nodes (8): Equipment, EquipmentBrowser(), EquipmentBrowserProps, Feat, FeatBrowser(), FeatBrowserProps, equipment, feats

### Community 154 - "resourcePool.ts"
Cohesion: 0.13
Nodes (14): MamAdvantageBrowserTab(), Props, MamArchetypeBrowser, MamArchetypesTabComponent, Props, MamComplicationBrowser, MamComplicationsTabComponent, Props (+6 more)

### Community 155 - "5e Movement Rules"
Cohesion: 0.60
Nodes (4): dnd5eCarryingCapacity(), dnd5eHighJump(), dnd5eLongJump(), dnd5ePushDragLift()

### Community 157 - "MAM Power Modifier Browser"
Cohesion: 0.60
Nodes (3): clampExhaustion(), Props, RestControls()

### Community 160 - "capabilityScenarios.test.tsx"
Cohesion: 0.15
Nodes (21): useLazyResource(), useSystemOptions(), D20FeatBrowserTabComponent, FeatBrowser, Props, useD20LegacySheetResources(), UseD20LegacySheetResourcesProps, UseDaggerheartSheetResourcesProps (+13 more)

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
- **1124 isolated node(s):** `browser`, `es2021`, `node`, `eslint:recommended`, `plugin:@typescript-eslint/recommended` (+1119 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **19 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `Dnd5e Feature List Sections` to `Toast Notifications`, `Daggerheart Sheet Automation`, `Dnd5e Equipment & Features UI`, `Retry With Backoff`, `d20LegacySpellcasting.ts`, `MAM Power Browser`, `Dnd5e Background Templates`, `Tabs UI Component`, `Scene Combat Resolution`, `Dnd5e Class Templates`, `Scene Check Panel`, `pf2eConditions.ts`, `Monster & NPC Generator`, `Dnd5e Feat Templates`, `App Shell & Layout`, `D20 Combat Controls`, `Daggerheart Data Model`, `System Registry & Renderer`, `Equipment Browser Component`, `resourcePool.ts`, `Pf2e Character Templates`, `MAM Power Modifier Browser`, `Class Enhancement & Headers`, `capabilityScenarios.test.tsx`, `AI Encounter Drafting`, `Quest & Session Log UI`, `Pf2e Sheet Tabs`, `Sheet Header & Stat Cards`, `Mam3e Data Model & Engine`, `Condition Effects by System`, `Equipped Armor Section`, `Spell Browser UI`, `Scene Combat Area Effects`, `Error Boundary & Auth Context`, `Scene Management Hooks`, `D20 Legacy Templates`, `Campaign Storage & Hooks`, `MamPowerBrowserTab.tsx`, `SRD Manifest Generator`, `Daggerheart Combatant Builders`, `System Definitions & Types`, `ESLint Config`, `Spells Tab Components`, `AI Gateway Client`, `Dnd5e Resource Loading Hooks`, `Mam Powers & Cost Ledger`, `Dnd5e Feature Options`, `Document Migrations & Storage`, `App Header & Auth UI`, `Combat Toggles & Conditions`, `Dnd35e/Pf1e Derived Math`, `Skills Tab & Combat Math`, `Document Storage (IndexedDB)`, `AI Creature Identification`, `Character Card Presenter`, `Oracle Panel & Logic`, `Scene Reaction Panel`, `5e Feat Browser`, `Campaign File Transfer`?**
  _High betweenness centrality (0.132) - this node is a cross-community bridge._
- **Why does `CharacterDocument` connect `Daggerheart Combatant Builders` to `d20LegacySpellcasting.ts`, `Dnd5e Background Templates`, `Dnd5e2024 Engine & Hit Dice`, `Daggerheart Engine`, `MAM Power Browser`, `Tabs UI Component`, `Dnd5e Equipment & Features UI`, `Scene Combat Resolution`, `Dnd5e Class Templates`, `Retry With Backoff`, `Dnd5e Activity Definitions`, `Monster & NPC Generator`, `pf2eSpellTraits.test.ts`, `D20 Combat Controls`, `D20 Legacy System Engines`, `Dnd35e Saves & Data Model`, `System Registry & Renderer`, `Campaign Sync Hooks`, `Daggerheart Inventory`, `Pf2e Character Templates`, `Dnd5e Feature List Sections`, `Encounter & Initiative Panels`, `Pf2e Sheet Tabs`, `AI Encounter Drafting`, `Check & Oracle Resolution`, `Condition Effects by System`, `Scene Management Hooks`, `Monster Combatant Builder`, `D20 Legacy Templates`, `Campaign Storage & Hooks`, `Spell Preparation Logic`, `D20 Legacy Spell Slots`, `Dice Panel & Mam3e Resolution`, `System Validation Logic`, `Dnd5e Resource Loading Hooks`, `Mam Powers & Cost Ledger`, `Document Migrations & Storage`, `Combat Toggles & Conditions`, `Boundary Validation Tests`, `Equipment & Feature Browsers`, `Documents Hook & Persistence`, `Daggerheart Contribution Ledger`, `Pf2e Derived Math`, `Mam3e Derived Math`, `Oracle Panel & Logic`, `PF2e Archetypes Tab`?**
  _High betweenness centrality (0.098) - this node is a cross-community bridge._
- **Why does `GameSystemId` connect `capabilityScenarios.test.tsx` to `Sheet Resource Loading Hooks`, `d20LegacySpellcasting.ts`, `Dnd5e Equipment & Features UI`, `Dnd5e2024 Engine & Hit Dice`, `Tabs UI Component`, `Scene Combat Resolution`, `Dnd5e Class Templates`, `D20 Combat Controls`, `Game System Selector`, `Dnd35e Saves & Data Model`, `Roadmap Metrics Generator`, `Class Enhancement & Headers`, `Pf2e Sheet Tabs`, `AI Encounter Drafting`, `Sheet Header & Stat Cards`, `Doc Drift Rules`, `Condition Effects by System`, `Scene Combat Area Effects`, `D20 Legacy Templates`, `Character Combatant Builder`, `SRD Manifest Generator`, `Daggerheart Combatant Builders`, `SRD Coverage Script`, `Character Effects Compilation`, `Dice Panel & Mam3e Resolution`, `Mam Powers & Cost Ledger`, `3.5e Spell Encoder`?**
  _High betweenness centrality (0.055) - this node is a cross-community bridge._
- **What connects `browser`, `es2021`, `node` to the rest of the system?**
  _1124 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Sheet Resource Loading Hooks` be split into smaller, more focused modules?**
  _Cohesion score 0.07358156028368794 - nodes in this community are weakly interconnected._
- **Should `Dnd5e Sheets & E2E Tests` be split into smaller, more focused modules?**
  _Cohesion score 0.10852713178294573 - nodes in this community are weakly interconnected._
- **Should `Dnd5e Background Templates` be split into smaller, more focused modules?**
  _Cohesion score 0.073224043715847 - nodes in this community are weakly interconnected._