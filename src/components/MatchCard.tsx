import { useNavigate } from "react-router-dom";
import { type Match, getTeam } from "@/data/league";
import { Calendar, Clock, MapPin } from "lucide-react";

interface MatchCardProps {
  match: Match;
  teamId?: number;
  linkTeams?: boolean;
}

const MatchCard = ({ match, teamId, linkTeams }: MatchCardProps) => {
  const navigate = useNavigate();
  const home = getTeam(match.homeId);
  const away = getTeam(match.awayId);
  const r = match.result;

  const handleTeamClick = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/teams/${id}`);
  };

  const isHome = teamId !== undefined ? match.homeId === teamId : undefined;
  const perspectiveBorder =
    isHome === true ? "border-l-[3px] border-l-sport-win" :
    isHome === false ? "border-l-[3px] border-l-accent" : "";

  return (
    <div className={`group bg-card rounded-xl border border-border overflow-hidden animate-fade-in hover:border-accent/30 transition-all hover:shadow-lg hover:shadow-accent/5 flex flex-col ${perspectiveBorder}`}>
      {/* Teams & Score */}
      <div className="p-4 flex flex-col items-center gap-3 flex-1 justify-center">
        {/* Home team */}
        <div
          className={`flex items-center gap-2.5 ${linkTeams ? "cursor-pointer group/home" : ""}`}
          onClick={linkTeams ? (e) => handleTeamClick(match.homeId, e) : undefined}
        >
          <span
            className="w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold text-primary-foreground"
            style={{ backgroundColor: `hsl(${home.color})` }}
          >
            {home.name.slice(0, 2).toUpperCase()}
          </span>
          <span className={`font-semibold text-sm ${linkTeams ? "group-hover/home:text-accent group-hover/home:underline transition-colors" : ""}`}>
            {home.name}
          </span>
        </div>

        {/* Score or VS */}
        {match.played && r ? (
          <div className="flex flex-col items-center gap-1.5">
            <div className="flex items-center gap-2">
              <span className={`font-display text-3xl font-bold ${r.setsHome > r.setsAway ? "text-sport-win" : "text-muted-foreground"}`}>
                {r.setsHome}
              </span>
              <span className="text-muted-foreground/40 text-lg">:</span>
              <span className={`font-display text-3xl font-bold ${r.setsAway > r.setsHome ? "text-sport-win" : "text-muted-foreground"}`}>
                {r.setsAway}
              </span>
            </div>
            <div className="flex gap-2">
              {r.setScores.map((s, i) => (
                <span key={i} className="bg-secondary rounded-md px-2 py-0.5 text-xs font-mono">
                  <span className={s.home > s.away ? "text-sport-win font-bold" : "text-muted-foreground"}>{s.home}</span>
                  <span className="text-muted-foreground/50 mx-0.5">:</span>
                  <span className={s.away > s.home ? "text-sport-win font-bold" : "text-muted-foreground"}>{s.away}</span>
                </span>
              ))}
            </div>
          </div>
        ) : (
          <span className="px-4 py-1 rounded-full accent-gradient text-accent-foreground text-xs font-bold tracking-widest shadow-sm">
            VS
          </span>
        )}

        {/* Away team */}
        <div
          className={`flex items-center gap-2.5 ${linkTeams ? "cursor-pointer group/away" : ""}`}
          onClick={linkTeams ? (e) => handleTeamClick(match.awayId, e) : undefined}
        >
          <span
            className="w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold text-primary-foreground"
            style={{ backgroundColor: `hsl(${away.color})` }}
          >
            {away.name.slice(0, 2).toUpperCase()}
          </span>
          <span className={`font-semibold text-sm ${linkTeams ? "group-hover/away:text-accent group-hover/away:underline transition-colors" : ""}`}>
            {away.name}
          </span>
        </div>
      </div>

      {/* Meta footer */}
      <div className="px-4 py-2.5 bg-secondary/40 border-t border-border flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground items-center">
        {isHome !== undefined && (
          <span className={`font-semibold px-1.5 py-0.5 rounded text-[10px] ${isHome ? "bg-sport-win/20 text-sport-win" : "bg-accent/20 text-accent"}`}>
            {isHome ? "Дома" : "В гостях"}
          </span>
        )}
        <span className="inline-flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {new Date(match.date).toLocaleDateString("ru-RU", { day: "numeric", month: "short", weekday: "short" })}
        </span>
        <span className="inline-flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {match.time}
        </span>
        <span className="inline-flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {match.venue} · {match.address}
        </span>
      </div>
    </div>
  );
};

export default MatchCard;
