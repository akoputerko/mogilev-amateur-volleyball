<template>
  <section :aria-label="title" :class="theme.section">
    <!-- Section header -->
    <div class="flex items-center gap-2 mb-5">
      <div :class="['w-1 h-5 rounded-full', theme.accentBar]" aria-hidden="true" />
      <h2 :class="['font-display text-lg font-bold', theme.titleText]">{{ title }}</h2>
      <span class="text-xs text-muted-foreground">{{ subtitle }}</span>
    </div>

    <!-- Mobile: vertical bracket with flow indicators -->
    <div class="sm:hidden">
      <!-- Semifinal round label -->
      <div :class="['flex items-center gap-2 mb-3 px-1', theme.roundLabelText]">
        <Swords class="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
        <span class="text-xs font-display font-semibold uppercase tracking-wider">Полуфинал</span>
      </div>

      <BracketCard
        :theme-name="themeName"
        variant="semifinal"
        label="Полуфинал 1"
        :top="sf1[0]"
        :bottom="sf1[1]"
      />

      <!-- Vertical connector between semis -->
      <div class="flex justify-center py-1.5" aria-hidden="true">
        <div :class="['w-0.5 h-4 rounded-full opacity-30', theme.accentBar]" />
      </div>

      <BracketCard
        :theme-name="themeName"
        variant="semifinal"
        label="Полуфинал 2"
        :top="sf2[0]"
        :bottom="sf2[1]"
      />

      <!-- Round transition divider -->
      <div class="flex items-center gap-2 py-3" aria-hidden="true">
        <div :class="['flex-1 h-px opacity-20', theme.accentBar]" />
        <div :class="['flex items-center gap-1 px-2.5 py-1 rounded-full', theme.roundLabelBg]">
          <ChevronDown :class="['w-3 h-3', theme.roundLabelText]" />
        </div>
        <div :class="['flex-1 h-px opacity-20', theme.accentBar]" />
      </div>

      <!-- Final round label -->
      <div :class="['flex items-center gap-2 mb-3 px-1', theme.roundLabelText]">
        <Trophy class="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
        <span class="text-xs font-display font-semibold uppercase tracking-wider">Финал</span>
      </div>

      <BracketCard
        :theme-name="themeName"
        variant="final"
        :label="finalLabel"
        :top="ADV_W1"
        :bottom="ADV_W2"
      />

      <!-- Vertical connector before 3rd place -->
      <div class="flex justify-center py-1.5" aria-hidden="true">
        <div class="w-0.5 h-3 rounded-full opacity-20 bg-border" />
      </div>

      <BracketCard
        :theme-name="themeName"
        variant="third"
        :label="thirdLabel"
        :top="ADV_L1"
        :bottom="ADV_L2"
      />
    </div>

    <!-- Desktop: bracket grid layout -->
    <div class="hidden sm:block">
      <!-- Round labels row -->
      <div class="grid grid-cols-[1fr_48px_1fr] mb-2.5">
        <div :class="['flex items-center gap-1.5', theme.roundLabelText]">
          <Swords class="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span class="text-xs font-display font-semibold uppercase tracking-wider">Полуфинал</span>
        </div>
        <div />
        <div :class="['flex items-center gap-1.5', theme.roundLabelText]">
          <Trophy class="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span class="text-xs font-display font-semibold uppercase tracking-wider">Финал</span>
        </div>
      </div>

      <!-- Bracket grid -->
      <div class="grid grid-cols-[1fr_48px_1fr] grid-rows-[auto_auto] gap-y-4">
        <!-- SF1 -->
        <div class="col-start-1 row-start-1">
          <BracketCard
            :theme-name="themeName"
            variant="semifinal"
            label="Полуфинал 1"
            :top="sf1[0]"
            :bottom="sf1[1]"
          />
        </div>

        <!-- SF2 -->
        <div class="col-start-1 row-start-2">
          <BracketCard
            :theme-name="themeName"
            variant="semifinal"
            label="Полуфинал 2"
            :top="sf2[0]"
            :bottom="sf2[1]"
          />
        </div>

        <!-- Bracket connector (funnel shape) -->
        <div class="col-start-2 row-start-1 row-span-2 flex flex-col" aria-hidden="true">
          <div :class="['flex-1 border-r-2 border-b-2 rounded-br-md', theme.connectorThick]" />
          <div :class="['flex-1 border-r-2 border-t-2 rounded-tr-md', theme.connectorThick]" />
        </div>

        <!-- Final + 3rd place in right column -->
        <div class="col-start-3 row-start-1 row-span-2 flex flex-col justify-center gap-0">
          <BracketCard
            :theme-name="themeName"
            variant="final"
            :label="finalLabel"
            :top="ADV_W1"
            :bottom="ADV_W2"
          />
          <div class="flex items-center gap-1.5 mt-4 mb-2 px-0.5" aria-hidden="true">
            <div class="flex-1 h-px bg-border opacity-50" />
          </div>
          <BracketCard
            :theme-name="themeName"
            variant="third"
            :label="thirdLabel"
            :top="ADV_L1"
            :bottom="ADV_L2"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { ChevronDown, Trophy, Swords } from "lucide-vue-next";
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
