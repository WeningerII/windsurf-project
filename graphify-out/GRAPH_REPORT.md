# Graph Report - windsurf-project  (2026-07-29)

## Corpus Check
- 918 files · ~765,380 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 5940 nodes · 17185 edges · 217 communities (201 shown, 16 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 168 edges (avg confidence: 0.72)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d30be47c`
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
- DragProvider.tsx
- mam3e/engine.ts
- syncTombstones.ts
- useAppNav
- participantResolution.test.ts
- phase3-workflows.spec.ts
- aiSdkAdapter.test.mts
- systemAssetPrefetch.ts
- generateUUID
- useKeyboardNavigation
- sceneConditionOptions.ts
- DeathSavesTracker.tsx
- dockRegistry.tsx
- Pf2eHeader.test.tsx
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

## Communities (217 total, 16 thin omitted)

### Community 0 - "Sheet Resource Loading Hooks"
Cohesion: 0.09
Nodes (57): useDaggerheartSheetResources(), loadValidationData(), useLazyResource(), useMam3eSheetResources(), loadValidationData(), SYSTEM_ID, finalizeLoadedItems(), loadAdvantagesForSystem() (+49 more)

### Community 1 - "Dnd5e Sheets & E2E Tests"
Cohesion: 0.10
Nodes (30): categoryIcons, GameSystemSelector(), GameSystemSelectorProps, systemAccents, supportBadgeLabels, supportBadgeStyles, buildInitialSummaryStates(), categoryDisplay (+22 more)

### Community 2 - "Dnd5e Equipment & Features UI"
Cohesion: 0.07
Nodes (45): resolveD20LegacyArmorClass(), contextWithConditionIds(), resolveCharacterEffects(), computeD20LegacyAC(), UseD20LegacySheetControllerProps, dnd35eAbilityIncreases(), dnd35eConcentrationDCDamage(), dnd35eConcentrationDCDefensive() (+37 more)

### Community 3 - "Dnd5e Background Templates"
Cohesion: 0.05
Nodes (70): countSelections(), Dnd5eSheetMutators, optionDisabledForRequirement(), resolveEquipmentSlot(), resolveFeatSelections(), toEquippedItem(), toWeaponDamage(), ABILITY_NAME_TO_ID (+62 more)

### Community 4 - "Dnd5e2024 Engine & Hit Dice"
Cohesion: 0.08
Nodes (23): Dnd5e2024Engine, hasAlertFeat(), totalCharacterLevel(), DND5E_CONDITION_NAMES, hasDnd5eCondition(), normalizeConditionId(), normalizeDnd5eConditions(), Dnd5eEngineBase (+15 more)

### Community 5 - "Daggerheart Engine"
Cohesion: 0.08
Nodes (51): applyDnd5eClassTemplate(), applyDnd5eSubclassTemplate(), assertMulticlassRequirements(), ATTRIBUTE_NAME_TO_ID, buildChoiceSlots(), buildDerivedProficiencies(), buildSpellcastingState(), canSelectSubclass() (+43 more)

### Community 6 - "3.5e Monster Data Encoder"
Cohesion: 0.06
Nodes (56): ALIGNMENTS, DICE_PROGRESSIONS, main(), mapAlignment(), MONSTER_SIZE, normalizeName(), OLIMOT_FILES, resolveSizeRoll() (+48 more)

### Community 7 - "Tabs UI Component"
Cohesion: 0.09
Nodes (40): Badge(), BadgeProps, badgeVariants, DaggerheartCharacterBasicsSection(), Props, DaggerheartDomainCardsSection(), Props, DaggerheartDowntimeControls() (+32 more)

### Community 8 - "Node Runtime Bootstrap"
Cohesion: 0.09
Nodes (49): main(), runBootstrapNodeInstall(), getPinnedCommandArgs(), main(), runPinnedNpmCommand(), formatRuntimeDoctorReport(), main(), readWorkflowPinSource() (+41 more)

### Community 9 - "Scene Combat Resolution"
Cohesion: 0.04
Nodes (60): buildScene(), MakeGameResult, Props, SceneCreateFormProps, BuildEncounterEventsParams, appendSceneEvent(), createSceneDocument(), foldSceneEvents() (+52 more)

### Community 10 - "Dnd5e Class Templates"
Cohesion: 0.20
Nodes (21): makeAsset(), makeSceneWithMap(), clearMapAssetStorage(), createMapAsset(), CreateMapAssetResult, deleteMapAsset(), isMapAssetShape(), isRecord() (+13 more)

### Community 11 - "System Compute Registers"
Cohesion: 0.11
Nodes (22): Mode, SignIn(), SignInProps, UserMenu(), UserMenuProps, AuthContext, clearLocalDataForAccountChange(), getLastSyncedUserId() (+14 more)

### Community 12 - "Scene Check Panel"
Cohesion: 0.18
Nodes (12): BrowserCapabilities, checkBrowserCapabilities(), initBrowserCompat(), isBrowserSupported(), showCompatibilityWarning(), ErrorCategory, ErrorLog, ErrorLogger (+4 more)

### Community 13 - "Dnd5e Activity Definitions"
Cohesion: 0.09
Nodes (27): buildDefenseStyleActivity(), buildDivineSmiteActivities(), buildDivineSmiteActivity(), buildDnd5eActivityDefinitions(), buildUnsupportedDivineSmiteActivity(), divineSmiteSlotLevel(), Dnd5eActivityCost, Dnd5eActivityCostKind (+19 more)

### Community 14 - "Monster & NPC Generator"
Cohesion: 0.06
Nodes (46): DragProvider, DragRoot(), isSceneDragEnabled(), FEATURE_FLAGS, FeatureFlag, FeatureFlagDefinition, isFeatureEnabled(), RingBuffer (+38 more)

### Community 15 - "Dnd5e Feat Templates"
Cohesion: 0.06
Nodes (51): BreakdownRow, buildRows(), ContributionBreakdown(), formulaOf(), Props, toRow(), RFC-003, getDaggerheartProficiency() (+43 more)

### Community 16 - "App Shell & Layout"
Cohesion: 0.07
Nodes (36): feat, item, monster, spell, DockResources, EMPTY, useDockResources(), focusPulseSpell (+28 more)

### Community 17 - "D20 Combat Controls"
Cohesion: 0.08
Nodes (32): validateDnd35eBuild(), createDefaultDnd35eData(), Dnd35eClassLevel, Dnd35eDataModel, Dnd35eFeat, Dnd35eManualSpellcastingExtras, Dnd35eSaves, RFC-003 (+24 more)

### Community 18 - "Game System Selector"
Cohesion: 0.07
Nodes (54): EquippedItemsSection(), Props, SLOT_LABELS, SLOT_ORDER, HitDiceTracker(), Props, Props, SLOT_LEVELS (+46 more)

### Community 19 - "Combat & Recap Panels"
Cohesion: 0.11
Nodes (19): DEFAULT_LABELS, SpellBrowser(), SpellBrowserLabels, SpellBrowserProps, SpellBrowserSpell, Dnd5eSpellsTabComponent, Props, SpellBrowser (+11 more)

### Community 20 - "D20 Legacy System Engines"
Cohesion: 0.08
Nodes (45): UseSceneEncounterParams, Props, resolveCheck(), BuildEncounterEventsResult, footprintWithinGrid(), isOracleAnswer(), applyHitPointDelta(), applySceneEvent() (+37 more)

### Community 21 - "Dnd35e Saves & Data Model"
Cohesion: 0.05
Nodes (40): Props, Props, makeD20LegacySheet(), createDefaultPf1eData(), Pf1eClassLevel, Pf1eDataModel, Pf1eFeat, Pf1eManualSpellcastingExtras (+32 more)

### Community 22 - "Daggerheart Data Model"
Cohesion: 0.09
Nodes (25): CurrencyEditor(), CurrencyEntry, DND_CURRENCIES, Props, EquippedArmorSection(), D20_LEGACY_CONDITION_NAMES, D20FeatsTab(), FeatEntry (+17 more)

### Community 23 - "System Registry & Renderer"
Cohesion: 0.06
Nodes (26): Dnd5eSheet(), Props, createDefaultDnd5eData(), Dnd5eEngine, Dnd5eDocument, makeDnd5eDocument(), Dnd5eDocument, makeDnd5eDocument() (+18 more)

### Community 24 - "Game Rules & Proficiencies"
Cohesion: 0.09
Nodes (26): GAME_RULES, ArmorProficiency, ArmorProficiencyType, GamingSetProficiency, isValidArmorProficiency(), isValidSkillProficiency(), isValidToolProficiency(), isValidWeaponProficiency() (+18 more)

### Community 25 - "Campaign Sync Hooks"
Cohesion: 0.16
Nodes (29): useCampaignSync(), mockedGetSupabaseClient, getSupabaseClient(), clearQueuedCampaignsSnapshot(), clearQueuedDeletedCampaignIds(), clearQueuedIds(), deleteRemoteCampaign(), extractTombstone() (+21 more)

### Community 26 - "Daggerheart Inventory"
Cohesion: 0.09
Nodes (35): clampDaggerheartInventoryQuantity(), daggerheartInventoryDefinitions, findDaggerheartInventoryDefinitionByName(), getDaggerheartInventoryDefinition(), inventoryDefinitionById, inventoryDefinitionByName, isDaggerheartConsumableDefinition(), normalizeDaggerheartCurrency() (+27 more)

### Community 27 - "Pf2e Character Templates"
Cohesion: 0.07
Nodes (60): Props, createDefaultPf2eData(), PF2E_ARCHETYPE_DEDICATION_GRANTS, Pf2eClassLevel, Pf2eDedicationProficiencyCategory, Pf2eDedicationProficiencyGrant, Pf2eFeat, Pf2eProficiency (+52 more)

### Community 28 - "Roadmap Metrics Generator"
Cohesion: 0.10
Nodes (29): applyRepoResidentOverrides(), buildComputeCompletion(), buildContentCoverage(), buildMarkdownReport(), ComputeCompletionRow, computeMetrics(), ContentCoverageRow, createEmptyCategoryCounts() (+21 more)

### Community 29 - "Dnd5e Feature List Sections"
Cohesion: 0.08
Nodes (46): mod(), DamageHealControl(), DamageHealControlProps, DiceRollButton(), DiceRollButtonProps, RollResult, ABILITIES, D20AbilitiesTab() (+38 more)

### Community 30 - "Encounter & Initiative Panels"
Cohesion: 0.10
Nodes (22): resolveCharacterLedger(), collectPf2eCheckConditionEffects(), collectPf2eConditionEffects(), ConditionScope, getPf2eConditionStatusPenalty(), highestValue(), magnitude(), PF2E_STATUS_CONDITIONS (+14 more)

### Community 31 - "Class Enhancement & Headers"
Cohesion: 0.09
Nodes (32): useLazyResource(), useSystemOptions(), Props, useD20LegacySheetResources(), UseD20LegacySheetResourcesProps, UseDaggerheartSheetResourcesProps, Dnd5eEquipmentTab, Dnd5eFeaturesTab (+24 more)

### Community 32 - "Pf2e Sheet Tabs"
Cohesion: 0.09
Nodes (34): CharacterEffectInputs, ResolvedCharacterEffects, compileEquipmentEffects(), equipStackPolicy(), isMeaningful(), MagicBonusItem, TYPED_STACK_SYSTEMS, compileModifierEffects() (+26 more)

### Community 33 - "AI Encounter Drafting"
Cohesion: 0.07
Nodes (36): DEFAULT_QUICK_ROLLS, DicePanel(), DicePanelProps, formatBreakdown(), QUICK_ROLLS_BY_SYSTEM, DISPOSITION_BADGE, DISPOSITION_LABEL, ReactionHistoryEntry (+28 more)

### Community 34 - "Quest & Session Log UI"
Cohesion: 0.14
Nodes (26): QuestList(), STATUS_BADGE, STATUS_OPTIONS, DATE_FORMAT, Props, SessionLog(), T0, T1 (+18 more)

### Community 35 - "Currency & Inventory Editors"
Cohesion: 0.17
Nodes (15): MamArchetypeBrowser(), MamArchetypeBrowserProps, MamConditionsTab(), Props, Mam3eConditionTrack, applyMam3eToughnessFailure(), getMam3eSheetState(), GetMam3eSheetStateProps (+7 more)

### Community 36 - "Document Sync Engine"
Cohesion: 0.08
Nodes (60): buildSceneCombatants(), critModelForScene(), degreeModelForScene(), factionForToken(), ResolveCombatStats, resolveSceneAreaEffect(), resolveSceneAttack(), runSceneRound() (+52 more)

### Community 37 - "Sheet Header & Stat Cards"
Cohesion: 0.27
Nodes (8): ToastContext, ToastContextValue, ToastItem, ToastProvider(), VARIANT_ICONS, VARIANT_STYLES, registerToastHandler(), ToastVariant

### Community 38 - "Check & Oracle Resolution"
Cohesion: 0.07
Nodes (22): @testing-library/jest-dom, CharacterListView(), RFC-003, registerAllSystems(), renderSyntheticWizard(), syntheticPlan(), openBrokenSheet(), MockBeforeInstallPromptEvent (+14 more)

### Community 39 - "Mam3e Data Model & Engine"
Cohesion: 0.08
Nodes (38): FeaturesSection(), Props, ProficiencyListSection(), Props, NormalizedSheet, ArmorClassCharacter, formatBackgroundToolLabel(), ChoiceSlot (+30 more)

### Community 40 - "Doc Drift Rules"
Cohesion: 0.06
Nodes (59): DOC_DRIFT_MANIFEST, DocDriftRuleType, DocDriftSurface, DocDriftSurfaceKind, CAPABILITY_PHRASE_RULES, CapabilityPhraseRule, capitalizeSupportLevel(), COMMAND_RUNTIME_RULES (+51 more)

### Community 41 - "NPM Build Scripts"
Cohesion: 0.04
Nodes (56): scripts, analyze, bootstrap:node, build, check:bundle-size, check:compute-register, check:compute-register:mutate, check:compute-register:write (+48 more)

### Community 42 - "Condition Effects by System"
Cohesion: 0.13
Nodes (11): byId, byName, failures, manifest, manifestByName, originalSources, root, seenSrdNames (+3 more)

### Community 43 - "Equipped Armor Section"
Cohesion: 0.05
Nodes (45): EquipArmorInput, EquipEntry, EquipShieldInput, Props, Dock(), CurrencyEditor, CurrencyEditorProps, Dnd5eEquipmentTabComponent (+37 more)

### Community 44 - "Spell Browser UI"
Cohesion: 0.13
Nodes (25): BrowserFeat, DockPanel(), DockPanelProps, DockProps, EquipmentBrowser, EquipmentBrowserItem, EquipmentBrowserProps, FeatBrowser (+17 more)

### Community 45 - "Scene Combat Area Effects"
Cohesion: 0.17
Nodes (15): buildNotice(), FetchTarget, fetchValidated(), HTML_ENTITIES, looksLikeHtml(), main(), normalize(), noticePath (+7 more)

### Community 46 - "Error Boundary & Auth Context"
Cohesion: 0.10
Nodes (28): D20ClassesSection(), D20LegacyClassLevel, renderClassOptions(), d20BonusSpells(), buildD20LegacySpellSlotTotals(), countAdvancementLevels(), D20_DOMAIN_CLASS_IDS, D20_FALLBACK_CASTING_ABILITIES (+20 more)

### Community 47 - "Encounter Builder Logic"
Cohesion: 0.12
Nodes (31): applyAbilityAdjustments(), applyD20LegacyClassTemplate(), applyD20LegacyRaceTemplate(), buildClassSkills(), classFeaturesUpToLevel(), classSkillOptions(), collectClassFeatureSignatures(), create35eClassLevel() (+23 more)

### Community 48 - "Scene Management Hooks"
Cohesion: 0.11
Nodes (34): useDebouncedPersistence(), mergeLoadedScenes(), useScenes(), NOW, defineSetItem(), installLocalStorageQuota(), makeHeavyScene(), makeScene() (+26 more)

### Community 49 - "Monster Combatant Builder"
Cohesion: 0.04
Nodes (66): CheckPanel(), CheckPanelProps, DEFAULT_SUGGESTIONS, DND5E_SKILLS, OUTCOME_BADGE, OUTCOME_LABEL, SKILL_SUGGESTIONS_BY_SYSTEM, CombatPanelProps (+58 more)

### Community 50 - "D20 Legacy Templates"
Cohesion: 0.10
Nodes (47): getDaggerheartShortRestRecovery(), createDaggerheartInventoryEntry(), clearAllStress(), clearStress(), prepareGainHope(), repairAllArmor(), repairArmor(), tendToAllWounds() (+39 more)

### Community 51 - "Campaign Storage & Hooks"
Cohesion: 0.47
Nodes (8): campaignSignatureFor(), sameCampaignSignatures(), sameDocumentSignatures(), sameSceneSignatures(), sameSignatureMultisets(), sceneSignatureFor(), signatureFor(), toTime()

### Community 52 - "Spell Preparation Logic"
Cohesion: 0.17
Nodes (10): Mam3eSystemDef, createHero(), power(), TEST_DATE, createDocument(), legalBuild(), mam3eEngine, power() (+2 more)

### Community 53 - "Dev Dependencies"
Cohesion: 0.04
Nodes (47): autoprefixer, @axe-core/playwright, eslint, eslint-config-prettier, @eslint/js, eslint-plugin-react, eslint-plugin-react-hooks, happy-dom (+39 more)

### Community 54 - "Character Combatant Builder"
Cohesion: 0.11
Nodes (20): AI_TASK_UNIT_COST, TaskGatewayCall, AnyTaskGatewayCall, createFlowBudget(), DEFAULT_MAKE_GAME_FLOW_BUDGET, FlowBudget, FlowBudgetLimits, FlowBudgetReport (+12 more)

### Community 55 - "D20 Class Spellcasting"
Cohesion: 0.09
Nodes (38): SceneAreaEffectOutcome, SceneAttackOutcome, SceneRoundOutcome, isRoundConclusive(), RoundCombatant, RoundResult, RoundTurnRecord, runCombatRound() (+30 more)

### Community 56 - "SRD Manifest Generator"
Cohesion: 0.06
Nodes (66): ArtisanToolProficiency, MusicalInstrumentProficiency, appendInventoryFromBackground(), applyDnd5eBackgroundTemplate(), BackgroundChoiceSlot, BackgroundChoiceValue, backgroundDerivedState(), COMMON_LANGUAGE_OPTIONS (+58 more)

### Community 57 - "Daggerheart Combatant Builders"
Cohesion: 0.09
Nodes (31): AllegianceChip(), AllegianceChipProps, PendingMonster, TokenPanelProps, monsterAverageHitPoints(), buildEncounterSceneEvents(), buildInitiativeEntries(), buildOccupiedCells() (+23 more)

### Community 58 - "AI Gateway Adapters"
Cohesion: 0.06
Nodes (45): AI_GATEWAY_SCHEMA_VERSION, aiFailure, AiFailureCode, AiResponse, AiTask, AiTaskClass, GatewayContext, GatewayTimeoutError (+37 more)

### Community 59 - "AI Gateway Contracts"
Cohesion: 0.12
Nodes (33): AI_TASK_CLASS, AiParse, AiSuccess, AiUsage, CharacterDraftRequest, EncounterDraftRequest, IdentifyCreatureRequest, IllustrateSceneRequest (+25 more)

### Community 60 - "System Definitions & Types"
Cohesion: 0.11
Nodes (26): ArmorEquipItem, compileBaseArmorClassEffects(), dnd5eArmorDexContribution(), collectD20LegacyConditionEffects(), D20_LEGACY_CONDITION_EFFECTS, hasD20LegacyConditionEffects(), LegacyConditionTemplate, collectDaggerheartConditionEffects() (+18 more)

### Community 61 - "D20 Legacy Spell Slots"
Cohesion: 0.09
Nodes (32): ABILITIES, DEFENSES, Mam3eCreator(), Mam3eCreatorProps, SKILLS, buildMam3eCreatorData(), createDefaultMam3eDefenseRanks(), DERIVATION_EPOCH (+24 more)

### Community 62 - "SRD Coverage Script"
Cohesion: 0.06
Nodes (56): buildManifest(), CLASSES, CLASSIFICATION_PATH, HERE, LICENSING_CLASSES, loadShipped(), MANIFEST_PATH, run() (+48 more)

### Community 63 - "ESLint Config"
Cohesion: 0.12
Nodes (25): ancestryPool(), backgroundPool(), classPool(), loadCharacterDraftPools(), NamedEntity, toCandidates(), RFC-002, CreationOption (+17 more)

### Community 64 - "Spells Tab Components"
Cohesion: 0.28
Nodes (14): actionReachCells(), ATTACK_COUNT_WORDS, averageDie(), buildMonsterCombatant(), dieFaces(), isMinusSign(), monsterAttackEffects(), monsterAttacksPerRound() (+6 more)

### Community 65 - "Browser Compat & Error Logging"
Cohesion: 0.10
Nodes (22): ErrorBoundary, Props, State, LegalNotices(), LegalNoticesProps, licenseTexts, LibraryBestiaryView(), LoadState (+14 more)

### Community 66 - "AI Gateway Client"
Cohesion: 0.34
Nodes (11): CharacterCard(), CharacterCardProps, asNumber(), asRecord(), asString(), getClassLabel(), getDocumentLevelValue(), getHitPointLabel() (+3 more)

### Community 67 - "2024 Monster Data Encoder"
Cohesion: 0.16
Nodes (23): ABILITIES, ALIGNMENTS, bucketFor(), classifyImmunityList(), cleanProse(), CR_FRACTIONS, CREATURE_TYPES, DAMAGE_TYPES (+15 more)

### Community 68 - "Character Effects Compilation"
Cohesion: 0.07
Nodes (29): createDefaultDaggerheartData(), DaggerheartDataModel, DaggerheartSystemDef, DAGGERHEART_DERIVED_QUANTITIES, Props, UseDaggerheartSheetControllerProps, TEST_DATE, dhDoc() (+21 more)

### Community 69 - "TypeScript Config"
Cohesion: 0.07
Nodes (27): ES2020, src, compilerOptions, allowImportingTsExtensions, baseUrl, forceConsistentCasingInFileNames, isolatedModules, jsx (+19 more)

### Community 70 - "Mam Character Sheet Tabs"
Cohesion: 0.06
Nodes (48): daggerheartComputeRegister, dnd35eComputeRegister, dnd5e2014ComputeRegister, dnd5e2024ComputeRegister, COMPUTE_REGISTERS, registerForSystem(), mam3eComputeRegister, MUTATION_ANCHORS (+40 more)

### Community 72 - "Dice Panel & Mam3e Resolution"
Cohesion: 0.08
Nodes (29): counterStore, latencyBudgetsFromEnv(), positiveEnv(), rateLimiterFromEnv(), sessionBudgetFromEnv(), anthropicAdapter, googleAdapter, ProviderRegistryDeps (+21 more)

### Community 73 - "System Validation Logic"
Cohesion: 0.15
Nodes (30): dnd5eKnownSpellLimit(), dnd5eKnownSpellOverage(), KnownSpellProgression, progressionIndex(), ABILITY_SCORE_IDS, addIssue(), appendBuildLegalityIssues(), Dnd5eValidationData (+22 more)

### Community 74 - "Spell Catalog Consistency Tests"
Cohesion: 0.08
Nodes (42): ALL_SYSTEMS, ALLOWED_BY_ID, ALLOWLIST, allowlistHits, auditCitation(), auditRulesLayerLiterals(), CATEGORY_LOADERS, cleared (+34 more)

### Community 75 - "Dnd5e Resource Loading Hooks"
Cohesion: 0.10
Nodes (37): getDaggerheartAncestryAdjustments(), EMPTY_WEAPON_LOADOUT, applyDaggerheartAncestryTemplate(), applyDaggerheartClassTemplate(), applyDaggerheartCommunityTemplate(), classTemplateItems(), communityTemplateItems(), DaggerheartInventoryEntry (+29 more)

### Community 76 - "Mam Powers & Cost Ledger"
Cohesion: 0.11
Nodes (22): SceneCanvasProps, SceneGridViewProps, CharacterCombatant, buildDaggerheartAdversaryCombatant(), BuildDaggerheartAdversaryResult, DaggerheartAdversaryCombatant, RANGE_CELLS, buildDaggerheartCombatant() (+14 more)

### Community 78 - "Dnd5e Feature Options"
Cohesion: 0.08
Nodes (39): Dnd5eFeatureOptionsSection(), Dnd5eFeatureOptionsSectionComponent, FeatureOptionBrowser, FeatureOptionBrowserProps, featureOptionSelectionKey(), Props, FeatureOptionBrowser(), FeatureOptionBrowserProps (+31 more)

### Community 79 - "Document Migrations & Storage"
Cohesion: 0.14
Nodes (21): makeStoredDocument(), setStoredDocuments(), StubTransaction, resetDocumentStorageDiagnosticsForTests(), hydrateDoc(), idbClearDocuments(), idbClearScenes(), idbHasMigrated() (+13 more)

### Community 80 - "App Header & Auth UI"
Cohesion: 0.36
Nodes (7): ThemeToggle(), applyTheme(), getSystemTheme(), isTheme(), Theme, useTheme(), VALID_THEMES

### Community 82 - "HP & Spell Slot Trackers"
Cohesion: 0.10
Nodes (21): AI_GATEWAY_ENDPOINT, AiRequest, GeneratedImageData, SceneNarrationData, BY_DESIGN_FAILURE_CODES, callAiGateway(), isAiEnabled(), reportGatewayFailure() (+13 more)

### Community 84 - "Boundary Validation Tests"
Cohesion: 0.24
Nodes (19): NOW, parseImg(), validDocInput(), coerceDate(), coerceObjectives(), coerceQuests(), coerceSceneMapReference(), coerceSessionLog() (+11 more)

### Community 85 - "capabilityScenarios.test.tsx"
Cohesion: 0.60
Nodes (3): formatModifierCost(), MamPowerModifierBrowser(), MamPowerModifierBrowserProps

### Community 86 - "Equipment & Feature Browsers"
Cohesion: 0.12
Nodes (22): casterTypes, classResourcesNeeded, classTags, UseD20LegacyTemplateHandlersProps, HERO_POINT_PIPS, Props, CharacterClass, ClassDisplayMetadata (+14 more)

### Community 87 - "Pf2e Engine & Constants"
Cohesion: 0.09
Nodes (20): GapLedgerItem, LedgerPhase, LedgerStatus, LedgerTag, LedgerTrack, MASTER_GAP_LEDGER, RFC-003, byPhase (+12 more)

### Community 88 - "Documents Hook & Persistence"
Cohesion: 0.18
Nodes (21): MamPowersTab(), ModifierColumn(), ModifierColumnProps, buildMam3eContributionLedger(), buildMam3ePowerCostEffects(), buildMam3ePowerCostLedgerEntries(), createPowerCostEffect(), ledgerId() (+13 more)

### Community 89 - "Daggerheart Contribution Ledger"
Cohesion: 0.09
Nodes (39): ANCESTRY_ADJUSTMENTS_BY_ID, ancestryByName, classByName, DAGGERHEART_TIER_BREAKPOINTS, DAGGERHEART_TRAITS, DaggerheartAncestryAdjustments, DaggerheartRange, DEFAULT_DAGGERHEART_ANCESTRY_ADJUSTMENTS (+31 more)

### Community 90 - "Dnd35e/Pf1e Derived Math"
Cohesion: 0.31
Nodes (11): addDomainCardActions(), addHopeFeature(), addUniversalMoves(), addWeaponStrikes(), buildLookup(), createDaggerheartLegalActions(), enumerateDaggerheartActions(), NamedEntry (+3 more)

### Community 91 - "Mam Browser Tabs"
Cohesion: 0.05
Nodes (67): CharacterDraftBinding, EncounterDraftSelection, draftEncounterWithAi(), identifyCreatureWithAi(), draftEncounter(), MakeGameCharacter, MakeGameEncounter, MakeGameParams (+59 more)

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
Cohesion: 0.20
Nodes (16): D20LegacyData, D20LegacySpellSlots, recoverD20LegacySpellSlot(), resetD20LegacySpellSlots(), setD20LegacyPreparedSpell(), setD20LegacySpellSlotTotal(), slotPool(), spendD20LegacySpellSlot() (+8 more)

### Community 97 - "Mam3e Derived Math"
Cohesion: 0.06
Nodes (43): buildCharacterCombatant(), BuildCharacterCombatantResult, normalizeSheet(), readArmorClass(), toMagicBonusItems(), toModifierSources(), AttackEconomy, bestAttackAbility() (+35 more)

### Community 98 - "Doc Drift Tests"
Cohesion: 0.06
Nodes (20): BLOCKING_IMPACTS, createCharacterForSystem(), expectNoBlockingViolations(), freezeAnimations(), getCharacterNameInput(), KNOWN_A11Y_DEBT, openLandingPage(), RFC-004 (+12 more)

### Community 99 - "Spell Catalog Parity Tests"
Cohesion: 0.11
Nodes (5): DND35E_SOURCE_BLOCKED_SPELL_IDS, fieldCoverageBaselines, PF1E_SOURCE_ROWS_WITHOUT_SAVING_THROW, SpellModule, spellModules

### Community 100 - "Pf2e Spell Types & Traits"
Cohesion: 0.09
Nodes (24): CombatStatCard(), Props, Props, SheetHeader(), PresentedDerivedQuantity, D20DerivedStats(), DERIVED_ICON_BY_NAME, derivedIcon() (+16 more)

### Community 101 - "Document Storage (IndexedDB)"
Cohesion: 0.12
Nodes (15): CombatTogglesSection(), Props, Condition, ConditionPicker(), Props, availablePf2eToggles(), Dnd5eRiderTogglesSection(), Props (+7 more)

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
Cohesion: 0.10
Nodes (15): baseAuthValue, mockedClearQueuedCampaignsSnapshot, mockedClearQueuedDeletedCampaignIds, mockedDeleteRemoteCampaign, mockedFetchRemoteCampaigns, mockedGetQueuedCampaignsSnapshot, mockedGetQueuedDeletedCampaignIds, mockedGetSyncTombstonedIds (+7 more)

### Community 106 - "Character Card Presenter"
Cohesion: 0.14
Nodes (13): DragContext, NO_HANDLERS, useDragContext(), DragContextValue, DragPayload, DropHandler, DropResolver, MakeDragSource (+5 more)

### Community 107 - "Oracle Panel & Logic"
Cohesion: 0.08
Nodes (32): DragSourceHandlers, MonsterBrowserProps, PartyDockTab(), PartyDockTabProps, ABILITIES, DEFENSES, MamAbilitiesTab(), Props (+24 more)

### Community 108 - "5e Equipment Tab"
Cohesion: 0.16
Nodes (14): useDragSource(), SceneDispatchContext, SceneEmit, useSceneDispatch(), countMutations(), doc(), dropOn(), Harness() (+6 more)

### Community 109 - "Scene Reaction Panel"
Cohesion: 0.17
Nodes (16): compareSpells(), D20SpellsTab(), formatSpellLevel(), Props, titleCase(), Pf2eSpellsTabComponent, D20_ARCANE_SCHOOLS, buildSpellPreparationConcepts() (+8 more)

### Community 110 - "Document Signature Hashing"
Cohesion: 0.05
Nodes (55): Dnd5eTemplateState, AddEffectInput, AddEntryInput, buildAlwaysPreparedSpellParts(), buildArmorClassParts(), buildDnd5eContributionLedger(), buildFeatAutomationParts(), buildListEntry() (+47 more)

### Community 111 - "Resource Pool Tracking"
Cohesion: 0.07
Nodes (42): resolvePf2eArmorClass(), computePf2eAC(), applyDerivedQuantities(), ComputeLayer, DerivedDisplay, DerivedQuantityCase, DerivedQuantitySpec, RFC-003 (+34 more)

### Community 112 - "Bundle Size Check"
Cohesion: 0.05
Nodes (32): appChunk, appChunks, assetsDir, budgets, chunkForModule, chunkGraph, chunkGraphPath, chunks (+24 more)

### Community 113 - "AI Prompt Builders"
Cohesion: 0.16
Nodes (19): AI_GATEWAY_TASKS, CharacterDraftCandidate, CharacterDraftPayload, EncounterDraftPayload, IdentifyCreaturePayload, IllustrateScenePayload, SceneNarrationPayload, buildCharacterDraftPrompt() (+11 more)

### Community 114 - "5e Feat Browser"
Cohesion: 0.18
Nodes (17): AbilityScoreGrid(), buildPointBuyDraft(), buildStandardArrayDraft(), clampPointBuyScore(), emptyPointBuyDraft(), emptyStandardArrayDraft(), isStandardArrayComplete(), isValidPointBuyDraft() (+9 more)

### Community 115 - "Project Dependencies"
Cohesion: 0.09
Nodes (23): ai, @ai-sdk/anthropic, @ai-sdk/google, class-variance-authority, clsx, lucide-react, dependencies, ai (+15 more)

### Community 116 - "Dnd5eEquipmentTab.tsx"
Cohesion: 0.08
Nodes (27): MamAdvantageBrowserTab(), Props, MamArchetypeBrowser, MamArchetypesTabComponent, Props, MamComplicationBrowser, MamComplicationsTab, MamComplicationsTabComponent (+19 more)

### Community 117 - "check-mam-equipment-provenance.mjs"
Cohesion: 0.11
Nodes (28): HIT_DICE, hitDieSize(), hitDieString(), ArmorClassItem, computeDnd5eBaseArmorClass(), Dnd5eUnarmoredDefense, foldArmorClass(), resolveDnd5eArmorClass() (+20 more)

### Community 118 - "dnd5eToolChoices.ts"
Cohesion: 0.11
Nodes (31): cloneDocumentsSnapshot(), documentsChanged(), engineLoadErrorMessage(), prepareDocumentsWithEngines(), prepareDocumentWithEngine(), unresolvedEngineSystemIds(), useDocuments(), withPreparedDocuments() (+23 more)

### Community 119 - "MAM Archetype Browser"
Cohesion: 0.27
Nodes (11): CLASS_TOKENS, d20srdUrl(), FILES, main(), mapCastingTime(), mapDuration(), mapRange(), normalizeName() (+3 more)

### Community 120 - "PF1e Spell Encoder"
Cohesion: 0.27
Nodes (11): CLASS_COLUMNS, main(), mapCastingTime(), mapDuration(), mapRange(), RFC-4180, normalizeName(), parseCsv() (+3 more)

### Community 122 - "PF2e Archetypes Tab"
Cohesion: 0.17
Nodes (14): mam3eAfflictionDC(), mam3eAttackDC(), mam3eAttackHits(), mam3eCriticalDC(), mam3eDamageResistanceDC(), mam3eDegreesOfFailure(), mam3eDegreesOfSuccess(), mam3eEquipmentPoints() (+6 more)

### Community 123 - "3.5e Gear & Weapons"
Cohesion: 0.17
Nodes (12): Surface, surfaceMarkName(), useSurfaceSwitchMetrics(), HiddenSurfaceReport, measureTour(), mountCounts, SURFACES, surfaceWrapper() (+4 more)

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
Nodes (32): Skeleton(), CreationWizard(), CreationWizardProps, framedSteps(), severityWeight(), ValidationSummary(), CreationWizardHostProps, buildDocumentFromPlanIds() (+24 more)

### Community 130 - "legality/pf2e.ts"
Cohesion: 0.15
Nodes (14): ABILITY_KEYS, DND5E_ASI_LEVELS_BY_CLASS, DND5E_BASE_ASI_LEVELS, DND5E_MULTICLASS_PREREQ, dnd5eAsiSlotsGranted(), validateDnd5eBuild(), ABILITY_KEYS, TIER_BONUS (+6 more)

### Community 131 - "Retry With Backoff"
Cohesion: 0.08
Nodes (34): Doc, useSync(), UseSyncOptions, baseAuthValue, mockedClearQueuedDeletedDocumentIds, mockedClearQueuedSyncSnapshot, mockedDeleteRemoteDocument, mockedFetchRemoteDocuments (+26 more)

### Community 132 - "2024 Spell Encoder"
Cohesion: 0.39
Nodes (8): main(), mapCastingTime(), mapDuration(), mapRange(), normalizeName(), SCHOOLS, slug(), ts()

### Community 133 - "MAM Power Browser"
Cohesion: 0.08
Nodes (27): TABLIST_NAV_KEYS, Tabs, TabsContent, TabsContentProps, TabsContext, TabsContextValue, TabsList, TabsProps (+19 more)

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
Cohesion: 0.19
Nodes (12): Pf2eArchetypesTab(), Props, SAVE_ABILITIES, SKILL_ABILITIES, getPf2eSheetChoiceState(), GetPf2eSheetChoiceStateProps, Pf2eChoiceSlot, countTrainedPf2eSkills() (+4 more)

### Community 141 - "useDnd5eTemplateHandlers.ts"
Cohesion: 0.36
Nodes (8): computeBackoffMs(), isRetryableError(), NON_RETRYABLE_FRAGMENTS, PROD_DEFAULTS, RetryOptions, retryWithBackoff(), sleep(), TEST_DEFAULTS

### Community 142 - "TS Base Config"
Cohesion: 0.09
Nodes (18): SystemEngine, D20_SIZE_MOD, d20LegacyCheckPenalty(), D20Roll, DualityRoll, rollD20(), rollDuality(), createLiveRng() (+10 more)

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
Cohesion: 0.07
Nodes (38): LegalActionCost, LegalActionDescriptor, LegalActionEligibility, LegalActionList, LegalActionsContext, LegalActionTarget, SheetProps, SystemCreatorComponent (+30 more)

### Community 147 - "Dnd5eEquipmentTab.tsx"
Cohesion: 0.30
Nodes (11): addMovement(), addReaction(), addSpellcasting(), addStandardActions(), addWeaponAttacks(), createDnd5eLegalActions(), enumerateDnd5eActions(), isEquippedWeapon() (+3 more)

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
Cohesion: 0.10
Nodes (26): Props, CampaignManager(), Props, useCampaigns(), UseCampaignSyncOptions, DebouncedPersistence, IMPORTANT: a begun generation must end in either `persist` or, now (+18 more)

### Community 154 - "Dnd5eEquipmentTab.tsx"
Cohesion: 0.27
Nodes (10): createSupabaseJwtVerifier(), decodeBase64Url(), decodeJsonSegment(), fail(), resolveGatewayAuth(), SupabaseJwtVerifier, b64url(), mintToken() (+2 more)

### Community 155 - "5e Movement Rules"
Cohesion: 0.11
Nodes (16): AuthContextValue, EntitySyncAdapter, reportSyncFailure(), useEntitySync(), UseEntitySyncOptions, baseAuthValue, Item, authValue (+8 more)

### Community 156 - "CharacterListView.tsx"
Cohesion: 0.11
Nodes (22): AppContent(), buildNewCharacterDocument(), cloneSystemData(), CreationWizardHost, LegalNotices, SceneManager, STORAGE_WARNING_THRESHOLD, CharacterSortOption (+14 more)

### Community 158 - "MAM Complication Browser"
Cohesion: 0.09
Nodes (43): validatePf1eBuild(), buildSystem(), CATEGORY_LOADERS, CategoryLoader, escape(), isRecord(), Loaded, main() (+35 more)

### Community 161 - "PF2e Backgrounds Data"
Cohesion: 0.17
Nodes (27): addIssue(), CLASS_PROGRESSION_RANKS, createPf2eValidator(), isIntegerInRange(), loadValidationData(), PF2E_ABILITY_IDS, Pf2eValidationData, toIdMap() (+19 more)

### Community 177 - "characterDraftFlow.test.ts"
Cohesion: 0.06
Nodes (42): CharacterDraftApplier, collectUnknownIdIssues(), DocumentValidator, DraftCharacterParams, DraftCharacterResult, draftCharacterWithAi(), GatewayCall, POOL_LIST_FIELDS (+34 more)

### Community 179 - "useSceneEncounter.ts"
Cohesion: 0.39
Nodes (4): ServiceWorkerUpdateBanner(), isServiceWorkerSupported(), ServiceWorkerUpdateState, useServiceWorkerUpdate()

### Community 180 - "daggerheart/validation.ts"
Cohesion: 0.24
Nodes (21): getDaggerheartStartingTraitArray(), addIssue(), buildLookup(), createDaggerheartValidator(), CUSTOM_INVENTORY_PREFIXES, DaggerheartValidationData, isIntegerInRange(), NamedEntry (+13 more)

### Community 181 - "useEntitySync.ts"
Cohesion: 0.26
Nodes (11): mockedGetQueuedCampaignsSnapshot, mockedGetQueuedDeletedCampaignIds, mockedGetQueuedDeletedDocumentIds, mockedGetQueuedSyncSnapshot, formatDateAndTime(), formatLastSyncedAt(), formatTimeOfDay(), getPendingSyncCount() (+3 more)

### Community 182 - "syncTombstones.ts"
Cohesion: 0.11
Nodes (17): AiImageInput, EncounterDraftCandidate, EncounterDraftData, IdentifyCreatureData, DraftEncounterParams, DraftEncounterResult, GatewayCall, SelectionValidator (+9 more)

### Community 183 - "loadEquipmentForSystem"
Cohesion: 0.50
Nodes (3): Answer, Outcome, Q: where are pending debounced document saves flushed to localStorage on page hide or unload (persistence flush)

### Community 184 - "MamArchetypesTab.tsx"
Cohesion: 0.22
Nodes (19): AppHeader(), AppHeaderProps, assertNever(), INITIAL_NAV_STATE, LIBRARY_SEGMENTS, LibrarySegment, librarySegmentLabel(), Overlay (+11 more)

### Community 186 - "eslint-plugin-react"
Cohesion: 0.40
Nodes (4): Feat, FeatBrowser(), FeatBrowserProps, feats

### Community 187 - "fake-indexeddb"
Cohesion: 0.16
Nodes (18): BACKGROUND_FIELDS(), BASELINE_PATH, buildManifest(), CR_FRACTIONS, EXTRACTORS, HERE, LOADERS, loadProductEntries() (+10 more)

### Community 188 - "dnd35e/validation.ts"
Cohesion: 0.22
Nodes (20): SystemValidator, ValidationContext, ValidationIssue, addIssue(), appendBuildLegalityIssues(), createDnd35eValidator(), Dnd35eValidationData, isIntegerInRange() (+12 more)

### Community 190 - "index.ts"
Cohesion: 0.06
Nodes (41): react, react, clampExhaustion(), Props, RestControls(), useTabs(), SheetAddHandlers, SheetDispatch (+33 more)

### Community 191 - "retryWithBackoff"
Cohesion: 0.29
Nodes (16): addIssue(), createMam3eValidator(), engine, Mam3eValidationData, SPENT_BUCKETS, validateAdvantages(), validateArchetypePins(), validateComplications() (+8 more)

### Community 194 - "@types/react-dom"
Cohesion: 0.07
Nodes (21): Props, SystemSheetRenderer(), SystemRegistry, SystemDefinition, ValidationResult, Pf2eSystemDef, createRegistry(), createRegistry() (+13 more)

### Community 195 - "sceneTerrain.ts"
Cohesion: 0.05
Nodes (56): IllustrateSceneResult, NarrateSceneResult, LibraryScenesView(), CombatPanel(), EncounterPanel(), EncounterPanelProps, formatAverageLevel(), ILLUSTRATION_STYLES (+48 more)

### Community 197 - "DragProvider.tsx"
Cohesion: 0.21
Nodes (9): DragLayer, DragLayerProps, DragProvider(), toSample(), DropTargetRegistration, createDragGesture(), DragGesture, DragGestureOptions (+1 more)

### Community 198 - "mam3e/engine.ts"
Cohesion: 0.22
Nodes (10): collectMam3eConditionEffects(), mam3eToughnessPenalty(), Mam3eEngine, normalizeConditionTrack(), SKILL_ABILITY_MAP, RFC-003, doc(), engine (+2 more)

### Community 199 - "syncTombstones.ts"
Cohesion: 0.31
Nodes (11): NOW, getSyncTombstonedIds(), getSyncTombstones(), pruneExpired(), readStored(), recordSyncTombstones(), removeSyncTombstones(), STORAGE_KEYS (+3 more)

### Community 200 - "useAppNav"
Cohesion: 0.27
Nodes (7): SURFACES, SurfaceStage(), SurfaceStageProps, useAppNav, Harness(), NavControls(), Harness()

### Community 201 - "participantResolution.test.ts"
Cohesion: 0.29
Nodes (9): AreaShape, cellInArea(), cellOnLine(), gridDistance(), tokensInArea(), attackEffect(), fireballDamage(), SID (+1 more)

### Community 202 - "phase3-workflows.spec.ts"
Cohesion: 0.29
Nodes (11): extractJsArray(), field(), main(), MODULES, parseEntries(), prettierBin(), readSource(), slug() (+3 more)

### Community 203 - "aiSdkAdapter.test.mts"
Cohesion: 0.29
Nodes (6): ENCOUNTER_PAYLOAD, RFC-002, promptText(), RecordedMessage, RecordedPrompt, AiTokenUsage

### Community 204 - "systemAssetPrefetch.ts"
Cohesion: 0.28
Nodes (7): SYSTEM_IDS, getSystemAssetPrefetchStateForTests(), prefetchedSystemAssets, prefetchedSystemRuntimeData, prefetchedSystemSheets, resetSystemAssetPrefetchStateForTests(), systemAssetPrefetchers

### Community 205 - "generateUUID"
Cohesion: 0.32
Nodes (6): InventoryItem, InventoryManager(), InventoryManagerProps, MamSkillsAdvantagesTab(), existingItems, generateUUID()

### Community 206 - "useKeyboardNavigation"
Cohesion: 0.43
Nodes (5): getEditableTarget(), KeyboardShortcut, useKeyboardNavigation(), Harness(), HarnessProps

### Community 207 - "sceneConditionOptions.ts"
Cohesion: 0.40
Nodes (4): DND5E_SCENE_CONDITIONS, SCENE_CONDITIONS_BY_SYSTEM, sceneConditionOptions(), D20_LEGACY_CONDITION_IDS

### Community 208 - "DeathSavesTracker.tsx"
Cohesion: 0.50
Nodes (4): clampTrack(), DeathSaves, DeathSavesTracker(), Props

### Community 209 - "dockRegistry.tsx"
Cohesion: 0.70
Nodes (3): DOCK_TABS, DockTabDescriptor, DockTabKind

### Community 210 - "Pf2eHeader.test.tsx"
Cohesion: 0.67
Nodes (3): Pf2eHeader(), makeDocument(), renderHeader()

### Community 212 - "aiSdkAdapter.test.mts"
Cohesion: 0.07
Nodes (31): AiSdkAdapterConfig, createAiSdkAdapter(), IMAGE_TASKS, RFC-002, TASK_SCHEMAS, createAnthropicAdapter(), createGeminiAdapter(), ANTHROPIC_REGISTRATION (+23 more)

### Community 213 - "spikeViewport.ts"
Cohesion: 0.43
Nodes (6): rect, clampCoordinate(), invertPoint(), Rect, Viewport, zoomToCursor()

## Knowledge Gaps
- **1468 isolated node(s):** `semi`, `singleQuote`, `trailingComma`, `printWidth`, `tabWidth` (+1463 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **16 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `CharacterDocument` connect `Oracle Panel & Logic` to `Dnd5e Sheets & E2E Tests`, `Dnd5e Equipment & Features UI`, `Dnd5e Background Templates`, `Dnd5e2024 Engine & Hit Dice`, `Daggerheart Engine`, `Tabs UI Component`, `Scene Combat Resolution`, `Dnd5e Activity Definitions`, `Dnd5e Feat Templates`, `D20 Combat Controls`, `Game System Selector`, `D20 Legacy System Engines`, `Dnd35e Saves & Data Model`, `Daggerheart Data Model`, `System Registry & Renderer`, `Campaign Sync Hooks`, `Daggerheart Inventory`, `Pf2e Character Templates`, `Dnd5e Feature List Sections`, `Encounter & Initiative Panels`, `AI Encounter Drafting`, `Currency & Inventory Editors`, `Check & Oracle Resolution`, `Equipped Armor Section`, `Spell Browser UI`, `Encounter Builder Logic`, `D20 Legacy Templates`, `Campaign Storage & Hooks`, `Spell Preparation Logic`, `SRD Manifest Generator`, `Daggerheart Combatant Builders`, `D20 Legacy Spell Slots`, `ESLint Config`, `AI Gateway Client`, `Character Effects Compilation`, `System Validation Logic`, `Dnd5e Resource Loading Hooks`, `Mam Powers & Cost Ledger`, `Dnd5e Feature Options`, `Document Migrations & Storage`, `Boundary Validation Tests`, `Equipment & Feature Browsers`, `Documents Hook & Persistence`, `Daggerheart Contribution Ledger`, `Dnd35e/Pf1e Derived Math`, `Mam Browser Tabs`, `Skills Tab & Combat Math`, `Mam3e Derived Math`, `Document Storage (IndexedDB)`, `Character Card Presenter`, `5e Equipment Tab`, `Document Signature Hashing`, `Resource Pool Tracking`, `Dnd5eEquipmentTab.tsx`, `check-mam-equipment-provenance.mjs`, `dnd5eToolChoices.ts`, `PF2e Archetypes Tab`, `Daggerheart Sheet Automation`, `legality/pf2e.ts`, `Retry With Backoff`, `MAM Power Browser`, `syncTombstones.ts`, `pf2eConditions.ts`, `TS Base Config`, `Scene Illustration Panel`, `Dnd5eEquipmentTab.tsx`, `ServiceWorkerUpdateBanner.tsx`, `CharacterListView.tsx`, `MAM Complication Browser`, `PF2e Backgrounds Data`, `characterDraftFlow.test.ts`, `daggerheart/validation.ts`, `MamArchetypesTab.tsx`, `dnd35e/validation.ts`, `index.ts`, `retryWithBackoff`, `@types/react-dom`, `sceneTerrain.ts`, `mam3e/engine.ts`, `Pf2eHeader.test.tsx`?**
  _High betweenness centrality (0.134) - this node is a cross-community bridge._
- **Why does `GameSystemId` connect `Class Enhancement & Headers` to `Sheet Resource Loading Hooks`, `Dnd5e Sheets & E2E Tests`, `Dnd5e Equipment & Features UI`, `Tabs UI Component`, `Scene Combat Resolution`, `pf2eConditions.ts`, `App Shell & Layout`, `Game System Selector`, `Dnd5eEquipmentTab.tsx`, `System Registry & Renderer`, `Roadmap Metrics Generator`, `CharacterListView.tsx`, `MAM Complication Browser`, `Pf2e Sheet Tabs`, `Currency & Inventory Editors`, `Doc Drift Rules`, `Spell Browser UI`, `Error Boundary & Auth Context`, `Encounter Builder Logic`, `characterDraftFlow.test.ts`, `Character Combatant Builder`, `AI Gateway Adapters`, `System Definitions & Types`, `SRD Coverage Script`, `ESLint Config`, `Browser Compat & Error Logging`, `sceneTerrain.ts`, `Spell Catalog Consistency Tests`, `systemAssetPrefetch.ts`, `HP & Spell Slot Trackers`, `Equipment & Feature Browsers`, `Mam Browser Tabs`, `Mam3e Derived Math`, `Oracle Panel & Logic`, `Document Signature Hashing`, `check-mam-equipment-provenance.mjs`?**
  _High betweenness centrality (0.066) - this node is a cross-community bridge._
- **Why does `entry()` connect `Skills Tab & Combat Math` to `Dnd5e Background Templates`, `Tabs UI Component`, `Node Runtime Bootstrap`, `Dnd5e Feat Templates`, `Scene Illustration Panel`, `Daggerheart Inventory`, `CharacterListView.tsx`, `AI Encounter Drafting`, `Doc Drift Rules`, `Error Boundary & Auth Context`, `D20 Legacy Templates`, `daggerheart/validation.ts`, `AI Gateway Contracts`, `fake-indexeddb`, `Mam Character Sheet Tabs`, `syncTombstones.ts`, `Dnd5e Feature Options`, `Daggerheart Contribution Ledger`, `Dnd35e/Pf1e Derived Math`, `Pf2e Spell Data Encoder`, `5e Monster Encoder`, `Document Signature Hashing`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **What connects `semi`, `singleQuote`, `trailingComma` to the rest of the system?**
  _1468 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Sheet Resource Loading Hooks` be split into smaller, more focused modules?**
  _Cohesion score 0.08653353814644137 - nodes in this community are weakly interconnected._
- **Should `Dnd5e Sheets & E2E Tests` be split into smaller, more focused modules?**
  _Cohesion score 0.09745293466223699 - nodes in this community are weakly interconnected._
- **Should `Dnd5e Equipment & Features UI` be split into smaller, more focused modules?**
  _Cohesion score 0.07078039927404718 - nodes in this community are weakly interconnected._