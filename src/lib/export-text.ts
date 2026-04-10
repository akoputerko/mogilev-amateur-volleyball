import type { Team } from "@/data/league";
import type { AvgSetScore } from "@/lib/stats";

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

// ── StatsExportData ────────────────────────────────────────────────────────

export interface StatsExportData {
  leagueCloseSets: number;
  leagueDomSets: number;
  leagueAvgMargin: string;
  pctClose: number;
  pctDom: number;
  mostCloseTeams: { team: Team; closeSets: number }[];
  mostDomTeams: { team: Team; dominantSets: number }[];
  leagueSetStats: { setNum: number; homeWinRate: number; avgPoints: string; avgMargin: string }[];
  decisiveCount: number;
  decisivePct: number;
  totalComebacks: number;
  totalBlownLeads: number;
  comebackRate: number;
  mostComebackTeams: { team: Team; comebacks: number }[];
  mostBlownTeams: { team: Team; blownLeads: number }[];
  longestWinStreaks: { team: Team; longestWin: number }[];
  longestLossStreaks: { team: Team; longestLoss: number }[];
  currentStreaks: { team: Team; current: { type: "win" | "loss"; count: number } }[];
  scoreDistribution: [string, number][];
}

export function formatStatsText(data: StatsExportData): string {
  const lines: string[] = [];

  lines.push("🏐 АНАЛИТИКА ЛИГИ: СТАТИСТИКА");
  lines.push("");

  lines.push("🎯 Характер партий");
  lines.push(`Напряжённых (≤3 очка): ${data.leagueCloseSets} (${data.pctClose}%)`);
  lines.push(`Разгромных (≥10 очков): ${data.leagueDomSets} (${data.pctDom}%)`);
  lines.push(`Средняя разница: ${data.leagueAvgMargin}`);
  if (data.mostCloseTeams.length > 0) {
    lines.push(`Больше всего напряжённых: ${data.mostCloseTeams.map((t) => t.team.name).join(", ")} — ${data.mostCloseTeams[0].closeSets}`);
  }
  if (data.mostDomTeams.length > 0) {
    lines.push(`Больше всего разгромных: ${data.mostDomTeams.map((t) => t.team.name).join(", ")} — ${data.mostDomTeams[0].dominantSets}`);
  }
  lines.push("");

  lines.push("📊 Игра по партиям (лига)");
  for (const s of data.leagueSetStats) {
    lines.push(`Партия ${s.setNum}: хозяева ${Math.round(s.homeWinRate * 100)}% | avg очков ${s.avgPoints} | разница ±${s.avgMargin}`);
  }
  lines.push("");

  lines.push("🔥 Решающие партии");
  lines.push(`Матчей 2:1: ${data.decisiveCount} (${data.decisivePct}% всех)`);
  lines.push(`Камбэков: ${data.totalComebacks} | Упущенных побед: ${data.totalBlownLeads}`);
  lines.push(`Камбэк-рейт: ${data.comebackRate}%`);
  if (data.mostComebackTeams.length > 0) {
    lines.push(`Лидер по камбэкам: ${data.mostComebackTeams.map((t) => t.team.name).join(", ")} — ${data.mostComebackTeams[0].comebacks}`);
  }
  if (data.mostBlownTeams.length > 0) {
    lines.push(`Больше всех упущено: ${data.mostBlownTeams.map((t) => t.team.name).join(", ")} — ${data.mostBlownTeams[0].blownLeads}`);
  }
  lines.push("");

  lines.push("📈 Серии сезона");
  if (data.longestWinStreaks.length > 0) {
    lines.push(`Лучшая серия побед: ${data.longestWinStreaks.map((s) => s.team.name).join(", ")} — ${data.longestWinStreaks[0].longestWin}В`);
  }
  if (data.longestLossStreaks.length > 0) {
    lines.push(`Худшая серия поражений: ${data.longestLossStreaks.map((s) => s.team.name).join(", ")} — ${data.longestLossStreaks[0].longestLoss}П`);
  }
  if (data.currentStreaks.length > 0) {
    lines.push("Текущие серии:");
    for (const s of data.currentStreaks) {
      const label = s.current.type === "win" ? `${s.current.count}В` : `${s.current.count}П`;
      lines.push(`  ${s.team.name}: ${label}`);
    }
  }
  lines.push("");

  lines.push("📊 Распределение счётов партий (Топ-10)");
  for (const [score, count] of data.scoreDistribution) {
    lines.push(`${score}: ${count} раз`);
  }

  return lines.join("\n");
}

// ── TeamsExportData ────────────────────────────────────────────────────────

export interface TeamsExportData {
  teamForms: { team: Team; form: { won: boolean }[] }[];
  teamSetEfficiency: { team: Team; sets: { setNum: number; won: number; lost: number }[] }[];
  teamPositionHistory: { team: Team; history: { gameweek: number; position: number }[] }[];
  teamAvgSetScores: { team: Team; avg: AvgSetScore }[];
}

export function formatTeamsText(data: TeamsExportData): string {
  const lines: string[] = [];

  lines.push("🏐 АНАЛИТИКА ЛИГИ: КОМАНДЫ");
  lines.push("");

  lines.push("📋 Форма команд (последние 5 матчей)");
  for (const tf of data.teamForms) {
    const chips = tf.form.map((f) => (f.won ? "В" : "П")).join(" ");
    lines.push(`${tf.team.name}: ${chips}`);
  }
  lines.push("");

  lines.push("📊 Эффективность по партиям");
  for (const te of data.teamSetEfficiency) {
    const setStats = te.sets.map((s) => {
      const pct = s.won + s.lost > 0 ? Math.round((s.won / (s.won + s.lost)) * 100) : 0;
      return `П${s.setNum} ${pct}%`;
    });
    lines.push(`${te.team.name}: ${setStats.join(" | ")}`);
  }
  lines.push("");

  lines.push("📈 Динамика позиций");
  for (const tp of data.teamPositionHistory) {
    const positions = tp.history.map((h) => `Т${h.gameweek}→${h.position}`).join(" ");
    lines.push(`${tp.team.name}: ${positions}`);
  }
  lines.push("");

  lines.push("🎯 Средний счёт в партиях");
  for (const ts of data.teamAvgSetScores) {
    lines.push(`${ts.team.name}:`);
    lines.push(`  В выигранных: ${ts.avg.avgScoredWon.toFixed(1)} : ${ts.avg.avgConcededWon.toFixed(1)}`);
    lines.push(`  В проигранных: ${ts.avg.avgScoredLost.toFixed(1)} : ${ts.avg.avgConcededLost.toFixed(1)}`);
  }

  return lines.join("\n");
}
