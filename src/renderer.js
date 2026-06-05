export function positionToTabLines(position, tuning) {
  const allFrets = position.strings.flat();
  const minFret = Math.min(...allFrets);
  const maxFret = Math.max(...allFrets, 0);
  const fw = maxFret >= 10 ? 2 : 1;

  const lines = [];
  // Display: string 1 (index 5) first → string 6 (index 0) last
  for (let si = 5; si >= 0; si--) {
    const openNote = tuning.strings[si];
    const letter = openNote.slice(0, -1); // strip octave digit
    const isHighestString = si === 5;
    const label = (isHighestString && letter.toUpperCase() === 'E') ? 'e' : letter;
    const fretsOnString = new Set(position.strings[si]);
    const slots = [];
    for (let f = minFret; f <= maxFret; f++) {
      slots.push(fretsOnString.has(f) ? String(f).padStart(fw, '-') : '-'.repeat(fw));
    }
    lines.push(`${label}|--${slots.join('-')}--|`);
  }
  return lines;
}
