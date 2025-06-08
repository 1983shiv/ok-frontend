'use client';

import { useTheme } from '@/context/ThemeContext';
import TrendingStrikesFilterBar from '@/components/charts/TrendingStrikesFilterBar';
import TrendingStrikesLineChart from '@/components/charts/TrendingStrikesLineChart';
import COIBarChart from '@/components/charts/COIBarChart';

export default function TrendingStrikes() {
  const { theme } = useTheme();

  return (
    <div 
      className="min-h-screen p-4"
      style={{ backgroundColor: theme.colors.background }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 
            className="text-2xl font-bold"
            style={{ color: theme.colors.text }}
          >
            Trending Strikes for Open Interest
          </h1>
        </div>

        {/* Filter Bar */}
        <TrendingStrikesFilterBar />

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[25%_75%] gap-6">          {/* Left Side - Bar Chart */}
          <div className="space-y-4">
            <COIBarChart />
          </div>

          {/* Right Side - Line Chart */}
          <div className="space-y-4">
            <TrendingStrikesLineChart />
          </div>
        </div>
      </div>
    </div>
  );
}
