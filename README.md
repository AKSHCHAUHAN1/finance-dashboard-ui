# Finance Dashboard UI

A clean, interactive, and responsive finance dashboard built to demonstrate frontend component structure, robust state management, and strict technical execution. This project satisfies all requirements for the Finance Dashboard UI Assignment.

## Approach & Tech Stack

This project was built with a primary focus on visual accessibility, modular component architecture, and predictable state management. The design follows a modern fintech aesthetic with clear information hierarchy and strict separation of concerns.

- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS v4 (Theme-aware, responsive utility classes)
- **Data Visualization**: Recharts
- **Icons**: Lucide React
- **State Management**: React Context API + `useReducer`
- **Routing**: React Router DOM (Simulated multi-page layout)

## Features Implemented (Core Requirements)

### 1. Dashboard Overview
- **Summary Cards**: Quantitative metrics for Total Balance, Total Income, and Total Expenses.
- **Time-based Visualization**: Interactive area chart showing the rolling balance trend over time.
- **Categorical Visualization**: Dynamic pie charts and progress bars detailing spending distribution by category.

### 2. Transactions Section
- **Extensive Data Table**: Comprehensive transaction records including Date, Description, Category, Type, and Amount.
- **Filtering & Search**: Real-time filtering parameters by text, category, transaction classification, and date boundaries.
- **Sorting**: Toggle capable table column sorting by date and transaction amount.
- **Pagination**: Integrated index navigation for managing extended transaction lists.

### 3. Role-Based UI (RBAC Simulation)
- Configurable user access restrictions built directly into the UI (configurable via Settings).
- **Viewer Role**: Read-only interface that restricts data mutation.
- **Admin Role**: Grants authenticated actions to Add, Edit, and Delete transactions dynamically across the application environment.

### 4. Insights Section
- Mathematical analysis of existing transaction data to surface meaningful financial observations.
- Identifies the prevailing Highest Spending Category.
- Evaluates Monthly Budget Flow parameters and localized spending concentration metrics.

### 5. Efficient State Management
- Global state managed via `Context` and `useReducer` to prevent properties from being excessively passed through the component tree.
- Establishes a strict Single Source of Truth for the transactions ledger, applied filters, authorized user roles, and UI theme states.
- Mutated state flows through centralized actions, guaranteeing predictable visual synchronization across all dependents.

### 6. UI and UX Architecture
- **Responsive Framework**: Native flexibility across Desktop, Tablet, and Mobile device dimensions.
- **Error Handling**: Dedicated null-state components for unpopulated fields, failed searches, or empty datasets.
- **Micro-interactions**: Controlled state transitions and feedback loops for primary user interactions.

## Optional Enhancements

To strengthen the submission, the following optional technical parameters were successfully implemented:
- **Dark Mode**: Integrated tonal surface rendering using a curated dark palette for reduced eye strain.
- **Data Persistence**: Core application state variables are preserved across session reloads utilizing local storage.
- **Export Functionality**: Validated exporting algorithms for converting transactions to CSV format and insights to JSON.
- **Modern Layouts**: Component mounting utilizes a bento-grid framework for structural integrity.

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```
   Deploy the local server via `http://localhost:5173` (or the port defined by Vite) in your browser.

3. **Build for production** (Optional):
   ```bash
   npm run build
   ```

## Evaluation Criteria Addressed

1. **Design and Creativity**: Engineered a high-quality financial dashboard interface applying soft shadows, data visualization algorithms, and precise alignment.
2. **Responsiveness**: Utilized viewport breakpoints securing the layout against scaling limitations.
3. **Functionality**: Replicated complete CRUD operations for simulated administrative environments.
4. **User Experience**: Emphasized immediate feedback loops to external inputs and logical navigational flows.
5. **Technical Quality**: Partitioned business logic (`contexts/`, `utils/`) away from presentational elements (`components/`), establishing a highly structured and decoupled repository.
6. **State Management**: Centralized actions through `useReducer` to enforce stability within the UI rendering cycle.
7. **Attention to Detail**: Accommodated interface edge cases including null states, locked permissions, and scaleable data presentation.

Note: This project intentionally leverages simulated mock data and local processing to satisfy the frontend-exclusive requirements of the evaluation.
