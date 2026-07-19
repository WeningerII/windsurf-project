/**
 * Declarative derivation layer — the system-agnostic, scalable counterpart to
 * hand-wiring each derived quantity through the engine, sheet, tests, and the
 * compute register one at a time.
 *
 * A derived quantity is declared ONCE as data plus a pure `compute`. Generic
 * consumers then:
 *   - compute it in the engine's `prepareData` (see `applyDerivedQuantities`),
 *   - surface it on the sheet (a generic section renders `display`),
 *   - verify it (`cases` drive a generic parametrized test AND the compute
 *     register's mutation gate).
 *
 * So adding a quantity is one declaration, not six edits spread across the data
 * model, engine, sheet, a bespoke test, a register entry, and a mutation anchor.
 *
 * This is the EXECUTABLE form of a `docs/compute-register` entry: the register
 * metadata (`layer`, `quantity`, `formula`, `source`) lives beside the compute,
 * so the register can be generated from these specs rather than hand-maintained
 * in parallel with the engine.
 *
 * Per-system divergence stays first-class (RFC 003's lesson): the SHARED thing
 * is the mechanism, not the formula. Each system declares its own specs with its
 * own cited compute — level scaling, BAB, PL caps, and thresholds each remain
 * their system's, expressed through one shape.
 */

/** The ten computation layers of Denominator B (mirrors the compute register). */
export type ComputeLayer = 'L1' | 'L2' | 'L3' | 'L4' | 'L5' | 'L6' | 'L7' | 'L8' | 'L9' | 'L10';

/**
 * A named input→output vector for a quantity. Drives the generic derivation
 * test (assert `compute(build(system)) === expected`) and, because that test is
 * the register `testRef`, the mutation gate that perturbs the shared formula.
 */
export interface DerivedQuantityCase<TSystem> {
  /** Stable, human-readable case name (also the generic test's `it` title). */
  name: string;
  /** Partial system state layered over the system's default data model. */
  system: Partial<TSystem>;
  /** Expected value of `compute` for that state. */
  expected: number;
}

/** How a generic sheet section presents a quantity. UI-agnostic (no component
 * imports): `icon` is a name the sheet layer resolves, keeping this in the
 * shared rules layer. */
export interface DerivedDisplay<TSystem> {
  label: string;
  /** Icon name resolved by the sheet layer (e.g. a lucide-react export). */
  icon?: string;
  /** Render the numeric value (default: `String`), e.g. `(v) => `${v} lb``. */
  format?: (value: number) => string;
  /** Short helper/tooltip text. */
  hint?: string;
  /** When present, the quantity is only shown if this returns true (e.g. hide
   * a caster-only quantity for a martial). Absent = always shown. */
  visible?: (system: TSystem) => boolean;
}

/**
 * A single declared derived quantity. `TSystem` is the (prepared) system data
 * model the compute reads from — the same shape the engine has finished
 * preparing when the generic runner is invoked.
 */
export interface DerivedQuantitySpec<TSystem> {
  /** Stable id, matching a compute-register entry, e.g. 'dnd5e.L4.passive-perception'. */
  id: string;
  layer: ComputeLayer;
  /** Human-readable quantity, e.g. 'Passive Perception'. */
  quantity: string;
  /** RAW human-readable formula, e.g. '10 + Wis(Perception) modifier'. */
  formula: string;
  /** SRD/OGC citation — cited, never invented. */
  source: string;
  /** Pure computation from the prepared system data. */
  compute: (system: TSystem) => number;
  /** Verification vectors (edge cases included). Required and non-empty. */
  cases: DerivedQuantityCase<TSystem>[];
  /** Optional sheet presentation. Omit for a computed-but-not-surfaced value. */
  display?: DerivedDisplay<TSystem>;
}
