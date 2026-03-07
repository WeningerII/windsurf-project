/**
 * Backend API Client
 *
 * Optional server sync layer. When no backend URL is configured the client
 * operates in offline-only mode and all methods resolve with local-only
 * results. When a URL is set (via `configureApiClient`), requests are
 * forwarded to the server per the contract in `docs/future-backend-api.md`.
 */

import type { CharacterDocument, SystemDataModel } from '../types/core/document';

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

interface ApiClientConfig {
  baseUrl: string;
  /** Current JWT. Refreshed via `refreshToken()`. */
  token: string | null;
}

let config: ApiClientConfig | null = null;

export function configureApiClient(baseUrl: string, token?: string): void {
  config = { baseUrl: baseUrl.replace(/\/+$/, ''), token: token ?? null };
}

export function clearApiClient(): void {
  config = null;
}

export function isApiConfigured(): boolean {
  return config !== null && config.baseUrl.length > 0;
}

export function setAuthToken(token: string): void {
  if (!config) throw new Error('API client is not configured');
  config.token = token;
}

// ---------------------------------------------------------------------------
// HTTP helpers
// ---------------------------------------------------------------------------

interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export class ApiRequestError extends Error {
  status: number;
  code: string;
  details?: Record<string, unknown>;

  constructor(status: number, body: ApiError) {
    super(body.message);
    this.name = 'ApiRequestError';
    this.status = status;
    this.code = body.code;
    this.details = body.details;
  }
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  if (!config) throw new Error('API client is not configured. Call configureApiClient() first.');

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (config.token) headers['Authorization'] = `Bearer ${config.token}`;

  const res = await fetch(`${config.baseUrl}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    let errBody: { error: ApiError };
    try {
      errBody = await res.json();
    } catch {
      throw new ApiRequestError(res.status, { code: 'UNKNOWN', message: res.statusText });
    }
    throw new ApiRequestError(res.status, errBody.error);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

interface AuthResponse {
  token: string;
  refreshToken: string;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const data = await request<AuthResponse>('POST', '/api/auth/login', { email, password });
  setAuthToken(data.token);
  return data;
}

export async function register(email: string, password: string): Promise<AuthResponse> {
  const data = await request<AuthResponse>('POST', '/api/auth/register', { email, password });
  setAuthToken(data.token);
  return data;
}

export async function refreshToken(token: string): Promise<AuthResponse> {
  const data = await request<AuthResponse>('POST', '/api/auth/refresh', { refreshToken: token });
  setAuthToken(data.token);
  return data;
}

// ---------------------------------------------------------------------------
// Characters CRUD
// ---------------------------------------------------------------------------

type ServerDocument = CharacterDocument<SystemDataModel>;

export async function fetchCharacters(): Promise<ServerDocument[]> {
  return request<ServerDocument[]>('GET', '/api/characters');
}

export async function fetchCharacter(id: string): Promise<ServerDocument> {
  return request<ServerDocument>('GET', `/api/characters/${encodeURIComponent(id)}`);
}

export async function createCharacter(
  doc: Omit<ServerDocument, 'id' | 'createdAt' | 'updatedAt'>
): Promise<ServerDocument> {
  return request<ServerDocument>('POST', '/api/characters', doc);
}

export async function updateCharacter(id: string, doc: ServerDocument): Promise<ServerDocument> {
  return request<ServerDocument>('PUT', `/api/characters/${encodeURIComponent(id)}`, doc);
}

export async function deleteCharacter(id: string): Promise<void> {
  return request<void>('DELETE', `/api/characters/${encodeURIComponent(id)}`);
}

// ---------------------------------------------------------------------------
// Bulk operations
// ---------------------------------------------------------------------------

interface DocumentEnvelope {
  version: string;
  documents: ServerDocument[];
  lastModified: string;
}

export async function exportAllCharacters(): Promise<DocumentEnvelope> {
  return request<DocumentEnvelope>('POST', '/api/characters/export');
}

export async function importCharacters(envelope: DocumentEnvelope): Promise<{ imported: number }> {
  return request<{ imported: number }>('POST', '/api/characters/import', envelope);
}

export async function clearAllCharacters(): Promise<void> {
  return request<void>('DELETE', '/api/characters');
}

// ---------------------------------------------------------------------------
// Sync
// ---------------------------------------------------------------------------

export interface SyncConflict {
  documentId: string;
  localVersion: ServerDocument;
  serverVersion: ServerDocument;
}

export interface SyncResult {
  mergedDocuments: ServerDocument[];
  conflicts: SyncConflict[];
  syncedAt: string;
}

export async function sync(
  localDocuments: ServerDocument[],
  lastSyncedAt: string | null
): Promise<SyncResult> {
  return request<SyncResult>('POST', '/api/sync', {
    lastSyncedAt: lastSyncedAt ?? new Date(0).toISOString(),
    localDocuments,
  });
}
