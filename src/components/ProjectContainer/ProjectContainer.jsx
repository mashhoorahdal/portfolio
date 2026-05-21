import { useRef } from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { GithubIcon } from '../icons/Brand';

const ProjectCard = ({ project, index = 0, featured = false }) => {
  const ref = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const spotlight = useMotionTemplate`radial-gradient(450px circle at ${mouseX}px ${mouseY}px, rgba(167,139,250,0.18), transparent 60%)`;

  // Bento layout: first card spans more
  const spanClass = featured
    ? 'md:col-span-4 md:row-span-2'
    : index % 5 === 1
    ? 'md:col-span-2'
    : index % 5 === 2
    ? 'md:col-span-3'
    : index % 5 === 3
    ? 'md:col-span-3'
    : 'md:col-span-2';

  return (
    <motion.article
      ref={ref}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.55, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className={`group relative card overflow-hidden p-6 md:p-8 ${spanClass} hover:-translate-y-1`}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: spotlight }}
      />

      <div className="relative flex h-full flex-col">
        <div className="flex items-start justify-between gap-4">
          <h3
            className={`font-display font-semibold tracking-tight ${
              featured ? 'text-2xl md:text-3xl' : 'text-xl'
            }`}
          >
            {project.name}
          </h3>
          <div className="flex items-center gap-1.5 text-fg-muted">
            {project.sourceCode && (
              <a
                href={project.sourceCode}
                target="_blank"
                rel="noreferrer"
                aria-label={`${project.name} source`}
                className="p-2 rounded-full hover:text-accent hover:bg-bg-alt transition-colors"
              >
                <GithubIcon className="h-4 w-4" />
              </a>
            )}
            {project.livePreview && (
              <a
                href={project.livePreview}
                target="_blank"
                rel="noreferrer"
                aria-label={`${project.name} live preview`}
                className="p-2 rounded-full hover:text-accent hover:bg-bg-alt transition-colors"
              >
                <ArrowUpRight className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>

        <p
          className={`mt-3 text-fg-muted leading-relaxed ${
            featured ? 'md:text-base' : 'text-sm'
          }`}
        >
          {project.description}
        </p>

        {project.stack && (
          <ul className="mt-auto pt-6 flex flex-wrap gap-1.5">
            {project.stack.map((item) => (
              <li key={item} className="chip">
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
    </motion.article>
  );
};

export default ProjectCard;
