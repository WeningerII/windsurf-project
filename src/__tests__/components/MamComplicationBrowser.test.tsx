import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { MamComplicationBrowser } from '../../systems/mam3e/components/MamComplicationBrowser';
import {
  accident,
  identity,
  justiceMotivation,
} from '../../data/mutants-and-masterminds/3e/complications';

describe('MamComplicationBrowser', () => {
  it('filters complications by search and category', async () => {
    const user = userEvent.setup();

    render(<MamComplicationBrowser complications={[accident, identity, justiceMotivation]} />);

    await user.selectOptions(
      screen.getByLabelText(/filter complications by category/i),
      'identity'
    );

    expect(screen.getByText('Identity')).toBeInTheDocument();
    expect(screen.queryByText('Accident')).not.toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText(/filter complications by category/i), 'all');
    await user.type(screen.getByLabelText(/search complications/i), 'justice');

    expect(screen.getByText('Motivation: Justice')).toBeInTheDocument();
    expect(screen.queryByText('Identity')).not.toBeInTheDocument();
  });

  it('disables already inserted complications and calls insert for new ones', async () => {
    const user = userEvent.setup();
    const onInsertComplication = vi.fn();

    render(
      <MamComplicationBrowser
        complications={[accident, identity]}
        insertedComplicationIds={[accident.id]}
        onInsertComplication={onInsertComplication}
      />
    );

    expect(screen.getByRole('button', { name: 'Inserted' })).toBeDisabled();

    await user.click(screen.getByRole('button', { name: 'Insert' }));

    expect(onInsertComplication).toHaveBeenCalledWith(identity);
  });
});
