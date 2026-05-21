import { useEffect, useRef, useState } from 'react';

const isInteractive = (el) => {
  if (!el) return false;
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
  const rafRef = useRef(0);
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

    const onMove = (e) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
      if (!visible) show(true);
      hoverRef.current = isInteractive(e.target);
    };

    const onLeave = () => show(false);
    const onEnter = () => show(true);

    const onDown = () => {
      dot.style.setProperty('--s', '0.7');
    };
    const onUp = () => {
      dot.style.setProperty('--s', '1');
    };

    const tick = () => {
      // Dot snaps instantly (set via translate)
      dot.style.transform = `translate3d(${target.current.x}px, ${target.current.y}px, 0) translate(-50%, -50%) scale(var(--s,1))`;

      // Ring eases toward target
      const ease = 0.18;
      ring.current.x += (target.current.x - ring.current.x) * ease;
      ring.current.y += (target.current.y - ring.current.y) * ease;

      const scale = hoverRef.current ? 1.8 : 1;
      r.style.transform = `translate3d(${ring.current.x}px, ${ring.current.y}px, 0) translate(-50%, -50%) scale(${scale})`;

      const dotScale = hoverRef.current ? 2.2 : 1;
      dot.style.setProperty('--s', dotScale.toString());

      rafRef.current = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    document.documentElement.addEventListener('mouseleave', onLeave);
    document.documentElement.addEventListener('mouseenter', onEnter);
    rafRef.current = requestAnimationFrame(tick);

    return () => {
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
