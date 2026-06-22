import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { MapPanel } from '../../components/scene/MapPanel';
import type { SceneMapRegistration } from '../../types/core/scene';

/**
 * PHASE 9 (RFC 006): the battle-map controls. Importing needs no AI or account;
 * alignment is applied in one batch (not per keystroke); generation is optional.
 */

afterEach(() => vi.restoreAllMocks());

const registration: SceneMapRegistration = {
  assetHash: 'h1',
  pixelsPerCell: 70,
  offsetX: 0,
  offsetY: 0,
};

function setup(props: Partial<Parameters<typeof MapPanel>[0]> = {}) {
  const onSetImage = vi.fn();
  const onUpdateRegistration = vi.fn();
  const onClear = vi.fn();
  render(
    <MapPanel
      defaultPixelsPerCell={70}
      onSetImage={onSetImage}
      onUpdateRegistration={onUpdateRegistration}
      onClear={onClear}
      {...props}
    />
  );
  return { onSetImage, onUpdateRegistration, onClear };
}

describe('MapPanel', () => {
  it('imports an image file as a data URL', async () => {
    vi.spyOn(FileReader.prototype, 'readAsDataURL').mockImplementation(function (this: FileReader) {
      Object.defineProperty(this, 'result', {
        value: 'data:image/png;base64,AAAA',
        configurable: true,
      });
      this.onload?.({} as ProgressEvent<FileReader>);
    });
    const { onSetImage } = setup();

    const input = screen.getByLabelText('Import map image');
    fireEvent.change(input, {
      target: { files: [new File(['x'], 'map.png', { type: 'image/png' })] },
    });

    expect(onSetImage).toHaveBeenCalledWith('data:image/png;base64,AAAA', 'image/png');
  });

  it('shows alignment controls only when a map is set, and applies them in one batch', async () => {
    const user = userEvent.setup();
    const { onUpdateRegistration } = setup({ registration });

    const scale = screen.getByLabelText('Map pixels per cell');
    await user.clear(scale);
    await user.type(scale, '64');
    const offsetX = screen.getByLabelText('Map offset X');
    await user.clear(offsetX);
    await user.type(offsetX, '12');

    // No dispatch until "Apply" — typing must not spam the event log.
    expect(onUpdateRegistration).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: /apply alignment/i }));
    expect(onUpdateRegistration).toHaveBeenCalledWith({
      assetHash: 'h1',
      pixelsPerCell: 64,
      offsetX: 12,
      offsetY: 0,
    });
  });

  it('clears the map', async () => {
    const user = userEvent.setup();
    const { onClear } = setup({ registration });
    await user.click(screen.getByRole('button', { name: /clear/i }));
    expect(onClear).toHaveBeenCalled();
  });

  it('hides alignment controls and the clear button before a map is set', () => {
    setup();
    expect(screen.queryByRole('button', { name: /apply alignment/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /clear/i })).not.toBeInTheDocument();
  });

  it('generates a map via the optional AI hook and sets it', async () => {
    const user = userEvent.setup();
    const onGenerate = vi.fn(async () => ({
      ok: true,
      dataUrl: 'data:image/png;base64,GEN',
      mediaType: 'image/png',
    }));
    const { onSetImage } = setup({ onGenerate });

    await user.type(screen.getByLabelText('Map generation prompt'), 'a misty forest clearing');
    await user.click(screen.getByRole('button', { name: /generate/i }));

    await waitFor(() =>
      expect(onSetImage).toHaveBeenCalledWith('data:image/png;base64,GEN', 'image/png')
    );
    expect(onGenerate).toHaveBeenCalledWith('a misty forest clearing');
  });

  it('omits the generation control when no AI hook is provided', () => {
    setup();
    expect(screen.queryByLabelText('Map generation prompt')).not.toBeInTheDocument();
  });
});
