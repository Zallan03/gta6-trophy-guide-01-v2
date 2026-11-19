// Saved progress: the earned trophy names live in localStorage under a key of this
// guide's own, and can be exported to a JSON file or imported back. Nothing leaves
// the browser except through the export the reader asks for.
export const EARNED_KEY = 'leonida-platinum-v2-earned';
export const SPOILERS_KEY = 'leonida-platinum-v2-spoilers';

export function readEarned() {
  try {
    const raw = localStorage.getItem(EARNED_KEY);
    if (!raw) return new Set();
    const names = JSON.parse(raw);
    return new Set(Array.isArray(names) ? names : []);
  } catch {
    return new Set();
  }
}

export function writeEarned(earned) {
  localStorage.setItem(EARNED_KEY, JSON.stringify([...earned]));
}

export function readSpoilers() {
  return localStorage.getItem(SPOILERS_KEY) === '1';
}

export function writeSpoilers(on) {
  localStorage.setItem(SPOILERS_KEY, on ? '1' : '0');
}

// Wipes every earned tick (the Reset button). Export first if the progress matters.
export function wipeEarned() {
  localStorage.removeItem(EARNED_KEY);
}

// Downloads the earned set as a JSON file the reader can keep or move to another browser.
export function downloadProgress(earned) {
  const blob = new Blob([JSON.stringify({ app: 'leonida-platinum', earned: [...earned] }, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'gta6-trophy-progress.json';
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// Reads an exported progress file back into a set of trophy names. Names that are
// not in the guide's list are kept in the set but never shown as earned — the list
// render only matches names it knows.
export async function uploadProgress(file) {
  const text = await file.text();
  const doc = JSON.parse(text);
  const names = Array.isArray(doc) ? doc : doc.earned;
  if (!Array.isArray(names)) throw new Error('That file holds no trophy list.');
  return new Set(names.filter((n) => typeof n === 'string'));
}
