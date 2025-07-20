# MovieBonus Frontend Deployment Guide

This guide covers deployment options for the MovieBonus frontend application.

## Vercel Deployment (Recommended)

### Prerequisites
- GitHub repository with the frontend code
- Vercel account
- Backend API deployed and accessible

### Step-by-Step Deployment

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "feat: Add frontend integration and deployment config"
   git push origin main
   ```

2. **Connect to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Import your repository
   - Select the `frontend/MovieBonus` directory as the root

3. **Configure Environment Variables**
   In Vercel dashboard, add these environment variables:
   
   ```env
   NEXT_PUBLIC_API_URL=https://your-backend-api.vercel.app
   NEXT_PUBLIC_ENVIRONMENT=production
   NEXT_PUBLIC_DEBUG=false
   NODE_ENV=production
   ```

4. **Deploy**
   - Vercel will automatically deploy on every push to main
   - First deployment will take 2-3 minutes
   - Subsequent deployments are faster

### Build Configuration

The project includes:
- `vercel.json` - Vercel configuration
- `.env.production` - Production environment template
- Custom build settings for Next.js 15

### Domain Configuration

1. **Custom Domain** (Optional)
   - Go to Vercel dashboard → Settings → Domains
   - Add your custom domain
   - Update DNS records as instructed

2. **SSL Certificate**
   - Automatically provided by Vercel
   - No additional configuration needed

## Alternative Deployment Options

### Netlify

1. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Node version: 18.x

2. **Environment Variables**
   Same as Vercel configuration above

### Self-Hosted with Docker

1. **Create Dockerfile**
   ```dockerfile
   FROM node:18-alpine AS base
   
   # Install dependencies only when needed
   FROM base AS deps
   RUN apk add --no-cache libc6-compat
   WORKDIR /app
   
   COPY package.json package-lock.json* ./
   RUN npm ci
   
   # Rebuild the source code only when needed
   FROM base AS builder
   WORKDIR /app
   COPY --from=deps /app/node_modules ./node_modules
   COPY . .
   
   RUN npm run build
   
   # Production image, copy all the files and run next
   FROM base AS runner
   WORKDIR /app
   
   ENV NODE_ENV=production
   
   RUN addgroup --system --gid 1001 nodejs
   RUN adduser --system --uid 1001 nextjs
   
   COPY --from=builder /app/public ./public
   
   # Set the correct permission for prerender cache
   RUN mkdir .next
   RUN chown nextjs:nodejs .next
   
   COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
   COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
   
   USER nextjs
   
   EXPOSE 3000
   
   ENV PORT=3000
   
   CMD ["node", "server.js"]
   ```

2. **Build and Run**
   ```bash
   docker build -t moviebonus-frontend .
   docker run -p 3000:3000 moviebonus-frontend
   ```

## Environment Configuration

### Development
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_ENVIRONMENT=development
NEXT_PUBLIC_DEBUG=true
```

### Staging
```env
NEXT_PUBLIC_API_URL=https://staging-api.moviebonus.app
NEXT_PUBLIC_ENVIRONMENT=staging
NEXT_PUBLIC_DEBUG=true
```

### Production
```env
NEXT_PUBLIC_API_URL=https://api.moviebonus.app
NEXT_PUBLIC_ENVIRONMENT=production
NEXT_PUBLIC_DEBUG=false
```

## Performance Optimizations

### Build Optimizations
- Next.js automatic code splitting
- Image optimization with next/image
- Static generation for improved performance
- Bundle analyzer for size monitoring

### Runtime Optimizations
- Client-side caching for API responses
- Lazy loading for components
- Prefetching for navigation
- Service worker for offline support (optional)

## Monitoring and Analytics

### Vercel Analytics
- Enable in Vercel dashboard
- Provides Core Web Vitals
- Real User Monitoring (RUM)

### Custom Monitoring
Add monitoring services:
- Sentry for error tracking
- Google Analytics for user behavior
- New Relic for performance monitoring

## Troubleshooting

### Common Deployment Issues

1. **Build Failures**
   ```bash
   # Check for TypeScript errors
   npm run typecheck
   
   # Check for lint errors
   npm run lint
   
   # Test local build
   npm run build
   ```

2. **API Connection Issues**
   - Verify `NEXT_PUBLIC_API_URL` is correct
   - Check backend API CORS settings
   - Ensure backend is accessible from deployment environment

3. **Environment Variable Issues**
   - Verify all required variables are set
   - Check variable names (must start with `NEXT_PUBLIC_`)
   - Redeploy after variable changes

4. **Performance Issues**
   - Enable Vercel Analytics
   - Check bundle size with `npm run build`
   - Optimize images and assets
   - Review API response times

### Getting Help

1. **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
2. **Next.js Documentation**: [nextjs.org/docs](https://nextjs.org/docs)
3. **Project Issues**: Check backend API logs
4. **Community Support**: Next.js Discord, Stack Overflow

## Security Considerations

### Environment Variables
- Never expose sensitive data in `NEXT_PUBLIC_` variables
- Use server-side API routes for sensitive operations
- Implement proper CORS settings in backend

### Content Security Policy
Configure CSP headers in `next.config.ts`:
```javascript
const nextConfig = {
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'Content-Security-Policy',
          value: "default-src 'self'; script-src 'self' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
        }
      ]
    }
  ]
};
```

### HTTPS
- Always use HTTPS in production
- Vercel provides automatic SSL
- Redirect HTTP to HTTPS

## Maintenance

### Regular Updates
- Update dependencies monthly
- Monitor security advisories
- Test deployments in staging first

### Backup Strategy
- Git repository is primary backup
- Vercel maintains deployment history
- Consider database backups for user data

### Rollback Procedure
1. Go to Vercel dashboard
2. Select previous deployment
3. Click "Promote to Production"
4. Verify functionality

This completes the deployment configuration for the MovieBonus frontend!