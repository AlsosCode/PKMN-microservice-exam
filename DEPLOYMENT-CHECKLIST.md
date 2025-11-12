# Deployment Checklist

Use this checklist to deploy your application to production.

## Pre-Deployment

- [x] Code is pushed to GitHub
- [x] All tests pass locally
- [x] Docker images build successfully
- [x] Application runs correctly with `docker compose up`

## CloudAMQP Setup (RabbitMQ)

- [x] CloudAMQP account created
- [x] Free "Little Lemur" instance created
- [x] Note down credentials:
  - [x] Hostname: `kebnekaise-01.lmq.cloudamqp.com`
  - [x] Username: `zcoegfov`
  - [x] Password: `lGnFTh2MkfHdFsee6QzCq3D9yRzNy3Yk`
  - [x] AMQP URL: `amqps://zcoegfov:lGnFTh2MkfHdFsee6QzCq3D9yRzNy3Yk@kebnekaise.lmq.cloudamqp.com/zcoegfov`

## Render Backend Deployment

- [x] Render account created
- [x] PostgreSQL databases created:
  - [x] `catalog-db` created
    - Internal Database URL `postgresql://catalog_db_wpol_user:bSujYnIDCTLxcrpegTRVR63BGK62SQII@dpg-d4a5g195pdvs73e0hii0-a/catalog_db_wpol`
    - Hostname `dpg-d4a5g195pdvs73e0hii0-a`
    - Port `5432`
    - Database name `catalog_db_wpol`
    - Username `catalog_db_wpol_user`
    - Password `bSujYnIDCTLxcrpegTRVR63BGK62SQII`
  - [x] `collection-db` created
    - Internal Database URL `postgresql://collection_db_cu8y_user:3XMX9siiVcRMdGzWT0NkBpuz50QmKtdk@dpg-d4a5nver433s73ee46t0-a/collection_db_cu8y`
    - Hostname `dpg-d4a5nver433s73ee46t0-a`
    - Port `5432`
    - Database name `collection_db_cu8y`
    - Username `collection_db_cu8y_user`
    - Password `3XMX9siiVcRMdGzWT0NkBpuz50QmKtdk`
- [x] Redis instance created
  - Internal Redis URL: `redis://red-d4a5qv0gjchc73fgkgpg:6379`
- [ ] Services deployed:
  - [ ] API Gateway deployed
  - [ ] Catalog Service deployed
  - [ ] Collection Service deployed
  - [ ] Media Service deployed
- [ ] All environment variables configured
- [ ] All services showing "Live" status
- [ ] Health checks passing

### Note Service URLs

- API Gateway URL: `https://_____________________.onrender.com`
- Media Service URL: `https://_____________________.onrender.com`

## Frontend Configuration

- [ ] Updated `frontend/app.js` with production URLs
- [ ] Tested CORS configuration
- [ ] Changes committed and pushed to GitHub

## Vercel Frontend Deployment

- [ ] Vercel account created
- [ ] GitHub repository connected
- [ ] Project deployed from `frontend/` directory
- [ ] Deployment successful
- [ ] Site is live

### Frontend URL

- Vercel URL: `https://_____________________.vercel.app`

## Testing

- [ ] Frontend loads successfully
- [ ] Can view catalog
- [ ] Can add cards to collection
- [ ] Can view collection
- [ ] Can delete cards from collection
- [ ] Progress tracking works
- [ ] Dark mode toggle works
- [ ] Search and filters work

## Post-Deployment

- [ ] Share URLs with team/examiner
- [ ] Document any issues encountered
- [ ] Add deployment URLs to README.md

## Troubleshooting

If something doesn't work:

1. **Check Render logs** for each service
2. **Check browser console** for frontend errors
3. **Test API endpoints directly** using browser or Postman
4. **Verify CORS** is configured correctly
5. **Check environment variables** are set

## Free Tier Limitations

⚠️ Remember:
- Render free services **sleep after 15 minutes** of inactivity
- First request after sleep takes **30-50 seconds** (cold start)
- This is normal for free tier!

## Optional Enhancements

- [ ] Add custom domain to Vercel
- [ ] Set up monitoring (Sentry)
- [ ] Configure custom CORS domains
- [ ] Add GitHub Actions for CI/CD
- [ ] Set up database backups

---

**Deployment Date**: ___________

**Status**: ✅ Deployed  |  ⏳ In Progress  |  ❌ Issues

**Notes**:
