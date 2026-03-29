<template>
  <!-- Funnel shape: two halves with corner borders converging to a single point -->
  <div v-if="variant === 'semi-to-finalist'" class="flex flex-col h-full" aria-hidden="true">
    <div
      v-if="direction === 'left'"
      :class="['flex-1 border-r-2 border-b-2 rounded-br-md', theme.connectorThick]"
    />
    <div
      v-if="direction === 'left'"
      :class="['flex-1 border-r-2 border-t-2 rounded-tr-md', theme.connectorThick]"
    />
    <div
      v-if="direction === 'right'"
      :class="['flex-1 border-l-2 border-b-2 rounded-bl-md', theme.connectorThick]"
    />
    <div
      v-if="direction === 'right'"
      :class="['flex-1 border-l-2 border-t-2 rounded-tl-md', theme.connectorThick]"
    />
  </div>

  <!-- Simple horizontal line at vertical center -->
  <div v-else class="flex items-center h-full" aria-hidden="true">
    <div :class="['w-full h-0.5 rounded-full opacity-60', theme.accentBar]" />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { BracketTheme } from "./types";
import { THEME } from "./types";

const props = defineProps<{
  themeName: BracketTheme;
  direction: "left" | "right";
  variant: "semi-to-finalist" | "finalist-to-center";
}>();

const theme = computed(() => THEME[props.themeName]);
</script>
