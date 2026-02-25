// Match results for the 2025/26 season.
//
// After each game, add an entry here using the match id from schedule.ts:
//   [id]: { setScores }
//
// Always 3 sets per match. Set winner is determined by score (home > away → home wins that set).
// setScores: exactly 3 entries, one per set played, in order

type SetScore = { home: number; away: number };
type ResultEntry = {
  setScores: [SetScore, SetScore, SetScore]; // always 3 sets
};

export const matchResults: Record<number, ResultEntry> = {

  // --- Тур 1 ---
  // 1: { // Макиато - Dream team
  //   setScores: [
  //     { home: 25, away: 18 },
  //     { home: 22, away: 25 },
  //     { home: 25, away: 20 },
  //   ],
  // },
  2: { // Серволюкс - Сетка 37
    setScores: [
      { home: 25, away: 16 },
      { home: 13, away: 25 },
      { home: 25, away: 23 },
    ],
  },
  3: { // Могилевгражданпроект - Отцы и дети
    setScores: [
      { home: 25, away: 23 },
      { home: 25, away: 23 },
      { home: 17, away: 25 },
    ],
  },
  // 4: { // Могилевгипрозем - 33
  //   setScores: [
  //     { home: 25, away: 20 },
  //     { home: 25, away: 17 },
  //     { home: 25, away: 21 },
  //   ],
  // },

};
