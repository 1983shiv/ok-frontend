"use client";

import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import MultiStrikeOIFilterBar from '@/components/charts/MultiStrikeOIFilterBar';
import MultiStrikeOILineChart from '@/components/charts/MultiStrikeOILineChart';

const MultiStrikeOIPage: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: theme.colors.background }}>
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2" style={{ color: theme.colors.text }}>
            Multiple Strikes Open Interest
          </h1>
          <p className="text-lg opacity-80" style={{ color: theme.colors.text }}>
            Analyze open interest patterns across multiple strike prices
          </p>
        </div>

        {/* Filter Bar */}
        <MultiStrikeOIFilterBar />

        {/* Chart Section */}
        <div className="grid grid-cols-1 gap-6">
          <div 
            className="p-6 rounded-lg"
            style={{ 
              backgroundColor: theme.colors.card.bg, 
              borderColor: theme.colors.card.border,
              border: '1px solid'
            }}
          >
            <div className="mb-4">
              <h2 className="text-xl font-semibold" style={{ color: theme.colors.text }}>
                Open Interest
              </h2>
              <p className="text-sm opacity-70 mt-1" style={{ color: theme.colors.text }}>
                Note: In the case of illiquid options, the chart may not accurately represent the available data.
              </p>
            </div>
            <MultiStrikeOILineChart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiStrikeOIPage;
