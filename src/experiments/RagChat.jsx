import { useEffect, useRef, useState } from 'react';
import { Send, FileText, Cpu, Layers, AlertTriangle, ChevronDown } from 'lucide-react';
import {
  MODEL_ID,
  SCORE_THRESHOLD,
  extractPdfText,
  chunkLines,
  loadEmbedder,
  embed,
  search,
} from './rag/pipeline';

const SUGGESTIONS = [
  'What has he done with Kafka?',
  'Tell me about his billing work',
  'What AI experience does he have?',
  'Open source contributions?',
];

const STAGES = [
  { key: 'pdf', label: 'Fetch + parse résumé PDF', icon: FileText },
  { key: 'model', label: `Download ${MODEL_ID}`, icon: Cpu },
  { key: 'index', label: 'Embed chunks (384-dim vectors)', icon: Layers },
];

const RagChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [phase, setPhase] = useState('idle'); // idle | loading | ready | error
  const [stage, setStage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [showHow, setShowHow] = useState(false);
  const [busy, setBusy] = useState(false);

  const indexRef = useRef(null); // { embedder, chunks, vectors }
  const threadRef = useRef(null);
  const pendingRef = useRef(null);

  useEffect(() => {
    threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, phase, busy]);

  const buildIndex = async () => {
    setPhase('loading');
    setError(null);
    try {
      setStage('pdf');
      setProgress(0);
      const lines = await extractPdfText();
      const chunks = chunkLines(lines);

      setStage('model');
      const embedder = await loadEmbedder((frac) => setProgress(frac));

      setStage('index');
      setProgress(1);
      const vectors = await embed(embedder, chunks.map((c) => c.text));

      indexRef.current = { embedder, chunks, vectors };
      setPhase('ready');
      return true;
    } catch (err) {
      setError(err?.message ?? 'Failed to build the index.');
      setPhase('error');
      return false;
    }
  };

  const answer = async (question) => {
    setBusy(true);
    try {
      const { embedder, chunks, vectors } = indexRef.current;
      const t0 = performance.now();
      const [queryVector] = await embed(embedder, [question]);
      const results = search(queryVector, vectors, chunks).filter(
        (r) => r.score >= SCORE_THRESHOLD
      );
      const ms = Math.round(performance.now() - t0);
      setMessages((m) => [...m, { role: 'assistant', results, ms }]);
    } finally {
      setBusy(false);
    }
  };

  const ask = async (question) => {
    const q = question.trim();
    if (!q || busy || phase === 'loading') return;
    setInput('');
    setMessages((m) => [...m, { role: 'user', text: q }]);
    if (phase !== 'ready') {
      pendingRef.current = q;
      const ok = await buildIndex();
      if (!ok) return;
      const pending = pendingRef.current;
      pendingRef.current = null;
      await answer(pending);
    } else {
      await answer(q);
    }
  };

  const retry = async () => {
    const ok = await buildIndex();
    if (ok && pendingRef.current) {
      const pending = pendingRef.current;
      pendingRef.current = null;
      await answer(pending);
    }
  };

  const chunkCount = indexRef.current?.chunks.length;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-bg-card overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
          <span className="text-xs font-mono uppercase tracking-wider text-fg-muted">
            Semantic search over my résumé — runs entirely in your browser
          </span>
          {phase === 'ready' && (
            <span className="text-[11px] font-mono text-fg-subtle">
              {chunkCount} chunks · 384d · {MODEL_ID.split('/')[1]}
            </span>
          )}
        </div>

        <div ref={threadRef} className="h-[380px] overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center gap-3">
              <p className="text-fg-muted text-sm max-w-sm">
                Ask anything about my experience. First question downloads a ~25MB
                embedding model (cached after) and indexes my actual résumé PDF —
                live, client-side.
              </p>
            </div>
          )}

          {messages.map((msg, i) =>
            msg.role === 'user' ? (
              <div key={i} className="flex justify-end">
                <div className="max-w-[80%] rounded-2xl rounded-br-md bg-accent/15 border border-accent/30 px-4 py-2.5 text-sm">
                  {msg.text}
                </div>
              </div>
            ) : (
              <div key={i} className="flex justify-start">
                <div className="max-w-[92%] space-y-2">
                  {msg.results.length === 0 ? (
                    <div className="rounded-2xl rounded-bl-md border border-border bg-bg px-4 py-2.5 text-sm text-fg-muted">
                      Nothing in the résumé matched that closely. Try asking about
                      backend work, Kafka, billing, AI features, or open source.
                    </div>
                  ) : (
                    msg.results.map((r, j) => (
                      <div
                        key={j}
                        className="rounded-xl border border-border bg-bg px-4 py-3"
                      >
                        <div className="flex items-center justify-between gap-3 mb-1.5">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-accent">
                            {r.chunk.section}
                          </span>
                          <span className="flex items-center gap-1.5 text-[10px] font-mono text-fg-subtle">
                            <span className="inline-block h-1 w-14 rounded bg-border overflow-hidden">
                              <span
                                className="block h-full bg-accent"
                                style={{ width: `${Math.min(r.score, 1) * 100}%` }}
                              />
                            </span>
                            {r.score.toFixed(3)}
                          </span>
                        </div>
                        <p className="text-sm text-fg-muted leading-relaxed">{r.chunk.text}</p>
                      </div>
                    ))
                  )}
                  <p className="text-[10px] font-mono text-fg-subtle pl-1">
                    retrieved in {msg.ms}ms · cosine similarity, top-3 ≥ {SCORE_THRESHOLD}
                  </p>
                </div>
              </div>
            )
          )}

          {phase === 'loading' && (
            <div className="rounded-xl border border-border bg-bg p-4 space-y-2.5">
              {STAGES.map((s) => {
                const Icon = s.icon;
                const stageIdx = STAGES.findIndex((x) => x.key === stage);
                const idx = STAGES.findIndex((x) => x.key === s.key);
                const state = idx < stageIdx ? 'done' : idx === stageIdx ? 'active' : 'todo';
                return (
                  <div key={s.key} className="flex items-center gap-2.5 text-xs">
                    <Icon
                      className={`h-3.5 w-3.5 ${
                        state === 'done'
                          ? 'text-emerald-400'
                          : state === 'active'
                            ? 'text-accent animate-pulse'
                            : 'text-fg-subtle'
                      }`}
                    />
                    <span className={state === 'todo' ? 'text-fg-subtle' : 'text-fg-muted'}>
                      {s.label}
                    </span>
                    {s.key === 'model' && state === 'active' && (
                      <span className="ml-auto flex items-center gap-2">
                        <span className="inline-block h-1 w-24 rounded bg-border overflow-hidden">
                          <span
                            className="block h-full bg-accent transition-all"
                            style={{ width: `${Math.round(progress * 100)}%` }}
                          />
                        </span>
                        <span className="font-mono text-fg-subtle">
                          {Math.round(progress * 100)}%
                        </span>
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {phase === 'error' && (
            <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 p-4 text-sm">
              <div className="flex items-center gap-2 text-rose-400 font-medium mb-1">
                <AlertTriangle className="h-4 w-4" /> Pipeline failed
              </div>
              <p className="text-fg-muted text-xs mb-3">{error}</p>
              <button
                type="button"
                onClick={retry}
                className="px-3 py-1.5 rounded-full border border-border text-xs hover:bg-bg-card transition"
              >
                Retry
              </button>
            </div>
          )}

          {busy && (
            <div className="flex gap-1.5 pl-1">
              {[0, 1, 2].map((d) => (
                <span
                  key={d}
                  className="h-1.5 w-1.5 rounded-full bg-fg-subtle animate-pulse"
                  style={{ animationDelay: `${d * 0.18}s` }}
                />
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-border p-3 space-y-2.5">
          {messages.length === 0 && (
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => ask(s)}
                  className="px-2.5 py-1 rounded-full border border-border text-xs text-fg-muted hover:text-fg hover:border-border-strong transition"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              ask(input);
            }}
            className="flex items-center gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about my experience…"
              disabled={phase === 'loading' || busy}
              className="flex-1 rounded-full bg-bg border border-border px-4 py-2 text-sm outline-none focus:border-accent transition disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || phase === 'loading' || busy}
              className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-accent text-white hover:bg-accent-hover transition disabled:opacity-40"
              aria-label="Send"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-bg-card">
        <button
          type="button"
          onClick={() => setShowHow((v) => !v)}
          className="w-full flex items-center justify-between px-4 py-3 text-sm text-fg-muted hover:text-fg transition"
        >
          How this works
          <ChevronDown className={`h-4 w-4 transition-transform ${showHow ? 'rotate-180' : ''}`} />
        </button>
        {showHow && (
          <div className="px-4 pb-4 text-sm text-fg-muted space-y-2 leading-relaxed">
            <p>
              This is the retrieval half of RAG, with zero servers. On your first
              question the page fetches my résumé PDF, extracts the text with pdf.js,
              splits it into section-aware chunks, and embeds every chunk into a
              384-dimensional vector with{' '}
              <span className="font-mono text-xs">{MODEL_ID}</span> running locally
              via transformers.js (WASM/WebGPU).
            </p>
            <p>
              Each question is embedded with the same model and matched against the
              chunks by cosine similarity — the top 3 above {SCORE_THRESHOLD} come
              back as the answer, scores included. No question leaves your browser.
            </p>
            <p className="text-xs text-fg-subtle">
              Honest scope: retrieval only — there's no generative model rewriting
              the answers. What you see is exactly what semantic search found in the
              PDF. Updating the knowledge base = replacing one file.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RagChat;
