
# Environment Setup Guide

## Production Environment Variables

### Supabase Configuration
All sensitive configuration should be managed through Supabase Edge Function secrets, not environment variables in the frontend code.

#### Required Secrets in Supabase:
1. **RESEND_API_KEY**
   - Used for sending email notifications
   - Get from: https://resend.com/api-keys
   - Scope: Full access for sending emails

#### Setting Up Secrets:
1. Go to your Supabase dashboard
2. Navigate to Edge Functions > Settings
3. Add each secret in the "Function Secrets" section
4. Secrets are automatically available to all edge functions

### Frontend Configuration
The frontend uses hardcoded Supabase URLs and keys which are safe for public exposure:
- Supabase URL: Built into the client configuration
- Supabase Anon Key: Safe for frontend use (RLS protects data)

## Development vs Production

### Development
- Uses Supabase development project
- All console logs enabled
- Error details shown to users
- No rate limiting on emails

### Production
- Uses Supabase production project
- Console logs filtered
- Generic error messages for users
- Rate limiting enabled
- Performance monitoring active

## Database Configuration

### Connection Pooling
Supabase automatically handles connection pooling. No additional configuration needed.

### Backup Strategy
- **Automatic Backups**: Enabled on Supabase Pro+ plans
- **Point-in-Time Recovery**: Available for 7 days (Pro) or 30 days (Team+)
- **Manual Backups**: Can be triggered via Supabase dashboard

### Performance Optimization
- **Row Level Security**: Properly configured for all tables
- **Indexes**: Auto-created for foreign keys and commonly queried fields
- **Query Optimization**: Use Supabase's query analysis tools

## Email Configuration

### Resend Setup
1. Create account at https://resend.com
2. Verify your domain at https://resend.com/domains
3. Generate API key at https://resend.com/api-keys
4. Add to Supabase Edge Function secrets

### Rate Limiting
- Resend free tier: 3,000 emails/month
- Resend paid tiers: Higher limits available
- Application has built-in error handling for rate limits

## Security Considerations

### CORS Configuration
Edge functions include proper CORS headers:
```javascript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}
```

### Data Protection
- All user data protected by Row Level Security
- No sensitive data in frontend code
- API keys stored securely in Supabase secrets

### Authentication
- Uses Supabase Auth (if implemented)
- Secure session management
- Proper logout handling

## Monitoring and Alerts

### Performance Monitoring
- Built-in performance tracking
- Core Web Vitals monitoring
- Error boundary reporting

### Uptime Monitoring
Consider setting up external monitoring:
- Pingdom
- UptimeRobot
- StatusPage

### Error Tracking
For production, consider:
- Sentry for error tracking
- LogRocket for session replay
- Custom analytics integration

## Scaling Considerations

### Database Scaling
- Supabase handles auto-scaling
- Monitor query performance in dashboard
- Consider read replicas for high-traffic scenarios

### Edge Function Scaling
- Automatically scales with Supabase
- Monitor execution times and memory usage
- Consider splitting large functions

### Storage Scaling
- Supabase storage auto-scales
- Monitor storage usage in dashboard
- Implement file cleanup if needed

## Backup and Recovery

### Database Recovery
1. Access Supabase dashboard
2. Go to Settings > Database
3. Use Point-in-Time Recovery for recent data
4. Use full backups for older recovery points

### Application Recovery
1. Redeploy from Lovable
2. Verify all environment variables
3. Test critical functionality
4. Monitor for any issues

### Emergency Procedures
1. **Site Down**: Check Supabase status, redeploy if needed
2. **Database Issues**: Use Supabase support, implement read-only mode
3. **Email Issues**: Check Resend status, implement fallback notifications
4. **High Load**: Monitor Supabase metrics, consider upgrading plan
