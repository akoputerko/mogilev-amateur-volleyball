import { useState } from "react";
import { calcStandings, getTeamMatches, getUpcoming, type TeamStanding } from "@/lib/standings";
import { getTeam, type Match } from "@/data/league";
import { ChevronRight, Trophy, X, Calendar, Info } from "lucide-react";

const StandingsPage = () => {
  const standings = calcStandings();
  const [selected, setSelected] = useState<TeamStanding | null>(null);

  return (
    <div className="animate-fade-in space-y-4">
      {/* Scoring rules */}
      <div className="bg-card rounded-lg border border-border p-4">
        <h4 className="font-display text-sm text-muted-foreground mb-3 flex items-center gap-2">
          <Info className="w-4 h-4" aria-hidden="true" /> Система начисления очков
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div className="bg-sport-win/10 border border-sport-win/20 rounded-md px-3 py-2 text-center">
            <div className="text-xs text-muted-foreground">Победа 3-0</div>
            <div className="font-display text-lg font-bold text-sport-win">3 очка</div>
          </div>
          <div className="bg-sport-win/10 border border-sport-win/20 rounded-md px-3 py-2 text-center">
            <div className="text-xs text-muted-foreground">Победа 2-1</div>
            <div className="font-display text-lg font-bold text-sport-win">2 очка</div>
          </div>
          <div className="bg-sport-loss/10 border border-sport-loss/20 rounded-md px-3 py-2 text-center">
            <div className="text-xs text-muted-foreground">Поражение 1-2</div>
            <div className="font-display text-lg font-bold text-sport-loss">1 очко</div>
          </div>
          <div className="bg-sport-loss/10 border border-sport-loss/20 rounded-md px-3 py-2 text-center">
            <div className="text-xs text-muted-foreground">Поражение 0-3</div>
            <div className="font-display text-lg font-bold text-sport-loss">0 очков</div>
          </div>
        </div>
        <p className="text-[11px] text-muted-foreground/70 mt-2.5 text-center">Всегда 3 партии в матче · Плей-офф: топ-4 команды</p>
      </div>

      {/* Legend */}
      <div className="flex gap-4 text-xs text-muted-foreground" aria-label="Обозначения таблицы">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-1.5 rounded-sm bg-amber-400" aria-hidden="true" /> Лидер
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-1.5 rounded-sm bg-sky-500" aria-hidden="true" /> Плей-офф
        </span>
      </div>

      {/* Table */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="sport-gradient text-primary-foreground text-left">
                <th scope="col" className="px-3 py-3 font-semibold text-xs tracking-wider">#</th>
                <th scope="col" className="px-3 py-3 font-semibold text-xs tracking-wider">Команда</th>
                <th scope="col" className="px-3 py-3 font-semibold text-xs tracking-wider text-center" title="Сыграно">И</th>
                <th scope="col" className="px-3 py-3 font-semibold text-xs tracking-wider text-center" title="Победы">В</th>
                <th scope="col" className="px-3 py-3 font-semibold text-xs tracking-wider text-center" title="Поражения">П</th>
                <th scope="col" className="px-3 py-3 font-semibold text-xs tracking-wider text-center">Партии</th>
                <th scope="col" className="px-3 py-3 font-semibold text-xs tracking-wider text-center" title="Разница партий">+/−</th>
                <th scope="col" className="px-3 py-3 font-semibold text-xs tracking-wider text-center font-bold">Очки</th>
                <th scope="col" className="px-3 py-3 w-8"><span className="sr-only">Подробнее</span></th>
              </tr>
            </thead>
            <tbody>
              {standings.map((s, i) => {
                const pos = i + 1;
                const setDiff = s.setsWon - s.setsLost;
                const rowHighlight =
                  pos === 1
                    ? "border-l-[3px] border-l-amber-400 bg-amber-400/5"
                    : pos <= 4
                      ? "border-l-[3px] border-l-sky-500 bg-sky-500/5"
                      : "";

                return (
                  <tr
                    key={s.team.id}
                    onClick={() => setSelected(s)}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setSelected(s); } }}
                    tabIndex={0}
                    aria-label={`${s.team.name}, место ${pos}, очков ${s.points}`}
                    className={`border-t border-border cursor-pointer transition-colors hover:bg-secondary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent ${rowHighlight} ${
                      selected?.team.id === s.team.id ? "bg-secondary" : ""
                    }`}
                    style={{ animationDelay: `${i * 40}ms` }}
                  >
                    <td className={`px-3 py-3 font-display font-bold ${pos === 1 ? "text-amber-400" : pos <= 4 ? "text-sky-500" : "text-muted-foreground"}`}>{pos}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: `hsl(${s.team.color})` }}
                          aria-hidden="true"
                        />
                        <span className="font-semibold">{s.team.name}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-center text-muted-foreground">{s.played}</td>
                    <td className="px-3 py-3 text-center text-sport-win font-semibold">{s.won}</td>
                    <td className="px-3 py-3 text-center text-sport-loss font-semibold">{s.lost}</td>
                    <td className="px-3 py-3 text-center text-muted-foreground">
                      {s.setsWon}-{s.setsLost}
                    </td>
                    <td className={`px-3 py-3 text-center font-semibold ${setDiff > 0 ? "text-sport-win" : setDiff < 0 ? "text-sport-loss" : "text-muted-foreground"}`}>
                      {setDiff > 0 ? `+${setDiff}` : setDiff}
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span className="font-display text-lg font-bold text-accent">{s.points}</span>
                    </td>
                    <td className="px-3 py-3">
                      <ChevronRight className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-center text-xs text-muted-foreground py-2">
        * Таблица обновится после проведения первых матчей
      </p>

      {/* Team stats panel */}
      {selected && <TeamStatsPanel standing={selected} onClose={() => setSelected(null)} />}
    </div>
  );
};

function TeamStatsPanel({ standing: s, onClose }: { standing: TeamStanding; onClose: () => void }) {
  const teamMatches = getTeamMatches(s.team.id).filter((m) => m.played);
  const upcoming = getUpcoming(s.team.id, 3);

  return (
    <div className="mt-6 bg-card rounded-lg border border-border overflow-hidden animate-slide-up">
      {/* Header */}
      <div className="sport-gradient px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: `hsl(${s.team.color})` }}
          />
          <h3 className="text-primary-foreground text-xl">{s.team.name}</h3>
        </div>
        <button
          onClick={onClose}
          aria-label="Закрыть"
          className="w-10 h-10 flex items-center justify-center text-primary-foreground/60 hover:text-primary-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-md"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>
      </div>

      <div className="p-4 space-y-6">
        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatBox label="Победы / Поражения" wins={s.won} losses={s.lost} />
          <StatBox label="Партии (В/П)" wins={s.setsWon} losses={s.setsLost} />
          <StatBox label="Дома (В/П)" wins={s.homeWon} losses={s.homeLost} />
          <StatBox label="В гостях (В/П)" wins={s.awayWon} losses={s.awayLost} />
        </div>

        {/* Match history */}
        {teamMatches.length > 0 && (
          <div>
            <h4 className="font-display text-sm text-muted-foreground mb-3 flex items-center gap-2">
              <Trophy className="w-4 h-4" aria-hidden="true" /> Результаты
            </h4>
            <div className="space-y-2">
              {teamMatches.map((m) => (
                <HistoryRow key={m.id} match={m} teamId={s.team.id} />
              ))}
            </div>
          </div>
        )}

        {/* Upcoming */}
        {upcoming.length > 0 && (
          <div>
            <h4 className="font-display text-sm text-muted-foreground mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4" aria-hidden="true" /> Ближайшие матчи
            </h4>
            <div className="space-y-2">
              {upcoming.map((m) => {
                const opp = getTeam(m.homeId === s.team.id ? m.awayId : m.homeId);
                const isHome = m.homeId === s.team.id;
                return (
                  <div key={m.id} className="flex items-center gap-3 text-sm bg-secondary/50 rounded-md px-3 py-2">
                    <span className="text-xs text-muted-foreground w-14">
                      {new Date(m.date).toLocaleDateString("ru-RU", { day: "numeric", month: "short" })}
                    </span>
                    <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${isHome ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                      {isHome ? "Д" : "Г"}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: `hsl(${opp.color})` }} aria-hidden="true" />
                      <span className="font-medium">{opp.name}</span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatBox({ label, wins, losses }: { label: string; wins: number; losses: number }) {
  return (
    <div className="bg-secondary/50 rounded-lg p-3 text-center">
      <div className="font-display text-xl font-bold">
        <span className="text-sport-win">{wins}</span>
        <span className="text-muted-foreground/40 mx-1 text-base font-sans">/</span>
        <span className="text-sport-loss">{losses}</span>
      </div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </div>
  );
}

function HistoryRow({ match: m, teamId }: { match: Match; teamId: number }) {
  const r = m.result!;
  const isHome = m.homeId === teamId;
  const won = isHome ? r.setsHome > r.setsAway : r.setsAway > r.setsHome;
  const opp = getTeam(isHome ? m.awayId : m.homeId);

  return (
    <div className="flex items-center gap-3 text-sm bg-secondary/30 rounded-md px-3 py-2">
      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${won ? "bg-sport-win" : "bg-sport-loss"}`} aria-hidden="true" />
      <span className="text-xs text-muted-foreground w-14">
        {new Date(m.date).toLocaleDateString("ru-RU", { day: "numeric", month: "short" })}
      </span>
      <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${isHome ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
        {isHome ? "Д" : "Г"}
      </span>
      <span className="flex items-center gap-1.5 flex-1 min-w-0">
        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: `hsl(${opp.color})` }} aria-hidden="true" />
        <span className="truncate">{opp.name}</span>
      </span>
      <span className="font-mono font-semibold">
        {isHome ? r.setsHome : r.setsAway}:{isHome ? r.setsAway : r.setsHome}
      </span>
    </div>
  );
}

export default StandingsPage;
