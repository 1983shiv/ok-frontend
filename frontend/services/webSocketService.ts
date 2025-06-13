// WebSocket Service for Real-time Data
import { io, Socket } from 'socket.io-client';

interface WebSocketCallbacks {
  onMarketUpdate?: (data: any) => void;
  onOptionsUpdate?: (data: any) => void;
  onOIUpdate?: (data: any) => void;
  onFuturesUpdate?: (data: any) => void;
  onChartUpdate?: (data: any) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: any) => void;
}

class WebSocketService {
  private socket: Socket | null = null;
  private callbacks: WebSocketCallbacks = {};
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 3000;

  constructor(private url: string = 'http://localhost:8080') {}

  connect(callbacks: WebSocketCallbacks = {}) {
    this.callbacks = { ...this.callbacks, ...callbacks };

    if (this.socket?.connected) {
      console.log('WebSocket already connected');
      return;
    }

    try {
      this.socket = io(this.url, {
        transports: ['websocket', 'polling'],
        upgrade: true,
        rememberUpgrade: true,
      });

      this.setupEventHandlers();
      
      console.log('WebSocket connecting to:', this.url);
    } catch (error) {
      console.error('WebSocket connection error:', error);
      this.callbacks.onError?.(error);
    }
  }

  private setupEventHandlers() {
    if (!this.socket) return;

    // Connection events
    this.socket.on('connect', () => {
      console.log('✅ WebSocket connected');
      this.reconnectAttempts = 0;
      this.callbacks.onConnect?.();
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ WebSocket disconnected:', reason);
      this.callbacks.onDisconnect?.();
      
      if (reason === 'io server disconnect') {
        // Server disconnected, try to reconnect
        this.scheduleReconnect();
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      this.callbacks.onError?.(error);
      this.scheduleReconnect();
    });

    // Data update events
    this.socket.on('market_update', (data) => {
      this.callbacks.onMarketUpdate?.(data);
    });

    this.socket.on('options_update', (data) => {
      this.callbacks.onOptionsUpdate?.(data);
    });

    this.socket.on('oi_update', (data) => {
      this.callbacks.onOIUpdate?.(data);
    });

    this.socket.on('futures_update', (data) => {
      this.callbacks.onFuturesUpdate?.(data);
    });

    this.socket.on('chart_update', (data) => {
      this.callbacks.onChartUpdate?.(data);
    });

    // Additional events for specific data types
    this.socket.on('premium_decay_update', (data) => {
      this.callbacks.onOptionsUpdate?.(data);
    });

    this.socket.on('iv_update', (data) => {
      this.callbacks.onOptionsUpdate?.(data);
    });

    this.socket.on('pcr_update', (data) => {
      this.callbacks.onOIUpdate?.(data);
    });
  }

  private scheduleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    console.log(`Reconnecting... Attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);

    setTimeout(() => {
      this.connect(this.callbacks);
    }, this.reconnectInterval * this.reconnectAttempts);
  }

  // Subscribe to specific data feeds
  subscribeToMarket(symbols: string[] = ['NIFTY', 'BANKNIFTY']) {
    if (!this.socket?.connected) {
      console.warn('WebSocket not connected');
      return;
    }

    this.socket.emit('subscribe_market', { symbols });
    console.log('📊 Subscribed to market data:', symbols);
  }

  subscribeToOptions(symbol: string, expiry: string) {
    if (!this.socket?.connected) {
      console.warn('WebSocket not connected');
      return;
    }

    this.socket.emit('subscribe_options', { symbol, expiry });
    console.log('📈 Subscribed to options data:', { symbol, expiry });
  }

  subscribeToOI(symbol: string, expiry: string) {
    if (!this.socket?.connected) {
      console.warn('WebSocket not connected');
      return;
    }

    this.socket.emit('subscribe_oi', { symbol, expiry });
    console.log('🔢 Subscribed to OI data:', { symbol, expiry });
  }

  subscribeToFutures(symbols: string[] = ['NIFTY', 'BANKNIFTY']) {
    if (!this.socket?.connected) {
      console.warn('WebSocket not connected');
      return;
    }

    this.socket.emit('subscribe_futures', { symbols });
    console.log('📉 Subscribed to futures data:', symbols);
  }

  subscribeToCharts(symbol: string, expiry: string, interval: string = '1m') {
    if (!this.socket?.connected) {
      console.warn('WebSocket not connected');
      return;
    }

    this.socket.emit('subscribe_charts', { symbol, expiry, interval });
    console.log('📊 Subscribed to chart data:', { symbol, expiry, interval });
  }

  // Unsubscribe from data feeds
  unsubscribeFromMarket() {
    this.socket?.emit('unsubscribe_market');
  }

  unsubscribeFromOptions() {
    this.socket?.emit('unsubscribe_options');
  }

  unsubscribeFromOI() {
    this.socket?.emit('unsubscribe_oi');
  }

  unsubscribeFromFutures() {
    this.socket?.emit('unsubscribe_futures');
  }

  unsubscribeFromCharts() {
    this.socket?.emit('unsubscribe_charts');
  }

  // Request one-time data updates
  requestMarketUpdate() {
    this.socket?.emit('request_market_update');
  }

  requestOptionsUpdate(symbol: string, expiry: string) {
    this.socket?.emit('request_options_update', { symbol, expiry });
  }

  requestOIUpdate(symbol: string, expiry: string) {
    this.socket?.emit('request_oi_update', { symbol, expiry });
  }

  requestFuturesUpdate(symbol: string) {
    this.socket?.emit('request_futures_update', { symbol });
  }

  // Utility methods
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      console.log('WebSocket disconnected');
    }
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  updateCallbacks(callbacks: Partial<WebSocketCallbacks>) {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }
}

// Create and export singleton instance
const webSocketService = new WebSocketService();

export default webSocketService;
export { WebSocketService, type WebSocketCallbacks };
