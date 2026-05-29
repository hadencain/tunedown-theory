import { noteNameToMidi, noteToPitchClass, getScaleNotes, getStringFrets } from '../src/engine.js';

let passed = 0;
let failed = 0;

function assert(condition, msg) {
  if (condition) {
    console.log(`  ✓ ${msg}`);
    passed++;
  } else {
    console.error(`  ✗ ${msg}`);
    failed++;
  }
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
const scaleNotes = getScaleNotes([0,3,5,7,10], 'A'); // A minor penta
const stringFrets = getStringFrets(standardStrings, scaleNotes);
assert(stringFrets.length === 6, '6 strings returned');
assert(stringFrets[0].includes(5), 'string 6 (E2) has fret 5 (A)');
assert(stringFrets[0].includes(8), 'string 6 (E2) has fret 8 (C)');
assert(stringFrets[5].includes(5), 'string 1 (E4) has fret 5 (A)');
assert(!stringFrets[0].includes(1), 'string 6 does not have fret 1 (F — not in scale)');

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
