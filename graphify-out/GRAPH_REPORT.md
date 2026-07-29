# Graph Report - windsurf-project  (2026-07-29)

## Corpus Check
- 921 files · ~768,943 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 5962 nodes · 17254 edges · 202 communities (185 shown, 17 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 168 edges (avg confidence: 0.72)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `72bb2c37`
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
- Prettier Config
- pf2eConditions.ts
- MAM Equipment Types
- Package Manifest
- Verification Baseline Script
- Scene Illustration Panel
- TS Netlify Config
- Generated Docs Check
- Playwright Browser Check
- Repo Hygiene Check
- Equipment Browser Component
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
- daggerheart/validation.ts
- syncTombstones.ts
- loadEquipmentForSystem
- MamArchetypesTab.tsx
- eslint-plugin-react
- fake-indexeddb
- MamComplicationBrowser.tsx
- index.ts
- retryWithBackoff
- @vitejs/plugin-react
- vitest
- @types/react-dom
- sceneTerrain.ts
- @vitest/coverage-v8
- participantResolution.test.ts
- phase3-workflows.spec.ts
- aiSdkAdapter.test.mts
- systemAssetPrefetch.ts
- generateUUID
- sceneConditionOptions.ts
- Pf2eHeader.test.tsx
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

## Communities (202 total, 17 thin omitted)

### Community 0 - "Sheet Resource Loading Hooks"
Cohesion: 0.05
Nodes (92): ancestryPool(), backgroundPool(), classPool(), loadCharacterDraftPools(), NamedEntity, toCandidates(), RFC-002, feat (+84 more)

### Community 1 - "Dnd5e Sheets & E2E Tests"
Cohesion: 0.11
Nodes (28): categoryIcons, GameSystemSelector(), GameSystemSelectorProps, systemAccents, supportBadgeLabels, supportBadgeStyles, buildInitialSummaryStates(), categoryDisplay (+20 more)

### Community 2 - "Dnd5e Equipment & Features UI"
Cohesion: 0.03
Nodes (111): SystemEngine, resolveD20LegacyArmorClass(), resolveCharacterEffects(), computeD20LegacyAC(), d20LegacyCheckPenalty(), applyDerivedQuantities(), ComputeLayer, DerivedDisplay (+103 more)

### Community 3 - "Dnd5e Background Templates"
Cohesion: 0.05
Nodes (81): ProficiencyListSection(), Props, ChoiceSlot, Dnd5eFeaturesTabComponent, Props, Dnd5eSelectedFeatsSection(), Props, resolveFeatSelections() (+73 more)

### Community 4 - "Dnd5e2024 Engine & Hit Dice"
Cohesion: 0.04
Nodes (59): HIT_DICE, hitDieSize(), hitDieString(), collectDnd5eConditionEffects(), conditionImposesDisadvantage(), DND5E_CONDITION_EFFECTS, Dnd5e2024Engine, hasAlertFeat() (+51 more)

### Community 5 - "Daggerheart Engine"
Cohesion: 0.09
Nodes (42): applyDnd5eSubclassTemplate(), assertMulticlassRequirements(), ATTRIBUTE_NAME_TO_ID, buildChoiceSlots(), buildDerivedProficiencies(), buildSpellcastingState(), canSelectSubclass(), classFeaturesAtLevel() (+34 more)

### Community 6 - "3.5e Monster Data Encoder"
Cohesion: 0.21
Nodes (22): bucketOf(), dashNorm(), decodeEntities(), ENTITIES, HEADER(), itemDir, main(), NON_VALUE (+14 more)

### Community 7 - "Tabs UI Component"
Cohesion: 0.08
Nodes (44): Badge(), BadgeProps, badgeVariants, DaggerheartCharacterBasicsSection(), Props, DaggerheartDomainCardsSection(), Props, DaggerheartDowntimeControls() (+36 more)

### Community 8 - "Node Runtime Bootstrap"
Cohesion: 0.09
Nodes (49): main(), runBootstrapNodeInstall(), getPinnedCommandArgs(), main(), runPinnedNpmCommand(), formatRuntimeDoctorReport(), main(), readWorkflowPinSource() (+41 more)

### Community 9 - "Scene Combat Resolution"
Cohesion: 0.05
Nodes (57): buildScene(), ResolveCombatStats, appendSceneEvent(), applySceneIntents(), compareSceneEvents(), createdAtOrZero(), createSceneDocument(), eventIdOrEmpty() (+49 more)

### Community 10 - "Dnd5e Class Templates"
Cohesion: 0.18
Nodes (15): Pf2eProficiencyTier, getPf2eSheetChoiceState(), countTrainedPf2eSkills(), longRestPf2eSpellcasting(), nextPf2eTier(), PF2E_TIER_ORDER, Pf2eBulkState, shortRestPf2eSpellcasting() (+7 more)

### Community 11 - "System Compute Registers"
Cohesion: 0.13
Nodes (17): clearLocalDataForAccountChange(), getLastSyncedUserId(), setLastSyncedUserId(), AuthProvider(), AuthCallback, mockedGetSupabaseClient, mockedIsSupabaseConfigured, Probe() (+9 more)

### Community 12 - "Scene Check Panel"
Cohesion: 0.19
Nodes (12): BrowserCapabilities, checkBrowserCapabilities(), initBrowserCompat(), isBrowserSupported(), showCompatibilityWarning(), ErrorCategory, ErrorLog, ErrorLogger (+4 more)

### Community 13 - "Dnd5e Activity Definitions"
Cohesion: 0.11
Nodes (26): buildDefenseStyleActivity(), buildDivineSmiteActivities(), buildDivineSmiteActivity(), buildDnd5eActivityDefinitions(), buildUnsupportedDivineSmiteActivity(), divineSmiteSlotLevel(), Dnd5eActivityCost, Dnd5eActivityCostKind (+18 more)

### Community 14 - "Monster & NPC Generator"
Cohesion: 0.06
Nodes (46): DragProvider, DragRoot(), isSceneDragEnabled(), FEATURE_FLAGS, FeatureFlag, FeatureFlagDefinition, isFeatureEnabled(), RingBuffer (+38 more)

### Community 15 - "Dnd5e Feat Templates"
Cohesion: 0.07
Nodes (41): BreakdownRow, buildRows(), ContributionBreakdown(), formulaOf(), Props, toRow(), RFC-003, effectToLedgerEntry() (+33 more)

### Community 16 - "App Shell & Layout"
Cohesion: 0.11
Nodes (33): validateDnd35eBuild(), Dnd35eFeat, addIssue(), appendBuildLegalityIssues(), createDnd35eValidator(), Dnd35eValidationData, isIntegerInRange(), loadValidationData() (+25 more)

### Community 17 - "D20 Combat Controls"
Cohesion: 0.11
Nodes (19): ArmorProficiency, ArmorProficiencyType, ArtisanToolProficiency, GamingSetProficiency, MartialWeaponProficiency, MusicalInstrumentProficiency, OtherToolProficiency, SimpleWeaponProficiency (+11 more)

### Community 18 - "Game System Selector"
Cohesion: 0.07
Nodes (56): EquippedItemsSection(), Props, SLOT_LABELS, SLOT_ORDER, Dnd5e2024DataModel, Dnd5e2024TemplateState, Dnd5eCondition, Dnd5eActivityStateDataModel (+48 more)

### Community 19 - "Combat & Recap Panels"
Cohesion: 0.16
Nodes (18): ALIGNMENTS, DICE_PROGRESSIONS, main(), mapAlignment(), mod(), MONSTER_SIZE, normalizeName(), OLIMOT_FILES (+10 more)

### Community 20 - "D20 Legacy System Engines"
Cohesion: 0.12
Nodes (35): resolveCheck(), isOracleOdds(), resolveOracle(), applyHitPointDelta(), applySceneEvent(), ApplySceneIntentsResult, assertNever(), buildEventFromIntent() (+27 more)

### Community 21 - "Dnd35e Saves & Data Model"
Cohesion: 0.18
Nodes (17): ability(), ALIGNMENT_ABBREV, bucketFor(), CR_FRACTIONS, CREATURE_TYPES, creatureDir, DAMAGE_TYPES, main() (+9 more)

### Community 22 - "Daggerheart Data Model"
Cohesion: 0.10
Nodes (23): Condition, ConditionPicker(), Props, D20_LEGACY_CONDITION_NAMES, D20_LEGACY_TOGGLE_LABELS, D20FeatsTab(), FeatEntry, Props (+15 more)

### Community 23 - "System Registry & Renderer"
Cohesion: 0.18
Nodes (11): GeneratedImageData, IllustrateGatewayCall, IllustrateSceneParams, IllustrateSceneResult, illustrateSceneWithAi(), RFC-002, ILLUSTRATION_STYLES, IllustrationPanel() (+3 more)

### Community 24 - "Game Rules & Proficiencies"
Cohesion: 0.14
Nodes (15): GAME_RULES, isValidArmorProficiency(), isValidSkillProficiency(), isValidToolProficiency(), isValidWeaponProficiency(), hasErrors, results, hasProgressionDeltaAtLevel() (+7 more)

### Community 25 - "Campaign Sync Hooks"
Cohesion: 0.21
Nodes (10): Pf2eProficiencyBadge(), Props, TIER_COLORS, TIER_LABELS, Pf2eSavesTab(), Props, formatPf2eOptionLabel(), Pf2eSkillsTab() (+2 more)

### Community 26 - "Daggerheart Inventory"
Cohesion: 0.09
Nodes (35): clampDaggerheartInventoryQuantity(), daggerheartInventoryDefinitions, findDaggerheartInventoryDefinitionByName(), getDaggerheartInventoryDefinition(), inventoryDefinitionById, inventoryDefinitionByName, isDaggerheartConsumableDefinition(), normalizeDaggerheartCurrency() (+27 more)

### Community 27 - "Pf2e Character Templates"
Cohesion: 0.11
Nodes (43): createPf2eCreationPlan(), abilityBoostValue(), ancestryFeatures(), applyAbilityAdjustments(), applyPf2eAncestryTemplate(), applyPf2eArchetypeTemplate(), applyPf2eBackgroundTemplate(), applyPf2eClassTemplate() (+35 more)

### Community 28 - "Roadmap Metrics Generator"
Cohesion: 0.09
Nodes (40): applyRepoResidentOverrides(), buildComputeCompletion(), buildContentCoverage(), buildMarkdownReport(), ComputeCompletionRow, computeMetrics(), ContentCoverageRow, createEmptyCategoryCounts() (+32 more)

### Community 29 - "Dnd5e Feature List Sections"
Cohesion: 0.07
Nodes (38): DamageHealControl(), DamageHealControlProps, clampTrack(), DeathSaves, DeathSavesTracker(), Props, HitDiceTracker(), Props (+30 more)

### Community 30 - "Encounter & Initiative Panels"
Cohesion: 0.10
Nodes (28): resolvePf2eArmorClass(), computePf2eAC(), collectPf2eCheckConditionEffects(), ConditionScope, getPf2eConditionStatusPenalty(), highestValue(), magnitude(), PF2E_STATUS_CONDITIONS (+20 more)

### Community 31 - "Class Enhancement & Headers"
Cohesion: 0.12
Nodes (25): buildSystem(), CATEGORY_LOADERS, CategoryLoader, escape(), isRecord(), Loaded, main(), SystemConfig (+17 more)

### Community 32 - "Pf2e Sheet Tabs"
Cohesion: 0.06
Nodes (57): buildCharacterCombatant(), CharacterCombatant, normalizeSheet(), readArmorClass(), toMagicBonusItems(), toModifierSources(), AttackEconomy, bestAttackAbility() (+49 more)

### Community 33 - "AI Encounter Drafting"
Cohesion: 0.07
Nodes (39): DEFAULT_QUICK_ROLLS, DicePanel(), DicePanelProps, formatBreakdown(), QUICK_ROLLS_BY_SYSTEM, DISPOSITION_BADGE, DISPOSITION_LABEL, ReactionHistoryEntry (+31 more)

### Community 34 - "Quest & Session Log UI"
Cohesion: 0.12
Nodes (31): Props, QuestList(), STATUS_BADGE, STATUS_OPTIONS, DATE_FORMAT, Props, SessionLog(), UseCampaignSyncOptions (+23 more)

### Community 35 - "Currency & Inventory Editors"
Cohesion: 0.05
Nodes (56): ACTION_LIMIT_BOUNDARY, collectMam3eConditionEffects(), MAM3E_STATE_NOTES, mam3eToughnessPenalty(), ABILITIES, DEFENSES, MamAbilitiesTab(), Props (+48 more)

### Community 36 - "Document Sync Engine"
Cohesion: 0.06
Nodes (74): critModelForScene(), degreeModelForScene(), resolveSceneAreaEffect(), resolveSceneAttack(), SceneAreaEffectOutcome, SceneAttackOutcome, SceneRoundOutcome, RFC-003 (+66 more)

### Community 37 - "Sheet Header & Stat Cards"
Cohesion: 0.27
Nodes (8): ToastContext, ToastContextValue, ToastItem, ToastProvider(), VARIANT_ICONS, VARIANT_STYLES, registerToastHandler(), ToastVariant

### Community 38 - "Check & Oracle Resolution"
Cohesion: 0.13
Nodes (13): createDefaultDnd5e2024Data(), Dnd5e2024SystemDef, Dnd5eSystemDef, Dnd5eLike, EDITIONS, LONGSWORD, SHORTSWORD_MAIN, SHORTSWORD_OFF (+5 more)

### Community 39 - "Mam3e Data Model & Engine"
Cohesion: 0.13
Nodes (26): appendInventoryFromBackground(), applyDnd5eBackgroundTemplate(), BackgroundChoiceSlot, BackgroundChoiceValue, backgroundDerivedState(), COMMON_LANGUAGE_OPTIONS, Dnd5eBackgroundTemplateSelections, Dnd5eLikeDataModel (+18 more)

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
Nodes (27): EquipArmorInput, EquipEntry, EquippedArmorSection(), EquipShieldInput, Props, Dock(), fullPlate, leather (+19 more)

### Community 44 - "Spell Browser UI"
Cohesion: 0.05
Nodes (68): DEFAULT_LABELS, SpellBrowser(), SpellBrowserLabels, SpellBrowserProps, SpellBrowserSpell, BrowserFeat, DockPanel(), DockPanelProps (+60 more)

### Community 45 - "Scene Combat Area Effects"
Cohesion: 0.17
Nodes (15): buildNotice(), FetchTarget, fetchValidated(), HTML_ENTITIES, looksLikeHtml(), main(), normalize(), noticePath (+7 more)

### Community 46 - "Error Boundary & Auth Context"
Cohesion: 0.10
Nodes (30): clampExhaustion(), Props, RestControls(), availableD20LegacyToggles(), D20ClassesSection(), D20LegacyClassLevel, Props, renderClassOptions() (+22 more)

### Community 47 - "Encounter Builder Logic"
Cohesion: 0.12
Nodes (35): createD20LegacyCreationPlan(), D20LegacyData, applyAbilityAdjustments(), applyD20LegacyClassTemplate(), applyD20LegacyRaceTemplate(), buildClassSkills(), classFeaturesUpToLevel(), classSkillOptions() (+27 more)

### Community 48 - "Scene Management Hooks"
Cohesion: 0.05
Nodes (85): LibraryScenesView(), Props, UseSceneEncounterParams, Props, useToast(), useCampaigns(), DebouncedPersistence, IMPORTANT: a begun generation must end in either `persist` or (+77 more)

### Community 49 - "Monster Combatant Builder"
Cohesion: 0.06
Nodes (44): NarrateSceneResult, CheckPanel(), CheckPanelProps, DEFAULT_SUGGESTIONS, DND5E_SKILLS, OUTCOME_BADGE, OUTCOME_LABEL, SKILL_SUGGESTIONS_BY_SYSTEM (+36 more)

### Community 50 - "D20 Legacy Templates"
Cohesion: 0.21
Nodes (26): getDaggerheartShortRestRecovery(), createDaggerheartInventoryEntry(), clearAllStress(), clearStress(), prepareGainHope(), repairAllArmor(), repairArmor(), tendToAllWounds() (+18 more)

### Community 51 - "Campaign Storage & Hooks"
Cohesion: 0.27
Nodes (9): makeScene(), campaignSignatureFor(), sameCampaignSignatures(), sameDocumentSignatures(), sameSceneSignatures(), sameSignatureMultisets(), sceneSignatureFor(), signatureFor() (+1 more)

### Community 52 - "Spell Preparation Logic"
Cohesion: 0.27
Nodes (8): EffectOperation, collectTerrainEffectsAt(), isTerrainOperation(), markerCoversCell(), markerToEffects(), normalizeStackPolicy(), TERRAIN_OPERATIONS, RFC-003

### Community 53 - "Dev Dependencies"
Cohesion: 0.04
Nodes (47): autoprefixer, @axe-core/playwright, eslint, eslint-config-prettier, @eslint/js, eslint-plugin-react, eslint-plugin-react-hooks, happy-dom (+39 more)

### Community 54 - "Character Combatant Builder"
Cohesion: 0.10
Nodes (22): AI_TASK_UNIT_COST, TaskGatewayCall, AnyTaskGatewayCall, createFlowBudget(), DEFAULT_MAKE_GAME_FLOW_BUDGET, FlowBudget, FlowBudgetLimits, FlowBudgetReport (+14 more)

### Community 55 - "D20 Class Spellcasting"
Cohesion: 0.12
Nodes (24): RoundCombatant, runCombatRound(), RunRoundInput, toActor(), toTarget(), RFC-003, executeTacticalTurn(), TacticalTurnInput (+16 more)

### Community 56 - "SRD Manifest Generator"
Cohesion: 0.13
Nodes (31): getBackgroundFixedToolProficiencies(), getBackgroundLanguageOptions(), getBackgroundToolChoiceSlots(), getDnd5eTemplateChoiceState(), applyDnd5eSpeciesTemplate(), buildAbilityChoiceSlots(), buildSpeciesFeatures(), choiceAbilityBonuses() (+23 more)

### Community 57 - "Daggerheart Combatant Builders"
Cohesion: 0.08
Nodes (34): applyDamageMitigation(), DamageMitigation, DamageProfile, mitigateDamage(), resolveDamageMitigation(), snapshotDamageProfile(), RFC-006, BuildEncounterEventsResult (+26 more)

### Community 58 - "AI Gateway Adapters"
Cohesion: 0.07
Nodes (44): AI_GATEWAY_SCHEMA_VERSION, aiFailure, AiFailureCode, AiResponse, AiTask, AiTaskClass, GatewayContext, GatewayTimeoutError (+36 more)

### Community 59 - "AI Gateway Contracts"
Cohesion: 0.12
Nodes (33): AI_TASK_CLASS, AiParse, AiSuccess, AiUsage, CharacterDraftRequest, EncounterDraftRequest, IdentifyCreatureRequest, IllustrateSceneRequest (+25 more)

### Community 60 - "System Definitions & Types"
Cohesion: 0.09
Nodes (33): DND5E_SCENE_CONDITIONS, SCENE_CONDITIONS_BY_SYSTEM, actionReachCells(), ATTACK_COUNT_WORDS, averageDie(), buildMonsterCombatant(), dieFaces(), isMinusSign() (+25 more)

### Community 61 - "D20 Legacy Spell Slots"
Cohesion: 0.11
Nodes (26): ABILITIES, DEFENSES, Mam3eCreator(), Mam3eCreatorProps, SKILLS, buildMam3eCreatorData(), createDefaultMam3eDefenseRanks(), DERIVATION_EPOCH (+18 more)

### Community 62 - "SRD Coverage Script"
Cohesion: 0.06
Nodes (56): buildManifest(), CLASSES, CLASSIFICATION_PATH, HERE, LICENSING_CLASSES, loadShipped(), MANIFEST_PATH, run() (+48 more)

### Community 63 - "ESLint Config"
Cohesion: 0.33
Nodes (7): applyDnd5eClassTemplate(), createClassLevel(), createDnd5eCreationPlan(), Dnd5eLikeDataModel, averageHitDieRoll(), hitDieFaces(), seedHitDieRolls()

### Community 64 - "Spells Tab Components"
Cohesion: 0.25
Nodes (7): ArmorItem, DnD35eArmor, DnD35eShield, DnD35eGear, GearItem, DnD35eWeapon, WeaponItem

### Community 65 - "Browser Compat & Error Logging"
Cohesion: 0.13
Nodes (21): Props, State, LegalNotices(), LegalNoticesProps, licenseTexts, LibraryBestiaryView(), LoadState, MonsterBrowser (+13 more)

### Community 66 - "AI Gateway Client"
Cohesion: 0.18
Nodes (15): CharacterCard(), CharacterListView(), CharacterSortOption, aria, borin, now, asNumber(), asRecord() (+7 more)

### Community 67 - "2024 Monster Data Encoder"
Cohesion: 0.16
Nodes (23): ABILITIES, ALIGNMENTS, bucketFor(), classifyImmunityList(), cleanProse(), CR_FRACTIONS, CREATURE_TYPES, DAMAGE_TYPES (+15 more)

### Community 68 - "Character Effects Compilation"
Cohesion: 0.07
Nodes (33): getDaggerheartAncestryAdjustments(), applyDaggerheartAncestryTemplate(), applyDaggerheartClassTemplate(), applyDaggerheartCommunityTemplate(), classTemplateItems(), communityTemplateItems(), DaggerheartInventoryEntry, DEFAULTS (+25 more)

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
Cohesion: 0.11
Nodes (36): ABILITY_KEYS, DND5E_ASI_LEVELS_BY_CLASS, DND5E_BASE_ASI_LEVELS, DND5E_MULTICLASS_PREREQ, dnd5eAsiSlotsGranted(), validateDnd5eBuild(), dnd5eKnownSpellLimit(), dnd5eKnownSpellOverage() (+28 more)

### Community 74 - "Spell Catalog Consistency Tests"
Cohesion: 0.08
Nodes (43): ALL_SYSTEMS, ALLOWED_BY_ID, ALLOWLIST, allowlistHits, auditCitation(), auditRulesLayerLiterals(), CATEGORY_LOADERS, cleared (+35 more)

### Community 75 - "Dnd5e Resource Loading Hooks"
Cohesion: 0.21
Nodes (20): GetDaggerheartSheetStateProps, UseDaggerheartSheetResourcesProps, UseDaggerheartTemplateHandlersProps, DaggerheartAdversaryRole, DaggerheartAncestry, DaggerheartArmor, DaggerheartClass, DaggerheartCommunity (+12 more)

### Community 76 - "Mam Powers & Cost Ledger"
Cohesion: 0.07
Nodes (35): PendingMonster, InitiativeTracker(), InitiativeTrackerProps, mapImageLayerStyle(), ALLEGIANCE_COLORS, drawScene(), drawTokenChip(), MARKER_FILL (+27 more)

### Community 78 - "Dnd5e Feature Options"
Cohesion: 0.12
Nodes (23): appendBulletList(), applyDnd5eFeatureOptionSelection(), ClassLevelLike, DND5E_FEATURE_OPTION_GROUP_LABELS, DND5E_FEATURE_OPTION_SOURCE_LABELS, DOMAIN_SUBCLASS_IDS, featureIdForOption(), FeatureOptionState (+15 more)

### Community 79 - "Document Migrations & Storage"
Cohesion: 0.12
Nodes (10): CREATED_AT, roundTrip(), UPDATED_AT, makeStoredDocument(), setStoredDocuments(), DaggerheartDomainCardEntry, daggerheartPassiveAuditAttributes, makeDomainCardEntry() (+2 more)

### Community 80 - "App Header & Auth UI"
Cohesion: 0.36
Nodes (7): ThemeToggle(), applyTheme(), getSystemTheme(), isTheme(), Theme, useTheme(), VALID_THEMES

### Community 82 - "HP & Spell Slot Trackers"
Cohesion: 0.09
Nodes (24): CharacterDraftChoice, CharacterDraftOutcome, AI_GATEWAY_ENDPOINT, AiRequest, SceneNarrationData, BY_DESIGN_FAILURE_CODES, callAiGateway(), isAiEnabled() (+16 more)

### Community 84 - "Boundary Validation Tests"
Cohesion: 0.21
Nodes (21): NOW, parseImg(), validDocInput(), coerceDate(), coerceObjectives(), coerceQuests(), coerceSceneMapReference(), coerceSessionLog() (+13 more)

### Community 85 - "capabilityScenarios.test.tsx"
Cohesion: 0.60
Nodes (3): formatModifierCost(), MamPowerModifierBrowser(), MamPowerModifierBrowserProps

### Community 86 - "Equipment & Feature Browsers"
Cohesion: 0.05
Nodes (59): FeaturesSection(), Props, NormalizedSheet, ArmorClassCharacter, casterTypes, classResourcesNeeded, classTags, removeDnd5eClassTemplate() (+51 more)

### Community 87 - "Pf2e Engine & Constants"
Cohesion: 0.09
Nodes (20): GapLedgerItem, LedgerPhase, LedgerStatus, LedgerTag, LedgerTrack, MASTER_GAP_LEDGER, RFC-003, byPhase (+12 more)

### Community 88 - "Documents Hook & Persistence"
Cohesion: 0.12
Nodes (33): toContributionLedger(), MamPowersTab(), ModifierColumn(), ModifierColumnProps, Props, buildMam3eContributionLedger(), buildMam3ePowerCostEffects(), buildMam3ePowerCostLedgerEntries() (+25 more)

### Community 89 - "Daggerheart Contribution Ledger"
Cohesion: 0.06
Nodes (60): BuildDaggerheartCombatantResult, DaggerheartCombatant, RANGE_CELLS, ANCESTRY_ADJUSTMENTS_BY_ID, ancestryByName, classByName, DAGGERHEART_TIER_BREAKPOINTS, DAGGERHEART_TRAITS (+52 more)

### Community 90 - "Dnd35e/Pf1e Derived Math"
Cohesion: 0.13
Nodes (24): LegalActionCost, addDomainCardActions(), addHopeFeature(), addUniversalMoves(), addWeaponStrikes(), buildLookup(), createDaggerheartLegalActions(), enumerateDaggerheartActions() (+16 more)

### Community 91 - "Mam Browser Tabs"
Cohesion: 0.05
Nodes (75): EncounterDraftSelection, draftEncounterWithAi(), identifyCreatureWithAi(), fileToAiImageInput(), readAsDataUrl(), draftEncounter(), MakeGameEncounter, MakeGameParams (+67 more)

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
Cohesion: 0.27
Nodes (12): D20LegacySpellSlots, recoverD20LegacySpellSlot(), resetD20LegacySpellSlots(), setD20LegacyPreparedSpell(), setD20LegacySpellSlotTotal(), slotPool(), spendD20LegacySpellSlot(), toEquippedD20LegacyWeapon() (+4 more)

### Community 97 - "Mam3e Derived Math"
Cohesion: 0.40
Nodes (9): CreationDraftState, clearDraft(), draftKey(), emptyDraft(), isEmptyDraft(), readDraft(), useCreationDraft(), UseCreationDraftResult (+1 more)

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
Cohesion: 0.13
Nodes (16): CombatTogglesSection(), Props, availablePf2eToggles(), collectPf2eRiderEffects(), PF2E_SNEAK_ATTACK_BREAKPOINTS, PF2E_TOGGLE_IDS, PF2E_TOGGLE_LABELS, Pf2eRiderInputs (+8 more)

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
Cohesion: 0.49
Nodes (8): applyDnd5eLongRest(), applyDnd5eShortRest(), recoverAllSpellSlots(), recoverFeatures(), recoverLongRestHitDice(), recoverPactMagicSlots(), slotPool(), reset()

### Community 106 - "Character Card Presenter"
Cohesion: 0.06
Nodes (35): DragContext, NO_HANDLERS, useDragContext(), useDragSource(), DragLayer, DragLayerProps, DragProvider(), toSample() (+27 more)

### Community 107 - "Oracle Panel & Logic"
Cohesion: 0.04
Nodes (57): CharacterDraftProposal, MakeGameCharacter, CampaignManager(), Props, CharacterCardProps, CharacterListViewProps, AllegianceChip(), AllegianceChipProps (+49 more)

### Community 108 - "5e Equipment Tab"
Cohesion: 0.28
Nodes (6): resolveCharacterLedger(), collectPf2eConditionEffects(), Pf2eConditionLike, buildPf2eContributionLedger(), RFC-003, RFC-003

### Community 109 - "Scene Reaction Panel"
Cohesion: 0.21
Nodes (15): compareSpells(), D20SpellsTab(), formatSpellLevel(), Props, titleCase(), D20_ARCANE_SCHOOLS, buildSpellPreparationConcepts(), compareSpellEntries() (+7 more)

### Community 110 - "Document Signature Hashing"
Cohesion: 0.10
Nodes (25): availableDnd5eToggles(), collectDnd5eRiderEffects(), DND5E_TOGGLE_IDS, Dnd5eRiderInputs, Dnd5eSystemId, hasFlatFivePenaltyTenDamageFeats(), RAGE_DAMAGE_BREAKPOINTS, rageDamageBonus() (+17 more)

### Community 111 - "Resource Pool Tracking"
Cohesion: 0.13
Nodes (21): profTotal(), tierBonus(), CREATURE_XP_BY_LEVEL_DIFF, pf2eAttackModifier(), pf2eCreatureXP(), Pf2eDegree, pf2eDyingAfterRecovery(), pf2eEncounterBudget() (+13 more)

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
Cohesion: 0.06
Nodes (39): CurrencyEditor, CurrencyEditorProps, Dnd5eEquipmentTab, Dnd5eEquipmentTabComponent, EquipmentBrowser, EquipmentBrowserItem, EquipmentBrowserProps, EquippedItemsSection (+31 more)

### Community 117 - "check-mam-equipment-provenance.mjs"
Cohesion: 0.09
Nodes (42): computeDnd5eBaseArmorClass(), foldArmorClass(), resolveDnd5eArmorClass(), ArmorEquipItem, compute5eAC(), D20_SIZE_MOD, dnd5eArmorDexContribution(), D20SkillsTab() (+34 more)

### Community 118 - "dnd5eToolChoices.ts"
Cohesion: 0.07
Nodes (54): cloneDocumentsSnapshot(), documentsChanged(), engineLoadErrorMessage(), prepareDocumentsWithEngines(), prepareDocumentWithEngine(), unresolvedEngineSystemIds(), useDocuments(), withPreparedDocuments() (+46 more)

### Community 119 - "MAM Archetype Browser"
Cohesion: 0.27
Nodes (11): CLASS_TOKENS, d20srdUrl(), FILES, main(), mapCastingTime(), mapDuration(), mapRange(), normalizeName() (+3 more)

### Community 120 - "PF1e Spell Encoder"
Cohesion: 0.27
Nodes (11): CLASS_COLUMNS, main(), mapCastingTime(), mapDuration(), mapRange(), RFC-4180, normalizeName(), parseCsv() (+3 more)

### Community 123 - "3.5e Gear & Weapons"
Cohesion: 0.50
Nodes (4): ABILITY_NAMES, formatPf2eOptionLabel(), Pf2eAbilitiesTab(), Props

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
Cohesion: 0.07
Nodes (43): MARKER_EFFECT_OPTIONS, markerEffectHelp(), MarkerEffectOption, MarkerEffectPreset, MarkerPanel(), MarkerPanelProps, terrainBadgeIcon(), acceptGridGeometryProposal() (+35 more)

### Community 129 - "Daggerheart Sheet Automation"
Cohesion: 0.05
Nodes (41): @testing-library/jest-dom, CreationWizard(), CreationWizardProps, framedSteps(), severityWeight(), ValidationSummary(), CreationWizardHostProps, buildDocumentFromPlanIds() (+33 more)

### Community 130 - "legality/pf2e.ts"
Cohesion: 0.09
Nodes (24): Pf2eNotesTab(), Props, createDefaultPf2eData(), PF2E_ARCHETYPE_DEDICATION_GRANTS, Pf2eClassLevel, Pf2eDataModel, Pf2eDedicationProficiencyCategory, Pf2eDedicationProficiencyGrant (+16 more)

### Community 131 - "Retry With Backoff"
Cohesion: 0.04
Nodes (98): useCampaignSync(), Doc, useSync(), UseSyncOptions, baseAuthValue, mockedClearQueuedCampaignsSnapshot, mockedClearQueuedDeletedCampaignIds, mockedDeleteRemoteCampaign (+90 more)

### Community 132 - "2024 Spell Encoder"
Cohesion: 0.39
Nodes (8): main(), mapCastingTime(), mapDuration(), mapRange(), normalizeName(), SCHOOLS, slug(), ts()

### Community 133 - "MAM Power Browser"
Cohesion: 0.06
Nodes (40): DiceRollButton(), DiceRollButtonProps, TABLIST_NAV_KEYS, Tabs, TabsContent, TabsContentProps, TabsContext, TabsContextValue (+32 more)

### Community 134 - "Spell Validation Checks"
Cohesion: 0.28
Nodes (7): collectRawSpells(), getRawSpellById(), getVariantFingerprint(), SpellModule, spellModules, stableFingerprintValue(), VALID_SCHOOLS

### Community 136 - "TS Node Config"
Cohesion: 0.20
Nodes (9): compilerOptions, allowSyntheticDefaultImports, composite, forceConsistentCasingInFileNames, module, moduleResolution, skipLibCheck, include (+1 more)

### Community 137 - "TS Test Config"
Cohesion: 0.10
Nodes (20): e2e/**/*, ES2022, playwright.config.ts, vite/client, vitest.config.ts, vitest/globals, compilerOptions, lib (+12 more)

### Community 139 - "Prettier Config"
Cohesion: 0.22
Nodes (8): arrowParens, endOfLine, overrides, printWidth, semi, singleQuote, tabWidth, trailingComma

### Community 140 - "pf2eConditions.ts"
Cohesion: 0.33
Nodes (6): Pf2eArchetypesTab(), Props, GetPf2eSheetChoiceStateProps, Pf2eChoiceSlot, Archetype, ArchetypeFeature

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
Nodes (39): LegalActionDescriptor, LegalActionList, LegalActionsContext, SystemLegalActionsProvider, addAttackOfOpportunity(), addAttacks(), addCombatActions(), addFullAttack() (+31 more)

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
Cohesion: 0.27
Nodes (10): createSupabaseJwtVerifier(), decodeBase64Url(), decodeJsonSegment(), fail(), resolveGatewayAuth(), SupabaseJwtVerifier, b64url(), mintToken() (+2 more)

### Community 155 - "5e Movement Rules"
Cohesion: 0.07
Nodes (31): Mode, SignIn(), SignInProps, Button, UserMenu(), UserMenuProps, AuthContext, AuthContextValue (+23 more)

### Community 156 - "CharacterListView.tsx"
Cohesion: 0.07
Nodes (32): AppContent(), buildNewCharacterDocument(), cloneSystemData(), CreationWizardHost, LegalNotices, SceneManager, STORAGE_WARNING_THRESHOLD, GuidedCreatorDialog() (+24 more)

### Community 158 - "MAM Complication Browser"
Cohesion: 0.14
Nodes (27): validatePf1eBuild(), ABILITY_KEYS, TIER_BONUS, BuildLegalityResult, BuildViolation, ABILITY_SCORE_IDS, addIssue(), addNonOpenSourceIssue() (+19 more)

### Community 161 - "PF2e Backgrounds Data"
Cohesion: 0.17
Nodes (26): validatePf2eBuild(), addIssue(), CLASS_PROGRESSION_RANKS, createPf2eValidator(), isIntegerInRange(), PF2E_ABILITY_IDS, Pf2eValidationData, validateAncestryBoosts() (+18 more)

### Community 177 - "characterDraftFlow.test.ts"
Cohesion: 0.08
Nodes (33): CharacterDraftApplier, collectUnknownIdIssues(), DocumentValidator, DraftCharacterParams, DraftCharacterResult, draftCharacterWithAi(), GatewayCall, POOL_LIST_FIELDS (+25 more)

### Community 180 - "daggerheart/validation.ts"
Cohesion: 0.25
Nodes (20): addIssue(), buildLookup(), createDaggerheartValidator(), CUSTOM_INVENTORY_PREFIXES, DaggerheartValidationData, isIntegerInRange(), NamedEntry, normalizeLookupKey() (+12 more)

### Community 182 - "syncTombstones.ts"
Cohesion: 0.12
Nodes (15): AiImageInput, EncounterDraftCandidate, EncounterDraftData, IdentifyCreatureData, DraftEncounterParams, DraftEncounterResult, GatewayCall, SelectionValidator (+7 more)

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

### Community 190 - "index.ts"
Cohesion: 0.10
Nodes (23): SheetAddHandlers, SheetDispatch, SheetDispatchRegistry, SheetDispatchRegistryContext, SheetDispatchState, SheetDispatchStateContext, useSheetDispatch(), useSheetDispatchRegister() (+15 more)

### Community 191 - "retryWithBackoff"
Cohesion: 0.29
Nodes (16): addIssue(), createMam3eValidator(), engine, Mam3eValidationData, SPENT_BUCKETS, validateAdvantages(), validateArchetypePins(), validateComplications() (+8 more)

### Community 194 - "@types/react-dom"
Cohesion: 0.04
Nodes (39): LegalActionEligibility, LegalActionTarget, SheetProps, SystemCreatorComponent, SystemCreatorProps, SystemDefinition, SystemSheetComponent, RFC-003 (+31 more)

### Community 195 - "sceneTerrain.ts"
Cohesion: 0.09
Nodes (21): MapPanel(), MapPanelProps, RFC-006, SceneCreateForm(), SceneCreateFormProps, SceneMapImage, TokenHpBar(), ButtonProps (+13 more)

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
Cohesion: 0.27
Nodes (8): SYSTEM_IDS, getSystemAssetPrefetchStateForTests(), prefetchedSystemAssets, prefetchedSystemRuntimeData, prefetchedSystemSheets, prefetchSystemAssetsForIds(), resetSystemAssetPrefetchStateForTests(), systemAssetPrefetchers

### Community 205 - "generateUUID"
Cohesion: 0.09
Nodes (23): react, react, CurrencyEditor(), CurrencyEntry, DND_CURRENCIES, Props, InventoryItem, InventoryManager() (+15 more)

### Community 207 - "sceneConditionOptions.ts"
Cohesion: 0.11
Nodes (26): narrateSceneWithAi(), SceneDropController(), terrainEffectsForPreset(), isSceneCanvasEnabled(), sceneConditionOptions(), measureImageSize(), PlacementMode, SceneManager() (+18 more)

### Community 210 - "Pf2eHeader.test.tsx"
Cohesion: 0.67
Nodes (3): Pf2eHeader(), makeDocument(), renderHeader()

### Community 212 - "aiSdkAdapter.test.mts"
Cohesion: 0.06
Nodes (32): AiSdkAdapterConfig, createAiSdkAdapter(), IMAGE_TASKS, RFC-002, TASK_SCHEMAS, createAnthropicAdapter(), createGeminiAdapter(), ANTHROPIC_REGISTRATION (+24 more)

### Community 213 - "spikeViewport.ts"
Cohesion: 0.43
Nodes (6): rect, clampCoordinate(), invertPoint(), Rect, Viewport, zoomToCursor()

## Knowledge Gaps
- **1474 isolated node(s):** `semi`, `singleQuote`, `trailingComma`, `printWidth`, `tabWidth` (+1469 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **17 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `CharacterDocument` connect `Oracle Panel & Logic` to `Daggerheart Sheet Automation`, `Dnd5e Equipment & Features UI`, `Retry With Backoff`, `Dnd5e2024 Engine & Hit Dice`, `Daggerheart Engine`, `MAM Power Browser`, `Tabs UI Component`, `Dnd5e Background Templates`, `legality/pf2e.ts`, `Dnd5e Class Templates`, `Scene Combat Resolution`, `Dnd5e Activity Definitions`, `Dnd5e Feat Templates`, `App Shell & Layout`, `Scene Illustration Panel`, `Game System Selector`, `Daggerheart Data Model`, `Campaign Sync Hooks`, `Daggerheart Inventory`, `Pf2e Character Templates`, `CharacterListView.tsx`, `Dnd5e Feature List Sections`, `MAM Complication Browser`, `Encounter & Initiative Panels`, `Pf2e Sheet Tabs`, `PF2e Backgrounds Data`, `Currency & Inventory Editors`, `Document Sync Engine`, `Check & Oracle Resolution`, `Mam3e Data Model & Engine`, `Equipped Armor Section`, `Spell Browser UI`, `Error Boundary & Auth Context`, `Encounter Builder Logic`, `Scene Management Hooks`, `characterDraftFlow.test.ts`, `Campaign Storage & Hooks`, `daggerheart/validation.ts`, `MamArchetypesTab.tsx`, `Daggerheart Combatant Builders`, `SRD Manifest Generator`, `D20 Legacy Spell Slots`, `index.ts`, `ESLint Config`, `retryWithBackoff`, `AI Gateway Client`, `@types/react-dom`, `Character Effects Compilation`, `System Validation Logic`, `Dnd5e Resource Loading Hooks`, `generateUUID`, `Dnd5e Feature Options`, `sceneConditionOptions.ts`, `Document Migrations & Storage`, `HP & Spell Slot Trackers`, `Pf2eHeader.test.tsx`, `Boundary Validation Tests`, `Equipment & Feature Browsers`, `Documents Hook & Persistence`, `Daggerheart Contribution Ledger`, `Dnd35e/Pf1e Derived Math`, `Mam Browser Tabs`, `Skills Tab & Combat Math`, `Document Storage (IndexedDB)`, `Character Card Presenter`, `5e Equipment Tab`, `Resource Pool Tracking`, `check-mam-equipment-provenance.mjs`, `dnd5eToolChoices.ts`, `3.5e Gear & Weapons`?**
  _High betweenness centrality (0.124) - this node is a cross-community bridge._
- **Why does `GameSystemId` connect `Game System Selector` to `Sheet Resource Loading Hooks`, `Dnd5e Sheets & E2E Tests`, `Dnd5e Equipment & Features UI`, `Dnd5e2024 Engine & Hit Dice`, `Tabs UI Component`, `Scene Combat Resolution`, `Dnd5e Class Templates`, `Scene Illustration Panel`, `Roadmap Metrics Generator`, `CharacterListView.tsx`, `Class Enhancement & Headers`, `Pf2e Sheet Tabs`, `Currency & Inventory Editors`, `Check & Oracle Resolution`, `Doc Drift Rules`, `Spell Browser UI`, `Error Boundary & Auth Context`, `Encounter Builder Logic`, `characterDraftFlow.test.ts`, `Character Combatant Builder`, `AI Gateway Adapters`, `SRD Coverage Script`, `ESLint Config`, `Browser Compat & Error Logging`, `AI Gateway Client`, `Spell Catalog Consistency Tests`, `Dnd5e Resource Loading Hooks`, `systemAssetPrefetch.ts`, `sceneConditionOptions.ts`, `HP & Spell Slot Trackers`, `Equipment & Feature Browsers`, `Mam Browser Tabs`, `Oracle Panel & Logic`, `check-mam-equipment-provenance.mjs`?**
  _High betweenness centrality (0.057) - this node is a cross-community bridge._
- **Why does `entry()` connect `Dnd5e Feat Templates` to `Dnd5e Background Templates`, `Retry With Backoff`, `Tabs UI Component`, `Node Runtime Bootstrap`, `Dnd5e Class Templates`, `Daggerheart Inventory`, `CharacterListView.tsx`, `AI Encounter Drafting`, `Doc Drift Rules`, `Error Boundary & Auth Context`, `Encounter Builder Logic`, `daggerheart/validation.ts`, `AI Gateway Contracts`, `fake-indexeddb`, `Mam Character Sheet Tabs`, `Dnd5e Feature Options`, `Equipment & Feature Browsers`, `Daggerheart Contribution Ledger`, `Dnd35e/Pf1e Derived Math`, `Pf2e Spell Data Encoder`, `Skills Tab & Combat Math`, `5e Monster Encoder`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **What connects `semi`, `singleQuote`, `trailingComma` to the rest of the system?**
  _1474 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Sheet Resource Loading Hooks` be split into smaller, more focused modules?**
  _Cohesion score 0.05406434418427565 - nodes in this community are weakly interconnected._
- **Should `Dnd5e Sheets & E2E Tests` be split into smaller, more focused modules?**
  _Cohesion score 0.11201079622132254 - nodes in this community are weakly interconnected._
- **Should `Dnd5e Equipment & Features UI` be split into smaller, more focused modules?**
  _Cohesion score 0.029572836801752465 - nodes in this community are weakly interconnected._