# Nexora SMM

Reseller panel: user wallet, service catalog, orders, manual payments (bKash/Nagad/Rocket/Binance),
support tickets, reseller API (v2), admin panel, multi-provider sync.
Stack: Next.js 14 (App Router) + Prisma + Postgres + Tailwind. Deploys to Vercel.

## 1. Local setup
```bash
npm install
cp .env.example .env        # fill every value (see comments inside)
npm run db:push             # creates tables
npm run db:seed             # creates the admin from ADMIN_EMAIL / ADMIN_PASSWORD
npm run dev                 # http://localhost:3000
```
Generate secrets with `openssl rand -hex 32` (ENCRYPTION_KEY, AUTH_SECRET) and `openssl rand -hex 24` (CRON_SECRET).

## 2. First-time admin checklist
1. Log in with the admin account -> **Settings**: site name, currency, payment numbers.
2. **Providers** -> Add provider (API URL + key). Set margin % and rate multiplier (e.g. 120 if the provider prices in USD and you sell in BDT).
3. Click **Test connection**, then **Sync services**.
4. Place a tiny test order from a normal user account and watch it in **Admin -> Orders**.
5. Fund flow: user submits Transaction ID -> **Admin -> Payments** -> verify in your wallet app -> Approve.

## 3. Deploy (GitHub + Vercel)
1. Push to a **private** GitHub repo (`.env` is git-ignored).
2. Create a Postgres DB (Neon/Supabase). Run `npm run db:push` and `npm run db:seed` once from your machine against it.
3. Import the repo in Vercel, add the env vars from `.env.example` in Settings -> Environment Variables.
4. `vercel.json` registers two crons: order status sync (5 min) and service sync (6 h).
   Vercel Hobby only allows daily crons; use Pro, or call the cron URLs from cron-job.org / Upstash QStash
   with header `Authorization: Bearer <CRON_SECRET>`.

## 4. Reseller API
`POST /api/v2` with `key` + `action` = `services | add | status | balance` (form or JSON).
Users find their key under **API** in the dashboard.

## 5. Behaviour you should know
- Orders debit the wallet atomically; a repeated submit (same idempotency key) never double-charges.
- Provider says no -> auto refund. Timeout/unknown -> order stays "Pending" (PENDING_SUBMIT) and shows
  in Admin -> Overview -> "stuck". Check the provider panel before using Retry or Cancel.
- Partial/Canceled orders refund automatically, exactly once.
- Editing a service price in Admin -> Services locks it; provider syncs then keep your price.
- Login/register/API rate limits are in-memory (best effort on serverless).

## Not included
Automatic payment gateways (bKash API, Stripe), email notifications, 2FA, refill/cancel API actions,
provider failover routing. The schema has `Provider.priority` ready for failover.
