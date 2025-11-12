import type { Transaction, MonthlySummary, CategorySummary, Budget } from '../types/budget'

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function getCurrentMonth(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

export function getMonthName(monthString: string): string {
  const [year, month] = monthString.split('-')
  const date = new Date(parseInt(year), parseInt(month) - 1)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  })
}

export function calculateMonthlySummary(
  transactions: Transaction[],
  month: string
): MonthlySummary {
  const monthTransactions = transactions.filter((t) => t.date.startsWith(month))
  
  const totalIncome = monthTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
  
  const totalExpenses = monthTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)
  
  return {
    month,
    totalIncome,
    totalExpenses,
    netAmount: totalIncome - totalExpenses,
  }
}

export function calculateCategorySummaries(
  transactions: Transaction[],
  budgets: Budget[],
  month: string
): CategorySummary[] {
  const monthTransactions = transactions.filter(
    (t) => t.type === 'expense' && t.date.startsWith(month)
  )
  
  const categoryMap = new Map<string, { totalSpent: number; count: number }>()
  
  monthTransactions.forEach((t) => {
    const current = categoryMap.get(t.category) || { totalSpent: 0, count: 0 }
    categoryMap.set(t.category, {
      totalSpent: current.totalSpent + t.amount,
      count: current.count + 1,
    })
  })
  
  const monthBudgets = budgets.filter((b) => b.month === month)
  const budgetMap = new Map(monthBudgets.map((b) => [b.category, b.monthlyLimit]))
  
  const categories = new Set([
    ...Array.from(categoryMap.keys()),
    ...Array.from(budgetMap.keys()),
  ])
  
  return Array.from(categories).map((category) => {
    const data = categoryMap.get(category) || { totalSpent: 0, count: 0 }
    return {
      category,
      totalSpent: data.totalSpent,
      budgetLimit: budgetMap.get(category) || 0,
      transactionCount: data.count,
    }
  })
}

export function getPastMonths(count: number): string[] {
  const months: string[] = []
  const now = new Date()
  
  for (let i = 0; i < count; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    months.push(monthString)
  }
  
  return months
}

export function sortTransactions(
  transactions: Transaction[],
  sortBy: 'date' | 'amount' | 'category',
  order: 'asc' | 'desc' = 'desc'
): Transaction[] {
  return [...transactions].sort((a, b) => {
    let comparison = 0
    
    if (sortBy === 'date') {
      comparison = a.date.localeCompare(b.date)
    } else if (sortBy === 'amount') {
      comparison = a.amount - b.amount
    } else if (sortBy === 'category') {
      comparison = a.category.localeCompare(b.category)
    }
    
    return order === 'asc' ? comparison : -comparison
  })
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}
