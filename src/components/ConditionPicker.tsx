import React, { useState } from 'react';
import { AlertTriangle, Plus, X, ChevronUp, ChevronDown } from 'lucide-react';

interface Condition {
  id: string;
  name: string;
  value?: number;
}

interface Props {
  conditions: Condition[];
  availableConditions: string[];
  onChange?: (conditions: Condition[]) => void;
  valuedConditions?: Set<string>;
}

export const ConditionPicker: React.FC<Props> = ({
  conditions,
  availableConditions,
  onChange,
  valuedConditions,
}) => {
  const [adding, setAdding] = useState(false);

  const addCondition = (name: string) => {
    if (!onChange) return;
    const id = name.toLowerCase().replace(/\s+/g, '-');
    if (conditions.some((c) => c.id === id)) return;
    const isValued = valuedConditions?.has(id);
    onChange([...conditions, { id, name, value: isValued ? 1 : undefined }]);
    setAdding(false);
  };

  const removeCondition = (id: string) => {
    onChange?.(conditions.filter((c) => c.id !== id));
  };

  const adjustValue = (id: string, delta: number) => {
    onChange?.(
      conditions.map((c) =>
        c.id === id && c.value != null ? { ...c, value: Math.max(0, c.value + delta) } : c
      )
    );
  };

  const activeIds = new Set(conditions.map((c) => c.id));
  const available = availableConditions.filter(
    (name) => !activeIds.has(name.toLowerCase().replace(/\s+/g, '-'))
  );

  return (
    <section className="bg-card p-4 rounded-lg border space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" /> Conditions
          {conditions.length > 0 && (
            <span className="text-xs text-muted-foreground">({conditions.length})</span>
          )}
        </h3>
        {onChange && !adding && (
          <button
            onClick={() => setAdding(true)}
            className="text-xs px-2 py-1 rounded border border-input hover:bg-muted transition-colors flex items-center gap-1"
          >
            <Plus className="w-3 h-3" /> Add
          </button>
        )}
      </div>

      {adding && (
        <div className="flex flex-wrap gap-1">
          {available.map((name) => (
            <button
              key={name}
              onClick={() => addCondition(name)}
              className="text-xs px-2 py-1 rounded border border-input hover:bg-muted transition-colors"
            >
              {name}
            </button>
          ))}
          <button
            onClick={() => setAdding(false)}
            className="text-xs px-2 py-1 rounded border border-destructive/50 text-destructive hover:bg-destructive/10 transition-colors"
          >
            Cancel
          </button>
        </div>
      )}

      {conditions.length === 0 && !adding && (
        <p className="text-xs text-muted-foreground italic">No active conditions.</p>
      )}

      <div className="flex flex-wrap gap-2">
        {conditions.map((c) => (
          <div
            key={c.id}
            className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-sm"
          >
            <span className="font-medium">{c.name}</span>
            {c.value != null && (
              <div className="flex items-center gap-0.5">
                <span className="tabular-nums font-bold text-amber-600">{c.value}</span>
                {onChange && (
                  <>
                    <button
                      onClick={() => adjustValue(c.id, 1)}
                      className="w-4 h-4 flex items-center justify-center hover:text-amber-600"
                      title="Increase"
                    >
                      <ChevronUp className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => adjustValue(c.id, -1)}
                      className="w-4 h-4 flex items-center justify-center hover:text-amber-600"
                      title="Decrease"
                    >
                      <ChevronDown className="w-3 h-3" />
                    </button>
                  </>
                )}
              </div>
            )}
            {onChange && (
              <button
                onClick={() => removeCondition(c.id)}
                className="w-4 h-4 flex items-center justify-center text-muted-foreground hover:text-destructive"
                title="Remove condition"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
