// Leonida Platinum — boot, section tabs, toolbar wiring and the demo query params
// used for screenshots (?demo=1 seeds 13 earned trophies, ?view=roadmap|missables|sources,
// ?open=<id> opens a guide, ?spoilers=1 turns spoiler-safe mode on).
import { fetchTrophies, earnedByGrade } from './data.js';
import { readEarned, writeEarned, readSpoilers, writeSpoilers, downloadProgress, uploadProgress, wipeEarned } from './store.js';
import { paintList, paintGuide, paintRoadmap, paintMissables } from './views.js';

// Thirteen trophies the demo seeds as earned so screenshots show progress honestly
// labelled as a demo: the opening, two chapters, two missions, the Shooting Range
// guide trophy, and a spread of activities.
const DEMO_EARNED_IDS = [2, 3, 4, 8, 9, 16, 17, 20, 21, 33, 42, 46, 52];

const state = {
  trophies: [],
  earned: readEarned(),
  spoilersOn: readSpoilers(),
  search: '',
  kind: 'all',
  grade: 'all',
  missableOnly: false,
  hideEarned: false,
  selected: null,
  demo: false,
};

const $ = (id) => document.getElementById(id);

function readDemoParams() {
  const params = new URLSearchParams(location.search);
  if (params.get('demo') === '1') {
    state.demo = true;
    if (state.earned.size === 0) {
      for (const t of state.trophies) {
        if (DEMO_EARNED_IDS.includes(t.id)) state.earned.add(t.name);
      }
      writeEarned(state.earned);
    }
  }
  if (params.get('spoilers') === '1') {
    state.spoilersOn = true;
    writeSpoilers(true);
  }
  const openId = Number(params.get('open'));
  if (openId) state.selected = openId;
  return params.get('view');
}

function paintAll() {
  $('earnedTotal').textContent = String(state.earned.size);
  const pct = Math.round((state.earned.size / state.trophies.length) * 100);
  $('progressSub').textContent = `${pct}% of the way to the platinum`;
  $('meterFill').style.width = `${pct}%`;
  const byGrade = earnedByGrade(state.trophies, state.earned);
  $('progressGrades').textContent = `Earned: ${byGrade.platinum} platinum · ${byGrade.gold} gold · ${byGrade.silver} silver · ${byGrade.bronze} bronze (of 1 · 2 · 6 · 46)`;
  const shown = paintList($('trophyRows'), state.trophies, state, flipEarned, pickTrophy);
  $('listStatus').textContent = `Showing ${shown} of ${state.trophies.length} trophies · ${state.earned.size} earned`;
  $('emptyNote').hidden = shown !== 0;
  const picked = state.trophies.find((t) => t.id === state.selected) || null;
  paintGuide($('guidePane'), picked, state);
  paintRoadmap($('stageGrid'), state.trophies, state.earned);
  paintMissables($('missableRows'), state.trophies, state, flipEarned, pickTrophy);
  $('missableTotal').textContent = String(state.trophies.filter((t) => t.missable).length);
  $('spoilerBanner').hidden = !state.spoilersOn;
  $('demoBanner').hidden = !state.demo;
  if (state.earned.size >= state.trophies.length) {
    $('progressSub').textContent = 'Platinum earned — you are a Leonida Legend!';
  }
}

function flipEarned(trophy) {
  if (state.earned.has(trophy.name)) state.earned.delete(trophy.name);
  else state.earned.add(trophy.name);
  writeEarned(state.earned);
  paintAll();
}

function pickTrophy(trophy) {
  state.selected = trophy.id;
  openSection('tracker');
  paintAll();
  $('guidePane').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function openSection(name) {
  for (const btn of document.querySelectorAll('.section-tab')) {
    btn.classList.toggle('is-active', btn.dataset.section === name);
  }
  for (const section of document.querySelectorAll('.panel')) {
    section.classList.toggle('is-active', section.id === `section-${name}`);
  }
}

function wireControls() {
  $('searchBox').addEventListener('input', (e) => {
    state.search = e.target.value;
    paintAll();
  });
  $('kindSelect').addEventListener('change', (e) => {
    state.kind = e.target.value;
    paintAll();
  });
  $('gradeSelect').addEventListener('change', (e) => {
    state.grade = e.target.value;
    paintAll();
  });
  $('missableCheck').addEventListener('change', (e) => {
    state.missableOnly = e.target.checked;
    paintAll();
  });
  $('hideEarnedCheck').addEventListener('change', (e) => {
    state.hideEarned = e.target.checked;
    paintAll();
  });
  const spoilerBox = $('spoilerCheck');
  spoilerBox.checked = state.spoilersOn;
  spoilerBox.addEventListener('change', (e) => {
    state.spoilersOn = e.target.checked;
    writeSpoilers(state.spoilersOn);
    paintAll();
  });
  $('exportButton').addEventListener('click', () => downloadProgress(state.earned));
  $('importInput').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      state.earned = await uploadProgress(file);
      writeEarned(state.earned);
      paintAll();
    } catch (err) {
      alert(`Could not import that file: ${err.message}`);
    }
    e.target.value = '';
  });
  $('resetButton').addEventListener('click', () => {
    if (!confirm('Clear all earned ticks?')) return;
    wipeEarned();
    state.earned = new Set();
    paintAll();
  });
  for (const btn of document.querySelectorAll('.section-tab')) {
    btn.addEventListener('click', () => openSection(btn.dataset.section));
  }
}

try {
  state.trophies = await fetchTrophies();
  const view = readDemoParams();
  if (!state.selected && state.trophies.length) state.selected = 17;
  wireControls();
  paintAll();
  if (view && ['tracker', 'roadmap', 'missables', 'sources'].includes(view)) openSection(view);
} catch (err) {
  $('guidePane').textContent = `This guide could not load its trophy list: ${err.message}`;
}
