// "use client"

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import chartData from '@/data/chartData.json';
import premiumDecayData from "@/data/premiumDecayData.json";
import coiAnalysisData from "@/data/coiAnalysisData.json";
import trendingStrikesData from "@/data/trendingStrikesData.json";
import pcrAnalysisData from "@/data/pcrAnalysisData.json";
import atmPremiumAnalysisData from "@/data/atmPremiumAnalysisData.json";
import straddleAnalysisData from "@/data/straddleAnalysisData.json";


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
  premiumDecayFilters: PremiumDecayState;
  coiAnalysisFilters: COIAnalysisState;
  trendingStrikesFilters: TrendingStrikesState;
  pcrAnalysisFilters: PCRAnalysisState;
  atmPremiumAnalysisFilters: ATMPremiumAnalysisState;
  straddleAnalysisFilters: StraddleAnalysisState;
  chartData: typeof chartData;
  premiumDecayData: typeof premiumDecayData;
  coiAnalysisData: typeof coiAnalysisData;
  trendingStrikesData: typeof trendingStrikesData;
  pcrAnalysisData: typeof pcrAnalysisData;
  atmPremiumAnalysisData: typeof atmPremiumAnalysisData;
  straddleAnalysisData: typeof straddleAnalysisData;
}

interface PremiumDecayState {
  symbol: string;
  expiry: string;
  strikeCount: number;
  rangeStart: number;
  rangeEnd: number;
  isLive: boolean;
  historicalDate: string;
}

interface COIAnalysisState {
  symbol: string;
  expiry: string;
  interval: string;
  range: string;
  isLive: boolean;
  historicalDate: string;
}

interface TrendingStrikesState {
  symbol: string;
  expiry: string;
  interval: string;
  isLive: boolean;
  historicalDate: string;
}

interface PCRAnalysisState {
  symbol: string;
  expiry: string;
  interval: string;
  range: string;
  isLive: boolean;
  historicalDate: string;
}

interface ATMPremiumAnalysisState {
  symbol: string;
  expiry: string;
  isLive: boolean;
  historicalDate: string;
}

interface StraddleAnalysisState {
  symbol: string;
  expiry: string;
  strike: number;
  isLive: boolean;
  historicalDate: string;
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
  premiumDecayFilters: {
    symbol: 'NIFTY',
    expiry: premiumDecayData.expiries[0],
    strikeCount: 10,
    rangeStart: 24550.00,
    rangeEnd: 25050.00,
    isLive: true,
    historicalDate: new Date().toISOString().split('T')[0],
  },  coiAnalysisFilters: {
    symbol: 'NIFTY',
    expiry: '12-06-2025',
    interval: '5 Min',
    range: 'Auto',
    isLive: true,
    historicalDate: new Date().toISOString().split('T')[0],
  },  trendingStrikesFilters: {
    symbol: 'NIFTY',
    expiry: '12-06-2025',
    interval: '3 Min',
    isLive: true,
    historicalDate: new Date().toISOString().split('T')[0],
  },  pcrAnalysisFilters: {
    symbol: 'NIFTY',
    expiry: '12-06-2025',
    interval: '5 Min',
    range: 'Auto',
    isLive: true,
    historicalDate: new Date().toISOString().split('T')[0],
  },  atmPremiumAnalysisFilters: {
    symbol: 'NIFTY',
    expiry: '12-06-2025',
    isLive: true,
    historicalDate: new Date().toISOString().split('T')[0],
  },
  straddleAnalysisFilters: {
    symbol: 'NIFTY',
    expiry: '12-06-2025',
    strike: 25000,
    isLive: true,
    historicalDate: new Date().toISOString().split('T')[0],
  },
  chartData,
  premiumDecayData,
  coiAnalysisData,
  trendingStrikesData,
  pcrAnalysisData,
  atmPremiumAnalysisData,
  straddleAnalysisData,
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
    },    setPremiumDecayFilters: (state, action: PayloadAction<Partial<PremiumDecayState>>) => {
      state.premiumDecayFilters = { ...state.premiumDecayFilters, ...action.payload };
    },    setCOIAnalysisFilters: (state, action: PayloadAction<Partial<COIAnalysisState>>) => {
      state.coiAnalysisFilters = { ...state.coiAnalysisFilters, ...action.payload };
    },    setTrendingStrikesFilters: (state, action: PayloadAction<Partial<TrendingStrikesState>>) => {
      state.trendingStrikesFilters = { ...state.trendingStrikesFilters, ...action.payload };
    },    setPCRAnalysisFilters: (state, action: PayloadAction<Partial<PCRAnalysisState>>) => {
      state.pcrAnalysisFilters = { ...state.pcrAnalysisFilters, ...action.payload };
    },    setATMPremiumAnalysisFilters: (state, action: PayloadAction<Partial<ATMPremiumAnalysisState>>) => {
      state.atmPremiumAnalysisFilters = { ...state.atmPremiumAnalysisFilters, ...action.payload };
    },
    setStraddleAnalysisFilters: (state, action: PayloadAction<Partial<StraddleAnalysisState>>) => {
      state.straddleAnalysisFilters = { ...state.straddleAnalysisFilters, ...action.payload };
    },
  },
});

export const { setFilters, setChartData, setPremiumDecayFilters, setCOIAnalysisFilters, setTrendingStrikesFilters, setPCRAnalysisFilters, setATMPremiumAnalysisFilters, setStraddleAnalysisFilters } = chartSlice.actions;
export default chartSlice.reducer;