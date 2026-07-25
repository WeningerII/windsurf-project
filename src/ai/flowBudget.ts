/**
 * Whole-FLOW cost + attempt cap for multi-call AI orchestrations (RFC 002 cost
 * controls, client side).
 *
 * The gateway's `SessionBudget` (`gatewayCore.ts`) caps spend per SESSION on the
 * server. That is the right cap for a single surface, but a composed flow makes
 * many calls across several tasks, and "each call was individually allowed" is
 * not a bound on the flow. This module adds the missing bound: one meter,
 * shared by every gateway call an orchestration makes, that stops the WHOLE
 * flow once its aggregate cost or attempt count is used up.
 *
 * It reuses the gateway's own deterministic per-task unit costs
 * ({@link AI_TASK_UNIT_COST}) so a flow's budget is denominated in exactly the
 * same units the server charges — no second cost model. Charge-then-check
 * mirrors the gateway: the crossing call's units stay counted, so a tripped cap
 * stays tripped for the rest of the flow.
 *
 * Exhaustion is NOT an exception. A denied call answers the same typed
 * `budget-exceeded` failure the server returns when its session cap trips, so
 * every existing flow (which already handles a gateway failure by degrading to
 * the manual tools) needs no new error path.
 */
import {
  AI_TASK_UNIT_COST,
  aiFailure,
  type AiResponse,
  type AiTask,
  type TaskGatewayCall,
} from './contracts';

/** A gateway call that is not narrowed to one task (a flow spans several). */
export type AnyTaskGatewayCall = <TData>(
  task: AiTask,
  payload: unknown
) => Promise<AiResponse<TData>>;

export interface FlowBudgetLimits {
  /**
   * Aggregate cost cap for the whole flow, in the gateway's abstract budget
   * units ({@link AI_TASK_UNIT_COST}: text 1, vision 2, image 5).
   */
  maxUnits: number;
  /**
   * Aggregate attempt cap for the whole flow — every gateway call counts,
   * including the bounded repair attempts the draft flows make. This is the cap
   * that bounds a runaway repair loop across composed steps.
   */
  maxCalls: number;
}

export interface FlowBudgetReport extends FlowBudgetLimits {
  /** Units charged (including the call that crossed the cap). */
  unitsSpent: number;
  /** Calls attempted through the meter. */
  callsAttempted: number;
  /** Calls that actually reached the gateway. */
  callsDelivered: number;
  /** Calls refused because a cap was already used up. */
  callsDenied: number;
  /** True once either cap has been crossed. */
  exceeded: boolean;
}

export interface FlowBudget {
  /**
   * Wrap a gateway call so every call made through the wrapper is metered
   * against this ONE budget. Call it once per step and hand the wrapper to the
   * step's flow — the flows already accept an injectable `call`.
   */
  meter(call: AnyTaskGatewayCall): AnyTaskGatewayCall;
  /** Narrowed view of {@link meter} for a single-task flow's `call` option. */
  meterTask<TTask extends AiTask>(call: AnyTaskGatewayCall): TaskGatewayCall<TTask>;
  report(): FlowBudgetReport;
}

/**
 * Default caps for the make-me-a-game flow: a party of up to four characters
 * (each allowed its bounded two repairs = 3 calls) plus one encounter draft
 * (bounded one repair = 2 calls) is 14 text calls / 14 units at the absolute
 * worst case. The defaults sit at that worst case so a healthy flow never trips
 * them and a pathological one cannot exceed them.
 */
export const DEFAULT_MAKE_GAME_FLOW_BUDGET: FlowBudgetLimits = {
  maxUnits: 14,
  maxCalls: 14,
};

export function createFlowBudget(limits: FlowBudgetLimits): FlowBudget {
  const maxUnits = Math.max(0, Math.trunc(limits.maxUnits));
  const maxCalls = Math.max(0, Math.trunc(limits.maxCalls));
  let unitsSpent = 0;
  let callsAttempted = 0;
  let callsDelivered = 0;
  let callsDenied = 0;

  const exceeded = () => unitsSpent > maxUnits || callsAttempted > maxCalls;

  const meter: FlowBudget['meter'] = (call) => {
    return async <TData>(task: AiTask, payload: unknown): Promise<AiResponse<TData>> => {
      callsAttempted += 1;
      unitsSpent += AI_TASK_UNIT_COST[task];
      if (exceeded()) {
        callsDenied += 1;
        return aiFailure(
          'budget-exceeded',
          'This session used up its AI budget for building a game. Use the manual tools to finish it.',
          task
        );
      }
      callsDelivered += 1;
      return call<TData>(task, payload);
    };
  };

  return {
    meter,
    meterTask: <TTask extends AiTask>(call: AnyTaskGatewayCall) =>
      meter(call) as TaskGatewayCall<TTask>,
    report: () => ({
      maxUnits,
      maxCalls,
      unitsSpent,
      callsAttempted,
      callsDelivered,
      callsDenied,
      exceeded: exceeded(),
    }),
  };
}
