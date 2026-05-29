import {
  noteNameToMidi, noteToPitchClass, getScaleNotes, getStringFrets,
  getPositions, deriveIntervalsFromFrets,
} from '../src/engine.js';

let passed = 0;
let failed = 0;

function assert(condition, msg) {
  if (condition) { console.log(`  ✓ ${msg}`); passed++; }
  else { console.error(`  ✗ ${msg}`); failed++; }
}

function assertDeepEqual(a, b, msg) {
  assert(JSON.stringify(a) === JSON.stringify(b), `${msg} — got ${JSON.stringify(a)}, want ${JSON.stringify(b)}`);
}

console.log('\n--- noteNameToMidi ---');
assert(noteNameToMidi('C4') === 60, 'C4 = 60');
assert(noteNameToMidi('A4') === 69, 'A4 = 69');
assert(noteNameToMidi('E2') === 40, 'E2 = 40');
assert(noteNameToMidi('A2') === 45, 'A2 = 45');
assert(noteNameToMidi('E4') === 64, 'E4 = 64');
assert(noteNameToMidi('Eb4') === 63, 'Eb4 = 63 (enharmonic)');
assert(noteNameToMidi('F#3') === 54, 'F#3 = 54');

console.log('\n--- noteToPitchClass ---');
assert(noteToPitchClass('C') === 0,  'C = 0');
assert(noteToPitchClass('A') === 9,  'A = 9');
assert(noteToPitchClass('Bb') === 10, 'Bb = 10');
assert(noteToPitchClass('C#') === 1,  'C# = 1');
assert(noteToPitchClass('Db') === 1,  'Db = 1 (enharmonic to C#)');

console.log('\n--- getScaleNotes ---');
const aMajorPc = getScaleNotes([0,2,4,5,7,9,11], 'A');
assert(aMajorPc.has(9),  'A major has A (9)');
assert(aMajorPc.has(11), 'A major has B (11)');
assert(aMajorPc.has(1),  'A major has C# (1)');
assert(!aMajorPc.has(0), 'A major does not have C (0)');
assert(aMajorPc.size === 7, 'A major has 7 notes');
const aMinorPentaPc = getScaleNotes([0,3,5,7,10], 'A');
assertDeepEqual([...aMinorPentaPc].sort((a,b)=>a-b), [0,2,4,7,9], 'A minor penta pitch classes');

console.log('\n--- getStringFrets ---');
const standardStrings = ['E2','A2','D3','G3','B3','E4'];
const scaleNotes = getScaleNotes([0,3,5,7,10], 'A');
const stringFrets = getStringFrets(standardStrings, scaleNotes);
assert(stringFrets.length === 6, '6 strings returned');
assert(stringFrets[0].includes(5), 'string 6 (E2) has fret 5 (A)');
assert(stringFrets[0].includes(8), 'string 6 (E2) has fret 8 (C)');
assert(stringFrets[5].includes(5), 'string 1 (E4) has fret 5 (A)');
assert(!stringFrets[0].includes(1), 'string 6 does not have fret 1 (F — not in scale)');

const STD = { name: 'Standard', strings: ['E2','A2','D3','G3','B3','E4'] };

console.log('\n--- getPositions ---');
const aMinorPentaPositions = getPositions([0,3,5,7,10], 'A', STD);
assert(aMinorPentaPositions.length >= 5, 'A minor penta has >= 5 positions');
assert(Array.isArray(aMinorPentaPositions[0].strings), 'position has strings array');
assert(aMinorPentaPositions[0].strings.length === 6, 'each position has 6 strings');
assert(aMinorPentaPositions[0].strings.every(s => Array.isArray(s) && s.length >= 1),
  'every string in a position has at least one fret');
assert(aMinorPentaPositions[0].label === 'position 1', 'first position labeled correctly');

// verify 4-fret span constraint
aMinorPentaPositions.forEach((pos, i) => {
  pos.strings.forEach(frets => {
    const span = Math.max(...frets) - Math.min(...frets);
    assert(span <= 4, `position ${i+1} string span <= 4 frets (span=${span})`);
  });
});

// changing key shifts positions
const eMinorPentaPositions = getPositions([0,3,5,7,10], 'E', STD);
assert(
  JSON.stringify(aMinorPentaPositions) !== JSON.stringify(eMinorPentaPositions),
  'A and E minor penta produce different positions'
);

// changing tuning changes positions
const dropD = { name: 'Drop D', strings: ['D2','A2','D3','G3','B3','E4'] };
const aMinorPentaDropD = getPositions([0,3,5,7,10], 'A', dropD);
assert(
  JSON.stringify(aMinorPentaPositions[0].strings[0]) !==
  JSON.stringify(aMinorPentaDropD[0].strings[0]),
  'string 6 frets differ between standard and drop D tuning'
);

console.log('\n--- deriveIntervalsFromFrets ---');
// Enter A minor penta position 1 frets manually (UI order: string 1 first)
const fretInput = [
  [5, 8],  // string 1 (e, E4)
  [5, 8],  // string 2 (B, B3)
  [5, 7],  // string 3 (G, G3)
  [5, 7],  // string 4 (D, D3)
  [5, 7],  // string 5 (A, A2)
  [5, 8],  // string 6 (E, E2)
];
const derived = deriveIntervalsFromFrets(fretInput, STD, 'A');
assertDeepEqual(derived, [0,3,5,7,10], 'derives minor pentatonic intervals from fret input');

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
