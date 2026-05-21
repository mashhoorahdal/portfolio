import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { experiments, findExperiment } from '../experiments';
import NotFound from './NotFound';

const easeOut = [0.16, 1, 0.3, 1];

const wordReveal = {
  hidden: { y: '120%', opacity: 0, filter: 'blur(8px)' },
  show: (i = 0) => ({
    y: '0%',
    opacity: 1,
    filter: 'blur(0px)',
    transition: { delay: 0.15 + i * 0.05, duration: 0.9, ease: easeOut },
  }),
};

const SplitHeadline = ({ children }) => {
  const words = (children || '').split(' ');
  return (
    <span className="inline-block">
      {words.map((w, i) => (
        <span
          key={`${w}-${i}`}
          className="inline-block overflow-hidden align-bottom pb-[0.12em] mr-[0.22em]"
        >
          <motion.span
            className="inline-block"
            variants={wordReveal}
            custom={i}
            initial="hidden"
            animate="show"
          >
            {w}
          </motion.span>
        </span>
      ))}
    </span>
  );
};

const Experiment = () => {
  const { slug } = useParams();
  const ex = findExperiment(slug);
  if (!ex) return <NotFound />;

  const idx = experiments.findIndex((e) => e.slug === slug);
  const prev = experiments[(idx - 1 + experiments.length) % experiments.length];
  const next = experiments[(idx + 1) % experiments.length];
  const { Component } = ex;

  return (
    <section className="relative pt-28 pb-24 [perspective:1400px]">
      <div className="container-x max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: easeOut }}
          className="flex items-center justify-between gap-4 text-sm"
        >
          <Link
            to="/lab"
            className="group inline-flex items-center gap-1.5 text-fg-muted hover:text-fg transition"
          >
            <motion.span
              whileHover={{ x: -3 }}
              transition={{ type: 'spring', stiffness: 300, damping: 18 }}
              className="inline-flex"
            >
              <ArrowLeft className="h-4 w-4" />
            </motion.span>
            All experiments
          </Link>
          <motion.span
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-mono text-xs text-fg-subtle"
          >
            0{idx + 1} / {String(experiments.length).padStart(2, '0')}
          </motion.span>
        </motion.div>

        <header className="mt-6 max-w-3xl">
          <h1 className="font-display font-extrabold tracking-tight text-3xl sm:text-5xl leading-[1.05]">
            <SplitHeadline>{ex.title}</SplitHeadline>
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 18, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.9, delay: 0.4, ease: easeOut }}
            className="mt-4 text-fg-muted text-lg"
          >
            {ex.blurb}
          </motion.p>
          <motion.div
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.05, delayChildren: 0.55 } } }}
            className="mt-5 flex flex-wrap gap-2"
          >
            {ex.tags.map((t) => (
              <motion.span
                key={t}
                variants={{
                  hidden: { opacity: 0, y: 8, scale: 0.9 },
                  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: easeOut } },
                }}
                className="px-2.5 py-0.5 rounded-md bg-bg-card border border-border text-[11px] uppercase tracking-wider text-fg-muted font-mono"
              >
                {t}
              </motion.span>
            ))}
          </motion.div>
        </header>

        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 1, delay: 0.6, ease: easeOut }}
          className="mt-10"
        >
          <Component />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          variants={{ show: { transition: { staggerChildren: 0.1 } } }}
          className="mt-16 grid sm:grid-cols-2 gap-4"
        >
          {[
            { dir: 'prev', target: prev, icon: <ArrowLeft className="h-3.5 w-3.5" />, label: 'Previous', align: 'left' },
            { dir: 'next', target: next, icon: <ArrowRight className="h-3.5 w-3.5" />, label: 'Next', align: 'right' },
          ].map((n) => (
            <motion.div
              key={n.dir}
              variants={{
                hidden: { opacity: 0, y: 24, filter: 'blur(8px)' },
                show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease: easeOut } },
              }}
            >
              <Link
                to={`/lab/${n.target.slug}`}
                className={`group block rounded-xl border border-border bg-bg-card p-5 hover:border-border-strong transition ${n.align === 'right' ? 'text-right' : ''}`}
              >
                <div className={`flex items-center gap-2 text-xs text-fg-subtle font-mono ${n.align === 'right' ? 'justify-end' : ''}`}>
                  {n.align === 'left' && n.icon}
                  {n.label}
                  {n.align === 'right' && n.icon}
                </div>
                <div className="mt-2 font-display text-xl font-semibold group-hover:text-accent transition">
                  {n.target.title}
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Experiment;
