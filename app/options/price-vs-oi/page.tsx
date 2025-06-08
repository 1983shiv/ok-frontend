"use client";

import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import PriceVsOIFilterBar from '@/components/charts/PriceVsOIFilterBar';
import CallPriceVsOIChart from '@/components/charts/CallPriceVsOIChart';
import PutPriceVsOIChart from '@/components/charts/PutPriceVsOIChart';
import { useTheme } from '@/context/ThemeContext';

export default function PriceVsOIPage() {
  const { theme } = useTheme();
  const { priceVsOIData, priceVsOIFilters } = useSelector((state: RootState) => state.chart);

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: theme.colors.background }}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-2">
          <h1 className="text-2xl font-bold" style={{ color: theme.colors.text }}>
            Options Strike Price vs OI
          </h1>
          <p className="text-sm" style={{ color: theme.colors.text }}>
            Analyze strike price and open interest correlation for calls and puts
          </p>
        </div>

        {/* Filter Bar */}
        <PriceVsOIFilterBar />

        {/* Current Strike Info */}
        <div className="rounded-lg border p-4" style={{ 
          backgroundColor: theme.colors.card.bg,
          borderColor: theme.colors.card.border 
        }}>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Symbol</span>
              <span className="font-medium" style={{ color: theme.colors.text }}>
                {priceVsOIFilters.symbol}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Expiry</span>
              <span className="font-medium" style={{ color: theme.colors.text }}>
                {priceVsOIFilters.expiry}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Strike</span>
              <span className="font-medium" style={{ color: theme.colors.text }}>
                {priceVsOIFilters.strike}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Live</span>
              <span className={`px-2 py-1 rounded text-xs ${
                priceVsOIFilters.isLive 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-gray-500/20 text-gray-400'
              }`}>
                {priceVsOIFilters.isLive ? '✓' : '✗'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Historical Date</span>
              <span className="font-medium" style={{ color: theme.colors.text }}>
                {priceVsOIFilters.historicalDate}
              </span>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="space-y-6">
          {/* Call Price vs OI Chart */}
          <div className="rounded-lg border" style={{ 
            backgroundColor: theme.colors.card.bg,
            borderColor: theme.colors.card.border 
          }}>
            <div className="p-4 border-b" style={{ borderColor: theme.colors.card.border }}>
              <h3 className="text-lg font-semibold" style={{ color: theme.colors.text }}>
                Call Price vs OI
              </h3>
              <p className="text-sm mt-1" style={{ color: theme.colors.text }}>
                Price and Open Interest movements for Call options
              </p>
            </div>
            <div className="p-4">
              <CallPriceVsOIChart data={priceVsOIData.priceVsOIData.callChartData} />
            </div>
          </div>

          {/* Put Price vs OI Chart */}
          <div className="rounded-lg border" style={{ 
            backgroundColor: theme.colors.card.bg,
            borderColor: theme.colors.card.border 
          }}>
            <div className="p-4 border-b" style={{ borderColor: theme.colors.card.border }}>
              <h3 className="text-lg font-semibold" style={{ color: theme.colors.text }}>
                Put Price vs OI
              </h3>
              <p className="text-sm mt-1" style={{ color: theme.colors.text }}>
                Price and Open Interest movements for Put options
              </p>
            </div>
            <div className="p-4">
              <PutPriceVsOIChart data={priceVsOIData.priceVsOIData.putChartData} />
            </div>
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-lg p-4 border" style={{ 
            backgroundColor: theme.colors.card.bg,
            borderColor: theme.colors.card.border 
          }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Call Price</p>
                <p className="text-2xl font-bold text-blue-400">
                  {priceVsOIData.priceVsOIData.callChartData[priceVsOIData.priceVsOIData.callChartData.length - 1]?.price?.toFixed(2) || '0.00'}
                </p>
              </div>
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
              </div>
            </div>
          </div>

          <div className="rounded-lg p-4 border" style={{ 
            backgroundColor: theme.colors.card.bg,
            borderColor: theme.colors.card.border 
          }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Call OI</p>
                <p className="text-2xl font-bold text-green-400">
                  {((priceVsOIData.priceVsOIData.callChartData[priceVsOIData.priceVsOIData.callChartData.length - 1]?.oi || 0) / 100000).toFixed(1)}L
                </p>
              </div>
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
              </div>
            </div>
          </div>

          <div className="rounded-lg p-4 border" style={{ 
            backgroundColor: theme.colors.card.bg,
            borderColor: theme.colors.card.border 
          }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Put Price</p>
                <p className="text-2xl font-bold text-red-400">
                  {priceVsOIData.priceVsOIData.putChartData[priceVsOIData.priceVsOIData.putChartData.length - 1]?.price?.toFixed(2) || '0.00'}
                </p>
              </div>
              <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
              </div>
            </div>
          </div>

          <div className="rounded-lg p-4 border" style={{ 
            backgroundColor: theme.colors.card.bg,
            borderColor: theme.colors.card.border 
          }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Put OI</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {((priceVsOIData.priceVsOIData.putChartData[priceVsOIData.priceVsOIData.putChartData.length - 1]?.putOI || 0) / 100000).toFixed(1)}L
                </p>
              </div>
              <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm border-t pt-4" style={{ 
          borderColor: theme.colors.card.border 
        }}>
          <p>Data updated every {priceVsOIFilters.duration} • Last update: {new Date().toLocaleTimeString()}</p>
        </div>
      </div>
    </div>
  );
}
