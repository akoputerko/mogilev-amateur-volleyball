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
// Also handle case variations
teamByName["Dream team"] = 7;

export const getTeam = (id: number) => teams.find((t) => t.id === id)!;

const rawSchedule: { gameweek: number; matches: { home: string; away: string; hall: string; address: string; day: string; time: string }[] }[] = [
  { gameweek: 1, matches: [
    { home: "Макиато", away: "Могилевгипрозем", hall: "ФОК Орловского", address: "ул. Орловского, 24а", day: "Воскресенье", time: "18:00-20:00" },
    { home: "Серволюкс", away: "Dream team", hall: "МГУ Кулешова", address: "ул. Космонавтов, 1", day: "Вторник", time: "19:00-21:00" },
    { home: "Могилевгражданпроект", away: "33", hall: "Зал МГП", address: "ул. Буденного, 11", day: "Среда", time: "18:00-20:00" },
    { home: "Отцы и дети", away: "Сетка 37", hall: "Школа 22", address: "ул. Вокзальная", day: "Среда", time: "17:30-20:00" },
  ]},
  { gameweek: 2, matches: [
    { home: "Макиато", away: "Dream team", hall: "ФОК Орловского", address: "ул. Орловского, 24а", day: "Воскресенье", time: "18:00-20:00" },
    { home: "Серволюкс", away: "33", hall: "МГУ Кулешова", address: "ул. Космонавтов, 1", day: "Вторник", time: "19:00-21:00" },
    { home: "Могилевгражданпроект", away: "Сетка 37", hall: "Зал МГП", address: "ул. Буденного, 11", day: "Пятница", time: "18:00-20:00" },
    { home: "Могилевгипрозем", away: "Отцы и дети", hall: "ФОК Орловского", address: "ул. Орловского, 24", day: "Воскресенье", time: "17:00-18:30" },
  ]},
  { gameweek: 3, matches: [
    { home: "Макиато", away: "33", hall: "ФОК Орловского", address: "ул. Орловского, 24а", day: "Воскресенье", time: "18:00-20:00" },
    { home: "Серволюкс", away: "Сетка 37", hall: "МГУ Кулешова", address: "ул. Космонавтов, 1", day: "Вторник", time: "19:00-21:00" },
    { home: "Могилевгипрозем", away: "Dream team", hall: "ФОК Орловского", address: "ул. Орловского, 24", day: "Воскресенье", time: "17:00-18:30" },
    { home: "Отцы и дети", away: "Могилевгражданпроект", hall: "Школа 22", address: "ул. Вокзальная", day: "Среда", time: "17:30-20:00" },
  ]},
  { gameweek: 4, matches: [
    { home: "Макиато", away: "Сетка 37", hall: "ФОК Орловского", address: "ул. Орловского, 24а", day: "Воскресенье", time: "18:00-20:00" },
    { home: "Серволюкс", away: "Могилевгражданпроект", hall: "МГУ Кулешова", address: "ул. Космонавтов, 1", day: "Вторник", time: "19:00-21:00" },
    { home: "Могилевгипрозем", away: "33", hall: "ФОК Орловского", address: "ул. Орловского, 24", day: "Воскресенье", time: "17:00-18:30" },
    { home: "Отцы и дети", away: "Dream team", hall: "Школа 22", address: "ул. Вокзальная", day: "Среда", time: "17:30-20:00" },
  ]},
  { gameweek: 5, matches: [
    { home: "Макиато", away: "Могилевгражданпроект", hall: "ФОК Орловского", address: "ул. Орловского, 24а", day: "Воскресенье", time: "18:00-20:00" },
    { home: "Серволюкс", away: "Отцы и дети", hall: "МГУ Кулешова", address: "ул. Космонавтов, 1", day: "Вторник", time: "19:00-21:00" },
    { home: "33", away: "Сетка 37", hall: "Зал МГУП", address: "ул. Шмидта, 5", day: "Пятница", time: "18:00-20:00" },
    { home: "Могилевгипрозем", away: "Dream team", hall: "ФОК Орловского", address: "ул. Орловского, 24", day: "Воскресенье", time: "17:00-18:30" },
  ]},
  { gameweek: 6, matches: [
    { home: "Макиато", away: "Отцы и дети", hall: "ФОК Орловского", address: "ул. Орловского, 24а", day: "Воскресенье", time: "18:00-20:00" },
    { home: "Серволюкс", away: "Могилевгипрозем", hall: "МГУ Кулешова", address: "ул. Космонавтов, 1", day: "Вторник", time: "19:00-21:00" },
    { home: "Могилевгражданпроект", away: "Dream team", hall: "Зал МГП", address: "ул. Буденного, 11", day: "Среда", time: "18:00-20:00" },
    { home: "33", away: "Сетка 37", hall: "Зал МГУП", address: "ул. Шмидта, 5", day: "Пятница", time: "18:00-20:00" },
  ]},
  { gameweek: 7, matches: [
    { home: "Макиато", away: "Серволюкс", hall: "ФОК Орловского", address: "ул. Орловского, 24а", day: "Воскресенье", time: "18:00-20:00" },
    { home: "Могилевгражданпроект", away: "Могилевгипрозем", hall: "Зал МГП", address: "ул. Буденного, 11", day: "Среда", time: "18:00-20:00" },
    { home: "Отцы и дети", away: "33", hall: "Школа 22", address: "ул. Вокзальная", day: "Среда", time: "17:30-20:00" },
    { home: "Сетка 37", away: "Dream team", hall: "ФОК Могилёвоблдорстрой", address: "ул. Вавилова, 15", day: "Суббота", time: "16:00-18:00" },
  ]},
  { gameweek: 8, matches: [
    { home: "Могилевгипрозем", away: "Макиато", hall: "ФОК Орловского", address: "ул. Орловского, 24", day: "Воскресенье", time: "17:00-18:30" },
    { home: "Dream team", away: "Серволюкс", hall: "Спутник", address: "ул. Якубовского, 20", day: "Пятница", time: "20:30-22:30" },
    { home: "33", away: "Могилевгражданпроект", hall: "Зал МГУП", address: "ул. Шмидта, 5", day: "Пятница", time: "18:00-20:00" },
    { home: "Сетка 37", away: "Отцы и дети", hall: "ФОК Могилёвоблдорстрой", address: "ул. Вавилова, 15", day: "Суббота", time: "16:00-18:00" },
  ]},
  { gameweek: 9, matches: [
    { home: "Dream team", away: "Макиато", hall: "Спутник", address: "ул. Якубовского, 20", day: "Пятница", time: "20:30-22:30" },
    { home: "33", away: "Серволюкс", hall: "Зал МГУП", address: "ул. Шмидта, 5", day: "Пятница", time: "18:00-20:00" },
    { home: "Сетка 37", away: "Могилевгражданпроект", hall: "ФОК Могилёвоблдорстрой", address: "ул. Вавилова, 15", day: "Суббота", time: "16:00-18:00" },
    { home: "Отцы и дети", away: "Могилевгипрозем", hall: "Школа 22", address: "ул. Вокзальная", day: "Среда", time: "17:30-20:00" },
  ]},
  { gameweek: 10, matches: [
    { home: "33", away: "Макиато", hall: "Зал МГУП", address: "ул. Шмидта, 5", day: "Пятница", time: "18:00-20:00" },
    { home: "Сетка 37", away: "Серволюкс", hall: "ФОК Могилёвоблдорстрой", address: "ул. Вавилова, 15", day: "Суббота", time: "16:00-18:00" },
    { home: "Dream team", away: "Могилевгипрозем", hall: "Спутник", address: "ул. Якубовского, 20", day: "Пятница", time: "20:30-22:30" },
    { home: "Могилевгражданпроект", away: "Отцы и дети", hall: "Зал МГП", address: "ул. Буденного, 11", day: "Среда", time: "18:00-20:00" },
  ]},
  { gameweek: 11, matches: [
    { home: "Сетка 37", away: "Макиато", hall: "ФОК Могилёвоблдорстрой", address: "ул. Вавилова, 15", day: "Суббота", time: "16:00-18:00" },
    { home: "Могилевгражданпроект", away: "Серволюкс", hall: "Зал МГП", address: "ул. Буденного, 11", day: "Пятница", time: "18:00-20:00" },
    { home: "33", away: "Могилевгипрозем", hall: "Зал МГУП", address: "ул. Шмидта, 5", day: "Пятница", time: "18:00-20:00" },
    { home: "Dream team", away: "Отцы и дети", hall: "Спутник", address: "ул. Якубовского, 20", day: "Пятница", time: "20:30-22:30" },
  ]},
  { gameweek: 12, matches: [
    { home: "Могилевгражданпроект", away: "Макиато", hall: "Зал МГП", address: "ул. Буденного, 11", day: "Среда", time: "18:00-20:00" },
    { home: "Отцы и дети", away: "Серволюкс", hall: "Школа 22", address: "ул. Вокзальная", day: "Среда", time: "17:30-20:00" },
    { home: "Сетка 37", away: "33", hall: "ФОК Могилёвоблдорстрой", address: "ул. Вавилова, 15", day: "Суббота", time: "16:00-18:00" },
    { home: "Dream team", away: "Могилевгипрозем", hall: "Спутник", address: "ул. Якубовского, 20", day: "Пятница", time: "20:30-22:30" },
  ]},
  { gameweek: 13, matches: [
    { home: "Отцы и дети", away: "Макиато", hall: "Школа 22", address: "ул. Вокзальная", day: "Среда", time: "17:30-20:00" },
    { home: "Могилевгипрозем", away: "Серволюкс", hall: "ФОК Орловского", address: "ул. Орловского, 24", day: "Воскресенье", time: "17:00-18:30" },
    { home: "Dream team", away: "Могилевгражданпроект", hall: "Спутник", address: "ул. Якубовского, 20", day: "Пятница", time: "20:30-22:30" },
    { home: "Сетка 37", away: "33", hall: "ФОК Могилёвоблдорстрой", address: "ул. Вавилова, 15", day: "Суббота", time: "16:00-18:00" },
  ]},
  { gameweek: 14, matches: [
    { home: "Серволюкс", away: "Макиато", hall: "МГУ Кулешова", address: "ул. Космонавтов, 1", day: "Вторник", time: "19:00-21:00" },
    { home: "Могилевгипрозем", away: "Могилевгражданпроект", hall: "ФОК Орловского", address: "ул. Орловского, 24", day: "Воскресенье", time: "17:00-18:30" },
    { home: "33", away: "Отцы и дети", hall: "Зал МГУП", address: "ул. Шмидта, 5", day: "Пятница", time: "18:00-20:00" },
    { home: "Dream team", away: "Сетка 37", hall: "Спутник", address: "ул. Якубовского, 20", day: "Пятница", time: "20:30-22:30" },
  ]},
];

function buildMatches(): Match[] {
  const result: Match[] = [];
  let id = 0;
  for (const gw of rawSchedule) {
    for (const m of gw.matches) {
      const homeId = teamByName[m.home];
      const awayId = teamByName[m.away];
      result.push({
        id: id++,
        gameweek: gw.gameweek,
        homeId,
        awayId,
        venue: m.hall,
        address: m.address,
        day: m.day,
        time: m.time,
        played: false,
      });
    }
  }
  return result;
}

export const matches = buildMatches();
export const totalGameweeks = 14;
