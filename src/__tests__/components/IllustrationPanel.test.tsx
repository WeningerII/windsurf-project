import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { IllustrationPanel } from '../../components/scene/IllustrationPanel';

const image = { dataUrl: 'data:image/png;base64,AAAA', mediaType: 'image/png' };

describe('IllustrationPanel', () => {
  it('generates an image from a prompt and offers it for download', async () => {
    const user = userEvent.setup();
    const illustrate = vi.fn(async () => ({ ok: true as const, image }));
    render(<IllustrationPanel illustrate={illustrate} />);

    // Generate is disabled until there is a prompt.
    expect(screen.getByRole('button', { name: /generate/i })).toBeDisabled();

    await user.type(
      screen.getByRole('textbox', { name: /illustration prompt/i }),
      'a torchlit crypt'
    );
    await user.click(screen.getByRole('button', { name: /generate/i }));

    expect(illustrate).toHaveBeenCalledWith({ prompt: 'a torchlit crypt', style: 'painterly' });

    const img = await screen.findByRole('img', { name: /AI illustration: a torchlit crypt/i });
    expect(img).toHaveAttribute('src', image.dataUrl);
    expect(screen.getByRole('link', { name: /download/i })).toHaveAttribute('href', image.dataUrl);
  });

  it('shows an error and no image when generation fails', async () => {
    const user = userEvent.setup();
    const illustrate = vi.fn(async () => ({ ok: false as const, error: 'AI is off.' }));
    render(<IllustrationPanel illustrate={illustrate} />);

    await user.type(screen.getByRole('textbox', { name: /illustration prompt/i }), 'a dragon');
    await user.click(screen.getByRole('button', { name: /generate/i }));

    expect(await screen.findByText(/AI is off\./)).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });
});
