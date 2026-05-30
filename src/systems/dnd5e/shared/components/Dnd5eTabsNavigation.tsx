// purpose: Tabs navigation — top-level tab strip with conditional weapon-mastery tab for 2024 edition.
import {
  Backpack,
  BookOpen,
  Crosshair,
  Skull,
  Sparkles,
  StickyNote,
  Target,
  User,
} from 'lucide-react';
import { Shield } from 'lucide-react';
import { TabsList, TabsTrigger } from '../../../../components/ui/Tabs';

interface Props {
  showFeatBrowser: boolean;
  showWeaponMasteries: boolean;
  onWarmFeatures: () => void;
  onWarmSpells: () => void;
  onWarmFeats: () => void;
  onWarmEquipment: () => void;
  onWarmMonsters: () => void;
}

export function Dnd5eTabsNavigation({
  showFeatBrowser,
  showWeaponMasteries,
  onWarmFeatures,
  onWarmSpells,
  onWarmFeats,
  onWarmEquipment,
  onWarmMonsters,
}: Props) {
  const tabsListClassName = showWeaponMasteries
    ? 'w-full grid grid-cols-3 gap-1 md:grid-cols-5 xl:grid-cols-10'
    : 'w-full grid grid-cols-3 gap-1 md:grid-cols-5 xl:grid-cols-9';

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
      {showFeatBrowser && (
        <TabsTrigger
          value="feats"
          className="flex items-center gap-1.5"
          onClick={onWarmFeats}
          onFocus={onWarmFeats}
          onPointerEnter={onWarmFeats}
        >
          <BookOpen className="w-4 h-4" /> Feats
        </TabsTrigger>
      )}
      <TabsTrigger
        value="equipment"
        className="flex items-center gap-1.5"
        onClick={onWarmEquipment}
        onFocus={onWarmEquipment}
        onPointerEnter={onWarmEquipment}
      >
        <Backpack className="w-4 h-4" /> Equipment
      </TabsTrigger>
      <TabsTrigger
        value="monsters"
        className="flex items-center gap-1.5"
        onClick={onWarmMonsters}
        onFocus={onWarmMonsters}
        onPointerEnter={onWarmMonsters}
      >
        <Skull className="w-4 h-4" /> Monsters
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
