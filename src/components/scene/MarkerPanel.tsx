import { Mountain, Plus, Shield, Trash2 } from 'lucide-react';
import type { SceneMarker, SceneMarkerKind } from '../../types/core/scene';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { MARKER_EFFECT_OPTIONS, type MarkerEffectPreset } from './markerEffects';

interface MarkerPanelProps {
  markerLabel: string;
  onMarkerLabelChange: (value: string) => void;
  markerKind: SceneMarkerKind;
  onMarkerKindChange: (value: SceneMarkerKind) => void;
  markerWidth: string;
  onMarkerWidthChange: (value: string) => void;
  markerHeight: string;
  onMarkerHeightChange: (value: string) => void;
  markerEffect: MarkerEffectPreset;
  onMarkerEffectChange: (value: MarkerEffectPreset) => void;
  isPlacing: boolean;
  onTogglePlace: () => void;
  markers: Record<string, SceneMarker>;
  onDeleteMarker: (markerId: string) => void;
}

/** Marker controls: define a hazard/terrain marker, place it, and list placed markers. */
export function MarkerPanel({
  markerLabel,
  onMarkerLabelChange,
  markerKind,
  onMarkerKindChange,
  markerWidth,
  onMarkerWidthChange,
  markerHeight,
  onMarkerHeightChange,
  markerEffect,
  onMarkerEffectChange,
  isPlacing,
  onTogglePlace,
  markers,
  onDeleteMarker,
}: MarkerPanelProps) {
  const markerList = Object.values(markers);

  return (
    <div className="rounded-lg border bg-card p-3">
      <h5 className="mb-2 text-sm font-semibold">Marker</h5>
      <div className="space-y-2">
        <Input
          aria-label="Marker label"
          value={markerLabel}
          onChange={(event) => onMarkerLabelChange(event.target.value)}
          placeholder="Marker label"
        />
        <div className="grid grid-cols-[minmax(0,1fr)_4rem_4rem] gap-2">
          <Select
            aria-label="Marker kind"
            value={markerKind}
            onChange={(event) => onMarkerKindChange(event.target.value as SceneMarkerKind)}
          >
            <option value="hazard">Hazard</option>
            <option value="terrain">Terrain</option>
          </Select>
          <Input
            aria-label="Marker width"
            inputMode="numeric"
            value={markerWidth}
            onChange={(event) => onMarkerWidthChange(event.target.value)}
          />
          <Input
            aria-label="Marker height"
            inputMode="numeric"
            value={markerHeight}
            onChange={(event) => onMarkerHeightChange(event.target.value)}
          />
        </div>
        <div className="space-y-1">
          <Select
            aria-label="Functional terrain"
            value={markerEffect}
            onChange={(event) => onMarkerEffectChange(event.target.value as MarkerEffectPreset)}
          >
            {MARKER_EFFECT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.value === 'none' ? 'Functional terrain: none' : option.label}
              </option>
            ))}
          </Select>
          {markerEffect !== 'none' && (
            <p className="text-xs text-muted-foreground">
              {markerEffect.startsWith('cover')
                ? 'Cover raises the defense of a token standing on this cell.'
                : 'High ground raises the to-hit of a token attacking from this cell.'}{' '}
              Applies to attacks you resolve in scene combat, in every system (autonomous Run Round
              does not apply terrain yet).
            </p>
          )}
        </div>
        <Button
          variant={isPlacing ? 'default' : 'outline'}
          size="sm"
          className="w-full"
          onClick={onTogglePlace}
          disabled={!markerLabel.trim()}
        >
          <Plus className="mr-1.5 h-4 w-4" />
          Place Marker
        </Button>
        {markerList.length > 0 && (
          <div className="space-y-1 pt-1">
            {markerList.map((marker) => (
              <div
                key={marker.id}
                className="flex items-center justify-between gap-2 rounded border px-2 py-1 text-sm"
              >
                <span className="flex min-w-0 items-center gap-1.5">
                  <span className="min-w-0 truncate">
                    {marker.label} ({marker.kind})
                  </span>
                  {marker.effects && marker.effects.length > 0 && (
                    <span
                      className="inline-flex shrink-0 items-center gap-0.5 rounded bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary"
                      title={`Functional terrain: ${marker.effects.map((effect) => effect.label).join(', ')}`}
                      aria-label={`Functional terrain: ${marker.effects.map((effect) => effect.label).join(', ')}`}
                    >
                      {marker.effects.some((effect) => effect.target === 'ac') ? (
                        <Shield className="h-3 w-3" />
                      ) : (
                        <Mountain className="h-3 w-3" />
                      )}
                      {marker.effects.map((effect) => effect.label).join(', ')}
                    </span>
                  )}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 shrink-0"
                  onClick={() => onDeleteMarker(marker.id)}
                  title={`Remove ${marker.label}`}
                  aria-label={`Remove ${marker.label}`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
