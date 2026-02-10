import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { ErrorCategory, ErrorSeverity, errorLogger } from '../../utils/errorLogger';

function CrashOnRender() {
  throw new Error('render exploded');
}

describe('ErrorBoundary', () => {
  const originalNodeEnv = process.env.NODE_ENV;

  beforeEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
    vi.restoreAllMocks();
  });

  it('renders default fallback UI and logs caught errors', () => {
    const logSpy = vi.spyOn(errorLogger, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <CrashOnRender />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText(/render exploded/i)).toBeInTheDocument();
    expect(logSpy).toHaveBeenCalledWith(
      ErrorCategory.RENDER,
      ErrorSeverity.CRITICAL,
      'ErrorBoundary caught render error',
      expect.any(Error),
      expect.objectContaining({ errorBoundary: true, componentStack: expect.any(String) })
    );
  });

  it('renders provided custom fallback when present', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary fallback={<div>Custom fallback</div>}>
        <CrashOnRender />
      </ErrorBoundary>
    );

    expect(screen.getByText('Custom fallback')).toBeInTheDocument();
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
  });

  it('shows stack trace details in development mode', () => {
    process.env.NODE_ENV = 'development';
    vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <CrashOnRender />
      </ErrorBoundary>
    );

    expect(screen.getByText('Stack Trace')).toBeInTheDocument();
  });

  it('resets boundary state when Try Again is clicked', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const AlwaysCrash = () => {
      throw new Error('still broken');
    };

    render(
      <ErrorBoundary>
        <AlwaysCrash />
      </ErrorBoundary>
    );

    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /try again/i }));
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('calls window.location.reload when reload button is clicked', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const reloadSpy = vi.spyOn(window.location, 'reload').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <CrashOnRender />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByRole('button', { name: /reload page/i }));
    expect(reloadSpy).toHaveBeenCalledTimes(1);
  });
});
