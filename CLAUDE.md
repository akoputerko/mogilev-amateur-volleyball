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

This is a static React/TypeScript SPA for the Mogilev Amateur Volleyball League. There is no backend — all data lives in `src/data/league.ts`.

**Routing:** Single page at `/` renders `Index.tsx` with three tabs (gameweeks, teams, standings). React Router handles the `*` → `NotFound` fallback.

**Data flow:** `src/data/league.ts` exports `teams`, `matches`, and `totalGameweeks`. Components import directly from this file. `src/lib/standings.ts` derives standings from that data via `calcStandings()`.

**Schedule structure:** `rawSchedule` holds all 56 matches across 14 gameweeks. Each match entry includes an explicit `date` field in `DD.MM.YYYY` format, converted to `YYYY-MM-DD` by `parseDateDMY()` at build time. Season runs Feb 24 – May 30, 2026 (two legs, 8 teams).

**Adding match results:** Set `played: true` and add a `result: { setsHome, setsAway, setScores }` to the relevant match object inside `buildMatches()` output — or directly in `rawSchedule` by extending the type. The standings recalculate automatically.

**Points system (standings.ts):** Win 3-0 or 3-1 → 3 pts; Win 3-2 → 2 pts, loser gets 1 pt.

**Team name casing:** The `teams` array uses `"Dream Team"` but the schedule uses `"Dream team"`. The `teamByName["Dream team"] = 7` alias in `league.ts` handles this mapping.

**Component library:** shadcn/ui components are in `src/components/ui/`. The path alias `@/` maps to `src/`.