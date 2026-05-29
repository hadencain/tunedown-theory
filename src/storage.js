const SCALES_KEY = 'spt_custom_scales';
const TUNINGS_KEY = 'spt_custom_tunings';

function load(key) {
  try { return JSON.parse(localStorage.getItem(key)) ?? []; }
  catch { return []; }
}

function persist(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function loadCustomScales() { return load(SCALES_KEY); }

export function saveCustomScale(scale) {
  const scales = load(SCALES_KEY).filter(s => s.name !== scale.name);
  persist(SCALES_KEY, [...scales, { ...scale, custom: true }]);
}

export function deleteCustomScale(name) {
  persist(SCALES_KEY, load(SCALES_KEY).filter(s => s.name !== name));
}

export function loadCustomTunings() { return load(TUNINGS_KEY); }

export function saveTuning(tuning) {
  const tunings = load(TUNINGS_KEY).filter(t => t.name !== tuning.name);
  persist(TUNINGS_KEY, [...tunings, { ...tuning, custom: true }]);
}

export function deleteCustomTuning(name) {
  persist(TUNINGS_KEY, load(TUNINGS_KEY).filter(t => t.name !== name));
}
