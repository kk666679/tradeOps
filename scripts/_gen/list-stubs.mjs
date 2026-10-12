// List remaining stub pages (files still containing the stub marker) to a file.
import { readFileSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

let out = '';
try {
  out = execSync("grep -rl 'Wire this page to the' app", { cwd: process.cwd(), encoding: 'utf8' });
} catch {
  out = ''; // grep exit 1 = no matches
}
const lines = out.split('\n').filter(Boolean).sort();
writeFileSync('/tmp/cline-remaining.txt', lines.join('\n') + '\n');
console.log('count=' + lines.length);
