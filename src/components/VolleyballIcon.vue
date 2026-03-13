<template>
  <svg :width="size" :height="size" viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <circle cx="16" cy="16" r="14" :fill="color" />
    <path d="M16 2C23 7 23 25 16 30" :stroke="seam" stroke-width="1.6" fill="none" stroke-linecap="round" />
    <path d="M16 2C9 7 9 25 16 30" :stroke="seam" stroke-width="1.6" fill="none" stroke-linecap="round" />
    <path d="M2 11C8 4 24 4 30 11" :stroke="seam" stroke-width="1.6" fill="none" stroke-linecap="round" />
    <ellipse cx="11" cy="9" rx="4" ry="2.5" fill="rgba(255,255,255,0.22)" transform="rotate(-20 11 9)" />
  </svg>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    color: string;
    seamDark?: boolean;
    size?: number;
  }>(),
  { seamDark: false, size: 28 },
);

const seam = computed(() =>
  props.seamDark ? "rgba(80,48,0,0.30)" : "rgba(255,255,255,0.45)",
);
</script>
