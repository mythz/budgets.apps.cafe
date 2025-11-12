import { useEffect, useState } from 'react'
import {
  getAllTransactions,
  getAllBudgets,
  addBudget,
  updateBudget,
  deleteBudget,
} from '../lib/storage'
import { calculateCategorySummaries, formatCurrency, getCurrentMonth, getMonthName, generateId } from '../lib/utils'
import { EXPENSE_CATEGORIES } from '../types/budget'
import type { Budget, Transaction } from '../types/budget'

export default function Budgets() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [loading, setLoading] = useState(true)
  const [currentMonth, setCurrentMonth] = useState(getCurrentMonth())
  const [showModal, setShowModal] = useState(false)
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null)

  useEffect(() => {
    loadData()
  }, [currentMonth])

  async function loadData() {
    try {
      setLoading(true)
      const [allTransactions, allBudgets] = await Promise.all([
        getAllTransactions(),
        getAllBudgets(),
      ])
      setTransactions(allTransactions)
      setBudgets(allBudgets)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  function handleAddNew() {
    setEditingBudget(null)
    setShowModal(true)
  }

  function handleEdit(budget: Budget) {
    setEditingBudget(budget)
    setShowModal(true)
  }

  async function handleDelete(id: string) {
    if (confirm('Are you sure you want to delete this budget?')) {
      try {
        await deleteBudget(id)
        await loadData()
      } catch (error) {
        console.error('Error deleting budget:', error)
        alert('Failed to delete budget')
      }
    }
  }

  function handleCloseModal() {
    setShowModal(false)
    setEditingBudget(null)
  }

  async function handleSave(budget: Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      const now = new Date().toISOString()
      if (editingBudget) {
        await updateBudget({
          ...budget,
          id: editingBudget.id,
          createdAt: editingBudget.createdAt,
          updatedAt: now,
        })
      } else {
        await addBudget({
          ...budget,
          id: generateId(),
          createdAt: now,
          updatedAt: now,
        })
      }
      await loadData()
      handleCloseModal()
    } catch (error) {
      console.error('Error saving budget:', error)
      alert('Failed to save budget')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    )
  }

  const monthBudgets = budgets.filter((b) => b.month === currentMonth)
  const categorySummaries = calculateCategorySummaries(transactions, monthBudgets, currentMonth)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Budgets</h1>
        <div className="flex gap-3">
          <input
            type="month"
            value={currentMonth}
            onChange={(e) => setCurrentMonth(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
          />
          <button
            onClick={handleAddNew}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Add Budget
          </button>
        </div>
      </div>

      <div className="text-lg font-medium text-gray-700 dark:text-gray-300">
        {getMonthName(currentMonth)}
      </div>

      {/* Budget Progress Cards */}
      <div className="space-y-4">
        {EXPENSE_CATEGORIES.map((category) => {
          const summary = categorySummaries.find((s) => s.category === category)
          const totalSpent = summary?.totalSpent || 0
          const budgetLimit = summary?.budgetLimit || 0
          const percentage = budgetLimit > 0 ? (totalSpent / budgetLimit) * 100 : 0
          const budget = monthBudgets.find((b) => b.category === category)

          let progressColor = 'bg-green-500'
          if (percentage >= 100) {
            progressColor = 'bg-red-500'
          } else if (percentage >= 80) {
            progressColor = 'bg-yellow-500'
          }

          return (
            <div key={category} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {category}
                  </h3>
                  <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {formatCurrency(totalSpent)} of {formatCurrency(budgetLimit)}
                  </div>
                </div>
                <div className="flex gap-2">
                  {budget ? (
                    <>
                      <button
                        onClick={() => handleEdit(budget)}
                        className="px-3 py-1 text-sm text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(budget.id)}
                        className="px-3 py-1 text-sm text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        Delete
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingBudget({
                          id: '',
                          category,
                          monthlyLimit: 0,
                          month: currentMonth,
                          createdAt: '',
                          updatedAt: '',
                        })
                        setShowModal(true)
                      }}
                      className="px-3 py-1 text-sm text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                    >
                      Set Budget
                    </button>
                  )}
                </div>
              </div>

              {budgetLimit > 0 ? (
                <>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                    <div
                      className={`h-full ${progressColor} transition-all duration-300`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                  <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {percentage.toFixed(1)}% used
                    {percentage >= 100 && (
                      <span className="ml-2 text-red-600 dark:text-red-400 font-medium">
                        (Over budget by {formatCurrency(totalSpent - budgetLimit)})
                      </span>
                    )}
                    {budgetLimit > totalSpent && (
                      <span className="ml-2 text-gray-600 dark:text-gray-400">
                        ({formatCurrency(budgetLimit - totalSpent)} remaining)
                      </span>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  No budget set for this category
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Budget Modal */}
      {showModal && (
        <BudgetModal
          budget={editingBudget}
          currentMonth={currentMonth}
          onSave={handleSave}
          onClose={handleCloseModal}
        />
      )}
    </div>
  )
}

interface BudgetModalProps {
  budget: Budget | null
  currentMonth: string
  onSave: (budget: Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>) => void
  onClose: () => void
}

function BudgetModal({ budget, currentMonth, onSave, onClose }: BudgetModalProps) {
  const [formData, setFormData] = useState({
    category: budget?.category || '',
    monthlyLimit: budget?.monthlyLimit || 0,
    month: budget?.month || currentMonth,
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!formData.category || formData.monthlyLimit <= 0) {
      alert('Please fill in all required fields')
      return
    }
    onSave(formData)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {budget?.id ? 'Edit Budget' : 'Add Budget'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
                disabled={!!budget?.id}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
              >
                <option value="">Select category</option>
                {EXPENSE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Monthly Limit *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.monthlyLimit || ''}
                onChange={(e) =>
                  setFormData({ ...formData, monthlyLimit: parseFloat(e.target.value) })
                }
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Month *
              </label>
              <input
                type="month"
                value={formData.month}
                onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Save
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
