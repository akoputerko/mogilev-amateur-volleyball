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
    1: { // Макиато - Dream team
        setScores: [
            {home: 25, away: 20},
            {home: 17, away: 25},
            {home: 25, away: 23},
        ],
    },
    2: { // Серволюкс - Сетка 37
        setScores: [
            {home: 25, away: 16},
            {home: 13, away: 25},
            {home: 25, away: 23},
        ],
    },
    3: { // Могилевгражданпроект - Отцы и дети
        setScores: [
            {home: 25, away: 23},
            {home: 25, away: 23},
            {home: 17, away: 25},
        ],
    },
    4: { // 33 - Могилевгипрозем
        setScores: [
            {home: 25, away: 23},
            {home: 15, away: 25},
            {home: 25, away: 16},
        ],
    },

    // --- Тур 2 ---
    5: { // Dream team - Серволюкс
        setScores: [
            {home: 25, away: 13},
            {home: 25, away: 16},
            {home: 25, away: 16},
        ],
    },
    6: { // Сетка 37 - Могилевгражданпроект
        setScores: [
            {home: 24, away: 26},
            {home: 22, away: 25},
            {home: 25, away: 18},
        ],
    },
    7: { // Отцы и дети - Могилевгипрозем
        setScores: [
            {home: 17, away: 25},
            {home: 17, away: 25},
            {home: 15, away: 25},
        ],
    },
    8: { // 33 - Макиато
        setScores: [
            {home: 20, away: 25},
            {home: 26, away: 24},
            {home: 20, away: 25},
        ],
    },

    // --- Тур 3 ---
    9: { // Макиато - Сетка 37
        setScores: [
            {home: 25, away: 27},
            {home: 25, away: 23},
            {home: 25, away: 16},
        ],
    },
    10: { // Серволюкс - Отцы и дети
        setScores: [
            {home: 13, away: 25},
            {home: 16, away: 25},
            {home: 18, away: 25},
        ],
    },
    11: { // 33 - Могилевгражданпроект
        setScores: [
            {home: 22, away: 25},
            {home: 21, away: 25},
            {home: 18, away: 25},
        ],
    },
    12: { // Могилевгипрозем - Dream team
        setScores: [
            {home: 19, away: 25},
            {home: 20, away: 25},
            {home: 25, away: 16},
        ],
    },

    // --- Тур 4 ---
    13: { // Dream team - Могилевгражданпроект
        setScores: [
            {home: 25, away: 12},
            {home: 17, away: 25},
            {home: 23, away: 25},
        ],
    },
    14: { // Могилевгипрозем - Сетка 37
        setScores: [
            {home: 22, away: 25},
            {home: 25, away: 18},
            {home: 25, away: 22},
        ],
    },
    15: { // Отцы и дети - Макиато
        setScores: [
            {home: 25, away: 15},
            {home: 25, away: 19},
            {home: 25, away: 15},
        ],
    },
    16: { // 33 - Серволюкс
        setScores: [
            {home: 25, away: 19},
            {home: 25, away: 17},
            {home: 25, away: 22},
        ],
    },

    // --- Тур 5 ---
    18: { // Серволюкс - Могилевгипрозем
        setScores: [
            {home: 23, away: 25},
            {home: 17, away: 25},
            {home: 25, away: 19},
        ],
    },
    19: { // Dream team - 33
        setScores: [
            {home: 25, away: 19},
            {home: 25, away: 14},
            {home: 25, away: 17},
        ],
    },
    20: { // Сетка 37 - Отцы и дети
        setScores: [
            {home: 12, away: 25},
            {home: 25, away: 21},
            {home: 17, away: 25},
        ],
    },
};
