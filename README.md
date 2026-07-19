# Vaults

**A minimalist personal productivity dashboard — no nested blocks to configure, no markdown syntax to learn. Pick a mode, start working.**

Vaults was built as a lighter alternative to heavyweight, endlessly-configurable productivity tools. Instead of building your own layout from scratch every time, you switch between purpose-built dashboard modes — deep work timer, dev project tracker, weekly habits, personal finance — each one opinionated and ready to use immediately.

---

## Features

- **Flow State** — focused work session dashboard with a countdown timer
- **Developer Path** — track software project scope, tech stack, and target release dates
- **Weekly Routine** — a recurring habit/task board for daily reviews
- **Finance** — income/expense logging with an analytics view
- **Auth** — user accounts via Supabase Auth
- **Calendar & Analytics dashboards** — supporting views alongside the four core modes above

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS v4 |
| Backend / Data | Supabase (Postgres + Auth) |
| Charts | Recharts |
| Icons | Lucide React |

> **Note:** this is a single Next.js application talking directly to Supabase — there's no separate custom backend server. (An earlier version of this README referenced a Go/Gin backend that was never actually part of this repository; that's been corrected here.)

## Getting Started

### Prerequisites
- Node.js 18+
- A Supabase project (free tier is enough) — you'll need its URL and anon key

### Setup

```bash
git clone https://github.com/med4ka/Vaults.git
cd Vaults
npm install
```

Create `.env.local` in the project root:

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

```bash
npm run dev
```

Visit `http://localhost:3000`.

## Project Structure

```
Vaults/
└── app/
    ├── components/
    │   ├── AuthScreen.tsx
    │   ├── FlowStateDashboard.tsx
    │   ├── DeveloperPathDashboard.tsx
    │   ├── WeeklyRoutineDashboard.tsx
    │   ├── FinanceDashboard.tsx
    │   ├── AnalyticsDashboard.tsx
    │   └── CalendarDashboard.tsx
    ├── daily/          # daily view route
    ├── templates/       # template/mode selector route
    ├── lib/
    │   └── supabase.ts  # Supabase client setup
    └── page.tsx
```

## Screenshots

<p align="center">
  <img src="public/vaults1.png" width="90%" alt="Vaults landing"/>
</p>
<table>
  <tr>
    <td align="center"><img src="public/vaults3.png" width="100%" alt="Weekly Routine"/></td>
    <td align="center"><img src="public/vaults4.png" width="100%" alt="Developer Path"/></td>
  </tr>
  <tr>
    <td align="center"><img src="public/vaults5.png" width="100%" alt="Finance"/></td>
    <td align="center"><img src="public/vaults6.png" width="100%" alt="Flow State"/></td>
  </tr>
</table>

---

*Built with Next.js, Tailwind CSS, and Supabase.*
