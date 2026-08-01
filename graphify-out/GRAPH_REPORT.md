# Graph Report - windsurf-project  (2026-07-31)

## Corpus Check
- 928 files · ~795,509 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 6093 nodes · 17548 edges · 214 communities (195 shown, 19 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 177 edges (avg confidence: 0.72)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b24de4f6`
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
- SurfaceStageKeepaliveBudget.test.tsx
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
- parseNum
- Prettier Config
- pf2eConditions.ts
- shared/legalActions.ts
- daggerheartSheetShared.tsx
- MAM Equipment Types
- Package Manifest
- Verification Baseline Script
- Scene Illustration Panel
- featTemplate.test.ts
- TS Netlify Config
- Generated Docs Check
- Playwright Browser Check
- Repo Hygiene Check
- Equipment Browser Component
- sceneStorageIDB.test.ts
- Dnd5eEquipmentTab.tsx
- 5e Movement Rules
- CharacterListView.tsx
- rules/dice.ts
- MAM Complication Browser
- Toast.tsx
- PF2e Backgrounds Data
- Host Size Budget Test
- retryWithBackoff
- MAM Complications Data
- MAM Power Modifiers Data
- Vitest Coverage Config
- characterDraftFlow.test.ts
- systemAssetPrefetch.ts
- daggerheart/validation.ts
- modifierEffects.ts
- syncTombstones.ts
- loadEquipmentForSystem
- MamArchetypesTab.tsx
- eslint-plugin-react
- fake-indexeddb
- mam3eValidation.test.ts
- MamComplicationBrowser.tsx
- index.ts
- retryWithBackoff
- applyPf2eAncestryTemplate
- imageInput.ts
- @types/react-dom
- sceneTerrain.ts
- @vitest/coverage-v8
- autoprefixer
- @eslint/js
- globals
- happy-dom
- participantResolution.test.ts
- phase3-workflows.spec.ts
- aiSdkAdapter.test.mts
- @types/node
- typescript-eslint
- vite
- sceneConditionOptions.ts
- aiSdkAdapter.test.mts
- spikeViewport.ts

## God Nodes (most connected - your core abstractions)
1. `CharacterDocument` - 308 edges
2. `SystemDataModel` - 167 edges
3. `GameSystemId` - 101 edges
4. `SystemRegistry` - 86 edges
5. `EffectInstance` - 73 edges
6. `makeEffectId()` - 63 edges
7. `abilityMod()` - 63 edges
8. `scripts` - 58 edges
9. `Pf2eDataModel` - 57 edges
10. `Dnd5eDataModel` - 55 edges

## Surprising Connections (you probably didn't know these)
- `useTabs()` --references--> `react`  [EXTRACTED]
  src/components/ui/Tabs.tsx → package.json
- `flattenEntries()` --indirect_call--> `entry()`  [INFERRED]
  scripts/check-compute-register.mjs → src/__tests__/components/ContributionBreakdown.test.tsx
- `loadProductEntries()` --indirect_call--> `entry()`  [INFERRED]
  scripts/check-srd-fidelity.mjs → src/__tests__/components/ContributionBreakdown.test.tsx
- `AbilityScoreGrid()` --indirect_call--> `mod()`  [INFERRED]
  src/components/sheet/AbilityScoreGrid.tsx → scripts/encode-35e-monsters.mjs
- `D20AbilitiesTab()` --indirect_call--> `mod()`  [INFERRED]
  src/systems/d20-legacy/components/D20AbilitiesTab.tsx → scripts/encode-35e-monsters.mjs

## Import Cycles
- None detected.

## Communities (214 total, 19 thin omitted)

### Community 0 - "Sheet Resource Loading Hooks"
Cohesion: 0.09
Nodes (55): ancestryPool(), backgroundPool(), classPool(), loadCharacterDraftPools(), NamedEntity, toCandidates(), RFC-002, useDaggerheartSheetResources() (+47 more)

### Community 1 - "Dnd5e Sheets & E2E Tests"
Cohesion: 0.11
Nodes (27): categoryIcons, GameSystemSelector(), GameSystemSelectorProps, systemAccents, supportBadgeLabels, supportBadgeStyles, buildInitialSummaryStates(), categoryDisplay (+19 more)

### Community 2 - "Dnd5e Equipment & Features UI"
Cohesion: 0.04
Nodes (72): D20Save, D20SaveId, Props, SAVE_IDS, D20LegacyData, D20LegacySpellSlots, recoverD20LegacySpellSlot(), resetD20LegacySpellSlots() (+64 more)

### Community 3 - "Dnd5e Background Templates"
Cohesion: 0.06
Nodes (67): countSelections(), Dnd5eSheetMutators, optionDisabledForRequirement(), resolveEquipmentSlot(), resolveFeatSelections(), toEquippedItem(), toWeaponDamage(), ABILITY_NAME_TO_ID (+59 more)

### Community 4 - "Dnd5e2024 Engine & Hit Dice"
Cohesion: 0.06
Nodes (40): HIT_DICE, hitDieSize(), hitDieString(), Dnd5e2024Engine, hasAlertFeat(), totalCharacterLevel(), hasDnd5eCondition(), normalizeConditionId() (+32 more)

### Community 5 - "Daggerheart Engine"
Cohesion: 0.08
Nodes (49): applyDnd5eClassTemplate(), applyDnd5eSubclassTemplate(), assertMulticlassRequirements(), ATTRIBUTE_NAME_TO_ID, buildChoiceSlots(), buildDerivedProficiencies(), buildSpellcastingState(), canSelectSubclass() (+41 more)

### Community 6 - "3.5e Monster Data Encoder"
Cohesion: 0.06
Nodes (57): ALIGNMENTS, DICE_PROGRESSIONS, main(), mapAlignment(), mod(), MONSTER_SIZE, normalizeName(), OLIMOT_FILES (+49 more)

### Community 7 - "Tabs UI Component"
Cohesion: 0.04
Nodes (73): Badge(), BadgeProps, badgeVariants, TABLIST_NAV_KEYS, Tabs, TabsContent, TabsContentProps, TabsContext (+65 more)

### Community 8 - "Node Runtime Bootstrap"
Cohesion: 0.09
Nodes (48): main(), runBootstrapNodeInstall(), getPinnedCommandArgs(), main(), runPinnedNpmCommand(), formatRuntimeDoctorReport(), main(), readWorkflowPinSource() (+40 more)

### Community 9 - "Scene Combat Resolution"
Cohesion: 0.05
Nodes (67): buildScene(), ResolveCombatStats, buildEncounterSceneEvents(), buildOccupiedCells(), intersectBounds(), makeUniqueTokenId(), occupyCells(), appendSceneEvent() (+59 more)

### Community 10 - "Dnd5e Class Templates"
Cohesion: 0.06
Nodes (55): resolveD20LegacyArmorClass(), contextWithConditionIds(), resolveCharacterEffects(), computeD20LegacyAC(), D20_SIZE_MOD, d20LegacyCheckPenalty(), applyDerivedQuantities(), D20LegacyHeader() (+47 more)

### Community 11 - "System Compute Registers"
Cohesion: 0.08
Nodes (22): createDefaultDnd5eData(), Dnd5eEngine, engine, SHIELD, TEST_DATE, makeDnd5eDocument(), makeDnd5eDocument(), makeDoc() (+14 more)

### Community 12 - "Scene Check Panel"
Cohesion: 0.15
Nodes (15): e(), spySink(), spySink(), BrowserCapabilities, checkBrowserCapabilities(), initBrowserCompat(), isBrowserSupported(), showCompatibilityWarning() (+7 more)

### Community 13 - "Dnd5e Activity Definitions"
Cohesion: 0.10
Nodes (25): buildDefenseStyleActivity(), buildDivineSmiteActivities(), buildDivineSmiteActivity(), buildDnd5eActivityDefinitions(), buildUnsupportedDivineSmiteActivity(), divineSmiteSlotLevel(), Dnd5eActivityCost, Dnd5eActivityCostKind (+17 more)

### Community 14 - "Monster & NPC Generator"
Cohesion: 0.07
Nodes (43): DragProvider, DragRoot(), isSceneDragEnabled(), FEATURE_FLAGS, FeatureFlag, FeatureFlagDefinition, isFeatureEnabled(), RingBuffer (+35 more)

### Community 15 - "Dnd5e Feat Templates"
Cohesion: 0.06
Nodes (47): BreakdownRow, buildRows(), ContributionBreakdown(), formulaOf(), Props, toRow(), RFC-003, resolveCharacterLedger() (+39 more)

### Community 16 - "App Shell & Layout"
Cohesion: 0.18
Nodes (21): validateDnd35eBuild(), ABILITY_KEYS, TIER_BONUS, BuildLegalityResult, BuildViolation, addIssue(), appendBuildLegalityIssues(), createDnd35eValidator() (+13 more)

### Community 17 - "D20 Combat Controls"
Cohesion: 0.09
Nodes (22): ABILITIES, DEFENSES, MamAbilitiesTab(), Props, MamHeader(), Props, Props, ABILITIES (+14 more)

### Community 18 - "Game System Selector"
Cohesion: 0.05
Nodes (64): EquippedItemsSection(), Props, SLOT_LABELS, SLOT_ORDER, FeaturesSection(), Props, AttackEconomy, bestAttackAbility() (+56 more)

### Community 19 - "Combat & Recap Panels"
Cohesion: 0.08
Nodes (32): Doc, useSync(), UseSyncOptions, baseAuthValue, mockedClearQueuedDeletedDocumentIds, mockedClearQueuedSyncSnapshot, mockedDeleteRemoteDocument, mockedFetchRemoteDocuments (+24 more)

### Community 20 - "D20 Legacy System Engines"
Cohesion: 0.10
Nodes (41): buildTokensByCell(), ManualDamageParse, resolveCheck(), cellKey(), footprintWithinGrid(), isOracleAnswer(), isOracleOdds(), resolveOracle() (+33 more)

### Community 21 - "Dnd35e Saves & Data Model"
Cohesion: 0.05
Nodes (60): resolveAttack(), rollD20(), collectDamageChannels(), DamageChannel, DamageChannelAmount, sanitizeWeight(), splitDamageAcrossChannels(), RFC-006 (+52 more)

### Community 22 - "Daggerheart Data Model"
Cohesion: 0.08
Nodes (36): markerEffectHelp(), MarkerEffectOption, MarkerEffectPreset, terrainEffectsForPreset(), MarkerPanel(), MarkerPanelProps, terrainBadgeIcon(), isSceneCanvasEnabled() (+28 more)

### Community 23 - "System Registry & Renderer"
Cohesion: 0.15
Nodes (20): useCampaigns(), DebouncedPersistence, IMPORTANT: a begun generation must end in either `persist` or, useDebouncedPersistence(), hostileStorage, CAMPAIGNS_STORAGE_KEY, clearCampaignStorage(), exportCampaigns() (+12 more)

### Community 24 - "Game Rules & Proficiencies"
Cohesion: 0.09
Nodes (25): GAME_RULES, ArmorProficiency, ArmorProficiencyType, isValidArmorProficiency(), isValidSkillProficiency(), isValidToolProficiency(), isValidWeaponProficiency(), MartialWeaponProficiency (+17 more)

### Community 25 - "Campaign Sync Hooks"
Cohesion: 0.05
Nodes (69): DiceRollButton(), DiceRollButtonProps, Dock(), PartyDockTab(), PartyDockTabProps, RollResult, availablePf2eToggles(), Dnd5eSavesTab() (+61 more)

### Community 26 - "Daggerheart Inventory"
Cohesion: 0.09
Nodes (34): clampDaggerheartInventoryQuantity(), daggerheartInventoryDefinitions, findDaggerheartInventoryDefinitionByName(), getDaggerheartInventoryDefinition(), inventoryDefinitionById, inventoryDefinitionByName, normalizeDaggerheartCurrency(), normalizeInteger() (+26 more)

### Community 27 - "Pf2e Character Templates"
Cohesion: 0.16
Nodes (24): createPf2eCreationPlan(), applyPf2eBackgroundTemplate(), applyPf2eClassTemplate(), backgroundFeat(), baseArmorProficiencies(), baseWeaponProficiencies(), collectBackgroundAbilityAdjustments(), collectClassFeatureSignatures() (+16 more)

### Community 28 - "Roadmap Metrics Generator"
Cohesion: 0.08
Nodes (39): applyRepoResidentOverrides(), buildComputeCompletion(), buildContentCoverage(), buildMarkdownReport(), ComputeCompletionRow, computeMetrics(), ContentCoverageRow, createEmptyCategoryCounts() (+31 more)

### Community 29 - "Dnd5e Feature List Sections"
Cohesion: 0.12
Nodes (21): clampTrack(), DeathSaves, DeathSavesTracker(), Props, HitDiceTracker(), Props, Props, SLOT_LEVELS (+13 more)

### Community 30 - "Encounter & Initiative Panels"
Cohesion: 0.06
Nodes (47): resolvePf2eArmorClass(), computePf2eAC(), collectPf2eCheckConditionEffects(), ConditionScope, getPf2eConditionStatusPenalty(), highestValue(), magnitude(), PF2E_STATUS_CONDITIONS (+39 more)

### Community 31 - "Class Enhancement & Headers"
Cohesion: 0.13
Nodes (24): buildSystem(), CATEGORY_LOADERS, CategoryLoader, escape(), isRecord(), Loaded, main(), SystemConfig (+16 more)

### Community 32 - "Pf2e Sheet Tabs"
Cohesion: 0.06
Nodes (36): CombatTogglesSection(), Props, Condition, ConditionPicker(), Props, CurrencyEditor(), CurrencyEntry, DND_CURRENCIES (+28 more)

### Community 33 - "AI Encounter Drafting"
Cohesion: 0.09
Nodes (32): DEFAULT_QUICK_ROLLS, DicePanel(), DicePanelProps, formatBreakdown(), QUICK_ROLLS_BY_SYSTEM, DISPOSITION_BADGE, DISPOSITION_LABEL, ReactionHistoryEntry (+24 more)

### Community 34 - "Quest & Session Log UI"
Cohesion: 0.12
Nodes (31): Props, QuestList(), STATUS_BADGE, STATUS_OPTIONS, DATE_FORMAT, Props, SessionLog(), UseCampaignSyncOptions (+23 more)

### Community 35 - "Currency & Inventory Editors"
Cohesion: 0.10
Nodes (25): MamArchetypeBrowser(), MamArchetypeBrowserProps, MamArchetypeBrowser, MamArchetypesTabComponent, Props, MamConditionsTab(), Props, Mam3eConditionTrack (+17 more)

### Community 36 - "Document Sync Engine"
Cohesion: 0.04
Nodes (132): critModelForScene(), degreeModelForScene(), resolveSceneAreaEffect(), resolveSceneAttack(), SceneAreaEffectOutcome, SceneAttackOutcome, SceneCombatStats, SceneRoundOutcome (+124 more)

### Community 37 - "Sheet Header & Stat Cards"
Cohesion: 0.19
Nodes (9): createDefaultPf2eData(), PF2E_ARCHETYPE_DEDICATION_GRANTS, pf2eCasterData(), makeDoc(), makeDoc(), doc(), createFighter(), makeSystem() (+1 more)

### Community 38 - "Check & Oracle Resolution"
Cohesion: 0.70
Nodes (3): DOCK_TABS, DockTabDescriptor, DockTabKind

### Community 39 - "Mam3e Data Model & Engine"
Cohesion: 0.10
Nodes (32): chainCounts, chainSteps, ciCounts, ciOccurrences, DECLARED_CI_ONLY_COMMANDS, endOfBlock(), exceptions, expand() (+24 more)

### Community 40 - "Doc Drift Rules"
Cohesion: 0.06
Nodes (59): DOC_DRIFT_MANIFEST, DocDriftRuleType, DocDriftSurface, DocDriftSurfaceKind, CAPABILITY_PHRASE_RULES, CapabilityPhraseRule, capitalizeSupportLevel(), COMMAND_RUNTIME_RULES (+51 more)

### Community 41 - "NPM Build Scripts"
Cohesion: 0.03
Nodes (58): scripts, analyze, bootstrap:node, build, check:bundle-size, check:ci-parity, check:compute-register, check:compute-register:mutate (+50 more)

### Community 42 - "Condition Effects by System"
Cohesion: 0.09
Nodes (23): useLazyResource(), useSystemOptions(), useD20LegacySheetResources(), Pf2eSpellsTab, usePf2eSheetResources(), CatalogRow, itemRows, SPELL_FIELDS (+15 more)

### Community 43 - "Equipped Armor Section"
Cohesion: 0.06
Nodes (39): EquipArmorInput, EquipEntry, EquippedArmorSection(), EquipShieldInput, Props, SheetDispatch, DockResources, CurrencyEditor (+31 more)

### Community 44 - "Spell Browser UI"
Cohesion: 0.11
Nodes (21): Pf2eSpellBrowserPanel, Pf2eSpellsTabComponent, Props, Pf2eSpellcasting, focusPulseSpell, stinkingCloudSpell, teleportSpell, PF2E_DERIVED_TRAITS (+13 more)

### Community 45 - "Scene Combat Area Effects"
Cohesion: 0.17
Nodes (15): buildNotice(), FetchTarget, fetchValidated(), HTML_ENTITIES, looksLikeHtml(), main(), normalize(), noticePath (+7 more)

### Community 46 - "Error Boundary & Auth Context"
Cohesion: 0.14
Nodes (22): D20ClassesSection(), D20LegacyClassLevel, Props, renderClassOptions(), d20BonusSpells(), buildD20LegacySpellSlotTotals(), countAdvancementLevels(), D20_DOMAIN_CLASS_IDS (+14 more)

### Community 47 - "Encounter Builder Logic"
Cohesion: 0.13
Nodes (33): createD20LegacyCreationPlan(), applyAbilityAdjustments(), applyD20LegacyClassTemplate(), applyD20LegacyRaceTemplate(), buildClassSkills(), classFeaturesUpToLevel(), classSkillOptions(), collectClassFeatureSignatures() (+25 more)

### Community 48 - "Scene Management Hooks"
Cohesion: 0.09
Nodes (40): Props, UseSceneEncounterParams, Props, mergeLoadedScenes(), useScenes(), BuildEncounterEventsResult, NOW, NOW (+32 more)

### Community 49 - "Monster Combatant Builder"
Cohesion: 0.04
Nodes (73): NarrateSceneResult, CheckPanel(), CheckPanelProps, DEFAULT_SUGGESTIONS, DND5E_SKILLS, OUTCOME_BADGE, OUTCOME_LABEL, SKILL_SUGGESTIONS_BY_SYSTEM (+65 more)

### Community 50 - "D20 Legacy Templates"
Cohesion: 0.12
Nodes (42): getDaggerheartShortRestRecovery(), createDaggerheartInventoryEntry(), clearAllStress(), clearStress(), prepareGainHope(), repairAllArmor(), repairArmor(), tendToAllWounds() (+34 more)

### Community 51 - "Campaign Storage & Hooks"
Cohesion: 0.27
Nodes (9): makeScene(), campaignSignatureFor(), sameCampaignSignatures(), sameDocumentSignatures(), sameSceneSignatures(), sameSignatureMultisets(), sceneSignatureFor(), signatureFor() (+1 more)

### Community 52 - "Spell Preparation Logic"
Cohesion: 0.17
Nodes (26): useCampaignSync(), mockedGetSupabaseClient, getSupabaseClient(), clearQueuedCampaignsSnapshot(), clearQueuedDeletedCampaignIds(), clearQueuedIds(), deleteRemoteCampaign(), extractTombstone() (+18 more)

### Community 53 - "Dev Dependencies"
Cohesion: 0.04
Nodes (47): @axe-core/playwright, eslint, eslint-config-prettier, eslint-plugin-react, eslint-plugin-react-hooks, eslint-plugin-react-refresh, knip, devDependencies (+39 more)

### Community 54 - "Character Combatant Builder"
Cohesion: 0.14
Nodes (20): validateDraftedDocument(), AI_TASK_UNIT_COST, EncounterDraftSelection, AnyTaskGatewayCall, createFlowBudget(), DEFAULT_MAKE_GAME_FLOW_BUDGET, FlowBudgetLimits, FlowBudgetReport (+12 more)

### Community 55 - "D20 Class Spellcasting"
Cohesion: 0.13
Nodes (25): Dnd5eSpellsTabComponent, Props, SpellBrowser, SpellBrowserProps, getEligibleDnd5eFeatureOptions(), featureOptionSelectionKey(), ABILITY_TOKEN_MAP, collectAlwaysPreparedByLevelSources() (+17 more)

### Community 56 - "SRD Manifest Generator"
Cohesion: 0.05
Nodes (72): ArtisanToolProficiency, GamingSetProficiency, MusicalInstrumentProficiency, appendInventoryFromBackground(), applyDnd5eBackgroundTemplate(), BackgroundChoiceSlot, BackgroundChoiceValue, backgroundDerivedState() (+64 more)

### Community 57 - "Daggerheart Combatant Builders"
Cohesion: 0.10
Nodes (21): CR_XP_TABLE, formatChallengeRating(), MonsterBrowser(), MonsterBrowserProps, GeneratedNpc, generateNpc(), generateNpcName(), NAME_ENDS (+13 more)

### Community 58 - "AI Gateway Adapters"
Cohesion: 0.07
Nodes (43): AI_GATEWAY_SCHEMA_VERSION, aiFailure, AiFailureCode, AiResponse, AiTask, AiTaskClass, GatewayContext, GatewayTimeoutError (+35 more)

### Community 59 - "AI Gateway Contracts"
Cohesion: 0.12
Nodes (33): AI_TASK_CLASS, AiParse, AiSuccess, AiUsage, CharacterDraftRequest, EncounterDraftRequest, IdentifyCreatureRequest, IllustrateSceneRequest (+25 more)

### Community 60 - "System Definitions & Types"
Cohesion: 0.25
Nodes (16): actionReachCells(), ATTACK_COUNT_WORDS, averageDie(), buildMonsterCombatant(), dieFaces(), isMinusSign(), monsterAttackEffects(), monsterAttacksPerRound() (+8 more)

### Community 61 - "D20 Legacy Spell Slots"
Cohesion: 0.20
Nodes (21): clearLocalDataForAccountChange(), StubTransaction, loadDocumentsAsync(), hydrateDoc(), idbClearDocuments(), idbClearScenes(), idbHasMigrated(), idbHasMigratedScenes() (+13 more)

### Community 62 - "SRD Coverage Script"
Cohesion: 0.06
Nodes (56): buildManifest(), CLASSES, CLASSIFICATION_PATH, HERE, LICENSING_CLASSES, loadShipped(), MANIFEST_PATH, run() (+48 more)

### Community 63 - "ESLint Config"
Cohesion: 0.13
Nodes (24): LegalActionDescriptor, addAttackOfOpportunity(), addAttacks(), addCombatActions(), addFullAttack(), addSpellcasting(), createD20LegacyLegalActions(), D20LegacyActionData (+16 more)

### Community 64 - "Spells Tab Components"
Cohesion: 0.25
Nodes (7): ArmorItem, DnD35eArmor, DnD35eShield, DnD35eGear, GearItem, DnD35eWeapon, WeaponItem

### Community 65 - "Browser Compat & Error Logging"
Cohesion: 0.12
Nodes (22): Props, State, LegalNotices(), LegalNoticesProps, licenseTexts, LibraryBestiaryView(), LoadState, MonsterBrowser (+14 more)

### Community 66 - "AI Gateway Client"
Cohesion: 0.25
Nodes (14): CharacterCard(), CharacterCardProps, makeDoc(), now, renderCard(), asNumber(), asRecord(), asString() (+6 more)

### Community 67 - "2024 Monster Data Encoder"
Cohesion: 0.16
Nodes (23): ABILITIES, ALIGNMENTS, bucketFor(), classifyImmunityList(), cleanProse(), CR_FRACTIONS, CREATURE_TYPES, DAMAGE_TYPES (+15 more)

### Community 68 - "Character Effects Compilation"
Cohesion: 0.07
Nodes (50): getDaggerheartAncestryAdjustments(), applyDaggerheartAncestryTemplate(), applyDaggerheartClassTemplate(), applyDaggerheartCommunityTemplate(), classTemplateItems(), communityTemplateItems(), DaggerheartInventoryEntry, DEFAULTS (+42 more)

### Community 69 - "TypeScript Config"
Cohesion: 0.07
Nodes (27): ES2020, src, compilerOptions, allowImportingTsExtensions, baseUrl, forceConsistentCasingInFileNames, isolatedModules, jsx (+19 more)

### Community 70 - "Mam Character Sheet Tabs"
Cohesion: 0.06
Nodes (48): daggerheartComputeRegister, dnd35eComputeRegister, dnd5e2014ComputeRegister, dnd5e2024ComputeRegister, COMPUTE_REGISTERS, registerForSystem(), mam3eComputeRegister, MUTATION_ANCHORS (+40 more)

### Community 71 - "Monster Stat Block & Status"
Cohesion: 0.08
Nodes (23): CODE_EXTENSIONS, committedAt, filesWithNodes, findings, git(), graph, indexedExtensions, inScope() (+15 more)

### Community 72 - "Dice Panel & Mam3e Resolution"
Cohesion: 0.07
Nodes (30): counterStore, latencyBudgetsFromEnv(), positiveEnv(), rateLimiterFromEnv(), sessionBudgetFromEnv(), anthropicAdapter, googleAdapter, resolveProviderAdapter() (+22 more)

### Community 73 - "System Validation Logic"
Cohesion: 0.11
Nodes (36): ABILITY_KEYS, DND5E_ASI_LEVELS_BY_CLASS, DND5E_BASE_ASI_LEVELS, DND5E_MULTICLASS_PREREQ, dnd5eAsiSlotsGranted(), validateDnd5eBuild(), dnd5eKnownSpellLimit(), dnd5eKnownSpellOverage() (+28 more)

### Community 74 - "Spell Catalog Consistency Tests"
Cohesion: 0.08
Nodes (42): ALL_SYSTEMS, ALLOWED_BY_ID, ALLOWLIST, allowlistHits, auditCitation(), auditRulesLayerLiterals(), CATEGORY_LOADERS, cleared (+34 more)

### Community 75 - "Dnd5e Resource Loading Hooks"
Cohesion: 0.08
Nodes (31): feat, item, monster, spell, EMPTY, useDockResources(), UseD20LegacySheetResourcesProps, UseDaggerheartSheetResourcesProps (+23 more)

### Community 76 - "Mam Powers & Cost Ledger"
Cohesion: 0.11
Nodes (16): AuthContext, AuthContextValue, EntitySyncAdapter, reportSyncFailure(), useEntitySync(), UseEntitySyncOptions, baseAuthValue, Item (+8 more)

### Community 78 - "Dnd5e Feature Options"
Cohesion: 0.07
Nodes (42): Dnd5eActivitySource, Dnd5eFeatureOptionsSection(), Dnd5eFeatureOptionsSectionComponent, FeatureOptionBrowser, FeatureOptionBrowserProps, featureOptionSelectionKey(), Props, FeatureOptionBrowser() (+34 more)

### Community 79 - "Document Migrations & Storage"
Cohesion: 0.08
Nodes (38): cloneDocumentsSnapshot(), documentsChanged(), engineLoadErrorMessage(), prepareDocumentsWithEngines(), prepareDocumentWithEngine(), unresolvedEngineSystemIds(), useDocuments(), withPreparedDocuments() (+30 more)

### Community 80 - "App Header & Auth UI"
Cohesion: 0.36
Nodes (7): ThemeToggle(), applyTheme(), getSystemTheme(), isTheme(), Theme, useTheme(), VALID_THEMES

### Community 81 - "Combat Toggles & Conditions"
Cohesion: 0.17
Nodes (15): mam3eAfflictionDC(), mam3eAttackDC(), mam3eAttackHits(), mam3eCriticalDC(), mam3eDamageResistanceDC(), mam3eDegreesOfFailure(), mam3eDegreesOfSuccess(), mam3eEquipmentPoints() (+7 more)

### Community 82 - "HP & Spell Slot Trackers"
Cohesion: 0.18
Nodes (11): GeneratedImageData, IllustrateGatewayCall, IllustrateSceneParams, IllustrateSceneResult, illustrateSceneWithAi(), RFC-002, ILLUSTRATION_STYLES, IllustrationPanel() (+3 more)

### Community 83 - "Scene Grid View"
Cohesion: 0.20
Nodes (18): mockedGetQueuedCampaignsSnapshot, mockedGetQueuedDeletedCampaignIds, mockedGetQueuedDeletedDocumentIds, mockedGetQueuedSyncSnapshot, getQueuedCampaignsSnapshot(), getQueuedDeletedCampaignIds(), getQueuedDeletedDocumentIds(), getQueuedSyncSnapshot() (+10 more)

### Community 84 - "Boundary Validation Tests"
Cohesion: 0.24
Nodes (19): NOW, parseImg(), validDocInput(), coerceDate(), coerceObjectives(), coerceQuests(), coerceSceneMapReference(), coerceSessionLog() (+11 more)

### Community 85 - "capabilityScenarios.test.tsx"
Cohesion: 0.60
Nodes (3): formatModifierCost(), MamPowerModifierBrowser(), MamPowerModifierBrowserProps

### Community 86 - "Equipment & Feature Browsers"
Cohesion: 0.05
Nodes (57): ProficiencyListSection(), Props, casterTypes, classResourcesNeeded, classTags, DND5E_CONDITION_NAMES, ChoiceSlot, Dnd5eFeaturesTabComponent (+49 more)

### Community 87 - "Pf2e Engine & Constants"
Cohesion: 0.09
Nodes (20): GapLedgerItem, LedgerPhase, LedgerStatus, LedgerTag, LedgerTrack, MASTER_GAP_LEDGER, RFC-003, byPhase (+12 more)

### Community 88 - "Documents Hook & Persistence"
Cohesion: 0.29
Nodes (9): availableDnd5eToggles(), collectDnd5eRiderEffects(), DND5E_TOGGLE_IDS, Dnd5eRiderInputs, Dnd5eSystemId, hasFlatFivePenaltyTenDamageFeats(), RAGE_DAMAGE_BREAKPOINTS, rageDamageBonus() (+1 more)

### Community 89 - "Daggerheart Contribution Ledger"
Cohesion: 0.07
Nodes (53): ANCESTRY_ADJUSTMENTS_BY_ID, ancestryByName, classByName, DAGGERHEART_TIER_BREAKPOINTS, DAGGERHEART_TRAITS, DaggerheartAncestryAdjustments, DaggerheartRange, DEFAULT_DAGGERHEART_ANCESTRY_ADJUSTMENTS (+45 more)

### Community 90 - "Dnd35e/Pf1e Derived Math"
Cohesion: 0.22
Nodes (13): LegalActionCost, addBasicActions(), addPowerActions(), buildCatalogLookup(), costForAction(), createMam3eLegalActions(), enumerateMam3eActions(), FREE (+5 more)

### Community 91 - "Mam Browser Tabs"
Cohesion: 0.11
Nodes (35): draftEncounterWithAi(), draftEncounter(), isMonsterSystemId(), RFC-006, useSceneEncounter(), EncounterMonsterSelection, summarizeEncounterParty(), DIFFICULTY_COLUMN (+27 more)

### Community 92 - "Pf2e Derived Math"
Cohesion: 0.19
Nodes (14): considerFile(), findings, isExampleEnv(), record(), root, rootConfigExt, rules, scanDirs (+6 more)

### Community 93 - "TypeDoc Config"
Cohesion: 0.07
Nodes (29): alphabetical, Class, Function, Interface, kind, ./src/types/core/character.ts, ./src/types/magic/spells.ts, ./src/types/mam/powers.ts (+21 more)

### Community 94 - "Pf2e Spell Data Encoder"
Cohesion: 0.10
Nodes (32): ABILITY_BY_INDEX, ALIGNMENTS, bucketFor(), CREATURE_TYPES, DAMAGE_TYPES, main(), mapAction(), mapAlignment() (+24 more)

### Community 95 - "Sync Tombstones"
Cohesion: 0.13
Nodes (12): app, ccBy, checks, component, dpcgl, failures, license, notice (+4 more)

### Community 96 - "Skills Tab & Combat Math"
Cohesion: 0.28
Nodes (16): MamPowersTab(), ModifierColumn(), ModifierColumnProps, buildMam3eContributionLedger(), buildMam3ePowerCostEffects(), buildMam3ePowerCostLedgerEntries(), createPowerCostEffect(), ledgerId() (+8 more)

### Community 97 - "Mam3e Derived Math"
Cohesion: 0.06
Nodes (40): CharacterDraftBinding, createRecordedGateway(), CreationWizard(), CreationWizardProps, framedSteps(), severityWeight(), ValidationSummary(), CreationWizardHostProps (+32 more)

### Community 98 - "Doc Drift Tests"
Cohesion: 0.06
Nodes (23): BLOCKING_IMPACTS, createCharacterForSystem(), expectNoBlockingViolations(), expectThemeApplied(), freezeAnimations(), getCharacterNameInput(), KNOWN_A11Y_DEBT, openLandingPage() (+15 more)

### Community 99 - "Spell Catalog Parity Tests"
Cohesion: 0.11
Nodes (5): DND35E_SOURCE_BLOCKED_SPELL_IDS, fieldCoverageBaselines, PF1E_SOURCE_ROWS_WITHOUT_SAVING_THROW, SpellModule, spellModules

### Community 100 - "Pf2e Spell Types & Traits"
Cohesion: 0.09
Nodes (24): CombatStatCard(), Props, Props, SheetHeader(), PresentedDerivedQuantity, D20DerivedStats(), DERIVED_ICON_BY_NAME, derivedIcon() (+16 more)

### Community 101 - "Document Storage (IndexedDB)"
Cohesion: 0.14
Nodes (8): snapshotDamageProfile(), getSceneTokenSize(), buildPlacedToken(), BRUTE, NOW, VICTIM, now, position

### Community 102 - "5e Monster Encoder"
Cohesion: 0.18
Nodes (16): tierBonus(), CREATURE_XP_BY_LEVEL_DIFF, pf2eAttackModifier(), pf2eCreatureXP(), Pf2eDegree, pf2eDyingAfterRecovery(), pf2eEncounterBudget(), pf2eInitialDying() (+8 more)

### Community 103 - "Knip Lint Config"
Cohesion: 0.16
Nodes (14): ExpectedSpellIdentity, iconicSpellExpectations, SystemKey, systems, dedupeById(), Identified, indexById(), warnDuplicateId() (+6 more)

### Community 104 - "PF2e Monster Encoder"
Cohesion: 0.23
Nodes (14): ALIGNMENT_ABBREV, bucketFor(), CREATURE_TYPES, DAMAGE_TYPES, main(), mapAttack(), normalizeName(), parseDamage() (+6 more)

### Community 105 - "SurfaceStageKeepaliveBudget.test.tsx"
Cohesion: 0.25
Nodes (16): makeAsset(), makeSceneWithMap(), clearMapAssetStorage(), createMapAsset(), CreateMapAssetResult, deleteMapAsset(), isMapAssetShape(), isRecord() (+8 more)

### Community 106 - "Character Card Presenter"
Cohesion: 0.10
Nodes (23): AllegianceChip(), AllegianceChipProps, DragContext, NO_HANDLERS, useDragContext(), DragContextValue, DragPayload, DragSourceHandlers (+15 more)

### Community 107 - "Oracle Panel & Logic"
Cohesion: 0.05
Nodes (47): MakeGameCharacter, DamageHealControl(), DamageHealControlProps, SceneDropControllerProps, clampExhaustion(), Props, RestControls(), useSheetDispatchRegister() (+39 more)

### Community 108 - "5e Equipment Tab"
Cohesion: 0.09
Nodes (35): DEFAULT_LABELS, SpellBrowser(), SpellBrowserLabels, SpellBrowserProps, SpellBrowserSpell, BrowserFeat, DockPanel(), DockPanelProps (+27 more)

### Community 109 - "Scene Reaction Panel"
Cohesion: 0.19
Nodes (15): compareSpells(), D20SpellsTab(), formatSpellLevel(), Props, titleCase(), D20_ARCANE_SCHOOLS, buildSpellPreparationConcepts(), compareSpellEntries() (+7 more)

### Community 110 - "Document Signature Hashing"
Cohesion: 0.09
Nodes (44): ArmorClassItem, computeDnd5eBaseArmorClass(), Dnd5eUnarmoredDefense, foldArmorClass(), resolveDnd5eArmorClass(), ArmorEquipItem, compute5eAC(), dnd5eArmorDexContribution() (+36 more)

### Community 111 - "Resource Pool Tracking"
Cohesion: 0.29
Nodes (16): addIssue(), createMam3eValidator(), engine, Mam3eValidationData, SPENT_BUCKETS, validateAdvantages(), validateArchetypePins(), validateComplications() (+8 more)

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
Cohesion: 0.17
Nodes (15): BuildEncounterEventsParams, buildInitiativeEntries(), clampInteger(), compareTokenIds(), EncounterBuilderIssue, EncounterPartyMember, EncounterPlanEntry, findOpenPosition() (+7 more)

### Community 117 - "check-mam-equipment-provenance.mjs"
Cohesion: 0.13
Nodes (11): byId, byName, failures, manifest, manifestByName, root, seenSrdNames, shipped (+3 more)

### Community 118 - "dnd5eToolChoices.ts"
Cohesion: 0.21
Nodes (9): DragLayer, DragLayerProps, DragProvider(), toSample(), DropTargetRegistration, createDragGesture(), DragGesture, DragGestureOptions (+1 more)

### Community 119 - "MAM Archetype Browser"
Cohesion: 0.27
Nodes (11): CLASS_TOKENS, d20srdUrl(), FILES, main(), mapCastingTime(), mapDuration(), mapRange(), normalizeName() (+3 more)

### Community 120 - "PF1e Spell Encoder"
Cohesion: 0.27
Nodes (11): CLASS_COLUMNS, main(), mapCastingTime(), mapDuration(), mapRange(), RFC-4180, normalizeName(), parseCsv() (+3 more)

### Community 123 - "3.5e Gear & Weapons"
Cohesion: 0.18
Nodes (7): SceneNarrationData, TaskGatewayCall, FlowBudget, NarrateSceneParams, narrateSceneWithAi(), NarrationGatewayCall, RFC-002

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
Nodes (35): MARKER_EFFECT_OPTIONS, acceptGridGeometryProposal(), BOX_KINDS, CellRect, COVER_PRESETS, deriveGridFromRegistration(), GridBoxKind, GridBoxProposal (+27 more)

### Community 129 - "Daggerheart Sheet Automation"
Cohesion: 0.06
Nodes (22): @testing-library/jest-dom, DeferredInstallPromptEvent, isStandaloneMode(), readDismissedState(), usePwaInstallPrompt(), UsePwaInstallPromptOptions, writeDismissedState(), registerAllSystems() (+14 more)

### Community 130 - "legality/pf2e.ts"
Cohesion: 0.12
Nodes (18): MamAdvantageBrowserTab(), Props, MamComplicationBrowser, MamComplicationsTabComponent, Props, formatMamPowerAction(), formatMamPowerDuration(), formatMamPowerRange() (+10 more)

### Community 131 - "Retry With Backoff"
Cohesion: 0.10
Nodes (15): baseAuthValue, mockedClearQueuedCampaignsSnapshot, mockedClearQueuedDeletedCampaignIds, mockedDeleteRemoteCampaign, mockedFetchRemoteCampaigns, mockedGetQueuedCampaignsSnapshot, mockedGetQueuedDeletedCampaignIds, mockedGetSyncTombstonedIds (+7 more)

### Community 132 - "2024 Spell Encoder"
Cohesion: 0.39
Nodes (8): main(), mapCastingTime(), mapDuration(), mapRange(), normalizeName(), SCHOOLS, slug(), ts()

### Community 133 - "MAM Power Browser"
Cohesion: 0.29
Nodes (6): react, react, InventoryItem, InventoryManager(), InventoryManagerProps, existingItems

### Community 134 - "Spell Validation Checks"
Cohesion: 0.28
Nodes (7): collectRawSpells(), getRawSpellById(), getVariantFingerprint(), SpellModule, spellModules, stableFingerprintValue(), VALID_SCHOOLS

### Community 136 - "TS Node Config"
Cohesion: 0.20
Nodes (9): compilerOptions, allowSyntheticDefaultImports, composite, forceConsistentCasingInFileNames, module, moduleResolution, skipLibCheck, include (+1 more)

### Community 137 - "TS Test Config"
Cohesion: 0.10
Nodes (20): e2e/**/*, ES2022, playwright.config.ts, vite/client, vitest.config.ts, vitest/globals, compilerOptions, lib (+12 more)

### Community 138 - "parseNum"
Cohesion: 0.20
Nodes (9): Pf2eArchetypesTab(), Props, GetPf2eSheetChoiceStateProps, Pf2eChoiceSlot, archetypeIds, makeSystem(), reloadSingleDocument(), Archetype (+1 more)

### Community 139 - "Prettier Config"
Cohesion: 0.22
Nodes (8): arrowParens, endOfLine, overrides, printWidth, semi, singleQuote, tabWidth, trailingComma

### Community 140 - "pf2eConditions.ts"
Cohesion: 0.29
Nodes (12): NOW, clearSyncTombstones(), getSyncTombstonedIds(), getSyncTombstones(), pruneExpired(), readStored(), recordSyncTombstones(), removeSyncTombstones() (+4 more)

### Community 141 - "shared/legalActions.ts"
Cohesion: 0.27
Nodes (12): Dnd5eLikeDataModel, addMovement(), addReaction(), addSpellcasting(), addStandardActions(), addWeaponAttacks(), createDnd5eLegalActions(), enumerateDnd5eActions() (+4 more)

### Community 142 - "daggerheartSheetShared.tsx"
Cohesion: 0.28
Nodes (12): applyPf2eArchetypeTemplate(), archetypeSource(), archetypeTemplateFeatures(), dedicationProficiencyGrants(), dedicationProficiencyMap(), featureSignature(), removeFeaturesBySignatures(), removePf2eArchetypeTemplate() (+4 more)

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
Nodes (9): useDragSource(), countMutations(), doc(), dropOn(), Harness(), now, performDrag(), SpikeCell (+1 more)

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

### Community 153 - "sceneStorageIDB.test.ts"
Cohesion: 0.21
Nodes (7): TokenPanel(), TokenPanelProps, CombatStatsSources, PlaceTokenInput, heroDoc, sources, SceneTokenKind

### Community 154 - "Dnd5eEquipmentTab.tsx"
Cohesion: 0.23
Nodes (12): createSupabaseJwtVerifier(), decodeBase64Url(), decodeJsonSegment(), fail(), resolveGatewayAuth(), SupabaseJwtVerifier, b64url(), mintToken() (+4 more)

### Community 155 - "5e Movement Rules"
Cohesion: 0.11
Nodes (19): Mode, SignIn(), SignInProps, UserMenu(), UserMenuProps, getLastSyncedUserId(), setLastSyncedUserId(), AuthProvider() (+11 more)

### Community 156 - "CharacterListView.tsx"
Cohesion: 0.04
Nodes (60): AppContent(), buildNewCharacterDocument(), cloneSystemData(), CreationWizardHost, LegalNotices, SceneManager, STORAGE_WARNING_THRESHOLD, AppHeader() (+52 more)

### Community 157 - "rules/dice.ts"
Cohesion: 0.27
Nodes (6): D20Roll, DualityRoll, rollD20(), rollDuality(), createLiveRng(), Rng

### Community 158 - "MAM Complication Browser"
Cohesion: 0.20
Nodes (23): validatePf1eBuild(), ABILITY_SCORE_IDS, addIssue(), addNonOpenSourceIssue(), consumeBuildLegality(), isIntegerInRange(), legalityRulePath(), loadValidationData() (+15 more)

### Community 160 - "Toast.tsx"
Cohesion: 0.27
Nodes (8): ToastContext, ToastContextValue, ToastItem, ToastProvider(), VARIANT_ICONS, VARIANT_STYLES, registerToastHandler(), ToastVariant

### Community 161 - "PF2e Backgrounds Data"
Cohesion: 0.15
Nodes (30): validatePf2eBuild(), Pf2eInventoryTab(), getPf2eBulkState(), addIssue(), CLASS_PROGRESSION_RANKS, createPf2eValidator(), isIntegerInRange(), loadValidationData() (+22 more)

### Community 164 - "retryWithBackoff"
Cohesion: 0.36
Nodes (8): computeBackoffMs(), isRetryableError(), NON_RETRYABLE_FRAGMENTS, PROD_DEFAULTS, RetryOptions, retryWithBackoff(), sleep(), TEST_DEFAULTS

### Community 177 - "characterDraftFlow.test.ts"
Cohesion: 0.06
Nodes (43): CharacterDraftApplier, collectUnknownIdIssues(), DocumentValidator, DraftCharacterParams, DraftCharacterResult, draftCharacterWithAi(), GatewayCall, POOL_LIST_FIELDS (+35 more)

### Community 179 - "systemAssetPrefetch.ts"
Cohesion: 0.27
Nodes (8): SYSTEM_IDS, getSystemAssetPrefetchStateForTests(), prefetchedSystemAssets, prefetchedSystemRuntimeData, prefetchedSystemSheets, prefetchSystemAssetsForIds(), resetSystemAssetPrefetchStateForTests(), systemAssetPrefetchers

### Community 180 - "daggerheart/validation.ts"
Cohesion: 0.13
Nodes (33): getDaggerheartStartingTraitArray(), addDomainCardActions(), addHopeFeature(), addUniversalMoves(), addWeaponStrikes(), buildLookup(), createDaggerheartLegalActions(), enumerateDaggerheartActions() (+25 more)

### Community 181 - "modifierEffects.ts"
Cohesion: 0.44
Nodes (5): ComputeLayer, DerivedDisplay, DerivedQuantityCase, DerivedQuantitySpec, RFC-003

### Community 182 - "syncTombstones.ts"
Cohesion: 0.09
Nodes (24): AI_GATEWAY_ENDPOINT, AiImageInput, AiRequest, EncounterDraftCandidate, EncounterDraftData, IdentifyCreatureData, DraftEncounterParams, DraftEncounterResult (+16 more)

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

### Community 188 - "mam3eValidation.test.ts"
Cohesion: 0.31
Nodes (7): createDocument(), createRegistry(), legalBuild(), mam3eEngine, power(), prepared(), TEST_DATE

### Community 190 - "index.ts"
Cohesion: 0.19
Nodes (13): SheetAddHandlers, SheetDispatchRegistry, SheetDispatchRegistryContext, SheetDispatchState, SheetDispatchStateContext, useSheetDispatch(), Consumer(), FEAT (+5 more)

### Community 191 - "retryWithBackoff"
Cohesion: 0.13
Nodes (25): buildMam3eCreatorData(), createDefaultMam3eDefenseRanks(), DERIVATION_EPOCH, deriveMam3eCreatorTotals(), Mam3eAbilities, Mam3eAbilityKey, Mam3eCreatorTotals, Mam3eDefenseRanks (+17 more)

### Community 192 - "applyPf2eAncestryTemplate"
Cohesion: 0.29
Nodes (7): abilityBoostValue(), ancestryFeatures(), applyAbilityAdjustments(), applyPf2eAncestryTemplate(), collectChoiceAbilityAdjustments(), collectFixedAbilityAdjustments(), sanitizeChoiceAbilitySelections()

### Community 194 - "@types/react-dom"
Cohesion: 0.03
Nodes (62): SystemRegistry, RFC-003, LegalActionEligibility, LegalActionList, LegalActionsContext, LegalActionTarget, SheetProps, SystemCreatorComponent (+54 more)

### Community 195 - "sceneTerrain.ts"
Cohesion: 0.26
Nodes (10): MakeGameParams, EncounterPanel(), EncounterPanelProps, formatAverageLevel(), EncounterPartySummary, EncounterPlanSummary, EncounterDifficulty, EncounterSpecValidation (+2 more)

### Community 202 - "phase3-workflows.spec.ts"
Cohesion: 0.29
Nodes (11): extractJsArray(), field(), main(), MODULES, parseEntries(), prettierBin(), readSource(), slug() (+3 more)

### Community 203 - "aiSdkAdapter.test.mts"
Cohesion: 0.13
Nodes (15): AiSdkAdapterConfig, createAiSdkAdapter(), IMAGE_TASKS, RFC-002, TASK_SCHEMAS, ENCOUNTER_PAYLOAD, RFC-002, promptText() (+7 more)

### Community 207 - "sceneConditionOptions.ts"
Cohesion: 0.08
Nodes (37): buildCharacterCombatant(), BuildCharacterCombatantResult, CharacterCombatant, normalizeSheet(), readArmorClass(), toMagicBonusItems(), toModifierSources(), num() (+29 more)

### Community 212 - "aiSdkAdapter.test.mts"
Cohesion: 0.08
Nodes (22): ANTHROPIC_REGISTRATION, BUILT_IN_PROVIDERS, DEFAULT_PROVIDER_REGISTRY, firstEnvValue(), GEMINI_REGISTRATION, MOCK_REGISTRATION, ProviderBuild, ProviderEnv (+14 more)

### Community 213 - "spikeViewport.ts"
Cohesion: 0.43
Nodes (6): rect, clampCoordinate(), invertPoint(), Rect, Viewport, zoomToCursor()

## Knowledge Gaps
- **1526 isolated node(s):** `semi`, `singleQuote`, `trailingComma`, `printWidth`, `tabWidth` (+1521 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **19 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `CharacterDocument` connect `Campaign Sync Hooks` to `Sheet Resource Loading Hooks`, `Daggerheart Sheet Automation`, `Dnd5e Equipment & Features UI`, `Dnd5e Background Templates`, `Dnd5e2024 Engine & Hit Dice`, `Daggerheart Engine`, `Tabs UI Component`, `Scene Combat Resolution`, `Dnd5e Class Templates`, `System Compute Registers`, `parseNum`, `Dnd5e Activity Definitions`, `shared/legalActions.ts`, `Dnd5e Feat Templates`, `App Shell & Layout`, `D20 Combat Controls`, `daggerheartSheetShared.tsx`, `Combat & Recap Panels`, `Game System Selector`, `Scene Illustration Panel`, `Daggerheart Data Model`, `sceneStorageIDB.test.ts`, `Daggerheart Inventory`, `Pf2e Character Templates`, `CharacterListView.tsx`, `MAM Complication Browser`, `Encounter & Initiative Panels`, `Pf2e Sheet Tabs`, `PF2e Backgrounds Data`, `Currency & Inventory Editors`, `Document Sync Engine`, `Sheet Header & Stat Cards`, `Equipped Armor Section`, `Encounter Builder Logic`, `Scene Management Hooks`, `characterDraftFlow.test.ts`, `Campaign Storage & Hooks`, `daggerheart/validation.ts`, `Spell Preparation Logic`, `Character Combatant Builder`, `D20 Class Spellcasting`, `SRD Manifest Generator`, `mam3eValidation.test.ts`, `D20 Legacy Spell Slots`, `ESLint Config`, `retryWithBackoff`, `AI Gateway Client`, `@types/react-dom`, `Character Effects Compilation`, `System Validation Logic`, `Dnd5e Feature Options`, `Document Migrations & Storage`, `sceneConditionOptions.ts`, `Combat Toggles & Conditions`, `Boundary Validation Tests`, `Equipment & Feature Browsers`, `Daggerheart Contribution Ledger`, `Dnd35e/Pf1e Derived Math`, `Mam Browser Tabs`, `Skills Tab & Combat Math`, `Mam3e Derived Math`, `Document Storage (IndexedDB)`, `5e Monster Encoder`, `Character Card Presenter`, `Oracle Panel & Logic`, `5e Equipment Tab`, `Scene Reaction Panel`, `Document Signature Hashing`, `Resource Pool Tracking`, `Dnd5eEquipmentTab.tsx`?**
  _High betweenness centrality (0.120) - this node is a cross-community bridge._
- **Why does `GameSystemId` connect `Dnd5e Resource Loading Hooks` to `Sheet Resource Loading Hooks`, `Dnd5e Sheets & E2E Tests`, `Dnd5e Equipment & Features UI`, `Dnd5e2024 Engine & Hit Dice`, `Tabs UI Component`, `System Compute Registers`, `shared/legalActions.ts`, `Game System Selector`, `Campaign Sync Hooks`, `Roadmap Metrics Generator`, `CharacterListView.tsx`, `Class Enhancement & Headers`, `Currency & Inventory Editors`, `Document Sync Engine`, `Doc Drift Rules`, `Condition Effects by System`, `Error Boundary & Auth Context`, `Encounter Builder Logic`, `characterDraftFlow.test.ts`, `systemAssetPrefetch.ts`, `Character Combatant Builder`, `D20 Class Spellcasting`, `AI Gateway Adapters`, `SRD Coverage Script`, `Browser Compat & Error Logging`, `sceneTerrain.ts`, `Spell Catalog Consistency Tests`, `sceneConditionOptions.ts`, `Mam Browser Tabs`, `Mam3e Derived Math`, `Document Storage (IndexedDB)`, `Oracle Panel & Logic`, `5e Equipment Tab`, `Document Signature Hashing`?**
  _High betweenness centrality (0.065) - this node is a cross-community bridge._
- **Why does `entry()` connect `daggerheart/validation.ts` to `Dnd5e Equipment & Features UI`, `Dnd5e Background Templates`, `Tabs UI Component`, `Node Runtime Bootstrap`, `pf2eConditions.ts`, `Dnd5e Feat Templates`, `Daggerheart Inventory`, `CharacterListView.tsx`, `AI Encounter Drafting`, `Doc Drift Rules`, `Error Boundary & Auth Context`, `Encounter Builder Logic`, `D20 Legacy Templates`, `D20 Class Spellcasting`, `AI Gateway Contracts`, `fake-indexeddb`, `Mam Character Sheet Tabs`, `Dnd5e Feature Options`, `Daggerheart Contribution Ledger`, `Dnd35e/Pf1e Derived Math`, `Pf2e Spell Data Encoder`, `Oracle Panel & Logic`?**
  _High betweenness centrality (0.043) - this node is a cross-community bridge._
- **What connects `semi`, `singleQuote`, `trailingComma` to the rest of the system?**
  _1526 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Sheet Resource Loading Hooks` be split into smaller, more focused modules?**
  _Cohesion score 0.09398907103825137 - nodes in this community are weakly interconnected._
- **Should `Dnd5e Sheets & E2E Tests` be split into smaller, more focused modules?**
  _Cohesion score 0.11379800853485064 - nodes in this community are weakly interconnected._
- **Should `Dnd5e Equipment & Features UI` be split into smaller, more focused modules?**
  _Cohesion score 0.04007187780772686 - nodes in this community are weakly interconnected._