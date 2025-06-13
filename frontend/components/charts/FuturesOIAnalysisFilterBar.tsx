'use client';

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { setFuturesOIAnalysisFilters } from '@/redux/chartSlice';
import { useTheme } from '@/context/ThemeContext';

interface FuturesOIAnalysisFilterBarProps {}

const FuturesOIAnalysisFilterBar: React.FC<FuturesOIAnalysisFilterBarProps> = () => {
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const { futuresOIAnalysisFilters, futuresOIAnalysisData } = useSelector((state: RootState) => state.chart);

  const buildTypes = [
    { key: 'Full Data', label: 'Full Data', color: '#e0e0e0' },
    { key: 'Long Build', label: 'Long Build', color: '#4caf50' },
    { key: 'Short Build', label: 'Short Build', color: '#f44336' },
    { key: 'Long Unwinding', label: 'Long Unwinding', color: '#ff9800' },
    { key: 'Short Covering', label: 'Short Covering', color: '#2196f3' }
  ];

  const intervals = futuresOIAnalysisData.intervals;

  const getBuildTypeColor = (buildType: string) => {
    const type = buildTypes.find(t => t.key === buildType);
    return type ? type.color : '#e0e0e0';
  };

  const handleFilterChange = (key: string, value: any) => {
    dispatch(setFuturesOIAnalysisFilters({
      ...futuresOIAnalysisFilters,
      [key]: value
    }));
  };  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm" style={{
      backgroundColor: theme.colors.card.bg,
      border: `1px solid ${theme.colors.card.border}`
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        padding: '16px 20px',
        flexWrap: 'wrap'
      }}>
        {/* Build Type Buttons */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <span style={{ 
          color: theme.colors.accent, 
          fontSize: '14px',
          minWidth: 'fit-content'
        }}>
          Build Type:
        </span>
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {buildTypes.map((buildType) => (
            <button
              key={buildType.key}              onClick={() => handleFilterChange('build', buildType.key)}
              style={{
                padding: '6px 12px',
                borderRadius: '4px',
                border: 'none',
                fontSize: '12px',
                fontWeight: '500',
                cursor: 'pointer',
                backgroundColor: futuresOIAnalysisFilters.build === buildType.key 
                  ? buildType.color 
                  : theme.colors.card.bg,
                color: futuresOIAnalysisFilters.build === buildType.key 
                  ? '#ffffff' 
                  : theme.colors.text,
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => {
                if (futuresOIAnalysisFilters.build !== buildType.key) {
                  e.currentTarget.style.backgroundColor = theme.colors.card.border;
                }
              }}
              onMouseLeave={(e) => {
                if (futuresOIAnalysisFilters.build !== buildType.key) {
                  e.currentTarget.style.backgroundColor = theme.colors.card.bg;
                }
              }}
            >
              {buildType.label}
            </button>
          ))}
        </div>
      </div>

      {/* Symbol Selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ 
          color: theme.colors.secondary, 
          fontSize: '14px',
          minWidth: 'fit-content'
        }}>
          Symbol:
        </span>
        <select
          value={futuresOIAnalysisFilters.symbol}
          onChange={(e) => handleFilterChange('symbol', e.target.value)}          style={{
            padding: '6px 12px',
            borderRadius: '4px',
            border: `1px solid ${theme.colors.card.border}`,
            backgroundColor: theme.colors.card.bg,
            color: theme.colors.text,
            fontSize: '14px',
            cursor: 'pointer',
            minWidth: '120px'
          }}        >
          {futuresOIAnalysisData.symbols.map((symbol) => (
            <option key={symbol} value={symbol}>
              {symbol}
            </option>
          ))}
        </select>
      </div>

      {/* Interval Selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ 
          color: theme.colors.secondary, 
          fontSize: '14px',
          minWidth: 'fit-content'
        }}>
          Interval:
        </span>
        <select
          value={futuresOIAnalysisFilters.interval}
          onChange={(e) => handleFilterChange('interval', e.target.value)}          style={{
            padding: '6px 12px',
            borderRadius: '4px',
            border: `1px solid ${theme.colors.card.border}`,
            backgroundColor: theme.colors.card.bg,
            color: theme.colors.text,
            fontSize: '14px',
            cursor: 'pointer',
            minWidth: '80px'
          }}
        >
          {intervals.map((interval) => (
            <option key={interval} value={interval}>
              {interval}
            </option>
          ))}
        </select>
      </div>

      {/* Live/Historical Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}>
        <span style={{ 
          color: theme.colors.secondary, 
          fontSize: '14px',
          minWidth: 'fit-content'
        }}>
          Mode:
        </span>        <div style={{ display: 'flex', border: `1px solid ${theme.colors.card.border}`, borderRadius: '4px', overflow: 'hidden' }}>
          <button
            onClick={() => handleFilterChange('isLive', true)}
            style={{
              padding: '6px 12px',
              border: 'none',
              fontSize: '14px',
              cursor: 'pointer',
              backgroundColor: futuresOIAnalysisFilters.isLive ? theme.colors.primary : theme.colors.card.bg,
              color: futuresOIAnalysisFilters.isLive ? theme.colors.accent : theme.colors.text,
              transition: 'all 0.2s ease'
            }}
          >
            Live
          </button>
          <button
            onClick={() => handleFilterChange('isLive', false)}
            style={{
              padding: '6px 12px',
              border: 'none',
              fontSize: '14px',
              cursor: 'pointer',
              // theme: theme.name.includes('Light') ? 'light' : 'dark',
              backgroundColor: !futuresOIAnalysisFilters.isLive ? theme.colors.primary : theme.colors.card.bg,
              color: !futuresOIAnalysisFilters.isLive ? theme.colors.accent : theme.colors.text,
              transition: 'all 0.2s ease'
            }}
          >
            Historical
          </button>
        </div>
        
        {/* Date Picker for Historical Mode */}
        {!futuresOIAnalysisFilters.isLive && (
          <input
            type="date"
            value={futuresOIAnalysisFilters.historicalDate}
            onChange={(e) => handleFilterChange('historicalDate', e.target.value)}
            style={{
              padding: '6px 12px',
              borderRadius: '4px',
              border: `1px solid ${theme.colors.card.border}`,
              backgroundColor: theme.colors.card.bg,
              color: theme.colors.text,
              fontSize: '14px',
              cursor: 'pointer'
            }}
          />        )}
      </div>
      </div>
    </div>
  );
};

export default FuturesOIAnalysisFilterBar;