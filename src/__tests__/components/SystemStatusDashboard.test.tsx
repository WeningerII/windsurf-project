import { render, screen, waitFor } from '@testing-library/react';
import { beforeAll, describe, expect, it } from 'vitest';
import { registerAllSystems } from '../../systems';
import { SystemStatusDashboard } from '../../components/SystemStatusDashboard';
import { loadAllSystemCatalogSummariesFromMetadata } from '../../utils/systemCatalogMetadata';

beforeAll(async () => {
  registerAllSystems();
  await loadAllSystemCatalogSummariesFromMetadata();
}, 60000);

describe('SystemStatusDashboard', () => {
  it('loads product summaries and includes Daggerheart in readiness counts once SRD data is wired', async () => {
    render(<SystemStatusDashboard />);

    expect(screen.getByText('0/7 supported systems loaded')).toBeInTheDocument();
    expect(screen.getByText('dnd-5e-2024')).toBeInTheDocument();
    expect(screen.getByText('daggerheart')).toBeInTheDocument();

    await waitFor(
      () => {
        expect(screen.getByText('7/7 supported systems loaded')).toBeInTheDocument();
      },
      { timeout: 30000 }
    );

    expect(screen.getByText('D&D 5e (2024)')).toBeInTheDocument();
    expect(screen.getByText('Daggerheart')).toBeInTheDocument();
    expect(screen.getByText('Reachable Content Totals')).toBeInTheDocument();
    expect(screen.getAllByText('Feature Options').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Complications').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Ancestries').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Communities').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Power Modifiers').length).toBeGreaterThan(0);
    expect(screen.queryByText(/SRD 5\.1 excludes feat data/i)).not.toBeInTheDocument();
    expect(
      screen.getByText('Base classes plus the full core SRD prestige catalog are selectable')
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'SRD-backed selectors, starter templates, browse tabs, equipment loadouts, gold tracking, and loot libraries are shipped; deterministic passive card bonuses are auto-applied where represented, while triggered, timing-based, and choice-based card effects remain tracked-but-manual or reference-only'
      )
    ).toBeInTheDocument();
  });
});
