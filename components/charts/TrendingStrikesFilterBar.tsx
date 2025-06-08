"use client";

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { setTrendingStrikesFilters } from '@/redux/chartSlice';
import { useTheme } from '@/context/ThemeContext';

const TrendingStrikesFilterBar: React.FC = () => {
  const dispatch = useDispatch();
  const { trendingStrikesFilters, trendingStrikesData } = useSelector((state: RootState) => state.chart);
  const { theme } = useTheme();

  return (
    <div 
      className="rounded-lg p-4 shadow-sm border mb-6"
      style={{
        backgroundColor: theme.colors.card.bg,
        borderColor: theme.colors.card.border
      }}
    >
      <div className="flex flex-wrap items-center gap-4">
        {/* Symbol */}
        <div className="flex flex-col">
          <label 
            className="text-sm font-medium mb-1"
            style={{ color: theme.colors.text }}
          >
            Symbol
          </label>
          <select
            value={trendingStrikesFilters.symbol}
            onChange={(e) => dispatch(setTrendingStrikesFilters({ symbol: e.target.value }))}
            className="px-3 py-2 border rounded-md text-sm min-w-24"
            style={{
              backgroundColor: theme.colors.card.bg,
              borderColor: theme.colors.card.border,
              color: theme.colors.text
            }}
          >
            {trendingStrikesData.symbols.map((symbol) => (
              <option key={symbol} value={symbol}>
                {symbol}
              </option>
            ))}
          </select>
        </div>

        {/* Expiry */}
        <div className="flex flex-col">
          <label 
            className="text-sm font-medium mb-1"
            style={{ color: theme.colors.text }}
          >
            Expiry
          </label>
          <select
            value={trendingStrikesFilters.expiry}
            onChange={(e) => dispatch(setTrendingStrikesFilters({ expiry: e.target.value }))}
            className="px-3 py-2 border rounded-md text-sm min-w-32"
            style={{
              backgroundColor: theme.colors.card.bg,
              borderColor: theme.colors.card.border,
              color: theme.colors.text
            }}
          >
            {trendingStrikesData.expiries.map((expiry) => (
              <option key={expiry} value={expiry}>
                {expiry}
              </option>
            ))}
          </select>
        </div>

        {/* Interval */}
        <div className="flex flex-col">
          <label 
            className="text-sm font-medium mb-1"
            style={{ color: theme.colors.text }}
          >
            Interval
          </label>
          <select
            value={trendingStrikesFilters.interval}
            onChange={(e) => dispatch(setTrendingStrikesFilters({ interval: e.target.value }))}
            className="px-3 py-2 border rounded-md text-sm min-w-20"
            style={{
              backgroundColor: theme.colors.card.bg,
              borderColor: theme.colors.card.border,
              color: theme.colors.text
            }}
          >
            {trendingStrikesData.intervals.map((interval) => (
              <option key={interval} value={interval}>
                {interval}
              </option>
            ))}
          </select>
        </div>

        {/* Live Toggle */}
        <div className="flex flex-col">
          <label 
            className="text-sm font-medium mb-1"
            style={{ color: theme.colors.text }}
          >
            Live
          </label>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={trendingStrikesFilters.isLive}
              onChange={(e) => dispatch(setTrendingStrikesFilters({ isLive: e.target.checked }))}
              className="w-4 h-4 rounded"
              style={{
                accentColor: theme.colors.accent
              }}
            />
            <span 
              className="ml-2 text-sm"
              style={{ color: theme.colors.text }}
            >
              {trendingStrikesFilters.isLive ? 'On' : 'Off'}
            </span>
          </div>
        </div>

        {/* Historical Date */}
        <div className="flex flex-col">
          <label 
            className="text-sm font-medium mb-1"
            style={{ color: theme.colors.text }}
          >
            Historical Date
          </label>
          <input
            type="date"
            value={trendingStrikesFilters.historicalDate}
            onChange={(e) => dispatch(setTrendingStrikesFilters({ historicalDate: e.target.value }))}
            className="px-3 py-2 border rounded-md text-sm"
            style={{
              backgroundColor: theme.colors.card.bg,
              borderColor: theme.colors.card.border,
              color: theme.colors.text
            }}
            disabled={trendingStrikesFilters.isLive}
          />
        </div>

        {/* Last Updated Info */}
        <div className="flex flex-col justify-end ml-auto">
          <span 
            className="text-xs"
            style={{ color: theme.colors.text, opacity: 0.7 }}
          >
            As of 15:30 Expiry 12-06-2025
          </span>
        </div>
      </div>
    </div>
  );
};

export default TrendingStrikesFilterBar;
