import React from 'react';
import type { CharacterDocument, SystemDataModel } from '../../types/core/document';
import type { Mam3eDataModel } from './data-model';
import {
  Shield,
  Zap,
  Brain,
  Activity,
  AlertTriangle,
  Target,
  Star,
  StickyNote,
  Sword,
  HeartPulse,
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/Tabs';
import { Badge } from '../../components/ui/Badge';
import { presentDerivedQuantities } from '../../rules/derivation';
import { MAM3E_DERIVED_QUANTITIES } from './derivedQuantities';
import { MamDerivedStats } from './components/MamDerivedStats';
import { MamArchetypesTab } from './components/MamArchetypesTab';
import { MamComplicationsTab } from './components/MamComplicationsTab';
import { MamPowerBrowserTab } from './components/MamPowerBrowserTab';
import { MamAdvantageBrowserTab } from './components/MamAdvantageBrowserTab';
import { MamEquipmentBrowserTab } from './components/MamEquipmentBrowserTab';
import { MamHeader } from './components/MamHeader';
import { MamAbilitiesTab } from './components/MamAbilitiesTab';
import { MamSkillsAdvantagesTab } from './components/MamSkillsAdvantagesTab';
import { MamPowersTab } from './components/MamPowersTab';
import { MamConditionsTab } from './components/MamConditionsTab';
import { MamNotesTab } from './components/MamNotesTab';
import { useMam3eSheetController } from './useMam3eSheetController';

interface Props {
  document: CharacterDocument<Mam3eDataModel>;
  onUpdate?: (document: CharacterDocument<SystemDataModel>) => void;
}

export const Mam3eCharacterSheet: React.FC<Props> = ({ document, onUpdate }) => {
  const controller = useMam3eSheetController({ document, onUpdate });
  const derivedCards = presentDerivedQuantities(
    MAM3E_DERIVED_QUANTITIES,
    controller.data,
    controller.data.derived
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      <MamHeader {...controller.headerProps} />
      <MamDerivedStats derivedCards={derivedCards} />
      <Tabs defaultValue="abilities">
        <TabsList className="w-full grid grid-cols-2 md:grid-cols-5 h-auto gap-1">
          <TabsTrigger value="abilities" className="flex items-center gap-1.5">
            <Brain className="w-4 h-4" /> Abilities
          </TabsTrigger>
          <TabsTrigger value="skills-advantages" className="flex items-center gap-1.5">
            <Target className="w-4 h-4" /> Skills
            {Object.keys(controller.data.skills).length > 0 && (
              <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0">
                {Object.keys(controller.data.skills).length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="archetypes"
            className="flex items-center gap-1.5"
            onClick={controller.warmArchetypes}
            onFocus={controller.warmArchetypes}
            onPointerEnter={controller.warmArchetypes}
          >
            <Shield className="w-4 h-4" /> Archetypes
            {controller.pinnedArchetypeIds.length > 0 && (
              <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0">
                {controller.pinnedArchetypeIds.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="powers"
            className="flex items-center gap-1.5"
            onClick={controller.warmPowers}
            onFocus={controller.warmPowers}
            onPointerEnter={controller.warmPowers}
          >
            <Activity className="w-4 h-4" /> Powers
            {controller.data.powers.length > 0 && (
              <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0">
                {controller.data.powers.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="power-browser"
            className="flex items-center gap-1.5"
            onClick={controller.warmPowerBrowser}
            onFocus={controller.warmPowerBrowser}
            onPointerEnter={controller.warmPowerBrowser}
          >
            <Zap className="w-4 h-4" /> Powers DB
          </TabsTrigger>
          <TabsTrigger
            value="advantage-browser"
            className="flex items-center gap-1.5"
            onClick={controller.warmAdvantages}
            onFocus={controller.warmAdvantages}
            onPointerEnter={controller.warmAdvantages}
          >
            <Star className="w-4 h-4" /> Advantages DB
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
          <TabsTrigger value="conditions" className="flex items-center gap-1.5">
            <HeartPulse className="w-4 h-4" /> Conditions
            {(controller.conditionTrack.bruised > 0 ||
              controller.conditionTrack.dazed ||
              controller.conditionTrack.staggered ||
              controller.conditionTrack.incapacitated) && (
              <Badge
                variant={controller.conditionTrack.incapacitated ? 'destructive' : 'warning'}
                className="ml-1 text-[10px] px-1.5 py-0"
              >
                {controller.conditionTrack.incapacitated ? 'KO' : controller.conditionTrack.bruised}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="complications"
            className="flex items-center gap-1.5"
            onClick={controller.warmComplications}
            onFocus={controller.warmComplications}
            onPointerEnter={controller.warmComplications}
          >
            <AlertTriangle className="w-4 h-4" /> Complications
            {controller.data.complications.length > 0 && (
              <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0">
                {controller.data.complications.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="notes" className="flex items-center gap-1.5">
            <StickyNote className="w-4 h-4" /> Notes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="abilities">
          <MamAbilitiesTab {...controller.abilitiesTabProps} />
        </TabsContent>

        <TabsContent value="skills-advantages">
          <MamSkillsAdvantagesTab {...controller.skillsAdvantagesTabProps} />
        </TabsContent>

        <TabsContent value="archetypes">
          <MamArchetypesTab {...controller.archetypesTabProps} />
        </TabsContent>

        <TabsContent value="powers">
          <MamPowersTab {...controller.powersTabProps} />
        </TabsContent>

        <TabsContent value="conditions">
          <MamConditionsTab {...controller.conditionsTabProps} />
        </TabsContent>

        <TabsContent value="complications">
          <MamComplicationsTab {...controller.complicationsTabProps} />
        </TabsContent>

        <TabsContent value="power-browser">
          <MamPowerBrowserTab {...controller.powerBrowserTabProps} />
        </TabsContent>

        <TabsContent value="advantage-browser">
          <MamAdvantageBrowserTab {...controller.advantageBrowserTabProps} />
        </TabsContent>

        <TabsContent value="equipment-browser">
          <MamEquipmentBrowserTab {...controller.equipmentBrowserTabProps} />
        </TabsContent>

        <TabsContent value="notes">
          <MamNotesTab {...controller.notesTabProps} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
