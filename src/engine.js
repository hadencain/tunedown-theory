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
