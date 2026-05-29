export const SCALES = [
  { name: 'Major',                   intervals: [0,2,4,5,7,9,11] },
  { name: 'Minor',                   intervals: [0,2,3,5,7,8,10] },
  { name: 'Melodic Minor',           intervals: [0,2,3,5,7,9,11] },
  { name: 'Harmonic Minor',          intervals: [0,2,3,5,7,8,11] },
  { name: 'Major Pentatonic',        intervals: [0,2,4,7,9] },
  { name: 'Minor Pentatonic',        intervals: [0,3,5,7,10] },
  { name: 'Blues',                   intervals: [0,3,5,6,7,10] },
  { name: 'Ionian',                  intervals: [0,2,4,5,7,9,11] },
  { name: 'Dorian',                  intervals: [0,2,3,5,7,9,10] },
  { name: 'Phrygian',                intervals: [0,1,3,5,7,8,10] },
  { name: 'Lydian',                  intervals: [0,2,4,6,7,9,11] },
  { name: 'Mixolydian',              intervals: [0,2,4,5,7,9,10] },
  { name: 'Aeolian',                 intervals: [0,2,3,5,7,8,10] },
  { name: 'Locrian',                 intervals: [0,1,3,5,6,8,10] },
  { name: 'Whole Tone',              intervals: [0,2,4,6,8,10] },
  { name: 'Half-Whole Diminished',   intervals: [0,1,3,4,6,7,9,10] },
  { name: 'Whole-Half Diminished',   intervals: [0,2,3,5,6,8,9,11] },
  { name: 'Spanish Major',           intervals: [0,1,4,5,7,9,10] },
  { name: 'Persian',                 intervals: [0,1,4,5,6,8,11] },
  { name: 'Gypsy Major',             intervals: [0,2,3,6,7,8,11] },
  { name: 'Gypsy Minor',             intervals: [0,2,3,6,7,8,10] },
];

export const TUNINGS = [
  { name: 'Standard (EADGBe)',  strings: ['E2','A2','D3','G3','B3','E4'] },
  { name: 'Drop D',             strings: ['D2','A2','D3','G3','B3','E4'] },
  { name: 'Drop C',             strings: ['C2','G2','C3','F3','A3','D4'] },
  { name: 'Half-step Down',     strings: ['Eb2','Ab2','Db3','Gb3','Bb3','Eb4'] },
  { name: 'Full-step Down',     strings: ['D2','G2','C3','F3','A3','D4'] },
  { name: 'Open G',             strings: ['D2','G2','D3','G3','B3','D4'] },
  { name: 'Open D',             strings: ['D2','A2','D3','F#3','A3','D4'] },
  { name: 'Open E',             strings: ['E2','B2','E3','G#3','B3','E4'] },
  { name: 'Open A',             strings: ['E2','A2','E3','A3','C#4','E4'] },
  { name: 'Open C',             strings: ['C2','G2','C3','G3','C4','E4'] },
  { name: 'DADGAD',             strings: ['D2','A2','D3','G3','A3','D4'] },
  { name: 'Nashville',          strings: ['E3','A3','D4','G4','B3','E4'] },
];

export const KEYS = [
  'C','C#','Db','D','D#','Eb','E','F','F#','Gb','G','G#','Ab','A','A#','Bb','B'
];
