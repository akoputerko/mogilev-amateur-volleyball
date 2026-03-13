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
      <span
        class="w-14 h-14 rounded-xl flex items-center justify-center text-lg font-bold text-primary-foreground flex-shrink-0"
        :style="{ backgroundColor: `hsl(${team.color})` }"
      >
        {{ team.short }}
      </span>
      <div class="flex-1 min-w-0">
        <h2 class="text-xl text-primary-foreground truncate">{{ team.name }}</h2>
        <div class="flex flex-wrap gap-x-4 gap-y-1 mt-1">
          <span class="flex items-center gap-1 text-primary-foreground/60 text-xs">
            <MapPin class="w-3 h-3" aria-hidden="true" /> {{ team.hall }} · {{ team.hallAddress }}
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
      <CardContent class="pt-4 space-y-4">
        <!-- Points totals -->
        <div>
          <h4 class="font-display text-sm text-muted-foreground mb-3">Очки в партиях</h4>
          <div class="flex items-end gap-4 mb-2">
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
          <div class="flex justify-between text-[10px] text-muted-foreground mt-1.5">
            <span>≈{{ avgWon }} оч/партию</span>
            <span>≈{{ avgLost }} оч/партию</span>
          </div>
        </div>

        <!-- Match type breakdown -->
        <div>
          <div class="text-xs text-muted-foreground mb-2">Характер матчей</div>
          <div class="grid grid-cols-4 gap-2">
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
      </CardContent>
    </Card>

    <!-- Form strip -->
    <Card v-if="playedMatches.length > 0">
      <CardContent class="pt-4">
        <h4 class="font-display text-sm text-muted-foreground mb-3">
          Форма (последние {{ Math.min(playedMatches.length, 7) }})
        </h4>
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
      </CardContent>
    </Card>

    <!-- Head-to-head records -->
    <Card v-if="Object.keys(h2h).length > 0">
      <CardContent class="pt-4">
        <h4 class="font-display text-sm text-muted-foreground mb-3">Очные встречи</h4>
        <div class="grid grid-cols-3 sm:grid-cols-4 gap-2">
          <div
            v-for="[oppIdStr, record] in Object.entries(h2h)"
            :key="oppIdStr"
            class="bg-secondary/40 rounded-lg p-2 text-center"
          >
            <div class="flex items-center gap-1.5 justify-center mb-1">
              <span
                class="w-2 h-2 rounded-full flex-shrink-0"
                :style="{ backgroundColor: `hsl(${getTeam(Number(oppIdStr)).color})` }"
                aria-hidden="true"
              />
              <span class="text-xs font-medium truncate">{{ getTeam(Number(oppIdStr)).short }}</span>
            </div>
            <div class="font-display text-base font-bold">
              <span class="text-sport-win">{{ record.won }}</span>
              <span class="text-muted-foreground/40 mx-0.5 text-sm font-sans">:</span>
              <span class="text-sport-loss">{{ record.lost }}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Matches with filter -->
    <div>
      <div class="flex items-center justify-between mb-4">
        <h4 class="font-display text-sm text-muted-foreground">Матчи</h4>
        <div class="flex gap-1 bg-secondary rounded-lg p-1" role="group" aria-label="Фильтр матчей">
          <Button
            v-for="f in filters"
            :key="f.key"
            variant="ghost"
            size="sm"
            @click="filter = f.key"
            :aria-pressed="filter === f.key"
            :class="[
              'gap-1.5 h-8',
              filter === f.key ? `${f.active} shadow-sm hover:opacity-90` : 'text-muted-foreground hover:text-foreground hover:bg-transparent',
            ]"
          >
            <span v-if="f.dot" :class="['w-2 h-2 rounded-full', f.dot]" aria-hidden="true" />
            {{ f.label }}
          </Button>
        </div>
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
import { calcStandings, getTeamMatches } from "@/lib/standings";
import MatchCard from "@/components/MatchCard.vue";
import StatBox from "@/components/StatBox.vue";
import { ArrowLeft, MapPin, Clock } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

const filters: { key: Filter; label: string; dot?: string; active: string }[] = [
  { key: "all",  label: "Все",      active: "bg-accent text-accent-foreground" },
  { key: "home", label: "Дома",     dot: "bg-sport-win", active: "bg-sport-win/20 text-sport-win" },
  { key: "away", label: "В гостях", dot: "bg-accent",    active: "bg-accent/20 text-accent" },
];

const standings = calcStandings();
const standingIdx = standings.findIndex((s) => s.team.id === teamId);
const standing = standingIdx >= 0 ? standings[standingIdx] : null;
const pos = standingIdx + 1;

const allMatches = getTeamMatches(teamId);
const playedMatches = allMatches.filter((m) => m.played);

const h2h = playedMatches.reduce<Record<number, { won: number; lost: number }>>((acc, m) => {
  const oppId = m.homeId === teamId ? m.awayId : m.homeId;
  if (!acc[oppId]) acc[oppId] = { won: 0, lost: 0 };
  const r = m.result!;
  const won = m.homeId === teamId ? r.setsHome > r.setsAway : r.setsAway > r.setsHome;
  if (won) acc[oppId].won++; else acc[oppId].lost++;
  return acc;
}, {});

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
  allMatches.filter((m) => {
    if (filter.value === "home") return m.homeId === teamId;
    if (filter.value === "away") return m.awayId === teamId;
    return true;
  }),
);

function matchWon(m: Match) {
  const r = m.result!;
  return m.homeId === teamId ? r.setsHome > r.setsAway : r.setsAway > r.setsHome;
}
function getOpponent(m: Match) {
  return getTeam(m.homeId === teamId ? m.awayId : m.homeId);
}
</script>
