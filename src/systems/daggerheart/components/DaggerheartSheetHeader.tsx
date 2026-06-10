import { Heart, Shield, Star, Zap } from 'lucide-react';
import { domainDisplayName } from '../daggerheartSheetConstants';
import { Badge } from '../../../components/ui/Badge';
import { DAGGERHEART_MAX_HOPE } from '../../../utils/daggerheartDerived';
import { parseNum } from '../../../utils/math';
import type { DaggerheartSheetController } from '../useDaggerheartSheetController';

interface Props {
  controller: DaggerheartSheetController;
}

export function DaggerheartSheetHeader({ controller }: Props) {
  const { data, canUpdate, loadingOptions, derivedStats } = controller;
  const unresolvedSelections = [
    controller.classValueMissing ? `Class: ${data.class}` : null,
    controller.subclassValueMissing ? `Subclass: ${data.subclass}` : null,
    controller.ancestryValueMissing ? `Ancestry: ${data.heritage}` : null,
    controller.communityValueMissing ? `Community: ${data.community}` : null,
  ].filter((entry): entry is string => Boolean(entry));

  return (
    <div className="flex flex-col gap-4 rounded-xl border bg-card p-5 shadow-sm md:flex-row md:items-start md:justify-between">
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={controller.document.name}
            onChange={(event) => controller.onNameChange(event.target.value)}
            className="w-full border-b border-transparent bg-transparent text-2xl font-bold hover:border-input focus:border-primary focus:outline-none"
            disabled={!canUpdate}
            placeholder="Character Name"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <label className="flex items-center gap-2">
            <span className="text-muted-foreground">Ancestry:</span>
            <select
              value={data.heritage}
              onChange={(event) => controller.handleAncestryChange(event.target.value)}
              className="min-w-[9rem] rounded border border-input bg-transparent px-2 py-0.5 text-sm focus:border-primary focus:outline-none"
              disabled={!canUpdate || loadingOptions}
              title="Ancestry"
            >
              <option value="">
                {loadingOptions ? 'Loading ancestries...' : 'Select ancestry...'}
              </option>
              {controller.ancestryValueMissing && (
                <option value={data.heritage}>{data.heritage} (manual)</option>
              )}
              {controller.ancestryOptions.map((entry) => (
                <option key={entry.id} value={entry.name}>
                  {entry.name}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2">
            <span className="text-muted-foreground">Community:</span>
            <select
              value={data.community}
              onChange={(event) => controller.handleCommunityChange(event.target.value)}
              className="min-w-[9rem] rounded border border-input bg-transparent px-2 py-0.5 text-sm focus:border-primary focus:outline-none"
              disabled={!canUpdate || loadingOptions}
              title="Community"
            >
              <option value="">
                {loadingOptions ? 'Loading communities...' : 'Select community...'}
              </option>
              {controller.communityValueMissing && (
                <option value={data.community}>{data.community} (manual)</option>
              )}
              {controller.communityOptions.map((entry) => (
                <option key={entry.id} value={entry.name}>
                  {entry.name}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2">
            <span className="text-muted-foreground">Class:</span>
            <select
              value={data.class}
              onChange={(event) => controller.handleClassChange(event.target.value)}
              className="min-w-[9rem] rounded border border-input bg-transparent px-2 py-0.5 text-sm focus:border-primary focus:outline-none"
              disabled={!canUpdate || loadingOptions}
              title="Class"
            >
              <option value="">{loadingOptions ? 'Loading classes...' : 'Select class...'}</option>
              {controller.classValueMissing && (
                <option value={data.class}>{data.class} (manual)</option>
              )}
              {controller.classOptions.map((entry) => (
                <option key={entry.id} value={entry.name}>
                  {entry.name}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2">
            <span className="text-muted-foreground">Subclass:</span>
            <select
              value={data.subclass}
              onChange={(event) => controller.update({ subclass: event.target.value })}
              className="min-w-[9rem] rounded border border-input bg-transparent px-2 py-0.5 text-sm focus:border-primary focus:outline-none"
              disabled={!canUpdate || loadingOptions || controller.subclassOptions.length === 0}
              title="Subclass"
            >
              <option value="">
                {controller.selectedClass ? 'Select subclass...' : 'Choose a class first'}
              </option>
              {controller.subclassValueMissing && (
                <option value={data.subclass}>{data.subclass} (manual)</option>
              )}
              {controller.subclassOptions.map((entry) => (
                <option key={entry.id} value={entry.name}>
                  {entry.name}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-1">
            <span className="text-muted-foreground">Level:</span>
            <input
              type="number"
              value={data.level}
              onChange={(event) => controller.update({ level: parseNum(event.target.value, 1) })}
              className="w-12 border-b border-input bg-transparent text-center focus:border-primary focus:outline-none"
              min={1}
              max={10}
              disabled={!canUpdate}
              title="Character level"
            />
          </label>
        </div>
        {controller.optionsState === 'error' && (
          <p className="text-sm text-destructive">
            Failed to load Daggerheart SRD reference data. Existing sheet values remain editable.
          </p>
        )}
        {unresolvedSelections.length > 0 && (
          <div className="space-y-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-950 dark:text-amber-100">
            <p>
              Manual or unresolved selections remain editable, but SRD reference details are not
              available for these values.
            </p>
            <div className="flex flex-wrap gap-2">
              {unresolvedSelections.map((selection) => (
                <Badge key={selection} variant="warning">
                  {selection}
                </Badge>
              ))}
            </div>
          </div>
        )}
        {controller.selectedClass && (
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <Badge variant="info">
              Domains: {controller.selectedClass.domains.map(domainDisplayName).join(' / ')}
            </Badge>
            <Badge variant="secondary">
              SRD start: Evasion {controller.selectedClass.startingEvasion}, HP{' '}
              {controller.selectedClass.startingHitPoints}
            </Badge>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-3 text-center">
        <div className="min-w-[80px] rounded-lg bg-muted/30 p-3">
          <div className="flex items-center justify-center gap-1 text-xs font-medium text-muted-foreground">
            <Heart className="h-3 w-3" /> HP
          </div>
          <div className="mt-1 flex items-center justify-center gap-1">
            <input
              type="number"
              value={data.hitPoints.current}
              onChange={(event) =>
                controller.update({
                  hitPoints: { ...data.hitPoints, current: parseNum(event.target.value, 0) },
                })
              }
              className="w-10 border-b border-input bg-transparent text-center text-lg font-bold tabular-nums focus:border-primary focus:outline-none"
              disabled={!canUpdate}
              title="Current HP"
            />
            <span className="text-muted-foreground">/</span>
            <span className="text-lg font-bold tabular-nums">{data.hitPoints.max}</span>
          </div>
        </div>
        <div className="min-w-[80px] rounded-lg bg-muted/30 p-3">
          <div className="flex items-center justify-center gap-1 text-xs font-medium text-muted-foreground">
            <Zap className="h-3 w-3" /> Stress
          </div>
          <div className="mt-1 flex items-center justify-center gap-1">
            <input
              type="number"
              value={data.stress.current}
              onChange={(event) =>
                controller.update({
                  stress: { ...data.stress, current: parseNum(event.target.value, 0) },
                })
              }
              className="w-10 border-b border-input bg-transparent text-center text-lg font-bold tabular-nums focus:border-primary focus:outline-none"
              disabled={!canUpdate}
              title="Current Stress"
            />
            <span className="text-muted-foreground">/</span>
            <span className="text-lg font-bold tabular-nums">{data.stress.max}</span>
          </div>
        </div>
        <div className="min-w-[80px] rounded-lg bg-muted/30 p-3">
          <div className="flex items-center justify-center gap-1 text-xs font-medium text-muted-foreground">
            <Shield className="h-3 w-3" /> Armor
          </div>
          <div className="mt-1 flex items-center justify-center gap-1">
            <input
              type="number"
              value={data.armor.current}
              onChange={(event) =>
                controller.update({
                  armor: { ...data.armor, current: parseNum(event.target.value, 0) },
                })
              }
              className="w-10 border-b border-input bg-transparent text-center text-lg font-bold tabular-nums focus:border-primary focus:outline-none"
              disabled={!canUpdate}
              title="Current Armor"
            />
            <span className="text-muted-foreground">/</span>
            <span className="text-lg font-bold tabular-nums">{derivedStats.armorMax}</span>
          </div>
        </div>
        <div className="min-w-[80px] rounded-lg border border-amber-500/30 bg-amber-500/10 p-3">
          <div className="flex items-center justify-center gap-1 text-xs font-medium text-amber-600 dark:text-amber-400">
            <Star className="h-3 w-3" /> Hope
          </div>
          <input
            type="number"
            value={data.hope}
            onChange={(event) => controller.update({ hope: parseNum(event.target.value, 0) })}
            className="mx-auto mt-1 block w-10 border-b border-amber-400 bg-transparent text-center text-xl font-bold tabular-nums focus:border-amber-500 focus:outline-none"
            min={0}
            max={DAGGERHEART_MAX_HOPE}
            disabled={!canUpdate}
            title="Hope tokens"
          />
        </div>
      </div>
    </div>
  );
}
