import { useEffect, useRef, useState } from 'react';

const Constellation = () => {
  const canvasRef = useRef(null);
  const pointer = useRef({ x: -9999, y: -9999 });
  const [density, setDensity] = useState(110);
  const [linkDist, setLinkDist] = useState(140);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf;

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = canvas;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const nodes = Array.from({ length: density }, () => ({
      x: Math.random() * canvas.clientWidth,
      y: Math.random() * canvas.clientHeight,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
    }));

    const tick = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);

      const p = pointer.current;
      for (const n of nodes) {
        const dx = n.x - p.x;
        const dy = n.y - p.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 18000) {
          const f = (18000 - d2) / 18000;
          n.vx += (dx / Math.sqrt(d2 + 1)) * f * 0.6;
          n.vy += (dy / Math.sqrt(d2 + 1)) * f * 0.6;
        }
        n.vx *= 0.94;
        n.vy *= 0.94;
        n.x += n.vx + (Math.random() - 0.5) * 0.05;
        n.y += n.vy + (Math.random() - 0.5) * 0.05;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
        n.x = Math.max(0, Math.min(w, n.x));
        n.y = Math.max(0, Math.min(h, n.y));
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d < linkDist) {
            const alpha = (1 - d / linkDist) * 0.55;
            ctx.strokeStyle = `rgba(167, 139, 250, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      for (const n of nodes) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.beginPath();
        ctx.arc(n.x, n.y, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      pointer.current.x = e.clientX - r.left;
      pointer.current.y = e.clientY - r.top;
    };
    const onLeave = () => {
      pointer.current.x = -9999;
      pointer.current.y = -9999;
    };
    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseleave', onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('mouseleave', onLeave);
    };
  }, [density, linkDist]);

  return (
    <div className="relative w-full h-[70vh] rounded-2xl overflow-hidden border border-border bg-[#06060c]">
      <canvas ref={canvasRef} className="w-full h-full block cursor-crosshair" />
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-wrap items-center gap-3 px-4 py-2 rounded-full bg-black/50 backdrop-blur border border-white/10 text-xs text-white/80">
        <label className="flex items-center gap-2">
          nodes
          <input
            type="range"
            min="30"
            max="220"
            value={density}
            onChange={(e) => setDensity(parseInt(e.target.value, 10))}
            className="accent-accent w-24"
          />
        </label>
        <label className="flex items-center gap-2">
          link
          <input
            type="range"
            min="60"
            max="220"
            value={linkDist}
            onChange={(e) => setLinkDist(parseInt(e.target.value, 10))}
            className="accent-accent w-24"
          />
        </label>
      </div>
    </div>
  );
};

export default Constellation;
