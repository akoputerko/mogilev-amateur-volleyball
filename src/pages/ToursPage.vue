<template>
  <div class="animate-fade-in">
    <div class="mb-6">
      <div class="flex flex-wrap items-center gap-3">
        <div class="flex items-center gap-3">
          <button
            @click="gw = Math.max(1, gw - 1)"
            :disabled="gw === 1"
            aria-label="Предыдущий тур"
            class="w-9 h-9 flex items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors disabled:opacity-30 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <ChevronLeft class="w-4 h-4" aria-hidden="true" />
          </button>
          <div class="relative inline-block">
            <select
              v-model="gw"
              aria-label="Выберите тур"
              class="appearance-none bg-card border border-border rounded-lg px-4 py-2.5 pr-10 font-display text-lg font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-accent cursor-pointer"
            >
              <option v-for="n in totalGameweeks" :key="n" :value="n">Тур {{ n }}</option>
            </select>
            <ChevronDown
              class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"
              aria-hidden="true"
            />
          </div>
          <button
            @click="gw = Math.min(totalGameweeks, gw + 1)"
            :disabled="gw === totalGameweeks"
            aria-label="Следующий тур"
            class="w-9 h-9 flex items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors disabled:opacity-30 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <ChevronRight class="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-muted-foreground text-sm">{{ dateRange }}</span>
          <span :class="['text-xs font-medium px-2 py-0.5 rounded-full', statusConfig.className]">
            {{ statusConfig.label }}
          </span>
          <button
            v-if="gw !== currentGw"
            @click="gw = currentGw"
            :aria-label="`Перейти к текущему туру ${currentGw}`"
            class="flex items-center gap-1.5 px-3 h-9 rounded-lg border border-accent/40 bg-accent/10 text-accent text-sm font-medium hover:bg-accent/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <LocateFixed class="w-3.5 h-3.5" aria-hidden="true" />
            <span class="hidden sm:inline">Текущий</span>
          </button>
        </div>
      </div>
    </div>

    <div class="grid gap-4 sm:grid-cols-2">
      <MatchCard v-for="m in gwMatches" :key="m.id" :match="m" :link-teams="true" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { matches, totalGameweeks } from "@/data/league";
import MatchCard from "@/components/MatchCard.vue";
import { ChevronDown, ChevronLeft, ChevronRight, LocateFixed } from "lucide-vue-next";

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
</script>
