import { matches } from "@/data/league";
import { getTeamMatches, calcStandingsFromMatches } from "@/lib/standings";

export interface Streak {
  current: { type: "win" | "loss"; count: number } | null;
  longestWin: number;
  longestLoss: number;
}

export function getStreaks(teamId: number): Streak {
  const played = getTeamMatches(teamId).filter((m) => m.played);
  if (played.length === 0) return { current: null, longestWin: 0, longestLoss: 0 };

  let longestWin = 0, longestLoss = 0;
  let curWin = 0, curLoss = 0;

  for (const m of played) {
    const r = m.result!;
    const won = m.homeId === teamId ? r.setsHome > r.setsAway : r.setsAway > r.setsHome;
    if (won) {
      curWin++;
      curLoss = 0;
    } else {
      curLoss++;
      curWin = 0;
    }
    longestWin = Math.max(longestWin, curWin);
    longestLoss = Math.max(longestLoss, curLoss);
  }

  const current =
    curWin > 0
      ? { type: "win" as const, count: curWin }
      : { type: "loss" as const, count: curLoss };

  return { current, longestWin, longestLoss };
}

export interface SetStat {
  setNum: 1 | 2 | 3;
  won: number;
  lost: number;
  avgScored: number;
  avgConceded: number;
}

export function getSetPerformance(teamId: number): SetStat[] {
  const played = getTeamMatches(teamId).filter((m) => m.played);

  const stats = [
    { setNum: 1 as const, won: 0, lost: 0, totalScored: 0, totalConceded: 0 },
    { setNum: 2 as const, won: 0, lost: 0, totalScored: 0, totalConceded: 0 },
    { setNum: 3 as const, won: 0, lost: 0, totalScored: 0, totalConceded: 0 },
  ];

  for (const m of played) {
    m.result!.setScores.forEach((s, idx) => {
      const scored = m.homeId === teamId ? s.home : s.away;
      const conceded = m.homeId === teamId ? s.away : s.home;
      if (scored > conceded) stats[idx].won++; else stats[idx].lost++;
      stats[idx].totalScored += scored;
      stats[idx].totalConceded += conceded;
    });
  }

  return stats.map(({ setNum, won, lost, totalScored, totalConceded }) => {
    const total = won + lost;
    return {
      setNum,
      won,
      lost,
      avgScored: total > 0 ? totalScored / total : 0,
      avgConceded: total > 0 ? totalConceded / total : 0,
    };
  });
}

export interface PositionEntry {
  gameweek: number;
  position: number;
}

export function getPositionHistory(teamId: number): PositionEntry[] {
  const playedGws = [...new Set(matches.filter((m) => m.played).map((m) => m.gameweek))].sort(
    (a, b) => a - b,
  );

  return playedGws.map((gw) => {
    const subset = matches.filter((m) => m.gameweek <= gw);
    const standings = calcStandingsFromMatches(subset);
    const pos = standings.findIndex((s) => s.team.id === teamId) + 1;
    return { gameweek: gw, position: pos };
  });
}

export interface ComebackStats {
  comebacks: number;
  blownLeads: number;
  thirdSetWon: number;
  thirdSetLost: number;
  totalDecisive: number;
}

export function getComebackStats(teamId: number): ComebackStats {
  const played = getTeamMatches(teamId).filter((m) => m.played);
  let comebacks = 0, blownLeads = 0, thirdSetWon = 0, thirdSetLost = 0, totalDecisive = 0;

  for (const m of played) {
    const r = m.result!;
    const isHome = m.homeId === teamId;
    const mySets = isHome ? r.setsHome : r.setsAway;
    const oppSets = isHome ? r.setsAway : r.setsHome;

    if (Math.min(mySets, oppSets) !== 1) continue;

    totalDecisive++;
    const set1 = r.setScores[0];
    const wonSet1 = isHome ? set1.home > set1.away : set1.away > set1.home;
    const wonMatch = mySets > oppSets;

    const set3 = r.setScores[2];
    const wonSet3 = isHome ? set3.home > set3.away : set3.away > set3.home;
    if (wonSet3) thirdSetWon++; else thirdSetLost++;

    if (!wonSet1 && wonMatch) comebacks++;
    if (wonSet1 && !wonMatch) blownLeads++;
  }

  return { comebacks, blownLeads, thirdSetWon, thirdSetLost, totalDecisive };
}

export interface ScoringPatterns {
  closeSets: number;
  dominantSets: number;
  totalSets: number;
  avgMargin: number;
}

export function getScoringPatterns(teamId: number): ScoringPatterns {
  const played = getTeamMatches(teamId).filter((m) => m.played);
  let closeSets = 0, dominantSets = 0, totalMargin = 0;
  const totalSets = played.length * 3;

  for (const m of played) {
    for (const s of m.result!.setScores) {
      const margin = Math.abs(s.home - s.away);
      totalMargin += margin;
      if (margin <= 3) closeSets++;
      if (margin >= 10) dominantSets++;
    }
  }

  return {
    closeSets,
    dominantSets,
    totalSets,
    avgMargin: totalSets > 0 ? totalMargin / totalSets : 0,
  };
}

export interface FormEntry {
  won: boolean;
}

export function getForm(teamId: number, n: number): FormEntry[] {
  const played = getTeamMatches(teamId).filter((m) => m.played);
  return played.slice(-n).map((m) => {
    const r = m.result!;
    const won = m.homeId === teamId ? r.setsHome > r.setsAway : r.setsAway > r.setsHome;
    return { won };
  });
}
