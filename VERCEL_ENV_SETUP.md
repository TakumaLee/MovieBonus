# Vercel Environment Variables Setup

## Required Environment Variables

Please add the following environment variables in your Vercel project settings:

### 1. Go to Vercel Dashboard
Visit: https://vercel.com/nebula-proj/moviebonus-frontend/settings/environment-variables

### 2. Add Production Environment Variables

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://moviebonus-python-scrapers-777964931661.asia-east1.run.app
NEXT_PUBLIC_NODE_API_URL=https://moviebonus-nodejs-backend-777964931661.asia-east1.run.app
NEXT_PUBLIC_API_TIMEOUT=30000

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://ugacvqteeyyiujpyhqxq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVnYWN2cXRlZXl5aXVqcHlocXhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzczNzk5NTQsImV4cCI6MjA1Mjk1NTk1NH0.b_KbYK5gMTmezXsb6FT-ojJJUnEXmT8fQdNLbaBSkxI

# Admin Service Role Key (SENSITIVE - Required for middleware)
SUPABASE_SERVICE_ROLE_KEY=[YOUR_SERVICE_ROLE_KEY]

# Application Settings
NEXT_PUBLIC_APP_NAME=特典速報
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_APP_ENV=production

# Admin Configuration
NEXT_PUBLIC_ADMIN_PATH=/admin

# Feature Flags
NEXT_PUBLIC_ENABLE_SEARCH=true
NEXT_PUBLIC_ENABLE_CACHE=true
NEXT_PUBLIC_ENABLE_ANALYTICS=false

# Google Analytics (optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=

# Environment
NEXT_PUBLIC_ENVIRONMENT=production
NEXT_PUBLIC_DEBUG=false
NODE_ENV=production
```

### 3. Important Notes

1. **SUPABASE_SERVICE_ROLE_KEY**: This is required for the middleware to authenticate admin users. You can find this in your Supabase project settings under Settings > API > Service Role Key.

2. All variables starting with `NEXT_PUBLIC_` will be exposed to the browser, so don't put sensitive information in them.

3. After adding environment variables, you need to redeploy for them to take effect.

### 4. Redeploy After Adding Variables

Run this command after setting up environment variables:
```bash
vercel --prod
```

Or trigger a redeployment from the Vercel dashboard.

## Deployment URLs

- Production: https://moviebonus-frontend-1lytt981w-nebula-proj.vercel.app
- Vercel Dashboard: https://vercel.com/nebula-proj/moviebonus-frontend

## Features to Test After Deployment

1. **Homepage**: Should display movie listings
2. **Search**: Search functionality should work
3. **Movie Details**: Click on a movie to see details
4. **Admin Login**: Visit `/admin/login` to test admin features
5. **Feedback Form**: Test the feedback submission
6. **API Connection**: Ensure data is loading from the backend

## Troubleshooting

If you encounter issues:

1. Check the Vercel Functions logs for errors
2. Verify all environment variables are set correctly
3. Ensure the backend API is accessible from Vercel's servers
4. Check browser console for any client-side errors