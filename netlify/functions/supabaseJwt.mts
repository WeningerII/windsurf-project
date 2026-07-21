/**
 * Supabase-JWT verification for the AI gateway (REMEDIATION_PLAN Phase 5 M2:
 * "require a Supabase JWT + rate-limit on the gateway before any real provider
 * is wired"). Supabase signs its access tokens with the project's JWT secret
 * using HS256, so verification is plain `node:crypto` HMAC — no new runtime
 * dependency and no network round-trip per request.
 *
 * Policy (wired in `ai-gateway.mts`): the check engages ONLY when a real
 * provider adapter resolved (a key is configured) AND `SUPABASE_JWT_SECRET` is
 * set. Pure local-first deploys — no Supabase env — keep today's behavior
 * byte-for-byte: the gateway stays open and the key-less path still degrades
 * to `provider-not-configured`. Never `console.log` a token or the secret.
 */
import { createHmac, timingSafeEqual } from 'node:crypto';
import type { GatewayAuthVerdict } from '../../src/ai/gatewayHttp';

/** Verifies a raw `Authorization` header value (or null) into a verdict. */
export type SupabaseJwtVerifier = (authorizationHeader: string | null) => GatewayAuthVerdict;

function fail(message: string): GatewayAuthVerdict {
  return { ok: false, message };
}

/** Base64url-decode into a Buffer, or undefined on malformed input. */
function decodeBase64Url(segment: string): Buffer | undefined {
  if (!/^[A-Za-z0-9_-]+$/.test(segment)) return undefined;
  try {
    return Buffer.from(segment, 'base64url');
  } catch {
    return undefined;
  }
}

function decodeJsonSegment(segment: string): Record<string, unknown> | undefined {
  const bytes = decodeBase64Url(segment);
  if (!bytes) return undefined;
  try {
    const parsed: unknown = JSON.parse(bytes.toString('utf8'));
    return typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)
      ? (parsed as Record<string, unknown>)
      : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Verify a compact JWS (three dot-joined base64url segments) against the
 * Supabase HS256 secret: algorithm pin, constant-time signature check, then
 * `exp`/`nbf`. Returns a verdict, never throws — every malformed shape is an
 * ordinary auth failure.
 */
export function verifySupabaseJwt(
  token: string,
  secret: string,
  nowMs: number
): GatewayAuthVerdict {
  const parts = token.split('.');
  if (parts.length !== 3) return fail('Invalid access token.');
  const [headerB64, payloadB64, signatureB64] = parts;

  // Pin the algorithm to HS256 — anything else (including 'none') is rejected
  // before any signature math.
  const header = decodeJsonSegment(headerB64);
  if (!header || header.alg !== 'HS256') return fail('Invalid access token.');

  const signature = decodeBase64Url(signatureB64);
  if (!signature) return fail('Invalid access token.');
  const expected = createHmac('sha256', secret).update(`${headerB64}.${payloadB64}`).digest();
  if (signature.length !== expected.length || !timingSafeEqual(signature, expected)) {
    return fail('Invalid access token.');
  }

  const payload = decodeJsonSegment(payloadB64);
  if (!payload) return fail('Invalid access token.');
  // `exp` (epoch seconds) is mandatory — Supabase always sets it, and a token
  // without an expiry must never be honored.
  const exp = payload.exp;
  if (typeof exp !== 'number' || !Number.isFinite(exp)) return fail('Invalid access token.');
  if (exp * 1000 <= nowMs) return fail('Your session has expired. Sign in again to use AI.');
  const nbf = payload.nbf;
  if (typeof nbf === 'number' && Number.isFinite(nbf) && nbf * 1000 > nowMs) {
    return fail('Invalid access token.');
  }

  return { ok: true };
}

/**
 * Build a header-level verifier: requires `Authorization: Bearer <jwt>` and
 * delegates to {@link verifySupabaseJwt}. The clock is injectable for tests.
 */
export function createSupabaseJwtVerifier(
  secret: string,
  now: () => number = Date.now
): SupabaseJwtVerifier {
  return (authorizationHeader) => {
    if (!authorizationHeader) return fail('Sign in to use AI features.');
    const match = /^Bearer\s+(.+)$/i.exec(authorizationHeader.trim());
    if (!match) return fail('Sign in to use AI features.');
    return verifySupabaseJwt(match[1], secret, now());
  };
}

/**
 * Env resolver: a verifier when `SUPABASE_JWT_SECRET` is set (non-blank),
 * otherwise `undefined` — meaning auth is not configured and the gateway keeps
 * today's open, local-first behavior. Whether the check actually engages is
 * additionally gated on a provider being configured (see `ai-gateway.mts`).
 */
export function resolveGatewayAuth(
  env: { SUPABASE_JWT_SECRET?: string },
  now: () => number = Date.now
): SupabaseJwtVerifier | undefined {
  const secret = env.SUPABASE_JWT_SECRET?.trim();
  if (!secret) return undefined;
  return createSupabaseJwtVerifier(secret, now);
}
