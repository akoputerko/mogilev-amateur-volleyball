import { useState } from "react";
import GameweekView from "@/components/GameweekView";
import TeamView from "@/components/TeamView";
import StandingsView from "@/components/StandingsView";
import { CalendarDays, Users, Trophy } from "lucide-react";

type Tab = "gameweek" | "team" | "standings";

const tabs: { key: Tab; label: string; icon: typeof CalendarDays }[] = [
  { key: "gameweek", label: "Туры", icon: CalendarDays },
  { key: "team", label: "Команды", icon: Users },
  { key: "standings", label: "Таблица", icon: Trophy },
];

const Index = () => {
  const [active, setActive] = useState<Tab>("standings");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sport-gradient">
        <div className="container py-6 sm:py-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg accent-gradient flex items-center justify-center">
              <Trophy className="w-5 h-5 text-accent-foreground" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl text-primary-foreground tracking-wide">
                Могилёвская Любительская Лига
              </h1>
              <p className="text-primary-foreground/50 text-xs mt-0.5 font-sans normal-case tracking-normal">
                Сезон 2025/26 · 8 команд · Волейбол
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Tab bar */}
      <div className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container flex">
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.key}
                onClick={() => setActive(t.key)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  active === t.key
                    ? "border-accent text-accent"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <main className="container py-6">
        {active === "gameweek" && <GameweekView />}
        {active === "team" && <TeamView />}
        {active === "standings" && <StandingsView />}
      </main>
    </div>
  );
};

export default Index;
