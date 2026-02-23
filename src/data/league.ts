export interface Team {
  id: number;
  name: string;
  short: string;
  color: string; // tailwind-safe HSL
}

export interface SetScore {
  home: number;
  away: number;
}

export interface MatchResult {
  setsHome: number;
  setsAway: number;
  setScores: SetScore[];
}

export interface Match {
  id: number;
  gameweek: number;
  homeId: number;
  awayId: number;
  venue: string;
  address: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  played: boolean;
  result?: MatchResult;
}

export const teams: Team[] = [
  { id: 0, name: "Макиато", short: "МАК", color: "30 60% 40%" },
  { id: 1, name: "Dream Team", short: "DRM", color: "210 70% 45%" },
  { id: 2, name: "Черные лебеди", short: "ЧЛ", color: "0 0% 20%" },
  { id: 3, name: "Кулаки", short: "КУЛ", color: "0 70% 50%" },
  { id: 4, name: "Ноу Неймы", short: "НН", color: "270 50% 50%" },
  { id: 5, name: "Ростки", short: "РСТ", color: "130 55% 38%" },
  { id: 6, name: "Торнадо", short: "ТРН", color: "195 80% 40%" },
  { id: 7, name: "Атом", short: "АТМ", color: "45 85% 50%" },
];

export const getTeam = (id: number) => teams.find((t) => t.id === id)!;

const venues = [
  { name: "СК «Олимпиец»", address: "ул. Гагарина, 17" },
  { name: "Зал БГУТ", address: "пр. Мира, 43" },
  { name: "СК «Могилев»", address: "ул. Челюскинцев, 22" },
  { name: "Зал СШ №35", address: "ул. Первомайская, 56" },
];

// Round-robin schedule for 8 teams (fix team 0, rotate 1-7)
const singleRoundRobin: [number, number][][] = [
  [[0, 7], [1, 6], [2, 5], [3, 4]],
  [[0, 6], [7, 5], [1, 4], [2, 3]],
  [[0, 5], [6, 4], [7, 3], [1, 2]],
  [[0, 4], [5, 3], [6, 2], [7, 1]],
  [[0, 3], [4, 2], [5, 1], [6, 7]],
  [[0, 2], [3, 1], [4, 7], [5, 6]],
  [[0, 1], [2, 7], [3, 6], [4, 5]],
];

// Results for played matches (gameweeks 1-5)
const playedResults: Record<number, MatchResult> = {};

function addResult(matchId: number, sH: number, sA: number, sets: [number, number][]) {
  playedResults[matchId] = {
    setsHome: sH,
    setsAway: sA,
    setScores: sets.map(([h, a]) => ({ home: h, away: a })),
  };
}

// GW1
addResult(0, 3, 1, [[25, 20], [22, 25], [25, 18], [25, 21]]);
addResult(1, 3, 0, [[25, 19], [25, 22], [25, 17]]);
addResult(2, 1, 3, [[25, 22], [19, 25], [20, 25], [18, 25]]);
addResult(3, 3, 2, [[25, 21], [20, 25], [25, 23], [22, 25], [15, 13]]);

// GW2
addResult(4, 3, 0, [[25, 18], [25, 20], [25, 15]]);
addResult(5, 2, 3, [[25, 22], [25, 27], [20, 25], [25, 19], [12, 15]]);
addResult(6, 3, 1, [[25, 20], [18, 25], [25, 19], [25, 22]]);
addResult(7, 0, 3, [[20, 25], [18, 25], [22, 25]]);

// GW3
addResult(8, 3, 2, [[25, 20], [18, 25], [25, 21], [23, 25], [15, 11]]);
addResult(9, 3, 0, [[25, 18], [25, 21], [25, 19]]);
addResult(10, 1, 3, [[25, 23], [19, 25], [21, 25], [18, 25]]);
addResult(11, 3, 1, [[25, 19], [20, 25], [25, 18], [25, 22]]);

// GW4
addResult(12, 0, 3, [[19, 25], [22, 25], [20, 25]]);
addResult(13, 3, 1, [[25, 18], [21, 25], [25, 20], [25, 22]]);
addResult(14, 3, 2, [[25, 23], [22, 25], [25, 20], [19, 25], [15, 12]]);
addResult(15, 3, 0, [[25, 17], [25, 20], [25, 19]]);

// GW5
addResult(16, 3, 1, [[25, 18], [20, 25], [25, 19], [25, 23]]);
addResult(17, 0, 3, [[18, 25], [21, 25], [19, 25]]);
addResult(18, 3, 0, [[25, 20], [25, 18], [25, 22]]);
addResult(19, 1, 3, [[22, 25], [25, 20], [19, 25], [21, 25]]);

function generateMatches(): Match[] {
  const matches: Match[] = [];
  let id = 0;
  const startDate = new Date(2025, 8, 6); // Sep 6 2025

  for (let half = 0; half < 2; half++) {
    for (let round = 0; round < 7; round++) {
      const gw = half * 7 + round;
      const weekDate = new Date(startDate);
      weekDate.setDate(startDate.getDate() + gw * 7);
      const dateStr = weekDate.toISOString().slice(0, 10);
      const times = ["10:00", "12:00", "14:00", "16:00"];

      for (let mi = 0; mi < 4; mi++) {
        const [a, b] = singleRoundRobin[round][mi];
        const homeId = half === 0 ? a : b;
        const awayId = half === 0 ? b : a;
        const venue = venues[mi % venues.length];
        const played = playedResults[id] !== undefined;

        matches.push({
          id,
          gameweek: gw + 1,
          homeId,
          awayId,
          venue: venue.name,
          address: venue.address,
          date: dateStr,
          time: times[mi],
          played,
          result: playedResults[id],
        });
        id++;
      }
    }
  }
  return matches;
}

export const matches = generateMatches();

export const totalGameweeks = 14;
