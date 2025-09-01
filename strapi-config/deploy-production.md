# Production Deployment Guide

## 1. Strapi Deployment (Railway.app)

### Prerequisites
- Railway CLI installed
- GitHub repository for Strapi

### Steps

1. **Initialize Railway Project**
```bash
cd cms-ozlem-murzoglu
railway login
railway init
```

2. **Add PostgreSQL Database**
```bash
railway add postgresql
```

3. **Set Environment Variables**
```bash
railway variables set HOST=0.0.0.0
railway variables set NODE_ENV=production
railway variables set DATABASE_CLIENT=postgres
railway variables set DATABASE_HOST=${{PGHOST}}
railway variables set DATABASE_PORT=${{PGPORT}}
railway variables set DATABASE_NAME=${{PGDATABASE}}
railway variables set DATABASE_USERNAME=${{PGUSER}}
railway variables set DATABASE_PASSWORD=${{PGPASSWORD}}
railway variables set APP_KEYS=$(openssl rand -base64 32),$(openssl rand -base64 32)
railway variables set API_TOKEN_SALT=$(openssl rand -base64 16)
railway variables set ADMIN_JWT_SECRET=$(openssl rand -base64 32)
railway variables set JWT_SECRET=$(openssl rand -base64 32)
railway variables set TRANSFER_TOKEN_SALT=$(openssl rand -base64 16)
```

4. **Deploy**
```bash
railway up
```

5. **Get Public URL**
```bash
railway domain
```

## 2. Firebase Functions Deployment

### Prerequisites
- Firebase CLI installed
- Firebase project configured

### Steps

1. **Set Production Config**
```bash
cd functions
firebase functions:config:set \
  strapi.base_url="https://your-strapi-url.railway.app" \
  strapi.api_token="your-production-api-token" \
  strapi.webhook_secret="your-webhook-secret"
```

2. **Install Dependencies**
```bash
npm install
```

3. **Build Functions**
```bash
npm run build
```

4. **Deploy to Production**
```bash
firebase deploy --only functions --project dr-murzoglu
```

5. **Verify Deployment**
```bash
firebase functions:log --project dr-murzoglu
```

## 3. Angular App Configuration

### Update Environment Files

1. **environment.prod.ts**
```typescript
export const environment = {
  production: true,
  firebase: {
    // existing config
  },
  functionsUrl: 'https://europe-west1-dr-murzoglu.cloudfunctions.net',
  strapiUrl: 'https://cms-ozlem-murzoglu.railway.app',
  useCms: true // Enable CMS in production
};
```

2. **Build Angular App**
```bash
npm run build:prod
```

3. **Deploy to Firebase Hosting**
```bash
firebase deploy --only hosting --project dr-murzoglu
```

## 4. Post-Deployment Tasks

### 1. Create Strapi Admin User
- Navigate to: https://your-strapi-url.railway.app/admin
- Create first admin user

### 2. Generate API Token
1. Go to Settings > API Tokens
2. Create new token with appropriate permissions
3. Update Firebase Functions config with the token

### 3. Configure Webhook
1. Go to Settings > Webhooks
2. Add webhook URL: https://europe-west1-dr-murzoglu.cloudfunctions.net/strapiWebhook
3. Add secret header: x-strapi-signature
4. Select events to trigger

### 4. Import Content
```bash
STRAPI_URL=https://your-strapi-url.railway.app \
STRAPI_API_TOKEN=your-token \
node import-content.js
```

### 5. Test Integration
```bash
# Test Firebase Functions
curl https://europe-west1-dr-murzoglu.cloudfunctions.net/getCategories?locale=tr

# Test Strapi API
curl https://your-strapi-url.railway.app/api/resources
```

## 5. Monitoring & Maintenance

### Health Checks
- **Strapi**: https://your-strapi-url.railway.app/_health
- **Firebase Functions**: Firebase Console > Functions > Logs
- **Angular App**: Firebase Console > Hosting

### Backup Strategy
1. **Database Backup** (Railway)
   - Automatic daily backups
   - Manual backup before major updates

2. **Media Backup**
   - Configure Cloudinary or S3
   - Regular export of uploads folder

3. **Content Export**
   ```bash
   # Export all content
   STRAPI_API_TOKEN=your-token node export-content.js
   ```

### SSL/TLS
- Railway: Automatic SSL with Let's Encrypt
- Firebase: Automatic SSL for all domains

### Scaling
- **Railway**: Adjust dyno size in dashboard
- **Firebase Functions**: Auto-scaling based on load
- **CDN**: Firebase Hosting provides global CDN

## 6. Environment Variables Summary

### Strapi (Railway)
```
NODE_ENV=production
HOST=0.0.0.0
PORT=1337
DATABASE_CLIENT=postgres
DATABASE_HOST=${PGHOST}
DATABASE_PORT=${PGPORT}
DATABASE_NAME=${PGDATABASE}
DATABASE_USERNAME=${PGUSER}
DATABASE_PASSWORD=${PGPASSWORD}
APP_KEYS=<generated>
API_TOKEN_SALT=<generated>
ADMIN_JWT_SECRET=<generated>
JWT_SECRET=<generated>
TRANSFER_TOKEN_SALT=<generated>
```

### Firebase Functions
```
strapi.base_url=https://your-strapi-url.railway.app
strapi.api_token=<from-strapi-admin>
strapi.webhook_secret=<generated>
```

### Angular App
```
production=true
functionsUrl=https://europe-west1-dr-murzoglu.cloudfunctions.net
strapiUrl=https://cms-ozlem-murzoglu.railway.app
useCms=true
```

## 7. Rollback Plan

### If deployment fails:
1. **Strapi**: Railway dashboard > Deployments > Rollback
2. **Firebase Functions**: `firebase functions:delete <function-name>`
3. **Angular**: `firebase hosting:rollback`

### Disable CMS temporarily:
```typescript
// environment.prod.ts
useCms: false // Switch back to JSON files
```

## 8. Cost Estimation

### Monthly Costs (Estimated)
- **Railway (Strapi + PostgreSQL)**: $5-20/month
- **Firebase Functions**: Free tier (2M invocations)
- **Firebase Hosting**: Free tier
- **Total**: ~$5-20/month

## 9. Security Checklist

- [ ] API tokens are secure and not committed to git
- [ ] Webhook secrets are configured
- [ ] CORS is properly configured
- [ ] Rate limiting is enabled
- [ ] SSL/TLS is active on all endpoints
- [ ] Database backups are configured
- [ ] Error monitoring is set up
- [ ] Access logs are enabled