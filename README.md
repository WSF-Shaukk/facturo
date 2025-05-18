# Facturo.africa - Invoice Generator

A professional invoice generation application built with Next.js, Supabase, and Stripe.

## Production Deployment Guide

### Prerequisites

1. A Vercel account (https://vercel.com)
2. A production Supabase project (https://supabase.com)
3. A Stripe account with production API keys (https://stripe.com)

### Environment Variables

Set the following environment variables in your Vercel project settings:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-production-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-supabase-anon-key

# Stripe
STRIPE_SECRET_KEY=your-production-stripe-secret-key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-production-stripe-publishable-key
STRIPE_WEBHOOK_SECRET=your-production-stripe-webhook-secret

# Site URL (Important for authentication callbacks)
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

### Supabase Production Setup

1. Create a new Supabase project for production
2. Run the migrations in the `supabase/migrations` folder
3. Set up the storage buckets:
   - Create `invoice-logos` bucket for invoice logos
4. Configure authentication providers:
   - Enable Email/Password sign-in
   - Enable Google OAuth (if using)
   - Set up production redirect URLs in authentication settings

### Stripe Production Setup

1. Switch to Stripe production mode
2. Update webhook endpoints to your production URL
3. Configure products and prices for Pro subscription
4. Update price IDs in the code if they differ from development

### Deployment Steps

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables in Vercel
4. Deploy the application
5. Set up custom domain (if needed)
6. Test the production deployment:
   - User registration/login
   - Invoice creation
   - Logo upload
   - Pro subscription
   - PDF generation

### Post-Deployment Checklist

- [ ] Verify all authentication flows
- [ ] Test invoice creation and storage
- [ ] Confirm logo upload functionality
- [ ] Test Stripe subscription process
- [ ] Verify PDF generation and download
- [ ] Check email notifications (if configured)
- [ ] Monitor error logging
- [ ] Set up analytics (optional)

### Production Monitoring

- Set up error tracking (e.g., Sentry)
- Monitor Supabase database usage
- Track Stripe webhook events
- Set up uptime monitoring

### Backup and Security

- Enable Supabase database backups
- Regularly backup storage buckets
- Monitor authentication logs
- Keep dependencies updated

### Support and Maintenance

- Monitor server logs
- Set up status page (optional)
- Create support documentation
- Plan regular maintenance windows

## Development

To run the project locally:

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run the development server
npm run dev
```

## License

[Your License Here]
