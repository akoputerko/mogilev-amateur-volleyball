import { calcStandings } from "@/lib/standings";
import { matches } from "@/data/league";
import { Link } from "react-router-dom";
import { ChevronDown, Info } from "lucide-react";
import type { Team } from "@/data/league";

// ── Slot data ────────────────────────────────────────────────────────────────
type SlotData =
  | { kind: "seed"; pos: number; team: Team | null }
  | { kind: "adv";  label: string };

// ── Single team row inside a match card ─────────────────────────────────────
function TeamSlot({ data }: { data: SlotData }) {
  if (data.kind === "adv") {
    return (
      <div className="flex items-center gap-2.5 px-3 py-2.5 min-h-[40px]">
        <span className="text-sm text-muted-foreground/40 italic">{data.label}</span>
      </div>
    );
  }

  const { pos, team } = data;
  const seedCls =
    pos === 1 ? "bg-amber-400/20 text-amber-400" :
    pos <= 4  ? "bg-sky-500/20 text-sky-500" :
                "bg-muted text-muted-foreground/60";

  const inner = (
    <div className="flex items-center gap-2.5 px-3 py-2.5 min-h-[40px]">
      <span
        className={`font-display font-bold text-[11px] w-5 h-5 flex items-center justify-center rounded shrink-0 ${seedCls}`}
        aria-hidden="true"
      >
        {pos}
      </span>
      {team ? (
        <>
          <span
            className="w-2 h-2 rounded-full shrink-0"
            style={{ backgroundColor: `hsl(${team.color})` }}
            aria-hidden="true"
          />
          <span className="text-sm font-medium text-foreground truncate">{team.name}</span>
        </>
      ) : (
        <span className="text-sm text-muted-foreground/40 italic">TBD</span>
      )}
    </div>
  );

  if (team) {
    return (
      <Link
        to={`/teams/${team.id}`}
        className="block hover:bg-secondary/50 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-accent"
        aria-label={`${team.name}, место ${pos}`}
      >
        {inner}
      </Link>
    );
  }
  return <div>{inner}</div>;
}

// ── Theme tokens per bracket ─────────────────────────────────────────────────
type BracketTheme = "upper" | "lower";

const THEME = {
  upper: {
    section:     "bg-amber-400/5 border border-amber-400/20 rounded-xl p-4",
    accentBar:   "bg-amber-400",
    titleText:   "text-amber-500 dark:text-amber-400",
    cardBorder:  "border-amber-400/30 border-l-2 border-l-amber-400/50",
    cardHeader:  "bg-amber-400/10 border-b border-amber-400/20",
    headerText:  "text-amber-700 dark:text-amber-300",
    connector:   "border-amber-400/40",
  },
  lower: {
    section:     "bg-sky-500/5 border border-sky-500/20 rounded-xl p-4",
    accentBar:   "bg-sky-500",
    titleText:   "text-sky-600 dark:text-sky-400",
    cardBorder:  "border-sky-500/30 border-l-2 border-l-sky-500/50",
    cardHeader:  "bg-sky-500/10 border-b border-sky-500/20",
    headerText:  "text-sky-700 dark:text-sky-300",
    connector:   "border-sky-500/40",
  },
} as const;

// ── Match card ───────────────────────────────────────────────────────────────
function MatchCard({
  label, top, bottom, theme,
}: {
  label: string; top: SlotData; bottom: SlotData; theme: BracketTheme;
}) {
  const t = THEME[theme];
  return (
    <div className={`bg-card rounded-lg overflow-hidden border ${t.cardBorder}`}>
      <div className={`px-3 py-1.5 ${t.cardHeader}`}>
        <span className={`text-[10px] font-semibold uppercase tracking-widest ${t.headerText}`}>
          {label}
        </span>
      </div>
      <TeamSlot data={top} />
      <div className="border-t border-border" />
      <TeamSlot data={bottom} />
    </div>
  );
}

// ── One full 4-team bracket ──────────────────────────────────────────────────
interface BracketProps {
  title: string;
  subtitle: string;
  theme: BracketTheme;
  sf1: [SlotData, SlotData];
  sf2: [SlotData, SlotData];
  finalLabel: string;
  thirdLabel: string;
}

const ADV_W1: SlotData = { kind: "adv", label: "Победитель ПФ 1" };
const ADV_W2: SlotData = { kind: "adv", label: "Победитель ПФ 2" };
const ADV_L1: SlotData = { kind: "adv", label: "Проигравший ПФ 1" };
const ADV_L2: SlotData = { kind: "adv", label: "Проигравший ПФ 2" };

function Bracket({ title, subtitle, theme, sf1, sf2, finalLabel, thirdLabel }: BracketProps) {
  const t = THEME[theme];
  return (
    <section aria-label={title} className={t.section}>
      <div className="flex items-center gap-2 mb-4">
        <div className={`w-1 h-5 rounded-full ${t.accentBar}`} aria-hidden="true" />
        <h2 className={`font-display text-lg font-bold ${t.titleText}`}>{title}</h2>
        <span className="text-xs text-muted-foreground">{subtitle}</span>
      </div>

      {/* Mobile: flat vertical list */}
      <div className="sm:hidden space-y-3">
        <MatchCard theme={theme} label="Полуфинал 1" top={sf1[0]} bottom={sf1[1]} />
        <MatchCard theme={theme} label="Полуфинал 2" top={sf2[0]} bottom={sf2[1]} />
        <div className="flex items-center gap-2 py-0.5" aria-hidden="true">
          <div className={`flex-1 h-px ${t.accentBar} opacity-30`} />
          <ChevronDown className={`w-3.5 h-3.5 ${t.titleText} opacity-60`} />
          <div className={`flex-1 h-px ${t.accentBar} opacity-30`} />
        </div>
        <MatchCard theme={theme} label={finalLabel}  top={ADV_W1}  bottom={ADV_W2} />
        <MatchCard theme={theme} label={thirdLabel}  top={ADV_L1}  bottom={ADV_L2} />
      </div>

      {/* Desktop: bracket layout (semis → connector → final + 3rd) */}
      <div className="hidden sm:grid grid-cols-[1fr_24px_1fr] grid-rows-2 gap-y-4">
        {/* SF1 */}
        <div className="col-start-1 row-start-1">
          <MatchCard theme={theme} label="Полуфинал 1" top={sf1[0]} bottom={sf1[1]} />
        </div>
        {/* SF2 */}
        <div className="col-start-1 row-start-2">
          <MatchCard theme={theme} label="Полуфинал 2" top={sf2[0]} bottom={sf2[1]} />
        </div>

        {/* Bracket connector */}
        <div className="col-start-2 row-start-1 row-span-2 flex flex-col" aria-hidden="true">
          <div className={`flex-1 border-r border-b rounded-br-sm ${t.connector}`} />
          <div className={`flex-1 border-r border-t rounded-tr-sm ${t.connector}`} />
        </div>

        {/* Final + 3rd place, vertically centered between the two semis */}
        <div className="col-start-3 row-start-1 row-span-2 flex flex-col justify-center gap-4">
          <MatchCard theme={theme} label={finalLabel} top={ADV_W1} bottom={ADV_W2} />
          <MatchCard theme={theme} label={thirdLabel} top={ADV_L1} bottom={ADV_L2} />
        </div>
      </div>
    </section>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
const PlayoffPage = () => {
  const standings = calcStandings();
  const playedCount = matches.filter((m) => m.played).length;
  const totalCount = matches.length;
  const seed = (n: number): SlotData => ({
    kind: "seed",
    pos: n,
    team: standings[n - 1]?.team ?? null,
  });

  return (
    <div className="animate-fade-in space-y-8">
      <div className="bg-card border border-border rounded-lg px-4 py-3 flex items-center gap-2 text-sm text-muted-foreground">
        <Info className="w-4 h-4 shrink-0" aria-hidden="true" />
        <span>
          Сетка формируется по итогам регулярного сезона.{" "}
          Сыграно <span className="font-semibold text-foreground">{playedCount}</span> из{" "}
          <span className="font-semibold text-foreground">{totalCount}</span> матчей.
        </span>
      </div>

      <Bracket
        title="Верхняя сетка"
        subtitle="Места 1–4"
        theme="upper"
        sf1={[seed(1), seed(4)]}
        sf2={[seed(2), seed(3)]}
        finalLabel="Финал — за чемпионство"
        thirdLabel="Матч за 3-е место"
      />

      <Bracket
        title="Нижняя сетка"
        subtitle="Места 5–8"
        theme="lower"
        sf1={[seed(5), seed(8)]}
        sf2={[seed(6), seed(7)]}
        finalLabel="Матч за 5-е место"
        thirdLabel="Матч за 7-е место"
      />

      <p className="text-xs text-muted-foreground/50 text-center">
        Посев предварительный — по текущей таблице регулярного сезона
      </p>

      {/* Rules */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <Info className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
          <span className="font-display text-sm text-muted-foreground">Формат плей-офф</span>
        </div>
        <ul className="space-y-2.5 text-sm">
          <li className="flex gap-2.5">
            <span className="w-1 shrink-0 rounded-full bg-amber-400 mt-1" aria-hidden="true" />
            <span className="text-muted-foreground">
              <span className="font-semibold text-amber-500 dark:text-amber-400">Верхняя сетка</span> — команды 1–4 по итогам регулярного сезона.
              Полуфинал: 1-е vs 4-е, 2-е vs 3-е. Победители играют за чемпионство.
            </span>
          </li>
          <li className="flex gap-2.5">
            <span className="w-1 shrink-0 rounded-full bg-sky-500 mt-1" aria-hidden="true" />
            <span className="text-muted-foreground">
              <span className="font-semibold text-sky-600 dark:text-sky-400">Нижняя сетка</span> — команды 5–8. Полуфинал: 5-е vs 8-е, 6-е vs 7-е.
            </span>
          </li>
          <li className="flex gap-2.5">
            <span className="w-1 shrink-0 rounded-full bg-border mt-1" aria-hidden="true" />
            <span className="text-muted-foreground">Проигравшие полуфиналов играют за 3-е (7-е) место.</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PlayoffPage;
