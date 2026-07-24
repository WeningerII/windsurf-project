/**
 * Recorded-transcript replay for composed AI flows (RFC 002: "CI must be able to
 * run without live provider calls by replaying fixtures").
 *
 * The gateway core already replays ONE recorded output per task
 * (`GatewayContext.fixtures`). A composed flow makes SEVERAL calls of the same
 * task — four character drafts, then an encounter draft — so a single fixture
 * per task cannot describe it. This turns an ORDERED transcript of recorded
 * outputs into a `TaskGatewayCall`, handing the core exactly one recorded output
 * per call.
 *
 * It deliberately runs the REAL {@link handleAiRequest} rather than faking a
 * response: every replayed call still goes through request-envelope validation,
 * `parseTaskData` re-validation of the recorded output, and the structured-log
 * emit. What CI exercises is therefore the shipped path, not a stub of it.
 *
 * No adapter and no key are ever supplied, so this IS the key-less posture: when
 * the transcript runs out, the core answers its normal `provider-not-configured`
 * failure and callers degrade to the manual tools exactly as in production.
 */
import { AI_GATEWAY_SCHEMA_VERSION, type AiResponse, type AiTask } from './contracts';
import { handleAiRequest, type GatewayContext } from './gatewayCore';
import type { AnyTaskGatewayCall } from './flowBudget';

/** One recorded gateway turn: the task that was called and what came back. */
export interface RecordedGatewayTurn {
  task: AiTask;
  /**
   * The recorded structured output, exactly as a provider returned it. It is
   * still untrusted: the core re-validates it with `parseTaskData`, so a
   * transcript that drifts out of contract fails loudly instead of passing.
   */
  output: unknown;
}

export interface RecordedGateway {
  call: AnyTaskGatewayCall;
  /** How many recorded turns have been consumed so far. */
  consumed(): number;
  /** Recorded turns not yet replayed (a healthy run usually ends at 0). */
  remaining(): number;
}

/**
 * Fixed replay clock. Replay must be byte-deterministic including the log
 * record's latency field, so the injected clock never advances.
 */
const REPLAY_EPOCH_MS = Date.UTC(2026, 0, 1);

/**
 * Build a gateway call that replays `transcript` in order, per task.
 *
 * Turns are consumed FIFO *within* a task, so a flow that interleaves tasks
 * (party drafts, then an encounter draft) replays correctly regardless of the
 * order the transcript lists them in. Trace ids and the clock are pinned so two
 * replays of the same transcript produce byte-identical responses.
 */
export function createRecordedGateway(
  transcript: readonly RecordedGatewayTurn[],
  options: { context?: Omit<GatewayContext, 'fixtures' | 'adapter'> } = {}
): RecordedGateway {
  const queues = new Map<AiTask, unknown[]>();
  for (const turn of transcript) {
    const queue = queues.get(turn.task) ?? [];
    queue.push(turn.output);
    queues.set(turn.task, queue);
  }
  let consumed = 0;

  const call: AnyTaskGatewayCall = async <TData>(
    task: AiTask,
    payload: unknown
  ): Promise<AiResponse<TData>> => {
    const queue = queues.get(task);
    const hasRecording = Array.isArray(queue) && queue.length > 0;
    // `undefined` is a legal recorded output only in the sense that the core
    // treats it as "no fixture"; shift() before the check keeps consumption
    // honest.
    const output = hasRecording ? queue.shift() : undefined;
    if (hasRecording) consumed += 1;
    const index = consumed;

    const response = await handleAiRequest(
      { schemaVersion: AI_GATEWAY_SCHEMA_VERSION, task, payload },
      {
        ...options.context,
        // No adapter, no key: an exhausted transcript degrades exactly as a
        // key-less production deploy does.
        ...(hasRecording ? { fixtures: { [task]: output } } : {}),
        traceIdFactory: options.context?.traceIdFactory ?? (() => `replay-${task}-${index}`),
        now: options.context?.now ?? (() => REPLAY_EPOCH_MS),
      }
    );
    return response as AiResponse<TData>;
  };

  return {
    call,
    consumed: () => consumed,
    remaining: () => Array.from(queues.values()).reduce((total, queue) => total + queue.length, 0),
  };
}
