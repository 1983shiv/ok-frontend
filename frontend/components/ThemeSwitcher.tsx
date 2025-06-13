"use client"

import React from 'react';
import { useTheme } from '@/context/ThemeContext';

const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme, themes } = useTheme();

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="relative">
        <select
          value={theme.name}
          onChange={(e) => setTheme(e.target.value)}
          className="px-4 py-2 rounded-md shadow-lg"
          style={{
            backgroundColor: theme.colors.card.bg,
            color: theme.colors.text,
            borderColor: theme.colors.card.border,
          }}
        >
          {themes.map((t) => (
            <option key={t.name} value={t.name}>
              {t.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ThemeSwitcher;