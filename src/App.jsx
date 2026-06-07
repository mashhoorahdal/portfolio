import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import CustomCursor from './components/CustomCursor/CustomCursor';
import BackgroundFX from './components/BackgroundFX/BackgroundFX';

const App = () => {
  const location = useLocation();

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      lerp: 0.1,
    });

    let rafId;
    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    const onAnchorClick = (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      const id = href.slice(1);
      const target = id === 'top' ? 0 : document.getElementById(id);
      if (target === null) return;
      e.preventDefault();
      lenis.scrollTo(target === 0 ? 0 : target, { offset: -64 });
    };
    document.addEventListener('click', onAnchorClick);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener('click', onAnchorClick);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    if (location.hash) return;
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname, location.hash]);

  // Fire a GA4 page_view on every route change (SPA — no full reloads).
  useEffect(() => {
    if (!window.gtag) return;
    window.gtag('event', 'page_view', {
      page_path: location.pathname + location.search,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [location.pathname, location.search]);

  // Auto-track clicks on any link or button — one delegated listener,
  // no per-element tagging. Sends a GA4 "click" event with a readable label.
  useEffect(() => {
    const onClick = (e) => {
      if (!window.gtag) return;
      const el = e.target.closest('a, button, [role="button"]');
      if (!el) return;

      const href = el.getAttribute('href') || undefined;
      const label =
        el.getAttribute('aria-label') ||
        el.textContent?.trim().slice(0, 100) ||
        href ||
        el.id ||
        'unknown';

      window.gtag('event', 'click', {
        element: el.tagName.toLowerCase(),
        link_text: label,
        link_url: href,
        page_path: location.pathname,
      });
    };

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [location.pathname]);

  return (
    <div id="top" className="relative min-h-screen overflow-x-hidden">
      <BackgroundFX />
      <Navbar />
      <main className="relative z-10">
        <Outlet />
      </main>
      <Footer />
      <ScrollToTop />
      <CustomCursor />
    </div>
  );
};

export default App;
