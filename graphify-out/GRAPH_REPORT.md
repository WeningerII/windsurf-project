# Graph Report - windsurf-project  (2026-07-30)

## Corpus Check
- 921 files · ~769,830 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 5962 nodes · 17254 edges · 200 communities (185 shown, 15 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 168 edges (avg confidence: 0.72)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `afb1f9cc`
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
- MAM Complication Browser
- PF2e Backgrounds Data
- Host Size Budget Test
- MAM Complications Data
- MAM Power Modifiers Data
- Vitest Coverage Config
- characterDraftFlow.test.ts
- daggerheart/validation.ts
- modifierEffects.ts
- syncTombstones.ts
- loadEquipmentForSystem
- MamArchetypesTab.tsx
- eslint-plugin-react
- fake-indexeddb
- MamComplicationBrowser.tsx
- index.ts
- retryWithBackoff
- @types/react-dom
- sceneTerrain.ts
- @vitest/coverage-v8
- participantResolution.test.ts
- phase3-workflows.spec.ts
- aiSdkAdapter.test.mts
- sceneConditionOptions.ts
- aiSdkAdapter.test.mts
- spikeViewport.ts

## God Nodes (most connected - your core abstractions)
1. `CharacterDocument` - 308 edges
2. `SystemDataModel` - 167 edges
3. `GameSystemId` - 100 edges
4. `SystemRegistry` - 86 edges
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
- `D20AbilitiesTab()` --indirect_call--> `mod()`  [INFERRED]
  src/systems/d20-legacy/components/D20AbilitiesTab.tsx → scripts/encode-35e-monsters.mjs
- `Pf2eAbilitiesTab()` --indirect_call--> `mod()`  [INFERRED]
  src/systems/pf2e/components/Pf2eAbilitiesTab.tsx → scripts/encode-35e-monsters.mjs

## Import Cycles
- None detected.

## Communities (200 total, 15 thin omitted)

### Community 0 - "Sheet Resource Loading Hooks"
Cohesion: 0.13
Nodes (30): buildSystem(), CATEGORY_LOADERS, CategoryLoader, escape(), isRecord(), Loaded, main(), SystemConfig (+22 more)

### Community 1 - "Dnd5e Sheets & E2E Tests"
Cohesion: 0.18
Nodes (15): SystemCatalogSummary, SystemContentCategoryId, SystemContentReachability, SystemContentSummary, SystemSupportLevel, countProductItems(), loadSystemCatalogSummaryFromMetadataInternal(), metadataSummaryCache (+7 more)

### Community 2 - "Dnd5e Equipment & Features UI"
Cohesion: 0.04
Nodes (67): availableD20LegacyToggles(), Props, D20Save, D20SaveId, Props, SAVE_IDS, D20LegacyData, D20LegacySpellSlots (+59 more)

### Community 3 - "Dnd5e Background Templates"
Cohesion: 0.05
Nodes (86): Dnd5eSelectedFeatsSection(), Props, countSelections(), Dnd5eLikeDataModel, Dnd5eSheetMutators, optionDisabledForRequirement(), resolveEquipmentSlot(), resolveFeatSelections() (+78 more)

### Community 4 - "Dnd5e2024 Engine & Hit Dice"
Cohesion: 0.07
Nodes (32): HIT_DICE, hitDieSize(), hitDieString(), ArmorEquipItem, compute5eAC(), dnd5eArmorDexContribution(), Dnd5e2024Engine, hasAlertFeat() (+24 more)

### Community 5 - "Daggerheart Engine"
Cohesion: 0.08
Nodes (48): applyDnd5eClassTemplate(), applyDnd5eSubclassTemplate(), assertMulticlassRequirements(), ATTRIBUTE_NAME_TO_ID, buildChoiceSlots(), buildDerivedProficiencies(), buildSpellcastingState(), canSelectSubclass() (+40 more)

### Community 6 - "3.5e Monster Data Encoder"
Cohesion: 0.06
Nodes (57): ALIGNMENTS, DICE_PROGRESSIONS, main(), mapAlignment(), mod(), MONSTER_SIZE, normalizeName(), OLIMOT_FILES (+49 more)

### Community 7 - "Tabs UI Component"
Cohesion: 0.06
Nodes (51): Badge(), BadgeProps, badgeVariants, TABLIST_NAV_KEYS, Tabs, TabsContent, TabsContentProps, TabsContext (+43 more)

### Community 8 - "Node Runtime Bootstrap"
Cohesion: 0.09
Nodes (47): main(), runBootstrapNodeInstall(), getPinnedCommandArgs(), main(), runPinnedNpmCommand(), formatRuntimeDoctorReport(), main(), readWorkflowPinSource() (+39 more)

### Community 9 - "Scene Combat Resolution"
Cohesion: 0.05
Nodes (60): buildScene(), MakeGameResult, Props, SceneCreateFormProps, UseSceneEncounterParams, Props, BuildEncounterEventsParams, BuildEncounterEventsResult (+52 more)

### Community 10 - "Dnd5e Class Templates"
Cohesion: 0.04
Nodes (69): resolveD20LegacyArmorClass(), computeD20LegacyAC(), D20_SIZE_MOD, d20LegacyCheckPenalty(), applyDerivedQuantities(), presentDerivedQuantities(), ComputeLayer, DerivedDisplay (+61 more)

### Community 11 - "System Compute Registers"
Cohesion: 0.04
Nodes (37): createDefaultDnd5e2024Data(), Dnd5e2024SystemDef, createDefaultDnd5eData(), Dnd5eSystemDef, Dnd5eEngine, Dnd5eDocument, makeDnd5eDocument(), makeSystem() (+29 more)

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
Cohesion: 0.05
Nodes (55): BreakdownRow, buildRows(), ContributionBreakdown(), formulaOf(), Props, toRow(), RFC-003, D20_LEGACY_CONDITION_EFFECTS (+47 more)

### Community 16 - "App Shell & Layout"
Cohesion: 0.16
Nodes (25): validateDnd35eBuild(), Dnd35eFeat, addIssue(), appendBuildLegalityIssues(), createDnd35eValidator(), Dnd35eValidationData, isIntegerInRange(), loadValidationData() (+17 more)

### Community 17 - "D20 Combat Controls"
Cohesion: 0.22
Nodes (15): D20SkillsTab(), Props, d20SkillCheckPenalty(), daggerheartDamageDiceCount(), DND35E_SYNERGY_SOURCES, dnd35eMaxSkillRanks(), dnd35eSkillSynergyTotal(), dnd35eSynergyBonus() (+7 more)

### Community 18 - "Game System Selector"
Cohesion: 0.07
Nodes (72): EquippedItemsSection(), Props, SLOT_LABELS, SLOT_ORDER, buildCharacterCombatant(), normalizeSheet(), readArmorClass(), toMagicBonusItems() (+64 more)

### Community 19 - "Combat & Recap Panels"
Cohesion: 0.07
Nodes (56): Doc, useSync(), UseSyncOptions, baseAuthValue, mockedClearQueuedDeletedDocumentIds, mockedClearQueuedSyncSnapshot, mockedDeleteRemoteDocument, mockedFetchRemoteDocuments (+48 more)

### Community 20 - "D20 Legacy System Engines"
Cohesion: 0.15
Nodes (31): SceneCreateForm(), isOracleAnswer(), applyHitPointDelta(), applySceneEvent(), assertNever(), buildEventFromIntent(), checkIntentIssues(), cloneMarker() (+23 more)

### Community 21 - "Dnd35e Saves & Data Model"
Cohesion: 0.10
Nodes (34): monsterAverageHitPoints(), applyDamageMitigation(), DamageMitigation, DamageProfile, mitigateDamage(), resolveDamageMitigation(), snapshotDamageProfile(), RFC-006 (+26 more)

### Community 22 - "Daggerheart Data Model"
Cohesion: 0.09
Nodes (23): LibraryScenesView(), InitiativeTracker(), terrainEffectsForPreset(), isSceneCanvasEnabled(), measureImageSize(), PlacementMode, SceneManager(), RFC-006 (+15 more)

### Community 23 - "System Registry & Renderer"
Cohesion: 0.16
Nodes (20): CampaignManager(), useCampaigns(), DebouncedPersistence, IMPORTANT: a begun generation must end in either `persist` or, useDebouncedPersistence(), hostileStorage, CAMPAIGNS_STORAGE_KEY, clearCampaignStorage() (+12 more)

### Community 24 - "Game Rules & Proficiencies"
Cohesion: 0.07
Nodes (34): GAME_RULES, ArmorProficiency, ArmorProficiencyType, ArtisanToolProficiency, GamingSetProficiency, isValidArmorProficiency(), isValidSkillProficiency(), isValidToolProficiency() (+26 more)

### Community 25 - "Campaign Sync Hooks"
Cohesion: 0.06
Nodes (62): CurrencyEditor(), CurrencyEntry, DND_CURRENCIES, Props, DamageHealControl(), DamageHealControlProps, DiceRollButton(), DiceRollButtonProps (+54 more)

### Community 26 - "Daggerheart Inventory"
Cohesion: 0.10
Nodes (37): getDaggerheartAncestryAdjustments(), findDaggerheartInventoryDefinitionByName(), ancestryLookup, armorLookup, buildLookup(), classLookup, communityLookup, DEFAULTS (+29 more)

### Community 27 - "Pf2e Character Templates"
Cohesion: 0.08
Nodes (53): Pf2eArchetypesTab(), Props, createPf2eCreationPlan(), PF2E_ARCHETYPE_DEDICATION_GRANTS, Pf2eDedicationProficiencyGrant, Pf2eFeat, GetPf2eSheetChoiceStateProps, Pf2eChoiceSlot (+45 more)

### Community 28 - "Roadmap Metrics Generator"
Cohesion: 0.06
Nodes (50): byId, byName, failures, manifest, manifestByName, root, seenSrdNames, shipped (+42 more)

### Community 29 - "Dnd5e Feature List Sections"
Cohesion: 0.12
Nodes (20): clampTrack(), DeathSaves, DeathSavesTracker(), Props, HitDiceTracker(), Props, Props, SLOT_LEVELS (+12 more)

### Community 30 - "Encounter & Initiative Panels"
Cohesion: 0.06
Nodes (47): resolvePf2eArmorClass(), computePf2eAC(), SAVE_ABILITIES, SKILL_ABILITIES, createDefaultPf2eData(), profTotal(), tierBonus(), CREATURE_XP_BY_LEVEL_DIFF (+39 more)

### Community 31 - "Class Enhancement & Headers"
Cohesion: 0.09
Nodes (29): MamAdvantageBrowserTab(), Props, MamArchetypeBrowser(), MamArchetypeBrowserProps, MamArchetypeBrowser, MamArchetypesTab, MamArchetypesTabComponent, Props (+21 more)

### Community 32 - "Pf2e Sheet Tabs"
Cohesion: 0.08
Nodes (25): CombatTogglesSection(), Props, Condition, ConditionPicker(), Props, FeaturesSection(), Props, D20FeatsTab() (+17 more)

### Community 33 - "AI Encounter Drafting"
Cohesion: 0.09
Nodes (29): DEFAULT_QUICK_ROLLS, DicePanel(), DicePanelProps, formatBreakdown(), QUICK_ROLLS_BY_SYSTEM, DISPOSITION_BADGE, DISPOSITION_LABEL, ReactionHistoryEntry (+21 more)

### Community 34 - "Quest & Session Log UI"
Cohesion: 0.11
Nodes (33): Props, QuestList(), STATUS_BADGE, STATUS_OPTIONS, DATE_FORMAT, Props, SessionLog(), UseCampaignSyncOptions (+25 more)

### Community 35 - "Currency & Inventory Editors"
Cohesion: 0.06
Nodes (53): rollD20(), ABILITIES, DEFENSES, MamAbilitiesTab(), Props, MamConditionsTab(), Props, MamHeader() (+45 more)

### Community 36 - "Document Sync Engine"
Cohesion: 0.11
Nodes (31): isRoundConclusive(), RoundCombatant, RoundTurnRecord, runCombatRound(), RunRoundInput, toActor(), toTarget(), RFC-003 (+23 more)

### Community 37 - "Sheet Header & Stat Cards"
Cohesion: 0.11
Nodes (13): Pf2eSystemDef, createRegistry(), createRegistry(), createRegistry(), createRegistry(), createRegistry(), createRegistry(), createRegistry() (+5 more)

### Community 38 - "Check & Oracle Resolution"
Cohesion: 0.70
Nodes (3): DOCK_TABS, DockTabDescriptor, DockTabKind

### Community 39 - "Mam3e Data Model & Engine"
Cohesion: 0.19
Nodes (12): dnd5eCarryingCapacity(), dnd5eHighJump(), dnd5eLongJump(), dnd5ePushDragLift(), dnd5eSpeedWithArmor(), d20LegacySpellSaveDC(), DND5E_CANTRIP_SCALE_BREAKPOINTS, dnd5eCantripScaleTier() (+4 more)

### Community 40 - "Doc Drift Rules"
Cohesion: 0.07
Nodes (54): DOC_DRIFT_MANIFEST, DocDriftRuleType, DocDriftSurface, DocDriftSurfaceKind, CAPABILITY_PHRASE_RULES, CapabilityPhraseRule, capitalizeSupportLevel(), COMMAND_RUNTIME_RULES (+46 more)

### Community 41 - "NPM Build Scripts"
Cohesion: 0.04
Nodes (56): scripts, analyze, bootstrap:node, build, check:bundle-size, check:compute-register, check:compute-register:mutate, check:compute-register:write (+48 more)

### Community 42 - "Condition Effects by System"
Cohesion: 0.16
Nodes (8): DaggerheartSystemDef, createRegistry(), createWarrior(), TEST_DATE, cardEntry(), createLegalWarrior(), DomainCardEntry, TEST_DATE

### Community 43 - "Equipped Armor Section"
Cohesion: 0.08
Nodes (30): EquipArmorInput, EquipEntry, EquippedArmorSection(), EquipShieldInput, Props, Dock(), DockResources, EMPTY (+22 more)

### Community 44 - "Spell Browser UI"
Cohesion: 0.07
Nodes (32): Props, formatMamPowerAction(), formatMamPowerDuration(), formatMamPowerRange(), humanizeMamToken(), MamPowerBrowserTabComponent, MamPowerModifierBrowser, Props (+24 more)

### Community 45 - "Scene Combat Area Effects"
Cohesion: 0.17
Nodes (15): buildNotice(), FetchTarget, fetchValidated(), HTML_ENTITIES, looksLikeHtml(), main(), normalize(), noticePath (+7 more)

### Community 46 - "Error Boundary & Auth Context"
Cohesion: 0.13
Nodes (23): D20ClassesSection(), D20LegacyClassLevel, renderClassOptions(), d20BonusSpells(), buildD20LegacySpellSlotTotals(), countAdvancementLevels(), D20_DOMAIN_CLASS_IDS, D20_FALLBACK_CASTING_ABILITIES (+15 more)

### Community 47 - "Encounter Builder Logic"
Cohesion: 0.11
Nodes (35): createD20LegacyCreationPlan(), applyAbilityAdjustments(), applyD20LegacyClassTemplate(), applyD20LegacyRaceTemplate(), buildClassSkills(), classFeaturesUpToLevel(), classSkillOptions(), collectClassFeatureSignatures() (+27 more)

### Community 48 - "Scene Management Hooks"
Cohesion: 0.08
Nodes (55): mergeLoadedScenes(), useScenes(), makeAsset(), makeSceneWithMap(), NOW, defineSetItem(), installLocalStorageQuota(), makeHeavyScene() (+47 more)

### Community 49 - "Monster Combatant Builder"
Cohesion: 0.06
Nodes (38): CheckPanel(), MapPanel(), MapPanelProps, RFC-006, ANSWER_BADGE, OraclePanel(), OraclePanelProps, RecapPanel() (+30 more)

### Community 50 - "D20 Legacy Templates"
Cohesion: 0.10
Nodes (51): getDaggerheartShortRestRecovery(), createDaggerheartInventoryEntry(), clearAllStress(), clearStress(), prepareGainHope(), repairAllArmor(), repairArmor(), tendToAllWounds() (+43 more)

### Community 51 - "Campaign Storage & Hooks"
Cohesion: 0.27
Nodes (9): makeScene(), campaignSignatureFor(), sameCampaignSignatures(), sameDocumentSignatures(), sameSceneSignatures(), sameSignatureMultisets(), sceneSignatureFor(), signatureFor() (+1 more)

### Community 52 - "Spell Preparation Logic"
Cohesion: 0.09
Nodes (29): buildSceneCombatants(), critModelForScene(), degreeModelForScene(), factionForToken(), ResolveCombatStats, resolveSceneAttack(), runSceneRound(), SceneAreaEffectOutcome (+21 more)

### Community 53 - "Dev Dependencies"
Cohesion: 0.04
Nodes (53): autoprefixer, eslint, eslint-config-prettier, @eslint/js, eslint-plugin-react, eslint-plugin-react-hooks, globals, happy-dom (+45 more)

### Community 54 - "Character Combatant Builder"
Cohesion: 0.10
Nodes (24): AI_TASK_UNIT_COST, AiTask, TaskGatewayCall, AnyTaskGatewayCall, createFlowBudget(), DEFAULT_MAKE_GAME_FLOW_BUDGET, FlowBudget, FlowBudgetLimits (+16 more)

### Community 55 - "D20 Class Spellcasting"
Cohesion: 0.09
Nodes (30): DND5E_SCENE_CONDITIONS, SCENE_CONDITIONS_BY_SYSTEM, sceneConditionOptions(), legacyD20Profile(), collectD20LegacyConditionEffects(), D20_LEGACY_CONDITION_IDS, D20LegacySystemId, collectD20LegacyRiderEffects() (+22 more)

### Community 56 - "SRD Manifest Generator"
Cohesion: 0.05
Nodes (72): ProficiencyListSection(), Props, appendInventoryFromBackground(), applyDnd5eBackgroundTemplate(), BackgroundChoiceSlot, BackgroundChoiceValue, backgroundDerivedState(), COMMON_LANGUAGE_OPTIONS (+64 more)

### Community 57 - "Daggerheart Combatant Builders"
Cohesion: 0.07
Nodes (27): PendingMonster, SceneDropControllerProps, CR_XP_TABLE, formatChallengeRating(), MonsterBrowser(), DraftEncounterParams, GeneratedNpc, generateNpc() (+19 more)

### Community 58 - "AI Gateway Adapters"
Cohesion: 0.09
Nodes (30): aiFailure, AiFailureCode, AiResponse, AiTaskClass, GatewayContext, GatewayTimeoutError, handleAiRequest(), latencyBudgetFor() (+22 more)

### Community 59 - "AI Gateway Contracts"
Cohesion: 0.12
Nodes (33): AI_TASK_CLASS, AiParse, AiSuccess, AiUsage, CharacterDraftRequest, EncounterDraftRequest, IdentifyCreatureRequest, IllustrateSceneRequest (+25 more)

### Community 60 - "System Definitions & Types"
Cohesion: 0.28
Nodes (14): actionReachCells(), ATTACK_COUNT_WORDS, averageDie(), buildMonsterCombatant(), dieFaces(), isMinusSign(), monsterAttackEffects(), monsterAttacksPerRound() (+6 more)

### Community 61 - "D20 Legacy Spell Slots"
Cohesion: 0.19
Nodes (12): categoryIcons, GameSystemSelector(), GameSystemSelectorProps, systemAccents, supportBadgeLabels, supportBadgeStyles, buildInitialSummaryStates(), categoryDisplay (+4 more)

### Community 62 - "SRD Coverage Script"
Cohesion: 0.06
Nodes (56): buildManifest(), CLASSES, CLASSIFICATION_PATH, HERE, LICENSING_CLASSES, loadShipped(), MANIFEST_PATH, run() (+48 more)

### Community 63 - "ESLint Config"
Cohesion: 0.23
Nodes (13): LegalActionDescriptor, addAttackOfOpportunity(), addAttacks(), addCombatActions(), addFullAttack(), addSpellcasting(), createD20LegacyLegalActions(), D20LegacyActionData (+5 more)

### Community 64 - "Spells Tab Components"
Cohesion: 0.25
Nodes (7): ArmorItem, DnD35eArmor, DnD35eShield, DnD35eGear, GearItem, DnD35eWeapon, WeaponItem

### Community 65 - "Browser Compat & Error Logging"
Cohesion: 0.12
Nodes (22): Props, State, LegalNotices(), LegalNoticesProps, licenseTexts, LibraryBestiaryView(), LoadState, MonsterBrowser (+14 more)

### Community 66 - "AI Gateway Client"
Cohesion: 0.38
Nodes (10): CharacterCard(), asNumber(), asRecord(), asString(), getClassLabel(), getDocumentLevelValue(), getHitPointLabel(), getLevelLabel() (+2 more)

### Community 67 - "2024 Monster Data Encoder"
Cohesion: 0.16
Nodes (23): ABILITIES, ALIGNMENTS, bucketFor(), classifyImmunityList(), cleanProse(), CR_FRACTIONS, CREATURE_TYPES, DAMAGE_TYPES (+15 more)

### Community 68 - "Character Effects Compilation"
Cohesion: 0.07
Nodes (44): getDaggerheartEffectiveAttribute(), clampDaggerheartInventoryQuantity(), daggerheartInventoryDefinitions, getDaggerheartInventoryDefinition(), inventoryDefinitionById, inventoryDefinitionByName, isDaggerheartConsumableDefinition(), normalizeDaggerheartCurrency() (+36 more)

### Community 69 - "TypeScript Config"
Cohesion: 0.07
Nodes (27): ES2020, src, compilerOptions, allowImportingTsExtensions, baseUrl, forceConsistentCasingInFileNames, isolatedModules, jsx (+19 more)

### Community 70 - "Mam Character Sheet Tabs"
Cohesion: 0.06
Nodes (48): daggerheartComputeRegister, dnd35eComputeRegister, dnd5e2014ComputeRegister, dnd5e2024ComputeRegister, COMPUTE_REGISTERS, registerForSystem(), mam3eComputeRegister, MUTATION_ANCHORS (+40 more)

### Community 72 - "Dice Panel & Mam3e Resolution"
Cohesion: 0.07
Nodes (29): counterStore, latencyBudgetsFromEnv(), positiveEnv(), rateLimiterFromEnv(), sessionBudgetFromEnv(), anthropicAdapter, googleAdapter, Clock (+21 more)

### Community 73 - "System Validation Logic"
Cohesion: 0.12
Nodes (35): ABILITY_KEYS, DND5E_ASI_LEVELS_BY_CLASS, DND5E_BASE_ASI_LEVELS, DND5E_MULTICLASS_PREREQ, dnd5eAsiSlotsGranted(), validateDnd5eBuild(), dnd5eKnownSpellLimit(), dnd5eKnownSpellOverage() (+27 more)

### Community 74 - "Spell Catalog Consistency Tests"
Cohesion: 0.08
Nodes (42): ALL_SYSTEMS, ALLOWED_BY_ID, ALLOWLIST, allowlistHits, auditCitation(), auditRulesLayerLiterals(), CATEGORY_LOADERS, cleared (+34 more)

### Community 75 - "Dnd5e Resource Loading Hooks"
Cohesion: 0.06
Nodes (71): ancestryPool(), backgroundPool(), classPool(), loadCharacterDraftPools(), NamedEntity, toCandidates(), RFC-002, feat (+63 more)

### Community 76 - "Mam Powers & Cost Ledger"
Cohesion: 0.09
Nodes (25): mapImageLayerStyle(), ALLEGIANCE_COLORS, drawScene(), drawTokenChip(), MARKER_FILL, SceneCanvas, tokenInitials(), ALLEGIANCE_LABEL (+17 more)

### Community 78 - "Dnd5e Feature Options"
Cohesion: 0.11
Nodes (31): Props, Props, FeatureOptionBrowser(), FeatureOptionBrowserProps, selectionKey(), appendBulletList(), applyDnd5eFeatureOptionSelection(), ClassLevelLike (+23 more)

### Community 79 - "Document Migrations & Storage"
Cohesion: 0.06
Nodes (59): cloneDocumentsSnapshot(), documentsChanged(), engineLoadErrorMessage(), prepareDocumentsWithEngines(), prepareDocumentWithEngine(), unresolvedEngineSystemIds(), useDocuments(), withPreparedDocuments() (+51 more)

### Community 80 - "App Header & Auth UI"
Cohesion: 0.24
Nodes (10): AppHeader(), AppHeaderProps, ThemeToggle(), LibrarySegment, applyTheme(), getSystemTheme(), isTheme(), Theme (+2 more)

### Community 81 - "Combat Toggles & Conditions"
Cohesion: 0.14
Nodes (13): CurrencyEditor, CurrencyEditorProps, Dnd5eEquipmentTabComponent, EquipmentBrowser, EquipmentBrowserItem, EquipmentBrowserProps, EquippedItemsSection, EquippedItemsSectionProps (+5 more)

### Community 82 - "HP & Spell Slot Trackers"
Cohesion: 0.11
Nodes (19): AI_GATEWAY_ENDPOINT, AiRequest, GeneratedImageData, SceneNarrationData, BY_DESIGN_FAILURE_CODES, callAiGateway(), isAiEnabled(), reportGatewayFailure() (+11 more)

### Community 84 - "Boundary Validation Tests"
Cohesion: 0.24
Nodes (19): NOW, parseImg(), validDocInput(), coerceDate(), coerceObjectives(), coerceQuests(), coerceSceneMapReference(), coerceSessionLog() (+11 more)

### Community 85 - "capabilityScenarios.test.tsx"
Cohesion: 0.60
Nodes (3): formatModifierCost(), MamPowerModifierBrowser(), MamPowerModifierBrowserProps

### Community 86 - "Equipment & Feature Browsers"
Cohesion: 0.07
Nodes (42): casterTypes, classResourcesNeeded, classTags, Props, getEligibleDnd5eFeatureOptions(), featureOptionSelectionKey(), ABILITY_TOKEN_MAP, collectAlwaysPreparedByLevelSources() (+34 more)

### Community 87 - "Pf2e Engine & Constants"
Cohesion: 0.09
Nodes (20): GapLedgerItem, LedgerPhase, LedgerStatus, LedgerTag, LedgerTrack, MASTER_GAP_LEDGER, RFC-003, byPhase (+12 more)

### Community 88 - "Documents Hook & Persistence"
Cohesion: 0.25
Nodes (10): availableDnd5eToggles(), collectDnd5eRiderEffects(), DND5E_TOGGLE_IDS, dnd5eEditionOf(), Dnd5eRiderInputs, Dnd5eSystemId, hasFlatFivePenaltyTenDamageFeats(), RAGE_DAMAGE_BREAKPOINTS (+2 more)

### Community 89 - "Daggerheart Contribution Ledger"
Cohesion: 0.06
Nodes (58): ANCESTRY_ADJUSTMENTS_BY_ID, ancestryByName, classByName, DAGGERHEART_TIER_BREAKPOINTS, DAGGERHEART_TRAITS, DaggerheartAncestryAdjustments, DaggerheartRange, DEFAULT_DAGGERHEART_ANCESTRY_ADJUSTMENTS (+50 more)

### Community 90 - "Dnd35e/Pf1e Derived Math"
Cohesion: 0.13
Nodes (24): LegalActionCost, addDomainCardActions(), addHopeFeature(), addUniversalMoves(), addWeaponStrikes(), buildLookup(), createDaggerheartLegalActions(), enumerateDaggerheartActions() (+16 more)

### Community 91 - "Mam Browser Tabs"
Cohesion: 0.08
Nodes (47): DocumentValidator, EncounterDraftSelection, draftEncounterWithAi(), fileToAiImageInput(), readAsDataUrl(), draftEncounter(), MakeGameEncounter, MakeGameParams (+39 more)

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
Cohesion: 0.26
Nodes (10): evaluateKeepaliveBudget(), FORBIDDEN_HIDE_UTILITIES, KEEPALIVE_BUDGETS, pushIf(), REQUIRED_TRANSITIONS, expected, greenReport(), greenSwitch() (+2 more)

### Community 97 - "Mam3e Derived Math"
Cohesion: 0.08
Nodes (32): CharacterDraftBinding, CreationWizard(), CreationWizardProps, framedSteps(), severityWeight(), ValidationSummary(), CreationWizardHostProps, buildDocumentFromPlanIds() (+24 more)

### Community 98 - "Doc Drift Tests"
Cohesion: 0.06
Nodes (20): BLOCKING_IMPACTS, createCharacterForSystem(), expectNoBlockingViolations(), freezeAnimations(), getCharacterNameInput(), KNOWN_A11Y_DEBT, openLandingPage(), RFC-004 (+12 more)

### Community 99 - "Spell Catalog Parity Tests"
Cohesion: 0.11
Nodes (5): DND35E_SOURCE_BLOCKED_SPELL_IDS, fieldCoverageBaselines, PF1E_SOURCE_ROWS_WITHOUT_SAVING_THROW, SpellModule, spellModules

### Community 100 - "Pf2e Spell Types & Traits"
Cohesion: 0.13
Nodes (19): CombatStatCard(), Props, PresentedDerivedQuantity, D20DerivedStats(), DERIVED_ICON_BY_NAME, derivedIcon(), Props, DaggerheartDerivedStats() (+11 more)

### Community 101 - "Document Storage (IndexedDB)"
Cohesion: 0.27
Nodes (8): collectPf2eRiderEffects(), PF2E_SNEAK_ATTACK_BREAKPOINTS, PF2E_TOGGLE_IDS, PF2E_TOGGLE_LABELS, Pf2eRiderInputs, pf2eSneakAttackDice(), breakpoints(), levelPlus()

### Community 102 - "5e Monster Encoder"
Cohesion: 0.22
Nodes (15): ABILITY_BY_INDEX, ALIGNMENTS, bucketFor(), CREATURE_TYPES, DAMAGE_TYPES, main(), mapAction(), mapAlignment() (+7 more)

### Community 103 - "Knip Lint Config"
Cohesion: 0.16
Nodes (14): ExpectedSpellIdentity, iconicSpellExpectations, SystemKey, systems, dedupeById(), Identified, indexById(), warnDuplicateId() (+6 more)

### Community 104 - "PF2e Monster Encoder"
Cohesion: 0.23
Nodes (14): ALIGNMENT_ABBREV, bucketFor(), CREATURE_TYPES, DAMAGE_TYPES, main(), mapAttack(), normalizeName(), parseDamage() (+6 more)

### Community 105 - "SurfaceStageKeepaliveBudget.test.tsx"
Cohesion: 0.21
Nodes (10): Surface, Harness(), HiddenSurfaceReport, measureTour(), mountCounts, SURFACES, surfaceWrapper(), SwitchReport (+2 more)

### Community 106 - "Character Card Presenter"
Cohesion: 0.06
Nodes (41): DragContext, NO_HANDLERS, useDragContext(), useDragSource(), DragLayer, DragLayerProps, DragProvider(), toSample() (+33 more)

### Community 107 - "Oracle Panel & Logic"
Cohesion: 0.05
Nodes (56): CharacterDraftProposal, MakeGameCharacter, Props, CharacterCardProps, CharacterListViewProps, Props, SystemSheetRenderer(), useSheetDispatchRegister() (+48 more)

### Community 108 - "5e Equipment Tab"
Cohesion: 0.08
Nodes (40): DEFAULT_LABELS, SpellBrowser(), SpellBrowserLabels, SpellBrowserProps, SpellBrowserSpell, BrowserFeat, DockPanel(), DockPanelProps (+32 more)

### Community 109 - "Scene Reaction Panel"
Cohesion: 0.16
Nodes (19): countTrainedSkills(), D20LegacyTabs(), D20SpellBrowserPanel, compareSpells(), D20SpellsTab(), formatSpellLevel(), Props, titleCase() (+11 more)

### Community 110 - "Document Signature Hashing"
Cohesion: 0.09
Nodes (32): computeDnd5eBaseArmorClass(), foldArmorClass(), resolveDnd5eArmorClass(), contextWithConditionIds(), resolveCharacterEffects(), compileBaseArmorClassEffects(), Dnd5eTemplateState, getDnd5eDefenseStyleArmorClassBonus() (+24 more)

### Community 111 - "Resource Pool Tracking"
Cohesion: 0.33
Nodes (10): addMovement(), addReady(), addShieldActions(), addSpellcasting(), addStrikes(), createPf2eLegalActions(), enumeratePf2eActions(), isEquippedShield() (+2 more)

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
Cohesion: 0.31
Nodes (6): SURFACES, SurfaceStage(), SurfaceStageProps, useAppNav, Harness(), NavControls()

### Community 117 - "check-mam-equipment-provenance.mjs"
Cohesion: 0.22
Nodes (8): artifactPath, attributeMutations, definitionDirs, root, sourceHash, sourcePath, systemsDir, violations

### Community 118 - "dnd5eToolChoices.ts"
Cohesion: 0.53
Nodes (3): surfaceMarkName(), useSurfaceSwitchMetrics(), renderMetrics()

### Community 119 - "MAM Archetype Browser"
Cohesion: 0.27
Nodes (11): CLASS_TOKENS, d20srdUrl(), FILES, main(), mapCastingTime(), mapDuration(), mapRange(), normalizeName() (+3 more)

### Community 120 - "PF1e Spell Encoder"
Cohesion: 0.27
Nodes (11): CLASS_COLUMNS, main(), mapCastingTime(), mapDuration(), mapRange(), RFC-4180, normalizeName(), parseCsv() (+3 more)

### Community 123 - "3.5e Gear & Weapons"
Cohesion: 0.60
Nodes (3): clampExhaustion(), Props, RestControls()

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
Cohesion: 0.05
Nodes (32): @testing-library/jest-dom, CharacterListView(), RFC-003, registerAllSystems(), renderSyntheticWizard(), syntheticPlan(), openBrokenSheet(), MockBeforeInstallPromptEvent (+24 more)

### Community 130 - "legality/pf2e.ts"
Cohesion: 0.07
Nodes (26): SystemSheetComponent, makeD20LegacySheet(), Dnd35eSystemDef, Dnd5eFeatureOptionsSection(), Dnd5eFeatureOptionsSectionComponent, FeatureOptionBrowser, FeatureOptionBrowserProps, featureOptionSelectionKey() (+18 more)

### Community 131 - "Retry With Backoff"
Cohesion: 0.07
Nodes (39): useCampaignSync(), baseAuthValue, mockedClearQueuedCampaignsSnapshot, mockedClearQueuedDeletedCampaignIds, mockedDeleteRemoteCampaign, mockedFetchRemoteCampaigns, mockedGetQueuedCampaignsSnapshot, mockedGetQueuedDeletedCampaignIds (+31 more)

### Community 132 - "2024 Spell Encoder"
Cohesion: 0.39
Nodes (8): main(), mapCastingTime(), mapDuration(), mapRange(), normalizeName(), SCHOOLS, slug(), ts()

### Community 133 - "MAM Power Browser"
Cohesion: 0.16
Nodes (11): react, react, InventoryItem, InventoryManager(), InventoryManagerProps, useTabs(), Currency, D20InventoryTab() (+3 more)

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
Cohesion: 0.12
Nodes (16): Props, SheetHeader(), Dnd5eAbilitiesTab(), Props, Dnd5eHeaderSection(), HeaderOption, Props, Dnd5eNotesTab() (+8 more)

### Community 139 - "Prettier Config"
Cohesion: 0.22
Nodes (8): arrowParens, endOfLine, overrides, printWidth, semi, singleQuote, tabWidth, trailingComma

### Community 141 - "shared/legalActions.ts"
Cohesion: 0.30
Nodes (11): addMovement(), addReaction(), addSpellcasting(), addStandardActions(), addWeaponAttacks(), createDnd5eLegalActions(), enumerateDnd5eActions(), isEquippedWeapon() (+3 more)

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
Cohesion: 0.11
Nodes (21): resolveCharacterLedger(), collectPf2eCheckConditionEffects(), collectPf2eConditionEffects(), ConditionScope, getPf2eConditionStatusPenalty(), highestValue(), magnitude(), PF2E_STATUS_CONDITIONS (+13 more)

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

### Community 154 - "Dnd5eEquipmentTab.tsx"
Cohesion: 0.14
Nodes (20): createSupabaseJwtVerifier(), decodeBase64Url(), decodeJsonSegment(), fail(), resolveGatewayAuth(), SupabaseJwtVerifier, b64url(), mintToken() (+12 more)

### Community 155 - "5e Movement Rules"
Cohesion: 0.06
Nodes (36): Mode, SignIn(), SignInProps, UserMenuProps, AuthContext, AuthContextValue, clearLocalDataForAccountChange(), getLastSyncedUserId() (+28 more)

### Community 156 - "CharacterListView.tsx"
Cohesion: 0.05
Nodes (55): AppContent(), buildNewCharacterDocument(), cloneSystemData(), CreationWizardHost, LegalNotices, SceneManager, STORAGE_WARNING_THRESHOLD, CharacterSortOption (+47 more)

### Community 158 - "MAM Complication Browser"
Cohesion: 0.14
Nodes (27): validatePf1eBuild(), ABILITY_KEYS, TIER_BONUS, BuildLegalityResult, BuildViolation, ABILITY_SCORE_IDS, addIssue(), addNonOpenSourceIssue() (+19 more)

### Community 161 - "PF2e Backgrounds Data"
Cohesion: 0.15
Nodes (29): validatePf2eBuild(), getPf2eBulkState(), addIssue(), CLASS_PROGRESSION_RANKS, createPf2eValidator(), isIntegerInRange(), loadValidationData(), PF2E_ABILITY_IDS (+21 more)

### Community 177 - "characterDraftFlow.test.ts"
Cohesion: 0.06
Nodes (43): CharacterDraftApplier, collectUnknownIdIssues(), DraftCharacterParams, DraftCharacterResult, draftCharacterWithAi(), GatewayCall, POOL_LIST_FIELDS, POOL_SINGLE_FIELDS (+35 more)

### Community 180 - "daggerheart/validation.ts"
Cohesion: 0.24
Nodes (21): addIssue(), buildLookup(), createDaggerheartValidator(), CUSTOM_INVENTORY_PREFIXES, DaggerheartValidationData, isIntegerInRange(), NamedEntry, normalizeLookupKey() (+13 more)

### Community 181 - "modifierEffects.ts"
Cohesion: 0.12
Nodes (21): EffectCondition, StackPolicy, DaggerheartAttackResult, DaggerheartThresholds, applyToughnessDegrees(), Mam3eAttackResult, Mam3eConditionDelta, Mam3eDefenseKind (+13 more)

### Community 182 - "syncTombstones.ts"
Cohesion: 0.12
Nodes (16): AiImageInput, EncounterDraftCandidate, EncounterDraftData, IdentifyCreatureData, DraftEncounterParams, DraftEncounterResult, GatewayCall, SelectionValidator (+8 more)

### Community 183 - "loadEquipmentForSystem"
Cohesion: 0.50
Nodes (3): Answer, Outcome, Q: where are pending debounced document saves flushed to localStorage on page hide or unload (persistence flush)

### Community 184 - "MamArchetypesTab.tsx"
Cohesion: 0.26
Nodes (16): assertNever(), INITIAL_NAV_STATE, LIBRARY_SEGMENTS, librarySegmentLabel(), Overlay, ShellAction, ShellContext, ShellContextValue (+8 more)

### Community 186 - "eslint-plugin-react"
Cohesion: 0.40
Nodes (4): Feat, FeatBrowser(), FeatBrowserProps, feats

### Community 187 - "fake-indexeddb"
Cohesion: 0.16
Nodes (18): BACKGROUND_FIELDS(), BASELINE_PATH, buildManifest(), CR_FRACTIONS, EXTRACTORS, HERE, LOADERS, loadProductEntries() (+10 more)

### Community 190 - "index.ts"
Cohesion: 0.17
Nodes (15): SheetAddHandlers, SheetDispatch, SheetDispatchRegistry, SheetDispatchRegistryContext, SheetDispatchState, SheetDispatchStateContext, useSheetDispatch(), SheetDispatchProvider() (+7 more)

### Community 191 - "retryWithBackoff"
Cohesion: 0.05
Nodes (74): toContributionLedger(), MamPowersTab(), ModifierColumn(), ModifierColumnProps, buildMam3eContributionLedger(), buildMam3ePowerCostEffects(), buildMam3ePowerCostLedgerEntries(), createPowerCostEffect() (+66 more)

### Community 194 - "@types/react-dom"
Cohesion: 0.08
Nodes (22): SystemRegistry, LegalActionEligibility, LegalActionList, LegalActionsContext, LegalActionTarget, SheetProps, SystemCreatorComponent, SystemCreatorProps (+14 more)

### Community 195 - "sceneTerrain.ts"
Cohesion: 0.05
Nodes (55): IllustrateSceneResult, NarrateSceneResult, AllegianceChip(), AllegianceChipProps, CheckPanelProps, DEFAULT_SUGGESTIONS, DND5E_SKILLS, OUTCOME_BADGE (+47 more)

### Community 201 - "participantResolution.test.ts"
Cohesion: 0.10
Nodes (31): AttackResolution, AttackResolutionInput, resolveAttack(), rollD20(), DaggerheartAttackInput, Mam3eAttackInput, AreaEffectInput, AreaEffectOutcome (+23 more)

### Community 202 - "phase3-workflows.spec.ts"
Cohesion: 0.29
Nodes (11): extractJsArray(), field(), main(), MODULES, parseEntries(), prettierBin(), readSource(), slug() (+3 more)

### Community 203 - "aiSdkAdapter.test.mts"
Cohesion: 0.13
Nodes (15): AiSdkAdapterConfig, createAiSdkAdapter(), IMAGE_TASKS, RFC-002, TASK_SCHEMAS, ENCOUNTER_PAYLOAD, RFC-002, promptText() (+7 more)

### Community 207 - "sceneConditionOptions.ts"
Cohesion: 0.10
Nodes (32): SceneCanvasProps, SceneGridViewProps, resolveSceneAreaEffect(), BuildCharacterCombatantResult, CharacterCombatant, BuildDaggerheartAdversaryResult, DaggerheartAdversaryCombatant, RANGE_CELLS (+24 more)

### Community 212 - "aiSdkAdapter.test.mts"
Cohesion: 0.07
Nodes (25): ANTHROPIC_REGISTRATION, BUILT_IN_PROVIDERS, DEFAULT_PROVIDER_REGISTRY, firstEnvValue(), GEMINI_REGISTRATION, MOCK_REGISTRATION, ProviderBuild, ProviderEnv (+17 more)

### Community 213 - "spikeViewport.ts"
Cohesion: 0.43
Nodes (6): rect, clampCoordinate(), invertPoint(), Rect, Viewport, zoomToCursor()

## Knowledge Gaps
- **1473 isolated node(s):** `semi`, `singleQuote`, `trailingComma`, `printWidth`, `tabWidth` (+1468 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **15 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `CharacterDocument` connect `Oracle Panel & Logic` to `Daggerheart Sheet Automation`, `Dnd5e Equipment & Features UI`, `legality/pf2e.ts`, `Dnd5e2024 Engine & Hit Dice`, `Daggerheart Engine`, `Dnd5e Background Templates`, `Tabs UI Component`, `Scene Combat Resolution`, `Dnd5e Class Templates`, `parseNum`, `System Compute Registers`, `Dnd5e Activity Definitions`, `shared/legalActions.ts`, `Dnd5e Feat Templates`, `App Shell & Layout`, `D20 Combat Controls`, `Game System Selector`, `Combat & Recap Panels`, `Scene Illustration Panel`, `Dnd35e Saves & Data Model`, `Daggerheart Data Model`, `System Registry & Renderer`, `Campaign Sync Hooks`, `Daggerheart Inventory`, `Pf2e Character Templates`, `CharacterListView.tsx`, `MAM Complication Browser`, `Encounter & Initiative Panels`, `Pf2e Sheet Tabs`, `PF2e Backgrounds Data`, `Currency & Inventory Editors`, `Sheet Header & Stat Cards`, `Condition Effects by System`, `Equipped Armor Section`, `Encounter Builder Logic`, `characterDraftFlow.test.ts`, `D20 Legacy Templates`, `Campaign Storage & Hooks`, `daggerheart/validation.ts`, `SRD Manifest Generator`, `Daggerheart Combatant Builders`, `ESLint Config`, `retryWithBackoff`, `AI Gateway Client`, `sceneTerrain.ts`, `@types/react-dom`, `Character Effects Compilation`, `System Validation Logic`, `Document Migrations & Storage`, `App Header & Auth UI`, `sceneConditionOptions.ts`, `Boundary Validation Tests`, `Equipment & Feature Browsers`, `Daggerheart Contribution Ledger`, `Dnd35e/Pf1e Derived Math`, `Mam Browser Tabs`, `Mam3e Derived Math`, `Character Card Presenter`, `5e Equipment Tab`, `Document Signature Hashing`, `Resource Pool Tracking`?**
  _High betweenness centrality (0.123) - this node is a cross-community bridge._
- **Why does `GameSystemId` connect `Game System Selector` to `Sheet Resource Loading Hooks`, `Daggerheart Sheet Automation`, `Dnd5e Equipment & Features UI`, `Dnd5e Sheets & E2E Tests`, `Dnd5e2024 Engine & Hit Dice`, `Tabs UI Component`, `Scene Combat Resolution`, `System Compute Registers`, `shared/legalActions.ts`, `Dnd5e Feat Templates`, `Daggerheart Data Model`, `Roadmap Metrics Generator`, `CharacterListView.tsx`, `Class Enhancement & Headers`, `Currency & Inventory Editors`, `Doc Drift Rules`, `Equipped Armor Section`, `Error Boundary & Auth Context`, `Encounter Builder Logic`, `characterDraftFlow.test.ts`, `D20 Legacy Templates`, `Character Combatant Builder`, `SRD Manifest Generator`, `AI Gateway Adapters`, `D20 Legacy Spell Slots`, `SRD Coverage Script`, `Browser Compat & Error Logging`, `sceneTerrain.ts`, `Spell Catalog Consistency Tests`, `Dnd5e Resource Loading Hooks`, `Equipment & Feature Browsers`, `Mam Browser Tabs`, `Oracle Panel & Logic`, `5e Equipment Tab`?**
  _High betweenness centrality (0.059) - this node is a cross-community bridge._
- **Why does `entry()` connect `daggerheart/validation.ts` to `Dnd5e Equipment & Features UI`, `Dnd5e Background Templates`, `Retry With Backoff`, `Tabs UI Component`, `Node Runtime Bootstrap`, `Dnd5e Feat Templates`, `Daggerheart Inventory`, `CharacterListView.tsx`, `AI Encounter Drafting`, `Doc Drift Rules`, `Error Boundary & Auth Context`, `D20 Legacy Templates`, `AI Gateway Contracts`, `fake-indexeddb`, `Character Effects Compilation`, `Mam Character Sheet Tabs`, `Dnd5e Feature Options`, `Equipment & Feature Browsers`, `Daggerheart Contribution Ledger`, `Dnd35e/Pf1e Derived Math`, `Pf2e Spell Data Encoder`, `5e Monster Encoder`?**
  _High betweenness centrality (0.055) - this node is a cross-community bridge._
- **What connects `semi`, `singleQuote`, `trailingComma` to the rest of the system?**
  _1473 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Sheet Resource Loading Hooks` be split into smaller, more focused modules?**
  _Cohesion score 0.1319073083778966 - nodes in this community are weakly interconnected._
- **Should `Dnd5e Equipment & Features UI` be split into smaller, more focused modules?**
  _Cohesion score 0.04376183463075952 - nodes in this community are weakly interconnected._
- **Should `Dnd5e Background Templates` be split into smaller, more focused modules?**
  _Cohesion score 0.04568868980963046 - nodes in this community are weakly interconnected._