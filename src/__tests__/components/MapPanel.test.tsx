import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MapPanel } from '../../components/scene/MapPanel';
import type { SceneMapReference } from '../../types/core/scene';

const MAP: SceneMapReference = {
  assetHash: 'a'.repeat(64),
  gridRegistration: { offsetX: 10, offsetY: -5, cellSizePx: 70 },
};

function renderPanel(
  overrides: Partial<Pick<Parameters<typeof MapPanel>[0], 'map' | 'hasAsset' | 'notice'>> = {}
) {
  const props = {
    map: undefined as SceneMapReference | undefined,
    hasAsset: false,
    onImportImage: vi.fn(),
    onChangeRegistration: vi.fn(),
    onRemoveMap: vi.fn(),
    notice: null as string | null,
    ...overrides,
  };
  render(<MapPanel {...props} />);
  return props;
}

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
