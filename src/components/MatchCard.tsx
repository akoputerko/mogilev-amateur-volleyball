import { type Match, getTeam } from "@/data/league";
import { Calendar, Clock, MapPin } from "lucide-react";

interface MatchCardProps {
  match: Match;
}

const MatchCard = ({ match }: MatchCardProps) => {
  const home = getTeam(match.homeId);
  const away = getTeam(match.awayId);
  const r = match.result;

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden animate-fade-in">
      {/* Score header */}
      <div className="sport-gradient px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: `hsl(${home.color})` }}
          />
          <span className="text-primary-foreground font-semibold text-sm truncate">
            {home.name}
          </span>
        </div>

        {match.played && r ? (
          <div className="flex items-center gap-2 px-3">
            <span className={`font-display text-2xl font-bold ${r.setsHome > r.setsAway ? "text-accent" : "text-primary-foreground/60"}`}>
              {r.setsHome}
            </span>
            <span className="text-primary-foreground/40 text-sm">:</span>
            <span className={`font-display text-2xl font-bold ${r.setsAway > r.setsHome ? "text-accent" : "text-primary-foreground/60"}`}>
              {r.setsAway}
            </span>
          </div>
        ) : (
          <span className="px-3 py-0.5 rounded bg-accent/20 text-accent text-xs font-semibold tracking-wider">
            VS
          </span>
        )}

        <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
          <span className="text-primary-foreground font-semibold text-sm truncate text-right">
            {away.name}
          </span>
          <span
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: `hsl(${away.color})` }}
          />
        </div>
      </div>

      {/* Set scores */}
      {match.played && r && (
        <div className="flex justify-center gap-3 px-4 py-2 bg-secondary/50">
          {r.setScores.map((s, i) => (
            <span key={i} className="text-xs font-mono text-muted-foreground">
              <span className={s.home > s.away ? "text-foreground font-bold" : ""}>{s.home}</span>
              -
              <span className={s.away > s.home ? "text-foreground font-bold" : ""}>{s.away}</span>
            </span>
          ))}
        </div>
      )}

      {/* Meta info */}
      <div className="px-4 py-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
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
          {match.venue}
        </span>
      </div>
    </div>
  );
};

export default MatchCard;
