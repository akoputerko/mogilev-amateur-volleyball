<template>
  <div class="animate-fade-in">
    <div class="mb-6">
      <div class="flex flex-wrap items-center gap-3">
        <div class="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            @click="gw = Math.max(1, gw - 1)"
            :disabled="gw === 1"
            aria-label="Предыдущий тур"
            class="w-9 h-9"
          >
            <ChevronLeft class="w-4 h-4" aria-hidden="true" />
          </Button>

          <Select :model-value="String(gw)" @update:model-value="gw = Number($event)">
            <SelectTrigger class="w-36 font-display text-lg font-semibold" aria-label="Выберите тур">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="n in totalGameweeks" :key="n" :value="String(n)">
                Тур {{ n }}
              </SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            @click="gw = Math.min(totalGameweeks, gw + 1)"
            :disabled="gw === totalGameweeks"
            aria-label="Следующий тур"
            class="w-9 h-9"
          >
            <ChevronRight class="w-4 h-4" aria-hidden="true" />
          </Button>
        </div>

        <div class="flex items-center gap-2">
          <span class="text-muted-foreground text-sm">{{ dateRange }}</span>
          <Badge :class="statusConfig.className">{{ statusConfig.label }}</Badge>
          <Button
            v-if="gw !== currentGw"
            variant="outline"
            size="sm"
            @click="gw = currentGw"
            :aria-label="`Перейти к текущему туру ${currentGw}`"
            class="gap-1.5 border-accent/40 bg-accent/10 text-accent hover:bg-accent/20 hover:text-accent"
          >
            <LocateFixed class="w-3.5 h-3.5" aria-hidden="true" />
            <span class="hidden sm:inline">Текущий</span>
          </Button>
        </div>
      </div>
    </div>

    <!-- Tour summary (only for completed tours) -->
    <div v-if="tourSummary" class="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
      <div class="bg-secondary/40 rounded-lg px-3 py-2 text-center">
        <div class="text-[10px] text-muted-foreground">Очков разыграно</div>
        <div class="font-display text-xl font-bold text-foreground mt-0.5">{{ tourSummary.totalPoints }}</div>
      </div>
      <div class="bg-secondary/40 rounded-lg px-3 py-2 text-center">
        <div class="text-[10px] text-muted-foreground">Разгромы / Борьба</div>
        <div class="font-display text-xl font-bold text-foreground mt-0.5">
          <span class="text-sport-win">{{ tourSummary.clean }}</span>
          <span class="text-muted-foreground/30 mx-0.5 text-sm font-sans">/</span>
          <span class="text-accent">{{ tourSummary.contested }}</span>
        </div>
        <div class="text-[9px] text-muted-foreground">3-0 / 2-1</div>
      </div>
      <div class="bg-secondary/40 rounded-lg px-3 py-2 text-center">
        <div class="text-[10px] text-muted-foreground">Самая напряжённая</div>
        <div class="font-display text-xl font-bold text-foreground mt-0.5">{{ tourSummary.closestScore }}</div>
        <div class="text-[9px] text-muted-foreground truncate">{{ tourSummary.closestDetail }}</div>
      </div>
      <div class="bg-secondary/40 rounded-lg px-3 py-2 text-center">
        <div class="text-[10px] text-muted-foreground">Разгром</div>
        <div class="font-display text-xl font-bold text-foreground mt-0.5">{{ tourSummary.dominantScore }}</div>
        <div class="text-[9px] text-muted-foreground truncate">{{ tourSummary.dominantDetail }}</div>
      </div>
    </div>

    <div class="grid gap-4 sm:grid-cols-2">
      <MatchCard v-for="m in gwMatches" :key="m.id" :match="m" :link-teams="true" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { matches, totalGameweeks, getTeam } from "@/data/league";
import MatchCard from "@/components/MatchCard.vue";
import { ChevronLeft, ChevronRight, LocateFixed } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
}

function getDefaultGameweek(): number {
  const today = new Date().toISOString().slice(0, 10);
  for (let g = 1; g <= totalGameweeks; g++) {
    const gwDates = matches.filter((m) => m.gameweek === g).map((m) => m.date);
    const maxDate = gwDates.sort().at(-1);
    if (maxDate && maxDate >= today) return g;
  }
  return totalGameweeks;
}

const currentGw = getDefaultGameweek();
const gw = ref(currentGw);

const gwMatches = computed(() =>
  matches.filter((m) => m.gameweek === gw.value).sort((a, b) => a.date.localeCompare(b.date)),
);

const dateRange = computed(() => {
  const dates = gwMatches.value.map((m) => m.date).sort();
  if (!dates.length) return "";
  return dates[0] === dates[dates.length - 1]
    ? formatDate(dates[0])
    : `${formatDate(dates[0])} – ${formatDate(dates[dates.length - 1])}`;
});

const tourStatusConfig = {
  past:    { label: "Завершён",  className: "bg-muted text-muted-foreground border border-border" },
  current: { label: "Текущий",   className: "bg-accent/15 text-accent border border-accent/30" },
  future:  { label: "Предстоит", className: "bg-sky-500/10 text-sky-500 border border-sky-500/30" },
} as const;

const statusConfig = computed(() => {
  const status = gw.value < currentGw ? "past" : gw.value > currentGw ? "future" : "current";
  return tourStatusConfig[status];
});

const tourSummary = computed(() => {
  const played = gwMatches.value.filter((m) => m.played && m.result);
  if (played.length === 0) return null;

  let totalPoints = 0;
  let clean = 0, contested = 0;
  let minMargin = Infinity, minMarginScore = "", minMarginDetail = "";
  let maxMargin = 0, maxMarginScore = "", maxMarginDetail = "";

  for (const m of played) {
    const r = m.result!;
    totalPoints += r.setScores.reduce((sum, s) => sum + s.home + s.away, 0);
    if (Math.min(r.setsHome, r.setsAway) === 0) clean++; else contested++;

    for (const s of r.setScores) {
      const margin = Math.abs(s.home - s.away);
      const homeShort = getTeam(m.homeId).short;
      const awayShort = getTeam(m.awayId).short;
      if (margin < minMargin) {
        minMargin = margin;
        minMarginScore = `${s.home}:${s.away}`;
        minMarginDetail = `${homeShort} - ${awayShort}`;
      }
      if (margin > maxMargin) {
        maxMargin = margin;
        maxMarginScore = `${s.home}:${s.away}`;
        maxMarginDetail = `${homeShort} - ${awayShort}`;
      }
    }
  }

  return {
    totalPoints,
    clean,
    contested,
    closestScore: minMargin < Infinity ? minMarginScore : "—",
    closestDetail: minMargin < Infinity ? minMarginDetail : "",
    dominantScore: maxMargin > 0 ? maxMarginScore : "—",
    dominantDetail: maxMargin > 0 ? maxMarginDetail : "",
  };
});
</script>
