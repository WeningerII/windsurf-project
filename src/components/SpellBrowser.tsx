import React, { useState, useMemo, useCallback } from 'react';
import { Search, Filter } from 'lucide-react';

interface SpellDisplay {
  id: string;
  name: string;
  level: number;
  school: string;
  castingTime: string;
  range: string;
  duration: string;
  description: string;
  classes: string[];
}

interface SpellBrowserProps {
  spells: SpellDisplay[];
  onSelectSpell?: (spell: SpellDisplay) => void;
}

export const SpellBrowser: React.FC<SpellBrowserProps> = ({
  spells,
  onSelectSpell,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [selectedSchool, setSelectedSchool] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);

  const schools = useMemo(
    () => [...new Set(spells.map((s) => s.school))].sort(),
    [spells]
  );

  const classes = useMemo(
    () => [...new Set(spells.flatMap((s) => s.classes))].sort(),
    [spells]
  );

  const filteredSpells = useMemo(() => {
    return spells.filter((spell) => {
      const matchesSearch =
        spell.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        spell.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesLevel =
        selectedLevel === null || spell.level === selectedLevel;

      const matchesSchool =
        selectedSchool === null || spell.school === selectedSchool;

      const matchesClass =
        selectedClass === null || spell.classes.includes(selectedClass);

      return matchesSearch && matchesLevel && matchesSchool && matchesClass;
    });
  }, [spells, searchTerm, selectedLevel, selectedSchool, selectedClass]);

  const handleClearFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedLevel(null);
    setSelectedSchool(null);
    setSelectedClass(null);
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Level Filter */}
        <div>
          <label className="block text-sm font-medium mb-2">Spell Level</label>
          <select
            value={selectedLevel ?? ''}
            onChange={(e) =>
              setSelectedLevel(e.target.value ? parseInt(e.target.value) : null)
            }
            className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Filter by spell level"
          >
            <option value="">All Levels</option>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((level) => (
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

        {/* Clear Filters */}
        <div className="flex items-end">
          <button
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
              <div
                key={spell.id}
                onClick={() => onSelectSpell?.(spell)}
                className="p-4 border border-input rounded-lg hover:border-primary/50 hover:shadow-md transition-all cursor-pointer"
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

                <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                  <div>
                    <span className="font-medium">Casting Time:</span>{' '}
                    {spell.castingTime}
                  </div>
                  <div>
                    <span className="font-medium">Range:</span> {spell.range}
                  </div>
                  <div>
                    <span className="font-medium">Duration:</span>{' '}
                    {spell.duration}
                  </div>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2">
                  {spell.description}
                </p>
              </div>
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
