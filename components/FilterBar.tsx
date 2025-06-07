'use client';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { setFilters } from '@/redux/chartSlice';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Listbox } from '@headlessui/react';
import { ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { useTheme } from '@/context/ThemeContext';

const FilterBar: React.FC = () => {
  const dispatch = useDispatch();
  const { chartData, filters } = useSelector((state: RootState) => state.chart);
  const { theme } = useTheme();

  const handleFilterChange = (key: string, value: any) => {
    dispatch(setFilters({ [key]: value }));
  };

  return (
    <div 
      className="p-4 rounded-lg shadow mb-6"
      style={{
        backgroundColor: theme.colors.card.bg,
        borderColor: theme.colors.card.border,
        borderWidth: '1px',
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4">
        {/* Symbol Selector */}
        <div>
          <label 
            className="block text-sm font-medium mb-1"
            style={{ color: theme.colors.text }}
          >
            Symbol
          </label>
          <Listbox
            value={filters.symbol}
            onChange={(value) => handleFilterChange('symbol', value)}
          >
            <div className="relative">
              <Listbox.Button 
                className="relative w-full cursor-default rounded-md py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none sm:text-sm border"
                style={{
                  backgroundColor: theme.colors.background,
                  color: theme.colors.text,
                  borderColor: theme.colors.card.border,
                }}
              >
                <span className="block truncate">{filters.symbol}</span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon 
                    className="h-5 w-5" 
                    style={{ color: theme.colors.text }} 
                    aria-hidden="true" 
                  />
                </span>
              </Listbox.Button>
              <Listbox.Options 
                className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md py-1 text-base shadow-lg focus:outline-none sm:text-sm"
                style={{
                  backgroundColor: theme.colors.card.bg,
                  borderColor: theme.colors.card.border,
                }}
              >
                {chartData.symbols.map((symbol) => (
                  <Listbox.Option
                    key={symbol}
                    value={symbol}
                  >
                    {({ active, selected }) => (
                      <div
                        className={`relative cursor-default select-none py-2 pl-3 pr-9 ${
                          active ? 'opacity-80' : ''
                        }`}
                        style={{
                          backgroundColor: active ? theme.colors.accent : theme.colors.card.bg,
                          color: theme.colors.text,
                        }}
                      >
                        <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                          {symbol}
                        </span>
                      </div>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </div>
          </Listbox>
        </div>

        {/* Expiry Selector */}
        <div>
          <label 
            className="block text-sm font-medium mb-1"
            style={{ color: theme.colors.text }}
          >
            Expiry
          </label>
          <Listbox
            value={filters.expiry}
            onChange={(value) => handleFilterChange('expiry', value)}
          >
            <div className="relative">
              <Listbox.Button 
                className="relative w-full cursor-default rounded-md py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none sm:text-sm border"
                style={{
                  backgroundColor: theme.colors.background,
                  color: theme.colors.text,
                  borderColor: theme.colors.card.border,
                }}
              >
                <span className="block truncate">{filters.expiry}</span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon 
                    className="h-5 w-5" 
                    style={{ color: theme.colors.text }} 
                    aria-hidden="true" 
                  />
                </span>
              </Listbox.Button>
              <Listbox.Options 
                className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md py-1 text-base shadow-lg focus:outline-none sm:text-sm"
                style={{
                  backgroundColor: theme.colors.card.bg,
                  borderColor: theme.colors.card.border,
                }}
              >
                {chartData.expiries.map((expiry) => (
                  <Listbox.Option
                    key={expiry}
                    value={expiry}
                  >
                    {({ active, selected }) => (
                      <div
                        className={`relative cursor-default select-none py-2 pl-3 pr-9 ${
                          active ? 'opacity-80' : ''
                        }`}
                        style={{
                          backgroundColor: active ? theme.colors.accent : theme.colors.card.bg,
                          color: theme.colors.text,
                        }}
                      >
                        <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                          {expiry}
                        </span>
                      </div>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </div>
          </Listbox>
        </div>

        {/* Strike Count Selector */}
        <div>
          <label 
            className="block text-sm font-medium mb-1"
            style={{ color: theme.colors.text }}
          >
            Strike Count
          </label>
          <Listbox
            value={filters.strikeCount}
            onChange={(value) => handleFilterChange('strikeCount', value)}
          >
            <div className="relative">
              <Listbox.Button 
                className="relative w-full cursor-default rounded-md py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none sm:text-sm border"
                style={{
                  backgroundColor: theme.colors.background,
                  color: theme.colors.text,
                  borderColor: theme.colors.card.border,
                }}
              >
                <span className="block truncate">{filters.strikeCount}</span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon 
                    className="h-5 w-5" 
                    style={{ color: theme.colors.text }} 
                    aria-hidden="true" 
                  />
                </span>
              </Listbox.Button>
              <Listbox.Options 
                className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md py-1 text-base shadow-lg focus:outline-none sm:text-sm"
                style={{
                  backgroundColor: theme.colors.card.bg,
                  borderColor: theme.colors.card.border,
                }}
              >
                {chartData.strikeCounts.map((count) => (
                  <Listbox.Option
                    key={count}
                    value={count}
                  >
                    {({ active, selected }) => (
                      <div
                        className={`relative cursor-default select-none py-2 pl-3 pr-9 ${
                          active ? 'opacity-80' : ''
                        }`}
                        style={{
                          backgroundColor: active ? theme.colors.accent : theme.colors.card.bg,
                          color: theme.colors.text,
                        }}
                      >
                        <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                          {count}
                        </span>
                      </div>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </div>
          </Listbox>
        </div>

        {/* Duration Selector */}
        <div>
          <label 
            className="block text-sm font-medium mb-1"
            style={{ color: theme.colors.text }}
          >
            Duration
          </label>
          <Listbox
            value={filters.duration}
            onChange={(value) => handleFilterChange('duration', value)}
          >
            <div className="relative">
              <Listbox.Button 
                className="relative w-full cursor-default rounded-md py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none sm:text-sm border"
                style={{
                  backgroundColor: theme.colors.background,
                  color: theme.colors.text,
                  borderColor: theme.colors.card.border,
                }}
              >
                <span className="block truncate">{filters.duration}</span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon 
                    className="h-5 w-5" 
                    style={{ color: theme.colors.text }} 
                    aria-hidden="true" 
                  />
                </span>
              </Listbox.Button>
              <Listbox.Options 
                className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md py-1 text-base shadow-lg focus:outline-none sm:text-sm"
                style={{
                  backgroundColor: theme.colors.card.bg,
                  borderColor: theme.colors.card.border,
                }}
              >
                {chartData.durations.map((duration) => (
                  <Listbox.Option
                    key={duration}
                    value={duration}
                  >
                    {({ active, selected }) => (
                      <div
                        className={`relative cursor-default select-none py-2 pl-3 pr-9 ${
                          active ? 'opacity-80' : ''
                        }`}
                        style={{
                          backgroundColor: active ? theme.colors.accent : theme.colors.card.bg,
                          color: theme.colors.text,
                        }}
                      >
                        <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                          {duration}
                        </span>
                      </div>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </div>
          </Listbox>
        </div>

        {/* Live Data Toggle */}
        <div className="flex items-center">
          <div className="flex items-center h-5">
            <input
              id="live-data"
              name="live-data"
              type="checkbox"
              checked={filters.isLive}
              onChange={(e) => handleFilterChange('isLive', e.target.checked)}
              className="focus:ring-primary-500 h-4 w-4 border-gray-300 rounded"
              style={{
                backgroundColor: theme.colors.background,
                borderColor: theme.colors.card.border,
                color: theme.colors.accent,
              }}
            />
          </div>
          <div className="ml-3 text-sm">
            <label 
              htmlFor="live-data" 
              className="font-medium"
              style={{ color: theme.colors.text }}
            >
              Live Data
            </label>
          </div>
        </div>

        {/* Historical Date Picker */}
        <div>
          <label 
            className="block text-sm font-medium mb-1"
            style={{ color: theme.colors.text }}
          >
            Historical Date
          </label>
          <DatePicker
            selected={new Date(filters.historicalDate)}
            onChange={(date) => handleFilterChange('historicalDate', date?.toISOString().split('T')[0])}
            className="w-full rounded-md shadow-sm py-2 px-3 focus:outline-none sm:text-sm border"
            disabled={filters.isLive}
          />
        </div>

        {/* Time Range Slider */}
        <div>
          <label 
            className="block text-sm font-medium mb-1"
            style={{ color: theme.colors.text }}
          >
            Time Range: {filters.timeRange[0]}% - {filters.timeRange[1]}%
          </label>
          <div className="flex space-x-2">
            <input
              type="range"
              min="0"
              max="100"
              value={filters.timeRange[0]}
              onChange={(e) =>
                handleFilterChange('timeRange', [parseInt(e.target.value), filters.timeRange[1]])
              }
              className="w-full"
              style={{
                accentColor: theme.colors.accent,
              }}
            />
            <input
              type="range"
              min="0"
              max="100"
              value={filters.timeRange[1]}
              onChange={(e) =>
                handleFilterChange('timeRange', [filters.timeRange[0], parseInt(e.target.value)])
              }
              className="w-full"
              style={{
                accentColor: theme.colors.accent,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;