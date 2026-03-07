import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  configureApiClient,
  clearApiClient,
  isApiConfigured,
  setAuthToken,
  login,
  register,
  fetchCharacters,
  fetchCharacter,
  createCharacter,
  updateCharacter,
  deleteCharacter,
  sync,
  ApiRequestError,
} from '../utils/apiClient';

function mockFetch(status: number, body: unknown) {
  return vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    statusText: status === 200 ? 'OK' : 'Error',
    json: () => Promise.resolve(body),
  });
}

describe('apiClient', () => {
  beforeEach(() => {
    clearApiClient();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('configuration', () => {
    it('starts unconfigured', () => {
      expect(isApiConfigured()).toBe(false);
    });

    it('becomes configured after configureApiClient', () => {
      configureApiClient('https://api.example.com');
      expect(isApiConfigured()).toBe(true);
    });

    it('clears configuration', () => {
      configureApiClient('https://api.example.com');
      clearApiClient();
      expect(isApiConfigured()).toBe(false);
    });

    it('throws if setAuthToken called before configuration', () => {
      expect(() => setAuthToken('tok')).toThrow('API client is not configured');
    });
  });

  describe('auth', () => {
    it('login calls POST /api/auth/login and sets token', async () => {
      configureApiClient('https://api.example.com');
      const fetcher = mockFetch(200, { token: 'jwt-abc', refreshToken: 'ref-123' });
      vi.stubGlobal('fetch', fetcher);

      const res = await login('user@test.com', 'pass');
      expect(res.token).toBe('jwt-abc');
      expect(fetcher).toHaveBeenCalledOnce();
      const [url, opts] = fetcher.mock.calls[0];
      expect(url).toBe('https://api.example.com/api/auth/login');
      expect(opts.method).toBe('POST');
      expect(JSON.parse(opts.body)).toEqual({ email: 'user@test.com', password: 'pass' });
    });

    it('register calls POST /api/auth/register', async () => {
      configureApiClient('https://api.example.com');
      const fetcher = mockFetch(200, { token: 'jwt-new', refreshToken: 'ref-new' });
      vi.stubGlobal('fetch', fetcher);

      const res = await register('new@test.com', 'pass');
      expect(res.token).toBe('jwt-new');
      const [url] = fetcher.mock.calls[0];
      expect(url).toBe('https://api.example.com/api/auth/register');
    });
  });

  describe('characters', () => {
    beforeEach(() => {
      configureApiClient('https://api.example.com', 'tok-123');
    });

    it('fetchCharacters sends GET with auth header', async () => {
      const fetcher = mockFetch(200, []);
      vi.stubGlobal('fetch', fetcher);

      const docs = await fetchCharacters();
      expect(docs).toEqual([]);
      const [url, opts] = fetcher.mock.calls[0];
      expect(url).toBe('https://api.example.com/api/characters');
      expect(opts.headers['Authorization']).toBe('Bearer tok-123');
    });

    it('fetchCharacter encodes id', async () => {
      const fetcher = mockFetch(200, { id: 'abc', name: 'Test' });
      vi.stubGlobal('fetch', fetcher);

      await fetchCharacter('abc');
      expect(fetcher.mock.calls[0][0]).toBe('https://api.example.com/api/characters/abc');
    });

    it('createCharacter sends POST', async () => {
      const fetcher = mockFetch(201, { id: 'new-1', name: 'Gandalf' });
      vi.stubGlobal('fetch', fetcher);

      const res = await createCharacter({
        name: 'Gandalf',
        systemId: 'dnd-5e-2014',
        system: {},
      } as never);
      expect(res.name).toBe('Gandalf');
      expect(fetcher.mock.calls[0][1].method).toBe('POST');
    });

    it('updateCharacter sends PUT', async () => {
      const doc = { id: 'u-1', name: 'Updated' } as never;
      const fetcher = mockFetch(200, doc);
      vi.stubGlobal('fetch', fetcher);

      await updateCharacter('u-1', doc);
      expect(fetcher.mock.calls[0][0]).toContain('/api/characters/u-1');
      expect(fetcher.mock.calls[0][1].method).toBe('PUT');
    });

    it('deleteCharacter sends DELETE', async () => {
      const fetcher = mockFetch(204, undefined);
      vi.stubGlobal('fetch', fetcher);

      await deleteCharacter('del-1');
      expect(fetcher.mock.calls[0][1].method).toBe('DELETE');
    });
  });

  describe('error handling', () => {
    beforeEach(() => {
      configureApiClient('https://api.example.com', 'tok');
    });

    it('throws ApiRequestError on non-ok response', async () => {
      const fetcher = mockFetch(401, { error: { code: 'UNAUTHORIZED', message: 'Bad token' } });
      vi.stubGlobal('fetch', fetcher);

      await expect(fetchCharacters()).rejects.toThrow(ApiRequestError);
      try {
        await fetchCharacters();
      } catch (e) {
        expect(e).toBeInstanceOf(ApiRequestError);
        expect((e as ApiRequestError).status).toBe(401);
        expect((e as ApiRequestError).code).toBe('UNAUTHORIZED');
      }
    });

    it('throws if API is not configured', async () => {
      clearApiClient();
      await expect(fetchCharacters()).rejects.toThrow('API client is not configured');
    });
  });

  describe('sync', () => {
    it('sends local documents and lastSyncedAt', async () => {
      configureApiClient('https://api.example.com', 'tok');
      const fetcher = mockFetch(200, {
        mergedDocuments: [],
        conflicts: [],
        syncedAt: '2026-02-24T00:00:00Z',
      });
      vi.stubGlobal('fetch', fetcher);

      const result = await sync([], '2026-02-23T00:00:00Z');
      expect(result.mergedDocuments).toEqual([]);
      expect(result.conflicts).toEqual([]);

      const body = JSON.parse(fetcher.mock.calls[0][1].body);
      expect(body.lastSyncedAt).toBe('2026-02-23T00:00:00Z');
      expect(body.localDocuments).toEqual([]);
    });

    it('uses epoch as default lastSyncedAt when null', async () => {
      configureApiClient('https://api.example.com', 'tok');
      const fetcher = mockFetch(200, {
        mergedDocuments: [],
        conflicts: [],
        syncedAt: '2026-02-24T00:00:00Z',
      });
      vi.stubGlobal('fetch', fetcher);

      await sync([], null);
      const body = JSON.parse(fetcher.mock.calls[0][1].body);
      expect(body.lastSyncedAt).toBe('1970-01-01T00:00:00.000Z');
    });
  });
});
