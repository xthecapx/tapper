# Tapper Tracker 🍔

A simple app to track daily eating habits with your friends. Mark "tapper" days when someone eats badly, and keep everyone accountable!

## Features

- **User Authentication**: Secure login with Supabase Auth
- **Real-time Tracking**: See updates instantly when someone marks a tapper day
- **Weekly View**: Track the last 7 days for all users
- **Simple Interface**: Click to mark tapper days with intuitive emojis

## Quick Setup

### 1. Environment Variables

Update your `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 2. Database Setup

Run the migration in your Supabase dashboard:
- Go to SQL Editor in your Supabase dashboard
- Copy and paste the contents of `supabase/migrations/20231201000000_tapper_tracking.sql`
- Run the migration

### 3. Run the App

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` and start tracking!

## How It Works

1. **Sign Up**: Each user creates an account
2. **Track Daily**: Click the circles to mark tapper days (🍔) or clean days (✅)
3. **Stay Accountable**: Everyone can see everyone else's eating habits
4. **Real-time Updates**: Changes appear instantly for all users

## Database Schema

- **users**: User profiles linked to Supabase Auth
- **tapper_logs**: Daily eating logs with user, date, and tapper status

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Deployment**: Ready for Vercel

## Deploy

This app is ready to deploy on Vercel with the Supabase integration.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

Just connect your repository and add your Supabase environment variables!
