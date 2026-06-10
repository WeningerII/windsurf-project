import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';

const baseProps = {
  open: true,
  title: 'Delete character',
  description: 'This cannot be undone.',
  confirmLabel: 'Delete',
  cancelLabel: 'Cancel',
  onConfirm: vi.fn(),
  onCancel: vi.fn(),
};

describe('ConfirmDialog', () => {
  let appRoot: HTMLDivElement;

  beforeEach(() => {
    appRoot = document.createElement('div');
    appRoot.id = 'root';
    document.body.appendChild(appRoot);
  });

  afterEach(() => {
    appRoot.remove();
  });

  it('renders nothing when closed', () => {
    render(<ConfirmDialog {...baseProps} open={false} />);
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
  });

  it('focuses the cancel button on open and calls callbacks', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    render(<ConfirmDialog {...baseProps} onConfirm={onConfirm} onCancel={onCancel} />);

    expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus();

    await user.click(screen.getByRole('button', { name: 'Delete' }));
    expect(onConfirm).toHaveBeenCalledTimes(1);

    await user.keyboard('{Escape}');
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('marks the app root inert while open and removes it on close', () => {
    const { rerender } = render(<ConfirmDialog {...baseProps} />);
    expect(appRoot.hasAttribute('inert')).toBe(true);

    rerender(<ConfirmDialog {...baseProps} open={false} />);
    expect(appRoot.hasAttribute('inert')).toBe(false);
  });

  it('removes inert and restores focus when unmounted while open', () => {
    const trigger = document.createElement('button');
    trigger.textContent = 'Open dialog';
    appRoot.appendChild(trigger);
    trigger.focus();

    const { unmount } = render(<ConfirmDialog {...baseProps} />);
    expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus();
    expect(appRoot.hasAttribute('inert')).toBe(true);

    unmount();

    expect(appRoot.hasAttribute('inert')).toBe(false);
    expect(trigger).toHaveFocus();
  });

  it('pulls focus back into the dialog when Tab is pressed with focus outside', () => {
    render(<ConfirmDialog {...baseProps} />);

    // Simulate focus escaping (e.g. after clicking the backdrop).
    (document.activeElement as HTMLElement | null)?.blur();
    expect(screen.getByRole('button', { name: 'Cancel' })).not.toHaveFocus();

    fireEvent.keyDown(document.body, { key: 'Tab' });

    expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus();
  });

  it('wraps focus at the dialog edges', () => {
    render(<ConfirmDialog {...baseProps} />);
    const cancel = screen.getByRole('button', { name: 'Cancel' });
    const confirm = screen.getByRole('button', { name: 'Delete' });

    confirm.focus();
    fireEvent.keyDown(confirm, { key: 'Tab' });
    expect(cancel).toHaveFocus();

    fireEvent.keyDown(cancel, { key: 'Tab', shiftKey: true });
    expect(confirm).toHaveFocus();
  });
});
