import type { ComponentType } from 'react';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import Home from '@/pages/Home';
import Projects from '@/pages/Projects';

export interface AppRoute {
  path: string;
  component: ComponentType;
  title: string;
  description: string;
}

/**
 * Single source of truth for routing. The prerender script walks this list to
 * emit one static HTML file per route, and Phase 3 will hang each route's
 * spawn point in the pixel room off the same entries.
 */
export const routes: AppRoute[] = [
  {
    path: '/',
    component: Home,
    title: 'Dipesh Malla | Full Stack Developer',
    description:
      'Full stack developer from Nepal building modern web applications with React and Node.js.',
  },
  {
    path: '/projects',
    component: Projects,
    title: 'Projects | Dipesh Malla',
    description:
      'Selected work — React and full stack projects, each with source and a live demo.',
  },
  {
    path: '/about',
    component: About,
    title: 'About | Dipesh Malla',
    description:
      'Two years of web development: skills across frontend, backend, databases and authentication.',
  },
  {
    path: '/contact',
    component: Contact,
    title: 'Contact | Dipesh Malla',
    description:
      'Available for freelance work. Get in touch about your next project.',
  },
];
