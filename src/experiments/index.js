import ParticleVortex from './ParticleVortex';
import Constellation from './Constellation';
import ConwayLife from './ConwayLife';
import GlitchType from './GlitchType';
import GenerativeAmbient from './GenerativeAmbient';

export const experiments = [
  {
    slug: 'particle-vortex',
    title: 'Particle Vortex',
    blurb: 'Cursor-reactive 400-particle field with attract / repel / swirl modes.',
    tags: ['canvas', 'physics', 'interactive'],
    accent: 'from-violet-500/30 via-fuchsia-500/20 to-transparent',
    Component: ParticleVortex,
  },
  {
    slug: 'constellation',
    title: 'Constellation',
    blurb: 'Drifting graph that repels from your cursor. Tune density and link distance.',
    tags: ['canvas', 'graph', 'ambient'],
    accent: 'from-sky-500/30 via-indigo-500/20 to-transparent',
    Component: Constellation,
  },
  {
    slug: 'conway-life',
    title: "Conway's Life",
    blurb: 'Paintable cellular automaton with glider, pulsar, and Gosper gun presets.',
    tags: ['automaton', 'paintable', 'classic'],
    accent: 'from-emerald-500/25 via-cyan-500/20 to-transparent',
    Component: ConwayLife,
  },
  {
    slug: 'glitch-type',
    title: 'Glitch Type',
    blurb: 'RGB-split, scanline-laced display text. Live intensity + speed controls.',
    tags: ['typography', 'css', 'effect'],
    accent: 'from-rose-500/30 via-orange-500/20 to-transparent',
    Component: GlitchType,
  },
  {
    slug: 'generative-ambient',
    title: 'Generative Ambient',
    blurb: 'Procedural drone w/ scale, root, filter & reverb. Pulsing rings sync to each note.',
    tags: ['audio', 'web-audio', 'generative'],
    accent: 'from-teal-500/30 via-emerald-500/15 to-transparent',
    Component: GenerativeAmbient,
  },
];

export const findExperiment = (slug) =>
  experiments.find((e) => e.slug === slug) || null;
