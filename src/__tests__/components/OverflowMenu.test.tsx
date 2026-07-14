import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { OverflowMenu } from '../../components/ui/OverflowMenu';

function renderMenu(overrides: Partial<Parameters<typeof OverflowMenu>[0]> = {}) {
  const onExport = vi.fn();
  const onDelete = vi.fn();
  const utils = render(
    <OverflowMenu
      label="Character actions"
      items={[
        { label: 'Export', onSelect: onExport },
        { label: 'Delete', destructive: true, onSelect: onDelete },
      ]}
      {...overrides}
    />
  );
  return { ...utils, onExport, onDelete };
}

describe('OverflowMenu', () => {
  it('is closed by default and opens on trigger click', async () => {
    const user = userEvent.setup();
    renderMenu();

    const trigger = screen.getByRole('button', { name: 'Character actions' });
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();

    await user.click(trigger);

    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('menu', { name: 'Character actions' })).toBeInTheDocument();
    expect(screen.getAllByRole('menuitem')).toHaveLength(2);
  });

  it('selecting an item fires its handler, closes the menu, and refocuses the trigger', async () => {
    const user = userEvent.setup();
    const { onExport, onDelete } = renderMenu();

    const trigger = screen.getByRole('button', { name: 'Character actions' });
    await user.click(trigger);
    await user.click(screen.getByRole('menuitem', { name: 'Export' }));

    expect(onExport).toHaveBeenCalledTimes(1);
    expect(onDelete).not.toHaveBeenCalled();
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('Escape closes the menu and refocuses the trigger', async () => {
    const user = userEvent.setup();
    renderMenu();

    const trigger = screen.getByRole('button', { name: 'Character actions' });
    await user.click(trigger);
    expect(screen.getByRole('menu')).toBeInTheDocument();

    await user.keyboard('{Escape}');

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveFocus();
  });

  it('Escape dismissing the menu does not reach a global window Escape listener', async () => {
    // Regression: App registers a bubble-phase window Escape shortcut that
    // closes the whole sheet. Dismissing this menu with Escape must swallow the
    // event (capture-phase stopPropagation) so it does not also kick the user
    // back to the roster. The outer listener stands in for App's shortcut.
    const user = userEvent.setup();
    const outerEscape = vi.fn();
    const outer = (e: KeyboardEvent) => {
      if (e.key === 'Escape') outerEscape();
    };
    window.addEventListener('keydown', outer);
    try {
      renderMenu();
      await user.click(screen.getByRole('button', { name: 'Character actions' }));
      expect(screen.getByRole('menu')).toBeInTheDocument();

      await user.keyboard('{Escape}');

      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
      expect(outerEscape).not.toHaveBeenCalled();
    } finally {
      window.removeEventListener('keydown', outer);
    }
  });

  it('clicking outside (the backdrop) closes the menu', async () => {
    const user = userEvent.setup();
    const { container } = renderMenu();

    await user.click(screen.getByRole('button', { name: 'Character actions' }));
    expect(screen.getByRole('menu')).toBeInTheDocument();

    const backdrop = container.querySelector('.fixed.inset-0');
    expect(backdrop).not.toBeNull();
    fireEvent.click(backdrop as Element);

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('styles destructive items with the destructive token', async () => {
    const user = userEvent.setup();
    renderMenu();

    await user.click(screen.getByRole('button', { name: 'Character actions' }));

    expect(screen.getByRole('menuitem', { name: 'Delete' }).className).toContain(
      'text-destructive'
    );
    expect(screen.getByRole('menuitem', { name: 'Export' }).className).not.toContain(
      'text-destructive'
    );
  });
});
