import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AccessibleDialog } from '../../components/AccessibleDialog';

describe('AccessibleDialog', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders nothing when closed', () => {
    render(
      <AccessibleDialog isOpen={false} onClose={vi.fn()} title="Dialog title">
        <p>Dialog content</p>
      </AccessibleDialog>
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders with title, content, and ARIA label when open', () => {
    render(
      <AccessibleDialog isOpen onClose={vi.fn()} title="Dialog title" ariaLabel="Custom ARIA">
        <p>Dialog content</p>
      </AccessibleDialog>
    );

    expect(screen.getByRole('dialog', { name: 'Custom ARIA' })).toBeInTheDocument();
    expect(screen.getByText('Dialog title')).toBeInTheDocument();
    expect(screen.getByText('Dialog content')).toBeInTheDocument();
  });

  it('closes on overlay click, close button click, and Escape key', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <AccessibleDialog isOpen onClose={onClose} title="Closable dialog">
        <p>Dialog content</p>
      </AccessibleDialog>
    );

    await user.click(screen.getByLabelText('Close dialog'));
    fireEvent.keyDown(document, { key: 'Escape' });
    fireEvent.click(screen.getByRole('dialog'));

    expect(onClose).toHaveBeenCalledTimes(3);
  });

  it('does not close when clicking inside dialog content', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <AccessibleDialog isOpen onClose={onClose} title="Inside click test">
        <button type="button">Inner Action</button>
      </AccessibleDialog>
    );

    await user.click(screen.getByText('Inner Action'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('restores prior focus when dialog closes', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    const { rerender } = render(
      <>
        <button type="button">Trigger</button>
        <AccessibleDialog isOpen onClose={onClose} title="Focus test">
          <p>Dialog content</p>
        </AccessibleDialog>
      </>
    );

    const trigger = screen.getByText('Trigger');
    trigger.focus();

    rerender(
      <>
        <button type="button">Trigger</button>
        <AccessibleDialog isOpen={false} onClose={onClose} title="Focus test">
          <p>Dialog content</p>
        </AccessibleDialog>
      </>
    );

    await user.tab();
    expect(document.activeElement).toBe(screen.getByText('Trigger'));
  });
});
