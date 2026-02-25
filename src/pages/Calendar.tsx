import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { matches, teams } from "@/data/league";
import type { Match } from "@/data/league";
import MatchCard from "@/components/MatchCard";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

const teamById = Object.fromEntries(teams.map((t) => [t.id, t]));

const matchesByDate: Record<string, Match[]> = {};
for (const m of matches) {
  if (!matchesByDate[m.date]) matchesByDate[m.date] = [];
  matchesByDate[m.date].push(m);
}

const toKey = (d: Date): string =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const MONTH_NAMES = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
];

const DOW = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

function getMonthGrid(year: number, month: number): Date[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDow = (firstDay.getDay() + 6) % 7;
  const days: Date[] = [];

  for (let i = startDow - 1; i >= 0; i--) {
    days.push(new Date(year, month, -i));
  }
  for (let d = 1; d <= lastDay.getDate(); d++) {
    days.push(new Date(year, month, d));
  }
  const trailing = (7 - (days.length % 7)) % 7;
  for (let i = 1; i <= trailing; i++) {
    days.push(new Date(year, month + 1, i));
  }
  return days;
}

const Calendar = () => {
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(1);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  const grid = getMonthGrid(year, month);
  const todayKey = toKey(new Date());

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
  };

  return (
    <div className="animate-fade-in">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-xl font-semibold">
          {MONTH_NAMES[month]} {year}
        </h2>
        <div className="flex gap-1">
          <button
            onClick={prevMonth}
            aria-label="Предыдущий месяц"
            className="w-10 h-10 flex items-center justify-center rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <ChevronLeft className="w-4 h-4" aria-hidden="true" />
          </button>
          <button
            onClick={nextMonth}
            aria-label="Следующий месяц"
            className="w-10 h-10 flex items-center justify-center rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[560px]">
          {/* Day-of-week header */}
          <div className="grid grid-cols-7 mb-px">
            {DOW.map((d) => (
              <div
                key={d}
                className="text-center text-xs font-medium text-muted-foreground py-2"
              >
                {d}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 border-l border-t border-border rounded-b-lg overflow-hidden">
            {grid.map((date, i) => {
              const key = toKey(date);
              const dayMatches = matchesByDate[key] ?? [];
              const inMonth = date.getMonth() === month;
              const isToday = key === todayKey;

              return (
                <div
                  key={i}
                  className={`border-r border-b border-border min-h-[88px] p-1.5 ${
                    !inMonth ? "bg-muted/20" : ""
                  }`}
                >
                  {/* Day number */}
                  <div
                    className={`text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full mb-1 ${
                      isToday
                        ? "bg-accent text-accent-foreground"
                        : inMonth
                        ? "text-foreground"
                        : "text-muted-foreground/50"
                    }`}
                  >
                    {date.getDate()}
                  </div>

                  {/* Match chips */}
                  <div className="flex flex-col gap-0.5">
                    {[...dayMatches].sort((a, b) => a.time.localeCompare(b.time)).map((m) => {
                      const home = teamById[m.homeId];
                      const away = teamById[m.awayId];
                      const startTime = m.time.split("-")[0];
                      return (
                        <button
                          key={m.id}
                          onClick={() => setSelectedMatch(m)}
                          aria-label={`${home.name} — ${away.name}${m.played && m.result ? `, счёт ${m.result.setsHome}:${m.result.setsAway}` : `, начало ${startTime}`}, ${m.venue}`}
                          className={`w-full text-left text-[10px] leading-snug px-1 py-0.5 rounded transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                            m.played
                              ? "bg-sport-win/20 border-l-2 border-sport-win"
                              : "bg-accent/15 border-l-2 border-accent"
                          }`}
                        >
                          <div className="font-semibold truncate text-foreground">
                            {home.short} – {away.short}
                          </div>
                          <div className="text-foreground/70">
                            {m.played && m.result
                              ? `${m.result.setsHome}:${m.result.setsAway}`
                              : startTime}
                          </div>
                          <div className="text-muted-foreground truncate">{m.venue}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-4 mt-3 text-xs text-muted-foreground" aria-label="Обозначения">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-sm bg-sport-win/15 border border-sport-win/30 inline-block" aria-hidden="true" />
          Сыгран
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-sm bg-accent/15 border border-accent/30 inline-block" aria-hidden="true" />
          Предстоит
        </span>
      </div>

      {/* Match detail popup */}
      <Dialog open={!!selectedMatch} onOpenChange={(open) => { if (!open) setSelectedMatch(null); }}>
        <DialogContent className="p-0 gap-0 max-w-[600px] border-0 shadow-2xl rounded-xl overflow-hidden">
          <DialogTitle className="sr-only">
            {selectedMatch
              ? `Тур ${selectedMatch.gameweek}: ${teamById[selectedMatch.homeId]?.name} — ${teamById[selectedMatch.awayId]?.name}`
              : "Матч"}
          </DialogTitle>
          {selectedMatch && (
            <>
              <div className="px-5 py-3 pr-12 bg-card border-b border-border flex items-center justify-between">
                <span className="text-xs font-semibold text-accent uppercase tracking-widest">
                  Тур {selectedMatch.gameweek}
                </span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  selectedMatch.played
                    ? "bg-sport-win/15 text-sport-win"
                    : "bg-accent/15 text-accent"
                }`}>
                  {selectedMatch.played ? "Сыгран" : "Предстоит"}
                </span>
              </div>
              <MatchCard match={selectedMatch} linkTeams />
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Calendar;
