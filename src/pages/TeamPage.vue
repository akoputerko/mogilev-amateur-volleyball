<template>
  <div v-if="team" class="animate-fade-in space-y-6">
    <!-- Back -->
    <Button
      variant="ghost"
      size="sm"
      @click="router.push('/teams')"
      aria-label="Вернуться к командам"
      class="gap-1.5 text-muted-foreground px-0 hover:bg-transparent hover:text-foreground"
    >
      <ArrowLeft class="w-4 h-4" aria-hidden="true" /> Команды
    </Button>

    <!-- Header -->
    <div class="sport-gradient rounded-xl p-5 flex items-center gap-4">
      <Avatar shape="square" size="base" :style="{ backgroundColor: `hsl(${team.color})` }">
        <AvatarFallback class="bg-transparent text-primary-foreground font-bold text-lg">
          {{ team.short }}
        </AvatarFallback>
      </Avatar>
      <div class="flex-1 min-w-0">
        <h2 class="text-xl text-primary-foreground truncate">{{ team.name }}</h2>
        <div class="flex flex-wrap gap-x-4 gap-y-1 mt-1">
          <span class="flex items-center gap-1 text-primary-foreground/60 text-xs">
            <MapPin class="w-3 h-3" aria-hidden="true" />
            {{ team.hall }} ·
            <a
              :href="`https://maps.google.com/?q=${encodeURIComponent(team.hallAddress + ', Могилёв')}`"
              target="_blank"
              rel="noopener noreferrer"
              class="underline hover:text-primary-foreground/90 transition-colors"
            >{{ team.hallAddress }}</a>
          </span>
          <span class="flex items-center gap-1 text-primary-foreground/60 text-xs">
            <Clock class="w-3 h-3" aria-hidden="true" /> {{ team.trainDays.join(", ") }} · {{ team.trainTime }}
          </span>
        </div>
      </div>
      <div v-if="standing" class="text-right flex-shrink-0">
        <div class="font-display text-3xl font-bold text-accent-foreground">{{ pos }}</div>
        <div class="text-primary-foreground/50 text-xs">место</div>
        <div class="font-display text-lg font-bold text-accent-foreground/80 mt-1">
          {{ standing.points }} <span class="text-xs font-sans font-normal">оч.</span>
        </div>
      </div>
    </div>

    <!-- Stats grid -->
    <div v-if="standing" class="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <StatBox label="Победы / Поражения" :wins="standing.won" :losses="standing.lost" />
      <StatBox label="Партии (В/П)" :wins="standing.setsWon" :losses="standing.setsLost" />
      <StatBox label="Дома (В/П)" :wins="standing.homeWon" :losses="standing.homeLost" />
      <StatBox label="В гостях (В/П)" :wins="standing.awayWon" :losses="standing.awayLost" />
    </div>

    <!-- Score totals + match breakdown -->
    <Card v-if="standing && standing.played > 0">
      <CardHeader class="pb-2">
        <CardTitle class="text-sm font-display text-muted-foreground normal-case tracking-normal">Очки в партиях</CardTitle>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="flex items-end gap-4 mb-2 flex-wrap">
          <div class="text-center">
            <div class="font-display text-3xl font-bold text-sport-win">{{ standing.pointsWon }}</div>
            <div class="text-[10px] text-muted-foreground mt-0.5">забито</div>
          </div>
          <div class="text-xl text-muted-foreground/30 mb-1 font-sans">:</div>
          <div class="text-center">
            <div class="font-display text-3xl font-bold text-sport-loss">{{ standing.pointsLost }}</div>
            <div class="text-[10px] text-muted-foreground mt-0.5">пропущено</div>
          </div>
          <div class="flex-1" />
          <div class="text-center">
            <div :class="['font-display text-xl font-bold', ptDiff > 0 ? 'text-sport-win' : ptDiff < 0 ? 'text-sport-loss' : 'text-muted-foreground']">
              {{ ptDiff > 0 ? `+${ptDiff}` : ptDiff }}
            </div>
            <div class="text-[10px] text-muted-foreground mt-0.5">разница</div>
          </div>
          <div class="text-center">
            <div :class="['font-display text-xl font-bold', ptEff >= 50 ? 'text-sport-win' : 'text-sport-loss']">
              {{ ptEff }}%
            </div>
            <div class="text-[10px] text-muted-foreground mt-0.5">эфф-ть</div>
          </div>
        </div>
        <Progress :model-value="ptEff" class="h-1.5 [&>div]:bg-sport-win" />
        <div class="flex justify-between text-[10px] text-muted-foreground">
          <span>≈{{ avgWon }} оч/партию</span>
          <span>≈{{ avgLost }} оч/партию</span>
        </div>

        <Separator />

        <div>
          <p class="text-xs text-muted-foreground mb-2">Характер матчей</p>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div
              v-for="item in matchBreakdown"
              :key="item.label"
              :class="['rounded-lg p-2.5 text-center', item.win ? (item.strong ? 'bg-sport-win/20' : 'bg-sport-win/10') : (item.strong ? 'bg-sport-loss/20' : 'bg-sport-loss/10')]"
            >
              <div :class="['text-[10px] font-semibold', item.win ? 'text-sport-win' : 'text-sport-loss']">{{ item.sub }}</div>
              <div class="font-display text-2xl font-bold text-foreground mt-0.5">{{ item.count }}</div>
              <div :class="['text-xs font-mono font-bold mt-0.5', item.win ? 'text-sport-win/70' : 'text-sport-loss/70']">{{ item.label }}</div>
            </div>
          </div>
        </div>

        <template v-if="comebackStats.totalDecisive > 0">
          <Separator />
          <div>
            <p class="text-xs text-muted-foreground mb-2">Решающие партии (3-я партия)</p>
            <div class="flex flex-wrap gap-3 text-sm">
              <div class="flex items-center gap-1.5">
                <span class="font-display text-base font-bold text-sport-win">{{ comebackStats.thirdSetWon }}</span>
                <span class="text-[10px] text-muted-foreground">побед</span>
                <span class="text-muted-foreground/30 mx-0.5">/</span>
                <span class="font-display text-base font-bold text-sport-loss">{{ comebackStats.thirdSetLost }}</span>
                <span class="text-[10px] text-muted-foreground">поражений</span>
              </div>
              <div v-if="comebackStats.comebacks > 0" class="flex items-center gap-1.5">
                <span class="text-[10px] bg-sport-win/15 text-sport-win px-2 py-0.5 rounded font-semibold">
                  {{ comebackStats.comebacks }} камбэк{{ comebackStats.comebacks > 1 ? 'а' : '' }}
                </span>
              </div>
              <div v-if="comebackStats.blownLeads > 0" class="flex items-center gap-1.5">
                <span class="text-[10px] bg-sport-loss/15 text-sport-loss px-2 py-0.5 rounded font-semibold">
                  {{ comebackStats.blownLeads }} упущ. победа
                </span>
              </div>
            </div>
          </div>
        </template>

        <template v-if="scoringPatterns.totalSets > 0">
          <Separator />
          <div class="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
            <span>
              <span class="font-semibold text-foreground">{{ scoringPatterns.closeSets }}</span>
              напряжённых (≤3 очка)
            </span>
            <span>
              <span class="font-semibold text-foreground">{{ scoringPatterns.dominantSets }}</span>
              разгромных (≥10)
            </span>
            <span>
              разница в партии: ≈<span class="font-semibold text-foreground">{{ scoringPatterns.avgMargin.toFixed(1) }}</span>
            </span>
          </div>
        </template>
      </CardContent>
    </Card>

    <!-- Set-by-set performance -->
    <Card v-if="standing && standing.played > 0">
      <CardHeader class="pb-2">
        <CardTitle class="text-sm font-display text-muted-foreground normal-case tracking-normal">Игра по партиям</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-3 gap-3">
          <div
            v-for="sp in setPerf"
            :key="sp.setNum"
            class="text-center bg-secondary/40 rounded-lg p-3"
          >
            <div class="text-[10px] text-muted-foreground mb-1.5">Партия {{ sp.setNum }}</div>
            <div
              :class="[
                'font-display text-2xl font-bold',
                sp.won > sp.lost ? 'text-sport-win' : sp.won < sp.lost ? 'text-sport-loss' : 'text-muted-foreground',
              ]"
            >
              {{ sp.won + sp.lost > 0 ? Math.round((sp.won / (sp.won + sp.lost)) * 100) : 0 }}%
            </div>
            <div class="text-[10px] text-muted-foreground mt-0.5 mb-2">выиграно</div>
            <div class="text-[11px] font-mono">
              <span class="text-sport-win">{{ sp.avgScored.toFixed(1) }}</span>
              <span class="text-muted-foreground/40 mx-0.5">:</span>
              <span class="text-sport-loss">{{ sp.avgConceded.toFixed(1) }}</span>
            </div>
            <div class="text-[9px] text-muted-foreground mt-0.5">avg</div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Form strip -->
    <Card v-if="playedMatches.length > 0">
      <CardHeader class="pb-2">
        <div class="flex items-center justify-between">
          <CardTitle class="text-sm font-display text-muted-foreground normal-case tracking-normal">
            Форма (последние {{ Math.min(playedMatches.length, 7) }})
          </CardTitle>
          <span v-if="streaks.current" class="text-xs font-bold px-2 py-0.5 rounded"
            :class="streaks.current.type === 'win' ? 'bg-sport-win/20 text-sport-win' : 'bg-sport-loss/20 text-sport-loss'"
          >
            {{ streaks.current.count }}{{ streaks.current.type === 'win' ? 'В' : 'П' }} серия
          </span>
        </div>
      </CardHeader>
      <CardContent class="space-y-3">
        <div class="flex gap-1.5">
          <span
            v-for="m in playedMatches.slice(-7)"
            :key="m.id"
            :aria-label="`${matchWon(m) ? 'Победа' : 'Поражение'} — ${getOpponent(m).name}, ${new Date(m.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}`"
            :class="['w-8 h-8 rounded flex items-center justify-center text-xs font-bold text-white', matchWon(m) ? 'bg-sport-win' : 'bg-sport-loss']"
          >
            {{ matchWon(m) ? "В" : "П" }}
          </span>
        </div>
        <div v-if="streaks.longestWin > 0 || streaks.longestLoss > 0" class="flex gap-4 text-[11px] text-muted-foreground">
          <span v-if="streaks.longestWin > 0">
            Лучшая серия: <span class="font-semibold text-sport-win">{{ streaks.longestWin }}В</span>
          </span>
          <span v-if="streaks.longestLoss > 0">
            Худшая серия: <span class="font-semibold text-sport-loss">{{ streaks.longestLoss }}П</span>
          </span>
        </div>
      </CardContent>
    </Card>

    <!-- Position history -->
    <Card v-if="posHistory.length > 1">
      <CardHeader class="pb-2">
        <CardTitle class="text-sm font-display text-muted-foreground normal-case tracking-normal">Позиция по турам</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="flex gap-2 flex-wrap">
          <div
            v-for="ph in posHistory"
            :key="ph.gameweek"
            class="text-center"
          >
            <div
              :class="[
                'w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold font-display',
                ph.position === 1 ? 'bg-amber-400/20 text-amber-400' : ph.position <= 4 ? 'bg-sky-500/20 text-sky-500' : 'bg-secondary text-muted-foreground',
              ]"
            >
              {{ ph.position }}
            </div>
            <div class="text-[9px] text-muted-foreground mt-0.5">Т{{ ph.gameweek }}</div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Head-to-head records -->
    <Card v-if="Object.keys(h2h).length > 0">
      <CardHeader class="pb-2">
        <CardTitle class="text-sm font-display text-muted-foreground normal-case tracking-normal">Очные встречи</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-3 sm:grid-cols-4 gap-2">
          <div
            v-for="[oppIdStr, record] in sortedH2h"
            :key="oppIdStr"
            class="bg-secondary/40 rounded-lg p-2 text-center"
          >
            <div class="flex items-center gap-1.5 justify-center mb-1">
              <Avatar shape="square" class="w-4 h-4 text-[8px]" :style="{ backgroundColor: `hsl(${getTeam(Number(oppIdStr)).color})` }">
                <AvatarFallback class="bg-transparent text-primary-foreground font-bold">
                  {{ getTeam(Number(oppIdStr)).short.slice(0, 1) }}
                </AvatarFallback>
              </Avatar>
              <span class="text-xs font-medium truncate">{{ getTeam(Number(oppIdStr)).short }}</span>
            </div>
            <div class="font-display text-base font-bold">
              <span class="text-sport-win">{{ record.won }}</span>
              <span class="text-muted-foreground/40 mx-0.5 text-sm font-sans">:</span>
              <span class="text-sport-loss">{{ record.lost }}</span>
            </div>
            <div class="text-[9px] text-muted-foreground mt-0.5">
              Партии: <span class="text-sport-win">{{ record.setsWon }}</span>-<span class="text-sport-loss">{{ record.setsLost }}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Matches with filter -->
    <div>
      <div class="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div class="flex items-center gap-3">
          <h4 class="font-display text-sm text-muted-foreground">Матчи</h4>
          <span class="text-xs font-medium text-muted-foreground">
            осталось <span class="text-foreground font-bold">{{ remainingCount }}</span>
          </span>
          <label class="flex items-center gap-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              v-model="showPast"
              class="w-3.5 h-3.5 rounded accent-accent cursor-pointer"
              aria-label="Показать прошедшие матчи"
            />
            <span class="text-xs text-muted-foreground">Прошедшие</span>
          </label>
        </div>
        <ToggleGroup
          type="single"
          :model-value="filter"
          @update:model-value="(val) => { if (val) filter = val as Filter }"
          aria-label="Фильтр матчей"
          class="bg-secondary rounded-lg p-1 gap-0"
        >
          <ToggleGroupItem value="all" class="h-8 px-3 rounded-md data-[state=on]:bg-accent data-[state=on]:text-accent-foreground">
            Все
          </ToggleGroupItem>
          <ToggleGroupItem value="home" class="h-8 px-3 rounded-md gap-1.5 data-[state=on]:bg-sport-win/20 data-[state=on]:text-sport-win">
            <span class="w-2 h-2 rounded-full bg-sport-win" aria-hidden="true" /> Дома
          </ToggleGroupItem>
          <ToggleGroupItem value="away" class="h-8 px-3 rounded-md gap-1.5 data-[state=on]:bg-accent/20 data-[state=on]:text-accent">
            <span class="w-2 h-2 rounded-full bg-accent" aria-hidden="true" /> В гостях
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div class="grid gap-4 sm:grid-cols-2">
        <MatchCard v-for="m in filteredMatches" :key="m.id" :match="m" :team-id="teamId" :link-teams="true" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getTeam } from "@/data/league";
import { calcStandings, getTeamMatches, isMatchPast } from "@/lib/standings";
import { getStreaks, getSetPerformance, getPositionHistory, getComebackStats, getScoringPatterns } from "@/lib/stats";
import MatchCard from "@/components/MatchCard.vue";
import StatBox from "@/components/StatBox.vue";
import { ArrowLeft, MapPin, Clock } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { Match } from "@/data/league";

type Filter = "all" | "home" | "away";

const route = useRoute();
const router = useRouter();

const teamId = Number(route.params.id);
const team = getTeam(teamId);

onMounted(() => {
  if (!team) router.replace("/teams");
});

const filter = ref<Filter>("all");
const showPast = ref(false);

const standings = calcStandings();
const standingIdx = standings.findIndex((s) => s.team.id === teamId);
const standing = standingIdx >= 0 ? standings[standingIdx] : null;
const pos = standingIdx + 1;

const allMatches = getTeamMatches(teamId);
const playedMatches = allMatches.filter((m) => m.played);

const streaks = getStreaks(teamId);
const setPerf = getSetPerformance(teamId);
const posHistory = getPositionHistory(teamId);
const comebackStats = getComebackStats(teamId);
const scoringPatterns = getScoringPatterns(teamId);

const h2h = playedMatches.reduce<Record<number, { won: number; lost: number; setsWon: number; setsLost: number }>>((acc, m) => {
  const oppId = m.homeId === teamId ? m.awayId : m.homeId;
  if (!acc[oppId]) acc[oppId] = { won: 0, lost: 0, setsWon: 0, setsLost: 0 };
  const r = m.result!;
  const mySets = m.homeId === teamId ? r.setsHome : r.setsAway;
  const oppSets = m.homeId === teamId ? r.setsAway : r.setsHome;
  if (mySets > oppSets) acc[oppId].won++; else acc[oppId].lost++;
  acc[oppId].setsWon += mySets;
  acc[oppId].setsLost += oppSets;
  return acc;
}, {});

const sortedH2h = Object.entries(h2h).sort(([aId], [bId]) =>
  getTeam(Number(aId)).name.localeCompare(getTeam(Number(bId)).name, "ru"),
);

const totalSets = (standing?.played ?? 0) * 3;
const totalPts  = (standing?.pointsWon ?? 0) + (standing?.pointsLost ?? 0);
const ptDiff    = (standing?.pointsWon ?? 0) - (standing?.pointsLost ?? 0);
const ptEff     = totalPts > 0 ? Math.round(((standing?.pointsWon ?? 0) / totalPts) * 100) : 0;
const avgWon    = totalSets > 0 ? ((standing?.pointsWon ?? 0) / totalSets).toFixed(1) : "—";
const avgLost   = totalSets > 0 ? ((standing?.pointsLost ?? 0) / totalSets).toFixed(1) : "—";

let w30 = 0, w21 = 0, l12 = 0, l03 = 0;
for (const m of playedMatches) {
  const r = m.result!;
  const mine = m.homeId === teamId ? r.setsHome : r.setsAway;
  const opp  = m.homeId === teamId ? r.setsAway : r.setsHome;
  if      (mine === 3 && opp === 0) w30++;
  else if (mine === 2 && opp === 1) w21++;
  else if (mine === 1 && opp === 2) l12++;
  else                               l03++;
}

const matchBreakdown = [
  { label: "3:0", sub: "Победа",    count: w30, win: true,  strong: true  },
  { label: "2:1", sub: "Победа",    count: w21, win: true,  strong: false },
  { label: "1:2", sub: "Поражение", count: l12, win: false, strong: false },
  { label: "0:3", sub: "Поражение", count: l03, win: false, strong: true  },
];

const filteredMatches = computed(() =>
  allMatches
    .filter((m) => {
      if (!showPast.value && (m.played || isMatchPast(m))) return false;
      if (filter.value === "home") return m.homeId === teamId;
      if (filter.value === "away") return m.awayId === teamId;
      return true;
    })
    .sort((a, b) => {
      const aPlayed = a.played || isMatchPast(a);
      const bPlayed = b.played || isMatchPast(b);
      if (aPlayed && bPlayed) return b.date.localeCompare(a.date);
      if (!aPlayed && !bPlayed) return a.date.localeCompare(b.date);
      return aPlayed ? -1 : 1;
    }),
);

const remainingCount = computed(() =>
  allMatches.filter((m) => {
    if (m.played || isMatchPast(m)) return false;
    if (filter.value === "home") return m.homeId === teamId;
    if (filter.value === "away") return m.awayId === teamId;
    return true;
  }).length,
);

function matchWon(m: Match) {
  const r = m.result!;
  return m.homeId === teamId ? r.setsHome > r.setsAway : r.setsAway > r.setsHome;
}
function getOpponent(m: Match) {
  return getTeam(m.homeId === teamId ? m.awayId : m.homeId);
}
</script>
