import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Import the enhanced project data
import projectsData from '../data/projectsWithCategories.json';

function ProjectsAdvanced() {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [filter, setFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortOption, setSortOption] = useState('newest');
  
  useEffect(() => {
    // Load projects data
    setProjects(projectsData);
    setFilteredProjects(projectsData);
  }, []);
  
  useEffect(() => {
    // Apply filtering and sorting when filter options change
    let results = [...projects];
    
    // Filter by technology
    if (filter !== 'all') {
      results = results.filter(project => project.technologies.includes(filter));
    }
    
    // Filter by category
    if (categoryFilter !== 'all') {
      results = results.filter(project => project.category === categoryFilter);
    }
    
    // Sort projects
    results = sortProjects(results, sortOption);
    
    setFilteredProjects(results);
  }, [filter, categoryFilter, sortOption, projects]);
  
  // Sort function
  const sortProjects = (projectsToSort, option) => {
    switch(option) {
      case 'newest':
        return [...projectsToSort].sort((a, b) => new Date(b.date) - new Date(a.date));
      case 'oldest':
        return [...projectsToSort].sort((a, b) => new Date(a.date) - new Date(b.date));
      case 'az':
        return [...projectsToSort].sort((a, b) => a.title.localeCompare(b.title));
      case 'za':
        return [...projectsToSort].sort((a, b) => b.title.localeCompare(a.title));
      default:
        return projectsToSort;
    }
  };
  
  // Get unique technologies for filter buttons
  const allTechnologies = [...new Set(projects.flatMap(project => project.technologies))];
  
  // Get unique categories
  const allCategories = [...new Set(projects.map(project => project.category))];
  
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
        className="text-lg text-dimtext text-center mb-8"
      >
        Here are some of my recent work. Feel free to check them out!
      </motion.p>
      
      {/* Advanced Filtering and Sorting Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 bg-surface/50 p-4 rounded-lg">
        <div className="mb-4 md:mb-0">
          <h3 className="text-white text-sm mb-2">Filter by Category:</h3>
          <div className="flex flex-wrap gap-2">
            <button 
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                categoryFilter === 'all' 
                  ? 'bg-primary text-darktext' 
                  : 'bg-surface text-lighttext hover:bg-primary/10 hover:text-primary'
              }`}
              onClick={() => setCategoryFilter('all')}
            >
              All
            </button>
            
            {allCategories.map(category => (
              <button 
                key={category}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                  categoryFilter === category 
                    ? 'bg-primary text-darktext' 
                    : 'bg-surface text-lighttext hover:bg-primary/10 hover:text-primary'
                }`}
                onClick={() => setCategoryFilter(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-white text-sm mb-2">Sort by:</h3>
          <select 
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="bg-surface text-white py-1 px-3 rounded-md border border-primary/30 focus:border-primary focus:outline-none"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="az">A-Z</option>
            <option value="za">Z-A</option>
          </select>
        </div>
      </div>
      
      {/* Technologies Filter */}
      <motion.div 
        className="flex flex-wrap justify-center gap-2 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        <h3 className="w-full text-center text-white text-sm mb-2">Filter by Technology:</h3>
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
      
      {/* Projects grid with animation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence>
          {filteredProjects.map((project) => (
            <motion.div 
              key={project.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="bg-surface rounded-xl overflow-hidden border border-primary/10 shadow-lg"
              whileHover={{ 
                y: -10, 
                boxShadow: '0 15px 30px rgba(187, 134, 252, 0.2)',
                transition: { duration: 0.2 } 
              }}
            >
              <div className="relative">
                <img src={project.image} alt={project.title} className="w-full h-48 object-cover" />
                <div className="absolute top-3 left-3 right-3 flex justify-between items-center">
                  <span className="bg-surface/80 backdrop-blur-sm text-primary text-xs px-3 py-1 rounded-full font-medium">
                    {project.category.charAt(0).toUpperCase() + project.category.slice(1)}
                  </span>
                  
                  {project.featured && (
                    <span className="bg-primary text-darktext text-xs px-3 py-1 rounded-full font-semibold">
                      Featured
                    </span>
                  )}
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-semibold text-white">{project.title}</h3>
                  <span className="text-xs text-dimtext">
                    {new Date(project.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short'
                    })}
                  </span>
                </div>
                
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
        </AnimatePresence>
      </div>
      
      {filteredProjects.length === 0 && (
        <div className="text-center py-10">
          <p className="text-dimtext mb-4">No projects found with the selected filters.</p>
          <div className="flex gap-2 justify-center">
            <button 
              onClick={() => setFilter('all')} 
              className="bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-md transition-colors"
            >
              Reset Technology Filter
            </button>
            <button 
              onClick={() => setCategoryFilter('all')} 
              className="bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-md transition-colors"
            >
              Reset Category Filter
            </button>
          </div>
        </div>
      )}
      
      <div className="text-center mt-12">
        <p className="text-dimtext text-sm mb-2">Want to see more of my work?</p>
        <a 
          href="https://github.com/username" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-darktext rounded-md text-sm font-medium hover:bg-primary/80 transition-colors"
        >
          <i className="fab fa-github text-lg"></i>
          <span>View More on GitHub</span>
        </a>
      </div>
    </div>
  );
}

export default ProjectsAdvanced; 