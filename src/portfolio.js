const header = {
    // all the properties are optional - can be left empty or deleted
    homepage: 'https://mashhoorahdal.github.io/portfolio',
    title: 'MA.',
  }
  
  const about = {
    // all the properties are optional - can be left empty or deleted
    name: 'Mashhoor Ahdal',
    role: 'Front End Developer | Python ',
    description:
      'Highly motivated and dedicated B.Tech Computer Science student with a strong academic background and a passion for software development. Seeking a challenging position to leverage my technical skills and contribute to the success of a progressive organization.',
    resume: 'https://drive.google.com/file/d/1I7-s605RzLRFzyVOkf1La99rrU7i_U81/view?usp=drive_link',
    social: {
      linkedin: 'https://linkedin.com/in/mashhoor-ahdal',
      github: 'https://github.com/mashhoorahdal',
    },
  }
  
  const projects = [
    // projects can be added an removed
    // if there are no projects, Projects section won't show up
       {
"name": "Personal Blog",
"description": "A personal blog showcasing my journey through solving LeetCode problems, sharing experiences, and documenting the learning process.",
"stack": ["React", "Gatsby", "GraphQL", "MDX"],
"sourceCode": "https://github.com/mashhoorahdal/blog-gatsby",
"livePreview": "https://mashhoorblog.vercel.app/"
}


    {
      name: 'Edulinx',
      description:
        ' Web application leveraging Firebase to facilitate the organized retrieval and downloading of PDF study materials',
      stack: ['Javascript', 'Firebase'],
      sourceCode: 'https://github.com/mashhoorahdal/Edulinx',
      livePreview: 'https://edulinx.vercel.app',
    },
    {
      name: 'PromptImage',
      description:
        ' Web-based application utilizing Flask and integrated APIs to empower users to create, customize, and download images easily.',
    
      stack: ['Flask', 'HuggingFace', 'Python'],
      sourceCode: 'https://github.com/mashhoorahdal/image_generator',
      livePreview: '',
    },
    {
      name: 'Portfolio',
      description:
        'Minimal developer portfolio built using react ',
      stack: ['React', 'Git', 'CSS'],
      sourceCode: 'https://github.com/mashhoorahdal/mashhoor.github.io',
      livePreview: 'https://mashhoorahdal.github.io/portfolio',
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
  
