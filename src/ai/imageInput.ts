/**
 * Browser helper that turns a user-picked image File into the gateway's
 * {@link AiImageInput} (a base64 `data:` URL plus media type). Kept tiny and
 * dependency-free so it is easy to unit-test and reuse across vision surfaces.
 * Rejects non-images and oversized files before any network call.
 */
import type { AiImageInput } from './contracts';

/**
 * Client-side ceiling on raw image bytes. Kept low enough that the base64
 * inflation (~4/3x) plus the request envelope stays under the gateway's
 * MAX_AI_IMAGE_DATA_URL_LENGTH and the host's payload limit.
 */
export const MAX_IMAGE_BYTES = 4_000_000;

export async function fileToAiImageInput(file: File): Promise<AiImageInput> {
  if (!file.type || !file.type.startsWith('image/')) {
    throw new Error('Please choose an image file.');
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error('That image is too large; choose one under 4 MB.');
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
