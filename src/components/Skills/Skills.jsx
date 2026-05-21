import { motion } from 'framer-motion';
import {
  Code2,
  Database,
  Brain,
  Server,
  Terminal,
  Layers,
} from 'lucide-react';
import { skills, skillCategories } from '../../portfolio';

const ICONS = {
  Backend: Server,
  Frontend: Code2,
  'AI / ML': Brain,
  'DevOps & Infra': Terminal,
  Default: Layers,
};

const Skills = () => {
  if (!skills?.length) return null;

  const marqueeItems = [...skills, ...skills];

  return (
    <section id="skills" className="section">
      <div className="container-x">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <span className="section-eyebrow">Toolbox</span>
          <h2 className="section-title">Skills & Stack</h2>
          <p className="text-fg-muted max-w-xl">
            Day-to-day weapons. Comfortable across the stack — from event pipelines
            to LLM-powered features.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 mb-12">
          {skillCategories.map((cat, i) => {
            const Icon = ICONS[cat.name] || ICONS.Default;
            return (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="card p-6 group"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 border border-accent/20 text-accent group-hover:scale-110 transition-transform">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-lg font-semibold">{cat.name}</h3>
                </div>
                <ul className="flex flex-wrap gap-1.5">
                  {cat.items.map((s) => (
                    <li key={s} className="chip hover:border-accent/40 hover:text-fg transition-colors">
                      {s}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

        <div className="relative mask-fade-x overflow-hidden py-4">
          <div className="flex w-max gap-3 animate-marquee">
            {marqueeItems.map((s, i) => (
              <span
                key={`${s}-${i}`}
                className="chip border-border/60 text-fg-muted bg-bg-card/50 px-4 py-2 text-sm whitespace-nowrap"
              >
                <Database className="h-3 w-3 mr-2 inline text-accent" />
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
