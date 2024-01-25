const header = {
    // all the properties are optional - can be left empty or deleted
    homepage: 'https://mashhoor-ahdal.github.io/portfolio',
    title: 'MA.',
  }
  
  const about = {
    // all the properties are optional - can be left empty or deleted
    name: 'Mashhoor Ahdal',
    role: 'Front End Engineer | Python ',
    description:
      'Adipisicing sit fugit ullam unde aliquid sequi Facilis soluta facilis perspiciatis corporis nulla aspernatur. Autem eligendi rerum delectus modi quisquam? Illo ut quasi nemo ipsa cumque perspiciatis! Maiores minima consectetur.',
    resume: 'https://drive.google.com/file/d/1I7-s605RzLRFzyVOkf1La99rrU7i_U81/view?usp=drive_link',
    social: {
      linkedin: 'https://linkedin.com/in/mashhoor-ahdal',
      github: 'https://github.com/mashhoor-ahdal',
    },
  }
  
  const projects = [
    // projects can be added an removed
    // if there are no projects, Projects section won't show up
    {
      name: 'Edulinx',
      description:
        ' Web application leveraging Firebase to facilitate the organized retrieval and downloading of PDF study materials',
      stack: ['Javascript', 'Firebase'],
      sourceCode: 'https://github.com/mashhoor-ahdal/Edulinx',
      livePreview: 'edulinx.vercel.app',
    },
    {
      name: 'PromptImage',
      description:
        ' Web-based application utilizing Flask and integrated APIs to empower users to create, customize, and download images easily.',
    
      stack: ['Flask', 'HuggingFace', 'Python'],
      sourceCode: 'https://github.com/mashhoor-ahdal/image_generator',
      livePreview: '',
    },
    {
      name: 'Portfolio',
      description:
        'Minimal developer portfolio built using react ',
      stack: ['React', 'Git', 'CSS'],
      sourceCode: 'https://github.com/mashhoor-ahdal/mashhoor.github.io',
      livePreview: 'https://mashhoor.github.io',
    },
    {
        name: 'Django-Todo',
        description:
          'Todo App to facilitate the CRUD operations in Django  ',
        stack: ['Django', 'Python', 'Sqlite'],
        sourceCode: 'https://github.com/mashhoor-ahdal/django-todo',
        
      },
  ]
  
  const skills = [
    // skills can be added or removed
    // if there are no skills, Skills section won't show up
    'HTML',
    'CSS',
    'JavaScript',
    'Python',
    'React',
    'NodeJS',
    'Sql',
    'Django',
    'Flask',
    'Material UI',
    'Git',
    'CI/CD',
    'Figma',
    
  ]
  
  const contact = {
    // email is optional - if left empty Contact section won't show up
    email: 'mashhoorahdal2@gmail.com',
  }
  
  export { header, about, projects, skills, contact }
  