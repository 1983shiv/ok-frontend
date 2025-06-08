"use client";

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { setStraddleAnalysisFilters } from '@/redux/chartSlice';
import { useTheme } from '@/context/ThemeContext';

const StrangleAnalysisFilterBar: React.FC = () => {
  const dispatch = useDispatch();
  const { straddleAnalysisFilters, straddleAnalysisData } = useSelector((state: RootState) => state.chart);
  const { theme } = useTheme();

  const handleFilterChange = (key: string, value: any) => {
    dispatch(setStraddleAnalysisFilters({ [key]: value }));
  };

  return (
    <div className="flex flex-wrap gap-4 mb-6 p-4 rounded-lg" style={{ backgroundColor: theme.colors.card.bg }}>
      {/* Symbol */}
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1" style={{ color: theme.colors.text }}>
          Symbol
        </label>
        <select
          value={straddleAnalysisFilters.symbol}
          onChange={(e) => handleFilterChange('symbol', e.target.value)}
          className="px-3 py-2 rounded border text-sm"
          style={{
            backgroundColor: theme.colors.secondary,
            borderColor: theme.colors.card.border,
            color: theme.colors.text
          }}
        >
          {straddleAnalysisData.symbols.map((symbol) => (
            <option key={symbol} value={symbol}>{symbol}</option>
          ))}
        </select>
      </div>

      {/* Expiry */}
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1" style={{ color: theme.colors.text }}>
          Expiry
        </label>
        <select
          value={straddleAnalysisFilters.expiry}
          onChange={(e) => handleFilterChange('expiry', e.target.value)}
          className="px-3 py-2 rounded border text-sm"
          style={{
            backgroundColor: theme.colors.secondary,
            borderColor: theme.colors.card.border,
            color: theme.colors.text
          }}
        >
          {straddleAnalysisData.expiries.map((expiry) => (
            <option key={expiry} value={expiry}>{expiry}</option>
          ))}
        </select>
      </div>

      {/* Strike CE */}
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1" style={{ color: theme.colors.text }}>
          Strike CE
        </label>
        <select
          value={straddleAnalysisFilters.strike}
          onChange={(e) => handleFilterChange('strike', parseInt(e.target.value))}
          className="px-3 py-2 rounded border text-sm"
          style={{
            backgroundColor: theme.colors.secondary,
            borderColor: theme.colors.card.border,
            color: theme.colors.text
          }}
        >
          {straddleAnalysisData.strikes.map((strike) => (
            <option key={strike} value={strike}>{strike}</option>
          ))}
        </select>
      </div>

      {/* Strike PE */}
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1" style={{ color: theme.colors.text }}>
          Strike CE
        </label>
        <select
          value={straddleAnalysisFilters.strike}
          onChange={(e) => handleFilterChange('strike', parseInt(e.target.value))}
          className="px-3 py-2 rounded border text-sm"
          style={{
            backgroundColor: theme.colors.secondary,
            borderColor: theme.colors.card.border,
            color: theme.colors.text
          }}
        >
          {straddleAnalysisData.strikes.map((strike) => (
            <option key={strike} value={strike}>{strike}</option>
          ))}
        </select>
      </div>

      {/* Live Toggle */}
      <div className="flex flex-col justify-end">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={straddleAnalysisFilters.isLive}
            onChange={(e) => handleFilterChange('isLive', e.target.checked)}
            className="rounded"
            style={{ accentColor: theme.colors.accent }}
          />
          <span className="text-sm font-medium" style={{ color: theme.colors.text }}>
            Live
          </span>
        </label>
      </div>

      {/* Historical Date */}
      {!straddleAnalysisFilters.isLive && (
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1" style={{ color: theme.colors.text }}>
            Historical Date
          </label>
          <input
            type="date"
            value={straddleAnalysisFilters.historicalDate}
            onChange={(e) => handleFilterChange('historicalDate', e.target.value)}
            className="px-3 py-2 rounded border text-sm"
            style={{
              backgroundColor: theme.colors.secondary,
              borderColor: theme.colors.card.border,
              color: theme.colors.text
            }}
          />
        </div>
      )}
    </div>
  );
};

export default StrangleAnalysisFilterBar;
