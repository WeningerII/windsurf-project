import { Copy, Download, Trash2 } from 'lucide-react';
import type { CharacterDocument, SystemDataModel } from '../types/core/document';
import { systemRegistry } from '../registry';
import { Button } from './ui/Button';
import { OverflowMenu } from './ui/OverflowMenu';
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
  onExport: (id: string) => void;
  onDelete: (id: string) => void;
}

/**
 * A single character tile in the list view: opens the sheet, clone on hover,
 * with Export/Delete in a per-card '…' overflow (Finding 18 re-home).
 */
export function CharacterCard({
  document,
  onOpen,
  onClone,
  onExport,
  onDelete,
}: CharacterCardProps) {
  const sys = systemRegistry.get(document.systemId);
  const levelLabel = getLevelLabel(document);
  const classLabel = getClassLabel(document.system);
  const origin = getSpeciesLabel(document);
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
        {(classLabel || origin || hitPointLabel) && (
          <div className="mt-2 space-y-0.5 text-xs text-muted-foreground">
            {classLabel && (
              <p>
                Class: <span className="text-foreground">{classLabel}</span>
              </p>
            )}
            {origin && (
              <p>
                {origin.label}: <span className="text-foreground">{origin.value}</span>
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
        // focus-visible:opacity-100 keeps the hover-revealed control usable
        // for keyboard users. No stopPropagation needed: the clone button is
        // a sibling of the open button, not nested inside it.
        className="absolute bottom-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity"
        onClick={() => onClone(document)}
        title={`Clone ${document.name}`}
        aria-label={`Clone ${document.name}`}
      >
        <Copy className="w-3.5 h-3.5" />
      </Button>
      {/* Sits in the corner the header row's pr-9 reserves; also a sibling of
          the open button, and kept visible while expanded so the open menu
          never fades out from under the pointer. */}
      <OverflowMenu
        label={`More actions for ${document.name}`}
        className="absolute top-2 right-2"
        triggerClassName="h-8 w-8 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 aria-expanded:opacity-100 transition-opacity"
        items={[
          {
            label: 'Export',
            icon: <Download className="w-3.5 h-3.5" />,
            onSelect: () => onExport(document.id),
          },
          {
            label: 'Delete',
            icon: <Trash2 className="w-3.5 h-3.5" />,
            destructive: true,
            onSelect: () => onDelete(document.id),
          },
        ]}
      />
    </div>
  );
}
