"use client";

import React from 'react';
import COIAnalysisFilterBar from '@/components/charts/COIAnalysisFilterBar';
import COIBarChart from '@/components/charts/COIBarChart';
import OIBarChart from '@/components/charts/OIBarChart';
import COINiftyLineChart from '@/components/charts/COINiftyLineChart';
import OINiftyLineChart from '@/components/charts/OINiftyLineChart';
import OIDifferenceLineChart from '@/components/charts/OIDifferenceLineChart';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useTheme } from '@/context/ThemeContext';

const COIAnalysisPage: React.FC = () => {
  const { coiAnalysisData } = useSelector((state: RootState) => state.chart);
  const { theme } = useTheme();
    
  return (
    <div 
      className="min-h-screen p-6"
      style={{ backgroundColor: theme.colors.background }}
    >
      <div className="max-w-7xl mx-auto">

        {/* Filter Bar */}
        <COIAnalysisFilterBar />        {/* Header */}
        <div className="mb-8">
          <h1 
            className="text-3xl font-bold mb-2"
            style={{ color: theme.colors.text }}
          >
            Call vs Put OI Analysis
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm" style={{ color: theme.colors.text }}>            <div className="flex items-center space-x-2">
              <span className="font-medium">NIFTY Future:</span>
              <span 
                className="font-semibold"
                style={{ color: theme.colors.chart?.idx || theme.colors.accent }}
              >
                {coiAnalysisData.currentNiftyFuture.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-medium">PCR:</span>
              <span 
                className="font-semibold"
                style={{ color: theme.colors.chart?.pe || '#8B5CF6' }}
              >
                {coiAnalysisData.summary.pcr}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-medium">Max Pain:</span>
              <span 
                className="font-semibold"
                style={{ color: theme.colors.accent }}
              >
                {coiAnalysisData.summary.maxPain}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-medium">Market Sentiment:</span>
              <span className={`font-semibold ${
                coiAnalysisData.summary.sentiment === 'Bullish' 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {coiAnalysisData.summary.sentiment}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-medium">Last Updated:</span>
              <span style={{ color: theme.colors.text, opacity: 0.7 }}>
                {coiAnalysisData.lastUpdated}
              </span>
            </div>
          </div>
        </div>        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div 
            className="rounded-lg p-6 shadow-sm border"
            style={{
              backgroundColor: theme.colors.card.bg,
              borderColor: theme.colors.card.border
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p 
                  className="text-sm font-medium"
                  style={{ color: theme.colors.text, opacity: 0.8 }}
                >
                  Total Call COI
                </p>
                <p 
                  className="text-2xl font-bold"
                  style={{ color: theme.colors.chart?.ce || '#10B981' }}
                >
                  {coiAnalysisData.summary.totalChangeInOI.call}K
                </p>
              </div>
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ 
                  backgroundColor: theme.colors.chart?.ce ? `${theme.colors.chart.ce}20` : '#10B98120' 
                }}
              >
                <svg 
                  className="w-6 h-6" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  style={{ color: theme.colors.chart?.ce || '#10B981' }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                </svg>
              </div>
            </div>
          </div>

          <div 
            className="rounded-lg p-6 shadow-sm border"
            style={{
              backgroundColor: theme.colors.card.bg,
              borderColor: theme.colors.card.border
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p 
                  className="text-sm font-medium"
                  style={{ color: theme.colors.text, opacity: 0.8 }}
                >
                  Total Put COI
                </p>
                <p 
                  className="text-2xl font-bold"
                  style={{ color: theme.colors.chart?.pe || '#EF4444' }}
                >
                  {coiAnalysisData.summary.totalChangeInOI.put}K
                </p>
              </div>
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ 
                  backgroundColor: theme.colors.chart?.pe ? `${theme.colors.chart.pe}20` : '#EF444420' 
                }}
              >
                <svg 
                  className="w-6 h-6" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  style={{ color: theme.colors.chart?.pe || '#EF4444' }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                </svg>
              </div>
            </div>
          </div>

          <div 
            className="rounded-lg p-6 shadow-sm border"
            style={{
              backgroundColor: theme.colors.card.bg,
              borderColor: theme.colors.card.border
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p 
                  className="text-sm font-medium"
                  style={{ color: theme.colors.text, opacity: 0.8 }}
                >
                  Total Call OI
                </p>
                <p 
                  className="text-2xl font-bold"
                  style={{ color: theme.colors.chart?.ce || '#10B981' }}
                >
                  {coiAnalysisData.summary.totalOI.call}K
                </p>
              </div>
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ 
                  backgroundColor: theme.colors.chart?.ce ? `${theme.colors.chart.ce}20` : '#10B98120' 
                }}
              >
                <svg 
                  className="w-6 h-6" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  style={{ color: theme.colors.chart?.ce || '#10B981' }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>

          <div 
            className="rounded-lg p-6 shadow-sm border"
            style={{
              backgroundColor: theme.colors.card.bg,
              borderColor: theme.colors.card.border
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p 
                  className="text-sm font-medium"
                  style={{ color: theme.colors.text, opacity: 0.8 }}
                >
                  Total Put OI
                </p>
                <p 
                  className="text-2xl font-bold"
                  style={{ color: theme.colors.chart?.pe || '#EF4444' }}
                >
                  {coiAnalysisData.summary.totalOI.put}K
                </p>
              </div>
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ 
                  backgroundColor: theme.colors.chart?.pe ? `${theme.colors.chart.pe}20` : '#EF444420' 
                }}
              >
                <svg 
                  className="w-6 h-6" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  style={{ color: theme.colors.chart?.pe || '#EF4444' }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="space-y-8">
          {/* Bar Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-[25%_75%] gap-8">
                <COIBarChart />
                <COINiftyLineChart />
            </div>

          {/* Line Charts space-y-8*/}
          <div className="grid grid-cols-1 lg:grid-cols-[25%_75%] gap-8 space-y-4">
            
            <OIBarChart />
            <OINiftyLineChart />
            
          </div>
          <div className="space-y-4">
            <OIDifferenceLineChart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default COIAnalysisPage;
