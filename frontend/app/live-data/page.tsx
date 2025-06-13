'use client';

import React from 'react';
import ApiDataDashboard from '@/components/ApiDataDashboard';
import { useWebSocket } from '@/hooks/useTradingData';

export default function LiveDataPage() {
  const { connected } = useWebSocket();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Live Trading Data Integration
          </h1>
          <p className="text-gray-600">
            Real-time options trading data powered by backend API and WebSocket connections
          </p>
          
          {/* Connection Status Banner */}
          <div className={`mt-4 p-4 rounded-lg ${
            connected 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-yellow-50 border border-yellow-200'
          }`}>
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-3 ${
                connected ? 'bg-green-500' : 'bg-yellow-500'
              }`}></div>
              <span className={`font-medium ${
                connected ? 'text-green-800' : 'text-yellow-800'
              }`}>
                {connected 
                  ? '✅ Connected to live data feed' 
                  : '⚠️ Establishing connection to data feed...'
                }
              </span>
            </div>
            
            {!connected && (
              <div className="mt-2 text-sm text-yellow-700">
                Make sure the backend server is running on port 8080
              </div>
            )}
          </div>
        </div>

        {/* Main Dashboard */}
        <ApiDataDashboard />

        {/* Integration Info */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            API Integration Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h3 className="font-medium text-gray-700">✅ Implemented</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Market status and overview</li>
                <li>• Options chain data</li>
                <li>• Premium decay analysis</li>
                <li>• Open Interest data</li>
                <li>• Call/Put OI ratios</li>
                <li>• PCR calculations</li>
                <li>• WebSocket real-time updates</li>
                <li>• Error handling and loading states</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium text-gray-700">🔄 Data Sources</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• REST API endpoints</li>
                <li>• WebSocket streaming</li>
                <li>• Redis caching layer</li>
                <li>• Real-time data simulation</li>
                <li>• Historical data access</li>
                <li>• Multi-symbol support</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium text-gray-700">🎯 Key Benefits</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• No more static JSON files</li>
                <li>• Live market updates</li>
                <li>• Scalable architecture</li>
                <li>• Error resilience</li>
                <li>• Performance optimized</li>
                <li>• Type-safe API calls</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-800 mb-2">🚀 Next Steps</h3>
            <p className="text-sm text-blue-700">
              The frontend now uses live API data instead of static JSON files. 
              All existing chart components can be updated to use the new Redux state 
              structure with real-time data updates via WebSocket connections.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
