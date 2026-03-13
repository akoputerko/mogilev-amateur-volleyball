<template>
  <section :aria-label="title" :class="theme.section">
    <div class="flex items-center gap-2 mb-4">
      <div :class="['w-1 h-5 rounded-full', theme.accentBar]" aria-hidden="true" />
      <h2 :class="['font-display text-lg font-bold', theme.titleText]">{{ title }}</h2>
      <span class="text-xs text-muted-foreground">{{ subtitle }}</span>
    </div>

    <!-- Mobile: flat vertical list -->
    <div class="sm:hidden space-y-3">
      <BracketCard :theme-name="themeName" label="Полуфинал 1" :top="sf1[0]" :bottom="sf1[1]" />
      <BracketCard :theme-name="themeName" label="Полуфинал 2" :top="sf2[0]" :bottom="sf2[1]" />
      <div class="flex items-center gap-2 py-0.5" aria-hidden="true">
        <div :class="['flex-1 h-px opacity-30', theme.accentBar]" />
        <ChevronDown :class="['w-3.5 h-3.5 opacity-60', theme.titleText]" />
        <div :class="['flex-1 h-px opacity-30', theme.accentBar]" />
      </div>
      <BracketCard :theme-name="themeName" :label="finalLabel" :top="ADV_W1" :bottom="ADV_W2" />
      <BracketCard :theme-name="themeName" :label="thirdLabel" :top="ADV_L1" :bottom="ADV_L2" />
    </div>

    <!-- Desktop: bracket layout -->
    <div class="hidden sm:grid grid-cols-[1fr_24px_1fr] grid-rows-2 gap-y-4">
      <!-- SF1 -->
      <div class="col-start-1 row-start-1">
        <BracketCard :theme-name="themeName" label="Полуфинал 1" :top="sf1[0]" :bottom="sf1[1]" />
      </div>
      <!-- SF2 -->
      <div class="col-start-1 row-start-2">
        <BracketCard :theme-name="themeName" label="Полуфинал 2" :top="sf2[0]" :bottom="sf2[1]" />
      </div>

      <!-- Bracket connector -->
      <div class="col-start-2 row-start-1 row-span-2 flex flex-col" aria-hidden="true">
        <div :class="['flex-1 border-r border-b rounded-br-sm', theme.connector]" />
        <div :class="['flex-1 border-r border-t rounded-tr-sm', theme.connector]" />
      </div>

      <!-- Final + 3rd place -->
      <div class="col-start-3 row-start-1 row-span-2 flex flex-col justify-center gap-4">
        <BracketCard :theme-name="themeName" :label="finalLabel" :top="ADV_W1" :bottom="ADV_W2" />
        <BracketCard :theme-name="themeName" :label="thirdLabel" :top="ADV_L1" :bottom="ADV_L2" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { ChevronDown } from "lucide-vue-next";
import BracketCard from "./BracketCard.vue";
import type { SlotData, BracketTheme } from "./types";
import { THEME } from "./types";

const props = defineProps<{
  title: string;
  subtitle: string;
  themeName: BracketTheme;
  sf1: [SlotData, SlotData];
  sf2: [SlotData, SlotData];
  finalLabel: string;
  thirdLabel: string;
}>();

const theme = computed(() => THEME[props.themeName]);

const ADV_W1: SlotData = { kind: "adv", label: "Победитель ПФ 1" };
const ADV_W2: SlotData = { kind: "adv", label: "Победитель ПФ 2" };
const ADV_L1: SlotData = { kind: "adv", label: "Проигравший ПФ 1" };
const ADV_L2: SlotData = { kind: "adv", label: "Проигравший ПФ 2" };
</script>
