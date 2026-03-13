<template>
  <div class="animate-fade-in space-y-4">
    <!-- Scoring rules -->
    <Card>
      <CardHeader class="pb-3">
        <CardTitle class="text-sm font-display text-muted-foreground flex items-center gap-2 normal-case tracking-normal">
          <Info class="w-4 h-4" aria-hidden="true" /> Система начисления очков
        </CardTitle>
      </CardHeader>
      <CardContent class="pt-0 space-y-3">
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div class="bg-sport-win/10 border border-sport-win/20 rounded-md px-3 py-2 text-center">
            <div class="text-xs text-muted-foreground">Победа 3-0</div>
            <div class="font-display text-lg font-bold text-sport-win">3 очка</div>
          </div>
          <div class="bg-sport-win/10 border border-sport-win/20 rounded-md px-3 py-2 text-center">
            <div class="text-xs text-muted-foreground">Победа 2-1</div>
            <div class="font-display text-lg font-bold text-sport-win">2 очка</div>
          </div>
          <div class="bg-sport-loss/10 border border-sport-loss/20 rounded-md px-3 py-2 text-center">
            <div class="text-xs text-muted-foreground">Поражение 1-2</div>
            <div class="font-display text-lg font-bold text-sport-loss">1 очко</div>
          </div>
          <div class="bg-sport-loss/10 border border-sport-loss/20 rounded-md px-3 py-2 text-center">
            <div class="text-xs text-muted-foreground">Поражение 0-3</div>
            <div class="font-display text-lg font-bold text-sport-loss">0 очков</div>
          </div>
        </div>
        <p class="text-[11px] text-muted-foreground/70 text-center">
          Всегда 3 партии в матче · Плей-офф: топ-4 команды
        </p>
      </CardContent>
    </Card>

    <!-- Legend -->
    <div class="flex gap-4 text-xs text-muted-foreground" aria-label="Обозначения таблицы">
      <span class="flex items-center gap-1.5">
        <span class="w-3 h-1.5 rounded-sm bg-amber-400" aria-hidden="true" /> Лидер
      </span>
      <span class="flex items-center gap-1.5">
        <span class="w-3 h-1.5 rounded-sm bg-sky-500" aria-hidden="true" /> Плей-офф
      </span>
    </div>

    <!-- Table -->
    <Card class="overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow class="sport-gradient hover:bg-transparent border-0">
            <TableHead scope="col" class="text-primary-foreground font-semibold text-xs tracking-wider w-8 pl-3">#</TableHead>
            <TableHead scope="col" class="text-primary-foreground font-semibold text-xs tracking-wider">Команда</TableHead>
            <!-- mobile only: В/П combined -->
            <TableHead scope="col" class="text-primary-foreground font-semibold text-xs tracking-wider text-center sm:hidden">В/П</TableHead>
            <!-- desktop only -->
            <TableHead scope="col" class="text-primary-foreground font-semibold text-xs tracking-wider text-center hidden sm:table-cell">
              <Tooltip>
                <TooltipTrigger class="cursor-help">И</TooltipTrigger>
                <TooltipContent>Сыграно</TooltipContent>
              </Tooltip>
            </TableHead>
            <TableHead scope="col" class="text-primary-foreground font-semibold text-xs tracking-wider text-center hidden sm:table-cell">
              <Tooltip>
                <TooltipTrigger class="cursor-help">В</TooltipTrigger>
                <TooltipContent>Победы</TooltipContent>
              </Tooltip>
            </TableHead>
            <TableHead scope="col" class="text-primary-foreground font-semibold text-xs tracking-wider text-center hidden sm:table-cell">
              <Tooltip>
                <TooltipTrigger class="cursor-help">П</TooltipTrigger>
                <TooltipContent>Поражения</TooltipContent>
              </Tooltip>
            </TableHead>
            <TableHead scope="col" class="text-primary-foreground font-semibold text-xs tracking-wider text-center hidden sm:table-cell">Партии</TableHead>
            <TableHead scope="col" class="text-primary-foreground font-semibold text-xs tracking-wider text-center hidden sm:table-cell">
              <Tooltip>
                <TooltipTrigger class="cursor-help">+/−</TooltipTrigger>
                <TooltipContent>Разница партий</TooltipContent>
              </Tooltip>
            </TableHead>
            <TableHead scope="col" class="text-primary-foreground font-semibold text-xs tracking-wider hidden sm:table-cell">Форма</TableHead>
            <TableHead scope="col" class="text-primary-foreground font-semibold text-xs tracking-wider text-center font-bold">Очки</TableHead>
            <TableHead scope="col" class="w-8 pr-3"><span class="sr-only">Подробнее</span></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow
            v-for="(s, i) in standings"
            :key="s.team.id"
            @click="selected = selected?.team.id === s.team.id ? null : s"
            @keydown.enter.prevent="selected = selected?.team.id === s.team.id ? null : s"
            @keydown.space.prevent="selected = selected?.team.id === s.team.id ? null : s"
            :tabindex="0"
            :aria-label="`${s.team.name}, место ${i + 1}, очков ${s.points}`"
            :class="[
              'cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent',
              rowHighlight(i + 1),
              selected?.team.id === s.team.id ? 'bg-secondary' : '',
            ]"
          >
            <TableCell
              :class="[
                'font-display font-bold pl-3',
                i + 1 === 1 ? 'text-amber-400' : i + 1 <= 4 ? 'text-sky-500' : 'text-muted-foreground',
              ]"
            >
              {{ i + 1 }}
            </TableCell>
            <TableCell>
              <div class="flex items-center gap-2">
                <Avatar shape="square" size="sm" class="w-5 h-5 text-[10px] font-bold" :style="{ backgroundColor: `hsl(${s.team.color})` }">
                  <AvatarFallback class="bg-transparent text-primary-foreground">
                    {{ s.team.short.slice(0, 1) }}
                  </AvatarFallback>
                </Avatar>
                <span class="font-semibold sm:hidden">{{ s.team.short }}</span>
                <span class="font-semibold hidden sm:inline">{{ s.team.name }}</span>
              </div>
            </TableCell>
            <!-- mobile: combined W/L -->
            <TableCell class="text-center sm:hidden">
              <span class="text-sport-win font-semibold">{{ s.won }}</span>
              <span class="text-muted-foreground/40 mx-0.5 text-xs">/</span>
              <span class="text-sport-loss font-semibold">{{ s.lost }}</span>
            </TableCell>
            <!-- desktop columns -->
            <TableCell class="text-center text-muted-foreground hidden sm:table-cell">{{ s.played }}</TableCell>
            <TableCell class="text-center text-sport-win font-semibold hidden sm:table-cell">{{ s.won }}</TableCell>
            <TableCell class="text-center text-sport-loss font-semibold hidden sm:table-cell">{{ s.lost }}</TableCell>
            <TableCell class="text-center text-muted-foreground hidden sm:table-cell">{{ s.setsWon }}-{{ s.setsLost }}</TableCell>
            <TableCell
              :class="[
                'text-center font-semibold hidden sm:table-cell',
                s.setsWon - s.setsLost > 0 ? 'text-sport-win' : s.setsWon - s.setsLost < 0 ? 'text-sport-loss' : 'text-muted-foreground',
              ]"
            >
              {{ s.setsWon - s.setsLost > 0 ? `+${s.setsWon - s.setsLost}` : s.setsWon - s.setsLost }}
            </TableCell>
            <TableCell class="hidden sm:table-cell py-2.5">
              <div class="flex gap-0.5">
                <span
                  v-for="m in getTeamMatches(s.team.id).filter((m) => m.played).slice(-5)"
                  :key="m.id"
                  aria-hidden="true"
                  :class="[
                    'w-[18px] h-[18px] rounded-sm flex items-center justify-center text-[9px] font-bold text-white',
                    (m.homeId === s.team.id ? m.result!.setsHome > m.result!.setsAway : m.result!.setsAway > m.result!.setsHome)
                      ? 'bg-sport-win' : 'bg-sport-loss',
                  ]"
                >
                  {{ (m.homeId === s.team.id ? m.result!.setsHome > m.result!.setsAway : m.result!.setsAway > m.result!.setsHome) ? "В" : "П" }}
                </span>
              </div>
            </TableCell>
            <TableCell class="text-center">
              <span class="font-display text-lg font-bold text-accent">{{ s.points }}</span>
            </TableCell>
            <TableCell class="pr-3">
              <ChevronRight class="w-4 h-4 text-muted-foreground" aria-hidden="true" />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Card>

    <!-- Season progress -->
    <Card>
      <CardContent class="pt-4 space-y-1.5">
        <div class="flex flex-wrap items-center justify-between gap-1 text-xs text-muted-foreground">
          <span>Прогресс сезона</span>
          <span>{{ playedCount }} из {{ matches.length }} матчей · тур {{ playedGameweeks }} из {{ totalGameweeks }}</span>
        </div>
        <Progress :model-value="progressPercent" class="h-1.5 [&>div]:bg-accent" />
      </CardContent>
    </Card>

    <TeamStatsPanel v-if="selected" :standing="selected" @close="selected = null" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Info, ChevronRight } from "lucide-vue-next";
import { calcStandings, getTeamMatches, type TeamStanding } from "@/lib/standings";
import { matches, totalGameweeks } from "@/data/league";
import TeamStatsPanel from "@/components/TeamStatsPanel.vue";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const standings = calcStandings();
const selected = ref<TeamStanding | null>(null);

const playedCount = matches.filter((m) => m.played).length;
const playedGameweeks = new Set(matches.filter((m) => m.played).map((m) => m.gameweek)).size;
const progressPercent = Math.round((playedCount / matches.length) * 100);

function rowHighlight(pos: number) {
  if (pos === 1) return "border-l-[3px] border-l-amber-400 bg-amber-400/5";
  if (pos <= 4) return "border-l-[3px] border-l-sky-500 bg-sky-500/5";
  return "";
}
</script>
