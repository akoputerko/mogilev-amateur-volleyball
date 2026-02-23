import { useState } from "react";
import { teams } from "@/data/league";
import { getTeamMatches } from "@/lib/standings";
import MatchCard from "./MatchCard";
import { ChevronDown } from "lucide-react";

type Filter = "all" | "home" | "away";

const TeamView = () => {
  const [teamId, setTeamId] = useState(0);
  const [filter, setFilter] = useState<Filter>("all");

  const allMatches = getTeamMatches(teamId);
  const filtered = allMatches.filter((m) => {
    if (filter === "home") return m.homeId === teamId;
    if (filter === "away") return m.awayId === teamId;
    return true;
  });

  const filters: { key: Filter; label: string }[] = [
    { key: "all", label: "Все" },
    { key: "home", label: "Дома" },
    { key: "away", label: "В гостях" },
  ];

  return (
    <div className="animate-fade-in">
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="relative">
          <select
            value={teamId}
            onChange={(e) => setTeamId(Number(e.target.value))}
            className="appearance-none bg-card border border-border rounded-lg px-4 py-2.5 pr-10 font-display text-lg font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-accent cursor-pointer"
          >
            {teams.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        </div>

        <div className="flex gap-1 bg-secondary rounded-lg p-1">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                filter === f.key
                  ? "bg-accent text-accent-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {filtered.map((m) => (
          <MatchCard key={m.id} match={m} />
        ))}
      </div>
    </div>
  );
};

export default TeamView;
