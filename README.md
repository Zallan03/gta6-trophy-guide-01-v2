# Leonida Platinum — GTA VI Trophy Guide & Tracker

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/Zallan03/gta6-trophy-guide-01-v2/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/Zallan03/gta6-trophy-guide-01-v2/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

An offline guide and tracker for all **55 PlayStation 5 trophies** of Grand Theft Auto VI
(1 platinum, 2 gold, 6 silver, 46 bronze, 28 hidden) — built for the
[make.fun gta6-trophy-guide-01 bounty](https://make.fun/c/gta6-trophy-guide-01).

Referral: https://make.fun/r/tmbrnhrj

## What it is

- **Tracker** — every trophy with its official name, description and grade, as a
  checklist saved in your browser (localStorage), with export to a file and import back.
- **Filters** — by kind (story, stranger strands, collectibles, activities, robberies,
  progress & money, platinum — plus online, which the official list has none of), by
  grade, missable-only, hide-earned, and full-text search.
- **Spoiler-safe mode** — hides the names and descriptions of story trophies you have
  not earned yet.
- **Roadmap to the platinum** — four stages built from the official descriptions: story
  (12 trophies), strangers & side missions (7), activities & robberies (22), then the
  clean-up (14) ending in 100% completion.
- **Missables page** — the 18 one-shot moments (a mission or setup that happens once),
  each with the mission or setup named and how to recover it.
- **Cited guides** — every trophy has a guide written in our own words that names its
  sources (Exophase for the official list, PSNProfiles for PSN's progress targets).
  Where the official description names no place or method, the guide says so instead of
  inventing one.

## Run it

```sh
node serve.ts
# open http://localhost:8080
```

It is plain static files under `app/` — no build step, no network requests, works with
the network off. The look is our own: no Rockstar logo, box art or game screenshots.

## Screenshots

Four real renders of the app in headless Chromium (1280×800, JPEG), listed in
`shots.json`:

1. `1-cover.jpg` — the tracker with 13 demo trophies earned and the Shooting Range
   guide ("The Shootist") open beside the list.
2. `2-roadmap.jpg` — the four-stage roadmap to the platinum.
3. `3-missables.jpg` — the missables page with the one-shot moments flagged.
4. `4-spoilers.jpg` — spoiler-safe mode on: un-earned story trophies hidden.

The demo state is seeded only through the `?demo=1` query parameter, which ticks 13
trophies in a fresh browser profile; real readers start at 0 of 55.

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` (Node 22, standard library only) copies `app/` and `screenshots/` to `/output`
and writes `/output/dossier.json` with the vendored `vendor/makefun-frontend.ts`
(the kit's copy, unchanged).

## Verification

- Official list checked against two public sources, which agree on all 55 names,
  descriptions and grades: Exophase and PSNProfiles (fetched 2026-11-19).
- PSN progress targets used: 100% (0/100), 250 stunts, 9 activities, 42 Shooting Range
  challenges, 14 drone races, 20 races, 8 stranger strands, 18 meditation spots,
  3 card sets, 100 WAiNK, 50 challenges, 100 vehicles, 5 bank vaults, 52 areas,
  9 gangs, 500 choices, $250,000 laundering, $100,000 spending, 8 garages,
  10 Scooter Bros registrations.
- `main.ts` run twice to two output dirs — both runs byte-identical (dossier.json `cmp`
  clean, `diff -r` clean). Dossier under the 1.5 MiB cap.
- `node --check` passes for `main.ts`, `serve.ts` and every `app/js/*.js` file
  (run at build time; see the build report for the exact output).
- Served `app/` over HTTP and checked `index.html`, `style.css`, every JS module and
  `data/trophies.json` return 200 (checked at build time).

## Sources

- [Exophase — Grand Theft Auto VI trophies](https://www.exophase.com/game/grand-theft-auto-vi-psn/trophies/)
  — official names, descriptions and grades.
- [PSNProfiles — Grand Theft Auto VI trophies](https://psnprofiles.com/trophies/43531-grand-theft-auto-vi)
  — PSN progress targets and rarity.

An unofficial fan guide. Grand Theft Auto and GTA are trademarks of Rockstar Games /
Take-Two Interactive. Trophy names and descriptions are shown as PlayStation publishes
them; all guide text is original to this entry. License: MIT.
