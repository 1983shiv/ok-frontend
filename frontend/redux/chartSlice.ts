// "use client"

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  fetchMarketStatus,
  fetchMarketOverview,
  fetchOptionsChain,
  fetchOptionsOverview,
  fetchATMStrikes,
  fetchOptionsVolume,
  fetchImpliedVolatility,
  fetchPremiumDecay,
  fetchOpenInterest,
  fetchOIAnalysis,
  fetchCallPutOI,
  fetchOIGainersLosers,
  fetchStrikeOI,
  fetchMaxPain,
  fetchPCR,
  fetchFuturesData,
  fetchFuturesOI,
  fetchFuturesChart,
  fetchHistoricalOptions,
  fetchHistoricalOI,
  fetchHistoricalPrices,
  fetchChartData,
  fetchMultiStrikeChart,
} from '@/services/apiThunks';


interface FilterState {
  symbol: string;
  expiry: string;
  strikeCount: number;
  duration: string;
  isLive: boolean;
  historicalDate: string;
  timeRange: [number, number];
}

// Loading state interface
interface LoadingState {
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

// API Data interfaces
interface MarketData {
  status?: any;
  overview?: any;
  topGainers?: any[];
  topLosers?: any[];
}

interface OptionsData {
  chain?: any;
  overview?: any;
  atmStrikes?: any[];
  volume?: any;
  impliedVolatility?: any;
  premiumDecay?: any;
}

interface OIData {
  openInterest?: any;
  analysis?: any;
  callPutOI?: any;
  gainersLosers?: any[];
  strikeOI?: any;
  maxPain?: any;
  pcr?: any;
}

interface FuturesData {
  data?: any;
  oi?: any;
  chart?: any;
}

interface HistoricalData {
  options?: any;
  oi?: any;
  prices?: any;
}

interface ChartData {
  main?: any;
  multiStrike?: any;
}

interface ChartState {
  // Filter states
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
  priceVsOIFilters: PriceVsOIState;
  futurePriceVsOIFilters: FuturePriceVsOIState;
  ivAnalysisFilters: IVAnalysisState;
  futuresOIAnalysisFilters: FuturesOIAnalysisState;
  
  // API Data
  marketData: MarketData;
  optionsData: OptionsData;
  oiData: OIData;
  futuresData: FuturesData;
  historicalData: HistoricalData;
  chartData: ChartData;
  
  // Loading states
  loading: {
    market: LoadingState;
    options: LoadingState;
    oi: LoadingState;
    futures: LoadingState;
    historical: LoadingState;
    chart: LoadingState;
  };
  
  // WebSocket connection state
  websocket: {
    connected: boolean;
    lastHeartbeat: string | null;
    subscriptions: string[];
  };
  
  // Available symbols and expiries from API
  availableSymbols: string[];
  availableExpiries: Record<string, string[]>;
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

interface PriceVsOIState {
  symbol: string;
  expiry: string;
  strike: number;
  duration: string;
  isLive: boolean;
  historicalDate: string;
}

interface FuturePriceVsOIState {
  symbol: string;
  expiry: string;
  duration: string;
  isLive: boolean;
  historicalDate: string;
}

interface IVAnalysisState {
  symbol: string;
  expiry: string;
  strike: number;
  interval: string;
  isLive: boolean;
  historicalDate: string;
}

interface FuturesOIAnalysisState {
  symbol: string;
  build: string;
  interval: string;
  isLive: boolean;
  historicalDate: string;
}


const initialState: ChartState = {
  filters: {
    symbol: 'NIFTY',
    expiry: '2024-12-26', // Default expiry
    strikeCount: 30,
    duration: 'Day',
    isLive: true,
    historicalDate: new Date().toISOString().split('T')[0],
    timeRange: [0, 100],
  },
  premiumDecayFilters: {
    symbol: 'NIFTY',
    expiry: '2024-12-26',
    strikeCount: 10,
    rangeStart: 24550.00,
    rangeEnd: 25050.00,
    isLive: true,
    historicalDate: new Date().toISOString().split('T')[0],
  },
  coiAnalysisFilters: {
    symbol: 'NIFTY',
    expiry: '12-06-2025',
    interval: '5 Min',
    range: 'Auto',
    isLive: true,
    historicalDate: new Date().toISOString().split('T')[0],
  },
  trendingStrikesFilters: {
    symbol: 'NIFTY',
    expiry: '12-06-2025',
    interval: '3 Min',
    isLive: true,
    historicalDate: new Date().toISOString().split('T')[0],
  },
  pcrAnalysisFilters: {
    symbol: 'NIFTY',
    expiry: '12-06-2025',
    interval: '5 Min',
    range: 'Auto',
    isLive: true,
    historicalDate: new Date().toISOString().split('T')[0],
  },
  atmPremiumAnalysisFilters: {
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
  multiStrikeStraddleFilters: {
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
  },
  oiGainerLooserFilters: {
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
  priceVsOIFilters: {
    symbol: 'NIFTY',
    expiry: '12/04/2025',
    strike: 25500,
    duration: '1D',
    isLive: true,
    historicalDate: new Date().toISOString().split('T')[0],
  },
  futurePriceVsOIFilters: {
    symbol: 'NIFTY',
    expiry: '26/12/2024',
    duration: '1D',
    isLive: true,
    historicalDate: new Date().toISOString().split('T')[0],
  },
  ivAnalysisFilters: {
    symbol: 'NIFTY',
    expiry: '06-Dec-2024',
    strike: 25000,
    interval: '5 Min',
    isLive: true,
    historicalDate: new Date().toISOString().split('T')[0],
  },
  futuresOIAnalysisFilters: {
    symbol: 'All Symbols',
    build: 'Full Data',
    interval: 'Day',
    isLive: true,
    historicalDate: new Date().toISOString().split('T')[0],
  },
  
  // API Data (initially empty)
  marketData: {},
  optionsData: {},
  oiData: {},
  futuresData: {},
  historicalData: {},
  chartData: {},
  
  // Loading states
  loading: {
    market: { isLoading: false, error: null, lastUpdated: null },
    options: { isLoading: false, error: null, lastUpdated: null },
    oi: { isLoading: false, error: null, lastUpdated: null },
    futures: { isLoading: false, error: null, lastUpdated: null },
    historical: { isLoading: false, error: null, lastUpdated: null },
    chart: { isLoading: false, error: null, lastUpdated: null },
  },
  
  // WebSocket state
  websocket: {
    connected: false,
    lastHeartbeat: null,
    subscriptions: [],
  },
  
  // Available data from API
  availableSymbols: ['NIFTY', 'BANKNIFTY'],
  availableExpiries: {
    'NIFTY': ['2024-12-26', '2025-01-30', '2025-02-27'],
    'BANKNIFTY': ['2024-12-26', '2025-01-30', '2025-02-27'],
  },
};

export const chartSlice = createSlice({
  name: 'chart',
  initialState,
  reducers: {
    // Filter reducers
    setFilters: (state, action: PayloadAction<Partial<FilterState>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setPremiumDecayFilters: (state, action: PayloadAction<Partial<PremiumDecayState>>) => {
      state.premiumDecayFilters = { ...state.premiumDecayFilters, ...action.payload };
    },
    setCOIAnalysisFilters: (state, action: PayloadAction<Partial<COIAnalysisState>>) => {
      state.coiAnalysisFilters = { ...state.coiAnalysisFilters, ...action.payload };
    },
    setTrendingStrikesFilters: (state, action: PayloadAction<Partial<TrendingStrikesState>>) => {
      state.trendingStrikesFilters = { ...state.trendingStrikesFilters, ...action.payload };
    },
    setPCRAnalysisFilters: (state, action: PayloadAction<Partial<PCRAnalysisState>>) => {
      state.pcrAnalysisFilters = { ...state.pcrAnalysisFilters, ...action.payload };
    },
    setATMPremiumAnalysisFilters: (state, action: PayloadAction<Partial<ATMPremiumAnalysisState>>) => {
      state.atmPremiumAnalysisFilters = { ...state.atmPremiumAnalysisFilters, ...action.payload };
    },
    setStraddleAnalysisFilters: (state, action: PayloadAction<Partial<StraddleAnalysisState>>) => {
      state.straddleAnalysisFilters = { ...state.straddleAnalysisFilters, ...action.payload };
    },
    setMultiStrikeStraddleFilters: (state, action: PayloadAction<Partial<MultiStrikeStraddleState>>) => {
      state.multiStrikeStraddleFilters = { ...state.multiStrikeStraddleFilters, ...action.payload };
    },
    setMultiStrikeOIFilters: (state, action: PayloadAction<Partial<MultiStrikeOIState>>) => {
      state.multiStrikeOIFilters = { ...state.multiStrikeOIFilters, ...action.payload };
    },
    setOIGainerLooserFilters: (state, action: PayloadAction<Partial<OIGainerLooserState>>) => {
      state.oiGainerLooserFilters = { ...state.oiGainerLooserFilters, ...action.payload };
    },
    setLongShortFilters: (state, action: PayloadAction<Partial<LongShortState>>) => {
      state.longShortFilters = { ...state.longShortFilters, ...action.payload };
    },
    setPriceVsOIFilters: (state, action: PayloadAction<Partial<PriceVsOIState>>) => {
      state.priceVsOIFilters = { ...state.priceVsOIFilters, ...action.payload };
    },
    setFuturePriceVsOIFilters: (state, action: PayloadAction<Partial<FuturePriceVsOIState>>) => {
      state.futurePriceVsOIFilters = { ...state.futurePriceVsOIFilters, ...action.payload };
    },
    setIVAnalysisFilters: (state, action: PayloadAction<Partial<IVAnalysisState>>) => {
      state.ivAnalysisFilters = { ...state.ivAnalysisFilters, ...action.payload };
    },
    setFuturesOIAnalysisFilters: (state, action: PayloadAction<Partial<FuturesOIAnalysisState>>) => {
      state.futuresOIAnalysisFilters = { ...state.futuresOIAnalysisFilters, ...action.payload };
    },
    
    // WebSocket reducers
    setWebSocketConnected: (state, action: PayloadAction<boolean>) => {
      state.websocket.connected = action.payload;
      state.websocket.lastHeartbeat = action.payload ? new Date().toISOString() : null;
    },
    addWebSocketSubscription: (state, action: PayloadAction<string>) => {
      if (!state.websocket.subscriptions.includes(action.payload)) {
        state.websocket.subscriptions.push(action.payload);
      }
    },
    removeWebSocketSubscription: (state, action: PayloadAction<string>) => {
      state.websocket.subscriptions = state.websocket.subscriptions.filter(
        sub => sub !== action.payload
      );
    },
    clearWebSocketSubscriptions: (state) => {
      state.websocket.subscriptions = [];
    },
    updateHeartbeat: (state) => {
      state.websocket.lastHeartbeat = new Date().toISOString();
    },
    
    // Data update reducers for WebSocket updates
    updateMarketData: (state, action: PayloadAction<Partial<MarketData>>) => {
      state.marketData = { ...state.marketData, ...action.payload };
    },
    updateOptionsData: (state, action: PayloadAction<Partial<OptionsData>>) => {
      state.optionsData = { ...state.optionsData, ...action.payload };
    },
    updateOIData: (state, action: PayloadAction<Partial<OIData>>) => {
      state.oiData = { ...state.oiData, ...action.payload };
    },
    updateFuturesData: (state, action: PayloadAction<Partial<FuturesData>>) => {
      state.futuresData = { ...state.futuresData, ...action.payload };
    },
    updateChartData: (state, action: PayloadAction<Partial<ChartData>>) => {
      state.chartData = { ...state.chartData, ...action.payload };
    },
    
    // Available data setters
    setAvailableSymbols: (state, action: PayloadAction<string[]>) => {
      state.availableSymbols = action.payload;
    },
    setAvailableExpiries: (state, action: PayloadAction<Record<string, string[]>>) => {
      state.availableExpiries = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Market Status
    builder
      .addCase(fetchMarketStatus.pending, (state) => {
        state.loading.market.isLoading = true;
        state.loading.market.error = null;
      })
      .addCase(fetchMarketStatus.fulfilled, (state, action) => {
        state.loading.market.isLoading = false;
        state.loading.market.lastUpdated = new Date().toISOString();
        state.marketData.status = action.payload;
      })
      .addCase(fetchMarketStatus.rejected, (state, action) => {
        state.loading.market.isLoading = false;
        state.loading.market.error = action.payload as string;
      });

    // Market Overview
    builder
      .addCase(fetchMarketOverview.pending, (state) => {
        state.loading.market.isLoading = true;
        state.loading.market.error = null;
      })
      .addCase(fetchMarketOverview.fulfilled, (state, action) => {
        state.loading.market.isLoading = false;
        state.loading.market.lastUpdated = new Date().toISOString();
        state.marketData.overview = action.payload;
      })
      .addCase(fetchMarketOverview.rejected, (state, action) => {
        state.loading.market.isLoading = false;
        state.loading.market.error = action.payload as string;
      });

    // Options Chain
    builder
      .addCase(fetchOptionsChain.pending, (state) => {
        state.loading.options.isLoading = true;
        state.loading.options.error = null;
      })
      .addCase(fetchOptionsChain.fulfilled, (state, action) => {
        state.loading.options.isLoading = false;
        state.loading.options.lastUpdated = new Date().toISOString();
        state.optionsData.chain = action.payload;
      })
      .addCase(fetchOptionsChain.rejected, (state, action) => {
        state.loading.options.isLoading = false;
        state.loading.options.error = action.payload as string;
      });

    // Premium Decay
    builder
      .addCase(fetchPremiumDecay.pending, (state) => {
        state.loading.options.isLoading = true;
        state.loading.options.error = null;
      })
      .addCase(fetchPremiumDecay.fulfilled, (state, action) => {
        state.loading.options.isLoading = false;
        state.loading.options.lastUpdated = new Date().toISOString();
        state.optionsData.premiumDecay = action.payload;
      })
      .addCase(fetchPremiumDecay.rejected, (state, action) => {
        state.loading.options.isLoading = false;
        state.loading.options.error = action.payload as string;
      });

    // Open Interest
    builder
      .addCase(fetchOpenInterest.pending, (state) => {
        state.loading.oi.isLoading = true;
        state.loading.oi.error = null;
      })
      .addCase(fetchOpenInterest.fulfilled, (state, action) => {
        state.loading.oi.isLoading = false;
        state.loading.oi.lastUpdated = new Date().toISOString();
        state.oiData.openInterest = action.payload;
      })
      .addCase(fetchOpenInterest.rejected, (state, action) => {
        state.loading.oi.isLoading = false;
        state.loading.oi.error = action.payload as string;
      });

    // Call Put OI
    builder
      .addCase(fetchCallPutOI.pending, (state) => {
        state.loading.oi.isLoading = true;
        state.loading.oi.error = null;
      })
      .addCase(fetchCallPutOI.fulfilled, (state, action) => {
        state.loading.oi.isLoading = false;
        state.loading.oi.lastUpdated = new Date().toISOString();
        state.oiData.callPutOI = action.payload;
      })
      .addCase(fetchCallPutOI.rejected, (state, action) => {
        state.loading.oi.isLoading = false;
        state.loading.oi.error = action.payload as string;
      });

    // PCR
    builder
      .addCase(fetchPCR.pending, (state) => {
        state.loading.oi.isLoading = true;
        state.loading.oi.error = null;
      })
      .addCase(fetchPCR.fulfilled, (state, action) => {
        state.loading.oi.isLoading = false;
        state.loading.oi.lastUpdated = new Date().toISOString();
        state.oiData.pcr = action.payload;
      })
      .addCase(fetchPCR.rejected, (state, action) => {
        state.loading.oi.isLoading = false;
        state.loading.oi.error = action.payload as string;
      });

    // OI Gainers/Losers
    builder
      .addCase(fetchOIGainersLosers.pending, (state) => {
        state.loading.oi.isLoading = true;
        state.loading.oi.error = null;
      })
      .addCase(fetchOIGainersLosers.fulfilled, (state, action) => {
        state.loading.oi.isLoading = false;
        state.loading.oi.lastUpdated = new Date().toISOString();
        state.oiData.gainersLosers = action.payload;
      })
      .addCase(fetchOIGainersLosers.rejected, (state, action) => {
        state.loading.oi.isLoading = false;
        state.loading.oi.error = action.payload as string;
      });

    // Futures Data
    builder
      .addCase(fetchFuturesData.pending, (state) => {
        state.loading.futures.isLoading = true;
        state.loading.futures.error = null;
      })
      .addCase(fetchFuturesData.fulfilled, (state, action) => {
        state.loading.futures.isLoading = false;
        state.loading.futures.lastUpdated = new Date().toISOString();
        state.futuresData.data = action.payload;
      })
      .addCase(fetchFuturesData.rejected, (state, action) => {
        state.loading.futures.isLoading = false;
        state.loading.futures.error = action.payload as string;
      });

    // Chart Data
    builder
      .addCase(fetchChartData.pending, (state) => {
        state.loading.chart.isLoading = true;
        state.loading.chart.error = null;
      })
      .addCase(fetchChartData.fulfilled, (state, action) => {
        state.loading.chart.isLoading = false;
        state.loading.chart.lastUpdated = new Date().toISOString();
        state.chartData.main = action.payload;
      })
      .addCase(fetchChartData.rejected, (state, action) => {
        state.loading.chart.isLoading = false;
        state.loading.chart.error = action.payload as string;
      });

    // Multi-Strike Chart
    builder
      .addCase(fetchMultiStrikeChart.pending, (state) => {
        state.loading.chart.isLoading = true;
        state.loading.chart.error = null;
      })
      .addCase(fetchMultiStrikeChart.fulfilled, (state, action) => {
        state.loading.chart.isLoading = false;
        state.loading.chart.lastUpdated = new Date().toISOString();
        state.chartData.multiStrike = action.payload;
      })
      .addCase(fetchMultiStrikeChart.rejected, (state, action) => {
        state.loading.chart.isLoading = false;
        state.loading.chart.error = action.payload as string;
      });
  },
});

export const {
  setFilters,
  setPremiumDecayFilters,
  setCOIAnalysisFilters,
  setTrendingStrikesFilters,
  setPCRAnalysisFilters,
  setATMPremiumAnalysisFilters,
  setStraddleAnalysisFilters,
  setMultiStrikeStraddleFilters,
  setMultiStrikeOIFilters,
  setOIGainerLooserFilters,
  setLongShortFilters,
  setPriceVsOIFilters,
  setFuturePriceVsOIFilters,
  setIVAnalysisFilters,
  setFuturesOIAnalysisFilters,
  setWebSocketConnected,
  addWebSocketSubscription,
  removeWebSocketSubscription,
  clearWebSocketSubscriptions,
  updateHeartbeat,
  updateMarketData,
  updateOptionsData,
  updateOIData,
  updateFuturesData,
  updateChartData,
  setAvailableSymbols,
  setAvailableExpiries,
} = chartSlice.actions;

export default chartSlice.reducer;