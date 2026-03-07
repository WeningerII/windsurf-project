import React, { useState, useMemo } from 'react';
import { Search, Filter } from 'lucide-react';

interface Equipment {
  id: string;
  name: string;
  type: string;
  rarity: string;
  cost: string;
  weight: number;
  description: string;
  properties?: string[];
}

interface EquipmentBrowserProps {
  equipment: Equipment[];
  onSelectEquipment?: (item: Equipment) => void;
}

export const EquipmentBrowser: React.FC<EquipmentBrowserProps> = ({
  equipment,
  onSelectEquipment,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedRarity, setSelectedRarity] = useState<string | null>(null);

  const types = useMemo(() => [...new Set(equipment.map((e) => e.type))].sort(), [equipment]);

  const rarities = useMemo(() => [...new Set(equipment.map((e) => e.rarity))].sort(), [equipment]);

  const filteredEquipment = useMemo(() => {
    return equipment.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = selectedType === null || item.type === selectedType;
      const matchesRarity = selectedRarity === null || item.rarity === selectedRarity;

      return matchesSearch && matchesType && matchesRarity;
    });
  }, [equipment, searchTerm, selectedType, selectedRarity]);

  return (
    <div className="w-full space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search equipment..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Type Filter */}
        <div>
          <label className="block text-sm font-medium mb-2">Type</label>
          <select
            value={selectedType ?? ''}
            onChange={(e) => setSelectedType(e.target.value || null)}
            className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All Types</option>
            {types.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Rarity Filter */}
        <div>
          <label className="block text-sm font-medium mb-2">Rarity</label>
          <select
            value={selectedRarity ?? ''}
            onChange={(e) => setSelectedRarity(e.target.value || null)}
            className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All Rarities</option>
            {rarities.map((rarity) => (
              <option key={rarity} value={rarity}>
                {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Clear Filters */}
        <div className="flex items-end">
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedType(null);
              setSelectedRarity(null);
            }}
            className="w-full px-4 py-2 border border-input rounded-lg hover:bg-muted transition-all"
          >
            <Filter className="w-4 h-4 inline mr-2" />
            Clear Filters
          </button>
        </div>
      </div>

      {/* Results */}
      <div>
        <p className="text-sm text-muted-foreground mb-4">
          Showing {filteredEquipment.length} of {equipment.length} items
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredEquipment.length > 0 ? (
            filteredEquipment.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectEquipment?.(item)}
                className="p-4 border border-input rounded-lg hover:border-primary/50 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.type} • {item.rarity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{item.cost}</p>
                    <p className="text-xs text-muted-foreground">{item.weight} lbs</p>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-2">{item.description}</p>

                {item.properties && item.properties.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {item.properties.map((prop, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-primary/10 text-primary px-2 py-1 rounded"
                      >
                        {prop}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-muted-foreground">
              <p>No equipment found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
