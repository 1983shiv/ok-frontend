
import fs from 'fs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { idxsInstrumentsKey, calculateCumulativeData, getUniqueExpiry, isMarketHours, getMarketFeedUrl, indexToKey, strikeIntervals } from './misc.js';

dotenv.config();

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const rawData = fs.readFileSync('NSE.json', 'utf-8');
const instruments = JSON.parse(rawData);


const getExpiry = getUniqueExpiry("NIFTY", 1, instruments);
const idx = ["NIFTY", "BANKNIFTY"];
const idx_index = ['NSE_INDEX|Nifty 50','NSE_INDEX|Nifty Bank', 'NSE_INDEX|Nifty Fin Service', 'NSE_INDEX|NIFTY MID SELECT'];
const instrument_keys_part = idxsInstrumentsKey(idx, getExpiry, instruments);
const instrument_keys = [...idx_index, ...instrument_keys_part]

export default instrument_keys;
