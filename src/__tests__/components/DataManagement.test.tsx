import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DataManagement } from '../../components/DataManagement';
import type { Character } from '../../types/game-systems';
import { exportCharacters, importCharacters } from '../../utils/storage';

vi.mock('../../utils/storage', () => ({
  exportCharacters: vi.fn(),
  importCharacters: vi.fn(),
}));

const mockCharacter: Character = {
  id: 'test-char-1',
  name: 'Test Character',
  system: 'dnd-5e-2024',
  level: 5,
  experiencePoints: 6500,
  classLevels: [{ classId: 'fighter', level: 5, hitDieRolls: [8, 7, 6, 8, 7] }],
  baseAttributes: {
    str: 16,
    dex: 14,
    con: 15,
    int: 10,
    wis: 12,
    cha: 8,
  },
  skillProficiencies: {},
  hitPoints: { current: 42, max: 42, temp: 0 },
  hitDice: [{ die: 'd10', total: 5, remaining: 5 }],
  armorClass: 16,
  initiative: 2,
  speed: 30,
  armorProficiencies: [],
  weaponProficiencies: [],
  toolProficiencies: [],
  languageProficiencies: [],
  savingThrowProficiencies: ['str', 'con'],
  features: [],
  feats: [],
  equipment: [],
  inventory: [],
  currency: { copper: 0, silver: 0, electrum: 0, gold: 100, platinum: 0 },
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-26'),
};

describe('DataManagement', () => {
  const mockOnImport = vi.fn();
  const mockOnClearAll = vi.fn();
  const exportMock = vi.mocked(exportCharacters);
  const importMock = vi.mocked(importCharacters);

  beforeEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    mockOnImport.mockReset();
    mockOnClearAll.mockReset();
    exportMock.mockReset();
    importMock.mockReset();

    exportMock.mockReturnValue('{"characters":[]}');
    importMock.mockReturnValue([mockCharacter]);

    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:test-url');
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
  });

  function renderComponent(characters: Character[] = [mockCharacter]) {
    return render(
      <DataManagement
        characters={characters}
        onImport={mockOnImport}
        onClearAll={mockOnClearAll}
      />
    );
  }

  it('renders controls and disables destructive actions when no characters exist', () => {
    renderComponent([]);
    expect(screen.getByText('Data Management')).toBeInTheDocument();
    expect(screen.getByText(/Export, import, or manage your character data/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /export characters/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /clear all data/i })).toBeDisabled();
  });

  it('exports characters and shows success feedback', async () => {
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

    renderComponent();
    fireEvent.click(screen.getByRole('button', { name: /export characters/i }));

    expect(exportMock).toHaveBeenCalledWith([mockCharacter]);
    expect(clickSpy).toHaveBeenCalledTimes(1);
    expect(URL.createObjectURL).toHaveBeenCalled();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:test-url');
    expect(screen.getByText('Characters exported successfully!')).toBeInTheDocument();
  });

  it('shows export errors for Error and non-Error throw paths', async () => {
    const user = userEvent.setup();
    exportMock.mockImplementationOnce(() => {
      throw new Error('Export failed hard');
    });

    renderComponent();
    await user.click(screen.getByRole('button', { name: /export characters/i }));
    expect(screen.getByText('Export failed hard')).toBeInTheDocument();

    exportMock.mockImplementationOnce(() => {
      throw 'bad export';
    });
    await user.click(screen.getByRole('button', { name: /export characters/i }));
    expect(screen.getByText('Failed to export characters')).toBeInTheDocument();
  });

  it('triggers hidden file input from import button', async () => {
    const user = userEvent.setup();
    renderComponent();

    const input = screen.getByLabelText('Import character file') as HTMLInputElement;
    const clickSpy = vi.spyOn(input, 'click').mockImplementation(() => {});
    await user.click(screen.getByRole('button', { name: /import characters/i }));

    expect(clickSpy).toHaveBeenCalledTimes(1);
  });

  it('ignores empty file selection', () => {
    renderComponent();
    const input = screen.getByLabelText('Import character file') as HTMLInputElement;

    fireEvent.change(input, { target: { files: [] } });
    expect(importMock).not.toHaveBeenCalled();
    expect(mockOnImport).not.toHaveBeenCalled();
  });

  it('imports characters successfully and resets file input', async () => {
    renderComponent();

    const input = screen.getByLabelText('Import character file') as HTMLInputElement;
    const file = {
      text: vi.fn().mockResolvedValue('{"characters":[1]}'),
      name: 'characters.json',
      type: 'application/json',
    } as unknown as File;
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(importMock).toHaveBeenCalledTimes(1);
    });
    expect(mockOnImport).toHaveBeenCalledWith([mockCharacter]);
    expect(screen.getByText('Successfully imported 1 character(s)!')).toBeInTheDocument();
    expect(input.value).toBe('');
  });

  it('shows import errors for Error and non-Error throw paths', async () => {
    const user = userEvent.setup();
    renderComponent();
    const input = screen.getByLabelText('Import character file') as HTMLInputElement;
    const file = new File(['{}'], 'characters.json', { type: 'application/json' });

    importMock.mockImplementationOnce(() => {
      throw new Error('Import failed hard');
    });
    await user.upload(input, file);
    expect(screen.getByText('Import failed hard')).toBeInTheDocument();

    importMock.mockImplementationOnce(() => {
      throw 'bad import';
    });
    await user.upload(input, file);
    expect(screen.getByText('Failed to import characters')).toBeInTheDocument();
  });

  it('clears all characters when confirmed and does nothing when rejected', async () => {
    const user = userEvent.setup();
    const confirmSpy = vi.fn();
    vi.stubGlobal('confirm', confirmSpy);
    renderComponent();

    confirmSpy.mockReturnValueOnce(false);
    await user.click(screen.getByRole('button', { name: /clear all data/i }));
    expect(mockOnClearAll).not.toHaveBeenCalled();

    confirmSpy.mockReturnValueOnce(true);
    await user.click(screen.getByRole('button', { name: /clear all data/i }));
    expect(mockOnClearAll).toHaveBeenCalledTimes(1);
    expect(screen.getByText('All characters deleted successfully.')).toBeInTheDocument();
  });
});
