// Exact rational arithmetic for inheritance shares. Farāʾiḍ shares are fractions (½, ⅔, ⅙, ʿawl to
// /7, …); doing them in floating point would drift. We compute every share as an exact Fraction and
// only convert to money at the very end. Pure TS, zero RN imports.

export type Fraction = { n: number; d: number };

function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    [a, b] = [b, a % b];
  }
  return a || 1;
}

/** Construct a normalized fraction (denominator always positive, reduced by gcd). */
export function frac(n: number, d = 1): Fraction {
  if (d === 0) throw new Error('Fraction denominator cannot be 0');
  if (d < 0) {
    n = -n;
    d = -d;
  }
  const g = gcd(n, d);
  return { n: n / g, d: d / g };
}

export const ZERO: Fraction = frac(0);
export const ONE: Fraction = frac(1);

export function addF(a: Fraction, b: Fraction): Fraction {
  return frac(a.n * b.d + b.n * a.d, a.d * b.d);
}

export function subF(a: Fraction, b: Fraction): Fraction {
  return frac(a.n * b.d - b.n * a.d, a.d * b.d);
}

export function mulF(a: Fraction, b: Fraction): Fraction {
  return frac(a.n * b.n, a.d * b.d);
}

export function divF(a: Fraction, b: Fraction): Fraction {
  if (b.n === 0) throw new Error('Fraction division by zero');
  return frac(a.n * b.d, a.d * b.n);
}

/** Sign of (a − b): negative if a<b, 0 if equal, positive if a>b. */
export function cmpF(a: Fraction, b: Fraction): number {
  return a.n * b.d - b.n * a.d;
}

export function isZero(a: Fraction): boolean {
  return a.n === 0;
}

export function sumF(fractions: readonly Fraction[]): Fraction {
  return fractions.reduce((acc, f) => addF(acc, f), ZERO);
}
