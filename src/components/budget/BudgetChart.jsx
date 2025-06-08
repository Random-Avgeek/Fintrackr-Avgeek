import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { useTheme } from '../../context/ThemeContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BudgetChart = ({ data }) => {
  const { isDarkMode } = useTheme();

  const chartData = {
    labels: data.map(item => item.category),
    datasets: [
      {
        label: 'Budgeted',
        data: data.map(item => item.budgeted),
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
      {
        label: 'Actual',
        data: data.map(item => item.actual),
        backgroundColor: data.map(item => {
          switch (item.status) {
            case 'over':
              return 'rgba(239, 68, 68, 0.7)';
            case 'warning':
              return 'rgba(245, 158, 11, 0.7)';
            default:
              return 'rgba(34, 197, 94, 0.7)';
          }
        }),
        borderColor: data.map(item => {
          switch (item.status) {
            case 'over':
              return 'rgba(239, 68, 68, 1)';
            case 'warning':
              return 'rgba(245, 158, 11, 1)';
            default:
              return 'rgba(34, 197, 94, 1)';
          }
        }),
        borderWidth: 1,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: isDarkMode ? '#d1d5db' : '#374151'
        }
      },
      title: {
        display: true,
        text: 'Budget vs Actual Spending',
        font: {
          size: 16,
        },
        color: isDarkMode ? '#f9fafb' : '#111827'
      },
      tooltip: {
        backgroundColor: isDarkMode ? '#374151' : '#ffffff',
        titleColor: isDarkMode ? '#f9fafb' : '#111827',
        bodyColor: isDarkMode ? '#d1d5db' : '#374151',
        borderColor: isDarkMode ? '#6b7280' : '#e5e7eb',
        borderWidth: 1,
        callbacks: {
          afterBody: function(context) {
            const dataIndex = context[0].dataIndex;
            const item = data[dataIndex];
            return [
              `Remaining: $${item.remaining.toFixed(2)}`,
              `Progress: ${item.percentage.toFixed(1)}%`
            ];
          }
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: isDarkMode ? '#9ca3af' : '#6b7280'
        },
        grid: {
          color: isDarkMode ? '#374151' : '#e5e7eb'
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `$${value}`,
          color: isDarkMode ? '#9ca3af' : '#6b7280'
        },
        grid: {
          color: isDarkMode ? '#374151' : '#e5e7eb'
        }
      },
    },
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-card p-6 transition-colors duration-300">
      <div className="h-[400px]">
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default BudgetChart;