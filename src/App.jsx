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
