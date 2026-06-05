import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { registerAllSystems } from '../../systems';
import { PromptCreateCharacter } from '../../components/PromptCreateCharacter';
import type { CharacterDocument, SystemDataModel } from '../../types/core/document';

beforeAll(() => {
  registerAllSystems();
});

describe('PromptCreateCharacter', () => {
  it('generates a finished character from a typed prompt and hands it up', async () => {
    const user = userEvent.setup();
    const onCreated = vi.fn<(doc: CharacterDocument<SystemDataModel>) => void>();
    const onNotify = vi.fn();

    render(
      <PromptCreateCharacter systemId="daggerheart" onCreated={onCreated} onNotify={onNotify} />
    );

    await user.type(screen.getByRole('textbox'), 'a sneaky rogue named Vell');
    await user.click(screen.getByRole('button', { name: /generate character/i }));

    await waitFor(() => expect(onCreated).toHaveBeenCalledTimes(1));

    const doc = onCreated.mock.calls[0][0];
    expect(doc.systemId).toBe('daggerheart');
    expect(doc.name).toBe('Vell');
    // The handed-up document is already derived (HP computed off the class).
    expect(doc.system.hitPoints.max).toBeGreaterThan(0);
    expect(onNotify).toHaveBeenCalled();
  });

  it('does not submit an empty prompt', async () => {
    const user = userEvent.setup();
    const onCreated = vi.fn();

    render(<PromptCreateCharacter systemId="daggerheart" onCreated={onCreated} />);

    const button = screen.getByRole('button', { name: /generate character/i });
    expect(button).toBeDisabled();
    await user.click(button);
    expect(onCreated).not.toHaveBeenCalled();
  });
});
