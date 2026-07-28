# Graph Report - windsurf-project  (2026-07-28)

## Corpus Check
- 918 files · ~764,200 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 5938 nodes · 17179 edges · 214 communities (197 shown, 17 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 168 edges (avg confidence: 0.72)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e517a1cf`
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
- sceneTerrain.ts
- @vitest/coverage-v8
- sceneStorageIDB.test.ts
- @testing-library/user-event
- derivation/index.ts
- systemAssetPrefetch.ts
- characterCombatant.test.ts
- phase3-workflows.spec.ts
- aiSdkAdapter.test.mts
- Dnd5eRiderTogglesSection.tsx
- ConditionPicker.tsx
- Dnd5eNotesTab.tsx
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
- `mapDamageList()` --indirect_call--> `entry()`  [INFERRED]
  scripts/encode-5e-monsters.mjs → src/__tests__/components/ContributionBreakdown.test.tsx
- `Dnd5eNotesTab()` --indirect_call--> `field()`  [INFERRED]
  src/systems/dnd5e/shared/components/Dnd5eNotesTab.tsx → scripts/encode-daggerheart-adversaries.mjs

## Import Cycles
- None detected.

## Communities (214 total, 17 thin omitted)

### Community 0 - "Sheet Resource Loading Hooks"
Cohesion: 0.09
Nodes (54): ancestryPool(), backgroundPool(), classPool(), loadCharacterDraftPools(), NamedEntity, toCandidates(), RFC-002, useDaggerheartSheetResources() (+46 more)

### Community 1 - "Dnd5e Sheets & E2E Tests"
Cohesion: 0.13
Nodes (20): SummaryState, CREATED_AT, UPDATED_AT, SystemCatalogSummary, SystemContentCategoryId, SystemContentReachability, SystemContentSummary, SystemSupportLevel (+12 more)

### Community 2 - "Dnd5e Equipment & Features UI"
Cohesion: 0.08
Nodes (44): resolveD20LegacyArmorClass(), contextWithConditionIds(), resolveCharacterEffects(), computeD20LegacyAC(), dnd35eAbilityIncreases(), dnd35eConcentrationDCDamage(), dnd35eConcentrationDCDefensive(), dnd35eFeatsFromLevel() (+36 more)

### Community 3 - "Dnd5e Background Templates"
Cohesion: 0.06
Nodes (65): countSelections(), optionDisabledForRequirement(), resolveEquipmentSlot(), resolveFeatSelections(), toEquippedItem(), toWeaponDamage(), ABILITY_NAME_TO_ID, ABILITY_OPTIONS (+57 more)

### Community 4 - "Dnd5e2024 Engine & Hit Dice"
Cohesion: 0.07
Nodes (28): HIT_DICE, hitDieSize(), hitDieString(), Dnd5e2024Engine, hasAlertFeat(), totalCharacterLevel(), DND5E_CONDITION_NAMES, hasDnd5eCondition() (+20 more)

### Community 5 - "Daggerheart Engine"
Cohesion: 0.08
Nodes (51): applyDnd5eClassTemplate(), applyDnd5eSubclassTemplate(), assertMulticlassRequirements(), ATTRIBUTE_NAME_TO_ID, buildChoiceSlots(), buildDerivedProficiencies(), buildSpellcastingState(), canSelectSubclass() (+43 more)

### Community 6 - "3.5e Monster Data Encoder"
Cohesion: 0.06
Nodes (56): ALIGNMENTS, DICE_PROGRESSIONS, main(), mapAlignment(), MONSTER_SIZE, normalizeName(), OLIMOT_FILES, resolveSizeRoll() (+48 more)

### Community 7 - "Tabs UI Component"
Cohesion: 0.05
Nodes (62): Badge(), BadgeProps, badgeVariants, TABLIST_NAV_KEYS, Tabs, TabsContent, TabsContentProps, TabsContext (+54 more)

### Community 8 - "Node Runtime Bootstrap"
Cohesion: 0.09
Nodes (49): main(), runBootstrapNodeInstall(), getPinnedCommandArgs(), main(), runPinnedNpmCommand(), formatRuntimeDoctorReport(), main(), readWorkflowPinSource() (+41 more)

### Community 9 - "Scene Combat Resolution"
Cohesion: 0.04
Nodes (89): buildScene(), BuildEncounterEventsResult, footprintWithinGrid(), isOracleAnswer(), isOracleOdds(), resolveOracle(), appendSceneEvent(), applyHitPointDelta() (+81 more)

### Community 10 - "Dnd5e Class Templates"
Cohesion: 0.19
Nodes (20): makeAsset(), hostileStorage, clearMapAssetStorage(), createMapAsset(), CreateMapAssetResult, deleteMapAsset(), isMapAssetShape(), isRecord() (+12 more)

### Community 11 - "System Compute Registers"
Cohesion: 0.11
Nodes (29): DockPanel(), systemLabel(), D20SpellBrowserPanelComponent, Props, SpellBrowser, toSpellBrowserSpell(), Pf2eSpellBrowserPanel, Pf2eSpellBrowserPanelComponent (+21 more)

### Community 12 - "Scene Check Panel"
Cohesion: 0.18
Nodes (12): BrowserCapabilities, checkBrowserCapabilities(), initBrowserCompat(), isBrowserSupported(), showCompatibilityWarning(), ErrorCategory, ErrorLog, ErrorLogger (+4 more)

### Community 13 - "Dnd5e Activity Definitions"
Cohesion: 0.10
Nodes (26): buildDefenseStyleActivity(), buildDivineSmiteActivities(), buildDivineSmiteActivity(), buildDnd5eActivityDefinitions(), buildUnsupportedDivineSmiteActivity(), divineSmiteSlotLevel(), Dnd5eActivityCost, Dnd5eActivityCostKind (+18 more)

### Community 14 - "Monster & NPC Generator"
Cohesion: 0.06
Nodes (46): DragProvider, DragRoot(), isSceneDragEnabled(), FEATURE_FLAGS, FeatureFlag, FeatureFlagDefinition, isFeatureEnabled(), RingBuffer (+38 more)

### Community 15 - "Dnd5e Feat Templates"
Cohesion: 0.11
Nodes (20): AddEffectInput, buildBaseAttackBonusEffects(), buildD20LegacyContributionLedger(), buildSaveEffects(), buildSkillSynergyEffects(), createEffect(), D20LegacyClassLevelView, D20LegacySystemId (+12 more)

### Community 16 - "App Shell & Layout"
Cohesion: 0.11
Nodes (20): DockResources, focusPulseSpell, PF2E_DERIVED_TRAITS, PF2E_SCHOOL_TRAITS, PF2E_TRADITIONS, ExpectedSpellIdentity, iconicSpellExpectations, SystemKey (+12 more)

### Community 17 - "D20 Combat Controls"
Cohesion: 0.13
Nodes (21): Dnd5eTemplateState, AddEffectInput, AddEntryInput, buildAlwaysPreparedSpellParts(), buildArmorClassParts(), buildDnd5eContributionLedger(), buildFeatAutomationParts(), buildListEntry() (+13 more)

### Community 18 - "Game System Selector"
Cohesion: 0.08
Nodes (51): EquippedItemsSection(), Props, SLOT_LABELS, SLOT_ORDER, FeaturesSection(), Props, NormalizedSheet, ArmorClassCharacter (+43 more)

### Community 19 - "Combat & Recap Panels"
Cohesion: 0.17
Nodes (13): DEFAULT_LABELS, SpellBrowser(), SpellBrowserLabels, SpellBrowserProps, SpellBrowserSpell, Dnd5eSpellsTabComponent, Props, SpellBrowser (+5 more)

### Community 20 - "D20 Legacy System Engines"
Cohesion: 0.20
Nodes (22): getDaggerheartShortRestRecovery(), clampDaggerheartInventoryQuantity(), createDaggerheartInventoryEntry(), daggerheartInventoryDefinitions, inventoryDefinitionById, inventoryDefinitionByName, normalizeDaggerheartCurrency(), normalizeInteger() (+14 more)

### Community 21 - "Dnd35e Saves & Data Model"
Cohesion: 0.04
Nodes (57): Props, D20Save, D20SaveId, Props, SAVE_IDS, createDefaultDnd35eData(), Dnd35eClassLevel, Dnd35eDataModel (+49 more)

### Community 22 - "Daggerheart Data Model"
Cohesion: 0.40
Nodes (4): InventoryItem, InventoryManager(), InventoryManagerProps, existingItems

### Community 23 - "System Registry & Renderer"
Cohesion: 0.04
Nodes (44): conditionImposesDisadvantage(), dnd5eEditionOf(), Dnd5e2024Sheet(), Dnd5eSheet(), createDefaultDnd5eData(), Dnd5eEngine, DND5E_DERIVED_QUANTITIES, Dnd5eSheetBase() (+36 more)

### Community 24 - "Game Rules & Proficiencies"
Cohesion: 0.07
Nodes (34): GAME_RULES, ArmorProficiency, ArmorProficiencyType, ArtisanToolProficiency, GamingSetProficiency, isValidArmorProficiency(), isValidSkillProficiency(), isValidToolProficiency() (+26 more)

### Community 25 - "Campaign Sync Hooks"
Cohesion: 0.08
Nodes (29): InitiativeTracker(), InitiativeTrackerProps, mapImageLayerStyle(), ALLEGIANCE_COLORS, drawScene(), drawTokenChip(), MARKER_FILL, SceneCanvas (+21 more)

### Community 26 - "Daggerheart Inventory"
Cohesion: 0.10
Nodes (36): getDaggerheartAncestryAdjustments(), findDaggerheartInventoryDefinitionByName(), ancestryLookup, armorLookup, buildLookup(), classLookup, communityLookup, DEFAULTS (+28 more)

### Community 27 - "Pf2e Character Templates"
Cohesion: 0.11
Nodes (43): createPf2eCreationPlan(), abilityBoostValue(), ancestryFeatures(), applyAbilityAdjustments(), applyPf2eAncestryTemplate(), applyPf2eArchetypeTemplate(), applyPf2eBackgroundTemplate(), applyPf2eClassTemplate() (+35 more)

### Community 28 - "Roadmap Metrics Generator"
Cohesion: 0.06
Nodes (52): byId, byName, failures, manifest, manifestByName, originalSources, root, seenSrdNames (+44 more)

### Community 29 - "Dnd5e Feature List Sections"
Cohesion: 0.10
Nodes (34): mod(), DamageHealControl(), DamageHealControlProps, DiceRollButton(), DiceRollButtonProps, RollResult, ABILITIES, D20AbilitiesTab() (+26 more)

### Community 30 - "Encounter & Initiative Panels"
Cohesion: 0.07
Nodes (36): availablePf2eToggles(), validatePf2eBuild(), PF2E_CONDITIONS, PF2E_VALUED_CONDITIONS, Pf2eFeatsConditionsTab(), Props, Pf2eHeader(), Pf2eInventoryTab() (+28 more)

### Community 31 - "Class Enhancement & Headers"
Cohesion: 0.11
Nodes (27): useLazyResource(), useSystemOptions(), useD20LegacySheetResources(), Pf2eSpellsTab, usePf2eSheetResources(), loadValidationData(), loadArchetypesForSystem(), loadDnd35eEquipment() (+19 more)

### Community 32 - "Pf2e Sheet Tabs"
Cohesion: 0.05
Nodes (75): BuildDaggerheartAdversaryResult, DaggerheartAdversaryCombatant, RANGE_CELLS, CharacterEffectInputs, resolveCharacterLedger(), ResolvedCharacterEffects, compileBaseArmorClassEffects(), compileEquipmentEffects() (+67 more)

### Community 33 - "AI Encounter Drafting"
Cohesion: 0.06
Nodes (49): DEFAULT_QUICK_ROLLS, DicePanel(), DicePanelProps, formatBreakdown(), QUICK_ROLLS_BY_SYSTEM, DISPOSITION_BADGE, DISPOSITION_LABEL, ReactionHistoryEntry (+41 more)

### Community 34 - "Quest & Session Log UI"
Cohesion: 0.16
Nodes (22): QuestList(), STATUS_BADGE, STATUS_OPTIONS, DATE_FORMAT, Props, SessionLog(), T0, T1 (+14 more)

### Community 35 - "Currency & Inventory Editors"
Cohesion: 0.06
Nodes (57): ACTION_LIMIT_BOUNDARY, collectMam3eConditionEffects(), MAM3E_STATE_NOTES, mam3eToughnessPenalty(), ABILITIES, DEFENSES, MamAbilitiesTab(), Props (+49 more)

### Community 36 - "Document Sync Engine"
Cohesion: 0.06
Nodes (92): critModelForScene(), degreeModelForScene(), resolveSceneAreaEffect(), resolveSceneAttack(), runSceneRound(), SceneAreaEffectOutcome, SceneAttackOutcome, SceneRoundOutcome (+84 more)

### Community 37 - "Sheet Header & Stat Cards"
Cohesion: 0.24
Nodes (9): ToastContext, ToastContextValue, ToastItem, ToastProvider(), VARIANT_ICONS, VARIANT_STYLES, registerToastHandler(), ToastHandler (+1 more)

### Community 38 - "Check & Oracle Resolution"
Cohesion: 0.12
Nodes (10): @testing-library/jest-dom, registerAllSystems(), openBrokenSheet(), MockBeforeInstallPromptEvent, CreationOptions, goblin, loadMonstersForSystemMock, completeGuidedCreationFromDefaults() (+2 more)

### Community 39 - "Mam3e Data Model & Engine"
Cohesion: 0.05
Nodes (58): ProficiencyListSection(), Props, casterTypes, classResourcesNeeded, classTags, formatBackgroundToolLabel(), ChoiceSlot, Dnd5eBackgroundSection() (+50 more)

### Community 40 - "Doc Drift Rules"
Cohesion: 0.06
Nodes (57): DOC_DRIFT_MANIFEST, DocDriftRuleType, DocDriftSurface, DocDriftSurfaceKind, CAPABILITY_PHRASE_RULES, CapabilityPhraseRule, capitalizeSupportLevel(), COMMAND_RUNTIME_RULES (+49 more)

### Community 41 - "NPM Build Scripts"
Cohesion: 0.04
Nodes (56): scripts, analyze, bootstrap:node, build, check:bundle-size, check:compute-register, check:compute-register:mutate, check:compute-register:write (+48 more)

### Community 42 - "Condition Effects by System"
Cohesion: 0.09
Nodes (23): AllegianceChip(), AllegianceChipProps, PendingMonster, SceneDropControllerProps, getSceneTokenSize(), DraftEncounterParams, buildPlacedToken(), PlaceTokenInput (+15 more)

### Community 43 - "Equipped Armor Section"
Cohesion: 0.11
Nodes (25): EquipArmorInput, EquipEntry, EquippedArmorSection(), EquipShieldInput, Props, fullPlate, leather, steelShield (+17 more)

### Community 44 - "Spell Browser UI"
Cohesion: 0.10
Nodes (19): useDragSource(), BrowserFeat, Dock(), DockPanelProps, DockProps, EquipmentBrowser, EquipmentBrowserItem, EquipmentBrowserProps (+11 more)

### Community 45 - "Scene Combat Area Effects"
Cohesion: 0.17
Nodes (15): buildNotice(), FetchTarget, fetchValidated(), HTML_ENTITIES, looksLikeHtml(), main(), normalize(), noticePath (+7 more)

### Community 46 - "Error Boundary & Auth Context"
Cohesion: 0.10
Nodes (28): D20ClassesSection(), D20LegacyClassLevel, Props, renderClassOptions(), d20BonusSpells(), buildD20LegacySpellSlotTotals(), countAdvancementLevels(), D20_DOMAIN_CLASS_IDS (+20 more)

### Community 47 - "Encounter Builder Logic"
Cohesion: 0.13
Nodes (33): createD20LegacyCreationPlan(), applyAbilityAdjustments(), applyD20LegacyClassTemplate(), applyD20LegacyRaceTemplate(), buildClassSkills(), classFeaturesUpToLevel(), classSkillOptions(), collectClassFeatureSignatures() (+25 more)

### Community 48 - "Scene Management Hooks"
Cohesion: 0.11
Nodes (34): DebouncedPersistence, IMPORTANT: a begun generation must end in either `persist` or, useDebouncedPersistence(), mergeLoadedScenes(), useScenes(), NOW, makeSceneWithMap(), NOW (+26 more)

### Community 49 - "Monster Combatant Builder"
Cohesion: 0.04
Nodes (69): NarrateSceneResult, CheckPanel(), CheckPanelProps, DEFAULT_SUGGESTIONS, DND5E_SKILLS, OUTCOME_BADGE, OUTCOME_LABEL, SKILL_SUGGESTIONS_BY_SYSTEM (+61 more)

### Community 50 - "D20 Legacy Templates"
Cohesion: 0.14
Nodes (29): applyDnd5eLongRest(), applyDnd5eShortRest(), recoverAllSpellSlots(), recoverFeatures(), recoverLongRestHitDice(), recoverPactMagicSlots(), slotPool(), longRestPf2eSpellcasting() (+21 more)

### Community 51 - "Campaign Storage & Hooks"
Cohesion: 0.11
Nodes (27): Props, Props, useCampaigns(), UseCampaignSyncOptions, makeDoc(), makeScene(), Campaign, CAMPAIGNS_STORAGE_KEY (+19 more)

### Community 52 - "Spell Preparation Logic"
Cohesion: 0.16
Nodes (11): Mam3eSystemDef, RFC-003, createHero(), power(), TEST_DATE, createDocument(), legalBuild(), mam3eEngine (+3 more)

### Community 53 - "Dev Dependencies"
Cohesion: 0.04
Nodes (47): autoprefixer, @axe-core/playwright, eslint, eslint-config-prettier, @eslint/js, eslint-plugin-react, eslint-plugin-react-hooks, happy-dom (+39 more)

### Community 54 - "Character Combatant Builder"
Cohesion: 0.12
Nodes (21): AI_TASK_UNIT_COST, TaskGatewayCall, AnyTaskGatewayCall, createFlowBudget(), DEFAULT_MAKE_GAME_FLOW_BUDGET, FlowBudget, FlowBudgetLimits, FlowBudgetReport (+13 more)

### Community 56 - "SRD Manifest Generator"
Cohesion: 0.08
Nodes (54): appendInventoryFromBackground(), applyDnd5eBackgroundTemplate(), BackgroundChoiceSlot, BackgroundChoiceValue, backgroundDerivedState(), COMMON_LANGUAGE_OPTIONS, Dnd5eBackgroundTemplateSelections, Dnd5eLikeDataModel (+46 more)

### Community 57 - "Daggerheart Combatant Builders"
Cohesion: 0.11
Nodes (24): feat, item, monster, spell, EMPTY, useDockResources(), UseD20LegacySheetResourcesProps, UseDaggerheartSheetResourcesProps (+16 more)

### Community 58 - "AI Gateway Adapters"
Cohesion: 0.07
Nodes (40): AI_GATEWAY_SCHEMA_VERSION, aiFailure, AiFailureCode, AiResponse, AiTaskClass, GatewayContext, GatewayTimeoutError, handleAiRequest() (+32 more)

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
Cohesion: 0.12
Nodes (22): clampTrack(), DeathSaves, DeathSavesTracker(), Props, HitDiceTracker(), Props, Props, SLOT_LEVELS (+14 more)

### Community 64 - "Spells Tab Components"
Cohesion: 0.14
Nodes (24): SceneCombatStats, buildDaggerheartAdversaryCombatant(), buildMam3eCombatant(), actionReachCells(), ATTACK_COUNT_WORDS, averageDie(), buildMonsterCombatant(), dieFaces() (+16 more)

### Community 65 - "Browser Compat & Error Logging"
Cohesion: 0.15
Nodes (17): Props, State, LibraryBestiaryView(), LoadState, MonsterBrowser, MonsterBrowserProps, systemLabel(), RFC-004 (+9 more)

### Community 66 - "AI Gateway Client"
Cohesion: 0.18
Nodes (17): AbilityScoreGrid(), buildPointBuyDraft(), buildStandardArrayDraft(), clampPointBuyScore(), emptyPointBuyDraft(), emptyStandardArrayDraft(), isStandardArrayComplete(), isValidPointBuyDraft() (+9 more)

### Community 67 - "2024 Monster Data Encoder"
Cohesion: 0.16
Nodes (23): ABILITIES, ALIGNMENTS, bucketFor(), classifyImmunityList(), cleanProse(), CR_FRACTIONS, CREATURE_TYPES, DAMAGE_TYPES (+15 more)

### Community 68 - "Character Effects Compilation"
Cohesion: 0.09
Nodes (21): createDefaultDaggerheartData(), DaggerheartDataModel, DAGGERHEART_DERIVED_QUANTITIES, UseDaggerheartMutationHandlersProps, TEST_DATE, dhDoc(), DaggerheartDomainCardEntry, daggerheartPassiveAuditAttributes (+13 more)

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
Cohesion: 0.12
Nodes (35): ABILITY_KEYS, DND5E_ASI_LEVELS_BY_CLASS, DND5E_BASE_ASI_LEVELS, DND5E_MULTICLASS_PREREQ, dnd5eAsiSlotsGranted(), validateDnd5eBuild(), dnd5eKnownSpellLimit(), dnd5eKnownSpellOverage() (+27 more)

### Community 74 - "Spell Catalog Consistency Tests"
Cohesion: 0.08
Nodes (42): ALL_SYSTEMS, ALLOWED_BY_ID, ALLOWLIST, allowlistHits, auditCitation(), auditRulesLayerLiterals(), CATEGORY_LOADERS, cleared (+34 more)

### Community 75 - "Dnd5e Resource Loading Hooks"
Cohesion: 0.14
Nodes (24): EMPTY_WEAPON_LOADOUT, GetDaggerheartSheetStateProps, UseDaggerheartTemplateHandlersProps, DaggerheartAdversaryRole, DaggerheartAncestry, DaggerheartArmor, DaggerheartAutomationMode, DaggerheartClass (+16 more)

### Community 76 - "Mam Powers & Cost Ledger"
Cohesion: 0.13
Nodes (24): buildSystem(), CATEGORY_LOADERS, CategoryLoader, escape(), isRecord(), Loaded, main(), SystemConfig (+16 more)

### Community 78 - "Dnd5e Feature Options"
Cohesion: 0.09
Nodes (38): Dnd5eFeatureOptionsSection(), Dnd5eFeatureOptionsSectionComponent, FeatureOptionBrowser, FeatureOptionBrowserProps, featureOptionSelectionKey(), Props, FeatureOptionBrowser(), FeatureOptionBrowserProps (+30 more)

### Community 79 - "Document Migrations & Storage"
Cohesion: 0.08
Nodes (30): roundTrip(), makeStoredDocument(), setStoredDocuments(), reloadSingleDocument(), baseV2Document, NOTE: localStorage spies survive vi.restoreAllMocks in jsdom — restore manually., NOTE: localStorage spies survive vi.restoreAllMocks in jsdom — restore manually., reloadSingleDocument() (+22 more)

### Community 80 - "App Header & Auth UI"
Cohesion: 0.36
Nodes (7): ThemeToggle(), applyTheme(), getSystemTheme(), isTheme(), Theme, useTheme(), VALID_THEMES

### Community 82 - "HP & Spell Slot Trackers"
Cohesion: 0.09
Nodes (25): CharacterDraftChoice, CharacterDraftOutcome, AI_GATEWAY_ENDPOINT, AiRequest, SceneNarrationData, BY_DESIGN_FAILURE_CODES, callAiGateway(), isAiEnabled() (+17 more)

### Community 84 - "Boundary Validation Tests"
Cohesion: 0.18
Nodes (23): NOW, parseImg(), validDocInput(), CampaignObjective, CampaignQuest, CampaignQuestStatus, CampaignSessionEntry, coerceDate() (+15 more)

### Community 85 - "capabilityScenarios.test.tsx"
Cohesion: 0.60
Nodes (3): formatModifierCost(), MamPowerModifierBrowser(), MamPowerModifierBrowserProps

### Community 86 - "Equipment & Feature Browsers"
Cohesion: 0.15
Nodes (20): DIFFICULTY_COLUMN, DND35E_EL_VALUE, dnd35eCreatureValue(), dnd35eEncounterBudget(), draftEncounter(), ENCOUNTER_BUDGET_SYSTEMS, EncounterBudgetSystem, encounterPartyBudget() (+12 more)

### Community 87 - "Pf2e Engine & Constants"
Cohesion: 0.09
Nodes (20): GapLedgerItem, LedgerPhase, LedgerStatus, LedgerTag, LedgerTrack, MASTER_GAP_LEDGER, RFC-003, byPhase (+12 more)

### Community 88 - "Documents Hook & Persistence"
Cohesion: 0.10
Nodes (37): MamPowersTab(), ModifierColumn(), ModifierColumnProps, Props, buildMam3eContributionLedger(), buildMam3ePowerCostEffects(), buildMam3ePowerCostLedgerEntries(), createPowerCostEffect() (+29 more)

### Community 89 - "Daggerheart Contribution Ledger"
Cohesion: 0.07
Nodes (56): buildDaggerheartCombatant(), BuildDaggerheartCombatantResult, RANGE_CELLS, ANCESTRY_ADJUSTMENTS_BY_ID, ancestryByName, classByName, DAGGERHEART_TIER_BREAKPOINTS, DAGGERHEART_TRAITS (+48 more)

### Community 90 - "Dnd35e/Pf1e Derived Math"
Cohesion: 0.13
Nodes (22): buildEncounterSceneEvents(), buildInitiativeEntries(), buildOccupiedCells(), clampInteger(), compareTokenIds(), EncounterBuilderIssue, EncounterPartyMember, EncounterPlanEntry (+14 more)

### Community 91 - "Mam Browser Tabs"
Cohesion: 0.11
Nodes (26): EncounterDraftSelection, draftEncounterWithAi(), draftEncounter(), MakeGameEncounter, MakeGameParams, MakeGamePartyMemberRequest, MakeGameStepId, MakeGameSystemBinding (+18 more)

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
Cohesion: 0.21
Nodes (17): availableD20LegacyToggles(), presentDerivedQuantities(), D20LegacyData, D20LegacySpellSlots, recoverD20LegacySpellSlot(), resetD20LegacySpellSlots(), setD20LegacyPreparedSpell(), setD20LegacySpellSlotTotal() (+9 more)

### Community 97 - "Mam3e Derived Math"
Cohesion: 0.06
Nodes (43): buildCharacterCombatant(), BuildCharacterCombatantResult, CharacterCombatant, normalizeSheet(), readArmorClass(), toMagicBonusItems(), toModifierSources(), AttackEconomy (+35 more)

### Community 98 - "Doc Drift Tests"
Cohesion: 0.06
Nodes (20): BLOCKING_IMPACTS, createCharacterForSystem(), expectNoBlockingViolations(), freezeAnimations(), getCharacterNameInput(), KNOWN_A11Y_DEBT, openLandingPage(), RFC-004 (+12 more)

### Community 99 - "Spell Catalog Parity Tests"
Cohesion: 0.11
Nodes (5): DND35E_SOURCE_BLOCKED_SPELL_IDS, fieldCoverageBaselines, PF1E_SOURCE_ROWS_WITHOUT_SAVING_THROW, SpellModule, spellModules

### Community 100 - "Pf2e Spell Types & Traits"
Cohesion: 0.07
Nodes (33): CombatStatCard(), Props, BreakdownRow, buildRows(), ContributionBreakdown(), formulaOf(), Props, toRow() (+25 more)

### Community 101 - "Document Storage (IndexedDB)"
Cohesion: 0.13
Nodes (19): Pf2eSpellsTabComponent, Props, Pf2eSpellcasting, tierBonus(), CREATURE_XP_BY_LEVEL_DIFF, pf2eAttackModifier(), pf2eCreatureXP(), Pf2eDegree (+11 more)

### Community 102 - "5e Monster Encoder"
Cohesion: 0.22
Nodes (15): ABILITY_BY_INDEX, ALIGNMENTS, bucketFor(), CREATURE_TYPES, DAMAGE_TYPES, main(), mapAction(), mapAlignment() (+7 more)

### Community 103 - "Knip Lint Config"
Cohesion: 0.13
Nodes (18): artifactPath, attributeMutations, definitionDirs, root, sourceHash, sourcePath, systemsDir, violations (+10 more)

### Community 104 - "PF2e Monster Encoder"
Cohesion: 0.23
Nodes (14): ALIGNMENT_ABBREV, bucketFor(), CREATURE_TYPES, DAMAGE_TYPES, main(), mapAttack(), normalizeName(), parseDamage() (+6 more)

### Community 105 - "AI Creature Identification"
Cohesion: 0.08
Nodes (37): useCampaignSync(), baseAuthValue, mockedClearQueuedCampaignsSnapshot, mockedClearQueuedDeletedCampaignIds, mockedDeleteRemoteCampaign, mockedFetchRemoteCampaigns, mockedGetQueuedCampaignsSnapshot, mockedGetQueuedDeletedCampaignIds (+29 more)

### Community 106 - "Character Card Presenter"
Cohesion: 0.09
Nodes (21): DragContext, NO_HANDLERS, useDragContext(), DragLayer, DragLayerProps, DragProvider(), toSample(), DragContextValue (+13 more)

### Community 107 - "Oracle Panel & Logic"
Cohesion: 0.07
Nodes (51): CharacterDraftProposal, MakeGameCharacter, Props, CharacterCard(), CharacterCardProps, CharacterListView(), CharacterListViewProps, CharacterSortOption (+43 more)

### Community 108 - "5e Equipment Tab"
Cohesion: 0.29
Nodes (18): loadDocumentsAsync(), hydrateDoc(), idbClearDocuments(), idbClearScenes(), idbHasMigrated(), idbHasMigratedScenes(), idbLoadDocuments(), idbLoadScenes() (+10 more)

### Community 109 - "Scene Reaction Panel"
Cohesion: 0.21
Nodes (15): compareSpells(), D20SpellsTab(), formatSpellLevel(), Props, titleCase(), D20_ARCANE_SCHOOLS, buildSpellPreparationConcepts(), compareSpellEntries() (+7 more)

### Community 110 - "Document Signature Hashing"
Cohesion: 0.09
Nodes (31): getEligibleDnd5eFeatureOptions(), dnd5eCarryingCapacity(), dnd5eHighJump(), dnd5eLongJump(), dnd5ePushDragLift(), dnd5eSpeedWithArmor(), Dnd5eLikeDataModel, featureOptionSelectionKey() (+23 more)

### Community 111 - "Resource Pool Tracking"
Cohesion: 0.07
Nodes (42): ArmorClassItem, computeDnd5eBaseArmorClass(), Dnd5eUnarmoredDefense, foldArmorClass(), resolveDnd5eArmorClass(), resolvePf2eArmorClass(), ArmorEquipItem, compute5eAC() (+34 more)

### Community 112 - "Bundle Size Check"
Cohesion: 0.05
Nodes (32): appChunk, appChunks, assetsDir, budgets, chunkForModule, chunkGraph, chunkGraphPath, chunks (+24 more)

### Community 113 - "AI Prompt Builders"
Cohesion: 0.16
Nodes (19): AI_GATEWAY_TASKS, CharacterDraftCandidate, CharacterDraftPayload, EncounterDraftPayload, IdentifyCreaturePayload, IllustrateScenePayload, SceneNarrationPayload, buildCharacterDraftPrompt() (+11 more)

### Community 114 - "5e Feat Browser"
Cohesion: 0.31
Nodes (7): categoryIcons, GameSystemSelector(), GameSystemSelectorProps, systemAccents, supportBadgeLabels, supportBadgeStyles, loadAllSystemCatalogSummariesFromMetadata()

### Community 115 - "Project Dependencies"
Cohesion: 0.09
Nodes (23): ai, @ai-sdk/anthropic, @ai-sdk/google, class-variance-authority, clsx, lucide-react, dependencies, ai (+15 more)

### Community 116 - "Dnd5eEquipmentTab.tsx"
Cohesion: 0.09
Nodes (24): CurrencyEditor, CurrencyEditorProps, Dnd5eEquipmentTabComponent, EquipmentBrowser, EquipmentBrowserItem, EquipmentBrowserProps, EquippedItemsSection, EquippedItemsSectionProps (+16 more)

### Community 117 - "check-mam-equipment-provenance.mjs"
Cohesion: 0.24
Nodes (15): D20SkillsTab(), Props, Skill, daggerheartDamageDiceCount(), DND35E_SYNERGY_SOURCES, dnd35eMaxSkillRanks(), dnd35eSkillSynergyTotal(), dnd35eSynergyBonus() (+7 more)

### Community 118 - "dnd5eToolChoices.ts"
Cohesion: 0.23
Nodes (13): cloneDocumentsSnapshot(), documentsChanged(), engineLoadErrorMessage(), prepareDocumentsWithEngines(), prepareDocumentWithEngine(), unresolvedEngineSystemIds(), useDocuments(), withPreparedDocuments() (+5 more)

### Community 119 - "MAM Archetype Browser"
Cohesion: 0.27
Nodes (11): CLASS_TOKENS, d20srdUrl(), FILES, main(), mapCastingTime(), mapDuration(), mapRange(), normalizeName() (+3 more)

### Community 120 - "PF1e Spell Encoder"
Cohesion: 0.27
Nodes (11): CLASS_COLUMNS, main(), mapCastingTime(), mapDuration(), mapRange(), RFC-4180, normalizeName(), parseCsv() (+3 more)

### Community 122 - "PF2e Archetypes Tab"
Cohesion: 0.38
Nodes (5): actor(), atk(), dmg(), SID, RFC-003

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
Cohesion: 0.07
Nodes (33): CreationWizard(), CreationWizardProps, framedSteps(), severityWeight(), ValidationSummary(), buildDocumentFromPlanIds(), buildWorkingDocument(), buildWorkingDocumentEnvelope() (+25 more)

### Community 130 - "legality/pf2e.ts"
Cohesion: 0.29
Nodes (7): ABILITY_KEYS, TIER_BONUS, BuildLegalityResult, BuildViolation, Props, Pf2eProficiency, Pf2eProficiencyTier

### Community 131 - "Retry With Backoff"
Cohesion: 0.07
Nodes (56): Doc, useSync(), UseSyncOptions, baseAuthValue, mockedClearQueuedDeletedDocumentIds, mockedClearQueuedSyncSnapshot, mockedDeleteRemoteDocument, mockedFetchRemoteDocuments (+48 more)

### Community 132 - "2024 Spell Encoder"
Cohesion: 0.39
Nodes (8): main(), mapCastingTime(), mapDuration(), mapRange(), normalizeName(), SCHOOLS, slug(), ts()

### Community 133 - "MAM Power Browser"
Cohesion: 0.09
Nodes (25): CurrencyEditor(), CurrencyEntry, DND_CURRENCIES, Props, D20_LEGACY_CONDITION_NAMES, D20FeatsTab(), FeatEntry, Props (+17 more)

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
Cohesion: 0.24
Nodes (13): addAttackOfOpportunity(), addAttacks(), addCombatActions(), addFullAttack(), addSpellcasting(), createD20LegacyLegalActions(), D20LegacyActionData, D20LegacySystemId (+5 more)

### Community 139 - "Prettier Config"
Cohesion: 0.22
Nodes (8): arrowParens, endOfLine, overrides, printWidth, semi, singleQuote, tabWidth, trailingComma

### Community 140 - "pf2eConditions.ts"
Cohesion: 0.23
Nodes (11): Pf2eArchetypesTab(), Props, getPf2eSheetChoiceState(), GetPf2eSheetChoiceStateProps, Pf2eChoiceSlot, countTrainedPf2eSkills(), Pf2eInventoryBrowserItem, usePf2eSheetController() (+3 more)

### Community 141 - "useDnd5eTemplateHandlers.ts"
Cohesion: 0.22
Nodes (8): DragSourceHandlers, CR_XP_TABLE, formatChallengeRating(), MonsterBrowser(), MonsterBrowserProps, PartyDockTab(), PartyDockTabProps, monsters

### Community 142 - "TS Base Config"
Cohesion: 0.14
Nodes (13): d20LegacyCheckPenalty(), D20Roll, DualityRoll, rollD20(), rollDuality(), createLiveRng(), Rng, DND35E_CLASS_CATALOG (+5 more)

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
Cohesion: 0.24
Nodes (12): LegalActionCost, addBasicActions(), addPowerActions(), buildCatalogLookup(), costForAction(), createMam3eLegalActions(), enumerateMam3eActions(), FREE (+4 more)

### Community 147 - "Dnd5eEquipmentTab.tsx"
Cohesion: 0.14
Nodes (22): LegalActionDescriptor, addMovement(), addReaction(), addSpellcasting(), addStandardActions(), addWeaponAttacks(), createDnd5eLegalActions(), enumerateDnd5eActions() (+14 more)

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
Cohesion: 0.05
Nodes (45): AppContent(), buildNewCharacterDocument(), cloneSystemData(), CreationWizardHost, LegalNotices, SceneManager, STORAGE_WARNING_THRESHOLD, CampaignManager() (+37 more)

### Community 154 - "Dnd5eEquipmentTab.tsx"
Cohesion: 0.27
Nodes (10): createSupabaseJwtVerifier(), decodeBase64Url(), decodeJsonSegment(), fail(), resolveGatewayAuth(), SupabaseJwtVerifier, b64url(), mintToken() (+2 more)

### Community 155 - "5e Movement Rules"
Cohesion: 0.06
Nodes (37): Mode, SignIn(), SignInProps, UserMenu(), UserMenuProps, AuthContext, AuthContextValue, clearLocalDataForAccountChange() (+29 more)

### Community 156 - "CharacterListView.tsx"
Cohesion: 0.43
Nodes (6): DeferredInstallPromptEvent, isStandaloneMode(), readDismissedState(), usePwaInstallPrompt(), UsePwaInstallPromptOptions, writeDismissedState()

### Community 158 - "MAM Complication Browser"
Cohesion: 0.20
Nodes (23): validatePf1eBuild(), ABILITY_SCORE_IDS, addIssue(), addNonOpenSourceIssue(), consumeBuildLegality(), isIntegerInRange(), legalityRulePath(), loadValidationData() (+15 more)

### Community 161 - "PF2e Backgrounds Data"
Cohesion: 0.17
Nodes (26): addIssue(), CLASS_PROGRESSION_RANKS, createPf2eValidator(), isIntegerInRange(), PF2E_ABILITY_IDS, Pf2eValidationData, toIdMap(), validateAncestryBoosts() (+18 more)

### Community 177 - "characterDraftFlow.test.ts"
Cohesion: 0.08
Nodes (34): CharacterDraftApplier, collectUnknownIdIssues(), DocumentValidator, DraftCharacterParams, DraftCharacterResult, draftCharacterWithAi(), GatewayCall, POOL_LIST_FIELDS (+26 more)

### Community 179 - "useSceneEncounter.ts"
Cohesion: 0.16
Nodes (14): AiImageInput, IdentifyCreatureData, IdentifyCreatureParams, IdentifyCreatureResult, identifyCreatureWithAi(), IdentifyGatewayCall, RFC-002, fileToAiImageInput() (+6 more)

### Community 180 - "daggerheart/validation.ts"
Cohesion: 0.14
Nodes (32): addDomainCardActions(), addHopeFeature(), addUniversalMoves(), addWeaponStrikes(), buildLookup(), createDaggerheartLegalActions(), enumerateDaggerheartActions(), NamedEntry (+24 more)

### Community 181 - "useEntitySync.ts"
Cohesion: 0.20
Nodes (17): mockedGetQueuedCampaignsSnapshot, mockedGetQueuedDeletedCampaignIds, mockedGetQueuedDeletedDocumentIds, mockedGetQueuedSyncSnapshot, getQueuedCampaignsSnapshot(), getQueuedDeletedCampaignIds(), getQueuedDeletedDocumentIds(), readQueuedIds() (+9 more)

### Community 182 - "syncTombstones.ts"
Cohesion: 0.23
Nodes (8): EncounterDraftCandidate, EncounterDraftData, DraftEncounterParams, DraftEncounterResult, GatewayCall, SelectionValidator, RFC-002, params

### Community 183 - "loadEquipmentForSystem"
Cohesion: 0.50
Nodes (3): Answer, Outcome, Q: where are pending debounced document saves flushed to localStorage on page hide or unload (persistence flush)

### Community 184 - "MamArchetypesTab.tsx"
Cohesion: 0.09
Nodes (38): AppHeader(), AppHeaderProps, SURFACES, SurfaceStage(), SurfaceStageProps, assertNever(), INITIAL_NAV_STATE, LIBRARY_SEGMENTS (+30 more)

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
Cohesion: 0.09
Nodes (28): react, react, clampExhaustion(), Props, RestControls(), useTabs(), SheetAddHandlers, SheetDispatch (+20 more)

### Community 191 - "retryWithBackoff"
Cohesion: 0.18
Nodes (21): MamAdvantageBrowserTab(), Props, addIssue(), createMam3eValidator(), engine, Mam3eValidationData, SPENT_BUCKETS, validateAdvantages() (+13 more)

### Community 194 - "@types/react-dom"
Cohesion: 0.04
Nodes (55): CreationPlan, SystemRegistry, RFC-003, LegalActionEligibility, LegalActionList, LegalActionsContext, LegalActionTarget, SheetProps (+47 more)

### Community 195 - "sceneTerrain.ts"
Cohesion: 0.31
Nodes (7): collectTerrainEffectsAt(), isTerrainOperation(), markerCoversCell(), markerToEffects(), normalizeStackPolicy(), TERRAIN_OPERATIONS, RFC-003

### Community 197 - "sceneStorageIDB.test.ts"
Cohesion: 0.22
Nodes (7): defineSetItem(), installLocalStorageQuota(), makeHeavyScene(), makeScene(), NOW, resetSceneStorageDiagnosticsForTests(), SCENES_STORAGE_KEY

### Community 198 - "@testing-library/user-event"
Cohesion: 0.29
Nodes (7): LegalNotices(), LegalNoticesProps, licenseTexts, LegalAttributions, LegalLicenseRef, ProvenanceStatus, SystemAttribution

### Community 199 - "derivation/index.ts"
Cohesion: 0.40
Nodes (6): applyDerivedQuantities(), ComputeLayer, DerivedDisplay, DerivedQuantityCase, DerivedQuantitySpec, RFC-003

### Community 200 - "systemAssetPrefetch.ts"
Cohesion: 0.27
Nodes (8): SYSTEM_IDS, getSystemAssetPrefetchStateForTests(), prefetchedSystemAssets, prefetchedSystemRuntimeData, prefetchedSystemSheets, prefetchSystemAssetsForIds(), resetSystemAssetPrefetchStateForTests(), systemAssetPrefetchers

### Community 201 - "characterCombatant.test.ts"
Cohesion: 0.28
Nodes (5): RoundCombatant, charDoc(), doc(), pf2eDoc(), RFC-003

### Community 202 - "phase3-workflows.spec.ts"
Cohesion: 0.29
Nodes (11): extractJsArray(), field(), main(), MODULES, parseEntries(), prettierBin(), readSource(), slug() (+3 more)

### Community 203 - "aiSdkAdapter.test.mts"
Cohesion: 0.29
Nodes (6): ENCOUNTER_PAYLOAD, RFC-002, promptText(), RecordedMessage, RecordedPrompt, AiTokenUsage

### Community 204 - "Dnd5eRiderTogglesSection.tsx"
Cohesion: 0.32
Nodes (5): CombatTogglesSection(), Props, Dnd5eRiderTogglesSection(), Props, TOGGLE_LABELS

### Community 205 - "ConditionPicker.tsx"
Cohesion: 0.33
Nodes (5): Condition, ConditionPicker(), Props, available, valued

### Community 206 - "Dnd5eNotesTab.tsx"
Cohesion: 0.50
Nodes (3): Dnd5eNotesTab(), Dnd5ePersonality, Props

### Community 208 - "gateBudget.test.tsx"
Cohesion: 0.17
Nodes (13): SceneDropController(), SceneDispatchContext, SceneEmit, useSceneDispatch(), countMutations(), doc(), dropOn(), now (+5 more)

### Community 212 - "aiSdkAdapter.test.mts"
Cohesion: 0.06
Nodes (32): AiSdkAdapterConfig, createAiSdkAdapter(), IMAGE_TASKS, RFC-002, TASK_SCHEMAS, createAnthropicAdapter(), createGeminiAdapter(), ANTHROPIC_REGISTRATION (+24 more)

### Community 213 - "spikeViewport.ts"
Cohesion: 0.43
Nodes (6): rect, clampCoordinate(), invertPoint(), Rect, Viewport, zoomToCursor()

## Knowledge Gaps
- **1468 isolated node(s):** `semi`, `singleQuote`, `trailingComma`, `printWidth`, `tabWidth` (+1463 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **17 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `CharacterDocument` connect `Oracle Panel & Logic` to `Sheet Resource Loading Hooks`, `Dnd5e Sheets & E2E Tests`, `Dnd5e Equipment & Features UI`, `Dnd5e Background Templates`, `Dnd5e2024 Engine & Hit Dice`, `Daggerheart Engine`, `Tabs UI Component`, `Scene Combat Resolution`, `Dnd5e Activity Definitions`, `Dnd5e Feat Templates`, `D20 Combat Controls`, `Game System Selector`, `D20 Legacy System Engines`, `Dnd35e Saves & Data Model`, `System Registry & Renderer`, `Daggerheart Inventory`, `Pf2e Character Templates`, `Dnd5e Feature List Sections`, `Encounter & Initiative Panels`, `Pf2e Sheet Tabs`, `AI Encounter Drafting`, `Currency & Inventory Editors`, `Document Sync Engine`, `Mam3e Data Model & Engine`, `Condition Effects by System`, `Equipped Armor Section`, `Spell Browser UI`, `Encounter Builder Logic`, `Monster Combatant Builder`, `D20 Legacy Templates`, `Campaign Storage & Hooks`, `Spell Preparation Logic`, `SRD Manifest Generator`, `Daggerheart Combatant Builders`, `D20 Legacy Spell Slots`, `Spells Tab Components`, `Character Effects Compilation`, `System Validation Logic`, `Dnd5e Resource Loading Hooks`, `Dnd5e Feature Options`, `Document Migrations & Storage`, `HP & Spell Slot Trackers`, `Boundary Validation Tests`, `Documents Hook & Persistence`, `Daggerheart Contribution Ledger`, `Dnd35e/Pf1e Derived Math`, `Mam Browser Tabs`, `Skills Tab & Combat Math`, `Mam3e Derived Math`, `Document Storage (IndexedDB)`, `Character Card Presenter`, `5e Equipment Tab`, `Document Signature Hashing`, `Resource Pool Tracking`, `dnd5eToolChoices.ts`, `Daggerheart Sheet Automation`, `Retry With Backoff`, `MAM Power Browser`, `syncTombstones.ts`, `pf2eConditions.ts`, `useDnd5eTemplateHandlers.ts`, `TS Base Config`, `Scene Illustration Panel`, `Dnd5eEquipmentTab.tsx`, `ServiceWorkerUpdateBanner.tsx`, `MAM Complication Browser`, `PF2e Backgrounds Data`, `characterDraftFlow.test.ts`, `useSceneEncounter.ts`, `daggerheart/validation.ts`, `MamArchetypesTab.tsx`, `dnd35e/validation.ts`, `index.ts`, `retryWithBackoff`, `@types/react-dom`, `characterCombatant.test.ts`, `gateBudget.test.tsx`?**
  _High betweenness centrality (0.142) - this node is a cross-community bridge._
- **Why does `GameSystemId` connect `Daggerheart Combatant Builders` to `Sheet Resource Loading Hooks`, `Dnd5e Sheets & E2E Tests`, `Dnd5e2024 Engine & Hit Dice`, `Tabs UI Component`, `System Compute Registers`, `pf2eConditions.ts`, `Game System Selector`, `Dnd5eEquipmentTab.tsx`, `System Registry & Renderer`, `ServiceWorkerUpdateBanner.tsx`, `Roadmap Metrics Generator`, `Class Enhancement & Headers`, `Pf2e Sheet Tabs`, `AI Encounter Drafting`, `Currency & Inventory Editors`, `Mam3e Data Model & Engine`, `Doc Drift Rules`, `Spell Browser UI`, `Error Boundary & Auth Context`, `Encounter Builder Logic`, `characterDraftFlow.test.ts`, `useSceneEncounter.ts`, `Character Combatant Builder`, `AI Gateway Adapters`, `SRD Coverage Script`, `Browser Compat & Error Logging`, `systemAssetPrefetch.ts`, `characterCombatant.test.ts`, `Spell Catalog Consistency Tests`, `Mam Powers & Cost Ledger`, `HP & Spell Slot Trackers`, `Mam Browser Tabs`, `Skills Tab & Combat Math`, `Mam3e Derived Math`, `Oracle Panel & Logic`, `Document Signature Hashing`, `Resource Pool Tracking`, `5e Feat Browser`?**
  _High betweenness centrality (0.056) - this node is a cross-community bridge._
- **Why does `entry()` connect `daggerheart/validation.ts` to `Dnd5e Background Templates`, `Tabs UI Component`, `Node Runtime Bootstrap`, `Scene Illustration Panel`, `ServiceWorkerUpdateBanner.tsx`, `Daggerheart Inventory`, `AI Encounter Drafting`, `Doc Drift Rules`, `Error Boundary & Auth Context`, `Encounter Builder Logic`, `D20 Legacy Templates`, `AI Gateway Contracts`, `fake-indexeddb`, `Mam Character Sheet Tabs`, `Dnd5e Feature Options`, `Daggerheart Contribution Ledger`, `Pf2e Spell Data Encoder`, `Skills Tab & Combat Math`, `Pf2e Spell Types & Traits`, `5e Monster Encoder`, `AI Creature Identification`, `Document Signature Hashing`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **What connects `semi`, `singleQuote`, `trailingComma` to the rest of the system?**
  _1468 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Sheet Resource Loading Hooks` be split into smaller, more focused modules?**
  _Cohesion score 0.09322033898305085 - nodes in this community are weakly interconnected._
- **Should `Dnd5e Sheets & E2E Tests` be split into smaller, more focused modules?**
  _Cohesion score 0.1282051282051282 - nodes in this community are weakly interconnected._
- **Should `Dnd5e Equipment & Features UI` be split into smaller, more focused modules?**
  _Cohesion score 0.07562008469449485 - nodes in this community are weakly interconnected._