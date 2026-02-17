# Smart Bookmark App

A simple, real-time bookmark manager built with Next.js 14, Supabase, and Tailwind CSS.

## Features

- **Google OAuth Authentication**: Secure login with no passwords.
- **Private Bookmarks**: Each user has their own isolated list of bookmarks.
- **Realtime Updates**: Bookmarks sync instantly across devices and tabs without refreshing.
- **Optimistic UI**: Instant feedback when adding or deleting bookmarks.
- **Responsive Design**: Works on Desktop, Tablet, and Mobile.
- **Dark Mode Support**: Styled for both light and dark environments.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS, Framer Motion
- **Backend / Database**: Supabase (PostgreSQL, Auth, Realtime)
- **Deployment**: Vercel

## Setup Instructions

### 1. Clone the repository
```bash
git clone <repository-url>
cd smart-bookmark-app
npm install
```

### 2. Set up Supabase

1. Create a new project on [Supabase](https://supabase.com/).
2. Go to **Authentication -> Providers** and enable **Google**.
   - You will need a Google Cloud Project to get the `Client ID` and `Client Secret`.
   - Set the Authorized Redirect URI in Google Console to `https://<your-project>.supabase.co/auth/v1/callback`.
3. Go to **SQL Editor** in Supabase and run the content of `supabase/schema.sql`. This will create the table and RLS policies.
4. Get your project credentials from **Project Settings -> API**.

### 3. Configure Environment Variables

Rename `.env.local.example` to `.env.local` and add your keys:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Deployment on Vercel

1. Push your code to a GitHub repository.
2. Import the project in Vercel.
3. Add the `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` as Environment Variables in Vercel.
4. **Important**: Add your Vercel deployment domain (e.g., `https://my-app.vercel.app`) to the **Redirect URLs** in Supabase Auth settings.

## Challenges & Solutions

- **Realtime Sync**: Leveraged Supabase's `realtime` channel to listen for `INSERT` and `DELETE` events on the client side, keeping the UI in sync without manual refetching.
- **RLS Security**: Implemented strict Row Level Security policies to ensure users can only access their own data, verified by passing the JWT from Supabase Auth.
- **Optimistic Updates**: Used local state updates immediately upon action to make the app feel faster, reverting only if the server action fails.
