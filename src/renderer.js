export function positionToTabLines(position, tuning) {
  const allFrets = position.strings.flat();
  const maxFret = Math.max(...allFrets, 0);
  const fw = maxFret >= 10 ? 2 : 1;

  const lines = [];
  // Display: string 1 (index 5) first → string 6 (index 0) last
  for (let si = 5; si >= 0; si--) {
    const openNote = tuning.strings[si];
    const letter = openNote.slice(0, -1); // strip octave digit
    const isHighestString = si === 5;
    const label = (isHighestString && letter.toUpperCase() === 'E') ? 'e' : letter;
    const fretStr = position.strings[si]
      .map(f => String(f).padStart(fw, '-'))
      .join('-');
    lines.push(`${label}|--${fretStr}--|`);
  }
  return lines;
}
