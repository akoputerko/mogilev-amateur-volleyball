import { useState } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { getTeam, type Match } from "@/data/league";
import { calcStandings, getTeamMatches } from "@/lib/standings";
import MatchCard from "@/components/MatchCard";
import { ArrowLeft, MapPin, Clock } from "lucide-react";

type Filter = "all" | "home" | "away";

const filters: { key: Filter; label: string; dot?: string; active: string }[] = [
  { key: "all",  label: "Все",       active: "bg-accent text-accent-foreground" },
  { key: "home", label: "Дома",      dot: "bg-sport-win", active: "bg-sport-win/20 text-sport-win" },
  { key: "away", label: "В гостях",  dot: "bg-accent",    active: "bg-accent/20 text-accent" },
];

const TeamPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<Filter>("all");
  const teamId = Number(id);
  const team = getTeam(teamId);

  if (!team) return <Navigate to="/teams" replace />;

  const standings = calcStandings();
  const standingIdx = standings.findIndex((s) => s.team.id === teamId);
  const standing = standingIdx >= 0 ? standings[standingIdx] : null;
  const pos = standingIdx + 1;

  const allMatches = getTeamMatches(teamId);
  const playedMatches = allMatches.filter((m) => m.played);

  const h2h = playedMatches.reduce<Record<number, { won: number; lost: number }>>((acc, m) => {
    const oppId = m.homeId === teamId ? m.awayId : m.homeId;
    if (!acc[oppId]) acc[oppId] = { won: 0, lost: 0 };
    const r = m.result!;
    const won = m.homeId === teamId ? r.setsHome > r.setsAway : r.setsAway > r.setsHome;
    if (won) acc[oppId].won++; else acc[oppId].lost++;
    return acc;
  }, {});

  const totalSets = (standing?.played ?? 0) * 3;
  const totalPts  = (standing?.pointsWon ?? 0) + (standing?.pointsLost ?? 0);
  const ptDiff    = (standing?.pointsWon ?? 0) - (standing?.pointsLost ?? 0);
  const ptEff     = totalPts > 0 ? Math.round(((standing?.pointsWon ?? 0) / totalPts) * 100) : 0;
  const avgWon    = totalSets > 0 ? ((standing?.pointsWon ?? 0) / totalSets).toFixed(1) : "—";
  const avgLost   = totalSets > 0 ? ((standing?.pointsLost ?? 0) / totalSets).toFixed(1) : "—";
  let w30 = 0, w21 = 0, l12 = 0, l03 = 0;
  for (const m of playedMatches) {
    const r = m.result!;
    const mine = m.homeId === teamId ? r.setsHome : r.setsAway;
    const opp  = m.homeId === teamId ? r.setsAway : r.setsHome;
    if      (mine === 3 && opp === 0) w30++;
    else if (mine === 2 && opp === 1) w21++;
    else if (mine === 1 && opp === 2) l12++;
    else                               l03++;
  }

  const filtered = allMatches.filter((m) => {
    if (filter === "home") return m.homeId === teamId;
    if (filter === "away") return m.awayId === teamId;
    return true;
  });

  return (
    <div className="animate-fade-in space-y-6">
      {/* Back */}
      <button
        onClick={() => navigate("/teams")}
        aria-label="Вернуться к командам"
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:rounded"
      >
        <ArrowLeft className="w-4 h-4" aria-hidden="true" /> Команды
      </button>

      {/* Header */}
      <div className="sport-gradient rounded-xl p-5 flex items-center gap-4">
        <span
          className="w-14 h-14 rounded-xl flex items-center justify-center text-lg font-bold text-primary-foreground flex-shrink-0"
          style={{ backgroundColor: `hsl(${team.color})` }}
        >
          {team.short}
        </span>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl text-primary-foreground">{team.name}</h2>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
            <span className="flex items-center gap-1 text-primary-foreground/60 text-xs">
              <MapPin className="w-3 h-3" aria-hidden="true" /> {team.hall} · {team.hallAddress}
            </span>
            <span className="flex items-center gap-1 text-primary-foreground/60 text-xs">
              <Clock className="w-3 h-3" aria-hidden="true" /> {team.trainDays.join(", ")} · {team.trainTime}
            </span>
          </div>
        </div>
        {standing && (
          <div className="text-right flex-shrink-0">
            <div className="font-display text-3xl font-bold text-accent-foreground">{pos}</div>
            <div className="text-primary-foreground/50 text-xs">место</div>
            <div className="font-display text-lg font-bold text-accent-foreground/80 mt-1">{standing.points} <span className="text-xs font-sans font-normal">оч.</span></div>
          </div>
        )}
      </div>

      {/* Stats grid */}
      {standing && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatBox label="Победы / Поражения" wins={standing.won} losses={standing.lost} />
          <StatBox label="Партии (В/П)" wins={standing.setsWon} losses={standing.setsLost} />
          <StatBox label="Дома (В/П)" wins={standing.homeWon} losses={standing.homeLost} />
          <StatBox label="В гостях (В/П)" wins={standing.awayWon} losses={standing.awayLost} />
        </div>
      )}

      {/* Score totals + match breakdown */}
      {standing && standing.played > 0 && (
        <div className="bg-card rounded-lg border border-border p-4 space-y-4">

          {/* Points totals */}
          <div>
            <h4 className="font-display text-sm text-muted-foreground mb-3">Очки в партиях</h4>
            <div className="flex items-end gap-4 mb-2">
              <div className="text-center">
                <div className="font-display text-3xl font-bold text-sport-win">{standing.pointsWon}</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">забито</div>
              </div>
              <div className="text-xl text-muted-foreground/30 mb-1 font-sans">:</div>
              <div className="text-center">
                <div className="font-display text-3xl font-bold text-sport-loss">{standing.pointsLost}</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">пропущено</div>
              </div>
              <div className="flex-1" />
              <div className="text-center">
                <div className={`font-display text-xl font-bold ${ptDiff > 0 ? "text-sport-win" : ptDiff < 0 ? "text-sport-loss" : "text-muted-foreground"}`}>
                  {ptDiff > 0 ? `+${ptDiff}` : ptDiff}
                </div>
                <div className="text-[10px] text-muted-foreground mt-0.5">разница</div>
              </div>
              <div className="text-center">
                <div className={`font-display text-xl font-bold ${ptEff >= 50 ? "text-sport-win" : "text-sport-loss"}`}>
                  {ptEff}%
                </div>
                <div className="text-[10px] text-muted-foreground mt-0.5">эфф-ть</div>
              </div>
            </div>
            <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-sport-win transition-all" style={{ width: `${ptEff}%` }} />
            </div>
            <div className="flex justify-between text-[10px] text-muted-foreground mt-1.5">
              <span>≈{avgWon} оч/партию</span>
              <span>≈{avgLost} оч/партию</span>
            </div>
          </div>

          {/* Match type breakdown */}
          <div>
            <div className="text-xs text-muted-foreground mb-2">Характер матчей</div>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: "3:0", sub: "Победа",    count: w30, win: true,  strong: true  },
                { label: "2:1", sub: "Победа",    count: w21, win: true,  strong: false },
                { label: "1:2", sub: "Поражение", count: l12, win: false, strong: false },
                { label: "0:3", sub: "Поражение", count: l03, win: false, strong: true  },
              ].map(({ label, sub, count, win, strong }) => (
                <div
                  key={label}
                  className={`rounded-lg p-2.5 text-center ${win ? (strong ? "bg-sport-win/20" : "bg-sport-win/10") : (strong ? "bg-sport-loss/20" : "bg-sport-loss/10")}`}
                >
                  <div className={`text-[10px] font-semibold ${win ? "text-sport-win" : "text-sport-loss"}`}>{sub}</div>
                  <div className="font-display text-2xl font-bold text-foreground mt-0.5">{count}</div>
                  <div className={`text-xs font-mono font-bold mt-0.5 ${win ? "text-sport-win/70" : "text-sport-loss/70"}`}>{label}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Form strip */}
      {playedMatches.length > 0 && (
        <div className="bg-card rounded-lg border border-border p-4">
          <h4 className="font-display text-sm text-muted-foreground mb-3">
            Форма (последние {Math.min(playedMatches.length, 7)})
          </h4>
          <div className="flex gap-1.5">
            {playedMatches.slice(-7).map((m) => {
              const r = m.result!;
              const won = m.homeId === teamId ? r.setsHome > r.setsAway : r.setsAway > r.setsHome;
              const opp = getTeam(m.homeId === teamId ? m.awayId : m.homeId);
              return (
                <span
                  key={m.id}
                  aria-label={`${won ? "Победа" : "Поражение"} — ${opp.name}, ${new Date(m.date).toLocaleDateString("ru-RU", { day: "numeric", month: "short" })}`}
                  className={`w-8 h-8 rounded flex items-center justify-center text-xs font-bold text-white ${won ? "bg-sport-win" : "bg-sport-loss"}`}
                >
                  {won ? "В" : "П"}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Head-to-head records */}
      {Object.keys(h2h).length > 0 && (
        <div className="bg-card rounded-lg border border-border p-4">
          <h4 className="font-display text-sm text-muted-foreground mb-3">Очные встречи</h4>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {Object.entries(h2h).map(([oppIdStr, record]) => {
              const opp = getTeam(Number(oppIdStr));
              return (
                <div key={oppIdStr} className="bg-secondary/40 rounded-lg p-2 text-center">
                  <div className="flex items-center gap-1.5 justify-center mb-1">
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: `hsl(${opp.color})` }}
                      aria-hidden="true"
                    />
                    <span className="text-xs font-medium truncate">{opp.short}</span>
                  </div>
                  <div className="font-display text-base font-bold">
                    <span className="text-sport-win">{record.won}</span>
                    <span className="text-muted-foreground/40 mx-0.5 text-sm font-sans">:</span>
                    <span className="text-sport-loss">{record.lost}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Matches with filter */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-display text-sm text-muted-foreground">Матчи</h4>
          <div className="flex gap-1 bg-secondary rounded-lg p-1" role="group" aria-label="Фильтр матчей">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                aria-pressed={filter === f.key}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                  filter === f.key
                    ? `${f.active} shadow-sm`
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {f.dot && <span className={`w-2 h-2 rounded-full ${f.dot}`} aria-hidden="true" />}
                {f.label}
              </button>
            ))}
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((m) => (
            <MatchCard key={m.id} match={m} teamId={teamId} linkTeams />
          ))}
        </div>
      </div>
    </div>
  );
};

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

export default TeamPage;
