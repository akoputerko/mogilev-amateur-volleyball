import { describe, it, expect } from "vitest";
import { formatSummaryText, type SummaryExportData } from "@/lib/export-text";
import { teams } from "@/data/league";

const makiato = teams[0];   // name: "Макиато",   short: "МАК"
const dreamTeam = teams[7]; // name: "Dream Team", short: "DRM"
const servoluks = teams[1]; // name: "Серволюкс",  short: "СРВ"

const mockSummaryData: SummaryExportData = {
  playedCount: 28,
  totalMatches: 56,
  totalSets: 84,
  totalPoints: 4012,
  avgPointsPerSet: "47.8",
  count30: 15,
  count21: 13,
  pct30: 54,
  pct21: 46,
  homeWins: 17,
  awayWins: 11,
  homeWinPct: 61,
  home30: 9,
  home21: 8,
  away21: 5,
  away30: 6,
  avgHomePtsPerSet: "24.2",
  avgAwayPtsPerSet: "23.1",
  leagueLeaders: [
    { label: "Больше всего побед",  teams: [makiato],             value: "6"  },
    { label: "Больше всего очков",  teams: [makiato, dreamTeam],  value: "16" },
  ],
  leagueRecords: [
    { label: "Самая напряжённая", value: "32:30", detail: "МАК - DRM, Тур 3" },
  ],
  resultMatrix: [
    ["self", { homeWon: true,  score: "3:0" }, null],
    [{ homeWon: false, score: "0:3" }, "self", null],
    [null, null, "self"],
  ],
  teams: [makiato, dreamTeam, servoluks],
};

describe("formatSummaryText", () => {
  it("includes the main header", () => {
    expect(formatSummaryText(mockSummaryData)).toContain("🏐 АНАЛИТИКА ЛИГИ: СВОДКА");
  });

  it("includes match overview numbers", () => {
    const text = formatSummaryText(mockSummaryData);
    expect(text).toContain("28 из 56");
    expect(text).toContain("84");
    expect(text).toContain("4012");
    expect(text).toContain("47.8");
  });

  it("includes result breakdown with percentages", () => {
    const text = formatSummaryText(mockSummaryData);
    expect(text).toContain("15");
    expect(text).toContain("54%");
    expect(text).toContain("13");
    expect(text).toContain("46%");
  });

  it("includes home/away split", () => {
    const text = formatSummaryText(mockSummaryData);
    expect(text).toContain("17");
    expect(text).toContain("11");
    expect(text).toContain("61%");
    expect(text).toContain("24.2");
    expect(text).toContain("23.1");
  });

  it("uses full team names in league leaders (not short names)", () => {
    const text = formatSummaryText(mockSummaryData);
    expect(text).toContain("Макиато");
    expect(text).toContain("Dream Team");
  });

  it("shows multiple tied leaders separated by comma", () => {
    expect(formatSummaryText(mockSummaryData)).toContain("Макиато, Dream Team");
  });

  it("includes league records", () => {
    const text = formatSummaryText(mockSummaryData);
    expect(text).toContain("32:30");
    expect(text).toContain("МАК - DRM, Тур 3");
  });

  it("includes results matrix section header and scores", () => {
    const text = formatSummaryText(mockSummaryData);
    expect(text).toContain("Матрица результатов");
    expect(text).toContain("3:0");
    expect(text).toContain("0:3");
  });
});

import {
  formatStatsText, formatTeamsText,
  type StatsExportData, type TeamsExportData,
} from "@/lib/export-text";

const mogilevgiprozem = teams[3]; // name: "Могилевгипрозем"

const mockStatsData: StatsExportData = {
  leagueCloseSets: 12,
  leagueDomSets: 8,
  leagueAvgMargin: "5.4",
  pctClose: 14,
  pctDom: 10,
  mostCloseTeams: [{ team: makiato,   closeSets: 5    }],
  mostDomTeams:   [{ team: dreamTeam, dominantSets: 4 }],
  leagueSetStats: [
    { setNum: 1, homeWinRate: 0.64, avgPoints: "47.2", avgMargin: "5.1" },
    { setNum: 2, homeWinRate: 0.57, avgPoints: "47.5", avgMargin: "5.2" },
    { setNum: 3, homeWinRate: 0.54, avgPoints: "48.6", avgMargin: "5.8" },
  ],
  decisiveCount: 13,
  decisivePct: 46,
  totalComebacks: 6,
  totalBlownLeads: 7,
  comebackRate: 46,
  mostComebackTeams: [{ team: dreamTeam, comebacks: 2   }],
  mostBlownTeams:    [{ team: makiato,   blownLeads: 3  }],
  longestWinStreaks:  [{ team: makiato,         longestWin: 5  }],
  longestLossStreaks: [{ team: mogilevgiprozem, longestLoss: 4 }],
  currentStreaks: [
    { team: makiato,   current: { type: "win",  count: 3 } },
    { team: dreamTeam, current: { type: "loss", count: 2 } },
  ],
  scoreDistribution: [["25:20", 8], ["25:17", 6]],
};

describe("formatStatsText", () => {
  it("includes the stats header", () => {
    expect(formatStatsText(mockStatsData)).toContain("🏐 АНАЛИТИКА ЛИГИ: СТАТИСТИКА");
  });

  it("includes set character counts and percentages", () => {
    const text = formatStatsText(mockStatsData);
    expect(text).toContain("12");
    expect(text).toContain("14%");
    expect(text).toContain("5.4");
  });

  it("uses full team names for leaders", () => {
    const text = formatStatsText(mockStatsData);
    expect(text).toContain("Макиато");
    expect(text).toContain("Dream Team");
    expect(text).toContain("Могилевгипрозем");
  });

  it("includes per-set stats for all 3 sets", () => {
    const text = formatStatsText(mockStatsData);
    expect(text).toContain("Партия 1");
    expect(text).toContain("Партия 2");
    expect(text).toContain("Партия 3");
    expect(text).toContain("64%");
  });

  it("includes score distribution", () => {
    const text = formatStatsText(mockStatsData);
    expect(text).toContain("25:20");
    expect(text).toContain("8 раз");
  });

  it("includes current streaks with full names", () => {
    const text = formatStatsText(mockStatsData);
    expect(text).toContain("Макиато");
    expect(text).toContain("3В");
    expect(text).toContain("Dream Team");
    expect(text).toContain("2П");
  });
});

const mockTeamsData: TeamsExportData = {
  teamForms: [
    { team: makiato,   form: [{ won: true }, { won: true }, { won: false }, { won: true }, { won: true  }] },
    { team: dreamTeam, form: [{ won: false}, { won: true }, { won: true  }, { won: false}, { won: true  }] },
  ],
  teamSetEfficiency: [
    {
      team: makiato,
      sets: [
        { setNum: 1, won: 5, lost: 2 },
        { setNum: 2, won: 4, lost: 3 },
        { setNum: 3, won: 3, lost: 4 },
      ],
    },
  ],
  teamPositionHistory: [
    { team: makiato, history: [{ gameweek: 1, position: 1 }, { gameweek: 2, position: 2 }] },
  ],
  teamAvgSetScores: [
    {
      team: makiato,
      avg: { avgScoredWon: 25.3, avgConcededWon: 19.1, avgScoredLost: 18.4, avgConcededLost: 24.7 },
    },
  ],
};

describe("formatTeamsText", () => {
  it("includes the teams header", () => {
    expect(formatTeamsText(mockTeamsData)).toContain("🏐 АНАЛИТИКА ЛИГИ: КОМАНДЫ");
  });

  it("uses full team names in form section", () => {
    const text = formatTeamsText(mockTeamsData);
    expect(text).toContain("Макиато");
    expect(text).toContain("Dream Team");
  });

  it("renders form as В/П chips separated by spaces", () => {
    expect(formatTeamsText(mockTeamsData)).toContain("В В П В В");
  });

  it("includes set efficiency percentages", () => {
    const text = formatTeamsText(mockTeamsData);
    expect(text).toContain("71%"); // 5/(5+2) rounded
    expect(text).toContain("П1");
    expect(text).toContain("П2");
    expect(text).toContain("П3");
  });

  it("includes position history in Т{n}→{pos} format", () => {
    const text = formatTeamsText(mockTeamsData);
    expect(text).toContain("Т1→1");
    expect(text).toContain("Т2→2");
  });

  it("includes avg set scores with correct values", () => {
    const text = formatTeamsText(mockTeamsData);
    expect(text).toContain("25.3");
    expect(text).toContain("19.1");
    expect(text).toContain("18.4");
    expect(text).toContain("24.7");
  });
});
