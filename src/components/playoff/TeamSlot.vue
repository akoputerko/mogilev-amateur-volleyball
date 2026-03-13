<template>
  <template v-if="data.kind === 'adv'">
    <div class="flex items-center gap-2.5 px-3 py-2.5 min-h-[40px]">
      <span class="text-sm text-muted-foreground/40 italic">{{ data.label }}</span>
    </div>
  </template>

  <template v-else>
    <RouterLink
      v-if="data.team"
      :to="`/teams/${data.team.id}`"
      class="block hover:bg-secondary/50 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-accent"
      :aria-label="`${data.team.name}, место ${data.pos}`"
    >
      <div class="flex items-center gap-2.5 px-3 py-2.5 min-h-[40px]">
        <span
          :class="[
            'font-display font-bold text-[11px] w-5 h-5 flex items-center justify-center rounded shrink-0',
            seedCls,
          ]"
          aria-hidden="true"
        >
          {{ data.pos }}
        </span>
        <span
          class="w-2 h-2 rounded-full shrink-0"
          :style="{ backgroundColor: `hsl(${data.team.color})` }"
          aria-hidden="true"
        />
        <span class="text-sm font-medium text-foreground truncate">{{ data.team.name }}</span>
      </div>
    </RouterLink>

    <div v-else>
      <div class="flex items-center gap-2.5 px-3 py-2.5 min-h-[40px]">
        <span
          :class="[
            'font-display font-bold text-[11px] w-5 h-5 flex items-center justify-center rounded shrink-0',
            seedCls,
          ]"
          aria-hidden="true"
        >
          {{ data.pos }}
        </span>
        <span class="text-sm text-muted-foreground/40 italic">TBD</span>
      </div>
    </div>
  </template>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { SlotData } from "./types";

const props = defineProps<{ data: SlotData }>();

const seedCls = computed(() => {
  if (props.data.kind !== "seed") return "";
  const pos = props.data.pos;
  return pos === 1
    ? "bg-amber-400/20 text-amber-400"
    : pos <= 4
      ? "bg-sky-500/20 text-sky-500"
      : "bg-muted text-muted-foreground/60";
});
</script>
