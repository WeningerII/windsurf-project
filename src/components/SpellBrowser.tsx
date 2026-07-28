import React, { useState, useMemo, useCallback, useDeferredValue } from 'react';
import { Search, Filter } from 'lucide-react';

export interface SpellBrowserSpell {
  id: string;
  name: string;
  /**
   * OPTIONAL, and measured rather than assumed: all 61 M&M 3e powers ship with
   * no `level` and no `school`, because a power has neither. The comment below
   * says rank rides `level` and power type rides `school` — that describes the
   * intended mapping, not the data, and the loader does not populate either.
   *
   * Declaring them required did not make them present; it only meant the
   * absence surfaced as a blank "Rank  " caption and a filter dropdown with an
   * empty option, on the one system this browser was re-labelled for. Same
   * defect class as `formatCastingTime` reading `ct.amount` on a power that has
   * no casting time (docs/GAPS.md §20.2) — a shared browser over seven
   * catalogs, typed against one of them.
   */
  level?: number;
  school?: string;
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

/**
 * Display vocabulary for the browser. The defaults are the d20 spell terms;
 * non-spell consumers override them — M&M 3e reuses this browser for POWERS
 * (rank rides `level`, power type rides `school`/`classes`, action rides
 * `castingTime`), so its captions must say Rank/Type/Action, not
 * Level/School/Casting Time.
 */
export interface SpellBrowserLabels {
  nounPlural: string;
  searchPlaceholder: string;
  searchAria: string;
  level: string;
  levelAria: string;
  levelZero: string;
  levelPrefix: string;
  allLevels: string;
  school: string;
  schoolAria: string;
  allSchools: string;
  classLabel: string;
  classAria: string;
  allClasses: string;
  castingTime: string;
  empty: string;
}

const DEFAULT_LABELS: SpellBrowserLabels = {
  nounPlural: 'spells',
  searchPlaceholder: 'Search spells by name or description...',
  searchAria: 'Search spells',
  level: 'Spell Level',
  levelAria: 'Filter by spell level',
  levelZero: 'Cantrip',
  levelPrefix: 'Level',
  allLevels: 'All Levels',
  school: 'School',
  schoolAria: 'Filter by spell school',
  allSchools: 'All Schools',
  classLabel: 'Class',
  classAria: 'Filter by class',
  allClasses: 'All Classes',
  castingTime: 'Casting Time',
  empty: 'No spells found matching your criteria.',
};

interface SpellBrowserProps {
  spells: SpellBrowserSpell[];
  onSelectSpell?: (spell: SpellBrowserSpell) => void;
  /** Partial vocabulary overrides; unset keys keep the d20 spell defaults. */
  labels?: Partial<SpellBrowserLabels>;
}

export const SpellBrowser: React.FC<SpellBrowserProps> = ({ spells, onSelectSpell, labels }) => {
  const t = { ...DEFAULT_LABELS, ...labels };
  const [searchTerm, setSearchTerm] = useState('');
  const deferredSearchTerm = useDeferredValue(searchTerm);
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [selectedSchool, setSelectedSchool] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [selectedTradition, setSelectedTradition] = useState<string | null>(null);

  // Absent level/school are dropped from the filter vocabularies rather than
  // becoming a blank option that filters to nothing. A catalog where no entry
  // has a level (M&M powers) yields an empty list, and the control below hides
  // itself instead of offering a choice that cannot narrow anything.
  const levels = useMemo(
    () =>
      [
        ...new Set(spells.map((s) => s.level).filter((l): l is number => typeof l === 'number')),
      ].sort((a, b) => a - b),
    [spells]
  );

  const schools = useMemo(
    () =>
      [
        ...new Set(
          spells.map((s) => s.school).filter((s): s is string => typeof s === 'string' && s !== '')
        ),
      ].sort(),
    [spells]
  );

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
          placeholder={t.searchPlaceholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label={t.searchAria}
        />
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Level Filter — hidden when no entry in this catalog has a level.
            A select whose only option is "All" cannot narrow anything, and
            offering it implies the catalog has a dimension it does not. */}
        {levels.length > 0 && (
          <div>
            <label className="block text-sm font-medium mb-2">{t.level}</label>
            <select
              value={selectedLevel ?? ''}
              onChange={(e) => setSelectedLevel(e.target.value ? parseInt(e.target.value) : null)}
              className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label={t.levelAria}
            >
              <option value="">{t.allLevels}</option>
              {levels.map((level) => (
                <option key={level} value={level}>
                  {level === 0 ? t.levelZero : `${t.levelPrefix} ${level}`}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* School Filter — same rule as Level above. */}
        {schools.length > 0 && (
          <div>
            <label className="block text-sm font-medium mb-2">{t.school}</label>
            <select
              value={selectedSchool ?? ''}
              onChange={(e) => setSelectedSchool(e.target.value || null)}
              className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label={t.schoolAria}
            >
              <option value="">{t.allSchools}</option>
              {schools.map((school) => (
                <option key={school} value={school}>
                  {school.charAt(0).toUpperCase() + school.slice(1)}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Class Filter */}
        <div>
          <label className="block text-sm font-medium mb-2">{t.classLabel}</label>
          <select
            value={selectedClass ?? ''}
            onChange={(e) => setSelectedClass(e.target.value || null)}
            className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label={t.classAria}
          >
            <option value="">{t.allClasses}</option>
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
          Showing {filteredSpells.length} of {spells.length} {t.nounPlural}
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
                    {/*
                      Built from the parts that exist. With `level` and `school`
                      both absent — every M&M power — this used to render the
                      prefix followed by two blanks ("Rank  "), a caption
                      promising two facts and showing neither.
                    */}
                    {(spell.level !== undefined || spell.school) && (
                      <p className="text-sm text-muted-foreground">
                        {[
                          spell.level !== undefined ? `${t.levelPrefix} ${spell.level}` : null,
                          spell.school || null,
                        ]
                          .filter(Boolean)
                          .join(' ')}
                      </p>
                    )}
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
                    <span className="font-medium">{t.castingTime}:</span> {spell.castingTime}
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
              <p>{t.empty}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
