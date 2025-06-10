'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useTheme } from '@/context/ThemeContext';
import FuturesOIAnalysisFilterBar from '@/components/charts/FuturesOIAnalysisFilterBar';
import FuturesOIDataTable from '@/components/table/FuturesOIDataTable';
import FuturesOIChart from '@/components/charts/FuturesOIChart';
import DebugComponent from './debug';

const FuturesOIAnalysisPage: React.FC = () => {
  const { theme } = useTheme();
  const { futuresOIAnalysisData, futuresOIAnalysisFilters } = useSelector((state: RootState) => state.chart);
  
  // Filter data based on selected filters
  const filteredData = React.useMemo(() => {
    if (!futuresOIAnalysisData?.data) {
      return [];
    }

    let filtered = futuresOIAnalysisData.data;
    
    // Filter by symbol if not "All Symbols"
    if (futuresOIAnalysisFilters.symbol !== "All Symbols") {
      const originalLength = filtered.length;
      filtered = filtered.filter(item => item.symbol === futuresOIAnalysisFilters.symbol);
    }
    
    return filtered;
  }, [futuresOIAnalysisData.data, futuresOIAnalysisFilters]);  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: theme.colors.background }}>
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 
              className="text-3xl font-bold mb-2"
              style={{ color: theme.colors.text }}
            >
              Futures OI Analysis
            </h1>            <p 
              className="text-base font-medium"
              style={{ color: theme.colors.text, opacity: 0.8 }}
            >
              Last updated: {futuresOIAnalysisData?.lastUpdated || 'N/A'}
            </p>
          </div>
          <div className="flex items-center space-x-8">            <div 
              className="text-center p-4 rounded-lg"
              style={{ 
                backgroundColor: theme.colors.card.bg,
                border: `1px solid ${theme.colors.card.border}`
              }}
            >
              <div className="text-sm font-medium mb-2" style={{ color: theme.colors.text, opacity: 0.7 }}>Total OI</div>
              <div className="text-2xl font-bold" style={{ color: theme.colors.text }}>
                {futuresOIAnalysisData?.summary?.totalOI?.toLocaleString() || '0'}
              </div>
            </div>
            <div 
              className="text-center p-4 rounded-lg"
              style={{ 
                backgroundColor: theme.colors.card.bg,
                border: `1px solid ${theme.colors.card.border}`
              }}
            >
              <div className="text-sm font-medium mb-2" style={{ color: theme.colors.text, opacity: 0.7 }}>Total Volume</div>
              <div className="text-2xl font-bold" style={{ color: theme.colors.text }}>
                {futuresOIAnalysisData?.summary?.totalVolume?.toLocaleString() || '0'}
              </div>
            </div>
            <div 
              className="text-center p-4 rounded-lg"
              style={{ 
                backgroundColor: theme.colors.card.bg,
                border: `1px solid ${theme.colors.card.border}`
              }}
            >
              <div className="text-sm font-medium mb-2" style={{ color: theme.colors.text, opacity: 0.7 }}>Market Sentiment</div>
              <div 
                className="text-2xl font-bold"
                style={{ 
                  color: futuresOIAnalysisData?.summary?.sentiment === 'Bullish' 
                    ? '#10b981' 
                    : futuresOIAnalysisData?.summary?.sentiment === 'Bearish' 
                      ? '#ef4444' 
                      : theme.colors.text 
                }}
              >
                {futuresOIAnalysisData?.summary?.sentiment || 'N/A'}
              </div>
            </div>
          </div>
        </div>{/* Filter Bar */}
        <FuturesOIAnalysisFilterBar />        {/* Data Table */}
        <div className="rounded-lg shadow-sm" style={{ 
          backgroundColor: theme.colors.card.bg,
          border: `1px solid ${theme.colors.card.border}`
        }}>
          <div className="px-6 py-4 border-b" style={{ borderColor: theme.colors.card.border }}>
            <div className="flex items-center justify-between">
              <h2 
                className="text-xl font-semibold"
                style={{ color: theme.colors.text }}
              >
                Open Interest Analysis
              </h2>
              <div className="flex items-center space-x-4">
                <div 
                  className="text-base font-medium"
                  style={{ color: theme.colors.text, opacity: 0.8 }}
                >
                  Showing {filteredData.length} securities
                </div>
                <div 
                  className="text-sm px-3 py-1 rounded-full font-medium"
                  style={{ 
                    backgroundColor: '#10b981',
                    color: '#ffffff'
                  }}
                >
                  Live Data
                </div>
              </div>
            </div>
          </div>
          <div className="overflow-hidden">
            <FuturesOIDataTable data={filteredData} />
          </div>
        </div>        {/* Chart Section */}
        <div className="rounded-lg shadow-sm" style={{ 
          backgroundColor: theme.colors.card.bg,
          border: `1px solid ${theme.colors.card.border}`
        }}>
          <div className="px-6 py-4 border-b" style={{ borderColor: theme.colors.card.border }}>
            <h2 
              className="text-xl font-semibold mb-1"
              style={{ color: theme.colors.text }}
            >
              OI Trends Chart
            </h2>
            <p 
              className="text-base"
              style={{ color: theme.colors.text, opacity: 0.7 }}
            >
              Real-time open interest movement throughout the trading session
            </p>
          </div>          <div className="p-6">
            <FuturesOIChart data={futuresOIAnalysisData?.chartData || []} />
          </div>
        </div>        {/* Additional Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div 
            className="p-6 rounded-lg border"
            style={{
              backgroundColor: theme.colors.card.bg,
              borderColor: theme.colors.card.border
            }}
          >
            <div 
              className="text-sm font-medium mb-2"
              style={{ color: theme.colors.text, opacity: 0.7 }}
            >
              Top Gainer
            </div>            <div 
              className="text-2xl font-bold"
              style={{ color: '#10b981' }}
            >
              {futuresOIAnalysisData?.summary?.topGainer || 'N/A'}
            </div>
          </div>

          <div 
            className="p-6 rounded-lg border"
            style={{
              backgroundColor: theme.colors.card.bg,
              borderColor: theme.colors.card.border
            }}
          >
            <div 
              className="text-sm font-medium mb-2"
              style={{ color: theme.colors.text, opacity: 0.7 }}
            >
              Top Loser
            </div>
            <div 
              className="text-2xl font-bold"
              style={{ color: '#ef4444' }}
            >
              {futuresOIAnalysisData?.summary?.topLoser || 'N/A'}
            </div>
          </div>

          <div 
            className="p-6 rounded-lg border"
            style={{
              backgroundColor: theme.colors.card.bg,
              borderColor: theme.colors.card.border
            }}
          >
            <div 
              className="text-sm font-medium mb-2"
              style={{ color: theme.colors.text, opacity: 0.7 }}
            >
              Current Time
            </div>
            <div 
              className="text-2xl font-bold"
              style={{ color: theme.colors.text }}
            >
              {futuresOIAnalysisData?.currentTime || 'N/A'}
            </div>
          </div>

          <div 
            className="p-6 rounded-lg border"
            style={{
              backgroundColor: theme.colors.card.bg,
              borderColor: theme.colors.card.border
            }}
          >
            <div 
              className="text-sm font-medium mb-2"
              style={{ color: theme.colors.text, opacity: 0.7 }}
            >
              Active Contracts
            </div>
            <div 
              className="text-2xl font-bold"
              style={{ color: theme.colors.text }}
            >
              {filteredData.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FuturesOIAnalysisPage;
