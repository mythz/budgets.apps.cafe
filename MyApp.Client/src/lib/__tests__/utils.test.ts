import { describe, it, expect } from 'vitest'
import {
  formatCurrency,
  formatDate,
  getCurrentMonth,
  getMonthName,
  calculateMonthlySummary,
  calculateCategorySummaries,
  getPastMonths,
  sortTransactions,
  generateId,
} from '../utils'
import type { Transaction, Budget } from '../../types/budget'

describe('formatCurrency', () => {
  it('should format positive amounts correctly', () => {
    expect(formatCurrency(1234.56)).toBe('$1,234.56')
    expect(formatCurrency(0)).toBe('$0.00')
  })

  it('should format negative amounts correctly', () => {
    expect(formatCurrency(-1234.56)).toBe('-$1,234.56')
  })
})

describe('formatDate', () => {
  it('should format date strings correctly', () => {
    const result = formatDate('2025-11-12')
    expect(result).toMatch(/Nov 12, 2025/)
  })
})

describe('getCurrentMonth', () => {
  it('should return current month in YYYY-MM format', () => {
    const result = getCurrentMonth()
    expect(result).toMatch(/^\d{4}-\d{2}$/)
  })
})

describe('getMonthName', () => {
  it('should return formatted month name', () => {
    const result = getMonthName('2025-11')
    expect(result).toMatch(/November 2025/)
  })
})

describe('calculateMonthlySummary', () => {
  const transactions: Transaction[] = [
    {
      id: '1',
      type: 'income',
      category: 'Salary',
      amount: 5000,
      description: 'Monthly salary',
      date: '2025-11-01',
      createdAt: '2025-11-01T00:00:00Z',
      updatedAt: '2025-11-01T00:00:00Z',
    },
    {
      id: '2',
      type: 'expense',
      category: 'Food',
      amount: 500,
      description: 'Groceries',
      date: '2025-11-05',
      createdAt: '2025-11-05T00:00:00Z',
      updatedAt: '2025-11-05T00:00:00Z',
    },
    {
      id: '3',
      type: 'expense',
      category: 'Housing',
      amount: 1200,
      description: 'Rent',
      date: '2025-11-01',
      createdAt: '2025-11-01T00:00:00Z',
      updatedAt: '2025-11-01T00:00:00Z',
    },
  ]

  it('should calculate monthly summary correctly', () => {
    const result = calculateMonthlySummary(transactions, '2025-11')
    expect(result.totalIncome).toBe(5000)
    expect(result.totalExpenses).toBe(1700)
    expect(result.netAmount).toBe(3300)
    expect(result.month).toBe('2025-11')
  })

  it('should return zero values for month with no transactions', () => {
    const result = calculateMonthlySummary(transactions, '2025-12')
    expect(result.totalIncome).toBe(0)
    expect(result.totalExpenses).toBe(0)
    expect(result.netAmount).toBe(0)
  })
})

describe('calculateCategorySummaries', () => {
  const transactions: Transaction[] = [
    {
      id: '1',
      type: 'expense',
      category: 'Food',
      amount: 300,
      description: 'Groceries',
      date: '2025-11-05',
      createdAt: '2025-11-05T00:00:00Z',
      updatedAt: '2025-11-05T00:00:00Z',
    },
    {
      id: '2',
      type: 'expense',
      category: 'Food',
      amount: 200,
      description: 'Restaurant',
      date: '2025-11-10',
      createdAt: '2025-11-10T00:00:00Z',
      updatedAt: '2025-11-10T00:00:00Z',
    },
  ]

  const budgets: Budget[] = [
    {
      id: '1',
      category: 'Food',
      monthlyLimit: 600,
      month: '2025-11',
      createdAt: '2025-11-01T00:00:00Z',
      updatedAt: '2025-11-01T00:00:00Z',
    },
  ]

  it('should calculate category summaries correctly', () => {
    const result = calculateCategorySummaries(transactions, budgets, '2025-11')
    const foodSummary = result.find((s) => s.category === 'Food')
    expect(foodSummary).toBeDefined()
    expect(foodSummary?.totalSpent).toBe(500)
    expect(foodSummary?.budgetLimit).toBe(600)
    expect(foodSummary?.transactionCount).toBe(2)
  })
})

describe('getPastMonths', () => {
  it('should return correct number of past months', () => {
    const result = getPastMonths(3)
    expect(result).toHaveLength(3)
    expect(result[0]).toMatch(/^\d{4}-\d{2}$/)
  })
})

describe('sortTransactions', () => {
  const transactions: Transaction[] = [
    {
      id: '1',
      type: 'expense',
      category: 'Food',
      amount: 100,
      description: 'First',
      date: '2025-11-01',
      createdAt: '2025-11-01T00:00:00Z',
      updatedAt: '2025-11-01T00:00:00Z',
    },
    {
      id: '2',
      type: 'expense',
      category: 'Housing',
      amount: 500,
      description: 'Second',
      date: '2025-11-05',
      createdAt: '2025-11-05T00:00:00Z',
      updatedAt: '2025-11-05T00:00:00Z',
    },
  ]

  it('should sort by date descending', () => {
    const result = sortTransactions(transactions, 'date', 'desc')
    expect(result[0].date).toBe('2025-11-05')
  })

  it('should sort by amount ascending', () => {
    const result = sortTransactions(transactions, 'amount', 'asc')
    expect(result[0].amount).toBe(100)
  })

  it('should sort by category', () => {
    const result = sortTransactions(transactions, 'category', 'asc')
    expect(result[0].category).toBe('Food')
  })
})

describe('generateId', () => {
  it('should generate unique IDs', () => {
    const id1 = generateId()
    const id2 = generateId()
    expect(id1).not.toBe(id2)
    expect(id1).toMatch(/^\d+-[a-z0-9]+$/)
  })
})
