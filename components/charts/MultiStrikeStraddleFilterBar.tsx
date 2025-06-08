"use client";

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { setMultiStrikeStraddleFilters } from '@/redux/chartSlice';
import { useTheme } from '@/context/ThemeContext';

const MultiStrikeStraddleFilterBar: React.FC = () => {
  const dispatch = useDispatch();
  const { multiStrikeStraddleFilters, multiStrikeStraddleData } = useSelector((state: RootState) => state.chart);
  const { theme } = useTheme();

  const handleFilterChange = (key: string, value: any) => {
    dispatch(setMultiStrikeStraddleFilters({ [key]: value }));
  };

  const handleStrikeChange = (strikeKey: 'strike1' | 'strike2' | 'strike3', field: 'value' | 'enabled', value: any) => {
    const updatedStrike = {
      ...multiStrikeStraddleFilters[strikeKey],
      [field]: value
    };
    dispatch(setMultiStrikeStraddleFilters({ [strikeKey]: updatedStrike }));
  };  return (
    <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6 p-4 rounded-lg border shadow-sm" style={{ backgroundColor: theme.colors.card.bg, borderColor: theme.colors.card.border }}>
      {/* Symbol */}
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1" style={{ color: theme.colors.text }}>
          Symbol
        </label>
        <select
          value={multiStrikeStraddleFilters.symbol}
          onChange={(e) => handleFilterChange('symbol', e.target.value)}
          className="px-3 py-2 rounded border text-sm"
          style={{
            backgroundColor: theme.colors.background,
            borderColor: theme.colors.card.border,
            color: theme.colors.text
          }}
        >
          {multiStrikeStraddleData.symbols.map((symbol) => (
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
          value={multiStrikeStraddleFilters.expiry}
          onChange={(e) => handleFilterChange('expiry', e.target.value)}
          className="px-3 py-2 rounded border text-sm"
          style={{
            backgroundColor: theme.colors.background,
            borderColor: theme.colors.card.border,
            color: theme.colors.text
          }}
        >
          {multiStrikeStraddleData.expiries.map((expiry) => (
            <option key={expiry} value={expiry}>{expiry}</option>
          ))}
        </select>
      </div>

      {/* Strike 1 */}
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1" style={{ color: theme.colors.text }}>
          Strike 1
        </label>
        <div className="flex items-center gap-2">
          <select
            value={multiStrikeStraddleFilters.strike1.value}
            onChange={(e) => handleStrikeChange('strike1', 'value', parseInt(e.target.value))}
            className="px-3 py-2 rounded border text-sm flex-1"
            style={{
              backgroundColor: theme.colors.background,
              borderColor: theme.colors.card.border,
              color: theme.colors.text
            }}
          >
            {multiStrikeStraddleData.strikes.map((strike) => (
              <option key={strike} value={strike}>{strike}</option>
            ))}
          </select>
          
        </div>
      </div>

      {/* Strike 2 */}
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1" style={{ color: theme.colors.text }}>
          Strike 2
        </label>
        <div className="flex items-center gap-2">
          <select
            value={multiStrikeStraddleFilters.strike2.value}
            onChange={(e) => handleStrikeChange('strike2', 'value', parseInt(e.target.value))}
            className="px-3 py-2 rounded border text-sm flex-1"
            style={{
              backgroundColor: theme.colors.background,
              borderColor: theme.colors.card.border,
              color: theme.colors.text
            }}
          >
            {multiStrikeStraddleData.strikes.map((strike) => (
              <option key={strike} value={strike}>{strike}</option>
            ))}
          </select>
          
        </div>
      </div>

      {/* Strike 3 */}
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1" style={{ color: theme.colors.text }}>
          Strike 3
        </label>
        <div className="flex items-center gap-2">
          <select
            value={multiStrikeStraddleFilters.strike3.value}
            onChange={(e) => handleStrikeChange('strike3', 'value', parseInt(e.target.value))}
            className="px-3 py-2 rounded border text-sm flex-1"
            style={{
              backgroundColor: theme.colors.background,
              borderColor: theme.colors.card.border,
              color: theme.colors.text
            }}
          >
            {multiStrikeStraddleData.strikes.map((strike) => (
              <option key={strike} value={strike}>{strike}</option>
            ))}
          </select>
         
        </div>
      </div>

      {/* Individual Prices Toggle */}
      <div className="flex flex-col justify-center items-center align-middle">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={multiStrikeStraddleFilters.individualPrices}
            onChange={(e) => handleFilterChange('individualPrices', e.target.checked)}
            className="mr-2 text-blue-500"
          />
          <span className="text-sm font-medium" style={{ color: theme.colors.text }}>Individual Price</span>
        </label>
      </div>

      {/* Live/Historical Toggle */}
      <div className="flex flex-col justify-center">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={multiStrikeStraddleFilters.isLive}
            onChange={(e) => handleFilterChange('isLive', e.target.checked)}
            className="mr-2 text-blue-500"
          />
          <span className="text-sm font-medium" style={{ color: theme.colors.text }}>Live</span>
        </label>
      </div>

      {/* Historical Date */}
      {!multiStrikeStraddleFilters.isLive && (
        <div className="flex flex-col col-span-1">
          <label className="text-sm font-medium mb-1" style={{ color: theme.colors.text }}>
            Historical Date
          </label>
          <input
            type="date"
            value={multiStrikeStraddleFilters.historicalDate}
            onChange={(e) => handleFilterChange('historicalDate', e.target.value)}
            className="px-3 py-2 rounded border text-sm"
            style={{
              backgroundColor: theme.colors.background,
              borderColor: theme.colors.card.border,
              color: theme.colors.text
            }}
          />
        </div>
      )}
    </div>
  );
};

export default MultiStrikeStraddleFilterBar;
