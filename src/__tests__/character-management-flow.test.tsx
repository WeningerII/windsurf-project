import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { createDefaultDnd5e2024Data } from '../systems/dnd5e-2024/data-model';
import { registerAllSystems } from '../systems';
import { systemRegistry } from '../registry';
import { exportDocuments, resetDocumentStorageDiagnosticsForTests } from '../utils/documentStorage';
import { idbClearDocuments } from '../utils/indexedDBAdapter';

const SHEET_LOAD_TIMEOUT_MS = 60000;
const FLOW_WAIT_TIMEOUT_MS = 60000;
const FLOW_TEST_TIMEOUT_MS = 60000;
const HEAVY_FLOW_TEST_TIMEOUT_MS = 180000;

function getStoredDocuments(): Array<Record<string, unknown>> {
  const raw = localStorage.getItem('rpg-documents-v2');
  if (!raw) return [];
  const parsed = JSON.parse(raw) as { documents?: Array<Record<string, unknown>> };
  return parsed.documents || [];
}

function makeStoredDocument(id: string, name: string) {
  return {
    id,
    name,
    systemId: 'dnd-5e-2024',
    system: createDefaultDnd5e2024Data(),
    createdAt: new Date('2026-02-24T00:00:00.000Z'),
    updatedAt: new Date('2026-02-24T00:00:00.000Z'),
  };
}

function setStoredDocuments(documents: Parameters<typeof exportDocuments>[0]) {
  localStorage.setItem('rpg-documents-v2', exportDocuments(documents));
}

async function selectSystemAndStartCreation(
  user: ReturnType<typeof userEvent.setup>,
  timeoutMs = SHEET_LOAD_TIMEOUT_MS
) {
  await user.click(screen.getByRole('button', { name: /D&D 5e \(2024\)/i }));
  await user.click(screen.getByRole('button', { name: /create new character/i }));
  await screen.findByTitle('Character name', {}, { timeout: timeoutMs });
  await waitFor(
    () => {
      expect(screen.getByTitle('Character name')).toHaveValue('New Character');
    },
    { timeout: timeoutMs }
  );
}

async function createCharacter(user: ReturnType<typeof userEvent.setup>, name: string) {
  const nameInput = await screen.findByTitle(
    'Character name',
    {},
    { timeout: SHEET_LOAD_TIMEOUT_MS }
  );

  fireEvent.change(nameInput, {
    target: { value: name },
  });
  await waitFor(
    () => {
      expect(screen.getByTitle('Character name')).toHaveValue(name);
    },
    { timeout: FLOW_WAIT_TIMEOUT_MS }
  );
}

async function waitForStoredDocuments(expectedCount: number) {
  await waitFor(
    () => {
      expect(getStoredDocuments()).toHaveLength(expectedCount);
    },
    { timeout: FLOW_WAIT_TIMEOUT_MS }
  );
}

async function returnToList(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', { name: /^back$/i }));
  expect(
    await screen.findByRole(
      'button',
      { name: /create new character/i },
      { timeout: SHEET_LOAD_TIMEOUT_MS }
    )
  ).toBeInTheDocument();
}

async function importViaDynamicInput(
  user: ReturnType<typeof userEvent.setup>,
  fileContents: string
) {
  const originalCreateElement = document.createElement.bind(document);
  let createdInput: HTMLInputElement | null = null;
  const readAsTextSpy = vi.spyOn(FileReader.prototype, 'readAsText').mockImplementation(function (
    this: FileReader
  ) {
    this.onload?.({ target: { result: fileContents } } as ProgressEvent<FileReader>);
  });

  const createElementSpy = vi.spyOn(document, 'createElement').mockImplementation(((
    tagName: string
  ) => {
    const element = originalCreateElement(tagName);
    if (tagName.toLowerCase() === 'input') {
      createdInput = element as HTMLInputElement;
    }
    return element;
  }) as typeof document.createElement);

  try {
    const importButton = await screen.findByRole(
      'button',
      { name: /import character/i },
      { timeout: FLOW_WAIT_TIMEOUT_MS }
    );
    await user.click(importButton);
    await waitFor(
      () => {
        expect(createdInput).toBeTruthy();
      },
      { timeout: FLOW_WAIT_TIMEOUT_MS }
    );

    const file = new File([fileContents], 'documents.json', {
      type: 'application/json',
    });

    if (!createdInput) {
      throw new Error('Expected import input to be created');
    }

    const input = createdInput as HTMLInputElement;

    Object.defineProperty(input, 'files', {
      configurable: true,
      value: [file],
    });
    const changeEvent = new Event('change');
    Object.defineProperty(changeEvent, 'target', {
      configurable: true,
      value: input,
    });
    const handleChange = input.onchange as ((event: Event) => void) | null;
    await act(async () => {
      handleChange?.(changeEvent);
    });
  } finally {
    createElementSpy.mockRestore();
    readAsTextSpy.mockRestore();
  }
}

describe('Character Management Flow', () => {
  beforeAll(() => {
    if (!systemRegistry.get('dnd-5e-2024')) {
      registerAllSystems();
    }
  });

  beforeEach(async () => {
    localStorage.clear();
    resetDocumentStorageDiagnosticsForTests();
    await idbClearDocuments();
    vi.restoreAllMocks();
  });

  afterEach(async () => {
    cleanup();
    localStorage.clear();
    resetDocumentStorageDiagnosticsForTests();
    await idbClearDocuments();
    vi.restoreAllMocks();
  });

  it(
    'rehydrates saved characters from localStorage on app mount',
    async () => {
      setStoredDocuments([makeStoredDocument('persisted-hero-doc', 'Persisted Hero')]);
      render(<App />);

      expect(
        await screen.findByText('Persisted Hero', {}, { timeout: SHEET_LOAD_TIMEOUT_MS })
      ).toBeInTheDocument();
    },
    HEAVY_FLOW_TEST_TIMEOUT_MS
  );

  it(
    'clears all characters when confirmation is accepted',
    async () => {
      const user = userEvent.setup();
      setStoredDocuments([makeStoredDocument('clearable-hero-doc', 'Clearable Hero')]);
      render(<App />);

      expect(
        await screen.findByText('Clearable Hero', {}, { timeout: FLOW_WAIT_TIMEOUT_MS })
      ).toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: /clear all characters/i }));
      // ConfirmDialog opens — click the Delete button to confirm
      await user.click(await screen.findByRole('button', { name: /delete/i }));

      expect(getStoredDocuments()).toHaveLength(0);
      expect(localStorage.getItem('rpg-documents-v2')).toBeNull();
      expect(screen.queryByText('Your Characters')).not.toBeInTheDocument();
    },
    FLOW_TEST_TIMEOUT_MS
  );

  it(
    'does not clear characters when confirmation is rejected',
    async () => {
      const user = userEvent.setup();
      setStoredDocuments([makeStoredDocument('protected-hero-doc', 'Protected Hero')]);
      render(<App />);

      expect(
        await screen.findByText('Protected Hero', {}, { timeout: FLOW_WAIT_TIMEOUT_MS })
      ).toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: /clear all characters/i }));
      // ConfirmDialog opens — click Cancel to reject
      await user.click(await screen.findByRole('button', { name: /cancel/i }));

      expect(getStoredDocuments()).toHaveLength(1);
      expect(screen.getByText('Protected Hero')).toBeInTheDocument();
    },
    FLOW_TEST_TIMEOUT_MS
  );

  it(
    'deletes the current character from the header action',
    async () => {
      const user = userEvent.setup();
      setStoredDocuments([makeStoredDocument('delete-me-doc', 'Delete Me')]);
      render(<App />);

      const deleteCard = await screen.findByText(
        'Delete Me',
        {},
        { timeout: FLOW_WAIT_TIMEOUT_MS }
      );
      const deleteCardButton = deleteCard.closest('button');

      if (!deleteCardButton) {
        throw new Error('Expected stored character card button');
      }

      await user.click(deleteCardButton);

      await user.click(screen.getByTitle('Delete character'));

      await waitFor(
        () => {
          expect(screen.getByText('Choose a Game System')).toBeInTheDocument();
          expect(getStoredDocuments()).toHaveLength(0);
        },
        { timeout: FLOW_WAIT_TIMEOUT_MS }
      );
    },
    FLOW_TEST_TIMEOUT_MS
  );

  it(
    'clones the current character from the header action',
    async () => {
      const user = userEvent.setup();
      setStoredDocuments([makeStoredDocument('clone-me-doc', 'Clone Me')]);
      render(<App />);

      const cloneCard = await screen.findByText('Clone Me', {}, { timeout: FLOW_WAIT_TIMEOUT_MS });
      const cloneCardButton = cloneCard.closest('button');

      if (!cloneCardButton) {
        throw new Error('Expected stored character card button');
      }

      await user.click(cloneCardButton);

      await user.click(
        await screen.findByTitle('Clone character', {}, { timeout: FLOW_WAIT_TIMEOUT_MS })
      );

      await waitFor(
        () => {
          expect(screen.getByTitle('Character name')).toHaveValue('Clone Me (Copy)');
        },
        { timeout: FLOW_WAIT_TIMEOUT_MS }
      );

      await user.click(screen.getByRole('button', { name: /^back$/i }));
      await waitFor(
        () => {
          expect(screen.getByText('Your Characters')).toBeInTheDocument();
          expect(getStoredDocuments()).toHaveLength(2);
          expect(screen.getByText('Clone Me (Copy)')).toBeInTheDocument();
        },
        { timeout: FLOW_WAIT_TIMEOUT_MS }
      );
    },
    HEAVY_FLOW_TEST_TIMEOUT_MS
  );

  it(
    'filters the character list by selected system',
    async () => {
      const user = userEvent.setup();
      render(<App />);

      await selectSystemAndStartCreation(user);
      await createCharacter(user, 'System A Hero');
      await returnToList(user);

      await user.click(screen.getByRole('button', { name: /Pathfinder 2e/i }));
      await user.click(screen.getByRole('button', { name: /create new character/i }));
      await createCharacter(user, 'System B Hero');
      await returnToList(user);

      await user.selectOptions(screen.getByTitle('Filter by system'), 'pf2e');

      await waitFor(
        () => {
          expect(screen.getByText('System B Hero')).toBeInTheDocument();
          expect(screen.queryByText('System A Hero')).not.toBeInTheDocument();
        },
        { timeout: FLOW_WAIT_TIMEOUT_MS }
      );
    },
    HEAVY_FLOW_TEST_TIMEOUT_MS
  );

  it(
    'exports current character as a V2 JSON payload',
    async () => {
      const user = userEvent.setup();
      render(<App />);

      await selectSystemAndStartCreation(user);
      await createCharacter(user, 'Exportable Hero');

      const originalSetAttribute = HTMLAnchorElement.prototype.setAttribute;
      let capturedHref = '';
      let capturedDownload = '';
      const setAttributeSpy = vi
        .spyOn(HTMLAnchorElement.prototype, 'setAttribute')
        .mockImplementation(function (this: HTMLAnchorElement, name: string, value: string) {
          if (name === 'href') capturedHref = value;
          if (name === 'download') capturedDownload = value;
          return originalSetAttribute.call(this, name, value);
        });
      const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

      try {
        await user.click(screen.getByTitle('Export character'));

        expect(clickSpy).toHaveBeenCalledTimes(1);
        expect(capturedDownload).toBe('exportable_hero_character.json');
        expect(capturedHref.startsWith('data:application/json;charset=utf-8,')).toBe(true);

        const encodedPayload = capturedHref.split(',', 2)[1] ?? '';
        const exported = JSON.parse(decodeURIComponent(encodedPayload)) as {
          version?: string;
          documents?: Array<{ name?: string; systemId?: string }>;
        };
        expect(exported.version).toBe('2.0');
        expect(exported.documents).toHaveLength(1);
        expect(exported.documents?.[0]?.name).toBe('Exportable Hero');
        expect(exported.documents?.[0]?.systemId).toBe('dnd-5e-2024');
      } finally {
        setAttributeSpy.mockRestore();
        clickSpy.mockRestore();
      }
    },
    HEAVY_FLOW_TEST_TIMEOUT_MS
  );

  it(
    'exports all characters from the list view as one V2 payload',
    async () => {
      const user = userEvent.setup();
      render(<App />);

      await selectSystemAndStartCreation(user);
      await createCharacter(user, 'Batch Hero');
      await user.click(screen.getByTitle('Clone character'));
      await returnToList(user);

      const originalSetAttribute = HTMLAnchorElement.prototype.setAttribute;
      let capturedHref = '';
      let capturedDownload = '';
      const setAttributeSpy = vi
        .spyOn(HTMLAnchorElement.prototype, 'setAttribute')
        .mockImplementation(function (this: HTMLAnchorElement, name: string, value: string) {
          if (name === 'href') capturedHref = value;
          if (name === 'download') capturedDownload = value;
          return originalSetAttribute.call(this, name, value);
        });
      const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

      try {
        await user.click(screen.getByRole('button', { name: /export all characters/i }));

        expect(clickSpy).toHaveBeenCalledTimes(1);
        expect(capturedDownload).toMatch(/^all_characters_\d{4}-\d{2}-\d{2}\.json$/);
        expect(capturedHref.startsWith('data:application/json;charset=utf-8,')).toBe(true);

        const encodedPayload = capturedHref.split(',', 2)[1] ?? '';
        const exported = JSON.parse(decodeURIComponent(encodedPayload)) as {
          version?: string;
          documents?: Array<{ name?: string; systemId?: string }>;
        };
        expect(exported.version).toBe('2.0');
        expect(exported.documents).toHaveLength(2);
      } finally {
        setAttributeSpy.mockRestore();
        clickSpy.mockRestore();
      }
    },
    HEAVY_FLOW_TEST_TIMEOUT_MS
  );

  it(
    're-imports a previously exported V2 document via Import Character',
    async () => {
      const user = userEvent.setup();
      render(<App />);

      const exported = exportDocuments([
        makeStoredDocument('importable-hero-doc', 'Importable Hero'),
      ]);

      await user.click(screen.getByRole('button', { name: /D&D 5e \(2024\)/i }));
      await importViaDynamicInput(user, exported);

      await waitFor(
        () => {
          expect(getStoredDocuments()).toHaveLength(1);
          expect(screen.getByTitle('Character name')).toHaveValue('Importable Hero');
        },
        { timeout: FLOW_WAIT_TIMEOUT_MS }
      );
    },
    HEAVY_FLOW_TEST_TIMEOUT_MS
  );
});
