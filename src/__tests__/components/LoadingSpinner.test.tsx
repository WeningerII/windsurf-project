import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LoadingSpinner } from '../../components/LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders default spinner size', () => {
    const { container } = render(<LoadingSpinner />);
    const icon = container.querySelector('svg');

    expect(icon).toHaveClass('w-8', 'h-8', 'animate-spin');
  });

  it('renders custom sizes', () => {
    const { container, rerender } = render(<LoadingSpinner size="sm" />);
    let icon = container.querySelector('svg');
    expect(icon).toHaveClass('w-4', 'h-4');

    rerender(<LoadingSpinner size="lg" />);
    icon = container.querySelector('svg');
    expect(icon).toHaveClass('w-12', 'h-12');
  });

  it('renders loading text when provided', () => {
    render(<LoadingSpinner text="Loading records" />);
    expect(screen.getByText('Loading records')).toBeInTheDocument();
  });

  it('renders full-screen wrapper when requested', () => {
    const { container } = render(<LoadingSpinner fullScreen text="Please wait" />);
    const wrapper = container.firstElementChild;

    expect(wrapper).toHaveClass('min-h-screen', 'bg-background');
    expect(screen.getByText('Please wait')).toBeInTheDocument();
  });
});
