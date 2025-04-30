import React, { createContext, useState, useEffect } from 'react';

// Available themes
export const themes = {
  dark: {
    name: 'dark',
    background: '#121212',
    surface: '#1f1f1f',
    text: '#ffffff',
    dimText: '#bbbbbb',
    primary: '#bb86fc',
    secondary: '#9d4edd',
    darkText: '#121212',
    border: '#333333',
  },
  light: {
    name: 'light',
    background: '#f6eef7',
    surface: '#ffffff',
    text: '#212529',
    dimText: '#6c757d',
    primary: '#6200ee',
    secondary: '#03dac6',
    darkText: '#ffffff',
    border: '#dee2e6',
  },
  purple: {
    name: 'purple',
    background: '#2d1b69',
    surface: '#3d2a7d',
    text: '#ffffff',
    dimText: '#cccccc',
    primary: '#e9a6ff',
    secondary: '#9d4edd',
    darkText: '#121212',
    border: '#4a3480',
  },
  blue: {
    name: 'blue',
    background: '#16213e',
    surface: '#0f3460',
    text: '#ffffff',
    dimText: '#cccccc',
    primary: '#00b4d8',
    secondary: '#154784',
    darkText: '#121212',
    border: '#1a3b5f',
  }
};

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Get theme from localStorage or default to dark theme
  const [currentTheme, setCurrentTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme && themes[savedTheme] ? savedTheme : 'dark';
  });

  // Apply theme to document
  const applyTheme = (themeName) => {
    const theme = themes[themeName];
    const root = document.documentElement;
    
    // Update CSS variables
    root.style.setProperty('--color-background', theme.background);
    root.style.setProperty('--color-surface', theme.surface);
    root.style.setProperty('--color-text', theme.text);
    root.style.setProperty('--color-dimtext', theme.dimText);
    root.style.setProperty('--color-primary', theme.primary);
    root.style.setProperty('--color-secondary', theme.secondary);
    root.style.setProperty('--color-darktext', theme.darkText);
    root.style.setProperty('--color-border', theme.border);
    
    // Additional CSS variables for transparency
    root.style.setProperty('--color-primary-10', `rgba(${hexToRgb(theme.primary)}, 0.1)`);
    root.style.setProperty('--color-primary-20', `rgba(${hexToRgb(theme.primary)}, 0.2)`);
    root.style.setProperty('--color-primary-30', `rgba(${hexToRgb(theme.primary)}, 0.3)`);
    
    // Add theme name as class to body for additional CSS targeting
    document.body.className = '';
    document.body.classList.add(`theme-${themeName}`);
  };

  // Helper function to convert hex to rgb
  const hexToRgb = (hex) => {
    // Remove # if present
    hex = hex.replace('#', '');
    
    // Parse hex values
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    return `${r}, ${g}, ${b}`;
  };

  // Update theme in localStorage when it changes
  useEffect(() => {
    localStorage.setItem('theme', currentTheme);
    applyTheme(currentTheme);
  }, [currentTheme]);

  // Apply the theme on initial load
  useEffect(() => {
    applyTheme(currentTheme);
  }, []);

  // Function to change theme
  const changeTheme = (themeName) => {
    if (themes[themeName]) {
      setCurrentTheme(themeName);
    }
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, changeTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
}; 