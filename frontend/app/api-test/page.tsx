'use client';

import { useState, useEffect } from 'react';
import apiClient from '@/services/apiClient';

interface TestResult {
  endpoint: string;
  status: 'pending' | 'success' | 'error';
  data?: any;
  error?: string;
  duration?: number;
}

export default function APITestPage() {
  const [tests, setTests] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  const testEndpoints = [
    { name: 'Health Check', endpoint: '/health', method: () => apiClient.healthCheck() },
    { name: 'Market Status', endpoint: '/market/status', method: () => apiClient.getMarketStatus() },
    { name: 'Market Overview', endpoint: '/market/overview', method: () => apiClient.getMarketOverview() },
    { name: 'Options Chain', endpoint: '/options/chain/NIFTY/2024-12-26', method: () => apiClient.getOptionsChain('NIFTY', '2024-12-26') },
    { name: 'Open Interest', endpoint: '/oi/data/NIFTY/2024-12-26', method: () => apiClient.getOpenInterest('NIFTY', '2024-12-26') },
    { name: 'Call-Put OI', endpoint: '/oi/call-put/NIFTY/2024-12-26', method: () => apiClient.getCallPutOI('NIFTY', '2024-12-26') },
    { name: 'PCR Analysis', endpoint: '/oi/pcr/NIFTY/2024-12-26', method: () => apiClient.getPCR('NIFTY', '2024-12-26') },
    { name: 'Futures Data', endpoint: '/futures/data/NIFTY', method: () => apiClient.getFuturesData('NIFTY') },
  ];

  useEffect(() => {
    checkBackendStatus();
  }, []);

  const checkBackendStatus = async () => {
    try {
      setBackendStatus('checking');
      await apiClient.healthCheck();
      setBackendStatus('online');
    } catch (error) {
      setBackendStatus('offline');
    }
  };

  const runTest = async (testConfig: any, index: number) => {
    const startTime = Date.now();
    
    setTests(prev => prev.map((test, i) => 
      i === index ? { ...test, status: 'pending' } : test
    ));

    try {
      const data = await testConfig.method();
      const duration = Date.now() - startTime;
      
      setTests(prev => prev.map((test, i) => 
        i === index ? { 
          ...test, 
          status: 'success', 
          data: data,
          duration 
        } : test
      ));
    } catch (error) {
      const duration = Date.now() - startTime;
      
      setTests(prev => prev.map((test, i) => 
        i === index ? { 
          ...test, 
          status: 'error', 
          error: error instanceof Error ? error.message : 'Unknown error',
          duration 
        } : test
      ));
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setTests(testEndpoints.map(test => ({
      endpoint: test.endpoint,
      status: 'pending' as const
    })));

    for (let i = 0; i < testEndpoints.length; i++) {
      await runTest(testEndpoints[i], i);
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    setIsRunning(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600';
      case 'error': return 'text-red-600';
      case 'pending': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'pending': return '⏳';
      default: return '⭕';
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Backend API Connectivity Test</h1>
        
        {/* Backend Status */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Backend Server Status</h2>
          <div className="flex items-center space-x-4">
            <span className="text-lg">Status:</span>
            <span className={`text-lg font-semibold ${
              backendStatus === 'online' ? 'text-green-600' : 
              backendStatus === 'offline' ? 'text-red-600' : 
              'text-yellow-600'
            }`}>
              {backendStatus === 'online' && '🟢 Online'}
              {backendStatus === 'offline' && '🔴 Offline'}
              {backendStatus === 'checking' && '🟡 Checking...'}
            </span>
            <button
              onClick={checkBackendStatus}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              disabled={backendStatus === 'checking'}
            >
              Refresh
            </button>
          </div>
          
          {backendStatus === 'offline' && (
            <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-400">
              <p className="text-red-700">
                <strong>Backend server is not running!</strong><br/>
                Please start the backend server by running:<br/>
                <code className="bg-red-100 px-2 py-1 rounded">cd backend && npm start</code>
              </p>
            </div>
          )}
        </div>

        {/* Test Controls */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">API Endpoint Tests</h2>
          <button
            onClick={runAllTests}
            disabled={isRunning || backendStatus !== 'online'}
            className={`px-6 py-3 rounded-lg font-semibold ${
              isRunning || backendStatus !== 'online'
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-500 text-white hover:bg-green-600'
            }`}
          >
            {isRunning ? 'Running Tests...' : 'Run All Tests'}
          </button>
        </div>

        {/* Test Results */}
        {tests.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Test Results</h2>
            <div className="space-y-4">
              {tests.map((test, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{getStatusIcon(test.status)}</span>
                      <span className="font-semibold">{testEndpoints[index].name}</span>
                      <span className="text-gray-500 text-sm">{test.endpoint}</span>
                    </div>
                    {test.duration && (
                      <span className="text-sm text-gray-500">{test.duration}ms</span>
                    )}
                  </div>
                  
                  {test.error && (
                    <div className="text-red-600 text-sm mt-2">
                      Error: {test.error}
                    </div>
                  )}
                  
                  {test.data && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-blue-600 text-sm">
                        View Response Data
                      </summary>
                      <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-40">
                        {JSON.stringify(test.data, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
