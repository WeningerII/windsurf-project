# Graph Report - windsurf-project  (2026-07-16)

## Corpus Check
- 700 files · ~488,186 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 4437 nodes · 12513 edges · 194 communities (175 shown, 19 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 102 edges (avg confidence: 0.71)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `9578b9f9`
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

## Communities (194 total, 19 thin omitted)

### Community 0 - "Sheet Resource Loading Hooks"
Cohesion: 0.06
Nodes (80): buildSystem(), CATEGORY_LOADERS, CategoryLoader, escape(), isRecord(), Loaded, main(), SystemConfig (+72 more)

### Community 1 - "Dnd5e Sheets & E2E Tests"
Cohesion: 0.10
Nodes (41): resolveCheck(), BuildEncounterEventsResult, footprintCells(), footprintWithinGrid(), isOracleAnswer(), isOracleOdds(), resolveOracle(), applyHitPointDelta() (+33 more)

### Community 2 - "Dnd5e Equipment & Features UI"
Cohesion: 0.14
Nodes (33): EquippedItemsSection(), Props, SLOT_LABELS, SLOT_ORDER, NormalizedSheet, Dnd5e2024DataModel, Dnd5e2024TemplateState, Dnd5eCondition (+25 more)

### Community 3 - "Dnd5e Background Templates"
Cohesion: 0.07
Nodes (57): countSelections(), optionDisabledForRequirement(), resolveEquipmentSlot(), resolveFeatSelections(), toEquippedItem(), toWeaponDamage(), ABILITY_NAME_TO_ID, ABILITY_OPTIONS (+49 more)

### Community 4 - "Dnd5e2024 Engine & Hit Dice"
Cohesion: 0.07
Nodes (28): HIT_DICE, hitDieSize(), hitDieString(), Dnd5e2024Engine, hasAlertFeat(), totalCharacterLevel(), DND5E_CONDITION_NAMES, hasDnd5eCondition() (+20 more)

### Community 5 - "Daggerheart Engine"
Cohesion: 0.09
Nodes (43): applyDnd5eClassTemplate(), applyDnd5eSubclassTemplate(), assertMulticlassRequirements(), ATTRIBUTE_NAME_TO_ID, buildDerivedProficiencies(), buildSpellcastingState(), canSelectSubclass(), classFeaturesAtLevel() (+35 more)

### Community 6 - "3.5e Monster Data Encoder"
Cohesion: 0.09
Nodes (35): ALIGNMENTS, DICE_PROGRESSIONS, main(), mapAlignment(), mod(), MONSTER_SIZE, normalizeName(), OLIMOT_FILES (+27 more)

### Community 7 - "Tabs UI Component"
Cohesion: 0.08
Nodes (42): Badge(), BadgeProps, badgeVariants, Tabs, TabsContent, TabsContentProps, TabsContext, TabsContextValue (+34 more)

### Community 8 - "Node Runtime Bootstrap"
Cohesion: 0.09
Nodes (48): main(), runBootstrapNodeInstall(), getPinnedCommandArgs(), main(), runPinnedNpmCommand(), formatRuntimeDoctorReport(), main(), readWorkflowPinSource() (+40 more)

### Community 9 - "Scene Combat Resolution"
Cohesion: 0.05
Nodes (51): ResolveCombatStats, SceneCombatStats, areaEffectToDamageIntent(), multiTargetAttackToDamageIntent(), appendSceneEvent(), applySceneIntents(), createSceneDocument(), foldSceneEvents() (+43 more)

### Community 10 - "Dnd5e Class Templates"
Cohesion: 0.14
Nodes (30): applyAbilityAdjustments(), applyD20LegacyClassTemplate(), applyD20LegacyRaceTemplate(), buildClassSkills(), classFeaturesUpToLevel(), classSkillOptions(), collectClassFeatureSignatures(), create35eClassLevel() (+22 more)

### Community 11 - "System Compute Registers"
Cohesion: 0.17
Nodes (15): daggerheartComputeRegister, dnd35eComputeRegister, dnd5e2014ComputeRegister, dnd5e2024ComputeRegister, COMPUTE_REGISTERS, registerForSystem(), mam3eComputeRegister, pf1eComputeRegister (+7 more)

### Community 12 - "Scene Check Panel"
Cohesion: 0.10
Nodes (20): ErrorBoundary, Props, State, LegalNotices(), LegalNoticesProps, licenseTexts, MonsterStatBlock(), MonsterStatBlockProps (+12 more)

### Community 13 - "Dnd5e Activity Definitions"
Cohesion: 0.11
Nodes (26): buildDefenseStyleActivity(), buildDivineSmiteActivities(), buildDivineSmiteActivity(), buildDnd5eActivityDefinitions(), buildUnsupportedDivineSmiteActivity(), divineSmiteSlotLevel(), Dnd5eActivityCost, Dnd5eActivityCostKind (+18 more)

### Community 14 - "Monster & NPC Generator"
Cohesion: 0.13
Nodes (20): D20LegacyHeader(), Props, ChoiceSlot, Dnd5eSpeciesSection(), Props, formatDnd5eSpeciesToolLabel(), UseDnd5eTemplateHandlersProps, Pf2eHeader() (+12 more)

### Community 15 - "Dnd5e Feat Templates"
Cohesion: 0.10
Nodes (21): EquippedArmorSection(), InventoryItem, InventoryManager(), InventoryManagerProps, D20FeatBrowserTab, Currency, D20InventoryTab(), InventoryItem (+13 more)

### Community 16 - "App Shell & Layout"
Cohesion: 0.15
Nodes (19): Mode, SignIn(), SignInProps, UserMenu(), UserMenuProps, useAuth(), SyncState, Probe() (+11 more)

### Community 17 - "D20 Combat Controls"
Cohesion: 0.08
Nodes (33): casterTypes, classResourcesNeeded, classTags, ABILITY_TOKEN_MAP, collectAlwaysPreparedByLevelSources(), collectAlwaysPreparedGrantSources(), evaluatePreparedCasterFormula(), getDnd5eAlwaysPreparedSpellIds() (+25 more)

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
Cohesion: 0.22
Nodes (17): MamPowersTab(), ModifierColumn(), ModifierColumnProps, buildMam3eContributionLedger(), buildMam3ePowerCostLedgerEntries(), createPowerCostEntry(), ledgerId(), normalizeConditionTrack() (+9 more)

### Community 20 - "D20 Legacy System Engines"
Cohesion: 0.05
Nodes (49): SystemEngine, d20LegacyCheckPenalty(), dnd35eAbilityIncreases(), dnd35eConcentrationDCDamage(), dnd35eConcentrationDCDefensive(), dnd35eFeatsFromLevel(), dnd35eHpState, dnd35eTriggersMassiveDamage() (+41 more)

### Community 21 - "Dnd35e Saves & Data Model"
Cohesion: 0.08
Nodes (34): Props, D20Save, D20SaveId, Props, SAVE_IDS, createDefaultDnd35eData(), Dnd35eClassLevel, Dnd35eDataModel (+26 more)

### Community 22 - "Daggerheart Data Model"
Cohesion: 0.17
Nodes (23): GetDaggerheartSheetStateProps, UseDaggerheartTemplateHandlersProps, DaggerheartAdversaryRole, DaggerheartAncestry, DaggerheartArmor, DaggerheartClass, DaggerheartCommunity, DaggerheartConsumable (+15 more)

### Community 23 - "System Registry & Renderer"
Cohesion: 0.12
Nodes (21): SheetProps, SystemDefinition, SystemSheetComponent, ValidationContext, ValidationReason, ValidationResult, ValidationSeverity, makeD20LegacySheet() (+13 more)

### Community 24 - "Game Rules & Proficiencies"
Cohesion: 0.08
Nodes (33): ArmorProficiency, ArmorProficiencyType, ArtisanToolProficiency, GamingSetProficiency, isValidArmorProficiency(), isValidSkillProficiency(), isValidToolProficiency(), isValidWeaponProficiency() (+25 more)

### Community 25 - "Campaign Sync Hooks"
Cohesion: 0.11
Nodes (31): appendInventoryFromBackground(), applyDnd5eBackgroundTemplate(), BackgroundChoiceSlot, BackgroundChoiceValue, backgroundDerivedState(), COMMON_LANGUAGE_OPTIONS, Dnd5eBackgroundTemplateSelections, Dnd5eLikeDataModel (+23 more)

### Community 26 - "Daggerheart Inventory"
Cohesion: 0.12
Nodes (27): findDaggerheartInventoryDefinitionByName(), ancestryLookup, armorLookup, buildLookup(), classLookup, communityLookup, DEFAULTS, domainCardByName (+19 more)

### Community 27 - "Pf2e Character Templates"
Cohesion: 0.09
Nodes (46): Pf2eArchetypesTab(), Props, abilityBoostValue(), ancestryFeatures(), applyAbilityAdjustments(), applyPf2eAncestryTemplate(), applyPf2eArchetypeTemplate(), applyPf2eBackgroundTemplate() (+38 more)

### Community 28 - "Roadmap Metrics Generator"
Cohesion: 0.09
Nodes (39): ManifestCategory, applyRepoResidentOverrides(), buildComputeCompletion(), buildContentCompletion(), buildMarkdownReport(), ComputeCompletionRow, computeMetrics(), ContentCompletionRow (+31 more)

### Community 29 - "Dnd5e Feature List Sections"
Cohesion: 0.09
Nodes (44): DiceRollButton(), DiceRollButtonProps, RollResult, ABILITIES, D20AbilitiesTab(), Props, Dnd5eSavesTab(), Props (+36 more)

### Community 30 - "Encounter & Initiative Panels"
Cohesion: 0.13
Nodes (32): getBackgroundFixedToolProficiencies(), getBackgroundLanguageOptions(), getBackgroundToolChoiceSlots(), getDnd5eTemplateChoiceState(), applyDnd5eSpeciesTemplate(), buildAbilityChoiceSlots(), buildSpeciesFeatures(), choiceAbilityBonuses() (+24 more)

### Community 31 - "Class Enhancement & Headers"
Cohesion: 0.08
Nodes (39): availableDnd5eToggles(), Dnd5eEquipmentTab, Dnd5eFeatBrowserTab, Dnd5eFeaturesTab, Dnd5eMonsterBrowserTab, Dnd5eMonsterBrowserTabComponent, MonsterBrowser, MonsterBrowserProps (+31 more)

### Community 32 - "Pf2e Sheet Tabs"
Cohesion: 0.21
Nodes (15): SAVE_ABILITIES, SKILL_ABILITIES, getPf2eSheetChoiceState(), countTrainedPf2eSkills(), longRestPf2eSpellcasting(), nextPf2eTier(), PF2E_TIER_ORDER, Pf2eBulkState (+7 more)

### Community 33 - "AI Encounter Drafting"
Cohesion: 0.10
Nodes (34): draftEncounterWithAi(), fileToAiImageInput(), readAsDataUrl(), isMonsterSystemId(), RFC-006, useSceneEncounter(), EncounterMonsterSelection, summarizeEncounterPlan() (+26 more)

### Community 34 - "Quest & Session Log UI"
Cohesion: 0.10
Nodes (33): Props, QuestList(), STATUS_BADGE, STATUS_OPTIONS, DATE_FORMAT, Props, SessionLog(), BRUTE (+25 more)

### Community 35 - "Currency & Inventory Editors"
Cohesion: 0.10
Nodes (27): D20FeatBrowserTabComponent, FeatBrowser, Props, BrowserFeat, Dnd5eFeatBrowserTabComponent, FeatBrowser, FeatBrowserProps, Props (+19 more)

### Community 36 - "Document Sync Engine"
Cohesion: 0.18
Nodes (11): CampaignManager(), Props, LibraryScenesView(), useToast(), makeScene(), now, pickTextFileMock, exportCampaigns() (+3 more)

### Community 37 - "Sheet Header & Stat Cards"
Cohesion: 0.15
Nodes (18): categoryIcons, GameSystemSelector(), GameSystemSelectorProps, systemAccents, Props, supportBadgeLabels, supportBadgeStyles, buildInitialSummaryStates() (+10 more)

### Community 38 - "Check & Oracle Resolution"
Cohesion: 0.14
Nodes (10): createDefaultDnd5eData(), Dnd5eEngine, makeDnd5eDocument(), makeDnd5eDocument(), makeDoc(), TEST_DATE, makeDoc(), makeDoc() (+2 more)

### Community 39 - "Mam3e Data Model & Engine"
Cohesion: 0.13
Nodes (19): clampTrack(), DeathSaves, DeathSavesTracker(), Props, HitDiceTracker(), Props, Props, SLOT_LEVELS (+11 more)

### Community 40 - "Doc Drift Rules"
Cohesion: 0.06
Nodes (57): DOC_DRIFT_MANIFEST, DocDriftRuleType, DocDriftSurface, DocDriftSurfaceKind, CAPABILITY_PHRASE_RULES, CapabilityPhraseRule, capitalizeSupportLevel(), COMMAND_RUNTIME_RULES (+49 more)

### Community 41 - "NPM Build Scripts"
Cohesion: 0.05
Nodes (43): scripts, bootstrap:node, build, check:bundle-size, check:compute-register, check:compute-register:mutate, check:compute-register:write, check:dead-code (+35 more)

### Community 42 - "Condition Effects by System"
Cohesion: 0.08
Nodes (29): AppContent(), cloneSystemData(), LegalNotices, SceneManager, STORAGE_WARNING_THRESHOLD, CharacterSortOption, NewCharacterDialog(), ServiceWorkerUpdateBanner() (+21 more)

### Community 43 - "Equipped Armor Section"
Cohesion: 0.09
Nodes (28): EquipArmorInput, EquipEntry, EquipShieldInput, Props, D20EquipmentBrowserTab, D20EquipmentBrowserTabComponent, EquipmentBrowser, Props (+20 more)

### Community 44 - "Spell Browser UI"
Cohesion: 0.13
Nodes (24): SpellBrowser(), SpellBrowserProps, SpellBrowserSpell, D20SpellBrowserPanelComponent, SpellBrowser, toSpellBrowserSpell(), Dnd5eSpellsTabComponent, Props (+16 more)

### Community 45 - "Scene Combat Area Effects"
Cohesion: 0.14
Nodes (23): buildDaggerheartCombatant(), BuildDaggerheartCombatantResult, RANGE_CELLS, getDaggerheartEffectiveAttribute(), getDaggerheartPassiveBonuses(), getDaggerheartProficiency(), getDaggerheartTier(), getEquippedDaggerheartArmor() (+15 more)

### Community 46 - "Error Boundary & Auth Context"
Cohesion: 0.13
Nodes (17): AuthContext, AuthContextValue, clearLocalDataForAccountChange(), getLastSyncedUserId(), setLastSyncedUserId(), AuthProvider(), AuthCallback, mockedGetSupabaseClient (+9 more)

### Community 47 - "Encounter Builder Logic"
Cohesion: 0.17
Nodes (15): buildNotice(), FetchTarget, fetchValidated(), HTML_ENTITIES, looksLikeHtml(), main(), normalize(), noticePath (+7 more)

### Community 48 - "Scene Management Hooks"
Cohesion: 0.19
Nodes (22): Props, SceneCreateFormProps, Props, useScenes(), NOW, SceneDocument, clearSceneStorage(), collectValidScenes() (+14 more)

### Community 49 - "Monster Combatant Builder"
Cohesion: 0.11
Nodes (16): CR_XP_TABLE, formatChallengeRating(), MonsterBrowser(), MonsterBrowserProps, monsters, VALID_DAMAGE_TYPES, SpellcastingProgression, AbilityScore (+8 more)

### Community 50 - "D20 Legacy Templates"
Cohesion: 0.21
Nodes (19): availableD20LegacyToggles(), D20LegacyData, D20LegacySpellSlots, getIterativeAttackBonuses(), recoverD20LegacySpellSlot(), resetD20LegacySpellSlots(), setD20LegacyPreparedSpell(), setD20LegacySpellSlotTotal() (+11 more)

### Community 51 - "Campaign Storage & Hooks"
Cohesion: 0.17
Nodes (19): useCampaigns(), DebouncedPersistence, IMPORTANT: a begun generation must end in either `persist` or, useDebouncedPersistence(), hostileStorage, CAMPAIGNS_STORAGE_KEY, clearCampaignStorage(), importCampaigns() (+11 more)

### Community 52 - "Spell Preparation Logic"
Cohesion: 0.09
Nodes (17): createDefaultDnd5e2024Data(), makeDoc(), makeDoc(), makeDoc(), make2024Doc(), boonOfSkill, crafter, fixtureBenefits (+9 more)

### Community 53 - "Dev Dependencies"
Cohesion: 0.05
Nodes (41): autoprefixer, eslint, eslint-config-prettier, eslint-plugin-react-hooks, eslint-plugin-react-refresh, happy-dom, devDependencies, autoprefixer (+33 more)

### Community 54 - "Character Combatant Builder"
Cohesion: 0.20
Nodes (16): mam3eAfflictionDC(), mam3eAttackDC(), mam3eAttackHits(), mam3eCriticalDC(), mam3eDamageResistanceDC(), mam3eDegreesOfFailure(), mam3eDegreesOfSuccess(), mam3eEquipmentPoints() (+8 more)

### Community 55 - "D20 Class Spellcasting"
Cohesion: 0.09
Nodes (28): IllustrateSceneResult, CombatPanelProps, EncounterPanel(), EncounterPanelProps, formatAverageLevel(), ILLUSTRATION_STYLES, IllustrationPanel(), IllustrationPanelProps (+20 more)

### Community 56 - "SRD Manifest Generator"
Cohesion: 0.23
Nodes (8): GAME_RULES, sanitizeInput(), validateAttributeScore(), validateCharacter(), validateCharacterName(), validateHitPoints(), validateLevel(), ValidationError

### Community 57 - "Daggerheart Combatant Builders"
Cohesion: 0.05
Nodes (51): AppHeaderProps, CharacterCardProps, CharacterListView(), CharacterListViewProps, TokenPanelProps, UseSceneEncounterParams, Props, SystemSheetRenderer() (+43 more)

### Community 58 - "AI Gateway Adapters"
Cohesion: 0.12
Nodes (20): createGeminiAdapter(), IMAGE_TASKS, TASK_SCHEMAS, AI_GATEWAY_SCHEMA_VERSION, aiFailure, AiResponse, AiTask, AiProviderAdapter (+12 more)

### Community 59 - "AI Gateway Contracts"
Cohesion: 0.14
Nodes (26): AI_GATEWAY_TASKS, AiFailureCode, AiParse, AiSuccess, AiUsage, EncounterDraftRequest, IdentifyCreatureRequest, IllustrateSceneRequest (+18 more)

### Community 60 - "System Definitions & Types"
Cohesion: 0.14
Nodes (13): CurrencyEditor, CurrencyEditorProps, Dnd5eEquipmentTabComponent, EquipmentBrowser, EquipmentBrowserItem, EquipmentBrowserProps, EquippedItemsSection, EquippedItemsSectionProps (+5 more)

### Community 61 - "D20 Legacy Spell Slots"
Cohesion: 0.12
Nodes (25): buildEncounterSceneEvents(), buildInitiativeEntries(), buildOccupiedCells(), clampInteger(), compareTokenIds(), EncounterBuilderIssue, EncounterPartyMember, EncounterPlanEntry (+17 more)

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
Cohesion: 0.18
Nodes (12): BrowserCapabilities, checkBrowserCapabilities(), initBrowserCompat(), isBrowserSupported(), showCompatibilityWarning(), ErrorCategory, ErrorLog, ErrorLogger (+4 more)

### Community 66 - "AI Gateway Client"
Cohesion: 0.14
Nodes (15): createDaggerheartInventoryEntry(), DAGGERHEART_CURRENCY_FIELDS, DOMAIN_CARD_TYPE_LABELS, EMPTY_WEAPON_LOADOUT, DaggerheartDataModel, DaggerheartSheet(), DomainCardEntry, useDaggerheartMutationHandlers() (+7 more)

### Community 67 - "2024 Monster Data Encoder"
Cohesion: 0.16
Nodes (23): ABILITIES, ALIGNMENTS, bucketFor(), classifyImmunityList(), cleanProse(), CR_FRACTIONS, CREATURE_TYPES, DAMAGE_TYPES (+15 more)

### Community 68 - "Character Effects Compilation"
Cohesion: 0.15
Nodes (10): AttackEconomy, bestAttackAbility(), D20_PROFILES, D20SystemProfile, dnd5eProfile, extraAttackCount(), featureAttackEconomy(), legacyD20Profile() (+2 more)

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
Cohesion: 0.05
Nodes (112): critModelForScene(), degreeModelForScene(), resolveSceneAreaEffect(), resolveSceneAttack(), SceneAreaEffectOutcome, SceneAttackOutcome, SceneRoundOutcome, RFC-003 (+104 more)

### Community 73 - "System Validation Logic"
Cohesion: 0.21
Nodes (23): ABILITY_SCORE_IDS, addIssue(), createDnd5eValidator(), Dnd5eValidationData, Dnd5eValidationDataModel, featureOptionKey(), isIntegerInRange(), loadValidationData() (+15 more)

### Community 74 - "Spell Catalog Consistency Tests"
Cohesion: 0.15
Nodes (15): e(), ExpectedSpellIdentity, iconicSpellExpectations, SystemKey, systems, dedupeById(), Identified, indexById() (+7 more)

### Community 75 - "Dnd5e Resource Loading Hooks"
Cohesion: 0.35
Nodes (10): getDaggerheartAncestryAdjustments(), applyDaggerheartAncestryTemplate(), applyDaggerheartClassTemplate(), applyDaggerheartCommunityTemplate(), classTemplateItems(), communityTemplateItems(), DaggerheartInventoryEntry, DEFAULTS (+2 more)

### Community 76 - "Mam Powers & Cost Ledger"
Cohesion: 0.18
Nodes (14): MamArchetypeBrowser(), MamArchetypeBrowserProps, applyMam3eToughnessFailure(), getMam3eSheetState(), GetMam3eSheetStateProps, uniqueNonEmptyStrings(), createEmptyMam3eConditionTrack(), createEmptyMam3ePower() (+6 more)

### Community 77 - "Sync Engine Tests"
Cohesion: 0.31
Nodes (11): NOW, getSyncTombstonedIds(), getSyncTombstones(), pruneExpired(), readStored(), recordSyncTombstones(), removeSyncTombstones(), STORAGE_KEYS (+3 more)

### Community 78 - "Dnd5e Feature Options"
Cohesion: 0.13
Nodes (24): appendBulletList(), applyDnd5eFeatureOptionSelection(), ClassLevelLike, DND5E_FEATURE_OPTION_GROUP_LABELS, DND5E_FEATURE_OPTION_SOURCE_LABELS, DOMAIN_SUBCLASS_IDS, featureIdForOption(), FeatureOptionState (+16 more)

### Community 79 - "Document Migrations & Storage"
Cohesion: 0.06
Nodes (53): ToastContext, ToastContextValue, ToastItem, ToastProvider(), VARIANT_ICONS, VARIANT_STYLES, cloneDocumentsSnapshot(), documentsChanged() (+45 more)

### Community 80 - "App Header & Auth UI"
Cohesion: 0.18
Nodes (15): AppHeader(), assertNever(), INITIAL_NAV_STATE, LIBRARY_SEGMENTS, librarySegmentLabel(), NavAction, navReducer(), Overlay (+7 more)

### Community 81 - "Combat Toggles & Conditions"
Cohesion: 0.08
Nodes (30): Doc, useSync(), UseSyncOptions, baseAuthValue, mockedClearQueuedDeletedDocumentIds, mockedClearQueuedSyncSnapshot, mockedDeleteRemoteDocument, mockedFetchRemoteDocuments (+22 more)

### Community 82 - "HP & Spell Slot Trackers"
Cohesion: 0.21
Nodes (8): EncounterDraftData, EncounterDraftSelection, DraftEncounterParams, DraftEncounterResult, GatewayCall, SelectionValidator, RFC-002, params

### Community 83 - "Scene Grid View"
Cohesion: 0.18
Nodes (14): daggerheartManifest, dnd35eManifest, dnd5e2014Manifest, dnd5e2024Manifest, manifestForSystem(), SRD_MANIFESTS, mam3eManifest, pf1eManifest (+6 more)

### Community 84 - "Boundary Validation Tests"
Cohesion: 0.34
Nodes (15): ValidationIssue, coerceDate(), coerceObjectives(), coerceQuests(), coerceSessionLog(), coerceStringArray(), isNonEmptyString(), isRecord() (+7 more)

### Community 85 - "capabilityScenarios.test.tsx"
Cohesion: 0.24
Nodes (6): D20Roll, DualityRoll, rollD20(), rollDuality(), createLiveRng(), Rng

### Community 86 - "Equipment & Feature Browsers"
Cohesion: 0.13
Nodes (20): getDaggerheartDerivedStats(), getSelectedDaggerheartAncestry(), getSelectedDaggerheartClass(), clampDaggerheartInventoryQuantity(), daggerheartInventoryDefinitions, inventoryDefinitionById, inventoryDefinitionByName, isDaggerheartConsumableDefinition() (+12 more)

### Community 87 - "Pf2e Engine & Constants"
Cohesion: 0.09
Nodes (20): GapLedgerItem, LedgerPhase, LedgerStatus, LedgerTag, LedgerTrack, MASTER_GAP_LEDGER, RFC-003, byPhase (+12 more)

### Community 88 - "Documents Hook & Persistence"
Cohesion: 0.07
Nodes (41): illustrateSceneWithAi(), InitiativeTracker(), InitiativeTrackerProps, MarkerEffectOption, MarkerEffectPreset, terrainEffectsForPreset(), TokenPanel(), ALLEGIANCE_LABEL (+33 more)

### Community 89 - "Daggerheart Contribution Ledger"
Cohesion: 0.11
Nodes (27): ANCESTRY_ADJUSTMENTS_BY_ID, ancestryByName, classByName, DAGGERHEART_TRAITS, DaggerheartAncestryAdjustments, DaggerheartRange, DEFAULT_DAGGERHEART_ANCESTRY_ADJUSTMENTS, doesDaggerheartPassiveConditionApply() (+19 more)

### Community 90 - "Dnd35e/Pf1e Derived Math"
Cohesion: 0.36
Nodes (7): ThemeToggle(), applyTheme(), getSystemTheme(), isTheme(), Theme, useTheme(), VALID_THEMES

### Community 91 - "Mam Browser Tabs"
Cohesion: 0.12
Nodes (19): Props, Props, focusPulseSpell, PF2E_DERIVED_TRAITS, PF2E_SCHOOL_TRAITS, PF2E_TRADITIONS, AbilityScores, AreaOfEffect (+11 more)

### Community 92 - "Pf2e Derived Math"
Cohesion: 0.08
Nodes (33): createDefaultPf2eData(), profTotal(), tierBonus(), CREATURE_XP_BY_LEVEL_DIFF, pf2eAttackModifier(), pf2eCreatureXP(), Pf2eDegree, pf2eDyingAfterRecovery() (+25 more)

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
Nodes (35): DicePanel(), DicePanelProps, formatBreakdown(), QUICK_ROLLS, DISPOSITION_BADGE, DISPOSITION_LABEL, ReactionHistoryEntry, ReactionPanel() (+27 more)

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
Cohesion: 0.25
Nodes (6): TEST_DATE, ActionType, Power, PowerDuration, PowerRange, PowerType

### Community 101 - "Document Storage (IndexedDB)"
Cohesion: 0.15
Nodes (13): CurrencyEditor(), CurrencyEntry, DND_CURRENCIES, Props, D20CombatSection(), DaggerheartCharacterBasicsSection(), Props, useStableListKeys() (+5 more)

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
Nodes (30): useCampaignSync(), UseCampaignSyncOptions, useEntitySync(), baseAuthValue, mockedClearQueuedCampaignsSnapshot, mockedClearQueuedDeletedCampaignIds, mockedDeleteRemoteCampaign, mockedFetchRemoteCampaigns (+22 more)

### Community 106 - "Character Card Presenter"
Cohesion: 0.10
Nodes (23): AbilityScoreGrid(), buildPointBuyDraft(), buildStandardArrayDraft(), clampPointBuyScore(), emptyPointBuyDraft(), emptyStandardArrayDraft(), isStandardArrayComplete(), isValidPointBuyDraft() (+15 more)

### Community 107 - "Oracle Panel & Logic"
Cohesion: 0.05
Nodes (47): NarrateSceneResult, CheckPanel(), CheckPanelProps, OUTCOME_BADGE, OUTCOME_LABEL, SKILL_SUGGESTIONS, CombatPanel(), MarkerPanelProps (+39 more)

### Community 108 - "5e Equipment Tab"
Cohesion: 0.52
Nodes (6): buildChoiceSlots(), formatDnd5eClassToolChoiceLabel(), getDnd5eClassSkillChoiceSlots(), getDnd5eClassToolChoiceSlots(), canSelectSubclass(), Dnd5eClassesSection()

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
Cohesion: 0.06
Nodes (37): CombatTogglesSection(), Props, Condition, ConditionPicker(), Props, FeaturesSection(), Props, ProficiencyListSection() (+29 more)

### Community 115 - "Project Dependencies"
Cohesion: 0.09
Nodes (23): ai, @ai-sdk/google, class-variance-authority, clsx, lucide-react, dependencies, ai, @ai-sdk/google (+15 more)

### Community 116 - "3.5e Spell Encoder"
Cohesion: 0.29
Nodes (6): getSystemAssetPrefetchStateForTests(), prefetchedSystemAssets, prefetchedSystemRuntimeData, prefetchedSystemSheets, resetSystemAssetPrefetchStateForTests(), systemAssetPrefetchers

### Community 117 - "AI Encounter Draft Flow"
Cohesion: 0.23
Nodes (9): AiImageInput, EncounterDraftCandidate, IdentifyCreatureData, IdentifyCreatureParams, IdentifyCreatureResult, identifyCreatureWithAi(), IdentifyGatewayCall, RFC-002 (+1 more)

### Community 118 - "Campaign File Transfer"
Cohesion: 0.11
Nodes (32): D20SkillsTab(), Props, Dnd5eTemplateState, AddEntryInput, buildAlwaysPreparedSpellEntries(), buildArmorClassEntries(), buildDnd5eContributionLedger(), buildFeatAutomationEntries() (+24 more)

### Community 119 - "MAM Archetype Browser"
Cohesion: 0.27
Nodes (11): CLASS_TOKENS, d20srdUrl(), FILES, main(), mapCastingTime(), mapDuration(), mapRange(), normalizeName() (+3 more)

### Community 120 - "PF1e Spell Encoder"
Cohesion: 0.27
Nodes (11): CLASS_COLUMNS, main(), mapCastingTime(), mapDuration(), mapRange(), RFC-4180, normalizeName(), parseCsv() (+3 more)

### Community 122 - "PF2e Archetypes Tab"
Cohesion: 0.05
Nodes (68): compileModifierSource(), formatSigned(), isNamedBonusType(), modifierStackPolicy(), targetForModifierType(), TargetMapping, collectD20LegacyConditionEffects(), D20_LEGACY_CONDITION_EFFECTS (+60 more)

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
Cohesion: 0.14
Nodes (16): ABILITIES, DEFENSES, MamAbilitiesTab(), Props, MamComplicationBrowser, MamComplicationsTabComponent, Props, MamHeader() (+8 more)

### Community 130 - "d20LegacySpellcasting.ts"
Cohesion: 0.14
Nodes (21): D20ClassesSection(), D20LegacyClassLevel, Props, renderClassOptions(), d20BonusSpells(), buildD20LegacySpellSlotTotals(), countAdvancementLevels(), D20_DOMAIN_CLASS_IDS (+13 more)

### Community 131 - "Retry With Backoff"
Cohesion: 0.16
Nodes (26): computeBackoffMs(), isRetryableError(), NON_RETRYABLE_FRAGMENTS, PROD_DEFAULTS, RetryOptions, retryWithBackoff(), sleep(), TEST_DEFAULTS (+18 more)

### Community 132 - "2024 Spell Encoder"
Cohesion: 0.39
Nodes (8): main(), mapCastingTime(), mapDuration(), mapRange(), normalizeName(), SCHOOLS, slug(), ts()

### Community 133 - "MAM Power Browser"
Cohesion: 0.23
Nodes (10): availablePf2eToggles(), collectPf2eRiderEffects(), PF2E_TOGGLE_IDS, PF2E_TOGGLE_LABELS, Pf2eRiderInputs, pf2eSneakAttackDice(), PF2E_CONDITIONS, PF2E_VALUED_CONDITIONS (+2 more)

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
Cohesion: 0.40
Nodes (4): Equipment, EquipmentBrowser(), EquipmentBrowserProps, equipment

### Community 153 - "Feat Browser Component"
Cohesion: 0.40
Nodes (4): Feat, FeatBrowser(), FeatBrowserProps, feats

### Community 154 - "resourcePool.ts"
Cohesion: 0.40
Nodes (4): Props, Advantage, AdvantagePrerequisite, AdvantageType

### Community 155 - "5e Movement Rules"
Cohesion: 0.60
Nodes (4): dnd5eCarryingCapacity(), dnd5eHighJump(), dnd5eLongJump(), dnd5ePushDragLift()

### Community 156 - "contributionLedger.ts"
Cohesion: 0.50
Nodes (4): MamConditionsTab(), Props, Mam3eConditionTrack, UseMam3eMutationHandlersProps

### Community 157 - "MAM Power Modifier Browser"
Cohesion: 0.10
Nodes (17): react, DamageHealControl(), DamageHealControlProps, clampExhaustion(), Props, RestControls(), MamAdvantageBrowserTab(), MamComplicationBrowser() (+9 more)

### Community 160 - "capabilityScenarios.test.tsx"
Cohesion: 0.14
Nodes (21): useLazyResource(), useSystemOptions(), useD20LegacySheetResources(), UseD20LegacySheetResourcesProps, Pf2eEquipmentBrowserTab, Pf2eFeatBrowserTab, Pf2eSpellsTab, usePf2eSheetResources() (+13 more)

### Community 161 - "PF2e Backgrounds Data"
Cohesion: 0.50
Nodes (3): Pf2eBackgroundChoice, Pf2eBackgroundDefinition, Pf2eBackgroundFeatGrant

### Community 177 - "sceneTerrain.ts"
Cohesion: 0.50
Nodes (3): NOW, parseImg(), validDocInput()

### Community 180 - "MamPowerBrowserTab.tsx"
Cohesion: 0.15
Nodes (13): EquipmentBrowser, MamEquipmentBrowserTabComponent, Props, formatMamPowerAction(), formatMamPowerDuration(), formatMamPowerRange(), humanizeMamToken(), MamPowerBrowserTabComponent (+5 more)

### Community 182 - "gatewayClient.ts"
Cohesion: 0.39
Nodes (5): AI_GATEWAY_ENDPOINT, AiRequest, callAiGateway(), isAiEnabled(), payload

### Community 183 - "loadEquipmentForSystem"
Cohesion: 0.50
Nodes (3): Answer, Outcome, Q: where are pending debounced document saves flushed to localStorage on page hide or unload (persistence flush)

## Knowledge Gaps
- **1124 isolated node(s):** `browser`, `es2021`, `node`, `eslint:recommended`, `plugin:@typescript-eslint/recommended` (+1119 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **19 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `MAM Power Modifier Browser` to `Toast Notifications`, `Sheet Resource Loading Hooks`, `Dnd5e Equipment & Features UI`, `d20LegacySpellcasting.ts`, `Dnd5e Background Templates`, `Daggerheart Engine`, `MAM Power Browser`, `Tabs UI Component`, `Scene Combat Resolution`, `Dnd5e Class Templates`, `Scene Check Panel`, `pf2eConditions.ts`, `Monster & NPC Generator`, `Dnd5e Feat Templates`, `App Shell & Layout`, `Combat & Recap Panels`, `Dnd35e Saves & Data Model`, `Daggerheart Data Model`, `System Registry & Renderer`, `Equipment Browser Component`, `Feat Browser Component`, `Pf2e Character Templates`, `contributionLedger.ts`, `Dnd5e Feature List Sections`, `Class Enhancement & Headers`, `capabilityScenarios.test.tsx`, `AI Encounter Drafting`, `Quest & Session Log UI`, `Currency & Inventory Editors`, `Document Sync Engine`, `Sheet Header & Stat Cards`, `Pf2e Sheet Tabs`, `Mam3e Data Model & Engine`, `Doc Drift Rules`, `Condition Effects by System`, `Equipped Armor Section`, `Spell Browser UI`, `Error Boundary & Auth Context`, `Scene Management Hooks`, `Monster Combatant Builder`, `D20 Legacy Templates`, `Campaign Storage & Hooks`, `MamPowerBrowserTab.tsx`, `D20 Class Spellcasting`, `Daggerheart Combatant Builders`, `System Definitions & Types`, `ESLint Config`, `Spells Tab Components`, `AI Gateway Client`, `Dnd5e Resource Loading Hooks`, `Mam Powers & Cost Ledger`, `Document Migrations & Storage`, `App Header & Auth UI`, `Combat Toggles & Conditions`, `Documents Hook & Persistence`, `Dnd35e/Pf1e Derived Math`, `Skills Tab & Combat Math`, `Mam3e Derived Math`, `Document Storage (IndexedDB)`, `AI Creature Identification`, `Character Card Presenter`, `Oracle Panel & Logic`, `5e Feat Browser`, `Campaign File Transfer`?**
  _High betweenness centrality (0.136) - this node is a cross-community bridge._
- **Why does `CharacterDocument` connect `Daggerheart Combatant Builders` to `Toast Notifications`, `Daggerheart Sheet Automation`, `Dnd5e Equipment & Features UI`, `Dnd5e Background Templates`, `Dnd5e2024 Engine & Hit Dice`, `Daggerheart Engine`, `MAM Power Browser`, `Tabs UI Component`, `Retry With Backoff`, `Scene Combat Resolution`, `Dnd5e Class Templates`, `Dnd5e Activity Definitions`, `Monster & NPC Generator`, `Dnd5e Feat Templates`, `Combat & Recap Panels`, `D20 Legacy System Engines`, `Dnd35e Saves & Data Model`, `Daggerheart Data Model`, `System Registry & Renderer`, `Campaign Sync Hooks`, `Daggerheart Inventory`, `Pf2e Character Templates`, `contributionLedger.ts`, `MAM Power Modifier Browser`, `Encounter & Initiative Panels`, `Class Enhancement & Headers`, `Dnd5e Feature List Sections`, `AI Encounter Drafting`, `Pf2e Sheet Tabs`, `Quest & Session Log UI`, `Document Sync Engine`, `Check & Oracle Resolution`, `Condition Effects by System`, `Scene Combat Area Effects`, `Scene Management Hooks`, `sceneTerrain.ts`, `D20 Legacy Templates`, `Spell Preparation Logic`, `Character Combatant Builder`, `D20 Class Spellcasting`, `D20 Legacy Spell Slots`, `AI Gateway Client`, `Dice Panel & Mam3e Resolution`, `System Validation Logic`, `Dnd5e Resource Loading Hooks`, `Mam Powers & Cost Ledger`, `Dnd5e Feature Options`, `Document Migrations & Storage`, `Combat Toggles & Conditions`, `Boundary Validation Tests`, `capabilityScenarios.test.tsx`, `Equipment & Feature Browsers`, `Documents Hook & Persistence`, `Daggerheart Contribution Ledger`, `Pf2e Derived Math`, `Mam3e Derived Math`, `Pf2e Spell Types & Traits`, `Document Signature Hashing`, `Campaign File Transfer`, `PF2e Archetypes Tab`?**
  _High betweenness centrality (0.109) - this node is a cross-community bridge._
- **Why does `GameSystemId` connect `Sheet Header & Stat Cards` to `Sheet Resource Loading Hooks`, `d20LegacySpellcasting.ts`, `Dnd5e Equipment & Features UI`, `Dnd5e2024 Engine & Hit Dice`, `Scene Combat Resolution`, `Dnd5e Class Templates`, `Dnd5e Feat Templates`, `Game System Selector`, `D20 Legacy System Engines`, `Daggerheart Data Model`, `Roadmap Metrics Generator`, `Class Enhancement & Headers`, `capabilityScenarios.test.tsx`, `AI Encounter Drafting`, `Pf2e Sheet Tabs`, `Currency & Inventory Editors`, `Quest & Session Log UI`, `Doc Drift Rules`, `Condition Effects by System`, `D20 Legacy Templates`, `Daggerheart Combatant Builders`, `SRD Coverage Script`, `AI Gateway Client`, `Character Effects Compilation`, `Dice Panel & Mam3e Resolution`, `Mam Powers & Cost Ledger`, `3.5e Spell Encoder`, `PF2e Archetypes Tab`?**
  _High betweenness centrality (0.054) - this node is a cross-community bridge._
- **What connects `browser`, `es2021`, `node` to the rest of the system?**
  _1124 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Sheet Resource Loading Hooks` be split into smaller, more focused modules?**
  _Cohesion score 0.057738572574178026 - nodes in this community are weakly interconnected._
- **Should `Dnd5e Sheets & E2E Tests` be split into smaller, more focused modules?**
  _Cohesion score 0.09951690821256039 - nodes in this community are weakly interconnected._
- **Should `Dnd5e Equipment & Features UI` be split into smaller, more focused modules?**
  _Cohesion score 0.13737373737373737 - nodes in this community are weakly interconnected._