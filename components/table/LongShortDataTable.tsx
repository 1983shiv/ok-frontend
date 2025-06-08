'use client';

import React from 'react';
import { useTheme } from '@/context/ThemeContext';

interface LongShortDataItem {
  date: string;
  symbol: string;
  lastPrice: number;
  priceChange: number;
  oiChange: string;
  longVsShort: string;
}

interface LongShortDataTableProps {
  data: LongShortDataItem[];
  className?: string;
}

const LongShortDataTable: React.FC<LongShortDataTableProps> = ({ data, className = '' }) => {
  const { theme } = useTheme();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Long Building':
        return '#10b981'; // emerald-500
      case 'Short Covering':
        return '#22d3ee'; // cyan-400
      case 'Long Unwinding':
        return '#ef4444'; // red-500
      case 'Short Bullish':
        return '#f97316'; // orange-500
      default:
        return theme.colors.text;
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'Long Building':
        return '#dcfce7'; // emerald-100
      case 'Short Covering':
        return '#cffafe'; // cyan-100
      case 'Long Unwinding':
        return '#fee2e2'; // red-100
      case 'Short Bullish':
        return '#fed7aa'; // orange-100
      default:
        return theme.colors.card.bg;
    }
  };

  const formatChange = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}`;
  };

  const formatOIChange = (value: string) => {
    return value;
  };

  return (
    <div className={`${className}`}>
      <div 
        className="rounded-lg border overflow-hidden"
        style={{ 
          backgroundColor: theme.colors.card.bg, 
          borderColor: theme.colors.card.border 
        }}
      >
        {/* Header */}
        <div className="px-4 py-3 border-b" style={{ borderColor: theme.colors.card.border }}>
          <h3 className="text-lg font-semibold" style={{ color: theme.colors.text }}>
            Options Strike Long Vs Short
          </h3>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr 
                className="border-b text-xs font-medium uppercase tracking-wider"
                style={{ 
                  backgroundColor: theme.colors.secondary,
                  borderColor: theme.colors.card.border,
                  color: theme.colors.text
                }}
              >
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Symbol</th>
                <th className="px-4 py-3 text-right">Last Price</th>
                <th className="px-4 py-3 text-right">Price Change</th>
                <th className="px-4 py-3 text-right">OI Change</th>
                <th className="px-4 py-3 text-center">Long vs Short</th>
              </tr>
            </thead>            <tbody>
              {data.map((row: LongShortDataItem, index: number) => (
                <tr
                  key={index}
                  className="border-b hover:bg-opacity-50 transition-colors duration-150"
                  style={{ 
                    borderColor: theme.colors.card.border,
                    backgroundColor: index % 2 === 0 ? theme.colors.card.bg : theme.colors.secondary
                  }}
                >
                  <td className="px-4 py-3 text-sm font-mono" style={{ color: theme.colors.text }}>
                    {row.date}
                  </td>
                  <td className="px-4 py-3 text-sm font-mono font-medium" style={{ color: theme.colors.text }}>
                    {row.symbol}
                  </td>
                  <td className="px-4 py-3 text-sm font-mono text-right font-medium" style={{ color: theme.colors.text }}>
                    {row.lastPrice.toFixed(2)}
                  </td>
                  <td 
                    className="px-4 py-3 text-sm font-mono text-right font-medium"
                    style={{ 
                      color: row.priceChange >= 0 ? '#10b981' : '#ef4444'
                    }}
                  >
                    {formatChange(row.priceChange)}
                  </td>
                  <td 
                    className="px-4 py-3 text-sm font-mono text-right font-medium"
                    style={{ 
                      color: row.oiChange.startsWith('+') ? '#10b981' : '#ef4444'
                    }}
                  >
                    {formatOIChange(row.oiChange)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span 
                      className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{ 
                        backgroundColor: getStatusBgColor(row.longVsShort),
                        color: getStatusColor(row.longVsShort)
                      }}
                    >
                      {row.longVsShort}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LongShortDataTable;
