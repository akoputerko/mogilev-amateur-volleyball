<template>
  <div class="bg-secondary/50 rounded-lg p-3 text-center">
    <div class="font-display text-xl font-bold">
      <span class="text-sport-win">{{ wins }}</span>
      <span class="text-muted-foreground/40 mx-1 text-base font-sans">/</span>
      <span class="text-sport-loss">{{ losses }}</span>
    </div>
    <div class="text-xs text-muted-foreground mt-1">{{ label }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
  wins: number;
  losses: number;
}>();
</script>
