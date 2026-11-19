// Fetches the trophy list (app/data/trophies.json) and hands back its 55 entries,
// sorted by id, plus the labels and the four roadmap stages used across the app.
export async function fetchTrophies() {
  const res = await fetch('data/trophies.json');
  if (!res.ok) throw new Error('Could not load data/trophies.json');
  const doc = await res.json();
  const list = Array.isArray(doc) ? doc : doc.trophies;
  return list.slice().sort((a, b) => a.id - b.id);
}

export const KIND_NAMES = {
  story: 'Story',
  side: 'Stranger strands',
  collectibles: 'Collectibles',
  activities: 'Activities',
  robbery: 'Robberies',
  progression: 'Progress & money',
  platinum: 'Platinum',
  online: 'Online',
};

export const GRADE_NAMES = {
  platinum: 'Platinum',
  gold: 'Gold',
  silver: 'Silver',
  bronze: 'Bronze',
};

export const ROADMAP = [
  { n: 1, heading: 'Stage 1 — Play the story', body: 'Main missions in order: the opening mission, Chapters 1–4, the named story missions and the final mission. Chapter and mission trophies follow story progress and cannot be missed.' },
  { n: 2, heading: 'Stage 2 — Strangers & side missions', body: 'The five character strands (Andy, Kenton, Billy, Randy, Tyrone), three more stranger strands for the silver, and Bret’s unique-animal hunt. Strands open during the story and stay open after it.' },
  { n: 3, heading: 'Stage 3 — Activities & robberies', body: 'Shooting Range golds, drone races, races, fishing, bowling, meditation and the one-shot robbery and stunt moments. Do the Missables page setups deliberately here.' },
  { n: 4, heading: 'Stage 4 — Clean-up & the platinum', body: 'Collectible cards, WAiNK It spots, the 52 areas of Leonida, vehicles, garages, money laundering and 100% completion — then the platinum pops on its own.' },
];

// How many of each grade are earned, for the header's live breakdown. A trophy
// whose grade is not one of the four official grades is ignored, never counted.
export function earnedByGrade(trophies, earned) {
  const tally = { platinum: 0, gold: 0, silver: 0, bronze: 0 };
  for (const t of trophies) {
    if (earned.has(t.name) && t.grade in tally) tally[t.grade] += 1;
  }
  return tally;
}
