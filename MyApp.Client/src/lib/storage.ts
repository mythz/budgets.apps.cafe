import { openDB, type IDBPDatabase } from 'idb'
import type { Transaction, Budget } from '../types/budget'

const DB_NAME = 'BudgetPlannerDB'
const DB_VERSION = 1

export interface BudgetDB {
  transactions: {
    key: string
    value: Transaction
    indexes: { 'by-date': string; 'by-type': string; 'by-category': string }
  }
  budgets: {
    key: string
    value: Budget
    indexes: { 'by-month': string; 'by-category': string }
  }
}

let dbPromise: Promise<IDBPDatabase<BudgetDB>> | null = null

export async function getDB(): Promise<IDBPDatabase<BudgetDB>> {
  if (!dbPromise) {
    dbPromise = openDB<BudgetDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Create transactions store
        if (!db.objectStoreNames.contains('transactions')) {
          const transactionStore = db.createObjectStore('transactions', {
            keyPath: 'id',
          })
          transactionStore.createIndex('by-date', 'date')
          transactionStore.createIndex('by-type', 'type')
          transactionStore.createIndex('by-category', 'category')
        }

        // Create budgets store
        if (!db.objectStoreNames.contains('budgets')) {
          const budgetStore = db.createObjectStore('budgets', {
            keyPath: 'id',
          })
          budgetStore.createIndex('by-month', 'month')
          budgetStore.createIndex('by-category', 'category')
        }
      },
    })
  }
  return dbPromise
}

// Transaction operations
export async function getAllTransactions(): Promise<Transaction[]> {
  const db = await getDB()
  return db.getAll('transactions')
}

export async function getTransaction(id: string): Promise<Transaction | undefined> {
  const db = await getDB()
  return db.get('transactions', id)
}

export async function addTransaction(transaction: Transaction): Promise<void> {
  const db = await getDB()
  await db.add('transactions', transaction)
}

export async function updateTransaction(transaction: Transaction): Promise<void> {
  const db = await getDB()
  await db.put('transactions', transaction)
}

export async function deleteTransaction(id: string): Promise<void> {
  const db = await getDB()
  return db.delete('transactions', id)
}

export async function getTransactionsByDateRange(
  startDate: string,
  endDate: string
): Promise<Transaction[]> {
  const db = await getDB()
  const transactions = await db.getAll('transactions')
  return transactions.filter((t) => t.date >= startDate && t.date <= endDate)
}

export async function getTransactionsByMonth(month: string): Promise<Transaction[]> {
  const db = await getDB()
  const transactions = await db.getAll('transactions')
  return transactions.filter((t) => t.date.startsWith(month))
}

// Budget operations
export async function getAllBudgets(): Promise<Budget[]> {
  const db = await getDB()
  return db.getAll('budgets')
}

export async function getBudget(id: string): Promise<Budget | undefined> {
  const db = await getDB()
  return db.get('budgets', id)
}

export async function getBudgetsByMonth(month: string): Promise<Budget[]> {
  const db = await getDB()
  const budgets = await db.getAll('budgets')
  return budgets.filter((b) => b.month === month)
}

export async function addBudget(budget: Budget): Promise<void> {
  const db = await getDB()
  await db.add('budgets', budget)
}

export async function updateBudget(budget: Budget): Promise<void> {
  const db = await getDB()
  await db.put('budgets', budget)
}

export async function deleteBudget(id: string): Promise<void> {
  const db = await getDB()
  return db.delete('budgets', id)
}

// Export/Import functionality
export async function exportData(): Promise<string> {
  const transactions = await getAllTransactions()
  const budgets = await getAllBudgets()
  
  const data = {
    transactions,
    budgets,
    exportDate: new Date().toISOString(),
  }
  
  return JSON.stringify(data, null, 2)
}

export async function importData(jsonData: string): Promise<void> {
  const data = JSON.parse(jsonData)
  const db = await getDB()
  
  // Import transactions
  if (data.transactions) {
    for (const transaction of data.transactions) {
      await db.put('transactions', transaction)
    }
  }
  
  // Import budgets
  if (data.budgets) {
    for (const budget of data.budgets) {
      await db.put('budgets', budget)
    }
  }
}

export async function clearAllData(): Promise<void> {
  const db = await getDB()
  await db.clear('transactions')
  await db.clear('budgets')
}
