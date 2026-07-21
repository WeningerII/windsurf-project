import { useRef } from 'react';
import { Image as ImageIcon, Trash2 } from 'lucide-react';
import type { SceneGridRegistration, SceneMapReference } from '../../types/core/scene';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface MapPanelProps {
  /** The scene's current map reference, if any. */
  map?: SceneMapReference;
  /** Whether the referenced asset is present in local storage. */
  hasAsset: boolean;
  /** Import an image file as the scene's map (hash + store + reference). */
  onImportImage: (file: File) => void;
  /** Adjust the manual grid registration (offset / cell size, image px). */
  onChangeRegistration: (registration: SceneGridRegistration) => void;
  /** Drop the scene's map reference (the stored asset is kept — content-addressed). */
  onRemoveMap: () => void;
  /** Import/storage problem to surface (oversized image, full storage, ...). */
  notice?: string | null;
}

/**
 * Map-image controls (RFC 006 Phase 9): import an image as the scene's
 * backdrop and manually register the grid over it — pixel offset of the grid
 * origin plus image pixels per cell, adjusted live over the rendered image.
 * The map is document metadata, not an event: edits here never touch the
 * replayable event log.
 */
export function MapPanel({
  map,
  hasAsset,
  onImportImage,
  onChangeRegistration,
  onRemoveMap,
  notice,
}: MapPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const registration = map?.gridRegistration;

  const changeField = (field: keyof SceneGridRegistration, raw: string) => {
    if (!registration) return;
    const parsed = Number.parseFloat(raw);
    if (!Number.isFinite(parsed)) return;
    // Cell size must stay positive; offsets may be any finite number.
    if (field === 'cellSizePx' && parsed <= 0) return;
    onChangeRegistration({ ...registration, [field]: parsed });
  };

  return (
    <div className="rounded-lg border bg-card p-3">
      <h5 className="mb-2 text-sm font-semibold">Map</h5>
      <div className="space-y-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          aria-label="Map image file"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            // Reset so re-choosing the same file re-fires change.
            event.target.value = '';
            if (file) onImportImage(file);
          }}
        />
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => fileInputRef.current?.click()}
        >
          <ImageIcon className="mr-1.5 h-4 w-4" />
          {map ? 'Replace Map Image' : 'Import Map Image'}
        </Button>

        {notice && <p className="text-xs text-destructive">{notice}</p>}

        {map && !hasAsset && (
          <p className="text-xs text-muted-foreground">
            Map image not on this device — the grid renders without it. Re-import the image or
            import a scene export that includes it.
          </p>
        )}

        {registration && (
          <>
            <p className="text-xs text-muted-foreground">
              Align the grid: image-pixel offset of the top-left corner, and image pixels per
              cell.
            </p>
            <div className="grid grid-cols-3 gap-2">
              <label className="space-y-1 text-xs text-muted-foreground">
                <span>Offset X px</span>
                <Input
                  aria-label="Map offset X (px)"
                  type="number"
                  value={registration.offsetX}
                  onChange={(event) => changeField('offsetX', event.target.value)}
                />
              </label>
              <label className="space-y-1 text-xs text-muted-foreground">
                <span>Offset Y px</span>
                <Input
                  aria-label="Map offset Y (px)"
                  type="number"
                  value={registration.offsetY}
                  onChange={(event) => changeField('offsetY', event.target.value)}
                />
              </label>
              <label className="space-y-1 text-xs text-muted-foreground">
                <span>Cell px</span>
                <Input
                  aria-label="Map cell size (px)"
                  type="number"
                  min={1}
                  value={registration.cellSizePx}
                  onChange={(event) => changeField('cellSizePx', event.target.value)}
                />
              </label>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={onRemoveMap}
            >
              <Trash2 className="mr-1.5 h-4 w-4" />
              Remove Map
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
