// Redux Async Thunks for API calls
import { createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from './apiClient';

// Market data thunks
export const fetchMarketStatus = createAsyncThunk(
  'chart/fetchMarketStatus',
  async (_, { rejectWithValue }) => {
    try {
      return await apiClient.getMarketStatus();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch market status');
    }
  }
);

export const fetchMarketOverview = createAsyncThunk(
  'chart/fetchMarketOverview',
  async (_, { rejectWithValue }) => {
    try {
      return await apiClient.getMarketOverview();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch market overview');
    }
  }
);

// Options data thunks
export const fetchOptionsChain = createAsyncThunk(
  'chart/fetchOptionsChain',
  async ({ symbol, expiry }: { symbol: string; expiry: string }, { rejectWithValue }) => {
    try {
      return await apiClient.getOptionsChain(symbol, expiry);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch options chain');
    }
  }
);

export const fetchOptionsOverview = createAsyncThunk(
  'chart/fetchOptionsOverview',
  async (symbol: string, { rejectWithValue }) => {
    try {
      return await apiClient.getOptionsOverview(symbol);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch options overview');
    }
  }
);

export const fetchATMStrikes = createAsyncThunk(
  'chart/fetchATMStrikes',
  async ({ symbol, expiry }: { symbol: string; expiry: string }, { rejectWithValue }) => {
    try {
      return await apiClient.getATMStrikes(symbol, expiry);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch ATM strikes');
    }
  }
);

export const fetchOptionsVolume = createAsyncThunk(
  'chart/fetchOptionsVolume',
  async ({ symbol, expiry }: { symbol: string; expiry: string }, { rejectWithValue }) => {
    try {
      return await apiClient.getOptionsVolume(symbol, expiry);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch options volume');
    }
  }
);

export const fetchImpliedVolatility = createAsyncThunk(
  'chart/fetchImpliedVolatility',
  async ({ symbol, expiry }: { symbol: string; expiry: string }, { rejectWithValue }) => {
    try {
      return await apiClient.getImpliedVolatility(symbol, expiry);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch implied volatility');
    }
  }
);

export const fetchPremiumDecay = createAsyncThunk(
  'chart/fetchPremiumDecay',
  async ({ symbol, expiry }: { symbol: string; expiry: string }, { rejectWithValue }) => {
    try {
      return await apiClient.getPremiumDecay(symbol, expiry);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch premium decay');
    }
  }
);

// Open Interest thunks
export const fetchOpenInterest = createAsyncThunk(
  'chart/fetchOpenInterest',
  async ({ symbol, expiry }: { symbol: string; expiry: string }, { rejectWithValue }) => {
    try {
      return await apiClient.getOpenInterest(symbol, expiry);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch open interest');
    }
  }
);

export const fetchOIAnalysis = createAsyncThunk(
  'chart/fetchOIAnalysis',
  async ({ symbol, expiry }: { symbol: string; expiry: string }, { rejectWithValue }) => {
    try {
      return await apiClient.getOIAnalysis(symbol, expiry);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch OI analysis');
    }
  }
);

export const fetchCallPutOI = createAsyncThunk(
  'chart/fetchCallPutOI',
  async ({ symbol, expiry }: { symbol: string; expiry: string }, { rejectWithValue }) => {
    try {
      return await apiClient.getCallPutOI(symbol, expiry);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch call/put OI');
    }
  }
);

export const fetchOIGainersLosers = createAsyncThunk(
  'chart/fetchOIGainersLosers',
  async ({ symbol, expiry }: { symbol: string; expiry: string }, { rejectWithValue }) => {
    try {
      return await apiClient.getOIGainersLosers(symbol, expiry);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch OI gainers/losers');
    }
  }
);

export const fetchStrikeOI = createAsyncThunk(
  'chart/fetchStrikeOI',
  async ({ symbol, expiry, strike }: { symbol: string; expiry: string; strike: number }, { rejectWithValue }) => {
    try {
      return await apiClient.getStrikeOI(symbol, expiry, strike);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch strike OI');
    }
  }
);

export const fetchMaxPain = createAsyncThunk(
  'chart/fetchMaxPain',
  async ({ symbol, expiry }: { symbol: string; expiry: string }, { rejectWithValue }) => {
    try {
      return await apiClient.getMaxPain(symbol, expiry);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch max pain');
    }
  }
);

export const fetchPCR = createAsyncThunk(
  'chart/fetchPCR',
  async ({ symbol, expiry }: { symbol: string; expiry: string }, { rejectWithValue }) => {
    try {
      return await apiClient.getPCR(symbol, expiry);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch PCR');
    }
  }
);

// Futures thunks
export const fetchFuturesData = createAsyncThunk(
  'chart/fetchFuturesData',
  async (symbol: string, { rejectWithValue }) => {
    try {
      return await apiClient.getFuturesData(symbol);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch futures data');
    }
  }
);

export const fetchFuturesOI = createAsyncThunk(
  'chart/fetchFuturesOI',
  async (symbol: string, { rejectWithValue }) => {
    try {
      return await apiClient.getFuturesOI(symbol);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch futures OI');
    }
  }
);

export const fetchFuturesChart = createAsyncThunk(
  'chart/fetchFuturesChart',
  async ({ symbol, interval }: { symbol: string; interval: string }, { rejectWithValue }) => {
    try {
      return await apiClient.getFuturesChart(symbol, interval);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch futures chart');
    }
  }
);

// Historical data thunks
export const fetchHistoricalOptions = createAsyncThunk(
  'chart/fetchHistoricalOptions',
  async ({ symbol, expiry, date }: { symbol: string; expiry: string; date: string }, { rejectWithValue }) => {
    try {
      return await apiClient.getHistoricalOptions(symbol, expiry, date);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch historical options');
    }
  }
);

export const fetchHistoricalOI = createAsyncThunk(
  'chart/fetchHistoricalOI',
  async ({ symbol, expiry, date }: { symbol: string; expiry: string; date: string }, { rejectWithValue }) => {
    try {
      return await apiClient.getHistoricalOI(symbol, expiry, date);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch historical OI');
    }
  }
);

export const fetchHistoricalPrices = createAsyncThunk(
  'chart/fetchHistoricalPrices',
  async ({ symbol, from, to }: { symbol: string; from: string; to: string }, { rejectWithValue }) => {
    try {
      return await apiClient.getHistoricalPrices(symbol, from, to);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch historical prices');
    }
  }
);

// Chart data thunks
export const fetchChartData = createAsyncThunk(
  'chart/fetchChartData',
  async ({ symbol, expiry, interval }: { symbol: string; expiry: string; interval?: string }, { rejectWithValue }) => {
    try {
      return await apiClient.getChartData(symbol, expiry, interval);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch chart data');
    }
  }
);

export const fetchMultiStrikeChart = createAsyncThunk(
  'chart/fetchMultiStrikeChart',
  async ({ symbol, expiry, strikes }: { symbol: string; expiry: string; strikes: number[] }, { rejectWithValue }) => {
    try {
      return await apiClient.getMultiStrikeChart(symbol, expiry, strikes);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch multi-strike chart');
    }
  }
);
