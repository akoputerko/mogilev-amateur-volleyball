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
