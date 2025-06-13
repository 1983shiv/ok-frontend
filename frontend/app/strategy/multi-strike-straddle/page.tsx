"use client";

import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import MultiStrikeStraddleFilterBar from '@/components/charts/MultiStrikeStraddleFilterBar';
import MultiStrikeStraddleLineChart from '@/components/charts/MultiStrikeStraddleLineChart';

const MultiStrikeStraddlePage: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen p-4" style={{ backgroundColor: theme.colors.background }}>
      <div className="max-w-7xl mx-auto">

        {/* Filter Bar */}
        <MultiStrikeStraddleFilterBar />

        {/* Chart Section */}
        <div 
          className="rounded-lg p-6 shadow-lg"
          style={{ 
            backgroundColor: theme.colors.card.bg,
            borderColor: theme.colors.card.border,
            borderWidth: '1px'
          }}
        >
          {/* Chart Header with Legend and Time */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#22d3ee' }}></div>
                <span 
                  className="text-sm font-medium"
                  style={{ color: theme.colors.text }}
                >
                  24900.00
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#facc15' }}></div>
                <span 
                  className="text-sm font-medium"
                  style={{ color: theme.colors.text }}
                >
                  25000.00
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#a78bfa' }}></div>
                <span 
                  className="text-sm font-medium"
                  style={{ color: theme.colors.text }}
                >
                  25100.00
                </span>
              </div>
            </div>
            <div className="text-sm font-medium" style={{ color: theme.colors.text }}>
              As on 15:30
            </div>
          </div>
            {/* Chart Container */}
          <div className="h-[400px] w-full">
            <MultiStrikeStraddleLineChart />
          </div>
          
          {/* Note */}
          <div className="mt-4 text-xs" style={{ color: theme.colors.text, opacity: 0.6 }}>
            Note: In the case of illiquid options, the chart may not accurately represent the available data.
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiStrikeStraddlePage;
