# Graph Report - windsurf-project  (2026-07-29)

## Corpus Check
- 918 files · ~764,721 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 5938 nodes · 17180 edges · 205 communities (188 shown, 17 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 168 edges (avg confidence: 0.72)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5d419a7f`
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
- phase3-workflows.spec.ts
- aiSdkAdapter.test.mts
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

## Communities (205 total, 17 thin omitted)

### Community 0 - "Sheet Resource Loading Hooks"
Cohesion: 0.08
Nodes (62): ancestryPool(), backgroundPool(), classPool(), loadCharacterDraftPools(), NamedEntity, toCandidates(), RFC-002, useDaggerheartSheetResources() (+54 more)

### Community 1 - "Dnd5e Sheets & E2E Tests"
Cohesion: 0.09
Nodes (32): categoryIcons, GameSystemSelector(), GameSystemSelectorProps, systemAccents, supportBadgeLabels, supportBadgeStyles, SummaryState, SYSTEM_IDS (+24 more)

### Community 2 - "Dnd5e Equipment & Features UI"
Cohesion: 0.09
Nodes (31): dnd35eAbilityIncreases(), dnd35eConcentrationDCDamage(), dnd35eConcentrationDCDefensive(), dnd35eFeatsFromLevel(), dnd35eHpState, dnd35eLevelForXp(), dnd35eTriggersMassiveDamage(), dnd35eXpForLevel() (+23 more)

### Community 3 - "Dnd5e Background Templates"
Cohesion: 0.05
Nodes (85): Dnd5eSelectedFeatsSection(), Props, countSelections(), optionDisabledForRequirement(), resolveEquipmentSlot(), resolveFeatSelections(), toEquippedItem(), toWeaponDamage() (+77 more)

### Community 4 - "Dnd5e2024 Engine & Hit Dice"
Cohesion: 0.07
Nodes (28): HIT_DICE, hitDieSize(), hitDieString(), Dnd5e2024Engine, hasAlertFeat(), totalCharacterLevel(), DND5E_CONDITION_NAMES, hasDnd5eCondition() (+20 more)

### Community 5 - "Daggerheart Engine"
Cohesion: 0.08
Nodes (49): applyDnd5eClassTemplate(), applyDnd5eSubclassTemplate(), assertMulticlassRequirements(), ATTRIBUTE_NAME_TO_ID, buildChoiceSlots(), buildDerivedProficiencies(), buildSpellcastingState(), canSelectSubclass() (+41 more)

### Community 6 - "3.5e Monster Data Encoder"
Cohesion: 0.06
Nodes (56): ALIGNMENTS, DICE_PROGRESSIONS, main(), mapAlignment(), MONSTER_SIZE, normalizeName(), OLIMOT_FILES, resolveSizeRoll() (+48 more)

### Community 7 - "Tabs UI Component"
Cohesion: 0.07
Nodes (41): Badge(), BadgeProps, badgeVariants, D20LegacyHeader(), Props, DaggerheartCharacterBasicsSection(), Props, DaggerheartDowntimeControls() (+33 more)

### Community 8 - "Node Runtime Bootstrap"
Cohesion: 0.09
Nodes (49): main(), runBootstrapNodeInstall(), getPinnedCommandArgs(), main(), runPinnedNpmCommand(), formatRuntimeDoctorReport(), main(), readWorkflowPinSource() (+41 more)

### Community 9 - "Scene Combat Resolution"
Cohesion: 0.04
Nodes (92): buildScene(), BuildEncounterEventsResult, buildEncounterSceneEvents(), intersectBounds(), makeUniqueTokenId(), isOracleAnswer(), appendSceneEvent(), applyHitPointDelta() (+84 more)

### Community 10 - "Dnd5e Class Templates"
Cohesion: 0.25
Nodes (16): makeAsset(), makeSceneWithMap(), clearMapAssetStorage(), createMapAsset(), CreateMapAssetResult, deleteMapAsset(), isMapAssetShape(), isRecord() (+8 more)

### Community 11 - "System Compute Registers"
Cohesion: 0.12
Nodes (19): AuthContext, clearLocalDataForAccountChange(), getLastSyncedUserId(), setLastSyncedUserId(), AuthProvider(), AuthCallback, mockedGetSupabaseClient, mockedIsSupabaseConfigured (+11 more)

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
Cohesion: 0.08
Nodes (37): ArmorClassItem, computeDnd5eBaseArmorClass(), Dnd5eUnarmoredDefense, foldArmorClass(), resolveD20LegacyArmorClass(), resolveDnd5eArmorClass(), contextWithConditionIds(), resolveCharacterEffects() (+29 more)

### Community 16 - "App Shell & Layout"
Cohesion: 0.07
Nodes (38): Pf2eSpellBrowserPanel, Pf2eSpellBrowserPanelComponent, Props, SpellBrowser, Pf2eSpellsTabComponent, Props, Pf2eSpellcasting, focusPulseSpell (+30 more)

### Community 17 - "D20 Combat Controls"
Cohesion: 0.13
Nodes (22): Dnd5eTemplateState, AddEffectInput, AddEntryInput, buildAlwaysPreparedSpellParts(), buildArmorClassParts(), buildDnd5eContributionLedger(), buildFeatAutomationParts(), buildListEntry() (+14 more)

### Community 18 - "Game System Selector"
Cohesion: 0.06
Nodes (65): clampTrack(), DeathSaves, DeathSavesTracker(), Props, EquippedItemsSection(), Props, SLOT_LABELS, SLOT_ORDER (+57 more)

### Community 19 - "Combat & Recap Panels"
Cohesion: 0.17
Nodes (13): DEFAULT_LABELS, SpellBrowser(), SpellBrowserLabels, SpellBrowserProps, SpellBrowserSpell, Dnd5eSpellsTabComponent, Props, SpellBrowser (+5 more)

### Community 20 - "D20 Legacy System Engines"
Cohesion: 0.20
Nodes (12): clampDaggerheartInventoryQuantity(), createDaggerheartInventoryEntry(), daggerheartInventoryDefinitions, inventoryDefinitionById, inventoryDefinitionByName, isDaggerheartConsumableDefinition(), normalizeDaggerheartCurrency(), normalizeInteger() (+4 more)

### Community 21 - "Dnd35e Saves & Data Model"
Cohesion: 0.04
Nodes (66): d20LegacyCheckPenalty(), D20Save, D20SaveId, Props, SAVE_IDS, createDefaultDnd35eData(), Dnd35eClassLevel, Dnd35eDataModel (+58 more)

### Community 22 - "Daggerheart Data Model"
Cohesion: 0.14
Nodes (13): CurrencyEditor(), CurrencyEntry, DND_CURRENCIES, Props, InventoryItem, InventoryManager(), InventoryManagerProps, Currency (+5 more)

### Community 23 - "System Registry & Renderer"
Cohesion: 0.04
Nodes (44): conditionImposesDisadvantage(), dnd5eEditionOf(), Dnd5e2024Sheet(), Dnd5eSheet(), createDefaultDnd5eData(), Dnd5eEngine, DND5E_DERIVED_QUANTITIES, Dnd5eSheetBase() (+36 more)

### Community 24 - "Game Rules & Proficiencies"
Cohesion: 0.07
Nodes (34): GAME_RULES, ArmorProficiency, ArmorProficiencyType, ArtisanToolProficiency, GamingSetProficiency, isValidArmorProficiency(), isValidSkillProficiency(), isValidToolProficiency() (+26 more)

### Community 25 - "Campaign Sync Hooks"
Cohesion: 0.20
Nodes (18): mockedGetSupabaseClient, getSupabaseClient(), extractTombstone(), fetchRemoteCampaigns(), fromRemoteCampaign(), getCurrentUserId(), getDocumentVersion(), pushCampaign() (+10 more)

### Community 26 - "Daggerheart Inventory"
Cohesion: 0.12
Nodes (26): findDaggerheartInventoryDefinitionByName(), ancestryLookup, armorLookup, buildLookup(), classLookup, communityLookup, DEFAULTS, domainCardByName (+18 more)

### Community 27 - "Pf2e Character Templates"
Cohesion: 0.12
Nodes (40): createPf2eCreationPlan(), abilityBoostValue(), ancestryFeatures(), applyAbilityAdjustments(), applyPf2eAncestryTemplate(), applyPf2eArchetypeTemplate(), applyPf2eBackgroundTemplate(), applyPf2eClassTemplate() (+32 more)

### Community 28 - "Roadmap Metrics Generator"
Cohesion: 0.09
Nodes (40): applyRepoResidentOverrides(), buildComputeCompletion(), buildContentCoverage(), buildMarkdownReport(), ComputeCompletionRow, computeMetrics(), ContentCoverageRow, createEmptyCategoryCounts() (+32 more)

### Community 29 - "Dnd5e Feature List Sections"
Cohesion: 0.08
Nodes (44): mod(), DamageHealControl(), DamageHealControlProps, DiceRollButton(), DiceRollButtonProps, clampExhaustion(), Props, RestControls() (+36 more)

### Community 30 - "Encounter & Initiative Panels"
Cohesion: 0.08
Nodes (23): createDefaultPf2eData(), PF2E_ARCHETYPE_DEDICATION_GRANTS, Pf2eClassLevel, Pf2eDedicationProficiencyCategory, Pf2eDedicationProficiencyGrant, Pf2eFeat, Pf2eProficiencyTier, tierBonus() (+15 more)

### Community 31 - "Class Enhancement & Headers"
Cohesion: 0.14
Nodes (19): useLazyResource(), useSystemOptions(), useD20LegacySheetResources(), Pf2eSpellsTab, usePf2eSheetResources(), loadArchetypesForSystem(), loadDnd35eEquipment(), loadDnd5e2014Equipment() (+11 more)

### Community 32 - "Pf2e Sheet Tabs"
Cohesion: 0.05
Nodes (59): DND5E_SCENE_CONDITIONS, SCENE_CONDITIONS_BY_SYSTEM, buildCharacterCombatant(), BuildCharacterCombatantResult, toMagicBonusItems(), toModifierSources(), compileEquipmentEffects(), equipStackPolicy() (+51 more)

### Community 33 - "AI Encounter Drafting"
Cohesion: 0.21
Nodes (12): DEFAULT_QUICK_ROLLS, DicePanel(), DicePanelProps, formatBreakdown(), QUICK_ROLLS_BY_SYSTEM, applyKeep(), DiceRollResult, DiceTerm (+4 more)

### Community 34 - "Quest & Session Log UI"
Cohesion: 0.13
Nodes (27): Props, QuestList(), STATUS_BADGE, STATUS_OPTIONS, DATE_FORMAT, Props, SessionLog(), T0 (+19 more)

### Community 35 - "Currency & Inventory Editors"
Cohesion: 0.21
Nodes (11): MamArchetypeBrowser(), MamArchetypeBrowserProps, applyMam3eToughnessFailure(), getMam3eSheetState(), GetMam3eSheetStateProps, uniqueNonEmptyStrings(), createEmptyMam3eConditionTrack(), createEmptyMam3ePower() (+3 more)

### Community 36 - "Document Sync Engine"
Cohesion: 0.04
Nodes (140): PendingMonster, buildSceneCombatants(), critModelForScene(), degreeModelForScene(), factionForToken(), ResolveCombatStats, resolveSceneAreaEffect(), resolveSceneAttack() (+132 more)

### Community 37 - "Sheet Header & Stat Cards"
Cohesion: 0.27
Nodes (8): ToastContext, ToastContextValue, ToastItem, ToastProvider(), VARIANT_ICONS, VARIANT_STYLES, registerToastHandler(), ToastVariant

### Community 38 - "Check & Oracle Resolution"
Cohesion: 0.06
Nodes (21): @testing-library/jest-dom, PartyDockTab(), registerAllSystems(), openBrokenSheet(), MockBeforeInstallPromptEvent, CREATED_AT, roundTrip(), UPDATED_AT (+13 more)

### Community 39 - "Mam3e Data Model & Engine"
Cohesion: 0.05
Nodes (53): FeaturesSection(), Props, ProficiencyListSection(), Props, ArmorClassCharacter, casterTypes, classResourcesNeeded, classTags (+45 more)

### Community 40 - "Doc Drift Rules"
Cohesion: 0.06
Nodes (57): DOC_DRIFT_MANIFEST, DocDriftRuleType, DocDriftSurface, DocDriftSurfaceKind, CAPABILITY_PHRASE_RULES, CapabilityPhraseRule, capitalizeSupportLevel(), COMMAND_RUNTIME_RULES (+49 more)

### Community 41 - "NPM Build Scripts"
Cohesion: 0.04
Nodes (56): scripts, analyze, bootstrap:node, build, check:bundle-size, check:compute-register, check:compute-register:mutate, check:compute-register:write (+48 more)

### Community 42 - "Condition Effects by System"
Cohesion: 0.13
Nodes (11): byId, byName, failures, manifest, manifestByName, originalSources, root, seenSrdNames (+3 more)

### Community 43 - "Equipped Armor Section"
Cohesion: 0.09
Nodes (29): EquipArmorInput, EquipEntry, EquippedArmorSection(), EquipShieldInput, Props, SheetDispatch, Dock(), DockResources (+21 more)

### Community 44 - "Spell Browser UI"
Cohesion: 0.10
Nodes (29): BrowserFeat, DockPanel(), DockPanelProps, DockProps, EquipmentBrowser, EquipmentBrowserItem, EquipmentBrowserProps, FeatBrowser (+21 more)

### Community 45 - "Scene Combat Area Effects"
Cohesion: 0.17
Nodes (15): buildNotice(), FetchTarget, fetchValidated(), HTML_ENTITIES, looksLikeHtml(), main(), normalize(), noticePath (+7 more)

### Community 46 - "Error Boundary & Auth Context"
Cohesion: 0.10
Nodes (28): D20ClassesSection(), D20LegacyClassLevel, Props, renderClassOptions(), d20BonusSpells(), buildD20LegacySpellSlotTotals(), countAdvancementLevels(), D20_DOMAIN_CLASS_IDS (+20 more)

### Community 47 - "Encounter Builder Logic"
Cohesion: 0.13
Nodes (32): createD20LegacyCreationPlan(), applyAbilityAdjustments(), applyD20LegacyClassTemplate(), applyD20LegacyRaceTemplate(), buildClassSkills(), classFeaturesUpToLevel(), classSkillOptions(), collectClassFeatureSignatures() (+24 more)

### Community 48 - "Scene Management Hooks"
Cohesion: 0.09
Nodes (43): SceneCreateFormProps, mergeLoadedScenes(), useScenes(), NOW, NOW, defineSetItem(), installLocalStorageQuota(), makeHeavyScene() (+35 more)

### Community 49 - "Monster Combatant Builder"
Cohesion: 0.03
Nodes (80): NarrateSceneResult, CheckPanel(), CheckPanelProps, DEFAULT_SUGGESTIONS, DND5E_SKILLS, OUTCOME_BADGE, OUTCOME_LABEL, SKILL_SUGGESTIONS_BY_SYSTEM (+72 more)

### Community 50 - "D20 Legacy Templates"
Cohesion: 0.22
Nodes (23): clearAllStress(), clearStress(), prepareGainHope(), repairAllArmor(), repairArmor(), tendToAllWounds(), tendToWounds(), RFC-005 (+15 more)

### Community 51 - "Campaign Storage & Hooks"
Cohesion: 0.27
Nodes (9): makeScene(), campaignSignatureFor(), sameCampaignSignatures(), sameDocumentSignatures(), sameSceneSignatures(), sameSignatureMultisets(), sceneSignatureFor(), signatureFor() (+1 more)

### Community 52 - "Spell Preparation Logic"
Cohesion: 0.16
Nodes (11): Mam3eSystemDef, RFC-003, createHero(), power(), TEST_DATE, createDocument(), legalBuild(), mam3eEngine (+3 more)

### Community 53 - "Dev Dependencies"
Cohesion: 0.04
Nodes (47): autoprefixer, @axe-core/playwright, eslint, eslint-config-prettier, @eslint/js, eslint-plugin-react, eslint-plugin-react-hooks, happy-dom (+39 more)

### Community 54 - "Character Combatant Builder"
Cohesion: 0.11
Nodes (23): AI_TASK_UNIT_COST, AiTask, TaskGatewayCall, AnyTaskGatewayCall, createFlowBudget(), DEFAULT_MAKE_GAME_FLOW_BUDGET, FlowBudget, FlowBudgetLimits (+15 more)

### Community 56 - "SRD Manifest Generator"
Cohesion: 0.08
Nodes (54): appendInventoryFromBackground(), applyDnd5eBackgroundTemplate(), BackgroundChoiceSlot, BackgroundChoiceValue, backgroundDerivedState(), COMMON_LANGUAGE_OPTIONS, Dnd5eBackgroundTemplateSelections, Dnd5eLikeDataModel (+46 more)

### Community 57 - "Daggerheart Combatant Builders"
Cohesion: 0.11
Nodes (24): feat, item, monster, spell, EMPTY, useDockResources(), UseD20LegacySheetResourcesProps, UseDaggerheartSheetResourcesProps (+16 more)

### Community 58 - "AI Gateway Adapters"
Cohesion: 0.07
Nodes (41): AI_GATEWAY_SCHEMA_VERSION, aiFailure, AiFailureCode, AiResponse, AiTaskClass, GatewayContext, GatewayTimeoutError, handleAiRequest() (+33 more)

### Community 59 - "AI Gateway Contracts"
Cohesion: 0.12
Nodes (33): AI_TASK_CLASS, AiParse, AiSuccess, AiUsage, CharacterDraftRequest, EncounterDraftRequest, IdentifyCreatureRequest, IllustrateSceneRequest (+25 more)

### Community 60 - "System Definitions & Types"
Cohesion: 0.18
Nodes (11): GeneratedImageData, IllustrateGatewayCall, IllustrateSceneParams, IllustrateSceneResult, illustrateSceneWithAi(), RFC-002, ILLUSTRATION_STYLES, IllustrationPanel() (+3 more)

### Community 61 - "D20 Legacy Spell Slots"
Cohesion: 0.06
Nodes (46): ABILITIES, DEFENSES, Mam3eCreator(), Mam3eCreatorProps, SKILLS, buildMam3eCreatorData(), createDefaultMam3eDefenseRanks(), DERIVATION_EPOCH (+38 more)

### Community 62 - "SRD Coverage Script"
Cohesion: 0.06
Nodes (56): buildManifest(), CLASSES, CLASSIFICATION_PATH, HERE, LICENSING_CLASSES, loadShipped(), MANIFEST_PATH, run() (+48 more)

### Community 63 - "ESLint Config"
Cohesion: 0.21
Nodes (8): TokenHpBar(), ButtonProps, buttonVariants, OverflowMenu(), OverflowMenuItem, OverflowMenuProps, Skeleton(), cn()

### Community 64 - "Spells Tab Components"
Cohesion: 0.15
Nodes (20): actionReachCells(), ATTACK_COUNT_WORDS, averageDie(), buildMonsterCombatant(), dieFaces(), isMinusSign(), monsterAttackEffects(), monsterAttacksPerRound() (+12 more)

### Community 65 - "Browser Compat & Error Logging"
Cohesion: 0.11
Nodes (25): Props, State, LegalNotices(), LegalNoticesProps, licenseTexts, LibraryBestiaryView(), LoadState, MonsterBrowser (+17 more)

### Community 66 - "AI Gateway Client"
Cohesion: 0.38
Nodes (10): CharacterCard(), asNumber(), asRecord(), asString(), getClassLabel(), getDocumentLevelValue(), getHitPointLabel(), getLevelLabel() (+2 more)

### Community 67 - "2024 Monster Data Encoder"
Cohesion: 0.16
Nodes (23): ABILITIES, ALIGNMENTS, bucketFor(), classifyImmunityList(), cleanProse(), CR_FRACTIONS, CREATURE_TYPES, DAMAGE_TYPES (+15 more)

### Community 68 - "Character Effects Compilation"
Cohesion: 0.07
Nodes (32): getDaggerheartShortRestRecovery(), createDefaultDaggerheartData(), DaggerheartDataModel, DaggerheartSystemDef, DomainCardEntry, useDaggerheartMutationHandlers(), UseDaggerheartMutationHandlersProps, TEST_DATE (+24 more)

### Community 69 - "TypeScript Config"
Cohesion: 0.07
Nodes (27): ES2020, src, compilerOptions, allowImportingTsExtensions, baseUrl, forceConsistentCasingInFileNames, isolatedModules, jsx (+19 more)

### Community 70 - "Mam Character Sheet Tabs"
Cohesion: 0.06
Nodes (48): daggerheartComputeRegister, dnd35eComputeRegister, dnd5e2014ComputeRegister, dnd5e2024ComputeRegister, COMPUTE_REGISTERS, registerForSystem(), mam3eComputeRegister, MUTATION_ANCHORS (+40 more)

### Community 72 - "Dice Panel & Mam3e Resolution"
Cohesion: 0.08
Nodes (28): counterStore, latencyBudgetsFromEnv(), positiveEnv(), rateLimiterFromEnv(), sessionBudgetFromEnv(), anthropicAdapter, googleAdapter, Clock (+20 more)

### Community 73 - "System Validation Logic"
Cohesion: 0.12
Nodes (35): ABILITY_KEYS, DND5E_ASI_LEVELS_BY_CLASS, DND5E_BASE_ASI_LEVELS, DND5E_MULTICLASS_PREREQ, dnd5eAsiSlotsGranted(), validateDnd5eBuild(), dnd5eKnownSpellLimit(), dnd5eKnownSpellOverage() (+27 more)

### Community 74 - "Spell Catalog Consistency Tests"
Cohesion: 0.08
Nodes (43): ALL_SYSTEMS, ALLOWED_BY_ID, ALLOWLIST, allowlistHits, auditCitation(), auditRulesLayerLiterals(), CATEGORY_LOADERS, cleared (+35 more)

### Community 75 - "Dnd5e Resource Loading Hooks"
Cohesion: 0.11
Nodes (33): getDaggerheartAncestryAdjustments(), EMPTY_WEAPON_LOADOUT, applyDaggerheartAncestryTemplate(), applyDaggerheartClassTemplate(), applyDaggerheartCommunityTemplate(), classTemplateItems(), communityTemplateItems(), DaggerheartInventoryEntry (+25 more)

### Community 76 - "Mam Powers & Cost Ledger"
Cohesion: 0.13
Nodes (24): buildSystem(), CATEGORY_LOADERS, CategoryLoader, escape(), isRecord(), Loaded, main(), SystemConfig (+16 more)

### Community 78 - "Dnd5e Feature Options"
Cohesion: 0.08
Nodes (39): Dnd5eFeatureOptionsSection(), Dnd5eFeatureOptionsSectionComponent, FeatureOptionBrowser, FeatureOptionBrowserProps, featureOptionSelectionKey(), Props, FeatureOptionBrowser(), FeatureOptionBrowserProps (+31 more)

### Community 79 - "Document Migrations & Storage"
Cohesion: 0.10
Nodes (36): baseV2Document, NOTE: localStorage spies survive vi.restoreAllMocks in jsdom — restore manually., NOTE: localStorage spies survive vi.restoreAllMocks in jsdom — restore manually., makeDoc(), StubTransaction, migrateDocument(), MIGRATIONS, clearDocumentStorage() (+28 more)

### Community 80 - "App Header & Auth UI"
Cohesion: 0.36
Nodes (7): ThemeToggle(), applyTheme(), getSystemTheme(), isTheme(), Theme, useTheme(), VALID_THEMES

### Community 82 - "HP & Spell Slot Trackers"
Cohesion: 0.09
Nodes (25): CharacterDraftChoice, CharacterDraftOutcome, AI_GATEWAY_ENDPOINT, AiRequest, SceneNarrationData, BY_DESIGN_FAILURE_CODES, callAiGateway(), isAiEnabled() (+17 more)

### Community 84 - "Boundary Validation Tests"
Cohesion: 0.24
Nodes (19): NOW, parseImg(), validDocInput(), coerceDate(), coerceObjectives(), coerceQuests(), coerceSceneMapReference(), coerceSessionLog() (+11 more)

### Community 85 - "capabilityScenarios.test.tsx"
Cohesion: 0.60
Nodes (3): formatModifierCost(), MamPowerModifierBrowser(), MamPowerModifierBrowserProps

### Community 86 - "Equipment & Feature Browsers"
Cohesion: 0.26
Nodes (10): DISPOSITION_BADGE, DISPOSITION_LABEL, ReactionHistoryEntry, ReactionPanel(), ReactionPanelProps, dispositionForTotal(), resolveReaction(), rollReaction() (+2 more)

### Community 87 - "Pf2e Engine & Constants"
Cohesion: 0.09
Nodes (20): GapLedgerItem, LedgerPhase, LedgerStatus, LedgerTag, LedgerTrack, MASTER_GAP_LEDGER, RFC-003, byPhase (+12 more)

### Community 88 - "Documents Hook & Persistence"
Cohesion: 0.08
Nodes (41): ACTION_LIMIT_BOUNDARY, collectMam3eConditionEffects(), MAM3E_STATE_NOTES, mam3eToughnessPenalty(), MamConditionsTab(), Props, MamPowersTab(), ModifierColumn() (+33 more)

### Community 89 - "Daggerheart Contribution Ledger"
Cohesion: 0.07
Nodes (55): buildDaggerheartCombatant(), BuildDaggerheartCombatantResult, RANGE_CELLS, ANCESTRY_ADJUSTMENTS_BY_ID, ancestryByName, classByName, DAGGERHEART_TIER_BREAKPOINTS, DAGGERHEART_TRAITS (+47 more)

### Community 90 - "Dnd35e/Pf1e Derived Math"
Cohesion: 0.31
Nodes (11): addDomainCardActions(), addHopeFeature(), addUniversalMoves(), addWeaponStrikes(), buildLookup(), createDaggerheartLegalActions(), enumerateDaggerheartActions(), NamedEntry (+3 more)

### Community 91 - "Mam Browser Tabs"
Cohesion: 0.04
Nodes (96): EncounterDraftSelection, draftEncounterWithAi(), identifyCreatureWithAi(), fileToAiImageInput(), readAsDataUrl(), draftEncounter(), MakeGameEncounter, MakeGameParams (+88 more)

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
Cohesion: 0.19
Nodes (18): availableD20LegacyToggles(), presentDerivedQuantities(), D20LegacyData, D20LegacySpellSlots, recoverD20LegacySpellSlot(), resetD20LegacySpellSlots(), setD20LegacyPreparedSpell(), setD20LegacySpellSlotTotal() (+10 more)

### Community 97 - "Mam3e Derived Math"
Cohesion: 0.05
Nodes (46): CombatTogglesSection(), Props, Condition, ConditionPicker(), Props, normalizeSheet(), readArmorClass(), AttackEconomy (+38 more)

### Community 98 - "Doc Drift Tests"
Cohesion: 0.06
Nodes (20): BLOCKING_IMPACTS, createCharacterForSystem(), expectNoBlockingViolations(), freezeAnimations(), getCharacterNameInput(), KNOWN_A11Y_DEBT, openLandingPage(), RFC-004 (+12 more)

### Community 99 - "Spell Catalog Parity Tests"
Cohesion: 0.11
Nodes (5): DND35E_SOURCE_BLOCKED_SPELL_IDS, fieldCoverageBaselines, PF1E_SOURCE_ROWS_WITHOUT_SAVING_THROW, SpellModule, spellModules

### Community 100 - "Pf2e Spell Types & Traits"
Cohesion: 0.05
Nodes (50): AbilityScoreGrid(), buildPointBuyDraft(), buildStandardArrayDraft(), clampPointBuyScore(), emptyPointBuyDraft(), emptyStandardArrayDraft(), isStandardArrayComplete(), isValidPointBuyDraft() (+42 more)

### Community 101 - "Document Storage (IndexedDB)"
Cohesion: 0.19
Nodes (15): CREATURE_XP_BY_LEVEL_DIFF, pf2eAttackModifier(), pf2eCreatureXP(), Pf2eDegree, pf2eDyingAfterRecovery(), pf2eEncounterBudget(), pf2eInitialDying(), pf2eIsDead() (+7 more)

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
Cohesion: 0.09
Nodes (31): useCampaignSync(), baseAuthValue, mockedClearQueuedCampaignsSnapshot, mockedClearQueuedDeletedCampaignIds, mockedDeleteRemoteCampaign, mockedFetchRemoteCampaigns, mockedGetQueuedCampaignsSnapshot, mockedGetQueuedDeletedCampaignIds (+23 more)

### Community 106 - "Character Card Presenter"
Cohesion: 0.04
Nodes (61): AllegianceChip(), AllegianceChipProps, DragContext, NO_HANDLERS, useDragContext(), useDragSource(), DragLayer, DragLayerProps (+53 more)

### Community 107 - "Oracle Panel & Logic"
Cohesion: 0.06
Nodes (49): CharacterDraftProposal, MakeGameCharacter, Props, CharacterCardProps, CharacterListViewProps, UseSceneEncounterParams, Props, Props (+41 more)

### Community 108 - "5e Equipment Tab"
Cohesion: 0.15
Nodes (12): CurrencyEditor, CurrencyEditorProps, Dnd5eEquipmentTabComponent, EquipmentBrowser, EquipmentBrowserItem, EquipmentBrowserProps, EquippedItemsSection, EquippedItemsSectionProps (+4 more)

### Community 109 - "Scene Reaction Panel"
Cohesion: 0.21
Nodes (15): compareSpells(), D20SpellsTab(), formatSpellLevel(), Props, titleCase(), D20_ARCANE_SCHOOLS, buildSpellPreparationConcepts(), compareSpellEntries() (+7 more)

### Community 110 - "Document Signature Hashing"
Cohesion: 0.09
Nodes (30): dnd5eCarryingCapacity(), dnd5eHighJump(), dnd5eLongJump(), dnd5ePushDragLift(), dnd5eSpeedWithArmor(), Dnd5eLikeDataModel, featureOptionSelectionKey(), ABILITY_TOKEN_MAP (+22 more)

### Community 111 - "Resource Pool Tracking"
Cohesion: 0.08
Nodes (40): resolvePf2eArmorClass(), computePf2eAC(), collectPf2eCheckConditionEffects(), ConditionScope, getPf2eConditionStatusPenalty(), highestValue(), magnitude(), PF2E_STATUS_CONDITIONS (+32 more)

### Community 112 - "Bundle Size Check"
Cohesion: 0.05
Nodes (32): appChunk, appChunks, assetsDir, budgets, chunkForModule, chunkGraph, chunkGraphPath, chunks (+24 more)

### Community 113 - "AI Prompt Builders"
Cohesion: 0.16
Nodes (19): AI_GATEWAY_TASKS, CharacterDraftCandidate, CharacterDraftPayload, EncounterDraftPayload, IdentifyCreaturePayload, IllustrateScenePayload, SceneNarrationPayload, buildCharacterDraftPrompt() (+11 more)

### Community 114 - "5e Feat Browser"
Cohesion: 0.33
Nodes (8): Mode, SignIn(), SignInProps, Button, UserMenu(), UserMenuProps, useAuth(), SyncState

### Community 115 - "Project Dependencies"
Cohesion: 0.09
Nodes (23): ai, @ai-sdk/anthropic, @ai-sdk/google, class-variance-authority, clsx, lucide-react, dependencies, ai (+15 more)

### Community 116 - "Dnd5eEquipmentTab.tsx"
Cohesion: 0.11
Nodes (20): MamArchetypeBrowser, MamArchetypesTabComponent, Props, MamComplicationBrowser, MamComplicationsTabComponent, Props, formatMamPowerAction(), formatMamPowerDuration() (+12 more)

### Community 117 - "check-mam-equipment-provenance.mjs"
Cohesion: 0.25
Nodes (14): D20SkillsTab(), Props, Skill, daggerheartDamageDiceCount(), DND35E_SYNERGY_SOURCES, dnd35eMaxSkillRanks(), dnd35eSkillSynergyTotal(), dnd35eSynergyBonus() (+6 more)

### Community 118 - "dnd5eToolChoices.ts"
Cohesion: 0.12
Nodes (21): DebouncedPersistence, IMPORTANT: a begun generation must end in either `persist` or, useDebouncedPersistence(), cloneDocumentsSnapshot(), documentsChanged(), engineLoadErrorMessage(), prepareDocumentsWithEngines(), prepareDocumentWithEngine() (+13 more)

### Community 119 - "MAM Archetype Browser"
Cohesion: 0.27
Nodes (11): CLASS_TOKENS, d20srdUrl(), FILES, main(), mapCastingTime(), mapDuration(), mapRange(), normalizeName() (+3 more)

### Community 120 - "PF1e Spell Encoder"
Cohesion: 0.27
Nodes (11): CLASS_COLUMNS, main(), mapCastingTime(), mapDuration(), mapRange(), RFC-4180, normalizeName(), parseCsv() (+3 more)

### Community 122 - "PF2e Archetypes Tab"
Cohesion: 0.42
Nodes (8): applyDnd5eLongRest(), applyDnd5eShortRest(), recoverAllSpellSlots(), recoverFeatures(), recoverLongRestHitDice(), recoverPactMagicSlots(), slotPool(), ResourcePool

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
Nodes (34): CreationWizard(), CreationWizardProps, framedSteps(), severityWeight(), ValidationSummary(), buildDocumentFromPlanIds(), buildWorkingDocument(), buildWorkingDocumentEnvelope() (+26 more)

### Community 130 - "legality/pf2e.ts"
Cohesion: 0.46
Nodes (4): ABILITY_KEYS, TIER_BONUS, BuildLegalityResult, BuildViolation

### Community 131 - "Retry With Backoff"
Cohesion: 0.08
Nodes (30): Doc, useSync(), UseSyncOptions, baseAuthValue, mockedClearQueuedDeletedDocumentIds, mockedClearQueuedSyncSnapshot, mockedDeleteRemoteDocument, mockedFetchRemoteDocuments (+22 more)

### Community 132 - "2024 Spell Encoder"
Cohesion: 0.39
Nodes (8): main(), mapCastingTime(), mapDuration(), mapRange(), normalizeName(), SCHOOLS, slug(), ts()

### Community 133 - "MAM Power Browser"
Cohesion: 0.06
Nodes (37): TABLIST_NAV_KEYS, Tabs, TabsContent, TabsContentProps, TabsContext, TabsContextValue, TabsList, TabsProps (+29 more)

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
Cohesion: 0.13
Nodes (24): LegalActionDescriptor, addAttackOfOpportunity(), addAttacks(), addCombatActions(), addFullAttack(), addSpellcasting(), createD20LegacyLegalActions(), D20LegacyActionData (+16 more)

### Community 139 - "Prettier Config"
Cohesion: 0.22
Nodes (8): arrowParens, endOfLine, overrides, printWidth, semi, singleQuote, tabWidth, trailingComma

### Community 140 - "pf2eConditions.ts"
Cohesion: 0.12
Nodes (22): Pf2eArchetypesTab(), Props, getPf2eSheetChoiceState(), GetPf2eSheetChoiceStateProps, Pf2eChoiceSlot, countTrainedPf2eSkills(), longRestPf2eSpellcasting(), nextPf2eTier() (+14 more)

### Community 141 - "useDnd5eTemplateHandlers.ts"
Cohesion: 0.36
Nodes (8): computeBackoffMs(), isRetryableError(), NON_RETRYABLE_FRAGMENTS, PROD_DEFAULTS, RetryOptions, retryWithBackoff(), sleep(), TEST_DEFAULTS

### Community 142 - "TS Base Config"
Cohesion: 0.24
Nodes (6): D20Roll, DualityRoll, rollD20(), rollDuality(), createLiveRng(), Rng

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
Cohesion: 0.22
Nodes (13): LegalActionCost, addBasicActions(), addPowerActions(), buildCatalogLookup(), costForAction(), createMam3eLegalActions(), enumerateMam3eActions(), FREE (+5 more)

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
Cohesion: 0.08
Nodes (33): CampaignManager(), LibraryScenesView(), Props, SceneCreateForm(), useToast(), useCampaigns(), UseCampaignSyncOptions, now (+25 more)

### Community 154 - "Dnd5eEquipmentTab.tsx"
Cohesion: 0.27
Nodes (10): createSupabaseJwtVerifier(), decodeBase64Url(), decodeJsonSegment(), fail(), resolveGatewayAuth(), SupabaseJwtVerifier, b64url(), mintToken() (+2 more)

### Community 155 - "5e Movement Rules"
Cohesion: 0.12
Nodes (15): AuthContextValue, EntitySyncAdapter, reportSyncFailure(), useEntitySync(), UseEntitySyncOptions, baseAuthValue, Item, authValue (+7 more)

### Community 156 - "CharacterListView.tsx"
Cohesion: 0.07
Nodes (31): AppContent(), buildNewCharacterDocument(), cloneSystemData(), CreationWizardHost, LegalNotices, SceneManager, STORAGE_WARNING_THRESHOLD, CharacterListView() (+23 more)

### Community 158 - "MAM Complication Browser"
Cohesion: 0.20
Nodes (23): validatePf1eBuild(), ABILITY_SCORE_IDS, addIssue(), addNonOpenSourceIssue(), consumeBuildLegality(), isIntegerInRange(), legalityRulePath(), loadValidationData() (+15 more)

### Community 161 - "PF2e Backgrounds Data"
Cohesion: 0.15
Nodes (29): validatePf2eBuild(), getPf2eBulkState(), addIssue(), CLASS_PROGRESSION_RANKS, createPf2eValidator(), isIntegerInRange(), loadValidationData(), PF2E_ABILITY_IDS (+21 more)

### Community 177 - "characterDraftFlow.test.ts"
Cohesion: 0.08
Nodes (33): CharacterDraftApplier, collectUnknownIdIssues(), DocumentValidator, DraftCharacterParams, DraftCharacterResult, draftCharacterWithAi(), GatewayCall, POOL_LIST_FIELDS (+25 more)

### Community 179 - "useSceneEncounter.ts"
Cohesion: 0.39
Nodes (4): ServiceWorkerUpdateBanner(), isServiceWorkerSupported(), ServiceWorkerUpdateState, useServiceWorkerUpdate()

### Community 180 - "daggerheart/validation.ts"
Cohesion: 0.23
Nodes (22): getDaggerheartStartingTraitArray(), addIssue(), buildLookup(), createDaggerheartValidator(), CUSTOM_INVENTORY_PREFIXES, DaggerheartValidationData, isIntegerInRange(), NamedEntry (+14 more)

### Community 181 - "useEntitySync.ts"
Cohesion: 0.19
Nodes (19): mockedGetQueuedCampaignsSnapshot, mockedGetQueuedDeletedCampaignIds, mockedGetQueuedDeletedDocumentIds, mockedGetQueuedSyncSnapshot, getQueuedCampaignsSnapshot(), getQueuedDeletedCampaignIds(), getQueuedDeletedDocumentIds(), getQueuedSyncSnapshot() (+11 more)

### Community 182 - "syncTombstones.ts"
Cohesion: 0.12
Nodes (15): AiImageInput, EncounterDraftCandidate, EncounterDraftData, IdentifyCreatureData, DraftEncounterParams, DraftEncounterResult, GatewayCall, SelectionValidator (+7 more)

### Community 183 - "loadEquipmentForSystem"
Cohesion: 0.50
Nodes (3): Answer, Outcome, Q: where are pending debounced document saves flushed to localStorage on page hide or unload (persistence flush)

### Community 184 - "MamArchetypesTab.tsx"
Cohesion: 0.11
Nodes (35): AppHeader(), AppHeaderProps, SURFACES, SurfaceStage(), SurfaceStageProps, assertNever(), INITIAL_NAV_STATE, LIBRARY_SEGMENTS (+27 more)

### Community 186 - "eslint-plugin-react"
Cohesion: 0.40
Nodes (4): Feat, FeatBrowser(), FeatBrowserProps, feats

### Community 187 - "fake-indexeddb"
Cohesion: 0.16
Nodes (18): BACKGROUND_FIELDS(), BASELINE_PATH, buildManifest(), CR_FRACTIONS, EXTRACTORS, HERE, LOADERS, loadProductEntries() (+10 more)

### Community 188 - "dnd35e/validation.ts"
Cohesion: 0.28
Nodes (17): validateDnd35eBuild(), addIssue(), appendBuildLegalityIssues(), createDnd35eValidator(), Dnd35eValidationData, isIntegerInRange(), RFC-002, validateAbilityScores() (+9 more)

### Community 190 - "index.ts"
Cohesion: 0.11
Nodes (24): react, react, useTabs(), SheetAddHandlers, SheetDispatchRegistry, SheetDispatchRegistryContext, SheetDispatchState, SheetDispatchStateContext (+16 more)

### Community 191 - "retryWithBackoff"
Cohesion: 0.18
Nodes (21): MamAdvantageBrowserTab(), Props, addIssue(), createMam3eValidator(), engine, Mam3eValidationData, SPENT_BUCKETS, validateAdvantages() (+13 more)

### Community 194 - "@types/react-dom"
Cohesion: 0.04
Nodes (49): CreationWizardHostProps, CreationPlan, SystemRegistry, RFC-003, LegalActionEligibility, LegalActionList, LegalActionsContext, LegalActionTarget (+41 more)

### Community 195 - "sceneTerrain.ts"
Cohesion: 0.11
Nodes (22): InitiativeTracker(), InitiativeTrackerProps, MARKER_EFFECT_OPTIONS, markerEffectHelp(), MarkerEffectOption, MarkerEffectPreset, MarkerPanel(), MarkerPanelProps (+14 more)

### Community 202 - "phase3-workflows.spec.ts"
Cohesion: 0.29
Nodes (11): extractJsArray(), field(), main(), MODULES, parseEntries(), prettierBin(), readSource(), slug() (+3 more)

### Community 203 - "aiSdkAdapter.test.mts"
Cohesion: 0.29
Nodes (6): ENCOUNTER_PAYLOAD, RFC-002, promptText(), RecordedMessage, RecordedPrompt, AiTokenUsage

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

- **Why does `CharacterDocument` connect `Oracle Panel & Logic` to `Sheet Resource Loading Hooks`, `Daggerheart Sheet Automation`, `Dnd5e Equipment & Features UI`, `Retry With Backoff`, `Dnd5e2024 Engine & Hit Dice`, `MAM Power Browser`, `Daggerheart Engine`, `Tabs UI Component`, `Dnd5e Background Templates`, `Scene Combat Resolution`, `syncTombstones.ts`, `pf2eConditions.ts`, `Dnd5e Activity Definitions`, `TS Base Config`, `Dnd5e Feat Templates`, `D20 Combat Controls`, `Scene Illustration Panel`, `Dnd5eEquipmentTab.tsx`, `D20 Legacy System Engines`, `Dnd35e Saves & Data Model`, `Game System Selector`, `System Registry & Renderer`, `ServiceWorkerUpdateBanner.tsx`, `Daggerheart Inventory`, `Pf2e Character Templates`, `CharacterListView.tsx`, `Dnd5e Feature List Sections`, `MAM Complication Browser`, `Encounter & Initiative Panels`, `Pf2e Sheet Tabs`, `PF2e Backgrounds Data`, `Campaign Sync Hooks`, `Currency & Inventory Editors`, `Document Sync Engine`, `Check & Oracle Resolution`, `Mam3e Data Model & Engine`, `Equipped Armor Section`, `Spell Browser UI`, `Encounter Builder Logic`, `characterDraftFlow.test.ts`, `Campaign Storage & Hooks`, `daggerheart/validation.ts`, `Spell Preparation Logic`, `MamArchetypesTab.tsx`, `SRD Manifest Generator`, `Daggerheart Combatant Builders`, `dnd35e/validation.ts`, `D20 Legacy Spell Slots`, `index.ts`, `retryWithBackoff`, `Spells Tab Components`, `AI Gateway Client`, `@types/react-dom`, `Character Effects Compilation`, `System Validation Logic`, `Dnd5e Resource Loading Hooks`, `Dnd5e Feature Options`, `Document Migrations & Storage`, `HP & Spell Slot Trackers`, `Boundary Validation Tests`, `Documents Hook & Persistence`, `Daggerheart Contribution Ledger`, `Dnd35e/Pf1e Derived Math`, `Mam Browser Tabs`, `Skills Tab & Combat Math`, `Mam3e Derived Math`, `Document Storage (IndexedDB)`, `Character Card Presenter`, `Document Signature Hashing`, `Resource Pool Tracking`, `dnd5eToolChoices.ts`?**
  _High betweenness centrality (0.142) - this node is a cross-community bridge._
- **Why does `GameSystemId` connect `Daggerheart Combatant Builders` to `Sheet Resource Loading Hooks`, `Dnd5e Sheets & E2E Tests`, `Dnd5e2024 Engine & Hit Dice`, `Tabs UI Component`, `pf2eConditions.ts`, `Dnd5e Feat Templates`, `Game System Selector`, `Dnd5eEquipmentTab.tsx`, `System Registry & Renderer`, `Roadmap Metrics Generator`, `CharacterListView.tsx`, `Class Enhancement & Headers`, `Pf2e Sheet Tabs`, `Document Sync Engine`, `Mam3e Data Model & Engine`, `Doc Drift Rules`, `Spell Browser UI`, `Error Boundary & Auth Context`, `Encounter Builder Logic`, `characterDraftFlow.test.ts`, `Character Combatant Builder`, `AI Gateway Adapters`, `SRD Coverage Script`, `Spells Tab Components`, `Browser Compat & Error Logging`, `Spell Catalog Consistency Tests`, `Mam Powers & Cost Ledger`, `HP & Spell Slot Trackers`, `Mam Browser Tabs`, `Skills Tab & Combat Math`, `Mam3e Derived Math`, `Oracle Panel & Logic`, `Document Signature Hashing`?**
  _High betweenness centrality (0.056) - this node is a cross-community bridge._
- **Why does `entry()` connect `daggerheart/validation.ts` to `Dnd5e Background Templates`, `Tabs UI Component`, `Node Runtime Bootstrap`, `pf2eConditions.ts`, `Scene Illustration Panel`, `Daggerheart Inventory`, `CharacterListView.tsx`, `AI Encounter Drafting`, `Doc Drift Rules`, `Error Boundary & Auth Context`, `Encounter Builder Logic`, `AI Gateway Contracts`, `fake-indexeddb`, `Mam Character Sheet Tabs`, `Dnd5e Feature Options`, `Daggerheart Contribution Ledger`, `Dnd35e/Pf1e Derived Math`, `Pf2e Spell Data Encoder`, `Skills Tab & Combat Math`, `Pf2e Spell Types & Traits`, `5e Monster Encoder`, `AI Creature Identification`, `Document Signature Hashing`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **What connects `semi`, `singleQuote`, `trailingComma` to the rest of the system?**
  _1468 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Sheet Resource Loading Hooks` be split into smaller, more focused modules?**
  _Cohesion score 0.08208955223880597 - nodes in this community are weakly interconnected._
- **Should `Dnd5e Sheets & E2E Tests` be split into smaller, more focused modules?**
  _Cohesion score 0.08943089430894309 - nodes in this community are weakly interconnected._
- **Should `Dnd5e Equipment & Features UI` be split into smaller, more focused modules?**
  _Cohesion score 0.08771929824561403 - nodes in this community are weakly interconnected._