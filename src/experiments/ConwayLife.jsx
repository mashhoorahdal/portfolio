import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Play, Pause, Shuffle, Eraser } from 'lucide-react';

const COLS = 80;
const ROWS = 48;

const emptyGrid = () =>
  Array.from({ length: ROWS }, () => new Uint8Array(COLS));

const randomGrid = () => {
  const g = emptyGrid();
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      g[y][x] = Math.random() < 0.22 ? 1 : 0;
    }
  }
  return g;
};

const PRESETS = {
  glider: [[0, 1], [1, 2], [2, 0], [2, 1], [2, 2]],
  pulsar: [
    [2,4],[2,5],[2,6],[2,10],[2,11],[2,12],
    [4,2],[5,2],[6,2],[4,7],[5,7],[6,7],[4,9],[5,9],[6,9],[4,14],[5,14],[6,14],
    [7,4],[7,5],[7,6],[7,10],[7,11],[7,12],
    [9,4],[9,5],[9,6],[9,10],[9,11],[9,12],
    [10,2],[11,2],[12,2],[10,7],[11,7],[12,7],[10,9],[11,9],[12,9],[10,14],[11,14],[12,14],
    [14,4],[14,5],[14,6],[14,10],[14,11],[14,12],
  ],
  gosper: [
    [5,1],[5,2],[6,1],[6,2],
    [5,11],[6,11],[7,11],[4,12],[8,12],[3,13],[9,13],[3,14],[9,14],
    [6,15],[4,16],[8,16],[5,17],[6,17],[7,17],[6,18],
    [3,21],[4,21],[5,21],[3,22],[4,22],[5,22],[2,23],[6,23],
    [1,25],[2,25],[6,25],[7,25],
    [3,35],[4,35],[3,36],[4,36],
  ],
};

const placePreset = (preset, offsetY = 4, offsetX = 4) => {
  const g = emptyGrid();
  for (const [y, x] of preset) {
    const yy = (y + offsetY) % ROWS;
    const xx = (x + offsetX) % COLS;
    g[yy][xx] = 1;
  }
  return g;
};

const ConwayLife = () => {
  const canvasRef = useRef(null);
  const gridRef = useRef(randomGrid());
  const [running, setRunning] = useState(true);
  const [speed, setSpeed] = useState(10);
  const [gen, setGen] = useState(0);
  const painting = useRef({ active: false, value: 1 });

  const cellSize = useMemo(() => 12, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = COLS * cellSize;
    const h = ROWS * cellSize;
    if (canvas.width !== w * dpr) {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    ctx.fillStyle = '#08080f';
    ctx.fillRect(0, 0, w, h);
    const g = gridRef.current;
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        if (g[y][x]) {
          const hue = 250 + ((x + y) % 60);
          ctx.fillStyle = `hsl(${hue}, 90%, 65%)`;
          ctx.fillRect(x * cellSize + 1, y * cellSize + 1, cellSize - 2, cellSize - 2);
        }
      }
    }
  }, [cellSize]);

  const step = useCallback(() => {
    const g = gridRef.current;
    const next = emptyGrid();
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        let n = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue;
            const yy = (y + dy + ROWS) % ROWS;
            const xx = (x + dx + COLS) % COLS;
            n += g[yy][xx];
          }
        }
        const alive = g[y][x] === 1;
        next[y][x] = alive ? (n === 2 || n === 3 ? 1 : 0) : n === 3 ? 1 : 0;
      }
    }
    gridRef.current = next;
    setGen((v) => v + 1);
  }, []);

  useEffect(() => {
    draw();
  });

  useEffect(() => {
    if (!running) return;
    const intervalMs = Math.max(20, 600 / speed);
    const id = setInterval(() => {
      step();
    }, intervalMs);
    return () => clearInterval(id);
  }, [running, speed, step]);

  const cellAt = (e) => {
    const canvas = canvasRef.current;
    const r = canvas.getBoundingClientRect();
    const scaleX = (COLS * cellSize) / r.width;
    const scaleY = (ROWS * cellSize) / r.height;
    const x = Math.floor(((e.clientX - r.left) * scaleX) / cellSize);
    const y = Math.floor(((e.clientY - r.top) * scaleY) / cellSize);
    return { x, y };
  };

  const onPointerDown = (e) => {
    const { x, y } = cellAt(e);
    if (x < 0 || y < 0 || x >= COLS || y >= ROWS) return;
    const value = gridRef.current[y][x] ? 0 : 1;
    painting.current = { active: true, value };
    gridRef.current[y][x] = value;
    draw();
  };
  const onPointerMove = (e) => {
    if (!painting.current.active) return;
    const { x, y } = cellAt(e);
    if (x < 0 || y < 0 || x >= COLS || y >= ROWS) return;
    gridRef.current[y][x] = painting.current.value;
    draw();
  };
  const onPointerUp = () => {
    painting.current.active = false;
  };

  const loadPreset = (name) => {
    gridRef.current = placePreset(PRESETS[name], 6, 8);
    setGen(0);
    draw();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setRunning((v) => !v)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent text-white text-sm font-medium hover:bg-accent-hover transition"
        >
          {running ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          {running ? 'Pause' : 'Play'}
        </button>
        <button
          type="button"
          onClick={step}
          className="px-3 py-1.5 rounded-full border border-border text-sm hover:bg-bg-card transition"
        >
          Step
        </button>
        <button
          type="button"
          onClick={() => {
            gridRef.current = randomGrid();
            setGen(0);
            draw();
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-sm hover:bg-bg-card transition"
        >
          <Shuffle className="h-3.5 w-3.5" /> Random
        </button>
        <button
          type="button"
          onClick={() => {
            gridRef.current = emptyGrid();
            setGen(0);
            draw();
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-sm hover:bg-bg-card transition"
        >
          <Eraser className="h-3.5 w-3.5" /> Clear
        </button>
        <div className="flex items-center gap-2 ml-2">
          {Object.keys(PRESETS).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => loadPreset(p)}
              className="px-2.5 py-1 rounded-md border border-border text-xs text-fg-muted hover:text-fg hover:bg-bg-card transition"
            >
              {p}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 ml-auto text-xs text-fg-muted">
          speed
          <input
            type="range"
            min="1"
            max="30"
            value={speed}
            onChange={(e) => setSpeed(parseInt(e.target.value, 10))}
            className="accent-accent w-28"
          />
        </label>
        <span className="text-xs text-fg-muted font-mono">gen {gen}</span>
      </div>
      <div className="rounded-2xl overflow-hidden border border-border bg-[#08080f]">
        <canvas
          ref={canvasRef}
          onMouseDown={onPointerDown}
          onMouseMove={onPointerMove}
          onMouseUp={onPointerUp}
          onMouseLeave={onPointerUp}
          className="w-full block touch-none cursor-crosshair"
          style={{ aspectRatio: `${COLS} / ${ROWS}` }}
        />
      </div>
      <p className="text-xs text-fg-muted">
        Click & drag cells to paint. B3/S23 rules, toroidal grid.
      </p>
    </div>
  );
};

export default ConwayLife;
