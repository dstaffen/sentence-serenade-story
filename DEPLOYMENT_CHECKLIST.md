
# Production Deployment Checklist

## Pre-Deployment

### 1. Environment Configuration
- [ ] Set up production Supabase project
- [ ] Configure production environment variables in Supabase Edge Function secrets:
  - [ ] `RESEND_API_KEY` for email notifications
  - [ ] Any additional API keys for integrations
- [ ] Update CORS settings in Supabase to include production domain
- [ ] Configure authentication providers and redirect URLs
- [ ] Set up custom domain (if applicable)

### 2. Database Setup
- [ ] Run all migrations in production Supabase project
- [ ] Verify Row Level Security (RLS) policies are properly configured
- [ ] Set up database backups (automated in Supabase Pro+)
- [ ] Configure connection pooling (handled by Supabase)
- [ ] Test database performance under load

### 3. Build Optimization
- [ ] Run `npm run build` and verify no errors
- [ ] Check bundle size and optimize if needed
- [ ] Verify all assets are properly optimized
- [ ] Test build locally with `npm run preview`

### 4. Security Configuration
- [ ] Review and update CORS headers in edge functions
- [ ] Implement rate limiting for email endpoints
- [ ] Verify all sensitive data is properly secured
- [ ] Review RLS policies for data access
- [ ] Test authentication flows

### 5. SEO and Meta Tags
- [ ] Update meta tags in index.html for production
- [ ] Add proper Open Graph tags
- [ ] Configure robots.txt
- [ ] Add sitemap.xml (if needed)
- [ ] Set up favicon and app icons

### 6. Performance
- [ ] Enable performance monitoring
- [ ] Configure error boundaries
- [ ] Test loading times
- [ ] Verify mobile responsiveness
- [ ] Test on different browsers

## Deployment

### 1. Lovable Deployment
- [ ] Click "Publish" in Lovable editor
- [ ] Verify deployment is successful
- [ ] Test all critical functionality on deployed site

### 2. Custom Domain (Optional)
- [ ] Configure DNS records
- [ ] Set up SSL certificate (automatic with Lovable)
- [ ] Update Supabase redirect URLs for new domain

### 3. Monitoring Setup
- [ ] Set up uptime monitoring
- [ ] Configure error tracking
- [ ] Set up performance monitoring
- [ ] Create alerts for critical issues

## Post-Deployment

### 1. Testing
- [ ] Test all user flows end-to-end
- [ ] Verify email notifications work
- [ ] Test story creation and completion
- [ ] Verify analytics tracking
- [ ] Test mobile experience

### 2. Documentation
- [ ] Update user documentation
- [ ] Create admin guide
- [ ] Document backup/recovery procedures
- [ ] Update API documentation (if applicable)

### 3. Monitoring
- [ ] Monitor error rates
- [ ] Check performance metrics
- [ ] Verify email delivery rates
- [ ] Monitor database performance

## Rollback Plan
- [ ] Document rollback procedure
- [ ] Keep previous version accessible
- [ ] Test rollback process in staging

## Emergency Contacts
- [ ] Define escalation procedures
- [ ] List emergency contacts
- [ ] Document incident response plan
