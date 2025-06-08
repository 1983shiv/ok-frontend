"use client";

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useTheme } from '@/context/ThemeContext';

const TrendingStrikesLineChart: React.FC = () => {
  const { trendingStrikesData } = useSelector((state: RootState) => state.chart);
  const { theme } = useTheme();

  // Transform data for line chart
  const transformedData = trendingStrikesData.strikePricesTrending[0]?.timeSeriesData.map((timePoint, index) => {
    const dataPoint: any = { time: timePoint.time };
    
    // Add each strike price as a separate line
    trendingStrikesData.strikePricesTrending.forEach((strike) => {
      dataPoint[`strike${strike.strikePrice}`] = strike.timeSeriesData[index]?.oi / 1000; // Convert to K
    });
    
    return dataPoint;
  }) || [];

  // Define colors for different strike prices
  const strikePriceColors = [
    '#3B82F6', // Blue
    '#EF4444', // Red  
    '#10B981', // Green
    '#F59E0B', // Amber
    '#8B5CF6', // Purple
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
            {`Time: ${label}`}
          </p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.dataKey.replace('strike', '')}: ${entry.value?.toFixed(1)}K`}
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
          Trending Strike Prices
        </h3>
        <div className="flex items-center space-x-4 text-sm flex-wrap">
          {trendingStrikesData.strikePricesTrending.slice(0, 5).map((strike, index) => (
            <div key={strike.strikePrice} className="flex items-center">
              <div 
                className="w-3 h-3 rounded mr-2"
                style={{ backgroundColor: strikePriceColors[index] }}
              ></div>
              <span style={{ color: theme.colors.text, opacity: 0.8 }}>
                {strike.strikePrice}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={transformedData}
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
              tickFormatter={(value: number) => `${value}K`}
            />
            <Tooltip content={<CustomTooltip />} />
            {trendingStrikesData.strikePricesTrending.slice(0, 5).map((strike, index) => (
              <Line 
                key={strike.strikePrice}
                type="monotone" 
                dataKey={`strike${strike.strikePrice}`}
                stroke={strikePriceColors[index]}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TrendingStrikesLineChart;
