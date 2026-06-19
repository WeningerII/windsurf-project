/**
 * Browser helper that turns a user-picked image File into the gateway's
 * {@link AiImageInput} (a base64 `data:` URL plus media type). Kept tiny and
 * dependency-free so it is easy to unit-test and reuse across vision surfaces.
 * Rejects non-images and oversized files before any network call.
 */
import type { AiImageInput } from './contracts';

/** Client-side ceiling, comfortably under the gateway's data-URL cap. */
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export async function fileToAiImageInput(file: File): Promise<AiImageInput> {
  if (!file.type || !file.type.startsWith('image/')) {
    throw new Error('Please choose an image file.');
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error('That image is too large; choose one under 5 MB.');
  }
  const dataUrl = await readAsDataUrl(file);
  return { dataUrl, mediaType: file.type };
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === 'string') resolve(result);
      else reject(new Error('Could not read the image.'));
    };
    reader.onerror = () => reject(reader.error ?? new Error('Could not read the image.'));
    reader.readAsDataURL(file);
  });
}
