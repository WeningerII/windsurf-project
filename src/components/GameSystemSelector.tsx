import { useEffect, useState, type ReactNode } from 'react';
import { GameSystemId } from '../types/game-systems';
import type { SystemCatalogSummary, SystemContentCategoryId } from '../types/system-catalog';
import { systemRegistry } from '../registry';
import { errorLogger, ErrorCategory, ErrorSeverity } from '../utils/errorLogger';
import { supportBadgeLabels, supportBadgeStyles } from './shared/supportBadges';
import {
  BookOpen,
  Shield,
  Users,
  Sword,
  Sparkles,
  Scroll,
  Flame,
  Wand2,
  Swords,
  Zap,
  Star,
  AlertTriangle,
} from 'lucide-react';
import { loadAllSystemCatalogSummariesFromMetadata } from '../utils/systemCatalogMetadata';

interface GameSystemSelectorProps {
  selectedSystem: GameSystemId | null;
  onSelect: (systemId: GameSystemId) => void;
}

const systemAccents: Record<GameSystemId, { icon: ReactNode; gradient: string; accent: string }> = {
  'dnd-5e-2024': {
    icon: <Sparkles className="w-6 h-6" />,
    gradient: 'from-red-500/10 to-amber-500/10',
    accent: 'text-red-500 dark:text-red-400',
  },
  'dnd-5e-2014': {
    icon: <Scroll className="w-6 h-6" />,
    gradient: 'from-red-500/10 to-orange-500/10',
    accent: 'text-red-600 dark:text-red-400',
  },
  pf2e: {
    icon: <Flame className="w-6 h-6" />,
    gradient: 'from-blue-500/10 to-cyan-500/10',
    accent: 'text-blue-600 dark:text-blue-400',
  },
  'dnd-3.5e': {
    icon: <Wand2 className="w-6 h-6" />,
    gradient: 'from-amber-500/10 to-yellow-500/10',
    accent: 'text-amber-600 dark:text-amber-400',
  },
  pf1e: {
    icon: <Swords className="w-6 h-6" />,
    gradient: 'from-emerald-500/10 to-teal-500/10',
    accent: 'text-emerald-600 dark:text-emerald-400',
  },
  mam3e: {
    icon: <Zap className="w-6 h-6" />,
    gradient: 'from-purple-500/10 to-pink-500/10',
    accent: 'text-purple-600 dark:text-purple-400',
  },
  daggerheart: {
    icon: <Sword className="w-6 h-6" />,
    gradient: 'from-rose-500/10 to-violet-500/10',
    accent: 'text-rose-600 dark:text-rose-400',
  },
};

const categoryIcons: Record<SystemContentCategoryId, ReactNode> = {
  spells: <BookOpen className="w-3.5 h-3.5 shrink-0" />,
  powers: <Sparkles className="w-3.5 h-3.5 shrink-0" />,
  classes: <Shield className="w-3.5 h-3.5 shrink-0" />,
  domains: <Sparkles className="w-3.5 h-3.5 shrink-0" />,
  domainCards: <Scroll className="w-3.5 h-3.5 shrink-0" />,
  species: <Users className="w-3.5 h-3.5 shrink-0" />,
  featureOptions: <Sparkles className="w-3.5 h-3.5 shrink-0" />,
  backgrounds: <Scroll className="w-3.5 h-3.5 shrink-0" />,
  traits: <Sparkles className="w-3.5 h-3.5 shrink-0" />,
  archetypes: <Shield className="w-3.5 h-3.5 shrink-0" />,
  complications: <AlertTriangle className="w-3.5 h-3.5 shrink-0" />,
  monsters: <Users className="w-3.5 h-3.5 shrink-0" />,
  equipment: <Sword className="w-3.5 h-3.5 shrink-0" />,
  feats: <Star className="w-3.5 h-3.5 shrink-0" />,
  advantages: <Sparkles className="w-3.5 h-3.5 shrink-0" />,
  powerModifiers: <Wand2 className="w-3.5 h-3.5 shrink-0" />,
};

export function GameSystemSelector({ selectedSystem, onSelect }: GameSystemSelectorProps) {
  const [summaries, setSummaries] = useState<Partial<Record<GameSystemId, SystemCatalogSummary>>>(
    {}
  );

  useEffect(() => {
    let canceled = false;
    const systemIds = systemRegistry.getAll().map((system) => system.id as GameSystemId);

    loadAllSystemCatalogSummariesFromMetadata(systemIds)
      .then((loadedSummaries) => {
        if (!canceled) {
          setSummaries(loadedSummaries);
        }
      })
      .catch((error: unknown) => {
        if (!canceled) {
          errorLogger.log(
            ErrorCategory.DATA_LOAD,
            ErrorSeverity.LOW,
            'Failed to load system catalog summaries',
            error instanceof Error ? error : undefined
          );
        }
      });

    return () => {
      canceled = true;
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {systemRegistry.getAll().map((system) => {
          const systemId = system.id as GameSystemId;
          const summary = summaries[systemId];
          const visual = systemAccents[systemId];
          const isSelected = selectedSystem === system.id;
          const visibleCategories =
            summary?.categories
              .filter((category) => category.reachability === 'product' && category.count > 0)
              .slice(0, 4) ?? [];

          return (
            <button
              key={system.id}
              onClick={() => onSelect(systemId)}
              className={`group relative p-6 rounded-xl border-2 transition-all duration-200 text-left hover:shadow-lg hover:-translate-y-0.5 ${
                isSelected
                  ? 'border-primary bg-primary/5 shadow-md ring-2 ring-primary/20'
                  : 'border-input hover:border-primary/50'
              }`}
            >
              <div
                className={`absolute inset-0 rounded-xl bg-gradient-to-br ${visual.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
              />
              <div className="relative">
                <div className="flex items-start justify-between mb-3 gap-2">
                  <div className={`p-2 rounded-lg bg-card border ${visual.accent}`}>
                    {visual.icon}
                  </div>
                  <div className="flex flex-wrap justify-end gap-1.5">
                    {summary && summary.supportLevel !== 'full' && (
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${supportBadgeStyles[summary.supportLevel]}`}
                      >
                        {supportBadgeLabels[summary.supportLevel]}
                      </span>
                    )}
                    {isSelected && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                        Selected
                      </span>
                    )}
                  </div>
                </div>
                <h3 className="font-semibold text-lg mb-0.5">{system.label}</h3>
                <p className="text-xs text-muted-foreground">{system.version}</p>
                {summary?.supportNotes && (
                  <p className="mt-1 text-xs text-muted-foreground">{summary.supportNotes}</p>
                )}

                <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs min-h-[3rem]">
                  {!summary ? (
                    <div className="col-span-2 text-muted-foreground">
                      Loading content summary...
                    </div>
                  ) : visibleCategories.length > 0 ? (
                    visibleCategories.map((category) => (
                      <div
                        key={category.id}
                        className="flex items-center gap-1.5 text-muted-foreground"
                      >
                        {categoryIcons[category.id]}
                        <span>
                          {category.count} {category.label.toLowerCase()}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 text-muted-foreground">
                      {summary.supportLevel === 'scaffold'
                        ? 'No loader-backed content yet'
                        : 'No summarized content available'}
                    </div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
