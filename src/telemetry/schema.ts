/**
 * The privacy guard: the single choke point every telemetry payload passes
 * through, so PII cannot be recorded BY CONSTRUCTION rather than by reviewer
 * vigilance.
 *
 * Two independent defenses run on every field:
 *   1. Key defense  — any key whose tokens look like an identifier or personal
 *      datum (`id`, `email`, `name`, `userId`, `sessionId`, `lat`, ...) is
 *      dropped outright. This catches NUMERIC PII (a numeric user id, a phone
 *      number, a coordinate) that the value defense would otherwise wave
 *      through as "just a number".
 *   2. Value defense — a value is kept only if it is a finite `number`, a
 *      `boolean`, or a `string` present in the allowlisted enum set. Free-form
 *      strings (the classic PII vector — names, notes, URLs with tokens) and
 *      all objects/arrays/null/undefined are dropped.
 *
 * The guard STRIPS offending fields rather than rejecting the whole event, so a
 * buggy caller degrades to "less signal" instead of "leaked PII". The result is
 * a {@link SanitizedProps} whose type proves it holds only non-PII primitives.
 */
import {
  ALLOWED_ENUM_VALUES,
  type SanitizedProps,
  type TelemetryEnumValue,
  type TelemetryValue,
} from './events';

/**
 * Tokens that mark a key as carrying an identifier or personal datum. Matched
 * against whole camelCase / snake_case / kebab-case SEGMENTS of a key (never as
 * raw substrings), so `id` strips `userId` and `candidate_id` but not `valid`,
 * `grid`, or `width`.
 */
const PII_KEY_TOKENS: ReadonlySet<string> = new Set<string>([
  // identifiers
  'id',
  'ids',
  'uuid',
  'guid',
  'sid',
  // names / handles
  'name',
  'firstname',
  'lastname',
  'fullname',
  'surname',
  'username',
  'nickname',
  'handle',
  // people / ownership
  'user',
  'account',
  'owner',
  'author',
  'player',
  'character',
  // contact
  'email',
  'mail',
  'phone',
  'tel',
  'mobile',
  'fax',
  // postal / location
  'address',
  'street',
  'city',
  'zip',
  'zipcode',
  'postal',
  'postcode',
  'lat',
  'lng',
  'latitude',
  'longitude',
  'geo',
  'coords',
  'coordinates',
  'location',
  // personal attributes
  'ssn',
  'dob',
  'birth',
  'birthday',
  'birthdate',
  'age',
  'gender',
  'sex',
  // secrets / auth
  'password',
  'passwd',
  'pwd',
  'secret',
  'token',
  'credential',
  'credentials',
  'apikey',
  'auth',
  'cookie',
  'session',
  // network / media
  'ip',
  'ipaddress',
  'avatar',
  'photo',
  'picture',
]);

/** Cap on retained fields per event — bounds payload size regardless of caller. */
export const MAX_PROP_KEYS = 32;

/**
 * Split a key into lowercased word tokens across camelCase, snake_case,
 * kebab-case, and acronym boundaries. `userID` -> ['user','id'];
 * `ip_address` -> ['ip','address']; `HTTPStatus` -> ['http','status'].
 */
function tokenizeKey(key: string): string[] {
  return key
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2') // camelCase boundary
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2') // ACRONYM|Word boundary
    .split(/[^a-zA-Z0-9]+/) // snake_case / kebab / other separators
    .map((t) => t.toLowerCase())
    .filter(Boolean);
}

/** Whether a key looks like it names an identifier or personal datum. */
export function isPiiKey(key: string): boolean {
  return tokenizeKey(key).some((token) => PII_KEY_TOKENS.has(token));
}

/**
 * Coerce an untrusted value to a recordable {@link TelemetryValue}, or
 * `undefined` if it is not allowed. Rejects `NaN`/`Infinity`, free-form
 * strings, and every non-primitive.
 */
export function sanitizeValue(value: unknown): TelemetryValue | undefined {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return Number.isFinite(value) ? value : undefined;
  if (typeof value === 'string') {
    return ALLOWED_ENUM_VALUES.has(value) ? (value as TelemetryEnumValue) : undefined;
  }
  // objects, arrays, null, undefined, bigint, symbol, function -> not recordable
  return undefined;
}

/**
 * Apply both defenses to a raw payload and return a payload that is non-PII by
 * type. See the module docstring for the privacy-by-construction rationale.
 * Never throws and never mutates its input.
 */
export function sanitizeProps(raw?: unknown): SanitizedProps {
  const out: Record<string, TelemetryValue> = {};
  if (!raw || typeof raw !== 'object') return out;
  const obj = raw as Record<string, unknown>;
  for (const key of Object.keys(obj)) {
    if (Object.keys(out).length >= MAX_PROP_KEYS) break;
    if (isPiiKey(key)) continue; // key defense: drop identifier-like keys
    const value = sanitizeValue(obj[key]);
    if (value === undefined) continue; // value defense: drop free-form / non-primitive
    out[key] = value;
  }
  return out;
}
