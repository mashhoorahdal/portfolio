import { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun, Menu, X, FlaskConical } from 'lucide-react';
import { ThemeContext } from '../../contexts/theme';
import { projects, skills, contact, experiences } from '../../portfolio';
import Logo from '../icons/Logo';

const SECTIONS = [
  { id: 'projects', label: 'Projects', show: () => projects.length },
  { id: 'timeline', label: 'Experience', show: () => experiences?.length },
  { id: 'skills', label: 'Skills', show: () => skills.length },
  { id: 'contact', label: 'Contact', show: () => contact.email },
];

const Navbar = () => {
  const [{ themeName, toggleTheme }] = useContext(ThemeContext);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const onHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!onHome) {
      setActive('');
      return;
    }
    const ids = SECTIONS.filter((s) => s.show()).map((s) => s.id);
    const observers = ids
      .map((id) => {
        const el = document.getElementById(id);
        if (!el) return null;
        const obs = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) setActive(id);
          },
          { rootMargin: '-40% 0px -55% 0px' }
        );
        obs.observe(el);
        return obs;
      })
      .filter(Boolean);
    return () => observers.forEach((o) => o.disconnect());
  }, [onHome, location.pathname]);

  useEffect(() => {
    if (!onHome) return;
    if (!location.hash) return;
    const id = location.hash.slice(1);
    const el = document.getElementById(id);
    if (el) {
      setTimeout(() => {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 60);
    }
  }, [location.pathname, location.hash, onHome]);

  const sections = SECTIONS.filter((s) => s.show());

  const handleSection = (e, id) => {
    setOpen(false);
    if (onHome) return; // native anchor handler in App.jsx handles scroll
    e.preventDefault();
    navigate(`/#${id}`);
  };

  const linkClass = (isActive) =>
    `relative px-3 py-2 text-sm font-medium transition-colors ${
      isActive ? 'text-fg' : 'text-fg-muted hover:text-fg'
    }`;

  return (
    <motion.nav
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 inset-x-0 z-50 transition-all ${
        scrolled
          ? 'bg-bg/70 backdrop-blur-xl border-b border-border'
          : 'bg-transparent'
      }`}
    >
      <div className="container-x flex items-center justify-between h-16">
        <Link to="/" aria-label="Home" className="flex items-center">
          <Logo size={34} className="drop-shadow-[0_0_12px_rgb(var(--accent)/0.35)]" />
        </Link>

        <ul className="hidden md:flex items-center gap-1">
          {sections.map((s) => {
            const isActive = onHome && active === s.id;
            return (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  onClick={(e) => handleSection(e, s.id)}
                  className={linkClass(isActive)}
                >
                  {s.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 -z-10 rounded-full bg-bg-card border border-border"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </a>
              </li>
            );
          })}
          <li>
            <Link
              to="/lab"
              className={linkClass(location.pathname.startsWith('/lab'))}
            >
              <span className="inline-flex items-center gap-1.5">
                <FlaskConical className="h-3.5 w-3.5" />
                Lab
              </span>
              {location.pathname.startsWith('/lab') && (
                <motion.span
                  layoutId="nav-active"
                  className="absolute inset-0 -z-10 rounded-full bg-bg-card border border-border"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          </li>
        </ul>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-full text-fg-muted hover:text-accent hover:bg-bg-card transition-colors"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={themeName}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="inline-block"
              >
                {themeName === 'dark' ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </motion.span>
            </AnimatePresence>
          </button>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle navigation"
            className="md:hidden p-2 rounded-full text-fg-muted hover:text-accent hover:bg-bg-card transition-colors"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-border bg-bg/95 backdrop-blur-xl"
          >
            <ul className="container-x py-4 space-y-1">
              {sections.map((s) => {
                const isActive = onHome && active === s.id;
                return (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      onClick={(e) => handleSection(e, s.id)}
                      className={`block px-3 py-2.5 rounded-lg text-sm font-medium ${
                        isActive
                          ? 'text-fg bg-bg-card'
                          : 'text-fg-muted hover:text-fg hover:bg-bg-card/50'
                      }`}
                    >
                      {s.label}
                    </a>
                  </li>
                );
              })}
              <li>
                <Link
                  to="/lab"
                  onClick={() => setOpen(false)}
                  className={`block px-3 py-2.5 rounded-lg text-sm font-medium ${
                    location.pathname.startsWith('/lab')
                      ? 'text-fg bg-bg-card'
                      : 'text-fg-muted hover:text-fg hover:bg-bg-card/50'
                  }`}
                >
                  Lab
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
