'use client';

import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface ChartDataItem {
  time: string;
  totalOI: number;
  niftyFuture: number;
  bnfFuture: number;
}

interface FuturesOIChartProps {
  data: ChartDataItem[];
}

const FuturesOIChart: React.FC<FuturesOIChartProps> = ({ data }) => {
  const { theme } = useTheme();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div
          className="p-3 border rounded-lg shadow-lg"
          style={{
            backgroundColor: theme.colors.card.bg,
            borderColor: theme.colors.card.border,
          }}
        >
          <p className="text-sm font-medium" style={{ color: theme.colors.text }}>
            {`Time: ${label}`}
          </p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.dataKey === 'totalOI'
                ? `Total OI: ${entry.value.toLocaleString()}`
                : entry.dataKey === 'niftyFuture'
                ? `Nifty Future: ${entry.value.toFixed(2)}`
                : `BNF Future: ${entry.value.toFixed(2)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div
      className="rounded-lg p-4 border"
      style={{
        backgroundColor: theme.colors.card.bg,
        borderColor: theme.colors.card.border,
      }}
    >
      <h3
        className="mb-4 font-semibold"
        style={{ color: theme.colors.text }}
      >
        Futures OI Trends
      </h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 10,
              right: 30,
              left: 20,
              bottom: 10,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={theme.colors.divider}
              opacity={0.4}
            />
            <XAxis
              dataKey="time"
              tick={{ fill: theme.colors.text, fontSize: 12 }}
              axisLine={{ stroke: theme.colors.divider }}
              tickLine={{ stroke: theme.colors.divider }}
            />
            <YAxis
              yAxisId="price"
              orientation="right"
              domain={['auto', 'auto']}
              tick={{ fill: theme.colors.text, fontSize: 12 }}
              axisLine={{ stroke: theme.colors.divider }}
              tickLine={{ stroke: theme.colors.divider }}
            />
            <YAxis
              yAxisId="oi"
              orientation="left"
              domain={['auto', 'auto']}
              tick={{ fill: theme.colors.text, fontSize: 12 }}
              axisLine={{ stroke: theme.colors.divider }}
              tickLine={{ stroke: theme.colors.divider }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{
                paddingTop: "10px",
                color: theme.colors.text,
              }}
            />
            <Line
              yAxisId="oi"
              type="monotone"
              dataKey="totalOI"
              stroke="#8884d8"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
              name="Total OI"
            />
            <Line
              yAxisId="price"
              type="monotone"
              dataKey="niftyFuture"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
              name="Nifty Future"
            />
            <Line
              yAxisId="price"
              type="monotone"
              dataKey="bnfFuture"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
              name="BNF Future"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default FuturesOIChart;
