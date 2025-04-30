import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import Home from './pages/Home';
import Projects from './pages/Projects';
import About from './pages/About';
import Contact from './pages/Contact';
import SocialIcons from './components/SocialIcons';
import ThemeSwitcher from './components/ThemeSwitcher';
import { ThemeProvider } from './context/ThemeContext';
import './theme-overrides.css';
import ScrollTop from './components/ScrollTop';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <ThemeProvider>
      <BrowserRouter>
       <ScrollTop />
        <div className="min-h-screen bg-background text-lighttext">
          <button 
            className={`fixed top-6 right-6 z-50 flex flex-col justify-center items-center w-10 h-10 rounded-md bg-surface shadow-md md:hidden ${sidebarOpen ? 'rotate-90' : ''}`} 
            onClick={toggleSidebar}
          >
            <span className={`block w-6 h-0.5 bg-primary mb-1.5 transition-transform ${sidebarOpen ? 'translate-y-2 rotate-45' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-primary transition-opacity ${sidebarOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-primary mt-1.5 transition-transform ${sidebarOpen ? '-translate-y-2 -rotate-45' : ''}`}></span>
          </button>
          
          <div 
            className={`fixed inset-0 bg-black/50 z-40 transition-opacity md:hidden ${sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} 
            onClick={closeSidebar}
          ></div>
          
          <aside className={`fixed top-0 left-0 h-full w-64 bg-surface z-50 p-6 transition-transform shadow-xl md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="pt-6 pb-8 border-b">
              <h2 className="text-2xl font-bold text-primary">Dipesh Malla</h2>
              <p className="text-dimtext mt-1">Web Developer</p>
            </div>
            <nav className="my-8">
              <ul className="space-y-4">
                <li>
                  <NavLink to="/" 
                    className={({isActive}) => 
                      isActive ? "block py-2 px-4 bg-primary/10 text-primary rounded-md transition-colors" 
                              : "block py-2 px-4 hover:bg-primary/10 hover:text-primary rounded-md transition-colors text-lighttext"
                    } 
                    onClick={closeSidebar}
                  >
                    Home
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/projects" 
                    className={({isActive}) => 
                      isActive ? "block py-2 px-4 bg-primary/10 text-primary rounded-md transition-colors" 
                              : "block py-2 px-4 hover:bg-primary/10 hover:text-primary rounded-md transition-colors text-lighttext"
                    } 
                    onClick={closeSidebar}
                  >
                    Projects
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/about" 
                    className={({isActive}) => 
                      isActive ? "block py-2 px-4 bg-primary/10 text-primary rounded-md transition-colors" 
                              : "block py-2 px-4 hover:bg-primary/10 hover:text-primary rounded-md transition-colors text-lighttext"
                    } 
                    onClick={closeSidebar}
                  >
                    About
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/contact" 
                    className={({isActive}) => 
                      isActive ? "block py-2 px-4 bg-primary/10 text-primary rounded-md transition-colors" 
                              : "block py-2 px-4 hover:bg-primary/10 hover:text-primary rounded-md transition-colors text-lighttext"
                    } 
                    onClick={closeSidebar}
                  >
                    Contact
                  </NavLink>
                </li>
              </ul>
            </nav>
            
            {/* Theme Switcher */}
            <div className="mb-4 px-2">
              <ThemeSwitcher />
            </div>
            
            <div className="mt-auto pt-6 border-t">
              <SocialIcons className="flex justify-center space-x-4" />
            </div>
          </aside>

          {/* Shadow divider between sidebar and content */}
          <div className="fixed top-0 left-64 h-full w-1 bg-gradient-to-r from-background/80 to-transparent shadow-[5px_0_15px_rgba(0,0,0,0.3)] z-40 hidden md:block"></div>
          
          <main className="md:pl-64 min-h-screen">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App; 