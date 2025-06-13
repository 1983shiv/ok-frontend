// Custom hooks for API data and WebSocket management
import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import webSocketService from '@/services/webSocketService';
import {
  fetchMarketStatus,
  fetchMarketOverview,
  fetchOptionsChain,
  fetchPremiumDecay,
  fetchOpenInterest,
  fetchCallPutOI,
  fetchPCR,
  fetchOIGainersLosers,
  fetchFuturesData,
  fetchChartData,
} from '@/services/apiThunks';
import {
  setWebSocketConnected,
  addWebSocketSubscription,
  removeWebSocketSubscription,
  updateMarketData,
  updateOptionsData,
  updateOIData,
  updateFuturesData,
  updateChartData,
  updateHeartbeat,
} from '@/redux/chartSlice';

// Hook for managing WebSocket connection
export const useWebSocket = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { connected, subscriptions } = useSelector((state: RootState) => state.chart.websocket);

  const connect = useCallback(() => {
    webSocketService.connect({
      onConnect: () => {
        console.log('WebSocket connected');
        dispatch(setWebSocketConnected(true));
      },
      onDisconnect: () => {
        console.log('WebSocket disconnected');
        dispatch(setWebSocketConnected(false));
      },
      onError: (error) => {
        console.error('WebSocket error:', error);
        dispatch(setWebSocketConnected(false));
      },
      onMarketUpdate: (data) => {
        dispatch(updateMarketData(data));
        dispatch(updateHeartbeat());
      },
      onOptionsUpdate: (data) => {
        dispatch(updateOptionsData(data));
        dispatch(updateHeartbeat());
      },
      onOIUpdate: (data) => {
        dispatch(updateOIData(data));
        dispatch(updateHeartbeat());
      },
      onFuturesUpdate: (data) => {
        dispatch(updateFuturesData(data));
        dispatch(updateHeartbeat());
      },
      onChartUpdate: (data) => {
        dispatch(updateChartData(data));
        dispatch(updateHeartbeat());
      },
    });
  }, [dispatch]);

  const disconnect = useCallback(() => {
    webSocketService.disconnect();
    dispatch(setWebSocketConnected(false));
  }, [dispatch]);

  const subscribeToMarket = useCallback((symbols: string[] = ['NIFTY', 'BANKNIFTY']) => {
    if (connected) {
      webSocketService.subscribeToMarket(symbols);
      dispatch(addWebSocketSubscription('market'));
    }
  }, [connected, dispatch]);

  const subscribeToOptions = useCallback((symbol: string, expiry: string) => {
    if (connected) {
      webSocketService.subscribeToOptions(symbol, expiry);
      dispatch(addWebSocketSubscription(`options_${symbol}_${expiry}`));
    }
  }, [connected, dispatch]);

  const subscribeToOI = useCallback((symbol: string, expiry: string) => {
    if (connected) {
      webSocketService.subscribeToOI(symbol, expiry);
      dispatch(addWebSocketSubscription(`oi_${symbol}_${expiry}`));
    }
  }, [connected, dispatch]);

  const subscribeToFutures = useCallback((symbols: string[] = ['NIFTY', 'BANKNIFTY']) => {
    if (connected) {
      webSocketService.subscribeToFutures(symbols);
      dispatch(addWebSocketSubscription('futures'));
    }
  }, [connected, dispatch]);

  const subscribeToCharts = useCallback((symbol: string, expiry: string, interval: string = '1m') => {
    if (connected) {
      webSocketService.subscribeToCharts(symbol, expiry, interval);
      dispatch(addWebSocketSubscription(`charts_${symbol}_${expiry}_${interval}`));
    }
  }, [connected, dispatch]);

  return {
    connected,
    subscriptions,
    connect,
    disconnect,
    subscribeToMarket,
    subscribeToOptions,
    subscribeToOI,
    subscribeToFutures,
    subscribeToCharts,
  };
};

// Hook for fetching market data
export const useMarketData = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { marketData, loading } = useSelector((state: RootState) => state.chart);

  const fetchMarketData = useCallback(() => {
    dispatch(fetchMarketStatus());
    dispatch(fetchMarketOverview());
  }, [dispatch]);

  useEffect(() => {
    fetchMarketData();
  }, [fetchMarketData]);

  return {
    marketData,
    loading: loading.market,
    refetch: fetchMarketData,
  };
};

// Hook for fetching options data
export const useOptionsData = (symbol?: string, expiry?: string) => {
  const dispatch = useDispatch<AppDispatch>();
  const { optionsData, loading, filters } = useSelector((state: RootState) => state.chart);

  const currentSymbol = symbol || filters.symbol;
  const currentExpiry = expiry || filters.expiry;

  const fetchOptionsData = useCallback(() => {
    if (currentSymbol && currentExpiry) {
      dispatch(fetchOptionsChain({ symbol: currentSymbol, expiry: currentExpiry }));
      dispatch(fetchPremiumDecay({ symbol: currentSymbol, expiry: currentExpiry }));
    }
  }, [dispatch, currentSymbol, currentExpiry]);

  useEffect(() => {
    fetchOptionsData();
  }, [fetchOptionsData]);

  return {
    optionsData,
    loading: loading.options,
    refetch: fetchOptionsData,
  };
};

// Hook for fetching OI data
export const useOIData = (symbol?: string, expiry?: string) => {
  const dispatch = useDispatch<AppDispatch>();
  const { oiData, loading, filters } = useSelector((state: RootState) => state.chart);

  const currentSymbol = symbol || filters.symbol;
  const currentExpiry = expiry || filters.expiry;

  const fetchOIData = useCallback(() => {
    if (currentSymbol && currentExpiry) {
      dispatch(fetchOpenInterest({ symbol: currentSymbol, expiry: currentExpiry }));
      dispatch(fetchCallPutOI({ symbol: currentSymbol, expiry: currentExpiry }));
      dispatch(fetchPCR({ symbol: currentSymbol, expiry: currentExpiry }));
      dispatch(fetchOIGainersLosers({ symbol: currentSymbol, expiry: currentExpiry }));
    }
  }, [dispatch, currentSymbol, currentExpiry]);

  useEffect(() => {
    fetchOIData();
  }, [fetchOIData]);

  return {
    oiData,
    loading: loading.oi,
    refetch: fetchOIData,
  };
};

// Hook for fetching futures data
export const useFuturesData = (symbol?: string) => {
  const dispatch = useDispatch<AppDispatch>();
  const { futuresData, loading, filters } = useSelector((state: RootState) => state.chart);

  const currentSymbol = symbol || filters.symbol;

  const fetchFuturesDataFunc = useCallback(() => {
    if (currentSymbol) {
      dispatch(fetchFuturesData(currentSymbol));
    }
  }, [dispatch, currentSymbol]);

  useEffect(() => {
    fetchFuturesDataFunc();
  }, [fetchFuturesDataFunc]);

  return {
    futuresData,
    loading: loading.futures,
    refetch: fetchFuturesDataFunc,
  };
};

// Hook for fetching chart data
export const useChartData = (symbol?: string, expiry?: string, interval?: string) => {
  const dispatch = useDispatch<AppDispatch>();
  const { chartData, loading, filters } = useSelector((state: RootState) => state.chart);

  const currentSymbol = symbol || filters.symbol;
  const currentExpiry = expiry || filters.expiry;

  const fetchChartDataFunc = useCallback(() => {
    if (currentSymbol && currentExpiry) {
      dispatch(fetchChartData({ 
        symbol: currentSymbol, 
        expiry: currentExpiry, 
        interval: interval || '1m' 
      }));
    }
  }, [dispatch, currentSymbol, currentExpiry, interval]);

  useEffect(() => {
    fetchChartDataFunc();
  }, [fetchChartDataFunc]);

  return {
    chartData,
    loading: loading.chart,
    refetch: fetchChartDataFunc,
  };
};

// Hook for comprehensive data management
export const useTradingData = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { filters, loading } = useSelector((state: RootState) => state.chart);
  const { connect, connected, subscribeToMarket, subscribeToOptions, subscribeToOI, subscribeToFutures } = useWebSocket();
  
  // Fetch initial data
  const fetchAllData = useCallback(() => {
    dispatch(fetchMarketStatus());
    dispatch(fetchMarketOverview());
    
    if (filters.symbol && filters.expiry) {
      dispatch(fetchOptionsChain({ symbol: filters.symbol, expiry: filters.expiry }));
      dispatch(fetchPremiumDecay({ symbol: filters.symbol, expiry: filters.expiry }));
      dispatch(fetchOpenInterest({ symbol: filters.symbol, expiry: filters.expiry }));
      dispatch(fetchCallPutOI({ symbol: filters.symbol, expiry: filters.expiry }));
      dispatch(fetchPCR({ symbol: filters.symbol, expiry: filters.expiry }));
      dispatch(fetchOIGainersLosers({ symbol: filters.symbol, expiry: filters.expiry }));
      dispatch(fetchChartData({ symbol: filters.symbol, expiry: filters.expiry }));
    }
    
    if (filters.symbol) {
      dispatch(fetchFuturesData(filters.symbol));
    }
  }, [dispatch, filters.symbol, filters.expiry]);

  // Connect to WebSocket and subscribe to data
  const connectAndSubscribe = useCallback(() => {
    if (!connected) {
      connect();
    }
    
    // Subscribe after connection is established
    setTimeout(() => {
      subscribeToMarket();
      if (filters.symbol && filters.expiry) {
        subscribeToOptions(filters.symbol, filters.expiry);
        subscribeToOI(filters.symbol, filters.expiry);
      }
      if (filters.symbol) {
        subscribeToFutures([filters.symbol]);
      }
    }, 1000);
  }, [connected, connect, subscribeToMarket, subscribeToOptions, subscribeToOI, subscribeToFutures, filters.symbol, filters.expiry]);

  // Auto-fetch data when filters change
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Auto-connect WebSocket when component mounts
  useEffect(() => {
    connectAndSubscribe();
  }, [connectAndSubscribe]);

  const isLoadingAny = Object.values(loading).some(l => l.isLoading);
  const hasErrors = Object.values(loading).some(l => l.error);

  return {
    isLoading: isLoadingAny,
    hasErrors,
    connected,
    fetchAllData,
    connectAndSubscribe,
  };
};
