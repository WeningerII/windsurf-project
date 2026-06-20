import { useState } from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { Campaign } from '../../types/core/campaign';
import { QuestList } from '../../components/campaign/QuestList';
import { SessionLog } from '../../components/campaign/SessionLog';

function baseCampaign(overrides: Partial<Campaign> = {}): Campaign {
  return {
    id: 'c1',
    name: 'Solo Run',
    characterIds: [],
    notes: '',
    quests: [],
    sessionLog: [],
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
    ...overrides,
  };
}

/** Stateful host so multi-step interactions compound like the real parent. */
function QuestHost({ initial }: { initial: Campaign }) {
  const [campaign, setCampaign] = useState(initial);
  return <QuestList campaign={campaign} onUpdate={setCampaign} />;
}

function SessionHost({ initial }: { initial: Campaign }) {
  const [campaign, setCampaign] = useState(initial);
  return <SessionLog campaign={campaign} onUpdate={setCampaign} />;
}

describe('QuestList', () => {
  it('adds a quest, then an objective, and toggles it complete', async () => {
    const user = userEvent.setup();
    render(<QuestHost initial={baseCampaign()} />);

    expect(screen.getByText(/No quests yet/i)).toBeInTheDocument();

    await user.type(screen.getByLabelText('New quest title'), 'Rescue the mayor');
    await user.click(screen.getByRole('button', { name: /^Quest$/i }));

    // Quest now rendered as an editable title input.
    const titleInput = screen.getByDisplayValue('Rescue the mayor');
    expect(titleInput).toBeInTheDocument();

    await user.type(screen.getByLabelText(/Add objective to/i), 'Reach the tower');
    await user.click(screen.getByRole('button', { name: /^Add objective$/i }));

    const objective = screen.getByRole('checkbox', { name: 'Reach the tower' });
    expect(objective).not.toBeChecked();
    await user.click(objective);
    expect(screen.getByRole('checkbox', { name: 'Reach the tower' })).toBeChecked();

    // Progress badge reflects 1/1 completed.
    expect(screen.getByText('1/1')).toBeInTheDocument();
  });

  it('changes a quest status through the select', async () => {
    const user = userEvent.setup();
    render(
      <QuestHost
        initial={baseCampaign({
          quests: [
            {
              id: 'q1',
              title: 'Find the relic',
              summary: '',
              status: 'active',
              objectives: [],
              createdAt: new Date('2026-01-01'),
              updatedAt: new Date('2026-01-01'),
            },
          ],
        })}
      />
    );

    const select = screen.getByLabelText(/Status for Find the relic/i);
    await user.selectOptions(select, 'completed');
    expect((select as HTMLSelectElement).value).toBe('completed');
  });

  it('removes a quest', async () => {
    const user = userEvent.setup();
    render(
      <QuestHost
        initial={baseCampaign({
          quests: [
            {
              id: 'q1',
              title: 'Doomed arc',
              summary: '',
              status: 'active',
              objectives: [],
              createdAt: new Date('2026-01-01'),
              updatedAt: new Date('2026-01-01'),
            },
          ],
        })}
      />
    );

    expect(screen.getByDisplayValue('Doomed arc')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Delete quest Doomed arc/i }));
    expect(screen.queryByDisplayValue('Doomed arc')).not.toBeInTheDocument();
  });
});

describe('SessionLog', () => {
  it('logs a session, defaulting the title to the next session number', async () => {
    const user = userEvent.setup();
    render(<SessionHost initial={baseCampaign()} />);

    await user.type(screen.getByLabelText('Session recap'), 'The party met a wizard.');
    await user.click(screen.getByRole('button', { name: /Log Session/i }));

    expect(screen.getByText('Session 1')).toBeInTheDocument();
    expect(screen.getByText('The party met a wizard.')).toBeInTheDocument();
  });

  it('renders newest entries first and deletes by id', async () => {
    const user = userEvent.setup();
    render(
      <SessionHost
        initial={baseCampaign({
          sessionLog: [
            { id: 's1', title: 'Older', body: 'first', createdAt: new Date('2026-01-01') },
            { id: 's2', title: 'Newer', body: 'second', createdAt: new Date('2026-01-02') },
          ],
        })}
      />
    );

    const items = screen.getAllByRole('listitem');
    // Newest-first ordering.
    expect(within(items[0]).getByText('Newer')).toBeInTheDocument();
    expect(within(items[1]).getByText('Older')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Delete session entry Older/i }));
    expect(screen.queryByText('Older')).not.toBeInTheDocument();
    expect(screen.getByText('Newer')).toBeInTheDocument();
  });
});
