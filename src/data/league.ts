import { rawSchedule } from "./schedule";
import { matchResults } from "./results";

export interface Team {
  id: number;
  name: string;
  short: string;
  color: string;
  hall: string;
  hallAddress: string;
  trainTime: string;
  trainDays: string[];
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
  day: string;
  date: string; // YYYY-MM-DD
  time: string;
  played: boolean;
  result?: MatchResult;
}

export const teams: Team[] = [
  { id: 0, name: "Макиато", short: "МАК", color: "30 60% 40%", hall: "ФОК Орловского", hallAddress: "ул. Орловского, 24а", trainTime: "20:00-22:00", trainDays: ["Четверг"] },
  { id: 1, name: "Серволюкс", short: "СРВ", color: "210 70% 45%", hall: "МГУ Кулешова", hallAddress: "ул. Космонавтов, 1", trainTime: "19:00-21:00", trainDays: ["Вторник"] },
  { id: 2, name: "Могилевгражданпроект", short: "МГП", color: "160 50% 35%", hall: "Зал МГП", hallAddress: "ул. Буденного, 11", trainTime: "18:00-20:00", trainDays: ["Среда"] },
  { id: 3, name: "Могилевгипрозем", short: "МГЗ", color: "0 0% 30%", hall: "ФОК Орловского", hallAddress: "ул. Орловского, 24", trainTime: "17:00-18:30", trainDays: ["Воскресенье"] },
  { id: 4, name: "Отцы и дети", short: "ОиД", color: "0 65% 48%", hall: "Школа 22", hallAddress: "ул. Вокзальная", trainTime: "17:30-20:00", trainDays: ["Среда"] },
  { id: 5, name: "33", short: "33", color: "270 50% 50%", hall: "Зал МГУП", hallAddress: "ул. Шмидта, 5", trainTime: "18:00-20:00", trainDays: ["Пятница"] },
  { id: 6, name: "Сетка 37", short: "С37", color: "130 55% 38%", hall: "ФОК Могилёвоблдорстрой", hallAddress: "ул. Вавилова, 15", trainTime: "16:00-18:00", trainDays: ["Суббота"] },
  { id: 7, name: "Dream Team", short: "DRM", color: "45 85% 50%", hall: "Спутник", hallAddress: "ул. Якубовского, 20", trainTime: "20:30-22:30", trainDays: ["Пятница"] },
];

const teamByName: Record<string, number> = {};
teams.forEach((t) => { teamByName[t.name] = t.id; });
// Handle case variation used in schedule
teamByName["Dream team"] = 7;

export const getTeam = (id: number) => teams.find((t) => t.id === id)!;

function parseDateDMY(date: string): string {
  const [dd, mm, yyyy] = date.split(".");
  return `${yyyy}-${mm}-${dd}`;
}

function buildMatches(): Match[] {
  const result: Match[] = [];
  let id = 0;
  for (const gw of rawSchedule) {
    for (const m of gw.matches) {
      const key = `GW${gw.gameweek}: ${m.home} - ${m.away}`;
      const entry = matchResults[key];
      result.push({
        id: id++,
        gameweek: gw.gameweek,
        homeId: teamByName[m.home],
        awayId: teamByName[m.away],
        venue: m.hall,
        address: m.address,
        day: m.day,
        date: parseDateDMY(m.date),
        time: m.time,
        played: entry !== undefined,
        result: entry,
      });
    }
  }
  return result;
}

export const matches = buildMatches();
export const totalGameweeks = 14;

const allDates = matches.map((m) => m.date).sort();
export const seasonStart = allDates[0];
const lastMatchDate = new Date(allDates[allDates.length - 1]);
lastMatchDate.setDate(lastMatchDate.getDate() + 7);
export const seasonEnd = lastMatchDate.toISOString().slice(0, 10);
