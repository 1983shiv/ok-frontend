// API Client for TradingOK Backend
const API_BASE_URL = 'http://localhost:8080/api';

class TradingAPIClient {
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  // Generic fetch wrapper with error handling
  async fetchAPI(endpoint, options = {}) {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  // Market endpoints
  async getMarketStatus() {
    return this.fetchAPI('/market/status');
  }

  async getMarketOverview() {
    return this.fetchAPI('/market/overview');
  }

  async getTopGainers() {
    return this.fetchAPI('/market/top-gainers');
  }

  async getTopLosers() {
    return this.fetchAPI('/market/top-losers');
  }

  // Options endpoints
  async getOptionsChain(symbol, expiry) {
    return this.fetchAPI(`/options/chain/${symbol}/${expiry}`);
  }

  async getOptionsOverview(symbol) {
    return this.fetchAPI(`/options/overview/${symbol}`);
  }

  async getATMStrikes(symbol, expiry) {
    return this.fetchAPI(`/options/atm-strikes/${symbol}/${expiry}`);
  }

  async getOptionsVolume(symbol, expiry) {
    return this.fetchAPI(`/options/volume/${symbol}/${expiry}`);
  }

  async getImpliedVolatility(symbol, expiry) {
    return this.fetchAPI(`/options/iv/${symbol}/${expiry}`);
  }

  async getPremiumDecay(symbol, expiry) {
    return this.fetchAPI(`/options/premium-decay/${symbol}/${expiry}`);
  }

  // Open Interest endpoints
  async getOpenInterest(symbol, expiry) {
    return this.fetchAPI(`/oi/data/${symbol}/${expiry}`);
  }

  async getOIAnalysis(symbol, expiry) {
    return this.fetchAPI(`/oi/analysis/${symbol}/${expiry}`);
  }

  async getCallPutOI(symbol, expiry) {
    return this.fetchAPI(`/oi/call-put/${symbol}/${expiry}`);
  }

  async getOIGainersLosers(symbol, expiry) {
    return this.fetchAPI(`/oi/gainers-losers/${symbol}/${expiry}`);
  }

  async getStrikeOI(symbol, expiry, strike) {
    return this.fetchAPI(`/oi/strike/${symbol}/${expiry}/${strike}`);
  }

  async getMaxPain(symbol, expiry) {
    return this.fetchAPI(`/oi/max-pain/${symbol}/${expiry}`);
  }

  async getPCR(symbol, expiry) {
    return this.fetchAPI(`/oi/pcr/${symbol}/${expiry}`);
  }

  // Futures endpoints
  async getFuturesData(symbol) {
    return this.fetchAPI(`/futures/data/${symbol}`);
  }

  async getFuturesOI(symbol) {
    return this.fetchAPI(`/futures/oi/${symbol}`);
  }

  async getFuturesChart(symbol, interval) {
    return this.fetchAPI(`/futures/chart/${symbol}/${interval}`);
  }

  // Historical endpoints
  async getHistoricalOptions(symbol, expiry, date) {
    return this.fetchAPI(`/historical/options/${symbol}/${expiry}/${date}`);
  }

  async getHistoricalOI(symbol, expiry, date) {
    return this.fetchAPI(`/historical/oi/${symbol}/${expiry}/${date}`);
  }

  async getHistoricalPrices(symbol, from, to) {
    return this.fetchAPI(`/historical/prices/${symbol}/${from}/${to}`);
  }

  // Chart data endpoints
  async getChartData(symbol, expiry, interval = '1m') {
    return this.fetchAPI(`/charts/data/${symbol}/${expiry}/${interval}`);
  }

  async getMultiStrikeChart(symbol, expiry, strikes) {
    const strikeParams = strikes.join(',');
    return this.fetchAPI(`/charts/multi-strike/${symbol}/${expiry}?strikes=${strikeParams}`);
  }

  // Health check
  async healthCheck() {
    return this.fetchAPI('/health');
  }
}

// Create and export a singleton instance
const apiClient = new TradingAPIClient();

export default apiClient;
export { TradingAPIClient };
