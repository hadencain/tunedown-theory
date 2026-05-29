const NOTE_NAMES = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
const ENHARMONICS = {
  'Db':'C#','Eb':'D#','Fb':'E','Gb':'F#','Ab':'G#','Bb':'A#','Cb':'B'
};

export function noteNameToMidi(name) {
  const octave = parseInt(name.slice(-1));
  const notePart = name.slice(0, -1);
  const normalized = ENHARMONICS[notePart] ?? notePart;
  const semitone = NOTE_NAMES.indexOf(normalized);
  return (octave + 1) * 12 + semitone;
}

export function noteToPitchClass(name) {
  const normalized = ENHARMONICS[name] ?? name;
  return NOTE_NAMES.indexOf(normalized);
}

export function getScaleNotes(intervals, rootNote) {
  const root = noteToPitchClass(rootNote);
  return new Set(intervals.map(i => (root + i) % 12));
}

export function getStringFrets(tuningStrings, scaleNotes) {
  return tuningStrings.map(openNote => {
    const openMidi = noteNameToMidi(openNote);
    const frets = [];
    for (let f = 0; f <= 24; f++) {
      if (scaleNotes.has((openMidi + f) % 12)) frets.push(f);
    }
    return frets;
  });
}

export function getPositions(intervals, rootNote, tuning) {
  const scaleNotes = getScaleNotes(intervals, rootNote);
  const stringFrets = getStringFrets(tuning.strings, scaleNotes);

  const allFrets = new Set();
  stringFrets.forEach(frets => frets.forEach(f => allFrets.add(f)));
  const windowStarts = [...allFrets].sort((a, b) => a - b);

  const positions = [];
  const seen = new Set();

  for (const W of windowStarts) {
    const windowFrets = stringFrets.map(frets =>
      frets.filter(f => f >= W && f <= W + 4)
    );
    if (windowFrets.every(frets => frets.length > 0)) {
      const key = windowFrets.map(f => f.join(',')).join('|');
      if (!seen.has(key)) {
        seen.add(key);
        positions.push({
          label: `position ${positions.length + 1}`,
          strings: windowFrets,
        });
      }
    }
  }
  return positions;
}

export function deriveIntervalsFromFrets(fretInput, tuning, rootNote) {
  // fretInput: index 0 = string 1 (highest). tuning.strings: index 0 = string 6 (lowest).
  const rootPc = noteToPitchClass(rootNote);
  const pitchClasses = new Set();

  fretInput.forEach((frets, uiIndex) => {
    const tuningIndex = 5 - uiIndex;
    const openMidi = noteNameToMidi(tuning.strings[tuningIndex]);
    frets.forEach(fret => pitchClasses.add((openMidi + fret) % 12));
  });

  return [...pitchClasses]
    .map(pc => (pc - rootPc + 12) % 12)
    .sort((a, b) => a - b);
}
