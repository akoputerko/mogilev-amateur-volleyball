<template>
  <div :class="['bg-card rounded-lg overflow-hidden border', theme.finalistBorder, theme.finalistBg]">
    <div :class="['px-3 py-1.5 flex items-center', theme.cardHeader]">
      <span :class="['text-[10px] font-semibold uppercase tracking-widest', theme.headerText]">
        Финалист
      </span>
    </div>
    <div class="flex items-center gap-2.5 px-3 py-2.5 min-h-[44px]">
      <span class="text-sm text-muted-foreground/40 italic flex-1">
        <template v-if="data.kind === 'adv'">{{ data.label }}</template>
        <template v-else-if="data.team">{{ data.team.name }}</template>
        <template v-else>TBD</template>
      </span>
      <span
        class="font-display font-bold text-sm text-muted-foreground/40 shrink-0 min-w-[18px] text-right"
        aria-hidden="true"
      >-</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { SlotData, BracketTheme } from "./types";
import { THEME } from "./types";

const props = defineProps<{
  themeName: BracketTheme;
  data: SlotData;
}>();

const theme = computed(() => THEME[props.themeName]);
</script>
