<template>
  <div class="animate-fade-in grid gap-4 sm:grid-cols-2">
    <Card
      v-for="team in teams"
      :key="team.id"
      role="button"
      :tabindex="0"
      @click="router.push(`/teams/${team.id}`)"
      @keydown.enter.prevent="router.push(`/teams/${team.id}`)"
      @keydown.space.prevent="router.push(`/teams/${team.id}`)"
      :aria-label="`Команда ${team.name}`"
      class="cursor-pointer hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
    >
      <CardContent class="pt-4 flex items-center gap-4">
        <Avatar shape="square" :style="{ backgroundColor: `hsl(${team.color})` }">
          <AvatarFallback class="bg-transparent text-primary-foreground font-bold text-sm">
            {{ team.short }}
          </AvatarFallback>
        </Avatar>
        <div class="flex-1 min-w-0">
          <div class="font-semibold">{{ team.name }}</div>
          <div class="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
            <MapPin class="w-3 h-3 flex-shrink-0" aria-hidden="true" />
            <span class="truncate">{{ team.hall }}</span>
          </div>
          <div v-if="standingMap[team.id]?.s.played > 0" class="text-xs text-muted-foreground mt-0.5">
            #{{ standingMap[team.id].pos }} · {{ standingMap[team.id].s.points }} оч. · {{ standingMap[team.id].s.won }}В {{ standingMap[team.id].s.lost }}П
          </div>
        </div>
        <ChevronRight class="w-4 h-4 text-muted-foreground flex-shrink-0" aria-hidden="true" />
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { teams } from "@/data/league";
import { calcStandings } from "@/lib/standings";
import { MapPin, ChevronRight } from "lucide-vue-next";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const router = useRouter();
const standings = calcStandings();
const standingMap = Object.fromEntries(
  standings.map((s, i) => [s.team.id, { s, pos: i + 1 }]),
);
</script>
