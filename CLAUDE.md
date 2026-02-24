# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server on port 8080
npm run build        # Production build
npm run build:dev    # Development build
npm run lint         # Run ESLint
npm run preview      # Preview production build
npm run test         # Run tests once
npm run test:watch   # Run tests in watch mode
```

To run a single test file: `npx vitest run src/test/example.test.ts`

## Architecture

Static React/TypeScript SPA for the Mogilev Amateur Volleyball League. No backend — all data lives in `src/data/league.ts`.

**Routing:** `HashRouter`. `Index.tsx` is the layout shell with tab navigation; route content renders via `<Outlet />`. All route-level pages are in `src/pages/`:

| Path | Component |
|---|---|
| `/` | `StandingsPage` |
| `/calendar` | `Calendar` |
| `/tours` | `ToursPage` |
| `/teams` | `TeamsPage` |
| `/teams/:id` | `TeamPage` |
| `/playground` | `PlaygroundPage` |

`src/components/` contains only reusable sub-components (`MatchCard`, shadcn/ui primitives, etc.).

**Data flow:** Data is split across three files:
- `src/data/schedule.ts` — `rawSchedule` (56 matches, 14 gameweeks, explicit `DD.MM.YYYY` dates)
- `src/data/results.ts` — `matchResults` record, keyed `"GW{n}: {home} - {away}"` using names exactly as in schedule
- `src/data/league.ts` — imports both, exports `teams`, `matches`, `totalGameweeks`, `seasonStart`, `seasonEnd`

`buildMatches()` in `league.ts` looks up each match by key in `matchResults`; presence of an entry sets `played: true` and populates `result`. `seasonStart`/`seasonEnd` are computed from match dates (`seasonEnd` = last match + 7 days for playoffs). `src/lib/standings.ts` derives standings via `calcStandings()`.

**Adding match results:** Edit `src/data/results.ts` only. Add an entry keyed by the numeric match `id` from `schedule.ts` with `{ setsHome, setsAway, setScores }` (exactly 3 set score entries). Standings recalculate automatically.

**Match format:** Always exactly 3 sets per match. Valid results: 3-0 or 2-1 (and mirrored 0-3 / 1-2). No best-of-5 logic.

**Points system:** Win 3-0 → 3 pts; Win 2-1 → 2 pts, loser gets 1 pt. Implemented in `standings.ts` via `loserSets === 0` check.

**Team name casing:** `teams` array uses `"Dream Team"` but the schedule uses `"Dream team"`. The alias `teamByName["Dream team"] = 7` handles this.

**Color system:** Consistent semantic colors used throughout:
- `amber-400` — leader (1st place) in standings table
- `sky-500` — playoff zone (2nd–4th) in standings table
- `sport-win` (green) — wins, home match border/badge, positive set diff, played match chip border in Calendar
- `sport-loss` (red) — losses, away match result
- `accent` (orange) — away match border/badge, points column, upcoming match chip border in Calendar

**Calendar chip rendering:** Match chips use `bg-sport-win/20 border-l-2 border-sport-win` (played) or `bg-accent/15 border-l-2 border-accent` (upcoming) for status. Text is always `text-foreground` / `text-foreground/70` / `text-muted-foreground` — never the status color — so chips are readable in both light and dark mode.

**StatBox component** (in `StandingsPage` and `TeamPage`): takes `wins: number` and `losses: number` props (not a single `value` string) and renders them in `text-sport-win` / `text-sport-loss` respectively.

**MatchCard props:** `teamId?: number` enables home/away left-border coloring and Дома/В гостях badge. `linkTeams?: boolean` makes team names clickable links to `/teams/:id`. The card uses `flex flex-col` with `flex-1 justify-center` on the content area so the footer always pins to the bottom regardless of whether a score or VS is shown — prevents layout breakage in two-column grids when adjacent cards have different content heights.

**Theme toggle:** `Index.tsx` manages dark/light mode via `useState` + `useEffect` that toggles `.dark` on `document.documentElement` and persists to `localStorage`. Reads `prefers-color-scheme` as the default on first load. Icons: `Moon` (light mode) / `Sun` (dark mode) from lucide-react, shown in the header top-right.

**Accessibility (WCAG 2.1 AA):**
- Tab bar is wrapped in `<nav aria-label="Основная навигация">` with `aria-current="page"` on the active button
- All lucide-react icons that are purely decorative carry `aria-hidden="true"`
- Clickable `<div>` elements that navigate to team pages have `role="button"`, `tabIndex={0}`, `onKeyDown` (Enter/Space) and a descriptive `aria-label`
- `StandingsPage`: table `<th>` elements have `scope="col"`; rows have `tabIndex`, `onKeyDown`, and `aria-label`
- `TeamPage`: filter button group has `role="group"` + `aria-label`; each filter button has `aria-pressed`; form badges use `aria-label` instead of `title`
- `Calendar`: prev/next month buttons have `aria-label`; match chips have `aria-label` with full match details
- `PlaygroundPage`: game overlay has `role="alert"`; board has `role="application"`; reset button has `aria-label` (no `title`)
- `ToursPage`: `<select>` has `aria-label`
- `index.css`: `@media (prefers-reduced-motion: reduce)` disables `animate-fade-in` / `animate-slide-up` and collapses all transition durations

**Component library:** shadcn/ui components in `src/components/ui/`. Path alias `@/` maps to `src/`.

**Deployments:** GitHub Pages (`https://akoputerko.github.io/mogilev-amateur-volleyball/`). `vite.config.ts` sets `base` conditionally: `/mogilev-amateur-volleyball/` when `process.env.GITHUB_ACTIONS` is set, `/` otherwise.
