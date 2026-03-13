<template>
  <div class="animate-fade-in flex flex-col items-center gap-4 select-none">
    <!-- Header row -->
    <div class="w-full max-w-sm flex items-center justify-between">
      <div>
        <h2 class="font-display text-2xl tracking-wide flex items-center gap-2">
          2048 <VolleyballIcon color="#e87000" :seam-dark="false" :size="24" />
        </h2>
        <p class="text-xs text-muted-foreground">Волейбольная версия</p>
      </div>
      <div class="flex items-center gap-2">
        <ScoreBox label="СЧЁТ"   :value="score" />
        <ScoreBox label="РЕКОРД" :value="best"  />
        <button
          @click="reset"
          class="w-11 h-11 flex items-center justify-center rounded-lg bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          aria-label="Новая игра"
        >
          <RotateCcw class="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </div>

    <!-- Board -->
    <div
      ref="boardRef"
      role="application"
      aria-label="Игровое поле 2048. Используйте стрелки или WASD для управления."
      class="relative w-full max-w-sm rounded-xl p-2.5 overflow-hidden"
      style="background: #b5a99a"
      @touchstart="onTouchStart"
      @touchend="onTouchEnd"
    >
      <div class="grid grid-cols-4 gap-2">
        <div
          v-for="(val, idx) in board.flat()"
          :key="idx"
          class="aspect-square rounded-lg flex flex-col items-center justify-center gap-0.5 transition-colors duration-75"
          :style="{ background: getTileCfg(val).bg }"
        >
          <template v-if="val > 0">
            <VolleyballIcon :color="getTileCfg(val).ballColor" :seam-dark="getTileCfg(val).seamDark" :size="28" />
            <span
              class="font-display font-bold leading-none"
              :style="{ color: getTileCfg(val).fg, fontSize: tileFontSize(val) }"
            >
              {{ val }}
            </span>
          </template>
        </div>
      </div>

      <!-- Game-over / win overlay -->
      <div
        v-if="status !== 'playing'"
        role="alert"
        class="absolute inset-0 rounded-xl bg-black/60 flex flex-col items-center justify-center gap-3 p-4"
      >
        <template v-if="status === 'won'">
          <VolleyballIcon color="#ffffff" :seam-dark="true" :size="56" />
          <p class="font-display text-3xl text-yellow-300 uppercase">Победа!</p>
          <p class="text-sm text-white/70">Ты собрал 2048!</p>
          <div class="flex gap-2 mt-1">
            <button
              @click="continued = true; status = 'playing'"
              class="px-4 py-3 rounded-lg bg-yellow-400 text-yellow-900 font-semibold text-sm hover:bg-yellow-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-600"
            >
              Продолжить
            </button>
            <button
              @click="reset"
              class="px-4 py-3 rounded-lg bg-white/20 text-white font-semibold text-sm hover:bg-white/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Заново
            </button>
          </div>
        </template>
        <template v-else>
          <VolleyballIcon color="#c8b490" :seam-dark="true" :size="56" />
          <p class="font-display text-3xl text-red-300 uppercase">Конец игры</p>
          <p class="text-sm text-white/70">Нет доступных ходов</p>
          <button
            @click="reset"
            class="mt-1 px-4 py-3 rounded-lg bg-accent text-white font-semibold text-sm hover:bg-accent/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            Заново
          </button>
        </template>
      </div>
    </div>

    <!-- Controls hint -->
    <p class="text-xs text-muted-foreground text-center">Стрелки / WASD · свайп на телефоне</p>

    <!-- Tile legend -->
    <div class="w-full max-w-sm">
      <p class="text-xs text-muted-foreground mb-2 text-center">Путь к чемпионству</p>
      <div class="grid grid-cols-4 gap-1.5">
        <div
          v-for="v in TILE_VALUES"
          :key="v"
          class="aspect-square rounded-md flex flex-col items-center justify-center text-center"
          :style="{ background: getTileCfg(v).bg }"
        >
          <VolleyballIcon :color="getTileCfg(v).ballColor" :seam-dark="getTileCfg(v).seamDark" :size="18" />
          <span
            class="font-display font-bold leading-none"
            :style="{ color: getTileCfg(v).fg, fontSize: '0.6rem' }"
          >
            {{ v }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from "vue";
import { RotateCcw } from "lucide-vue-next";
import VolleyballIcon from "@/components/VolleyballIcon.vue";
import ScoreBox from "@/components/ScoreBox.vue";

type Board  = number[][];
type Dir    = "left" | "right" | "up" | "down";
type Status = "playing" | "won" | "lost";

interface TileCfg { bg: string; fg: string; ballColor: string; seamDark?: boolean }

const TILE_CFG: Record<number, TileCfg> = {
  0:    { bg: "rgba(180,156,128,0.25)", fg: "transparent", ballColor: "transparent" },
  2:    { bg: "#fefce8", fg: "#854d0e", ballColor: "#c8b490", seamDark: true  },
  4:    { bg: "#fef9c3", fg: "#713f12", ballColor: "#f0c020", seamDark: true  },
  8:    { bg: "#fdba74", fg: "#431407", ballColor: "#e87000"                   },
  16:   { bg: "#fb923c", fg: "#fff7ed", ballColor: "#dd4400"                   },
  32:   { bg: "#f97316", fg: "#fff7ed", ballColor: "#cc1100"                   },
  64:   { bg: "#ea580c", fg: "#fff7ed", ballColor: "#880000"                   },
  128:  { bg: "#fbbf24", fg: "#451a03", ballColor: "#ffd700", seamDark: true  },
  256:  { bg: "#f59e0b", fg: "#1c0a00", ballColor: "#b36b00"                   },
  512:  { bg: "#22c55e", fg: "#052e16", ballColor: "#22bb33"                   },
  1024: { bg: "#16a34a", fg: "#f0fdf4", ballColor: "#003d14"                   },
  2048: { bg: "#f97316", fg: "#fff7ed", ballColor: "#ffffff", seamDark: true  },
  4096: { bg: "#6d28d9", fg: "#ede9fe", ballColor: "#ddd6fe"                 },
};
const TILE_VALUES = [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096] as const;

function getTileCfg(v: number): TileCfg {
  return TILE_CFG[v] ?? { bg: "#7c3aed", fg: "#f5f3ff", ballColor: "#3b0080" };
}
function tileFontSize(v: number) {
  return v >= 1024 ? "0.8rem" : v >= 128 ? "0.95rem" : "1.1rem";
}

const emptyBoard = (): Board => Array.from({ length: 4 }, () => [0, 0, 0, 0]);
const addRandom = (b: Board): Board => {
  const empty: [number, number][] = [];
  b.forEach((row, r) => row.forEach((v, c) => { if (!v) empty.push([r, c]); }));
  if (!empty.length) return b;
  const [r, c] = empty[Math.floor(Math.random() * empty.length)];
  const nb = b.map(row => [...row]);
  nb[r][c] = Math.random() < 0.9 ? 2 : 4;
  return nb;
};
const initBoard = (): Board => addRandom(addRandom(emptyBoard()));
const slideLeft = (row: number[]): { row: number[]; score: number } => {
  const tiles = row.filter(Boolean);
  let score = 0;
  const out: number[] = [];
  let i = 0;
  while (i < tiles.length) {
    if (i + 1 < tiles.length && tiles[i] === tiles[i + 1]) {
      const v = tiles[i] * 2; out.push(v); score += v; i += 2;
    } else { out.push(tiles[i++]); }
  }
  while (out.length < 4) out.push(0);
  return { row: out, score };
};
const transpose = (b: Board): Board => b[0].map((_, c) => b.map(r => r[c]));
const flipH     = (b: Board): Board => b.map(r => [...r].reverse());
const applyDir = (board: Board, dir: Dir): { board: Board; score: number; moved: boolean } => {
  const pre =
    dir === "right" ? flipH(board) :
    dir === "up"    ? transpose(board) :
    dir === "down"  ? flipH(transpose(board)) : board;
  let totalScore = 0; let moved = false;
  const processed = pre.map(row => {
    const { row: newRow, score } = slideLeft(row);
    totalScore += score;
    if (newRow.some((v, i) => v !== row[i])) moved = true;
    return newRow;
  });
  const post =
    dir === "right" ? flipH(processed) :
    dir === "up"    ? transpose(processed) :
    dir === "down"  ? transpose(flipH(processed)) : processed;
  return { board: post, score: totalScore, moved };
};
const canMove = (b: Board): boolean => {
  for (let r = 0; r < 4; r++)
    for (let c = 0; c < 4; c++) {
      if (!b[r][c]) return true;
      if (c < 3 && b[r][c] === b[r][c + 1]) return true;
      if (r < 3 && b[r][c] === b[r + 1][c]) return true;
    }
  return false;
};
const hasWon = (b: Board): boolean => b.some(r => r.some(v => v >= 2048));

const BEST_KEY = "mogilev-2048-best";
const GAME_KEY = "mogilev-2048-game";

interface SavedGame { board: Board; score: number; status: Status; continued: boolean }
function loadGame(): SavedGame | null {
  try {
    const raw = localStorage.getItem(GAME_KEY);
    if (raw) return JSON.parse(raw) as SavedGame;
  } catch { /* empty */ }
  return null;
}
function saveGame(g: SavedGame) { localStorage.setItem(GAME_KEY, JSON.stringify(g)); }

const saved = loadGame();
const board     = ref<Board>(saved?.board     ?? initBoard());
const score     = ref<number>(saved?.score    ?? 0);
const best      = ref<number>(Number(localStorage.getItem(BEST_KEY) || "0"));
const status    = ref<Status>(saved?.status   ?? "playing");
const continued = ref<boolean>(saved?.continued ?? false);
const boardRef  = ref<HTMLDivElement | null>(null);
const touchStart = ref<{ x: number; y: number } | null>(null);

watch([board, score, status, continued], () => {
  saveGame({ board: board.value, score: score.value, status: status.value, continued: continued.value });
});

function move(dir: Dir) {
  if (status.value !== "playing") return;
  const { board: newB, score: gained, moved } = applyDir(board.value, dir);
  if (!moved) return;
  const withTile = addRandom(newB);
  const newScore = score.value + gained;
  const newBest  = Math.max(best.value, newScore);
  board.value = withTile;
  score.value = newScore;
  if (newBest > best.value) {
    best.value = newBest;
    localStorage.setItem(BEST_KEY, String(newBest));
  }
  if (!continued.value && hasWon(withTile)) status.value = "won";
  else if (!canMove(withTile))              status.value = "lost";
}

function reset() {
  board.value = initBoard();
  score.value = 0;
  status.value = "playing";
  continued.value = false;
}

function handleKey(e: KeyboardEvent) {
  const map: Partial<Record<string, Dir>> = {
    ArrowLeft: "left", ArrowRight: "right",
    ArrowUp: "up",     ArrowDown: "down",
    a: "left", d: "right", w: "up", s: "down",
  };
  const dir = map[e.key];
  if (dir) { e.preventDefault(); move(dir); }
}

function prevent(e: TouchEvent) { e.preventDefault(); }

onMounted(() => {
  window.addEventListener("keydown", handleKey);
  boardRef.value?.addEventListener("touchmove", prevent, { passive: false });
});
onUnmounted(() => {
  window.removeEventListener("keydown", handleKey);
  boardRef.value?.removeEventListener("touchmove", prevent);
});

function onTouchStart(e: TouchEvent) {
  touchStart.value = { x: e.touches[0].clientX, y: e.touches[0].clientY };
}
function onTouchEnd(e: TouchEvent) {
  if (!touchStart.value) return;
  const dx = e.changedTouches[0].clientX - touchStart.value.x;
  const dy = e.changedTouches[0].clientY - touchStart.value.y;
  touchStart.value = null;
  if (Math.abs(dx) < 30 && Math.abs(dy) < 30) return;
  move(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : (dy > 0 ? "down" : "up"));
}
</script>
