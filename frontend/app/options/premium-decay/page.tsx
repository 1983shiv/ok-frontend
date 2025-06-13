'use client';

import PremiumDecayChart from '@/components/PremiumDecayChart';
import { useTheme } from '@/context/ThemeContext';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { setPremiumDecayFilters } from '@/redux/chartSlice';
import { Listbox } from '@headlessui/react';
import { ChevronUpDownIcon, CheckIcon } from '@heroicons/react/20/solid';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const PremiumDecayPage = () => {
  const { theme } = useTheme();
  const { premiumDecayData, premiumDecayFilters } = useSelector((state: RootState) => state.chart);
  const dispatch = useDispatch();

  const handleFilterChange = (key: string, value: any) => {
    dispatch(setPremiumDecayFilters({ [key]: value }));
  };

  return (    <div className="min-h-screen p-4" style={{ backgroundColor: theme.colors.background }}>
      <div className="max-w-7xl mx-auto">
        
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: theme.colors.text }}>
            Premium Decay Analysis
          </h1>
          <p className="text-sm md:text-base opacity-75" style={{ color: theme.colors.text }}>
            Track premium decay patterns and time value erosion for options contracts
          </p>
        </div>

        {/* Filter Bar */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6 p-4 rounded-lg shadow" 
          style={{ 
            backgroundColor: theme.colors.card.bg,
            borderColor: theme.colors.card.border,
            borderWidth: '1px'
          }}>
            {/* Symbol Selector */}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: theme.colors.text }}>
              Symbol
            </label>
            <Listbox value={premiumDecayFilters.symbol} onChange={(v) => handleFilterChange('symbol', v)}>
              <div className="relative">
                <Listbox.Button 
                  className="relative w-full cursor-default rounded-md py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none sm:text-sm border"
                  style={{
                    backgroundColor: theme.colors.background,
                    color: theme.colors.text,
                    borderColor: theme.colors.card.border,
                  }}
                >
                  <span className="block truncate">{premiumDecayFilters.symbol}</span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronUpDownIcon 
                      className="h-5 w-5" 
                      style={{ color: theme.colors.text }} 
                      aria-hidden="true" 
                    />
                  </span>
                </Listbox.Button>
                <Listbox.Options 
                  className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md py-1 text-base shadow-lg focus:outline-none sm:text-sm border"
                  style={{
                    backgroundColor: theme.colors.card.bg,
                    borderColor: theme.colors.card.border,
                  }}
                >
                  {premiumDecayData.symbols.map((symbol) => (
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
                          {selected && (
                            <span
                              className="absolute inset-y-0 right-0 flex items-center pr-4"
                              style={{ color: theme.colors.accent }}
                            >
                              <CheckIcon className="h-5 w-5" aria-hidden="true" />
                            </span>
                          )}
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
            <label className="block text-sm font-medium mb-1" style={{ color: theme.colors.text }}>
              Expiry
            </label>
            <Listbox value={premiumDecayFilters.expiry} onChange={(v) => handleFilterChange('expiry', v)}>
              <div className="relative">
                <Listbox.Button 
                  className="relative w-full cursor-default rounded-md py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none sm:text-sm border"
                  style={{
                    backgroundColor: theme.colors.background,
                    color: theme.colors.text,
                    borderColor: theme.colors.card.border,
                  }}
                >
                  <span className="block truncate">{premiumDecayFilters.expiry}</span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronUpDownIcon 
                      className="h-5 w-5" 
                      style={{ color: theme.colors.text }} 
                      aria-hidden="true" 
                    />
                  </span>
                </Listbox.Button>
                <Listbox.Options 
                  className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md py-1 text-base shadow-lg focus:outline-none sm:text-sm border"
                  style={{
                    backgroundColor: theme.colors.card.bg,
                    borderColor: theme.colors.card.border,
                  }}
                >
                  {premiumDecayData.expiries.map((expiry) => (
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
                          {selected && (
                            <span
                              className="absolute inset-y-0 right-0 flex items-center pr-4"
                              style={{ color: theme.colors.accent }}
                            >
                              <CheckIcon className="h-5 w-5" aria-hidden="true" />
                            </span>
                          )}
                        </div>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </div>
            </Listbox>
          </div>

          {/* Strike Count */}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: theme.colors.text }}>
              Strike Count
            </label>
            <input
              type="number"
              value={premiumDecayFilters.strikeCount}
              onChange={(e) => handleFilterChange('strikeCount', parseInt(e.target.value))}
              className="w-full rounded-md border p-2"
              style={{
                backgroundColor: theme.colors.background,
                color: theme.colors.text,
                borderColor: theme.colors.card.border
              }}
            />
          </div>

          {/* Range Start */}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: theme.colors.text }}>
              Range Start
            </label>
            <input
              type="number"
              value={premiumDecayFilters.rangeStart}
              onChange={(e) => handleFilterChange('rangeStart', parseFloat(e.target.value))}
              className="w-full rounded-md border p-2"
              style={{
                backgroundColor: theme.colors.background,
                color: theme.colors.text,
                borderColor: theme.colors.card.border
              }}
            />
          </div>

          {/* Range End */}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: theme.colors.text }}>
              Range End
            </label>
            <input
              type="number"
              value={premiumDecayFilters.rangeEnd}
              onChange={(e) => handleFilterChange('rangeEnd', parseFloat(e.target.value))}
              className="w-full rounded-md border p-2"
              style={{
                backgroundColor: theme.colors.background,
                color: theme.colors.text,
                borderColor: theme.colors.card.border
              }}
            />
          </div>

          {/* Live Toggle */}
          <div className="flex items-end">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={premiumDecayFilters.isLive}
                onChange={(e) => handleFilterChange('isLive', e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
                style={{
                  backgroundColor: premiumDecayFilters.isLive ? theme.colors.accent : theme.colors.background,
                  borderColor: theme.colors.card.border
                }}
              />
              <label className="ml-2 text-sm" style={{ color: theme.colors.text }}>
                Live Data
              </label>
            </div>
          </div>
        </div>

        {/* Historical Date Picker */}
        {!premiumDecayFilters.isLive && (
          <div className="mb-6 p-4 rounded-lg shadow" 
            style={{ 
              backgroundColor: theme.colors.card.bg,
              borderColor: theme.colors.card.border,
              borderWidth: '1px'
            }}>
            <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.text }}>
              Historical Date
            </label>            <DatePicker
              selected={new Date(premiumDecayFilters.historicalDate)}
              onChange={(date) => handleFilterChange('historicalDate', date?.toISOString().split('T')[0])}
              className="rounded-md border p-2 w-full"
              wrapperClassName="w-full"
            />
            <p className="text-sm mt-2" style={{ color: theme.colors.text }}>
              As of 15:30 Expiry {premiumDecayFilters.expiry}
            </p>
          </div>
        )}

        {/* Chart */}
        <PremiumDecayChart />        {/* Additional Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          {/* Total Premium Decay */}
          <div className="p-4 rounded-lg shadow" style={{ 
            backgroundColor: theme.colors.card.bg,
            borderColor: theme.colors.card.border,
            borderWidth: '1px'
          }}>
            <h4 className="text-sm font-medium mb-2" style={{ color: theme.colors.text }}>
              Total CE Decay
            </h4>
            <div className="text-xl font-bold" style={{ color: theme.colors.chart?.ce }}>
              ₹{Math.abs(premiumDecayData.premiumDecay[premiumDecayData.premiumDecay.length - 1]?.ceDecay || 0).toFixed(2)}
            </div>
            <div className="text-xs opacity-75 mt-1" style={{ color: theme.colors.text }}>
              Since market open
            </div>
          </div>

          {/* Total PE Decay */}
          <div className="p-4 rounded-lg shadow" style={{ 
            backgroundColor: theme.colors.card.bg,
            borderColor: theme.colors.card.border,
            borderWidth: '1px'
          }}>
            <h4 className="text-sm font-medium mb-2" style={{ color: theme.colors.text }}>
              Total PE Decay
            </h4>
            <div className="text-xl font-bold" style={{ color: theme.colors.chart?.pe }}>
              ₹{Math.abs(premiumDecayData.premiumDecay[premiumDecayData.premiumDecay.length - 1]?.peDecay || 0).toFixed(2)}
            </div>
            <div className="text-xs opacity-75 mt-1" style={{ color: theme.colors.text }}>
              Since market open
            </div>
          </div>

          {/* Decay Rate */}
          <div className="p-4 rounded-lg shadow" style={{ 
            backgroundColor: theme.colors.card.bg,
            borderColor: theme.colors.card.border,
            borderWidth: '1px'
          }}>
            <h4 className="text-sm font-medium mb-2" style={{ color: theme.colors.text }}>
              Avg Decay Rate
            </h4>
            <div className="text-xl font-bold" style={{ color: theme.colors.text }}>
              {(() => {
                const totalDecay = Math.abs((premiumDecayData.premiumDecay[premiumDecayData.premiumDecay.length - 1]?.ceDecay || 0) + 
                                          (premiumDecayData.premiumDecay[premiumDecayData.premiumDecay.length - 1]?.peDecay || 0));
                const timePoints = premiumDecayData.premiumDecay.length;
                return `₹${(totalDecay / timePoints).toFixed(2)}`;
              })()}
            </div>
            <div className="text-xs opacity-75 mt-1" style={{ color: theme.colors.text }}>
              Per time interval
            </div>
          </div>

          {/* Time to Expiry */}
          <div className="p-4 rounded-lg shadow" style={{ 
            backgroundColor: theme.colors.card.bg,
            borderColor: theme.colors.card.border,
            borderWidth: '1px'
          }}>
            <h4 className="text-sm font-medium mb-2" style={{ color: theme.colors.text }}>
              Time to Expiry
            </h4>
            <div className="text-xl font-bold" style={{ color: theme.colors.text }}>
              {(() => {
                const expiry = new Date(premiumDecayFilters.expiry.split('-').reverse().join('-'));
                const today = new Date();
                const diffTime = expiry.getTime() - today.getTime();
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                return `${Math.max(0, diffDays)}d`;
              })()}
            </div>
            <div className="text-xs opacity-75 mt-1" style={{ color: theme.colors.text }}>
              Days remaining
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumDecayPage;