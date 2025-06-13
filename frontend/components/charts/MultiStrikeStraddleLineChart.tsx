"use client";

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useTheme } from '@/context/ThemeContext';

const MultiStrikeStraddleLineChart: React.FC = () => {
  const { multiStrikeStraddleData, multiStrikeStraddleFilters } = useSelector((state: RootState) => state.chart);
  const { theme } = useTheme();  // Process data based on filter settings
  const processedData = multiStrikeStraddleData.straddlePriceData.map((item: any) => {
    const result: any = { time: item.time };

    if (multiStrikeStraddleFilters.individualPrices) {
      // Show individual strike prices only if enabled
      if (multiStrikeStraddleFilters.strike1.enabled) {
        result[`strike${multiStrikeStraddleFilters.strike1.value}`] = item[`strike${multiStrikeStraddleFilters.strike1.value}`] || 0;
      }
      if (multiStrikeStraddleFilters.strike2.enabled) {
        result[`strike${multiStrikeStraddleFilters.strike2.value}`] = item[`strike${multiStrikeStraddleFilters.strike2.value}`] || 0;
      }
      if (multiStrikeStraddleFilters.strike3.enabled) {
        result[`strike${multiStrikeStraddleFilters.strike3.value}`] = item[`strike${multiStrikeStraddleFilters.strike3.value}`] || 0;
      }
    } else {
      // Show combined sum of enabled strikes
      let combinedValue = 0;
      if (multiStrikeStraddleFilters.strike1.enabled) {
        combinedValue += Number(item[`strike${multiStrikeStraddleFilters.strike1.value}`]) || 0;
      }
      if (multiStrikeStraddleFilters.strike2.enabled) {
        combinedValue += Number(item[`strike${multiStrikeStraddleFilters.strike2.value}`]) || 0;
      }
      if (multiStrikeStraddleFilters.strike3.enabled) {
        combinedValue += Number(item[`strike${multiStrikeStraddleFilters.strike3.value}`]) || 0;
      }
      result.combined = combinedValue;
    }

    return result;
  });

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

  // Define colors for different strikes
  const getLineColor = (strikeValue: number) => {
    switch (strikeValue) {
      case 24900:
        return '#22d3ee'; // cyan-400
      case 25000:
        return '#facc15'; // yellow-400  
      case 25100:
        return '#a78bfa'; // violet-400
      default:
        return theme.colors.accent;
    }
  };

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={processedData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke={theme.colors.divider}
            opacity={0.2}
            horizontal={true}
            vertical={false}
          />
          <XAxis 
            dataKey="time" 
            stroke={theme.colors.text}
            fontSize={11}
            tickMargin={8}
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            stroke={theme.colors.text}
            fontSize={11}
            tickMargin={8}
            axisLine={false}
            tickLine={false}
            domain={['dataMin - 20', 'dataMax + 20']}
          />
          <Tooltip content={<CustomTooltip />} />
          
          {multiStrikeStraddleFilters.individualPrices ? (
            // Render individual strike lines
            <>
              {multiStrikeStraddleFilters.strike1.enabled && (
                <Line
                  type="monotone"
                  dataKey={`strike${multiStrikeStraddleFilters.strike1.value}`}
                  stroke={getLineColor(multiStrikeStraddleFilters.strike1.value)}
                  strokeWidth={2}
                  dot={false}
                  name={`${multiStrikeStraddleFilters.strike1.value}.00`}
                />
              )}
              {multiStrikeStraddleFilters.strike2.enabled && (
                <Line
                  type="monotone"
                  dataKey={`strike${multiStrikeStraddleFilters.strike2.value}`}
                  stroke={getLineColor(multiStrikeStraddleFilters.strike2.value)}
                  strokeWidth={2}
                  dot={false}
                  name={`${multiStrikeStraddleFilters.strike2.value}.00`}
                />
              )}
              {multiStrikeStraddleFilters.strike3.enabled && (
                <Line
                  type="monotone"
                  dataKey={`strike${multiStrikeStraddleFilters.strike3.value}`}
                  stroke={getLineColor(multiStrikeStraddleFilters.strike3.value)}
                  strokeWidth={2}
                  dot={false}
                  name={`${multiStrikeStraddleFilters.strike3.value}.00`}
                />
              )}
            </>
          ) : (
            // Render combined line
            <Line
              type="monotone"
              dataKey="combined"
              stroke={theme.colors.accent}
              strokeWidth={2}
              dot={false}
              name="Combined Straddle"
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MultiStrikeStraddleLineChart;
