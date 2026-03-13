<template>
  <div class="animate-fade-in space-y-8">
    <div class="bg-card border border-border rounded-lg px-4 py-3 flex items-center gap-2 text-sm text-muted-foreground">
      <Info class="w-4 h-4 shrink-0" aria-hidden="true" />
      <span>
        Сетка формируется по итогам регулярного сезона.
        Сыграно <span class="font-semibold text-foreground">{{ playedCount }}</span> из
        <span class="font-semibold text-foreground">{{ totalCount }}</span> матчей.
      </span>
    </div>

    <Bracket
      title="Верхняя сетка"
      subtitle="Места 1–4"
      theme-name="upper"
      :sf1="[seed(1), seed(4)]"
      :sf2="[seed(2), seed(3)]"
      final-label="Финал — за чемпионство"
      third-label="Матч за 3-е место"
    />

    <Bracket
      title="Нижняя сетка"
      subtitle="Места 5–8"
      theme-name="lower"
      :sf1="[seed(5), seed(8)]"
      :sf2="[seed(6), seed(7)]"
      final-label="Матч за 5-е место"
      third-label="Матч за 7-е место"
    />

    <p class="text-xs text-muted-foreground/50 text-center">
      Посев предварительный — по текущей таблице регулярного сезона
    </p>

    <!-- Rules -->
    <div class="bg-card border border-border rounded-lg p-4">
      <div class="flex items-center gap-2 mb-3">
        <Info class="w-4 h-4 text-muted-foreground" aria-hidden="true" />
        <span class="font-display text-sm text-muted-foreground">Формат плей-офф</span>
      </div>
      <ul class="space-y-2.5 text-sm">
        <li class="flex gap-2.5">
          <span class="w-1 shrink-0 rounded-full bg-amber-400 mt-1" aria-hidden="true" />
          <span class="text-muted-foreground">
            <span class="font-semibold text-amber-500 dark:text-amber-400">Верхняя сетка</span> — команды 1–4 по итогам регулярного сезона.
            Полуфинал: 1-е vs 4-е, 2-е vs 3-е. Победители играют за чемпионство.
          </span>
        </li>
        <li class="flex gap-2.5">
          <span class="w-1 shrink-0 rounded-full bg-sky-500 mt-1" aria-hidden="true" />
          <span class="text-muted-foreground">
            <span class="font-semibold text-sky-600 dark:text-sky-400">Нижняя сетка</span> — команды 5–8. Полуфинал: 5-е vs 8-е, 6-е vs 7-е.
          </span>
        </li>
        <li class="flex gap-2.5">
          <span class="w-1 shrink-0 rounded-full bg-border mt-1" aria-hidden="true" />
          <span class="text-muted-foreground">Проигравшие полуфиналов играют за 3-е (7-е) место.</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Info } from "lucide-vue-next";
import { calcStandings } from "@/lib/standings";
import { matches } from "@/data/league";
import Bracket from "@/components/playoff/Bracket.vue";
import type { SlotData } from "@/components/playoff/types";

const standings = calcStandings();
const playedCount = matches.filter((m) => m.played).length;
const totalCount = matches.length;

function seed(n: number): SlotData {
  return { kind: "seed", pos: n, team: standings[n - 1]?.team ?? null };
}
</script>
