# Tapper Tracker 🍔

A simple app to track daily eating habits with your friends. Mark "tapper" days when someone eats badly, and keep everyone accountable!

## Features

- **User Authentication**: Secure email-based login with Supabase Auth
- **Real-time Tracking**: See updates instantly when someone marks a tapper day
- **Weekly View**: Track the last 7 days for all users
- **Simple Interface**: Click to mark tapper days with intuitive emojis

## Quick Setup

### 1. Environment Variables

Create a `.env.local` file with your Supabase credentials:

```env
# Required Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Optional: Service Role Key (for advanced server-side operations)
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Site URL Configuration (important for auth redirects)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_SITE_URL=http://localhost:3000

# For production, add your domain URLs
# NEXT_REDIRECT_URLS=https://yourdomain.com/api/auth/callback,https://yourdomain.vercel.app/api/auth/callback
```

### 2. Supabase Auth Configuration

In your Supabase Dashboard, go to **Authentication > URL Configuration**:

#### Site URL
- **Development**: `http://localhost:3000`
- **Production**: `https://yourdomain.com` (your actual domain)

#### Redirect URLs
Add these URLs to allow auth redirects:

**For Development:**
- `http://localhost:3000/api/auth/callback`

**For Production:**
- `https://yourdomain.com/api/auth/callback`
- `https://yourdomain.vercel.app/api/auth/callback` (if using Vercel)

#### Email Settings
Make sure email authentication is enabled in **Authentication > Settings**:
- **Enable email confirmations**: ON (recommended)
- **Enable email change confirmations**: ON (recommended)

### 3. Database Setup

Run the migration in your Supabase dashboard:
- Go to **SQL Editor** in your Supabase dashboard
- Copy and paste the contents of `supabase/migrations/20231201000000_tapper_tracking.sql`
- Run the migration

### 4. Run the App

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` and start tracking!

## Authentication Flow

This app supports:
- **Email/Password** authentication
- **Magic Link** login (passwordless email login)
- **Email confirmations** for new signups
- **Password reset** via email

The auth flow uses proper redirect URLs to handle:
- Email confirmation links
- Magic link authentication
- Password reset confirmations

## How It Works

1. **Sign Up**: Each user creates an account via email
2. **Track Daily**: Click the circles to mark tapper days (🍔) or clean days (✅)
3. **Stay Accountable**: Everyone can see everyone else's eating habits
4. **Real-time Updates**: Changes appear instantly for all users

## Database Schema

- **users**: User profiles linked to Supabase Auth
- **tapper_logs**: Daily eating logs with user, date, and tapper status

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Authentication**: Supabase Auth with email-based authentication
- **Deployment**: Ready for Vercel

## Deploy

This app is ready to deploy on Vercel with the Supabase integration.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Deployment Checklist:

1. **Connect your repository** to Vercel
2. **Add environment variables** in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL` (your production domain)
3. **Update Supabase Auth settings**:
   - Site URL: `https://your-vercel-domain.vercel.app`
   - Redirect URLs: `https://your-vercel-domain.vercel.app/api/auth/callback`
4. **Deploy** and test authentication flow

## Troubleshooting

### Auth Issues
- Verify redirect URLs are correctly configured in Supabase Dashboard
- Check that `NEXT_PUBLIC_SITE_URL` matches your domain
- Ensure email confirmations are enabled in Auth settings
- Check your email for confirmation links

### Database Issues
- Run the latest migration in Supabase SQL Editor
- Check that RLS policies allow proper access
- Verify user profiles are created automatically on signup
