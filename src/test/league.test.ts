import { describe, it, expect } from "vitest";
import { matches, teams, totalGameweeks, getTeam } from "@/data/league";

describe("buildMatches", () => {
  it("builds 56 matches from the schedule", () => {
    expect(matches).toHaveLength(56);
  });

  it("every match has valid homeId and awayId from the teams array", () => {
    const teamIds = new Set(teams.map((t) => t.id));
    matches.forEach((m) => {
      expect(teamIds.has(m.homeId)).toBe(true);
      expect(teamIds.has(m.awayId)).toBe(true);
    });
  });

  it("every match has a date in YYYY-MM-DD format", () => {
    matches.forEach((m) => {
      expect(m.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  it("match dates are after 2025-01-01 (season start sanity check)", () => {
    matches.forEach((m) => {
      expect(m.date >= "2025-01-01").toBe(true);
    });
  });

  it("played matches have a result with exactly 3 set scores", () => {
    const played = matches.filter((m) => m.played);
    expect(played.length).toBeGreaterThan(0);
    played.forEach((m) => {
      expect(m.result).toBeDefined();
      expect(m.result!.setScores).toHaveLength(3);
    });
  });

  it("setsHome + setsAway equals 3 for all played matches", () => {
    matches.filter((m) => m.played).forEach((m) => {
      expect(m.result!.setsHome + m.result!.setsAway).toBe(3);
    });
  });

  it("setsHome and setsAway match the actual setScores", () => {
    matches.filter((m) => m.played).forEach((m) => {
      const r = m.result!;
      const computedHome = r.setScores.filter((s) => s.home > s.away).length;
      const computedAway = r.setScores.filter((s) => s.away > s.home).length;
      expect(r.setsHome).toBe(computedHome);
      expect(r.setsAway).toBe(computedAway);
    });
  });

  it("home team is never the same as away team", () => {
    matches.forEach((m) => {
      expect(m.homeId).not.toBe(m.awayId);
    });
  });

  it("match IDs are unique", () => {
    const ids = matches.map((m) => m.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it("gameweek values are between 1 and totalGameweeks", () => {
    matches.forEach((m) => {
      expect(m.gameweek).toBeGreaterThanOrEqual(1);
      expect(m.gameweek).toBeLessThanOrEqual(totalGameweeks);
    });
  });
});

describe("totalGameweeks", () => {
  it("equals 14 for the 2025/26 season schedule", () => {
    expect(totalGameweeks).toBe(14);
  });
});

describe("getTeam", () => {
  it("returns the correct team for a valid id", () => {
    const team = getTeam(0);
    expect(team.name).toBe("Макиато");
    expect(team.id).toBe(0);
  });

  it("throws for an invalid team id", () => {
    expect(() => getTeam(999)).toThrow();
  });
});
