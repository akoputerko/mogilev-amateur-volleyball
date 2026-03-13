<template>
  <div class="bg-secondary rounded-lg px-3 py-1 text-center min-w-[56px]">
    <div class="text-[10px] text-muted-foreground font-semibold tracking-wider">{{ label }}</div>
    <div class="font-display text-lg font-bold leading-tight">{{ value }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
  value: number;
}>();
</script>
