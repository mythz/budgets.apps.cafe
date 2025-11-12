# Budget Planner App

- React 19, TypeScript, TailwindCSS v4
- Persistence in IndexedDB/localStorage
- Recharts
- Vitest with React Testing Library

## Features
Dashboard
- Overview of total income, expenses, and remaining budget
- Monthly summary chart (line graph)
- Expense categories (pie chart)

Transactions
- Add/Edit/Delete income or expenses
- Date filtering/sorting

Budgets
- Set monthly budget goals per category
- Progress bars for spending vs. budget

Reports
- View past months
- Export

## New Features

### Category Auto Tagging

Implement Category Auto-Tagging

Allow specifying tags when creating a new transaction.
When users add a transaction, try to predict the tag from the Description, e.g:

Input: “Starbucks latte” → Suggests category: Food & Drinks
Input: “Uber to work” → Suggests category: Transport

Implementation:

Maintain a small local list of common keywords + categories.
Pre-fill category in the transaction form as the user types in the Description.