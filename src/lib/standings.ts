import { matches, teams, type Match, type Team } from "@/data/league";

export interface TeamStanding {
  team: Team;
  played: number;
  won: number;
  lost: number;
  points: number;
  setsWon: number;
  setsLost: number;
  pointsWon: number;
  pointsLost: number;
  homeWon: number;
  homeLost: number;
  awayWon: number;
  awayLost: number;
}

export function calcStandingsFromMatches(matchList: Match[]): TeamStanding[] {
  const map: Record<number, TeamStanding> = {};
  teams.forEach((t) => {
    map[t.id] = {
      team: t,
      played: 0, won: 0, lost: 0, points: 0,
      setsWon: 0, setsLost: 0,
      pointsWon: 0, pointsLost: 0,
      homeWon: 0, homeLost: 0,
      awayWon: 0, awayLost: 0,
    };
  });

  matchList.filter((m) => m.played && m.result).forEach((m) => {
    const r = m.result!;
    const home = map[m.homeId];
    const away = map[m.awayId];

    home.played++;
    away.played++;

    home.setsWon += r.setsHome;
    home.setsLost += r.setsAway;
    away.setsWon += r.setsAway;
    away.setsLost += r.setsHome;

    r.setScores.forEach((s) => {
      home.pointsWon += s.home;
      home.pointsLost += s.away;
      away.pointsWon += s.away;
      away.pointsLost += s.home;
    });

    const homeWon = r.setsHome > r.setsAway;
    const loserSets = homeWon ? r.setsAway : r.setsHome;

    if (homeWon) {
      home.won++; away.lost++;
      home.homeWon++;
      away.awayLost++;
      if (loserSets === 0) {
        home.points += 3;
      } else {
        home.points += 2;
        away.points += 1;
      }
    } else {
      away.won++; home.lost++;
      away.awayWon++;
      home.homeLost++;
      if (loserSets === 0) {
        away.points += 3;
      } else {
        away.points += 2;
        home.points += 1;
      }
    }
  });

  const standings = Object.values(map);
  standings.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.won !== a.won) return b.won - a.won;
    const setDiffA = a.setsWon - a.setsLost;
    const setDiffB = b.setsWon - b.setsLost;
    if (setDiffB !== setDiffA) return setDiffB - setDiffA;
    if (b.setsWon !== a.setsWon) return b.setsWon - a.setsWon;
    const ptDiffA = a.pointsWon - a.pointsLost;
    const ptDiffB = b.pointsWon - b.pointsLost;
    if (ptDiffB !== ptDiffA) return ptDiffB - ptDiffA;
    return b.pointsWon - a.pointsWon;
  });

  return standings;
}

export function calcStandings(): TeamStanding[] {
  return calcStandingsFromMatches(matches);
}

export function getTeamMatches(teamId: number): Match[] {
  return matches.filter((m) => m.homeId === teamId || m.awayId === teamId);
}

export function getUpcoming(teamId: number, count: number): Match[] {
  return getTeamMatches(teamId)
    .filter((m) => !m.played && !isMatchPast(m))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, count);
}

export type MatchStatus = "played" | "past-no-result" | "upcoming";

export function isMatchPast(match: Match): boolean {
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  return match.date < todayStr;
}

export function getMatchStatus(match: Match): MatchStatus {
  if (match.played) return "played";
  if (isMatchPast(match)) return "past-no-result";
  return "upcoming";
}
