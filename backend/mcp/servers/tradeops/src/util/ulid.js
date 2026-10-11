import { randomBytes } from "node:crypto";
const ENCODING = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
const TIME_LEN = 10;
const RAND_LEN = 16;
function encodeTime(now, len) {
    let str = "";
    for (let i = len - 1; i >= 0; i--) {
        str = ENCODING[now % 32] + str;
        now = Math.floor(now / 32);
    }
    return str;
}
function encodeRandom(len) {
    const bytes = randomBytes(len);
    let str = "";
    for (let i = 0; i < len; i++) {
        str += ENCODING[(bytes[i] ?? 0) % 32];
    }
    return str;
}
export function ulid(seedTime = Date.now()) {
    return encodeTime(seedTime, TIME_LEN) + encodeRandom(RAND_LEN);
}
export function isUlid(s) {
    if (s.length !== TIME_LEN + RAND_LEN)
        return false;
    for (const ch of s)
        if (!ENCODING.includes(ch))
            return false;
    return true;
}
//# sourceMappingURL=ulid.js.map