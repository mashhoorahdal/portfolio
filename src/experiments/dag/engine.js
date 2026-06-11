// Pure simulation engine for the DAG playground. No React, no DOM —
// the component drives it with ticks and renders whatever comes back.

export const STATUS = {
  PENDING: 'pending',
  QUEUED: 'queued',
  RUNNING: 'running',
  SUCCESS: 'success',
  RETRYING: 'retrying',
  FAILED: 'failed',
  UPSTREAM_FAILED: 'upstream_failed',
};

export const MAX_RETRIES = 2;

export const upstreamOf = (edges, id) =>
  edges.filter((e) => e.to === id).map((e) => e.from);

export const downstreamOf = (edges, id) =>
  edges.filter((e) => e.from === id).map((e) => e.to);

// Would adding from→to create a cycle? (DFS from `to` looking for `from`)
export const createsCycle = (edges, from, to) => {
  if (from === to) return true;
  const stack = [to];
  const seen = new Set();
  while (stack.length) {
    const cur = stack.pop();
    if (cur === from) return true;
    if (seen.has(cur)) continue;
    seen.add(cur);
    stack.push(...downstreamOf(edges, cur));
  }
  return false;
};

export const createRun = (nodes) => ({
  tick: 0,
  finished: false,
  statuses: Object.fromEntries(nodes.map((n) => [n.id, STATUS.PENDING])),
  attempts: Object.fromEntries(nodes.map((n) => [n.id, 0])),
  // ticks remaining for running work / retry backoff
  timers: {},
});

const transitiveDownstream = (edges, id) => {
  const out = new Set();
  const stack = [...downstreamOf(edges, id)];
  while (stack.length) {
    const cur = stack.pop();
    if (out.has(cur)) continue;
    out.add(cur);
    stack.push(...downstreamOf(edges, cur));
  }
  return out;
};

// Advance one tick. Returns { state, events }. Events are
// { tick, type, nodeId, detail? } — rendered as the run's event log.
export const advance = (state, nodes, edges, failureRate, rng = Math.random) => {
  const statuses = { ...state.statuses };
  const attempts = { ...state.attempts };
  const timers = { ...state.timers };
  const tick = state.tick + 1;
  const events = [];
  const emit = (type, nodeId, detail) => events.push({ tick, type, nodeId, detail });

  for (const node of nodes) {
    const id = node.id;
    const status = statuses[id];

    if (status === STATUS.RUNNING) {
      timers[id] -= 1;
      if (timers[id] > 0) continue;
      delete timers[id];
      if (rng() < failureRate) {
        attempts[id] += 1;
        emit('node_failed', id, `attempt ${attempts[id]}`);
        if (attempts[id] <= MAX_RETRIES) {
          statuses[id] = STATUS.RETRYING;
          timers[id] = 2 ** attempts[id]; // exponential backoff
          emit('retry_scheduled', id, `backoff ${timers[id]} ticks`);
        } else {
          statuses[id] = STATUS.FAILED;
          emit('node_dead', id, 'retries exhausted');
          for (const downId of transitiveDownstream(edges, id)) {
            if (
              statuses[downId] === STATUS.PENDING ||
              statuses[downId] === STATUS.QUEUED
            ) {
              statuses[downId] = STATUS.UPSTREAM_FAILED;
              emit('node_skipped', downId, `upstream ${id} failed`);
            }
          }
        }
      } else {
        statuses[id] = STATUS.SUCCESS;
        emit('node_succeeded', id);
      }
    } else if (status === STATUS.RETRYING) {
      timers[id] -= 1;
      if (timers[id] <= 0) {
        delete timers[id];
        statuses[id] = STATUS.QUEUED;
        emit('node_queued', id, `retry ${attempts[id]}/${MAX_RETRIES}`);
      }
    } else if (status === STATUS.QUEUED) {
      statuses[id] = STATUS.RUNNING;
      timers[id] = 2 + Math.floor(rng() * 4);
      emit('node_started', id);
    } else if (status === STATUS.PENDING) {
      const deps = upstreamOf(edges, id);
      if (deps.every((d) => statuses[d] === STATUS.SUCCESS)) {
        statuses[id] = STATUS.QUEUED;
        emit('node_queued', id, deps.length ? 'deps satisfied' : 'no deps');
      }
    }
  }

  const active = Object.values(statuses).some(
    (s) => s === STATUS.QUEUED || s === STATUS.RUNNING || s === STATUS.RETRYING
  );
  const finished = !active;
  if (finished && !state.finished) {
    const failed = Object.values(statuses).some(
      (s) => s === STATUS.FAILED || s === STATUS.UPSTREAM_FAILED
    );
    emit('run_finished', null, failed ? 'with failures' : 'all succeeded');
  }

  return { state: { tick, finished, statuses, attempts, timers }, events };
};

export const PRESETS = {
  etl: {
    label: 'ETL pipeline',
    nodes: [
      { id: 'extract_api', label: 'extract_api', x: 80, y: 80 },
      { id: 'extract_db', label: 'extract_db', x: 80, y: 220 },
      { id: 'validate', label: 'validate', x: 280, y: 150 },
      { id: 'transform', label: 'transform', x: 460, y: 150 },
      { id: 'load_dw', label: 'load_warehouse', x: 640, y: 80 },
      { id: 'notify', label: 'notify', x: 640, y: 220 },
    ],
    edges: [
      { from: 'extract_api', to: 'validate' },
      { from: 'extract_db', to: 'validate' },
      { from: 'validate', to: 'transform' },
      { from: 'transform', to: 'load_dw' },
      { from: 'transform', to: 'notify' },
    ],
  },
  diamond: {
    label: 'Diamond',
    nodes: [
      { id: 'start', label: 'start', x: 80, y: 150 },
      { id: 'branch_a', label: 'branch_a', x: 320, y: 60 },
      { id: 'branch_b', label: 'branch_b', x: 320, y: 240 },
      { id: 'join', label: 'join', x: 560, y: 150 },
    ],
    edges: [
      { from: 'start', to: 'branch_a' },
      { from: 'start', to: 'branch_b' },
      { from: 'branch_a', to: 'join' },
      { from: 'branch_b', to: 'join' },
    ],
  },
  fanout: {
    label: 'Fan-out / fan-in',
    nodes: [
      { id: 'ingest', label: 'ingest', x: 80, y: 160 },
      { id: 'shard_1', label: 'shard_1', x: 320, y: 40 },
      { id: 'shard_2', label: 'shard_2', x: 320, y: 160 },
      { id: 'shard_3', label: 'shard_3', x: 320, y: 280 },
      { id: 'merge', label: 'merge', x: 560, y: 160 },
      { id: 'publish', label: 'publish', x: 740, y: 160 },
    ],
    edges: [
      { from: 'ingest', to: 'shard_1' },
      { from: 'ingest', to: 'shard_2' },
      { from: 'ingest', to: 'shard_3' },
      { from: 'shard_1', to: 'merge' },
      { from: 'shard_2', to: 'merge' },
      { from: 'shard_3', to: 'merge' },
      { from: 'merge', to: 'publish' },
    ],
  },
};
