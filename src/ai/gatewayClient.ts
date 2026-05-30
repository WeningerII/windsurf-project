import {
  AI_GATEWAY_ENDPOINT,
  AI_GATEWAY_SCHEMA_VERSION,
  type AiGatewayErrorCode,
  type AiGatewayFailure,
  type AiGatewayRequest,
  type AiGatewayResponse,
  isAiGatewayResponse,
} from './gatewayContracts';

export interface CallAiGatewayOptions {
  endpoint?: string;
  fetchImpl?: typeof fetch;
}

export async function callAiGateway(
  request: AiGatewayRequest,
  options: CallAiGatewayOptions = {}
): Promise<AiGatewayResponse> {
  const endpoint = options.endpoint ?? AI_GATEWAY_ENDPOINT;
  const fetchImpl = options.fetchImpl ?? globalThis.fetch;

  try {
    const response = await fetchImpl(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    const payload = await readJson(response);
    if (isAiGatewayResponse(payload)) {
      return payload;
    }

    return buildClientFailure(
      request,
      response.ok ? 'invalid-request' : mapStatusToErrorCode(response.status),
      response.ok
        ? 'AI gateway returned an invalid response shape.'
        : `AI gateway request failed with HTTP ${response.status}.`,
      isRetryableHttpFailure(response.status)
    );
  } catch (error) {
    return buildClientFailure(
      request,
      'provider-error',
      error instanceof Error ? error.message : 'AI gateway request failed.',
      true
    );
  }
}

function mapStatusToErrorCode(status: number): AiGatewayErrorCode {
  if (status === 400) {
    return 'invalid-request';
  }
  if (status === 404 || status === 405) {
    return 'unsupported-task';
  }
  if (status === 503) {
    return 'provider-not-configured';
  }
  if (status === 504) {
    return 'timeout';
  }
  if (status === 429) {
    return 'budget-exceeded';
  }

  return 'provider-error';
}

function isRetryableHttpFailure(status: number): boolean {
  return status >= 500 && status !== 503;
}

async function readJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function buildClientFailure(
  request: AiGatewayRequest,
  code: AiGatewayErrorCode,
  message: string,
  retryable: boolean
): AiGatewayFailure {
  return {
    ok: false,
    schemaVersion: AI_GATEWAY_SCHEMA_VERSION,
    task: request.task,
    traceId: request.traceId ?? request.requestId ?? 'client-untraced',
    error: {
      code,
      message,
      retryable,
    },
  };
}
