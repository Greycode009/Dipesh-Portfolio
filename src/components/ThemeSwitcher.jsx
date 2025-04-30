import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { ThemeContext, themes } from '../context/ThemeContext';
import './ThemeSwitcher.css';

const ThemeSwitcher = () => {
  const { currentTheme, changeTheme } = useContext(ThemeContext);
  
  // Theme buttons with icons and color indicators
  const themeOptions = [
    { name: 'dark', icon: '🌚', label: 'Dark', color: themes.dark.primary },
    { name: 'light', icon: '☀️', label: 'Light', color: themes.light.primary },
    { name: 'purple', icon: '😈', label: 'Purple', color: themes.purple.primary },
    { name: 'blue', icon: '🥶', label: 'Blue', color: themes.blue.primary }
  ];

  return (
    <div className="theme-switcher">
      <div className="theme-title">Theme</div>
      <div className="theme-switcher-container">
        {themeOptions.map((theme) => (
          <motion.button
            key={theme.name}
            className={`theme-button ${currentTheme === theme.name ? 'active' : ''}`}
            onClick={() => changeTheme(theme.name)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label={`Switch to ${theme.label} theme`}
            title={`${theme.label} theme`}
            style={{
              '--indicator-color': theme.color
            }}
          >
            <span className="theme-icon">{theme.icon}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default ThemeSwitcher; 