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

  type Occurrence = { detail: string; teamId?: number };

  let maxSetScore = 0;
  let maxSetOccurrences: Occurrence[] = [];

  let minMargin = Infinity;
  let minMarginValue = "";
  let minMarginOccurrences: Occurrence[] = [];

  let maxMargin = 0;
  let maxMarginValue = "";
  let maxMarginOccurrences: Occurrence[] = [];

  let maxMatchPoints = 0;
  let maxMatchOccurrences: Occurrence[] = [];

  for (const m of played) {
    const homeShort = getTeam(m.homeId).short;
    const awayShort = getTeam(m.awayId).short;
    let matchTotal = 0;

    for (const s of m.result!.setScores) {
      matchTotal += s.home + s.away;
      const margin = Math.abs(s.home - s.away);
      const winner = s.home > s.away ? s.home : s.away;
      const loser = s.home > s.away ? s.away : s.home;
      const winnerShort = s.home > s.away ? homeShort : awayShort;
      const loserShort = s.home > s.away ? awayShort : homeShort;
      const winnerTeamId = s.home > s.away ? m.homeId : m.awayId;

      const setMax = Math.max(s.home, s.away);
      const setMaxDetail = `${winnerShort} vs ${loserShort}, Тур ${m.gameweek}`;
      if (setMax > maxSetScore) {
        maxSetScore = setMax;
        maxSetOccurrences = [{ detail: setMaxDetail, teamId: winnerTeamId }];
      } else if (setMax === maxSetScore) {
        maxSetOccurrences.push({ detail: setMaxDetail, teamId: winnerTeamId });
      }

      if (margin < minMargin) {
        minMargin = margin;
        minMarginValue = `${winner}:${loser}`;
        minMarginOccurrences = [{ detail: `${winnerShort} - ${loserShort}, Тур ${m.gameweek}` }];
      } else if (margin === minMargin) {
        minMarginOccurrences.push({ detail: `${winnerShort} - ${loserShort}, Тур ${m.gameweek}` });
      }

      if (margin > maxMargin) {
        maxMargin = margin;
        maxMarginValue = `+${margin}`;
        maxMarginOccurrences = [{ detail: `${winner}:${loser}, ${winnerShort} - ${loserShort}`, teamId: winnerTeamId }];
      } else if (margin === maxMargin) {
        maxMarginOccurrences.push({ detail: `${winner}:${loser}, ${winnerShort} - ${loserShort}`, teamId: winnerTeamId });
      }
    }

    if (matchTotal > maxMatchPoints) {
      maxMatchPoints = matchTotal;
      maxMatchOccurrences = [{ detail: `${homeShort} - ${awayShort}, Тур ${m.gameweek}` }];
    } else if (matchTotal === maxMatchPoints) {
      maxMatchOccurrences.push({ detail: `${homeShort} - ${awayShort}, Тур ${m.gameweek}` });
    }
  }

  function joinDetail(occ: Occurrence[]): string {
    if (occ.length === 0) return "";
    const latest = occ[occ.length - 1].detail;
    return occ.length > 1 ? `${latest} (×${occ.length})` : latest;
  }
  function resolveTeamId(occ: Occurrence[]): number | undefined {
    const ids = occ.map((o) => o.teamId).filter((id) => id !== undefined);
    if (ids.length === 0) return undefined;
    return ids.every((id) => id === ids[0]) ? ids[0] : undefined;
  }

  records.push({ label: "Макс. очков в партии", value: String(maxSetScore), detail: joinDetail(maxSetOccurrences), teamId: resolveTeamId(maxSetOccurrences) });
  if (minMargin < Infinity) {
    records.push({ label: "Самая напряжённая", value: minMarginValue, detail: joinDetail(minMarginOccurrences) });
  }
  records.push({ label: "Самый разгромный", value: maxMarginValue, detail: joinDetail(maxMarginOccurrences), teamId: resolveTeamId(maxMarginOccurrences) });
  records.push({ label: "Очков в матче", value: String(maxMatchPoints), detail: joinDetail(maxMatchOccurrences) });

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
