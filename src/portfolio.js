const header = {
  // all the properties are optional - can be left empty or deleted
  homepage: "https://mashhoorahdal.github.io/portfolio",
  title: "MA.",
};

const about = {
  // all the properties are optional - can be left empty or deleted
  name: "Mashhoor Ahdal",
  role: "Platform Engineer | Full Stack & AI",
  description:
    "I’m a Platform Engineer with a Full Stack & AI background and 2+ years of experience building scalable SaaS platforms, AI-driven systems, and high-performance backends. I build the internal platform an infra team runs on — server inventory, alerting, incident management, uptime monitoring, fleet scanning, and OpenTelemetry tracing — and put AI on top of it with MCP tooling and LLM-driven alert investigation. I specialize in Django, FastAPI, Nomad, and distributed architectures, with strong focus on reliability, observability, and automation.",
  resume:
    "https://drive.google.com/file/d/13xRcyBIkUM-803j9WR2QlhnJZVE_OuBg/view?usp=drive_link",
  social: {
    linkedin: "https://linkedin.com/in/mashhoor-ahdal",
    github: "https://github.com/mashhoorahdal",
  },
};

const projects = [
  // projects can be added an removed
  // if there are no projects, Projects section won't show up
  {
    name: "PyPI Warehouse (Open Source)",
    description:
      "Two merged PRs to PyPI Warehouse — the backend powering pypi.org. Improved collaborator notification emails (dynamic project/user links + a reusable FAQ helper) and fixed WCAG heading accessibility in project detail pages, keeping the i18n template pipeline intact.",
    stack: ["Python", "Jinja2", "i18n", "Accessibility"],
    sourceCode: "https://github.com/pypi/warehouse",
    livePreview: "https://pypi.org",
  },
  {
    name: "KKMA Events",
    description:
      "Mobile app for tracking event attendance in a membership organization. Members identify via membership-card QR (or number) to browse and register for events; admins manage the registry, events, and participant lists with CSV export. Privacy by design — member reads/writes go through Postgres security-definer RPCs that expose only safe fields.",
    stack: ["Expo", "React Native", "Supabase", "TypeScript"],
    sourceCode: "https://github.com/mashhoorahdal/kkma_events_tracker",
    livePreview: "",
  },
];

const skills = [
  "Django", "Python", "React", "Redis", "Docker",
  "Kafka", "Grafana", "FastAPI", "Git", "CI/CD",
  "RAG (AI)", "Nomad", "Prometheus", "Celery",
  "Ansible", "OpenTelemetry", "Traefik", "MCP", "PostgreSQL"
];

const skillCategories = [
  {
    name: "Backend",
    items: ["Python", "Django", "FastAPI", "Celery", "Kafka", "Redis"],
  },
  {
    name: "Frontend",
    items: ["React", "JavaScript", "TypeScript", "Tailwind CSS"],
  },
  {
    name: "AI / ML",
    items: ["RAG (AI)", "MCP", "LLM Agents", "LangChain", "OpenAI", "HuggingFace", "Vector DBs"],
  },
  {
    name: "Platform & Infra",
    items: ["Docker", "Nomad", "Traefik", "Ansible", "Vault", "GitLab CI", "Git"],
  },
  {
    name: "Observability",
    items: ["OpenTelemetry", "Tempo", "Prometheus", "Grafana", "Zabbix", "Sentry"],
  },
];

const skillConnections = [

  // Frontend & Backend
  ['React', 'Django'],      // Frontend communicating with backend
  ['React', 'FastAPI'],     // Frontend communicating with FastAPI services
  
  // Backend & Caching
  ['Django', 'Redis'],      // Caching with Redis
  ['FastAPI', 'Redis'],     // FastAPI using Redis for caching
  
  // Event-Driven Logic
  ['Kafka', 'Django'],       // Events flowing to backend
  ['Kafka', 'Prometheus'],   // Monitoring Kafka lags
  
  // AI & Backend
  ['RAG (AI)', 'FastAPI'],   // Chatbot powered by FastAPI
  ['RAG (AI)', 'Python'],    
  
  // Deployment & Orchestration
  ['Docker', 'Nomad'],       // Nomad deploying Docker containers
  ['Nomad', 'Prometheus'],   // Prometheus scraping Nomad logs/metrics
  ['Prometheus', 'Grafana'], // Visualizing alerts and lags
  
  // Infrastructure glue
  ['CI/CD', 'Nomad'],        // Pipeline deploying to Nomad
  ['Git', 'CI/CD'],
  ['Python', 'Django'],
  ['Django', 'Redis'],
  ['Redis', 'Celery'],

  // Platform & observability
  ['Ansible', 'PostgreSQL'],     // Fleet scan results ingested into the inventory DB
  ['Traefik', 'Nomad'],          // Nomad services routed through Traefik
  ['OpenTelemetry', 'Grafana'],  // Traces to Tempo, viewed in Grafana
  ['MCP', 'Django'],             // MCP tools proxy the platform API
];

const contact = {
  // email is optional - if left empty Contact section won't show up
  email: "mashhoor.ahdal.work@gmail.com",
};

const experiences = [
  {
    title: "Platform Engineer",
    company: "Turbolab Technologies Pvt Ltd",
    location: "Kochi, Kerala",
    date: "2026 - Present",
    summary:
      "Building the internal platform the infra team runs on — one console for the server fleet, alerts, incidents, uptime, and security — plus shared observability tooling and an AI layer that lets engineers and leadership query the estate in plain English.",
    projects: [
      {
        name: "DevOps Tools v2 — Infrastructure Operations Platform",
        summary:
          "Monorepo (Django REST + React/TypeScript) replacing a legacy inventory tool. Single source of truth for servers, services, projects, cloud costs, backups, DNS domains, alerts, incidents, and monitors. Primary author.",
        bullets: [
          "Built server inventory with provider sync for OVH dedicated + VPS — Celery chord fan-out for cost and inventory sync, cached API clients with retry/timeouts, and granular sync endpoints driven by n8n.",
          "Ported the SRE alert tool into the platform: Grafana/Sentry ingestion, dedup and auto-reopen, single-owner ack, time-based escalation to owners and managers, and threaded, severity-coloured Google Chat cards.",
          "Shipped full incident management — incident queue, lifecycle command rail, activity timeline, corrective-action board, impacted-target linking, and a three-stage postmortem flow with a reviewer gate and report export.",
          "Wrote an HTTP + SSL uptime monitor with second-node confirmation and retry logic to kill false positives, plus Zabbix 30-day peak metrics and per-server metric charts.",
          "Deployed on Nomad behind Traefik with canary + auto-revert rollouts, prestart migrations, and a dedicated Celery worker group; GitLab CI builds images and pre-commit runs ruff, safety, and typecheck.",
        ],
        tech: [
          "Django",
          "DRF",
          "Celery",
          "Redis",
          "PostgreSQL",
          "React",
          "TypeScript",
          "TanStack Query",
          "Nomad",
          "Traefik",
          "GitLab CI",
          "Zabbix",
          "n8n",
        ],
      },
      {
        name: "AI Ops — MCP Server, Assistant & Alert Investigation",
        summary:
          "AI layer over the platform so the team, CTO, and owners can ask about the estate in plain words instead of clicking through the UI.",
        bullets: [
          "Built a read-only MCP server (stdio client + backend tool registry) with 25+ tools across servers, costs, alerts, incidents, CVEs, and scans — per-user API keys, throttling, output budgets, full call audit, and one-command setup for Claude Code and other AI tools.",
          "Built an LLM alert investigator: on new alerts an agent loops over read-only tools (Grafana via MCP, Nomad, Zabbix, inventory DB) and posts a root-cause report with next steps into the alert's Google Chat thread, with backup-LLM fallback.",
          "Built a natural-language DB assistant — the LLM writes guarded, masked read-only SQL and answers stream back over SSE as generated UI (KPIs, charts, tables) from the app's own components.",
          "Added a production security detection worker over access logs — scanner-wave detection, token abuse from many IPs, and a daily AI threat hunt — alerting within about a minute.",
        ],
        tech: [
          "MCP",
          "Anthropic",
          "OpenAI",
          "LLM Agents",
          "SSE",
          "Postgres NOTIFY",
          "Python",
        ],
      },
      {
        name: "Fleet Scanning & Vulnerability Detection",
        summary:
          "Agentless host scanning across production and staging, feeding the inventory and its Security tab.",
        bullets: [
          "Wrote an Ansible playbook collecting CPU, memory, disk, pending updates, services, listening ports, and packages from every host in one module call — nothing installed on targets, SSH via short-lived Vault-signed certificates.",
          "Runs as a periodic Nomad job with an inventory generated from active servers; gzip results are ingested via API and matched to servers by private IP.",
          "Detects high/critical CVEs on active servers via osv.dev with Debian version comparison and alerts new findings to Google Chat.",
        ],
        tech: ["Ansible", "Vault", "Python", "osv.dev", "Nomad"],
      },
      {
        name: "Distributed Tracing Across Microservices",
        summary:
          "End-to-end OpenTelemetry tracing across the company's core services: built the shared client package, then instrumented and rolled it out service by service so one request can be followed from the Cloud API through to the crawler fleet in Tempo.",
        bullets: [
          "Built sh-observability-client, an internal Python package: framework-agnostic setup_tracing plus span attribute helpers so every service records the same attributes, exporting OTLP/gRPC to a node-local collector feeding Tempo's service graph. Supports Python 3.8–3.14, ships py.typed, published to the internal package index from GitLab CI with MkDocs docs.",
          "Instrumented the ScrapeHero Cloud backend (Django + Celery on Nomad): server/client spans across views, DB queries, the chatbot, and outbound calls to the data platform, a per-process tracer for each Nomad group and forked Celery worker, and trace IDs returned in response headers.",
          "Instrumented the Dragd crawler platform (Django on Kubernetes): propagated W3C trace context through scheduler start/resume/stop into spider lifecycle and kube-scheduler actions, tracked retry counts on spans, and stamped trace IDs into logs via a log filter.",
          "Linked errors to traces: a Sentry before_send hook tags every issue with its OpenTelemetry trace ID and Tempo link, and the RAG API emits OTel traces alongside Langfuse on its own tracer provider.",
        ],
        tech: [
          "OpenTelemetry",
          "Tempo",
          "Grafana",
          "Sentry",
          "Django",
          "Celery",
          "Kubernetes",
          "Nomad",
          "Langfuse",
          "Python",
        ],
      },
    ],
  },
  {
    title: "Full Stack Developer",
    company: "Turbolab Technologies Pvt Ltd",
    location: "Kochi, Kerala",
    date: "2024 - 2026",
    summary:
      "Shipped production systems across three domains: an AI-powered app-review SaaS, an event-driven DAG orchestrator, and the company's core data platform.",
    projects: [
      {
        name: "App Review Intelligence Platform",
        summary:
          "End-to-end SaaS analyzing App Store / Play Store reviews with LLM pipelines and a full analytics dashboard.",
        bullets: [
          "Shipped an AI-powered review analytics product end-to-end, turning raw store reviews into themes, sentiment, and competitive signals.",
          "Owned the paid-customer surface — auth and the full subscription lifecycle — unblocking onboarding.",
        ],
        tech: [
          "Django",
          "DRF",
          "Celery",
          "Redis",
          "PostgreSQL",
          "OpenAI",
          "React 19",
          "Vite",
          "MUI",
          "TanStack Query",
          "Recharts",
        ],
      },
      {
        name: "Nest — Core Data Platform",
        summary:
          "Contributed across the company's flagship data platform — reliability, billing performance, and developer-facing data modeling improvements.",
        bullets: [
          "Cut duplicate alerts by ~82% (592 → 107 over a 12-week window) with deterministic dedup, dropping the platform duplicate rate from 1.22% to 0.19% even as overall alert volume grew.",
          "Migrated a custom Nomad-deployed alert service to native Grafana alerts — replaced custom code with standard tooling and shrank the surface to maintain.",
        ],
        tech: [
          "Django",
          "DRF",
          "GraphQL",
          "Celery",
          "MySQL",
          "Nomad",
          "Sentry",
        ],
      },
      {
        name: "Nest DAG Orchestrator",
        summary:
          "Event-driven DAG execution engine powering the data platform — manages DAG runs, nodes, datasets, and lifecycle state via Kafka events.",
        bullets: [
          "Removed a redundant polling background task from the DAG execution flow — moved fully to event-driven updates (API + Kafka), decommissioning a dedicated Nomad job and a Redis instance while making runs noticeably smoother.",
          "Eliminated recurring stuck-state incidents that previously blocked downstream data consumers.",
        ],
        tech: [
          "Django",
          "DRF",
          "Confluent Kafka",
          "Redis",
          "PostgreSQL",
          "Elasticsearch",
          "Sentry",
        ],
      },
    ],
  },
  {
    title: "Bachelor of Science",
    company: "Government Engineering College, Sreekrishnapuram, Palakkad",
    location: "Palakkad, Kerala",
    date: "2020 - 2024",
    description: "Specialized in Computer Science and Engineering.",
  },
];

export { header, about, projects, skills, skillCategories, contact, experiences, skillConnections };
