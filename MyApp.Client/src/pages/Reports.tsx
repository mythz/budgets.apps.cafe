import { useEffect, useState } from 'react'
import { getAllTransactions } from '../lib/storage'
import { exportData } from '../lib/storage'
import {
  calculateMonthlySummary,
  formatCurrency,
  getPastMonths,
  getMonthName,
} from '../lib/utils'
import type { Transaction, MonthlySummary } from '../types/budget'

export default function Reports() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMonths, setSelectedMonths] = useState(6)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      const allTransactions = await getAllTransactions()
      setTransactions(allTransactions)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleExport() {
    try {
      const data = await exportData()
      const blob = new Blob([data], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `budget-export-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error exporting data:', error)
      alert('Failed to export data')
    }
  }

  async function handleExportCSV() {
    try {
      const sortedTransactions = [...transactions].sort((a, b) => b.date.localeCompare(a.date))
      
      const csvHeader = 'Date,Type,Category,Amount,Description\n'
      const csvRows = sortedTransactions
        .map(
          (t) =>
            `${t.date},${t.type},${t.category},${t.amount},"${t.description.replace(/"/g, '""')}"`
        )
        .join('\n')
      
      const csvContent = csvHeader + csvRows
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `budget-transactions-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error exporting CSV:', error)
      alert('Failed to export CSV')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    )
  }

  const pastMonths = getPastMonths(selectedMonths)
  const monthlySummaries: MonthlySummary[] = pastMonths.map((month) =>
    calculateMonthlySummary(transactions, month)
  )

  const totalIncome = monthlySummaries.reduce((sum, m) => sum + m.totalIncome, 0)
  const totalExpenses = monthlySummaries.reduce((sum, m) => sum + m.totalExpenses, 0)
  const netTotal = totalIncome - totalExpenses

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reports</h1>
        <div className="flex gap-3">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Export CSV
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Export JSON
          </button>
        </div>
      </div>

      {/* Period Selector */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          View Past Months
        </label>
        <select
          value={selectedMonths}
          onChange={(e) => setSelectedMonths(parseInt(e.target.value))}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
        >
          <option value={3}>Last 3 Months</option>
          <option value={6}>Last 6 Months</option>
          <option value={12}>Last 12 Months</option>
          <option value={24}>Last 24 Months</option>
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Total Income
          </h3>
          <p className="mt-2 text-3xl font-semibold text-green-600 dark:text-green-400">
            {formatCurrency(totalIncome)}
          </p>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Last {selectedMonths} months
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Total Expenses
          </h3>
          <p className="mt-2 text-3xl font-semibold text-red-600 dark:text-red-400">
            {formatCurrency(totalExpenses)}
          </p>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Last {selectedMonths} months
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Net Total
          </h3>
          <p
            className={`mt-2 text-3xl font-semibold ${
              netTotal >= 0
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-red-600 dark:text-red-400'
            }`}
          >
            {formatCurrency(netTotal)}
          </p>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Last {selectedMonths} months
          </p>
        </div>
      </div>

      {/* Monthly Breakdown Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Monthly Breakdown
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Month
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Income
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Expenses
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Net
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Savings Rate
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {monthlySummaries.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    No data available
                  </td>
                </tr>
              ) : (
                monthlySummaries.map((summary) => {
                  const savingsRate =
                    summary.totalIncome > 0
                      ? ((summary.netAmount / summary.totalIncome) * 100).toFixed(1)
                      : '0.0'
                  return (
                    <tr key={summary.month}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                        {getMonthName(summary.month)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-green-600 dark:text-green-400">
                        {formatCurrency(summary.totalIncome)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-red-600 dark:text-red-400">
                        {formatCurrency(summary.totalExpenses)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <span
                          className={
                            summary.netAmount >= 0
                              ? 'text-blue-600 dark:text-blue-400'
                              : 'text-red-600 dark:text-red-400'
                          }
                        >
                          {formatCurrency(summary.netAmount)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900 dark:text-gray-100">
                        {savingsRate}%
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
