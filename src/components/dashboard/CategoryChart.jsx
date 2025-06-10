import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useTheme } from '../../context/ThemeContext';
import { formatRupees } from '../../utils/helpers'; // <-- Add this import

ChartJS.register(ArcElement, Tooltip, Legend);

const CategoryChart = ({ transactions }) => {
  const { isDarkMode } = useTheme();
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [],
      borderColor: [],
      borderWidth: 1,
    }],
  });

  useEffect(() => {
    if (!transactions.length) return;

    // Get expenses only
    const expenses = transactions.filter(t => t.type === 'debit');
    
    // Group by category and calculate totals
    const categoryMap = {};
    expenses.forEach(expense => {
      if (!categoryMap[expense.category]) {
        categoryMap[expense.category] = 0;
      }
      categoryMap[expense.category] += expense.amount;
    });

    const categories = Object.keys(categoryMap);
    const amounts = Object.values(categoryMap);
    
    // Color palette
    const backgroundColors = [
      'rgba(255, 99, 132, 0.7)',
      'rgba(54, 162, 235, 0.7)',
      'rgba(255, 206, 86, 0.7)',
      'rgba(75, 192, 192, 0.7)',
      'rgba(153, 102, 255, 0.7)',
      'rgba(255, 159, 64, 0.7)',
    ];
    
    const borderColors = [
      'rgba(255, 99, 132, 1)',
      'rgba(54, 162, 235, 1)',
      'rgba(255, 206, 86, 1)',
      'rgba(75, 192, 192, 1)',
      'rgba(153, 102, 255, 1)',
      'rgba(255, 159, 64, 1)',
    ];

    setChartData({
      labels: categories,
      datasets: [{
        data: amounts,
        backgroundColor: backgroundColors.slice(0, categories.length),
        borderColor: borderColors.slice(0, categories.length),
        borderWidth: 1,
      }],
    });
  }, [transactions]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 12,
          padding: 15,
          font: {
            size: 11
          },
          color: isDarkMode ? '#d1d5db' : '#374151'
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
            return `${label}: ${formatRupees(value)}`; // <-- Use formatRupees here
          }
        }
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-card p-5 transition-colors duration-300">
      <h3 className="text-base font-medium text-gray-700 dark:text-gray-300 mb-4 transition-colors duration-300">Expense by Category</h3>
      <div className="h-60">
        {chartData.labels.length > 0 ? (
          <Pie 
            data={chartData}
            options={chartOptions}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 dark:text-gray-400 text-sm transition-colors duration-300">No expense data available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryChart;