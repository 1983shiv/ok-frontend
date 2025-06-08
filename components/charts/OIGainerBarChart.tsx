"use client";

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useTheme } from '@/context/ThemeContext';

interface OIGainerBarChartProps {
  interval: '15Min' | '60Min' | 'Day';
  title: string;
}

const OIGainerBarChart: React.FC<OIGainerBarChartProps> = ({ interval, title }) => {
  const { oiGainerLooserData } = useSelector((state: RootState) => state.chart);
  const { theme } = useTheme();

  const data = oiGainerLooserData.oiGainer[interval].map((item) => ({
    name: item.displayText,
    value: Math.abs(item.oiChange),
    percentage: item.oiChangePercent,
    color: item.optionType === 'CE' ? theme.colors.chart?.ce || '#10B981' : theme.colors.chart?.pe || '#EF4444'
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
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
            {label}
          </p>
          <p 
            className="text-sm"
            style={{ color: theme.colors.text, opacity: 0.8 }}
          >
            OI Change: {data.value.toLocaleString()}
          </p>
          <p 
            className="text-sm"
            style={{ color: theme.colors.text, opacity: 0.8 }}
          >
            {data.percentage > 0 ? '+' : ''}{data.percentage.toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-full">
      <div className="mb-4">
        <h3 className="text-lg font-semibold" style={{ color: theme.colors.text }}>
          {title}
        </h3>
        <p className="text-sm opacity-70" style={{ color: theme.colors.text }}>
          Top 5 OI Gainers - {interval === '15Min' ? '15 Min' : interval === '60Min' ? '60 Min' : 'Day'}
        </p>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 60,
            }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={theme.colors.divider}
              strokeOpacity={0.3}
            />
            <XAxis 
              dataKey="name" 
              stroke={theme.colors.text}
              fontSize={12}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis 
              stroke={theme.colors.text}
              fontSize={12}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default OIGainerBarChart;
