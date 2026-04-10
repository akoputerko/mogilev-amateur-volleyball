# Analytics Export — Design Spec

**Date:** 2026-04-11
**Status:** Approved

---

## Context

The Analytics page has 3 tabs (Сводка / Статистика / Команды) with 15 sections total. The user wants to export analytics content for sharing on Telegram. Two export formats: formatted text (copy-paste) and PNG images (one per section). Team names must always use full format (`team.name`).

---

## Decisions Made

| Topic | Decision |
|---|---|
| Export scope | All content on the current analytics tab |
| Formats | Text (copy to clipboard) + Images (PNG per section) |
| Export trigger | One "Экспорт" button per tab (right side of tab bar) |
| Text delivery | Modal with preview + "Скопировать всё" button |
| Image delivery | Modal gallery with per-section previews + individual/bulk download |
| Image library | `html-to-image` (`toPng()`) for DOM sections |
| ECharts export | Native `getDataURL({ type: 'png' })` for chart sections |
| Image theme | Follows current site theme (dark/light) |
| Image width | Fixed 800px |
| Team names | Always full (`team.name`), except results matrix text which uses `team.short` for column width |

---

## Text Export Format

Each tab produces a single formatted string for Telegram. Structure per tab:

### Сводка tab text

```
🏐 АНАЛИТИКА ЛИГИ: СВОДКА

📊 Обзор лиги
Сыграно матчей: {playedCount} из {totalMatches}
Партий сыграно: {totalSets}
Очков разыграно: {totalPoints}
Очков в партии (avg): {avgPointsPerSet}

📈 Результаты матчей
Разгром (3:0): {count30} — {pct30}%
Борьба (2:1): {count21} — {pct21}%

🏠 Дома / В гостях
Побед хозяев: {homeWins} | Побед гостей: {awayWins} ({homeWinPct}% дома)
Хозяева 3:0: {home30} | Хозяева 2:1: {home21}
Гости 2:1: {away21} | Гости 3:0: {away30}
Avg очков: хозяева {avgHomePtsPerSet} | гости {avgAwayPtsPerSet}

🏆 Лидеры лиги
{for each leader: "{label}: {team.name} — {value}"}
{if multiple tied: "{label}: {team1.name}, {team2.name} — {value}"}

⭐ Рекорды лиги
{for each record: "{label}: {value} ({detail})"}

📋 Матрица результатов
{monospace grid: short names in header/rows, set scores in cells, "—" for self, "·" for unplayed}
```

### Статистика tab text

```
🏐 АНАЛИТИКА ЛИГИ: СТАТИСТИКА

🎯 Характер партий
Напряжённых (≤3 очка): {leagueCloseSets} ({pctClose}%)
Разгромных (≥10 очков): {leagueDomSets} ({pctDom}%)
Средняя разница: {leagueAvgMargin}
Больше всего напряжённых: {team.name} — {value}
Больше всего разгромных: {team.name} — {value}

📊 Игра по партиям (лига)
Партия 1: хозяева {homeWinRate}% | avg очков {avgPoints} | разница ±{avgMargin}
Партия 2: хозяева {homeWinRate}% | avg очков {avgPoints} | разница ±{avgMargin}
Партия 3: хозяева {homeWinRate}% | avg очков {avgPoints} | разница ±{avgMargin}

🔥 Решающие партии
Матчей 2:1: {decisiveCount} ({decisivePct}% всех)
Камбэков: {totalComebacks} | Упущенных побед: {totalBlownLeads}
Камбэк-рейт: {comebackRate}%
Лидер по камбэкам: {team.name} — {value}
Больше всех упущено: {team.name} — {value}

📈 Серии сезона
Лучшая серия побед: {team.name} — {value}В
Худшая серия поражений: {team.name} — {value}П
Текущие серии:
{for each: "  {team.name}: {count}{В/П}"}

📊 Распределение счётов партий (Топ-10)
{for each: "{score}: {count} раз"}
```

### Команды tab text

```
🏐 АНАЛИТИКА ЛИГИ: КОМАНДЫ

📋 Форма команд (последние 5 матчей)
{for each team sorted by standings:
  "{team.name}: {В/П В/П В/П В/П В/П}"}

📊 Эффективность по партиям
{for each team:
  "{team.name}: П1 {pct}% | П2 {pct}% | П3 {pct}%"}

📈 Динамика позиций
{for each team:
  "{team.name}: Т1→{pos} Т2→{pos} ... Т7→{pos}"}

🎯 Средний счёт в партиях
{for each team:
  "{team.name}:
    В выигранных: {avgScoredWon} : {avgConcededWon}
    В проигранных: {avgScoredLost} : {avgConcededLost}"}
```

---

## Image Export

### Rendering approach

**DOM-based sections (13 sections):**
1. Each section in AnalyticsPage.vue gets a template `ref` (e.g., `ref="sectionSummary1"`)
2. `html-to-image` renders via the following steps:
   a. Clone the section element: `element.cloneNode(true)` → `clone`
   b. Walk all text nodes in `clone`; for each team, replace exact matches of `team.short` with `team.name` (using a lookup map built from the `teams` array)
   c. Wrap `clone` in an offscreen container (`position: absolute; left: -9999px; width: 800px`) with the site background color and a title header strip
   d. Append to `document.body`, call `toPng(wrapper)`, remove wrapper
3. Short name → full name replacement is exact-match only (e.g., `"МАК"` → `"Макиато"`). No partial or substring replacement.

**ECharts sections (2 sections: Распределение счётов, Динамика позиций):**
1. Access the VChart component instance via template `ref`
2. Call `chartInstance.getDataURL({ type: 'png', pixelRatio: 2 })` for retina quality
3. Wrap in a container image with header title and padding to match other section images

### Image naming

Pattern: `{tab}-{NN}-{section-slug}.png`

| Tab | Section | Filename |
|---|---|---|
| Сводка | Обзор лиги | `сводка-01-обзор-лиги.png` |
| Сводка | Результаты матчей | `сводка-02-результаты-матчей.png` |
| Сводка | Дома / В гостях | `сводка-03-дома-в-гостях.png` |
| Сводка | Лидеры лиги | `сводка-04-лидеры-лиги.png` |
| Сводка | Рекорды лиги | `сводка-05-рекорды-лиги.png` |
| Сводка | Матрица результатов | `сводка-06-матрица-результатов.png` |
| Статистика | Характер партий | `статистика-01-характер-партий.png` |
| Статистика | Игра по партиям | `статистика-02-игра-по-партиям.png` |
| Статистика | Решающие партии | `статистика-03-решающие-партии.png` |
| Статистика | Серии сезона | `статистика-04-серии-сезона.png` |
| Статистика | Распределение счётов | `статистика-05-распределение-счётов.png` |
| Команды | Форма команд | `команды-01-форма-команд.png` |
| Команды | Эффективность по партиям | `команды-02-эффективность-по-партиям.png` |
| Команды | Динамика позиций | `команды-03-динамика-позиций.png` |
| Команды | Средний счёт в партиях | `команды-04-средний-счёт-в-партиях.png` |

---

## UI Design

### Export button

- Position: right-aligned in the tab bar row (flex with `ml-auto`)
- Icon: `Share2` from lucide-vue-next
- Text: "Экспорт" — hidden on mobile (`hidden sm:inline`), icon-only on small screens
- Style: `variant="ghost"` shadcn Button, same height as tab buttons

### Export modal (ExportModal.vue)

**Header:**
- Title: "Экспорт: {Сводка|Статистика|Команды}"
- Uses shadcn `Dialog` / `DialogContent` / `DialogHeader` / `DialogTitle`

**Inner tabs:**
- Two buttons: "Текст" / "Картинки" — styled like the analytics page tabs (bottom border active indicator)
- Default: "Текст"

**Text mode:**
- `<pre>` block with `overflow-y-auto max-h-[60vh]` for scrolling
- "Скопировать всё" button top-right corner — uses `navigator.clipboard.writeText()`
- On success: button text changes to "Скопировано!" with `Check` icon for 2 seconds

**Images mode:**
- Loading state: spinner + "Генерация картинок..." while `html-to-image` renders
- "Скачать все" button at top — downloads all images sequentially via programmatic `<a>` click
- Vertical list of preview cards, each containing:
  - Section title (left)
  - Thumbnail preview of the rendered image (max-height 200px, scaled down)
  - Download button with `Download` icon (right)
- Each download creates a temporary `<a href={dataUrl} download={filename}>` and clicks it

---

## Technical Implementation

### Dependencies

```
html-to-image
```

Install: `npm install html-to-image`

### New files

| File | Purpose |
|---|---|
| `src/lib/export-text.ts` | Text formatting functions |
| `src/lib/export-image.ts` | Image rendering wrapper |
| `src/components/ExportModal.vue` | Export modal component |

### `src/lib/export-text.ts`

Three exported functions, one per tab:

```ts
formatSummaryText(data: SummaryExportData): string
formatStatsText(data: StatsExportData): string
formatTeamsText(data: TeamsExportData): string
```

Data interfaces (defined in the same file):

```ts
interface SummaryExportData {
  playedCount: number; totalMatches: number; totalSets: number;
  totalPoints: number; avgPointsPerSet: string;
  count30: number; count21: number; pct30: number; pct21: number;
  homeWins: number; awayWins: number; homeWinPct: number;
  home30: number; home21: number; away21: number; away30: number;
  avgHomePtsPerSet: string; avgAwayPtsPerSet: string;
  leagueLeaders: { label: string; teams: Team[]; value: string }[];
  leagueRecords: { label: string; value: string; detail: string }[];
  resultMatrix: MatrixCell[][];
  teams: Team[];
}

interface StatsExportData {
  leagueCloseSets: number; leagueDomSets: number; leagueAvgMargin: string;
  pctClose: number; pctDom: number;
  mostCloseTeams: { team: Team; closeSets: number }[];
  mostDomTeams: { team: Team; dominantSets: number }[];
  leagueSetStats: { setNum: number; homeWinRate: number; avgPoints: string; avgMargin: string }[];
  decisiveCount: number; decisivePct: number;
  totalComebacks: number; totalBlownLeads: number; comebackRate: number;
  mostComebackTeams: { team: Team; comebacks: number }[];
  mostBlownTeams: { team: Team; blownLeads: number }[];
  longestWinStreaks: { team: Team; longestWin: number }[];
  longestLossStreaks: { team: Team; longestLoss: number }[];
  currentStreaks: { team: Team; current: { type: "win" | "loss"; count: number } }[];
  scoreDistribution: [string, number][];
}

interface TeamsExportData {
  teamForms: { team: Team; form: { won: boolean }[] }[];
  teamSetEfficiency: { team: Team; sets: { setNum: number; won: number; lost: number }[] }[];
  teamPositionHistory: { team: Team; history: { gameweek: number; position: number }[] }[];
  teamAvgSetScores: { team: Team; avg: AvgSetScore }[];
}
```

Team names: always `team.name` in text. Results matrix uses `team.short` padded to equal width for alignment.

### `src/lib/export-image.ts`

```ts
renderSectionToImage(element: HTMLElement, title: string): Promise<string>
// Clones element into offscreen container, adds header, renders via toPng(), returns data URL

renderChartToImage(chartInstance: EChartsInstance, title: string): Promise<string>
// Calls getDataURL(), wraps in a canvas with header, returns data URL

downloadImage(dataUrl: string, filename: string): void
// Creates temporary <a> element and clicks it
```

### Changes to `src/pages/AnalyticsPage.vue`

- Add template refs on each section wrapper: `ref="sectionSummary1"` through `ref="sectionSummary6"`, `ref="sectionStats1"` through `ref="sectionStats5"`, `ref="sectionTeams1"` through `ref="sectionTeams4"`
- Add template refs on VChart components: `ref="chartScoreDist"`, `ref="chartPosHistory"`
- Add `Share2` icon import
- Add export button in the tab bar
- Import and render `ExportModal` with props: `activeTab`, computed data objects, section refs, chart refs
- `showExportModal` ref to control dialog visibility

### ExportModal.vue props

```ts
{
  open: boolean;
  tabId: "summary" | "stats" | "teams";
  tabLabel: string;
  // Data for text export (all computed values grouped by tab)
  summaryData: SummaryExportData;
  statsData: StatsExportData;
  teamsData: TeamsExportData;
  // Refs for image export
  sectionRefs: Record<string, HTMLElement | null>;
  chartRefs: Record<string, ComponentPublicInstance | null>;
}
```

---

## Verification

1. `npm install` — installs html-to-image without errors
2. `npm run build` — no TypeScript errors
3. `npm run lint` — no lint errors
4. Text export: open modal on each tab, verify text matches page data, copy works
5. Image export: open modal on each tab, verify all section previews render, download works
6. Theme: switch dark/light, verify images follow theme
7. Mobile: export button shows icon only, modal is usable
8. Full team names: verify `team.name` used in both text and image exports
