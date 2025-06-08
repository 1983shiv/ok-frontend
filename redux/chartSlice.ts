// "use client"

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import chartData from '@/data/chartData.json';
import premiumDecayData from "@/data/premiumDecayData.json";
import coiAnalysisData from "@/data/coiAnalysisData.json";
import trendingStrikesData from "@/data/trendingStrikesData.json";
import pcrAnalysisData from "@/data/pcrAnalysisData.json";
import atmPremiumAnalysisData from "@/data/atmPremiumAnalysisData.json";
import straddleAnalysisData from "@/data/straddleAnalysisData.json";
import multiStrikeStraddleData from "@/data/multiStrikeStraddleData.json";
import multiStrikeOIData from "@/data/multiStrikeOIData.json";
import oiGainerLooserData from "@/data/oiGainerLooserData.json";
import longShortOptionsData from "@/data/longShortOptionsData.json";


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
  multiStrikeStraddleFilters: MultiStrikeStraddleState;
  multiStrikeOIFilters: MultiStrikeOIState;
  oiGainerLooserFilters: OIGainerLooserState;
  longShortFilters: LongShortState;
  chartData: typeof chartData;
  premiumDecayData: typeof premiumDecayData;
  coiAnalysisData: typeof coiAnalysisData;
  trendingStrikesData: typeof trendingStrikesData;
  pcrAnalysisData: typeof pcrAnalysisData;
  atmPremiumAnalysisData: typeof atmPremiumAnalysisData;
  straddleAnalysisData: typeof straddleAnalysisData;
  multiStrikeStraddleData: typeof multiStrikeStraddleData;
  multiStrikeOIData: typeof multiStrikeOIData;
  oiGainerLooserData: typeof oiGainerLooserData;
  longShortOptionsData: typeof longShortOptionsData;
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

interface MultiStrikeStraddleState {
  symbol: string;
  expiry: string;
  strike1: { value: number; enabled: boolean };
  strike2: { value: number; enabled: boolean };
  strike3: { value: number; enabled: boolean };
  individualPrices: boolean;
  isLive: boolean;
  historicalDate: string;
}

interface MultiStrikeOIState {
  symbol: string;
  expiry: string;
  strike1: { value: number; enabled: boolean };
  strike2: { value: number; enabled: boolean };
  strike3: { value: number; enabled: boolean };
  strike4: { value: number; enabled: boolean };
  strike5: { value: number; enabled: boolean };
  overallOI: boolean;
  isLive: boolean;
  historicalDate: string;
}

interface OIGainerLooserState {
  symbol: string;
  expiry: string;
  interval: string;
  isLive: boolean;
  historicalDate: string;
}

interface LongShortState {
  symbol: string;
  expiry: string;
  strike: string;
  interval: string;
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
  },  straddleAnalysisFilters: {
    symbol: 'NIFTY',
    expiry: '12-06-2025',
    strike: 25000,
    isLive: true,
    historicalDate: new Date().toISOString().split('T')[0],
  },  multiStrikeStraddleFilters: {
    symbol: 'NIFTY',
    expiry: '12-06-2025',
    strike1: { value: 24900, enabled: true },
    strike2: { value: 25000, enabled: true },
    strike3: { value: 25100, enabled: true },
    individualPrices: false,
    isLive: true,
    historicalDate: new Date().toISOString().split('T')[0],
  },
  multiStrikeOIFilters: {
    symbol: 'NIFTY',
    expiry: '12-06-2025',
    strike1: { value: 24800, enabled: true },
    strike2: { value: 24900, enabled: true },
    strike3: { value: 25000, enabled: true },
    strike4: { value: 25100, enabled: true },
    strike5: { value: 25200, enabled: true },
    overallOI: false,
    isLive: true,
    historicalDate: new Date().toISOString().split('T')[0],
  },  oiGainerLooserFilters: {
    symbol: 'NIFTY',
    expiry: '12-06-2025',
    interval: '15 Min',
    isLive: true,
    historicalDate: new Date().toISOString().split('T')[0],
  },
  longShortFilters: {
    symbol: 'NIFTY',
    expiry: '12-06-2025',
    strike: '25000.00CE',
    interval: '15 Min',
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
  multiStrikeStraddleData,
  multiStrikeOIData,
  oiGainerLooserData,
  longShortOptionsData,
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
    },    setStraddleAnalysisFilters: (state, action: PayloadAction<Partial<StraddleAnalysisState>>) => {
      state.straddleAnalysisFilters = { ...state.straddleAnalysisFilters, ...action.payload };
    },    setMultiStrikeStraddleFilters: (state, action: PayloadAction<Partial<MultiStrikeStraddleState>>) => {
      state.multiStrikeStraddleFilters = { ...state.multiStrikeStraddleFilters, ...action.payload };
    },
    setMultiStrikeOIFilters: (state, action: PayloadAction<Partial<MultiStrikeOIState>>) => {
      state.multiStrikeOIFilters = { ...state.multiStrikeOIFilters, ...action.payload };
    },    setOIGainerLooserFilters: (state, action: PayloadAction<Partial<OIGainerLooserState>>) => {
      state.oiGainerLooserFilters = { ...state.oiGainerLooserFilters, ...action.payload };
    },
    setLongShortFilters: (state, action: PayloadAction<Partial<LongShortState>>) => {
      state.longShortFilters = { ...state.longShortFilters, ...action.payload };
    },
  },
});

export const { setFilters, setChartData, setPremiumDecayFilters, setCOIAnalysisFilters, setTrendingStrikesFilters, setPCRAnalysisFilters, setATMPremiumAnalysisFilters, setStraddleAnalysisFilters, setMultiStrikeStraddleFilters, setMultiStrikeOIFilters, setOIGainerLooserFilters, setLongShortFilters } = chartSlice.actions;
export default chartSlice.reducer;