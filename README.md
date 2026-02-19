# 🔖 Smart Bookmark Manager

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-blueviolet?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

A high-performance, resilient, and beautifully designed link management system. Built with a focus on speed, reliability, and modern developer aesthetics.

> **Design Philosophy**: Minimalist SaaS aesthetic, inspired by tools like Raycast and Vercel.

---

## 🚀 Production-Grade Features

### 🛡️ Security Architecture
- **PostgreSQL Row Level Security (RLS)**: Enforced isolation at the database layer. No user can ever query another user's bookmarks, verified by cryptographically signed JWTs.
- **Hardened Auth Callbacks**: Protection against Open Redirect attacks by validating destination internal paths.
- **Server-Side Validation**: Robust URL sanitization and `new URL()` constructor validation inside secure Server Actions.
- **JWT Integrity**: All database operations are authenticated via Supabase's secure server-side session management (`getUser`).

### ⚡ Performance & Optimization
- **Supabase Realtime (WebSockets)**: Bi-directional sync that updates the UI instantly across all open tabs/devices without a single page refresh.
- **Cursor-based Pagination**: High-performance data fetching that scales to thousands of bookmarks by using timestamp-based cursors instead of slow `OFFSET` methods.
- **Smart Metadata Fetching**: 
  - **Asynchronous Processing**: Titles are fetched on-demand during the creation flow.
  - **Exponential Backoff**: Retries logic (1s, 2s) handles transient 5xx network errors.
  - **Abort Tracking**: Strict 5s timeouts prevent server-side process hanging.
- **Optimistic UI & Transitions**: Leverages React 19's `useTransition` and Framer Motion for a "zero-latency" feel during add/delete actions.
- **Next.js 15 & Tailwind 4.0**: Built using the latest, most optimized versions of the modern web stack.

---

## 🛠️ Failure Engineering & Resilience

Unlike basic bookmark apps, this version is hardened for production:

1. **Robust URL Validation**: Server-side validation using the native `URL` constructor with protocol sanitization.
2. **Exponential Backoff**: Title fetching utilities wait 1s, then 2s for transient 5xx errors before falling back to domain names.
3. **Insert Race Guards**: Database-level unique constraints (`user_id`, `url`) prevent duplicate bookmarks even during concurrent requests.
4. **Resilient fetching**: AbortControllers enforce strict 5s timeouts on metadata fetches to prevent server-side hanging.

---

## 💻 Tech Stack

- **Core**: Next.js 15 (App Router, Server Actions)
- **Styling**: Tailwind CSS 4.0, Framer Motion
- **Database/Auth**: Supabase (PostgreSQL, SSR)
- **Icons**: Lucide React
- **Date Handling**: date-fns

---

## 🏁 Getting Started

### 1. Database Setup

Run the following in your Supabase SQL Editor:

```sql
-- Create table with unique constraint
create table bookmarks (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  user_id uuid references auth.users not null,
  title text not null,
  url text not null,
  unique(user_id, url)
);

-- Enable RLS
alter table bookmarks enable row level security;

-- Policies
create policy "Users can manage their own bookmarks"
on bookmarks for all
using ( auth.uid() = user_id );

-- Enable Realtime
alter publication supabase_realtime add table bookmarks;
```

### 2. Environment Configuration

Create a `.env.local` file:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 3. Install & Run

```bash
npm install
npm run dev
```

---

## 📜 License
MIT License - feel free to use this as a boilerplate for your own productivity tools.
