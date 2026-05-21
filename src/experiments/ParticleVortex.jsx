import { useEffect, useRef, useState } from 'react';

const COUNT = 380;
const TWO_PI = Math.PI * 2;

const ParticleVortex = () => {
  const canvasRef = useRef(null);
  const pointer = useRef({ x: null, y: null, active: false });
  const [mode, setMode] = useState('attract'); // attract | repel | swirl
  const [trail, setTrail] = useState(0.12);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = canvas;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: COUNT }, () => ({
      x: Math.random() * canvas.clientWidth,
      y: Math.random() * canvas.clientHeight,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      hue: 250 + Math.random() * 80,
    }));

    const tick = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.fillStyle = `rgba(10, 10, 15, ${trail})`;
      ctx.fillRect(0, 0, w, h);

      const p = pointer.current;
      for (const part of particles) {
        if (p.active) {
          const dx = p.x - part.x;
          const dy = p.y - part.y;
          const dist2 = dx * dx + dy * dy + 0.0001;
          const force = 1400 / dist2;
          if (mode === 'attract') {
            part.vx += (dx / Math.sqrt(dist2)) * force * 0.04;
            part.vy += (dy / Math.sqrt(dist2)) * force * 0.04;
          } else if (mode === 'repel') {
            part.vx -= (dx / Math.sqrt(dist2)) * force * 0.04;
            part.vy -= (dy / Math.sqrt(dist2)) * force * 0.04;
          } else {
            const d = Math.sqrt(dist2);
            part.vx += (-dy / d) * force * 0.02;
            part.vy += (dx / d) * force * 0.02;
          }
        }
        part.vx *= 0.96;
        part.vy *= 0.96;
        part.x += part.vx;
        part.y += part.vy;
        if (part.x < 0) part.x += w;
        if (part.x > w) part.x -= w;
        if (part.y < 0) part.y += h;
        if (part.y > h) part.y -= h;
        const speed = Math.min(8, Math.hypot(part.vx, part.vy));
        ctx.fillStyle = `hsla(${part.hue + speed * 12}, 90%, ${55 + speed * 3}%, 0.85)`;
        ctx.beginPath();
        ctx.arc(part.x, part.y, 1.3 + speed * 0.25, 0, TWO_PI);
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      pointer.current.x = e.clientX - rect.left;
      pointer.current.y = e.clientY - rect.top;
      pointer.current.active = true;
    };
    const onLeave = () => {
      pointer.current.active = false;
    };
    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseleave', onLeave);
    canvas.addEventListener('touchmove', (e) => {
      const t = e.touches[0];
      if (t) onMove({ clientX: t.clientX, clientY: t.clientY });
    });
    canvas.addEventListener('touchend', onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('mouseleave', onLeave);
    };
  }, [mode, trail]);

  return (
    <div className="relative w-full h-[70vh] rounded-2xl overflow-hidden border border-border bg-black">
      <canvas ref={canvasRef} className="w-full h-full block cursor-crosshair" />
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-wrap items-center gap-2 px-3 py-2 rounded-full bg-black/50 backdrop-blur border border-white/10">
        {['attract', 'repel', 'swirl'].map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition ${
              mode === m ? 'bg-accent text-white' : 'text-white/70 hover:text-white'
            }`}
          >
            {m}
          </button>
        ))}
        <span className="text-white/40 text-xs px-2">trail</span>
        <input
          type="range"
          min="0.02"
          max="0.4"
          step="0.01"
          value={trail}
          onChange={(e) => setTrail(parseFloat(e.target.value))}
          className="accent-accent w-24"
        />
      </div>
    </div>
  );
};

export default ParticleVortex;
