<template>
  <Card class="text-center">
    <CardContent class="pt-3 pb-3">
      <div class="font-display text-xl font-bold">
        <span class="text-sport-win">{{ wins }}</span>
        <span class="text-muted-foreground/40 mx-1 text-base font-sans">/</span>
        <span class="text-sport-loss">{{ losses }}</span>
      </div>
      <div class="text-xs text-muted-foreground mt-1">{{ label }}</div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { Card, CardContent } from "@/components/ui/card";

defineProps<{
  label: string;
  wins: number;
  losses: number;
}>();
</script>
