const { param, query, body, validationResult } = require('express-validator');

// Available symbols for validation
const VALID_SYMBOLS = ['NIFTY', 'BANKNIFTY', 'FINNIFTY', 'MIDCPNIFTY'];

// Available intervals
const VALID_INTERVALS = ['1 Min', '3 Min', '5 Min', '15 Min', '30 Min', '1 Hour'];

// Available ranges
const VALID_RANGES = ['Auto', 'ITM 10', 'ITM 5', 'ATM ±5', 'ATM ±10', 'OTM 5', 'OTM 10'];

// Available option types
const VALID_OPTION_TYPES = ['CE', 'PE', 'CALL', 'PUT'];

// Available periods for historical data
const VALID_PERIODS = ['1d', '1w', '1m', '3m', '6m', '1y'];

// Available chart types
const VALID_CHART_TYPES = ['oi', 'price-oi', 'straddle', 'premium-decay', 'iv', 'pcr'];

/**
 * Validate symbol parameter
 */
const validateSymbol = param('symbol')
  .isIn(VALID_SYMBOLS)
  .withMessage(`Symbol must be one of: ${VALID_SYMBOLS.join(', ')}`);

/**
 * Validate expiry date parameter (DD-MM-YYYY format)
 */
const validateExpiry = param('expiry')
  .matches(/^\d{2}-\d{2}-\d{4}$/)
  .withMessage('Expiry must be in DD-MM-YYYY format')
  .custom((value) => {
    const date = new Date(value.split('-').reverse().join('-'));
    if (isNaN(date.getTime())) {
      throw new Error('Invalid expiry date');
    }
    if (date < new Date()) {
      throw new Error('Expiry date cannot be in the past');
    }
    return true;
  });

/**
 * Validate strike price parameter
 */
const validateStrike = param('strike')
  .isFloat({ min: 1 })
  .withMessage('Strike price must be a positive number')
  .toFloat();

/**
 * Validate interval query parameter
 */
const validateInterval = query('interval')
  .optional()
  .isIn(VALID_INTERVALS)
  .withMessage(`Interval must be one of: ${VALID_INTERVALS.join(', ')}`);

/**
 * Validate range query parameter
 */
const validateRange = query('range')
  .optional()
  .isIn(VALID_RANGES)
  .withMessage(`Range must be one of: ${VALID_RANGES.join(', ')}`);

/**
 * Validate period query parameter for historical data
 */
const validatePeriod = query('period')
  .optional()
  .isIn(VALID_PERIODS)
  .withMessage(`Period must be one of: ${VALID_PERIODS.join(', ')}`);

/**
 * Validate option type parameter
 */
const validateOptionType = param('optionType')
  .optional()
  .isIn(VALID_OPTION_TYPES)
  .withMessage(`Option type must be one of: ${VALID_OPTION_TYPES.join(', ')}`);

/**
 * Validate chart type parameter
 */
const validateChartType = param('chartType')
  .isIn(VALID_CHART_TYPES)
  .withMessage(`Chart type must be one of: ${VALID_CHART_TYPES.join(', ')}`);

/**
 * Validate pagination parameters
 */
const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer')
    .toInt(),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 1000 })
    .withMessage('Limit must be between 1 and 1000')
    .toInt()
];

/**
 * Validate date range parameters
 */
const validateDateRange = [
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be in ISO 8601 format'),
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be in ISO 8601 format')
    .custom((endDate, { req }) => {
      if (req.query.startDate && endDate && new Date(endDate) <= new Date(req.query.startDate)) {
        throw new Error('End date must be after start date');
      }
      return true;
    })
];

/**
 * Validate filter parameters for options data
 */
const validateOptionsFilter = [
  query('minStrike')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum strike must be a positive number')
    .toFloat(),
  query('maxStrike')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum strike must be a positive number')
    .toFloat(),
  query('minOI')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Minimum OI must be a positive integer')
    .toInt(),
  query('minVolume')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Minimum volume must be a positive integer')
    .toInt()
];

/**
 * Validate WebSocket subscription data
 */
const validateWSSubscription = (data) => {
  const errors = [];
  
  if (data.symbols && !Array.isArray(data.symbols)) {
    errors.push('Symbols must be an array');
  }
  
  if (data.symbols && data.symbols.some(symbol => !VALID_SYMBOLS.includes(symbol))) {
    errors.push(`Invalid symbol. Valid symbols: ${VALID_SYMBOLS.join(', ')}`);
  }
  
  if (data.interval && !VALID_INTERVALS.includes(data.interval)) {
    errors.push(`Invalid interval. Valid intervals: ${VALID_INTERVALS.join(', ')}`);
  }
  
  if (data.range && !VALID_RANGES.includes(data.range)) {
    errors.push(`Invalid range. Valid ranges: ${VALID_RANGES.join(', ')}`);
  }
  
  return errors;
};

/**
 * Handle validation errors middleware
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(error => ({
      field: error.path || error.param,
      message: error.msg,
      value: error.value
    }));
    
    return res.status(400).json({
      error: 'Validation failed',
      details: formattedErrors,
      timestamp: new Date().toISOString()
    });
  }
  
  next();
};

/**
 * Sanitize query parameters
 */
const sanitizeQuery = (req, res, next) => {
  // Set default values
  req.query.page = req.query.page || 1;
  req.query.limit = req.query.limit || 50;
  req.query.interval = req.query.interval || '15 Min';
  req.query.range = req.query.range || 'Auto';
  
  // Convert string numbers to actual numbers
  if (req.query.page) req.query.page = parseInt(req.query.page);
  if (req.query.limit) req.query.limit = parseInt(req.query.limit);
  if (req.query.minStrike) req.query.minStrike = parseFloat(req.query.minStrike);
  if (req.query.maxStrike) req.query.maxStrike = parseFloat(req.query.maxStrike);
  if (req.query.minOI) req.query.minOI = parseInt(req.query.minOI);
  if (req.query.minVolume) req.query.minVolume = parseInt(req.query.minVolume);
  
  next();
};

module.exports = {
  validateSymbol,
  validateExpiry,
  validateStrike,
  validateInterval,
  validateRange,
  validatePeriod,
  validateOptionType,
  validateChartType,
  validatePagination,
  validateDateRange,
  validateOptionsFilter,
  validateWSSubscription,
  handleValidationErrors,
  sanitizeQuery,
  VALID_SYMBOLS,
  VALID_INTERVALS,
  VALID_RANGES,
  VALID_OPTION_TYPES,
  VALID_PERIODS,
  VALID_CHART_TYPES
};