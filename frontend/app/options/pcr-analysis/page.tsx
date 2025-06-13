'use client';

import React from 'react';
import COIBarChart from '@/components/charts/COIBarChart';
import OIBarChart from '@/components/charts/OIBarChart';
import PCRLineChart from '@/components/charts/PCRLineChart';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

export default function PCRAnalysis() {
    const { pcrAnalysisFilters } = useSelector(
        (state: RootState) => state.chart
    );

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <div className="max-w-7xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Put Call Ratio
                    </h1>
                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                            <span className="font-medium">Symbol:</span>
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                                {pcrAnalysisFilters.symbol}
                            </span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="font-medium">Expiry:</span>
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                                {pcrAnalysisFilters.expiry}
                            </span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="font-medium">Interval:</span>
                            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-medium">
                                {pcrAnalysisFilters.interval}
                            </span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="font-medium">Range:</span>
                            <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-medium">
                                {pcrAnalysisFilters.range}
                            </span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="font-medium">
                                As of 15:30 Expiry 12-06-2025
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-6">
                    {/* Left Column - 25% width */}
                    <div className="w-1/4 flex flex-col gap-6">

                        <COIBarChart />
                        <OIBarChart />
                    </div>

                    {/* Right Column - 75% width */}
                    <div className="flex-1">
                        <div className="bg-white rounded-lg shadow-sm h-full">
                            <PCRLineChart />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
