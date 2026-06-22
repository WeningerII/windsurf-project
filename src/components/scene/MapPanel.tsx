import { useEffect, useRef, useState } from 'react';
import { ImagePlus, Map as MapIcon, Sparkles, Trash2 } from 'lucide-react';
import type { SceneMapRegistration } from '../../types/core/scene';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export interface MapGenerateResult {
  ok: boolean;
  dataUrl?: string;
  mediaType?: string;
  error?: string;
}

interface MapPanelProps {
  /** Current map registration, when a map is set. */
  registration?: SceneMapRegistration;
  /** Sensible default image-pixels-per-cell for a freshly imported map. */
  defaultPixelsPerCell: number;
  /** Set/replace the map from an image (data URL + media type). */
  onSetImage: (dataUrl: string, mediaType: string) => void;
  /** Apply a corrected registration (manual grid alignment). */
  onUpdateRegistration: (registration: SceneMapRegistration) => void;
  onClear: () => void;
  /** Optional AI image generation (provided only when AI is enabled). */
  onGenerate?: (prompt: string) => Promise<MapGenerateResult>;
}

/**
 * Background-map controls (Phase 9): import a map image (or generate one with AI),
 * align it to the grid by correcting pixels-per-cell and the origin offset, and
 * clear it. Importing works with no provider key; the image is stored
 * content-addressed and the registration is event-sourced, so it survives
 * export/import and replays exactly.
 */
export function MapPanel({
  registration,
  defaultPixelsPerCell,
  onSetImage,
  onUpdateRegistration,
  onClear,
  onGenerate,
}: MapPanelProps) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [prompt, setPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Local, editable alignment fields, re-seeded whenever a different map is set.
  const [pixelsPerCell, setPixelsPerCell] = useState('');
  const [offsetX, setOffsetX] = useState('');
  const [offsetY, setOffsetY] = useState('');
  useEffect(() => {
    if (registration) {
      setPixelsPerCell(String(registration.pixelsPerCell));
      setOffsetX(String(registration.offsetX));
      setOffsetY(String(registration.offsetY));
    }
  }, [registration?.assetHash]); // eslint-disable-line react-hooks/exhaustive-deps

  const readFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === 'string') onSetImage(result, file.type || 'image/png');
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    if (!onGenerate || !prompt.trim()) return;
    setGenerating(true);
    setError(null);
    try {
      const result = await onGenerate(prompt.trim());
      if (result.ok && result.dataUrl) onSetImage(result.dataUrl, result.mediaType ?? 'image/png');
      else setError(result.error ?? 'Could not generate a map.');
    } finally {
      setGenerating(false);
    }
  };

  const applyAlignment = () => {
    if (!registration) return;
    const scale = Number.parseFloat(pixelsPerCell);
    const ox = Number.parseInt(offsetX, 10);
    const oy = Number.parseInt(offsetY, 10);
    if (!Number.isFinite(scale) || scale <= 0 || !Number.isFinite(ox) || !Number.isFinite(oy)) {
      setError('Pixels-per-cell must be positive and offsets whole numbers.');
      return;
    }
    setError(null);
    onUpdateRegistration({
      assetHash: registration.assetHash,
      pixelsPerCell: scale,
      offsetX: ox,
      offsetY: oy,
    });
  };

  return (
    <div className="rounded-lg border bg-card p-3">
      <h5 className="mb-2 flex items-center gap-1.5 text-sm font-semibold">
        <MapIcon className="h-4 w-4" /> Battle Map
      </h5>

      <div className="space-y-2 text-sm">
        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          className="hidden"
          aria-label="Import map image"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) readFile(file);
            event.target.value = '';
          }}
        />
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => fileInput.current?.click()}>
            <ImagePlus className="mr-1.5 h-4 w-4" />
            {registration ? 'Replace map' : 'Import map'}
          </Button>
          {registration && (
            <Button variant="ghost" size="sm" onClick={onClear} title="Remove the background map">
              <Trash2 className="mr-1.5 h-4 w-4" />
              Clear
            </Button>
          )}
        </div>

        {onGenerate && (
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
            <Input
              aria-label="Map generation prompt"
              placeholder="Describe a map to generate…"
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              disabled={generating}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleGenerate}
              disabled={generating || !prompt.trim()}
            >
              <Sparkles className="mr-1.5 h-4 w-4" />
              {generating ? 'Generating…' : 'Generate'}
            </Button>
          </div>
        )}

        {registration && (
          <div className="space-y-1.5 rounded border border-dashed border-primary/40 p-2">
            <p className="text-[11px] text-muted-foreground">
              Align the grid to the art: image pixels per cell, then the origin offset.
            </p>
            <div className="grid grid-cols-3 gap-2">
              <label className="text-[11px] text-muted-foreground">
                px / cell
                <Input
                  aria-label="Map pixels per cell"
                  value={pixelsPerCell}
                  onChange={(event) => setPixelsPerCell(event.target.value)}
                  inputMode="decimal"
                />
              </label>
              <label className="text-[11px] text-muted-foreground">
                offset X
                <Input
                  aria-label="Map offset X"
                  value={offsetX}
                  onChange={(event) => setOffsetX(event.target.value)}
                  inputMode="numeric"
                />
              </label>
              <label className="text-[11px] text-muted-foreground">
                offset Y
                <Input
                  aria-label="Map offset Y"
                  value={offsetY}
                  onChange={(event) => setOffsetY(event.target.value)}
                  inputMode="numeric"
                />
              </label>
            </div>
            <Button variant="outline" size="sm" onClick={applyAlignment}>
              Apply alignment
            </Button>
          </div>
        )}

        {!registration && (
          <p className="text-[11px] text-muted-foreground">
            Import a map image (default {defaultPixelsPerCell}px per cell); no AI or account needed.
          </p>
        )}

        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    </div>
  );
}
