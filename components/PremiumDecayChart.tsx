'use client';

import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';
import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';
import { useTheme } from '@/context/ThemeContext';
import React, { useState, useEffect } from 'react';

// Dynamically import Chart component with SSR disabled
const Chart = dynamic(() => import('react-apexcharts'), { 
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-96 rounded-lg" style={{ backgroundColor: 'transparent' }}>
      <div className="text-center">
        <div className="animate-pulse">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-300 rounded-full"></div>
          <div className="text-lg font-medium text-gray-600">Loading chart...</div>
        </div>
      </div>
    </div>
  )
});

const PremiumDecayChart = () => {
  const { premiumDecayData, premiumDecayFilters } = useSelector((state: RootState) => state.chart);
  const { theme } = useTheme();  
  const options: ApexOptions = {
    chart: {
      type: 'area',
      height: 420,
      animations: { 
        enabled: true,
        speed: 800
      },
      background: theme.colors.card.bg,
      foreColor: theme.colors.text,
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: false,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true,
        }
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        type: 'vertical',
        gradientToColors: undefined,
        stops: [0, 90, 100]
      },
      opacity: 0.6
    },
    grid: {
      show: true,
      borderColor: theme.colors.card.border,
      strokeDashArray: 3
    },
    xaxis: {
      categories: premiumDecayData.premiumDecay.map(item => item.time),
      title: {
        text: 'Time',
        style: { 
          color: theme.colors.text,
          fontSize: '12px'
        }
      },
      labels: { 
        style: { 
          colors: theme.colors.text,
          fontSize: '11px'
        }
      },
      axisBorder: {
        show: true,
        color: theme.colors.card.border
      }
    },
    yaxis: {
      title: { 
        text: 'Premium Value (₹)', 
        style: { 
          color: theme.colors.text,
          fontSize: '12px'
        }
      },
      labels: { 
        style: { 
          colors: theme.colors.text,
          fontSize: '11px'
        },
        formatter: (value) => `₹${value.toFixed(1)}`
      }
    },
    colors: [
      theme.colors.chart?.ce || '#3b82f6',
      theme.colors.chart?.pe || '#ef4444'
    ],
    legend: { 
      show: true,
      position: 'top',
      horizontalAlign: 'center',
      labels: { 
        colors: theme.colors.text
      }
    },
    tooltip: { 
      theme: theme.name.includes('Light') ? 'light' : 'dark',
      shared: true,
      intersect: false,
      y: {
        formatter: (value) => {
          return `₹${value.toFixed(2)}`;
        }
      }
    }
  };  const series = [
    {
      name: 'CE Premium',
      data: premiumDecayData.premiumDecay.map(item => item.cePremium)
    },
    {
      name: 'PE Premium',
      data: premiumDecayData.premiumDecay.map(item => item.pePremium)
    }
  ];

  return (
    <div className="rounded-lg shadow-lg" style={{ 
      backgroundColor: theme.colors.card.bg,
      borderColor: theme.colors.card.border,
      borderWidth: '1px',
      padding: '20px'
    }}>
      {/* Chart Title */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-1" style={{ color: theme.colors.text }}>
          Premium Decay Analysis
        </h3>
        <p className="text-sm opacity-75" style={{ color: theme.colors.text }}>
          Real-time premium decay tracking for {premiumDecayFilters.symbol} - {premiumDecayFilters.expiry}
        </p>
      </div>      <div style={{ width: '100%', height: '420px' }}>
        {typeof window !== 'undefined' && (
          <Chart 
            options={options} 
            series={series} 
            type="area" 
            height={420} 
            width="100%"
          />
        )}
      </div>
      
      {/* Chart Footer Info */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div className="text-center p-2 rounded" style={{ backgroundColor: theme.colors.background }}>
          <div style={{ color: theme.colors.chart?.ce }} className="font-medium">CE Premium</div>
          <div style={{ color: theme.colors.text }}>
            ₹{premiumDecayData.premiumDecay[premiumDecayData.premiumDecay.length - 1]?.cePremium.toFixed(2)}
          </div>
        </div>
        <div className="text-center p-2 rounded" style={{ backgroundColor: theme.colors.background }}>
          <div style={{ color: theme.colors.chart?.pe }} className="font-medium">PE Premium</div>
          <div style={{ color: theme.colors.text }}>
            ₹{premiumDecayData.premiumDecay[premiumDecayData.premiumDecay.length - 1]?.pePremium.toFixed(2)}
          </div>
        </div>
        <div className="text-center p-2 rounded" style={{ backgroundColor: theme.colors.background }}>
          <div style={{ color: theme.colors.chart?.ce }} className="font-medium">CE Decay</div>
          <div style={{ color: theme.colors.text }}>
            ₹{Math.abs(premiumDecayData.premiumDecay[premiumDecayData.premiumDecay.length - 1]?.ceDecay || 0).toFixed(2)}
          </div>
        </div>
        <div className="text-center p-2 rounded" style={{ backgroundColor: theme.colors.background }}>
          <div style={{ color: theme.colors.chart?.pe }} className="font-medium">PE Decay</div>
          <div style={{ color: theme.colors.text }}>
            ₹{Math.abs(premiumDecayData.premiumDecay[premiumDecayData.premiumDecay.length - 1]?.peDecay || 0).toFixed(2)}
          </div>
        </div>      </div>
    </div>
  );
};

export default PremiumDecayChart;