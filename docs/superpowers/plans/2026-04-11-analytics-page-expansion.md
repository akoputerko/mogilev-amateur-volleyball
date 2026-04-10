# Analytics Page Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reorganize `AnalyticsPage.vue` into 3 tabs (Сводка/Статистика/Команды) and add 6 new sections, including 2 ECharts charts.

**Architecture:** All changes in `src/pages/AnalyticsPage.vue` and `src/lib/stats.ts`. New lib functions added with TDD. ECharts tree-shaken via `echarts/core` + `vue-echarts`. Tab state is a plain `ref`, no router integration.

**Tech Stack:** Vue 3 + TypeScript, Apache ECharts 5 via `vue-echarts`, Tailwind CSS v3, Vitest.

---

## File Map

| File | Change |
|---|---|
| `.gitignore` | Add `.superpowers/` |
| `package.json` | Add `vue-echarts`, `echarts` (via npm install) |
| `src/lib/stats.ts` | Add `getForm()` + `FormEntry`, `getAvgSetScore()` + `AvgSetScore` |
| `src/test/stats.test.ts` | Fix 12 stale test assertions; add tests for 2 new functions |
| `src/pages/AnalyticsPage.vue` | Tab bar + reorganise existing 9 sections + 6 new sections + ECharts |

---

## Task 1: Add `.superpowers/` to `.gitignore`

**Files:**
- Modify: `.gitignore`

- [ ] **Step 1: Add the entry**

Append to `.gitignore`:

```
.superpowers/
```

- [ ] **Step 2: Commit**

```bash
git -C /Users/Aliaksandr_Kaputserka/personal/projects/mogilev-amateur-volleyball add .gitignore
git -C /Users/Aliaksandr_Kaputserka/personal/projects/mogilev-amateur-volleyball commit -m "chore: ignore .superpowers/ directory"
```

---

## Task 2: Install ECharts dependencies

**Files:**
- Modify: `package.json`, `package-lock.json` (auto-updated)

- [ ] **Step 1: Install**

```bash
cd /Users/Aliaksandr_Kaputserka/personal/projects/mogilev-amateur-volleyball && npm install vue-echarts echarts
```

Expected: installs without errors.

- [ ] **Step 2: Verify**

```bash
grep -E '"vue-echarts"|"echarts"' package.json
```

Expected: both entries appear under `"dependencies"`.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat: add vue-echarts and echarts dependencies"
```

---

## Task 3: Fix stale tests in `stats.test.ts`

Tests were written for tours 1–5. Tours 6 and 7 results have since been added, making 12 assertions stale.

**Files:**
- Modify: `src/test/stats.test.ts`

- [ ] **Step 1: Run tests to confirm 12 failures**

```bash
npx vitest run src/test/stats.test.ts
```

Expected: 12 failures from stale value assertions.

- [ ] **Step 2: Update `getPositionHistory` tests**

In the `getPositionHistory` describe block, replace:

```ts
  it("returns one entry per played gameweek", () => {
    const result = getPositionHistory(0);
    // Tours 1-5 have played matches, so 5 entries
    expect(result.length).toBe(5);
    expect(result.map((p) => p.gameweek)).toEqual([1, 2, 3, 4, 5]);
  });
```

With:

```ts
  it("returns one entry per played gameweek", () => {
    const result = getPositionHistory(0);
    // Tours 1-7 have played matches, so 7 entries
    expect(result.length).toBe(7);
    expect(result.map((p) => p.gameweek)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });
```

Replace the inner `expect(result.length).toBe(5)` in `"returns same structure for all teams"`:

```ts
  it("returns same structure for all teams", () => {
    for (let id = 0; id < 8; id++) {
      const result = getPositionHistory(id);
      expect(result.length).toBe(7);
      result.forEach((p) => {
        expect(p.position).toBeGreaterThanOrEqual(1);
        expect(p.position).toBeLessThanOrEqual(8);
      });
    }
  });
```

- [ ] **Step 3: Update `getStreaks` tests**

Replace the streak test for Макиато (id=0):

```ts
  it("returns correct streak for Макиато (id=0)", () => {
    // Matches in order: W W W L W W W (tours 1-7: M1 M8 M9 M15 M22 M17 M25)
    // Current streak: W3, longestWin: 3, longestLoss: 1
    const result = getStreaks(0);
    expect(result.current?.type).toBe("win");
    expect(result.current?.count).toBe(3);
    expect(result.longestWin).toBe(3);
    expect(result.longestLoss).toBe(1);
  });
```

Replace the streak test for Dream Team (id=7):

```ts
  it("returns correct streak for Dream Team (id=7)", () => {
    // Matches: L W W L W W W (tours 1-7: M1 M5 M12 M13 M19 M24 M26)
    // Current streak: W3, longestWin: 3, longestLoss: 1
    const result = getStreaks(7);
    expect(result.current?.type).toBe("win");
    expect(result.current?.count).toBe(3);
    expect(result.longestWin).toBe(3);
    expect(result.longestLoss).toBe(1);
  });
```

Replace the streak test for Отцы и дети (id=4):

```ts
  it("returns correct streak for Отцы и дети (id=4)", () => {
    // Matches: L L W W W L L (tours 1-7: M3 M7 M10 M15 M20 M24 M27)
    // Current streak: L2, longestWin: 3, longestLoss: 2
    const result = getStreaks(4);
    expect(result.current?.type).toBe("loss");
    expect(result.current?.count).toBe(2);
    expect(result.longestWin).toBe(3);
    expect(result.longestLoss).toBe(2);
  });
```

- [ ] **Step 4: Update `getSetPerformance` tests**

Replace the `"returns zeros for set win/loss totals"` test:

```ts
  it("returns zeros for set win/loss totals that add up to played matches", () => {
    const result = getSetPerformance(0); // Макиато played 7 matches (tours 1-7)
    result.forEach((s) => {
      expect(s.won + s.lost).toBe(7);
    });
  });
```

Replace the `"Макиато set 3"` test:

```ts
  it("Макиато set 3 has 6 wins and 1 loss", () => {
    // M1 W, M8 W, M9 W, M15 L (0:3 sweep — Макиато lost set3 15<25), M22 W, M17 W, M25 W
    const result = getSetPerformance(0);
    const set3 = result.find((s) => s.setNum === 3)!;
    expect(set3.won).toBe(6);
    expect(set3.lost).toBe(1);
  });
```

- [ ] **Step 5: Update `getScoringPatterns` tests**

Replace the `"returns correct totalSets"` test:

```ts
  it("returns correct totalSets as played * 3", () => {
    const result = getScoringPatterns(0); // Макиато played 7 matches (tours 1-7)
    expect(result.totalSets).toBe(21);
  });
```

Replace the close/dominant sets tests:

```ts
  it("Макиато has 5 close sets (margin<=3)", () => {
    // M1: margins 5,8,2 -> 1 close; M8: 5,2,5 -> 1 close; M9: 2,2,9 -> 2 close
    // M15: 10,6,10 -> 0; M22: 7,4,5 -> 0; M17: 15,4,6 -> 0; M25: 8,16,2 -> 1 close
    const result = getScoringPatterns(0);
    expect(result.closeSets).toBe(5);
  });

  it("Макиато has 4 dominant sets (margin>=10)", () => {
    // M15: |25-15|=10 and |25-15|=10 -> 2; M17: |25-10|=15 -> 1; M25: |25-9|=16 -> 1
    const result = getScoringPatterns(0);
    expect(result.dominantSets).toBe(4);
  });
```

- [ ] **Step 6: Run tests to confirm all pass**

```bash
npx vitest run src/test/stats.test.ts
```

Expected: all tests pass.

- [ ] **Step 7: Commit**

```bash
git add src/test/stats.test.ts
git commit -m "test: update stats tests for tours 1-7 season data"
```

---

## Task 4: Add `getForm()` to `src/lib/stats.ts` (TDD)

**Files:**
- Modify: `src/test/stats.test.ts`
- Modify: `src/lib/stats.ts`

- [ ] **Step 1: Write failing tests**

Add `getForm` to the import at the top of `src/test/stats.test.ts`:

```ts
import { getStreaks, getSetPerformance, getComebackStats, getScoringPatterns, getPositionHistory, getForm } from "@/lib/stats";
```

Append at the end of `src/test/stats.test.ts`:

```ts
describe("getForm", () => {
  it("returns exactly n entries when team has more played matches than n", () => {
    const result = getForm(0, 3);
    expect(result).toHaveLength(3);
  });

  it("returns all played matches when n exceeds played count", () => {
    // Макиато played 7 matches in tours 1-7
    const result = getForm(0, 20);
    expect(result).toHaveLength(7);
  });

  it("each entry has a boolean won field", () => {
    const result = getForm(0, 5);
    result.forEach((f) => expect(typeof f.won).toBe("boolean"));
  });

  it("returns correct last 3 results for Макиато (id=0)", () => {
    // Last 3 matches: M22 T6 away W 3:0, M17 T7 home W 3:0, M25 T7 home W 3:0
    const result = getForm(0, 3);
    expect(result.map((f) => f.won)).toEqual([true, true, true]);
  });

  it("returns correct last 5 results for Макиато (id=0)", () => {
    // All 7: M1 W, M8 W, M9 W, M15 L, M22 W, M17 W, M25 W
    // Last 5: M9 W, M15 L, M22 W, M17 W, M25 W
    const result = getForm(0, 5);
    expect(result.map((f) => f.won)).toEqual([true, false, true, true, true]);
  });
});
```

- [ ] **Step 2: Run tests to confirm 5 failures**

```bash
npx vitest run src/test/stats.test.ts
```

Expected: 5 failures (getForm not exported).

- [ ] **Step 3: Add `FormEntry` interface and `getForm` to `src/lib/stats.ts`**

Append after the `getScoringPatterns` function:

```ts
export interface FormEntry {
  won: boolean;
}

export function getForm(teamId: number, n: number): FormEntry[] {
  const played = getTeamMatches(teamId).filter((m) => m.played);
  return played.slice(-n).map((m) => {
    const r = m.result!;
    const won = m.homeId === teamId ? r.setsHome > r.setsAway : r.setsAway > r.setsHome;
    return { won };
  });
}
```

- [ ] **Step 4: Run tests to confirm all pass**

```bash
npx vitest run src/test/stats.test.ts
```

Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/lib/stats.ts src/test/stats.test.ts
git commit -m "feat: add getForm() to stats.ts for team form display"
```

---

## Task 5: Add `getAvgSetScore()` to `src/lib/stats.ts` (TDD)

**Files:**
- Modify: `src/test/stats.test.ts`
- Modify: `src/lib/stats.ts`

- [ ] **Step 1: Write failing tests**

Add `getAvgSetScore` to the import at the top of `src/test/stats.test.ts`:

```ts
import { getStreaks, getSetPerformance, getComebackStats, getScoringPatterns, getPositionHistory, getForm, getAvgSetScore } from "@/lib/stats";
```

Append at the end of `src/test/stats.test.ts`:

```ts
describe("getAvgSetScore", () => {
  it("returns object with all four required fields", () => {
    const result = getAvgSetScore(0);
    expect(result).toHaveProperty("avgScoredWon");
    expect(result).toHaveProperty("avgConcededWon");
    expect(result).toHaveProperty("avgScoredLost");
    expect(result).toHaveProperty("avgConcededLost");
  });

  it("avgScoredWon > avgConcededWon for a winning team", () => {
    // By definition: in a won set, scored > conceded
    const result = getAvgSetScore(0);
    expect(result.avgScoredWon).toBeGreaterThan(result.avgConcededWon);
  });

  it("avgScoredLost < avgConcededLost for a team with losses", () => {
    // By definition: in a lost set, conceded > scored
    const result = getAvgSetScore(0);
    expect(result.avgScoredLost).toBeLessThan(result.avgConcededLost);
  });

  it("avgScoredWon is exactly 25.0 for Макиато (id=0)", () => {
    // All 15 of Макиато's won sets end with Макиато scoring exactly 25
    const result = getAvgSetScore(0);
    expect(result.avgScoredWon).toBeCloseTo(25.0, 1);
  });

  it("all values are non-negative for all teams", () => {
    for (let id = 0; id < 8; id++) {
      const result = getAvgSetScore(id);
      expect(result.avgScoredWon).toBeGreaterThanOrEqual(0);
      expect(result.avgConcededWon).toBeGreaterThanOrEqual(0);
      expect(result.avgScoredLost).toBeGreaterThanOrEqual(0);
      expect(result.avgConcededLost).toBeGreaterThanOrEqual(0);
    }
  });
});
```

- [ ] **Step 2: Run tests to confirm 5 failures**

```bash
npx vitest run src/test/stats.test.ts
```

Expected: 5 failures (getAvgSetScore not exported).

- [ ] **Step 3: Add `AvgSetScore` interface and `getAvgSetScore` to `src/lib/stats.ts`**

Append after the `getForm` function:

```ts
export interface AvgSetScore {
  avgScoredWon: number;
  avgConcededWon: number;
  avgScoredLost: number;
  avgConcededLost: number;
}

export function getAvgSetScore(teamId: number): AvgSetScore {
  const played = getTeamMatches(teamId).filter((m) => m.played);
  let wonScored = 0, wonConceded = 0, wonCount = 0;
  let lostScored = 0, lostConceded = 0, lostCount = 0;

  for (const m of played) {
    const isHome = m.homeId === teamId;
    for (const s of m.result!.setScores) {
      const scored = isHome ? s.home : s.away;
      const conceded = isHome ? s.away : s.home;
      if (scored > conceded) {
        wonScored += scored;
        wonConceded += conceded;
        wonCount++;
      } else {
        lostScored += scored;
        lostConceded += conceded;
        lostCount++;
      }
    }
  }

  return {
    avgScoredWon: wonCount > 0 ? wonScored / wonCount : 0,
    avgConcededWon: wonCount > 0 ? wonConceded / wonCount : 0,
    avgScoredLost: lostCount > 0 ? lostScored / lostCount : 0,
    avgConcededLost: lostCount > 0 ? lostConceded / lostCount : 0,
  };
}
```

- [ ] **Step 4: Run tests to confirm all pass**

```bash
npx vitest run src/test/stats.test.ts
```

Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/lib/stats.ts src/test/stats.test.ts
git commit -m "feat: add getAvgSetScore() to stats.ts for per-team set score breakdown"
```

---

## Task 6: Restructure `AnalyticsPage.vue` into 3 tabs

Moves all existing 9 sections into the correct tabs. No new sections added yet. Команды tab shows blank content until Tasks 9–12.

**Files:**
- Modify: `src/pages/AnalyticsPage.vue`

- [ ] **Step 1: Add `ref` import and `activeTab` to the script**

In `<script setup>`, prepend `import { ref } from "vue";` before the existing imports:

```ts
import { ref } from "vue";
import { teams, matches, getTeam } from "@/data/league";
```

Add after `const leagueRecords = getLeagueRecords();` (last line in the script):

```ts
const activeTab = ref<"summary" | "stats" | "teams">("summary");
```

- [ ] **Step 2: Replace the entire `<template>` section**

Replace everything between `<template>` and `</template>` with:

```html
  <div class="animate-fade-in space-y-6">

    <!-- Tab bar -->
    <div class="flex gap-1 border-b border-border">
      <button
        v-for="tab in [
          { id: 'summary', label: 'Сводка' },
          { id: 'stats', label: 'Статистика' },
          { id: 'teams', label: 'Команды' },
        ]"
        :key="tab.id"
        @click="activeTab = tab.id as typeof activeTab.value"
        class="px-4 py-2 text-sm font-medium transition-colors relative -mb-px"
        :class="activeTab === tab.id
          ? 'text-foreground border-b-2 border-primary'
          : 'text-muted-foreground hover:text-foreground'"
      >{{ tab.label }}</button>
    </div>

    <!-- ══════════ СВОДКА ══════════ -->
    <template v-if="activeTab === 'summary'">

      <!-- 1. Обзор лиги -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div class="bg-secondary/40 rounded-lg p-3 text-center">
          <div class="font-display text-3xl font-bold text-foreground">{{ playedCount }}</div>
          <div class="text-[10px] text-muted-foreground mt-0.5">из {{ matches.length }} матчей</div>
        </div>
        <div class="bg-secondary/40 rounded-lg p-3 text-center">
          <div class="font-display text-3xl font-bold text-foreground">{{ playedCount * 3 }}</div>
          <div class="text-[10px] text-muted-foreground mt-0.5">партий сыграно</div>
        </div>
        <div class="bg-secondary/40 rounded-lg p-3 text-center">
          <div class="font-display text-3xl font-bold text-foreground">{{ totalPoints }}</div>
          <div class="text-[10px] text-muted-foreground mt-0.5">очков разыграно</div>
        </div>
        <div class="bg-secondary/40 rounded-lg p-3 text-center">
          <div class="font-display text-3xl font-bold text-foreground">{{ avgPointsPerSet }}</div>
          <div class="text-[10px] text-muted-foreground mt-0.5">очков в партии (avg)</div>
        </div>
      </div>

      <template v-if="playedCount > 0">

        <!-- 2. Результаты матчей -->
        <Card>
          <CardHeader class="pb-2">
            <CardTitle class="text-sm font-display text-muted-foreground normal-case tracking-normal">Результаты матчей</CardTitle>
          </CardHeader>
          <CardContent class="space-y-3">
            <div class="grid grid-cols-2 gap-3">
              <div class="bg-sport-win/10 rounded-lg p-3 text-center">
                <div class="text-[10px] font-semibold text-sport-win mb-0.5">Разгром</div>
                <div class="font-display text-3xl font-bold text-foreground">{{ count30 }}</div>
                <div class="text-xs font-mono font-bold text-sport-win/70 mt-0.5">3:0</div>
                <div class="text-[10px] text-muted-foreground mt-0.5">{{ pct30 }}% матчей</div>
              </div>
              <div class="bg-secondary/40 rounded-lg p-3 text-center">
                <div class="text-[10px] font-semibold text-muted-foreground mb-0.5">Борьба</div>
                <div class="font-display text-3xl font-bold text-foreground">{{ count21 }}</div>
                <div class="text-xs font-mono font-bold text-muted-foreground/70 mt-0.5">2:1</div>
                <div class="text-[10px] text-muted-foreground mt-0.5">{{ pct21 }}% матчей</div>
              </div>
            </div>
            <Progress :model-value="pct30" class="h-1.5 [&>div]:bg-sport-win" />
            <div class="flex justify-between text-[10px] text-muted-foreground">
              <span>Разгромы {{ pct30 }}%</span>
              <span>Борьба {{ pct21 }}%</span>
            </div>
          </CardContent>
        </Card>

        <!-- 3. Дома / В гостях -->
        <Card>
          <CardHeader class="pb-2">
            <CardTitle class="text-sm font-display text-muted-foreground normal-case tracking-normal">Дома / В гостях</CardTitle>
          </CardHeader>
          <CardContent class="space-y-3">
            <div class="flex items-end gap-4 flex-wrap mb-1">
              <div class="text-center">
                <div class="font-display text-3xl font-bold text-sport-win">{{ homeWins }}</div>
                <div class="text-[10px] text-muted-foreground mt-0.5">побед хозяев</div>
              </div>
              <div class="text-xl text-muted-foreground/30 mb-1 font-sans">:</div>
              <div class="text-center">
                <div class="font-display text-3xl font-bold text-accent">{{ awayWins }}</div>
                <div class="text-[10px] text-muted-foreground mt-0.5">побед гостей</div>
              </div>
              <div class="flex-1" />
              <div class="text-center">
                <div class="font-display text-xl font-bold text-foreground">{{ homeWinPct }}%</div>
                <div class="text-[10px] text-muted-foreground mt-0.5">преимущество дома</div>
              </div>
            </div>
            <Progress :model-value="homeWinPct" class="h-1.5 [&>div]:bg-sport-win" />
            <div class="flex justify-between text-[10px] text-muted-foreground">
              <span>Хозяева {{ homeWinPct }}%</span>
              <span>Гости {{ 100 - homeWinPct }}%</span>
            </div>
            <Separator />
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div class="bg-sport-win/10 rounded-lg p-2.5 text-center">
                <div class="text-[10px] text-sport-win font-semibold">Хозяева 3:0</div>
                <div class="font-display text-2xl font-bold text-foreground mt-0.5">{{ home30 }}</div>
              </div>
              <div class="bg-sport-win/5 rounded-lg p-2.5 text-center">
                <div class="text-[10px] text-sport-win font-semibold">Хозяева 2:1</div>
                <div class="font-display text-2xl font-bold text-foreground mt-0.5">{{ home21 }}</div>
              </div>
              <div class="bg-accent/5 rounded-lg p-2.5 text-center">
                <div class="text-[10px] text-accent font-semibold">Гости 2:1</div>
                <div class="font-display text-2xl font-bold text-foreground mt-0.5">{{ away21 }}</div>
              </div>
              <div class="bg-accent/10 rounded-lg p-2.5 text-center">
                <div class="text-[10px] text-accent font-semibold">Гости 3:0</div>
                <div class="font-display text-2xl font-bold text-foreground mt-0.5">{{ away30 }}</div>
              </div>
            </div>
            <Separator />
            <div class="flex justify-between text-[11px] text-muted-foreground">
              <span>Ср. очков за партию хозяев: <span class="font-semibold text-foreground">{{ avgHomePtsPerSet }}</span></span>
              <span>гостей: <span class="font-semibold text-foreground">{{ avgAwayPtsPerSet }}</span></span>
            </div>
          </CardContent>
        </Card>

        <!-- 4. Лидеры лиги -->
        <Card>
          <CardHeader class="pb-2">
            <CardTitle class="text-sm font-display text-muted-foreground normal-case tracking-normal">Лидеры лиги</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div
                v-for="leader in leagueLeaders"
                :key="leader.label"
                class="flex items-center gap-2 bg-secondary/30 rounded-lg px-3 py-2"
              >
                <span class="text-[10px] text-muted-foreground flex-1 min-w-0">{{ leader.label }}</span>
                <div class="flex flex-col gap-0.5 items-end">
                  <div v-for="t in leader.teams" :key="t.id" class="flex items-center gap-1.5">
                    <Avatar shape="square" class="w-5 h-5 text-[8px] flex-shrink-0" :style="{ backgroundColor: `hsl(${t.color})` }">
                      <AvatarFallback class="bg-transparent text-primary-foreground font-bold">{{ t.short.slice(0,1) }}</AvatarFallback>
                    </Avatar>
                    <span class="text-xs font-medium">{{ t.short }}</span>
                  </div>
                </div>
                <span class="font-display text-base font-bold text-foreground flex-shrink-0">{{ leader.value }}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- 5. Рекорды лиги -->
        <Card v-if="leagueRecords.length > 0">
          <CardHeader class="pb-3">
            <CardTitle class="text-sm font-display text-muted-foreground flex items-center gap-2 normal-case tracking-normal">
              <Trophy class="w-4 h-4" aria-hidden="true" /> Рекорды лиги
            </CardTitle>
          </CardHeader>
          <CardContent class="pt-0">
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <div
                v-for="r in leagueRecords"
                :key="r.label"
                class="bg-secondary/40 rounded-lg p-2.5"
              >
                <div class="text-[10px] text-muted-foreground">{{ r.label }}</div>
                <div class="font-display text-xl font-bold text-foreground mt-0.5">{{ r.value }}</div>
                <div class="text-[10px] text-muted-foreground/70 mt-0.5 leading-tight">{{ r.detail }}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- 6. Матрица результатов — added in Task 7 -->

      </template>
      <template v-else>
        <div class="text-center py-16 text-muted-foreground text-sm">Матчи ещё не сыграны</div>
      </template>

    </template>

    <!-- ══════════ СТАТИСТИКА ══════════ -->
    <template v-else-if="activeTab === 'stats'">
      <template v-if="playedCount > 0">

        <!-- 1. Характер партий -->
        <Card>
          <CardHeader class="pb-2">
            <CardTitle class="text-sm font-display text-muted-foreground normal-case tracking-normal">Характер партий</CardTitle>
          </CardHeader>
          <CardContent class="space-y-3">
            <div class="grid grid-cols-3 gap-3">
              <div class="bg-secondary/40 rounded-lg p-3 text-center">
                <div class="font-display text-2xl font-bold text-foreground">{{ leagueCloseSets }}</div>
                <div class="text-[10px] text-muted-foreground mt-0.5">напряжённых</div>
                <div class="text-[10px] text-muted-foreground">≤3 очка ({{ pctClose }}%)</div>
              </div>
              <div class="bg-secondary/40 rounded-lg p-3 text-center">
                <div class="font-display text-2xl font-bold text-foreground">{{ leagueDomSets }}</div>
                <div class="text-[10px] text-muted-foreground mt-0.5">разгромных</div>
                <div class="text-[10px] text-muted-foreground">≥10 очков ({{ pctDom }}%)</div>
              </div>
              <div class="bg-secondary/40 rounded-lg p-3 text-center">
                <div class="font-display text-2xl font-bold text-foreground">{{ leagueAvgMargin }}</div>
                <div class="text-[10px] text-muted-foreground mt-0.5">средняя разница</div>
                <div class="text-[10px] text-muted-foreground">в партии</div>
              </div>
            </div>
            <Separator />
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div class="flex items-center gap-2 bg-secondary/30 rounded-lg px-3 py-2">
                <div class="text-[10px] text-muted-foreground flex-1">Больше всего напряжённых</div>
                <div class="flex flex-col gap-0.5 items-end">
                  <div v-for="t in mostCloseTeams" :key="t.team.id" class="flex items-center gap-1.5">
                    <Avatar shape="square" class="w-5 h-5 text-[8px] flex-shrink-0" :style="{ backgroundColor: `hsl(${t.team.color})` }">
                      <AvatarFallback class="bg-transparent text-primary-foreground font-bold">{{ t.team.short.slice(0,1) }}</AvatarFallback>
                    </Avatar>
                    <span class="text-xs font-medium">{{ t.team.short }}</span>
                  </div>
                </div>
                <span class="font-display text-sm font-bold text-foreground">{{ mostCloseTeams[0].closeSets }}</span>
              </div>
              <div class="flex items-center gap-2 bg-secondary/30 rounded-lg px-3 py-2">
                <div class="text-[10px] text-muted-foreground flex-1">Больше всего разгромных</div>
                <div class="flex flex-col gap-0.5 items-end">
                  <div v-for="t in mostDomTeams" :key="t.team.id" class="flex items-center gap-1.5">
                    <Avatar shape="square" class="w-5 h-5 text-[8px] flex-shrink-0" :style="{ backgroundColor: `hsl(${t.team.color})` }">
                      <AvatarFallback class="bg-transparent text-primary-foreground font-bold">{{ t.team.short.slice(0,1) }}</AvatarFallback>
                    </Avatar>
                    <span class="text-xs font-medium">{{ t.team.short }}</span>
                  </div>
                </div>
                <span class="font-display text-sm font-bold text-foreground">{{ mostDomTeams[0].dominantSets }}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- 2. Игра по партиям (лига) -->
        <Card>
          <CardHeader class="pb-2">
            <CardTitle class="text-sm font-display text-muted-foreground normal-case tracking-normal">Игра по партиям (лига)</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="grid grid-cols-3 gap-3">
              <div
                v-for="s in leagueSetStats"
                :key="s.setNum"
                class="text-center bg-secondary/40 rounded-lg p-3"
              >
                <div class="text-[10px] text-muted-foreground mb-1.5">Партия {{ s.setNum }}</div>
                <div :class="['font-display text-2xl font-bold', s.homeWinRate >= 0.5 ? 'text-sport-win' : 'text-sport-loss']">
                  {{ Math.round(s.homeWinRate * 100) }}%
                </div>
                <div class="text-[10px] text-muted-foreground mt-0.5 mb-2">хозяев</div>
                <div class="text-[11px] font-mono">
                  <span class="text-foreground">{{ s.avgPoints }}</span>
                </div>
                <div class="text-[9px] text-muted-foreground mt-0.5">avg очков</div>
                <div class="text-[11px] font-mono mt-1">
                  <span class="text-muted-foreground">±{{ s.avgMargin }}</span>
                </div>
                <div class="text-[9px] text-muted-foreground mt-0.5">avg разница</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- 3. Решающие партии -->
        <Card>
          <CardHeader class="pb-2">
            <CardTitle class="text-sm font-display text-muted-foreground normal-case tracking-normal">Решающие партии</CardTitle>
          </CardHeader>
          <CardContent class="space-y-3">
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div class="bg-secondary/40 rounded-lg p-3 text-center">
                <div class="font-display text-2xl font-bold text-foreground">{{ decisiveCount }}</div>
                <div class="text-[10px] text-muted-foreground mt-0.5">матчей 2:1</div>
                <div class="text-[10px] text-muted-foreground">{{ decisivePct }}% всех</div>
              </div>
              <div class="bg-sport-win/10 rounded-lg p-3 text-center">
                <div class="font-display text-2xl font-bold text-sport-win">{{ totalComebacks }}</div>
                <div class="text-[10px] text-muted-foreground mt-0.5">камбэков</div>
                <div class="text-[10px] text-muted-foreground">по лиге</div>
              </div>
              <div class="bg-sport-loss/10 rounded-lg p-3 text-center">
                <div class="font-display text-2xl font-bold text-sport-loss">{{ totalBlownLeads }}</div>
                <div class="text-[10px] text-muted-foreground mt-0.5">упущ. побед</div>
                <div class="text-[10px] text-muted-foreground">по лиге</div>
              </div>
              <div class="bg-secondary/40 rounded-lg p-3 text-center">
                <div class="font-display text-2xl font-bold text-foreground">{{ comebackRate }}%</div>
                <div class="text-[10px] text-muted-foreground mt-0.5">камбэков</div>
                <div class="text-[10px] text-muted-foreground">от матчей 2:1</div>
              </div>
            </div>
            <template v-if="decisiveCount > 0">
              <Separator />
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div v-if="mostComebackTeams.length" class="flex items-center gap-2 bg-sport-win/10 rounded-lg px-3 py-2">
                  <div class="text-[10px] text-muted-foreground flex-1">Лидер по камбэкам</div>
                  <div class="flex flex-col gap-0.5 items-end">
                    <div v-for="t in mostComebackTeams" :key="t.team.id" class="flex items-center gap-1.5">
                      <Avatar shape="square" class="w-5 h-5 text-[8px] flex-shrink-0" :style="{ backgroundColor: `hsl(${t.team.color})` }">
                        <AvatarFallback class="bg-transparent text-primary-foreground font-bold">{{ t.team.short.slice(0,1) }}</AvatarFallback>
                      </Avatar>
                      <span class="text-xs font-medium">{{ t.team.short }}</span>
                    </div>
                  </div>
                  <span class="font-display text-sm font-bold text-sport-win">{{ mostComebackTeams[0].comebacks }}</span>
                </div>
                <div v-if="mostBlownTeams.length" class="flex items-center gap-2 bg-sport-loss/10 rounded-lg px-3 py-2">
                  <div class="text-[10px] text-muted-foreground flex-1">Больше всех упущено</div>
                  <div class="flex flex-col gap-0.5 items-end">
                    <div v-for="t in mostBlownTeams" :key="t.team.id" class="flex items-center gap-1.5">
                      <Avatar shape="square" class="w-5 h-5 text-[8px] flex-shrink-0" :style="{ backgroundColor: `hsl(${t.team.color})` }">
                        <AvatarFallback class="bg-transparent text-primary-foreground font-bold">{{ t.team.short.slice(0,1) }}</AvatarFallback>
                      </Avatar>
                      <span class="text-xs font-medium">{{ t.team.short }}</span>
                    </div>
                  </div>
                  <span class="font-display text-sm font-bold text-sport-loss">{{ mostBlownTeams[0].blownLeads }}</span>
                </div>
              </div>
            </template>
          </CardContent>
        </Card>

        <!-- 4. Серии сезона -->
        <Card>
          <CardHeader class="pb-2">
            <CardTitle class="text-sm font-display text-muted-foreground normal-case tracking-normal">Серии сезона</CardTitle>
          </CardHeader>
          <CardContent class="space-y-3">
            <div class="grid grid-cols-2 gap-3">
              <div class="bg-sport-win/10 rounded-lg p-3 text-center">
                <div class="text-[10px] text-sport-win font-semibold mb-1">Лучшая серия побед</div>
                <div class="font-display text-2xl font-bold text-sport-win">{{ longestWinStreaks[0].longestWin }}В</div>
                <div v-for="s in longestWinStreaks" :key="s.team.id" class="flex items-center gap-1.5 justify-center mt-1.5">
                  <Avatar shape="square" class="w-4 h-4 text-[7px]" :style="{ backgroundColor: `hsl(${s.team.color})` }">
                    <AvatarFallback class="bg-transparent text-primary-foreground font-bold">{{ s.team.short.slice(0,1) }}</AvatarFallback>
                  </Avatar>
                  <span class="text-xs text-muted-foreground">{{ s.team.short }}</span>
                </div>
              </div>
              <div class="bg-sport-loss/10 rounded-lg p-3 text-center">
                <div class="text-[10px] text-sport-loss font-semibold mb-1">Худшая серия поражений</div>
                <div class="font-display text-2xl font-bold text-sport-loss">{{ longestLossStreaks[0].longestLoss }}П</div>
                <div v-for="s in longestLossStreaks" :key="s.team.id" class="flex items-center gap-1.5 justify-center mt-1.5">
                  <Avatar shape="square" class="w-4 h-4 text-[7px]" :style="{ backgroundColor: `hsl(${s.team.color})` }">
                    <AvatarFallback class="bg-transparent text-primary-foreground font-bold">{{ s.team.short.slice(0,1) }}</AvatarFallback>
                  </Avatar>
                  <span class="text-xs text-muted-foreground">{{ s.team.short }}</span>
                </div>
              </div>
            </div>
            <template v-if="currentStreaks.length > 0">
              <Separator />
              <p class="text-xs text-muted-foreground">Текущие серии</p>
              <div class="space-y-1.5">
                <div
                  v-for="s in currentStreaks"
                  :key="s.team.id"
                  class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/30"
                >
                  <Avatar shape="square" class="w-5 h-5 text-[8px] flex-shrink-0" :style="{ backgroundColor: `hsl(${s.team.color})` }">
                    <AvatarFallback class="bg-transparent text-primary-foreground font-bold">{{ s.team.short.slice(0,1) }}</AvatarFallback>
                  </Avatar>
                  <span class="text-xs font-medium flex-1 truncate">{{ s.team.short }}</span>
                  <span
                    class="text-xs font-bold px-2 py-0.5 rounded"
                    :class="s.current!.type === 'win' ? 'bg-sport-win/20 text-sport-win' : 'bg-sport-loss/20 text-sport-loss'"
                  >{{ s.current!.count }}{{ s.current!.type === 'win' ? 'В' : 'П' }} серия</span>
                </div>
              </div>
            </template>
          </CardContent>
        </Card>

        <!-- 5. Распределение счётов — added in Task 8 -->

      </template>
      <template v-else>
        <div class="text-center py-16 text-muted-foreground text-sm">Матчи ещё не сыграны</div>
      </template>
    </template>

    <!-- ══════════ КОМАНДЫ ══════════ -->
    <template v-else>
      <template v-if="playedCount > 0">
        <!-- sections 1–4 added in Tasks 9–12 -->
      </template>
      <template v-else>
        <div class="text-center py-16 text-muted-foreground text-sm">Матчи ещё не сыграны</div>
      </template>
    </template>

  </div>
```

- [ ] **Step 3: Run lint**

```bash
npm run lint
```

Expected: no errors.

- [ ] **Step 4: Verify in browser**

```bash
npm run dev
```

Open `http://localhost:8080/#/analytics`. Confirm:
- Tab bar shows 3 tabs
- Сводка: Обзор лиги, Результаты матчей, Дома/В гостях, Лидеры лиги, Рекорды лиги
- Статистика: Характер партий, Игра по партиям, Решающие партии, Серии
- Команды: blank (content added in Tasks 9–12)

- [ ] **Step 5: Commit**

```bash
git add src/pages/AnalyticsPage.vue
git commit -m "feat: restructure AnalyticsPage into 3 tabs (Сводка/Статистика/Команды)"
```

---

## Task 7: Add Матрица результатов to Сводка tab

**Files:**
- Modify: `src/pages/AnalyticsPage.vue`

- [ ] **Step 1: Add `resultMatrix` to the script**

Add after `const leagueRecords = getLeagueRecords();` in `<script setup>`:

```ts
// ── Матрица результатов ──────────────────────────────────────────────────────
type MatrixCell = { homeWon: boolean; score: string } | null | "self";

const resultMatrix: MatrixCell[][] = teams.map((homeTeam) =>
  teams.map((awayTeam): MatrixCell => {
    if (homeTeam.id === awayTeam.id) return "self";
    const m = played.find(
      (match) => match.homeId === homeTeam.id && match.awayId === awayTeam.id,
    );
    if (!m) return null;
    const r = m.result!;
    return { homeWon: r.setsHome > r.setsAway, score: `${r.setsHome}:${r.setsAway}` };
  }),
);
```

- [ ] **Step 2: Add section to the Сводка tab template**

Replace `<!-- 6. Матрица результатов — added in Task 7 -->` with:

```html
        <!-- 6. Матрица результатов -->
        <Card>
          <CardHeader class="pb-2">
            <CardTitle class="text-sm font-display text-muted-foreground normal-case tracking-normal">Матрица результатов</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="overflow-x-auto">
              <table class="w-full text-xs border-collapse">
                <thead>
                  <tr>
                    <th class="p-1 text-muted-foreground text-left font-normal text-[10px] min-w-[40px]">↓ Хоз / Гость →</th>
                    <th
                      v-for="t in teams"
                      :key="t.id"
                      class="p-1 text-center font-semibold text-[10px] min-w-[40px]"
                      :style="{ color: `hsl(${t.color})` }"
                    >{{ t.short }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(row, ri) in resultMatrix" :key="ri">
                    <td
                      class="p-1 font-semibold text-[10px]"
                      :style="{ color: `hsl(${teams[ri].color})` }"
                    >{{ teams[ri].short }}</td>
                    <td v-for="(cell, ci) in row" :key="ci" class="p-1 text-center">
                      <span v-if="cell === 'self'" class="text-muted-foreground/30 text-[11px]">—</span>
                      <span v-else-if="cell === null" class="text-muted-foreground/20 text-[11px]">·</span>
                      <span
                        v-else
                        class="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold font-mono"
                        :class="cell.homeWon ? 'bg-sport-win/20 text-sport-win' : 'bg-sport-loss/20 text-sport-loss'"
                      >{{ cell.score }}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p class="text-[10px] text-muted-foreground mt-2">Строка = хозяева, столбец = гости. Зелёный = победа хозяев.</p>
          </CardContent>
        </Card>
```

- [ ] **Step 3: Run lint**

```bash
npm run lint
```

Expected: no errors.

- [ ] **Step 4: Verify in browser**

Open Сводка tab. Confirm the 8×8 table has green cells for home wins, red for home losses, `—` on diagonal, and `·` for unplayed matchups.

- [ ] **Step 5: Commit**

```bash
git add src/pages/AnalyticsPage.vue
git commit -m "feat: add results matrix to Сводка tab"
```

---

## Task 8: Add Распределение счётов to Статистика tab

**Files:**
- Modify: `src/pages/AnalyticsPage.vue`

- [ ] **Step 1: Add ECharts imports to the script**

In `<script setup>`, add after `import { Trophy } from "lucide-vue-next";`:

```ts
import { use } from "echarts/core";
import { BarChart, LineChart } from "echarts/charts";
import { GridComponent, LegendComponent, TooltipComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import VChart from "vue-echarts";

use([BarChart, LineChart, GridComponent, LegendComponent, TooltipComponent, CanvasRenderer]);
```

- [ ] **Step 2: Add score distribution data to the script**

Add after `const resultMatrix` const:

```ts
// ── Распределение счётов ─────────────────────────────────────────────────────
const scoreDistribution = (() => {
  const counts: Record<string, number> = {};
  for (const m of played) {
    for (const s of m.result!.setScores) {
      const key = `${s.home}:${s.away}`;
      counts[key] = (counts[key] || 0) + 1;
    }
  }
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
})();

const scoreDistChartOption = {
  backgroundColor: "transparent",
  grid: { left: 10, right: 16, top: 8, bottom: 8, containLabel: true },
  xAxis: {
    type: "value",
    axisLabel: { color: "#888", fontSize: 10 },
    splitLine: { lineStyle: { color: "#2a2a3a" } },
  },
  yAxis: {
    type: "category",
    data: scoreDistribution.map(([score]) => score).reverse(),
    axisLabel: { color: "#aaa", fontSize: 10, fontFamily: "monospace" },
    axisLine: { lineStyle: { color: "#333" } },
  },
  series: [
    {
      type: "bar",
      data: scoreDistribution
        .map(([score, count]) => ({
          value: count,
          itemStyle: {
            color:
              Number(score.split(":")[0]) > Number(score.split(":")[1])
                ? "hsl(142, 70%, 50%)"
                : "hsl(0, 70%, 62%)",
          },
        }))
        .reverse(),
    },
  ],
  tooltip: { trigger: "axis" },
};
```

- [ ] **Step 3: Add section to the Статистика tab template**

Replace `<!-- 5. Распределение счётов — added in Task 8 -->` with:

```html
        <!-- 5. Распределение счётов партий -->
        <Card v-if="scoreDistribution.length > 0">
          <CardHeader class="pb-2">
            <CardTitle class="text-sm font-display text-muted-foreground normal-case tracking-normal">Распределение счётов партий</CardTitle>
          </CardHeader>
          <CardContent>
            <VChart :option="scoreDistChartOption" style="height: 260px" autoresize />
          </CardContent>
        </Card>
```

- [ ] **Step 4: Run lint and build**

```bash
npm run lint && npm run build
```

Expected: no TypeScript errors, bundle completes with ECharts tree-shaken.

- [ ] **Step 5: Verify in browser**

Open Статистика tab. Confirm the horizontal bar chart renders with green bars (home wins) and red bars (away wins), most frequent set scores at the top.

- [ ] **Step 6: Commit**

```bash
git add src/pages/AnalyticsPage.vue
git commit -m "feat: add score distribution bar chart to Статистика tab"
```

---

## Task 9: Add Форма команд to Команды tab

**Files:**
- Modify: `src/pages/AnalyticsPage.vue`

- [ ] **Step 1: Add `getForm` import and `teamForms` data to the script**

Add `getForm` to the stats import line. Change:

```ts
import { getStreaks, getComebackStats, getScoringPatterns } from "@/lib/stats";
```

To:

```ts
import { getStreaks, getComebackStats, getScoringPatterns, getForm } from "@/lib/stats";
```

Add after `scoreDistChartOption`:

```ts
// ── Форма команд ─────────────────────────────────────────────────────────────
const teamForms = standings.map((s) => ({
  team: s.team,
  form: getForm(s.team.id, 5),
}));
```

- [ ] **Step 2: Add section to the Команды tab template**

Replace `<!-- sections 1–4 added in Tasks 9–12 -->` with:

```html
        <!-- 1. Форма команд -->
        <Card>
          <CardHeader class="pb-2">
            <CardTitle class="text-sm font-display text-muted-foreground normal-case tracking-normal">Форма команд</CardTitle>
          </CardHeader>
          <CardContent class="space-y-2">
            <div
              v-for="tf in teamForms"
              :key="tf.team.id"
              class="flex items-center gap-3 px-2 py-1.5 rounded-lg bg-secondary/20"
            >
              <Avatar shape="square" class="w-6 h-6 text-[9px] flex-shrink-0" :style="{ backgroundColor: `hsl(${tf.team.color})` }">
                <AvatarFallback class="bg-transparent text-primary-foreground font-bold">{{ tf.team.short.slice(0, 2) }}</AvatarFallback>
              </Avatar>
              <span class="text-xs font-medium w-10 flex-shrink-0">{{ tf.team.short }}</span>
              <div class="flex gap-1">
                <span
                  v-for="(f, i) in tf.form"
                  :key="i"
                  class="inline-flex items-center justify-center w-6 h-6 rounded text-[10px] font-bold"
                  :class="f.won ? 'bg-sport-win/20 text-sport-win' : 'bg-sport-loss/20 text-sport-loss'"
                >{{ f.won ? 'В' : 'П' }}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- sections 2–4 added in Tasks 10–12 -->
```

- [ ] **Step 3: Run lint**

```bash
npm run lint
```

Expected: no errors.

- [ ] **Step 4: Verify in browser**

Open Команды tab. Confirm all 8 teams show with up to 5 В/П chips, sorted by standings position (1st place at top).

- [ ] **Step 5: Commit**

```bash
git add src/pages/AnalyticsPage.vue
git commit -m "feat: add team form chips to Команды tab"
```

---

## Task 10: Add Эффективность по партиям to Команды tab

**Files:**
- Modify: `src/pages/AnalyticsPage.vue`

- [ ] **Step 1: Add `getSetPerformance` import and `teamSetEfficiency` data**

Add `getSetPerformance` to the stats import. Change:

```ts
import { getStreaks, getComebackStats, getScoringPatterns, getForm } from "@/lib/stats";
```

To:

```ts
import { getStreaks, getComebackStats, getScoringPatterns, getForm, getSetPerformance } from "@/lib/stats";
```

Add after `teamForms`:

```ts
// ── Эффективность по партиям ─────────────────────────────────────────────────
const teamSetEfficiency = standings.map((s) => ({
  team: s.team,
  sets: getSetPerformance(s.team.id),
}));
```

- [ ] **Step 2: Add section to the Команды tab template**

Replace `<!-- sections 2–4 added in Tasks 10–12 -->` with:

```html
        <!-- 2. Эффективность по партиям -->
        <Card>
          <CardHeader class="pb-2">
            <CardTitle class="text-sm font-display text-muted-foreground normal-case tracking-normal">Эффективность по партиям</CardTitle>
          </CardHeader>
          <CardContent>
            <table class="w-full text-xs">
              <thead>
                <tr>
                  <th class="text-left py-1 pr-2 text-[10px] text-muted-foreground font-normal">Команда</th>
                  <th class="text-center py-1 px-2 text-[10px] text-muted-foreground font-normal">П1</th>
                  <th class="text-center py-1 px-2 text-[10px] text-muted-foreground font-normal">П2</th>
                  <th class="text-center py-1 px-2 text-[10px] text-muted-foreground font-normal">П3</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="te in teamSetEfficiency"
                  :key="te.team.id"
                  class="border-t border-border/30"
                >
                  <td class="py-1.5 pr-2 font-medium text-[11px]" :style="{ color: `hsl(${te.team.color})` }">
                    {{ te.team.short }}
                  </td>
                  <td
                    v-for="s in te.sets"
                    :key="s.setNum"
                    class="py-1.5 px-2 text-center font-bold text-[11px]"
                    :class="s.won >= s.lost ? 'text-sport-win' : 'text-sport-loss'"
                  >
                    {{ s.won + s.lost > 0 ? Math.round((s.won / (s.won + s.lost)) * 100) : 0 }}%
                  </td>
                </tr>
              </tbody>
            </table>
          </CardContent>
        </Card>

        <!-- sections 3–4 added in Tasks 11–12 -->
```

- [ ] **Step 3: Run lint**

```bash
npm run lint
```

Expected: no errors.

- [ ] **Step 4: Verify in browser**

Open Команды tab. Confirm table shows win % per set per team. Values ≥50% in green, <50% in red.

- [ ] **Step 5: Commit**

```bash
git add src/pages/AnalyticsPage.vue
git commit -m "feat: add set efficiency table to Команды tab"
```

---

## Task 11: Add Динамика позиций to Команды tab

**Files:**
- Modify: `src/pages/AnalyticsPage.vue`

- [ ] **Step 1: Add `getPositionHistory` import and chart data**

Add `getPositionHistory` to the stats import. Change:

```ts
import { getStreaks, getComebackStats, getScoringPatterns, getForm, getSetPerformance } from "@/lib/stats";
```

To:

```ts
import { getStreaks, getComebackStats, getScoringPatterns, getForm, getSetPerformance, getPositionHistory } from "@/lib/stats";
```

Add after `teamSetEfficiency`:

```ts
// ── Динамика позиций ─────────────────────────────────────────────────────────
const posHistoryChartOption = (() => {
  const playedGws = [...new Set(played.map((m) => m.gameweek))].sort((a, b) => a - b);
  return {
    backgroundColor: "transparent",
    legend: {
      data: teams.map((t) => t.short),
      textStyle: { color: "#888", fontSize: 10 },
      top: 0,
    },
    grid: { left: 20, right: 10, top: 36, bottom: 20, containLabel: true },
    xAxis: {
      type: "category",
      data: playedGws.map((g) => `Т${g}`),
      axisLabel: { color: "#666", fontSize: 10 },
      axisLine: { lineStyle: { color: "#333" } },
    },
    yAxis: {
      inverse: true,
      min: 1,
      max: 8,
      interval: 1,
      axisLabel: { color: "#666", fontSize: 9 },
      splitLine: { lineStyle: { color: "#2a2a3a" } },
    },
    series: teams.map((t) => {
      const history = getPositionHistory(t.id);
      return {
        name: t.short,
        type: "line",
        data: history.map((p) => p.position),
        smooth: true,
        lineStyle: { color: `hsl(${t.color})`, width: 2 },
        itemStyle: { color: `hsl(${t.color})` },
        symbolSize: 5,
      };
    }),
    tooltip: { trigger: "axis" },
  };
})();
```

- [ ] **Step 2: Add section to the Команды tab template**

Replace `<!-- sections 3–4 added in Tasks 11–12 -->` with:

```html
        <!-- 3. Динамика позиций -->
        <Card>
          <CardHeader class="pb-2">
            <CardTitle class="text-sm font-display text-muted-foreground normal-case tracking-normal">Динамика позиций</CardTitle>
          </CardHeader>
          <CardContent>
            <VChart :option="posHistoryChartOption" style="height: 300px" autoresize />
          </CardContent>
        </Card>

        <!-- section 4 added in Task 12 -->
```

- [ ] **Step 3: Run lint**

```bash
npm run lint
```

Expected: no errors.

- [ ] **Step 4: Verify in browser**

Open Команды tab. Confirm the line chart renders with 8 coloured lines, Y-axis inverted (position 1 at top, 8 at bottom), X-axis showing tour labels (Т1–Т7).

- [ ] **Step 5: Commit**

```bash
git add src/pages/AnalyticsPage.vue
git commit -m "feat: add position history line chart to Команды tab"
```

---

## Task 12: Add Средний счёт в партиях to Команды tab

**Files:**
- Modify: `src/pages/AnalyticsPage.vue`

- [ ] **Step 1: Add `getAvgSetScore` import and `teamAvgSetScores` data**

Add `getAvgSetScore` to the stats import. Change:

```ts
import { getStreaks, getComebackStats, getScoringPatterns, getForm, getSetPerformance, getPositionHistory } from "@/lib/stats";
```

To:

```ts
import { getStreaks, getComebackStats, getScoringPatterns, getForm, getSetPerformance, getPositionHistory, getAvgSetScore } from "@/lib/stats";
```

Add after `posHistoryChartOption`:

```ts
// ── Средний счёт в партиях ───────────────────────────────────────────────────
const teamAvgSetScores = standings.map((s) => ({
  team: s.team,
  avg: getAvgSetScore(s.team.id),
}));
```

- [ ] **Step 2: Add section to the Команды tab template**

Replace `<!-- section 4 added in Task 12 -->` with:

```html
        <!-- 4. Средний счёт в партиях -->
        <Card>
          <CardHeader class="pb-2">
            <CardTitle class="text-sm font-display text-muted-foreground normal-case tracking-normal">Средний счёт в партиях</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div
                v-for="ts in teamAvgSetScores"
                :key="ts.team.id"
                class="bg-secondary/30 rounded-lg px-3 py-2.5 space-y-1"
              >
                <div class="flex items-center gap-1.5 mb-1.5">
                  <Avatar shape="square" class="w-5 h-5 text-[8px] flex-shrink-0" :style="{ backgroundColor: `hsl(${ts.team.color})` }">
                    <AvatarFallback class="bg-transparent text-primary-foreground font-bold">{{ ts.team.short.slice(0, 2) }}</AvatarFallback>
                  </Avatar>
                  <span class="text-xs font-semibold">{{ ts.team.short }}</span>
                </div>
                <div class="text-[11px] text-muted-foreground">
                  В выигранных:
                  <span class="font-bold text-sport-win">{{ ts.avg.avgScoredWon.toFixed(1) }}</span>
                  :
                  <span class="text-foreground">{{ ts.avg.avgConcededWon.toFixed(1) }}</span>
                </div>
                <div class="text-[11px] text-muted-foreground">
                  В проигранных:
                  <span class="text-foreground">{{ ts.avg.avgScoredLost.toFixed(1) }}</span>
                  :
                  <span class="font-bold text-sport-loss">{{ ts.avg.avgConcededLost.toFixed(1) }}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
```

- [ ] **Step 3: Run full verification**

```bash
npm run lint && npm run test && npm run build
```

Expected: lint passes, all tests pass, build succeeds with no TypeScript errors.

- [ ] **Step 4: Verify all sections in browser**

Open Команды tab. Confirm all 4 sections render:
- Форма команд: 8 rows with В/П chips
- Эффективность по партиям: table with % values
- Динамика позиций: ECharts line chart, Y inverted
- Средний счёт: 8 cards with won/lost set averages

- [ ] **Step 5: Commit**

```bash
git add src/pages/AnalyticsPage.vue
git commit -m "feat: add avg set score cards to Команды tab"
```

---

## Final Verification Checklist

- [ ] `npm run lint` — no errors
- [ ] `npm run test` — all tests pass
- [ ] `npm run build` — no TypeScript errors, bundle includes ECharts tree-shaken
- [ ] `.superpowers/` does not appear in `git status` output
- [ ] All 3 tabs render correctly in dev server (`npm run dev`)
- [ ] Сводка: 6 sections including results matrix with coloured set-score cells
- [ ] Статистика: 5 sections including horizontal bar chart for score distribution
- [ ] Команды: 4 sections — form chips, set efficiency table, position line chart, avg score cards
- [ ] ECharts charts respond to window resize (`autoresize` prop)
- [ ] Position history chart: Y-axis inverted, 1 at top, 8 at bottom
- [ ] Results matrix: green = home team won, red = home team lost, `—` on diagonal, `·` for unplayed
