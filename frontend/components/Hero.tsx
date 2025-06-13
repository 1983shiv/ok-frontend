import React from 'react';
import { useTheme } from '@/context/ThemeContext';

const Hero: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div
      className="py-16 px-4"
      style={{ backgroundColor: theme.colors.background }}
    >
      <div className="container mx-auto text-center">
        <h1
          className="text-4xl md:text-5xl font-bold mb-6"
          style={{ color: theme.colors.text, fontFamily: theme.fonts.primary }}
        >
          Most Advanced & Traders friendly Options Analysis Tool
        </h1>
        <p
          className="text-xl md:text-2xl mb-8"
          style={{ color: theme.colors.text, fontFamily: theme.fonts.primary }}
        >
          Unlock the Future of Trading with Advanced Charts and in-Depth Analysis
        </p>
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {['O1 Data', 'Trending Strikes', 'Call vs Put'].map((item) => (
            <span
              key={item}
              className="px-4 py-2 font-medium rounded-md"
              style={{
                backgroundColor: theme.colors.card.bg,
                color: theme.colors.text,
                borderColor: theme.colors.card.border,
                fontFamily: theme.fonts.primary,
              }}
            >
              {item}
            </span>
          ))}
        </div>
        <div
          className="h-px w-full max-w-2xl mx-auto my-8"
          style={{ backgroundColor: theme.colors.divider }}
        ></div>
      </div>
    </div>
  );
};

export default Hero;