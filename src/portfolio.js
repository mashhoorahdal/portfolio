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
  // skills can be added or removed
  // if there are no skills, Skills section won't show up
  "Django",
  "JavaScript",
  "Python",
  "React",
  "Sql",
  "Git",
  "CI/CD",
  "Redis",
  "Celery",
  "RabbitMQ",
  "Docker",
  "Kafka",
  "Grafana",
];

const contact = {
  // email is optional - if left empty Contact section won't show up
  email: "mashhoorahdal2@gmail.com",
};

const experiences = [
  {
    title: "Full Stack Developer",
    company: "Turbolab Technologies Pvt Ltd",
    location: "Kochi, Kerala",
    date: "2024 - Present",
    description: "Building scalable SaaS platform using Django and React. Implemented microservices architectures and real-time data processing pipelines. Developed AI-driven features and chatbots to enhance user experience.",
  },
  {
    title: "Bachelor of Science",
    company: "Government Engineering College, Sreekrishnapuram, Palakkad",
    location: "Palakkad, Kerala",
    date: "2020 - 2024",
    description: "Specialized in Computer Science and Engineering.",
  },
];

export { header, about, projects, skills, contact, experiences };
