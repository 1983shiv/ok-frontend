"use client";

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { setOIGainerLooserFilters } from '@/redux/chartSlice';
import { useTheme } from '@/context/ThemeContext';

const OIGainerLooserFilterBar: React.FC = () => {
  const dispatch = useDispatch();
  const { oiGainerLooserFilters, oiGainerLooserData } = useSelector((state: RootState) => state.chart);
  const { theme } = useTheme();

  const handleFilterChange = (key: string, value: any) => {
    dispatch(setOIGainerLooserFilters({ [key]: value }));
  };

  return (
    <div className="flex flex-wrap gap-4 p-4 rounded-lg border" style={{ 
      backgroundColor: theme.colors.card.bg, 
      borderColor: theme.colors.card.border 
    }}>
      {/* Symbol Filter */}
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1" style={{ color: theme.colors.text }}>
          Symbol
        </label>        <select
          value={oiGainerLooserFilters.symbol}
          onChange={(e) => handleFilterChange('symbol', e.target.value)}
          className="px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2"
          style={{
            backgroundColor: theme.colors.secondary,
            borderColor: theme.colors.card.border,
            color: theme.colors.text
          }}
        >
          {oiGainerLooserData.symbols.map((symbol) => (
            <option key={symbol} value={symbol}>
              {symbol}
            </option>
          ))}
        </select>
      </div>

      {/* Expiry Filter */}
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1" style={{ color: theme.colors.text }}>
          Expiry
        </label>        <select
          value={oiGainerLooserFilters.expiry}
          onChange={(e) => handleFilterChange('expiry', e.target.value)}
          className="px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2"
          style={{
            backgroundColor: theme.colors.secondary,
            borderColor: theme.colors.card.border,
            color: theme.colors.text
          }}
        >
          {oiGainerLooserData.expiries.map((expiry) => (
            <option key={expiry} value={expiry}>
              {expiry}
            </option>
          ))}
        </select>
      </div>

      {/* Live/Historical Toggle */}
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1" style={{ color: theme.colors.text }}>
          Data Type
        </label>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isLive"
            checked={oiGainerLooserFilters.isLive}
            onChange={(e) => handleFilterChange('isLive', e.target.checked)}
            className="w-4 h-4 rounded"
            style={{ accentColor: theme.colors.accent }}
          />
          <label htmlFor="isLive" className="text-sm" style={{ color: theme.colors.text }}>
            Live
          </label>
        </div>
      </div>

      {/* Historical Date */}
      {!oiGainerLooserFilters.isLive && (
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1" style={{ color: theme.colors.text }}>
            Historical Date
          </label>          <input
            type="date"
            value={oiGainerLooserFilters.historicalDate}
            onChange={(e) => handleFilterChange('historicalDate', e.target.value)}
            className="px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2"
            style={{
              backgroundColor: theme.colors.secondary,
              borderColor: theme.colors.card.border,
              color: theme.colors.text
            }}
          />
        </div>
      )}

      {/* Additional Info */}
      <div className="flex flex-col justify-end">
        <div className="text-xs opacity-70" style={{ color: theme.colors.text }}>
          Last Updated: {oiGainerLooserData.lastUpdated}
        </div>
        <div className="text-xs opacity-70" style={{ color: theme.colors.text }}>
          Nifty Future: {oiGainerLooserData.currentNiftyFuture}
        </div>
      </div>
    </div>
  );
};

export default OIGainerLooserFilterBar;
