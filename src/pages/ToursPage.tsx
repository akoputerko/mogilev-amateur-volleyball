import { useState } from "react";
import { matches, totalGameweeks } from "@/data/league";
import MatchCard from "@/components/MatchCard";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("ru-RU", { day: "numeric", month: "short" });

function getDefaultGameweek(): number {
  const today = new Date().toISOString().slice(0, 10);
  for (let gw = 1; gw <= totalGameweeks; gw++) {
    const gwDates = matches.filter((m) => m.gameweek === gw).map((m) => m.date);
    const maxDate = gwDates.sort().at(-1);
    if (maxDate && maxDate >= today) return gw;
  }
  return totalGameweeks;
}

const currentGw = getDefaultGameweek();

const tourStatusConfig = {
  past:    { label: "Завершён",  className: "bg-muted text-muted-foreground border border-border" },
  current: { label: "Текущий",   className: "bg-accent/15 text-accent border border-accent/30" },
  future:  { label: "Предстоит", className: "bg-sky-500/10 text-sky-500 border border-sky-500/30" },
} as const;

const ToursPage = () => {
  const [gw, setGw] = useState(getDefaultGameweek);
  const gwMatches = matches.filter((m) => m.gameweek === gw).sort((a, b) => a.date.localeCompare(b.date));

  const dates = gwMatches.map((m) => m.date).sort();
  const dateRange = dates.length > 0
    ? dates[0] === dates[dates.length - 1]
      ? formatDate(dates[0])
      : `${formatDate(dates[0])} – ${formatDate(dates[dates.length - 1])}`
    : "";

  const status = gw < currentGw ? "past" : gw > currentGw ? "future" : "current";
  const statusConfig = tourStatusConfig[status];

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setGw((g) => Math.max(1, g - 1))}
            disabled={gw === 1}
            aria-label="Предыдущий тур"
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors disabled:opacity-30 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <ChevronLeft className="w-4 h-4" aria-hidden="true" />
          </button>
          <div className="relative inline-block">
            <select
              value={gw}
              onChange={(e) => setGw(Number(e.target.value))}
              aria-label="Выберите тур"
              className="appearance-none bg-card border border-border rounded-lg px-4 py-2.5 pr-10 font-display text-lg font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-accent cursor-pointer"
            >
              {Array.from({ length: totalGameweeks }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  Тур {i + 1}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" aria-hidden="true" />
          </div>
          <button
            onClick={() => setGw((g) => Math.min(totalGameweeks, g + 1))}
            disabled={gw === totalGameweeks}
            aria-label="Следующий тур"
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors disabled:opacity-30 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm">{dateRange}</span>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusConfig.className}`}>
              {statusConfig.label}
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {gwMatches.map((m) => (
          <MatchCard key={m.id} match={m} linkTeams />
        ))}
      </div>
    </div>
  );
};

export default ToursPage;
