'use client';

import { useEffect, ReactNode } from 'react';
import { useTradingData } from '@/hooks/useTradingData';

interface TradingDataProviderProps {
  children: ReactNode;
}

export default function TradingDataProvider({ children }: TradingDataProviderProps) {
  const { isLoading, hasErrors, connected, fetchAllData, connectAndSubscribe } = useTradingData();

  useEffect(() => {
    // Initialize data fetching and WebSocket connection
    console.log('🚀 Initializing TradingOK data connections...');
    
    // Fetch initial data
    fetchAllData();
    
    // Connect to WebSocket for real-time updates
    connectAndSubscribe();

    // Cleanup function
    return () => {
      console.log('🧹 Cleaning up TradingOK data connections...');
    };
  }, [fetchAllData, connectAndSubscribe]);

  // Optional: Show loading state while initial data is being fetched
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Loading TradingOK Data</h2>
          <p className="text-gray-500">Connecting to backend services...</p>
          <div className="mt-4 text-sm text-gray-400">
            WebSocket: {connected ? '🟢 Connected' : '🔴 Disconnected'}
          </div>
        </div>
      </div>
    );
  }

  // Optional: Show error state if there are critical errors
  if (hasErrors && !connected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Connection Error</h2>
          <p className="text-gray-500 mb-4">
            Unable to connect to the TradingOK backend services. Please ensure the backend server is running.
          </p>
          <div className="space-y-2 text-sm text-gray-400">
            <div>Backend: http://localhost:8080</div>
            <div>WebSocket: {connected ? '🟢 Connected' : '🔴 Disconnected'}</div>
          </div>
          <button
            onClick={() => {
              fetchAllData();
              connectAndSubscribe();
            }}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
