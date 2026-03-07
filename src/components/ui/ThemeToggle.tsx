import React from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const cycle = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  return (
    <button
      onClick={cycle}
      className="relative h-9 w-9 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors flex items-center justify-center"
      title={`Theme: ${theme}`}
      aria-label={`Current theme: ${theme}. Click to cycle.`}
    >
      {theme === 'light' && <Sun className="w-4 h-4" />}
      {theme === 'dark' && <Moon className="w-4 h-4" />}
      {theme === 'system' && <Monitor className="w-4 h-4" />}
    </button>
  );
};
