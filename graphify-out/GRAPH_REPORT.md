# Graph Report - windsurf-project  (2026-07-28)

## Corpus Check
- 918 files · ~762,180 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 5936 nodes · 17172 edges · 205 communities (187 shown, 18 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 168 edges (avg confidence: 0.72)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5e58960c`
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
- Dnd5eEquipmentTab.tsx
- check-mam-equipment-provenance.mjs
- dnd5eToolChoices.ts
- MAM Archetype Browser
- PF1e Spell Encoder
- validation.ts
- PF2e Archetypes Tab
- 3.5e Gear & Weapons
- 5e Equipment Encoder
- 5e Spell Encoder
- Daggerheart Adversary Encoder
- encode-35e-feats.mjs
- Toast Notifications
- Daggerheart Sheet Automation
- legality/pf2e.ts
- Retry With Backoff
- 2024 Spell Encoder
- MAM Power Browser
- Spell Validation Checks
- TS Node Config
- TS Test Config
- syncTombstones.ts
- Prettier Config
- pf2eConditions.ts
- useDnd5eTemplateHandlers.ts
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
- postcss
- MAM Complication Browser
- @testing-library/user-event
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
- @vitejs/plugin-react
- vitest
- @types/react-dom
- @vitest/coverage-v8
- @testing-library/user-event
- phase3-workflows.spec.ts
- gateBudget.test.tsx
- aiSdkAdapter.test.mts
- spikeViewport.ts

## God Nodes (most connected - your core abstractions)
1. `CharacterDocument` - 308 edges
2. `SystemDataModel` - 166 edges
3. `GameSystemId` - 100 edges
4. `SystemRegistry` - 85 edges
5. `EffectInstance` - 72 edges
6. `makeEffectId()` - 63 edges
7. `abilityMod()` - 63 edges
8. `Pf2eDataModel` - 57 edges
9. `scripts` - 56 edges
10. `Dnd5eDataModel` - 55 edges

## Surprising Connections (you probably didn't know these)
- `flattenEntries()` --indirect_call--> `entry()`  [INFERRED]
  scripts/check-compute-register.mjs → src/__tests__/components/ContributionBreakdown.test.tsx
- `loadProductEntries()` --indirect_call--> `entry()`  [INFERRED]
  scripts/check-srd-fidelity.mjs → src/__tests__/components/ContributionBreakdown.test.tsx
- `AbilityScoreGrid()` --indirect_call--> `mod()`  [INFERRED]
  src/components/sheet/AbilityScoreGrid.tsx → scripts/encode-35e-monsters.mjs
- `Pf2eAbilitiesTab()` --indirect_call--> `mod()`  [INFERRED]
  src/systems/pf2e/components/Pf2eAbilitiesTab.tsx → scripts/encode-35e-monsters.mjs
- `mapDamageList()` --indirect_call--> `entry()`  [INFERRED]
  scripts/encode-5e-monsters.mjs → src/__tests__/components/ContributionBreakdown.test.tsx

## Import Cycles
- None detected.

## Communities (205 total, 18 thin omitted)

### Community 0 - "Sheet Resource Loading Hooks"
Cohesion: 0.06
Nodes (88): ancestryPool(), backgroundPool(), classPool(), loadCharacterDraftPools(), NamedEntity, toCandidates(), RFC-002, buildSystem() (+80 more)

### Community 1 - "Dnd5e Sheets & E2E Tests"
Cohesion: 0.18
Nodes (15): SystemCatalogSummary, SystemContentCategoryId, SystemContentReachability, SystemContentSummary, SystemSupportLevel, countProductItems(), loadSystemCatalogSummaryFromMetadataInternal(), metadataSummaryCache (+7 more)

### Community 2 - "Dnd5e Equipment & Features UI"
Cohesion: 0.16
Nodes (30): useCampaignSync(), mockedGetSupabaseClient, getSupabaseClient(), clearQueuedCampaignsSnapshot(), clearQueuedDeletedCampaignIds(), clearQueuedIds(), deleteRemoteCampaign(), extractTombstone() (+22 more)

### Community 3 - "Dnd5e Background Templates"
Cohesion: 0.06
Nodes (66): countSelections(), Dnd5eSheetMutators, optionDisabledForRequirement(), resolveEquipmentSlot(), resolveFeatSelections(), toEquippedItem(), toWeaponDamage(), ABILITY_NAME_TO_ID (+58 more)

### Community 4 - "Dnd5e2024 Engine & Hit Dice"
Cohesion: 0.04
Nodes (50): HIT_DICE, hitDieSize(), hitDieString(), collectDnd5eConditionEffects(), conditionImposesDisadvantage(), Dnd5e2024Engine, hasAlertFeat(), totalCharacterLevel() (+42 more)

### Community 5 - "Daggerheart Engine"
Cohesion: 0.09
Nodes (42): applyDnd5eSubclassTemplate(), assertMulticlassRequirements(), ATTRIBUTE_NAME_TO_ID, buildChoiceSlots(), buildDerivedProficiencies(), buildSpellcastingState(), canSelectSubclass(), classFeaturesAtLevel() (+34 more)

### Community 6 - "3.5e Monster Data Encoder"
Cohesion: 0.06
Nodes (56): ALIGNMENTS, DICE_PROGRESSIONS, main(), mapAlignment(), MONSTER_SIZE, normalizeName(), OLIMOT_FILES, resolveSizeRoll() (+48 more)

### Community 7 - "Tabs UI Component"
Cohesion: 0.06
Nodes (54): Badge(), BadgeProps, badgeVariants, TABLIST_NAV_KEYS, Tabs, TabsContent, TabsContentProps, TabsContext (+46 more)

### Community 8 - "Node Runtime Bootstrap"
Cohesion: 0.09
Nodes (49): main(), runBootstrapNodeInstall(), getPinnedCommandArgs(), main(), runPinnedNpmCommand(), formatRuntimeDoctorReport(), main(), readWorkflowPinSource() (+41 more)

### Community 9 - "Scene Combat Resolution"
Cohesion: 0.05
Nodes (61): buildScene(), MakeGameResult, UseSceneEncounterParams, Props, ResolveCombatStats, BuildEncounterEventsParams, BuildEncounterEventsResult, appendSceneEvent() (+53 more)

### Community 10 - "Dnd5e Class Templates"
Cohesion: 0.23
Nodes (18): makeAsset(), makeSceneWithMap(), clearMapAssetStorage(), createMapAsset(), CreateMapAssetResult, deleteMapAsset(), isMapAssetShape(), isRecord() (+10 more)

### Community 11 - "System Compute Registers"
Cohesion: 0.13
Nodes (26): SpellBrowserSpell, DockPanel(), D20SpellBrowserPanelComponent, Props, SpellBrowser, toSpellBrowserSpell(), Dnd5eSpellsTabComponent, Props (+18 more)

### Community 12 - "Scene Check Panel"
Cohesion: 0.15
Nodes (15): e(), spySink(), spySink(), BrowserCapabilities, checkBrowserCapabilities(), initBrowserCompat(), isBrowserSupported(), showCompatibilityWarning() (+7 more)

### Community 13 - "Dnd5e Activity Definitions"
Cohesion: 0.09
Nodes (27): buildDefenseStyleActivity(), buildDivineSmiteActivities(), buildDivineSmiteActivity(), buildDnd5eActivityDefinitions(), buildUnsupportedDivineSmiteActivity(), divineSmiteSlotLevel(), Dnd5eActivityCost, Dnd5eActivityCostKind (+19 more)

### Community 14 - "Monster & NPC Generator"
Cohesion: 0.07
Nodes (43): DragProvider, DragRoot(), isSceneDragEnabled(), FEATURE_FLAGS, FeatureFlag, FeatureFlagDefinition, isFeatureEnabled(), RingBuffer (+35 more)

### Community 15 - "Dnd5e Feat Templates"
Cohesion: 0.11
Nodes (30): D20SkillsTab(), AddEffectInput, buildBaseAttackBonusEffects(), buildD20LegacyContributionLedger(), buildSaveEffects(), buildSkillSynergyEffects(), createEffect(), D20LegacyClassLevelView (+22 more)

### Community 16 - "App Shell & Layout"
Cohesion: 0.11
Nodes (22): feat, item, monster, spell, DockResources, EMPTY, useDockResources(), ExpectedSpellIdentity (+14 more)

### Community 17 - "D20 Combat Controls"
Cohesion: 0.08
Nodes (35): Dnd5eTemplateState, AddEffectInput, AddEntryInput, buildAlwaysPreparedSpellParts(), buildArmorClassParts(), buildDnd5eContributionLedger(), buildFeatAutomationParts(), buildListEntry() (+27 more)

### Community 18 - "Game System Selector"
Cohesion: 0.08
Nodes (48): EquippedItemsSection(), Props, SLOT_LABELS, SLOT_ORDER, NormalizedSheet, createDefaultDnd5e2024Data(), Dnd5e2024DataModel, Dnd5e2024TemplateState (+40 more)

### Community 19 - "Combat & Recap Panels"
Cohesion: 0.33
Nodes (5): DEFAULT_LABELS, SpellBrowser(), SpellBrowserLabels, SpellBrowserProps, mockSpells

### Community 20 - "D20 Legacy System Engines"
Cohesion: 0.13
Nodes (27): getDaggerheartShortRestRecovery(), clampDaggerheartInventoryQuantity(), createDaggerheartInventoryEntry(), daggerheartInventoryDefinitions, findDaggerheartInventoryDefinitionByName(), getDaggerheartInventoryDefinition(), inventoryDefinitionById, inventoryDefinitionByName (+19 more)

### Community 21 - "Dnd35e Saves & Data Model"
Cohesion: 0.03
Nodes (114): resolveD20LegacyArmorClass(), computeD20LegacyAC(), D20_SIZE_MOD, d20LegacyCheckPenalty(), applyDerivedQuantities(), rollD20(), D20LegacyHeader(), Props (+106 more)

### Community 22 - "Daggerheart Data Model"
Cohesion: 0.13
Nodes (16): CurrencyEditor(), CurrencyEntry, DND_CURRENCIES, Props, InventoryItem, InventoryManager(), InventoryManagerProps, Currency (+8 more)

### Community 23 - "System Registry & Renderer"
Cohesion: 0.05
Nodes (51): CharacterDraftProposal, MakeGameCharacter, AppHeaderProps, Props, CharacterCardProps, CharacterListViewProps, SceneDropControllerProps, TokenPanelProps (+43 more)

### Community 24 - "Game Rules & Proficiencies"
Cohesion: 0.09
Nodes (25): GAME_RULES, ArmorProficiency, ArmorProficiencyType, isValidArmorProficiency(), isValidSkillProficiency(), isValidToolProficiency(), isValidWeaponProficiency(), MartialWeaponProficiency (+17 more)

### Community 25 - "Campaign Sync Hooks"
Cohesion: 0.11
Nodes (39): resolveCheck(), cellKey(), footprintCells(), footprintWithinGrid(), isOracleOdds(), resolveOracle(), applyHitPointDelta(), applySceneEvent() (+31 more)

### Community 26 - "Daggerheart Inventory"
Cohesion: 0.09
Nodes (36): ancestryLookup, armorLookup, buildLookup(), classLookup, communityLookup, DEFAULTS, domainCardByName, domainCardByNameAndDomain (+28 more)

### Community 27 - "Pf2e Character Templates"
Cohesion: 0.09
Nodes (43): PF2E_ARCHETYPE_DEDICATION_GRANTS, Pf2eDedicationProficiencyGrant, Pf2eFeat, abilityBoostValue(), ancestryFeatures(), applyAbilityAdjustments(), applyPf2eAncestryTemplate(), applyPf2eArchetypeTemplate() (+35 more)

### Community 28 - "Roadmap Metrics Generator"
Cohesion: 0.09
Nodes (40): applyRepoResidentOverrides(), buildComputeCompletion(), buildContentCoverage(), buildMarkdownReport(), ComputeCompletionRow, computeMetrics(), ContentCoverageRow, createEmptyCategoryCounts() (+32 more)

### Community 29 - "Dnd5e Feature List Sections"
Cohesion: 0.07
Nodes (41): mod(), DamageHealControl(), DamageHealControlProps, DiceRollButton(), DiceRollButtonProps, RollResult, ABILITIES, D20AbilitiesTab() (+33 more)

### Community 30 - "Encounter & Initiative Panels"
Cohesion: 0.11
Nodes (31): appendInventoryFromBackground(), applyDnd5eBackgroundTemplate(), BackgroundChoiceSlot, BackgroundChoiceValue, backgroundDerivedState(), COMMON_LANGUAGE_OPTIONS, Dnd5eBackgroundTemplateSelections, Dnd5eLikeDataModel (+23 more)

### Community 31 - "Class Enhancement & Headers"
Cohesion: 0.10
Nodes (30): useLazyResource(), useSystemOptions(), useD20LegacySheetResources(), UseD20LegacySheetResourcesProps, Dnd5eEquipmentTab, Dnd5eFeaturesTab, Dnd5eSpellsTab, useDnd5eDeferredResource() (+22 more)

### Community 32 - "Pf2e Sheet Tabs"
Cohesion: 0.11
Nodes (31): ArmorClassItem, computeDnd5eBaseArmorClass(), Dnd5eUnarmoredDefense, foldArmorClass(), resolveDnd5eArmorClass(), CharacterEffectInputs, contextWithConditionIds(), resolveCharacterEffects() (+23 more)

### Community 33 - "AI Encounter Drafting"
Cohesion: 0.08
Nodes (37): DEFAULT_QUICK_ROLLS, DicePanel(), DicePanelProps, formatBreakdown(), QUICK_ROLLS_BY_SYSTEM, DISPOSITION_BADGE, DISPOSITION_LABEL, ReactionHistoryEntry (+29 more)

### Community 34 - "Quest & Session Log UI"
Cohesion: 0.10
Nodes (35): Props, QuestList(), STATUS_BADGE, STATUS_OPTIONS, DATE_FORMAT, Props, SessionLog(), Props (+27 more)

### Community 35 - "Currency & Inventory Editors"
Cohesion: 0.17
Nodes (15): MamArchetypeBrowser(), MamArchetypeBrowserProps, MamConditionsTab(), Props, Mam3eConditionTrack, getMam3eSheetState(), GetMam3eSheetStateProps, uniqueNonEmptyStrings() (+7 more)

### Community 36 - "Document Sync Engine"
Cohesion: 0.04
Nodes (139): critModelForScene(), degreeModelForScene(), resolveSceneAreaEffect(), resolveSceneAttack(), runSceneRound(), SceneCombatStats, RFC-003, buildDaggerheartAdversaryCombatant() (+131 more)

### Community 37 - "Sheet Header & Stat Cards"
Cohesion: 0.27
Nodes (8): ToastContext, ToastContextValue, ToastItem, ToastProvider(), VARIANT_ICONS, VARIANT_STYLES, registerToastHandler(), ToastVariant

### Community 38 - "Check & Oracle Resolution"
Cohesion: 0.04
Nodes (39): @testing-library/jest-dom, SystemRegistry, RFC-003, SystemEngine, registerAllSystems(), renderSyntheticWizard(), syntheticPlan(), openBrokenSheet() (+31 more)

### Community 39 - "Mam3e Data Model & Engine"
Cohesion: 0.07
Nodes (41): ProficiencyListSection(), Props, Dnd5eFeatureOptionsSection(), Dnd5eFeatureOptionsSectionComponent, FeatureOptionBrowser, FeatureOptionBrowserProps, featureOptionSelectionKey(), Props (+33 more)

### Community 40 - "Doc Drift Rules"
Cohesion: 0.06
Nodes (55): DOC_DRIFT_MANIFEST, DocDriftRuleType, DocDriftSurface, DocDriftSurfaceKind, CAPABILITY_PHRASE_RULES, CapabilityPhraseRule, capitalizeSupportLevel(), COMMAND_RUNTIME_RULES (+47 more)

### Community 41 - "NPM Build Scripts"
Cohesion: 0.04
Nodes (56): scripts, analyze, bootstrap:node, build, check:bundle-size, check:compute-register, check:compute-register:mutate, check:compute-register:write (+48 more)

### Community 42 - "Condition Effects by System"
Cohesion: 0.36
Nodes (8): computeBackoffMs(), isRetryableError(), NON_RETRYABLE_FRAGMENTS, PROD_DEFAULTS, RetryOptions, retryWithBackoff(), sleep(), TEST_DEFAULTS

### Community 43 - "Equipped Armor Section"
Cohesion: 0.11
Nodes (25): EquipArmorInput, EquipEntry, EquippedArmorSection(), EquipShieldInput, Props, fullPlate, leather, steelShield (+17 more)

### Community 44 - "Spell Browser UI"
Cohesion: 0.11
Nodes (19): useDragSource(), BrowserFeat, DockPanelProps, DockProps, EquipmentBrowser, EquipmentBrowserItem, EquipmentBrowserProps, FeatBrowser (+11 more)

### Community 45 - "Scene Combat Area Effects"
Cohesion: 0.17
Nodes (15): buildNotice(), FetchTarget, fetchValidated(), HTML_ENTITIES, looksLikeHtml(), main(), normalize(), noticePath (+7 more)

### Community 46 - "Error Boundary & Auth Context"
Cohesion: 0.14
Nodes (15): AuthContext, clearLocalDataForAccountChange(), getLastSyncedUserId(), setLastSyncedUserId(), AuthProvider(), AuthCallback, mockedGetSupabaseClient, mockedIsSupabaseConfigured (+7 more)

### Community 47 - "Encounter Builder Logic"
Cohesion: 0.07
Nodes (56): availableD20LegacyToggles(), presentDerivedQuantities(), D20ClassesSection(), D20LegacyClassLevel, renderClassOptions(), applyAbilityAdjustments(), applyD20LegacyClassTemplate(), applyD20LegacyRaceTemplate() (+48 more)

### Community 48 - "Scene Management Hooks"
Cohesion: 0.11
Nodes (33): mergeLoadedScenes(), useScenes(), NOW, defineSetItem(), installLocalStorageQuota(), makeHeavyScene(), makeScene(), NOW (+25 more)

### Community 49 - "Monster Combatant Builder"
Cohesion: 0.04
Nodes (76): NarrateSceneResult, CheckPanel(), CheckPanelProps, DEFAULT_SUGGESTIONS, DND5E_SKILLS, OUTCOME_BADGE, OUTCOME_LABEL, SKILL_SUGGESTIONS_BY_SYSTEM (+68 more)

### Community 50 - "D20 Legacy Templates"
Cohesion: 0.10
Nodes (44): Props, D20LegacyData, D20LegacySpellSlots, recoverD20LegacySpellSlot(), resetD20LegacySpellSlots(), setD20LegacyPreparedSpell(), setD20LegacySpellSlotTotal(), slotPool() (+36 more)

### Community 51 - "Campaign Storage & Hooks"
Cohesion: 0.17
Nodes (19): useCampaigns(), DebouncedPersistence, IMPORTANT: a begun generation must end in either `persist` or, useDebouncedPersistence(), hostileStorage, CAMPAIGNS_STORAGE_KEY, clearCampaignStorage(), exportCampaigns() (+11 more)

### Community 52 - "Spell Preparation Logic"
Cohesion: 0.09
Nodes (27): collectMam3eConditionEffects(), mam3eToughnessPenalty(), createDefaultMam3eData(), Mam3eSystemDef, RFC-003, applyMam3eToughnessFailure(), Mam3eEngine, normalizeConditionTrack() (+19 more)

### Community 53 - "Dev Dependencies"
Cohesion: 0.04
Nodes (47): autoprefixer, @axe-core/playwright, eslint, eslint-config-prettier, @eslint/js, eslint-plugin-react, eslint-plugin-react-hooks, happy-dom (+39 more)

### Community 54 - "Character Combatant Builder"
Cohesion: 0.10
Nodes (24): AI_TASK_UNIT_COST, AiTask, AnyTaskGatewayCall, createFlowBudget(), DEFAULT_MAKE_GAME_FLOW_BUDGET, FlowBudget, FlowBudgetLimits, FlowBudgetReport (+16 more)

### Community 56 - "SRD Manifest Generator"
Cohesion: 0.13
Nodes (31): getBackgroundFixedToolProficiencies(), getBackgroundLanguageOptions(), getBackgroundToolChoiceSlots(), getDnd5eTemplateChoiceState(), applyDnd5eSpeciesTemplate(), buildAbilityChoiceSlots(), buildSpeciesFeatures(), choiceAbilityBonuses() (+23 more)

### Community 57 - "Daggerheart Combatant Builders"
Cohesion: 0.10
Nodes (27): react, react, useTabs(), useSheetDispatchRegister(), availableDnd5eToggles(), collectDnd5eRiderEffects(), DND5E_TOGGLE_IDS, dnd5eEditionOf() (+19 more)

### Community 58 - "AI Gateway Adapters"
Cohesion: 0.09
Nodes (29): AiFailureCode, AiResponse, AiTaskClass, GatewayContext, GatewayTimeoutError, handleAiRequest(), latencyBudgetFor(), modelForTask() (+21 more)

### Community 59 - "AI Gateway Contracts"
Cohesion: 0.12
Nodes (33): AI_TASK_CLASS, AiParse, AiSuccess, AiUsage, CharacterDraftRequest, EncounterDraftRequest, IdentifyCreatureRequest, IllustrateSceneRequest (+25 more)

### Community 60 - "System Definitions & Types"
Cohesion: 0.18
Nodes (11): GeneratedImageData, IllustrateGatewayCall, IllustrateSceneParams, IllustrateSceneResult, illustrateSceneWithAi(), RFC-002, ILLUSTRATION_STYLES, IllustrationPanel() (+3 more)

### Community 61 - "D20 Legacy Spell Slots"
Cohesion: 0.11
Nodes (26): ABILITIES, DEFENSES, Mam3eCreator(), Mam3eCreatorProps, SKILLS, buildMam3eCreatorData(), createDefaultMam3eDefenseRanks(), DERIVATION_EPOCH (+18 more)

### Community 62 - "SRD Coverage Script"
Cohesion: 0.06
Nodes (56): buildManifest(), CLASSES, CLASSIFICATION_PATH, HERE, LICENSING_CLASSES, loadShipped(), MANIFEST_PATH, run() (+48 more)

### Community 63 - "ESLint Config"
Cohesion: 0.11
Nodes (21): clampTrack(), DeathSaves, DeathSavesTracker(), Props, HitDiceTracker(), Props, clampExhaustion(), Props (+13 more)

### Community 64 - "Spells Tab Components"
Cohesion: 0.13
Nodes (13): PF2E_DERIVED_TRAITS, PF2E_SCHOOL_TRAITS, PF2E_TRADITIONS, AreaOfEffect, Duration, Range, CastingTime, MagicSchool (+5 more)

### Community 65 - "Browser Compat & Error Logging"
Cohesion: 0.12
Nodes (22): Props, State, LegalNotices(), LegalNoticesProps, licenseTexts, LibraryBestiaryView(), LoadState, MonsterBrowser (+14 more)

### Community 66 - "AI Gateway Client"
Cohesion: 0.18
Nodes (17): AbilityScoreGrid(), buildPointBuyDraft(), buildStandardArrayDraft(), clampPointBuyScore(), emptyPointBuyDraft(), emptyStandardArrayDraft(), isStandardArrayComplete(), isValidPointBuyDraft() (+9 more)

### Community 67 - "2024 Monster Data Encoder"
Cohesion: 0.16
Nodes (23): ABILITIES, ALIGNMENTS, bucketFor(), classifyImmunityList(), cleanProse(), CR_FRACTIONS, CREATURE_TYPES, DAMAGE_TYPES (+15 more)

### Community 68 - "Character Effects Compilation"
Cohesion: 0.16
Nodes (14): DaggerheartCharacterBasicsSection(), Props, DaggerheartNotesSection(), Props, DaggerheartDataModel, DAGGERHEART_DERIVED_QUANTITIES, DaggerheartSheet(), Props (+6 more)

### Community 69 - "TypeScript Config"
Cohesion: 0.07
Nodes (27): ES2020, src, compilerOptions, allowImportingTsExtensions, baseUrl, forceConsistentCasingInFileNames, isolatedModules, jsx (+19 more)

### Community 70 - "Mam Character Sheet Tabs"
Cohesion: 0.06
Nodes (48): daggerheartComputeRegister, dnd35eComputeRegister, dnd5e2014ComputeRegister, dnd5e2024ComputeRegister, COMPUTE_REGISTERS, registerForSystem(), mam3eComputeRegister, MUTATION_ANCHORS (+40 more)

### Community 72 - "Dice Panel & Mam3e Resolution"
Cohesion: 0.07
Nodes (30): counterStore, latencyBudgetsFromEnv(), positiveEnv(), rateLimiterFromEnv(), sessionBudgetFromEnv(), anthropicAdapter, googleAdapter, ProviderRegistryDeps (+22 more)

### Community 73 - "System Validation Logic"
Cohesion: 0.11
Nodes (35): ABILITY_KEYS, DND5E_ASI_LEVELS_BY_CLASS, DND5E_BASE_ASI_LEVELS, DND5E_MULTICLASS_PREREQ, dnd5eAsiSlotsGranted(), validateDnd5eBuild(), dnd5eKnownSpellLimit(), dnd5eKnownSpellOverage() (+27 more)

### Community 74 - "Spell Catalog Consistency Tests"
Cohesion: 0.08
Nodes (43): ALL_SYSTEMS, ALLOWED_BY_ID, ALLOWLIST, allowlistHits, auditCitation(), auditRulesLayerLiterals(), CATEGORY_LOADERS, cleared (+35 more)

### Community 75 - "Dnd5e Resource Loading Hooks"
Cohesion: 0.17
Nodes (24): ATTRIBUTES, getDaggerheartSheetState(), GetDaggerheartSheetStateProps, matchesQuery(), UseDaggerheartSheetResourcesProps, UseDaggerheartTemplateHandlersProps, DaggerheartAdversaryRole, DaggerheartAncestry (+16 more)

### Community 76 - "Mam Powers & Cost Ledger"
Cohesion: 0.15
Nodes (14): MamArchetypeBrowser, MamArchetypesTabComponent, Props, formatMamPowerAction(), formatMamPowerDuration(), formatMamPowerRange(), humanizeMamToken(), MamPowerBrowserTabComponent (+6 more)

### Community 78 - "Dnd5e Feature Options"
Cohesion: 0.13
Nodes (24): appendBulletList(), applyDnd5eFeatureOptionSelection(), ClassLevelLike, DND5E_FEATURE_OPTION_GROUP_LABELS, DND5E_FEATURE_OPTION_SOURCE_LABELS, DOMAIN_SUBCLASS_IDS, featureIdForOption(), FeatureOptionState (+16 more)

### Community 79 - "Document Migrations & Storage"
Cohesion: 0.08
Nodes (38): cloneDocumentsSnapshot(), documentsChanged(), engineLoadErrorMessage(), prepareDocumentsWithEngines(), prepareDocumentWithEngine(), unresolvedEngineSystemIds(), useDocuments(), withPreparedDocuments() (+30 more)

### Community 80 - "App Header & Auth UI"
Cohesion: 0.36
Nodes (7): ThemeToggle(), applyTheme(), getSystemTheme(), isTheme(), Theme, useTheme(), VALID_THEMES

### Community 82 - "HP & Spell Slot Trackers"
Cohesion: 0.07
Nodes (30): AI_GATEWAY_ENDPOINT, aiFailure, AiImageInput, AiRequest, EncounterDraftCandidate, EncounterDraftData, IdentifyCreatureData, SceneNarrationData (+22 more)

### Community 84 - "Boundary Validation Tests"
Cohesion: 0.24
Nodes (19): NOW, parseImg(), validDocInput(), coerceDate(), coerceObjectives(), coerceQuests(), coerceSceneMapReference(), coerceSessionLog() (+11 more)

### Community 85 - "capabilityScenarios.test.tsx"
Cohesion: 0.60
Nodes (3): formatModifierCost(), MamPowerModifierBrowser(), MamPowerModifierBrowserProps

### Community 86 - "Equipment & Feature Browsers"
Cohesion: 0.12
Nodes (25): MARKER_EFFECT_OPTIONS, markerEffectHelp(), MarkerEffectOption, MarkerEffectPreset, terrainEffectsForPreset(), MarkerPanel(), MarkerPanelProps, terrainBadgeIcon() (+17 more)

### Community 87 - "Pf2e Engine & Constants"
Cohesion: 0.09
Nodes (20): GapLedgerItem, LedgerPhase, LedgerStatus, LedgerTag, LedgerTrack, MASTER_GAP_LEDGER, RFC-003, byPhase (+12 more)

### Community 88 - "Documents Hook & Persistence"
Cohesion: 0.17
Nodes (22): toContributionLedger(), MamPowersTab(), ModifierColumn(), ModifierColumnProps, buildMam3eContributionLedger(), buildMam3ePowerCostEffects(), buildMam3ePowerCostLedgerEntries(), createPowerCostEffect() (+14 more)

### Community 89 - "Daggerheart Contribution Ledger"
Cohesion: 0.06
Nodes (59): BuildDaggerheartCombatantResult, RANGE_CELLS, ANCESTRY_ADJUSTMENTS_BY_ID, ancestryByName, classByName, DAGGERHEART_TIER_BREAKPOINTS, DAGGERHEART_TRAITS, DaggerheartAncestryAdjustments (+51 more)

### Community 90 - "Dnd35e/Pf1e Derived Math"
Cohesion: 0.12
Nodes (19): ABILITIES, DEFENSES, MamAbilitiesTab(), Props, MamComplicationBrowser, MamComplicationsTabComponent, Props, MamHeader() (+11 more)

### Community 91 - "Mam Browser Tabs"
Cohesion: 0.04
Nodes (87): EncounterDraftSelection, draftEncounterWithAi(), identifyCreatureWithAi(), draftEncounter(), MakeGameEncounter, MakeGameParams, MakeGamePartyMemberRequest, MakeGameStepId (+79 more)

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

### Community 97 - "Mam3e Derived Math"
Cohesion: 0.13
Nodes (18): BuildCharacterCombatantResult, normalizeSheet(), readArmorClass(), toMagicBonusItems(), toModifierSources(), AttackEconomy, bestAttackAbility(), D20_PROFILES (+10 more)

### Community 98 - "Doc Drift Tests"
Cohesion: 0.06
Nodes (20): BLOCKING_IMPACTS, createCharacterForSystem(), expectNoBlockingViolations(), freezeAnimations(), getCharacterNameInput(), KNOWN_A11Y_DEBT, openLandingPage(), RFC-004 (+12 more)

### Community 99 - "Spell Catalog Parity Tests"
Cohesion: 0.11
Nodes (5): DND35E_SOURCE_BLOCKED_SPELL_IDS, fieldCoverageBaselines, PF1E_SOURCE_ROWS_WITHOUT_SAVING_THROW, SpellModule, spellModules

### Community 100 - "Pf2e Spell Types & Traits"
Cohesion: 0.10
Nodes (26): CombatStatCard(), Props, Props, SheetHeader(), PresentedDerivedQuantity, ComputeLayer, DerivedDisplay, DerivedQuantityCase (+18 more)

### Community 101 - "Document Storage (IndexedDB)"
Cohesion: 0.16
Nodes (20): getDaggerheartAncestryAdjustments(), applyDaggerheartAncestryTemplate(), applyDaggerheartClassTemplate(), applyDaggerheartCommunityTemplate(), classTemplateItems(), communityTemplateItems(), DaggerheartInventoryEntry, DEFAULTS (+12 more)

### Community 102 - "5e Monster Encoder"
Cohesion: 0.22
Nodes (15): ABILITY_BY_INDEX, ALIGNMENTS, bucketFor(), CREATURE_TYPES, DAMAGE_TYPES, main(), mapAction(), mapAlignment() (+7 more)

### Community 103 - "Knip Lint Config"
Cohesion: 0.17
Nodes (15): mam3eAfflictionDC(), mam3eAttackDC(), mam3eAttackHits(), mam3eCriticalDC(), mam3eDamageResistanceDC(), mam3eDegreesOfFailure(), mam3eDegreesOfSuccess(), mam3eEquipmentPoints() (+7 more)

### Community 104 - "PF2e Monster Encoder"
Cohesion: 0.23
Nodes (14): ALIGNMENT_ABBREV, bucketFor(), CREATURE_TYPES, DAMAGE_TYPES, main(), mapAttack(), normalizeName(), parseDamage() (+6 more)

### Community 105 - "AI Creature Identification"
Cohesion: 0.10
Nodes (15): baseAuthValue, mockedClearQueuedCampaignsSnapshot, mockedClearQueuedDeletedCampaignIds, mockedDeleteRemoteCampaign, mockedFetchRemoteCampaigns, mockedGetQueuedCampaignsSnapshot, mockedGetQueuedDeletedCampaignIds, mockedGetSyncTombstonedIds (+7 more)

### Community 106 - "Character Card Presenter"
Cohesion: 0.09
Nodes (25): DragContext, NO_HANDLERS, useDragContext(), DragLayer, DragLayerProps, DragProvider(), toSample(), DragContextValue (+17 more)

### Community 107 - "Oracle Panel & Logic"
Cohesion: 0.38
Nodes (10): CharacterCard(), asNumber(), asRecord(), asString(), getClassLabel(), getDocumentLevelValue(), getHitPointLabel(), getLevelLabel() (+2 more)

### Community 108 - "5e Equipment Tab"
Cohesion: 0.29
Nodes (18): loadDocumentsAsync(), hydrateDoc(), idbClearDocuments(), idbClearScenes(), idbHasMigrated(), idbHasMigratedScenes(), idbLoadDocuments(), idbLoadScenes() (+10 more)

### Community 109 - "Scene Reaction Panel"
Cohesion: 0.14
Nodes (19): compareSpells(), D20SpellsTab(), formatSpellLevel(), titleCase(), Pf2eSpellsTab, Pf2eSpellsTabComponent, Props, Pf2eSpellcasting (+11 more)

### Community 110 - "Document Signature Hashing"
Cohesion: 0.08
Nodes (35): FeaturesSection(), Props, ArmorClassCharacter, casterTypes, classResourcesNeeded, classTags, getEligibleDnd5eFeatureOptions(), featureOptionSelectionKey() (+27 more)

### Community 111 - "Resource Pool Tracking"
Cohesion: 0.03
Nodes (95): resolvePf2eArmorClass(), resolveCharacterLedger(), computePf2eAC(), collectPf2eCheckConditionEffects(), collectPf2eConditionEffects(), ConditionScope, getPf2eConditionStatusPenalty(), highestValue() (+87 more)

### Community 112 - "Bundle Size Check"
Cohesion: 0.05
Nodes (32): appChunk, appChunks, assetsDir, budgets, chunkForModule, chunkGraph, chunkGraphPath, chunks (+24 more)

### Community 113 - "AI Prompt Builders"
Cohesion: 0.16
Nodes (19): AI_GATEWAY_TASKS, CharacterDraftCandidate, CharacterDraftPayload, EncounterDraftPayload, IdentifyCreaturePayload, IllustrateScenePayload, SceneNarrationPayload, buildCharacterDraftPrompt() (+11 more)

### Community 114 - "5e Feat Browser"
Cohesion: 0.19
Nodes (12): categoryIcons, GameSystemSelector(), GameSystemSelectorProps, systemAccents, supportBadgeLabels, supportBadgeStyles, buildInitialSummaryStates(), categoryDisplay (+4 more)

### Community 115 - "Project Dependencies"
Cohesion: 0.09
Nodes (23): ai, @ai-sdk/anthropic, @ai-sdk/google, class-variance-authority, clsx, lucide-react, dependencies, ai (+15 more)

### Community 116 - "Dnd5eEquipmentTab.tsx"
Cohesion: 0.11
Nodes (15): CurrencyEditor, CurrencyEditorProps, Dnd5eEquipmentTabComponent, EquipmentBrowser, EquipmentBrowserItem, EquipmentBrowserProps, EquippedItemsSection, EquippedItemsSectionProps (+7 more)

### Community 117 - "check-mam-equipment-provenance.mjs"
Cohesion: 0.13
Nodes (11): byId, byName, failures, manifest, manifestByName, originalSources, root, seenSrdNames (+3 more)

### Community 118 - "dnd5eToolChoices.ts"
Cohesion: 0.15
Nodes (13): ArtisanToolProficiency, GamingSetProficiency, MusicalInstrumentProficiency, ChoiceSlot, Dnd5eSpeciesSection(), Props, DND5E_ARTISAN_TOOL_OPTIONS, DND5E_GAMING_SET_OPTIONS (+5 more)

### Community 119 - "MAM Archetype Browser"
Cohesion: 0.27
Nodes (11): CLASS_TOKENS, d20srdUrl(), FILES, main(), mapCastingTime(), mapDuration(), mapRange(), normalizeName() (+3 more)

### Community 120 - "PF1e Spell Encoder"
Cohesion: 0.27
Nodes (11): CLASS_COLUMNS, main(), mapCastingTime(), mapDuration(), mapRange(), RFC-4180, normalizeName(), parseCsv() (+3 more)

### Community 122 - "PF2e Archetypes Tab"
Cohesion: 0.10
Nodes (36): SceneAreaEffectOutcome, SceneAttackOutcome, SceneRoundOutcome, RoundCombatant, RoundResult, RoundTurnRecord, runCombatRound(), RunRoundInput (+28 more)

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

### Community 127 - "encode-35e-feats.mjs"
Cohesion: 0.26
Nodes (12): ABILITY_BY_TOKEN, BUCKET_BY_TYPE, EXPORT_BY_BUCKET, main(), normalizeName(), parseSections(), slug(), splitTopLevel() (+4 more)

### Community 128 - "Toast Notifications"
Cohesion: 0.09
Nodes (33): acceptGridGeometryProposal(), BOX_KINDS, CellRect, COVER_PRESETS, deriveGridFromRegistration(), GridBoxKind, GridBoxProposal, GridGeometryAcceptance (+25 more)

### Community 129 - "Daggerheart Sheet Automation"
Cohesion: 0.08
Nodes (34): CreationWizard(), CreationWizardProps, framedSteps(), severityWeight(), ValidationSummary(), CreationWizardHostProps, buildDocumentFromPlanIds(), buildWorkingDocument() (+26 more)

### Community 130 - "legality/pf2e.ts"
Cohesion: 0.24
Nodes (8): ABILITY_KEYS, TIER_BONUS, validatePf2eBuild(), BuildLegalityResult, BuildViolation, doc(), engine, TEST_DATE

### Community 131 - "Retry With Backoff"
Cohesion: 0.08
Nodes (34): Doc, useSync(), UseSyncOptions, baseAuthValue, mockedClearQueuedDeletedDocumentIds, mockedClearQueuedSyncSnapshot, mockedDeleteRemoteDocument, mockedFetchRemoteDocuments (+26 more)

### Community 132 - "2024 Spell Encoder"
Cohesion: 0.39
Nodes (8): main(), mapCastingTime(), mapDuration(), mapRange(), normalizeName(), SCHOOLS, slug(), ts()

### Community 133 - "MAM Power Browser"
Cohesion: 0.09
Nodes (25): CombatTogglesSection(), Props, Condition, ConditionPicker(), Props, D20_LEGACY_CONDITION_NAMES, D20FeatsTab(), FeatEntry (+17 more)

### Community 134 - "Spell Validation Checks"
Cohesion: 0.28
Nodes (7): collectRawSpells(), getRawSpellById(), getVariantFingerprint(), SpellModule, spellModules, stableFingerprintValue(), VALID_SCHOOLS

### Community 136 - "TS Node Config"
Cohesion: 0.20
Nodes (9): compilerOptions, allowSyntheticDefaultImports, composite, forceConsistentCasingInFileNames, module, moduleResolution, skipLibCheck, include (+1 more)

### Community 137 - "TS Test Config"
Cohesion: 0.10
Nodes (20): e2e/**/*, ES2022, playwright.config.ts, vite/client, vitest.config.ts, vitest/globals, compilerOptions, lib (+12 more)

### Community 138 - "syncTombstones.ts"
Cohesion: 0.31
Nodes (11): NOW, getSyncTombstonedIds(), getSyncTombstones(), pruneExpired(), readStored(), recordSyncTombstones(), removeSyncTombstones(), STORAGE_KEYS (+3 more)

### Community 139 - "Prettier Config"
Cohesion: 0.22
Nodes (8): arrowParens, endOfLine, overrides, printWidth, semi, singleQuote, tabWidth, trailingComma

### Community 140 - "pf2eConditions.ts"
Cohesion: 0.14
Nodes (18): Props, UseDnd5eTemplateHandlersProps, Pf2eArchetypesTab(), Props, HERO_POINT_PIPS, Props, GetPf2eSheetChoiceStateProps, Pf2eChoiceSlot (+10 more)

### Community 141 - "useDnd5eTemplateHandlers.ts"
Cohesion: 0.26
Nodes (9): applyDnd5eClassTemplate(), createClassLevel(), removeDnd5eClassTemplate(), createDnd5eCreationPlan(), Dnd5eLikeDataModel, useDnd5eTemplateHandlers(), averageHitDieRoll(), hitDieFaces() (+1 more)

### Community 142 - "TS Base Config"
Cohesion: 0.27
Nodes (5): D20Roll, DualityRoll, rollDuality(), createLiveRng(), Rng

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
Cohesion: 0.43
Nodes (5): getEditableTarget(), KeyboardShortcut, useKeyboardNavigation(), Harness(), HarnessProps

### Community 147 - "Dnd5eEquipmentTab.tsx"
Cohesion: 0.05
Nodes (53): LegalActionCost, LegalActionDescriptor, LegalActionList, LegalActionsContext, SystemLegalActionsProvider, addAttackOfOpportunity(), addAttacks(), addCombatActions() (+45 more)

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
Cohesion: 0.06
Nodes (44): AppContent(), buildNewCharacterDocument(), cloneSystemData(), CreationWizardHost, LegalNotices, SceneManager, STORAGE_WARNING_THRESHOLD, AppHeader() (+36 more)

### Community 154 - "Dnd5eEquipmentTab.tsx"
Cohesion: 0.15
Nodes (18): createSupabaseJwtVerifier(), decodeBase64Url(), decodeJsonSegment(), fail(), resolveGatewayAuth(), SupabaseJwtVerifier, b64url(), mintToken() (+10 more)

### Community 155 - "5e Movement Rules"
Cohesion: 0.11
Nodes (16): AuthContextValue, EntitySyncAdapter, reportSyncFailure(), useEntitySync(), UseEntitySyncOptions, baseAuthValue, Item, authValue (+8 more)

### Community 156 - "CharacterListView.tsx"
Cohesion: 0.43
Nodes (6): DeferredInstallPromptEvent, isStandaloneMode(), readDismissedState(), usePwaInstallPrompt(), UsePwaInstallPromptOptions, writeDismissedState()

### Community 158 - "MAM Complication Browser"
Cohesion: 0.20
Nodes (23): validatePf1eBuild(), ABILITY_SCORE_IDS, addIssue(), addNonOpenSourceIssue(), consumeBuildLegality(), isIntegerInRange(), legalityRulePath(), loadValidationData() (+15 more)

### Community 161 - "PF2e Backgrounds Data"
Cohesion: 0.17
Nodes (27): addIssue(), CLASS_PROGRESSION_RANKS, createPf2eValidator(), isIntegerInRange(), loadValidationData(), PF2E_ABILITY_IDS, Pf2eValidationData, toIdMap() (+19 more)

### Community 177 - "characterDraftFlow.test.ts"
Cohesion: 0.06
Nodes (45): CharacterDraftApplier, collectUnknownIdIssues(), DocumentValidator, DraftCharacterParams, DraftCharacterResult, draftCharacterWithAi(), GatewayCall, POOL_LIST_FIELDS (+37 more)

### Community 180 - "daggerheart/validation.ts"
Cohesion: 0.24
Nodes (21): getDaggerheartStartingTraitArray(), addIssue(), buildLookup(), createDaggerheartValidator(), CUSTOM_INVENTORY_PREFIXES, DaggerheartValidationData, isIntegerInRange(), NamedEntry (+13 more)

### Community 181 - "useEntitySync.ts"
Cohesion: 0.16
Nodes (17): Mode, SignIn(), SignInProps, UserMenu(), UserMenuProps, useAuth(), SyncState, mockedGetQueuedCampaignsSnapshot (+9 more)

### Community 182 - "syncTombstones.ts"
Cohesion: 0.11
Nodes (24): BreakdownRow, buildRows(), ContributionBreakdown(), formulaOf(), Props, toRow(), RFC-003, effectToLedgerEntry() (+16 more)

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
Cohesion: 0.26
Nodes (18): validateDnd35eBuild(), addIssue(), appendBuildLegalityIssues(), createDnd35eValidator(), Dnd35eValidationData, isIntegerInRange(), loadValidationData(), RFC-002 (+10 more)

### Community 190 - "index.ts"
Cohesion: 0.18
Nodes (14): SheetAddHandlers, SheetDispatch, SheetDispatchRegistry, SheetDispatchRegistryContext, SheetDispatchState, SheetDispatchStateContext, useSheetDispatch(), Consumer() (+6 more)

### Community 191 - "retryWithBackoff"
Cohesion: 0.18
Nodes (21): MamAdvantageBrowserTab(), Props, addIssue(), createMam3eValidator(), engine, Mam3eValidationData, SPENT_BUCKETS, validateAdvantages() (+13 more)

### Community 194 - "@types/react-dom"
Cohesion: 0.03
Nodes (47): LegalActionEligibility, LegalActionTarget, SheetProps, SystemCreatorComponent, SystemCreatorProps, SystemDefinition, SystemSheetComponent, SystemValidator (+39 more)

### Community 198 - "@testing-library/user-event"
Cohesion: 0.27
Nodes (9): makeScene(), campaignSignatureFor(), sameCampaignSignatures(), sameDocumentSignatures(), sameSceneSignatures(), sameSignatureMultisets(), sceneSignatureFor(), signatureFor() (+1 more)

### Community 202 - "phase3-workflows.spec.ts"
Cohesion: 0.29
Nodes (11): extractJsArray(), field(), main(), MODULES, parseEntries(), prettierBin(), readSource(), slug() (+3 more)

### Community 208 - "gateBudget.test.tsx"
Cohesion: 0.08
Nodes (24): AllegianceChip(), AllegianceChipProps, PendingMonster, SceneDropController(), useDropTarget(), SceneDispatchContext, SceneEmit, useSceneDispatch() (+16 more)

### Community 212 - "aiSdkAdapter.test.mts"
Cohesion: 0.07
Nodes (27): AiSdkAdapterConfig, createAiSdkAdapter(), IMAGE_TASKS, RFC-002, TASK_SCHEMAS, ENCOUNTER_PAYLOAD, RFC-002, promptText() (+19 more)

### Community 213 - "spikeViewport.ts"
Cohesion: 0.43
Nodes (6): rect, clampCoordinate(), invertPoint(), Rect, Viewport, zoomToCursor()

## Knowledge Gaps
- **1468 isolated node(s):** `semi`, `singleQuote`, `trailingComma`, `printWidth`, `tabWidth` (+1463 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **18 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `CharacterDocument` connect `System Registry & Renderer` to `Sheet Resource Loading Hooks`, `Daggerheart Sheet Automation`, `legality/pf2e.ts`, `Retry With Backoff`, `Dnd5e2024 Engine & Hit Dice`, `MAM Power Browser`, `Daggerheart Engine`, `Dnd5e Background Templates`, `Dnd5e Equipment & Features UI`, `Scene Combat Resolution`, `pf2eConditions.ts`, `Dnd5e Activity Definitions`, `useDnd5eTemplateHandlers.ts`, `Dnd5e Feat Templates`, `D20 Combat Controls`, `Game System Selector`, `Dnd5eEquipmentTab.tsx`, `D20 Legacy System Engines`, `Dnd35e Saves & Data Model`, `Daggerheart Data Model`, `ServiceWorkerUpdateBanner.tsx`, `Daggerheart Inventory`, `Pf2e Character Templates`, `Dnd5e Feature List Sections`, `Encounter & Initiative Panels`, `MAM Complication Browser`, `Class Enhancement & Headers`, `PF2e Backgrounds Data`, `Currency & Inventory Editors`, `Document Sync Engine`, `Check & Oracle Resolution`, `Equipped Armor Section`, `Spell Browser UI`, `Encounter Builder Logic`, `characterDraftFlow.test.ts`, `D20 Legacy Templates`, `daggerheart/validation.ts`, `Spell Preparation Logic`, `syncTombstones.ts`, `SRD Manifest Generator`, `Daggerheart Combatant Builders`, `dnd35e/validation.ts`, `D20 Legacy Spell Slots`, `retryWithBackoff`, `@types/react-dom`, `Character Effects Compilation`, `@testing-library/user-event`, `System Validation Logic`, `Dnd5e Resource Loading Hooks`, `Dnd5e Feature Options`, `Document Migrations & Storage`, `gateBudget.test.tsx`, `Boundary Validation Tests`, `Equipment & Feature Browsers`, `Documents Hook & Persistence`, `Daggerheart Contribution Ledger`, `Dnd35e/Pf1e Derived Math`, `Mam Browser Tabs`, `Mam3e Derived Math`, `Document Storage (IndexedDB)`, `Knip Lint Config`, `Oracle Panel & Logic`, `5e Equipment Tab`, `Document Signature Hashing`, `Resource Pool Tracking`?**
  _High betweenness centrality (0.142) - this node is a cross-community bridge._
- **Why does `GameSystemId` connect `Class Enhancement & Headers` to `Sheet Resource Loading Hooks`, `Daggerheart Sheet Automation`, `Dnd5e Sheets & E2E Tests`, `Dnd5e2024 Engine & Hit Dice`, `Scene Combat Resolution`, `System Compute Registers`, `pf2eConditions.ts`, `useDnd5eTemplateHandlers.ts`, `App Shell & Layout`, `Game System Selector`, `Dnd5eEquipmentTab.tsx`, `System Registry & Renderer`, `ServiceWorkerUpdateBanner.tsx`, `Roadmap Metrics Generator`, `Dnd5e Feature List Sections`, `Pf2e Sheet Tabs`, `Currency & Inventory Editors`, `Document Sync Engine`, `Check & Oracle Resolution`, `Doc Drift Rules`, `Spell Browser UI`, `Encounter Builder Logic`, `characterDraftFlow.test.ts`, `D20 Legacy Templates`, `Character Combatant Builder`, `AI Gateway Adapters`, `SRD Coverage Script`, `Browser Compat & Error Logging`, `Character Effects Compilation`, `Spell Catalog Consistency Tests`, `Dnd5e Resource Loading Hooks`, `Mam Browser Tabs`, `Mam3e Derived Math`, `Document Signature Hashing`, `5e Feat Browser`?**
  _High betweenness centrality (0.055) - this node is a cross-community bridge._
- **Why does `entry()` connect `Daggerheart Inventory` to `Dnd5e Background Templates`, `Tabs UI Component`, `Node Runtime Bootstrap`, `syncTombstones.ts`, `Dnd5eEquipmentTab.tsx`, `ServiceWorkerUpdateBanner.tsx`, `AI Encounter Drafting`, `Doc Drift Rules`, `Encounter Builder Logic`, `D20 Legacy Templates`, `daggerheart/validation.ts`, `syncTombstones.ts`, `AI Gateway Contracts`, `fake-indexeddb`, `Mam Character Sheet Tabs`, `Dnd5e Resource Loading Hooks`, `Dnd5e Feature Options`, `Daggerheart Contribution Ledger`, `Pf2e Spell Data Encoder`, `5e Monster Encoder`, `Document Signature Hashing`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **What connects `semi`, `singleQuote`, `trailingComma` to the rest of the system?**
  _1468 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Sheet Resource Loading Hooks` be split into smaller, more focused modules?**
  _Cohesion score 0.0581140350877193 - nodes in this community are weakly interconnected._
- **Should `Dnd5e Background Templates` be split into smaller, more focused modules?**
  _Cohesion score 0.05875251509054326 - nodes in this community are weakly interconnected._
- **Should `Dnd5e2024 Engine & Hit Dice` be split into smaller, more focused modules?**
  _Cohesion score 0.04085045389393215 - nodes in this community are weakly interconnected._