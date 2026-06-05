import type { CreationIntent } from './types';

/**
 * Deterministic prompt parsing. No LLM: we lowercase and tokenize the prompt,
 * pull out an explicit level and name when present, and let creators match the
 * tokens against their catalogs. This keeps prompt-driven creation fully
 * offline-capable and testable; an LLM layer can produce a richer intent later
 * without changing the downstream derive-and-validate path.
 */

const MIN_LEVEL = 1;
const MAX_LEVEL = 20;

export function parseCreationIntent(prompt: string, levelOverride?: number): CreationIntent {
  const trimmed = prompt.trim();
  const lower = trimmed.toLowerCase();
  const tokens = lower.split(/[^a-z0-9]+/).filter(Boolean);

  const level = clampLevel(levelOverride ?? parseLevel(lower) ?? MIN_LEVEL);
  const name = parseName(trimmed);

  return { prompt: trimmed, tokens, level, name };
}

function parseLevel(lower: string): number | undefined {
  const explicit = lower.match(/\blevel\s+(\d{1,2})\b/) ?? lower.match(/\blvl?\s*(\d{1,2})\b/);
  if (explicit) {
    return Number.parseInt(explicit[1], 10);
  }
  return undefined;
}

function clampLevel(level: number): number {
  if (!Number.isFinite(level)) return MIN_LEVEL;
  return Math.min(MAX_LEVEL, Math.max(MIN_LEVEL, Math.floor(level)));
}

function parseName(prompt: string): string | undefined {
  // "named Kara", "called Kara Stormwind", or a quoted "Kara".
  const named = prompt.match(/\b(?:named|called)\s+([A-Z][\w'-]*(?:\s+[A-Z][\w'-]*){0,2})/);
  if (named) {
    return named[1].trim();
  }
  const quoted = prompt.match(/["“]([^"”]{1,40})["”]/);
  if (quoted) {
    return quoted[1].trim();
  }
  return undefined;
}

/**
 * Score `candidates` by how strongly their keywords appear in the prompt tokens
 * and return the best match, or `undefined` when nothing matches. Scoring is
 * deterministic: more matched keywords wins; ties break toward the earlier
 * candidate (stable by input order).
 */
export function pickByKeywords<T>(
  tokens: string[],
  candidates: T[],
  getKeywords: (candidate: T) => string[]
): T | undefined {
  const tokenSet = new Set(tokens);
  let best: T | undefined;
  let bestScore = 0;

  for (const candidate of candidates) {
    let score = 0;
    for (const keyword of getKeywords(candidate)) {
      const normalized = keyword.toLowerCase();
      if (!normalized) continue;
      // Multi-word keywords match when every word is present.
      const words = normalized.split(/[^a-z0-9]+/).filter(Boolean);
      if (words.length > 0 && words.every((word) => tokenSet.has(word))) {
        score += words.length; // longer, more-specific matches outweigh single words
      }
    }
    if (score > bestScore) {
      best = candidate;
      bestScore = score;
    }
  }

  return best;
}

/** Like {@link pickByKeywords} but falls back to a default when nothing matches. */
export function pickByKeywordsOrDefault<T>(
  tokens: string[],
  candidates: T[],
  getKeywords: (candidate: T) => string[],
  fallback: T
): T {
  return pickByKeywords(tokens, candidates, getKeywords) ?? fallback;
}
