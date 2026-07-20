import React from 'react';
import type { CharacterDocument, SystemDataModel } from '../../types/core/document';
import type { Pf2eDataModel } from './data-model';
import { Shield, Zap, User, BookOpen, Backpack, StickyNote, Sparkles, Sword } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/Tabs';
import { Badge } from '../../components/ui/Badge';
import { Pf2eEquipmentBrowserTab } from './components/Pf2eEquipmentBrowserTab';
import { EquippedArmorSection } from '../../components/EquippedArmorSection';
import { Pf2eFeatBrowserTab } from './components/Pf2eFeatBrowserTab';
import { Pf2eArchetypesTab } from './components/Pf2eArchetypesTab';
import { Pf2eSpellsTab } from './components/Pf2eSpellsTab';
import { Pf2eHeader } from './components/Pf2eHeader';
import { Pf2eOverview } from './components/Pf2eOverview';
import { Pf2eDerivedStats } from './components/Pf2eDerivedStats';
import { presentDerivedQuantities } from '../../rules/derivation';
import { PF2E_DERIVED_QUANTITIES } from './derivedQuantities';
import { Pf2eAbilitiesTab } from './components/Pf2eAbilitiesTab';
import { Pf2eSavesTab } from './components/Pf2eSavesTab';
import { Pf2eSkillsTab } from './components/Pf2eSkillsTab';
import { Pf2eFeatsConditionsTab } from './components/Pf2eFeatsConditionsTab';
import { Pf2eInventoryTab } from './components/Pf2eInventoryTab';
import { Pf2eNotesTab } from './components/Pf2eNotesTab';
import { usePf2eSheetController } from './usePf2eSheetController';

interface Props {
  document: CharacterDocument<Pf2eDataModel>;
  onUpdate?: (document: CharacterDocument<SystemDataModel>) => void;
}

export const Pf2eCharacterSheet: React.FC<Props> = ({ document, onUpdate }) => {
  const controller = usePf2eSheetController({ document, onUpdate });
  const derivedCards = presentDerivedQuantities(
    PF2E_DERIVED_QUANTITIES,
    controller.data,
    controller.data.derived
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6 p-6">
      <Pf2eHeader {...controller.headerProps} />
      <Pf2eOverview {...controller.overviewProps} />
      <Pf2eDerivedStats derivedCards={derivedCards} />
      <Tabs defaultValue="abilities">
        <TabsList className="w-full grid grid-cols-10">
          <TabsTrigger value="abilities" className="flex items-center gap-1.5">
            <User className="w-4 h-4" /> Abilities
          </TabsTrigger>
          <TabsTrigger value="saves" className="flex items-center gap-1.5">
            <Shield className="w-4 h-4" /> Saves
          </TabsTrigger>
          <TabsTrigger value="skills" className="flex items-center gap-1.5">
            <Zap className="w-4 h-4" /> Skills
            {controller.trainedSkillCount > 0 && (
              <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0">
                {controller.trainedSkillCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="feats-conditions" className="flex items-center gap-1.5">
            <BookOpen className="w-4 h-4" /> Feats
            {controller.data.feats.length > 0 && (
              <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0">
                {controller.data.feats.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="feat-browser"
            className="flex items-center gap-1.5"
            onClick={controller.warmFeatBrowser}
            onFocus={controller.warmFeatBrowser}
            onPointerEnter={controller.warmFeatBrowser}
          >
            <BookOpen className="w-4 h-4" /> Browse
          </TabsTrigger>
          <TabsTrigger
            value="archetypes"
            className="flex items-center gap-1.5"
            onClick={controller.warmArchetypes}
            onFocus={controller.warmArchetypes}
            onPointerEnter={controller.warmArchetypes}
          >
            <Shield className="w-4 h-4" /> Archetypes
            {controller.archetypesTabProps.selectedArchetypeIds.length > 0 && (
              <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0">
                {controller.archetypesTabProps.selectedArchetypeIds.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="spells"
            className="flex items-center gap-1.5"
            onClick={controller.warmSpellsTab}
            onFocus={controller.warmSpellsTab}
            onPointerEnter={controller.warmSpellsTab}
          >
            <Sparkles className="w-4 h-4" /> Spells
          </TabsTrigger>
          <TabsTrigger
            value="equipment-browser"
            className="flex items-center gap-1.5"
            onClick={controller.warmEquipmentBrowser}
            onFocus={controller.warmEquipmentBrowser}
            onPointerEnter={controller.warmEquipmentBrowser}
          >
            <Sword className="w-4 h-4" /> Equipment
          </TabsTrigger>
          <TabsTrigger value="inventory" className="flex items-center gap-1.5">
            <Backpack className="w-4 h-4" /> Inventory
            {controller.data.inventory.length > 0 && (
              <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0">
                {controller.data.inventory.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="notes" className="flex items-center gap-1.5">
            <StickyNote className="w-4 h-4" /> Notes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="abilities">
          <Pf2eAbilitiesTab {...controller.abilitiesTabProps} />
        </TabsContent>

        <TabsContent value="saves">
          <Pf2eSavesTab {...controller.savesTabProps} />
        </TabsContent>

        <TabsContent value="skills">
          <Pf2eSkillsTab {...controller.skillsTabProps} />
        </TabsContent>

        <TabsContent value="feats-conditions">
          <Pf2eFeatsConditionsTab {...controller.featsConditionsTabProps} />
        </TabsContent>

        <TabsContent value="feat-browser">
          <Pf2eFeatBrowserTab {...controller.featBrowserProps} />
        </TabsContent>

        <TabsContent value="archetypes">
          <Pf2eArchetypesTab {...controller.archetypesTabProps} />
        </TabsContent>

        <TabsContent value="spells">
          <Pf2eSpellsTab {...controller.spellsTabProps} />
        </TabsContent>

        <TabsContent value="equipment-browser">
          <EquippedArmorSection {...controller.equippedArmorSectionProps} shieldRequiresRaise />
          <Pf2eEquipmentBrowserTab {...controller.equipmentBrowserTabProps} />
        </TabsContent>

        <TabsContent value="inventory">
          <Pf2eInventoryTab {...controller.inventoryTabProps} />
        </TabsContent>

        <TabsContent value="notes">
          <Pf2eNotesTab {...controller.notesTabProps} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
