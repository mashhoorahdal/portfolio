import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { projects } from '../../portfolio';
import ProjectCard from '../ProjectContainer/ProjectContainer';

const Projects = () => {
  const allStacks = useMemo(() => {
    const set = new Set();
    projects.forEach((p) => p.stack?.forEach((s) => set.add(s)));
    return ['All', ...Array.from(set)];
  }, []);

  const [filter, setFilter] = useState('All');

  const filtered = filter === 'All'
    ? projects
    : projects.filter((p) => p.stack?.includes(filter));

  if (!projects.length) return null;

  return (
    <section id="projects" className="section">
      <div className="container-x">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <span className="section-eyebrow">
            <Sparkles className="h-3 w-3" /> Selected work
          </span>
          <h2 className="section-title">Projects I&apos;ve shipped</h2>
          <p className="text-fg-muted max-w-xl">
            Full-stack apps, AI tools, and side experiments — a snapshot of things I&apos;ve built.
          </p>
        </motion.div>

        <div className="mb-8 flex flex-wrap gap-2">
          {allStacks.map((tag) => (
            <button
              key={tag}
              onClick={() => setFilter(tag)}
              className={`px-3 py-1.5 rounded-full text-xs font-mono border transition-all ${
                filter === tag
                  ? 'bg-accent text-bg border-accent'
                  : 'border-border text-fg-muted hover:border-accent/50 hover:text-fg'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 auto-rows-[minmax(220px,auto)] gap-4 md:gap-5">
          {filtered.map((project, i) => (
            <ProjectCard
              key={project.name}
              project={project}
              index={i}
              featured={i === 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
