import React from 'react';
import {
  Shield,
  Target,
  User,
  BookOpen,
  Backpack,
  StickyNote,
  Sparkles,
  Sword,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/Tabs';
import { Badge } from '../../../components/ui/Badge';
import type { FeatDefinition } from '../../../types/character-options/feats';
import type { Feature } from '../../../types/core/character';
import type { CharacterDocument } from '../../../types/core/document';
import type { Item } from '../../../types/equipment/items';
import type { GameSystemId, Skill } from '../../../types/game-systems';
import type { Spell } from '../../../types/magic/spells';
import { Dnd35eDataModel } from '../../dnd35e/data-model';
import type { Pf1eTrait } from '../../pf1e/data-model';
import { Pf1eDataModel } from '../../pf1e/data-model';
import { D20AbilitiesTab } from './D20AbilitiesTab';
import { D20EquipmentBrowserTab } from './D20EquipmentBrowserTab';
import { D20EquippedArmorSection } from './D20EquippedArmorSection';
import { D20FeatBrowserTab } from './D20FeatBrowserTab';
import { D20FeatsTab } from './D20FeatsTab';
import { D20InventoryTab } from './D20InventoryTab';
import { D20NotesTab } from './D20NotesTab';
import { D20SavesTab } from './D20SavesTab';
import { D20SpellBrowserPanel } from './D20SpellBrowserPanel';
import { D20SkillsTab } from './D20SkillsTab';
import { D20SpellsTab } from './D20SpellsTab';

type D20LegacyData = Dnd35eDataModel | Pf1eDataModel;

type D20InventoryCurrency = {
  copper: number;
  silver: number;
  gold: number;
  platinum: number;
};

type D20InventoryItem = {
  itemId: string;
  name: string;
  quantity: number;
  weight: number;
};

interface Props {
  document: CharacterDocument<D20LegacyData>;
  systemId: GameSystemId;
  isPf1e: boolean;
  canUpdate: boolean;
  baseAttributes: Record<string, number>;
  saves: React.ComponentProps<typeof D20SavesTab>['saves'];
  skills: Skill[];
  skillRanks: Record<string, number>;
  classSkills?: string[];
  conditions: Array<{ id: string; name: string }>;
  onConditionChange?: (conditions: Array<{ id: string; name: string }>) => void;
  availableToggles: string[];
  activeToggles: string[];
  onActiveTogglesChange?: (activeToggles: string[]) => void;
  features: Feature[];
  feats: Array<{ id: string; name: string; description: string; source: string }>;
  traits: Pf1eTrait[];
  traitOptions: Pf1eTrait[];
  traitsLoaded: boolean;
  selectedTraitId: string;
  featDefs: FeatDefinition[];
  featsLoaded: boolean;
  onLoadFeatDefs: () => void | Promise<void>;
  spellsLoaded: boolean;
  spells: Spell[];
  spellListIds: string[];
  trackedSpellIds: string[];
  preparedSpellsByLevel: Record<number, string[]>;
  alwaysPreparedSpellIds: string[];
  spellSlots: Record<number, { total: number; used: number }>;
  spellSlotLevels: number[];
  manualSpellcastingExtras?: D20LegacyData['manualSpellcastingExtras'];
  onLoadSpells: () => void | Promise<void>;
  equipmentLoaded: boolean;
  equipmentItems: Item[];
  onLoadEquipment: () => void | Promise<void>;
  onEquipArmor: (item: {
    id: string;
    name: string;
    armorClass?: number;
    armorType?: 'light' | 'medium' | 'heavy';
    dexBonusMax?: number;
    armorCheckPenalty?: number;
  }) => void;
  onEquipShield: (item: {
    id: string;
    name: string;
    shieldBonus?: number;
    armorCheckPenalty?: number;
  }) => void;
  onUnequipArmor: () => void;
  onUnequipShield: () => void;
  currency: D20InventoryCurrency;
  inventory: D20InventoryItem[];
  personality?: {
    description?: string;
    backstory?: string;
  };
  notes?: string;
  onBaseAttributesChange: (baseAttributes: Record<string, number>) => void;
  onSavesChange: (saves: React.ComponentProps<typeof D20SavesTab>['saves']) => void;
  onSkillRanksChange: (skillRanks: Record<string, number>) => void;
  onRemoveFeat: (featId: string) => void;
  onAddFeat: () => void;
  onSelectedTraitIdChange: (traitId: string) => void;
  onLoadTraitOptions: () => void | Promise<void>;
  onAddTrait: () => void;
  onRemoveTrait: (traitId: string) => void;
  onAddSpellLevel: () => void;
  onAddKnownSpell: (spell: Spell) => void;
  onRemoveKnownSpell: (spellId: string) => void;
  onSetPreparedSpell: (level: number, slotIndex: number, spellId: string) => void;
  onUseSpellSlot: (level: number) => void;
  onRecoverSpellSlot: (level: number) => void;
  onSetSpellSlotTotal: (level: number, total: number) => void;
  onSetManualExtraConsumed: (
    kind: 'domain' | 'specialist',
    level: number,
    consumed: boolean
  ) => void;
  onSetSpontaneousConversionReference: (reference: 'cure' | 'inflict' | 'both') => void;
  onSetDragonDiscipleBonusSlots: (patch: Partial<{ total: number; used: number }>) => void;
  onCurrencyChange: (currency: D20InventoryCurrency) => void;
  onAddItem: (item: { id: string; name: string; quantity: number; weight: number }) => void;
  onRemoveItem: (itemId: string) => void;
  onDescriptionChange: (value: string) => void;
  onBackstoryChange: (value: string) => void;
  onNotesChange: (value: string) => void;
}

function countTrainedSkills(skillRanks: Record<string, number>): number {
  return Object.values(skillRanks).filter((value) => value > 0).length;
}

export const D20LegacyTabs: React.FC<Props> = ({
  document,
  systemId,
  isPf1e,
  canUpdate,
  baseAttributes,
  saves,
  skills,
  skillRanks,
  classSkills,
  conditions,
  onConditionChange,
  availableToggles,
  activeToggles,
  onActiveTogglesChange,
  features,
  feats,
  traits,
  traitOptions,
  traitsLoaded,
  selectedTraitId,
  featDefs,
  featsLoaded,
  onLoadFeatDefs,
  spellsLoaded,
  spells,
  spellListIds,
  trackedSpellIds,
  preparedSpellsByLevel,
  alwaysPreparedSpellIds,
  spellSlots,
  spellSlotLevels,
  manualSpellcastingExtras,
  onLoadSpells,
  equipmentLoaded,
  equipmentItems,
  onLoadEquipment,
  onEquipArmor,
  onEquipShield,
  onUnequipArmor,
  onUnequipShield,
  currency,
  inventory,
  personality,
  notes,
  onBaseAttributesChange,
  onSavesChange,
  onSkillRanksChange,
  onRemoveFeat,
  onAddFeat,
  onSelectedTraitIdChange,
  onLoadTraitOptions,
  onAddTrait,
  onRemoveTrait,
  onAddSpellLevel,
  onAddKnownSpell,
  onRemoveKnownSpell,
  onSetPreparedSpell,
  onUseSpellSlot,
  onRecoverSpellSlot,
  onSetSpellSlotTotal,
  onSetManualExtraConsumed,
  onSetSpontaneousConversionReference,
  onSetDragonDiscipleBonusSlots,
  onCurrencyChange,
  onAddItem,
  onRemoveItem,
  onDescriptionChange,
  onBackstoryChange,
  onNotesChange,
}) => {
  const trainedSkillCount = countTrainedSkills(skillRanks);

  const warmFeatBrowser = () => {
    void onLoadFeatDefs();
    void D20FeatBrowserTab.preload();
  };

  const warmSpellsTab = () => {
    void onLoadSpells();
    void D20SpellBrowserPanel.preload();
  };

  const warmEquipmentBrowser = () => {
    void onLoadEquipment();
    void D20EquipmentBrowserTab.preload();
  };

  return (
    <Tabs defaultValue="abilities">
      <TabsList className="w-full grid grid-cols-9">
        <TabsTrigger value="abilities" className="flex items-center gap-1.5">
          <User className="w-4 h-4" /> Abilities
        </TabsTrigger>
        <TabsTrigger value="saves" className="flex items-center gap-1.5">
          <Shield className="w-4 h-4" /> Saves
        </TabsTrigger>
        <TabsTrigger value="skills" className="flex items-center gap-1.5">
          <Target className="w-4 h-4" /> Skills
          {trainedSkillCount > 0 && (
            <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0">
              {trainedSkillCount}
            </Badge>
          )}
        </TabsTrigger>
        <TabsTrigger value="feats" className="flex items-center gap-1.5">
          <BookOpen className="w-4 h-4" /> Feats
          {feats.length > 0 && (
            <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0">
              {feats.length}
            </Badge>
          )}
        </TabsTrigger>
        <TabsTrigger
          value="feat-browser"
          className="flex items-center gap-1.5"
          onClick={warmFeatBrowser}
          onFocus={warmFeatBrowser}
          onPointerEnter={warmFeatBrowser}
        >
          <BookOpen className="w-4 h-4" /> Browse
        </TabsTrigger>
        <TabsTrigger
          value="spells"
          className="flex items-center gap-1.5"
          onClick={warmSpellsTab}
          onFocus={warmSpellsTab}
          onPointerEnter={warmSpellsTab}
        >
          <Sparkles className="w-4 h-4" /> Spells
        </TabsTrigger>
        <TabsTrigger
          value="equipment-browser"
          className="flex items-center gap-1.5"
          onClick={warmEquipmentBrowser}
          onFocus={warmEquipmentBrowser}
          onPointerEnter={warmEquipmentBrowser}
        >
          <Sword className="w-4 h-4" /> Equipment
        </TabsTrigger>
        <TabsTrigger value="inventory" className="flex items-center gap-1.5">
          <Backpack className="w-4 h-4" /> Inventory
          {inventory.length > 0 && (
            <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0">
              {inventory.length}
            </Badge>
          )}
        </TabsTrigger>
        <TabsTrigger value="notes" className="flex items-center gap-1.5">
          <StickyNote className="w-4 h-4" /> Notes
        </TabsTrigger>
      </TabsList>

      <TabsContent value="abilities">
        <D20AbilitiesTab
          baseAttributes={baseAttributes}
          canUpdate={canUpdate}
          onBaseAttributesChange={onBaseAttributesChange}
        />
      </TabsContent>

      <TabsContent value="saves">
        <D20SavesTab
          document={document}
          saves={saves}
          canUpdate={canUpdate}
          onSavesChange={onSavesChange}
        />
      </TabsContent>

      <TabsContent value="skills">
        <D20SkillsTab
          skills={skills}
          baseAttributes={baseAttributes}
          skillRanks={skillRanks}
          classSkills={classSkills}
          isPf1e={isPf1e}
          characterLevel={(document.system.level as number) ?? 1}
          carriedWeight={(document.system.inventory ?? []).reduce(
            (weight, item) => weight + item.weight * item.quantity,
            0
          )}
          equipment={document.system.equipment}
          canUpdate={canUpdate}
          onSkillRanksChange={onSkillRanksChange}
        />
      </TabsContent>

      <TabsContent value="feats">
        <D20FeatsTab
          conditions={conditions}
          onConditionChange={onConditionChange}
          availableToggles={availableToggles}
          activeToggles={activeToggles}
          onActiveTogglesChange={onActiveTogglesChange}
          features={features}
          feats={feats}
          isPf1e={isPf1e}
          traits={traits}
          traitOptions={traitOptions}
          traitsLoaded={traitsLoaded}
          selectedTraitId={selectedTraitId}
          canUpdate={canUpdate}
          onRemoveFeat={onRemoveFeat}
          onAddFeat={onAddFeat}
          onSelectedTraitIdChange={onSelectedTraitIdChange}
          onLoadTraitOptions={onLoadTraitOptions}
          onAddTrait={onAddTrait}
          onRemoveTrait={onRemoveTrait}
        />
      </TabsContent>

      <TabsContent value="feat-browser">
        <D20FeatBrowserTab systemId={systemId} featsLoaded={featsLoaded} featDefs={featDefs} />
      </TabsContent>

      <TabsContent value="spells">
        <D20SpellsTab
          spellsLoaded={spellsLoaded}
          spells={spells}
          spellListIds={spellListIds}
          trackedSpellIds={trackedSpellIds}
          preparedSpellsByLevel={preparedSpellsByLevel}
          alwaysPreparedSpellIds={alwaysPreparedSpellIds}
          spellSlots={spellSlots}
          spellSlotLevels={spellSlotLevels}
          manualSpellcastingExtras={manualSpellcastingExtras}
          canUpdate={canUpdate}
          onAddSpellLevel={onAddSpellLevel}
          onAddKnownSpell={onAddKnownSpell}
          onRemoveKnownSpell={onRemoveKnownSpell}
          onSetPreparedSpell={onSetPreparedSpell}
          onUseSpellSlot={onUseSpellSlot}
          onRecoverSpellSlot={onRecoverSpellSlot}
          onSetSpellSlotTotal={onSetSpellSlotTotal}
          onSetManualExtraConsumed={onSetManualExtraConsumed}
          onSetSpontaneousConversionReference={onSetSpontaneousConversionReference}
          onSetDragonDiscipleBonusSlots={onSetDragonDiscipleBonusSlots}
        />
      </TabsContent>

      <TabsContent value="equipment-browser">
        <D20EquippedArmorSection
          equipmentItems={equipmentItems}
          equipment={document.system.equipment}
          canUpdate={canUpdate}
          onEquipArmor={onEquipArmor}
          onEquipShield={onEquipShield}
          onUnequipArmor={onUnequipArmor}
          onUnequipShield={onUnequipShield}
        />
        <D20EquipmentBrowserTab equipmentLoaded={equipmentLoaded} equipmentItems={equipmentItems} />
      </TabsContent>

      <TabsContent value="inventory">
        <D20InventoryTab
          currency={currency}
          inventory={inventory}
          canUpdate={canUpdate}
          onCurrencyChange={onCurrencyChange}
          onAddItem={onAddItem}
          onRemoveItem={onRemoveItem}
        />
      </TabsContent>

      <TabsContent value="notes">
        <D20NotesTab
          personality={personality}
          notes={notes}
          canUpdate={canUpdate}
          onDescriptionChange={onDescriptionChange}
          onBackstoryChange={onBackstoryChange}
          onNotesChange={onNotesChange}
        />
      </TabsContent>
    </Tabs>
  );
};
