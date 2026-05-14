/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useEffect, useState } from 'react';

// Initialize context
export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      return saved
        ? saved === 'dark'
        : window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    return false;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
