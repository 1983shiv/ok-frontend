import React from 'react';
import { useTheme } from '@/context/ThemeContext';

const ChartNavigation: React.FC = () => {
  const { theme } = useTheme();

  const sections = [
    {
      title: 'Futures',
      items: ['Future Analysis', 'Long vs. Short', 'Price vs. OI'],
    },
    {
      title: 'O1 Analysis',
      items: [
        'Trending Strikes',
        'Call Vs Put O1',
        'Put Call Ratio',
        'ATM Premium',
        'Implied Volatility',
        'Multi-Scribe O1',
        'O1 Internal Value',
        'Premium Dietary',
        'Long & Short',
        'Price Vs O1',
      ],
    },
  ];

  return (
    <div
      className="py-12 px-4"
      style={{ backgroundColor: theme.colors.background }}
    >
      <div className="container mx-auto">
        <h2
          className="text-2xl font-bold mb-8 text-center"
          style={{ color: theme.colors.text, fontFamily: theme.fonts.primary }}
        >
          OptionKart - (OK)
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {sections.map((section, index) => (
            <div
              key={index}
              className="rounded-lg p-6"
              style={{
                backgroundColor: theme.colors.card.bg,
                borderColor: theme.colors.card.border,
              }}
            >
              <h3
                className="text-xl font-bold mb-4"
                style={{ color: theme.colors.text, fontFamily: theme.fonts.primary }}
              >
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.items.map((item, i) => (
                  <li
                    key={i}
                    className="py-2 px-3 rounded hover:bg-opacity-20"
                    style={{
                      color: theme.colors.text,
                      fontFamily: theme.fonts.primary,
                      backgroundColor: `${theme.colors.accent}20`,
                      borderLeft: `3px solid ${theme.colors.accent}`,
                    }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChartNavigation;