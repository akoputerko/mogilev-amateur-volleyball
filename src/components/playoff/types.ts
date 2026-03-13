import type { Team } from "@/data/league";

export type SlotData =
  | { kind: "seed"; pos: number; team: Team | null }
  | { kind: "adv"; label: string };

export type BracketTheme = "upper" | "lower";

export const THEME = {
  upper: {
    section: "bg-amber-400/5 border border-amber-400/20 rounded-xl p-4",
    accentBar: "bg-amber-400",
    titleText: "text-amber-500 dark:text-amber-400",
    cardBorder: "border-amber-400/30 border-l-2 border-l-amber-400/50",
    cardHeader: "bg-amber-400/10 border-b border-amber-400/20",
    headerText: "text-amber-700 dark:text-amber-300",
    connector: "border-amber-400/40",
  },
  lower: {
    section: "bg-sky-500/5 border border-sky-500/20 rounded-xl p-4",
    accentBar: "bg-sky-500",
    titleText: "text-sky-600 dark:text-sky-400",
    cardBorder: "border-sky-500/30 border-l-2 border-l-sky-500/50",
    cardHeader: "bg-sky-500/10 border-b border-sky-500/20",
    headerText: "text-sky-700 dark:text-sky-300",
    connector: "border-sky-500/40",
  },
} as const;
