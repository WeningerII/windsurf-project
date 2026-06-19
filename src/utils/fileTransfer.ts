/**
 * Shared browser file-transfer helpers. The scene, campaign, and character
 * import/export paths each reimplemented the same Blob-download and
 * file-read-as-text boilerplate; this consolidates that plumbing so the call
 * sites keep only their own serialize/parse logic.
 */

/**
 * Download `text` as a file. Uses a Blob URL rather than a `data:` anchor,
 * which Chromium caps at ~2 MB — exactly when a large export most needs to
 * work (e.g. near the storage limit).
 */
export function downloadTextFile(
  text: string,
  filename: string,
  mimeType = 'application/json'
): void {
  const blob = new Blob([text], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Prompt for a file and read it as text, passing the contents to `onText`.
 * Does nothing if the user cancels the picker (no file chosen).
 */
export function pickTextFile(onText: (text: string) => void, accept = 'application/json'): void {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = accept;
  input.onchange = (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (loadEvent) => onText(String(loadEvent.target?.result ?? ''));
    reader.readAsText(file);
  };
  input.click();
}
