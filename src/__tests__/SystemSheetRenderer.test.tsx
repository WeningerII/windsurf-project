import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { ComponentType } from 'react';
import { SystemSheetRenderer } from '../components/SystemSheetRenderer';
import { systemRegistry } from '../registry';
import type { CharacterDocument, SystemDataModel } from '../types/core/document';

const baseDocument: CharacterDocument<SystemDataModel> = {
  id: 'doc-renderer-1',
  name: 'Renderer Hero',
  systemId: 'dnd-5e-2024',
  system: { level: 1 },
  createdAt: new Date('2026-02-01T00:00:00.000Z'),
  updatedAt: new Date('2026-02-02T00:00:00.000Z'),
};

describe('SystemSheetRenderer', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders an error message when no system definition is registered', () => {
    vi.spyOn(systemRegistry, 'get').mockReturnValue(undefined);

    render(<SystemSheetRenderer document={baseDocument} onUpdate={vi.fn()} />);

    expect(screen.getByText(/System definition not found/i)).toBeInTheDocument();
  });

  it('renders the system sheet component when a definition exists', () => {
    const onUpdate = vi.fn();
    const sheetRenderSpy = vi.fn(() => <div>Mock Sheet</div>);

    vi.spyOn(systemRegistry, 'get').mockReturnValue({
      id: 'dnd-5e-2024',
      name: 'Mock System',
      createDefaultData: () => ({ level: 1 }),
      engine: {
        prepareData: (doc: CharacterDocument<SystemDataModel>) => doc,
        rollCheck: () => ({ total: 0, rolls: [0], formula: '1d20+0' }),
        applyDamage: (doc: CharacterDocument<SystemDataModel>) => doc,
      },
      SheetComponent: sheetRenderSpy as unknown as ComponentType<{
        document: CharacterDocument<SystemDataModel>;
        onUpdate?: (doc: CharacterDocument<SystemDataModel>) => void;
      }>,
    });

    render(<SystemSheetRenderer document={baseDocument} onUpdate={onUpdate} />);

    expect(screen.getByText('Mock Sheet')).toBeInTheDocument();
    expect(sheetRenderSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        document: baseDocument,
        onUpdate,
      }),
      expect.anything()
    );
  });
});
