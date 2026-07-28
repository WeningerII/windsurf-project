// purpose: Tabs navigation — top-level tab strip with conditional weapon-mastery tab for 2024 edition.
import { Backpack, BookOpen, Crosshair, Sparkles, StickyNote, Target, User } from 'lucide-react';
import { Shield } from 'lucide-react';
import { TabsList, TabsTrigger } from '../../../../components/ui/Tabs';

interface Props {
  showWeaponMasteries: boolean;
  onWarmFeatures: () => void;
  onWarmSpells: () => void;
  onWarmEquipment: () => void;
}

export function Dnd5eTabsNavigation({
  showWeaponMasteries,
  onWarmFeatures,
  onWarmSpells,
  onWarmEquipment,
}: Props) {
  // Two tabs have left this strip. The read-only bestiary (Monsters) tab moved
  // to the shared Dock / Library Bestiary route in Phase 3; the Feats *browser*
  // tab followed it in the Phase-5 eviction (browse-and-add now lives in the
  // Dock's Feats tab, dispatched through SheetDispatchContext). Selected feats
  // still live on the Features tab. Seven columns, eight with masteries.
  const tabsListClassName = showWeaponMasteries
    ? 'w-full grid grid-cols-3 gap-1 md:grid-cols-4 xl:grid-cols-8'
    : 'w-full grid grid-cols-3 gap-1 md:grid-cols-4 xl:grid-cols-7';

  return (
    <TabsList className={tabsListClassName}>
      <TabsTrigger value="abilities" className="flex items-center gap-1.5">
        <User className="w-4 h-4" /> Abilities
      </TabsTrigger>
      <TabsTrigger value="saves" className="flex items-center gap-1.5">
        <Shield className="w-4 h-4" /> Saves
      </TabsTrigger>
      <TabsTrigger value="skills" className="flex items-center gap-1.5">
        <Target className="w-4 h-4" /> Skills
      </TabsTrigger>
      <TabsTrigger
        value="features"
        className="flex items-center gap-1.5"
        onClick={onWarmFeatures}
        onFocus={onWarmFeatures}
        onPointerEnter={onWarmFeatures}
      >
        <Sparkles className="w-4 h-4" /> Features
      </TabsTrigger>
      <TabsTrigger
        value="spells"
        className="flex items-center gap-1.5"
        onClick={onWarmSpells}
        onFocus={onWarmSpells}
        onPointerEnter={onWarmSpells}
      >
        <BookOpen className="w-4 h-4" /> Spells
      </TabsTrigger>
      <TabsTrigger
        value="equipment"
        className="flex items-center gap-1.5"
        onClick={onWarmEquipment}
        onFocus={onWarmEquipment}
        onPointerEnter={onWarmEquipment}
      >
        <Backpack className="w-4 h-4" /> Equipment
      </TabsTrigger>
      <TabsTrigger value="notes" className="flex items-center gap-1.5">
        <StickyNote className="w-4 h-4" /> Notes
      </TabsTrigger>
      {showWeaponMasteries && (
        <TabsTrigger value="masteries" className="flex items-center gap-1.5">
          <Crosshair className="w-4 h-4" /> Masteries
        </TabsTrigger>
      )}
    </TabsList>
  );
}
