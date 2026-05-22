const header = {
  // all the properties are optional - can be left empty or deleted
  homepage: "https://mashhoorahdal.github.io/portfolio",
  title: "MA.",
};

const about = {
  // all the properties are optional - can be left empty or deleted
  name: "Mashhoor Ahdal",
  role: "Full Stack Developer | AI Engineer",
  description:
    "I’m a Full Stack Developer & AI Engineer with 2+ years of experience building scalable SaaS platforms, AI-driven systems, and high-performance backends. I specialize in Django, FastAPI, microservices, and distributed architectures.Build optimized, production-ready UIs. I’ve built real-time pipelines, implemented AI chatbots, and delivered end-to-end monitoring stacks for distributed systems with strong focus on performance, reliability, and automation.",
  resume:
    "https://drive.google.com/file/d/1DiQlxLRktEMZYB7fML3GjZEJDEJUZvzH/view?usp=drive_link",
  social: {
    linkedin: "https://linkedin.com/in/mashhoor-ahdal",
    github: "https://github.com/mashhoorahdal",
  },
};

const projects = [
  // projects can be added an removed
  // if there are no projects, Projects section won't show up
  {
    name: "Personal Blog",
    description:
      "A personal blog showcasing my journey through solving LeetCode problems, sharing experiences, and documenting the learning process.",
    stack: ["React", "Gatsby", "GraphQL", "MDX"],
    sourceCode: "https://github.com/mashhoorahdal/blog-gatsby",
    livePreview: "https://mashhoorblog.vercel.app/",
  },
  {
    name: "Edulinx",
    description:
      " Web application leveraging Firebase to facilitate the organized retrieval and downloading of PDF study materials",
    stack: ["Javascript", "Firebase"],
    sourceCode: "https://github.com/mashhoorahdal/Edulinx",
    livePreview: "https://edulinx.vercel.app",
  },
  {
    name: "PromptImage",
    description:
      " Web-based application utilizing Flask and integrated APIs to empower users to create, customize, and download images easily.",

    stack: ["Flask", "HuggingFace", "Python"],
    sourceCode: "https://github.com/mashhoorahdal/image_generator",
    livePreview: "",
  },
  {
    name: "Portfolio",
    description: "Minimal developer portfolio built using react ",
    stack: ["React", "Git", "CSS"],
    sourceCode: "https://github.com/mashhoorahdal/mashhoor.github.io",
    livePreview: "https://mashhoorahdal.github.io/portfolio",
  },
];

const skills = [
  "Django", "Python", "React", "Redis", "Docker",
  "Kafka", "Grafana", "FastAPI", "Git", "CI/CD",
  "RAG (AI)", "Nomad", "Prometheus", "Celery"
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
    items: ["RAG (AI)", "LangChain", "OpenAI", "HuggingFace", "Vector DBs"],
  },
  {
    name: "DevOps & Infra",
    items: ["Docker", "Nomad", "Prometheus", "Grafana", "CI/CD", "Git"],
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
  ['Redis', 'Celery']
];

const contact = {
  // email is optional - if left empty Contact section won't show up
  email: "mashhoor.ahdal.work@gmail.com",
};

const experiences = [
  {
    title: "Full Stack Developer",
    company: "Turbolab Technologies Pvt Ltd",
    location: "Kochi, Kerala",
    date: "2024 - Present",
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
