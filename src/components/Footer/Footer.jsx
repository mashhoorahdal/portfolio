import { Mail } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../icons/Brand';
import { about, contact } from '../../portfolio';

const Footer = () => (
  <footer className="border-t border-border mt-12 relative z-10">
    <div className="container-x py-8 flex flex-col md:flex-row items-center justify-between gap-4">
      <p className="text-xs font-mono text-fg-subtle">
        © {new Date().getFullYear()} {about.name} · Built with React, Tailwind & Framer Motion.
      </p>
      <div className="flex items-center gap-1 text-fg-muted">
        {about.social?.github && (
          <a
            href={about.social.github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="p-2 rounded-full hover:text-accent transition-colors"
          >
            <GithubIcon className="h-4 w-4" />
          </a>
        )}
        {about.social?.linkedin && (
          <a
            href={about.social.linkedin}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className="p-2 rounded-full hover:text-accent transition-colors"
          >
            <LinkedinIcon className="h-4 w-4" />
          </a>
        )}
        {contact?.email && (
          <a
            href={`mailto:${contact.email}`}
            aria-label="Email"
            className="p-2 rounded-full hover:text-accent transition-colors"
          >
            <Mail className="h-4 w-4" />
          </a>
        )}
      </div>
    </div>
  </footer>
);

export default Footer;
