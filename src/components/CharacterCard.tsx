import { Copy } from 'lucide-react';
import type { CharacterDocument, SystemDataModel } from '../types/core/document';
import { systemRegistry } from '../registry';
import { Button } from './ui/Button';
import {
  getClassLabel,
  getHitPointLabel,
  getLevelLabel,
  getSpeciesLabel,
} from '../utils/characterPresenter';

interface CharacterCardProps {
  document: CharacterDocument<SystemDataModel>;
  onOpen: (id: string) => void;
  onClone: (document: CharacterDocument<SystemDataModel>) => void;
}

/** A single character tile in the list view: opens the sheet, clone on hover. */
export function CharacterCard({ document, onOpen, onClone }: CharacterCardProps) {
  const sys = systemRegistry.get(document.systemId);
  const levelLabel = getLevelLabel(document);
  const classLabel = getClassLabel(document.system);
  const speciesLabel = getSpeciesLabel(document.system);
  const hitPointLabel = getHitPointLabel(document.system);

  return (
    <div className="group relative">
      <button
        className="w-full h-full p-5 rounded-xl border bg-card text-left transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 hover:border-primary/50"
        onClick={() => onOpen(document.id)}
      >
        <div className="flex items-start justify-between mb-2 pr-9">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
            {document.name.charAt(0).toUpperCase()}
          </div>
          <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
            {sys?.label}
          </span>
        </div>
        <h4 className="font-semibold text-lg leading-tight mb-1">{document.name}</h4>
        <p className="text-sm text-muted-foreground">{levelLabel ?? 'New character'}</p>
        {(classLabel || speciesLabel || hitPointLabel) && (
          <div className="mt-2 space-y-0.5 text-xs text-muted-foreground">
            {classLabel && (
              <p>
                Class: <span className="text-foreground">{classLabel}</span>
              </p>
            )}
            {speciesLabel && (
              <p>
                Species: <span className="text-foreground">{speciesLabel}</span>
              </p>
            )}
            {hitPointLabel && (
              <p>
                HP: <span className="text-foreground">{hitPointLabel}</span>
              </p>
            )}
          </div>
        )}
        <div className="absolute inset-0 rounded-xl ring-2 ring-primary/0 group-hover:ring-primary/20 transition-all pointer-events-none" />
      </button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute bottom-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => {
          e.stopPropagation();
          onClone(document);
        }}
        title={`Clone ${document.name}`}
        aria-label={`Clone ${document.name}`}
      >
        <Copy className="w-3.5 h-3.5" />
      </Button>
    </div>
  );
}
