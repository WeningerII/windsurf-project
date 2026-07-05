import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

import { LegalNotices } from '../components/LegalNotices';
import { legalAttributions } from '../legal/attributions';

describe('LegalNotices', () => {
  it('surfaces every system attribution, the disclaimers, and the verbatim license bodies', () => {
    render(<LegalNotices onBack={vi.fn()} />);

    expect(
      screen.getByRole('heading', { name: /Legal & Open-Content Notices/i })
    ).toBeInTheDocument();

    // All seven systems are attributed.
    for (const system of legalAttributions.systems) {
      expect(screen.getAllByText(system.systemLabel).length).toBeGreaterThan(0);
    }

    // LEGAL-2 resolved: M&M is attributed as Open Game Content with its sole
    // Product Identity carve-out ("Hero Points"/"Power Points") disclosed to the
    // user, and no shipped system is flagged with provenance under review.
    expect(screen.getAllByText(/Hero Points.+Power Points/i).length).toBeGreaterThan(0);
    expect(screen.queryByText(/Provenance under review/i)).not.toBeInTheDocument();

    // An OGL §15 chain-of-title line is rendered.
    expect(
      screen.getAllByText(/Pathfinder Roleplaying Game Core Rulebook/i).length
    ).toBeGreaterThan(0);

    // The verbatim OGL 1.0a body is embedded in the DOM (not merely on disk).
    expect(screen.getAllByText(/OPEN GAME LICENSE\s+Version 1\.0a/i).length).toBeGreaterThan(0);

    // CC-BY attributions for BOTH D&D SRDs.
    expect(screen.getAllByText(/System Reference Document 5\.1/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/System Reference Document 5\.2/i).length).toBeGreaterThan(0);

    // DPCGL notice + required disclaimers.
    expect(screen.getAllByText(/Darrington Press Community Gaming/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/not affiliated with/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/AI-generated content/i).length).toBeGreaterThan(0);
  });

  it('invokes onBack when the Back control is pressed', () => {
    const onBack = vi.fn();
    render(<LegalNotices onBack={onBack} />);

    fireEvent.click(screen.getByRole('button', { name: /^Back$/i }));

    expect(onBack).toHaveBeenCalledTimes(1);
  });
});
