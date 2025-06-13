"use client";

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { setPriceVsOIFilters } from '@/redux/chartSlice';
import { useTheme } from '@/context/ThemeContext';

const idx = ["NIFTY", "BANKNIFTY", "FINNIFTY", "MIDCPNIFTY"]
const stock = ["ADANIENT", "RELIANCE", "TATATECH", "TCS", "INFY"]

interface PriceVsOIFilterBarProps {
  enabledFuture?: boolean
}

export default function PriceVsOIFilterBar({enabledFuture = true} : PriceVsOIFilterBarProps) {
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const { priceVsOIFilters } = useSelector((state: RootState) => state.chart);

  const handleFilterChange = (field: string, value: any) => {
    dispatch(setPriceVsOIFilters({ [field]: value }));
  };
  return (
    <div className="rounded-lg p-4 border" style={{ 
      backgroundColor: theme.colors.card.bg,
      borderColor: theme.colors.card.border 
    }}>
      <div className="flex flex-wrap items-center gap-4">        {/* Symbol Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium" style={{ color: theme.colors.text }}>Symbol</label><select
            value={priceVsOIFilters.symbol}
            onChange={(e) => handleFilterChange('symbol', e.target.value)}
            className="rounded px-3 py-1 text-sm focus:outline-none border"
            style={{ 
              backgroundColor: theme.colors.secondary,
              borderColor: theme.colors.card.border,
              color: theme.colors.text
            }}
          >
            {!enabledFuture ? stock.map((item, index) => (
              <option value={item} key={index}>{item}</option>
            )) : idx.map((item, index) => (
              <option value={item} key={index}>{item}</option>
            ))}
          </select>
        </div>        {/* Expiry Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium" style={{ color: theme.colors.text }}>Expiry</label><select
            value={priceVsOIFilters.expiry}
            onChange={(e) => handleFilterChange('expiry', e.target.value)}
            className="rounded px-3 py-1 text-sm focus:outline-none border"
            style={{ 
              backgroundColor: theme.colors.secondary,
              borderColor: theme.colors.card.border,
              color: theme.colors.text
            }}
          >
            <option value="12/04/2025">12/04/2025</option>
            <option value="19/04/2025">19/04/2025</option>
            <option value="26/04/2025">26/04/2025</option>
          </select>
        </div>        
        {/* Strike */}
        {enabledFuture && 
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium" style={{ color: theme.colors.text }}>Strike</label><input
            type="number"
            value={priceVsOIFilters.strike}
            onChange={(e) => handleFilterChange('strike', Number(e.target.value))}
            className="rounded px-3 py-1 text-sm w-20 focus:outline-none border"
            style={{ 
              backgroundColor: theme.colors.secondary,
              borderColor: theme.colors.card.border,
              color: theme.colors.text
            }}
          />
        </div>   
        }     
        
        {/* Live Toggle */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium" style={{ color: theme.colors.text }}>Live</label>
          <input
            type="checkbox"
            checked={priceVsOIFilters.isLive}
            onChange={(e) => handleFilterChange('isLive', e.target.checked)}
            className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500"
          />
        </div>

        {/* Historical Date */}
        {!priceVsOIFilters.isLive && (          <div className="flex items-center gap-2">
            <label className="text-sm font-medium" style={{ color: theme.colors.text }}>Historical Date</label><input
              type="date"
              value={priceVsOIFilters.historicalDate}
              onChange={(e) => handleFilterChange('historicalDate', e.target.value)}
              className="rounded px-3 py-1 text-sm focus:outline-none border"
              style={{ 
                backgroundColor: theme.colors.secondary,
                borderColor: theme.colors.card.border,
                color: theme.colors.text
              }}
            />
          </div>
        )}        
        
      </div>
    </div>
  );
}
