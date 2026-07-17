import React, { Suspense } from 'react';
import type { Spell } from '../../../types/magic/spells';
import type { Power } from '../../../types/mam/powers';
import type { PowerModifier } from '../../../data/mutants-and-masterminds/3e/modifiers/extras';
import { lazyWithPreload } from '../../../utils/lazyWithPreload';
import { MamResourceLoadError } from './MamResourceLoadError';

const SpellBrowser = lazyWithPreload(async () => {
  const module = await import('../../../components/SpellBrowser');
  return { default: module.SpellBrowser };
});

const MamPowerModifierBrowser = lazyWithPreload(async () => {
  const module = await import('./MamPowerModifierBrowser');
  return { default: module.MamPowerModifierBrowser };
});

function humanizeMamToken(value: string): string {
  return value
    .split(/[-_]/g)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');
}

function formatMamPowerAction(power: Power): string {
  return humanizeMamToken(power.action);
}

function formatMamPowerRange(power: Power): string {
  return humanizeMamToken(power.range);
}

function formatMamPowerDuration(power: Power): string {
  return humanizeMamToken(power.duration);
}

interface Props {
  powersLoaded: boolean;
  powersError?: boolean;
  powers: Spell[];
  powerModifiersLoaded: boolean;
  powerModifiersError?: boolean;
  onRetryPowerBrowser?: () => void;
  modifierCatalog: PowerModifier[];
}

type MamPowerBrowserTabComponent = React.FC<Props> & {
  preload: () => Promise<unknown>;
};

export const MamPowerBrowserTab = (({
  powersLoaded,
  powersError,
  powers,
  powerModifiersLoaded,
  powerModifiersError,
  onRetryPowerBrowser,
  modifierCatalog,
}) => (
  <div className="space-y-4">
    {powersError && !powersLoaded ? (
      <MamResourceLoadError resourceLabel="the M&M power catalog" onRetry={onRetryPowerBrowser} />
    ) : !powersLoaded ? (
      <div className="text-center py-8 text-muted-foreground">Click to load powers...</div>
    ) : (
      <Suspense
        fallback={
          <div className="text-center py-8 text-muted-foreground text-sm">
            Loading Power Browser...
          </div>
        }
      >
        <SpellBrowser
          spells={powers.map((spell) => {
            const power = spell as unknown as Power;

            return {
              id: spell.id,
              name: spell.name,
              level: power.rank ?? 0,
              school: humanizeMamToken(power.type).toLowerCase(),
              castingTime: formatMamPowerAction(power),
              range: formatMamPowerRange(power),
              components: '',
              duration: formatMamPowerDuration(power),
              description: spell.description,
              source: spell.source,
              classes: [humanizeMamToken(power.type)],
            };
          })}
          // M&M vocabulary: rank rides `level`, power type rides `school` and
          // `classes`, the action rides `castingTime` — so the captions must say
          // Rank/Type/Action, never the browser's default spell terms.
          labels={{
            nounPlural: 'powers',
            searchPlaceholder: 'Search powers by name or description...',
            searchAria: 'Search powers',
            level: 'Rank',
            levelAria: 'Filter by power rank',
            levelZero: 'Rank 0',
            levelPrefix: 'Rank',
            allLevels: 'All Ranks',
            school: 'Type',
            schoolAria: 'Filter by power type',
            allSchools: 'All Types',
            classLabel: 'Type',
            classAria: 'Filter by type',
            allClasses: 'All Types',
            castingTime: 'Action',
            empty: 'No powers found matching your criteria.',
          }}
        />
      </Suspense>
    )}

    {powerModifiersLoaded ? (
      <Suspense
        fallback={
          <div className="text-center py-8 text-muted-foreground text-sm">
            Loading Modifier Catalog...
          </div>
        }
      >
        <MamPowerModifierBrowser modifiers={modifierCatalog} />
      </Suspense>
    ) : powerModifiersError ? (
      <MamResourceLoadError
        resourceLabel="the M&M modifier catalog"
        onRetry={onRetryPowerBrowser}
      />
    ) : (
      <div className="text-center py-8 text-muted-foreground">Loading modifier catalog...</div>
    )}
  </div>
)) as MamPowerBrowserTabComponent;

MamPowerBrowserTab.preload = () =>
  Promise.all([SpellBrowser.preload(), MamPowerModifierBrowser.preload()]);
