import { matches, getTeam } from "@/data/league";
import { calcStandings } from "@/lib/standings";

export interface LeagueRecord {
  label: string;
  value: string;
  detail: string;
  teamId?: number;
}

export function getLeagueRecords(): LeagueRecord[] {
  const played = matches.filter((m) => m.played && m.result);
  if (played.length === 0) return [];

  const records: LeagueRecord[] = [];

  let maxSetScore = 0;
  let maxSetDetail = "";
  let maxSetTeamId: number | undefined;

  let minMargin = Infinity;
  let minMarginValue = "";
  let minMarginDetail = "";

  let maxMargin = 0;
  let maxMarginValue = "";
  let maxMarginDetail = "";
  let maxMarginTeamId: number | undefined;

  let maxMatchPoints = 0;
  let maxMatchDetail = "";

  for (const m of played) {
    const homeShort = getTeam(m.homeId).short;
    const awayShort = getTeam(m.awayId).short;
    let matchTotal = 0;

    for (const s of m.result!.setScores) {
      matchTotal += s.home + s.away;
      const margin = Math.abs(s.home - s.away);
      const winner = s.home > s.away ? s.home : s.away;
      const loser = s.home > s.away ? s.away : s.home;
      const winnerTeamId = s.home > s.away ? m.homeId : m.awayId;

      if (s.home > maxSetScore) {
        maxSetScore = s.home;
        maxSetDetail = `${homeShort} vs ${awayShort}, Тур ${m.gameweek}`;
        maxSetTeamId = m.homeId;
      }
      if (s.away > maxSetScore) {
        maxSetScore = s.away;
        maxSetDetail = `${awayShort} vs ${homeShort}, Тур ${m.gameweek}`;
        maxSetTeamId = m.awayId;
      }

      if (margin < minMargin) {
        minMargin = margin;
        minMarginValue = `${winner}:${loser}`;
        minMarginDetail = `${homeShort} - ${awayShort}, Тур ${m.gameweek}`;
      }

      if (margin > maxMargin) {
        maxMargin = margin;
        maxMarginValue = `+${margin}`;
        maxMarginDetail = `${winner}:${loser}, ${homeShort} - ${awayShort}`;
        maxMarginTeamId = winnerTeamId;
      }
    }

    if (matchTotal > maxMatchPoints) {
      maxMatchPoints = matchTotal;
      maxMatchDetail = `${homeShort} - ${awayShort}, Тур ${m.gameweek}`;
    }
  }

  records.push({ label: "Макс. очков в партии", value: String(maxSetScore), detail: maxSetDetail, teamId: maxSetTeamId });
  if (minMargin < Infinity) {
    records.push({ label: "Самая напряжённая", value: minMarginValue, detail: minMarginDetail });
  }
  records.push({ label: "Самый разгромный", value: maxMarginValue, detail: maxMarginDetail, teamId: maxMarginTeamId });
  records.push({ label: "Очков в матче", value: String(maxMatchPoints), detail: maxMatchDetail });

  const standings = calcStandings().filter((s) => s.played > 0);
  if (standings.length > 0) {
    const best = standings
      .map((s) => ({ ...s, eff: s.pointsWon / (s.pointsWon + s.pointsLost) }))
      .sort((a, b) => b.eff - a.eff)[0];
    records.push({
      label: "Эфф-ть атаки",
      value: `${Math.round(best.eff * 100)}%`,
      detail: best.team.name,
      teamId: best.team.id,
    });
  }

  return records;
}
