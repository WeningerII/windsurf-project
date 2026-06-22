import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { AiUsagePanel } from '../../components/scene/AiUsagePanel';
import type { AiTrace } from '../../ai/aiObservability';

/**
 * PHASE 14 (RFC 002): the AI usage meter makes session spend and the latest
 * gateway trace visible to the GM — read-only, and silent until AI is used.
 */

describe('AiUsagePanel', () => {
  it('renders nothing before any AI call', () => {
    const { container } = render(
      <AiUsagePanel usage={{ calls: 0, units: 0 }} caps={{ maxCalls: 100, maxUnits: 2_000_000 }} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('shows calls/units against the caps and the last trace', () => {
    const lastTrace: AiTrace = {
      traceId: 'abcdef0123456789',
      task: 'encounter-draft',
      promptVersion: 'ai-prompts-v2',
      estimatedUnits: 42,
      latencyMs: 130,
      ok: true,
      source: 'provider',
      provider: 'google',
      model: 'gemini-2.0-flash',
    };
    render(
      <AiUsagePanel
        usage={{ calls: 3, units: 1234 }}
        caps={{ maxCalls: 100, maxUnits: 2_000_000 }}
        lastTrace={lastTrace}
      />
    );
    expect(screen.getByText(/3 \/ 100 calls/)).toBeInTheDocument();
    expect(screen.getByText(/encounter-draft/)).toBeInTheDocument();
    expect(screen.getByText(/130ms/)).toBeInTheDocument();
    expect(screen.getByText(/#abcdef01/)).toBeInTheDocument();
  });

  it('shows ∞ for a disabled (infinite) cap and a failed last trace', () => {
    render(
      <AiUsagePanel
        usage={{ calls: 1, units: 10 }}
        caps={{ maxCalls: Infinity, maxUnits: Infinity }}
        lastTrace={{
          traceId: 'zz',
          task: 'scene-narration',
          promptVersion: 'v',
          estimatedUnits: 1,
          latencyMs: 0,
          ok: false,
          code: 'over-budget',
        }}
      />
    );
    expect(screen.getByText(/1 \/ ∞ calls/)).toBeInTheDocument();
    expect(screen.getByText(/failed \(over-budget\)/)).toBeInTheDocument();
  });
});
