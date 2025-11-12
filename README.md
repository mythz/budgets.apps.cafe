# Budget Planner App

A modern budget planning application built with React 19, TypeScript, TailwindCSS v4, and IndexedDB for data persistence.

## Tech Stack

- **React 19** - A JavaScript library for building user interfaces
- **Vite** - Next Generation Frontend Tooling
- **TypeScript** - JavaScript with syntax for types
- **Tailwind CSS v4** - A utility-first CSS framework
- **Recharts** - Composable charting library for React
- **IndexedDB** - Browser-based database via idb library
- **Vitest** - Fast unit testing framework
- **React Testing Library** - Testing utilities for React

## Features

### Dashboard
- Overview cards showing total income, expenses, and remaining budget for the current month
- Monthly summary line chart showing income, expenses, and net amount for the last 6 months
- Expense categories pie chart visualizing spending distribution

### Transactions
- Add, edit, and delete income or expense transactions
- Filter transactions by type (income/expense) with search functionality
- Sort transactions by date, amount, or category
- View transaction history with color-coded type indicators

### Budgets
- Set monthly budget goals per expense category
- Visual progress bars showing spending vs. budget
- Color-coded indicators (green, yellow, red) based on spending percentage
- View budget status for any month

### Reports
- View financial summaries for past months (3, 6, 12, or 24 months)
- Monthly breakdown table with income, expenses, net amount, and savings rate
- Export data as JSON (full database backup) or CSV (transactions only)

## Getting Started

### Install dependencies

```bash
cd MyApp.Client
npm install
```

### Development

Start the development server with hot module replacement:

```bash
npm run dev
```

The application will be available at `https://localhost:5173/`

### Build

Create a production build:

```bash
npm run build
```

### Preview

Preview the production build locally:

```bash
npm run preview
```

### Test

Run tests with Vitest:

```bash
npm test
```

Run tests with UI:

```bash
npm run test:ui
```

### Lint

Run ESLint to check code quality:

```bash
npm run lint
```

## Project Structure

```
MyApp.Client/
├── src/
│   ├── components/        # Reusable React components
│   │   └── Layout.tsx     # Main layout with navigation
│   ├── pages/             # Page components
│   │   ├── Dashboard.tsx  # Dashboard with charts
│   │   ├── Transactions.tsx # Transaction management
│   │   ├── Budgets.tsx    # Budget planning
│   │   └── Reports.tsx    # Reports and exports
│   ├── lib/               # Utilities and data access
│   │   ├── storage.ts     # IndexedDB operations
│   │   ├── utils.ts       # Helper functions
│   │   └── seedData.ts    # Sample data for demo
│   ├── types/             # TypeScript type definitions
│   │   └── budget.ts      # Budget app types
│   ├── test/              # Test configuration
│   │   └── setup.ts       # Test setup file
│   ├── App.tsx            # Main App component with routing
│   ├── index.css          # Global styles with Tailwind directives
│   └── main.tsx           # Application entry point
├── public/                # Public static files
├── index.html             # HTML template
├── tailwind.config.ts     # Tailwind CSS configuration
├── vitest.config.ts       # Vitest configuration
├── tsconfig.json          # TypeScript configuration
└── vite.config.ts         # Vite configuration
```

## Data Persistence

The app uses IndexedDB for client-side data persistence. All data is stored locally in your browser:
- **Transactions**: Income and expense records
- **Budgets**: Monthly budget goals per category

### Sample Data

Click the "Load Sample Data" button on the Dashboard (when empty) to populate the app with sample transactions and budgets for demonstration purposes.

## Tailwind CSS

This project uses Tailwind CSS v4 for styling. The configuration is located in `tailwind.config.ts`. 

Tailwind directives are imported in `src/index.css`:
```css
@import "tailwindcss";
```

## Dark Mode

The app includes a dark mode toggle in the navigation bar. Dark mode preferences are persisted across sessions.
