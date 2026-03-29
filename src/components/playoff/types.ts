import type { Team } from "@/data/league";

export type SlotData =
  | { kind: "seed"; pos: number; team: Team | null }
  | { kind: "adv"; label: string };

export type BracketTheme = "upper" | "lower";
export type BracketCardVariant = "semifinal" | "final" | "third" | "finalist";

export const THEME = {
  upper: {
    section: "bg-amber-400/5 border border-amber-400/20 rounded-xl p-4 md:p-6",
    accentBar: "bg-amber-400",
    titleText: "text-amber-500 dark:text-amber-400",
    cardBorder: "border-amber-400/30 border-l-2 border-l-amber-400/50",
    cardHeader: "bg-amber-400/10 border-b border-amber-400/20",
    headerText: "text-amber-700 dark:text-amber-300",
    connector: "border-amber-400/40",
    connectorThick: "border-amber-400/60",
    vsBg: "bg-amber-400/10",
    vsText: "text-amber-600 dark:text-amber-300",
    finalBorder: "border-amber-400/50 shadow-lg shadow-amber-400/10",
    roundLabelBg: "bg-amber-400/10",
    roundLabelText: "text-amber-600 dark:text-amber-300",
    finalistBorder: "border-amber-400/30",
    finalistBg: "bg-amber-400/5",
    trophyText: "text-amber-400",
  },
  lower: {
    section: "bg-sky-500/5 border border-sky-500/20 rounded-xl p-4 md:p-6",
    accentBar: "bg-sky-500",
    titleText: "text-sky-600 dark:text-sky-400",
    cardBorder: "border-sky-500/30 border-l-2 border-l-sky-500/50",
    cardHeader: "bg-sky-500/10 border-b border-sky-500/20",
    headerText: "text-sky-700 dark:text-sky-300",
    connector: "border-sky-500/40",
    connectorThick: "border-sky-500/60",
    vsBg: "bg-sky-500/10",
    vsText: "text-sky-600 dark:text-sky-300",
    finalBorder: "border-sky-500/50 shadow-lg shadow-sky-500/10",
    roundLabelBg: "bg-sky-500/10",
    roundLabelText: "text-sky-600 dark:text-sky-300",
    finalistBorder: "border-sky-500/30",
    finalistBg: "bg-sky-500/5",
    trophyText: "text-sky-500",
  },
} as const;
