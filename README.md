# E-Commerce Platform - Production Deployment Guide

A production-ready, full-stack e-commerce platform built with Next.js, Node.js (Express), TypeScript, Prisma, and PostgreSQL.

This guide details how to deploy the application in a split architecture using **Vercel** (Frontend), **Render** (Backend), and **Neon** (PostgreSQL Database).

---

## 1. Environment Configurations
Three environment templates have been provided in the root directory:
- `.env.example`: For local development.
- `.env.staging`: For staging deployments.
- `.env.production`: For live production environments.

You must configure these variables in the dashboards of your hosting providers.

**Critical Backend Environment Variables (Render)**
- `NODE_ENV`: Set to `production`.
- `FRONTEND_URL`: The exact domain of your deployed Vercel app (e.g., `https://my-store.vercel.app`). **Required for CORS and Auth cookies.**
- `DATABASE_URL`: Connection string to your Neon database (ensure `sslmode=require` is appended).
- `JWT_SECRET`: A secure random string for JWT signing.
- `JWT_COOKIE_EXPIRES_IN`: Days until cookie expires (e.g., `90`).
- Stripe keys (`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`) and Cloudinary keys.

**Critical Frontend Environment Variables (Vercel)**
- `NEXT_PUBLIC_API_URL`: The exact domain of your deployed Render backend (e.g., `https://ecommerce-api.onrender.com`).

---

## 2. Deploying the Database (Neon)
1. Create a new project in [Neon](https://neon.tech).
2. Copy the **Postgres connection string** (make sure it's the pooled connection or the direct connection depending on your preference, but direct is typically required for Prisma migrations).
3. Add `?sslmode=require` to the end if not already present.
4. Save this string for your Render environment variables as `DATABASE_URL`.

---

## 3. Deploying the Backend API (Render)
Render supports monorepos natively.

1. Connect your GitHub repository to Render and create a new **Web Service**.
2. **Root Directory**: Leave blank (root).
3. **Build Command**: `npm install && npm run build --workspace=apps/api && npx prisma migrate deploy --schema=apps/api/prisma/schema.prisma`
4. **Start Command**: `npm run start --workspace=apps/api`
5. **Environment Variables**: Add all the variables from your `.env.production` file.
6. **Advanced Settings**: Render automatically sits behind a load balancer. The Express app is pre-configured with `app.set('trust proxy', 1)` to handle secure cookies properly.

> **Note:** The Build Command ensures dependencies are installed, TypeScript is compiled, and production database migrations are applied to Neon before the server starts.

---

## 4. Deploying the Frontend Web App (Vercel)
1. Connect your GitHub repository to [Vercel](https://vercel.com) and import the project.
2. **Framework Preset**: Vercel should automatically detect `Next.js`.
3. **Root Directory**: Click "Edit" and select `apps/web`.
4. **Build Command**: (Leave default, Vercel will automatically run `next build`).
5. **Environment Variables**: Add `NEXT_PUBLIC_API_URL` pointing to your Render Web Service URL.
6. Click **Deploy**.

> **Note:** Due to cross-domain deployment (Vercel domain vs. Render domain), the backend is configured to use `SameSite: 'none'` and `Secure: true` for the JWT cookies. This ensures authentication persists across domains smoothly.

---

## 5. Stripe Webhooks Setup
To automatically fulfill orders upon successful payment:
1. Go to the [Stripe Developer Dashboard](https://dashboard.stripe.com/webhooks).
2. Click **Add an endpoint**.
3. Endpoint URL: `https://<YOUR_RENDER_URL>/api/webhooks/stripe`
4. Select events to listen to: `checkout.session.completed` (and optionally `payment_intent.succeeded`, `payment_intent.payment_failed`).
5. Click **Add endpoint**.
6. Reveal the **Signing secret** and update your Render `STRIPE_WEBHOOK_SECRET` environment variable with this value.

---

## 6. Verification & Health Checks
After both services are live, you can verify their connection:
1. **API Health Check**: Navigate to `https://<YOUR_RENDER_URL>/api/health`. You should receive a `{"status":"UP", "database":"Connected"}` JSON response.
2. **Frontend Validation**: Go to your Vercel URL. You should see products (if seeded). Try logging in and creating a mock order to verify cookies and checkout flow.
