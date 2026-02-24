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
    <div className="group bg-card rounded-xl border border-border overflow-hidden animate-fade-in hover:border-accent/30 transition-all hover:shadow-lg hover:shadow-accent/5">
      {/* Teams & Score */}
      <div className="p-4 flex flex-col items-center gap-3">
        {/* Home team */}
        <div className="flex flex-col items-center gap-1.5">
          <span
            className="w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold text-primary-foreground"
            style={{ backgroundColor: `hsl(${home.color})` }}
          >
            {home.name.slice(0, 2).toUpperCase()}
          </span>
          <span className="font-semibold text-sm text-center">{home.name}</span>
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
        <div className="flex flex-col items-center gap-1.5">
          <span
            className="w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold text-primary-foreground"
            style={{ backgroundColor: `hsl(${away.color})` }}
          >
            {away.name.slice(0, 2).toUpperCase()}
          </span>
          <span className="font-semibold text-sm text-center">{away.name}</span>
        </div>
      </div>

      {/* Meta footer */}
      <div className="px-4 py-2.5 bg-secondary/40 border-t border-border flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
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
