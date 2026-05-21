import { motion } from 'framer-motion';
import { ArrowUpRight, Mail } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../icons/Brand';
import { about, contact } from '../../portfolio';

const Contact = () => {
  if (!contact.email) return null;

  return (
    <section id="contact" className="section">
      <div className="container-x">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative card overflow-hidden p-10 md:p-16 text-center"
        >
          <div className="absolute inset-0 bg-gradient-radial from-accent/15 via-transparent to-transparent" />
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 h-60 w-60 rounded-full bg-accent/30 blur-[100px]" />

          <div className="relative">
            <span className="section-eyebrow justify-center">Let&apos;s talk</span>
            <h2 className="font-display text-4xl md:text-6xl font-bold tracking-tight mt-2">
              Have a project <br className="hidden md:block" />
              <span className="text-gradient animate-gradient-shift">in mind?</span>
            </h2>
            <p className="mt-6 text-fg-muted max-w-xl mx-auto">
              I&apos;m open to interesting full-stack & AI roles, contracts, and collaborations.
              Drop a line — I usually reply within a day.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <a
                href={`mailto:${contact.email}`}
                className="btn-primary group"
              >
                <Mail className="h-4 w-4" />
                {contact.email}
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>

            <div className="mt-8 flex justify-center gap-2 text-fg-muted">
              {about.social?.github && (
                <a
                  href={about.social.github}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub"
                  className="p-3 rounded-full hover:text-accent hover:bg-bg-alt transition-colors"
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
                  className="p-3 rounded-full hover:text-accent hover:bg-bg-alt transition-colors"
                >
                  <LinkedinIcon className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
