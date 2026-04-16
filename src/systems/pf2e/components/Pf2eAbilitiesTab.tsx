import React from 'react';
import { abilityMod, formatMod } from '../../../utils/math';
import type { CharacterDocument } from '../../../types/core/document';
import type { Pf2eDataModel } from '../data-model';

const ABILITY_NAMES: Record<string, string> = {
  str: 'Strength',
  dex: 'Dexterity',
  con: 'Constitution',
  int: 'Intelligence',
  wis: 'Wisdom',
  cha: 'Charisma',
};

function formatPf2eOptionLabel(value: string): string {
  return (
    ABILITY_NAMES[value] ||
    value
      .split('-')
      .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
      .join(' ')
  );
}

interface Props {
  document: CharacterDocument<Pf2eDataModel>;
  canUpdate: boolean;
  selectedAncestryName?: string;
  selectedBackground?: Pf2eDataModel['backgroundId'] extends never
    ? never
    : {
        name: string;
        abilityBoosts: {
          label: string;
          options: string[];
        };
      };
  ancestryChoiceSlots: Array<{
    slotIndex: number;
    label: string;
    value: string;
    options: string[];
  }>;
  backgroundRestrictedBoost: string;
  backgroundFreeBoost: string;
  backgroundFreeBoostOptions: string[];
  onBaseAttributeChange: (ability: string, value: number) => void;
  onAncestryBoostChange: (slotIndex: number, ability: string) => void;
  onBackgroundAbilityBoostChange: (slotIndex: number, ability: string) => void;
}

export const Pf2eAbilitiesTab: React.FC<Props> = ({
  document,
  canUpdate,
  selectedAncestryName,
  selectedBackground,
  ancestryChoiceSlots,
  backgroundRestrictedBoost,
  backgroundFreeBoost,
  backgroundFreeBoostOptions,
  onBaseAttributeChange,
  onAncestryBoostChange,
  onBackgroundAbilityBoostChange,
}) => {
  const data = document.system;

  return (
    <section className="space-y-4">
      <h3 className="text-lg font-semibold mb-3">Ability Scores</h3>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {Object.entries(ABILITY_NAMES).map(([key, name]) => {
          const score = data.baseAttributes[key] ?? 10;
          const mod = abilityMod(score);

          return (
            <div
              key={key}
              className="flex flex-col items-center p-3 bg-card border rounded-lg hover:shadow-sm transition-shadow"
            >
              <span className="text-xs font-semibold text-muted-foreground uppercase">{key}</span>
              <input
                type="number"
                value={score}
                onChange={(event) => onBaseAttributeChange(key, Number(event.target.value))}
                className="w-14 text-center text-lg font-bold bg-transparent border-b border-input focus:outline-none focus:border-primary tabular-nums"
                disabled={!canUpdate}
                title={`${name} score`}
              />
              <span className="text-sm font-medium tabular-nums">{formatMod(mod)}</span>
              <span className="text-xs text-muted-foreground">{name}</span>
            </div>
          );
        })}
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        <div className="bg-card border rounded-lg p-4">
          <div className="text-xs font-medium text-muted-foreground uppercase mb-2">
            Ancestry Summary
          </div>
          <div className="text-sm">
            <span className="font-medium">Size:</span> {data.size}
          </div>
          <div className="text-sm mt-2">
            <span className="font-medium">Languages:</span>{' '}
            {data.languages.length > 0 ? data.languages.join(', ') : 'None'}
          </div>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <div className="text-xs font-medium text-muted-foreground uppercase mb-2">
            Build Choices
          </div>
          <div className="space-y-3">
            {ancestryChoiceSlots.length > 0 && (
              <div className="space-y-2">
                <div className="text-sm font-medium">{selectedAncestryName} ability boosts</div>
                {ancestryChoiceSlots.map((slot) => (
                  <label key={slot.slotIndex} className="block space-y-1">
                    <span className="text-xs text-muted-foreground">{slot.label}</span>
                    <select
                      value={slot.value}
                      onChange={(event) =>
                        onAncestryBoostChange(slot.slotIndex, event.target.value)
                      }
                      className="w-full px-2 py-1 border border-input rounded bg-transparent focus:outline-none focus:border-primary text-sm"
                      disabled={!canUpdate}
                      aria-label={`Ancestry boost ${slot.slotIndex + 1}`}
                    >
                      <option value="">Select ability...</option>
                      {slot.options.map((option) => (
                        <option key={option} value={option}>
                          {formatPf2eOptionLabel(option)}
                        </option>
                      ))}
                    </select>
                  </label>
                ))}
              </div>
            )}
            {selectedBackground && (
              <div className="space-y-2">
                <div className="text-sm font-medium">{selectedBackground.name} ability boosts</div>
                <label className="block space-y-1">
                  <span className="text-xs text-muted-foreground">
                    {selectedBackground.abilityBoosts.label}
                  </span>
                  <select
                    value={backgroundRestrictedBoost}
                    onChange={(event) => onBackgroundAbilityBoostChange(0, event.target.value)}
                    className="w-full px-2 py-1 border border-input rounded bg-transparent focus:outline-none focus:border-primary text-sm"
                    disabled={!canUpdate}
                    aria-label="Background restricted boost"
                  >
                    <option value="">Select listed boost...</option>
                    {selectedBackground.abilityBoosts.options.map((option) => (
                      <option key={option} value={option}>
                        {formatPf2eOptionLabel(option)}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block space-y-1">
                  <span className="text-xs text-muted-foreground">Free ability boost</span>
                  <select
                    value={backgroundFreeBoost}
                    onChange={(event) => onBackgroundAbilityBoostChange(1, event.target.value)}
                    className="w-full px-2 py-1 border border-input rounded bg-transparent focus:outline-none focus:border-primary text-sm"
                    disabled={!canUpdate}
                    aria-label="Background free boost"
                  >
                    <option value="">Select free boost...</option>
                    {backgroundFreeBoostOptions.map((option) => (
                      <option key={option} value={option}>
                        {formatPf2eOptionLabel(option)}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            )}
            {ancestryChoiceSlots.length === 0 && !selectedBackground && (
              <p className="text-sm text-muted-foreground">
                Choose an ancestry or background to apply build-time boosts automatically.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
