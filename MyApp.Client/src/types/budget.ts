export type TransactionType = 'income' | 'expense'

export interface Transaction {
  id: string
  type: TransactionType
  category: string
  amount: number
  description: string
  date: string // ISO date string
  tags?: string[] // Optional tags for transactions
  createdAt: string
  updatedAt: string
}

export interface Budget {
  id: string
  category: string
  monthlyLimit: number
  month: string // Format: YYYY-MM
  createdAt: string
  updatedAt: string
}

export interface CategorySummary {
  category: string
  totalSpent: number
  budgetLimit: number
  transactionCount: number
}

export interface MonthlySummary {
  month: string
  totalIncome: number
  totalExpenses: number
  netAmount: number
}

export const EXPENSE_CATEGORIES = [
  'Housing',
  'Transportation',
  'Food',
  'Utilities',
  'Healthcare',
  'Entertainment',
  'Shopping',
  'Education',
  'Travel',
  'Other',
] as const

export const INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Investment',
  'Business',
  'Gift',
  'Other',
] as const

export type ExpenseCategory = typeof EXPENSE_CATEGORIES[number]
export type IncomeCategory = typeof INCOME_CATEGORIES[number]
export type Category = ExpenseCategory | IncomeCategory
