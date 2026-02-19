# 🔖 Smart Bookmark Manager

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-blueviolet?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

A high-performance, resilient, and beautifully designed link management system. Built with a focus on speed, reliability, and modern developer aesthetics.

> **Design Philosophy**: Minimalist SaaS aesthetic, inspired by tools like Raycast and Vercel.

---

## 🚀 Key Features

- **⚡ Real-time Sync**: Bi-directional data flow using Supabase WebSockets (Realtime). No refresh needed.
- **🛡️ Failure Engineering**: (See below) Built to handle the "ugly" side of the web.
- **🏗️ Metadata Fetching**: Automatic title extraction from URLs with exponential backoff retries.
- **🎨 Premium UI**: 
  - Dynamic 3-column grid for maximum readability.
  - Custom-built Toast notification system (Top-Center).
  - Raycast-inspired cards with hover micro-interactions.
- **🔒 Secure by Design**:
  - Row Level Security (RLS) ensures users can *only* interact with their own data.
  - Hardened Auth Callbacks (Open-redirect protection).

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
