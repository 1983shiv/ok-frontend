"use client";

import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import StraddleAnalysisFilterBar from '@/components/charts/StraddleAnalysisFilterBar';
import StraddlePriceLineChart from '@/components/charts/StraddlePriceLineChart';

const StraddleAnalysisPage: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: theme.colors.background }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 
            className="text-3xl font-bold mb-2" 
            style={{ color: theme.colors.text }}
          >
            Straddle
          </h1>
          <p 
            className="text-sm" 
            style={{ color: theme.colors.text, opacity: 0.7 }}
          >
            As of 15:30 Expiry 12-06-2025
          </p>
        </div>

        {/* Filter Bar */}
        <StraddleAnalysisFilterBar />

        {/* Chart Section */}
        <div 
          className="rounded-lg p-6 shadow-lg"
          style={{ 
            backgroundColor: theme.colors.card.bg,
            borderColor: theme.colors.card.border,
            border: `1px solid ${theme.colors.card.border}`
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span 
                  className="text-sm font-medium"
                  style={{ color: theme.colors.text }}
                >
                  Straddle
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 border-2 border-white border-dashed rounded-full"></div>
                <span 
                  className="text-sm font-medium"
                  style={{ color: theme.colors.text }}
                >
                  VWAP
                </span>
              </div>
            </div>
          </div>
          
          {/* Chart Container */}
          <div className="h-96 w-full">
            <StraddlePriceLineChart />
          </div>
          
          {/* Note */}
          <div className="mt-4 text-xs" style={{ color: theme.colors.text, opacity: 0.6 }}>
            Note: In the case of illiquid options, the chart may not accurately represent the available data
          </div>
        </div>
      </div>
    </div>
  );
};

export default StraddleAnalysisPage;
