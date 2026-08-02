import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { AnalyzeMapResult } from '../../ai/analyzeMapFlow';
import { MapPanel } from '../../components/scene/MapPanel';
import {
  GRID_GEOMETRY_PROPOSAL_VERSION,
  validateGridGeometryProposal,
  type GridGeometryProposal,
} from '../../scene/gridGeometryProposal';
import type { SceneMapReference } from '../../types/core/scene';

const MAP: SceneMapReference = {
  assetHash: 'a'.repeat(64),
  gridRegistration: { offsetX: 10, offsetY: -5, cellSizePx: 70 },
};

function renderPanel(
  overrides: Partial<
    Pick<
      Parameters<typeof MapPanel>[0],
      'map' | 'hasAsset' | 'notice' | 'onAnalyzeGrid' | 'onApplyAnalysis'
    >
  > = {}
) {
  const props = {
    map: undefined as SceneMapReference | undefined,
    hasAsset: false,
    onImportImage: vi.fn(),
    onChangeRegistration: vi.fn(),
    onRemoveMap: vi.fn(),
    notice: null as string | null,
    onApplyAnalysis: vi.fn(),
    ...overrides,
  };
  render(<MapPanel {...props} />);
  return props;
}

/**
 * Build a real analysis result by running the REAL validator, so these tests
 * cannot drift into asserting a hand-written verdict the shipped gate would
 * disagree with.
 */
function analysisFor(proposal: GridGeometryProposal): AnalyzeMapResult {
  return { ok: true, proposal, validation: validateGridGeometryProposal(proposal) };
}

const IMAGE = { widthPx: 1000, heightPx: 800 };

const SOUND_PROPOSAL: GridGeometryProposal = {
  version: GRID_GEOMETRY_PROPOSAL_VERSION,
  image: IMAGE,
  registration: { offsetX: 0, offsetY: 0, cellSizePx: 50 },
  boxes: [{ kind: 'spawn', rect: { x: 0, y: 0, width: 100, height: 100 }, label: 'Entry' }],
};

/** Cell size below MIN_CELL_SIZE_PX — the validator's `manual-correction`. */
const SHAKY_PROPOSAL: GridGeometryProposal = {
  ...SOUND_PROPOSAL,
  registration: { offsetX: 0, offsetY: 0, cellSizePx: 4 },
  boxes: [{ kind: 'spawn', rect: { x: 0, y: 0, width: 40, height: 40 } }],
};

describe('MapPanel', () => {
  it('offers import without a map and no registration controls', () => {
    renderPanel();

    expect(screen.getByRole('button', { name: /Import Map Image/i })).toBeInTheDocument();
    expect(screen.queryByLabelText('Map offset X (px)')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Remove Map/i })).not.toBeInTheDocument();
  });

  it('passes a chosen image file to onImportImage', () => {
    const props = renderPanel();
    const file = new File(['img-bytes'], 'dungeon.png', { type: 'image/png' });

    fireEvent.change(screen.getByLabelText('Map image file'), { target: { files: [file] } });

    expect(props.onImportImage).toHaveBeenCalledTimes(1);
    expect(props.onImportImage).toHaveBeenCalledWith(file);
  });

  it('edits registration fields and blocks a non-positive cell size', () => {
    const props = renderPanel({ map: MAP, hasAsset: true });

    fireEvent.change(screen.getByLabelText('Map offset X (px)'), { target: { value: '24' } });
    expect(props.onChangeRegistration).toHaveBeenCalledWith({
      ...MAP.gridRegistration,
      offsetX: 24,
    });

    props.onChangeRegistration.mockClear();
    fireEvent.change(screen.getByLabelText('Map cell size (px)'), { target: { value: '0' } });
    fireEvent.change(screen.getByLabelText('Map cell size (px)'), { target: { value: '-5' } });
    fireEvent.change(screen.getByLabelText('Map cell size (px)'), { target: { value: 'abc' } });
    expect(props.onChangeRegistration).not.toHaveBeenCalled();

    fireEvent.change(screen.getByLabelText('Map cell size (px)'), { target: { value: '55' } });
    expect(props.onChangeRegistration).toHaveBeenCalledWith({
      ...MAP.gridRegistration,
      cellSizePx: 55,
    });
  });

  it('removes the map reference via Remove Map', () => {
    const props = renderPanel({ map: MAP, hasAsset: true });

    fireEvent.click(screen.getByRole('button', { name: /Remove Map/i }));

    expect(props.onRemoveMap).toHaveBeenCalledTimes(1);
  });

  it('explains a missing asset instead of failing (missing-asset fallback)', () => {
    renderPanel({ map: MAP, hasAsset: false });

    expect(screen.getByText(/Map image not on this device/i)).toBeInTheDocument();
    // The reference is still editable/replaceable.
    expect(screen.getByRole('button', { name: /Replace Map Image/i })).toBeInTheDocument();
  });

  it('surfaces an import notice', () => {
    renderPanel({ notice: 'That image is too large to store locally.' });

    expect(screen.getByText(/too large to store locally/i)).toBeInTheDocument();
  });
});

describe('MapPanel — Phase 10 grid detection', () => {
  it('hides the affordance entirely when no analyzer is supplied (AI off)', () => {
    renderPanel({ map: MAP, hasAsset: true });

    expect(screen.queryByRole('button', { name: /Detect Grid with AI/i })).not.toBeInTheDocument();
  });

  it('shows the proposal for review and applies it only on the human click', async () => {
    const onApplyAnalysis = vi.fn();
    const onAnalyzeGrid = vi.fn().mockResolvedValue(analysisFor(SOUND_PROPOSAL));
    renderPanel({ map: MAP, hasAsset: true, onAnalyzeGrid, onApplyAnalysis });

    fireEvent.click(screen.getByRole('button', { name: /Detect Grid with AI/i }));

    await waitFor(() => expect(screen.getByText(/50 px per cell/)).toBeInTheDocument());
    // Nothing is applied by the analysis itself — the proposal is shown first.
    expect(onApplyAnalysis).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'Apply' }));
    expect(onApplyAnalysis).toHaveBeenCalledWith(SOUND_PROPOSAL);
  });

  it('DISABLES Apply on a manual-correction verdict and says why', async () => {
    const onApplyAnalysis = vi.fn();
    const onAnalyzeGrid = vi.fn().mockResolvedValue(analysisFor(SHAKY_PROPOSAL));
    renderPanel({ map: MAP, hasAsset: true, onAnalyzeGrid, onApplyAnalysis });

    fireEvent.click(screen.getByRole('button', { name: /Detect Grid with AI/i }));

    await waitFor(() => expect(screen.getByRole('button', { name: 'Apply' })).toBeInTheDocument());
    expect(screen.getByRole('button', { name: 'Apply' })).toBeDisabled();
    expect(screen.getByText(/not accurate enough to apply/i)).toBeInTheDocument();
    // The manual inputs remain the way out.
    expect(screen.getByLabelText('Map cell size (px)')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Apply' }));
    expect(onApplyAnalysis).not.toHaveBeenCalled();
  });

  it('surfaces a flow error without offering anything to apply', async () => {
    const onAnalyzeGrid = vi
      .fn()
      .mockResolvedValue({ ok: false, error: 'The provider is unavailable.' });
    renderPanel({ map: MAP, hasAsset: true, onAnalyzeGrid });

    fireEvent.click(screen.getByRole('button', { name: /Detect Grid with AI/i }));

    await waitFor(() =>
      expect(screen.getByText('The provider is unavailable.')).toBeInTheDocument()
    );
    expect(screen.queryByRole('button', { name: 'Apply' })).not.toBeInTheDocument();
  });

  it('discards a proposal without applying it', async () => {
    const onApplyAnalysis = vi.fn();
    const onAnalyzeGrid = vi.fn().mockResolvedValue(analysisFor(SOUND_PROPOSAL));
    renderPanel({ map: MAP, hasAsset: true, onAnalyzeGrid, onApplyAnalysis });

    fireEvent.click(screen.getByRole('button', { name: /Detect Grid with AI/i }));
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Dismiss' })).toBeInTheDocument()
    );

    fireEvent.click(screen.getByRole('button', { name: 'Dismiss' }));
    await waitFor(() =>
      expect(screen.queryByRole('button', { name: 'Apply' })).not.toBeInTheDocument()
    );
    expect(onApplyAnalysis).not.toHaveBeenCalled();
  });
});
