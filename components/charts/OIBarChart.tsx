"use client";

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useTheme } from '@/context/ThemeContext';

const OIBarChart: React.FC = () => {
  const { coiAnalysisData } = useSelector((state: RootState) => state.chart);
  const { theme } = useTheme();

  const data = [
    {
      name: 'Call',
      value: coiAnalysisData.summary.totalOI.call,
      color: theme.colors.chart?.ce || '#10B981'
    },
    {
      name: 'Put',
      value: coiAnalysisData.summary.totalOI.put,
      color: theme.colors.chart?.pe || '#EF4444'
    }
  ];
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
            {`${label}`}
          </p>
          <p 
            className="text-sm"
            style={{ color: theme.colors.text, opacity: 0.8 }}
          >
            {`OI: ${payload[0].value.toFixed(1)}K`}
          </p>
        </div>
      );
    }
    return null;
  };  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          barCategoryGap="20%"
        >            <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.divider} />
          <XAxis 
            dataKey="name" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: theme.colors.text }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: theme.colors.text }}
            tickFormatter={(value: number) => `${value}K`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="value" 
            radius={[4, 4, 0, 0]}
            maxBarSize={80}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OIBarChart;
