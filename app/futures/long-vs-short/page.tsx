"use client";

import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import LongShortFilterBar from '@/components/charts/LongShortFilterBar';
import LongShortDataTable from '@/components/table/LongShortDataTable';
import LongShortPriceChart from '@/components/charts/LongShortPriceChart';
import LongShortAnalysisChart from '@/components/charts/LongShortAnalysisChart';
import { useTheme } from '@/context/ThemeContext';

export default function LongAndShortPage() {
    const {theme} = useTheme()
  const { longShortOptionsData, longShortFilters } = useSelector((state: RootState) => state.chart);

  return (
    <div className="min-h-screen  p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-2">
          <h1 className="text-2xl font-bold ">Long & Short Future Analysis</h1>
          <p className=" text-sm">
            Analyze long and short positions with real-time option chain data and market sentiment indicators
          </p>
        </div>

        {/* Filter Bar */}
        <LongShortFilterBar futureEnabled={true}/>

        {/* Data Table */}
        <div className="rounded-lg">
          <LongShortDataTable data={longShortOptionsData.data} />
        </div>

        {/* Charts Section */}
        {/* <div className="grid grid-cols-1 xl:grid-cols-2 gap-6"> */}
          {/* Price Movement Chart */}
          <div className="rounded-lg">
            <div className="p-4 border-b border-gray-800">
              <h3 className="text-lg font-semibold ">Price Movement & OI Analysis</h3>
              <p className="text-sm  mt-1">
                Track price changes and open interest movements over time
              </p>
            </div>
            <div className="p-4">
              <LongShortPriceChart data={longShortOptionsData.chartData} />
            </div>
          </div>

          {/* Long vs Short Analysis Chart */}
          <div className=" rounded-lg">
            <div className="p-4 border-b ">
              <h3 className="text-lg font-semibold ">Long vs Short Distribution</h3>
              <p className="text-sm  mt-1">
                Percentage breakdown of market positions and sentiment analysis
              </p>
            </div>
            <div className="p-4">
              <LongShortAnalysisChart data={longShortOptionsData.chartData} />
            </div>
          </div>
        {/* </div> */}

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className={`border-${theme.colors.card.border} rounded-lg p-4`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm ">Total Positions</p>
                <p className="text-2xl font-bold ">{longShortOptionsData.data.length}</p>
              </div>
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
              </div>
            </div>
          </div>

          <div className="rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm ">Long Building</p>
                <p className="text-2xl font-bold text-green-400">
                  {longShortOptionsData.data.filter((item: any) => item.longVsShort === 'Long Building').length}
                </p>
              </div>
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
              </div>
            </div>
          </div>

          <div className="rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm ">Short Building</p>
                <p className="text-2xl font-bold text-red-400">
                  {longShortOptionsData.data.filter((item: any) => item.longVsShort === 'Short Building').length}
                </p>
              </div>
              <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
              </div>
            </div>
          </div>

          <div className="rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm ">Market Sentiment</p>
                <p className="text-2xl font-bold text-yellow-400">                  {longShortOptionsData.data.filter((item: any) => 
                    item.longVsShort === 'Long Building' || item.longVsShort === 'Short Covering'
                  ).length > longShortOptionsData.data.filter((item: any) => 
                    item.longVsShort === 'Short Building' || item.longVsShort === 'Long Unwinding'
                  ).length ? 'Bullish' : 'Bearish'}
                </p>
              </div>
              <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm border-t border-gray-800 pt-4">
          <p>Data updated every {longShortFilters.interval} • Last update: {new Date().toLocaleTimeString()}</p>
        </div>
      </div>
    </div>
  );
}
