import { Suspense, useMemo, useState, type ComponentType } from 'react';
import { X } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
import type { SpellBrowserSpell } from '../components/SpellBrowser';
import { useSheetDispatch } from '../contexts/sheet-dispatch-context';
import { systemRegistry } from '../registry';
import type { CharacterDocument } from '../types/core/document';
import type { GameSystemId } from '../types/game-systems';
import type { Monster } from '../types/creatures/monsters';
import { KNOWN_SYSTEM_IDS } from '../utils/systemCatalogMetadata';
import {
  formatAreaOfEffect,
  formatCastingTime,
  formatDuration,
  formatRange,
} from '../utils/formatters';
import { lazyWithPreload } from '../utils/lazyWithPreload';
import { DOCK_TABS } from './dockRegistry';
import { PartyDockTab } from './PartyDockTab';
import { useDockResources } from './useDockResources';

/**
 * The summonable shared Dock (Phase 3): one component, rendered ONCE at the App
 * shell root (outside SurfaceStage) so it is reachable identically from the
 * Library, Sheet and Scene surfaces. It stands up FIVE typed tabs (party +
 * bestiary/spell/feat/equipment) on the shared `Tabs` primitive.
 *
 * The four SRD tabs re-host the shared browsers VERBATIM (kept lazy via
 * lazyWithPreload so re-hosting adds no eager index-chunk weight), keyed by an
 * explicit system selector. Spell / feat / equipment click-add dispatches into
 * the active sheet through SheetDispatchContext, hard-gated on a resolved
 * active-document id (the add affordance is hidden — a no-op — when no sheet is
 * open). Party + bestiary are browse-only in Phase 3 (drag verbs land Phase 4).
 *
 * This file is shared-layer: it value-imports NOTHING from `src/systems/**`;
 * control is inverted via SheetDispatchContext.
 */

// --- Lazy browser bodies (mirror the per-system tab lazy-load pattern) ---
type SpellBrowserProps = {
  spells: SpellBrowserSpell[];
  onSelectSpell?: (spell: SpellBrowserSpell) => void;
};
const SpellBrowser = lazyWithPreload<SpellBrowserProps>(async () => {
  const module = await import('../components/SpellBrowser');
  return { default: module.SpellBrowser as ComponentType<SpellBrowserProps> };
});

type BrowserFeat = {
  id: string;
  name: string;
  system: string;
  source: string;
  description: string;
  benefits: string[];
  prerequisites?: Array<{ type: string; description: string }>;
  manual?: boolean;
};
type FeatBrowserProps = {
  feats: BrowserFeat[];
  onSelectFeat?: (feat: BrowserFeat) => void;
};
const FeatBrowser = lazyWithPreload<FeatBrowserProps>(async () => {
  const module = await import('../components/FeatBrowser');
  return { default: module.FeatBrowser as ComponentType<FeatBrowserProps> };
});

type EquipmentBrowserItem = {
  id: string;
  name: string;
  type: string;
  rarity: string;
  cost: string;
  weight: number;
  description: string;
  properties?: string[];
};
type EquipmentBrowserProps = {
  equipment: EquipmentBrowserItem[];
  onSelectEquipment?: (item: EquipmentBrowserItem) => void;
};
const EquipmentBrowser = lazyWithPreload<EquipmentBrowserProps>(async () => {
  const module = await import('../components/EquipmentBrowser');
  return { default: module.EquipmentBrowser as ComponentType<EquipmentBrowserProps> };
});

type MonsterBrowserProps = {
  monsters: Monster[];
  onSelectMonster?: (monster: Monster) => void;
};
const MonsterBrowser = lazyWithPreload<MonsterBrowserProps>(async () => {
  const module = await import('../components/MonsterBrowser');
  return { default: module.MonsterBrowser as ComponentType<MonsterBrowserProps> };
});

function systemLabel(systemId: GameSystemId): string {
  return systemRegistry.get(systemId)?.label ?? systemId;
}

const BROWSER_FALLBACK = (
  <div className="py-8 text-center text-sm text-muted-foreground">Loading…</div>
);

interface DockProps {
  /** The App character-document roster — the party tab source. */
  documents: CharacterDocument[];
  /**
   * Initial system for the SRD catalogs (e.g. the open sheet's `systemId`,
   * a plain string). Validated against the known system set; an unknown or
   * absent value falls back to the first known system.
   */
  initialSystemId?: string;
}

export function Dock({ documents, initialSystemId }: DockProps) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>(DOCK_TABS[0].id);
  const systemIds = useMemo(() => KNOWN_SYSTEM_IDS, []);
  const [selectedSystem, setSelectedSystem] = useState<GameSystemId>(() =>
    initialSystemId && (systemIds as readonly string[]).includes(initialSystemId)
      ? (initialSystemId as GameSystemId)
      : systemIds[0]
  );

  return (
    <>
      <button
        type="button"
        aria-label="Toggle toolkit dock"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className="fixed bottom-4 right-4 z-40 flex h-12 items-center gap-2 rounded-full border bg-card px-4 text-sm font-medium shadow-lg transition-colors hover:bg-muted"
      >
        Toolkit
      </button>
      {open && (
        <aside
          aria-label="Toolkit dock"
          className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l bg-background shadow-xl"
        >
          <DockPanel
            documents={documents}
            systemIds={systemIds}
            selectedSystem={selectedSystem}
            onSelectSystem={setSelectedSystem}
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            onClose={() => setOpen(false)}
          />
        </aside>
      )}
    </>
  );
}

interface DockPanelProps {
  documents: CharacterDocument[];
  systemIds: readonly GameSystemId[];
  selectedSystem: GameSystemId;
  onSelectSystem: (systemId: GameSystemId) => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onClose: () => void;
}

function DockPanel({
  documents,
  systemIds,
  selectedSystem,
  onSelectSystem,
  activeTab,
  onSelectTab,
  onClose,
}: DockPanelProps) {
  const resources = useDockResources(selectedSystem);
  const dispatch = useSheetDispatch();

  const browserSpells = useMemo<SpellBrowserSpell[]>(
    () =>
      resources.spells.map((spell) => ({
        id: spell.id,
        name: spell.name,
        level: spell.level,
        school: spell.school,
        castingTime: formatCastingTime(spell.castingTime),
        range: formatRange(spell.range),
        duration: formatDuration(spell.duration),
        description: spell.description,
        classes: spell.classes || [],
        traditions: spell.traditions,
        tags: [...(spell.descriptors ?? []), ...(spell.traits ?? [])],
        target: spell.target,
        effect: spell.effect,
        area: spell.area ?? formatAreaOfEffect(spell.areaOfEffect),
        scaling: spell.atHigherLevels ?? spell.heightening?.summary,
      })),
    [resources.spells]
  );

  const browserFeats = useMemo<BrowserFeat[]>(
    () =>
      resources.feats.map((feat) => ({
        id: feat.id,
        name: feat.name,
        system: selectedSystem,
        source: feat.source,
        description: feat.description,
        benefits: feat.benefits,
        prerequisites: feat.prerequisites?.map((entry) => ({
          type: entry.type,
          description: entry.description || entry.type,
        })),
      })),
    [resources.feats, selectedSystem]
  );

  const browserEquipment = useMemo<EquipmentBrowserItem[]>(
    () =>
      resources.equipment.map((item) => ({
        id: item.id,
        name: item.name,
        type: item.type,
        rarity: item.rarity,
        cost: `${item.cost.amount} ${item.cost.currency}`,
        weight: item.weight,
        description: item.description,
        properties:
          'properties' in item && Array.isArray((item as { properties?: unknown }).properties)
            ? (item as { properties: unknown[] }).properties.map((property) =>
                typeof property === 'string' ? property : String(property)
              )
            : undefined,
      })),
    [resources.equipment]
  );

  return (
    <>
      <div className="flex items-center justify-between gap-2 border-b p-3">
        <h2 className="text-base font-semibold">Toolkit</h2>
        <div className="flex items-center gap-2">
          <label htmlFor="dock-system" className="sr-only">
            System
          </label>
          <select
            id="dock-system"
            value={selectedSystem}
            onChange={(event) => onSelectSystem(event.target.value as GameSystemId)}
            className="rounded-md border border-input px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Select game system"
          >
            {systemIds.map((systemId) => (
              <option key={systemId} value={systemId}>
                {systemLabel(systemId)}
              </option>
            ))}
          </select>
          <button
            type="button"
            aria-label="Close toolkit dock"
            onClick={onClose}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        <Tabs value={activeTab} defaultValue={DOCK_TABS[0].id} onValueChange={onSelectTab}>
          <TabsList className="grid w-full grid-cols-5 gap-1">
            {DOCK_TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-1.5">
                  <Icon className="h-4 w-4" /> {tab.label}
                </TabsTrigger>
              );
            })}
          </TabsList>

          <TabsContent value="party" className="space-y-4">
            <PartyDockTab documents={documents} />
          </TabsContent>

          <TabsContent value="monster" className="space-y-4">
            {resources.loading ? (
              BROWSER_FALLBACK
            ) : resources.monsters.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                No monster dataset is currently available for {systemLabel(selectedSystem)}.
              </div>
            ) : (
              <Suspense fallback={BROWSER_FALLBACK}>
                <MonsterBrowser monsters={resources.monsters} />
              </Suspense>
            )}
          </TabsContent>

          <TabsContent value="spell" className="space-y-4">
            {resources.loading ? (
              BROWSER_FALLBACK
            ) : (
              <Suspense fallback={BROWSER_FALLBACK}>
                <SpellBrowser
                  spells={browserSpells}
                  onSelectSpell={
                    dispatch.canAddSpell
                      ? (selected) => {
                          const match = resources.spells.find((entry) => entry.id === selected.id);
                          if (match) {
                            dispatch.addSpell(match);
                          }
                        }
                      : undefined
                  }
                />
              </Suspense>
            )}
          </TabsContent>

          <TabsContent value="feat" className="space-y-4">
            {resources.loading ? (
              BROWSER_FALLBACK
            ) : (
              <Suspense fallback={BROWSER_FALLBACK}>
                <FeatBrowser
                  feats={browserFeats}
                  onSelectFeat={
                    dispatch.canAddFeat
                      ? (selected) => {
                          const match = resources.feats.find((entry) => entry.id === selected.id);
                          if (match) {
                            dispatch.addFeat(match);
                          }
                        }
                      : undefined
                  }
                />
              </Suspense>
            )}
          </TabsContent>

          <TabsContent value="equipment" className="space-y-4">
            {resources.loading ? (
              BROWSER_FALLBACK
            ) : (
              <Suspense fallback={BROWSER_FALLBACK}>
                <EquipmentBrowser
                  equipment={browserEquipment}
                  onSelectEquipment={
                    dispatch.canAddEquipment
                      ? (selected) => {
                          const match = resources.equipment.find(
                            (entry) => entry.id === selected.id
                          );
                          if (match) {
                            dispatch.addEquipment(match);
                          }
                        }
                      : undefined
                  }
                />
              </Suspense>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
