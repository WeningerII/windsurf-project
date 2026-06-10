import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { DamageHealControl } from '../../components/DamageHealControl';

describe('DamageHealControl', () => {
  it('applies damage and clears input', async () => {
    const user = userEvent.setup();
    const onApply = vi.fn();
    render(<DamageHealControl onApply={onApply} />);

    await user.type(screen.getByPlaceholderText('±'), '7');
    await user.click(screen.getByTitle('Apply damage'));

    expect(onApply).toHaveBeenCalledWith(7, 'damage');
    expect(screen.getByPlaceholderText('±')).toHaveValue(null);
  });

  it('applies healing', async () => {
    const user = userEvent.setup();
    const onApply = vi.fn();
    render(<DamageHealControl onApply={onApply} />);

    await user.type(screen.getByPlaceholderText('±'), '5');
    await user.click(screen.getByTitle('Apply healing'));

    expect(onApply).toHaveBeenCalledWith(5, 'heal');
  });

  it('ignores zero or empty values', async () => {
    const user = userEvent.setup();
    const onApply = vi.fn();
    render(<DamageHealControl onApply={onApply} />);

    await user.type(screen.getByPlaceholderText('±'), '0');
    await user.click(screen.getByTitle('Apply damage'));
    expect(onApply).not.toHaveBeenCalled();
  });

  it('uses Enter for damage', async () => {
    const user = userEvent.setup();
    const onApply = vi.fn();
    render(<DamageHealControl onApply={onApply} />);

    const input = screen.getByPlaceholderText('±');
    await user.type(input, '9{Enter}');

    expect(onApply).toHaveBeenCalledWith(9, 'damage');
  });

  it('uses Shift+Enter for healing', async () => {
    const user = userEvent.setup();
    const onApply = vi.fn();
    render(<DamageHealControl onApply={onApply} />);

    const input = screen.getByPlaceholderText('±');
    await user.type(input, '4');
    await user.keyboard('{Shift>}{Enter}{/Shift}');

    expect(onApply).toHaveBeenCalledWith(4, 'heal');
  });

  it('labels the amount input for assistive technology', async () => {
    const user = userEvent.setup();
    const onApply = vi.fn();
    render(<DamageHealControl onApply={onApply} />);

    const input = screen.getByRole('spinbutton', { name: 'Damage or heal amount' });
    await user.type(input, '3');
    await user.click(screen.getByTitle('Apply damage'));

    expect(onApply).toHaveBeenCalledWith(3, 'damage');
  });
});
