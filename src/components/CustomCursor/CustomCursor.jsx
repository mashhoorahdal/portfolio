import { useEffect, useRef, useState } from 'react';

const isInteractive = (el) => {
  if (!el || typeof el.closest !== 'function') return false;
  return !!(
    el.closest('a') ||
    el.closest('button') ||
    el.closest('[role="button"]') ||
    el.closest('input') ||
    el.closest('textarea') ||
    el.closest('[data-cursor="hover"]')
  );
};

const CustomCursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const target = useRef({ x: -100, y: -100 });
  const ring = useRef({ x: -100, y: -100 });
  const hoverRef = useRef(false);
  const lastElRef = useRef(null);
  const rafRef = useRef(0);
  const runningRef = useRef(false);
  const [coarse, setCoarse] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const set = () => setCoarse(!mq.matches);
    set();
    mq.addEventListener?.('change', set);
    return () => mq.removeEventListener?.('change', set);
  }, []);

  useEffect(() => {
    if (coarse) return;

    const dot = dotRef.current;
    const r = ringRef.current;
    if (!dot || !r) return;

    let visible = false;

    const show = (v) => {
      visible = v;
      dot.style.opacity = v ? '1' : '0';
      r.style.opacity = v ? '0.5' : '0';
    };

    const start = () => {
      if (runningRef.current) return;
      runningRef.current = true;
      rafRef.current = requestAnimationFrame(tick);
    };

    const onMove = (e) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
      lastElRef.current = e.target;
      if (!visible) show(true);
      start();
    };

    const onLeave = () => show(false);
    const onEnter = () => show(true);

    const onDown = () => {
      dot.dataset.down = '1';
      start();
    };
    const onUp = () => {
      delete dot.dataset.down;
      start();
    };

    const tick = () => {
      // Dot tracks the pointer 1:1; ring eases toward it.
      const tx = target.current.x;
      const ty = target.current.y;

      // Hover state resolved once per frame (not per mousemove) to avoid
      // redundant DOM walks when move events fire faster than paint.
      hoverRef.current = isInteractive(lastElRef.current);

      const pressed = dot.dataset.down === '1';
      const dotScale = pressed ? 0.7 : hoverRef.current ? 2.2 : 1;
      dot.style.transform = `translate3d(${tx}px, ${ty}px, 0) translate(-50%, -50%) scale(${dotScale})`;

      const dx = tx - ring.current.x;
      const dy = ty - ring.current.y;
      ring.current.x += dx * 0.2;
      ring.current.y += dy * 0.2;

      const scale = hoverRef.current ? 1.8 : 1;
      r.style.transform = `translate3d(${ring.current.x}px, ${ring.current.y}px, 0) translate(-50%, -50%) scale(${scale})`;

      // Pause the loop once the ring has caught up — no point repainting a
      // mix-blend-difference layer every frame while the pointer is idle.
      if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) {
        ring.current.x = tx;
        ring.current.y = ty;
        runningRef.current = false;
        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    document.documentElement.addEventListener('mouseleave', onLeave);
    document.documentElement.addEventListener('mouseenter', onEnter);
    start();

    return () => {
      runningRef.current = false;
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      document.documentElement.removeEventListener('mouseenter', onEnter);
    };
  }, [coarse]);

  if (coarse) return null;

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden
        style={{ opacity: 0, willChange: 'transform' }}
        className="pointer-events-none fixed left-0 top-0 z-[100] h-2 w-2 rounded-full bg-accent mix-blend-difference"
      />
      <div
        ref={ringRef}
        aria-hidden
        style={{ opacity: 0, willChange: 'transform' }}
        className="pointer-events-none fixed left-0 top-0 z-[99] h-9 w-9 rounded-full border border-accent/70 transition-[opacity] duration-200"
      />
    </>
  );
};

export default CustomCursor;
