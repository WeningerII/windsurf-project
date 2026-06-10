import React, { useState, useMemo, useCallback, useDeferredValue } from 'react';
import { Search, Filter } from 'lucide-react';

export interface SpellBrowserSpell {
  id: string;
  name: string;
  level: number;
  school: string;
  castingTime: string;
  range: string;
  duration: string;
  description: string;
  classes: string[];
  traditions?: string[];
  tags?: string[];
  target?: string;
  effect?: string;
  area?: string;
  scaling?: string;
}

interface SpellBrowserProps {
  spells: SpellBrowserSpell[];
  onSelectSpell?: (spell: SpellBrowserSpell) => void;
}

export const SpellBrowser: React.FC<SpellBrowserProps> = ({ spells, onSelectSpell }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const deferredSearchTerm = useDeferredValue(searchTerm);
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [selectedSchool, setSelectedSchool] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [selectedTradition, setSelectedTradition] = useState<string | null>(null);

  const levels = useMemo(
    () => [...new Set(spells.map((s) => s.level))].sort((a, b) => a - b),
    [spells]
  );

  const schools = useMemo(() => [...new Set(spells.map((s) => s.school))].sort(), [spells]);

  const classes = useMemo(() => [...new Set(spells.flatMap((s) => s.classes))].sort(), [spells]);

  const traditions = useMemo(
    () => [...new Set(spells.flatMap((s) => s.traditions ?? []))].sort(),
    [spells]
  );

  const searchHaystacks = useMemo(() => {
    const haystacks = new Map<string, string>();
    for (const spell of spells) {
      const searchableText = [
        spell.name,
        spell.description,
        spell.school,
        ...(spell.classes ?? []),
        ...(spell.traditions ?? []),
        ...(spell.tags ?? []),
        spell.target,
        spell.effect,
        spell.area,
        spell.scaling,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      haystacks.set(spell.id, searchableText);
    }
    return haystacks;
  }, [spells]);

  const filteredSpells = useMemo(() => {
    const normalizedSearch = deferredSearchTerm.trim().toLowerCase();

    return spells.filter((spell) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        (searchHaystacks.get(spell.id) ?? '').includes(normalizedSearch);

      const matchesLevel = selectedLevel === null || spell.level === selectedLevel;

      const matchesSchool = selectedSchool === null || spell.school === selectedSchool;

      const matchesClass = selectedClass === null || spell.classes.includes(selectedClass);

      const matchesTradition =
        selectedTradition === null || (spell.traditions ?? []).includes(selectedTradition);

      return matchesSearch && matchesLevel && matchesSchool && matchesClass && matchesTradition;
    });
  }, [
    spells,
    searchHaystacks,
    deferredSearchTerm,
    selectedLevel,
    selectedSchool,
    selectedClass,
    selectedTradition,
  ]);

  const handleClearFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedLevel(null);
    setSelectedSchool(null);
    setSelectedClass(null);
    setSelectedTradition(null);
  }, []);

  return (
    <div className="w-full space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search spells by name or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="Search spells"
        />
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Level Filter */}
        <div>
          <label className="block text-sm font-medium mb-2">Spell Level</label>
          <select
            value={selectedLevel ?? ''}
            onChange={(e) => setSelectedLevel(e.target.value ? parseInt(e.target.value) : null)}
            className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Filter by spell level"
          >
            <option value="">All Levels</option>
            {levels.map((level) => (
              <option key={level} value={level}>
                {level === 0 ? 'Cantrip' : `Level ${level}`}
              </option>
            ))}
          </select>
        </div>

        {/* School Filter */}
        <div>
          <label className="block text-sm font-medium mb-2">School</label>
          <select
            value={selectedSchool ?? ''}
            onChange={(e) => setSelectedSchool(e.target.value || null)}
            className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Filter by spell school"
          >
            <option value="">All Schools</option>
            {schools.map((school) => (
              <option key={school} value={school}>
                {school.charAt(0).toUpperCase() + school.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Class Filter */}
        <div>
          <label className="block text-sm font-medium mb-2">Class</label>
          <select
            value={selectedClass ?? ''}
            onChange={(e) => setSelectedClass(e.target.value || null)}
            className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Filter by class"
          >
            <option value="">All Classes</option>
            {classes.map((cls) => (
              <option key={cls} value={cls}>
                {cls.charAt(0).toUpperCase() + cls.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Tradition Filter */}
        <div>
          <label className="block text-sm font-medium mb-2">Tradition</label>
          <select
            value={selectedTradition ?? ''}
            onChange={(e) => setSelectedTradition(e.target.value || null)}
            className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Filter by tradition"
            disabled={traditions.length === 0}
          >
            <option value="">All Traditions</option>
            {traditions.map((tradition) => (
              <option key={tradition} value={tradition}>
                {tradition.charAt(0).toUpperCase() + tradition.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Clear Filters */}
        <div className="flex items-end">
          <button
            type="button"
            onClick={handleClearFilters}
            className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary hover:bg-muted transition-all"
          >
            <Filter className="w-4 h-4 inline mr-2" />
            Clear Filters
          </button>
        </div>
      </div>

      {/* Results */}
      <div>
        <p className="text-sm text-muted-foreground mb-4" aria-live="polite" aria-atomic="true">
          Showing {filteredSpells.length} of {spells.length} spells
        </p>

        <div className="grid grid-cols-1 gap-4">
          {filteredSpells.length > 0 ? (
            filteredSpells.map((spell) => (
              <button
                type="button"
                key={spell.id}
                onClick={() => onSelectSpell?.(spell)}
                className="w-full p-4 border border-input rounded-lg text-left hover:border-primary/50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all cursor-pointer"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-lg">{spell.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Level {spell.level} {spell.school}
                    </p>
                  </div>
                  <div className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                    {spell.classes.join(', ')}
                  </div>
                </div>

                {(spell.traditions?.length || spell.tags?.length) && (
                  <div className="mb-3 flex flex-wrap gap-2 text-xs">
                    {(spell.traditions ?? []).map((tradition) => (
                      <span
                        key={`${spell.id}-${tradition}`}
                        className="rounded-full bg-secondary px-2 py-1 text-secondary-foreground"
                      >
                        {tradition}
                      </span>
                    ))}
                    {(spell.tags ?? []).map((tag) => (
                      <span
                        key={`${spell.id}-${tag}`}
                        className="rounded-full border border-input px-2 py-1 text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                  <div>
                    <span className="font-medium">Casting Time:</span> {spell.castingTime}
                  </div>
                  <div>
                    <span className="font-medium">Range:</span> {spell.range}
                  </div>
                  <div>
                    <span className="font-medium">Duration:</span> {spell.duration}
                  </div>
                </div>

                {(spell.area || spell.target || spell.effect || spell.scaling) && (
                  <div className="mb-3 space-y-1 text-sm text-muted-foreground">
                    {spell.area && (
                      <p>
                        <span className="font-medium">Area:</span> {spell.area}
                      </p>
                    )}
                    {spell.target && (
                      <p>
                        <span className="font-medium">Target:</span> {spell.target}
                      </p>
                    )}
                    {spell.effect && (
                      <p>
                        <span className="font-medium">Effect:</span> {spell.effect}
                      </p>
                    )}
                    {spell.scaling && (
                      <p>
                        <span className="font-medium">Scaling:</span> {spell.scaling}
                      </p>
                    )}
                  </div>
                )}

                <p className="text-sm text-muted-foreground line-clamp-2">{spell.description}</p>
              </button>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No spells found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
