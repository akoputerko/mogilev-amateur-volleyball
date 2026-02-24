import { useNavigate } from "react-router-dom";
import { teams } from "@/data/league";
import { calcStandings } from "@/lib/standings";
import { MapPin, ChevronRight } from "lucide-react";

const TeamsPage = () => {
  const navigate = useNavigate();
  const standings = calcStandings();
  const standingMap = Object.fromEntries(
    standings.map((s, i) => [s.team.id, { s, pos: i + 1 }])
  );

  return (
    <div className="animate-fade-in grid gap-4 sm:grid-cols-2">
      {teams.map((team) => {
        const entry = standingMap[team.id];
        const hasStats = entry?.s.played > 0;
        return (
          <div
            key={team.id}
            role="button"
            tabIndex={0}
            onClick={() => navigate(`/teams/${team.id}`)}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); navigate(`/teams/${team.id}`); } }}
            aria-label={`Команда ${team.name}`}
            className="bg-card rounded-xl border border-border p-4 cursor-pointer hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 transition-all flex items-center gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            <span
              className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold text-primary-foreground flex-shrink-0"
              style={{ backgroundColor: `hsl(${team.color})` }}
            >
              {team.short}
            </span>
            <div className="flex-1 min-w-0">
              <div className="font-semibold">{team.name}</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                <MapPin className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
                <span className="truncate">{team.hall}</span>
              </div>
              {hasStats && (
                <div className="text-xs text-muted-foreground mt-0.5">
                  #{entry.pos} · {entry.s.points} оч. · {entry.s.won}В {entry.s.lost}П
                </div>
              )}
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" aria-hidden="true" />
          </div>
        );
      })}
    </div>
  );
};

export default TeamsPage;
