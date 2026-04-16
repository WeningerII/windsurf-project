import React from 'react';
import { AlertTriangle, Zap } from 'lucide-react';
import type { CharacterDocument } from '../../../types/core/document';
import type { Mam3eDataModel } from '../data-model';

interface Props {
  document: CharacterDocument<Mam3eDataModel>;
  canUpdate: boolean;
  ppSpent: number;
  ppOver: boolean;
  onNameChange: (name: string) => void;
  onPowerLevelChange: (value: string) => void;
  onTotalPowerPointsChange: (value: string) => void;
}

export const MamHeader: React.FC<Props> = ({
  document,
  canUpdate,
  ppSpent,
  ppOver,
  onNameChange,
  onPowerLevelChange,
  onTotalPowerPointsChange,
}) => {
  const data = document.system;

  return (
    <div className="flex justify-between items-start bg-card p-6 rounded-xl border shadow-sm">
      <div className="flex gap-4">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
          {document.img ? (
            <img
              src={document.img}
              alt={document.name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <Zap className="w-8 h-8 text-primary" />
          )}
        </div>
        <div className="space-y-1">
          <input
            value={document.name}
            onChange={(event) => onNameChange(event.target.value)}
            className="text-2xl font-bold bg-transparent border-b border-transparent hover:border-input focus:border-primary focus:outline-none w-full"
            disabled={!canUpdate}
            title="Character name"
            placeholder="Character name"
          />
          <div className="flex items-center gap-2 text-muted-foreground">
            <span>Power Level</span>
            <input
              type="number"
              value={data.powerLevel}
              onChange={(event) => onPowerLevelChange(event.target.value)}
              className="w-12 text-center bg-transparent border-b border-input focus:outline-none focus:border-primary"
              min={1}
              disabled={!canUpdate}
              title="Power level"
            />
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-sm font-medium text-muted-foreground">Power Points</div>
        <div className={`text-2xl font-bold ${ppOver ? 'text-destructive' : 'text-primary'}`}>
          {ppSpent} / {data.powerPoints.total}
        </div>
        {ppOver && (
          <div className="flex items-center gap-1 text-xs text-destructive mt-1">
            <AlertTriangle className="w-3 h-3" />
            Over budget by {ppSpent - data.powerPoints.total}
          </div>
        )}
        {data.plViolations && data.plViolations.length > 0 && (
          <div className="mt-1 space-y-0.5">
            {data.plViolations.map((violation, index) => (
              <div key={index} className="flex items-center gap-1 text-[10px] text-destructive">
                <AlertTriangle className="w-2.5 h-2.5" />
                {violation.label}: {violation.value} exceeds {violation.limit}
              </div>
            ))}
          </div>
        )}
        <input
          type="number"
          value={data.powerPoints.total}
          onChange={(event) => onTotalPowerPointsChange(event.target.value)}
          className="w-16 text-center text-xs bg-transparent border-b border-input focus:outline-none focus:border-primary mt-1"
          min={0}
          disabled={!canUpdate}
          title="Total power points"
        />
        <span className="text-xs text-muted-foreground ml-1">total PP</span>
      </div>
    </div>
  );
};
