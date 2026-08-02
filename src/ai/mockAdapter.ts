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

/** First id from a named character-draft pool on the payload, if non-empty. */
function firstPoolId(payload: unknown, pool: string): string | undefined {
  if (payload && typeof payload === 'object' && 'pools' in payload) {
    const pools = (payload as { pools?: Record<string, unknown> }).pools;
    const entries = pools?.[pool];
    if (Array.isArray(entries) && entries.length > 0) {
      const first = entries[0] as { id?: unknown };
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
        case 'narration-critique':
          // Quotes the narration's opening span VERBATIM, so the wiring test
          // exercises the flow's quote check on the passing side. A mock that
          // quoted something absent would only ever prove the discard path.
          return Promise.resolve({
            findings: [
              {
                quote: openingSpanOf(payload),
                concern: 'Deterministic mock concern.',
              },
            ],
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
        case 'analyze-map': {
          // Derived from the payload's measured image size so the mock proposal
          // always lands INSIDE the image and passes the validator — a mock that
          // reliably fails its own gate teaches nothing about the wiring.
          const size = imageSizeOf(payload);
          const cellSizePx = Math.max(8, Math.round(size.widthPx / 10));
          return Promise.resolve({
            registration: { offsetX: 0, offsetY: 0, cellSizePx },
            boxes: [
              {
                kind: 'spawn',
                rect: { x: 0, y: 0, width: cellSizePx * 2, height: cellSizePx * 2 },
                label: 'Mock spawn',
              },
            ],
            reason: 'Deterministic mock map analysis.',
          });
        }
        case 'character-draft': {
          const classId = firstPoolId(payload, 'classes');
          const ancestryId = firstPoolId(payload, 'ancestries');
          const backgroundId = firstPoolId(payload, 'backgrounds');
          return Promise.resolve({
            name: 'Mock Hero',
            ...(classId ? { classId } : {}),
            ...(ancestryId ? { ancestryId } : {}),
            ...(backgroundId ? { backgroundId } : {}),
            rationale: 'Deterministic mock character draft.',
          });
        }
        case 'dm-turn-intent': {
          // Take the FIRST offered option, exactly as the encounter mock takes
          // the first candidate: the point is to exercise the option-id gate
          // with an id that is genuinely in the pool. A move gets a destination
          // one cell from the actor, so the reach gate passes and the scene
          // runtime — not this mock — decides whether the cell is legal.
          const option = firstDmTurnOption(payload);
          if (!option) return Promise.resolve({ proposals: [] });
          const destination =
            option.verb === 'move' ? oneCellFrom(dmTurnActorPosition(payload)) : undefined;
          return Promise.resolve({
            proposals: [
              {
                optionId: option.id,
                ...(destination ? { destination } : {}),
                reason: 'Deterministic mock turn proposal.',
              },
            ],
            rationale: 'Deterministic mock AI-DM turn.',
          });
        }
        default:
          // Unknown task: throw like a real adapter would; the core normalizes it.
          return Promise.reject(new Error(`Mock adapter has no output for task '${task}'.`));
      }
    },
  };
}

/**
 * The first sentence (or the whole of a short narration) from a
 * narration-critique payload — a span guaranteed to be verbatim present.
 */
function openingSpanOf(payload: unknown): string {
  const narrative =
    payload && typeof payload === 'object' && 'narrative' in payload
      ? (payload as { narrative?: unknown }).narrative
      : undefined;
  if (typeof narrative !== 'string' || !narrative.trim()) return 'the narration';
  return narrative.match(/[^.!?]+[.!?]*/)?.[0].trim() || narrative.trim();
}

/** The client-measured image size on an analyze-map payload, with a safe default. */
function imageSizeOf(payload: unknown): { widthPx: number; heightPx: number } {
  const size =
    payload && typeof payload === 'object'
      ? (payload as { imageSize?: { widthPx?: unknown; heightPx?: unknown } }).imageSize
      : undefined;
  const widthPx = typeof size?.widthPx === 'number' ? size.widthPx : 1000;
  const heightPx = typeof size?.heightPx === 'number' ? size.heightPx : 1000;
  return { widthPx, heightPx };
}

/** The first offered dm-turn option, if the payload carries a non-empty pool. */
function firstDmTurnOption(payload: unknown): { id: string; verb: string } | undefined {
  if (payload && typeof payload === 'object' && 'options' in payload) {
    const options = (payload as { options?: unknown }).options;
    if (Array.isArray(options) && options.length > 0) {
      const first = options[0] as { id?: unknown; verb?: unknown };
      if (first && typeof first.id === 'string' && typeof first.verb === 'string') {
        return { id: first.id, verb: first.verb };
      }
    }
  }
  return undefined;
}

/** The acting token's cell on a dm-turn payload, with a safe origin default. */
function dmTurnActorPosition(payload: unknown): { x: number; y: number } {
  const actor =
    payload && typeof payload === 'object'
      ? (payload as { actor?: { position?: { x?: unknown; y?: unknown } } }).actor
      : undefined;
  const x = typeof actor?.position?.x === 'number' ? actor.position.x : 0;
  const y = typeof actor?.position?.y === 'number' ? actor.position.y : 0;
  return { x, y };
}

/** One cell away, staying at non-negative coordinates on any sane grid. */
function oneCellFrom(position: { x: number; y: number }): { x: number; y: number } {
  return { x: position.x > 0 ? position.x - 1 : position.x + 1, y: position.y };
}
