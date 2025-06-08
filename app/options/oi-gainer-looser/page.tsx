'use client';

import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import OIGainerLooserFilterBar from '@/components/charts/OIGainerLooserFilterBar';
import OIGainerBarChart from '@/components/charts/OIGainerBarChart';
import OILooserBarChart from '@/components/charts/OILooserBarChart';

export default function OIGainerLooserPage() {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen p-4" style={{ backgroundColor: theme.colors.background }}>
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2" style={{ color: theme.colors.text }}>
            Open Interest for Intervals
          </h1>
          <p className="text-sm opacity-70" style={{ color: theme.colors.text }}>
            As of 15:30 Expiry 12-06-2025
          </p>
        </div>

        {/* Filter Bar */}
        <div className="mb-6">
          <OIGainerLooserFilterBar />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* OI Gainer Charts Row */}
          <div 
            className="p-6 rounded-lg border"
            style={{ 
              backgroundColor: theme.colors.card.bg, 
              borderColor: theme.colors.card.border 
            }}
          >
            <OIGainerBarChart interval="15Min" title="OI Gainer 15 Min" />
          </div>
          
          <div 
            className="p-6 rounded-lg border"
            style={{ 
              backgroundColor: theme.colors.card.bg, 
              borderColor: theme.colors.card.border 
            }}
          >
            <OIGainerBarChart interval="60Min" title="OI Gainer 60 Min" />
          </div>
          
          <div 
            className="p-6 rounded-lg border"
            style={{ 
              backgroundColor: theme.colors.card.bg, 
              borderColor: theme.colors.card.border 
            }}
          >
            <OIGainerBarChart interval="Day" title="OI Gainer Day" />
          </div>
        </div>

        {/* OI Looser Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div 
            className="p-6 rounded-lg border"
            style={{ 
              backgroundColor: theme.colors.card.bg, 
              borderColor: theme.colors.card.border 
            }}
          >
            <OILooserBarChart interval="15Min" title="OI Looser 15 Min" />
          </div>
          
          <div 
            className="p-6 rounded-lg border"
            style={{ 
              backgroundColor: theme.colors.card.bg, 
              borderColor: theme.colors.card.border 
            }}
          >
            <OILooserBarChart interval="60Min" title="OI Looser 60 Min" />
          </div>
          
          <div 
            className="p-6 rounded-lg border"
            style={{ 
              backgroundColor: theme.colors.card.bg, 
              borderColor: theme.colors.card.border 
            }}
          >
            <OILooserBarChart interval="Day" title="OI Looser Day" />
          </div>
        </div>
      </div>
    </div>
  );
}
