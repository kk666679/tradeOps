/**
 * ULID generator — time-sortable, collision-resistant event ids.
 *
 * A ULID is 26 chars of Crockford base32. This is a compact, dependency-free
 * implementation sufficient for single-process id generation (the ledger
 * backend is the ultimate source of uniqueness in a distributed deployment).
 */

const CROCKFORD = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
const ENCODING_LEN = 10; // chars of time component
const RANDOM_LEN = 16; // chars of randomness

function encodeTime(now: number, len: number): string {
  let str = '';
  let t = now;
  for (let i = len - 1; i >= 0; i--) {
    const mod = t % 32;
    str = CROCKFORD[mod] + str;
    t = (t - mod) / 32;
  }
  return str;
}

function encodeRandom(len: number): string {
  let str = '';
  for (let i = 0; i < len; i++) {
    str += CROCKFORD[Math.floor(Math.random() * 32)];
  }
  return str;
}

/** Generate a fresh ULID (26 chars). */
export function ulid(): string {
  return encodeTime(Date.now(), ENCODING_LEN) + encodeRandom(RANDOM_LEN);
}

/** Monotonic factory — guarantees strictly increasing ids within a process. */
export function createUlidFactory(): () => string {
  let last = 0;
  return () => {
    let now = Date.now();
    if (now <= last) now = last + 1;
    last = now;
    return encodeTime(now, ENCODING_LEN) + encodeRandom(RANDOM_LEN);
  };
}
