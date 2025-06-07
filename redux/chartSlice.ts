// "use client"

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import chartData from '@/data/chartData.json';


interface FilterState {
  symbol: string;
  expiry: string;
  strikeCount: number;
  duration: string;
  isLive: boolean;
  historicalDate: string;
  timeRange: [number, number];
}

interface ChartState {
  filters: FilterState;
  chartData: typeof chartData;
}

const initialState: ChartState = {
  filters: {
    symbol: 'NIFTY',
    expiry: chartData.expiries[0],
    strikeCount: 30,
    duration: 'Day',
    isLive: true,
    historicalDate: new Date().toISOString().split('T')[0],
    timeRange: [0, 100],
  },
  chartData,
};

export const chartSlice = createSlice({
  name: 'chart',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<FilterState>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setChartData: (state, action: PayloadAction<typeof chartData>) => {
      state.chartData = action.payload;
    },
  },
});

export const { setFilters, setChartData } = chartSlice.actions;
export default chartSlice.reducer;