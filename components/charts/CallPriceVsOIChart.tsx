"use client";

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTheme } from '@/context/ThemeContext';

interface CallPriceVsOIChartProps {
  data: any[];
}

export default function CallPriceVsOIChart({ data }: CallPriceVsOIChartProps) {
  const { theme } = useTheme();
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="border rounded-lg p-3 shadow-lg" style={{ 
          backgroundColor: theme.colors.card.bg,
          borderColor: theme.colors.card.border 
        }}>
          <p className="text-sm" style={{ color: theme.colors.text }}>{`Time: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {`${entry.dataKey === 'price' ? 'Price' : 'Call OI'}: ${
                entry.dataKey === 'oi' ? (entry.value / 100000).toFixed(1) + 'L' : entry.value.toFixed(2)
              }`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-80">      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.divider} />
          <XAxis 
            dataKey="time" 
            stroke={theme.colors.text}
            fontSize={12}
            tickLine={false}
          />
          <YAxis 
            yAxisId="price"
            orientation="left"
            stroke={theme.colors.chart?.ce || '#3B82F6'}
            fontSize={12}
            tickLine={false}
          />
          <YAxis 
            yAxisId="oi"
            orientation="right"
            stroke={theme.colors.chart?.idx || '#10B981'}
            fontSize={12}
            tickLine={false}
            tickFormatter={(value) => `${(value / 100000).toFixed(1)}L`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ paddingTop: '10px' }}
            iconType="line"
          />          <Line
            yAxisId="price"
            type="monotone"
            dataKey="price"
            stroke={theme.colors.chart?.ce || '#3B82F6'}
            strokeWidth={2}
            dot={{ fill: theme.colors.chart?.ce || '#3B82F6', strokeWidth: 2, r: 3 }}
            activeDot={{ r: 5, stroke: theme.colors.chart?.ce || '#3B82F6', strokeWidth: 2 }}
            name="Price"
          />
          <Line
            yAxisId="oi"
            type="monotone"
            dataKey="oi"
            stroke={theme.colors.chart?.idx || '#10B981'}
            strokeWidth={2}
            dot={{ fill: theme.colors.chart?.idx || '#10B981', strokeWidth: 2, r: 3 }}
            activeDot={{ r: 5, stroke: theme.colors.chart?.idx || '#10B981', strokeWidth: 2 }}
            name="Call OI"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
