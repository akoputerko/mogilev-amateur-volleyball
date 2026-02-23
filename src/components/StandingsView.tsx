import { useState } from "react";
import { calcStandings, getTeamMatches, getUpcoming, type TeamStanding } from "@/lib/standings";
import { getTeam, type Match } from "@/data/league";
import { ChevronRight, Trophy, X, Calendar } from "lucide-react";

const StandingsView = () => {
  const standings = calcStandings();
  const [selected, setSelected] = useState<TeamStanding | null>(null);

  return (
    <div className="animate-fade-in">
      {/* Table */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="sport-gradient text-primary-foreground text-left">
                <th className="px-3 py-3 font-semibold text-xs tracking-wider">#</th>
                <th className="px-3 py-3 font-semibold text-xs tracking-wider">Команда</th>
                <th className="px-3 py-3 font-semibold text-xs tracking-wider text-center">И</th>
                <th className="px-3 py-3 font-semibold text-xs tracking-wider text-center">В</th>
                <th className="px-3 py-3 font-semibold text-xs tracking-wider text-center">П</th>
                <th className="px-3 py-3 font-semibold text-xs tracking-wider text-center">Партии</th>
                <th className="px-3 py-3 font-semibold text-xs tracking-wider text-center font-bold">Очки</th>
                <th className="px-3 py-3 w-8"></th>
              </tr>
            </thead>
            <tbody>
              {standings.map((s, i) => (
                <tr
                  key={s.team.id}
                  onClick={() => setSelected(s)}
                  className={`border-t border-border cursor-pointer transition-colors hover:bg-secondary/60 ${
                    selected?.team.id === s.team.id ? "bg-secondary" : ""
                  }`}
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <td className="px-3 py-3 font-display font-bold text-muted-foreground">{i + 1}</td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: `hsl(${s.team.color})` }}
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
                  <td className="px-3 py-3 text-center">
                    <span className="font-display text-lg font-bold text-accent">{s.points}</span>
                  </td>
                  <td className="px-3 py-3">
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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
        <button onClick={onClose} className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 space-y-6">
        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatBox label="Победы/Поражения" value={`${s.won}/${s.lost}`} />
          <StatBox label="Партии (В/П)" value={`${s.setsWon}/${s.setsLost}`} />
          <StatBox label="Дома (В/П)" value={`${s.homeWon}/${s.homeLost}`} />
          <StatBox label="В гостях (В/П)" value={`${s.awayWon}/${s.awayLost}`} />
        </div>

        {/* Match history */}
        {teamMatches.length > 0 && (
          <div>
            <h4 className="font-display text-sm text-muted-foreground mb-3 flex items-center gap-2">
              <Trophy className="w-4 h-4" /> Результаты
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
              <Calendar className="w-4 h-4" /> Ближайшие матчи
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
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: `hsl(${opp.color})` }} />
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

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-secondary/50 rounded-lg p-3 text-center">
      <div className="font-display text-xl font-bold text-accent">{value}</div>
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
      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${won ? "bg-sport-win" : "bg-sport-loss"}`} />
      <span className="text-xs text-muted-foreground w-14">
        {new Date(m.date).toLocaleDateString("ru-RU", { day: "numeric", month: "short" })}
      </span>
      <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${isHome ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
        {isHome ? "Д" : "Г"}
      </span>
      <span className="flex items-center gap-1.5 flex-1 min-w-0">
        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: `hsl(${opp.color})` }} />
        <span className="truncate">{opp.name}</span>
      </span>
      <span className="font-mono font-semibold">
        {isHome ? r.setsHome : r.setsAway}:{isHome ? r.setsAway : r.setsHome}
      </span>
    </div>
  );
}

export default StandingsView;
