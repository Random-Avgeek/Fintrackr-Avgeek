import React from 'react';
import { useTransactionContext } from '../context/TransactionContext';
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
      },
      title: {
        display: true,
        text: 'Monthly Income vs Expenses',
        font: {
          size: 16,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => formatCurrency(value),
        },
      },
    },
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Financial Reports</h1>

      <div className="grid gap-6">
        {/* Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="h-[400px]">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Monthly Summary Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Monthly Summary</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Month
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Income
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expenses
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Net
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {monthlySummary.map((item, index) => {
                  const credit = item.summary.find(s => s.type === 'credit')?.total || 0;
                  const debit = item.summary.find(s => s.type === 'debit')?.total || 0;
                  const net = credit - debit;

                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {months[item.month - 1]} {item.year}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-success-600">
                        {formatCurrency(credit)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-danger-600">
                        {formatCurrency(debit)}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${
                        net >= 0 ? 'text-success-600' : 'text-danger-600'
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