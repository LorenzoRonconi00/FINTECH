# FinTech: Personal Finance Manager

A personal finance web app built around **custom financial periods** (for example, a budget month that starts on the day your salary arrives) and **recurring templates** that generate the expected transactions for you, so you can track what has actually happened versus what is still pending.

**Live demo:** https://www.fintechprolab.com/

## Features

- **Multiple accounts**: checking, savings, cash, investment and other, each with a colour and an initial balance. Balances are computed from confirmed transactions.
- **Custom financial periods**: you choose the day your budget month starts (1-28), and every transaction is assigned to the right period automatically. A history view summarises every period.
- **Real vs. projected balance**: the dashboard separates *confirmed* movements (real balance) from *pending* ones (projected balance), so you can see where you will land at the end of the period.
- **Recurring templates**: define salaries, rent, subscriptions and so on once, with a scheduled day, a start month, an optional end month and an optional variable amount. Pending transactions are generated per period without creating duplicates.
- **Transfers between accounts**: one-off or recurring, with the same confirm/skip workflow. Transfers can be excluded from statistics so they don't distort income and expenses.
- **Pending workflow**: confirm a pending transaction (adjusting the amount if it is variable) or skip it.
- **Statistics**: expenses by category (pie and bar charts), and a balance trend over time, filterable by period and account.
- **Categories**: custom categories with colour and icon for income and expenses.
- **Settings**: budget start day, default currency (EUR, USD, GBP, CHF, JPY) and timezone.
- **Authentication**: email and password sign-up and login through Supabase Auth, with every page and query scoped to the signed-in user.

## Tech stack

| Area | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Server Components, Server Actions), React 19 |
| Language | TypeScript |
| Backend / DB / Auth | Supabase (PostgreSQL, Auth, `@supabase/ssr`) |
| UI | Tailwind CSS 4, Radix UI primitives (shadcn/ui), Lucide icons, Sonner toasts |
| Forms & validation | React Hook Form, Zod |
| Charts | Recharts |
| State | Zustand |
| Tooling | ESLint, Prettier |
| Hosting | Vercel |

## Architecture

```
src/
  app/
    (auth)/         login and register
    (dashboard)/    dashboard, accounts, transactions, transfers,
                    templates, statistics, history, settings
  components/       UI grouped by domain (accounts, transactions, transfers, ...)
  lib/
    actions/        Server Actions (mutations)
    queries/        server-side data fetching
    validators/     Zod schemas shared by forms and actions
    supabase/       browser, server and middleware clients
    utils/          financial-period and balance calculations
  middleware.ts     session refresh and route protection
  types/            database types generated from the Supabase schema
```

Some design choices:

- **Server-first data flow**: reads happen in Server Components through `lib/queries`, writes go through Server Actions in `lib/actions` and call `revalidatePath` so views stay consistent.
- **Single source of truth for validation**: the same Zod schemas validate client forms and server actions.
- **Pure, isolated domain logic**: period assignment (`financial-period.ts`) and balance calculations (`balance.ts`) are plain functions, independent of the UI and the database.
- **Idempotent generation**: generating pending items for a period skips templates that already produced a transaction for that period, and clamps the scheduled day to the length of the month.

## Data model

Tables used by the app: `accounts`, `categories`, `transactions`, `transfers`, `recurring_templates`, `transfer_templates` and `user_settings`. Transactions and transfers carry a `status` (`pending`, `confirmed`, `skipped`) and a `financial_period` (`YYYY-MM`). The full typed schema is in [`src/types/database.types.ts`](src/types/database.types.ts).

## Getting started

### Prerequisites

- Node.js 20+
- A [Supabase](https://supabase.com) project with the tables above

> **Note:** the repository can be cloned and the code inspected or run, but it does **not** include a ready-to-use `schema.sql` (or Supabase migrations). The database schema is not versioned here, so to run the app against your own Supabase project you would need to create the tables, enums and policies yourself, using [`src/types/database.types.ts`](src/types/database.types.ts) as a reference. The live demo above shows the app running against a configured instance.

### Setup

```bash
git clone https://github.com/LorenzoRonconi00/FINTECH.git
cd FINTECH
npm install
```

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Start the development server:

```bash
npm run dev
```

Open http://localhost:3000.

### Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm start` | Run the production build |
| `npm run lint` | Lint the project |
| `npm run types:generate` | Regenerate database types from the linked Supabase project |

## License

Released under the [MIT License](LICENSE).
