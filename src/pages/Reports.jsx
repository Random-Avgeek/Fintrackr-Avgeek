import React, { useState, useEffect } from 'react';
import { useTransactionContext } from '../context/TransactionContext';
import { useTheme } from '../context/ThemeContext';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { formatCurrency } from '../utils/helpers';
import { Calendar, TrendingUp, PieChart, BarChart3 } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Reports = () => {
  const { 
    monthlySummary, 
    yearlySummary, 
    categoryBreakdown,
    fetchCategoryBreakdown 
  } = useTransactionContext();
  const { isDarkMode } = useTheme();

  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [reportType, setReportType] = useState('monthly');

  useEffect(() => {
    fetchCategoryBreakdown(dateRange);
  }, [dateRange]);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Monthly trend chart
  const monthlyChartData = {
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

  // Yearly comparison chart
  const yearlyChartData = {
    labels: yearlySummary.map(item => item.year.toString()),
    datasets: [
      {
        label: 'Income',
        data: yearlySummary.map(item => {
          const credit = item.summary.find(s => s.type === 'credit');
          return credit ? credit.total : 0;
        }),
        backgroundColor: 'rgba(34, 197, 94, 0.7)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 1,
      },
      {
        label: 'Expenses',
        data: yearlySummary.map(item => {
          const debit = item.summary.find(s => s.type === 'debit');
          return debit ? debit.total : 0;
        }),
        backgroundColor: 'rgba(239, 68, 68, 0.7)',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 1,
      }
    ]
  };

  // Category breakdown chart
  const expenseCategories = categoryBreakdown.filter(item => item.type === 'debit');
  const categoryChartData = {
    labels: expenseCategories.map(item => item.category),
    datasets: [{
      data: expenseCategories.map(item => item.total),
      backgroundColor: [
        'rgba(255, 99, 132, 0.7)',
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 206, 86, 0.7)',
        'rgba(75, 192, 192, 0.7)',
        'rgba(153, 102, 255, 0.7)',
        'rgba(255, 159, 64, 0.7)',
        'rgba(199, 199, 199, 0.7)',
        'rgba(83, 102, 255, 0.7)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(199, 199, 199, 1)',
        'rgba(83, 102, 255, 1)',
      ],
      borderWidth: 1,
    }],
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

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: isDarkMode ? '#d1d5db' : '#374151',
          boxWidth: 12,
          padding: 15,
        }
      },
      tooltip: {
        backgroundColor: isDarkMode ? '#374151' : '#ffffff',
        titleColor: isDarkMode ? '#f9fafb' : '#111827',
        bodyColor: isDarkMode ? '#d1d5db' : '#374151',
        borderColor: isDarkMode ? '#6b7280' : '#e5e7eb',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            return `${label}: ${formatCurrency(value)}`;
          }
        }
      }
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 transition-colors duration-300">
        Financial Reports & Analytics
      </h1>

      {/* Report Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6 transition-colors duration-300">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Report Type
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="input"
            >
              <option value="monthly">Monthly Trends</option>
              <option value="yearly">Yearly Comparison</option>
              <option value="category">Category Analysis</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
              className="input"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={() => fetchCategoryBreakdown(dateRange)}
              className="btn btn-primary w-full"
            >
              Update Report
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Chart Section */}
        {reportType === 'monthly' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transition-colors duration-300">
            <div className="flex items-center mb-4">
              <TrendingUp className="h-5 w-5 text-primary-600 dark:text-primary-400 mr-2" />
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Monthly Income vs Expenses</h2>
            </div>
            <div className="h-[400px]">
              <Line data={monthlyChartData} options={chartOptions} />
            </div>
          </div>
        )}

        {reportType === 'yearly' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transition-colors duration-300">
            <div className="flex items-center mb-4">
              <BarChart3 className="h-5 w-5 text-primary-600 dark:text-primary-400 mr-2" />
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Yearly Comparison</h2>
            </div>
            <div className="h-[400px]">
              <Bar data={yearlyChartData} options={chartOptions} />
            </div>
          </div>
        )}

        {reportType === 'category' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transition-colors duration-300">
              <div className="flex items-center mb-4">
                <PieChart className="h-5 w-5 text-primary-600 dark:text-primary-400 mr-2" />
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">Expense Distribution</h2>
              </div>
              <div className="h-[300px]">
                {expenseCategories.length > 0 ? (
                  <Doughnut data={categoryChartData} options={pieChartOptions} />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500 dark:text-gray-400">No expense data available</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transition-colors duration-300">
              <div className="flex items-center mb-4">
                <BarChart3 className="h-5 w-5 text-primary-600 dark:text-primary-400 mr-2" />
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">Category Breakdown</h2>
              </div>
              <div className="space-y-3">
                {expenseCategories.map((category, index) => (
                  <div key={category.category} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div 
                        className="w-4 h-4 rounded mr-3"
                        style={{ 
                          backgroundColor: categoryChartData.datasets[0].backgroundColor[index] 
                        }}
                      ></div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">{category.category}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatCurrency(category.total)}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {category.count} transactions
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Summary Tables */}
        {reportType === 'monthly' && (
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
        )}
      </div>
    </div>
  );
};

export default Reports;