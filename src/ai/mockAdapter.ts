/**
 * Deterministic mock provider adapter (RFC 002 — CI/local testing vehicle).
 *
 * It implements the same {@link AiProviderAdapter} seam as the real Gemini
 * adapter, so selecting it (`AI_PROVIDER=mock`) exercises the LIVE adapter path
 * in `gatewayCore` — the timeout wrapper, error normalization, structured
 * logging, and crucially the `parseTaskData` RE-VALIDATION. This is distinct
 * from fixture replay, which short-circuits before the adapter entirely.
 *
 * Its output is UNTRUSTED like any provider's: it is shaped to pass the
 * deterministic validators, but the core still re-validates it — the mock does
 * not, and must not, bypass that gate. Pure and SDK-free: it imports no provider
 * SDK and reads no secrets, so it is safe under `src/ai/**` and the browser
 * bundle boundary.
 */
import type { AiTask } from './contracts';
import type { AiProviderAdapter } from './gatewayCore';

/**
 * A 1x1 transparent PNG as a base64 data URL — the smallest output that passes
 * the image-envelope validator for `illustrate-scene`.
 */
const MOCK_PNG_DATA_URL =
  'data:image/png;base64,' +
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk' +
  'YPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';

/** Best-effort first candidate id from a validated task payload, if any. */
function firstCandidateId(payload: unknown): string | undefined {
  if (payload && typeof payload === 'object' && 'candidates' in payload) {
    const candidates = (payload as { candidates?: unknown }).candidates;
    if (Array.isArray(candidates) && candidates.length > 0) {
      const first = candidates[0] as { id?: unknown };
      if (first && typeof first.id === 'string') return first.id;
    }
  }
  return undefined;
}

/** Free-text `facts` from a scene-narration payload, if present. */
function factsOf(payload: unknown): string {
  if (payload && typeof payload === 'object' && 'facts' in payload) {
    const facts = (payload as { facts?: unknown }).facts;
    if (typeof facts === 'string' && facts.trim()) return facts.trim();
  }
  return 'the scene as recorded';
}

/**
 * Build the canned, deterministic mock adapter. Output for each task is shaped
 * to satisfy `parseTaskData`; anything the core cannot validate is still
 * rejected by it, exactly as a real provider's would be.
 */
export function createMockAdapter(): AiProviderAdapter {
  return {
    id: 'mock',
    model: 'mock',
    generate(task: AiTask, payload: unknown): Promise<unknown> {
      switch (task) {
        case 'encounter-draft': {
          const monsterId = firstCandidateId(payload) ?? 'mock-monster';
          return Promise.resolve({
            selections: [{ monsterId, count: 1 }],
            rationale: 'Deterministic mock encounter draft.',
          });
        }
        case 'scene-narration':
          return Promise.resolve({
            narrative: `A deterministic mock retelling of ${factsOf(payload)}.`,
          });
        case 'identify-creature': {
          const monsterId = firstCandidateId(payload) ?? 'mock-monster';
          return Promise.resolve({
            monsterId,
            confidence: 0.5,
            reason: 'Deterministic mock identification.',
          });
        }
        case 'illustrate-scene':
          return Promise.resolve({ dataUrl: MOCK_PNG_DATA_URL, mediaType: 'image/png' });
        default:
          // Unknown task: throw like a real adapter would; the core normalizes it.
          return Promise.reject(new Error(`Mock adapter has no output for task '${task}'.`));
      }
    },
  };
}
