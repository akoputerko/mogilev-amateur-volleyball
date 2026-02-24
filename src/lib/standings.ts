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

export function calcStandings(): TeamStanding[] {
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

  matches.filter((m) => m.played && m.result).forEach((m) => {
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
    const loserSets = homeWon ? r.setsAway : r.setsHome; // 0 = clean sweep (3-0), 1 = contested (2-1)

    if (homeWon) {
      home.won++; away.lost++;
      home.homeWon++;
      away.awayLost++;
      if (loserSets === 0) { // 3-0
        home.points += 3;
      } else { // 2-1
        home.points += 2;
        away.points += 1;
      }
    } else {
      away.won++; home.lost++;
      away.awayWon++;
      home.homeLost++;
      if (loserSets === 0) { // 0-3
        away.points += 3;
      } else { // 1-2
        away.points += 2;
        home.points += 1;
      }
    }
  });

  const standings = Object.values(map);
  standings.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    const setRatioA = a.setsLost ? a.setsWon / a.setsLost : a.setsWon;
    const setRatioB = b.setsLost ? b.setsWon / b.setsLost : b.setsWon;
    if (setRatioB !== setRatioA) return setRatioB - setRatioA;
    const ptRatioA = a.pointsLost ? a.pointsWon / a.pointsLost : a.pointsWon;
    const ptRatioB = b.pointsLost ? b.pointsWon / b.pointsLost : b.pointsWon;
    return ptRatioB - ptRatioA;
  });

  return standings;
}

export function getTeamMatches(teamId: number): Match[] {
  return matches.filter((m) => m.homeId === teamId || m.awayId === teamId);
}

export function getUpcoming(teamId: number, count: number): Match[] {
  return getTeamMatches(teamId)
    .filter((m) => !m.played)
    .slice(0, count);
}
