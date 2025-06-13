"use client";

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useTheme } from '@/context/ThemeContext';

const COINiftyLineChart: React.FC = () => {
  const { coiAnalysisData } = useSelector((state: RootState) => state.chart);
  const { theme } = useTheme();

  const data = coiAnalysisData.timeSeriesData.map(item => ({
    time: item.time,
    niftyFuture: item.niftyFuture,
    changeInCallOI: item.changeInCallOI / 1000, // Convert to thousands
    changeInPutOI: item.changeInPutOI / 1000,
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
              {entry.dataKey === 'niftyFuture' 
                ? `Nifty Future: ${entry.value.toFixed(2)}`
                : entry.dataKey === 'changeInCallOI'
                ? `Call COI: ${entry.value.toFixed(1)}K`
                : `Put COI: ${entry.value.toFixed(1)}K`
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
      <div className="flex items-center justify-between mb-4">
        <h3 
          className="text-lg font-semibold"
          style={{ color: theme.colors.text }}
        >
          COI with Nifty Future
        </h3>
        <div className="flex items-center space-x-4 text-sm">          <div className="flex items-center">
            <div 
              className="w-3 h-3 rounded mr-2"
              style={{ backgroundColor: theme.colors.chart?.idx || theme.colors.accent }}
            ></div>
            <span style={{ color: theme.colors.text, opacity: 0.8 }}>Nifty Future</span>
          </div>
          <div className="flex items-center">
            <div 
              className="w-3 h-3 rounded mr-2"
              style={{ backgroundColor: theme.colors.chart?.ce || '#10B981' }}
            ></div>
            <span style={{ color: theme.colors.text, opacity: 0.8 }}>Call COI</span>
          </div>
          <div className="flex items-center">
            <div 
              className="w-3 h-3 rounded mr-2"
              style={{ backgroundColor: theme.colors.chart?.pe || '#EF4444' }}
            ></div>
            <span style={{ color: theme.colors.text, opacity: 0.8 }}>Put COI</span>
          </div>
        </div>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >            <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.divider} />
            <XAxis 
              dataKey="time" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: theme.colors.text }}
            />
            <YAxis 
              yAxisId="left"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: theme.colors.text }}
              tickFormatter={(value: number) => `${value}K`}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: theme.colors.text }}
            />
            <Tooltip content={<CustomTooltip />} />            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="niftyFuture" 
              stroke={theme.colors.chart?.idx || theme.colors.accent} 
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="changeInCallOI" 
              stroke={theme.colors.chart?.ce || '#10B981'} 
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="changeInPutOI" 
              stroke={theme.colors.chart?.pe || '#EF4444'} 
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default COINiftyLineChart;
