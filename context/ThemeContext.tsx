"use client"

import React, { createContext, useContext, useState } from 'react';

type Theme = {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    chart?: {
      ce: string;
      pe: string;
    };
    button: {
      bg: string;
      text: string;
      hover: string;
    };
    card: {
      bg: string;
      border: string;
    };
    divider: string;
  };
  fonts: {
    primary: string;
    secondary: string;
  };
};

const themes: Theme[] = [
  {
    name: 'Trading Dark',
    colors: {
      primary: '#0f172a',
      secondary: '#1e293b',
      accent: '#3b82f6',
      background: '#0f172a',
      text: '#f8fafc',
      button: {
        bg: '#3b82f6',
        text: '#ffffff',
        hover: '#60a5fa',
      },
      card: {
        bg: '#1e293b',
        border: '#334155',
      },
      divider: '#334155',
      chart: {
        ce: '#3b82f6', // blue-500 - Calls
        pe: '#ef4444', // red-500 - Puts
      },
    },
    fonts: {
      primary: 'Inter, sans-serif',
      secondary: 'Roboto, sans-serif',
    },
  },
  {
    name: 'Trading Light',
    colors: {
      primary: '#ffffff',
      secondary: '#f8fafc',
      accent: '#2563eb',
      background: '#ffffff',
      text: '#1e293b',
      button: {
        bg: '#2563eb',
        text: '#ffffff',
        hover: '#3b82f6',
      },
      card: {
        bg: '#f8fafc',
        border: '#e2e8f0',
      },
      divider: '#e2e8f0',
      chart: {
        ce: '#2563eb', // blue-600 - Calls
        pe: '#dc2626', // red-600 - Puts
      },
    },
    fonts: {
      primary: 'Inter, sans-serif',
      secondary: 'Roboto, sans-serif',
    },
  },
  {
    name: 'Professional Blue',
    colors: {
      primary: '#1e3a8a',
      secondary: '#1e40af',
      accent: '#60a5fa',
      background: '#1e3a8a',
      text: '#e0f2fe',
      button: {
        bg: '#60a5fa',
        text: '#1e3a8a',
        hover: '#93c5fd',
      },
      card: {
        bg: '#1e40af',
        border: '#3b82f6',
      },
      divider: '#3b82f6',
      chart: {
        ce: '#93c5fd', // blue-300 - Calls (lighter for better contrast)
        pe: '#fca5a5', // red-300 - Puts
      },
    },
    fonts: {
      primary: 'Inter, sans-serif',
      secondary: 'Roboto, sans-serif',
    },
  },
  {
    name: 'Market Green',
    colors: {
      primary: '#064e3b',
      secondary: '#047857',
      accent: '#10b981',
      background: '#064e3b',
      text: '#d1fae5',
      button: {
        bg: '#10b981',
        text: '#064e3b',
        hover: '#34d399',
      },
      card: {
        bg: '#047857',
        border: '#059669',
      },
      divider: '#059669',
      chart: {
        ce: '#22d3ee', // cyan-400 - Calls
        pe: '#f87171', // red-400 - Puts
      },
    },
    fonts: {
      primary: 'Inter, sans-serif',
      secondary: 'Roboto, sans-serif',
    },
  },
  {
    name: 'Finance Purple',
    colors: {
      primary: '#5b21b6',
      secondary: '#6d28d9',
      accent: '#a78bfa',
      background: '#5b21b6',
      text: '#ede9fe',
      button: {
        bg: '#a78bfa',
        text: '#5b21b6',
        hover: '#c4b5fd',
      },
      card: {
        bg: '#6d28d9',
        border: '#8b5cf6',
      },
      divider: '#8b5cf6',
      chart: {
        ce: '#818cf8', // indigo-400 - Calls
        pe: '#f472b6', // pink-400 - Puts
      },
    },
    fonts: {
      primary: 'Inter, sans-serif',
      secondary: 'Roboto, sans-serif',
    },
  },
];

const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (themeName: string) => void;
  themes: Theme[];
}>({
  theme: themes[0],
  setTheme: () => {},
  themes,
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setCurrentTheme] = useState<Theme>(themes[0]);

  const setTheme = (themeName: string) => {
    const newTheme = themes.find((t) => t.name === themeName) || themes[0];
    setCurrentTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);