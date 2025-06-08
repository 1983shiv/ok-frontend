"use client";

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useTheme } from '@/context/ThemeContext';

const StraddlePriceLineChart: React.FC = () => {
  const { straddleAnalysisData } = useSelector((state: RootState) => state.chart);
  const { theme } = useTheme();

  // Combine straddle price and VWAP data
  const combinedData = straddleAnalysisData.straddlePriceData.map((item, index) => ({
    time: item.time,
    price: item.price,
    vwap: straddleAnalysisData.vwapData[index]?.vwap || 0
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
            className="text-sm font-medium mb-1"
            style={{ color: theme.colors.text }}
          >
            {`Time: ${label}`}
          </p>
          {payload.map((entry: any, index: number) => (
            <p 
              key={index}
              className="text-sm"
              style={{ color: entry.color }}
            >
              {`${entry.name}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={combinedData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke={theme.colors.divider}
            opacity={0.3}
          />
          <XAxis 
            dataKey="time" 
            stroke={theme.colors.text}
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke={theme.colors.text}
            fontSize={12}
            tickLine={false}
            axisLine={false}
            domain={['dataMin - 10', 'dataMax + 10']}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="price" 
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
            name="Straddle"
          />
          <Line 
            type="monotone" 
            dataKey="vwap" 
            stroke="rgba(255, 255, 255, 0.6)"
            strokeWidth={1}
            strokeDasharray="5 5"
            dot={false}
            name="VWAP"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StraddlePriceLineChart;
