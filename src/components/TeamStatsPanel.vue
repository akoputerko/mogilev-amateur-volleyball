<template>
  <Card class="mt-6 overflow-hidden animate-slide-up">
    <div class="sport-gradient px-4 py-4 flex items-center justify-between">
      <div class="flex items-center gap-3 flex-1 min-w-0">
        <Avatar shape="square" class="w-6 h-6 text-[10px]" :style="{ backgroundColor: `hsl(${standing.team.color})` }">
          <AvatarFallback class="bg-transparent text-primary-foreground font-bold">
            {{ standing.team.short.slice(0, 1) }}
          </AvatarFallback>
        </Avatar>
        <h3 class="text-primary-foreground text-xl truncate">{{ standing.team.name }}</h3>
      </div>
      <Button
        variant="ghost"
        size="icon"
        @click="$emit('close')"
        aria-label="Закрыть"
        class="text-primary-foreground/60 hover:text-primary-foreground hover:bg-white/10"
      >
        <X class="w-5 h-5" aria-hidden="true" />
      </Button>
    </div>

    <CardContent class="pt-4 space-y-6">
      <!-- Stats grid -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatBox label="Победы / Поражения" :wins="standing.won" :losses="standing.lost" />
        <StatBox label="Партии (В/П)" :wins="standing.setsWon" :losses="standing.setsLost" />
        <StatBox label="Дома (В/П)" :wins="standing.homeWon" :losses="standing.homeLost" />
        <StatBox label="В гостях (В/П)" :wins="standing.awayWon" :losses="standing.awayLost" />
      </div>

      <!-- Streak + position history -->
      <div v-if="streak.current || posHistory.length > 1" class="space-y-3">
        <div v-if="streak.current" class="flex items-center gap-2 flex-wrap">
          <span class="text-xs text-muted-foreground">Текущая серия:</span>
          <span
            :class="[
              'text-xs font-bold px-2 py-0.5 rounded',
              streak.current.type === 'win' ? 'bg-sport-win/20 text-sport-win' : 'bg-sport-loss/20 text-sport-loss',
            ]"
          >
            {{ streak.current.count }}{{ streak.current.type === 'win' ? ' победы' : ' поражения' }}
          </span>
        </div>
        <div v-if="posHistory.length > 1">
          <span class="text-xs text-muted-foreground block mb-1.5">Позиция по турам</span>
          <div class="flex gap-1.5 flex-wrap">
            <div
              v-for="ph in posHistory"
              :key="ph.gameweek"
              class="text-center"
            >
              <div
                :class="[
                  'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-display',
                  ph.position === 1 ? 'bg-amber-400/20 text-amber-400' : ph.position <= 4 ? 'bg-sky-500/20 text-sky-500' : 'bg-secondary text-muted-foreground',
                ]"
              >
                {{ ph.position }}
              </div>
              <div class="text-[8px] text-muted-foreground mt-0.5">Т{{ ph.gameweek }}</div>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      <!-- Match history -->
      <div v-if="teamMatches.length > 0">
        <p class="text-sm font-display text-muted-foreground mb-3 flex items-center gap-2">
          <Trophy class="w-4 h-4" aria-hidden="true" /> Результаты
        </p>
        <div class="space-y-2">
          <div
            v-for="m in teamMatches"
            :key="m.id"
            class="flex items-center gap-3 text-sm bg-secondary/30 rounded-md px-3 py-2"
          >
            <span
              :class="['w-2 h-2 rounded-full flex-shrink-0', isMatchWon(m) ? 'bg-sport-win' : 'bg-sport-loss']"
              aria-hidden="true"
            />
            <span class="text-xs text-muted-foreground w-14">
              {{ new Date(m.date).toLocaleDateString("ru-RU", { day: "numeric", month: "short" }) }}
            </span>
            <Badge :class="isHomeMatch(m) ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'" class="text-[10px] h-auto py-0.5">
              {{ isHomeMatch(m) ? "Д" : "Г" }}
            </Badge>
            <span class="flex items-center gap-1.5 flex-1 min-w-0">
              <Avatar shape="square" class="w-4 h-4 text-[8px] flex-shrink-0" :style="{ backgroundColor: `hsl(${getOpponent(m).color})` }">
                <AvatarFallback class="bg-transparent text-primary-foreground font-bold">
                  {{ getOpponent(m).short.slice(0, 1) }}
                </AvatarFallback>
              </Avatar>
              <span class="truncate">{{ getOpponent(m).name }}</span>
            </span>
            <span class="font-mono font-semibold">
              {{ isHomeMatch(m) ? m.result!.setsHome : m.result!.setsAway }}:{{ isHomeMatch(m) ? m.result!.setsAway : m.result!.setsHome }}
            </span>
          </div>
        </div>
      </div>

      <!-- Upcoming -->
      <div v-if="upcoming.length > 0">
        <p class="text-sm font-display text-muted-foreground mb-3 flex items-center gap-2">
          <CalendarIcon class="w-4 h-4" aria-hidden="true" /> Ближайшие матчи
        </p>
        <div class="space-y-2">
          <div
            v-for="m in upcoming"
            :key="m.id"
            class="flex items-center gap-3 text-sm bg-secondary/50 rounded-md px-3 py-2"
          >
            <span class="text-xs text-muted-foreground w-14">
              {{ new Date(m.date).toLocaleDateString("ru-RU", { day: "numeric", month: "short" }) }}
            </span>
            <Badge :class="m.homeId === standing.team.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'" class="text-[10px] h-auto py-0.5">
              {{ m.homeId === standing.team.id ? "Д" : "Г" }}
            </Badge>
            <span class="flex items-center gap-1.5 flex-1 min-w-0">
              <Avatar shape="square" class="w-4 h-4 text-[8px] flex-shrink-0" :style="{ backgroundColor: `hsl(${getUpcomingOpponent(m).color})` }">
                <AvatarFallback class="bg-transparent text-primary-foreground font-bold">
                  {{ getUpcomingOpponent(m).short.slice(0, 1) }}
                </AvatarFallback>
              </Avatar>
              <span class="font-medium truncate">{{ getUpcomingOpponent(m).name }}</span>
            </span>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { X, Trophy, Calendar as CalendarIcon } from "lucide-vue-next";
import { getTeam, type Match } from "@/data/league";
import { getTeamMatches, getUpcoming, type TeamStanding } from "@/lib/standings";
import { getStreaks, getPositionHistory } from "@/lib/stats";
import StatBox from "./StatBox.vue";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const props = defineProps<{ standing: TeamStanding }>();
defineEmits<{ close: [] }>();

const teamMatches = computed(() =>
  getTeamMatches(props.standing.team.id)
    .filter((m) => m.played)
    .sort((a, b) => b.date.localeCompare(a.date)),
);
const upcoming = computed(() => getUpcoming(props.standing.team.id, 3));
const streak = computed(() => getStreaks(props.standing.team.id));
const posHistory = computed(() => getPositionHistory(props.standing.team.id));

function isHomeMatch(m: Match) {
  return m.homeId === props.standing.team.id;
}
function isMatchWon(m: Match) {
  const r = m.result!;
  return isHomeMatch(m) ? r.setsHome > r.setsAway : r.setsAway > r.setsHome;
}
function getOpponent(m: Match) {
  return getTeam(isHomeMatch(m) ? m.awayId : m.homeId);
}
function getUpcomingOpponent(m: Match) {
  return getTeam(m.homeId === props.standing.team.id ? m.awayId : m.homeId);
}
</script>
