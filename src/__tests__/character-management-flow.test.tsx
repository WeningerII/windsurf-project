import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { registerAllSystems } from '../systems';
import { systemRegistry } from '../registry';

const SHEET_LOAD_TIMEOUT_MS = 15000;
const FLOW_TEST_TIMEOUT_MS = 20000;

function getStoredDocuments(): Array<Record<string, unknown>> {
  const raw = localStorage.getItem('rpg-documents-v2');
  if (!raw) return [];
  const parsed = JSON.parse(raw) as { documents?: Array<Record<string, unknown>> };
  return parsed.documents || [];
}

async function selectSystemAndStartCreation(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', { name: /D&D 5e \(2024\)/i }));
  await user.click(screen.getByRole('button', { name: /create new character/i }));
  expect(
    await screen.findByTitle('Character name', {}, { timeout: SHEET_LOAD_TIMEOUT_MS })
  ).toHaveValue('New Character');
}

async function createCharacter(user: ReturnType<typeof userEvent.setup>, name: string) {
  const nameInput = await screen.findByTitle('Character name', {}, { timeout: SHEET_LOAD_TIMEOUT_MS });

  fireEvent.change(nameInput, {
    target: { value: name },
  });
  await waitFor(() => {
    expect(screen.getByTitle('Character name')).toHaveValue(name);
  });
}

async function waitForStoredDocuments(expectedCount: number) {
  await waitFor(() => {
    expect(getStoredDocuments()).toHaveLength(expectedCount);
  });
}

async function returnToList(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', { name: /^back$/i }));
  expect(await screen.findByRole('button', { name: /create new character/i })).toBeInTheDocument();
}

async function importViaDynamicInput(
  user: ReturnType<typeof userEvent.setup>,
  fileContents: string
) {
  const originalCreateElement = document.createElement.bind(document);
  let createdInput: HTMLInputElement | null = null;

  const createElementSpy = vi.spyOn(document, 'createElement').mockImplementation(((
    tagName: string
  ) => {
    const element = originalCreateElement(tagName);
    if (tagName.toLowerCase() === 'input') {
      createdInput = element as HTMLInputElement;
    }
    return element;
  }) as typeof document.createElement);

  await user.click(screen.getByRole('button', { name: /import character/i }));
  expect(createdInput).toBeTruthy();

  const file = new File([fileContents], 'documents.json', {
    type: 'application/json',
  });
  if (createdInput) {
    const inputElement = createdInput as HTMLInputElement;
    if (inputElement.onchange) {
      inputElement.onchange({
        target: { files: [file] },
      } as unknown as Event);
    }
  }

  createElementSpy.mockRestore();
}

describe('Character Management Flow', () => {
  beforeAll(() => {
    if (!systemRegistry.get('dnd-5e-2024')) {
      registerAllSystems();
    }
  });

  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it(
    'rehydrates saved characters from localStorage on app mount',
    async () => {
      const user = userEvent.setup();
      const { unmount } = render(<App />);

      await selectSystemAndStartCreation(user);
      await createCharacter(user, 'Persisted Hero');
      await waitFor(() => {
        expect(getStoredDocuments()).toMatchObject([{ name: 'Persisted Hero' }]);
      });
      await returnToList(user);

      unmount();
      render(<App />);
      expect(
        await screen.findByText('Persisted Hero', {}, { timeout: SHEET_LOAD_TIMEOUT_MS })
      ).toBeInTheDocument();
    },
    FLOW_TEST_TIMEOUT_MS
  );

  it('clears all characters when confirmation is accepted', async () => {
    const user = userEvent.setup();
    render(<App />);

    await selectSystemAndStartCreation(user);
    await createCharacter(user, 'Clearable Hero');
    await returnToList(user);

    await user.click(screen.getByRole('button', { name: /clear all characters/i }));
    // ConfirmDialog opens — click the Delete button to confirm
    await user.click(await screen.findByRole('button', { name: /delete/i }));

    expect(getStoredDocuments()).toHaveLength(0);
    expect(localStorage.getItem('rpg-documents-v2')).toBeNull();
    expect(screen.queryByText('Your Characters')).not.toBeInTheDocument();
  });

  it('does not clear characters when confirmation is rejected', async () => {
    const user = userEvent.setup();
    render(<App />);

    await selectSystemAndStartCreation(user);
    await createCharacter(user, 'Protected Hero');
    await waitForStoredDocuments(1);
    await returnToList(user);

    await user.click(screen.getByRole('button', { name: /clear all characters/i }));
    // ConfirmDialog opens — click Cancel to reject
    await user.click(await screen.findByRole('button', { name: /cancel/i }));

    expect(getStoredDocuments()).toHaveLength(1);
    expect(screen.getByText('Protected Hero')).toBeInTheDocument();
  });

  it('deletes the current character from the header action', async () => {
    const user = userEvent.setup();
    render(<App />);

    await selectSystemAndStartCreation(user);
    await createCharacter(user, 'Delete Me');

    await user.click(screen.getByTitle('Delete character'));

    expect(await screen.findByText('Choose a Game System')).toBeInTheDocument();
    expect(getStoredDocuments()).toHaveLength(0);
  });

  it('clones the current character from the header action', async () => {
    const user = userEvent.setup();
    render(<App />);

    await selectSystemAndStartCreation(user);
    await createCharacter(user, 'Clone Me');

    await user.click(screen.getByTitle('Clone character'));

    await waitFor(() => {
      expect(screen.getByTitle('Character name')).toHaveValue('Clone Me (Copy)');
      expect(getStoredDocuments()).toHaveLength(2);
    });
  });

  it('filters the character list by selected system', async () => {
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

    await waitFor(() => {
      expect(screen.getByText('System B Hero')).toBeInTheDocument();
      expect(screen.queryByText('System A Hero')).not.toBeInTheDocument();
    });
  });

  it('exports the current character as a V2 JSON data URI', async () => {
    const user = userEvent.setup();
    render(<App />);

    await selectSystemAndStartCreation(user);
    await createCharacter(user, 'Exportable Hero');

    const originalCreateElement = document.createElement.bind(document);
    let capturedHref = '';
    let capturedDownload = '';
    const clickSpy = vi.fn();

    const createElementSpy = vi.spyOn(document, 'createElement').mockImplementation(((
      tagName: string
    ) => {
      const element = originalCreateElement(tagName);
      if (tagName.toLowerCase() === 'a') {
        const originalSetAttribute = element.setAttribute.bind(element);
        element.setAttribute = ((name: string, value: string) => {
          if (name === 'href') capturedHref = value;
          if (name === 'download') capturedDownload = value;
          originalSetAttribute(name, value);
        }) as typeof element.setAttribute;
        element.click = clickSpy as unknown as typeof element.click;
      }
      return element;
    }) as typeof document.createElement);

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

    createElementSpy.mockRestore();
  });

  it('exports all characters from the list view as one V2 payload', async () => {
    const user = userEvent.setup();
    render(<App />);

    await selectSystemAndStartCreation(user);
    await createCharacter(user, 'Batch Hero');
    await user.click(screen.getByTitle('Clone character'));
    await returnToList(user);

    const originalCreateElement = document.createElement.bind(document);
    let capturedHref = '';
    let capturedDownload = '';
    const clickSpy = vi.fn();

    const createElementSpy = vi.spyOn(document, 'createElement').mockImplementation(((
      tagName: string
    ) => {
      const element = originalCreateElement(tagName);
      if (tagName.toLowerCase() === 'a') {
        const originalSetAttribute = element.setAttribute.bind(element);
        element.setAttribute = ((name: string, value: string) => {
          if (name === 'href') capturedHref = value;
          if (name === 'download') capturedDownload = value;
          originalSetAttribute(name, value);
        }) as typeof element.setAttribute;
        element.click = clickSpy as unknown as typeof element.click;
      }
      return element;
    }) as typeof document.createElement);

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

    createElementSpy.mockRestore();
  });

  it('re-imports a previously exported V2 document via Import Character', async () => {
    const user = userEvent.setup();
    render(<App />);

    await selectSystemAndStartCreation(user);
    await createCharacter(user, 'Importable Hero');
    await waitForStoredDocuments(1);
    const exported = localStorage.getItem('rpg-documents-v2');
    expect(exported).toBeTruthy();

    await returnToList(user);
    await user.click(screen.getByRole('button', { name: /clear all characters/i }));
    // ConfirmDialog opens — click Delete to confirm
    await user.click(await screen.findByRole('button', { name: /delete/i }));
    expect(getStoredDocuments()).toHaveLength(0);

    await importViaDynamicInput(user, exported as string);

    await waitFor(() => {
      expect(screen.getByTitle('Character name')).toHaveValue('Importable Hero');
      expect(getStoredDocuments()).toHaveLength(1);
    });
  });
});
