<!-- src/components/ExportModal.vue -->
<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent class="max-w-2xl max-h-[90vh] flex flex-col gap-0 p-0">
      <DialogHeader class="px-6 pt-6 pb-4">
        <DialogTitle>Экспорт: {{ tabLabel }}</DialogTitle>
      </DialogHeader>

      <!-- Inner tab switcher -->
      <div role="tablist" aria-label="Формат экспорта" class="flex gap-1 border-b border-border px-6">
        <button
          v-for="t in innerTabs"
          :key="t.id"
          role="tab"
          :aria-selected="innerTab === t.id"
          @click="switchInnerTab(t.id)"
          class="px-4 py-2 text-sm font-medium transition-colors relative -mb-px"
          :class="innerTab === t.id
            ? 'text-foreground border-b-2 border-primary'
            : 'text-muted-foreground hover:text-foreground'"
        >{{ t.label }}</button>
      </div>

      <!-- Text tab -->
      <div v-if="innerTab === 'text'" class="flex flex-col flex-1 min-h-0 gap-3 p-6 pt-4">
        <div class="flex justify-end">
          <Button variant="outline" size="sm" @click="copyText">
            <component :is="copied ? Check : Copy" class="w-3.5 h-3.5 mr-1.5" aria-hidden="true" />
            {{ copied ? "Скопировано!" : "Скопировать всё" }}
          </Button>
        </div>
        <ScrollArea class="flex-1 rounded border border-border" style="max-height: 55vh">
          <pre class="p-4 text-xs font-mono whitespace-pre-wrap break-words text-foreground leading-relaxed">{{ formattedText }}</pre>
        </ScrollArea>
      </div>

      <!-- Images tab -->
      <div v-else class="flex flex-col flex-1 min-h-0 gap-3 p-6 pt-4">
        <div
          v-if="imagesLoading"
          class="flex flex-col items-center justify-center gap-3 text-muted-foreground"
          style="min-height: 200px"
        >
          <div class="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" aria-hidden="true"></div>
          <span class="text-sm">Генерация картинок...</span>
        </div>

        <template v-else>
          <div class="flex justify-end">
            <Button variant="outline" size="sm" @click="downloadAll">
              <Download class="w-3.5 h-3.5 mr-1.5" aria-hidden="true" />
              Скачать все
            </Button>
          </div>
          <ScrollArea style="max-height: 55vh">
            <div class="space-y-3 pr-4">
              <div
                v-for="img in renderedImages"
                :key="img.filename"
                class="flex items-center gap-3 p-2 rounded-lg border border-border bg-secondary/20"
              >
                <img
                  :src="img.dataUrl"
                  :alt="img.title"
                  class="h-16 w-auto rounded object-cover flex-shrink-0"
                />
                <span class="text-xs font-medium flex-1 truncate min-w-0">{{ img.title }}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  @click="downloadImage(img.dataUrl, img.filename)"
                  :aria-label="`Скачать ${img.title}`"
                >
                  <Download class="w-4 h-4" aria-hidden="true" />
                </Button>
              </div>
            </div>
          </ScrollArea>
        </template>
      </div>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { Copy, Check, Download } from "lucide-vue-next";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatSummaryText, formatStatsText, formatTeamsText } from "@/lib/export-text";
import { renderSectionToImage, downloadImage } from "@/lib/export-image";
import { teams } from "@/data/league";
import type { SummaryExportData, StatsExportData, TeamsExportData } from "@/lib/export-text";

// ── Props / Emits ──────────────────────────────────────────────────────────

const props = defineProps<{
  open: boolean;
  tabId: "summary" | "stats" | "teams";
  tabLabel: string;
  summaryData: SummaryExportData;
  statsData: StatsExportData;
  teamsData: TeamsExportData;
  sectionRefs: Record<string, HTMLElement | null>;
}>();

defineEmits<{ "update:open": [value: boolean] }>();

// ── Inner tab state ────────────────────────────────────────────────────────

const innerTabs = [
  { id: "text"   as const, label: "Текст"    },
  { id: "images" as const, label: "Картинки" },
];
const innerTab = ref<"text" | "images">("text");

watch(() => props.open, (val) => {
  if (val) {
    innerTab.value = "text";
    renderedImages.value = [];
  }
});

function switchInnerTab(id: "text" | "images"): void {
  innerTab.value = id;
  if (id === "images" && renderedImages.value.length === 0 && !imagesLoading.value) {
    void generateImages();
  }
}

// ── Text tab ───────────────────────────────────────────────────────────────

const formattedText = computed(() => {
  if (props.tabId === "summary") return formatSummaryText(props.summaryData);
  if (props.tabId === "stats")   return formatStatsText(props.statsData);
  return formatTeamsText(props.teamsData);
});

const copied = ref(false);

async function copyText(): Promise<void> {
  try {
    await navigator.clipboard.writeText(formattedText.value);
    copied.value = true;
    setTimeout(() => { copied.value = false; }, 2000);
  } catch {
    // clipboard unavailable — ignore silently
  }
}

// ── Images tab ─────────────────────────────────────────────────────────────

interface RenderedImage {
  title: string;
  filename: string;
  dataUrl: string;
}

const renderedImages = ref<RenderedImage[]>([]);
const imagesLoading  = ref(false);

const teamMap = Object.fromEntries(teams.map((t) => [t.short, t.name]));

const sectionDefs = computed(() => {
  if (props.tabId === "summary") {
    return [
      { title: "Обзор лиги",         filename: "сводка-01-обзор-лиги.png",         refKey: "sectionSummary1" },
      { title: "Результаты матчей",   filename: "сводка-02-результаты-матчей.png",   refKey: "sectionSummary2" },
      { title: "Дома / В гостях",     filename: "сводка-03-дома-в-гостях.png",       refKey: "sectionSummary3" },
      { title: "Лидеры лиги",         filename: "сводка-04-лидеры-лиги.png",         refKey: "sectionSummary4" },
      { title: "Рекорды лиги",        filename: "сводка-05-рекорды-лиги.png",        refKey: "sectionSummary5" },
      { title: "Матрица результатов", filename: "сводка-06-матрица-результатов.png", refKey: "sectionSummary6" },
    ];
  }
  if (props.tabId === "stats") {
    return [
      { title: "Характер партий",      filename: "статистика-01-характер-партий.png",     refKey: "sectionStats1" },
      { title: "Игра по партиям",      filename: "статистика-02-игра-по-партиям.png",      refKey: "sectionStats2" },
      { title: "Решающие партии",      filename: "статистика-03-решающие-партии.png",      refKey: "sectionStats3" },
      { title: "Серии сезона",         filename: "статистика-04-серии-сезона.png",         refKey: "sectionStats4" },
      { title: "Распределение счётов", filename: "статистика-05-распределение-счётов.png", refKey: "sectionStats5" },
    ];
  }
  return [
    { title: "Форма команд",             filename: "команды-01-форма-команд.png",              refKey: "sectionTeams1" },
    { title: "Эффективность по партиям", filename: "команды-02-эффективность-по-партиям.png",  refKey: "sectionTeams2" },
    { title: "Динамика позиций",         filename: "команды-03-динамика-позиций.png",           refKey: "sectionTeams3" },
    { title: "Средний счёт в партиях",   filename: "команды-04-средний-счёт-в-партиях.png",    refKey: "sectionTeams4" },
  ];
});

async function generateImages(): Promise<void> {
  imagesLoading.value = true;
  renderedImages.value = [];
  const results: RenderedImage[] = [];
  try {
    for (const def of sectionDefs.value) {
      const el = props.sectionRefs[def.refKey];
      if (el) {
        const dataUrl = await renderSectionToImage(el, def.title, teamMap);
        results.push({ title: def.title, filename: def.filename, dataUrl });
      }
    }
    renderedImages.value = results;
  } finally {
    imagesLoading.value = false;
  }
}

async function downloadAll(): Promise<void> {
  for (const img of renderedImages.value) {
    downloadImage(img.dataUrl, img.filename);
    await new Promise<void>((resolve) => setTimeout(resolve, 100));
  }
}
</script>
