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

    // --- Тур 6 ---
    21: { // Могилевгражданпроект - Серволюкс
        setScores: [
            {home: 25, away: 21},
            {home: 23, away: 25},
            {home: 25, away: 21},
        ],
    },
    22: { // Могилевгипрозем - Макиато
        setScores: [
            {home: 18, away: 25},
            {home: 21, away: 25},
            {home: 20, away: 25},
        ],
    },
    23: { // 33 - Сетка 37
        setScores: [
            {home: 23, away: 25},
            {home: 19, away: 25},
            {home: 29, away: 31},
        ],
    },
    24: { // Отцы и дети - Dream team
        setScores: [
            {home: 25, away: 27},
            {home: 25, away: 17},
            {home: 22, away: 25},
        ],
    },

    // --- Тур 8 ---
    33: { // Серволюкс - Dream team
        setScores: [
            {home: 26, away: 28},
            {home: 16, away: 25},
            {home: 25, away: 19},
        ],
    },

    // --- Тур 7 ---
    17: { // Макиато - Могилевгражданпроект
        setScores: [
            {home: 25, away: 10},
            {home: 25, away: 21},
            {home: 25, away: 19},
        ],
    },
    25: { // Макиато - Серволюкс
        setScores: [
            {home: 25, away: 17},
            {home: 25, away: 9},
            {home: 25, away: 23},
        ],
    },
    26: { // Dream team - Сетка 37
        setScores: [
            {home: 26, away: 24},
            {home: 25, away: 23},
            {home: 25, away: 23},
        ],
    },
    27: { // 33 - Отцы и дети
        setScores: [
            {home: 25, away: 19},
            {home: 25, away: 22},
            {home: 23, away: 25},
        ],
    },
    28: { // Могилевгипрозем - Могилевгражданпроект
        setScores: [
            {home: 25, away: 22},
            {home: 21, away: 25},
            {home: 19, away: 25},
        ],
    },

    // --- Тур 8 (продолжение) ---
    29: { // Dream team - Макиато
        setScores: [
            {home: 25, away: 16},
            {home: 12, away: 25},
            {home: 25, away: 20},
        ],
    },
    30: { // Сетка 37 - Серволюкс
        setScores: [
            {home: 25, away: 9},
            {home: 25, away: 13},
            {home: 17, away: 25},
        ],
    },
    31: { // Отцы и дети - Могилевгражданпроект
        setScores: [
            {home: 25, away: 22},
            {home: 25, away: 15},
            {home: 25, away: 20},
        ],
    },

    // --- Тур 9 ---
    34: { // Могилевгражданпроект - Сетка 37
        setScores: [
            {home: 22, away: 25},
            {home: 26, away: 24},
            {home: 25, away: 21},
        ],
    },
    35: { // Могилевгипрозем - Отцы и дети
        setScores: [
            {home: 17, away: 25},
            {home: 12, away: 25},
            {home: 18, away: 25},
        ],
    },
    36: { // Макиато - 33
        setScores: [
            {home: 25, away: 21},
            {home: 27, away: 25},
            {home: 25, away: 18},
        ],
    },

    // --- Тур 10 ---
    37: { // Сетка 37 - Макиато
        setScores: [
            {home: 21, away: 25},
            {home: 17, away: 25},
            {home: 23, away: 25},
        ],
    },
    38: { // Отцы и дети - Серволюкс
        setScores: [
            {home: 25, away: 16},
            {home: 25, away: 12},
            {home: 20, away: 25},
        ],
    },
    39: { // Могилевгражданпроект - 33
        setScores: [
            {home: 25, away: 17},
            {home: 25, away: 18},
            {home: 25, away: 23},
        ],
    },

    // --- Тур 11 ---
    41: { // Могилевгражданпроект - Макиато
        setScores: [
            {home: 26, away: 24},
            {home: 18, away: 25},
            {home: 23, away: 25},
        ],
    },
    42: { // Могилевгипрозем - Серволюкс
        setScores: [
            {home: 25, away: 15},
            {home: 25, away: 16},
            {home: 25, away: 19},
        ],
    },
    43: { // 33 - Dream team
        setScores: [
            {home: 19, away: 25},
            {home: 25, away: 19},
            {home: 22, away: 25},
        ],
    },
    44: { // Отцы и дети - Сетка 37
        setScores: [
            {home: 25, away: 19},
            {home: 25, away: 18},
            {home: 27, away: 25},
        ],
    },
};
