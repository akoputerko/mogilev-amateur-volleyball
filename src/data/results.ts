// Match results for the 2025/26 season.
//
// After each game, add an entry here using the match id from schedule.ts:
//   [id]: { setsHome, setsAway, setScores }
//
// Always 3 sets per match.
// setsHome / setsAway: sets won by each side — either 3-0 or 2-1 (and mirrored 0-3 / 1-2)
// setScores: exactly 3 entries, one per set played, in order

type SetScore = { home: number; away: number };
type ResultEntry = {
  setsHome: number;
  setsAway: number;
  setScores: [SetScore, SetScore, SetScore]; // always 3 sets
};

export const matchResults: Record<number, ResultEntry> = {

  // --- Тур 1 ---
  1: { // Макиато - Dream team
    setsHome: 2, setsAway: 1,
    setScores: [
      { home: 25, away: 18 },
      { home: 22, away: 25 },
      { home: 25, away: 20 },
    ],
  },
  2: { // Серволюкс - Сетка 37
    setsHome: 3, setsAway: 0,
    setScores: [
      { home: 25, away: 17 },
      { home: 25, away: 20 },
      { home: 25, away: 15 },
    ],
  },
  3: { // Могилевгражданпроект - Отцы и дети
    setsHome: 2, setsAway: 1,
    setScores: [
      { home: 25, away: 22 },
      { home: 18, away: 25 },
      { home: 25, away: 19 },
    ],
  },
  4: { // Могилевгипрозем - 33
    setsHome: 3, setsAway: 0,
    setScores: [
      { home: 25, away: 20 },
      { home: 25, away: 17 },
      { home: 25, away: 21 },
    ],
  },

};
