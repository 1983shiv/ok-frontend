'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

const DebugComponent: React.FC = () => {
  const chartState = useSelector((state: RootState) => state.chart);
  const { futuresOIAnalysisData, futuresOIAnalysisFilters } = chartState as any;

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg m-4">
      <h3 className="text-lg font-bold mb-4">Debug Information</h3>
      
      <div className="mb-4">
        <h4 className="font-semibold">Current Filters:</h4>
        <pre className="bg-gray-200 dark:bg-gray-700 p-2 rounded text-sm">
          {JSON.stringify(futuresOIAnalysisFilters, null, 2)}
        </pre>
      </div>

      <div className="mb-4">
        <h4 className="font-semibold">Data Summary:</h4>
        <p>Data available: {futuresOIAnalysisData ? 'Yes' : 'No'}</p>
        <p>Data array length: {futuresOIAnalysisData?.data?.length || 0}</p>
        <p>Last updated: {futuresOIAnalysisData?.lastUpdated || 'N/A'}</p>
      </div>

      <div className="mb-4">
        <h4 className="font-semibold">Available Symbols:</h4>
        <div className="max-h-40 overflow-y-auto">
          {futuresOIAnalysisData?.data?.slice(0, 10).map((item: any, index: number) => (
            <div key={index} className="text-sm">
              {item.symbol} - LTP: ₹{item.ltp.toFixed(2)}
            </div>
          ))}
        </div>
        {futuresOIAnalysisData?.data?.length > 10 && (
          <p className="text-sm text-gray-600">... and {futuresOIAnalysisData.data.length - 10} more</p>
        )}
      </div>
      
      <div>
        <h4 className="font-semibold">Filter Test:</h4>
        <p>Current symbol filter: {futuresOIAnalysisFilters?.symbol}</p>
        <p>Should show all data: {futuresOIAnalysisFilters?.symbol === 'All Symbols' ? 'Yes' : 'No'}</p>
      </div>
    </div>
  );
};

export default DebugComponent;
