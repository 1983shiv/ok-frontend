"use client";

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useTheme } from '@/context/ThemeContext';

const IVAnalysisLineChart: React.FC = () => {
  const { ivAnalysisData, ivAnalysisFilters } = useSelector((state: RootState) => state.chart);
  const { theme } = useTheme();

  const data = ivAnalysisData.timeSeriesData.map(item => ({
    time: item.time,
    ceIV: item.ceIV,
    peIV: item.peIV,
  }));

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
          <p 
            className="text-sm font-medium"
            style={{ color: theme.colors.text }}
          >
            {`Time: ${label}`}
          </p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.dataKey === 'ceIV' 
                ? `Call IV: ${entry.value.toFixed(2)}%`
                : `Put IV: ${entry.value.toFixed(2)}%`
              }
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div 
      className="rounded-lg p-6 shadow-sm border"
      style={{
        backgroundColor: theme.colors.card.bg,
        borderColor: theme.colors.card.border
      }}
    >
      <div className="flex items-center justify-between mb-4">        <h3 
          className="text-lg font-semibold"
          style={{ color: theme.colors.text }}
        >
          Implied Volatility for {ivAnalysisFilters.strike.toFixed(2)}
        </h3>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center">
            <div 
              className="w-3 h-3 rounded mr-2"
              style={{ backgroundColor: theme.colors.chart?.ce || '#3B82F6' }}
            ></div>
            <span style={{ color: theme.colors.text, opacity: 0.8 }}>Call IV</span>
          </div>
          <div className="flex items-center">
            <div 
              className="w-3 h-3 rounded mr-2"
              style={{ backgroundColor: theme.colors.chart?.pe || '#EF4444' }}
            ></div>
            <span style={{ color: theme.colors.text, opacity: 0.8 }}>Put IV</span>
          </div>
        </div>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.divider} />
            <XAxis 
              dataKey="time" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: theme.colors.text }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: theme.colors.text }}
              domain={['dataMin - 1', 'dataMax + 1']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="ceIV"
              stroke={theme.colors.chart?.ce || '#3B82F6'}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, stroke: theme.colors.chart?.ce || '#3B82F6', strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="peIV"
              stroke={theme.colors.chart?.pe || '#EF4444'}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, stroke: theme.colors.chart?.pe || '#EF4444', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Note */}
      <div className="mt-4">
        <p 
          className="text-xs"
          style={{ color: theme.colors.text, opacity: 0.6 }}
        >
          Note: Implied volatility values may differ at different sources due to different parameters for calculation.
        </p>
      </div>
    </div>
  );
};

export default IVAnalysisLineChart;
