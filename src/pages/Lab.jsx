import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowUpRight, FlaskConical, Sparkles } from 'lucide-react';
import { experiments } from '../experiments';

const easeOut = [0.16, 1, 0.3, 1];

const wordReveal = {
  hidden: { y: '120%', opacity: 0, filter: 'blur(8px)' },
  show: (i = 0) => ({
    y: '0%',
    opacity: 1,
    filter: 'blur(0px)',
    transition: { delay: 0.15 + i * 0.06, duration: 0.9, ease: easeOut },
  }),
};

const SplitHeadline = ({ children, className = '' }) => {
  const words = children.split(' ');
  return (
    <span className={`inline-block ${className}`}>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className="inline-block overflow-hidden align-bottom pb-[0.1em] mr-[0.22em]"
        >
          <motion.span
            className="inline-block"
            variants={wordReveal}
            custom={i}
            initial="hidden"
            animate="show"
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
};

const TiltCard = ({ children, className = '' }) => {
  const ref = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), { stiffness: 140, damping: 14 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), { stiffness: 140, damping: 14 });
  const glareX = useTransform(mx, [-0.5, 0.5], ['0%', '100%']);
  const glareY = useTransform(my, [-0.5, 0.5], ['0%', '100%']);

  const onMove = (e) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d' }}
      className={className}
    >
      {children}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(280px circle at ${glareX.get?.() || '50%'} ${glareY.get?.() || '50%'}, rgba(255,255,255,0.08), transparent 60%)`,
        }}
      />
    </motion.div>
  );
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95, filter: 'blur(10px)' },
  show: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: { delay: 0.55 + i * 0.08, duration: 0.85, ease: easeOut },
  }),
};

const Lab = () => {
  return (
    <section className="relative pt-32 pb-24 [perspective:1400px]">
      <div className="container-x">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: -8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05, ease: easeOut }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-bg-card text-xs text-fg-muted"
        >
          <motion.span
            initial={{ rotate: -180, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 220, damping: 14, delay: 0.2 }}
            className="inline-flex"
          >
            <FlaskConical className="h-3.5 w-3.5 text-accent" />
          </motion.span>
          <span>Lab</span>
          <span className="text-fg-subtle">/ {experiments.length} experiments</span>
        </motion.div>

        <h1 className="mt-6 font-display font-extrabold tracking-tight text-4xl sm:text-5xl md:text-6xl leading-[1.05] max-w-3xl">
          <SplitHeadline>A playground of</SplitHeadline>
          <br />
          <span className="text-accent">
            <SplitHeadline>tiny machines.</SplitHeadline>
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.9, delay: 0.45, ease: easeOut }}
          className="mt-5 text-fg-muted text-lg max-w-2xl"
        >
          Self-contained interactive bits — particle physics, generative graphs, cellular
          automata, weird typography, drifting sound. Each one runs live in the browser. No
          build steps, no servers, code that does things when you touch it.
        </motion.p>

        <div className="mt-14 grid sm:grid-cols-2 gap-5 [perspective:1400px]">
          {experiments.map((ex, i) => (
            <motion.div
              key={ex.slug}
              variants={cardVariants}
              custom={i}
              initial="hidden"
              animate="show"
              className="[transform-style:preserve-3d]"
            >
              <TiltCard className="relative rounded-2xl">
                <Link
                  to={`/lab/${ex.slug}`}
                  className="group relative block overflow-hidden rounded-2xl border border-border bg-bg-card hover:border-border-strong transition-colors"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${ex.accent} opacity-60 group-hover:opacity-100 transition-opacity duration-700`} />
                  <motion.div
                    aria-hidden
                    className="absolute -top-20 -right-20 h-56 w-56 rounded-full bg-accent/20 blur-3xl"
                    animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0.9, 0.6] }}
                    transition={{ duration: 6 + i, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  <div className="relative p-6 sm:p-8 min-h-[260px] flex flex-col [transform:translateZ(40px)]">
                    <div className="flex items-start justify-between gap-4">
                      <span className="font-mono text-xs text-fg-subtle">
                        0{i + 1} / {String(experiments.length).padStart(2, '0')}
                      </span>
                      <motion.span
                        whileHover={{ x: 4, y: -4, rotate: 12 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                        className="inline-flex"
                      >
                        <ArrowUpRight className="h-5 w-5 text-fg-muted group-hover:text-accent transition" />
                      </motion.span>
                    </div>
                    <h2 className="mt-6 font-display text-2xl sm:text-3xl font-bold tracking-tight">
                      {ex.title}
                    </h2>
                    <p className="mt-3 text-fg-muted text-sm leading-relaxed">{ex.blurb}</p>
                    <div className="mt-auto pt-6 flex flex-wrap gap-1.5">
                      {ex.tags.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 rounded-md bg-bg/60 border border-border text-[10px] uppercase tracking-wider text-fg-muted font-mono"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </Link>
              </TiltCard>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: easeOut }}
          className="mt-16 flex items-center gap-3 text-fg-muted text-sm"
        >
          <motion.span
            animate={{ rotate: [0, 18, -10, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            className="inline-flex"
          >
            <Sparkles className="h-4 w-4 text-accent" />
          </motion.span>
          More experiments land here as I build them. Got an idea?{' '}
          <Link to="/#contact" className="text-accent hover:underline">
            Send it over.
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Lab;
