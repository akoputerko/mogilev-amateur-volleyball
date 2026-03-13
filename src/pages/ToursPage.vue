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

    <div class="grid gap-4 sm:grid-cols-2">
      <MatchCard v-for="m in gwMatches" :key="m.id" :match="m" :link-teams="true" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { matches, totalGameweeks } from "@/data/league";
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
</script>
