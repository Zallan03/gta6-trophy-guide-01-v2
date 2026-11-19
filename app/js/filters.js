// Filters and the spoiler rule: which trophies the list shows, and what a
// spoiler-safe reader sees of a story trophy they have not earned yet.
export function applyFilters(trophies, opts) {
  const q = (opts.search || '').trim().toLowerCase();
  return trophies.filter((t) => {
    if (opts.kind !== 'all' && t.kind !== opts.kind) return false;
    if (opts.grade !== 'all' && t.grade !== opts.grade) return false;
    if (opts.missableOnly && !t.missable) return false;
    if (opts.hideEarned && opts.earned.has(t.name)) return false;
    if (q) {
      const hay = `${t.name} ${t.description} ${t.guide} ${t.kind} ${t.grade}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

// Spoiler-safe mode hides the name, description and guide of a story trophy the
// reader has not earned yet. Count trophies and non-story trophies are never hidden,
// and the platinum is never hidden either — it is the goal, not a spoiler.
export function spoilerHidden(trophy, earned, spoilersOn) {
  if (!spoilersOn) return false;
  if (earned.has(trophy.name)) return false;
  return trophy.kind === 'story';
}

export function hiddenName() {
  return 'Hidden story trophy';
}

export function hiddenDescription() {
  return 'Spoiler-safe mode hides this story trophy until you earn it. Tick it earned, or turn the mode off, to see it.';
}
