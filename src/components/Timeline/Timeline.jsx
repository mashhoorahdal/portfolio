import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Briefcase, GraduationCap, MapPin } from 'lucide-react';
import { experiences } from '../../portfolio';

const isEducation = (title) =>
  /bachelor|master|phd|engineering|school|college|university|b\.?\s*sc/i.test(title);

const BulletList = ({ items }) => (
  <ul className="mt-3 space-y-1.5">
    {items.map((b, i) => (
      <li
        key={i}
        className="text-sm text-fg-muted leading-relaxed pl-4 relative before:content-['▹'] before:absolute before:left-0 before:text-accent/70"
      >
        {b}
      </li>
    ))}
  </ul>
);

const TechPills = ({ items }) => (
  <div className="mt-3 flex flex-wrap gap-1.5">
    {items.map((t) => (
      <span
        key={t}
        className="text-[10px] md:text-xs font-mono px-2 py-0.5 rounded-full border border-accent/20 bg-accent/5 text-accent/90"
      >
        {t}
      </span>
    ))}
  </div>
);

const TimelineNode = ({ exp, index }) => {
  const Icon = isEducation(exp.title) ? GraduationCap : Briefcase;
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="relative pl-12 md:pl-16 pb-12 last:pb-0"
    >
      <div className="absolute left-0 top-1.5 flex h-9 w-9 md:h-11 md:w-11 items-center justify-center rounded-full border border-accent/30 bg-bg-card backdrop-blur-sm shadow-glow">
        <Icon className="h-4 w-4 md:h-5 md:w-5 text-accent" />
      </div>

      <div className="card p-5 md:p-6">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="text-xs font-mono text-accent">{exp.date}</span>
          {exp.location && (
            <>
              <span className="text-fg-subtle">·</span>
              <span className="text-xs font-mono text-fg-muted inline-flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {exp.location}
              </span>
            </>
          )}
        </div>
        <h3 className="font-display text-lg md:text-xl font-semibold">{exp.title}</h3>
        <p className="text-sm text-accent/80 mt-0.5">{exp.company}</p>

        {exp.summary && (
          <p className="text-sm text-fg-muted mt-3 leading-relaxed">{exp.summary}</p>
        )}

        {exp.description && !exp.summary && (
          <p className="text-sm text-fg-muted mt-3 leading-relaxed">{exp.description}</p>
        )}

        {exp.bullets?.length > 0 && <BulletList items={exp.bullets} />}
        {exp.tech?.length > 0 && <TechPills items={exp.tech} />}

        {exp.projects?.length > 0 && (
          <div className="mt-5 space-y-4 border-l border-border pl-4">
            {exp.projects.map((p) => (
              <div key={p.name}>
                <h4 className="font-display text-sm md:text-base font-semibold text-fg">
                  {p.name}
                </h4>
                {p.summary && (
                  <p className="text-sm text-fg-muted mt-1 leading-relaxed">{p.summary}</p>
                )}
                {p.bullets?.length > 0 && <BulletList items={p.bullets} />}
                {p.tech?.length > 0 && <TechPills items={p.tech} />}
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

const Timeline = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 80%', 'end 20%'],
  });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  if (!experiences.length) return null;

  return (
    <section id="timeline" className="section">
      <div className="container-x">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <span className="section-eyebrow">Journey</span>
          <h2 className="section-title">Experience & Education</h2>
        </motion.div>

        <div ref={ref} className="relative max-w-3xl">
          <div className="absolute left-[18px] md:left-[22px] top-0 bottom-0 w-px bg-border" />
          <motion.div
            style={{ height: lineHeight }}
            className="absolute left-[18px] md:left-[22px] top-0 w-px bg-gradient-to-b from-accent via-accent/60 to-transparent"
          />

          {experiences.map((exp, i) => (
            <TimelineNode key={i} exp={exp} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Timeline;
