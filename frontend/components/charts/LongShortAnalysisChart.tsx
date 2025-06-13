'use client';

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTheme } from '@/context/ThemeContext';

interface ChartDataItem {
  time: string;
  price: number;
  oi: number;
  longBuildingPercent: number;
  shortCoveringPercent: number;
  longUnwindingPercent: number;
  shortBuiltPercent: number;
}

interface LongShortAnalysisChartProps {
  data: {
    priceMovement: ChartDataItem[];
  };
  className?: string;
}

const LongShortAnalysisChart: React.FC<LongShortAnalysisChartProps> = ({ data, className = '' }) => {
  const { theme } = useTheme();

  const formatTooltip = (value: any, name: string) => {
    return [`${value}%`, name.replace('Percent', '')];
  };

  return (
    <div className={`${className}`}>
      <div 
        className="p-6 rounded-lg border"
        style={{ 
          backgroundColor: theme.colors.card.bg, 
          borderColor: theme.colors.card.border 
        }}
      >
        <h3 className="text-lg font-semibold mb-4" style={{ color: theme.colors.text }}>
          Long vs Short Analysis Distribution
        </h3>
          <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart 
              data={data.priceMovement}
              stackOffset="expand"
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
                tick={{ fill: theme.colors.text }}
              />
              <YAxis 
                stroke={theme.colors.text}
                fontSize={12}
                tick={{ fill: theme.colors.text }}
                tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
              />
              <Tooltip 
                formatter={formatTooltip}
                labelStyle={{ color: theme.colors.text }}
                contentStyle={{
                  backgroundColor: theme.colors.card.bg,
                  border: `1px solid ${theme.colors.card.border}`,
                  borderRadius: '8px',
                  color: theme.colors.text
                }}
              />
              <Legend 
                wrapperStyle={{ color: theme.colors.text }}
              />
              <Area
                type="monotone"
                dataKey="longBuildingPercent"
                stackId="1"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.8}
                name="Long Building"
              />
              <Area
                type="monotone"
                dataKey="shortCoveringPercent"
                stackId="1"
                stroke="#22d3ee"
                fill="#22d3ee"
                fillOpacity={0.8}
                name="Short Covering"
              />
              <Area
                type="monotone"
                dataKey="longUnwindingPercent"
                stackId="1"
                stroke="#ef4444"
                fill="#ef4444"
                fillOpacity={0.8}
                name="Long Unwinding"
              />
              <Area
                type="monotone"
                dataKey="shortBuiltPercent"
                stackId="1"
                stroke="#f97316"
                fill="#f97316"
                fillOpacity={0.8}
                name="Short Building"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        {/* Legend with color indicators */}
        <div className="mt-4 flex flex-wrap gap-4 justify-center">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            <span className="text-sm" style={{ color: theme.colors.text }}>Long Building</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-cyan-400"></div>
            <span className="text-sm" style={{ color: theme.colors.text }}>Short Covering</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-sm" style={{ color: theme.colors.text }}>Long Unwinding</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span className="text-sm" style={{ color: theme.colors.text }}>Short Building</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LongShortAnalysisChart;
