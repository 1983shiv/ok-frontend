const NodeCache = require('node-cache');

// Create cache instance with default TTL of 5 minutes
const cache = new NodeCache({ 
  stdTTL: 300, // 5 minutes default
  checkperiod: 60, // Check for expired keys every minute
  useClones: false // Don't clone objects for better performance
});

/**
 * Cache middleware for Express routes
 * @param {number} duration - Cache duration in seconds (default: 300 = 5 minutes)
 * @param {function} keyGenerator - Function to generate cache key (optional)
 */
const cacheMiddleware = (duration = 300, keyGenerator = null) => {
  return (req, res, next) => {
    try {
      // Generate cache key
      const key = keyGenerator 
        ? keyGenerator(req)
        : `${req.method}:${req.originalUrl}:${JSON.stringify(req.query)}`;
      
      // Try to get from cache
      const cached = cache.get(key);
      
      if (cached) {
        console.log(`Cache hit for key: ${key}`);
        return res.json(cached);
      }
      
      // Store original json method
      res.sendResponse = res.json;
      
      // Override json method to cache response
      res.json = (body) => {
        if (res.statusCode === 200) {
          cache.set(key, body, duration);
          console.log(`Cached response for key: ${key} (TTL: ${duration}s)`);
        }
        res.sendResponse(body);
      };
      
      next();
    } catch (error) {
      console.error('Cache middleware error:', error);
      next();
    }
  };
};

/**
 * Cache middleware for WebSocket data
 * @param {string} key - Cache key
 * @param {any} data - Data to cache
 * @param {number} duration - Cache duration in seconds
 */
const cacheWSData = (key, data, duration = 300) => {
  try {
    cache.set(key, data, duration);
    console.log(`WebSocket data cached for key: ${key}`);
  } catch (error) {
    console.error('WebSocket cache error:', error);
  }
};

/**
 * Get cached WebSocket data
 * @param {string} key - Cache key
 * @returns {any} Cached data or null
 */
const getCachedWSData = (key) => {
  try {
    return cache.get(key);
  } catch (error) {
    console.error('WebSocket cache retrieval error:', error);
    return null;
  }
};

/**
 * Clear cache for specific pattern
 * @param {string} pattern - Pattern to match keys
 */
const clearCachePattern = (pattern) => {
  try {
    const keys = cache.keys();
    const matchingKeys = keys.filter(key => key.includes(pattern));
    matchingKeys.forEach(key => cache.del(key));
    console.log(`Cleared ${matchingKeys.length} cache entries matching pattern: ${pattern}`);
  } catch (error) {
    console.error('Cache clear error:', error);
  }
};

/**
 * Get cache statistics
 */
const getCacheStats = () => {
  try {
    return {
      keys: cache.keys().length,
      hits: cache.getStats().hits,
      misses: cache.getStats().misses,
      ksize: cache.getStats().ksize,
      vsize: cache.getStats().vsize
    };
  } catch (error) {
    console.error('Cache stats error:', error);
    return { error: 'Unable to retrieve cache stats' };
  }
};

module.exports = {
  cacheMiddleware,
  cacheWSData,
  getCachedWSData,
  clearCachePattern,
  getCacheStats,
  cache
};