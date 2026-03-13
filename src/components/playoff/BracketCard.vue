<template>
  <div :class="['bg-card rounded-lg overflow-hidden border', theme.cardBorder]">
    <div :class="['px-3 py-1.5', theme.cardHeader]">
      <span :class="['text-[10px] font-semibold uppercase tracking-widest', theme.headerText]">
        {{ label }}
      </span>
    </div>
    <TeamSlot :data="top" />
    <div class="border-t border-border" />
    <TeamSlot :data="bottom" />
  </div>
</template>

<script setup lang="ts">
import TeamSlot from "./TeamSlot.vue";
import type { SlotData, BracketTheme } from "./types";
import { THEME } from "./types";
import { computed } from "vue";

const props = defineProps<{
  label: string;
  top: SlotData;
  bottom: SlotData;
  themeName: BracketTheme;
}>();

const theme = computed(() => THEME[props.themeName]);
</script>
