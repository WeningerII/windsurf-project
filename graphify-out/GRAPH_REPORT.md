# Graph Report - wf_98a0ff1a-e39-2  (2026-07-24)

## Corpus Check
- 899 files · ~643,569 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 5666 nodes · 16380 edges · 212 communities (192 shown, 20 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 130 edges (avg confidence: 0.71)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `2db29da7`
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
- Dnd5eEquipmentTab.tsx
- TS Netlify Config
- Generated Docs Check
- Playwright Browser Check
- Repo Hygiene Check
- Equipment Browser Component
- ServiceWorkerUpdateBanner.tsx
- Dnd5eEquipmentTab.tsx
- 5e Movement Rules
- pf2eEngineMath.test.ts
- utils/validation.ts
- MAM Complication Browser
- MamArchetypesTab.tsx
- PF2e Backgrounds Data
- Host Size Budget Test
- Vitest Type Defs
- MAM Complications Data
- MAM Power Modifiers Data
- Vitest Coverage Config
- documentSignature.ts
- daggerheartTemplate.ts
- DaggerheartSheetController
- useEntitySync.ts
- syncTombstones.ts
- loadEquipmentForSystem
- MamArchetypesTab.tsx
- eslint-plugin-react
- fake-indexeddb
- featTemplate.test.ts
- MamComplicationBrowser.tsx
- index.ts
- retryWithBackoff
- daggerheart-engine.test.ts
- @types/react
- @types/react-dom
- imageInput.ts
- @vitest/coverage-v8
- @playwright/test
- @testing-library/user-event
- @typescript-eslint/eslint-plugin
- @typescript-eslint/parser
- eslint
- globals
- knip
- tailwindcss
- tsx
- typescript
- typescript-eslint
- vitest

## God Nodes (most connected - your core abstractions)
1. `CharacterDocument` - 300 edges
2. `SystemDataModel` - 157 edges
3. `GameSystemId` - 97 edges
4. `SystemRegistry` - 76 edges
5. `EffectInstance` - 70 edges
6. `makeEffectId()` - 62 edges
7. `abilityMod()` - 61 edges
8. `Pf2eDataModel` - 57 edges
9. `Dnd5eDataModel` - 56 edges
10. `Mam3eDataModel` - 48 edges

## Surprising Connections (you probably didn't know these)
- `AbilityScoreGrid()` --indirect_call--> `mod()`  [INFERRED]
  src/components/sheet/AbilityScoreGrid.tsx → scripts/encode-35e-monsters.mjs
- `D20AbilitiesTab()` --indirect_call--> `mod()`  [INFERRED]
  src/systems/d20-legacy/components/D20AbilitiesTab.tsx → scripts/encode-35e-monsters.mjs
- `Pf2eAbilitiesTab()` --indirect_call--> `mod()`  [INFERRED]
  src/systems/pf2e/components/Pf2eAbilitiesTab.tsx → scripts/encode-35e-monsters.mjs
- `inferAbilityChoiceRequirement()` --indirect_call--> `ability()`  [INFERRED]
  src/systems/dnd5e/shared/featTemplate.ts → scripts/encode-pf1e-monsters.mjs
- `getDnd5eSpellcastingClassSummaries()` --indirect_call--> `ability()`  [INFERRED]
  src/systems/dnd5e/shared/spellPreparation.ts → scripts/encode-pf1e-monsters.mjs

## Import Cycles
- None detected.

## Communities (212 total, 20 thin omitted)

### Community 0 - "Sheet Resource Loading Hooks"
Cohesion: 0.05
Nodes (101): ManifestCategory, ancestryPool(), backgroundPool(), classPool(), loadCharacterDraftPools(), NamedEntity, toCandidates(), RFC-002 (+93 more)

### Community 1 - "Dnd5e Sheets & E2E Tests"
Cohesion: 0.13
Nodes (25): registryMeta, SupportMeta, {
  systemRegistryGetMock,
  loadAdvantagesForSystemMock,
  loadArchetypesForSystemMock,
  loadBackgroundsForSystemMock,
  loadClassesForSystemMock,
  loadComplicationsForSystemMock,
  loadDaggerheartAncestriesForSystemMock,
  loadDaggerheartClassesForSystemMock,
  loadDaggerheartCommunitiesForSystemMock,
  loadDaggerheartConsumablesForSystemMock,
  loadDaggerheartDomainCardsForSystemMock,
  loadDaggerheartDomainsForSystemMock,
  loadDaggerheartArmorForSystemMock,
  loadDaggerheartLootForSystemMock,
  loadDaggerheartWeaponsForSystemMock,
  loadEquipmentForSystemMock,
  loadFeatsForSystemMock,
  loadFeatureOptionsForSystemMock,
  loadMam3eArchetypesForSystemMock,
  loadMonstersForSystemMock,
  loadPf2eBackgroundsForSystemMock,
  loadPowerModifiersForSystemMock,
  loadSpeciesForSystemMock,
  loadSpellsForSystemMock,
  loadTraitsForSystemMock,
}, SystemContentCategoryId, SystemContentReachability, SystemContentSummary, SystemSupportLevel, clearSystemCatalogSummaryCache() (+17 more)

### Community 2 - "Dnd5e Equipment & Features UI"
Cohesion: 0.12
Nodes (17): DamageHealControl(), DamageHealControlProps, clampTrack(), DeathSaves, DeathSavesTracker(), Props, HitDiceTracker(), Props (+9 more)

### Community 3 - "Dnd5e Background Templates"
Cohesion: 0.09
Nodes (39): ABILITY_NAME_TO_ID, ABILITY_OPTIONS, abilityAutomationFromSelections(), aggregateFeatAutomation(), applyFeatSkillSources(), buildAutomatedFeat(), ChoiceCategory, choiceRequirementFromGrant() (+31 more)

### Community 4 - "Dnd5e2024 Engine & Hit Dice"
Cohesion: 0.04
Nodes (44): HIT_DICE, hitDieSize(), hitDieString(), collectDnd5eConditionEffects(), conditionImposesDisadvantage(), Dnd5e2024Engine, hasAlertFeat(), totalCharacterLevel() (+36 more)

### Community 5 - "Daggerheart Engine"
Cohesion: 0.08
Nodes (49): applyDnd5eClassTemplate(), applyDnd5eSubclassTemplate(), assertMulticlassRequirements(), ATTRIBUTE_NAME_TO_ID, buildChoiceSlots(), buildDerivedProficiencies(), buildSpellcastingState(), canSelectSubclass() (+41 more)

### Community 6 - "3.5e Monster Data Encoder"
Cohesion: 0.06
Nodes (57): ALIGNMENTS, DICE_PROGRESSIONS, main(), mapAlignment(), mod(), MONSTER_SIZE, normalizeName(), OLIMOT_FILES (+49 more)

### Community 7 - "Tabs UI Component"
Cohesion: 0.18
Nodes (13): TabsContent, TabsContentProps, TabsContext, TabsContextValue, TabsList, TabsProps, TabsTrigger, TabsTriggerProps (+5 more)

### Community 8 - "Node Runtime Bootstrap"
Cohesion: 0.09
Nodes (47): main(), runBootstrapNodeInstall(), getPinnedCommandArgs(), main(), runPinnedNpmCommand(), formatRuntimeDoctorReport(), main(), readWorkflowPinSource() (+39 more)

### Community 9 - "Scene Combat Resolution"
Cohesion: 0.06
Nodes (43): buildScene(), appendSceneEvent(), applySceneIntents(), createSceneDocument(), foldSceneEvents(), resolveSceneAction(), SceneActionOptions, encounterMonsterFixtures (+35 more)

### Community 10 - "Dnd5e Class Templates"
Cohesion: 0.17
Nodes (21): MamPowersTab(), ModifierColumn(), ModifierColumnProps, buildMam3eContributionLedger(), buildMam3ePowerCostEffects(), buildMam3ePowerCostLedgerEntries(), createPowerCostEffect(), ledgerId() (+13 more)

### Community 11 - "System Compute Registers"
Cohesion: 0.17
Nodes (15): daggerheartComputeRegister, dnd35eComputeRegister, dnd5e2014ComputeRegister, dnd5e2024ComputeRegister, COMPUTE_REGISTERS, registerForSystem(), mam3eComputeRegister, pf1eComputeRegister (+7 more)

### Community 12 - "Scene Check Panel"
Cohesion: 0.18
Nodes (12): BrowserCapabilities, checkBrowserCapabilities(), initBrowserCompat(), isBrowserSupported(), showCompatibilityWarning(), ErrorCategory, ErrorLog, ErrorLogger (+4 more)

### Community 13 - "Dnd5e Activity Definitions"
Cohesion: 0.07
Nodes (36): Props, SLOT_LEVELS, SlotKey, SpellSlotTracker(), buildDefenseStyleActivity(), buildDivineSmiteActivities(), buildDivineSmiteActivity(), buildDnd5eActivityDefinitions() (+28 more)

### Community 14 - "Monster & NPC Generator"
Cohesion: 0.06
Nodes (46): DragProvider, DragRoot(), isSceneDragEnabled(), FEATURE_FLAGS, FeatureFlag, FeatureFlagDefinition, isFeatureEnabled(), RingBuffer (+38 more)

### Community 15 - "Dnd5e Feat Templates"
Cohesion: 0.20
Nodes (17): D20SkillsTab(), Props, buildArmorClassEntries(), Skill, daggerheartDamageDiceCount(), DND35E_SYNERGY_SOURCES, dnd35eMaxSkillRanks(), dnd35eSkillSynergyTotal() (+9 more)

### Community 16 - "App Shell & Layout"
Cohesion: 0.11
Nodes (28): UseDnd5eTemplateHandlersProps, Pf2eArchetypesTab(), Props, Pf2eHeader(), Props, Pf2eDataModel, getPf2eSheetChoiceState(), GetPf2eSheetChoiceStateProps (+20 more)

### Community 17 - "D20 Combat Controls"
Cohesion: 0.11
Nodes (22): casterTypes, classResourcesNeeded, classTags, ABILITY_TOKEN_MAP, collectAlwaysPreparedByLevelSources(), collectAlwaysPreparedGrantSources(), evaluatePreparedCasterFormula(), getDnd5eAlwaysPreparedSpellIds() (+14 more)

### Community 18 - "Game System Selector"
Cohesion: 0.05
Nodes (41): DragContext, NO_HANDLERS, useDragContext(), useDragSource(), DragLayer, DragLayerProps, DragProvider(), toSample() (+33 more)

### Community 19 - "Combat & Recap Panels"
Cohesion: 0.13
Nodes (27): SURFACES, SurfaceStage(), SurfaceStageProps, assertNever(), INITIAL_NAV_STATE, LIBRARY_SEGMENTS, LibrarySegment, librarySegmentLabel() (+19 more)

### Community 20 - "D20 Legacy System Engines"
Cohesion: 0.17
Nodes (14): mam3eAfflictionDC(), mam3eAttackDC(), mam3eAttackHits(), mam3eCriticalDC(), mam3eDamageResistanceDC(), mam3eDegreesOfFailure(), mam3eDegreesOfSuccess(), mam3eEquipmentPoints() (+6 more)

### Community 21 - "Dnd35e Saves & Data Model"
Cohesion: 0.04
Nodes (60): D20_SIZE_MOD, d20LegacyCheckPenalty(), rollD20(), createDefaultDnd35eData(), Dnd35eClassLevel, DND35E_CLASS_CATALOG, Dnd35eEngine, NOTE: 3.5e class files currently lack full `spellcasting.spellSlots` tables. (+52 more)

### Community 22 - "Daggerheart Data Model"
Cohesion: 0.08
Nodes (30): SystemEngine, contextWithConditionIds(), resolveCharacterEffects(), ArmorEquipItem, compute5eAC(), computeD20LegacyAC(), computePf2eAC(), dnd5eArmorDexContribution() (+22 more)

### Community 23 - "System Registry & Renderer"
Cohesion: 0.04
Nodes (94): MakeGameCharacter, Props, CharacterCardProps, CharacterListViewProps, Props, SystemSheetRenderer(), Tabs, useSheetDispatchRegister() (+86 more)

### Community 24 - "Game Rules & Proficiencies"
Cohesion: 0.08
Nodes (33): ArmorProficiency, ArmorProficiencyType, ArtisanToolProficiency, GamingSetProficiency, isValidArmorProficiency(), isValidSkillProficiency(), isValidToolProficiency(), isValidWeaponProficiency() (+25 more)

### Community 25 - "Campaign Sync Hooks"
Cohesion: 0.14
Nodes (33): footprintWithinGrid(), isOracleAnswer(), isOracleOdds(), resolveOracle(), applyHitPointDelta(), applySceneEvent(), assertNever(), buildEventFromIntent() (+25 more)

### Community 26 - "Daggerheart Inventory"
Cohesion: 0.10
Nodes (33): clampDaggerheartInventoryQuantity(), daggerheartInventoryDefinitions, findDaggerheartInventoryDefinitionByName(), getDaggerheartInventoryDefinition(), inventoryDefinitionById, inventoryDefinitionByName, normalizeDaggerheartCurrency(), normalizeInteger() (+25 more)

### Community 27 - "Pf2e Character Templates"
Cohesion: 0.12
Nodes (40): createPf2eCreationPlan(), abilityBoostValue(), ancestryFeatures(), applyAbilityAdjustments(), applyPf2eAncestryTemplate(), applyPf2eArchetypeTemplate(), applyPf2eBackgroundTemplate(), applyPf2eClassTemplate() (+32 more)

### Community 28 - "Roadmap Metrics Generator"
Cohesion: 0.12
Nodes (27): applyRepoResidentOverrides(), buildComputeCompletion(), buildContentCompletion(), buildMarkdownReport(), ComputeCompletionRow, computeMetrics(), ContentCompletionRow, createEmptyCategoryCounts() (+19 more)

### Community 29 - "Dnd5e Feature List Sections"
Cohesion: 0.08
Nodes (38): DiceRollButton(), DiceRollButtonProps, Props, SheetHeader(), RollResult, ABILITIES, D20AbilitiesTab(), Props (+30 more)

### Community 30 - "Encounter & Initiative Panels"
Cohesion: 0.17
Nodes (22): appendInventoryFromBackground(), applyDnd5eBackgroundTemplate(), BackgroundChoiceSlot, BackgroundChoiceValue, backgroundDerivedState(), COMMON_LANGUAGE_OPTIONS, Dnd5eBackgroundTemplateSelections, Dnd5eLikeDataModel (+14 more)

### Community 31 - "Class Enhancement & Headers"
Cohesion: 0.06
Nodes (53): SheetDispatch, feat, item, monster, spell, DockResources, EMPTY, useDockResources() (+45 more)

### Community 32 - "Pf2e Sheet Tabs"
Cohesion: 0.09
Nodes (29): buildCharacterCombatant(), BuildCharacterCombatantResult, CharacterCombatant, normalizeSheet(), readArmorClass(), toMagicBonusItems(), toModifierSources(), AttackEconomy (+21 more)

### Community 33 - "AI Encounter Drafting"
Cohesion: 0.06
Nodes (59): LegalActionCost, LegalActionDescriptor, LegalActionsContext, addAttackOfOpportunity(), addAttacks(), addCombatActions(), addFullAttack(), addSpellcasting() (+51 more)

### Community 34 - "Quest & Session Log UI"
Cohesion: 0.11
Nodes (33): Props, QuestList(), STATUS_BADGE, STATUS_OPTIONS, DATE_FORMAT, Props, SessionLog(), UseCampaignSyncOptions (+25 more)

### Community 35 - "Currency & Inventory Editors"
Cohesion: 0.06
Nodes (46): CharacterDraftApplier, collectUnknownIdIssues(), DocumentValidator, DraftCharacterParams, DraftCharacterResult, draftCharacterWithAi(), GatewayCall, POOL_LIST_FIELDS (+38 more)

### Community 36 - "Document Sync Engine"
Cohesion: 0.09
Nodes (39): SceneAreaEffectOutcome, AttackResolution, AttackResolutionInput, resolveAttack(), rollD20(), AreaEffectInput, AreaEffectOutcome, AreaEffectResult (+31 more)

### Community 37 - "Sheet Header & Stat Cards"
Cohesion: 0.05
Nodes (70): CharacterEffectInputs, resolveCharacterLedger(), ResolvedCharacterEffects, compileBaseArmorClassEffects(), compileEquipmentEffects(), equipStackPolicy(), isMeaningful(), MagicBonusItem (+62 more)

### Community 38 - "Check & Oracle Resolution"
Cohesion: 0.23
Nodes (9): Badge(), BadgeProps, badgeVariants, isDaggerheartConsumableDefinition(), DaggerheartInventorySection(), Props, Dnd5eWeaponMasteriesTab(), Props (+1 more)

### Community 39 - "Mam3e Data Model & Engine"
Cohesion: 0.08
Nodes (37): dnd35eAbilityIncreases(), dnd35eConcentrationDCDamage(), dnd35eConcentrationDCDefensive(), dnd35eFeatsFromLevel(), dnd35eHpState, dnd35eLevelForXp(), dnd35eTriggersMassiveDamage(), dnd35eXpForLevel() (+29 more)

### Community 40 - "Doc Drift Rules"
Cohesion: 0.06
Nodes (55): DOC_DRIFT_MANIFEST, DocDriftRuleType, DocDriftSurface, DocDriftSurfaceKind, CAPABILITY_PHRASE_RULES, CapabilityPhraseRule, capitalizeSupportLevel(), COMMAND_RUNTIME_RULES (+47 more)

### Community 41 - "NPM Build Scripts"
Cohesion: 0.04
Nodes (45): scripts, bootstrap:node, build, check:bundle-size, check:compute-register, check:compute-register:mutate, check:compute-register:write, check:dead-code (+37 more)

### Community 42 - "Condition Effects by System"
Cohesion: 0.06
Nodes (50): EquippedItemsSection(), Props, SLOT_LABELS, SLOT_ORDER, createDefaultDnd5e2024Data(), Dnd5e2024DataModel, Dnd5e2024TemplateState, Dnd5e2024SystemDef (+42 more)

### Community 43 - "Equipped Armor Section"
Cohesion: 0.06
Nodes (44): EquipArmorInput, EquipEntry, EquippedArmorSection(), EquipShieldInput, Props, D20EquipmentBrowserTabComponent, EquipmentBrowser, Props (+36 more)

### Community 44 - "Spell Browser UI"
Cohesion: 0.06
Nodes (48): DEFAULT_LABELS, SpellBrowser(), SpellBrowserLabels, SpellBrowserProps, SpellBrowserSpell, BrowserFeat, Dock(), DockPanel() (+40 more)

### Community 45 - "Scene Combat Area Effects"
Cohesion: 0.12
Nodes (20): LegalNotices(), LegalAttributions, LegalLicenseRef, ProvenanceStatus, SystemAttribution, buildNotice(), FetchTarget, fetchValidated() (+12 more)

### Community 46 - "Error Boundary & Auth Context"
Cohesion: 0.13
Nodes (18): AuthContext, clearLocalDataForAccountChange(), getLastSyncedUserId(), setLastSyncedUserId(), AuthProvider(), useAuth(), AuthCallback, mockedGetSupabaseClient (+10 more)

### Community 47 - "Encounter Builder Logic"
Cohesion: 0.13
Nodes (32): createD20LegacyCreationPlan(), applyAbilityAdjustments(), applyD20LegacyClassTemplate(), applyD20LegacyRaceTemplate(), buildClassSkills(), classFeaturesUpToLevel(), classSkillOptions(), collectClassFeatureSignatures() (+24 more)

### Community 48 - "Scene Management Hooks"
Cohesion: 0.12
Nodes (39): useScenes(), makeAsset(), makeSceneWithMap(), NOW, clearMapAssetStorage(), createMapAsset(), CreateMapAssetResult, deleteMapAsset() (+31 more)

### Community 49 - "Monster Combatant Builder"
Cohesion: 0.06
Nodes (39): NarrateSceneResult, CheckPanel(), CheckPanelProps, DEFAULT_SUGGESTIONS, DND5E_SKILLS, OUTCOME_BADGE, OUTCOME_LABEL, SKILL_SUGGESTIONS_BY_SYSTEM (+31 more)

### Community 50 - "D20 Legacy Templates"
Cohesion: 0.14
Nodes (37): getDaggerheartShortRestRecovery(), createDaggerheartInventoryEntry(), clearAllStress(), clearStress(), prepareGainHope(), repairAllArmor(), repairArmor(), tendToAllWounds() (+29 more)

### Community 51 - "Campaign Storage & Hooks"
Cohesion: 0.22
Nodes (15): useCampaigns(), hostileStorage, CAMPAIGNS_STORAGE_KEY, clearCampaignStorage(), importCampaigns(), importCampaignsWithReport(), loadCampaigns(), parseCampaignField() (+7 more)

### Community 52 - "Spell Preparation Logic"
Cohesion: 0.09
Nodes (36): MARKER_EFFECT_OPTIONS, terrainEffectsForPreset(), acceptGridGeometryProposal(), BOX_KINDS, CellRect, COVER_PRESETS, deriveGridFromRegistration(), GridBoxKind (+28 more)

### Community 53 - "Dev Dependencies"
Cohesion: 0.05
Nodes (43): autoprefixer, eslint-config-prettier, @eslint/js, eslint-plugin-react, eslint-plugin-react-refresh, fake-indexeddb, happy-dom, devDependencies (+35 more)

### Community 54 - "Character Combatant Builder"
Cohesion: 0.08
Nodes (23): createDefaultPf2eData(), PF2E_ARCHETYPE_DEDICATION_GRANTS, Pf2eClassLevel, Pf2eDedicationProficiencyCategory, Pf2eDedicationProficiencyGrant, Pf2eFeat, RFC-003, Pf2eSystemDef (+15 more)

### Community 55 - "D20 Class Spellcasting"
Cohesion: 0.14
Nodes (25): buildMam3eCreatorData(), createDefaultMam3eDefenseRanks(), DERIVATION_EPOCH, deriveMam3eCreatorTotals(), Mam3eAbilities, Mam3eAbilityKey, Mam3eCreatorTotals, Mam3eDefenseRanks (+17 more)

### Community 56 - "SRD Manifest Generator"
Cohesion: 0.13
Nodes (32): getBackgroundFixedToolProficiencies(), getBackgroundLanguageOptions(), getBackgroundToolChoiceSlots(), getDnd5eTemplateChoiceState(), applyDnd5eSpeciesTemplate(), buildAbilityChoiceSlots(), buildSpeciesFeatures(), choiceAbilityBonuses() (+24 more)

### Community 57 - "Daggerheart Combatant Builders"
Cohesion: 0.13
Nodes (21): D20ClassesSection(), D20LegacyClassLevel, Props, renderClassOptions(), buildD20LegacySpellSlotTotals(), countAdvancementLevels(), D20_DOMAIN_CLASS_IDS, D20_FALLBACK_CASTING_ABILITIES (+13 more)

### Community 58 - "AI Gateway Adapters"
Cohesion: 0.07
Nodes (37): AiFailureCode, AiResponse, AiTask, AiTaskClass, GatewayContext, GatewayTimeoutError, handleAiRequest(), latencyBudgetFor() (+29 more)

### Community 59 - "AI Gateway Contracts"
Cohesion: 0.12
Nodes (33): AI_GATEWAY_TASKS, AI_TASK_CLASS, AiParse, AiSuccess, AiUsage, CharacterDraftRequest, EncounterDraftRequest, IdentifyCreatureRequest (+25 more)

### Community 60 - "System Definitions & Types"
Cohesion: 0.13
Nodes (12): GeneratedImageData, SceneNarrationData, TaskGatewayCall, IllustrateGatewayCall, IllustrateSceneParams, illustrateSceneWithAi(), RFC-002, NarrateSceneParams (+4 more)

### Community 61 - "D20 Legacy Spell Slots"
Cohesion: 0.13
Nodes (16): collectMam3eConditionEffects(), mam3eToughnessPenalty(), Pf2eConditionLike, MamConditionsTab(), Props, Mam3eConditionTrack, applyMam3eToughnessFailure(), Mam3eEngine (+8 more)

### Community 62 - "SRD Coverage Script"
Cohesion: 0.08
Nodes (44): ABSENT, AbsentCategory, cats5e2014, cats5e2024, CoverageTarget, csvRows(), extractJsArray(), extractNameValues() (+36 more)

### Community 63 - "ESLint Config"
Cohesion: 0.10
Nodes (29): RoundCombatant, runCombatRound(), RunRoundInput, toActor(), toTarget(), RFC-003, executeTacticalTurn(), TacticalTurnInput (+21 more)

### Community 64 - "Spells Tab Components"
Cohesion: 0.05
Nodes (54): SheetAddHandlers, SheetDispatchRegistry, SheetDispatchRegistryContext, SheetDispatchState, SheetDispatchStateContext, useSheetDispatch(), SheetDispatchProvider(), Consumer() (+46 more)

### Community 65 - "Browser Compat & Error Logging"
Cohesion: 0.14
Nodes (20): Props, State, LegalNoticesProps, licenseTexts, LibraryBestiaryView(), LoadState, MonsterBrowser, MonsterBrowserProps (+12 more)

### Community 66 - "AI Gateway Client"
Cohesion: 0.18
Nodes (17): AbilityScoreGrid(), buildPointBuyDraft(), buildStandardArrayDraft(), clampPointBuyScore(), emptyPointBuyDraft(), emptyStandardArrayDraft(), isStandardArrayComplete(), isValidPointBuyDraft() (+9 more)

### Community 67 - "2024 Monster Data Encoder"
Cohesion: 0.16
Nodes (23): ABILITIES, ALIGNMENTS, bucketFor(), classifyImmunityList(), cleanProse(), CR_FRACTIONS, CREATURE_TYPES, DAMAGE_TYPES (+15 more)

### Community 68 - "Character Effects Compilation"
Cohesion: 0.08
Nodes (23): createDefaultDaggerheartData(), DaggerheartDataModel, DaggerheartSystemDef, DAGGERHEART_DERIVED_QUANTITIES, UseDaggerheartMutationHandlersProps, TEST_DATE, dhDoc(), createWarrior() (+15 more)

### Community 69 - "TypeScript Config"
Cohesion: 0.07
Nodes (27): ES2020, src, compilerOptions, allowImportingTsExtensions, baseUrl, forceConsistentCasingInFileNames, isolatedModules, jsx (+19 more)

### Community 70 - "Mam Character Sheet Tabs"
Cohesion: 0.12
Nodes (23): MUTATION_ANCHORS, MutationAnchor, applyDemotion(), DO_MUTATE, DO_WRITE, escapeRe(), evaluateMutation(), evaluateTierA() (+15 more)

### Community 71 - "Monster Stat Block & Status"
Cohesion: 0.22
Nodes (11): Props, DaggerheartDomainCardAutomation(), DaggerheartDomainCardAutomationProps, DaggerheartFeatureList(), DaggerheartFeatureListProps, DaggerheartSubclassFeatureGroup(), DaggerheartSubclassFeatureGroupProps, DOMAIN_CARD_AUTOMATION_LABELS (+3 more)

### Community 72 - "Dice Panel & Mam3e Resolution"
Cohesion: 0.08
Nodes (27): counterStore, latencyBudgetsFromEnv(), positiveEnv(), rateLimiterFromEnv(), sessionBudgetFromEnv(), googleAdapter, createGeminiAdapter(), IMAGE_TASKS (+19 more)

### Community 73 - "System Validation Logic"
Cohesion: 0.15
Nodes (29): dnd5eKnownSpellLimit(), dnd5eKnownSpellOverage(), KnownSpellProgression, progressionIndex(), ABILITY_SCORE_IDS, addIssue(), createDnd5eValidator(), Dnd5eValidationData (+21 more)

### Community 74 - "Spell Catalog Consistency Tests"
Cohesion: 0.10
Nodes (27): createSupabaseJwtVerifier(), decodeBase64Url(), decodeJsonSegment(), fail(), resolveGatewayAuth(), SupabaseJwtVerifier, b64url(), mintToken() (+19 more)

### Community 75 - "Dnd5e Resource Loading Hooks"
Cohesion: 0.10
Nodes (18): DaggerheartDomainCardEntry, daggerheartPassiveAuditAttributes, makeDoc(), makeDomainCardEntry(), makePassiveAuditSystem(), passiveAuditSignature(), DaggerheartAdversaryRole, DaggerheartAutomationMode (+10 more)

### Community 76 - "Mam Powers & Cost Ledger"
Cohesion: 0.07
Nodes (33): MamAdvantageBrowserTab(), Props, MamArchetypeBrowser, MamArchetypesTab, MamArchetypesTabComponent, Props, MamComplicationBrowser, MamComplicationsTab (+25 more)

### Community 77 - "Sync Engine Tests"
Cohesion: 0.09
Nodes (25): AllegianceChip(), AllegianceChipProps, PendingMonster, SceneDropControllerProps, TokenPanelProps, getSceneTokenSize(), DraftEncounterParams, buildPlacedToken() (+17 more)

### Community 78 - "Dnd5e Feature Options"
Cohesion: 0.04
Nodes (86): FeaturesSection(), Props, ProficiencyListSection(), Props, NormalizedSheet, formatBackgroundToolLabel(), ChoiceSlot, Dnd5eBackgroundSection() (+78 more)

### Community 79 - "Document Migrations & Storage"
Cohesion: 0.06
Nodes (54): ToastContext, ToastContextValue, ToastItem, ToastProvider(), useToast(), VARIANT_ICONS, VARIANT_STYLES, cloneDocumentsSnapshot() (+46 more)

### Community 80 - "App Header & Auth UI"
Cohesion: 0.36
Nodes (7): ThemeToggle(), applyTheme(), getSystemTheme(), isTheme(), Theme, useTheme(), VALID_THEMES

### Community 81 - "Combat Toggles & Conditions"
Cohesion: 0.13
Nodes (16): CurrencyEditor(), CurrencyEntry, DND_CURRENCIES, Props, InventoryItem, InventoryManager(), InventoryManagerProps, Currency (+8 more)

### Community 82 - "HP & Spell Slot Trackers"
Cohesion: 0.10
Nodes (19): AiImageInput, EncounterDraftCandidate, EncounterDraftData, IdentifyCreatureData, DraftEncounterParams, DraftEncounterResult, draftEncounterWithAi(), GatewayCall (+11 more)

### Community 83 - "Scene Grid View"
Cohesion: 0.18
Nodes (14): daggerheartManifest, dnd35eManifest, dnd5e2014Manifest, dnd5e2024Manifest, manifestForSystem(), SRD_MANIFESTS, mam3eManifest, pf1eManifest (+6 more)

### Community 84 - "Boundary Validation Tests"
Cohesion: 0.24
Nodes (19): NOW, parseImg(), validDocInput(), coerceDate(), coerceObjectives(), coerceQuests(), coerceSceneMapReference(), coerceSessionLog() (+11 more)

### Community 85 - "capabilityScenarios.test.tsx"
Cohesion: 0.60
Nodes (3): formatModifierCost(), MamPowerModifierBrowser(), MamPowerModifierBrowserProps

### Community 86 - "Equipment & Feature Browsers"
Cohesion: 0.09
Nodes (20): CombatPanel(), IllustrationPanel(), InitiativeTracker(), InitiativeTrackerProps, markerEffectHelp(), MarkerEffectOption, MarkerEffectPreset, MarkerPanel() (+12 more)

### Community 87 - "Pf2e Engine & Constants"
Cohesion: 0.09
Nodes (20): GapLedgerItem, LedgerPhase, LedgerStatus, LedgerTag, LedgerTrack, MASTER_GAP_LEDGER, RFC-003, byPhase (+12 more)

### Community 88 - "Documents Hook & Persistence"
Cohesion: 0.25
Nodes (16): actionReachCells(), ATTACK_COUNT_WORDS, averageDie(), buildMonsterCombatant(), dieFaces(), isMinusSign(), monsterAttackEffects(), monsterAttacksPerRound() (+8 more)

### Community 89 - "Daggerheart Contribution Ledger"
Cohesion: 0.08
Nodes (46): buildDaggerheartCombatant(), BuildDaggerheartCombatantResult, RANGE_CELLS, ANCESTRY_ADJUSTMENTS_BY_ID, ancestryByName, classByName, DAGGERHEART_TIER_BREAKPOINTS, DAGGERHEART_TRAITS (+38 more)

### Community 90 - "Dnd35e/Pf1e Derived Math"
Cohesion: 0.20
Nodes (10): Dnd5eSelectedFeatsSection(), automatedFeat, featDefinitionsById, manualFeat, selectedFeats, ProficienciesGranted, FeatAutomationState, hasGrantedProficiencies() (+2 more)

### Community 91 - "Mam Browser Tabs"
Cohesion: 0.09
Nodes (42): draftEncounter(), MakeGameParams, EncounterPanel(), EncounterPanelProps, formatAverageLevel(), isMonsterSystemId(), RFC-006, useSceneEncounter() (+34 more)

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
Cohesion: 0.10
Nodes (17): BUILT_IN_PROVIDERS, DEFAULT_PROVIDER_REGISTRY, GEMINI_REGISTRATION, MOCK_REGISTRATION, ProviderBuild, ProviderRegistration, ProviderRegistryDeps, ProviderRegistryEnv (+9 more)

### Community 97 - "Mam3e Derived Math"
Cohesion: 0.06
Nodes (45): IllustrateSceneResult, CreationWizardHost, LegalNotices, SceneManager, STORAGE_WARNING_THRESHOLD, AppHeader(), AppHeaderProps, CampaignManager() (+37 more)

### Community 98 - "Doc Drift Tests"
Cohesion: 0.07
Nodes (18): BLOCKING_IMPACTS, createCharacterForSystem(), expectNoBlockingViolations(), getCharacterNameInput(), KNOWN_A11Y_DEBT, RFC-004, completeGuidedCreationFromDefaults(), createCharacter() (+10 more)

### Community 99 - "Spell Catalog Parity Tests"
Cohesion: 0.11
Nodes (5): DND35E_SOURCE_BLOCKED_SPELL_IDS, fieldCoverageBaselines, PF1E_SOURCE_ROWS_WITHOUT_SAVING_THROW, SpellModule, spellModules

### Community 100 - "Pf2e Spell Types & Traits"
Cohesion: 0.11
Nodes (25): CombatStatCard(), Props, applyDerivedQuantities(), PresentedDerivedQuantity, ComputeLayer, DerivedDisplay, DerivedQuantityCase, DerivedQuantitySpec (+17 more)

### Community 101 - "Document Storage (IndexedDB)"
Cohesion: 0.35
Nodes (11): D20LegacySpellSlots, recoverD20LegacySpellSlot(), resetD20LegacySpellSlots(), setD20LegacyPreparedSpell(), setD20LegacySpellSlotTotal(), slotPool(), spendD20LegacySpellSlot(), toEquippedD20LegacyWeapon() (+3 more)

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
Cohesion: 0.07
Nodes (54): useCampaignSync(), baseAuthValue, mockedClearQueuedCampaignsSnapshot, mockedClearQueuedDeletedCampaignIds, mockedDeleteRemoteCampaign, mockedFetchRemoteCampaigns, mockedGetQueuedCampaignsSnapshot, mockedGetQueuedDeletedCampaignIds (+46 more)

### Community 106 - "Character Card Presenter"
Cohesion: 0.09
Nodes (31): Props, SceneCreateFormProps, UseSceneEncounterParams, Props, BuildEncounterEventsParams, BuildEncounterEventsResult, buildEncounterSceneEvents(), buildInitiativeEntries() (+23 more)

### Community 107 - "Oracle Panel & Logic"
Cohesion: 0.38
Nodes (10): CharacterCard(), asNumber(), asRecord(), asString(), getClassLabel(), getDocumentLevelValue(), getHitPointLabel(), getLevelLabel() (+2 more)

### Community 108 - "5e Equipment Tab"
Cohesion: 0.13
Nodes (32): validatePf1eBuild(), ABILITY_SCORE_IDS, addIssue(), addNonOpenSourceIssue(), consumeBuildLegality(), isIntegerInRange(), legalityRulePath(), loadValidationData() (+24 more)

### Community 109 - "Scene Reaction Panel"
Cohesion: 0.10
Nodes (30): D20EquipmentBrowserTab, D20FeatBrowserTab, countTrainedSkills(), D20InventoryCurrency, D20InventoryItem, D20LegacyData, D20LegacyTabs(), Props (+22 more)

### Community 110 - "Document Signature Hashing"
Cohesion: 0.42
Nodes (8): applyDnd5eLongRest(), applyDnd5eShortRest(), recoverAllSpellSlots(), recoverFeatures(), recoverLongRestHitDice(), recoverPactMagicSlots(), slotPool(), ResourcePool

### Community 111 - "Resource Pool Tracking"
Cohesion: 0.08
Nodes (13): CharacterListView(), registerAllSystems(), openBrokenSheet(), MockBeforeInstallPromptEvent, CreationOptions, now, makeDoc(), now (+5 more)

### Community 112 - "Bundle Size Check"
Cohesion: 0.10
Nodes (16): appChunk, appChunks, assetsDir, budgets, chunks, dataChunks, distDir, eagerChunkNames (+8 more)

### Community 113 - "AI Prompt Builders"
Cohesion: 0.16
Nodes (19): CharacterDraftCandidate, CharacterDraftPayload, EncounterDraftPayload, IdentifyCreaturePayload, IllustrateScenePayload, SceneNarrationPayload, buildCharacterDraftPrompt(), buildEncounterDraftPrompt() (+11 more)

### Community 115 - "Project Dependencies"
Cohesion: 0.08
Nodes (24): ai, @ai-sdk/google, class-variance-authority, clsx, lucide-react, dependencies, ai, @ai-sdk/google (+16 more)

### Community 116 - "3.5e Spell Encoder"
Cohesion: 0.07
Nodes (38): DEFAULT_QUICK_ROLLS, DicePanel(), DicePanelProps, formatBreakdown(), QUICK_ROLLS_BY_SYSTEM, DISPOSITION_BADGE, DISPOSITION_LABEL, ReactionHistoryEntry (+30 more)

### Community 117 - "AI Encounter Draft Flow"
Cohesion: 0.12
Nodes (15): mapImageLayerStyle(), MapPanel(), MapPanelProps, RFC-006, ALLEGIANCE_LABEL, ALLEGIANCE_TOKEN_CLASS, buildTokensByCell(), SceneGridView (+7 more)

### Community 118 - "Campaign File Transfer"
Cohesion: 0.17
Nodes (16): Dnd5eTemplateState, AddEntryInput, buildAlwaysPreparedSpellEntries(), buildDnd5eContributionLedger(), buildFeatAutomationEntries(), buildListEntry(), buildSpellcastingEntries(), buildTemplateProficiencyEntries() (+8 more)

### Community 119 - "MAM Archetype Browser"
Cohesion: 0.27
Nodes (11): CLASS_TOKENS, d20srdUrl(), FILES, main(), mapCastingTime(), mapDuration(), mapRange(), normalizeName() (+3 more)

### Community 120 - "PF1e Spell Encoder"
Cohesion: 0.27
Nodes (11): CLASS_COLUMNS, main(), mapCastingTime(), mapDuration(), mapRange(), RFC-4180, normalizeName(), parseCsv() (+3 more)

### Community 122 - "PF2e Archetypes Tab"
Cohesion: 0.08
Nodes (51): DND5E_SCENE_CONDITIONS, SCENE_CONDITIONS_BY_SYSTEM, sceneConditionOptions(), SceneManager(), buildSceneCombatants(), critModelForScene(), degreeModelForScene(), factionForToken() (+43 more)

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
Cohesion: 0.22
Nodes (12): field(), main(), parseAdversary(), parseFeats(), RANGES, ROLES, slug(), srcFlag (+4 more)

### Community 127 - "Service Worker Update Banner"
Cohesion: 0.50
Nodes (3): MANUAL_EXCLUSIONS, ManualExclusion, ManifestSystemId

### Community 128 - "Toast Notifications"
Cohesion: 0.16
Nodes (14): dnd5eCarryingCapacity(), dnd5eHighJump(), dnd5eLongJump(), dnd5ePushDragLift(), dnd5eSpeedWithArmor(), d20LegacySpellSaveDC(), DND5E_CANTRIP_SCALE_BREAKPOINTS, dnd5eCantripScaleTier() (+6 more)

### Community 129 - "Daggerheart Sheet Automation"
Cohesion: 0.17
Nodes (14): ALLEGIANCE_COLORS, drawScene(), drawTokenChip(), MARKER_FILL, SceneCanvas, tokenInitials(), buildTokenLabel(), defaultAllegiance() (+6 more)

### Community 130 - "d20LegacySpellcasting.ts"
Cohesion: 0.10
Nodes (19): SceneCanvasProps, SceneGridViewProps, buildDaggerheartAdversaryCombatant(), BuildDaggerheartAdversaryResult, DaggerheartAdversaryCombatant, RANGE_CELLS, DaggerheartCombatant, buildMam3eCombatant() (+11 more)

### Community 131 - "Retry With Backoff"
Cohesion: 0.07
Nodes (42): Doc, useSync(), UseSyncOptions, baseAuthValue, mockedClearQueuedDeletedDocumentIds, mockedClearQueuedSyncSnapshot, mockedDeleteRemoteDocument, mockedFetchRemoteDocuments (+34 more)

### Community 132 - "2024 Spell Encoder"
Cohesion: 0.39
Nodes (8): main(), mapCastingTime(), mapDuration(), mapRange(), normalizeName(), SCHOOLS, slug(), ts()

### Community 133 - "MAM Power Browser"
Cohesion: 0.12
Nodes (15): CombatTogglesSection(), Props, Condition, ConditionPicker(), Props, D20_LEGACY_CONDITION_NAMES, D20_LEGACY_TOGGLE_LABELS, D20FeatsTab() (+7 more)

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
Cohesion: 0.13
Nodes (17): collectPf2eRiderEffects(), PF2E_SNEAK_ATTACK_BREAKPOINTS, PF2E_TOGGLE_IDS, Pf2eRiderInputs, pf2eSneakAttackDice(), makeEffectId(), attackEffect(), seedWithFirstD20() (+9 more)

### Community 139 - "Prettier Config"
Cohesion: 0.25
Nodes (7): arrowParens, endOfLine, printWidth, semi, singleQuote, tabWidth, trailingComma

### Community 140 - "pf2eConditions.ts"
Cohesion: 0.24
Nodes (21): getDaggerheartStartingTraitArray(), addIssue(), buildLookup(), createDaggerheartValidator(), CUSTOM_INVENTORY_PREFIXES, DaggerheartValidationData, isIntegerInRange(), NamedEntry (+13 more)

### Community 141 - "pf2eSpellTraits.test.ts"
Cohesion: 0.22
Nodes (10): ABILITY_KEYS, DND5E_ASI_LEVELS_BY_CLASS, DND5E_BASE_ASI_LEVELS, DND5E_MULTICLASS_PREREQ, dnd5eAsiSlotsGranted(), validateDnd5eBuild(), ABILITY_KEYS, TIER_BONUS (+2 more)

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

### Community 147 - "Dnd5eEquipmentTab.tsx"
Cohesion: 0.24
Nodes (19): validateDnd35eBuild(), Dnd35eFeat, addIssue(), appendBuildLegalityIssues(), createDnd35eValidator(), Dnd35eValidationData, isIntegerInRange(), loadValidationData() (+11 more)

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
Cohesion: 0.19
Nodes (12): categoryIcons, GameSystemSelector(), GameSystemSelectorProps, systemAccents, supportBadgeLabels, supportBadgeStyles, buildInitialSummaryStates(), categoryDisplay (+4 more)

### Community 154 - "Dnd5eEquipmentTab.tsx"
Cohesion: 0.29
Nodes (16): addIssue(), createMam3eValidator(), engine, Mam3eValidationData, SPENT_BUCKETS, validateAdvantages(), validateArchetypePins(), validateComplications() (+8 more)

### Community 155 - "5e Movement Rules"
Cohesion: 0.14
Nodes (12): AuthContextValue, DebouncedPersistence, IMPORTANT: a begun generation must end in either `persist` or, useDebouncedPersistence(), EntitySyncAdapter, useEntitySync(), UseEntitySyncOptions, baseAuthValue (+4 more)

### Community 156 - "pf2eEngineMath.test.ts"
Cohesion: 0.19
Nodes (15): CREATURE_XP_BY_LEVEL_DIFF, pf2eAttackModifier(), pf2eCreatureXP(), Pf2eDegree, pf2eDyingAfterRecovery(), pf2eEncounterBudget(), pf2eInitialDying(), pf2eIsDead() (+7 more)

### Community 157 - "utils/validation.ts"
Cohesion: 0.23
Nodes (8): GAME_RULES, sanitizeInput(), validateAttributeScore(), validateCharacter(), validateCharacterName(), validateHitPoints(), validateLevel(), ValidationError

### Community 158 - "MAM Complication Browser"
Cohesion: 0.18
Nodes (15): AddEntryInput, buildBaseAttackBonusEntries(), buildD20LegacyContributionLedger(), buildSaveEntries(), buildSkillSynergyEntries(), createEntry(), D20LegacyClassLevelView, D20LegacySystemId (+7 more)

### Community 160 - "MamArchetypesTab.tsx"
Cohesion: 0.20
Nodes (12): MamArchetypeBrowser(), MamArchetypeBrowserProps, getMam3eSheetState(), GetMam3eSheetStateProps, uniqueNonEmptyStrings(), createEmptyMam3eConditionTrack(), createEmptyMam3ePower(), useMam3eMutationHandlers() (+4 more)

### Community 161 - "PF2e Backgrounds Data"
Cohesion: 0.17
Nodes (27): validatePf2eBuild(), addIssue(), CLASS_PROGRESSION_RANKS, createPf2eValidator(), isIntegerInRange(), PF2E_ABILITY_IDS, Pf2eValidationData, toIdMap() (+19 more)

### Community 177 - "documentSignature.ts"
Cohesion: 0.27
Nodes (9): makeScene(), campaignSignatureFor(), sameCampaignSignatures(), sameDocumentSignatures(), sameSceneSignatures(), sameSignatureMultisets(), sceneSignatureFor(), signatureFor() (+1 more)

### Community 179 - "daggerheartTemplate.ts"
Cohesion: 0.35
Nodes (10): getDaggerheartAncestryAdjustments(), applyDaggerheartAncestryTemplate(), applyDaggerheartClassTemplate(), applyDaggerheartCommunityTemplate(), classTemplateItems(), communityTemplateItems(), DaggerheartInventoryEntry, DEFAULTS (+2 more)

### Community 180 - "DaggerheartSheetController"
Cohesion: 0.24
Nodes (8): DaggerheartCharacterBasicsSection(), Props, Props, DaggerheartNotesSection(), Props, Props, DaggerheartSheetController, useStableListKeys()

### Community 181 - "useEntitySync.ts"
Cohesion: 0.10
Nodes (26): AppContent(), buildNewCharacterDocument(), cloneSystemData(), getEditableTarget(), KeyboardShortcut, useKeyboardNavigation(), DeferredInstallPromptEvent, isStandaloneMode() (+18 more)

### Community 182 - "syncTombstones.ts"
Cohesion: 0.31
Nodes (7): collectTerrainEffectsAt(), isTerrainOperation(), markerCoversCell(), markerToEffects(), normalizeStackPolicy(), TERRAIN_OPERATIONS, RFC-003

### Community 183 - "loadEquipmentForSystem"
Cohesion: 0.50
Nodes (3): Answer, Outcome, Q: where are pending debounced document saves flushed to localStorage on page hide or unload (persistence flush)

### Community 184 - "MamArchetypesTab.tsx"
Cohesion: 0.27
Nodes (8): SYSTEM_IDS, getSystemAssetPrefetchStateForTests(), prefetchedSystemAssets, prefetchedSystemRuntimeData, prefetchedSystemSheets, prefetchSystemAssetsForIds(), resetSystemAssetPrefetchStateForTests(), systemAssetPrefetchers

### Community 186 - "eslint-plugin-react"
Cohesion: 0.40
Nodes (4): Feat, FeatBrowser(), FeatBrowserProps, feats

### Community 187 - "fake-indexeddb"
Cohesion: 0.23
Nodes (9): DaggerheartDowntimeControls(), Props, DaggerheartReferenceLibrarySection(), DaggerheartSelectionOverviewSection(), DaggerheartSheetHeader(), Props, domainDisplayName(), makeController() (+1 more)

### Community 188 - "featTemplate.test.ts"
Cohesion: 0.17
Nodes (11): boonOfSkill, crafter, fixtureBenefits, keen_mind, linguist, makeDoc(), moderately_armored, musician (+3 more)

### Community 190 - "index.ts"
Cohesion: 0.40
Nodes (9): CreationDraftState, clearDraft(), draftKey(), emptyDraft(), isEmptyDraft(), readDraft(), useCreationDraft(), UseCreationDraftResult (+1 more)

### Community 191 - "retryWithBackoff"
Cohesion: 0.31
Nodes (7): DaggerheartDomainCardsSection(), Props, ATTRIBUTES, DAGGERHEART_CURRENCY_FIELDS, DOMAIN_CARD_TYPE_LABELS, EMPTY_WEAPON_LOADOUT, normalizeDomainId()

### Community 192 - "daggerheart-engine.test.ts"
Cohesion: 0.47
Nodes (3): isServiceWorkerSupported(), ServiceWorkerUpdateState, useServiceWorkerUpdate()

### Community 194 - "@types/react-dom"
Cohesion: 0.03
Nodes (72): CreationWizard(), CreationWizardProps, framedSteps(), severityWeight(), ValidationSummary(), CreationWizardHostProps, buildDocumentFromPlanIds(), buildWorkingDocument() (+64 more)

### Community 196 - "@vitest/coverage-v8"
Cohesion: 0.25
Nodes (6): ABILITIES, DEFENSES, Mam3eCreator(), Mam3eCreatorProps, SKILLS, Mam3eDefenseKey

### Community 197 - "@playwright/test"
Cohesion: 0.43
Nodes (6): rect, clampCoordinate(), invertPoint(), Rect, Viewport, zoomToCursor()

### Community 198 - "@testing-library/user-event"
Cohesion: 0.33
Nodes (6): availablePf2eToggles(), PF2E_TOGGLE_LABELS, PF2E_CONDITIONS, PF2E_VALUED_CONDITIONS, Pf2eFeatsConditionsTab(), Props

### Community 200 - "@typescript-eslint/parser"
Cohesion: 0.50
Nodes (4): ChoiceSlot, Dnd5eSpeciesSection(), Props, formatDnd5eSpeciesToolLabel()

## Knowledge Gaps
- **1367 isolated node(s):** `semi`, `singleQuote`, `trailingComma`, `printWidth`, `tabWidth` (+1362 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **20 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `CharacterDocument` connect `System Registry & Renderer` to `Sheet Resource Loading Hooks`, `d20LegacySpellcasting.ts`, `Retry With Backoff`, `Dnd5e2024 Engine & Hit Dice`, `Daggerheart Engine`, `Dnd5e Background Templates`, `Scene Combat Resolution`, `Dnd5e Class Templates`, `pf2eConditions.ts`, `Dnd5e Activity Definitions`, `App Shell & Layout`, `pf2eEngineMath.test.ts`, `Game System Selector`, `Dnd5eEquipmentTab.tsx`, `D20 Legacy System Engines`, `Dnd35e Saves & Data Model`, `Daggerheart Data Model`, `Daggerheart Inventory`, `Dnd5eEquipmentTab.tsx`, `Pf2e Character Templates`, `Dnd5e Feature List Sections`, `MAM Complication Browser`, `Encounter & Initiative Panels`, `Pf2e Sheet Tabs`, `AI Encounter Drafting`, `MamArchetypesTab.tsx`, `Currency & Inventory Editors`, `PF2e Backgrounds Data`, `Sheet Header & Stat Cards`, `Mam3e Data Model & Engine`, `Condition Effects by System`, `Equipped Armor Section`, `Spell Browser UI`, `Encounter Builder Logic`, `documentSignature.ts`, `D20 Legacy Templates`, `daggerheartTemplate.ts`, `Character Combatant Builder`, `D20 Class Spellcasting`, `SRD Manifest Generator`, `featTemplate.test.ts`, `D20 Legacy Spell Slots`, `ESLint Config`, `@types/react-dom`, `Character Effects Compilation`, `@testing-library/user-event`, `System Validation Logic`, `Dnd5e Resource Loading Hooks`, `Sync Engine Tests`, `Dnd5e Feature Options`, `Document Migrations & Storage`, `Combat Toggles & Conditions`, `Boundary Validation Tests`, `Equipment & Feature Browsers`, `Daggerheart Contribution Ledger`, `Mam Browser Tabs`, `Mam3e Derived Math`, `Document Storage (IndexedDB)`, `AI Creature Identification`, `Character Card Presenter`, `Oracle Panel & Logic`, `5e Equipment Tab`, `Scene Reaction Panel`, `Resource Pool Tracking`, `Campaign File Transfer`, `PF2e Archetypes Tab`?**
  _High betweenness centrality (0.154) - this node is a cross-community bridge._
- **Why does `GameSystemId` connect `Class Enhancement & Headers` to `Sheet Resource Loading Hooks`, `Dnd5e Sheets & E2E Tests`, `d20LegacySpellcasting.ts`, `Dnd5e2024 Engine & Hit Dice`, `App Shell & Layout`, `Daggerheart Data Model`, `System Registry & Renderer`, `ServiceWorkerUpdateBanner.tsx`, `Roadmap Metrics Generator`, `Pf2e Sheet Tabs`, `AI Encounter Drafting`, `Currency & Inventory Editors`, `Sheet Header & Stat Cards`, `Doc Drift Rules`, `Condition Effects by System`, `Spell Browser UI`, `Encounter Builder Logic`, `MamArchetypesTab.tsx`, `Daggerheart Combatant Builders`, `SRD Coverage Script`, `ESLint Config`, `Browser Compat & Error Logging`, `Mam Powers & Cost Ledger`, `Dnd5e Feature Options`, `Mam Browser Tabs`, `Mam3e Derived Math`, `5e Equipment Tab`, `Scene Reaction Panel`?**
  _High betweenness centrality (0.067) - this node is a cross-community bridge._
- **Why does `SystemDataModel` connect `System Registry & Renderer` to `Sheet Resource Loading Hooks`, `d20LegacySpellcasting.ts`, `Retry With Backoff`, `Dnd5e2024 Engine & Hit Dice`, `Daggerheart Engine`, `Scene Combat Resolution`, `App Shell & Layout`, `Game System Selector`, `Dnd35e Saves & Data Model`, `Pf2e Sheet Tabs`, `AI Encounter Drafting`, `MamArchetypesTab.tsx`, `Currency & Inventory Editors`, `Condition Effects by System`, `Equipped Armor Section`, `documentSignature.ts`, `D20 Legacy Templates`, `Character Combatant Builder`, `index.ts`, `ESLint Config`, `@types/react-dom`, `Character Effects Compilation`, `Sync Engine Tests`, `Dnd5e Feature Options`, `Document Migrations & Storage`, `Boundary Validation Tests`, `Equipment & Feature Browsers`, `Daggerheart Contribution Ledger`, `Mam Browser Tabs`, `Mam3e Derived Math`, `Document Storage (IndexedDB)`, `AI Creature Identification`, `Character Card Presenter`, `Oracle Panel & Logic`, `Resource Pool Tracking`, `PF2e Archetypes Tab`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **What connects `semi`, `singleQuote`, `trailingComma` to the rest of the system?**
  _1367 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Sheet Resource Loading Hooks` be split into smaller, more focused modules?**
  _Cohesion score 0.051597051597051594 - nodes in this community are weakly interconnected._
- **Should `Dnd5e Sheets & E2E Tests` be split into smaller, more focused modules?**
  _Cohesion score 0.12834224598930483 - nodes in this community are weakly interconnected._
- **Should `Dnd5e Equipment & Features UI` be split into smaller, more focused modules?**
  _Cohesion score 0.11666666666666667 - nodes in this community are weakly interconnected._