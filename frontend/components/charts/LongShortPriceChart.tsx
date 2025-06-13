'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { useTheme } from '@/context/ThemeContext';

interface ChartDataItem {
  time: string;
  price: number;
  oi: number;
  longBuildingPercent: number;
  shortCoveringPercent: number;
  longUnwindingPercent: number;
  shortBuiltPercent: number;
}

interface LongShortPriceChartProps {
  data: {
    priceMovement: ChartDataItem[];
  };
  className?: string;
}

const LongShortPriceChart: React.FC<LongShortPriceChartProps> = ({ data, className = '' }) => {
  const { theme } = useTheme();

  const formatTooltip = (value: any, name: string) => {
    if (name === 'price') {
      return [`₹${value.toFixed(2)}`, 'Price'];
    }
    if (name === 'oi') {
      return [value.toLocaleString(), 'OI Change'];
    }
    return [value, name];
  };

  return (
    <div className={`${className}`}>
      <div 
        className="p-6 rounded-lg border"
        style={{ 
          backgroundColor: theme.colors.card.bg, 
          borderColor: theme.colors.card.border 
        }}
      >
        <h3 className="text-lg font-semibold mb-4" style={{ color: theme.colors.text }}>
          Price Movement & OI Change
        </h3>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.priceMovement}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke={theme.colors.divider}
                opacity={0.3}
              />
              <XAxis 
                dataKey="time" 
                stroke={theme.colors.text}
                fontSize={12}
                tick={{ fill: theme.colors.text }}
              />
              <YAxis 
                yAxisId="price"
                orientation="left"
                stroke={theme.colors.text}
                fontSize={12}
                tick={{ fill: theme.colors.text }}
                tickFormatter={(value) => `₹${value}`}
              />
              <YAxis 
                yAxisId="oi"
                orientation="right"
                stroke={theme.colors.text}
                fontSize={12}
                tick={{ fill: theme.colors.text }}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
              />
              <Tooltip 
                formatter={formatTooltip}
                labelStyle={{ color: theme.colors.text }}
                contentStyle={{
                  backgroundColor: theme.colors.card.bg,
                  border: `1px solid ${theme.colors.card.border}`,
                  borderRadius: '8px',
                  color: theme.colors.text
                }}
              />
              <Legend 
                wrapperStyle={{ color: theme.colors.text }}
              />
              <Line
                yAxisId="price"
                type="monotone"
                dataKey="price"
                stroke={theme.colors.accent}
                strokeWidth={3}
                dot={{ r: 4, fill: theme.colors.accent }}
                activeDot={{ r: 6, fill: theme.colors.accent }}
                name="Price"
              />
              <Line
                yAxisId="oi"
                type="monotone"
                dataKey="oi"
                stroke={theme.colors.chart?.pe || '#ef4444'}
                strokeWidth={2}
                dot={{ r: 3, fill: theme.colors.chart?.pe || '#ef4444' }}
                activeDot={{ r: 5, fill: theme.colors.chart?.pe || '#ef4444' }}
                name="OI Change"
                strokeDasharray="5 5"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default LongShortPriceChart;
