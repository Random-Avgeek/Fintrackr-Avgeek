import React from 'react';
import { useTransactionContext } from '../context/TransactionContext';
import { useTheme } from '../context/ThemeContext';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { formatCurrency } from '../utils/helpers';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Reports = () => {
  const { monthlySummary } = useTransactionContext();
  const { isDarkMode } = useTheme();

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const chartData = {
    labels: monthlySummary.map(item => `${months[item.month - 1]} ${item.year}`),
    datasets: [
      {
        label: 'Income',
        data: monthlySummary.map(item => {
          const credit = item.summary.find(s => s.type === 'credit');
          return credit ? credit.total : 0;
        }),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        tension: 0.4,
      },
      {
        label: 'Expenses',
        data: monthlySummary.map(item => {
          const debit = item.summary.find(s => s.type === 'debit');
          return debit ? debit.total : 0;
        }),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        tension: 0.4,
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
        text: 'Monthly Income vs Expenses',
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
          callback: (value) => formatCurrency(value),
          color: isDarkMode ? '#9ca3af' : '#6b7280'
        },
        grid: {
          color: isDarkMode ? '#374151' : '#e5e7eb'
        }
      },
    },
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 transition-colors duration-300">Financial Reports</h1>

      <div className="grid gap-6">
        {/* Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transition-colors duration-300">
          <div className="h-[400px]">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Monthly Summary Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden transition-colors duration-300">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white transition-colors duration-300">Monthly Summary</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700 transition-colors duration-300">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-300">
                    Month
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-300">
                    Income
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-300">
                    Expenses
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-300">
                    Net
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-300">
                {monthlySummary.map((item, index) => {
                  const credit = item.summary.find(s => s.type === 'credit')?.total || 0;
                  const debit = item.summary.find(s => s.type === 'debit')?.total || 0;
                  const net = credit - debit;

                  return (
                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200 transition-colors duration-300">
                        {months[item.month - 1]} {item.year}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-success-600 dark:text-success-400 transition-colors duration-300">
                        {formatCurrency(credit)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-danger-600 dark:text-danger-400 transition-colors duration-300">
                        {formatCurrency(debit)}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium transition-colors duration-300 ${
                        net >= 0 
                          ? 'text-success-600 dark:text-success-400' 
                          : 'text-danger-600 dark:text-danger-400'
                      }`}>
                        {formatCurrency(net)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;