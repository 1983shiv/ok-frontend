'use client';

import ATMPremiumAreaChart from '@/components/charts/ATMPremiumAreaChart';
import { useTheme } from '@/context/ThemeContext';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { setATMPremiumAnalysisFilters } from '@/redux/chartSlice';
import { Listbox } from '@headlessui/react';
import { ChevronUpDownIcon, CheckIcon } from '@heroicons/react/20/solid';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const ATMPremiumAnalysisPage = () => {
  const { theme } = useTheme();
  const { atmPremiumAnalysisData, atmPremiumAnalysisFilters } = useSelector((state: RootState) => state.chart);
  const dispatch = useDispatch();

  const handleFilterChange = (key: string, value: any) => {
    dispatch(setATMPremiumAnalysisFilters({ [key]: value }));
  };

  return (
    <div className="min-h-screen p-4" style={{ backgroundColor: theme.colors.background }}>
      <div className="max-w-7xl mx-auto">
        
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: theme.colors.text }}>
            At the Money Premium
          </h1>
        </div>

        {/* Filter Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 rounded-lg shadow" 
          style={{ 
            backgroundColor: theme.colors.card.bg,
            borderColor: theme.colors.card.border,
            borderWidth: '1px'
          }}>
          
          {/* Instrument Selector */}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: theme.colors.text }}>
              Instrument
            </label>
            <Listbox value={atmPremiumAnalysisFilters.symbol} onChange={(v) => handleFilterChange('symbol', v)}>
              <div className="relative">
                <Listbox.Button 
                  className="relative w-full cursor-default rounded-md py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none sm:text-sm border"
                  style={{
                    backgroundColor: theme.colors.card.bg,
                    borderColor: theme.colors.card.border,
                    color: theme.colors.text
                  }}
                >
                  <span className="block truncate">{atmPremiumAnalysisFilters.symbol}</span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronUpDownIcon className="h-5 w-5" style={{ color: theme.colors.text }} />
                  </span>
                </Listbox.Button>
                <Listbox.Options 
                  className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                  style={{
                    backgroundColor: theme.colors.card.bg,
                    borderColor: theme.colors.card.border
                  }}
                >
                  {atmPremiumAnalysisData.symbols.map((symbol) => (
                    <Listbox.Option
                      key={symbol}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-10 pr-4 ${
                          active ? 'opacity-75' : ''
                        }`
                      }
                      value={symbol}
                      style={{ color: theme.colors.text }}
                    >
                      {({ selected }) => (
                        <>
                          <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                            {symbol}
                          </span>
                          {selected && (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                              <CheckIcon className="h-5 w-5" style={{ color: theme.colors.accent }} />
                            </span>
                          )}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </div>
            </Listbox>
          </div>

          {/* Live Toggle */}
          <div className="flex items-center">
            <label 
              className="text-sm font-medium mr-3"
              style={{ color: theme.colors.text }}
            >
              Live
            </label>
            <div className="relative">
              <input
                type="checkbox"
                className="sr-only"
                checked={atmPremiumAnalysisFilters.isLive}
                onChange={(e) => handleFilterChange('isLive', e.target.checked)}
              />
              <div
                className={`w-11 h-6 rounded-full shadow-inner cursor-pointer transition-colors duration-300 ${
                  atmPremiumAnalysisFilters.isLive 
                    ? 'bg-blue-500' 
                    : 'bg-gray-400'
                }`}
                onClick={() => handleFilterChange('isLive', !atmPremiumAnalysisFilters.isLive)}
              >
                <div
                  className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 mt-1 ${
                    atmPremiumAnalysisFilters.isLive ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Expiry Date */}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: theme.colors.text }}>
              Expiry
            </label>
            <Listbox value={atmPremiumAnalysisFilters.expiry} onChange={(v) => handleFilterChange('expiry', v)}>
              <div className="relative">
                <Listbox.Button 
                  className="relative w-full cursor-default rounded-md py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none sm:text-sm border"
                  style={{
                    backgroundColor: theme.colors.card.bg,
                    borderColor: theme.colors.card.border,
                    color: theme.colors.text
                  }}
                >
                  <span className="block truncate">{atmPremiumAnalysisFilters.expiry}</span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronUpDownIcon className="h-5 w-5" style={{ color: theme.colors.text }} />
                  </span>
                </Listbox.Button>
                <Listbox.Options 
                  className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                  style={{
                    backgroundColor: theme.colors.card.bg,
                    borderColor: theme.colors.card.border
                  }}
                >
                  {atmPremiumAnalysisData.expiries.map((expiry) => (
                    <Listbox.Option
                      key={expiry}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-10 pr-4 ${
                          active ? 'opacity-75' : ''
                        }`
                      }
                      value={expiry}
                      style={{ color: theme.colors.text }}
                    >
                      {({ selected }) => (
                        <>
                          <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                            {expiry}
                          </span>
                          {selected && (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                              <CheckIcon className="h-5 w-5" style={{ color: theme.colors.accent }} />
                            </span>
                          )}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </div>
            </Listbox>
          </div>          {/* Historical Date */}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: theme.colors.text }}>
              Historical Date
            </label>
            <div 
              className="w-full rounded-md border"
              style={{
                backgroundColor: atmPremiumAnalysisFilters.isLive ? theme.colors.secondary : theme.colors.card.bg,
                borderColor: theme.colors.card.border,
                opacity: atmPremiumAnalysisFilters.isLive ? 0.5 : 1
              }}
            >              <DatePicker 
                selected={new Date(atmPremiumAnalysisFilters.historicalDate)}
                onChange={(date) => handleFilterChange('historicalDate', date?.toISOString().split('T')[0])}
                disabled={atmPremiumAnalysisFilters.isLive}
                className="w-full py-2 px-3 text-sm bg-transparent border-none focus:outline-none"
                dateFormat="dd/MM/yyyy"
              />
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="mb-6">
          <ATMPremiumAreaChart />
        </div>
      </div>
    </div>
  );
};

export default ATMPremiumAnalysisPage;
