"use client";

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { setCOIAnalysisFilters } from '@/redux/chartSlice';
import { Listbox } from '@headlessui/react';
import { ChevronUpDownIcon } from '@heroicons/react/20/solid';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useTheme } from '@/context/ThemeContext';

const COIAnalysisFilterBar: React.FC = () => {
  const dispatch = useDispatch();
  const { coiAnalysisData, coiAnalysisFilters } = useSelector((state: RootState) => state.chart);
  const { theme } = useTheme();

  const handleFilterChange = (key: string, value: any) => {
    dispatch(setCOIAnalysisFilters({ [key]: value }));
  };
  return (
    <div 
      className="p-4 rounded-lg shadow mb-6 border"
      style={{
        backgroundColor: theme.colors.card.bg,
        borderColor: theme.colors.card.border
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">        {/* Symbol Selector */}
        <div>
          <label 
            className="block text-sm font-medium mb-1"
            style={{ color: theme.colors.text }}
          >
            Symbol
          </label>
          <Listbox
            value={coiAnalysisFilters.symbol}
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
                <span className="block truncate">{coiAnalysisFilters.symbol}</span>
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
                {coiAnalysisData.symbols.map((symbol) => (
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
        </div>        {/* Expiry Selector */}
        <div>
          <label 
            className="block text-sm font-medium mb-1"
            style={{ color: theme.colors.text }}
          >
            Expiry
          </label>
          <Listbox
            value={coiAnalysisFilters.expiry}
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
                <span className="block truncate">{coiAnalysisFilters.expiry}</span>
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
                {coiAnalysisData.expiries.map((expiry) => (
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
        </div>        {/* Interval Selector */}
        <div>
          <label 
            className="block text-sm font-medium mb-1"
            style={{ color: theme.colors.text }}
          >
            Interval
          </label>
          <Listbox
            value={coiAnalysisFilters.interval}
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
                <span className="block truncate">{coiAnalysisFilters.interval}</span>
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
                {coiAnalysisData.intervals.map((interval) => (
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
        </div>        {/* Range Selector */}
        <div>
          <label 
            className="block text-sm font-medium mb-1"
            style={{ color: theme.colors.text }}
          >
            Range
          </label>
          <Listbox
            value={coiAnalysisFilters.range}
            onChange={(value) => handleFilterChange('range', value)}
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
                <span className="block truncate">{coiAnalysisFilters.range}</span>
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
                {coiAnalysisData.ranges.map((range) => (
                  <Listbox.Option
                    key={range}
                    value={range}
                    className="relative cursor-default select-none py-2 pl-3 pr-9 hover:opacity-80"
                    style={{ color: theme.colors.text }}
                  >
                    <span className="block truncate font-normal">{range}</span>
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </div>
          </Listbox>
        </div>{/* Live/Historical Toggle */}
        <div>
          <label 
            className="block text-sm font-medium mb-1"
            style={{ color: theme.colors.text }}
          >
            Data Type
          </label>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleFilterChange('isLive', true)}
              className="px-3 py-2 text-sm font-medium rounded-md border"
              style={{
                backgroundColor: coiAnalysisFilters.isLive ? theme.colors.button.bg : theme.colors.background,
                color: coiAnalysisFilters.isLive ? theme.colors.button.text : theme.colors.text,
                borderColor: theme.colors.card.border
              }}
            >
              Live
            </button>
            <button
              onClick={() => handleFilterChange('isLive', false)}
              className="px-3 py-2 text-sm font-medium rounded-md border"
              style={{
                backgroundColor: !coiAnalysisFilters.isLive ? theme.colors.button.bg : theme.colors.background,
                color: !coiAnalysisFilters.isLive ? theme.colors.button.text : theme.colors.text,
                borderColor: theme.colors.card.border
              }}
            >
              Historical
            </button>
          </div>
        </div>        {/* Historical Date Picker */}
        {!coiAnalysisFilters.isLive && (
          <div>
            <label 
              className="block text-sm font-medium mb-1"
              style={{ color: theme.colors.text }}
            >
              Date
            </label>            <DatePicker
              selected={new Date(coiAnalysisFilters.historicalDate)}
              onChange={(date) => handleFilterChange('historicalDate', date?.toISOString().split('T')[0])}
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1"
              dateFormat="dd/MM/yyyy"
              maxDate={new Date()}
              wrapperClassName="w-full"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default COIAnalysisFilterBar;
