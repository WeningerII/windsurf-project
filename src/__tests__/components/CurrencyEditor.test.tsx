import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { CurrencyEditor } from '../../components/CurrencyEditor';

const sampleCurrency = { copper: 10, silver: 5, gold: 100, platinum: 0 };

describe('CurrencyEditor', () => {
  it('renders currency fields with values', () => {
    render(<CurrencyEditor currency={sampleCurrency} />);
    expect(screen.getByText('Currency')).toBeInTheDocument();
    expect(screen.getByTitle('CP')).toHaveValue(10);
    expect(screen.getByTitle('SP')).toHaveValue(5);
    expect(screen.getByTitle('GP')).toHaveValue(100);
    expect(screen.getByTitle('PP')).toHaveValue(0);
  });

  it('calls onChange when a value is edited', () => {
    const onChange = vi.fn();
    render(<CurrencyEditor currency={sampleCurrency} onChange={onChange} />);

    const goldInput = screen.getByTitle('GP');
    fireEvent.change(goldInput, { target: { value: '250' } });

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0].gold).toBe(250);
  });

  it('disables inputs when onChange is not provided', () => {
    render(<CurrencyEditor currency={sampleCurrency} />);
    expect(screen.getByTitle('GP')).toBeDisabled();
  });

  it('enables inputs when onChange is provided', () => {
    render(<CurrencyEditor currency={sampleCurrency} onChange={vi.fn()} />);
    expect(screen.getByTitle('GP')).not.toBeDisabled();
  });
});
