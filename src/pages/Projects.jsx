import React, { useState } from 'react';
import { motion } from 'framer-motion';

// Sample project data - you can easily add more projects here
const projectsData = [
  {
    id: 1,
    title: "E-Commerce Website",
    description: "A fully responsive e-commerce platform built with React and Node.js. Features include user authentication, product filtering, cart functionality, and payment processing.",
    technologies: ["React", "Node.js", "Express", "MongoDB", "Stripe API"],
    image: "https://via.placeholder.com/600x400",
    githubLink: "https://github.com/username/ecommerce-project",
    liveLink: "https://ecommerce-project.netlify.app",
    featured: true
  },
  {
    id: 2,
    title: "Task Management App",
    description: "A collaborative task management application with real-time updates. Users can create projects, assign tasks, track progress, and receive notifications.",
    technologies: ["React", "Firebase", "Material UI", "Redux"],
    image: "https://via.placeholder.com/600x400",
    githubLink: "https://github.com/username/task-manager",
    liveLink: "https://task-manager-app.netlify.app",
    featured: true
  },
  {
    id: 3,
    title: "Weather Dashboard",
    description: "A weather application that displays current conditions and forecasts for any location. Includes interactive maps, charts for historical data, and severe weather alerts.",
    technologies: ["JavaScript", "OpenWeather API", "Chart.js", "HTML/CSS"],
    image: "https://via.placeholder.com/600x400",
    githubLink: "https://github.com/username/weather-dashboard",
    liveLink: "https://weather-dashboard-app.netlify.app",
    featured: false
  }
];

function Projects() {
  const [filter, setFilter] = useState('all');
  
  // Filter projects based on the selected filter
  const filteredProjects = filter === 'all' 
    ? projectsData 
    : projectsData.filter(project => project.technologies.includes(filter));
  
  // Get unique technologies for filter buttons
  const allTechnologies = [...new Set(projectsData.flatMap(project => project.technologies))];
  
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-4xl font-bold text-center text-primary mb-2"
      >
        My Projects
      </motion.h1>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="text-lg text-dimtext text-center mb-10"
      >
        Here are some of my recent work. Feel free to check them out!
      </motion.p>
      
      <motion.div 
        className="flex flex-wrap justify-center gap-2 mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        <button 
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
            filter === 'all' 
              ? 'bg-primary text-darktext' 
              : 'bg-surface text-lighttext hover:bg-primary/10 hover:text-primary'
          }`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        
        {allTechnologies.map(tech => (
          <button 
            key={tech}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              filter === tech 
                ? 'bg-primary text-darktext' 
                : 'bg-surface text-lighttext hover:bg-primary/10 hover:text-primary'
            }`}
            onClick={() => setFilter(tech)}
          >
            {tech}
          </button>
        ))}
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map((project) => (
          <motion.div 
            key={project.id}
            className="bg-surface rounded-xl overflow-hidden border border-primary/10 shadow-lg"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            whileHover={{ 
              y: -10, 
              boxShadow: '0 15px 30px rgba(187, 134, 252, 0.2)',
              transition: { duration: 0.2 } 
            }}
          >
            <div className="relative">
              <img src={project.image} alt={project.title} className="w-full h-48 object-cover" />
              {project.featured && (
                <span className="absolute top-3 right-3 bg-primary text-darktext text-xs px-3 py-1 rounded-full font-semibold">
                  Featured
                </span>
              )}
            </div>
            
            <div className="p-6">
              <h3 className="text-xl font-semibold text-white mb-2">{project.title}</h3>
              <p className="text-dimtext mb-4 line-clamp-3">{project.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {project.technologies.map(tech => (
                  <span 
                    key={`${project.id}-${tech}`} 
                    className="px-2 py-1 bg-primary/10 rounded-md text-xs text-primary"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center justify-between mt-6 relative">
                <a 
                  href={project.githubLink} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-2 px-4 py-2 bg-surface border border-primary/30 rounded-md text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
                >
                  <i className="fab fa-github text-lg"></i>
                  <span>GitHub</span>
                </a>
                
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-6 bg-primary/20 shadow-[0_0_5px_rgba(187,134,252,0.5)]"></div>
                
                <a 
                  href={project.liveLink} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-darktext rounded-md text-sm font-medium hover:bg-primary/80 transition-colors"
                >
                  <i className="fas fa-external-link-alt text-sm"></i>
                  <span>Live Demo</span>
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {filteredProjects.length === 0 && (
        <div className="text-center py-10">
          <p className="text-dimtext mb-4">No projects found with the selected filter.</p>
          <button 
            onClick={() => setFilter('all')} 
            className="bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-md transition-colors"
          >
            Show All Projects
          </button>
        </div>
      )}
    </div>
  );
}

export default Projects; 