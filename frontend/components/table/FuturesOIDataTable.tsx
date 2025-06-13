'use client';

import React from 'react';
import { useTheme } from '@/context/ThemeContext';

interface FuturesOIDataItem {
  symbol: string;
  ltp: number;
  priceChange: number;
  percentChange: number;
  oi: number;
  oiChange: number;
  percentOiChange: number;
  expiry: string;
}

interface FuturesOIDataTableProps {
  data: FuturesOIDataItem[];
}

const FuturesOIDataTable: React.FC<FuturesOIDataTableProps> = ({ data }) => {
  const { theme } = useTheme();
  // Debug: Log data to check if it's being passed correctly
  console.log('=== FUTURES OI DATA TABLE DEBUG ===');
  console.log('FuturesOIDataTable received data:', data);
  console.log('Data type:', typeof data);
  console.log('Is array:', Array.isArray(data));
  console.log('Data length:', data?.length || 0);
  if (data && data.length > 0) {
    console.log('First item structure:', data[0]);
    console.log('Sample symbols:', data.slice(0, 3).map(item => item.symbol));
  }
  console.log('=== END TABLE DEBUG ===');

  const formatChange = (value: number) => {
    return value >= 0 ? `+${value.toFixed(2)}` : value.toFixed(2);
  };

  const formatPercentChange = (value: number) => {
    return value >= 0 ? `+${value.toFixed(2)}%` : `${value.toFixed(2)}%`;
  };

  const formatOI = (value: number) => {
    return value.toLocaleString();
  };

  // Show message if no data
  if (!data || data.length === 0) {
    return (
      <div className="w-full p-8 text-center">
        <div style={{ color: theme.colors.text, opacity: 0.6 }}>
          <p className="text-lg mb-2">No data available</p>
          <p className="text-sm">Please check your filters or data source</p>
        </div>
      </div>
    );
  }
  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y" style={{ borderColor: theme.colors.card.border }}>
          <thead style={{ backgroundColor: theme.colors.background }}>
            <tr>
              <th
                className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider"
                style={{ color: theme.colors.text }}
              >
                Symbol
              </th>
              <th
                className="px-6 py-4 text-right text-sm font-semibold uppercase tracking-wider"
                style={{ color: theme.colors.text }}
              >
                LTP
              </th>
              <th
                className="px-6 py-4 text-right text-sm font-semibold uppercase tracking-wider"
                style={{ color: theme.colors.text }}
              >
                Price Change
              </th>
              <th
                className="px-6 py-4 text-right text-sm font-semibold uppercase tracking-wider"
                style={{ color: theme.colors.text }}
              >
                % Change
              </th>
              <th
                className="px-6 py-4 text-right text-sm font-semibold uppercase tracking-wider"
                style={{ color: theme.colors.text }}
              >
                OI
              </th>
              <th
                className="px-6 py-4 text-right text-sm font-semibold uppercase tracking-wider"
                style={{ color: theme.colors.text }}              >
                OI Change
              </th>
              <th
                className="px-6 py-4 text-right text-sm font-semibold uppercase tracking-wider"
                style={{ color: theme.colors.text }}
              >
                % OI Change
              </th>
              <th
                className="px-6 py-4 text-right text-sm font-semibold uppercase tracking-wider"
                style={{ color: theme.colors.text }}
              >
                Expiry
              </th>
            </tr>
          </thead>          <tbody
            className="divide-y"
            style={{
              borderColor: theme.colors.card.border,
              backgroundColor: theme.colors.card.bg,
            }}
          >
            {data.map((row, index) => (
              <tr 
                key={index}
                className="hover:bg-opacity-80 transition-colors duration-150"
                style={{ 
                  backgroundColor: index % 2 === 0 ? 'transparent' : theme.colors.background + '20'
                }}
              >
                <td className="px-6 py-4 text-sm font-medium" style={{ color: theme.colors.text }}>
                  {row.symbol}
                </td>
                <td className="px-6 py-4 text-sm text-right font-medium" style={{ color: theme.colors.text }}>
                  ₹{row.ltp.toFixed(2)}
                </td>
                <td 
                  className="px-6 py-4 text-sm text-right font-semibold"
                  style={{ color: row.priceChange >= 0 ? '#10b981' : '#ef4444' }}
                >
                  {formatChange(row.priceChange)}
                </td>                <td 
                  className="px-6 py-4 text-sm text-right font-semibold"
                  style={{ color: row.percentChange >= 0 ? '#10b981' : '#ef4444' }}
                >
                  {formatPercentChange(row.percentChange)}
                </td>
                <td 
                  className="px-6 py-4 text-sm text-right font-medium"
                  style={{ color: theme.colors.text }}
                >
                  {formatOI(row.oi)}
                </td>
                <td 
                  className="px-6 py-4 text-sm text-right font-semibold"
                  style={{ color: row.oiChange >= 0 ? '#10b981' : '#ef4444' }}
                >
                  {formatOI(row.oiChange)}
                </td>
                <td 
                  className="px-6 py-4 text-sm text-right font-semibold"
                  style={{ 
                    color: row.percentOiChange >= 0 ? '#10b981' : '#ef4444',
                  }}
                >
                  {formatPercentChange(row.percentOiChange)}
                </td>
                <td 
                  className="px-6 py-4 text-sm text-right font-medium"
                  style={{ color: theme.colors.text, opacity: 0.8 }}
                >
                  {row.expiry}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FuturesOIDataTable;