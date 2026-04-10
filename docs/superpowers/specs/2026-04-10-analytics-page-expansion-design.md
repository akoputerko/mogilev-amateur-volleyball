# Analytics Page Expansion — Design Spec

**Date:** 2026-04-10
**Status:** Approved

---

## Context

The Analytics page (`src/pages/AnalyticsPage.vue`) currently has 9 sections in a single scroll. Adding 6 new sections would make it unwieldy without structure. The goal is to add all new sections while reorganising the page into tabs for better navigation.

---

## Decisions Made

| Topic | Decision |
|---|---|
| Page structure | 3 tabs: Сводка / Статистика / Команды |
| Chart library | Apache ECharts via `vue-echarts` |
| Results matrix cells | Set score: `3:0`, `2:1`, `1:2`, `0:3` + colour |
| Team form length | Last 5 matches |

---

## Tab Structure

### Вкладка «Сводка» (6 sections)

1. **Обзор лиги** *(existing)* — 4 stat cards: matches / sets / points / avg per set
2. **Результаты матчей** *(existing)* — 3:0 vs 2:1 breakdown with progress bar
3. **Дома / В гостях** *(existing)* — home/away win split, breakdowns, avg points
4. **Лидеры лиги** *(existing)* — 8 categories, supports tied leaders (multiple teams)
5. **Рекорды лиги** *(existing)* — tightest set, biggest blowout, highest-scoring match
6. **Матрица результатов** *(new)* — 8×8 cross-table of all played matchups

### Вкладка «Статистика» (5 sections)

1. **Характер партий** *(existing)* — close/dominant sets counts, avg margin, team leaders
2. **Партии (лига)** *(existing)* — per-set (1/2/3): home win rate, avg points, avg margin
3. **Решающие партии** *(existing)* — 2:1 match count, comebacks, blown leads, team leaders
4. **Серии сезона** *(existing)* — longest win/loss streak, current streaks list
5. **Распределение счётов** *(new)* — top-10 most frequent set scores as horizontal bar chart

### Вкладка «Команды» (4 sections)

1. **Форма команд** *(new)* — last 5 matches per team as W/L chips, sorted by standings position
2. **Эффективность по партиям** *(new)* — per-team win rate in set 1, 2, 3
3. **Динамика позиций** *(new)* — ECharts line chart, Y-axis inverted (1st place = top), one line per team
4. **Средний счёт в партиях** *(new)* — per-team avg points scored in won sets vs lost sets

---

## New Sections — Detailed Spec

### Матрица результатов

- 8×8 table; rows = home team, columns = away team
- Diagonal cells: greyed out (team doesn't play itself)
- Unplayed matchups: empty/muted cell
- Played cell: background green (win for row team) or red (loss), text = set score (`3:0`, `2:1`, `1:2`, `0:3`)
- The matrix is asymmetric: cell [A][B] = A hosted B, cell [B][A] = B hosted A — both legs have their own cell naturally
- Data source: computed directly from `matches` in the template — no new lib function needed

### Распределение счётов партий

- Collect all set scores from all played matches (3 per match)
- Group by canonical string `"home:away"` (e.g. `"25:20"`)
- Sort by count descending, show top 10
- Rendered as ECharts horizontal bar chart: category axis = score string, value axis = count
- Bar colour: green if home > away (home won that set), red otherwise

### Форма команд

- New helper `getForm(teamId, n)` in `src/lib/stats.ts` — returns last `n` played matches for the team, each with `{ won: boolean }`
- Rendered as a list of all 8 teams sorted by current standings position
- Per team: coloured avatar + short name + 5 chips (В = win, П = loss)
- Chips: `bg-sport-win/20 text-sport-win` for wins, `bg-sport-loss/20 text-sport-loss` for losses

### Эффективность по партиям (per-team)

- Reuses `getSetPerformance(teamId)` from `src/lib/stats.ts` (already exists)
- Table: rows = 8 teams (sorted by standings), columns = Партия 1 / Партия 2 / Партия 3
- Each cell: win rate as percentage, coloured green if ≥ 50%, red if < 50%

### Динамика позиций

- Reuses `getPositionHistory(teamId)` from `src/lib/stats.ts` (already exists)
- ECharts line chart:
  - X-axis: gameweek numbers (only gameweeks with played matches)
  - Y-axis: position 1–8, **inverted** (1 at top)
  - One `smooth: true` line per team, coloured with `team.color`
  - Legend shows all 8 team short names
  - Tooltip shows position on hover
- Chart height: `300px`

### Средний счёт в партиях

- New helper `getAvgSetScore(teamId)` in `src/lib/stats.ts`:
  - Iterates all played matches for the team, looks at each set
  - Per set: if team won the set → add to "won sets" bucket; if lost → add to "lost sets" bucket
  - Returns `{ avgScoredWon: number, avgConcededWon: number, avgScoredLost: number, avgConcededLost: number }`
- Rendered as a grid of 8 team cards, each showing:
  - "В выигранных партиях: **25.3** : 19.1" (team score : opponent score)
  - "В проигранных партиях: 18.4 : **24.7**"

---

## Technical Implementation

### Dependencies to add

```
vue-echarts
echarts
```

Install: `npm install vue-echarts echarts`

### New functions in `src/lib/stats.ts`

| Function | Description |
|---|---|
| `getForm(teamId, n)` | Returns last `n` played matches with `won` boolean |
| `getAvgSetScore(teamId)` | Returns avg points scored/conceded in won vs lost sets |

### ECharts setup in `AnalyticsPage.vue`

Import only what's needed for tree-shaking:
```ts
import { use } from "echarts/core";
import { LineChart, BarChart } from "echarts/charts";
import { GridComponent, LegendComponent, TooltipComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import VChart from "vue-echarts";
use([LineChart, BarChart, GridComponent, LegendComponent, TooltipComponent, CanvasRenderer]);
```

### Tab state

- `activeTab` ref: `"summary" | "stats" | "teams"` — plain `ref`, no router integration
- Default: `"summary"`
- Tab bar uses shadcn `Button` with `variant="ghost"` + active indicator (bottom border or bg highlight)

### File changes

| File | Change |
|---|---|
| `src/pages/AnalyticsPage.vue` | Major: add tabs, 6 new sections, ECharts components |
| `src/lib/stats.ts` | Add `getForm()`, `getAvgSetScore()` |
| `package.json` | Add `vue-echarts`, `echarts` |

---

## Verification

1. `npm install` — installs new deps without errors
2. `npm run build` — no TypeScript errors, bundle includes ECharts tree-shaken
3. `npm run lint` — no lint errors
4. `npm run dev` — all three tabs render correctly
5. Switching tabs preserves no state (stateless computed data)
6. ECharts charts render with correct data and inverted Y-axis for position history
7. Results matrix shows correct colours (green = row-team won) and set scores
8. Team form chips match the last 5 played matches chronologically
