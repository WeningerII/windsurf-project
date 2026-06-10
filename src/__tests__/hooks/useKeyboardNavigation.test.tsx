import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { useKeyboardNavigation } from '../../hooks/useKeyboardNavigation';

interface HarnessProps {
  onUndo?: () => void;
  onRedo?: () => void;
  onEscape?: () => void;
  onCreate?: () => void;
}

function Harness({
  onUndo = () => {},
  onRedo = () => {},
  onEscape = () => {},
  onCreate = () => {},
}: HarnessProps) {
  useKeyboardNavigation([
    { key: 'Escape', callback: onEscape, description: 'Back to character list' },
    { key: 'n', alt: true, callback: onCreate, description: 'Create new character' },
    { key: 'z', ctrl: true, callback: onUndo, description: 'Undo last change' },
    { key: 'z', ctrl: true, shift: true, callback: onRedo, description: 'Redo last undone change' },
  ]);

  return (
    <div>
      <input title="Text field" />
      <textarea title="Notes field" />
      <select title="Select field">
        <option value="a">a</option>
      </select>
      <div contentEditable suppressContentEditableWarning title="Rich text" data-testid="editor">
        editable
      </div>
      <button type="button">Focusable button</button>
    </div>
  );
}

describe('useKeyboardNavigation', () => {
  it('fires a matching Ctrl shortcut outside editable elements and prevents default', () => {
    const onUndo = vi.fn();
    render(<Harness onUndo={onUndo} />);

    const notPrevented = fireEvent.keyDown(document.body, { key: 'z', ctrlKey: true });

    expect(onUndo).toHaveBeenCalledTimes(1);
    // fireEvent returns false when preventDefault was called.
    expect(notPrevented).toBe(false);
  });

  it('accepts Meta (Cmd) as the primary modifier for Ctrl shortcuts', () => {
    const onUndo = vi.fn();
    const onRedo = vi.fn();
    render(<Harness onUndo={onUndo} onRedo={onRedo} />);

    fireEvent.keyDown(document.body, { key: 'z', metaKey: true });
    expect(onUndo).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(document.body, { key: 'Z', metaKey: true, shiftKey: true });
    expect(onRedo).toHaveBeenCalledTimes(1);
  });

  it('does not run shortcuts without their primary modifier when Ctrl or Meta is held', () => {
    const onCreate = vi.fn();
    render(<Harness onCreate={onCreate} />);

    fireEvent.keyDown(document.body, { key: 'n', altKey: true, ctrlKey: true });
    fireEvent.keyDown(document.body, { key: 'n', altKey: true, metaKey: true });

    expect(onCreate).not.toHaveBeenCalled();
  });

  it('fires Alt+N for character creation', () => {
    const onCreate = vi.fn();
    render(<Harness onCreate={onCreate} />);

    fireEvent.keyDown(document.body, { key: 'n', altKey: true });

    expect(onCreate).toHaveBeenCalledTimes(1);
  });

  it.each([
    ['input', () => screen.getByTitle('Text field')],
    ['textarea', () => screen.getByTitle('Notes field')],
    ['select', () => screen.getByTitle('Select field')],
    ['contentEditable host', () => screen.getByTestId('editor')],
  ])('ignores Ctrl+Z typed inside a %s and leaves the default alone', (_label, getTarget) => {
    const onUndo = vi.fn();
    render(<Harness onUndo={onUndo} />);

    const notPrevented = fireEvent.keyDown(getTarget(), { key: 'z', ctrlKey: true });

    expect(onUndo).not.toHaveBeenCalled();
    // Native text undo must not be suppressed.
    expect(notPrevented).toBe(true);
  });

  it('ignores keys during IME composition', () => {
    const onUndo = vi.fn();
    const onEscape = vi.fn();
    render(<Harness onUndo={onUndo} onEscape={onEscape} />);

    fireEvent.keyDown(document.body, { key: 'z', ctrlKey: true, isComposing: true });
    fireEvent.keyDown(document.body, { key: 'Escape', isComposing: true });

    expect(onUndo).not.toHaveBeenCalled();
    expect(onEscape).not.toHaveBeenCalled();
  });

  it('blurs the field on the first Escape and navigates on the second', () => {
    const onEscape = vi.fn();
    render(<Harness onEscape={onEscape} />);

    const input = screen.getByTitle('Text field');
    input.focus();
    expect(document.activeElement).toBe(input);

    // First Escape: blur only — no navigation.
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(onEscape).not.toHaveBeenCalled();
    expect(document.activeElement).not.toBe(input);

    // Second Escape lands outside any editable element and navigates.
    fireEvent.keyDown(document.body, { key: 'Escape' });
    expect(onEscape).toHaveBeenCalledTimes(1);
  });

  it('still runs shortcuts when a non-editable element has focus', () => {
    const onEscape = vi.fn();
    render(<Harness onEscape={onEscape} />);

    const button = screen.getByRole('button', { name: 'Focusable button' });
    button.focus();
    fireEvent.keyDown(button, { key: 'Escape' });

    expect(onEscape).toHaveBeenCalledTimes(1);
  });

  it('removes the listener on unmount', () => {
    const onUndo = vi.fn();
    const { unmount } = render(<Harness onUndo={onUndo} />);
    unmount();

    fireEvent.keyDown(document.body, { key: 'z', ctrlKey: true });

    expect(onUndo).not.toHaveBeenCalled();
  });
});
