import React, { useState, useMemo, useCallback, useDeferredValue } from 'react';
import { Search, Filter, Skull } from 'lucide-react';
import { Monster } from '../types/creatures/monsters';
import type { DragSourceHandlers } from './drag/dragTypes';

interface MonsterBrowserProps {
  monsters: Monster[];
  onSelectMonster?: (monster: Monster) => void;
  /**
   * Optional per-row drag handlers (Phase 4). When provided (the scene-drag
   * flag is on in the Dock) each statblock row becomes a drag SOURCE carrying a
   * {monsterId} payload. Absent everywhere else, so no other usage changes.
   */
  getItemDragHandlers?: (monster: Monster) => DragSourceHandlers;
}

/** 5e CR → XP awards (DMG/SRD), used when a CR bucket carries no XP data. */
const CR_XP_TABLE: Record<string, number> = {
  '0': 10,
  '0.125': 25,
  '0.25': 50,
  '0.5': 100,
  '1': 200,
  '2': 450,
  '3': 700,
  '4': 1100,
  '5': 1800,
  '6': 2300,
  '7': 2900,
  '8': 3900,
  '9': 5000,
  '10': 5900,
  '11': 7200,
  '12': 8400,
  '13': 10000,
  '14': 11500,
  '15': 13000,
  '16': 15000,
  '17': 18000,
  '18': 20000,
  '19': 22000,
  '20': 25000,
  '21': 33000,
  '22': 41000,
  '23': 50000,
  '24': 62000,
  '25': 75000,
  '26': 90000,
  '27': 105000,
  '28': 120000,
  '29': 135000,
  '30': 155000,
};

/** Render fractional CRs the way the books do (1/8, 1/4, 1/2). */
function formatChallengeRating(cr: number): string {
  if (cr === 0.125) return '1/8';
  if (cr === 0.25) return '1/4';
  if (cr === 0.5) return '1/2';
  return `${cr}`;
}

export const MonsterBrowser: React.FC<MonsterBrowserProps> = ({
  monsters,
  onSelectMonster,
  getItemDragHandlers,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const deferredSearchTerm = useDeferredValue(searchTerm);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedCR, setSelectedCR] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const types = useMemo(() => [...new Set(monsters.map((m) => m.type))].sort(), [monsters]);

  const challengeRatings = useMemo(
    () => [...new Set(monsters.map((m) => m.challengeRating))].sort((a, b) => a - b),
    [monsters]
  );

  const crExperiencePoints = useMemo(() => {
    const xpByCR = new Map<number, number>();
    for (const monster of monsters) {
      if (!xpByCR.has(monster.challengeRating) && monster.experiencePoints >= 0) {
        xpByCR.set(monster.challengeRating, monster.experiencePoints);
      }
    }
    return xpByCR;
  }, [monsters]);

  const sizes = useMemo(() => [...new Set(monsters.map((m) => m.size))].sort(), [monsters]);

  const searchHaystacks = useMemo(() => {
    const haystacks = new Map<string, string>();
    for (const monster of monsters) {
      const abilityText = (monster.specialAbilities ?? [])
        .map((ability) => `${ability.name} ${ability.description}`)
        .join(' ');
      haystacks.set(monster.id, `${monster.name} ${abilityText}`.toLowerCase());
    }
    return haystacks;
  }, [monsters]);

  const filteredMonsters = useMemo(() => {
    const normalizedSearch = deferredSearchTerm.trim().toLowerCase();

    return monsters.filter((monster) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        (searchHaystacks.get(monster.id) ?? '').includes(normalizedSearch);

      const matchesType = selectedType === null || monster.type === selectedType;

      const matchesCR = selectedCR === null || monster.challengeRating.toString() === selectedCR;

      const matchesSize = selectedSize === null || monster.size === selectedSize;

      return matchesSearch && matchesType && matchesCR && matchesSize;
    });
  }, [monsters, searchHaystacks, deferredSearchTerm, selectedType, selectedCR, selectedSize]);

  const getCRLabel = useCallback(
    (cr: number) => {
      const xp = crExperiencePoints.get(cr) ?? CR_XP_TABLE[`${cr}`];
      if (cr < 1) {
        return xp != null
          ? `CR ${formatChallengeRating(cr)} (${xp} XP)`
          : `CR ${formatChallengeRating(cr)}`;
      }
      return `CR ${cr}`;
    },
    [crExperiencePoints]
  );

  const handleClearFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedType(null);
    setSelectedCR(null);
    setSelectedSize(null);
  }, []);

  return (
    <div className="w-full space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search monsters by name or ability..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="Search monsters"
        />
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Type Filter */}
        <div>
          <label className="block text-sm font-medium mb-2">Type</label>
          <select
            value={selectedType ?? ''}
            onChange={(e) => setSelectedType(e.target.value || null)}
            className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Filter by creature type"
          >
            <option value="">All Types</option>
            {types.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Challenge Rating Filter */}
        <div>
          <label className="block text-sm font-medium mb-2">Challenge Rating</label>
          <select
            value={selectedCR ?? ''}
            onChange={(e) => setSelectedCR(e.target.value || null)}
            className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Filter by challenge rating"
          >
            <option value="">All CRs</option>
            {challengeRatings.map((cr) => (
              <option key={cr} value={cr}>
                {getCRLabel(cr)}
              </option>
            ))}
          </select>
        </div>

        {/* Size Filter */}
        <div>
          <label className="block text-sm font-medium mb-2">Size</label>
          <select
            value={selectedSize ?? ''}
            onChange={(e) => setSelectedSize(e.target.value || null)}
            className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Filter by creature size"
          >
            <option value="">All Sizes</option>
            {sizes.map((size) => (
              <option key={size} value={size}>
                {size.charAt(0).toUpperCase() + size.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Clear Filters */}
        <div className="flex items-end">
          <button
            type="button"
            onClick={handleClearFilters}
            className="w-full px-4 py-2 border border-input rounded-lg hover:bg-muted transition-all"
          >
            <Filter className="w-4 h-4 inline mr-2" />
            Clear Filters
          </button>
        </div>
      </div>

      {/* Results */}
      <div>
        <p className="text-sm text-muted-foreground mb-4" aria-live="polite" aria-atomic="true">
          Showing {filteredMonsters.length} of {monsters.length} monsters
        </p>

        <div className="grid grid-cols-1 gap-4">
          {filteredMonsters.length > 0 ? (
            filteredMonsters.map((monster) => (
              <button
                type="button"
                key={monster.id}
                onClick={() => onSelectMonster?.(monster)}
                {...getItemDragHandlers?.(monster)}
                className={`w-full p-4 border border-input rounded-lg text-left hover:border-primary/50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all${
                  getItemDragHandlers ? ' cursor-grab' : ' cursor-pointer'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    <Skull className="w-6 h-6 text-destructive" />
                    <div>
                      <h3 className="font-semibold text-lg">{monster.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {monster.size.charAt(0).toUpperCase() + monster.size.slice(1)}{' '}
                        {monster.type} • {monster.alignment}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs bg-destructive/10 text-destructive px-2 py-1 rounded font-medium">
                      CR {formatChallengeRating(monster.challengeRating)}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {monster.experiencePoints} XP
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                  <div>
                    <span className="font-medium">AC:</span> {monster.armorClass}
                  </div>
                  <div>
                    <span className="font-medium">HP:</span>{' '}
                    {monster.hitPoints.notation ||
                      `${monster.hitPoints.count}d${monster.hitPoints.die}`}
                  </div>
                  <div>
                    <span className="font-medium">Speed:</span>{' '}
                    {typeof monster.speed === 'number'
                      ? `${monster.speed} ft.`
                      : Object.entries(monster.speed)
                          .map(([k, v]) => `${k} ${v} ft.`)
                          .join(', ')}
                  </div>
                </div>

                {monster.specialAbilities && monster.specialAbilities.length > 0 && (
                  <div className="text-sm">
                    <span className="font-medium">Abilities:</span>{' '}
                    <span className="text-muted-foreground">
                      {monster.specialAbilities
                        .slice(0, 3)
                        .map((a) => a.name)
                        .join(', ')}
                      {monster.specialAbilities.length > 3 && '...'}
                    </span>
                  </div>
                )}
              </button>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Skull className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No monsters found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
