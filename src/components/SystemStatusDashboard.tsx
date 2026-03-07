import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import {
  CheckCircle,
  Loader,
  BookOpen,
  Shield,
  Users,
  Sword,
  AlertCircle,
  Database,
  Scroll,
  Sparkles,
  Star,
  Wand2,
} from 'lucide-react';
import { Skeleton } from './ui/Skeleton';
import { GameSystemId } from '../types/game-systems';
import type {
  SystemCatalogSummary,
  SystemContentCategoryId,
  SystemSupportLevel,
} from '../types/system-catalog';
import { systemRegistry } from '../registry';
import { KNOWN_SYSTEM_IDS, loadSystemCatalogSummary } from '../utils/systemCatalog';

interface SummaryState {
  status: 'loading' | 'ready' | 'error';
  summary?: SystemCatalogSummary;
}

const categoryDisplay: Record<
  SystemContentCategoryId,
  { icon: React.ReactNode; colorClass: string }
> = {
  spells: { icon: <BookOpen className="w-4 h-4" />, colorClass: 'text-blue-500' },
  classes: { icon: <Shield className="w-4 h-4" />, colorClass: 'text-purple-500' },
  species: { icon: <Users className="w-4 h-4" />, colorClass: 'text-orange-500' },
  featureOptions: { icon: <Sparkles className="w-4 h-4" />, colorClass: 'text-fuchsia-500' },
  backgrounds: { icon: <Scroll className="w-4 h-4" />, colorClass: 'text-cyan-500' },
  traits: { icon: <Sparkles className="w-4 h-4" />, colorClass: 'text-pink-500' },
  archetypes: { icon: <Shield className="w-4 h-4" />, colorClass: 'text-indigo-500' },
  complications: { icon: <AlertCircle className="w-4 h-4" />, colorClass: 'text-amber-500' },
  monsters: { icon: <Users className="w-4 h-4" />, colorClass: 'text-red-500' },
  equipment: { icon: <Sword className="w-4 h-4" />, colorClass: 'text-green-500' },
  feats: { icon: <Star className="w-4 h-4" />, colorClass: 'text-amber-500' },
  advantages: { icon: <Sparkles className="w-4 h-4" />, colorClass: 'text-violet-500' },
  powerModifiers: { icon: <Wand2 className="w-4 h-4" />, colorClass: 'text-sky-500' },
};

const supportBadgeStyles: Record<SystemSupportLevel, string> = {
  full: 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/20',
  partial: 'bg-amber-500/10 text-amber-700 border border-amber-500/20',
  scaffold: 'bg-slate-500/10 text-slate-700 border border-slate-500/20',
};

const supportBadgeLabels: Record<SystemSupportLevel, string> = {
  full: 'Full',
  partial: 'Partial',
  scaffold: 'Scaffold',
};

const StatCell = ({
  icon,
  value,
  label,
  colorClass,
  loading,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
  colorClass: string;
  loading: boolean;
}) => (
  <div className="flex items-center gap-2 text-sm">
    <span className={colorClass}>{icon}</span>
    <div>
      {loading ? (
        <Skeleton className="h-4 w-8 mb-1" />
      ) : (
        <div className="font-semibold tabular-nums">{value.toLocaleString()}</div>
      )}
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  </div>
);

export const SystemStatusDashboard: React.FC = () => {
  const [summaries, setSummaries] = useState<Record<GameSystemId, SummaryState>>({
    'dnd-5e-2024': { status: 'loading' },
    'dnd-5e-2014': { status: 'loading' },
    pf2e: { status: 'loading' },
    'dnd-3.5e': { status: 'loading' },
    pf1e: { status: 'loading' },
    mam3e: { status: 'loading' },
    daggerheart: { status: 'loading' },
  });

  useEffect(() => {
    let canceled = false;

    void Promise.all(
      KNOWN_SYSTEM_IDS.map(async (systemId) => {
        try {
          const summary = await loadSystemCatalogSummary(systemId);
          if (!canceled) {
            setSummaries((prev) => ({
              ...prev,
              [systemId]: {
                status: 'ready',
                summary,
              },
            }));
          }
        } catch (error) {
          if (!canceled) {
            setSummaries((prev) => ({
              ...prev,
              [systemId]: {
                ...prev[systemId],
                status: 'error',
              },
            }));
          }
        }
      })
    );

    return () => {
      canceled = true;
    };
  }, []);

  const supportedSystemIds = useMemo(() => {
    return systemRegistry
      .getAll()
      .filter((system) => system.supportLevel !== 'scaffold')
      .map((system) => system.id as GameSystemId);
  }, []);

  const readySupportedCount = supportedSystemIds.filter(
    (systemId) => summaries[systemId]?.status === 'ready'
  ).length;
  const totalSupportedSystems = supportedSystemIds.length;

  const aggregateCounts = useMemo(() => {
    const totals = new Map<SystemContentCategoryId, { label: string; value: number }>();

    Object.values(summaries).forEach((state) => {
      state.summary?.categories
        .filter((category) => category.reachability === 'product')
        .forEach((category) => {
          const current = totals.get(category.id);
          if (current) {
            current.value += category.count;
            return;
          }

          totals.set(category.id, {
            label: category.label,
            value: category.count,
          });
        });
    });

    return [...totals.entries()]
      .filter(([, entry]) => entry.value > 0)
      .sort((left, right) => right[1].value - left[1].value);
  }, [summaries]);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center gap-2">
            <Database className="w-5 h-5" />
            Content Database
          </CardTitle>
          <span className="text-sm text-muted-foreground">
            {readySupportedCount}/{totalSupportedSystems} supported systems loaded
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {KNOWN_SYSTEM_IDS.map((systemId) => {
            const state = summaries[systemId];
            const summary = state.summary;
            const isLoading = state.status === 'loading';
            const isError = state.status === 'error';
            const visibleCategories =
              summary?.categories.filter(
                (category) => category.reachability === 'product' && category.count > 0
              ) ?? [];
            const sourceFilteredNotes =
              summary?.categories.filter(
                (category) => category.reachability === 'source-filtered'
              ) ?? [];

            return (
              <div
                key={systemId}
                className={`p-4 border rounded-lg transition-all duration-200 ${
                  isError
                    ? 'border-destructive/50 bg-destructive/5'
                    : state.status === 'ready'
                      ? 'border-input hover:border-primary/30 hover:shadow-sm'
                      : 'border-input'
                }`}
              >
                <div className="flex items-center justify-between mb-3 gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold">{summary?.label ?? systemId}</h3>
                    {summary && (
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${supportBadgeStyles[summary.supportLevel]}`}
                      >
                        {supportBadgeLabels[summary.supportLevel]}
                      </span>
                    )}
                    {summary?.supportLevel !== 'scaffold' && state.status === 'ready' && (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                    {isLoading && <Loader className="w-4 h-4 animate-spin text-muted-foreground" />}
                    {isError && <AlertCircle className="w-4 h-4 text-destructive" />}
                  </div>
                  {summary && state.status === 'ready' && summary.supportLevel !== 'scaffold' && (
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {summary.totalReachableCount} total reachable entries
                    </span>
                  )}
                </div>

                {summary?.supportNotes && (
                  <p className="mb-3 text-sm text-muted-foreground">{summary.supportNotes}</p>
                )}

                {summary?.supportLevel === 'scaffold' ? (
                  <div className="text-sm text-muted-foreground">
                    No loader-backed content is available for this scaffold system.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {isLoading ? (
                      <>
                        <StatCell
                          icon={categoryDisplay.spells.icon}
                          value={0}
                          label="Loading"
                          colorClass={categoryDisplay.spells.colorClass}
                          loading
                        />
                        <StatCell
                          icon={categoryDisplay.classes.icon}
                          value={0}
                          label="Loading"
                          colorClass={categoryDisplay.classes.colorClass}
                          loading
                        />
                      </>
                    ) : visibleCategories.length > 0 ? (
                      visibleCategories.map((category) => (
                        <StatCell
                          key={category.id}
                          icon={categoryDisplay[category.id].icon}
                          value={category.count}
                          label={category.label}
                          colorClass={categoryDisplay[category.id].colorClass}
                          loading={false}
                        />
                      ))
                    ) : (
                      <div className="col-span-full text-sm text-muted-foreground">
                        No summarized product content is available.
                      </div>
                    )}
                  </div>
                )}

                {sourceFilteredNotes.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                    {sourceFilteredNotes.map((category) => (
                      <span
                        key={category.id}
                        className="rounded-full border border-dashed border-input px-2 py-1"
                      >
                        {category.label}: {category.note}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
          <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider text-muted-foreground">
            Reachable Content Totals
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 text-center">
            {aggregateCounts.map(([categoryId, entry]) => (
              <div key={categoryId}>
                <div className="text-2xl font-bold text-primary tabular-nums">
                  {readySupportedCount === totalSupportedSystems
                    ? entry.value.toLocaleString()
                    : '—'}
                </div>
                <div className="text-xs text-muted-foreground">{entry.label}</div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
