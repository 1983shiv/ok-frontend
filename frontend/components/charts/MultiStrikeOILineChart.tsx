"use client";

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useTheme } from '@/context/ThemeContext';

const MultiStrikeOILineChart: React.FC = () => {
  const { multiStrikeOIData, multiStrikeOIFilters } = useSelector((state: RootState) => state.chart);
  const { theme } = useTheme();

  // Colors for different strike lines
  const strikeColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  // Process data based on filter settings
  const processedData = multiStrikeOIData.openInterestData.map((item: any) => {
    const result: any = { time: item.time };

    if (multiStrikeOIFilters.overallOI) {
      // Show combined OI of all enabled strikes
      let combinedOI = 0;
      (['strike1', 'strike2', 'strike3', 'strike4', 'strike5'] as const).forEach((strikeKey) => {
        const strike = multiStrikeOIFilters[strikeKey];
        if (strike.enabled) {
          combinedOI += Number(item[`${strike.value}OI`]) || 0;
        }
      });
      result.combinedOI = combinedOI;
    } else {
      // Show individual strike OI only if enabled
      (['strike1', 'strike2', 'strike3', 'strike4', 'strike5'] as const).forEach((strikeKey) => {
        const strike = multiStrikeOIFilters[strikeKey];
        if (strike.enabled) {
          result[`${strike.value}OI`] = item[`${strike.value}OI`] || 0;
        }
      });
    }

    return result;
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div 
          className="p-3 border rounded-lg shadow-lg"
          style={{
            backgroundColor: theme.colors.card.bg,
            borderColor: theme.colors.card.border
          }}
        >
          <p className="text-sm font-medium" style={{ color: theme.colors.text }}>
            Time: {label}
          </p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value?.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const formatYAxis = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toString();
  };

  return (
    <div className="w-full h-96">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={processedData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.divider} />
          <XAxis 
            dataKey="time" 
            stroke={theme.colors.text}
            fontSize={12}
          />
          <YAxis 
            stroke={theme.colors.text}
            fontSize={12}
            tickFormatter={formatYAxis}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          
          {multiStrikeOIFilters.overallOI ? (
            <Line
              type="monotone"
              dataKey="combinedOI"
              stroke={strikeColors[0]}
              strokeWidth={2}
              dot={{ fill: strikeColors[0], strokeWidth: 0, r: 3 }}
              name="Combined OI"
              connectNulls={false}
            />
          ) : (
            (['strike1', 'strike2', 'strike3', 'strike4', 'strike5'] as const).map((strikeKey, index) => {
              const strike = multiStrikeOIFilters[strikeKey];
              if (!strike.enabled) return null;
              
              return (
                <Line
                  key={strikeKey}
                  type="monotone"
                  dataKey={`${strike.value}OI`}
                  stroke={strikeColors[index]}
                  strokeWidth={2}
                  dot={{ fill: strikeColors[index], strokeWidth: 0, r: 3 }}
                  name={`${strike.value} OI`}
                  connectNulls={false}
                />
              );
            })
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MultiStrikeOILineChart;
