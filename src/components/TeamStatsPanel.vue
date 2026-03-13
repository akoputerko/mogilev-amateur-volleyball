<template>
  <Card class="mt-6 overflow-hidden animate-slide-up">
    <!-- Header -->
    <div class="sport-gradient px-4 py-4 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <span class="w-4 h-4 rounded-full" :style="{ backgroundColor: `hsl(${standing.team.color})` }" />
        <h3 class="text-primary-foreground text-xl">{{ standing.team.name }}</h3>
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

      <!-- Match history -->
      <div v-if="teamMatches.length > 0">
        <h4 class="font-display text-sm text-muted-foreground mb-3 flex items-center gap-2">
          <Trophy class="w-4 h-4" aria-hidden="true" /> Результаты
        </h4>
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
            <Badge
              :class="isHomeMatch(m) ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'"
              class="text-[10px] h-auto py-0.5"
            >
              {{ isHomeMatch(m) ? "Д" : "Г" }}
            </Badge>
            <span class="flex items-center gap-1.5 flex-1 min-w-0">
              <span
                class="w-2 h-2 rounded-full flex-shrink-0"
                :style="{ backgroundColor: `hsl(${getOpponent(m).color})` }"
                aria-hidden="true"
              />
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
        <h4 class="font-display text-sm text-muted-foreground mb-3 flex items-center gap-2">
          <CalendarIcon class="w-4 h-4" aria-hidden="true" /> Ближайшие матчи
        </h4>
        <div class="space-y-2">
          <div
            v-for="m in upcoming"
            :key="m.id"
            class="flex items-center gap-3 text-sm bg-secondary/50 rounded-md px-3 py-2"
          >
            <span class="text-xs text-muted-foreground w-14">
              {{ new Date(m.date).toLocaleDateString("ru-RU", { day: "numeric", month: "short" }) }}
            </span>
            <Badge
              :class="m.homeId === standing.team.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'"
              class="text-[10px] h-auto py-0.5"
            >
              {{ m.homeId === standing.team.id ? "Д" : "Г" }}
            </Badge>
            <span class="flex items-center gap-1.5">
              <span
                class="w-2 h-2 rounded-full"
                :style="{ backgroundColor: `hsl(${getUpcomingOpponent(m).color})` }"
                aria-hidden="true"
              />
              <span class="font-medium">{{ getUpcomingOpponent(m).name }}</span>
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
import StatBox from "./StatBox.vue";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const props = defineProps<{ standing: TeamStanding }>();
defineEmits<{ close: [] }>();

const teamMatches = computed(() =>
  getTeamMatches(props.standing.team.id).filter((m) => m.played),
);
const upcoming = computed(() => getUpcoming(props.standing.team.id, 3));

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
