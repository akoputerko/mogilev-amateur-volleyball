import { useEffect, useState } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { CalendarDays, LayoutGrid, Users, Trophy, Sun, Moon, Gamepad2 } from "lucide-react";
import { seasonStart, seasonEnd } from "@/data/league";

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("ru-RU", { day: "numeric", month: "short", year: "numeric" });

const tabs = [
  { label: "Таблица",  icon: Trophy,    path: "/"            },
  { label: "Календарь", icon: LayoutGrid, path: "/calendar" },
  { label: "Туры",     icon: CalendarDays, path: "/tours"    },
  { label: "Команды",  icon: Users,     path: "/teams"       },
  { label: "Игрище",   icon: Gamepad2,  path: "/playground"  },
];

const Index = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [dark, setDark] = useState(() => {
    const stored = localStorage.getItem("theme");
    if (stored) return stored === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  const isActive = (path: string) =>
    path === "/" ? pathname === "/" : pathname.startsWith(path);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sport-gradient">
        <div className="container py-6 sm:py-8">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg accent-gradient flex items-center justify-center">
                <Trophy className="w-5 h-5 text-accent-foreground" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl text-primary-foreground tracking-wide">
                  Могилёвская Любительская Лига
                </h1>
                <p className="text-primary-foreground/50 text-xs mt-0.5 font-sans normal-case tracking-normal">
                  Сезон 2025/26 · 8 команд · Волейбол · {fmtDate(seasonStart)} — {fmtDate(seasonEnd)}
                </p>
              </div>
            </div>
            <button
              onClick={() => setDark((d) => !d)}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-primary-foreground/70 hover:text-primary-foreground hover:bg-white/10 transition-colors flex-shrink-0"
              aria-label="Переключить тему"
            >
              {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
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
                key={t.path}
                onClick={() => navigate(t.path)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  isActive(t.path)
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
        <Outlet />
      </main>
    </div>
  );
};

export default Index;
