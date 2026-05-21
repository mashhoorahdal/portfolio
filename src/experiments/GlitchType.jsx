import { useState } from 'react';

const GlitchType = () => {
  const [text, setText] = useState('GLITCH IN THE MACHINE');
  const [intensity, setIntensity] = useState(6);
  const [speed, setSpeed] = useState(2);

  const duration = `${(2.5 / speed).toFixed(2)}s`;

  return (
    <div className="space-y-6">
      <style>{`
        @keyframes glitch-r {
          0%, 100% { transform: translate(0); clip-path: inset(0 0 0 0); }
          20% { transform: translate(${intensity}px, -${intensity / 2}px); clip-path: inset(20% 0 60% 0); }
          40% { transform: translate(-${intensity}px, ${intensity / 2}px); clip-path: inset(40% 0 30% 0); }
          60% { transform: translate(${intensity / 2}px, ${intensity}px); clip-path: inset(10% 0 70% 0); }
          80% { transform: translate(-${intensity / 2}px, -${intensity}px); clip-path: inset(60% 0 10% 0); }
        }
        @keyframes glitch-b {
          0%, 100% { transform: translate(0); clip-path: inset(0 0 0 0); }
          20% { transform: translate(-${intensity}px, ${intensity / 2}px); clip-path: inset(50% 0 20% 0); }
          40% { transform: translate(${intensity}px, -${intensity / 2}px); clip-path: inset(10% 0 60% 0); }
          60% { transform: translate(-${intensity / 2}px, -${intensity}px); clip-path: inset(70% 0 5% 0); }
          80% { transform: translate(${intensity / 2}px, ${intensity}px); clip-path: inset(20% 0 50% 0); }
        }
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .glitch-stage { position: relative; }
        .glitch-stage .layer { position: absolute; inset: 0; }
        .glitch-stage .r { color: #ff2e6e; mix-blend-mode: screen; animation: glitch-r ${duration} infinite steps(2, end); }
        .glitch-stage .b { color: #2efff6; mix-blend-mode: screen; animation: glitch-b ${duration} infinite steps(2, end); }
        .glitch-scan::after {
          content: '';
          position: absolute; inset: 0;
          background: repeating-linear-gradient(
            to bottom,
            rgba(255,255,255,0.04) 0,
            rgba(255,255,255,0.04) 1px,
            transparent 1px,
            transparent 3px
          );
          pointer-events: none;
        }
        .glitch-sweep {
          position: absolute; inset: 0; pointer-events: none;
          background: linear-gradient(180deg, transparent 0%, rgba(167,139,250,0.18) 50%, transparent 100%);
          animation: scan 3.6s linear infinite;
        }
      `}</style>

      <div className="relative rounded-2xl overflow-hidden border border-border bg-black h-[42vh] flex items-center justify-center glitch-scan">
        <div className="glitch-sweep" />
        <div className="glitch-stage relative text-white font-display font-extrabold text-center leading-[0.9] px-6 tracking-tight"
          style={{ fontSize: 'clamp(2.4rem, 8vw, 6.5rem)' }}>
          <span className="layer r" aria-hidden="true">{text}</span>
          <span className="layer b" aria-hidden="true">{text}</span>
          <span className="relative">{text}</span>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <label className="block">
          <span className="text-xs text-fg-muted">text</span>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, 40))}
            className="mt-1 w-full px-3 py-2 rounded-lg bg-bg-card border border-border text-sm focus:outline-none focus:border-accent"
          />
        </label>
        <label className="block">
          <span className="text-xs text-fg-muted">intensity</span>
          <input
            type="range"
            min="1"
            max="20"
            value={intensity}
            onChange={(e) => setIntensity(parseInt(e.target.value, 10))}
            className="mt-3 w-full accent-accent"
          />
        </label>
        <label className="block">
          <span className="text-xs text-fg-muted">speed</span>
          <input
            type="range"
            min="0.5"
            max="6"
            step="0.1"
            value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
            className="mt-3 w-full accent-accent"
          />
        </label>
      </div>
    </div>
  );
};

export default GlitchType;
