"use client";

import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import PriceVsOIFilterBar from '@/components/charts/PriceVsOIFilterBar';
import FuturePriceVsOIChart from '@/components/charts/FuturePriceVsOIChart';
import PutPriceVsOIChart from '@/components/charts/PutPriceVsOIChart';
import { useTheme } from '@/context/ThemeContext';

export default function PriceVsOIPage() {
  const { theme } = useTheme();
  const { futurePriceVsOIData, futurePriceVsOIFilters } = useSelector((state: RootState) => state.chart);

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: theme.colors.background }}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-2">
          <h1 className="text-2xl font-bold" style={{ color: theme.colors.text }}>
            Future Price vs OI
          </h1>
          <p className="text-sm" style={{ color: theme.colors.text }}>
            Analyze future price and open interest correlation
          </p>
        </div>

        {/* Filter Bar */}
        <PriceVsOIFilterBar enabledFuture={false}/>

        {/* Charts Section */}
        <div className="space-y-6">
          {/* Call Price vs OI Chart */}
          <div className="rounded-lg border" style={{ 
            backgroundColor: theme.colors.card.bg,
            borderColor: theme.colors.card.border 
          }}>
            <div className="p-4 border-b" style={{ borderColor: theme.colors.card.border }}>
              <h3 className="text-lg font-semibold" style={{ color: theme.colors.text }}>
                Future Price vs OI
              </h3>
              <p className="text-sm mt-1" style={{ color: theme.colors.text }}>
                Price and Open Interest movements for selected future options
              </p>            </div>
            <div className="p-4">
              <FuturePriceVsOIChart data={futurePriceVsOIData.futurePriceVsOIData.chartData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
