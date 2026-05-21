import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Sliders,
  ChevronDown,
  Trees,
  Rocket,
  CloudRain,
  Building2,
  Waves,
  Flame,
} from 'lucide-react';

const SCALES = {
  minor: [0, 2, 3, 5, 7, 8, 10, 12, 14, 15],
  major: [0, 2, 4, 5, 7, 9, 11, 12, 14, 16],
  pentatonic: [0, 3, 5, 7, 10, 12, 15, 17, 19, 22],
  dorian: [0, 2, 3, 5, 7, 9, 10, 12, 14, 15],
  lydian: [0, 2, 4, 6, 7, 9, 11, 12, 14, 16],
  phrygian: [0, 1, 3, 5, 7, 8, 10, 12, 13, 15],
};

const ROOTS = [
  { label: 'C2', midi: 36 },
  { label: 'D2', midi: 38 },
  { label: 'E2', midi: 40 },
  { label: 'F2', midi: 41 },
  { label: 'G2', midi: 43 },
  { label: 'A2', midi: 45 },
];

const WAVES = ['sine', 'triangle', 'sawtooth'];

const MOODS = [
  {
    id: 'forest',
    label: 'Calm Forest',
    desc: 'Soft, airy, like morning light through leaves.',
    Icon: Trees,
    color: 'from-emerald-500/30 to-teal-500/10',
    settings: { scale: 'pentatonic', rootIdx: 0, wave: 'sine', density: 0.35, cutoff: 1400, reverb: 0.55 },
  },
  {
    id: 'space',
    label: 'Deep Space',
    desc: 'Slow, vast, drifting through nothing.',
    Icon: Rocket,
    color: 'from-indigo-500/30 to-violet-500/10',
    settings: { scale: 'minor', rootIdx: 0, wave: 'triangle', density: 0.22, cutoff: 700, reverb: 0.85 },
  },
  {
    id: 'rain',
    label: 'Rain Window',
    desc: 'Gentle, hushed, blanket-wrapped.',
    Icon: CloudRain,
    color: 'from-sky-500/30 to-blue-500/10',
    settings: { scale: 'dorian', rootIdx: 1, wave: 'sine', density: 0.5, cutoff: 1100, reverb: 0.7 },
  },
  {
    id: 'neon',
    label: 'Neon City',
    desc: 'Tense, dense, late-night buzz.',
    Icon: Building2,
    color: 'from-pink-500/30 to-fuchsia-500/10',
    settings: { scale: 'phrygian', rootIdx: 2, wave: 'sawtooth', density: 0.78, cutoff: 3200, reverb: 0.4 },
  },
  {
    id: 'ocean',
    label: 'Open Ocean',
    desc: 'Wide, warm, gently rolling.',
    Icon: Waves,
    color: 'from-cyan-500/30 to-teal-500/10',
    settings: { scale: 'lydian', rootIdx: 1, wave: 'sine', density: 0.4, cutoff: 1800, reverb: 0.75 },
  },
  {
    id: 'ember',
    label: 'Ember Glow',
    desc: 'Low, warm, slow-burning.',
    Icon: Flame,
    color: 'from-amber-500/30 to-rose-500/10',
    settings: { scale: 'minor', rootIdx: 0, wave: 'triangle', density: 0.45, cutoff: 900, reverb: 0.6 },
  },
];

const midiToFreq = (m) => 440 * Math.pow(2, (m - 69) / 12);

const GenerativeAmbient = () => {
  const ctxRef = useRef(null);
  const masterRef = useRef(null);
  const filterRef = useRef(null);
  const delayRef = useRef(null);
  const feedbackRef = useRef(null);
  const wetRef = useRef(null);
  const analyserRef = useRef(null);
  const intervalRef = useRef(null);
  const canvasRef = useRef(null);
  const pulses = useRef([]);
  const rafRef = useRef(null);

  const [running, setRunning] = useState(false);
  const [muted, setMuted] = useState(false);
  const [moodId, setMoodId] = useState('forest');
  const initial = MOODS[0].settings;
  const [scale, setScale] = useState(initial.scale);
  const [rootIdx, setRootIdx] = useState(initial.rootIdx);
  const [wave, setWave] = useState(initial.wave);
  const [density, setDensity] = useState(initial.density);
  const [cutoff, setCutoff] = useState(initial.cutoff);
  const [reverb, setReverb] = useState(initial.reverb);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const initAudio = useCallback(() => {
    if (ctxRef.current) return;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    const ctx = new Ctx();
    const master = ctx.createGain();
    master.gain.value = 0.4;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.Q.value = 0.7;
    filter.frequency.value = cutoff;

    const delay = ctx.createDelay(2.0);
    delay.delayTime.value = 0.42;
    const feedback = ctx.createGain();
    feedback.gain.value = 0.55;
    const wet = ctx.createGain();
    wet.gain.value = reverb;

    const analyser = ctx.createAnalyser();
    analyser.fftSize = 1024;

    filter.connect(master);
    filter.connect(delay);
    delay.connect(feedback);
    feedback.connect(delay);
    delay.connect(wet);
    wet.connect(master);
    master.connect(analyser);
    analyser.connect(ctx.destination);

    ctxRef.current = ctx;
    masterRef.current = master;
    filterRef.current = filter;
    delayRef.current = delay;
    feedbackRef.current = feedback;
    wetRef.current = wet;
    analyserRef.current = analyser;
  }, [cutoff, reverb]);

  const playNote = useCallback(() => {
    const ctx = ctxRef.current;
    const filter = filterRef.current;
    if (!ctx || !filter) return;
    const intervals = SCALES[scale];
    const rootMidi = ROOTS[rootIdx].midi;
    const semis = intervals[Math.floor(Math.random() * intervals.length)];
    const octave = Math.random() < 0.35 ? 12 : 0;
    const midi = rootMidi + semis + octave;
    const freq = midiToFreq(midi);

    const osc = ctx.createOscillator();
    osc.type = wave;
    osc.frequency.value = freq;
    const detune = ctx.createOscillator();
    detune.type = wave;
    detune.frequency.value = freq * 1.005;

    const gain = ctx.createGain();
    const peak = 0.18 + Math.random() * 0.12;
    const attack = 0.6 + Math.random() * 0.8;
    const release = 2.5 + Math.random() * 3.5;
    const now = ctx.currentTime;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(peak, now + attack);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + attack + release);

    osc.connect(gain);
    detune.connect(gain);
    gain.connect(filter);
    osc.start(now);
    detune.start(now);
    osc.stop(now + attack + release + 0.1);
    detune.stop(now + attack + release + 0.1);

    pulses.current.push({
      t0: performance.now(),
      life: (attack + release) * 1000,
      freq,
      hue: 220 + ((midi - rootMidi) * 14) % 140,
    });
    if (pulses.current.length > 60) pulses.current.shift();
  }, [scale, rootIdx, wave]);

  const scheduleLoop = useCallback(() => {
    clearInterval(intervalRef.current);
    const baseMs = 2400 - density * 2000;
    intervalRef.current = setInterval(() => {
      if (Math.random() < 0.85) playNote();
    }, baseMs);
  }, [density, playNote]);

  const start = useCallback(async () => {
    initAudio();
    if (ctxRef.current.state === 'suspended') await ctxRef.current.resume();
    setRunning(true);
    playNote();
    scheduleLoop();
  }, [initAudio, playNote, scheduleLoop]);

  const stop = useCallback(() => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    setRunning(false);
  }, []);

  const toggle = () => (running ? stop() : start());

  const pickMood = (mood) => {
    setMoodId(mood.id);
    setScale(mood.settings.scale);
    setRootIdx(mood.settings.rootIdx);
    setWave(mood.settings.wave);
    setDensity(mood.settings.density);
    setCutoff(mood.settings.cutoff);
    setReverb(mood.settings.reverb);
  };

  useEffect(() => {
    if (running) scheduleLoop();
  }, [density, running, scheduleLoop]);

  useEffect(() => {
    if (filterRef.current && ctxRef.current) {
      filterRef.current.frequency.setTargetAtTime(
        cutoff,
        ctxRef.current.currentTime,
        0.1
      );
    }
  }, [cutoff]);

  useEffect(() => {
    if (wetRef.current && ctxRef.current) {
      wetRef.current.gain.setTargetAtTime(reverb, ctxRef.current.currentTime, 0.1);
    }
  }, [reverb]);

  useEffect(() => {
    if (masterRef.current && ctxRef.current) {
      masterRef.current.gain.setTargetAtTime(
        muted ? 0 : 0.4,
        ctxRef.current.currentTime,
        0.05
      );
    }
  }, [muted]);

  useEffect(() => () => {
    clearInterval(intervalRef.current);
    cancelAnimationFrame(rafRef.current);
    if (ctxRef.current) ctxRef.current.close();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      const { clientWidth: w, clientHeight: h } = canvas;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.fillStyle = 'rgba(8, 8, 16, 0.18)';
      ctx.fillRect(0, 0, w, h);

      const analyser = analyserRef.current;
      if (analyser) {
        const buf = new Uint8Array(analyser.fftSize);
        analyser.getByteTimeDomainData(buf);
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(167, 139, 250, 0.55)';
        ctx.lineWidth = 1.4;
        for (let i = 0; i < buf.length; i++) {
          const x = (i / buf.length) * w;
          const y = (buf[i] / 255) * h;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      const now = performance.now();
      pulses.current = pulses.current.filter((p) => now - p.t0 < p.life);
      for (const p of pulses.current) {
        const age = (now - p.t0) / p.life;
        const r = 20 + age * (Math.min(w, h) * 0.45);
        const alpha = (1 - age) * 0.6;
        const cx = w * 0.5 + Math.sin(p.freq * 0.02) * w * 0.18;
        const cy = h * 0.5 + Math.cos(p.freq * 0.013) * h * 0.18;
        const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        grd.addColorStop(0, `hsla(${p.hue}, 90%, 65%, ${alpha * 0.5})`);
        grd.addColorStop(1, 'transparent');
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = `hsla(${p.hue}, 90%, 75%, ${alpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  const currentMood = MOODS.find((m) => m.id === moodId) || MOODS[0];

  return (
    <div className="space-y-6">
      {/* Step hint banner */}
      <div className="rounded-xl border border-border bg-bg-card/60 px-4 py-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm">
        <span className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-accent/15 text-accent text-[10px] font-bold">1</span>
          <span className="text-fg-muted">Pick a mood</span>
        </span>
        <span className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-accent/15 text-accent text-[10px] font-bold">2</span>
          <span className="text-fg-muted">Press play</span>
        </span>
        <span className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-accent/15 text-accent text-[10px] font-bold">3</span>
          <span className="text-fg-muted">Tweak it (optional)</span>
        </span>
        <span className="ml-auto text-xs text-fg-subtle font-mono hidden sm:inline">
          🎧 headphones recommended
        </span>
      </div>

      {/* Stage */}
      <div className="relative rounded-2xl overflow-hidden border border-border bg-[#06060c] h-[48vh] min-h-[340px]">
        <canvas ref={canvasRef} className="w-full h-full block" />

        {/* Now-playing label */}
        <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur border border-white/10 text-white/90 text-xs flex items-center gap-2">
          <currentMood.Icon className="h-3.5 w-3.5" />
          {currentMood.label}
          {running && (
            <span className="relative flex h-1.5 w-1.5 ml-1">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
          )}
        </div>

        {/* Top-right tools */}
        <div className="absolute top-3 right-3 flex gap-2">
          <button
            type="button"
            onClick={() => setMuted((v) => !v)}
            className="p-2 rounded-full bg-black/40 backdrop-blur border border-white/10 text-white/80 hover:text-white transition"
            aria-label={muted ? 'Unmute' : 'Mute'}
            title={muted ? 'Unmute' : 'Mute'}
          >
            {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
        </div>

        {/* Big primary CTA */}
        <div className="absolute inset-x-0 bottom-5 flex flex-col items-center gap-2 pointer-events-none">
          <button
            type="button"
            onClick={toggle}
            className="pointer-events-auto inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-accent text-white text-base font-semibold hover:bg-accent-hover transition shadow-[0_0_50px_rgb(var(--accent)/0.55)]"
          >
            {running ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            {running ? 'Pause' : 'Play'}
          </button>
          {!running && (
            <span className="text-white/50 text-xs">Click to start audio</span>
          )}
        </div>
      </div>

      {/* Moods */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display font-semibold text-base">Choose a mood</h3>
          <span className="text-xs text-fg-muted">tap to switch</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {MOODS.map((m) => {
            const Icon = m.Icon;
            const active = moodId === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => pickMood(m)}
                className={`group relative overflow-hidden rounded-xl border p-3.5 text-left transition ${
                  active
                    ? 'border-accent bg-bg-card shadow-[0_0_24px_rgb(var(--accent)/0.25)]'
                    : 'border-border bg-bg-card/60 hover:border-border-strong'
                }`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${m.color} opacity-${active ? '100' : '40'} group-hover:opacity-100 transition`} />
                <div className="relative">
                  <Icon className={`h-5 w-5 mb-2 ${active ? 'text-accent' : 'text-fg-muted group-hover:text-fg'}`} />
                  <div className={`font-medium text-sm ${active ? 'text-fg' : 'text-fg'}`}>
                    {m.label}
                  </div>
                  <div className="text-[11px] text-fg-muted mt-0.5 leading-snug">
                    {m.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Advanced toggle */}
      <div>
        <button
          type="button"
          onClick={() => setShowAdvanced((v) => !v)}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-bg-card text-sm text-fg-muted hover:text-fg transition"
        >
          <Sliders className="h-4 w-4" />
          {showAdvanced ? 'Hide tweaks' : 'Tweak the sound'}
          <ChevronDown className={`h-4 w-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
        </button>

        {showAdvanced && (
          <div className="mt-4 grid sm:grid-cols-3 gap-4">
            <div className="rounded-xl border border-border bg-bg-card p-4 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Pace</span>
                <span className="text-xs text-fg-muted font-mono">{Math.round(density * 100)}%</span>
              </div>
              <p className="text-xs text-fg-muted">How often new notes play.</p>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.01"
                value={density}
                onChange={(e) => setDensity(parseFloat(e.target.value))}
                className="w-full accent-accent mt-2"
              />
              <div className="flex justify-between text-[10px] text-fg-subtle">
                <span>sparse</span>
                <span>busy</span>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-bg-card p-4 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Brightness</span>
                <span className="text-xs text-fg-muted font-mono">{cutoff} Hz</span>
              </div>
              <p className="text-xs text-fg-muted">Warm & muffled or bright & open.</p>
              <input
                type="range"
                min="200"
                max="6000"
                step="50"
                value={cutoff}
                onChange={(e) => setCutoff(parseInt(e.target.value, 10))}
                className="w-full accent-accent mt-2"
              />
              <div className="flex justify-between text-[10px] text-fg-subtle">
                <span>warm</span>
                <span>bright</span>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-bg-card p-4 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Space</span>
                <span className="text-xs text-fg-muted font-mono">{Math.round(reverb * 100)}%</span>
              </div>
              <p className="text-xs text-fg-muted">Tight room or vast hall.</p>
              <input
                type="range"
                min="0"
                max="0.9"
                step="0.01"
                value={reverb}
                onChange={(e) => setReverb(parseFloat(e.target.value))}
                className="w-full accent-accent mt-2"
              />
              <div className="flex justify-between text-[10px] text-fg-subtle">
                <span>dry</span>
                <span>cavernous</span>
              </div>
            </div>

            <details className="sm:col-span-3 rounded-xl border border-border bg-bg-card p-4 group">
              <summary className="cursor-pointer text-sm font-medium text-fg-muted hover:text-fg flex items-center justify-between">
                <span>Music theory controls (scale, root, waveform)</span>
                <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
              </summary>
              <div className="mt-4 grid sm:grid-cols-3 gap-4">
                <div>
                  <div className="text-xs text-fg-muted mb-2">Scale (mood family)</div>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.keys(SCALES).map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setScale(s)}
                        className={`px-2.5 py-1 rounded-md text-xs font-medium transition ${
                          scale === s
                            ? 'bg-accent text-white'
                            : 'bg-bg border border-border text-fg-muted hover:text-fg'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-fg-muted mb-2">Root note (key)</div>
                  <div className="flex flex-wrap gap-1.5">
                    {ROOTS.map((r, i) => (
                      <button
                        key={r.label}
                        type="button"
                        onClick={() => setRootIdx(i)}
                        className={`px-2.5 py-1 rounded-md text-xs font-mono transition ${
                          rootIdx === i
                            ? 'bg-accent text-white'
                            : 'bg-bg border border-border text-fg-muted hover:text-fg'
                        }`}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-fg-muted mb-2">Waveform (timbre)</div>
                  <div className="flex gap-1.5">
                    {WAVES.map((w) => (
                      <button
                        key={w}
                        type="button"
                        onClick={() => setWave(w)}
                        className={`px-2.5 py-1 rounded-md text-xs font-medium transition ${
                          wave === w
                            ? 'bg-accent text-white'
                            : 'bg-bg border border-border text-fg-muted hover:text-fg'
                        }`}
                      >
                        {w}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </details>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerativeAmbient;
