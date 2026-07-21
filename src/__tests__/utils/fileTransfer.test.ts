import { afterEach, describe, expect, it, vi } from 'vitest';
import { downloadTextFile, pickTextFile, readFileAsDataUrl } from '../../utils/fileTransfer';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('downloadTextFile', () => {
  it('writes a blob anchor with the filename and revokes the url', () => {
    const createObjectURL = vi.fn(() => 'blob:fake');
    const revokeObjectURL = vi.fn();
    vi.spyOn(URL, 'createObjectURL').mockImplementation(createObjectURL);
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(revokeObjectURL);

    const realCreate = document.createElement.bind(document);
    // Hold the captured anchor on an object so its property type survives at the
    // assertion site (a closure-assigned `let` narrows to its null initializer).
    const captured: { anchor: HTMLAnchorElement | null } = { anchor: null };
    vi.spyOn(document, 'createElement').mockImplementation(((tag: string) => {
      const el = realCreate(tag);
      if (tag === 'a') {
        captured.anchor = el as HTMLAnchorElement;
        vi.spyOn(captured.anchor, 'click').mockImplementation(() => {});
      }
      return el;
    }) as typeof document.createElement);

    downloadTextFile('{"a":1}', 'data.json');

    expect(createObjectURL).toHaveBeenCalledWith(expect.any(Blob));
    expect(captured.anchor?.download).toBe('data.json');
    expect(captured.anchor?.click).toHaveBeenCalledTimes(1);
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:fake');
  });
});

describe('pickTextFile', () => {
  function captureInput(): { getInput: () => HTMLInputElement | null } {
    const realCreate = document.createElement.bind(document);
    let input: HTMLInputElement | null = null;
    vi.spyOn(document, 'createElement').mockImplementation(((tag: string) => {
      const el = realCreate(tag);
      if (tag === 'input') {
        input = el as HTMLInputElement;
        vi.spyOn(input, 'click').mockImplementation(() => {});
      }
      return el;
    }) as typeof document.createElement);
    return { getInput: () => input };
  }

  function selectFile(input: HTMLInputElement, file: File | null) {
    Object.defineProperty(input, 'files', { configurable: true, value: file ? [file] : [] });
    const changeEvent = new Event('change');
    Object.defineProperty(changeEvent, 'target', { configurable: true, value: input });
    (input.onchange as ((event: Event) => void) | null)?.(changeEvent);
  }

  it('reads the chosen file as text and passes it on', () => {
    const { getInput } = captureInput();
    vi.spyOn(FileReader.prototype, 'readAsText').mockImplementation(function (this: FileReader) {
      this.onload?.({ target: { result: '{"hello":true}' } } as ProgressEvent<FileReader>);
    });

    const onText = vi.fn();
    pickTextFile(onText);
    const input = getInput();
    expect(input?.accept).toBe('application/json');
    selectFile(input as HTMLInputElement, new File(['{"hello":true}'], 'x.json'));

    expect(onText).toHaveBeenCalledWith('{"hello":true}');
  });

  it('does nothing when the picker is dismissed without a file', () => {
    const { getInput } = captureInput();
    const onText = vi.fn();
    pickTextFile(onText);
    selectFile(getInput() as HTMLInputElement, null);
    expect(onText).not.toHaveBeenCalled();
  });
});

describe('readFileAsDataUrl', () => {
  it('reads a File into a data URL', async () => {
    const file = new File(['map-bytes'], 'map.png', { type: 'image/png' });

    const dataUrl = await readFileAsDataUrl(file);

    expect(dataUrl.startsWith('data:')).toBe(true);
    expect(dataUrl).toContain('base64,');
  });
});
