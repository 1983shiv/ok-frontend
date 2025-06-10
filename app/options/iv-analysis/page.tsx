"use client";

import React from 'react';
import IVAnalysisFilterBar from '@/components/charts/IVAnalysisFilterBar';
import IVAnalysisLineChart from '@/components/charts/IVAnalysisLineChart';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useTheme } from '@/context/ThemeContext';

const IVAnalysisPage: React.FC = () => {
  const { ivAnalysisData, ivAnalysisFilters } = useSelector((state: RootState) => state.chart);
  const { theme } = useTheme();
    
  return (
    <div 
      className="min-h-screen p-6"
      style={{ backgroundColor: theme.colors.background }}
    >
      <div className="max-w-7xl mx-auto">

        {/* Filter Bar */}
        <IVAnalysisFilterBar />

        {/* Header */}
        <div className="mb-8">
          <h1 
            className="text-3xl font-bold mb-2"
            style={{ color: theme.colors.text }}
          >
            Implied Volatility Analysis
          </h1>          <div className="flex flex-wrap items-center gap-4 text-sm" style={{ color: theme.colors.text }}>
            <div className="flex items-center space-x-2">
              <span className="font-medium">Symbol:</span>
              <span 
                className="font-semibold"
                style={{ color: theme.colors.accent }}
              >
                {ivAnalysisFilters.symbol}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-medium">Expiry:</span>
              <span 
                className="font-semibold"
                style={{ color: theme.colors.accent }}
              >
                {ivAnalysisFilters.expiry}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-medium">Strike:</span>
              <span 
                className="font-semibold"
                style={{ color: theme.colors.accent }}
              >
                {ivAnalysisFilters.strike.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-medium">Live:</span>
              <span className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={ivAnalysisFilters.isLive}
                  readOnly
                  className="h-3 w-3 rounded"
                  style={{ accentColor: theme.colors.chart?.idx || theme.colors.accent }}
                />
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-medium">Historical Date:</span>
              <span style={{ color: theme.colors.text, opacity: 0.7 }}>
                {ivAnalysisFilters.historicalDate}
              </span>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
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
                  Current Call IV
                </p>
                <p 
                  className="text-2xl font-bold"
                  style={{ color: theme.colors.chart?.ce || '#3B82F6' }}
                >
                  {ivAnalysisData.summary.currentCEIV.toFixed(2)}%
                </p>
              </div>
              <div 
                className="p-3 rounded-full"
                style={{ backgroundColor: theme.colors.chart?.ce ? `${theme.colors.chart.ce}20` : '#3B82F620' }}
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" style={{ color: theme.colors.chart?.ce || '#3B82F6' }}>
                  <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
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
                  Current Put IV
                </p>
                <p 
                  className="text-2xl font-bold"
                  style={{ color: theme.colors.chart?.pe || '#EF4444' }}
                >
                  {ivAnalysisData.summary.currentPEIV.toFixed(2)}%
                </p>
              </div>
              <div 
                className="p-3 rounded-full"
                style={{ backgroundColor: theme.colors.chart?.pe ? `${theme.colors.chart.pe}20` : '#EF444420' }}
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" style={{ color: theme.colors.chart?.pe || '#EF4444' }}>
                  <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
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
                  IV Skew
                </p>
                <p 
                  className="text-2xl font-bold"
                  style={{ color: theme.colors.accent }}
                >
                  {ivAnalysisData.summary.ivSkew.toFixed(2)}%
                </p>
              </div>
              <div 
                className="p-3 rounded-full"
                style={{ backgroundColor: `${theme.colors.accent}20` }}
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" style={{ color: theme.colors.accent }}>
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
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
                  Volatility Regime
                </p>
                <p 
                  className="text-2xl font-bold"
                  style={{ 
                    color: ivAnalysisData.summary.volatilityRegime === 'High' 
                      ? theme.colors.chart?.pe || '#EF4444'
                      : theme.colors.chart?.ce || '#3B82F6'
                  }}
                >
                  {ivAnalysisData.summary.volatilityRegime}
                </p>
              </div>
              <div 
                className="p-3 rounded-full"
                style={{ 
                  backgroundColor: ivAnalysisData.summary.volatilityRegime === 'High' 
                    ? theme.colors.chart?.pe ? `${theme.colors.chart.pe}20` : '#EF444420'
                    : theme.colors.chart?.ce ? `${theme.colors.chart.ce}20` : '#3B82F620'
                }}
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" style={{ 
                  color: ivAnalysisData.summary.volatilityRegime === 'High' 
                    ? theme.colors.chart?.pe || '#EF4444'
                    : theme.colors.chart?.ce || '#3B82F6'
                }}>
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="mb-8">
          <IVAnalysisLineChart />
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div 
            className="rounded-lg p-6 shadow-sm border"
            style={{
              backgroundColor: theme.colors.card.bg,
              borderColor: theme.colors.card.border
            }}
          >
            <h3 
              className="text-lg font-semibold mb-4"
              style={{ color: theme.colors.text }}
            >
              Call Options IV Statistics
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span style={{ color: theme.colors.text, opacity: 0.8 }}>Current IV:</span>
                <span 
                  className="font-semibold"
                  style={{ color: theme.colors.chart?.ce || '#3B82F6' }}
                >
                  {ivAnalysisData.summary.currentCEIV.toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: theme.colors.text, opacity: 0.8 }}>Max IV:</span>
                <span 
                  className="font-medium"
                  style={{ color: theme.colors.text }}
                >
                  {ivAnalysisData.summary.maxCEIV.toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: theme.colors.text, opacity: 0.8 }}>Min IV:</span>
                <span 
                  className="font-medium"
                  style={{ color: theme.colors.text }}
                >
                  {ivAnalysisData.summary.minCEIV.toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: theme.colors.text, opacity: 0.8 }}>Average IV:</span>
                <span 
                  className="font-medium"
                  style={{ color: theme.colors.text }}
                >
                  {ivAnalysisData.summary.avgCEIV.toFixed(2)}%
                </span>
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
            <h3 
              className="text-lg font-semibold mb-4"
              style={{ color: theme.colors.text }}
            >
              Put Options IV Statistics
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span style={{ color: theme.colors.text, opacity: 0.8 }}>Current IV:</span>
                <span 
                  className="font-semibold"
                  style={{ color: theme.colors.chart?.pe || '#EF4444' }}
                >
                  {ivAnalysisData.summary.currentPEIV.toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: theme.colors.text, opacity: 0.8 }}>Max IV:</span>
                <span 
                  className="font-medium"
                  style={{ color: theme.colors.text }}
                >
                  {ivAnalysisData.summary.maxPEIV.toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: theme.colors.text, opacity: 0.8 }}>Min IV:</span>
                <span 
                  className="font-medium"
                  style={{ color: theme.colors.text }}
                >
                  {ivAnalysisData.summary.minPEIV.toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: theme.colors.text, opacity: 0.8 }}>Average IV:</span>
                <span 
                  className="font-medium"
                  style={{ color: theme.colors.text }}
                >
                  {ivAnalysisData.summary.avgPEIV.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8">
          <div 
            className="rounded-lg p-6 shadow-sm border"
            style={{
              backgroundColor: theme.colors.card.bg,
              borderColor: theme.colors.card.border
            }}
          >
            <h3 
              className="text-lg font-semibold mb-4"
              style={{ color: theme.colors.text }}
            >
              Market Analysis
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 
                  className="font-medium mb-2"
                  style={{ color: theme.colors.text }}
                >
                  IV Trend
                </h4>
                <p 
                  className="text-sm"
                  style={{ color: theme.colors.text, opacity: 0.8 }}
                >
                  Current trend is <span 
                    className="font-semibold"
                    style={{ 
                      color: ivAnalysisData.summary.trend === 'Increasing' 
                        ? theme.colors.chart?.pe || '#EF4444'
                        : theme.colors.chart?.ce || '#3B82F6'
                    }}
                  >
                    {ivAnalysisData.summary.trend}
                  </span> based on recent price movements.
                </p>
              </div>
              <div>
                <h4 
                  className="font-medium mb-2"
                  style={{ color: theme.colors.text }}
                >
                  Volatility Environment
                </h4>
                <p 
                  className="text-sm"
                  style={{ color: theme.colors.text, opacity: 0.8 }}
                >
                  Market is in a <span 
                    className="font-semibold"
                    style={{ color: theme.colors.accent }}
                  >
                    {ivAnalysisData.summary.volatilityRegime} Volatility
                  </span> regime.
                </p>
              </div>
              <div>
                <h4 
                  className="font-medium mb-2"
                  style={{ color: theme.colors.text }}
                >
                  Last Updated
                </h4>
                <p 
                  className="text-sm"
                  style={{ color: theme.colors.text, opacity: 0.8 }}
                >
                  {ivAnalysisData.lastUpdated}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IVAnalysisPage;
