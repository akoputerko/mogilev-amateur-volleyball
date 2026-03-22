<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <header class="sport-gradient">
      <div class="container py-6 sm:py-8">
        <div class="flex items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg accent-gradient flex items-center justify-center">
              <Trophy class="w-5 h-5 text-accent-foreground" aria-hidden="true" />
            </div>
            <div>
              <h1 class="text-xl sm:text-2xl text-primary-foreground tracking-wide">
                Могилёвская Любительская Лига
              </h1>
              <p class="text-primary-foreground/50 text-xs mt-0.5 font-sans normal-case tracking-normal">
                Сезон 2025/26 · 8 команд · Волейбол · {{ fmtDate(seasonStart) }} — {{ fmtDate(seasonEnd) }}
              </p>
              <p class="text-primary-foreground/35 text-xs mt-0.5 font-sans normal-case tracking-normal">
                Лига не несёт коммерческий характер
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            @click="dark = !dark"
            :aria-label="dark ? 'Включить светлую тему' : 'Включить тёмную тему'"
            class="text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10 flex-shrink-0"
          >
            <Sun v-if="dark" class="w-5 h-5" aria-hidden="true" />
            <Moon v-else class="w-5 h-5" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </header>

    <!-- Tab bar -->
    <nav aria-label="Основная навигация" class="border-b border-border bg-card sticky top-0 z-10">
      <div class="container flex overflow-x-auto scrollbar-none">
        <Button
          v-for="tab in tabs"
          :key="tab.path"
          variant="ghost"
          @click="router.push(tab.path)"
          :aria-label="tab.label"
          :aria-current="isActive(tab.path) ? 'page' : undefined"
          :class="[
            'rounded-none border-b-2 px-4 py-3 h-auto gap-2',
            isActive(tab.path)
              ? 'border-accent text-accent hover:bg-transparent hover:text-accent'
              : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-transparent',
          ]"
        >
          <component :is="tab.icon" class="w-4 h-4" aria-hidden="true" />
          <span class="hidden md:inline">{{ tab.label }}</span>
        </Button>
      </div>
    </nav>

    <!-- Content -->
    <main class="container py-6">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { CalendarDays, LayoutGrid, Users, Trophy, Sun, Moon, Gamepad2, Medal } from "lucide-vue-next";
import { seasonStart, seasonEnd } from "@/data/league";
import { Button } from "@/components/ui/button";

const router = useRouter();
const route = useRoute();

const dark = ref((() => {
  const stored = localStorage.getItem("theme");
  if (stored) return stored === "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
})());

watch(
  dark,
  (val) => {
    document.documentElement.classList.toggle("dark", val);
    localStorage.setItem("theme", val ? "dark" : "light");
  },
  { immediate: true },
);

const tabs = [
  { label: "Таблица",   icon: Trophy,      path: "/"           },
  { label: "Календарь", icon: LayoutGrid,  path: "/calendar"   },
  { label: "Туры",      icon: CalendarDays, path: "/tours"     },
  { label: "Команды",   icon: Users,       path: "/teams"      },
  { label: "Плей-офф",  icon: Medal,       path: "/playoff"    },
  { label: "2048",      icon: Gamepad2,    path: "/playground" },
];

function isActive(path: string) {
  return path === "/" ? route.path === "/" : route.path.startsWith(path);
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("ru-RU", { day: "numeric", month: "short", year: "numeric" });
}
</script>
