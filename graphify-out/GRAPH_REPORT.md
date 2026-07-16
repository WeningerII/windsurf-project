# Graph Report - windsurf-project  (2026-07-16)

## Corpus Check
- 699 files · ~485,746 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 4426 nodes · 12479 edges · 192 communities (174 shown, 18 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 102 edges (avg confidence: 0.71)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `cd316ae3`
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
- featTemplate.test.ts
- loadEquipmentForSystem
- eslint-plugin-react
- fake-indexeddb
- knip
- postcss
- rollup-plugin-visualizer
- @testing-library/jest-dom
- tsx
- @types/react
- @types/react-dom
- vitest
- @vitest/coverage-v8

## God Nodes (most connected - your core abstractions)
1. `CharacterDocument` - 230 edges
2. `react` - 162 edges
3. `SystemDataModel` - 126 edges
4. `GameSystemId` - 79 edges
5. `EffectInstance` - 61 edges
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

## Communities (192 total, 18 thin omitted)

### Community 0 - "Sheet Resource Loading Hooks"
Cohesion: 0.05
Nodes (94): useLazyResource(), useSystemOptions(), buildSystem(), CATEGORY_LOADERS, CategoryLoader, escape(), isRecord(), Loaded (+86 more)

### Community 1 - "Dnd5e Sheets & E2E Tests"
Cohesion: 0.12
Nodes (22): RollResult, Props, Props, Props, SAVE_ABILITIES, SKILL_ABILITIES, createDefaultPf2eData(), Pf2eDataModel (+14 more)

### Community 2 - "Dnd5e Equipment & Features UI"
Cohesion: 0.05
Nodes (62): EquippedItemsSection(), Props, SLOT_LABELS, SLOT_ORDER, HitDiceTracker(), Props, Props, SLOT_LEVELS (+54 more)

### Community 3 - "Dnd5e Background Templates"
Cohesion: 0.06
Nodes (58): resolveFeatSelections(), ABILITY_NAME_TO_ID, ABILITY_OPTIONS, abilityAutomationFromSelections(), aggregateFeatAutomation(), applyDnd5eFeatTemplate(), applyFeatSkillSources(), buildAutomatedFeat() (+50 more)

### Community 4 - "Dnd5e2024 Engine & Hit Dice"
Cohesion: 0.07
Nodes (29): HIT_DICE, hitDieSize(), hitDieString(), D20Roll, Dnd5e2024Engine, hasAlertFeat(), totalCharacterLevel(), DND5E_CONDITION_NAMES (+21 more)

### Community 5 - "Daggerheart Engine"
Cohesion: 0.08
Nodes (50): applyDnd5eClassTemplate(), applyDnd5eSubclassTemplate(), assertMulticlassRequirements(), ATTRIBUTE_NAME_TO_ID, buildChoiceSlots(), buildDerivedProficiencies(), buildSpellcastingState(), canSelectSubclass() (+42 more)

### Community 6 - "3.5e Monster Data Encoder"
Cohesion: 0.09
Nodes (35): ALIGNMENTS, DICE_PROGRESSIONS, main(), mapAlignment(), mod(), MONSTER_SIZE, normalizeName(), OLIMOT_FILES (+27 more)

### Community 7 - "Tabs UI Component"
Cohesion: 0.15
Nodes (15): Tabs, TabsContentProps, TabsContext, TabsContextValue, TabsList, TabsProps, TabsTrigger, TabsTriggerProps (+7 more)

### Community 8 - "Node Runtime Bootstrap"
Cohesion: 0.09
Nodes (48): main(), runBootstrapNodeInstall(), getPinnedCommandArgs(), main(), runPinnedNpmCommand(), formatRuntimeDoctorReport(), main(), readWorkflowPinSource() (+40 more)

### Community 9 - "Scene Combat Resolution"
Cohesion: 0.07
Nodes (42): Props, SceneCreateFormProps, ResolveCombatStats, appendSceneEvent(), createSceneDocument(), foldSceneEvents(), resolveSceneAction(), makeScene() (+34 more)

### Community 10 - "Dnd5e Class Templates"
Cohesion: 0.14
Nodes (29): applyAbilityAdjustments(), applyD20LegacyClassTemplate(), applyD20LegacyRaceTemplate(), buildClassSkills(), classFeaturesUpToLevel(), classSkillOptions(), collectClassFeatureSignatures(), create35eClassLevel() (+21 more)

### Community 11 - "System Compute Registers"
Cohesion: 0.17
Nodes (15): daggerheartComputeRegister, dnd35eComputeRegister, dnd5e2014ComputeRegister, dnd5e2024ComputeRegister, COMPUTE_REGISTERS, registerForSystem(), mam3eComputeRegister, pf1eComputeRegister (+7 more)

### Community 12 - "Scene Check Panel"
Cohesion: 0.13
Nodes (19): Props, State, LegalNotices(), LegalNoticesProps, licenseTexts, MonsterStatBlock(), MonsterStatBlockProps, Card (+11 more)

### Community 13 - "Dnd5e Activity Definitions"
Cohesion: 0.11
Nodes (26): buildDefenseStyleActivity(), buildDivineSmiteActivities(), buildDivineSmiteActivity(), buildDnd5eActivityDefinitions(), buildUnsupportedDivineSmiteActivity(), divineSmiteSlotLevel(), Dnd5eActivityCost, Dnd5eActivityCostKind (+18 more)

### Community 14 - "Monster & NPC Generator"
Cohesion: 0.09
Nodes (27): FeaturesSection(), Props, NormalizedSheet, CharacterEffectInputs, MagicBonusItem, ModifierSource, casterTypes, classResourcesNeeded (+19 more)

### Community 15 - "Dnd5e Feat Templates"
Cohesion: 0.14
Nodes (18): Badge(), BadgeProps, badgeVariants, D20EquipmentBrowserTab, D20FeatBrowserTab, D20FeatsTab(), FeatEntry, Props (+10 more)

### Community 16 - "App Shell & Layout"
Cohesion: 0.19
Nodes (18): AppContent(), cloneSystemData(), mockedGetQueuedCampaignsSnapshot, mockedGetQueuedDeletedCampaignIds, mockedGetQueuedDeletedDocumentIds, mockedGetQueuedSyncSnapshot, getQueuedCampaignsSnapshot(), getQueuedDeletedDocumentIds() (+10 more)

### Community 17 - "D20 Combat Controls"
Cohesion: 0.19
Nodes (12): TabsContent, Dnd5eAbilitiesTab(), Props, Dnd5eNotesTab(), Dnd5ePersonality, Props, Dnd5eWeaponMasteriesTab(), Props (+4 more)

### Community 18 - "Game System Selector"
Cohesion: 0.09
Nodes (37): categoryIcons, GameSystemSelector(), GameSystemSelectorProps, systemAccents, supportBadgeLabels, supportBadgeStyles, buildInitialSummaryStates(), categoryDisplay (+29 more)

### Community 19 - "Combat & Recap Panels"
Cohesion: 0.08
Nodes (53): MamPowersTab(), ModifierColumn(), ModifierColumnProps, Props, buildMam3eContributionLedger(), buildMam3ePowerCostLedgerEntries(), createPowerCostEntry(), ledgerId() (+45 more)

### Community 20 - "D20 Legacy System Engines"
Cohesion: 0.10
Nodes (25): dnd35eAbilityIncreases(), dnd35eConcentrationDCDamage(), dnd35eConcentrationDCDefensive(), dnd35eFeatsFromLevel(), dnd35eHpState, dnd35eTriggersMassiveDamage(), dnd35eXpForLevel(), pf1eConcentrationDCDamage() (+17 more)

### Community 21 - "Dnd35e Saves & Data Model"
Cohesion: 0.07
Nodes (33): createDefaultDnd35eData(), Dnd35eClassLevel, Dnd35eFeat, Dnd35eManualSpellcastingExtras, Dnd35eSaves, RFC-003, Dnd35eEngine, createDefaultPf1eData() (+25 more)

### Community 22 - "Daggerheart Data Model"
Cohesion: 0.22
Nodes (9): DaggerheartCharacterBasicsSection(), Props, DaggerheartDomainCardsSection(), Props, ATTRIBUTES, DOMAIN_CARD_TYPE_LABELS, EMPTY_WEAPON_LOADOUT, normalizeDomainId() (+1 more)

### Community 23 - "System Registry & Renderer"
Cohesion: 0.06
Nodes (28): CharacterListView(), SystemRegistry, SheetProps, SystemDefinition, SystemSheetComponent, ValidationContext, ValidationIssue, ValidationReason (+20 more)

### Community 24 - "Game Rules & Proficiencies"
Cohesion: 0.07
Nodes (33): GAME_RULES, ArmorProficiency, ArmorProficiencyType, GamingSetProficiency, isValidArmorProficiency(), isValidSkillProficiency(), isValidToolProficiency(), isValidWeaponProficiency() (+25 more)

### Community 25 - "Campaign Sync Hooks"
Cohesion: 0.16
Nodes (14): Pf2eProficiencyBadge(), Props, TIER_COLORS, TIER_LABELS, formatPf2eOptionLabel(), Pf2eSkillsTab(), Pf2eSpellsTabComponent, Props (+6 more)

### Community 26 - "Daggerheart Inventory"
Cohesion: 0.12
Nodes (27): findDaggerheartInventoryDefinitionByName(), ancestryLookup, armorLookup, buildLookup(), classLookup, communityLookup, DEFAULTS, domainCardByName (+19 more)

### Community 27 - "Pf2e Character Templates"
Cohesion: 0.11
Nodes (40): abilityBoostValue(), ancestryFeatures(), applyAbilityAdjustments(), applyPf2eAncestryTemplate(), applyPf2eArchetypeTemplate(), applyPf2eBackgroundTemplate(), applyPf2eClassTemplate(), archetypeSource() (+32 more)

### Community 28 - "Roadmap Metrics Generator"
Cohesion: 0.09
Nodes (39): ManifestCategory, applyRepoResidentOverrides(), buildComputeCompletion(), buildContentCompletion(), buildMarkdownReport(), ComputeCompletionRow, computeMetrics(), ContentCompletionRow (+31 more)

### Community 29 - "Dnd5e Feature List Sections"
Cohesion: 0.10
Nodes (29): DamageHealControl(), DamageHealControlProps, DiceRollButton(), DiceRollButtonProps, ABILITIES, D20AbilitiesTab(), Props, D20CombatSection() (+21 more)

### Community 30 - "Encounter & Initiative Panels"
Cohesion: 0.05
Nodes (77): ArtisanToolProficiency, MusicalInstrumentProficiency, appendInventoryFromBackground(), applyDnd5eBackgroundTemplate(), BackgroundChoiceSlot, BackgroundChoiceValue, backgroundDerivedState(), COMMON_LANGUAGE_OPTIONS (+69 more)

### Community 31 - "Class Enhancement & Headers"
Cohesion: 0.10
Nodes (32): getEligibleDnd5eFeatureOptions(), applyDnd5eLongRest(), applyDnd5eShortRest(), recoverAllSpellSlots(), recoverFeatures(), recoverLongRestHitDice(), recoverPactMagicSlots(), featureOptionSelectionKey() (+24 more)

### Community 32 - "Pf2e Sheet Tabs"
Cohesion: 0.12
Nodes (24): Pf2eArchetypesTab(), Props, Pf2eInventoryTab(), Props, Pf2eNotesTab(), Props, getPf2eSheetChoiceState(), GetPf2eSheetChoiceStateProps (+16 more)

### Community 33 - "AI Encounter Drafting"
Cohesion: 0.08
Nodes (36): draftEncounterWithAi(), fileToAiImageInput(), readAsDataUrl(), isMonsterSystemId(), RFC-006, useSceneEncounter(), EncounterMonsterSelection, DIFFICULTY_COLUMN (+28 more)

### Community 34 - "Quest & Session Log UI"
Cohesion: 0.10
Nodes (35): Props, QuestList(), STATUS_BADGE, STATUS_OPTIONS, DATE_FORMAT, Props, SessionLog(), SceneCreateForm() (+27 more)

### Community 35 - "Currency & Inventory Editors"
Cohesion: 0.32
Nodes (5): CombatTogglesSection(), Props, Dnd5eRiderTogglesSection(), Props, TOGGLE_LABELS

### Community 36 - "Document Sync Engine"
Cohesion: 0.10
Nodes (22): illustrateSceneWithAi(), LibraryScenesView(), InitiativeTracker(), MarkerPanel(), DND5E_SCENE_CONDITIONS, PlacementMode, SceneManager(), useToast() (+14 more)

### Community 37 - "Sheet Header & Stat Cards"
Cohesion: 0.36
Nodes (6): EntitySyncAdapter, useEntitySync(), UseEntitySyncOptions, debounce(), RemoteFetchResult, SyncTombstone

### Community 38 - "Check & Oracle Resolution"
Cohesion: 0.10
Nodes (41): resolveCheck(), BuildEncounterEventsResult, footprintCells(), footprintWithinGrid(), isOracleAnswer(), applyHitPointDelta(), applySceneEvent(), applySceneIntents() (+33 more)

### Community 39 - "Mam3e Data Model & Engine"
Cohesion: 0.50
Nodes (4): clampTrack(), DeathSaves, DeathSavesTracker(), Props

### Community 40 - "Doc Drift Rules"
Cohesion: 0.09
Nodes (38): DOC_DRIFT_MANIFEST, DocDriftRuleType, DocDriftSurface, DocDriftSurfaceKind, capitalizeSupportLevel(), RUNTIME_COPY_RULES, tempDirs, buildDocDriftTruth() (+30 more)

### Community 41 - "NPM Build Scripts"
Cohesion: 0.05
Nodes (43): scripts, bootstrap:node, build, check:bundle-size, check:compute-register, check:compute-register:mutate, check:compute-register:write, check:dead-code (+35 more)

### Community 42 - "Condition Effects by System"
Cohesion: 0.12
Nodes (18): LegalNotices, SceneManager, STORAGE_WARNING_THRESHOLD, CharacterSortOption, SystemSheetRenderer(), Skeleton(), getEditableTarget(), KeyboardShortcut (+10 more)

### Community 43 - "Equipped Armor Section"
Cohesion: 0.06
Nodes (45): EquipArmorInput, EquipEntry, EquippedArmorSection(), EquipShieldInput, Props, D20EquipmentBrowserTabComponent, EquipmentBrowser, Props (+37 more)

### Community 44 - "Spell Browser UI"
Cohesion: 0.33
Nodes (11): SpellBrowserSpell, D20SpellBrowserPanelComponent, SpellBrowser, toSpellBrowserSpell(), Pf2eSpellBrowserPanelComponent, SpellBrowser, toSpellBrowserSpell(), formatAreaOfEffect() (+3 more)

### Community 45 - "Scene Combat Area Effects"
Cohesion: 0.10
Nodes (33): SceneAreaEffectOutcome, SceneAttackOutcome, RoundCombatant, RoundTurnRecord, runCombatRound(), RunRoundInput, toActor(), toTarget() (+25 more)

### Community 46 - "Error Boundary & Auth Context"
Cohesion: 0.13
Nodes (17): AuthContext, AuthContextValue, clearLocalDataForAccountChange(), getLastSyncedUserId(), setLastSyncedUserId(), AuthProvider(), AuthCallback, mockedGetSupabaseClient (+9 more)

### Community 47 - "Encounter Builder Logic"
Cohesion: 0.17
Nodes (15): buildNotice(), FetchTarget, fetchValidated(), HTML_ENTITIES, looksLikeHtml(), main(), normalize(), noticePath (+7 more)

### Community 48 - "Scene Management Hooks"
Cohesion: 0.28
Nodes (16): useScenes(), NOW, clearSceneStorage(), collectValidScenes(), deleteScene(), hydrateScene(), hydrateSceneEvent(), importScenes() (+8 more)

### Community 49 - "Monster Combatant Builder"
Cohesion: 0.08
Nodes (23): CR_XP_TABLE, formatChallengeRating(), MonsterBrowser(), MonsterBrowserProps, Dnd5eMonsterBrowserTabComponent, MonsterBrowser, MonsterBrowserProps, Props (+15 more)

### Community 50 - "D20 Legacy Templates"
Cohesion: 0.22
Nodes (20): availableD20LegacyToggles(), Props, Props, D20LegacyData, D20LegacySpellSlots, getIterativeAttackBonuses(), recoverD20LegacySpellSlot(), resetD20LegacySpellSlots() (+12 more)

### Community 51 - "Campaign Storage & Hooks"
Cohesion: 0.16
Nodes (19): CampaignManager(), useCampaigns(), DebouncedPersistence, IMPORTANT: a begun generation must end in either `persist` or, useDebouncedPersistence(), hostileStorage, CAMPAIGNS_STORAGE_KEY, exportCampaigns() (+11 more)

### Community 52 - "Spell Preparation Logic"
Cohesion: 0.25
Nodes (13): DaggerheartNotesSection(), Props, DaggerheartReferenceLibrarySection(), Props, DaggerheartSelectionOverviewSection(), Props, DaggerheartSheetHeader(), Props (+5 more)

### Community 53 - "Dev Dependencies"
Cohesion: 0.05
Nodes (41): autoprefixer, eslint, eslint-config-prettier, eslint-plugin-react-hooks, eslint-plugin-react-refresh, happy-dom, devDependencies, autoprefixer (+33 more)

### Community 54 - "Character Combatant Builder"
Cohesion: 0.08
Nodes (38): compileEquipmentEffects(), equipStackPolicy(), isMeaningful(), TYPED_STACK_SYSTEMS, compileModifierEffects(), compileModifierSource(), formatSigned(), isNamedBonusType() (+30 more)

### Community 55 - "D20 Class Spellcasting"
Cohesion: 0.08
Nodes (38): react, IllustrateSceneResult, NarrateSceneResult, AppHeaderProps, EncounterPanel(), EncounterPanelProps, formatAverageLevel(), ILLUSTRATION_STYLES (+30 more)

### Community 56 - "SRD Manifest Generator"
Cohesion: 0.19
Nodes (15): InitiativeTrackerProps, CharacterCombatant, BuildDaggerheartAdversaryResult, DaggerheartAdversaryCombatant, RANGE_CELLS, DaggerheartCombatant, Mam3eCombatant, MonsterCombatant (+7 more)

### Community 57 - "Daggerheart Combatant Builders"
Cohesion: 0.06
Nodes (41): Props, CharacterCardProps, CharacterListViewProps, UseSceneEncounterParams, Props, Props, SystemValidator, CombatStatsSources (+33 more)

### Community 58 - "AI Gateway Adapters"
Cohesion: 0.12
Nodes (20): createGeminiAdapter(), IMAGE_TASKS, TASK_SCHEMAS, AI_GATEWAY_SCHEMA_VERSION, aiFailure, AiResponse, AiTask, AiProviderAdapter (+12 more)

### Community 59 - "AI Gateway Contracts"
Cohesion: 0.14
Nodes (26): AI_GATEWAY_TASKS, AiFailureCode, AiParse, AiSuccess, AiUsage, EncounterDraftRequest, IdentifyCreatureRequest, IllustrateSceneRequest (+18 more)

### Community 60 - "System Definitions & Types"
Cohesion: 0.21
Nodes (10): SpellBrowser(), SpellBrowserProps, Dnd5eSpellsTabComponent, Props, SpellBrowser, SpellBrowserProps, Dnd5eAlwaysPreparedSpellSource, Dnd5ePreparedCasterSummary (+2 more)

### Community 61 - "D20 Legacy Spell Slots"
Cohesion: 0.12
Nodes (26): buildEncounterSceneEvents(), buildInitiativeEntries(), buildOccupiedCells(), clampInteger(), compareTokenIds(), EncounterBuilderIssue, EncounterPartyMember, EncounterPlanEntry (+18 more)

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
Cohesion: 0.13
Nodes (14): ErrorBoundary, e(), BrowserCapabilities, checkBrowserCapabilities(), initBrowserCompat(), isBrowserSupported(), showCompatibilityWarning(), ErrorCategory (+6 more)

### Community 66 - "AI Gateway Client"
Cohesion: 0.24
Nodes (9): ToastContext, ToastContextValue, ToastItem, ToastProvider(), VARIANT_ICONS, VARIANT_STYLES, registerToastHandler(), ToastHandler (+1 more)

### Community 67 - "2024 Monster Data Encoder"
Cohesion: 0.16
Nodes (23): ABILITIES, ALIGNMENTS, bucketFor(), classifyImmunityList(), cleanProse(), CR_FRACTIONS, CREATURE_TYPES, DAMAGE_TYPES (+15 more)

### Community 68 - "Character Effects Compilation"
Cohesion: 0.07
Nodes (37): buildCharacterCombatant(), BuildCharacterCombatantResult, normalizeSheet(), readArmorClass(), toMagicBonusItems(), toModifierSources(), buildDaggerheartAdversaryCombatant(), buildMam3eCombatant() (+29 more)

### Community 69 - "TypeScript Config"
Cohesion: 0.07
Nodes (28): ES2020, ./src/*, compilerOptions, allowImportingTsExtensions, baseUrl, forceConsistentCasingInFileNames, isolatedModules, jsx (+20 more)

### Community 70 - "Mam Character Sheet Tabs"
Cohesion: 0.12
Nodes (23): MUTATION_ANCHORS, MutationAnchor, applyDemotion(), DO_MUTATE, DO_WRITE, escapeRe(), evaluateMutation(), evaluateTierA() (+15 more)

### Community 71 - "Monster Stat Block & Status"
Cohesion: 0.20
Nodes (7): CombatStatCard(), Props, Props, SheetHeader(), Dnd5eHeaderSection(), HeaderOption, Props

### Community 72 - "Dice Panel & Mam3e Resolution"
Cohesion: 0.11
Nodes (31): ResolvedCharacterEffects, EffectCondition, AttackResolution, AttackResolutionInput, resolveAttack(), rollD20(), AreaEffectOutcome, AreaEffectResult (+23 more)

### Community 73 - "System Validation Logic"
Cohesion: 0.23
Nodes (22): ABILITY_SCORE_IDS, addIssue(), Dnd5eValidationData, Dnd5eValidationDataModel, featureOptionKey(), isIntegerInRange(), loadValidationData(), SPELL_SLOT_LEVELS (+14 more)

### Community 74 - "Spell Catalog Consistency Tests"
Cohesion: 0.16
Nodes (14): ExpectedSpellIdentity, iconicSpellExpectations, SystemKey, systems, dedupeById(), Identified, indexById(), warnDuplicateId() (+6 more)

### Community 75 - "Dnd5e Resource Loading Hooks"
Cohesion: 0.20
Nodes (13): Dnd5eEquipmentTab, Dnd5eFeatBrowserTab, Dnd5eFeaturesTab, Dnd5eMonsterBrowserTab, Dnd5eSpellsTab, useDnd5eDeferredResource(), UseDnd5eDeferredResourceOptions, useDnd5eSheetResources() (+5 more)

### Community 76 - "Mam Powers & Cost Ledger"
Cohesion: 0.29
Nodes (7): MamArchetypeBrowser(), MamArchetypeBrowserProps, getMam3eSheetState(), GetMam3eSheetStateProps, uniqueNonEmptyStrings(), createEmptyMam3eConditionTrack(), Mam3eArchetype

### Community 77 - "Sync Engine Tests"
Cohesion: 0.11
Nodes (23): SystemEngine, resolveCharacterEffects(), d20LegacyCheckPenalty(), rollD20(), DND35E_CLASS_CATALOG, NOTE: 3.5e class files currently lack full `spellcasting.spellSlots` tables., SKILL_ABILITIES, RFC-003 (+15 more)

### Community 78 - "Dnd5e Feature Options"
Cohesion: 0.09
Nodes (39): Dnd5eFeatureOptionsSection(), Dnd5eFeatureOptionsSectionComponent, FeatureOptionBrowser, FeatureOptionBrowserProps, featureOptionSelectionKey(), Props, FeatureOptionBrowser(), FeatureOptionBrowserProps (+31 more)

### Community 79 - "Document Migrations & Storage"
Cohesion: 0.07
Nodes (47): cloneDocumentsSnapshot(), documentsChanged(), prepareDocumentsWithEngines(), prepareDocumentWithEngine(), useDocuments(), setStoredDocuments(), FeatureOptionRoundtripCase, makeSystem() (+39 more)

### Community 80 - "App Header & Auth UI"
Cohesion: 0.18
Nodes (15): AppHeader(), assertNever(), INITIAL_NAV_STATE, LIBRARY_SEGMENTS, librarySegmentLabel(), NavAction, navReducer(), Overlay (+7 more)

### Community 81 - "Combat Toggles & Conditions"
Cohesion: 0.07
Nodes (40): Doc, useSync(), UseSyncOptions, baseAuthValue, mockedClearQueuedDeletedDocumentIds, mockedClearQueuedSyncSnapshot, mockedDeleteRemoteDocument, mockedFetchRemoteDocuments (+32 more)

### Community 82 - "HP & Spell Slot Trackers"
Cohesion: 0.21
Nodes (9): EncounterDraftCandidate, EncounterDraftData, EncounterDraftSelection, DraftEncounterParams, DraftEncounterResult, GatewayCall, SelectionValidator, RFC-002 (+1 more)

### Community 83 - "Scene Grid View"
Cohesion: 0.18
Nodes (14): daggerheartManifest, dnd35eManifest, dnd5e2014Manifest, dnd5e2024Manifest, manifestForSystem(), SRD_MANIFESTS, mam3eManifest, pf1eManifest (+6 more)

### Community 84 - "Boundary Validation Tests"
Cohesion: 0.26
Nodes (17): NOW, parseImg(), validDocInput(), coerceDate(), coerceObjectives(), coerceQuests(), coerceSessionLog(), coerceStringArray() (+9 more)

### Community 85 - "capabilityScenarios.test.tsx"
Cohesion: 0.24
Nodes (10): DaggerheartDomainCardAutomation(), DaggerheartDomainCardAutomationProps, DaggerheartFeatureListProps, DaggerheartSubclassFeatureGroup(), DaggerheartSubclassFeatureGroupProps, DOMAIN_CARD_AUTOMATION_LABELS, DOMAIN_CARD_AUTOMATION_VARIANTS, humanizeEffectTag() (+2 more)

### Community 86 - "Equipment & Feature Browsers"
Cohesion: 0.07
Nodes (52): getDaggerheartAncestryAdjustments(), clampDaggerheartInventoryQuantity(), createDaggerheartInventoryEntry(), daggerheartInventoryDefinitions, inventoryDefinitionById, inventoryDefinitionByName, isDaggerheartConsumableDefinition(), normalizeDaggerheartCurrency() (+44 more)

### Community 87 - "Pf2e Engine & Constants"
Cohesion: 0.09
Nodes (20): GapLedgerItem, LedgerPhase, LedgerStatus, LedgerTag, LedgerTrack, MASTER_GAP_LEDGER, RFC-003, byPhase (+12 more)

### Community 88 - "Documents Hook & Persistence"
Cohesion: 0.12
Nodes (14): TokenPanel(), TokenPanelProps, ALLEGIANCE_LABEL, ALLEGIANCE_TOKEN_CLASS, buildTokenLabel(), buildTokensByCell(), SceneGridView, SceneGridViewProps (+6 more)

### Community 89 - "Daggerheart Contribution Ledger"
Cohesion: 0.07
Nodes (59): buildDaggerheartCombatant(), RANGE_CELLS, ANCESTRY_ADJUSTMENTS_BY_ID, ancestryByName, classByName, DAGGERHEART_TRAITS, DaggerheartAncestryAdjustments, DaggerheartRange (+51 more)

### Community 90 - "Dnd35e/Pf1e Derived Math"
Cohesion: 0.36
Nodes (7): ThemeToggle(), applyTheme(), getSystemTheme(), isTheme(), Theme, useTheme(), VALID_THEMES

### Community 91 - "Mam Browser Tabs"
Cohesion: 0.11
Nodes (20): Props, Pf2eSpellBrowserPanel, Props, focusPulseSpell, stinkingCloudSpell, teleportSpell, PF2E_DERIVED_TRAITS, PF2E_SCHOOL_TRAITS (+12 more)

### Community 92 - "Pf2e Derived Math"
Cohesion: 0.17
Nodes (17): profTotal(), tierBonus(), CREATURE_XP_BY_LEVEL_DIFF, pf2eAttackModifier(), pf2eCreatureXP(), Pf2eDegree, pf2eDyingAfterRecovery(), pf2eEncounterBudget() (+9 more)

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
Nodes (32): DicePanel(), DicePanelProps, formatBreakdown(), QUICK_ROLLS, DISPOSITION_BADGE, DISPOSITION_LABEL, ReactionHistoryEntry, ReactionPanel() (+24 more)

### Community 97 - "Mam3e Derived Math"
Cohesion: 0.27
Nodes (13): CharacterCard(), makeDoc(), now, renderCard(), asNumber(), asRecord(), asString(), getClassLabel() (+5 more)

### Community 98 - "Doc Drift Tests"
Cohesion: 0.18
Nodes (4): OUTCOME_DIR, RunFn, SystemOutcome, SYSTEMS

### Community 99 - "Spell Catalog Parity Tests"
Cohesion: 0.11
Nodes (5): DND35E_SOURCE_BLOCKED_SPELL_IDS, fieldCoverageBaselines, PF1E_SOURCE_ROWS_WITHOUT_SAVING_THROW, SpellModule, spellModules

### Community 100 - "Pf2e Spell Types & Traits"
Cohesion: 0.31
Nodes (7): GeneratedNpc, generateNpc(), generateNpcName(), NAME_ENDS, NAME_MIDS, NAME_STARTS, catalog

### Community 101 - "Document Storage (IndexedDB)"
Cohesion: 0.14
Nodes (13): CurrencyEditor(), CurrencyEntry, DND_CURRENCIES, Props, InventoryItem, InventoryManager(), InventoryManagerProps, Currency (+5 more)

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
Nodes (47): useCampaignSync(), baseAuthValue, mockedClearQueuedCampaignsSnapshot, mockedClearQueuedDeletedCampaignIds, mockedDeleteRemoteCampaign, mockedFetchRemoteCampaigns, mockedGetQueuedCampaignsSnapshot, mockedGetQueuedDeletedCampaignIds (+39 more)

### Community 106 - "Character Card Presenter"
Cohesion: 0.18
Nodes (17): AbilityScoreGrid(), buildPointBuyDraft(), buildStandardArrayDraft(), clampPointBuyScore(), emptyPointBuyDraft(), emptyStandardArrayDraft(), isStandardArrayComplete(), isValidPointBuyDraft() (+9 more)

### Community 107 - "Oracle Panel & Logic"
Cohesion: 0.06
Nodes (41): CheckPanel(), CheckPanelProps, OUTCOME_BADGE, OUTCOME_LABEL, SKILL_SUGGESTIONS, CombatPanel(), CombatPanelProps, MarkerPanelProps (+33 more)

### Community 108 - "5e Equipment Tab"
Cohesion: 0.14
Nodes (17): CAPABILITY_PHRASE_RULES, CapabilityPhraseRule, COMMAND_RUNTIME_RULES, COUNT_RULES, ExpectedTextRule, HISTORICAL_BANNER_RULES, RuntimeCopyRule, SUPPORT_MATRIX_RULES (+9 more)

### Community 109 - "Scene Reaction Panel"
Cohesion: 0.39
Nodes (4): ServiceWorkerUpdateBanner(), isServiceWorkerSupported(), ServiceWorkerUpdateState, useServiceWorkerUpdate()

### Community 110 - "Document Signature Hashing"
Cohesion: 0.27
Nodes (9): makeScene(), campaignSignatureFor(), sameCampaignSignatures(), sameDocumentSignatures(), sameSceneSignatures(), sameSignatureMultisets(), sceneSignatureFor(), signatureFor() (+1 more)

### Community 111 - "Resource Pool Tracking"
Cohesion: 0.18
Nodes (10): AI_GATEWAY_ENDPOINT, AiRequest, SceneNarrationData, callAiGateway(), isAiEnabled(), NarrateSceneParams, narrateSceneWithAi(), NarrationGatewayCall (+2 more)

### Community 112 - "Bundle Size Check"
Cohesion: 0.10
Nodes (15): appChunk, appChunks, assetsDir, budgets, chunks, dataChunks, distDir, eagerChunkNames (+7 more)

### Community 113 - "AI Prompt Builders"
Cohesion: 0.29
Nodes (12): EncounterDraftPayload, IdentifyCreaturePayload, IllustrateScenePayload, SceneNarrationPayload, buildEncounterDraftPrompt(), buildIdentifyCreaturePrompt(), buildIllustrateScenePrompt(), buildPromptForTask() (+4 more)

### Community 114 - "5e Feat Browser"
Cohesion: 0.08
Nodes (36): ProficiencyListSection(), Props, D20FeatBrowserTabComponent, FeatBrowser, Props, BrowserFeat, Dnd5eFeatBrowserTabComponent, FeatBrowser (+28 more)

### Community 115 - "Project Dependencies"
Cohesion: 0.09
Nodes (23): ai, @ai-sdk/google, class-variance-authority, clsx, lucide-react, dependencies, ai, @ai-sdk/google (+15 more)

### Community 116 - "3.5e Spell Encoder"
Cohesion: 0.10
Nodes (40): critModelForScene(), degreeModelForScene(), resolveSceneAreaEffect(), resolveSceneAttack(), SceneCombatStats, SceneRoundOutcome, RFC-003, BuildDaggerheartCombatantResult (+32 more)

### Community 117 - "AI Encounter Draft Flow"
Cohesion: 0.24
Nodes (8): AiImageInput, IdentifyCreatureData, IdentifyCreatureParams, IdentifyCreatureResult, identifyCreatureWithAi(), IdentifyGatewayCall, RFC-002, params

### Community 118 - "Campaign File Transfer"
Cohesion: 0.11
Nodes (32): toContributionLedger(), D20SkillsTab(), Dnd5eTemplateState, AddEntryInput, buildAlwaysPreparedSpellEntries(), buildArmorClassEntries(), buildDnd5eContributionLedger(), buildFeatAutomationEntries() (+24 more)

### Community 119 - "MAM Archetype Browser"
Cohesion: 0.27
Nodes (11): CLASS_TOKENS, d20srdUrl(), FILES, main(), mapCastingTime(), mapDuration(), mapRange(), normalizeName() (+3 more)

### Community 120 - "PF1e Spell Encoder"
Cohesion: 0.27
Nodes (11): CLASS_COLUMNS, main(), mapCastingTime(), mapDuration(), mapRange(), RFC-4180, normalizeName(), parseCsv() (+3 more)

### Community 122 - "PF2e Archetypes Tab"
Cohesion: 0.12
Nodes (24): collectD20LegacyConditionEffects(), collectDnd5eConditionEffects(), DND5E_CONDITION_EFFECTS, hasDnd5eConditionEffects(), collectPf2eConditionEffects(), ConditionScope, getPf2eConditionStatusPenalty(), highestValue() (+16 more)

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
Cohesion: 0.06
Nodes (44): ABILITIES, DEFENSES, MamAbilitiesTab(), Props, MamAdvantageBrowserTab(), Props, MamArchetypeBrowser, MamArchetypesTab (+36 more)

### Community 129 - "Daggerheart Sheet Automation"
Cohesion: 0.33
Nodes (5): Condition, ConditionPicker(), Props, available, valued

### Community 130 - "d20LegacySpellcasting.ts"
Cohesion: 0.12
Nodes (23): D20ClassesSection(), D20LegacyClassLevel, Props, renderClassOptions(), d20BonusSpells(), buildD20LegacySpellSlotTotals(), countAdvancementLevels(), D20_DOMAIN_CLASS_IDS (+15 more)

### Community 131 - "Retry With Backoff"
Cohesion: 0.31
Nodes (7): computeBackoffMs(), isRetryableError(), NON_RETRYABLE_FRAGMENTS, PROD_DEFAULTS, RetryOptions, sleep(), TEST_DEFAULTS

### Community 132 - "2024 Spell Encoder"
Cohesion: 0.39
Nodes (8): main(), mapCastingTime(), mapDuration(), mapRange(), normalizeName(), SCHOOLS, slug(), ts()

### Community 133 - "MAM Power Browser"
Cohesion: 0.40
Nodes (5): availablePf2eToggles(), PF2E_CONDITIONS, PF2E_VALUED_CONDITIONS, Pf2eFeatsConditionsTab(), Props

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
Cohesion: 0.40
Nodes (5): UseD20LegacyTemplateHandlersProps, Pf2eHeader(), Props, UsePf2eTemplateHandlersProps, CharacterClass

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
Cohesion: 0.33
Nodes (12): clampCount(), createPool(), isExhausted(), isFull(), poolFromRemaining(), remainingOf(), remainingShape(), reset() (+4 more)

### Community 155 - "5e Movement Rules"
Cohesion: 0.60
Nodes (4): dnd5eCarryingCapacity(), dnd5eHighJump(), dnd5eLongJump(), dnd5ePushDragLift()

### Community 157 - "MAM Power Modifier Browser"
Cohesion: 0.60
Nodes (3): formatModifierCost(), MamPowerModifierBrowser(), MamPowerModifierBrowserProps

### Community 160 - "capabilityScenarios.test.tsx"
Cohesion: 0.14
Nodes (17): DocDriftTruth, NewCharacterDialog(), Props, UseDaggerheartSheetResourcesProps, SYSTEM_IDS, Character, FeatureUses, SpellcastingClass (+9 more)

### Community 161 - "PF2e Backgrounds Data"
Cohesion: 0.50
Nodes (3): Pf2eBackgroundChoice, Pf2eBackgroundDefinition, Pf2eBackgroundFeatGrant

### Community 179 - "featTemplate.test.ts"
Cohesion: 0.43
Nodes (4): clampExhaustion(), Props, RestControls(), D20LegacySheet()

### Community 183 - "loadEquipmentForSystem"
Cohesion: 0.50
Nodes (3): Answer, Outcome, Q: where are pending debounced document saves flushed to localStorage on page hide or unload (persistence flush)

## Knowledge Gaps
- **1122 isolated node(s):** `browser`, `es2021`, `node`, `eslint:recommended`, `plugin:@typescript-eslint/recommended` (+1117 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **18 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `CharacterDocument` connect `Daggerheart Combatant Builders` to `Toast Notifications`, `Dnd5e Sheets & E2E Tests`, `Dnd5e Equipment & Features UI`, `Dnd5e Background Templates`, `Dnd5e2024 Engine & Hit Dice`, `Daggerheart Engine`, `MAM Power Browser`, `Scene Combat Resolution`, `Dnd5e Class Templates`, `pf2eConditions.ts`, `Dnd5e Activity Definitions`, `Monster & NPC Generator`, `Dnd5e Feat Templates`, `D20 Combat Controls`, `Combat & Recap Panels`, `D20 Legacy System Engines`, `Dnd35e Saves & Data Model`, `System Registry & Renderer`, `Campaign Sync Hooks`, `Daggerheart Inventory`, `Pf2e Character Templates`, `Dnd5e Feature List Sections`, `Encounter & Initiative Panels`, `Class Enhancement & Headers`, `Pf2e Sheet Tabs`, `AI Encounter Drafting`, `Document Sync Engine`, `Condition Effects by System`, `Equipped Armor Section`, `Monster Combatant Builder`, `D20 Legacy Templates`, `featTemplate.test.ts`, `Spell Preparation Logic`, `D20 Class Spellcasting`, `D20 Legacy Spell Slots`, `Character Effects Compilation`, `System Validation Logic`, `Sync Engine Tests`, `Dnd5e Feature Options`, `Document Migrations & Storage`, `Combat Toggles & Conditions`, `Boundary Validation Tests`, `Equipment & Feature Browsers`, `Documents Hook & Persistence`, `Daggerheart Contribution Ledger`, `Pf2e Derived Math`, `Mam3e Derived Math`, `AI Creature Identification`, `Document Signature Hashing`, `Campaign File Transfer`?**
  _High betweenness centrality (0.134) - this node is a cross-community bridge._
- **Why does `react` connect `D20 Class Spellcasting` to `Sheet Resource Loading Hooks`, `Daggerheart Sheet Automation`, `Dnd5e Equipment & Features UI`, `d20LegacySpellcasting.ts`, `Toast Notifications`, `Daggerheart Engine`, `MAM Power Browser`, `Tabs UI Component`, `Dnd5e Sheets & E2E Tests`, `Dnd5e Class Templates`, `Scene Check Panel`, `pf2eConditions.ts`, `Monster & NPC Generator`, `Dnd5e Feat Templates`, `Game System Selector`, `Combat & Recap Panels`, `Daggerheart Data Model`, `System Registry & Renderer`, `Equipment Browser Component`, `Feat Browser Component`, `Campaign Sync Hooks`, `Pf2e Character Templates`, `contributionLedger.ts`, `Dnd5e Feature List Sections`, `MAM Power Modifier Browser`, `Class Enhancement & Headers`, `capabilityScenarios.test.tsx`, `AI Encounter Drafting`, `Quest & Session Log UI`, `Currency & Inventory Editors`, `Document Sync Engine`, `Sheet Header & Stat Cards`, `Pf2e Sheet Tabs`, `Mam3e Data Model & Engine`, `Condition Effects by System`, `Equipped Armor Section`, `Spell Browser UI`, `Error Boundary & Auth Context`, `Scene Management Hooks`, `Monster Combatant Builder`, `D20 Legacy Templates`, `featTemplate.test.ts`, `Campaign Storage & Hooks`, `Spell Preparation Logic`, `Daggerheart Combatant Builders`, `System Definitions & Types`, `ESLint Config`, `Spells Tab Components`, `AI Gateway Client`, `Monster Stat Block & Status`, `Dnd5e Resource Loading Hooks`, `Mam Powers & Cost Ledger`, `Dnd5e Feature Options`, `Document Migrations & Storage`, `App Header & Auth UI`, `Combat Toggles & Conditions`, `Equipment & Feature Browsers`, `Documents Hook & Persistence`, `Dnd35e/Pf1e Derived Math`, `Skills Tab & Combat Math`, `Document Storage (IndexedDB)`, `AI Creature Identification`, `Character Card Presenter`, `Oracle Panel & Logic`, `Scene Reaction Panel`, `5e Feat Browser`, `Campaign File Transfer`?**
  _High betweenness centrality (0.114) - this node is a cross-community bridge._
- **Why does `GameSystemId` connect `capabilityScenarios.test.tsx` to `Sheet Resource Loading Hooks`, `Toast Notifications`, `d20LegacySpellcasting.ts`, `Dnd5e Equipment & Features UI`, `Dnd5e2024 Engine & Hit Dice`, `Scene Combat Resolution`, `Dnd5e Class Templates`, `pf2eConditions.ts`, `Monster & NPC Generator`, `Dnd5e Feat Templates`, `Game System Selector`, `Dnd35e Saves & Data Model`, `Roadmap Metrics Generator`, `Class Enhancement & Headers`, `Pf2e Sheet Tabs`, `AI Encounter Drafting`, `Doc Drift Rules`, `Condition Effects by System`, `D20 Legacy Templates`, `Spell Preparation Logic`, `Character Combatant Builder`, `D20 Class Spellcasting`, `SRD Manifest Generator`, `Daggerheart Combatant Builders`, `SRD Coverage Script`, `Character Effects Compilation`, `Dnd5e Resource Loading Hooks`, `5e Equipment Tab`, `5e Feat Browser`?**
  _High betweenness centrality (0.056) - this node is a cross-community bridge._
- **What connects `browser`, `es2021`, `node` to the rest of the system?**
  _1122 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Sheet Resource Loading Hooks` be split into smaller, more focused modules?**
  _Cohesion score 0.050314465408805034 - nodes in this community are weakly interconnected._
- **Should `Dnd5e Sheets & E2E Tests` be split into smaller, more focused modules?**
  _Cohesion score 0.11693548387096774 - nodes in this community are weakly interconnected._
- **Should `Dnd5e Equipment & Features UI` be split into smaller, more focused modules?**
  _Cohesion score 0.048539518900343644 - nodes in this community are weakly interconnected._