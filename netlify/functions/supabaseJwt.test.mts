/**
 * Netlify-layer tests for the Supabase-JWT gateway auth (REMEDIATION_PLAN
 * Phase 5 M2). Tokens are minted locally with node:crypto — no network, no
 * real secret — and the HTTP outcomes are asserted through the same pure
 * `processGatewayHttp` the entry point delegates to, so the 401/200 mapping
 * tested here is exactly what a deploy serves.
 *
 * Imported APIs are referenced explicitly (not via test globals) so the file
 * also typechecks under `tsconfig.netlify.json` (node-only ambient types).
 */
import { createHmac } from 'node:crypto';
import { describe, it, expect } from 'vitest';
import { AI_GATEWAY_SCHEMA_VERSION } from '../../src/ai/contracts';
import { processGatewayHttp } from '../../src/ai/gatewayHttp';
import {
  createSupabaseJwtVerifier,
  resolveGatewayAuth,
  verifySupabaseJwt,
} from './supabaseJwt.mts';

const SECRET = 'test-jwt-signing-value';
const NOW_MS = 1_700_000_000_000;
const clock = () => NOW_MS;

function b64url(input: Buffer | string): string {
  return Buffer.from(input).toString('base64url');
}

/** Mint an HS256 compact JWT the way Supabase does (header.payload.signature). */
function mintToken(
  claims: Record<string, unknown>,
  { secret = SECRET, alg = 'HS256' }: { secret?: string; alg?: string } = {}
): string {
  const header = b64url(JSON.stringify({ alg, typ: 'JWT' }));
  const payload = b64url(JSON.stringify(claims));
  const signature = createHmac('sha256', secret).update(`${header}.${payload}`).digest('base64url');
  return `${header}.${payload}.${signature}`;
}

const FUTURE_EXP = Math.floor(NOW_MS / 1000) + 3600;
const validToken = () => mintToken({ sub: 'user-1', exp: FUTURE_EXP });
const bearer = (token: string) => `Bearer ${token}`;

describe('verifySupabaseJwt', () => {
  it('accepts a well-formed HS256 token with a future exp, surfacing the subject', () => {
    // The verified `sub` claim rides the verdict so the gateway can key the
    // per-session cost budget on a stable user id instead of a client ip.
    expect(verifySupabaseJwt(validToken(), SECRET, NOW_MS)).toEqual({
      ok: true,
      subject: 'user-1',
    });
  });

  it('accepts a token without a sub claim, omitting the subject', () => {
    expect(verifySupabaseJwt(mintToken({ exp: FUTURE_EXP }), SECRET, NOW_MS)).toEqual({ ok: true });
  });

  it('rejects a token signed with a different secret (forged signature)', () => {
    const forged = mintToken({ sub: 'user-1', exp: FUTURE_EXP }, { secret: 'other-value' });
    expect(verifySupabaseJwt(forged, SECRET, NOW_MS)).toMatchObject({ ok: false });
  });

  it('rejects a token whose payload was tampered with after signing', () => {
    const [h, , s] = validToken().split('.');
    const tampered = `${h}.${b64url(JSON.stringify({ sub: 'attacker', exp: FUTURE_EXP }))}.${s}`;
    expect(verifySupabaseJwt(tampered, SECRET, NOW_MS)).toMatchObject({ ok: false });
  });

  it('rejects an expired token with a session-expired message', () => {
    const expired = mintToken({ sub: 'user-1', exp: Math.floor(NOW_MS / 1000) - 60 });
    expect(verifySupabaseJwt(expired, SECRET, NOW_MS)).toMatchObject({
      ok: false,
      message: expect.stringMatching(/expired/i),
    });
  });

  it('rejects a token without an exp claim', () => {
    expect(verifySupabaseJwt(mintToken({ sub: 'user-1' }), SECRET, NOW_MS)).toMatchObject({
      ok: false,
    });
  });

  it('rejects a not-yet-valid token (nbf in the future)', () => {
    const early = mintToken({ exp: FUTURE_EXP, nbf: Math.floor(NOW_MS / 1000) + 60 });
    expect(verifySupabaseJwt(early, SECRET, NOW_MS)).toMatchObject({ ok: false });
  });

  it("pins the algorithm: alg 'none' (or anything non-HS256) is rejected", () => {
    const headerNone = b64url(JSON.stringify({ alg: 'none', typ: 'JWT' }));
    const payload = b64url(JSON.stringify({ exp: FUTURE_EXP }));
    expect(verifySupabaseJwt(`${headerNone}.${payload}.`, SECRET, NOW_MS)).toMatchObject({
      ok: false,
    });
    const rs256 = mintToken({ exp: FUTURE_EXP }, { alg: 'RS256' });
    expect(verifySupabaseJwt(rs256, SECRET, NOW_MS)).toMatchObject({ ok: false });
  });

  it('rejects garbage shapes without throwing', () => {
    for (const junk of ['', 'a.b', 'a.b.c.d', '!!.!!.!!', 'onlyonepart']) {
      expect(verifySupabaseJwt(junk, SECRET, NOW_MS)).toMatchObject({ ok: false });
    }
  });
});

describe('createSupabaseJwtVerifier — header handling', () => {
  const verify = createSupabaseJwtVerifier(SECRET, clock);

  it('rejects a missing or non-Bearer Authorization header', () => {
    expect(verify(null)).toMatchObject({ ok: false, message: expect.stringMatching(/sign in/i) });
    expect(verify('Basic abc')).toMatchObject({ ok: false });
  });

  it('accepts a valid Bearer token (scheme is case-insensitive)', () => {
    expect(verify(bearer(validToken()))).toEqual({ ok: true, subject: 'user-1' });
    expect(verify(`bearer ${validToken()}`)).toEqual({ ok: true, subject: 'user-1' });
  });
});

describe('resolveGatewayAuth — env gating (the unconfigured-Supabase policy)', () => {
  it('is undefined (auth not enforced) when SUPABASE_JWT_SECRET is unset or blank', () => {
    expect(resolveGatewayAuth({})).toBeUndefined();
    expect(resolveGatewayAuth({ SUPABASE_JWT_SECRET: '   ' })).toBeUndefined();
  });

  it('returns a working verifier when the secret is set', () => {
    const verify = resolveGatewayAuth({ SUPABASE_JWT_SECRET: SECRET }, clock);
    expect(verify?.(bearer(validToken()))).toEqual({ ok: true, subject: 'user-1' });
  });
});

describe('gateway HTTP outcomes with auth wired (as ai-gateway.mts wires it)', () => {
  const body = JSON.stringify({
    schemaVersion: AI_GATEWAY_SCHEMA_VERSION,
    task: 'encounter-draft',
    payload: {
      systemId: 'dnd-5e-2024',
      partyLevels: [3],
      difficulty: 'moderate',
      prompt: 'goblins',
      candidates: [{ id: 'goblin', name: 'Goblin' }],
    },
  });
  const fixtures = {
    'encounter-draft': { selections: [{ monsterId: 'goblin', count: 3 }] },
  } as const;
  const verify = createSupabaseJwtVerifier(SECRET, clock);
  const withHeader = (header: string | null) => () => verify(header);

  it('missing token => 401 unauthorized', async () => {
    const res = await processGatewayHttp('POST', body, { fixtures }, withHeader(null));
    expect(res.status).toBe(401);
    expect(res.body).toMatchObject({ ok: false, code: 'unauthorized' });
  });

  it('expired token => 401 unauthorized', async () => {
    const expired = mintToken({ exp: Math.floor(NOW_MS / 1000) - 1 });
    const res = await processGatewayHttp('POST', body, { fixtures }, withHeader(bearer(expired)));
    expect(res.status).toBe(401);
    expect(res.body).toMatchObject({ ok: false, code: 'unauthorized' });
  });

  it('forged signature => 401 unauthorized', async () => {
    const forged = mintToken({ exp: FUTURE_EXP }, { secret: 'other-value' });
    const res = await processGatewayHttp('POST', body, { fixtures }, withHeader(bearer(forged)));
    expect(res.status).toBe(401);
    expect(res.body).toMatchObject({ ok: false, code: 'unauthorized' });
  });

  it('valid token => 200 with the fixture-backed result', async () => {
    const res = await processGatewayHttp(
      'POST',
      body,
      { fixtures },
      withHeader(bearer(validToken()))
    );
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ ok: true, usage: { source: 'fixture' } });
  });

  it('key-less local-first degradation is unchanged: no authorizer, no adapter => 503', async () => {
    // ai-gateway.mts only wires the authorizer when an adapter resolved, so a
    // key-less deploy — with or without SUPABASE_JWT_SECRET — never 401s.
    const res = await processGatewayHttp('POST', body, {});
    expect(res.status).toBe(503);
    expect(res.body).toMatchObject({ ok: false, code: 'provider-not-configured' });
  });
});
