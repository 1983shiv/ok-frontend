"use client";

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useTheme } from '@/context/ThemeContext';

const ATMPremiumAreaChart: React.FC = () => {
  const { atmPremiumAnalysisData } = useSelector((state: RootState) => state.chart);
  const { theme } = useTheme();

  const data = atmPremiumAnalysisData.timeSeriesData.map(item => ({
    time: item.time,
    atmPremium: item.atmPremium,
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
              {`ATM Premium: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div
      className="p-4 rounded-lg shadow border"
      style={{
        backgroundColor: theme.colors.card.bg,
        borderColor: theme.colors.card.border,
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 
          className="text-lg font-semibold"
          style={{ color: theme.colors.text }}
        >
          ATM Premium
        </h3>
        <p 
          className="text-sm opacity-75"
          style={{ color: theme.colors.text }}
        >
          ATM Premium is sum of call and put premium at ATM strike at that particular time.
        </p>
      </div>
      
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 20,
          }}
        >
          <defs>
            <linearGradient id="atmPremiumGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={theme.colors.accent} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={theme.colors.accent} stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke={theme.colors.divider}
            opacity={0.3}
          />
          <XAxis 
            dataKey="time" 
            axisLine={false}
            tickLine={false}
            tick={{ 
              fill: theme.colors.text, 
              fontSize: 12,
              opacity: 0.7 
            }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ 
              fill: theme.colors.text, 
              fontSize: 12,
              opacity: 0.7 
            }}
            domain={['dataMin - 10', 'dataMax + 10']}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="atmPremium"
            stroke={theme.colors.accent}
            strokeWidth={2}
            fill="url(#atmPremiumGradient)"
            connectNulls
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ATMPremiumAreaChart;
