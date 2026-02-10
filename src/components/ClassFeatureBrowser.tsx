import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';

interface ClassFeature {
  id: string;
  name: string;
  class: string;
  level: number;
  description: string;
  benefits: string[];
}

interface ClassFeatureBrowserProps {
  features: ClassFeature[];
  onSelectFeature?: (feature: ClassFeature) => void;
}

export const ClassFeatureBrowser: React.FC<ClassFeatureBrowserProps> = ({
  features,
  onSelectFeature,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [expandedFeature, setExpandedFeature] = useState<string | null>(null);

  const classes = useMemo(
    () => [...new Set(features.map((f) => f.class))].sort(),
    [features]
  );

  const filteredFeatures = useMemo(() => {
    return features.filter((feature) => {
      const matchesSearch =
        feature.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feature.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesClass =
        selectedClass === null || feature.class === selectedClass;

      return matchesSearch && matchesClass;
    });
  }, [features, searchTerm, selectedClass]);

  const groupedByLevel = useMemo(() => {
    const grouped: Record<number, ClassFeature[]> = {};
    filteredFeatures.forEach((feature) => {
      if (!grouped[feature.level]) {
        grouped[feature.level] = [];
      }
      grouped[feature.level].push(feature);
    });
    return grouped;
  }, [filteredFeatures]);

  return (
    <div className="w-full space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search class features..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Class Filter */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setSelectedClass(null)}
          className={`px-4 py-2 rounded-lg border transition-all ${
            selectedClass === null
              ? 'bg-primary text-primary-foreground border-primary'
              : 'border-input hover:border-primary/50'
          }`}
        >
          All Classes
        </button>
        {classes.map((cls) => (
          <button
            key={cls}
            onClick={() => setSelectedClass(cls)}
            className={`px-4 py-2 rounded-lg border transition-all ${
              selectedClass === cls
                ? 'bg-primary text-primary-foreground border-primary'
                : 'border-input hover:border-primary/50'
            }`}
          >
            {cls.charAt(0).toUpperCase() + cls.slice(1)}
          </button>
        ))}
      </div>

      {/* Results */}
      <div>
        <p className="text-sm text-muted-foreground mb-4">
          Showing {filteredFeatures.length} features
        </p>

        <div className="space-y-4">
          {Object.entries(groupedByLevel)
            .sort(([levelA], [levelB]) => parseInt(levelA) - parseInt(levelB))
            .map(([level, levelFeatures]) => (
              <div key={level}>
                <h3 className="font-semibold text-lg mb-3">Level {level}</h3>
                <div className="space-y-2">
                  {levelFeatures.map((feature) => (
                    <div
                      key={feature.id}
                      className="border border-input rounded-lg overflow-hidden"
                    >
                      <button
                        onClick={() =>
                          setExpandedFeature(
                            expandedFeature === feature.id ? null : feature.id
                          )
                        }
                        className="w-full p-4 hover:bg-muted transition-all flex justify-between items-center"
                      >
                        <div className="text-left">
                          <h4 className="font-semibold">{feature.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {feature.class}
                          </p>
                        </div>
                        {expandedFeature === feature.id ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </button>

                      {expandedFeature === feature.id && (
                        <div className="p-4 border-t border-input bg-muted/50">
                          <p className="text-sm mb-3">{feature.description}</p>
                          {feature.benefits.length > 0 && (
                            <div>
                              <h5 className="font-medium text-sm mb-2">
                                Benefits:
                              </h5>
                              <ul className="list-disc list-inside space-y-1">
                                {feature.benefits.map((benefit, idx) => (
                                  <li key={idx} className="text-sm">
                                    {benefit}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {onSelectFeature && (
                            <button
                              onClick={() => onSelectFeature(feature)}
                              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all text-sm"
                            >
                              Select Feature
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

          {filteredFeatures.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>No class features found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
