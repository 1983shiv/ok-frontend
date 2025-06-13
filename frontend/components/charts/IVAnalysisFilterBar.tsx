"use client";

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { setIVAnalysisFilters } from '@/redux/chartSlice';
import { Listbox } from '@headlessui/react';
import { ChevronUpDownIcon } from '@heroicons/react/20/solid';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useTheme } from '@/context/ThemeContext';

const IVAnalysisFilterBar: React.FC = () => {
  const dispatch = useDispatch();
  const { ivAnalysisData, ivAnalysisFilters } = useSelector((state: RootState) => state.chart);
  const { theme } = useTheme();

  const handleFilterChange = (key: string, value: any) => {
    dispatch(setIVAnalysisFilters({ [key]: value }));
  };

  const intervals = ['1 Min', '3 Min', '5 Min', '15 Min', '30 Min', '1 Hour'];

  return (
    <div 
      className="p-4 rounded-lg shadow mb-6 border"
      style={{
        backgroundColor: theme.colors.card.bg,
        borderColor: theme.colors.card.border
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Symbol Selector */}
        <div>
          <label 
            className="block text-sm font-medium mb-1"
            style={{ color: theme.colors.text }}
          >
            Symbol
          </label>
          <Listbox
            value={ivAnalysisFilters.symbol}
            onChange={(value) => handleFilterChange('symbol', value)}
          >
            <div className="relative">
              <Listbox.Button 
                className="relative w-full cursor-default rounded-md py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none sm:text-sm border"
                style={{
                  backgroundColor: theme.colors.background,
                  color: theme.colors.text,
                  borderColor: theme.colors.card.border
                }}
              >
                <span className="block truncate">{ivAnalysisFilters.symbol}</span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon 
                    className="h-5 w-5" 
                    style={{ color: theme.colors.text }}
                    aria-hidden="true" 
                  />
                </span>
              </Listbox.Button>
              <Listbox.Options 
                className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                style={{
                  backgroundColor: theme.colors.card.bg,
                  color: theme.colors.text
                }}
              >
                {ivAnalysisData.symbols.map((symbol) => (
                  <Listbox.Option
                    key={symbol}
                    value={symbol}
                    className="relative cursor-default select-none py-2 pl-3 pr-9 hover:opacity-80"
                    style={{ color: theme.colors.text }}
                  >
                    <span className="block truncate font-normal">{symbol}</span>
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
            value={ivAnalysisFilters.expiry}
            onChange={(value) => handleFilterChange('expiry', value)}
          >
            <div className="relative">
              <Listbox.Button 
                className="relative w-full cursor-default rounded-md py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none sm:text-sm border"
                style={{
                  backgroundColor: theme.colors.background,
                  color: theme.colors.text,
                  borderColor: theme.colors.card.border
                }}
              >
                <span className="block truncate">{ivAnalysisFilters.expiry}</span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon 
                    className="h-5 w-5" 
                    style={{ color: theme.colors.text }}
                    aria-hidden="true" 
                  />
                </span>
              </Listbox.Button>
              <Listbox.Options 
                className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                style={{
                  backgroundColor: theme.colors.card.bg,
                  color: theme.colors.text
                }}
              >
                {ivAnalysisData.expiries.map((expiry) => (
                  <Listbox.Option
                    key={expiry}
                    value={expiry}
                    className="relative cursor-default select-none py-2 pl-3 pr-9 hover:opacity-80"
                    style={{ color: theme.colors.text }}
                  >
                    <span className="block truncate font-normal">{expiry}</span>
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </div>
          </Listbox>
        </div>

        {/* Strike Selector */}
        <div>
          <label 
            className="block text-sm font-medium mb-1"
            style={{ color: theme.colors.text }}
          >
            Strike
          </label>
          <Listbox
            value={ivAnalysisFilters.strike}
            onChange={(value) => handleFilterChange('strike', value)}
          >
            <div className="relative">
              <Listbox.Button 
                className="relative w-full cursor-default rounded-md py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none sm:text-sm border"
                style={{
                  backgroundColor: theme.colors.background,
                  color: theme.colors.text,
                  borderColor: theme.colors.card.border
                }}
              >
                <span className="block truncate">{ivAnalysisFilters.strike}</span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon 
                    className="h-5 w-5" 
                    style={{ color: theme.colors.text }}
                    aria-hidden="true" 
                  />
                </span>
              </Listbox.Button>
              <Listbox.Options 
                className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                style={{
                  backgroundColor: theme.colors.card.bg,
                  color: theme.colors.text
                }}
              >
                {ivAnalysisData.strikes.map((strike) => (
                  <Listbox.Option
                    key={strike}
                    value={strike}
                    className="relative cursor-default select-none py-2 pl-3 pr-9 hover:opacity-80"
                    style={{ color: theme.colors.text }}
                  >
                    <span className="block truncate font-normal">{strike}</span>
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </div>
          </Listbox>
        </div>

        {/* Interval Selector */}
        <div>
          <label 
            className="block text-sm font-medium mb-1"
            style={{ color: theme.colors.text }}
          >
            Interval
          </label>
          <Listbox
            value={ivAnalysisFilters.interval}
            onChange={(value) => handleFilterChange('interval', value)}
          >
            <div className="relative">
              <Listbox.Button 
                className="relative w-full cursor-default rounded-md py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none sm:text-sm border"
                style={{
                  backgroundColor: theme.colors.background,
                  color: theme.colors.text,
                  borderColor: theme.colors.card.border
                }}
              >
                <span className="block truncate">{ivAnalysisFilters.interval}</span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon 
                    className="h-5 w-5" 
                    style={{ color: theme.colors.text }}
                    aria-hidden="true" 
                  />
                </span>
              </Listbox.Button>
              <Listbox.Options 
                className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                style={{
                  backgroundColor: theme.colors.card.bg,
                  color: theme.colors.text
                }}
              >
                {intervals.map((interval) => (
                  <Listbox.Option
                    key={interval}
                    value={interval}
                    className="relative cursor-default select-none py-2 pl-3 pr-9 hover:opacity-80"
                    style={{ color: theme.colors.text }}
                  >
                    <span className="block truncate font-normal">{interval}</span>
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </div>
          </Listbox>
        </div>

        {/* Live/Historical Toggle */}
        <div>
          <label 
            className="block text-sm font-medium mb-1"
            style={{ color: theme.colors.text }}
          >
            Live
          </label>
          <div className="flex items-center h-10">
            <input
              type="checkbox"
              checked={ivAnalysisFilters.isLive}
              onChange={(e) => handleFilterChange('isLive', e.target.checked)}
              className="h-4 w-4 rounded focus:ring-2"
              style={{
                accentColor: theme.colors.accent,
              }}
            />
            <label 
              className="ml-2 text-sm"
              style={{ color: theme.colors.text }}
            >
              Enable Live Data
            </label>
          </div>
        </div>

        {/* Historical Date Picker */}
        {!ivAnalysisFilters.isLive && (
          <div>
            <label 
              className="block text-sm font-medium mb-1"
              style={{ color: theme.colors.text }}
            >
              Historical Date
            </label>            <DatePicker
              selected={new Date(ivAnalysisFilters.historicalDate)}
              onChange={(date) => 
                handleFilterChange('historicalDate', date?.toISOString().split('T')[0])
              }
              className="w-full py-2 px-3 border rounded-md text-sm focus:outline-none"
              dateFormat="MM/dd/yyyy"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default IVAnalysisFilterBar;
