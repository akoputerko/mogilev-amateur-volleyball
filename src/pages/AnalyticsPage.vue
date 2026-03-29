<template>
  <div class="animate-fade-in space-y-6">

    <!-- 1. Обзор лиги -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div class="bg-secondary/40 rounded-lg p-3 text-center">
        <div class="font-display text-3xl font-bold text-foreground">{{ playedCount }}</div>
        <div class="text-[10px] text-muted-foreground mt-0.5">из {{ matches.length }} матчей</div>
      </div>
      <div class="bg-secondary/40 rounded-lg p-3 text-center">
        <div class="font-display text-3xl font-bold text-foreground">{{ playedCount * 3 }}</div>
        <div class="text-[10px] text-muted-foreground mt-0.5">партий сыграно</div>
      </div>
      <div class="bg-secondary/40 rounded-lg p-3 text-center">
        <div class="font-display text-3xl font-bold text-foreground">{{ totalPoints }}</div>
        <div class="text-[10px] text-muted-foreground mt-0.5">очков разыграно</div>
      </div>
      <div class="bg-secondary/40 rounded-lg p-3 text-center">
        <div class="font-display text-3xl font-bold text-foreground">{{ avgPointsPerSet }}</div>
        <div class="text-[10px] text-muted-foreground mt-0.5">очков в партии (avg)</div>
      </div>
    </div>

    <template v-if="playedCount > 0">

      <!-- 2. Результаты матчей -->
      <Card>
        <CardHeader class="pb-2">
          <CardTitle class="text-sm font-display text-muted-foreground normal-case tracking-normal">Результаты матчей</CardTitle>
        </CardHeader>
        <CardContent class="space-y-3">
          <div class="grid grid-cols-2 gap-3">
            <div class="bg-sport-win/10 rounded-lg p-3 text-center">
              <div class="text-[10px] font-semibold text-sport-win mb-0.5">Разгром</div>
              <div class="font-display text-3xl font-bold text-foreground">{{ count30 }}</div>
              <div class="text-xs font-mono font-bold text-sport-win/70 mt-0.5">3:0</div>
              <div class="text-[10px] text-muted-foreground mt-0.5">{{ pct30 }}% матчей</div>
            </div>
            <div class="bg-secondary/40 rounded-lg p-3 text-center">
              <div class="text-[10px] font-semibold text-muted-foreground mb-0.5">Борьба</div>
              <div class="font-display text-3xl font-bold text-foreground">{{ count21 }}</div>
              <div class="text-xs font-mono font-bold text-muted-foreground/70 mt-0.5">2:1</div>
              <div class="text-[10px] text-muted-foreground mt-0.5">{{ pct21 }}% матчей</div>
            </div>
          </div>
          <Progress :model-value="pct30" class="h-1.5 [&>div]:bg-sport-win" />
          <div class="flex justify-between text-[10px] text-muted-foreground">
            <span>Разгромы {{ pct30 }}%</span>
            <span>Борьба {{ pct21 }}%</span>
          </div>
        </CardContent>
      </Card>

      <!-- 3. Дома / В гостях -->
      <Card>
        <CardHeader class="pb-2">
          <CardTitle class="text-sm font-display text-muted-foreground normal-case tracking-normal">Дома / В гостях</CardTitle>
        </CardHeader>
        <CardContent class="space-y-3">
          <div class="flex items-end gap-4 flex-wrap mb-1">
            <div class="text-center">
              <div class="font-display text-3xl font-bold text-sport-win">{{ homeWins }}</div>
              <div class="text-[10px] text-muted-foreground mt-0.5">побед хозяев</div>
            </div>
            <div class="text-xl text-muted-foreground/30 mb-1 font-sans">:</div>
            <div class="text-center">
              <div class="font-display text-3xl font-bold text-accent">{{ awayWins }}</div>
              <div class="text-[10px] text-muted-foreground mt-0.5">побед гостей</div>
            </div>
            <div class="flex-1" />
            <div class="text-center">
              <div class="font-display text-xl font-bold text-foreground">{{ homeWinPct }}%</div>
              <div class="text-[10px] text-muted-foreground mt-0.5">преимущество дома</div>
            </div>
          </div>
          <Progress :model-value="homeWinPct" class="h-1.5 [&>div]:bg-sport-win" />
          <div class="flex justify-between text-[10px] text-muted-foreground">
            <span>Хозяева {{ homeWinPct }}%</span>
            <span>Гости {{ 100 - homeWinPct }}%</span>
          </div>

          <Separator />

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div class="bg-sport-win/10 rounded-lg p-2.5 text-center">
              <div class="text-[10px] text-sport-win font-semibold">Хозяева 3:0</div>
              <div class="font-display text-2xl font-bold text-foreground mt-0.5">{{ home30 }}</div>
            </div>
            <div class="bg-sport-win/5 rounded-lg p-2.5 text-center">
              <div class="text-[10px] text-sport-win font-semibold">Хозяева 2:1</div>
              <div class="font-display text-2xl font-bold text-foreground mt-0.5">{{ home21 }}</div>
            </div>
            <div class="bg-accent/5 rounded-lg p-2.5 text-center">
              <div class="text-[10px] text-accent font-semibold">Гости 2:1</div>
              <div class="font-display text-2xl font-bold text-foreground mt-0.5">{{ away21 }}</div>
            </div>
            <div class="bg-accent/10 rounded-lg p-2.5 text-center">
              <div class="text-[10px] text-accent font-semibold">Гости 3:0</div>
              <div class="font-display text-2xl font-bold text-foreground mt-0.5">{{ away30 }}</div>
            </div>
          </div>

          <Separator />

          <div class="flex justify-between text-[11px] text-muted-foreground">
            <span>Ср. очков за партию хозяев: <span class="font-semibold text-foreground">{{ avgHomePtsPerSet }}</span></span>
            <span>гостей: <span class="font-semibold text-foreground">{{ avgAwayPtsPerSet }}</span></span>
          </div>
        </CardContent>
      </Card>

      <!-- 4. Характер партий -->
      <Card>
        <CardHeader class="pb-2">
          <CardTitle class="text-sm font-display text-muted-foreground normal-case tracking-normal">Характер партий</CardTitle>
        </CardHeader>
        <CardContent class="space-y-3">
          <div class="grid grid-cols-3 gap-3">
            <div class="bg-secondary/40 rounded-lg p-3 text-center">
              <div class="font-display text-2xl font-bold text-foreground">{{ leagueCloseSets }}</div>
              <div class="text-[10px] text-muted-foreground mt-0.5">напряжённых</div>
              <div class="text-[10px] text-muted-foreground">≤3 очка ({{ pctClose }}%)</div>
            </div>
            <div class="bg-secondary/40 rounded-lg p-3 text-center">
              <div class="font-display text-2xl font-bold text-foreground">{{ leagueDomSets }}</div>
              <div class="text-[10px] text-muted-foreground mt-0.5">разгромных</div>
              <div class="text-[10px] text-muted-foreground">≥10 очков ({{ pctDom }}%)</div>
            </div>
            <div class="bg-secondary/40 rounded-lg p-3 text-center">
              <div class="font-display text-2xl font-bold text-foreground">{{ leagueAvgMargin }}</div>
              <div class="text-[10px] text-muted-foreground mt-0.5">средняя разница</div>
              <div class="text-[10px] text-muted-foreground">в партии</div>
            </div>
          </div>

          <Separator />

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div class="flex items-center gap-2 bg-secondary/30 rounded-lg px-3 py-2">
              <div class="text-[10px] text-muted-foreground flex-1">Больше всего напряжённых</div>
              <Avatar shape="square" class="w-5 h-5 text-[8px] flex-shrink-0" :style="{ backgroundColor: `hsl(${mostCloseTeam.team.color})` }">
                <AvatarFallback class="bg-transparent text-primary-foreground font-bold">{{ mostCloseTeam.team.short.slice(0,1) }}</AvatarFallback>
              </Avatar>
              <span class="text-xs font-medium">{{ mostCloseTeam.team.short }}</span>
              <span class="font-display text-sm font-bold text-foreground">{{ mostCloseTeam.closeSets }}</span>
            </div>
            <div class="flex items-center gap-2 bg-secondary/30 rounded-lg px-3 py-2">
              <div class="text-[10px] text-muted-foreground flex-1">Больше всего разгромных</div>
              <Avatar shape="square" class="w-5 h-5 text-[8px] flex-shrink-0" :style="{ backgroundColor: `hsl(${mostDomTeam.team.color})` }">
                <AvatarFallback class="bg-transparent text-primary-foreground font-bold">{{ mostDomTeam.team.short.slice(0,1) }}</AvatarFallback>
              </Avatar>
              <span class="text-xs font-medium">{{ mostDomTeam.team.short }}</span>
              <span class="font-display text-sm font-bold text-foreground">{{ mostDomTeam.dominantSets }}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- 5. Игра по партиям -->
      <Card>
        <CardHeader class="pb-2">
          <CardTitle class="text-sm font-display text-muted-foreground normal-case tracking-normal">Игра по партиям (лига)</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-3 gap-3">
            <div
              v-for="s in leagueSetStats"
              :key="s.setNum"
              class="text-center bg-secondary/40 rounded-lg p-3"
            >
              <div class="text-[10px] text-muted-foreground mb-1.5">Партия {{ s.setNum }}</div>
              <div
                :class="['font-display text-2xl font-bold', s.homeWinRate >= 0.5 ? 'text-sport-win' : 'text-sport-loss']"
              >
                {{ Math.round(s.homeWinRate * 100) }}%
              </div>
              <div class="text-[10px] text-muted-foreground mt-0.5 mb-2">хозяев</div>
              <div class="text-[11px] font-mono">
                <span class="text-foreground">{{ s.avgPoints }}</span>
              </div>
              <div class="text-[9px] text-muted-foreground mt-0.5">avg очков</div>
              <div class="text-[11px] font-mono mt-1">
                <span class="text-muted-foreground">±{{ s.avgMargin }}</span>
              </div>
              <div class="text-[9px] text-muted-foreground mt-0.5">avg разница</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- 6. Решающие партии -->
      <Card>
        <CardHeader class="pb-2">
          <CardTitle class="text-sm font-display text-muted-foreground normal-case tracking-normal">Решающие партии</CardTitle>
        </CardHeader>
        <CardContent class="space-y-3">
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div class="bg-secondary/40 rounded-lg p-3 text-center">
              <div class="font-display text-2xl font-bold text-foreground">{{ decisiveCount }}</div>
              <div class="text-[10px] text-muted-foreground mt-0.5">матчей 2:1</div>
              <div class="text-[10px] text-muted-foreground">{{ decisivePct }}% всех</div>
            </div>
            <div class="bg-sport-win/10 rounded-lg p-3 text-center">
              <div class="font-display text-2xl font-bold text-sport-win">{{ totalComebacks }}</div>
              <div class="text-[10px] text-muted-foreground mt-0.5">камбэков</div>
              <div class="text-[10px] text-muted-foreground">по лиге</div>
            </div>
            <div class="bg-sport-loss/10 rounded-lg p-3 text-center">
              <div class="font-display text-2xl font-bold text-sport-loss">{{ totalBlownLeads }}</div>
              <div class="text-[10px] text-muted-foreground mt-0.5">упущ. побед</div>
              <div class="text-[10px] text-muted-foreground">по лиге</div>
            </div>
            <div class="bg-secondary/40 rounded-lg p-3 text-center">
              <div class="font-display text-2xl font-bold text-foreground">{{ comebackRate }}%</div>
              <div class="text-[10px] text-muted-foreground mt-0.5">камбэков</div>
              <div class="text-[10px] text-muted-foreground">от матчей 2:1</div>
            </div>
          </div>

          <template v-if="decisiveCount > 0">
            <Separator />
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div v-if="mostComebackTeam" class="flex items-center gap-2 bg-sport-win/10 rounded-lg px-3 py-2">
                <div class="text-[10px] text-muted-foreground flex-1">Лидер по камбэкам</div>
                <Avatar shape="square" class="w-5 h-5 text-[8px] flex-shrink-0" :style="{ backgroundColor: `hsl(${mostComebackTeam.team.color})` }">
                  <AvatarFallback class="bg-transparent text-primary-foreground font-bold">{{ mostComebackTeam.team.short.slice(0,1) }}</AvatarFallback>
                </Avatar>
                <span class="text-xs font-medium">{{ mostComebackTeam.team.short }}</span>
                <span class="font-display text-sm font-bold text-sport-win">{{ mostComebackTeam.comebacks }}</span>
              </div>
              <div v-if="mostBlownTeam" class="flex items-center gap-2 bg-sport-loss/10 rounded-lg px-3 py-2">
                <div class="text-[10px] text-muted-foreground flex-1">Больше всех упущено</div>
                <Avatar shape="square" class="w-5 h-5 text-[8px] flex-shrink-0" :style="{ backgroundColor: `hsl(${mostBlownTeam.team.color})` }">
                  <AvatarFallback class="bg-transparent text-primary-foreground font-bold">{{ mostBlownTeam.team.short.slice(0,1) }}</AvatarFallback>
                </Avatar>
                <span class="text-xs font-medium">{{ mostBlownTeam.team.short }}</span>
                <span class="font-display text-sm font-bold text-sport-loss">{{ mostBlownTeam.blownLeads }}</span>
              </div>
            </div>
          </template>
        </CardContent>
      </Card>

      <!-- 7. Серии -->
      <Card>
        <CardHeader class="pb-2">
          <CardTitle class="text-sm font-display text-muted-foreground normal-case tracking-normal">Серии сезона</CardTitle>
        </CardHeader>
        <CardContent class="space-y-3">
          <div class="grid grid-cols-2 gap-3">
            <div class="bg-sport-win/10 rounded-lg p-3 text-center">
              <div class="text-[10px] text-sport-win font-semibold mb-1">Лучшая серия побед</div>
              <div class="font-display text-2xl font-bold text-sport-win">{{ longestWinStreak.longestWin }}В</div>
              <div class="flex items-center gap-1.5 justify-center mt-1.5">
                <Avatar shape="square" class="w-4 h-4 text-[7px]" :style="{ backgroundColor: `hsl(${longestWinStreak.team.color})` }">
                  <AvatarFallback class="bg-transparent text-primary-foreground font-bold">{{ longestWinStreak.team.short.slice(0,1) }}</AvatarFallback>
                </Avatar>
                <span class="text-xs text-muted-foreground">{{ longestWinStreak.team.short }}</span>
              </div>
            </div>
            <div class="bg-sport-loss/10 rounded-lg p-3 text-center">
              <div class="text-[10px] text-sport-loss font-semibold mb-1">Худшая серия поражений</div>
              <div class="font-display text-2xl font-bold text-sport-loss">{{ longestLossStreak.longestLoss }}П</div>
              <div class="flex items-center gap-1.5 justify-center mt-1.5">
                <Avatar shape="square" class="w-4 h-4 text-[7px]" :style="{ backgroundColor: `hsl(${longestLossStreak.team.color})` }">
                  <AvatarFallback class="bg-transparent text-primary-foreground font-bold">{{ longestLossStreak.team.short.slice(0,1) }}</AvatarFallback>
                </Avatar>
                <span class="text-xs text-muted-foreground">{{ longestLossStreak.team.short }}</span>
              </div>
            </div>
          </div>

          <template v-if="currentStreaks.length > 0">
            <Separator />
            <p class="text-xs text-muted-foreground">Текущие серии</p>
            <div class="space-y-1.5">
              <div
                v-for="s in currentStreaks"
                :key="s.team.id"
                class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/30"
              >
                <Avatar shape="square" class="w-5 h-5 text-[8px] flex-shrink-0" :style="{ backgroundColor: `hsl(${s.team.color})` }">
                  <AvatarFallback class="bg-transparent text-primary-foreground font-bold">{{ s.team.short.slice(0,1) }}</AvatarFallback>
                </Avatar>
                <span class="text-xs font-medium flex-1 truncate">{{ s.team.short }}</span>
                <span
                  class="text-xs font-bold px-2 py-0.5 rounded"
                  :class="s.current!.type === 'win' ? 'bg-sport-win/20 text-sport-win' : 'bg-sport-loss/20 text-sport-loss'"
                >
                  {{ s.current!.count }}{{ s.current!.type === 'win' ? 'В' : 'П' }} серия
                </span>
              </div>
            </div>
          </template>
        </CardContent>
      </Card>

      <!-- 8. Лидеры лиги -->
      <Card>
        <CardHeader class="pb-2">
          <CardTitle class="text-sm font-display text-muted-foreground normal-case tracking-normal">Лидеры лиги</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div
              v-for="leader in leagueLeaders"
              :key="leader.label"
              class="flex items-center gap-2 bg-secondary/30 rounded-lg px-3 py-2"
            >
              <span class="text-[10px] text-muted-foreground flex-1 min-w-0">{{ leader.label }}</span>
              <Avatar shape="square" class="w-5 h-5 text-[8px] flex-shrink-0" :style="{ backgroundColor: `hsl(${leader.team.color})` }">
                <AvatarFallback class="bg-transparent text-primary-foreground font-bold">{{ leader.team.short.slice(0,1) }}</AvatarFallback>
              </Avatar>
              <span class="text-xs font-medium flex-shrink-0">{{ leader.team.short }}</span>
              <span class="font-display text-base font-bold text-foreground flex-shrink-0">{{ leader.value }}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- 9. Рекорды лиги -->
      <Card v-if="leagueRecords.length > 0">
        <CardHeader class="pb-3">
          <CardTitle class="text-sm font-display text-muted-foreground flex items-center gap-2 normal-case tracking-normal">
            <Trophy class="w-4 h-4" aria-hidden="true" /> Рекорды лиги
          </CardTitle>
        </CardHeader>
        <CardContent class="pt-0">
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <div
              v-for="r in leagueRecords"
              :key="r.label"
              class="bg-secondary/40 rounded-lg p-2.5"
            >
              <div class="text-[10px] text-muted-foreground">{{ r.label }}</div>
              <div class="font-display text-xl font-bold text-foreground mt-0.5">{{ r.value }}</div>
              <div class="text-[10px] text-muted-foreground/70 mt-0.5 leading-tight">{{ r.detail }}</div>
            </div>
          </div>
        </CardContent>
      </Card>

    </template>

    <template v-else>
      <div class="text-center py-16 text-muted-foreground text-sm">
        Матчи ещё не сыграны
      </div>
    </template>

  </div>
</template>

<script setup lang="ts">
import { teams, matches, getTeam } from "@/data/league";
import { calcStandings } from "@/lib/standings";
import { getStreaks, getComebackStats, getScoringPatterns } from "@/lib/stats";
import { getLeagueRecords } from "@/lib/records";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Trophy } from "lucide-vue-next";

// ── 1. Базовые агрегаты ─────────────────────────────────────────────────────

const played = matches.filter((m) => m.played);
const playedCount = played.length;

let totalPoints = 0;
let homePts = 0, awayPts = 0;
for (const m of played) {
  for (const s of m.result!.setScores) {
    totalPoints += s.home + s.away;
    homePts += s.home;
    awayPts += s.away;
  }
}
const totalSets = playedCount * 3;
const avgPointsPerSet = totalSets > 0 ? (totalPoints / totalSets).toFixed(1) : "0";
const avgHomePtsPerSet = totalSets > 0 ? (homePts / totalSets).toFixed(1) : "0";
const avgAwayPtsPerSet = totalSets > 0 ? (awayPts / totalSets).toFixed(1) : "0";

// ── 2. Результаты матчей ────────────────────────────────────────────────────

let count30 = 0, count21 = 0;
for (const m of played) {
  const r = m.result!;
  if (Math.min(r.setsHome, r.setsAway) === 0) count30++; else count21++;
}
const pct30 = playedCount > 0 ? Math.round((count30 / playedCount) * 100) : 0;
const pct21 = playedCount > 0 ? 100 - pct30 : 0;

// ── 3. Дома / В гостях ──────────────────────────────────────────────────────

let homeWins = 0, awayWins = 0;
let home30 = 0, home21 = 0, away30 = 0, away21 = 0;
for (const m of played) {
  const r = m.result!;
  const hw = r.setsHome > r.setsAway;
  const sweep = Math.min(r.setsHome, r.setsAway) === 0;
  if (hw) { homeWins++; if (sweep) home30++; else home21++; }
  else { awayWins++; if (sweep) away30++; else away21++; }
}
const homeWinPct = playedCount > 0 ? Math.round((homeWins / playedCount) * 100) : 0;

// ── 4. Характер партий (по матчам, без двойного счёта) ──────────────────────

let leagueCloseSets = 0, leagueDomSets = 0, leagueTotalMargin = 0;
for (const m of played) {
  for (const s of m.result!.setScores) {
    const margin = Math.abs(s.home - s.away);
    leagueTotalMargin += margin;
    if (margin <= 3) leagueCloseSets++;
    if (margin >= 10) leagueDomSets++;
  }
}
const pctClose = totalSets > 0 ? Math.round((leagueCloseSets / totalSets) * 100) : 0;
const pctDom = totalSets > 0 ? Math.round((leagueDomSets / totalSets) * 100) : 0;
const leagueAvgMargin = totalSets > 0 ? (leagueTotalMargin / totalSets).toFixed(1) : "0";

// Лидеры: команда с наибольшим кол-вом напряжённых / разгромных партий
const teamScoringPatterns = teams.map((t) => ({ team: t, ...getScoringPatterns(t.id) }));
const mostCloseTeam = teamScoringPatterns.reduce((a, b) => b.closeSets > a.closeSets ? b : a);
const mostDomTeam = teamScoringPatterns.reduce((a, b) => b.dominantSets > a.dominantSets ? b : a);

// ── 5. Игра по партиям (лига) ───────────────────────────────────────────────

const leagueSetStats = [1, 2, 3].map((setNum) => {
  let homeWinsInSet = 0, totalInSet = 0, totalPtsInSet = 0, totalMarginInSet = 0;
  for (const m of played) {
    const s = m.result!.setScores[setNum - 1];
    totalInSet++;
    totalPtsInSet += s.home + s.away;
    totalMarginInSet += Math.abs(s.home - s.away);
    if (s.home > s.away) homeWinsInSet++;
  }
  return {
    setNum,
    homeWinRate: totalInSet > 0 ? homeWinsInSet / totalInSet : 0,
    avgPoints: totalInSet > 0 ? (totalPtsInSet / totalInSet).toFixed(1) : "0",
    avgMargin: totalInSet > 0 ? (totalMarginInSet / totalInSet).toFixed(1) : "0",
  };
});

// ── 6. Решающие партии ──────────────────────────────────────────────────────

const teamComebacks = teams.map((t) => ({ team: t, ...getComebackStats(t.id) }));
// totalDecisive считается с обеих сторон, делим на 2 для уникальных матчей
const decisiveCount = teamComebacks.reduce((s, c) => s + c.totalDecisive, 0) / 2;
// comebacks / blownLeads уникальны для победителя / проигравшего
const totalComebacks = teamComebacks.reduce((s, c) => s + c.comebacks, 0);
const totalBlownLeads = teamComebacks.reduce((s, c) => s + c.blownLeads, 0);
const decisivePct = playedCount > 0 ? Math.round((decisiveCount / playedCount) * 100) : 0;
const comebackRate = decisiveCount > 0 ? Math.round((totalComebacks / decisiveCount) * 100) : 0;

const mostComebackTeam = teamComebacks.reduce((a, b) => b.comebacks > a.comebacks ? b : a, teamComebacks[0]);
const mostBlownTeam = teamComebacks.reduce((a, b) => b.blownLeads > a.blownLeads ? b : a, teamComebacks[0]);

// ── 7. Серии ────────────────────────────────────────────────────────────────

const teamStreaks = teams.map((t) => ({ team: t, ...getStreaks(t.id) }));
const longestWinStreak = teamStreaks.reduce((a, b) => b.longestWin > a.longestWin ? b : a);
const longestLossStreak = teamStreaks.reduce((a, b) => b.longestLoss > a.longestLoss ? b : a);
const currentStreaks = teamStreaks
  .filter((s) => s.current !== null)
  .sort((a, b) => b.current!.count - a.current!.count);

// ── 8. Лидеры лиги ──────────────────────────────────────────────────────────

const standings = calcStandings();

function standingsLeader(key: "won" | "points" | "homeWon" | "awayWon") {
  return standings.reduce((a, b) => b[key] > a[key] ? b : a);
}

const setDiffLeader = standings.reduce((a, b) =>
  (b.setsWon - b.setsLost) > (a.setsWon - a.setsLost) ? b : a,
);
const ptEffLeader = standings
  .filter((s) => s.pointsWon + s.pointsLost > 0)
  .reduce((a, b) =>
    (b.pointsWon / (b.pointsWon + b.pointsLost)) > (a.pointsWon / (a.pointsWon + a.pointsLost)) ? b : a,
  );
const thirdSetLeader = teamComebacks.reduce((a, b) => b.thirdSetWon > a.thirdSetWon ? b : a);

const leagueLeaders = [
  { label: "Больше всего побед",           team: standingsLeader("won").team,   value: String(standingsLeader("won").won) },
  { label: "Больше всего очков",           team: standingsLeader("points").team, value: String(standingsLeader("points").points) },
  { label: "Лучшая разница партий",        team: setDiffLeader.team,            value: `+${setDiffLeader.setsWon - setDiffLeader.setsLost}` },
  { label: "Лучшая эффективность (очки)",  team: ptEffLeader.team,              value: `${Math.round(ptEffLeader.pointsWon / (ptEffLeader.pointsWon + ptEffLeader.pointsLost) * 100)}%` },
  { label: "Лучшая домашняя серия",        team: standingsLeader("homeWon").team, value: `${standingsLeader("homeWon").homeWon}В` },
  { label: "Лучшая гостевая серия",        team: standingsLeader("awayWon").team, value: `${standingsLeader("awayWon").awayWon}В` },
  { label: "Лучшая серия побед сезона",    team: longestWinStreak.team,         value: `${longestWinStreak.longestWin}В` },
  { label: "Больше побед в 3-й партии",    team: thirdSetLeader.team,           value: String(thirdSetLeader.thirdSetWon) },
];

// ── 9. Рекорды лиги ─────────────────────────────────────────────────────────

const leagueRecords = getLeagueRecords();
</script>
