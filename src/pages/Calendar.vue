<template>
  <div class="animate-fade-in">
    <!-- Month navigation -->
    <div class="flex items-center justify-between mb-4">
      <h2 class="font-display text-xl font-semibold">{{ MONTH_NAMES[month] }} {{ year }}</h2>
      <div class="flex gap-1">
        <Button
          variant="outline"
          size="icon"
          @click="prevMonth"
          aria-label="Предыдущий месяц"
          class="w-10 h-10"
        >
          <ChevronLeft class="w-4 h-4" aria-hidden="true" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          @click="nextMonth"
          aria-label="Следующий месяц"
          class="w-10 h-10"
        >
          <ChevronRight class="w-4 h-4" aria-hidden="true" />
        </Button>
      </div>
    </div>

    <div class="overflow-x-auto">
      <div class="min-w-[560px]">
        <!-- Day-of-week header -->
        <div class="grid grid-cols-7 mb-px">
          <div
            v-for="d in DOW"
            :key="d"
            class="text-center text-xs font-medium text-muted-foreground py-2"
          >
            {{ d }}
          </div>
        </div>

        <!-- Calendar grid -->
        <div class="grid grid-cols-7 border-l border-t border-border rounded-b-lg overflow-hidden">
          <div
            v-for="(date, i) in grid"
            :key="i"
            :class="['border-r border-b border-border min-h-[88px] p-1.5', date.getMonth() !== month ? 'bg-muted/20' : '']"
          >
            <!-- Day number -->
            <div
              :class="[
                'text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full mb-1',
                toKey(date) === todayKey
                  ? 'bg-accent text-accent-foreground'
                  : date.getMonth() === month
                    ? 'text-foreground'
                    : 'text-muted-foreground/50',
              ]"
            >
              {{ date.getDate() }}
            </div>

            <!-- Match chips -->
            <div class="flex flex-col gap-0.5">
              <button
                v-for="m in sortedMatches(date)"
                :key="m.id"
                @click="selectedMatch = m"
                :aria-label="`${teamById[m.homeId].name} — ${teamById[m.awayId].name}${m.played && m.result ? `, счёт ${m.result.setsHome}:${m.result.setsAway}` : `, начало ${m.time.split('-')[0]}`}, ${m.venue}`"
                :class="[
                  'w-full text-left text-[10px] leading-snug px-1 py-0.5 rounded transition-opacity hover:opacity-70',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
                  m.played ? 'bg-sport-win/20 border-l-2 border-sport-win' : 'bg-accent/15 border-l-2 border-accent',
                ]"
              >
                <div class="font-semibold truncate text-foreground">
                  {{ teamById[m.homeId].short }} – {{ teamById[m.awayId].short }}
                </div>
                <div class="text-foreground/70">
                  {{ m.played && m.result ? `${m.result.setsHome}:${m.result.setsAway}` : m.time.split("-")[0] }}
                </div>
                <div class="text-muted-foreground truncate">{{ m.venue }}</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Legend -->
    <div class="flex gap-4 mt-3 text-xs text-muted-foreground" aria-label="Обозначения">
      <span class="flex items-center gap-1.5">
        <span class="w-2 h-2 rounded-sm bg-sport-win/15 border border-sport-win/30 inline-block" aria-hidden="true" />
        Сыгран
      </span>
      <span class="flex items-center gap-1.5">
        <span class="w-2 h-2 rounded-sm bg-accent/15 border border-accent/30 inline-block" aria-hidden="true" />
        Предстоит
      </span>
    </div>

    <!-- Match detail dialog -->
    <Dialog :open="!!selectedMatch" @update:open="(open) => { if (!open) selectedMatch = null }">
      <DialogContent class="max-w-[600px] p-0 gap-0 overflow-hidden">
        <DialogHeader class="px-5 py-3 bg-card border-b border-border flex-row items-center justify-between space-y-0">
          <DialogTitle class="text-xs font-semibold text-accent uppercase tracking-widest sr-only">
            {{ selectedMatch ? `Тур ${selectedMatch.gameweek}: ${teamById[selectedMatch.homeId]?.name} — ${teamById[selectedMatch.awayId]?.name}` : '' }}
          </DialogTitle>
          <span class="text-xs font-semibold text-accent uppercase tracking-widest">
            Тур {{ selectedMatch?.gameweek }}
          </span>
          <Badge
            v-if="selectedMatch"
            :class="selectedMatch.played ? 'bg-sport-win/15 text-sport-win border-sport-win/30' : 'bg-accent/15 text-accent border-accent/30'"
            class="border"
          >
            {{ selectedMatch.played ? "Сыгран" : "Предстоит" }}
          </Badge>
        </DialogHeader>
        <MatchCard v-if="selectedMatch" :match="selectedMatch" :link-teams="true" />
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { ChevronLeft, ChevronRight } from "lucide-vue-next";
import { matches, teams } from "@/data/league";
import type { Match } from "@/data/league";
import MatchCard from "@/components/MatchCard.vue";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const teamById = Object.fromEntries(teams.map((t) => [t.id, t]));

const matchesByDate: Record<string, Match[]> = {};
for (const m of matches) {
  if (!matchesByDate[m.date]) matchesByDate[m.date] = [];
  matchesByDate[m.date].push(m);
}

const toKey = (d: Date): string =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const MONTH_NAMES = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
];
const DOW = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

function getMonthGrid(y: number, m: number): Date[] {
  const firstDay = new Date(y, m, 1);
  const lastDay = new Date(y, m + 1, 0);
  const startDow = (firstDay.getDay() + 6) % 7;
  const days: Date[] = [];
  for (let i = startDow - 1; i >= 0; i--) days.push(new Date(y, m, -i));
  for (let d = 1; d <= lastDay.getDate(); d++) days.push(new Date(y, m, d));
  const trailing = (7 - (days.length % 7)) % 7;
  for (let i = 1; i <= trailing; i++) days.push(new Date(y, m + 1, i));
  return days;
}

const today = new Date();
const year = ref(today.getFullYear());
const month = ref(today.getMonth());
const selectedMatch = ref<Match | null>(null);

const grid = computed(() => getMonthGrid(year.value, month.value));
const todayKey = toKey(new Date());

function prevMonth() {
  if (month.value === 0) { month.value = 11; year.value--; }
  else month.value--;
}
function nextMonth() {
  if (month.value === 11) { month.value = 0; year.value++; }
  else month.value++;
}
function sortedMatches(date: Date) {
  return [...(matchesByDate[toKey(date)] ?? [])].sort((a, b) => a.time.localeCompare(b.time));
}
</script>
