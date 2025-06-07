import React from 'react';
import { useTheme } from '@/context/ThemeContext';

const Footer: React.FC = () => {
  const { theme } = useTheme();

  return (
    <footer
      className="py-8 px-4 border-t"
      style={{
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.card.border,
      }}
    >
      <div className="container mx-auto text-center">
        <p
          className="text-sm"
          style={{ color: theme.colors.text, fontFamily: theme.fonts.primary }}
        >
          © 2025 O1 Data. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;