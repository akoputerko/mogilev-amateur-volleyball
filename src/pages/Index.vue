<template>
  <div class="min-h-screen bg-background">
    <!-- Skip to content -->
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:rounded focus:bg-background focus:text-foreground focus:ring-2 focus:ring-accent"
    >
      Перейти к содержимому
    </a>

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
                Сезон 2025/26 · {{ teams.length }} команд · Волейбол · {{ fmtDate(seasonStart) }} — {{ fmtDate(seasonEnd) }}
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
        <RouterLink
          v-for="tab in tabs"
          :key="tab.path"
          :to="tab.path"
          :aria-label="tab.label"
          :aria-current="isActive(tab.path) ? 'page' : undefined"
          :class="[
            'inline-flex items-center rounded-none border-b-2 px-4 py-3 gap-2 text-sm font-medium transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
            'whitespace-nowrap',
            isActive(tab.path)
              ? 'border-accent text-accent hover:text-accent'
              : 'border-transparent text-muted-foreground hover:text-foreground',
          ]"
        >
          <component :is="tab.icon" class="w-4 h-4" aria-hidden="true" />
          <span class="hidden md:inline">{{ tab.label }}</span>
        </RouterLink>
      </div>
    </nav>

    <!-- Content -->
    <main id="main-content" class="container py-6" tabindex="-1" style="outline: none;">
      <RouterView />
    </main>

    <!-- Footer -->
    <footer class="border-t border-border mt-8 py-4">
      <div class="container text-center text-xs text-muted-foreground">
        <a
          href="https://github.com/akoputerko/mogilev-amateur-volleyball"
          target="_blank"
          rel="noopener noreferrer"
          class="hover:text-foreground transition-colors"
        >
          Исходный код на GitHub
        </a>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import { CalendarDays, LayoutGrid, Users, Trophy, Sun, Moon, Medal, BarChart3 } from "lucide-vue-next";
import { teams, seasonStart, seasonEnd } from "@/data/league";
import { Button } from "@/components/ui/button";

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
  { label: "Аналитика", icon: BarChart3,   path: "/analytics"  },
  { label: "Плей-офф",  icon: Medal,       path: "/playoff"    },
];

function isActive(path: string) {
  return path === "/" ? route.path === "/" : route.path.startsWith(path);
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("ru-RU", { day: "numeric", month: "short", year: "numeric" });
}
</script>
