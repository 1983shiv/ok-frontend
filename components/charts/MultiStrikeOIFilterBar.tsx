"use client";

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { setMultiStrikeOIFilters } from '@/redux/chartSlice';
import { useTheme } from '@/context/ThemeContext';

const MultiStrikeOIFilterBar: React.FC = () => {
  const dispatch = useDispatch();
  const { multiStrikeOIFilters, multiStrikeOIData } = useSelector((state: RootState) => state.chart);
  const { theme } = useTheme();

  const handleFilterChange = (key: string, value: any) => {
    dispatch(setMultiStrikeOIFilters({ [key]: value }));
  };

  const handleStrikeToggle = (strikeKey: string) => {
    const currentStrike = multiStrikeOIFilters[strikeKey as keyof typeof multiStrikeOIFilters] as { value: number; enabled: boolean };
    handleFilterChange(strikeKey, {
      ...currentStrike,
      enabled: !currentStrike.enabled
    });
  };

  const handleStrikeValueChange = (strikeKey: string, value: number) => {
    const currentStrike = multiStrikeOIFilters[strikeKey as keyof typeof multiStrikeOIFilters] as { value: number; enabled: boolean };
    handleFilterChange(strikeKey, {
      ...currentStrike,
      value: value
    });
  };

  return (
    <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: theme.colors.card.bg, borderColor: theme.colors.card.border, border: '1px solid' }}>
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 gap-4 items-end">
        {/* Symbol */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.text }}>
            Symbol
          </label>
          <select
            value={multiStrikeOIFilters.symbol}
            onChange={(e) => handleFilterChange('symbol', e.target.value)}
            className="w-full px-3 py-2 rounded border focus:outline-none focus:ring-2"
            style={{
              backgroundColor: theme.colors.background,
              color: theme.colors.text,
              borderColor: theme.colors.card.border
            }}
          >
            {multiStrikeOIData.symbols.map((symbol: string) => (
              <option key={symbol} value={symbol}>{symbol}</option>
            ))}
          </select>
        </div>

        {/* Expiry */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.text }}>
            Expiry
          </label>
          <select
            value={multiStrikeOIFilters.expiry}
            onChange={(e) => handleFilterChange('expiry', e.target.value)}
            className="w-full px-3 py-2 rounded border focus:outline-none focus:ring-2"
            style={{
              backgroundColor: theme.colors.background,
              color: theme.colors.text,
              borderColor: theme.colors.card.border
            }}
          >
            {multiStrikeOIData.expiries.map((expiry: string) => (
              <option key={expiry} value={expiry}>{expiry}</option>
            ))}
          </select>
        </div>

        {/* Live Toggle */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.text }}>
            Live
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={multiStrikeOIFilters.isLive}
              onChange={(e) => handleFilterChange('isLive', e.target.checked)}
              className="mr-2"
            />
            <span style={{ color: theme.colors.text }}>Live Data</span>
          </label>
        </div>

        {/* Historical Date */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.text }}>
            Historical Date
          </label>
          <input
            type="date"
            value={multiStrikeOIFilters.historicalDate}
            onChange={(e) => handleFilterChange('historicalDate', e.target.value)}
            disabled={multiStrikeOIFilters.isLive}
            className="w-full px-3 py-2 rounded border focus:outline-none focus:ring-2"
            style={{
              backgroundColor: theme.colors.background,
              color: theme.colors.text,
              borderColor: theme.colors.card.border
            }}
          />
        </div>

        {/* Overall OI Toggle */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.text }}>
            Overall OI
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={multiStrikeOIFilters.overallOI}
              onChange={(e) => handleFilterChange('overallOI', e.target.checked)}
              className="mr-2"
            />
            <span style={{ color: theme.colors.text }}>Combined</span>
          </label>
        </div>
      </div>

      {/* Strike Prices */}
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-3" style={{ color: theme.colors.text }}>Multiple Strikes Open Interest</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {(['strike1', 'strike2', 'strike3', 'strike4', 'strike5'] as const).map((strikeKey, index) => {
            const strike = multiStrikeOIFilters[strikeKey];
            return (
              <div key={strikeKey} className="space-y-2">
                <label className="block text-sm font-medium" style={{ color: theme.colors.text }}>
                  Strike {index + 1}
                </label>
                <div className="flex items-center space-x-2">
                  <select
                    value={strike.value}
                    onChange={(e) => handleStrikeValueChange(strikeKey, Number(e.target.value))}
                    className="flex-1 px-2 py-1 rounded border text-sm focus:outline-none focus:ring-2"
                    style={{
                      backgroundColor: theme.colors.background,
                      color: theme.colors.text,
                      borderColor: theme.colors.card.border
                    }}
                  >
                    {multiStrikeOIData.availableStrikes.map((strikeValue: number) => (
                      <option key={strikeValue} value={strikeValue}>
                        {strikeValue.toFixed(2)}
                      </option>
                    ))}
                  </select>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={strike.enabled}
                      onChange={() => handleStrikeToggle(strikeKey)}
                      className="w-4 h-4"
                    />
                  </label>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MultiStrikeOIFilterBar;
