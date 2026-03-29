<template>
  <section :aria-label="title" :class="theme.section">
    <!-- Section header -->
    <div class="flex items-center gap-2 mb-5">
      <div :class="['w-1 h-5 rounded-full', theme.accentBar]" aria-hidden="true" />
      <h2 :class="['font-display text-lg font-bold', theme.titleText]">{{ title }}</h2>
      <span class="text-xs text-muted-foreground">{{ subtitle }}</span>
    </div>

    <!-- Mobile: vertical bracket flow -->
    <div class="md:hidden">
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

    <!-- Desktop: symmetric 9-column bracket grid -->
    <div class="hidden md:block">
      <!-- Column headers row -->
      <div
        class="grid gap-x-0 mb-2.5"
        style="grid-template-columns: 1.2fr 32px 0.9fr 32px auto 32px 0.9fr 32px 1.2fr"
      >
        <div :class="['flex items-center gap-1.5', theme.roundLabelText]">
          <Swords class="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span class="text-xs font-display font-semibold uppercase tracking-wider">Полуфинал 1</span>
        </div>
        <div />
        <div :class="['flex items-center gap-1.5 justify-center', theme.roundLabelText]">
          <span class="text-xs font-display font-semibold uppercase tracking-wider">Финалист</span>
        </div>
        <div />
        <div :class="['flex items-center gap-1.5 justify-center', theme.roundLabelText]">
          <Trophy class="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span class="text-xs font-display font-semibold uppercase tracking-wider">{{ finalLabel }}</span>
        </div>
        <div />
        <div :class="['flex items-center gap-1.5 justify-center', theme.roundLabelText]">
          <span class="text-xs font-display font-semibold uppercase tracking-wider">Финалист</span>
        </div>
        <div />
        <div :class="['flex items-center gap-1.5 justify-end', theme.roundLabelText]">
          <span class="text-xs font-display font-semibold uppercase tracking-wider">Полуфинал 2</span>
          <Swords class="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
        </div>
      </div>

      <!-- Bracket grid -->
      <div
        class="grid items-stretch gap-x-0"
        style="grid-template-columns: 1.2fr 32px 0.9fr 32px auto 32px 0.9fr 32px 1.2fr"
      >
        <!-- Col 1: SF1 (left) -->
        <div class="col-start-1 flex flex-col justify-center">
          <BracketCard
            :theme-name="themeName"
            variant="semifinal"
            label="Полуфинал 1"
            :top="sf1[0]"
            :bottom="sf1[1]"
          />
        </div>

        <!-- Col 2: SF1 → Finalist left connector (funnel) -->
        <BracketConnector
          :theme-name="themeName"
          direction="left"
          variant="semi-to-finalist"
        />

        <!-- Col 3: Finalist left placeholder -->
        <div class="col-start-3 flex flex-col justify-center">
          <FinalistSlot :theme-name="themeName" :data="ADV_W1" />
        </div>

        <!-- Col 4: Finalist left → Center connector (horizontal line) -->
        <BracketConnector
          :theme-name="themeName"
          direction="left"
          variant="finalist-to-center"
        />

        <!-- Col 5: Center — trophy + final + 3rd place -->
        <div class="col-start-5 flex flex-col items-stretch gap-0 min-w-[190px]">
          <div class="flex justify-center mb-2" aria-hidden="true">
            <Trophy :class="['w-8 h-8 opacity-20', theme.trophyText]" />
          </div>
          <BracketCard
            :theme-name="themeName"
            variant="final"
            :label="finalLabel"
            :top="ADV_W1"
            :bottom="ADV_W2"
          />
          <div class="flex items-center gap-1.5 my-2 px-0.5" aria-hidden="true">
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

        <!-- Col 6: Finalist right → Center connector (horizontal line) -->
        <BracketConnector
          :theme-name="themeName"
          direction="right"
          variant="finalist-to-center"
        />

        <!-- Col 7: Finalist right placeholder -->
        <div class="col-start-7 flex flex-col justify-center">
          <FinalistSlot :theme-name="themeName" :data="ADV_W2" />
        </div>

        <!-- Col 8: SF2 → Finalist right connector (funnel, mirrored) -->
        <BracketConnector
          :theme-name="themeName"
          direction="right"
          variant="semi-to-finalist"
        />

        <!-- Col 9: SF2 (right) -->
        <div class="col-start-9 flex flex-col justify-center">
          <BracketCard
            :theme-name="themeName"
            variant="semifinal"
            label="Полуфинал 2"
            :top="sf2[0]"
            :bottom="sf2[1]"
          />
        </div>
      </div>

      <!-- Bottom row: losers bracket labels -->
      <div
        class="grid gap-x-0 mt-3"
        style="grid-template-columns: 1.2fr 32px 0.9fr 32px auto 32px 0.9fr 32px 1.2fr"
      >
        <div />
        <div />
        <div />
        <div />
        <div :class="['flex items-center gap-1.5 justify-center', theme.roundLabelText]">
          <span class="text-xs font-display font-semibold uppercase tracking-wider opacity-60">{{ thirdLabel }}</span>
        </div>
        <div />
        <div />
        <div />
        <div />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { ChevronDown, Trophy, Swords } from "lucide-vue-next";
import BracketCard from "./BracketCard.vue";
import FinalistSlot from "./FinalistSlot.vue";
import BracketConnector from "./BracketConnector.vue";
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
