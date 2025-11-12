import { useEffect, useState } from 'react'
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { getAllTransactions, getBudgetsByMonth } from '../lib/storage'
import {
  calculateMonthlySummary,
  calculateCategorySummaries,
  formatCurrency,
  getCurrentMonth,
  getPastMonths,
  getMonthName,
} from '../lib/utils'
import { seedData } from '../lib/seedData'
import type { Transaction, Budget } from '../types/budget'

const COLORS = [
  '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981',
  '#06b6d4', '#6366f1', '#f97316', '#14b8a6', '#a855f7',
]

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      const [allTransactions, allBudgets] = await Promise.all([
        getAllTransactions(),
        getBudgetsByMonth(getCurrentMonth()),
      ])
      setTransactions(allTransactions)
      setBudgets(allBudgets)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSeedData() {
    if (confirm('This will clear all existing data and add sample data. Continue?')) {
      await seedData()
      await loadData()
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    )
  }

  const currentMonth = getCurrentMonth()
  const currentSummary = calculateMonthlySummary(transactions, currentMonth)
  const categorySummaries = calculateCategorySummaries(transactions, budgets, currentMonth)

  // Prepare data for monthly trend chart (last 6 months)
  const monthlyTrendData = getPastMonths(6).reverse().map((month) => {
    const summary = calculateMonthlySummary(transactions, month)
    return {
      month: getMonthName(month).split(' ')[0], // Get month name only
      income: summary.totalIncome,
      expenses: summary.totalExpenses,
      net: summary.netAmount,
    }
  })

  // Prepare data for expense categories pie chart
  const expenseCategoryData = categorySummaries
    .filter((cat) => cat.totalSpent > 0)
    .map((cat) => ({
      name: cat.category,
      value: cat.totalSpent,
    }))

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        {transactions.length === 0 && (
          <button
            onClick={handleSeedData}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Load Sample Data
          </button>
        )}
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Total Income
          </h3>
          <p className="mt-2 text-3xl font-semibold text-green-600 dark:text-green-400">
            {formatCurrency(currentSummary.totalIncome)}
          </p>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {getMonthName(currentMonth)}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Total Expenses
          </h3>
          <p className="mt-2 text-3xl font-semibold text-red-600 dark:text-red-400">
            {formatCurrency(currentSummary.totalExpenses)}
          </p>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {getMonthName(currentMonth)}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Remaining Budget
          </h3>
          <p
            className={`mt-2 text-3xl font-semibold ${
              currentSummary.netAmount >= 0
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-red-600 dark:text-red-400'
            }`}
          >
            {formatCurrency(currentSummary.netAmount)}
          </p>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {getMonthName(currentMonth)}
          </p>
        </div>
      </div>

      {/* Monthly Summary Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Monthly Summary (Last 6 Months)
        </h2>
        {monthlyTrendData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="month" 
                stroke="#9ca3af"
              />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '0.5rem',
                  color: '#f3f4f6',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="income"
                stroke="#10b981"
                strokeWidth={2}
                name="Income"
              />
              <Line
                type="monotone"
                dataKey="expenses"
                stroke="#ef4444"
                strokeWidth={2}
                name="Expenses"
              />
              <Line
                type="monotone"
                dataKey="net"
                stroke="#3b82f6"
                strokeWidth={2}
                name="Net"
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex justify-center items-center h-64 text-gray-500 dark:text-gray-400">
            No data available
          </div>
        )}
      </div>

      {/* Expense Categories Pie Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Expense Categories
        </h2>
        {expenseCategoryData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={expenseCategoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${((percent || 0) * 100).toFixed(0)}%`
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {expenseCategoryData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '0.5rem',
                  color: '#f3f4f6',
                }}
                formatter={(value: number) => formatCurrency(value)}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex justify-center items-center h-64 text-gray-500 dark:text-gray-400">
            No expenses this month
          </div>
        )}
      </div>
    </div>
  )
}
