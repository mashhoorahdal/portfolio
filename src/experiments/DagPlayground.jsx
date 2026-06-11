import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Play, Square, RotateCcw, Plus, Trash2, Link2 } from 'lucide-react';
import {
  STATUS,
  MAX_RETRIES,
  PRESETS,
  createRun,
  createsCycle,
  advance,
} from './dag/engine';

const NODE_W = 132;
const NODE_H = 44;
const CANVAS_W = 880;
const CANVAS_H = 360;

const STATUS_STYLE = {
  [STATUS.PENDING]: { fill: 'rgba(120,120,140,0.12)', stroke: 'rgba(140,140,160,0.5)', text: 'PENDING', dot: '#8c8ca0' },
  [STATUS.QUEUED]: { fill: 'rgba(56,189,248,0.12)', stroke: '#38bdf8', text: 'QUEUED', dot: '#38bdf8' },
  [STATUS.RUNNING]: { fill: 'rgba(251,191,36,0.14)', stroke: '#fbbf24', text: 'RUNNING', dot: '#fbbf24' },
  [STATUS.SUCCESS]: { fill: 'rgba(52,211,153,0.14)', stroke: '#34d399', text: 'SUCCESS', dot: '#34d399' },
  [STATUS.RETRYING]: { fill: 'rgba(251,146,60,0.14)', stroke: '#fb923c', text: 'RETRYING', dot: '#fb923c' },
  [STATUS.FAILED]: { fill: 'rgba(251,113,133,0.14)', stroke: '#fb7185', text: 'FAILED', dot: '#fb7185' },
  [STATUS.UPSTREAM_FAILED]: { fill: 'rgba(120,120,140,0.08)', stroke: 'rgba(140,140,160,0.35)', text: 'SKIPPED', dot: '#6b6b80' },
};

const EVENT_COLOR = {
  node_queued: 'text-sky-400',
  node_started: 'text-amber-400',
  node_succeeded: 'text-emerald-400',
  node_failed: 'text-rose-400',
  retry_scheduled: 'text-orange-400',
  node_dead: 'text-rose-500',
  node_skipped: 'text-fg-subtle',
  run_finished: 'text-accent',
};

const edgeKey = (e) => `${e.from}->${e.to}`;

const DagPlayground = () => {
  const [nodes, setNodes] = useState(PRESETS.etl.nodes);
  const [edges, setEdges] = useState(PRESETS.etl.edges);
  const [run, setRun] = useState(null);
  const [running, setRunning] = useState(false);
  const [events, setEvents] = useState([]);
  const [failureRate, setFailureRate] = useState(0.25);
  const [tickMs, setTickMs] = useState(450);
  const [connectFrom, setConnectFrom] = useState(null);
  const [selected, setSelected] = useState(null);
  const [notice, setNotice] = useState(null);

  const svgRef = useRef(null);
  const dragRef = useRef(null);
  const idRef = useRef(1);
  const logRef = useRef(null);

  const nodeById = useMemo(
    () => Object.fromEntries(nodes.map((n) => [n.id, n])),
    [nodes]
  );

  const statuses = run?.statuses ?? {};
  const statusOf = (id) => statuses[id] ?? STATUS.PENDING;

  const flash = (msg) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 2200);
  };

  const resetRun = useCallback(() => {
    setRunning(false);
    setRun(null);
    setEvents([]);
  }, []);

  const startRun = () => {
    if (!nodes.length) return;
    setRun(createRun(nodes));
    setEvents([{ tick: 0, type: 'run_started', nodeId: null, detail: `${nodes.length} nodes, failure rate ${Math.round(failureRate * 100)}%` }]);
    setRunning(true);
    setConnectFrom(null);
    setSelected(null);
  };

  useEffect(() => {
    if (!running || !run) return;
    const id = setInterval(() => {
      setRun((prev) => {
        if (!prev || prev.finished) return prev;
        const { state, events: newEvents } = advance(prev, nodes, edges, failureRate);
        if (newEvents.length) setEvents((ev) => [...ev, ...newEvents]);
        if (state.finished) setRunning(false);
        return state;
      });
    }, tickMs);
    return () => clearInterval(id);
  }, [running, run, nodes, edges, failureRate, tickMs]);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [events]);

  const svgPoint = (e) => {
    const r = svgRef.current.getBoundingClientRect();
    return {
      x: ((e.clientX - r.left) / r.width) * CANVAS_W,
      y: ((e.clientY - r.top) / r.height) * CANVAS_H,
    };
  };

  const onNodePointerDown = (e, node) => {
    e.stopPropagation();
    if (running) return;
    if (connectFrom) {
      if (connectFrom === node.id) {
        setConnectFrom(null);
        return;
      }
      if (edges.some((ed) => ed.from === connectFrom && ed.to === node.id)) {
        flash('Edge already exists');
      } else if (createsCycle(edges, connectFrom, node.id)) {
        flash('Rejected: would create a cycle');
      } else {
        setEdges((eds) => [...eds, { from: connectFrom, to: node.id }]);
        resetRun();
      }
      setConnectFrom(null);
      return;
    }
    setSelected(node.id);
    const p = svgPoint(e);
    dragRef.current = { id: node.id, dx: p.x - node.x, dy: p.y - node.y };
  };

  const onPointerMove = (e) => {
    if (!dragRef.current) return;
    const p = svgPoint(e);
    const { id, dx, dy } = dragRef.current;
    setNodes((ns) =>
      ns.map((n) =>
        n.id === id
          ? {
              ...n,
              x: Math.min(Math.max(p.x - dx, 10), CANVAS_W - NODE_W - 10),
              y: Math.min(Math.max(p.y - dy, 10), CANVAS_H - NODE_H - 10),
            }
          : n
      )
    );
  };

  const onPointerUp = () => {
    dragRef.current = null;
  };

  const addNode = () => {
    const id = `task_${idRef.current++}`;
    setNodes((ns) => [
      ...ns,
      {
        id,
        label: id,
        x: 40 + Math.random() * (CANVAS_W - NODE_W - 80),
        y: 30 + Math.random() * (CANVAS_H - NODE_H - 60),
      },
    ]);
    setSelected(id);
    resetRun();
  };

  const deleteSelected = () => {
    if (!selected) return;
    setNodes((ns) => ns.filter((n) => n.id !== selected));
    setEdges((eds) => eds.filter((e) => e.from !== selected && e.to !== selected));
    setSelected(null);
    setConnectFrom(null);
    resetRun();
  };

  const loadPreset = (key) => {
    setNodes(PRESETS[key].nodes);
    setEdges(PRESETS[key].edges);
    setSelected(null);
    setConnectFrom(null);
    resetRun();
  };

  const edgePath = (e) => {
    const a = nodeById[e.from];
    const b = nodeById[e.to];
    if (!a || !b) return '';
    const x1 = a.x + NODE_W;
    const y1 = a.y + NODE_H / 2;
    const x2 = b.x;
    const y2 = b.y + NODE_H / 2;
    const mx = (x1 + x2) / 2;
    return `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;
  };

  const edgeStroke = (e) => {
    const from = statusOf(e.from);
    if (from === STATUS.SUCCESS) return '#34d399';
    if (from === STATUS.FAILED) return '#fb7185';
    return 'rgba(140,140,160,0.4)';
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {!running ? (
          <button
            type="button"
            onClick={startRun}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent text-white text-sm font-medium hover:bg-accent-hover transition"
          >
            <Play className="h-3.5 w-3.5" /> Run DAG
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setRunning(false)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent text-white text-sm font-medium hover:bg-accent-hover transition"
          >
            <Square className="h-3.5 w-3.5" /> Stop
          </button>
        )}
        <button
          type="button"
          onClick={resetRun}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-sm hover:bg-bg-card transition"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Reset
        </button>
        <button
          type="button"
          onClick={addNode}
          disabled={running}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-sm hover:bg-bg-card transition disabled:opacity-40"
        >
          <Plus className="h-3.5 w-3.5" /> Node
        </button>
        <button
          type="button"
          onClick={() => setConnectFrom(selected ?? nodes[0]?.id ?? null)}
          disabled={running || !nodes.length}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm transition disabled:opacity-40 ${
            connectFrom
              ? 'border-accent text-accent'
              : 'border-border hover:bg-bg-card'
          }`}
        >
          <Link2 className="h-3.5 w-3.5" />
          {connectFrom ? `${connectFrom} → click target` : 'Connect'}
        </button>
        <button
          type="button"
          onClick={deleteSelected}
          disabled={running || !selected}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-sm hover:bg-bg-card transition disabled:opacity-40"
        >
          <Trash2 className="h-3.5 w-3.5" /> Delete
        </button>
        <div className="flex items-center gap-2 ml-2">
          {Object.entries(PRESETS).map(([key, p]) => (
            <button
              key={key}
              type="button"
              onClick={() => loadPreset(key)}
              disabled={running}
              className="px-2.5 py-1 rounded-md border border-border text-xs text-fg-muted hover:text-fg hover:bg-bg-card transition disabled:opacity-40"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-fg-muted">
        <label className="flex items-center gap-2">
          failure rate
          <input
            type="range"
            min="0"
            max="80"
            value={failureRate * 100}
            onChange={(e) => setFailureRate(parseInt(e.target.value, 10) / 100)}
            className="accent-accent w-28"
          />
          <span className="font-mono w-8">{Math.round(failureRate * 100)}%</span>
        </label>
        <label className="flex items-center gap-2">
          speed
          <input
            type="range"
            min="100"
            max="900"
            step="50"
            value={1000 - tickMs}
            onChange={(e) => setTickMs(1000 - parseInt(e.target.value, 10))}
            className="accent-accent w-28"
          />
        </label>
        <span className="font-mono">
          tick {run?.tick ?? 0} · max {MAX_RETRIES} retries, exponential backoff
        </span>
        {notice && <span className="text-rose-400 font-medium">{notice}</span>}
      </div>

      <div className="grid lg:grid-cols-[1fr_280px] gap-4">
        <div className="rounded-2xl overflow-hidden border border-border bg-[#08080f]">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
            className="w-full block select-none touch-none"
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
            onPointerDown={() => {
              setSelected(null);
              setConnectFrom(null);
            }}
          >
            <defs>
              <marker
                id="dag-arrow"
                viewBox="0 0 10 10"
                refX="9"
                refY="5"
                markerWidth="7"
                markerHeight="7"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(160,160,180,0.7)" />
              </marker>
            </defs>
            {edges.map((e) => (
              <path
                key={edgeKey(e)}
                d={edgePath(e)}
                fill="none"
                stroke={edgeStroke(e)}
                strokeWidth="1.5"
                markerEnd="url(#dag-arrow)"
              />
            ))}
            {nodes.map((n) => {
              const st = STATUS_STYLE[statusOf(n.id)];
              const isSelected = selected === n.id;
              const isConnectSrc = connectFrom === n.id;
              return (
                <g
                  key={n.id}
                  transform={`translate(${n.x}, ${n.y})`}
                  onPointerDown={(e) => onNodePointerDown(e, n)}
                  className={running ? '' : 'cursor-grab'}
                >
                  <rect
                    width={NODE_W}
                    height={NODE_H}
                    rx="10"
                    fill={st.fill}
                    stroke={isConnectSrc ? '#a78bfa' : isSelected ? '#c4b5fd' : st.stroke}
                    strokeWidth={isSelected || isConnectSrc ? 2 : 1.2}
                    strokeDasharray={statusOf(n.id) === STATUS.UPSTREAM_FAILED ? '4 3' : 'none'}
                  />
                  <circle cx="16" cy={NODE_H / 2} r="4" fill={st.dot}>
                    {statusOf(n.id) === STATUS.RUNNING && (
                      <animate
                        attributeName="opacity"
                        values="1;0.25;1"
                        dur="0.9s"
                        repeatCount="indefinite"
                      />
                    )}
                  </circle>
                  <text
                    x="30"
                    y={NODE_H / 2 - 3}
                    fill="rgba(235,235,245,0.92)"
                    fontSize="11.5"
                    fontFamily="JetBrains Mono, monospace"
                  >
                    {n.label.length > 15 ? `${n.label.slice(0, 14)}…` : n.label}
                  </text>
                  <text
                    x="30"
                    y={NODE_H / 2 + 11}
                    fill={st.dot}
                    fontSize="8.5"
                    fontFamily="JetBrains Mono, monospace"
                    letterSpacing="0.08em"
                  >
                    {st.text}
                    {run?.attempts[n.id] > 0 && statusOf(n.id) !== STATUS.SUCCESS
                      ? ` ·${run.attempts[n.id]}`
                      : ''}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <div className="rounded-2xl border border-border bg-bg-card flex flex-col min-h-[200px] max-h-[420px]">
          <div className="px-4 py-2.5 border-b border-border text-xs font-mono uppercase tracking-wider text-fg-muted">
            Event log
          </div>
          <div ref={logRef} className="flex-1 overflow-y-auto p-3 space-y-1 font-mono text-[11px]">
            {events.length === 0 && (
              <p className="text-fg-subtle">No events yet — hit Run DAG.</p>
            )}
            {events.map((ev, i) => (
              <div key={i} className="flex gap-2">
                <span className="text-fg-subtle shrink-0">t{String(ev.tick).padStart(2, '0')}</span>
                <span className={EVENT_COLOR[ev.type] ?? 'text-fg-muted'}>
                  {ev.type}
                </span>
                <span className="text-fg-muted truncate">
                  {ev.nodeId ?? ''}
                  {ev.detail ? ` — ${ev.detail}` : ''}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="text-xs text-fg-muted">
        Drag nodes to arrange. Select a node, hit Connect, click a target to add a
        dependency — cycles are rejected. Nodes run when all upstream dependencies
        succeed; failures retry with exponential backoff, then mark downstream tasks
        skipped. Modeled on the event-driven DAG orchestrator I work on professionally.
      </p>
    </div>
  );
};

export default DagPlayground;
