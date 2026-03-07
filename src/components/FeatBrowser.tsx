import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';

interface Feat {
  id: string;
  name: string;
  system: string;
  source: string;
  description: string;
  benefits: string[];
  prerequisites?: Array<{ type: string; description: string }>;
}

interface FeatBrowserProps {
  feats: Feat[];
  onSelectFeat?: (feat: Feat) => void;
}

export const FeatBrowser: React.FC<FeatBrowserProps> = ({ feats, onSelectFeat }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFeat, setExpandedFeat] = useState<string | null>(null);
  const [filterByPrerequisites, setFilterByPrerequisites] = useState(false);

  const filteredFeats = useMemo(() => {
    return feats.filter((feat) => {
      const matchesSearch =
        feat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feat.description.toLowerCase().includes(searchTerm.toLowerCase());

      const hasPrerequisites = feat.prerequisites && feat.prerequisites.length > 0;
      const matchesFilter = !filterByPrerequisites || hasPrerequisites;

      return matchesSearch && matchesFilter;
    });
  }, [feats, searchTerm, filterByPrerequisites]);

  return (
    <div className="w-full space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search feats by name or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filterByPrerequisites}
            onChange={(e) => setFilterByPrerequisites(e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-sm">Show only feats with prerequisites</span>
        </label>
      </div>

      {/* Results */}
      <div>
        <p className="text-sm text-muted-foreground mb-4">
          Showing {filteredFeats.length} of {feats.length} feats
        </p>

        <div className="space-y-2">
          {filteredFeats.length > 0 ? (
            filteredFeats.map((feat) => (
              <div key={feat.id} className="border border-input rounded-lg overflow-hidden">
                <button
                  onClick={() => setExpandedFeat(expandedFeat === feat.id ? null : feat.id)}
                  className="w-full p-4 hover:bg-muted transition-all flex justify-between items-center"
                >
                  <div className="text-left">
                    <h4 className="font-semibold">{feat.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {feat.source} • {feat.system}
                    </p>
                  </div>
                  {expandedFeat === feat.id ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>

                {expandedFeat === feat.id && (
                  <div className="p-4 border-t border-input bg-muted/50 space-y-4">
                    <p className="text-sm">{feat.description}</p>

                    {feat.prerequisites && feat.prerequisites.length > 0 && (
                      <div>
                        <h5 className="font-medium text-sm mb-2">Prerequisites:</h5>
                        <ul className="list-disc list-inside space-y-1">
                          {feat.prerequisites.map((prereq, idx) => (
                            <li key={idx} className="text-sm">
                              {prereq.description}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {feat.benefits.length > 0 && (
                      <div>
                        <h5 className="font-medium text-sm mb-2">Benefits:</h5>
                        <ul className="list-disc list-inside space-y-1">
                          {feat.benefits.map((benefit, idx) => (
                            <li key={idx} className="text-sm">
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {onSelectFeat && (
                      <button
                        onClick={() => onSelectFeat(feat)}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all text-sm"
                      >
                        Select Feat
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No feats found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
