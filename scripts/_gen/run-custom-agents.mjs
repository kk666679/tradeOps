import { writePages } from './engine.mjs';
import { CA_1 } from './data-ca-1.mjs';
import { CA_2 } from './data-ca-2.mjs';
import { CA_3 } from './data-ca-3.mjs';
import { CA_4 } from './data-ca-4.mjs';
import { CA_5 } from './data-ca-5.mjs';

const entries = [...CA_1, ...CA_2, ...CA_3, ...CA_4, ...CA_5];
const res = writePages('custom-agents', entries);
console.log('custom-agents', JSON.stringify(res));
if (res.missing.length) console.log('MISSING:\n' + res.missing.join('\n'));
