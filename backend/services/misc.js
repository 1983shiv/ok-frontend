import fs from 'fs';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();


// const atm_nifty = '24200'
const atm_bnifty = '55100'
const atm_fnifty = '26100'
const atm_mnifty = '12100'
// Read and parse JSON data
const rawData = fs.readFileSync('NSE.json', 'utf-8');
const instruments = JSON.parse(rawData);

let eq = []
let fut = []
// Index to instrument key mapping
export const indexToKey = {
    NIFTY: 'NSE_INDEX|Nifty 50',
    BANKNIFTY: 'NSE_INDEX|Nifty Bank',
    FINNIFTY: 'NSE_INDEX|Nifty Fin Service',
    MIDCPNIFTY: 'NSE_INDEX|NIFTY MID SELECT',
};

export const strikeIntervals = {
  NIFTY: 50,
  BANKNIFTY: 100,
  FINNIFTY: 50,
  MIDCPNIFTY: 25,
};

// function that takes a date string in 'YYYY-MM-DD' format and returns the corresponding Unix timestamp in milliseconds
function dateToTimestamp(dateStr) {
    const date = new Date(dateStr);
    return date.getTime();
}

function formatDate(ts) {
    const date = new Date(ts);
    if (isNaN(date.getTime())) {
        // console.warn('Invalid timestamp:', ts);
        return null;
    }
    return date.toISOString().split('T')[0];
}

function getStrikePricesAroundATM(atm_idx, depth, strikePrices) {
    const atm = Number(atm_idx);

    // Sort strike prices numerically
    const sorted = [...strikePrices].sort((a, b) => a - b);

    // Find the closest strike price to ATM
    const atmIndex = sorted.findIndex(price => price >= atm);

    if (atmIndex === -1) {
        console.warn('ATM strike not found in available strikes.');
        return [];
    }

    const start = Math.max(0, atmIndex - depth);
    const end = Math.min(sorted.length, atmIndex + depth + 1);

    return sorted.slice(start, end);
}

// function getInstrumentKeysInRange(lowerStrike, higherStrike, instruments) {
//     return instruments
//       .filter(item =>
//         item.instrument_type === 'FUT' &&
//         item.segment === 'NSE_FO' &&
//         item.instrument_key &&
//         item.strike_price >= lowerStrike &&
//         item.strike_price <= higherStrike
//       )
//       .map(item => item.instrument_key);
//   }

export function getInstrumentKeysInRange(idx="NIFTY", expiry, lowerStrike, higherStrike, instruments ) {
    return instruments
      .filter(item => {
        // Ensure the strike_price is a number and log for debugging
        const strikePrice = Number(item.strike_price);
        const itemExpiry = formatDate(item.expiry);
        if (isNaN(strikePrice) || !itemExpiry) return false;
  
        return (
          item.segment === 'NSE_FO' &&
          item.name === idx &&
          itemExpiry === expiry &&
          item.instrument_key &&
          strikePrice >= Number(lowerStrike) &&
          strikePrice <= Number(higherStrike)
        );
      })
      .map(item => item.instrument_key);
}
  

// const singleExpiry = instruments.filter(
//     item => formatDate(item.expiry) === '2025-05-02'
// );
// console.log(singleExpiry)

export const threeMonthsUniqueExpiry = [
    ...new Set(
      instruments
        .filter(item => item.segment === 'NSE_FO' && item.expiry)
        .map(item => item.expiry)
    )
  ]
  .map(ts => {
    const date = new Date(ts);
    if (isNaN(date)) return null;
    return date;
  })
  .filter(Boolean)
  .filter(date => {
    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfRange = new Date(now.getFullYear(), now.getMonth() + 4, 0); // end of month after 2 months
    return date >= startOfCurrentMonth && date <= endOfRange;
  })
  .map(date => date.toISOString().split('T')[0])
  .sort();
  
export function getUniqueExpiry(idx = 'NIFTY', months=3, instruments){
  const UniqueExpiry = [
    ...new Set(
      instruments
        .filter(item => item.segment === 'NSE_FO' && item.name === (idx) && item.expiry)
        .map(item => item.expiry)
    )
  ]
  .map(ts => {
    const date = new Date(ts);
    if (isNaN(date)) return null;
    return date;
  })
  .filter(Boolean)
  .filter(date => {
    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfRange = new Date(now.getFullYear(), now.getMonth() + (months + 1), 0); // end of month after 2 months
    return date >= startOfCurrentMonth && date <= endOfRange;
  })
  .map(date => date.toISOString().split('T')[0])
  .sort();

  return UniqueExpiry;
}

//   console.log(threeMonthsUniqueExpiry);

// input, array of indexes, array of expiries, data
export function idxsInstrumentsKey(idxs = ['MIDCPNIFTY', 'FINNIFTY', 'BANKFINNIFTY', 'NIFTY'], threeMonthsUniqueExpiry, instruments){
  const filteredInstrumentKeys = [
    ...new Set(
      instruments
        .filter(item =>
          item.segment === 'NSE_FO' &&
          threeMonthsUniqueExpiry.includes(new Date(item.expiry).toISOString().split('T')[0]) &&
          idxs.includes(item.asset_symbol)
        )
        .map(item => item.instrument_key)
    )
  ];
  return filteredInstrumentKeys;
}

// console.log(filteredInstrumentKeys.length)
// Write filteredInstrumentKeys to a JSON file
// fs.writeFileSync('filteredInstrumentKeys.json', JSON.stringify(filteredInstrumentKeys, null, 2), 'utf8');

const countInstruments = [
    ...new Set(
        instruments        
        .filter(item => item.segment === 'NSE_FO' && (item.asset_symbol === 'MIDCPNIFTY' ||  item.asset_symbol === 'FINNIFTY' ||  item.asset_symbol === 'BANKFINNIFTY' ||  item.asset_symbol === 'NIFTY'))
        .map(item => (item.instrument_key))
    )];

const niftyInstruments = [
    ...new Set(
        instruments        
        .filter(item => item.segment === 'NSE_FO' && (item.asset_symbol === 'NIFTY'))
        .map(item => (item.instrument_key))
    )];    
// console.log(niftyInstruments.length)
// const atm_nifty = '24400'
// const uniqueNiftyStrikePrices = [
//     ...new Set(
//         instruments        
//         .filter(item => item.segment === 'NSE_FO' && item.name === 'NIFTY' && formatDate(item.expiry) === "2025-05-08" && item.strike_price)
//         .map(item => (item.strike_price))
//     )];

//     // console.log(uniqueNiftyStrikePrices.length)
// const threeUniqueStrikeNifty = getStrikePricesAroundATM(atm_nifty, 21, uniqueNiftyStrikePrices)    
// console.log(threeUniqueStrikeNifty)    


// const strikeInstrumentKeys = getInstrumentKeysInRange("NIFTY", "2025-05-08", 23350, 25450, instruments)
// console.log(strikeInstrumentKeys)
// const uniqueExpiry = [...new Set(instruments.map(item => item.expiry))];
const uniqueExpiry = [
    ...new Set(
      instruments
        .filter(item => item.segment === 'NSE_FO' && item.expiry) // filter valid expiry and correct segment
        .map(item => item.expiry)
    )
  ].map(ts => {
    const date = new Date(ts);
    if (isNaN(date)) return null; // Skip or mark invalid dates
    return date.toISOString().split('T')[0];
  }).filter(Boolean).sort(); // remove nulls from the result
  
  
  

  // console.log(uniqueExpiry);




const uniqueInstrumentType = [...new Set(instruments.map(item => item.instrument_type))];
// console.log(uniqueInstrumentType)
const weeklyInstruments = instruments.filter(
    item => item.weekly === true && item.segment === 'NSE_FO'
);

// console.log(weeklyInstruments)

// weeklyInstruments.forEach(({ name, trading_symbol, instrument_key, lot_size }) => {
//     console.log(trading_symbol)
//     // fut.push({ name, trading_symbol, instrument_key, lot_size })
// })

instruments
    .filter(item => item.instrument_type === 'FUT' && item.segment === 'NSE_FO' && item.instrument_key)
    .map(item => item.instrument_key);

const filtered_fut = instruments.filter(
    item => item.instrument_type === 'FUT' && item.segment === 'NSE_FO'
);

let singleItem = filtered_fut.filter((item) => item.asset_symbol === 'COALINDIA')

// console.log(weeklyInstruments);

// filtered_fut.forEach(({ name, trading_symbol, instrument_key, lot_size }) => {
//     console.log({name})
//     fut.push({ name, trading_symbol, instrument_key, lot_size })
// })

// const filtered_eq = instruments.filter(item => item.instrument_type === 'EQ');
// // console.log(filtered_eq)
// filtered_eq.forEach(({ name, trading_symbol, instrument_key, lot_size }) => {
//     console.log({trading_symbol})
//     eq.push({ name, trading_symbol, instrument_key, lot_size })
// })


// Filter: only entries where segment is NCD_FO
// const filtered = instruments.filter(item => item.segment === 'NSE_INDEX');

// const uniqueSegments = [...new Set(instruments.map(item => item.segment))];
// let idxInstrumentKeys = ["NSE_INDEX|Nifty 50", "NSE_INDEX|Nifty Bank", "NSE_INDEX|Nifty Fin Service", "NSE_INDEX|NIFTY MID SELECT"]
// const filtered = instruments.filter(item => item.segment === 'NSE_INDEX');
// filtered.forEach(({ name, trading_symbol, instrument_key }) => {
//     const upperName = trading_symbol.toUpperCase(); // normalize case for matching
//     if (
//         upperName.includes("NIFTY INDEX") ||
//         upperName.includes("BANKNIFTY INDEX") ||
//         upperName.includes("FINNIFTY INDEX") ||
//         upperName.includes("MIDCPNIFTY INDEX")
//     ) {
//         idxInstrumentKeys.push({ name, trading_symbol, instrument_key });
//     }
// });

// console.log({idxInstrumentKeys})
// const instr_keys = idxInstrumentKeys
//     .map(item => item.instrument_key)
//     .join(',');
const idx_instr_keys = ["NSE_INDEX|Nifty 50", "NSE_INDEX|Nifty Bank", "NSE_INDEX|Nifty Fin Service", "NSE_INDEX|NIFTY MID SELECT"].join(',');

const interval = "1minute";
const fromDate = "2025-04-30"
const toDate = "2025-04-30"
const idx_url = `https://api.upstox.com/v2/market-quote/quotes?instrument_key=${encodeURIComponent(idx_instr_keys)}&interval=1minute`;

// const url = `https://api.upstox.com/v2/historical-candle/instrument_key=${encodeURIComponent(instr_keys)}&interval=${interval}&from_date=${fromDate}&to_date=${toDate}`;

// https://api.upstox.com/v2/historical-candle/:instrument_key/:interval/:to_date/:from_date',

export async function fetchHistoricalData(url) {
  try {
    const response = await axios.get(url, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${process.env.UPSTOX_ACCESS_TOKEN}`,
      },
      maxBodyLength: Infinity,
    });

    console.log(response.data);
    return response.data;

  } catch (error) {
    console.error('Error fetching historical data:', error?.response?.data || error.message);
    throw error; // Optional: rethrow if caller needs to handle it
  }
}

// export function fetchHistoricalData(url) {
//     let config = {
//         method: 'get',
//         maxBodyLength: Infinity,
//         url: url,
//         headers: {
//             Accept: 'application/json',
//             Authorization:
//                 `Bearer ${process.env.UPSTOX_ACCESS_TOKEN}`,
//         },
//     };
//     try {
//         let data = axios.get(config)
//           .then((response) => {
//             console.log(response.data);
//             return response.data;
//           })
//           .catch((error) => {
//             console.log(`Error: ${error}`)
//           });

//     } catch (error) {
//         console.log(error);
//     }
// }

// const data = fetchData(idx_url)
// console.log(data)
// axios(config)
//     .then((response) => {
//         console.log(JSON.stringify(response.data));
//     })
//     .catch((error) => {
//         console.log(error);
//     });

// console.log({url})

// Check if current time is between 9:15 AM and 3:30 PM IST
export function isMarketHours() {
  const nowUTC = new Date();
  
  // Create IST time based on UTC
  const istTime = new Date(nowUTC.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  
  const year = istTime.getFullYear();
  const month = istTime.getMonth();
  const date = istTime.getDate();

  const time915AM = new Date(year, month, date, 9, 0); // 9:15 AM IST
  const time330PM = new Date(year, month, date, 15, 32); // 3:30 PM IST

  return istTime >= time915AM && istTime <= time330PM;
}

// Authorize Upstox market data feed
export const getMarketFeedUrl = async (accessToken) => {
  const url = "https://api.upstox.com/v3/feed/market-data-feed/authorize";
  const headers = {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
  };
  if (!accessToken) throw new Error("UPSTOX_ACCESS_TOKEN not set");
  try {
      const response = await axios.get(url, { headers });
      return response.data.data.authorizedRedirectUri;
  } catch (error) {
      console.error("Failed to get market feed URL:", error);
      throw error;
  }
};


export const calculateCumulativeData = (data, metric) => {
  return data.map((item, index) => {
    const cumulativeSum = data
      .slice(0, index + 1)
      .reduce((sum, curr) => sum + (Number(curr[metric]) || 0), 0);
    
    return {
      ...item,
      [metric]: cumulativeSum
    };
  });
};



