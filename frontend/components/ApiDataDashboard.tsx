'use client';

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { useMarketData, useOptionsData, useOIData, useWebSocket } from '@/hooks/useTradingData';
import { setFilters } from '@/redux/chartSlice';

interface ApiDataDashboardProps {
  className?: string;
}

export default function ApiDataDashboard({ className = '' }: ApiDataDashboardProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { filters, loading, websocket } = useSelector((state: RootState) => state.chart);
  
  // Use custom hooks for data management
  const { marketData, loading: marketLoading, refetch: refetchMarket } = useMarketData();
  const { optionsData, loading: optionsLoading, refetch: refetchOptions } = useOptionsData();
  const { oiData, loading: oiLoading, refetch: refetchOI } = useOIData();
  const { connected, subscribeToMarket, subscribeToOptions, subscribeToOI } = useWebSocket();

  // Handle filter changes
  const handleSymbolChange = (symbol: string) => {
    dispatch(setFilters({ symbol }));
  };

  const handleExpiryChange = (expiry: string) => {
    dispatch(setFilters({ expiry }));
  };

  // Subscribe to real-time data when filters change
  useEffect(() => {
    if (connected && filters.symbol && filters.expiry) {
      subscribeToMarket([filters.symbol]);
      subscribeToOptions(filters.symbol, filters.expiry);
      subscribeToOI(filters.symbol, filters.expiry);
    }
  }, [connected, filters.symbol, filters.expiry, subscribeToMarket, subscribeToOptions, subscribeToOI]);

  return (
    <div className={`p-6 space-y-6 ${className}`}>
      {/* Header with Connection Status */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Live Trading Data Dashboard</h1>
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 ${connected ? 'text-green-600' : 'text-red-600'}`}>
              <div className={`w-3 h-3 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="font-medium">{connected ? 'Live' : 'Disconnected'}</span>
            </div>
            <div className="text-sm text-gray-500">
              Last update: {websocket.lastHeartbeat ? new Date(websocket.lastHeartbeat).toLocaleTimeString() : 'Never'}
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex space-x-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Symbol</label>
            <select
              value={filters.symbol}
              onChange={(e) => handleSymbolChange(e.target.value)}
              className="border rounded-md px-3 py-2 bg-white"
            >
              <option value="NIFTY">NIFTY</option>
              <option value="BANKNIFTY">BANKNIFTY</option>
              <option value="FINNIFTY">FINNIFTY</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Expiry</label>
            <select
              value={filters.expiry}
              onChange={(e) => handleExpiryChange(e.target.value)}
              className="border rounded-md px-3 py-2 bg-white"
            >
              <option value="2024-12-26">26-Dec-2024</option>
              <option value="2025-01-30">30-Jan-2025</option>
              <option value="2025-02-27">27-Feb-2025</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                refetchMarket();
                refetchOptions();
                refetchOI();
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              disabled={marketLoading.isLoading || optionsLoading.isLoading || oiLoading.isLoading}
            >
              {(marketLoading.isLoading || optionsLoading.isLoading || oiLoading.isLoading) ? 'Refreshing...' : 'Refresh Data'}
            </button>
          </div>
        </div>
      </div>

      {/* Market Data Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Market Overview</h2>
          {marketLoading.isLoading && <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>}
        </div>

        {marketLoading.error ? (
          <div className="text-red-600 p-4 bg-red-50 rounded-lg">
            Error loading market data: {marketLoading.error}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-700 mb-2">Market Status</h3>
              <div className="text-lg font-semibold">
                {marketData.status ? (
                  <span className={marketData.status.isOpen ? 'text-green-600' : 'text-red-600'}>
                    {marketData.status.isOpen ? 'Open' : 'Closed'}
                  </span>
                ) : (
                  <span className="text-gray-400">Loading...</span>
                )}
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-700 mb-2">Current Price</h3>
              <div className="text-lg font-semibold">
                {marketData.overview?.currentPrice ? (
                  <span>{marketData.overview.currentPrice.toFixed(2)}</span>
                ) : (
                  <span className="text-gray-400">Loading...</span>
                )}
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-700 mb-2">Change</h3>
              <div className="text-lg font-semibold">
                {marketData.overview?.change ? (
                  <span className={marketData.overview.change >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {marketData.overview.change >= 0 ? '+' : ''}{marketData.overview.change.toFixed(2)}
                  </span>
                ) : (
                  <span className="text-gray-400">Loading...</span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Options Data Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Options Chain ({filters.symbol} - {filters.expiry})</h2>
          {optionsLoading.isLoading && <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>}
        </div>

        {optionsLoading.error ? (
          <div className="text-red-600 p-4 bg-red-50 rounded-lg">
            Error loading options data: {optionsLoading.error}
          </div>
        ) : (
          <div className="space-y-4">
            {optionsData.chain ? (
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Available Strikes</h3>
                <div className="text-sm text-gray-600">
                  {optionsData.chain.strikes ? `${optionsData.chain.strikes.length} strikes available` : 'Loading strikes...'}
                </div>
              </div>
            ) : (
              <div className="text-gray-400">Loading options chain...</div>
            )}

            {optionsData.premiumDecay && (
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Premium Decay</h3>
                <div className="text-sm text-gray-600">
                  Premium decay data available for analysis
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Open Interest Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Open Interest Analysis</h2>
          {oiLoading.isLoading && <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>}
        </div>

        {oiLoading.error ? (
          <div className="text-red-600 p-4 bg-red-50 rounded-lg">
            Error loading OI data: {oiLoading.error}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-700 mb-2">Call Put Ratio (PCR)</h3>
              <div className="text-lg font-semibold">
                {oiData.pcr?.ratio ? (
                  <span>{oiData.pcr.ratio.toFixed(2)}</span>
                ) : (
                  <span className="text-gray-400">Loading...</span>
                )}
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-700 mb-2">Max Pain</h3>
              <div className="text-lg font-semibold">
                {oiData.maxPain?.strike ? (
                  <span>{oiData.maxPain.strike}</span>
                ) : (
                  <span className="text-gray-400">Loading...</span>
                )}
              </div>
            </div>

            {oiData.callPutOI && (
              <div className="md:col-span-2 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-700 mb-2">Call vs Put OI</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Total Call OI: </span>
                    <span className="font-semibold">{oiData.callPutOI.totalCallOI?.toLocaleString() || 'Loading...'}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Total Put OI: </span>
                    <span className="font-semibold">{oiData.callPutOI.totalPutOI?.toLocaleString() || 'Loading...'}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* WebSocket Subscriptions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Real-time Subscriptions</h2>
        <div className="space-y-2">
          {websocket.subscriptions.length > 0 ? (
            websocket.subscriptions.map((subscription, index) => (
              <div key={index} className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-700">{subscription}</span>
              </div>
            ))
          ) : (
            <div className="text-gray-400 text-sm">No active subscriptions</div>
          )}
        </div>
      </div>
    </div>
  );
}
