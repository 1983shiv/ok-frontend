'use client';

import FilterBar from '@/components/FilterBar';
import ChartPanel from '@/components/ChartPanel';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';


export default function OIAnalysis() {
  const { filters } = useSelector((state: RootState) => state.chart);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">

        <FilterBar />

        <div className="grid grid-cols-1 gap-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartPanel type="changeInOI" title="Change in Open Interest (CE vs PE)" />
            <ChartPanel type="strikeOI" title="Open Interest by Strike Price" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartPanel type="totalOI" title="Total Open Interest (CE vs PE)" height={300} />
            <ChartPanel type="changeInOI" title="Change in Open Interest (Detailed)" />
          </div>
        </div>
      </div>
    </div>
  );
}