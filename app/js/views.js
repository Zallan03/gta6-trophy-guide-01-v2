// Renders the tracker rows, the guide pane, the roadmap stages and the missables
// list. Every render builds plain DOM from the trophy data — no templates, no
// network, and no copied guide text: the guides come from data/trophies.json.
import { KIND_NAMES, GRADE_NAMES, ROADMAP } from './data.js';
import { applyFilters, spoilerHidden, hiddenName, hiddenDescription } from './filters.js';

export function gradeBadge(grade) {
  const span = document.createElement('span');
  span.className = `grade-badge grade-${grade}`;
  span.textContent = GRADE_NAMES[grade] || grade;
  return span;
}

function kindChip(kind) {
  const span = document.createElement('span');
  span.className = 'chip';
  span.textContent = KIND_NAMES[kind] || kind;
  return span;
}

function rowChips(t) {
  const wrap = document.createElement('div');
  wrap.className = 'row-tags';
  wrap.append(kindChip(t.kind));
  if (t.missable) {
    const m = document.createElement('span');
    m.className = 'chip chip-missable';
    m.textContent = 'Missable — one-shot moment';
    wrap.append(m);
  }
  if (t.hidden) {
    const h = document.createElement('span');
    h.className = 'chip chip-hidden';
    h.textContent = 'Hidden on PSN';
    wrap.append(h);
  }
  if (t.target) {
    const c = document.createElement('span');
    c.className = 'chip';
    c.textContent = `PSN target: ${t.target.toLocaleString('en-US')}`;
    wrap.append(c);
  }
  return wrap;
}

function makeRow(t, state, onToggle, onSelect) {
  const concealed = spoilerHidden(t, state.earned, state.spoilersOn);
  const li = document.createElement('li');
  const row = document.createElement('button');
  row.type = 'button';
  row.className = 'trophy-row' + (state.earned.has(t.name) ? ' is-earned' : '') + (state.selected === t.id ? ' is-selected' : '');
  const box = document.createElement('input');
  box.type = 'checkbox';
  box.checked = state.earned.has(t.name);
  box.setAttribute('aria-label', `Earned: ${t.name}`);
  box.addEventListener('click', (e) => {
    e.stopPropagation();
    onToggle(t);
  });
  const body = document.createElement('span');
  const name = document.createElement('span');
  name.className = 'row-name';
  name.textContent = concealed ? hiddenName() : t.name;
  const desc = document.createElement('span');
  desc.className = 'row-desc';
  desc.textContent = concealed ? hiddenDescription() : t.description;
  body.append(name, desc, rowChips(t));
  row.append(box, body, gradeBadge(t.grade));
  row.addEventListener('click', () => onSelect(t));
  li.append(row);
  return li;
}

// One row per trophy in the checklist: a tick box, the official name and description,
// grade and tags. Returns how many rows were shown.
export function paintList(listEl, trophies, state, onToggle, onSelect) {
  const shown = applyFilters(trophies, state);
  listEl.replaceChildren();
  for (const t of shown) listEl.append(makeRow(t, state, onToggle, onSelect));
  return shown.length;
}

// The guide pane beside the list: official name, description and grade, the guide in
// our own words, and the sources each fact comes from.
export function paintGuide(pane, trophy, state) {
  pane.replaceChildren();
  if (!trophy) {
    const p = document.createElement('p');
    p.className = 'guide-empty';
    p.textContent = 'Pick a trophy from the list to read its guide, its sources and when it can be missed.';
    pane.append(p);
    return;
  }
  const concealed = spoilerHidden(trophy, state.earned, state.spoilersOn);
  const title = document.createElement('h3');
  title.textContent = concealed ? hiddenName() : trophy.name;
  const desc = document.createElement('p');
  desc.className = 'guide-desc';
  desc.textContent = concealed ? hiddenDescription() : trophy.description;
  const meta = document.createElement('p');
  meta.className = 'guide-meta';
  const bits = [`Grade: ${GRADE_NAMES[trophy.grade] || trophy.grade}`, `Kind: ${KIND_NAMES[trophy.kind] || trophy.kind}`, `Roadmap stage: ${trophy.stage} of 4`];
  if (trophy.target) bits.push(`PSN progress target: ${trophy.target.toLocaleString('en-US')}`);
  if (trophy.missable) bits.push('Missable: a one-shot moment — do it in the mission or setup named in the guide');
  else bits.push('Missable: no — it stays available after the story');
  if (trophy.hidden) bits.push('Hidden on PlayStation until earned');
  meta.textContent = bits.join(' · ');
  const guide = document.createElement('div');
  guide.className = 'guide-text';
  const gp = document.createElement('p');
  gp.textContent = concealed ? 'Turn off spoiler-safe mode, or earn this trophy, to read its guide.' : trophy.guide;
  guide.append(gp);
  pane.append(title, desc, gradeBadge(trophy.grade), meta);
  if (!concealed) {
    const src = document.createElement('div');
    src.className = 'guide-sources';
    const strong = document.createElement('strong');
    strong.textContent = 'Sources: ';
    src.append(strong);
    const links = [
      ['Exophase — GTA VI trophies', 'https://www.exophase.com/game/grand-theft-auto-vi-psn/trophies/'],
      ['PSNProfiles — GTA VI trophies', 'https://psnprofiles.com/trophies/43531-grand-theft-auto-vi'],
    ];
    links.forEach(([label, href], i) => {
      if (i) src.append(document.createTextNode(' · '));
      const a = document.createElement('a');
      a.href = href;
      a.target = '_blank';
      a.rel = 'noopener';
      a.textContent = label;
      src.append(a);
    });
    pane.append(src);
  }
  pane.append(guide);
}

// The four roadmap stages, each with its trophies and how many are earned.
export function paintRoadmap(wrap, trophies, earned) {
  wrap.replaceChildren();
  for (const stage of ROADMAP) {
    const card = document.createElement('div');
    card.className = 'stage-card';
    const h = document.createElement('h3');
    h.textContent = stage.heading;
    const p = document.createElement('p');
    p.textContent = stage.body;
    const members = trophies.filter((t) => t.stage === stage.n);
    const done = members.filter((t) => earned.has(t.name)).length;
    const prog = document.createElement('p');
    prog.className = 'stage-count';
    prog.textContent = `${done} of ${members.length} earned in this stage`;
    const ul = document.createElement('ul');
    for (const t of members) {
      const li = document.createElement('li');
      if (earned.has(t.name)) li.className = 'is-earned';
      li.textContent = `${earned.has(t.name) ? '✓ ' : ''}${t.name} — ${GRADE_NAMES[t.grade] || t.grade}`;
      ul.append(li);
    }
    card.append(h, p, prog, ul);
    wrap.append(card);
  }
}

// The missables page: only the one-shot trophies, each with its moment named.
export function paintMissables(listEl, trophies, state, onToggle, onSelect) {
  const flagged = trophies.filter((t) => t.missable);
  listEl.replaceChildren();
  for (const t of flagged) listEl.append(makeRow(t, state, onToggle, onSelect));
  return flagged.length;
}
