import React from 'react';

function ThemeToggle({ darkMode, onToggle }) {
  return (
    <button className="theme-toggle" onClick={() => onToggle(!darkMode)}>
      {darkMode ? '☀️' : '🌙'}
    </button>
  );
}

export default ThemeToggle;
