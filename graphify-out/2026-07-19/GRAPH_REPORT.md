# Graph Report - windsurf-project  (2026-07-19)

## Corpus Check
- 710 files · ~494,670 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 4480 nodes · 12683 edges · 193 communities (175 shown, 18 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 102 edges (avg confidence: 0.71)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `03b80b92`
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
- ServiceWorkerUpdateBanner.tsx
- Dnd5eEquipmentTab.tsx
- 5e Movement Rules
- usePwaInstallPrompt.ts
- daggerheartSheetShared.tsx
- MamArchetypesTab.tsx
- PF2e Backgrounds Data
- Host Size Budget Test
- Vitest Type Defs
- MAM Complications Data
- MAM Power Modifiers Data
- Vitest Coverage Config
- gatewayClient.ts
- featTemplate.test.ts
- MamPowerBrowserTab.tsx
- useEntitySync.ts
- conditions.ts
- loadEquipmentForSystem
- Pf2eProficiencyBadge.tsx
- eslint-plugin-react
- fake-indexeddb
- knip
- MamComplicationBrowser.tsx
- @types/react
- @types/react-dom
- @vitest/coverage-v8

## God Nodes (most connected - your core abstractions)
1. `CharacterDocument` - 235 edges
2. `react` - 164 edges
3. `SystemDataModel` - 126 edges
4. `GameSystemId` - 79 edges
5. `EffectInstance` - 63 edges
6. `abilityMod()` - 55 edges
7. `makeEffectId()` - 54 edges
8. `Dnd5eDataModel` - 49 edges
9. `SystemRegistry` - 46 edges
10. `Feature` - 44 edges

## Surprising Connections (you probably didn't know these)
- `D20AbilitiesTab()` --indirect_call--> `mod()`  [INFERRED]
  src/systems/d20-legacy/components/D20AbilitiesTab.tsx → scripts/encode-35e-monsters.mjs
- `Pf2eAbilitiesTab()` --indirect_call--> `mod()`  [INFERRED]
  src/systems/pf2e/components/Pf2eAbilitiesTab.tsx → scripts/encode-35e-monsters.mjs
- `Dnd5eNotesTab()` --indirect_call--> `field()`  [INFERRED]
  src/systems/dnd5e/shared/components/Dnd5eNotesTab.tsx → scripts/encode-daggerheart-adversaries.mjs
- `inferAbilityChoiceRequirement()` --indirect_call--> `ability()`  [INFERRED]
  src/systems/dnd5e/shared/featTemplate.ts → scripts/encode-pf1e-monsters.mjs
- `getDnd5eSpellcastingClassSummaries()` --indirect_call--> `ability()`  [INFERRED]
  src/systems/dnd5e/shared/spellPreparation.ts → scripts/encode-pf1e-monsters.mjs

## Import Cycles
- None detected.

## Communities (193 total, 18 thin omitted)

### Community 0 - "Sheet Resource Loading Hooks"
Cohesion: 0.06
Nodes (72): CATEGORY_LOADERS, CategoryLoader, Loaded, SystemConfig, SYSTEMS, useDaggerheartSheetResources(), MamArchetypesTab, MamComplicationsTab (+64 more)

### Community 1 - "Dnd5e Sheets & E2E Tests"
Cohesion: 0.07
Nodes (46): categoryIcons, GameSystemSelector(), GameSystemSelectorProps, systemAccents, NewCharacterDialog(), Props, supportBadgeLabels, supportBadgeStyles (+38 more)

### Community 2 - "Dnd5e Equipment & Features UI"
Cohesion: 0.08
Nodes (42): EquippedItemsSection(), Props, SLOT_LABELS, SLOT_ORDER, Dnd5e2024DataModel, Dnd5e2024TemplateState, Dnd5eSheet(), Props (+34 more)

### Community 3 - "Dnd5e Background Templates"
Cohesion: 0.07
Nodes (58): countSelections(), Dnd5eSheetMutators, optionDisabledForRequirement(), resolveEquipmentSlot(), resolveFeatSelections(), toEquippedItem(), toWeaponDamage(), ABILITY_NAME_TO_ID (+50 more)

### Community 4 - "Dnd5e2024 Engine & Hit Dice"
Cohesion: 0.06
Nodes (23): Dnd5e2024Engine, hasAlertFeat(), totalCharacterLevel(), Dnd5eEngine, Dnd5eEngineBase, normalizeDeathSaves(), engine, SHIELD (+15 more)

### Community 5 - "Daggerheart Engine"
Cohesion: 0.10
Nodes (40): applyDnd5eClassTemplate(), applyDnd5eSubclassTemplate(), assertMulticlassRequirements(), ATTRIBUTE_NAME_TO_ID, buildDerivedProficiencies(), buildSpellcastingState(), canSelectSubclass(), classFeaturesAtLevel() (+32 more)

### Community 6 - "3.5e Monster Data Encoder"
Cohesion: 0.06
Nodes (52): ALIGNMENTS, DICE_PROGRESSIONS, main(), mapAlignment(), mod(), MONSTER_SIZE, normalizeName(), OLIMOT_FILES (+44 more)

### Community 7 - "Tabs UI Component"
Cohesion: 0.10
Nodes (35): TabsContent, TabsList, TabsTrigger, isDaggerheartConsumableDefinition(), DaggerheartCharacterBasicsSection(), Props, DaggerheartDomainCardsSection(), Props (+27 more)

### Community 8 - "Node Runtime Bootstrap"
Cohesion: 0.09
Nodes (48): main(), runBootstrapNodeInstall(), getPinnedCommandArgs(), main(), runPinnedNpmCommand(), formatRuntimeDoctorReport(), main(), readWorkflowPinSource() (+40 more)

### Community 9 - "Scene Combat Resolution"
Cohesion: 0.07
Nodes (40): SceneManager(), buildSceneCombatants(), factionForToken(), ResolveCombatStats, appendSceneEvent(), applySceneIntents(), createSceneDocument(), foldSceneEvents() (+32 more)

### Community 10 - "Dnd5e Class Templates"
Cohesion: 0.05
Nodes (81): ABILITIES, DEFENSES, MamAbilitiesTab(), Props, MamComplicationBrowser, MamComplicationsTabComponent, Props, MamConditionsTab() (+73 more)

### Community 11 - "System Compute Registers"
Cohesion: 0.17
Nodes (15): daggerheartComputeRegister, dnd35eComputeRegister, dnd5e2014ComputeRegister, dnd5e2024ComputeRegister, COMPUTE_REGISTERS, registerForSystem(), mam3eComputeRegister, pf1eComputeRegister (+7 more)

### Community 12 - "Scene Check Panel"
Cohesion: 0.12
Nodes (16): ErrorBoundary, Props, State, BrowserCapabilities, checkBrowserCapabilities(), generateUUID(), initBrowserCompat(), isBrowserSupported() (+8 more)

### Community 13 - "Dnd5e Activity Definitions"
Cohesion: 0.09
Nodes (27): buildDefenseStyleActivity(), buildDivineSmiteActivities(), buildDivineSmiteActivity(), buildDnd5eActivityDefinitions(), buildUnsupportedDivineSmiteActivity(), divineSmiteSlotLevel(), Dnd5eActivityCost, Dnd5eActivityCostKind (+19 more)

### Community 14 - "Monster & NPC Generator"
Cohesion: 0.19
Nodes (17): getDaggerheartAncestryAdjustments(), applyDaggerheartAncestryTemplate(), applyDaggerheartClassTemplate(), applyDaggerheartCommunityTemplate(), classTemplateItems(), communityTemplateItems(), DaggerheartInventoryEntry, DEFAULTS (+9 more)

### Community 15 - "Dnd5e Feat Templates"
Cohesion: 0.14
Nodes (13): CurrencyEditor(), CurrencyEntry, DND_CURRENCIES, Props, InventoryItem, InventoryManager(), InventoryManagerProps, Currency (+5 more)

### Community 16 - "App Shell & Layout"
Cohesion: 0.27
Nodes (10): mockedGetQueuedCampaignsSnapshot, mockedGetQueuedDeletedCampaignIds, mockedGetQueuedDeletedDocumentIds, mockedGetQueuedSyncSnapshot, formatDateAndTime(), formatLastSyncedAt(), formatTimeOfDay(), isPreviousLocalDay() (+2 more)

### Community 17 - "D20 Combat Controls"
Cohesion: 0.12
Nodes (26): Dnd5eLikeDataModel, featureOptionSelectionKey(), ABILITY_TOKEN_MAP, collectAlwaysPreparedByLevelSources(), collectAlwaysPreparedGrantSources(), evaluatePreparedCasterFormula(), getDnd5eAlwaysPreparedSpellIds(), getDnd5eAlwaysPreparedSpellSources() (+18 more)

### Community 18 - "Game System Selector"
Cohesion: 0.08
Nodes (39): SceneAreaEffectOutcome, SceneAttackOutcome, isRoundConclusive(), RoundCombatant, RoundTurnRecord, runCombatRound(), RunRoundInput, toActor() (+31 more)

### Community 19 - "Combat & Recap Panels"
Cohesion: 0.18
Nodes (14): AppHeader(), assertNever(), INITIAL_NAV_STATE, LIBRARY_SEGMENTS, librarySegmentLabel(), NavAction, navReducer(), Overlay (+6 more)

### Community 20 - "D20 Legacy System Engines"
Cohesion: 0.10
Nodes (26): dnd35eAbilityIncreases(), dnd35eConcentrationDCDamage(), dnd35eConcentrationDCDefensive(), dnd35eFeatsFromLevel(), dnd35eHpState, dnd35eLevelForXp(), dnd35eTriggersMassiveDamage(), dnd35eXpForLevel() (+18 more)

### Community 21 - "Dnd35e Saves & Data Model"
Cohesion: 0.05
Nodes (82): Props, Props, Props, D20LegacyData, D20LegacySpellSlots, getIterativeAttackBonuses(), recoverD20LegacySpellSlot(), resetD20LegacySpellSlots() (+74 more)

### Community 22 - "Daggerheart Data Model"
Cohesion: 0.09
Nodes (32): SystemEngine, resolveCharacterEffects(), UseD20LegacySheetControllerProps, Props, Props, Props, Props, Props (+24 more)

### Community 23 - "System Registry & Renderer"
Cohesion: 0.06
Nodes (30): CharacterListView(), Props, Props, SystemSheetRenderer(), SystemRegistry, ValidationContext, ValidationResult, registerAllSystems() (+22 more)

### Community 24 - "Game Rules & Proficiencies"
Cohesion: 0.07
Nodes (33): GAME_RULES, ArmorProficiency, ArmorProficiencyType, isValidArmorProficiency(), isValidSkillProficiency(), isValidToolProficiency(), isValidWeaponProficiency(), MartialWeaponProficiency (+25 more)

### Community 25 - "Campaign Sync Hooks"
Cohesion: 0.10
Nodes (29): UseSceneEncounterParams, BuildEncounterEventsResult, buildEncounterSceneEvents(), buildInitiativeEntries(), buildOccupiedCells(), clampInteger(), compareTokenIds(), EncounterBuilderIssue (+21 more)

### Community 26 - "Daggerheart Inventory"
Cohesion: 0.09
Nodes (34): clampDaggerheartInventoryQuantity(), daggerheartInventoryDefinitions, findDaggerheartInventoryDefinitionByName(), inventoryDefinitionById, inventoryDefinitionByName, normalizeDaggerheartCurrency(), normalizeInteger(), ancestryLookup (+26 more)

### Community 27 - "Pf2e Character Templates"
Cohesion: 0.12
Nodes (38): abilityBoostValue(), ancestryFeatures(), applyAbilityAdjustments(), applyPf2eAncestryTemplate(), applyPf2eArchetypeTemplate(), applyPf2eBackgroundTemplate(), applyPf2eClassTemplate(), archetypeSource() (+30 more)

### Community 28 - "Roadmap Metrics Generator"
Cohesion: 0.08
Nodes (43): ManifestCategory, applyRepoResidentOverrides(), buildComputeCompletion(), buildContentCompletion(), buildMarkdownReport(), ComputeCompletionRow, computeMetrics(), ContentCompletionRow (+35 more)

### Community 29 - "Dnd5e Feature List Sections"
Cohesion: 0.10
Nodes (35): DamageHealControl(), DamageHealControlProps, DiceRollButton(), DiceRollButtonProps, RollResult, ABILITIES, D20AbilitiesTab(), Props (+27 more)

### Community 30 - "Encounter & Initiative Panels"
Cohesion: 0.11
Nodes (31): appendInventoryFromBackground(), applyDnd5eBackgroundTemplate(), BackgroundChoiceSlot, BackgroundChoiceValue, backgroundDerivedState(), COMMON_LANGUAGE_OPTIONS, Dnd5eBackgroundTemplateSelections, Dnd5eLikeDataModel (+23 more)

### Community 31 - "Class Enhancement & Headers"
Cohesion: 0.24
Nodes (12): Dnd5eEquipmentTab, Dnd5eFeatBrowserTab, Dnd5eFeaturesTab, Dnd5eMonsterBrowserTab, Dnd5eSpellsTab, useDnd5eDeferredResource(), useDnd5eSheetResources(), defaultOptions (+4 more)

### Community 32 - "Pf2e Sheet Tabs"
Cohesion: 0.08
Nodes (33): buildCharacterCombatant(), BuildCharacterCombatantResult, CharacterCombatant, normalizeSheet(), readArmorClass(), toMagicBonusItems(), toModifierSources(), AttackEconomy (+25 more)

### Community 33 - "AI Encounter Drafting"
Cohesion: 0.10
Nodes (34): draftEncounterWithAi(), fileToAiImageInput(), readAsDataUrl(), isMonsterSystemId(), RFC-006, useSceneEncounter(), EncounterMonsterSelection, summarizeEncounterPlan() (+26 more)

### Community 34 - "Quest & Session Log UI"
Cohesion: 0.21
Nodes (20): QuestList(), STATUS_BADGE, STATUS_OPTIONS, T0, T1, CampaignObjective, CampaignQuest, CampaignQuestStatus (+12 more)

### Community 35 - "Currency & Inventory Editors"
Cohesion: 0.09
Nodes (23): SheetProps, SystemDefinition, SystemSheetComponent, SystemValidator, ValidationReason, ValidationSeverity, Props, Props (+15 more)

### Community 36 - "Document Sync Engine"
Cohesion: 0.07
Nodes (68): critModelForScene(), degreeModelForScene(), resolveSceneAreaEffect(), resolveSceneAttack(), runSceneRound(), SceneCombatStats, SceneRoundOutcome, RFC-003 (+60 more)

### Community 37 - "Sheet Header & Stat Cards"
Cohesion: 0.06
Nodes (38): clampExhaustion(), Props, RestControls(), availableD20LegacyToggles(), D20ClassesSection(), D20LegacyClassLevel, Props, renderClassOptions() (+30 more)

### Community 38 - "Check & Oracle Resolution"
Cohesion: 0.22
Nodes (13): Dnd5eTemplateState, AddEntryInput, buildAlwaysPreparedSpellEntries(), buildDnd5eContributionLedger(), buildFeatAutomationEntries(), buildListEntry(), buildTemplateProficiencyEntries(), createEntry() (+5 more)

### Community 39 - "Mam3e Data Model & Engine"
Cohesion: 0.13
Nodes (19): clampTrack(), DeathSaves, DeathSavesTracker(), Props, HitDiceTracker(), Props, Props, SLOT_LEVELS (+11 more)

### Community 40 - "Doc Drift Rules"
Cohesion: 0.05
Nodes (62): DOC_DRIFT_MANIFEST, DocDriftRuleType, DocDriftSurface, DocDriftSurfaceKind, CAPABILITY_PHRASE_RULES, CapabilityPhraseRule, capitalizeSupportLevel(), COMMAND_RUNTIME_RULES (+54 more)

### Community 41 - "NPM Build Scripts"
Cohesion: 0.05
Nodes (43): scripts, bootstrap:node, build, check:bundle-size, check:compute-register, check:compute-register:mutate, check:compute-register:write, check:dead-code (+35 more)

### Community 42 - "Condition Effects by System"
Cohesion: 0.06
Nodes (40): AppContent(), cloneSystemData(), LegalNotices, SceneManager, STORAGE_WARNING_THRESHOLD, CampaignManager(), Props, LibraryScenesView() (+32 more)

### Community 43 - "Equipped Armor Section"
Cohesion: 0.09
Nodes (28): EquipArmorInput, EquipEntry, EquippedArmorSection(), EquipShieldInput, Props, D20EquipmentBrowserTabComponent, EquipmentBrowser, Props (+20 more)

### Community 44 - "Spell Browser UI"
Cohesion: 0.12
Nodes (27): DEFAULT_LABELS, SpellBrowser(), SpellBrowserLabels, SpellBrowserProps, SpellBrowserSpell, Tabs, D20SpellBrowserPanelComponent, SpellBrowser (+19 more)

### Community 45 - "Scene Combat Area Effects"
Cohesion: 0.17
Nodes (15): buildNotice(), FetchTarget, fetchValidated(), HTML_ENTITIES, looksLikeHtml(), main(), normalize(), noticePath (+7 more)

### Community 46 - "Error Boundary & Auth Context"
Cohesion: 0.11
Nodes (21): AppHeaderProps, Mode, SignIn(), SignInProps, UserMenu(), UserMenuProps, AuthContext, clearLocalDataForAccountChange() (+13 more)

### Community 47 - "Encounter Builder Logic"
Cohesion: 1.00
Nodes (3): averageHitDieRoll(), hitDieFaces(), seedHitDieRolls()

### Community 48 - "Scene Management Hooks"
Cohesion: 0.16
Nodes (24): Props, SceneCreateFormProps, useScenes(), BuildEncounterEventsParams, makeScene(), NOW, NOW, SceneDocument (+16 more)

### Community 49 - "Monster Combatant Builder"
Cohesion: 0.12
Nodes (36): footprintCells(), footprintWithinGrid(), isOracleAnswer(), isOracleOdds(), resolveOracle(), applyHitPointDelta(), applySceneEvent(), assertNever() (+28 more)

### Community 50 - "D20 Legacy Templates"
Cohesion: 0.14
Nodes (27): RFC-005, createDaggerheartInventoryEntry(), clearAllStress(), prepareGainHope(), repairAllArmor(), tendToAllWounds(), DomainCardEntry, useDaggerheartMutationHandlers() (+19 more)

### Community 51 - "Campaign Storage & Hooks"
Cohesion: 0.21
Nodes (16): useCampaigns(), hostileStorage, CAMPAIGNS_STORAGE_KEY, clearCampaignStorage(), exportCampaigns(), importCampaigns(), importCampaignsWithReport(), loadCampaigns() (+8 more)

### Community 52 - "Spell Preparation Logic"
Cohesion: 0.09
Nodes (17): createDefaultDnd5e2024Data(), makeDoc(), makeDoc(), makeDoc(), make2024Doc(), boonOfSkill, crafter, fixtureBenefits (+9 more)

### Community 53 - "Dev Dependencies"
Cohesion: 0.05
Nodes (41): autoprefixer, eslint, eslint-config-prettier, eslint-plugin-react-hooks, eslint-plugin-react-refresh, happy-dom, devDependencies, autoprefixer (+33 more)

### Community 54 - "Character Combatant Builder"
Cohesion: 0.07
Nodes (48): MonsterCombatant, CharacterEffectInputs, ResolvedCharacterEffects, compileEquipmentEffects(), equipStackPolicy(), isMeaningful(), MagicBonusItem, TYPED_STACK_SYSTEMS (+40 more)

### Community 55 - "D20 Class Spellcasting"
Cohesion: 0.13
Nodes (13): Props, DATE_FORMAT, Props, SessionLog(), UseCampaignSyncOptions, now, systemOptions, Campaign (+5 more)

### Community 56 - "SRD Manifest Generator"
Cohesion: 0.13
Nodes (32): getBackgroundFixedToolProficiencies(), getBackgroundLanguageOptions(), getBackgroundToolChoiceSlots(), getDnd5eTemplateChoiceState(), applyDnd5eSpeciesTemplate(), buildAbilityChoiceSlots(), buildSpeciesFeatures(), choiceAbilityBonuses() (+24 more)

### Community 57 - "Daggerheart Combatant Builders"
Cohesion: 0.12
Nodes (23): Props, ChoiceSlot, Dnd5eSpeciesSection(), Props, formatDnd5eSpeciesToolLabel(), UseDnd5eTemplateHandlersProps, Props, Props (+15 more)

### Community 58 - "AI Gateway Adapters"
Cohesion: 0.12
Nodes (20): createGeminiAdapter(), IMAGE_TASKS, TASK_SCHEMAS, AI_GATEWAY_SCHEMA_VERSION, aiFailure, AiResponse, AiTask, AiProviderAdapter (+12 more)

### Community 59 - "AI Gateway Contracts"
Cohesion: 0.14
Nodes (26): AI_GATEWAY_TASKS, AiFailureCode, AiParse, AiSuccess, AiUsage, EncounterDraftRequest, IdentifyCreatureRequest, IllustrateSceneRequest (+18 more)

### Community 60 - "System Definitions & Types"
Cohesion: 0.31
Nodes (5): SceneNarrationData, NarrateSceneParams, narrateSceneWithAi(), NarrationGatewayCall, RFC-002

### Community 61 - "D20 Legacy Spell Slots"
Cohesion: 0.06
Nodes (32): CombatStatCard(), Props, Props, SheetHeader(), TabsContentProps, TabsContext, TabsContextValue, TabsProps (+24 more)

### Community 62 - "SRD Coverage Script"
Cohesion: 0.11
Nodes (25): cats5e2014, cats5e2024, CoverageTarget, csvRows(), extractJsArray(), extractNameValues(), fetchCsvNames(), fetchJsArrayNames() (+17 more)

### Community 63 - "ESLint Config"
Cohesion: 0.05
Nodes (39): jsx, env, browser, es2021, node, extends, ignorePatterns, overrides (+31 more)

### Community 64 - "Spells Tab Components"
Cohesion: 0.12
Nodes (19): Props, Props, focusPulseSpell, PF2E_DERIVED_TRAITS, PF2E_SCHOOL_TRAITS, PF2E_TRADITIONS, AbilityScores, AreaOfEffect (+11 more)

### Community 65 - "Browser Compat & Error Logging"
Cohesion: 0.14
Nodes (17): LegalNotices(), LegalNoticesProps, licenseTexts, MonsterStatBlock(), MonsterStatBlockProps, Card, CardContent, CardDescription (+9 more)

### Community 66 - "AI Gateway Client"
Cohesion: 0.09
Nodes (19): CR_XP_TABLE, formatChallengeRating(), MonsterBrowser(), MonsterBrowserProps, monsters, VALID_DAMAGE_TYPES, now, position (+11 more)

### Community 67 - "2024 Monster Data Encoder"
Cohesion: 0.16
Nodes (23): ABILITIES, ALIGNMENTS, bucketFor(), classifyImmunityList(), cleanProse(), CR_FRACTIONS, CREATURE_TYPES, DAMAGE_TYPES (+15 more)

### Community 68 - "Character Effects Compilation"
Cohesion: 0.14
Nodes (15): Badge(), BadgeProps, badgeVariants, availablePf2eToggles(), D20LegacyHeader(), Pf2eArchetypesTab(), PF2E_CONDITIONS, PF2E_VALUED_CONDITIONS (+7 more)

### Community 69 - "TypeScript Config"
Cohesion: 0.07
Nodes (28): ES2020, ./src/*, compilerOptions, allowImportingTsExtensions, baseUrl, forceConsistentCasingInFileNames, isolatedModules, jsx (+20 more)

### Community 70 - "Mam Character Sheet Tabs"
Cohesion: 0.12
Nodes (23): MUTATION_ANCHORS, MutationAnchor, applyDemotion(), DO_MUTATE, DO_WRITE, escapeRe(), evaluateMutation(), evaluateTierA() (+15 more)

### Community 71 - "Monster Stat Block & Status"
Cohesion: 0.09
Nodes (28): createDefaultPf2eData(), Pf2eClassLevel, Pf2eFeat, profTotal(), tierBonus(), RFC-003, CREATURE_XP_BY_LEVEL_DIFF, pf2eAttackModifier() (+20 more)

### Community 72 - "Dice Panel & Mam3e Resolution"
Cohesion: 0.50
Nodes (4): EncounterPanelProps, EncounterPartySummary, EncounterPlanSummary, EncounterSpecValidation

### Community 73 - "System Validation Logic"
Cohesion: 0.20
Nodes (24): ABILITY_SCORE_IDS, addIssue(), createDnd5eValidator(), Dnd5eValidationData, Dnd5eValidationDataModel, Dnd5eValidationSystemId, featureOptionKey(), isIntegerInRange() (+16 more)

### Community 74 - "Spell Catalog Consistency Tests"
Cohesion: 0.15
Nodes (15): e(), ExpectedSpellIdentity, iconicSpellExpectations, SystemKey, systems, dedupeById(), Identified, indexById() (+7 more)

### Community 75 - "Dnd5e Resource Loading Hooks"
Cohesion: 0.23
Nodes (19): GetDaggerheartSheetStateProps, UseDaggerheartTemplateHandlersProps, DaggerheartAdversaryRole, DaggerheartAncestry, DaggerheartArmor, DaggerheartClass, DaggerheartCommunity, DaggerheartConsumable (+11 more)

### Community 76 - "Mam Powers & Cost Ledger"
Cohesion: 0.38
Nodes (5): MamAdvantageBrowserTab(), Props, Advantage, AdvantagePrerequisite, AdvantageType

### Community 77 - "Sync Engine Tests"
Cohesion: 0.29
Nodes (12): NOW, clearSyncTombstones(), getSyncTombstonedIds(), getSyncTombstones(), pruneExpired(), readStored(), recordSyncTombstones(), removeSyncTombstones() (+4 more)

### Community 78 - "Dnd5e Feature Options"
Cohesion: 0.09
Nodes (38): Dnd5eFeatureOptionsSection(), Dnd5eFeatureOptionsSectionComponent, FeatureOptionBrowser, FeatureOptionBrowserProps, featureOptionSelectionKey(), Props, FeatureOptionBrowser(), FeatureOptionBrowserProps (+30 more)

### Community 79 - "Document Migrations & Storage"
Cohesion: 0.09
Nodes (40): cloneDocumentsSnapshot(), documentsChanged(), prepareDocumentsWithEngines(), prepareDocumentWithEngine(), useDocuments(), makeStoredDocument(), setStoredDocuments(), StubTransaction (+32 more)

### Community 80 - "App Header & Auth UI"
Cohesion: 0.36
Nodes (7): ThemeToggle(), applyTheme(), getSystemTheme(), isTheme(), Theme, useTheme(), VALID_THEMES

### Community 81 - "Combat Toggles & Conditions"
Cohesion: 0.08
Nodes (31): useEntitySync(), Doc, useSync(), UseSyncOptions, baseAuthValue, mockedClearQueuedDeletedDocumentIds, mockedClearQueuedSyncSnapshot, mockedDeleteRemoteDocument (+23 more)

### Community 82 - "HP & Spell Slot Trackers"
Cohesion: 0.19
Nodes (9): EncounterDraftData, EncounterDraftSelection, TaskGatewayCall, DraftEncounterParams, DraftEncounterResult, GatewayCall, SelectionValidator, RFC-002 (+1 more)

### Community 83 - "Scene Grid View"
Cohesion: 0.18
Nodes (14): daggerheartManifest, dnd35eManifest, dnd5e2014Manifest, dnd5e2024Manifest, manifestForSystem(), SRD_MANIFESTS, mam3eManifest, pf1eManifest (+6 more)

### Community 84 - "Boundary Validation Tests"
Cohesion: 0.24
Nodes (18): ValidationIssue, NOW, parseImg(), validDocInput(), coerceDate(), coerceObjectives(), coerceQuests(), coerceSessionLog() (+10 more)

### Community 85 - "capabilityScenarios.test.tsx"
Cohesion: 0.60
Nodes (3): formatModifierCost(), MamPowerModifierBrowser(), MamPowerModifierBrowserProps

### Community 86 - "Equipment & Feature Browsers"
Cohesion: 0.16
Nodes (19): useLazyResource(), useSystemOptions(), useD20LegacySheetResources(), Pf2eEquipmentBrowserTab, Pf2eFeatBrowserTab, Pf2eSpellsTab, usePf2eSheetResources(), loadArchetypesForSystem() (+11 more)

### Community 87 - "Pf2e Engine & Constants"
Cohesion: 0.09
Nodes (20): GapLedgerItem, LedgerPhase, LedgerStatus, LedgerTag, LedgerTrack, MASTER_GAP_LEDGER, RFC-003, byPhase (+12 more)

### Community 88 - "Documents Hook & Persistence"
Cohesion: 0.25
Nodes (16): actionReachCells(), ATTACK_COUNT_WORDS, averageDie(), buildMonsterCombatant(), dieFaces(), isMinusSign(), monsterAttackEffects(), monsterAttacksPerRound() (+8 more)

### Community 89 - "Daggerheart Contribution Ledger"
Cohesion: 0.07
Nodes (55): ANCESTRY_ADJUSTMENTS_BY_ID, ancestryByName, classByName, DAGGERHEART_TRAITS, DaggerheartAncestryAdjustments, DaggerheartRange, DEFAULT_DAGGERHEART_ANCESTRY_ADJUSTMENTS, doesDaggerheartPassiveConditionApply() (+47 more)

### Community 90 - "Dnd35e/Pf1e Derived Math"
Cohesion: 0.08
Nodes (35): ProficiencyListSection(), Props, D20FeatBrowserTabComponent, FeatBrowser, Props, BrowserFeat, Dnd5eFeatBrowserTabComponent, FeatBrowser (+27 more)

### Community 91 - "Mam Browser Tabs"
Cohesion: 0.18
Nodes (13): ANSWER_BADGE, OraclePanel(), OraclePanelProps, ODDS_TARGET, ORACLE_ANSWER_LABEL, ORACLE_ODDS, ORACLE_ODDS_LABEL, formatList() (+5 more)

### Community 92 - "Pf2e Derived Math"
Cohesion: 0.15
Nodes (10): GeneratedNpc, generateNpc(), generateNpcName(), NAME_ENDS, NAME_MIDS, NAME_STARTS, BRUTE, NOW (+2 more)

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
Cohesion: 0.13
Nodes (20): DEFAULT_QUICK_ROLLS, DicePanel(), DicePanelProps, formatBreakdown(), QUICK_ROLLS_BY_SYSTEM, applyKeep(), DiceRollResult, DiceTerm (+12 more)

### Community 97 - "Mam3e Derived Math"
Cohesion: 0.17
Nodes (16): CharacterCard(), CharacterCardProps, OverflowMenu(), OverflowMenuItem, OverflowMenuProps, Skeleton(), cn(), asNumber() (+8 more)

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
Cohesion: 0.28
Nodes (13): Pf2eProficiencyTier, getPf2eSheetChoiceState(), countTrainedPf2eSkills(), getPf2eBulkState(), longRestPf2eSpellcasting(), nextPf2eTier(), PF2E_TIER_ORDER, Pf2eBulkState (+5 more)

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
Nodes (29): AuthContextValue, useCampaignSync(), baseAuthValue, mockedClearQueuedCampaignsSnapshot, mockedClearQueuedDeletedCampaignIds, mockedDeleteRemoteCampaign, mockedFetchRemoteCampaigns, mockedGetQueuedCampaignsSnapshot (+21 more)

### Community 107 - "Oracle Panel & Logic"
Cohesion: 0.07
Nodes (51): react, IllustrateSceneResult, NarrateSceneResult, CharacterListViewProps, CharacterSortOption, CheckPanelProps, DEFAULT_SUGGESTIONS, DND5E_SKILLS (+43 more)

### Community 108 - "5e Equipment Tab"
Cohesion: 0.17
Nodes (14): ArtisanToolProficiency, GamingSetProficiency, buildChoiceSlots(), formatDnd5eClassToolChoiceLabel(), getDnd5eClassSkillChoiceSlots(), getDnd5eClassToolChoiceSlots(), canSelectSubclass(), Dnd5eClassesSection() (+6 more)

### Community 109 - "Scene Reaction Panel"
Cohesion: 0.23
Nodes (14): compareSpells(), D20SpellsTab(), formatSpellLevel(), titleCase(), D20_ARCANE_SCHOOLS, buildSpellPreparationConcepts(), compareSpellEntries(), dedupeSpellIds() (+6 more)

### Community 110 - "Document Signature Hashing"
Cohesion: 0.05
Nodes (40): CheckPanel(), ALLEGIANCE_LABEL, ALLEGIANCE_TOKEN_CLASS, buildTokenLabel(), buildTokensByCell(), SceneGridView, SceneGridViewProps, TokenHpBar() (+32 more)

### Community 111 - "Resource Pool Tracking"
Cohesion: 0.31
Nodes (6): GeneratedImageData, IllustrateGatewayCall, IllustrateSceneParams, illustrateSceneWithAi(), RFC-002, image

### Community 112 - "Bundle Size Check"
Cohesion: 0.10
Nodes (15): appChunk, appChunks, assetsDir, budgets, chunks, dataChunks, distDir, eagerChunkNames (+7 more)

### Community 113 - "AI Prompt Builders"
Cohesion: 0.29
Nodes (12): EncounterDraftPayload, IdentifyCreaturePayload, IllustrateScenePayload, SceneNarrationPayload, buildEncounterDraftPrompt(), buildIdentifyCreaturePrompt(), buildIllustrateScenePrompt(), buildPromptForTask() (+4 more)

### Community 115 - "Project Dependencies"
Cohesion: 0.09
Nodes (23): ai, @ai-sdk/google, class-variance-authority, clsx, lucide-react, dependencies, ai, @ai-sdk/google (+15 more)

### Community 116 - "3.5e Spell Encoder"
Cohesion: 0.26
Nodes (10): DISPOSITION_BADGE, DISPOSITION_LABEL, ReactionHistoryEntry, ReactionPanel(), ReactionPanelProps, dispositionForTotal(), resolveReaction(), rollReaction() (+2 more)

### Community 117 - "AI Encounter Draft Flow"
Cohesion: 0.23
Nodes (9): AiImageInput, EncounterDraftCandidate, IdentifyCreatureData, IdentifyCreatureParams, IdentifyCreatureResult, identifyCreatureWithAi(), IdentifyGatewayCall, RFC-002 (+1 more)

### Community 118 - "Campaign File Transfer"
Cohesion: 0.07
Nodes (39): HIT_DICE, hitDieSize(), hitDieString(), d20LegacyCheckPenalty(), D20Roll, DualityRoll, rollD20(), rollDuality() (+31 more)

### Community 119 - "MAM Archetype Browser"
Cohesion: 0.27
Nodes (11): CLASS_TOKENS, d20srdUrl(), FILES, main(), mapCastingTime(), mapDuration(), mapRange(), normalizeName() (+3 more)

### Community 120 - "PF1e Spell Encoder"
Cohesion: 0.27
Nodes (11): CLASS_COLUMNS, main(), mapCastingTime(), mapDuration(), mapRange(), RFC-4180, normalizeName(), parseCsv() (+3 more)

### Community 122 - "PF2e Archetypes Tab"
Cohesion: 0.09
Nodes (29): DND5E_SCENE_CONDITIONS, SCENE_CONDITIONS_BY_SYSTEM, sceneConditionOptions(), collectD20LegacyConditionEffects(), D20_LEGACY_CONDITION_IDS, collectDnd5eConditionEffects(), conditionImposesDisadvantage(), DND5E_CONDITION_EFFECTS (+21 more)

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

### Community 130 - "d20LegacySpellcasting.ts"
Cohesion: 0.14
Nodes (13): casterTypes, classResourcesNeeded, classTags, AlwaysPreparedSpellGrant, ClassDisplayMetadata, ClassFeatureProgression, ClassResource, ClassTag (+5 more)

### Community 131 - "Retry With Backoff"
Cohesion: 0.16
Nodes (22): getSupabaseClient(), supabaseAnonKey, supabaseUrl, clearQueuedIds(), extractTombstone(), fetchRemoteDocuments(), fromRemote(), fromRemoteCampaign() (+14 more)

### Community 132 - "2024 Spell Encoder"
Cohesion: 0.39
Nodes (8): main(), mapCastingTime(), mapDuration(), mapRange(), normalizeName(), SCHOOLS, slug(), ts()

### Community 133 - "MAM Power Browser"
Cohesion: 0.07
Nodes (32): CombatTogglesSection(), Props, Condition, ConditionPicker(), Props, FeaturesSection(), Props, NormalizedSheet (+24 more)

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
Cohesion: 0.27
Nodes (9): makeScene(), campaignSignatureFor(), sameCampaignSignatures(), sameDocumentSignatures(), sameSceneSignatures(), sameSignatureMultisets(), sceneSignatureFor(), signatureFor() (+1 more)

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

### Community 153 - "ServiceWorkerUpdateBanner.tsx"
Cohesion: 0.29
Nodes (5): ServiceWorkerUpdateBanner(), isServiceWorkerSupported(), ServiceWorkerUpdateState, useServiceWorkerUpdate(), createRegistry()

### Community 154 - "Dnd5eEquipmentTab.tsx"
Cohesion: 0.14
Nodes (13): CurrencyEditor, CurrencyEditorProps, Dnd5eEquipmentTabComponent, EquipmentBrowser, EquipmentBrowserItem, EquipmentBrowserProps, EquippedItemsSection, EquippedItemsSectionProps (+5 more)

### Community 155 - "5e Movement Rules"
Cohesion: 0.60
Nodes (4): dnd5eCarryingCapacity(), dnd5eHighJump(), dnd5eLongJump(), dnd5ePushDragLift()

### Community 156 - "usePwaInstallPrompt.ts"
Cohesion: 0.26
Nodes (9): collectTerrainEffectsAt(), isTerrainOperation(), markerCoversCell(), markerToEffects(), normalizeStackPolicy(), TERRAIN_OPERATIONS, stateWithMarkers(), RFC-003 (+1 more)

### Community 157 - "daggerheartSheetShared.tsx"
Cohesion: 0.24
Nodes (10): DaggerheartDomainCardAutomation(), DaggerheartDomainCardAutomationProps, DaggerheartFeatureListProps, DaggerheartSubclassFeatureGroup(), DaggerheartSubclassFeatureGroupProps, DOMAIN_CARD_AUTOMATION_LABELS, DOMAIN_CARD_AUTOMATION_VARIANTS, humanizeEffectTag() (+2 more)

### Community 160 - "MamArchetypesTab.tsx"
Cohesion: 0.31
Nodes (6): MamArchetypeBrowser(), MamArchetypeBrowserProps, MamArchetypeBrowser, MamArchetypesTabComponent, Props, Mam3eArchetype

### Community 161 - "PF2e Backgrounds Data"
Cohesion: 0.50
Nodes (3): Pf2eBackgroundChoice, Pf2eBackgroundDefinition, Pf2eBackgroundFeatGrant

### Community 177 - "gatewayClient.ts"
Cohesion: 0.39
Nodes (5): AI_GATEWAY_ENDPOINT, AiRequest, callAiGateway(), isAiEnabled(), payload

### Community 179 - "featTemplate.test.ts"
Cohesion: 0.38
Nodes (4): DebouncedPersistence, IMPORTANT: a begun generation must end in either `persist` or, useDebouncedPersistence(), debounce()

### Community 180 - "MamPowerBrowserTab.tsx"
Cohesion: 0.15
Nodes (13): EquipmentBrowser, MamEquipmentBrowserTabComponent, Props, formatMamPowerAction(), formatMamPowerDuration(), formatMamPowerRange(), humanizeMamToken(), MamPowerBrowserTabComponent (+5 more)

### Community 181 - "useEntitySync.ts"
Cohesion: 0.70
Nodes (4): EntitySyncAdapter, UseEntitySyncOptions, RemoteFetchResult, SyncTombstone

### Community 182 - "conditions.ts"
Cohesion: 0.60
Nodes (4): DND5E_CONDITION_NAMES, hasDnd5eCondition(), normalizeConditionId(), normalizeDnd5eConditions()

### Community 183 - "loadEquipmentForSystem"
Cohesion: 0.50
Nodes (3): Answer, Outcome, Q: where are pending debounced document saves flushed to localStorage on page hide or unload (persistence flush)

### Community 184 - "Pf2eProficiencyBadge.tsx"
Cohesion: 0.50
Nodes (4): Props, TIER_COLORS, TIER_LABELS, Pf2eProficiency

### Community 186 - "eslint-plugin-react"
Cohesion: 0.40
Nodes (4): Feat, FeatBrowser(), FeatBrowserProps, feats

## Knowledge Gaps
- **1134 isolated node(s):** `browser`, `es2021`, `node`, `eslint:recommended`, `plugin:@typescript-eslint/recommended` (+1129 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **18 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `Oracle Panel & Logic` to `Sheet Resource Loading Hooks`, `Dnd5e Sheets & E2E Tests`, `Dnd5e Equipment & Features UI`, `Dnd5e Background Templates`, `MAM Power Browser`, `3.5e Monster Data Encoder`, `Tabs UI Component`, `Daggerheart Engine`, `Scene Combat Resolution`, `Dnd5e Class Templates`, `Scene Check Panel`, `Monster & NPC Generator`, `Dnd5e Feat Templates`, `D20 Combat Controls`, `Combat & Recap Panels`, `Dnd35e Saves & Data Model`, `Daggerheart Data Model`, `System Registry & Renderer`, `Equipment Browser Component`, `ServiceWorkerUpdateBanner.tsx`, `Dnd5eEquipmentTab.tsx`, `Dnd5e Feature List Sections`, `Class Enhancement & Headers`, `MamArchetypesTab.tsx`, `AI Encounter Drafting`, `Quest & Session Log UI`, `Currency & Inventory Editors`, `Sheet Header & Stat Cards`, `Mam3e Data Model & Engine`, `Condition Effects by System`, `Equipped Armor Section`, `Spell Browser UI`, `Error Boundary & Auth Context`, `Scene Management Hooks`, `D20 Legacy Templates`, `Campaign Storage & Hooks`, `featTemplate.test.ts`, `useEntitySync.ts`, `MamPowerBrowserTab.tsx`, `D20 Class Spellcasting`, `Pf2eProficiencyBadge.tsx`, `Daggerheart Combatant Builders`, `eslint-plugin-react`, `D20 Legacy Spell Slots`, `MamComplicationBrowser.tsx`, `ESLint Config`, `Browser Compat & Error Logging`, `AI Gateway Client`, `Character Effects Compilation`, `Dnd5e Resource Loading Hooks`, `Mam Powers & Cost Ledger`, `Dnd5e Feature Options`, `Document Migrations & Storage`, `App Header & Auth UI`, `Combat Toggles & Conditions`, `capabilityScenarios.test.tsx`, `Equipment & Feature Browsers`, `Dnd35e/Pf1e Derived Math`, `Mam Browser Tabs`, `Skills Tab & Combat Math`, `Mam3e Derived Math`, `Document Storage (IndexedDB)`, `AI Creature Identification`, `Scene Reaction Panel`, `Document Signature Hashing`, `3.5e Spell Encoder`, `Campaign File Transfer`?**
  _High betweenness centrality (0.157) - this node is a cross-community bridge._
- **Why does `CharacterDocument` connect `Daggerheart Data Model` to `Dnd5e Equipment & Features UI`, `Dnd5e Background Templates`, `Dnd5e2024 Engine & Hit Dice`, `MAM Power Browser`, `Daggerheart Engine`, `Tabs UI Component`, `Retry With Backoff`, `Scene Combat Resolution`, `Dnd5e Class Templates`, `pf2eConditions.ts`, `Dnd5e Activity Definitions`, `Monster & NPC Generator`, `D20 Combat Controls`, `Game System Selector`, `D20 Legacy System Engines`, `Dnd35e Saves & Data Model`, `System Registry & Renderer`, `Campaign Sync Hooks`, `Daggerheart Inventory`, `Pf2e Character Templates`, `Dnd5e Feature List Sections`, `Encounter & Initiative Panels`, `Pf2e Sheet Tabs`, `AI Encounter Drafting`, `Currency & Inventory Editors`, `Document Sync Engine`, `Sheet Header & Stat Cards`, `Check & Oracle Resolution`, `Condition Effects by System`, `Error Boundary & Auth Context`, `Encounter Builder Logic`, `Scene Management Hooks`, `Spell Preparation Logic`, `SRD Manifest Generator`, `Daggerheart Combatant Builders`, `D20 Legacy Spell Slots`, `AI Gateway Client`, `Character Effects Compilation`, `Monster Stat Block & Status`, `System Validation Logic`, `Dnd5e Resource Loading Hooks`, `Dnd5e Feature Options`, `Document Migrations & Storage`, `Combat Toggles & Conditions`, `Boundary Validation Tests`, `Daggerheart Contribution Ledger`, `Pf2e Derived Math`, `Mam3e Derived Math`, `Document Storage (IndexedDB)`, `Oracle Panel & Logic`, `Document Signature Hashing`, `Campaign File Transfer`, `PF2e Archetypes Tab`?**
  _High betweenness centrality (0.117) - this node is a cross-community bridge._
- **Why does `GameSystemId` connect `Dnd5e Sheets & E2E Tests` to `Sheet Resource Loading Hooks`, `Dnd5e Equipment & Features UI`, `Dnd5e2024 Engine & Hit Dice`, `MAM Power Browser`, `Tabs UI Component`, `Dnd5e Class Templates`, `D20 Combat Controls`, `Game System Selector`, `Dnd35e Saves & Data Model`, `System Registry & Renderer`, `Roadmap Metrics Generator`, `Class Enhancement & Headers`, `Pf2e Sheet Tabs`, `AI Encounter Drafting`, `Currency & Inventory Editors`, `Sheet Header & Stat Cards`, `Doc Drift Rules`, `Condition Effects by System`, `Character Combatant Builder`, `SRD Coverage Script`, `Dnd5e Resource Loading Hooks`, `Equipment & Feature Browsers`, `Dnd35e/Pf1e Derived Math`, `Pf2e Derived Math`, `Document Storage (IndexedDB)`, `Oracle Panel & Logic`, `Campaign File Transfer`?**
  _High betweenness centrality (0.068) - this node is a cross-community bridge._
- **What connects `browser`, `es2021`, `node` to the rest of the system?**
  _1134 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Sheet Resource Loading Hooks` be split into smaller, more focused modules?**
  _Cohesion score 0.06491398896462187 - nodes in this community are weakly interconnected._
- **Should `Dnd5e Sheets & E2E Tests` be split into smaller, more focused modules?**
  _Cohesion score 0.0742447516641065 - nodes in this community are weakly interconnected._
- **Should `Dnd5e Equipment & Features UI` be split into smaller, more focused modules?**
  _Cohesion score 0.08038914490527393 - nodes in this community are weakly interconnected._