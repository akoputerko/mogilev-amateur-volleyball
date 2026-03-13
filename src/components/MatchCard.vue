<template>
  <div
    :class="[
      'group bg-card rounded-xl border border-border overflow-hidden animate-fade-in',
      'hover:border-accent/30 transition-all hover:shadow-lg hover:shadow-accent/5 flex flex-col',
      perspectiveBorder,
    ]"
  >
    <!-- Teams & Score -->
    <div class="p-4 flex flex-col items-center gap-3 flex-1 justify-center">
      <!-- Home team -->
      <div
        :class="[
          'flex items-center gap-2.5',
          linkTeams ? 'cursor-pointer rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent' : '',
        ]"
        @click="linkTeams ? handleTeamClick(match.homeId, $event) : undefined"
        @keydown.enter.prevent="linkTeams ? router.push(`/teams/${match.homeId}`) : undefined"
        @keydown.space.prevent="linkTeams ? router.push(`/teams/${match.homeId}`) : undefined"
        :role="linkTeams ? 'button' : undefined"
        :tabindex="linkTeams ? 0 : undefined"
        :aria-label="linkTeams ? `Страница команды ${home.name}` : undefined"
      >
        <span
          class="w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold text-primary-foreground"
          :style="{ backgroundColor: `hsl(${home.color})` }"
        >
          {{ home.name.slice(0, 2).toUpperCase() }}
        </span>
        <span :class="['font-semibold text-sm', linkTeams ? 'hover:text-accent hover:underline transition-colors' : '']">
          {{ home.name }}
        </span>
      </div>

      <!-- Score or VS -->
      <template v-if="match.played && match.result">
        <div class="flex flex-col items-center gap-1.5">
          <div class="flex items-center gap-2">
            <span
              :class="[
                'font-display text-3xl font-bold',
                match.result.setsHome > match.result.setsAway ? 'text-sport-win' : 'text-muted-foreground',
              ]"
            >
              {{ match.result.setsHome }}
            </span>
            <span class="text-muted-foreground/40 text-lg">:</span>
            <span
              :class="[
                'font-display text-3xl font-bold',
                match.result.setsAway > match.result.setsHome ? 'text-sport-win' : 'text-muted-foreground',
              ]"
            >
              {{ match.result.setsAway }}
            </span>
          </div>
          <div class="flex gap-2">
            <span
              v-for="(s, i) in match.result.setScores"
              :key="i"
              class="bg-secondary rounded-md px-2 py-0.5 text-xs font-mono"
            >
              <span :class="s.home > s.away ? 'text-sport-win font-bold' : 'text-muted-foreground'">{{ s.home }}</span>
              <span class="text-muted-foreground/50 mx-0.5">:</span>
              <span :class="s.away > s.home ? 'text-sport-win font-bold' : 'text-muted-foreground'">{{ s.away }}</span>
            </span>
          </div>
        </div>
      </template>
      <template v-else>
        <span class="px-4 py-1 rounded-full accent-gradient text-accent-foreground text-xs font-bold tracking-widest shadow-sm">
          VS
        </span>
      </template>

      <!-- Away team -->
      <div
        :class="[
          'flex items-center gap-2.5',
          linkTeams ? 'cursor-pointer rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent' : '',
        ]"
        @click="linkTeams ? handleTeamClick(match.awayId, $event) : undefined"
        @keydown.enter.prevent="linkTeams ? router.push(`/teams/${match.awayId}`) : undefined"
        @keydown.space.prevent="linkTeams ? router.push(`/teams/${match.awayId}`) : undefined"
        :role="linkTeams ? 'button' : undefined"
        :tabindex="linkTeams ? 0 : undefined"
        :aria-label="linkTeams ? `Страница команды ${away.name}` : undefined"
      >
        <span
          class="w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold text-primary-foreground"
          :style="{ backgroundColor: `hsl(${away.color})` }"
        >
          {{ away.name.slice(0, 2).toUpperCase() }}
        </span>
        <span :class="['font-semibold text-sm', linkTeams ? 'hover:text-accent hover:underline transition-colors' : '']">
          {{ away.name }}
        </span>
      </div>
    </div>

    <!-- Meta footer -->
    <div class="px-4 py-2.5 bg-secondary/40 border-t border-border flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground items-center">
      <span
        v-if="isHome !== undefined"
        :class="['font-semibold px-1.5 py-0.5 rounded text-[10px]', isHome ? 'bg-sport-win/20 text-sport-win' : 'bg-accent/20 text-accent']"
      >
        {{ isHome ? "Дома" : "В гостях" }}
      </span>
      <span class="inline-flex items-center gap-1">
        <Calendar class="w-3 h-3" aria-hidden="true" />
        {{ new Date(match.date).toLocaleDateString("ru-RU", { day: "numeric", month: "short", weekday: "short" }) }}
      </span>
      <span class="inline-flex items-center gap-1">
        <Clock class="w-3 h-3" aria-hidden="true" />
        {{ match.time }}
      </span>
      <span class="inline-flex items-center gap-1">
        <MapPin class="w-3 h-3" aria-hidden="true" />
        {{ match.venue }} · {{ match.address }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { Calendar, Clock, MapPin } from "lucide-vue-next";
import { type Match, getTeam } from "@/data/league";

const props = defineProps<{
  match: Match;
  teamId?: number;
  linkTeams?: boolean;
}>();

const router = useRouter();

const home = computed(() => getTeam(props.match.homeId));
const away = computed(() => getTeam(props.match.awayId));

const isHome = computed(() =>
  props.teamId !== undefined ? props.match.homeId === props.teamId : undefined,
);

const perspectiveBorder = computed(() =>
  isHome.value === true
    ? "border-l-[3px] border-l-sport-win"
    : isHome.value === false
      ? "border-l-[3px] border-l-accent"
      : "",
);

function handleTeamClick(id: number, e: MouseEvent) {
  e.stopPropagation();
  router.push(`/teams/${id}`);
}
</script>
