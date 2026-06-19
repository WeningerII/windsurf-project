import { describe, expect, it } from 'vitest';
import { fileToAiImageInput, MAX_IMAGE_BYTES } from '../../ai/imageInput';

describe('fileToAiImageInput', () => {
  it('reads an image File into a base64 data URL plus media type', async () => {
    const file = new File([new Uint8Array([1, 2, 3, 4])], 'goblin.png', { type: 'image/png' });
    const out = await fileToAiImageInput(file);
    expect(out.mediaType).toBe('image/png');
    expect(out.dataUrl).toMatch(/^data:image\/png;base64,/);
  });

  it('rejects a non-image file', async () => {
    const file = new File(['hello'], 'notes.txt', { type: 'text/plain' });
    await expect(fileToAiImageInput(file)).rejects.toThrow(/image file/i);
  });

  it('rejects an oversized image', async () => {
    const big = new File([new Uint8Array(MAX_IMAGE_BYTES + 1)], 'huge.png', { type: 'image/png' });
    await expect(fileToAiImageInput(big)).rejects.toThrow(/too large/i);
  });
});
