// RAG retrieval pipeline: PDF → text → chunks → embeddings → hybrid search.
// Heavy deps (pdfjs-dist, transformers.js) are dynamically imported so they
// never touch the main bundle — they load on the visitor's first question.

const RESUME_URL = `${import.meta.env.BASE_URL}resume.pdf`;
export const MODEL_ID = 'Xenova/all-MiniLM-L6-v2';

// Résumé section headers — short all-caps lines start a new section.
const isSectionHeader = (line) =>
  /^[A-Z][A-Z &/]{2,40}$/.test(line.trim()) && line.trim().split(' ').length <= 4;

export async function extractPdfText() {
  const pdfjs = await import('pdfjs-dist');
  const workerUrl = (await import('pdfjs-dist/build/pdf.worker.min.mjs?url')).default;
  pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

  const doc = await pdfjs.getDocument({
    url: new URL(RESUME_URL, window.location.origin).href,
  }).promise;
  const lines = [];
  for (let p = 1; p <= doc.numPages; p++) {
    const page = await doc.getPage(p);
    const content = await page.getTextContent();
    // Group text items into lines by their y position.
    let lastY = null;
    let line = '';
    for (const item of content.items) {
      const y = Math.round(item.transform[5]);
      if (lastY !== null && Math.abs(y - lastY) > 2) {
        if (line.trim()) lines.push(line.trim());
        line = '';
      }
      line += (line && !line.endsWith(' ') && !item.str.startsWith(' ') ? ' ' : '') + item.str;
      lastY = y;
    }
    if (line.trim()) lines.push(line.trim());
  }
  return lines;
}

// Fine-grained chunking: lines accumulate only until a sentence boundary
// past MIN_CHARS, so each chunk stays close to a single bullet/topic.
// Mixed-topic chunks average their embeddings into mush — keep them small.
const MIN_CHARS = 100;
const MAX_CHARS = 320;

export function chunkLines(lines) {
  const sections = [];
  let current = { section: 'HEADER', lines: [] };
  for (const line of lines) {
    if (isSectionHeader(line)) {
      if (current.lines.length) sections.push(current);
      current = { section: line.trim(), lines: [] };
    } else {
      current.lines.push(line);
    }
  }
  if (current.lines.length) sections.push(current);

  const chunks = [];
  for (const { section, lines: sectionLines } of sections) {
    let buf = '';
    const push = () => {
      if (buf.trim().length > 30) {
        chunks.push({ id: chunks.length, section, text: buf.trim() });
      }
      buf = '';
    };
    for (const line of sectionLines) {
      if (buf && (buf.length + line.length > MAX_CHARS || (buf.length >= MIN_CHARS && /[.!?]$/.test(buf)))) {
        push();
      }
      buf += (buf ? ' ' : '') + line;
    }
    push();
  }
  return chunks;
}

// Embed chunks with their section as context — "EXPERIENCE: Built Stripe
// billing…" retrieves better than the bare bullet.
export const embeddableText = (chunk) => `${chunk.section}: ${chunk.text}`;

let embedderPromise = null;

export function loadEmbedder(onProgress) {
  if (!embedderPromise) {
    embedderPromise = (async () => {
      const { pipeline, env } = await import('@huggingface/transformers');
      env.allowLocalModels = false;
      return pipeline('feature-extraction', MODEL_ID, {
        dtype: 'q8',
        progress_callback: (p) => {
          if (p.status === 'progress' && p.total) {
            onProgress?.(p.loaded / p.total, p.file);
          }
        },
      });
    })();
    embedderPromise.catch(() => {
      embedderPromise = null; // allow retry after a failed download
    });
  }
  return embedderPromise;
}

export async function embed(embedder, texts) {
  const output = await embedder(texts, { pooling: 'mean', normalize: true });
  const [n, dim] = [texts.length, output.dims.at(-1)];
  const vectors = [];
  for (let i = 0; i < n; i++) {
    vectors.push(output.data.slice(i * dim, (i + 1) * dim));
  }
  return vectors;
}

// Vectors are L2-normalized, so cosine similarity is a plain dot product.
const dot = (a, b) => {
  let s = 0;
  for (let i = 0; i < a.length; i++) s += a[i] * b[i];
  return s;
};

const STOPWORDS = new Set([
  'a', 'an', 'the', 'is', 'are', 'was', 'were', 'be', 'been', 'he', 'his',
  'she', 'her', 'it', 'its', 'do', 'does', 'did', 'done', 'has', 'have',
  'had', 'what', 'when', 'where', 'which', 'who', 'how', 'why', 'many',
  'much', 'of', 'in', 'on', 'at', 'to', 'for', 'with', 'and', 'or', 'any',
  'about', 'tell', 'me', 'you', 'your', 'i', 's',
]);

const contentTokens = (text) =>
  (text.toLowerCase().match(/[a-z0-9+#./-]+/g) ?? []).filter((t) => !STOPWORDS.has(t));

// Hybrid score: cosine carries meaning, keyword coverage rescues exact
// terms ("Kafka", "2 years") that mean-pooled vectors dilute.
export function search(query, queryVector, chunkVectors, chunks, topK = 3) {
  const queryTokens = [...new Set(contentTokens(query))];
  return chunkVectors
    .map((v, i) => {
      const cosine = dot(queryVector, v);
      const chunkTokens = new Set(contentTokens(embeddableText(chunks[i])));
      const hits = queryTokens.filter((t) =>
        chunkTokens.has(t) || [...chunkTokens].some((c) => c.startsWith(t) && t.length >= 4)
      ).length;
      const coverage = queryTokens.length ? hits / queryTokens.length : 0;
      const score = 0.75 * cosine + 0.25 * coverage;
      return { chunk: chunks[i], score, cosine, coverage };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}

export const SCORE_THRESHOLD = 0.18;
