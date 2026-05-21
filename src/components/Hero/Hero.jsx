import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Mail, FileText, MapPin } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../icons/Brand';
import { about, contact } from '../../portfolio';

const ROLES = [
  'Full Stack Developer',
  'AI Engineer',
  'Backend Architect',
  'Distributed Systems',
];

const Typewriter = () => {
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = ROLES[idx];
    const speed = deleting ? 40 : 80;
    const t = setTimeout(() => {
      if (!deleting) {
        const next = current.slice(0, text.length + 1);
        setText(next);
        if (next === current) {
          setTimeout(() => setDeleting(true), 1600);
        }
      } else {
        const next = current.slice(0, text.length - 1);
        setText(next);
        if (next === '') {
          setDeleting(false);
          setIdx((i) => (i + 1) % ROLES.length);
        }
      }
    }, speed);
    return () => clearTimeout(t);
  }, [text, deleting, idx]);

  return (
    <span className="font-mono text-accent">
      {text}
      <span className="ml-0.5 inline-block h-5 w-[2px] -mb-0.5 bg-accent animate-pulse" />
    </span>
  );
};

const Hero = () => {
  const name = about.name.split(' ');

  return (
    <section id="home" className="relative min-h-screen flex items-center pt-24 pb-16">
      <div className="container-x w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex items-center gap-2 mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <span className="text-xs font-mono text-fg-muted">
            Available for select engagements
          </span>
        </motion.div>

        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05]">
          {name.map((word, i) => (
            <span key={i} className="inline-block overflow-hidden mr-3 md:mr-5">
              <motion.span
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="inline-block"
              >
                {i === name.length - 1 ? (
                  <span className="text-gradient animate-gradient-shift">{word}</span>
                ) : (
                  word
                )}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-6 text-xl md:text-2xl text-fg-muted font-light"
        >
          <Typewriter />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.75 }}
          className="mt-8 max-w-2xl text-base md:text-lg text-fg-muted leading-relaxed"
        >
          2+ yrs building scalable SaaS platforms, AI systems, and high-performance backends.
          I work with <span className="text-fg">Django</span>, <span className="text-fg">FastAPI</span>,
          microservices, real-time pipelines, and end-to-end monitoring — with a focus on
          performance, reliability, and automation.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mt-10 flex flex-wrap items-center gap-3"
        >
          <a href="#contact" className="btn-primary group">
            Get in touch
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
          {about.resume && (
            <a href={about.resume} target="_blank" rel="noreferrer" className="btn-ghost group">
              <FileText className="h-4 w-4" />
              Resume
            </a>
          )}
          <div className="flex items-center gap-1 ml-2">
            {about.social?.github && (
              <a
                href={about.social.github}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="p-2.5 rounded-full text-fg-muted hover:text-accent hover:bg-bg-card transition-colors"
              >
                <GithubIcon className="h-5 w-5" />
              </a>
            )}
            {about.social?.linkedin && (
              <a
                href={about.social.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="p-2.5 rounded-full text-fg-muted hover:text-accent hover:bg-bg-card transition-colors"
              >
                <LinkedinIcon className="h-5 w-5" />
              </a>
            )}
            {contact?.email && (
              <a
                href={`mailto:${contact.email}`}
                aria-label="Email"
                className="p-2.5 rounded-full text-fg-muted hover:text-accent hover:bg-bg-card transition-colors"
              >
                <Mail className="h-5 w-5" />
              </a>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="mt-14 flex items-center gap-2 text-xs font-mono text-fg-subtle"
        >
          <MapPin className="h-3.5 w-3.5" />
          Kochi, India · GMT+5:30
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-fg-subtle"
      >
        <span className="text-[10px] font-mono uppercase tracking-[0.25em]">Scroll</span>
        <div className="h-10 w-px bg-gradient-to-b from-fg-subtle to-transparent" />
      </motion.div>
    </section>
  );
};

export default Hero;
