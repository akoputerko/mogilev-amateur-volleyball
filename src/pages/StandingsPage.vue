<template>
  <div class="animate-fade-in space-y-4">
    <!-- Scoring rules -->
    <Card>
      <CardContent class="pt-4">
        <h4 class="font-display text-sm text-muted-foreground mb-3 flex items-center gap-2">
          <Info class="w-4 h-4" aria-hidden="true" /> Система начисления очков
        </h4>
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
        <p class="text-[11px] text-muted-foreground/70 mt-2.5 text-center">
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
      <div class="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow class="sport-gradient hover:bg-transparent border-0">
              <TableHead scope="col" class="text-primary-foreground font-semibold text-xs tracking-wider w-8">#</TableHead>
              <TableHead scope="col" class="text-primary-foreground font-semibold text-xs tracking-wider">Команда</TableHead>
              <TableHead scope="col" class="text-primary-foreground font-semibold text-xs tracking-wider text-center" title="Сыграно">И</TableHead>
              <TableHead scope="col" class="text-primary-foreground font-semibold text-xs tracking-wider text-center" title="Победы">В</TableHead>
              <TableHead scope="col" class="text-primary-foreground font-semibold text-xs tracking-wider text-center" title="Поражения">П</TableHead>
              <TableHead scope="col" class="text-primary-foreground font-semibold text-xs tracking-wider text-center">Партии</TableHead>
              <TableHead scope="col" class="text-primary-foreground font-semibold text-xs tracking-wider text-center" title="Разница партий">+/−</TableHead>
              <TableHead scope="col" class="text-primary-foreground font-semibold text-xs tracking-wider hidden sm:table-cell">Форма</TableHead>
              <TableHead scope="col" class="text-primary-foreground font-semibold text-xs tracking-wider text-center font-bold">Очки</TableHead>
              <TableHead scope="col" class="w-8"><span class="sr-only">Подробнее</span></TableHead>
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
                'cursor-pointer',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent',
                rowHighlight(i + 1),
                selected?.team.id === s.team.id ? 'bg-secondary' : '',
              ]"
              :style="{ animationDelay: `${i * 40}ms` }"
            >
              <TableCell
                :class="[
                  'font-display font-bold',
                  i + 1 === 1 ? 'text-amber-400' : i + 1 <= 4 ? 'text-sky-500' : 'text-muted-foreground',
                ]"
              >
                {{ i + 1 }}
              </TableCell>
              <TableCell>
                <div class="flex items-center gap-2">
                  <span
                    class="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    :style="{ backgroundColor: `hsl(${s.team.color})` }"
                    aria-hidden="true"
                  />
                  <span class="font-semibold">{{ s.team.name }}</span>
                </div>
              </TableCell>
              <TableCell class="text-center text-muted-foreground">{{ s.played }}</TableCell>
              <TableCell class="text-center text-sport-win font-semibold">{{ s.won }}</TableCell>
              <TableCell class="text-center text-sport-loss font-semibold">{{ s.lost }}</TableCell>
              <TableCell class="text-center text-muted-foreground">{{ s.setsWon }}-{{ s.setsLost }}</TableCell>
              <TableCell
                :class="[
                  'text-center font-semibold',
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
                        ? 'bg-sport-win'
                        : 'bg-sport-loss',
                    ]"
                  >
                    {{ (m.homeId === s.team.id ? m.result!.setsHome > m.result!.setsAway : m.result!.setsAway > m.result!.setsHome) ? "В" : "П" }}
                  </span>
                </div>
              </TableCell>
              <TableCell class="text-center">
                <span class="font-display text-lg font-bold text-accent">{{ s.points }}</span>
              </TableCell>
              <TableCell>
                <ChevronRight class="w-4 h-4 text-muted-foreground" aria-hidden="true" />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </Card>

    <!-- Season progress -->
    <Card>
      <CardContent class="pt-4 space-y-1.5">
        <div class="flex flex-wrap items-center justify-between gap-1 text-xs text-muted-foreground">
          <span>Прогресс сезона</span>
          <span>
            {{ playedCount }} из {{ matches.length }} матчей · тур {{ playedGameweeks }} из {{ totalGameweeks }}
          </span>
        </div>
        <Progress :model-value="progressPercent" class="h-1.5 [&>div]:bg-accent" />
      </CardContent>
    </Card>

    <!-- Team stats panel -->
    <TeamStatsPanel v-if="selected" :standing="selected" @close="selected = null" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Info, ChevronRight } from "lucide-vue-next";
import { calcStandings, getTeamMatches, type TeamStanding } from "@/lib/standings";
import { matches, totalGameweeks } from "@/data/league";
import TeamStatsPanel from "@/components/TeamStatsPanel.vue";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";

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
