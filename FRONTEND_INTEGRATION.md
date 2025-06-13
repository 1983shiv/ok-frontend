# Frontend Integration Guide

This guide explains how to integrate the backend API with your existing React/Next.js frontend.

## 🔗 API Integration

### 1. API Client Setup

Create an API client utility:

```typescript
// utils/apiClient.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  }

  // Market Data
  getMarketStatus() {
    return this.request('/market/status');
  }

  getSymbols() {
    return this.request('/market/symbols');
  }

  // Options Data
  getOptionsChain(symbol: string, expiry?: string) {
    const params = new URLSearchParams({ symbol });
    if (expiry) params.append('expiry', expiry);
    return this.request(`/options/chain?${params}`);
  }

  // Open Interest
  getCOIAnalysis(symbol: string, expiry?: string) {
    const params = new URLSearchParams({ symbol });
    if (expiry) params.append('expiry', expiry);
    return this.request(`/open-interest/coi?${params}`);
  }

  getPCRAnalysis(symbol: string, expiry?: string) {
    const params = new URLSearchParams({ symbol });
    if (expiry) params.append('expiry', expiry);
    return this.request(`/open-interest/pcr?${params}`);
  }

  // Positions
  getPositions(filters?: { symbol?: string; expiry?: string }) {
    const params = new URLSearchParams();
    if (filters?.symbol) params.append('symbol', filters.symbol);
    if (filters?.expiry) params.append('expiry', filters.expiry);
    return this.request(`/positions?${params}`);
  }

  // Historical Data
  getHistoricalOI(symbol: string, days: number = 30) {
    return this.request(`/historical/oi?symbol=${symbol}&days=${days}`);
  }
}

export const apiClient = new ApiClient();
```

### 2. WebSocket Integration

```typescript
// utils/websocket.ts
import { io, Socket } from 'socket.io-client';

class WebSocketClient {
  private socket: Socket | null = null;
  private url: string;

  constructor(url: string = 'http://localhost:5000') {
    this.url = url;
  }

  connect() {
    this.socket = io(this.url);
    
    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });

    return this.socket;
  }

  subscribe(channel: string, callback: (data: any) => void) {
    if (!this.socket) {
      throw new Error('WebSocket not connected');
    }
    
    this.socket.emit('subscribe', { channel });
    this.socket.on(channel, callback);
  }

  unsubscribe(channel: string) {
    if (!this.socket) return;
    
    this.socket.emit('unsubscribe', { channel });
    this.socket.off(channel);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const wsClient = new WebSocketClient();
```

### 3. Redux Integration

Update your Redux store to use the backend API:

```typescript
// redux/apiSlice.ts
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiClient } from '../utils/apiClient';

// Async thunks
export const fetchOptionsChain = createAsyncThunk(
  'api/fetchOptionsChain',
  async ({ symbol, expiry }: { symbol: string; expiry?: string }) => {
    const response = await apiClient.getOptionsChain(symbol, expiry);
    return response.data;
  }
);

export const fetchCOIAnalysis = createAsyncThunk(
  'api/fetchCOIAnalysis',
  async ({ symbol, expiry }: { symbol: string; expiry?: string }) => {
    const response = await apiClient.getCOIAnalysis(symbol, expiry);
    return response.data;
  }
);

export const fetchPCRAnalysis = createAsyncThunk(
  'api/fetchPCRAnalysis',
  async ({ symbol, expiry }: { symbol: string; expiry?: string }) => {
    const response = await apiClient.getPCRAnalysis(symbol, expiry);
    return response.data;
  }
);

// Slice
const apiSlice = createSlice({
  name: 'api',
  initialState: {
    optionsChain: [],
    coiAnalysis: [],
    pcrAnalysis: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOptionsChain.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOptionsChain.fulfilled, (state, action) => {
        state.loading = false;
        state.optionsChain = action.payload;
      })
      .addCase(fetchOptionsChain.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearError } = apiSlice.actions;
export default apiSlice.reducer;
```

### 4. Component Integration

Update your components to use the API:

```typescript
// components/COIAnalysis.tsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCOIAnalysis } from '../redux/apiSlice';

const COIAnalysis = () => {
  const dispatch = useDispatch();
  const { coiAnalysis, loading, error } = useSelector((state: any) => state.api);

  useEffect(() => {
    dispatch(fetchCOIAnalysis({ symbol: 'NIFTY' }));
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {coiAnalysis.map((item: any) => (
        <div key={item.strike}>
          Strike: {item.strike}, COI: {item.coi}
        </div>
      ))}
    </div>
  );
};

export default COIAnalysis;
```

### 5. Environment Configuration

Add to your `.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_WS_URL=http://localhost:5000
```

### 6. Real-time Data Hook

Create a custom hook for real-time data:

```typescript
// hooks/useRealTimeData.ts
import { useEffect, useState } from 'react';
import { wsClient } from '../utils/websocket';

export const useRealTimeData = (channel: string) => {
  const [data, setData] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socket = wsClient.connect();
    
    socket.on('connect', () => {
      setConnected(true);
      wsClient.subscribe(channel, (newData) => {
        setData(newData);
      });
    });

    socket.on('disconnect', () => {
      setConnected(false);
    });

    return () => {
      wsClient.unsubscribe(channel);
      wsClient.disconnect();
    };
  }, [channel]);

  return { data, connected };
};
```

## 🔄 Data Flow

1. **Static Data**: Use Redux thunks to fetch initial data
2. **Real-time Updates**: Use WebSocket subscriptions for live data
3. **Caching**: Backend handles caching, frontend can add React Query for additional caching
4. **Error Handling**: Implement proper error boundaries and retry logic

## 📱 Usage Examples

### COI Analysis Page
```typescript
const COIAnalysisPage = () => {
  const { data: realtimeData } = useRealTimeData('coi_update');
  const coiData = useSelector(state => state.api.coiAnalysis);
  
  // Merge real-time updates with stored data
  const mergedData = useMemo(() => {
    if (!realtimeData) return coiData;
    // Merge logic here
    return updatedData;
  }, [coiData, realtimeData]);

  return <COIChart data={mergedData} />;
};
```

### Options Chain
```typescript
const OptionsChainPage = () => {
  const dispatch = useDispatch();
  const [symbol, setSymbol] = useState('NIFTY');
  const [expiry, setExpiry] = useState('');

  useEffect(() => {
    dispatch(fetchOptionsChain({ symbol, expiry }));
  }, [symbol, expiry]);

  return (
    <div>
      <SymbolSelector value={symbol} onChange={setSymbol} />
      <ExpirySelector value={expiry} onChange={setExpiry} />
      <OptionsChainTable />
    </div>
  );
};
```

## 🚀 Getting Started

1. Install WebSocket client:
   ```bash
   npm install socket.io-client
   ```

2. Add the API client and WebSocket utilities to your project

3. Update your Redux store to include the API slice

4. Start using the backend endpoints in your components

5. Set up real-time subscriptions for live data

## 📊 Available Data

The backend provides all the data your frontend needs:
- ✅ Options chains with Greeks
- ✅ COI analysis with historical data
- ✅ PCR analysis and trends
- ✅ OI gainer/looser data
- ✅ Premium decay analysis
- ✅ IV analysis and surfaces
- ✅ Multi-strike analysis
- ✅ Futures data and analysis
- ✅ Position management
- ✅ Real-time price updates

Your existing JSON files in `/data` can now be replaced with dynamic API calls!
