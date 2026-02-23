import { useState } from "react";
import { matches, totalGameweeks } from "@/data/league";
import MatchCard from "./MatchCard";
import { ChevronDown } from "lucide-react";

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("ru-RU", { day: "numeric", month: "short" });

const GameweekView = () => {
  const [gw, setGw] = useState(1);
  const gwMatches = matches.filter((m) => m.gameweek === gw);

  const dates = gwMatches.map((m) => m.date).sort();
  const dateRange = dates.length > 0
    ? dates[0] === dates[dates.length - 1]
      ? formatDate(dates[0])
      : `${formatDate(dates[0])} – ${formatDate(dates[dates.length - 1])}`
    : "";

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <div className="flex items-center gap-4">
          <div className="relative inline-block">
            <select
              value={gw}
              onChange={(e) => setGw(Number(e.target.value))}
              className="appearance-none bg-card border border-border rounded-lg px-4 py-2.5 pr-10 font-display text-lg font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-accent cursor-pointer"
            >
              {Array.from({ length: totalGameweeks }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  Тур {i + 1}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
          <span className="text-muted-foreground text-sm">{dateRange}</span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {gwMatches.map((m) => (
          <MatchCard key={m.id} match={m} />
        ))}
      </div>
    </div>
  );
};

export default GameweekView;
