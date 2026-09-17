import type { Bio, Expertise, Social, TimelineEntry } from '@/types/content';

export const bio: Bio = {
  name: 'Dipesh Malla',
  headline: 'Full Stack Developer',
  roles: ['Full Stack Developer', 'React Developer', 'FastAPI Developer'],
  story: [
    "Hi, I'm Dipesh Malla, a full-stack developer from Nepal. I specialize in building modern web applications using React on the frontend and FastAPI on the backend. My passion lies in creating scalable and efficient solutions that deliver exceptional user experiences.",
    "With 2 years of experience in web development, I've evolved from frontend development with React and JavaScript to mastering full-stack development. I work extensively with FastAPI, SQLAlchemy, and PostgreSQL to build robust backend systems. I'm particularly passionate about creating clean, maintainable code and implementing efficient database solutions that power seamless user experiences.",
  ],
  quote:
    "When I'm not coding, you'll find me contributing to open-source, helping peers learn, or exploring the latest in web development technologies. I believe in lifelong learning, mentorship, and giving back to the tech community.",
  avatarUrl: 'https://i.ibb.co/prB36m9q/logo.png',
  portraitUrl: 'https://i.postimg.cc/Pq4BzmS1/bio-logo.png',
  location: 'Nepalgunj, Nepal',
  email: 'dipeshmalla000@gmail.com',
  phone: '+977 9869705507',
  availableForWork: true,
};

export const socials: Social[] = [
  {
    id: 1,
    label: 'GitHub',
    url: 'https://github.com/Greycode009',
    icon: 'github',
    sortOrder: 1,
  },
  {
    id: 2,
    label: 'LinkedIn',
    url: 'https://t.co/OPtsS9LjDQ',
    icon: 'linkedin',
    sortOrder: 2,
  },
  {
    id: 3,
    label: 'Twitter/X',
    url: 'https://x.com/dipeshmalla29',
    icon: 'x',
    sortOrder: 3,
  },
];

export const timeline: TimelineEntry[] = [
  {
    id: 1,
    year: '2025',
    title: 'Full Stack Developer',
    description:
      'Started working on more complex full-stack applications and AI integrations.',
    highlight: true,
    sortOrder: 1,
  },
  {
    id: 2,
    year: '2024',
    title: 'Frontend Specialist',
    description: 'Specialized in React and modern frontend frameworks.',
    highlight: true,
    sortOrder: 2,
  },
  {
    id: 3,
    year: '2023',
    title: 'Web Development Journey',
    description:
      'Began learning web development through online courses and personal projects.',
    highlight: true,
    sortOrder: 3,
  },
  {
    id: 4,
    year: '2022',
    title: 'Programming Foundations',
    description:
      'Started exploring the world of programming and computer science.',
    highlight: true,
    sortOrder: 4,
  },
];

/** The three cards on the home page. */
export const expertise: Expertise[] = [
  {
    id: 1,
    title: 'Frontend Development',
    description:
      'Creating responsive and interactive user interfaces with React, HTML, CSS, and JavaScript.',
    icon: 'fas fa-code',
    technologies: ['React', 'JavaScript', 'CSS3'],
    sortOrder: 1,
  },
  {
    id: 2,
    title: 'Backend Development',
    description:
      'Building robust server-side applications and APIs using Node.js and modern backend technologies.',
    icon: 'fab fa-node-js',
    technologies: ['Node.js', 'Express.js', 'PostgreSQL'],
    sortOrder: 2,
  },
  {
    id: 3,
    title: 'Responsive Web Design',
    description:
      'Building websites that work seamlessly across all devices, from desktop to mobile.',
    icon: 'fas fa-mobile-alt',
    technologies: ['Media Queries', 'Flexbox', 'Grid'],
    sortOrder: 3,
  },
];

export const homeIntro =
  'I specialize in building modern web applications with React and Node.js, focusing on scalable solutions and exceptional user experiences.';
