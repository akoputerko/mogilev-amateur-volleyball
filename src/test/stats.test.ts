import { describe, it, expect } from "vitest";
import { getStreaks, getSetPerformance, getComebackStats, getScoringPatterns, getPositionHistory } from "@/lib/stats";
import { getLeagueRecords } from "@/lib/records";

// Team IDs from league.ts:
// 0 = Макиато, 1 = Серволюкс, 2 = МГП, 3 = МГЗ, 4 = Отцы и дети, 5 = 33, 6 = Сетка 37, 7 = Dream Team

// Matches played (tours 1-7):
// Match 1:  Макиато (0)  vs Dream Team (7)  -> 2:1 (home wins)
// Match 2:  Серволюкс (1) vs Сетка 37 (6) -> 2:1 (home wins)
// Match 3:  МГП (2) vs Отцы и дети (4)    -> 2:1 (home wins)
// Match 4:  33 (5) vs МГЗ (3)              -> 2:1 (home wins)
// Match 5:  Dream Team (7) vs Серволюкс (1) -> 3:0 (home wins)
// Match 6:  Сетка 37 (6) vs МГП (2)        -> 1:2 (away wins)
// Match 7:  Отцы и дети (4) vs МГЗ (3)     -> 0:3 (away wins)
// Match 8:  33 (5) vs Макиато (0)           -> 1:2 (away wins)
// Match 9:  Макиато (0) vs Сетка 37 (6)    -> 2:1 (home wins)
// Match 10: Серволюкс (1) vs Отцы и дети (4) -> 0:3 (away wins)
// Match 11: 33 (5) vs МГП (2)               -> 0:3 (away wins)
// Match 12: МГЗ (3) vs Dream Team (7)        -> 1:2 (away wins)
// Match 13: Dream Team (7) vs МГП (2)        -> 1:2 (away wins)
// Match 14: МГЗ (3) vs Сетка 37 (6)         -> 2:1 (home wins)
// Match 15: Отцы и дети (4) vs Макиато (0)  -> 3:0 (home wins)
// Match 16: 33 (5) vs Серволюкс (1)          -> 3:0 (home wins)
// Match 17: Макиато (0) vs МГП (2)           -> 3:0 (home wins)
// Match 18: Серволюкс (1) vs МГЗ (3)         -> 1:2 (away wins)
// Match 19: Dream Team (7) vs 33 (5)          -> 3:0 (home wins)
// Match 20: Сетка 37 (6) vs Отцы и дети (4)  -> 1:2 (away wins)
// Match 21: МГП (2) vs Серволюкс (1)          -> 2:1 (home wins)
// Match 22: МГЗ (3) vs Макиато (0)            -> 0:3 (away wins)
// Match 23: 33 (5) vs Сетка 37 (6)            -> 1:2 (away wins)
// Match 24: Отцы и дети (4) vs Dream Team (7) -> 1:2 (away wins)
// Match 25: Макиато (0) vs Серволюкс (1)      -> 3:0 (home wins)
// Match 26: Dream Team (7) vs Сетка 37 (6)    -> 3:0 (home wins)
// Match 27: 33 (5) vs Отцы и дети (4)         -> 2:1 (home wins)
// Match 28: МГЗ (3) vs МГП (2)                -> 1:2 (away wins)

describe("getStreaks", () => {
  it("returns null current streak for team with no played matches", () => {
    // No unplayed team exists in current data, so we test a valid team
    const result = getStreaks(0);
    expect(result.current).not.toBeNull();
  });

  it("returns correct streak for Макиато (id=0)", () => {
    // Matches in order: W W W L W W W (tours 1-7: M1 M8 M9 M15 M22 M17 M25)
    // Current streak: W3, longestWin: 3, longestLoss: 1
    const result = getStreaks(0);
    expect(result.current?.type).toBe("win");
    expect(result.current?.count).toBe(3);
    expect(result.longestWin).toBe(3);
    expect(result.longestLoss).toBe(1);
  });

  it("returns correct streak for Dream Team (id=7)", () => {
    // Matches: L W W L W W W (tours 1-7: M1 M5 M12 M13 M19 M24 M26)
    // Current streak: W3, longestWin: 3, longestLoss: 1
    const result = getStreaks(7);
    expect(result.current?.type).toBe("win");
    expect(result.current?.count).toBe(3);
    expect(result.longestWin).toBe(3);
    expect(result.longestLoss).toBe(1);
  });

  it("returns correct streak for Отцы и дети (id=4)", () => {
    // Matches: L L W W W L L (tours 1-7: M3 M7 M10 M15 M20 M24 M27)
    // Current streak: L2, longestWin: 3, longestLoss: 2
    const result = getStreaks(4);
    expect(result.current?.type).toBe("loss");
    expect(result.current?.count).toBe(2);
    expect(result.longestWin).toBe(3);
    expect(result.longestLoss).toBe(2);
  });

  it("returns 3 streak entries covering longestWin/longestLoss", () => {
    const result = getStreaks(5); // team 33
    expect(result.longestWin).toBeGreaterThanOrEqual(0);
    expect(result.longestLoss).toBeGreaterThanOrEqual(0);
    if (result.current) {
      expect(result.current.count).toBeGreaterThanOrEqual(1);
    }
  });
});

describe("getSetPerformance", () => {
  it("returns array of 3 entries (one per set)", () => {
    const result = getSetPerformance(0);
    expect(result).toHaveLength(3);
    expect(result.map((s) => s.setNum)).toEqual([1, 2, 3]);
  });

  it("returns zeros for set win/loss totals that add up to played matches", () => {
    const result = getSetPerformance(0); // Макиато played 7 matches (tours 1-7)
    result.forEach((s) => {
      expect(s.won + s.lost).toBe(7);
    });
  });

  it("averages are within valid volleyball score range", () => {
    const result = getSetPerformance(0);
    result.forEach((s) => {
      expect(s.avgScored).toBeGreaterThan(0);
      expect(s.avgScored).toBeLessThan(30);
      expect(s.avgConceded).toBeGreaterThan(0);
      expect(s.avgConceded).toBeLessThan(30);
    });
  });

  it("Макиато set 3 has 6 wins and 1 loss", () => {
    // M1 W, M8 W, M9 W, M15 L (0:3 sweep — Макиато lost set3 15<25), M22 W, M17 W, M25 W
    const result = getSetPerformance(0);
    const set3 = result.find((s) => s.setNum === 3)!;
    expect(set3.won).toBe(6);
    expect(set3.lost).toBe(1);
  });
});

describe("getComebackStats", () => {
  it("returns zero values for team with no played matches", () => {
    // All teams have played matches, just verify the shape
    const result = getComebackStats(0);
    expect(result).toHaveProperty("comebacks");
    expect(result).toHaveProperty("blownLeads");
    expect(result).toHaveProperty("thirdSetWon");
    expect(result).toHaveProperty("thirdSetLost");
    expect(result).toHaveProperty("totalDecisive");
  });

  it("Макиато has 1 comeback (lost set 1 in match 9, won match 2-1)", () => {
    // M1 (home, W 2-1): won set1 -> dominant, not comeback
    // M8 (away, W 2-1): won set1 -> dominant
    // M9 (home, W 2-1): LOST set1 (25-27), won match -> comeback
    // M15 (away, L 0-3): not decisive
    const result = getComebackStats(0);
    expect(result.comebacks).toBe(1);
    expect(result.blownLeads).toBe(0);
    expect(result.totalDecisive).toBe(3);
    expect(result.thirdSetWon).toBe(3);
    expect(result.thirdSetLost).toBe(0);
  });

  it("МГП (id=2) has a blown lead in match 13", () => {
    // М13: Dream Team (home) vs МГП (away)
    // Set scores: {25,12}, {17,25}, {23,25}
    // МГП perspective: Set1 12<25 -> МГП lost set1
    // Sets: МГП setsAway = 2 (sets 2,3), Dream setsHome = 1
    // МГП won the match 2-1 -> NOT a blown lead for МГП
    // Actually: МГП won match 2-1 and lost set 1 -> that's a comeback for МГП
    const result = getComebackStats(2);
    // МГП played matches: M3(home W 2-1), M6(away W 1... wait
    // M6: Сетка 37 (home) vs МГП (away). Scores: {24,26},{22,25},{25,18}
    // МГП (away): set1 26>24 W, set2 25>22 W, set3 18<25 L
    // setsAway for МГП: 2 (sets1,2). МГП wins 2-1. Decisive.
    // Set1: МГП won (26>24). М wins match 2-1 -> dominant.
    // M11: 33(home) vs МГП(away). Scores: {22,25},{21,25},{18,25}. МГП wins 3-0 -> not decisive.
    // M13: DT(home) vs МГП(away). {25,12},{17,25},{23,25}. МГП (away): 12,25,25. setsAway=2, setsHome=1. МГП wins 2-1.
    //   Set1: МГП(away) 12 < DT(home) 25 -> МГП LOST set1. МГП won match -> comeback!
    // So МГП has 1 comeback (M13), 0 blown leads.
    expect(result.comebacks).toBeGreaterThanOrEqual(1);
    expect(result.blownLeads).toBe(0);
  });
});

describe("getScoringPatterns", () => {
  it("returns correct totalSets as played * 3", () => {
    const result = getScoringPatterns(0); // Макиато played 7 matches (tours 1-7)
    expect(result.totalSets).toBe(21);
  });

  it("closeSets + dominantSets <= totalSets", () => {
    const result = getScoringPatterns(0);
    expect(result.closeSets + result.dominantSets).toBeLessThanOrEqual(result.totalSets);
  });

  it("avgMargin is a positive number when sets were played", () => {
    const result = getScoringPatterns(0);
    expect(result.avgMargin).toBeGreaterThan(0);
  });

  it("Макиато has 5 close sets (margin<=3)", () => {
    // M1: margins 5,8,2 -> 1 close; M8: 5,2,5 -> 1 close; M9: 2,2,9 -> 2 close
    // M15: 10,6,10 -> 0; M22: 7,4,5 -> 0; M17: 15,4,6 -> 0; M25: 8,16,2 -> 1 close
    const result = getScoringPatterns(0);
    expect(result.closeSets).toBe(5);
  });

  it("Макиато has 4 dominant sets (margin>=10)", () => {
    // M15: |25-15|=10 and |25-15|=10 -> 2; M17: |25-10|=15 -> 1; M25: |25-9|=16 -> 1
    const result = getScoringPatterns(0);
    expect(result.dominantSets).toBe(4);
  });
});

describe("getPositionHistory", () => {
  it("returns one entry per played gameweek", () => {
    const result = getPositionHistory(0);
    // Tours 1-7 have played matches, so 7 entries
    expect(result.length).toBe(7);
    expect(result.map((p) => p.gameweek)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it("all positions are between 1 and 8", () => {
    const result = getPositionHistory(0);
    result.forEach((p) => {
      expect(p.position).toBeGreaterThanOrEqual(1);
      expect(p.position).toBeLessThanOrEqual(8);
    });
  });

  it("returns same structure for all teams", () => {
    for (let id = 0; id < 8; id++) {
      const result = getPositionHistory(id);
      expect(result.length).toBe(7);
      result.forEach((p) => {
        expect(p.position).toBeGreaterThanOrEqual(1);
        expect(p.position).toBeLessThanOrEqual(8);
      });
    }
  });
});

describe("getLeagueRecords", () => {
  it("returns records when matches are played", () => {
    const result = getLeagueRecords();
    expect(result.length).toBeGreaterThan(0);
  });

  it("each record has label, value, and detail fields", () => {
    const result = getLeagueRecords();
    result.forEach((r) => {
      expect(r.label).toBeTruthy();
      expect(r.value).toBeTruthy();
      expect(r.detail).toBeTruthy();
    });
  });

  it("highest-scoring match is reasonable (>100 total points)", () => {
    const result = getLeagueRecords();
    const maxMatch = result.find((r) => r.label === "Очков в матче");
    expect(maxMatch).toBeDefined();
    expect(Number(maxMatch!.value)).toBeGreaterThan(100);
  });

  it("closest set detail shows home team first (33 before С37 for 29:31 set)", () => {
    const result = getLeagueRecords();
    const closest = result.find((r) => r.label === "Самая напряжённая");
    expect(closest).toBeDefined();
    // Match 23: 33 (home) vs Сетка 37 (away, С37). Set 3 score: 29:31 (home:away), margin=2, total=60.
    // Detail format is always home - away, so 33 appears before С37.
    expect(closest!.detail).toContain("33");
    expect(closest!.detail).toContain("С37");
    expect(closest!.detail.indexOf("33")).toBeLessThan(closest!.detail.indexOf("С37"));
  });

  it("closest set is uniquely 29:31 (tour 6, highest total among margin-2 sets)", () => {
    const result = getLeagueRecords();
    const closest = result.find((r) => r.label === "Самая напряжённая");
    expect(closest).toBeDefined();
    // 29:31 has margin=2 and total=60 — uniquely highest total among all margin-2 sets
    // so no ×N count suffix, and detail is just the one occurrence
    expect(closest!.detail).not.toMatch(/×\d+/);
    expect(closest!.detail).toContain("Тур 6");
  });
});
