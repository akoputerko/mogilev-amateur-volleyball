import type { Team } from "@/data/league";

// ── Matrix cell type (mirrors AnalyticsPage) ───────────────────────────────

export type MatrixCell = { homeWon: boolean; score: string } | null | "self";

// ── SummaryExportData ──────────────────────────────────────────────────────

export interface SummaryExportData {
  playedCount: number;
  totalMatches: number;
  totalSets: number;
  totalPoints: number;
  avgPointsPerSet: string;
  count30: number;
  count21: number;
  pct30: number;
  pct21: number;
  homeWins: number;
  awayWins: number;
  homeWinPct: number;
  home30: number;
  home21: number;
  away21: number;
  away30: number;
  avgHomePtsPerSet: string;
  avgAwayPtsPerSet: string;
  leagueLeaders: { label: string; teams: Team[]; value: string }[];
  leagueRecords: { label: string; value: string; detail: string }[];
  resultMatrix: MatrixCell[][];
  teams: Team[];
}

// ── Matrix helper ──────────────────────────────────────────────────────────

function formatMatrix(matrix: MatrixCell[][], teams: Team[]): string {
  const W = 4;
  const LABEL_W = 5;
  const header = "".padEnd(LABEL_W) + teams.map((t) => t.short.padEnd(W)).join("");
  const rows = matrix.map((row, ri) => {
    const label = teams[ri].short.padEnd(LABEL_W);
    const cells = row.map((cell) => {
      if (cell === "self") return "—".padEnd(W);
      if (cell === null)   return "·".padEnd(W);
      return cell.score.padEnd(W);
    });
    return label + cells.join("");
  });
  return ["```", header, ...rows, "```"].join("\n");
}

// ── formatSummaryText ──────────────────────────────────────────────────────

export function formatSummaryText(data: SummaryExportData): string {
  const lines: string[] = [];

  lines.push("🏐 АНАЛИТИКА ЛИГИ: СВОДКА");
  lines.push("");

  lines.push("📊 Обзор лиги");
  lines.push(`Сыграно матчей: ${data.playedCount} из ${data.totalMatches}`);
  lines.push(`Партий сыграно: ${data.totalSets}`);
  lines.push(`Очков разыграно: ${data.totalPoints}`);
  lines.push(`Очков в партии (avg): ${data.avgPointsPerSet}`);
  lines.push("");

  lines.push("📈 Результаты матчей");
  lines.push(`Разгром (3:0): ${data.count30} — ${data.pct30}%`);
  lines.push(`Борьба (2:1): ${data.count21} — ${data.pct21}%`);
  lines.push("");

  lines.push("🏠 Дома / В гостях");
  lines.push(`Побед хозяев: ${data.homeWins} | Побед гостей: ${data.awayWins} (${data.homeWinPct}% дома)`);
  lines.push(`Хозяева 3:0: ${data.home30} | Хозяева 2:1: ${data.home21}`);
  lines.push(`Гости 2:1: ${data.away21} | Гости 3:0: ${data.away30}`);
  lines.push(`Avg очков: хозяева ${data.avgHomePtsPerSet} | гости ${data.avgAwayPtsPerSet}`);
  lines.push("");

  lines.push("🏆 Лидеры лиги");
  for (const leader of data.leagueLeaders) {
    const names = leader.teams.map((t) => t.name).join(", ");
    lines.push(`${leader.label}: ${names} — ${leader.value}`);
  }
  lines.push("");

  lines.push("⭐ Рекорды лиги");
  for (const record of data.leagueRecords) {
    lines.push(`${record.label}: ${record.value} (${record.detail})`);
  }
  lines.push("");

  lines.push("📋 Матрица результатов");
  lines.push(formatMatrix(data.resultMatrix, data.teams));

  return lines.join("\n");
}
