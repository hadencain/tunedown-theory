import { SCALES, TUNINGS, KEYS } from './data.js';
import { getPositions, deriveIntervalsFromFrets } from './engine.js';
import { positionToTabLines } from './renderer.js';
import {
  loadCustomScales, loadCustomTunings,
  saveCustomScale as persistScale,
  saveTuning as persistTuning,
  deleteCustomScale, deleteCustomTuning,
} from './storage.js';

const state = {
  key: 'A',
  scale: null,
  tuning: null,
  scales: [],
  tunings: [],
};

function init() {
  state.scales = [...SCALES, ...loadCustomScales()];
  state.tunings = [...TUNINGS, ...loadCustomTunings()];
  state.scale = state.scales.find(s => s.name === 'Minor Pentatonic') ?? state.scales[0];
  state.tuning = state.tunings[0];

  populateKeySelect();
  populateScaleSelect();
  populateTuningSelect();
  renderStringInputs();
  renderTabPanel();

  document.getElementById('key-select').addEventListener('change', e => {
    state.key = e.target.value;
    renderTabPanel();
  });

  document.getElementById('scale-select').addEventListener('change', e => {
    state.scale = state.scales.find(s => s.name === e.target.value);
    renderTabPanel();
  });

  document.getElementById('tuning-select').addEventListener('change', e => {
    state.tuning = state.tunings.find(t => t.name === e.target.value);
    renderStringInputs();
    renderTabPanel();
  });

  document.getElementById('open-scale-editor').addEventListener('click', openScaleEditor);
  document.getElementById('cancel-scale-btn').addEventListener('click', closeScaleEditor);
  document.getElementById('save-scale-btn').addEventListener('click', saveCustomScaleHandler);
}

function populateKeySelect() {
  const sel = document.getElementById('key-select');
  sel.innerHTML = KEYS.map(k =>
    `<option value="${k}" ${k === state.key ? 'selected' : ''}>${k}</option>`
  ).join('');
}

function populateScaleSelect() {
  const sel = document.getElementById('scale-select');
  sel.innerHTML = state.scales.map(s =>
    `<option value="${s.name}" ${s.name === state.scale?.name ? 'selected' : ''}>${s.name}</option>`
  ).join('');
}

function populateTuningSelect() {
  const sel = document.getElementById('tuning-select');
  sel.innerHTML = state.tunings.map(t =>
    `<option value="${t.name}" ${t.name === state.tuning?.name ? 'selected' : ''}>${t.name}</option>`
  ).join('');
}

function renderStringInputs() {
  const container = document.getElementById('string-inputs');
  // tuning.strings: index 0 = string 6 (lowest). Display string 1 (index 5) first.
  container.innerHTML = '';
  for (let ui = 1; ui <= 6; ui++) {
    const tuningIdx = 6 - ui; // ui=1 → tuningIdx=5 (string 1, highest)
    const row = document.createElement('div');
    row.className = 'string-row';
    const note = state.tuning.strings[tuningIdx];
    row.innerHTML = `
      <span class="string-num">${ui}</span>
      <input type="text" value="${note}" data-tuning-idx="${tuningIdx}">
    `;
    container.appendChild(row);
  }
  container.querySelectorAll('input').forEach(input => {
    input.addEventListener('change', e => {
      const idx = parseInt(e.target.dataset.tuningIdx);
      state.tuning = { ...state.tuning, strings: [...state.tuning.strings] };
      state.tuning.strings[idx] = e.target.value.trim();
      renderTabPanel();
    });
  });
}

function renderTabPanel() {
  const positions = getPositions(state.scale.intervals, state.key, state.tuning);

  document.getElementById('tab-header').textContent =
    `${state.key} ${state.scale.name} — ${state.tuning.name} — ${positions.length} positions`;

  const grid = document.getElementById('positions-grid');
  grid.innerHTML = '';

  positions.forEach(pos => {
    const block = document.createElement('div');
    block.className = 'position-block';
    const lines = positionToTabLines(pos, state.tuning);
    block.innerHTML = `
      <div class="position-label">${pos.label}</div>
      <div class="tab-lines">${lines.map(l => `<div>${l}</div>`).join('')}</div>
    `;
    grid.appendChild(block);
  });
}

function openScaleEditor() {
  document.getElementById('scale-name-input').value = '';

  const container = document.getElementById('scale-fret-inputs');
  container.innerHTML = '';
  for (let ui = 1; ui <= 6; ui++) {
    const tuningIdx = 6 - ui;
    const openNote = state.tuning.strings[tuningIdx];
    const letter = openNote.slice(0, -1);
    const row = document.createElement('div');
    row.className = 'fret-row';
    row.innerHTML = `
      <span class="str-num">${ui}</span>
      <span class="str-label">${letter}</span>
      <input type="text" placeholder="e.g. 5 8" data-ui-string="${ui}">
      <span class="fret-hint">frets</span>
    `;
    container.appendChild(row);
  }

  const rootSel = document.getElementById('scale-root-select');
  rootSel.innerHTML = KEYS.map(k =>
    `<option value="${k}" ${k === state.key ? 'selected' : ''}>${k}</option>`
  ).join('');

  document.getElementById('scale-modal').classList.remove('hidden');
}

function closeScaleEditor() {
  document.getElementById('scale-modal').classList.add('hidden');
}

function saveCustomScaleHandler() {
  const name = document.getElementById('scale-name-input').value.trim();
  if (!name) { alert('Enter a scale name.'); return; }

  const rootNote = document.getElementById('scale-root-select').value;
  const fretInput = [];
  for (let ui = 1; ui <= 6; ui++) {
    const input = document.querySelector(`[data-ui-string="${ui}"]`);
    const frets = (input?.value ?? '').trim().split(/\s+/)
      .map(Number).filter(n => !isNaN(n) && n >= 0 && n <= 24);
    fretInput.push(frets);
  }

  if (fretInput.every(f => f.length === 0)) {
    alert('Enter at least one fret on any string.');
    return;
  }

  const intervals = deriveIntervalsFromFrets(fretInput, state.tuning, rootNote);
  const newScale = { name, intervals };
  persistScale(newScale);

  state.scales = [...SCALES, ...loadCustomScales()];
  state.scale = state.scales.find(s => s.name === name);
  populateScaleSelect();
  renderTabPanel();
  closeScaleEditor();
}

document.addEventListener('DOMContentLoaded', init);

export { state, populateScaleSelect, populateTuningSelect, renderStringInputs, renderTabPanel };
