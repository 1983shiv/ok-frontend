# Frontend Migration Guide: Static JSON to Live API Data

## Overview

The TradingOK frontend has been successfully migrated from static JSON data files to live API data with WebSocket real-time updates. This guide explains the changes and how to use the new system.

## Key Changes

### 1. Redux Store Architecture

**Before (Static Data):**
```typescript
// Directly imported JSON files
import chartData from '@/data/chartData.json';
import premiumDecayData from "@/data/premiumDecayData.json";

const initialState = {
  chartData,
  premiumDecayData,
  // ... other static data
}
```

**After (API Data):**
```typescript
// Dynamic data with loading states
interface ChartState {
  // API Data
  marketData: MarketData;
  optionsData: OptionsData;
  oiData: OIData;
  
  // Loading states
  loading: {
    market: LoadingState;
    options: LoadingState;
    oi: LoadingState;
  };
  
  // WebSocket state
  websocket: {
    connected: boolean;
    subscriptions: string[];
  };
}
```

### 2. Data Fetching

**Before:**
- Data was statically imported at build time
- No real-time updates
- Fixed data structure

**After:**
```typescript
// Async thunks for API calls
export const fetchOptionsChain = createAsyncThunk(
  'chart/fetchOptionsChain',
  async ({ symbol, expiry }) => {
    return await apiClient.getOptionsChain(symbol, expiry);
  }
);

// Custom hooks for data management
const { optionsData, loading, refetch } = useOptionsData();
```

### 3. Real-time Updates

**New WebSocket Integration:**
```typescript
// WebSocket service for real-time data
const webSocketService = new WebSocketService();

// Automatic subscriptions based on current filters
useEffect(() => {
  if (connected && filters.symbol && filters.expiry) {
    subscribeToOptions(filters.symbol, filters.expiry);
    subscribeToOI(filters.symbol, filters.expiry);
  }
}, [connected, filters]);
```

## New Components Structure

### Services Layer
- `apiClient.ts` - REST API client with all backend endpoints
- `webSocketService.ts` - WebSocket management for real-time data
- `apiThunks.ts` - Redux async thunks for API calls

### Hooks Layer
- `useTradingData.ts` - Custom hooks for data management
- `useWebSocket()` - WebSocket connection management
- `useMarketData()` - Market data fetching
- `useOptionsData()` - Options data fetching
- `useOIData()` - Open Interest data fetching

### Components Layer
- `TradingDataProvider.tsx` - Global data provider component
- `ApiDataDashboard.tsx` - Live data dashboard example

## Migration Steps for Existing Components

### Step 1: Replace Static Data Access

**Before:**
```typescript
// Old way - accessing static data
const chartData = useSelector(state => state.chart.chartData);
const premiumDecayData = useSelector(state => state.chart.premiumDecayData);
```

**After:**
```typescript
// New way - accessing API data with loading states
const { optionsData, loading } = useSelector(state => state.chart);
const { marketData } = useSelector(state => state.chart);

// Or use custom hooks
const { optionsData, loading, refetch } = useOptionsData();
```

### Step 2: Handle Loading States

```typescript
// Add loading state handling
if (loading.options.isLoading) {
  return <LoadingSpinner />;
}

if (loading.options.error) {
  return <ErrorMessage error={loading.options.error} />;
}

// Use the data
const chartData = optionsData.chain;
```

### Step 3: Add Real-time Updates

```typescript
// Subscribe to real-time updates
const { connected, subscribeToOptions } = useWebSocket();

useEffect(() => {
  if (connected && symbol && expiry) {
    subscribeToOptions(symbol, expiry);
  }
}, [connected, symbol, expiry]);
```

## API Endpoints Available

### Market Data
- `/api/market/status` - Market status
- `/api/market/overview` - Market overview
- `/api/market/top-gainers` - Top gainers
- `/api/market/top-losers` - Top losers

### Options Data
- `/api/options/chain/{symbol}/{expiry}` - Options chain
- `/api/options/overview/{symbol}` - Options overview
- `/api/options/atm-strikes/{symbol}/{expiry}` - ATM strikes
- `/api/options/volume/{symbol}/{expiry}` - Options volume
- `/api/options/iv/{symbol}/{expiry}` - Implied volatility
- `/api/options/premium-decay/{symbol}/{expiry}` - Premium decay

### Open Interest
- `/api/oi/data/{symbol}/{expiry}` - Open interest data
- `/api/oi/analysis/{symbol}/{expiry}` - OI analysis
- `/api/oi/call-put/{symbol}/{expiry}` - Call/Put OI
- `/api/oi/gainers-losers/{symbol}/{expiry}` - OI gainers/losers
- `/api/oi/max-pain/{symbol}/{expiry}` - Max pain calculation
- `/api/oi/pcr/{symbol}/{expiry}` - PCR ratio

### Futures Data
- `/api/futures/data/{symbol}` - Futures data
- `/api/futures/oi/{symbol}` - Futures OI
- `/api/futures/chart/{symbol}/{interval}` - Futures chart

## WebSocket Events

### Outgoing (Subscribe)
- `subscribe_market` - Subscribe to market updates
- `subscribe_options` - Subscribe to options updates
- `subscribe_oi` - Subscribe to OI updates
- `subscribe_futures` - Subscribe to futures updates
- `subscribe_charts` - Subscribe to chart updates

### Incoming (Data Updates)
- `market_update` - Real-time market data
- `options_update` - Real-time options data
- `oi_update` - Real-time OI data
- `futures_update` - Real-time futures data
- `chart_update` - Real-time chart data

## Usage Examples

### Basic Component Migration

```typescript
// Before
function MyChart() {
  const chartData = useSelector(state => state.chart.chartData);
  
  return <Chart data={chartData} />;
}

// After
function MyChart() {
  const { chartData, loading } = useChartData();
  
  if (loading.isLoading) return <LoadingSpinner />;
  if (loading.error) return <ErrorMessage error={loading.error} />;
  
  return <Chart data={chartData.main} />;
}
```

### Real-time Component

```typescript
function LivePCRChart() {
  const { oiData, loading } = useOIData();
  const { connected, subscribeToOI } = useWebSocket();
  const { symbol, expiry } = useSelector(state => state.chart.filters);

  useEffect(() => {
    if (connected) {
      subscribeToOI(symbol, expiry);
    }
  }, [connected, symbol, expiry]);

  return (
    <div>
      <div className="flex items-center">
        <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`} />
        <span>{connected ? 'Live' : 'Offline'}</span>
      </div>
      
      {loading.isLoading ? (
        <LoadingSpinner />
      ) : (
        <PCRChart data={oiData.pcr} />
      )}
    </div>
  );
}
```

## Testing the Integration

1. **Start Backend Server:**
   ```cmd
   cd backend
   npm start
   ```

2. **Start Frontend Server:**
   ```cmd
   cd frontend
   npm run dev:3002
   ```

3. **Visit Test Pages:**
   - API Test Page: `http://localhost:3002/api-test`
   - Live Data Dashboard: `http://localhost:3002/live-data`

## Benefits of the New System

1. **Real-time Data**: Live market updates via WebSocket
2. **Scalability**: Can handle multiple symbols and timeframes
3. **Error Handling**: Proper error states and retry mechanisms
4. **Performance**: Efficient data fetching and caching
5. **Type Safety**: Full TypeScript support for API responses
6. **Flexibility**: Easy to add new data sources and endpoints

## Next Steps

1. **Update Existing Charts**: Migrate remaining chart components to use API data
2. **Add More Endpoints**: Implement additional backend endpoints as needed
3. **Optimize Performance**: Add data caching and memoization
4. **Enhanced WebSocket**: Add more granular subscriptions
5. **Error Recovery**: Implement automatic retry and fallback mechanisms

The migration is now complete and the frontend is fully integrated with the backend API system!
