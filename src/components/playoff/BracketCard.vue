<template>
  <div :class="cardClasses">
    <div :class="['px-3 py-1.5 flex items-center gap-1.5', theme.cardHeader]">
      <Trophy
        v-if="variant === 'final'"
        class="w-3 h-3 shrink-0"
        :class="theme.headerText"
        aria-hidden="true"
      />
      <span :class="['text-[10px] font-semibold uppercase tracking-widest', theme.headerText]">
        {{ label }}
      </span>
    </div>
    <TeamSlot :data="top" />
    <div class="flex items-center gap-2 px-3 py-1" aria-hidden="true">
      <div :class="['flex-1 h-px', theme.connector]" />
      <span
        :class="[
          'text-[10px] font-display font-bold px-2 py-0.5 rounded-full',
          theme.vsBg,
          theme.vsText,
        ]"
      >VS</span>
      <div :class="['flex-1 h-px', theme.connector]" />
    </div>
    <TeamSlot :data="bottom" />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Trophy } from "lucide-vue-next";
import TeamSlot from "./TeamSlot.vue";
import type { SlotData, BracketTheme, BracketCardVariant } from "./types";
import { THEME } from "./types";

const props = defineProps<{
  label: string;
  top: SlotData;
  bottom: SlotData;
  themeName: BracketTheme;
  variant?: BracketCardVariant;
}>();

const theme = computed(() => THEME[props.themeName]);

const cardClasses = computed(() => {
  const v = props.variant ?? "semifinal";
  if (v === "final") {
    return [
      "bg-card rounded-lg overflow-hidden border border-l-[3px]",
      theme.value.finalBorder,
    ];
  }
  if (v === "third") {
    return ["bg-card/70 rounded-lg overflow-hidden border border-border opacity-80"];
  }
  return ["bg-card rounded-lg overflow-hidden border", theme.value.cardBorder];
});
</script>
