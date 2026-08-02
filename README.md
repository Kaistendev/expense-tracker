# Expense Tracker

Monorepo expense tracker with income/expense management, categories, and a dashboard with charts. Built with hexagonal architecture (Ports & Adapters).

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js + TypeScript |
| Backend | Express, Drizzle ORM, better-sqlite3 |
| Frontend | React 19, Vite, Tailwind CSS, shadcn/ui |
| Charts | Recharts |
| Auth | bcrypt + JWT |
| Validation | Zod |
| Monorepo | npm workspaces |

## Project Structure

```
expense-tracker/
├── packages/
│   ├── backend/               # Express API server (port 3001)
│   │   └── src/
│   │       ├── domain/        # Entities, VOs, repository ports, errors
│   │       ├── application/   # Use cases, DTOs
│   │       └── infrastructure/# DB connection, repositories, auth, logger
│   │       └── presentation/  # Controllers, routes, middleware, server
│   └── frontend/              # React SPA (port 5173, proxied to :3001)
│       └── src/
│           ├── core/          # TypeScript interfaces
│           ├── application/   # Custom hooks
│           ├── infrastructure/# HTTP client, API services
│           └── presentation/  # Pages, components (shadcn/ui), layout
├── tsconfig.base.json         # Shared TS config
└── package.json               # Workspace root
```

## Getting Started

```bash
# Install dependencies
npm install

# Start development (backend + frontend concurrently)
npm run dev
```

- **Backend**: http://localhost:3001
- **Frontend**: http://localhost:5173 (proxies `/api` to backend)

## Available Commands

```bash
npm run dev          # Start both frontend and backend in watch mode
npm run build        # Build both packages for production
npm test             # Run all tests
npm run dev:backend  # Backend only
npm run dev:frontend # Frontend only
```

### Package-specific scripts

```bash
npm run dev -w packages/backend     # tsx watch src/index.ts
npm run test -w packages/backend    # Vitest (99 tests)
npm run dev -w packages/frontend    # Vite dev server
npm run build -w packages/frontend  # Vite production build
```

## Features

- **Auth**: Register/login with JWT, protected routes
- **Settings**: Edit display name, change password (with current-password verification), and light/dark mode toggle (persisted in localStorage)
- **Expenses & Income**: CRUD with type toggle (income/expense), search, filter by category, pagination
- **Categories**: CRUD with icon and color
- **Dashboard**: Monthly summary with income/expense/balance cards, category pie chart, month-over-month comparison bar chart
- **Responsive**: Mobile sidebar (Sheet), desktop fixed sidebar
- **Dark mode**: Toggle in the top bar and in Settings, follows system preference by default

## Architecture

The backend follows hexagonal architecture:

```
┌──────────┐     ┌──────────────┐     ┌────────────────┐
│  Routes  │────▶│  Controllers │────▶│   Use Cases    │
└──────────┘     └──────────────┘     └───────┬────────┘
                                              │
         ┌────────────────────────────────────┘
         ▼
┌──────────────────┐     ┌──────────────────┐
│   Repositories   │◀───│   Domain Ports   │
│  (Infrastructure)│     │      (Core)      │
└──────────────────┘     └──────────────────┘
```

- **Domain**: Entities (`User`, `Category`, `Expense`), Value Objects (`Money`, `Email`, `EntityId`, `DateRange`), repository interfaces, `Result<T,E>` pattern
- **Application**: Use cases per entity (`auth/`, `category/`, `expense/`), Zod DTOs
- **Infrastructure**: Drizzle repositories, SQLite connection (auto-creates tables on startup), `AuthService` (bcrypt + JWT)
- **Presentation**: Express controllers, routes, JWT auth middleware, Zod validation middleware, error handler

## Database

SQLite file at `packages/backend/data/expenses.db`. Auto-created on first run. Tables are created automatically on connection.

To reset: delete the DB file and restart.

## Testing

- **Unit tests**: 83 tests across domain VOs, entities, use cases, and auth service
- **Integration tests**: 16 E2E API tests against a temporary SQLite file
- **Test runner**: Vitest
