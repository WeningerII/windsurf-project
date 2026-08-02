import { useState, useRef } from 'react';
import { Image as ImageIcon, Trash2, Wand2 } from 'lucide-react';
import type { AnalyzeMapResult } from '../../ai/analyzeMapFlow';
import type { GridGeometryProposal } from '../../scene/gridGeometryProposal';
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
  /**
   * Run the Phase 10 vision analysis over the current map (RFC 002 × RFC 006).
   * Injected as a closure that already holds the decoded image and its MEASURED
   * pixel dimensions, so this panel needs no knowledge of either — and testing
   * it needs no gateway. Absent when AI is off or the image cannot be measured,
   * which is also the panel's only signal to hide the affordance.
   */
  onAnalyzeGrid?: (hint?: string) => Promise<AnalyzeMapResult>;
  /** Apply an ACCEPTED proposal: registration + terrain/cover/hazard markers. */
  onApplyAnalysis?: (proposal: GridGeometryProposal) => void;
}

/**
 * Map-image controls (RFC 006 Phase 9): import an image as the scene's
 * backdrop and manually register the grid over it — pixel offset of the grid
 * origin plus image pixels per cell, adjusted live over the rendered image.
 * The map is document metadata, not an event: edits here never touch the
 * replayable event log.
 *
 * Phase 10 adds the vision affordance, and it is deliberately a PROPOSAL
 * REVIEW, not an action: the model's geometry is run through
 * `validateGridGeometryProposal` by the flow, the verdict and every issue are
 * shown, and Apply is offered only on an `accept`. A `manual-correction`
 * verdict still shows its numbers — the human can read them, dismiss, and dial
 * the offsets in by hand with the same three inputs as always.
 */
export function MapPanel({
  map,
  hasAsset,
  onImportImage,
  onChangeRegistration,
  onRemoveMap,
  notice,
  onAnalyzeGrid,
  onApplyAnalysis,
}: MapPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const registration = map?.gridRegistration;
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalyzeMapResult | null>(null);

  const changeField = (field: keyof SceneGridRegistration, raw: string) => {
    if (!registration) return;
    const parsed = Number.parseFloat(raw);
    if (!Number.isFinite(parsed)) return;
    // Cell size must stay positive; offsets may be any finite number.
    if (field === 'cellSizePx' && parsed <= 0) return;
    onChangeRegistration({ ...registration, [field]: parsed });
  };

  const handleAnalyze = async () => {
    if (!onAnalyzeGrid || analyzing) return;
    setAnalyzing(true);
    setAnalysis(null);
    try {
      setAnalysis(await onAnalyzeGrid());
    } finally {
      setAnalyzing(false);
    }
  };

  const handleApply = () => {
    if (!analysis?.ok || !onApplyAnalysis) return;
    onApplyAnalysis(analysis.proposal);
    setAnalysis(null);
  };

  const canApply = Boolean(analysis?.ok && analysis.validation.verdict === 'accept');

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
              Align the grid: image-pixel offset of the top-left corner, and image pixels per cell.
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

            {onAnalyzeGrid && (
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                disabled={analyzing}
                onClick={() => void handleAnalyze()}
              >
                <Wand2 className="mr-1.5 h-4 w-4" />
                {analyzing ? 'Analyzing map…' : 'Detect Grid with AI'}
              </Button>
            )}

            {analysis && !analysis.ok && (
              <p className="text-xs text-destructive">{analysis.error}</p>
            )}

            {analysis?.ok && (
              <div className="space-y-1.5 rounded-md border border-dashed p-2">
                <p className="text-xs font-medium">
                  {analysis.validation.verdict === 'accept'
                    ? 'Proposed grid'
                    : 'Proposed grid — needs a look'}
                </p>
                <p className="text-xs text-muted-foreground">
                  Offset {Math.round(analysis.proposal.registration.offsetX)},{' '}
                  {Math.round(analysis.proposal.registration.offsetY)} px ·{' '}
                  {Math.round(analysis.proposal.registration.cellSizePx)} px per cell ·{' '}
                  {analysis.proposal.boxes.length}{' '}
                  {analysis.proposal.boxes.length === 1 ? 'region' : 'regions'}
                </p>
                {analysis.reason && (
                  <p className="text-xs text-muted-foreground">{analysis.reason}</p>
                )}
                {analysis.validation.issues.length > 0 && (
                  <ul className="space-y-0.5 text-xs text-muted-foreground">
                    {analysis.validation.issues.map((issue) => (
                      <li key={`${issue.code}-${issue.boxIndex ?? 'all'}`}>• {issue.message}</li>
                    ))}
                  </ul>
                )}
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1" disabled={!canApply} onClick={handleApply}>
                    Apply
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1"
                    onClick={() => setAnalysis(null)}
                  >
                    Dismiss
                  </Button>
                </div>
                {!canApply && (
                  <p className="text-xs text-muted-foreground">
                    Adjust the grid by hand above — this proposal is not accurate enough to apply.
                  </p>
                )}
              </div>
            )}

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
