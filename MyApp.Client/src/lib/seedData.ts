import {
  addTransaction,
  addBudget,
  clearAllData,
} from '../lib/storage'
import { generateId, getCurrentMonth } from '../lib/utils'
import type { Transaction, Budget } from '../types/budget'

// Sample transactions for demonstration
const sampleTransactions: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>[] = [
  // Income
  { type: 'income', category: 'Salary', amount: 5000, description: 'Monthly salary', date: '2025-11-01' },
  { type: 'income', category: 'Freelance', amount: 1200, description: 'Website project', date: '2025-11-15' },
  
  // Expenses
  { type: 'expense', category: 'Housing', amount: 1500, description: 'Monthly rent', date: '2025-11-01' },
  { type: 'expense', category: 'Utilities', amount: 150, description: 'Electric bill', date: '2025-11-05' },
  { type: 'expense', category: 'Food', amount: 350, description: 'Groceries', date: '2025-11-07' },
  { type: 'expense', category: 'Transportation', amount: 80, description: 'Gas', date: '2025-11-10' },
  { type: 'expense', category: 'Entertainment', amount: 120, description: 'Movie night and dinner', date: '2025-11-12' },
  { type: 'expense', category: 'Shopping', amount: 200, description: 'Clothes', date: '2025-11-14' },
  { type: 'expense', category: 'Food', amount: 180, description: 'Restaurants', date: '2025-11-18' },
  { type: 'expense', category: 'Healthcare', amount: 75, description: 'Pharmacy', date: '2025-11-20' },
  
  // Previous month
  { type: 'income', category: 'Salary', amount: 5000, description: 'Monthly salary', date: '2025-10-01' },
  { type: 'expense', category: 'Housing', amount: 1500, description: 'Monthly rent', date: '2025-10-01' },
  { type: 'expense', category: 'Food', amount: 450, description: 'Groceries and dining', date: '2025-10-15' },
  { type: 'expense', category: 'Transportation', amount: 100, description: 'Gas and maintenance', date: '2025-10-18' },
]

// Sample budgets for current month
const currentMonth = getCurrentMonth()
const sampleBudgets: Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>[] = [
  { category: 'Housing', monthlyLimit: 1500, month: currentMonth },
  { category: 'Food', monthlyLimit: 600, month: currentMonth },
  { category: 'Transportation', monthlyLimit: 200, month: currentMonth },
  { category: 'Utilities', monthlyLimit: 200, month: currentMonth },
  { category: 'Entertainment', monthlyLimit: 150, month: currentMonth },
  { category: 'Shopping', monthlyLimit: 300, month: currentMonth },
  { category: 'Healthcare', monthlyLimit: 150, month: currentMonth },
]

export async function seedData() {
  try {
    console.log('Clearing existing data...')
    await clearAllData()
    
    console.log('Adding sample transactions...')
    const now = new Date().toISOString()
    for (const transaction of sampleTransactions) {
      await addTransaction({
        ...transaction,
        id: generateId(),
        createdAt: now,
        updatedAt: now,
      })
    }
    
    console.log('Adding sample budgets...')
    for (const budget of sampleBudgets) {
      await addBudget({
        ...budget,
        id: generateId(),
        createdAt: now,
        updatedAt: now,
      })
    }
    
    console.log('Sample data seeded successfully!')
    return true
  } catch (error) {
    console.error('Error seeding data:', error)
    return false
  }
}
