import RagChat from './RagChat';
import DagPlayground from './DagPlayground';

export const experiments = [
  {
    slug: 'rag-chat',
    title: 'Résumé RAG',
    blurb:
      'Real RAG retrieval, zero servers: pdf.js parses my résumé, MiniLM embeds it in your browser, cosine search answers your questions.',
    tags: ['transformers.js', 'embeddings', 'pdf.js', 'semantic-search'],
    accent: 'from-violet-500/30 via-fuchsia-500/20 to-transparent',
    Component: RagChat,
  },
  {
    slug: 'dag-playground',
    title: 'DAG Orchestrator',
    blurb:
      'Build a task graph, then run it: event-driven scheduling, retries with exponential backoff, failure propagation — with a live event log.',
    tags: ['distributed-systems', 'scheduling', 'event-driven', 'svg'],
    accent: 'from-sky-500/30 via-indigo-500/20 to-transparent',
    Component: DagPlayground,
  },
];

export const findExperiment = (slug) =>
  experiments.find((e) => e.slug === slug) || null;
