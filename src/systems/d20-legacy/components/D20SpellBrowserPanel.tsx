import React, { Suspense } from 'react';
import type { SpellBrowserSpell } from '../../../components/SpellBrowser';
import type { Spell } from '../../../types/magic/spells';
import {
  formatAreaOfEffect,
  formatCastingTime,
  formatDuration,
  formatRange,
} from '../../../utils/formatters';
import { lazyWithPreload } from '../../../utils/lazyWithPreload';

const SpellBrowser = lazyWithPreload(async () => {
  const module = await import('../../../components/SpellBrowser');
  return { default: module.SpellBrowser };
});

interface Props {
  spells: Spell[];
  onSelectSpell?: (spell: Spell) => void;
}

function toSpellBrowserSpell(spell: Spell): SpellBrowserSpell {
  return {
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
  };
}

type D20SpellBrowserPanelComponent = React.FC<Props> & {
  preload: () => Promise<unknown>;
};

export const D20SpellBrowserPanel = (({ spells, onSelectSpell }: Props) => (
  <Suspense
    fallback={
      <div className="text-center py-8 text-muted-foreground text-sm">Loading Spell Browser...</div>
    }
  >
    <SpellBrowser
      spells={spells.map(toSpellBrowserSpell)}
      onSelectSpell={
        onSelectSpell
          ? (selectedSpell) => {
              const original = spells.find((spell) => spell.id === selectedSpell.id);
              if (original) {
                onSelectSpell(original);
              }
            }
          : undefined
      }
    />
  </Suspense>
)) as D20SpellBrowserPanelComponent;

D20SpellBrowserPanel.preload = () => SpellBrowser.preload();
