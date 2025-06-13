'use client';

import React from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';
import { useTheme } from '@/context/ThemeContext';

interface ChartPanelProps {
  type: 'changeInOI' | 'totalOI' | 'strikeOI';
  title: string;
  height?: number;
}

declare global {
  interface Window {
    ApexCharts?: any;
  }
}



const ChartPanel: React.FC<ChartPanelProps> = ({ type, title, height = 350 }) => {
  const { chartData, filters } = useSelector((state: RootState) => state.chart);
  const { theme } = useTheme();

  const getChartOptions = (): ApexOptions => {
    
    const commonOptions: ApexOptions = {
      chart: {
        type: 'bar',
        height: height,
        toolbar: {
          show: true,
          tools: {
            download: true,
            selection: true,
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
            reset: true,
          },
        },
        background: theme.colors.card.bg,
        foreColor: theme.colors.text,
      },
      grid: {
        borderColor: theme.colors.card.border,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '80%',
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent'],
      },
      xaxis: {
        categories: chartData.changeInOI.CE.map(item => item.strikePrice),
        title: {
          text: 'Strike Price',
          style: {
            color: theme.colors.text,
          },
        },
        labels: {
          style: {
            colors: theme.colors.text,
          },
        },
        axisBorder: {
          show: true,
          color: theme.colors.card.border,
        },
        axisTicks: {
          color: theme.colors.card.border,
        },
      },
      yaxis: {
        title: {
          text: 'Open Interest',
          style: {
            color: theme.colors.text,
          },
        },
        labels: {
          style: {
            colors: theme.colors.text,
          },
          formatter: (value) => {
            if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
            if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
            return value.toString();
          },
        },
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        theme: theme.name.includes('Light') ? 'light' : 'dark',
        y: {
          formatter: (value) => {
            if (value >= 1000000) return `${(value / 1000000).toFixed(2)}M`;
            if (value >= 1000) return `${(value / 1000).toFixed(2)}K`;
            return value.toString();
          },
        },
      },
      legend: {
        labels: {
          colors: theme.colors.text,
        },
      },
    };

    if (type === 'changeInOI') {
      return {
        ...commonOptions,
        title: {
          text: title,
          align: 'center',
          style: {
            fontSize: '16px',
            fontWeight: 'bold',
            color: theme.colors.text,
          },
        },
        series: [
          {
            name: 'CE',
            data: chartData.changeInOI.CE.map(item => item.value),
            color: theme.colors.chart?.ce || '#008FFB',
          },
          {
            name: 'PE',
            data: chartData.changeInOI.PE.map(item => item.value),
            color: theme.colors.chart?.pe || '#FF4560',
          },
        ],
      };
    } else if (type === 'totalOI') {
      return {
        ...commonOptions,
        chart: {
          ...commonOptions.chart,
          type: 'pie',
        },
        title: {
          text: title,
          align: 'center',
          style: {
            fontSize: '16px',
            fontWeight: 'bold',
            color: theme.colors.text,
          },
        },
        series: [chartData.totalOI.CE, chartData.totalOI.PE],
        labels: ['CE', 'PE'],
        colors: [theme.colors.chart?.ce || '#008FFB', theme.colors.chart?.pe || '#FF4560'],
      };
    } else {
      return {
        ...commonOptions,
        title: {
          text: title,
          align: 'center',
          style: {
            fontSize: '16px',
            fontWeight: 'bold',
            color: theme.colors.text,
          },
        },
        series: [
          {
            name: 'CE',
            data: chartData.strikeOI.CE.map(item => item.value),
            color: theme.colors.chart?.ce || '#008FFB',
          },
          {
            name: 'PE',
            data: chartData.strikeOI.PE.map(item => item.value),
            color: theme.colors.chart?.pe || '#FF4560',
          },
        ],
      };
    }
  };

  return (
    <div 
      className="rounded-lg shadow p-4"
      style={{
        backgroundColor: theme.colors.card.bg,
        borderColor: theme.colors.card.border,
        borderWidth: '1px',
      }}
    >
      <Chart
        options={getChartOptions()}
        series={getChartOptions().series as any}
        type={type === 'totalOI' ? 'pie' : 'bar'}
        height={height}
      />
    </div>
  );
};

export default ChartPanel;