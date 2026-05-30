const SCHEMA_VERSION = 'ai-gateway-v1';
const SUPPORTED_TASKS = new Set(['character-concept-draft', 'character-draft-repair']);

const JSON_HEADERS = {
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store',
};

export async function handler(event) {
  const traceId = readTraceId(event);

  if (event.httpMethod === 'OPTIONS') {
    return jsonResponse(204, '');
  }

  if (event.httpMethod !== 'POST') {
    return failure(405, 'unsupported-task', 'AI gateway only accepts POST requests.', false, {
      traceId,
    });
  }

  const request = parseRequest(event.body);
  if (!request.ok) {
    return failure(400, 'invalid-request', request.message, false, { traceId });
  }

  const task = request.value.task;
  if (typeof task !== 'string' || !SUPPORTED_TASKS.has(task)) {
    return failure(400, 'unsupported-task', 'AI gateway task is not supported.', false, {
      traceId,
    });
  }

  if (request.value.schemaVersion !== SCHEMA_VERSION) {
    return failure(400, 'invalid-request', 'AI gateway schema version is not supported.', false, {
      task,
      traceId,
    });
  }

  if (process.env.AI_GATEWAY_FIXTURE_MODE === 'true') {
    return jsonResponse(200, buildFixtureResponse(task, request.value, traceId));
  }

  return failure(
    503,
    'provider-not-configured',
    'AI gateway provider is not configured. Deterministic app flows remain available.',
    false,
    { task, traceId }
  );
}

function parseRequest(body) {
  if (!body) {
    return { ok: false, message: 'AI gateway request body is required.' };
  }

  try {
    const value = JSON.parse(body);
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return { ok: false, message: 'AI gateway request body must be a JSON object.' };
    }

    return { ok: true, value };
  } catch {
    return { ok: false, message: 'AI gateway request body must be valid JSON.' };
  }
}

function readTraceId(event) {
  const headerTraceId =
    event.headers?.['x-ai-trace-id'] ??
    event.headers?.['X-Ai-Trace-Id'] ??
    event.headers?.['X-AI-Trace-ID'];

  if (typeof headerTraceId === 'string' && headerTraceId.trim().length > 0) {
    return headerTraceId.trim();
  }

  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `ai-trace-${Date.now()}`;
}

function buildFixtureResponse(task, request, traceId) {
  if (task === 'character-draft-repair') {
    const originalDraft = request.payload?.originalDraft ?? buildFixtureDraft(request);
    return {
      ok: true,
      schemaVersion: SCHEMA_VERSION,
      task,
      traceId,
      data: {
        draft: originalDraft,
        repairedIssueCodes: [],
        remainingIssues: request.payload?.validationIssues ?? [],
        notes: ['Fixture mode returned the original draft without provider repair.'],
      },
      usage: { source: 'fixture' },
    };
  }

  return {
    ok: true,
    schemaVersion: SCHEMA_VERSION,
    task,
    traceId,
    data: buildFixtureDraft(request),
    warnings: [
      {
        code: 'fixture-mode',
        message: 'Fixture mode returns a reviewable placeholder, not provider output.',
      },
    ],
    usage: { source: 'fixture' },
  };
}

function buildFixtureDraft(request) {
  const systemId =
    request.payload?.systemId ?? request.payload?.candidatePool?.systemId ?? 'dnd-5e-2024';

  return {
    systemId,
    conceptSummary: 'Fixture draft generated without a provider.',
    choices: [],
    notes: ['Configure a provider adapter to generate real draft choices.'],
    manualBoundaries: ['Review and apply all choices through deterministic app workflows.'],
  };
}

function failure(statusCode, code, message, retryable, options = {}) {
  return jsonResponse(statusCode, {
    ok: false,
    schemaVersion: SCHEMA_VERSION,
    task: options.task,
    traceId: options.traceId ?? `ai-trace-${Date.now()}`,
    error: {
      code,
      message,
      retryable,
    },
  });
}

function jsonResponse(statusCode, body) {
  return {
    statusCode,
    headers: JSON_HEADERS,
    body: typeof body === 'string' ? body : JSON.stringify(body),
  };
}
