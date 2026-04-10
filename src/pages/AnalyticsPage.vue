<template>
  <div class="animate-fade-in space-y-6">

    <!-- Tab bar -->
    <div class="flex items-center gap-1 border-b border-border">
      <button
        v-for="tab in [
          { id: 'summary', label: 'Сводка' },
          { id: 'stats', label: 'Статистика' },
          { id: 'teams', label: 'Команды' },
        ]"
        :key="tab.id"
        @click="activeTab = tab.id as typeof activeTab.value"
        class="px-4 py-2 text-sm font-medium transition-colors relative -mb-px"
        :class="activeTab === tab.id
          ? 'text-foreground border-b-2 border-primary'
          : 'text-muted-foreground hover:text-foreground'"
      >{{ tab.label }}</button>
      <div class="ml-auto">
        <Button variant="ghost" size="sm" @click="showExportModal = true" class="gap-1.5">
          <Share2 class="w-4 h-4" aria-hidden="true" />
          <span class="hidden sm:inline">Экспорт</span>
        </Button>
      </div>
    </div>

    <!-- ══════════ СВОДКА ══════════ -->
    <template v-if="activeTab === 'summary'">

      <!-- 1. Обзор лиги -->
      <div ref="sectionSummary1" class="grid grid-cols-2 sm:grid-cols-4 gap-3">
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
        <Card ref="sectionSummary2">
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
        <Card ref="sectionSummary3">
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

        <!-- 4. Лидеры лиги -->
        <Card ref="sectionSummary4">
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
                <div class="flex flex-col gap-0.5 items-end">
                  <div v-for="t in leader.teams" :key="t.id" class="flex items-center gap-1.5">
                    <Avatar shape="square" class="w-5 h-5 text-[8px] flex-shrink-0" :style="{ backgroundColor: `hsl(${t.color})` }">
                      <AvatarFallback class="bg-transparent text-primary-foreground font-bold">{{ t.short.slice(0,1) }}</AvatarFallback>
                    </Avatar>
                    <span class="text-xs font-medium">{{ t.short }}</span>
                  </div>
                </div>
                <span class="font-display text-base font-bold text-foreground flex-shrink-0">{{ leader.value }}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- 5. Рекорды лиги -->
        <Card v-if="leagueRecords.length > 0" ref="sectionSummary5">
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

        <!-- 6. Матрица результатов -->
        <Card ref="sectionSummary6">
          <CardHeader class="pb-2">
            <CardTitle class="text-sm font-display text-muted-foreground normal-case tracking-normal">Матрица результатов</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="overflow-x-auto">
              <table class="w-full text-xs border-collapse">
                <thead>
                  <tr>
                    <th class="p-1 text-muted-foreground text-left font-normal text-[10px] min-w-[40px]">↓ Хоз / Гость →</th>
                    <th
                      v-for="t in teams"
                      :key="t.id"
                      class="p-1 text-center font-semibold text-[10px] min-w-[40px]"
                      :style="{ color: `hsl(${t.color})` }"
                    >{{ t.short }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(row, ri) in resultMatrix" :key="ri">
                    <td
                      class="p-1 font-semibold text-[10px]"
                      :style="{ color: `hsl(${teams[ri].color})` }"
                    >{{ teams[ri].short }}</td>
                    <td v-for="(cell, ci) in row" :key="ci" class="p-1 text-center">
                      <span v-if="cell === 'self'" class="text-muted-foreground/30 text-[11px]">—</span>
                      <span v-else-if="cell === null" class="text-muted-foreground/20 text-[11px]">·</span>
                      <span
                        v-else
                        class="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold font-mono"
                        :class="cell.homeWon ? 'bg-sport-win/20 text-sport-win' : 'bg-sport-loss/20 text-sport-loss'"
                      >{{ cell.score }}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p class="text-[10px] text-muted-foreground mt-2">Строка = хозяева, столбец = гости. Зелёный = победа хозяев.</p>
          </CardContent>
        </Card>

      </template>
      <template v-else>
        <div class="text-center py-16 text-muted-foreground text-sm">Матчи ещё не сыграны</div>
      </template>

    </template>

    <!-- ══════════ СТАТИСТИКА ══════════ -->
    <template v-else-if="activeTab === 'stats'">
      <template v-if="playedCount > 0">

        <!-- 1. Характер партий -->
        <Card ref="sectionStats1">
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
                <div class="flex flex-col gap-0.5 items-end">
                  <div v-for="t in mostCloseTeams" :key="t.team.id" class="flex items-center gap-1.5">
                    <Avatar shape="square" class="w-5 h-5 text-[8px] flex-shrink-0" :style="{ backgroundColor: `hsl(${t.team.color})` }">
                      <AvatarFallback class="bg-transparent text-primary-foreground font-bold">{{ t.team.short.slice(0,1) }}</AvatarFallback>
                    </Avatar>
                    <span class="text-xs font-medium">{{ t.team.short }}</span>
                  </div>
                </div>
                <span class="font-display text-sm font-bold text-foreground">{{ mostCloseTeams[0].closeSets }}</span>
              </div>
              <div class="flex items-center gap-2 bg-secondary/30 rounded-lg px-3 py-2">
                <div class="text-[10px] text-muted-foreground flex-1">Больше всего разгромных</div>
                <div class="flex flex-col gap-0.5 items-end">
                  <div v-for="t in mostDomTeams" :key="t.team.id" class="flex items-center gap-1.5">
                    <Avatar shape="square" class="w-5 h-5 text-[8px] flex-shrink-0" :style="{ backgroundColor: `hsl(${t.team.color})` }">
                      <AvatarFallback class="bg-transparent text-primary-foreground font-bold">{{ t.team.short.slice(0,1) }}</AvatarFallback>
                    </Avatar>
                    <span class="text-xs font-medium">{{ t.team.short }}</span>
                  </div>
                </div>
                <span class="font-display text-sm font-bold text-foreground">{{ mostDomTeams[0].dominantSets }}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- 2. Игра по партиям (лига) -->
        <Card ref="sectionStats2">
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
                <div :class="['font-display text-2xl font-bold', s.homeWinRate >= 0.5 ? 'text-sport-win' : 'text-sport-loss']">
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

        <!-- 3. Решающие партии -->
        <Card ref="sectionStats3">
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
                <div v-if="mostComebackTeams.length" class="flex items-center gap-2 bg-sport-win/10 rounded-lg px-3 py-2">
                  <div class="text-[10px] text-muted-foreground flex-1">Лидер по камбэкам</div>
                  <div class="flex flex-col gap-0.5 items-end">
                    <div v-for="t in mostComebackTeams" :key="t.team.id" class="flex items-center gap-1.5">
                      <Avatar shape="square" class="w-5 h-5 text-[8px] flex-shrink-0" :style="{ backgroundColor: `hsl(${t.team.color})` }">
                        <AvatarFallback class="bg-transparent text-primary-foreground font-bold">{{ t.team.short.slice(0,1) }}</AvatarFallback>
                      </Avatar>
                      <span class="text-xs font-medium">{{ t.team.short }}</span>
                    </div>
                  </div>
                  <span class="font-display text-sm font-bold text-sport-win">{{ mostComebackTeams[0].comebacks }}</span>
                </div>
                <div v-if="mostBlownTeams.length" class="flex items-center gap-2 bg-sport-loss/10 rounded-lg px-3 py-2">
                  <div class="text-[10px] text-muted-foreground flex-1">Больше всех упущено</div>
                  <div class="flex flex-col gap-0.5 items-end">
                    <div v-for="t in mostBlownTeams" :key="t.team.id" class="flex items-center gap-1.5">
                      <Avatar shape="square" class="w-5 h-5 text-[8px] flex-shrink-0" :style="{ backgroundColor: `hsl(${t.team.color})` }">
                        <AvatarFallback class="bg-transparent text-primary-foreground font-bold">{{ t.team.short.slice(0,1) }}</AvatarFallback>
                      </Avatar>
                      <span class="text-xs font-medium">{{ t.team.short }}</span>
                    </div>
                  </div>
                  <span class="font-display text-sm font-bold text-sport-loss">{{ mostBlownTeams[0].blownLeads }}</span>
                </div>
              </div>
            </template>
          </CardContent>
        </Card>

        <!-- 4. Серии сезона -->
        <Card ref="sectionStats4">
          <CardHeader class="pb-2">
            <CardTitle class="text-sm font-display text-muted-foreground normal-case tracking-normal">Серии сезона</CardTitle>
          </CardHeader>
          <CardContent class="space-y-3">
            <div class="grid grid-cols-2 gap-3">
              <div class="bg-sport-win/10 rounded-lg p-3 text-center">
                <div class="text-[10px] text-sport-win font-semibold mb-1">Лучшая серия побед</div>
                <div class="font-display text-2xl font-bold text-sport-win">{{ longestWinStreaks[0].longestWin }}В</div>
                <div v-for="s in longestWinStreaks" :key="s.team.id" class="flex items-center gap-1.5 justify-center mt-1.5">
                  <Avatar shape="square" class="w-4 h-4 text-[7px]" :style="{ backgroundColor: `hsl(${s.team.color})` }">
                    <AvatarFallback class="bg-transparent text-primary-foreground font-bold">{{ s.team.short.slice(0,1) }}</AvatarFallback>
                  </Avatar>
                  <span class="text-xs text-muted-foreground">{{ s.team.short }}</span>
                </div>
              </div>
              <div class="bg-sport-loss/10 rounded-lg p-3 text-center">
                <div class="text-[10px] text-sport-loss font-semibold mb-1">Худшая серия поражений</div>
                <div class="font-display text-2xl font-bold text-sport-loss">{{ longestLossStreaks[0].longestLoss }}П</div>
                <div v-for="s in longestLossStreaks" :key="s.team.id" class="flex items-center gap-1.5 justify-center mt-1.5">
                  <Avatar shape="square" class="w-4 h-4 text-[7px]" :style="{ backgroundColor: `hsl(${s.team.color})` }">
                    <AvatarFallback class="bg-transparent text-primary-foreground font-bold">{{ s.team.short.slice(0,1) }}</AvatarFallback>
                  </Avatar>
                  <span class="text-xs text-muted-foreground">{{ s.team.short }}</span>
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
                  >{{ s.current!.count }}{{ s.current!.type === 'win' ? 'В' : 'П' }} серия</span>
                </div>
              </div>
            </template>
          </CardContent>
        </Card>

        <!-- 5. Распределение счётов партий -->
        <Card v-if="scoreDistribution.length > 0" ref="sectionStats5">
          <CardHeader class="pb-2">
            <CardTitle class="text-sm font-display text-muted-foreground normal-case tracking-normal">Распределение счётов партий</CardTitle>
          </CardHeader>
          <CardContent>
            <VChart :option="scoreDistChartOption" style="height: 260px" autoresize />
            <p class="text-[10px] text-muted-foreground mt-2">Счёт указан как хозяева:гости. Зелёный — победа хозяев в партии, красный — победа гостей.</p>
          </CardContent>
        </Card>

      </template>
      <template v-else>
        <div class="text-center py-16 text-muted-foreground text-sm">Матчи ещё не сыграны</div>
      </template>
    </template>

    <!-- ══════════ КОМАНДЫ ══════════ -->
    <template v-else>
      <template v-if="playedCount > 0">
        <!-- 1. Форма команд -->
        <Card ref="sectionTeams1">
          <CardHeader class="pb-2">
            <CardTitle class="text-sm font-display text-muted-foreground normal-case tracking-normal">Форма команд</CardTitle>
          </CardHeader>
          <CardContent class="space-y-2">
            <div
              v-for="tf in teamForms"
              :key="tf.team.id"
              class="flex items-center gap-3 px-2 py-1.5 rounded-lg bg-secondary/20"
            >
              <Avatar shape="square" class="w-6 h-6 text-[9px] flex-shrink-0" :style="{ backgroundColor: `hsl(${tf.team.color})` }">
                <AvatarFallback class="bg-transparent text-primary-foreground font-bold">{{ tf.team.short.slice(0, 2) }}</AvatarFallback>
              </Avatar>
              <span class="text-xs font-medium w-10 flex-shrink-0">{{ tf.team.short }}</span>
              <div class="flex gap-1">
                <span
                  v-for="(f, i) in tf.form"
                  :key="i"
                  class="inline-flex items-center justify-center w-6 h-6 rounded text-[10px] font-bold"
                  :class="f.won ? 'bg-sport-win/20 text-sport-win' : 'bg-sport-loss/20 text-sport-loss'"
                >{{ f.won ? 'В' : 'П' }}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- 2. Эффективность по партиям -->
        <Card ref="sectionTeams2">
          <CardHeader class="pb-2">
            <CardTitle class="text-sm font-display text-muted-foreground normal-case tracking-normal">Эффективность по партиям</CardTitle>
          </CardHeader>
          <CardContent>
            <table class="w-full text-xs">
              <thead>
                <tr>
                  <th class="text-left py-1 pr-2 text-[10px] text-muted-foreground font-normal">Команда</th>
                  <th class="text-center py-1 px-2 text-[10px] text-muted-foreground font-normal">П1</th>
                  <th class="text-center py-1 px-2 text-[10px] text-muted-foreground font-normal">П2</th>
                  <th class="text-center py-1 px-2 text-[10px] text-muted-foreground font-normal">П3</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="te in teamSetEfficiency"
                  :key="te.team.id"
                  class="border-t border-border/30"
                >
                  <td class="py-1.5 pr-2 font-medium text-[11px]" :style="{ color: `hsl(${te.team.color})` }">
                    {{ te.team.short }}
                  </td>
                  <td
                    v-for="s in te.sets"
                    :key="s.setNum"
                    class="py-1.5 px-2 text-center font-bold text-[11px]"
                    :class="s.won + s.lost === 0 ? 'text-muted-foreground' : s.won >= s.lost ? 'text-sport-win' : 'text-sport-loss'"
                  >
                    {{ s.won + s.lost > 0 ? Math.round((s.won / (s.won + s.lost)) * 100) : 0 }}%
                  </td>
                </tr>
              </tbody>
            </table>
          </CardContent>
        </Card>

        <!-- 3. Динамика позиций -->
        <Card ref="sectionTeams3">
          <CardHeader class="pb-2">
            <CardTitle class="text-sm font-display text-muted-foreground normal-case tracking-normal">Динамика позиций</CardTitle>
          </CardHeader>
          <CardContent>
            <VChart :option="posHistoryChartOption" style="height: 300px" autoresize />
          </CardContent>
        </Card>

        <!-- 4. Средний счёт в партиях -->
        <Card ref="sectionTeams4">
          <CardHeader class="pb-2">
            <CardTitle class="text-sm font-display text-muted-foreground normal-case tracking-normal">Средний счёт в партиях</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div
                v-for="ts in teamAvgSetScores"
                :key="ts.team.id"
                class="bg-secondary/30 rounded-lg px-3 py-2.5 space-y-1"
              >
                <div class="flex items-center gap-1.5 mb-1.5">
                  <Avatar shape="square" class="w-5 h-5 text-[8px] flex-shrink-0" :style="{ backgroundColor: `hsl(${ts.team.color})` }">
                    <AvatarFallback class="bg-transparent text-primary-foreground font-bold">{{ ts.team.short.slice(0, 2) }}</AvatarFallback>
                  </Avatar>
                  <span class="text-xs font-semibold">{{ ts.team.short }}</span>
                </div>
                <div class="text-[11px] text-muted-foreground">
                  В выигранных:
                  <span class="font-bold text-sport-win">{{ ts.avg.avgScoredWon.toFixed(1) }}</span>
                  :
                  <span class="text-foreground">{{ ts.avg.avgConcededWon.toFixed(1) }}</span>
                </div>
                <div class="text-[11px] text-muted-foreground">
                  В проигранных:
                  <span class="text-foreground">{{ ts.avg.avgScoredLost.toFixed(1) }}</span>
                  :
                  <span class="font-bold text-sport-loss">{{ ts.avg.avgConcededLost.toFixed(1) }}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </template>
      <template v-else>
        <div class="text-center py-16 text-muted-foreground text-sm">Матчи ещё не сыграны</div>
      </template>
    </template>

    <!-- Export modal -->
    <ExportModal
      v-model:open="showExportModal"
      :tab-id="activeTab"
      :tab-label="activeTab === 'summary' ? 'Сводка' : activeTab === 'stats' ? 'Статистика' : 'Команды'"
      :summary-data="summaryExportData"
      :stats-data="statsExportData"
      :teams-data="teamsExportData"
      :section-refs="getExportSectionRefs()"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, type ComponentPublicInstance } from "vue";
import { teams, matches } from "@/data/league";
import { calcStandings } from "@/lib/standings";
import { getStreaks, getComebackStats, getScoringPatterns, getForm, getSetPerformance, getPositionHistory, getAvgSetScore } from "@/lib/stats";
import { getLeagueRecords } from "@/lib/records";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Trophy, Share2 } from "lucide-vue-next";
import { use } from "echarts/core";
import { BarChart, LineChart } from "echarts/charts";
import { GridComponent, LegendComponent, TooltipComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import VChart from "vue-echarts";
import { Button } from "@/components/ui/button";
import ExportModal from "@/components/ExportModal.vue";
import { type SummaryExportData, type StatsExportData, type TeamsExportData, type MatrixCell } from "@/lib/export-text";

use([BarChart, LineChart, GridComponent, LegendComponent, TooltipComponent, CanvasRenderer]);

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
const mostCloseTeams = findLeaders(teamScoringPatterns, (t) => t.closeSets);
const mostDomTeams = findLeaders(teamScoringPatterns, (t) => t.dominantSets);

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

const mostComebackTeams = findLeaders(teamComebacks.filter((t) => t.comebacks > 0), (t) => t.comebacks);
const mostBlownTeams = findLeaders(teamComebacks.filter((t) => t.blownLeads > 0), (t) => t.blownLeads);

// ── 7. Серии ────────────────────────────────────────────────────────────────

const teamStreaks = teams.map((t) => ({ team: t, ...getStreaks(t.id) }));
const longestWinStreaks = findLeaders(teamStreaks, (s) => s.longestWin);
const longestLossStreaks = findLeaders(teamStreaks, (s) => s.longestLoss);
const currentStreaks = teamStreaks
  .filter((s) => s.current !== null)
  .sort((a, b) => b.current!.count - a.current!.count);

// ── 8. Лидеры лиги ──────────────────────────────────────────────────────────

const standings = calcStandings();

function findLeaders<T>(items: T[], getValue: (item: T) => number): T[] {
  const max = Math.max(...items.map(getValue));
  return items.filter((item) => getValue(item) === max);
}

function standingsLeaders(key: "won" | "points" | "homeWon" | "awayWon") {
  const max = Math.max(...standings.map((s) => s[key]));
  return standings.filter((s) => s[key] === max);
}

const setDiffLeaders = (() => {
  const max = Math.max(...standings.map((s) => s.setsWon - s.setsLost));
  return standings.filter((s) => s.setsWon - s.setsLost === max);
})();

const ptEffLeaders = (() => {
  const eligible = standings.filter((s) => s.pointsWon + s.pointsLost > 0);
  const getEff = (s: typeof standings[0]) => Math.round(s.pointsWon / (s.pointsWon + s.pointsLost) * 100);
  const max = Math.max(...eligible.map(getEff));
  return eligible.filter((s) => getEff(s) === max);
})();

const thirdSetLeaders = findLeaders(teamComebacks, (t) => t.thirdSetWon);

const winsLeaders = standingsLeaders("won");
const pointsLeaders = standingsLeaders("points");
const homeWonLeaders = standingsLeaders("homeWon");
const awayWonLeaders = standingsLeaders("awayWon");

const leagueLeaders = [
  { label: "Больше всего побед",           teams: winsLeaders.map((s) => s.team),     value: String(winsLeaders[0].won) },
  { label: "Больше всего очков",           teams: pointsLeaders.map((s) => s.team),   value: String(pointsLeaders[0].points) },
  { label: "Лучшая разница партий",        teams: setDiffLeaders.map((s) => s.team),  value: `+${setDiffLeaders[0].setsWon - setDiffLeaders[0].setsLost}` },
  { label: "Лучшая эффективность (очки)",  teams: ptEffLeaders.map((s) => s.team),    value: `${Math.round(ptEffLeaders[0].pointsWon / (ptEffLeaders[0].pointsWon + ptEffLeaders[0].pointsLost) * 100)}%` },
  { label: "Лучшая домашняя серия",        teams: homeWonLeaders.map((s) => s.team),  value: `${homeWonLeaders[0].homeWon}В` },
  { label: "Лучшая гостевая серия",        teams: awayWonLeaders.map((s) => s.team),  value: `${awayWonLeaders[0].awayWon}В` },
  { label: "Лучшая серия побед сезона",    teams: longestWinStreaks.map((s) => s.team), value: `${longestWinStreaks[0].longestWin}В` },
  { label: "Больше побед в 3-й партии",    teams: thirdSetLeaders.map((t) => t.team), value: String(thirdSetLeaders[0].thirdSetWon) },
];

// ── 9. Рекорды лиги ─────────────────────────────────────────────────────────

const leagueRecords = getLeagueRecords();

// ── Матрица результатов ──────────────────────────────────────────────────────

const resultMatrix: MatrixCell[][] = teams.map((homeTeam) =>
  teams.map((awayTeam): MatrixCell => {
    if (homeTeam.id === awayTeam.id) return "self";
    const m = played.find(
      (match) => match.homeId === homeTeam.id && match.awayId === awayTeam.id,
    );
    if (!m) return null;
    const r = m.result!;
    return { homeWon: r.setsHome > r.setsAway, score: `${r.setsHome}:${r.setsAway}` };
  }),
);

// ── Распределение счётов ─────────────────────────────────────────────────────
const scoreDistribution = (() => {
  const counts: Record<string, number> = {};
  for (const m of played) {
    for (const s of m.result!.setScores) {
      const key = `${s.home}:${s.away}`;
      counts[key] = (counts[key] || 0) + 1;
    }
  }
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
})();

const scoreDistChartOption = {
  backgroundColor: "transparent",
  grid: { left: 10, right: 16, top: 8, bottom: 8, containLabel: true },
  xAxis: {
    type: "value",
    axisLabel: { color: "#888", fontSize: 10 },
    splitLine: { lineStyle: { color: "#2a2a3a" } },
  },
  yAxis: {
    type: "category",
    data: scoreDistribution.map(([score]) => score).reverse(),
    axisLabel: { color: "#aaa", fontSize: 10, fontFamily: "monospace" },
    axisLine: { lineStyle: { color: "#333" } },
  },
  series: [
    {
      type: "bar",
      data: scoreDistribution
        .map(([score, count]) => ({
          value: count,
          itemStyle: {
            color:
              Number(score.split(":")[0]) > Number(score.split(":")[1])
                ? "hsl(142, 70%, 50%)"
                : "hsl(0, 70%, 62%)",
          },
        }))
        .reverse(),
    },
  ],
  tooltip: { trigger: "axis" },
};

// ── Форма команд ─────────────────────────────────────────────────────────────
const teamForms = standings.map((s) => ({
  team: s.team,
  form: getForm(s.team.id, 5),
}));

// ── Эффективность по партиям ─────────────────────────────────────────────────
const teamSetEfficiency = standings.map((s) => ({
  team: s.team,
  sets: getSetPerformance(s.team.id),
}));

// ── Динамика позиций ─────────────────────────────────────────────────────────
const posHistoryChartOption = (() => {
  const playedGws = [...new Set(played.map((m) => m.gameweek))].sort((a, b) => a - b);
  return {
    backgroundColor: "transparent",
    legend: {
      data: teams.map((t) => t.short),
      textStyle: { color: "#888", fontSize: 10 },
      top: 0,
    },
    grid: { left: 20, right: 10, top: 36, bottom: 20, containLabel: true },
    xAxis: {
      type: "category",
      data: playedGws.map((g) => `Т${g}`),
      axisLabel: { color: "#666", fontSize: 10 },
      axisLine: { lineStyle: { color: "#333" } },
    },
    yAxis: {
      inverse: true,
      min: 1,
      max: 8,
      interval: 1,
      axisLabel: { color: "#666", fontSize: 9 },
      splitLine: { lineStyle: { color: "#2a2a3a" } },
    },
    series: teams.map((t) => {
      const history = getPositionHistory(t.id);
      return {
        name: t.short,
        type: "line",
        data: history.map((p) => p.position),
        smooth: true,
        lineStyle: { color: `hsl(${t.color})`, width: 2 },
        itemStyle: { color: `hsl(${t.color})` },
        symbolSize: 5,
        emphasis: { focus: "series" },
      };
    }),
    tooltip: { trigger: "axis" },
  };
})();

// ── Средний счёт в партиях ───────────────────────────────────────────────────
const teamAvgSetScores = standings.map((s) => ({
  team: s.team,
  avg: getAvgSetScore(s.team.id),
}));

const activeTab = ref<"summary" | "stats" | "teams">("summary");

// ── Export ────────────────────────────────────────────────────────────────

const showExportModal = ref(false);

// Section refs — sectionSummary1 is a native HTMLElement; all Card sections are ComponentPublicInstance
const sectionSummary1 = ref<HTMLElement | null>(null);
const sectionSummary2 = ref<ComponentPublicInstance | null>(null);
const sectionSummary3 = ref<ComponentPublicInstance | null>(null);
const sectionSummary4 = ref<ComponentPublicInstance | null>(null);
const sectionSummary5 = ref<ComponentPublicInstance | null>(null);
const sectionSummary6 = ref<ComponentPublicInstance | null>(null);
const sectionStats1   = ref<ComponentPublicInstance | null>(null);
const sectionStats2   = ref<ComponentPublicInstance | null>(null);
const sectionStats3   = ref<ComponentPublicInstance | null>(null);
const sectionStats4   = ref<ComponentPublicInstance | null>(null);
const sectionStats5   = ref<ComponentPublicInstance | null>(null);
const sectionTeams1   = ref<ComponentPublicInstance | null>(null);
const sectionTeams2   = ref<ComponentPublicInstance | null>(null);
const sectionTeams3   = ref<ComponentPublicInstance | null>(null);
const sectionTeams4   = ref<ComponentPublicInstance | null>(null);

function getEl(r: ComponentPublicInstance | HTMLElement | null): HTMLElement | null {
  if (!r) return null;
  if (r instanceof HTMLElement) return r;
  return (r as ComponentPublicInstance).$el as HTMLElement ?? null;
}

function getExportSectionRefs(): Record<string, HTMLElement | null> {
  return {
    sectionSummary1: getEl(sectionSummary1.value),
    sectionSummary2: getEl(sectionSummary2.value),
    sectionSummary3: getEl(sectionSummary3.value),
    sectionSummary4: getEl(sectionSummary4.value),
    sectionSummary5: getEl(sectionSummary5.value),
    sectionSummary6: getEl(sectionSummary6.value),
    sectionStats1:   getEl(sectionStats1.value),
    sectionStats2:   getEl(sectionStats2.value),
    sectionStats3:   getEl(sectionStats3.value),
    sectionStats4:   getEl(sectionStats4.value),
    sectionStats5:   getEl(sectionStats5.value),
    sectionTeams1:   getEl(sectionTeams1.value),
    sectionTeams2:   getEl(sectionTeams2.value),
    sectionTeams3:   getEl(sectionTeams3.value),
    sectionTeams4:   getEl(sectionTeams4.value),
  };
}

// Export data objects — all values are static const, not reactive
const summaryExportData: SummaryExportData = {
  playedCount,
  totalMatches: matches.length,
  totalSets,
  totalPoints,
  avgPointsPerSet,
  count30,
  count21,
  pct30,
  pct21,
  homeWins,
  awayWins,
  homeWinPct,
  home30,
  home21,
  away21,
  away30,
  avgHomePtsPerSet,
  avgAwayPtsPerSet,
  leagueLeaders,
  leagueRecords,
  resultMatrix,
  teams,
};

const statsExportData: StatsExportData = {
  leagueCloseSets,
  leagueDomSets,
  leagueAvgMargin,
  pctClose,
  pctDom,
  mostCloseTeams,
  mostDomTeams,
  leagueSetStats,
  decisiveCount,
  decisivePct,
  totalComebacks,
  totalBlownLeads,
  comebackRate,
  mostComebackTeams,
  mostBlownTeams,
  longestWinStreaks,
  longestLossStreaks,
  currentStreaks: currentStreaks as StatsExportData["currentStreaks"],
  scoreDistribution,
};

const teamsExportData: TeamsExportData = {
  teamForms,
  teamSetEfficiency,
  teamPositionHistory: teams.map((t) => ({ team: t, history: getPositionHistory(t.id) })),
  teamAvgSetScores,
};
</script>
