'use client';

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { setLongShortFilters } from '@/redux/chartSlice';
import { useTheme } from '@/context/ThemeContext';

const idx = ["NIFTY", "BANKNIFTY", "FINNIFTY", "MIDCPNIFTY"]
const stock = ["ADANIENT", "RELIANCE", "TATATECH", "TCS", "INFY"]

interface LongShortFilterBarProps {
  futureEnabled?: boolean;
}

const LongShortFilterBar: React.FC<LongShortFilterBarProps> = ({ futureEnabled }) => {
  const dispatch = useDispatch();
  const { longShortFilters } = useSelector((state: RootState) => state.chart);
  const { theme } = useTheme();

  const handleFilterChange = (field: string, value: any) => {
    dispatch(setLongShortFilters({ [field]: value }));
  };

  return (
    <div 
      className="p-4 rounded-lg border mb-6"
      style={{ 
        backgroundColor: theme.colors.card.bg, 
        borderColor: theme.colors.card.border 
      }}
    >
      <div className="flex flex-wrap items-center gap-4">
        {/* Symbol Filter */}
        <div className="flex flex-col">
          <label className="text-xs font-medium mb-1" style={{ color: theme.colors.text }}>
            Symbol
          </label>
          <select
            value={longShortFilters.symbol}
            onChange={(e) => handleFilterChange('symbol', e.target.value)}
            className="px-3 py-2 rounded border text-sm min-w-[100px]"
            style={{
              backgroundColor: theme.colors.secondary,
              borderColor: theme.colors.card.border,
              color: theme.colors.text,
            }}
          >
            {futureEnabled ? stock.map((item, index) => (
              <option value={item} key={index}>{item}</option>
            )) : idx.map((item, index) => (
              <option value={item} key={index}>{item}</option>
            ))}
          </select>
        </div>

        {/* Expiry Filter */}
        <div className="flex flex-col">
          <label className="text-xs font-medium mb-1" style={{ color: theme.colors.text }}>
            Expiry
          </label>
          <select
            value={longShortFilters.expiry}
            onChange={(e) => handleFilterChange('expiry', e.target.value)}
            className="px-3 py-2 rounded border text-sm min-w-[120px]"
            style={{
              backgroundColor: theme.colors.secondary,
              borderColor: theme.colors.card.border,
              color: theme.colors.text,
            }}
          >
            <option value="12-06-2025">12-06-2025</option>
            <option value="19-06-2025">19-06-2025</option>
            <option value="26-06-2025">26-06-2025</option>
          </select>
        </div>

        {/* Strike Filter */}
        {! futureEnabled && 
        <div className="flex flex-col">
          <label className="text-xs font-medium mb-1" style={{ color: theme.colors.text }}>
            Strike
          </label>
          <select
            value={longShortFilters.strike}
            onChange={(e) => handleFilterChange('strike', e.target.value)}
            className="px-3 py-2 rounded border text-sm min-w-[100px]"
            style={{
              backgroundColor: theme.colors.secondary,
              borderColor: theme.colors.card.border,
              color: theme.colors.text,
            }}
          >
            <option value="25000.00CE">25000.00CE</option>
            <option value="25100.00CE">25100.00CE</option>
            <option value="25200.00CE">25200.00CE</option>
            <option value="24900.00PE">24900.00PE</option>
            <option value="25000.00PE">25000.00PE</option>
            <option value="25100.00PE">25100.00PE</option>
          </select>
        </div>
        }

        {/* Interval Filter */}
        <div className="flex flex-col">
          <label className="text-xs font-medium mb-1" style={{ color: theme.colors.text }}>
            Interval
          </label>
          <select
            value={longShortFilters.interval}
            onChange={(e) => handleFilterChange('interval', e.target.value)}
            className="px-3 py-2 rounded border text-sm min-w-[80px]"
            style={{
              backgroundColor: theme.colors.secondary,
              borderColor: theme.colors.card.border,
              color: theme.colors.text,
            }}
          >
            <option value="15 Min">15 Min</option>
            <option value="5 Min">5 Min</option>
            <option value="1 Min">1 Min</option>
          </select>
        </div>

        {/* Live Toggle */}
        <div className="flex flex-col">
          <label className="text-xs font-medium mb-1" style={{ color: theme.colors.text }}>
            Live
          </label>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only"
              checked={longShortFilters.isLive}
              onChange={(e) => handleFilterChange('isLive', e.target.checked)}
            />
            <div
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 ease-in-out ${
                longShortFilters.isLive 
                  ? 'bg-blue-500' 
                  : 'bg-gray-300'
              }`}
            >
              <div
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out ${
                  longShortFilters.isLive ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </div>
          </label>
        </div>

        {/* Historical Date */}
        {!longShortFilters.isLive && (
          <div className="flex flex-col">
            <label className="text-xs font-medium mb-1" style={{ color: theme.colors.text }}>
              Historical Date
            </label>
            <input
              type="date"
              value={longShortFilters.historicalDate}
              onChange={(e) => handleFilterChange('historicalDate', e.target.value)}
              className="px-3 py-2 rounded border text-sm"
              style={{
                backgroundColor: theme.colors.secondary,
                borderColor: theme.colors.card.border,
                color: theme.colors.text,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default LongShortFilterBar;
