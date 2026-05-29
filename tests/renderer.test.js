import { positionToTabLines } from '../src/renderer.js';

let passed = 0; let failed = 0;
function assert(condition, msg) {
  if (condition) { console.log(`  ✓ ${msg}`); passed++; }
  else { console.error(`  ✗ ${msg}`); failed++; }
}

const STD = { name: 'Standard', strings: ['E2','A2','D3','G3','B3','E4'] };

const pos1 = {
  label: 'position 1',
  strings: [
    [5, 8], // string 6 (E2) — index 0
    [5, 7], // string 5 (A2)
    [5, 7], // string 4 (D3)
    [5, 7], // string 3 (G3)
    [5, 8], // string 2 (B3)
    [5, 8], // string 1 (E4) — index 5
  ],
};

console.log('\n--- positionToTabLines ---');
const lines = positionToTabLines(pos1, STD);
assert(lines.length === 6, '6 lines returned');
assert(lines[0].startsWith('e|'), 'first line is high e string');
assert(lines[5].startsWith('E|'), 'last line is low E string');
assert(lines[0].includes('5'), 'high e line contains fret 5');
assert(lines[0].includes('8'), 'high e line contains fret 8');
assert(!lines[0].includes(' '), 'no spaces in tab line');

// double-digit frets
const pos2 = {
  label: 'position 3',
  strings: [
    [10, 12], [10, 12], [9, 12], [9, 12], [10, 13], [10, 12],
  ],
};
const lines2 = positionToTabLines(pos2, STD);
assert(lines2[0].includes('10'), 'double-digit fret 10 present');
assert(lines2[0].includes('12'), 'double-digit fret 12 present');
assert(lines2.every(l => l.length === lines2[0].length), 'all lines same length for aligned display');

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
