"use client";

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useTheme } from '@/context/ThemeContext';

const PCRLineChart: React.FC = () => {
  const { pcrAnalysisData } = useSelector((state: RootState) => state.chart);
  const { theme } = useTheme();

  const data = pcrAnalysisData.timeSeriesData.map((item: any) => ({
    time: item.time,
    pcr: item.pcr,
    niftyFuture: item.niftyFuture
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div 
          className="p-3 border rounded-lg shadow-lg"
          style={{
            backgroundColor: theme.colors.card.bg,
            borderColor: theme.colors.card.border,
            color: theme.colors.text
          }}
        >
          <p className="text-sm font-medium">{`Time: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.dataKey === 'pcr' 
                ? `PCR: ${entry.value.toFixed(3)}`
                : `NIFTY Future: ${entry.value.toFixed(2)}`
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
      className="rounded-lg p-6 shadow-sm border h-full"
      style={{
        backgroundColor: theme.colors.card.bg,
        borderColor: theme.colors.card.border
      }}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 
          className="text-lg font-semibold"
          style={{ color: theme.colors.text }}
        >
          PCR vs NIFTY Future
        </h3>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center">
            <div 
              className="w-3 h-3 rounded mr-2"
              style={{ backgroundColor: '#3B82F6' }}
            ></div>
            <span style={{ color: theme.colors.text }}>PCR</span>
          </div>
          <div className="flex items-center">
            <div 
              className="w-3 h-3 rounded mr-2"
              style={{ backgroundColor: '#F59E0B' }}
            ></div>
            <span style={{ color: theme.colors.text }}>NIFTY Future</span>
          </div>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.divider} />
          <XAxis 
            dataKey="time" 
            tick={{ fontSize: 12, fill: theme.colors.text }}
            stroke={theme.colors.text}
            interval="preserveStartEnd"
          />
          <YAxis 
            yAxisId="left"
            orientation="left"
            tick={{ fontSize: 12, fill: theme.colors.text }}
            stroke={theme.colors.text}
            domain={['dataMin - 0.01', 'dataMax + 0.01']}
          />
          <YAxis 
            yAxisId="right"
            orientation="right"
            tick={{ fontSize: 12, fill: theme.colors.text }}
            stroke={theme.colors.text}
            domain={['dataMin - 50', 'dataMax + 50']}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            yAxisId="left"
            type="monotone" 
            dataKey="pcr" 
            stroke="#3B82F6"
            strokeWidth={2}
            dot={{ fill: '#3B82F6', strokeWidth: 2, r: 3 }}
            activeDot={{ r: 5, stroke: '#3B82F6', strokeWidth: 2 }}
          />
          <Line
            yAxisId="right"
            type="monotone" 
            dataKey="niftyFuture" 
            stroke="#F59E0B"
            strokeWidth={2}
            dot={{ fill: '#F59E0B', strokeWidth: 2, r: 3 }}
            activeDot={{ r: 5, stroke: '#F59E0B', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="mt-4 grid grid-cols-3 gap-4 text-center">        <div className="p-3 rounded" style={{ backgroundColor: theme.colors.secondary }}>
          <div className="text-sm" style={{ color: theme.colors.text, opacity: 0.7 }}>Current PCR</div>
          <div className="text-lg font-semibold" style={{ color: theme.colors.text }}>
            {pcrAnalysisData.summary.pcr.toFixed(3)}
          </div>
        </div>
        <div className="p-3 rounded" style={{ backgroundColor: theme.colors.secondary }}>
          <div className="text-sm" style={{ color: theme.colors.text, opacity: 0.7 }}>PCR Change</div>
          <div 
            className="text-lg font-semibold"
            style={{ 
              color: pcrAnalysisData.summary.pcrChange >= 0 ? '#10B981' : '#EF4444'
            }}
          >
            {pcrAnalysisData.summary.pcrChange >= 0 ? '+' : ''}{pcrAnalysisData.summary.pcrChange.toFixed(3)}
          </div>
        </div>
        <div className="p-3 rounded" style={{ backgroundColor: theme.colors.secondary }}>
          <div className="text-sm" style={{ color: theme.colors.text, opacity: 0.7 }}>Sentiment</div>
          <div 
            className="text-lg font-semibold"
            style={{ 
              color: pcrAnalysisData.summary.sentiment === 'Bullish' ? '#10B981' : '#EF4444'
            }}
          >
            {pcrAnalysisData.summary.sentiment}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PCRLineChart;
