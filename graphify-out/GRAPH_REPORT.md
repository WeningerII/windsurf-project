# Graph Report - windsurf-project  (2026-07-28)

## Corpus Check
- 922 files · ~754,192 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 5930 nodes · 17121 edges · 198 communities (178 shown, 20 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 169 edges (avg confidence: 0.72)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f5613c86`
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
- MAM Archetype Browser
- PF1e Spell Encoder
- validation.ts
- PF2e Archetypes Tab
- 3.5e Gear & Weapons
- 5e Equipment Encoder
- 5e Spell Encoder
- Daggerheart Adversary Encoder
- Toast Notifications
- Daggerheart Sheet Automation
- Retry With Backoff
- 2024 Spell Encoder
- MAM Power Browser
- Spell Validation Checks
- TS Node Config
- TS Test Config
- Prettier Config
- pf2eConditions.ts
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
- ServiceWorkerUpdateBanner.tsx
- Dnd5eEquipmentTab.tsx
- 5e Movement Rules
- CharacterListView.tsx
- MAM Complication Browser
- PF2e Backgrounds Data
- Host Size Budget Test
- Vitest Type Defs
- MAM Complications Data
- MAM Power Modifiers Data
- Vitest Coverage Config
- characterDraftFlow.test.ts
- useSceneEncounter.ts
- daggerheart/validation.ts
- useEntitySync.ts
- syncTombstones.ts
- loadEquipmentForSystem
- MamArchetypesTab.tsx
- eslint-plugin-react
- fake-indexeddb
- dnd35e/validation.ts
- MamComplicationBrowser.tsx
- index.ts
- retryWithBackoff
- @types/react-dom
- @vitest/coverage-v8
- @playwright/test
- @testing-library/user-event
- @typescript-eslint/parser
- phase3-workflows.spec.ts
- shared/legalActions.ts
- sceneTerrain.ts
- gateBudget.test.tsx
- aiSdkAdapter.test.mts
- spikeViewport.ts

## God Nodes (most connected - your core abstractions)
1. `CharacterDocument` - 308 edges
2. `SystemDataModel` - 166 edges
3. `GameSystemId` - 105 edges
4. `SystemRegistry` - 79 edges
5. `EffectInstance` - 72 edges
6. `makeEffectId()` - 63 edges
7. `abilityMod()` - 63 edges
8. `Pf2eDataModel` - 57 edges
9. `scripts` - 55 edges
10. `Dnd5eDataModel` - 55 edges

## Surprising Connections (you probably didn't know these)
- `useTabs()` --references--> `react`  [EXTRACTED]
  src/components/ui/Tabs.tsx → package.json
- `flattenEntries()` --indirect_call--> `entry()`  [INFERRED]
  scripts/check-compute-register.mjs → src/__tests__/components/ContributionBreakdown.test.tsx
- `loadProductEntries()` --indirect_call--> `entry()`  [INFERRED]
  scripts/check-srd-fidelity.mjs → src/__tests__/components/ContributionBreakdown.test.tsx
- `D20AbilitiesTab()` --indirect_call--> `mod()`  [INFERRED]
  src/systems/d20-legacy/components/D20AbilitiesTab.tsx → scripts/encode-35e-monsters.mjs
- `Pf2eAbilitiesTab()` --indirect_call--> `mod()`  [INFERRED]
  src/systems/pf2e/components/Pf2eAbilitiesTab.tsx → scripts/encode-35e-monsters.mjs

## Import Cycles
- None detected.

## Communities (198 total, 20 thin omitted)

### Community 0 - "Sheet Resource Loading Hooks"
Cohesion: 0.06
Nodes (85): ancestryPool(), backgroundPool(), classPool(), loadCharacterDraftPools(), NamedEntity, toCandidates(), RFC-002, useLazyResource() (+77 more)

### Community 1 - "Dnd5e Sheets & E2E Tests"
Cohesion: 0.11
Nodes (28): categoryIcons, GameSystemSelector(), GameSystemSelectorProps, systemAccents, supportBadgeLabels, supportBadgeStyles, buildInitialSummaryStates(), categoryDisplay (+20 more)

### Community 2 - "Dnd5e Equipment & Features UI"
Cohesion: 0.15
Nodes (33): Doc, useSync(), UseSyncOptions, mockedGetSupabaseClient, retryWithBackoff(), getSupabaseClient(), clearQueuedSyncSnapshot(), deleteRemoteDocument() (+25 more)

### Community 3 - "Dnd5e Background Templates"
Cohesion: 0.04
Nodes (84): ProficiencyListSection(), Props, D20FeatBrowserTabComponent, FeatBrowser, Props, BrowserFeat, Dnd5eFeatBrowserTabComponent, FeatBrowser (+76 more)

### Community 4 - "Dnd5e2024 Engine & Hit Dice"
Cohesion: 0.08
Nodes (27): HIT_DICE, hitDieSize(), hitDieString(), DND5E_CONDITION_NAMES, hasDnd5eCondition(), normalizeConditionId(), normalizeDnd5eConditions(), getDnd5eDefenseStyleArmorClassBonus() (+19 more)

### Community 5 - "Daggerheart Engine"
Cohesion: 0.08
Nodes (50): applyDnd5eClassTemplate(), applyDnd5eSubclassTemplate(), assertMulticlassRequirements(), ATTRIBUTE_NAME_TO_ID, buildChoiceSlots(), buildDerivedProficiencies(), buildSpellcastingState(), canSelectSubclass() (+42 more)

### Community 6 - "3.5e Monster Data Encoder"
Cohesion: 0.06
Nodes (56): ALIGNMENTS, DICE_PROGRESSIONS, main(), mapAlignment(), MONSTER_SIZE, normalizeName(), OLIMOT_FILES, resolveSizeRoll() (+48 more)

### Community 7 - "Tabs UI Component"
Cohesion: 0.05
Nodes (60): Badge(), BadgeProps, badgeVariants, TABLIST_NAV_KEYS, Tabs, TabsContent, TabsContentProps, TabsContext (+52 more)

### Community 8 - "Node Runtime Bootstrap"
Cohesion: 0.09
Nodes (48): main(), runBootstrapNodeInstall(), getPinnedCommandArgs(), main(), runPinnedNpmCommand(), formatRuntimeDoctorReport(), main(), readWorkflowPinSource() (+40 more)

### Community 9 - "Scene Combat Resolution"
Cohesion: 0.05
Nodes (57): buildScene(), ResolveCombatStats, appendSceneEvent(), compareSceneEvents(), createdAtOrZero(), createSceneDocument(), eventIdOrEmpty(), foldSceneEvents() (+49 more)

### Community 10 - "Dnd5e Class Templates"
Cohesion: 0.21
Nodes (20): makeAsset(), makeSceneWithMap(), clearMapAssetStorage(), createMapAsset(), CreateMapAssetResult, deleteMapAsset(), isMapAssetShape(), isRecord() (+12 more)

### Community 11 - "System Compute Registers"
Cohesion: 0.18
Nodes (17): DockPanel(), systemLabel(), D20SpellBrowserPanelComponent, Props, SpellBrowser, toSpellBrowserSpell(), Pf2eSpellBrowserPanel, Pf2eSpellBrowserPanelComponent (+9 more)

### Community 12 - "Scene Check Panel"
Cohesion: 0.18
Nodes (12): BrowserCapabilities, checkBrowserCapabilities(), initBrowserCompat(), isBrowserSupported(), showCompatibilityWarning(), ErrorCategory, ErrorLog, ErrorLogger (+4 more)

### Community 13 - "Dnd5e Activity Definitions"
Cohesion: 0.07
Nodes (34): Props, SLOT_LEVELS, SlotKey, SpellSlotTracker(), buildDefenseStyleActivity(), buildDivineSmiteActivities(), buildDivineSmiteActivity(), buildDnd5eActivityDefinitions() (+26 more)

### Community 14 - "Monster & NPC Generator"
Cohesion: 0.06
Nodes (46): DragProvider, DragRoot(), isSceneDragEnabled(), FEATURE_FLAGS, FeatureFlag, FeatureFlagDefinition, isFeatureEnabled(), RingBuffer (+38 more)

### Community 15 - "Dnd5e Feat Templates"
Cohesion: 0.15
Nodes (21): ArmorClassItem, computeDnd5eBaseArmorClass(), Dnd5eUnarmoredDefense, resolveDnd5eArmorClass(), compute5eAC(), d20LegacyCheckPenalty(), D20SkillsTab(), d20SkillCheckPenalty() (+13 more)

### Community 16 - "App Shell & Layout"
Cohesion: 0.16
Nodes (14): ExpectedSpellIdentity, iconicSpellExpectations, SystemKey, systems, dedupeById(), Identified, indexById(), warnDuplicateId() (+6 more)

### Community 17 - "D20 Combat Controls"
Cohesion: 0.09
Nodes (35): dnd5eArmorDexContribution(), Dnd5eTemplateState, AddEffectInput, AddEntryInput, buildAlwaysPreparedSpellParts(), buildArmorClassParts(), buildDnd5eContributionLedger(), buildFeatAutomationParts() (+27 more)

### Community 18 - "Game System Selector"
Cohesion: 0.04
Nodes (76): EquippedItemsSection(), Props, SLOT_LABELS, SLOT_ORDER, FeaturesSection(), Props, HitDiceTracker(), Props (+68 more)

### Community 19 - "Combat & Recap Panels"
Cohesion: 0.17
Nodes (13): DEFAULT_LABELS, SpellBrowser(), SpellBrowserLabels, SpellBrowserProps, SpellBrowserSpell, Dnd5eSpellsTabComponent, Props, SpellBrowser (+5 more)

### Community 20 - "D20 Legacy System Engines"
Cohesion: 0.24
Nodes (11): clampDaggerheartInventoryQuantity(), daggerheartInventoryDefinitions, findDaggerheartInventoryDefinitionByName(), getDaggerheartInventoryDefinition(), inventoryDefinitionById, inventoryDefinitionByName, isDaggerheartConsumableDefinition(), normalizeDaggerheartCurrency() (+3 more)

### Community 21 - "Dnd35e Saves & Data Model"
Cohesion: 0.04
Nodes (70): Props, Props, createDefaultDnd35eData(), Dnd35eClassLevel, Dnd35eDataModel, Dnd35eManualSpellcastingExtras, Dnd35eSaves, RFC-003 (+62 more)

### Community 22 - "Daggerheart Data Model"
Cohesion: 0.08
Nodes (32): CurrencyEditor(), CurrencyEntry, DND_CURRENCIES, Props, InventoryItem, InventoryManager(), InventoryManagerProps, availablePf2eToggles() (+24 more)

### Community 23 - "System Registry & Renderer"
Cohesion: 0.04
Nodes (67): react, react, CharacterDraftProposal, MakeGameCharacter, AppHeaderProps, Props, CharacterCardProps, CharacterListViewProps (+59 more)

### Community 24 - "Game Rules & Proficiencies"
Cohesion: 0.07
Nodes (34): GAME_RULES, ArmorProficiency, ArmorProficiencyType, ArtisanToolProficiency, GamingSetProficiency, isValidArmorProficiency(), isValidSkillProficiency(), isValidToolProficiency() (+26 more)

### Community 25 - "Campaign Sync Hooks"
Cohesion: 0.12
Nodes (36): resolveCheck(), footprintWithinGrid(), isOracleAnswer(), isOracleOdds(), resolveOracle(), applyHitPointDelta(), applySceneEvent(), assertNever() (+28 more)

### Community 26 - "Daggerheart Inventory"
Cohesion: 0.10
Nodes (34): getDaggerheartAncestryAdjustments(), ancestryLookup, armorLookup, buildLookup(), classLookup, communityLookup, DEFAULTS, domainCardByName (+26 more)

### Community 27 - "Pf2e Character Templates"
Cohesion: 0.08
Nodes (50): Props, createPf2eCreationPlan(), PF2E_ARCHETYPE_DEDICATION_GRANTS, Pf2eDedicationProficiencyGrant, Pf2eFeat, GetPf2eSheetChoiceStateProps, abilityBoostValue(), ancestryFeatures() (+42 more)

### Community 28 - "Roadmap Metrics Generator"
Cohesion: 0.05
Nodes (56): byId, byName, failures, manifest, manifestByName, originalSources, root, seenSrdNames (+48 more)

### Community 29 - "Dnd5e Feature List Sections"
Cohesion: 0.08
Nodes (39): DiceRollButton(), DiceRollButtonProps, RollResult, ABILITIES, D20AbilitiesTab(), Props, D20CombatSection(), D20Save (+31 more)

### Community 30 - "Encounter & Initiative Panels"
Cohesion: 0.06
Nodes (63): appendInventoryFromBackground(), applyDnd5eBackgroundTemplate(), BackgroundChoiceSlot, BackgroundChoiceValue, backgroundDerivedState(), COMMON_LANGUAGE_OPTIONS, Dnd5eBackgroundTemplateSelections, Dnd5eLikeDataModel (+55 more)

### Community 31 - "Class Enhancement & Headers"
Cohesion: 0.08
Nodes (32): LibraryBestiaryView(), LoadState, MonsterBrowser, MonsterBrowserProps, systemLabel(), RFC-004, feat, item (+24 more)

### Community 32 - "Pf2e Sheet Tabs"
Cohesion: 0.05
Nodes (60): buildCharacterCombatant(), BuildCharacterCombatantResult, normalizeSheet(), readArmorClass(), toMagicBonusItems(), toModifierSources(), AttackEconomy, bestAttackAbility() (+52 more)

### Community 33 - "AI Encounter Drafting"
Cohesion: 0.07
Nodes (41): DEFAULT_QUICK_ROLLS, DicePanel(), DicePanelProps, formatBreakdown(), QUICK_ROLLS_BY_SYSTEM, DISPOSITION_BADGE, DISPOSITION_LABEL, ReactionHistoryEntry (+33 more)

### Community 34 - "Quest & Session Log UI"
Cohesion: 0.11
Nodes (29): QuestList(), STATUS_BADGE, STATUS_OPTIONS, DATE_FORMAT, Props, SessionLog(), BRUTE, NOW (+21 more)

### Community 35 - "Currency & Inventory Editors"
Cohesion: 0.08
Nodes (32): MamAdvantageBrowserTab(), Props, MamArchetypeBrowser(), MamArchetypeBrowserProps, MamArchetypeBrowser, MamArchetypesTab, MamArchetypesTabComponent, Props (+24 more)

### Community 36 - "Document Sync Engine"
Cohesion: 0.05
Nodes (107): critModelForScene(), degreeModelForScene(), resolveSceneAreaEffect(), resolveSceneAttack(), SceneAreaEffectOutcome, SceneAttackOutcome, SceneCombatStats, SceneRoundOutcome (+99 more)

### Community 37 - "Sheet Header & Stat Cards"
Cohesion: 0.24
Nodes (9): ToastContext, ToastContextValue, ToastItem, ToastProvider(), VARIANT_ICONS, VARIANT_STYLES, registerToastHandler(), ToastHandler (+1 more)

### Community 38 - "Check & Oracle Resolution"
Cohesion: 0.27
Nodes (8): SYSTEM_IDS, getSystemAssetPrefetchStateForTests(), prefetchedSystemAssets, prefetchedSystemRuntimeData, prefetchedSystemSheets, prefetchSystemAssetsForIds(), resetSystemAssetPrefetchStateForTests(), systemAssetPrefetchers

### Community 39 - "Mam3e Data Model & Engine"
Cohesion: 0.05
Nodes (63): resolveD20LegacyArmorClass(), computeD20LegacyAC(), applyDerivedQuantities(), ComputeLayer, DerivedDisplay, DerivedQuantityCase, DerivedQuantitySpec, RFC-003 (+55 more)

### Community 40 - "Doc Drift Rules"
Cohesion: 0.06
Nodes (53): DOC_DRIFT_MANIFEST, DocDriftRuleType, DocDriftSurface, DocDriftSurfaceKind, CAPABILITY_PHRASE_RULES, CapabilityPhraseRule, capitalizeSupportLevel(), COMMAND_RUNTIME_RULES (+45 more)

### Community 41 - "NPM Build Scripts"
Cohesion: 0.04
Nodes (55): scripts, bootstrap:node, build, check:bundle-size, check:compute-register, check:compute-register:mutate, check:compute-register:write, check:dead-code (+47 more)

### Community 42 - "Condition Effects by System"
Cohesion: 0.31
Nodes (7): computeBackoffMs(), isRetryableError(), NON_RETRYABLE_FRAGMENTS, PROD_DEFAULTS, RetryOptions, sleep(), TEST_DEFAULTS

### Community 43 - "Equipped Armor Section"
Cohesion: 0.06
Nodes (46): EquipArmorInput, EquipEntry, EquipShieldInput, Props, SheetDispatch, DockResources, EMPTY, CurrencyEditor (+38 more)

### Community 44 - "Spell Browser UI"
Cohesion: 0.12
Nodes (16): BrowserFeat, Dock(), DockPanelProps, DockProps, EquipmentBrowser, EquipmentBrowserItem, EquipmentBrowserProps, FeatBrowser (+8 more)

### Community 45 - "Scene Combat Area Effects"
Cohesion: 0.17
Nodes (15): buildNotice(), FetchTarget, fetchValidated(), HTML_ENTITIES, looksLikeHtml(), main(), normalize(), noticePath (+7 more)

### Community 46 - "Error Boundary & Auth Context"
Cohesion: 0.10
Nodes (25): Mode, SignIn(), SignInProps, UserMenu(), UserMenuProps, AuthContext, clearLocalDataForAccountChange(), getLastSyncedUserId() (+17 more)

### Community 47 - "Encounter Builder Logic"
Cohesion: 0.12
Nodes (34): createD20LegacyCreationPlan(), applyAbilityAdjustments(), applyD20LegacyClassTemplate(), applyD20LegacyRaceTemplate(), buildClassSkills(), classFeaturesUpToLevel(), classSkillOptions(), collectClassFeatureSignatures() (+26 more)

### Community 48 - "Scene Management Hooks"
Cohesion: 0.12
Nodes (30): useScenes(), makeScene(), now, pickTextFileMock, NOW, NOW, NOTE: localStorage spies survive vi.restoreAllMocks in jsdom — restore manually., SceneDocument (+22 more)

### Community 49 - "Monster Combatant Builder"
Cohesion: 0.04
Nodes (76): NarrateSceneResult, CheckPanel(), CheckPanelProps, DEFAULT_SUGGESTIONS, DND5E_SKILLS, OUTCOME_BADGE, OUTCOME_LABEL, SKILL_SUGGESTIONS_BY_SYSTEM (+68 more)

### Community 50 - "D20 Legacy Templates"
Cohesion: 0.11
Nodes (42): getDaggerheartShortRestRecovery(), createDaggerheartInventoryEntry(), clearAllStress(), clearStress(), prepareGainHope(), repairAllArmor(), repairArmor(), tendToAllWounds() (+34 more)

### Community 51 - "Campaign Storage & Hooks"
Cohesion: 0.17
Nodes (18): Props, Props, SceneCreateFormProps, useCampaigns(), hostileStorage, Campaign, CAMPAIGNS_STORAGE_KEY, CampaignStorageData (+10 more)

### Community 53 - "Dev Dependencies"
Cohesion: 0.04
Nodes (47): @axe-core/playwright, eslint, eslint-config-prettier, @eslint/js, eslint-plugin-react, eslint-plugin-react-hooks, happy-dom, knip (+39 more)

### Community 54 - "Character Combatant Builder"
Cohesion: 0.08
Nodes (33): describeDraftChoices(), draftCharacterThroughPlan(), draftOptionIds(), validateDraftedDocument(), AI_TASK_UNIT_COST, EncounterDraftSelection, AnyTaskGatewayCall, createFlowBudget() (+25 more)

### Community 57 - "Daggerheart Combatant Builders"
Cohesion: 0.12
Nodes (23): D20ClassesSection(), D20LegacyClassLevel, Props, renderClassOptions(), d20BonusSpells(), buildD20LegacySpellSlotTotals(), countAdvancementLevels(), D20_DOMAIN_CLASS_IDS (+15 more)

### Community 58 - "AI Gateway Adapters"
Cohesion: 0.09
Nodes (34): aiFailure, AiFailureCode, AiResponse, AiTask, AiTaskClass, GatewayContext, GatewayTimeoutError, handleAiRequest() (+26 more)

### Community 59 - "AI Gateway Contracts"
Cohesion: 0.12
Nodes (33): AI_TASK_CLASS, AiParse, AiSuccess, AiUsage, CharacterDraftRequest, EncounterDraftRequest, IdentifyCreatureRequest, IllustrateSceneRequest (+25 more)

### Community 60 - "System Definitions & Types"
Cohesion: 0.11
Nodes (18): AI_GATEWAY_ENDPOINT, AiRequest, GeneratedImageData, SceneNarrationData, BY_DESIGN_FAILURE_CODES, callAiGateway(), reportGatewayFailure(), sessionAccessToken() (+10 more)

### Community 61 - "D20 Legacy Spell Slots"
Cohesion: 0.03
Nodes (111): ABILITIES, DEFENSES, MamAbilitiesTab(), Props, MamComplicationBrowser, MamComplicationsTabComponent, Props, MamConditionsTab() (+103 more)

### Community 62 - "SRD Coverage Script"
Cohesion: 0.06
Nodes (56): buildManifest(), CLASSES, CLASSIFICATION_PATH, HERE, LICENSING_CLASSES, loadShipped(), MANIFEST_PATH, run() (+48 more)

### Community 64 - "Spells Tab Components"
Cohesion: 0.15
Nodes (16): Props, focusPulseSpell, PF2E_DERIVED_TRAITS, PF2E_SCHOOL_TRAITS, PF2E_TRADITIONS, AreaOfEffect, Duration, Range (+8 more)

### Community 65 - "Browser Compat & Error Logging"
Cohesion: 0.17
Nodes (15): Props, State, LegalNotices(), LegalNoticesProps, licenseTexts, Card, CardContent, CardDescription (+7 more)

### Community 66 - "AI Gateway Client"
Cohesion: 0.17
Nodes (18): mod(), AbilityScoreGrid(), buildPointBuyDraft(), buildStandardArrayDraft(), clampPointBuyScore(), emptyPointBuyDraft(), emptyStandardArrayDraft(), isStandardArrayComplete() (+10 more)

### Community 67 - "2024 Monster Data Encoder"
Cohesion: 0.16
Nodes (23): ABILITIES, ALIGNMENTS, bucketFor(), classifyImmunityList(), cleanProse(), CR_FRACTIONS, CREATURE_TYPES, DAMAGE_TYPES (+15 more)

### Community 68 - "Character Effects Compilation"
Cohesion: 0.09
Nodes (22): createDefaultDaggerheartData(), DaggerheartDataModel, DAGGERHEART_DERIVED_QUANTITIES, UseDaggerheartMutationHandlersProps, TEST_DATE, dhDoc(), createWarrior(), DaggerheartDomainCardEntry (+14 more)

### Community 69 - "TypeScript Config"
Cohesion: 0.07
Nodes (27): ES2020, src, compilerOptions, allowImportingTsExtensions, baseUrl, forceConsistentCasingInFileNames, isolatedModules, jsx (+19 more)

### Community 70 - "Mam Character Sheet Tabs"
Cohesion: 0.06
Nodes (47): daggerheartComputeRegister, dnd35eComputeRegister, dnd5e2014ComputeRegister, dnd5e2024ComputeRegister, COMPUTE_REGISTERS, registerForSystem(), mam3eComputeRegister, MUTATION_ANCHORS (+39 more)

### Community 72 - "Dice Panel & Mam3e Resolution"
Cohesion: 0.09
Nodes (23): rateLimiterFromEnv(), anthropicAdapter, googleAdapter, ProviderRegistryDeps, Clock, createDurableRateLimitStore(), createInMemoryRateLimitStore(), rateLimiterFromStore() (+15 more)

### Community 73 - "System Validation Logic"
Cohesion: 0.14
Nodes (31): dnd5eKnownSpellLimit(), dnd5eKnownSpellOverage(), KnownSpellProgression, progressionIndex(), ABILITY_SCORE_IDS, addIssue(), appendBuildLegalityIssues(), createDnd5eValidator() (+23 more)

### Community 74 - "Spell Catalog Consistency Tests"
Cohesion: 0.08
Nodes (42): ALL_SYSTEMS, ALLOWED_BY_ID, ALLOWLIST, allowlistHits, auditCitation(), auditRulesLayerLiterals(), CATEGORY_LOADERS, cleared (+34 more)

### Community 75 - "Dnd5e Resource Loading Hooks"
Cohesion: 0.12
Nodes (30): ATTRIBUTES, DAGGERHEART_CURRENCY_FIELDS, DOMAIN_CARD_TYPE_LABELS, EMPTY_WEAPON_LOADOUT, getDaggerheartSheetState(), GetDaggerheartSheetStateProps, matchesQuery(), useDaggerheartSheetController() (+22 more)

### Community 76 - "Mam Powers & Cost Ledger"
Cohesion: 0.31
Nodes (8): formatMamPowerAction(), formatMamPowerDuration(), formatMamPowerRange(), humanizeMamToken(), MamPowerBrowserTabComponent, MamPowerModifierBrowser, Props, SpellBrowser

### Community 78 - "Dnd5e Feature Options"
Cohesion: 0.07
Nodes (46): Dnd5eFeatureOptionsSection(), Dnd5eFeatureOptionsSectionComponent, FeatureOptionBrowser, FeatureOptionBrowserProps, featureOptionSelectionKey(), Props, FeatureOptionBrowser(), FeatureOptionBrowserProps (+38 more)

### Community 79 - "Document Migrations & Storage"
Cohesion: 0.08
Nodes (45): useDebouncedPersistence(), cloneDocumentsSnapshot(), documentsChanged(), prepareDocumentsWithEngines(), prepareDocumentWithEngine(), useDocuments(), FeatureOptionRoundtripCase, makeSystem() (+37 more)

### Community 80 - "App Header & Auth UI"
Cohesion: 0.36
Nodes (7): ThemeToggle(), applyTheme(), getSystemTheme(), isTheme(), Theme, useTheme(), VALID_THEMES

### Community 82 - "HP & Spell Slot Trackers"
Cohesion: 0.11
Nodes (16): AiImageInput, EncounterDraftCandidate, EncounterDraftData, IdentifyCreatureData, TaskGatewayCall, DraftEncounterParams, DraftEncounterResult, GatewayCall (+8 more)

### Community 84 - "Boundary Validation Tests"
Cohesion: 0.24
Nodes (19): NOW, parseImg(), validDocInput(), coerceDate(), coerceObjectives(), coerceQuests(), coerceSceneMapReference(), coerceSessionLog() (+11 more)

### Community 85 - "capabilityScenarios.test.tsx"
Cohesion: 0.60
Nodes (3): formatModifierCost(), MamPowerModifierBrowser(), MamPowerModifierBrowserProps

### Community 86 - "Equipment & Feature Browsers"
Cohesion: 0.10
Nodes (33): MARKER_EFFECT_OPTIONS, markerEffectHelp(), MarkerEffectOption, MarkerEffectPreset, terrainEffectsForPreset(), MarkerPanel(), MarkerPanelProps, terrainBadgeIcon() (+25 more)

### Community 87 - "Pf2e Engine & Constants"
Cohesion: 0.09
Nodes (20): GapLedgerItem, LedgerPhase, LedgerStatus, LedgerTag, LedgerTrack, MASTER_GAP_LEDGER, RFC-003, byPhase (+12 more)

### Community 88 - "Documents Hook & Persistence"
Cohesion: 0.27
Nodes (15): actionReachCells(), ATTACK_COUNT_WORDS, averageDie(), buildMonsterCombatant(), dieFaces(), isMinusSign(), monsterAttackEffects(), monsterAttacksPerRound() (+7 more)

### Community 89 - "Daggerheart Contribution Ledger"
Cohesion: 0.08
Nodes (50): ANCESTRY_ADJUSTMENTS_BY_ID, ancestryByName, classByName, DAGGERHEART_TIER_BREAKPOINTS, DAGGERHEART_TRAITS, DaggerheartAncestryAdjustments, DaggerheartRange, DEFAULT_DAGGERHEART_ANCESTRY_ADJUSTMENTS (+42 more)

### Community 91 - "Mam Browser Tabs"
Cohesion: 0.14
Nodes (22): EncounterMonsterSelection, DIFFICULTY_COLUMN, DND35E_EL_VALUE, dnd35eCreatureValue(), dnd35eEncounterBudget(), draftEncounter(), DraftEncounterResult, ENCOUNTER_BUDGET_SYSTEMS (+14 more)

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
Cohesion: 0.12
Nodes (12): AiProviderAdapter, createMockAdapter(), RFC-002, AiProviderId, ProviderFactoryDeps, ProviderFactoryEnv, selectAiProvider(), request (+4 more)

### Community 98 - "Doc Drift Tests"
Cohesion: 0.07
Nodes (20): BLOCKING_IMPACTS, createCharacterForSystem(), expectNoBlockingViolations(), freezeAnimations(), getCharacterNameInput(), KNOWN_A11Y_DEBT, openLandingPage(), RFC-004 (+12 more)

### Community 99 - "Spell Catalog Parity Tests"
Cohesion: 0.11
Nodes (5): DND35E_SOURCE_BLOCKED_SPELL_IDS, fieldCoverageBaselines, PF1E_SOURCE_ROWS_WITHOUT_SAVING_THROW, SpellModule, spellModules

### Community 100 - "Pf2e Spell Types & Traits"
Cohesion: 0.06
Nodes (35): DamageHealControl(), DamageHealControlProps, clampTrack(), DeathSaves, DeathSavesTracker(), Props, clampExhaustion(), Props (+27 more)

### Community 101 - "Document Storage (IndexedDB)"
Cohesion: 0.24
Nodes (14): D20LegacyData, D20LegacySpellSlots, recoverD20LegacySpellSlot(), resetD20LegacySpellSlots(), setD20LegacyPreparedSpell(), setD20LegacySpellSlotTotal(), slotPool(), spendD20LegacySpellSlot() (+6 more)

### Community 102 - "5e Monster Encoder"
Cohesion: 0.22
Nodes (15): ABILITY_BY_INDEX, ALIGNMENTS, bucketFor(), CREATURE_TYPES, DAMAGE_TYPES, main(), mapAction(), mapAlignment() (+7 more)

### Community 104 - "PF2e Monster Encoder"
Cohesion: 0.23
Nodes (14): ALIGNMENT_ABBREV, bucketFor(), CREATURE_TYPES, DAMAGE_TYPES, main(), mapAttack(), normalizeName(), parseDamage() (+6 more)

### Community 105 - "AI Creature Identification"
Cohesion: 0.09
Nodes (29): useCampaignSync(), UseCampaignSyncOptions, baseAuthValue, mockedClearQueuedCampaignsSnapshot, mockedClearQueuedDeletedCampaignIds, mockedDeleteRemoteCampaign, mockedFetchRemoteCampaigns, mockedGetQueuedCampaignsSnapshot (+21 more)

### Community 106 - "Character Card Presenter"
Cohesion: 0.09
Nodes (21): DragContext, NO_HANDLERS, useDragContext(), DragLayer, DragLayerProps, DragProvider(), toSample(), DragContextValue (+13 more)

### Community 107 - "Oracle Panel & Logic"
Cohesion: 0.38
Nodes (10): CharacterCard(), asNumber(), asRecord(), asString(), getClassLabel(), getDocumentLevelValue(), getHitPointLabel(), getLevelLabel() (+2 more)

### Community 108 - "5e Equipment Tab"
Cohesion: 0.08
Nodes (22): AllegianceChip(), DragSourceHandlers, PendingMonster, CR_XP_TABLE, formatChallengeRating(), MonsterBrowser(), MonsterBrowserProps, DraftEncounterParams (+14 more)

### Community 109 - "Scene Reaction Panel"
Cohesion: 0.21
Nodes (15): compareSpells(), D20SpellsTab(), formatSpellLevel(), Props, titleCase(), D20_ARCANE_SCHOOLS, buildSpellPreparationConcepts(), compareSpellEntries() (+7 more)

### Community 110 - "Document Signature Hashing"
Cohesion: 0.15
Nodes (24): getEligibleDnd5eFeatureOptions(), applyDnd5eLongRest(), applyDnd5eShortRest(), recoverAllSpellSlots(), recoverFeatures(), recoverLongRestHitDice(), recoverPactMagicSlots(), slotPool() (+16 more)

### Community 111 - "Resource Pool Tracking"
Cohesion: 0.05
Nodes (61): foldArmorClass(), resolvePf2eArmorClass(), contextWithConditionIds(), resolveCharacterEffects(), computePf2eAC(), resolvePf2eCheckPenalty(), rollD20(), SAVE_ABILITIES (+53 more)

### Community 112 - "Bundle Size Check"
Cohesion: 0.05
Nodes (32): appChunk, appChunks, assetsDir, budgets, chunkForModule, chunkGraph, chunkGraphPath, chunks (+24 more)

### Community 113 - "AI Prompt Builders"
Cohesion: 0.16
Nodes (19): AI_GATEWAY_TASKS, CharacterDraftCandidate, CharacterDraftPayload, EncounterDraftPayload, IdentifyCreaturePayload, IllustrateScenePayload, SceneNarrationPayload, buildCharacterDraftPrompt() (+11 more)

### Community 115 - "Project Dependencies"
Cohesion: 0.09
Nodes (23): ai, @ai-sdk/anthropic, @ai-sdk/google, class-variance-authority, clsx, lucide-react, dependencies, ai (+15 more)

### Community 119 - "MAM Archetype Browser"
Cohesion: 0.27
Nodes (11): CLASS_TOKENS, d20srdUrl(), FILES, main(), mapCastingTime(), mapDuration(), mapRange(), normalizeName() (+3 more)

### Community 120 - "PF1e Spell Encoder"
Cohesion: 0.27
Nodes (11): CLASS_COLUMNS, main(), mapCastingTime(), mapDuration(), mapRange(), RFC-4180, normalizeName(), parseCsv() (+3 more)

### Community 122 - "PF2e Archetypes Tab"
Cohesion: 0.06
Nodes (46): DND5E_SCENE_CONDITIONS, SCENE_CONDITIONS_BY_SYSTEM, legacyD20Profile(), collectD20LegacyConditionEffects(), D20_LEGACY_CONDITION_EFFECTS, D20_LEGACY_CONDITION_IDS, D20LegacySystemId, hasD20LegacyConditionEffects() (+38 more)

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

### Community 128 - "Toast Notifications"
Cohesion: 0.09
Nodes (33): acceptGridGeometryProposal(), BOX_KINDS, CellRect, COVER_PRESETS, deriveGridFromRegistration(), GridBoxKind, GridBoxProposal, GridGeometryAcceptance (+25 more)

### Community 129 - "Daggerheart Sheet Automation"
Cohesion: 0.05
Nodes (47): CharacterDraftBinding, CharacterDraftChoice, CharacterDraftOutcome, DRAFT_IDS_BY_CATEGORY, draftCharacterForSystem(), RFC-002, isAiEnabled(), AiCharacterDraftPanel() (+39 more)

### Community 131 - "Retry With Backoff"
Cohesion: 0.08
Nodes (27): baseAuthValue, mockedClearQueuedDeletedDocumentIds, mockedClearQueuedSyncSnapshot, mockedDeleteRemoteDocument, mockedFetchRemoteDocuments, mockedGetQueuedDeletedDocumentIds, mockedGetQueuedSyncSnapshot, mockedGetSyncTombstonedIds (+19 more)

### Community 132 - "2024 Spell Encoder"
Cohesion: 0.39
Nodes (8): main(), mapCastingTime(), mapDuration(), mapRange(), normalizeName(), SCHOOLS, slug(), ts()

### Community 133 - "MAM Power Browser"
Cohesion: 0.07
Nodes (34): CombatTogglesSection(), Props, Condition, ConditionPicker(), Props, EquippedArmorSection(), D20_LEGACY_CONDITION_NAMES, D20EquipmentBrowserTab (+26 more)

### Community 134 - "Spell Validation Checks"
Cohesion: 0.28
Nodes (7): collectRawSpells(), getRawSpellById(), getVariantFingerprint(), SpellModule, spellModules, stableFingerprintValue(), VALID_SCHOOLS

### Community 136 - "TS Node Config"
Cohesion: 0.20
Nodes (9): vite.config.ts, compilerOptions, allowSyntheticDefaultImports, composite, forceConsistentCasingInFileNames, module, moduleResolution, skipLibCheck (+1 more)

### Community 137 - "TS Test Config"
Cohesion: 0.10
Nodes (20): e2e/**/*, playwright.config.ts, vitest.config.ts, compilerOptions, lib, noEmit, types, exclude (+12 more)

### Community 139 - "Prettier Config"
Cohesion: 0.22
Nodes (8): arrowParens, endOfLine, overrides, printWidth, semi, singleQuote, tabWidth, trailingComma

### Community 140 - "pf2eConditions.ts"
Cohesion: 0.09
Nodes (30): casterTypes, classResourcesNeeded, classTags, ChoiceSlot, Dnd5eSpeciesSection(), Props, Dnd5eSheetMutators, formatDnd5eSpeciesToolLabel() (+22 more)

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
Cohesion: 0.14
Nodes (21): buildEncounterSceneEvents(), buildInitiativeEntries(), buildOccupiedCells(), clampInteger(), compareTokenIds(), EncounterBuilderIssue, EncounterPartyMember, EncounterPlanEntry (+13 more)

### Community 147 - "Dnd5eEquipmentTab.tsx"
Cohesion: 0.13
Nodes (23): LegalActionCost, LegalActionDescriptor, addBasicActions(), addPowerActions(), buildCatalogLookup(), costForAction(), createMam3eLegalActions(), enumerateMam3eActions() (+15 more)

### Community 148 - "TS Netlify Config"
Cohesion: 0.20
Nodes (9): netlify/functions/**/*.mts, compilerOptions, allowImportingTsExtensions, noEmit, types, extends, include, node (+1 more)

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
Cohesion: 0.04
Nodes (65): IllustrateSceneResult, AppContent(), buildNewCharacterDocument(), cloneSystemData(), CreationWizardHost, LegalNotices, SceneManager, STORAGE_WARNING_THRESHOLD (+57 more)

### Community 154 - "Dnd5eEquipmentTab.tsx"
Cohesion: 0.14
Nodes (19): createSupabaseJwtVerifier(), decodeBase64Url(), decodeJsonSegment(), fail(), resolveGatewayAuth(), SupabaseJwtVerifier, b64url(), mintToken() (+11 more)

### Community 155 - "5e Movement Rules"
Cohesion: 0.09
Nodes (18): AuthContextValue, DebouncedPersistence, IMPORTANT: a begun generation must end in either `persist` or, EntitySyncAdapter, reportSyncFailure(), useEntitySync(), UseEntitySyncOptions, baseAuthValue (+10 more)

### Community 156 - "CharacterListView.tsx"
Cohesion: 0.29
Nodes (10): EncounterPanel(), EncounterPanelProps, formatAverageLevel(), EncounterPartySummary, EncounterPlanSummary, EncounterDifficulty, EncounterSpec, EncounterSpecIssueCode (+2 more)

### Community 158 - "MAM Complication Browser"
Cohesion: 0.11
Nodes (33): ABILITY_KEYS, DND5E_ASI_LEVELS_BY_CLASS, DND5E_BASE_ASI_LEVELS, DND5E_MULTICLASS_PREREQ, dnd5eAsiSlotsGranted(), validateDnd5eBuild(), validatePf1eBuild(), ABILITY_KEYS (+25 more)

### Community 161 - "PF2e Backgrounds Data"
Cohesion: 0.15
Nodes (29): validatePf2eBuild(), getPf2eBulkState(), addIssue(), CLASS_PROGRESSION_RANKS, createPf2eValidator(), isIntegerInRange(), loadValidationData(), PF2E_ABILITY_IDS (+21 more)

### Community 177 - "characterDraftFlow.test.ts"
Cohesion: 0.09
Nodes (23): CharacterDraftApplier, collectUnknownIdIssues(), DocumentValidator, DraftCharacterParams, DraftCharacterResult, draftCharacterWithAi(), GatewayCall, POOL_LIST_FIELDS (+15 more)

### Community 179 - "useSceneEncounter.ts"
Cohesion: 0.17
Nodes (17): draftEncounterWithAi(), identifyCreatureWithAi(), fileToAiImageInput(), readAsDataUrl(), draftEncounter(), isMonsterSystemId(), RFC-006, useSceneEncounter() (+9 more)

### Community 180 - "daggerheart/validation.ts"
Cohesion: 0.24
Nodes (21): addIssue(), buildLookup(), createDaggerheartValidator(), CUSTOM_INVENTORY_PREFIXES, DaggerheartValidationData, isIntegerInRange(), NamedEntry, normalizeLookupKey() (+13 more)

### Community 181 - "useEntitySync.ts"
Cohesion: 0.27
Nodes (10): mockedGetQueuedCampaignsSnapshot, mockedGetQueuedDeletedCampaignIds, mockedGetQueuedDeletedDocumentIds, mockedGetQueuedSyncSnapshot, formatDateAndTime(), formatLastSyncedAt(), formatTimeOfDay(), isPreviousLocalDay() (+2 more)

### Community 182 - "syncTombstones.ts"
Cohesion: 0.06
Nodes (50): BreakdownRow, buildRows(), ContributionBreakdown(), formulaOf(), Props, toRow(), RFC-003, resolveCharacterLedger() (+42 more)

### Community 183 - "loadEquipmentForSystem"
Cohesion: 0.50
Nodes (3): Answer, Outcome, Q: where are pending debounced document saves flushed to localStorage on page hide or unload (persistence flush)

### Community 184 - "MamArchetypesTab.tsx"
Cohesion: 0.06
Nodes (54): artifactPath, attributeMutations, definitionDirs, root, sourceHash, sourcePath, systemsDir, violations (+46 more)

### Community 186 - "eslint-plugin-react"
Cohesion: 0.40
Nodes (4): Feat, FeatBrowser(), FeatBrowserProps, feats

### Community 187 - "fake-indexeddb"
Cohesion: 0.16
Nodes (18): BACKGROUND_FIELDS(), BASELINE_PATH, buildManifest(), CR_FRACTIONS, EXTRACTORS, HERE, LOADERS, loadProductEntries() (+10 more)

### Community 188 - "dnd35e/validation.ts"
Cohesion: 0.24
Nodes (19): validateDnd35eBuild(), Dnd35eFeat, addIssue(), appendBuildLegalityIssues(), createDnd35eValidator(), Dnd35eValidationData, isIntegerInRange(), loadValidationData() (+11 more)

### Community 190 - "index.ts"
Cohesion: 0.21
Nodes (12): SheetAddHandlers, SheetDispatchRegistry, SheetDispatchRegistryContext, SheetDispatchState, SheetDispatchStateContext, useSheetDispatch(), Consumer(), FEAT (+4 more)

### Community 191 - "retryWithBackoff"
Cohesion: 0.27
Nodes (17): addIssue(), createMam3eValidator(), engine, loadValidationData(), Mam3eValidationData, SPENT_BUCKETS, validateAdvantages(), validateArchetypePins() (+9 more)

### Community 194 - "@types/react-dom"
Cohesion: 0.03
Nodes (67): SystemRegistry, RFC-003, LegalActionEligibility, LegalActionList, LegalActionsContext, LegalActionTarget, SheetProps, SystemCreatorComponent (+59 more)

### Community 197 - "@playwright/test"
Cohesion: 0.24
Nodes (13): addAttackOfOpportunity(), addAttacks(), addCombatActions(), addFullAttack(), addSpellcasting(), createD20LegacyLegalActions(), D20LegacyActionData, D20LegacySystemId (+5 more)

### Community 198 - "@testing-library/user-event"
Cohesion: 0.27
Nodes (9): makeScene(), campaignSignatureFor(), sameCampaignSignatures(), sameDocumentSignatures(), sameSceneSignatures(), sameSignatureMultisets(), sceneSignatureFor(), signatureFor() (+1 more)

### Community 200 - "@typescript-eslint/parser"
Cohesion: 0.31
Nodes (11): addDomainCardActions(), addHopeFeature(), addUniversalMoves(), addWeaponStrikes(), buildLookup(), createDaggerheartLegalActions(), enumerateDaggerheartActions(), NamedEntry (+3 more)

### Community 202 - "phase3-workflows.spec.ts"
Cohesion: 0.29
Nodes (11): extractJsArray(), field(), main(), MODULES, parseEntries(), prettierBin(), readSource(), slug() (+3 more)

### Community 205 - "shared/legalActions.ts"
Cohesion: 0.27
Nodes (12): Dnd5eLikeDataModel, addMovement(), addReaction(), addSpellcasting(), addStandardActions(), addWeaponAttacks(), createDnd5eLegalActions(), enumerateDnd5eActions() (+4 more)

### Community 206 - "sceneTerrain.ts"
Cohesion: 0.31
Nodes (7): collectTerrainEffectsAt(), isTerrainOperation(), markerCoversCell(), markerToEffects(), normalizeStackPolicy(), TERRAIN_OPERATIONS, RFC-003

### Community 208 - "gateBudget.test.tsx"
Cohesion: 0.16
Nodes (12): useDragSource(), SceneDropController(), SceneDispatchContext, SceneEmit, useSceneDispatch(), Harness(), now, performDrag() (+4 more)

### Community 212 - "aiSdkAdapter.test.mts"
Cohesion: 0.06
Nodes (34): counterStore, latencyBudgetsFromEnv(), positiveEnv(), sessionBudgetFromEnv(), AiSdkAdapterConfig, createAiSdkAdapter(), IMAGE_TASKS, RFC-002 (+26 more)

### Community 213 - "spikeViewport.ts"
Cohesion: 0.43
Nodes (6): rect, clampCoordinate(), invertPoint(), Rect, Viewport, zoomToCursor()

## Knowledge Gaps
- **1487 isolated node(s):** `semi`, `singleQuote`, `trailingComma`, `printWidth`, `tabWidth` (+1482 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **20 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `CharacterDocument` connect `System Registry & Renderer` to `Daggerheart Sheet Automation`, `Dnd5e Equipment & Features UI`, `Dnd5e Background Templates`, `Dnd5e2024 Engine & Hit Dice`, `MAM Power Browser`, `Daggerheart Engine`, `Tabs UI Component`, `Retry With Backoff`, `Scene Combat Resolution`, `pf2eConditions.ts`, `Dnd5e Activity Definitions`, `Dnd5e Feat Templates`, `D20 Combat Controls`, `Scene Illustration Panel`, `Game System Selector`, `D20 Legacy System Engines`, `Dnd35e Saves & Data Model`, `Dnd5eEquipmentTab.tsx`, `Daggerheart Data Model`, `ServiceWorkerUpdateBanner.tsx`, `Daggerheart Inventory`, `Pf2e Character Templates`, `Dnd5e Feature List Sections`, `Encounter & Initiative Panels`, `MAM Complication Browser`, `Pf2e Sheet Tabs`, `PF2e Backgrounds Data`, `Quest & Session Log UI`, `Document Sync Engine`, `Mam3e Data Model & Engine`, `Equipped Armor Section`, `Spell Browser UI`, `Encounter Builder Logic`, `characterDraftFlow.test.ts`, `D20 Legacy Templates`, `useSceneEncounter.ts`, `daggerheart/validation.ts`, `Character Combatant Builder`, `syncTombstones.ts`, `dnd35e/validation.ts`, `D20 Legacy Spell Slots`, `retryWithBackoff`, `@types/react-dom`, `Character Effects Compilation`, `@playwright/test`, `@testing-library/user-event`, `@typescript-eslint/parser`, `System Validation Logic`, `Dnd5e Resource Loading Hooks`, `shared/legalActions.ts`, `Dnd5e Feature Options`, `Document Migrations & Storage`, `gateBudget.test.tsx`, `Boundary Validation Tests`, `Equipment & Feature Browsers`, `Daggerheart Contribution Ledger`, `Document Storage (IndexedDB)`, `Character Card Presenter`, `Oracle Panel & Logic`, `5e Equipment Tab`, `Document Signature Hashing`, `Resource Pool Tracking`?**
  _High betweenness centrality (0.144) - this node is a cross-community bridge._
- **Why does `entry()` connect `daggerheart/validation.ts` to `Retry With Backoff`, `Tabs UI Component`, `Node Runtime Bootstrap`, `Dnd5eEquipmentTab.tsx`, `System Registry & Renderer`, `ServiceWorkerUpdateBanner.tsx`, `Daggerheart Inventory`, `AI Encounter Drafting`, `Doc Drift Rules`, `Encounter Builder Logic`, `D20 Legacy Templates`, `syncTombstones.ts`, `Daggerheart Combatant Builders`, `AI Gateway Contracts`, `fake-indexeddb`, `Mam Character Sheet Tabs`, `@typescript-eslint/parser`, `Dnd5e Resource Loading Hooks`, `Dnd5e Feature Options`, `Daggerheart Contribution Ledger`, `Pf2e Spell Data Encoder`, `Document Storage (IndexedDB)`, `5e Monster Encoder`, `Document Signature Hashing`?**
  _High betweenness centrality (0.080) - this node is a cross-community bridge._
- **Why does `GameSystemId` connect `Class Enhancement & Headers` to `Sheet Resource Loading Hooks`, `Daggerheart Sheet Automation`, `Dnd5e Sheets & E2E Tests`, `Dnd5e Background Templates`, `Dnd5e2024 Engine & Hit Dice`, `MAM Power Browser`, `Scene Combat Resolution`, `pf2eConditions.ts`, `Dnd5e Feat Templates`, `Game System Selector`, `Dnd35e Saves & Data Model`, `System Registry & Renderer`, `ServiceWorkerUpdateBanner.tsx`, `Roadmap Metrics Generator`, `Pf2e Sheet Tabs`, `Quest & Session Log UI`, `Currency & Inventory Editors`, `Document Sync Engine`, `Check & Oracle Resolution`, `Doc Drift Rules`, `Equipped Armor Section`, `Spell Browser UI`, `Encounter Builder Logic`, `characterDraftFlow.test.ts`, `D20 Legacy Templates`, `useSceneEncounter.ts`, `Character Combatant Builder`, `Daggerheart Combatant Builders`, `AI Gateway Adapters`, `D20 Legacy Spell Slots`, `SRD Coverage Script`, `Spell Catalog Consistency Tests`, `Dnd5e Resource Loading Hooks`, `shared/legalActions.ts`, `Document Signature Hashing`?**
  _High betweenness centrality (0.059) - this node is a cross-community bridge._
- **What connects `semi`, `singleQuote`, `trailingComma` to the rest of the system?**
  _1487 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Sheet Resource Loading Hooks` be split into smaller, more focused modules?**
  _Cohesion score 0.05890257558790594 - nodes in this community are weakly interconnected._
- **Should `Dnd5e Sheets & E2E Tests` be split into smaller, more focused modules?**
  _Cohesion score 0.11201079622132254 - nodes in this community are weakly interconnected._
- **Should `Dnd5e Equipment & Features UI` be split into smaller, more focused modules?**
  _Cohesion score 0.14979757085020243 - nodes in this community are weakly interconnected._