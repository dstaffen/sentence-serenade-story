
# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability, please send an email to security@yourdomain.com. All security vulnerabilities will be promptly addressed.

Please include the following information:
- Type of issue (e.g. buffer overflow, SQL injection, cross-site scripting, etc.)
- Full paths of source file(s) related to the manifestation of the issue
- The location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit the issue

## Security Measures

### Data Protection
- All user data is protected by Supabase Row Level Security (RLS)
- Email addresses are encrypted in transit and at rest
- No sensitive data is stored in frontend code
- API keys are securely managed through Supabase Edge Function secrets

### Authentication & Authorization
- Secure session management through Supabase Auth
- Proper access controls on all database operations
- Rate limiting on email sending functions
- CORS properly configured for all endpoints

### Infrastructure Security
- HTTPS enforced for all connections
- Security headers implemented (CSP, HSTS, etc.)
- Regular dependency updates
- Automated security scanning

## Best Practices for Users

### For Game Hosts
- Use strong, unique passwords for your accounts
- Don't share participation links publicly
- Be cautious about who you invite to games
- Report any suspicious activity immediately

### General Security
- Keep your browser updated
- Be cautious about clicking links in emails
- Report any suspicious emails claiming to be from our service
- Use reputable antivirus software

## Data Handling

### What We Collect
- Email addresses for game notifications
- Game content (stories and sentences)
- Basic analytics data (completion rates, etc.)

### What We Don't Collect
- Passwords (handled by Supabase Auth)
- Personal information beyond email
- Tracking data across other sites
- Financial information

### Data Retention
- Game data is retained for the lifetime of the game
- Expired games may be automatically cleaned up after 1 year
- Users can request data deletion at any time

## Incident Response

In case of a security incident:
1. Immediate assessment and containment
2. Investigation and root cause analysis
3. User notification if data was compromised
4. Implementation of preventive measures
5. Post-incident review and improvements

## Third-Party Services

We use the following trusted third-party services:
- **Supabase**: Database and authentication
- **Resend**: Email delivery
- **Lovable**: Hosting and deployment

All third-party services are regularly reviewed for security compliance.
