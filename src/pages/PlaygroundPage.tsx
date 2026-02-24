import { useState, useEffect, useCallback, useRef } from "react";
import { RotateCcw } from "lucide-react";

/* ══════════════════════════════════════════════════════════
   Types
══════════════════════════════════════════════════════════ */
type Board  = number[][];
type Dir    = "left" | "right" | "up" | "down";
type Status = "playing" | "won" | "lost";

/* ══════════════════════════════════════════════════════════
   Tile visuals
   ballColor  — the volleyball fill colour for that level
   seamDark   — use dark seam lines (for very light balls)
══════════════════════════════════════════════════════════ */
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

const getTileCfg = (v: number): TileCfg =>
  TILE_CFG[v] ?? { bg: "#7c3aed", fg: "#f5f3ff", ballColor: "#3b0080" };

/* ══════════════════════════════════════════════════════════
   Volleyball SVG icon
══════════════════════════════════════════════════════════ */
function VolleyballIcon({ color, seamDark = false, size = 28 }: {
  color: string;
  seamDark?: boolean;
  size?: number;
}) {
  const seam = seamDark ? "rgba(80,48,0,0.30)" : "rgba(255,255,255,0.45)";
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      {/* Ball body */}
      <circle cx="16" cy="16" r="14" fill={color} />
      {/* Three seam curves that give the volleyball its look */}
      <path d="M16 2C23 7 23 25 16 30"  stroke={seam} strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <path d="M16 2C9 7 9 25 16 30"    stroke={seam} strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <path d="M2 11C8 4 24 4 30 11"    stroke={seam} strokeWidth="1.6" fill="none" strokeLinecap="round" />
      {/* Specular highlight for a 3-D look */}
      <ellipse cx="11" cy="9" rx="4" ry="2.5" fill="rgba(255,255,255,0.22)" transform="rotate(-20 11 9)" />
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════
   Game logic
══════════════════════════════════════════════════════════ */
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
      const v = tiles[i] * 2;
      out.push(v);
      score += v;
      i += 2;
    } else {
      out.push(tiles[i++]);
    }
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
    dir === "down"  ? flipH(transpose(board)) :
    board;

  let totalScore = 0;
  let moved = false;
  const processed = pre.map(row => {
    const { row: newRow, score } = slideLeft(row);
    totalScore += score;
    if (newRow.some((v, i) => v !== row[i])) moved = true;
    return newRow;
  });

  const post =
    dir === "right" ? flipH(processed) :
    dir === "up"    ? transpose(processed) :
    dir === "down"  ? transpose(flipH(processed)) :
    processed;

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

/* ══════════════════════════════════════════════════════════
   Component
══════════════════════════════════════════════════════════ */
const BEST_KEY = "mogilev-2048-best";
const GAME_KEY = "mogilev-2048-game";

interface SavedGame { board: Board; score: number; status: Status; continued: boolean }

const loadGame = (): SavedGame | null => {
  try {
    const raw = localStorage.getItem(GAME_KEY);
    if (raw) return JSON.parse(raw) as SavedGame;
  } catch {}
  return null;
};

const saveGame = (g: SavedGame) => localStorage.setItem(GAME_KEY, JSON.stringify(g));

const PlaygroundPage = () => {
  const [board,     setBoard]     = useState<Board>(() => loadGame()?.board    ?? initBoard());
  const [score,     setScore]     = useState(()    => loadGame()?.score        ?? 0);
  const [best,      setBest]      = useState(()    => Number(localStorage.getItem(BEST_KEY) || "0"));
  const [status,    setStatus]    = useState<Status>(() => loadGame()?.status  ?? "playing");
  const [continued, setContinued] = useState(()    => loadGame()?.continued   ?? false);
  const touchRef  = useRef<{ x: number; y: number } | null>(null);
  const boardRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = boardRef.current;
    if (!el) return;
    const prevent = (e: TouchEvent) => e.preventDefault();
    el.addEventListener("touchmove", prevent, { passive: false });
    return () => el.removeEventListener("touchmove", prevent);
  }, []);

  const reset = useCallback(() => {
    setBoard(initBoard());
    setScore(0);
    setStatus("playing");
    setContinued(false);
  }, []);

  const move = useCallback((dir: Dir) => {
    if (status !== "playing") return;
    const { board: newB, score: gained, moved } = applyDir(board, dir);
    if (!moved) return;
    const withTile = addRandom(newB);
    const newScore = score + gained;
    const newBest  = Math.max(best, newScore);
    setBoard(withTile);
    setScore(newScore);
    if (newBest > best) {
      setBest(newBest);
      localStorage.setItem(BEST_KEY, String(newBest));
    }
    if (!continued && hasWon(withTile)) setStatus("won");
    else if (!canMove(withTile))        setStatus("lost");
  }, [board, score, best, status, continued]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const map: Partial<Record<string, Dir>> = {
        ArrowLeft: "left", ArrowRight: "right",
        ArrowUp: "up",     ArrowDown: "down",
        a: "left", d: "right", w: "up", s: "down",
      };
      const dir = map[e.key];
      if (dir) { e.preventDefault(); move(dir); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [move]);

  // Persist game state on every change (board, score, status, continued).
  // Best score is saved separately in the move handler (already done).
  useEffect(() => {
    saveGame({ board, score, status, continued });
  }, [board, score, status, continued]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchRef.current) return;
    const dx = e.changedTouches[0].clientX - touchRef.current.x;
    const dy = e.changedTouches[0].clientY - touchRef.current.y;
    touchRef.current = null;
    if (Math.abs(dx) < 30 && Math.abs(dy) < 30) return;
    move(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : (dy > 0 ? "down" : "up"));
  };

  return (
    <div className="animate-fade-in flex flex-col items-center gap-4 select-none">

      {/* Header row */}
      <div className="w-full max-w-sm flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl tracking-wide flex items-center gap-2">
            2048 <VolleyballIcon color="#e87000" seamDark={false} size={24} />
          </h2>
          <p className="text-xs text-muted-foreground">Волейбольная версия</p>
        </div>
        <div className="flex items-center gap-2">
          <ScoreBox label="СЧЁТ"   value={score} />
          <ScoreBox label="РЕКОРД" value={best}  />
          <button
            onClick={reset}
            className="w-11 h-11 flex items-center justify-center rounded-lg bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-label="Новая игра"
          >
            <RotateCcw className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Board */}
      <div
        ref={boardRef}
        role="application"
        aria-label="Игровое поле 2048. Используйте стрелки или WASD для управления."
        className="relative w-full max-w-sm rounded-xl p-2.5 overflow-hidden"
        style={{ background: "#b5a99a" }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className="grid grid-cols-4 gap-2">
          {board.flat().map((val, idx) => {
            const cfg      = getTileCfg(val);
            const fontSize = val >= 1024 ? "0.8rem" : val >= 128 ? "0.95rem" : "1.1rem";
            return (
              <div
                key={idx}
                className="aspect-square rounded-lg flex flex-col items-center justify-center gap-0.5 transition-colors duration-75"
                style={{ background: cfg.bg }}
              >
                {val > 0 && (
                  <>
                    <VolleyballIcon color={cfg.ballColor} seamDark={cfg.seamDark} size={28} />
                    <span
                      className="font-display font-bold leading-none"
                      style={{ color: cfg.fg, fontSize }}
                    >
                      {val}
                    </span>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Game-over / win overlay */}
        {status !== "playing" && (
          <div role="alert" className="absolute inset-0 rounded-xl bg-black/60 flex flex-col items-center justify-center gap-3 p-4">
            {status === "won" ? (
              <>
                <VolleyballIcon color="#ffffff" seamDark size={56} />
                <p className="font-display text-3xl text-yellow-300 uppercase">Победа!</p>
                <p className="text-sm text-white/70">Ты собрал 2048!</p>
                <div className="flex gap-2 mt-1">
                  <button
                    onClick={() => { setContinued(true); setStatus("playing"); }}
                    className="px-4 py-3 rounded-lg bg-yellow-400 text-yellow-900 font-semibold text-sm hover:bg-yellow-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-600"
                  >
                    Продолжить
                  </button>
                  <button
                    onClick={reset}
                    className="px-4 py-3 rounded-lg bg-white/20 text-white font-semibold text-sm hover:bg-white/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    Заново
                  </button>
                </div>
              </>
            ) : (
              <>
                <VolleyballIcon color="#c8b490" seamDark size={56} />
                <p className="font-display text-3xl text-red-300 uppercase">Конец игры</p>
                <p className="text-sm text-white/70">Нет доступных ходов</p>
                <button
                  onClick={reset}
                  className="mt-1 px-4 py-3 rounded-lg bg-accent text-white font-semibold text-sm hover:bg-accent/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  Заново
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Controls hint */}
      <p className="text-xs text-muted-foreground text-center">
        Стрелки / WASD · свайп на телефоне
      </p>

      {/* Tile legend */}
      <div className="w-full max-w-sm">
        <p className="text-xs text-muted-foreground mb-2 text-center">Путь к чемпионству</p>
        <div className="grid grid-cols-4 gap-1.5">
          {([2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096] as const).map(v => {
            const cfg = getTileCfg(v);
            return (
              <div
                key={v}
                className="aspect-square rounded-md flex flex-col items-center justify-center text-center"
                style={{ background: cfg.bg }}
              >
                <VolleyballIcon color={cfg.ballColor} seamDark={cfg.seamDark} size={18} />
                <span
                  className="font-display font-bold leading-none"
                  style={{ color: cfg.fg, fontSize: "0.6rem" }}
                >
                  {v}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

function ScoreBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-secondary rounded-lg px-3 py-1 text-center min-w-[56px]">
      <div className="text-[10px] text-muted-foreground font-semibold tracking-wider">{label}</div>
      <div className="font-display text-lg font-bold leading-tight">{value}</div>
    </div>
  );
}

export default PlaygroundPage;
